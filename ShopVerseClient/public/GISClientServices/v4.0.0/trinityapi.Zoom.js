
// ********************* SDK_MAP_API (7)toXY ********************* //

tmpl.Zoom.toXY = function (param) {
	var mapObj = param.map;
	var lat = parseFloat(param.latitude);
	var lng = parseFloat(param.longitude);
	var searchZoom = appConfigInfo.searchZoom || 18;

	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}


		if (param.latitude === null || param.latitude === undefined || param.latitude === '' || param.latitude === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lat value' };
		}


		if (param.longitude === null || param.longitude === undefined || param.longitude === '' || param.longitude === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lon value' };
		}



	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}

	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {

				if (appConfigInfo.mapData == "google" || appConfigInfo.mapData ==  'hereMaps' || appConfigInfo.mapData == 'mmi' ) {
					if (appConfigInfo.type == 'osm') {
						mapObj.getView().setCenter([lng, lat]);
						mapObj.getView().setZoom(searchZoom);
					}
					else {
						mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
						mapObj.getView().setZoom(searchZoom);
					}
				} else {
					mapObj.getView().setCenter([lng, lat]);
					mapObj.getView().setZoom(searchZoom);
				}
				return { status: true, message: 'Zoom to  XY executed successfully' }
			}
			if (appConfigInfo.mapLib == "leaflet") {

				mapObj.setView([lng, lat]);

			}
			//}
		}
		else {
			mapObj.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(lng, lat, 100),
				orientation: {
					heading: Cesium.Math.toRadians(-90),
					pitch: Cesium.Math.toRadians(-15),
					roll: 0.0
				},
				// offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500)
			});

			// mapObj.zoomTo(mapObj.entities, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(-90), Cesium.Math.toRadians(-15), 7500));
		}
	}
	catch (err) {
		console.error("ERROR Zoom.toXY: ", err);
	}

	return response = { status: true, message: 'Zoom.toXY API Enabled..' };
}

// ********************* SDK_MAP_API (7)toExtent********************* //
tmpl.Zoom.toExtent = function (param) {
	var mapObj = param.map;
	var extent = param.extent;
	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  map Object' };
		}

		if (extent === null || extent === undefined || extent === '' || extent === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  extent value' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps' || 
					appConfigInfo.mapData == 'trinity'||appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == "sgl") {
					var ext = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
					mapObj.getView().fit(ext, mapObj.getSize());

				} else {
					mapObj.getView().fit(extent, mapObj.getSize());
				}

				return { status: true, message: 'Zoom to  Extent executed successfully' }

			}
			// if (appConfigInfo.mapLib == "leaflet") {
			// 	mapObj.setView(extent[0], extent[1], extent[2], extent[3]);

			// }


		}
		else {
			var rectExtent = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]);
			mapObj.camera.flyTo({
				destination: rectExtent,
				// duration: 1				//1sec
			});
		}
	}
	catch (err) {
		console.error("ERROR Zoom.toExtent: ", err);
	}

	return response = { status: true, message: 'Zoom.toExtent API Enabled..' };
}

// ********************* SDK_MAP_API (7)Measure.zoom ********************* //
tmpl.Zoom.zoom = function (param) {
	var mapObj = param.map;
	var zoomLevel = param.zoomLevel;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}


		if (zoomLevel === null || zoomLevel === undefined || zoomLevel === '' || zoomLevel === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid zoomLevel' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	if (appConfigInfo.mapDimension = '2D') {
		if (appConfigInfo.mapLib == 'ol7') {
			if (zoomLevel >= 0 || zoomLevel <= 21) {
				mapObj.getView().setZoom(zoomLevel);
				return { status: true, message: 'Zoom to Zoom executed successfully' }
			}

			// return {status : false, message : 'Zoomzoom is not executed'}

		}


		if (appConfigInfo.mapLib == "leaflet") {
			mapObj.setView([12.9863857, 77.6082756], 20);
		}
	}

	return response = { status: true, message: 'Zoom.zoom API Enabled..' };
}

