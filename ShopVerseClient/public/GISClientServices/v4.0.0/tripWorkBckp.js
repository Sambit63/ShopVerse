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
tmpl.Info.getPlaceFlag =  false;
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

//(function() {
	
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
								controls: ol.control.defaults.defaults({
									zoom: true,
									attribution: true,
									rotate: false
								}),
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
							if (callBackFun) {
								callBackFun(map);
							}
							console.log("~~~~~~~~~~Map OBJm:::::::::", map);
							//layers.removeAt(0); 
							//layers.insertAt(0, vectorLayer);

						} else if (appConfigInfo.type == "osm") {
							map = new ol.Map({
								// interactions: ol.interaction.defaults({
								// 	altShiftDragRotate: false,
								// 	dragPan: false,
								// 	rotate: false

								// }).extend([new ol.interaction.DragPan({ kinetic: null })]),
								controls: ol.control.defaults.defaults({
									zoom: true,
									attribution: true,
									rotate: false
								}),
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
							//layers.removeAt(0); 
							//layers.insertAt(0, vectorLayer);
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

								// new TileLayer({
								// 	extent: [-13884991, 2870341, -7455066, 6338219],
								// 	source: new TileWMS({
								// 		url: 'https://ahocevar.com/geoserver/wms',
								// 		params: { 'LAYERS': 'topp:states', 'TILED': true },
								// 		serverType: 'geoserver',
								// 		// Countries have transparency, so do not fade tiles:
								// 		transition: 0,
								// 	}),
								// }),

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

						// map = new L.Map(targetDiv, {
						// 	center: [41.4583, 12.7059],
						// 	zoom: 5,
						// 	markerZoomAnimation: false,
						// 	zoomControl: false
						// });

						//  var zoomControl = new L.Control.Zoom({ position: 'topleft' });


						var ggl; // Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
						//if (appConfigInfo.mode === 'normal') {
						//ggl = new L.Google('ROADMAP'); //For DKS leaflet-google

						ggl = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
							maxZoom: 20,
							subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
						});
						// 	Note the difference in the "lyrs" parameter in the URL:
						// Hybrid: s, h;
						// Satellite: s;
						// Streets: m;
						// Terrain: p;

						//}
						// else if (appConfigInfo.googleSatelliteView === false) {
						// 	ggl = new L.Google('TERRAIN');
						// }
						//styles: mapStylesBundle['darkGrey'].stylemap.addLayer(ggl);
						// zoomControl.addTo(map);

						ggl.addTo(map);
						if (callBackFun)
							callBackFun(map);
					}
					else if (appConfigInfo.type === "osm") {

						map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');
						L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}).addTo(map);

						// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
						// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
						// 	subdomains: 'abcd',
						// 	maxZoom: 20
						// }).addTo(map); //cartodn

						if (callBackFun)
							callBackFun(map);
					}
					else if (appConfigInfo.type === "esri") {
						map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.googlezoom, 'EPSG:4326', 'EPSG:3857');
						// map = L.map(targetDiv).setView([-41.2858, 174.78682], 14);
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
							// var bounds = L.latLngBounds([
							// 	[appConfigInfo.bound1lon, appConfigInfo.bound1lat], // Southwest coordinates
							// 	[appConfigInfo.bound2lon, appConfigInfo.bound2lat] // Northeast coordinates
							//   ]);

							//   map.fitBounds(bounds, {
							// 	//padding: [50, 50],
							// 	minZoom: 10,
							// 	maxZoom: 15
							//   });
						} else {
							map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.leafzoom, 'EPSG:4326', 'EPSG:3857');
						}
						//map = L.map(targetDiv).setView([parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)], appConfigInfo.leafzoom, 'EPSG:4326', 'EPSG:3857');
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
							//getTrinityLayersList(map);
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
				if (appConfigInfo.offline === true) {
					console.log("Offline:", appConfigInfo.offline);
					try {
						// tmpl.Map.addWMSLayer({
						// 	map: map,
						// 	layerUrl: appConfigInfo.mapserverURL,
						// 	zoomtoFeature: true,
						// 	layerName: appConfigInfo.basemapLayer,
						// 	visibility: true
						// });
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
			// $('#'+divPrint).append('<button id="up" onclick="printmap()" class="vertical" type="button" title="Print"  style="position: absolute; right: 1%; top: 5%;">&#9113;</button>');	

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


			//var printmapform =  "<form class='custom-select'><label for='format'>Title: </label><br><input type='text' id='title' name='title'><br><label for='format'>Sub Title: </label><br><input type='text' id='subtitle' name='subtitle'><br><label for='format'>Page size: </label><br><select id='format'><option value='a0'>A0 (slow)</option><option value='a1'>A1</option><option value='a2'>A2</option><option value='a3'>A3</option><option value='a4' selected>A4</option></select><br><label for='resolution'>Resolution: </label><br><select id='resolution'><option value='72'>72 DPI (fast)</option><option value='150'>150 DPI</option><option value='300'>300 DPI (slow)</option></select><br><label for='resolution'>Page:</label><br><select id='pageformat'><option value='landscape'>Landscape</option><option value='portrait'>Portrait </option></select><br><label for='download'>Download As:</label><br><select id='download'><option value='pdf'>PDF</option><option value='jpeg'>Jpeg</option><option value='png'>PNG</option></select><br><br><div id='divcenter'><button id='export-pdf'>Download</button></div></form>";

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


function enablePointerMove(mapObj,event){
	var pixel = mapObj.getEventPixel(event.originalEvent);
	var hit = mapObj.hasFeatureAtPixel(pixel);
	mapObj.getViewport().style.cursor = hit ? 'pointer' : '';
}

function disablePointerMove(mapObj){
	mapObj.un('click', myFunc)
}

function setBaseMap(val, bLayer, sLayer) {
   if(val==='satellite')
  {
    bLayer.setVisible(false);
    sLayer.setVisible(true);

  }
  else
  {
  bLayer.setVisible(true);
  sLayer.setVisible(false);

  }
}


function mapdivChangeAction(mapObject){	
console.log("mapObject=====================>",mapObject);
// alert("mapdivChangeAction");				
	var mapDivId = mapObject.getTarget();
	if(mapObject.getTarget().id != undefined){			
		mapDivId = mapObject.getTarget().id;
	}
	var tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean); 
	document.getElementById(mapDivId).style.height = (parseInt(tempVar[0])-1)+tempVar[1];
	setTimeout(function(){
		tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
		document.getElementById(mapDivId).style.height = (parseInt(tempVar[0])+1)+tempVar[1];
	}, 200);
}



// **** Toggle handler for Street and Satellite view of Google map**** //
function toggleGoogleMap(val,mapobj){
	console.log("toggleGoogleMap");
	var layers = mapobj.getLayers();
	mapobj.removeLayer(layers.item(0));
	var googleLayer;
	if(val==='satellite'){
		googleLayer = new olgm.layer.Google({
			mapTypeId: google.maps.MapTypeId.HYBRID
		});
   }
	else{
		googleLayer = new olgm.layer.Google({
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
	}
	layers.insertAt(0, googleLayer);
	mapdivChangeAction(mapobj);
}


// **** Restricting Map Extent functionality**** //

// var polygon_ex;  remove this variable after checking it is not used in any other functions.

function mapLocation(mapObj,lat_X1,lon_Y1,lat_X2,lon_Y2){
	var polygon_ex;
    var olGM2 = new olgm.OLGoogleMaps({
		map : mapObj
    });
    var gmap = olGM2.getGoogleMapsMap();
	var map_cen;
	function setExtend(lat1,lng1,lat2,lng2){
        var last_perfect_cen,last_zoom;
        var start = new google.maps.LatLng(lat1,lng1);
        var end = new google.maps.LatLng(lat2,lng2);
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
		
        var convertBounds,x1,y1,x2,y2,extent;
		convertBounds = bounds.toString();
		convertBounds=convertBounds.slice(2,-2);
		convertBounds=convertBounds.split("), (");
		x1=parseFloat(convertBounds[0].split(",")[0]);
		y1=parseFloat(convertBounds[0].split(",")[1]);
		x2=parseFloat(convertBounds[1].split(",")[0]);
		y2=parseFloat(convertBounds[1].split(",")[1]);
	
		extent =[y1,x1,y2,x2];
        mapObj.on("moveend", function (e) {
			var centerz = mapObj.getView().getCenter();
			var rp_centerz = ol.proj.transform([centerz[0],centerz[1]], 'EPSG:3857', 'EPSG:4326');
			rp_centerz = rp_centerz.toString().split(",");
            polygon_ex = turf.polygon([[[x1,y1],[x1,y2],[x2,y2],[x2,y1],[x1,y1]]]);
            var point = turf.point([parseFloat(rp_centerz[1]),parseFloat(rp_centerz[0])]);
            var intersects = turf.intersect(point,polygon_ex);
            if(intersects){
				var lastcenterz = mapObj.getView().getCenter();
                last_perfect_cen = ol.proj.transform([lastcenterz[0],lastcenterz[1]], 'EPSG:3857', 'EPSG:4326');
                last_zoom = mapObj.getView().getZoom();
            }
            else{
				alert("You are beyond the Project Area,redirecting to previous zoomed center");
                mapObj.getView().setCenter(ol.proj.transform([last_perfect_cen[0],last_perfect_cen[1]], 'EPSG:4326', 'EPSG:3857'));
                mapObj.getView().setZoom(last_zoom);
            }
        });
        mapObj.getView().on('propertychange', function(e){
			var zoomlevel=mapObj.getView().getZoom();
			if(zoomlevel<9){
				mapObj.getView().setCenter(lat,lon);
				mapObj.getView().setZoom(21);
			}
		}); 
	}setExtend(lat_X1,lon_Y1,lat_X2,lon_Y2);
}

// **** Please write this function description here **** //

activate = function(mapObj){
//function activate(mapObj){
	var popupboolian_title=false;
	mapObj.on('pointermove', function(e) {
		// if (e.dragging) return;
		// var pixel = mapObj.getEventPixel(e.originalEvent);
		// var hit = mapObj.hasFeatureAtPixel(pixel);
		// mapObj.getTargetElement().style.cursor = hit ? 'pointer' : '';
	});
	mapObj.on('click', function(evt) {
		
		var pixel = mapObj.getEventPixel(evt.originalEvent);
		if(mapObj.hasFeatureAtPixel(pixel)){
			var layerName;
			var coordinate = evt.coordinate;
			var layerObj;
			var feature = mapObj.forEachFeatureAtPixel(evt.pixel,function (feature, layer){
				layerObj = layer;
				//console.log("feature,layer ????",feature,layer);
				if(layer == null){
					//console.log("feature.get('layer_name') ???",feature.get('layer_name'));
						if(feature.get('layer_name')){
							layerName = feature.get('layer_name');
							popupboolian_title=false;
							return feature;
						}
						else{
							popupboolian_title=true;
							return null;
						}
				}else if(layer){
					if(layer){
						//console.log(layer.get('title'));
						if(layer.get('title')){
							layerName = layer.get('title');
							popupboolian_title=false;
							return feature;
						}
						else{
							popupboolian_title=true;
							return null;
						}
					}
				}
                else{
                    popupboolian_title=true;
                }
            });
			//console.log("popupboolian_title ????",popupboolian_title);
			if(popupboolian_title==false){
				var geometry = feature.getGeometry();
                var coord;
				// if(appConfigInfo.mapData==='google'){
				if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps'){
					//console.log(geometry);
					coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
				}
				else{
					coord =  evt.coordinate;
				}
                var id;
				//test1 = feature;
                if(feature.get('id')===undefined){
					id = null;
                }
                else{
					
					id = feature.get('id');
					
                }
				var properties = feature.getProperties();
				
				if(id == 'c_'+feature_poi_edit_id  &&  layerName == feature_poi_edit_layer+'_API_CircleLayer'){
					feature_poi_edit_layer_callback(id,coord,layerName,properties);
				}
				else if(feature_spatial_edit_id == id && feature_spatial_edit_layer == layerName){
					feature_spatial_edit_layer_callback(id,coord,layerName,properties);
				}else{
					//alert()
					//test12 = layerObj;
					
				if(layerObj != null){
					
					if(layerObj.get('cluster') == true){
						//alert();
						var ids =[],properties1 = [];
						for(var k=0;k<feature.get('features').length;k++){
							ids[k] = feature.get('features')[k].get('id');
							properties1[k] = feature.get('features')[k].getProperties();
						}
						
						getOverlayFeatureDetails(ids,coord,layerName,properties1,mapObj);
					}else if(layerName == "Draw_Route_Layer"){
						
						tmpl.Geocode.getGeocode({
							point : coord,
							callbackFunc  : handleGeocode	
						});
						function handleGeocode(a){
							//console.log(a.address);
							properties.address = a.address;
							//console.log(id,coord,layerName,properties);
							getOverlayFeatureDetails(id,coord,layerName,properties,mapObj);
						}
						
					}else{
						
						getOverlayFeatureDetails(id,coord,layerName,properties,mapObj);
					}
				}else{
				//console.log("else3");
				//console.log(id,coord,layerName,properties,mapObj);
					getOverlayFeatureDetails(id,coord,layerName,properties,mapObj);
				}
				}
                
			}
		}else{
			if(tmpl.Info.getPlaceFlag ==  true){
				if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps'){
							var coordinate = evt.coordinate;
				coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
				var x = parseFloat(coordinate[0]);
				var y = parseFloat(coordinate[1]);
				var coordinates = {lat: y, lng: x};
				var result = {};
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({
					'latLng': coordinates
				},function(results, status) {
					
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							//console.log(results[0]);
							var place = results[0].formatted_address;
							var placeName = place;
							result = {
								place : [placeName],
								latitude : y,
								longitude : x,
								type : (results[0].types).join()
								};
							resultStatus = true;
						}
					}
					
					tmpl.Info.getPlace.CallbackFunc(result);
				});
				}
				else{
						var coordinate = evt.coordinate;
		//coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
		var x = parseFloat(coordinate[0]);
		var y = parseFloat(coordinate[1]);
		var coordinates = {lat: y, lng: x};
		var result = {};
		//console.log(x,y);
			function handleLandMarks(data){
				//alert();
				//console.log(data);
				result = {
						place : [data[0].name],
						latitude : y,
						longitude : x,
						type : data[0].type
						};
						//console.log("result >>",result);
				tmpl.Info.getPlace.CallbackFunc(result);
			}

			tmpl.Search.getLandMarks({
			map : map,
			point : [x,y],
			radius : 20000,
			POI_type : "all",
			Max_num_POIs : 1,
			callbackFunc : handleLandMarks
		});	
					
				}
			}
		}
	});  
}

// **** Map Resize **** //

tmpl.Map.resize = function(param){
	var mapObj = param.map;
	// alert("Map Resize API");
	if(mapObj){
		if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps'){
			mapObj.updateSize();
			var layers = mapObj.getLayers();
			var googleLayer = layers.item(0);   
			mapObj.removeLayer(googleLayer);  
			try{
				layers.insertAt(0, googleLayer);

				
				
				// mapdivChangeAction(mapObj);
			}catch(e){}
			
		}
		else{
			mapObj.updateSize();
		}
	}
}

tmpl.Map.remove = function(param){
	var mapObj = param.map;
	//tmpl_setMap_layer_global = [];
	if(mapObj){
		for(var k=0;k<gbl_allClusterLayers.length;k++){
			try{
				mapObj.removeLayer(gbl_allClusterLayers[k]);
			}catch(e){}		
		}		
		gbl_allClusterLayers = [];
		
		var allLayers = mapObj.getLayers();
		var layerLength = allLayers.getLength();
		for(var j=0;j<layerLength;j++){
			var lyr1=allLayers.item(j);
			if(lyr1){
				mapObj.removeLayer(lyr1);
			}
		}
		for(var j=0;j<tmpl_setMap_layer_global;j++){
			var lyr1=tmpl_setMap_layer_global[j].layer;
			if(lyr1){
				lyr1.setMap(null);
			}
		}
		
		tmpl_setMap_layer_global = [];
		mapObj.setTarget(null);
		mapObj = null;
		delete mapObj;
	}
}

tmpl.Layer.remove = function(param){
	var mapObj = param.map;
	var layer = param.layer;
	var existing;
	var Layers = mapObj.getLayers();
	console.log(Layers);
	var length = Layers.getLength();
	console.log(length);
	for(var i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layer){
			// if(existingLayer.get('lname') === layer){
				existing = existingLayer;
				mapObj.removeLayer(existingLayer);				
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == layer){
				mapObj.removeLayer(tmpl_setMap_layer_global[i]);
			}			
		}
	}
}

// **** Map Zoom In **** //

tmpl.Control.zoomIn = function(param){
	var mapObj = param.map;
	var currentZoom = mapObj.getView().getZoom();
	currentZoom = currentZoom + 1;
	mapObj.getView().setZoom(currentZoom);
}

// **** Map Zoom Out **** //

tmpl.Control.zoomOut = function(param){
	var mapObj = param.map;
	var currentZoom = mapObj.getView().getZoom();
	currentZoom = currentZoom - 1;
	mapObj.getView().setZoom(currentZoom);
}

// **** Adding Scale Control to the specified map **** //

tmpl.Control.addScale = function(param){
	var mapObj = param.map;
	var scaleCtrl = new ol.control.ScaleLine();
	mapObj.addControl(scaleCtrl);
}

// **** Adding Zoom to Extent Control to the specified map **** //

tmpl.Control.addZoomToExtent = function(param){
	var mapObj = param.map;
	if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps'){
		var zoomToExtentButton = document.createElement('button');
		var zoomToExtentText = document.createTextNode("E");
		zoomToExtentButton.appendChild(zoomToExtentText);
		zoomToExtentButton.title ='Fit to Extent';
		zoomToExtentButton.className = 'ol-zoom-Extent-Custom .ol-unselectable ';
		zoomToExtentButton.addEventListener('click', function(){
			zoomToExtentControlForGoogle(mapObj);
		});
		var zoomToExtentControl = new ol.control.Control({
			element: zoomToExtentButton
		});
		mapObj.addControl(zoomToExtentControl);
    }
    else
    {
		var zoomToExtentControl = new ol.control.ZoomToExtent({
			extent: [77.378372, 12.734456, 77.882713, 13.2803290722673]
		});
		mapObj.addControl(zoomToExtentControl);
    }
}

// **** Zoom to Extent event handler for Google map **** //

function zoomToExtentControlForGoogle(mapObj){

	var start = new google.maps.LatLng(appConfigInfo.extent2,appConfigInfo.extent1);
    var end = new google.maps.LatLng(appConfigInfo.extent4,appConfigInfo.extent3);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
	
    var convertBounds,x1,y1,x2,y2,extent;
    convertBounds = bounds.toString();
    convertBounds=convertBounds.slice(2,-2);
    convertBounds=convertBounds.split("), (");
    x1=parseFloat(convertBounds[0].split(",")[0]);
    y1=parseFloat(convertBounds[0].split(",")[1]);
	x2=parseFloat(convertBounds[1].split(",")[0]);
    y2=parseFloat(convertBounds[1].split(",")[1]);
	
    extent =[y1,x1,y2,x2];
    mapObj.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
}

// **** End of Adding Zoom to Extent Control to the specified map **** //

// **** Adding Mouse Position Control to the specified map **** //

tmpl.Control.addMousePostion = function(param){
	var mapObj = param.map;
	var ctrlMouse = new ol.control.MousePosition({
		undefinedHTML: 'outside',
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '{x}, {y}', 4);
		}
	});
	mapObj.addControl(ctrlMouse);
}

// **** Adding Full Screen Control to the specified map **** //

tmpl.Control.addFullScreen = function(param){
	var mapObj = param.map;
	var ctrlFullScreen =  new ol.control.FullScreen();
	mapObj.addControl(ctrlFullScreen);
}

