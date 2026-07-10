
//---------------------------------- Beginning of Drawing Tools ----------------------------------------poooo-//
var draw;
var select = null, selectE;
//var features= new ol.Collection();
var drawVector;
var modify1;
var drawm; //draw marker

// **** This function is used to create a point on the map. On calling this function a tool is created on the map, which can be used for creating points on the map. This function returns the coordinates of the point geometry, feature   object,   its WKT representation and its geometry type in the callback function getDrawFeatureDetails(coordinates, feature, wktGeom, type). **** //


tmpl.Draw.point = function (param) {
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;

	try {
		if (mapObj === null || mapObj === undefined) {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };
		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}
	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}    

	var drawButton = document.createElement('button');
	drawButton.title = 'Draw Points';
	drawButton.id = 'pointDrawButton';
	drawButton.className = 'ol-map-pointbtn';

	if (appConfigInfo.mapDimension == "2D") {
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}               
	else {
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, callbackFunc: callbackFunc }) });
		document.body.appendChild(drawButton);
	}

	return { status: true, message: 'Drawpoint executed successfully' }
     
}
           

tmpl.Draw.CustomPoint = function (param) {
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;
	var img_url = param.img_url;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

		if (img_url === null || img_url === undefined || img_url === '' || img_url === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	var drawButton = document.createElement('button');
	drawButton.title = 'Draw Points';
	drawButton.className = 'ol-map-pointbtn';
	drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, img_url: img_url, callbackFunc: callbackFunc }) });
	mapObj.addControl(new ol.control.Control({
		element: drawButton
	}));

	return { status: true, message: 'DrawCustomPoint executed successfully' }
}

// **** For lines **** //
tmpl.Draw.line = function (param) {
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}


	} catch (error) {
		if (error instanceof Error) {
		// console.log("tmpl.Draw.line | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	try {
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Lines';
		drawButton.className = 'ol-map-linebtn';

		if (appConfigInfo.mapDimension == "2D") {
			drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'LineString', map: mapObj, callbackFunc: callbackFunc }) });
			mapObj.addControl(new ol.control.Control({
				element: drawButton
			}));
		}
		else {
			drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'LineString', map: mapObj, callbackFunc: callbackFunc }) });
			document.body.appendChild(drawButton);
		}
	}
	catch (err) {
		console.error("ERROR Draw.line: ", err);
	}
	return { status: true, message: 'Drawline executed successfully' }
}



// **** for Circle **** //////////////////////////////////////////

tmpl.Draw.circle = function (param) {
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}


	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.circle | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	var drawButton = document.createElement('button');
	drawButton.title = 'Draw Circle';
	drawButton.className = 'ol-map-Circlebtn';
	drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Circle', map: mapObj, callbackFunc: callbackFunc }) });
	var drawControl = new ol.control.Control({
		element: drawButton
	});
	mapObj.addControl(drawControl);

	return { status: true, message: 'DrawCircle executed successfully' }
}


// **** For polygond **** //

tmpl.Draw.polygon = function (param) {
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}                

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	var drawButton = document.createElement('button');
	drawButton.title = 'Draw Polygons';
	drawButton.id = 'polygonDrawButton';
	drawButton.className = 'ol-map-polygonbtn';

	if (appConfigInfo.mapDimension == "2D") {
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Polygon', map: mapObj, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}
	else {
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Polygon', map: mapObj, callbackFunc: callbackFunc }) });
		document.body.appendChild(drawButton);
	}

	return { status: true, message: 'DrawPolygon executed successfully' }


}









// **** Common draw tool used to draw features without setting buttons on the map ****//