// // ********************* SDK_MAP_API (7)toXYcustomZoom********************* //
tmpl.Zoom.toXYcustomZoom = function (param) {
	var mapObj = param.map;
	// var zoomLevel = 18;
	var zoomLevel = param.zoom;
	var lat = parseFloat(param.latitude);
	var lng = parseFloat(param.longitude);
	var offset = param.offset;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}


		if (lat === null || lat === undefined || lat === '' || lat === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lat Object' };
		}


		if (lng === null || lng === undefined || lng === '' || lng === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lng Object' };
		}

		if (zoomLevel === null || zoomLevel === undefined || zoomLevel === '' || zoomLevel === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid zoomLevel Object' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}


	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				if (
					appConfigInfo.mapData == "google" ||
					appConfigInfo.mapData == "hereMaps" ||
					appConfigInfo.mapData == "trinity" ||
					appConfigInfo.mapData == "mmi" ||
					appConfigInfo.mapData == "sgl"
				) {
					const view = mapObj.getView();
					let transformedCoord;

					if (appConfigInfo.type == "sgl") {
						transformedCoord = [lng, lat];
					} else {
						transformedCoord = ol.proj.transform([lng, lat], "EPSG:4326", "EPSG:3857");
					}
					let offsetTop = 0, offsetRight = 0, offsetBottom = 0, offsetLeft = 0;
					if (Array.isArray(offset) && offset.length === 4) {
						offsetTop = offset[0] || 0;
						offsetRight = offset[1] || 0;
						offsetBottom = offset[2] || 0;
						offsetLeft = offset[3] || 0;
					}
					const applyOffsetZoom = () => {
						const verticalOffsetPx = offsetBottom - offsetTop;
						const horizontalOffsetPx = offsetLeft - offsetRight;
						const pixel = mapObj.getPixelFromCoordinate(transformedCoord);
						const adjustedPixel = [
							pixel[0] + horizontalOffsetPx,
							pixel[1] + verticalOffsetPx
						];
						const adjustedCoord = mapObj.getCoordinateFromPixel(adjustedPixel);
						view.setCenter(adjustedCoord);
						view.setZoom(zoomLevel);
					};
					mapObj.once('postrender', applyOffsetZoom);
					applyOffsetZoom();

					return { status: true, message: "toXYcustomZoom executed successfully (with offset array)" };
				}
				else if (appConfigInfo.mapData == "pentab") {
					mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:4326'));
					mapObj.getView().setZoom(zoomLevel);
				}
				else {
					mapObj.getView().setCenter([lng, lat]);
					mapObj.getView().setZoom(zoomLevel);
				}

				return { status: true, message: 'toXYcustomZoom executed successfully' };
			}
		}
		else {
			var height;
			if (zoomLevel == undefined) {
				console.error("ERROR Zoom.toXYcustomZoom ---------> Zoom Level is not specified!");
			}
			else {
				switch (zoomLevel) {
					case 1:
						height = 10000;
						break;

					case 2:
						height = 9000;
						break;

					case 3:
						height = 8000;
						break;

					case 4:
						height = 7000;
						break;

					case 5:
						height = 6000;
						break;

					case 6:
						height = 5000;
						break;

					case 7:
						height = 4000;
						break;

					case 8:
						height = 3000;
						break;

					case 9:
						height = 2000;
						break;

					case 10:
						height = 1000;
						break;

					default:
						height = 200;
						console.log("Zoom Level should be in the range 1 to 10! Height set to 10 by default.");
						break;
				}
				// mapObj.camera.flyTo({
				// destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
				// orientation : {
				// heading : Cesium.Math.toRadians(90),
				// pitch : Cesium.Math.toRadians(-15),
				// roll : 0.0
				// },
				// // offset: 
				// duration: 1.5
				// });	

				mapObj.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
					duration: 1.5,
					// orientation : {
					// heading : Cesium.Math.toRadians(0.0),
					// pitch : Cesium.Math.toRadians(-7.0),
					// roll : 0.0
					// }
				});
			}
		}
	}
	catch (err) {
		console.error("ERROR Zoom.toXYcustomZoom: ", err);
	}

	return response = { status: true, message: 'Zoom.toXYcustomZoom API Enabled..' };
}

// ********************* SDK_MAP_API (7)toXYWithoutZoom********************* //