tmpl.Feature.changeTypeVisibility = function(param){
	var map = param.map;
	var layrName = param.layer;
	var type = param.type;
	var visible = param.visible;
	var existing;
	var Layers = map.getLayers();
	var length = Layers.getLength();
	var fea;
	for(var i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layrName){
				existing = existingLayer;
				test1 = existingLayer;
				//alert(type);
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if(feature.getProperties().features != undefined)
					var len = feature.getProperties().features.length;
					for(var j=0;j<len;j++){
						console.log("category_idb",feature.getProperties().features[j].get('category_id'));
						if(feature.getProperties().features[j].get('category_id') == type){
							console.log("changeTypeVisibility changeTypeVisibility changeTypeVisibility");
							fea = feature.getProperties().features[j];
							//if(fea.get('img_url') != '')
								//fea.set('ff',fea.get('img_url'));
							if(visible == false){
								fea.set('img_url','');
							}else{
								fea.set('img_url',fea.get('ff'));
							}
							
							//console.log("beforebeforebefore",allClusterTypeData,type);
							
							//console.log("afterafterafter",allClusterTypeData,type);
						}else{
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

tmpl.Feature.getLabel = function(param){
	var mapObj = param.map;
	var layerName = param.layer;
	var id = param.id;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var labelName;
	var existing;
	for(var i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layerName){
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if(feature.get('id') == id){
						labelName = feature.getProperties()['label'];
					}
				});
			}
		}
	}
	
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == layerName){
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
					if(feature.get('id') == id){
						labelName = feature.getProperties()['label'];
					}
				});
			}
			
		}
		
	}
	
	return labelName;
}



tmpl.Feature.changeColor = function(param){
	var mapObj = param.map;
	var id = param.id;
	var layerName = param.layer;
	var colorval = param.color;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
	for(var i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layerName){
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if(feature.getProperties()['id']==id){
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
                    color:colorval
                })
            })
        }));
					}
				});
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == layerName){
				var layer = tmpl_setMap_layer_global[i].layer;
				layer.getSource().getFeatures().forEach(function (feature) {
					if(feature.getProperties()['id']==id){
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
                    color:colorval
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

tmpl.Feature.saveSpatialEdit = function(param){
	var mapObj = param.map;
	mapObj.removeInteraction(modify1);
	tmpl.Feature.spatialEditClose();
	return resultGetEditDetails.geometry;
}
tmpl.Feature.cancelSpatialEdit = function(param){
	var mapObj = param.map;
	var feature = resultGetEditDetails.feature;
	if(feature != undefined)
		feature.getGeometry().setCoordinates(resultGetEditDetails.coordinates);
	//console.log(feature.getGeometry().getCoordinates());
	mapObj.removeInteraction(modify1);
	tmpl.Feature.spatialEditClose();
}

var feature_spatial_edit_id;
var feature_spatial_edit_layer;
var feature_spatial_edit_layer_callback;
tmpl.Feature.spatialEditClose = function(){
	feature_spatial_edit_id = '';
	feature_spatial_edit_layer = '';
}
tmpl.Feature.spatialEdit = function(param){
	var mapObj = param.map;
	var callbackFunc = param.callbackFunc;
	feature_spatial_edit_layer_callback = param.getDetailsCallbackFunc;
	var zoom = param.zoom;

	var propertyId = param.id;
	var lyrName = param.layerName;
	feature_spatial_edit_id = propertyId;
	feature_spatial_edit_layer = lyrName;
	var ft,latlon,wktGeom,coord,value;
	var previousFeature;
	var restrict_layer;
	var zoomExtent,zoomCoord;

	var format = new ol.format.WKT();
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	var selectfeatureIdEdit = new ol.interaction.Select({wrapX: false,condition: ol.events.condition.click});
 	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
	for(i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') == lyrName){
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==propertyId){
						value = fea.getGeometry().getType();
						previousFeature = fea;
						ft=fea;
						if(value == 'Polygon'){
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
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == lyrName){
				var layerExits = tmpl_setMap_layer_global[i].layer;
				layerExits.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==propertyId){
						value = fea.getGeometry().getType();
						previousFeature = fea;
						ft=fea;
						if(value == 'Polygon'){
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
	if(zoom == true)
	{
		if(value == 'Point'){
			zoomExtent =ft.getGeometry().getCoordinates();
			if(appConfigInfo.mapData == "google" || appConfigInfo.mapData=='hereMaps'){
				zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
			}else{
				zoomCoord = zoomExtent;
			}
			//console.log(zoomCoord);
			tmpl.Zoom.toXY({
		      map : mapObj,
		      latitude : zoomCoord[1],
		      longitude : zoomCoord[0]
		    });
		}else{
			zoomExtent =ft.getGeometry().getExtent();
			if(appConfigInfo.mapData == "google" || appConfigInfo.mapData=='hereMaps'){
				zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
			}else{
				zoomCoord = zoomExtent;
			}
			tmpl.Zoom.toExtent({
				map : mapObj,
				extent : zoomCoord
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
    modify1.on('modifyend',function(){
    	if(value==='Point' ){
			lonlat =ft.getGeometry().getCoordinates();
	    }
	    else if(value==='LineString'){
			lonlat =ft.getGeometry().getFirstCoordinate();
	    }
	    else if(value==='Polygon' || value==='Circle')
	    {
			// alert();
			console.log(value);
			lonlat =ft.getGeometry().getInteriorPoint().getCoordinates();
	    }
    	if(appConfigInfo.mapData == "google" || appConfigInfo.mapData=='hereMaps'){
    		wktGeom= format.writeGeometry(ft.getGeometry().clone().transform('EPSG:3857','EPSG:4326'));
    		coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
    		//console.log(wktGeom);
    		//console.log(ol.proj.transform([latlon[0],latlon[1]], 'EPSG:3857', 'EPSG:4326'));
    	}else{
    		wktGeom= format.writeGeometry(ft.getGeometry());
    		coord =lonlat;//ft.getGeometry().getCoordinates();
    		//console.log(wktGeom);
    		//console.log([latlon[0],latlon[1]]);
    	}

		resultGetEditDetails.geometry = {geometry : wktGeom, coordinates : coord, value : value};
		resultGetEditDetails.feature = ft;
		
    	callbackFunc(resultGetEditDetails.geometry);
    })
	mapObj.addInteraction(modify1);
}
	
tmpl.Feature.cancelDragDropDetails = function(){};
tmpl.Feature.dragDropDetails = function(param){
	var mapObj = param.map;
	var callbackFunc = param.callbackFunc;
	var img_url = param.img_url;
	var slyrName = param.sourceLayer;
	var dlyrName = param.destinationLayer;
	var ft,latlon,wktGeom,coord,value;
	var previousFeature;
	var restrict_layer;
	var zoomExtent,zoomCoord;
	var format = new ol.format.WKT();
	
	var layerS,featureTemp;
	for(var i=0;i<tmpl_setMap_layer_global.length;i++){
						if(tmpl_setMap_layer_global[i].title == slyrName){
							layerS = tmpl_setMap_layer_global[i].layer;

						}
					}
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	var selectfeatureIdEdit = new ol.interaction.Select({wrapX: false,condition: ol.events.condition.click});
 	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
				var dragedFeature;
			 window.app = {};
  var app = window.app;
var format = new ol.format.WKT();
  app.Drag = function() {
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

  app.Drag.prototype.handleDownEvent = function(evt) {
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {
			  //console.log(layer,feature.get('layer_name'));
			if(layer == null){
				if(feature.get('layer_name') == slyrName){
					feature.set('coord',feature.getGeometry().getCoordinates());
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
						  text:new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                text : feature.getStyle().getText().getText(),
                fill: new ol.style.Fill({
					color: feature.getStyle().getText().getFill().getColor(),
					width:20
                }),
                stroke : new ol.style.Stroke({
                    color : feature.getStyle().getText().getStroke().getColor(),
                    width:6
                })
            })
							}));
							layerS.getSource().addFeature(featureTemp);
					return feature;
				}
			}else if(layer.get('title') == slyrName){
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

  app.Drag.prototype.handleDragEvent = function(evt) {
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {    
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

  app.Drag.prototype.handleMoveEvent = function(evt) {
      if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
              return feature;
            });
        var element = evt.map.getTargetElement();
        if (feature) {
			editFeature = feature;
			point = feature.getGeometry().getCoordinates();
			var point;
			if(appConfigInfo.mapData=='google' ||appConfigInfo.mapData== 'hereMaps')		{
				point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
				}
			else
				{
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

  app.Drag.prototype.handleUpEvent = function(evt) {
	   var map = evt.map;
      var value=this.feature_.getGeometry().getType();
      if(value==='Point')
      {
        lonlat =this.feature_.getGeometry();
      }
      else if(value==='LineString')
      {
        lonlat =this.feature_.getGeometry();
      }
      else if(value==='Polygon')
      {
        lonlat =this.feature_.getGeometry();
      }
	
      if(appConfigInfo.mapData=='google' ||appConfigInfo.mapData=='hereMaps')
      {         
		coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        wktGeom= format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
      }
      else
      {
    	  coordinate = lonlat.getCoordinates();
          wktGeom= format.writeGeometry(lonlat);
      //  wktGeom= format.writeGeometry(this.feature_.getGeometry());
      }

		var result = {
			new_coordinates : coordinate
		};
		var dragFeature = this.feature_;
		
		if(dragFeature.getGeometry().getType() == 'Point' ){
			layerS.getSource().removeFeature(featureTemp);
			lonlat = dragFeature.getGeometry().getCoordinates();
			dragFeature.getGeometry().setCoordinates(dragFeature.get('coord'));
			
			for(var i=0;i<tmpl_setMap_layer_global.length;i++){
				var lyr = tmpl_setMap_layer_global[i].title;
				if(dlyrName.indexOf(lyr) != -1){
					restrict_layer = tmpl_setMap_layer_global[i].layer;
					//lonlat =tempFea.getGeometry().getCoordinates();
					var closestFeature = restrict_layer.getSource().getClosestFeatureToCoordinate(lonlat);
					
					var resultLocation = lonlat;
					
					var c1 = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
					
					
					
					var c2 = ol.proj.transform(closestFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					var line = new ol.geom.LineString([c1, c2]);
					var len = line.getLength()*100;
					console.log(len);
					var setZoomWiseLength = 0;
					if(map.getView().getZoom() <= 12){
						setZoomWiseLength = 0.8;
					}else if(map.getView().getZoom() == 13){
						setZoomWiseLength = 0.4;
					}else if(map.getView().getZoom() == 14){
						setZoomWiseLength = 0.1;
					}else if(map.getView().getZoom() == 15){
						setZoomWiseLength = 0.09;
					}else if(map.getView().getZoom() == 16){
						setZoomWiseLength = 0.05;
					}else if(map.getView().getZoom() == 17){
						setZoomWiseLength = 0.03;
					}else if(map.getView().getZoom() == 18){
						setZoomWiseLength = 0.02;
					}else if(map.getView().getZoom() == 19){
						setZoomWiseLength = 0.01;
					}else if(map.getView().getZoom() == 20){
						setZoomWiseLength = 0.01;
					}else if(map.getView().getZoom() == 21){
						setZoomWiseLength = 0.01;
					}
					if(appConfigInfo.mapData==='google' || appConfigInfo.mapData=='hereMaps')
					{
						if(len < setZoomWiseLength){
						//alert("already Exist");
						var res = {
							source : dragFeature.getProperties(),
							destination : closestFeature.getProperties(),
							location: c1
						};
						callbackFunc(res);
						}else{
						
						var res = {
							source : dragFeature.getProperties(),
							destination : '',
							location: c1
						};
						callbackFunc(res);
						}
					}else{
						if(len < setZoomWiseLength){
						//alert("already Exist");
						var res = {
							source : dragFeature.getProperties(),
							destination : closestFeature.getProperties(),
							location: resultLocation
						};
						callbackFunc(res);
						}else{
						
						var res = {
							source : dragFeature.getProperties(),
							destination : '',
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
  intr=new app.Drag();
  mapObj.addInteraction(intr);
	tmpl.Feature.cancelDragDropDetails = function(param){
		var map = param.map;
		 map.removeInteraction(intr);
	}
}

	
//------------------------------------ End of Drawing Tools ---------------------------------------------//



//---------------------------------- Beginning of Custom Overlays ---------------------------------------//

// **** creating a custom Overlay **** //

/*tmpl.Overlay.create = function(param){
	var mapObj = param.map;
	var jsonobj = param.features;
	var layerName = param.layer;
	var getdata = jsonobj;
	if(getdata.length==0){
		return false;
	}
	var featureDataAry = [];
    for (var i = 0, length = getdata.length; i < length; i++) {
		var geometry;
		if(appConfigInfo.mapData==='google'){
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else{
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
            "id"          : getdata[i].id,
            "label"       : getdata[i].label,
            "labelcolor"  : getdata[i].label_color,
            "icon"        : getdata[i].img_url,
            "lat"         : getdata[i].lat,
            "lon"         : getdata[i].lon,
            geometry: geometry
        });
		featureval.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: "yellow" 
            }),
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
				src: getdata[i].img_url
            })),
            text:new ol.style.Text({
                font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                text : getdata[i].label,
                fill: new ol.style.Fill({
                    color: getdata[i].label_color,
                    width:20
                }),
				stroke : new ol.style.Stroke({
					color : getdata[i].label_bgcolor,     //,"label_bgcolor":"blue"
					width:8
                })
			})
		}));
		featureDataAry.push(featureval);
	}
	var source=  new ol.source.Vector({
        features: featureDataAry
    });
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var isLayerPresent = false;
	for(var i=0;i<length;i++){
		var layerTemp = Layers.item(i);
		if(layerTemp.get('title') === layerName){
			isLayerPresent = true;
			layerTemp.getSource().addFeatures(featureDataAry);
		}
	}
	if (!isLayerPresent) {
		var overlay = new ol.layer.Vector({
            title: layerName,
            visible: true,
            source: source
        });
		mapObj.addLayer(overlay);
		mapObj.addControl(new ol.control.LayerSwitcher());
	}
	return true;
}*/

// **** Zoom to XY with custom zoom level  Ms.PPK 09-11-16 12.44pm**** //

tmpl.Zoom.toXYcustomZoom = function(param){
	console.log(param);
	var mapObj = param.map;
	var zoomLevel = param.zoom;
	var lat = parseFloat(param.latitude);
	var lng = parseFloat(param.longitude);
	var callbackFunc = param.callbackFunc;
	if(appConfigInfo.mapData == "google" || appConfigInfo.mapData=='hereMaps'){
		mapObj.getView().setZoom(zoomLevel);
		mapObj.getView().setCenter(ol.proj.transform([lng,lat], 'EPSG:4326', 'EPSG:3857'));
		setTimeout(function(){
			if(param.callbackFunc){
				callbackFunc();
			}
		},1500);
	}else{
		mapObj.getView().setCenter([lng,lat]);
		mapObj.getView().setZoom(zoomLevel);
		setTimeout(function(){
			if(param.callbackFunc){
				callbackFunc();
			}
		},1500);
	}	
}

// **** creating a custom Overlay and adding that layer to the layer switcher **** //
function getFeatureLabel(){
    var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if(layer){
		if(layer.get('trip') == "TripAnimationLayer"){
							 return feature;
		}
	}
	});
    ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
    if (feature_mouseOver) {
        overlay_mouseOver_trip.setPosition(evt.coordinate);
		ta_tooltip.innerHTML = feature_mouseOver.getProperties().location +"," + "Speed:" + feature_mouseOver.getProperties().speed +"," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
    }
};


tmpl.Overlay.create = function(param){
	var mapObj = param.map;
	var jsonobj = param.features;
	var layerName = param.layer;
	//console.log(layerName,"From API");
	var getHoverLabel = param.getHoverLabel;
	var layerSwitcher = param.layerSwitcher;
	var trackLayer = param.trackLayer;
	//console.log(trackLayer);
	var image_scale = param.icon_scale;
	var getdata = jsonobj;
	if(image_scale == undefined)
			image_scale = 1;
	if(getdata.length==0){
		return false;
	}
	if(trackLayer == false || trackLayer == undefined){
		var featureDataAry = [];
	
    for (var i = 0, length = getdata.length; i < length; i++){
		var geometry;
		var anagle; 
		if(getdata[i].ot_track_angle != undefined)
			anagle = getdata[i].ot_track_angle;
		else
			anagle = 0;
		
		
		var iconStyle = new ol.style.Icon( ({
                src: getdata[i].img_url,
				anchor: [0.5, 1],
				scale : image_scale,
				// rotation: anagle											//Commented by Prashanth
            }));
		// var iconStyle = new ol.style.Icon( ({
                // src: getdata[i].img_url,
				// anchor: [0.5, 1],
				// scale : image_scale
            // }));
		if(appConfigInfo.mapData==='google' || appConfigInfo.mapData=='hereMaps'){
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else{
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
            geometry     : geometry
        });
		featureval.setId(getdata[i].id);
		featureval.setProperties(getdata[i]);
		
		if(getdata[i].label_color == undefined){
			getdata[i].label_color = '#ffffff00';
		}
		
		if(getdata[i].label_bgcolor == undefined){
			getdata[i].label_bgcolor = '#ffffff00';
		}
		
		if(getHoverLabel == true){
			
		featureval.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            image: iconStyle
		}));
	
		}else{
		featureval.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            image: iconStyle,
            text:new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                text : getdata[i].label,
                fill: new ol.style.Fill({
					color: getdata[i].label_color,
					width:20
                }),
                stroke : new ol.style.Stroke({
                    color : getdata[i].label_bgcolor,
                    width:6
                })
            })
		}));
		}
		featureval.set('layer_name',layerName);
		featureDataAry.push(featureval);
	}
	if(getHoverLabel == true){
		
			var ta_tooltip = document.createElement('tooltip');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
    mapObj.addOverlay(overlay_mouseOver_label);
		mapObj.on('pointermove', function(evt){
			
			var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			//if(layer){
				if(feature.get('layer_name') == layerName){
					return feature;
				}
			//}
			});
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			if(feature_mouseOver) {
				overlay_mouseOver_label.setPosition(evt.coordinate);
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
			}
		});
	}
	var source=  new ol.source.Vector({
        features: featureDataAry
    });
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var OverlayisLayerPresent = false;
	for(var i=0;i<length;i++){
		var layerTemp = Layers.item(i);
		if(layerTemp.get('title') === layerName){
			OverlayisLayerPresent = true;
			layerTemp.getSource().addFeatures(featureDataAry);
		}
	}
	
	for(var j=0;j<tmpl_setMap_layer_global.length;j++){
		if(tmpl_setMap_layer_global[j].title == layerName){
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
			layer : overlay,
			title :  layerName,
			visibility : true,
			map : mapObj
		});
		overlay.setMap(mapObj);
		//mapObj.addLayer(overlay);
		//if(layerSwitcher)
			//mapObj.addControl(new ol.control.LayerSwitcher());
		OverlayisLayerPresent = true;
	}
	}else if(trackLayer == true){
		//console.log("Track Layer");
		var featureDataAry = [];
	
    for (var i = 0, length = getdata.length; i < length; i++){
		var geometry;
		console.log("getdata::",getdata);
		if(global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + getdata[i].id) == -1){
		//console.log("coming insideeeeeeeeeee");
		
		var anagle; 
		// console.log("TRACK ANGLE FROM API======>",getdata[i].ot_track_angle);
		if(getdata[i].ot_track_angle != undefined)
			anagle = getdata[i].ot_track_angle;
		else
			anagle = 0;
		
		console.log("ANGLE==========>",anagle);
		var iconStyle = new ol.style.Icon( ({
                src: getdata[i].img_url,
				anchor: [0, 0],
				scale : image_scale,
				// rotation: anagle,									//Commented by Prashanth
				// rotation: 0
            }));
		if(appConfigInfo.mapData==='google' || appConfigInfo.mapData=='hereMaps'){
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else{
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
            geometry     : geometry
        });
		featureval.set('layer_name',layerName);
		featureval.setProperties(getdata[i]);
		if(getHoverLabel == true){
			
		featureval.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            image: iconStyle
		}));
	
		}else{
		featureval.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            image: iconStyle,
            text:new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                text : getdata[i].label,
                fill: new ol.style.Fill({
					color: getdata[i].label_color,
					width:20
                }),
                stroke : new ol.style.Stroke({
                    color : getdata[i].label_bgcolor,
                    width:6
                })
            })
		}));
		}
		featureDataAry.push(featureval);
		
		
	// global_fleet_layer_id[i] = 'fleet_'+layerName+'_'+getdata[i].id;
	// global_fleet_layer_features[i] = featureval;
	// var v1 = new tmpl.Track.smoothMovement({map : mapObj,id:getdata[i].id,layername:layerName,feature:featureval,featureId:'fleet_'+layerName+'_'+getdata[i].id});
	// global_fleet_layer_objects[i] = v1;
	// var point = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
	// v1.sendTrackData(point);
	//console.log(getdata[i].id);
	global_fleet_layer_id.push('fleet_'+layerName+'_'+getdata[i].id);
	global_fleet_layer_features.push(featureval);
	var v1 = new tmpl.Track.smoothMovement({map : mapObj,id:getdata[i].id,layername:layerName,feature:featureval,featureId:'fleet_'+layerName+'_'+getdata[i].id});
	global_fleet_layer_objects.push(v1);
	var point = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
	v1.sendTrackData(point);
	
		}
	}
	
	//alert("Out side Number of features inserting : "+featureDataAry.length);
	if(featureDataAry.length > 0){
		//console.log("Number of features inserting : ",featureDataAry.length);
	if(getHoverLabel == true){ 
		
	var ta_tooltip = document.createElement('tooltip');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
    mapObj.addOverlay(overlay_mouseOver_label);
		mapObj.on('pointermove', function(evt){
			
			var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
				if(layer == null){
					if(feature.get('layer_name') == layerName){
						return feature;
					}
				}else{
					if(layer){
						if(layer.get('title') == layerName){
							return feature;
						}
					}
				}
			
			});
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			if(feature_mouseOver) {
				overlay_mouseOver_label.setPosition(evt.coordinate);
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
			}
		});
	}
	var source=  new ol.source.Vector({
        features: featureDataAry
    });
	
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var OverlayisLayerPresent = false;
	for(var i=0;i<length;i++){
		var layerTemp = Layers.item(i);
		if(layerTemp.get('title') === layerName){
			OverlayisLayerPresent = true;
			layerTemp.getSource().addFeatures(featureDataAry);
		}
	}
	
	for(var j=0;j<tmpl_setMap_layer_global.length;j++){
		if(tmpl_setMap_layer_global[j].title == layerName){
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
			layer : overlay,
			title :  layerName,
			visibility : true,
			map : mapObj
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

tmpl.Track.withoutLine = function(param){
	//console.log(global_fleet_layer_objects);
	var data = param.data;
	var properties = param.properties;
	for(var i=0;i<data.length;i++){
		var fleet_overlayId = 'fleet_'+data[i].layerName+'_'+data[i].id;
		var index = global_fleet_layer_id.indexOf(fleet_overlayId);
		var fleet_overlay = global_fleet_layer_features[index];
		var fleet_overlay_object = global_fleet_layer_objects[index];
		var pos = [data[i].lon,data[i].lat];
		var properties = data[i].properties;
		if(fleet_overlay_object != undefined)
		fleet_overlay_object.sendTrackData(pos,properties);

	}
}

tmpl.Track.smoothMovement = function(param) {
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
			sendTrackData : function (pos,properties){

if(properties != undefined){
	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			this.feature.set(key,properties[key]);
		}
	}
}
			if(this.fleet_points.length > 1){
				if(this.fleet_points[this.fleet_points.length-1][0] == pos[0] && this.fleet_points[this.fleet_points.length-1][1] == pos[1]){
				}else{
					this.fleet_points.push(pos);
				}
			}else{
				this.fleet_points.push(pos);
			}
			if(this.fleet_points.length > 1){
			if(this.first_fleet_flag == true){
				this.startFleet();
				this.first_fleet_flag = false;
			}
			}
		},
		startFleet : function (){
			//if(this.fleet_points.length > 1){
				//if(this.vehicleId == 'KA02G1117')
				//console.log(this.fleet_points);
				var point = this.fleet_points[1];
				var p_point = this.fleet_points[0];
				point[0] = parseFloat(point[0]);
				point[1] = parseFloat(point[1]);
				p_point[0] = parseFloat(p_point[0]);
				p_point[1] = parseFloat(p_point[1]);
				if(appConfigInfo.mapData == "google" || appConfigInfo.mapData=="hereMaps"){
					point = ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857');
					p_point = ol.proj.transform(p_point, 'EPSG:4326', 'EPSG:3857');
				}
				else{
					
				}
				
				this.drawAnimatedLine(p_point,point,50,10000);
			//}
		},
		drawAnimatedLine : function (startPt, endPt, steps, time){
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
				if(itsparent.fleet_points.length > 1){
					itsparent.startFleet();
				}else{
					itsparent.first_fleet_flag = true;
				}
	        }
	        newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
			//itsparent.panMap(newEndPt);
			//console.log(angle);
			if(isNaN(angle) == false)
			itsparent.feature.getStyle().getImage().setRotation(angle);			
			// itsparent.feature.getStyle().getImage().setRotation(0);			//Changed by Prashanth by commenting above line
			itsparent.feature.getGeometry().setCoordinates(newEndPt);
	        i++;
	    }, time/50);
		
		},
		clearTrack : function(){
			 clearInterval(this.track_ivlDraw);
		}
	}