tmpl.Draw.draw = function (param) {
	var features = new ol.Collection();
	var callbackFunc = param.callbackFunc;
	var mapObj = param.map;
	var btnType = param.type;
	var img_url = param.img_url;
	var drawRestriction = param.drawRestriction;
	var img_path;
	/*3D Done by Pooja.p*/
	try {
		if (mapObj === null || mapObj === undefined) {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };
		}
		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}
		if (btnType === null || btnType === undefined || btnType === '' || btnType === "") {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid type' };
		}
	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	/* Done by Pooja.p*/
	if (img_url == undefined) {
		img_path = './2.png';
	} else {
		img_path = img_url;
	}

	if (appConfigInfo.mapDimension == "2D") {
		mapObj.removeInteraction(modify1);
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(select);
		mapObj.removeInteraction(drawm);

		mapObj.removeInteraction(selectE);

		var source = new ol.source.Vector({ features: features });

		var noLayer = false;
		var existingLayer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (i = 0; i < length; i++) {
			var tempLayer = Layers.item(i);
			if (tempLayer.get('lname') == 'drawvector') {
				noLayer = true;
				existingLayer = tempLayer;
				// existingLayer.getSource().clear();
			}
		}

		if (!noLayer) {
			drawVector = new ol.layer.Vector({
				source: source/*new ol.source.Vector({
                features : features
            })*/,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.3)'
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 102, 255, 1)',
						width: 2
					}),
					image: new ol.style.Circle({
						radius: 0.1,
						fill: new ol.style.Fill({
							color: 'rgba(0,0,0,0)'
						})
					})
				})
			});
			drawVector.setProperties({ lname: "drawvector" });
			drawVector.setProperties({ myId: "myUnique" });
			mapObj.addLayer(drawVector);
			existingLayer = drawVector;
		}
		addInteraction(btnType, mapObj, existingLayer, callbackFunc, drawRestriction);

	} else {
		/*3D Done by Pooja.p*/
		var drawingMode = null;
		var camera = mapObj.camera;
		var ellipsoid = mapObj.scene.globe.ellipsoid;
		if (btnType == "Point") {
			var mapDivID = mapObj.container.id;
			var mapDiv = document.getElementById(mapDivID);

			function changePointer(movement) {
				mapDiv.style.cursor = "crosshair";
			}
			mapObj.canvas.addEventListener('mousemove', changePointer, false);

			var camera = mapObj.camera;
			var ellipsoid = mapObj.scene.globe.ellipsoid;
			var position = null;
			var longitudeDegrees = null;
			var latitudeDegrees = null;
			var latlng = [];

			var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);
			handler.setInputAction(function (click) {
				position = camera.pickEllipsoid(click.position);
				if (Cesium.defined(position)) {
					var cartographic = ellipsoid.cartesianToCartographic(position);
					longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
					latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
					// latlng = {lon: longitudeDegrees, lat: latitudeDegrees};
					// callbackFunc(latlng);
					stopOnclick();
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

			function stopOnclick() {
				mapDiv.style.cursor = "default";
				mapObj.canvas.removeEventListener('mousemove', changePointer, false);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				latlng = [];
				latlng.push(longitudeDegrees, latitudeDegrees);

				mapObj.entities.remove(mapObj.entities.getById("Draw Tool"));

				var billboard = {
					image: img_path,
					width: 32,
					height: 32,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
				};

				// console.log("POS===>",position);
				var point = mapObj.entities.add({
					id: "Draw Tool",
					name: "Draw Tool",
					position: position,
					billboard: billboard
				});

				var feature = mapObj.entities.getById("Draw Tool");
				var wkt = "POINT(" + longitudeDegrees + " " + latitudeDegrees + ")";

				callbackFunc(latlng, feature, wkt, btnType);
			}
		}
		else if (btnType == "LineString") {
			function createPoint(worldPosition) {
				var point = mapObj.entities.add({
					name: "Draw Point",
					position: worldPosition,
					point: {
						color: Cesium.Color.BLACK,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			}
			drawingMode = 'line';
			function drawShape(positionData) {
				// console.log("positionData: ",positionData);
				var shape;
				tmpl.Layer.remove({ map: mapObj, layer: "Draw Point" });						// For removing previously drawn Line String
				if (drawingMode === 'line') {
					shape = mapObj.entities.add({
						name: "Draw Tool",
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
				// console.log(shape.polyline.positions);
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
					// console.log("activeShapePoints==>",activeShapePoints);
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
				floatingPoint = undefined;
				activeShape = undefined;
				// activeShapePoints = [];
				mapObj.canvas.removeEventListener('mousemove', changePointer, false);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

				var cartographic = null;
				var arr = [];
				var lonlat = {};
				var j = 0;
				while (j < activeShapePoints.length) {
					cartographic = null;
					cartographic = ellipsoid.cartesianToCartographic(activeShapePoints[j]);
					// console.log(cartographic);
					var longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
					var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
					lonlat.lon = longitudeDegrees;
					lonlat.lat = latitudeDegrees;
					arr.push(lonlat);
					lonlat = {};
					// console.log(arr);
					j++;
				}

				var wktGeom = "LINESTRING(";
				var k = 0;
				while (k < arr.length) {
					if (k == arr.length - 1) {
						wktGeom += arr[k].lon + " " + arr[k].lat;
					}
					else {
						wktGeom += arr[k].lon + " " + arr[k].lat + ",";
					}
					k++;
				}
				wktGeom += ")";
				console.log(wktGeom);
				var startPoint = [arr[0].lon, arr[0].lat];
				activeShapePoints = [];
				var feat = '';
				callbackFunc(startPoint, feat, wktGeom, btnType);
			}
			handler.setInputAction(function (event) {
				terminateShape();
			}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		}
		else if (btnType == "Polygon") {
			function createPoint(worldPosition) {
				mapObj.infoBox = false;
				var point = mapObj.entities.add({
					position: worldPosition,
					name: "Draw Point",
					point: {
						color: Cesium.Color.BLACK,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			}
			drawingMode = 'polygon';      //pooja adding new code for drawing polygon 
			function drawShape(positionData) {
				console.log("positionData from func: ", positionData);
				tmpl.Layer.remove({ map: mapObj, layer: "Draw Point" });						
				var shape;
				if (drawingMode === 'polygon') {
					mapObj.entities.remove(mapObj.entities.getById("Measurement"));

					var polygonHierarchy = new Cesium.PolygonHierarchy(activeShapePoints);
					var colorMaterial = Cesium.Color.VIOLET.withAlpha(0.5);

					var polygonOptions = {
						polygon: {
							hierarchy: polygonHierarchy,
							material: colorMaterial
						}
					};

					var shape = mapObj.entities.add(polygonOptions);
					shape.name = "Draw Tool";

					return shape;
				}

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
				// We use `map.scene.pickPosition` here instead of `map.camera.pickEllipsoid` so that
				// we get the correct point when mousing over terrain.
				var earthPosition = mapObj.camera.pickEllipsoid(event.position);
				// console.log("earthPosition===>",earthPosition);
				// `earthPosition` will be undefined if our mouse is not over the globe.
				if (Cesium.defined(earthPosition)) {
					if (activeShapePoints.length === 0) {
						floatingPoint = createPoint(earthPosition);
						activeShapePoints.push(earthPosition);
						var dynamicPositions = new Cesium.CallbackProperty(function () {
							return activeShapePoints;
						}, false);
						//	activeShape = drawShape(dynamicPositions);
					}
					activeShapePoints.push(earthPosition);
					createPoint(earthPosition);
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

			handler.setInputAction(function (event) {

				if (Cesium.defined(floatingPoint)) {
					var newPosition = mapObj.camera.pickEllipsoid(event.endPosition);
					// console.log("NEW POSITION===>",newPosition);
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
				console.log("activeShapePoints: ", activeShapePoints);
				activeShapePoints.pop();
				drawShape(activeShapePoints);
				mapObj.entities.remove(floatingPoint);
				mapObj.entities.remove(activeShape);
				floatingPoint = undefined;
				activeShape = undefined;
				// activeShapePoints = [];
				mapObj.canvas.removeEventListener('mousemove', changePointer, false);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				var cartographic = null;
				var arr = [];
				var lonlat = {};
				var j = 0;
				while (j < activeShapePoints.length) {
					cartographic = null;
					cartographic = ellipsoid.cartesianToCartographic(activeShapePoints[j]);
					// console.log(cartographic);
					var longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
					var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
					lonlat.lon = longitudeDegrees;
					lonlat.lat = latitudeDegrees;
					arr.push(lonlat);
					lonlat = {};
					// console.log(arr);
					j++;
				}

				var wktGeom = "POLYGON((";
				var k = 0;
				while (k < arr.length) {
					if (k == arr.length - 1) {
						wktGeom += arr[k].lon + " " + arr[k].lat + ",";
						wktGeom += arr[0].lon + " " + arr[0].lat;
					}
					else {
						wktGeom += arr[k].lon + " " + arr[k].lat + ",";
					}
					k++;
				}
				wktGeom += "))";
				// console.log(wktGeom);
				var startPoint = [arr[0].lon, arr[0].lat];
				activeShapePoints = [];
				var feat = '';
				callbackFunc(startPoint, feat, wktGeom, btnType);
				activeShapePoints = [];
			}
			handler.setInputAction(function (event) {
				terminateShape();
			}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		}
	}
	/*3D Done by Pooja.p*/
	return { status: true, message: 'Drawdraw executed successfully' }
}






function addInteraction(btnType, mapObj, drawLayer, callbackFunc, drawRestriction) {
	var callbackFunc = callbackFunc;
	drawLayer.getSource().clear();
	var value = btnType;
	var subType = "";
	if (value !== 'None') {
		var geometryFunction, maxPoints;
		if (value === 'Square') {
			value = 'Circle';
			geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
		}
		else if (value === 'Box') {
			value = 'LineString';
			subType = "Box";
			maxPoints = 2;
			geometryFunction = function (coordinates, geometry) {
				if (!geometry) {
					geometry = new ol.geom.Polygon(null);
				}
				var start = coordinates[0];
				var end = coordinates[1];
				geometry.setCoordinates([
					[start, [start[0], end[1]], end, [end[0], start[1]], start]
				]);
				return geometry;
			};
		}
		else if (value === 'Circle') {
			value = 'Circle';
			geometryFunction = ol.interaction.Draw.createRegularPolygon(100);
		}
		draw = new ol.interaction.Draw({
			source: drawLayer.getSource(),
			type: /** @type {ol.geom.GeometryType} */ (value),
			geometryFunction: geometryFunction,
			maxPoints: maxPoints
		});
		mapObj.addInteraction(draw);
		draw.on('drawend', function (event) {
			var feature = event.feature;
			var geometryVal = feature.getGeometry();
			var lonlat;
			var coord, wktGeom;
			var format = new ol.format.WKT();
			if (value === 'Point') {
				lonlat = feature.getGeometry().getCoordinates();
			}
			else if (value === 'LineString') {
				if (subType == "Box") {
					lonlat = feature.getGeometry().getInteriorPoint().getCoordinates();
				} else {
					lonlat = feature.getGeometry().getFirstCoordinate();
				}
			}
			else if (value === 'Polygon' || value === 'Circle' || value === 'Box') {
				lonlat = feature.getGeometry().getInteriorPoint().getCoordinates();
			}
			/* else if(value==='Circle')
				{
				  lonlat =feature.getGeometry().getCenter();
 
				  alert("Circle "+feature.getGeometry().getType()+lonlat);
				}*/
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' ||
				 appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData=='mmi'||appConfigInfo.mapData=='sgl') {
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coord = lonlat;//feature.getGeometry().getCoordinates();
				wktGeom = format.writeGeometry(feature.getGeometry());
			}

			event.stopPropagation();
			mapObj.removeInteraction(draw);
			callbackFunc(coord, feature, wktGeom, value);

		});
	}


}

tmpl.Draw.clear = function (param) {
	var mapObj = param.map;

		try {
		if (mapObj === null || mapObj === undefined) {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.clear  | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			var Layers = mapObj.getLayers();
			var length = Layers.getLength();
			for (var i = 0; i < length; i++) {
				var existingLayer = Layers.item(i);
				if (existingLayer) {
					if (existingLayer.get('lname') == 'drawvector') {
						existingLayer.getSource().clear();
						mapObj.removeLayer(existingLayer);
					}
				}
			}
			let poiBtn = document.getElementById("pointDrawButton");
			if(poiBtn instanceof HTMLButtonElement){
				poiBtn.remove();
			}
			let polyBtn = document.getElementById("polygonDrawButton");
			if(polyBtn instanceof HTMLButtonElement){
				polyBtn.remove();
			}
		}
		else {
			tmpl.Layer.remove({ map: mapObj, layer: "Draw Tool" });
		}
	}
	catch (err) {
		console.error("ERROR Draw.clear: ", err);
	}
	return { status: true, message: 'Drawclear executed successfully' }
}


tmpl.Draw.remove = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	mapObj.removeInteraction(modify1);
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(select);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);

	return { status: true, message: 'Drawremove executed successfully' }
}


tmpl.Draw.addSelect = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.addSelect  | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	var selectButton = document.createElement('button');
	selectButton.title = 'Select Features';
	selectButton.className = 'ol-map-selectbtn';
	selectButton.addEventListener('click', function () { tmpl.Draw.select({ map: mapObj }); });
	var selectControl = new ol.control.Control({
		element: selectButton
	});
	mapObj.addControl(selectControl);
	return { status: true, message: 'DrawaddSelect executed successfully' }
}

tmpl.Draw.select = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	mapObj.removeInteraction(select);
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(modify1);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	select = null;
	var selectClick = new ol.interaction.Select({
		condition: ol.events.condition.click
	});
	var style_modify = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'blue'
		}),
		stroke: new ol.style.Stroke({
			width: 5,
			color: 'blue'
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: 'blue'
			})
		})
	});
	selectClick.on('select', function (evt) {
		var selected = evt.selected;
		var deselected = evt.deselected;
		if (selected.length) {
			selected.forEach(function (feature) {
				feature.setStyle(style_modify);
			});
		} else {
			deselected.forEach(function (feature) {
				feature.setStyle(null);
			});
		}
	});
	var changeInteraction = function () {
		if (select !== null) {
			mapObj.removeInteraction(select);
		}
		select = selectClick;
		if (select !== null) {
			mapObj.addInteraction(select);
		}
	};
	changeInteraction();

	return { status: true, message: 'Drawselect executed successfully' }
}

tmpl.Draw.addDelete = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.addDelete | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	var deleteButton = document.createElement('button');
	deleteButton.title = 'Delete';
	deleteButton.className = 'ol-map-deletebtn';
	deleteButton.addEventListener('click', function () { tmpl.Draw.delete({ map: mapObj }); });
	var deleteControl = new ol.control.Control({
		element: deleteButton
	});
	mapObj.addControl(deleteControl);

	return { status: true, message: 'DrawaddDelete executed successfully' }
}

tmpl.Draw.delete = function doDelete(param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.delete | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	mapObj.removeInteraction(modify1);
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(select);
	mapObj.removeInteraction(drawm);
	var selected_features = select.getFeatures();
	selected_features.forEach(function (selfeature) {
		selected_features.remove(selfeature);
		var lyr = selfeature.getLayerDetailsTrinity(mapObj);
		var src = lyr.getSource();
		src.removeFeature(selfeature);
	});
	mapObj.removeInteraction(select);
	return { status: true, message: 'Drawdelete executed successfully' }
}

tmpl.Draw.addSelectEdit = function setEdit(param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.addSelectEdit | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	var editButton = document.createElement('button');
	editButton.title = 'Edit';
	editButton.className = 'ol-map-editbtn';
	editButton.addEventListener('click', function () { tmpl.Draw.selectEdit({ map: mapObj }); });
	var editControl = new ol.control.Control({
		element: editButton
	});
	mapObj.addControl(editControl);
	return { status: true, message: 'DrawaddSelectEdit executed successfully' }
}

tmpl.Draw.selectEdit = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.selectEdit | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	selectE = new ol.interaction.Select({
		wrapX: false,
		condition: ol.events.condition.click
	});
	var style_modify = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'blue'
		}),
		stroke: new ol.style.Stroke({
			width: 5,
			color: 'blue'
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: 'blue'
			})
		})
	});
	selectE.on('select', function (evt) {
		var selected = evt.selected;
		var deselected = evt.deselected;
		if (selected.length) {
			selected.forEach(function (feature) {
				feature.setStyle(style_modify);
			});
		} else {
			deselected.forEach(function (feature) {
				feature.setStyle(null);
			});
		}
	});
	mapObj.addInteraction(selectE);
	modify1 = new ol.interaction.Modify({
		features: selectE.getFeatures()
	});
	mapObj.addInteraction(modify1);

	return { status: true, message: 'DrawselectEdit executed successfully' }
}
tmpl.Draw.selectMultiple = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.selectMultiple | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	selectE = new ol.interaction.Select({
		wrapX: false,
		condition: ol.events.condition.doubleClick
	});

	var style_modify = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'blue'
		}),
		stroke: new ol.style.Stroke({
			width: 5,
			color: 'blue'
		}),
		image: new ol.style.Circle({
			radius: 5,
			fill: new ol.style.Fill({
				color: 'blue'
			})
		})
	});
	selectE.on('select', function (evt) {
		var selected = evt.selected;
		var deselected = evt.deselected;

		if (selected.length) {
			//console.log("length >>>",selected.length);
			selected.forEach(function (feature) {
				//console.log("feature >>",feature);
				//console.log("featureProp >>",feature.getProperties().features);
				feature.setStyle(style_modify);
			});
		} else {
			deselected.forEach(function (feature) {
				feature.setStyle(null);
			});
		}
	});
	mapObj.addInteraction(selectE);
	return { status: true, message: 'DrawselectMultiple executed successfully' }

}