tmpl.Zoom.toXYWithoutZoom = function (param) {
	var mapObj = param.map;
	var lat = parseFloat(param.latitude);
	var lng = parseFloat(param.longitude);
	//if(ext != null){
	//	mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
	//}
	//else{

	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}

		if (lat === null || lat === undefined || lat === '' || lat === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lat value' };
		}

		if (lng === null || lng === undefined || lng === '' || lng === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lng value' };
		}


	} catch (error) {
		if (error instanceof Error) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}

	}
	if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
		mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
		mapObj.getView().setZoom(18);

	}
	else {
		mapObj.getView().setCenter([lng, lat]);
		//mapObj.getView().setZoom(15);
	}


	//}

	return response = { status: true, message: 'Zoom.toXYWithoutZoom  API Enabled..' };
}


// ********************* SDK_MAP_API (4)toLayer********************* //

tmpl.Zoom.toLayer = function (param) {
	var mapObj = param.map;
	var lyrname = param.layer;
	var zoomLevel = appConfigInfo.searchZoom;


	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

		if (lyrname === null || lyrname === undefined || lyrname === '' || lyrname === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid lyrname ' };
		}

		if (zoomLevel === null || zoomLevel === undefined || zoomLevel === '' || zoomLevel === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid zoomLevel' };
		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Zoom.toLayer   | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}
	if (param.zoomLevel) {
		zoomLevel = param.zoomLevel;
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var existing;
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					console.log("------", existingLayer.get('title'), existingLayer.get('name'));
					if (existingLayer.get('title') == lyrname) {
						existing = existingLayer;
						var extent = existingLayer.getSource().getExtent();
						if (extent[0] == extent[2] && extent[1] == extent[3]) {
							console.log("extent1 -> ", extent);
							var centerX = (extent[0] + extent[2]) / 2; 
							var centerY = (extent[1] + extent[3]) / 2; 
							var point = [centerX, centerY];

							if (appConfigInfo.mapData == 'google') {
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
							} else {
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
							}
							tmpl.Zoom.toXYcustomZoom({
								map: mapObj,
								zoom: zoomLevel,
								latitude: point[1],
								longitude: point[0]
							});
						} else {
							//console.log("extent2 -> ", extent);
							mapObj.getView().fit(extent, mapObj.getSize());
							if (param.zoomLevel) {
								mapObj.getView().setZoom(zoomLevel);
							}
						}
						break;
					}
				}
				if (existing == undefined) {
					for (var i = 0; i < tmpl_setMap_layer_global_array.length; i++) {
						var extent = tmpl_setMap_layer_global_array[i].layer.getSource().getExtent();
						if (tmpl_setMap_layer_global_array[i].title == lyrname && extent?.[0] != Infinity && extent?.[0] != -Infinity) {
							
							//console.log(extent);
							if (extent[0] == extent[2] && extent[1] == extent[3]) {
								// console.log("extent1 -> ", extent);
								var centerX = (extent[0] + extent[2]) / 2; 
								var centerY = (extent[1] + extent[3]) / 2; 
								var point = [centerX, centerY];
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
								tmpl.Zoom.toXYcustomZoom({
									map: mapObj,
									zoom: zoomLevel,
									latitude: point[1],
									longitude: point[0]
								});
							} else {
								//console.log("extent2 -> ", extent);
								var centerX = (extent[0] + extent[2]) / 2; 
								var centerY = (extent[1] + extent[3]) / 2; 
								var point = [centerX, centerY];
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
								if (param.zoomLevel) {
									zoomLevel = param.zoomLevel;
									tmpl.Zoom.toXYcustomZoom({
										map: mapObj,
										zoom: zoomLevel,
										latitude: point[1],
										longitude: point[0]
									});


								} else {
									mapObj.getView().fit(extent, mapObj.getSize());
								}
							}
							break;
						}
					}
				}
			}

			if (appConfigInfo.mapLib == "leaflet") {

			}

		}
		else {
			var arr = [];
			// console.log("Zoom.toLayer API=====>",mapObj.entities._entities);
			if (lyrname != undefined) {
				for (var i = 0; i < mapObj.entities._entities.length; i++) {
					if (mapObj.entities._entities._array[i]._name == lyrname) {
						arr.push(mapObj.entities._entities._array[i]);
					}
				}
				// console.log("arr from API======>",arr);
				mapObj.flyTo(arr);
			}
			else {
				console.error("ERROR Layer does not exist");
			}
		}

	}
	catch (err) {
		//console.error("ERROR Zoom.toLayer: ", err);
	}

	return response = { status: true, message: ' Zoom toLayer API Enabled..' };
}


