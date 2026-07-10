
function calculateHaversineDistance(coord1, coord2) {
  const earthRadius = 6371000; // Earth's radius in meters (approximate)

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  const lat1 = toRadians(coord1[0]);
  const lon1 = toRadians(coord1[1]);
  const lat2 = toRadians(coord2[0]);
  const lon2 = toRadians(coord2[1]);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

tmpl.Measure.measure = function (param) {
	
	var mapObj = param.map;
	var measureType = param.type;
	var lineColor = param.lineColor;
	var callBack = param.callBack;
	var draw = param.draw;
	var select = param.select;
	var selectE = param.selectE;
	try {

		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}

		
		if (measureType === null || measureType === undefined || measureType === '' || measureType === "" ) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid measureType value' };
		}
		
	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			
			mapObj.removeInteraction(draw);
			mapObj.removeInteraction(select);

			mapObj.removeInteraction(selectE);

			if (lineColor == undefined) {
				lineColor = 'rgba(0, 0, 0, 0.5)';
			}

			tmpl.Measure.clear({ map: mapObj });
			
			var source = new ol.source.Vector();
			vectorMeasureLayer = new ol.layer.Vector({
				source: source,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						color: '#008000',
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: '#008000'
						})
					})
				})
			});
			vectorMeasureLayer.setProperties({ lname: "vectorMeasureLayer" });
			var sketch;
			var measureTooltipElement, measureTooltip;
			var pointerMoveHandler = function (evt) {
				if (evt.dragging) {
					return;
				}
				var tooltipCoord = evt.coordinate;
				if (sketch) {
					var output;
					var geom = (sketch.getGeometry());
					if (geom instanceof ol.geom.Polygon) {
						output = formatArea((geom));
						tooltipCoord = geom.getInteriorPoint().getCoordinates();
					}
					else if (geom instanceof ol.geom.LineString) {
						output = formatLength((geom));
						tooltipCoord = geom.getLastCoordinate();
					}
					measureTooltipElement.innerHTML = output;
					measureTooltip.setPosition(tooltipCoord);
				}
			};
			mapObj.addLayer(vectorMeasureLayer);
			mapObj.on('pointermove', pointerMoveHandler);
			var typeSelect = measureType;

			function addMeasureInteraction(drawLayer) {
				var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');
				draw = new ol.interaction.Draw({
					source: source,
					type: /** @type {ol.geom.GeometryType} */ (type),
					style: new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
							color: lineColor,
							lineDash: [10, 10],
							width: 2
						}),
						image: new ol.style.Circle({
							radius: 5,
							stroke: new ol.style.Stroke({
								color: 'rgba(0, 0, 0, 0.7)'
							}),
							fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
							})
						})
					})
				});
				mapObj.addInteraction(draw);
				createMeasureTooltip();
				draw.on('drawstart', function (evt) {
					sketch = evt.feature;
				}, this);
				draw.on('drawend', function (evt) {
					measureTooltipElement.className = 'tooltipApi tooltip-static';
					measureTooltip.setOffset([0, -7]);
					sketch = null;
					measureTooltipElement = null;
					createMeasureTooltip();
					mapObj.removeInteraction(draw);
					// callBack();
				}, this);
			}
			
			function createMeasureTooltip() {
				if (measureTooltipElement) {
					measureTooltipElement.parentNode.removeChild(measureTooltipElement);
				}
				measureTooltipElement = document.createElement('div');
				measureTooltipElement.className = 'tooltipApi tooltip-measure';
				measureTooltip = new ol.Overlay({
					id: 'tooltip_OverlayID',
					element: measureTooltipElement,
					offset: [0, -15],
					positioning: 'bottom-center'
				});
				measureTooltip.setProperties({ olname: "measureToolTipOverlay" });
				mapObj.addOverlay(measureTooltip);

			}
			// var wgs84Sphere = new ol.Sphere(6378137);
			var wgs84Sphere;
			var formatLength = function (line) {
				var length;
				var coordinates = line.getCoordinates();
				length = 0;
				var sourceProj = mapObj.getView().getProjection();
				for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
					var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
					var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
					// length += wgs84Sphere.haversineDistance(c1, c2);
						// Example usage
					const coord1 = coordinates[i]; // Replace with actual coordinates
					const coord2 = coordinates[i + 1]; // Replace with actual coordinates

					length += calculateHaversineDistance(c1, c2);

					//console.log('Distance in meters:', length);
				}
				var output;
				//console.log("--",length);
				if (length > 100) {
					output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
				}
				else {
					output = (Math.round(length * 100) / 100) + ' ' + 'm';
				}
				return output;
			};
			var formatArea = function (polygon) {
				var sourceProj = mapObj.getView().getProjection();
				var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
					sourceProj, 'EPSG:3857'));
				 var rawArea = geom.getArea();
				var areaInSqKm = rawArea / 1000000; // 1 sq km = 1,000,000 sq m
                var areaInSqM = rawArea; // Area in square meters
           
                var output;
                if (areaInSqKm > 1) {
                    output = (Math.round(areaInSqKm * 100) / 100) + ' km<sup>2</sup>';
                } else {
                    output = (Math.round(areaInSqM * 100) / 100) + ' m<sup>2</sup>';
                }
				console.log("Area----:",output);
				return output;
			};
			addMeasureInteraction();
		}
		else {

			tmpl.Measure.clear({ map: mapObj });
			function createPoint(worldPosition) {
				var point = mapObj.entities.add({
					name: "Measurement",
					position: worldPosition,
					point: {
						color: Cesium.Color.BLACK,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			}
			var drawingMode = 'line';
			function drawShape(positionData) {
				console.log("positionData: ", positionData);
				var shape;
				if (drawingMode === 'line') {
					shape = mapObj.entities.add({
						name: "Measurement",
						polyline: {
							positions: positionData,
							clampToGround: true,
							width: 3,
							material: Cesium.Color.RED.withAlpha(0.9),
							outline: true,
							outlineColor: Cesium.Color.BLACK,
						}
					});
				}
				console.log(shape.polyline.positions);

				// Conversion to WGS84
				var ellipsoid = mapObj.scene.globe.ellipsoid;
				var cartographic = ellipsoid.cartesianArrayToCartographicArray(positionData);
				console.log("cartographic: ", cartographic);
				var latlng = [];


				if (cartographic.length > 1) {
					for (var i = 0; i < cartographic.length; i++) {
						var lon = Cesium.Math.toDegrees(cartographic[i].longitude);
						var lat = Cesium.Math.toDegrees(cartographic[i].latitude);
						latlng.push([lon, lat]);
					}
					console.log("latlng: ", latlng);
					var line = turf.lineString(latlng);
					var totalDist = turf.length(line, { units: 'kilometers' });
					var totalDistance = totalDist.toFixed(1)
					console.log("DISTANCE in kms: ", totalDist);

					var len = latlng.length;
					var lastpt = latlng[len - 1];
					var epLon = lastpt[0];
					var epLat = lastpt[1];
					console.log("Longitude: " + epLon + " Latitude: " + epLat);

					// Display distance at last point
					var point = mapObj.entities.add({
						name: "Measurement",
						position: Cesium.Cartesian3.fromDegrees(epLon, epLat),
						label: {
							text: totalDistance + "kms",
							font: '10pt sans-serif',
							horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
							fillColor: Cesium.Color.WHITE,
							outlineColor: Cesium.Color.BLACK,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 1.0,
							showBackground: true,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							// verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
							pixelOffset: new Cesium.Cartesian2(5, 10)
						}
					});
				}
				return shape;
			}

			var activeShapePoints = [];
			var activeShape;
			var floatingPoint;
			var handler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);
			var mapDivID = mapObj.container.id;
			var mapDiv = document.getElementById(mapDivID);

			function changePointer(movement) {
				mapDiv.style.cursor = "crosshair";
			}
			mapObj.canvas.addEventListener('mousemove', changePointer, false);

			handler.setInputAction(function (event) {
				if (!Cesium.Entity.supportsPolylinesOnTerrain(mapObj.scene)) {
					console.log('This browser does not support polylines on terrain.');
					return;
				}
				// We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
				// we get the correct point when mousing over terrain.
				// var earthPosition = mapObj.scene.pickPosition(event.position);
				var earthPosition = mapObj.camera.pickEllipsoid(event.position);
				// `earthPosition` will be undefined if our mouse is not over the globe.
				if (Cesium.defined(earthPosition)) {
					if (activeShapePoints.length === 0) {
						floatingPoint = createPoint(earthPosition);
						activeShapePoints.push(earthPosition);
						var dynamicPositions = new Cesium.CallbackProperty(function () {
							return activeShapePoints;
						}, false);
						activeShape = drawShape(dynamicPositions);
					}
					activeShapePoints.push(earthPosition);
					createPoint(earthPosition);
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

			handler.setInputAction(function (event) {
				if (Cesium.defined(floatingPoint)) {
					// var newPosition = mapObj.scene.pickPosition(event.endPosition);
					var newPosition = mapObj.camera.pickEllipsoid(event.endPosition);
					if (Cesium.defined(newPosition)) {
						floatingPoint.position.setValue(newPosition);
						activeShapePoints.pop();
						activeShapePoints.push(newPosition);
					}
				}
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			// Redraw the shape so it's not dynamic and remove the dynamic shape.
			function terminateShape() {
				mapDiv.style.cursor = "default";
				activeShapePoints.pop();
				drawShape(activeShapePoints);
				mapObj.entities.remove(floatingPoint);
				mapObj.entities.remove(activeShape);
				mapObj.trackedEntity = undefined;
				floatingPoint = undefined;
				activeShape = undefined;
				activeShapePoints = [];
				mapObj.canvas.removeEventListener('mousemove', changePointer, false);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
			}
			handler.setInputAction(function (event) {
				terminateShape();
			}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		}
	}
	catch (err) {
		console.error("ERROR Measure.measure: ", err);
	}

	return response = { status: true, message: 'Measure.measure API Enabled..' };
}
// ********************* SDK_MAP_API (7)Measure.area ********************* //
tmpl.Measure.area = function (param) {
	var mapObj = param.map;
	try {

		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  map Object' };

		}	

	} catch (error) {
		if (error instanceof Error) {
			// console.log(" tmpl.Measure.area     | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	if (appConfigInfo.mapDimension == '2D') {
		if (appConfigInfo.mapLib == 'ol7') {
			var b1 = document.createElement('button');
			b1.innerHTML = 'Measure area'
			b1.title = 'Measure area';
			b1.className = 'ol-map-measureAreabtn';
			//b1.style.position = 'relative';
			b1.style.backgroundColor = 'gray';
			b1.style.padding = '2px 2px';
			b1.style.textAlign = "center";
			b1.addEventListener('click', function () { tmpl.Measure.measureArea({ type: "area", map: mapObj }); });
			var md = new ol.control.Control({
				element: b1
			});
			mapObj.addControl(md);

			return {status : true, message : 'Measurearea executed successfully'}

		}
		if (appConfigInfo.mapLib == "leaflet") {


			// Create a Leaflet map instance
			// var map = L.map('map').setView([51.505, -0.09], 13);

			var b1 = document.createElement('button');
			b1.innerHTML = 'Measure area'
			b1.title = 'Measure area';
			b1.className = 'ol-map-measureAreabtn';
			// b1.style.position = 'relative';
			b1.style.backgroundColor = 'gray';
			b1.style.padding = '2px 2px';
			b1.style.textAlign = "center";
			b1.addEventListener('click', function () { tmpl.Measure.measureArea({ type: "area", map: mapObj }); });
			var md = new ol.control.Control({
				element: b1
			});
			mapObj.addControl(md);

			// Add a tile layer to the map
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
			}).addTo(mapObj);



			// Enable area measurement control
			var measurementControl = new L.Control.AreaSelect({
				position: 'topright',
			});
			measurementControl.addTo(mapObj);


			// Event listener for measurement completion
			mapObj.on('measure:created', function (e) {
				var area = e.layer._measurement.area; // Get the measured area
				console.log('Area:', area);
			})

		}
	}

	return response = { status: true, message: ' Measure.area API Enabled..' };
}


// ********************* SDK_MAP_API (7)Measure.measureArea ********************* //
tmpl.Measure.measureArea = function (param) {
	var mapObj = param.map;
	var map = mapObj;

	try {

		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };

		}	

	} catch (error) {
		if (error instanceof Error) {
			// console.log(" tmpl.Measure.area     | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	const source = new ol.source.Vector();
	const vector = new ol.layer.Vector({
		source: source,
		style: {
			'fill-color': 'rgba(255, 255, 255, 0.2)',
			'stroke-color': '#ffcc33',
			'stroke-width': 2,
			'circle-radius': 7,
			'circle-fill-color': '#ffcc33',
		},
	});


	/**
	 * Currently drawn feature.
	 * @type {import("../src/ol/Feature.js").default}
	 */
	let sketch;

	/**
	 * The help tooltip element.
	 * @type {HTMLElement}
	 */
	let helpTooltipElement;

	/**
	 * Overlay to show the help messages.
	 * @type {Overlay}
	 */
	let helpTooltip;

	/**
	 * The measure tooltip element.
	 * @type {HTMLElement}
	 */
	let measureTooltipElement;

	/**
	 * Overlay to show the measurement.
	 * @type {Overlay}
	 */
	let measureTooltip;

	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	const continuePolygonMsg = 'Click to continue drawing the polygon';

	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	//const continueLineMsg = 'Click to continue drawing the line';

	/**
	 * Handle pointer move.
	 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
	 */
	const pointerMoveHandler = function (evt) {
		if (evt.dragging) {
			return;
		}
		/** @type {string} */
		let helpMsg = 'Click to start drawing';

		if (sketch) {
			const geom = sketch.getGeometry();
			if (geom instanceof ol.geom.Polygon) {
				helpMsg = continuePolygonMsg;
			}
		}

		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);

		helpTooltipElement.classList.remove('hidden');
	};

	//map.addTo(vector);
	map.on('pointermove', pointerMoveHandler);

	map.getViewport().addEventListener('mouseout', function () {
		helpTooltipElement.classList.add('hidden');
	});

	//const typeSelect = document.getElementById('type');

	let draw; // global so we can remove it later

	/**
	 * Format length output.
	 * @param {LineString} line The line.
	 * @return {string} The formatted length.
	 */
	//   const formatLength = function (line) {
	// 	const length = ol.sphere.getLength(line);
	// 	let output;
	// 	if (length > 100) {
	// 	  output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
	// 	} else {
	// 	  output = Math.round(length * 100) / 100 + ' ' + 'm';
	// 	}
	// 	return output;
	//   };

	/**
	 * Format area output.
	 * @param {Polygon} polygon The polygon.
	 * @return {string} Formatted area.
	 */
	const formatArea = function (polygon) {
		const area = ol.sphere.getArea(polygon);
		let output;
		if (area > 10000) {
			output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
		} else {
			output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
		}
		return output;
	};

	function addInteraction() {
		//const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
		//const type = 'area';
		const type = 'Polygon';
		draw = new ol.interaction.Draw({
			source: source,
			type: type,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)',
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					lineDash: [10, 10],
					width: 2,
				}),
				// image: new ol.Feature.CircleStyle({
				//   radius: 5,
				//   stroke: new ol.style.Stroke({
				// 	color: 'rgba(0, 0, 0, 0.7)',
				//   }),
				//   fill: new ol.style.Fill({
				// 	color: 'rgba(255, 255, 255, 0.2)',
				//   }),
				// }),
			}),
		});
		map.addInteraction(draw);

		createMeasureTooltip();
		createHelpTooltip();

		let listener;
		draw.on('drawstart', function (evt) {
			// set sketch
			sketch = evt.feature;

			/** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
			let tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function (evt) {
				const geom = evt.target;
				let output;
				if (geom instanceof ol.geom.Polygon) {
					output = formatArea(geom);
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				}
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});
		});

		draw.on('drawend', function () {
			measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			measureTooltipElement = null;
			createMeasureTooltip();
			ol.Observable.unByKey(listener);
		});
	}

	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
		if (helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'ol-tooltip hidden';
		helpTooltip = new ol.Overlay({
			element: helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left',
		});
		map.addOverlay(helpTooltip);
	}

	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
		if (measureTooltipElement) {
			measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
		measureTooltip = new ol.Overlay({
			element: measureTooltipElement,
			offset: [0, -15],
			positioning: 'bottom-center',
			stopEvent: false,
			insertFirst: false,
		});
		map.addOverlay(measureTooltip);
	}

	/**
	 * Let user change the geometry type.
	 */
	//   typeSelect.onchange = function () {
	// 	map.removeInteraction(draw);
	// 	addInteraction();
	//   };

	addInteraction();


	//return response = { status: true, message: 'Measure.measureArea API Enabled..' };
}


// ********************* SDK_MAP_API (7)Measure.distance ********************* //
tmpl.Measure.distance = function (param) {
	var mapObj = param.map;
	var  type = param.type;
	// var map = mapObj;

	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  map Object' };

		}	

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	var b1 = document.createElement('button');
	b1.innerHTML = 'Measure Distance'
	b1.title = 'Measure Distance';
	b1.className = 'ol-map-measurebtn';

	b1.style.position = 'relative';

	b1.style.backgroundColor = 'gray';
	b1.style.padding = '2px 2px';
	b1.style.textAlign = "center";
	
	b1.addEventListener('click', function () { tmpl.Measure.measure({ type: "distance", map: mapObj }); });
	var md = new ol.control.Control({
		element: b1
	});
	
	mapObj.addControl(md)

	const source = new ol.source.Vector();
	const vector = new ol.layer.Vector({
		source: source,
		style: {
			'fill-color': 'rgba(255, 255, 255, 0.2)',
			'stroke-color': '#ffcc33',
			'stroke-width': 2,
			'circle-radius': 7,
			'circle-fill-color': '#ffcc33',
		},
	});


	/**
	 * Currently drawn feature.
	 * @type {import("../src/ol/Feature.js").default}
	 */
	let sketch;

	/**
	 * The help tooltip element.
	 * @type {HTMLElement}
	 */
	let helpTooltipElement;

	/**
	 * Overlay to show the help messages.
	 * @type {Overlay}
	 */
	let helpTooltip;

	/**
	 * The measure tooltip element.
	 * @type {HTMLElement}
	 */
	let measureTooltipElement;

	/**
	 * Overlay to show the measurement.
	 * @type {Overlay}
	 */
	let measureTooltip;

	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	// const continuePolygonMsg = 'Click to continue drawing the polygon';

	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	const continueLineMsg = 'Click to continue drawing the line';

	/**
	 * Handle pointer move.
	 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
	 */
	const pointerMoveHandler = function (evt) {
		if (evt.dragging) {
			return;
		}
		/** @type {string} */
		let helpMsg = 'Click to start drawing';

		if (sketch) {
			const geom = sketch.getGeometry();
			if (geom instanceof ol.geom.Polygon) {
				helpMsg = continueLineMsg;
			}
		}

		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);

		helpTooltipElement.classList.remove('hidden');
	};

	mapObj.on('pointermove', pointerMoveHandler);

	mapObj.getViewport().addEventListener('mouseout', function () {
		helpTooltipElement.classList.add('hidden');
	});

	const typeSelect = 'LineString';

	let draw; // global so we can remove it later

	/**
	 * Format length output.
	 * @param {LineString} line The line.
	 * @return {string} The formatted length.
	 */
	const formatLength = function (line) {
		const length = ol.sphere.getLength(line);
		let output;
		if (length > 100) {
			output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
		} else {
			output = Math.round(length * 100) / 100 + ' ' + 'm';
		}
		return output;
	};

	/**
	 * Format area output.
	 * @param {Polygon} polygon The polygon.
	 * @return {string} Formatted area.
	 */
	const formatArea = function (polygon) {
		const area = ol.sphere.getArea(polygon);
		let output;
		if (area > 10000) {
			output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
		} else {
			output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
		}
		return output;
	};

	function addInteraction() {
		const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
		// const type = 'LineString';
		// const type = 'Polygon';
		draw = new ol.interaction.Draw({
			source: source,
			type: type,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)',
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 0, 0.5)',
					lineDash: [10, 10],
					width: 2,
				}),
				// image: new ol.Feature.CircleStyle({
				//   radius: 5,
				//   stroke: new ol.style.Stroke({
				// 	color: 'rgba(0, 0, 0, 0.7)',
				//   }),
				//   fill: new ol.style.Fill({
				// 	color: 'rgba(255, 255, 255, 0.2)',
				//   }),
				// }),
			}),
		});
		mapObj.addInteraction(draw);

		createMeasureTooltip();
		createHelpTooltip();

		let listener;
		draw.on('drawstart', function (evt) {
			// set sketch
			sketch = evt.feature;

			/** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
			let tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function (evt) {
				const geom = evt.target;
				let output;
				if (geom instanceof ol.geom.Polygon) {
					output = formatArea(geom);
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				}
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});
		});

		draw.on('drawend', function () {
			measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			measureTooltipElement = null;
			createMeasureTooltip();
			ol.Observable.unByKey(listener);
		});
		
		
		
	}



	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
		if (helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'ol-tooltip hidden';
		helpTooltip = new ol.Overlay({
			element: helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left',
		});
		mapObj.addOverlay(helpTooltip);
	}

	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
		if (measureTooltipElement) {
			measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
		measureTooltip = new ol.Overlay({
			element: measureTooltipElement,
			offset: [0, -15],
			positioning: 'bottom-center',
			stopEvent: false,
			insertFirst: false,
		});
		mapObj.addOverlay(measureTooltip);
	}

	/**
	 * Let user change the geometry type.
	 */
	//   typeSelect.onchange = function () {
	// 	map.removeInteraction(draw);
	// 	addInteraction();
	//   };

	addInteraction();

	//return response = { status: true, message: ' Measure.distance API Enabled..' };
}

// ********************* SDK_MAP_API (7)clear********************* //

tmpl.Map.clearMeasure = function (param) {
	var mapObj = param.map;
	var draw = param.draw;
	var select = param.select;
	var selectE = param.selectE;
	var clearMeasureOverlay = param.clearMeasureOverlay;
	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}
	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				
				mapObj.removeInteraction(draw);
				mapObj.removeInteraction(select);
				mapObj.removeInteraction(selectE);

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('lname') === 'vectorMeasureLayer') {
							//clearMeasureOverlay(mapObj);
							existingLayer.getSource().clear();
							
							// Select the div element by its class
							const divToRemove = document.querySelector('.tooltipApi.tooltip-static');

							// Check if the div element exists before removing it
							if (divToRemove) {
							  divToRemove.remove(); // Remove the div element from the DOM
							} else {
							  console.log('Element not found');
							}
							
						}
					}
				}

				return { status: true, message: 'clear executed successfully' }
			}
			if (appConfigInfo.mapLib == "leaflet") {


			}

		}
		else {
			tmpl.Layer.remove({ map: mapObj, layer: "Measurement" });
		}
	}
	catch (err) {
		console.error("ERROR Measure.clear: ", err);
	}

}

tmpl.Measure.clear = function (param) {
	var mapObj = param.map;
	var draw = param.draw;
	var select = param.select;
	var selectE = param.selectE;
	var clearMeasureOverlay = param.clearMeasureOverlay;
	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}
	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				
				mapObj.removeInteraction(draw);
				mapObj.removeInteraction(select);
				mapObj.removeInteraction(selectE);

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('lname') === 'vectorMeasureLayer') {
							//clearMeasureOverlay(mapObj);
							existingLayer.getSource().clear();
							
							// Select the div element by its class
							const divToRemove = document.querySelector('.tooltipApi.tooltip-static');

							// Check if the div element exists before removing it
							if (divToRemove) {
							  divToRemove.remove(); // Remove the div element from the DOM
							} else {
							  console.log('Element not found');
							}
							
						}
					}
				}

				return { status: true, message: 'clear executed successfully' }
			}
			if (appConfigInfo.mapLib == "leaflet") {


			}

		}
		else {
			tmpl.Layer.remove({ map: mapObj, layer: "Measurement" });
		}
	}
	catch (err) {
		console.error("ERROR Measure.clear: ", err);
	}

}