// **** This function displays the given geometry as layer with default styles **** //


 /* tmpl.Overlay.addGeometry = function(param){
	var mapObj = param.map;
	var lyrName = param.layer;
	var property = param.properties;
	var getHoverLabel = param.getHoverLabel;
	var geometryVal = param.geometry;
	var format = new ol.format.WKT();
	var feature;
	if(appConfigInfo.mapData == 'google' || appConfigInfo.mapData=='hereMaps'){
		feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
	}
	else{
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
        });
	} 
	if(getHoverLabel == true){
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
	}else{
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
        text:new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                // textBaseline: 'bottom',
                // offsetX : parseInt(0, 10),
                // offsetY : parseInt(0, 10),
                text : property.label,
                fill: new ol.style.Fill({
					color: property.label_color,
					width:20
                }),
                stroke : new ol.style.Stroke({
                    color : property.label_bgcolor,
                    width:6
                })
            })
    }));
	}
	feature.setProperties(property);
	feature.set('layer_name',lyrName);
	var source=  new ol.source.Vector({
		features: [feature]
	});
	
	

	if(getHoverLabel == true){
		
			var ta_tooltip = document.createElement('tooltip');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
    mapObj.addOverlay(overlay_mouseOver_label);
		mapObj.on('pointermove', function(evt){
			
			var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature) { //, layer
			//if(layer){
				//console.log("FT >>",feature.get('layer_name'));
				if(feature.get('layer_name') == lyrName){
					return feature;
				}
			//}
			});
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			if(feature_mouseOver) {
				overlay_mouseOver_label.setPosition(evt.coordinate);
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
			}
		});
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var isLayerPresent11 = false;
	var existing;
	for(i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === lyrName){
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==property.id){
						existingLayer.getSource().removeFeature(fea);
					}
				});
				isLayerPresent11 = true;
				//existingLayer.getSource().clear();
				existingLayer.getSource().addFeature(feature);
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == lyrName){
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==property.id){
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
			layer : newLayer,
			title :  lyrName,
			visibility : true,
			map : mapObj
		});
		isLayerPresent11 == true;
		//mapObj.addLayer(newLayer);
		newLayer.setMap(mapObj);
//		mapObj.addControl(new ol.control.LayerSwitcher());
	}
	
}
*/

tmpl.Overlay.addGeometry = function(param){
	var mapObj = param.map;
	var lyrName = param.layer;
	var property = param.properties;
	var getHoverLabel = param.getHoverLabel;
	var geometryVal = param.geometry;
	var format = new ol.format.WKT();
	var feature;
	if(appConfigInfo.mapData == 'google' || appConfigInfo.mapData=='hereMaps'){
		feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
	}
	else{
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
        });
	} 
	if(getHoverLabel == true){
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
	}else{
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
        text:new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
                textAlign:'center',
                /*textBaseline: 'bottom',
                offsetX : parseInt(0, 10),
                offsetY : parseInt(0, 10),*/
                text : property.label,
                fill: new ol.style.Fill({
					color: property.label_color,
					width:20
                }),
                stroke : new ol.style.Stroke({
                    color : property.label_bgcolor,
                    width:6
                })
            })
    }));
	}
	feature.setProperties(property);
	feature.set('layer_name',lyrName);
	var source=  new ol.source.Vector({
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
	for(i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === lyrName){
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==property.id){
						existingLayer.getSource().removeFeature(fea);
					}
				});
				isLayerPresent11 = true;
				//existingLayer.getSource().clear();
				existingLayer.getSource().addFeature(feature);
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == lyrName){
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (fea) {
					if(fea.getProperties()['id']==property.id){
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
			layer : newLayer,
			title :  lyrName,
			visibility : true,
			map : mapObj
		});
		isLayerPresent11 == true;
		//mapObj.addLayer(newLayer);
		newLayer.setMap(mapObj);
//		mapObj.addControl(new ol.control.LayerSwitcher());
	}
	
}

// **** This function displays the given geometry as layer in user specified colors **** //
var addGoemetryFlag = false;
/*tmpl.Overlay.addGeometryWithColor = function(param){
	var mapObj = param.map;
	var geometryVal = param.geometry;
	//console.log(param.properties)
	var property = param.properties;
	var colorval = param.color;
	var lyrName = param.layer;
	var borderColor = param.borderColor;
	var label = param.label;
	var borderAnimate = param.borderAnimate;
	var getHoverLabel  = param.getHoverLabel;
	var format = new ol.format.WKT();
	var color;
  	if(appConfigInfo.mapData==='google'){
    	var feature = format.readFeature(geometryVal, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
		var strokeColor
		if(borderColor == undefined)
			strokeColor = colorval;
		else
			strokeColor = borderColor;
		feature.set('label',label);
		feature.set('color',strokeColor);
    	feature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: colorval
            }),
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: 1
            }),
            image: new ol.style.Circle({
                radius: 1,
                fill: new ol.style.Fill({
                    color:colorval
                })
            })
        }));
	}
	else
	{
	    var feature = format.readFeature(geometryVal, {
	      dataProjection: 'EPSG:4326',
	      featureProjection: 'EPSG:4326'
	    });
		feature.set('label',label);
		feature.set('color',strokeColor);
	    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
	    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
	    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
	    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
	    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
	    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
	    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
	    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
	    "honeydew":"#f0fff0","hotpink":"#ff69b4",
	    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
	    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
	    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
	    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
	    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
	    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
	    "navajowhite":"#ffdead","navy":"#000080",
	    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
	    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
	    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
	    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
	    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
	    "violet":"#ee82ee",
	    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
	    "yellow":"#ffff00","yellowgreen":"#9acd32"};

	    if (typeof colours[colorval.toLowerCase()] != 'undefined')
	        var colorfinal= colours[colorval.toLowerCase()];
	    var hexColor = colorfinal;
	    if(hexColor)
	    {
	      color = ol.color.asArray(hexColor);
	      color = color.slice();
	      color[3] = 0.5;
	    }
	    else
	    {
	      color = colorval;
	    }
		
		var strokeColor
		if(borderColor == undefined)
			strokeColor = colorval;
		else
			strokeColor = borderColor;
	    feature.setStyle(new ol.style.Style({
              fill: new ol.style.Fill({
                  color: colorval
              }),
              stroke: new ol.style.Stroke({
                  color: strokeColor,
                  width: 1
              }),
              image: new ol.style.Circle({
                  radius: 1,
                  fill: new ol.style.Fill({
                      color:colorval
                  })
              })
        }));
	}
    if(property){
        feature.setProperties(property);
  	}
	feature.set('layer_name',lyrName);
	//console.log(feature);
    var source =  new ol.source.Vector({
        features: [feature]
    });
	var lyrs = mapObj.getLayers();
	var length = lyrs.getLength();
	var isLayerPresent = false;
	var existing;
	for(i=0;i<length;i++){
	    var l1=lyrs.item(i);
	    if(l1)
	    {
	      lyrtest  =   l1;
	      if(l1.get('title') === lyrName)
	      {
			  existing = l1;
	         isLayerPresent = true;
	         //l1.getSource().clear();
	         l1.getSource().addFeature(feature);
	      }
	    }
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == lyrName){
				 isLayerPresent = true;
				 //tmpl_setMap_layer_global[i].layer.getSource().clear();
	         tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
			}
		}
		
	}
	var gblanimationfeature = '',gblanimationfeaturecolor = '';
	
	if (!isLayerPresent)
	{
	   var layerVal = new ol.layer.Vector({
	                      title: lyrName,
	                      visible: true,
	                      source: source
	                });
		tmpl_setMap_layer_global.push({
			layer : layerVal,
			title :  lyrName,
			visibility : true,
			map : mapObj
		});
//console.log(label);
		if(label != undefined){
				
	
	var animateBorder = setInterval(function(){}, 1000);
		 var ta_tooltip = document.createElement('tooltip');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
   var  overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
	mapObj.addOverlay(overlay_mouseOver_label);
var gblanimationfeature = '',gblanimationfeaturecolor = '';
mapObj.on('pointermove', function(evt){
			var layera
			var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			//if(layer){
				
				if(feature.get('layer_name') == lyrName){
				
					return feature;
				}
			//}
			});
			
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			
			
			if(feature_mouseOver) {
			if(gblanimationfeature != ''){
				try{
				gblanimationfeature.getStyle().getStroke().setColor(gblanimationfeature.get('color'));
				gblanimationfeature.getStyle().getStroke().setWidth(1);
				layerVal.getSource().removeFeature(gblanimationfeature);
				layerVal.getSource().addFeature(gblanimationfeature);
				}catch(e){
				}	
			}
				gblanimationfeature = feature_mouseOver;
				gblanimationfeaturecolor = strokeColor;
				overlay_mouseOver_label.setPosition(evt.coordinate);
				ta_tooltip.innerHTML = feature_mouseOver.get('label');
				if(borderAnimate){
	
							feature_mouseOver.getStyle().getStroke().setColor("#f00");
							feature_mouseOver.getStyle().getStroke().setWidth(3);
							layerVal.getSource().removeFeature(feature_mouseOver);
							layerVal.getSource().addFeature(feature_mouseOver);
				
				}
			}
		});
	//}
	}
	
	   // mapObj.addLayer(layerVal);
	    layerVal.setMap(mapObj);
	//    mapObj.addControl(new ol.control.LayerSwitcher());
	}
}*/


tmpl.Overlay.addGeometryWithColor = function(param){
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
	var getHoverLabel  = param.getHoverLabel;
	var dottedLine = param.dottedLine;
	var format = new ol.format.WKT();
	var color;
	if(borderWidth == undefined){
		borderWidth = 1;
	}
	if(dottedLine == undefined){
		dottedLine = [0, 0];
	}
	if(appConfigInfo.mapData==='google' ||appConfigInfo.mapData== 'hereMaps'){
	
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
		
		var strokeColor
		if(borderColor == undefined)
			strokeColor = colorval;
		else
			strokeColor = borderColor;
		
		
		feature.set('label',label);
		feature.set('color',strokeColor);
		feature.setStyle(new ol.style.Style({
		 
			fill: new ol.style.Fill({
				color: colorval,
				opacity : 0.2
			}),
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: borderWidth,
				lineDash: dottedLine
			}),
			image: new ol.style.Circle({
				radius: 1,
				fill: new ol.style.Fill({
					color:colorval,
					opacity : 0.2
				})
			})
		}));
	}
	else
	{
	
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
		});
		feature.set('label',label);
		feature.set('color',strokeColor);
		var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
				"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
				"cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
				"darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
				"darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
				"darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
				"firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
				"gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
				"honeydew":"#f0fff0","hotpink":"#ff69b4",
				"indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
				"lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
				"lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
				"lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
				"magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
				"mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
				"navajowhite":"#ffdead","navy":"#000080",
				"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
				"palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
				"red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
				"saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
				"tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
				"violet":"#ee82ee",
				"wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
				"yellow":"#ffff00","yellowgreen":"#9acd32"};

		if (typeof colours[colorval.toLowerCase()] != 'undefined')
			var colorfinal= colours[colorval.toLowerCase()];
		var hexColor = colorfinal;
		if(hexColor)
		{
			color = ol.color.asArray(hexColor);
			color = color.slice();
			color[3] = 0.5;
		}
		else
		{
			color = colorval;
		}

		var strokeColor
		if(borderColor == undefined)
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
					color:colorval
				})
			})
		}));
	}
	if(property){
		feature.setProperties(property);
	}
	//feature.set('title',lyrName);
	feature.set('layer_name',lyrName);
	//console.log(feature);
	var source =  new ol.source.Vector({
		features: [feature]
	});
	var lyrs = mapObj.getLayers();
	var length = lyrs.getLength();
	var isLayerPresent = false;
	var existing;
	for(i=0;i<length;i++){
		var l1=lyrs.item(i);
		if(l1)
		{
			lyrtest  =   l1;
			if(l1.get('title') === lyrName)
			{
				existing = l1;
				isLayerPresent = true;
				//l1.getSource().clear();
				l1.getSource().addFeature(feature);
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == lyrName){
				isLayerPresent = true;
				//tmpl_setMap_layer_global[i].layer.getSource().clear();
				tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
			}
		}

	}
	var gblanimationfeature = '',gblanimationfeaturecolor = '';

	if (!isLayerPresent)
	{
		var layerVal = new ol.layer.Vector({
			title: lyrName,
			visible: true,
			source: source
		});
		console.log("Polygon layerVal:",layerVal);
		//alert();
		
		
		//layerVal.setZIndex(200);
		tmpl_setMap_layer_global.push({
			layer : layerVal,
			title :  lyrName,
			visibility : true,
			map : mapObj
		});
		layerVal.setMap(mapObj);
	}
	//	console.log(label);
	if(label != undefined){

		if(getHoverLabel == true){

			var ta_tooltip = document.createElement('tooltip');
			ta_tooltip.id = 'trip-tooltip';
			ta_tooltip.className = 'ol-trip-tooltip';
			var  overlay_mouseOver_label = new ol.Overlay({
				element: ta_tooltip,
				offset: [10, 0],
				positioning: 'bottom-left'
			});
			
			mapObj.addOverlay(overlay_mouseOver_label);
			
			mapObj.on('pointermove', function(evt){
				var layera
				var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
					if(feature.get('layer_name') == lyrName){

						return feature;
					}
				});

				ta_tooltip.style.display = feature_mouseOver ? '' : 'none';

				if(feature_mouseOver) {
					overlay_mouseOver_label.setPosition(evt.coordinate);
					ta_tooltip.innerHTML = feature_mouseOver.get('label');
				}
			});
			
		}
	}
}