// ********************* SDK_MAP_API (7)Measure.toCenter ********************* //
tmpl.Zoom.toCenter = function (param) {
	var mapObj = param.map;
	var lat = param.lat;
	var lon = param.lon;
	var zoomLevel = param.zoomLevel;

	try {

		if (mapObj === null || mapObj === undefined) {
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };

		}
		if (lat === null || lat === undefined || lat === '' || lat === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lat value' };
		}
		if (lon === null || lon === undefined || lon === '' || lon === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lon value' };
		}

		if (zoomLevel === null || zoomLevel === undefined || zoomLevel === '' || zoomLevel === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid zoomLevel' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}

	}


	try {
		if (appConfigInfo.mapDimension == '2D') {
			if (appConfigInfo.mapLib == 'ol7') {
				if (appConfigInfo.type === 'osm') {
					setTimeout(function () {
						mapObj.getView().setZoom(appConfigInfo.trinityzoom);
						mapObj.getView().setCenter([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
					}, 1000);

				} else {
					mapObj.getView().setZoom(appConfigInfo.googlezoom);
					mapObj.getView().setCenter(ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'));
				}
				return { status: true, message: '.ZoomtoCenter executed successfully' }
			}
			else if (appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'pentab') {
				//alert(2);
				setTimeout(function () {
					mapObj.getView().setZoom(appConfigInfo.trinityzoom);
					//mapObj.getView().setCenter([ parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
					mapObj.getView().setCenter(ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:4326'));
				}, 1000);




			}
			if (appConfigInfo == "leaflet") {
				mapObj.setView(mapObj.getCenter([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'));

			}
		}

		else {

			setTimeout(function () {
				mapObj.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, appConfigInfo.height),
					orientation: {
						heading: Cesium.Math.toRadians(0.0),
						pitch: Cesium.Math.toRadians(-13.0),
						roll: 0.0
					}
				});
			}, 1000);
		}

	}
	catch (error) {
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
	}

	return response = { status: true, message: 'Zoom.toCenter API Enabled..' };
}    


tmpl.Zoom.toFeature = function (param) {
	var mapObj = param.map;
	var latitude = param.latitude;
	var longitude = param.longitude;
	var zoomLevel = param.zoomLevel;
	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}

		if (latitude === null || latitude === undefined || latitude === '' || latitude === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid latitude Object' };
		}

		if (longitude === null || longitude === undefined || longitude === '' || longitude === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid longitude Object' };
		}


		if (zoomLevel === null || zoomLevel === undefined || zoomLevel === '' || zoomLevel === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid zoomLevel Object' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				var map = new ol.Map({
					target: 'map',
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						})
					],
					view: new ol.View({
						center: [longitude, latitude],
						zoom: zoomLevel,
						minZoom: 5
					})
				});

				// Assuming you have a feature called 'myFeature' with a defined geometry
				var myFeature = new ol.Feature({
					// Add your feature properties and geometry here
				});

				var vectorSource = new ol.source.Vector({
					features: [myFeature]
				});
				var vectorLayer = new ol.layer.Vector({
					source: vectorSource
				});

				map.addLayer(vectorLayer);
				// Zoom to the extent of the feature
				//    map.getView().fit(vectorSource.getExtent());

			}

			if (appConfigInfo.mapLib == "leaflet") {
				// var map = L.map('map').setView([latitude, longitude], zoomLevel);

				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
					maxZoom: 18
				}).addTo(mapObj);

				// Assuming you have a feature called 'myFeature' with a defined geometry
				var myFeature = L.geoJSON(latitude, longitude).addTo(mapObj);

				// Zoom to the bounds of the feature
				mapObj.fitBounds(myFeature.getBounds())
			}
		}

		else {


		}

	} catch (error) {
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
	}

	return response = { status: true, message: 'tmpl.Zoom.toFeature API Enabled' };
}


tmpl.Zoom.toHomeExtent = function (param) {
	var mapObj = param.map;
	var extent = [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4];
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}
		if (extent === null || extent === undefined || extent === '' || extent === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid lyrname' };
		}

	} catch (error) {

		if (error instanceof Error) {
			// console.log("tmpl.Map.removeWMSLayer   | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}

	if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
		var ext = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
		mapObj.getView().fit(ext, mapObj.getSize());
	} else {
		mapObj.getView().fit(extent, mapObj.getSize());
	}

	return response = { status: true, message: ' Zoom.toHomeExtent API Enabled..' };
}

