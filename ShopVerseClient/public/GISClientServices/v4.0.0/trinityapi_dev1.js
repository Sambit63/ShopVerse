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
var startTimeThreed = null;
var sglBaseLayer;
var pointerMoveID;
var tripTimeDelay;
var vehicleObj;
var track_ivlDraw;
var basemap3D;
var mapmode;
var pentaBAccessToken = '';

var tmpl_setMap_layer_global_array = [];

//---------------------------------- Beginning of Creating Google Map------------------------------------//

// **** Creating Google Map inside the specified targetDiv using the map properties specified in the appconfig.js file **** //

//var base_map_streetLayer_trinity,base_map_trinity;

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
		//alert("API appConfigInfo.type");
		return false;
	} else {
		//alert("API if appConfigInfo");
		var targetDiv = param.target;
		var mainMap = param.mainMap;
		var defaultZoom = param.defaultZoom;
		var callBackFun = param.callBackFunc;
		var existingMapObject = param.existingMapObj;
		var googleStyled = param.googleStyle; // for google night mode
		mapmode = googleStyled;
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
							var applyLayer;

							if (existingMapObject) {
								applyLayer = existingMapObject;
								console.log("Map Created from Existing Map Object..!");
							}
							else {
								if (appConfigInfo.mode == 'night') { // for google night mode
									applyLayer = new olgm.layer.Google({  // for google night mode
										styles: mapStylesBundle['night'].style
									});
								}
								else if (appConfigInfo.mode == 'darkGrey') {
									applyLayer = new olgm.layer.Google({  // for dark google map mode
										styles: mapStylesBundle['darkGrey'].style
									});
								}
								else if (appConfigInfo.mode == 'cobalt') {
									applyLayer = new olgm.layer.Google({  // for cobalt map mode
										styles: mapStylesBundle['cobalt'].style
									});
								}
								else {
									applyLayer = new olgm.layer.Google({
										visible: true,
										mapTypeId: google.maps.MapTypeId.ROADMAP
									});
								}

							}

							map = new ol.Map({
								interactions: ol.interaction.defaults({
									altShiftDragRotate: false,
									dragPan: false,
									rotate: false
								}).extend([new ol.interaction.DragPan({ kinetic: null })]),
								layers: [applyLayer],
								target: targetDiv,
								view: viewg,
								loadTilesWhileAnimating: true,
							});
							var layers = map.getLayers();
							layers.setAt(0, applyLayer);

							var olGM = new olgm.OLGoogleMaps({
								map: map,
								mapIconOptions: {
									useCanvas: true
								}
							});
							olGM.activate();

							gmap_googleMap = olGM.getGoogleMapsMap();
							map.set('olgmObj', olGM);
						} else if (appConfigInfo.type == "osm") {
							map = new ol.Map({
								// interactions: ol.interaction.defaults({
								// 	altShiftDragRotate: false,
								// 	dragPan: false,
								// 	rotate: false

								// }).extend([new ol.interaction.DragPan({ kinetic: null })]),
								//interactions: ol.interaction.defaults.defaults,
								layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
							    //layers: [],
							  		
								target: targetDiv,
								view: viewg,
								loadTilesWhileAnimating: true
							});
							var layers = map.getLayers();
							//map.set('ol7mObj', omap, true);

							if (callBackFun) {
								callBackFun(map);
							}

							console.log("~~~~~~~~~~Map OBJm:::::::::", map);
							var vectorLayer = new ol.layer.Tile({
								source: new ol.source.OSM()
						  })
							
							//layers.removeAt(0); 
							//layers.insertAt(0, vectorLayer);
						}
						else if (appConfigInfo.type == "esri") {

							map = new ol.Map({
								interactions: ol.interaction.defaults({
									altShiftDragRotate: false,
									dragPan: false,
									rotate: false
								}).extend([new ol.interaction.DragPan({ kinetic: null })]),
								layers: [],//layers: [layer1],
								target: targetDiv,
								view: viewg,
								loadTilesWhileAnimating: true,
							});
							var layers = map.getLayers();
							//layers.setAt(0, layer1); 

							var olGM = new olgm.OLGoogleMaps({
								map: map,
								mapIconOptions: {
									useCanvas: true
								}
							});
							olGM.activate();
							gmap_googleMap = olGM.getGoogleMapsMap();
							map.set('olgmObj', olGM);
							//layers.removeAt(0); 
							layers.insertAt(0, new ol.layer.Tile({
								source: new ol.source.XYZ({
									attributions: [new ol.Attribution({
										html: 'Tiles © <a href="' + appConfigInfo.esri_url + '">ArcGIS</a>'
									})],
									url: appConfigInfo.esri_url + '/tile/{z}/{y}/{x}'
								})
							}));

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
								interactions: ol.interaction.defaults({ doubleClickZoom: true }),
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
							console.log("Custom Map..!");
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
									visible: true, source: new ol.source.TileWMS({
										url: appConfigInfo.pentaBMapserverURL,
										params: { 'LAYERS': appConfigInfo.pentaBBasemapLayer, 'TILED': true, 'VERSION': appConfigInfo.wmsVersion },
										serverType: 'geoserver'
									})
								});
								//base_map_trinity = baseLayer;
								//console.log(base_map_trinity,baseLayer);
								streetLayer_trinity = new ol.layer.Tile({
									source: new ol.source.TileWMS({
										url: appConfigInfo.pentaBMapserverURL,
										params: { 'LAYERS': appConfigInfo.pentaBBasemapLayer, 'TILED': true, 'VERSION': '1.1.1' }
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
										minZoom: appConfigInfo.trinityMinZoom
									})
								} else {
									view = new ol.View({
										zoom: appConfigInfo.trinityzoom,
										projection: 'EPSG:4326',
										center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
										extent: [parseFloat(appConfigInfo.extent1), parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent3), parseFloat(appConfigInfo.extent4)],
										rotation: 0,
										minZoom: appConfigInfo.trinityMinZoom
									})
								}

							}
							else {
								baseLayer = new ol.layer.Tile({
									visible: true, source: new ol.source.TileWMS({
										url: appConfigInfo.pentaBMapserverURL,
										params: { 'LAYERS': appConfigInfo.pentaBBasemapLayer, 'TILED': false, 'VERSION': appConfigInfo.wmsVersion },
										serverType: 'geoserver'
									})
								});
								//base_map_trinity = baseLayer;

								streetLayer_trinity = new ol.layer.Tile({
									source: new ol.source.TileWMS({
										url: appConfigInfo.pentaBMapserverURL,
										params: { 'LAYERS': appConfigInfo.pentaBBasemapLayer, 'VERSION': '1.1.1' }
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
										minZoom: appConfigInfo.trinityMinZoom
									})
								} else {
									view = new ol.View({
										zoom: appConfigInfo.trinityzoom,
										projection: p,
										center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
										rotation: 0,
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
										view: view
									});
									//base_map_streetLayer_trinity.setVisible(false);
								} else {
									map = new ol.Map({
										interactions: ol.interaction.defaults({ doubleClickZoom: true }),
										layers: [baseLayer, satelliteLayer],
										target: targetDiv,
										view: view
									});
								}
								// map = new ol.Map({
								// interactions : ol.interaction.defaults({doubleClickZoom :true}),
								// layers: [baseLayer, streetLayer_trinity, satelliteLayer],
								// target: targetDiv,
								// pixelRatio: 1,
								// view: view
								// });
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
								//console.log("xxxxxxxx");
								if (mainMap == true) {
									map = new ol.Map({
										interactions: ol.interaction.defaults({ doubleClickZoom: true }),
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
							activate(map);
							if (mainMap == true) {
								getTrinityLayersList(map);
							}
							if (callBackFun)
								callBackFun(map);
							try {
								tmpl.Map.getToken({
									callbackFun: function token(a) {
										console.log("Token::", a.access_token);
										appConfigInfo.bToken = "Bearer " + a.access_token;
									}
								});
							} catch (e) { console.log("PentaB Token Issue:", e); }
							return map;
						}
					}
				}
				else if (appConfigInfo.mapLib == 'leaflet') {
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


					if (appConfigInfo.type === "osm") {

						map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');

						L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}).addTo(map);

					}


					if (appConfigInfo.type === "here") {

						map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');

						L.tileLayer.provider('HEREv3.terrainDay', {
							apiKey: appConfigInfo.hereMapsAppKey
						}).addTo(map);
					}


				}
			}
			else {
				/*
				3D MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPPPPPPPPPPPPPPPPPPPPP
				CESIUMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
				ASHWATHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
				*/
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

				//$(".cesium-widget-credits").hide();

				// Hide infobox by default
				document.getElementsByClassName("cesium-infoBox")[0].style.visibility = "hidden";

				// Hide animation div
				try {
					$(map.animation.container).css('visibility', 'hidden');
				} catch (e) { }

				// Setting view of map on map load for the first time
				map.camera.setView({
					destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 60000)
				});
				if (appConfigInfo.offline === true)
				//Offline Map
				{
					console.log("Offline:", appConfigInfo.offline);
					//setTimeout(function(){ 
					//alert("Hello"); 
					try {
						tmpl.Map.addWMSLayer({
							map: map,
							layerUrl: appConfigInfo.pentaBMapserverURL,
							zoomtoFeature: true,
							geoServerLayerName: appConfigInfo.pentaBBasemapLayer,
							visibility: true
						});

					} catch (e) {
						console.log("Custom Map Load Error..!");
					}

					//}, 5000);
				}
				else {
					console.log("Offline Error:", appConfigInfo.offline);
				}

				//////////////////////////////////////////////// GETOVERLAYFEATUREDETAILS ////////////////////////////////////////////////
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
				///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				return map;
			}
		}

		catch (err) {
			console.error("ERROR Map.createMap: ", err);
		}
	}
}