tmpl.Overlay.addMarker = function(param){
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
	if(mr_olyrID){
		mapObj.removeOverlay(mr_olyrID);
	}
	var container=document.createElement('div');
	container.className = 'containerAPI ';
	var elem = document.createElement("img");
	elem.setAttribute("src",img_url);
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
    if(appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps'){
    	marker_pos.setPosition(ol.proj.transform([x,y], 'EPSG:4326','EPSG:3857'));
    }
    else{
    	marker_pos.setPosition([x,y]);	
    }
    marker_pos.setProperties({olname:"markerOverlay"});
}
tmpl.Overlay.markerWithName = function(param){
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
	var overlayIDL = mapObj.getOverlayById(id+'label');
	if(overlayID){
		mapObj.removeOverlay(overlayID);
		mapObj.removeOverlay(overlayIDL);
	}
	var container=document.createElement('div');
	container.className = 'containerAPI '	
	var container1=document.createElement('div');
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
        id: id+'label',
        element: container,
        offset: offset,
        positioning: 'center-center'
    });
    mapObj.addOverlay(marker_pos);
    mapObj.addOverlay(marker_pos1);
    if(appConfigInfo.mapData == 'google' || appConfigInfo.mapData=='hereMaps'){
		marker_pos.setPosition(ol.proj.transform([parseFloat(lon),parseFloat(lat)], 'EPSG:4326','EPSG:3857'));
		marker_pos1.setPosition(ol.proj.transform([parseFloat(lon),parseFloat(lat)], 'EPSG:4326','EPSG:3857'));
    }
    else{ 
		marker_pos.setPosition([lon,lat]);
		marker_pos1.setPosition([lon,lat]);
    }
    marker_pos.setProperties({olname:"searchOverlay"});
    marker_pos1.setProperties({olname:"searchOverlay"});
}
tmpl.Overlay.removeMarker = function(param){
	var mapObj = param.map;
	var id = param.id;
	var mr_olyrID = mapObj.getOverlayById(id);
	var mr_olyrID1 = mapObj.getOverlayById(id+'label');
	if(mr_olyrID){
		mapObj.removeOverlay(mr_olyrID);
		if(mr_olyrID1 != undefined)
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
tmpl.Route.clearRoute = function(param) {
  var mapObj = param.map;
  var layer = param.layer;				//Added by Prashanth on 25-07-2019
  if (routeLayer != undefined)
    routeLayer.getSource().clear();
  if (routeVector_line != undefined)
    routeVector_line.getSource().clear();
  if (routeLayer_waypoint != undefined)
    routeLayer_waypoint.getSource().clear();
  totalDistance = 0;
  
  			try{
			mapObj.getLayers().forEach(function (layer) {
		
				 if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				}else{
				//mapObj.removeLayer(layer);
				console.log("No Layer Available..!");
				}
			});
			}catch(e){console.log("Layer Not Available..!");}
  
  if(layer){
		var existing;						//Added this layer remove functionality by Prashanth on 25-07-2019
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for(var i=0;i<length;i++){
			var existingLayer=Layers.item(i);
			if(existingLayer){
				if(existingLayer.get('lname') === layer){
				// if(existingLayer.get('lname') === layer){
					existing = existingLayer;
					mapObj.removeLayer(existingLayer);				
				}
			}
		} 
	}
				try{
			mapObj.getLayers().forEach(function (layer) {
		
				 if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				}else{
				//mapObj.removeLayer(layer);
				console.log("No Layer Available..!");
				}
			});
			}catch(e){console.log("Layer Not Available..!");}
}
tmpl.Route.getRoute = function(param) {
	var mapObj = param.map;
	tmpl.Route.clearRoute(mapObj);
  if (appConfigInfo.mapData == "google") {
  
			if(appConfigInfo.mapDataService=='esri')
			{
			getEsriRoute(param);
			}
			else
			{
			getGoogleRoute(param);
			}
  }
else if (appConfigInfo.mapData == "hereMaps")
				{
				getHereMapsRoute(param);
				}  
else if(appConfigInfo.mapData=='sgl'){
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

function getSGLRoute(param){
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
		  "url": appConfigInfo.sglTransformwk+"?wkt=POINT("+sourcePoint[0]+" "+ sourcePoint[1]+")&srid=4326&output_srid=32645&astext=true",
		  "method": "GET",
		  "timeout": 0,
		  "headers": {
			"Authorization": appConfigInfo.sglToken
		  },
		};

		$.ajax(settings).done(function (response) {
		 console.log("response:",response);
		 tempPoint = response[0].geometry ;
		 tempPoint = tempPoint.slice(6);
		 tempPoint = tempPoint.replace(')', '');
		 tempPoint = tempPoint.split(" ");
		 console.log("tempPoint:",tempPoint);
		 sourcePointfinal = tempPoint;
		 
		 //convert lat lon
				 var settings = {
				  "url": appConfigInfo.sglTransformwk+"?wkt=POINT("+destinationPoint[0]+" "+ destinationPoint[1]+")&srid=4326&output_srid=32645&astext=true",
				  "method": "GET",
				  "timeout": 0,
				  "headers": {
					"Authorization": appConfigInfo.sglToken
				  },
				};

				$.ajax(settings).done(function (response) {
				 console.log("response:",response);
				 tempPoint = response[0].geometry ;
				 tempPoint = tempPoint.slice(6);
				 tempPoint = tempPoint.replace(')', '');
				 tempPoint = tempPoint.split(" ");
				 console.log("tempPoint:",tempPoint);
				 destinationPointfinal  = tempPoint;
				 console.log ("sourcePointfinal,destinationPointfinal",sourcePointfinal,destinationPointfinal);	
				 
				 //Get Route Fetcher ID
								 var settings = {
									  "url": appConfigInfo.sglGetShortestPath+"?x1="+sourcePointfinal[0]+"&y1="+sourcePointfinal[1]+"&x2="+destinationPointfinal[0]+"&y2="+destinationPointfinal[1],
									  "method": "GET",
									  "timeout": 0,
									};

									$.ajax(settings).done(function (response) {
									  console.log(response.ogcfids);
											
											// Road Center Line 
											var settings = {
															  "url": appConfigInfo.sglGetTableDetails+"/road_centerlines?filter=ogc_fid in ("+response.ogcfids+") ",
															  "method": "GET",
															  "timeout": 0,
															  "headers": {
																"Authorization": appConfigInfo.sglToken
															  },
															};
															$.ajax(settings).done(function (response) {
															  console.log(response);  
																	for( z=0;z<response.length;z++)
																		{		
																		var temp1 = response[z].geom ; 
																			
																			 routeLine.push({
																				line: temp1
																			});
																		console.log("Line added");							
																		}		
																		routetempArr.push({
																				lines: routeLine
																			});	
																		console.log("temp1::",routetempArr);
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
															});
									  
									 				
									});
				 
				});
	
		});
		
					function sglCreateRouteLayer(routeLine,param)
					{
	
				console.log ("sglCreateRouteLayer line:",routeLine);
				
				try{
				tmpl.Layer.clearData({map : param.map,layer : 'RoutePoint'});
				tmpl.Layer.clearData({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RoutePoint'});
				}
				catch(e){
				console.log("Line Layer Creation Error..!",e);
				}
	
					tmpl.Overlay.addGeometry({
									map : param.map,
									geometry : routeLine,
									properties : {
										id : 1,
										name : "path",
										type : "visited",
									},
									layer : 'RouteLineLayer'
								});
			
						var srcIconStyle = new ol.style.Icon(({
									src: sourceIcon,
									anchor: [0.5, 1],
									scale : 1.0
								}));			
								var destIconStyle = new ol.style.Icon(({
									src: destinationIcon,
									anchor: [0.5, 1],
									scale : 1.0
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
								
								srcfeatureVal.set('layer_name','RoutePoint');
								destfeatureVal.set('layer_name','RoutePoint');
								
								var src =  new ol.source.Vector({
									features: [srcfeatureVal]
								});
								var dest =  new ol.source.Vector({
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

	function getSGLRoute1(param){
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
			"url": appConfigInfo.sglTransformwk+"wkt=POINT("+sourcePoint[0]+" "+sourcePoint[1]+")&srid=4326&output_srid=32644&astext=true",
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
		 console.log("response:",response);
		 tempPoint = response[0].geometry ;
		 tempPoint = tempPoint.slice(6);
		 tempPoint = tempPoint.replace(')', '');
		 tempPoint = tempPoint.split(" ");
		 console.log("tempPoint:",tempPoint);
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
					"url": appConfigInfo.sglTransformwk+"wkt=POINT("+destinationPoint[0]+" "+destinationPoint[1]+")&srid=4326&output_srid=32644&astext=true",
					"method": "GET",
					"timeout": 0,
					"headers": {
					  "Authorization": appConfigInfo.sglToken
					},
				  };

				$.ajax(settings).done(function (response) {
				 console.log("response:",response);
				 tempPoint = response[0].geometry ;
				 tempPoint = tempPoint.slice(6);
				 tempPoint = tempPoint.replace(')', '');
				 tempPoint = tempPoint.split(" ");
				 console.log("tempPoint:",tempPoint);
				 destinationPointfinal  = tempPoint;
				 console.log ("sourcePointfinal,destinationPointfinal",sourcePointfinal,destinationPointfinal);	
				 
				 //Get Route Fetcher ID
								 var settings = {
									  "url": appConfigInfo.sglGetShortestPath+"?layerName=road_centerline&x1="+sourcePointfinal[0]+"&y1="+sourcePointfinal[1]+"&x2="+destinationPointfinal[0]+"&y2="+destinationPointfinal[1],
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
			
				function sglCreateRouteLayer(routeLine, distance, param)
				{
	
				console.log ("sglCreateRouteLayer line:",routeLine);
				
				try{
				tmpl.Layer.clearData({map : param.map,layer : 'RoutePoint'});
				tmpl.Layer.clearData({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RoutePoint'});
				}
				catch(e){
				console.log("Line Layer Creation Error..!",e);
				}
	
					tmpl.Overlay.addGeometry({
									map : param.map,
									geometry : routeLine,
									properties : {
										id : 1,
										name : "path",
										type : "visited",
									},
									layer : 'RouteLineLayer'
								});

								 tmpl.Route.buffer({wktgeom:routeLine,callBackFunc:bufferRoute});
								   function bufferRoute(roadbuffer){
								 	getGeomCallback(roadbuffer);
								  }

								tmpl.Zoom.toLayer({map : param.map,layer : 'RouteLineLayer'});
			
						var srcIconStyle = new ol.style.Icon(({
									src: sourceIcon,
									anchor: [0.5, 1],
									scale : 1.0
								}));			
								var destIconStyle = new ol.style.Icon(({
									src: destinationIcon,
									anchor: [0.5, 1],
									scale : 1.0
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
								
								srcfeatureVal.set('layer_name','RoutePoint');
								destfeatureVal.set('layer_name','RoutePoint');
								
								var src =  new ol.source.Vector({
									features: [srcfeatureVal]
								});
								var dest =  new ol.source.Vector({
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

								if(callbackFunc){
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
								  callbackFunc(sourcePoint,destinationPoint,distance,routeLine);
								  }
								
								mapObj.addLayer(srcOverlay);
								mapObj.addLayer(destOverlay);

					}			
		
	}


function getTrinityRoute(param)
{
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
		var routeLocation=[];
		var sLocation = {"longitude": sourcePoint[0],"latitude": sourcePoint[1]};
		var dLocation = {"longitude": destinationPoint[0],"latitude": destinationPoint[1]};
		
		
		
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
        url: appConfigInfo.mmiRoute+"getroute",
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(reqObj),
        success: function (resp) {
          if (resp.code == "Ok") {
            if (resp.routes[0].geometry) {
              console.log("Route API:",resp);
			  var routeLine = decodemapmyindiageometryaswkt(resp.routes[0].geometry);
			  console.log("Route routeLine:",routeLine);
			   console.log("Route------------------>:",resp);
			    var routeDistance = '';
				  var routeETA = '';
			  	 try{
				tmpl.Layer.clearData({map : param.map,layer : 'RoutePoint'});
				tmpl.Layer.clearData({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RouteLineLayer'});
				tmpl.Layer.remove({map : param.map,layer : 'RoutePoint'});
				}
				catch(e){
				console.log("Line Layer Creation Error..!",e);
				}
						tmpl.Overlay.addGeometry({
									map : param.map,
									geometry : routeLine,
									properties : {
										id : 1,
										name : "path",
										type : "visited",
									},
									layer : 'RouteLineLayer'
								});
								
									var srcIconStyle = new ol.style.Icon(({
									src: sourceIcon,
									anchor: [0.5, 1],
									scale : 1.0
								}));			
								var destIconStyle = new ol.style.Icon(({
									src: destinationIcon,
									anchor: [0.5, 1],
									scale : 1.0
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
								
								srcfeatureVal.set('layer_name','RoutePoint');
								destfeatureVal.set('layer_name','RoutePoint');
								
								var src =  new ol.source.Vector({
									features: [srcfeatureVal]
								});
								var dest =  new ol.source.Vector({
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
								
								if(callbackFunc){
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
								callbackFunc(resETA,routeLine);
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

	function getHereMapsRoute(param){
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
		
			try{
			mapObj.getLayers().forEach(function (layer) {
		
				 if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				}else{
				//mapObj.removeLayer(layer);
				console.log("No Layer Available..!");
				}
			});
			}catch(e){console.log("Layer Not Available..!");}
			
			
if (param.waypoints)
  {
    var fature_waypoint;
    var waypointFeatures = [];
	var temp = stops1;
	var stops = [];
	if(wayPointFormat == undefined){
		stops = stops1;
	}else if(wayPointFormat ==  true){
	
	for(var x=0;x<stops1.length;x++){										// Added by Prashanth by commenting function above
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
		anchor: [0.5, 1]													// Added by Prashanth
      })
    });
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
    if ((stops.length) >= waypoint_limit) {
      console.log("CreateLayer : exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
    }
    for (var t = 0; t < waypoint_length; t++) {
      try {
        if (appConfigInfo.mapData == "google" || appConfigInfo.mapData=="hereMaps") {
          waypoint_value = ol.proj.transform([parseFloat(stops[t].lon), parseFloat(stops[t].lat)], 'EPSG:4326', 'EPSG:3857');
        } else {
          waypoint_value = [parseFloat(stops[t].lon), parseFloat(stops[t].lat)];
        }
        if (stops[t].Icon != undefined) {
          tempwaypointStyle = new ol.style.Style({
            image: new ol.style.Icon({
              src: stops[t].Icon,
			  anchor: [0.5, 1]													// Added by Prashanth
            })
          });
          waypointStyle = tempwaypointStyle;
        } else {
          waypointStyle = globalwaypointStyle;
        }
        fature_waypoint = new ol.Feature({
          geometry: new ol.geom.Point(waypoint_value)
        });
		var wayPointIdTemp = "route_waypoint" + (t+1);
        fature_waypoint.set('id',wayPointIdTemp);
        fature_waypoint.setStyle(waypointStyle);
        if (param.waypoints && param.getGeometry) {
          wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857','EPSG:4326')));
		  
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
		
		if(wayPointFormat == true){
			var waypoint_limit = 8;
			var length = stops1.length;	
			console.log("Route:stops1::",length,stops1);
			if(length>8){
				console.error("WAYPOINTS LIMIT EXCEEDED");
			}
			else{		
				switch (length) {
				case 0:
				
				routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";	
				break;
				
				case 1:
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";										
					break;
					
				case 2:
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";					
					break;
					
				case 3:
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";				
					break;
					
				case 4:
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey+ "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
					break;  
					
				case 5: 
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
					break; 
					
				case 6:         
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat+ "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
					break; 		
				case 7:                                                                                                                                                                                                                                                                                                                        
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=passThrough!" + stops1[6].lat + "," + stops1[6].lon + "&waypoint8=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
					break; 
					
				case 8:                                                                                                                                                                                                                                                                                                                        
					routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey  + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0].lat + "," + stops1[0].lon + "&waypoint2=passThrough!" + stops1[1].lat + "," + stops1[1].lon + "&waypoint3=passThrough!" + stops1[2].lat + "," + stops1[2].lon + "&waypoint4=passThrough!" + stops1[3].lat + "," + stops1[3].lon + "&waypoint5=passThrough!" + stops1[4].lat + "," + stops1[4].lon + "&waypoint6=passThrough!" + stops1[5].lat + "," + stops1[5].lon + "&waypoint7=passThrough!" + stops1[6].lat + "," + stops1[6].lon + "&waypoint8=passThrough!" + stops1[7].lat + "," + stops1[7].lon + "&waypoint9=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
					break;
					
				default:
					console.error("ERROR IN WAYPOINTS ARRAY");
					break;
				}
				
				var k = 0;
				var arr = [];
				var obj = {};
				while(k<stops1.length){
					obj = {};
					obj.lon = stops1[k][0];
					obj.lat = stops1[k][1]
					arr.push(obj);
					obj = {};
					
					var wayPtIconStyle = new ol.style.Icon(({
						src: stopsIcon,
						anchor: [0.5, 1],
						scale : 1.0
					}));					
					var wayPtGeom = new ol.geom.Point(ol.proj.transform([parseFloat(arr[0].lon), parseFloat(arr[0].lat)], 'EPSG:4326', 'EPSG:3857'));
					var wayPtfeatureVal = new ol.Feature({
						geometry: wayPtGeom
					});
					wayPtfeatureVal.setStyle(new ol.style.Style({
						image: wayPtIconStyle,
					}));
					var wayPtSrc =  new ol.source.Vector({
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
		else{
			routeUrl = "https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=" + appConfigInfo.hereMapsAppKey + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";	
		}

		$.ajax({url: routeUrl, success: function(result){
			console.log("RESULT: ",result);
			var res = result;
			var arr = [];
			var lonlat = {};
			var j = 0;
			while(j<res.response.route[0].leg[0].shape.length){
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
			console.log("-->>",arr);

			var wktGeom = "LINESTRING(";
			var k = 0;
			while(k<arr.length){
				if(k == arr.length-1){
					wktGeom += arr[k].lon + " " + arr[k].lat;
				}
				else{
					wktGeom += arr[k].lon + " " + arr[k].lat + ",";
				}
				k++;
			}
			wktGeom += ")";	

			var srcIconStyle = new ol.style.Icon(({
				src: sourceIcon,
				anchor: [0.5, 1],
				scale : 1.0
			}));			
			var destIconStyle = new ol.style.Icon(({
				src: destinationIcon,
				anchor: [0.5, 1],
				scale : 1.0
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
			
			srcfeatureVal.set('layer_name','RouteSPoint');
			destfeatureVal.set('layer_name','RouteDPoint');
			
				try{
			mapObj.getLayers().forEach(function (layer) {
		
				 if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
					mapObj.removeLayer(layer);
				}else{
				//mapObj.removeLayer(layer);
				console.log("No Layer Available..!");
				}
			});
			}catch(e){console.log("Layer Not Available..!");}
			
			var src =  new ol.source.Vector({
				features: [srcfeatureVal]
			});
			var dest =  new ol.source.Vector({
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
		wktGeom = wktGeom.replace("LINESTRING","LINESTRING ");
		wktGeom = wktGeom.replace(/,/g,", ");
	  tmpl.Route.buffer({wktgeom:wktGeom,callBackFunc:bufferRoute});
	  //Route Buffer 06-01-2020 ( ratheesh)
	  function bufferRoute(roadbuffer){
	  console.log("roadbuffer---->",roadbuffer);
	  	getGeomCallback(roadbuffer);
	  }
			
		console.log("CreateLayer:",wktGeom,result);
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
			var ETA_legs=null;
			console.log("callbackFunc::",resETA, sourcePoint,destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
			setTimeout(function(){
			callbackFunc(resETA, sourcePoint,destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
			//getGeomCallback(null);
			}, 2000);	
		
			var r_w = null;
			if(route_width != undefined){
				r_w = route_width;
			}
			else{
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
			
		
			
			var source=  new ol.source.Vector({
				features: [feature]
			});
			
			var newLayer = new ol.layer.Vector({
				title: "RouteLayer",
				visible: true,
				source: source
			});
				
			mapObj.addLayer(newLayer);
			newLayer.set('name', 'RouteLayer');
			
		}});	
	}
	
	
function getEsriRoute(param)
{
console.log("ESRI Route:",param);
var stops = null;
var tempStops = null;
var routeResult  = [];
var cordStart, cordEnd, coordinateArray, ETA_legs;
cordStart = param.source;
cordEnd = param.destination;
var  accessToken = null;
var settings = {
  "url": appConfigInfo.esriRoutingToken+"?client_id="+appConfigInfo.esriClientId+"&client_secret="+appConfigInfo.esriClientSecret+"&grant_type=client_credentials",
  "method": "POST",
  "timeout": 0,
};

$.ajax(settings).done(function (response) {
var resObj = JSON.parse(response) ;
  console.log(resObj.access_token);

	  if(resObj.access_token)
	  {
	    accessToken=resObj.access_token;
			if(param.waypoints && param.waypoints.length > 0)
			{
			
			console.log(param.waypoints);
			stops = param.source[0]+','+param.source[1];
			tempStops = stops;
			for ( var s = 0 ;s<param.waypoints.length;s++)
			{
				console.log("s:",s);
				if(tempStops==null){
				tempStops = param.waypoints[s].lon+','+param.waypoints[s].lat;
				}else{
				tempStops = tempStops+';'+param.waypoints[s].lon+','+param.waypoints[s].lat;
				}
				console.log("tempStops:",tempStops);
			}
			tempStops = tempStops +';'+param.destination [0]+','+param.destination [1];
			
			console.log("stops:",stops,appConfigInfo.esriRouting,accessToken);
			console.log("Final Stops:",tempStops);
			
			var settings = {
				  "url": appConfigInfo.esriRouting+"?f=json&stops="+tempStops+"&token="+accessToken,
				  "method": "GET",
				  "timeout": 0,
				  dataType: "json",
				};
				$.ajax(settings).done(function (response) {
					console.log("zzzzzzzzzzzzzzzzz",response);
				for( z=0;z<response.routes.features[0].geometry.paths.length;z++)
				{
					for( k = 0; k < response.routes.features[0].geometry.paths[z].length; k++)
					{
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
			else
			{
			console.log("No WayPoints");
			stops = param.source[0]+','+param.source[1]+';'+param.destination [0]+','+param.destination [1];
			console.log("stops:",stops,appConfigInfo.esriRouting,accessToken);
			
			var settings = {
				  "url": appConfigInfo.esriRouting+"?f=json&stops="+stops+"&token="+accessToken,
				  "method": "GET",
				  "timeout": 0,
				  dataType: "json",
				};
				$.ajax(settings).done(function (response) {
				  var routeResult = response.routes.features[0].geometry.paths[0];
				  //JSON.parse(
					console.log("zzzzzzzzzzzzzzzzz",response);
					coordinateArray = routeResult;
					CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs)
					//console.log(routeResult.routes.features.geometry.paths);
				});
			
			
			}
	  }
	  else
	  {
	  console.log("Get Accesstoken Error!");
	  }
});

}


//Added from v2.76
function CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs) {
console.log("CreateLayer:",param, cordStart, cordEnd, coordinateArray, ETA_legs);
  var startPointAddress;
  var endPointAddress;
  var datas=[];

  	if(appConfigInfo.mapDataService=='esri')
	{
	var startPoint = cordStart;
	var endPoint =  cordEnd;
	}
	else
	{
  var startPoint = ol.proj.transform(cordStart,'EPSG:3857','EPSG:4326');
  var endPoint = ol.proj.transform(cordEnd,'EPSG:3857','EPSG:4326');
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
  var routeColor = param.route_color;					//Parameter Added by Prashanth on 19-07-2019 as per request by Dency
  var waypoint_limit = 8;
  var wayptsExist = false;
  var format = new ol.format.WKT();
  if (param.waypoints)
  {
    var fature_waypoint;
    var waypointFeatures = [];
    var stops1 = param.waypoints;
	var temp = stops1;
	var stops = [];
	if(wayPointFormat == undefined){
		stops = stops1;
	}else if(wayPointFormat ==  true){
	
	for(var x=0;x<stops1.length;x++){										// Added by Prashanth by commenting function above
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
		anchor: [0.5, 1]													// Added by Prashanth
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
			  anchor: [0.5, 1]													// Added by Prashanth
            })
          });
          waypointStyle = tempwaypointStyle;
        } else {
          waypointStyle = globalwaypointStyle;
        }
        fature_waypoint = new ol.Feature({
          geometry: new ol.geom.Point(waypoint_value)
        });
		var wayPointIdTemp = "route_waypoint" + (t+1);
        fature_waypoint.set('id',wayPointIdTemp);
        fature_waypoint.setStyle(waypointStyle);
        if (param.waypoints && param.getGeometry) {
          wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857','EPSG:4326')));
		  
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
  if(routeColor != undefined){
	  routeLineColor = null;
	  routeLineColor = routeColor;
	  // alert(routeColor);
  }
  else{
	  routeLineColor = null;
	  routeLineColor = "red";
	  // alert(routeColor);
  }
  var r_w;
  if(route_width != undefined)
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
      lname: "routeVector_line"+routeLineColor
    });
	console.log("CreateLayer:"+routeLineColor);  
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
	fname : 'source',
	id : 'route_source'
  });
  	if(appConfigInfo.mapDataService=='esri')
		{
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
	fname : 'destination',
	id : 'route_destination'
  });
    	if(appConfigInfo.mapDataService=='esri')
		{
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
  if (appConfigInfo.mapData == "google")
  {
  //alert("linestring");
    var lineString = new ol.geom.LineString(coordinateArray);
	
	console.log("lineString::",lineString);
    var featuresCollection_g = new ol.Feature({
      geometry: lineString,
      name: 'Line'
    });

	
		if(appConfigInfo.mapDataService=='esri')
		{
			featuresCollection_g.getGeometry().transform('EPSG:4326', 'EPSG:3857');
		}
		  
	
  }
  else
  {
    var length_geometryVal = coordinateArray.length;
	console.log("CreateLayer:",length_geometryVal);
    var featureTemp;
    for (var d = 0; d < length_geometryVal - 1; d++) {
		//console.log(coordinateArray[d].geometry,"   of ...",d);
		if(coordinateArray[d].geometry == "GEOMETRYCOLLECTION EMPTY"){
			console.log("GEOMETRYCOLLECTION EMPTY Please check in Postgres");
		}
		else{
		//console.log("coordinateArray::",coordinateArray);
			 featureTemp = format.readFeature(coordinateArray[d].geometry, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		}
	  try{
		  totalDistance = totalDistance + featureTemp.getGeometry().getLength();
	  }
	  catch(e){
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
if (param.zoomToRoute == true){
	 mapObj.getView().fit(routeVector_line.getSource().getExtent(), mapObj.getSize()); 
	 //mapObj.getView().fit(routeLayer.getSource().getExtent(), mapObj.getSize());
}
  
/*// for track buffer in ICCC end
*/  
  if (param.callbackFunc != undefined) {
  console.log("CreateLayer : callbackFunc");
    if (appConfigInfo.mapData == "google" && appConfigInfo.mapDataService == "google" )
	{
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
		for(var x=0;x<ETA_legs.length;x++){
			resETA.distance.value = resETA.distance.value + ETA_legs[x].distance.value;
			resETA.duration.value = resETA.duration.value + ETA_legs[x].duration.value;
		}
		var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
		wktGeom = wktGeom.replace("LINESTRING","LINESTRING ");
		wktGeom = wktGeom.replace(/,/g,", ");
		console.log("CreateLayer:",resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
        setTimeout(function(){callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);}, 2000);	
		// callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
    } 
	else 
	{

		var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
		wktGeom = wktGeom.replace("LINESTRING","LINESTRING ");
		wktGeom = wktGeom.replace(/,/g,", ");
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
	   console.log("ETA_legs:------>>>>>>>>>>>>>>>",ETA_legs);
	   console.log("CreateLayer : callbackFunc :",resETA, cordStart, cordEnd, coordinateArray, ETA_legs,wktGeom);
       setTimeout(function(){callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs,wktGeom);}, 2000);	
    }
	
  }
  var featurebuffer;
  if (param.getGeometry != undefined) {
    if (appConfigInfo.mapData === 'google') {


		var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
		wktGeom = wktGeom.replace("LINESTRING","LINESTRING ");
		wktGeom = wktGeom.replace(/,/g,", ");
	  tmpl.Route.buffer({wktgeom:wktGeom,callBackFunc:bufferRoute});
	  //Route Buffer 06-01-2020 ( ratheesh)
	  function bufferRoute(roadbuffer){
	  	getGeomCallback(roadbuffer);
	  }
    }
	else 
	{
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
  else{}
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
	if(wayPointFormat == undefined){
		stops = stops1;
	}else if(wayPointFormat ==  true){
	
		for(var x=0;x<stops1.length;x++){												// Added by Prashanth by commenting function above
			console.log("WAYPOINTS FROM API+=========================>",temp);
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
    directionsService.route(request, function(response, status) {
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
        CreateLayer(param, cordStart, cordEnd, coordinateArray,ETA_legs);
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
    if (Detail_flag_ip) {}
    CreateLayer(param, source, destination, data,'');
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
		temp_stop[k]={};
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
tmpl.Route.RouteResult = function(getdata) {
  // Latest Update Detail
  // route v 2.5.003  dated 23 nov 2016 Mr J
  var lato, lono, plato = 0,
    plono = 0;
  var path = [];
  for (var m = 0; m < getdata.length - 1; m++) {
    lato = getdata[m].lat;
    lono = getdata[m].lon;
    if (lato == plato && lono == plono) {} else {
      path.push([lato, lono]);
      plato = lato;
      plono = lono;
    }
  }
  //console.log("rs added :", path.length);
  return path;
}
tmpl.Route.directionsService = function(request, myCallBack) {
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
 
tmpl.Route.getDistanceTime =  function(param) {
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
	}, function(response, status) {
	    if (status !== 'OK') {
	      	console.log('Error was: ' , status);
	    } else {
 			var results = response.rows[0].elements;
        	for (var j = 0; j < results.length; j++) {
          		var data = {Distance : results[j].distance.text, Duration : results[j].duration.text , DurationValue : results[j].duration.value};
          		distanceDetails.push(data);
        	}
        }
		callbackFunc(distanceDetails,dataTable);
    });	
}


tmpl.Route.cancelOnClick = function(param){
	
}
// tmpl.Route.onClick = function(param){
	// var click_source_route;
	// var click_destination_route = [];

	// var map1 = param.map;
	// var sourceImg = param.sourceImg;
	// var destinationImg = param.destinationImg;
	// var radius1 = param.radius;
	// var callbackFunc = param.callbackFunc;

	// map1.on('click', getCoord);

	// function getCoord(evt){
		// var feature;
	    // feature = evt.coordinate;
	  
		// if(appConfigInfo.mapData=="google")
		// {
		  // click_source_route=ol.proj.transform(feature, 'EPSG:3857','EPSG:4326');
		// }
		// else
		// {
		  // click_source_route= feature;
		// }
		// click_destination_route.push(click_source_route);

	    // if(click_destination_route.length == 2){
		    // tmpl.Route.getRoute({
		      // map : map1,
		      // source :  click_destination_route[0],
		      // destination : click_destination_route[1],
		      // sourceIcon : sourceImg,//"img/1.png",
		      // destinationIcon : destinationImg,//"img/2.png",
		       // radius :radius1,//20,
		        // getGeometry : test
		    // }); 
		    // map1.un('click', getCoord);
			// var geocodePoint = click_destination_route[0];
		    // click_destination_route = [];
		    // function test(data){
				// //console.log("data >>>",data);
			// tmpl.Geocode.getGeocode({
				// point : geocodePoint,
				// callbackFunc  : handleGeocode	
			// });
			// function handleGeocode(addrs){
				// var result = {
					// route : data,
					// geocode : addrs
				// };
				// callbackFunc(result);
			// }
			// }
	  	// }
	// }
	// tmpl.Route.cancelOnClick = function(param){
		// var map1 = param.map;
		// map1.un('click', getCoord);
	// }
// }


	
tmpl.Route.onClick = function(param){
	var click_source_route;
	var click_destination_route = [];
	var map1 = param.map;
	var sourceImg = param.sourceImg;
	var destinationImg = param.destinationImg;
	var radius1 = param.radius;
	var callbackFunc = param.callbackFunc;
	var bufferCallback = param.bufferCallbackFunc;							//Added by Prashanth
	var iconArray = [sourceImg,destinationImg];
	var callbackResult = null;												//Added by Prashanth
	
	// tmpl.Route.clearRoute({map : map1});
	
	var startPointAddress = null;
	var endPointAddress = null;
	var newLayer = new ol.layer.Vector({
		lname : 'route_onclik',
			source: new ol.source.Vector()
		});
	if(click_destination_route.length == 0){
	tmpl.Draw.draw({
			map : map1,
			type : 'Point',
      callbackFunc:getDrawFeatureDetails
		});
		function getDrawFeatureDetails(coord, feature, wktGeom, value){
			console.log("COORD: ",coord);
			click_destination_route.push(coord);
			var projCoord = ol.proj.transform(coord,'EPSG:4326','EPSG:3857');
			var pointdata = new ol.geom.Point(projCoord);
			// console.log("pointdata: ",pointdata);
		var feature2 = new ol.Feature({
			geometry: pointdata
		});
		feature2.setStyle(new ol.style.Style({
			image : new ol.style.Icon({
				src : sourceImg,
				anchor: [0.5, 1]
			})
		}));
			newLayer.getSource().addFeature(feature2);
			map1.addLayer(newLayer);
			
			tmpl.Draw.clear({
			map : map1
		});
			tmpl.Draw.draw({
			map : map1,
			type : 'Point',
			callbackFunc:getDrawFeature
		});
		function getDrawFeature(coord, feature, wktGeom, value){
			click_destination_route.push(coord);
			newLayer.getSource().clear();
			tmpl.Route.getRoute({
				map : map1,
				source :  click_destination_route[0],
				destination : click_destination_route[1],
				sourceIcon : sourceImg,						//"img/1.png",
				destinationIcon : destinationImg,			//"img/2.png",
				radius :radius1,//20,
				callbackFunc: routeDetails,
				getGeometry : test						
		    }); 
			
			function routeDetails(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom){
			console.log("--->>>>>>>>>>>>>>>>>>>>>>",resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom);
			if(appConfigInfo.mapDataService=='esri')
			{
			var cordStart4326 = cordStart;
			var cordEnd4326 = cordEnd;
			}
			else if(appConfigInfo.mapData=='hereMaps')
			{
			var cordStart4326 = ol.proj.transform(cordStart, 'EPSG:4326', 'EPSG:3857');
			var cordEnd4326 = ol.proj.transform(cordEnd, 'EPSG:4326', 'EPSG:3857');
			}
			else
			{
			var cordStart4326 = ol.proj.transform(cordStart, 'EPSG:3857', 'EPSG:4326');
			var cordEnd4326 = ol.proj.transform(cordEnd, 'EPSG:3857', 'EPSG:4326');
			}
				callbackResult = {ETA: resETA, startCoord: cordStart4326, endCoord: cordEnd4326, coordinateArray: coordinateArray, wktGeom: wktGeom,ETA_legs:ETA_legs};
				callbackFunc(callbackResult);
			};
				tmpl.Draw.clear({
			map : map1
		});
			function test(data){
				bufferCallback(data);
				console.log("click_destination_route[0] >>>",click_destination_route[0]);
			tmpl.Geocode.getGeocode({
				point : click_destination_route[0],
				callbackFunc  : handleGeocode	
			});
			function handleGeocode(addrs){
				var result = {
					route : data,
					geocode : addrs
				};
				// callbackFunc(result);								//Commented by Prashanth
			}
			
			
			
			var dragedFeature;
			 window.app = {};
  var app = window.app;
var format = new ol.format.WKT();
  app.Drag = function() {
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

  app.Drag.prototype.handleDownEvent = function(evt) {
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {
			  
			  // console.log(layer.get('lname'));
			if(layer == null){
				if(feature.get('lname') == 'routeVector'){
					return feature;
				}
			}else if(layer.get('lname') == "routeVector"){
				if(feature.get('fname') == 'source' || feature.get('fname') == 'destination')
					return feature;
			}

          });
		  
      if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
      }
      return !!feature;
  };

  app.Drag.prototype.handleDragEvent = function(evt) {
	  // alert("handleMoveEvent1");
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {    
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

  app.Drag.prototype.handleMoveEvent = function(evt) {
	  // alert("handleMoveEvent2");
      if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
              return feature;
            });
        var element = evt.map.getTargetElement();
        if (feature) {
			editFeature = feature;
			point = feature.getGeometry().getCoordinates();
			var point;
			if(appConfigInfo.mapData==='google' || appConfigInfo.mapData=='hereMaps')		{
				point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
				}
			else
				{
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

  app.Drag.prototype.handleUpEvent = function(evt) {
      var value=this.feature_.getGeometry().getType();
      if(value==='Point')
      {
        lonlat =this.feature_.getGeometry();
      }
      else if(value==='LineString')
      {
        lonlat =this.feature_.getGeometry();
      }
      else if(value==='Polygon')
      {
        lonlat =this.feature_.getGeometry();
      }
	
      if(appConfigInfo.mapData==='google' || appConfigInfo.mapData=='hereMaps')
      {         
		coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        wktGeom= format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
      }
      else
      {
    	  coordinate = lonlat.getCoordinates();
          wktGeom= format.writeGeometry(lonlat);
      //  wktGeom= format.writeGeometry(this.feature_.getGeometry());
      }

		var result = {
			new_coordinates : coordinate
		};
		var dragFeature = this.feature_;
		if(dragFeature.get('fname') == 'source'){
			tmpl.Route.clearRoute({map : map1});
				 tmpl.Route.getRoute({
		      map : map1,
		      source :  ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
		      destination : click_destination_route[1],
		       sourceIcon : sourceImg,//"img/1.png",
		       destinationIcon : destinationImg,//"img/2.png",
		       radius :radius1,//20,
		        getGeometry : test1,
				callbackFunc: dragRouteDetails							//Added by Prashanth
		    }); 
			click_destination_route[0] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		}else if(dragFeature.get('fname') == 'destination'){
			tmpl.Route.clearRoute({map : map1});
				 tmpl.Route.getRoute({
		      map : map1,
		      source :  click_destination_route[0],
		      destination : ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
		       sourceIcon : sourceImg,//"img/1.png",
		       destinationIcon : destinationImg,//"img/2.png",
		       radius :radius1,//20,
		        getGeometry : test1,
				callbackFunc: dragRouteDetails							//Added by Prashanth
		    }); 
			click_destination_route[1] = ol.proj.transform(dragFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		}
		
		function dragRouteDetails(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress){
			// console.log("eeeeeeeeeeeeeee: ",callbackResult);
			var callbackResult = {resETA: resETA, cordStart: cordStart, cordEnd: cordEnd, coordinateArray: coordinateArray, ETA_legs: ETA_legs, wktGeom: wktGeom, startPointAddress: startPointAddress, endPointAddress: endPointAddress};
			callbackFunc(callbackResult);
		}
		
		function test1(data){
			bufferCallback(data);
				//console.log("data >>>",data);
			tmpl.Geocode.getGeocode({
				point : click_destination_route[0],
				callbackFunc  : handleGeocode	
			});
			function handleGeocode(addrs){
				var result = {
					route : data,
					geocode : addrs
				};
				// callbackFunc(result);
			}
		}
      //mycallback(result);
      this.coordinate_ = null;
      this.feature_ = null;
      return false;
  };
  intr=new app.Drag();
  map1.addInteraction(intr);											//Commented by Prashanth
	
			}

		} 
		} 
		
	}
	

	tmpl.Route.cancelOnClick = function(param){
		var map1 = param.map;
		tmpl.Route.clearRoute({map : map1});
		tmpl.Draw.remove({
			map : map1
		});
	}
}

/*tmpl.Route.joinRoute = function(param){
	var mapObj = param.map;
	var datas = param.feature;
	var callbackFunc = param.callbackFunc;
	var sourceIcon = param.source_image;
	var destinationIcon = param.destination_image;
	
	var noLayer,routeLine1,routeLine2,sourcePoint,destinationPoint;
	var feature1,feature2,featureBuffer1,featureBuffer2;
	
	var format = new ol.format.WKT();
	
	for(var i=0;i<datas.length;i++){
		routeLine1 = datas[0].geometry;
		bufferLine1 = datas[0].buffer;

		routeLine2 = datas[1].geometry;
		bufferLine2 = datas[1].buffer;
		
		if(appConfigInfo.mapData == 'google'){
			feature1 = format.readFeature(routeLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
				rname : 'route1',
				routeid : datas[i].id
			});
			featureBuffer1 = format.readFeature(bufferLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});

			feature2 = format.readFeature(routeLine2, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
				rname : 'route2',
				routeid : datas[i].id
			});
			featureBuffer2 = format.readFeature(bufferLine2, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		}
		else{
			feature1 = format.readFeature(routeLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326',
				rname : 'route1',
				routeid : datas[i].id
			});
			featureBuffer1 = format.readFeature(bufferLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});

			feature2 = format.readFeature(routeLine2, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326',
				rname : 'route2',
				routeid : datas[i].id
			});
			featureBuffer2 = format.readFeature(bufferLine2, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		} 
		
		var sourcePoint1 = feature1.getGeometry().getFirstCoordinate();
		var destinationPoint1 = feature1.getGeometry().getLastCoordinate();
		
		var sourcePoint2 = feature2.getGeometry().getFirstCoordinate();
		var destinationPoint2 = feature2.getGeometry().getLastCoordinate();
		
		sourcePoint1 = ol.proj.transform(sourcePoint1, 'EPSG:3857', 'EPSG:4326');
		destinationPoint1 = ol.proj.transform(destinationPoint1, 'EPSG:3857', 'EPSG:4326');
		sourcePoint2 = ol.proj.transform(sourcePoint2, 'EPSG:3857', 'EPSG:4326');
		destinationPoint2 = ol.proj.transform(destinationPoint2, 'EPSG:3857', 'EPSG:4326');
		var stops = [
	     destinationPoint1,
	     sourcePoint2
	    ];
	    tmpl.Route.getRoute({
	      	map : mapObj,
	      	source :  sourcePoint1,
	      	destination : destinationPoint2,
	      	sourceIcon : sourceIcon,
	      	destinationIcon : destinationIcon,
	     	waypoints : stops,
	       //	waypointsIcon : "img/1.png",
	       	radius :param.radius,
	        getGeometry : test,
	        wayPointFormat:false
	    });
	    function test(a){
		    callbackFunc(a);
		}
	}
}*/
tmpl.Route.joinRoute = function(param){
	var mapObj = param.map;
	var datas = param.feature;
	var layerName = param.layerName;
	var callbackFunc = param.callbackFunc;

	var sourceIcon = param.source_image;
	var destinationIcon = param.destination_image;
	
	var routeLine1,feature1;
	var wayPoint = [],sourcePoint = [],destinationPoint = [];
	var sourcePointFirst,destinationPointLast,wayPointLat,wayPointLon;
	var format = new ol.format.WKT();
	if(datas.length >=2){
	for(var i=0;i<datas.length;i++){
		routeLine1 = datas[i].geometry;
		if(appConfigInfo.mapData == 'google'){
			feature1 = format.readFeature(routeLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857',
				rname : 'route1',
				routeid : datas[i].id
			});
			
		}
		else{
			feature1 = format.readFeature(routeLine1, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326',
				rname : 'route1',
				routeid : datas[i].id
			});
			
		} 
		if(i == 0){
			sourcePointFirst = feature1.getGeometry().getFirstCoordinate();
			var latlon = feature1.getGeometry().getLastCoordinate()
			wayPointLat = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326');
			wayPoint.push({lat:wayPointLat[1],lon:wayPointLat[0]});
		}else if(i == (datas.length)-1){
			destinationPointLast = feature1.getGeometry().getLastCoordinate();
			var latlon = feature1.getGeometry().getFirstCoordinate()
			wayPointLat = ol.proj.transform(latlon, 'EPSG:3857', 'EPSG:4326');
			wayPoint.push({lat:wayPointLat[1],lon:wayPointLat[0]});
		}else{
			wayPointLat = ol.proj.transform(feature1.getGeometry().getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326');
			var wayPointLon2 = ol.proj.transform(feature1.getGeometry().getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
			wayPoint.push({lat:wayPointLat[1],lon:wayPointLat[0]});
			wayPoint.push({lat:wayPointLon2[1],lon:wayPointLon2[0]});
		}
		
		
	}
	sourcePointFirst = ol.proj.transform(sourcePointFirst, 'EPSG:3857', 'EPSG:4326');
	destinationPointLast = ol.proj.transform(destinationPointLast, 'EPSG:3857', 'EPSG:4326');
	console.log("wayPoint >>",wayPoint);
	var stops = wayPoint;
    tmpl.Route.getRoute({
      	map : map,
      	source :  sourcePointFirst,
      	destination : destinationPointLast,
      	sourceIcon : sourceIcon,
      	destinationIcon : destinationIcon,
     	waypoints : stops,
       	waypointsIcon : "img/testroute.png",
       	radius :20,
        getGeometry : test//,
       // wayPointFormat:false
    });
    function test(a){
	    //console.log("a>>",a);
	    callbackFunc(a);
	}
}
}
tmpl.Route.clearAddedRoute = function(param){
	var mapObj = param.map;
	var layerName = param.layer;

	var Layers = mapObj.getLayers();
	var existing;
	for(i=0;i<Layers.getLength();i++){
		var existingLayer=Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layerName){
				existing = existingLayer;
				existingLayer.getSource().clear();
			}
		}
	}
	if(existing == undefined){
		for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == layerName){
				tmpl_setMap_layer_global[i].layer.getSource().clear();
			}
		}		
	}
}
// NEW TRIP ANIMATION //

var trip_lines_layer_flag =  false;
var trip_lines_layer_direction_flag =  false;
var trip_lines_layer =  new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var trip_lines_layer_direction =  new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var trip_points_layer_flag1 =  false;
var trip_end_marker_flag =  false;
var trip_points_layer1 = new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var trip_points_layer_flag =  false;
var trip_points_layer = new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var trip_end_Marker = new ol.layer.Vector({
	title:'trip_vehcile_marker',
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




tmpl.Trip.clear = function (param)
{	
			var map = param.map;

    firstrun = true;	
    tripTimeDelay =-1;	
    Trip_global_delay_time = -1;	
     trip_lines_layer_flag =  false;	
    trip_lines_layer_direction_flag =  false;	
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
    	
    tripDataForReplyFromDisplay_flag= false;	
     tmpl_trip_halt_animation_flag = false;	
     tmpl_trip_start_animation_flag = false;	
     tmpl_trip_end_animation_flag = false;	
     tmpl_trip_layer_display_flag = false;	
     tmpl_trip_halt_display_flag = false;	
     tmpl_trip_start_display_flag = false;	
     tmpl_trip_end_display_flag = false;	
     tmpl_trip_vehicle_display_flag = false;	
    	
    		
		
	try{	

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
			try{	
			map.removeLayer(tmpl_trip_layer_display);	
			map.removeLayer(tmpl_trip_layer_display1);	
		    }catch(e){console.log("Error in map Obj!!",e);}	
			tripAnimation_started = false;	
			tmpl_trip_vehicle_display_flag = false;	
			tmpl_trip_layer_display_flag =  false;	
			tmpl_trip_halt_display_flag = false;	
			tmpl_trip_halt_animation_flag = false;	
			tmpl_trip_start_display_flag = false;	
			tmpl_trip_start_animation_flag = false;	
			tmpl_trip_end_display_flag = false;	
			tmpl_trip_end_animation_flag = false;	
			tripDataForReplyFromDisplay_flag = false;	
			if(gbl_trip_clear_tooltip != undefined)	
			gbl_trip_clear_tooltip.style.display = 'none';	
			try{	
			map.unByKey('pointermove', mouseHoverDetails);	
			}	
			catch(e){	
			console.log("Error:map,map.un,mouseHoverDetails::-->",map,map.un,mouseHoverDetails)	
			}	
			clearInterval(ivlDraw);	
				
			tripPlaybackAnimation = null;	
				
			Element.prototype.remove = function() {	
				this.parentElement.removeChild(this);	
			}	
			NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {	
				for(var i = this.length - 1; i >= 0; i--) {	
					if(this[i] && this[i].parentElement) {	
						this[i].parentElement.removeChild(this[i]);	
					}	
				}	
			}	
			var infoTable = document.getElementById("infoTable");	
			if(infoTable){	
				infoTable.remove();	
			}	
			var toggleContainer = document.getElementById("toggleTrackLayers");	
			if(toggleContainer){	
				toggleContainer.remove();	
			}	
			var tripControlscontainer = document.getElementsByClassName("tripControlscontainer");	
			if(tripControlscontainer){	
				tripControlscontainer.remove();	
			}	
			try	
	{	
	// to clear Trip chart	
	if( document.getElementById('bottomPaneldiv') )
	{
	var x = document.getElementById('bottomPaneldiv');	
          x.remove();		
	}
	
	     // x.style.display = "none";	
      	
	//end to clear Trip chart	
	}	
	catch(e){	
        console.error('Unable to remove', e);	
    }	
			
		
	}	
	catch(err){	
		console.error("ERROR Trip.clear: ",err);	
	}	
}

tmpl.Trip.stopClear = function (param){
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
var tmpl_trip_halt_animation =  new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var tmpl_trip_start_animation_flag = false;
var tmpl_trip_start_animation =  new ol.layer.Vector({
	source: new ol.source.Vector()
});
var tmpl_trip_end_animation_flag = false;
var tmpl_trip_end_animation =  new ol.layer.Vector({
	source: new ol.source.Vector()
});


var tmpl_trip_layer_display_flag = false;
var tmpl_trip_layer_display =  new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var tmpl_trip_layer_display1 =  new ol.layer.Vector({
	source: new ol.source.Vector()
});
var tmpl_trip_halt_display_flag = false;
var tmpl_trip_halt_display =  new ol.layer.Vector({
						source: new ol.source.Vector()
					});
var tmpl_trip_start_display_flag = false;
var tmpl_trip_start_display =  new ol.layer.Vector({
	source: new ol.source.Vector()
});
var tmpl_trip_end_display_flag = false;
var tmpl_trip_end_display =  new ol.layer.Vector({
	source: new ol.source.Vector()
});
var tmpl_trip_vehicle_display_flag = false;
var tmpl_trip_vehicle_display =  new ol.layer.Vector({
	source: new ol.source.Vector()
});
tmpl.Trip.routeLayer = function(param){
	var visibility = param.visibility;
	tmpl_trip_layer_display.setVisible(visibility);
	tmpl_trip_layer_display1.setVisible(visibility);
	tmpl_trip_halt_display.setVisible(visibility);
	tmpl_trip_start_display.setVisible(visibility);
	tmpl_trip_end_display.setVisible(visibility);
	if(visibility == true)
		trip_lines_layer.setVisible(false);
	else
		trip_lines_layer.setVisible(true);
};
tmpl.Trip.animatingRoute = function(param){
	var visibility = param.visibility;
	trip_lines_layer.setVisible(visibility);
	trip_lines_layer_direction.setVisible(visibility);
};

tmpl.Trip.routeVehicle = function(param){
	var visibility = param.visibility;
	var map = param.map;
	if(tripAnimation_started == true){
		tmpl_trip_vehicle_display.setMap(null);
		if(visibility == true)
		trip_end_Marker.setMap(map);
		else
		trip_end_Marker.setMap(null);
	}else{
		if(visibility == true)
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

tmpl.Trip.delay =  function(val){
	//tripDataForReplyFromDisplay
	Trip_global_delay_time = val;
}

//Updated trip display Added on 19-12-2019

var tripHaltPointsGlobal = [];
tripTimeDelay =-1;
Trip_global_delay_time = -1;
tmpl.Trip.display =  function(param)
{
	 console.log("Trip Display:->",param);
    if(Object.keys(param).length === 0)
    {
		console.error("Mised param!!!!");
	}
	else
    {
	removeTripInfoTable();
	if(param.data.length == 1 || param.data.length == 0){
		console.log("Not enough data");
	}else{
	if(param.data.length == 1 || param.data.length == 0){
		console.log("Not enough data");
	}else{
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
    if(data2[i-1])
  {
      //prev && current
      if(data2[i-1].lat == data2[i].lat && data2[i-1].lon == data2[i].lon)
    {
        console.log('Duplicate Found', data2[i]);
    }
    else
    {
		data1.push(data2[i-1]);
		
		if(i == data2.length-1)
		{
		        data1.push(data2[i]);
		}
    }
  }
}

//console.log("data2:",data2);
//console.log("data1:",data1);

	if(param.routeMouseOverDetails == true){
		EnableTripToolTip(map,tooltipLocation);
	}
	if(param.halt_points == true){
		halt_img = param.halt_img;
	}
	if(route_style_width == undefined){
		route_style_width = 4;
	}

	//map.unByKey(pointerMoveID);					@BK							// Added on 23-10-19 by Prashanth to disable pointer move function 
	
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
		closeDataTab.onclick = function(evt){
			if(closeDataTab.value == 1){
				bottomPanel.appendChild(bottomPaneldata);
				bottomPaneldata.style.visibility = 'visible';
				bottomPanel.style.bottom = '26.5%';
				closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-down"></i>'
				closeDataTab.value = 2;
			}
			else{
				bottomPaneldata.style.visibility = 'hidden';
				bottomPanel.style.bottom = '0%';
				closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
				closeDataTab.value = 1;
				setTimeout(function(){bottomPanel.removeChild(bottomPaneldata);},500);
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
		graphTab.id='graphTabid';
		graphTab.innerHTML = 'Graph';
		graphTab.style.backgroundColor = 'inherit';
		graphTab.style.float = 'left';
		graphTab.style.border = 'none';
		graphTab.style.outline = 'none';
		graphTab.style.cursor = 'pointer';
		graphTab.style.padding = '11px 16px';
		graphTab.style.transition = 'all 1.0s';
		graphTab.style.fontSize = '17px';
		graphTab.onclick = function(evt){
			var div = document.getElementById('bottomPaneldatadiv');
			if(div){
				while(div.firstChild){
					div.removeChild(div.firstChild);
				}
			}
			bottomPanel.appendChild(bottomPaneldata);
			generateGraph();
			bottomPaneldata.style.visibility = 'visible';
			bottomPanel.style.bottom = '26.5%';
			bottomPaneldata.style.position = 'absolute';
			if(closeDataTab.value == 2){
				if(bottomPanel.style.bottom == '0%'){
					closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
					closeDataTab.value = 1;
				}
				else{}	
			}
			else{
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
		tripDataTab.onclick = function(evt){
			var div = document.getElementById('bottomPaneldatadiv');
			if(div){
				while(div.firstChild){
					div.removeChild(div.firstChild);
				}
			}
			bottomPanel.appendChild(bottomPaneldata);
			generateTable();
			bottomPaneldata.style.visibility = 'visible';
			bottomPanel.style.bottom = '26.5%';
			bottomPaneldata.style.position = 'absolute';
			if(closeDataTab.value == 2){
				if(bottomPanel.style.bottom == '0%'){
					closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>'
					closeDataTab.value = 1;
				}
			}
			else{
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
		if(tabcontentStyle[0]){
			tabcontentStyle[0].style.display = 'none';
			tabcontentStyle[0].style.padding = '6px 12px';
			tabcontentStyle[0].style.borderTop = 'none';
		}
	

	function generateTable(){
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
			while(k--)
			{
			var temp = document.getElementById('messagesTable');
			temp.style.borderCollapse = "collapse";
			
			var rowCnt = temp.rows.length;      
			var tr = temp.insertRow(1);
			tr.className = "msgTable";

			for (var c = 0; c < arrHead.length; c++) {
				var td = document.createElement('td');	
				
				td = tr.insertCell(c);
				var arrVal = ['datetime', 'location', 'speed', 'lat', 'lon'];
				
				switch(c) {
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
	function generateGraph(){
		var xaxis = ['x'];
		var yaxis = ['speed'];
		
		for(var j=0; j<data1.length; j++){
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
	var downloadMap =  document.getElementById('downloadbut').style.display = "none";
	for(var i=0; i<buttonsDiv.length; i++){
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
		selectOption.onchange = function(evt){
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
	
	var temp = '3';
	var mySelect = document.getElementsByClassName('speedControllerDropdown');

	for(var i, j = 0; i = mySelect[0].options[j]; j++) {
	  if(i.value == temp) {
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
	
	function tripDelayOnChange(){
		var val = document.getElementById("tripdelayDropdown").value;
		console.log("tripdelayDropdown value changed ===> ",val);
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

	function updateTripDetailsOnDelayChange()
	{

		var trackedlinepoints = [];
		track_halt_points111=[];
		track_halt_points_id=[];
		for(var i=0;i<data1.length;i++)
		{
		var lat = parseFloat(data1[i].lat);
		var lon = parseFloat(data1[i].lon);
		//var tempTime = data1[i].time.slice(0, 8);
		//data1[i].time = tempTime;
		//var str = data1.id;//05-02-20
		var str = lon.toString()+lat.toString();


		// console.log("str from API ===> ",str);
		data1[i].id = str;
		data1[i].trip_icon = '';

		//push all
		var nextStart_time = null;	
		try {
			nextStart_time =  data1[i+1].time;
		} catch (error) {
			nextStart_time =  data1[i].time;
		}

			
	//	uniqueData.push(data1[i]);

	if(halt_points == true){
		
		if(i<data1.length-1){
			// if(data1[i].speed < 5){
				var tempTime1 = data1[i+1].time.slice(0, 8);
					data1[i+1].time = tempTime1;
				//var tripDiffinSec = time_diffForTripInSec(data1[i].time,data1[i+1].time);
				var tripDiffinSec = time_chk(data1[i].datetime,data1[i+1].datetime);
				//console.log("Indexing1"+data1[i].location+" - "+data1[i+1].location+":: CHECK DIFF ::", data1[i].time,data1[i+1].time+" FOUND DIFF ", tripDiffinSec);

				console.log("tripDiffinSec ===> ",tripDiffinSec,">=",tripTimeDelay);

				//if(tripTimeDelay!=-1 && tripTimeDelay >= tripDiffinSec){//05-02-2020
				if(tripTimeDelay!=-1 && tripDiffinSec >= tripTimeDelay){
				console.log("Indexing"+data1[i].location+" - "+data1[i+1].location+":: CHECK DIFF ::", data1[i].time,data1[i+1].time+" FOUND DIFF ", tripDiffinSec);

					if(track_halt_points_id.indexOf(str) == -1){
						track_halt_points_id.push(str);
						halt_points_indexTemp.push(i);
						var tempTime1 = data1[i+1].time.slice(0, 8);
						data1[i+1].time = tempTime1;
						var haltDuration = time_diff(data1[i].time,data1[i+1].time);
						 console.log("haltDuration ===> ",haltDuration);
						 
						 //push at this point is wrong as A - B is compared
						 //while only one is pushed both has to be pushed
						  if(tripDiffinSec >= tripTimeDelay)
						  {
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
					  else
					  {
						 /* if(track_halt_points111.length>0){
						 	track_halt_points111[track_halt_points111.length - 1].endTime = data1[i].time;
						 } */
					  }
				}
				else{
					console.info('Indexing Show',data1[i].location,data1[i+1].location+":: CHECK DIFF ::", data1[i].time,data1[i+1].time+" FOUND DIFF ", tripDiffinSec);
					
					var st_point = data1[i].lon.toString()+data1[i].lat.toString();
					var ed_point = data1[i+1].lon.toString()+data1[i+1].lat.toString();
					if(st_point && ed_point)
					{
						trackedlinepoints.push(st_point);
						trackedlinepoints.push(ed_point);
					}
				}
		}
		else
		{
			//console.log('I : ', i);
		}
	}
	else{}


	track_halt_points111.push({
		lat : data1[i].lat,
		lng : data1[i].lon,
		location : data1[i].location,
		date : data1[i].date,
		startTime : data1[i].time,
		endTime : nextStart_time,
		rendering_type : 11,
		haltDuration : haltDuration,
		id : str,
		trip_icon : halt_img
	});
	

	}

	if(track_halt_points111.length > 0)
	{
		for(var k = 0 ; k < track_halt_points111.length ; k++)
		{
			for(var j = 0 ; j < trackedlinepoints.length ; j++)
			{
				if(track_halt_points111[k].id == trackedlinepoints[j])
				{
					console.log(' match Found Hence pos : ',track_halt_points111[k].location);
					track_halt_points111.splice(k, 1);
				}
				else
				{
					console.log('! match Found Hence pos : ',track_halt_points111[k].location);
				}
			}
		}
	}
	console.log("Halt =====>",track_halt_points111);
	tripHaltPointsGlobal = track_halt_points111;
	tmpl_trip_layer_display_flag=false;
	if(tmpl_trip_layer_display_flag == false){
		tmpl_trip_layer_display1.getSource().clear();
		tmpl_trip_layer_display.getSource().clear();
		tmpl_trip_layer_display_flag = true;
		tmpl_trip_layer_display1 =  new ol.layer.Vector({
		title : "trip_line_display_layer1",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: route_color,
				width: route_style_width
			})
		})
	});
		tmpl_trip_layer_display =  new ol.layer.Vector({
		title : "trip_line_display_layer",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: route_color,
				width: route_style_width
			})
		})
	});
	tmpl_trip_layer_display1.set("display","TripLayerDisplay");
	tmpl_trip_layer_display.set("display","TripLayerDisplay");
	
		map.addLayer(tmpl_trip_layer_display1);
		map.addLayer(tmpl_trip_layer_display);
	}else{
		tmpl_trip_layer_display1.getSource().clear();
		tmpl_trip_layer_display.getSource().clear();
	}
	gblIndex=1;
	sendDataToDrawAnimationLineTemp();
	//chk Duplicat latlon
	var lineArray = [];
	var k = 0;

	// for(var k=0;k<uniqueData.length;k++){
	while(k < uniqueData.length){

		//  if(track_halt_points111.some(el => el.id === uniqueData[k].id)){
			for(var t= 0; t<trackedlinepoints.length; t++)
			{
				if(uniqueData[k].id == trackedlinepoints[t])
				{
					if(lineArray.length <= 2)
					{
						lineArray.push(uniqueData[k]);
						console.log("uniqueData--------------------------------------------",uniqueData);
						//draw the line 
						if(lineArray.length == 2)
						{
							console.log('Drawing from Source : '+lineArray[0].location+' to Destination : '+lineArray[1].location);	
							var prev = null, next=null,prevSpeed=null;
							prev = [parseFloat(lineArray[0].lon),parseFloat(lineArray[0].lat)];
							prevSpeed = lineArray[0].speed;
							next = [parseFloat(lineArray[1].lon),parseFloat(lineArray[1].lat)];
							// console.log(prev,pres);
							if(appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps")
							{
								if(prev && next)
								{
									prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
									pres = ol.proj.transform(next, 'EPSG:4326', 'EPSG:3857');
									//alert();
									var lineString = new ol.geom.LineString([prev, pres]);
									var feature2 = new ol.Feature({
										geometry: lineString
									});
									//console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>",param);
				                if (param.speedLimit)
								{
								 //VR RnD
									if( prevSpeed < 8)
									feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(51, 204, 51)',width: 5})}));
									else if  ( prevSpeed >8 && prevSpeed <= 20  ) 
									{
										feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(255, 153, 0)',width: 5})}));
									}
									else
									{
									feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(255, 0, 0)',width: 5})}));
									}
								}
								
									
									tmpl_trip_layer_display1.getSource().addFeature(feature2);
									
								}
								else{
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
					// // sendDataToDrawAnimationLineTemp();				//Commented on 22-10-2019 by Prashanth/Santhosh
				// }
		
		k++;
	}
	
	tmpl_trip_halt_display.getSource().clear();
	if(param.halt_points == true){
	// if(tmpl_trip_halt_display_flag == false){
		tmpl_trip_halt_display =  new ol.layer.Vector({
		title : "trip_halt",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			image : new ol.style.Icon({
				src : halt_img,
				anchor: [0.5, 1]
			})
		})
	});
	map.addLayer(tmpl_trip_halt_display);
	// }else{
		// tmpl_trip_halt_display.getSource().clear();
	// }
	
	for(var j=0;j<track_halt_points111.length;j++){
		var pres = [parseFloat(track_halt_points111[j].lng),parseFloat(track_halt_points111[j].lat)];
		//console.log(pres);
		if(appConfigInfo.mapData == "google"){
			pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
		}
		else if (appConfigInfo.mapData == "hereMaps") {
		    	pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
		}
		else{
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
		infoTableRowsDiv.style.borderRadius  = "5px";	

		document.getElementById("playbtn").onclick = function(){
         //alert(firstrun);
			if(firstrun)
				{
				tmpl.Trip.firstplay();
				firstrun = false;
				}
				else
				{
				tmpl.Trip.play();	
				}
				var downloadMap =  document.getElementById('downloadbut').style.display = "none";
		}
		document.getElementById("pausebtn").onclick = function(){
			firstrun = false;
			tmpl.Trip.pause();
			var downloadMap =  document.getElementById('downloadbut').style.display = "block";
			}
		document.getElementById("stopbtn").onclick = function(){
			firstrun = false;
			tmpl.Trip.stop();
			var downloadMap =  document.getElementById('downloadbut').style.display = "block";
			}
			
			document.getElementById("downloadbut").onclick = function(){
			
			mapDownload(true);
		
			}
			
	 	document.getElementById("checkresource").onclick = function(){
			var checkStatus = document.getElementById("checkresource").checked;
				if(checkStatus == false){
					tmpl.Trip.routeVehicle({
						map: map,
						visibility: false
					});
				}
				else{
					tmpl.Trip.routeVehicle({
						map: map,
						visibility: true
					});
				}
			}
	
		document.getElementById("checkrouteline").onclick = function(){
			var checkStatus = document.getElementById("checkrouteline").checked;
				if(checkStatus == false){
					tmpl.Trip.routeLayer({
						visibility: false
					});
				}
				else{
					tmpl.Trip.routeLayer({
						visibility: true
					});
				}
			}
			//VR  RnD
			try{
		if(  param.deviatedData)
		{
		document.getElementById('checkdeviatedpoint').disabled = false;
			tmpl.Overlay.create({
			map : param.map,
			features : param.deviatedData,
			layer : 'deviatedRouteLayer',
			layerSwitcher: false
		});
		tmpl.Layer.changeVisibility({
			map : param.map,
			layer : 'deviatedRouteLayer',
			visible : false
		});
			document.getElementById("checkdeviatedpoint").onclick = function(){
			var checkStatus = document.getElementById("checkdeviatedpoint").checked;
				if(checkStatus == false){
				tmpl.Layer.changeVisibility({
						map : param.map,
						layer : 'deviatedRouteLayer',
						visible : false
					});
				console.log("trip param:",param);
				}
				else{
					tmpl.Layer.changeVisibility({
							map : param.map,
							layer : 'deviatedRouteLayer',
							visible : true
						});
						console.log("trip param:",param);
				}
			}	
		}
		else{
		console.log("Deviated Point Layer deviatedData Missing");
		document.getElementById('checkdeviatedpoint').disabled = true;
		}
		}catch(e){
		console.log("Deviated Point Layer Creation Error..!",e);
		}
	
			
		document.getElementById("checkinfobox").onclick = function(){
			var checkStatus = document.getElementById("checkinfobox").checked;
			if(checkStatus == false){
				document.getElementById("infoTable").style.visibility = "hidden";
			}
			else{
				document.getElementById("infoTable").style.visibility = "visible";
			}
		} 
		
		function delayTimeEvent(val){
			tmpl.Trip.speed({
				level: val
			});
		}
		
		
	var prevLat,prevLon;
	var tempFilterArray = [];
	var uniqueData = [];
	var track_halt_points_id = [],track_halt_points = [],track_halt_points111 = [];
	//console.log(data1);
	for(var i=0;i<data1.length;i++){
		var lat = parseFloat(data1[i].lat);
		var lon = parseFloat(data1[i].lon);
		//var tempTime = data1[i].time.slice(0, 8);
		//data1[i].time = tempTime;
		var str = lon.toString()+lat.toString();
		// console.log("str from API ===> ",str);
		data1[i].id = str;
		data1[i].trip_icon = '';
			
		uniqueData.push(data1[i]);

	if(halt_points == true){
		if(i<data1.length-1){
			// if(data1[i].speed < 5){
				var tempTime1 = data1[i+1].time.slice(0, 8);
					data1[i+1].time = tempTime1;
				var tripDiffinSec = time_diffForTripInSec(data1[i].time,data1[i+1].time);
				// console.log("tripDiffinSec ===> ",tripDiffinSec);
				if(tripTimeDelay!=-1 && tripDiffinSec >= tripTimeDelay){
				// if(tripDiffinSec >= Trip_global_delay_time){
					if(track_halt_points_id.indexOf(str) == -1){
						track_halt_points_id.push(str);
						halt_points_indexTemp.push(i);
						var tempTime1 = data1[i+1].time.slice(0, 8);
						data1[i+1].time = tempTime1;
						var haltDuration = time_diff(data1[i].time,data1[i+1].time);
						// console.log("haltDuration ===> ",haltDuration);
						track_halt_points111.push({
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
						});
					
					}else{
						if(track_halt_points111.length>0){
							track_halt_points111[track_halt_points111.length - 1].endTime = data1[i].time;
						}
						
					}
				}	
		}
	}
	else{}
	}	
	
	console.log("TRIP HALT POINTS ====> ",track_halt_points111);
	tripHaltPointsGlobal = [];
	tripHaltPointsGlobal = track_halt_points111;
	// console.log("FINAL uniqueData from API ===> ",JSON.stringify(uniqueData));
	if(halt_points == true){
	for(var i=0;i<track_halt_points111.length;i++){
		var s = time_diff(track_halt_points111[i].startTime,track_halt_points111[i].endTime);
			s = parseInt((s.split(':')[0]) * 60 * 60) + parseInt(s.split(':')[1] * 60) + parseInt(s.split(':')[2]);
			s = parseInt(s);
			//console.log(track_halt_points111[i].startTime,track_halt_points111[i].endTime);
			//console.log("minHaltTime:",minHaltTime,s);
			if(minHaltTime != undefined){
				if(minHaltTime == 0){
					halt_points_index = [];
				}else{
					if(s > minHaltTime){
						//console.log(s,minHaltTime,s > minHaltTime,"valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);
						
						halt_points_index.push(halt_points_indexTemp[i]);
						track_halt_points.push(track_halt_points111[i]);	
					}else{
						//console.log(s,minHaltTime,s > minHaltTime,"in valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);
					}
				}
				
			}else{
				halt_points_index.push(halt_points_indexTemp[i]);
				track_halt_points.push(track_halt_points111[i]);
			}
		}
	}
	if(halt_points == true){
	for(var k=0;k<uniqueData.length;k++){
		for(l=0;l<track_halt_points.length;l++){
			if(uniqueData[k].id == track_halt_points[l].id){
				uniqueData[k].trip_icon = track_halt_points[l].trip_icon;
			}
		}
	}
	}
	// tripDataForReplyFromDisplay.track_halt_points = track_halt_points;
	// tripDataForReplyFromDisplay.uniqueData = uniqueData;
	//console.log("track_halt_points111 >>",track_halt_points111);
	//tripDataForReplyFromDisplay = uniqueData;
	console.log("tmpl_trip_layer_display_flag==> "+tmpl_trip_layer_display_flag);
	if(tmpl_trip_layer_display_flag == false){
		tmpl_trip_layer_display_flag = true;
		tmpl_trip_layer_display1 =  new ol.layer.Vector({
		title : "trip_line_display_layer1",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: route_color,
				width: route_style_width
			})
		})
	});
		tmpl_trip_layer_display =  new ol.layer.Vector({
		title : "trip_line_display_layer",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: route_color,
				width: route_style_width
			})
		})
	});
	tmpl_trip_layer_display1.set("display","TripLayerDisplay");
	tmpl_trip_layer_display.set("display","TripLayerDisplay");
	
		map.addLayer(tmpl_trip_layer_display1);
		map.addLayer(tmpl_trip_layer_display);
	}else{
		tmpl_trip_layer_display1.getSource().clear();
		tmpl_trip_layer_display.getSource().clear();
	}
	console.log(tmpl_trip_layer_display);
	var gblIndex = 1;
function sendDataToDrawAnimationLineTemp(){
	var k = gblIndex;
	
	var prev = [parseFloat(uniqueData[k - 1].lon),parseFloat(uniqueData[k - 1].lat)];
		var pres = [parseFloat(uniqueData[k].lon),parseFloat(uniqueData[k].lat)];
		
		console.log(prev,pres);
		if(appConfigInfo.mapData == "google"){
				prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
				pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
		}else if(appConfigInfo.mapData=='hereMaps')
		{
			prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
			pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
		}
		else{}
		
		var properties = {
				location : uniqueData[k].location,
				speed : uniqueData[k].speed,
				date : uniqueData[k].date,
				time : uniqueData[k].time,
				lat : uniqueData[k].lat,
				lon : uniqueData[k].lon
			};
			// drawAnimatedLineTemp(prev, pres, properties);				//Commented on 22-10-2019 by Prashanth/Santhosh
			gblIndex = gblIndex + 1;
}
	for(var k=1;k<uniqueData.length;k++){
		// console.log("track_halt_points111 before linestring ===> ",track_halt_points111);
		//console.log("uniqueData before linestring ===> ",uniqueData);
		
			//console.log(track_halt_points111.some(el => el.id === uniqueData[k].id));
			if(track_halt_points111.some(el => el.id === uniqueData[k].id)){
				console.log("SKIPPING LINE STRING");
			}
			else{
				var prev = [parseFloat(uniqueData[k - 1].lon),parseFloat(uniqueData[k - 1].lat)];
				var pres = [parseFloat(uniqueData[k].lon),parseFloat(uniqueData[k].lat)];
				var prevSpeed = uniqueData[k].speed;
				// console.log(prev,pres);
				if(appConfigInfo.mapData == "google"){
						prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
						pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
				}
				else if(appConfigInfo.mapData=='hereMaps')
				{
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
				//drawAnimatedLineTemp(prev, pres, properties);
				//console.log(prev,pres);
				
				var lineString = new ol.geom.LineString([prev, pres]);
				var feature2 = new ol.Feature({
					geometry: lineString
				});
				//VR RnD
			//	console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>2",param);
				feature2.setProperties(properties);
				     if (param.speedLimit)
								{
								 //VR RnD
									if( prevSpeed < 8)
									feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(51, 204, 51)',width: 5})}));
									else if  ( prevSpeed >8 && prevSpeed <= 20  ) 
									{
										feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(255, 153, 0)',width: 5})}));
									}
									else
									{
									feature2.setStyle(new ol.style.Style({stroke: new ol.style.Stroke({color: 'rgb(255, 0, 0)',width: 5})}));
									}
								 }
				tmpl_trip_layer_display1.getSource().addFeature(feature2);
				if(k == uniqueData.length - 1){
					tmpl.Zoom.toLayer({
							map : map,
							layer : "trip_line_display_layer1"
						});
					// sendDataToDrawAnimationLineTemp();				//Commented on 22-10-2019 by Prashanth/Santhosh
				}
			}
		
	}

	function drawAnimatedLineTemp(startPt, endPt, properties){
		var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
		var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
		var i = 0; var newEndPt;
		ivlDrawTempDisplay = setInterval(function () {
			console.log("steps==>"+trak_animationSteps);
			if (i > trak_animationSteps) {
				clearInterval(ivlDrawTempDisplay);
				if(gblIndex < uniqueData.length){
					sendDataToDrawAnimationLineTemp();
				}else{
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
				location : uniqueData[0].location,
				speed : uniqueData[0].speed,
				date : uniqueData[0].date,
				time : uniqueData[0].time,
				lat : uniqueData[0].lat,
				lon : uniqueData[0].lon
			};
	callbackFunc(properties);
	if(param.halt_points == true){
	if(tmpl_trip_halt_display_flag == false){
		tmpl_trip_halt_display_flag = true;
		tmpl_trip_halt_display =  new ol.layer.Vector({
		title : "trip_halt",
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			image : new ol.style.Icon({
				src : halt_img,
				anchor: [0.5, 1]
			})
		})
	});
		map.addLayer(tmpl_trip_halt_display);
	}else{
		tmpl_trip_halt_display.getSource().clear();
	}
	
	for(var j=0;j<track_halt_points.length;j++){
		var pres = [parseFloat(track_halt_points[j].lng),parseFloat(track_halt_points[j].lat)];
		//console.log(pres);
		if(appConfigInfo.mapData == "google"){
			pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
		}
		else if(appConfigInfo.mapData=='hereMaps')
				{
				pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
				}
		else{
		    	
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
	
	if(tmpl_trip_start_display_flag == false){
		tmpl_trip_start_display_flag = true;
		tmpl_trip_start_display =  new ol.layer.Vector({
		source: new ol.source.Vector(),
		title : "trip_start",
		style : new ol.style.Style({
			image : new ol.style.Icon({
				src : start_url,
				anchor: [0.45, 1],
				anchorOrigin: 'top-bottom'
			})
		})
	});
		map.addLayer(tmpl_trip_start_display);
	}else{
		tmpl_trip_start_display.getSource().clear();
	}
	
	
	if(tmpl_trip_end_display_flag == false){
		tmpl_trip_end_display_flag = true;
		tmpl_trip_end_display =  new ol.layer.Vector({
		source: new ol.source.Vector(),
		title : "trip_end",
		style : new ol.style.Style({
			image : new ol.style.Icon({
				src : end_url,
				anchor: [0.5, 1]
			})
		})
	});
		map.addLayer(tmpl_trip_end_display);
	}else{
		tmpl_trip_end_display.getSource().clear();
	}
	
	if(tmpl_trip_vehicle_display_flag == false){
		tmpl_trip_vehicle_display_flag = true;
			var scale = 1;
				if(vehicle_icon_scale != undefined)
					scale = vehicle_icon_scale;
		tmpl_trip_vehicle_display =  new ol.layer.Vector({
		source: new ol.source.Vector(),
		style : new ol.style.Style({
			image : new ol.style.Icon({
				src : img_url,
				scale : scale
			})
		})
	});
		tmpl_trip_vehicle_display.setMap(map);
		console.log("FINAL uniqueData from API ===> ",uniqueData);
		document.getElementById("resourceDiv").innerHTML = uniqueData[0].vehNo;
		document.getElementById("callSignDiv").innerHTML = uniqueData[0].vehType;
		document.getElementById("positionDiv").innerHTML = uniqueData[0].lon + ", " + uniqueData[0].lat;
		document.getElementById("speedDispDiv").innerHTML = uniqueData[0].speed + " km/hr";
		document.getElementById("locationDiv").innerHTML = uniqueData[0].location;
		document.getElementById("dateTimeDIv").innerHTML = uniqueData[0].time;	
		
	}else{
		tmpl_trip_vehicle_display.getSource().clear();
	}
	
		var end_pos = uniqueData.length-1;
		var start = [parseFloat(uniqueData[0].lon),parseFloat(uniqueData[0].lat)];
		var end = [parseFloat(uniqueData[end_pos].lon),parseFloat(uniqueData[end_pos].lat)];
		if(appConfigInfo.mapData == "google"){
			start = ol.proj.transform(start, 'EPSG:4326', 'EPSG:3857');
			end = ol.proj.transform(end, 'EPSG:4326', 'EPSG:3857');
		}
			else if(appConfigInfo.mapData=='hereMaps')
				{
				start = ol.proj.transform(start, 'EPSG:4326', 'EPSG:3857');
				end = ol.proj.transform(end, 'EPSG:4326', 'EPSG:3857');
				}
		else{
		    	
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
		feature2_s.set('id','trip_start');
		feature2_s.set('rendering_type',12);	
		
		feature2_v.set('rendering_type',13);
		feature2_v.set('layer_name','trip_vehcile_marker');
		feature2_v.setProperties(uniqueData[0]);
		
		feature2_v.set('id',tripVehicleId);
		
		feature2_e.setProperties(uniqueData[end_pos]);
		feature2_e.set('rendering_type',12);
		feature2_e.set('id','trip_end');
		tmpl_trip_start_display.getSource().addFeature(feature2_s);
		tmpl_trip_vehicle_display.getSource().addFeature(feature2_v);
		tmpl_trip_end_display.getSource().addFeature(feature2_e);
		if(routeMouseOverDetails == true){
		var ta_tooltip = document.createElement('tooltip');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
	
	map.addOverlay(overlay_mouseOver_label);
				map.on('pointermove', function(evt){
			
			var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
			//if(layer){
				if(feature.get('layer_name') == 'trip_vehcile_marker'){
					
					return feature;
				}
			//}
			});
			ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
			if(feature_mouseOver) {
				overlay_mouseOver_label.setPosition(evt.coordinate);
				ta_tooltip.innerHTML = label;
			}
		});
	}
	if(returnTableData == true){
		var callbackFunc=param.TableDataCallBack;
		var data= param.data;
		var grid_data = [];
		var table_data = [];
		var halt_index = 0;
		for(var i =0; i<data.length; i++){
			if(halt_points_index.indexOf(i) != -1){
				table_data[i] = {};
				table_data[i].latitude = data[i].lat;
				table_data[i].longitude = data[i].lon;
				table_data[i].date = data[i].date;
				table_data[i].time = data[i].time;
				table_data[i].location = data[i].location;
				table_data[i].speed = data[i].speed;
				table_data[i].haltInTime = track_halt_points[halt_index].startTime;
				table_data[i].haltOutTime = track_halt_points[halt_index].endTime;
				var s = time_diff(track_halt_points[halt_index].endTime,track_halt_points[halt_index].startTime)
				table_data[i].haltDuration = s;
				halt_index = halt_index + 1;
			}else{
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
		for(var i =0; i<track_halt_points.length; i++){
			grid_data[index] = {};
			grid_data[index].typemessage = "trip halt";
			grid_data[index].latitude = track_halt_points[i].lat;
			grid_data[index].longitude = track_halt_points[i].lng;
			grid_data[index].date = track_halt_points[i].date;
			grid_data[index].time = track_halt_points[i].startTime;
			grid_data[index].haltInTime = track_halt_points[i].startTime;
			grid_data[index].haltOutTime = track_halt_points[i].endTime;
			var s = time_diff(track_halt_points[i].endTime,track_halt_points[i].startTime);
			grid_data[index].haltDuration = s;
			grid_data[index].location = track_halt_points[i].location;
			index = index + 1;
		}
			grid_data[index] = {};
			grid_data[index].typemessage = "trip end";
			grid_data[index].latitude = uniqueData[uniqueData.length-1].lat;
			grid_data[index].longitude = uniqueData[uniqueData.length-1].lon;
			grid_data[index].date = uniqueData[uniqueData.length-1].date;
			grid_data[index].time = uniqueData[uniqueData.length-1].time;
			grid_data[index].haltInTime = 0;
			grid_data[index].haltOutTime = 0;
			grid_data[index].haltDuration = 0;
			grid_data[index].location = uniqueData[uniqueData.length-1].location;
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



function time_diff(t1, t2) 
{
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
 
return hours+":"+minutes+":"+seconds;
}

function time_diffForTripInSec(t1, t2) 
{
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

var hms = hours+":"+minutes+":"+seconds;

var a = hms.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
var returnseconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
return returnseconds;
}

function time_chk(t1, t2){
console.log("Date1:",t1,"Date1:", t2);
 var date1, date2;  
date1 = new Date(t1 );
 date2 = new Date( t2);
 var res = Math.abs(date1 - date2) / 1000;
// get total days between two dates
 var days = Math.floor(res / 86400);
 // get hours        
var hours = Math.floor(res / 3600) % 24;        
 // get minutes
var minutes = Math.floor(res / 60) % 60;
// get seconds
var seconds = res % 60;

var hms = hours+":"+minutes+":"+seconds;


var a = hms.split(':'); // split it at the colons

// minutes are worth 60 seconds. Hours are worth 60 minutes.
var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

console.log("returnseconds::::-->",seconds);
return seconds;
}

tmpl.Trip.replay = function() {
	if(tripDataForReplyFromDisplay_flag == true){
		tripDataForReplyFromDisplay.hideAllLayers = true;
		tmpl.Trip.animation(tripDataForReplyFromDisplay);
		tripDataForReplyFromDisplay_flag = false;
	}
}
tmpl.Trip.play = function(){
	// var map = param.map;
	tripDataForReplyFromDisplay_flag = true;
	if(tripDataForReplyFromDisplay_flag == true){
		// if(map){
			// map.getView().setZoom(15);                   //Added by Prashanth on 24-07-19
		// }
		tripDataForReplyFromDisplay.hideAllLayers = true;
		tmpl.Trip.animation(tripDataForReplyFromDisplay);
		tripDataForReplyFromDisplay_flag = false;
	}else{
	//console.log(current_status_flag);
		
	}
}

tmpl.Trip.firstplay = function(){
    console.log("I am being called 1");
	// var map = param.map;
	console.log("Trip Play Function-->1",tripDataForReplyFromDisplay);
	tripDataForReplyFromDisplay_flag = true;
	if(tripDataForReplyFromDisplay_flag === true){
		// if(map){
			// map.getView().setZoom(15);                   //Added by Prashanth on 24-07-19
		// }
		tripDataForReplyFromDisplay.hideAllLayers = true;
		console.log("Trip Play Function-->2",tripDataForReplyFromDisplay);
		tmpl.Trip.animation(tripDataForReplyFromDisplay);
		tripDataForReplyFromDisplay_flag = false;
	}else{
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
tmpl.Trip.animation = function (param){
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
	if(label == undefined)
		label = '';
	if(directionImgae == undefined)
		directionImgae = 'https://openlayers.org/en/v4.0.1/examples/data/arrow.png';
	tripAnimation_started = true;
	if(param.routeMouseOverDetails == true){
		EnableTripToolTip(map,tooltipLocation);
	}
	
	if(param.halt_points == true){
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
	var prevLat,prevLon;
	var tempFilterArray = [];
	// console.log("DATAAAA ===> ",data1);
	for(var i=0;i<data1.length;i++){
		var lat = parseFloat(data1[i].lat);
		var lon = parseFloat(data1[i].lon);
		var tempTime11 = data1[i].time.slice(0, 8);
			data1[i].time = tempTime11;
		var str = lon.toString()+lat.toString();
		if(tempFilterArray.indexOf(str) == -1){
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
	if(noZoom == true){
		
	}else{
		tmpl.Zoom.toXYcustomZoom({
			map : map,
			latitude : uniqueData[0].lat,
			longitude : uniqueData[0].lon,
			zoom : 16
		});
	}
	
	
	var index = 1;
	var i = index;
	var temp_halt_index = '';
	extraAnimation();
	function panMap(point){
		var map = this.map;
		var current=point;
		var currentgps = new ol.geom.Point(current);
        var cur_veh = new ol.Feature(currentgps);
		//cur_veh=ol.proj.transform(cur_veh, 'EPSG:4326', 'EPSG:3857');
        var view_port =  
		map.getView().calculateExtent(map.getSize());
        var  vehicle_inside=cur_veh.getGeometry().intersectsExtent(view_port);
        if(vehicle_inside==false){
            map.getView().setCenter(current);
        }
	}
	function drawAnimatedLine(startPt, endPt, steps, trak_animationSpeed, fn,properties,delay){
		//console.log(startPt, endPt, steps, trak_animationSpeed, fn,properties,delay);
		if(tripHaltPointsGlobal.some(el => el.id === properties.id)){
			
			 clearInterval(ivlDraw);
			 extraAnimation();
			 return;
		}
		else{
			 var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
    var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
    var i = 0;
    var prevLayer;
	var newEndPt;
	
	temp_store_animation_pause = {
		startPt : startPt,
		endPt : endPt,
		steps : trak_animationSteps,
		time : trak_animationSpeed,
		properties : properties,
		delayProperties : delay
	};
	
	if(callbackFunc != undefined)
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
        newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
		panMap(newEndPt);
		// console.log('newEndPt ==> ',newEndPt);
		temp_store_animation_pause.startPt = newEndPt;
		temp_store_animation_pause.steps = temp_store_animation_pause.steps - 1;
        var line = new ol.geom.LineString([startPt, newEndPt]);
        var point = new ol.geom.Point(newEndPt);
        var fea = new ol.Feature(line);
		fea.setProperties(properties);
		//console.log(newEndPt,endPt);
		
		if(newEndPt[0] == endPt[0] && newEndPt[1] == endPt[1]){
			fea.set('inter',false);
			//console.log(true);
		}
		else{
			fea.set('inter',true);
		}
		
		var delay_halt_fea = new ol.Feature(point);
		delay_halt_fea.setProperties(properties);
		//delay_halt_fea=ol.proj.transform(delay_halt_fea, 'EPSG:4326', 'EPSG:3857');
		var p_fea = new ol.Feature(point);
			//p_fea=ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
			if(trip_lines_layer_flag ==  false){
					trip_lines_layer = new ol.layer.Vector({
					source: new ol.source.Vector({
						features : [fea]
					}),
					//style: styleFunction
					style : new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: route_color,
							width: 4
						})
					})
				});
				trip_lines_layer.set("trip","TripAnimationLayer");
				trip_lines_layer.setMap(map);
				tmpl_setMap_layer_global.push({
					layer : trip_lines_layer,
					title :  'TripAnimationLayer',
					visibility : true,
					map : map
				});
				//map.addLayer(trip_lines_layer);
				trip_lines_layer_flag = true;
				trip_lines_layer.setVisible(false);
			}else{
				
				
				
				if(Trip_global_delay_time != -1){
					//console.log("outside",delay,Trip_global_delay_time);
					delay = parseInt(delay);
				if(delay < Trip_global_delay_time){
					trip_lines_layer.getSource().addFeature(fea);
					firs_delayFlag = false;
				}else{
					
					
					if(firs_delayFlag == false){
					//zzzzzzzzz
					delay_halt_fea.set('rendering_type',12);
					tmpl_trip_halt_animation.getSource().addFeature(delay_halt_fea);
					firs_delayFlag = true;
					//console.log("inside",delay,Trip_global_delay_time);
					}
					
					
					
				}
				}else{
					
					trip_lines_layer.getSource().addFeature(fea);
				}
			}
			if(trip_lines_layer_direction_flag ==  false){
					trip_lines_layer_direction = new ol.layer.Vector({
					source: new ol.source.Vector()
				});
				trip_lines_layer_direction.setMap(map);
				tmpl_setMap_layer_global.push({
					layer : trip_lines_layer_direction,
					title :  'TripAnimationLayerDirection',
					visibility : true,
					map : map
				});
				//map.addLayer(trip_lines_layer_direction);
				trip_lines_layer_direction_flag = true;
			}else{
		if(fea.get('inter') == false){
          var dx = newEndPt[0] - startPt[0];
          var dy = newEndPt[1] - startPt[1];
		 var xxx = new ol.geom.LineString([startPt, newEndPt]);
          var curdis = Math.round(xxx.getLength() * 100) / 100;
		  previousDistance = previousDistance + curdis;
		   var rotation = Math.atan2(dy, dx);
		   //console.log(previousDistance);
		  if(previousDistance > 600){
			  previousDistance = 0;
			 
          p_fea.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
              src: directionImgae,
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
          }));
		  }else{
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
			if(trip_end_marker_flag ==  false){
				var scale = 1;
				if(vehicle_icon_scale != undefined)
					scale = vehicle_icon_scale;
				
				
				
		
				 p_fea.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						src: img_url,
						rotation: angle,
						scale: scale
					})
				}));
				p_fea.setProperties(properties);
				p_fea.set('rendering_type',13);
				p_fea.set('id',tripVehicleId);
				p_fea.set('layer_name','trip_vehcile_marker');
				trip_end_Marker = new ol.layer.Vector({
					title:'trip_vehcile_marker',
					source: new ol.source.Vector({
						features : [p_fea]
					})
				});
				trip_end_Marker.setMap(map);
				
				tmpl_setMap_layer_global.push({
					layer : trip_end_Marker,
					title :  'trip_vehcile_marker',
					visibility : true,
					map : map
				});
					
				trip_end_marker_flag = true;
			}else{
				//p_fea.setProperties(properties);
				if(trip_end_Marker.getSource().getFeatures().length == 1){
					trip_end_Marker.getSource().getFeatures()[0].setProperties(properties);
					trip_end_Marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
					if(appConfigInfo.mapData == 'hereMaps')
					{
					//newEndPt = ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857');
					}
					trip_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);
					
				}
				else{
					if(appConfigInfo.mapData == 'hereMaps')
						{
						//p_fea = ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
						}
					trip_end_Marker.getSource().addFeatures([p_fea]); 
				}
			}
        i++;
	// })
    }, trak_animationSpeed);
		}
   
}

	

	function extraAnimation(){
		// if(index == uniqueData.length-1){					//Condition added on 14-10-2019 by Prashanth to remove Trip infobox on vehicle reaching last point
			// removeTripInfoTable();	
		// }
		// console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);
		
		if(index < uniqueData.length){
			// console.log("index in extraAnimation ===> ",index);
			i = index;
			//console.log(i);
			// console.log("uniqueData in extraAnimation ===> ",uniqueData);
			// console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);
			// if(tripHaltPointsGlobal.some(el => el.id === uniqueData[i].id)){
                if ($("#infoTable").length > 0)
                {
                    
				document.getElementById("resourceDiv").innerHTML = uniqueData[i].vehNo;
				document.getElementById("callSignDiv").innerHTML = uniqueData[i].vehType;
				document.getElementById("positionDiv").innerHTML = uniqueData[i].lon + ", " + uniqueData[i].lat;
				document.getElementById("speedDispDiv").innerHTML = uniqueData[i].speed + " km/hr";
				document.getElementById("locationDiv").innerHTML = uniqueData[i].location;
				document.getElementById("dateTimeDIv").innerHTML = uniqueData[i].time;
				var lat = parseFloat(uniqueData[i].lat);
				var plat = parseFloat(uniqueData[i-1].lat);
				var lon = parseFloat(uniqueData[i].lon);
				var plon = parseFloat(uniqueData[i-1].lon);
				var point,p_point,p_point1;
				var s = time_diff(uniqueData[i].time,uniqueData[i-1].time);
				s = s.split(':')[0] * 60 * 60 + s.split(':')[1] * 60 + s.split(':')[2];
				var delayProperties = s;
				if(appConfigInfo.mapData === "google" || appConfigInfo.mapData === "hereMaps"){
					point = ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857');
					p_point = ol.proj.transform([plon,plat], 'EPSG:4326', 'EPSG:3857');
				}
				else{
					point = [lon,lat];
					p_point = [plon,plat];
				}
				var pointGeom = new ol.geom.Point(p_point);
				var p_feature = new ol.Feature({
					geometry : pointGeom
				});
            
				if(track_halt_points_id.indexOf(tempFilterArray[i-1]) != -1){
					var inin = track_halt_points_id.indexOf(tempFilterArray[i-1]);
					var plat1 = parseFloat(track_halt_points[inin].lat);
				var plon1 = parseFloat(track_halt_points[inin].lng);
				if(appConfigInfo.mapData === "google" || appConfigInfo.mapData === "hereMaps"){
					p_point1 = ol.proj.transform([plon1,plat1], 'EPSG:4326', 'EPSG:3857');
				}else{
					p_point1 = [plon1,plat1];
				}
				var pointGeom1 = new ol.geom.Point(p_point1);
				var p_feature1 = new ol.Feature({
					geometry : pointGeom1
				});
				p_feature1.setProperties(track_halt_points[inin]);
				//console.log(p_point1);
				if(param.halt_points == true){
		
				if(trip_points_layer_flag1 ==  false){
					trip_points_layer1 = new ol.layer.Vector({
						source: new ol.source.Vector({
							features : [p_feature1]
						}),
						style : new ol.style.Style({
							image : new ol.style.Icon({
								anchor: [0.5, 1],
								src : halt_img,
								//offset : [0,-5]
							})
						})
					});
					trip_points_layer1.set('title','Halt_Layer');
					map.addLayer(trip_points_layer1);
					trip_points_layer_flag1 = true;
				}else{
					//trip_points_layer1.getSource().clear();
					trip_points_layer1.getSource().addFeature(p_feature1);
				}
				}
			}
                    
                }
            
				var properties = {
					id: uniqueData[i].id,
					location : uniqueData[i].location,
					speed : uniqueData[i].speed,
					date : uniqueData[i].date,
					time : uniqueData[i].time,
					lat : uniqueData[i].lat,
					lon : uniqueData[i].lon
				};
				if(hideAllLayers == true){
					tmpl_trip_vehicle_display.setVisible(false);
					trip_points_layer1.setVisible(false);
					trip_points_layer.setVisible(false);
					//trip_end_Marker
					//trip_lines_layer.setVisible(false);
				}

				if(i == uniqueData.length-1){
				
				}
				index = index + 1;
				drawAnimatedLine(p_point,point, trak_animationSteps, trak_animationSpeed, function () {},properties,delayProperties);
			// }
			
	
	}else{
		//alert("zzz");
		index = index + 1;
		tmpl.Trip.stop();
		if(tripEndCallbackFunc != undefined)
		tripEndCallbackFunc();
	}
		
	}
	function panMap(point){
		try{
		var current=point;//[lat,lon];
		var currentgps = new ol.geom.Point(current);
        var cur_veh = new ol.Feature(currentgps);
        var view_port = map.getView().calculateExtent(map.getSize());
        var  vehicle_inside=cur_veh.getGeometry().intersectsExtent(view_port);
        if(vehicle_inside==false){
            map.getView().setCenter(current);
        }
		}catch(e){
			console.log("!Error......");
		}
	}


	function animatebtn(map) {
            try {
				var current_status_flag = "start";

                tmpl.Trip.pause = function(){
					if(current_status_flag == "none"){
						
					}else if(current_status_flag == "start"){
						clearInterval(ivlDraw);
						current_status_flag = "pause";
					}else if(current_status_flag == "pause"){
						
					}else if(current_status_flag == "stop"){
						
					}
				}
				tmpl.Trip.play = function(){
					firstrun = false;
					console.log("I am being called 2");
					if(tripDataForReplyFromDisplay_flag == true){
						tripDataForReplyFromDisplay.hideAllLayers = true;
						tmpl.Trip.animation(tripDataForReplyFromDisplay);
						//tmpl.Trip.display(tripDataForReplyFromDisplay);
						tripDataForReplyFromDisplay_flag = false;
					}else{
						
					//console.log(current_status_flag);
					if(current_status_flag == "none"){
						//tmpl.Trip.clear({map : temp_store_animation_stop.map});
						tmpl.Trip.stopClear({map : temp_store_animation_stop.map});
						tmpl.Trip.animation(temp_store_animation_stop);
					}else if(current_status_flag == "start"){
						
					}else if(current_status_flag == "pause"){
						drawAnimatedLine(temp_store_animation_pause.startPt,temp_store_animation_pause.endPt, temp_store_animation_pause.steps, temp_store_animation_pause.time, function () {},temp_store_animation_pause.properties,temp_store_animation_pause.delayProperties);
					}else if(current_status_flag == "stop"){
						
						//tmpl.Trip.clear({map : temp_store_animation_stop.map});
						tmpl.Trip.stopClear({map : temp_store_animation_stop.map});
						tmpl.Trip.animation(temp_store_animation_stop);
					}
					current_status_flag = "start";	
					}
				}
					
			   tmpl.Trip.stop = function(param){

					if(current_status_flag == "none"){
						
					}else if(current_status_flag == "start"){
						clearInterval(ivlDraw);
						current_status_flag = "stop";
					}else if(current_status_flag == "pause"){
						clearInterval(ivlDraw);
						current_status_flag = "stop";
					}else if(current_status_flag == "stop"){
						
					}				 
				}
					var animationSpeedLevel = 3;
					tmpl.Trip.speedInc = function(){
						var level = animationSpeedLevel + 1;
						console.log("SPEED LEVEL FROM speedInc API ====>",level);
						if(level >= 5 ){
							animationSpeedLevel = 5;
							trak_animationSpeed = 30;
						}else if(level == '4' || level == 4){
							trak_animationSpeed = 50;
						}else if(level == '3' || level == 3){
							trak_animationSpeed = 100;
						}else if(level == '2' || level == 2){
							trak_animationSpeed = 250;
						}else if(level == '1' || level == 1){
							trak_animationSpeed = 450;
						}
					}
					tmpl.Trip.speedDec = function(){
						var level = animationSpeedLevel - 1;
						console.log("SPEED LEVEL FROM speedDec API ====>",level);
						if(level == '5' || level == 5){
							trak_animationSpeed = 30;
						}else if(level == '4' || level == 4){
							trak_animationSpeed = 50;
						}else if(level == '3' || level == 3){
							trak_animationSpeed = 100;
						}else if(level == '2' || level == 2){
							trak_animationSpeed = 250;
						}else if(level <= 1){
							trak_animationSpeed = 450;
							animationSpeedLevel = 1;
						}
					}
					tmpl.Trip.speed = function(param){
						//tmpl.Trip.pause();
						var level = param.level;
						if(level == '5' || level == 5){
							trak_animationSpeed = 30;
						}else if(level == '4' || level == 4){
							trak_animationSpeed = 50;
						}else if(level == '3' || level == 3){
							trak_animationSpeed = 100;
						}else if(level == '2' || level == 2){
							trak_animationSpeed = 250;
						}else if(level == '1' || level == 1){
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
function EnableTripToolTip(map,loc) {
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

    mouseHoverDetails = function(evt) {

        var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {

          if(layer){
			if(layer.get('trip') == "TripAnimationLayer" || layer.get('display') =="TripLayerDisplay"){
				return feature;
			}
		}else{
			for(var i=0;i<tmpl_setMap_layer_global.length;i++){
			if(tmpl_setMap_layer_global[i].title == 'TripAnimationLayer'){
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
			if(loc == false){
				if(feature_mouseOver.getProperties().speed == undefined){
					//console.log("From API - speed is undefined, replaced with empty string");
					feature_mouseOver.getProperties().speed = '';
				}
				ta_tooltip.innerHTML =  "Speed:" + feature_mouseOver.getProperties().speed +"Km/h," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
			}else{
				if(feature_mouseOver.getProperties().speed == undefined){
					//console.log("From API - speed is undefined, replaced with empty string");
					feature_mouseOver.getProperties().speed = '';
				}
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().location +"," + "Speed:" + feature_mouseOver.getProperties().speed +"Km/h," + feature_mouseOver.getProperties().date + "," + feature_mouseOver.getProperties().time;
			}
        }
    };
    map.on('pointermove', mouseHoverDetails);

}

function removeTripInfoTable(){							//Function added on 14-10-2019 by Prashanth to remove Trip infobox on vehicle reaching last point
		Element.prototype.remove = function() {
			this.parentElement.removeChild(this);
		}
		NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
			for(var i = this.length - 1; i >= 0; i--) {
				if(this[i] && this[i].parentElement) {
					this[i].parentElement.removeChild(this[i]);
				}
			}
		}
		var infoTable = document.getElementById("infoTable");
		if(infoTable){
			infoTable.remove();
		}
		else{}
	}


function TripPoints(map){
	var featureArray = [];
	var point;
	for(var i=0;i<uniqueData.length;i++){
		var lat = parseFloat(uniqueData[i].lat);
		var lon = parseFloat(uniqueData[i].lon);
		if(appConfigInfo.mapData === "google"){
			point = ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857');
		}else{
			point = [lon,lat];
		}
		var pointGeom = new ol.geom.Point(point);
        var feature = new ol.Feature({
            geometry : pointGeom
		});
		featureArray.push(feature);
	}
	if(trip_points_layer_flag ==  false){
		trip_points_layer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features : featureArray
			})
		});
		map.addLayer(trip_points_layer);
		trip_points_layer_flag = true;
	}else{
		trip_points_layer.getSource().clear();
		trip_points_layer.getSource().addFeatures(featureArray);
	}
}

/*
tmpl.Feature.getLatLong = function(param) {
	var mapObj = param.map;
	var id = param.id;
	var layerName = param.layer;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var latlon;
	for(var i=0;i<length;i++){
		var existingLayer = Layers.item(i);
		if(existingLayer){
			if(existingLayer.get('title') === layerName){
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if(feature.getProperties()['id']==id){
						if(appConfigInfo.mapData==='google'){
							latlon = feature.getGeometry().getCoordinates();
							latlon = ol.proj.transform(latlon, 'EPSG:3857','EPSG:4326')
							
						}
						else{
							latlon = feature.getGeometry().getCoordinates();
						}
					}
				});
			}
		}
	}
	return latlon;
}*/

//}).call(this, {});