tmpl.Zoom.toPolygonFeature = function (param) {
	var mapObj = param.map;
	var id = param.id;
	var layername = param.layer;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var zoomLevel = param.zoomLevel;
	var existing;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid id' };
		}

		if (layername === null || layername === undefined || layername === '' || layername === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid layername' };
		}


	} catch (error) {

		if (error instanceof Error) {
			// console.log("tmpl.Map.removeWMSLayer   | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}


	try {

		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				console.log("showthis", existingLayer);
				if (existingLayer.get('title') === layername) {
					console.log("layername", layername);
					existing = existingLayer;
					console.log("existing>>>>", existing);
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						console.log("feature:", feature);
						if (feature.get('id') == id) {
							var ex = feature.getGeometry();
							var extent = ex.getExtent(); //existingLayer.getSource().getExtent();
							console.log("Zoomm:", extent, mapObj.getSize());
							mapObj.getView().fit(extent, mapObj.getSize());
							try {
								mapObj.getView().setZoom(zoomLevel);
							} catch (err) { console.error("error in zoomLevel param", err); }
						}
					});
				}
			}
		}
	} catch (err) {
		console.error("error in zooming", err);
	}

	return response = { status: true, message: 'Zoom.toPolygonFeature API Enabled..' };
}

tmpl.Zoom.toXYWithoutZoom = function (param) {
	var mapObj = param.map;
	var lat = parseFloat(param.latitude);
	var lng = parseFloat(param.longitude);

	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };
		}

		if (lat === null || lat === undefined || lat === '' || lat === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid lat Object' };
		}

		if (lng === null || lng === undefined || lng === '' || lng === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid lng Object' };
		}


	} catch (error) {
		if (error instanceof Error) {

			// console.log("tmpl.Zoom.toXYWithoutZoom    | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

		//if(ext != null){
		//	mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
		//}
		//else{
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
			//mapObj.getView().setZoom(18);
		} else {
			mapObj.getView().setCenter([lng, lat]);
			//mapObj.getView().setZoom(15);
		}
		//}
	}

	return response = { status: true, message: ' Zoom.toXYWithoutZoom API Enabled..' };

}


tmpl.Zoom.zoomToSelectedPoints = function (param) {
    var mapObj = param.map;
    var points = param.points; // Array of selected points (each point is [lon, lat])

    // Ensure there are at least two points
    if (points.length < 2) {
        return;
    }

    // Step 1: Log the points array to verify its contents
    console.log("Selected Points: ", points);

    // Convert lon-lat coordinates to OpenLayers coordinates
    var coordinates = points.map(point => ol.proj.fromLonLat(point));

    // Step 2: Log the coordinates after conversion
    console.log("OpenLayers Coordinates: ", coordinates);

    // Calculate the extent that encompasses both points
    var extent = ol.extent.boundingExtent(coordinates);

    // Add some padding to the extent to ensure points are not at the edge
    var padding = 100;
    extent = ol.extent.buffer(extent, padding);

    // Step 3: Log the extent to verify its values
    console.log("Calculated Extent: ", extent);

    // Set map view to the calculated extent
	if (appConfigInfo.mapLib == "ol7") {
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps' || 
			appConfigInfo.mapData == 'trinity'||appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == "sgl") {
			console.log("Original Extent (EPSG:4326): ", extent); // Debugging line
			var ext = ol.proj.transformExtent(extent, "EPSG:3857", "EPSG:4326");
			console.log("Transformed Extent (EPSG:3857): ", ext); // Debugging line
			//mapObj.getView().fit(ext, mapObj.getSize());
			tmpl.Zoom.toExtent({
				map : mapObj,
				extent : ext
			});
		} else {
			console.log("Original Extent (EPSG:4326): ", extent); // Debugging line
			mapObj.getView().fit(extent, mapObj.getSize());
		}
	
		return { status: true, message: 'Zoom to Extent executed successfully' }
	}
	
	
};