// **** Map Resize **** //

tmpl.Map.resize = function(param){
	var mapObj = param.map;
	
	if(mapObj){
		if(appConfigInfo.mapData==='google'){
			mapObj.updateSize();
			var layers = mapObj.getLayers();
			var googleLayer = layers.item(0);   
			mapObj.removeLayer(googleLayer);  
			try{
				layers.insertAt(0, googleLayer);
			}catch(e){}
			
		}
		else{
			//mapObj.updateSize();
			mapObj.updateSize();
			var layers = mapObj.getLayers();
			var googleLayer = layers.item(0);   
			mapObj.removeLayer(googleLayer);  
			try{
				layers.insertAt(0, googleLayer);
			}catch(e){}
		}
	}
}

// **** Map get centerPoint **** //
tmpl.Map.centerPoint = function(param){
	var mapObj = param.map;
	var centerPoint;
	if(appConfigInfo.mapData==='google'){
		centerPoint = ol.proj.transform(mapObj.getView().getCenter(), 'EPSG:3857','EPSG:4326');
	} else {
		centerPoint = mapObj.getView().getCenter();
	}		
	return centerPoint;
}


tmpl.Map.addWMSLayer = function (param) {
	var mapObj = param.map;
	var layerUrl = param.layerUrl;
	var layerName = param.layerName;
	var layerTitle = param.layerTitle;

	try {
		if (appConfigInfo.mapDimension == "2D") {
			var WMSlayerObj = new ol.layer.Tile({
				visible: true,
				preload: Infinity,
				source: new ol.source.TileWMS({
					url: layerUrl,
					crossOrigin: false,
					params: {
						'LAYERS': layerName,
						'TILED': true,
						'VERSION': appConfigInfo.wmsVersion
					},
					serverType: 'geoserver'
				})
			});
			mapObj.addLayer(WMSlayerObj);
			WMSlayerObj.setProperties({ title: layerTitle });
		}
		else {
			var imageryLayers = mapObj.imageryLayers;
			var geoWmsLayer = new Cesium.WebMapServiceImageryProvider({
				// name: layerTitle,
				url: layerUrl,
				layers: layerName,
				// enablePickFeatures: false,
				parameters: {
					format: 'image/png',
					transparent: true
				}
			});
			geoWmsLayer.name = layerTitle;
			imageryLayers.addImageryProvider(geoWmsLayer);

		}
	}
	catch (err) {
		console.error("ERROR Map.addWMSLayer: ", err);
	}
}
