var firstrun = true;
window.tmpl = {};
tmpl.Map = {};
tmpl.Control = {};
tmpl.Overlay = {};
tmpl.Route = {};
tmpl.Geocode = {};
tmpl.Search = {};
tmpl.Zoom = {};
tmpl.Feature = {};
tmpl.Layer = {};
tmpl.Extent = {};
tmpl.Draw = {};
tmpl.Measure = {};
tmpl.Tooltip = {};
tmpl.Create = {};
tmpl.Pan = {};
tmpl.Info = {};
tmpl.POI = {};
tmpl.Track = {};
tmpl.Trip = {};
tmpl.Info.getPlaceFlag = false;
tmpl.Google = {};
tmpl.LayerSwitcher = {};
tmpl.ContextMenu = {};
tmpl.HeatMap = {};
tmpl.Style = {};
tmpl.Fence = {};

tmpl.mapOnClickExtraForPOIDelete;
tmpl.mapOnClickExtraForCenterMap;
var gmap_googleMap;
var layoutMapObjectAPI;
var gblTrackSameLatLong = true;
var vehicleObj;
var track_ivlDraw;
var tripTimeDelay;

var sglLayer_Background_Map;
var sglLayer_ward_boundary;
var sglLayer_ranchi_location_feature;
var sglLayer_ranchi_water_body;
var sglLayer_ranchi_hotel;
var sglLayer_ranchi_thana_boundary;
var sglLayer_ranchi_parking;
var sglLayer_ranchi_fire_station;
var sglLayer_ranchi_hospital;
var sglLayer_ranchi_streetlight;
var sglLayer_ranchi_property;
var sglLayer_ranchi_city_boundary;
var sglLayer_ranchi_dp_boundary;
var sglLayer_jharkhand_rails;
var sglLayer_jharkhand_road;
var sglLayer_jharkhand_state;
var sglLayer_jharkhand_district;
var sglLayer_jharkhand_taluka;
var sglLayer_ranchi_image1;
var pointerMoveID;
var tripPlaybackAnimation;

var sgl_baseMap;
var globalMapDivID;
var tmpl_setMap_layer_global_array = [];
var streetLayer_trinity, tmpl_setMap_layer_global = [];

(function () {

	//---------------------------------- Beginning of Creating Google Map------------------------------------//
	// **** Creating Google Map inside the specified targetDiv using the map properties specified in the appconfig.js file **** //
	//var base_map_streetLayer_trinity,base_map_trinity;



	var streetLayer_trinity, tmpl_setMap_layer_global = [];

	tmpl.Map.resetTrip = function () {
		firstrun = true;
		console.log('FIRST RUN ', firstrun);
	}

	// ********************* SDK_MAP_API (1) Creation API ********************* //
	tmpl.Map.createMap = function (param) {

		if (appConfigInfo.googleMapKey != null) {
			tmpl.Map.mapCreation(param);
		} else {
			tmpl.Map.mapCreation(param);
		}
	}

	var streetLayer_trinity, tmpl_setMap_layer_global = [];

	tmpl.Map.mapCreation = function (param) {

		if (appConfigInfo.type == "none") {
			return false;
		} else {
			var targetDiv = param.target;
			var mainMap = param.mainMap;
			var defaultZoom = param.defaultZoom;
			var callBackFun = param.callBackFun;
			var existingMapObject = param.existingMapObj;
			var googleStyled = param.googleStyle; // for google night mode
			mapmode = googleStyled;


			if (targetDiv == undefined) {
				console.log("mapCreation | Invalid target div ID");
			}
			if (googleStyled == undefined) {
				console.log("mapCreation | Invalid googleStyled parameter");
			}
			globalMapDivID = targetDiv;

			try {
				if (appConfigInfo.mapDimension == "2D") {

					if (appConfigInfo.mapLib == 'ol7') {

						if (appConfigInfo.mapData === "google") {

							var viewg;
							var map;
							if (appConfigInfo.setResolution == true || appConfigInfo.setResolution == "true") {
								viewg = new ol.View({
									center: ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'), // **** lon,lat and googlezoom are in app config file **** //
									zoom: appConfigInfo.googlezoom,
									maxZoom: appConfigInfo.googleMaxZoom,
									//extent: ol.proj.transformExtent([parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)], "EPSG:4326", "EPSG:3857"),
									minZoom: appConfigInfo.googleMinZoom
								})
							} else {
								viewg = new ol.View({
									center: ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'), // **** lon,lat and googlezoom are in app config file **** //
									zoom: parseInt(appConfigInfo.googlezoom),
									maxZoom: parseInt(appConfigInfo.googleMaxZoom),
									//extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857"),
									minZoom: parseInt(appConfigInfo.googleMinZoom)
								})
							}

							if (appConfigInfo.type == "google") {
								console.log("from api google");
								map = new ol.Map({
									layers: [new ol.layer.Tile({
										source:
											new ol.source.XYZ({
												url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
											})
									})],
									target: targetDiv,
									view: viewg,
									loadTilesWhileAnimating: true
								});
								var layers = map.getLayers();
								//map.set('ol7mObj', omap, true);
								activate(map);
								if (callBackFun) {
									callBackFun(map);
								}
								console.log("~~~~~~~~~~Map OBJm:::::::::", map);

								return map;
							} else if (appConfigInfo.type == "osm") {
								map = new ol.Map({

									layers: [new ol.layer.Tile({ source: new ol.source.OSM() })], target: targetDiv,
									view: viewg,
									loadTilesWhileAnimating: true
								});
								var layers = map.getLayers();
								//map.set('ol7mObj', omap, true);

								activate(map);
								if (callBackFun) {
									callBackFun(map);
								}
								console.log("~~~~~~~~~~Map OBJm:::::::::", map);

								return map;
							}
							else if (appConfigInfo.type == "esri") {

								map = new ol.Map({
									controls: ol.control.defaults.defaults({
										zoom: true,
										attribution: true,
										rotate: false
									}),
									layers: [],//layers: [layer1],
									target: targetDiv,
									view: viewg,
									loadTilesWhileAnimating: true,
								});
								var layers = map.getLayers();
								//layers.setAt(0, layer1); 
								layers.insertAt(0, new ol.layer.Tile({
									source: new ol.source.XYZ({
										// attributions: [
										// 	new ol.Attribution({
										// 	html: 'Tiles © <a href="' + appConfigInfo.esri_url + '">ArcGIS</a>'
										// })],
										url: appConfigInfo.esri_url + '/tile/{z}/{y}/{x}'
									})
								}));
								activate(map);
								if (callBackFun) {
									callBackFun(map);
								}
								console.log("~~~~~~~~~~Map OBJm:::::::::", map);
							}
							else if (appConfigInfo.type == "hereMaps") {
								// var map;
								var view;
								if (appConfigInfo.setResolution == true) {
									view = new ol.View({
										center: ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'), // **** lon,lat and googlezoom are in app config file **** //
										zoom: appConfigInfo.googlezoom,
										//maxZoom : appConfigInfo.googleMaxZoom,
										//extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857"),
										minZoom: appConfigInfo.gooleMinZoom
									})
								} else {
									view = new ol.View({
										center: ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'), // **** lon,lat and googlezoom are in app config file **** //
										zoom: appConfigInfo.googlezoom,
										//maxZoom : 21,
										//extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857");,
										minZoom: appConfigInfo.gooleMinZoom
									})
								}
								var tile = new ol.layer.Tile({
									source: new ol.source.XYZ({
										url: "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode,
									})
								});

								map = new ol.Map({
									controls: ol.control.defaults.defaults({
										zoom: true,
										attribution: true,
										rotate: false
									}),
									layers: [tile],
									target: targetDiv,
									pixelRatio: 1,
									view: view
								});
								activate(map);

								if (callBackFun) {
									callBackFun(map);
								}

								return map;
							}
							else {
								console.log("FromAPI @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@shhh");
								var map;
								var view;
								var baseLayer;
								var p = new ol.proj.Projection
									({
										code: appConfigInfo.projection,
										extent: [parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)],
										units: 'm',
										axisOrientation: 'neu'
									});

								if (appConfigInfo.gwc) {
									baseLayer = new ol.layer.Tile({
										visible: true,
										source: new ol.source.TileWMS({
											url: appConfigInfo.gwcurl,
											params: { 'LAYERS': appConfigInfo.layer, 'TILED': true, 'VERSION': appConfigInfo.wmsVersion },
											serverType: 'geoserver',
											transition: 0,
										})
									});

									streetLayer_trinity = new ol.layer.Tile({
										source: new ol.source.TileWMS({
											url: appConfigInfo.gwcurl,
											params: { 'LAYERS': appConfigInfo.streetLayer, 'TILED': true, 'VERSION': '1.1.1' }
										})
									});
									if (mainMap == true) {
										base_map_trinity = baseLayer;
										base_map_streetLayer_trinity = streetLayer_trinity;
									}
									if (appConfigInfo.setResolution == true) {
										view = new ol.View({
											zoom: appConfigInfo.trinityzoom,
											projection: 'EPSG:4326',
											maxZoom: appConfigInfo.trinityMaxZoom,
											center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
											extent: [parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)],
											rotation: 0,
											pixelRatio: 1,
											minZoom: appConfigInfo.trinityMinZoom
										})
									} else {
										view = new ol.View({
											zoom: appConfigInfo.trinityzoom,
											projection: 'EPSG:4326',
											center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
											extent: [parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)],
											rotation: 0,
											pixelRatio: 1,
											minZoom: appConfigInfo.trinityMinZoom
										})
									}

								}
								else {
									baseLayer = new ol.layer.Tile({
										visible: true, source: new ol.source.TileWMS({
											url: appConfigInfo.gwcurl,
											params: { 'LAYERS': appConfigInfo.layer, 'TILED': false, 'VERSION': appConfigInfo.wmsVersion },
											serverType: 'geoserver'
										})
									});
									//base_map_trinity = baseLayer;

									streetLayer_trinity = new ol.layer.Tile({
										source: new ol.source.TileWMS({
											url: appConfigInfo.gwcurl,
											params: { 'LAYERS': appConfigInfo.streetLayer, 'VERSION': '1.1.1' }
										})
									});
									if (mainMap == true) {
										base_map_trinity = baseLayer;
										base_map_streetLayer_trinity = streetLayer_trinity;
									}
									if (appConfigInfo.setResolution == true) {
										view = new ol.View({
											zoom: appConfigInfo.trinityzoom,
											projection: p,
											maxZoom: appConfigInfo.trinityMaxZoom,
											center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
											extent: [parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)],
											rotation: 0,
											pixelRatio: 1,
											minZoom: appConfigInfo.trinityMinZoom
										})
									} else {
										view = new ol.View({
											zoom: appConfigInfo.trinityzoom,
											projection: p,
											center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
											rotation: 0,
											pixelRatio: 1,
											minZoom: appConfigInfo.trinityMinZoom
										})
									}
								}
								if (appConfigInfo.trinitySatelliteView) {
									if (appConfigInfo.trinitySatellitegwc) {
										var satelliteLayer = new ol.layer.Tile({
											visible: false, source: new ol.source.TileWMS({
												url: appConfigInfo.trinitySatelliteurl,
												params: { 'LAYERS': appConfigInfo.trinitySatelliteLayer, 'TILED': true, 'VERSION': appConfigInfo.wmsVersion },
												serverType: 'geoserver'
											})
										});
									}
									else {
										var satelliteLayer = new ol.layer.Tile({
											visible: false, source: new ol.source.TileWMS({
												url: appConfigInfo.trinitySatelliteurl,
												params: { 'LAYERS': appConfigInfo.trinitySatelliteLayer, 'TILED': false, 'VERSION': appConfigInfo.wmsVersion },
												serverType: 'geoserver'
											})
										});
									}
									streetLayer_trinity = new ol.layer.Tile({
										source: new ol.source.TileWMS({
											url: appConfigInfo.gwcurl,
											params: { 'LAYERS': appConfigInfo.streetLayer, 'VERSION': '1.1.1' }
										})
									});
									if (mainMap == true) {
										base_map_streetLayer_trinity = streetLayer_trinity;
									}
									if (mainMap == true) {
										map = new ol.Map({
											interactions: ol.interaction.defaults({ doubleClickZoom: true }),
											layers: [baseLayer, base_map_streetLayer_trinity, satelliteLayer],
											target: targetDiv,
											pixelRatio: 1,
											view: view
										});
									} else {
										map = new ol.Map({
											interactions: ol.interaction.defaults({ doubleClickZoom: true }),
											layers: [baseLayer, satelliteLayer],
											target: targetDiv,
											pixelRatio: 1,
											view: view
										});
									}
									var b1 = document.createElement('button');
									var txt1 = document.createTextNode("Map");
									b1.appendChild(txt1);
									b1.title = 'Show street view';
									b1.className = 'ol-map-btn ';
									b1.addEventListener('click', function () { setBaseMap('street', baseLayer, satelliteLayer); });

									var b2 = document.createElement('button');
									var txt1 = document.createTextNode("Earth");
									b2.appendChild(txt1);
									b2.title = 'Show satellite imagery';
									b2.className = 'ol-sat-btn';
									b2.addEventListener('click', function () { setBaseMap('satellite', baseLayer, satelliteLayer); });

									var mapbtn = new ol.control.Control({
										element: b1
									});
									map.addControl(mapbtn);

									var satellitebtn = new ol.control.Control({
										element: b2
									});
									map.addControl(satellitebtn);
								}
								else {
									if (mainMap == true) {
										map = new ol.Map({
											//interactions: ol.interaction.defaults({ doubleClickZoom: true }),
											layers: [baseLayer, streetLayer_trinity],
											target: targetDiv,
											view: view
										});
										base_map_streetLayer_trinity.setVisible(false);
									} else {
										map = new ol.Map({
											interactions: ol.interaction.defaults({ doubleClickZoom: true }),
											layers: [baseLayer],
											target: targetDiv,
											view: view
										});
									}
								}
								if (mainMap == true) {
									//getTrinityLayersList(map);
								}
								if (callBackFun)
									callBackFun(map);
								console.log("Map Object..", map);
								return map;

							}
						}
					}
					else if (appConfigInfo.mapLib == 'leaflet') {
						var viewg;
						var map;
						if (appConfigInfo.type === "google") {
							map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');

							var ggl;

							ggl = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
								maxZoom: 20,
								subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
							});

							ggl.addTo(map);
							if (callBackFun)
								callBackFun(map);
							return map;
						}
						else if (appConfigInfo.type === "osm") {

							map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');
							L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
								attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							}).addTo(map);

							if (callBackFun)
								callBackFun(map);

							return map;
						}
						else if (appConfigInfo.type === "esri") {
							map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');

							L.tileLayer(
								'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {

								//maxZoom: 18,
							}).addTo(map);

							if (callBackFun)
								callBackFun(map);
						}

						else if (appConfigInfo.type === "hereMaps") {

							map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');

							L.tileLayer.provider('HEREv3.terrainDay', {
								apiKey: appConfigInfo.hereMapsAppKey
							}).addTo(map);
							if (callBackFun)
								callBackFun(map);
						}

						else {
							console.log("FromAPI @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@shhh");
							var map;
							if (appConfigInfo.setResolution == true) {

								map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.leafzoom, 'EPSG:4326', 'EPSG:3857');

							} else {
								map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.leafzoom, 'EPSG:4326', 'EPSG:3857');
							}
							var view;
							var baseLayer;

							if (appConfigInfo.gwc) {
								baseLayer = L.tileLayer.wms(appConfigInfo.mapserverURL, {
									layers: appConfigInfo.basemapLayer
								});
								baseLayer.addTo(map);

								if (callBackFun)
									callBackFun(map);

								if (mainMap == true) {
									base_map_trinity = baseLayer;
									base_map_streetLayer_trinity = streetLayer_trinity;
								}
							}
							else {
								baseLayer = L.tileLayer.wms(appConfigInfo.mapserverURL, {
									layers: appConfigInfo.basemapLayer
								});
								baseLayer.addTo(map);

								if (callBackFun)
									callBackFun(map);

								if (mainMap == true) {
									base_map_trinity = baseLayer;
									base_map_streetLayer_trinity = streetLayer_trinity;
								}
							}
							if (mainMap == true) {
							}
							if (callBackFun)
								callBackFun(map);
							console.log("Map Object..", map);
							return map;
						}
					}
				}
				else {
					console.log("!*********************** Welcome to 3D world ***************@BK***********!");
					var map;
					var esri;
					//var mapbox;
					var bing;

					Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;

					var mapbox = new Cesium.MapboxImageryProvider({
						mapId: 'mapbox.streets',
						accessToken: appConfigInfo.mapboxAccessToken
					});
					//----For Bing Map----//	
					if (appConfigInfo.type == 'bing' && appConfigInfo.mode == 'darkGray') {
						var bingDark = new Cesium.BingMapsImageryProvider({
							url: 'https://dev.virtualearth.net',
							key: 'Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR',
							mapStyle: Cesium.BingMapsStyle.CANVAS_DARK
						});
						bing = bingDark;
					}

					else if (appConfigInfo.type == 'bing' && appConfigInfo.mode == 'lightGray') {
						var bingLight = new Cesium.BingMapsImageryProvider({
							url: 'https://dev.virtualearth.net',
							key: 'Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR',
							mapStyle: Cesium.BingMapsStyle.CANVAS_GRAY  //
						});
						bing = bingLight;

					}
					else {
						var bingDefault = new Cesium.BingMapsImageryProvider({
							url: 'https://dev.virtualearth.net',
							key: 'Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR',
							//mapStyle: Cesium.BingMapsStyle.ROAD 	//BCZ, Cesium.BingMapsStyle.ROAD is Deprecated.
							mapStyle: Cesium.BingMapsStyle.CANVAS_LIGHT
						});
						bing = bingDefault;
					}
					//----For Bing Map----//

					//----For ESRI----//
					if (appConfigInfo.type == 'esri' && appConfigInfo.mode == 'darkGray') {
						var esridark = new Cesium.ArcGisMapServerImageryProvider({
							url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
							usePreCachedTilesIfAvailable: true,
						});
						esri = esridark;
					}
					else if (appConfigInfo.type == 'esri' && appConfigInfo.mode == 'lightGray') {
						var esriLight = new Cesium.ArcGisMapServerImageryProvider({
							url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer',
							usePreCachedTilesIfAvailable: true,
						});
						esri = esriLight;
					}
					else {
						var esriDefault = new Cesium.ArcGisMapServerImageryProvider({
							url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
							usePreCachedTilesIfAvailable: true,
						});
						esri = esriDefault;
					}
					//----For ESRI----//

					var esriTraffic = new Cesium.ArcGisMapServerImageryProvider({
						url: 'https://traffic.arcgis.com/arcgis/rest/services/World/Traffic/MapServer'
					});


					var osm = new Cesium.OpenStreetMapImageryProvider({
						url: '//a.tile.openstreetmap.org/'
					});
					//alert(appConfigInfo.type);
					switch (appConfigInfo.type) {
						case 'mapbox':
							// code block
							basemap3D = mapbox;
							break;
						case 'bing':
							// code block
							basemap3D = bing;
							break;
						case '3Doffline':
							// code block
							basemap3D = osm;
							break;
						case 'esri':
							// code block
							basemap3D = esri;
							break;
						case 'osm':
							// code block
							basemap3D = osm;
							break;
						default:
							// code block
							basemap3D = osm;
					}

					var worldTerrain = Cesium.createWorldTerrain({
						requestWaterMask: true,
						requestVertexNormals: true
					});

					//OSM Building
					var osmBuildingsTileset = Cesium.createOsmBuildings();

					map = new Cesium.Viewer(targetDiv, {
						terrainProvider: worldTerrain, //Cesium.createWorldTerrain(),
						imageryProvider: basemap3D,
						baseLayerPicker: true,
						fullscreenButton: true,
						geocoder: true,
						infoBox: true,
						sceneModePicker: true,
						selectionIndicator: true,
						timeline: false,
						navigationHelpButton: false,
						navigationInstructionsInitiallyVisible: false,
						//creditViewport: '',
						animation: false,
						shadows: false,
						contextOptions: {
							webgl: {
								preserveDrawingBuffer: true
							}
						}
					});
					map.camera.setView({
						destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 60000) //Comment after Dahod demo on 03-12-2019
					});
					if (callBackFun) {
						callBackFun(map);
					}

					var handler = new Cesium.ScreenSpaceEventHandler(map.scene.canvas);

					document.getElementsByClassName("cesium-infoBox")[0].style.visibility = "hidden";

					try {
						$(map.animation.container).css('visibility', 'hidden');
					} catch (e) { }

					map.camera.setView({
						destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 60000)
					});
					if (appConfigInfo.offline === true) {
						console.log("Offline:", appConfigInfo.offline);
						try {

							var imageryLayers = map.imageryLayers;
							var geoWmsLayer = new Cesium.WebMapServiceImageryProvider({
								// name: layerTitle,
								url: appConfigInfo.mapserverURL,
								layers: appConfigInfo.basemapLayer,
								// enablePickFeatures: false,
								parameters: {
									format: 'image/png',
									transparent: true
								}
							});
							geoWmsLayer.name = appConfigInfo.basemapLayer;
							imageryLayers.addImageryProvider(geoWmsLayer);

						} catch (e) {
							console.log("Custom Map Load Error..!");
						}
						//}, 5000);
					}
					else {
						console.log("Offline Error:", appConfigInfo.offline);
					}

					//***************************************** GETOVERLAYFEATUREDETAILS *************************************************//
					var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
					var ellipsoid = map.scene.globe.ellipsoid;
					var scene = map.scene;
					var camera = map.camera;
					scene.screenSpaceCameraController.enableZoom = true;
					scene.screenSpaceCameraController.enableTranslate = true;
					var handler = new Cesium.ScreenSpaceEventHandler(map.scene.canvas);
					handler.setInputAction(function (click) {
						//alert(12);
						var position = camera.pickEllipsoid(click.position);
						// //console.log(position);
						var pickedObject = scene.pick(click.position);
						if (map.selectedEntity != undefined) {
							// console.log("selectedEntity======>",mapObj.selectedEntity);	
							entity = map.selectedEntity;
							id = entity.id;
							layerNm = entity.name;
							if (entity.position != undefined) {
								cartesian = entity._position.getValue();
								if (cartesian != undefined) {
									cartographic = ellipsoid.cartesianToCartographic(cartesian);
									longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
									latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
									coord = [longitudeString, latitudeString];
								}
								else {
								}
								var properties = entity.entProp;

							} else if (entity.polygon != undefined) { }
							if (map.selectedEntity.entProp.type == "Non-Clustered Entity") {
								// alert("Non-Clustered");
								getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, map);
								// terminateShape();
							}
							else if (map.selectedEntity.entProp.type == "Clustered Entity") {
								// alert("Clustered");
								getOverlayFeatureDetails([id.toString()], coord, layerNm, [properties], map);
							}
							else if (map.selectedEntity.entProp.type == "3D Model") {
								// alert("Clustered");
								getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, map);
							}
							else if (map.selectedEntity.name == "Boundary Point") { }
							else { }
						} else if (Cesium.defined(position) && Cesium.defined(pickedObject)) {			//getOverlayFeatureDetails FOR CLUSTERED POINTS COUNT
							// console.log("pickedObject: ",pickedObject);
							var cartographic = ellipsoid.cartesianToCartographic(position);
							var longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
							var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
							latlng = [];
							latlng.push(longitudeDegrees);
							latlng.push(latitudeDegrees);

							var clusterIds = [];
							var clusterEntities = [];
							var layerName = null;
							for (var i = 0; i < pickedObject.id.length; i++) {
								clusterIds.push(pickedObject.id[i].id);
								clusterEntities.push(pickedObject.id[i].entProp);
								layerName = pickedObject.id[i].name;
							}
							getOverlayFeatureDetails(clusterIds, latlng, layerName, clusterEntities, map);
						}
					}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
					return map;
				}
			}

			catch (err) {
				console.error("ERROR Map.createMap: ", err);
			}
		}
	}


	var feature_poi_edit_id;
	var feature_poi_edit_layer;
	var feature_poi_edit_layer_callback;
	var feature_spatial_edit_id;
	var feature_spatial_edit_layer;
	var feature_spatial_edit_layer_callback;;
	activate = function (mapObj) {
		//function activate(mapObj){
		var popupboolian_title = false;
		mapObj.on('pointermove', function (e) {
			if (e.dragging) return;
			try {
				var pixel = mapObj.getEventPixel(e.originalEvent);
			} catch (e) { }
			try {
				var hit = mapObj.hasFeatureAtPixel(pixel);
			} catch (e) { }
			try {
				mapObj.getTargetElement().style.cursor = hit ? 'pointer' : '';
			} catch (e) { }

		});
		mapObj.on('moveend', function (evt) {
			try {
				var overlayID = mapObj.getOverlayById('clusterOverlayID');
				if (overlayID) { mapObj.removeOverlay(overlayID); }
			} catch (e) { };
		});
		mapObj.on('click', function (evt) {
			var pixel = mapObj.getEventPixel(evt.originalEvent);
			if (mapObj.hasFeatureAtPixel(pixel)) {
				var layerName;
				var coordinate = evt.coordinate;
				var layerObj;
				var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
					layerObj = layer;
					//console.log("feature,layer ????",feature,layer);
					if (layer == null) {
						//console.log("feature.get('layer_name') ???",feature.get('layer_name'));
						if (feature.get('layer_name')) {
							layerName = feature.get('layer_name');
							popupboolian_title = false;
							return feature;
						}
						else {
							popupboolian_title = true;
							return null;
						}
					} else if (layer) {
						if (layer) {
							//console.log(layer.get('title'));
							if (layer.get('title')) {
								layerName = layer.get('title');
								popupboolian_title = false;
								return feature;
							}
							else {
								popupboolian_title = true;
								return null;
							}
						}
					}
					else {
						popupboolian_title = true;
					}
				});
				//console.log("popupboolian_title ????",popupboolian_title);
				if (popupboolian_title == false) {
					var geometry = feature.getGeometry();
					var coord;
					if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
						//console.log(geometry);
						coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
					}
					else if (appConfigInfo.mapData == 'esri') {
						//console.log(geometry);
						coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
					}
					else {
						coord = evt.coordinate;
					}
					var id;
					//test1 = feature;
					if (feature.get('id') === undefined) {
						id = null;
					}
					else {

						id = feature.get('id');

					}
					var properties = feature.getProperties();

					if (id == 'c_' + feature_poi_edit_id && layerName == feature_poi_edit_layer + '_API_CircleLayer') {
						feature_poi_edit_layer_callback(id, coord, layerName, properties);
					}
					else if (feature_spatial_edit_id == id && feature_spatial_edit_layer == layerName) {
						feature_spatial_edit_layer_callback(id, coord, layerName, properties);
					} else {
						//alert()
						//test12 = layerObj;

						if (layerObj != null) {

							if (layerObj.get('cluster') == true) {
								//alert();
								var ids = [], properties1 = [];
								for (var k = 0; k < feature.get('features').length; k++) {
									ids[k] = feature.get('features')[k].get('id');
									properties1[k] = feature.get('features')[k].getProperties();
								}

								getOverlayFeatureDetails(ids, coord, layerName, properties1, mapObj);
							} else if (layerName == "Draw_Route_Layer") {

								tmpl.Geocode.getGeocode({
									point: coord,
									callbackFunc: handleGeocode
								});
								function handleGeocode(a) {
									//console.log(a.address);
									properties.address = a.address;
									//console.log(id,coord,layerName,properties);
									getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
								}

							} else {

								getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
							}
						} else {
							//console.log("else3");
							//console.log(id,coord,layerName,properties,mapObj);
							getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
						}
					}

				}
			} else {
				if (tmpl.Info.getPlaceFlag == true) {
					var coordinate = evt.coordinate;

					var x = parseFloat(coordinate[0]);
					var y = parseFloat(coordinate[1]);
					var coordinates = { lat: y, lng: x };
					var result = {};
					if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {

						if (appConfigInfo.type == 'sgl') {
							//coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
							console.log("coordinates:", coordinates);

							function handleGeocode(data) {
								console.log(data.address);

							}
							tmpl.Geocode.getGeocode({
								point: [coordinates.lng, coordinates.lat],
								callbackFunc: handleGeocode
							});
						}
						if (appConfigInfo.type == 'esri') {
							coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
							console.log("coordinates--->:", coordinate);

							var x = parseFloat(coordinate[0]);
							var y = parseFloat(coordinate[1]);
							var coordinates = { lat: y, lng: x };



							function handleGeocode(data) {
								console.log("----->", data);

								var place = data;
								var placeName = place;
								result = {
									place: [placeName],
									latitude: y,
									longitude: x,
									type: 'All'
								};
								resultStatus = true;
								tmpl.Info.getPlace.CallbackFunc(result);
							}
							tmpl.Geocode.getGeocode({
								point: [coordinates.lng, coordinates.lat],
								callbackFunc: handleGeocode
							});
						}

						else {
							var coordinate = evt.coordinate;
							coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
							var x = parseFloat(coordinate[0]);
							var y = parseFloat(coordinate[1]);
							var coordinates = { lat: y, lng: x };
							var result = {};
							var geocoder = new google.maps.Geocoder();
							console.log("geocoder -> ", geocoder);
							geocoder.geocode({
								'latLng': coordinates
							}, function (results, status) {
								console.log("geocode -> ", results, status);
								if (status == google.maps.GeocoderStatus.OK) {
									if (results[0]) {
										//console.log(results[0]);
										var place = results[0].formatted_address;
										var placeName = place;
										result = {
											place: [placeName],
											latitude: y,
											longitude: x,
											type: (results[0].types).join()
										};
										resultStatus = true;
									}
								} else {
									result = {
										place: "",
										latitude: y,
										longitude: x,
										type: ""
									};
								}
								console.log("geocode result", result);
								tmpl.Info.getPlace.CallbackFunc(result);
							});

						}
					}
					else {

						console.log("evt.coordinate:", evt.coordinate);
						var coordinate = evt.coordinate;
						//coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
						var x = parseFloat(coordinate[0]);
						var y = parseFloat(coordinate[1]);
						var coordinates = { lat: y, lng: x };
						var result = {};
						if (appConfigInfo.type == 'sgl') {
							console.log("coordinates:", coordinates);


							//tmpl.Info.getPlace.CallbackFunc(result);
						}
						else {

							//console.log(x,y);
							function handleLandMarks(data) {
								//alert();
								//console.log(data);
								result = {
									place: [data.address],
									latitude: y,
									longitude: x,
									type: "all"
								};
								//console.log("result >>",result);
								tmpl.Info.getPlace.CallbackFunc(result);
							}


							tmpl.Geocode.getGeocode({
								point: [x, y],
								callbackFunc: handleLandMarks
							});

							/*	tmpl.Search.getLandMarks({
								map : map,
								point : [x,y],
								radius : 20000,
								POI_type : "all",
								Max_num_POIs : 1,
								callbackFunc : handleLandMarks
							});	*/
						}
					}
				}
			}
		});


		try {

			console.log("Map Div::", mapObj.getTargetElement().id);

			var divPrint = mapObj.getTargetElement().id;
			gmap = mapObj;

			$('#' + divPrint).append('<div id="dropdownMapExport" class="dropdown" style="position: absolute; right: 1%; top: 3%;display:none" ><button class="dropbtn">Export Map</button><div class="dropdown-content"><a id="mappng">PNG</a><a id="mapjpeg">JPEG</a></div>');

			if (appConfigInfo.isExportReq == true || appConfigInfo.isExportReq == "true") {
				document.getElementById("dropdownMapExport").style.display = "block";
			} else {

				document.getElementById("dropdownMapExport").style.display = "none";
			}

		} catch (e) { console.log("Error in Legent..!", e); }


		try {
			console.log("Map Div::", mapObj.getTargetElement().id);


			var div = document.createElement("div");
			//div.style.width = "15%";
			//div.style.height = "40%";
			//div.style.display= 'block';
			div.style.display = 'none';
			div.style.background = "rgb(64 64 64)";
			div.style.color = "white";
			//div.style.border = "2px solid #454444";
			div.style.top = "8%";
			div.style.right = "3%";
			div.style.position = "absolute";
			div.style.zIndex = "1000";
			div.id = 'MapPrint';
			div.style.padding = '1%';
			document.getElementById(mapObj.getTargetElement().id).appendChild(div);

			var printmapform = "<form id='customSelect'><label for='format'>Page size: </label><br><select id='format'><option value='a0'>A0 (slow)</option><option value='a1'>A1</option><option value='a2'>A2</option><option value='a3'>A3</option><option value='a4' selected>A4</option></select><br><label for='resolution'>Resolution: </label><br><select id='resolution'><option value='56'>56 DPI (fast)</option><option value='72'>72 DPI</option><option value='90'>90 DPI</option><option value='120'>120 DPI</option><option value='150'>150 DPI</option><option value='190'>190 DPI</option><option value='250'>250 DPI</option><option value='300'>300 DPI (slow)</option></select><br><label for='layout'>Layout: </label><br><select id='layout'><option value='portrait'>Portrait</option><option value='landscape'>Landscape</option></select><br><label for='resolution'><label for='download'>Download As:</label><br><select id='download'><option value='pdf'>PDF</option><option value='jpeg'>Jpeg</option><option value='png'>PNG</option></select><br><br><div id='divcenter'><button id='export-pdf'>Download</button></div><div id='loadingDiv' style='display:none;'><img id='animatedGIF' src='" + appConfigInfo.mapSDKURL + "loading.gif' /></div></form>";

			$('#MapPrint').append(printmapform);

			var div = document.createElement("div");
			div.style.width = "15%";
			div.style.height = "35%";
			div.style.display = 'none';
			div.style.background = "rgb(173, 173, 173)";
			//div.style.color = "white";
			div.style.border = "2px solid #454444";
			div.style.bottom = "1%";
			div.style.right = "1%";
			div.style.position = "absolute";
			div.id = 'MapDivLegent';
			div.style.padding = '.5%';
			document.getElementById(mapObj.getTargetElement().id).appendChild(div);


			var matable = "<table height=100%><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/city.png' height=20 width=20></td><td>City Border </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/nh.png' height=20 width=20></td><td>Road NH & Major </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/Minor.png' height=20 width=20></td><td>Road Minor & Colony </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/park.png' height=20 width=20></td><td> Park & Gardens </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/railway.png' height=20 width=20></td><td>Railway Network </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/bridge.png' height=20 width=20></td><td>Bridge </td></tr><tr><td><img src='" + appConfigInfo.mapSDKURL + "api_img/food.png' height=20 width=20></td><td>Food Path</td></tr></table>"

			$('#MapDivLegent').append(matable);

		} catch (e) { console.log("Error in Legent..!", e); }



	}


	function enablePointerMove(mapObj, event) {
		var pixel = mapObj.getEventPixel(event.originalEvent);
		var hit = mapObj.hasFeatureAtPixel(pixel);
		mapObj.getViewport().style.cursor = hit ? 'pointer' : '';
	}

	function disablePointerMove(mapObj) {
		mapObj.un('click', myFunc)
	}

	function setBaseMap(val, bLayer, sLayer) {
		if (val === 'satellite') {
			bLayer.setVisible(false);
			sLayer.setVisible(true);

		}
		else {
			bLayer.setVisible(true);
			sLayer.setVisible(false);

		}
	}


	function mapdivChangeAction(mapObject) {
		console.log("mapObject=====================>", mapObject);
		// alert("mapdivChangeAction");				
		var mapDivId = mapObject.getTarget();
		if (mapObject.getTarget().id != undefined) {
			mapDivId = mapObject.getTarget().id;
		}
		var tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
		document.getElementById(mapDivId).style.height = (parseInt(tempVar[0]) - 1) + tempVar[1];
		setTimeout(function () {
			tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
			document.getElementById(mapDivId).style.height = (parseInt(tempVar[0]) + 1) + tempVar[1];
		}, 200);
	}



	// **** Toggle handler for Street and Satellite view of Google map**** //
	function toggleGoogleMap(val, mapobj) {
		console.log("toggleGoogleMap");
		var layers = mapobj.getLayers();
		mapobj.removeLayer(layers.item(0));
		var googleLayer;
		if (val === 'satellite') {
			googleLayer = new olgm.layer.Google({
				mapTypeId: google.maps.MapTypeId.HYBRID
			});
		}
		else {
			googleLayer = new olgm.layer.Google({
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		}
		layers.insertAt(0, googleLayer);
		mapdivChangeAction(mapobj);
	}



	var baseMapLayerObjects = [];
	tmpl.Map.getBaseMaps = function () {
		var osmLayer = new ol.layer.Tile({
			source: new ol.source.OSM()
		});
		var esriLayer = new ol.layer.Tile({
			source: new ol.source.XYZ({
				attributions: [new ol.Attribution({
					html: 'Tiles © <a href="' + appConfigInfo.esri_url + '">ArcGIS</a>'
				})],
				url: appConfigInfo.esri_url + '/tile/{z}/{y}/{x}'
			})
		})
		var stamen1 = new ol.layer.Tile({
			source: new ol.source.Stamen({
				layer: 'watercolor'
			})
		});
		var stamen2 = new ol.layer.Tile({
			source: new ol.source.Stamen({
				layer: 'terrain-labels'
			})
		});

		var hereMapSatlite = new ol.layer.Tile({
			visible: true, source: new ol.source.XYZ({
				url: "https://{1-4}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?apiKey=" + appConfigInfo.hereMapsAppKey
			})
		});

		var hereMapDark = new ol.layer.Tile({
			visible: true, source: new ol.source.XYZ({
				url: "https://{1-4}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.night.grey/{z}/{x}/{y}/256/png8?apiKey=" + appConfigInfo.hereMapsAppKey
			})
		});


		var hereMapnormal = new ol.layer.Tile({
			visible: true, source: new ol.source.XYZ({
				url: "https://{1-4}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=" + appConfigInfo.hereMapsAppKey
			})
		});


		baseMapLayerObjects[0] = osmLayer;
		baseMapLayerObjects[1] = esriLayer;
		baseMapLayerObjects[2] = stamen1;
		baseMapLayerObjects[3] = stamen2;
		baseMapLayerObjects[8] = hereMapSatlite;
		baseMapLayerObjects[9] = hereMapDark;
		baseMapLayerObjects[10] = hereMapnormal;

		var basemaps = [
			{ name: 'Google Road Map', id: 2 }
			, { name: 'Google Night Map', id: 7 } //google night mode
			, { name: 'Google Satellite Map', id: 3 }
			, { name: 'Open Street Map', id: 1 }
			, { name: 'ESRI Map', id: 4 }
			, { name: 'SGL Map', id: 5 }

		];
		return basemaps;
	}

	// ********************* SDK_MAP_API (5) SwitchBaseMap ********************* //
	tmpl.Map.switchBaseMaps = function (param) {
		var mapobj = param.map;
		var id = param.id;

		try {
			if (mapobj === null || mapobj === undefined) {
				console.log('tmpl.Map.switchBaseMaps : Not a Valid Map Object.');
				return response = { statusCode: 400, message: 'Invalid Map Object' };
			}
			else {
				console.log('tmpl.Map.switchBaseMaps : A Valid Map Object.');
			}

			if (id > 5) {
				console.log("Error message : Invalid id object parameter");
				return response = 'Invalid ID';
			}
			else {
				console.log('tmpl.Map.switchBaseMaps : Valid id Object param.');
			}
		} catch (error) {
			if (error instanceof Error) {
				// Error code handling
				console.log("tmpl.Map.switchBaseMaps | ", error.message);
			}
		}
		if (appConfigInfo.mapDimension == '2D') {
			if (appConfigInfo.mapLib == 'ol7') {
				try {
					var layers = mapobj.getLayers();
					mapobj.removeLayer(layers.item(0));
					if (id == 1) {
						console.log("tmpl.Map.switchBaseMaps : You are Switch to OSM Map");
						var osmLayer = new ol.layer.Tile({
							source: new ol.source.OSM()
						});
						layers.insertAt(0, osmLayer);
					}
					else if (id == 2) {
						console.log("tmpl.Map.switchBaseMaps : You are Switch to Google street Map");
						var googleLayer = new ol.layer.Tile({
							source:
								new ol.source.XYZ({
									url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
								})
						}); // 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
						layers.insertAt(0, googleLayer);
					}
					else if (id == 3) {
						console.log("tmpl.Map.switchBaseMaps : You are Switch to Google Satellite");
						var googleSatelliteLayer = new ol.layer.Tile({
							source:
								new ol.source.XYZ({
									//url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
									url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
									//url: 'https://mt1.google.com/vt/lyrs=mt&hl=en&x={x}&y={y}&z={z}',
								})
						});
						layers.insertAt(0, googleSatelliteLayer);
					}
					else if (id == 4) {
						console.log("tmpl.Map.switchBaseMaps : You are Switch to ESRI Map");
						var esriLayer = new ol.layer.Tile({
							source: new ol.source.XYZ({
								url: appConfigInfo.esri_url + '/tile/{z}/{y}/{x}'
							})
						});
						layers.insertAt(0, esriLayer);
					}
					console.log('tmpl.Map.switchBaseMaps | Status :', true);
				} catch (error) {
					console.error("error", error);
				}
			}
			else if (appConfigInfo.mapLib == 'leaflet') {

				try {
					if (id == 1) {
						var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}).addTo(mapobj);
					}
					else if (id == 2) {
						var googleLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
							maxZoom: 20,
							subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
						}).addTo(mapobj);
					}
					else if (id == 3) {
						var googleSatelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
							maxZoom: 20,
							subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
						}).addTo(mapobj);
					}
					else if (id == 4) {
						var esriLayer = L.tileLayer(
							'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
							//maxZoom: 18,
						}).addTo(mapobj);

					}
					console.log("switchBaseMaps!!", true)

				} catch (error) {
					console.error("error", error);
				}
			}
		}

		else {
			try {
				var existing = mapobj.imageryLayers.get(0);
				mapobj.imageryLayers.remove(existing);
				if (id == 0) {
					console.log("from api - OSM map");
					console.log("from api - OSM Map", window.gMapObj);
					mapobj.imageryLayers.addImageryProvider(baseMapLayerObjects[0]);
				}
				else if (id == 1) {
					console.log("from api - ESRI map");
					console.log("from api - ESRI Map", window.gMapObj);
					mapobj.imageryLayers.addImageryProvider(baseMapLayerObjects[1]);
				}


			} catch (error) {
				console.log("3D Map switchBaseMaps Error..!", error)
			}
		}
	}

	// ********************* SDK_MAP_API (4)toLayer ********************* //
	tmpl.Map.resize = function (param) {
		var mapObj = param.map;

		try {
			if (mapObj === null || mapObj === undefined) {
				console.log('tmpl.Map.resize : Not a Valid Map Object.');
				return response = 'Invalid Map Object';
			}
			else {
				console.log('tmpl.Map.resize : A Valid Map Object.');
			}
		} catch (error) {
			if (error instanceof Error) {
				// Error code handling
				console.log("tmpl.Map.resize : ", error.message);
			}
		}

		if (appConfigInfo.mapLib == 'ol7') {
			if (appConfigInfo.mapData === 'google') {
				mapObj.updateSize();
				var layers = mapObj.getLayers();
				var googleLayer = layers.item(0);
				mapObj.removeLayer(googleLayer);
				try {
					layers.insertAt(0, googleLayer);
				} catch (e) { }

			}
			else {
				//mapObj.updateSize();
				mapObj.updateSize();
				var layers = mapObj.getLayers();
				var googleLayer = layers.item(0);
				mapObj.removeLayer(googleLayer);
				try {
					layers.insertAt(0, googleLayer);
				} catch (e) { }
			}
		} else {
			// Function to resize the map
			function resizeMap() {
				mapObj.invalidateSize(); // Refreshes the map tiles and adjusts the map size
			}

			window.addEventListener('resize', resizeMap);

		}
	}
	// ********************* SDK_MAP_API (4)toLayer********************* //
	var gbl_allClusterLayers = [];
	var tmpl_setMap_layer_global = [];
	tmpl.Map.remove = function (param) {
		var mapObj = param.map;
		//tmpl_setMap_layer_global = [];

		try {
			if (mapObj === null || mapObj === undefined) {
				console.log('tmpl.Map.remove : Not a Valid Map Object.');
				return response = 'Invalid Map Object';
			}
			else {
				console.log('tmpl.Map.remove : A Valid Map Object.');
			}
		} catch (error) {
			if (error instanceof Error) {
				// Error code handling
				console.log("tmpl.Map.remove : ", error.message);
			}
		}

		if (appConfigInfo.mapLib == 'ol7') {
			for (var k = 0; k < gbl_allClusterLayers.length; k++) {
				try {
					mapObj.removeLayer(gbl_allClusterLayers[k]);
				} catch (e) { }
			}
			gbl_allClusterLayers = [];

			var allLayers = mapObj.getLayers();
			var layerLength = allLayers.getLength();
			for (var j = 0; j < layerLength; j++) {
				var lyr1 = allLayers.item(j);
				if (lyr1) {
					mapObj.removeLayer(lyr1);
				}
			}
			for (var j = 0; j < tmpl_setMap_layer_global; j++) {
				var lyr1 = tmpl_setMap_layer_global[j].layer;
				if (lyr1) {
					lyr1.setMap(null);
				}
			}

			tmpl_setMap_layer_global = [];
			mapObj.setTarget(null);
			mapObj = null;
			delete mapObj;
		}
		else {
			gmap.eachLayer(function (layer) {
				gmap.removeLayer(layer);
			});
			gmap.off();
		}
	}

	// ********************* SDK_MAP_API (4)toLayer********************* //
	tmpl.Zoom.toXYcustomZoom = function (param) {
		var mapObj = param.map;
		var zoomLevel = param.zoom;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == 'ol7') {

					if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {

						if (appConfigInfo.type == 'sgl') {
							mapObj.getView().setCenter([lng, lat]);
							mapObj.getView().setZoom(zoomLevel);
						}
						else {
							//mapObj.getView().setZoom(zoomLevel);
							mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:4326'));
							mapObj.getView().setZoom(zoomLevel);
						}

					}
					else if (appConfigInfo.mapData == "pentab") {
						//mapObj.getView().setZoom(zoomLevel);
						mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:4326'));
						mapObj.getView().setZoom(zoomLevel);
					}

					else {
						mapObj.getView().setCenter([lng, lat]);
						mapObj.getView().setZoom(zoomLevel);
					}
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

					mapObj.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
						duration: 1.5,

					});
				}
			}
		}
		catch (err) {
			console.error("ERROR Zoom.toXYcustomZoom: ", err);
		}
	}
	// ********************* SDK_MAP_API (4)createWithCluster********************* //
	tmpl.Overlay.createWithCluster = function (param) {
		var mapObj = param.map;
		gbl_clusterMap = mapObj;
		var jsonobj = param.features;
		var radius = param.radius;
		var distance = param.distance;
		var fillColor = param.fillColor;
		var countTextColor = param.countTextColor;
		var allLayer = param.allLayer;
		var layerName = param.layer;
		var layerSwitcher = param.layerSwitcher;
		var getdata = jsonobj;
		var getHoverLabel = param.getHoverLabel;
		var showLabel = param.showLabel;
		var showLabelZoom = param.showLabelZoom;

		if (mapObj === null || mapObj === undefined) {
			console.log('tmpl.Overlay.createWithCluster : Not a Valid Map Object.');
			//return response = 'Invalid Map Object';
		}

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == 'ol7') {

					if (allLayer == true) {
						allClusterTypeData = [];
						allClusterType = [];
					}
					if (getdata.length == 0) {
						return false;
					}
					if (showLabelZoom == undefined) {
						showLabelZoom = 14;
					}
					if (countTextColor == undefined) {
						countTextColor = '#fff';
					}
					var featureDataAry = [];
					var length = getdata.length;
					var i = 0;
					while (i < length) {
						var geometry;
						if (appConfigInfo.mapData === 'google') {
							geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
						}
						else {
							var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
							geometry = new ol.geom.Point(coordinate);
						}
						var featureval = new ol.Feature({
							geometry: geometry

						});
						featureval.set('img_url', getdata[i].img_url);
						featureval.set('ff', getdata[i].img_url);
						featureval.setProperties(getdata[i]);
						featureval.setId(getdata[i].id);
						featureval.set('layer_name', layerName);
						featureDataAry.push(featureval);
						if (allLayer == true) {
							if (allClusterType.indexOf(getdata[i].category_id) == -1) {
								allClusterType.push(getdata[i].category_id);
								allClusterTypeData[getdata[i].category_id] = [];
							}
							allClusterTypeData[getdata[i].category_id].push(featureval);
							//
						}
						i++;
					}
					var source = new ol.source.Vector({
						features: featureDataAry
					});
					var clusterSource = new ol.source.Cluster({
						distance: distance,
						source: source
					});
					var styleCache = {};
					var Layers = mapObj.getLayers();
					var length = Layers.getLength();
					var OverlayisLayerPresent = false;
					for (var i = 0; i < length; i++) {
						var layerTemp = Layers.item(i);
						if (layerTemp.get('title') == layerName) {
							OverlayisLayerPresent = false;
							layerTemp.getSource().clear();
							try {
								mapObj.removeLayer(layerTemp);
							}
							catch (e) {
							}
							break;
						}
					}
					if (OverlayisLayerPresent == false) {
						var overlay = new ol.layer.Vector({
							title: layerName,
							'cluster': true,
							visible: true,
							source: clusterSource,
							style: function (fea12) {
								if (fea12 != undefined) {
									var size = fea12.get('features').length;
									for (var j = 0; j < fea12.get('features').length; j++) {
										if (fea12.get('features')[j].get('img_url') == '') {
											size = size - 1;
										}
									}
									var style = styleCache[size];
									var style2 = styleCache[size];
									dd = fea12;
									if (size == 1) {
										if (showLabel == true) {
											if (gbl_clusterMap.getView().getZoom() > showLabelZoom) {
												style2 = new ol.style.Style({
													image: new ol.style.Icon(({
														anchor: [0.5, 1],
														src: fea12.get('features')[0].getProperties().img_url
													})),
													text: new ol.style.Text({
														text: fea12.get('features')[0].getProperties().label,
														offsetY: 7,
														fill: new ol.style.Fill({
															color: "rgb(0, 0, 0)",
														}),
														stroke: new ol.style.Stroke({
															width: 2,
															color: "rgba(255,255,255,0.9)"//"#FFFFFF",
														}),
													})
												});
											} else {
												style2 = new ol.style.Style({
													image: new ol.style.Icon(({
														anchor: [0.5, 1],
														src: fea12.get('features')[0].getProperties().img_url
													}))
												});
											}

										} else {
											style2 = new ol.style.Style({
												image: new ol.style.Icon(({
													anchor: [0.5, 1],
													src: fea12.get('features')[0].getProperties().img_url
												})),
											});
										}

										fea12.setStyle(style2);
									} else if (size == 0) {
										style = new ol.style.Style({
											image: new ol.style.Circle({
												radius: 0,
												stroke: new ol.style.Stroke({
													color: 'rgba(0,0,0,0)'
												}),
												fill: new ol.style.Fill({
													color: 'rgba(0,0,0,0)'
												})
											})
										});
										styleCache[size] = style;
									} else {
										//if (!style) {
										if (showLabel == true) {
											if (gbl_clusterMap.getView().getZoom() > showLabelZoom) {

												var cLabel = size.toString();
												if (fea12.get('features')[0].getProperties().location != undefined) {
													cLabel = size.toString() + '\n' + fea12.get('features')[0].getProperties().location;
												}

												style = new ol.style.Style({
													image: new ol.style.Circle({
														radius: radius,
														stroke: new ol.style.Stroke({
															color: '#fff'
														}),
														fill: new ol.style.Fill({
															color: fillColor
														})
													}),
													text: new ol.style.Text({
														text: cLabel,//(size.toString()+'\n'+fea12.get('features')[0].getProperties().location),
														offsetY: 7,
														fill: new ol.style.Fill({
															color: 'rgb(0, 0, 0)',
														}),
														stroke: new ol.style.Stroke({
															width: 2,
															color: "rgba(255,255,255,0.9)"//"#FFFFFF",
														}),
													})
												});
											}
											else {
												console.log("from api showLabel else -", showLabel);
												style = new ol.style.Style({
													image: new ol.style.Circle({
														radius: radius,
														stroke: new ol.style.Stroke({
															color: '#fff'
														}),
														fill: new ol.style.Fill({
															color: fillColor
														})
													}),
													text: new ol.style.Text({
														text: size.toString(),
														fill: new ol.style.Fill({
															color: countTextColor
														}),
														stroke: new ol.style.Stroke({
															width: 1,
															color: countTextColor
														})
													})
												});
											}

										} else {
											style = new ol.style.Style({
												image: new ol.style.Circle({
													radius: radius,
													stroke: new ol.style.Stroke({
														color: '#fff'
													}),
													fill: new ol.style.Fill({
														color: fillColor
													})
												}),
												text: new ol.style.Text({
													text: size.toString(),
													fill: new ol.style.Fill({
														color: countTextColor
													}),
													stroke: new ol.style.Stroke({
														width: 1,
														color: countTextColor
													})
												})
											});
										}

										styleCache[size] = style;
										//}
									}
								}
								return style;
							}
						});
						vv = overlay;
						OverlayisLayerPresent = true;
						gbl_allClusterLayers.push(overlay);

						tmpl_setMap_layer_global_array.push({
							layer: overlay,
							title: layerName,
							visibility: true,
							map: mapObj
						});
						console.log("CLUSTER>>>>>", tmpl_setMap_layer_global_array);
						mapObj.addLayer(overlay);
					}
					if (getHoverLabel == true) {
						var ta_tooltip = document.createElement('tooltip');
						ta_tooltip.id = 'trip-tooltip';
						ta_tooltip.className = 'ol-trip-tooltip';
						var overlay_mouseOver_label = new ol.Overlay({
							element: ta_tooltip,
							offset: [10, 0],
							positioning: 'bottom-left'
						});
						mapObj.addOverlay(overlay_mouseOver_label);
						mapObj.on('pointermove', function (evt) {
							var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
								if (layer) {
									if (feature.getProperties().features.length > 1) {
										var fea = feature.getProperties().features[0];
										//console.log("FT >>",fea.get('layer_name')); 
										if (fea.get('layer_name') == layerName) {
											return fea;
										}
									} else {
										return false;
									}
								}
							});
							ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
							if (feature_mouseOver) {
								overlay_mouseOver_label.setPosition(evt.coordinate);
								ta_tooltip.innerHTML = feature_mouseOver.getProperties().location;
							}
						});
					}
					return true;

				}
			}
			else {
				// var dataSource = new Cesium.CustomDataSource('points');
				var dataSource = new Cesium.CustomDataSource(layerName);

				dataSource.clustering.pixelRange = distance;
				dataSource.clustering.minimumClusterSize = 2;
				dataSource.clustering.enabled = true;

				mapObj.dataSources.add(dataSource);

				var forceCluster = function () {
					dataSource.clustering.pixelRange = 0;
					dataSource.clustering.pixelRange = distance;
				};

				for (var i = 0; i < jsonobj.length; i++) {

					var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';

					for (var key2 in jsonobj[i]) {
						var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
						switch (key2) {
							case "id":
								break;

							case "imgurl":
								break;

							case "img_url":
								break;

							case "layer_name":
								break;

							case "label_color":
								break;

							case "label_bgcolor":
								break;

							case "fileurl":
								if (jsonobj[i].upload_status) {
									description += '<tr><th>' + attr + '</th><td><a href=' + jsonobj[i][key2] + '>Attachment</a></td></tr>';
								}
								else {
									description += '<tr><th>' + attr + '</th><td>No Attachment</td></tr>';
								}
								break;

							default: description += '<tr><th>' + attr + '</th><td>' + jsonobj[i][key2] + '</td></tr>';
						}
					}
					description += '</tbody></table>';

					var clusterFeatures = dataSource.entities.add({
						position: Cesium.Cartesian3.fromDegrees(jsonobj[i].lon, jsonobj[i].lat),
						point: {
							// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//RELATIVE_TO_GROUND
						},
						id: jsonobj[i].id,
						name: layerName,
						description: description,
						entProp: jsonobj[i],
						billboard: {
							image: jsonobj[i].img_url,
							//verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							//heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
						},
						label: {
							text: jsonobj[i].label,
							show: true,
							showBackground: true,
							fillColor: Cesium.Color.TRANSPARENT,
							backgroundColor: Cesium.Color.TRANSPARENT
						}
					});
					clusterFeatures.entProp.type = "Clustered Entity";
				}

				// setTimeout(forceCluster, 1000);

				var clusterFillColor = Cesium.Color.fromCssColorString(fillColor);
				var pinBuilder = new Cesium.PinBuilder();
				var pin100 = pinBuilder.fromText('100+', clusterFillColor, 48).toDataURL();
				var pin90 = pinBuilder.fromText('90+', clusterFillColor, 48).toDataURL();
				var pin80 = pinBuilder.fromText('80+', clusterFillColor, 48).toDataURL();
				var pin70 = pinBuilder.fromText('70+', clusterFillColor, 48).toDataURL();
				var pin60 = pinBuilder.fromText('60+', clusterFillColor, 48).toDataURL();
				var pin50 = pinBuilder.fromText('50+', clusterFillColor, 48).toDataURL();
				var pin40 = pinBuilder.fromText('40+', clusterFillColor, 48).toDataURL();
				var pin30 = pinBuilder.fromText('30+', clusterFillColor, 48).toDataURL();
				var pin20 = pinBuilder.fromText('20+', clusterFillColor, 48).toDataURL();
				var pin10 = pinBuilder.fromText('10+', clusterFillColor, 48).toDataURL();
				var pin5 = pinBuilder.fromText('5+', clusterFillColor, 48).toDataURL();
				var pin3 = pinBuilder.fromText('3+', clusterFillColor, 48).toDataURL();


				dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
					// console.log("clusteredEntities: ",clusteredEntities);
					cluster.label.show = false;
					cluster.billboard.show = true;
					cluster.billboard.id = cluster.label.id;
					cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;


					var x = clusteredEntities.length;
					switch (true) {
						case (x >= 100):
							cluster.billboard.image = pin100;
							break;

						case (x >= 90):
							cluster.billboard.image = pin90;
							break;

						case (x >= 80):
							cluster.billboard.image = pin80;
							break;

						case (x >= 70):
							cluster.billboard.image = pin70;
							break;

						case (x >= 60):
							cluster.billboard.image = pin60;
							break;

						case (x >= 50):
							cluster.billboard.image = pin50;
							break;

						case (x >= 40):
							cluster.billboard.image = pin40;
							break;

						case (x >= 30):
							cluster.billboard.image = pin30;
							break;

						case (x >= 20):
							cluster.billboard.image = pin20;
							break;

						case (x >= 10):
							cluster.billboard.image = pin10;
							break;

						case (x >= 5):
							cluster.billboard.image = pin5;
							break;

						case (x >= 3):
							cluster.billboard.image = pin3;
							break;

						default:
							cluster.billboard.image = pin3;
							break;
					}
				});
				setTimeout(forceCluster, 1000);

				//////////////////////////////////////////////// GETOVERLAYFEATUREDETAILS ////////////////////////////////////////////////
				var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
				var ellipsoid = mapObj.scene.globe.ellipsoid;
				var scene = mapObj.scene;
				var camera = mapObj.camera;
				scene.screenSpaceCameraController.enableZoom = true;
				scene.screenSpaceCameraController.enableTranslate = true;
				var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);
				handler.setInputAction(function (click) {
					//alert(12);
					var position = camera.pickEllipsoid(click.position);
					//console.log(mapObj._dataSourceCollection);
					var pickedObject = scene.pick(click.position);
					if (mapObj.selectedEntity != undefined) {
						// console.log("selectedEntity======>",mapObj.selectedEntity);	
						entity = mapObj.selectedEntity;
						id = entity.id;
						layerNm = entity.name;
						if (entity.position != undefined) {
							cartesian = entity._position.getValue();
							// // console.log("cartesian: ",cartesian);
							if (cartesian != undefined) {
								cartographic = ellipsoid.cartesianToCartographic(cartesian);
								longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
								latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
								coord = [longitudeString, latitudeString];
							}
							else {
							}
							var properties = entity.entProp;


						} else if (entity.polygon != undefined) { }
						if (mapObj.selectedEntity.entProp.type == "Non-Clustered Entity") {
							// alert("Non-Clustered");
							getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
							// terminateShape();
						}
						else if (mapObj.selectedEntity.entProp.type == "Clustered Entity") {
							// alert("Clustered");
							getOverlayFeatureDetails([id.toString()], coord, layerNm, [properties], mapObj);
						}
						else if (mapObj.selectedEntity.entProp.type == "3D Model") {
							// alert("Clustered");
							getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
						}
						else if (mapObj.selectedEntity.name == "Boundary Point") { }
						else { }
					} else if (Cesium.defined(position) && Cesium.defined(pickedObject)) {			//getOverlayFeatureDetails FOR CLUSTERED POINTS COUNT
						// console.log("pickedObject: ",pickedObject);
						var cartographic = ellipsoid.cartesianToCartographic(position);
						var longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
						var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
						latlng = [];
						latlng.push(longitudeDegrees);
						latlng.push(latitudeDegrees);

						var clusterIds = [];
						var clusterEntities = [];
						var layerName = null;
						for (var i = 0; i < pickedObject.id.length; i++) {
							clusterIds.push(pickedObject.id[i].id);
							clusterEntities.push(pickedObject.id[i].entProp);
							layerName = pickedObject.id[i].name;
						}

						//----------//
						var clength = clusterEntities.length;

						if (clength > 0) {
							//var mapHeight = mapObj.mapHeight;
							//var cartographic = ellipsoid.cartesianToCartographic(position);
							var cartesian = new Cesium.Cartesian3();  //console.log("cartesian", cartesian); 
							var cartographic = new Cesium.Cartographic();
							//console.log("cartographic", cartographic); 
							//var camera = mapObj.scene.camera; //errpt
							//console.log("ellipsoid", ellipsoid); //getpt
							//console.log("position",position);  //getpt
							//console.log("camera",camera);  //getpt

							ellipsoid.cartesianToCartographic(camera.position, cartographic);
							//console.log("cartographic11", cartographic); //getpt
							var height = cartographic.height; // convert to meters
							//console.log("height", height);

							var zoominheight = height - 370609;  //270609
							//console.log("zoominheight", zoominheight);
							cartographic.height = zoominheight;
							ellipsoid.cartographicToCartesian(cartographic, cartesian);
							camera.position = cartesian;
							//console.log("camera.position", cartesian);
							//mapZoomLevel(zoominheight);	

							if (cartographic.height < 370609) {
								//console.log("===========",cartographic.height);
								//alert("Vieeee");
								zoominheight = height - 90000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 55000) {
								zoominheight = height - 20000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 35000) {
								zoominheight = height - 15000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 25000) {
								zoominheight = height - 10000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 15000) {
								zoominheight = height - 5000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 8000) {
								zoominheight = height - 2000;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}

							if (cartographic.height < 3000) {
								zoominheight = height - 800;
								cartographic.height = zoominheight;
								ellipsoid.cartographicToCartesian(cartographic, cartesian);
								camera.position = cartesian;
								//console.log("===========", cartographic.height);
								//mapZoomLevel(zoominheight);
							}
							//mapZoomLevel(zoominheight);					
							//console.log("ellipsoid2", cartographic.height);

							//console.log("----->", clusterIds, latlng, layerName, clusterEntities, mapObj);


						}
						else {
							getOverlayFeatureDetails(clusterIds, latlng, layerName, clusterEntities, mapObj);

						}
						//--------------
					}
					else if (mapObj._dataSourceCollection) {
						console.log(mapObj._dataSourceCollection);
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			}
		}
		catch (err) {
			//console.error("ERROR Overlay.createWithCluster: ",err);
		}
	}

	// ********************* SDK_MAP_API (4)toLayer********************* //
	tmpl.Zoom.toLayer = function (param) {
		var mapObj = param.map;
		var lyrname = param.layer;
		var zoomLevel = appConfigInfo.searchZoom;
		if (param.zoomLevel) {
			zoomLevel = param.zoomLevel;
		}
		if (mapObj === null || mapObj === undefined) {
			console.log('tmpl.Zoom.toLayer : Not a Valid Map Object.');
			//return response = 'Invalid Map Object';
		}
		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == "ol7") {
					var Layers = mapObj.getLayers();
					var length = Layers.getLength();
					var existing;
					for (var i = 0; i < length; i++) {
						var existingLayer = Layers.item(i);
						if (existingLayer.get('title') == lyrname) {
							existing = existingLayer;
							var extent = existingLayer.getSource().getExtent();
							if (extent[0] == extent[2] && extent[1] == extent[3]) {
								console.log("extent1 -> ", extent);
								var point = [extent[0], extent[1]];

								if (appConfigInfo.mapData == 'google') {
									point = ol.proj.transform(point, 'EPSG:4326', 'EPSG:4326');
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
							}
							break;
						}
					}
					if (existing == undefined) {
						for (var i = 0; i < tmpl_setMap_layer_global_array.length; i++) {
							if (tmpl_setMap_layer_global_array[i].title == lyrname) {
								var extent = tmpl_setMap_layer_global_array[i].layer.getSource().getExtent();
								//console.log(extent);
								if (extent[0] == extent[2] && extent[1] == extent[3]) {
									console.log("extent1 -> ", extent);
									var point = [extent[0], extent[1]];
									point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
									tmpl.Zoom.toXYcustomZoom({
										map: mapObj,
										zoom: zoomLevel,
										latitude: point[1],
										longitude: point[0]
									});
								} else {
									//console.log("extent2 -> ", extent);
									var point = [extent[0], extent[1]];
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
	}
	// ********************* SDK_MAP_API (4)toXYcustomZoom********************* //
	tmpl.Zoom.toXYcustomZoom = function (param) {
		var mapObj = param.map;
		var zoomLevel = param.zoom;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);


		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == "ol7") {
					if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {

						if (appConfigInfo.type == 'sgl') {
							mapObj.getView().setCenter([lng, lat]);
							mapObj.getView().setZoom(zoomLevel);
						}
						else {
							//mapObj.getView().setZoom(zoomLevel);
							mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
							mapObj.getView().setZoom(zoomLevel);
						}

					}
					else if (appConfigInfo.mapData == "pentab") {
						//mapObj.getView().setZoom(zoomLevel);
						mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:4326'));
						mapObj.getView().setZoom(zoomLevel);
					}

					else {
						mapObj.getView().setCenter([lng, lat]);
						mapObj.getView().setZoom(zoomLevel);
					}
				}

				if (appConfigInfo.mapLib == "leaflet") {


				}


			}
		}
		catch (err) {
			console.error("ERROR Zoom.toXYcustomZoom: ", err);
		}
	}
	// ********************* SDK_MAP_API (4)addWMSLayer********************* //
	tmpl.Map.addWMSLayer = function (param) {
		var mapObj = param.map;
		var layerUrl = param.layerUrl;
		var layerName = param.layerName;
		var layerTitle = param.layerTitle;
		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == "ol7") {

					var paramsObj = {
						'LAYERS': layerName,
						'TILED': true,
						'VERSION': appConfigInfo.wmsVersion
					};

					if (param.cql_filter) {
						paramsObj['CQL_FILTER'] = param.cql_filter;
					}
					if (param.viewparams) {
						paramsObj['VIEWPARAMS'] = param.viewparams;
					}
					//console.log("paramsObj -> ", paramsObj);
					var WMSlayerObj = new ol.layer.Tile({
						visible: true,
						source: new ol.source.TileWMS({
							url: layerUrl,
							crossOrigin: 'anonymous',
							params: paramsObj,
							serverType: 'geoserver'
						})
					});

					mapObj.addLayer(WMSlayerObj);
					WMSlayerObj.setProperties({ title: layerTitle });
				}
				if (appConfigInfo.mapLib == "leaflet") {
					var wmsLayer = L.tileLayer.wms(layerUrl, {
						layers: layerName,
						format: 'image/png',
						transparent: true,
						version: '1.1.1',
						attribution: 'WMS Layer Attribution'
					}).addTo(mapObj);
				}
			}
		}
		catch (err) {
			console.error("ERROR Map.addWMSLayer: ", err);
		}
	}
	// ********************* SDK_MAP_API (4)removeWMSLayer********************* //
	tmpl.Map.removeWMSLayer = function (param) {
		var mapObj = param.map;
		var layerTitle = param.layerTitle;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapLib == "ol7") {
					var Layers = mapObj.getLayers();
					var length = Layers.getLength();
					for (var i = 0; i < length; i++) {
						var existingLayer = Layers.item(i);
						if (existingLayer) {
							if (existingLayer.get('title') === layerTitle) {
								mapObj.removeLayer(existingLayer);
							}
						}
					}
				}
			}
			else {
				if (layerTitle != undefined) {
					for (var i = 0; i < mapObj.imageryLayers._layers.length; i++) {
						// if(mapObj.imageryLayers._layers[i]._imageryProvider._layers == layerTitle){
						if (mapObj.imageryLayers._layers[i].imageryProvider.name == layerTitle) {
							var wms = mapObj.imageryLayers._layers[i];
							mapObj.imageryLayers.remove(wms);
						}
					}
				}
				else {
					console.error("ERROR: WMS Layer name not specified");
				}
			}
		}
		catch (err) {
			console.error("ERROR Map.removeWMSLayer: ", err);
		}
	}

	//----------------------------------- Beginning of Information Tool ------------------------------------//

	tmpl.Tooltip.add = function (param) {
		var mapObj = param.map;
		var offset = param.offset;
		var coord = param.coordinate;
		var featureDatas = param.html;
		var position;
		var allOverlays = mapObj.getOverlays();
		for (var i = 0; i < allOverlays.getLength(); i++) {
			overlay = allOverlays.item(i);
			if (overlay) {
				if (overlay.get('olname') === 'custToolTipOverlay') {
					mapObj.removeOverlay(overlay);
				}
			}
		}
		var popup = new ol.Overlay.Popup({
			insertFirst: false,
			panMapIfOutOfView: true
		});
		popup.setOffset(offset);
		popup.setProperties({ olname: "custToolTipOverlay" });
		mapObj.addOverlay(popup);
		if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
			position = ol.proj.transform([coord[0], coord[1]], 'EPSG:4326', 'EPSG:3857');
		}
		else {
			position = coord;
		}
		popup.show(position, featureDatas);
	}

	tmpl.Tooltip.addMultiple = function (param) {
		var mapObj = param.map;
		var offset = param.offset;
		var coord = param.coordinate;
		var featureDatas = param.html;
		var position;
		/*var allOverlays = mapObj.getOverlays();
		for(var i=0;i<allOverlays.getLength();i++){
			overlay=allOverlays.item(i);
			if(overlay){
				if(overlay.get('olname') === 'custToolTipOverlay'){
					mapObj.removeOverlay(overlay);
				}
			}
		}*/
		var popup = new ol.Overlay.Popup({
			insertFirst: false,
			panMapIfOutOfView: true
		});
		popup.setOffset(offset);
		popup.setProperties({ olname: "custToolTipOverlayMultiple" });
		mapObj.addOverlay(popup);
		if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
			position = ol.proj.transform([coord[0], coord[1]], 'EPSG:4326', 'EPSG:3857');
		}
		else {
			position = coord;
		}
		popup.show(position, featureDatas);
		return popup;
	}

	tmpl.Tooltip.remove = function (param) {
		var mapObj = param.map;
		var overlay;
		var allOverlays = mapObj.getOverlays();
		for (var i = 0; i < allOverlays.getLength(); i++) {
			overlay = allOverlays.item(i);
			if (overlay) {
				if (overlay.get('olname') === 'custToolTipOverlay') {
					overlay.setPosition(undefined);
				}
			}
		}
	}

	//--------------------------------------- End of Information Tool --------------------------------------//

	// **** Restricting Map Extent functionality**** //

	// var polygon_ex;  remove this variable after checking it is not used in any other functions.

	function mapLocation(mapObj, lat_X1, lon_Y1, lat_X2, lon_Y2) {
		var polygon_ex;
		var olGM2 = new olgm.OLGoogleMaps({
			map: mapObj
		});
		var gmap = olGM2.getGoogleMapsMap();
		var map_cen;
		function setExtend(lat1, lng1, lat2, lng2) {
			var last_perfect_cen, last_zoom;
			var start = new google.maps.LatLng(lat1, lng1);
			var end = new google.maps.LatLng(lat2, lng2);
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(start);
			bounds.extend(end);

			var convertBounds, x1, y1, x2, y2, extent;
			convertBounds = bounds.toString();
			convertBounds = convertBounds.slice(2, -2);
			convertBounds = convertBounds.split("), (");
			x1 = parseFloat(convertBounds[0].split(",")[0]);
			y1 = parseFloat(convertBounds[0].split(",")[1]);
			x2 = parseFloat(convertBounds[1].split(",")[0]);
			y2 = parseFloat(convertBounds[1].split(",")[1]);

			extent = [y1, x1, y2, x2];
			mapObj.on("moveend", function (e) {
				var centerz = mapObj.getView().getCenter();
				var rp_centerz = ol.proj.transform([centerz[0], centerz[1]], 'EPSG:3857', 'EPSG:4326');
				rp_centerz = rp_centerz.toString().split(",");
				polygon_ex = turf.polygon([[[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]]);
				var point = turf.point([parseFloat(rp_centerz[1]), parseFloat(rp_centerz[0])]);
				var intersects = turf.intersect(point, polygon_ex);
				if (intersects) {
					var lastcenterz = mapObj.getView().getCenter();
					last_perfect_cen = ol.proj.transform([lastcenterz[0], lastcenterz[1]], 'EPSG:3857', 'EPSG:4326');
					last_zoom = mapObj.getView().getZoom();
				}
				else {
					alert("You are beyond the Project Area,redirecting to previous zoomed center");
					mapObj.getView().setCenter(ol.proj.transform([last_perfect_cen[0], last_perfect_cen[1]], 'EPSG:4326', 'EPSG:3857'));
					mapObj.getView().setZoom(last_zoom);
				}
			});
			mapObj.getView().on('propertychange', function (e) {
				var zoomlevel = mapObj.getView().getZoom();
				if (zoomlevel < 9) {
					mapObj.getView().setCenter(lat, lon);
					mapObj.getView().setZoom(21);
				}
			});
		} setExtend(lat_X1, lon_Y1, lat_X2, lon_Y2);
	}

	// **** Please write this function description here **** //

	activate = function (mapObj) {
		//function activate(mapObj){
		var popupboolian_title = false;
		mapObj.on('pointermove', function (e) {
			// if (e.dragging) return;
			// var pixel = mapObj.getEventPixel(e.originalEvent);
			// var hit = mapObj.hasFeatureAtPixel(pixel);
			// mapObj.getTargetElement().style.cursor = hit ? 'pointer' : '';
		});
		mapObj.on('click', function (evt) {

			var pixel = mapObj.getEventPixel(evt.originalEvent);
			if (mapObj.hasFeatureAtPixel(pixel)) {
				var layerName;
				var coordinate = evt.coordinate;
				var layerObj;
				var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
					layerObj = layer;
					//console.log("feature,layer ????",feature,layer);
					if (layer == null) {
						//console.log("feature.get('layer_name') ???",feature.get('layer_name'));
						if (feature.get('layer_name')) {
							layerName = feature.get('layer_name');
							popupboolian_title = false;
							return feature;
						}
						else {
							popupboolian_title = true;
							return null;
						}
					} else if (layer) {
						if (layer) {
							//console.log(layer.get('title'));
							if (layer.get('title')) {
								layerName = layer.get('title');
								popupboolian_title = false;
								return feature;
							}
							else {
								popupboolian_title = true;
								return null;
							}
						}
					}
					else {
						popupboolian_title = true;
					}
				});
				//console.log("popupboolian_title ????",popupboolian_title);
				if (popupboolian_title == false) {
					var geometry = feature.getGeometry();
					var coord;
					// if(appConfigInfo.mapData==='google'){
					if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
						//console.log(geometry);
						coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
					}
					else {
						coord = evt.coordinate;
					}
					var id;
					//test1 = feature;
					if (feature.get('id') === undefined) {
						id = null;
					}
					else {

						id = feature.get('id');

					}
					var properties = feature.getProperties();

					if (id == 'c_' + feature_poi_edit_id && layerName == feature_poi_edit_layer + '_API_CircleLayer') {
						feature_poi_edit_layer_callback(id, coord, layerName, properties);
					}
					else if (feature_spatial_edit_id == id && feature_spatial_edit_layer == layerName) {
						feature_spatial_edit_layer_callback(id, coord, layerName, properties);
					} else {
						//alert()
						//test12 = layerObj;

						if (layerObj != null) {

							if (layerObj.get('cluster') == true) {
								//alert();
								var ids = [], properties1 = [];
								for (var k = 0; k < feature.get('features').length; k++) {
									ids[k] = feature.get('features')[k].get('id');
									properties1[k] = feature.get('features')[k].getProperties();
								}

								getOverlayFeatureDetails(ids, coord, layerName, properties1, mapObj);
							} else if (layerName == "Draw_Route_Layer") {

								tmpl.Geocode.getGeocode({
									point: coord,
									callbackFunc: handleGeocode
								});
								function handleGeocode(a) {
									//console.log(a.address);
									properties.address = a.address;
									//console.log(id,coord,layerName,properties);
									getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
								}

							} else {

								getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
							}
						} else {
							//console.log("else3");
							//console.log(id,coord,layerName,properties,mapObj);
							getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
						}
					}

				}
			} else {
				if (tmpl.Info.getPlaceFlag == true) {
					if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
						var coordinate = evt.coordinate;
						coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
						var x = parseFloat(coordinate[0]);
						var y = parseFloat(coordinate[1]);
						var coordinates = { lat: y, lng: x };
						var result = {};
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							'latLng': coordinates
						}, function (results, status) {

							if (status == google.maps.GeocoderStatus.OK) {
								if (results[0]) {
									//console.log(results[0]);
									var place = results[0].formatted_address;
									var placeName = place;
									result = {
										place: [placeName],
										latitude: y,
										longitude: x,
										type: (results[0].types).join()
									};
									resultStatus = true;
								}
							}

							tmpl.Info.getPlace.CallbackFunc(result);
						});
					}
					else {
						var coordinate = evt.coordinate;
						//coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
						var x = parseFloat(coordinate[0]);
						var y = parseFloat(coordinate[1]);
						var coordinates = { lat: y, lng: x };
						var result = {};
						//console.log(x,y);
						function handleLandMarks(data) {
							//alert();
							//console.log(data);
							result = {
								place: [data[0].name],
								latitude: y,
								longitude: x,
								type: data[0].type
							};
							//console.log("result >>",result);
							tmpl.Info.getPlace.CallbackFunc(result);
						}

						tmpl.Search.getLandMarks({
							map: map,
							point: [x, y],
							radius: 20000,
							POI_type: "all",
							Max_num_POIs: 1,
							callbackFunc: handleLandMarks
						});

					}
				}
			}
		});
	}

	// **** Map Resize **** //

	tmpl.Map.resize = function (param) {
		var mapObj = param.map;
		// alert("Map Resize API");
		if (mapObj) {
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				mapObj.updateSize();
				var layers = mapObj.getLayers();
				var googleLayer = layers.item(0);
				mapObj.removeLayer(googleLayer);
				try {
					layers.insertAt(0, googleLayer);



					// mapdivChangeAction(mapObj);
				} catch (e) { }

			}
			else {
				mapObj.updateSize();
			}
		}
	}

	tmpl.Map.remove = function (param) {
		var mapObj = param.map;
		//tmpl_setMap_layer_global = [];
		if (mapObj) {
			for (var k = 0; k < gbl_allClusterLayers.length; k++) {
				try {
					mapObj.removeLayer(gbl_allClusterLayers[k]);
				} catch (e) { }
			}
			gbl_allClusterLayers = [];

			var allLayers = mapObj.getLayers();
			var layerLength = allLayers.getLength();
			for (var j = 0; j < layerLength; j++) {
				var lyr1 = allLayers.item(j);
				if (lyr1) {
					mapObj.removeLayer(lyr1);
				}
			}
			for (var j = 0; j < tmpl_setMap_layer_global; j++) {
				var lyr1 = tmpl_setMap_layer_global[j].layer;
				if (lyr1) {
					lyr1.setMap(null);
				}
			}

			tmpl_setMap_layer_global = [];
			mapObj.setTarget(null);
			mapObj = null;
			delete mapObj;
		}
	}

	tmpl.Layer.remove = function (param) {
		var mapObj = param.map;
		var layer = param.layer;
		var existing;
		var Layers = mapObj.getLayers();
		console.log(Layers);
		var length = Layers.getLength();
		console.log(length);
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layer) {
					// if(existingLayer.get('lname') === layer){
					existing = existingLayer;
					mapObj.removeLayer(existingLayer);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layer) {
					mapObj.removeLayer(tmpl_setMap_layer_global[i]);
				}
			}
		}
	}



	/*
	tmpl.Map.getJuridiction = function(param){
		var mapObj = param.map;
		//var visibility = param.visibility;
		var urlL = "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/ps/PoliceJuriction";
		$.ajax({
			url:urlL,
			success: function (data) {
				var format = new ol.format.WKT();
				var policeJuriData =  data; 	
					var policeJurifeatureDataArray=[];
					for (var i = 0,length = policeJuriData.length; i < length; i++) {
					var policeJurifeature = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature.setProperties(policeJuriData[i]);
					policeJurifeature.set('id',policeJuriData[i].gid);
					policeJurifeature.set('layer_name','police_Juridiction');
					policeJurifeatureDataArray.push(policeJurifeature);
					}
					var policeJurifeatureDataArray1=[];
					for (var i = 0,length = policeJuriData.length; i < length; i++) {
					var policeJurifeature1 = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature1.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature1.setProperties(policeJuriData[i]);
					var policeJuriStyle1 = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#000000',
							width: 1
						})
					}); 
					policeJurifeature1.setStyle(policeJuriStyle1);
					policeJurifeature1.set('id',policeJuriData[i].gid);
					policeJurifeature1.set('layer_name','police_Juridiction');
					policeJurifeatureDataArray1.push(policeJurifeature1);
					}
					var policeJurifeatureDataArray2=[];
					for (var i = 0,length = policeJuriData.length; i < length; i++) {
					var policeJurifeature2 = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature2.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature2.setProperties(policeJuriData[i]);
					var policeJuriStyle2 = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#000000',
							width: 1
						})
					}); 
					policeJurifeature2.setStyle(policeJuriStyle2);
					policeJurifeature2.set('id',policeJuriData[i].gid);
					policeJurifeature2.set('layer_name','police_Juridiction');
					policeJurifeatureDataArray2.push(policeJurifeature2);
					}
			  	
					var police_juridiction = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray
					  })
					  });
					var police_juridictionlastlevel = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray1
					})
				});  
					
					var police_juridictionBlacklevel = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray2
					})
				});  
					
					police_juridiction.setProperties({lname:'police_JuridictionBoundary'});
					police_juridiction.setProperties({title:'police_JuridictionBoundary'});
					
					police_juridictionlastlevel.setProperties({lname:'police_Juridiction'});
					police_juridictionlastlevel.setProperties({title:'police_Juridiction'});
					
					police_juridictionBlacklevel.setProperties({lname:'police_Juridiction'});
					police_juridictionBlacklevel.setProperties({title:'police_Juridiction'});
					
					tmpl_setMap_layer_global.push({
					layer : police_juridictionBlacklevel,
					title :  'police_Juridiction',
					visibility : false,
					map : mapObj
				});
					
					tmpl_setMap_layer_global.push({
					layer : police_juridictionlastlevel,
					title :  'police_Juridiction',
					visibility : false,
					map : mapObj
				});
				
					tmpl_setMap_layer_global.push({
					layer : police_juridiction,
					title :  'police_JuridictionBoundary',
					visibility : false,
					map : mapObj
				});
					
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				
				police_juridictionBlacklevel.setMap(mapObj);
				police_juridictionlastlevel.setMap(mapObj);
				police_juridiction.setMap(mapObj);
				
				for(i=1;i<length;i++){
					var existingLayer=Layers.item(i);
						mapObj.removeLayer(existingLayer);
				}
				
				for(var i=1;i<length;i++){
					var existingLayer=Layers.item(i);
						mapObj.addLayer(existingLayer);
				}
				for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					if(tmpl_setMap_layer_global[i].title != 'police_Juridiction'){
						if(tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj){
							tmpl_setMap_layer_global[i].layer.setMap(null);
							tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						}
					}
				}
				for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					if(tmpl_setMap_layer_global[i].title != 'police_JuridictionBoundary'){
						if(tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj){
							tmpl_setMap_layer_global[i].layer.setMap(null);
							tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						}
					}
				}
				
				
					var fillcolorArray = ['rgba(207, 83, 0, 0.5)','rgba(255, 102, 51, 0.5)','rgba(51, 0, 0, 0.5)','rgba(153, 51, 255, 0.5)','rgba(0, 0, 204, 0.5)','rgba(0, 255, 255, 0.5)','rgba(173, 255, 47, 0.5)','rgba(255, 102, 255, 0.5)','rgba(204, 204, 102, 0.5)','rgba(133, 92, 51, 0.5)','rgba(220, 20, 60, 0.5)','rgba(0, 153, 102, 0.5)','rgba(255, 215, 0, 0.5)','rgba(102, 0, 204, 0.5)','rgba(246, 227, 206, 0.5)','rgba(172, 250, 88, 0.5)','rgba(88, 130, 250, 0.5)','rgba(247, 211, 88, 0.5)','rgba(88, 172, 250, 0.5)','rgba(46, 46, 254, 0.5)','rgba(254, 46, 247, 0.5)','rgba(255, 255, 0, 0.5)','rgba(4, 180, 49, 0.5)','rgba(254, 46, 154, 0.5)','rgba(254, 46, 46, 0.5)','rgba(0, 255, 0,0.5)','rgba(154, 46, 254, 0.5)','rgba(223, 1, 165, 0.5)','rgba(0, 102, 51, 0.5)','rgba(8, 106, 135, 0.5)','rgba(8, 138, 104, 0.5)','rgba(180, 95, 4, 0.5)','rgba(206, 246, 206, 0.5)','rgba(246, 206, 216, 0.5)','rgba(224, 224, 248, 0.5)','rgba(250, 88, 88, 0.5)','rgba(188, 245, 169, 0.5)','rgba(246, 227, 206, 0.5)','rgba(180, 4, 174, 0.5)','rgba(207, 83, 0, 0.5)','rgba(255, 102, 51, 0.5)','rgba(51, 0, 0, 0.5)','rgba(153, 51, 255, 0.5)','rgba(198, 141, 141, 0.5)','rgba(0, 255, 255, 0.5)','rgba(173, 255, 47, 0.5)','rgba(255, 102, 255, 0.5)','rgba(204, 204, 102, 0.5)','rgba(204, 204, 102, 0.5)','rgba(133, 92, 51, 0.5)','rgba(220, 20, 60, 0.5)','rgba(0, 153, 102, 0.5)','rgba(255, 215, 0, 0.5)','rgba(102, 0, 204, 0.5)','rgba(172, 250, 88, 0.5)','rgba(88, 130, 250, 0.5)','rgba(247, 211, 88, 0.5)','rgba(88, 172, 250, 0.5)','rgba(46, 46, 254, 0.5)','rgba(254, 46, 247, 0.5)','rgba(255, 255, 0, 0.5)','rgba(4, 180, 49, 0.5)','rgba(254, 46, 154, 0.5)','rgba(254, 46, 46, 0.5)','rgba(0, 255, 0, 0.5)','rgba(154, 46, 254, 0.5)','rgba(223, 1, 165, 0.5)','rgba(189, 189, 189, 0.5)','rgba(8, 106, 135, 0.5)','rgba(8, 138, 104, 0.5)','rgba(180, 95, 4, 0.5)','rgba(206, 246, 206, 0.5)','rgba(246, 206, 216, 0.5)','rgba(224, 224, 248, 0.5)','rgba(250, 88, 88, 0.5)','rgba(188, 245, 169, 0.5)','rgba(246, 227, 206, 0.5)','rgba(180, 4, 174, 0.5)','rgba(246, 227, 206, 0.5)','rgba(207, 83, 0, 0.5)','rgba(255, 102, 51, 0.5)','rgba(51, 0, 0, 0.5)','rgba(153, 51, 255, 0.5)','rgba(198, 141, 141, 0.5)','rgba(0, 255, 255, 0.5)','rgba(173, 255, 47, 0.5)','rgba(255, 102, 255, 0.5)','rgba(204, 204, 102, 0.5)','rgba(133, 92, 51, 0.5)','rgba(220, 20, 60, 0.5)','rgba(0, 153, 102, 0.5)','rgba(255, 215, 0, 0.5)','rgba(102, 0, 204, 0.5)','rgba(172, 250, 88, 0.5)','rgba(88, 130, 250, 0.5)','rgba(247, 211, 88, 0.5)','rgba(88, 172, 250, 0.5)','rgba(46, 46, 254, 0.5)','rgba(254, 46, 247, 0.5)','rgba(255, 255, 0, 0.5)','rgba(4, 180, 49, 0.5)','rgba(254, 46, 154, 0.5)','rgba(133, 92, 51, 0.5)'];
				var strokecolorArray = ['rgb(207, 83, 0)','rgb(255, 102, 51)','rgb(51, 0, 0)','rgb(153, 51, 255)','rgb(0, 0, 204)','rgb(0, 255, 255)','rgb(173, 255, 47)','rgb(255, 102, 255)','rgb(204, 204, 102)','rgb(133, 92, 51)','rgb(220, 20, 60)','rgb(0, 153, 102)','rgb(255, 215, 0)','rgb(102, 0, 204)','rgb(246, 227, 206)','rgb(172, 250, 88)','rgb(88, 130, 250)','rgb(247, 211, 88)','rgb(88, 172, 250)','rgb(46, 46, 254)','rgb(254, 46, 247)','rgb(255, 255, 0)','rgb(4, 180, 49)','rgb(254, 46, 154)','rgb(254, 46, 46)','rgb(0, 255, 0,0.5)','rgb(154, 46, 254)','rgb(223, 1, 165)','rgb(0, 102, 51)','rgb(8, 106, 135)','rgb(8, 138, 104)','rgb(180, 95, 4)','rgb(206, 246, 206)','rgb(246, 206, 216)','rgb(224, 224, 248)','rgb(250, 88, 88)','rgb(188, 245, 169)','rgb(246, 227, 206)','rgb(180, 4, 174)','rgb(207, 83, 0)','rgb(255, 102, 51)','rgb(51, 0, 0)','rgb(153, 51, 255)','rgb(198, 141, 141)','rgb(0, 255, 255)','rgb(173, 255, 47)','rgb(255, 102, 255)','rgb(204, 204, 102)','rgb(204, 204, 102)','rgb(133, 92, 51)','rgb(220, 20, 60)','rgb(0, 153, 102)','rgb(255, 215, 0)','rgb(102, 0, 204)','rgb(172, 250, 88)','rgb(88, 130, 250)','rgb(247, 211, 88)','rgb(88, 172, 250)','rgb(46, 46, 254)','rgb(254, 46, 247)','rgb(255, 255, 0)','rgb(4, 180, 49)','rgb(254, 46, 154)','rgb(254, 46, 46)','rgb(0, 255, 0)','rgb(154, 46, 254)','rgb(223, 1, 165)','rgb(189, 189, 189)','rgb(8, 106, 135)','rgb(8, 138, 104)','rgb(180, 95, 4)','rgb(206, 246, 206)','rgb(246, 206, 216)','rgb(224, 224, 248)','rgb(250, 88, 88)','rgb(188, 245, 169)','rgb(246, 227, 206)','rgb(180, 4, 174)','rgb(246, 227, 206)','rgb(207, 83, 0)','rgb(255, 102, 51)','rgb(51, 0, 0)','rgb(153, 51, 255)','rgb(198, 141, 141)','rgb(0, 255, 255)','rgb(173, 255, 47)','rgb(255, 102, 255)','rgb(204, 204, 102)','rgb(133, 92, 51)','rgb(220, 20, 60)','rgb(0, 153, 102)','rgb(255, 215, 0)','rgb(102, 0, 204)','rgb(172, 250, 88)','rgb(88, 130, 250)','rgb(247, 211, 88)','rgb(88, 172, 250)','rgb(46, 46, 254)','rgb(254, 46, 247)','rgb(255, 255, 0)','rgb(4, 180, 49)','rgb(254, 46, 154)','rgb(133, 92, 51)'];
					var zoom = mapObj.getView().getZoom();
			  	
					//police_juridiction.setVisible(false);
					//police_juridictionBlacklevel.setVisible(false);
					//police_juridictionlastlevel.setVisible(false);
			  	
					police_juridiction.setVisible(true);
					police_juridictionBlacklevel.setVisible(true);
					police_juridictionlastlevel.setVisible(true);
				for (k=0; k<policeJurifeatureDataArray.length; k++){
					var style = new ol.style.Style({
						stroke: new ol.style.Stroke({
						  color: strokecolorArray[k],
						  width: 2,
						  lineDash:
	 [12,30],
						  offsetX: 0,
						  offsetY: 0,
						})
					})
					policeJurifeatureDataArray[k].setStyle(style);
				}	
				    
				tmpl.Map.juridictionBoundary = function(param){ 		       
					var visibility = param.visibility;
				
					
					for(var i=0;i<tmpl_setMap_layer_global.length;i++){
							if(tmpl_setMap_layer_global[i].title == 'police_JuridictionBoundary'){
								tmpl_setMap_layer_global[i].visibility = visibility;
							}
						}
						
					police_juridiction.setVisible(visibility);
						police_juridictionBlacklevel.setVisible(visibility);
						police_juridictionlastlevel.setVisible(visibility);
					for (k=0; k<policeJurifeatureDataArray.length; k++){
						var style = new ol.style.Style({
							stroke: new ol.style.Stroke({
							  color: strokecolorArray[k],
							  width: 2,
							  lineDash: [12,30],
							  offsetX: 0,
							  offsetY: 0,
							})
						})
						policeJurifeatureDataArray[k].setStyle(style);
					}	
					// for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					// if(tmpl_setMap_layer_global[i].title != 'police_Juridiction'){
						// if(tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj){
							// console.log("Inside",tmpl_setMap_layer_global[i].title);
							// tmpl_setMap_layer_global[i].layer.setMap(null);
							// tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						// }
					// }
					// }
				}
				tmpl.Map.juridictionBoundary({visibility:false});
				tmpl.Map.juridictionBoundaryFill = function(param){    
					var visibility = param.visibility;
					//var mapObj = param.map;
					// if(visibility)
						// police_juridictionlastlevel.setMap(mapObj); 
					// else
						// police_juridictionlastlevel.setMap(null); 
					police_juridictionlastlevel.setVisible(visibility);
					//if(visibility){
						for(var i=0;i<tmpl_setMap_layer_global.length;i++){
							if(tmpl_setMap_layer_global[i].title == 'police_Juridiction'){
								tmpl_setMap_layer_global[i].visibility = visibility;
							}
						}
					//}
					for (k=0; k<policeJurifeatureDataArray.length; k++){
						var textname = policeJurifeatureDataArray[k].U.name;
						var style = new ol.style.Style({
							fill: new ol.style.Fill({
							 color: fillcolorArray[k]
							}),
							stroke: new ol.style.Stroke({
								color: fillcolorArray[k],
								width: 2
							}),
							text: new ol.style.Text({
								  text: textname,
								  font: 'bold 10px Arial',
								  fill: new ol.style.Fill({color:'rgba(255, 0, 0, 0.7)'}),//red color 
								  stroke: new ol.style.Stroke({color: 'rgba(255, 255, 255, 0.7)', width: 3}) // white
								})
						})
						policeJurifeatureDataArray1[k].setStyle(style);		               
					}   
					// for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					// if(tmpl_setMap_layer_global[i].title != 'police_Juridiction'){
						// if(tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj){
							// tmpl_setMap_layer_global[i].layer.setMap(null);
							// tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						// }
					// }
					// }
				}
				
			},
			error: function () {
				console.log("there was an error!");
			},
		});
	
	}*/


	tmpl.Map.getJuridiction = function (param) {
		var mapObj = param.map;
		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/PoliceJuriction";
		$.ajax({
			url: urlL,
			success: function (data) {
				var format = new ol.format.WKT();
				var policeJuriData = data;
				var policeJurifeatureDataArray = [];
				for (var i = 0, length = policeJuriData.length; i < length; i++) {
					var policeJurifeature = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature.setProperties(policeJuriData[i]);
					policeJurifeature.set('id', policeJuriData[i].gid);
					policeJurifeature.set('layer_name', 'police_Juridiction');
					policeJurifeatureDataArray.push(policeJurifeature);
				}
				var policeJurifeatureDataArray1 = [];
				for (var i = 0, length = policeJuriData.length; i < length; i++) {
					var policeJurifeature1 = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature1.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature1.setProperties(policeJuriData[i]);
					var policeJuriStyle1 = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#000000',
							width: 1
						})
					});
					policeJurifeature1.setStyle(policeJuriStyle1);
					policeJurifeature1.set('id', policeJuriData[i].gid);
					policeJurifeature1.set('layer_name', 'police_Juridiction');
					policeJurifeatureDataArray1.push(policeJurifeature1);
				}
				var policeJurifeatureDataArray2 = [];
				for (var i = 0, length = policeJuriData.length; i < length; i++) {
					var policeJurifeature2 = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeature2.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeature2.setProperties(policeJuriData[i]);
					var policeJuriStyle2 = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#000000',
							width: 1
						})
					});
					policeJurifeature2.setStyle(policeJuriStyle2);
					policeJurifeature2.set('id', policeJuriData[i].gid);
					policeJurifeature2.set('layer_name', 'police_Juridiction');
					policeJurifeatureDataArray2.push(policeJurifeature2);
				}
				var policeJurifeatureDataArrayFill = [];
				for (var i = 0, length = policeJuriData.length; i < length; i++) {
					var policeJurifeatureFill = format.readFeature(policeJuriData[i].the_geom_text);
					policeJurifeatureFill.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					policeJurifeatureFill.setProperties(policeJuriData[i]);
					policeJurifeatureFill.set('id', policeJuriData[i].gid);
					policeJurifeatureFill.set('layer_name', 'police_Juridiction');
					policeJurifeatureDataArrayFill.push(policeJurifeatureFill);
				}
				var police_juridiction = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray
					})
				});
				var police_juridictionlastlevel = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray1
					})
				});

				var police_juridictionBlacklevel = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArray2
					})
				});

				var police_juridictionFilllevel = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: policeJurifeatureDataArrayFill
					})
				});

				police_juridictionFilllevel.setProperties({ lname: 'police_JuridictionFill' });
				police_juridictionFilllevel.setProperties({ title: 'police_JuridictionFill' });

				police_juridiction.setProperties({ lname: 'police_JuridictionBoundary' });
				police_juridiction.setProperties({ title: 'police_JuridictionBoundary' });

				police_juridictionlastlevel.setProperties({ lname: 'police_Juridiction' });
				police_juridictionlastlevel.setProperties({ title: 'police_Juridiction' });

				police_juridictionBlacklevel.setProperties({ lname: 'police_Juridiction' });
				police_juridictionBlacklevel.setProperties({ title: 'police_Juridiction' });

				tmpl_setMap_layer_global.push({
					layer: police_juridictionFilllevel,
					title: 'police_JuridictionFill',
					visibility: false,
					map: mapObj
				});

				tmpl_setMap_layer_global.push({
					layer: police_juridictionBlacklevel,
					title: 'police_Juridiction',
					visibility: false,
					map: mapObj
				});

				tmpl_setMap_layer_global.push({
					layer: police_juridictionlastlevel,
					title: 'police_Juridiction',
					visibility: false,
					map: mapObj
				});

				tmpl_setMap_layer_global.push({
					layer: police_juridiction,
					title: 'police_JuridictionBoundary',
					visibility: false,
					map: mapObj
				});

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();

				police_juridictionFilllevel.setMap(mapObj);
				police_juridictionBlacklevel.setMap(mapObj);
				police_juridictionlastlevel.setMap(mapObj);
				police_juridiction.setMap(mapObj);

				for (i = 1; i < length; i++) {
					var existingLayer = Layers.item(i);
					try {
						mapObj.removeLayer(existingLayer);
					} catch (e) { }

				}

				for (var i = 1; i < length; i++) {
					var existingLayer = Layers.item(i);
					try {
						mapObj.addLayer(existingLayer);
					} catch (e) { }
				}
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title != 'police_Juridiction') {
						if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj) {
							try {
								tmpl_setMap_layer_global[i].layer.setMap(null);
							} catch (e) { }
							try {
								tmpl_setMap_layer_global[i].layer.setMap(mapObj);
							} catch (e) { }
						}
					}
				}
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title != 'police_JuridictionBoundary') {
						if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj) {
							try {
								tmpl_setMap_layer_global[i].layer.setMap(null);
							} catch (e) { }
							try {
								tmpl_setMap_layer_global[i].layer.setMap(mapObj);
							} catch (e) { }
						}
					}
				}
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title != 'police_JuridictionFill') {
						if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj) {
							try {
								tmpl_setMap_layer_global[i].layer.setMap(null);
							} catch (e) { }
							try {
								tmpl_setMap_layer_global[i].layer.setMap(mapObj);
							} catch (e) { }
						}
					}
				}
				var fillcolorArray = ['rgba(207, 83, 0, 0.2)', 'rgba(255, 102, 51, 0.2)', 'rgba(51, 0, 0, 0.2)', 'rgba(153, 51, 255, 0.2)', 'rgba(0, 0, 204, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(173, 255, 47, 0.2)', 'rgba(255, 102, 255, 0.2)', 'rgba(204, 204, 102, 0.2)', 'rgba(133, 92, 51, 0.2)', 'rgba(220, 20, 60, 0.2)', 'rgba(0, 153, 102, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(102, 0, 204, 0.2)', 'rgba(246, 227, 206, 0.2)', 'rgba(172, 250, 88, 0.2)', 'rgba(88, 130, 250, 0.2)', 'rgba(247, 211, 88, 0.2)', 'rgba(88, 172, 250, 0.2)', 'rgba(46, 46, 254, 0.2)', 'rgba(254, 46, 247, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(4, 180, 49, 0.2)', 'rgba(254, 46, 154, 0.2)', 'rgba(254, 46, 46, 0.2)', 'rgba(0, 255, 0,0.2)', 'rgba(154, 46, 254, 0.2)', 'rgba(223, 1, 165, 0.2)', 'rgba(0, 102, 51, 0.2)', 'rgba(8, 106, 135, 0.2)', 'rgba(8, 138, 104, 0.2)', 'rgba(180, 95, 4, 0.2)', 'rgba(206, 246, 206, 0.2)', 'rgba(246, 206, 216, 0.2)', 'rgba(224, 224, 248, 0.2)', 'rgba(250, 88, 88, 0.2)', 'rgba(188, 245, 169, 0.2)', 'rgba(246, 227, 206, 0.2)', 'rgba(180, 4, 174, 0.2)', 'rgba(207, 83, 0, 0.2)', 'rgba(255, 102, 51, 0.2)', 'rgba(51, 0, 0, 0.2)', 'rgba(153, 51, 255, 0.2)', 'rgba(198, 141, 141, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(173, 255, 47, 0.2)', 'rgba(255, 102, 255, 0.2)', 'rgba(204, 204, 102, 0.2)', 'rgba(204, 204, 102, 0.2)', 'rgba(133, 92, 51, 0.2)', 'rgba(220, 20, 60, 0.2)', 'rgba(0, 153, 102, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(102, 0, 204, 0.2)', 'rgba(172, 250, 88, 0.2)', 'rgba(88, 130, 250, 0.2)', 'rgba(247, 211, 88, 0.2)', 'rgba(88, 172, 250, 0.2)', 'rgba(46, 46, 254, 0.2)', 'rgba(254, 46, 247, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(4, 180, 49, 0.2)', 'rgba(254, 46, 154, 0.2)', 'rgba(254, 46, 46, 0.2)', 'rgba(0, 255, 0, 0.2)', 'rgba(154, 46, 254, 0.2)', 'rgba(223, 1, 165, 0.2)', 'rgba(189, 189, 189, 0.2)', 'rgba(8, 106, 135, 0.2)', 'rgba(8, 138, 104, 0.2)', 'rgba(180, 95, 4, 0.2)', 'rgba(206, 246, 206, 0.2)', 'rgba(246, 206, 216, 0.2)', 'rgba(224, 224, 248, 0.2)', 'rgba(250, 88, 88, 0.2)', 'rgba(188, 245, 169, 0.2)', 'rgba(246, 227, 206, 0.2)', 'rgba(180, 4, 174, 0.2)', 'rgba(246, 227, 206, 0.2)', 'rgba(207, 83, 0, 0.2)', 'rgba(255, 102, 51, 0.2)', 'rgba(51, 0, 0, 0.2)', 'rgba(153, 51, 255, 0.2)', 'rgba(198, 141, 141, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(173, 255, 47, 0.2)', 'rgba(255, 102, 255, 0.2)', 'rgba(204, 204, 102, 0.2)', 'rgba(133, 92, 51, 0.2)', 'rgba(220, 20, 60, 0.2)', 'rgba(0, 153, 102, 0.2)', 'rgba(255, 215, 0, 0.2)', 'rgba(102, 0, 204, 0.2)', 'rgba(172, 250, 88, 0.2)', 'rgba(88, 130, 250, 0.2)', 'rgba(247, 211, 88, 0.2)', 'rgba(88, 172, 250, 0.2)', 'rgba(46, 46, 254, 0.2)', 'rgba(254, 46, 247, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(4, 180, 49, 0.2)', 'rgba(254, 46, 154, 0.2)', 'rgba(133, 92, 51, 0.2)'];
				var strokecolorArray = ['rgb(207, 83, 0)', 'rgb(255, 102, 51)', 'rgb(51, 0, 0)', 'rgb(153, 51, 255)', 'rgb(0, 0, 204)', 'rgb(0, 255, 255)', 'rgb(173, 255, 47)', 'rgb(255, 102, 255)', 'rgb(204, 204, 102)', 'rgb(133, 92, 51)', 'rgb(220, 20, 60)', 'rgb(0, 153, 102)', 'rgb(255, 215, 0)', 'rgb(102, 0, 204)', 'rgb(246, 227, 206)', 'rgb(172, 250, 88)', 'rgb(88, 130, 250)', 'rgb(247, 211, 88)', 'rgb(88, 172, 250)', 'rgb(46, 46, 254)', 'rgb(254, 46, 247)', 'rgb(255, 255, 0)', 'rgb(4, 180, 49)', 'rgb(254, 46, 154)', 'rgb(254, 46, 46)', 'rgb(0, 255, 0,0.5)', 'rgb(154, 46, 254)', 'rgb(223, 1, 165)', 'rgb(0, 102, 51)', 'rgb(8, 106, 135)', 'rgb(8, 138, 104)', 'rgb(180, 95, 4)', 'rgb(206, 246, 206)', 'rgb(246, 206, 216)', 'rgb(224, 224, 248)', 'rgb(250, 88, 88)', 'rgb(188, 245, 169)', 'rgb(246, 227, 206)', 'rgb(180, 4, 174)', 'rgb(207, 83, 0)', 'rgb(255, 102, 51)', 'rgb(51, 0, 0)', 'rgb(153, 51, 255)', 'rgb(198, 141, 141)', 'rgb(0, 255, 255)', 'rgb(173, 255, 47)', 'rgb(255, 102, 255)', 'rgb(204, 204, 102)', 'rgb(204, 204, 102)', 'rgb(133, 92, 51)', 'rgb(220, 20, 60)', 'rgb(0, 153, 102)', 'rgb(255, 215, 0)', 'rgb(102, 0, 204)', 'rgb(172, 250, 88)', 'rgb(88, 130, 250)', 'rgb(247, 211, 88)', 'rgb(88, 172, 250)', 'rgb(46, 46, 254)', 'rgb(254, 46, 247)', 'rgb(255, 255, 0)', 'rgb(4, 180, 49)', 'rgb(254, 46, 154)', 'rgb(254, 46, 46)', 'rgb(0, 255, 0)', 'rgb(154, 46, 254)', 'rgb(223, 1, 165)', 'rgb(189, 189, 189)', 'rgb(8, 106, 135)', 'rgb(8, 138, 104)', 'rgb(180, 95, 4)', 'rgb(206, 246, 206)', 'rgb(246, 206, 216)', 'rgb(224, 224, 248)', 'rgb(250, 88, 88)', 'rgb(188, 245, 169)', 'rgb(246, 227, 206)', 'rgb(180, 4, 174)', 'rgb(246, 227, 206)', 'rgb(207, 83, 0)', 'rgb(255, 102, 51)', 'rgb(51, 0, 0)', 'rgb(153, 51, 255)', 'rgb(198, 141, 141)', 'rgb(0, 255, 255)', 'rgb(173, 255, 47)', 'rgb(255, 102, 255)', 'rgb(204, 204, 102)', 'rgb(133, 92, 51)', 'rgb(220, 20, 60)', 'rgb(0, 153, 102)', 'rgb(255, 215, 0)', 'rgb(102, 0, 204)', 'rgb(172, 250, 88)', 'rgb(88, 130, 250)', 'rgb(247, 211, 88)', 'rgb(88, 172, 250)', 'rgb(46, 46, 254)', 'rgb(254, 46, 247)', 'rgb(255, 255, 0)', 'rgb(4, 180, 49)', 'rgb(254, 46, 154)', 'rgb(133, 92, 51)'];
				var zoom = mapObj.getView().getZoom();

				police_juridictionFilllevel.setVisible(false);
				police_juridiction.setVisible(true);
				police_juridictionBlacklevel.setVisible(true);
				police_juridictionlastlevel.setVisible(true);
				for (k = 0; k < policeJurifeatureDataArray.length; k++) {
					var style = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: strokecolorArray[k],
							width: 2,
							lineDash: [12, 30],
							offsetX: 0,
							offsetY: 0,
						})
					})
					policeJurifeatureDataArray[k].setStyle(style);
				}

				tmpl.Map.juridictionBoundary = function (param) {
					var visibility = param.visibility;


					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						if (tmpl_setMap_layer_global[i].title == 'police_JuridictionBoundary') {
							tmpl_setMap_layer_global[i].visibility = visibility;
						}
					}

					//police_juridictionFilllevel.setVisible(visibility);
					police_juridiction.setVisible(visibility);
					police_juridictionBlacklevel.setVisible(visibility);
					police_juridictionlastlevel.setVisible(visibility);
					for (k = 0; k < policeJurifeatureDataArray.length; k++) {
						var style = new ol.style.Style({
							stroke: new ol.style.Stroke({
								color: strokecolorArray[k],
								width: 2,
								lineDash: [12, 30],
								offsetX: 0,
								offsetY: 0,
							})
						})
						policeJurifeatureDataArray[k].setStyle(style);
					}

				}
				tmpl.Map.juridictionBoundary({ visibility: false });

				tmpl.Map.juridictionBoundaryFill = function (param) {
					var visibility = param.visibility;

					police_juridictionFilllevel.setVisible(visibility);

					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						if (tmpl_setMap_layer_global[i].title == 'police_JuridictionFill') {
							tmpl_setMap_layer_global[i].visibility = visibility;
						}
					}
					for (k = 0; k < policeJurifeatureDataArray.length; k++) {
						var textname = policeJurifeatureDataArray[k].U.name;
						var style = new ol.style.Style({
							fill: new ol.style.Fill({
								color: fillcolorArray[k]
							}),
							stroke: new ol.style.Stroke({
								color: fillcolorArray[k],
								width: 2
							}),
							text: new ol.style.Text({
								text: textname,
								font: 'bold 10px Arial',
								fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.7)' }),//red color 
								stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.7)', width: 3 }) // white
							})
						})
						policeJurifeatureDataArrayFill[k].setStyle(style);
					}

				}

			},
			error: function () {
				console.log("there was an error!");
			},
		});

	}



	tmpl.HeatMap.create = function (param) {
		var mapObj = param.map;
		var getdata = param.data;
		var layer = param.layer;
		var blur = param.blur;
		if (blur == undefined)
			blur = 10;
		var radius = param.radius;
		if (radius == undefined)
			radius = 20;
		var weight;
		var featureDataAry = [];
		var geometry;
		for (var i = 0, length = getdata.length; i < length; i++) {
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
			}
			else {
				var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
				geometry = new ol.geom.Point(coordinate);
			}
			var featureval = new ol.Feature({
				geometry: geometry

			});
			if (getdata[i].weight) {
				weight = getdata[i].weight;
				featureval.set('weight', weight);
			}
			featureval.setProperties(getdata[i].properties);
			featureDataAry.push(featureval);
		}
		var vector_heat = new ol.layer.Heatmap({
			source: new ol.source.Vector({
				features: featureDataAry
			}),
			title: layer,
			blur: blur,
			radius: radius,
			opacity: .5
		});
		//mapObj.addLayer(vector_heat);	  

		tmpl_setMap_layer_global.push({
			layer: vector_heat,
			title: layer,
			visibility: true,
			map: mapObj
		});

		vector_heat.setMap(mapObj);
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();

		/*for(i=1;i<length;i++){
					var existingLayer=Layers.item(i);
						mapObj.removeLayer(existingLayer);
				}
				for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					if(tmpl_setMap_layer_global[i].title != layer)
							tmpl_setMap_layer_global[i].layer.setMap(null);
				}
				
				for(var i=1;i<length;i++){
					var existingLayer=Layers.item(i);
						mapObj.addLayer(existingLayer);
				}
				for(var i=0;i<tmpl_setMap_layer_global.length;i++){
					if(tmpl_setMap_layer_global[i].title != layer)
						tmpl_setMap_layer_global[i].layer.setMap(mapObj);
				}*/

	}

	tmpl.HeatMap.changeRadius = function (param) {
		var mapObj = param.map;
		var radius = param.radius;
		var layer = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layer) {
				var heatLayer = tmpl_setMap_layer_global[i].layer;
				heatLayer.setRadius(parseInt(radius, 10));
				break;
			}
		}
	}

	tmpl.HeatMap.changeBlur = function (param) {
		var mapObj = param.map;
		var blur = param.blur;
		var layer = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layer) {
				var heatLayer = tmpl_setMap_layer_global[i].layer;
				heatLayer.setBlur(parseInt(blur, 10));
				break;
			}
		}
	}
	tmpl.HeatMap.changeOpacity = function (param) {
		var mapObj = param.map;
		var op = param.opacity;
		var layer = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layer) {
				var heatLayer = tmpl_setMap_layer_global[i].layer;
				heatLayer.setOpacity(parseFloat(op));
				break;
			}
		}
	}

	tmpl.Map.getZoneBoundary = function (param) {
		var mapObj = param.map;
		//var visibility = param.visibility;
		var color = param.color;
		var width = param.width;
		var textColor = param.textColor;

		var colorVal, widthVal, textColorVal;

		if (color)
			colorVal = color;
		else
			colorVal = 'rgb(255, 0, 0)';

		if (width)
			widthVal = width;
		else
			widthVal = 1;

		if (textColor)
			textColorVal = textColor;
		else
			textColorVal = 'rgba(255, 0, 0, 0.8)';

		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/Zones";
		$.ajax({
			url: urlL,
			success: function (data) {
				var format = new ol.format.WKT();
				var zonalData = data;
				var zonalfeatureDataArray = [];

				for (var i = 0, length = zonalData.length; i < length; i++) {
					var zonalfeature = format.readFeature(zonalData[i].the_geom_text);
					zonalfeature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
					zonalfeature.setProperties(zonalData[i]);
					var zonalStyle = new ol.style.Style({

						stroke: new ol.style.Stroke({
							color: colorVal,
							width: widthVal
						}),
						text: new ol.style.Text({
							text: zonalData[i].name,
							font: 'bold 10px Arial',
							fill: new ol.style.Fill({ color: textColorVal }),
							stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.7)', width: widthVal })
						})
					});
					zonalfeature.setStyle(zonalStyle);
					zonalfeatureDataArray.push(zonalfeature);
				}
				var zonal = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: zonalfeatureDataArray
					})
				});

				tmpl_setMap_layer_global.push({
					layer: zonal,
					title: 'zoneBorder',
					visibility: true,
					map: mapObj
				});
				zonal.setMap(mapObj);
				zonal.setVisible(true);

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (i = 1; i < length; i++) {
					var existingLayer = Layers.item(i);
					mapObj.removeLayer(existingLayer);
				}

				for (var i = 1; i < length; i++) {
					var existingLayer = Layers.item(i);
					mapObj.addLayer(existingLayer);
				}

				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title != 'zoneBorder') {
						if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj) {
							tmpl_setMap_layer_global[i].layer.setMap(null);
							tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						}
					}
				}

				tmpl.Map.getZoneVisibility = function (param) {
					var visibility = param.visibility;
					//var mapObj = param.map;
					zonal.setVisible(visibility);
					// if(visibility)
					// zonal.setMap(mapObj); 
					// else
					// zonal.setMap(null); 
					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						if (tmpl_setMap_layer_global[i].title == 'zoneBorder') {
							tmpl_setMap_layer_global[i].visibility = visibility;
						}
					}
					for (i = 1; i < length; i++) {
						var existingLayer = Layers.item(i);
						mapObj.removeLayer(existingLayer);
					}

					for (var i = 1; i < length; i++) {
						var existingLayer = Layers.item(i);
						mapObj.addLayer(existingLayer);
					}
					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						if (tmpl_setMap_layer_global[i].title != 'zoneBorder') {
							if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == mapObj) {
								tmpl_setMap_layer_global[i].layer.setMap(null);
								tmpl_setMap_layer_global[i].layer.setMap(mapObj);
							}
						}
					}

				}


				tmpl.Map.resize({ map: mapObj })

			},
			error: function () {
				console.log("there was an error!");
			},
		});
	}



	tmpl.Map.getCityBoundary = function (param) {
		var mapObj = param.map;
		var color = param.color;
		var width = param.width;
		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/Border";
		// $.ajax({
		// url:urlL,
		// success: function (data) {
		var data = [];
		data[0] = {}
		data[0].the_geom_text = 'LINESTRING(77.3970692938604 12.9714054339315,77.398972 12.974115,77.399315 12.98181,77.393135 12.999205,77.3905545167409 13.0014054339315,77.3881710978793 13.0034378267857,77.387642 13.003889,77.384895 13.007234,77.382492 13.015262,77.381462 13.023624,77.3863567245453 13.0314054339315,77.387985 13.033994,77.3881710978793 13.0345741938833,77.391418 13.044697,77.391418 13.055734,77.3925831540404 13.0614054339315,77.392792 13.062422,77.393135 13.070783,77.392105 13.079813,77.389702 13.087504,77.3881710978793 13.0881750376268,77.382835 13.090514,77.3808517150368 13.0914054339315,77.378372 13.09252,77.379402 13.09787,77.379402 13.106564,77.380775 13.112583,77.386269 13.113586,77.3881710978793 13.1131228034294,77.393135 13.111914,77.398285 13.111246,77.403091 13.102552,77.405495 13.09787,77.413391 13.094192,77.4155367558692 13.0914054339315,77.4181710978792 13.0879843699774,77.418541 13.087504,77.425064 13.08416,77.433304 13.083157,77.43605 13.076803,77.44532 13.071118,77.4481710978792 13.0698558777723,77.449097 13.069446,77.451157 13.075131,77.4481710978792 13.0825827116814,77.445663 13.088842,77.4450910519274 13.0914054339315,77.443947 13.096533,77.4428980678097 13.0981899457784,77.4424395434558 13.1005710872359,77.4422240673459 13.1051508538767,77.442574 13.109908,77.447037 13.113921,77.4476957734532 13.1214054339315,77.448067 13.125623,77.447723 13.135654,77.438454 13.135988,77.432274 13.137994,77.4383593355269 13.1514054339315,77.438797 13.15237,77.4410256957765 13.1514054339315,77.448067 13.148358,77.4481710978792 13.1484686039967,77.450935173112 13.1514054339315,77.451843 13.15237,77.4574563321455 13.1514054339315,77.45768 13.151367,77.4577523558037 13.1514054339315,77.465233 13.155379,77.467979 13.152704,77.471413 13.154042,77.474159 13.158388,77.4787408839463 13.162715389662,77.4829856035949 13.161574652932,77.485146 13.162734,77.487206 13.17176,77.490982 13.173766,77.495789 13.173766,77.496819 13.168417,77.495445 13.161397,77.5031295357853 13.1610819627237,77.5060972922465 13.1550164083002,77.5087212239826 13.1527810069931,77.5081710978792 13.1492371964645,77.510551 13.148358,77.515358 13.149027,77.5190212328216 13.1514054339315,77.519478 13.151702,77.523598 13.151702,77.5238471542011 13.1514054339315,77.526688 13.148024,77.530464 13.148024,77.5332420760673 13.1514054339315,77.535957 13.15471,77.5381710978792 13.1563874120179,77.539047 13.157051,77.544884 13.156716,77.552094 13.155713,77.557587 13.156048,77.56411 13.158722,77.5681710978792 13.1597427119071,77.574753 13.161397,77.584023 13.163402,77.592606 13.165408,77.5981710978792 13.1663111367666,77.5986293662722 13.1673984653126,77.5994095609281 13.1834893889757,77.599635234888 13.1854604548021,77.6009951065326 13.1929624258667,77.6031815205929 13.203012889787,77.6063009377485 13.2019852104871,77.6090556039459 13.2018752537089,77.6099287458954 13.2013381868323,77.6103145544133 13.2010466247845,77.6103944089797 13.2002780423564,77.6182583545456 13.2038777620035,77.6203861581525 13.2035325031241,77.6206698653 13.2044992267562,77.6223011813986 13.206432662539,77.6244999117924 13.2065707645091,77.6277625439896 13.206432662539,77.6282235681044 13.2099542381388,77.6343764668676 13.2124400232075,77.6416819259179 13.2109899863031,77.6475511175335 13.2163758046788,77.6525917245912 13.2220056292968,77.6659104591198 13.2305012373755,77.6704198796113 13.2300173713331,77.6735406582348 13.2293269270683,77.6865911870243 13.2391310522686,77.6923717201565 13.2428592780027,77.6932228415993 13.2462767681068,77.6905276236971 13.2524902635366,77.6929391344517 13.2598081768528,77.6967691809443 13.2640883636953,77.7076919061267 13.2751336588746,77.7084011739957 13.2785852106172,77.7108126847503 13.2802419380252,77.7127986347834 13.2787232716663,77.7214353517324 13.2779350707633,77.7406667112873 13.2658883044883,77.7414690991238 13.2521307303817,77.7379067173457 13.240788048531,77.7509335425466 13.2301185865968,77.7445727395427 13.1959840084233,77.7469042120713 13.1768959939457,77.7421221184997 13.1683429752455,77.7388389711731 13.1612064870776,77.7319601736745 13.1553571680198,77.7285495081683 13.152273414353,77.728218 13.148693,77.730621 13.145684,77.740234 13.142006,77.747787 13.137994,77.747101 13.128967,77.746583125821 13.1214054339315,77.746414 13.118936,77.746071 13.105896,77.7481710978792 13.1046461359224,77.752251 13.102218,77.753281 13.094527,77.7550061893429 13.0914054339315,77.755684 13.090179,77.764267 13.076469,77.768044 13.072455,77.776627 13.077137,77.7781710978792 13.0778246221498,77.788643 13.082488,77.794479 13.08115,77.798943 13.076803,77.798943 13.068777,77.792763 13.067105,77.786583 13.063426,77.7781710978792 13.063426,77.776283 13.063426,77.7732870576864 13.0614054339315,77.77182 13.060416,77.76667 13.05172,77.760834 13.048376,77.7647330300696 13.0354179512922,77.7679452736084 13.0300471647614,77.7733317494887 13.0265909282158,77.7717204870776 13.014386348161,77.7719515357853 13.0047535129225,77.773332041501 13.0003185616302,77.7720711069926 12.9986542878082,77.7705640974155 12.9952591647614,77.7731997191849 12.9927254756461,77.7781710978792 12.987968941925,77.780746 12.986493,77.78933 12.98114,77.797913 12.980471,77.804092 12.979468,77.8081710978792 12.9779390808218,77.813019 12.976122,77.817482 12.977126,77.819885 12.975453,77.8185378821228 12.9714054339315,77.815765 12.963074,77.815422 12.958725,77.824348 12.956383,77.831215 12.951698,77.836708 12.944003,77.8378738482 12.9414054339315,77.8381710978792 12.940743147297,77.839111 12.938649,77.841171 12.935303,77.844261 12.931288,77.849068 12.928945,77.854218 12.924261,77.861771 12.914222,77.8627617156324 12.9114054339315,77.865891 12.902509,77.8681710978792 12.8943570411207,77.86898 12.891465,77.87104 12.885106,77.8750736826704 12.8814054339315,77.882713 12.874397,77.8836132337633 12.8694962812691,77.8822154168316 12.8677966224448,77.8812674562606 12.8648076856687,77.8787897071272 12.8619430861012,77.8768182718905 12.8611701141557,77.8739299152277 12.8605380583514,77.8713881425267 12.8590540264284,77.8691605414347 12.8569108348263,77.8645763959926 12.8555089676532,77.8602135141555 12.8548408660367,77.8549115423235 12.8500725234246,77.8503224949416 12.849840072204,77.8465184849647 12.8511483443902,77.8440255084673 12.8522530672793,77.8406727472682 12.8522416447475,77.8371295931153 12.8532157259201,77.8341519995509 12.8526359521384,77.8322288071704 12.8506064412075,77.8303886930015 12.8493428518858,77.8273174048582 12.8496264707843,77.8263744516169 12.8517897209837,77.8257723262764 12.8544067066925,77.8230065710977 12.8556702067805,77.8206227504066 12.8554326205546,77.8159801024995 12.8549189455704,77.8132863543116 12.8558160915808,77.8113459116401 12.8564593131106,77.8089787716252 12.8547264189024,77.808188330996 12.8529434392342,77.8049642868013 12.8548085075027,77.796883 12.855988,77.782806 12.855318,77.7781710978792 12.8572299101063,77.77388 12.859,77.766327 12.863351,77.762894 12.874062,77.76049 12.878078,77.753967 12.877409,77.748817 12.879417,77.7481710978792 12.8795623026505,77.739977975462 12.8814054339315,77.739891 12.881425,77.7398809651386 12.8814054339315,77.735428 12.872723,77.734741 12.859335,77.7331149082967 12.8514054339315,77.733025 12.850967,77.730278 12.843268,77.725815 12.8349,77.721008 12.832222,77.721352 12.823183,77.7204065740107 12.8214054339315,77.7181710978792 12.8172023481657,77.716545 12.814145,77.710365 12.807114,77.716888 12.803432,77.715858 12.797406,77.710022 12.793723,77.698006 12.795397,77.690453 12.801088,77.6881710978792 12.7994565507556,77.685303 12.797406,77.67878 12.803097,77.671227 12.807784,77.66333 12.805106,77.65818 12.804771,77.6581710978792 12.8047917004726,77.653717 12.815149,77.6550674297733 12.8214054339315,77.65509 12.82151,77.6581710978792 12.8216973451104,77.660583 12.821844,77.6618578556484 12.8214054339315,77.66642 12.819836,77.6683518995512 12.8214054339315,77.67054 12.823183,77.66951 12.831218,77.663673 12.8349,77.6581710978792 12.8363899964721,77.651314 12.838247,77.640327 12.84059,77.631401 12.840256,77.6281710978792 12.8362672276722,77.626251 12.833896,77.623505 12.824188,77.6254071404447 12.8214054339315,77.626938 12.819166,77.6281710978792 12.8161595942092,77.629684 12.812471,77.6281710978792 12.8042504577649,77.627281 12.799414,77.6239962440486 12.7914054339315,77.623848 12.791044,77.619728 12.791379,77.6196699220362 12.7914054339315,77.614578 12.793723,77.608398 12.795732,77.600502 12.79774,77.5981710978792 12.7923828527917,77.5977458215884 12.7914054339315,77.595695 12.786692,77.592262 12.780665,77.589859 12.769616,77.5866652504592 12.7614054339315,77.586082 12.759906,77.582649 12.75053,77.57029 12.742158,77.5681710978792 12.7406272246491,77.56102 12.735461,77.555527 12.734456,77.546944 12.739814,77.5381710978792 12.7480948019078,77.536301 12.74986,77.5381710978792 12.7541394778491,77.5413462630604 12.7614054339315,77.545227 12.770286,77.540421 12.776647,77.542824 12.787696,77.5399710154201 12.7914054339315,77.5381710978792 12.7937456762331,77.537674 12.794392,77.519821 12.796066,77.5081710978792 12.7963651504837,77.506775 12.796401,77.5064739142222 12.7914054339315,77.506432 12.79071,77.501968 12.783009,77.496819 12.772964,77.486519 12.768946,77.479652 12.768946,77.4781710978792 12.7704867191207,77.469353 12.779661,77.459396 12.788031,77.45253 12.781335,77.4481710978792 12.7816621862448,77.448067 12.78167,77.437767 12.791044,77.4366023624213 12.7914054339315,77.430214 12.793388,77.428534701407 12.7914054339315,77.423691 12.785687,77.418884 12.782674,77.4181710978792 12.7827591346585,77.402061 12.784683,77.4013159320481 12.7914054339315,77.400688 12.797071,77.396568 12.805775,77.394165 12.812471,77.3992372345086 12.8214054339315,77.404808 12.831218,77.415108 12.845277,77.4181710978792 12.8507718756899,77.4185242725488 12.8514054339315,77.423691 12.860674,77.428497 12.873058,77.431931 12.879752,77.4357477332759 12.8814054339315,77.44429 12.885106,77.43605 12.888788,77.433647 12.895147,77.429527 12.902509,77.424721 12.90619,77.4181710978792 12.9064678545284,77.416824 12.906525,77.409615 12.907194,77.394165 12.908198,77.3923931692558 12.9114054339315,77.391762 12.912548,77.395882 12.928611,77.400002 12.937645,77.3989497731732 12.9414054339315,77.397942 12.945007,77.401375 12.953706,77.404465 12.959059,77.404465 12.96207,77.396225 12.959059,77.391418 12.961736,77.394508 12.967758,77.3970692938604 12.9714054339315)';
		var format = new ol.format.WKT();
		var geometryVal = data[0].the_geom_text;
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
		if (color) {
			feature.setStyle(new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: color,
					width: width,
					lineDash: [5]
				})
			}));
		}
		else {
			feature.setStyle(new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgb(111, 110, 101)',
					width: 1,
					lineDash: [5]
				})
			}));
		}
		var source = new ol.source.Vector({
			features: [feature]
		});
		var newLayer = new ol.layer.Vector({
			title: 'cityBorder',
			visible: true,
			source: source
		});
		tmpl_setMap_layer_global.push({
			layer: newLayer,
			title: 'cityBorder',
			visibility: true,
			map: mapObj
		});
		newLayer.setMap(mapObj);
		// },
		// error: function () {
		// console.log("there was an error!");
		// },
		// });
	}

	//mapObj.on('click',tmpl.mapOnClickExtraForCenterMap);

	//------------------------------------ End of Creating Google Map ---------------------------------------//

	//---------------------------------- Beginning of Map Control Tools -------------------------------------//

	// **** Map Zoom In **** //

	tmpl.Control.zoomIn = function (param) {
		var mapObj = param.map;
		var currentZoom = mapObj.getView().getZoom();
		currentZoom = currentZoom + 1;
		mapObj.getView().setZoom(currentZoom);
	}

	// **** Map Zoom Out **** //

	tmpl.Control.zoomOut = function (param) {
		var mapObj = param.map;
		var currentZoom = mapObj.getView().getZoom();
		currentZoom = currentZoom - 1;
		mapObj.getView().setZoom(currentZoom);
	}

	// **** Adding Scale Control to the specified map **** //

	tmpl.Control.addScale = function (param) {
		var mapObj = param.map;
		var scaleCtrl = new ol.control.ScaleLine();
		mapObj.addControl(scaleCtrl);
	}

	// **** Adding Zoom to Extent Control to the specified map **** //

	tmpl.Control.addZoomToExtent = function (param) {
		var mapObj = param.map;
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' || appConfigInfo.mapData == 'trinity' ) {
			var zoomToExtentButton = document.createElement('button');
			var zoomToExtentText = document.createTextNode("E");
			zoomToExtentButton.appendChild(zoomToExtentText);
			zoomToExtentButton.title = 'Fit to Extent';
			zoomToExtentButton.className = 'ol-zoom-Extent-Custom .ol-unselectable ';
			zoomToExtentButton.addEventListener('click', function () {
				zoomToExtentControlForGoogle(mapObj);
			});
			var zoomToExtentControl = new ol.control.Control({
				element: zoomToExtentButton
			});
			mapObj.addControl(zoomToExtentControl);
		}
		else {
			var zoomToExtentControl = new ol.control.ZoomToExtent({
				extent: [77.378372, 12.734456, 77.882713, 13.2803290722673]
			});
			mapObj.addControl(zoomToExtentControl);
		}
	}

	// **** Zoom to Extent event handler for Google map **** //

	function zoomToExtentControlForGoogle(mapObj) {

		var start = new google.maps.LatLng(appConfigInfo.extent2, appConfigInfo.extent1);
		var end = new google.maps.LatLng(appConfigInfo.extent4, appConfigInfo.extent3);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);

		var convertBounds, x1, y1, x2, y2, extent;
		convertBounds = bounds.toString();
		convertBounds = convertBounds.slice(2, -2);
		convertBounds = convertBounds.split("), (");
		x1 = parseFloat(convertBounds[0].split(",")[0]);
		y1 = parseFloat(convertBounds[0].split(",")[1]);
		x2 = parseFloat(convertBounds[1].split(",")[0]);
		y2 = parseFloat(convertBounds[1].split(",")[1]);

		extent = [y1, x1, y2, x2];
		mapObj.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
	}

	// **** End of Adding Zoom to Extent Control to the specified map **** //

	// **** Adding Mouse Position Control to the specified map **** //

	tmpl.Control.addMousePostion = function (param) {
		var mapObj = param.map;
		var ctrlMouse = new ol.control.MousePosition({
			undefinedHTML: 'outside',
			projection: 'EPSG:4326',
			coordinateFormat: function (coordinate) {
				return ol.coordinate.format(coordinate, '{x}, {y}', 4);
			}
		});
		mapObj.addControl(ctrlMouse);
	}

	// **** Adding Full Screen Control to the specified map **** //

	tmpl.Control.addFullScreen = function (param) {
		var mapObj = param.map;
		var ctrlFullScreen = new ol.control.FullScreen();
		mapObj.addControl(ctrlFullScreen);
	}
	//----------------------------------- End of Map Control Tools ------------------------------------------//



	//---------------------------------- Beginning of Drawing Tools -----------------------------------------//
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
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Points';
		drawButton.className = 'ol-map-pointbtn';
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}

	tmpl.Draw.CustomPoint = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var img_url = param.img_url;
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Points';
		drawButton.className = 'ol-map-pointbtn';
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, img_url: img_url, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}

	// **** For lines **** //

	tmpl.Draw.line = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Lines';
		drawButton.className = 'ol-map-linebtn';
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'LineString', map: mapObj, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}

	// **** For polygond **** //

	tmpl.Draw.polygon = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Polygons';
		drawButton.className = 'ol-map-polygonbtn';
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Polygon', map: mapObj, callbackFunc: callbackFunc }) });
		mapObj.addControl(new ol.control.Control({
			element: drawButton
		}));
	}

	// **** for Circle **** //

	tmpl.Draw.circle = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var drawButton = document.createElement('button');
		drawButton.title = 'Draw Circle';
		drawButton.className = 'ol-map-Circlebtn';
		drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Circle', map: mapObj, callbackFunc: callbackFunc }) });
		var drawControl = new ol.control.Control({
			element: drawButton
		});
		mapObj.addControl(drawControl);
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
		if (img_url == undefined) {
			img_path = 'api_img/icon.png';
		} else {
			img_path = img_url;
		}
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
		//}
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
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
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

				/*if(value == 'Point'){
					console.log(drawRestriction);
					if(drawRestriction != undefined){
						if(drawRestriction == true){
			var url = appConfigInfo.drawRestrictionURL+''+coord[0]+'/'+coord[1]+'/';
			$.ajax({
			url:url,
			success: function (res) {
				//console.log(res);
				if(res[0].count == 1){
					callbackFunc(coord, feature, wktGeom, value);
				}else{
					alert("Mark Within City Bundary");
					tmpl.Draw.clear({map : mapObj});
				}
			},
			error: function () {
				console.log("there was an error!");
			},
		});
		}else{
			callbackFunc(coord, feature, wktGeom, value);
		}
					}else{
						callbackFunc(coord, feature, wktGeom, value);
					}
				}else{
					callbackFunc(coord, feature, wktGeom, value);
				}*/

				// getDrawFeatureDetails(coord, feature, wktGeom, value);
			});
		}
	}
	tmpl.Map.pointWithinBoundary = function (param) {
		var coord = param.point;
		var callbackFunc = param.callbackFunc;
		var url = appConfigInfo.connection.url + '/bangalore/landmark_search/withInBoundary/' + coord[0] + '/' + coord[1] + '/';
		$.ajax({
			url: url,
			success: function (res) {
				//console.log(res);
				if (res[0].count == 1) {
					callbackFunc(true);
				} else {
					callbackFunc(false);
				}
			},
			error: function () {
				console.log("there was an error!");
			},
		});
	}


	tmpl.Draw.clear = function (param) {
		var mapObj = param.map;
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
	}


	tmpl.Draw.remove = function (param) {
		var mapObj = param.map;
		mapObj.removeInteraction(modify1);
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(select);
		mapObj.removeInteraction(drawm);
		mapObj.removeInteraction(selectE);
	}


	tmpl.Draw.addSelect = function (param) {
		var mapObj = param.map;
		var selectButton = document.createElement('button');
		selectButton.title = 'Select Features';
		selectButton.className = 'ol-map-selectbtn';
		selectButton.addEventListener('click', function () { tmpl.Draw.select({ map: mapObj }); });
		var selectControl = new ol.control.Control({
			element: selectButton
		});
		mapObj.addControl(selectControl);
	}

	tmpl.Draw.select = function (param) {
		var mapObj = param.map;
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
	}

	tmpl.Draw.addDelete = function (param) {
		var mapObj = param.map;
		var deleteButton = document.createElement('button');
		deleteButton.title = 'Delete';
		deleteButton.className = 'ol-map-deletebtn';
		deleteButton.addEventListener('click', function () { tmpl.Draw.delete({ map: mapObj }); });
		var deleteControl = new ol.control.Control({
			element: deleteButton
		});
		mapObj.addControl(deleteControl);
	}

	tmpl.Draw.delete = function doDelete(param) {
		var mapObj = param.map;
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
	}

	tmpl.Draw.addSelectEdit = function setEdit(param) {
		var mapObj = param.map;
		var editButton = document.createElement('button');
		editButton.title = 'Edit';
		editButton.className = 'ol-map-editbtn';
		editButton.addEventListener('click', function () { tmpl.Draw.selectEdit({ map: mapObj }); });
		var editControl = new ol.control.Control({
			element: editButton
		});
		mapObj.addControl(editControl);
	}

	tmpl.Draw.selectEdit = function (param) {
		var mapObj = param.map;
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
	}
	tmpl.Draw.selectMultiple = function (param) {
		var mapObj = param.map;
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

	}

	tmpl.Feature.byId = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var callbackFunc = param.callbackFunc;
		var existing;
		var Layers = map.getLayers();
		var length = Layers.getLength();
		var fea;
		//console.log("layrName,id >>>",layrName,id);
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				//console.log("existingLayer.get('title') >>>",existingLayer.get('title'));
				if (existingLayer.get('title') === layrName) {
					existing = existingLayer;
					test1 = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						var len = feature.getProperties().features.length;
						for (var j = 0; j < len; j++) {
							//console.log("lfeature.getProperties().features[j].getId() >>>",feature.getProperties().features[j].getId());
							if (feature.getProperties().features[j].getId() == id) {
								fea = feature.getProperties().features[j];
								//console.log("fea  ????",fea);
								callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
								break;
							}
						}

					});

				}
			}
		}


		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layrName) {
					var layer = tmpl_setMap_layer_global[i].layer;
					layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == id) {
							var fea = feature;
							callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
						}
					});
				}
			}
		}
	}

	tmpl.Feature.updatebyId = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var properties = param.properties;
		var callbackFunc = param.callbackFunc;
		var existing;
		var Layers = map.getLayers();
		var length = Layers.getLength();
		var fea;
		//console.log("layrName,id >>>",layrName,id);
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layrName) {
					existing = existingLayer;
					test1 = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						var len = feature.getProperties().features.length;
						for (var j = 0; j < len; j++) {
							if (feature.getProperties().features[j].getId() == id) {
								fea = feature.getProperties().features[j];
								//console.log("before",fea);
								fea.setProperties(properties);
								//console.log("after",fea);
								break;
							}
						}
					});
				}
			}
		}

		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layrName) {
					var layer = tmpl_setMap_layer_global[i].layer;
					layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == id) {
							fea = feature;
							fea.setProperties(properties);
							fea.setStyle(new ol.style.Style({
								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: properties.img_url
								}))
							}));
						}
					});
				}
			}
		}
	}

	tmpl.Feature.clusterUpdatePropertiesLatLon = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var properties = param.properties;
		var existing;
		var Layers = map.getLayers();
		var length = Layers.getLength();
		var point = param.point;
		var fea;
		//console.log("layrName,id >>>",layrName,id);
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layrName) {
					existing = existingLayer;
					test1 = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						var len = feature.getProperties().features.length;
						for (var j = 0; j < len; j++) {
							if (feature.getProperties().features[j].getId() == id) {
								console.log("feature from API =====> ", feature);
								fea = feature.getProperties().features[j];
								console.log("feature properties from API =====> ", fea);
								fea.setProperties(properties);
								fea.getGeometry().setCoordinates(ol.proj.transform([parseFloat(point[0]), parseFloat(point[1])], 'EPSG:4326', 'EPSG:3857'));
								break;
							}
						}
					});
				}
			}
		}
	}

	tmpl.Feature.changeTypeVisibility = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var type = param.type;
		var visible = param.visible;
		var existing;
		var Layers = map.getLayers();
		var length = Layers.getLength();
		var fea;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layrName) {
					existing = existingLayer;
					test1 = existingLayer;
					//alert(type);
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties().features != undefined)
							var len = feature.getProperties().features.length;
						for (var j = 0; j < len; j++) {
							console.log("category_idb", feature.getProperties().features[j].get('category_id'));
							if (feature.getProperties().features[j].get('category_id') == type) {
								console.log("changeTypeVisibility changeTypeVisibility changeTypeVisibility");
								fea = feature.getProperties().features[j];
								//if(fea.get('img_url') != '')
								//fea.set('ff',fea.get('img_url'));
								if (visible == false) {
									fea.set('img_url', '');
								} else {
									fea.set('img_url', fea.get('ff'));
								}

								//console.log("beforebeforebefore",allClusterTypeData,type);

								//console.log("afterafterafter",allClusterTypeData,type);
							} else {
								//fea = feature.getProperties().features[j];
								//fea.set('img_url',fea.get('ff'));
							}
						}

					});



					break;
				}
			}
		}
	}

	tmpl.Feature.getLabel = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var id = param.id;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var labelName;
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.get('id') == id) {
							labelName = feature.getProperties()['label'];
						}
					});
				}
			}
		}

		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.get('id') == id) {
							labelName = feature.getProperties()['label'];
						}
					});
				}

			}

		}

		return labelName;
	}



	tmpl.Feature.changeColor = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var colorval = param.color;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == id) {
							feature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: colorval
								}),
								stroke: new ol.style.Stroke({
									color: colorval,
									width: 1
								}),
								image: new ol.style.Circle({
									radius: 1,
									fill: new ol.style.Fill({
										color: colorval
									})
								})
							}));
						}
					});
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					var layer = tmpl_setMap_layer_global[i].layer;
					layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == id) {
							feature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: colorval
								}),
								stroke: new ol.style.Stroke({
									color: colorval,
									width: 1
								}),
								image: new ol.style.Circle({
									radius: 1,
									fill: new ol.style.Fill({
										color: colorval
									})
								})
							}));
						}
					});
				}
			}

		}
	}


	var resultGetEditDetails = {};

	tmpl.Feature.saveSpatialEdit = function (param) {
		var mapObj = param.map;
		mapObj.removeInteraction(modify1);
		tmpl.Feature.spatialEditClose();
		return resultGetEditDetails.geometry;
	}
	tmpl.Feature.cancelSpatialEdit = function (param) {
		var mapObj = param.map;
		var feature = resultGetEditDetails.feature;
		if (feature != undefined)
			feature.getGeometry().setCoordinates(resultGetEditDetails.coordinates);
		//console.log(feature.getGeometry().getCoordinates());
		mapObj.removeInteraction(modify1);
		tmpl.Feature.spatialEditClose();
	}

	var feature_spatial_edit_id;
	var feature_spatial_edit_layer;
	var feature_spatial_edit_layer_callback;
	tmpl.Feature.spatialEditClose = function () {
		feature_spatial_edit_id = '';
		feature_spatial_edit_layer = '';
	}
	tmpl.Feature.spatialEdit = function (param) {
		var mapObj = param.map;
		var callbackFunc = param.callbackFunc;
		feature_spatial_edit_layer_callback = param.getDetailsCallbackFunc;
		var zoom = param.zoom;

		var propertyId = param.id;
		var lyrName = param.layerName;
		feature_spatial_edit_id = propertyId;
		feature_spatial_edit_layer = lyrName;
		var ft, latlon, wktGeom, coord, value;
		var previousFeature;
		var restrict_layer;
		var zoomExtent, zoomCoord;

		var format = new ol.format.WKT();
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(drawm);
		mapObj.removeInteraction(selectE);
		var selectfeatureIdEdit = new ol.interaction.Select({ wrapX: false, condition: ol.events.condition.click });
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for (i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') == lyrName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (fea) {
						if (fea.getProperties()['id'] == propertyId) {
							value = fea.getGeometry().getType();
							previousFeature = fea;
							ft = fea;
							if (value == 'Polygon') {
								previousFeature.setStyle(new ol.style.Style({
									fill: new ol.style.Fill({
										color: 'green'
									}),
									stroke: new ol.style.Stroke({
										color: 'green',
										width: 2
									})
								})
								);
							}
							restrict_layer = existingLayer;
							//	existingLayer.getSource().clear();
							existingLayer.getSource().removeFeature(previousFeature);
							existingLayer.getSource().addFeature(previousFeature);


						}
					});
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					var layerExits = tmpl_setMap_layer_global[i].layer;
					layerExits.getSource().getFeatures().forEach(function (fea) {
						if (fea.getProperties()['id'] == propertyId) {
							value = fea.getGeometry().getType();
							previousFeature = fea;
							ft = fea;
							if (value == 'Polygon') {
								previousFeature.setStyle(new ol.style.Style({
									fill: new ol.style.Fill({
										color: 'green'
									}),
									stroke: new ol.style.Stroke({
										color: 'green',
										width: 2
									})
								})
								);
							}
							restrict_layer = layerExits;
							layerExits.getSource().removeFeature(previousFeature);
							layerExits.getSource().addFeature(previousFeature);
						}
					});
				}
			}

		}
		if (zoom == true) {
			if (value == 'Point') {
				zoomExtent = ft.getGeometry().getCoordinates();
				if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
					zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
				} else {
					zoomCoord = zoomExtent;
				}
				//console.log(zoomCoord);
				tmpl.Zoom.toXY({
					map: mapObj,
					latitude: zoomCoord[1],
					longitude: zoomCoord[0]
				});
			} else {
				zoomExtent = ft.getGeometry().getExtent();
				if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
					zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
				} else {
					zoomCoord = zoomExtent;
				}
				tmpl.Zoom.toExtent({
					map: mapObj,
					extent: zoomCoord
				});
			}
		}

		selectfeatureIdEdit.getFeatures().a = [];
		selectfeatureIdEdit.getFeatures().a.push(ft);
		mapObj.removeInteraction(modify1);
		modify1 = new ol.interaction.Modify({
			features: selectfeatureIdEdit.getFeatures()
		});

		//latlon = ft.getGeometry().getCoordinates();
		resultGetEditDetails.coordinates = ft.getGeometry().getCoordinates();
		modify1.on('modifyend', function () {
			if (value === 'Point') {
				lonlat = ft.getGeometry().getCoordinates();
			}
			else if (value === 'LineString') {
				lonlat = ft.getGeometry().getFirstCoordinate();
			}
			else if (value === 'Polygon' || value === 'Circle') {
				// alert();
				console.log(value);
				lonlat = ft.getGeometry().getInteriorPoint().getCoordinates();
			}
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
				wktGeom = format.writeGeometry(ft.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				//console.log(wktGeom);
				//console.log(ol.proj.transform([latlon[0],latlon[1]], 'EPSG:3857', 'EPSG:4326'));
			} else {
				wktGeom = format.writeGeometry(ft.getGeometry());
				coord = lonlat;//ft.getGeometry().getCoordinates();
				//console.log(wktGeom);
				//console.log([latlon[0],latlon[1]]);
			}

			resultGetEditDetails.geometry = { geometry: wktGeom, coordinates: coord, value: value };
			resultGetEditDetails.feature = ft;

			callbackFunc(resultGetEditDetails.geometry);
		})
		mapObj.addInteraction(modify1);
	}

	tmpl.Feature.cancelDragDropDetails = function () { };
	tmpl.Feature.dragDropDetails = function (param) {
		var mapObj = param.map;
		var callbackFunc = param.callbackFunc;
		var img_url = param.img_url;
		var slyrName = param.sourceLayer;
		var dlyrName = param.destinationLayer;
		var ft, latlon, wktGeom, coord, value;
		var previousFeature;
		var restrict_layer;
		var zoomExtent, zoomCoord;
		var format = new ol.format.WKT();

		var layerS, featureTemp;
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == slyrName) {
				layerS = tmpl_setMap_layer_global[i].layer;

			}
		}
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(drawm);
		mapObj.removeInteraction(selectE);
		var selectfeatureIdEdit = new ol.interaction.Select({ wrapX: false, condition: ol.events.condition.click });
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		var dragedFeature;
		window.app = {};
		var app = window.app;
		var format = new ol.format.WKT();
		app.Drag = function () {
			ol.interaction.Pointer.call(this, {
				handleDownEvent: app.Drag.prototype.handleDownEvent,
				handleDragEvent: app.Drag.prototype.handleDragEvent,
				handleMoveEvent: app.Drag.prototype.handleMoveEvent,
				handleUpEvent: app.Drag.prototype.handleUpEvent
			});
			this.coordinate_ = null;
			this.cursor_ = 'pointer';
			this.feature_ = null;
			this.previousCursor_ = undefined;
		};
		ol.inherits(app.Drag, ol.interaction.Pointer);

		app.Drag.prototype.handleDownEvent = function (evt) {
			var map = evt.map;
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function (feature, layer) {
					//console.log(layer,feature.get('layer_name'));
					if (layer == null) {
						if (feature.get('layer_name') == slyrName) {
							feature.set('coord', feature.getGeometry().getCoordinates());
							var coordS = feature.getGeometry().getCoordinates();
							var pointdata_s = new ol.geom.Point(coordS);
							featureTemp = new ol.Feature({
								geometry: pointdata_s
							});
							featureTemp.setStyle(new ol.style.Style({
								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: feature.getStyle().getImage().getSrc()
								})),
								text: new ol.style.Text({
									font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
									textAlign: 'center',
									text: feature.getStyle().getText().getText(),
									fill: new ol.style.Fill({
										color: feature.getStyle().getText().getFill().getColor(),
										width: 20
									}),
									stroke: new ol.style.Stroke({
										color: feature.getStyle().getText().getStroke().getColor(),
										width: 6
									})
								})
							}));
							layerS.getSource().addFeature(featureTemp);
							return feature;
						}
					} else if (layer.get('title') == slyrName) {
						//layer.getSource().addFeature(feature);
						return feature;
					}

				});

			if (feature) {
				this.coordinate_ = evt.coordinate;
				this.feature_ = feature;
			}
			return !!feature;
		};

		app.Drag.prototype.handleDragEvent = function (evt) {
			var map = evt.map;
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function (feature, layer) {
					return feature;
				});
			var deltaX = evt.coordinate[0] - this.coordinate_[0];
			var deltaY = evt.coordinate[1] - this.coordinate_[1];
			var geometry =
				(this.feature_.getGeometry());
			geometry.translate(deltaX, deltaY);
			this.coordinate_[0] = evt.coordinate[0];
			this.coordinate_[1] = evt.coordinate[1];
		};

		app.Drag.prototype.handleMoveEvent = function (evt) {
			if (this.cursor_) {
				var map = evt.map;
				var feature = map.forEachFeatureAtPixel(evt.pixel,
					function (feature, layer) {
						return feature;
					});
				var element = evt.map.getTargetElement();
				if (feature) {
					editFeature = feature;
					point = feature.getGeometry().getCoordinates();
					var point;
					if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
						point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
					}
					else {
						// do notng
					}
					//point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
					if (element.style.cursor != this.cursor_) {
						this.previousCursor_ = element.style.cursor;
						element.style.cursor = this.cursor_;
					}
				} else if (this.previousCursor_ !== undefined) {
					element.style.cursor = this.previousCursor_;
					this.previousCursor_ = undefined;
				}
			}
		};

		app.Drag.prototype.handleUpEvent = function (evt) {
			var map = evt.map;
			var value = this.feature_.getGeometry().getType();
			if (value === 'Point') {
				lonlat = this.feature_.getGeometry();
			}
			else if (value === 'LineString') {
				lonlat = this.feature_.getGeometry();
			}
			else if (value === 'Polygon') {
				lonlat = this.feature_.getGeometry();
			}

			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
				wktGeom = format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coordinate = lonlat.getCoordinates();
				wktGeom = format.writeGeometry(lonlat);
				//  wktGeom= format.writeGeometry(this.feature_.getGeometry());
			}

			var result = {
				new_coordinates: coordinate
			};
			var dragFeature = this.feature_;

			if (dragFeature.getGeometry().getType() == 'Point') {
				layerS.getSource().removeFeature(featureTemp);
				lonlat = dragFeature.getGeometry().getCoordinates();
				dragFeature.getGeometry().setCoordinates(dragFeature.get('coord'));

				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					var lyr = tmpl_setMap_layer_global[i].title;
					if (dlyrName.indexOf(lyr) != -1) {
						restrict_layer = tmpl_setMap_layer_global[i].layer;
						//lonlat =tempFea.getGeometry().getCoordinates();
						var closestFeature = restrict_layer.getSource().getClosestFeatureToCoordinate(lonlat);

						var resultLocation = lonlat;

						var c1 = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');



						var c2 = ol.proj.transform(closestFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						var line = new ol.geom.LineString([c1, c2]);
						var len = line.getLength() * 100;
						console.log(len);
						var setZoomWiseLength = 0;
						if (map.getView().getZoom() <= 12) {
							setZoomWiseLength = 0.8;
						} else if (map.getView().getZoom() == 13) {
							setZoomWiseLength = 0.4;
						} else if (map.getView().getZoom() == 14) {
							setZoomWiseLength = 0.1;
						} else if (map.getView().getZoom() == 15) {
							setZoomWiseLength = 0.09;
						} else if (map.getView().getZoom() == 16) {
							setZoomWiseLength = 0.05;
						} else if (map.getView().getZoom() == 17) {
							setZoomWiseLength = 0.03;
						} else if (map.getView().getZoom() == 18) {
							setZoomWiseLength = 0.02;
						} else if (map.getView().getZoom() == 19) {
							setZoomWiseLength = 0.01;
						} else if (map.getView().getZoom() == 20) {
							setZoomWiseLength = 0.01;
						} else if (map.getView().getZoom() == 21) {
							setZoomWiseLength = 0.01;
						}
						if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
							if (len < setZoomWiseLength) {
								//alert("already Exist");
								var res = {
									source: dragFeature.getProperties(),
									destination: closestFeature.getProperties(),
									location: c1
								};
								callbackFunc(res);
							} else {

								var res = {
									source: dragFeature.getProperties(),
									destination: '',
									location: c1
								};
								callbackFunc(res);
							}
						} else {
							if (len < setZoomWiseLength) {
								//alert("already Exist");
								var res = {
									source: dragFeature.getProperties(),
									destination: closestFeature.getProperties(),
									location: resultLocation
								};
								callbackFunc(res);
							} else {

								var res = {
									source: dragFeature.getProperties(),
									destination: '',
									location: resultLocation
								};
								callbackFunc(res);
							}
						}

					}
				}

			}

			//mycallback(result);
			this.coordinate_ = null;
			this.feature_ = null;
			return false;
		};
		intr = new app.Drag();
		mapObj.addInteraction(intr);
		tmpl.Feature.cancelDragDropDetails = function (param) {
			var map = param.map;
			map.removeInteraction(intr);
		}
	}


	//------------------------------------ End of Drawing Tools ---------------------------------------------//



	//---------------------------------- Beginning of Custom Overlays ---------------------------------------//

	// **** creating a custom Overlay and adding that layer to the layer switcher **** //
	function getFeatureLabel() {
		var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
			if (layer) {
				if (layer.get('trip') == "TripAnimationLayer") {
					return feature;
				}
			}
		});
		ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
		if (feature_mouseOver) {
			overlay_mouseOver_trip.setPosition(evt.coordinate);
			ta_tooltip.innerHTML = feature_mouseOver.getProperties().location + "," + "Speed:" + feature_mouseOver.getProperties().speed + "," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
		}
	};


	tmpl.Overlay.create = function (param) {
		var mapObj = param.map;
		var jsonobj = param.features;
		var layerName = param.layer;
		var getHoverLabel = param.getHoverLabel;
		var layerSwitcher = param.layerSwitcher;
		var trackLayer = param.trackLayer;
		var image_scale = param.icon_scale;
		var getdata = jsonobj;
		if (image_scale == undefined)
			image_scale = 1;
		if (getdata.length == 0) {
			return false;
		}
		if (trackLayer == false || trackLayer == undefined) {
			var featureDataAry = [];

			for (var i = 0, length = getdata.length; i < length; i++) {
				var geometry;
				var anagle;
				if (getdata[i].ot_track_angle != undefined)
					anagle = getdata[i].ot_track_angle;
				else
					anagle = 0;


				var iconStyle = new ol.style.Icon(({
					src: getdata[i].img_url,
					anchor: [0.5, 1],
					scale: image_scale,
					// rotation: anagle											
				}));
				// var iconStyle = new ol.style.Icon( ({
				// src: getdata[i].img_url,
				// anchor: [0.5, 1],
				// scale : image_scale
				// }));
				if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
					geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
				}
				else {
					var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
					geometry = new ol.geom.Point(coordinate);
				}
				var featureval = new ol.Feature({
					geometry: geometry
				});
				featureval.setId(getdata[i].id);
				featureval.setProperties(getdata[i]);

				if (getdata[i].label_color == undefined) {
					getdata[i].label_color = '#ffffff00';
				}

				if (getdata[i].label_bgcolor == undefined) {
					getdata[i].label_bgcolor = '#ffffff00';
				}

				if (getHoverLabel == true) {

					featureval.setStyle(new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						image: iconStyle
					}));

				} else {
					featureval.setStyle(new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						image: iconStyle,
						text: new ol.style.Text({
							font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
							textAlign: 'center',
							text: getdata[i].label,
							fill: new ol.style.Fill({
								color: getdata[i].label_color,
								width: 20
							}),
							stroke: new ol.style.Stroke({
								color: getdata[i].label_bgcolor,
								width: 6
							})
						})
					}));
				}
				featureval.set('layer_name', layerName);
				featureDataAry.push(featureval);
			}
			if (getHoverLabel == true) {

				var ta_tooltip = document.createElement('tooltip');
				ta_tooltip.id = 'trip-tooltip';
				ta_tooltip.className = 'ol-trip-tooltip';
				var overlay_mouseOver_label = new ol.Overlay({
					element: ta_tooltip,
					offset: [10, 0],
					positioning: 'bottom-left'
				});
				mapObj.addOverlay(overlay_mouseOver_label);
				mapObj.on('pointermove', function (evt) {

					var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
						//if(layer){
						if (feature.get('layer_name') == layerName) {
							return feature;
						}
						//}
					});
					ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
					if (feature_mouseOver) {
						overlay_mouseOver_label.setPosition(evt.coordinate);
						ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
					}
				});
			}
			var source = new ol.source.Vector({
				features: featureDataAry
			});
			var Layers = mapObj.getLayers();
			var length = Layers.getLength();
			var OverlayisLayerPresent = false;
			for (var i = 0; i < length; i++) {
				var layerTemp = Layers.item(i);
				if (layerTemp.get('title') === layerName) {
					OverlayisLayerPresent = true;
					layerTemp.getSource().addFeatures(featureDataAry);
				}
			}

			for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
				if (tmpl_setMap_layer_global[j].title == layerName) {
					OverlayisLayerPresent = true;
					tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
				}
			}
			if (OverlayisLayerPresent == false) {

				var overlay = new ol.layer.Vector({
					title: layerName,
					visible: true,
					source: source
				});
				tmpl_setMap_layer_global.push({
					layer: overlay,
					title: layerName,
					visibility: true,
					map: mapObj
				});
				overlay.setMap(mapObj);
				//mapObj.addLayer(overlay);
				//if(layerSwitcher)
				//mapObj.addControl(new ol.control.LayerSwitcher());
				OverlayisLayerPresent = true;
			}
		} else if (trackLayer == true) {
			//console.log("Track Layer");
			var featureDataAry = [];

			for (var i = 0, length = getdata.length; i < length; i++) {
				var geometry;
				console.log("getdata::", getdata);
				if (global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + getdata[i].id) == -1) {
					//console.log("coming insideeeeeeeeeee");

					var anagle;
					// console.log("TRACK ANGLE FROM API======>",getdata[i].ot_track_angle);
					if (getdata[i].ot_track_angle != undefined)
						anagle = getdata[i].ot_track_angle;
					else
						anagle = 0;

					console.log("ANGLE==========>", anagle);
					var iconStyle = new ol.style.Icon(({
						src: getdata[i].img_url,
						anchor: [0.5, 1],
						scale: image_scale,
						//opacity: 0.5, //@sh
						// rotation: anagle,									
						// rotation: 0
					}));
					if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
						geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
					}
					else {
						var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
						geometry = new ol.geom.Point(coordinate);
					}
					var featureval = new ol.Feature({
						geometry: geometry
					});
					featureval.set('layer_name', layerName);
					featureval.setProperties(getdata[i]);
					if (getHoverLabel == true) {

						featureval.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
							}),
							image: iconStyle
						}));

					} else {
						featureval.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
							}),
							image: iconStyle,
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
								textAlign: 'center',
								text: getdata[i].label,
								fill: new ol.style.Fill({
									color: getdata[i].label_color,
									width: 20
								}),
								stroke: new ol.style.Stroke({
									color: getdata[i].label_bgcolor,
									width: 6
								}),
								textBaseline: 'bottom', // or 'top' to display label above the icon
								//offsetY: -35 // adjust the offset value as per your requirement
							})
						}));
					}
					featureDataAry.push(featureval);


					global_fleet_layer_id.push('fleet_' + layerName + '_' + getdata[i].id);
					global_fleet_layer_features.push(featureval);
					var v1 = new tmpl.Track.smoothMovement({ map: mapObj, id: getdata[i].id, layername: layerName, feature: featureval, featureId: 'fleet_' + layerName + '_' + getdata[i].id });
					global_fleet_layer_objects.push(v1);
					var point = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
					v1.sendTrackData(point);

				}
			}

			//alert("Out side Number of features inserting : "+featureDataAry.length);
			if (featureDataAry.length > 0) {
				//console.log("Number of features inserting : ",featureDataAry.length);
				if (getHoverLabel == true) {

					var ta_tooltip = document.createElement('tooltip');
					ta_tooltip.id = 'trip-tooltip';
					ta_tooltip.className = 'ol-trip-tooltip';
					var overlay_mouseOver_label = new ol.Overlay({
						element: ta_tooltip,
						offset: [10, 0],
						positioning: 'bottom-left'
					});
					mapObj.addOverlay(overlay_mouseOver_label);
					mapObj.on('pointermove', function (evt) {

						var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
							if (layer == null) {
								if (feature.get('layer_name') == layerName) {
									return feature;
								}
							} else {
								if (layer) {
									if (layer.get('title') == layerName) {
										return feature;
									}
								}
							}

						});
						ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
						if (feature_mouseOver) {
							overlay_mouseOver_label.setPosition(evt.coordinate);
							ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
						}
					});
				}
				var source = new ol.source.Vector({
					features: featureDataAry
				});

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var OverlayisLayerPresent = false;
				for (var i = 0; i < length; i++) {
					var layerTemp = Layers.item(i);
					if (layerTemp.get('title') === layerName) {
						OverlayisLayerPresent = true;
						layerTemp.getSource().addFeatures(featureDataAry);
					}
				}

				for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
					if (tmpl_setMap_layer_global[j].title == layerName) {
						OverlayisLayerPresent = true;

						tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
					}
				}
				if (OverlayisLayerPresent == false) {
					var overlay = new ol.layer.Vector({
						title: layerName,
						visible: true,
						source: source
					});
					tmpl_setMap_layer_global.push({
						layer: overlay,
						title: layerName,
						visibility: true,
						map: mapObj
					});
					globale_layer_names.push(layerName);
					overlay.setMap(mapObj);
					//if(layerSwitcher)
					//mapObj.addControl(new ol.control.LayerSwitcher());
					OverlayisLayerPresent = true;
				}
			}

		}

		return true;
	}


	//new fleet 
	var global_fleet_layer_id = [];
	var global_fleet_layer_features = [];
	var global_fleet_layer_objects = [];
	var globale_layer_names = [];

	tmpl.Track.withoutLine = function (param) {
		//console.log(global_fleet_layer_objects);
		var data = param.data;
		var properties = param.data.properties;
		console.log("properties", properties);
		for (var i = 0; i < data.length; i++) {
			var fleet_overlayId = 'fleet_' + data[i].layerName + '_' + data[i].id;
			var index = global_fleet_layer_id.indexOf(fleet_overlayId);
			var fleet_overlay = global_fleet_layer_features[index];
			var fleet_overlay_object = global_fleet_layer_objects[index];
			var pos = [data[i].lon, data[i].lat];
			var properties = data[i].properties;
			if (fleet_overlay_object != undefined)
				fleet_overlay_object.sendTrackData(pos, properties);

		}
	}

	tmpl.Track.smoothMovement = function (param) {
		this.map = param.map;
		this.layername = param.layername;
		this.track_end_marker;
		this.track_ivlDraw;
		this.fleet_points = [];
		this.first_fleet_flag = true;
		this.vehicleId = param.id;
		this.feature = param.feature;
		this.fleet_featureId = param.featureId;
	}
	tmpl.Track.smoothMovement.prototype = {
		sendTrackData: function (pos, properties) {

			if (properties != undefined) {
				for (var key in properties) {
					if (properties.hasOwnProperty(key)) {
						this.feature.set(key, properties[key]);
					}
				}
			}
			if (this.fleet_points.length > 1) {
				if (this.fleet_points[this.fleet_points.length - 1][0] == pos[0] && this.fleet_points[this.fleet_points.length - 1][1] == pos[1]) {
				} else {
					this.fleet_points.push(pos);
				}
			} else {
				this.fleet_points.push(pos);
			}
			if (this.fleet_points.length > 1) {
				if (this.first_fleet_flag == true) {
					this.startFleet();
					this.first_fleet_flag = false;
				}
			}
		},
		startFleet: function () {

			var point = this.fleet_points[1];
			var p_point = this.fleet_points[0];
			point[0] = parseFloat(point[0]);
			point[1] = parseFloat(point[1]);
			p_point[0] = parseFloat(p_point[0]);
			p_point[1] = parseFloat(p_point[1]);
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps") {
				point = ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857');
				p_point = ol.proj.transform(p_point, 'EPSG:4326', 'EPSG:3857');
			}
			else {

			}

			this.drawAnimatedLine(p_point, point, 50, 10000);
			//}
		},
		drawAnimatedLine: function (startPt, endPt, steps, time) {
			var directionX = (endPt[0] - startPt[0]) / steps;
			var directionY = (endPt[1] - startPt[1]) / steps;
			var i = 0;
			var newEndPt;
			var itsparent = this;
			var angle = rotate({
				x1: startPt[0],
				y1: startPt[1],
				x2: endPt[0],
				y2: endPt[1]
			});
			itsparent.track_ivlDraw = setInterval(function () {
				var map = itsparent.map;
				if (i > steps) {
					clearInterval(itsparent.track_ivlDraw);
					itsparent.fleet_points.splice(0, 1);
					if (itsparent.fleet_points.length > 1) {
						itsparent.startFleet();
					} else {
						itsparent.first_fleet_flag = true;
					}
				}
				newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];

				if (isNaN(angle) == false)
					itsparent.feature.getStyle().getImage().setRotation(angle);

				itsparent.feature.getGeometry().setCoordinates(newEndPt);

				var toltipTick = new ol.geom.Point(ol.proj.transform([startPt[0] + i * directionX, startPt[1] + i * directionY], 'EPSG:3857', 'EPSG:4326'));
				var toltipTickcoordinates = toltipTick.getCoordinates();
				var latitude = toltipTickcoordinates[1]; // Extract latitude from the transformed coordinates
				var longitude = toltipTickcoordinates[0]; // Extract longitude from the transformed coordinates

				console.log("newEndPt..", newEndPt, toltipTick, this.feature);
				/*var html = '<div> <table> <tr> <td> Camera ID </td> <td> 4 </td> </tr> </table> </div>';
			tmpl.Tooltip.addMultiple({
				map : map,
				html : html,
				coordinate :  [78.06631565093996, 30.284529875493845],
				offset : [0,-10]
			});*/


				i++;
			}, time / 50);

		},
		clearTrack: function () {
			clearInterval(this.track_ivlDraw);
		}
	}

	// **** This function displays the given geometry as layer with default styles **** //

	tmpl.Overlay.addGeometry = function (param) {
		var mapObj = param.map;
		var lyrName = param.layer;
		var property = param.properties;
		var getHoverLabel = param.getHoverLabel;
		var geometryVal = param.geometry;
		var format = new ol.format.WKT();
		var feature;
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		}
		else {
			var feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		}
		if (getHoverLabel == true) {
			feature.setStyle(new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: '#1b465a',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#1b465a'
					})
				})
			}));
		} else {
			feature.setStyle(new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: '#1b465a',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#1b465a'
					})
				}),
				text: new ol.style.Text({
					font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
					textAlign: 'center',
					/*textBaseline: 'bottom',
					offsetX : parseInt(0, 10),
					offsetY : parseInt(0, 10),*/
					text: property.label,
					fill: new ol.style.Fill({
						color: property.label_color,
						width: 20
					}),
					stroke: new ol.style.Stroke({
						color: property.label_bgcolor,
						width: 6
					})
				})
			}));
		}
		feature.setProperties(property);
		feature.set('layer_name', lyrName);
		var source = new ol.source.Vector({
			features: [feature]
		});



		// if(getHoverLabel == true){

		// 		var ta_tooltip = document.createElement('tooltip');
		// ta_tooltip.id = 'trip-tooltip';
		// ta_tooltip.className = 'ol-trip-tooltip';
		// var overlay_mouseOver_label = new ol.Overlay({
		//     element: ta_tooltip,
		//     offset: [10, 0],
		//     positioning: 'bottom-left'
		// });
		// mapObj.addOverlay(overlay_mouseOver_label);
		// 	mapObj.on('pointermove', function(evt){

		// 		var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature/*, layer*/) {
		// 		//if(layer){
		// 			//console.log("FT >>",feature.get('layer_name'));
		// 			if(feature.get('layer_name') == lyrName){
		// 				return feature;
		// 			}
		// 		//}
		// 		});
		// 		ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
		// 		if(feature_mouseOver) {
		// 			overlay_mouseOver_label.setPosition(evt.coordinate);
		// 			ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
		// 		}
		// 	});
		// }
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var isLayerPresent11 = false;
		var existing;
		for (i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === lyrName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (fea) {
						if (fea.getProperties()['id'] == property.id) {
							existingLayer.getSource().removeFeature(fea);
						}
					});
					isLayerPresent11 = true;
					//existingLayer.getSource().clear();
					existingLayer.getSource().addFeature(feature);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (fea) {
						if (fea.getProperties()['id'] == property.id) {
							tmpl_setMap_layer_global[i].layer.getSource().removeFeature(fea);
						}
					});
					isLayerPresent11 = true;
					tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
				}
			}

		}
		if (isLayerPresent11 == false) {
			var newLayer = new ol.layer.Vector({
				title: lyrName,
				visible: true,
				source: source
			});
			tmpl_setMap_layer_global.push({
				layer: newLayer,
				title: lyrName,
				visibility: true,
				map: mapObj
			});
			isLayerPresent11 == true;
			//mapObj.addLayer(newLayer);
			newLayer.setMap(mapObj);
			//		mapObj.addControl(new ol.control.LayerSwitcher());
		}

	}

	// **** This function displays the given geometry as layer in user specified colors **** //
	var addGoemetryFlag = false;
	tmpl.Overlay.addGeometryWithColor = function (param) {
		//alert();
		var mapObj = param.map;
		var geometryVal = param.geometry;
		//console.log(param.properties)
		var property = param.properties;
		var colorval = param.color;
		var lyrName = param.layer;
		var borderColor = param.borderColor;
		var borderWidth = param.borderWidth;
		var label = param.label;
		var borderAnimate = param.borderAnimate;
		var getHoverLabel = param.getHoverLabel;
		var dottedLine = param.dottedLine;
		var format = new ol.format.WKT();
		var color;
		if (borderWidth == undefined) {
			borderWidth = 1;
		}
		if (dottedLine == undefined) {
			dottedLine = [0, 0];
		}
		if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {

			var feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});

			var strokeColor
			if (borderColor == undefined)
				strokeColor = colorval;
			else
				strokeColor = borderColor;


			feature.set('label', label);
			feature.set('color', strokeColor);
			feature.setStyle(new ol.style.Style({

				fill: new ol.style.Fill({
					color: colorval,
					opacity: 0.2
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: borderWidth,
					lineDash: dottedLine
				}),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: colorval,
						opacity: 0.2
					})
				})
			}));
		}
		else {

			var feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
			feature.set('label', label);
			feature.set('color', strokeColor);
			var colours = {
				"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
				"beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
				"cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
				"darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
				"darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
				"darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
				"firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
				"gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
				"honeydew": "#f0fff0", "hotpink": "#ff69b4",
				"indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
				"lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
				"lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
				"lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
				"magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
				"mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
				"navajowhite": "#ffdead", "navy": "#000080",
				"oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
				"palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
				"red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
				"saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
				"tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
				"violet": "#ee82ee",
				"wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
				"yellow": "#ffff00", "yellowgreen": "#9acd32"
			};

			if (typeof colours[colorval.toLowerCase()] != 'undefined')
				var colorfinal = colours[colorval.toLowerCase()];
			var hexColor = colorfinal;
			if (hexColor) {
				color = ol.color.asArray(hexColor);
				color = color.slice();
				color[3] = 0.5;
			}
			else {
				color = colorval;
			}

			var strokeColor
			if (borderColor == undefined)
				strokeColor = colorval;
			else
				strokeColor = borderColor;
			feature.setStyle(new ol.style.Style({
				fill: new ol.style.Fill({
					color: colorval
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: borderWidth,
					lineDash: dottedLine
				}),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: colorval
					})
				})
			}));
		}
		if (property) {
			feature.setProperties(property);
		}
		//feature.set('title',lyrName);
		feature.set('layer_name', lyrName);
		//console.log(feature);
		var source = new ol.source.Vector({
			features: [feature]
		});
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var isLayerPresent = false;
		var existing;
		for (i = 0; i < length; i++) {
			var l1 = lyrs.item(i);
			if (l1) {
				lyrtest = l1;
				if (l1.get('title') === lyrName) {
					existing = l1;
					isLayerPresent = true;
					//l1.getSource().clear();
					l1.getSource().addFeature(feature);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					isLayerPresent = true;
					//tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
				}
			}

		}
		var gblanimationfeature = '', gblanimationfeaturecolor = '';

		if (!isLayerPresent) {
			var layerVal = new ol.layer.Vector({
				title: lyrName,
				visible: true,
				source: source
			});
			console.log("Polygon layerVal:", layerVal);
			//alert();


			//layerVal.setZIndex(200);
			tmpl_setMap_layer_global.push({
				layer: layerVal,
				title: lyrName,
				visibility: true,
				map: mapObj
			});
			layerVal.setMap(mapObj);
		}
		//	console.log(label);
		if (label != undefined) {

			if (getHoverLabel == true) {

				var ta_tooltip = document.createElement('tooltip');
				ta_tooltip.id = 'trip-tooltip';
				ta_tooltip.className = 'ol-trip-tooltip';
				var overlay_mouseOver_label = new ol.Overlay({
					element: ta_tooltip,
					offset: [10, 0],
					positioning: 'bottom-left'
				});

				mapObj.addOverlay(overlay_mouseOver_label);

				mapObj.on('pointermove', function (evt) {
					var layera
					var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
						if (feature.get('layer_name') == lyrName) {

							return feature;
						}
					});

					ta_tooltip.style.display = feature_mouseOver ? '' : 'none';

					if (feature_mouseOver) {
						overlay_mouseOver_label.setPosition(evt.coordinate);
						ta_tooltip.innerHTML = feature_mouseOver.get('label');
					}
				});

			}
		}
	}




	tmpl.Overlay.addMarker = function (param) {
		var mapObj = param.map;
		var img_url = param.img_url;
		var height = param.height;
		var width = param.width;
		var id = param.id;
		var offset = param.offset;
		var point = param.point;
		var x = parseFloat(point[0]);
		var y = parseFloat(point[1]);
		var mr_olyrID = mapObj.getOverlayById('marker_OverlayID');
		if (mr_olyrID) {
			mapObj.removeOverlay(mr_olyrID);
		}
		var container = document.createElement('div');
		container.className = 'containerAPI ';
		var elem = document.createElement("img");
		elem.setAttribute("src", img_url);
		elem.setAttribute("height", height);
		elem.setAttribute("width", width);
		container.appendChild(elem);
		var marker_pos = new ol.Overlay({
			id: id,
			element: container,
			offset: offset,
			positioning: 'center'
		});
		mapObj.addOverlay(marker_pos);
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			marker_pos.setPosition(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857'));
		}
		else {
			marker_pos.setPosition([x, y]);
		}
		marker_pos.setProperties({ olname: "markerOverlay" });
	}
	tmpl.Overlay.markerWithName = function (param) {
		var mapObj = param.map;
		var point = param.point;
		var lon = point[0];
		var lat = point[1];
		var plName = param.name;
		var img_url = param.img_url;
		var height = param.height;
		var width = param.width;
		var offset = param.offset;
		var id = param.id;
		var overlayID = mapObj.getOverlayById(id);
		var overlayIDL = mapObj.getOverlayById(id + 'label');
		if (overlayID) {
			mapObj.removeOverlay(overlayID);
			mapObj.removeOverlay(overlayIDL);
		}
		var container = document.createElement('div');
		container.className = 'containerAPI '
		var container1 = document.createElement('div');
		container1.className = 'containerAPI ';
		var elem = document.createElement("img");
		elem.setAttribute("src", img_url);
		elem.setAttribute("height", height);
		elem.setAttribute("width", width);
		var labelDiv = document.createElement('div');
		labelDiv.className = 'bottom_Marker';
		labelDiv.innerHTML = plName;
		container1.appendChild(elem);
		container.appendChild(labelDiv);
		var marker_pos = new ol.Overlay({
			id: id,
			element: container1,
			offset: offset,
			positioning: 'center-center'
		});
		var marker_pos1 = new ol.Overlay({
			id: id + 'label',
			element: container,
			offset: offset,
			positioning: 'center-center'
		});
		mapObj.addOverlay(marker_pos);
		mapObj.addOverlay(marker_pos1);
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			marker_pos.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
			marker_pos1.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else {
			marker_pos.setPosition([lon, lat]);
			marker_pos1.setPosition([lon, lat]);
		}
		marker_pos.setProperties({ olname: "searchOverlay" });
		marker_pos1.setProperties({ olname: "searchOverlay" });
	}
	tmpl.Overlay.removeMarker = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var mr_olyrID = mapObj.getOverlayById(id);
		var mr_olyrID1 = mapObj.getOverlayById(id + 'label');
		if (mr_olyrID) {
			mapObj.removeOverlay(mr_olyrID);
			if (mr_olyrID1 != undefined)
				mapObj.removeOverlay(mr_olyrID1);
		}
	}

	//------------------------------------- End of Custom Overlay ------------------------------------------//

	//--------------------------------- Beginning of Google Map services -----------------------------------//

	// **** This will return the route between specified source and destination points **** //


	//// joel updating route on 01-12-2016   route v 2p5p008


	var totalDistance = 0;
	var routeLayer;
	var routeVector_line;
	var routeLayer_waypoint;
	tmpl.Route.clearRoute = function (param) {
		var mapObj = param.map;
		var layer = param.layer;
		if (routeLayer != undefined)
			routeLayer.getSource().clear();
		if (routeVector_line != undefined)
			routeVector_line.getSource().clear();
		if (routeLayer_waypoint != undefined)
			routeLayer_waypoint.getSource().clear();
		totalDistance = 0;

		try {
			mapObj.getLayers().forEach(function (layer) {

				if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				} else {
					//mapObj.removeLayer(layer);
					console.log("No Layer Available..!");
				}
			});
		} catch (e) { console.log("Layer Not Available..!"); }

		if (layer) {
			var existing;
			var Layers = mapObj.getLayers();
			var length = Layers.getLength();
			for (var i = 0; i < length; i++) {
				var existingLayer = Layers.item(i);
				if (existingLayer) {
					if (existingLayer.get('lname') === layer) {
						// if(existingLayer.get('lname') === layer){
						existing = existingLayer;
						mapObj.removeLayer(existingLayer);
					}
				}
			}
		}
		try {
			mapObj.getLayers().forEach(function (layer) {

				if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				} else {
					//mapObj.removeLayer(layer);
					console.log("No Layer Available..!");
				}
			});
		} catch (e) { console.log("Layer Not Available..!"); }
	}
	tmpl.Route.getRoute = function (param) {
		var mapObj = param.map;
		tmpl.Route.clearRoute(mapObj);
		if (appConfigInfo.mapData == "google") {

			if (appConfigInfo.mapDataService == 'esri') {
				getEsriRoute(param);
			}
			else {
				getGoogleRoute(param);
			}
		}
		else if (appConfigInfo.mapData == "hereMaps") {
			getHereMapsRoute(param);
		}
		else if (appConfigInfo.mapData == 'sgl') {
			getSGLRoute1(param);
		}
		else {
			// if(appConfigInfo.type=='sgl'){
			//  getsglroute(param);
			//}
			//else{
			getTrinityRoute(param);
			//}
		}
	}

	function getSGLRoute(param) {
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var wayPointFormat = param.wayPointFormat;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		var callbackFunc = param.callbackFunc;
		var getGeomCallback = param.getGeometry;
		var route_width = param.route_width;
		var stops1 = param.waypoints;
		var stopsIcon = param.waypointsIcon;
		var wayptArray = [];
		var routeUrl = null;
		var tempPoint = null;
		var sourcePointfinal = null;
		var destinationPointfinal = null;
		var routeLine = [];
		var routetempArr = [];
		var coordinateArray = [];
		var ETA_legs = null
		//source : [ 77.5964 , 12.9647 ]
		//destination : [ 77.6324, 12.9590 ]



		//convert Lat Lon
		var settings = {
			"url": appConfigInfo.sglTransformwk + "?wkt=POINT(" + sourcePoint[0] + " " + sourcePoint[1] + ")&srid=4326&output_srid=32645&astext=true",
			"method": "GET",
			"timeout": 0,
			"headers": {
				"Authorization": appConfigInfo.sglToken
			},
		};

		$.ajax(settings).done(function (response) {
			console.log("response:", response);
			tempPoint = response[0].geometry;
			tempPoint = tempPoint.slice(6);
			tempPoint = tempPoint.replace(')', '');
			tempPoint = tempPoint.split(" ");
			console.log("tempPoint:", tempPoint);
			sourcePointfinal = tempPoint;

			//convert lat lon
			var settings = {
				"url": appConfigInfo.sglTransformwk + "?wkt=POINT(" + destinationPoint[0] + " " + destinationPoint[1] + ")&srid=4326&output_srid=32645&astext=true",
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": appConfigInfo.sglToken
				},
			};

			$.ajax(settings).done(function (response) {
				console.log("response:", response);
				tempPoint = response[0].geometry;
				tempPoint = tempPoint.slice(6);
				tempPoint = tempPoint.replace(')', '');
				tempPoint = tempPoint.split(" ");
				console.log("tempPoint:", tempPoint);
				destinationPointfinal = tempPoint;
				console.log("sourcePointfinal,destinationPointfinal", sourcePointfinal, destinationPointfinal);

				//Get Route Fetcher ID
				var settings = {
					"url": appConfigInfo.sglGetShortestPath + "?x1=" + sourcePointfinal[0] + "&y1=" + sourcePointfinal[1] + "&x2=" + destinationPointfinal[0] + "&y2=" + destinationPointfinal[1],
					"method": "GET",
					"timeout": 0,
				};

				$.ajax(settings).done(function (response) {
					console.log(response.ogcfids);

					// Road Center Line 
					var settings = {
						"url": appConfigInfo.sglGetTableDetails + "/road_centerlines?filter=ogc_fid in (" + response.ogcfids + ") ",
						"method": "GET",
						"timeout": 0,
						"headers": {
							"Authorization": appConfigInfo.sglToken
						},
					};
					$.ajax(settings).done(function (response) {
						console.log(response);
						for (z = 0; z < response.length; z++) {
							var temp1 = response[z].geom;

							routeLine.push({
								line: temp1
							});
							console.log("Line added");
						}
						routetempArr.push({
							lines: routeLine
						});
						console.log("temp1::", routetempArr);
						var settings = {
							"url": appConfigInfo.trinitySGLMergeLine,
							"method": "POST",
							"timeout": 0,
							"headers": {
								"Content-Type": "application/json"
							},
							"data": JSON.stringify(routetempArr[0]),
						};
						$.ajax(settings).done(function (response) {
							console.log("response:", response);
							var routeLine = response.data
							//var res = str.replace("MULTILINESTRING(", "");
							//res = res.replace("))", "");
							//res = res.replace(")", "");
							//res = res.replace("(", "");
							//var tempArr = [coordinateArray[0]];
							console.log("routeLine:", routeLine);
							sglCreateRouteLayer(routeLine, param);
							//CreateLayer(param, sourcePoint, destinationPoint, coordinateArray, ETA_legs) 
						});
					});


				});

			});

		});

		function sglCreateRouteLayer(routeLine, param) {

			console.log("sglCreateRouteLayer line:", routeLine);

			try {
				tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
				tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });
				tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
				tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });
			}
			catch (e) {
				console.log("Line Layer Creation Error..!", e);
			}

			tmpl.Overlay.addGeometry({
				map: param.map,
				geometry: routeLine,
				properties: {
					id: 1,
					name: "path",
					type: "visited",
				},
				layer: 'RouteLineLayer'
			});

			var srcIconStyle = new ol.style.Icon(({
				src: sourceIcon,
				anchor: [0.5, 1],
				scale: 1.0
			}));
			var destIconStyle = new ol.style.Icon(({
				src: destinationIcon,
				anchor: [0.5, 1],
				scale: 1.0
			}));

			var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:4326'));
			var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:4326'));

			var srcfeatureVal = new ol.Feature({
				geometry: srcGeom
			});
			var destfeatureVal = new ol.Feature({
				geometry: destGeom
			});

			srcfeatureVal.setStyle(new ol.style.Style({
				image: srcIconStyle,
			}));
			destfeatureVal.setStyle(new ol.style.Style({
				image: destIconStyle,
			}));

			srcfeatureVal.set('layer_name', 'RoutePoint');
			destfeatureVal.set('layer_name', 'RoutePoint');

			var src = new ol.source.Vector({
				features: [srcfeatureVal]
			});
			var dest = new ol.source.Vector({
				features: [destfeatureVal]
			});

			var srcOverlay = new ol.layer.Vector({
				title: "RoutePoint",
				visible: true,
				source: src
			});
			var destOverlay = new ol.layer.Vector({
				title: "RoutePoint",
				visible: true,
				source: dest
			});

			mapObj.addLayer(srcOverlay);
			mapObj.addLayer(destOverlay);

		}

	}

	function getSGLRoute1(param) {
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var wayPointFormat = param.wayPointFormat;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		var callbackFunc = param.callbackFunc;
		var getGeomCallback = param.getGeometry;
		var route_width = param.route_width;
		var stops1 = param.waypoints;
		var stopsIcon = param.waypointsIcon;
		var wayptArray = [];
		var routeUrl = null;
		var tempPoint = null;
		var sourcePointfinal = null;
		var destinationPointfinal = null;
		var routeLine = [];
		var routetempArr = [];
		var coordinateArray = [];
		var ETA_legs = null
		//source : [ 77.5964 , 12.9647 ]
		//destination : [ 77.6324, 12.9590 ]



		//convert Lat Lon
		// var settings = {
		//   "url": appConfigInfo.sglTransformwk+"?wkt=POINT("+sourcePoint[0]+" "+ sourcePoint[1]+")&srid=32644&output_srid=32645&astext=true",
		//   "method": "GET",
		//   "timeout": 0,
		//   "headers": {
		// 	"Authorization": appConfigInfo.sglToken
		//   },
		// };
		var settings = {
			"url": appConfigInfo.sglTransformwk + "wkt=POINT(" + sourcePoint[0] + " " + sourcePoint[1] + ")&srid=4326&output_srid=32644&astext=true",
			"method": "GET",
			"timeout": 0,
			"headers": {
				"Authorization": appConfigInfo.sglToken
			},
		};

		//   $.ajax(settings).done(function (response) {
		// 	console.log(response);
		//   });

		$.ajax(settings).done(function (response) {
			console.log("response:", response);
			tempPoint = response[0].geometry;
			tempPoint = tempPoint.slice(6);
			tempPoint = tempPoint.replace(')', '');
			tempPoint = tempPoint.split(" ");
			console.log("tempPoint:", tempPoint);
			sourcePointfinal = tempPoint;

			//convert lat lon
			//  var settings = {
			//   "url": appConfigInfo.sglTransformwk+"?wkt=POINT("+destinationPoint[0]+" "+ destinationPoint[1]+")&srid=32644&output_srid=32645&astext=true",
			//   "method": "GET",
			//   "timeout": 0,
			//   "headers": {
			// 	"Authorization": appConfigInfo.sglToken
			//   },
			// };

			var settings = {
				"url": appConfigInfo.sglTransformwk + "wkt=POINT(" + destinationPoint[0] + " " + destinationPoint[1] + ")&srid=4326&output_srid=32644&astext=true",
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": appConfigInfo.sglToken
				},
			};

			$.ajax(settings).done(function (response) {
				console.log("response:", response);
				tempPoint = response[0].geometry;
				tempPoint = tempPoint.slice(6);
				tempPoint = tempPoint.replace(')', '');
				tempPoint = tempPoint.split(" ");
				console.log("tempPoint:", tempPoint);
				destinationPointfinal = tempPoint;
				console.log("sourcePointfinal,destinationPointfinal", sourcePointfinal, destinationPointfinal);

				//Get Route Fetcher ID
				var settings = {
					"url": appConfigInfo.sglGetShortestPath + "?layerName=road_centerline&x1=" + sourcePointfinal[0] + "&y1=" + sourcePointfinal[1] + "&x2=" + destinationPointfinal[0] + "&y2=" + destinationPointfinal[1],
					"method": "GET",
					"timeout": 0,
					"headers": {
						"Authorization": appConfigInfo.sglToken
					},
				};

				$.ajax(settings).done(function (response) {
					console.log(response.networkResult);

					var recivedRoute = response.networkResult;
					var distance = response.networkDistance[0].distance;
					routeLine.push({
						line: response.networkResult
					});

					routetempArr.push({
						lines: routeLine
					});


					//console.log("temp1::",routetempArr);
					/*	var settings = {
										  "url": appConfigInfo.trinitySGLMergeLine,
										  "method": "POST",
										  "timeout": 0,
										  "headers": {
											"Content-Type": "application/json"
										  },
										  "data": JSON.stringify(routetempArr[0]),
										};
										$.ajax(settings).done(function (response) {
										console.log("response:",response);
										var routeLine = response.data
										//var res = str.replace("MULTILINESTRING(", "");
										//res = res.replace("))", "");
										//res = res.replace(")", "");
										//res = res.replace("(", "");
										//var tempArr = [coordinateArray[0]];
										console.log("routeLine:",routeLine);
										sglCreateRouteLayer(routeLine,param);
										//CreateLayer(param, sourcePoint, destinationPoint, coordinateArray, ETA_legs) 
										});
										*/
					sglCreateRouteLayer(recivedRoute, distance, param);

				});


			});

		});

		function sglCreateRouteLayer(routeLine, distance, param) {

			console.log("sglCreateRouteLayer line:", routeLine);

			try {
				tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
				tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });
				tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
				tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });
			}
			catch (e) {
				console.log("Line Layer Creation Error..!", e);
			}

			tmpl.Overlay.addGeometry({
				map: param.map,
				geometry: routeLine,
				properties: {
					id: 1,
					name: "path",
					type: "visited",
				},
				layer: 'RouteLineLayer'
			});

			tmpl.Route.buffer({ wktgeom: routeLine, callBackFunc: bufferRoute });
			function bufferRoute(roadbuffer) {
				getGeomCallback(roadbuffer);
			}

			tmpl.Zoom.toLayer({ map: param.map, layer: 'RouteLineLayer' });

			var srcIconStyle = new ol.style.Icon(({
				src: sourceIcon,
				anchor: [0.5, 1],
				scale: 1.0
			}));
			var destIconStyle = new ol.style.Icon(({
				src: destinationIcon,
				anchor: [0.5, 1],
				scale: 1.0
			}));

			var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:4326'));
			var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:4326'));

			var srcfeatureVal = new ol.Feature({
				geometry: srcGeom
			});
			var destfeatureVal = new ol.Feature({
				geometry: destGeom
			});

			srcfeatureVal.setStyle(new ol.style.Style({
				image: srcIconStyle,
			}));
			destfeatureVal.setStyle(new ol.style.Style({
				image: destIconStyle,
			}));

			srcfeatureVal.set('layer_name', 'RoutePoint');
			destfeatureVal.set('layer_name', 'RoutePoint');

			var src = new ol.source.Vector({
				features: [srcfeatureVal]
			});
			var dest = new ol.source.Vector({
				features: [destfeatureVal]
			});

			var srcOverlay = new ol.layer.Vector({
				title: "RoutePoint",
				visible: true,
				source: src
			});
			var destOverlay = new ol.layer.Vector({
				title: "RoutePoint",
				visible: true,
				source: dest
			});

			if (callbackFunc) {
				// 	var resETA = {};
				// 	var dis = rLength;//resp.routes[0].distance;
				// 	var durati = (km * 60) / 35;//resp.routes[0].duration;
				// 	console.log("ETA:",durati);
				// 	resETA.distance = {};
				//   resETA.distance.value = rLength;//dis.toFixed(3);
				//   resETA.distance.units = 'M';
				//   resETA.duration = {};
				//   resETA.duration.value = durati.toFixed(3);
				//   resETA.duration.units = 'S';
				//resETA.distance.value = routeDistance;
				//resETA.duration.value = routeETA;
				callbackFunc(sourcePoint, destinationPoint, distance, routeLine);
			}

			mapObj.addLayer(srcOverlay);
			mapObj.addLayer(destOverlay);

		}

	}


	function getTrinityRoute(param) {
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var wayPointFormat = param.wayPointFormat;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		var callbackFunc = param.callbackFunc;
		var getGeomCallback = param.getGeometry;
		var route_width = param.route_width;
		var stops1 = param.waypoints;
		var stopsIcon = param.waypointsIcon;
		var wayptArray = [];
		var routeUrl = null;
		var tempPoint = null;
		var sourcePointfinal = null;
		var destinationPointfinal = null;
		var routeLine = [];
		var routetempArr = [];
		var coordinateArray = [];
		var ETA_legs = null
		var tempStops = [];
		var routeLocation = [];
		var sLocation = { "longitude": sourcePoint[0], "latitude": sourcePoint[1] };
		var dLocation = { "longitude": destinationPoint[0], "latitude": destinationPoint[1] };



		let sourceLat = param.source[1].toString();
		let sourceLon = param.source[0].toString();
		let destinationLat = param.destination[1].toString();
		let destinationLon = param.destination[0].toString();

		const reqObj =
		{
			"slon": sourceLon,
			"slat": sourceLat,
			"dlon": destinationLon,
			"dlat": destinationLat
		};

		let viapoints = [];
		if (param.waypoints && Array.isArray(param.waypoints)) {
			if (param.waypoints.length > 0) {
				viapoints = param.waypoints;
				reqObj.waypoints = viapoints;
			}
		}
		else {
			waypoints = false;
		}
		console.log(
			"sourceLat",
			"sourceLon",
			"destinationLat",
			"destinationLon",
			"waypoints",
			sourceLat,
			sourceLon,
			destinationLat,
			destinationLon,
			viapoints
		);

		$.ajax({
			url: appConfigInfo.mmiRoute + "getroute",
			type: 'post',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(reqObj),
			success: function (resp) {
				if (resp.code == "Ok") {
					if (resp.routes[0].geometry) {
						console.log("Route API:", resp);
						var routeLine = decodemapmyindiageometryaswkt(resp.routes[0].geometry);
						console.log("Route routeLine:", routeLine);
						console.log("Route------------------>:", resp);
						var routeDistance = '';
						var routeETA = '';
						try {
							tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
							tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });
							tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
							tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });
						}
						catch (e) {
							console.log("Line Layer Creation Error..!", e);
						}
						tmpl.Overlay.addGeometry({
							map: param.map,
							geometry: routeLine,
							properties: {
								id: 1,
								name: "path",
								type: "visited",
							},
							layer: 'RouteLineLayer'
						});

						var srcIconStyle = new ol.style.Icon(({
							src: sourceIcon,
							anchor: [0.5, 1],
							scale: 1.0
						}));
						var destIconStyle = new ol.style.Icon(({
							src: destinationIcon,
							anchor: [0.5, 1],
							scale: 1.0
						}));

						var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(param.source[0]), parseFloat(param.source[1])], 'EPSG:4326', 'EPSG:3857'));
						var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(param.destination[0]), parseFloat(param.destination[1])], 'EPSG:4326', 'EPSG:3857'));

						var srcfeatureVal = new ol.Feature({
							geometry: srcGeom
						});
						var destfeatureVal = new ol.Feature({
							geometry: destGeom
						});

						srcfeatureVal.setStyle(new ol.style.Style({
							image: srcIconStyle,
						}));
						destfeatureVal.setStyle(new ol.style.Style({
							image: destIconStyle,
						}));

						srcfeatureVal.set('layer_name', 'RoutePoint');
						destfeatureVal.set('layer_name', 'RoutePoint');

						var src = new ol.source.Vector({
							features: [srcfeatureVal]
						});
						var dest = new ol.source.Vector({
							features: [destfeatureVal]
						});

						var srcOverlay = new ol.layer.Vector({
							title: "RoutePoint",
							visible: true,
							source: src
						});
						var destOverlay = new ol.layer.Vector({
							title: "RoutePoint",
							visible: true,
							source: dest
						});

						if (callbackFunc) {
							var resETA = {};
							var dis = resp.routes[0].distance;
							var durati = resp.routes[0].duration;
							resETA.distance = {};
							resETA.distance.value = dis.toFixed(3);
							resETA.distance.units = 'M';
							resETA.duration = {};
							resETA.duration.value = durati.toFixed(3);
							resETA.duration.units = 'S';
							//resETA.distance.value = routeDistance;
							//resETA.duration.value = routeETA;
							callbackFunc(resETA, routeLine);
						}
						mapObj.addLayer(srcOverlay);
						mapObj.addLayer(destOverlay);

					}
				}
			},
			error: function (err) {
				console.error(err);
			},

		});

	}

	function getHereMapsRoute(param) {
		// alert();
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var wayPointFormat = param.wayPointFormat;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		var callbackFunc = param.callbackFunc;
		var getGeomCallback = param.getGeometry;
		var route_width = param.route_width;
		var stops1 = param.waypoints;
		var stopsIcon = param.waypointsIcon;
		var wayptArray = [];
		var routeUrl = null;
		var noLayer_waypoint = false;
		var format = new ol.format.WKT();

		try {
			mapObj.getLayers().forEach(function (layer) {

				if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				} else {
					//mapObj.removeLayer(layer);
					console.log("No Layer Available..!");
				}
			});
		} catch (e) { console.log("Layer Not Available..!"); }


		if (param.waypoints) {
			var fature_waypoint;
			var waypointFeatures = [];
			var temp = stops1;
			var stops = [];
			if (wayPointFormat == undefined) {
				stops = stops1;
			} else if (wayPointFormat == true) {

				for (var x = 0; x < stops1.length; x++) {
					stops[x] = {};
					stops[x].lat = parseFloat(temp[x].lat);
					stops[x].lon = parseFloat(temp[x].lon);
				}
			}
			var stopsIcon = param.waypointsIcon;
			var wayptsExist = stops.length > 0;
			var waypoint_value;
			var tempwaypointStyle, waypointStyle, wkt_fature_waypoint = [];
			var globalwaypointStyle = new ol.style.Style({
				image: new ol.style.Icon({
					src: stopsIcon,
					anchor: [0.5, 1]
				})
			});
			var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
			if ((stops.length) >= waypoint_limit) {
				console.log("CreateLayer : exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
			}
			for (var t = 0; t < waypoint_length; t++) {
				try {
					if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps") {
						waypoint_value = ol.proj.transform([parseFloat(stops[t].lon), parseFloat(stops[t].lat)], 'EPSG:4326', 'EPSG:3857');
					} else {
						waypoint_value = [parseFloat(stops[t].lon), parseFloat(stops[t].lat)];
					}
					if (stops[t].Icon != undefined) {
						tempwaypointStyle = new ol.style.Style({
							image: new ol.style.Icon({
								src: stops[t].Icon,
								anchor: [0.5, 1]
							})
						});
						waypointStyle = tempwaypointStyle;
					} else {
						waypointStyle = globalwaypointStyle;
					}
					fature_waypoint = new ol.Feature({
						geometry: new ol.geom.Point(waypoint_value)
					});
					var wayPointIdTemp = "route_waypoint" + (t + 1);
					fature_waypoint.set('id', wayPointIdTemp);
					fature_waypoint.setStyle(waypointStyle);
					if (param.waypoints && param.getGeometry) {
						wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')));

					}
					waypointFeatures.push(fature_waypoint);
				} catch (er) {
					console.error("please check your waypoint input: " + er);
				}
			}
		}

		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer.get('lname') === 'routeVector_waypoint') {
				noLayer_waypoint = true;
				routeLayer_waypoint = existingLayer;
				//routeLayer_waypoint.getSource().clear();
			}
		}
		if (wayptsExist) {
			if (!noLayer_waypoint) {
				routeLayer_waypoint = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: waypointFeatures
					}),
					title: 'Draw_Route_Layer',
				});
				routeLayer_waypoint.setProperties({
					lname: "routeVector_waypoint"
				});
				mapObj.addLayer(routeLayer_waypoint);
			} else {
				try {
					routeLayer_waypoint.getSource().clear();
					routeLayer_waypoint.getSource().addFeatures(waypointFeatures);
				} catch (er) {
					console.error("Adding Waypoints Marker Isssue: " + er);
				}
			}
		}

		if (wayPointFormat == true) {
			var waypoint_limit = 8;
			var length = stops1.length;
			console.log("Route:stops1::", length, stops1);
			if (length > 8) {
				console.error("WAYPOINTS LIMIT EXCEEDED");
			}
			else {
				switch (length) {
					case 0:

						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 1:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 2:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 3:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 4:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 5:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 6:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;
					case 7:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=passThrough!" + stops1[6].lat + "," + stops1[6].lon + "&waypoint8=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 8:
						routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=passThrough!" + stops1[6].lat + "," + stops1[6].lon + "&waypoint8=passThrough!" + stops1[7].lat + "," + stops1[7].lon + "&waypoint9=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					default:
						console.error("ERROR IN WAYPOINTS ARRAY");
						break;
				}

				var k = 0;
				var arr = [];
				var obj = {};
				while (k < stops1.length) {
					obj = {};
					obj.lon = stops1[k][0];
					obj.lat = stops1[k][1]
					arr.push(obj);
					obj = {};

					var wayPtIconStyle = new ol.style.Icon(({
						src: stopsIcon,
						anchor: [0.5, 1],
						scale: 1.0
					}));
					var wayPtGeom = new ol.geom.Point(ol.proj.transform([parseFloat(arr[0].lon), parseFloat(arr[0].lat)], 'EPSG:4326', 'EPSG:3857'));
					var wayPtfeatureVal = new ol.Feature({
						geometry: wayPtGeom
					});
					wayPtfeatureVal.setStyle(new ol.style.Style({
						image: wayPtIconStyle,
					}));
					var wayPtSrc = new ol.source.Vector({
						features: [wayPtfeatureVal]
					});
					var wayPtOverlay = new ol.layer.Vector({
						title: "RoutePoint",
						visible: true,
						source: wayPtSrc
					});
					mapObj.addLayer(wayPtOverlay);
					arr = [];
					k++;
				}
			}
		}
		else {
			routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
		}

		$.ajax({
			url: routeUrl, success: function (result) {
				console.log("RESULT: ", result);
				var res = result;
				var arr = [];
				var lonlat = {};
				var j = 0;
				while (j < res.response.route[0].leg[0].shape.length) {
					var abc = res.response.route[0].leg[0].shape;
					lonlat = {};
					var temp = [];
					temp = abc[j].split(",");
					lonlat.lon = temp[1];
					lonlat.lat = temp[0];
					arr.push(lonlat);
					lonlat = {};
					j++;
				}
				console.log("-->>", arr);

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

				var srcIconStyle = new ol.style.Icon(({
					src: sourceIcon,
					anchor: [0.5, 1],
					scale: 1.0
				}));
				var destIconStyle = new ol.style.Icon(({
					src: destinationIcon,
					anchor: [0.5, 1],
					scale: 1.0
				}));

				var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857'));
				var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857'));

				var srcfeatureVal = new ol.Feature({
					geometry: srcGeom
				});
				var destfeatureVal = new ol.Feature({
					geometry: destGeom
				});

				srcfeatureVal.setStyle(new ol.style.Style({
					image: srcIconStyle,
				}));
				destfeatureVal.setStyle(new ol.style.Style({
					image: destIconStyle,
				}));

				srcfeatureVal.set('layer_name', 'RouteSPoint');
				destfeatureVal.set('layer_name', 'RouteDPoint');

				try {
					mapObj.getLayers().forEach(function (layer) {

						if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
							mapObj.removeLayer(layer);
						} else {
							//mapObj.removeLayer(layer);
							console.log("No Layer Available..!");
						}
					});
				} catch (e) { console.log("Layer Not Available..!"); }

				var src = new ol.source.Vector({
					features: [srcfeatureVal]
				});
				var dest = new ol.source.Vector({
					features: [destfeatureVal]
				});

				var srcOverlay = new ol.layer.Vector({
					title: "RouteSPoint",
					visible: true,
					source: src
				});
				var destOverlay = new ol.layer.Vector({
					title: "RouteDPoint",
					visible: true,
					source: dest
				});

				mapObj.addLayer(srcOverlay);
				srcOverlay.set('name', 'RouteSPoint');
				mapObj.addLayer(destOverlay);
				destOverlay.set('name', 'RouteDPoint');


				var format = new ol.format.WKT();
				var feature = format.readFeature(wktGeom, {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:3857'
				});
				//var lineR = feature.getGeometry().getCoordinates();
				//var buffer = new ol.Feature({geometry:new ol.geom.Circle(lineR,50)});	
				//buffer.getGeometry().transform('EPSG:3857', 'EPSG:4326');
				var wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
				wktGeom = wktGeom.replace(/,/g, ", ");
				tmpl.Route.buffer({ wktgeom: wktGeom, callBackFunc: bufferRoute });
				//Route Buffer 06-01-2020 ( ratheesh)
				function bufferRoute(roadbuffer) {
					console.log("roadbuffer---->", roadbuffer);
					getGeomCallback(roadbuffer);
				}

				console.log("CreateLayer:", wktGeom, result);
				var resETA = {};
				resETA.distance = {};
				resETA.distance.value = 0;
				resETA.distance.units = 'M';
				resETA.duration = {};
				resETA.duration.value = 0;
				resETA.duration.units = 'S';
				resETA.distance.value = res.response.route[0].summary.distance;
				resETA.duration.value = res.response.route[0].summary.baseTime;
				var startPointAddress = res.response.route[0].leg[0].start.label;
				var endPointAddress = res.response.route[0].leg[0].end.label;
				var ETA_legs = null;
				console.log("callbackFunc::", resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
				setTimeout(function () {
					callbackFunc(resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
					//getGeomCallback(null);
				}, 2000);

				var r_w = null;
				if (route_width != undefined) {
					r_w = route_width;
				}
				else {
					r_w = 5;
				}

				feature.setStyle(new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)'
					}),
					stroke: new ol.style.Stroke({
						// color: '#1b465a',
						color: 'blue',
						width: r_w
					}),
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: '#1b465a'
						})
					}),
					// text: new ol.style.Text({
					// font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
					// textAlign: 'center',
					// text: "some label",
					// fill: new ol.style.Fill({
					// color: "black",
					// width: 20
					// }),
					// stroke: new ol.style.Stroke({
					// color: "white",
					// width: 6
					// })
					// })
				}));



				var source = new ol.source.Vector({
					features: [feature]
				});

				var newLayer = new ol.layer.Vector({
					title: "RouteLayer",
					visible: true,
					source: source
				});

				mapObj.addLayer(newLayer);
				newLayer.set('name', 'RouteLayer');

			}
		});
	}


	function getEsriRoute(param) {
		console.log("ESRI Route:", param);
		var stops = null;
		var tempStops = null;
		var routeResult = [];
		var cordStart, cordEnd, coordinateArray, ETA_legs;
		cordStart = param.source;
		cordEnd = param.destination;
		var accessToken = null;
		var settings = {
			"url": appConfigInfo.esriRoutingToken + "?client_id=" + appConfigInfo.esriClientId + "&client_secret=" + appConfigInfo.esriClientSecret + "&grant_type=client_credentials",
			"method": "POST",
			"timeout": 0,
		};

		$.ajax(settings).done(function (response) {
			var resObj = JSON.parse(response);
			console.log(resObj.access_token);

			if (resObj.access_token) {
				accessToken = resObj.access_token;
				if (param.waypoints && param.waypoints.length > 0) {

					console.log(param.waypoints);
					stops = param.source[0] + ',' + param.source[1];
					tempStops = stops;
					for (var s = 0; s < param.waypoints.length; s++) {
						console.log("s:", s);
						if (tempStops == null) {
							tempStops = param.waypoints[s].lon + ',' + param.waypoints[s].lat;
						} else {
							tempStops = tempStops + ';' + param.waypoints[s].lon + ',' + param.waypoints[s].lat;
						}
						console.log("tempStops:", tempStops);
					}
					tempStops = tempStops + ';' + param.destination[0] + ',' + param.destination[1];

					console.log("stops:", stops, appConfigInfo.esriRouting, accessToken);
					console.log("Final Stops:", tempStops);

					var settings = {
						"url": appConfigInfo.esriRouting + "?f=json&stops=" + tempStops + "&token=" + accessToken,
						"method": "GET",
						"timeout": 0,
						dataType: "json",
					};
					$.ajax(settings).done(function (response) {
						console.log("zzzzzzzzzzzzzzzzz", response);
						for (z = 0; z < response.routes.features[0].geometry.paths.length; z++) {
							for (k = 0; k < response.routes.features[0].geometry.paths[z].length; k++) {
								routeResult.push(response.routes.features[0].geometry.paths[z][k]);
							}
						}

						//var routeResult = response.routes.features[0].geometry.paths[0];
						//JSON.parse(
						coordinateArray = routeResult;
						CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs)
						// console.log(routeResult.routes.features.geometry.paths);
					});

				}
				else {
					console.log("No WayPoints");
					stops = param.source[0] + ',' + param.source[1] + ';' + param.destination[0] + ',' + param.destination[1];
					console.log("stops:", stops, appConfigInfo.esriRouting, accessToken);

					var settings = {
						"url": appConfigInfo.esriRouting + "?f=json&stops=" + stops + "&token=" + accessToken,
						"method": "GET",
						"timeout": 0,
						dataType: "json",
					};
					$.ajax(settings).done(function (response) {
						var routeResult = response.routes.features[0].geometry.paths[0];
						//JSON.parse(
						console.log("zzzzzzzzzzzzzzzzz", response);
						coordinateArray = routeResult;
						CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs)
						//console.log(routeResult.routes.features.geometry.paths);
					});


				}
			}
			else {
				console.log("Get Accesstoken Error!");
			}
		});

	}


	//Added from v2.76
	function CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs) {
		console.log("CreateLayer:", param, cordStart, cordEnd, coordinateArray, ETA_legs);
		var startPointAddress;
		var endPointAddress;
		var datas = [];

		if (appConfigInfo.mapDataService == 'esri') {
			var startPoint = cordStart;
			var endPoint = cordEnd;
		}
		else {
			var startPoint = ol.proj.transform(cordStart, 'EPSG:3857', 'EPSG:4326');
			var endPoint = ol.proj.transform(cordEnd, 'EPSG:3857', 'EPSG:4326');
		}


		//datas = [{"start_address":startPointAddress,"end_address":endPointAddress}];
		var linestyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 6
			})
		});
		var feature = [];
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		if (param.callbackFunc != undefined)
			var callbackFunc = param.callbackFunc;
		var getGeomCallback = param.getGeometry;
		var wayPointFormat = param.wayPointFormat;
		var route_width = param.route_width;
		var routeColor = param.route_color;
		var waypoint_limit = 8;
		var wayptsExist = false;
		var format = new ol.format.WKT();
		if (param.waypoints) {
			var fature_waypoint;
			var waypointFeatures = [];
			var stops1 = param.waypoints;
			var temp = stops1;
			var stops = [];
			if (wayPointFormat == undefined) {
				stops = stops1;
			} else if (wayPointFormat == true) {

				for (var x = 0; x < stops1.length; x++) {
					stops[x] = {};
					stops[x].lat = parseFloat(temp[x].lat);
					stops[x].lon = parseFloat(temp[x].lon);
				}
			}
			var stopsIcon = param.waypointsIcon;
			var wayptsExist = stops.length > 0;
			var waypoint_value;
			var tempwaypointStyle, waypointStyle, wkt_fature_waypoint = [];
			var globalwaypointStyle = new ol.style.Style({
				image: new ol.style.Icon({
					src: stopsIcon,
					anchor: [0.5, 1]
				})
			});
			var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
			if ((stops.length) >= waypoint_limit) {
				console.log("CreateLayer : exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
			}
			for (var t = 0; t < waypoint_length; t++) {
				try {
					if (appConfigInfo.mapData == "google") {
						waypoint_value = ol.proj.transform([parseFloat(stops[t].lon), parseFloat(stops[t].lat)], 'EPSG:4326', 'EPSG:3857');
					} else {
						waypoint_value = [parseFloat(stops[t].lon), parseFloat(stops[t].lat)];
					}
					if (stops[t].Icon != undefined) {
						tempwaypointStyle = new ol.style.Style({
							image: new ol.style.Icon({
								src: stops[t].Icon,
								anchor: [0.5, 1]
							})
						});
						waypointStyle = tempwaypointStyle;
					} else {
						waypointStyle = globalwaypointStyle;
					}
					fature_waypoint = new ol.Feature({
						geometry: new ol.geom.Point(waypoint_value)
					});
					var wayPointIdTemp = "route_waypoint" + (t + 1);
					fature_waypoint.set('id', wayPointIdTemp);
					fature_waypoint.setStyle(waypointStyle);
					if (param.waypoints && param.getGeometry) {
						wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')));

					}
					waypointFeatures.push(fature_waypoint);
				} catch (er) {
					console.error("please check your waypoint input: " + er);
				}
			}
		}

		var noLayer = false;
		var noLayer_line = false;
		var noLayer_waypoint = false;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer.get('lname') === 'routeVector_waypoint') {
				noLayer_waypoint = true;
				routeLayer_waypoint = existingLayer;
				//routeLayer_waypoint.getSource().clear();
			}
			if (existingLayer.get('lname') === 'routeVector') {
				noLayer = true;
				routeLayer = existingLayer;
				//routeLayer.getSource().clear();
			}
			if (existingLayer.get('lname') === 'routeVector_line') {
				noLayer_line = true;
				routeVector_line = existingLayer;
				//routeVector_line.getSource().clear();
			}
		}

		var routeLineColor = null;
		if (routeColor != undefined) {
			routeLineColor = null;
			routeLineColor = routeColor;
			// alert(routeColor);
		}
		else {
			routeLineColor = null;
			routeLineColor = "red";
			// alert(routeColor);
		}
		var r_w;
		if (route_width != undefined)
			r_w = route_width;
		else
			r_w = 5;
		if (!noLayer) {
			routeLayer = new ol.layer.Vector({
				source: new ol.source.Vector(),
				title: 'Draw_Route_Layer',
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: routeLineColor,
						width: r_w
					})
				})
			});
			routeLayer.setProperties({
				lname: "routeVector"
			});
			mapObj.addLayer(routeLayer);
		}

		if (!noLayer_line) {
			routeVector_line = new ol.layer.Vector({
				source: new ol.source.Vector(),
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: routeLineColor,
						width: r_w
					})
				})
			});
			routeVector_line.setProperties({
				lname: "routeVector_line" + routeLineColor
			});
			console.log("CreateLayer:" + routeLineColor);
			mapObj.addLayer(routeVector_line);
		}

		if (wayptsExist) {
			if (!noLayer_waypoint) {
				routeLayer_waypoint = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: waypointFeatures
					}),
					title: 'Draw_Route_Layer',
				});
				routeLayer_waypoint.setProperties({
					lname: "routeVector_waypoint"
				});
				mapObj.addLayer(routeLayer_waypoint);
			} else {
				try {
					routeLayer_waypoint.getSource().clear();
					routeLayer_waypoint.getSource().addFeatures(waypointFeatures);
				} catch (er) {
					console.error("Adding Waypoints Marker Isssue: " + er);
				}
			}
		}

		var sourceMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordStart),
			fname: 'source',
			id: 'route_source'
		});
		if (appConfigInfo.mapDataService == 'esri') {
			sourceMarker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
		}
		var sourceStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: sourceIcon
			})
		});
		sourceMarker.setStyle(sourceStyle);
		var destinationMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordEnd),
			fname: 'destination',
			id: 'route_destination'
		});
		if (appConfigInfo.mapDataService == 'esri') {
			destinationMarker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
		}
		var destinationStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: destinationIcon
			})
		});
		destinationMarker.setStyle(destinationStyle);
		var featuresCollection_t = [];
		if (appConfigInfo.mapData == "google") {
			//alert("linestring");
			var lineString = new ol.geom.LineString(coordinateArray);

			console.log("lineString::", lineString);
			var featuresCollection_g = new ol.Feature({
				geometry: lineString,
				name: 'Line'
			});


			if (appConfigInfo.mapDataService == 'esri') {
				featuresCollection_g.getGeometry().transform('EPSG:4326', 'EPSG:3857');
			}


		}
		else {
			var length_geometryVal = coordinateArray.length;
			console.log("CreateLayer:", length_geometryVal);
			var featureTemp;
			for (var d = 0; d < length_geometryVal - 1; d++) {
				//console.log(coordinateArray[d].geometry,"   of ...",d);
				if (coordinateArray[d].geometry == "GEOMETRYCOLLECTION EMPTY") {
					console.log("GEOMETRYCOLLECTION EMPTY Please check in Postgres");
				}
				else {
					//console.log("coordinateArray::",coordinateArray);
					featureTemp = format.readFeature(coordinateArray[d].geometry, {
						dataProjection: 'EPSG:4326',
						featureProjection: 'EPSG:4326'
					});
				}
				try {
					totalDistance = totalDistance + featureTemp.getGeometry().getLength();
				}
				catch (e) {
					//console.log("test catch catch catch catch",d,featureTemp.getGeometry());
				}
				featuresCollection_t.push(featureTemp);
			}
		}
		//routeLayer.getSource().clear();
		if (appConfigInfo.mapData == "google") {
			//route_distance = feature.getGeometry().getLength();
			routeVector_line.getSource().addFeature(featuresCollection_g);
		} else {
			routeVector_line.getSource().addFeatures(featuresCollection_t);
		}
		routeLayer.getSource().addFeature(sourceMarker);
		routeLayer.getSource().addFeature(destinationMarker);

		/*// for track buffer in ICCC start
	  */
		if (param.zoomToRoute == true) {
			mapObj.getView().fit(routeVector_line.getSource().getExtent(), mapObj.getSize());
			//mapObj.getView().fit(routeLayer.getSource().getExtent(), mapObj.getSize());
		}

		/*// for track buffer in ICCC end
		*/
		if (param.callbackFunc != undefined) {
			console.log("CreateLayer : callbackFunc");
			if (appConfigInfo.mapData == "google" && appConfigInfo.mapDataService == "google") {
				totalDistance = totalDistance + featuresCollection_g.getGeometry().getLength();
				//if (totalDistance < 1000) {
				var resETA = {};
				resETA.distance = {};
				resETA.distance.value = 0;
				resETA.distance.units = 'M';
				resETA.duration = {};
				resETA.duration.value = 0;
				resETA.duration.units = 'S';
				//console.log(ETA_legs);
				for (var x = 0; x < ETA_legs.length; x++) {
					resETA.distance.value = resETA.distance.value + ETA_legs[x].distance.value;
					resETA.duration.value = resETA.duration.value + ETA_legs[x].duration.value;
				}
				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
				wktGeom = wktGeom.replace(/,/g, ", ");
				console.log("CreateLayer:", resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
				setTimeout(function () { callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress); }, 2000);
				// callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
			}
			else {

				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
				wktGeom = wktGeom.replace(/,/g, ", ");
				totalDistance = totalDistance * 100000;
				if (totalDistance < 1000) {
					var resETA = {};
					resETA.distance = {};
					resETA.distance.value = totalDistance;
					resETA.distance.units = 'M';
					resETA.duration = {};
					resETA.duration.value = 'NA';
					resETA.duration.units = 'NA';
					// callbackFunc(resETA);
				} else {
					var temp = totalDistance / 1000;
					var resETA = {};
					resETA.distance = {};
					resETA.distance.value = temp;
					resETA.distance.units = 'KM';
					resETA.duration = {};
					resETA.duration.value = 'NA';
					resETA.duration.units = 'NA';

				}

				//ETA_legs = [{"start_address":startPointAddress,"end_address":endPointAddress}];
				console.log("ETA_legs:------>>>>>>>>>>>>>>>", ETA_legs);
				console.log("CreateLayer : callbackFunc :", resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom);
				setTimeout(function () { callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom); }, 2000);
			}

		}
		var featurebuffer;
		if (param.getGeometry != undefined) {
			if (appConfigInfo.mapData === 'google') {


				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
				wktGeom = wktGeom.replace(/,/g, ", ");
				tmpl.Route.buffer({ wktgeom: wktGeom, callBackFunc: bufferRoute });
				//Route Buffer 06-01-2020 ( ratheesh)
				function bufferRoute(roadbuffer) {
					getGeomCallback(roadbuffer);
				}
			}
			else {
				var wktGeom = format.writeGeometry(featuresCollection_t.getGeometry());
				var wktSource = format.writeGeometry(sourceMarker.getGeometry());
				var wktdestin = format.writeGeometry(destinationMarker.getGeometry());
				if (param.waypoints) {
					getGeomCallback({
						line: wktGeom,
						source: wktSource,
						destination: wktdestin,
						waypoints: wkt_fature_waypoint
					});
				} else {
					getGeomCallback({
						line: wktGeom,
						source: wktSource,
						destination: wktdestin
					});
				}
			}
		}
		else { }
	}
	//till here


	function getGoogleRoute(param) {
		var waypoint_limit = 8;
		var wayptsExist = false;
		var wayPointFormat = param.wayPointFormat;
		if (param.waypoints) {
			var stops1 = param.waypoints;
			var temp = stops1;
			var stops = [];
			if (wayPointFormat == undefined) {
				stops = stops1;
			} else if (wayPointFormat == true) {

				for (var x = 0; x < stops1.length; x++) {
					console.log("WAYPOINTS FROM API+=========================>", temp);
					stops[x] = {};
					// var p1 = temp[x].split('(');
					// var p2 = p1[1].split(')');
					// var p3 = p2[0].split(' ');
					stops[x].lat = parseFloat(temp[x].lat);
					stops[x].lon = parseFloat(temp[0].lon);
				}

			}

			//console.log(stops)
			var wayptsExist = stops.length > 0;
			var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
		}
		var waypts = [];
		var itemsCounter = 0;
		var batches = [];
		var mapObj = param.map;
		var sourcePoint = param.source;
		var destinationPoint = param.destination;
		var wayPointFormat = param.wayPointFormat;
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer({
			preserveViewport: true
		});
		var olGM2 = new olgm.OLGoogleMaps({
			map: mapObj
		});
		// var gmap = olGM2.getGoogleMapsMap();
		// directionsDisplay.setMap(gmap);
		calculateRoute();

		function calculateRoute() {
			var start = new google.maps.LatLng(sourcePoint[1], sourcePoint[0]);
			var end = new google.maps.LatLng(destinationPoint[1], destinationPoint[0]);
			var tempval;
			if (wayptsExist) {
				for (var i = 0; i < waypoint_length; i++) {
					if (stops[i]) {
						tempval = new google.maps.LatLng(stops[i].lat, stops[i].lon);
						waypts.push({
							location: tempval,
							stopover: true
						});
					}
				}
			}
			var bounds = new google.maps.LatLngBounds();
			bounds.extend(start);
			bounds.extend(end);
			var cordStart = ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857');
			var cordEnd = ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857');
			var x1, y1, x2, y2, extent, temp;
			temp = bounds.toString();
			temp = temp.slice(2, -2);
			temp = temp.split("), (");
			x1 = parseFloat((temp[0].split(","))[0]);
			y1 = parseFloat((temp[0].split(","))[1]);
			x2 = parseFloat((temp[1].split(","))[0]);
			y2 = parseFloat((temp[1].split(","))[1]);
			extent = [y1, x1, y2, x2];
			var request = {
				origin: start,
				destination: end,
				waypoints: waypts,
				optimizeWaypoints: false,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function (response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					var polyline = new google.maps.Polyline({
						path: [],
						strokeColor: '#0000FF',
						strokeWeight: 3
					});
					var legs = response.routes[0].legs;
					for (i = 0; i < legs.length; i++) {
						var steps = legs[i].steps;
						for (j = 0; j < steps.length; j++) {
							var nextSegment = steps[j].path;
							for (k = 0; k < nextSegment.length; k++) {
								polyline.getPath().push(nextSegment[k]);
								bounds.extend(nextSegment[k]);
							}
						}
					}
					var ETA_legs = legs;
					var pathObj = polyline.getPath().getArray();
					var coordinateArray = [];
					for (var i = 0, length = pathObj.length; i < length; i++) {
						var po = pathObj[i].toString().slice(1, -1);
						var latVal = po.split(",")[0];
						var lonVal = po.split(",")[1];
						var coordinate = ol.proj.transform([parseFloat(lonVal), parseFloat(latVal)], 'EPSG:4326', 'EPSG:3857');
						coordinateArray.push(coordinate);
					}
					CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
				} else {
					console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
				}
			})
		}
	}

	function getTrinityRouteold(param) {
		// Latest Update Detail
		// route v 2.5.008  dated 01 Dec 2016 Mr J   // wayp tr rou 
		var mapoo = param.map;
		var source = param.source;

		var destination = param.destination;
		var sourceIcon = param.sourceIcon;
		var destinationIcon = param.destinationIcon;
		var onClickCallback = param.onClickCallback;
		var stops;
		var waypoint_limit = 8;
		var wayptsExist = false;
		if (param.waypoints) {
			stops = param.waypoints;
			var wayptsExist = stops.length > 0;
			var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
		}
		var waypts = [];
		var itemsCounter = 0;
		var batches = [];

		function routeresult(data) {
			//console.log("data:  " + data);
			var prop1 = {};
			var layerName = 'Rout_lyr';
			var datalength = data.length;
			var Detail_flag_ip = false;
			if (Detail_flag_ip) { }
			CreateLayer(param, source, destination, data, '');
		}
		if (wayptsExist) {
			shortestroute_ten(mapoo, source, destination, false, sourceIcon, destinationIcon, stops);
		} else {
			shortestroute_nine(mapoo, source, destination, false, sourceIcon, destinationIcon);
		}

		function shortestroute_nine(mapo, a, b, fastvalue, sourceIcon, destinationIcon) {
			var lon1 = a[0];
			var lat1 = a[1];
			var lon2 = b[0];
			var lat2 = b[1];
			var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/xmling/short_route/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + " ";
			//console.log("URL :" + url2);

			function failedfun() {
				console.log("FAIL: FROM SERVER  :" + url2);
			}
			routeresult.mapo = mapo;
			$.ajax({
				type: "GET",
				dataType: "json",
				//headers:{ 'Access-Control-Allow-Origin':'*'},
				//    async: false,
				//   crossDomain: true,
				url: url2,
				success: routeresult,
			});
		}

		function shortestroute_ten(mapo, a, b, fastvalue, sourceIcon, destinationIcon, stops) {
			var lon1 = a[0];
			var lat1 = a[1];
			var lon2 = b[0];
			var lat2 = b[1];
			var stops_toserver = stops;
			//delete stops_toserver.test.key1;
			var temp_stop = []
			for (var k = 0; k < stops_toserver.length; k++) {
				temp_stop[k] = {};
				temp_stop[k].Latitude = stops_toserver[k].lat;
				temp_stop[k].Longitude = stops_toserver[k].lon;
				delete stops_toserver[k].Icon;
			}

			var jsonString = JSON.stringify(temp_stop);
			//console.log("Icon deleted:" + jsonString);
			var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/route/shortest_waypoint_route/true/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + "/" + jsonString + " ";
			//console.log("URL :" + url2);

			function failedfun() {
				console.log("FAIL: FROM SERVER  :" + url2);
			}
			routeresult.mapo = mapo;
			$.ajax({
				type: "GET",
				dataType: "json",
				//headers:{'Access-Control-Allow-Origin':'*' },
				//       async: false,
				//   crossDomain: true,
				url: url2,
				success: routeresult,
			});
		}
	}
	tmpl.Route.RouteResult = function (getdata) {
		// Latest Update Detail
		// route v 2.5.003  dated 23 nov 2016 Mr J
		var lato, lono, plato = 0,
			plono = 0;
		var path = [];
		for (var m = 0; m < getdata.length - 1; m++) {
			lato = getdata[m].lat;
			lono = getdata[m].lon;
			if (lato == plato && lono == plono) { } else {
				path.push([lato, lono]);
				plato = lato;
				plono = lono;
			}
		}
		//console.log("rs added :", path.length);
		return path;
	}
	tmpl.Route.directionsService = function (request, myCallBack) {
		// Latest Update Detail
		// route v 2.5.2  dated 22 nov 2016 Mr J
		// tmpl.Route.ResultSet=null;
		// tmpl.Route.GeometryResultSet=null;
		var a = request.source;
		var b = request.destination;
		var lon1 = a[0];
		var lat1 = a[1];
		var lon2 = b[0];
		var lat2 = b[1];
		var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/route/shortest_polyline_route/false/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + " ";

		function resultingfunction(data) {
			myCallBack(data);
		}

		function erroringfunction() {
			myCallBack('NOTOK');
			console.error("No result :" + url2);
		}
		$.ajax({
			type: "GET",
			url: url2,
			success: resultingfunction,
			error: erroringfunction
		});
	}


	// **** This function takes the longitude,latitude and returns the geocoded object **** //

	tmpl.Geocode.getGeocode = function (params) {

		var resultStatus;
		var point = params.point;
		var callbackFunc = params.callbackFunc;

		if (appConfigInfo.mapDataService === 'esri') {
			console.log("Location::---", point);
			var x = parseFloat(point[0]);
			var y = parseFloat(point[1]);
			console.log("Location::---", x, y);

			var form = new FormData();
			form.append("Location", x + "," + y);
			form.append("f", "Json");

			var settings = {
				"url": appConfigInfo.esrireverseGeocode,
				"method": "POST",
				"timeout": 0,
				"processData": false,
				"mimeType": "multipart/form-data",
				"contentType": false,
				"data": form
			};

			$.ajax(settings).done(function (response) {
				var data = JSON.parse(response);
				console.log("data::---", data);
				var address = data.address.LongLabel;
				result = { address: address };
				resultStatus = true;
				callbackFunc(result, response);
			});
		}
		else if (appConfigInfo.mapDataService == 'sgl') {
			var result;
			var settings = {
				"url": appConfigInfo.sglGeocode + point[1] + "/" + point[0] + "/200/5",
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": appConfigInfo.sglToken
				},
			};

			$.ajax(settings).done(function (response) {
				//console.log(response);
				console.log("nearest_place data-> ", response);
				if (response.length > 0) {
					var data = response;
					for (var i = 0; i < data.length; i++) {
						var record = { name: data[i].name };
						result = { address: data[i].name };
					}

					callbackFunc(result);
				} else {
					result = { address: 'No Data' };
					callbackFunc(result);
				}
			});
		}
		else {

			if (appConfigInfo.mapData == 'google') {
				var x = parseFloat(point[0]);
				var y = parseFloat(point[1]);
				var coordinates = { lat: y, lng: x };
				// console.log("coordinates geocode: ",coordinates);
				var result = {};

				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({
					'latLng': coordinates
				}, function (results, status) {

					if (status == google.maps.GeocoderStatus.OK) {
						//console.log("ccccgeo",results);
						if (results[0]) {
							var address = results[0].formatted_address;
							result = { address: address };
							resultStatus = true;
						}
					}
					callbackFunc(result, results[0]);
				});
			}
			else if (appConfigInfo.mapData === 'hereMaps') {

				var x = parseFloat(point[0]);
				var y = parseFloat(point[1]);
				console.log("Lat Lon : ", x, y);
				var coordinates = { lat: y, lng: x };
				var result = {};
				$.ajax("https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=" + appConfigInfo.hereMapsAppKeyRest + "&mode=retrieveAddresses&prox=" + y + ',' + x,
					{
						success: function (data, status, xhr) {

							if (data) {
								try {
									result = { address: data.Response.View[0].Result[0].Location.Address.Label };
									console.log("DATA FROM API============================>", data.Response.View[0].Result[0].Location.Address.Label);
									console.log("Result:", result);
									if (result) {
										resultStatus = true;
										callbackFunc(result, data);
									} else {
										resultStatus = false;
										result = {};
										callbackFunc(result, data);
									}
								}
								catch (e) {
									console.log("Address Not Available..!");
								}
							}
							else {
								resultStatus = false;
								result = {};
								callbackFunc(result, data);
							}
						}
					});
			}
			else {
				if (appConfigInfo.mapData == 'sgl') {
					var result;
					var settings = {
						"url": appConfigInfo.sglGeocode + point[1] + "/" + point[0] + "/200/5",
						"method": "GET",
						"timeout": 0,
						"headers": {
							"Authorization": appConfigInfo.sglToken
						},
					};

					$.ajax(settings).done(function (response) {
						//console.log(response);
						console.log("nearest_place data-> ", response);
						if (response.length > 0) {
							var data = response;
							for (var i = 0; i < data.length; i++) {
								var record = { name: data[i].name };
								result = { address: data[i].name };
							}

							callbackFunc(result);
						} else {
							result = { address: 'No Data' };
							callbackFunc(result);
						}
					});
				}
				else {
					var result;
					var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/nearest_place/" + point[0] + "/" + point[1] + "/1/3000";
					$.ajax({
						url: urlL,
						success: function (response) {
							console.log("nearest_place data-> ", response);
							if (response.success) {
								var data = response.data;
								for (var i = 0; i < data.length; i++) {
									var record = { name: data[i].place };
									result = { address: data[i].place };
								}
								callbackFunc(result);
							} else {
								result = { address: 'No Data' };
								callbackFunc(result);
							}
						},
						error: function () {
							console.log("there was an error!");
						},
					});
				}
			}
		}
	}


	// **** This function takes the address as input and returns the latitude and longitude of the specified address **** //

	tmpl.Geocode.getReverseGeocode = function (params) {
		var resultStatus;
		var address = params.address;
		var callbackFunc = params.callbackFunc;
		var result;

		if (appConfigInfo.mapDataService === 'esri') {

			var form = new FormData();

			form.append("singleLine", address);
			form.append("f", "Json");

			var settings = {
				"url": appConfigInfo.esriGeocode,
				"method": "POST",
				"timeout": 0,
				"processData": false,
				"mimeType": "multipart/form-data",
				"contentType": false,
				"data": form
			};

			$.ajax(settings).done(function (response) {

				var res = JSON.parse(response);
				console.log(res.candidates[0].location.x, res.candidates[0].location.y);
				var res = [res.candidates[0].location.x, res.candidates[0].location.y];
				console.log(res);
				var cord = res;
				result = { coordinates: res };
				resultStatus = true;
				callbackFunc(result);
			});

		}
		else if (appConfigInfo.mapDataService == 'sgl') {
			var settings = {
				"url": appConfigInfo.sglPlaceSearch + address + "/*",
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": appConfigInfo.sglToken
				},
			};

			$.ajax(settings).done(function (response) {

				var cord = [response[0].latitude + "," + response[0].longitude];
				console.log(cord);
				result = { coordinates: cord };
				callbackFunc(result);
				resultStatus = true;
			});
		}
		else {


			if (appConfigInfo.mapData == 'google') {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 'address': address }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var cord = results[0].geometry.location;
						result = { coordinates: cord };
						resultStatus = true;
					}
					else {
						result = {};
						resultStatus = false;
					}
					callbackFunc(result);
				});
			}
			else if (appConfigInfo.mapData == 'hereMaps') {
				$.ajax("https://reverse.geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + appConfigInfo.hereMapsAppKeyRest + "&searchtext=" + address,   // request url
					{
						success: function (data, status, xhr) {// success callback function

							if (data) {

								//console.log("Result:",data.Response.View[0].Result[0].Location.DisplayPosition);
								var cord = data.Response.View[0].Result[0].Location.DisplayPosition;
								result = { coordinates: cord };
								resultStatus = true;
							}
						}
					});
			}
			else {
				/*if(appConfigInfo.mapData=='sgl'){
					var settings = {
		  "url": appConfigInfo.sglPlaceSearch+address+"/*",
		  "method": "GET",
		  "timeout": 0,
		  "headers": {
			"Authorization": appConfigInfo.sglToken
		  },
		};
		
		$.ajax(settings).done(function (response) {
		
		  var cord = [response[0].latitude +","+response[0].longitude];
		  console.log(cord);
			result={coordinates : cord};
			callbackFunc(result);
			resultStatus = true;
		});
				}	*/
				//else{
				alert("trinity");
				//}
			}

		}
	}

	// **** This function will add the Google Search Box on the map and also shows the searched location with animated marker and map will be zoomed to that location. **** //

	tmpl.Search.addSearchBox = function (param) {
		var zoomButton, placeLocation = [];
		var mapObj = param.map;
		var img_url = param.img_url;
		var callbackFunc = param.callbackFunc;
		var closeCallbackFunc = param.closeCallbackFunc;
		var clearCallbackFunc = param.clearCallbackFunc;
		var height = param.height;
		var width = param.width;
		var restriction = param.restriction;
		var zoom_button = param.zoom_button;
		var withInFlag = true;
		if (appConfigInfo.mapData == 'google') {

			if (appConfigInfo.mapDataService == 'esri') {


				var sdiv = document.createElement('div');
				sdiv.className = 'search-wrapper';
				var input = document.createElement('input');
				input.type = 'text';
				input.id = 'trinitySearch';
				input.placeholder = "Search";
				input.className = 'controls1';
				sdiv.appendChild(input);

				var rst = document.createElement('button');
				rst.className = 'close-icon';

				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					sdiv.appendChild(zoomButton);
				}
				input.onkeyup = function () {
					sdiv.appendChild(rst);
					if (this.value.length == 0) {
						if (clearCallbackFunc != undefined) {
							clearCallbackFunc();
						}
					}
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				}
				try {
					input.onkeypress = function () {
						sdiv.appendChild(rst);
						rst.style.visibility = (this.value.length) ? "visible" : "hidden";
					};
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
				rst.onclick = function () {
					try {
						this.style.visibility = "hidden";
						input.value = "";
						removeAddSearchMarker(mapObj);
						input.focus();
						if (closeCallbackFunc != undefined) {
							closeCallbackFunc();
						}
					}
					catch (errr) {
						console.log("errr: " + errr);
					}
				};
				var srchb = new ol.control.Control({
					element: sdiv
				});
				mapObj.addControl(srchb);



				var options = {
					url: function (phrase) {
						var p = phrase;
						var resObj = null;
						return appConfigInfo.esriPlaceSearch + appConfigInfo.extent1 + "," + appConfigInfo.extent2 + "," + appConfigInfo.extent3 + "," + appConfigInfo.extent4 + "&f=json&text=" + phrase + "&maxSuggestions=5";
						// console.log("resObj.suggestions:",resObj.suggestions); 
					},
					listLocation: "suggestions",
					getValue: "text",
					ajaxSettings: {
						dataType: "json",
						"method": "GET",
						"timeout": 0,
						data: {
							dataType: "json"
						}
					},
					preparePostData: function (data) {
						console.log("data::", data);
						data.phrase = $("#trinitySearch").val();
						return data;
					},
					list: {
						onChooseEvent: function () {


							var place = $("#trinitySearch").getSelectedItemData().text;
							console.log(place);

							function handleReverseGeocode(data) {
								console.log("---------->", data);
								zoomToSearch(mapObj, parseFloat(data.coordinates[0]), parseFloat(data.coordinates[1]), null, place, img_url, height, width);
							}

							tmpl.Geocode.getReverseGeocode({
								address: place,
								callbackFunc: handleReverseGeocode
							});


							//zoomToSearch(mapObj,parseFloat(lon),parseFloat(lat),null,place,img_url,height,width);  
							if (zoom_button == true) {
								zoomButton.onclick = function () {

									function handleReverseGeocode(data) {
										console.log("---------->", data);
										zoomToSearch(mapObj, parseFloat(data.coordinates[0]), parseFloat(data.coordinates[1]), null, place, img_url, height, width);
									}

									tmpl.Geocode.getReverseGeocode({
										address: place,
										callbackFunc: handleReverseGeocode
									});
									//zoomToSearch(mapObj,parseFloat(lon),parseFloat(lat),null,place,img_url,height,width);   
								};
							}
							if (callbackFunc) {
								var rec = { lat: parseFloat(lat), lon: parseFloat(lon) }
								callbackFunc(rec);
							}
						}
					},
					requestDelay: 400
				};
				console.log("options:", options);
				$("#trinitySearch").easyAutocomplete(options);

			}

			else {

				var resultExtent;
				var lon = 0, lat = 0;
				var searchDiv = document.createElement('div');
				searchDiv.className = 'search-wrapper';
				var input = document.createElement('input');
				input.type = 'text';
				input.placeholder = "Search";
				input.className = 'controls1';
				searchDiv.appendChild(input);

				var resetButton = document.createElement('button');
				resetButton.className = 'close-icon';
				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					searchDiv.appendChild(zoomButton);
				}

				input.onkeyup = function () {
					searchDiv.appendChild(resetButton);
					if (this.value.length == 0) {
						if (clearCallbackFunc != undefined) {
							clearCallbackFunc();
						}
					}
					resetButton.style.visibility = (this.value.length) ? "visible" : "hidden";
				};
				resetButton.onclick = function () {
					placeLocation[0], placeLocation[1] = "";
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					input.focus();
					//VR
					tmpl.Zoom.toExtent({
						map: mapObj,
						extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
					});

					if (closeCallbackFunc != undefined) {
						closeCallbackFunc();
					}
				};
				var searchControl = new ol.control.Control({
					element: searchDiv
				});
				mapObj.addControl(searchControl);
				//var searchBox = new google.maps.places.SearchBox(input);		
				//Commented on 21-11-2019									
				var searchBox = new google.maps.places.Autocomplete(input);												//Added on 21-11-2019
				searchBox.setFields(['address_components', 'formatted_address', 'geometry', 'icon', 'name']); 								//Added on 21-11-2019
				var start1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent1));
				var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4), parseFloat(appConfigInfo.extent3));
				var defaultBounds = new google.maps.LatLngBounds();
				defaultBounds.extend(start1);
				defaultBounds.extend(end1);
				searchBox.setBounds(defaultBounds);
				// searchBox.addListener('places_changed', function(){
				searchBox.addListener('place_changed', function () {  //Added on 21-11-2019
					//var places = searchBox.getPlaces();									//Commented on 21-11-2019
					var places = searchBox.getPlace();								//Added on 21-11-2019
					console.log("Place from API ====> ", places);
					if (places.length == 0) {
						return;
					}
					var bounds = new google.maps.LatLngBounds();



					console.log("places::", places);
					try {
						places = [places];
						places.forEach(function (place) {
							var x1, y1, x2, y2;
							var arry = [];
							placeLocation = place.geometry.location;
							placeLocation = placeLocation.toString();
							placeLocation = placeLocation.slice(1, -2);
							placeLocation = placeLocation.split(", ");
							var placeName = place.name;
							if (place.geometry.viewport) {
								bounds.union(place.geometry.viewport);
								bounds = bounds.toString();
								bounds = bounds.slice(2, -2);
								bounds = bounds.split("), (");
								x1 = parseFloat((bounds[0].split(","))[0]);
								y1 = parseFloat((bounds[0].split(","))[1]);
								x2 = parseFloat((bounds[1].split(","))[0]);
								y2 = parseFloat((bounds[1].split(","))[1]);
								var extent = [y1, x1, y2, x2];
								//if(place.types[0] == 'sublocality_level_1' || place.types[0] == 'sublocality_level_2' || place.types[0] == 'sublocality_level_3' ||place.types[0] == 'sublocality_level_4' || //place.types[0] == 'sublocality'  || place.types[0] == 'subpremise' || place.types[0] == 'neighborhood' || place.types[0] == 'administrative_area_level_1' || place.types[0] == //'administrative_area_level_2' || place.types[0] == 'administrative_area_level_3' || place.types[0] == 'administrative_area_level_4' || place.types[0] == //'administrative_area_level_5' || place.types[0] == 'colloquial_area' || place.types[0] == 'locality' || place.types[0] == 'political' || place.types[0] == 'country' ) 
								if (place.address_components[0].types == 'sublocality_level_1' || place.address_components[0].types == 'sublocality_level_2' || place.address_components[0].types == 'sublocality_level_3' || place.address_components[0].types == 'sublocality_level_4' || place.address_components[0].types == 'sublocality' || place.address_components[0].types == 'subpremise' || place.address_components[0].types == 'neighborhood' || place.address_components[0].types == 'administrative_area_level_1' || place.address_components[0].types == 'administrative_area_level_2' || place.address_components[0].types == 'administrative_area_level_3' || place.address_components[0].types == 'administrative_area_level_4' || place.address_components[0].types == 'administrative_area_level_5' || place.address_components[0].types == 'colloquial_area' || place.address_components[0].types == 'locality' || place.address_components[0].types == 'political' || place.address_components[0].types == 'country') {
									resultExtent = extent;
								}
								else {
									resultExtent = null;
								}
								// searchBox.setBounds(defaultBounds);
								var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: resultExtent };
								arry.push(rec);
								console.log("Searched Location:", rec);
								var lat = parseFloat(placeLocation[0]);
								var lon = parseFloat(placeLocation[1]);
								var jsonString = JSON.stringify(arry);
								if (restriction == true) {
									if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
										withInFlag = true;
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
										if (zoom_button == true) {
											zoomButton.onclick = function () {
												if (withInFlag == true) {
													if (placeLocation[1] != "") {
														zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
													}
												}
											};
										}
										if (callbackFunc) {
											var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]) }
											callbackFunc(rec);
										}
									}
									else {
										withInFlag = false;
										//alert("Out of City Boundary");
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);		//Added for Haryana demo only - 26-07-2019
										if (callbackFunc) {
											// var rec = {lat:'' , lon:''};															//Commented for Haryana demo only - 26-07-2019
											var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]) };		//Added for Haryana demo only - 26-07-2019
											callbackFunc(rec);
										}
									}
								} else {
									zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
									if (zoom_button == true) {
										zoomButton.onclick = function () {
											if (withInFlag == true) {
												if (placeLocation[1] != "") {
													zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
												}
											}
										};
									}
									if (callbackFunc) {
										var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]) }
										callbackFunc(rec);
									}
								}

							}
							else {
								bounds.extend(place.geometry.location);
								var ext = null;
								var lat = parseFloat(placeLocation[0]);
								var lon = parseFloat(placeLocation[1]);
								//searchBox.setBounds(bounds);
								var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: ext };
								arry.push(rec);
								var jsonString = JSON.stringify(arry);
								if (restriction == true) {
									if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
										withInFlag = true;
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
										if (zoom_button == true) {
											zoomButton.onclick = function () {
												if (withInFlag == true) {
													zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
												}
											};
										}
										if (callbackFunc) {
											var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]) }
											callbackFunc(rec);
										}
									}
									else {
										withInFlag = false;
										//alert("Out of City Boundary");
										if (callbackFunc) {
											var rec = { lat: '', lon: '' }
											callbackFunc(rec);
										}
									}
								} else {
									zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
									if (zoom_button == true) {
										zoomButton.onclick = function () {
											if (withInFlag == true) {
												zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
											}
										};
									}
									if (callbackFunc) {
										var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]) }
										callbackFunc(rec);
									}
								}
								// if(callbackFunc){
								// var rec = {lat:parseFloat(placeLocation[0]) , lon:parseFloat(placeLocation[1])}
								// callbackFunc(rec);
								// }
							}
						});
					}
					catch (e) {

						console.log("Error:" + e)
					}

				});
				//}
			}
		}

		else if (appConfigInfo.mapData == 'hereMaps') {


			var sdiv = document.createElement('div');
			sdiv.className = 'search-wrapper';
			sdiv.id = 'searchBox';
			var input = document.createElement('input');
			input.type = 'text';
			input.id = 'trinitySearch';
			input.placeholder = "Search";
			input.className = 'controls1';
			sdiv.appendChild(input);

			var rst = document.createElement('button');
			rst.className = 'close-icon';

			if (zoom_button == true) {
				zoomButton = document.createElement('button');
				zoomButton.className = 'zoom_btn';
				sdiv.appendChild(zoomButton);
			}
			input.onkeyup = function () {
				sdiv.appendChild(rst);
				if (this.value.length == 0) {
					if (clearCallbackFunc != undefined) {
						clearCallbackFunc();
					}
				}
				rst.style.visibility = (this.value.length) ? "visible" : "hidden";
			}
			try {
				input.onkeypress = function () {
					sdiv.appendChild(rst);
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				};
			}
			catch (errr) {
				console.log("errr: " + errr);
			}
			rst.onclick = function () {
				try {
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					input.focus();
					//VR
					tmpl.Zoom.toExtent({
						map: mapObj,
						extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
					});
					if (closeCallbackFunc != undefined) {
						closeCallbackFunc();
					}
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
			};
			var srchb = new ol.control.Control({
				element: sdiv
			});
			mapObj.addControl(srchb);
			let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

			$("#trinitySearch").autocomplete({
				source: fullACbox,
				minLength: 2,
				select: function (event, ui) {

					let searchResult = null;
					let place = ui.item.value;
					let placeid = ui.item.id;

					let ur = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=" + appConfigInfo.hereMapsAppKeyRest + "&searchtext=" + place;
					$.ajax({
						url: ur, success: function (result) {
							searchResult = result;

							searchResult.lon = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
							searchResult.lat = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Latitude;

							console.log("data:", mapObj, searchResult.lat, searchResult.lon, null, place, img_url, height, width, searchResult);
							zoomToSearch(mapObj, parseFloat(searchResult.lon), parseFloat(searchResult.lat), null, place, img_url, height, width);

							getLatLonDetails(searchResult.lon, searchResult.lat, null, place);


						}
					});

				}

			});

			function fullACbox(query, callback) {
				console.log("call");
				let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;
				$.getJSON("https://places.ls.hereapi.com/places/v1/autosuggest?at=" + coordinates + "&q=" + query.term + "&bbox=" + appConfigInfo.extent2 + "," + appConfigInfo.extent1 + "," + appConfigInfo.extent4 + "," + appConfigInfo.extent3 + "&apiKey=" + appConfigInfo.hereMapsAppKey, function (data) {
					var places = data.results.filter(function (place) { return place.vicinity });
					places = places.map(function (place) {
						return {
							title: place.title,
							value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
							id: place.id
						};
					});
					console.log(places);
					return callback(places);
				});
			}
		}
		else if (appConfigInfo.mapData == 'sgl') {

			var sdiv = document.createElement('div');
			sdiv.className = 'search-wrapper';
			var input = document.createElement('input');
			input.type = 'text';
			input.id = 'trinitySearch';
			input.placeholder = "Search";
			input.className = 'controls1';
			sdiv.appendChild(input);

			var rst = document.createElement('button');
			rst.className = 'close-icon';

			if (zoom_button == true) {
				zoomButton = document.createElement('button');
				zoomButton.className = 'zoom_btn';
				sdiv.appendChild(zoomButton);
			}
			input.onkeyup = function () {
				sdiv.appendChild(rst);
				if (this.value.length == 0) {
					if (clearCallbackFunc != undefined) {
						clearCallbackFunc();
					}
				}
				rst.style.visibility = (this.value.length) ? "visible" : "hidden";
			}
			try {
				input.onkeypress = function () {
					sdiv.appendChild(rst);
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				};
			}
			catch (errr) {
				console.log("errr: " + errr);
			}
			rst.onclick = function () {
				try {
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					input.focus();
					if (closeCallbackFunc != undefined) {
						closeCallbackFunc();
					}
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
			};
			var srchb = new ol.control.Control({
				element: sdiv
			});
			mapObj.addControl(srchb);

			var options = {
				url: function (phrase) {
					var p = phrase;
					return appConfigInfo.sglPlaceSearch + phrase + "/*"; //http://192.168.1.165:8989/springrestservice/place_search/text/ban/10
				},
				getValue: "name",
				ajaxSettings: {
					dataType: "json",
					method: "GET",
					"headers": {
						"Authorization": appConfigInfo.sglToken
					},
					data: {
						dataType: "json"
					}
				},
				preparePostData: function (data) {
					data.phrase = $("#trinitySearch").val();
					return data;
				},
				list: {
					onChooseEvent: function () {

						var lat = $("#trinitySearch").getSelectedItemData().latitude;
						var lon = $("#trinitySearch").getSelectedItemData().longitude;//longitude
						var place = $("#trinitySearch").getSelectedItemData().name;

						/* var resultArray =[];
						 var rec = {name : place, lat: parseFloat(lat), lon:parseFloat(lon)};
						 resultArray.push(rec); 
						 var jsonString = JSON.stringify(resultArray);*/
						// Zooming to the selected location

						zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
						if (zoom_button == true) {
							zoomButton.onclick = function () {
								zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
							};
						}
						if (callbackFunc) {
							var rec = { lat: parseFloat(lat), lon: parseFloat(lon) }
							//console.log(rec);
							callbackFunc(rec);
						}
					}
				},
				requestDelay: 400
			};
			$("#trinitySearch").easyAutocomplete(options);
		}
		else {


			var sdiv = document.createElement('div');
			sdiv.className = 'search-wrapper';
			var input = document.createElement('input');
			input.type = 'text';
			input.id = 'trinitySearch';
			input.placeholder = "Search";
			input.className = 'controls1';
			sdiv.appendChild(input);

			var rst = document.createElement('button');
			rst.className = 'close-icon';

			if (zoom_button == true) {
				zoomButton = document.createElement('button');
				zoomButton.className = 'zoom_btn';
				sdiv.appendChild(zoomButton);
			}
			input.onkeyup = function () {
				sdiv.appendChild(rst);
				if (this.value.length == 0) {
					if (clearCallbackFunc != undefined) {
						clearCallbackFunc();
					}
				}
				rst.style.visibility = (this.value.length) ? "visible" : "hidden";
			}
			try {
				input.onkeypress = function () {
					sdiv.appendChild(rst);
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				};
			}
			catch (errr) {
				console.log("errr: " + errr);
			}
			rst.onclick = function () {
				try {
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					input.focus();
					if (closeCallbackFunc != undefined) {
						closeCallbackFunc();
					}
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
			};
			var srchb = new ol.control.Control({
				element: sdiv
			});
			mapObj.addControl(srchb);
			var options = {
				url: function (phrase) {
					var p = phrase;
					return "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/place_search/text/" + phrase + "/10"; //http://192.168.1.165:8989/springrestservice/place_search/text/ban/10
				},
				getValue: "place",
				ajaxSettings: {
					dataType: "json",
					method: "GET",
					data: {
						dataType: "json"
					}
				},
				preparePostData: function (data) {
					data.phrase = $("#trinitySearch").val();
					return data;
				},
				list: {
					onChooseEvent: function () {
						var lat = $("#trinitySearch").getSelectedItemData().lat;
						var lon = $("#trinitySearch").getSelectedItemData().lon;
						var place = $("#trinitySearch").getSelectedItemData().place;
						console.log(lat, lon);
						/* var resultArray =[];
						 var rec = {name : place, lat: parseFloat(lat), lon:parseFloat(lon)};
						 resultArray.push(rec); 
						 var jsonString = JSON.stringify(resultArray);*/
						// Zooming to the selected location
						zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
						if (zoom_button == true) {
							zoomButton.onclick = function () {
								zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
							};
						}
						if (callbackFunc) {
							var rec = { lat: parseFloat(lat), lon: parseFloat(lon) }
							//console.log(rec);
							callbackFunc(rec);
						}
					}
				},
				requestDelay: 400
			}
			$("#trinitySearch").easyAutocomplete(options);

		}
	}

	// **** This function will zoom the map to the Search Box resulted location **** //

	function zoomToSearch(mapObj, lon, lat, ext, plName, img_url, height, width) {
		if (appConfigInfo.mapData == 'google') {
			if (ext != null) {
				mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
				mapObj.getView().setCenter(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
				loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
			}
			else {
				mapObj.getView().setZoom(17);
				mapObj.getView().setCenter(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
				loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
			}
		}
		else if (appConfigInfo.mapData == 'hereMaps') {
			console.log("Mapzome:", lon, lat);
			console.log("map view:", mapObj.getView());
			//mapObj.getView().setCenter([lat,lon]);
			//mapObj.getView().setZoom(15);
			tmpl.Zoom.toXYcustomZoom({
				map: mapObj,
				zoom: 17,
				latitude: lat,
				longitude: lon
			});
			loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
		}
		else {
			mapObj.getView().setCenter([lon, lat]);
			mapObj.getView().setZoom(12);
			loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
		}
	}

	// **** This function will add the Search Box result location as animated marker to the map **** //

	function loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width) {
		img_url = appConfigInfo.mapSDKURL + "api_img/Arrow-Down.gif";
		height = 60;
		width = 25;
		if (img_url == undefined) {
			var overlayID = mapObj.getOverlayById('searchOverlayID');

			if (overlayID) {
				mapObj.removeOverlay(overlayID);
			}
			var container = document.createElement('div');
			container.className = 'containerAPI ';
			var labelDiv = document.createElement('div');
			labelDiv.className = 'bottomleft';
			labelDiv.innerHTML = plName;
			container.appendChild(labelDiv);
			var marker_pos = new ol.Overlay({
				id: 'searchOverlayID',
				element: container,
				offset: [-10, -35],
				positioning: 'center'
			});
			mapObj.addOverlay(marker_pos);
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				marker_pos.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
			}
			else {
				marker_pos.setPosition([lon, lat]);
			}
			marker_pos.setProperties({ olname: "searchOverlay" });
			setTimeout(function () {
				tmpl.Overlay.removeMarker({ map: mapObj, id: 'searchOverlayID' })
			}, 5000);
		}
		else {

			var overlayID = mapObj.getOverlayById('searchOverlayID');
			if (overlayID) {
				mapObj.removeOverlay(overlayID);
			}
			var container = document.createElement('div');
			container.className = 'containerAPI ';
			var elem = document.createElement("img");
			elem.setAttribute("src", img_url);
			elem.setAttribute("height", height);
			elem.setAttribute("width", width);
			var labelDiv = document.createElement('div');
			labelDiv.className = 'bottomleft';
			labelDiv.innerHTML = plName;
			container.appendChild(elem);
			container.appendChild(labelDiv);
			var marker_pos = new ol.Overlay({
				id: 'searchOverlayID',
				element: container,
				//offset: [-10, -35],
				positioning: 'center'
			});
			mapObj.addOverlay(marker_pos);
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				marker_pos.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
			}
			else {
				marker_pos.setPosition([lon, lat]);
			}
			marker_pos.setProperties({ olname: "searchOverlay" });
			setTimeout(function () {
				tmpl.Overlay.removeMarker({ map: mapObj, id: 'searchOverlayID' })
			}, 5000);
		}
	}

	// **** This function removes the Search marker **** //

	function removeAddSearchMarker(mapObj) {
		var olyrID = mapObj.getOverlayById('searchOverlayID');
		if (olyrID) {
			mapObj.removeOverlay(olyrID);
		}
	}



	// **** This function will add the Google Search Box to the specified targetDiv and also shows the searched location with animated marker and map will be zoomed to that location. **** //

	tmpl.Search.addSearch = function (param) {

		var mapObj = param.map;
		var targetDiv = param.target;

		if (appConfigInfo.mapData == 'google') {
			var resultExtent;
			var lon = 0, lat = 0;
			// var searchBox = new google.maps.places.SearchBox(document.getElementById(targetDiv));			//Commented on 21-11-2019
			var searchBox = new google.maps.places.Autocomplete(document.getElementById(targetDiv));			//Added on 21-11-2019
			searchBox.setFields(['address_components', 'geometry', 'icon', 'name']);							//Added on 21-11-2019
			var start1 = new google.maps.LatLng(parseFloat(appConfigInfo
				.extent2), parseFloat(appConfigInfo.extent1));
			var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4), parseFloat(appConfigInfo.extent3));
			var defaultBounds = new google.maps.LatLngBounds();
			defaultBounds.extend(start1);
			defaultBounds.extend(end1);
			//searchBox.setBounds(defaultBounds);
			searchBox.addListener('places_changed', function () {
				// var places = searchBox.getPlaces();						//Commented on 21-11-2019
				var places = searchBox.getPlace();							//Added on 21-11-2019		
				if (places.length == 0) {
					return;
				}
				var bounds = new google.maps.LatLngBounds();
				places.forEach(function (place) {
					var x1, y1, x2, y2, placeLocation;
					var arry = [];
					placeLocation = place.geometry.location;
					placeLocation = placeLocation.toString();
					placeLocation = placeLocation.slice(1, -2);
					placeLocation = placeLocation.split(", ");
					var placeName = place.name;
					if (place.geometry.viewport) {
						bounds.union(place.geometry.viewport);
						bounds = bounds.toString();
						bounds = bounds.slice(2, -2);
						bounds = bounds.split("), (");
						x1 = parseFloat(bounds[0].split(",")[0]);
						y1 = parseFloat(bounds[0].split(",")[1]);
						x2 = parseFloat(bounds[1].split(",")[0]);
						y2 = parseFloat(bounds[1].split(",")[1]);
						var extent = [y1, x1, y2, x2];
						if (place.types[0] == 'sublocality_level_1' || place.types[0] == 'sublocality_level_2' || place.types[0] == 'sublocality_level_3' || place.types[0] == 'sublocality_level_4' || place.types[0] == 'sublocality' || place.types[0] == 'subpremise' || place.types[0] == 'neighborhood' || place.types[0] == 'administrative_area_level_1' || place.types[0] == 'administrative_area_level_2' || place.types[0] == 'administrative_area_level_3' || place.types[0] == 'administrative_area_level_4' || place.types[0] == 'administrative_area_level_5' || place.types[0] == 'colloquial_area' || place.types[0] == 'locality' || place.types[0] == 'political' || place.types[0] == 'country') {
							resultExtent = extent;
						}
						else {
							resultExtent = null;
						}
						searchBox.setBounds(defaultBounds);
						var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: resultExtent };
						arry.push(rec);
						//console.log(arry);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
						return getLatLonDetails(placeLocation[1], placeLocation[0], resultExtent, placeName);
						//}
						//else{
						//	return getLatLonDetails('','','','');
						//alert("Searched Place is Out Of Project Area....");
						//}
					}
					else {
						bounds.extend(place.geometry.location);
						var ext = null;
						searchBox.setBounds(bounds);
						var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: ext };
						arry.push(rec);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
						return getLatLonDetails(placeLocation[1], placeLocation[0], ext, placeName);
						//}
						//else{
						//	return getLatLonDetails('','','','');
						//alert("Searched Place is Out Of Project Area....");
						//}
					}
				});
			});
		}
		else if (appConfigInfo.mapData == 'hereMaps') {
			// Combination of both Address and Place autocomplete

			function fullAC(query, callback) {

				let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;
				$.getJSON("https://places.ls.hereapi.com/places/v1/autosuggest?at=" + coordinates + "&q=" + query.term + "&searchtext=" + place + "bbox=" + appConfigInfo.extent2 + "," + appConfigInfo.extent1 + "," + appConfigInfo.extent4 + "," + appConfigInfo.extent3 + "&apiKey=" + appConfigInfo.hereMapsAppKeyRest, function (data) {
					var places = data.results.filter(place => place.vicinity);

					places = places.map(place => {
						return {
							title: place.title,
							value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
							id: place.id
						};
					});
					console.log(places);
					return callback(places);
				});

			}


			//$("#"+targetDiv).easyAutocomplete(options);
			$("#" + targetDiv).easyAutocomplete({
				source: fullAC,
				minLength: 2,
				select: function (event, ui) {

					let searchResult = null;
					let place = ui.item.value;
					let placeid = ui.item.id;

					let ur = "https://geocoder.ls.hereapi.com/6.2/geocode.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&searchtext=" + place;
					$.ajax({
						url: ur, success: function (result) {
							searchResult = result;
							searchResult.lon = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
							searchResult.lat = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
							getLatLonDetails(searchResult.lon, searchResult.lat, null, place);
						}
					});
					//console.log("lat lon:",searchResult.lon,searchResult.lat);
					//console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);

				}

			});


		}
		else {
			var options = {
				url: function (phrase) {
					var p = phrase;
					return "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/place_search/text/" + phrase + "/10";
				},
				getValue: "place",
				ajaxSettings: {
					dataType: "json",
					method: "GET",
					data: {
						dataType: "json"
					}
				},
				preparePostData: function (data) {
					data.phrase = $("#" + targetDiv).val();
					return data;
				},
				list: {
					onChooseEvent: function () {

						var lat = $("#" + targetDiv).getSelectedItemData().lat;
						var lon = $("#" + targetDiv).getSelectedItemData().lon;
						var place = $("#" + targetDiv).getSelectedItemData().place;

						var resultArray = [];
						var rec = { name: place, lat: parseFloat(lat), lon: parseFloat(lon) };
						resultArray.push(rec);
						var jsonString = JSON.stringify(resultArray);
						// Zooming to the selected location
						//zoomToSearch(mapObj,parseFloat(lon),parseFloat(lat),null,place);    
						getLatLonDetails(parseFloat(lon), parseFloat(lat), null, place);
					}
				},
				requestDelay: 400
			};
			$("#" + targetDiv).easyAutocomplete(options);
		}

	}

	// **** This function takes latitude,longitude,radius and type of location. It will return the places of specified type within the radius of given location. **** //

	tmpl.Search.getLandMarks = function (params) {
		var point = params.point;
		var callbackFunc = params.callbackFunc;
		var custom_poi_type = params.POI_type;

		var dataFrom = params.dataFrom;
		var ignoreRadius = params.ignoreRadius;
		var radius = params.radius;
		if (ignoreRadius == undefined) {

		} else {
			if (ignoreRadius == true) {
				radius = 80000;
			}
		}
		var POI_type, keyword;
		if (custom_poi_type == "blood_bank") {
			keyword = 'blood bank';
			POI_type = 'health';
		} else {
			keyword = ''
			POI_type = custom_poi_type;
		}

		if (appConfigInfo.mapData == 'google') {
			if (dataFrom == 'google' || dataFrom == undefined) {
				var searchresult;
				var olGM = new olgm.OLGoogleMaps({ map: params.map });
				var gmap = olGM.getGoogleMapsMap();
				//point=point.slice(1,-1);
				//point=point.split(',');
				var coordinate = { lat: parseFloat(point[1]), lng: parseFloat(point[0]) };
				var service = new google.maps.places.PlacesService(gmap);
				var resultArray22 = [];
				service.nearbySearch({
					location: coordinate,
					radius: radius,
					type: [POI_type],
					keyword: keyword
				}, function googlecallback(results, status) {
					//console.log("qq",POI_type,results);
					var resultArray = [];
					if (results == null) {
						var record = {};
						//resultArray.push(record);
						searchresult = false;
					} else {
						if (results.length == 0) {
							var record = {};
							//resultArray.push(record);
							searchresult = false;
						}
						else {
							if (status === google.maps.places.PlacesServiceStatus.OK) {
								for (var i = 0; i < results.length; i++) {
									if (results[i] != undefined) {
										var lat = results[i].geometry.location.lat();
										var lng = results[i].geometry.location.lng();
										function deg2rad(deg) {
											return deg * (Math.PI / 180)
										}
										var R = 6371; // Radius of the earth in km
										var dLat = deg2rad(lat - point[1]);
										var dLon = deg2rad(lng - point[0]);
										var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
											Math.cos(deg2rad(lat)) * Math.cos(deg2rad(point[1])) *
											Math.sin(dLon / 2) * Math.sin(dLon / 2);
										var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
										var d = R * c; // Distance in km
										var distance = d.toFixed(2);
										distance = parseFloat(distance);
										var record = { name: results[i].name, lat: parseFloat(lat), lon: parseFloat(lng), distance: distance, poi_type: params.POI_type };
										resultArray22.push(record);
									}
								}
								resultArray22.sort(function (a, b) { return a.distance - b.distance });
								//console.log("hhhh",resultArray22);
							}
						}
						var no_of_POIs;
						if (params.Max_num_POIs < results.length) {
							no_of_POIs = params.Max_num_POIs;
						}
						else {
							no_of_POIs = results.length;
						}
						for (var i = 0; i < no_of_POIs; i++) {
							resultArray.push(resultArray22[i]);
							searchresult = true;
						}
					}
					//alert("alert from api");
					callbackFunc(resultArray);
				});
			}
			else if (dataFrom == 'trinity') {
				var lon = parseFloat(point[0]);
				var lat = parseFloat(point[1]);
				var maxPOI = params.Max_num_POIs;
				var type;
				var rsltAry = [];
				var boolianone = false;
				var urlL;
				if (custom_poi_type == "blood_bank") {
					type = 10;
				} else if (custom_poi_type == "hospital") {
					type = 16;
				} else if (custom_poi_type == "fire_station") {
					type = 29;
				} else if (custom_poi_type == "police") {
					type = 58;
				}
				else if (custom_poi_type == "all") {
					type = 99;
				}
				//var radius = params.radius;
				var rdus = radius;
				var dstncKMtr;

				urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/landmark_search/" + lon + "/" + lat + "/" + maxPOI + "/" + type + "/" + rdus;


				$.ajax({
					url: urlL,
					success: function (data) {
						for (var i = 0; i < data.length; i++) {
							dstncKMtr = (data[i].distance) / 1000;
							var record = { name: data[i].place, lat: data[i].lat, lon: data[i].lon, distance: dstncKMtr, type: data[i].type };
							rsltAry.push(record);
						}
						//console.log(rsltAry);
						callbackFunc(rsltAry);

					},
					error: function () {
						console.log("there was an error!");
					},
				});
			}


		}
		else {
			var lon = parseFloat(point[0]);
			var lat = parseFloat(point[1]);
			var maxPOI = params.Max_num_POIs;
			var type;
			var rsltAry = [];
			var boolianone = false;
			var urlL;
			if (custom_poi_type == "blood_bank") {
				type = 10;
			} else if (custom_poi_type == "hospital") {
				type = 16;
			} else if (custom_poi_type == "fire_station") {
				type = 29;
			} else if (custom_poi_type == "police") {
				type = 58;
			}
			else if (custom_poi_type == "all") {
				type = 99;
			}
			//var radius = params.radius;
			var rdus = radius;
			var dstncKMtr;

			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/landmark_search/" + lon + "/" + lat + "/" + maxPOI + "/" + type + "/" + rdus;


			$.ajax({
				url: urlL,
				success: function (data) {
					for (var i = 0; i < data.length; i++) {
						dstncKMtr = (data[i].distance) / 1000;
						var record = { name: data[i].place, lat: data[i].lat, lon: data[i].lon, distance: dstncKMtr, type: data[i].type };
						rsltAry.push(record);
					}
					callbackFunc(rsltAry);

				},
				error: function () {
					console.log("there was an error!");
				},
			});
		}
	}


	// **** This function takes latitude,longitude. It will return the nearest places of given location. **** //
	tmpl.Search.getNearestPlace = function (params) {
		var point = params.point;
		var callbackFunc = params.callbackFunc;
		if (appConfigInfo.mapData == "google") {
			var resultStatus;
			var x = parseFloat(point[0]);
			var y = parseFloat(point[1]);
			var coordinates = { lat: y, lng: x };
			var result = {};

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': coordinates
			}, function (results, status) {
				//console.log("placee",results);
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						//console.log(results);
						var address = results[0].address_components[1].long_name;
						result = { placename: address };
						resultStatus = true;
					}
				}
				callbackFunc(result);
			});
		} else {
			var rsltAry = [];
			var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/nearest_place/" + point[0] + "/" + point[1] + "/1/3000";

			$.ajax({
				url: urlL,
				success: function (data) {
					for (var i = 0; i < data.length; i++) {
						var record = { placename: data[i].place };

						rsltAry.push(record);

					}

					callbackFunc(rsltAry);
				},
				error: function () {
					console.log("there was an error!");
				},
			});
		}
	}
	//------------------------------------ End of Google Map services --------------------------------------//

	//-------------------------- Beginning of Zoom to location, Extent and Layer ---------------------------//

	// **** Zoom to specified Layer **** //

	tmpl.Zoom.getZoom = function (param) {
		var mapObj = param.map;
		var zoomlevel = mapObj.getView().getZoom();
		return zoomlevel;
	}

	tmpl.Zoom.zoom = function (param) {
		var mapObj = param.map;
		var zoomLevel = param.zoomLevel;
		mapObj.getView().setZoom(zoomLevel);
	}


	tmpl.Zoom.toLayer = function (param) {
		var mapObj = param.map;
		var lyrname = param.layer;
		var callbackFunc = param.callbackFunc;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		try {
			for (var i = 0; i < length; i++) {
				var existingLayer = Layers.item(i);
				if (existingLayer.get('title') == lyrname) {
					existing = existingLayer;
					var extent = existingLayer.getSource().getExtent();
					if (extent[0] == extent[2] && extent[1] == extent[3]) {
						var point = [extent[0], extent[1]];
						point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
						tmpl.Zoom.toXYcustomZoom({
							map: mapObj,
							zoom: 14,
							latitude: point[1],
							longitude: point[0]
						});
					} else {
						mapObj.getView().fit(extent, mapObj.getSize());
					}
					if (param.callbackFunc) {
						setTimeout(function () {
							callbackFunc();
						}, 1500);
					}
					break;
				}
			}
			if (existing == undefined) {
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title == lyrname) {
						var extent = tmpl_setMap_layer_global[i].layer.getSource().getExtent();
						//console.log(extent);
						if (extent[0] == extent[2] && extent[1] == extent[3]) {
							var point = [extent[0], extent[1]];
							point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
							tmpl.Zoom.toXYcustomZoom({
								map: mapObj,
								zoom: 14,
								latitude: point[1],
								longitude: point[0]
							});
						} else {
							mapObj.getView().fit(extent, mapObj.getSize());
						}
						if (param.callbackFunc) {
							setTimeout(function () {
								callbackFunc();
							}, 1500);
						}
						break;
					}
				}
			}
		}
		catch (err) {
			console.error("ERROR zoom.toLayer: ", err);
		}
	}


	// **** Zoom to specified Extent **** //

	tmpl.Zoom.toExtent = function (param) {
		var mapObj = param.map;
		var extent = param.extent;
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			var ext = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
			mapObj.getView().fit(ext, mapObj.getSize());
		} else {
			mapObj.getView().fit(extent, mapObj.getSize());
		}
	}

	tmpl.Zoom.toHomeExtent = function (param) {
		var mapObj = param.map;
		var extent = [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4];
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			var ext = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
			mapObj.getView().fit(ext, mapObj.getSize());
		} else {
			mapObj.getView().fit(extent, mapObj.getSize());
		}

	}

	// **** Zoom to specified Location **** //

	tmpl.Zoom.toXY = function (param) {
		var mapObj = param.map;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);
		//if(ext != null){
		//	mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
		//}
		//else{
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
			mapObj.getView().setZoom(18);
		} else {
			mapObj.getView().setCenter([lng, lat]);
			mapObj.getView().setZoom(15);
		}
		//}
	}

	//prasanna
	tmpl.Zoom.toPolygonFeature = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layername = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var zoomLevel = param.zoomLevel;
		var existing;
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
	}
	//prasanna

	tmpl.Zoom.toXYWithoutZoom = function (param) {
		var mapObj = param.map;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);
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
	// **** Zoom to XY with custom zoom level  Ms.PPK 09-11-16 12.44pm**** //

	tmpl.Zoom.toXYcustomZoom = function (param) {
		console.log(param);
		var mapObj = param.map;
		var zoomLevel = param.zoom;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);
		var callbackFunc = param.callbackFunc;
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			mapObj.getView().setZoom(zoomLevel);
			mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
			setTimeout(function () {
				if (param.callbackFunc) {
					callbackFunc();
				}
			}, 1500);
		} else {
			mapObj.getView().setCenter([lng, lat]);
			mapObj.getView().setZoom(zoomLevel);
			setTimeout(function () {
				if (param.callbackFunc) {
					callbackFunc();
				}
			}, 1500);
		}
	}
	//---------------------------- End of Zoom to location, Extent and Layer -------------------------------//

	//----------------------------------- Beginning of Layer Updations -------------------------------------//

	// **** This function will set the specified postition to the all feature labels  **** //

	tmpl.Layer.setLabelPosition = function (param) {
		var mapObj = param.map;
		var lyrName = param.layer;
		var offsetY = param.offsety;
		var offsetX = param.offsetx;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === lyrName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						feature.getStyle().getText().setOffsetY(offsetY);
						feature.getStyle().getText().setOffsetX(offsetX);
					});
					var allFeatures = existingLayer.getSource().getFeatures();
					existingLayer.getSource().clear();
					existingLayer.getSource().addFeatures(allFeatures);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
						feature.getStyle().getText().setOffsetY(offsetY);
						feature.getStyle().getText().setOffsetX(offsetX);
					});
					var allFeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeatures(allFeatures);
				}

			}

		}
	}

	// **** This function will clear the specified Layer data **** //

	tmpl.Layer.clearData = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		//	console.log("mapObj:",mapObj);
		var Layers = mapObj.getLayers();
		// console.log(Layers);
		var length = Layers.getLength();
		// console.log(length);
		var existingLayer;
		var CircleLayerAttachmentBoolian = false;
		var lyrName_circle = layerName + "_API_CircleLayer";
		if (layerName != undefined) {
			for (var i = 0; i < length; i++) {
				var exLayer = Layers.item(i);
				// console.log(exLayer);
				// console.log(exLayer.get('title'));
				if (exLayer != undefined) {
					if (exLayer.get('title') === layerName) {
						existingLayer = exLayer;
						exLayer.getSource().clear();
						exLayer.getSource().clear();
						try {
							mapObj.removeLayer(exLayer);
						} catch (e) {

						}
						if (exLayer.get('CircleLayerAttached') == true) {
							CircleLayerAttachmentBoolian = true;
							//			console.log("CircleLayerAttachmentBoolian true>>",layerName);
						}

					}
				}
			}
		}
		if (CircleLayerAttachmentBoolian == true) {
			for (var j = 0; j < length; j++) {
				var exLayer2 = Layers.item(j);
				if (exLayer2.get('title') === lyrName_circle) {
					mapObj.removeLayer(exLayer2);
					break;
				}

			}

		}


		//console.log("before",globale_layer_names);
		if (existingLayer == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				//console.log(tmpl_setMap_layer_global[i].title,layerName,tmpl_setMap_layer_global[i].title == layerName);
				if (tmpl_setMap_layer_global[i].title == layerName) {

					//xyz = tmpl_setMap_layer_global[i];
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					if (global_fleet_layer_id.length > 0) {

						if (globale_layer_names.indexOf(layerName) != -1) {
							for (var k = 0; k < global_fleet_layer_id.length; k++) {
								var lname = global_fleet_layer_id[k].split('fleet_')[1];
								if (lname != undefined) {
									lname = lname.split('_')[0];
									if (lname == layerName) {
										// console.log("global_fleet_layer_id[k] >>>",global_fleet_layer_id[k]);
										global_fleet_layer_id[k] = '';
										global_fleet_layer_features[k] = '';
										global_fleet_layer_objects[k] = '';
									}
								}
							}
						}
					}
				}
			}
		}
		//console.log("after",globale_layer_names);
	}
	//-------------------------------------- End of Layer Updations ----------------------------------------//

	// **** It calculates the Extent of Base Map**** //

	tmpl.Extent.calculate = function (param) {
		var mapObj = param.map;
		var extent;
		var a = mapObj.getView().calculateExtent(mapObj.getSize());
		extent = [parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3])];
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' || appConfigInfo.mapData == 'trinity') {
			extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
		}
		return extent;
	}

	tmpl.Extent.calculateWKT = function (param) {
		var mapObj = param.map;
		var extent = tmpl.Extent.calculate({ map: mapObj });
		var extentWkt;
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			var polygeom = ol.geom.Polygon.fromExtent(extent);
			var format = new ol.format.WKT();
			extentWkt = format.writeGeometry(polygeom);
		}
		return extentWkt;
	}

	tmpl.Extent.getExtentOnPan = function (param) {
		var mapObj = param.map;
		var flag = param.flag;
		var callbackFunc = param.callbackFunc;
		var extendPanOff = mapObj.get('moveendObjForgetExtendOnPan');
		mapObj.unByKey(extendPanOff);
		if (flag) {
			var moveendVrbl = mapObj.on("moveend", function (e) {
				var view_port = mapObj.getView().calculateExtent(mapObj.getSize());
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
					view_port = ol.proj.transformExtent(view_port, 'EPSG:3857', 'EPSG:4326');
				}
				callbackFunc(view_port);
			});
			mapObj.set('moveendObjForgetExtendOnPan', moveendVrbl);
		}
		else {
			var extendPanOff = mapObj.get('moveendObjForgetExtendOnPan');
			if (extendPanOff) {
				mapObj.unByKey(extendPanOff);
			}
		}
	}

	// end of context menu


	// // Beginning of Multi Vehicle Track 
	// tmpl.Track.vehicle = function (param) {
	// this.map = param.map;
	// this.vehicle_img = param.vehicle_img;
	// this.route_color = param.route_color;
	// this.sourceTrackOriginal = [];
	// this.track_lines_layer_flag =  false;
	// this.track_lines_layer = new ol.layer.Vector({source: new ol.source.Vector()});
	// this.track_points_layer_flag1 =  false;
	// this.track_end_marker_flag =  false;
	// this.track_points_layer1;
	// this.track_points_layer_flag =  false;
	// //this.track_first_call_flag =  false;
	// this.track_first_call_flag =  false;
	// this.track_first_call_zoom_flag = false;
	// this.track_points_layer;
	// this.track_end_Marker =  new ol.layer.Vector({source: new ol.source.Vector()});
	// this.track_ivlDraw,this.destinationTrackOriginal;
	// this.track_uniqueData = [];
	// this.extraAnimationCount = 1;
	// this.animationSpeed =  2000;
	// this.color = ['#FF5733','#10B00B','#0B80B0','#100BB0','#A30BB0','#A60A4A','#CD2733','#D3D012','#FF5733','#10B00B','#0B80B0','#100BB0','#A30BB0'];
	// this.colorIndex = 0;

	// } 


	// tmpl.Track.vehicle.prototype = {

	// startTrack : function (param){
	// var source = param.position;
	// this.sourceTrackOriginal.push(param.position);
	// if(this.track_first_call_zoom_flag == false){
	// var point1;
	// if(appConfigInfo.mapData=="google"){
	// point1 = ol.proj.transform([param.position[1],param.position[0]], 'EPSG:4326', 'EPSG:3857');
	// }else{
	// point1 = [param.position[1],param.position[0]];
	// }
	// this.map.getView().setCenter(point1);
	// this.map.getView().setZoom(17);
	// console.log(this.track_first_call_zoom_flag,this.track_first_call_flag,this.track_end_marker_flag);
	// this.track_first_call_zoom_flag = true;
	// var point;
	// if(appConfigInfo.mapData=="google"){
	// point = ol.proj.transform([this.sourceTrackOriginal[0][1],this.sourceTrackOriginal[0][0]], 'EPSG:4326', 'EPSG:3857');
	// }else{
	// point = [this.sourceTrackOriginal[0][1],this.sourceTrackOriginal[0][0]];
	// }

	// //console.log(point);
	// var pointGeom = new ol.geom.Point(point);
	// var n_feature = new ol.Feature({
	// geometry : pointGeom
	// }); 

	// if(this.track_end_marker_flag ==  false){
	// this.track_end_Marker = new ol.layer.Vector({
	// source: new ol.source.Vector({
	// features : [n_feature]
	// }),
	// style : new ol.style.Style({
	// image : new ol.style.Icon({
	// src : this.vehicle_img
	// })
	// })
	// });
	// this.map.addLayer(this.track_end_Marker);
	// this.track_end_marker_flag = true;
	// }else{
	// if(this.track_end_Marker.getSource().getFeatures().length == 1)
	// this.track_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(point);
	// else
	// this.track_end_Marker.getSource().addFeatures([n_feature]); 
	// }


	// }
	// if(this.track_first_call_flag == false){
	// this.track_first_call_flag = true;
	// if(this.sourceTrackOriginal.length == 1){	

	// }
	// this.SendToTrack();

	// }
	// },
	// routeLayer : function(param){
	// var visibility = param.visibility;
	// this.track_lines_layer.setVisible(visibility);
	// },
	// SendToTrack : function(){

	// //console.log("SendToTrack");
	// if(this.sourceTrackOriginal.length > 1){

	// this.TrackAnimation({
	// source : this.sourceTrackOriginal[0],
	// destination : this.sourceTrackOriginal[1]
	// });
	// }else{

	// this.track_first_call_flag = false;

	// }
	// },


	// TrackAnimation : function(param){

	// var source = param.source;
	// var destination = param.destination;
	// if(appConfigInfo.mapData == 'google'){
	// var source1 = new google.maps.LatLng(source[0],source[1]);
	// var destination1 = new google.maps.LatLng(destination[0],destination[1]);
	// var directionsService = new google.maps.DirectionsService;
	// var parent = this;

	// directionsService.route({
	// origin: source1,
	// destination: destination1,
	// travelMode: 'DRIVING'
	// }, function(response, status) {
	// if (status === 'OK') {
	// this.track_uniqueData = [];
	// for(var i=0;i<response.routes[0].overview_path.length;i++){
	// this.track_uniqueData.push([response.routes[0].overview_path[i].lat(),response.routes[0].overview_path[i].lng()]);

	// }
	// parent.extraAnimationCount = 1;
	// parent.extraAnimation(this.track_uniqueData);
	// } else {
	// window.alert('Directions request failed due to ' + status);
	// }
	// });
	// }else{

	// var parent = this;
	// var request= {
	// source : [ source[1],source[0] ],
	// destination : [ destination[1],destination[0] ]
	// };
	// tmpl.Route.directionsService(request,
	// function(response){
	// try{
	// if(response==='NOTOK'){
	// console.log("APIEC-ROUTE/TEST null  :");
	// }else{
	// this.track_uniqueData = [];
	// for(var i=0;i<response.length;i++){
	// this.track_uniqueData.push([response[i].lat,response[i].lon]);	
	// }
	// //console.log(track_uniqueData);
	// parent.extraAnimationCount = 1;
	// parent.extraAnimation(this.track_uniqueData);
	// }
	// }catch(e){console.error("APIEC ROUT/DIRSERV/track  :"+e);}
	// });
	// }
	// this.colorIndex = this.colorIndex + 1;
	// this.track_points_layer_flag1 = false;	
	// },

	// extraAnimation : function(uniqueData){
	// //console.log(uniqueData);          ////
	// if(this.extraAnimationCount < uniqueData.length){
	// var i = this.extraAnimationCount;
	// var lat = parseFloat(uniqueData[i][0]);
	// var plat = parseFloat(uniqueData[i-1][0]);
	// var lon = parseFloat(uniqueData[i][1]);
	// var plon = parseFloat(uniqueData[i-1][1]);
	// if(appConfigInfo.mapData=="google"){
	// var point = ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857');
	// var p_point = ol.proj.transform([plon,plat], 'EPSG:4326', 'EPSG:3857');
	// }else{
	// point = [lon,lat];
	// p_point =[plon,plat];
	// }
	// console.log(point);
	// var pointGeom = new ol.geom.Point(point);
	// var n_feature = new ol.Feature({
	// geometry : pointGeom
	// }); 
	// var pfeature = new ol.Feature({
	// geometry : new ol.geom.Point(p_point)
	// }); 

	// this.drawAnimatedLine(p_point,point, 50, 10000, uniqueData);
	// }else{
	// if(this.sourceTrackOriginal.length > 1){
	// //console.log("test track unique",this.track_uniqueData[this.track_uniqueData.length-1]);
	// //this.destinationTrackOriginal = this.track_uniqueData[this.track_uniqueData.length-2];
	// this.sourceTrackOriginal.splice(0, 1);
	// //console.log("again calling SendToTrack",this.sourceTrackOriginal.length);
	// this.SendToTrack();
	// }else{
	// //this.destinationTrackOriginal = this.sourceTrackOriginal[0];
	// this.track_first_call_flag = false;
	// }


	// }
	// this.extraAnimationCount = this.extraAnimationCount + 1;

	// },



	// drawAnimatedLine : function (startPt, endPt, steps, time, track_uniqueData){
	// var directionX = (endPt[0] - startPt[0]) / steps;
	// var directionY = (endPt[1] - startPt[1]) / steps;
	// var i = 0;
	// var prevLayer;
	// var newEndPt;
	// var itsparent = this;

	// //console.log("something");
	// itsparent.track_ivlDraw = setInterval(function () {
	// var map = itsparent.map;
	// if (i > steps) {
	// clearInterval(itsparent.track_ivlDraw);
	// itsparent.extraAnimation(track_uniqueData); /////// completed i/j phase
	// // return;
	// }
	// newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
	// itsparent.panMap(newEndPt);
	// var line = new ol.geom.LineString([startPt, newEndPt]);
	// var point = new ol.geom.Point(newEndPt);
	// var fea = new ol.Feature(line);
	// var p_fea = new ol.Feature(point);
	// if(itsparent.track_end_marker_flag ==  false){
	// itsparent.track_end_Marker = new ol.layer.Vector({
	// source: new ol.source.Vector({
	// features : [p_fea]
	// }),
	// style : new ol.style.Style({
	// image : new ol.style.Icon({
	// src : itsparent.vehicle_img
	// })
	// })
	// });
	// map.addLayer(itsparent.track_end_Marker);
	// itsparent.track_end_marker_flag = true;
	// }else{
	// if(itsparent.track_end_Marker.getSource().getFeatures().length == 1)
	// itsparent.track_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);
	// else
	// itsparent.track_end_Marker.getSource().addFeatures([p_fea]); 
	// }


	// if(itsparent.track_lines_layer_flag ==  false){
	// itsparent.track_lines_layer = new ol.layer.Vector({
	// source: new ol.source.Vector({
	// features : [fea]
	// }),
	// style : new ol.style.Style({
	// stroke: new ol.style.Stroke({
	// color: itsparent.route_color,
	// width: 4
	// })
	// })
	// });
	// itsparent.track_lines_layer.set("track","trackAnimationLayer");
	// map.addLayer(itsparent.track_lines_layer);
	// itsparent.track_lines_layer_flag = true;
	// }else{
	// itsparent.track_lines_layer.getSource().addFeature(fea);
	// }
	// i++;
	// }, this.animationSpeed / steps);

	// },

	// panMap : function (point){
	// var map = this.map;
	// var current=point;
	// var currentgps = new ol.geom.Point(current);
	// var cur_veh = new ol.Feature(currentgps);
	// var view_port =  
	// map.getView().calculateExtent(map.getSize());
	// var  vehicle_inside=cur_veh.getGeometry().intersectsExtent(view_port);
	// if(vehicle_inside==false){
	// map.getView().setCenter(current);
	// }
	// },

	// clearTrack : function(){
	// clearInterval(this.track_ivlDraw);
	// this.track_end_Marker.getSource().clear();
	// this.track_lines_layer.getSource().clear();
	// this.track_first_call_zoom_flag = false;
	// this.track_first_call_flag = false;

	// }
	// }

	// End of Multi Vehicle Track 



	var multi_track_zoom_map = [];
	tmpl.Track.vehicle = function (param) {
		// alert('Track.vehicle');
		this.map = param.map;
		this.vehicle_img = param.vehicle_img;
		this.route_color = param.route_color;
		this.getHoverLabel = param.getHoverLabel;
		this.icon_scale = param.icon_scale;
		this.label = param.label;
		this.angle = param.angle;
		this.track_ivlDraw;
		this.markerFlag = false;
		this.layerFlag = false;
		this.track_end_marker = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		this.track_line_layer = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		this.previousP = [];
		this.currentP = [];
		this.previous = [];
		this.current_track_flag = false;
		this.route_width;
		this.first_add_icon = false;
		if (param.route_width == undefined)
			this.route_width = 4;
		else
			this.route_width = param.route_width
		this.multi_track_zoom_map_index = multi_track_zoom_map.length;
		multi_track_zoom_map.push(this);
	}
	tmpl.Track.vehicle.prototype = {
		startTrack: function (param) {
			var point = param.position;
			this.pos = [point[0], point[1]];
			this.previous.push(point);
			if (this.first_add_icon == false) {
				var pt = [];
				pt[0] = point[0];
				pt[1] = point[1];
				if (appConfigInfo.mapData == 'google') {
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
				}
				else {
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:4326');
				}


				var point = new ol.geom.Point(pt);
				var p_fea = new ol.Feature(point);
				var scale = 1;
				if (this.icon_scale != undefined)
					scale = this.icon_scale;
				var angle = 0;
				if (this.angle != undefined)
					angle = this.angle;
				p_fea.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: this.vehicle_img,
						scale: scale,
						rotation: angle
					})
				}));
				p_fea.set('layer_name', 'track_layer');
				p_fea.set('label', this.label);
				this.track_end_marker = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: [p_fea]
					})
				});

				console.log("this.pos >>", this.pos);
				this.multipleTrackMapZoom(this);
				//map.addLayer(parent.track_end_marker);
				this.track_end_marker.setMap(this.map);
				this.markerFlag = true;
				this.first_add_icon = true;

				var parentMap = this.map;
				if (this.getHoverLabel == true) {

					var ta_tooltip = document.createElement('tooltip');
					ta_tooltip.id = 'trip-tooltip';
					ta_tooltip.className = 'ol-trip-tooltip';
					var overlay_mouseOver_label = new ol.Overlay({
						element: ta_tooltip,
						offset: [10, 0],
						positioning: 'bottom-left'
					});

					parentMap.addOverlay(overlay_mouseOver_label);
					parentMap.on('pointermove', function (evt) {

						var feature_mouseOver = parentMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
							if (layer == null) {
								if (feature.get('layer_name') == 'track_layer') {
									return feature;
								}
							}
						});
						ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
						if (feature_mouseOver) {
							overlay_mouseOver_label.setPosition(evt.coordinate);
							ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
						}
					});
				}
			}
			if (this.previous.length > 1) {
				if (this.current_track_flag == false) {
					this.current_track_flag = true;
					this.sendToTrack();
				}
			} else {
				this.current_track_flag = false;
			}
		},
		//hererrrrrr
		sendToTrack: function () {
			var parent = this;
			var directionX = (this.previous[1][0] - this.previous[0][0]) / 50;
			var directionY = (this.previous[1][1] - this.previous[0][1]) / 50;
			var i = 0;
			var prevLayer;
			var newEndPt;
			var angle = rotate({
				x1: this.previous[0][0],
				y1: this.previous[0][1],
				x2: this.previous[1][0],
				y2: this.previous[1][1]
			});

			if (this.previous[0][0] == this.previous[1][0] && this.previous[0][1] == this.previous[1][1]) {
				this.previous.splice(0, 1);
				if (this.previous.length > 1) {
					this.sendToTrack();
				} else {
					this.current_track_flag = false;
				}
			} else {

				parent.track_ivlDraw = setInterval(function () {
					var map = parent.map;
					if (i > 50) {
						clearInterval(parent.track_ivlDraw);
						parent.previous.splice(0, 1);
						if (parent.previous.length > 1) {
							parent.sendToTrack();
						} else {
							parent.current_track_flag = false;
						}
						// return;
					} else {
						newEndPt = [parent.previous[0][0] + i * directionX, parent.previous[0][1] + i * directionY];
						var latlng = new google.maps.LatLng(newEndPt[1], newEndPt[0]);

						if (parent.layerFlag == false) {
							parent.previousP[0] = newEndPt[0];
							parent.previousP[1] = newEndPt[1];
							if (appConfigInfo.mapData == 'google') {
								parent.previousP = ol.proj.transform(parent.previousP, 'EPSG:4326', 'EPSG:3857');
							}

							else {
								parent.previousP = ol.proj.transform(parent.previousP, 'EPSG:4326', 'EPSG:3857');
							}


							parent.track_line_layer = new ol.layer.Vector({
								source: new ol.source.Vector(),
								style: new ol.style.Style({
									stroke: new ol.style.Stroke({
										color: parent.route_color,
										width: parent.route_width
									})
								})
							});
							//parent.track_line_layer.setMap(map);
							map.addLayer(parent.track_line_layer);
							parent.layerFlag = true;
						} else {
							parent.currentP[0] = newEndPt[0];
							parent.currentP[1] = newEndPt[1];
							var current;
							if (appConfigInfo.mapData == 'google') {
								current = ol.proj.transform(parent.currentP, 'EPSG:4326', 'EPSG:3857');
							}
							else {
								current = ol.proj.transform(parent.currentP, 'EPSG:4326', 'EPSG:3857');
							}

							var line = new ol.geom.LineString([parent.previousP, current]);
							var fea = new ol.Feature(line);
							parent.track_line_layer.getSource().addFeature(fea);
							parent.previousP = current;
						}
						if (parent.markerFlag == false) {
							var pt = [];
							pt[0] = newEndPt[0];
							pt[1] = newEndPt[1];
							if (appConfigInfo.mapData == 'google') {
								pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
							}
							else {
								pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
							}


							var point = new ol.geom.Point(pt);
							var p_fea = new ol.Feature(point);
							p_fea.setStyle(new ol.style.Style({
								image: new ol.style.Icon({
									src: parent.vehicle_img
								})
							}));
							parent.track_end_marker = new ol.layer.Vector({
								source: new ol.source.Vector({
									features: [p_fea]
								})
							});
							//map.addLayer(parent.track_end_marker);
							parent.track_end_marker.setMap(map);
							parent.markerFlag = true;
						} else {
							parent.pos = newEndPt;
							//parent.multipleTrackMapZoom(parent);
							if (isNaN(angle) == false)
								parent.track_end_marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
							if (appConfigInfo.mapData == 'google') {
								parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
							}
							else {
								parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
							}
						}
						i = i + 1;
					}

				}, 10000 / 50)
			}
		},
		clearTrack: function () {
			clearInterval(this.track_ivlDraw);
			this.track_end_marker.getSource().clear();
			this.track_line_layer.getSource().clear();
			this.layerFlag = false;
			this.markerFlag = false;
			this.first_add_icon = false;
			this.previousP = [];
			this.currentP = [];
			this.previous = [];
			this.current_track_flag = false;
			try {
				var index = this.multi_track_zoom_map_index;
				multipleTrackMapZoomLayer.getSource().clear();
			} catch (e) { }
		},
		routeVehicle: function (param) {
			var visibility = param.visibility;
			var map = param.map;
			if (visibility)
				this.track_end_marker.setMap(map);
			else
				this.track_end_marker.setMap(null);
		},
		routeLayer: function (param) {
			var visibility = param.visibility;
			var map = param.map;
			this.track_line_layer.setVisible(visibility);
		},
		multipleTrackMapZoom: function (obj) {
			var coordinate = [parseFloat(obj.pos[0]), parseFloat(obj.pos[1])];
			coordinate = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
			var geometry = new ol.geom.Point(coordinate);
			var featureval = new ol.Feature({
				geometry: geometry
			});
			try {
				if (obj.feaPOS == undefined) {
					obj.feaPOS = multipleTrackMapZoomLayer.getSource().getFeatures().length;
					multipleTrackMapZoomLayer.getSource().addFeature(featureval);
				} else {
					if (multipleTrackMapZoomLayer.getSource().getFeatures()[obj.feaPOS] == undefined) {
						obj.feaPOS = multipleTrackMapZoomLayer.getSource().getFeatures().length;
						multipleTrackMapZoomLayer.getSource().addFeature(featureval);
					} else {
						multipleTrackMapZoomLayer.getSource().getFeatures()[obj.feaPOS].getGeometry().setCoordinates(coordinate);
					}
				}
			} catch (e) { }
			//console.log("EEEE >>>",multipleTrackMapZoomLayer.getSource().getFeatures().length);
			if (multipleTrackMapZoomLayer.getSource().getFeatures().length > 1) {
				try {
					var extent = multipleTrackMapZoomLayer.getSource().getExtent();
					var view_port = obj.map.getView().calculateExtent(obj.map.getSize());
					var vehicle_inside = featureval.getGeometry().intersectsExtent(view_port);
					if (vehicle_inside == false) {
						obj.map.getView().fit(extent, obj.map.getSize());
					}
				} catch (e) { }
			}
			else {
				try {
					var view_port = obj.map.getView().calculateExtent(obj.map.getSize());
					var vehicle_inside = featureval.getGeometry().intersectsExtent(view_port);
					if (vehicle_inside == false) {
						//console.log("sss");
						obj.map.getView().setCenter(coordinate);
					}
				} catch (e) { }
				if (multipleTrackMapZoomLayerFlag) {
					tmpl.Zoom.toXYcustomZoom({
						map: obj.map,
						latitude: obj.pos[1],
						longitude: obj.pos[0],
						zoom: 16
					});
					multipleTrackMapZoomLayerFlag = false;
				}
			}
		}
	};

	var multipleTrackMapZoomLayerFlag = true;
	var multipleTrackMapZoomLayer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});




	var trackVehicleObjDyn;
	var track_line_layer_dyn;
	var track_end_marker_dyn;
	var mapObjDyn;
	var trackvehdelaay = 20;
	tmpl.Track.singleVehicle = function (param) {
		// alert('Track.singleVehicle');
		// trackVehicleObjDyn.clearTrack({callbackFunc: function(){console.log("ROUTE CLEARED")}});
		console.log("Track.singleVehicle:", param);
		this.map = param.map;
		console.log(this.map)
		this.vehicle_img = param.vehicle_img;
		this.route_color = param.route_color;
		this.getHoverLabel = param.getHoverLabel;
		this.icon_scale = param.icon_scale;
		this.label = param.label;
		this.angle = param.angle;
		//this.id = param.id;
		//this.rendering_type = param.rendering_type;
		this.zoom = param.zoom;
		if (this.zoom == undefined)
			this.zoom = 15;
		this.features = param.features;

		// this.track_ivlDraw;
		this.markerFlag = false;
		this.layerFlag = false;
		this.track_end_marker = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		this.track_line_layer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: this.route_color,
					width: 2
				})
			})
		});
		// console.log('this.track_line_layer ==> ',this.track_line_layer);
		// console.log('this.track_end_marker ==> ',this.track_end_marker);

		track_line_layer_dyn = this.track_line_layer;
		track_end_marker_dyn = this.track_end_marker;
		mapObjDyn = this.map;
		console.log("param.map,this.map,mapObjDyn::", param.map, this.map, mapObjDyn);
		this.first_time_zoom_flag = false;
		this.first_add_icon = false;

		this.previousP = [];
		this.currentP = [];

		this.previous = [];
		this.current_track_flag = false;
		this.route_width;
		if (param.route_width == undefined)
			this.route_width = 4;
		else
			this.route_width = param.route_width;
		this.previousTime = [];
		this.previousData = [];
		this.TrackSpeed = 5000;
		this.skipedVehicleFlag = param.skipedVehicleFlag;
		// this.skipedVehicleFlag;

		this.map.unByKey(pointerMoveID);

		if (this.skipedVehicleFlag != true) {

			var mapDiv = document.getElementById(globalMapDivID);

			var toggleLayersDiv = document.createElement("div");
			toggleLayersDiv.className = "trackToggleLayers";
			toggleLayersDiv.id = "trackToggleTrackLayers";
			mapDiv.appendChild(toggleLayersDiv);
			toggleLayersDiv.style.position = "absolute";
			toggleLayersDiv.style.display = "flex";
			toggleLayersDiv.style.justifyContent = "center";
			toggleLayersDiv.style.top = "8%";
			toggleLayersDiv.style.right = "10px";
			toggleLayersDiv.style.padding = "5px";
			// toggleLayersDiv.style.width = "25%";
			toggleLayersDiv.style.backgroundColor = "white";
			toggleLayersDiv.style.borderRadius = "5px";
			toggleLayersDiv.style.opacity = "1.0";
			toggleLayersDiv.style.zIndex = "4";

			var routelineCheckbox = document.createElement('input');
			routelineCheckbox.id = "trackcheckrouteline";
			routelineCheckbox.type = "checkbox";
			routelineCheckbox.name = "Route Line";
			routelineCheckbox.value = "Route Line";
			routelineCheckbox.style.margin = "auto";
			routelineCheckbox.style.marginLeft = "10px";
			routelineCheckbox.checked = true;
			toggleLayersDiv.appendChild(routelineCheckbox);
			routelineCheckbox.onclick = routeLinevisibility;
			document.getElementById("trackToggleTrackLayers").append("Route Line");

			var routevehicleCheckbox = document.createElement('input');
			routevehicleCheckbox.id = "trackcheckresource";
			routevehicleCheckbox.type = "checkbox";
			routevehicleCheckbox.name = "Resource";
			routevehicleCheckbox.value = "Resource";
			routevehicleCheckbox.style.margin = "auto";
			routevehicleCheckbox.style.marginLeft = "10px";
			routevehicleCheckbox.checked = true;
			toggleLayersDiv.appendChild(routevehicleCheckbox);
			routevehicleCheckbox.onclick = resourcevisibility;
			document.getElementById("trackToggleTrackLayers").append("Resource");

			var infoCheckbox = document.createElement('input');
			infoCheckbox.id = "trackcheckinfobox";
			infoCheckbox.type = "checkbox";
			infoCheckbox.name = "Infobox";
			infoCheckbox.value = "Infobox";
			infoCheckbox.style.margin = "auto";
			infoCheckbox.style.marginLeft = "10px";
			infoCheckbox.checked = true;
			toggleLayersDiv.appendChild(infoCheckbox);
			infoCheckbox.onclick = infoboxvisibility;
			document.getElementById("trackToggleTrackLayers").append("Info");

			var workforceCheckbox = document.createElement('input');
			workforceCheckbox.id = "workforceTrack";
			workforceCheckbox.type = "checkbox";
			workforceCheckbox.name = "Route Deviation";
			workforceCheckbox.value = "Route Deviation";
			workforceCheckbox.checked = false;
			toggleLayersDiv.appendChild(workforceCheckbox);
			// deviatedpointCheckbox.onclick = routeLinevisibility;
			document.getElementById("trackToggleTrackLayers").append("Workforce Track");

			document.getElementById("workforceTrack").onclick = function () {
				var checkStatus = document.getElementById("workforceTrack").checked;
				if (checkStatus) {
					workforceTrackCallback(checkStatus);
				}
				else {
					workforceTrackCallback(checkStatus);
				}

			}

			// From here for delay
			var delayTextDiv = document.createElement('div');
			delayTextDiv.innerHTML = "<b>Delay</b>";
			delayTextDiv.id = "delayTextDiv";
			delayTextDiv.style.margin = "auto";
			delayTextDiv.style.marginLeft = "10px";
			// toggleLayersDiv.appendChild(delayTextDiv);

			var trackdelayDropdown = document.createElement('select');
			trackdelayDropdown.id = "trackdelayDropdown";
			trackdelayDropdown.onchange = trackDelayOnChange;
			trackdelayDropdown.style.marginLeft = "4px";
			//toggleLayersDiv.appendChild(trackdelayDropdown);
			var trackDelayoption1 = document.createElement('option');
			trackDelayoption1.innerHTML = "none";
			trackDelayoption1.value = "-1";
			//trackdelayDropdown.appendChild(trackDelayoption1);
			var trackDelayoption2 = document.createElement('option');
			trackDelayoption2.innerHTML = "1 min";
			trackDelayoption2.value = "60";
			//trackdelayDropdown.appendChild(trackDelayoption2);
			var trackDelayoption3 = document.createElement('option');
			trackDelayoption3.innerHTML = "2 mins";
			trackDelayoption3.value = "120";
			//trackdelayDropdown.appendChild(trackDelayoption3);
			var trackDelayoption4 = document.createElement('option');
			trackDelayoption4.innerHTML = "3 mins";
			trackDelayoption4.value = "180";
			//trackdelayDropdown.appendChild(trackDelayoption4);


			function trackDelayOnChange() {
				var val = document.getElementById("trackdelayDropdown").value;
				console.log("trackvehdelaay value changed ===> ", val);
				trackvehdelaay = val;
			}


			// var clearTrack = document.createElement('button');
			// clearTrack.className = 'clearTrack';
			// clearTrack.innerHTML = 'Clear Track';
			// clearTrack.style.marginLeft = "10px";
			// clearTrack.style.backgroundColor = "#4CAF50";
			// clearTrack.style.border = "none";
			// clearTrack.style.color = "white";
			// clearTrack.style.padding = "5px 10px";
			// clearTrack.style.textAlign = "center";
			// clearTrack.style.cursor = "pointer";
			// clearTrack.onclick = clearTrackRoute;
			// clearTrack.onmouseenter = function(){clearTrack.style.backgroundColor = "red";}
			// clearTrack.onmouseleave = function(){clearTrack.style.backgroundColor = "#4CAF50";}
			// toggleLayersDiv.appendChild(clearTrack);

			var clearTrack = document.createElement('BUTTON');
			clearTrack.className = 'clearTrack';
			clearTrack.innerHTML = '<i class="fa fa-times fa-lg"></i>';
			clearTrack.title = "Clear Track";
			clearTrack.style.marginLeft = "10px";
			clearTrack.style.backgroundColor = "gray";
			clearTrack.style.border = "none";
			clearTrack.style.color = "black";
			// clearTrack.style.padding = "5px 10px";
			clearTrack.style.cursor = "pointer";
			clearTrack.onclick = clearTrackRoute;
			// clearTrack.onmouseenter = function(){clearTrack.style.backgroundColor = "red";}
			// clearTrack.onmouseleave = function(){clearTrack.style.backgroundColor = "#4CAF50";}
			toggleLayersDiv.appendChild(clearTrack);


			// TABLES
			var infoTableDiv = document.createElement("div");
			infoTableDiv.className = "trackdataTable";
			infoTableDiv.id = "trackinfoTable";
			mapDiv.appendChild(infoTableDiv);
			var infoTableRowsDiv = document.createElement("div");
			infoTableRowsDiv.className = "rows";
			infoTableDiv.appendChild(infoTableRowsDiv);
			infoTableRowsDiv.innerHTML = '<table style="font-size: 14px"><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Vehicle No</td><td id= "trackresourceDiv"></td><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Vehicle Type</td><td id= "trackcallSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Position</td><td id= "trackpositionDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Speed</td><td id= "trackspeedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Location</td><td id= "tracklocationDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Time</td><td id="trackdateTimeDiv"></td></tr></table>';

			infoTableDiv.style.position = "absolute";
			infoTableDiv.style.top = "20%";
			infoTableDiv.style.right = "10px";
			infoTableDiv.style.width = "20%";
			infoTableDiv.style.zIndex = "4";

			infoTableRowsDiv.style.position = "relative";
			// infoTableRowsDiv.style.top = "2px";
			// infoTableRowsDiv.style.left = "2px";
			infoTableRowsDiv.style.backgroundColor = "white";
			infoTableRowsDiv.style.opacity = "1.0";
			infoTableRowsDiv.style.borderRadius = "5px";
			infoTableRowsDiv.style.padding = "5px";


		}
	}


	function routeLinevisibility() {
		try {
			var checkStatus = document.getElementById("trackcheckrouteline").checked;
			if (checkStatus == false) {
				console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "false");
				trackVehicleObjDyn.routeLayer({
					map: mapObjDyn,
					visibility: false
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
			else {
				console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "false");
				trackVehicleObjDyn.routeLayer({
					map: mapObjDyn,
					visibility: false
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
		}
		catch (err) {
			// console.log(trackVehicleObjDyn);
			console.error(err)
		}

	}

	function resourcevisibility() {
		try {
			var checkStatus = document.getElementById("trackcheckresource").checked;
			console.log("checkStatus:", checkStatus);
			if (checkStatus == false) {
				console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "false");
				trackVehicleObjDyn.routeVehicle({
					map: mapObjDyn,
					visibility: false
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
			else {
				console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "true");
				trackVehicleObjDyn.routeVehicle({
					map: mapObjDyn,
					visibility: true
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
		}
		catch (err) {
			// console.log(trackVehicleObjDyn);
			console.error(err);
		}

	}

	function infoboxvisibility() {
		try {
			var checkStatus = document.getElementById("trackcheckinfobox").checked;
			if (checkStatus == false) {
				document.getElementById("trackinfoTable").style.visibility = "hidden";
			}
			else {
				document.getElementById("trackinfoTable").style.visibility = "visible";
			}
		}
		catch (err) {
			// console.log(trackVehicleObjDyn);
			console.error(err);
		}

	}

	function clearTrackRoute() {
		try {
			//alert();
			console.log("clearTrackRoute:", mapObjDyn);
			trackVehicleObjDyn.clearTrack({ map: mapObjDyn, callbackFunc: function () { console.log("ROUTE CLEARED") } });
			// clearSWMTrackRoute();
			clearTrackCallback();
		}
		catch (err) {
			// console.log(trackVehicleObjDyn);
			console.error(err);
		}
	}

	trackVehicleObjDyn = tmpl.Track.singleVehicle.prototype = {

		startTrack: function (param) {
			console.log("tmpl.Track.singleVehicle:startTrack", param);
			var point = param.position;
			this.previous.push(point);
			this.previousTime.push(param.time);
			this.previousData.push(param.data);
			this.vehicle_img = param.icon;
			if (this.first_add_icon == false) {
				var pt = [];
				pt[0] = point[0];
				pt[1] = point[1];
				if (appConfigInfo.mapData == "google") {
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
				}
				else {
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:4326');
				}
				var point1 = new ol.geom.Point(pt);
				var p_fea = new ol.Feature(point1);
				var scale = 1;
				if (this.icon_scale != undefined)
					scale = this.icon_scale;
				var angle1 = 0;
				if (this.angle != undefined) {
					angle1 = this.angle;
				} else {
					angle1 = param.angle;
					this.angle = param.angle;
				}

				console.log(this.vehicle_img);
				console.log("this.previousData == > ", this.previousData);
				// trackDetailsUpdate(
				// this.previousData[0][0],this.previousData[0][1],
				// (this.previousData[0][2] + "").substring(0, 9)
				// + "," + (this.previousData[0][3]+ "").substring(0, 9),
				// this.previousData[0][7],
				// this.previousData[0][4],
				// this.previousData[0][8]+' '+this.previousData[0][9]+' '+this.previousData[0][12]);

				p_fea.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: this.vehicle_img,
						scale: scale,
						rotation: angle1
					})
				}));
				p_fea.set('layer_name', 'track_layer');
				p_fea.set('label', param.name);
				console.log(this.features);

				if (this.features) {
					var getdata = this.features;
					for (var i = 0, length = getdata.length; i < length; i++) {
						console.log(getdata[i]);
						p_fea.setProperties(getdata[i]);
					}
				}

				this.track_end_marker = new ol.layer.Vector({
					source: new ol.source.Vector({
						features: [p_fea]
					})
				});
				this.track_end_marker.setMap(this.map);
				track_end_marker_dyn = this.track_end_marker;
				// tmpl.Layer.changeVisibility({map: this.map, layer: 'track_layer', visible: false});

				// tmpl.Layer.changeVisibility({map: this.map, layer: 'track_layer', visible: true});
				this.markerFlag = true;
				this.first_add_icon = true;
				console.log("this.map; ===> ", this.map);
				var parentMap = this.map;
				if (this.getHoverLabel == true) {

					var ta_tooltip = document.createElement('tooltip');
					ta_tooltip.id = 'trip-tooltip';
					ta_tooltip.className = 'ol-trip-tooltip';
					var overlay_mouseOver_label = new ol.Overlay({
						element: ta_tooltip,
						offset: [10, 0],
						positioning: 'bottom-left'
					});
					parentMap.addOverlay(overlay_mouseOver_label);
					var ta_tooltip1 = document.createElement('tooltip');
					ta_tooltip1.id = 'trip-tooltip';
					ta_tooltip1.className = 'ol-trip-tooltip';
					var overlay_mouseOver_label1 = new ol.Overlay({
						element: ta_tooltip1,
						offset: [10, 0],
						positioning: 'bottom-left'
					});
					parentMap.addOverlay(overlay_mouseOver_label1);
					parentMap.on('pointermove', function (evt) {
						var lineMousehover = false;

						var feature_mouseOver = parentMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
							//console.log(layer,layer.get('layer_name'), feature.get('layer_name'))
							if (layer == null) {
								console.log(feature.get('layer_name'));
								if (feature.get('layer_name') == 'track_layer') {
									lineMousehover = false
									return feature;
								} else if (feature.get('layer_name') == 'track_line') {
									lineMousehover = true
									return feature;
								}
							} else {
								console.log(feature.get('layer_name'))
								if (feature.get('layer_name') == 'track_layer') {
									lineMousehover = false
									return feature;
								} else if (feature.get('layer_name') == 'track_line') {
									lineMousehover = true
									return feature;
								}
							}
						});

						ta_tooltip1.style.display = 'none';
						ta_tooltip.style.display = 'none';
						if (feature_mouseOver) {

							overlay_mouseOver_label.setPosition(evt.coordinate);
							if (lineMousehover == true) {
								//	console.log("line");
								ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
								ta_tooltip.innerHTML = feature_mouseOver.get('speed') + 'kph ' + feature_mouseOver.get('date_time');
							} else {
								//	console.log("vehicle");
								ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
								ta_tooltip1.style.display = 'none';
								//ta_tooltip.style.display = 'none';
								ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
							}
						}
					});
				}

			}
			if (this.first_time_zoom_flag === false) {
				if (this.skipedVehicleFlag != true) {
					var pt1 = point;
					//console.log("this.previousData[0][0]:::",this.previousData[0][0]);
					trackDetailsUpdate(
						this.previousData[0][0].simNo, this.previousData[0][0].workforceUserId,
						(this.previousData[0][0].lon + "," + this.previousData[0][0].lat),
						this.previousData[0][0].place,
						this.previousData[0][0].speed,
						this.previousData[0][0].time);

					tmpl.Zoom.toXYcustomZoom({
						map: this.map,
						latitude: pt1[1],
						longitude: pt1[0],
						zoom: 15
					});
					this.first_time_zoom_flag = true;
				}
			}

			if (this.previous.length > 1) {
				if (this.current_track_flag == false) {
					this.sendToTrack();
					globalTrackSameLatLngFlag = false;
					this.current_track_flag = true;
				}
			}
		},
		sendToTrack: function () {
			var parent = this;
			// parent.track_line_layer.setMap(this.map);
			track_line_layer_dyn.setMap(this.map);
			// var trackvehdelaay=-1;
			var tempTime1 = this.previousTime[1].slice(0, 8);
			var tempTime2 = this.previousTime[0].slice(0, 8);
			console.log(tempTime1, tempTime2);
			var s = time_diff(tempTime1, tempTime2);
			console.log("TIME DELAY ===>", s);
			s = parseInt((s.split(':')[0]) * 60 * 60) + parseInt(s.split(':')[1] * 60) + parseInt(s.split(':')[2]);
			s = parseInt(s);
			console.log(trackvehdelaay);
			var trackvehdelay = false;
			if (trackvehdelaay == -1) {
				trackvehdelay = false;
			} else {
				trackvehdelay = (s > trackvehdelaay);
			}
			if (trackvehdelay) {
				console.log("s true " + s)
				console.log("trackvehdelaay     " + trackvehdelaay)
				console.log(s > trackvehdelaay);
				console.log("this.previousData ==========> ", this.previousData[1][0].time);
				// trackDetailsUpdate(
				// this.previousData[1][0],this.previousData[1][1],
				// (this.previousData[1][2] + "").substring(0, 9)
				// + "," + (this.previousData[1][3]+ "").substring(0, 9),
				// this.previousData[1][7],
				// this.previousData[1][4],
				// this.previousData[1][8]+' '+this.previousData[1][9]+' '+this.previousData[1][12]);
				trackDetailsUpdate(
					this.previousData[1][0].simNo, this.previousData[1][0].workforceUserId,
					(this.previousData[1][0].lon + "," + this.previousData[1][0].lat),
					this.previousData[1][0].place,
					this.previousData[1][0].speed,
					this.previousData[1][0].time);

				globalTrackSameLatLngFlag = true;
				this.skipTrack(this.previous[1], this.previous[0], this.previousTime[1], this.previousData[0][1], this.previousData[0], this.vehicle_img, this.angle);
			} else {
				// console.log("s  false "+s)
				// console.log("trackvehdelaay     "+trackvehdelaay)
				// console.log(s > trackvehdelaay);
				// console.log("PREVIOUS DATA TO UPDATE TRACK STATUS ====>", this.previousData);
				// trackDetailsUpdate(
				// this.previousData[1][0],this.previousData[1][1],
				// (this.previousData[1][2] + "").substring(0, 9)
				// + "," + (this.previousData[1][3]+ "").substring(0, 9),
				// this.previousData[1][7],
				// this.previousData[1][4],
				// this.previousData[1][8]+' '+this.previousData[1][9]+' '+this.previousData[1][12]);				
				trackDetailsUpdate(
					this.previousData[1][0].simNo, this.previousData[1][0].workforceUserId,
					(this.previousData[1][0].lon + "," + this.previousData[1][0].lat),
					this.previousData[1][0].place,
					this.previousData[1][0].speed,
					this.previousData[1][0].time);
				// var parent = this;
				var directionX = (this.previous[1][0] - this.previous[0][0]) / 50;
				var directionY = (this.previous[1][1] - this.previous[0][1]) / 50;
				var i = 0;
				var prevLayer;
				var newEndPt;
				var angle = rotate({
					x1: this.previous[0][0],
					y1: this.previous[0][1],
					x2: this.previous[1][0],
					y2: this.previous[1][1]
				});
				if (isNaN(angle) == false) {
					this.angle = angle;
				}
				this.trackSpeed = s * 1000 - 1000;
				if (this.previous.length >= 4) {
					// this.trackSpeed = 2000;
					this.trackSpeed = this.trackSpeed - 2000;
				} else {
					// this.trackSpeed = 5000;
					this.trackSpeed = this.trackSpeed;
				}
				console.log("trackSpeed", this.trackSpeed);
				// parent.track_ivlDraw = setInterval(function () {
				track_ivlDraw = setInterval(function () {
					var map = parent.map;
					if (i > 50) {
						// clearInterval(parent.track_ivlDraw);
						clearInterval(track_ivlDraw);
						parent.previous.splice(0, 1);
						parent.previousTime.splice(0, 1);
						parent.previousData.splice(0, 1);

						if (parent.previous.length > 1) {
							parent.sendToTrack();
						} else {
							parent.current_track_flag = false;
							// arrat\y contains single packet
							globalTrackSameLatLngFlag = true;
						}
						// return;
					} else {
						newEndPt = [parent.previous[0][0] + i * directionX, parent.previous[0][1] + i * directionY];
						//var latlng = new google.maps.LatLng(newEndPt[1], newEndPt[0]);

						if (parent.layerFlag == false) {
							var temp = newEndPt;
							if (appConfigInfo.mapData == "google") {
								temp = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
							}
							else {
								temp = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');
							}

							// parent.previousP[0] = newEndPt[0];									
							// parent.previousP[1] = newEndPt[1];														
							parent.previousP[0] = temp[0];
							parent.previousP[1] = temp[1];

							parent.layerFlag = true;

						} else {
							//console.log("a");
							//console.log("previous11 >>>",parent.previousP);
							parent.currentP[0] = newEndPt[0];
							parent.currentP[1] = newEndPt[1];
							//console.log("previous22 >>>",parent.previousP);
							var current = parent.currentP;
							if (appConfigInfo.mapData == "google") {
								current = ol.proj.transform(current, 'EPSG:4326', 'EPSG:3857');
							}
							else {
								current = ol.proj.transform(current, 'EPSG:4326', 'EPSG:3857');
							}
							// console.log("previous, current >>>",parent.previousP, current);

							var line = new ol.geom.LineString([parent.previousP, current]);

							var fea = new ol.Feature(line);
							var data = {
								//rendering_type : 2,
								layer_name: 'track_line',
								speed: parent.previousData[1][4],
								date_time: moment(
									parent.previousData[1][8] + ' ' + parent.previousData[1][9])
									.format("DD-MM-YYYY hh:mm:ss A")
							};
							fea.setProperties(data);
							// parent.track_line_layer.getSource().addFeature(fea);
							track_line_layer_dyn.getSource().addFeature(fea);
							parent.previousP = current;
							//console.log("previousP >>>",parent.previousP);
						}
						if (parent.markerFlag == false) {
							var pt = [];
							pt[0] = newEndPt[0];
							pt[1] = newEndPt[1];
							// if(appConfigInfo.mapData == "google"){
							// pt = ol.proj.transform([pt[0],pt[1]], 'EPSG:4326', 'EPSG:3857');
							// }
							var point = new ol.geom.Point(pt);
							var p_fea = new ol.Feature(point);
							p_fea.setStyle(new ol.style.Style({
								image: new ol.style.Icon({
									src: parent.vehicle_img
								})
							}));
							parent.track_end_marker = new ol.layer.Vector({
								source: new ol.source.Vector({
									features: [p_fea]
								})
							});
							//map.addLayer(parent.track_end_marker);
							map.addLayer(parent.track_end_marker);
							track_end_marker_dyn = parent.track_end_marker;
							parent.markerFlag = true;
						} else {
							parent.panMap(newEndPt);
							if (isNaN(angle) == false) {
								// console.log('parent.track_end_marker ==> ',parent.track_end_marker);
								if (parent.track_end_marker.getSource().getFeatures().length > 0) {
									parent.track_end_marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
								}
								else { }
								// parent.track_end_marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
							}
							else { }
							if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps") {
								if (parent.track_end_marker.getSource().getFeatures().length > 0) {
									parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
								}
								else {
									parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
								}
								// parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
							} else {
								parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);
							}
						}
						i = i + 1;
					}

				}, this.trackSpeed / 50)
			}
			//}
		},
		panMap: function (point) {
			var map = this.map;
			var current = point;
			if (appConfigInfo.mapData == "google") {
				current = ol.proj.transform(current, 'EPSG:4326', 'EPSG:3857');
			} else {
				current = ol.proj.transform(current, 'EPSG:4326', 'EPSG:3857');
			}
			var currentgps = new ol.geom.Point(current);
			var cur_veh = new ol.Feature(currentgps);
			try {
				var view_port = map.getView().calculateExtent(map.getSize());
				var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
				if (vehicle_inside == false) {
					map.getView().setCenter(current);
				}
			} catch (e) {
				console.log("from api track error handled");
			}
		},
		clearTrack: function (param) {
			var map = this.map;
			console.log("clear track map object ===> ", map, this.map);
			var callback = param.callbackFunc;
			console.log("THIS =====> ", this);
			if (param) {
				// clearInterval(this.track_ivlDraw);
				clearInterval(track_ivlDraw);
				// for(i=0; i<100; i++){
				// window.clearInterval(i);
				// }
				// this.track_end_marker.getSource().clear();
				// this.track_line_layer.getSource().clear();			 
				track_end_marker_dyn.getSource().clear();
				track_line_layer_dyn.getSource().clear();
				this.layerFlag = false;
				this.markerFlag = false;
				this.first_add_icon = false;
				this.first_time_zoom_flag = false;
				this.previousP = [];
				this.currentP = [];
				this.previous = [];
				this.previousTime = [];
				this.previousData = [];

				this.current_track_flag = false;

				// tmpl.Layer.clearData({map: map, layer: 'SkipTrackMarker'});

				Element.prototype.remove = function () {
					this.parentElement.removeChild(this);
				}
				NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
					for (var i = this.length - 1; i >= 0; i--) {
						if (this[i] && this[i].parentElement) {
							this[i].parentElement.removeChild(this[i]);
						}
					}
				}
				var infoTable = document.getElementById("trackinfoTable");
				if (infoTable) {
					infoTable.remove();
				}
				var toggleContainer = document.getElementById("trackToggleTrackLayers");
				if (toggleContainer) {
					toggleContainer.remove();
				}
				if (callback) {
					callback();
				}
				else { }
			}
			else {
				clearInterval(this.track_ivlDraw);
				// this.track_end_marker.getSource().clear();
				// this.track_line_layer.getSource().clear();			 
				track_end_marker_dyn.getSource().clear();
				track_line_layer_dyn.getSource().clear();
				this.layerFlag = false;
				this.markerFlag = false;
				this.first_add_icon = false;
				this.first_time_zoom_flag = false;
				this.previousP = [];
				this.currentP = [];
				this.previous = [];
				this.previousTime = [];
				this.previousData = [];

				this.current_track_flag = false;

				tmpl.Layer.clearData({ map: map, layer: 'SkipTrackMarker' });

				Element.prototype.remove = function () {
					this.parentElement.removeChild(this);
				}
				NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
					for (var i = this.length - 1; i >= 0; i--) {
						if (this[i] && this[i].parentElement) {
							this[i].parentElement.removeChild(this[i]);
						}
					}
				}
				var infoTable = document.getElementById("trackinfoTable");
				if (infoTable) {
					infoTable.remove();
				}
				var toggleContainer = document.getElementById("trackToggleTrackLayers");
				if (toggleContainer) {
					toggleContainer.remove();
				}
			}
		},
		skipTrack: function (pos, prevPos, time, name, data, icon, angle) {
			console.log("skipped");
			console.log("SKIP TRACK DATA ==> ", pos, time, name, data, icon, angle);

			clearInterval(this.track_ivlDraw);
			this.track_end_marker.getSource().clear();
			this.layerFlag = false;
			this.markerFlag = false;
			this.first_add_icon = false;
			// this.first_time_zoom_flag = false;
			this.previousP = [];
			this.currentP = [];
			this.previous = [];
			this.previousTime = [];
			this.previousData = [];
			this.current_track_flag = false;

			//////		 
			var iconFeatures = [];
			var iconFeature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform(prevPos, 'EPSG:4326', 'EPSG:3857')),
				name: 'SkipTrackMarker'
			});
			iconFeature.set('layer_name', 'SkipTrackMarker');
			iconFeature.set('title', 'SkipTrackMarker');
			iconFeatures.push(iconFeature);

			var vectorSource = new ol.source.Vector({
				features: iconFeatures
			});

			var iconStyle = new ol.style.Style({
				image: new ol.style.Icon({
					//    anchor: [0.5, 46],
					//    anchorXUnits: 'fraction',
					//    anchorYUnits: 'pixels',
					//    opacity: 0.75,
					src: icon
				})
			});

			var vectorLayer = new ol.layer.Vector({
				source: vectorSource,
				style: iconStyle
			});
			tmpl_setMap_layer_global.push({
				layer: vectorLayer,
				title: 'SkipTrackMarker',
				visibility: true,
				map: this.map
			});
			vectorLayer.setMap(this.map);

			//////

			vehicleObj = new tmpl.Track.singleVehicle({
				map: this.map,
				vehicle_img: icon,
				route_width: 4,
				route_color: this.route_color,
				// icon_scale : 0.6,
				getHoverLabel: this.getHoverLabel,
				label: 'ddddd',
				skipedVehicleFlag: true
			});
			vehicleObj.startTrack({
				position: pos,
				time: time,
				name: name,
				data: data,
				icon: icon,
				angle: angle
			});
		},
		routeVehicle: function (param) {
			var visibility = param.visibility;
			var map = param.map;
			//if(visibility)
			// this.track_end_marker.setVisible(visibility);
			track_end_marker_dyn.setVisible(visibility);
			// else
			//this.track_end_marker.setMap(null);
		},
		routeLayer: function (param) {
			var visibility = param.visibility;
			var map = param.map;
			// this.track_line_layer.setVisible(visibility);
			track_line_layer_dyn.setVisible(visibility);
		}
	};



	function trackDetailsUpdate(resourceId, callSign, position, location, speed, time, nogpsstatus) {
		$("#trackresourceDiv").html(resourceId);
		$("#trackcallSignDiv").html(callSign);
		$("#trackpositionDiv").html(position);
		$("#tracklocationDiv").html(location);
		$("#trackspeedDispDiv").html(speed);
		// $("#trackvehicleUpdatedTimeDiv").html(
		// moment(time, "YYYY-MM-DD hh:mm:ss.SSSSSSS").format(
		// "DD-MM-YYYY hh:mm:ss A"));
		/*$("#trackdateTimeDiv").html(
				moment(time, "YYYY-MM-DD hh:mm:ss.SSSSSSS").format(
						"DD-MM-YYYY hh:mm:ss A"));	*/
		//alert(time);
		$("#trackdateTimeDiv").html(time);
		if (nogpsstatus == 0) {
			$("#gpsstatustrack").show();
			$("#vehiclegpsstatusDiv").html("No GPS")
		} else {
			$("#gpsstatustrack").hide();
		}
	}

	// ******** Track End ********** //

	tmpl.Route.getDistanceTime = function (param) {
		var mapObj = param.map;
		var origin = param.origin;
		var destination = param.destination;
		var callbackFunc = param.callbackFunc;
		var dataTable = param.dataTable;
		var distanceDetails = [];
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
			origins: [origin],
			destinations: destination,
			travelMode: 'DRIVING',
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, function (response, status) {
			if (status !== 'OK') {
				console.log('Error was: ', status);
			} else {
				var results = response.rows[0].elements;
				for (var j = 0; j < results.length; j++) {
					var data = { Distance: results[j].distance.text, Duration: results[j].duration.text, DurationValue: results[j].duration.value };
					distanceDetails.push(data);
				}
			}
			callbackFunc(distanceDetails, dataTable);
		});
	}


	tmpl.Route.cancelOnClick = function (param) {

	}

	tmpl.Route.onClick = function (param) {
		var click_source_route;
		var click_destination_route = [];
		var map1 = param.map;
		var sourceImg = param.sourceImg;
		var destinationImg = param.destinationImg;
		var radius1 = param.radius;
		var callbackFunc = param.callbackFunc;
		var bufferCallback = param.bufferCallbackFunc;
		var iconArray = [sourceImg, destinationImg];
		var callbackResult = null;

		// tmpl.Route.clearRoute({map : map1});

		var startPointAddress = null;
		var endPointAddress = null;
		var newLayer = new ol.layer.Vector({
			lname: 'route_onclik',
			source: new ol.source.Vector()
		});
		if (click_destination_route.length == 0) {
			tmpl.Draw.draw({
				map: map1,
				type: 'Point',
				callbackFunc: getDrawFeatureDetails
			});
			function getDrawFeatureDetails(coord, feature, wktGeom, value) {
				console.log("COORD: ", coord);
				click_destination_route.push(coord);
				var projCoord = ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
				var pointdata = new ol.geom.Point(projCoord);
				// console.log("pointdata: ",pointdata);
				var feature2 = new ol.Feature({
					geometry: pointdata
				});
				feature2.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: sourceImg,
						anchor: [0.5, 1]
					})
				}));
				newLayer.getSource().addFeature(feature2);
				map1.addLayer(newLayer);

				tmpl.Draw.clear({
					map: map1
				});
				tmpl.Draw.draw({
					map: map1,
					type: 'Point',
					callbackFunc: getDrawFeature
				});
				function getDrawFeature(coord, feature, wktGeom, value) {
					click_destination_route.push(coord);
					newLayer.getSource().clear();
					tmpl.Route.getRoute({
						map: map1,
						source: click_destination_route[0],
						destination: click_destination_route[1],
						sourceIcon: sourceImg,						//"img/1.png",
						destinationIcon: destinationImg,			//"img/2.png",
						radius: radius1,//20,
						callbackFunc: routeDetails,
						getGeometry: test
					});

					function routeDetails(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom) {
						console.log("--->>>>>>>>>>>>>>>>>>>>>>", resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom);
						if (appConfigInfo.mapDataService == 'esri') {
							var cordStart4326 = cordStart;
							var cordEnd4326 = cordEnd;
						}
						else if (appConfigInfo.mapData == 'hereMaps') {
							var cordStart4326 = ol.proj.transform(cordStart, 'EPSG:4326', 'EPSG:3857');
							var cordEnd4326 = ol.proj.transform(cordEnd, 'EPSG:4326', 'EPSG:3857');
						}
						else {
							var cordStart4326 = ol.proj.transform(cordStart, 'EPSG:3857', 'EPSG:4326');
							var cordEnd4326 = ol.proj.transform(cordEnd, 'EPSG:3857', 'EPSG:4326');
						}
						callbackResult = { ETA: resETA, startCoord: cordStart4326, endCoord: cordEnd4326, coordinateArray: coordinateArray, wktGeom: wktGeom, ETA_legs: ETA_legs };
						callbackFunc(callbackResult);
					};
					tmpl.Draw.clear({
						map: map1
					});
					function test(data) {
						bufferCallback(data);
						console.log("click_destination_route[0] >>>", click_destination_route[0]);
						tmpl.Geocode.getGeocode({
							point: click_destination_route[0],
							callbackFunc: handleGeocode
						});
						function handleGeocode(addrs) {
							var result = {
								route: data,
								geocode: addrs
							};
							// callbackFunc(result);								
						}



						var dragedFeature;
						window.app = {};
						var app = window.app;
						var format = new ol.format.WKT();
						app.Drag = function () {
							ol.interaction.Pointer.call(this, {
								handleDownEvent: app.Drag.prototype.handleDownEvent,
								handleDragEvent: app.Drag.prototype.handleDragEvent,
								handleMoveEvent: app.Drag.prototype.handleMoveEvent,
								handleUpEvent: app.Drag.prototype.handleUpEvent
							});
							this.coordinate_ = null;
							this.cursor_ = 'pointer';
							this.feature_ = null;
							this.previousCursor_ = undefined;
						};
						ol.inherits(app.Drag, ol.interaction.Pointer);

						app.Drag.prototype.handleDownEvent = function (evt) {
							var map = evt.map;
							var feature = map.forEachFeatureAtPixel(evt.pixel,
								function (feature, layer) {

									// console.log(layer.get('lname'));
									if (layer == null) {
										if (feature.get('lname') == 'routeVector') {
											return feature;
										}
									} else if (layer.get('lname') == "routeVector") {
										if (feature.get('fname') == 'source' || feature.get('fname') == 'destination')
											return feature;
									}

								});

							if (feature) {
								this.coordinate_ = evt.coordinate;
								this.feature_ = feature;
							}
							return !!feature;
						};

						app.Drag.prototype.handleDragEvent = function (evt) {
							// alert("handleMoveEvent1");
							var map = evt.map;
							var feature = map.forEachFeatureAtPixel(evt.pixel,
								function (feature, layer) {
									return feature;
								});
							var deltaX = evt.coordinate[0] - this.coordinate_[0];
							var deltaY = evt.coordinate[1] - this.coordinate_[1];
							var geometry =
								(this.feature_.getGeometry());
							geometry.translate(deltaX, deltaY);
							this.coordinate_[0] = evt.coordinate[0];
							this.coordinate_[1] = evt.coordinate[1];
						};

						app.Drag.prototype.handleMoveEvent = function (evt) {
							// alert("handleMoveEvent2");
							if (this.cursor_) {
								var map = evt.map;
								var feature = map.forEachFeatureAtPixel(evt.pixel,
									function (feature, layer) {
										return feature;
									});
								var element = evt.map.getTargetElement();
								if (feature) {
									editFeature = feature;
									point = feature.getGeometry().getCoordinates();
									var point;
									if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
										point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
									}
									else {
										// do notng
									}
									//point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
									if (element.style.cursor != this.cursor_) {
										this.previousCursor_ = element.style.cursor;
										element.style.cursor = this.cursor_;
									}
								} else if (this.previousCursor_ !== undefined) {
									element.style.cursor = this.previousCursor_;
									this.previousCursor_ = undefined;
								}
							}
						};

						app.Drag.prototype.handleUpEvent = function (evt) {
							var value = this.feature_.getGeometry().getType();
							if (value === 'Point') {
								lonlat = this.feature_.getGeometry();
							}
							else if (value === 'LineString') {
								lonlat = this.feature_.getGeometry();
							}
							else if (value === 'Polygon') {
								lonlat = this.feature_.getGeometry();
							}

							if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
								coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
								wktGeom = format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
							}
							else {
								coordinate = lonlat.getCoordinates();
								wktGeom = format.writeGeometry(lonlat);
								//  wktGeom= format.writeGeometry(this.feature_.getGeometry());
							}

							var result = {
								new_coordinates: coordinate
							};
							var dragFeature = this.feature_;
							if (dragFeature.get('fname') == 'source') {
								tmpl.Route.clearRoute({ map: map1 });
								tmpl.Route.getRoute({
									map: map1,
									source: ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
									destination: click_destination_route[1],
									sourceIcon: sourceImg,//"img/1.png",
									destinationIcon: destinationImg,//"img/2.png",
									radius: radius1,//20,
									getGeometry: test1,
									callbackFunc: dragRouteDetails
								});
								click_destination_route[0] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
							} else if (dragFeature.get('fname') == 'destination') {
								tmpl.Route.clearRoute({ map: map1 });
								tmpl.Route.getRoute({
									map: map1,
									source: click_destination_route[0],
									destination: ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
									sourceIcon: sourceImg,//"img/1.png",
									destinationIcon: destinationImg,//"img/2.png",
									radius: radius1,//20,
									getGeometry: test1,
									callbackFunc: dragRouteDetails
								});
								click_destination_route[1] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
							}

							function dragRouteDetails(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress) {
								// console.log("eeeeeeeeeeeeeee: ",callbackResult);
								var callbackResult = { resETA: resETA, cordStart: cordStart, cordEnd: cordEnd, coordinateArray: coordinateArray, ETA_legs: ETA_legs, wktGeom: wktGeom, startPointAddress: startPointAddress, endPointAddress: endPointAddress };
								callbackFunc(callbackResult);
							}

							function test1(data) {
								bufferCallback(data);
								//console.log("data >>>",data);
								tmpl.Geocode.getGeocode({
									point: click_destination_route[0],
									callbackFunc: handleGeocode
								});
								function handleGeocode(addrs) {
									var result = {
										route: data,
										geocode: addrs
									};
									// callbackFunc(result);
								}
							}
							//mycallback(result);
							this.coordinate_ = null;
							this.feature_ = null;
							return false;
						};
						intr = new app.Drag();
						map1.addInteraction(intr);

					}

				}
			}

		}


		tmpl.Route.cancelOnClick = function (param) {
			var map1 = param.map;
			tmpl.Route.clearRoute({ map: map1 });
			tmpl.Draw.remove({
				map: map1
			});
		}
	}

	tmpl.Route.joinRoute = function (param) {
		var mapObj = param.map;
		var datas = param.feature;
		var layerName = param.layerName;
		var callbackFunc = param.callbackFunc;

		var sourceIcon = param.source_image;
		var destinationIcon = param.destination_image;

		var routeLine1, feature1;
		var wayPoint = [], sourcePoint = [], destinationPoint = [];
		var sourcePointFirst, destinationPointLast, wayPointLat, wayPointLon;
		var format = new ol.format.WKT();
		if (datas.length >= 2) {
			for (var i = 0; i < datas.length; i++) {
				routeLine1 = datas[i].geometry;
				if (appConfigInfo.mapData == 'google') {
					feature1 = format.readFeature(routeLine1, {
						dataProjection: 'EPSG:4326',
						featureProjection: 'EPSG:3857',
						rname: 'route1',
						routeid: datas[i].id
					});

				}
				else {
					feature1 = format.readFeature(routeLine1, {
						dataProjection: 'EPSG:4326',
						featureProjection: 'EPSG:4326',
						rname: 'route1',
						routeid: datas[i].id
					});

				}
				if (i == 0) {
					sourcePointFirst = feature1.getGeometry().getFirstCoordinate();
					var latlon = feature1.getGeometry().getLastCoordinate()
					wayPointLat = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326');
					wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
				} else if (i == (datas.length) - 1) {
					destinationPointLast = feature1.getGeometry().getLastCoordinate();
					var latlon = feature1.getGeometry().getFirstCoordinate()
					wayPointLat = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326');
					wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
				} else {
					wayPointLat = ol.proj.transform(feature1.getGeometry().getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326');
					var wayPointLon2 = ol.proj.transform(feature1.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
					wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
					wayPoint.push({ lat: wayPointLon2[1], lon: wayPointLon2[0] });
				}


			}
			sourcePointFirst = ol.proj.transform(sourcePointFirst, 'EPSG:3857', 'EPSG:4326');
			destinationPointLast = ol.proj.transform(destinationPointLast, 'EPSG:3857', 'EPSG:4326');
			console.log("wayPoint >>", wayPoint);
			var stops = wayPoint;
			tmpl.Route.getRoute({
				map: map,
				source: sourcePointFirst,
				destination: destinationPointLast,
				sourceIcon: sourceIcon,
				destinationIcon: destinationIcon,
				waypoints: stops,
				waypointsIcon: "img/testroute.png",
				radius: 20,
				getGeometry: test//,
				// wayPointFormat:false
			});
			function test(a) {
				//console.log("a>>",a);
				callbackFunc(a);
			}
		}
	}
	tmpl.Route.clearAddedRoute = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;

		var Layers = mapObj.getLayers();
		var existing;
		for (i = 0; i < Layers.getLength(); i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerName) {
					existing = existingLayer;
					existingLayer.getSource().clear();
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().clear();
				}
			}
		}
	}
	// NEW TRIP ANIMATION //

	var trip_lines_layer_flag = false;
	var trip_lines_layer_direction_flag = false;
	var trip_lines_layer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var trip_lines_layer_direction = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var trip_points_layer_flag1 = false;
	var trip_end_marker_flag = false;
	var trip_points_layer1 = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var trip_points_layer_flag = false;
	var trip_points_layer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var trip_end_Marker = new ol.layer.Vector({
		title: 'trip_vehcile_marker',
		source: new ol.source.Vector()
	});
	var ivlDraw;
	var temp_store_animation_pause = {};
	var temp_store_animation_stop = {};
	var uniqueData = [];
	var track_halt_points = [];
	var track_halt_points_id = [];
	var trak_animationSpeed = 100;
	var trak_animationSteps = 25;
	var mouseHoverDetails;
	var ivlDrawTempDisplay = '';
	tmpl.Trip.clear = function (param) {
		var map = param.map;

		firstrun = true;
		tripTimeDelay = -1;
		Trip_global_delay_time = -1;
		trip_lines_layer_flag = false;
		trip_lines_layer_direction_flag = false;
		ivlDraw = null;
		temp_store_animation_pause = {};
		temp_store_animation_stop = {};
		track_halt_points_id = [];
		trak_animationSpeed = 100;
		trak_animationSteps = 15;
		mouseHoverDetails = null;
		ivlDrawTempDisplay = '';
		//tripDataForReplyFromDisplay = null;	
		tripDataForReplyFromDisplay_flag = false;
		tripAnimation_started = false;
		tripDisplay_flag = false;
		Trip_global_delay_time = -1;
		displayFlag = false;
		tripHaltPointsGlobal = [];

		temp_store_animation_pause = {};
		temp_store_animation_stop = {};
		uniqueData = [];
		track_halt_points_id = [];

		//current_status_flag="none";	

		tripDataForReplyFromDisplay_flag = false;
		tmpl_trip_halt_animation_flag = false;
		tmpl_trip_start_animation_flag = false;
		tmpl_trip_end_animation_flag = false;
		tmpl_trip_layer_display_flag = false;
		tmpl_trip_halt_display_flag = false;
		tmpl_trip_start_display_flag = false;
		tmpl_trip_end_display_flag = false;
		tmpl_trip_vehicle_display_flag = false;



		try {

			clearInterval(ivlDrawTempDisplay);
			trip_points_layer1.getSource().clear();
			trip_points_layer.getSource().clear();
			trip_end_Marker.getSource().clear();
			trip_lines_layer.getSource().clear();
			trip_lines_layer_direction.getSource().clear();
			trip_end_marker_flag = false;
			tmpl_trip_vehicle_display.getSource().clear();
			tmpl_trip_layer_display.getSource().clear();
			tmpl_trip_layer_display1.getSource().clear();
			tmpl_trip_halt_display.getSource().clear();
			tmpl_trip_halt_animation.getSource().clear();
			tmpl_trip_start_display.getSource().clear();
			tmpl_trip_start_animation.getSource().clear();
			tmpl_trip_end_display.getSource().clear();
			tmpl_trip_end_animation.getSource().clear();
			try {
				map.removeLayer(tmpl_trip_layer_display);
				map.removeLayer(tmpl_trip_layer_display1);
			} catch (e) { console.log("Error in map Obj!!", e); }
			tripAnimation_started = false;
			tmpl_trip_vehicle_display_flag = false;
			tmpl_trip_layer_display_flag = false;
			tmpl_trip_halt_display_flag = false;
			tmpl_trip_halt_animation_flag = false;
			tmpl_trip_start_display_flag = false;
			tmpl_trip_start_animation_flag = false;
			tmpl_trip_end_display_flag = false;
			tmpl_trip_end_animation_flag = false;
			tripDataForReplyFromDisplay_flag = false;
			if (gbl_trip_clear_tooltip != undefined)
				gbl_trip_clear_tooltip.style.display = 'none';
			try {
				map.unByKey('pointermove', mouseHoverDetails);
			}
			catch (e) {
				console.log("Error:map,map.un,mouseHoverDetails::-->", map, map.un, mouseHoverDetails)
			}
			clearInterval(ivlDraw);

			tripPlaybackAnimation = null;

			Element.prototype.remove = function () {
				this.parentElement.removeChild(this);
			}
			NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
				for (var i = this.length - 1; i >= 0; i--) {
					if (this[i] && this[i].parentElement) {
						this[i].parentElement.removeChild(this[i]);
					}
				}
			}
			var infoTable = document.getElementById("infoTable");
			if (infoTable) {
				infoTable.remove();
			}
			var toggleContainer = document.getElementById("toggleTrackLayers");
			if (toggleContainer) {
				toggleContainer.remove();
			}
			var tripControlscontainer = document.getElementsByClassName("tripControlscontainer");
			if (tripControlscontainer) {
				tripControlscontainer.remove();
			}
			try {
				// to clear Trip chart	
				if (document.getElementById('bottomPaneldiv')) {
					var x = document.getElementById('bottomPaneldiv');
					x.remove();
				}

				// x.style.display = "none";	

				//end to clear Trip chart	
			}
			catch (e) {
				console.error('Unable to remove', e);
			}


		}
		catch (err) {
			console.error("ERROR Trip.clear: ", err);
		}
	}

	tmpl.Trip.stopClear = function (param) {
		var map = param.map;
		trip_points_layer1.getSource().clear();
		trip_points_layer.getSource().clear();
		trip_end_Marker.getSource().clear();
		trip_lines_layer.getSource().clear();
		trip_lines_layer_direction.getSource().clear();
		trip_end_marker_flag = false;
		// tmpl_trip_vehicle_display.getSource().clear();
		// tmpl_trip_layer_display.getSource().clear();
		// tmpl_trip_halt_display.getSource().clear();
		// tmpl_trip_start_display.getSource().clear();
		// tmpl_trip_end_display.getSource().clear();

		tmpl_trip_halt_animation.getSource().clear();
		tmpl_trip_start_animation.getSource().clear();
		tmpl_trip_end_animation.getSource().clear();
		map.un('pointermove', mouseHoverDetails);
		clearInterval(ivlDraw);
	}
	var tmpl_trip_halt_animation_flag = false;
	var tmpl_trip_halt_animation = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_start_animation_flag = false;
	var tmpl_trip_start_animation = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_end_animation_flag = false;
	var tmpl_trip_end_animation = new ol.layer.Vector({
		source: new ol.source.Vector()
	});


	var tmpl_trip_layer_display_flag = false;
	var tmpl_trip_layer_display = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_layer_display1 = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_halt_display_flag = false;
	var tmpl_trip_halt_display = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_start_display_flag = false;
	var tmpl_trip_start_display = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_end_display_flag = false;
	var tmpl_trip_end_display = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	var tmpl_trip_vehicle_display_flag = false;
	var tmpl_trip_vehicle_display = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	tmpl.Trip.routeLayer = function (param) {
		var visibility = param.visibility;
		tmpl_trip_layer_display.setVisible(visibility);
		tmpl_trip_layer_display1.setVisible(visibility);
		tmpl_trip_halt_display.setVisible(visibility);
		tmpl_trip_start_display.setVisible(visibility);
		tmpl_trip_end_display.setVisible(visibility);
		if (visibility == true)
			trip_lines_layer.setVisible(false);
		else
			trip_lines_layer.setVisible(true);
	};
	tmpl.Trip.animatingRoute = function (param) {
		var visibility = param.visibility;
		trip_lines_layer.setVisible(visibility);
		trip_lines_layer_direction.setVisible(visibility);
	};

	tmpl.Trip.routeVehicle = function (param) {
		var visibility = param.visibility;
		var map = param.map;
		if (tripAnimation_started == true) {
			tmpl_trip_vehicle_display.setMap(null);
			if (visibility == true)
				trip_end_Marker.setMap(map);
			else
				trip_end_Marker.setMap(null);
		} else {
			if (visibility == true)
				tmpl_trip_vehicle_display.setMap(map);
			else
				tmpl_trip_vehicle_display.setMap(null);
		}
	};

	var tripDataForReplyFromDisplay;
	var tripDataForReplyFromDisplay_flag = false;
	var tripAnimation_started = false;
	var tripDisplay_flag = false;
	var Trip_global_delay_time = -1;
	var displayFlag = false;

	tmpl.Trip.delay = function (val) {
		//tripDataForReplyFromDisplay
		Trip_global_delay_time = val;
	}

	//Updated trip display Added on 19-12-2019

	var tripHaltPointsGlobal = [];
	tripTimeDelay = -1;
	Trip_global_delay_time = -1;

	tmpl.Trip.display = function (param) {
		console.log("Trip Display:->", param);
		if (Object.keys(param).length === 0) {
			console.error("Mised param!!!!");
		}
		else {
			removeTripInfoTable();
			if (param.data.length == 1 || param.data.length == 0) {
				console.log("Not enough data");
			} else {
				if (param.data.length == 1 || param.data.length == 0) {
					console.log("Not enough data");
				} else {
					tripDisplay_flag = true;
					tripDataForReplyFromDisplay = param;
					var tripVehicleId = param.id;
					var data2 = param.data;
					var map = param.map;
					var halt_points = param.halt_points;
					var halt_img;
					var img_url = param.img_url;
					var route_color = param.route_color;
					var route_style_width = param.route_width;
					var callbackFunc = param.callbackFunc;
					var start_url = param.start_url;
					var end_url = param.end_url;
					var minHaltTime = param.minHalt;
					var returnTableData = param.returnTableData;
					var routeMouseOverDetails = param.routeMouseOverDetails;
					var vehicle_icon_scale = param.icon_scale;
					var label = param.label;
					var tooltipLocation = param.tooltipLocation;
					var tripEndCallbackFunc = param.tripEndCallbackFunc;
					var halt_points_index = [];
					var halt_points_indexTemp = [];

					var data1 = [];
					for (var i = 0; i < data2.length; i++) {
						if (data2[i - 1]) {
							//prev && current
							if (data2[i - 1].lat == data2[i].lat && data2[i - 1].lon == data2[i].lon) {
								console.log('Duplicate Found', data2[i]);
							}
							else {
								data1.push(data2[i - 1]);

								if (i == data2.length - 1) {
									data1.push(data2[i]);
								}
							}
						}
					}

					//console.log("data2:",data2);
					//console.log("data1:",data1);

					if (param.routeMouseOverDetails == true) {
						EnableTripToolTip(map, tooltipLocation);
					}
					if (param.halt_points == true) {
						halt_img = param.halt_img;
					}
					if (route_style_width == undefined) {
						route_style_width = 4;
					}

					//map.unByKey(pointerMoveID);			//@BK									

					var mapDiv = document.getElementById(globalMapDivID);
					var toggleLayersDiv = document.createElement("div");
					toggleLayersDiv.className = "toggleLayers";
					toggleLayersDiv.id = "toggleTrackLayers";
					//var mapDiv = document.getElementById(globalMapDivID);
					mapDiv.appendChild(toggleLayersDiv);
					// document.body.appendChild(toggleLayersDiv);
					toggleLayersDiv.style.position = "absolute";
					toggleLayersDiv.style.display = "flex";
					toggleLayersDiv.style.justifyContent = "center";
					toggleLayersDiv.style.top = "8%";
					toggleLayersDiv.style.right = "10px";
					toggleLayersDiv.style.width = "30%";
					toggleLayersDiv.style.backgroundColor = "cornsilk";
					toggleLayersDiv.style.borderRadius = "5px";
					toggleLayersDiv.style.opacity = "0.8";
					toggleLayersDiv.style.zIndex = "4";

					var routelineCheckbox = document.createElement('input');
					routelineCheckbox.id = "checkrouteline";
					routelineCheckbox.type = "checkbox";
					routelineCheckbox.name = "Route Line";
					routelineCheckbox.value = "Route Line";
					routelineCheckbox.checked = true;
					toggleLayersDiv.appendChild(routelineCheckbox);
					// routelineCheckbox.onclick = routeLinevisibility;
					document.getElementById("toggleTrackLayers").append("Route Line");

					var routevehicleCheckbox = document.createElement('input');
					routevehicleCheckbox.id = "checkresource";
					routevehicleCheckbox.type = "checkbox";
					routevehicleCheckbox.name = "Resource";
					routevehicleCheckbox.value = "Resource";
					routevehicleCheckbox.checked = true;
					toggleLayersDiv.appendChild(routevehicleCheckbox);
					// routevehicleCheckbox.onclick = resourcevisibility;
					document.getElementById("toggleTrackLayers").append("Resource");

					var infoCheckbox = document.createElement('input');
					infoCheckbox.id = "checkinfobox";
					infoCheckbox.type = "checkbox";
					infoCheckbox.name = "Infobox";
					infoCheckbox.value = "Infobox";
					infoCheckbox.checked = true;
					toggleLayersDiv.appendChild(infoCheckbox);
					// infoCheckbox.onclick = infoboxvisibility;
					document.getElementById("toggleTrackLayers").append("Infobox");

					var deviatedpointCheckbox = document.createElement('input');
					deviatedpointCheckbox.id = "checkdeviatedpoint";
					deviatedpointCheckbox.type = "checkbox";
					deviatedpointCheckbox.name = "Route Deviation";
					deviatedpointCheckbox.value = "Route Deviation";
					deviatedpointCheckbox.checked = false;
					toggleLayersDiv.appendChild(deviatedpointCheckbox);
					// deviatedpointCheckbox.onclick = routeLinevisibility;
					document.getElementById("toggleTrackLayers").append("Route Deviation");


					var bottomPanel = document.createElement("div");
					bottomPanel.className = 'bottomPanel';
					bottomPanel.id = 'bottomPaneldiv';
					bottomPanel.style.position = 'fixed';
					bottomPanel.style.bottom = '0%';
					bottomPanel.style.right = '0%';
					bottomPanel.style.width = '100%';
					bottomPanel.style.height = '42px';
					bottomPanel.style.float = 'right';
					bottomPanel.style.backgroundColor = 'white';
					bottomPanel.style.borderRadius = '5px';
					bottomPanel.style.zIndex = '4';
					bottomPanel.style.transition = 'all 1.0s';
					mapDiv.appendChild(bottomPanel);

					var bottomPaneldata = document.createElement("div");
					bottomPaneldata.className = 'bottomPaneldata';
					bottomPaneldata.id = 'bottomPaneldatadiv';
					bottomPaneldata.style.position = 'absolute';
					bottomPaneldata.style.visibility = 'hidden';
					bottomPaneldata.style.top = '100%';
					bottomPaneldata.style.right = '0%';
					bottomPaneldata.style.width = '100%';
					bottomPaneldata.style.height = '393%';
					bottomPaneldata.style.float = 'right';
					bottomPaneldata.style.backgroundColor = 'lightgray';
					bottomPaneldata.style.borderRadius = '5px';
					bottomPaneldata.style.overflow = 'scroll';
					bottomPaneldata.style.zIndex = '4';
					bottomPaneldata.style.transition = 'all 1.0s';
					// bottomPanel.appendChild(bottomPaneldata);


					var btmPnlSigndownCont = document.createElement("div");
					btmPnlSigndownCont.className = 'signdownContainer';
					btmPnlSigndownCont.style.position = 'absolute';
					btmPnlSigndownCont.style.right = '10px';
					btmPnlSigndownCont.style.top = '25%';
					btmPnlSigndownCont.style.zIndex = '5';
					bottomPanel.appendChild(btmPnlSigndownCont);

					var closeDataTab = document.createElement("BUTTON");
					closeDataTab.className = "signDownTab";
					closeDataTab.value = "1";
					closeDataTab.style.background = "none";
					closeDataTab.style.border = "none";
					closeDataTab.style.cursor = "pointer";
					closeDataTab.style.transition = 'all 1.0s';
					closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>';
					closeDataTab.onclick = function (evt) {
						if (closeDataTab.value == 1) {
							bottomPanel.appendChild(bottomPaneldata);
							bottomPaneldata.style.visibility = 'visible';
							bottomPanel.style.bottom = '26.5%';
							closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-down"></i>'
							closeDataTab.value = 2;
						}
						else {
							bottomPaneldata.style.visibility = 'hidden';
							bottomPanel.style.bottom = '0%';
							closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
							closeDataTab.value = 1;
							setTimeout(function () { bottomPanel.removeChild(bottomPaneldata); }, 500);
						}
					}
					btmPnlSigndownCont.appendChild(closeDataTab);


					var infoTabs = document.createElement("div");
					infoTabs.classname = 'infoTabs';
					infoTabs.style.overflow = 'hidden';
					bottomPanel.appendChild(infoTabs);

					var graphTab = document.createElement("BUTTON");
					graphTab.className = 'graphTab active';
					//for open default graph tab
					graphTab.id = 'graphTabid';
					graphTab.innerHTML = 'Graph';
					graphTab.style.backgroundColor = 'inherit';
					graphTab.style.float = 'left';
					graphTab.style.border = 'none';
					graphTab.style.outline = 'none';
					graphTab.style.cursor = 'pointer';
					graphTab.style.padding = '11px 16px';
					graphTab.style.transition = 'all 1.0s';
					graphTab.style.fontSize = '17px';
					graphTab.onclick = function (evt) {
						var div = document.getElementById('bottomPaneldatadiv');
						if (div) {
							while (div.firstChild) {
								div.removeChild(div.firstChild);
							}
						}
						bottomPanel.appendChild(bottomPaneldata);
						generateGraph();
						bottomPaneldata.style.visibility = 'visible';
						bottomPanel.style.bottom = '26.5%';
						bottomPaneldata.style.position = 'absolute';
						if (closeDataTab.value == 2) {
							if (bottomPanel.style.bottom == '0%') {
								closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
								closeDataTab.value = 1;
							}
							else { }
						}
						else {
							closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-down"></i>'
							closeDataTab.value = 2;
						}
						document.getElementsByClassName('tripDataTab')[0].style.backgroundColor = "white";
						document.getElementsByClassName('graphTab')[0].style.backgroundColor = "gray";
					};
					infoTabs.appendChild(graphTab);
					var tripDataTab = document.createElement("BUTTON");
					tripDataTab.className = 'tripDataTab';
					tripDataTab.innerHTML = 'Messages';
					tripDataTab.style.backgroundColor = 'inherit';
					tripDataTab.style.float = 'left';
					tripDataTab.style.border = 'none';
					tripDataTab.style.outline = 'none';
					tripDataTab.style.cursor = 'pointer';
					tripDataTab.style.padding = '11px 16px';
					tripDataTab.style.transition = '0.3s';
					tripDataTab.style.fontSize = '17px';
					tripDataTab.onclick = function (evt) {
						var div = document.getElementById('bottomPaneldatadiv');
						if (div) {
							while (div.firstChild) {
								div.removeChild(div.firstChild);
							}
						}
						bottomPanel.appendChild(bottomPaneldata);
						generateTable();
						bottomPaneldata.style.visibility = 'visible';
						bottomPanel.style.bottom = '26.5%';
						bottomPaneldata.style.position = 'absolute';
						if (closeDataTab.value == 2) {
							if (bottomPanel.style.bottom == '0%') {
								closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
								closeDataTab.value = 1;
							}
						}
						else {
							closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-down"></i>'
							closeDataTab.value = 2;
						}
						document.getElementsByClassName('graphTab')[0].style.backgroundColor = "white";
						document.getElementsByClassName('tripDataTab')[0].style.backgroundColor = "gray";
					};
					infoTabs.appendChild(tripDataTab);

					var graphTabcontent = document.createElement("div");
					graphTabcontent.classname = 'tabcontent';
					graphTabcontent.id = 'graphTabcontent';

					var messageTabcontent = document.createElement("div");
					messageTabcontent.classname = 'tabcontent';
					messageTabcontent.id = 'messageTabcontent';

					var tabcontentStyle = document.getElementsByClassName('tabcontent');
					if (tabcontentStyle[0]) {
						tabcontentStyle[0].style.display = 'none';
						tabcontentStyle[0].style.padding = '6px 12px';
						tabcontentStyle[0].style.borderTop = 'none';
					}


					function generateTable() {
						var arrHead = ['Date', 'Location', 'Speed (km/hr)', 'Latitude', 'Longitude'];
						var messagesTable = document.createElement('table');
						messagesTable.style.tableLayout = 'auto';
						messagesTable.style.width = '100%';
						messagesTable.setAttribute('id', 'messagesTable');
						bottomPaneldata.appendChild(messagesTable);
						var tr = messagesTable.insertRow(-1);
						tr.className = "tableHeader";
						// tr.style.position = 'fixed';
						tr.style.backgroundColor = 'black';
						tr.style.color = 'white';

						for (var h = 0; h < arrHead.length; h++) {
							var th = document.createElement('th');
							th.className = "msgtabheading";
							th.style.border = "1px solid white";
							th.innerHTML = arrHead[h];
							// th.style.position = 'sticky';
							// th.style.top = '0%';
							tr.appendChild(th);
						}
						// First level Data Push		
						//for(var k=0; k<=data1.length; k++){
						var k = data1.length;
						while (k--) {
							var temp = document.getElementById('messagesTable');
							temp.style.borderCollapse = "collapse";

							var rowCnt = temp.rows.length;
							var tr = temp.insertRow(1);
							tr.className = "msgTable";

							for (var c = 0; c < arrHead.length; c++) {
								var td = document.createElement('td');

								td = tr.insertCell(c);
								var arrVal = ['datetime', 'location', 'speed', 'lat', 'lon'];

								switch (c) {
									case 0:
										td.innerHTML = data1[k].datetime;
										break;
									case 1:
										td.innerHTML = data1[k].location;
										break;
									case 2:
										td.innerHTML = data1[k].speed;
										break;
									case 3:
										td.innerHTML = data1[k].lat;
										break;
									case 4:
										td.innerHTML = data1[k].lon;
										break;
									default:
										break;
								}
								td.style.border = "1px solid darkgray";
								td.style.padding = "4px";
								td.className = "rowEntry";
							}
						}
					}


					generateGraph();
					//Beginning of Graph part
					function generateGraph() {
						var xaxis = ['x'];
						var yaxis = ['speed'];

						for (var j = 0; j < data1.length; j++) {
							xaxis.push(data1[j].datetime);
							yaxis.push(data1[j].speed);
						}
						var chart = c3.generate({
							size: {
								height: 180,
								// width: 100
							},
							bindto: '#bottomPaneldatadiv',
							data: {
								x: 'x',
								xFormat: '%d-%m-%Y %H:%M:%S',
								columns: [
									xaxis,
									yaxis
								]
							},
							axis: {
								x: {
									type: 'timeseries',
									tick: {
										format: '%d-%m-%Y %H:%M:%S',
										fit: false,
										culling: true,
										// rotate: -75,
									},
									height: 25
								}
							}
						});
						//for open default graph tab
						document.getElementById("graphTabid").click();
					}


					var tripControlsContainer = document.createElement("div");
					tripControlsContainer.className = "tripControlscontainer";
					bottomPanel.appendChild(tripControlsContainer);

					var tripControlContainerStyle = document.getElementsByClassName("tripControlscontainer");
					tripControlContainerStyle[0].style.position = 'absolute';
					tripControlContainerStyle[0].style.height = '40px';
					tripControlContainerStyle[0].style.bottom = '2%';
					tripControlContainerStyle[0].style.left = '40%';
					tripControlContainerStyle[0].style.backgroundColor = 'black';
					tripControlContainerStyle[0].style.borderRadius = '5px';
					tripControlContainerStyle[0].style.zIndex = '5';

					var mapControls = document.createElement("div");
					mapControls.className = "mapControls";
					mapControls.id = "controlButtons";
					tripControlsContainer.appendChild(mapControls);

					var playBut = document.createElement("BUTTON");
					var pausBut = document.createElement("BUTTON");
					var stopBut = document.createElement("BUTTON");
					var downloadBut = document.createElement("BUTTON");

					playBut.setAttribute("id", "playbtn");
					pausBut.setAttribute("id", "pausebtn");
					stopBut.setAttribute("id", "stopbtn");
					downloadBut.setAttribute("id", "downloadbut");

					playBut.setAttribute("class", "tripControlbtn");
					pausBut.setAttribute("class", "tripControlbtn");
					stopBut.setAttribute("class", "tripControlbtn");
					downloadBut.setAttribute("class", "tripControlbtn");

					playBut.innerHTML = '<i class="fa fa-play"></i>';
					playBut.title = "Play";
					pausBut.innerHTML = '<i class="fa fa-pause"></i>';
					pausBut.title = "Pause";
					stopBut.innerHTML = '<i class="fa fa-stop"></i>';
					stopBut.title = "Stop";
					downloadBut.innerHTML = '<i class="fa fa-download"></i>';
					downloadBut.title = "Download";

					mapControls.appendChild(playBut);
					mapControls.appendChild(pausBut);
					mapControls.appendChild(stopBut);
					mapControls.appendChild(downloadBut);

					var controlsDiv = document.getElementsByClassName("mapControls");
					controlsDiv[0].style.position = "relative";
					controlsDiv[0].style.border = "1px solid ivory";
					controlsDiv[0].style.borderRadius = "inherit";
					controlsDiv[0].style.backgroundColor = "black";
					controlsDiv[0].style.float = "left";
					controlsDiv[0].style.top = "4px";
					controlsDiv[0].style.marginLeft = "4px";
					controlsDiv[0].style.marginRight = "4px";
					controlsDiv[0].style.zIndex = "5";

					var buttonsDiv = document.getElementsByClassName("tripControlbtn");
					var downloadMap = document.getElementById('downloadbut').style.display = "none";
					for (var i = 0; i < buttonsDiv.length; i++) {
						buttonsDiv[i].style.position = "relative";
						buttonsDiv[i].style.top = "50%";
						buttonsDiv[i].style.float = "left";
						buttonsDiv[i].style.backgroundColor = "DodgerBlue";
						buttonsDiv[i].style.border = "none";
						buttonsDiv[i].style.color = "white";
						buttonsDiv[i].style.padding = "5px 10px";
						buttonsDiv[i].style.margin = "2px";
						buttonsDiv[i].style.fontSize = "16px";
						buttonsDiv[i].style.cursor = "pointer";
						buttonsDiv[i].style.zIndex = "10";
					}

					var speedControllerContainer = document.createElement("div");
					speedControllerContainer.className = 'speedController';
					tripControlsContainer.appendChild(speedControllerContainer);

					var tripControlsContainerStyle = document.getElementsByClassName("speedController");
					tripControlsContainerStyle[0].style.position = 'relative';
					tripControlsContainerStyle[0].style.width = '91px';
					tripControlsContainerStyle[0].style.float = 'left';
					tripControlsContainerStyle[0].style.top = '5px';
					tripControlsContainerStyle[0].style.marginRight = '4px';
					tripControlsContainerStyle[0].style.padding = '4px';
					tripControlsContainerStyle[0].style.border = '1px solid ivory';
					tripControlsContainerStyle[0].style.backgroundColor = 'orangered';
					tripControlsContainerStyle[0].style.borderRadius = '5px';
					tripControlsContainerStyle[0].style.zIndex = '11';

					var speedControllerText = document.createElement('div');
					speedControllerText.className = 'speedControllerText';
					speedControllerText.innerHTML = 'Speed';
					speedControllerContainer.appendChild(speedControllerText);
					var selectOption = document.createElement('select');
					selectOption.className = 'speedControllerDropdown';
					selectOption.onchange = function (evt) {
						var val = evt.target.value;
						delayTimeEvent(val);
					}
					speedControllerContainer.appendChild(selectOption);

					var speedControllerTextStyle = document.getElementsByClassName("speedControllerText");
					speedControllerTextStyle[0].style.position = 'relative';
					speedControllerTextStyle[0].style.float = 'left';
					speedControllerTextStyle[0].style.color = 'white';

					var speedControllerDropdownStyle = document.getElementsByClassName("speedControllerDropdown");
					speedControllerDropdownStyle[0].style.position = 'relative';
					speedControllerDropdownStyle[0].style.float = 'right';

					var optionOne = document.createElement('option');
					optionOne.value = 1;
					optionOne.innerHTML = 'x1';
					selectOption.appendChild(optionOne);

					var optionTwo = document.createElement('option');
					optionTwo.value = 2;
					optionTwo.innerHTML = 'x2';
					selectOption.appendChild(optionTwo);

					var optionThree = document.createElement('option');
					optionThree.value = 3;
					optionThree.innerHTML = 'x3';
					selectOption.appendChild(optionThree);

					var optionFour = document.createElement('option');
					optionFour.value = 4;
					optionFour.innerHTML = 'x4';
					selectOption.appendChild(optionFour);

					var optionFive = document.createElement('option');
					optionFive.value = 5;
					optionFive.innerHTML = 'x5';
					selectOption.appendChild(optionFive);


					var optionSeven = document.createElement('option');
					optionSeven.value = 7;
					optionSeven.innerHTML = 'x7';
					selectOption.appendChild(optionSeven);

					var optionTen = document.createElement('option');
					optionTen.value = 10;
					optionTen.innerHTML = 'x10';
					selectOption.appendChild(optionTen);

					var temp = '3';
					var mySelect = document.getElementsByClassName('speedControllerDropdown');

					for (var i, j = 0; i = mySelect[0].options[j]; j++) {
						if (i.value == temp) {
							// mySelect.selectedIndex = j;
							mySelect[0].options[j].selected = true;
							break;
						}
					}

					var delayContainer = document.createElement("div");
					delayContainer.style.position = "relative";
					delayContainer.style.top = "5px";
					delayContainer.style.float = "right";
					delayContainer.style.padding = "4px";
					delayContainer.style.marginRight = "4px";
					delayContainer.style.backgroundColor = "orangered";
					delayContainer.style.borderRadius = "5px";
					delayContainer.style.border = "1px solid ivory";
					delayContainer.style.zIndex = "11";
					tripControlsContainer.appendChild(delayContainer);

					// From here for delay
					var tripdelayTextDiv = document.createElement('div');
					tripdelayTextDiv.innerHTML = "<b>Delay</b>";
					tripdelayTextDiv.id = "tripdelayTextDiv";
					tripdelayTextDiv.style.position = "relative";
					tripdelayTextDiv.style.float = "left";
					tripdelayTextDiv.style.color = "white";
					delayContainer.appendChild(tripdelayTextDiv);

					var tripdelayDropdown = document.createElement('select');
					tripdelayDropdown.id = "tripdelayDropdown";
					tripdelayDropdown.onchange = tripDelayOnChange;
					tripdelayDropdown.style.marginLeft = "4px";
					tripdelayDropdown.style.position = "relative";
					tripdelayDropdown.style.float = "right";
					delayContainer.appendChild(tripdelayDropdown);
					var trackDelayoption1 = document.createElement('option');
					trackDelayoption1.innerHTML = "none";
					trackDelayoption1.value = "-1";
					tripdelayDropdown.appendChild(trackDelayoption1);
					var trackDelayoption2 = document.createElement('option');
					trackDelayoption2.innerHTML = "10sec";
					trackDelayoption2.value = "10";
					tripdelayDropdown.appendChild(trackDelayoption2);
					var trackDelayoption3 = document.createElement('option');
					trackDelayoption3.innerHTML = "30sec";
					trackDelayoption3.value = "30";
					tripdelayDropdown.appendChild(trackDelayoption3);
					var trackDelayoption4 = document.createElement('option');
					trackDelayoption4.innerHTML = "1 min";
					trackDelayoption4.value = "60";
					tripdelayDropdown.appendChild(trackDelayoption4);
					var trackDelayoption5 = document.createElement('option');
					trackDelayoption5.innerHTML = "2 mins";
					trackDelayoption5.value = "120";
					tripdelayDropdown.appendChild(trackDelayoption5);
					var trackDelayoption6 = document.createElement('option');
					trackDelayoption6.innerHTML = "5 mins";
					trackDelayoption6.value = "300";
					tripdelayDropdown.appendChild(trackDelayoption6);
					var trackDelayoption7 = document.createElement('option');
					trackDelayoption7.innerHTML = ">5 mins";
					trackDelayoption7.value = "1200";
					tripdelayDropdown.appendChild(trackDelayoption7);

					function tripDelayOnChange() {
						var val = document.getElementById("tripdelayDropdown").value;
						console.log("tripdelayDropdown value changed ===> ", val);
						tripTimeDelay = val;
						Trip_global_delay_time = val;
						console.log(uniqueData);
						console.log(track_halt_points111);
						updateTripDetailsOnDelayChange();
					}



					function ArrayChecker(array, value) {
						var hasMatch = false;
						for (var obj of array) {
							if (obj.id == value) {
								hasMatch = true;
								break;
							}
						}
						return hasMatch;
					}

					function updateTripDetailsOnDelayChange() {

						var trackedlinepoints = [];
						track_halt_points111 = [];
						track_halt_points_id = [];
						for (var i = 0; i < data1.length; i++) {
							var lat = parseFloat(data1[i].lat);
							var lon = parseFloat(data1[i].lon);
							//var tempTime = data1[i].time.slice(0, 8);
							//data1[i].time = tempTime;
							//var str = data1.id;//05-02-20
							var str = lon.toString() + lat.toString();


							// console.log("str from API ===> ",str);
							data1[i].id = str;
							data1[i].trip_icon = '';

							//push all
							var nextStart_time = null;
							try {
								nextStart_time = data1[i + 1].time;
							} catch (error) {
								nextStart_time = data1[i].time;
							}


							//	uniqueData.push(data1[i]);

							if (halt_points == true) {

								if (i < data1.length - 1) {
									// if(data1[i].speed < 5){
									var tempTime1 = data1[i + 1].time.slice(0, 8);
									data1[i + 1].time = tempTime1;
									//var tripDiffinSec = time_diffForTripInSec(data1[i].time,data1[i+1].time);
									var tripDiffinSec = time_chk(data1[i].datetime, data1[i + 1].datetime);
									//console.log("Indexing1"+data1[i].location+" - "+data1[i+1].location+":: CHECK DIFF ::", data1[i].time,data1[i+1].time+" FOUND DIFF ", tripDiffinSec);

									console.log("tripDiffinSec ===> ", tripDiffinSec, ">=", tripTimeDelay);

									//if(tripTimeDelay!=-1 && tripTimeDelay >= tripDiffinSec){//05-02-2020
									if (tripTimeDelay != -1 && tripDiffinSec >= tripTimeDelay) {
										console.log("Indexing" + data1[i].location + " - " + data1[i + 1].location + ":: CHECK DIFF ::", data1[i].time, data1[i + 1].time + " FOUND DIFF ", tripDiffinSec);

										if (track_halt_points_id.indexOf(str) == -1) {
											track_halt_points_id.push(str);
											halt_points_indexTemp.push(i);
											var tempTime1 = data1[i + 1].time.slice(0, 8);
											data1[i + 1].time = tempTime1;
											var haltDuration = time_diff(data1[i].time, data1[i + 1].time);
											console.log("haltDuration ===> ", haltDuration);

											//push at this point is wrong as A - B is compared
											//while only one is pushed both has to be pushed
											if (tripDiffinSec >= tripTimeDelay) {
												/* 			track_halt_points111.push({
																lat : data1[i].lat,
																lng : data1[i].lon,
																location : data1[i].location,
																date : data1[i].date,
																startTime : data1[i].time,
																endTime : data1[i+1].time,
																rendering_type : 11,
																haltDuration : haltDuration,
																id : str,
																trip_icon : halt_img
															}); */
											}
										}
										else {
											/* if(track_halt_points111.length>0){
												 track_halt_points111[track_halt_points111.length - 1].endTime = data1[i].time;
											} */
										}
									}
									else {
										console.info('Indexing Show', data1[i].location, data1[i + 1].location + ":: CHECK DIFF ::", data1[i].time, data1[i + 1].time + " FOUND DIFF ", tripDiffinSec);

										var st_point = data1[i].lon.toString() + data1[i].lat.toString();
										var ed_point = data1[i + 1].lon.toString() + data1[i + 1].lat.toString();
										if (st_point && ed_point) {
											trackedlinepoints.push(st_point);
											trackedlinepoints.push(ed_point);
										}
									}
								}
								else {
									//console.log('I : ', i);
								}
							}
							else { }


							track_halt_points111.push({
								lat: data1[i].lat,
								lng: data1[i].lon,
								location: data1[i].location,
								date: data1[i].date,
								startTime: data1[i].time,
								endTime: nextStart_time,
								rendering_type: 11,
								haltDuration: haltDuration,
								id: str,
								trip_icon: halt_img
							});


						}

						if (track_halt_points111.length > 0) {
							for (var k = 0; k < track_halt_points111.length; k++) {
								for (var j = 0; j < trackedlinepoints.length; j++) {
									if (track_halt_points111[k].id == trackedlinepoints[j]) {
										console.log(' match Found Hence pos : ', track_halt_points111[k].location);
										track_halt_points111.splice(k, 1);
									}
									else {
										console.log('! match Found Hence pos : ', track_halt_points111[k].location);
									}
								}
							}
						}
						console.log("Halt =====>", track_halt_points111);
						tripHaltPointsGlobal = track_halt_points111;
						tmpl_trip_layer_display_flag = false;
						if (tmpl_trip_layer_display_flag == false) {
							tmpl_trip_layer_display1.getSource().clear();
							tmpl_trip_layer_display.getSource().clear();
							tmpl_trip_layer_display_flag = true;
							tmpl_trip_layer_display1 = new ol.layer.Vector({
								title: "trip_line_display_layer1",
								source: new ol.source.Vector(),
								style: new ol.style.Style({
									stroke: new ol.style.Stroke({
										color: route_color,
										width: route_style_width
									})
								})
							});
							tmpl_trip_layer_display = new ol.layer.Vector({
								title: "trip_line_display_layer",
								source: new ol.source.Vector(),
								style: new ol.style.Style({
									stroke: new ol.style.Stroke({
										color: route_color,
										width: route_style_width
									})
								})
							});
							tmpl_trip_layer_display1.set("display", "TripLayerDisplay");
							tmpl_trip_layer_display.set("display", "TripLayerDisplay");

							map.addLayer(tmpl_trip_layer_display1);
							map.addLayer(tmpl_trip_layer_display);
						} else {
							tmpl_trip_layer_display1.getSource().clear();
							tmpl_trip_layer_display.getSource().clear();
						}
						gblIndex = 1;
						sendDataToDrawAnimationLineTemp();
						//chk Duplicat latlon
						var lineArray = [];
						var k = 0;

						// for(var k=0;k<uniqueData.length;k++){
						while (k < uniqueData.length) {

							//  if(track_halt_points111.some(el => el.id === uniqueData[k].id)){
							for (var t = 0; t < trackedlinepoints.length; t++) {
								if (uniqueData[k].id == trackedlinepoints[t]) {
									if (lineArray.length <= 2) {
										lineArray.push(uniqueData[k]);
										console.log("uniqueData--------------------------------------------", uniqueData);
										//draw the line 
										if (lineArray.length == 2) {
											console.log('Drawing from Source : ' + lineArray[0].location + ' to Destination : ' + lineArray[1].location);
											var prev = null, next = null, prevSpeed = null;
											prev = [parseFloat(lineArray[0].lon), parseFloat(lineArray[0].lat)];
											prevSpeed = lineArray[0].speed;
											next = [parseFloat(lineArray[1].lon), parseFloat(lineArray[1].lat)];
											// console.log(prev,pres);
											if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps") {
												if (prev && next) {
													prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
													pres = ol.proj.transform(next, 'EPSG:4326', 'EPSG:3857');
													//alert();
													var lineString = new ol.geom.LineString([prev, pres]);
													var feature2 = new ol.Feature({
														geometry: lineString
													});
													//console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>",param);
													if (param.speedLimit) {
														//VR RnD
														if (prevSpeed < 8)
															feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(51, 204, 51)', width: 5 }) }));
														else if (prevSpeed > 8 && prevSpeed <= 20) {
															feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(255, 153, 0)', width: 5 }) }));
														}
														else {
															feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(255, 0, 0)', width: 5 }) }));
														}
													}


													tmpl_trip_layer_display1.getSource().addFeature(feature2);

												}
												else {
													console.log('prev and next was not initialized');
												}
											}
											lineArray = [];
											//lineArray.splice(0, 1);
										}
									}
								}
							}
							/*
							if(ArrayChecker(track_halt_points111,  uniqueData[k].id))
							{
								console.log(" SKIP @ LOC ", uniqueData[k].location);
							}
							else
							{	
								console.log(" UN SKIP @ LOC ", uniqueData[k].location);
								//build p2p line String
				
								if(lineArray.length <= 2)
								{
									lineArray.push(uniqueData[k]);
									//draw the line 
									if(lineArray.length == 2)
									{
										console.log('Drawing from Source : '+lineArray[0].location+' to Destination : '+lineArray[1].location);	
										var prev = null, next=null
										prev = [parseFloat(lineArray[0].lon),parseFloat(lineArray[0].lat)];
										next = [parseFloat(lineArray[1].lon),parseFloat(lineArray[1].lat)];
										// console.log(prev,pres);
										if(appConfigInfo.mapData == "google")
										{
											if(prev && next)
											{
												prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
												pres = ol.proj.transform(next, 'EPSG:4326', 'EPSG:3857');
				
												var lineString = new ol.geom.LineString([prev, pres]);
												var feature2 = new ol.Feature({
													geometry: lineString
												});
												
												tmpl_trip_layer_display1.getSource().addFeature(feature2);
											}
											else{
												console.log('prev and next was not initialized');
											}
										}
										//lineArray = [];
										lineArray.splice(0, 1);
									}
								}
							}
							*/


							/* 
											var prev = [parseFloat(uniqueData[k - 1].lon),parseFloat(uniqueData[k - 1].lat)];
											var pres = [parseFloat(uniqueData[k].lon),parseFloat(uniqueData[k].lat)];
											// console.log(prev,pres);
											if(appConfigInfo.mapData == "google"){
													prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
													pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
											}
											else{
													
											}
											var properties = {
													location : uniqueData[k].location,
													speed : uniqueData[k].speed,
													date : uniqueData[k].date,
													time : uniqueData[k].time,
													lat : uniqueData[k].lat,
													lon : uniqueData[k].lon
												};
							
							
												var lineString = new ol.geom.LineString([prev, pres]);
												var feature2 = new ol.Feature({
													geometry: lineString
												});
												
												feature2.setProperties(properties);
												tmpl_trip_layer_display1.getSource().addFeature(feature2);
							 */

							//drawAnimatedLineTemp(prev, pres, properties);
							//console.log(prev,pres);

							// if(k == uniqueData.length - 1){
							// tmpl.Zoom.toLayer({
							// map : map,
							// layer : "trip_line_display_layer1"
							// });
							// // sendDataToDrawAnimationLineTemp();				
							// }

							k++;
						}

						tmpl_trip_halt_display.getSource().clear();
						if (param.halt_points == true) {
							// if(tmpl_trip_halt_display_flag == false){
							tmpl_trip_halt_display = new ol.layer.Vector({
								title: "trip_halt",
								source: new ol.source.Vector(),
								style: new ol.style.Style({
									image: new ol.style.Icon({
										src: halt_img,
										anchor: [0.5, 1]
									})
								})
							});
							map.addLayer(tmpl_trip_halt_display);
							// }else{
							// tmpl_trip_halt_display.getSource().clear();
							// }

							for (var j = 0; j < track_halt_points111.length; j++) {
								var pres = [parseFloat(track_halt_points111[j].lng), parseFloat(track_halt_points111[j].lat)];
								//console.log(pres);
								if (appConfigInfo.mapData == "google") {
									pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
								}
								else if (appConfigInfo.mapData == "hereMaps") {
									pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
								}
								else {
								}
								//console.log(pres);
								var pointdata = new ol.geom.Point(pres);
								var feature2 = new ol.Feature({
									geometry: pointdata
								});
								feature2.setProperties(track_halt_points111[j]);
								tmpl_trip_halt_display.getSource().addFeature(feature2);
							}
							//console.log(tmpl_trip_halt_display.getSource().getFeatures().length);
						}

					}



					// TABLES
					var infoTableDiv = document.createElement("div");
					infoTableDiv.className = "dataTable";
					infoTableDiv.id = "infoTable";
					// document.body.appendChild(infoTableDiv);
					mapDiv.appendChild(infoTableDiv);
					var infoTableRowsDiv = document.createElement("div");
					infoTableRowsDiv.className = "rows";
					infoTableDiv.appendChild(infoTableRowsDiv);

					infoTableRowsDiv.innerHTML = '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';

					infoTableDiv.style.position = "absolute";
					infoTableDiv.style.top = "20%";
					infoTableDiv.style.right = "10px";
					infoTableDiv.style.width = "20%";
					infoTableDiv.style.zIndex = "4";

					infoTableRowsDiv.style.position = "relative";
					infoTableRowsDiv.style.top = "2px";
					infoTableRowsDiv.style.left = "2px";
					infoTableRowsDiv.style.backgroundColor = "white";
					infoTableRowsDiv.style.opacity = "1";
					infoTableRowsDiv.style.borderRadius = "5px";

					document.getElementById("playbtn").onclick = function () {
						//alert(firstrun);
						if (firstrun) {
							tmpl.Trip.firstplay();
							firstrun = false;
						}
						else {
							tmpl.Trip.play();
						}
						var downloadMap = document.getElementById('downloadbut').style.display = "none";
					}
					document.getElementById("pausebtn").onclick = function () {
						firstrun = false;
						tmpl.Trip.pause();
						var downloadMap = document.getElementById('downloadbut').style.display = "block";
					}
					document.getElementById("stopbtn").onclick = function () {
						firstrun = false;
						tmpl.Trip.stop();
						var downloadMap = document.getElementById('downloadbut').style.display = "block";
					}

					document.getElementById("downloadbut").onclick = function () {

						mapDownload(true);

					}

					document.getElementById("checkresource").onclick = function () {
						var checkStatus = document.getElementById("checkresource").checked;
						if (checkStatus == false) {
							tmpl.Trip.routeVehicle({
								map: map,
								visibility: false
							});
						}
						else {
							tmpl.Trip.routeVehicle({
								map: map,
								visibility: true
							});
						}
					}

					document.getElementById("checkrouteline").onclick = function () {
						var checkStatus = document.getElementById("checkrouteline").checked;
						if (checkStatus == false) {
							tmpl.Trip.routeLayer({
								visibility: false
							});
						}
						else {
							tmpl.Trip.routeLayer({
								visibility: true
							}); //@sh 
						}
					}
					//VR  RnD
					try {
						if (param.deviatedData) {
							document.getElementById('checkdeviatedpoint').disabled = false;
							tmpl.Overlay.create({
								map: param.map,
								features: param.deviatedData,
								layer: 'deviatedRouteLayer',
								layerSwitcher: false
							});
							tmpl.Layer.changeVisibility({
								map: param.map,
								layer: 'deviatedRouteLayer',
								visible: false
							});
							document.getElementById("checkdeviatedpoint").onclick = function () {
								var checkStatus = document.getElementById("checkdeviatedpoint").checked;
								if (checkStatus == false) {
									tmpl.Layer.changeVisibility({
										map: param.map,
										layer: 'deviatedRouteLayer',
										visible: false
									});
									console.log("trip param:", param);
								}
								else {
									tmpl.Layer.changeVisibility({
										map: param.map,
										layer: 'deviatedRouteLayer',
										visible: true
									});
									console.log("trip param:", param);
								}
							}
						}
						else {
							console.log("Deviated Point Layer deviatedData Missing");
							document.getElementById('checkdeviatedpoint').disabled = true;
						}
					} catch (e) {
						console.log("Deviated Point Layer Creation Error..!", e);
					}


					document.getElementById("checkinfobox").onclick = function () {
						var checkStatus = document.getElementById("checkinfobox").checked;
						if (checkStatus == false) {
							document.getElementById("infoTable").style.visibility = "hidden";
						}
						else {
							document.getElementById("infoTable").style.visibility = "visible";
						}
					}

					function delayTimeEvent(val) {
						tmpl.Trip.speed({
							level: val
						});
					}


					var prevLat, prevLon;
					var tempFilterArray = [];
					var uniqueData = [];
					var track_halt_points_id = [], track_halt_points = [], track_halt_points111 = [];
					//console.log(data1);
					for (var i = 0; i < data1.length; i++) {
						var lat = parseFloat(data1[i].lat);
						var lon = parseFloat(data1[i].lon);
						//var tempTime = data1[i].time.slice(0, 8);
						//data1[i].time = tempTime;
						var str = lon.toString() + lat.toString();
						// console.log("str from API ===> ",str);
						data1[i].id = str;
						data1[i].trip_icon = '';

						uniqueData.push(data1[i]);

						if (halt_points == true) {
							if (i < data1.length - 1) {
								// if(data1[i].speed < 5){
								var tempTime1 = data1[i + 1].time.slice(0, 8);
								data1[i + 1].time = tempTime1;
								var tripDiffinSec = time_diffForTripInSec(data1[i].time, data1[i + 1].time);
								// console.log("tripDiffinSec ===> ",tripDiffinSec);
								if (tripTimeDelay != -1 && tripDiffinSec >= tripTimeDelay) {
									// if(tripDiffinSec >= Trip_global_delay_time){
									if (track_halt_points_id.indexOf(str) == -1) {
										track_halt_points_id.push(str);
										halt_points_indexTemp.push(i);
										var tempTime1 = data1[i + 1].time.slice(0, 8);
										data1[i + 1].time = tempTime1;
										var haltDuration = time_diff(data1[i].time, data1[i + 1].time);
										// console.log("haltDuration ===> ",haltDuration);
										track_halt_points111.push({
											lat: data1[i].lat,
											lng: data1[i].lon,
											location: data1[i].location,
											date: data1[i].date,
											startTime: data1[i].time,
											endTime: data1[i + 1].time,
											rendering_type: 11,
											haltDuration: haltDuration,
											id: str,
											trip_icon: halt_img
										});

									} else {
										if (track_halt_points111.length > 0) {
											track_halt_points111[track_halt_points111.length - 1].endTime = data1[i].time;
										}

									}
								}
							}
						}
						else { }
					}

					console.log("TRIP HALT POINTS ====> ", track_halt_points111);
					tripHaltPointsGlobal = [];
					tripHaltPointsGlobal = track_halt_points111;
					// console.log("FINAL uniqueData from API ===> ",JSON.stringify(uniqueData));
					if (halt_points == true) {
						for (var i = 0; i < track_halt_points111.length; i++) {
							var s = time_diff(track_halt_points111[i].startTime, track_halt_points111[i].endTime);
							s = parseInt((s.split(':')[0]) * 60 * 60) + parseInt(s.split(':')[1] * 60) + parseInt(s.split(':')[2]);
							s = parseInt(s);
							//console.log(track_halt_points111[i].startTime,track_halt_points111[i].endTime);
							//console.log("minHaltTime:",minHaltTime,s);
							if (minHaltTime != undefined) {
								if (minHaltTime == 0) {
									halt_points_index = [];
								} else {
									if (s > minHaltTime) {
										//console.log(s,minHaltTime,s > minHaltTime,"valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);

										halt_points_index.push(halt_points_indexTemp[i]);
										track_halt_points.push(track_halt_points111[i]);
									} else {
										//console.log(s,minHaltTime,s > minHaltTime,"in valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);
									}
								}

							} else {
								halt_points_index.push(halt_points_indexTemp[i]);
								track_halt_points.push(track_halt_points111[i]);
							}
						}
					}
					if (halt_points == true) {
						for (var k = 0; k < uniqueData.length; k++) {
							for (l = 0; l < track_halt_points.length; l++) {
								if (uniqueData[k].id == track_halt_points[l].id) {
									uniqueData[k].trip_icon = track_halt_points[l].trip_icon;
								}
							}
						}
					}
					// tripDataForReplyFromDisplay.track_halt_points = track_halt_points;
					// tripDataForReplyFromDisplay.uniqueData = uniqueData;
					//console.log("track_halt_points111 >>",track_halt_points111);
					//tripDataForReplyFromDisplay = uniqueData;
					console.log("tmpl_trip_layer_display_flag==> " + tmpl_trip_layer_display_flag);
					if (tmpl_trip_layer_display_flag == false) {
						tmpl_trip_layer_display_flag = true;
						tmpl_trip_layer_display1 = new ol.layer.Vector({
							title: "trip_line_display_layer1",
							source: new ol.source.Vector(),
							style: new ol.style.Style({
								stroke: new ol.style.Stroke({
									color: route_color,
									width: route_style_width
								})
							})
						});
						tmpl_trip_layer_display = new ol.layer.Vector({
							title: "trip_line_display_layer",
							source: new ol.source.Vector(),
							style: new ol.style.Style({
								stroke: new ol.style.Stroke({
									color: route_color,
									width: route_style_width
								})
							})
						});
						tmpl_trip_layer_display1.set("display", "TripLayerDisplay");
						tmpl_trip_layer_display.set("display", "TripLayerDisplay");

						//map.addLayer(tmpl_trip_layer_display1);
						map.addLayer(tmpl_trip_layer_display);   //@SH Removed to to avoid plot layer
					} else {
						tmpl_trip_layer_display1.getSource().clear();
						tmpl_trip_layer_display.getSource().clear();
					}
					console.log(tmpl_trip_layer_display);
					var gblIndex = 1;
					function sendDataToDrawAnimationLineTemp() {
						var k = gblIndex;

						var prev = [parseFloat(uniqueData[k - 1].lon), parseFloat(uniqueData[k - 1].lat)];
						var pres = [parseFloat(uniqueData[k].lon), parseFloat(uniqueData[k].lat)];

						console.log(prev, pres);
						if (appConfigInfo.mapData == "google") {
							prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
							pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
						} else if (appConfigInfo.mapData == 'hereMaps') {
							prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
							pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
						}
						else { }

						var properties = {
							location: uniqueData[k].location,
							speed: uniqueData[k].speed,
							date: uniqueData[k].date,
							time: uniqueData[k].time,
							lat: uniqueData[k].lat,
							lon: uniqueData[k].lon
						};
						// drawAnimatedLineTemp(prev, pres, properties);			
						gblIndex = gblIndex + 1;
					}
					for (var k = 1; k < uniqueData.length; k++) {
						// console.log("track_halt_points111 before linestring ===> ",track_halt_points111);
						//console.log("uniqueData before linestring ===> ",uniqueData);

						//console.log(track_halt_points111.some(el => el.id === uniqueData[k].id));
						if (track_halt_points111.some(el => el.id === uniqueData[k].id)) {
							console.log("SKIPPING LINE STRING");
						}
						else {
							var prev = [parseFloat(uniqueData[k - 1].lon), parseFloat(uniqueData[k - 1].lat)];
							var pres = [parseFloat(uniqueData[k].lon), parseFloat(uniqueData[k].lat)];
							var prevSpeed = uniqueData[k].speed;
							// console.log(prev,pres);
							if (appConfigInfo.mapData == "google") {
								prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else if (appConfigInfo.mapData == 'hereMaps') {
								prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else {

							}
							var properties = {
								location: uniqueData[k].location,
								speed: uniqueData[k].speed,
								date: uniqueData[k].date,
								time: uniqueData[k].time,
								lat: uniqueData[k].lat,
								lon: uniqueData[k].lon
							};
							//drawAnimatedLineTemp(prev, pres, properties);
							//console.log(prev,pres);

							var lineString = new ol.geom.LineString([prev, pres]);
							var feature2 = new ol.Feature({
								geometry: lineString
							});
							//VR RnD
							//	console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>2",param);
							feature2.setProperties(properties);
							if (param.speedLimit) {
								//VR RnD
								if (prevSpeed < 8)
									feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(51, 204, 51)', width: 5 }) }));
								else if (prevSpeed > 8 && prevSpeed <= 20) {
									feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(255, 153, 0)', width: 5 }) }));
								}
								else {
									feature2.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: 'rgb(255, 0, 0)', width: 5 }) }));
								}
							}
							tmpl_trip_layer_display1.getSource().addFeature(feature2);
							if (k == uniqueData.length - 1) {
								tmpl.Zoom.toLayer({
									map: map,
									layer: "trip_line_display_layer1"
								});
								// sendDataToDrawAnimationLineTemp();				
							}
						}

					}

					function drawAnimatedLineTemp(startPt, endPt, properties) {
						var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
						var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
						var i = 0; var newEndPt;
						ivlDrawTempDisplay = setInterval(function () {
							console.log("steps==>" + trak_animationSteps);
							if (i > trak_animationSteps) {
								clearInterval(ivlDrawTempDisplay);
								if (gblIndex < uniqueData.length) {
									sendDataToDrawAnimationLineTemp();
								} else {
									tmpl_trip_layer_display1.getSource().clear();
								}
								return;
							}
							newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
							var line = new ol.geom.LineString([startPt, newEndPt]);
							var point = new ol.geom.Point(newEndPt);
							var fea = new ol.Feature(line);
							fea.setProperties(properties);
							tmpl_trip_layer_display.getSource().addFeature(fea);
							i++;
						}, 0);
					}


					//console.log("uniqueData[0] >>",uniqueData[0]);
					var properties = {
						location: uniqueData[0].location,
						speed: uniqueData[0].speed,
						date: uniqueData[0].date,
						time: uniqueData[0].time,
						lat: uniqueData[0].lat,
						lon: uniqueData[0].lon
					};
					callbackFunc(properties);
					if (param.halt_points == true) {
						if (tmpl_trip_halt_display_flag == false) {
							tmpl_trip_halt_display_flag = true;
							tmpl_trip_halt_display = new ol.layer.Vector({
								title: "trip_halt",
								source: new ol.source.Vector(),
								style: new ol.style.Style({
									image: new ol.style.Icon({
										src: halt_img,
										anchor: [0.5, 1]
									})
								})
							});
							map.addLayer(tmpl_trip_halt_display);
						} else {
							tmpl_trip_halt_display.getSource().clear();
						}

						for (var j = 0; j < track_halt_points.length; j++) {
							var pres = [parseFloat(track_halt_points[j].lng), parseFloat(track_halt_points[j].lat)];
							//console.log(pres);
							if (appConfigInfo.mapData == "google") {
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else if (appConfigInfo.mapData == 'hereMaps') {
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else {

							}
							//console.log(pres);
							var pointdata = new ol.geom.Point(pres);
							var feature2 = new ol.Feature({
								geometry: pointdata
							});
							feature2.setProperties(track_halt_points[j]);
							tmpl_trip_halt_display.getSource().addFeature(feature2);
						}
						//console.log(tmpl_trip_halt_display.getSource().getFeatures().length);
					}

					if (tmpl_trip_start_display_flag == false) {
						tmpl_trip_start_display_flag = true;
						tmpl_trip_start_display = new ol.layer.Vector({
							source: new ol.source.Vector(),
							title: "trip_start",
							style: new ol.style.Style({
								image: new ol.style.Icon({
									src: start_url,
									anchor: [0.45, 1],
									anchorOrigin: 'top-bottom'
								})
							})
						});
						map.addLayer(tmpl_trip_start_display);
					} else {
						tmpl_trip_start_display.getSource().clear();
					}


					if (tmpl_trip_end_display_flag == false) {
						tmpl_trip_end_display_flag = true;
						tmpl_trip_end_display = new ol.layer.Vector({
							source: new ol.source.Vector(),
							title: "trip_end",
							style: new ol.style.Style({
								image: new ol.style.Icon({
									src: end_url,
									anchor: [0.5, 1]
								})
							})
						});
						map.addLayer(tmpl_trip_end_display);
					} else {
						tmpl_trip_end_display.getSource().clear();
					}

					if (tmpl_trip_vehicle_display_flag == false) {
						tmpl_trip_vehicle_display_flag = true;
						var scale = 1;
						if (vehicle_icon_scale != undefined)
							scale = vehicle_icon_scale;
						tmpl_trip_vehicle_display = new ol.layer.Vector({
							source: new ol.source.Vector(),
							style: new ol.style.Style({
								image: new ol.style.Icon({
									src: img_url,
									scale: scale
								})
							})
						});
						tmpl_trip_vehicle_display.setMap(map);
						console.log("FINAL uniqueData from API ===> ", uniqueData);
						document.getElementById("resourceDiv").innerHTML = uniqueData[0].vehNo;
						document.getElementById("callSignDiv").innerHTML = uniqueData[0].vehType;
						document.getElementById("positionDiv").innerHTML = uniqueData[0].lon + ", " + uniqueData[0].lat;
						document.getElementById("speedDispDiv").innerHTML = uniqueData[0].speed + " km/hr";
						document.getElementById("locationDiv").innerHTML = uniqueData[0].location;
						document.getElementById("dateTimeDIv").innerHTML = uniqueData[0].time;

					} else {
						tmpl_trip_vehicle_display.getSource().clear();
					}

					var end_pos = uniqueData.length - 1;
					var start = [parseFloat(uniqueData[0].lon), parseFloat(uniqueData[0].lat)];
					var end = [parseFloat(uniqueData[end_pos].lon), parseFloat(uniqueData[end_pos].lat)];
					if (appConfigInfo.mapData == "google") {
						start = ol.proj.transform(start, 'EPSG:4326', 'EPSG:3857');
						end = ol.proj.transform(end, 'EPSG:4326', 'EPSG:3857');
					}
					else if (appConfigInfo.mapData == 'hereMaps') {
						start = ol.proj.transform(start, 'EPSG:4326', 'EPSG:3857');
						end = ol.proj.transform(end, 'EPSG:4326', 'EPSG:3857');
					}
					else {

					}
					var pointdata_s = new ol.geom.Point(start);
					var pointdata_e = new ol.geom.Point(end);
					var feature2_s = new ol.Feature({
						geometry: pointdata_s
					});
					var feature2_v = new ol.Feature({
						geometry: pointdata_s
					});
					var feature2_e = new ol.Feature({
						geometry: pointdata_e
					});
					feature2_s.setProperties(uniqueData[0]);
					feature2_s.set('id', 'trip_start');
					feature2_s.set('rendering_type', 12);

					feature2_v.set('rendering_type', 13);
					feature2_v.set('layer_name', 'trip_vehcile_marker');
					feature2_v.setProperties(uniqueData[0]);

					feature2_v.set('id', tripVehicleId);

					feature2_e.setProperties(uniqueData[end_pos]);
					feature2_e.set('rendering_type', 12);
					feature2_e.set('id', 'trip_end');
					tmpl_trip_start_display.getSource().addFeature(feature2_s);
					tmpl_trip_vehicle_display.getSource().addFeature(feature2_v);
					tmpl_trip_end_display.getSource().addFeature(feature2_e);
					if (routeMouseOverDetails == true) {
						var ta_tooltip = document.createElement('tooltip');
						ta_tooltip.id = 'trip-tooltip';
						ta_tooltip.className = 'ol-trip-tooltip';
						var overlay_mouseOver_label = new ol.Overlay({
							element: ta_tooltip,
							offset: [10, 0],
							positioning: 'bottom-left'
						});

						map.addOverlay(overlay_mouseOver_label);
						map.on('pointermove', function (evt) {

							var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
								//if(layer){
								if (feature.get('layer_name') == 'trip_vehcile_marker') {

									return feature;
								}
								//}
							});
							ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
							if (feature_mouseOver) {
								overlay_mouseOver_label.setPosition(evt.coordinate);
								ta_tooltip.innerHTML = label;
							}
						});
					}
					if (returnTableData == true) {
						var callbackFunc = param.TableDataCallBack;
						var data = param.data;
						var grid_data = [];
						var table_data = [];
						var halt_index = 0;
						for (var i = 0; i < data.length; i++) {
							if (halt_points_index.indexOf(i) != -1) {
								table_data[i] = {};
								table_data[i].latitude = data[i].lat;
								table_data[i].longitude = data[i].lon;
								table_data[i].date = data[i].date;
								table_data[i].time = data[i].time;
								table_data[i].location = data[i].location;
								table_data[i].speed = data[i].speed;
								table_data[i].haltInTime = track_halt_points[halt_index].startTime;
								table_data[i].haltOutTime = track_halt_points[halt_index].endTime;
								var s = time_diff(track_halt_points[halt_index].endTime, track_halt_points[halt_index].startTime)
								table_data[i].haltDuration = s;
								halt_index = halt_index + 1;
							} else {
								table_data[i] = {};
								table_data[i].latitude = data[i].lat;
								table_data[i].longitude = data[i].lon;
								table_data[i].date = data[i].date;
								table_data[i].time = data[i].time;
								table_data[i].location = data[i].location;
								table_data[i].speed = data[i].speed;
								table_data[i].haltInTime = '';
								table_data[i].haltOutTime = '';
								table_data[i].haltDuration = '';
							}
						}
						var index = grid_data.length;
						grid_data[index] = {};
						grid_data[index].typemessage = "trip start";
						grid_data[index].latitude = uniqueData[0].lat;
						grid_data[index].longitude = uniqueData[0].lon;
						grid_data[index].date = uniqueData[0].date;
						grid_data[index].time = uniqueData[0].time;
						grid_data[index].haltInTime = 0;
						grid_data[index].haltOutTime = 0;
						grid_data[index].haltDuration = 0;
						grid_data[index].location = uniqueData[0].location;
						index = index + 1;
						for (var i = 0; i < track_halt_points.length; i++) {
							grid_data[index] = {};
							grid_data[index].typemessage = "trip halt";
							grid_data[index].latitude = track_halt_points[i].lat;
							grid_data[index].longitude = track_halt_points[i].lng;
							grid_data[index].date = track_halt_points[i].date;
							grid_data[index].time = track_halt_points[i].startTime;
							grid_data[index].haltInTime = track_halt_points[i].startTime;
							grid_data[index].haltOutTime = track_halt_points[i].endTime;
							var s = time_diff(track_halt_points[i].endTime, track_halt_points[i].startTime);
							grid_data[index].haltDuration = s;
							grid_data[index].location = track_halt_points[i].location;
							index = index + 1;
						}
						grid_data[index] = {};
						grid_data[index].typemessage = "trip end";
						grid_data[index].latitude = uniqueData[uniqueData.length - 1].lat;
						grid_data[index].longitude = uniqueData[uniqueData.length - 1].lon;
						grid_data[index].date = uniqueData[uniqueData.length - 1].date;
						grid_data[index].time = uniqueData[uniqueData.length - 1].time;
						grid_data[index].haltInTime = 0;
						grid_data[index].haltOutTime = 0;
						grid_data[index].haltDuration = 0;
						grid_data[index].location = uniqueData[uniqueData.length - 1].location;
						var result = {};
						result.grid_data = grid_data;
						result.table_data = table_data;
						xxx = result;
						//alert();
						//console.log(result,halt_points_index,track_halt_points);
						callbackFunc(result);
					}
				}
			}
		}
	};


	///////////////////////////////



	function time_diff(t1, t2) {
		var timeStart = new Date("01/01/2007 " + t1).getHours();
		var timeEnd = new Date("01/01/2007 " + t2).getHours();

		// get total seconds between the times
		var delta = Math.abs(new Date("01/01/2007 " + t1) - new Date("01/01/2007 " + t2)) / 1000;

		// calculate (and subtract) whole days
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// calculate (and subtract) whole minutes
		var minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		// what's left is seconds
		var seconds = delta % 60;

		return hours + ":" + minutes + ":" + seconds;
	}

	function time_diffForTripInSec(t1, t2) {
		var timeStart = new Date("01/01/2007 " + t1).getHours();
		var timeEnd = new Date("01/01/2007 " + t2).getHours();

		// get total seconds between the times
		var delta = Math.abs(new Date("01/01/2007 " + t1) - new Date("01/01/2007 " + t2)) / 1000;

		// calculate (and subtract) whole days
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		// calculate (and subtract) whole minutes
		var minutes = Math.floor(delta / 60) % 60;
		delta -= minutes * 60;

		// what's left is seconds
		var seconds = delta % 60;

		var hms = hours + ":" + minutes + ":" + seconds;

		var a = hms.split(':'); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var returnseconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
		return returnseconds;
	}

	function time_chk(t1, t2) {
		console.log("Date1:", t1, "Date1:", t2);
		var date1, date2;
		date1 = new Date(t1);
		date2 = new Date(t2);
		var res = Math.abs(date1 - date2) / 1000;
		// get total days between two dates
		var days = Math.floor(res / 86400);
		// get hours        
		var hours = Math.floor(res / 3600) % 24;
		// get minutes
		var minutes = Math.floor(res / 60) % 60;
		// get seconds
		var seconds = res % 60;

		var hms = hours + ":" + minutes + ":" + seconds;


		var a = hms.split(':'); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

		console.log("returnseconds::::-->", seconds);
		return seconds;
	}

	tmpl.Trip.replay = function () {
		if (tripDataForReplyFromDisplay_flag == true) {
			tripDataForReplyFromDisplay.hideAllLayers = true;
			tmpl.Trip.animation(tripDataForReplyFromDisplay);
			tripDataForReplyFromDisplay_flag = false;
		}
	}
	tmpl.Trip.play = function () {
		// var map = param.map;
		tripDataForReplyFromDisplay_flag = true;
		if (tripDataForReplyFromDisplay_flag == true) {
			// if(map){
			// map.getView().setZoom(15);                
			// }
			tripDataForReplyFromDisplay.hideAllLayers = true;
			tmpl.Trip.animation(tripDataForReplyFromDisplay);
			tripDataForReplyFromDisplay_flag = false;
		} else {
			//console.log(current_status_flag);

		}
	}

	tmpl.Trip.firstplay = function () {
		console.log("I am being called 1");
		// var map = param.map;
		console.log("Trip Play Function-->1", tripDataForReplyFromDisplay);
		tripDataForReplyFromDisplay_flag = true;
		if (tripDataForReplyFromDisplay_flag === true) {
			// if(map){
			// map.getView().setZoom(15);                   
			// }
			tripDataForReplyFromDisplay.hideAllLayers = true;
			console.log("Trip Play Function-->2", tripDataForReplyFromDisplay);
			tmpl.Trip.animation(tripDataForReplyFromDisplay);
			tripDataForReplyFromDisplay_flag = false;
		} else {
			//console.log(current_status_flag);

		}
	}

	function rotate(seg) {
		b_x = 0;
		b_y = 1;
		a_x = seg.x2 - seg.x1;
		a_y = seg.y2 - seg.y1;
		angle_rad = Math.acos((a_x * b_x + a_y * b_y) / Math.sqrt(a_x * a_x + a_y * a_y));
		if (a_x < 0) {
			return 2 * Math.PI - angle_rad;
		} else {
			return angle_rad;
		}
	}
	var firs_delayFlag = false;

	tmpl.Trip.animation = function (param) {
		var previousDistance = 0;
		console.log(param);
		var data1 = param.data;
		var map = param.map;
		var tripVehicleId = param.id;
		uniqueData = [];
		var halt_points = param.halt_points;
		var halt_img;
		var route_color = param.route_color;
		var callbackFunc = param.callbackFunc;
		var routeMouseOverDetails = param.routeMouseOverDetails;
		var hideAllLayers = param.hideAllLayers;
		var vehicle_icon_scale = param.icon_scale;
		var label = param.label;
		var tooltipLocation = param.tooltipLocation;
		var tripEndCallbackFunc = param.tripEndCallbackFunc;
		var noZoom = param.noZoom;
		var directionImgae = param.directionImgae;
		if (label == undefined)
			label = '';
		if (directionImgae == undefined)
			directionImgae = 'https://openlayers.org/en/v4.0.1/examples/data/arrow.png';
		tripAnimation_started = true;
		if (param.routeMouseOverDetails == true) {
			EnableTripToolTip(map, tooltipLocation);
		}

		if (param.halt_points == true) {
			halt_img = param.halt_img;
			temp_store_animation_stop.halt_img = halt_img;
		}
		var img_url = param.img_url;
		temp_store_animation_stop.map = map;
		temp_store_animation_stop.data = data1;
		temp_store_animation_stop.img_url = img_url;
		temp_store_animation_stop.callbackFunc = callbackFunc;
		temp_store_animation_stop.route_color = route_color;
		temp_store_animation_stop.routeMouseOverDetails = routeMouseOverDetails;
		temp_store_animation_stop.halt_points = halt_points;
		temp_store_animation_stop.track_halt_points = param.track_halt_points;
		temp_store_animation_stop.uniqueData = param.uniqueData;
		temp_store_animation_stop.icon_scale = param.icon_scale;
		temp_store_animation_stop.tooltipLocation = param.tooltipLocation;
		temp_store_animation_stop.tripEndCallbackFunc = param.tripEndCallbackFunc;
		temp_store_animation_stop.noZoom = param.noZoom;
		temp_store_animation_stop.directionImgae = param.directionImgae;
		animatebtn(map);
		//console.log("before sort:"+data1.length);
		var prevLat, prevLon;
		var tempFilterArray = [];
		// console.log("DATAAAA ===> ",data1);
		for (var i = 0; i < data1.length; i++) {
			var lat = parseFloat(data1[i].lat);
			var lon = parseFloat(data1[i].lon);
			var tempTime11 = data1[i].time.slice(0, 8);
			data1[i].time = tempTime11;
			var str = lon.toString() + lat.toString();
			if (tempFilterArray.indexOf(str) == -1) {
				tempFilterArray.push(str);
				uniqueData.push(data1[i]);
				// if(tripHaltPointsGlobal.some(el => el.id === data1[i].id)){

				// }
				// else{
				// uniqueData.push(data1[i]);
				// }
			}
			// //console.log(data1[i].speed,data1[i].speed == 0 );
			// if(data1[i].speed == 0){

			// if(track_halt_points_id.indexOf(str) == -1){
			// track_halt_points_id.push(str);
			// track_halt_points.push({
			// lat : data1[i].lat,
			// lng : data1[i].lon,
			// location : data1[i].location,
			// date : data1[i].date,
			// startTime : data1[i].time,
			// endTime : data1[i].time,
			// id : str
			// });
			// }else{
			// track_halt_points[track_halt_points.length - 1].endTime = data1[i].time;
			// }
			// }
		}
		// console.log("Unique data in trip animation ===> ",uniqueData);
		if (noZoom == true) {

		} else {
			tmpl.Zoom.toXYcustomZoom({
				map: map,
				latitude: uniqueData[0].lat,
				longitude: uniqueData[0].lon,
				zoom: 16
			});
		}


		var index = 1;
		var i = index;
		var temp_halt_index = '';
		extraAnimation();
		function panMap(point) {
			var map = this.map;
			var current = point;
			var currentgps = new ol.geom.Point(current);
			var cur_veh = new ol.Feature(currentgps);
			//cur_veh=ol.proj.transform(cur_veh, 'EPSG:4326', 'EPSG:3857');
			var view_port =
				map.getView().calculateExtent(map.getSize());
			var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
			if (vehicle_inside == false) {
				map.getView().setCenter(current);
			}
		}

		function drawAnimatedLine(startPt, endPt, steps, trak_animationSpeed, fn, properties, delay) {
			//console.log(startPt, endPt, steps, trak_animationSpeed, fn,properties,delay);

			
			
			if (trak_animationSpeed < 5) {
				trak_animationSteps = 1
			} else {
				trak_animationSteps = 15;
			}


			if (tripHaltPointsGlobal.some(el => el.id === properties.id)) {

				clearInterval(ivlDraw);
				extraAnimation();
				return;
			}
			else {
				var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
				var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
				var i = 0;
				var prevLayer;
				var newEndPt;

				temp_store_animation_pause = {
					startPt: startPt,
					endPt: endPt,
					steps: trak_animationSteps,
					time: trak_animationSpeed,
					properties: properties,
					delayProperties: delay
				};

				if (callbackFunc != undefined)
					callbackFunc(properties);
				var angle = rotate({
					x1: startPt[0],
					y1: startPt[1],
					x2: endPt[0],
					y2: endPt[1]
				});

				ivlDraw = setInterval(function () {
					// var timestamp = new Date().getTime();
					// var drawTripData = requestAnimationFrame(function (timestamp) {
					// alert();
					if (i > trak_animationSteps) {
						clearInterval(ivlDraw);
						extraAnimation();
						return;
					}
					// Vehicle Animation with Smooth Movement //@sh
					newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
					//newEndPt = endPt ;
					
					// console.log('newEndPt ==> ',newEndPt);
					temp_store_animation_pause.startPt = newEndPt;
					temp_store_animation_pause.steps = temp_store_animation_pause.steps - 1;
					var line = new ol.geom.LineString([startPt, newEndPt]);
					var point = new ol.geom.Point(newEndPt);
					var fea = new ol.Feature(line);
					fea.setProperties(properties);
					//console.log(newEndPt,endPt);



					var line = new ol.geom.LineString([startPt, endPt]);
					var distance = line.getLength();

					var lineJumpCutoff = appConfigInfo.lineJumpCutoff ? appConfigInfo.lineJumpCutoff : 200;

					// Check if the distance is more than 500 meters
					if (distance > lineJumpCutoff) {
						console.log('Distance is more than 200 meters. Line will not be plotted. Distance --> ',distance);
					} else {

					panMap(newEndPt);

					if (newEndPt[0] == endPt[0] && newEndPt[1] == endPt[1]) {
						fea.set('inter', false);
						//console.log(true);
					}
					else {
						fea.set('inter', true);
					}

					var delay_halt_fea = new ol.Feature(point);
					delay_halt_fea.setProperties(properties);
					//delay_halt_fea=ol.proj.transform(delay_halt_fea, 'EPSG:4326', 'EPSG:3857');
					var p_fea = new ol.Feature(point);
					//p_fea=ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
					if (trip_lines_layer_flag == false) {
						trip_lines_layer = new ol.layer.Vector({
							source: new ol.source.Vector({
								features: [fea]
							}),
							//style: styleFunction
							style: new ol.style.Style({
								stroke: new ol.style.Stroke({
									color: route_color,
									width: 6 //@sh increased width from 4 to 6
								})
							})
						});
						trip_lines_layer.set("trip", "TripAnimationLayer");
						trip_lines_layer.setMap(map);
						tmpl_setMap_layer_global.push({
							layer: trip_lines_layer,
							title: 'TripAnimationLayer',
							visibility: true,
							map: map
						});
						//map.addLayer(trip_lines_layer);
						trip_lines_layer_flag = true;
						trip_lines_layer.setVisible(true); //@shhh  Set as true for trip animation line
					} else {

						if (Trip_global_delay_time != -1) {
							//console.log("outside",delay,Trip_global_delay_time);
							delay = parseInt(delay);
							if (delay < Trip_global_delay_time) {
								trip_lines_layer.getSource().addFeature(fea);
								firs_delayFlag = false;
							} else {

								if (firs_delayFlag == false) {
									delay_halt_fea.set('rendering_type', 12);
									tmpl_trip_halt_animation.getSource().addFeature(delay_halt_fea);
									firs_delayFlag = true;
									//console.log("inside",delay,Trip_global_delay_time);
								}
							}
						} else {

							trip_lines_layer.getSource().addFeature(fea);
						}
					}
					if (trip_lines_layer_direction_flag == false) {
						trip_lines_layer_direction = new ol.layer.Vector({
							source: new ol.source.Vector()
						});
						trip_lines_layer_direction.setMap(map);
						tmpl_setMap_layer_global.push({
							layer: trip_lines_layer_direction,
							title: 'TripAnimationLayerDirection',
							visibility: true,
							map: map
						});
						//map.addLayer(trip_lines_layer_direction);
						trip_lines_layer_direction_flag = true;
					} else {
						if (fea.get('inter') == false) {
							var dx = newEndPt[0] - startPt[0];
							var dy = newEndPt[1] - startPt[1];
							var xxx = new ol.geom.LineString([startPt, newEndPt]);
							var curdis = Math.round(xxx.getLength() * 100) / 100;
							previousDistance = previousDistance + curdis;
							var rotation = Math.atan2(dy, dx);
							//console.log(previousDistance);
							if (previousDistance > 600) {
								previousDistance = 0;

								p_fea.setStyle(new ol.style.Style({
									image: new ol.style.Icon({
										src: directionImgae,
										anchor: [0.75, 0.5],
										rotateWithView: true,
										rotation: -rotation
									})
								}));
							} else {
								p_fea.setStyle(new ol.style.Style({
									image: new ol.style.Circle({
										radius: 0,
										fill: new ol.style.Fill({
											color: 'rgba(55, 155, 55, 1)',
										})
									})
								}));
							}
							trip_lines_layer_direction.getSource().addFeature(p_fea);
						}
					}
					if (trip_end_marker_flag == false) {
						var scale = 1;
						if (vehicle_icon_scale != undefined)
							scale = vehicle_icon_scale;
						p_fea.setStyle(new ol.style.Style({
							image: new ol.style.Icon({
								src: img_url,
								rotation: angle,
								scale: scale
							})
						}));
						p_fea.setProperties(properties);
						p_fea.set('rendering_type', 13);
						p_fea.set('id', tripVehicleId);
						p_fea.set('layer_name', 'trip_vehcile_marker');
						trip_end_Marker = new ol.layer.Vector({
							title: 'trip_vehcile_marker',
							source: new ol.source.Vector({
								features: [p_fea]
							})
						});
						trip_end_Marker.setMap(map);

						tmpl_setMap_layer_global.push({
							layer: trip_end_Marker,
							title: 'trip_vehcile_marker',
							visibility: true,
							map: map
						});

						trip_end_marker_flag = true;
					} else {
						//p_fea.setProperties(properties);
						if (trip_end_Marker.getSource().getFeatures().length == 1) {
							trip_end_Marker.getSource().getFeatures()[0].setProperties(properties);
							trip_end_Marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
							if (appConfigInfo.mapData == 'hereMaps') {
								//newEndPt = ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857');
							}
							trip_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);

						}
						else {
							if (appConfigInfo.mapData == 'hereMaps') {
								//p_fea = ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
							}
							trip_end_Marker.getSource().addFeatures([p_fea]);
						}
					}

				}


					i++;
					// })
				}, trak_animationSpeed);
			}

				
			
		}




		function extraAnimation() {
			// if(index == uniqueData.length-1){					
			// removeTripInfoTable();	
			// }
			// console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);

			if (index < uniqueData.length) {
				// console.log("index in extraAnimation ===> ",index);
				i = index;
				//console.log(i);
				// console.log("uniqueData in extraAnimation ===> ",uniqueData);
				// console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);
				// if(tripHaltPointsGlobal.some(el => el.id === uniqueData[i].id)){
				if ($("#infoTable").length > 0) {

					document.getElementById("resourceDiv").innerHTML = uniqueData[i].vehNo;
					document.getElementById("callSignDiv").innerHTML = uniqueData[i].vehType;
					document.getElementById("positionDiv").innerHTML = uniqueData[i].lon + ", " + uniqueData[i].lat;
					document.getElementById("speedDispDiv").innerHTML = uniqueData[i].speed + " km/hr";
					document.getElementById("locationDiv").innerHTML = uniqueData[i].location;
					document.getElementById("dateTimeDIv").innerHTML = uniqueData[i].time;
					var lat = parseFloat(uniqueData[i].lat);
					var plat = parseFloat(uniqueData[i - 1].lat);
					var lon = parseFloat(uniqueData[i].lon);
					var plon = parseFloat(uniqueData[i - 1].lon);

					console.log(' ::::: lat ::::: ',lat);
					console.log(' ::::: lon ::::: ',lon);

					console.log(' ::::: plat ::::: ',plat);
					console.log(' ::::: plon ::::: ',plon);

					console.log(' ::::: Next packet ::::: ');



					var point, p_point, p_point1;
					var s = time_diff(uniqueData[i].time, uniqueData[i - 1].time);
					s = s.split(':')[0] * 60 * 60 + s.split(':')[1] * 60 + s.split(':')[2];
					var delayProperties = s;
					if (appConfigInfo.mapData === "google" || appConfigInfo.mapData === "hereMaps") {
						point = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
						p_point = ol.proj.transform([plon, plat], 'EPSG:4326', 'EPSG:3857');
					}
					else {
						point = [lon, lat];
						p_point = [plon, plat];
					}
					var pointGeom = new ol.geom.Point(p_point);
					var p_feature = new ol.Feature({
						geometry: pointGeom
					});

					if (track_halt_points_id.indexOf(tempFilterArray[i - 1]) != -1) {
						var inin = track_halt_points_id.indexOf(tempFilterArray[i - 1]);
						var plat1 = parseFloat(track_halt_points[inin].lat);
						var plon1 = parseFloat(track_halt_points[inin].lng);
						if (appConfigInfo.mapData === "google" || appConfigInfo.mapData === "hereMaps") {
							p_point1 = ol.proj.transform([plon1, plat1], 'EPSG:4326', 'EPSG:3857');
						} else {
							p_point1 = [plon1, plat1];
						}
						var pointGeom1 = new ol.geom.Point(p_point1);
						var p_feature1 = new ol.Feature({
							geometry: pointGeom1
						});
						p_feature1.setProperties(track_halt_points[inin]);
						//console.log(p_point1);
						if (param.halt_points == true) {

							if (trip_points_layer_flag1 == false) {
								trip_points_layer1 = new ol.layer.Vector({
									source: new ol.source.Vector({
										features: [p_feature1]
									}),
									style: new ol.style.Style({
										image: new ol.style.Icon({
											anchor: [0.5, 1],
											src: halt_img,
											//offset : [0,-5]
										})
									})
								});
								trip_points_layer1.set('title', 'Halt_Layer');
								map.addLayer(trip_points_layer1);
								trip_points_layer_flag1 = true;
							} else {
								//trip_points_layer1.getSource().clear();
								trip_points_layer1.getSource().addFeature(p_feature1);
							}
						}
					}

				}

				var properties = {
					id: uniqueData[i].id,
					location: uniqueData[i].location,
					speed: uniqueData[i].speed,
					date: uniqueData[i].date,
					time: uniqueData[i].time,
					lat: uniqueData[i].lat,
					lon: uniqueData[i].lon
				};
				if (hideAllLayers == true) {
					tmpl_trip_vehicle_display.setVisible(false);
					trip_points_layer1.setVisible(false);
					trip_points_layer.setVisible(false);
					//trip_end_Marker
					//trip_lines_layer.setVisible(false);
				}

				if (i == uniqueData.length - 1) {

				}
				index = index + 1;
				drawAnimatedLine(p_point, point, trak_animationSteps, trak_animationSpeed, function () { }, properties, delayProperties);
				
				// }


			} else {
				//alert("zzz");
				index = index + 1;
				tmpl.Trip.stop();
				if (tripEndCallbackFunc != undefined)
					tripEndCallbackFunc();
			}

		}
		function panMap(point) {
			try {
				var current = point;//[lat,lon];
				var currentgps = new ol.geom.Point(current);
				var cur_veh = new ol.Feature(currentgps);
				var view_port = map.getView().calculateExtent(map.getSize());
				var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
				if (vehicle_inside == false) {
					map.getView().setCenter(current);
				}
			} catch (e) {
				console.log("!Error......");
			}
		}


		function animatebtn(map) {
			try {
				var current_status_flag = "start";

				tmpl.Trip.pause = function () {
					if (current_status_flag == "none") {

					} else if (current_status_flag == "start") {
						clearInterval(ivlDraw);
						current_status_flag = "pause";
					} else if (current_status_flag == "pause") {

					} else if (current_status_flag == "stop") {

					}
				}
				tmpl.Trip.play = function () {
					firstrun = false;
					console.log("I am being called 2");
					if (tripDataForReplyFromDisplay_flag == true) {
						tripDataForReplyFromDisplay.hideAllLayers = true;
						tmpl.Trip.animation(tripDataForReplyFromDisplay);
						//tmpl.Trip.display(tripDataForReplyFromDisplay);
						tripDataForReplyFromDisplay_flag = false;
					} else {

						//console.log(current_status_flag);
						if (current_status_flag == "none") {
							//tmpl.Trip.clear({map : temp_store_animation_stop.map});
							tmpl.Trip.stopClear({ map: temp_store_animation_stop.map });
							tmpl.Trip.animation(temp_store_animation_stop);
						} else if (current_status_flag == "start") {

						} else if (current_status_flag == "pause") {
							drawAnimatedLine(temp_store_animation_pause.startPt, temp_store_animation_pause.endPt, temp_store_animation_pause.steps, temp_store_animation_pause.time, function () { }, temp_store_animation_pause.properties, temp_store_animation_pause.delayProperties);
						} else if (current_status_flag == "stop") {

							//tmpl.Trip.clear({map : temp_store_animation_stop.map});
							tmpl.Trip.stopClear({ map: temp_store_animation_stop.map });
							tmpl.Trip.animation(temp_store_animation_stop);
						}
						current_status_flag = "start";
					}
				}

				tmpl.Trip.stop = function (param) {

					if (current_status_flag == "none") {

					} else if (current_status_flag == "start") {
						clearInterval(ivlDraw);
						current_status_flag = "stop";
					} else if (current_status_flag == "pause") {
						clearInterval(ivlDraw);
						current_status_flag = "stop";
					} else if (current_status_flag == "stop") {

					}
				}
				var animationSpeedLevel = 3;
				tmpl.Trip.speedInc = function () {
					var level = animationSpeedLevel + 1;
					console.log("SPEED LEVEL FROM speedInc API ====>", level);
					if (level >= 5) {
						animationSpeedLevel = 5;
						trak_animationSpeed = 30;
					} else if (level == '4' || level == 4) {
						trak_animationSpeed = 50;
					} else if (level == '3' || level == 3) {
						trak_animationSpeed = 100;
					} else if (level == '2' || level == 2) {
						trak_animationSpeed = 250;
					} else if (level == '1' || level == 1) {
						trak_animationSpeed = 450;
					}
				}
				tmpl.Trip.speedDec = function () {
					var level = animationSpeedLevel - 1;
					console.log("SPEED LEVEL FROM speedDec API ====>", level);
					if (level == '5' || level == 5) {
						trak_animationSpeed = 30;
					} else if (level == '4' || level == 4) {
						trak_animationSpeed = 50;
					} else if (level == '3' || level == 3) {
						trak_animationSpeed = 100;
					} else if (level == '2' || level == 2) {
						trak_animationSpeed = 250;
					} else if (level <= 1) {
						trak_animationSpeed = 450;
						animationSpeedLevel = 1;
					}
				}
				tmpl.Trip.speed = function (param) {
					//tmpl.Trip.pause();
					var level = param.level;
					if (level == '10' || level == 10) {
						trak_animationSpeed = 5;
					} else if (level == '7' || level == 7) {
						trak_animationSpeed = 15;
					} else if (level == '5' || level == 5) {
						trak_animationSpeed = 30;
					} else if (level == '4' || level == 4) {
						trak_animationSpeed = 50;
					} else if (level == '3' || level == 3) {
						trak_animationSpeed = 100;
					} else if (level == '2' || level == 2) {
						trak_animationSpeed = 250;
					} else if (level == '1' || level == 1) {
						trak_animationSpeed = 450;
					}
					//console.log(trak_animationSpeed);
				}
			} catch (err) {
				console.warn("API EC Code: TRPG0091_BTN" + err);
			}
		}
	}

	function DisableTripToolTip(map) {
		map.un('pointermove', mouseHoverDetails);
	}
	var gbl_trip_clear_tooltip;
	function EnableTripToolTip(map, loc) {
		//if(mouseHoverDetails != undefined)
		//DisableTripToolTip(map);

		var ta_tooltip = document.createElement('tooltip');
		ta_tooltip.id = 'trip-tooltip';
		ta_tooltip.className = 'ol-trip-tooltip';
		var overlay_mouseOver_trip = new ol.Overlay({
			element: ta_tooltip,
			offset: [10, 0],
			positioning: 'bottom-left'
		});
		map.addOverlay(overlay_mouseOver_trip);

		this.map = map;

		mouseHoverDetails = function (evt) {

			var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

				if (layer) {
					if (layer.get('trip') == "TripAnimationLayer" || layer.get('display') == "TripLayerDisplay") {
						return feature;
					}
				} else {
					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						if (tmpl_setMap_layer_global[i].title == 'TripAnimationLayer') {
							break;
							return feature;
						}
					}
				}

			});
			gbl_trip_clear_tooltip = ta_tooltip;
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			if (feature_mouseOver) {
				//console.log("feature_mouseOver >>",feature_mouseOver.getProperties());
				overlay_mouseOver_trip.setPosition(evt.coordinate);
				if (loc == false) {
					if (feature_mouseOver.getProperties().speed == undefined) {
						//console.log("From API - speed is undefined, replaced with empty string");
						feature_mouseOver.getProperties().speed = '';
					}
					ta_tooltip.innerHTML = "Speed:" + feature_mouseOver.getProperties().speed + "Km/h," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
				} else {
					if (feature_mouseOver.getProperties().speed == undefined) {
						//console.log("From API - speed is undefined, replaced with empty string");
						feature_mouseOver.getProperties().speed = '';
					}
					ta_tooltip.innerHTML = feature_mouseOver.getProperties().location + "," + "Speed:" + feature_mouseOver.getProperties().speed + "Km/h," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
				}
			}
		};
		map.on('pointermove', mouseHoverDetails);

	}

	function removeTripInfoTable() {
		Element.prototype.remove = function () {
			this.parentElement.removeChild(this);
		}
		NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
			for (var i = this.length - 1; i >= 0; i--) {
				if (this[i] && this[i].parentElement) {
					this[i].parentElement.removeChild(this[i]);
				}
			}
		}
		var infoTable = document.getElementById("infoTable");
		if (infoTable) {
			infoTable.remove();
		}
		else { }
	}


	function TripPoints(map) {
		var featureArray = [];
		var point;
		for (var i = 0; i < uniqueData.length; i++) {
			var lat = parseFloat(uniqueData[i].lat);
			var lon = parseFloat(uniqueData[i].lon);
			if (appConfigInfo.mapData === "google") {
				point = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
			} else {
				point = [lon, lat];
			}
			var pointGeom = new ol.geom.Point(point);
			var feature = new ol.Feature({
				geometry: pointGeom
			});
			featureArray.push(feature);
		}
		if (trip_points_layer_flag == false) {
			trip_points_layer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: featureArray
				})
			});
			map.addLayer(trip_points_layer);
			trip_points_layer_flag = true;
		} else {
			trip_points_layer.getSource().clear();
			trip_points_layer.getSource().addFeatures(featureArray);
		}
	}


	tmpl.Feature.getLatLong = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var latlon;
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == id) {
							if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
								latlon = feature.getGeometry().getCoordinates();
								latlon = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326')

							}
							else {
								latlon = feature.getGeometry().getCoordinates();
							}
						}
					});
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {

					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.get('id') == id) {

							if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
								latlon = feature.getGeometry().getCoordinates();
								latlon = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326')

							}
							else {
								latlon = feature.getGeometry().getCoordinates();
							}
						}
					});
				}

			}

		}
		return latlon;
	}



}).call(this, {});  //@BK


function createContextMenu(mapObj, menu_items) {
	contextmenuobj = new ContextMenu({
		width: 170,
		default_items: false, //default_items are (for now) Zoom In/Zoom Out
		items: menu_items
	});
	mapObj.addControl(contextmenuobj);
	return contextmenuobj;
}

function addMenu(add_menu) {
	contextmenuobj.extend(add_menu);
}

function clearMenu() {
	contextmenuobj.clear();
}

function closeMenu() {
	contextmenuobj.close();
}

function mapToCenter(mapObj, obj) {
	var view = mapObj.getView();
	view.setCenter(obj.coordinate);
}

function getFeatureOnMenuOpen(mapObj, myCallBack) {

	contextmenuobj.on('open', function (evt) {
		var layer;
		var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (ft, lay) {
			layer = lay;
			return ft;

		});

		var result;
		if (feature != undefined) {

			if (layer == null) {

				result = {
					layerName: feature.get('layer_name'),
					featureId: feature.get('id'),
					properties: feature.getProperties()
				};
			} else {

				result = {
					layerName: layer.get('title'),
					featureId: feature.get('id'),
					properties: feature.getProperties()
				};
			}

		} else {

			result = {
				layerName: undefined,
				featureId: ''

			};

		}
		myCallBack(result);
	});
}

tmpl.Create.circle = function (param) {
	var mapObj = param.map;
	var latlon = param.latlon;
	var rdus = param.radius;
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;
	var mycallback = param.callbackFunc;

	var wgs84Sphere = new ol.Sphere(6378137);
	var format = new ol.format.WKT();
	var featureArray = [], featureJson = [], resultArray = [], featureId = [];
	var circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, circleExtent, wktBufferGeom, style;
	var noLayer = false;
	var existingLayer;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (i = 0; i < length; i++) {
		var tempLayer = Layers.item(i);
		if (tempLayer.get('lname') == 'circleLayer') {
			noLayer = true;
			existingLayer = tempLayer;
			existingLayer.getSource().clear();
		}
	}
	if (!noLayer) {
		circleLayer = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		circleLayer.setProperties({ lname: "circleLayer" });
		circleLayer.set('title', 'circleLayer');
		mapObj.addLayer(circleLayer);
		existingLayer = circleLayer;
	}
	if (strokeColor && fillColor) {
		style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: 1
			}),
			fill: new ol.style.Fill({
				color: fillColor
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: 'rgba(55, 155, 55, 0.5)',
				})
			})
		});
	} else {
		style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgb(255,0,0)',
				width: 1
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255,0,0,0.2)'
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: 'rgba(55, 155, 55, 0.5)',
				})
			})
		});
	}
	if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
		//lonlatConvrtd=lonlat;//ol.proj.transform([lonlat[0],lonlat[1] ], 'EPSG:3857', 'EPSG:4326'); 
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
		circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setStyle(style);
		existingLayer.getSource().addFeature(circleFeature);
		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		// var modify = new ol.interaction.Modify({source: new ol.source.Vector()});			
		// map.addInteraction(modify);
	}
	else {
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
		circle3857 = circle4326;
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setStyle(style);
		existingLayer.getSource().addFeature(circleFeature);
		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry;
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
	}
	mycallback(wktBufferGeom);
	//  mapObj.addControl(new ol.control.LayerSwitcher());
}



///polygon layer

tmpl.Create.polygon = function (param) {

	var mapObj = param.map;
	var lyrname = param.layer;
	var jsonobj = param.features;
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;
	//var width = param.width;
	var format = new ol.format.WKT();
	var drawStyle;
	var getdata = jsonobj;
	if (jsonobj) {
		try { }
		catch (e) {
			return false;
		}
	}
	if (getdata.length == 0) {
		return false;
	}
	var noLayer = false;
	var existingLayer;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (i = 0; i < length; i++) {
		var tempLayer = Layers.item(i);
		if (tempLayer.get('title') == lyrname) {
			noLayer = true;
			existingLayer = tempLayer;
			// existingLayer.getSource().clear();
		}
	}
	if (!noLayer) {
		ovrlayPolygon = new ol.layer.Vector({
			title: lyrname,
			visible: true,
			source: new ol.source.Vector()
		});
		ovrlayPolygon.setProperties({ lname: lyrname });

		mapObj.addLayer(ovrlayPolygon);
		existingLayer = ovrlayPolygon;
	}
	var featureDataAry = [];
	if (strokeColor != null && fillColor != null) {
		drawStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: 1
			}),
			fill: new ol.style.Fill({
				color: fillColor
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: 'rgba(55, 155, 55, 0.5)',
				})
			}),
			text: new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
				textAlign: 'center',
				text: '',
				offsetX: 0,
				offsetY: 0,
				fill: new ol.style.Fill({
					color: fillColor,
					width: 20
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: 8
				})
			})
		});
	} else {
		drawStyle = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(255, 0, 0, 0.2)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0,0,0,0.5)',//clor,//'#ffcc33',
				width: 1
			}),
			image: new ol.style.Circle({
				radius: 1,
				fill: new ol.style.Fill({
					color: 'rgba(155,150,100,0.5)'//clor// '#DC143C'//'#ffcc33'
				})
			}),
			text: new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
				textAlign: 'center',
				text: '',
				offsetX: 0,
				offsetY: 0,
				fill: new ol.style.Fill({
					color: 'red',
					width: 20
				}),
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 8
				})
			})
		});
	}
	for (var i = 0, length = getdata.length; i < length; i++) {
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			console.log("getdata[i].geometry", getdata[i].geometry);
			console.log("getdata.geometry", getdata.geometry);
			var feature = format.readFeature(getdata[i].geometry);
			console.log("feature===:", feature);
			feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
			feature.getGeometry();
			//console.log("feature.getProperties() :",feature.getProperties());
			feature.setProperties(getdata[i].properties);
			feature.setProperties({ id: getdata[i].id });
			feature.setStyle(drawStyle);
			featureDataAry.push(feature);
		}
		else {
			var feature = format.readFeature(getdata[i].geometry);
			feature.getGeometry();
			feature.setStyle(drawStyle);
			feature.setProperties(getdata[i].properties);
			feature.setProperties({ id: getdata[i].id });
			featureDataAry.push(feature);
		}
	}
	existingLayer.getSource().addFeatures(featureDataAry);
	//  mapObj.addControl(new ol.control.LayerSwitcher());
	return true;
}

function clustering(mapObj) {

	var distance = document.getElementById('distance');

	var count = 20000;
	var features = new Array(count);
	var e = 4500000;
	for (var i = 0; i < count; ++i) {
		var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
		features[i] = new ol.Feature(new ol.geom.Point(coordinates));
	}
	var source = new ol.source.Vector({
		features: features
	});

	var clusterSource = new ol.source.Cluster({
		distance: parseInt(distance.value, 10),
		source: source
	});
	var styleCache = {};
	var clusters = new ol.layer.Vector({
		source: clusterSource,
		style: function (feature) {
			var size = feature.get('features').length;
			//alert(size);
			var style = styleCache[size];
			if (!style) {
				style = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: '#fff'
						}),
						fill: new ol.style.Fill({
							color: '#3399CC'
						})
					}),
					text: new ol.style.Text({
						text: size.toString(),
						fill: new ol.style.Fill({
							color: '#fff'
						})
					})
				});
				styleCache[size] = style;
			}
			return style;
		}
	});

	mapObj.addLayer(clusters);

	/*distance.addEventListener('input', function() {
		   alert(distance.value);
	 clusterSource.setDistance(parseInt(distance.value, 10));   
   });*/
}


tmpl.Fence.clear = function (param) {
	var mapObj = param.map;
	// alert("Fence clear API");
	tmpl.Fence.removeInteraction({ map: mapObj });
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('lname') === 'fencevector') {
				mapObj.removeLayer(existingLayer);
			}
		}
	}
}

var gbl_routeIds = [];
var gbl_route_edit_data = [];
tmpl.Route.add = function (param) {

	var mapObj = param.map;
	var datas = param.feature;
	var layerName = param.layerName;
	var width = param.width;


	var noLayer, routeLine, sourcePoint, destinationPoint, sourceIcon, destinationIcon, cordStart, cordEnd, sourceMarker, destinationMarker, sourceStyle, destinationStyle, wayPoint;
	var wayPointLatLon, feture_waypoint, globalwaypointStyle, feature;
	var fature_waypoint_Array = [], wayPointId = [];

	var format = new ol.format.WKT();

	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer.get('lname') === layerName) {
			noLayer = true;
			routeLayer = existingLayer;
		}
	}
	if (!noLayer) {
		routeLayer = new ol.layer.Vector({
			source: new ol.source.Vector()//,
			// style: new ol.style.Style({
			// stroke: new ol.style.Stroke({
			// color: 'red',
			// width: 6
			// })
			// })
		});
		routeLayer.setProperties({ lname: layerName });
		routeLayer.setProperties({ title: layerName });
		mapObj.addLayer(routeLayer);
	}

	for (var i = 0; i < datas.length; i++) {
		wayPointId = [];
		routeLine = datas[i].geometry;
		/*sourcePoint = [parseFloat(datas[i].source.lon) ,parseFloat(datas[i].source.lat)];
		console.log("sourcePoint :",sourcePoint);*/
		var sourcePointArray = datas[i].source.geometry;
		/*var ts = sourcePointArray.split("POINT(")[1];
		ts = ts.split(')')[0];
		ts = ts.split(' ');
		var lats = parseFloat(ts[1]);
		var lons = parseFloat(ts[0]);*/
		var p1 = sourcePointArray.split('(');
		var p2 = p1[1].split(')');
		var p3 = p2[0].split(' ');
		var lats = parseFloat(p3[1]);
		var lons = parseFloat(p3[0]);
		sourcePoint = [lons, lats];
		//console.log("sourcePoint :",sourcePoint);
		var destinationPointArray = datas[i].destination.geometry;
		/*var td = destinationPointArray.split("POINT(")[1];
		td = td.split(')')[0];
		td = td.split(' ');
		var latd = parseFloat(td[1]);
		var lond = parseFloat(td[0]);*/
		var p1d = destinationPointArray.split('(');
		var p2d = p1d[1].split(')');
		var p3d = p2d[0].split(' ');
		var latd = parseFloat(p3d[1]);
		var lond = parseFloat(p3d[0]);
		destinationPoint = [lond, latd];
		//console.log("destinationPoint :",destinationPoint);
		//destinationPoint = [parseFloat(datas[i].destination.lon) , parseFloat(datas[i].destination.lat)];
		sourceIcon = datas[i].source.image;
		destinationIcon = datas[i].destination.image;
		wayPoint = datas[i].waypoints;
		//		console.log("wayPoint >>",wayPoint);	
		wayPointId.push(datas[i].source.id);
		wayPointId.push(datas[i].destination.id);
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		}
		else {
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		}
		//feature.setProperties({'id':datas[i].id});

		var featureStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: datas[i].route_color,
				width: width
			})
		});
		feature.setStyle(featureStyle);

		var keyNames = Object.keys(datas[i]);
		for (var name = 0; name < keyNames.length; name++) {
			if (keyNames[name] == "geometry") {
			} else {
				var value = datas[i][keyNames[name]];
				var x = keyNames[name]
				feature.set('' + x + '', '' + value + '');
			}
		}

		cordStart = ol.proj.transform(sourcePoint, 'EPSG:4326', 'EPSG:3857');
		cordEnd = ol.proj.transform(destinationPoint, 'EPSG:4326', 'EPSG:3857');
		sourceMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordStart)
		});
		sourceStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: sourceIcon
			})
		});
		sourceMarker.setStyle(sourceStyle);
		//sourceMarker.setProperties({'id':datas[i].source.id});

		var keyNames1 = Object.keys(datas[i].source);
		for (var name = 0; name < keyNames1.length; name++) {
			if (keyNames1[name] == "geometry") {
			} else {
				var value = datas[i].source[keyNames1[name]];
				var x = keyNames1[name]
				sourceMarker.set('' + x + '', '' + value + '');
			}
		}


		destinationMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordEnd)
		});
		destinationStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: destinationIcon
			})
		});
		destinationMarker.setStyle(destinationStyle);
		//destinationMarker.setProperties({'id':datas[i].destination.id});

		var keyNames2 = Object.keys(datas[i].destination);
		for (var name = 0; name < keyNames2.length; name++) {
			if (keyNames2[name] == "geometry") {
			} else {
				var value = datas[i].destination[keyNames2[name]];
				var x = keyNames2[name]
				destinationMarker.set('' + x + '', '' + value + '');
			}
		}

		for (var j = 0; j < wayPoint.length; j++) {
			var wayPointArray = wayPoint[j].geometry;
			/*var tw = wayPointArray.split("POINT(")[1];
			tw = tw.split(')')[0];
			tw = tw.split(' ');
			var latw = parseFloat(tw[1]);
			var lonw = parseFloat(tw[0]);*/
			var p1w = wayPointArray.split('(');
			var p2w = p1w[1].split(')');
			var p3w = p2w[0].split(' ');
			var latw = parseFloat(p3w[1]);
			var lonw = parseFloat(p3w[0]);
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
				wayPointLatLon = ol.proj.transform([lonw, latw], 'EPSG:4326', 'EPSG:3857');
			} else {
				wayPointLatLon = [lonw, latw];
			}
			/*if (appConfigInfo.mapData == "google") {
					wayPointLatLon = ol.proj.transform([parseFloat(wayPoint[j].lon), parseFloat(wayPoint[j].lat)], 'EPSG:4326', 'EPSG:3857');
			} else {
				  wayPointLatLon = [parseFloat(wayPoint[j].lon), parseFloat(wayPoint[j].lat)];
			}*/
			feture_waypoint = new ol.Feature({
				geometry: new ol.geom.Point(wayPointLatLon)
			});
			globalwaypointStyle = new ol.style.Style({
				image: new ol.style.Icon({
					src: wayPoint[j].image,
				})
			});
			feture_waypoint.setStyle(globalwaypointStyle);
			// feture_waypoint.setProperties({'id':wayPoint[j].id});

			var keyNames3 = Object.keys(wayPoint[j]);
			for (var name = 0; name < keyNames3.length; name++) {
				if (keyNames3[name] == "geometry") {
				} else {
					var value = wayPoint[j][keyNames3[name]];
					var x = keyNames3[name]
					feture_waypoint.set('' + x + '', '' + value + '');
				}
			}


			routeLayer.getSource().addFeature(feture_waypoint);
			wayPointId.push(wayPoint[j].id);
		}
		routeLayer.getSource().addFeature(sourceMarker);
		routeLayer.getSource().addFeature(destinationMarker);
		routeLayer.getSource().addFeature(feature);

		var rec = { routeId: datas[i].id, pointsId: wayPointId };
		gbl_routeIds.push(rec);
	}
	console.log("gbl_routeIds :", gbl_routeIds);
}


var gbl_routeIdsOnClick = [];

tmpl.Route.addOnClickRoute = function (param) {

	var mapObj = param.map;
	var datas = param.feature;
	var layerName = param.layerName;

	var noLayer, routeLine, sourcePoint, destinationPoint, sourceIcon, destinationIcon, cordStart, cordEnd, sourceMarker, destinationMarker, sourceStyle, destinationStyle, wayPoint;
	var wayPointLatLon, feture_waypoint, globalwaypointStyle, feature, featureBuffern, bufferLine;
	var fature_waypoint_Array = [], wayPointId = [];

	var format = new ol.format.WKT();

	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer.get('lname') === layerName) {
			noLayer = true;
			routeLayer = existingLayer;
		}
	}
	if (!noLayer) {
		routeLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 6
				})
			})
		});
		routeLayer.setProperties({ lname: layerName });
		routeLayer.setProperties({ title: layerName });
		mapObj.addLayer(routeLayer);
	}

	for (var i = 0; i < datas.length; i++) {
		wayPointId = [];
		routeLine = datas[i].geometry;
		bufferLine = datas[i].buffer;

		if (appConfigInfo.mapData == 'google') {
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
				rname: 'route',
				routeid: datas[i].id
			});
			featureBuffer = format.readFeature(bufferLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		}
		else {
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326',
				rname: 'route',
				routeid: datas[i].id
			});
			featureBuffer = format.readFeature(bufferLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		}

		var sourcePoint1 = feature.getGeometry().getFirstCoordinate();
		sourcePoint = ol.proj.transform(sourcePoint1, 'EPSG:3857', 'EPSG:4326');
		var destinationPoint1 = feature.getGeometry().getLastCoordinate();
		destinationPoint = ol.proj.transform(destinationPoint1, 'EPSG:3857', 'EPSG:4326');

		sourceIcon = datas[i].source_image;
		destinationIcon = datas[i].destination_image;

		cordStart = sourcePoint1;// ol.proj.transform(sourcePoint, 'EPSG:4326', 'EPSG:3857');
		cordEnd = destinationPoint1;//ol.proj.transform(destinationPoint, 'EPSG:4326', 'EPSG:3857');
		sourceMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordStart),
			rname: 'source',
			routeid: datas[i].id
		});
		sourceStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: sourceIcon
			})
		});
		sourceMarker.setStyle(sourceStyle);

		destinationMarker = new ol.Feature({
			geometry: new ol.geom.Point(cordEnd),
			rname: 'destination',
			routeid: datas[i].id
		});
		destinationStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: destinationIcon
			})
		});
		destinationMarker.setStyle(destinationStyle);

		var keyNames = Object.keys(datas[i]);
		for (var name = 0; name < keyNames.length; name++) {
			if (keyNames[name] == "geometry") {
			} else {
				var value = datas[i][keyNames[name]];
				var x = keyNames[name]
				feature.set('' + x + '', '' + value + '');
				featureBuffer.set('' + x + '', '' + value + '');
				sourceMarker.set('' + x + '', '' + value + '');
				destinationMarker.set('' + x + '', '' + value + '');
			}
		}

		routeLayer.getSource().addFeature(sourceMarker);
		routeLayer.getSource().addFeature(destinationMarker);
		routeLayer.getSource().addFeature(feature);
		routeLayer.getSource().addFeature(featureBuffer);

		gbl_route_edit_data[i] = {};
		gbl_route_edit_data[i].source = cordStart;
		gbl_route_edit_data[i].destination = cordEnd;
		gbl_route_edit_data[i].layerName = layerName;
		gbl_route_edit_data[i].routeLayer = routeLayer;
		gbl_route_edit_data[i].id = datas[i].id;

		var rec = { routeId: datas[i].id };
		gbl_routeIdsOnClick.push(rec);
	}
	//console.log("gbl_routeIdsOnClick :",gbl_routeIdsOnClick);
}

tmpl.Route.editOnClickRoute = function (param) {
	var map1 = param.map;
	var routeId = param.routeId;
	var editId;
	var routeLayer;
	var layerName;
	for (var i = 0; i < gbl_route_edit_data.length; i++) {
		if (gbl_route_edit_data[i].id == routeId) {
			editId = routeId;
			routeLayer = gbl_route_edit_data[i].routeLayer;
			layerName = gbl_route_edit_data[i].layerName;
		}
	}
	window.app = {};
	var app = window.app;
	var format = new ol.format.WKT();
	app.Drag = function () {
		ol.interaction.Pointer.call(this, {
			handleDownEvent: app.Drag.prototype.handleDownEvent,
			handleDragEvent: app.Drag.prototype.handleDragEvent,
			handleMoveEvent: app.Drag.prototype.handleMoveEvent,
			handleUpEvent: app.Drag.prototype.handleUpEvent
		});
		this.coordinate_ = null;
		this.cursor_ = 'pointer';
		this.feature_ = null;
		this.previousCursor_ = undefined;
	};
	ol.inherits(app.Drag, ol.interaction.Pointer);

	app.Drag.prototype.handleDownEvent = function (evt) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function (feature, layer) {

				if (layer.get('title') == layerName) {
					if (feature.get('rname') == 'source' || feature.get('rname') == 'destination') {
						if (feature.get('routeid') == editId)
							return feature;
					}
				}

			});

		if (feature) {
			this.coordinate_ = evt.coordinate;
			this.feature_ = feature;
		}
		return !!feature;
	};

	app.Drag.prototype.handleDragEvent = function (evt) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function (feature, layer) {
				return feature;
			});
		var deltaX = evt.coordinate[0] - this.coordinate_[0];
		var deltaY = evt.coordinate[1] - this.coordinate_[1];
		var geometry =
			(this.feature_.getGeometry());
		geometry.translate(deltaX, deltaY);
		this.coordinate_[0] = evt.coordinate[0];
		this.coordinate_[1] = evt.coordinate[1];
	};

	app.Drag.prototype.handleMoveEvent = function (evt) {
		if (this.cursor_) {
			var map = evt.map;
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function (feature, layer) {
					return feature;
				});
			var element = evt.map.getTargetElement();
			if (feature) {
				editFeature = feature;
				point = feature.getGeometry().getCoordinates();
				var point;
				if (appConfigInfo.mapData === 'google') {
					point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
				}
				else {
					// do notng
				}
				//point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
				if (element.style.cursor != this.cursor_) {
					this.previousCursor_ = element.style.cursor;
					element.style.cursor = this.cursor_;
				}
			} else if (this.previousCursor_ !== undefined) {
				element.style.cursor = this.previousCursor_;
				this.previousCursor_ = undefined;
			}
		}
	};

	app.Drag.prototype.handleUpEvent = function (evt) {
		var value = this.feature_.getGeometry().getType();
		if (value === 'Point') {
			lonlat = this.feature_.getGeometry();
		}
		else if (value === 'LineString') {
			lonlat = this.feature_.getGeometry();
		}
		else if (value === 'Polygon') {
			lonlat = this.feature_.getGeometry();
		}

		if (appConfigInfo.mapData === 'google') {
			coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			wktGeom = format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
		}
		else {
			coordinate = lonlat.getCoordinates();
			wktGeom = format.writeGeometry(lonlat);
			//  wktGeom= format.writeGeometry(this.feature_.getGeometry());
		}

		var result = {
			new_coordinates: coordinate
		};
		var dragFeature = this.feature_;
		if (dragFeature.get('rname') == 'source') {
			tmpl.Route.clearRoute({ map: map1 });
			tmpl.Route.getRoute({
				map: map1,
				source: ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
				destination: click_destination_route[1],
				sourceIcon: sourceImg,//"img/1.png",
				destinationIcon: destinationImg,//"img/2.png",
				radius: radius1,//20,
				getGeometry: test1
			});
			click_destination_route[0] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		} else if (dragFeature.get('rname') == 'destination') {
			tmpl.Route.clearRoute({ map: map1 });
			tmpl.Route.getRoute({
				map: map1,
				source: click_destination_route[0],
				destination: ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
				sourceIcon: sourceImg,//"img/1.png",
				destinationIcon: destinationImg,//"img/2.png",
				radius: radius1,//20,
				getGeometry: test1
			});
			click_destination_route[1] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		}
		function test1(data) {
			//console.log("data >>>",data);
			tmpl.Geocode.getGeocode({
				point: click_destination_route[0],
				callbackFunc: handleGeocode
			});
			function handleGeocode(addrs) {
				var result = {
					route: data,
					geocode: addrs
				};
				callbackFunc(result);
			}
		}
		//mycallback(result);
		this.coordinate_ = null;
		this.feature_ = null;
		return false;
	};
	intr = new app.Drag();
	map1.addInteraction(intr);

}


tmpl.Route.deleteOnClickRoute = function (param) {
	var mapObj = param.map;
	var routeId = param.routeId;
	var lyrName = param.layerName;

	var Layers = mapObj.getLayers();
	var existing;
	for (var i = 0; i < Layers.getLength(); i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === lyrName) {
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == routeId) {
						existingLayer.getSource().removeFeature(fea);
					}
				});
			}
		}
	}
	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == lyrName) {
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == routeId) {
						tmpl_setMap_layer_global[i].layer.getSource().removeFeature(fea);
					}
				});
			}
		}
	}
}


tmpl.Route.ETAforICCC = function (param) {
	var mapObj = param.map;
	var dist = param.dist;
	var dtime = param.dtime;
	var point = param.point;
	var ta_tooltip = document.createElement('tooltip');
	ta_tooltip.id = 'trip-tooltip';
	ta_tooltip.className = 'ol-trip-tooltip';
	ta_tooltip.innerHTML = "Distance:" + dist + ", Time:" + dtime;
	var overlay_mouseOver_trip = new ol.Overlay({
		element: ta_tooltip,
		offset: [10, 0],
		positioning: 'bottom-left'
	});
	mapObj.addOverlay(overlay_mouseOver_trip);
	overlay_mouseOver_trip.setPosition(ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857'));
}

var gbl_addOverlayMap;
tmpl.Overlay.addOverlay = function (param) {
	var mapObj = param.map;
	gbl_addOverlayMap = mapObj;
	var point = param.point;
	var img_url = param.img_url;
	var count = param.count;
	var features = param.features;
	var showLabel = param.showLabel;
	var showLabelZoom = param.showLabelZoom;
	var callbackFunc = param.callbackFunc;
	var overlayID = mapObj.getOverlayById('clusterOverlayID');
	if (overlayID) {
		mapObj.removeOverlay(overlayID);
	}
	if (showLabelZoom == undefined) {
		showLabelZoom = 14;
	}
	var container1 = document.createElement('div');
	container1.className = 'containerAPI ';
	container1.id = 'containerCircular ';
	var elem;
	if (img_url.length > 1) {
		for (var i = 0; i < count; i++) {
			elem = document.createElement("img");
			elem.setAttribute("src", img_url[i]);
			elem.setAttribute("title", features[i].label);
			elem.className = 'field';
			elem.id = i;
			container1.appendChild(elem);

			if (showLabel == true) {
				if (gbl_addOverlayMap.getView().getZoom() > showLabelZoom) {
					if (count < 8) {
						elemLabel = document.createElement("div");
						elemLabel.className = 'clusterLabel';
						elemLabel.innerHTML = features[i].label;
						elemLabel.id = i;
						container1.appendChild(elemLabel);
					}
				}
			}
		}
	} else {
		for (var i = 0; i < count; i++) {
			elem = document.createElement("img");
			elem.setAttribute("src", img_url[0]);
			elem.setAttribute("title", features[i].label);
			elem.className = 'field';
			elem.id = i;
			container1.appendChild(elem);
		}
	}
	setTimeout(function () {
		var radius = 75;
		var fields = $('.field');
		var clusterLabel = $('.clusterLabel');
		var width = 100;//container.width();
		var height = 100;//container.height();
		var angle = 0, step = (2 * Math.PI) / fields.length;
		fields.each(function () {
			var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
			var y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
			$(this).css({
				left: x + 'px',
				top: y + 'px'
			});
			//console.log(x,y);
			angle += step;
			//console.log(fields);
		});
		if (showLabel == true) {
			if (gbl_addOverlayMap.getView().getZoom() > showLabelZoom) {
				if (count < 8) {
					var angleLabel = 0, stepLabel = (2 * Math.PI) / clusterLabel.length;
					clusterLabel.each(function () {
						var x = Math.round(width / 2 + radius * Math.cos(angleLabel) - $(this).width() / 2);
						var y = Math.round(height / 2 + radius * Math.sin(angleLabel) - $(this).height() / 2);
						$(this).css({
							left: x + 'px',
							top: (y + 20) + 'px',
							position: 'absolute',
							color: 'rgb(0, 0, 0)',
							width: '150px',
							font: '10px sans-serif'
						});
						angleLabel += stepLabel;
					});
				}
			}
		}
		for (var i = 0; i < fields.length; i++) {
			fields[i].onclick = function () {
				//alert("i>"+this.id);
				callbackFunc(this.id);
			};
		}

	}, 50);

	// elem.setAttribute("height", height);
	// elem.setAttribute("width", width);
	// var labelDiv = document.createElement('div');
	// labelDiv.className = 'bottomleft';
	// labelDiv.innerHTML = plName;
	//container.appendChild(labelDiv);
	var marker_pos = new ol.Overlay({
		id: 'clusterOverlayID',
		element: container1,
		offset: [-50, -50],
		positioning: 'center'
	});
	mapObj.addOverlay(marker_pos);
	if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
		marker_pos.setPosition(ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857'));
	}
	else {
		marker_pos.setPosition(point);
	}
	marker_pos.setProperties({ olname: "clusterOverlay" });

	/*mapObj.on('moveend',function() {
		var overlayID = mapObj.getOverlayById('clusterOverlayID');
		if(overlayID){
			mapObj.removeOverlay(overlayID);
		}
		
	});*/
	// setTimeout(function(){
	// tmpl.Overlay.removeMarker({map:mapObj,id:'clusterOverlayID'})
	// }, 5000);
}

tmpl.Route.buffer = function (param) {
	//var map = param.map;
	var wktGeom = param.wktgeom;
	var callBackFun = param.callBackFunc;
	//var urlL = "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/buffer/wkt/";
	try {


		var settings = {
			"url": appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/apis/getBufferPolygonArea",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({ "buffer_meter": "1.00", "route": wktGeom }),
		};

		$.ajax(settings).done(function (response) {
			console.log(response);
			callBackFun(response.buffered_route);
		});
	}
	catch (err) {
		console.error("ERROR Trip.stop: ", err);
	}
}

tmpl.Layer.changeVisibility = function (param) {

	var mapObj = param.map;

	var layerName = param.layer;

	var visibility = param.visible;




	try {

		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == 'ol7') {

				var Layers;

				try {

					Layers = mapObj.getLayers();

					var length = Layers.getLength();

				} catch (e) { console.log("Error in Get Layers:", e, mapObj); }




				var existing;

				var existingLayer;

				for (var i = 0; i < length; i++) {




					try {

						existingLayer = Layers.item(i);

					} catch (e) { }




					if (existingLayer) {

						//console.log("first >>",existingLayer.get('title'),existingLayer.get('title') == layerName);

						if (existingLayer.get('title') == layerName) {

							existing = existingLayer;

							try {

								existingLayer.setVisible(visibility);

							} catch (e) { }




						}

					}

				}




				if (existing == undefined) {

					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {




						//console.log("second11 >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);

						if (tmpl_setMap_layer_global[i].title == layerName) {




							if (visibility == false) {

								tmpl_setMap_layer_global[i].layer.setMap(null);

								tmpl_setMap_layer_global[i].visibility = false;

								//alert(2);

							} else {




								try {

									tmpl_setMap_layer_global[i].layer.setMap(mapObj);

								} catch (e) { }

								try {

									tmpl_setMap_layer_global[i].visibility = true;

								} catch (e) { }




								//alert(3);

							}

						}

						//console.log("second >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);

					}




				}

			}
		} else {

			if (visibility == "true") {

				visibility = true;

			}

			if (visibility == "false") {

				visibility = false;

			}




			var length = mapObj.entities._entities.length;

			// for(var i=0; i<length; i++){

			var i = 0;;

			while (i < length) {

				if (mapObj.entities._entities._array[i].name == layerName) {

					mapObj.entities._entities._array[i].show = visibility;

				}

				i++;

			}




			var clusterLength = mapObj.dataSources.length;

			var j = 0;

			while (j < clusterLength) {

				if (mapObj.dataSources.get(j).name == layerName) {

					mapObj.dataSources.get(j).show = visibility;

				}

				else { }

				j++;

			}

		}

	} catch (err) {
		console.error("ERROR Layer.changeVisibility: ", err);
	}
}