tmpl.Zoom.zoomToExtentForCoordinates = function (param) {
	var mapObj = param.map;
	var coordinates = param.coordinates;
  
	try {
	  if (!mapObj) {
		return { status: false, businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
	  }
  
	  if (!Array.isArray(coordinates) || coordinates.length < 2) {
		return { status: false, businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid extent value' };
	  }
	} catch (error) {
	  if (error instanceof Error) {
		return { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter: ' + error.message };
	  }
	}
  
	try {
	  var transformedCoordinates = coordinates.map(coord => ol.proj.fromLonLat(coord));
	  var extent = ol.extent.boundingExtent(transformedCoordinates);
	  mapObj.getView().fit(extent, mapObj.getSize());
	} catch (err) {
	  console.error("ERROR Zoom.toExtent: ", err);
	  return { status: false, message: 'Error occurred during Zoom To Extent For Coordinates: ' + err.message };
	}
  
	return { status: true, message: 'Zoom To Extent For Coordinates executed successfully' };
  };


  tmpl.Zoom.toMultipleLayers = function (param) {
	var map = param.map;
	// var layerGroup = param.layers;
	var layerGroup = [];


	try {
	var layerGroup = [];

		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			const obj = tmpl_setMap_layer_global[i];

			if (obj.title && obj.title !== 'layerFleetVehicle') {
				console.log(obj.title);
				layerGroup.push(obj.title);  
			}
		}

		console.log("layerGroup from global variable=====>", layerGroup);
		var arrsw = [];
		var arrne = [];
		var layerExtent;
		for (var i = 0; i < layerGroup.length; i++) {
			console.log("layerGroup[i]=====>", layerGroup[i]);
			layerExtent = tmpl.Layer.getExtent({
				map: map,
				layer: layerGroup[i]
			});
			console.log("layerExtent from API====>", layerExtent);
			arrsw.push(layerExtent[0]);
			arrne.push(layerExtent[1]);
		}
		console.log("arrsw: ", arrsw);
		console.log("arrne: ", arrne);

		var swArrMin = [];
		var neArrMax = [];
		for (var j = 0; j < arrsw.length; j++) {
			swArrMin.push(arrsw[j][0]);
			neArrMax.push(arrne[j][0]);
		}
		console.log("swArrMin: ", swArrMin);
		console.log("neArrMax: ", neArrMax);
		var min = Math.min(...swArrMin);
		var max = Math.max(...neArrMax);
		console.log("MIN===>", min);
		console.log("MAX===>", max);

		var swExtent, neExtent;
		for (var k = 0; k < arrsw.length; k++) {
			if (arrsw[k][0] == min) {
				swExtent = arrsw[k];
			}
			if (arrne[k][0] == max) {
				neExtent = arrne[k];
			}
		}

		tmpl.Zoom.toExtent({
			map: map,
			extent: [swExtent[0], swExtent[1], neExtent[0], neExtent[1]]
		});
	}
	catch (err) {
		console.error("ERROR Zoom.toMultipleLayers: ", err);
	}
}


tmpl.Zoom.toAllLayers = function (param) {
	// var map = param.map;
	// var zoomLevel = param.zoom;

    // try {
    //     var allLayers = map.getLayers();
    //     var length = allLayers.getLength();

    //     var layerArray = tmpl.Layer.getAllLayers();

    //     var extent = ol.extent.createEmpty();

    //     for (var i = 0; i < length; i++) {
    //         var existingLayer = allLayers.item(i);

    //         for (var j = 0; j < layerArray.length; j++) {
    //             if (existingLayer.get('title') == layerArray[j]) {
    //                 var source = existingLayer.getSource();
    //                 if (source) {
    //                     var layerExtent = source.getExtent();
    //                     ol.extent.extend(extent, layerExtent);
    //                 }
    //             }
    //         }
    //     }

    //     if (!ol.extent.isEmpty(extent)) {
    //         map.getView().fit(extent, map.getSize());

	// 		const view = map.getView();
	// 		const currentZoom = view.getZoom();
	// 		const minZoom = appConfigInfo.mapZoom
	// 		console.log("Current Zoom Level: ", currentZoom);
	// 		console.log("Minimum Zoom Level: ", minZoom);

	// 		if (currentZoom > minZoom) {
	// 			console.log("Setting zoom to minimum level: ", zoomLevel);
	// 			// Set the zoom level to the minimum zoom level
	// 			view.setZoom(zoomLevel);
	// 		}


    //     } else {
    //         console.warn("⚠️ No valid extents found. Skipping zoom.");
    //     }
    // } catch (err) {
    //     console.error(" Error in tmpl.Zoom.toAllLayers:", err);
    // }
};



tmpl.Zoom.getExtentAndZoomOnPan = function (param) {
  var mapObj = param.map;
  var flag = param.flag;
  var callbackFunc = param.callbackFunc;
  var extendPanOff = mapObj.get('moveendObjForgetExtendOnPan');
  mapObj.unByKey(extendPanOff);

  if (flag) {
    var moveendVrbl = mapObj.on("moveend", function (e) {
      var view_port = mapObj.getView().calculateExtent(mapObj.getSize());
      var zoomLevel = mapObj.getView().getZoom();

      if (appConfigInfo.mapData === 'google') {
        view_port = ol.proj.transformExtent(view_port, 'EPSG:3857', 'EPSG:4326');
      }

      // Send both extent and zoom level
      callbackFunc({
        extent: view_port,
        zoom: zoomLevel
      });
    });

    mapObj.set('moveendObjForgetExtendOnPan', moveendVrbl);
  } else {
    var extendPanOff = mapObj.get('moveendObjForgetExtendOnPan');
    if (extendPanOff) {
      mapObj.unByKey(extendPanOff);
    }
  }
};


tmpl.Zoom.zoomToWMSLayer = async function (param) {
  console.log("appConfigInfo.geoserverDetails::::::::", appConfigInfo.geoserverDetails);

  const mapObj = param.map;
  const layerName = param.name;
  const geoserverHost = appConfigInfo.geoserverDetails.geoserverHost;
  const geoServerUserName = appConfigInfo.geoserverDetails.userName;
  const geoServerPassword = appConfigInfo.geoserverDetails.passWord;
  const authHeader = "Basic " + btoa(geoServerUserName + ':' + geoServerPassword);

  // Input validation
  if (!mapObj) {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map object",
    };
  }
  if (!layerName || layerName === "") {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid layerName",
    };
  }
  if (!geoserverHost || geoserverHost === "") {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid GeoServer host",
    };
  }

  // Construct REST API URL for the layer
  const restUrl = `${geoserverHost}/rest/layers/${encodeURIComponent(layerName)}.json`;

  try {
    // Fetch the layer info
    const response = await fetch(restUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": authHeader,
      },
    });
console.log("response1:::::::::::",response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.layer || !data.layer.resource || !data.layer.resource.href) {
      return {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x003",
        developererrorcode: "TD_GISSDK_0x003",
        message: "Layer or resource href not found",
      };
    }
    console.log("data.layer.resource.href:::::::::::",data.layer.resource.href);

    // Fetch the featureType for bounding box
data.layer.resource.href = data.layer.resource.href.replace(/^http:\/\//, 'https://');
const featureResponse = await fetch(data.layer.resource.href, {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Authorization": authHeader,
  },
});    
    console.log("featureResponse:::::::::::",featureResponse);

    if (!featureResponse.ok) {
      console.log("res2::::::::", featureResponse);
      throw new Error(`HTTP ${featureResponse.status}: ${featureResponse.statusText}`);
    }

    const featureType = await featureResponse.json();
    const bbox = featureType.featureType?.latLonBoundingBox;

    if (!bbox || !bbox.minx || !bbox.miny || !bbox.maxx || !bbox.maxy) {
      return {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x003",
        developererrorcode: "TD_GISSDK_0x003",
        message: "Layer extent not found",
      };
    }

    // Call tmpl.Zoom.toExtent with the bounding box
    try {
      tmpl.Zoom.toExtent({
        map: mapObj,
        extent: [bbox.minx, bbox.miny, bbox.maxx, bbox.maxy],
      });
      return {
        status: "true",
        message: "Zoomed to layer extent successfully",
      };
    } catch (err) {
      return {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x010",
        developererrorcode: "TD_GISSDK_0x010",
        message: `Failed to zoom: ${err.message}`,
      };
    }
  } catch (err) {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x010",
      developererrorcode: "TD_GISSDK_0x010",
      message: `Failed to fetch layer info: ${err.message}`,
    };
  }
};