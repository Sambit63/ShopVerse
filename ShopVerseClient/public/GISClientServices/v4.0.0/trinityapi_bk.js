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

(function () {

	tmpl.Map.getToken = function (param) {
		var callbackFun = param.callbackFun;
		var rest_resp = null;
		var settings = {
			"url": appConfigInfo.pentaBGetTokenAPIService,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": {
				"grant_type": "password",
				"client_id": appConfigInfo.pentaBClientId,
				"client_secret": appConfigInfo.pentaBClientSecret,
				"username": appConfigInfo.pentaBUserName,
				"password": appConfigInfo.pentaBPassword,

			}
		};
		$.ajax(settings).done(function (response) {

			setTimeout(function () {

				if (callbackFun) {
					localStorage.setItem("pentaBAccessToken", null);
					var toc = "Bearer " + response.access_token;
					console.info("PentaB Access Token :-:", toc);
					localStorage.setItem('pentaBAccessToken', toc);
					callbackFun(response);
				}
				else {
					var toc = "Bearer " + response.access_token;
					pentaBAccessToken = toc;
					localStorage.setItem("pentaBAccessToken", null);
					console.info("PentaB Access Token :-:", toc);
					localStorage.setItem('pentaBAccessToken', toc);
					return toc;
				}

			}, 0);
		});

	}

	//---------------------------------- Beginning of Creating Google Map------------------------------------//

	// **** Creating Google Map inside the specified targetDiv using the map properties specified in the appconfig.js file **** //

	//var base_map_streetLayer_trinity,base_map_trinity;


	var mapStylesBundle =
	{
		"normal": {
			"name": "Normal Node",
			"style": []
		},
		"night": {
			"name": "Night Mode",
			"style": [
				{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
				{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
				{ "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
				{ "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
				{ "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
				{ "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
				{ "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
				{ "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
				{ "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
				{ "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
				{ "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
				{ "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
				{ "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
				{ "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
				{ "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
				{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
				{ "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
				{ "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
			]
		},
		"darkGrey": {
			"name": "Dark Grey Mode",
			"style": [
				{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
				{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
				{ "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
				{ "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }, { "visibility": "off" }] },
				{ "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
				{ "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
				{ "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
				{ "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
				{ "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
				{ "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] },
				{ "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
				{ "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
				{ "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
				{ "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
				{ "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
				{ "featureType": "road.arterial", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road.local", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
				{ "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
				{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
				{ "featureType": "water", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
			]
		},
		"cobalt": {
			"name": "Cobalt Mode",
			"style": [
				{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" }] },
				{ "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "0" }, { "lightness": "-10" }] },
				{ "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
				{ "featureType": "administrative.province", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
				{ "featureType": "landscape", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "on" }] },
				{ "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "road", "elementType": "all", "stylers": [{ "visibility": "on" }] },
				{ "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
				{ "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "transit.station.airport", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "transit.station.bus", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "transit.station.rail", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }] },
				{ "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#161616" }] },
				{ "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "off" }] }
			]
		},
		"trinity": {
			"name": "Trinity Google Mode",
			"style": [
				{ "featureType": "all", "elementType": "all", "stylers": [{ "lightness": "29" }, { "invert_lightness": true }, { "hue": "#008fff" }, { "saturation": "-73" }] },
				{ "featureType": "all", "elementType": "labels", "stylers": [{ "saturation": "-72" }] },
				{ "featureType": "administrative", "elementType": "all", "stylers": [{ "lightness": "32" }, { "weight": "0.42" }] },
				{ "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": "-53" }, { "saturation": "-66" }] },
				{ "featureType": "landscape", "elementType": "all", "stylers": [{ "lightness": "-86" }, { "gamma": "1.13" }] },
				{ "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "hue": "#006dff" }, { "lightness": "4" }, { "gamma": "1.44" }, { "saturation": "-67" }] },
				{ "featureType": "landscape", "elementType": "geometry.stroke", "stylers": [{ "lightness": "5" }] },
				{ "featureType": "landscape", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "weight": "0.84" }, { "gamma": "0.5" }] },
				{ "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }, { "weight": "0.79" }, { "gamma": "0.5" }] },
				{ "featureType": "road", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "lightness": "-78" }, { "saturation": "-91" }] },
				{ "featureType": "road", "elementType": "labels.text", "stylers": [{ "color": "#ffffff" }, { "lightness": "-69" }] },
				{ "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "lightness": "5" }] },
				{ "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "lightness": "10" }, { "gamma": "1" }] },
				{ "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "lightness": "10" }, { "saturation": "-100" }] },
				{ "featureType": "transit", "elementType": "all", "stylers": [{ "lightness": "-35" }] },
				{ "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] },
				{ "featureType": "water", "elementType": "all", "stylers": [{ "saturation": "-97" }, { "lightness": "-14" }] }
			]
		}
	}

	var streetLayer_trinity, tmpl_setMap_layer_global = [];

	tmpl.Map.resetTrip = function () {
		firstrun = true;
		console.log('FIRST RUN ', firstrun);
	}

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
					if (defaultZoom != undefined)
						appConfigInfo.googlezoom = defaultZoom;
					//console.log("from api creating map",appConfigInfo.googlezoom);
					if (appConfigInfo.mapData === "google") {

						var viewg;
						//console.log(appConfigInfo.setResolution);
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
								//extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857");,
								minZoom: parseInt(appConfigInfo.googleMinZoom)
							})
						}
						var map;
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

							/*var osmLayer = new olgm.layer.Google({
								visible : true, 
								mapTypeId: google.maps.MapTypeId.ROADMAP
							});*/


							map = new ol.Map({
								interactions: ol.interaction.defaults({
									altShiftDragRotate: false,
									dragPan: false,
									rotate: false
								}).extend([new ol.interaction.DragPan({ kinetic: null })]),
								layers: [],//layers: [ osmLayer ],
								target: targetDiv,
								view: viewg,
								loadTilesWhileAnimating: true,
							});
							var layers = map.getLayers();
							//layers.setAt(0, osmLayer); 

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
								source: new ol.source.OSM()
							}));

						} else if (appConfigInfo.type == "esri") {

							/*var layer1 = new olgm.layer.Google({
								visible : true, 
								mapTypeId: google.maps.MapTypeId.ROADMAP
							});*/


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
						} else if (appConfigInfo.type == "satellite") {

							var layer1 = new olgm.layer.Google({
								visible: true,
								mapTypeId: google.maps.MapTypeId.ROADMAP
							});

							map = new ol.Map({
								interactions: ol.interaction.defaults({
									altShiftDragRotate: false,
									dragPan: false,
									rotate: false
								}).extend([new ol.interaction.DragPan({ kinetic: null })]),
								layers: [layer1],
								target: targetDiv,
								view: viewg,
								loadTilesWhileAnimating: true,
							});
							var layers = map.getLayers();
							layers.setAt(0, layer1);

							var olGM = new olgm.OLGoogleMaps({
								map: map,
								mapIconOptions: {
									useCanvas: true
								}
							});
							olGM.activate();

							gmap_googleMap = olGM.getGoogleMapsMap();
							map.set('olgmObj', olGM);

							toggleGoogleMap('satellite', map);
						}
						// **** Setting toggle for Street and Satellite view **** //

						if (appConfigInfo.googleSatelliteView) {

							var streetButton = document.createElement('button_new');
							var streetText = document.createTextNode("Map");
							streetButton.appendChild(streetText);
							streetButton.title = 'Show Street View';
							streetButton.className = 'ol-map-btn .ol-unselectable ';

							var satelliteButton = document.createElement('button_new');
							var satelliteText = document.createTextNode("Earth");
							satelliteButton.appendChild(satelliteText);
							satelliteButton.title = 'Show Satellite Imagery';
							satelliteButton.className = 'ol-sat-btn';

							var streetControl = new ol.control.Control({
								element: streetButton
							});
							map.addControl(streetControl);

							streetButton.addEventListener('click', function () {
								toggleGoogleMap('street', streetControl.getMap());
							});

							var satelliteControl = new ol.control.Control({
								element: satelliteButton
							});
							map.addControl(satelliteControl);
							satelliteButton.addEventListener('click', function () {
								toggleGoogleMap('satellite', satelliteControl.getMap());
							});
						}
						activate(map);
						for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
							if (tmpl_setMap_layer_global[i].visibility == true && tmpl_setMap_layer_global[i].map == map) {
								tmpl_setMap_layer_global[i].layer.setMap(map);
							}
						}
						global_fleet_layer_id = [];
						globale_layer_names = [];
						global_fleet_layer_features = [];
						global_fleet_layer_objects = [];
						//tmpl_setMap_layer_global = [];
						//mapLocation(map,appConfigInfo.extent2,appConfigInfo.extent1,appConfigInfo.extent4,appConfigInfo.extent3);
						map.on('pointermove', function (e) {
							var pixel = map.getEventPixel(e.originalEvent);
							var hit = map.hasFeatureAtPixel(pixel);
							map.getViewport().style.cursor = hit ? 'pointer' : '';
						});
						if (callBackFun)
							callBackFun(map);
						if (appConfigInfo.mapDataService == 'pentab') {
							try {
								tmpl.Map.getToken({
									callbackFun: function token(a) {
										console.log("Token::", a.access_token);
										appConfigInfo.bToken = "Bearer " + a.access_token;
									}
								});
							} catch (e) { console.log("PentaB Token Issue:", e); }
						}

						return map;
					}
					else if (appConfigInfo.mapData === "hereMaps") {
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
								// url: "https://1.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.night/{z}/{x}/{y}/256/png8?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode,
								// attribution: new ol.Attribution({
								// html: '&copy; 2013 Nokia...'
								// })
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
				else {
					var map;
					var esri;
					//var mapbox;
					var bing;

					Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;

					var mapbox = new Cesium.MapboxImageryProvider({
						mapId: 'mapbox.streets',
						accessToken: appConfigInfo.mapboxAccessToken
					});
					//----For Mapbox Map----//	
					/*if(appConfigInfo.mode == 'darkGray'){
						var mapboxdark = new Cesium.MapboxImageryProvider({
							mapId: 'mapbox.dark-v10',
							accessToken: appConfigInfo.mapboxAccessToken
						});
						mapbox = mapboxdark;
					}
					else if(appConfigInfo.mode == 'light'){
						var mapboxLight = new Cesium.MapboxImageryProvider({
							mapId: 'mapbox.light-v10',
							accessToken: appConfigInfo.mapboxAccessToken
						});
						mapbox = mapboxLight;
					}
					else if(appConfigInfo.mode == 'normal'){
						var mapboxNormal = new Cesium.MapboxImageryProvider({
							mapId: 'mapbox.streets',
							accessToken: appConfigInfo.mapboxAccessToken
						});
						mapbox = mapboxLight;
					}
					else{
						var mapboxDefault = new Cesium.MapboxImageryProvider({
							mapId: 'mapbox.streets',
							accessToken: appConfigInfo.mapboxAccessToken
						});
						mapbox = mapboxDefault;
					}*/

					//----For Mapbox Map----//

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
						//	terrainProvider: worldTerrain, //Cesium.createWorldTerrain(),
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

					$(".cesium-widget-credits").hide();

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



	function removeTripInfoTable() {							//Function added on 14-10-2019 by Prashanth to remove Trip infobox on vehicle reaching last point
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
	function mapdivChangeAction(mapObject) {					//sanjith
		var mapDivId = mapObject.getTarget();
		if (mapObject.getTarget().id != undefined) {			//this condition for angular
			mapDivId = mapObject.getTarget().id;
		}
		var tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
		document.getElementById(mapDivId).style.height = (parseInt(tempVar[0]) - 1) + tempVar[1];
		setTimeout(function () {
			tempVar = (document.getElementById(mapDivId).style.height).replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
			document.getElementById(mapDivId).style.height = (parseInt(tempVar[0]) + 1) + tempVar[1];
		}, 200);
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

	// **** Toggle handler for Street and Satellite view of Google map**** //
	function toggleGoogleMap(val, mapobj) {
		var layers = mapobj.getLayers();
		mapobj.removeLayer(layers.item(0));
		var layerToggle;
		if (val === 'satellite') {
			layerToggle = new olgm.layer.Google({
				mapTypeId: google.maps.MapTypeId.HYBRID
			});
		}
		else {
			layerToggle = new olgm.layer.Google({
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		}
		layers.insertAt(0, layerToggle);
		mapdivChangeAction(mapobj);							//sanjith
	}

	tmpl.Map.getGoogleMapStyles = function () {
		var googleStyles = [];
		Object.keys(mapStylesBundle).forEach(function (key) {
			googleStyles.push({
				"value": key,
				"name": mapStylesBundle[key].name
			});
		})
		return googleStyles;
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

		baseMapLayerObjects[0] = osmLayer;
		baseMapLayerObjects[1] = esriLayer;
		baseMapLayerObjects[2] = stamen1;
		baseMapLayerObjects[3] = stamen2;

		var basemaps = [
			{ name: 'Google Road Map', id: 2 }
			, { name: 'Google Styled Map', id: 7 } //google styled mode
			, { name: 'Google Satellite Map', id: 3 }
			, { name: 'Open Street Map', id: 1 }
			, { name: 'ESRI Map', id: 4 }
			//,{ name : 'SGL Map', id: 5 }
		];

		if (appConfigInfo.sglMapRequired == true) {
			basemaps.push({ name: 'SGL Map', id: 5 });
		}
		return basemaps;
	}


	sglBaseLayer = new ol.layer.Tile({
		source: new ol.source.TileWMS(({
			projection: 'EPSG:4326',
			url: appConfigInfo.sgl_url,
			params: { 'LAYERS': appConfigInfo.sglBaseMapLayer, 'TILED': true },
			serverType: 'mapserver'
		}))
	})

	tmpl.Map.switchBaseMaps = function (param) {
		var mapobj = param.map;
		var id = param.id;
		var layers = mapobj.getLayers();
		mapobj.removeLayer(layers.item(0));
		if (id == 1) {
			console.log("from api - openstreet map");
			console.log("from api - Google Map", window.gMapObj);
			layers.insertAt(0, baseMapLayerObjects[0]);
		}
		else if (id == 2) {
			var googleMapLayer;

			if (window.gMapObj2) {
				googleMapLayer = window.gMapObj2;
				layers.insertAt(0, googleMapLayer);
				console.log("Map Created from Existing Map Object");
			}
			else {
				googleMapLayer = new olgm.layer.Google({
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});
				layers.insertAt(0, googleMapLayer);
				window.gMapObj2 = googleMapLayer;
				console.log("Map Created using New Map Object");
			}
		}
		else if (id == 3) {
			var googleSatelliteLayer;

			if (window.gMapObj3) {
				googleSatelliteLayer = window.gMapObj3;
				layers.insertAt(0, googleSatelliteLayer);
				console.log("Map Created from Existing Map Object");
			}
			else {

				googleSatelliteLayer = new olgm.layer.Google({
					mapTypeId: google.maps.MapTypeId.HYBRID
				});
				layers.insertAt(0, googleSatelliteLayer);
				window.gMapObj3 = googleSatelliteLayer;
				console.log("Map Created using New Map Object");

			}
		}
		else if (id == 4) {

			console.log("from api - esrimap");
			layers.insertAt(0, baseMapLayerObjects[1]);

		}
		else if (id == 5) {

			console.log("from api - SGL MAP");
			layers.insertAt(0, sglBaseLayer);

		}
		else if (id == 7) {

			var applyLayer;
			if (window.gMapObj7) {
				applyLayer = window.gMapObj7;
				layers.insertAt(0, googleLayer);
				console.log("Map Created from Existing Map Object");
			}
			else {
				if (appConfigInfo.mode == 'night' || appConfigInfo.mode == 'normal' || appConfigInfo.mode == '') {
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
				layers.insertAt(0, applyLayer);
			}
		}
		mapdivChangeAction(mapobj);							//sanjith
	}

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
					//alert("You are beyond the Project Area,redirecting to previous zoomed center");
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
			if (e.dragging) return;
			var pixel = mapObj.getEventPixel(e.originalEvent);
			var hit = mapObj.hasFeatureAtPixel(pixel);
			mapObj.getTargetElement().style.cursor = hit ? 'pointer' : '';
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
				console.log("click",coordinate);
				var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
					layerObj = layer;
					console.log("feature,layer ????",feature,layer);
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
					else if (appConfigInfo.mapData == 'pentab') {
						//console.log(geometry);
						//alert();
						coord = evt.coordinate;
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

						else {
							var coordinate = evt.coordinate;
							coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
							console.log("geocode coordinate -> ", coordinate);
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

								tmpl.Info.getPlace.CallbackFunc(result);
							});

						}
					}
					else if (appConfigInfo.mapData == 'pentab') {


						console.log("evt.coordinate:", evt.coordinate);
						var coordinate = evt.coordinate;
						//coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
						var x = parseFloat(coordinate[0]);
						var y = parseFloat(coordinate[1]);
						var coordinates = { lat: y, lng: x };
						var result = {};


						function handleLandMarks(data) {
							console.log("data::", data);
							result = {
								place: [data[0].name],
								latitude: y,
								longitude: x,
								type: data[0].poi_type
							};
							tmpl.Info.getPlace.CallbackFunc(result);

						}

						tmpl.Search.getLandMarks({
							map: mapObj,
							point: [x, y],
							radius: 20000,
							POI_type: "all",
							Max_num_POIs: 1,
							callbackFunc: handleLandMarks
						});

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
									place: [data[0].name],
									latitude: y,
									longitude: x,
									type: data[0].type
								};
								//console.log("result >>",result);
								tmpl.Info.getPlace.CallbackFunc(result);
							}
							// tmpl.Search.getNearestPlace({
							// map : map,
							// point : [x,y],
							// callbackFunc : handleLandMarks
							// });
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
			}
		});
	}



	// **** Map Resize **** //

	tmpl.Map.resize = function (param) {
		var mapObj = param.map;
		if (mapObj) {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData === 'google' || 'hereMaps') {
					mapObj.updateSize();
					var layers = mapObj.getLayers();
					var googleLayer = layers.item(0);
					mapObj.removeLayer(googleLayer);
					try {
						layers.insertAt(0, googleLayer);
					} catch (e) { }

				}
				else {
					mapObj.updateSize();
				}
			}
			else {
				mapObj.updateSize();
			}

		}
	}


	tmpl.Map.centerPoint = function (param) {
		var mapObj = param.map;
		var centerPoint;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData === 'hereMaps') {
					centerPoint = ol.proj.transform(mapObj.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
				} else {
					centerPoint = mapObj.getView().getCenter();
				}
			}
			else {
				var ellipsoid = mapObj.scene.globe.ellipsoid;
				var carto = mapObj.camera.positionCartographic;
				var lon = Cesium.Math.toDegrees(carto.longitude);
				var lat = Cesium.Math.toDegrees(carto.latitude);
				centerPoint = [lon, lat];
			}
			return centerPoint;
		}
		catch (err) {
			console.error("ERROR Map.centerPoint: ", err);
		}
	}


	tmpl.Map.generateWKT = function (param) {
		var mapObj = param.map;
		var coord = param.point;
		var radiusValue = param.radius;
		var wktBufferGeom;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var wgs84Sphere = new ol.Sphere(6378137);
				var format = new ol.format.WKT();
				if (appConfigInfo.mapData == 'google' || 'hereMaps') {
					circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [coord[0], coord[1]], radiusValue, 64);
					circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
					circleFeature = new ol.Feature(circle3857);
					cirGeomtry = circleFeature.getGeometry();
					cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
					wktBufferGeom = format.writeGeometry(cirGeomtry4326);
				} else {
					circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [coord[0], coord[1]], radiusValue, 64);
					circle3857 = circle4326;
					circleFeature = new ol.Feature(circle3857);
					cirGeomtry = circleFeature.getGeometry();
					cirGeomtry4326 = cirGeomtry;
					wktBufferGeom = format.writeGeometry(cirGeomtry4326);
				}
			}
			else {
				var point = turf.point(coord);
				radiusValueinMeters = parseInt(radiusValue);
				// radiusValueinMeters = radiusValueinMeters + 50;
				var rad = radiusValueinMeters / 1000;
				// var buffered = turf.buffer(point, rad, {units: 'kilometers'});
				var buffered = turf.circle(point, rad, { units: 'kilometers' });
				console.log("BUFFER==========>", buffered);

				var buffGeom = [];
				for (var i = 0; i < buffered.geometry.coordinates[0].length; i++) {
					buffGeom = buffGeom.concat(buffered.geometry.coordinates[0][i]);
				}

				var wktBufferGeom = "POLYGON((";
				for (var j = 0; j < buffered.geometry.coordinates[0].length; j++) {
					if (j == buffered.geometry.coordinates[0].length - 1)
						wktBufferGeom += buffered.geometry.coordinates[0][j][0] + ' ' + buffered.geometry.coordinates[0][j][1];
					else
						wktBufferGeom += buffered.geometry.coordinates[0][j][0] + ' ' + buffered.geometry.coordinates[0][j][1] + ',';
				}
				wktBufferGeom += "))";
			}
			return wktBufferGeom;
		}
		catch (err) {
			console.error("ERROR Map.generateWKT: ", err);
		}

	}

	tmpl.Map.remove = function (param) {
		var mapObj = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
			else {
				try {

					mapObj.entities.removeAll();
					mapObj.destroy();

				} catch (e) { console.log("3D Map Remove Error..!", e); }

			}
		}
		catch (err) {
			console.error("ERROR Map.remove: ", err);
		}
	}

	tmpl.Layer.remove = function (param) {
		var mapObj = param.map;
		var layer = param.layer;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var existing;
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('title') === layer) {
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
			else {
				var entity = mapObj.entities._entities;
				// for(var i=0; i < map.entities._entities._array.length; i++){
				for (var i = mapObj.entities._entities._array.length - 1; i >= 0; i--) {
					if (entity._array[i]._name == layer) {
						var ent = entity._array[i];
						mapObj.entities.remove(ent);
					}
				}

				var length = mapObj.dataSources.length;
				var j = 0;
				while (j < length) {
					if (mapObj.dataSources.get(j).name == layer) {
						mapObj.dataSources.remove(mapObj.dataSources.get(j));
					}
					else { }
					j++;
				}
			}
		}
		catch (err) {
			console.error("ERROR Layer.remove: ", err);
		}
	}

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
			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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

	tmpl.HeatMap.createWithCustomColor = function(param){
		var mapObj = param.map;
		var getdata = param.data;
		var layer = param.layer;
		var blur = param.blur;
		if(blur == undefined)
		blur = 10;
		var radius = param.radius;
		var colorVal = param.color;
		var heatColor;
		if(colorVal == undefined){
			heatColor = '#E720B3'
		}
		else{
			heatColor = colorVal;
		}
		if(radius == undefined)
		radius = 20;
		var weight;	
		var featureDataAry = [];
		var geometry;
		for (var i = 0, length = getdata.length; i < length; i++){
			if(appConfigInfo.mapData==='google'){
				geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
			}
			else{
				var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
				geometry = new ol.geom.Point(coordinate);
			}
			var featureval = new ol.Feature({
				geometry     : geometry
				
			});
			if(getdata[i].weight){
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
			title :layer,
			blur: blur,
			radius: radius,
			opacity: .5,
			// gradient: ['#E720B3', '#E720B3', '#E720B3', '#E720B3', '#E720B3']
			gradient: [heatColor, heatColor, heatColor, heatColor, heatColor]
		});
		//mapObj.addLayer(vector_heat);	  
	
	tmpl_setMap_layer_global.push({
					layer : vector_heat,
					title :  layer,
					visibility : true,
					map : mapObj
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
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' || appConfigInfo.mapData == 'pentab') {
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
			undefinedHTML: '',
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

		try {
			var drawButton = document.createElement('button');
			drawButton.title = 'Draw Points';
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
		}
		catch (err) {
			console.error("ERROR Draw.point: ", err);
		}
	}

	tmpl.Draw.CustomPoint = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var img_url = param.img_url;

		try {
			var drawButton = document.createElement('button');
			drawButton.title = 'Draw Points';
			drawButton.className = 'ol-map-pointbtn';

			if (appConfigInfo.mapDimension == "2D") {
				drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, img_url: img_url, callbackFunc: callbackFunc }) });
				mapObj.addControl(new ol.control.Control({
					element: drawButton
				}));
			}
			else {
				drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Point', map: mapObj, img_url: img_url, callbackFunc: callbackFunc }) });
				document.body.appendChild(drawButton);
			}
		}
		catch (err) {
			console.error("ERROR Draw.CustomPoint: ", err);
		}
	}

	// **** For lines **** //

	tmpl.Draw.line = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;

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
	}

	// **** For polygond **** //

	tmpl.Draw.polygon = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;

		try {
			var drawButton = document.createElement('button');
			drawButton.title = 'Draw Polygons';
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
		}
		catch (err) {
			console.error("ERROR Draw.polygon: ", err);
		}
	}

	// **** for Circle **** //

	tmpl.Draw.circle = function (param) {
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;

		try {
			var drawButton = document.createElement('button');
			drawButton.title = 'Draw Circle';
			drawButton.className = 'ol-map-Circlebtn';

			if (appConfigInfo.mapDimension == "2D") {
				drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'Circle', map: mapObj, callbackFunc: callbackFunc }) });
				var drawControl = new ol.control.Control({
					element: drawButton
				});
				mapObj.addControl(drawControl);
			}
			else {

			}
		}
		catch (err) {
			console.error("ERROR Draw.circle: ", err);
		}
	}

	// **** Common draw tool used to draw features without setting buttons on the map ****//

	tmpl.Draw.draw = function (param) {
		var features = new ol.Collection();
		var callbackFunc = param.callbackFunc;
		var mapObj = param.map;
		var btnType = param.type;
		var img_url = param.img_url;
		var drawRestriction = param.drawRestriction;

		try {
			var img_path;
			if (img_url == undefined) {
				img_path = 'api_img/icon.png';
			} else {
				img_path = img_url;
			}
			if (appConfigInfo.mapDimension == "2D") {

				console.log("img_path: ", img_path);
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
			else {
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
					drawingMode = 'polygon';
					function drawShape(positionData) {
						// console.log("positionData from func: ",positionData);
						tmpl.Layer.remove({ map: mapObj, layer: "Draw Point" });						// For removing previously drawn Polygon
						var shape;
						if (drawingMode === 'polygon') {
							mapObj.entities.remove(mapObj.entities.getById("Measurement"));
							shape = mapObj.entities.add({
								name: "Draw Tool",
								polygon: {
									hierarchy: positionData,
									material: new Cesium.ColorMaterialProperty(Cesium.Color.VIOLET.withAlpha(0.5))
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
								activeShape = drawShape(dynamicPositions);
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

						var wktGeom = "POLYGON(";
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
		}
		catch (err) {
			console.error("ERROR Draw.draw: ", err);
		}
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
				else if (appConfigInfo.mapData == 'pentab') {
					console.log("lonlat:", lonlat);
					coord = ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:4326');
					wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:4326', 'EPSG:4326'));
					console.log("wktGeom:", wktGeom);
					//coord = lonlat;//feature.getGeometry().getCoordinates();
					//wktGeom= format.writeGeometry(feature.getGeometry());
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

	tmpl.Draw.getRadius = function (param) {
		var wkt = param.wkt;
		var center = param.center;
		var latlon = param.latlon;
		var callBacFun = param.callback;
		try {
			var from = turf.point(center);
			var to = turf.point(latlon);
			var options = { units: 'kilometers' };
			var distance = turf.distance(from, to, options);
			callBacFun(distance);
		} catch (e) { }
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
			}
			else {
				tmpl.Layer.remove({ map: mapObj, layer: "Draw Tool" });
			}
		}
		catch (err) {
			console.error("ERROR Draw.clear: ", err);
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

	/*
	tmpl.Draw.addEdit = function setEdit(param){
		var mapObj = param.map;
		var editButton = document.createElement('button');
		editButton.title ='Edit';
		editButton.className = 'ol-map-editbtn';
		editButton.addEventListener('click', function(){tmpl.Draw.edit({map:mapObj});});
		var editControl = new ol.control.Control({
			element: editButton
		});
		mapObj.addControl(editControl);
	}
	tmpl.Draw.edit = function(param){
		var mapObj = param.map;
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(drawm);
		modify1 = new ol.interaction.Modify({
			features: select.getFeatures()
		});
		mapObj.addInteraction(modify1);
		//mapObj.removeInteraction(select);
	}
	*/
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
							tmpl.Info.getPlace.CallbackFunc(coordinate);

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


		/*try {

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

		} catch (e) { console.log("Error in Legent..!", e); }*/


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

	tmpl.Map.print = function (param) {

		document.getElementById("MapPrint").style.display = "block";
		//var pageLayout = document.getElementById('layout').value;
		var map = param.map;
		var header1 = param.header1;
		var header2 = param.header2;
		var footer = param.footer1;
		var footer2 = param.footer2;
		var imgLogo = appConfigInfo.logo;
		var callbackFunc = param.callbackFunc;
		var legendDivId = param.legendDivId;

		var imgData;
		var html2obj = html2canvas(document.getElementById(legendDivId), {
			onrendered: function (canvas) {
				imgData = canvas.toDataURL('image/png');
			}
		});
		var queueImg = html2obj.parse();
		var canvasImg = html2obj.render(queueImg);
		var legendImg = canvasImg.toDataURL('image/jpeg');

		console.log("map~~~~~~~~~~~~~~~~~~~~~", map);
		console.log("header1~~~~~~~~~~~~~~~~~~~~~", header1);

		var dims = {
			a0: [1189, 841],
			a1: [841, 594],
			a2: [594, 420],
			a3: [420, 297],
			a4: [297, 210],
			a5: [210, 148]
		};
		var loading = 0;
		var loaded = 0;
		var exportButton = document.getElementById('export-pdf');
		exportButton.addEventListener('click', function () {
			var x = document.getElementById("download").value;
			console.log("selected download~~~~~~~~~~~", x);
			exportButton.disabled = true;
			document.body.style.cursor = 'progress';



			var format = document.getElementById('format').value;
			var pageLayout = document.getElementById('layout').value;
			var resolution = document.getElementById('resolution').value;
			var dim = dims[format];
			var width = Math.round(dim[0] * resolution / 25.4);
			var height = Math.round(dim[1] * resolution / 25.4);
			var size = /** @type {ol.Size} */ (map.getSize());
			var extent = map.getView().calculateExtent(size);

			var source = map.getLayers().item(0).getSource();

			var tileLoadStart = function () {
				map.renderSync();
				++loading;
				console.log("loading...", loading);
			};

			var textLn, textLnS, legendWidth, l1, b1, b2, borderSpaceFromLeft, borderSpaceFromRight, asize, legbgHeight, legbgWidth, legendHeight, setSubFontSize, imagePos, setFontSize, imageHeight, imageWidth, headerSize, imagegg, borderSpace, fsize, x1, y1, x2, y2;

			var tileLoadEnd = function () {
				map.renderSync();
				++loaded;
				if (loading === loaded) {

					//var canvas = this;
					var canvas = $('canvas').get(0);
					window.setTimeout(function () {
						loading = 0;
						loaded = 0;
						//var title = document.getElementById('title').value;
						//var subtitle = document.getElementById('subtitle').value;
						var data = canvas.toDataURL('image/png');
						//var pdf = new jsPDF('landscape', undefined, format);
						var pdf = new jsPDF(pageLayout.toString(), undefined, format);

						if (dim[0] == 297 && dim[1] == 210) { //a4
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 50;
								textLnS = 50;
								setFontSize = 15;
								setSubFontSize = 12;
								imageWidth = 22;
								imageHeight = 22;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 30;
								w1 = 2;
								w2 = 2;
								w3 = 293;
								w4 = 205;
								borderSpaceFromLeft = 2;
								borderSpaceFromRight = 295;
								p1 = 35;
								p2 = 2;
								s1 = 35;
								s2 = 30;
								bsize = 170;
								fsize = 200;
								setFFontSize = 10;
								x1 = 150;
								x2 = 207;
								y1 = 150;
								y2 = 170;
								a1 = 180;
								a2 = 190;
								a3 = 195;
								a4 = 200;
								a5 = 205;
								legendWidth = 90;
								legendHeight = 35;
								imagePos = 170;
								bgHeight = 1000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 100;
								b1 = 20;
								b2 = 25;
								legText = 170;
							} else {
								l1 = 5;
								textLn = 70;
								textLnS = 70;
								setFontSize = 15;
								setSubFontSize = 12;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 40;
								borderSpaceFromLeft = 2;
								borderSpaceFromRight = 207;
								w1 = 2;
								w2 = 2;
								w3 = 205;
								w4 = 290;
								p1 = 40;
								p2 = 2;
								s1 = 40;
								s2 = 40;
								bsize = 242;
								fsize = 120;
								setFFontSize = 10;
								x1 = 110;
								x2 = 243;
								y1 = 110;
								y2 = 292;
								a1 = 255;
								a2 = 265;
								a3 = 270;
								a4 = 275;
								a5 = 280;
								legendWidth = 90;
								legendHeight = 45;
								imagePos = 245;
								bgHeight = 5000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 110;
								b1 = 25;
								b2 = 30;
								legText = 242;
							}

						} else if (dim[0] == 1189 && dim[1] == 841) { //a0
							if (pageLayout == 'landscape') {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 50;
								setSubFontSize = 46;
								imageWidth = 40;
								imageHeight = 40;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								asize = 60; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 1185; //border line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 1180; // border rectangle width 
								w4 = 830; // border rectangle height
								p1 = 60;
								p2 = 2;
								s1 = 60;
								s2 = 60;
								bsize = 700;
								fsize = 800;
								setFFontSize = 30;
								x1 = 700; // position from left of legend split line
								x2 = 700; // position from top of legend split line
								y1 = 700; // position from left of legend split line
								y2 = 835; //height of legend split line
								a1 = 720;
								a2 = 760;
								a3 = 780;
								a4 = 800;
								a5 = 820;
								legendWidth = 450;
								legendHeight = 120;
								imagePos = 700;
								bgHeight = 10000;
								bgWidth = 60;
								legbgHeight = 10000;
								legbgWidth = 200;
								b1 = 25;
								b2 = 40;
								legText = 700;
							} else {
								l1 = 10;
								textLn = 300;
								textLnS = 300;
								setFontSize = 80;
								setSubFontSize = 50;
								imageWidth = 150;
								imageHeight = 150;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								asize = 200; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 835;
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 830; // border rectangle width 
								w4 = 1170; // border rectangle height
								p1 = 200;
								p2 = 3;
								s1 = 200;
								s2 = 200;
								bsize = 1000;
								fsize = 600;
								setFFontSize = 30;
								x1 = 590; //legent division width position 
								x2 = 1000;
								y1 = 590; //legent division width position 
								y2 = 1175; // legent division border height
								a1 = 1020;
								a2 = 1080;
								a3 = 1090;
								a4 = 1200;
								a5 = 1110;
								legendWidth = 450;
								legendHeight = 140;
								imagePos = 1010;
								bgHeight = 10000;
								bgWidth = 60;
								legbgHeight = 10000;
								legbgWidth = 200;
								b1 = 100;
								b2 = 120;
								legText = 1000;
							}
						} else if (dim[0] == 420 && dim[1] == 297) { //a3
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 75;
								textLnS = 75;
								setFontSize = 20;
								setSubFontSize = 18;
								imageWidth = 20;
								imageHeight = 20;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								bsize = 245;
								fsize = 210;
								setFFontSize = 10;
								asize = 30; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 417; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 413; // border rectangle width 
								w4 = 290; // border rectangle height
								p1 = 30;
								p2 = 4;
								s1 = 30;
								s2 = 30;
								x1 = 200; // position from left of legend split line
								x2 = 245; // position from top of legend split line
								y1 = 200; // position from left of legend split line
								y2 = 294; //height of legend split line
								a1 = 250;
								a2 = 270;
								a3 = 275;
								a4 = 280;
								a5 = 285;
								legendWidth = 120; //110
								legendHeight = 50;
								imagePos = 245;
								bgHeight = 10000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 15;
								b2 = 23;
								legText = 245;
							} else {
								l1 = 10;
								textLn = 75;
								textLnS = 75;
								setFontSize = 20;
								setSubFontSize = 18;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 50; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 294;
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 290; // border rectangle width 
								w4 = 412; // border rectangle height
								p1 = 50;
								p2 = 3;
								s1 = 50;
								s2 = 50;
								bsize = 347;
								fsize = 160;
								setFFontSize = 10;
								x1 = 150;
								x2 = 347;
								y1 = 150;
								y2 = 415;
								a1 = 360;
								a2 = 380;
								a3 = 385;
								a4 = 390;
								a5 = 395;
								legendWidth = 115; //110
								legendHeight = 45;
								imagePos = 355;
								bgHeight = 10000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 25;
								b2 = 35;
								legText = 900;
							}

						} else if (dim[0] == 841 && dim[1] == 594) { //a1
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 100;
								textLnS = 100;
								setFontSize = 40;
								setSubFontSize = 30;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 450;
								fsize = 500;
								setFFontSize = 30;
								asize = 40; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 836; //border line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 833; // border rectangle width 
								w4 = 585; // border rectangle height
								p1 = 40;
								p2 = 4;
								s1 = 40;
								s2 = 40;
								x1 = 450; // position from left of legend split line
								x2 = 450; // position from top of legend split line
								y1 = 450; // position from left of legend split line
								y2 = 590; //height of legend split line
								a1 = 470;
								a2 = 500;
								a3 = 515;
								a4 = 530;
								a5 = 545;
								legendWidth = 300;
								legendHeight = 140;
								imagePos = 450;
								bgHeight = 10000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 15;
								b2 = 30;
								legText = 450;
							} else {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 40;
								setSubFontSize = 30;
								imageWidth = 60;
								imageHeight = 60;
								headerSize = 70;
								imagegg = 85;
								borderSpace = 270;
								bsize = 650;
								asize = 80; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 590; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 585; // border rectangle width 
								w4 = 830; // border rectangle height
								p1 = 80;
								p2 = 4;
								s1 = 80;
								s2 = 80;
								fsize = 350;
								setFFontSize = 30;
								x1 = 320;
								x2 = 650;
								y1 = 320;
								y2 = 830;
								a1 = 690;
								a2 = 730;
								a3 = 745;
								a4 = 760;
								a5 = 775;
								legendWidth = 300;
								legendHeight = 140;
								imagePos = 680;
								bgHeight = 10;
								bgWidth = 10;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 30;
								b2 = 50;
								legText = 650;
							}

						} else {
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 100;
								textLnS = 100;
								setFontSize = 30;
								setSubFontSize = 20;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 320;
								fsize = 350;
								setFFontSize = 15;
								asize = 40; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 590; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 585; // border rectangle width 
								w4 = 410; // border rectangle height
								p1 = 40;
								p2 = 3;
								s1 = 40;
								s2 = 40;
								x1 = 300; // position from left of legend split line
								x2 = 320; // position from top of legend split line
								y1 = 300; // position from left of legend split line
								y2 = 415; //height of legend split line
								a1 = 330;
								a2 = 370;
								a3 = 380;
								a4 = 390;
								a5 = 400;
								legendWidth = 250;
								legendHeight = 90;
								imagePos = 320;
								bgHeight = 10000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 20;
								b2 = 30;
								legText = 320;
							} else {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 30;
								setSubFontSize = 20;
								imageWidth = 60;
								imageHeight = 60;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 500;
								fsize = 220;
								setFFontSize = 15;
								asize = 80; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 415; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 410; // border rectangle width 
								w4 = 580; // border rectangle height
								p1 = 80;
								p2 = 3;
								s1 = 80;
								s2 = 80;
								x1 = 210;
								x2 = 500;
								y1 = 210;
								y2 = 585;
								a1 = 510;
								a2 = 540;
								a3 = 550;
								a4 = 560;
								a5 = 570;
								legendWidth = 180;
								legendHeight = 60;
								imagePos = 510;
								bgHeight = 0;
								bgWidth = 0;
								legbgHeight = 100;
								legbgWidth = 0;
								b1 = 30;
								b2 = 45;
								legText = 1000;
							}

						}
						var today = new Date();
						var dd = String(today.getDate()).padStart(2, '0');
						var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
						var yyyy = today.getFullYear();
						var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						var tTime = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
						today = mm + '_' + dd + '_' + yyyy;
						var tDayDate = mm + '/' + dd + '/' + yyyy;
						var unit = map.getView().getProjection().getUnits();
						var resolution = map.getView().getResolution();
						var DOTS_PER_INCH = 72;
						var scale = ol.proj.METERS_PER_UNIT[unit] * DOTS_PER_INCH * resolution;
						console.log(scale + " : " + unit);
						scale = Math.round(scale) * 100;

						console.log(scale + " : " + unit);

						if (pageLayout == 'portrait') {
							const pageWidth = dim[0]; //pdf.internal.pageSize.getWidth();
							const pageHeight = dim[1]; //pdf.internal.pageSize.getHeight();


							const widthRatio = pageWidth / canvas.width;
							const heightRatio = pageHeight / canvas.height;
							const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

							const canvasWidth = canvas.width * ratio;
							const canvasHeight = canvas.height * ratio;

							const marginX = (pageWidth - canvasWidth) / 2;
							const marginY = (pageHeight - canvasHeight) / 2;
							console.log("AX<AY", marginX, marginY);
							console.log("AX<AY", canvasWidth, canvasHeight);
							//pdf.addImage(data, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
							pdf.addImage(data, 'JPEG', marginX, asize, canvasWidth, canvasHeight);
							//pdf.output('dataurlnewwindow');
						} else {
							pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
						}

						//pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
						// pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, 0, bgHeight, bgWidth); // for background white in Landscape mode
						// pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, legText, legbgHeight, legbgWidth); // for background white in Landscape mode
						// pdf.addImage(appConfigInfo.maplegent, 'PNG', 10, imagePos, legendWidth, legendHeight);
						if (dim[0] == 297 && dim[1] == 210) { //a4
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 270, 40, 20, 20);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 180, 50, 20, 20);
							}

						} else if (dim[0] == 1189 && dim[1] == 841) { //a0
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 1100, 80, 40, 40);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 750, 250, 40, 40);
							}

						} else if (dim[0] == 420 && dim[1] == 297) { //a3
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 390, 40, 20, 20);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 270, 70, 20, 20);
							}

						} else if (dim[0] == 841 && dim[1] == 594) { //a1	
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 800, 50, 30, 30);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 550, 90, 30, 30);
							}

						} else if (dim[0] == 594 && dim[1] == 420) { //a2
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 550, 50, 30, 30);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 390, 90, 20, 20);
							}

						} else {
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 250, 50, 10, 10);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 180, 50, 10, 10);
							}

						}
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, 0, p2, 1000);
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', borderSpaceFromRight, 0, 10, 1000);
						pdf.rect(2, 2, 205, 290);
						pdf.rect(w1, w2, w3, w4);
						//pdf.setLineWidth(0.1);
						//pdf.setDrawColor(0, 0, 0);
						//pdf.line(borderSpaceFromLeft, asize, borderSpaceFromRight, asize);
						//pdf.line(p1, p2, s1, s2);
						// pdf.line(borderSpaceFromLeft, bsize, borderSpaceFromRight, bsize);
						//pdf.line(x1, x2, y1, y2);
						pdf.setFontSize(setFFontSize);
						pdf.setFontType("normal");
						//pdf.text(fsize, a1, 'For Office Use:');
						//pdf.text(fsize, a2, 'Scale:  1:' + scale);
						//pdf.text(fsize, a3, 'Projection :  ESPG:4326');
						//pdf.text(fsize, a4, 'Date:' + tDayDate);
						//pdf.text(fsize, a5, '© DNP/DSCDL');
						pdf.setFontSize(20);
						pdf.setFontType("bold");
						pdf.text(textLn, 25, header1);
						pdf.text(textLn, b1, header1);
						pdf.setFontSize(setSubFontSize);
						pdf.text(textLnS, 30, header2);//35
						// pdf.text(textLnS, b2, header2); //35
						//pdf.addImage(appConfigInfo.logo, 'JPEG', l1, l1, imageHeight, imageWidth);
						pdf.addImage(legendImg, 'PNG', 190, 170, 15, 50);
						pdf.text(footer, 15, 270, { baseline: 'bottom' });
						pdf.text(footer2, 15, 275, { baseline: 'bottom' });
						pdf.addImage(imgLogo, 'PNG', 188, 285, 15, 10);
						if (x == 'jpeg') {
							$("#loadingDiv").css("display", "block");
							var aa = pdf.output('arraybuffer');
							console.log("sssssssssssss", aa.data);
							var bytes = new Uint8Array(pdf.output('arraybuffer'));
							console.log("sssssssssssss", bytes);
							var b = encode(bytes);
							console.log("sssssssssssss", encode(bytes));
							var pdfData = atob(b);
							setTimeout(function () {
								try {
									tmpl.Map.resize({
										map: map
									});
								} catch (e) {
									console.log("Map Resize Error!", e);
								}
								pdfjsLib.GlobalWorkerOptions.workerSrc = appConfigInfo.mapSDKURL + 'pdf_Worker.js';
								pdfjsLib.getDocument({
									data: pdfData
								}).then(function getPdfHelloWorld(pdf) {
									pdf.getPage(1).then(function getPageHelloWorld(page) {
										var scale = 1.5;
										var viewport = page.getViewport(scale);
										var canvasa = document.createElement('canvas');
										canvasa.id = "the-canvas";
										var context = canvasa.getContext('2d');
										canvasa.height = viewport.height;
										canvasa.width = viewport.width;
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
										setTimeout(function () {
											canvasa.toBlob(function (blob) {

												console.log(blob);
												saveAs(blob, 'EWDS_' + today + '_' + time + 'map.jpeg');
												$("#loadingDiv").css("display", "none");
												document.getElementById("customSelect").reset();
											});
										}, 1500);

									});
								});

							}, 1000);
						} else if (x == 'png') {
							$("#loadingDiv").css("display", "block");
							var aa = pdf.output('arraybuffer');
							console.log("sssssssssssss", aa.data);
							var bytes = new Uint8Array(pdf.output('arraybuffer'));
							console.log("sssssssssssss", bytes);
							var b = encode(bytes);
							console.log("sssssssssssss", encode(bytes));
							var pdfData = atob(b);
							setTimeout(function () {
								try {
									tmpl.Map.resize({
										map: map
									});
								} catch (e) {
									console.log("Map Resize Error!", e);
								}
								pdfjsLib.GlobalWorkerOptions.workerSrc = appConfigInfo.mapSDKURL + 'pdf_Worker.js';
								pdfjsLib.getDocument({
									data: pdfData
								}).then(function getPdfHelloWorld(pdf) {
									pdf.getPage(1).then(function getPageHelloWorld(page) {
										var scale = 1.5;
										var viewport = page.getViewport(scale);
										var canvasa = document.createElement('canvas');
										canvasa.id = "the-canvas";
										var context = canvasa.getContext('2d');
										canvasa.height = viewport.height;
										canvasa.width = viewport.width;
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
										setTimeout(function () {
											canvasa.toBlob(function (blob) {

												console.log(blob);
												saveAs(blob, 'EWDS_' + today + '_' + time + 'map.png');
												$("#loadingDiv").css("display", "none");
												document.getElementById("customSelect").reset();
											});
										}, 1500);

									});
								});
							}, 1000);
						} else {
							$("#loadingDiv").css("display", "block");
							var list = [
								{
									"No": "1", "BLOCK": "AMADALAVALASA", "DISTRICT": "Srikakulam",
									"24 Hours": "2.2", "08:30AM−14:30PM": "0.0", "14:30PM−20:30PM": "3.1", "20:30PM−02:30AM": "0.0", "02:30AM−08:30AM": "4.0"
								},
								{
									"No": "2", "BLOCK": "SALUR", "DISTRICT": "Vizianagaram",
									"24 Hours": "5.7", "08:30AM−14:30PM": "0.4", "14:30PM−20:30PM": "4.0", "20:30PM−02:30AM": "0.1", "02:30AM−08:30AM": "2.8"
								}
							];
							pdf.save('EWDS_' + today + '_' + time + 'map.pdf');
							$("#loadingDiv").css("display", "none");
							document.getElementById("customSelect").reset();
						}

						map.renderSync();
						source.un('tileloadstart', tileLoadStart);
						map.renderSync();
						source.un('tileloadend', tileLoadEnd, canvas);
						source.un('tileloaderror', tileLoadEnd, canvas);

						map.setSize(size);
						map.getView().fit(extent, size);
						map.renderSync();

						exportButton.disabled = false;

						document.body.style.cursor = 'auto';
						//callbackFunc('DSCDLMap_'+today+'_'+time+'map.pdf');
					}, 100);


				}
				// Tile Load End function

			};

			//map.once('postcompose', function(event) {
			map.once('postcompose', function (event) {

				event.context.imageSmoothingEnabled = false;
				event.context.webkitImageSmoothingEnabled = false;
				event.context.mozImageSmoothingEnabled = false;
				event.context.msImageSmoothingEnabled = false;
				map.renderSync();
				source.on('tileloadstart', tileLoadStart);
				map.renderSync();
				source.on('tileloadend', tileLoadEnd, event.context.canvas);
				source.on('tileloaderror', tileLoadEnd, event.context.canvas);
			});

			map.setSize([width, height]);
			map.getView().fit(extent, /** @type {ol.Size} */(map.getSize()));
			map.renderSync();
		}, false);



	}



	var BASE64_MARKER = ';base64,';

	function encode(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		while (i < input.length) {
			chr1 = input[i++];
			chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
			chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
				keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		return output;
	}

	function convertDataURIToBinary(dataURI) {
		console.log("sssssssssssssssssss", dataURI);
		var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
		console.log("sssssssssssssssssss", base64Index);
		var base64 = dataURI.substring(base64Index);
		console.log("sssssssssssssssssss bbbbbbbb", base64);

	}

	function createAndDownloadBlobFile(body, filename, extension = 'png') {
		const blob = new Blob([body]);
		const fileName = `${filename}.${extension}`;
		console.log("Blob", blob);
		console.log("filename", fileName);
	}

	tmpl.Feature.byId = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var callbackFunc = param.callbackFunc;
		console.log("Layer name from Feature.byid=========>", layrName);

		try {
			if (appConfigInfo.mapDimension == "2D") {
				//alert(12);
				var existing;
				var Layers = map.getLayers();
				var length = Layers.getLength();
				var fea;
				//console.log("layrName,id >>>",layrName,id);
				for (var i = 0; i < length; i++) {
					//alert(11);
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						//alert(4);
						//console.log("existingLayer.get('title') >>>",existingLayer.get('title'));
						if (existingLayer.get('title') === layrName) {
							//alert(3);
							existing = existingLayer;
							test1 = existingLayer;
							existingLayer.getSource().getFeatures().forEach(function (feature) {
								var len = feature.getProperties().features.length;
								for (var j = 0; j < len; j++) {
									//console.log("lfeature.getProperties().features[j].getId() >>>",feature.getProperties().features[j].getId());
									if (feature.getProperties().features[j].getId() == id) {
										//alert(2);
										fea = feature.getProperties().features[j];
										//console.log("fea  ????",fea);
										if (appConfigInfo.mapData == 'google' || 'hereMaps') {
											callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
											break;
										}
										else if (appConfigInfo.mapData == 'pentab') {
											//alert(1);
											callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
											break;
										}
										else {
											//alert(5);
											callbackFunc(fea.getGeometry().getCoordinates(), fea.getProperties());
											break;
										}
									}
								}

							});

						}
					}
				}
				if (existing == undefined) {
					//alert(9);
					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {

						//console.log("second11 >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
						if (tmpl_setMap_layer_global[i].title == layrName) {
							//alert(77);
							var layer = tmpl_setMap_layer_global[i].layer;
							//console.log(layer.getSource().getFeatures());
							var fea = layer.getSource().getFeatureById(id);
							if (appConfigInfo.mapData == 'google' || 'hereMaps') {
								//alert(7);
								callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
								break;
							}
							if (appConfigInfo.mapData == 'pentab') {
								//alert(6);
								callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
								break;
							}
							else {
								//alert(8);
								callbackFunc(fea.getGeometry().getCoordinates(), fea.getProperties());
								break;
							}
						}
						//console.log("second >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
					}
				}
			}
			else {
				if (id != undefined) {
					if (map.dataSources.length > 0) {
						/////////////////////// For Cluster Layer /////////////////////////	
						var clusterPointPos = [];
						var clusterLength = map.dataSources.length;
						for (var j = 0; j < clusterLength; j++) {
							if (map.dataSources.get(j).name == layrName) {
								var clusterEnt = map.dataSources.get(j).entities.getById(id);
								if (clusterEnt != undefined) {
									var clusterprop = clusterEnt.entProp;
									clusterPointPos.push(clusterprop.lon, clusterprop.lat);
									callbackFunc(clusterPointPos, clusterprop);
								}
								else {
									console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
								}
							}
							// else{
							// console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
							// }
						}
					}
					/////////////////////// For Entities Layer /////////////////////////
					else {
						var position = [];
						var ent = map.entities.getById(id);
						var prop = ent.entProp;
						position.push(prop.lon, prop.lat);
						var lyrName = ent.entProp.layer_name;

						if (lyrName == layrName) {
							callbackFunc(position, prop);
						}
						else {
							console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
						}
					}
				}
			}
		}
		catch (err) {
			console.error("ERROR Feature.byId: ", err);
		}
	}

	tmpl.Feature.updatebyId = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var properties = param.properties;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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

						//console.log("second11 >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
						if (tmpl_setMap_layer_global[i].title == layrName) {
							var layer = tmpl_setMap_layer_global[i].layer;
							var fea = layer.getSource().getFeatureById(id);
							fea.setProperties(properties);
							fea.setStyle(new ol.style.Style({
								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: properties.img_url


								}))
							}));
						}

					}
				}
			}
			else {
				if (id != undefined) {
					var position = [];
					var ent = map.entities.getById(id);
					ent.properties = properties;
					// var prop = ent.entProp;
					// console.log("prop1: ",prop);
					// prop = {};	
					// console.log("prop2: ",prop);				
					ent.billboard.image.setValue(properties.img_url);

					var j = 0;
					while (j < map.entities._entities.length) {
						if (map.entities._entities._array[j].id == id) {
							map.entities._entities._array[j].entProp = properties;
							break;
						}
						else {

						}
						j++;
					}

				}
			}
		}
		catch (err) {
			console.error("ERROR Feature.updatebyId: ", err);
		}
	}

	tmpl.Feature.clusterUpdatePropertiesLatLon = function (param) {
		var map = param.map;
		var layrName = param.layer;
		var id = param.id;
		var properties = param.properties;
		var point = param.point;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
										fea.setProperties(properties);
										if (appConfigInfo.mapData === 'google' || 'hereMaps') {
											fea.getGeometry().setCoordinates(ol.proj.transform([parseFloat(point[0]), parseFloat(point[1])], 'EPSG:4326', 'EPSG:3857'));
										}
										else {
											fea.getGeometry().setCoordinates([parseFloat(point[0]), parseFloat(point[1])]);
										}
										break;
									}
								}
							});
						}
					}
				}
			}
			else {
				var clusterLength = map.dataSources.length;
				if (clusterLength > 0) {
					var k = 0;
					while (k < clusterLength) {
						var clusterLayer = map.dataSources.get(k);
						if (clusterLayer.name == layrName) {
							var ent = map.dataSources.get(k).entities.getById(id);
							ent.entProp = {};
							ent.entProp = properties;
							ent.position = Cesium.Cartesian3.fromDegrees(point[0], point[1]);
							ent.billboard.image.setValue(properties.img_url);
						}
						k++;
					}
				}
			}
		}
		catch (err) {
			console.error("ERROR Feature.clusterUpdatePropertiesLatLon: ", err);
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
										color: 'rgba(0,255,0,0.3)'
									}),
									stroke: new ol.style.Stroke({
										color: 'rgba(0,255,0,0.3)',
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
										color: 'rgba(0,255,0,0.3)'
									}),
									stroke: new ol.style.Stroke({
										color: 'rgba(0,255,0,0.3)',
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
				lonlat = ft.getGeometry().getInteriorPoint().getCoordinates();
			}
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {

				wktGeom = format.writeGeometry(ft.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				//console.log(wktGeom);
				//console.log(ol.proj.transform([latlon[0],latlon[1]], 'EPSG:3857', 'EPSG:4326'));
			}
			else if (appConfigInfo.mapData == "pentab") {
				wktGeom = format.writeGeometry(ft.getGeometry().clone().transform('EPSG:4326', 'EPSG:4326'));
				coord = ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:4326');
			}
			else {

				wktGeom = format.writeGeometry(ft.getGeometry());
				coord = lonlat;//ft.getGeometry().getCoordinates();
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
					if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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

			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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
						if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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
		//console.log(trackLayer);
		var image_scale = param.icon_scale;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				//alert();
				var getdata = jsonobj;
				if (image_scale == undefined)
					image_scale = 1;
				if (getdata.length == 0) {
					return false;
				}
				if (trackLayer == false || trackLayer == undefined) {
					var featureDataAry = [];

					var length = null;
					length = getdata.length;
					var i = 0;
					while (i < length) {
						var geometry;
						var anagle;
						if (getdata[i].ot_track_angle != undefined) {
							anagle = getdata[i].ot_track_angle;
						}
						else {
							anagle = 0;
						}


						var iconStyle = new ol.style.Icon(({
							src: getdata[i].img_url,
							anchor: [0.5, 1],
							scale: image_scale,
							rotation: anagle
						}));
						// var iconStyle = new ol.style.Icon( ({
						// src: getdata[i].img_url,
						// anchor: [0.5, 1],
						// scale : image_scale
						// }));
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
						featureval.setId(getdata[i].id);
						featureval.setProperties(getdata[i]);

						if (getdata[i].label_color == undefined) {
							getdata[i].label_color = 'rgba(255,255,255,0)';
						}

						if (getdata[i].label_bgcolor == undefined) {
							getdata[i].label_bgcolor = 'rgba(255,255,255,0)';
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
						i++;
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
							// console.log(evt);
							var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
								//if(layer){
								// console.log(feature);
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
						tmpl_setMap_layer_global_array.push({
							layer: overlay,
							title: layerName,
							visibility: true,
							map: mapObj
						});
						console.log("CREATE>>>>", tmpl_setMap_layer_global_array);
						overlay.setMap(mapObj);
						mapObj.addLayer(overlay);
						//if(layerSwitcher)
						//mapObj.addControl(new ol.control.LayerSwitcher());
						OverlayisLayerPresent = true;
					}
				} else if (trackLayer == true) {
					//console.log("Track Layer");
					var featureDataAry = [];

					for (var i = 0, length = getdata.length; i < length; i++) {
						var geometry;
						//console.log(global_fleet_layer_id.indexOf('fleet_'+layerName+'_'+getdata[i].id));
						if (global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + getdata[i].id) == -1) {
							//console.log("coming insideeeeeeeeeee");

							var anagle;
							if (getdata[i].ot_track_angle != undefined)
								anagle = getdata[i].ot_track_angle;
							else
								anagle = 0;


							var iconStyle = new ol.style.Icon(({
								src: getdata[i].img_url,
								anchor: [0, 0],
								scale: image_scale,
								// rotation: anagle
							}));
							if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
								geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
							}
							else {

								//geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
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
							tmpl_setMap_layer_global_array.push({
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
			else {
				var height, width, visibility;
				if (height == undefined) {
					height = 32;
				}
				if (width == undefined) {
					width = 32;
				}

				if (visibility == undefined) {
					visibility = true;
				}

				if (visibility == undefined) {
					visibility = true;
				}

				var getData = jsonobj;
				var length = getData.length;

				// for (var key in getData) {
				// var item = getData[key];

				// for(var key2 in item){
				// }		
				// }

				if (length != undefined) {
					var i = 0;
					while (i < length) {
						var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';

						for (var key2 in getData[i]) {
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
									if (getData[i].upload_status) {
										description += '<tr><th>' + attr + '</th><td><a href=' + getData[i][key2] + '>Attachment</a></td></tr>';
									}
									else {
										description += '<tr><th>' + attr + '</th><td>No Attachment</td></tr>';
									}
									break;

								default: description += '<tr><th>' + attr + '</th><td>' + getData[i][key2] + '</td></tr>';
							}
						}
						description += '</tbody></table>';

						var billboard = new Cesium.BillboardGraphics({
							image: getData[i].img_url,
							width: width,
							height: height,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							//eyeOffset : new Cesium.Cartesian3(0.0,0.0,2000.0), // Negative Z will make it closer to the camera
							//pixelOffset : new Cesium.Cartesian2(0.0,-32.0), // Optional offset in pixels relative to center
							//heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
							scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.9, 1.5e5, 0.3)
						});

						// console.log("ID=========>",id);
						var point = mapObj.entities.add({
							position: Cesium.Cartesian3.fromDegrees(getData[i].lon, getData[i].lat),
							//point: {heightReference: Cesium.HeightReference.CLAMP_TO_GROUND},////RELATIVE_TO_GROUND
							name: layerName,
							id: getData[i].id,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							show: visibility,
							description: description,
							// properties: getdata[i],
							billboard: billboard,
							label: {
								text: getData[i].name,
								font: '9pt Georgia',
								heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
								distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0),
								// fillColor: Cesium.Color.fromCssColorString(getData[i].label_color),
								// outlineColor: Cesium.Color.fromCssColorString(getData[i].label_bgcolor),
								fillColor: Cesium.Color.BLACK,
								style: Cesium.LabelStyle.FILL_AND_OUTLINE,
								outlineWidth: 1,
								scaleByDistance: new Cesium.NearFarScalar(5.0e3, 1.0, 1.5e7, 0.5),
								verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
								pixelOffset: new Cesium.Cartesian2(0, 15),
								disableDepthTestDistance: Number.POSITIVE_INFINITY
							}
						});
						point.entProp = getData[i];
						point.entProp.layer_name = layerName;
						point.entProp.type = "Non-Clustered Entity";
						i++;
					}
					///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////

					var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [];
					var ellipsoid = mapObj.scene.globe.ellipsoid;

					var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);
					handler.setInputAction(function (click) {

						if (mapObj.selectedEntity != undefined) {
							entity = mapObj.selectedEntity;
							id = entity.id;
							layerNm = entity.name;
							if (entity.position != undefined) {
								cartesian = entity._position.getValue();
								console.log("cartesian: ", cartesian);
								if (cartesian != undefined) {
									cartographic = ellipsoid.cartesianToCartographic(cartesian);
									longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
									latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
									coord = [longitudeString, latitudeString];
								}
								var properties = entity.entProp;
								console.log("clicked----->", entity.entProp.type);
								console.log("clicked-----:::>", entity);
								if (entity.entProp.type == "Non-Clustered Entity") {

									// // mapObj.selectionIndicator._viewModel.isVisible = false;
									getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
								} else if (entity.name == "Boundary Point") {
								} else {
									getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
								}

							} else if (entity.polygon != undefined) {
								// // getOverlayFeatureDetails(id,coord,layerNm,properties,mapObj);
							}
						}
						// // else {
						// // console.log("No entity has been picked!");
						// // // terminateShape();
						// // }
					}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

					///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////
				}
				else {
					console.error("ERROR: No features to display!");
				}
			}
		}
		catch (err) {
			console.error("ERROR Overlay.create: ", err);
		}
	}


	//new fleet 
	var global_fleet_layer_id = [];
	var global_fleet_layer_features = [];
	var global_fleet_layer_objects = [];
	var globale_layer_names = [];

	tmpl.Track.withoutLine = function (param) {
		//console.log(global_fleet_layer_objects);
		var data = param.data;
		var properties = param.properties;
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
			//if(this.fleet_points.length > 1){
			//if(this.vehicleId == 'KA02G1117')
			//console.log(this.fleet_points);
			var point = this.fleet_points[1];
			var p_point = this.fleet_points[0];
			point[0] = parseFloat(point[0]);
			point[1] = parseFloat(point[1]);
			p_point[0] = parseFloat(p_point[0]);
			p_point[1] = parseFloat(p_point[1]);
			if (appConfigInfo.mapData == "google") {
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
				//itsparent.panMap(newEndPt);
				//console.log(angle);
				if (isNaN(angle) == false)
					itsparent.feature.getStyle().getImage().setRotation(angle);
				itsparent.feature.getGeometry().setCoordinates(newEndPt);
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

			if (appConfigInfo.type === 'sgl') {
				feature = format.readFeature(geometryVal, {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:4326'
				});
			} else if (appConfigInfo.mapData == 'google') {
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
					color: 'rgba(255,0,0,1)'
				}),
				stroke: new ol.style.Stroke({
					color: '#1b465a',
					width: 3
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
					color: 'rgba(255,0,0,1)'
				}),
				stroke: new ol.style.Stroke({
					color: '#fc0505',
					width: 2
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#fc0505'
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

		//source.getGeometry().transform('EPSG:4326', 'EPSG:3857');



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

				var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature/*, layer*/) {
					//if(layer){
					//console.log("FT >>",feature.get('layer_name'));
					if (feature.get('layer_name') == lyrName) {
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
			"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","#1e90ff":"#ff4500","orchid":"#da70d6",
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


	tmpl.Overlay.getCenter = function (param) {

		var geometryVal = param.geometry;
		var callBacFun = param.callBacFun;
		var centLocation;
		var format = new ol.format.WKT();
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
		});
		var cent = [];
		cent = createLatLonArray(geometryVal, 'poly');
		var centroidArray = getCentroid(cent, 2);
		var polygon = turf.polygon([centroidArray]);
		var centroid = turf.centerOfMass(polygon);
		centLocation = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
		console.log(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]);
		if (callBacFun) {
			callBacFun(centLocation);
		}

	}

	tmpl.Overlay.addGeometryWithColor = function (param) {
		var mapObj = param.map;
		var geometryVal = param.geometry;
		//console.log(param.properties)
		var property = param.properties;
		var colorval = param.color;
		var type = param.type;					//Add only for 3D map
		var lyrName = param.layer;
		var borderColor = param.borderColor;
		var borderWidth = param.borderWidth;
		var label = param.label;
		var lineDash = param.lineDash;
		var borderAnimate = param.borderAnimate;
		var getHoverLabel = param.getHoverLabel;
		var format = new ol.format.WKT();
		var color;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
					var feature = format.readFeature(geometryVal, {
						dataProjection: 'EPSG:4326',
						featureProjection: 'EPSG:3857'
					});
					var strokeColor;
					if (borderColor == undefined)
						strokeColor = colorval;
					else
						strokeColor = borderColor;

					if (borderWidth == undefined)
						borderWidth = 1;


					feature.set('label', label);
					feature.set('color', strokeColor);
					if (lineDash) {
						feature.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: colorval
							}),
							stroke: new ol.style.Stroke({
								color: strokeColor,
								lineDash: [.1, 5],
								width: borderWidth
							}),
							image: new ol.style.Circle({
								radius: 1,
								fill: new ol.style.Fill({
									color: colorval
								})
							})
						}));
					} else {
						feature.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: colorval
							}),
							stroke: new ol.style.Stroke({
								color: strokeColor,
								//lineDash: [.1, 5],
								width: borderWidth
							}),
							image: new ol.style.Circle({
								radius: 1,
								fill: new ol.style.Fill({
									color: colorval
								})
							})
						}));
					}

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
						"oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "#1e90ff": "#ff4500", "orchid": "#da70d6",
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

					var strokeColor;
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
							width: borderWidth
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

				//==============
				var overlay = new ol.layer.Vector({
					title: lyrName,
					visible: true,
					source: source
				});
				tmpl_setMap_layer_global_array.push({
					layer: overlay,
					title: lyrName,
					visibility: true,
					map: mapObj
				});
				console.log("Add Geometry With Color -LAYER>>>>", tmpl_setMap_layer_global_array);
				//=============

				var gblanimationfeature = '', gblanimationfeaturecolor = '';
				

				if (!isLayerPresent) {
					var layerVal = new ol.layer.Vector({
						title: lyrName,
						visible: true,
						source: source
					});
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
			else {
				var geometry = [];
				var callbackProp = null;

				tmpl.Feature.remove({ map: mapObj, id: property.id });
				tmpl.Feature.remove({ map: mapObj, id: property.id + "_label" });

				if (type == "linestring") {

					var material = new Cesium.PolylineOutlineMaterialProperty({
						glowPower: 0.9,
						color: Cesium.Color.fromCssColorString(borderColor)
						// color : Cesium.Color.ORANGE,
						// outlineWidth : 2,
						// outlineColor : Cesium.Color.BLACK
					});

					var linegeom = createLatLonArray(geometryVal, 'line');
					var length = linegeom.length;
					var labelPt = { longitude: linegeom[length - 2], latitude: linegeom[length - 1] };

					var entity = mapObj.entities.add({
						id: property.id,
						name: lyrName,
						polyline: {
							positions: Cesium.Cartesian3.fromDegreesArray(linegeom),
							width: 2,
							material: material,
							shadows: Cesium.ShadowMode.ENABLED,
							depthFailMaterial: material
						}
					});

					var polylineLabel = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(labelPt.longitude, labelPt.latitude),
						name: lyrName,
						id: property.id + "_label",
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						label: {
							text: label,
							font: '12pt Helvetica',
							// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
							fillColor: Cesium.Color.BLACK,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 1,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							pixelOffset: new Cesium.Cartesian2(0, 20),
							disableDepthTestDistance: Number.POSITIVE_INFINITY,
							scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5)
						}
					});
					entity.entProp = property;
					callbackProp = entity.entProp;

				}

				else if (type == "polygon") {

					// Getting centroid for label
					var cent = [];
					cent = createLatLonArray(geometryVal, 'poly');
					var centroidArray = getCentroid(cent, 2);

					//console.log(">>>>>>>>>>centeroidArraya>>>>>", centroidArray); //
					var polygon = turf.polygon([centroidArray]);
					// var centroid = turf.centroid(polygon);
					var centroid = turf.centerOfMass(polygon);


					// Adding entity on map	
					// if(fill == true){
					// var	poly1 = map.entities.add({
					// name: lyrName,
					// id: property.id,
					// polygon : {
					// hierarchy : Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal,'poly')),
					// //height : 40000,
					// // extrudedHeight : 2500,
					// outline : true,
					// outlineWidth : 10.0,
					// outlineColor : Cesium.Color.RED,
					// perPositionHeight : true,
					// fill: true,
					// material : Cesium.Color.ORANGE.withAlpha(0.3),
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
					// }
					// });
					// }
					// else{
					var poly1 = mapObj.entities.add({
						name: lyrName,
						id: property.id,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'poly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.fromCssColorString(borderColor),
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(colorval), 0.5),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}
					});
					// }

					var polygonLabel = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
						name: lyrName,
						id: property.id + "_label",
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						label: {
							text: label,
							font: '12pt Georgia',
							// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
							// distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
							fillColor: Cesium.Color.RED,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 1,
							showBackground: true,
							backgroundColor: Cesium.Color.WHITE,
							backgroundPadding: Cesium.Cartesian2(7, 5),
							disableDepthTestDistance: Number.POSITIVE_INFINITY,
							scaleByDistance: new Cesium.NearFarScalar(3e4, 1.0, 5e4, 0.5)
						}
					});
					poly1.entProp = property;
					callbackProp = poly1.entProp;

				}
				else if (type == "polygonz") {
					var items = appConfigInfo.color;

					function random_item(items) {
						return items[Math.floor(Math.random() * items.length)];
					}

					// Adding entity on map	
					// if(fill == true){
					// var	polyZ = map.entities.add({
					// name: lyrName,
					// id: property.id,
					// polygon : {
					// hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(createLatLonArray(geometryVal,'polyZ')),
					// //height : 40000,
					// // extrudedHeight : 2500,
					// outline : true,
					// outlineWidth : 10.0,
					// outlineColor : Cesium.Color.RED,
					// perPositionHeight : true,
					// fill: true,
					// material : Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(random_item(items)), 0.3),
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
					// zIndex : -1
					// }
					// });
					// }
					// else{
					var polyZ = mapObj.entities.add({
						name: lyrName,
						id: property.id,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(createLatLonArray(geometryVal, 'polyZ')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.fromCssColorString(borderColor),
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(colorval), 0.5),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
					// }
					polyZ.entProp = property;
					callbackProp = polyZ.entProp;
				}
				else if (type == "multipolygon") {

					// Getting centroid for label
					var cent = [];
					cent = createLatLonArray(geometryVal, 'multipoly');
					var centroidArray = getCentroid(cent, 2);
					var polygon = turf.polygon([centroidArray]);
					// var centroid = turf.centroid(polygon);
					var centroid = turf.centerOfMass(polygon);


					// Adding entity on map	
					// if(fill == true){
					// var	multiPoly = map.entities.add({
					// name: lyrName,
					// id: property.id,
					// polygon : {
					// hierarchy : Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal,'multipoly')),
					// //height : 40000,
					// // extrudedHeight : 2500,
					// outline : true,
					// outlineWidth : 10.0,
					// outlineColor : Cesium.Color.RED,
					// perPositionHeight : true,
					// fill: true,
					// material : Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(random_item(items)), 0.3),
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
					// zIndex: -1
					// }
					// });
					// }
					// else{
					var multiPoly = mapObj.entities.add({
						name: lyrName,
						id: property.id,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'multipoly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.fromCssColorString(borderColor),
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(colorval), 0.5),
							// material : Cesium.Color.ORANGE.withAlpha(0.3),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
					// }

					var polygonLabel = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
						name: lyrName,
						id: property.id + "_label",
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						label: {
							text: label,
							font: '09pt Georgia',
							// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
							fillColor: Cesium.Color.BLACK,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 1,
							// backgroundColor: Cesium.Color.fromBytes(0.165, 0.165, 0.165, 0.8),
							// showBackground: true,
							disableDepthTestDistance: Number.POSITIVE_INFINITY,
							scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5)
						}
					});
					multiPoly.entProp = property;
					callbackProp = multiPoly.entProp;
				}
			}
		}
		catch (err) {
			console.error("ERROR Overlay.addGeometryWithColor: ", err);
		}
	}


	function getCentroid(geom, splitSize) {
		var arr = geom.slice(0);
		var array = [];

		while (arr.length > 0) {
			array.push(arr.splice(0, splitSize));
		}
		array.push(array[0]);
		return array;
	}




	tmpl.Overlay.addMarker = function (param) {
		var mapObj = param.map;
		var img_url = param.img_url;
		var height = param.height;
		var width = param.width;
		var id = param.id;
		var offset = param.offset;
		var point = param.point;
		var heightAboveGround = param.heightAboveGround;
		console.log("param:", param);
		try {
			if (appConfigInfo.mapDimension == "2D") {
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
			else {
				if (heightAboveGround == undefined) {
					var billboard = {
						image: img_url,
						width: width,
						height: height,
						//scale: 1.0,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						scaleByDistance: new Cesium.NearFarScalar(5e2, 1.0, 5e10, 0.1)
					};

					var point = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(point[0], point[1]),
						// name: layerName,
						// id: getData[i].id,
						id: id,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						// show: visibility,
						// description: description,
						billboard: billboard,
						scaleByDistance: new Cesium.NearFarScalar(1e2, 1.0, 5e10, 0.1)
					});
				}
				else {
					var billboard = {
						image: img_url,
						width: width,
						height: height,
						//scale: 1.0,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
						scaleByDistance: new Cesium.NearFarScalar(5e2, 1.0, 5e10, 0.1)
					};

					var point = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(point[0], point[1], heightAboveGround),
						// name: layerName,
						// id: getData[i].id,
						id: id,
						heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
						// show: visibility,
						// description: description,
						billboard: billboard,
						scaleByDistance: new Cesium.NearFarScalar(1e2, 1.0, 5e10, 0.1)
					});
				}
			}
		}
		catch (err) {
			console.error("ERROR Overlay.addMarker: ", err);
		}
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
		var imgoffset = param.imgoffset;
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
			offset: imgoffset,
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

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var mr_olyrID = mapObj.getOverlayById(id);
				var mr_olyrID1 = mapObj.getOverlayById(id + 'label');
				if (mr_olyrID) {
					mapObj.removeOverlay(mr_olyrID);
					if (mr_olyrID1 != undefined)
						mapObj.removeOverlay(mr_olyrID1);
				}
			}
			else {
				if (id != undefined) {
					entity = mapObj.entities.getById(id);
					mapObj.entities.remove(entity);
				}
				else {
					console.log("ID not specified");
				}
			}
		}
		catch (err) {
			console.error("ERROR Overlay.removeMarker: ", err);
		}
	}

	tmpl.Overlay.removeAllMarker = function (param) {
		var mapObj = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {

				mapObj.getOverlays().getArray().forEach(function (overlay) {
					mapObj.updateSize();
					mapObj.removeOverlay(overlay);
					mapObj.updateSize();

				});
			}
			else {
				return false;
			}
		}
		catch (err) {
			console.error("ERROR Overlay.removeMarker: ", err);
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
		if (routeLayer != undefined)
			routeLayer.getSource().clear();
		if (routeVector_line != undefined)
			routeVector_line.getSource().clear();
		if (routeLayer_waypoint != undefined)
			routeLayer_waypoint.getSource().clear();
		totalDistance = 0;
	}
	tmpl.Route.getRoute = function (param) {

		try {
			tmpl.Route.clearRoute({ map: param.map })
		} catch (e) {
			console.log("Clear Route...", e);
		}
		try {
			tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
			tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });

			tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
			tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });

		}
		catch (e) {
			console.log("Line Layer Creation Error..!", e);
		}

		var mapObj = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				tmpl.Route.clearRoute({ map: mapObj });
				if (appConfigInfo.mapData == "google") {
					getGoogleRoute(param);
				}
				else if (appConfigInfo.mapData == 'pentab') {
					getPentaBRoute(param);
				}
				else if (appConfigInfo.mapData == "hereMaps") {
					getHereMapsRoute(param);
				}
				else {
					if (appConfigInfo.type == 'sgl') {
						getSGLRoute(param);
					}
					else {
						getTrinityRoute(param);
					}
				}
			}
			else {
				var route_id = param.id;
				var sourcePoint = param.source;
				var destinationPoint = param.destination;
				var srcLat = parseFloat(sourcePoint[1]);
				var srcLng = parseFloat(sourcePoint[0]);
				var dstLat = parseFloat(destinationPoint[1]);
				var dstLng = parseFloat(destinationPoint[0]);
				var sourceIcon = param.sourceIcon;
				var destinationIcon = param.destinationIcon;
				var route_color = param.color;
				var route_width = param.route_width;
				var waypoints = param.waypoints;
				var wayPointFormat = param.wayPointFormat;
				var waypointsIconUrl = param.waypointsIcon;
				var callbackFunc = param.callbackFunc;

				var arr = [];
				tmpl.Route.clearRoute({ map: mapObj });

				var bingMapsRoutingJSON = appConfigInfo.bingMapsRoutingURL + srcLat + "," + srcLng + "&wayPoint.2=" + dstLat + "," + dstLng + "&optimize=time&routeAttributes=routePath&distanceUnit=km&key=" + appConfigInfo.bingMapsGeocoderService;

				// console.log("bingMapsRoutingJSON=====>",bingMapsRoutingJSON);

				$.getJSON(bingMapsRoutingJSON, function (data) {
					var routeAddr = data;
					// console.log("routeAddr====>",routeAddr);			
					var length = routeAddr.resourceSets[0].resources[0].routePath.line.coordinates.length;
					console.log("LENGTH from getRoute====>", length);
					for (var i = 0; i < routeAddr.resourceSets[0].resources[0].routePath.line.coordinates.length; i++) {
						arr.push(routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[i][1], routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[i][0]);
					}
					// console.log("ARR====>",arr);

					var sourceImage = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(srcLng, srcLat),
						name: "Route Layer",
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						billboard: {
							image: sourceIcon,
							width: 32,
							height: 32,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
						}
					});

					var destinationImage = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(dstLng, dstLat),
						name: "Route Layer",
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						billboard: {
							image: destinationIcon,
							width: 32,
							height: 32,
							verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
						}
					});

					var material = new Cesium.PolylineOutlineMaterialProperty({
						glowPower: 10.0,
						// color : Cesium.Color.BLUE,
						color: Cesium.Color.fromCssColorString(route_color),
						// color : Cesium.Color.ORANGE,
						// outlineWidth : 2.5,
						// outlineColor : Cesium.Color.YELLOW
					});

					var entity = mapObj.entities.add({
						id: route_id,
						name: "Route Layer",
						polyline: {
							positions: Cesium.Cartesian3.fromDegreesArray(arr),
							width: route_width,
							material: material,
							shadows: Cesium.ShadowMode.ENABLED
						}
					});

					var wktGeom = "LINESTRING(";
					for (var j = 0; j < routeAddr.resourceSets[0].resources[0].routePath.line.coordinates.length; j++) {
						if (j == routeAddr.resourceSets[0].resources[0].routePath.line.coordinates.length - 1)
							wktGeom += routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[j][1] + ' ' + routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[j][0];
						else
							wktGeom += routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[j][1] + ' ' + routeAddr.resourceSets[0].resources[0].routePath.line.coordinates[j][0] + ',';
					}
					wktGeom += ")";
					// console.log("wktGeom",wktGeom);

					var travelDistance = routeAddr.resourceSets[0].resources[0].travelDistance;
					var travelTimeinSec = routeAddr.resourceSets[0].resources[0].travelDurationTraffic;
					var travelTimeconv = (travelTimeinSec / 3600).toFixed(2);
					var timesplit = travelTimeconv.split(".");
					var min = "0." + timesplit[1];
					var minutes = (min * 60).toFixed(0);
					var hourUnit;
					if (timesplit[0] > 1 || timesplit[0] > "1") {
						hourUnit = " hours ";
					}
					else {
						hourUnit = " hour ";
					}
					var minUnit;
					if (minutes > 1 || minutes > "1") {
						minUnit = " minutes ";
					}
					else {
						minUnit = " minute ";
					}

					var totalTravelTime = timesplit[0] + hourUnit + minutes + minUnit;
					var resETA = {};
					resETA.distance = {};
					resETA.distance.value = travelDistance;
					resETA.distance.units = 'KM';
					resETA.duration = {};
					resETA.duration.value = totalTravelTime;
					resETA.duration.units = 'SEC';

					var ETA_legs = routeAddr.resourceSets[0].resources[0].routePath.line.coordinates;
					// callbackFunc(travelDistance,totalTravelTime,wktGeom);
					// callbackFunc(resETA,wktGeom,route_color,route_id,sourcePoint);
					callbackFunc(resETA, sourcePoint, destinationPoint, "", ETA_legs, wktGeom);
				});
			}
		}
		catch (err) {
			console.error("ERROR Route.getRoute: ", err);
		}
	}

	function getPentaBRoute(param) {
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

		if (param.waypoints && param.waypoints.length > 0) {

			console.log(param.waypoints);
			routeLocation.push(sLocation);
			for (var s = 0; s < stops1.length; s++) {
				console.log("s:", s);
				var record = { "longitude": stops1[s].lon, "latitude": stops1[s].lat };
				routeLocation.record;
			}
			routeLocation.push(dLocation);
		}
		else {
			routeLocation.push(sLocation);
			routeLocation.push(dLocation);
		}
		console.log("Route Location:", routeLocation);
		//tmpl.Map.getToken({
		//callbackFun:function token(a){
		//console.log("Token::",a.access_token);
		//var bToken = "Bearer "+a.access_token;
		var settings = {
			"url": appConfigInfo.pentaBNetworkAPIService,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"PentaUserRole": appConfigInfo.PentaUserRole,
				"PentaOrgID": appConfigInfo.PentaOrgID,
				"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
				"Authorization": JSON.stringify(localStorage.getItem('pentaBAccessToken')),
				"Content-Type": "application/json"
			},
			"data": JSON.stringify([{ "dataSource": { "id": 11 }, "locations": routeLocation, "crs": "4326", "directed": true, "cost_table": "tn_road_cost" }]),
		};

		$.ajax(settings).done(function (response) {
			console.log(response);
			var routeLine = response[0][0].route;
			var routeDistance = response[0][0].distance;
			var routeETA = response[0][0].eta;

			try {
				var _initial = routeETA;
				var fromTime = new Date(_initial);
				var toTime = new Date();

				var differenceTravel = toTime.getTime() - fromTime.getTime();
				var seconds = Math.floor((differenceTravel) / 1000 % 60);
				var hours = Math.floor(differenceTravel / 1000 / 60 / 60);
				differenceTravel -= hours * 1000 * 60 * 60;
				var minutes = Math.floor(differenceTravel / 1000 / 60);
				console.log("minutes:", minutes);
				routeETA = minutes;
			} catch (e) {
				console.log("Time convertion Error..!", e);
			}

			//Clear Route Layer
			try {
				tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
				tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });
				tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
				tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });

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
			try {
				tmpl.Feature.changeVisibility({ map: param.map, layer: 'RouteLineLayer', visible: false });
				tmpl.Map.resize({ map: param.map });
				tmpl.Feature.changeVisibility({ map: param.map, layer: 'RouteLineLayer', visible: true });
			} catch (e) {
				Console.log("PentaB Route Line Layer Issue..!", e);
			}


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
				var resETA = {};
				resETA.distance = {};
				resETA.distance.value = 0;
				resETA.distance.units = 'M';
				resETA.duration = {};
				resETA.duration.value = 0;
				resETA.duration.units = 'S';
				resETA.distance.value = routeDistance;
				resETA.duration.value = routeETA;
				callbackFunc(resETA, routeLine);
			}
			mapObj.addLayer(srcOverlay);
			mapObj.addLayer(destOverlay);

		});

		//}})
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

			//convert Lat Lon
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

		if (wayPointFormat == true) {
			var waypoint_limit = 8;
			var length = stops1.length;
			if (length > 8) {
				console.error("WAYPOINTS LIMIT EXCEEDED");
			}
			else {
				switch (length) {
					case 1:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 2:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 3:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 4:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=passThrough!" + stops1[3][1] + "," + stops1[3][0] + "&waypoint5=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 5:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=passThrough!" + stops1[3][1] + "," + stops1[3][0] + "&waypoint5=passThrough!" + stops1[4][1] + "," + stops1[4][0] + "&waypoint6=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 6:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=passThrough!" + stops1[3][1] + "," + stops1[3][0] + "&waypoint5=passThrough!" + stops1[4][1] + "," + stops1[4][0] + "&waypoint6=passThrough!" + stops1[5][1] + "," + stops1[5][0] + "&waypoint7=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 7:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=passThrough!" + stops1[3][1] + "," + stops1[3][0] + "&waypoint5=passThrough!" + stops1[4][1] + "," + stops1[4][0] + "&waypoint6=passThrough!" + stops1[5][1] + "," + stops1[5][0] + "&waypoint7=passThrough!" + stops1[6][1] + "," + stops1[6][0] + "&waypoint8=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
						break;

					case 8:
						routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=passThrough!" + stops1[0][1] + "," + stops1[0][0] + "&waypoint2=passThrough!" + stops1[1][1] + "," + stops1[1][0] + "&waypoint3=passThrough!" + stops1[2][1] + "," + stops1[2][0] + "&waypoint4=passThrough!" + stops1[3][1] + "," + stops1[3][0] + "&waypoint5=passThrough!" + stops1[4][1] + "," + stops1[4][0] + "&waypoint6=passThrough!" + stops1[5][1] + "," + stops1[5][0] + "&waypoint7=passThrough!" + stops1[6][1] + "," + stops1[6][0] + "&waypoint8=passThrough!" + stops1[7][1] + "," + stops1[7][0] + "&waypoint9=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
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
			routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&waypoint0=geo!" + sourcePoint[1] + "," + sourcePoint[0] + "&waypoint1=geo!" + destinationPoint[1] + "," + destinationPoint[0] + "&mode=fastest;car;traffic:enabled&representation=turnByTurn";
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
				// console.log(arr);

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


				var format = new ol.format.WKT();
				var feature = format.readFeature(wktGeom, {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:3857'
				});

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
					title: "Route Layer",
					visible: true,
					source: source
				});

				mapObj.addLayer(newLayer);
			}
		});
	}


	function CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs) {
		// Latest Update Detail
		//MrJ updated on 31-01-2016   route v 2p5p36
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
		var plotOnMap = param.plotRouteOnMap;					//Option added on 22-10-2019 by Prashanth
		var waypoint_limit = 8;
		var wayptsExist = false;
		var format = new ol.format.WKT();
		if (param.waypoints) {
			var fature_waypoint;
			var waypointFeatures = [];
			var stops1 = param.waypoints;
			var temp = stops1;
			var stops = [];
			// if(wayPointFormat == undefined){
			// stops = stops1;
			// }else if(wayPointFormat ==  true){
			// for(var x=0;x<stops1.length;x++){
			// stops[x] = {};
			// /*var t = temp[x].split("POINT(")[1];
			// t = t.split(')')[0];
			// t = t.split(' ');
			// stops[x].lat = parseFloat(t[1]);
			// stops[x].lon = parseFloat(t[0]);*/
			// var p1 = temp[x].split('(');
			// var p2 = p1[1].split(')');
			// var p3 = p2[0].split(' ');
			// stops[x].lat = parseFloat(p3[1]);
			// stops[x].lon = parseFloat(p3[0]);
			// }
			// }

			if (wayPointFormat == undefined) {
				stops = stops1;
			} else if (wayPointFormat == true) {
				for (var x = 0; x < stops1.length; x++) {
					stops[x] = {};
					/*var t = temp[x].split("POINT(")[1];
					t = t.split(')')[0];
					t = t.split(' ');
					stops[x].lat = parseFloat(t[1]);
					stops[x].lon = parseFloat(t[0]);*/
					// var p1 = temp[x].split('(');
					// var p2 = p1[1].split(')');
					// var p3 = p2[0].split(' ');
					stops[x].lat = parseFloat(temp[x][1]);
					stops[x].lon = parseFloat(temp[x][0]);
				}
			}

			//console.log(stops)
			var stopsIcon = param.waypointsIcon;
			var wayptsExist = stops.length > 0;
			var waypoint_value;
			var tempwaypointStyle, waypointStyle, wkt_fature_waypoint = [];
			var globalwaypointStyle = new ol.style.Style({
				image: new ol.style.Icon({
					src: stopsIcon,
				})
			});
			var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
			if ((stops.length) >= waypoint_limit) {
				console.log("exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
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
						color: 'red',
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
						color: 'red',
						width: r_w
					})
				})
			});
			routeVector_line.setProperties({
				lname: "routeVector_line"
			});

  /*// for track buffer in ICCC start
*/  if (plotOnMap != undefined) {
				if (plotOnMap == true) {
					mapObj.addLayer(routeVector_line);
				}
				else { }
			}
			else {
				mapObj.addLayer(routeVector_line);
			}


			/*// for track buffer in ICCC ends
		  */
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

				if (plotOnMap != undefined) {
					if (plotOnMap == true) {
						mapObj.addLayer(routeLayer_waypoint);
					}
					else { }
				}
				else {
					mapObj.addLayer(routeLayer_waypoint);
				}

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
		var destinationStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 1],
				src: destinationIcon
			})
		});
		destinationMarker.setStyle(destinationStyle);
		var featuresCollection_t = [];
		if (appConfigInfo.mapData == "google") {

			var lineString = new ol.geom.LineString(coordinateArray);
			var featuresCollection_g = new ol.Feature({
				geometry: lineString,
				name: 'Line'
			});

		}
		else {


			var length_geometryVal = coordinateArray.length;
			var featureTemp;
			for (var d = 0; d < length_geometryVal - 1; d++) {
				console.log(coordinateArray[d].geometry, "   of ...", d);
				if (coordinateArray[d].geometry == "GEOMETRYCOLLECTION EMPTY") {
					//console.log("GEOMETRYCOLLECTION EMPTY Please check in Postgres");
				} else {
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

		if (plotOnMap != undefined) {
			if (plotOnMap == true) {
				routeLayer.getSource().addFeature(sourceMarker);
				routeLayer.getSource().addFeature(destinationMarker);
			}
			else { }
		}
		else {
			routeLayer.getSource().addFeature(sourceMarker);
			routeLayer.getSource().addFeature(destinationMarker);
		}
		// routeLayer.getSource().addFeature(sourceMarker);
		// routeLayer.getSource().addFeature(destinationMarker);

		/*// for track buffer in ICCC start
	  */
		if (param.zoomToRoute == true) {
			mapObj.getView().fit(routeVector_line.getSource().getExtent(), mapObj.getSize());
			//mapObj.getView().fit(routeLayer.getSource().getExtent(), mapObj.getSize());
		}

		/*// for track buffer in ICCC end
		*/
		if (param.callbackFunc != undefined) {
			if (appConfigInfo.mapData == "google") {
				//console.log(totalDistance);
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
				callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom);
				/* } else {
				   var temp = totalDistance / 1000;
				   callbackFunc({
					 distance: dis,
					 duration: time
				   });
				 } */
			} else {
				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				totalDistance = totalDistance * 100000;
				if (totalDistance < 1000) {
					var resETA = {};
					resETA.distance = {};
					resETA.distance.value = totalDistance;
					resETA.distance.units = 'M';
					resETA.duration = {};
					resETA.duration.value = 'NA';
					resETA.duration.units = 'NA';
					callbackFunc(resETA);
				} else {
					var temp = totalDistance / 1000;
					var resETA = {};
					resETA.distance = {};
					resETA.distance.value = temp;
					resETA.distance.units = 'KM';
					resETA.duration = {};
					resETA.duration.value = 'NA';
					resETA.duration.units = 'NA';
					callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom);
				}
			}
		}
		var featurebuffer;
		if (param.getGeometry != undefined) {
			if (appConfigInfo.mapData === 'google') {


				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));

				// Under Testing

				//sourceMarker,featuresCollection_g
				var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				var wktSource = format.writeGeometry(sourceMarker.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				var wktdestin = format.writeGeometry(destinationMarker.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));

				var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/buffer/wkt/";
				//alert(urlL);

				//Route buffer start  	
				$.ajax({
					type: 'POST',
					url: urlL,
					data: {
						data: wktGeom,
						radius: (param.radius) / 100000//0.0002
					},
					success: function (data) {
						// console.log("buffer data ==========>",data);
						var featurebuffer;
						//console.log("data >>",data);
						if (appConfigInfo.mapData == 'google') {
							featurebuffer = format.readFeature(data[0].geometry, {
								dataProjection: 'EPSG:4326',
								featureProjection: 'EPSG:3857'
							});
						}
						else {
							featurebuffer = format.readFeature(data[0].geometry, {
								dataProjection: 'EPSG:4326',
								featureProjection: 'EPSG:4326'
							});
						}

						featurebuffer.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: 'blue'
							}),
							stroke: new ol.style.Stroke({
								width: 1,
								color: 'blue'
							}),
							image: new ol.style.Circle({
								radius: 1,
								fill: new ol.style.Fill({
									color: 'blue'
								})
							})
						}));

						// for track buffer in ICCC start
						if (plotOnMap != undefined) {
							if (plotOnMap == true) {
								routeLayer.getSource().addFeature(featurebuffer);
							} else { }
						} else {
							routeLayer.getSource().addFeature(featurebuffer);
						}
						// routeLayer.getSource().addFeature(featurebuffer);	

						// for track buffer in ICCC end

						var wktBuffer = format.writeGeometry(featurebuffer.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));

						if (param.waypoints) {
							getGeomCallback({
								line: wktGeom,
								source: wktSource,
								destination: wktdestin,
								waypoints: wkt_fature_waypoint,
								buffer: wktBuffer
							});
						} else {
							getGeomCallback({
								line: wktGeom,
								source: wktSource,
								destination: wktdestin,
								buffer: wktBuffer
							});
						}
					},
					error: function () {
						console.log("there was an error!");
					}
				});
				//Route buffer end   

			} else {
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
	}
	function getGoogleRoute(param) {
		var waypoint_limit = 8;
		var wayptsExist = false;
		var wayPointFormat = param.wayPointFormat;
		if (param.waypoints) {
			console.log("param.waypoints: ", param.waypoints);
			var stops1 = param.waypoints;
			var temp = stops1;
			console.log("TEMP===>", temp);
			var stops = [];
			// if(wayPointFormat == undefined){
			// stops = stops1;
			// }else if(wayPointFormat ==  true){
			// for(var x=0;x<stops1.length;x++){
			// stops[x] = {};
			// /*var t = temp[x].split("POINT(")[1];
			// t = t.split(')')[0];
			// t = t.split(' ');
			// stops[x].lat = parseFloat(t[1]);
			// stops[x].lon = parseFloat(t[0]);*/
			// var p1 = temp[x].split('(');
			// var p2 = p1[1].split(')');
			// var p3 = p2[0].split(' ');
			// stops[x].lat = parseFloat(p3[1]);
			// stops[x].lon = parseFloat(p3[0]);
			// }
			// }

			if (wayPointFormat == undefined) {										// New function by Prashanth by commenting above lines
				stops = stops1;
			} else if (wayPointFormat == true) {
				for (var x = 0; x < stops1.length; x++) {
					stops[x] = {};
					/*var t = temp[x].split("POINT(")[1];
					t = t.split(')')[0];
					t = t.split(' ');
					stops[x].lat = parseFloat(t[1]);
					stops[x].lon = parseFloat(t[0]);*/
					// console.log("temp[x]: ",temp[x]);
					// var p1 = temp[x].split('(');
					// var p2 = p1[1].split(')');
					// var p3 = p2[0].split(' ');
					stops[x].lat = parseFloat(temp[x][1]);
					stops[x].lon = parseFloat(temp[x][0]);
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



	function getTrinityRoute(param) {
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

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData == 'google') {
					var x = parseFloat(point[0]);
					var y = parseFloat(point[1]);
					var coordinates = { lat: y, lng: x };
					var result = { address: 'NA' };

					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({
						'latLng': coordinates
					}, function (results, status) {
						console.log("insided", result);
						var resultArray = [];
						if (status == google.maps.GeocoderStatus.OK) {
							//console.log("ccccgeo",results);
							if (results[0]) {
								var address = results[0].formatted_address;
								result = { address: address };
								resultStatus = true;
								resultArray = results[0];
							}
						}
						callbackFunc(result, resultArray);
					});
				}

				else if (appConfigInfo.mapData == 'pentab') {
					var result = { address: 'NA' };
					//tmpl.Map.getToken({
					//callbackFun:function token(a){
					//console.log("Token::",a.access_token);
					//var bToken = "Bearer "+a.access_token;
					var settings = {
						"url": appConfigInfo.pentaBAPIService + "/findAddress",
						"method": "POST",
						"timeout": 0,
						"headers": {
							"PentaUserRole": appConfigInfo.PentaUserRole,
							"PentaOrgID": appConfigInfo.PentaOrgID,
							"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
							"Authorization": JSON.stringify(localStorage.getItem('pentaBAccessToken')),
							"Content-Type": "application/json"
						},
						"data": JSON.stringify([{ "crs": "EPSG:4326", "locations": [{ "latitude": y, "longitude": x }], "dataSource": appConfigInfo.pentaAddressTable }]),
					};

					$.ajax(settings).done(function (response) {
						console.log(response);
						var resultArray = [];
						var address = response[0][0].display_data_en;
						if (address) {
							result = { address: address };
							resultStatus = true;
							resultArray = response[0][0];
						}
						else {
							result = { address: 'Not Available' };
							resultStatus = false;
						}
						callbackFunc(result, resultArray);

					});
					//}})
				}

				else if (appConfigInfo.mapData === 'hereMaps') {

					var x = parseFloat(point[0]);
					var y = parseFloat(point[1]);
					console.log("Lat Lon : ", x, y);
					var coordinates = { lat: y, lng: x };
					var result = {};
					//var url = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id="+appConfigInfo.hereMapsAppID+"&app_code="+appConfigInfo.hereMapsAppCode+"&mode=retrieveAddresses&prox="+y+','+x;
					//console.log("url:",url);
					$.ajax("https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&mode=retrieveAddresses&prox=" + y + ',' + x,   // request url
						{
							success: function (data, status, xhr) {// success callback function

								if (data) {

									//console.log("Result:",data.Response.View[0].Result[0].Location.Address.Label);
									result = { address: data.Response.View[0].Result[0].Location.Address.Label };
									console.log("Result:", result);
									resultStatus = true;
								}
							}
						});
				}

				else {

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
					/*var result;
					var urlL = "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/nearest_place/"+point[0]+"/"+point[1]+"/1/3000";
					$.ajax({
						url:urlL,
						success: function (response) {
							console.log("nearest_place data-> ",response);
							if(response.success){
								var data=response.data;
								for (var i = 0; i < data.length ; i++){
									var record = {name : data[i].place };
									result = {address : data[i].place};
								}
								callbackFunc(result);  
							}else{
								result = {address : 'No Data'};
								callbackFunc(result); 
							}
						},
						error: function () {
							console.log("there was an error!");
						},
					});*/
				}
			}
			else {
				var baseUrl = appConfigInfo.mapboxGeocoderUrl;
				var url = baseUrl + point[0] + "," + point[1] + ".json?access_token=" + appConfigInfo.mapboxAccessToken;

				$.getJSON(url, function (data) {
					var resources = data.features;
					if (resources.length === 0) {
						return;
					}
					locationAddress = resources[0].place_name;

					var result = { address: locationAddress };
					callbackFunc(result, resources);
				});
			}
		}
		catch (err) {
			console.error("ERROR Geocode.getGeocode: ", err);
		}
	}

	tmpl.Geocode.getLocality = function (params) {
		var resultStatus;
		var point = params.point;
		var callbackFunc = params.callbackFunc;
		if (appConfigInfo.mapData == 'google') {
			var x = parseFloat(point[0]);
			var y = parseFloat(point[1]);
			var coordinates = { lat: y, lng: x };
			var result123 = {}, addressSeparate = [];

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': coordinates
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					//console.log("GeocoderStatus trinityapi -> ",results);
					var completeAddress = {};
					if (results[0]) {
						if (results[results.length - 1] == undefined || results[results.length - 1] == null) {
							completeAddress.Country = "No Data";
						} else {
							completeAddress.Country = results[results.length - 1].formatted_address;
						}
						if (results[results.length - 2] == undefined || results[results.length - 2] == null) {
							completeAddress.State = "No Data";
						} else {
							completeAddress.State = results[results.length - 2].address_components[0].long_name;
						}
						if (results[results.length - 3] == undefined || results[results.length - 3] == null) {
							completeAddress.District = "No Data";
						} else {
							completeAddress.District = results[results.length - 3].address_components[0].long_name;
						}
						if (results[results.length - 4] == undefined || results[results.length - 4] == null) {
							completeAddress.Pincode = "No Data";
						} else {
							completeAddress.Pincode = results[results.length - 4].address_components[0].long_name;
						}
						if (results[results.length - 5] == undefined || results[results.length - 5] == null) {
							completeAddress.Place = "No Data";
						} else {
							completeAddress.Place = results[results.length - 5].address_components[0].long_name;
						}
						if (results[results.length - 6] == undefined || results[results.length - 6] == null) {
							completeAddress.Place2 = "No Data";
						} else {
							completeAddress.Place2 = results[results.length - 6].address_components[0].long_name;
						}
						completeAddress.Address = results[0].formatted_address;
						//console.log(completeAddress);
					}
				}
				callbackFunc(completeAddress);
			});
		}
		else {
			var rsltAry = [], result123;
			var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/nearest_place/" + point[0] + "/" + point[1] + "/1/3000";
			$.ajax({
				url: urlL,
				success: function (data) {
					for (var i = 0; i < data.length; i++) {
						var record = { name: data[i].place };
						result123 = { address: data[i].place };
						rsltAry.push(record);
					}
					callbackFunc(result123);
				},
				error: function () {
					console.log("there was an error!");
				},
			});
		}
	}


	// **** This function takes the address as input and returns the latitude and longitude of the specified address **** //

	tmpl.Geocode.getReverseGeocode = function (params) {
		var resultStatus;
		var address = params.address;
		var callbackFunc = params.callbackFunc;
		var result;

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



			$.ajax("http://geocoder.api.here.com/6.2/geocode.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&searchtext=" + address,   // request url
				{
					success: function (data, status, xhr) {// success callback function

						if (data) {

							//console.log("Result:",data.Response.View[0].Result[0].Location.DisplayPosition);
							var cord = data.Response.View[0].Result[0].Location.DisplayPosition;
							result = { coordinates: cord };
							callbackFunc(result);
							resultStatus = true;
						}
					}

				});

		}


		else {
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

	}

	// **** This function will add the Google Search Box to the specified targetDiv and also shows the searched location with animated marker and map will be zoomed to that location. **** //

	tmpl.Search.addSearch = function (param) {

		var mapObj = param.map;
		var targetDiv = param.target;
		var getLatLonDetails = param.callBackFunction;

		if(appConfigInfo.mapData == 'google')
		{
			var resultExtent;
			var lon=0,lat=0;
			var searchBox = new google.maps.places.SearchBox(document.getElementById(targetDiv));
			var start1 = new google.maps.LatLng(parseFloat(appConfigInfo
			.extent2),parseFloat(appConfigInfo.extent1));
			var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4),parseFloat(appConfigInfo.extent3));
			var defaultBounds = new google.maps.LatLngBounds();
			defaultBounds.extend(start1);
			defaultBounds.extend(end1);
			//searchBox.setBounds(defaultBounds);
			searchBox.addListener('places_changed', function(){
				var places = searchBox.getPlaces();
				if (places.length == 0){
					return;
				}
				var bounds = new google.maps.LatLngBounds();
				places.forEach(function(place){
					var x1,y1,x2,y2,placeLocation;
					var arry = [];
					placeLocation = place.geometry.location;
					placeLocation = placeLocation.toString();
					placeLocation = placeLocation.slice(1,-2);
					placeLocation = placeLocation.split(", ");
					var placeName = place.name;
					if (place.geometry.viewport){
						bounds.union(place.geometry.viewport);
						bounds=bounds.toString();
						bounds=bounds.slice(2,-2);
						bounds=bounds.split("), (");
						x1=parseFloat(bounds[0].split(",")[0]);
						y1=parseFloat(bounds[0].split(",")[1]);
						x2=parseFloat(bounds[1].split(",")[0]);
						y2=parseFloat(bounds[1].split(",")[1]);
						var extent =[y1,x1,y2,x2];
						if(place.types[0] == 'sublocality_level_1' || place.types[0] == 'sublocality_level_2' || place.types[0] == 'sublocality_level_3' ||place.types[0] == 'sublocality_level_4' || place.types[0] == 'sublocality'  || place.types[0] == 'subpremise' || place.types[0] == 'neighborhood' || place.types[0] == 'administrative_area_level_1' || place.types[0] == 'administrative_area_level_2' || place.types[0] == 'administrative_area_level_3' || place.types[0] == 'administrative_area_level_4' || place.types[0] == 'administrative_area_level_5' || place.types[0] == 'colloquial_area' || place.types[0] == 'locality' || place.types[0] == 'political' || place.types[0] == 'country' ){
							resultExtent = extent;
						}
						else{
							resultExtent = null;
						}
						searchBox.setBounds(defaultBounds);
						var rec = {lat: parseFloat(placeLocation[0]), lon:parseFloat(placeLocation[1]), extend:resultExtent};
						arry.push(rec);
						//console.log(arry);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
							return getLatLonDetails(placeLocation[1],placeLocation[0],resultExtent,placeName);
						//}
						//else{
						//	return getLatLonDetails('','','','');
							//alert("Searched Place is Out Of Project Area....");
						//}
					}
					else{
						bounds.extend(place.geometry.location);
						var ext=null;
						searchBox.setBounds(bounds);
						var rec = {lat: parseFloat(placeLocation[0]), lon:parseFloat(placeLocation[1]), extend:ext};
						arry.push(rec);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
							return getLatLonDetails(placeLocation[1],placeLocation[0],ext,placeName);
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
				$.getJSON("https://places.cit.api.here.com/places/v1/autosuggest?at=" + coordinates + "&q=" + query.term + "&app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode, function (data) {
					//var places = data.results.filter(place => place.vicinity);
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


			//$("#"+targetDiv).easyAutocomplete(options);
			$("#" + targetDiv).autocomplete({
				source: fullAC,
				minLength: 2,
				select: function (event, ui) {

					let searchResult = null;
					let place = ui.item.value;
					let placeid = ui.item.id;

					let ur = "http://geocoder.api.here.com/6.2/geocode.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode + "&searchtext=" + place;
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
				if (closeCallbackFunc != undefined) {
					closeCallbackFunc();
				}
			};
			var searchControl = new ol.control.Control({
				element: searchDiv
			});
			mapObj.addControl(searchControl);
			// var searchBox = new google.maps.places.SearchBox(input);													//Commented on 21-11-2019
			var searchBox = new google.maps.places.Autocomplete(input);												//Added on 21-11-2019
			searchBox.setFields(['address_components', 'formatted_address', 'geometry', 'icon', 'name']); 								//Added on 21-11-2019
			var start1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent1));
			var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4), parseFloat(appConfigInfo.extent3));
			var defaultBounds = new google.maps.LatLngBounds();
			defaultBounds.extend(start1);
			defaultBounds.extend(end1);
			searchBox.setBounds(defaultBounds);
			searchBox.addListener('places_changed', function () {
				//searchBox.addListener('place_changed', function(){  //Added on 21-11-2019
				var places = searchBox.getPlaces();									//Commented on 21-11-2019
				//var places = searchBox.getPlace();								//Added on 21-11-2019
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
		}
		else {

			if (appConfigInfo.mapDataService == 'sgl') {

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

							var lat = $("#trinitySearch").getSelectedItemData().longitude;
							var lon = $("#trinitySearch").getSelectedItemData().latitude;
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
			else if (appConfigInfo.mapData == 'pentab') {

				try {
					var trinityGIS_JS_scriptsToLoad = [
						appConfigInfo.mapSDKURL + "easy-autocomplete.js",
					];
					trinityGIS_JS_scriptsToLoad.forEach(function (src) {
						var script4 = document.createElement('script');
						script4.src = src;
						script4.async = false;
						document.head.appendChild(script4);
					});

				} catch (e) {
					console.log("Search Lib Not Loaded..!");
				}

				var searchDisplayname = appConfigInfo.PntaSearchDisplayField;
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

				//input.onclick = function() {
				//var pentaBAccessToken = appConfigInfo.bToken;
				//pentaBAccessToken = pentaBAccessToken.toString()
				//}
				//if(localStorage.getItem("pentaBAccessToken") !=null)
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
						return appConfigInfo.pentaBAPIService + "/findCandidates";
					},
					//getValue: "display_data_en",
					getValue: function (element) {
						return element.display_data_en;
					},
					ajaxSettings: {
						//"url": appConfigInfo.pentaBAPIService+"/findCandidates",
						"method": "POST",
						"timeout": 0,
						"headers": {
							"PentaUserRole": appConfigInfo.PentaUserRole,
							"PentaOrgID": appConfigInfo.PentaOrgID,
							"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
							"Authorization": localStorage.getItem('pentaBAccessToken'),
							"Content-Type": "application/json"
						},
						"data": JSON.stringify([{ "tables": [{ "searchField": "text", "tableName": "public.buildings_materialized_view" }, { "searchField": "text", "tableName": "public.streets_materialized_view" }, { "searchField": "text", "tableName": "public.landmarks_materialized_view" }], "searchText": "polic", "crs": "EPSG:4326", "limit": 5, "dataSource": { "id": 11 } }]),
					},
					preparePostData: function (data) {
						data.phrase = $("#trinitySearch").val();
						return data;
					},
					list: {
						onChooseEvent: function () {
							console.log("Search Data", $("#trinitySearch").getSelectedItemData().centroid_geom);
							var searchObj = JSON.parse($("#trinitySearch").getSelectedItemData().centroid_geom);
							var pentaJ = $("#trinitySearch").getSelectedItemData();
							var searchRecPenta = $("#trinitySearch").getSelectedItemData();
							console.log("Search Data", searchObj);
							var lat = searchObj.coordinates[1];
							var lon = searchObj.coordinates[0];
							//var fields;
							//JSON.parse(pentaJ, (key, value) => key === searchDisplayname ? (fields = value) : value);
							var place = $("#trinitySearch").getSelectedItemData().display_data_en;

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
					requestDelay: 100
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
				};
				$("#trinitySearch").easyAutocomplete(options);

			}
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
		else {
			mapObj.getView().setCenter([lon, lat]);
			mapObj.getView().setZoom(12);
			loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
		}
	}

	// **** This function will add the Search Box result location as animated marker to the map **** //

	function loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width) {
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
			if (appConfigInfo.mapData == 'google') {
				marker_pos.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
			}
			else {
				marker_pos.setPosition([lon, lat]);
			}
			marker_pos.setProperties({ olname: "searchOverlay" });
			setTimeout(function () {
				tmpl.Overlay.removeMarker({ map: mapObj, id: 'searchOverlayID' })
			}, 5000);
		} else {

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
				offset: [-10, -35],
				positioning: 'center'
			});
			mapObj.addOverlay(marker_pos);
			if (appConfigInfo.mapData == 'google') {
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
					fields: ['address_components', 'formatted_address', 'geometry', 'icon', 'name'],
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

				urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/landmark_search/ps/" + lon + "/" + lat + "/" + maxPOI + "/" + type + "/" + rdus + "/2";

				//urlL= "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/landmark_search/ps/"+lon+"/"+lat+"/"+maxPOI+"/"+type+"/"+rdus;

				xhttp = new XMLHttpRequest();
				xhttp.open('GET', urlL, true);
				xhttp.send();
				// xhttp.response;
				xhttp.onreadystatechange = function () {
					if (xhttp.readyState === 4 && xhttp.status === 200) {
						var data = JSON.parse(xhttp.responseText);
						console.log("data>>>>>>>>>>>>>>>>>>>>", data);

						for (var i = 0; i < data.length; i++) {
							dstncKMtr = (data[i].distance) / 1000;
							var record = { name: data[i].place, lat: data[i].lat, lon: data[i].lon, distance: dstncKMtr, type: data[i].type };
							rsltAry.push(record);
						}
						//console.log(rsltAry);
						callbackFunc(rsltAry);


					}
				};

				/*	$.ajax({
						url:urlL,
						type: 'GET',
						headers: {"tokenHeader":"Maharashtra"},
						crossDomain: true,
						success: function (data) {
						console.log("data:",data);
							for (var i = 0; i < data.length ; i++){
									dstncKMtr = (data[i].distance)/1000;
									var record = {name : data[i].place, lat: data[i].lat, lon:data[i].lon, distance: dstncKMtr, type:data[i].type  };
								rsltAry.push(record);
							  }
							  //console.log(rsltAry);
							  callbackFunc(rsltAry);
						  
						},
						error: function () {
							console.log("there was an error!");
						},
					});*/
			}


		}

		else if (appConfigInfo.mapData == 'pentab') {
			var lon = parseFloat(point[0]);
			var lat = parseFloat(point[1]);
			var maxPOI = 1;
			var type;
			var rsltAry = [];
			var boolianone = false;
			var urlL;
			var resultArray22 = [];
			var resultArray = [];
			if (params.Max_num_POIs) {
				maxPOI = params.Max_num_POIs;
			}

			if (custom_poi_type == "blood_bank") {
				type = appConfigInfo.pentaPOIType.blood_bank;
			} else if (custom_poi_type == "hospital") {
				type = appConfigInfo.pentaPOIType.hospital;
			} else if (custom_poi_type == "fire_station") {
				type = appConfigInfo.pentaPOIType.fire_station;
			} else if (custom_poi_type == "police") {
				type = appConfigInfo.pentaPOIType.police;
			}
			else if (custom_poi_type == "all") {
				type = appConfigInfo.pentaPOIType.all;
			}
			else {
				type = appConfigInfo.pentaPOIType.all;
			}
			var rdus = radius;
			var dstncKMtr;

			//tmpl.Map.getToken({
			//callbackFun:function token(a){
			//console.log("Token::",a.access_token);
			//var bToken = "Bearer "+a.access_token;
			var settings = {
				"url": appConfigInfo.pentaBAPIService + "/findNearest",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"PentaUserRole": appConfigInfo.PentaUserRole,
					"PentaOrgID": appConfigInfo.PentaOrgID,
					"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
					"Authorization": JSON.stringify(localStorage.getItem('pentaBAccessToken')),
					"Content-Type": "application/json"
				},
				"data": JSON.stringify([{ "crs": "EPSG:4326", "limit": maxPOI, "orderBy": [{ "fieldName": "geom", "nearestGeometry": "{\"type\":\"Point\",\"coordinates\":[" + lon + "," + lat + "]}" }], "returns": [{ "fieldName": "id" }, { "fieldName": "col33" }, { "fieldName": "geom" }], "dataSource": { "id": "1", "tableName": type } }]),
			};

			$.ajax(settings).done(function (response) {
				var rec = JSON.parse(response[0].features);
				console.log(rec.features);
				for (var i = 0; i < rec.features.length; i++) {

					var lat = rec.features[i].geometry.coordinates[1];
					var lng = rec.features[i].geometry.coordinates[0];
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
					var record = { name: rec.features[i].properties.col33, lat: parseFloat(lat), lon: parseFloat(lng), distance: distance, poi_type: params.POI_type };
					console.log("-->", resultArray22);
					resultArray22.push(record);;
				}
				resultArray22.sort(function (a, b) { return a.distance - b.distance });
				console.log("-->>", resultArray22);
				callbackFunc(resultArray22);
			});

			//}})
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

			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/landmark_search/" + lon + "/" + lat + "/" + maxPOI + "/" + type + "/" + rdus + "/2";


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

	tmpl.Zoom.zoom = function (param) {
		var mapObj = param.map;
		var zoomLevel = param.zoomLevel;
		mapObj.getView().setZoom(zoomLevel);
	}


	/*
	tmpl.Zoom.toLayer = function (param) {
		var mapObj = param.map;
		var lyrname = param.layer;
		var zoomLevel;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if(param.zoomLevel)
				{
				zoomLevel = param.zoomLevel	
				}else{
				zoomLevel=appConfigInfo.searchZoom;	
				}
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var existing;
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
								zoom: zoomLevel,
								latitude: point[1],
								longitude: point[0]
							});
						} else {
							
								var point = [extent[0], extent[1]];
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
								console.log("---",zoomLevel,point[1],point[0]);
								mapObj.getView().fit(extent, mapObj.getSize());
									tmpl.Zoom.toXYcustomZoom({
									map: mapObj,
									zoom: zoomLevel,
									latitude: point[1],
									longitude: point[0]
								});
							
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
									zoom: zoomLevel,
									latitude: point[1],
									longitude: point[0]
								});
							} else {
									
								var point = [extent[0], extent[1]];
								point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
									console.log("---",zoomLevel,point[1],point[0],extent[0], extent[1]);
								mapObj.getView().fit(extent, mapObj.getSize());
									tmpl.Zoom.toXYcustomZoom({
									map: mapObj,
									zoom: zoomLevel,
									latitude: point[1],
									longitude: point[0]
								});
							}
							break;
						}
					}
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
			console.error("ERROR Zoom.toLayer: ", err);
		}
	}
	*/


	//sanjith 
	tmpl.Zoom.toLayer = function (param) {
		var mapObj = param.map;
		var lyrname = param.layer;
		var zoomLevel;
		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (param.zoomLevel) {
					zoomLevel = param.zoomLevel;
					//appConfigInfo.searchZoom = param.zoomLevel;
				} else {
					zoomLevel = appConfigInfo.searchZoom;
				}
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var existing;
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer.get('title') == lyrname) {
						existing = existingLayer;
						//var extent = existingLayer.getSource().getExtent(); //Not working
						var extent = mapObj.getView().calculateExtent(mapObj.getSize()); 

						if (extent[0] == extent[2] && extent[1] == extent[3]) {
							var point = [extent[0], extent[1]];

							if (appConfigInfo.mapData == 'pentab') {
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
							mapObj.getView().fit(extent, mapObj.getSize());
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
									zoom: zoomLevel,
									latitude: point[1],
									longitude: point[0]
								});
							} else {
								mapObj.getView().fit(extent, mapObj.getSize());
							}
							break;
						}
					}
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
			console.error("ERROR Zoom.toLayer: ", err);
		}
	}


	// **** Zoom to specified Extent **** //

	tmpl.Zoom.toExtent = function (param) {
		var mapObj = param.map;
		var extent = param.extent;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
					var ext = ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
					mapObj.getView().fit(ext, mapObj.getSize());
				} else {
					mapObj.getView().fit(extent, mapObj.getSize());
				}
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
	}

	// **** Zoom to specified Location **** //

	tmpl.Zoom.toXY = function (param) {
		var mapObj = param.map;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);

		try {
			if (appConfigInfo.mapDimension == "2D") {
				//if(ext != null){
				//	mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
				//}
				//else{


				if (appConfigInfo.mapData == "google" || 'hereMaps') {
					if (appConfigInfo.type == 'sgl') {
						mapObj.getView().setCenter([lng, lat]);
						mapObj.getView().setZoom(15);
					}
					else {
						mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
						mapObj.getView().setZoom(18);
					}
				} else {
					mapObj.getView().setCenter([lng, lat]);
					mapObj.getView().setZoom(15);
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
	}



	tmpl.Zoom.toXYWithoutZoom = function (param) {
		var mapObj = param.map;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);
		//if(ext != null){
		//	mapObj.getView().fit(ol.proj.transformExtent(ext, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
		//}
		//else{
		if (appConfigInfo.mapData == "google" || 'hereMaps') {
			if (appConfigInfo.type == 'sgl') {
				mapObj.getView().setCenter([lng, lat]);
			}
			else {
				mapObj.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
				//mapObj.getView().setZoom(18);
			}
		} else {
			mapObj.getView().setCenter([lng, lat]);
			//mapObj.getView().setZoom(15);
		}
		//}
	}
	// **** Zoom to XY with custom zoom level  Ms.PPK 09-11-16 12.44pm**** //

	tmpl.Zoom.toXYcustomZoom = function (param) {
		var mapObj = param.map;
		var zoomLevel = param.zoom;
		var lat = parseFloat(param.latitude);
		var lng = parseFloat(param.longitude);

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
	}


	tmpl.Zoom.toFeature = function (param) {				//Added on 17-10-2019 by Prashanth for ICCC Dubai demo
		var map = param.map;
		var id = param.id;

		try {
			if (appConfigInfo.mapDimension == "3D") {
				// console.log("Zoom.toFeature ID =====> ",id);
				var selectedEnt = map.entities.getById(id);
				// console.log("selectedEnt: ",selectedEnt);

				if (selectedEnt != undefined) {
					// console.log(selectedEnt);
					map.flyTo(selectedEnt);
					// map.camera.moveEnd.addEventListener(
					// zoomStart()
					// )

					// function zoomStart(){
					// alert('zoom start');
					// map.camera.zoomOut(500);
					// zoomStop();
					// }

					// function zoomStop(){
					// alert('zoom stop');
					// map.camera.moveEnd.removeEventListener();
					// }

					// tmpl.Overlay.addMarker({
					// map: map,
					// img_url: "http://192.168.1.165:8989/trinityCesiumAPI/Cesium-1.51/Build/img/pointer_64.png",
					// height: 32,
					// width: 32,
					// point: [selectedEnt.entProp.lon, selectedEnt.entProp.lat],
					// offset: [50,100]
					// // label: labelText
					// });
					// setTimeout(function () {
					// tmpl.Overlay.removeMarker({
					// map: map,
					// id: "zoomToMarker"
					// });
					// }, 3000);

				} else {
					console.error("ID is not defined or invalid");
				}
			}
		} catch (err) {
			console.error("ERROR Zoom.toFeature: ", err);
		}
	}

	tmpl.Zoom.toCenter = function (param) {
		var mapObj = param.map;
		console.log("appConfigInfo:::", appConfigInfo);
		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
					//alert(1);
					if (appConfigInfo.type === 'sgl') {
						setTimeout(function () {
							mapObj.getView().setZoom(appConfigInfo.trinityzoom);
							mapObj.getView().setCenter([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
						}, 1000);

					} else {
						mapObj.getView().setZoom(appConfigInfo.googlezoom);
						mapObj.getView().setCenter(ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:3857'));
					}
				} else if (appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'pentab') {
					//alert(2);
					setTimeout(function () {
						mapObj.getView().setZoom(appConfigInfo.trinityzoom);
						//mapObj.getView().setCenter([ parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
						mapObj.getView().setCenter(ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:4326', 'EPSG:4326'));
					}, 1000);
				}
			}
			else {
				//alert(3);
				//mapObj.scene.camera.flyHome();
				setTimeout(function () {
					mapObj.camera.flyTo({
						//destination: Cesium.Cartesian3.fromDegrees(12.96937783595628, 77.59279433392379, 1800),
						destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, appConfigInfo.height),
						orientation: {
							heading: Cesium.Math.toRadians(0.0),
							pitch: Cesium.Math.toRadians(-13.0),
							roll: 0.0
						}
						//maximumHeight: height
					});
				}, 1000);
			}
		}
		catch (err) {
			console.error("ERROR Zoom.toCenter: ", err);
		}
	}
	//---------------------------- End of Zoom to location, Extent and Layer -------------------------------//

	//--------------------------------- Beginning of Feature Updations  ------------------------------------//

	// **** This function will update the specified feature **** //

	tmpl.Feature.updateLatLong = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var lon = param.longitude;
		var lat = param.latitude;
		var layerName = param.layer;
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
							if (appConfigInfo.mapData === 'google' || 'hereMaps') {
								feature.getGeometry().setCoordinates(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
							}
							else {
								feature.getGeometry().setCoordinates([parseFloat(lon), parseFloat(lat)]);
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
						if (feature.getProperties()['id'] == id) {
							if (appConfigInfo.mapData === 'google' || 'hereMaps') {
								feature.getGeometry().setCoordinates(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
							}
							else {
								feature.getGeometry().setCoordinates([parseFloat(lon), parseFloat(lat)]);
							}
						}
					});
				}
			}

		}
	}

	// **** This function will set the visibility of specified Feature **** //
	tmpl.Feature.VisibilityFlag = false;
	tmpl.Feature.changeVisibility = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var visibility = param.visible;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
									if (visibility) {
										//console.log("99");
										try {
											feature.setStyle(feature.getProperties()['sty']);
										}
										catch (err) {
											console.error("SetStyle" + err);
										}
									}
									else {
										var st = feature.getStyle();
										feature.setProperties({ 'sty': st });

										var emptyImgStyle = new ol.style.Style({ image: '' });
										feature.setStyle(emptyImgStyle);
									}
								}
							});
							var allFeatures = existingLayer.getSource().getFeatures();
							existingLayer.getSource().clear();
							existingLayer.getSource().addFeatures(allFeatures);
						}
					}
				}
				if (existing == undefined) {
					for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
						//console.log(tmpl_setMap_layer_global[i].title);
						if (tmpl_setMap_layer_global[i].title == layerName) {
							tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {

								if (feature.getProperties()['id'] == id) {
									if (visibility) {
										//	console.log("a");
										try {
											feature.setStyle(null);
											feature.setStyle(feature.getProperties()['sty']);
										}
										catch (err) {
											console.error("SetStyle" + err);
										}
									}
									else {

										var st = feature.getStyle();
										feature.setProperties({ 'sty': st });

										var emptyImgStyle = new ol.style.Style({ image: '' });
										feature.setStyle(emptyImgStyle);
										//	console.log("b");
									}
								}
							});
							var allFeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
							tmpl_setMap_layer_global[i].layer.getSource().clear();
							tmpl_setMap_layer_global[i].layer.getSource().addFeatures(allFeatures);
						}
					}
				}
			}
			else {
				if (id) {
					var ent = mapObj.entities.getById(id);
					ent.show = visibility;
				}
				else {
					console.error("NO ENTITY MATCHING WITH PROVIDED ID!");
				}
			}
		}
		catch (err) {
			console.error("ERROR Feature.changeVisibility: ", err);
		}
	}

	// **** This function removes the specified Feature **** //

	tmpl.Feature.remove = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var isClusterLayer = param.isClusterLayer;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var existing;
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					//console.log("existingLayer: ",existingLayer);
					if (existingLayer) {
						if (existingLayer.get('title') === layerName) {
							existing = existingLayer;
							//console.log("existingLayer.getSource().getFeatures() -> ",existingLayer.getSource().getFeatures());
							//console.log("existingLayer -> ",existingLayer);
							existingLayer.getSource().getFeatures().forEach(function (feature) {
								//console.log("---------->FEATURE: ",feature);
								//console.log("---------->FEATURE: ",feature.getProperties());
								//console.log("---------->FEATURE: ",feature.getProperties().features);
								if (feature.getProperties()['id'] == id) {
									existingLayer.getSource().removeFeature(feature);
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
									layer.getSource().removeFeature(feature);
									var index = global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + id);
									global_fleet_layer_id[index] = '';
								}
							});
						}
					}
				}
			}
			else {
				var entity = mapObj.entities.getById(id);
				mapObj.entities.remove(entity);
			}
		}
		catch (err) {
			console.error("ERROR Feature.remove: ", err);
		}
	}
	/*
	tmpl.Feature.remove = function(param){
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var isClusterLayer = param.isClusterLayer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for(var i=0;i<length;i++){
			var existingLayer=Layers.item(i);
			//console.log("existingLayer: ",existingLayer);
			if(existingLayer){
				if(existingLayer.get('title') === layerName){
					existing = existingLayer;
					console.log("existingLayer.getSource().getFeatures() -> ",existingLayer.getSource().getFeatures());
					console.log("existingLayer -> ",existingLayer);
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						console.log("---------->FEATURE: ",feature);
						//console.log("---------->FEATURE: ",feature.getProperties());
						//console.log("---------->FEATURE: ",feature.getProperties().features);
						if(feature.getProperties()['id']==id){
							existingLayer.getSource().removeFeature(feature);
						}
	
						if(isClusterLayer == true){
							var clusterDatas = feature.getProperties().features;
							//console.log("clusterDatas before -> ",clusterDatas);
							console.log("before l -> ",clusterDatas.length);
							for(var j=0; j<clusterDatas.length; j++){
								console.log("clusterDatas -> ",clusterDatas[j].getId());
								if(clusterDatas[j].getProperties().id == id){
									existingLayer.getSource().removeFeature(feature);
									existingLayer.getSource().clear();
									//console.log("clusterDatas[j] ",clusterDatas[j].getProperties().id);	
									//clusterDatas.splice(j, 1); 
								}
							}
							
							
							console.log("after l -> ",clusterDatas.length);
							//console.log("clusterDatas after -> ",clusterDatas);
						}
					});
					
					//console.log("existingLayer.getSource().getFeatures() after -> ",existingLayer.getSource().getFeatures());				
				}
			}
		}
		if(existing == undefined){
			for(var i=0;i<tmpl_setMap_layer_global.length;i++){
				if(tmpl_setMap_layer_global[i].title == layerName){
					var layer = tmpl_setMap_layer_global[i].layer;
					layer.getSource().getFeatures().forEach(function (feature) {
						if(feature.getProperties()['id']==id){
							layer.getSource().removeFeature(feature);
							var index = global_fleet_layer_id.indexOf('fleet_'+layerName+'_'+id);
							global_fleet_layer_id[index] = '';
						}
					});
				}
			}
			
		}
	}
	*/

	tmpl.Feature.setProperty = function (param) {
		var feature = param.feature;
		var propertyObj = param.properties;
		feature.setProperties(propertyObj);//set Properties to identify feature
	}

	// **** This function adds the Feature to specified Layer **** //
	/*
	tmpl.Feature.add = function(JsonObj,layerName,mapObj){
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var alreadyExist = false;
		for(var i=0;i<length;i++){
			var existingLayer=Layers.item(i);
			if(existingLayer.get('title') === layerName){
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if(feature.getProperties()['id']==id){
						alreadyExist = true;
					}
				})
				if(alreadyExist){
					//alert("Already Exists");
				}else{
					existingLayer.getSource().addFeature(feature);
				}
			}
		}
	}
	*/
	// **** This function will change the label according the specified label text, text color, background color **** //

	tmpl.Feature.editLabel = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var labelLayer;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerName) {
					labelLayer = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties()['id'] == param.id) {
							if (param.label) {
								feature.set('label', param.label);
								feature.getStyle().getText().setText(param.label);
							}
							if (param.color) {
								feature.getStyle().getText().getFill().setColor(param.color);
							}
							if (param.bgcolor) {
								feature.getStyle().getText().getStroke().setColor(param.bgcolor);
							}
						}
					});
					if (labelLayer != undefined)
						mapObj.removeLayer(labelLayer);
					var allFeatures = existingLayer.getSource().getFeatures();
					existingLayer.getSource().clear();
					existingLayer.getSource().addFeatures(allFeatures);
					if (labelLayer != undefined)
						mapObj.addLayer(labelLayer);
				}
			}
		}

		if (labelLayer == undefined) {
			var temp_fetr = null;
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
						if (feature.get('id') == param.id) {
							temp_fetr = feature;
							if (param.label) {
								feature.set('label', param.label);
								feature.getStyle().getText().setText(param.label);

							}
							if (param.color) {
								feature.getStyle().getText().getFill().setColor(param.color);
							}
							if (param.bgcolor) {
								feature.getStyle().getText().getStroke().setColor(param.bgcolor);
							}
						}
					});
					if (temp_fetr != null) {
						tmpl_setMap_layer_global[i].layer.getSource().removeFeature(temp_fetr);
						tmpl_setMap_layer_global[i].layer.getSource().addFeature(temp_fetr);
					}
				}
			}
		}

	}


	tmpl.Feature.changeIcon = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer;
		var icon = param.icon;
		var image_scale = null;


		var image_scale = param.icon_scale;
		if (image_scale == undefined) {
			image_scale = 1;
		}

		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var dataArr = [];

		var existing;
		for (var i = 0; i < length; i++) {
			var lyr1 = lyrs.item(i);
			if (lyr1) {
				if (lyr1.get('title') === layerName) {
					///
					existing = lyr1;
					lyr1.getSource().getFeatures().forEach(function (ff) {
						if (ff.getProperties().features[0].get('id') == id) {
							ff.setStyle(new ol.style.Style({
								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: icon,
									scale: image_scale

								}))
							}));
						}
						if (ff.getProperties()['id'] == id) {
							if (icon) {

								var txt = null;

								if (ff.getStyle().getText()) {
									txt = ff.getStyle().getText().getText();
									var fillColor = ff.getStyle().getText().getFill().getColor();
									var strokeColor = ff.getStyle().getText().getStroke().getColor();
									ff.setStyle(new ol.style.Style({
										fill: new ol.style.Fill({
											color: 'rgba(255, 255, 255, 0.2)'
										}),
										image: new ol.style.Icon(({
											anchor: [0.5, 1],
											src: icon,
											scale: image_scale
										})),
										text: new ol.style.Text({
											font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
											textAlign: 'center',
											text: txt,
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
									}));
								}
								else {

									ff.setStyle(new ol.style.Style({
										image: new ol.style.Icon(({
											anchor: [0.5, 1],
											src: icon,
											scale: image_scale

										}))
									}));
								}


							}
						}

						//
					});
					var alfeatures = lyr1.getSource().getFeatures();
					lyr1.getSource().clear();
					lyr1.getSource().addFeatures(alfeatures);
				}
			}
		}

		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (ff) {
						if (ff.getProperties()['id'] == id) {
							if (icon) {
								var txt = null;

								if (ff.getStyle().getText()) {
									txt = ff.getStyle().getText().getText();
									var fillColor = ff.getStyle().getText().getFill().getColor();
									var strokeColor = ff.getStyle().getText().getStroke().getColor();
									ff.setStyle(new ol.style.Style({
										fill: new ol.style.Fill({
											color: 'rgba(255, 255, 255, 0.2)'
										}),
										image: new ol.style.Icon(({
											anchor: [0.5, 1],
											src: icon,
											scale: image_scale
										})),
										text: new ol.style.Text({
											font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
											textAlign: 'center',
											text: txt,
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
									}));
								}
								else {

									ff.setStyle(new ol.style.Style({
										image: new ol.style.Icon(({
											anchor: [0.5, 1],
											src: icon,
											scale: image_scale
										}))
									}));

								}

							}
						}
					});


					var alfeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeatures(alfeatures);
				}
			}

		}

	}

	tmpl.Layer.changeIcon = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var icon = param.icon;
		var scale = param.icon_scale;
		var angle = param.angle;
		if (angle == undefined)
			angle = 0;
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var dataArr = [];

		var existing;
		for (var i = 0; i < length; i++) {
			var lyr1 = lyrs.item(i);
			if (lyr1) {
				if (lyr1.get('title') === layerName) {
					existing = lyr1;
					lyr1.getSource().getFeatures().forEach(function (ff) {
						if (icon) {
							ff.setStyle(new ol.style.Style({

								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: icon,
									scale: scale,
									rotation: angle
								}))
							}));
						}

					});
					var alfeatures = lyr1.getSource().getFeatures();
					lyr1.getSource().clear();
					lyr1.getSource().addFeatures(alfeatures);
				}
			}
		}

		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (ff) {

						if (icon) {
							ff.setStyle(new ol.style.Style({

								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: icon,
									scale: scale,
									rotation: angle
								}))
							}));
						}
					});
					var alfeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeatures(alfeatures);
				}
			}
		}
	}

	tmpl.Layer.changeRotation = function (param) {
		var mapObj = param.map;
		var getdata = param.features;
		var layerName = param.layer;
		var existing;

		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (ff) {
						for (var j = 0; j < getdata.length; j++) {
							if (ff.get('id') == getdata[j].id) {
								var anagle;

								if (getdata[j].ot_track_angle != undefined)
									anagle = getdata[j].ot_track_angle;
								else
									anagle = 0;
								ff.getStyle().getImage().setRotation(anagle);
							}
						}
					});
					var alfeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeatures(alfeatures);
				}
			}

		}
	}

	//----------------------------------- End of Feature Updations  ---------------------------------------//

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

		try {
			var mapObj = param.map;
			var layerName = param.layer;
			if (appConfigInfo.mapDimension == "2D") {
				if (mapObj) {
					try {
						var Layers = mapObj.getLayers();
						var length = Layers.getLength();
					}
					catch (e) { console.log("Erroe in cleardata:", e); }
					var existingLayer;
					var CircleLayerAttachmentBoolian = false;
					var lyrName_circle = layerName + "_API_CircleLayer";
					if (layerName != undefined) {
						for (var i = 0; i < length; i++) {
							var exLayer = Layers.item(i);
							if (exLayer != undefined) {
								console.log("Title", exLayer.get('title'));
								//console.log("layername", exLayer.get('layername'));
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
			}
			else {
				var entity = mapObj.entities._entities;
				// for(var i=0; i < mapObj.entities._entities._array.length; i++){
				for (var i = mapObj.entities._entities._array.length - 1; i >= 0; i--) {
					if (entity._array[i]._name == layerName) {
						var ent = entity._array[i];
						mapObj.entities.remove(ent);
					}
				}

				var length = mapObj.dataSources.length;
				var j = 0;
				while (j < length) {
					if (mapObj.dataSources.get(j).name == layerName) {
						mapObj.dataSources.remove(mapObj.dataSources.get(j));
					}
					else { }
					j++;
				}
			}
		}
		catch (err) {
			console.error("ERROR Layer.clearData: ", err);
		}
	}

	// **** It sets the specified Layer Visibility **** //

	tmpl.Layer.changeVisibility = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var visibility = param.visible;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var Layers;
				try {
					Layers = mapObj.getLayers();
					var length = Layers.getLength();
				} catch (e) { console.log("Error in Get Layers:", mapObj); }

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


	tmpl.Layer.changeVisibilityCustom = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var visibility = param.visible;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var lyrName_circle = layerName + "_API_CircleLayer";

		var CircleLayerAttachmentBoolian = false;
		var existing;
		for (i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				for (var j = 0; j < layerName.length; j++) {
					if (existingLayer.get('title') === layerName[j]) {
						existing = existingLayer;
						existingLayer.setVisible(visibility);
						if (existingLayer.get('CircleLayerAttached') == true) {
							CircleLayerAttachmentBoolian = true;
							for (var k = 0; k < length; k++) {
								var exLayer2 = Layers.item(k);
								if (exLayer2 != undefined) {
									console.log(exLayer2.get('title'), layerName[j] + "_API_CircleLayer");
									if (exLayer2.get('title') == layerName[j] + "_API_CircleLayer") {
										//mapObj.removeLayer(exLayer2);
										//alert();
										exLayer2.setVisible(visibility);

									}
								}
							}
						}


					}
				}
			}
		}


		if (CircleLayerAttachmentBoolian == true) {


		}

		//if(existing == undefined){
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			for (var j = 0; j < layerName.length; j++) {
				if (tmpl_setMap_layer_global[i].title == layerName[j]) {
					if (visibility == false) {
						tmpl_setMap_layer_global[i].layer.setMap(null);
						tmpl_setMap_layer_global[i].visibility = false;
					}
					else {
						tmpl_setMap_layer_global[i].layer.setMap(mapObj);
						tmpl_setMap_layer_global[i].visibility = true;
					}
				}
			}
		}

		//}
	}

	tmpl.Layer.setIndex = function (param) {
		var mapObj = param.map;
		var layers = param.layers;
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var layer_existing;
		var existing;
		var layerObjects = [];

		for (var j = 0; j < layers.length; j++) {
			for (var i = 0; i < tmpl_setMap_layer_global_array.length; i++) {
				if (tmpl_setMap_layer_global_array[i].title == layers[j]) {

					layerObjects[j] = {};
					layerObjects[j].layer = tmpl_setMap_layer_global_array[i].layer;
					tmpl_setMap_layer_global_array[i].layer
					layerObjects[j].type = 'setmap';
					// tmpl.Layer.remove({
					// 	map: mapObj,
					// 	layer: tmpl_setMap_layer_global_array[i].layer
					// });	

					tmpl_setMap_layer_global_array[i].layer.setMap(null);
				}
				
				//tmpl_setMap_layer_global_array[i].layer.getSource().clear();
			}
		}
		for (var j = 0; j < lyrs.length; j++) {
			var ll = lyrs.item(j);
			if (ll.get('title') == layers[j]) {
				layerObjects[j] = {};
				layerObjects[j].layer = ll;
				layerObjects[j].type = 'map';
				ll.setMap(mapObj);
				//mapObj.addLayer(ll);
			}
		}
		for (var k = 0; k < layerObjects.length; k++) {
			if (layerObjects[k] != undefined) {
				if (layerObjects[k].type = 'setmap') {
					
					//mapObj.removeLayer(layerObjects[k].layer);

					layerObjects[k].layer.setMap(mapObj);
				} else {
					//mapObj.addLayer(layerObjects[k].layer);
					//mapObj.removeLayer(layerObjects[k].layer);

					(layerObjects[k].layer).setMap(mapObj);
				}
			}
		}
	}

	tmpl.Layer.setIndexForAllLayers = function (param) {
		var mapObj = param.map;
		var layers = param.layers;
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var layer_existing;
		var existing;
		var layerObjects = [];

		for (var j = 0; j < layers.length; j++) {
			for (var i = 0; i < tmpl_setMap_layer_global_array.length; i++) {
				if (tmpl_setMap_layer_global_array[i].title == layers[j]) {
					layerObjects[j] = {};
					layerObjects[j].layer = tmpl_setMap_layer_global_array[i].layer;
					layerObjects[j].type = 'setmap';
					tmpl_setMap_layer_global_array[i].layer.setMap(null);
				}
			}
		}
		for (var j = 0; j < lyrs.length; j++) {
			var ll = lyrs.item(j);
			if (ll.get('title') == layers[j]) {
				layerObjects[j] = {};
				layerObjects[j].layer = ll;
				layerObjects[j].type = 'map';
				mapObj.addLayer(ll);
			}
		}
		for (var k = 0; k < layerObjects.length; k++) {
			if (layerObjects[k] != undefined) {
				if (layerObjects[k].type = 'setmap') {
					layerObjects[k].layer.setMap(mapObj);
				} else {
					mapObj.addLayer(layerObjects[k].layer);
				}
			}
		}
	}

	tmpl.Layer.setCustomIndex = function (param) {
		try {
			var mapObj = param.map;
			var layerIndex = param.index;
			var lyrName = param.layer;
			var lyrs = mapObj.getLayers();
			var length = lyrs.getLength();
			var layer_existing;
			var existing;
			for (var i = 0; i < length; i++) {
				var ll = lyrs.item(i);

				if (ll) {
					if (ll.get('title') === lyrName) {
						layer_existing = ll;
						existing = ll;
						var layers = mapObj.getLayers();
						var index = layers.getArray().indexOf(layer_existing);
						// layers.removeAt(index);
						//layers.insertAt(layerIndex, layer_existing);
						layers.insertAt(layerIndex, ll);
					}
				}
			}

			if (existing == undefined) {
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
					if (tmpl_setMap_layer_global[i].title == lyrName) {
						layer_existing = ll;
						existing = ll;
						var layers = mapObj.getLayers();
						var index = layers.getArray().indexOf(layer_existing);
						//layers.removeAt(index);
						layers.insertAt(layerIndex, layer_existing);
						//layers.insertAt(layerIndex, ll);
					}
				}
			}
			return true;
		} catch (error) {
			console.error('Error @ tmpl.Layer.setCustomIndex > ', error);
		}
	}

	//This API is for setting the Index value for the cluster over cluster layer.
	tmpl.Layer.setCustomIndexTest = function (param) {
		let mapObj = param.map;
		let layerIndex = param.index;
		let lyrName = param.layer;
	
		let Layers = mapObj.getLayers();
		let length = Layers.getLength();
		if (!layerIndex || layerIndex == undefined)
			layerIndex = length + 10;
	
		//let length = Layers.getLength();
		for (let i = 0; i < length; i++) {
			let existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === lyrName) {
					existingLayer.setZIndex(layerIndex);
					console.log("Index for layer changed to : ", layerIndex);
				}
			}
		}
	}

	// tmpl.Layer.setCustomArrayIndex = function (param) {
	// 	try {
	// 		var mapObj = param.map;
	// 		var layerIndex = [];
	// 		layerIndex = param.index;
	// 		var lyrName = [];
	// 		lyrName = param.layer;
	// 		var lylen1 = lyrName.length;
	// 		var lyIndxLen = layerIndex.length;

	// 		var lyrs = mapObj.getLayers();
	// 		var length = lyrs.getLength();

	// 		var layer_existing;
	// 		var existing;

	// 		for (var k = 0; k < length; k++) {
	// 			var ll = lyrs.item(k);

	// 			if (ll) {
	// 				if (ll.get('title') === lyrName[k])

	// 			}

	// 		}

	// 		for (var i = 0; i < length; i++) {
	// 			var ll = lyrs.item(i);

	// 			if (ll) {
	// 			    if (ll.get('title') === lyrName) {
	// 			        layer_existing = ll;
	// 			        existing = ll;
	// 			        var layers = mapObj.getLayers();
	// 			        var index = layers.getArray().indexOf(layer_existing);
	// 			       // layers.removeAt(index);
	// 			        //layers.insertAt(layerIndex, layer_existing);
	// 					layers.insertAt(layerIndex , ll);
	// 			    }
	// 			}
	// 		}

	// 		if (existing == undefined) {
	// 			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
	// 				if (tmpl_setMap_layer_global[i].title == lyrName) {
	// 					layer_existing = ll;
	// 					existing = ll;
	// 					var layers = mapObj.getLayers();
	// 					var index = layers.getArray().indexOf(layer_existing);
	// 					layers.removeAt(index);
	// 					layers.insertAt(layerIndex, layer_existing);
	// 				}
	// 			}
	// 		}
	// 		return true;
	// 	} catch (error) {
	// 		console.error('Error @ tmpl.Layer.setCustomIndex > ', error);
	// 	}
	// }

	tmpl.Layer.setIndexToBottom = function (param) {
		var mapObj = param.map;
		var layer = param.layer;
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layer) {

				tmpl_setMap_layer_global[i].layer.setZIndex(0);
			}
		}

	}

	tmpl.Layer.setIndexToBottomTest = function (param) {
		var mapObj = param.map;
		var layer = param.layer;
		for (var i = 0; i < tmpl_setMap_layer_global_array.length; i++) {
			if (tmpl_setMap_layer_global_array[i].title == layer) {

				tmpl_setMap_layer_global_array[i].layer.setZIndex(0);
			}
		}

	}

	// tmpl.Layer.setIndex = function(param){
	// var mapObj = param.map;
	// var layerIndex = param.index;
	// var lyrName = param.layer;
	// var lyrs = mapObj.getLayers();
	// var length = lyrs.getLength();
	// var layer_existing;
	// var existing;
	// for(var i=0;i<length;i++){
	// var ll=lyrs.item(i);
	// if(ll){
	// if(ll.get('title') === lyrName){
	// layer_existing = ll;
	// existing = ll;
	// //layer_existing.setZIndex(layerIndex);
	// var layers = mapObj.getLayers();
	// var index = layers.getArray().indexOf(layer_existing);
	// layers.removeAt(index);
	// layers.insertAt(layerIndex, layer_existing);
	// }
	// }
	// }

	// if(existing == undefined){
	// for(var i=0;i<tmpl_setMap_layer_global.length;i++){
	// if(tmpl_setMap_layer_global[i].title == lyrName){


	// }
	// }

	// }

	// }

	tmpl.Layer.VisibilitySwitcher = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var layerName = param.layer_name;
		var layer_status = false;
		var status = document.getElementById(id).checked;
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		for (i = 0; i < length; i++) {
			var l1 = lyrs.item(i);
			if (l1) {
				if (l1.get('title') === layerName) {
					layer_status = true;
					if (status) {
						// console.log("true");
						l1.setVisible(true);
					}
					else {
						// console.log("false");
						l1.setVisible(false);
					}
				}
			}
		}
		if (layer_status == false) {
			console.log("Invalid Layer Name");
		}
	}
	//-------------------------------------- End of Layer Updations ----------------------------------------//

	// **** It calculates the Extent of Base Map**** //

	// tmpl.Extent.calculate = function(param){
	// var mapObj = param.map;
	// var extent;
	// if(appConfigInfo.mapData==='google'){
	// extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
	// }else{
	// var a = mapObj.getView().calculateExtent(mapObj.getSize());
	// extent =[parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2]),parseFloat(a[3])];
	// }
	// return extent;
	// }
	tmpl.Extent.calculate = function (param) {
		var mapObj = param.map;
		var extent;
		if (appConfigInfo.mapDimension == "2D") {
			var a = mapObj.getView().calculateExtent(mapObj.getSize());
			extent = [parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3])];
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
				extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
			}
			else if (appConfigInfo.mapData == 'pentab') {
				extent = ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:4326');
			}
			return extent;
		}
		else {
			extent = mapObj.camera.computeViewRectangle();
			var west = Cesium.Math.toDegrees(extent.west).toFixed(15);
			var south = Cesium.Math.toDegrees(extent.south).toFixed(15);
			var east = Cesium.Math.toDegrees(extent.east).toFixed(15);
			var north = Cesium.Math.toDegrees(extent.north).toFixed(15);
			west = parseFloat(west);
			south = parseFloat(south);
			east = parseFloat(east);
			north = parseFloat(north);
			var extent3D = [west, south, east, north];
			var centerX = (west + east) / 2;
			var centerY = (south + north) / 2;
			var centerPoint = { lon: centerX, lat: centerY };
			return extent3D;
		}

	}

	tmpl.Extent.calculateWKT = function (param) {
		var mapObj = param.map;
		var extent = tmpl.Extent.calculate({ map: mapObj });
		var extentWkt;
		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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
				if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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


	//------------------------------------ Beginning of Measurment Tools -----------------------------------//

	tmpl.Measure.distance = function (param) {
		var mapObj = param.map;
		var b1 = document.createElement('button');
		b1.title = 'Measure Distance';
		b1.className = 'ol-map-measurebtn';
		b1.addEventListener('click', function () { tmpl.Measure.measure({ type: "distance", map: mapObj }); });
		var md = new ol.control.Control({
			element: b1
		});
		mapObj.addControl(md);
	}

	tmpl.Measure.area = function (param) {
		var mapObj = param.map;
		var b1 = document.createElement('button');
		b1.title = 'Measure Area';
		b1.className = 'ol-map-areabtn';
		b1.addEventListener('click', function () { tmpl.Measure.measure({ type: "area", map: mapObj }); });
		var ma = new ol.control.Control({
			element: b1
		});
		mapObj.addControl(ma);
	}

	function clearMeasureOverlay(mapObj) {
		var allOverlays = mapObj.getOverlays();
		for (var i = 0; i < allOverlays.getLength(); i++) {
			var overlay = allOverlays.item(i);
			if (overlay) {
				if (overlay.get('olname') === 'measureToolTipOverlay') {
					mapObj.removeOverlay(overlay);
				}
			}
		}
	}

	tmpl.Measure.clear = function (param) {
		var mapObj = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				mapObj.removeInteraction(draw);
				mapObj.removeInteraction(select);
				mapObj.removeInteraction(selectE);

				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (var i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('lname') === 'vectorMeasureLayer') {
							clearMeasureOverlay(mapObj);
							existingLayer.getSource().clear();
						}
					}
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

	tmpl.Measure.measure = function (param) {
		var mapObj = param.map;
		var measureType = param.type;
		var lineColor = param.lineColor;
		var callBack = param.callBack;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				mapObj.removeInteraction(draw);
				mapObj.removeInteraction(select);

				mapObj.removeInteraction(selectE);

				if (lineColor == undefined) {
					lineColor = 'rgba(0, 0, 0, 0.5)';
				}

				tmpl.Measure.clear({ map: mapObj });
				/*var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for(var i=0;i<length;i++){
					var existingLayer = Layers.item(i);
					if(existingLayer){
						if(existingLayer.get('lname') === 'vectorMeasureLayer'){
							//mapObj.removeLayer(existingLayer);
							clearMeasureOverlay(mapObj);
							existingLayer.getSource().clear();
						}
					}	
				}*/
				var source = new ol.source.Vector();
				vectorMeasureLayer = new ol.layer.Vector({
					source: source,
					style: new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
							color: '#ffcc33',
							width: 2
						}),
						image: new ol.style.Circle({
							radius: 7,
							fill: new ol.style.Fill({
								color: '#ffcc33'
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
						callBack();
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
				var wgs84Sphere = new ol.Sphere(6378137);
				var formatLength = function (line) {
					var length;
					var coordinates = line.getCoordinates();
					length = 0;
					var sourceProj = mapObj.getView().getProjection();
					for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
						var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
						var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
						length += wgs84Sphere.haversineDistance(c1, c2);
					}
					var output;
					if (length > 100) {
						output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
					}
					else {
						output = (Math.round(length * 100) / 100) + ' ' + 'm';
					}
					return output;
				};
				var formatArea = function (polygon) {
					var area;
					var sourceProj = mapObj.getView().getProjection();
					var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
						sourceProj, 'EPSG:4326'));
					var coordinates = geom.getLinearRing(0).getCoordinates();
					area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
					var output;
					if (area > 10000) {
						output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
					} else {
						output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
					}
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
	}


	//--------------------------------------- End of Measurment Tools --------------------------------------//

	//----------------------------------- Beginning of Information Tool ------------------------------------//

	tmpl.Tooltip.add = function (param) {
		var mapObj = param.map;
		var offset = param.offset;
		var coord = param.coordinate;
		var featureDatas = param.html;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
					if (appConfigInfo.type == 'sgl') {
						position = coord;
					}
					else {
						position = ol.proj.transform([coord[0], coord[1]], 'EPSG:4326', 'EPSG:3857');
					}
				}
				else if (appConfigInfo.mapData == 'pentab') {

					position = ol.proj.transform([coord[0], coord[1]], 'EPSG:4326', 'EPSG:4326');

				}
				else {
					position = coord;
				}
				popup.show(position, featureDatas);
			}
			else {
				var descriptionDiv = document.getElementsByClassName("cesium-infoBox-iframe");
				if (descriptionDiv[0] != undefined) {
					descriptionDiv[0].outerHTML = "";
				}
				else {
					// console.log("descriptionDiv[0] is undefined");
				}

				document.getElementsByClassName("cesium-infoBox")[0].style.width = "0px";
				document.getElementsByClassName("cesium-infoBox")[0].style.border = "0px";
				document.getElementsByClassName("cesium-infoBox")[0].style.maxWidth = "0px"

				var cameraButton = document.getElementsByClassName("cesium-button cesium-infoBox-camera");
				if (cameraButton[0] != undefined) {
					cameraButton[0].outerHTML = "";
				}
				else {
					// console.log("cameraButton[0] is undefined");
				}

				var closeButton = document.getElementsByClassName("cesium-infoBox-close");
				if (closeButton[0] != undefined) {
					closeButton[0].outerHTML = "";
				}
				else {
					// console.log("closeButton[0] is undefined");
				}

				var htmlContent = featureDatas;

				var titleDiv = document.getElementsByClassName("cesium-infoBox-title");
				if (titleDiv[0] == undefined) {
					var main = document.getElementsByClassName("cesium-infoBox");
					main[0].innerHTML = "";															// To clear existing tooltip
					var child = document.createElement("DIV");
					child.className = "cesium-infoBox-title";
					main[0].appendChild(child);
					var newtitleDiv = document.getElementsByClassName("cesium-infoBox-title");
					newtitleDiv[0].outerHTML = htmlContent;
				}

				// if(titleDiv[0] != undefined){
				else {
					titleDiv[0].outerHTML = htmlContent;
				}

				document.getElementsByClassName("cesium-infoBox")[0].style.visibility = "visible";
			}
		}
		catch (err) {
			console.error("ERROR Tooltip.add: ", err);
		}
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
		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
			else {
				var main = document.getElementsByClassName("cesium-infoBox");
				if (main[0] != undefined) {
					main[0].innerHTML = "";										// To clear existing tooltip
				}
			}
		}
		catch (err) {
			console.error("ERROR Tooltip.remove: ", err);
		}
	}

	//--------------------------------------- End of Information Tool --------------------------------------//




	tmpl.Create.getPointFeature = function (param) {
		var mapObj = param.map;
		var lat = param.latitude;
		var lon = param.longitude;
		var geometry;

		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else {
			var cor = [parseFloat(lon), parseFloat(lat)];
			geometry = new ol.geom.Point(cor);

		}

		var featureval = new ol.Feature({
			geometry: geometry
		});


		return featureval;
	}

	tmpl.Pan.toCenter = function (param) {
		var mapObj = param.map;
		// var point = ol.proj.transform([location[0], location[1]], 'EPSG:4326', 'EPSG:3857');


		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
			var point = ol.proj.fromLonLat([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
			//console.log(point);
		}
		else {
			var point = ol.proj.fromLonLat(ol.proj.transform([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)], 'EPSG:3857', 'EPSG:4326'));
			//var point = ol.proj.fromLonLat([parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)]);
			//console.log(point);
		}
		var pan = ol.animation.pan({
			duration: 3000,
			source: mapObj.getView().getCenter()
		});
		mapObj.beforeRender(pan);
		mapObj.getView().setCenter(point);
	}

	tmpl.Info.getPlace = function (param) {
		tmpl.Info.getPlaceFlag = true;
		tmpl.Info.getPlace.CallbackFunc = param.callbackFunc;
	}

	tmpl.Info.removeGetPlace = function () {
		tmpl.Info.getPlaceFlag = false;
		tmpl.Info.getPlace.CallbackFunc = function () { };
	}

	tmpl.Google.addTrafficLayer = function (param) {
		var mapObj = param.map;
		var gTrafficOn = mapObj.get('olgmObj');
		var gmap = gTrafficOn.getGoogleMapsMap();
		var trafficLayer = new google.maps.TrafficLayer();
		trafficLayer.setMap(gmap);
		mapObj.set('trafficLayerObj', trafficLayer);
	}
	tmpl.Google.removeTrafficLayer = function (param) {
		var mapObj = param.map;
		var gTrafcOff = mapObj.get('trafficLayerObj');
		if (gTrafcOff) {
			gTrafcOff.setMap(null);
		}
	}

	// ************************************ POI Creation *****************************************//
	tmpl.POI.getCategories = function () {
		var categories = [{ id: 1, text: 'Admimistrative Office' },
		{ id: 2, text: 'Airport' },
		{ id: 3, text: 'Ambulance Service' },
		{ id: 13, text: 'Apartment' },
		{ id: 4, text: 'Art Gallery' },
		{ id: 60, text: 'Atm' },
		{ id: 5, text: 'Auditorium' },
		{ id: 6, text: 'Bank' },
		{ id: 7, text: 'Blood Bank' },
		{ id: 8, text: 'Bus Stand' },
		{ id: 9, text: 'Categories' },
		{ id: 10, text: 'Checkpost' },
		{ id: 11, text: 'Cinema Theatre' },
		{ id: 12, text: 'Clinic' },
		{ id: 14, text: 'Companies' },
		{ id: 15, text: 'Court' },
		{ id: 16, text: 'Educational Institute' },
		{ id: 17, text: 'Educational Others' },
		{ id: 18, text: 'Fire Station' },
		{ id: 19, text: 'Garden' },
		{ id: 20, text: 'Govt Intstitutions' },
		{ id: 21, text: 'Govt Office' },
		{ id: 22, text: 'Helipads' },
		{ id: 23, text: 'Historical Places' },
		{ id: 24, text: 'Hospital' },
		{ id: 25, text: 'Hostel' },
		{ id: 26, text: 'Hotel Restaurant' },
		{ id: 27, text: 'Industrial Area' },
		{ id: 28, text: 'Information Centre' },
		{ id: 29, text: 'Jail' },
		{ id: 30, text: 'Jewellery Location' },
		{ id: 31, text: 'Library' },
		{ id: 32, text: 'Market' },
		{ id: 33, text: 'Medical Shop' },
		{ id: 34, text: 'Museum' },
		{ id: 35, text: 'Office' },
		{ id: 36, text: 'Other Police Installations' },
		{ id: 37, text: 'Others' },
		{ id: 38, text: 'Park' },
		{ id: 39, text: 'Parking Lot' },
		{ id: 40, text: 'Petrol Pump' },
		{ id: 41, text: 'Place Worship' },
		{ id: 42, text: 'Police Chowki' },
		{ id: 43, text: 'Police Head Quarters' },
		{ id: 44, text: 'Police Station' },
		{ id: 45, text: 'Postoffice' },
		{ id: 46, text: 'Prohibitedarea' },
		{ id: 47, text: 'Pub Bar' },
		{ id: 48, text: 'Railway Reservation Centre' },
		{ id: 49, text: 'Railway Track' },
		{ id: 50, text: 'Residence' },
		{ id: 61, text: 'Restaurant' },
		{ id: 51, text: 'Shelter Locations' },
		{ id: 52, text: 'Shopping Complex' },
		{ id: 53, text: 'Showroom' },
		{ id: 54, text: 'Stadium' },
		{ id: 55, text: 'Substation' },
		{ id: 56, text: 'Touristspot' },
		{ id: 57, text: 'Travel Agency' },
		{ id: 58, text: 'Vip Buildings' },
		{ id: 59, text: 'Waterbodies' }
		]
		return categories;
	}
	var POI_img_src = [{ id: 1, name: 'admimistrative_office', img_url: 'poi/civic_building.png' },
	{ id: 2, name: 'airport', img_url: 'poi/airport.png' },
	{ id: 3, name: 'ambulance_service', img_url: 'poi/others.png' },
	{ id: 4, name: 'art_gallery', img_url: 'poi/art_gallery.png' },
	{ id: 5, name: 'auditorium', img_url: 'poi/others.png' },
	{ id: 6, name: 'bank', img_url: 'poi/others.png' },
	{ id: 7, name: 'blood_bank', img_url: 'poi/others.png' },
	{ id: 8, name: 'bus_stand', img_url: 'poi/bus.png' },
	{ id: 9, name: 'categories', img_url: 'poi/others.png' },
	{ id: 10, name: 'checkpost', img_url: 'poi/others.png' },
	{ id: 11, name: 'cinema_theatre', img_url: 'poi/movies.png' },
	{ id: 12, name: 'clinic', img_url: 'poi/others.png' },
	{ id: 13, name: 'colony_apartment_guest_house_bungalow', img_url: 'poi/civic_building.png' },
	{ id: 14, name: 'companies', img_url: 'poi/others.png' },
	{ id: 15, name: 'court', img_url: 'poi/courthouse.png' },
	{ id: 16, name: 'educational_institute', img_url: 'poi/others.png' },
	{ id: 17, name: 'educational_others', img_url: 'poi/others.png' },
	{ id: 18, name: 'fire_station', img_url: 'poi/others.png' },
	{ id: 19, name: 'garden', img_url: 'poi/others.png' },
	{ id: 20, name: 'govt_intstitutions', img_url: 'poi/others.png' },
	{ id: 21, name: 'govt_office', img_url: 'poi/others.png' },
	{ id: 22, name: 'helipads', img_url: 'poi/others.png' },
	{ id: 23, name: 'historical_places', img_url: 'poi/historic.png' },
	{ id: 24, name: 'hospital', img_url: 'poi/doctor.png' },
	{ id: 25, name: 'hostel', img_url: 'poi/others.png' },
	{ id: 26, name: 'hotel_restaurant', img_url: 'poi/lodging.png' },
	{ id: 27, name: 'industrial_area', img_url: 'poi/others.png' },
	{ id: 28, name: 'information_centre', img_url: 'poi/others.png' },
	{ id: 29, name: 'jail', img_url: 'poi/others.png' },
	{ id: 30, name: 'jewellery_location', img_url: 'poi/jewelry.png' },
	{ id: 31, name: 'library', img_url: 'poi/library.png' },
	{ id: 32, name: 'market', img_url: 'poi/others.png' },
	{ id: 33, name: 'medical_shop', img_url: 'poi/others.png' },
	{ id: 34, name: 'museum', img_url: 'poi/museum.png' },
	{ id: 35, name: 'office', img_url: 'poi/others.png' },
	{ id: 36, name: 'other_police_installations', img_url: 'poi/others.png' },
	{ id: 37, name: 'others', img_url: 'poi/others.png' },
	{ id: 38, name: 'park', img_url: 'poi/amusement.png' },
	{ id: 39, name: 'parking_lot', img_url: 'poi/others.png' },
	{ id: 40, name: 'petrol_pump', img_url: 'poi/others.png' },
	{ id: 41, name: 'place_worship', img_url: 'poi/worship_general.png' },
	{ id: 42, name: 'police_chowki', img_url: 'poi/others.png' },
	{ id: 43, name: 'police_head_quarters', img_url: 'poi/others.png' },
	{ id: 44, name: 'police_station', img_url: 'poi/police.png' },
	{ id: 45, name: 'postoffice', img_url: 'poi/post_office.png' },
	{ id: 46, name: 'prohibitedarea', img_url: 'poi/others.png' },
	{ id: 47, name: 'pub_bar', img_url: 'poi/bar.png' },
	{ id: 48, name: 'railway_reservation_centre', img_url: 'poi/train.png' },
	{ id: 49, name: 'railway_track', img_url: 'poi/others.png' },
	{ id: 50, name: 'residence', img_url: 'poi/others.png' },
	{ id: 51, name: 'shlter_locations', img_url: 'poi/others.png' },
	{ id: 52, name: 'shopping_complex', img_url: 'poi/shopping.png' },
	{ id: 53, name: 'showroom', img_url: 'poi/others.png' },
	{ id: 54, name: 'stadium', img_url: 'poi/stadium.png' },
	{ id: 55, name: 'substation', img_url: 'poi/others.png' },
	{ id: 56, name: 'touristspot', img_url: 'poi/others.png' },
	{ id: 57, name: 'travel_agency', img_url: 'poi/others.png' },
	{ id: 58, name: 'vip_buildings', img_url: 'poi/others.png' },
	{ id: 59, name: 'waterbodies', img_url: 'poi/others.png' },
	{ id: 60, name: 'atm', img_url: 'poi/atm.png' },
	{ id: 61, name: 'restaurant', img_url: 'poi/supermarket.png' }]

	var drawVector_POI, draw_POI;
	tmpl.POI.clearIcon = function () {
		if (drawVector_POI != undefined)
			drawVector_POI.getSource().clear();
	}
	tmpl.POI.add = function (param) {
		var mapObj = param.map;
		tmpl.POI.clearInteractions({ map: mapObj });
		//var html = param.html;
		//var offset = param.offset;
		var callbackFunc = param.callbackFunc;

		var Layers = mapObj.getLayers();
		var noLayer = false;
		for (var i = 0; i < Layers.getLength(); i++) {
			var tempLayer = Layers.item(i);
			if (tempLayer.get('lname') === 'drawVector_POI') {
				noLayer = true;
			}
		}
		if (!noLayer) {
			drawVector_POI = new ol.layer.Vector({
				source: new ol.source.Vector(),
				style: new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: param.img_url
					})
				})
			});
			drawVector_POI.setProperties({ lname: "drawVector_POI" });
			mapObj.addLayer(drawVector_POI);
		}
		drawVector_POI.getSource().clear();
		mapObj.removeInteraction(draw_POI);
		//tmpl.Tooltip.remove({map : mapObj});
		draw_POI = new ol.interaction.Draw({
			// source: drawVector_POI.getSource(),
			type: "Point"
		});
		mapObj.addInteraction(draw_POI);
		draw_POI.on('drawend', function (event) {
			var feature = event.feature;
			var point_cor;
			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
				point_cor = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			}
			else {
				point_cor = feature.getGeometry().getCoordinates();
			}

			//	var point = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			feature.setProperties({ poi: "poi" });
			drawVector_POI.getSource().addFeature(feature);
			mapObj.removeInteraction(draw_POI);
			console.log("feature: ", feature);
			var point = {
				coordinates: point_cor
			};
			callbackFunc(point);

		});
	}
	var POI_Layer_save;
	tmpl.POI.save = function (param) {
		var mapObj = param.map;
		var poi_id = param.properties['POI_Category_Id'];
		var feature = drawVector_POI.getSource().getFeatures()[0];
		console.log("feature EDIT: ", feature);
		feature.setProperties(param.properties);
		feature.set('id', param.properties.POI_Id);
		var cor;
		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
			cor = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		}
		else {
			cor = feature.getGeometry().getCoordinates();
		}
		//var cor = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
		feature.set('Latitude', cor[1]);
		feature.set('Longitude', cor[0]);
		if (param.properties['img_url'] == 'none') {
			var img_src = appConfigInfo.poi_img_url + '/' + poi_id + '.png';
			feature.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 1],
					src: img_src
				}),
				text: new ol.style.Text({
					font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
					//textAlign:'center',
					offset: param.label.offset,
					text: param.properties['POI_Name'],
					fill: new ol.style.Fill({
						color: param.label.fill_color
					}),
					stroke: new ol.style.Stroke({
						color: param.label.stroke_color,
						width: param.label.width
					})
				})
			}));
		} else {
			feature.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 1],
					src: param.properties['img_url']
				}),
				text: new ol.style.Text({
					font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
					//textAlign:'center',
					offset: param.label.offset,
					text: param.properties['POI_Name'],
					fill: new ol.style.Fill({
						color: param.label.fill_color
					}),
					stroke: new ol.style.Stroke({
						color: param.label.stroke_color,
						width: param.label.width
					})
				})
			}));
		}
		if (POI_Layer_save_flag == false) {
			POI_Layer_save = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: [feature]
				})
			});
			mapObj.addLayer(POI_Layer_save);
			POI_Layer_save.setProperties({ lname: "POI_Layer_POI" });
			POI_Layer_save.setProperties({ title: "POI_Layer" });
			POI_Layer_save_flag = true;
		} else {
			POI_Layer_save.getSource().addFeature(feature);
		}
		tmpl.POI.clearIcon();
	}
	var intr;
	var POI_Layer = new ol.layer.Vector({ source: new ol.source.Vector() }), POI_Layer_flag = false, POI_Layer_save_flag = false, draw_POI_flag = false;

	tmpl.POI.clearAll = function () {
		POI_Layer.getSource().clear();
		if (POI_Layer_save != undefined)
			POI_Layer_save.getSource().clear();
	}

	tmpl.POI.showAll = function (param) {
		var mapObj = param.map;

		if (POI_Layer_save_flag == true)
			POI_Layer_save.getSource().clear();
		if (draw_POI_flag == true)
			mapObj.removeInteraction(draw_POI);
		tmpl.POI.clearIcon();
		tmpl.POI.clearInteractions({ map: mapObj });
		var pois = param.poi;
		var featureArray = [];
		for (var i = 0; i < pois.length; i++) {
			var poi_id = pois[i]['POI_Category_Id'];
			var img_src = appConfigInfo.poi_img_url + '/' + poi_id + '.png';
			//console.log(img_src);
			var cor;
			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
				cor = ol.proj.transform([pois[i]['Longitude'], pois[i]['Latitude']], 'EPSG:4326', 'EPSG:3857');
			}
			else {
				cor = [pois[i]['Longitude'], pois[i]['Latitude']];
			}
			// var cor = ol.proj.transform([pois[i]['Longitude'],pois[i]['Latitude']], 'EPSG:4326', 'EPSG:3857');
			var pointGeom = new ol.geom.Point(cor);
			var feature = new ol.Feature({
				geometry: pointGeom,
				Latitude: pois[i]['Latitude'],
				Longitude: pois[i]['Longitude'],
				POI_Category_Id: pois[i]['POI_Category_Id'],
				POI_Category_Name: pois[i]['POI_Category_Name'],
				POI_Id: pois[i]['POI_Id'],
				POI_Name: pois[i]['POI_Name'],
				img_url: pois[i]['img_url'],
				id: pois[i]['POI_Id'],
				layer_name: 'POI_Layer',
				lname: 'POI_Layer_POI'
			});
			//console.log(param.label.offset);
			//console.log(pois[i]['img_url'] == 'none');
			if (pois[i]['img_url'] == 'none') {
				feature.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: img_src
					}),
					text: new ol.style.Text({
						font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
						textAlign: 'center',
						offset: param.label.offset,
						text: pois[i]['POI_Name'],
						fill: new ol.style.Fill({
							color: param.label.fill_color
						}),
						stroke: new ol.style.Stroke({
							color: param.label.stroke_color,
							width: param.label.width
							//width : 8
						})
					})
				})
				);
			} else {
				feature.setStyle(new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1],
						src: pois[i]['img_url']
					}),
					text: new ol.style.Text({
						font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
						textAlign: 'center',
						offset: param.label.offset,
						text: pois[i]['POI_Name'],
						fill: new ol.style.Fill({
							color: param.label.fill_color
						}),
						stroke: new ol.style.Stroke({
							color: param.label.stroke_color,
							width: param.label.width
						})
					})
				})
				);
			}
			featureArray.push(feature);
		}
		//alert("before layer creation");
		if (POI_Layer_flag == false) {
			//alert("create layer");
			POI_Layer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: featureArray
				})
			});
			POI_Layer.setProperties({ lname: "POI_Layer_POI" });
			POI_Layer.setProperties({ title: "POI_Layer" });
			//mapObj.addLayer(POI_Layer);
			POI_Layer.setMap(mapObj);
			tmpl_setMap_layer_global.push({
				layer: POI_Layer,
				title: 'POI_Layer',
				visibility: true,
				map: mapObj
			});
			POI_Layer_flag = true;
			//}

		} else {
			//alert("existing layer-update data");
			for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
				if (tmpl_setMap_layer_global[j].title == "POI_Layer") {
					tmpl_setMap_layer_global[j].layer.getSource().clear();
					tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureArray);
				}
			}
			//POI_Layer.getSource().clear();
			//POI_Layer.getSource().addFeatures(featureArray);
		}
		//mapObj.addLayer(POI_Layer);


	}
	tmpl.POI.saveEdit = function (param) {
		var mapObj = param.map;
		if (POI_Layer_save_flag == true) {
			for (var i = 0; i < POI_Layer_save.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer_save.getSource().getFeatures()[i];
				if (existingFeature.get('POI_Id') == param.properties.POI_Id) {
					var poi_id = param.properties['POI_Category_Id'];
					var img_src = appConfigInfo.poi_img_url + '/' + poi_id + '.png';
					if (param.properties['img_url'] == 'none') {
						existingFeature.setStyle(new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 1],
								src: img_src
							}),
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
								textAlign: 'center',
								offset: param.label.offset,
								text: param.properties['POI_Name'],
								fill: new ol.style.Fill({
									color: param.label.fill_color
								}),
								stroke: new ol.style.Stroke({
									color: param.label.stroke_color,
									width: param.label.width
								})
							})
						}));
						existingFeature.set("POI_Name", param.properties['POI_Name']);
						existingFeature.set("POI_Category_Id", param.properties['POI_Category_Id']);
						existingFeature.set("POI_Category_Name", param.properties['POI_Category_Name']);
						var cor;
						if (appConfigInfo.mapData === 'google' || 'hereMaps') {
							cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						}
						else {
							cor = existingFeature.getGeometry().getCoordinates();
						}
						//var cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						existingFeature.set("Latitude", cor[1]);
						existingFeature.set("Longitude", cor[0]);

					} else {

						existingFeature.setStyle(new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 1],
								src: param.properties['img_url']
							}),
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
								textAlign: 'center',
								offset: param.label.offset,
								text: param.properties['POI_Name'],
								fill: new ol.style.Fill({
									color: param.label.fill_color
								}),
								stroke: new ol.style.Stroke({
									color: param.label.stroke_color,
									width: param.label.width
								})
							})
						}));
						existingFeature.set("POI_Name", param.properties['POI_Name']);
						existingFeature.set("POI_Category_Id", param.properties['POI_Category_Id']);
						existingFeature.set("POI_Category_Name", param.properties['POI_Category_Name']);
						var cor;
						if (appConfigInfo.mapData === 'google' || 'hereMaps') {
							cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						}
						else {
							cor = existingFeature.getGeometry().getCoordinates();
						}
						//var cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						existingFeature.set("Latitude", cor[1]);
						existingFeature.set("Longitude", cor[0]);
					}
				}
			}
			var features = POI_Layer_save.getSource().getFeatures();
			POI_Layer_save.getSource().clear();
			POI_Layer_save.getSource().addFeatures(features);
		}
		if (POI_Layer_flag == true) {
			for (var i = 0; i < POI_Layer.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer.getSource().getFeatures()[i];
				if (existingFeature.get('POI_Id') == param.properties.POI_Id) {
					var poi_id = param.properties['POI_Category_Id'];
					var img_src = appConfigInfo.poi_img_url + '/' + poi_id + '.png';
					if (param.properties['img_url'] == 'none') {
						existingFeature.setStyle(new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 1],
								src: img_src
							}),
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
								textAlign: 'center',
								offset: param.label.offset,
								text: param.properties['POI_Name'],
								fill: new ol.style.Fill({
									color: param.label.fill_color
								}),
								stroke: new ol.style.Stroke({
									color: param.label.stroke_color,
									width: param.label.width
								})
							})
						}));
						existingFeature.set("POI_Name", param.properties['POI_Name']);
						existingFeature.set("POI_Category_Id", param.properties['POI_Category_Id']);
						existingFeature.set("POI_Category_Name", param.properties['POI_Category_Name']);
						var cor;
						if (appConfigInfo.mapData === 'google' || 'hereMaps') {
							cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						}
						else {
							cor = existingFeature.getGeometry().getCoordinates();
						}
						//var cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						existingFeature.set("Latitude", cor[1]);
						existingFeature.set("Longitude", cor[0]);
					} else {

						existingFeature.setStyle(new ol.style.Style({
							image: new ol.style.Icon({
								anchor: [0.5, 1],
								src: param.properties['img_url']
							}),
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '10px' + ' ' + 'Verdana',
								textAlign: 'center',
								offset: param.label.offset,
								text: param.properties['POI_Name'],
								fill: new ol.style.Fill({
									color: param.label.fill_color
								}),
								stroke: new ol.style.Stroke({
									color: param.label.stroke_color,
									width: param.label.width
								})
							})
						}));
						existingFeature.set("POI_Name", param.properties['POI_Name']);
						existingFeature.set("POI_Category_Id", param.properties['POI_Category_Id']);
						existingFeature.set("POI_Category_Name", param.properties['POI_Category_Name']);
						var cor;
						if (appConfigInfo.mapData === 'google' || 'hereMaps') {
							cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						}
						else {
							cor = existingFeature.getGeometry().getCoordinates();
						}
						//var cor = ol.proj.transform(existingFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
						existingFeature.set("Latitude", cor[1]);
						existingFeature.set("Longitude", cor[0]);
					}
				}
			}
			var features = POI_Layer.getSource().getFeatures();
			POI_Layer.getSource().clear();
			POI_Layer.getSource().addFeatures(features);
		}
		previousEditFeture = undefined;
		mapObj.removeInteraction(intr);
	}



	tmpl.POI.saveApprovedPOI = function (param) {
		var datas = param.data;
		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/incClientPoi/" + datas.name + "/" + datas.category + "/" + datas.latitude + "/" + datas.longitude + "/" + datas.category_id + "/1/ghhh/0";
		$.ajax({
			url: urlL,
			success: function (data) {
				console.log(data);
			},
			error: function (jqxhr) {
				//alert("saveApprovedPOI not working");
			}
		});
	}

	tmpl.Overlay.displayApprovedPOI = function (param) {
		var mapObj = param.map;
		var layerName = param.layer;
		var img_url = param.img_url;
		var label_color = param.label_color;
		var label_bgcolor = param.label_bgcolor;
		if (label_color == undefined)
			label_color = "#fff";

		if (label_bgcolor == undefined)
			label_bgcolor = "#000";

		var objNew = [];
		var layerApprovedPOI = [];
		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/ClientPoi";
		$.ajax({
			type: 'GET',
			url: urlL,
			success: function (data) {
				for (var i = 0; i < data.length; i++) {
					objNew[i] = {};
					var obj = data[i];
					objNew[i].id = obj.id;
					objNew[i].name = obj.name;
					objNew[i].lat = obj.latitude;
					objNew[i].lon = obj.longitude;
					objNew[i].category = obj.category;
					objNew[i].category_id = obj.category_id;
					objNew[i].approved = obj.approved;
					objNew[i].is_rejected = obj.is_rejected;
					objNew[i].create_datetime = obj.create_datetime;
					objNew[i].img_url = img_url;
					objNew[i].label = obj.name;
					layerApprovedPOI.push(objNew[i]);
				}

				var jsonobj = layerApprovedPOI;

				var getdata = jsonobj;
				var featureDataAry = [];
				for (var i = 0, length = getdata.length; i < length; i++) {
					var geometry;
					var iconStyle = new ol.style.Icon(({
						src: getdata[i].img_url,
						anchor: [0.5, 1]
					}));
					if (appConfigInfo.mapData === 'google' || 'hereMaps') {
						geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
					}
					else {
						var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
						geometry = new ol.geom.Point(coordinate);
					}
					var featureval = new ol.Feature({
						geometry: geometry
					});
					featureval.setProperties(getdata[i]);
					featureval.setStyle(new ol.style.Style({
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						image: iconStyle,
						text: new ol.style.Text({
							font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
							textAlign: 'center',
							text: getdata[i].name,
							fill: new ol.style.Fill({
								color: label_color,
								width: 20
							}),
							stroke: new ol.style.Stroke({
								color: label_bgcolor,
								width: 6
							})
						})
					}));
					featureval.set('layer_name', layerName);
					featureDataAry.push(featureval);
				}
				var source = new ol.source.Vector({
					features: featureDataAry
				});
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var OverlayisLayerPresent = false;
				for (var i = 0; i < length; i++) {
					var layerTemp = Layers.item(i);
					//console.log(layerTemp.get('title') , layerName);
					if (layerTemp.get('title') == layerName) {
						OverlayisLayerPresent = true;
						layerTemp.getSource().addFeatures(featureDataAry);
					}
				}
				if (OverlayisLayerPresent == false) {
					var overlay = new ol.layer.Vector({
						title: layerName,
						visible: true,
						source: source
					});
					mapObj.addLayer(overlay);
					OverlayisLayerPresent = true;
				}

			},
			error: function (jqxhr) {
				//alert("load ApprovedPOI not working");
			}
		});
	}



	tmpl.POI.cancelEdit = function (param) {

		var mapObj = param.map;
		//console.log(POI_Layer_save_flag,POI_Layer_flag);
		if (POI_Layer_save_flag == true) {
			for (var i = 0; i < POI_Layer_save.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer_save.getSource().getFeatures()[i];
				//console.log(POI_Layer_save.getSource().getFeatures().length);
				if (existingFeature.get('POI_Id') == param.POI_Id) {
					//console.log(existingFeature.getProperties());
					var latitude = existingFeature.get('Latitude');
					var longitude = existingFeature.get('Longitude');
					var cor;
					if (appConfigInfo.mapData === 'google' || 'hereMaps') {
						cor = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
					}
					else {
						cor = [longitude, latitude];
					}
					//var cor = ol.proj.transform([longitude,latitude], 'EPSG:4326', 'EPSG:3857');
					existingFeature.getGeometry().setCoordinates(cor);
				}
			}
			// var features = POI_Layer_save.getSource().getFeatures();
			// POI_Layer_save.getSource().clear();
			// POI_Layer_save.getSource().addFeatures(features);
		}
		if (POI_Layer_flag == true) {
			for (var i = 0; i < POI_Layer.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer.getSource().getFeatures()[i];
				//console.log(existingFeature.get('POI_Id'),param.POI_Id);
				if (existingFeature.get('POI_Id') == param.POI_Id) {
					//console.log(existingFeature.getProperties());
					var latitude = existingFeature.get('Latitude');
					var longitude = existingFeature.get('Longitude');
					var cor;
					if (appConfigInfo.mapData === 'google' || 'hereMaps') {
						cor = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
					}
					else {
						cor = [longitude, latitude];
					}
					//var cor = ol.proj.transform([longitude,latitude], 'EPSG:4326', 'EPSG:3857');
					existingFeature.getGeometry().setCoordinates(cor);
				}
			}
			// var features = POI_Layer.getSource().getFeatures();
			// POI_Layer.getSource().clear();
			// POI_Layer.getSource().addFeatures(features);
		}
		mapObj.removeInteraction(intr);
	}
	tmpl.POI.edit = function (param) {
		var mapObj = param.map;
		mycallback = param.callbackFunc;
		var point, editFeature, coordinate, previousEditFeture = undefined;
		if (draw_POI != undefined)
			tmpl.POI.clearInteractions({ map: mapObj });
		var coordinates, lonlat;
		var wktGeom;
		var format = new ol.format.WKT();
		//tmpl.Tooltip.remove({map : mapObj});
		window.app = {};
		var app = window.app;

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
					if (layer == null) {
						if (feature.get('lname') == 'POI_Layer_POI') {
							return feature;
						}
					} else if (layer.get('lname') == "POI_Layer_POI") {
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
					if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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
			if (previousEditFeture != undefined) {
				if (previousEditFeture.get('POI_Id') == editFeature.get('POI_Id')) {

				} else {
					var poi_id = previousEditFeture.get('POI_Id');
					//console.log(poi_id);
					tmpl.POI.cancelEdit({
						map: mapObj,
						POI_Id: poi_id
					});
					mapObj.addInteraction(intr);
				}

			}

			// if(previousEditFeture != undefined){
			// if(previousEditFeture.get('POI_Id') != editFeature.get('POI_Id'))
			// previousEditFeture = editFeature;
			// else
			// previousEditFeture =  undefined;
			// }else{
			previousEditFeture = editFeature;
			//}

			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
				coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
				wktGeom = format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coordinate = lonlat.getCoordinates();
				wktGeom = format.writeGeometry(lonlat);
				//  wktGeom= format.writeGeometry(this.feature_.getGeometry());
			}
			var properties = {};

			for (var i = 0; i < editFeature.getKeys().length; i++) {
				var key = Object.keys(editFeature.getProperties())[i];
				if (key != "geometry" && key != "poi") {
					properties[key] = editFeature.get(key);
				}
			}
			var result = {
				new_coordinates: coordinate,
				properties: properties,
			};

			mycallback(result);
			this.coordinate_ = null;
			this.feature_ = null;
			return false;
		};
		intr = new app.Drag();
		mapObj.addInteraction(intr);

	}
	tmpl.POI.delete = function (param) {
		var mapObj = param.map;
		var callbackFunc = param.callbackFunc;
		tmpl.POI.clearInteractions({ map: mapObj });
		tmpl.mapOnClickExtraForPOIDelete = function (evt) {
			var pixel = mapObj.getEventPixel(evt.originalEvent);
			if (mapObj.hasFeatureAtPixel(pixel)) {
				var layerName;
				var coordinate = evt.coordinate;
				var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
					if (layer) {
						if (layer.get('lname') == "POI_Layer_POI") {
							return feature;
						} else {
							return "no feature";
						}
					} else {
						if (feature.get('lname') == 'POI_Layer_POI') {
							return feature;
						}
					}
				});
				//console.log(feature);
				if (feature != "no feature") {
					var properties = {};
					for (var i = 0; i < feature.getKeys().length; i++) {
						var key = Object.keys(feature.getProperties())[i];
						if (key != "geometry" && key != "poi") {
							properties[key] = feature.get(key);
						}
					}
					//mapObj.un('click',tmpl.mapOnClickExtraForPOIDelete);
					callbackFunc(properties);
				}
			}
		};
		mapObj.on('click', tmpl.mapOnClickExtraForPOIDelete);
	}
	tmpl.POI.saveDelete = function (param) {
		var mapObj = param.map;
		if (POI_Layer_save_flag == true) {
			for (var i = 0; i < POI_Layer_save.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer_save.getSource().getFeatures()[i];
				if (existingFeature.get('POI_Id') == param.POI_Id) {
					POI_Layer_save.getSource().removeFeature(existingFeature);
				}
			}
		}
		if (POI_Layer_flag == true) {
			for (var i = 0; i < POI_Layer.getSource().getFeatures().length; i++) {
				var existingFeature = POI_Layer.getSource().getFeatures()[i];
				if (existingFeature.get('POI_Id') == param.POI_Id) {
					POI_Layer.getSource().removeFeature(existingFeature);
				}
			}
		}
		mapObj.un('click', tmpl.mapOnClickExtraForPOIDelete);
	}
	tmpl.POI.cancelDelete = function (param) {
		var mapObj = param.map;
		mapObj.un('click', tmpl.mapOnClickExtraForPOIDelete);
	}

	tmpl.POI.clearInteractions = function (param) {
		var mapObj = param.map;
		mapObj.removeInteraction(draw_POI);
		mapObj.removeInteraction(draw);
		mapObj.removeInteraction(drawm);
		mapObj.removeInteraction(intr);
		mapObj.un('click', tmpl.mapOnClickExtraForPOIDelete);
	}



	////center map here 

	tmpl.ContextMenu.MapToCenter = function (param) {
		var mapObj = param.map;
		var obj = param.obj;
		var view = mapObj.getView();
		view.setCenter(obj.coordinate);
	}

	// context menu starts
	var contextMenuGteCoordinate = [];
	tmpl.ContextMenu.create = function (param) {
		var mapObj = param.map;
		var menu_items = param.menu_items;

		contextmenuobj = new ContextMenu({
			width: 170,
			default_items: false, //default_items are (for now) Zoom In/Zoom Out
			items: menu_items
		});
		mapObj.addControl(contextmenuobj);
		contextmenuobj.on('open', function (evt) {
			if (appConfigInfo.mapData == "google" || 'hereMaps') {
				contextMenuGteCoordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			}
			else {
				contextMenuGteCoordinate = evt.coordinate;
			}

		});
		return contextmenuobj;
	}

	tmpl.ContextMenu.addMenu = function (param) {
		var add_menu = param.add_menu;
		contextmenuobj.extend(add_menu);
	}

	tmpl.ContextMenu.clearMenu = function () {
		contextmenuobj.clear();
		$(".ol-ctx-menu-container").html("");
	}
	tmpl.ContextMenu.closeMenu = function () {
		contextmenuobj.close();
	}

	tmpl.ContextMenu.addMapToCenter = function (param) {
		var add_menu = param.add_menu;
		contextmenuobj.extend(add_menu);
	}

	tmpl.ContextMenu.singleGetCoordinate = function () {
		return contextMenuGteCoordinate;
	}

	tmpl.ContextMenu.getCoordinate = function (contextmenuobj, myCallBack) {
		contextmenuobj.on('open', function (evt) {
			if (appConfigInfo.mapData == "google" || 'hereMaps') {
				coordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			}
			else {
				coordinate = evt.coordinate;
			}
			myCallBack(coordinate); //new
		});
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
				if (appConfigInfo.mapData == 'google' || 'hereMaps')
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
				else
					pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:4326');


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
							if (appConfigInfo.mapData == 'google' || 'hereMaps')
								parent.previousP = ol.proj.transform(parent.previousP, 'EPSG:4326', 'EPSG:3857');

							else
								parent.previousP = ol.proj.transform(parent.previousP, 'EPSG:4326', 'EPSG:4326');


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
							if (appConfigInfo.mapData == 'google' || 'hereMaps')
								current = ol.proj.transform(parent.currentP, 'EPSG:4326', 'EPSG:3857');
							else
								current = ol.proj.transform(parent.currentP, 'EPSG:4326', 'EPSG:4326');

							var line = new ol.geom.LineString([parent.previousP, current]);
							var fea = new ol.Feature(line);
							parent.track_line_layer.getSource().addFeature(fea);
							parent.previousP = current;
						}
						if (parent.markerFlag == false) {
							var pt = [];
							pt[0] = newEndPt[0];
							pt[1] = newEndPt[1];
							if (appConfigInfo.mapData == 'google' || 'hereMaps')
								pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:3857');
							else
								pt = ol.proj.transform([pt[0], pt[1]], 'EPSG:4326', 'EPSG:4326');


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
							parent.multipleTrackMapZoom(parent);
							if (isNaN(angle) == false)
								parent.track_end_marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
							if (appConfigInfo.mapData == 'google' || 'hereMaps')
								parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
							else
								parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:4326'));
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

		this.map.unByKey(pointerMoveID);												// Added on 23-10-19 by Prashanth to disable pointer move function 

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


			// From here for delay
			var delayTextDiv = document.createElement('div');
			delayTextDiv.innerHTML = "<b>Delay</b>";
			delayTextDiv.id = "delayTextDiv";
			delayTextDiv.style.margin = "auto";
			delayTextDiv.style.marginLeft = "10px";
			toggleLayersDiv.appendChild(delayTextDiv);

			var trackdelayDropdown = document.createElement('select');
			trackdelayDropdown.id = "trackdelayDropdown";
			trackdelayDropdown.onchange = trackDelayOnChange;
			trackdelayDropdown.style.marginLeft = "4px";
			toggleLayersDiv.appendChild(trackdelayDropdown);
			var trackDelayoption1 = document.createElement('option');
			trackDelayoption1.innerHTML = "none";
			trackDelayoption1.value = "-1";
			trackdelayDropdown.appendChild(trackDelayoption1);
			var trackDelayoption2 = document.createElement('option');
			trackDelayoption2.innerHTML = "1 min";
			trackDelayoption2.value = "60";
			trackdelayDropdown.appendChild(trackDelayoption2);
			var trackDelayoption3 = document.createElement('option');
			trackDelayoption3.innerHTML = "2 mins";
			trackDelayoption3.value = "120";
			trackdelayDropdown.appendChild(trackDelayoption3);
			var trackDelayoption4 = document.createElement('option');
			trackDelayoption4.innerHTML = "3 mins";
			trackDelayoption4.value = "180";
			trackdelayDropdown.appendChild(trackDelayoption4);


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
			infoTableRowsDiv.innerHTML = '<table><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Vehicle No</td><td id= "trackresourceDiv"></td><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Vehicle Type</td><td id= "trackcallSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Position</td><td id= "trackpositionDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Speed</td><td id= "trackspeedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Location</td><td id= "tracklocationDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 65px;">Time</td><td id="trackdateTimeDiv"></td></tr></table>';

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

		//tmpl.Layer.changeVisibility({map: this.map, layer: 'track_line', visible: true});
		// tmpl.Layer.changeVisibility({map: this.map, layer: 'track_layer', visible: true});
		try {
			var checkStatus = document.getElementById("trackcheckrouteline").checked;
			if (checkStatus === false) {
				//alert("checkStatus=false");
				//tmpl.Layer.changeVisibility({map: mapObjDyn, layer: 'track_line', visible: false});
				trackVehicleObjDyn.routeLayer({
					map: mapObjDyn,
					visibility: false
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
			else {
				//alert("checkStatus=true");
				//tmpl.Layer.changeVisibility({map: mapObjDyn, layer: 'track_line', visible: true});
				console.log("this.track_line_layer:", this.track_line_layer);
				trackVehicleObjDyn.routeLayer({
					map: mapObjDyn,
					visibility: true
				});
				tmpl.Map.resize({ map: mapObjDyn });
			}
		}
		catch (err) {
			console.log(trackVehicleObjDyn);
			console.error(err)
		}

	}
	function resourcevisibility() {
		try {
			var checkStatus = document.getElementById("trackcheckresource").checked;
			if (checkStatus === false) {
				// console.log("trackVehicleObjDyn:",trackVehicleObjDyn.routeVehicle);
				trackVehicleObjDyn.routeVehicle({
					map: mapObjDyn,
					visibility: false
				});
				tmpl.Map.resize({ map: mapObjDyn });

			}
			else {
				//console.log("trackVehicleObjDyn:",trackVehicleObjDyn.routeVehicle);
				trackVehicleObjDyn.routeVehicle({
					map: mapObjDyn,
					visibility: true
				});
				tmpl.Map.resize({ map: mapObjDyn });

			}
		}
		catch (err) {
			console.log(trackVehicleObjDyn);
			console.error(err);
		}

	}
	function infoboxvisibility() {
		try {
			var checkStatus = document.getElementById("trackcheckinfobox").checked;
			if (checkStatus === false) {
				document.getElementById("trackinfoTable").style.visibility = "hidden";
			}
			else {
				document.getElementById("trackinfoTable").style.visibility = "visible";
			}
		}
		catch (err) {
			console.log(trackVehicleObjDyn);
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
			//alert(this.first_time_zoom_flag);
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.first_time_zoom_flag);
			if (this.first_time_zoom_flag === false) {
				//alert(skipedVehicleFlag);
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>++++++", this.skipedVehicleFlag);
				if (this.skipedVehicleFlag != true) {

					var pt1 = point;
					console.log("this.previousData[0][0]:::", this.previousData[0][0]);
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
							var temp = newEndPt;														// Changed by Prashanth
							temp = ol.proj.transform(temp, 'EPSG:4326', 'EPSG:3857');					// Changed by Prashanth
							// parent.previousP[0] = newEndPt[0];										// Commented by Prashanth
							// parent.previousP[1] = newEndPt[1];										// Commented by Prashanth					
							parent.previousP[0] = temp[0];												// Changed by Prashanth
							parent.previousP[1] = temp[1];												// Changed by Prashanth

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
								current = ol.proj.transform(current, 'EPSG:4326', 'EPSG:4326');
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
									.format(
										"DD-MM-YYYY hh:mm:ss A")
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
							if (appConfigInfo.mapData == "google") {
								if (parent.track_end_marker.getSource().getFeatures().length > 0) {
									parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
								}
								else { }
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





	// layer switcher starts 

	var pentaBlayerDeveloperCategories =
		[
			{
				"id": 1,
				"text": 'أ سي يو د',
				"children": [
					{
						"id": 1,
						"text": "منطقة", "layerName": "ACUD_ICT:au_district"
					},
					{
						"id": 2,
						"text": 'معالم', "layerName": "ACUD_ICT:au_landmarks"
					},
					{
						"id": 3,
						"text": 'منطقة الخطر', "layerName": "ACUD_ICT:ccc_hazard_area"
					},
					{
						"id": 4,
						"text": 'بنية تحتية حرجة', "layerName": "ACUD_ICT:ccc_critical_infrastructure"
					},
					{
						"id": 5,
						"text": 'حواف الطريق', "layerName": "ACUD_ICT:tn_road_edges"
					},
					{
						"id": 6,
						"text": 'رابط الطريق', "layerName": "transport_road:TN.RoadLink"
					},
					{
						"id": 7,
						"text": 'الطريق هو الأراضي', "layerName": "base:Base.RoadIslands"
					}

				]
			}
		];

	var pentaBlayerCategories = [
		{ id: 1, name: 'ACUD_ICT:au_district' },
		{ id: 2, name: 'ACUD_ICT:au_landmarks' },
		{ id: 3, name: 'ACUD_ICT:ccc_hazard_area' },
		{ id: 4, name: 'ACUD_ICT:ccc_critical_infrastructure' },
		{ id: 5, name: 'ACUD_ICT:tn_road_edges' },
		{ id: 6, name: 'transport_road:TN.RoadLink' },
		{ id: 7, name: 'base:Base.RoadIslands' }
	];

	var layerDeveloperCategories = [
		{ "id": 25, "text": 'Administrative', "children": [{ "id": 1, "text": 'Country' }, { "id": 2, "text": 'Province' }, { "id": 3, "text": 'Locality' }, { "id": 4, "text": 'Neighborhood' }, { "id": 5, "text": 'Land parcel' }] },
		{ "id": 26, "text": ' Landscape', "children": [{ "id": 6, "text": 'Man-made' }, { "id": 27, "text": 'Natural', "state": "closed", "children": [{ "id": 7, "text": 'Landcover' }, { "id": 8, "text": 'Terrain' }] }] },
		{ "id": 28, "text": 'Points of interest', "children": [{ "id": 9, "text": 'Attraction' }, { "id": 10, "text": 'Business' }, { "id": 11, "text": 'Government' }, { "id": 12, "text": 'Medical' }, { "id": 13, "text": 'Park' }, { "id": 14, "text": 'Place of worship' }, { "id": 15, "text": 'School' }, { "id": 16, "text": 'Sports complex' }] },
		{ "id": 29, "text": 'Road', "children": [{ "id": 17, "text": 'Highway', "state": "closed", "children": [{ "id": 30, "text": 'Controlled Access' }] }, { "id": 18, "text": 'Arterial' }, { "id": 19, "text": 'Local' }] },
		{ "id": 31, "text": 'Transit', "children": [{ "id": 20, "text": 'Line' }, { "id": 32, "text": 'Station', "state": "closed", "children": [{ "id": 21, "text": 'Airport' }, { "id": 22, "text": 'Bus' }, { "id": 23, "text": 'Rail' }] },] },
		{ "id": 24, "text": 'Water', "children": [] }];

	var layerDeveloperCategoriesTrinity = [], geoserver_layer_name_trinity = [], layer_group_related_layer_id = [];
	var getTrinityLayerSwitcherData;

	tmpl.LayerSwitcher.getLayers = function (param) {
		getTrinityLayerSwitcherData = param.callbackFunc;
		if (layerDeveloperCategoriesTrinity.length > 0)
			getTrinityLayerSwitcherData(layerDeveloperCategoriesTrinity);
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			return layerDeveloperCategories;
		} else {
			return pentaBlayerDeveloperCategories;
		}
	}
	function getTrinityLayersList(mapObj) {
		var result = []; var geoserver_layer_name = []; var layer_unique_id = 1, layer_group_related_layer_id1 = [];
		$.ajax({
			url: "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/layer/layermeta/active",
			type: 'GET',
			success: function (response) {
				var test = response;
				$.ajax({
					url: "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/layer/layergroups/",
					type: 'GET',
					success: function (response) {
						var test1 = response;
						for (var i = 0; i < test1.length; i++) {
							result[i] = {};
							result[i].id = test1[i].group_id;
							result[i].text = test1[i].group_name;
							result[i].children = [];
							layer_group_related_layer_id1[i] = {};
							layer_group_related_layer_id1[i].group_id = test1[i].group_id;
							layer_group_related_layer_id1[i].layers = [];
							for (var j = 0; j < test.length; j++) {
								if (test[j].layer_group_id == test1[i].group_id) {
									var x = result[i].children.length;
									result[i].children[x] = {};
									result[i].children[x].id = layer_unique_id;
									result[i].children[x].text = test[j].layer_display_name;
									var y = geoserver_layer_name.length;
									geoserver_layer_name[y] = {};
									geoserver_layer_name[y].id = layer_unique_id;
									geoserver_layer_name[y].text = test[j].layer;

									var z = layer_group_related_layer_id1[i].layers.length;
									layer_group_related_layer_id1[i].layers[z] = {};
									layer_group_related_layer_id1[i].layers[z].id = layer_unique_id;

									layer_group_related_layer_id = layer_group_related_layer_id1;
									layer_unique_id = layer_unique_id + 1;
								}
							}
						}
						geoserver_layer_name_trinity = geoserver_layer_name;
						create_trinity_layers_objects(mapObj);
						layerDeveloperCategoriesTrinity = result;
						//console.log(getTrinityLayerSwitcherData);
						if (getTrinityLayerSwitcherData != undefined)
							getTrinityLayerSwitcherData(layerDeveloperCategoriesTrinity);

					}
				});
			}
		});

	}

	var layerCategories = [/*{ id:25, name:'administrative' },*/
		{ id: 1, name: 'administrative.country' },
		{ id: 2, name: 'administrative.province' },
		{ id: 3, name: 'administrative.locality' },
		{ id: 4, name: 'administrative.neighborhood' },
		{ id: 5, name: 'administrative.land_parcel' },
		/*{ id:26, name:'landscape' },*/
		{ id: 6, name: 'landscape.man_made' },
		/*{ id:27, name:'landscape.natural' },*/
		{ id: 7, name: 'landscape.natural.landcover' },
		{ id: 8, name: 'landscape.natural.terrain' },
		/*{ id:28, name:'poi' },*/
		{ id: 9, name: 'poi.attraction' },
		{ id: 10, name: 'poi.business' },
		{ id: 11, name: 'poi.government' },
		{ id: 12, name: 'poi.medical' },
		{ id: 13, name: 'poi.park' },
		{ id: 14, name: 'poi.place_of_worship' },
		{ id: 15, name: 'poi.school' },
		{ id: 16, name: 'poi.sports_complex' },
		{ id: 29, name: 'road' },
		{ id: 17, name: 'road.highway' },
		/*{ id:30, name:'road.highway.controlled_access' },*/
		{ id: 18, name: 'road.arterial' },
		{ id: 19, name: 'road.local' },
		/*{ id:31, name:'transit'},*/
		{ id: 20, name: 'transit.line' },
		/*{ id:32, name:'transit.station' },*/
		{ id: 21, name: 'transit.station.airport' },
		{ id: 22, name: 'transit.station.bus' },
		{ id: 23, name: 'transit.station.rail' },
		{ id: 24, name: 'water' }];


	tmpl.LayerSwitcher.switcher = function (param) {
		var layersObj = param.layer;
		var mapObj = param.map;
		var res = layersObj;
		var glayerId = [];
		var onoffswitch = [];
		var on_layers_trinity = [];

		for (var i = 0, length = res.length; i < length; i++) {
			glayerId.push(res[i].layerId);
		}
		if (appConfigInfo.mapData === "google" || appConfigInfo.mapData === 'hereMaps') {
			for (var j = 0; j < layerCategories.length; j++) {
				if (glayerId.indexOf(layerCategories[j].id) == -1) {
					onoffswitch[j] = "off";
				} else {
					if (res[glayerId.indexOf(layerCategories[j].id)].status == "on") {
						console.log("onoffswitch[j]::layerCategories[j].id::", res[glayerId.indexOf(layerCategories[j].id)], layerCategories[j].id, "on", onoffswitch[j]);
						onoffswitch[j] = "on";
						console.log("onoffswitch[j] ::", onoffswitch[j]);
					} else {
						console.log("onoffswitch[j]::layerCategories[j].id::", res[glayerId.indexOf(layerCategories[j].id)], layerCategories[j].id, "off", onoffswitch[j]);
						onoffswitch[j] = "off";
						console.log("onoffswitch[j] ::", onoffswitch[j]);
					}
				}
			}
			console.log("onoffswitch::", onoffswitch);
			switchGoogleLayers(mapObj, onoffswitch);
		}
		else {
			console.log("layersObj:", layersObj);
			for (var j = 0; j < pentaBlayerCategories.length; j++) {
				if (glayerId.indexOf(pentaBlayerCategories[j].id) == -1) {

					console.log("Selected ID-Off:", pentaBlayerCategories[j].name);

					//onoffswitch[j] = "off";
					tmpl.Map.switchWMSLayerVisibility({ map: mapObj, layerTitle: pentaBlayerCategories[j].name, visible: false });
					tmpl.Map.removeWMSLayer({ map: mapObj, layerTitle: pentaBlayerCategories[j].name });
				} else {
					if (res[glayerId.indexOf(pentaBlayerCategories[j].id)].status == "on") {

						//onoffswitch[j] = "on";
						console.log("Selected ID-On:", pentaBlayerCategories[j].name);
						tmpl.Map.addWMSLayer({ map: mapObj, layerUrl: appConfigInfo.pentaBMapserverURL, layerName: pentaBlayerCategories[j].name, layerTitle: pentaBlayerCategories[j].name });
						tmpl.Map.switchWMSLayerVisibility({ map: mapObj, layerTitle: pentaBlayerCategories[j].name, visible: true });

					} else {

						//onoffswitch[j] = "off";
						console.log("Selected ID-Off:", pentaBlayerCategories[j].name);
						tmpl.Map.switchWMSLayerVisibility({ map: mapObj, layerTitle: pentaBlayerCategories[j].name, visible: false });
						tmpl.Map.removeWMSLayer({ map: mapObj, layerTitle: pentaBlayerCategories[j].name });
					}
				}
			}
		}
	}


	tmpl.LayerSwitcher.allLayersOn = function (param) {
		var mapObj = param.map;
		var layers = mapObj.getLayers();
		var styleChange = null;
		if (appConfigInfo.mapData === "google" || 'hereMaps') {
			mapObj.removeLayer(layers.item(0));
			if (appConfigInfo.mode == 'night') {
				styleChange = mapStylesBundle['night'].style;
			}
			else if (appConfigInfo.mode == 'darkGrey') {
				styleChange = mapStylesBundle['darkGrey'].style;
			}
			else if (appConfigInfo.mode == 'cobalt') {
				styleChange = mapStylesBundle['cobalt'].style;

			}
			else {
				styleChange = [
					{
						"featureType": "all",
						"stylers": [
							{ "visibility": "on" }
						]
					}
				];
			}
			var glyr = new olgm.layer.Google({
				styles: styleChange
			});
			layers.insertAt(0, glyr);
		} else {
			for (var i = 0; i < geoserver_layer_name_trinity.length; i++) {
				var layerId = geoserver_layer_name_trinity[i].id;
				trinity_basemap_layers_objects[layerId].setVisible(false);
			}
			base_map_trinity.setVisible(true);
			base_map_streetLayer_trinity.setVisible(false);
		}
	}

	tmpl.LayerSwitcher.allLayersOff = function (param) {
		if (appConfigInfo.mapData === "google" || 'hereMaps') {

		} else {
			var mapObj = param.map;;

			for (var i = 0; i < geoserver_layer_name_trinity.length; i++) {
				var layerId = geoserver_layer_name_trinity[i].id;
				trinity_basemap_layers_objects[layerId].setVisible(false);
			}
			base_map_trinity.setVisible(false);
			base_map_streetLayer_trinity.setVisible(true);
		}
	}
	tmpl.LayerSwitcher.baseMapon = function (param) {
		if (appConfigInfo.mapData === "google" || 'hereMaps') {

		} else {
			var mapObj = param.map;;
			base_map_streetLayer_trinity.setVisible(false);
			for (var i = 0; i < geoserver_layer_name_trinity.length; i++) {
				var layerId = geoserver_layer_name_trinity[i].id;
				trinity_basemap_layers_objects[layerId].setVisible(false);
			}
			base_map_trinity.setVisible(true);
		}
	}

	var trinity_basemap_layers_objects = [];

	function create_trinity_layers_objects(mapObj) {


		//var layers = mapObj.getLayers();
		//var index = layers.getArray().indexOf(trinity_basemap_layers_objects[id]);

		//layers.removeAt(index);
		//x = x + 1;
		//  layers.insertAt(2, trinity_basemap_layers_objects[id]);

		var x = 1;
		for (var i = 0; i < geoserver_layer_name_trinity.length; i++) {
			var id = geoserver_layer_name_trinity[i].id;
			var name = geoserver_layer_name_trinity[i].text;
			//console.log(name);
			trinity_basemap_layers_objects[id] = new ol.layer.Tile({
				visible: true,
				source: new ol.source.TileWMS({
					url: appConfigInfo.wmsurl,
					params: { 'LAYERS': name, 'TILED': true, 'VERSION': appConfigInfo.wmsVersion },
					serverType: 'geoserver'
				})
			});
			mapObj.addLayer(trinity_basemap_layers_objects[id]);
			//var layers = mapObj.getLayers();
			//var index = layers.getArray().indexOf(trinity_basemap_layers_objects[id]);

			//layers.removeAt(index);
			//x = x + 1;
			//  layers.insertAt(2, trinity_basemap_layers_objects[id]);
			trinity_basemap_layers_objects[id].setVisible(false);
		}
		//console.log("finished");
	}

	function switchTrinityLayers(mapObj, on_layers_trinity) {
		for (var i = 0; i < geoserver_layer_name_trinity.length; i++) {
			var layerId = geoserver_layer_name_trinity[i].id;
			var status = on_layers_trinity[layerId];
			//console.log(status,layerId);
			if (status == "on") {
				trinity_basemap_layers_objects[layerId].setVisible(true);
			} else if (status == "off") {
				trinity_basemap_layers_objects[layerId].setVisible(false);
			}

		}
		//streetLayer_trinity.setVisible(false);
	}


	function switchGoogleLayers(mapObj, switchSt) {

		var layers = mapObj.getLayers();
		mapObj.removeLayer(layers.item(0));
		//mapmode = "normal";
		if (appConfigInfo.mode === "normal") {
			var glyr = new olgm.layer.Google({
				styles: [{ "featureType": "administrative.country", "stylers": [{ "visibility": switchSt[0] }] },
				{ "featureType": "administrative.province", "stylers": [{ "visibility": switchSt[1] }] },
				{ "featureType": "administrative.locality", "stylers": [{ "visibility": switchSt[2] }] },
				{ "featureType": "administrative.neighborhood", "stylers": [{ "visibility": switchSt[3] }] },
				{ "featureType": "administrative.land_parcel", "stylers": [{ "visibility": switchSt[4] }] },
				{ "featureType": "landscape.man_made", "stylers": [{ "visibility": switchSt[5] }] },
				{ "featureType": "landscape.natural.landcover", "stylers": [{ "visibility": switchSt[6] }] },
				{ "featureType": "landscape.natural.terrain", "stylers": [{ "visibility": switchSt[7] }] },
				{ "featureType": "poi.attraction", "stylers": [{ "visibility": switchSt[8] }] },
				{ "featureType": "poi.business", "stylers": [{ "visibility": switchSt[9] }] },
				{ "featureType": "poi.government", "stylers": [{ "visibility": switchSt[10] }] },
				{ "featureType": "poi.medical", "stylers": [{ "visibility": switchSt[11] }] },
				{ "featureType": "poi.park", "stylers": [{ "visibility": switchSt[12] }] },
				{ "featureType": "poi.place_of_worship", "stylers": [{ "visibility": switchSt[13] }] },
				{ "featureType": "poi.school", "stylers": [{ "visibility": switchSt[14] }] },
				{ "featureType": "poi.sports_complex", "stylers": [{ "visibility": switchSt[15] }] },
				{ "featureType": "road", "stylers": [{ "visibility": switchSt[16] }] },
				{ "featureType": "road.highway", "stylers": [{ "visibility": switchSt[17] }] },
				{ "featureType": "road.arterial", "stylers": [{ "visibility": switchSt[18] }] },
				{ "featureType": "road.local", "stylers": [{ "visibility": switchSt[19] }] },
				{ "featureType": "transit.line", "stylers": [{ "visibility": switchSt[20] }] },
				{ "featureType": "transit.station.airport", "stylers": [{ "visibility": switchSt[21] }] },
				{ "featureType": "transit.station.bus", "stylers": [{ "visibility": switchSt[22] }] },
				{ "featureType": "transit.station.rail", "stylers": [{ "visibility": switchSt[23] }] },
				{ "featureType": "water", "stylers": [{ "visibility": switchSt[24] }] }]
			});
			layers.insertAt(0, glyr);
		}
		else if (appConfigInfo.mode === "night") {

			var glyr = new olgm.layer.Google({

				styles: [
					{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#242f3e" }, { "visibility": "on" }] },
					{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }, { "visibility": "on" }] },
					{ "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }, , { "visibility": "on" }] },
					{ "featureType": "administrative.country", "stylers": [{ "visibility": switchSt[0] }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": switchSt[1] }] },
					{ "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }, { "visibility": switchSt[2] }] },
					{ "featureType": "administrative.neighborhood", "stylers": [{ "visibility": switchSt[3] }] }, { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": switchSt[4] }] },
					{ "featureType": "landscape.man_made", "stylers": [{ "visibility": switchSt[5] }] },
					{ "featureType": "landscape.natural.landcover", "stylers": [{ "visibility": switchSt[6] }] },
					{ "featureType": "landscape.natural.terrain", "stylers": [{ "visibility": switchSt[7] }] },
					{ "featureType": "poi.attraction", "stylers": [{ "visibility": switchSt[8] }] },
					{ "featureType": "poi.business", "stylers": [{ "visibility": switchSt[9] }] },
					{ "featureType": "poi.government", "stylers": [{ "visibility": switchSt[10] }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": switchSt[11] }] },
					{ "featureType": "poi.park", "stylers": [{ "visibility": switchSt[12] }] },
					{ "featureType": "poi.place_of_worship", "stylers": [{ "visibility": switchSt[13] }] },
					{ "featureType": "poi.school", "stylers": [{ "visibility": switchSt[14] }] },
					{ "featureType": "poi.sports_complex", "stylers": [{ "visibility": switchSt[15] }] },
					{ "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }, { "visibility": switchSt[17] }] },
					{ "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }, { "visibility": switchSt[17] }] },
					{ "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }, { "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }, { "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }, { "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }, { "visibility": switchSt[17] }] },
					{ "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }, { "visibility": switchSt[21] }] },
					{ "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }, { "visibility": switchSt[21] }] },

					{ "featureType": "transit.station.rail", "stylers": [{ "visibility": switchSt[23] }] },
					{ "featureType": "water", "stylers": [{ "color": "#33ccff" }, { "visibility": switchSt[24] }] }]
			});
			layers.insertAt(0, glyr);
		}
		else if (appConfigInfo.mode === "cobalt") {
			var glyr = new olgm.layer.Google({
				//{"featureType": "all", "elementType": "all", "stylers": [ { "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" } ] }
				styles: [
					{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" }, { "visibility": "on" }] },
					{ "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
					{ "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "0" }, { "lightness": "-10" }, { "visibility": "on" }] },
					{ "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
					{ "featureType": "administrative.country", "stylers": [{ "visibility": switchSt[0] }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": switchSt[1] }] },
					{ "featureType": "administrative.locality", "stylers": [{ "visibility": switchSt[2] }] },
					{ "featureType": "administrative.neighborhood", "stylers": [{ "visibility": switchSt[3] }] }, { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": switchSt[4] }] },
					{ "featureType": "landscape.man_made", "stylers": [{ "visibility": switchSt[5] }] },
					{ "featureType": "landscape.natural.landcover", "stylers": [{ "visibility": switchSt[6] }] },
					{ "featureType": "landscape.natural.terrain", "stylers": [{ "visibility": switchSt[7] }] },
					{ "featureType": "poi.attraction", "stylers": [{ "visibility": switchSt[8] }] },
					{ "featureType": "poi.business", "stylers": [{ "visibility": switchSt[9] }] },
					{ "featureType": "poi.government", "stylers": [{ "visibility": switchSt[10] }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": switchSt[11] }] },
					{ "featureType": "poi.park", "stylers": [{ "visibility": switchSt[12] }] },
					{ "featureType": "poi.place_of_worship", "stylers": [{ "visibility": switchSt[13] }] },
					{ "featureType": "poi.school", "stylers": [{ "visibility": switchSt[14] }] },
					{ "featureType": "poi.sports_complex", "stylers": [{ "visibility": switchSt[15] }] },

					{ "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "visibility": switchSt[17] }] },
					{ "featureType": "transit", "elementType": "geometry", "stylers": [{ "visibility": switchSt[21] }] },
					{ "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "visibility": switchSt[21] }] },

					{ "featureType": "transit.station.rail", "stylers": [{ "visibility": switchSt[23] }] },
					{ "featureType": "water", "stylers": [{ "visibility": switchSt[24] }] }]
			});
			layers.insertAt(0, glyr);
		}
		else {
			var glyr = new olgm.layer.Google({
				styles: [{ "featureType": "administrative.country", "stylers": [{ "visibility": switchSt[0] }] },
				{ "featureType": "administrative.province", "stylers": [{ "visibility": switchSt[1] }] },
				{ "featureType": "administrative.locality", "stylers": [{ "visibility": switchSt[2] }] },
				{ "featureType": "administrative.neighborhood", "stylers": [{ "visibility": switchSt[3] }] },
				{ "featureType": "administrative.land_parcel", "stylers": [{ "visibility": switchSt[4] }] },
				{ "featureType": "landscape.man_made", "stylers": [{ "visibility": switchSt[5] }] },
				{ "featureType": "landscape.natural.landcover", "stylers": [{ "visibility": switchSt[6] }] },
				{ "featureType": "landscape.natural.terrain", "stylers": [{ "visibility": switchSt[7] }] },
				{ "featureType": "poi.attraction", "stylers": [{ "visibility": switchSt[8] }] },
				{ "featureType": "poi.business", "stylers": [{ "visibility": switchSt[9] }] },
				{ "featureType": "poi.government", "stylers": [{ "visibility": switchSt[10] }] },
				{ "featureType": "poi.medical", "stylers": [{ "visibility": switchSt[11] }] },
				{ "featureType": "poi.park", "stylers": [{ "visibility": switchSt[12] }] },
				{ "featureType": "poi.place_of_worship", "stylers": [{ "visibility": switchSt[13] }] },
				{ "featureType": "poi.school", "stylers": [{ "visibility": switchSt[14] }] },
				{ "featureType": "poi.sports_complex", "stylers": [{ "visibility": switchSt[15] }] },
				{ "featureType": "road", "stylers": [{ "visibility": switchSt[16] }] },
				{ "featureType": "road.highway", "stylers": [{ "visibility": switchSt[17] }] },
				{ "featureType": "road.arterial", "stylers": [{ "visibility": switchSt[18] }] },
				{ "featureType": "road.local", "stylers": [{ "visibility": switchSt[19] }] },
				{ "featureType": "transit.line", "stylers": [{ "visibility": switchSt[20] }] },
				{ "featureType": "transit.station.airport", "stylers": [{ "visibility": switchSt[21] }] },
				{ "featureType": "transit.station.bus", "stylers": [{ "visibility": switchSt[22] }] },
				{ "featureType": "transit.station.rail", "stylers": [{ "visibility": switchSt[23] }] },
				{ "featureType": "water", "stylers": [{ "visibility": switchSt[24] }] }]
			});
			layers.insertAt(0, glyr);
		}

	}


	tmpl.Layer.singleSwitcher = function (param) {
		var layersObj = param.layer;
		var mapObj = param.map;
		var getdata = layersObj;
		var chkbx = [], chkbxId;
		for (var i = 0, length = getdata.length; i < length; i++) {
			var glayerId = getdata[i].layerId - 1;
			chkbxId = getdata[i].checkboxId;
			chkbx[i] = document.getElementById(chkbxId);
			chkbx[i].name = layerCategories[glayerId].name;
			chkbx[i].onchange = function (e) {
				switchSingleLayers(mapObj, this.id, this.name);
			};
		}
	}


	function switchSingleLayers(mapObj, chkbx, cname) {
		var layers = mapObj.getLayers();
		mapObj.removeLayer(layers.item(0));
		var chkbxN = document.getElementById(chkbx);
		var switch1;
		if (chkbxN.checked) {
			switch1 = "on";
		}
		else {
			switch1 = "off";
		}
		if (appConfigInfo.mapData === "google" || 'hereMaps') {
			var glyr = new olgm.layer.Google({
				styles: [
					{
						"featureType": cname,
						"stylers": [
							{ "visibility": switch1 }
						]
					}
				]
			});
			layers.insertAt(0, glyr);
		}

	}

	// layer switcher ends

	var modifyFence, drawFence, fenceVector;

	tmpl.Fence.create = function (param) {
		var mapObj = param.map;
		var callbackFunc = param.callbackFunc;
		var fillColor = param.fillColor;
		var strokeColor = param.strokeColor;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				mapObj.removeInteraction(modify1);
				mapObj.removeInteraction(draw);
				mapObj.removeInteraction(select);
				mapObj.removeInteraction(drawm);
				mapObj.removeInteraction(selectE);
				mapObj.removeInteraction(modifyFence);
				mapObj.removeInteraction(drawFence);
				var features;
				var format = new ol.format.WKT();
				var source;
				features = new ol.Collection();
				source = new ol.source.Vector({
					features: features
				});
				var noLayer = false;
				var existingLayer;
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				for (i = 0; i < length; i++) {
					var tempLayer = Layers.item(i);
					if (tempLayer.get('lname') === 'fencevector') {
						noLayer = true;
						existingLayer = tempLayer;
						mapObj.removeLayer(fenceVector);
						noLayer = false;
					}
				}
				if (!noLayer) {
					fenceVector = new ol.layer.Vector({
						source: source,
						style: new ol.style.Style({
							fill: new ol.style.Fill({
								color: fillColor
							}),
							stroke: new ol.style.Stroke({
								color: strokeColor,
								width: 2
							})
						})
					});
					fenceVector.setProperties({
						lname: "fencevector"
					});
					fenceVector.setProperties({
						myId: "fenceUnique"
					});
					mapObj.addLayer(fenceVector);
					existingLayer = fenceVector;
				}
				if (modifyFence != undefined) {
					mapObj.removeInteraction(modifyFence);
				}
				modifyFence = new ol.interaction.Modify({
					features: features,
					deleteCondition: function (event) {
						return ol.events.condition.shiftKeyOnly(event) &&
							ol.events.condition.singleClick(event);
					}
				});

				var wktGeom,
					fenceWktGeom;
				modifyFence.on('modifyend', function (event) {
					var feature = event.features;
					var geometryVal = feature.a[0].getGeometry();
					var lonlat,
						coord;

					lonlat = feature.item(0).getGeometry().getInteriorPoint().getCoordinates();
					if (appConfigInfo.mapData === 'google') {
						coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
						wktGeom = format.writeGeometry(feature.item(0).getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
					} else {
						coord = lonlat; //feature.getGeometry().getCoordinates();
						wktGeom = format.writeGeometry(feature.item(0).getGeometry());
					}
					event.stopPropagation();
					mapObj.removeInteraction(drawFence);
					callbackFunc(coord, wktGeom);
				});
				function addInteraction() {
					drawFence = new ol.interaction.Draw({
						features: features,
						source: fenceVector.getSource(),
						type: 'Polygon'
					});
					mapObj.addInteraction(drawFence);
					drawFence.on('drawend', function (event) {

						var feature = event.feature;
						var geometryVal = feature.getGeometry();
						var lonlat;
						var coord,
							wktGeom;
						lonlat = feature.getGeometry().getInteriorPoint().getCoordinates();
						if (appConfigInfo.mapData === 'google') {
							coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
							wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
						} else {
							coord = lonlat; //feature.getGeometry().getCoordinates();
							wktGeom = format.writeGeometry(feature.getGeometry());
						}

						event.stopPropagation();
						mapObj.removeInteraction(drawFence);
						mapObj.addInteraction(modifyFence);
						callbackFunc(coord, wktGeom);
					});
				}

				addInteraction();
			} else {
				var mapDivID = mapObj.container.id;
				var mapDiv = document.getElementById(mapDivID);
				var ellipsoid = mapObj.scene.globe.ellipsoid;

				function changePointer(movement) {
					mapDiv.style.cursor = "crosshair";
				}
				mapObj.canvas.addEventListener('mousemove', changePointer, false);

				function createPoint(worldPosition) {
					var point = mapObj.entities.add({
						position: worldPosition,
						point: {
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//RELATIVE_TO_GROUND
						},
						// id: "Area Boundary Point",
						name: "Boundary Point",
						point: {
							color: Cesium.Color.BLACK,
							pixelSize: 5,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}
					});
					return point;
				}
				var drawingMode = 'polygon';
				function drawShape(positionData) {
					polyPosition = positionData;
					// console.log("polyPosition 1 ====================>",polyPosition);


					if (drawingMode === 'polygon') {
						// map.entities.remove(map.entities.getById("Polygon Area"));
						tmpl.Layer.remove({
							map: mapObj,
							layer: "Boundary Point"
						});
						shape = mapObj.entities.add({
							// id: "Flood Area",
							name: "Polygon Area",
							polygon: {
								hierarchy: positionData,
								fill: true,
								// material: Cesium.Color.BLUE.withAlpha(0.5),
								material: Cesium.Color.fromCssColorString(fillColor),
								outline: true,
								outlineColor: Cesium.Color.fromCssColorString(strokeColor),
								outlineWidth: 15.0,
								// vertexFormat allows it to warp around the globe
								vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
								// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
							}
						});
					}

					var arr = [];
					var array = [];
					var lonlat = {};
					var j = 0;
					while (j < polyPosition.length) {
						var cartographic = null;
						cartographic = ellipsoid.cartesianToCartographic(polyPosition[j]);
						var longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
						var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
						var temp = [];
						temp = [longitudeDegrees, latitudeDegrees];
						array.push(temp);
						temp = [];
						lonlat.lon = longitudeDegrees;
						lonlat.lat = latitudeDegrees;
						arr.push(lonlat);
						lonlat = {};
						j++;
					}
					arr.push(arr[0]);
					// console.log("ARRAY============> ",arr);

					if (arr[0] != undefined) {
						var wktGeom = "POLYGON((";
						var k = 0;
						while (k < arr.length) {
							if (k == arr.length - 1) {
								wktGeom += arr[k].lon + " " + arr[k].lat;
							} else {
								wktGeom += arr[k].lon + " " + arr[k].lat + ",";
							}
							k++;
						}
						wktGeom += "))";

						// For getting center point of polygon
						array.push(array[0]);
						var polygon = turf.polygon([array]);
						// var centroid = turf.centroid(polygon);
						var centroid = turf.centerOfMass(polygon);
						var centerPoint = centroid.geometry.coordinates;
					}

					callbackFunc(centerPoint, wktGeom);
					// console.log("WKT GEOM=====>",wktGeom);


					return shape;
				}
				var activeShapePoints = [];
				var activeShape;
				var floatingPoint;
				var handler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);
				handler.setInputAction(function (event) {
					if (!Cesium.Entity.supportsPolylinesOnTerrain(mapObj.scene)) {
						console.log('This browser does not support polylines on terrain.');
						return;
					}
					// We use `map.scene.pickPosition` here instead of `map.camera.pickEllipsoid` so that
					// we get the correct point when mousing over terrain.
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
					// console.log("activeShapePoints: ",activeShapePoints);
					activeShapePoints.pop();
					drawShape(activeShapePoints);
					mapObj.entities.remove(floatingPoint);
					mapObj.entities.remove(activeShape);
					floatingPoint = undefined;
					activeShape = undefined;
					activeShapePoints = [];
					handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				}
				handler.setInputAction(function (event) {
					terminateShape();
					mapDiv.style.cursor = "default";
					mapObj.canvas.removeEventListener('mousemove', changePointer, false);
					callbackFunc(polyPosition);
				}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
			}
		} catch (err) {
			console.error("ERROR Fence.create: ", err);
		}
	}

	tmpl.Fence.removeInteraction = function (param) {
		var mapObj = param.map;
		mapObj.removeInteraction(modifyFence);
	}

	tmpl.Fence.addGeometry = function (param) {
		var mapObj = param.map;
		var lyrName = param.layer;
		var features = param.features;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var format = new ol.format.WKT();
				var feature;
				var featureDataAry = [];

				for (var i = 0; i < features.length; i++) {
					if (appConfigInfo.mapData == 'google') {
						feature = format.readFeature(features[i].geometry, {
							dataProjection: 'EPSG:4326',
							featureProjection: 'EPSG:3857'
						});
					} else {
						feature = format.readFeature(features[i].geometry, {
							dataProjection: 'EPSG:4326',
							featureProjection: 'EPSG:4326'
						});
					}
					feature.setStyle(new ol.style.Style({
						fill: new ol.style.Fill({
							color: features[i].color
						}),
						stroke: new ol.style.Stroke({
							color: features[i].color,
							width: 2
						})
					}));
					//feature.setProperties({"id":features[i].id});
					var keyNames = Object.keys(features[i]);
					for (var name = 0; name < keyNames.length; name++) {
						if (keyNames[name] == "geometry") { }
						else {
							var value = features[i][keyNames[name]];
							var x = keyNames[name]
							feature.set('' + x + '', '' + value + '');
						}
					}
					//feature.setProperties(features[i]);

					featureDataAry.push(feature);
				}
				var source = new ol.source.Vector({
					features: featureDataAry
				});
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var isLayerPresent11 = false;
				for (i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('title') == lyrName) {
							isLayerPresent11 = true;
							existingLayer.getSource().addFeatures(featureDataAry);
						}
					}
				}
				if (isLayerPresent11 == false) {
					var newLayer = new ol.layer.Vector({
						title: lyrName,
						visible: true,
						source: source
					});
					isLayerPresent11 == true;
					mapObj.addLayer(newLayer);
				}
			}
			else {
				var i = 0;
				while (i < features.length) {
					var geom = [];
					geom = createLatLonArray(features[i].geometry, 'poly');
					// var centroidArray = getCentroid(cent, 2);
					// var polygon = turf.polygon([centroidArray]);
					// // var centroid = turf.centroid(polygon);
					// var centroid = turf.centerOfMass(polygon);

					// Adding entity on map
					var poly1 = mapObj.entities.add({
						name: lyrName,
						// id: features[i].id,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(geom),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							// outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(features[i].color), 0.5),
							outlineColor: new Cesium.PolylineGlowMaterialProperty(Cesium.Color.fromCssColorString(features[i].color), 0.5),
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(features[i].color), 0.5),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}
					});
					i++;
				}
			}
		} catch (err) {
			console.error("ERROR Fence.addGeometry: ", err);
		}
	}


	tmpl.Fence.delete = function (param) {
		var mapObj = param.map;
		var id = param.id;
		var lyrName = param.layer;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var Layers = mapObj.getLayers();
				var length = Layers.getLength();
				var isLayerPresent11 = false;
				for (i = 0; i < length; i++) {
					var existingLayer = Layers.item(i);
					if (existingLayer) {
						if (existingLayer.get('title') === lyrName) {
							existingLayer.getSource().getFeatures().forEach(function (fea) {
								if (fea.getProperties()['id'] == id) {
									existingLayer.getSource().removeFeature(fea);
								}
							});
						}
					}
				}
			}
			else {
				var k = 0;
				while (k < mapObj.entities.length) {
					if (mapObj.entities._entities._array[k].name == lyrName) {
						if (mapObj.entities._entities._array[k].id == id) {
							mapObj.entities.remove(mapObj.entities._entities._array[k]);
						}
					}
				}
			}
		}
		catch (err) {
			console.error("ERROR Fence.delete: ", err);
		}
	}


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
				console.log('Error was: ' + status);
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



	tmpl.Route.onClick = function (param) {
		var click_source_route;
		var click_destination_route = [];
		var map1 = param.map;
		var sourceImg = param.sourceImg;
		var destinationImg = param.destinationImg;
		var radius1 = param.radius;
		var callbackFunc = param.callbackFunc;
		var routeDetailCallbackFunc = param.routecallbackFunc;
		var iconArray = [sourceImg, destinationImg];
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

				click_destination_route.push(coord);
				var projCoord = ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
				var pointdata = new ol.geom.Point(projCoord);
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
						sourceIcon: sourceImg,//"img/1.png",
						destinationIcon: destinationImg,//"img/2.png",
						radius: radius1,//20,
						getGeometry: test,
						callbackFunc: routedetails
					});
					tmpl.Draw.clear({
						map: map1
					});
					function routedetails(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom) {
						// console.log("------->routedetails from API: ",cordStart);
						var routeDerails = {};
						routeDerails.ETA = resETA;
						// routeDerails.StartPoint =cordStart; 									// Commented by Prashanth on 30-01-2019
						// routeDerails.EndPoint =cordEnd; 										// Commented by Prashanth on 30-01-2019
						routeDerails.ETALegs = ETA_legs;
						routeDerails.WKTGeom = wktGeom;
						routeDerails.CoordinateArray = routeDerails;
						//console.log("routeDerails:->",routeDerails);
						routeDerails.StartPoint = ol.proj.transform(cordStart, 'EPSG:3857', 'EPSG:4326');		// Added by Prashanth on 30-01-2019
						routeDerails.EndPoint = ol.proj.transform(cordEnd, 'EPSG:3857', 'EPSG:4326');			// Added by Prashanth on 30-01-2019	
						// console.log("routeDerails callback from API: ",routeDerails);
						routeDetailCallbackFunc(routeDerails);
					}
					function test(data) {
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

									console.log(layer.get('lname'));
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
							if (dragFeature.get('fname') == 'source') {
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
							} else if (dragFeature.get('fname') == 'destination') {
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
	var trak_animationSteps = 15;
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
			if (appConfigInfo.mapDimension == "2D") {
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
					var x = document.getElementById('bottomPaneldiv');
					x.remove();
					// x.style.display = "none";

					//end to clear Trip chart
				}
				catch (e) {
					console.error('Unable to remove', e);
				}
			}
			else {
				var remove = ["Trip End Points", "TRIP MID POINTS", "Trip Display Layer"];

				for (var i = 0; i < remove.length; i++) {
					tmpl.Layer.remove({
						map: map,
						layer: remove[i]
					});
					map.trackedEntity = undefined;
				}
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
		var map = param.map;
		var visibility = param.visibility;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				tmpl_trip_layer_display.setVisible(visibility);
				tmpl_trip_layer_display1.setVisible(visibility);
				tmpl_trip_halt_display.setVisible(visibility);
				tmpl_trip_start_display.setVisible(visibility);
				tmpl_trip_end_display.setVisible(visibility);
				if (visibility == true)
					trip_lines_layer.setVisible(false);
				else
					trip_lines_layer.setVisible(true);
			}
			else {
				var model = map.entities.getById("Trip Display");
				model.path.show = visibility;
			}
		}
		catch (err) {
			console.error("ERROR Trip.routeLayer: ", err);
		}
	};
	tmpl.Trip.animatingRoute = function (param) {
		var visibility = param.visibility;
		trip_lines_layer.setVisible(visibility);
		trip_lines_layer_direction.setVisible(visibility);
	};

	tmpl.Trip.routeVehicle = function (param) {
		var visibility = param.visibility;
		var map = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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
			}
			else {
				var model = map.entities.getById("Trip Display");
				model.model.show = visibility;
			}
		}
		catch (err) {
			console.error("ERROR Trip.routeVehicle: ", err);
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

	// var startTimeThreed = null;
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
					var vehicleModel = null;
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



					//2D Trip Start

					if (appConfigInfo.mapDimension == '2D') {
						console.log("Trip 2D..");
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

						map.unByKey(pointerMoveID);												// Added on 23-10-19 by Prashanth to disable pointer move function 

						var mapDiv = document.getElementById(globalMapDivID);
						var toggleLayersDiv = document.createElement("div");
						toggleLayersDiv.className = "toggleLayers";
						toggleLayersDiv.id = "toggleTrackLayers";
						toggleLayersDiv.style.display = 'none';
						//var mapDiv = document.getElementById(globalMapDivID);
						mapDiv.appendChild(toggleLayersDiv);

						// document.body.appendChild(toggleLayersDiv);
						// toggleLayersDiv.style.position = "absolute";
						// toggleLayersDiv.style.display = "flex";
						// toggleLayersDiv.style.justifyContent = "center";
						// toggleLayersDiv.style.top = "8%";
						// toggleLayersDiv.style.right = "10px";
						// toggleLayersDiv.style.width = "245px";
						// toggleLayersDiv.style.backgroundColor = "#141d24";
						// toggleLayersDiv.style.borderRadius = "5px";
						// toggleLayersDiv.style.opacity = "0.8";
						// toggleLayersDiv.style.zIndex = "4";
						// toggleLayersDiv.style.color = "White";

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
						infoCheckbox.checked = false;



						toggleLayersDiv.appendChild(infoCheckbox);
						// infoCheckbox.onclick = infoboxvisibility;
						document.getElementById("toggleTrackLayers").append("Infobox");


						var bottomPanel = document.createElement("div");
						bottomPanel.className = 'bottomPanel';
						bottomPanel.id = 'bottomPaneldiv';
						// bottomPanel.style.position = 'fixed';
						// bottomPanel.style.bottom = '0%';
						// bottomPanel.style.right = '0%';
						// bottomPanel.style.width = '100%';
						// bottomPanel.style.height = '42px';
						// bottomPanel.style.float = 'right';
						// bottomPanel.style.backgroundColor = '#141d24';
						// bottomPanel.style.borderRadius = '5px';
						// bottomPanel.style.zIndex = '4';
						// bottomPanel.style.transition = 'all 1.0s';

						//mapDiv.appendChild(bottomPanel);

						var ParentBottomPanel = document.createElement("div");
						ParentBottomPanel.className = 'ParentBottomPanel';
						ParentBottomPanel.style.position = 'absolute';
						ParentBottomPanel.appendChild(bottomPanel);

						mapDiv.appendChild(ParentBottomPanel);


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
						bottomPanel.appendChild(bottomPaneldata);


						var btmPnlSigndownCont = document.createElement("div");
						btmPnlSigndownCont.className = 'signdownContainer';
						// btmPnlSigndownCont.style.position = 'absolute';
						// btmPnlSigndownCont.style.right = '10px';
						// btmPnlSigndownCont.style.top = '25%';
						// btmPnlSigndownCont.style.zIndex = '5';
						bottomPanel.appendChild(btmPnlSigndownCont);

						var closeDataTab = document.createElement("BUTTON");
						closeDataTab.className = "signDownTab";
						closeDataTab.value = "2";
						// closeDataTab.style.background = "none";
						// closeDataTab.style.border = "none";
						// closeDataTab.style.cursor = "pointer";
						// closeDataTab.style.transition = 'all 1.0s';
						closeDataTab.innerHTML = '<i class="fa fa-lg fa-chevron-circle-up"></i>';
						closeDataTab.onclick = function (evt) {
							if (closeDataTab.value == 1) {
								bottomPanel.appendChild(bottomPaneldata);
								bottomPaneldata.style.visibility = 'visible';
								//bottomPanel.style.bottom = '26.5%';
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
						infoTabs.className = 'infoTabs';

						//infoTabs.style.overflow = 'hidden';
						bottomPanel.appendChild(infoTabs);

						var graphTab = document.createElement("BUTTON");
						graphTab.className = 'graphTab'; //graphTab active
						//for open default graph tab
						graphTab.id = 'graphTabid';
						graphTab.innerHTML = 'Graph';
						// graphTab.style.backgroundColor = 'inherit';
						// graphTab.style.float = 'left';
						// graphTab.style.border = 'none';
						// graphTab.style.outline = 'none';
						// graphTab.style.cursor = 'pointer';
						// graphTab.style.padding = '11px 16px';
						// graphTab.style.transition = 'all 1.0s';
						// graphTab.style.fontSize = '17px';
						// graphTab.style.color = "white";
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
							//bottomPanel.style.bottom = '26.5%';
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
							document.getElementsByClassName('tripDataTab')[0].style.backgroundColor = "#141d24";
							document.getElementsByClassName('graphTab')[0].style.backgroundColor = "#1cbeca";
						};
						infoTabs.appendChild(graphTab);

						var tripDataTab = document.createElement("BUTTON");
						tripDataTab.className = 'tripDataTab';
						tripDataTab.innerHTML = 'Messages';
						// tripDataTab.style.backgroundColor = 'inherit';
						// tripDataTab.style.float = 'left';
						// tripDataTab.style.border = 'none';
						// tripDataTab.style.outline = 'none';
						// tripDataTab.style.cursor = 'pointer';
						// tripDataTab.style.padding = '11px 16px';
						// tripDataTab.style.transition = '0.3s';
						// tripDataTab.style.fontSize = '17px';
						// tripDataTab.style.color = "white";
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
							//bottomPanel.style.bottom = '26.5%'; changed heir
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
							document.getElementsByClassName('graphTab')[0].style.backgroundColor = "#141d24";
							document.getElementsByClassName('tripDataTab')[0].style.backgroundColor = "#1cbeca";
						};
						infoTabs.appendChild(tripDataTab);

						//============

						var tripInfoEableBut = document.createElement("BUTTON");
						tripInfoEableBut.className = 'tripInfoEableBut';
						tripInfoEableBut.innerHTML = 'Info-Toolbar';
						// tripInfoEableBut.style.backgroundColor = 'inherit';
						// tripInfoEableBut.style.float = 'right'; //left
						// tripInfoEableBut.style.border = 'none';
						// tripInfoEableBut.style.outline = 'none';
						// tripInfoEableBut.style.cursor = 'pointer';
						// tripInfoEableBut.style.padding = '11px 50px';
						// tripInfoEableBut.style.transition = '0.3s';
						// tripInfoEableBut.style.fontSize = '17px';
						// tripInfoEableBut.style.color = "white";
						tripInfoEableBut.value = 'Yes'
						tripInfoEableBut.onclick = function (evt) {
                            //console.log(tripInfoEableBut.value)
							var mapPDiv = document.getElementById(globalMapDivID);

							//var ChildDiv = document.getElementById('toggleTrackLayers');

							var div = document.getElementById('toggleTrackLayers');
			
							div.style.display = div.style.display == 'none' ? 'block' : 'none'
                           // console.log(div.style.display)
						};
						infoTabs.appendChild(tripInfoEableBut);
						//============

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

						try {
							generateGraph();
						} catch (e) {
							console.log('error due to ', e);
						}
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

						infoTabs.appendChild(tripControlsContainer); //changed Heirarchy

						var tripControlContainerStyle = document.getElementsByClassName("tripControlscontainer");
						// tripControlContainerStyle[0].style.position = 'absolute';
						// tripControlContainerStyle[0].style.height = '40px';
						// tripControlContainerStyle[0].style.bottom = '2%';
						// tripControlContainerStyle[0].style.left = '32%';
						// tripControlContainerStyle[0].style.backgroundColor = 'black';
						// tripControlContainerStyle[0].style.borderRadius = '5px';
						// tripControlContainerStyle[0].style.zIndex = '5';

						var mapControls = document.createElement("div");
						mapControls.className = "mapControls";
						mapControls.id = "controlButtons";
						tripControlsContainer.appendChild(mapControls);

						var playBut = document.createElement("BUTTON");
						var pausBut = document.createElement("BUTTON");
						var stopBut = document.createElement("BUTTON");

						playBut.setAttribute("id", "playbtn");
						pausBut.setAttribute("id", "pausebtn");
						stopBut.setAttribute("id", "stopbtn");

						playBut.setAttribute("class", "tripControlbtn");
						pausBut.setAttribute("class", "tripControlbtn");
						stopBut.setAttribute("class", "tripControlbtn");

						//playBut.innerHTML = '<i class="fa fa-play"></i>';
						//playBut.innerHTML = "<img src="+appConfigInfo.mapSDKURL+"api_img/play2.png>"; // 
						playBut.innerHTML = "<img src="+appConfigInfo.mapSDKURL+"api_img/play2.png width = 12px height = 15px>"; // 
						playBut.title = "Play";
						//pausBut.innerHTML = '<i class="fa fa-pause"></i>';
						pausBut.innerHTML = "<img src="+appConfigInfo.mapSDKURL+"api_img/pause2.png width = 12px height = 15px>";
						pausBut.title = "Pause";
						//stopBut.innerHTML = '<i class="fa fa-stop"></i>';
						stopBut.innerHTML = "<img src="+appConfigInfo.mapSDKURL+"api_img/stop2.png width = 12px height = 15px>";
						stopBut.title = "Stop";

						mapControls.appendChild(playBut);
						mapControls.appendChild(pausBut);
						mapControls.appendChild(stopBut);

						var controlsDiv = document.getElementsByClassName("mapControls");
						// controlsDiv[0].style.position = "relative";
						// controlsDiv[0].style.border = "1px solid ivory";
						// controlsDiv[0].style.borderRadius = "inherit";
						// controlsDiv[0].style.backgroundColor = "black";
						// controlsDiv[0].style.float = "left";
						// controlsDiv[0].style.top = "4px";
						// controlsDiv[0].style.marginLeft = "4px";
						// controlsDiv[0].style.marginRight = "4px";
						// controlsDiv[0].style.zIndex = "5";

						var buttonsDiv = document.getElementsByClassName("tripControlbtn");
						for (var i = 0; i < buttonsDiv.length; i++) {
							// buttonsDiv[i].style.position = "relative";
							// //buttonsDiv[i].style.top = "50%";
							// buttonsDiv[i].style.float = "left";
							// buttonsDiv[i].style.backgroundColor = "DodgerBlue";
							// buttonsDiv[i].style.border = "none";
							// buttonsDiv[i].style.color = "white";
							// buttonsDiv[i].style.padding = "0px 5px";
							// buttonsDiv[i].style.margin = "2px";
							// buttonsDiv[i].style.fontSize = "16px";
							// buttonsDiv[i].style.cursor = "pointer";
							// buttonsDiv[i].style.zIndex = "10";
						}

						var speedControllerContainer = document.createElement("div");
						speedControllerContainer.className = 'speedController';
						tripControlsContainer.appendChild(speedControllerContainer);

						var tripControlsContainerStyle = document.getElementsByClassName("speedController");
						// tripControlsContainerStyle[0].style.position = 'relative';
						// tripControlsContainerStyle[0].style.width = '91px';
						// tripControlsContainerStyle[0].style.float = 'left';
						// tripControlsContainerStyle[0].style.top = '5px';
						// tripControlsContainerStyle[0].style.marginRight = '4px';
						// tripControlsContainerStyle[0].style.padding = '0px';
						// tripControlsContainerStyle[0].style.border = '1px solid ivory';
						// tripControlsContainerStyle[0].style.backgroundColor = '#1e90ff';
						// tripControlsContainerStyle[0].style.borderRadius = '5px';
						// tripControlsContainerStyle[0].style.zIndex = '11';

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
						// speedControllerDropdownStyle[0].style.position = 'relative';
						// speedControllerDropdownStyle[0].style.float = 'right';

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
						delayContainer.style.padding = "0px";
						delayContainer.style.marginRight = "4px";
						delayContainer.style.backgroundColor = "#1e90ff";
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
											//draw the line 
											if (lineArray.length == 2) {
												console.log('Drawing from Source : ' + lineArray[0].location + ' to Destination : ' + lineArray[1].location);
												var prev = null, next = null
												prev = [parseFloat(lineArray[0].lon), parseFloat(lineArray[0].lat)];
												next = [parseFloat(lineArray[1].lon), parseFloat(lineArray[1].lat)];
												// console.log(prev,pres);
												if (appConfigInfo.mapData == "google") {
													if (prev && next) {
														prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
														pres = ol.proj.transform(next, 'EPSG:4326', 'EPSG:3857');

														var lineString = new ol.geom.LineString([prev, pres]);
														var feature2 = new ol.Feature({
															geometry: lineString
														});

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

						// infoTableDiv.style.position = "absolute";
						// infoTableDiv.style.top = "20%";
						// infoTableDiv.style.right = "10px";
						// infoTableDiv.style.width = "auto%";
						// infoTableDiv.style.zIndex = "4";

						// infoTableRowsDiv.style.position = "relative";
						// infoTableRowsDiv.style.top = "2px";
						// infoTableRowsDiv.style.left = "2px";
						// infoTableRowsDiv.style.backgroundColor = "#141d24";
						// infoTableRowsDiv.style.opacity = "1";
						// infoTableRowsDiv.style.borderRadius = "5px";
						// infoTableRowsDiv.style.color = "white";
						// infoTableRowsDiv.style.fontSize = "10px";

						document.getElementById("playbtn").onclick = function () {
							//alert(firstrun);
							if (firstrun) {
								tmpl.Trip.firstplay();
								firstrun = false;
							}
							else {
								tmpl.Trip.play();
							}
						}
						document.getElementById("pausebtn").onclick = function () {
							firstrun = false;
							tmpl.Trip.pause();
						}
						document.getElementById("stopbtn").onclick = function () {
							firstrun = false;
							tmpl.Trip.stop();
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
								});
							}
						}
                        document.getElementById("infoTable").style.visibility = "hidden";//

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

							map.addLayer(tmpl_trip_layer_display1);
							map.addLayer(tmpl_trip_layer_display);
						} else {
							tmpl_trip_layer_display1.getSource().clear();
							tmpl_trip_layer_display.getSource().clear();
						}
						console.log(tmpl_trip_layer_display);
						var gblIndex = 1;


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

						function sendDataToDrawAnimationLineTemp() {
							var k = gblIndex;

							var prev = [parseFloat(uniqueData[k - 1].lon), parseFloat(uniqueData[k - 1].lat)];
							var pres = [parseFloat(uniqueData[k].lon), parseFloat(uniqueData[k].lat)];
							console.log(prev, pres);
							if (appConfigInfo.mapData == "google") {
								prev = ol.proj.transform(prev, 'EPSG:4326', 'EPSG:3857');
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}

							var properties = {
								location: uniqueData[k].location,
								speed: uniqueData[k].speed,
								date: uniqueData[k].date,
								time: uniqueData[k].time,
								lat: uniqueData[k].lat,
								lon: uniqueData[k].lon
							};
							// drawAnimatedLineTemp(prev, pres, properties);				//Commented on 22-10-2019 by Prashanth/Santhosh
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
								// console.log(prev,pres);
								if (appConfigInfo.mapData == "google") {
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

								feature2.setProperties(properties);
								tmpl_trip_layer_display1.getSource().addFeature(feature2);
								if (k == uniqueData.length - 1) {
									tmpl.Zoom.toLayer({
										map: map,
										layer: "trip_line_display_layer1"
									});
									// sendDataToDrawAnimationLineTemp();				//Commented on 22-10-2019 by Prashanth/Santhosh
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

						//2D Trip End
					}
					else {
						//3D Trip Start
						console.log("Trip 3D...");
						if (param.vehicle3DModel) {
							vehicleModel = param.vehicle3DModel;
						} else {
							vehicleModel = "http://localhost:8081/trinityAPI/PoliceCar.gltf";
						}


						trackVehicle(tripVehicleId, data2);

						function trackVehicle(vehicleid, waypoints, timeStepInSeconds = 60) {
							const positionProperty = new Cesium.SampledPositionProperty();//arr for time stamp and geo loc

							//get current date and time
							const currentdate = new Date();
							const date = new Date(Date.UTC(currentdate.getFullYear(), (currentdate.getMonth()), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()));
							//sampling start time 
							const start = Cesium.JulianDate.fromIso8601(date.toISOString());//start  time
							//random time for coordinate array for trip to finish
							const totalSeconds = timeStepInSeconds * (waypoints.length - 1);//duration 60 * 2 = 120sec 12000
							//sampling stop time
							const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());//stop time calculated

							console.log("Duration in seconds : " + totalSeconds + " in minutes " + (totalSeconds / 60));

							//setting cesium clock
							map.clock.startTime = start.clone();
							map.clock.stopTime = stop.clone();
							map.clock.currentTime = start.clone();
							map.timeline.zoomTo(start, stop);

							console.log("Time is set");

							for (let i = 0; i < waypoints.length; i++) {
								const position = Cesium.Cartesian3.fromDegrees(waypoints[i].lon, waypoints[i].lat);//position
								const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());

								plotroutepoints(position);//dataPoint.height
								//adding timestamp and coordinate
								positionProperty.addSample(time, position);
							}

							async function loadModel() {
								// Load the glTF model from Cesium ion.
								const vehicleEntity = map.entities.add({
									availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
									position: positionProperty,
									// Attach the 3D model instead of the green point.
									model: {
										uri: vehicleModel, // vehicleModel="http://localhost:8081/trinityAPI/PoliceCar.gltf";
										heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//RELATIVE_TO_GROUND,
										scale: 1,
										/** shadows: Cesium.ShadowMode.ENABLED, **/
										maximumScale: 32
									},
									// Automatically compute the orientation from the position.
									orientation: new Cesium.VelocityOrientationProperty(positionProperty),
									path: {
										show: true,
										leadTime: 0,
										trailTime: totalSeconds,//( 365 * 24 * 60 * 60 ), //totalSeconds,//dont remove trail line for one year
										width: 1,
										resolution: 1,
										clampToGround: true,
										heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//,RELATIVE_TO_GROUND,

										//distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0)
									}
								});

								map.trackedEntity = vehicleEntity;
							}
							loadModel();
						}

					}




				}





			}
		}
	};

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

	tmpl.Trip.replay = function () {
		if (tripDataForReplyFromDisplay_flag == true) {
			tripDataForReplyFromDisplay.hideAllLayers = true;
			tmpl.Trip.animation(tripDataForReplyFromDisplay);
			tripDataForReplyFromDisplay_flag = false;
		}
	}
	tmpl.Trip.play = function (param) {
		var map = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (tripDataForReplyFromDisplay_flag == true) {
					tripDataForReplyFromDisplay.hideAllLayers = true;
					tmpl.Trip.animation(tripDataForReplyFromDisplay);
					tripDataForReplyFromDisplay_flag = false;
				} else {
					//console.log(current_status_flag);

				}
			}
			else {
				var entity = map.entities.getById("Trip Display");
				if (entity != undefined) {
					map.scene.camera.defaultZoomAmount = 2000;	//800m
					map.trackedEntity = entity;
					setTimeout(function () {
						map.scene.camera.zoomOut();
					}, 300);
				}
				else { }
				map.clock.shouldAnimate = true;
				map.clock.onStop.addEventListener(restartTrip);
				// function restartTrip(){
				// setTimeout(function(){tmpl.Trip.stop({map: map});},500)
				// }
				animationfor3D(map);
			}
		}
		catch (err) {
			console.error("ERROR Trip.play: ", err);
		}
	}

	/*-----------------------3d-Trip-Playback-Start-------------------------*/

	tmpl.Trip.display3DTrip = function (param) {
		var data2 = param.data;
		var map = param.map;
		var tripVehicleId = param.vehicleId;
		var vehicleModel = param.vehicle3DModel;
		//tmpl.Map.EnableOrDesableTerrain({ map: gmap, visibility: true });

			var mapDiv = document.getElementById(globalMapDivID);

			var tripToolbar = document.createElement("div");
			// tripToolbar.className = "mapControls";
			tripToolbar.id = "tripToolbar";
			tripToolbar.style.position = "absolute";
			tripToolbar.style.zIndex = "400";
			tripToolbar.style.top = "3%";
			tripToolbar.style.right = "165px";
			tripToolbar.style.width = "1000px";
			tripToolbar.style.height = "14%";

			var lineBut = document.createElement("BUTTON");
			lineBut.innerHTML = 'Line';
			lineBut.id = 'lineButid';
			lineBut.onclick = function () {
				var but = document.getElementById('lineButid');
				if (but) {
					//plotrouteline(waypoints);

					let degArray = [];
					let ellipsoid = map.scene.globe.ellipsoid;
					for (let coord of data2) {
						const position = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat);//height
						const cartographic = ellipsoid.cartesianToCartographic(position);
						let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
						let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
						degArray.push(longitudeString, latitudeString);
					}
					map.entities.add({
						//id: "route",
						polyline: {
							clampToGround: true,
							positions: Cesium.Cartesian3.fromDegreesArray(
								degArray),
							width: 20,
							material: new Cesium.PolylineArrowMaterialProperty(
								Cesium.Color.PURPLE
							),
						},
					});
				}
				else {
					//alert("Not showing the Line");
				}
			}
			////////
			var resetTripBut = document.createElement("BUTTON");
			resetTripBut.innerHTML = 'Reset-Trip';
			resetTripBut.id = 'resetTripButid';
			resetTripBut.onclick = function () {
				var but = document.getElementById('resetTripButid');
				if (but) {

					map.entities.removeAll();
					map.clock.shouldAnimate = false;
					trackVehicle(tripVehicleId, data2, timeStepInSeconds = 60);
				}
				else {
					//alert("Not showing the Line");
				}
			}
			///////  

			var StartBut = document.createElement("BUTTON");
			StartBut.innerHTML = 'Start/Stop';
			StartBut.id = 'StartButid';

			StartBut.onclick = function () {
				var but = document.getElementById('StartButid');
				if (but) {
					//alert("Started...!!");

					//map.clock.shouldAnimate = false;
					map.clock.shouldAnimate = !+map.clock.shouldAnimate;
					if (map.clock.shouldAnimate) {
						window.onload = function () {
							document.getElementById("Start/Stop").innerHTML = "Stop";
						}
					}
					else {

						window.onload = function () {
							document.getElementById("Start/Stop").innerHTML = "Start";
						}
					}
					console.log("map.clock.shouldAnimate :: " + map.clock.shouldAnimate);

				}
				else {
					//alert("Not Started...!!");
				}
			}

			var speedPlusBut = document.createElement("BUTTON");
			speedPlusBut.innerHTML = '+(Speed)';
			speedPlusBut.id = 'speedPlusButid';
			speedPlusBut.onclick = function () {
				var but = document.getElementById('speedPlusButid');
				if (but) {
					const val = map.clock.multiplier + 10;
					map.clock.multiplier = val;
					console.log("map.clock.multiplier + :: " + map.clock.multiplier);
				}
				else {
					//alert("Not Increased the speed...!!");
				}
			}


			var speedMinusBut = document.createElement("BUTTON");
			speedMinusBut.innerHTML = '-(Speed)';
			speedMinusBut.id = 'speedMinusButid';
			speedMinusBut.onclick = function () {
				var but = document.getElementById('speedMinusButid');
				if (but) {
					if (map.clock.multiplier >= 20) {
						const val = map.clock.multiplier - 10;
						map.clock.multiplier = val;
						console.log("map.clock.multiplier - :: " + map.clock.multiplier);

					}
					else if (map.clock.multiplier < 20) {
						//const val = map.clock.multiplier - 10;
						map.clock.multiplier = 1;
						console.log("map.clock.multiplier - :: " + map.clock.multiplier);
					}
				}
				else {
					// alert("Not decreased the speed...!!...!!");
				}
			}

			var goReverseBut = document.createElement("BUTTON");
			goReverseBut.innerHTML = 'Go-reverse/Go-forward';
			goReverseBut.id = 'goReverseButid';
			goReverseBut.onclick = function () {
				var but = document.getElementById('goReverseButid');
				if (but) {
					map.clock.multiplier = -(map.clock.multiplier);
					console.log("map.clock.multiplier + :: " + map.clock.multiplier);
				}
				else {
					//alert("Reverse is not Working...!!");
				}
			}


			// var goForwardBut = document.createElement("BUTTON");
			// goForwardBut.innerHTML = 'Go-forward';
			// goForwardBut.id = 'goForwardButid';
			// goForwardBut.onclick = function () {
			// 	var but = document.getElementById('goForwardButid');
			// 	if (but) {
			// 		// map.clock.multiplier= +( map.clock.multiplier );
			// 		trackVehicle(tripVehicleId, data2, timeStepInSeconds = 60)

			// 	}
			// 	else {
			// 		alert("Not Started...!!");
			// 	}
			// }


			lineBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			resetTripBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			//tripClearBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			StartBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			speedPlusBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			speedMinusBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			goReverseBut.setAttribute("class", "cesium-button cesium-button-toolbar");
			//goForwardBut.setAttribute("class", "cesium-button cesium-button-toolbar");


			lineBut.title = "Line";
			resetTripBut.title = "Reset-Trip";
			//  tripClearBut.title = "tripClear";
			StartBut.title = "Start";
			speedPlusBut.title = "+(Speed)";
			speedMinusBut.title = "-(Speed)";
			goReverseBut.title = "Go-reverse";
			//goForwardBut.title = "Go-forward";

			tripToolbar.appendChild(lineBut);
			tripToolbar.appendChild(resetTripBut);
			// tripToolbar.appendChild(tripClearBut);
			tripToolbar.appendChild(StartBut);
			tripToolbar.appendChild(speedPlusBut);
			tripToolbar.appendChild(speedMinusBut);
			tripToolbar.appendChild(goReverseBut);
			//tripToolbar.appendChild(goForwardBut);

			mapDiv.appendChild(tripToolbar);

			//**************************ToolBar******************** */
			var mapDiv = document.getElementById(globalMapDivID);
			/*
			var toggleLayers3DDiv = document.createElement("div");
			toggleLayers3DDiv.className = "toggleLayers3DDiv";
			toggleLayers3DDiv.id = "toggleLayers3DDiv";
			//toggleLayers3DDiv.style.display = 'none';
			//var mapDiv = document.getElementById(globalMapDivID);
			mapDiv.appendChild(toggleLayers3DDiv);

			
			var routevehicleCheckbox = document.createElement('input');
			routevehicleCheckbox.id = "checkresource";
			routevehicleCheckbox.type = "checkbox";
			routevehicleCheckbox.name = "Resource";
			routevehicleCheckbox.value = "Resource";
			routevehicleCheckbox.checked = true;
			toggleLayers3DDiv.appendChild(routevehicleCheckbox);
			// routevehicleCheckbox.onclick = resourcevisibility;
			document.getElementById("toggleTrackLayers");

			var infoCheckbox = document.createElement('input');
			infoCheckbox.id = "checkinfobox";
			infoCheckbox.type = "checkbox";
			infoCheckbox.name = "Infobox";
			infoCheckbox.value = "Infobox";
			infoCheckbox.checked = true;
			toggleLayers3DDiv.appendChild(infoCheckbox); //.append("Infobox");
			*/

			// TABLES
			var infoTable3DDiv = document.createElement("div");
			infoTable3DDiv.className = "dataTable3D";
			infoTable3DDiv.id = "dataTable3D";
			// document.body.appendChild(infoTable3DDiv);
			mapDiv.appendChild(infoTable3DDiv);
			var infoTableRows3DDiv = document.createElement("div");
			infoTableRows3DDiv.className = "infoTableRows3DDiv";
			infoTable3DDiv.appendChild(infoTableRows3DDiv);

			infoTableRows3DDiv.innerHTML = '<table><tr style="border-bottom: 1px solid lightgrey; color: white;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id="resourceDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey; color: white;"><td style="font-weight:bold; padding:5px;">Location</td><td id="locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey; color: white;"><td style="font-weight:bold; padding:5px;">Date-Time</td><td id="callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey; color: white;"><td style="font-weight:bold; padding:5px;">Lat</td><td id="dateTimeDIv"></td></tr><tr style="border-bottom: 1px solid lightgrey; color: white;"><td style="font-weight:bold; padding:5px;">Lon</td><td id="speedDispDiv"></td></tr></table>';
			
			infoTable3DDiv.style.position = "absolute";
			infoTable3DDiv.style.top = "20%";
			infoTable3DDiv.style.right = "10px";
			infoTable3DDiv.style.width = "auto%";
			infoTable3DDiv.style.zIndex = "4";

			infoTableRows3DDiv.style.position = "relative";
			infoTableRows3DDiv.style.top = "0rem";
			infoTableRows3DDiv.style.left = "-3rem";
			infoTableRows3DDiv.style.backgroundColor = "#141d24";
			infoTableRows3DDiv.style.opacity = "1";
			infoTableRows3DDiv.style.borderRadius = "5px";
			infoTableRows3DDiv.style.color = "white";
			infoTableRows3DDiv.style.fontSize = "10px";


						// document.getElementById("infoTable").style.visibility = "hidden";//
						// document.getElementById("checkinfobox").onclick = function () {
						// 	var checkStatus = document.getElementById("checkinfobox").checked;
						// 	if (checkStatus == false) {
						// 		document.getElementById("infoTable").style.visibility = "hidden";
						// 	}
						// 	else {
						// 		document.getElementById("infoTable").style.visibility = "visible";
						// 	}
						// }
			for(let m = 0; m< data2.length; m++ ){		
				
			document.getElementById("resourceDiv").innerHTML =  tripVehicleId; //resourceDiv, locationDiv, callSignDiv, dateTimeDIv, speedDispDiv.
			document.getElementById("locationDiv").innerHTML =  "Chitragupta Nivas, Ashirwad Colony";
			document.getElementById("callSignDiv").innerHTML = "2020-01-16 07:34:40";
			document.getElementById("dateTimeDIv").innerHTML = data2[m].lat;
			document.getElementById("speedDispDiv").innerHTML = data2[m].lon;
		}	
			//**************************ToolBar******************** */
			//3D Trip Start
			console.log("Trip 3D...");
			if (param.vehicle3DModel) {
				vehicleModel = param.vehicle3DModel;
				console.log("Loaded from User");
			} else {
				vehicleModel = "http://localhost:8080/trinity_map/PoliceCar.gltf";
				console.log("Loaded from local");
			}

			function plotroutepoints(position) {
				map.entities.add({
					position: position,
					point: {
						pixelSize: 5, color: Cesium.Color.RED,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//RELATIVE_TO_GROUND
					}
				});
			}
			function plotrouteline(waypoint) {
				let degArray = [];
				let ellipsoid = map.scene.globe.ellipsoid;
				for (let coord of waypoint) {
					const position = Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat);//height
					const cartographic = ellipsoid.cartesianToCartographic(position);
					let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
					let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
					degArray.push(longitudeString, latitudeString);
				}
				map.entities.add({
					//id: "route",
					polyline: {
						clampToGround: true,
						positions: Cesium.Cartesian3.fromDegreesArray(
							degArray),
						width: 20,
						material: new Cesium.PolylineArrowMaterialProperty(
							Cesium.Color.PURPLE
						),
					},
				});

			}

			function trackVehicle(vehicleid, waypoints, timeStepInSeconds = 60) {
				const positionProperty = new Cesium.SampledPositionProperty();//arr for time stamp and geo loc

				//get current date and time
				const currentdate = new Date();
				const date = new Date(Date.UTC(currentdate.getFullYear(), (currentdate.getMonth()), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()));
				//sampling start time 
				const start = Cesium.JulianDate.fromIso8601(date.toISOString());//start  time
				//random time for coordinate array for trip to finish
				const totalSeconds = timeStepInSeconds * (waypoints.length - 1);//duration 60 * 2 = 120sec 12000
				//sampling stop time
				const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());//stop time calculated

				console.log("Duration in seconds : " + totalSeconds + " in minutes " + (totalSeconds / 60));

				//setting cesium clock
				map.clock.startTime = start.clone();
				map.clock.stopTime = stop.clone();
				map.clock.currentTime = start.clone();
				// map.timeline.zoomTo(start, stop);

				console.log("Time is set");

				for (let i = 0; i < waypoints.length; i++) {
					const position = Cesium.Cartesian3.fromDegrees(waypoints[i].lon, waypoints[i].lat);//position
					const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
					plotroutepoints(position);//dataPoint.height
					//adding timestamp and coordinate
					positionProperty.addSample(time, position);
				}

				async function loadModel() {
					// Load the glTF model from Cesium ion.
					const vehicleEntity = map.entities.add({
						availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
						position: positionProperty,
						// Attach the 3D model instead of the green point.
						model: {
							uri: vehicleModel, // vehicleModel="http://localhost:8081/trinityAPI/PoliceCar.gltf";
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//RELATIVE_TO_GROUND,
							scale: 1,
							//shadows: Cesium.ShadowMode.ENABLED
							/** shadows: Cesium.ShadowMode.ENABLED, **/
							maximumScale: 32

						},
						// Automatically compute the orientation from the position.
						orientation: new Cesium.VelocityOrientationProperty(positionProperty),
						path: {
							show: true,
							leadTime: 0,
							trailTime: totalSeconds,//( 365 * 24 * 60 * 60 ), //totalSeconds,//dont remove trail line for one year
							width: 1,
							resolution: 1,
							clampToGround: true,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//,RELATIVE_TO_GROUND,

							//distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0)
						}
					});

					map.trackedEntity = vehicleEntity;
				}
				loadModel();
				/*
				 var unsubscribe = map.clock.onTick.addEventListener(myCallback); 
		  
				 function myCallback(obj)
				{
				  console.log("YA INSIDE CLOCK FUNCTION ");
				  let curtime = obj._currentTime;
				  let currentime = Cesium.JulianDate.fromDate(new Date(curtime));
				  //console.log("currentime : "+currentime);
				  let endtime = Cesium.JulianDate.fromDate(new Date(stop));
		  
				  
				  if(Cesium.JulianDate.greaterThanOrEquals(currentime, endtime) && map.clock.shouldAnimate)
				  {
					console.log("YA STOPPING viewer.clock.shouldAnimate ");
					map.clock.shouldAnimate = false;
					map.clock.multiplier = 1;
					//load the model with last coordinate
					return false;
				  }
				} 
				*/
			}
			trackVehicle(tripVehicleId, data2, timeStepInSeconds = 60);

		
	}
	//tmpl.Trip.display3DTrip({ map: gmap2, data: routeData, vehicleId: tripVehicleId, vehicle3DModel: tripVehicleModel, mapConfig: gmap2MapConfig });

	tmpl.Trip.clear3DTrip = function (param) {
		var map = param.map;
		//Clearing Map Entity and disabled the Time.
		map.entities.removeAll();
		map.clock.shouldAnimate = false;

		//For removing the toolbar from map.
		var div = document.getElementById('tripToolbar');	
		//console.log("DIV", div);
		if (div) {
			div.remove();
		}

	}
	/*-----------------------3d-Trip-Playback-End--------------ABK-----------*/

	/*-----------------------3d-Vehicle-Track-Start-------------------------*/

	var track3DVehicleObjDyn;
	var vehiclelist = new Map();

	tmpl.Track.single3DVehicle = function (param) {
		var map = param.map;
		var vehicle3DModel = param.vehicle3DModel;
		var properties = param.properties;

		//*************INFOBoard Strat**************/

		var mapDiv = document.getElementById(globalMapDivID);

		
		//*************INFOBoard End**************/
		var vehicleId = param.vehicleId;
		var waypoints = param.packets;
		var timeStepInSeconds = 0;
		
		if(param.timeStepInSeconds)
		{
			timeStepInSeconds = param.timeStepInSeconds;
		}else{
			timeStepInSeconds=10;
		}

		let vehicle;
		track3DVehicle(vehicleId, waypoints, timeStepInSeconds, param);
	}
	
	
	track3DVehicleObjDyn = tmpl.Track.single3DVehicle.prototype = {

		start3DTrack: function (param) {
			var currentPoints = param.position;
			var vehicleId = param.vehicleid;
			var timeStepInSeconds = param.timeStepInSeconds;
			//var starTime = param.starTime;

			track3DVehicle(vehicleId, currentPoints, timeStepInSeconds, param);
		}
	}
	
    function track3DVehicle(vehicleid, waypoints, timeStepInSeconds = 10) {
            var totalSeconds = 10
            let alreadytracked = false
            const positionProperty = new Cesium.SampledPositionProperty()
            let routepath = []

            if (vehiclelist.has(vehicleid)) {
                alreadytracked = true
                //get last pos and then make A --> B
                let coordhistory = vehiclelist.get(vehicleid)
                let lastpoint = coordhistory.routecoords[coordhistory.routecoords.length - 1]
                routepath.push(lastpoint)
              //  console.log('>>>>>>>>>>Route-Path>>>>>>>', routepath)
               // console.log('Last-Point>>>>', lastpoint)

                console.log(routepath[routepath.length - 1].lat, ' , ', routepath[routepath.length - 1].lon)
                console.log('To')
                console.log(waypoints[0].lat, ', ', waypoints[0].lon)

                const cachearr = vehiclelist.get(vehicleid)
                let prevarr = cachearr.routecoords

                prevarr.push(waypoints[0])

                let routecoords = {
                    lat: waypoints[waypoints.length - 1].lat,
                    lon: waypoints[waypoints.length - 1].lon,
                }
                routepath.push(routecoords)
            } else {
                let geolocation = {
                    routecoords: [
                        {
                            lat: waypoints[waypoints.length - 1].lat,
                            lon: waypoints[waypoints.length - 1].lon,
                            //time: start
                        },
                    ],
                }
                vehiclelist.set(vehicleid, geolocation)
                /* 
                  const positionData = Cesium.Cartesian3.fromDegrees(
                      geolocation.routecoords[0].lon,
                      geolocation.routecoords[0].lat
                  )
                  let heading = Cesium.Math.toRadians(200)
                  let pitch = 0
                  let roll = 0
                  let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
                  let orientation = Cesium.Transforms.headingPitchRollQuaternion(positionData, hpr)
                  */
            }
            if (routepath.length > 1) {
                console.log('Track Start HERE..!')
                console.log('RoutePath-data', routepath)
                const start = Cesium.JulianDate.fromIso8601('2020-03-09T23:10:00Z')
                const stop = Cesium.JulianDate.addSeconds(start, timeStepInSeconds, new Cesium.JulianDate())
                //console.log('Start :', start, '\nStop :', stop)

                map.clock.startTime = start.clone()
                map.clock.stopTime = stop.clone()
                map.clock.currentTime = start.clone()
                map.timeline.zoomTo(start, stop)
                map.clock.multiplier = 1
                map.clock.shouldAnimate = true
                console.log('Routepath', routepath, '\n Routepath Length', routepath.length)

                for (let i = 0; i < routepath.length; i++) {
                    const dataPoint = routepath[i]
                    // Declare the time for this individual sample and store it in a new JulianDate instance.
                    const time = Cesium.JulianDate.addSeconds(
                        start,
                        i * timeStepInSeconds,
                        new Cesium.JulianDate()
                    )
                    const position = Cesium.Cartesian3.fromDegrees(dataPoint.lon, dataPoint.lat) //height (dataPoint.height)

                    //adding timestamp and coordinate
                    positionProperty.addSample(time, position)
                    map.entities.add({
                        description: `Location: (${dataPoint.lon}, ${dataPoint.lat})`, //, ${dataPoint.height}
                        position: position,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.RED,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //RELATIVE_TO_GROUND
                        },
                    });
                }

                if (vehicle) {
                    map.entities.remove(vehicle)
                }
                vehicle = map.entities.add({
                    id: vehicleid,
                    position: positionProperty,
                    //orientation: orientation,
                    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                    model: {
                        // uri: '../SampleData/models/GroundVehicle/GroundVehicle.glb',
                        uri: 'GroundVehicle.glb',
                        //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        //scale: 1,
                    },
                    path: new Cesium.PathGraphics({ width: 2 }),
                })
                map.trackedEntity = vehicle;

                //get current date and time
                const currentdate = new Date();
                const date = new Date(Date.UTC(currentdate.getFullYear(), (currentdate.getMonth()), currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()));
                //sampling start time 
                const currentime = Cesium.JulianDate.fromIso8601(date.toISOString());//start  time
                let endtime = Cesium.JulianDate.fromDate(new Date(stop));

                // const date = new Date(Date.UTC(currentdate.getFullYear(), (currentdate.getMonth()),currentdate.getDate(), currentdate.getHours(), currentdate.getMinutes(), currentdate.getSeconds()));
                // const currentime = map.clock.currentTime;
               // console.log(">>>>>>>>>>>", currentime);
                if (Cesium.JulianDate.greaterThanOrEquals(start, stop) && map.clock.shouldAnimate) {
                    console.log("YA STOPPING viewer.clock.shouldAnimate ");
                    map.clock.shouldAnimate = false;
                    map.clock.multiplier = 1;
                    //load the model with last coordinate
                    // return false;
                }
            } else {
                console.log('Push Second Package')
            }
       }

	/*-----------------------3d-Vehicle-Track-End-------------------------*/

	tmpl.Trip.firstplay = function () {
		console.log("I am being called 1");
		// var map = param.map;
		console.log("Trip Play Function-->1", tripDataForReplyFromDisplay);
		tripDataForReplyFromDisplay_flag = true;
		if (tripDataForReplyFromDisplay_flag === true) {
			// if(map){
			// map.getView().setZoom(15);                   //Added by Prashanth on 24-07-19
			// }
			tripDataForReplyFromDisplay.hideAllLayers = true;
			console.log("Trip Play Function-->2", tripDataForReplyFromDisplay);
			tmpl.Trip.animation(tripDataForReplyFromDisplay);
			tripDataForReplyFromDisplay_flag = false;
		} else {
			//console.log(current_status_flag);

		}
	}
	tmpl.Trip.pause = function (param) {
		var map = param.map;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				if (current_status_flag == "none") {

				} else if (current_status_flag == "start") {
					clearInterval(ivlDraw);
					current_status_flag = "pause";
				} else if (current_status_flag == "pause") {

				} else if (current_status_flag == "stop") {

				}
			}
			else {
				map.clock.shouldAnimate = false;
			}
		}
		catch (err) {
			console.error("ERROR Trip.clear: ", err);
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
		//console.log(data1);
		for (var i = 0; i < data1.length; i++) {
			var lat = parseFloat(data1[i].lat);
			var lon = parseFloat(data1[i].lon);
			var tempTime11 = data1[i].time.slice(0, 8);
			data1[i].time = tempTime11;
			var str = lon.toString() + lat.toString();
			if (tempFilterArray.indexOf(str) == -1) {
				tempFilterArray.push(str);
				uniqueData.push(data1[i]);
			}
			//console.log(data1[i].speed,data1[i].speed == 0 );
			if (data1[i].speed == 0) {

				if (track_halt_points_id.indexOf(str) == -1) {
					track_halt_points_id.push(str);
					track_halt_points.push({
						lat: data1[i].lat,
						lng: data1[i].lon,
						location: data1[i].location,
						date: data1[i].date,
						startTime: data1[i].time,
						endTime: data1[i].time,
						id: str
					});
				} else {
					track_halt_points[track_halt_points.length - 1].endTime = data1[i].time;
				}
			}
		}
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
			var view_port =
				map.getView().calculateExtent(map.getSize());
			var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
			if (vehicle_inside == false) {
				map.getView().setCenter(current);
			}
		}
		function drawAnimatedLine(startPt, endPt, steps, trak_animationSpeed, fn, properties, delay) {
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
				if (i > trak_animationSteps) {
					clearInterval(ivlDraw);
					extraAnimation();
					return;
				}
				newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
				panMap(newEndPt);
				temp_store_animation_pause.startPt = newEndPt;
				temp_store_animation_pause.steps = temp_store_animation_pause.steps - 1;
				var line = new ol.geom.LineString([startPt, newEndPt]);
				var point = new ol.geom.Point(newEndPt);
				var fea = new ol.Feature(line);
				fea.setProperties(properties);
				//console.log(newEndPt,endPt);

				if (newEndPt[0] == endPt[0] && newEndPt[1] == endPt[1]) {
					fea.set('inter', false);
					//console.log(true);
				}
				else {
					fea.set('inter', true);
				}

				var delay_halt_fea = new ol.Feature(point);
				delay_halt_fea.setProperties(properties);

				var p_fea = new ol.Feature(point);

				if (trip_lines_layer_flag == false) {
					trip_lines_layer = new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [fea]
						}),
						//style: styleFunction
						style: new ol.style.Style({
							stroke: new ol.style.Stroke({
								color: route_color,
								width: 4
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
					trip_lines_layer.setVisible(false);
				} else {



					if (Trip_global_delay_time != -1) {
						//console.log("outside",delay,Trip_global_delay_time);
						delay = parseInt(delay);
						if (delay < Trip_global_delay_time) {
							trip_lines_layer.getSource().addFeature(fea);
							firs_delayFlag = false;
						} else {


							if (firs_delayFlag == false) {
								//zzzzzzzzz
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
						trip_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);
					}
					else {
						trip_end_Marker.getSource().addFeatures([p_fea]);
					}
				}
				i++;
			}, trak_animationSpeed);
		}
		function extraAnimation() {
			if (index < uniqueData.length) {
				i = index;
				var lat = parseFloat(uniqueData[i].lat);
				var plat = parseFloat(uniqueData[i - 1].lat);
				var lon = parseFloat(uniqueData[i].lon);
				var plon = parseFloat(uniqueData[i - 1].lon);
				var point, p_point, p_point1;
				var s = time_diff(uniqueData[i].time, uniqueData[i - 1].time);
				s = s.split(':')[0] * 60 * 60 + s.split(':')[1] * 60 + s.split(':')[2];
				var delayProperties = s;
				if (appConfigInfo.mapData === "google") {
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
					if (appConfigInfo.mapData === "google") {
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
				var properties = {
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
				//if(param.animationHaltPoints == true){
				if (param.halt_points == true) {
					var track_halt_points_animation = [], uniqueDataAnimation = [];
					track_halt_points_animation = param.track_halt_points;
					uniqueDataAnimation = param.uniqueData;

					if (tmpl_trip_halt_animation_flag == false) {
						tmpl_trip_halt_animation_flag = true;
						tmpl_trip_halt_animation = new ol.layer.Vector({
							title: "trip_halt1",
							source: new ol.source.Vector(),
							style: new ol.style.Style({
								image: new ol.style.Icon({
									src: param.halt_img,
									anchor: [0.5, 1]
								})
							})
						});
						map.addLayer(tmpl_trip_halt_animation);
					} else {
						//console.log(temp_halt_index,(i-1));
						if (temp_halt_index == (i - 1)) {
							if ((i - 1) != 0) {
								//console.log(temp_halt_index == (i-1));
								var pres = [parseFloat(uniqueDataAnimation[i - 1].lon), parseFloat(uniqueDataAnimation[i - 1].lat)];
								//console.log("aa",uniqueDataAnimation[i].trip_icon,pres);
								if (appConfigInfo.mapData == "google") {
									pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
								}
								else {

								}
								var pointdata = new ol.geom.Point(pres);
								var feature2 = new ol.Feature({
									geometry: pointdata
								});
								feature2.setProperties(track_halt_points_animation[i - 1]);
								tmpl_trip_halt_animation.getSource().addFeature(feature2);
								//tmpl_trip_halt_animation.getSource().clear();
							}
						}
						if (uniqueDataAnimation[i].trip_icon != '') {
							temp_halt_index = i;
						}

					}


					if (i == 1) {
						if (tmpl_trip_start_animation_flag == false) {
							tmpl_trip_start_animation_flag = true;
							tmpl_trip_start_animation = new ol.layer.Vector({
								source: new ol.source.Vector(),
								title: "trip_start1",
								style: new ol.style.Style({
									image: new ol.style.Icon({
										src: param.start_url,
										anchor: [0.45, 1],
										anchorOrigin: 'top-bottom'
									})
								})
							});
							map.addLayer(tmpl_trip_start_animation);
							var pres = [parseFloat(uniqueData[0].lon), parseFloat(uniqueData[0].lat)];
							if (appConfigInfo.mapData == "google") {
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else {

							}
							var pointdata = new ol.geom.Point(pres);
							var feature2 = new ol.Feature({
								geometry: pointdata
							});
							feature2.setProperties(uniqueData[0]);
							feature2.set('rendering_type', 12);
							tmpl_trip_start_animation.getSource().addFeature(feature2);
						} else {
							//tmpl_trip_start_animation.getSource().clear();
							var pres = [parseFloat(uniqueData[0].lon), parseFloat(uniqueData[0].lat)];
							if (appConfigInfo.mapData == "google") {
								pres = ol.proj.transform(pres, 'EPSG:4326', 'EPSG:3857');
							}
							else {

							}
							var pointdata = new ol.geom.Point(pres);
							var feature2 = new ol.Feature({
								geometry: pointdata
							});
							feature2.setProperties(uniqueData[0]);
							feature2.set('rendering_type', 12);
							tmpl_trip_start_animation.getSource().addFeature(feature2);
							//tmpl_trip_start_animation.getSource().clear();
						}
					}
				}
				if (i == uniqueData.length - 1) {

				}
				//}
				drawAnimatedLine(p_point, point, trak_animationSteps, trak_animationSpeed, function () { }, properties, delayProperties);

			} else {
				//alert("zzz");
				tmpl.Trip.stop();
				if (tripEndCallbackFunc != undefined)
					tripEndCallbackFunc();
			}
			index = index + 1;
		}
		function panMap(point) {
			var current = point;//[lat,lon];
			var currentgps = new ol.geom.Point(current);
			var cur_veh = new ol.Feature(currentgps);
			var view_port =
				map.getView().calculateExtent(map.getSize());
			var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
			if (vehicle_inside == false) {
				map.getView().setCenter(current);
			}
		}

		function animatebtn(map) {
			try {
				var current_status_flag = "start";

				tmpl.Trip.pause = function (param) {
					var map = param.map;

					try {
						if (appConfigInfo.mapDimension == "2D") {
							if (current_status_flag == "none") {

							} else if (current_status_flag == "start") {
								clearInterval(ivlDraw);
								current_status_flag = "pause";
							} else if (current_status_flag == "pause") {

							} else if (current_status_flag == "stop") {

							}
						}
						else {
							map.clock.shouldAnimate = false;
						}
					}
					catch (err) {
						console.error("ERROR Trip.clear: ", err);
					}
				}
				tmpl.Trip.play = function () {
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
					if (level == '5' || level == 5) {
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
							if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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

							if (appConfigInfo.mapData === 'google' || 'hereMaps') {
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


	tmpl.Map.addFloorMap = function (param) {
		var target = param.target;
		var url = param.url;
		var zoomlevel = param.zoom;
		var callBackFun = param.callBackFunc;

		if (zoomlevel == undefined || zoomlevel == '' || zoomlevel == null) {
			zoomlevel = 19;
		}

		if (layoutMapObjectAPI) {
			var allLayers = layoutMapObjectAPI.getLayers();
			var layerLength = allLayers.getLength();
			for (var j = 0; j < layerLength; j++) {
				var lyr1 = allLayers.item(j);
				if (lyr1) {
					layoutMapObjectAPI.removeLayer(lyr1);
				}
			}
			layoutMapObjectAPI.setTarget(null);
			layoutMapObjectAPI = '';
			//delete layoutMapObjectAPI;
		}
		var extent = [77.6108670398, 12.9341000455, 77.612052073, 12.934699985];
		//var extent = [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4];
		var extent1 = ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
		var centerPoint = ol.extent.getCenter(extent1);

		var projection = new ol.proj.Projection({
			code: 'xkcd-image',
			units: 'pixels',
			extent: extent1
		});

		var view = new ol.View({
			center: centerPoint,
			zoom: zoomlevel,
			minZoom: parseInt(zoomlevel) - 2,
			maxZoom: 22
		});

		var layoutLayer = new ol.layer.Image({
			source: new ol.source.ImageStatic({
				url: url,
				projection: projection,
				imageExtent: extent1,
				imageLoadFunction: function (image, src) {
					var imageElement = image.getImage();
					imageElement.onload = function () {
						$(".loadingDiv").css("display", "none");
					};
					imageElement.src = src;
				}
			})
		});

		setTimeout(function () {
			console.log("from api layout");
			layoutMapObjectAPI = '';
			layoutMapObjectAPI = new ol.Map({
				layers: [
					layoutLayer
				],
				target: target,
				view: view
			});
			console.log("layoutMapObjectAPI", layoutMapObjectAPI);
			activate(layoutMapObjectAPI);

			if (callBackFun)
				callBackFun(layoutMapObjectAPI);
			return layoutMapObjectAPI;
		}, 500);
	}


	tmpl.Map.removeFloorMap = function () {
		if (layoutMapObjectAPI) {
			var allLayers = layoutMapObjectAPI.getLayers();
			var layerLength = allLayers.getLength();
			for (var j = 0; j < layerLength; j++) {
				var lyr1 = allLayers.item(j);
				if (lyr1) {
					layoutMapObjectAPI.removeLayer(lyr1);
				}
			}
			layoutMapObjectAPI.setTarget(null);
			//layoutMapObjectAPI = '';
			//delete layoutMapObjectAPI;
		}
	}

	tmpl.Map.getWFSLayerData = function (param) {
		var geoServerLayerName = param.geoserverlayername;
		var handleJson = param.callback;
		try {
			var gurl = appConfigInfo.wfslayerurl + "?service=WFS&version=1.1.0&request=GetFeature&typeName=" + geoServerLayerName + "&projection=EPSG:4326&outputFormat=json"
			var contentType = "application/x-www-form-urlencoded; charset=utf-8";
			if (window.XDomainRequest) //for IE8,IE9
				contentType = "text/plain";
			console.log("gurl~~~~~~", gurl);
			$.ajax({
				url: gurl,
				//data:"name=Ravi&age=12",
				type: "GET",
				dataType: "json",
				contentType: contentType,
				success: function (data) {
					console.log("gurl data~~~~~~", JSON.stringify(data));
					handleJson(JSON.stringify(data));

				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("You can not send Cross Domain AJAX requests: " + errorThrown);
				}
			});


		} catch (err) {
			console.error("Error at get WFS layer Data>>> " + err);
		}

	}
	
	tmpl.Map.addWFSLayerForTest = function (param) {
		try {
			var mapObj = param.map;
			var geoServerLayerName = param.geoserverlayername;
			var layerName = param.layername;
			var IconUrl = param.iconurl;
			
			var sourceWFS = new ol.source.Vector({
				format: new ol.format.GeoJSON({
					extractGeometryName: true
				}),
				title: geoServerLayerName,
				url: appConfigInfo.wfslayerurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + geoServerLayerName + '&outputFormat=application/json',
				strategy: ol.loadingstrategy.bbox,
				projection: 'EPSG:4326'
			});
			
			var uRl = appConfigInfo.wfslayerurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename='+geoServerLayerName+'&outputFormat=application/json';
			console.log("URL =>>", uRl);

			var vectorLayerWFS = new ol.layer.Vector({
				source: sourceWFS,
			});

			vectorLayerWFS.setProperties({
				title: layerName
			});
			
			mapObj.addLayer(vectorLayerWFS);
		} catch (err) {
			console.error("Error at adding WMS layer >>> " + err);
		}
	}

	tmpl.Map.addWFSLayer = function (param) {
		try {
			var mapObj = param.map;
			var geoServerLayerName = param.geoserverlayername;
			var layerName = param.layername;
			var IconUrl = param.iconurl;

			var sourceWFS = new ol.source.Vector({
				format: new ol.format.GeoJSON({
					extractGeometryName: true
				}),
				title: geoServerLayerName,
				url: appConfigInfo.wfsurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + geoServerLayerName + '&outputFormat=application/json',
				strategy: ol.loadingstrategy.bbox,
				projection: 'EPSG:4326'
			});
			//var newurl = appConfigInfo.wfsurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + geoServerLayerName + '&outputFormat=application/json';
			//console.log("newurl>>>",newurl);
			// if (IconUrl === undefined) {
			// 	IconUrl = appConfigInfo.mapSDKURL + 'poi/10.png';
			// }
			var vectorLayerWFS = new ol.layer.Vector({
				source: sourceWFS,
				style: new ol.style.Style({
					image: new ol.style.Icon(({
						anchor: [0.5, 1],
						src: IconUrl
					})),
					text: new ol.style.Text({
						text: '${name}',
						font: '12px Calibri,sans-serif',
						fill: new ol.style.Fill({
							color: '#000'
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 2
						}),
					})
				})
				//style: polygonStyleFunction,
			});

			// Polygons
			// function polygonStyleFunction(feature, resolution) {
			// 	return new Style({
			// 	stroke: new Stroke({
			// 		color: 'blue',
			// 		width: 1,
			// 	}),
			// 	fill: new Fill({
			// 		color: 'rgba(0, 0, 255, 0.1)',
			// 	}),
			// 	text: getText(feature, resolution),
			// 	});
			// }


			vectorLayerWFS.setProperties({
				title: layerName
			});
			//==============
			var overlay = new ol.layer.Vector({
				title: layerName,
				visible: true,
				source: sourceWFS
			});
			tmpl_setMap_layer_global_array.push({
				layer: overlay,
				title: layerName,
				visibility: true,
				map: mapObj
			});
			console.log("WFS-LAYER>>>>", tmpl_setMap_layer_global_array);
			//==============

			mapObj.addLayer(vectorLayerWFS);
			//var layers = mapObj.getLayers();
			//layers.insertAt(1, vectorLayerWFS);
			tmpl_setMap_layer_global.push({
				layer: layerName,
				title: geoServerLayerName,
				visibility: true,
				map: mapObj
			});

			console.log("ADDWFS", tmpl_setMap_layer_global);
		} catch (err) {
			console.error("Error at adding WMS layer >>> " + err);
		}

	}

	tmpl.Map.addGMLLayer = function (param) {
		try {
			var mapObj = param.map;
			var layerName = param.layername;
			var url = param.url;

			var vectorLayerWFS = new ol.layer.Vector({
				source: new ol.source.Vector({
				  parser: new ol.parser.ogc.GML_v3(),
				  url: url
				}),
				style: new ol.style.Style({rules: [
				  new ol.style.Rule({
					symbolizers: [
					  new ol.style.Polygon({
						strokeColor: '#bada55'
					  })
					]
				  })
				]})
			  });

			// var vectorLayerWFS = new OpenLayers.Layer.Vector("GML", {
			// 	protocol: new OpenLayers.Protocol.HTTP({
			// 	  url: url,
			// 	  format: new OpenLayers.Format.GML()
			// 	}),
			// 	strategies: [new OpenLayers.Strategy.Fixed()]
			// }) ;

			vectorLayerWFS.setProperties({
				title: layerName
			});

			mapObj.addLayer(vectorLayerWFS);

			console.log("ADDWFS", tmpl_setMap_layer_global);
		} catch (err) {
			console.error("Error at adding WMS layer >>> " + err);
		}

	}
    
	/***** This API is for Adding Custom Style to the WFSLayer (For Point, Line, Polygon) *****/
    tmpl.Overlay.addWFSCustomLayer = function (param) {
        var mapObj = param.map;
		var layername = param.LayerName;
        var geoServerLayerName = param.geoServerLayerName;
        var imgUrl = param.imgurl;
        var bgcolor = param.bgcolor; //for Polygon
        var fillColor = param.fillColor; //for Polygon

        var ffillColor = param.ffillColor; // for Point , Polygon

        var fbgcolor = param.fbgcolor; // for Point, Polygon 

		if(imgUrl == undefined){
			imgUrl = "https://www.linkpicture.com/q/icons8-maps-30_2.png";
		}
					
		if(bgcolor == undefined){
			bgcolor = "rgba(10, 10, 10, 0.8)"; //Polygon Border color
		}

		if(fillColor == undefined){
			fillColor = "rgba(255, 150, 150, 0.8)"; //Polygon fill color
		}
							
		if(ffillColor == undefined){
			ffillColor = "rgba(20, 10, 200, 0.8)";
		}

		if(fbgcolor == undefined){
			fbgcolor = "rgba(200, 10, 20, 0.8)";
		}
    
        var ftype;
        var fstyle;
        firstGeojsonRun = true;
    
        var styleFunction = function () {
            var geoJSONFormat = new ol.format.GeoJSON();
    
            if (firstGeojsonRun == true) {
                var urle = appConfigInfo.wfslayerurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + geoServerLayerName + '&outputFormat=application/json';
                $.ajax({
                    url: urle,
                    success: function (data) {
                        // here, parse the data and delete all unwanted features
                        var features = geoJSONFormat.readFeatures(data);
                        ftype = data.features[0].geometry.type;
                        console.log("-----------", data.features[0]);
                        console.log("-----------", data.features[0].geometry.type);
                        //console.log("-----------",data.features[0].properties.name);
                    }
                });
    
                if (ftype == 'Point') {
                    fstyle = new ol.style.Style({
                        image: new ol.style.Icon(({
                            anchor: [0.5, 1.0],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 0.85,
                            src: imgUrl,//appConfigInfo.mapSDKURL+"poi/10.png",
                            size: [52, 64],
                            scale: 0.5,
                        })),
                        text: new ol.style.Text({
                            //text: layername,
                            offsetY: -37.5,
                            fill: new ol.style.Fill({
                                color: ffillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: fbgcolor,
                                width: 1
                            }),
                            font: 140 / 10 + 'px arial'
                        })
                    });
    
                    firstGeojsonRun = true;
                    return fstyle;
    
                } else if (ftype == 'Polygon') {
                    fstyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: bgcolor,
                            lineDash: [4],
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: fillColor
                        }),
                        text: new ol.style.Text({
                            //text: layername,
                            offsetY: -37.5,
                            fill: new ol.style.Fill({
                                color: ffillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: fbgcolor,
                                width: 1
                            }),
                            font: 140 / 10 + 'px arial'
                        })
                    });
                    firstGeojsonRun = true;
                    return fstyle;
    
                } else if (ftype == 'LineString') {
                    fstyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: bgcolor,
                            lineDash: [4],
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: fillColor
                        }),
                        text: new ol.style.Text({
                            //text: layername,
                            offsetY: -37.5,
                            fill: new ol.style.Fill({
                                color: ffillColor
                            }),
                            stroke: new ol.style.Stroke({
                                color: fbgcolor,
                                width: 1
                            }),
                            font: 140 / 10 + 'px arial'
                        })
                    });
                    firstGeojsonRun = true;
                    return fstyle;
                }
            }
        };
    
        //=========Adding WFS Layer Data=========//
        var sourceWFS = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                //extractGeometryName: true
                showPointNames: false,
            }),
            title: layername,
            url: appConfigInfo.wfslayerurl + '/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=' + geoServerLayerName + '&outputFormat=application/json',
            strategy: ol.loadingstrategy.bbox,
            projection: 'EPSG:4326'
        });
    
        var vectorLayerWFS = new ol.layer.Vector({
            source: sourceWFS,
            style: styleFunction,//styleFunction,
            visible: true
        });
    
        vectorLayerWFS.setProperties({
            title: layername
        });
        //==================
        vectorLayerWFS.title = layername;
        vectorLayerWFS.set('layer_name', layername);
        vectorLayerWFS.set('title', layername);
        mapObj.addLayer(vectorLayerWFS);
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

	tmpl.Map.addESRICustomlayer = function (param) {
		var mapObj = param.map;
		var layerUrl = param.layerUrl;
		var layerName = param.layerName;
		var layerTitle = param.layerTitle;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var token;
				var settings = {
					"url": "https://maps.kdmc.gov.in/agportal/sharing/rest/generateToken",
					"method": "POST",
					"timeout": 0,
					"headers": {
					  "Content-Type": "application/x-www-form-urlencoded"
					},
					"data": {
					  "username": "nec.india",
					  "password": "Nec@India1234",
					  "client": "referrer",
					  "referer": "https://maps.kdmc.gov.in/agserver/admin",
					  "expiration": "518400",
					  "f": "json"
					}
				  };
				  
				  $.ajax(settings).done(function (response) {
					console.log("~~~~~~~~TOKEN~~~~~~~~", response);
					token = response.token;
				  });		  


				// var WMSlayerObj = new ol.layer.Tile({
				// 	source: new ol.source.XYZ({
				// 		url: "https://maps.kdmc.gov.in/agserver/rest/services/icc/gis_mapservice_iccc/MapServer/32?token=xeQkz3zl-JNmNQjyrZz3o2KPmd-3bcMevDjGKX2gP2oAqh3W_Oq6nc9wKlOeQfasahlJQFKkrJ4oui9gDHt-jS0zi5NEdvpI1EH6vFRo5ietl63r6fIVEqoldGk7wR_t0lrfCEdaVKaa02NNT0YKlIAV6fQsfva6iehCQuGffLM.&f=json",
				// 		//url: layerUrl+ layerName + "?token=" + token,
				// 	})
				// });

				const parcelsSource = new ol.source.VectorTile({
					format: new ol.format.MVT(),
					url: `https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/tile/{z}/{y}/{x}.pbf`
				  });
		  
				  const WMSlayerObj = new ol.layer.VectorTile({
					source: parcelsSource
				  });



				// const apiKey = "xeQkz3zl-JNmNQjyrZz3o2KPmd-3bcMevDjGKX2gP2oAqh3W_Oq6nc9wKlOeQfasahlJQFKkrJ4oui9gDHt-jS0zi5NEdvpI1EH6vFRo5ietl63r6fIVEqoldGk7wR_t0lrfCEdaVKaa02NNT0YKlIAV6fQsfva6iehCQuGffLM.";
				// const basemapId = "ArcGIS:Streets";
				// const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;
		  
				// olms(mapObj, basemapURL).then((mapObj) => {
		  
				//   const WMSlayerObj = new ol.source.VectorTile({
				// 	format: new ol.format.MVT(),
				// 	url: `https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/tile/{z}/{y}/{x}.pbf`
				//   });
		  
				// });




				mapObj.addLayer(WMSlayerObj);
				WMSlayerObj.setProperties({ title: layerTitle });
			}
		}
		catch (err) {
			console.error("ERROR Map.addWMSLayer: ", err);
		}
	}

	
tmpl.Overlay.addESRICustomLayer2 = function(param){
	var mapObj = param.map;
	var url = param.url;
	var layername = param.layername;
	var layerid = param.layerid;
	var visible = param.visible;
	
	
	var dtext;
	var ftype;
	var fstyle;
	var fCount = 0;
	firstGeojsonRun=true;	 
	 
	//var styleFunction = function () {
		
	var geoJSONFormat = new ol.format.GeoJSON();
	var tokenn = "3C-YI1W9JURCCKscxFgu-xloK60ND9ANslfImoERFProISOquaK639RocA1TH1h-J80QqbbNzpbNxj0R0z211dkVlzIzE5feIp9debMKyNa-6prO91sRQO44xaPUK9NDNf8yAFpCnUXtytCQ1tcqDIC9ngWxcRdyWC835qBTL6Y.";
	var urle = "https://maps.kdmc.gov.in/agserver/rest/services/icc/gis_mapservice_iccc/MapServer/"+"/"+layerid+"query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7Bxmin%3A73.037109375%2Cymin%3A19.228176737766262%2Cxmax%3A73.125%2Cymax%3A19.311143355064655%2CspatialReference%3A%7Bwkid%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&token="+tokenn+"&f=json";
		
	
	// if(firstGeojsonRun==true)
	// { 
		// var urle = "https://operator.smartkdcl.com/map/agserver/rest/services/icc/gis_mapservice_iccc/FeatureServer"+"/"+layerid+"/query?where=1%3D1&user:nec.india,password:Nec@India1234&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=geojson";
		// var urle = "https://operator.smartkdcl.com/map/agserver/rest/services/icc/gis_mapservice_iccc/MapServer/"+"/"+layerid+"query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7Bxmin%3A73.037109375%2Cymin%3A19.228176737766262%2Cxmax%3A73.125%2Cymax%3A19.311143355064655%2CspatialReference%3A%7Bwkid%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&token="+tokenn+"&f=json";
			var dt;			
	   $.ajax({
		  url: urle,
		  success: function(data) {
			// here, parse the data and delete all unwanted features
			var features = geoJSONFormat.readFeatures(data);
			dt = data;
			//ftype = data.features[0].geometry.type ;
			// console.log("-----------",data.features[0]);
			// console.log("-----------",data.features[0].geometry.type);
		  }
		});
	
	if(ftype=='Point')
					{
					 
					
						 fstyle = new ol.style.Style({
							  image: new ol.style.Icon(({
									anchor: [0.5, 1.0],
									anchorXUnits: 'fraction',
									anchorYUnits: 'fraction',
									opacity: 0.85,
									src: imgUrl,//appConfigInfo.mapSDKURL+"poi/10.png",
									size: [52,64],
									scale:0.5,
								  })),
							  text: new ol.style.Text({
									//text: layername,
									offsetY: -37.5,
									fill: new ol.style.Fill({
										color: ffillColor
									}),
									stroke: new ol.style.Stroke({
									  color: fbgcolor,
									  width: 1
									}),
									font: 140/10 + 'px arial'
								})
						  });
					firstGeojsonRun=true;
					return fstyle;
				
					} else if(ftype=='Polygon'){
				
						fstyle = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: bgcolor,
							lineDash: [4],
							width: 3
						}),
						fill: new ol.style.Fill({
							color: fillColor
						}),
						  text: new ol.style.Text({
									//text: layername,
									offsetY: -37.5,
									fill: new ol.style.Fill({
										color: ffillColor
									}),
									stroke: new ol.style.Stroke({
									  color: fbgcolor,
									  width: 1
									}),
									font: 140/10 + 'px arial'
								})
					});
					firstGeojsonRun=true;
					return fstyle;
				
					}else if(ftype =='LineString'){
					
				
						fstyle = new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: bgcolor,
							lineDash: [4],
							width: 3
						}),
						fill: new ol.style.Fill({
							color: fillColor
						}),
						  text: new ol.style.Text({
									//text: layername,
									offsetY: -37.5,
									fill: new ol.style.Fill({
										color: ffillColor
									}),
									stroke: new ol.style.Stroke({
									  color: fbgcolor,
									  width: 1
									}),
									font: 140/10 + 'px arial'
								})
					});
					firstGeojsonRun=true;
					return fstyle;
					
			
					}		
			//}
	
			//};
			
			 
					//console.log("URL from map vendor", urle);
					var tokenn = "3C-YI1W9JURCCKscxFgu-xloK60ND9ANslfImoERFProISOquaK639RocA1TH1h-J80QqbbNzpbNxj0R0z211dkVlzIzE5feIp9debMKyNa-6prO91sRQO44xaPUK9NDNf8yAFpCnUXtytCQ1tcqDIC9ngWxcRdyWC835qBTL6Y.";
	 
					var vectoresri = new ol.layer.Vector({
					title: layername,
					map: mapObj,
					source: new ol.source.Vector({
						 //url : "https://maps.kdmc.gov.in/agserver/rest/services/icc/gis_mapservice_iccc/MapServer"+"/"+layerid+"query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7Bxmin%3A73.037109375%2Cymin%3A19.228176737766262%2Cxmax%3A73.125%2Cymax%3A19.311143355064655%2CspatialReference%3A%7Bwkid%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&token="+tokenn+"&f=json",
						url : "https://maps.kdmc.gov.in/agserver/rest/services/icc/gis_mapservice_iccc/MapServer/32/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A73.037109375%2C%22ymin%22%3A19.228176737766262%2C%22xmax%22%3A73.125%2C%22ymax%22%3A19.311143355064655%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&token=IzsvxcXP9F94Thkd_BaSOko3lJgb24HekKaAZIl4vEA6PvLcj-v9GmHownSX2VF0cyzUVDENn1AGtb5enzC7C72hugALyKk7jtdX3XnNFnNS4oUl69S2g6EHIZJ83BDtwI7BdvDD8wgRLmfQbQw95Z3JLkL39Tziv7rx9XWTJj8.&f=json",
						 //url : features,
					title: layername,
					  format: new ol.format.GeoJSON({
	
						  showPointNames: false,
	
						  })//,
					}),
					// style: styleFunction,//styleFunction,
					 visible: true
				});
				
				
				vectoresri.title=layername;
				vectoresri.set('layer_name',layername);
				vectoresri.set('title',layername);
				vectoresri.setProperties({title: layername});
				mapObj.addLayer(vectoresri);
				//vectoresri.setMap(mapObj);
	}
	

	tmpl.Overlay.addGeometryHW = function (param) {
		var map = param.map;

		var mapObj = map;//2D
		var borderColor = param.borderColor;//2D
		var borderWidth = param.borderWidth;//2D
		var label = param.label;//2D
		var getHoverLabel = param.getHoverLabel;//2D
		var borderAnimate = param.borderAnimate;//2D
		var dottedLine = param.dottedLine;//2D
		var format = new ol.format.WKT();//2D
		var colorval = param.color;//2D

		if (borderWidth != undefined) {
			borderWidth = param.borderWidth;
			console.log("borderWidth:", borderWidth);
		} else {
			borderWidth = 10;
		}

		if (colorval != undefined) {
			if (appConfigInfo.mapDimension == "2D") {
				colorval = 'red';
			}
			else {

				switch (colorval) {
					case "red":
						colorval = Cesium.Color.RED;
						console.log("colorval:", colorval);
						break;

					case "orange":
						colorval = Cesium.Color.ORANGE;
						console.log("colorval:", colorval);
						break;

					case "yellow":
						colorval = Cesium.Color.GREENYELLOW;
						console.log("colorval:", colorval);
						break;

					case "green":
						colorval = Cesium.Color.SEAGREEN;
						console.log("colorval:", colorval);
						break;

					case "blue":
						colorval = Cesium.Color.SLATEBLUE;
						console.log("colorval:", colorval);
						break;

					case "purple":
						colorval = Cesium.Color.DARKVIOLET;
						console.log("colorval:", colorval);
						break;

					case "brown":
						colorval = Cesium.Color.BROWN;
						console.log("colorval:", colorval);
						break;

					case "magenta":
						colorval = Cesium.Color.DEEPPINK;
						console.log("colorval:", colorval);
						break;

					default:
						colorval = Cesium.Color.RED;
						console.log("borderColor:", colorval);
				}

			}

		} else {

			if (appConfigInfo.mapDimension == "2D") {
				colorval = 'red';
			}
			else {
				colorval = Cesium.Color.RED;
			}
		}

		if (borderColor != undefined) {
			if (appConfigInfo.mapDimension == "2D") {
				borderColor = 'red';
			}
			else {

				switch (borderColor) {
					case "red":
						borderColor = Cesium.Color.RED;
						console.log("borderColor:", borderColor);
						break;

					case "orange":
						borderColor = Cesium.Color.ORANGE;
						console.log("borderColor:", borderColor);
						break;

					case "yellow":
						borderColor = Cesium.Color.GREENYELLOW;
						console.log("borderColor:", borderColor);
						break;

					case "green":
						borderColor = Cesium.Color.SEAGREEN;
						console.log("borderColor:", borderColor);
						break;

					case "blue":
						borderColor = Cesium.Color.SLATEBLUE;
						console.log("borderColor:", borderColor);
						break;

					case "purple":
						borderColor = Cesium.Color.DARKVIOLET;
						console.log("borderColor:", borderColor);
						break;

					case "brown":
						borderColor = Cesium.Color.BROWN;
						console.log("borderColor:", borderColor);
						break;

					case "magenta":
						borderColor = Cesium.Color.DEEPPINK;
						console.log("borderColor:", borderColor);
						break;

					default:
						borderColor = Cesium.Color.RED;
						console.log("borderColor:", borderColor);
				}

			}

		} else {

			if (appConfigInfo.mapDimension == "2D") {
				borderColor = 'red';
			}
			else {
				borderColor = Cesium.Color.RED;
			}
		}

		var color;//2D


		var id = param.id;
		var lyrName = param.layer;
		var property = param.properties;
		var geometryVal = param.geometry;
		var type = param.type;
		var fill = param.fill;
		// var label_color = param.label_color;
		// var callbackFunc = param.callbackFunc;
		var geometry = [];
		var callbackProp = null;
		var feature;


		if (appConfigInfo.mapDimension == "2D") {

			var format = new ol.format.WKT();
			feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});

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
			feature.setProperties(property);
			feature.set('layer_name', lyrName);
			feature.set('title', lyrName);
			var source = new ol.source.Vector({
				features: [feature]
			});

			var newLayer = new ol.layer.Vector({
				title: lyrName,
				visible: true,
				source: source
			});
			map.addLayer(newLayer);
		}
		else {
			tmpl.Feature.remove({
				map: map,
				id: id
			});
			tmpl.Feature.remove({
				map: map,
				id: id + "_label"
			});

			var items = appConfigInfo.color;
			function random_item(items) {
				return items[Math.floor(Math.random() * items.length)];
			}

			var wktType;
			if (type == undefined) {
				wktType = getWKTtype();
				// alert(wktType);
				console.log(wktType);
			}
			else {
				wktType = type;
			}

			function getWKTtype() {
				var temp = geometryVal.split('(');
				var wkt = temp[0];
				wkt = wkt.toLowerCase();
				return wkt;
			}

			if (wktType == "point") {
				var labelText;
				var imageUrl = "https://trinitystorage01.blob.core.windows.net/trinityiccc/layer_attachment_siETC_1.png";
				var pointLatLon = createLatLonArray(geometryVal, 'point');
				// console.log("pointLatLon ===> ",pointLatLon);
				if (property.text) {
					labelText = property.text;
				}
				else {
					labelText = '';
				}
				var billboard = new Cesium.BillboardGraphics({
					image: imageUrl,
					width: 32,
					height: 32,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.9, 1.5e5, 0.3)
				});

				var point = map.entities.add({
					position: Cesium.Cartesian3.fromDegrees(pointLatLon[0], pointLatLon[1]),
					name: lyrName,
					id: id,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					show: true,
					// description: description,
					billboard: billboard,
					label: {
						text: labelText,
						font: 'bold 10pt Montserrat, sans-serif',
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0),
						// fillColor: Cesium.Color.fromCssColorString(getData[i].label_color),
						// outlineColor: Cesium.Color.fromCssColorString(getData[i].label_bgcolor),
						showBackground: false,
						backgroundPadding: new Cesium.Cartesian2(7, 5),
						fillColor: Cesium.Color.BLACK,
						backgroundColor: Cesium.Color.BLACK,
						// outlineColor : Cesium.Color.BLACK,
						// style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						style: Cesium.LabelStyle.FILL,
						outlineWidth: 1,
						scaleByDistance: new Cesium.NearFarScalar(5.0e3, 1.0, 1.5e7, 0.5),
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						pixelOffset: new Cesium.Cartesian2(0, 15),
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				});
				point.entProp = property;
				point.entProp.layer_name = lyrName;
			}

			else if (wktType == "linestring") {

				var material = new Cesium.PolylineOutlineMaterialProperty({
					glowPower: 0.9,
					color: Cesium.Color.BLUE
					// color : Cesium.Color.ORANGE,
					// outlineWidth : 2,
					// outlineColor : Cesium.Color.BLACK
				});

				var linegeom = createLatLonArray(geometryVal, 'line');
				var length = linegeom.length;
				var labelPt = {
					longitude: linegeom[length - 2],
					latitude: linegeom[length - 1]
				};

				var entity = map.entities.add({
					id: id,
					name: lyrName,
					description: description,
					polyline: {
						positions: Cesium.Cartesian3.fromDegreesArray(linegeom),
						width: borderWidth,
						material: material,
						shadows: Cesium.ShadowMode.ENABLED,
						depthFailMaterial: material
					}
				});

				var polylineLabel = map.entities.add({
					position: Cesium.Cartesian3.fromDegrees(labelPt.longitude, labelPt.latitude),
					name: lyrName,
					description: description,
					id: id + "_label",
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
					label: {
						text: property.name,
						font: 'bold 10pt Montserrat, sans-serif',
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
						fillColor: Cesium.Color.BLACK,
						// style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						style: Cesium.LabelStyle.FILL,
						outlineWidth: 1,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						pixelOffset: new Cesium.Cartesian2(0, 20),
						disableDepthTestDistance: Number.POSITIVE_INFINITY,
						scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5)
					}
				});
				entity.entProp = property;
				callbackProp = entity.entProp;


			}
			else if (wktType == "polygon") {

				// Getting centroid for label
				var cent = [];
				cent = createLatLonArray(geometryVal, 'poly');
				var centroidArray = getCentroid(cent, 2);
				var polygon = turf.polygon([centroidArray]);
				// var centroid = turf.centroid(polygon);
				var centroid = turf.centerOfMass(polygon);


				/*	var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
									
					for (var key2 in property) {
					console.log("tmpl.Overlay.addGeometry: On Click : ",key2,property,property.dataid);			
								
						var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
						switch (key2) {
							case "id":
								break;
							case "data_id":
								break;
							case "data":
								break;
				
							case "geom":
								break;
								
							case "uniqueid":
								break;
								
							case "region_id":
								break;
									
							case "zone_id":
								break;
									
							case "ward_id":
								break;
								
							case "region_name":
								break;
								
							case "dataid":
								break;
		
							case "groupid":
								break;
		
							case "item_id":
								break;
		
							case "imgurl":
								break;
		
							case "layer_name":
								break;
		
							case "label_color":
								break;
		
							case "label_bgcolor":
								break;
		
							default:
								description += '<tr><th>' + attr + '</th><td>' + property[key2] + '</td></tr>';
						}
					}
					description += '</tbody></table>';*/



				// Adding entity on map
				if (fill == true) {
					//borderColor = Cesium.Color.DARKVIOLET;
					var poly1 = map.entities.add({
						name: lyrName,
						id: id,
						//description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'poly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: borderWidth,//10.0//borderWidth
							outlineColor: borderColor,
							perPositionHeight: true,
							fill: true,
							material: colorval.withAlpha(0.5),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}
					});
				} else {
					//borderColor = Cesium.Color.DARKVIOLET;
					var poly1 = map.entities.add({
						name: lyrName,
						id: id,
						description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'poly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: borderWidth,//borderWidth
							outlineColor: borderColor,
							perPositionHeight: true,
							fill: false,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
						}
					});
				}

				var polygonLabel = map.entities.add({
					position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
					name: lyrName,
					id: id + "_label",
					description: description,
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
					label: {
						text: property.name,
						font: 'bold 10pt Montserrat, sans-serif',
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
						fillColor: Cesium.Color.BLACK,
						// style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						style: Cesium.LabelStyle.FILL,
						outlineWidth: 1,
						disableDepthTestDistance: Number.POSITIVE_INFINITY,
						scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5),
						//show: true
					}
				});
				poly1.entProp = property;
				callbackProp = poly1.entProp;

				// for(var key2 in callbackProp){
				// // var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
				// switch(key2){
				// case "data":
				// break;

				// case "the_geom":
				// break;

				// // case "layer_name":
				// // break;

				// // case "label_color":
				// // break;

				// // case "label_bgcolor":
				// // break;

				// default: callbackFunc(callbackProp[key2]);
				// }
				// }

			} else if (wktType == "polygonz") {

				// // Getting centroid for label
				// var cent = [];
				// cent = createLatLonArray(geometryVal,'polyZ');
				// var centroidArray = getCentroid(cent,2);
				// var polygon = turf.polygon([centroidArray]);
				// // var centroid = turf.centroid(polygon);
				// var centroid = turf.centerOfMass(polygon);

				var items = appConfigInfo.color;

				var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
				for (var key2 in property) {

					var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
					switch (key2) {
						case "id":
							break;

						case "data_id":
							break;

						case "groupid":
							break;

						case "item_id":
							break;

						case "imgurl":
							break;

						case "layer_name":
							break;

						case "label_color":
							break;

						case "label_bgcolor":
							break;

						case "the_geom":
							break;

						case "name":
							description += '<tr><th>Name</th><td>' + property["name"] + '</td></tr>';
							break;

						default:
							description += '<tr><th>' + attr + '</th><td>' + property[key2] + '</td></tr>';
					}
				}
				description += '</tbody></table>';

				function random_item(items) {
					return items[Math.floor(Math.random() * items.length)];
				}

				// Adding entity on map
				if (fill == true) {
					var polyZ = map.entities.add({
						name: lyrName,
						id: id,
						description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(createLatLonArray(geometryVal, 'polyZ')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.RED,
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(random_item(items)), 0.3),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
				} else {
					var polyZ = map.entities.add({
						name: lyrName,
						id: id,
						description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(createLatLonArray(geometryVal, 'polyZ')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.RED,
							perPositionHeight: true,
							fill: false,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
				}
				polyZ.entProp = property;
				callbackProp = polyZ.entProp;
			} else if (wktType == "multipolygon") {

				// Getting centroid for label
				var cent = [];
				cent = createLatLonArray(geometryVal, 'multipoly');
				var centroidArray = getCentroid(cent, 2);
				var polygon = turf.polygon([centroidArray]);
				// var centroid = turf.centroid(polygon);
				var centroid = turf.centerOfMass(polygon);

				var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
				for (var key2 in property) {

					var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
					switch (key2) {
						case "id":
							break;

						case "data_id":
							break;

						case "groupid":
							break;

						case "item_id":
							break;

						case "imgurl":
							break;

						case "layer_name":
							break;

						case "label_color":
							break;

						case "label_bgcolor":
							break;

						case "the_geom":
							break;

						case "name":
							description += '<tr><th>Name</th><td>' + property["name"] + '</td></tr>';
							break;

						default:
							description += '<tr><th>' + attr + '</th><td>' + property[key2] + '</td></tr>';
					}
				}
				description += '</tbody></table>';

				function random_item(items) {
					return items[Math.floor(Math.random() * items.length)];
				}

				// Adding entity on map
				if (fill == true) {
					var multiPoly = map.entities.add({
						name: lyrName,
						id: id,
						description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'multipoly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.RED,
							perPositionHeight: true,
							fill: true,
							material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(random_item(items)), 0.3),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
				} else {
					var multiPoly = map.entities.add({
						name: lyrName,
						id: id,
						description: description,
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(geometryVal, 'multipoly')),
							//height : 40000,
							// extrudedHeight : 2500,
							outline: true,
							outlineWidth: 10.0,
							outlineColor: Cesium.Color.RED,
							perPositionHeight: true,
							fill: false,
							// material : Cesium.Color.ORANGE.withAlpha(0.3),
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							zIndex: -1
						}
					});
				}

				var polygonLabel = map.entities.add({
					position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
					name: lyrName,
					id: id + "_label",
					// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
					label: {
						text: property.name,
						font: 'bold 10pt Montserrat, sans-serif',
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
						fillColor: Cesium.Color.BLACK,
						// style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						style: Cesium.LabelStyle.FILL,
						outlineWidth: 1,
						// backgroundColor: Cesium.Color.fromBytes(0.165, 0.165, 0.165, 0.8),
						// showBackground: true,
						disableDepthTestDistance: Number.POSITIVE_INFINITY,
						scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5)
					}
				});
				multiPoly.entProp = property;
				callbackProp = multiPoly.entProp;

				// for(var key2 in callbackProp){
				// // var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
				// switch(key2){
				// case "data":
				// break;

				// case "the_geom":
				// break;

				// // case "layer_name":
				// // break;

				// // case "label_color":
				// // break;

				// // case "label_bgcolor":
				// // break;

				// default: callbackFunc(callbackProp[key2]);
				// }
				// }
			} else {
				console.error("ERROR: type is wrong!");
			}
		}


	}

	tmpl.Map.getGeorss = function (param) {
		var mapObj = param.map;
		// var layerUrl = param.layerUrl;
		// var layerName = param.layerName;
		// var layerTitle = param.layerTitle;

		try {
			if (appConfigInfo.mapDimension == "2D") {
				var settings = {
					"url": "http://192.168.1.211:9090/trinityMapserver/EWDS/wms/reflect?layers=district_ensemble_humidity_avg_Day1&format=rss",
					"method": "GET",
					"timeout": 0,
				  };
				  
				  $.ajax(settings).done(function (response) {
					//console.log(response);
				  });
		}
	}
		catch (err) {
			console.error("ERROR Map.addWMSLayer: ", err);
		}
	}


	tmpl.Map.switchWMSLayerVisibility = function (param) {
		var mapObj = param.map;
		var layerTitle = param.layerTitle;
		var visibility = param.visible;

		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layerTitle) {
					// mapObj.removeLayer(existingLayer);
					existingLayer.setVisible(visibility);
				}
			}
		}
	}

	tmpl.Map.removeWMSLayer = function (param) {
		var mapObj = param.map;
		var layerTitle = param.layerTitle;

		try {
			if (appConfigInfo.mapDimension == "2D") {
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

}).call(this, {});


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




/*
Array.prototype.contains = function ( needle ) {
   for (i in this) {
	   if (this[i] == needle) return true;
   }
   return false;
}*/

var bufferLayer;
/*var bufferLayer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});*/
tmpl.Layer.clearBuffer = function (param) {
	var mapObj = param.map;
	if (bufferLayer != undefined)
		bufferLayer.getSource().clear();
}

tmpl.Layer.getFeaturesWithinBuffer = function (param) {
	var rdus = param.radius;
	var lyrName = param.layerName;
	var propertyId = param.propertyId;
	var mapObj = param.map;
	var mycallback = param.callbackFunc;
	var wgs84Sphere = new ol.Sphere(6378137);
	var format = new ol.format.WKT();
	var featureArray = [], featureJson = [], resultArray = [], featureId = [];
	var rec, ft, src, lonlatConvrtd, circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, circleExtent, wktBufferGeom;
	bufferLayer = new ol.layer.Vector({
		source: new ol.source.Vector()
	});
	/*if(bufferLayer != undefined)
		bufferLayer.getSource().clear();*/
	bufferLayer.setProperties({ lname: "bufferVector" });
	mapObj.addLayer(bufferLayer);
	var st = new ol.style.Style({
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
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('lname') === "bufferVector") {
				existingLayer.getSource().clear();
			}
			if (existingLayer.get('title') === lyrName) {
				src = existingLayer.getSource();
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					featureArray.push(fea);
					if (fea.getProperties()['id'] == propertyId) {
						ft = fea;
					}
				});
			}
		}
	}
	lonlat = ft.getGeometry().getCoordinates();
	if (appConfigInfo.mapData == 'google' || 'hereMaps') {
		lonlatConvrtd = ol.proj.transform([lonlat[0], lonlat[1]], 'EPSG:3857', 'EPSG:4326');
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [lonlatConvrtd[0], lonlatConvrtd[1]], rdus, 64);
		circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setStyle(st);
		bufferLayer.getSource().addFeature(circleFeature);
		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
		circleExtent = cirGeomtry4326.getExtent();
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
	}
	else {
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [lonlat[0], lonlat[1]], rdus, 64);
		circle3857 = circle4326;
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setStyle(st);
		bufferLayer.getSource().addFeature(circleFeature);
		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry;
		circleExtent = cirGeomtry4326.getExtent();
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
	}
	for (var i = 0; i < featureArray.length; i++) {
		var coord = featureArray[i].getGeometry().getCoordinates();
		var coordConvert = ol.proj.transform([coord[0], coord[1]], 'EPSG:3857', 'EPSG:4326');
		var containsCoordinate = ol.extent.containsCoordinate(circleExtent, coordConvert);
		if (containsCoordinate == true) {
			var id = featureArray[i].getProperties()['id'];
			featureId.push(id);
			var featureGeometry = format.writeGeometry(featureArray[i].getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			featureJson.push({ index: id, geometry: featureGeometry });
			//featureJson.push(featureGeometry);
		}
	}

	var jsonString = JSON.stringify(featureJson);

	var rsltAry = [];
	var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/contain/fromjson/" + wktBufferGeom + "/" + jsonString;
	$.ajax({
		url: urlL,
		success: function (data) {
			//console.log(data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].result == true) {
					var record = { id: data[i].id };
					rsltAry.push(record);
				}

			}
			mycallback(rsltAry);
		},
		error: function () {
			console.log("there was an error!");
		},
	});
	return true;
}


//////heatmap


//circle radius


tmpl.Create.circle = function (param) {
	var mapObj = param.map;
	var latlon = param.latlon;
	var rdus = param.radius;
	var tlabel = '';
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;
	var mycallback = param.callbackFunc;
    var properties = null;
	var layerName = param.layer;

	var textclr = param.textclr;
	var textFillClr = param.textFillClr;

	if(layerName == undefined || layerName == null){
		layerName = 'circleLayer';
	}
	var wgs84Sphere = new ol.Sphere(6378137);
	var format = new ol.format.WKT();
	tlabel = param.label;
	if(param.properties){
		properties = param.properties;
	}
	
	var featureArray = [], featureJson = [], resultArray = [], featureId = [];
	var circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, circleExtent, wktBufferGeom, style;
	var noLayer = false;
	var existingLayer;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (i = 0; i < length; i++) {
		var tempLayer = Layers.item(i);
		if (tempLayer.get('lname') == layerName) {
			noLayer = true;
			existingLayer = tempLayer;
			//existingLayer.getSource().clear();
		}
	}
	if (!noLayer) {
		circleLayer = new ol.layer.Vector({
			source: new ol.source.Vector()
		});
		circleLayer.setProperties({ lname: layerName }); 
		circleLayer.set('title', layerName);
		
		if(layerName){
			gbl_allClusterLayers.push(circleLayer);
			tmpl_setMap_layer_global_array.push({
				layer: circleLayer,
				title: layerName,
				visibility: true,
				map: mapObj
			});
		}
		
		mapObj.addLayer(circleLayer);
		existingLayer = circleLayer;		
	}
	if(textclr == undefined){
		textclr = '#000';	
	}

	if(textFillClr == undefined){
		textFillClr = '#fff';	
	}

	if (strokeColor && fillColor) {
		if(param.label)
		{
				style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: 1
			}),
		  text: new ol.style.Text({
			font: '12px Calibri,sans-serif',
			fill: new ol.style.Fill({ color: textclr }),
			stroke: new ol.style.Stroke({
			  color: textFillClr, width: 3
			}),
			// get the text from the feature - `this` is ol.Feature
			// and show only under certain resolution
			text: tlabel
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
		
		}
		else
		{
			
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
			
		}
	
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
	if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData =='hereMaps') {
		//lonlatConvrtd=lonlat;//ol.proj.transform([lonlat[0],lonlat[1] ], 'EPSG:3857', 'EPSG:4326'); 
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
		circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setProperties({properties});
		circleFeature.setStyle(style);
		existingLayer.getSource().addFeature(circleFeature);

		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
	}
	else {
		circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
		circle3857 = circle4326;
		circleFeature = new ol.Feature(circle3857);
		circleFeature.setStyle(style);
		circleFeature.setProperties({properties});
		existingLayer.getSource().addFeature(circleFeature);
		cirGeomtry = circleFeature.getGeometry();
		cirGeomtry4326 = cirGeomtry;
		wktBufferGeom = format.writeGeometry(cirGeomtry4326);
	}
	mycallback(wktBufferGeom);
	//  mapObj.addControl(new ol.control.LayerSwitcher());
}


tmpl.Map.getZoomLevel = function (param) {
	var map = param.map;
	var mapZoomLevel = param.callback;
	if (appConfigInfo.mapDimension == '2D') {
		var ghostZoom = map.getView().getZoom();
		map.on('moveend', (function () {
			if (ghostZoom != map.getView().getZoom()) {
				ghostZoom = map.getView().getZoom();
				//console.log('zoomend',ghostZoom,map.getView().getZoom());
				if (ghostZoom != undefined) {
					mapZoomLevel(ghostZoom);
				} else {
					var view = gmap.getView();
					view.on('change:resolution', () => {
						var z = view.getZoom();
						if (z != undefined) {
							mapZoomLevel(z);
						}

					})
				}
			}
		}));
	}
}


///polygon layer

tmpl.Create.polygon = function (param) {
	var mapObj = param.map;
	var lyrname = param.layer;
	var jsonobj = param.features;
	var strokeColor = param.strokeColor;
	if (!param.strokeColor) {
		strokeColor = 'rgba(0,0,0,0.5)';
	}
	var fillColor = param.fillColor;
	if (!param.fillColor) {
		fillColor = 'rgba(255, 0, 0, 0.2)';
	}
	var labelFillColor = param.features.labelFillColor;
	var value = param.value;
	var lineDash = param.lineDash;
	var borderWidth = param.borderWidth;
	if (!param.borderWidth) {
		borderWidth = 1;
	}

	var name = param.name;
	var property = param.property;
	var locationType = param.locationType;
	var labelStrokeColor = param.features.labelStrokeColor;
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
			existingLayer = tempLayer;// existingLayer.getSource().clear();
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
	var labelDisplay = '';


	for (var i = 0, length = getdata.length; i < length; i++) {
		var s_strokeColor = strokeColor;
		if (getdata[i].strokeColor) {
			s_strokeColor = getdata[i].strokeColor;
		}
		var s_fillColor = fillColor;
		if (getdata[i].fillColor) {
			s_fillColor = getdata[i].fillColor;
		}
		var s_label = '';
		if (getdata[i].label) {
			s_label = getdata[i].label.toString();
		}

		//console.log(s_strokeColor,s_fillColor,getdata[i]);
		if (s_strokeColor != null && s_fillColor != null) {

			if (lineDash) {
				drawStyle = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: s_strokeColor,
						lineDash: [.1, 5],
						width: borderWidth
					}),
					fill: new ol.style.Fill({
						color: s_fillColor,
					}),
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: 'rgba(55, 155, 55, 0.5)',
						})
					}),
					text: new ol.style.Text({
						font: '10px' + ' ' + 'Arial',
						textAlign: 'center',
						text: s_label,
						offsetX: 0,
						offsetY: 0,
						fill: new ol.style.Fill({
							color: labelFillColor
						}),
						stroke: new ol.style.Stroke({
							color: labelStrokeColor
						})
					})
				});
			} else {
				drawStyle = new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: s_strokeColor,
						//lineDash: [.1, 5],
						width: borderWidth
					}),
					fill: new ol.style.Fill({
						color: s_fillColor,
					}),
					image: new ol.style.Circle({
						radius: 7,
						fill: new ol.style.Fill({
							color: 'rgba(55, 155, 55, 0.5)',
						})
					}),
					text: new ol.style.Text({
						font: '10px' + ' ' + 'Arial',
						textAlign: 'center',
						text: s_label,
						offsetX: 0,
						offsetY: 0,
						fill: new ol.style.Fill({
							color: labelFillColor
						}),
						stroke: new ol.style.Stroke({
							color: labelStrokeColor
						})
					})
				});
			}

		}
		else {

			drawStyle = new ol.style.Style({
				fill: new ol.style.Fill({
					color: fillColor //'rgba(255, 0, 0, 0.2)' 
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor, //'rgba(0,0,0,0.5)',//clor,//'#ffcc33',
					width: borderWidth
				}),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: 'rgba(155,150,100,0.5)'//clor// '#DC143C'//'#ffcc33'
					})
				}),
				text: new ol.style.Text({
					font: '10px' + ' ' + 'Arial',
					textAlign: 'center',
					text: s_label,
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
		if (appConfigInfo.mapData === 'google') {
			var feature = format.readFeature(getdata[i].geometry);
			feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
			//console.log("feature.getProperties() :",feature.getProperties());
			feature.setProperties(getdata[i].properties);
			feature.setProperties({ id: getdata[i].id });
			feature.setProperties({ text: getdata[i].label });
			feature.setProperties({ label: getdata[i].label });
			feature.setProperties({ tooltip: getdata[i].tooltip });
			feature.setProperties({ value: getdata[i].value });
			feature.setProperties({ name: getdata[i].name });
			feature.setProperties({ locationType: getdata[i].locationType });
			feature.setProperties({ property: getdata[i].property });
			feature.setStyle(drawStyle);
			featureDataAry.push(feature);
		}
		else {
			var feature = format.readFeature(getdata[i].geometry);
			feature.getGeometry();
			feature.setStyle(drawStyle);
			feature.setProperties(getdata[i].properties);
			feature.setProperties({ tooltip: getdata[i].tooltip });
			feature.setProperties({ value: getdata[i].value });
			feature.setProperties({ id: getdata[i].id });
			feature.setProperties({ name: getdata[i].name });
			feature.setProperties({ property: getdata[i].property });
			feature.setProperties({ locationType: getdata[i].locationType });
			featureDataAry.push(feature);
		}



	}
	existingLayer.getSource().addFeatures(featureDataAry);
	//  mapObj.addControl(new ol.control.LayerSwitcher());
	return true;
}


/*
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

	try {
		if (appConfigInfo.mapDimension == "2D") {
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
					var feature = format.readFeature(getdata[i].geometry);
					feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
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
		else {
			// if(!strokeWidth){
			// strokeWidth = 2;
			// }

			var i = 0;
			while (i < getdata.length) {
				// Getting centroid for label
				var cent = [];
				cent = createLatLonArray(getdata[i].geometry, 'poly');
				var centroidArray = getCentroid(cent, 2);
				var polygon = turf.polygon([centroidArray]);
				// var centroid = turf.centroid(polygon);
				var centroid = turf.centerOfMass(polygon);

				// Adding entity on map	
				var poly1 = mapObj.entities.add({
					name: lyrname,
					id: getdata[i].id,
					polygon: {
						hierarchy: Cesium.Cartesian3.fromDegreesArray(createLatLonArray(getdata[i].geometry, 'poly')),
						outline: true,
						outlineWidth: 1,
						outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(strokeColor), 1.0),
						perPositionHeight: true,
						fill: true,
						material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(fillColor), 0.5),
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});

				if (getdata[i].label) {
					var polygonLabel = mapObj.entities.add({
						position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
						name: lyrname,
						id: getdata[i].id + "_label",
						// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
						label: {
							text: getdata[i].label,
							font: '14pt Georgia',
							// heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000),
							fillColor: Cesium.Color.WHITE,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 2,
							outlineColor: Cesium.Color.BLACK,
							showBackground: true,
							backgroundColor: Cesium.Color.BLACK,
							backgroundPadding: new Cesium.Cartesian2(4, 3),
							disableDepthTestDistance: Number.POSITIVE_INFINITY,
							scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5)
						}
					});
					poly1.entProp = getdata[i].properties;
				}
				else { }
				i++;
			}
		}
	}
	catch (err) {
		console.error("ERROR Create.polygon: ", err);
	}
}
*/

tmpl.Style.categorisePolygon = function (param) {
	var categorisedData = param.categories;
	var layer = param.layer;
	var property = param.property;
	var mapObj = param.map;
	var label = param.label;
	var PolygonLayer;
	var polyStyle, featureArray = [];
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') == layer) {
				PolygonLayer = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					featureArray.push(fea);
				});
			}
		}
	}
	if (PolygonLayer != undefined)
		mapObj.removeLayer(PolygonLayer);
	for (var j = 0, length = categorisedData.length; j < length; j++) {
		for (var i = 0, length1 = featureArray.length; i < length1; i++) {
			var featureProperty = parseFloat(featureArray[i].getProperties()[0][property]);
			if (featureProperty >= categorisedData[j].min_range && featureProperty <= categorisedData[j].max_range) {
				polyStyle = new ol.style.Style({
					fill: new ol.style.Fill({
						color: categorisedData[j].fillColor
					}),
					stroke: new ol.style.Stroke({
						color: categorisedData[j].strokeColor,//clor,//'#ffcc33',
						width: 1
					}),
					image: new ol.style.Circle({
						radius: 1,
						fill: new ol.style.Fill({
							color: 'rgba(155,150,100,0.7)'//clor// '#DC143C'//'#ffcc33'
						})
					})
				});
				featureArray[i].setStyle(polyStyle);
			}
		}
	}
	if (PolygonLayer != undefined)
		mapObj.addLayer(PolygonLayer);
}

////point style
tmpl.Create.point = function (param) {
	var mapObj = param.map;
	var lat = param.latitude;
	var lon = param.longitude;
	var geometry;

	if (appConfigInfo.mapData === 'google' || 'hereMaps') {
		geometry = new ol.geom.Point(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
	}
	else {
		var cor = [parseFloat(lon), parseFloat(lat)];
		geometry = new ol.geom.Point(cor);

	}

	var featureval = new ol.Feature({
		geometry: geometry
	});


	return featureval;
}

tmpl.Create.pointLayer = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var layerName = param.layer;
	//var layerSwitcher = param.layerSwitcher;
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;

	var getdata = jsonobj;
	if (getdata.length == 0) {
		return false;
	}
	var featureDataAry = [];
	var style;
	if (strokeColor != null && fillColor != null) {
		style = new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({
					color: fillColor
				}),
				stroke: new ol.style.Stroke({
					width: 1,
					color: strokeColor
				})
			})
		});
	} else {
		style = new ol.style.Style({
			image: new ol.style.Circle({
				radius: 5,
				fill: new ol.style.Fill({
					color: 'rgba(124,252,0,0.2)'
				}),
				stroke: new ol.style.Stroke({
					width: 1,
					color: 'rgb(124,252,0)'
				})
			})
		});
	}
	for (var i = 0, length = getdata.length; i < length; i++) {
		var geometry;
		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else {
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
			geometry: geometry
		});
		featureval.setStyle(style);
		featureval.setProperties(getdata[i].properties);
		featureDataAry.push(featureval);
	}
	var source = new ol.source.Vector({
		features: featureDataAry
	});
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var pointLayerPresent = false;
	for (var i = 0; i < length; i++) {
		var layerTemp = Layers.item(i);
		if (layerTemp.get('title') == layerName) {
			pointLayerPresent = true;
			layerTemp.getSource().addFeatures(featureDataAry);
		}
	}
	if (pointLayerPresent == false) {
		var overlay = new ol.layer.Vector({
			title: layerName,
			visible: true,
			source: source
		});
		mapObj.addLayer(overlay);
		/*if(layerSwitcher)
			mapObj.addControl(new ol.control.LayerSwitcher());*/
		pointLayerPresent = true;
	}
	return true;
}


tmpl.Style.categorisePoint = function (param) {
	var categorisedData = param.categories;
	var layer = param.layer;
	var property = param.property;
	var mapObj = param.map;
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;

	var pointStyle, featureArray = [];
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var PointLayer;
	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') == layer) {
				PointLayer = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					featureArray.push(fea);
				});
			}
		}
	}
	if (PointLayer != undefined)
		mapObj.removeLayer(PointLayer);
	for (var j = 0, length = categorisedData.length; j < length; j++) {
		for (var i = 0, length1 = featureArray.length; i < length1; i++) {
			var featureProperty = parseFloat(featureArray[i].getProperties()[0][property]);
			if (featureProperty >= categorisedData[j].min_range && featureProperty <= categorisedData[j].max_range) {
				pointStyle = new ol.style.Style({
					image: new ol.style.Circle({
						radius: categorisedData[j].radius,
						fill: new ol.style.Fill({
							color: fillColor
						}),
						stroke: new ol.style.Stroke({
							width: 1,
							color: strokeColor
						})
					})
				});
				featureArray[i].setStyle(pointStyle);
			}
		}
	}
	if (PointLayer != undefined)
		mapObj.addLayer(PointLayer);
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

	try {
		if (appConfigInfo.mapDimension == "2D") {
			tmpl.Fence.removeInteraction({
				map: mapObj
			});
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
		else {
			tmpl.Layer.remove({ map: mapObj, layer: "Polygon Area" });
		}
	}
	catch (err) {
		console.error("ERROR Fence.clear: ", err);
	}
}
/*
tmpl.HeatMap.create = function(param){
	var mapObj = param.map;
	var getdata = param.data;
	var layer = param.layer;
	var blur = param.blur;
	if(blur == undefined)
	blur = 10;
	var radius = param.radius;
	if(radius == undefined)
	radius = 20;
	var weight;	
	var featureDataAry = [];
	var geometry;
	for (var i = 0, length = getdata.length; i < length; i++){
		if(appConfigInfo.mapData==='google'){
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else{
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
			geometry     : geometry
			
		});
		if(getdata[i].weight){
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
		title :layer,
		blur: blur,
		radius: radius,
		opacity: .5	   
	});
	//mapObj.addLayer(vector_heat);	  

tmpl_setMap_layer_global.push({
				layer : vector_heat,
				title :  layer
			});
		
	vector_heat.setMap(mapObj);
			
}*/
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
		if (appConfigInfo.mapData == 'google' || 'hereMaps') {
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
			if (appConfigInfo.mapData == "google") {
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


/*tmpl.Route.addOnClickRoute = function(param){

	var mapObj = param.map;
	var datas = param.feature;
	var layerName = param.layerName;
	
	var noLayer,routeLine,bufferLine;
	var feature,featureBuffer;
	
	var format = new ol.format.WKT();
	
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for(var i=0;i<length;i++){
		var existingLayer=Layers.item(i);
		if(existingLayer.get('lname') === layerName){
			noLayer = true;
			routeLayer = existingLayer;
		}
	}
	if (!noLayer){
		routeLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 6
				})
			})
		});
		routeLayer.setProperties({lname:layerName});
		routeLayer.setProperties({title:layerName});
		mapObj.addLayer(routeLayer);
	}

	for(var i=0;i<datas.length;i++){
		wayPointId = [];
		routeLine = datas[i].geometry;
		bufferLine = datas[i].buffer;
		if(appConfigInfo.mapData == 'google'){
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
			featureBuffer = format.readFeature(bufferLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		}
		else{
			feature = format.readFeature(routeLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
			featureBuffer = format.readFeature(bufferLine, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		} 
		//feature.setProperties({'id':datas[i].id});
		
		var keyNames = Object.keys(datas[i]);
		for(var name=0;name< keyNames.length;name++) {
			if(keyNames[name] == "geometry"){
			}else{
				var value = datas[i][keyNames[name]];
				var x =keyNames[name]
							feature.set(''+x+'',''+value+'');
				featureBuffer.set(''+x+'',''+value+'');
			}
		}

		routeLayer.getSource().addFeature(feature);	
		routeLayer.getSource().addFeature(featureBuffer);
		

		var rec = {routeId: datas[i].id};
		gbl_routeIdsOnClick.push(rec);		
	}
	console.log("gbl_routeIdsOnClick :",gbl_routeIdsOnClick);
}*/


var circleLayer;
tmpl.Layer.clearCircle = function (param) {
	var mapObj = param.map;
	if (circleLayer != undefined)
		circleLayer.getSource().clear();
}


var drawPOI, modifyPOI, modifyPOIC;
tmpl.Create.POICircle = function (param) {
	var mapObj = param.map;
	var icon = param.image;
	var rdus = param.radius;
	var callbackFunc = param.callbackFunc;

	/*mapObj.removeInteraction(drawPOI);
	mapObj.removeInteraction(modifyPOI);*/

	tmpl.POI.clearPOICircleInteractions({ map: mapObj });

	var format = new ol.format.WKT();
	var features = new ol.Collection();
	var source = new ol.source.Vector();
	var noLayer = false;
	var existingLayer, latlon;

	var lonlat, coord, wktGeom, address;

	var Layers = mapObj.getLayers();
	for (i = 0; i < Layers.getLength(); i++) {
		var tempLayer = Layers.item(i);
		if (tempLayer.get('lname') === 'poivector') {
			noLayer = true;
			existingLayer = tempLayer;
			existingLayer.getSource().clear();

			tmpl.Layer.clearCircle({ map: mapObj });

		}
	}
	if (!noLayer) {
		poiVector = new ol.layer.Vector({
			source: source,
			style: new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: [0.5, 1],
					src: icon
				}))
			})
		});
		poiVector.setProperties({ lname: "poivector" });
		poiVector.setProperties({ myId: "poiUnique" });
		poiVector.setProperties({ title: "poivector" });
		mapObj.addLayer(poiVector);
		existingLayer = poiVector;
	}

	modifyPOI = new ol.interaction.Modify({
		features: features,
		deleteCondition: function (event) {
			return ol.events.condition.shiftKeyOnly(event) &&
				ol.events.condition.singleClick(event);
		}
	});

	modifyPOI.on('modifyend', function (event) {
		tmpl.Layer.clearCircle({ map: mapObj });
		var feature = event.features;
		var geometryVal = feature.a[0].getGeometry();
		lonlat = feature.item(0).getGeometry().getCoordinates();
		if (appConfigInfo.mapData === 'google' || 'hereMaps') {
			coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
			wktGeom = format.writeGeometry(feature.item(0).getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
		}
		else {
			coord = lonlat;//feature.getGeometry().getCoordinates();
			wktGeom = format.writeGeometry(feature.item(0).getGeometry());
		}
		event.stopPropagation();
		mapObj.removeInteraction(drawPOI);
		tmpl.Geocode.getGeocode({
			point: [coord[0], coord[1]],
			callbackFunc: handleGeocode
		});
		function handleGeocode(data) {
			address = data.address;
			tmpl.Create.circle({ map: mapObj, latlon: [coord[1], coord[0]], radius: param.radius, strokeColor: null, fillColor: null, callbackFunc: test2 });
			function test2(a) {
				var rec = { point: wktGeom, radius: rdus, address: address, geometry: a };
				callbackFunc(rec);
			}
		}

	});
	function addInteractionPOI() {
		drawPOI = new ol.interaction.Draw({
			features: features,
			source: poiVector.getSource(),
			type: 'Point'
		});
		mapObj.addInteraction(drawPOI);
		drawPOI.on('drawend', function (event) {
			var feature = event.feature;
			var geometryVal = feature.getGeometry();
			lonlat = feature.getGeometry().getCoordinates();
			if (appConfigInfo.mapData === 'google' || 'hereMaps') {
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				latlon = [coord[1], coord[0]];
				wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coord = lonlat;//feature.getGeometry().getCoordinates();
				latlon = [coord[1], coord[0]];
				wktGeom = format.writeGeometry(feature.getGeometry());
			}
			event.stopPropagation();
			mapObj.removeInteraction(drawPOI);
			mapObj.addInteraction(modifyPOI);
			console.log(coord[1]);
			tmpl.Zoom.toXYcustomZoom({
				map: mapObj,
				latitude: coord[1],
				longitude: coord[0],
				zoom: 15
			});



			tmpl.Geocode.getGeocode({
				point: coord,
				callbackFunc: handleGeocode
			});
			function handleGeocode(data) {
				address = data.address;
				tmpl.Create.circle({ map: mapObj, latlon: latlon, radius: param.radius, strokeColor: null, fillColor: null, callbackFunc: test2 });
				function test2(a) {
					var rec = { point: wktGeom, radius: rdus, address: address, geometry: a };
					callbackFunc(rec);
				}
			}

		});
	}
	addInteractionPOI();
}

var CircleLayer;
tmpl.POI.addPOICircleGeometry = function (param) {
	var mapObj = param.map;
	var lyrName = param.layer;
	var features = param.features;
	var format = new ol.format.WKT();
	var feature;
	var featureDataAry = [];
	var lyrName_circle = lyrName + "_API_CircleLayer";
	// This layerName is Attaching With User Giving LayerName  // By Joel
	//mapObj.removeInteraction(modifyPOI);
	tmpl.Layer.clearData({
		map: mapObj,
		layer: lyrName
	});
	//  tmpl.Layer.clearData is modified as ABOVE
	///////////////////////////////////////////////	tmpl.Layer.clearData({map:map,layer:'POILayer'});

	tmpl.POI.clearPOICircleInteractions({
		map: mapObj
	});

	for (var i = 0; i < features.length; i++) {
		if (appConfigInfo.mapData == 'google') {
			feature = format.readFeature(features[i].geometry, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});
		} else {
			feature = format.readFeature(features[i].geometry, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
		}
		feature.setStyle(new ol.style.Style({
			image: new ol.style.Icon(({
				anchor: [0.5, 1],
				src: features[i].image
			}))
		}));
		var keyNames = Object.keys(features[i]);
		for (var name = 0; name < keyNames.length; name++) {
			if (keyNames[name] == "geometry") { } else {
				var value = features[i][keyNames[name]];
				var x = keyNames[name]
				feature.set('' + x + '', '' + value + '');
			}
		}
		featureDataAry.push(feature);
	}
	var source = new ol.source.Vector({
		features: featureDataAry
	});
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var isLayerPresent11 = false;
	var CircleLayerTemp = false;

	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') == lyrName) {
				isLayerPresent11 = true;
				existingLayer.getSource().addFeatures(featureDataAry);
			} else if (existingLayer.get('title') == lyrName_circle) {
				CircleLayerTemp = existingLayer;
				//mapObj.removeLayer(existingLayer); 
				// Here Removable, But layerArray Contain this layer, So removing only after exiting the loop 
			}

		}
	}
	if (CircleLayerTemp != false) {
		mapObj.removeLayer(CircleLayerTemp);
	}

	if (isLayerPresent11 == false) {
		var newLayer = new ol.layer.Vector({
			title: lyrName,
			visible: true,
			source: source
		});
		isLayerPresent11 == true;
		newLayer.setProperties({
			lname: lyrName
		});
		newLayer.setProperties({
			myId: "myUnique"
		});
		newLayer.setProperties({
			title: lyrName
		});
		newLayer.setProperties({
			CircleLayerAttached: true
		});
		mapObj.addLayer(newLayer);
		//	existingLayer = newLayer;  //removed by joel
	}



	CircleLayer = new ol.layer.Vector({
		title: lyrName_circle,
		visible: true,
		//CircleLayerAttached: false,
		//CircleLayer:true,
		source: new ol.source.Vector()
	});

	CircleLayer.setProperties({
		lname: lyrName_circle
	});
	CircleLayer.setProperties({
		myId: "myUnique2"
	});
	CircleLayer.setProperties({
		title: lyrName_circle
	});
	//CircleLayer.setProperties({CircleLayerAttached:false});
	mapObj.addLayer(CircleLayer);


	var wgs84Sphere = new ol.Sphere(6378137);
	var circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, wktBufferGeom, style;
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
	for (var j = 0; j < features.length; j++) {


		var circleLatlon = features[j].geometry;
		/*var tc = circleLatlon.split("POINT(")[1];
		tc = tc.split(')')[0];
		tc = tc.split(' ');
		var latc = parseFloat(tc[1]);
		var lonc = parseFloat(tc[0]);*/
		var p1 = circleLatlon.split('(');
		var p2 = p1[1].split(')');
		var p3 = p2[0].split(' ');
		var latc = parseFloat(p3[1]);
		var lonc = parseFloat(p3[0]);
		if (appConfigInfo.mapData == 'google') {
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [lonc, latc], features[j].radius, 64);
			circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			circleFeature.setId("c_" + features[j].id);
			circleFeature.set("id", "c_" + features[j].id);

			var keyNames1 = Object.keys(features[j]);
			for (var name = 0; name < keyNames1.length; name++) {
				if (keyNames1[name] == "geometry") { } else {
					var value1 = features[j][keyNames1[name]];
					var x1 = keyNames1[name];
					circleFeature.set('' + x + '', '' + value + '');
				}
			}

			CircleLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		} else {
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [lonc, latc], features[j].radius, 64);
			circle3857 = circle4326;
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			circleFeature.setId("c_" + features[j].id);
			circleFeature.set("id", "c_" + features[j].id);

			var keyNames1 = Object.keys(features[j]);
			for (var name = 0; name < keyNames1.length; name++) {
				if (keyNames1[name] == "geometry") { } else {
					var value1 = features[j][keyNames1[name]];
					var x1 = keyNames1[name];
					circleFeature.set('' + x + '', '' + value + '');
				}
			}

			//circleFeature.setProperties(features[j].getProperties());

			CircleLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry;
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		}
	}
}


var resultGetEditDetailsPOI = {};
tmpl.Feature.cancelPOICircleEdit = function (param) {
	var mapObj = param.map;
	var feature = resultGetEditDetailsPOI.feature;
	if (feature == undefined) {
		mapObj.removeInteraction(modifyPOIC);
	} else {
		feature.getGeometry().setCoordinates(resultGetEditDetailsPOI.coordinates);

		var existingLayer = resultGetEditDetailsPOI.existingLayer;
		var existingCircle = resultGetEditDetailsPOI.existingCircle;

		existingCircle.setStyle(new ol.style.Style({
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
					color: 'rgba(55, 155, 55, 0.5)'
				})
			})
		})
		);

		var editedCircle = existingLayer.getSource().getFeatureById(resultGetEditDetailsPOI.cPropertyId);
		existingLayer.getSource().removeFeature(editedCircle);
		existingLayer.getSource().addFeature(existingCircle);
		mapObj.removeInteraction(modifyPOIC);
		feature_poi_edit_id = '';
		feature_poi_edit_layer = '';
		feature_poi_edit_layer_callback = '';
	}
}

var feature_poi_edit_id;
var feature_poi_edit_layer;
var feature_poi_edit_layer_callback;

tmpl.POI.editPOICircle = function (param) {
	var mapObj = param.map;
	var callbackFunc = param.callbackFunc;
	var zoom = param.zoom;

	var propertyId = param.id;
	var lyrName = param.layerName;

	feature_poi_edit_layer_callback = param.getDetailsCallbackFunc;
	feature_poi_edit_id = propertyId;
	feature_poi_edit_layer = lyrName;

	var ft, latlon, wktGeom, coord, value, previousFeature, zoomExtent, zoomCoord, existingLayer, existingCircle;

	var format = new ol.format.WKT();

	tmpl.POI.clearPOICircleInteractions({ map: mapObj });

	var selectfeatureIdEdit = new ol.interaction.Select({ wrapX: false, condition: ol.events.condition.click });
	var Layers = mapObj.getLayers();

	for (i = 0; i < Layers.getLength(); i++) {
		existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') == lyrName) {
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == propertyId) {
						value = fea.getGeometry().getType();
						previousFeature = fea;
						ft = fea;

						existingCircle = CircleLayer.getSource().getFeatureById("c_" + propertyId);//existingLayer.getSource().getFeatureById("c_"+propertyId);

						existingCircle.setStyle(new ol.style.Style({
							stroke: new ol.style.Stroke({
								color: 'green',
								width: 1
							}),
							fill: new ol.style.Fill({
								color: 'green'
							}),
							image: new ol.style.Circle({
								radius: 7,
								fill: new ol.style.Fill({
									color: 'green',
								})
							})
						})
						);
						CircleLayer.getSource().removeFeature(existingCircle);
						//existingLayer.getSource().removeFeature(existingCircle);
						CircleLayer.getSource().addFeature(existingCircle);
						//existingLayer.getSource().addFeature(existingCircle);

						//	existingLayer.getSource().clear();
						existingLayer.getSource().removeFeature(previousFeature);
						existingLayer.getSource().addFeature(previousFeature);
					}
				});
			}


		}
	}
	var circleRadius = ft.getProperties().radius;
	if (zoom == true) {
		zoomExtent = existingCircle.getGeometry().getExtent();
		if (appConfigInfo.mapData == "google" || 'hereMaps') {
			zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
		} else {
			zoomCoord = zoomExtent;
		}
		tmpl.Zoom.toExtent({
			map: mapObj,
			extent: zoomCoord
		});
	}
	selectfeatureIdEdit.getFeatures().a = [];
	selectfeatureIdEdit.getFeatures().a.push(ft);
	modifyPOIC = new ol.interaction.Modify({
		features: selectfeatureIdEdit.getFeatures()
	});

	resultGetEditDetailsPOI.coordinates = ft.getGeometry().getCoordinates();

	resultGetEditDetailsPOI.existingCircle = existingCircle;

	resultGetEditDetailsPOI.existingLayer = existingLayer;

	modifyPOIC.on('modifyend', function () {
		if (value === 'Point') {
			lonlat = ft.getGeometry().getCoordinates();
		}
		else if (value === 'LineString') {
			lonlat = ft.getGeometry().getFirstCoordinate();
		}
		else if (value === 'Polygon' || value === 'Circle' || value === 'Box') {
			lonlat = ft.getGeometry().getInteriorPoint().getCoordinates();
		}
		if (appConfigInfo.mapData == "google" || 'hereMaps') {
			wktGeom = format.writeGeometry(ft.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');

		} else {
			wktGeom = format.writeGeometry(ft.getGeometry());
			coord = lonlat;
		}

		var existingCircle2 = existingLayer.getSource().getFeatureById("c_" + propertyId);
		resultGetEditDetailsPOI.cPropertyId = "c_" + propertyId;
		existingLayer.getSource().removeFeature(existingCircle2);

		var wgs84Sphere = new ol.Sphere(6378137);
		var circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, wktBufferGeom, style;
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

		if (appConfigInfo.mapData == 'google' || 'hereMaps') {
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, coord, circleRadius, 64);
			circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			circleFeature.setId("c_" + propertyId);
			circleFeature.set("id", "c_" + propertyId);
			existingLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		}
		else {
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, coord, circleRadius, 64);
			circle3857 = circle4326;
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			circleFeature.setId("c_" + propertyId);
			circleFeature.set("id", "c_" + propertyId);
			existingLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry;
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		}

		tmpl.Geocode.getGeocode({
			point: coord,
			callbackFunc: handleGeocode
		});
		function handleGeocode(data) {
			address = data.address;
			var rec = { point: wktGeom, radius: circleRadius, address: address, geometry: wktBufferGeom };
			callbackFunc(rec);
		}
		resultGetEditDetailsPOI.geometry = { geometry: wktGeom, coordinates: coord, value: value };
		resultGetEditDetailsPOI.feature = ft;
	})
	mapObj.addInteraction(modifyPOIC);
}

tmpl.POI.clearPOICircleInteractions = function (param) {
	var mapObj = param.map;
	mapObj.removeInteraction(drawPOI);
	mapObj.removeInteraction(modifyPOI);
	mapObj.removeInteraction(modifyPOIC);
}

tmpl.Search.All = function (param) {
	//console.log(param.point);
	var map = param.map;
	var point = param.point;
	var callback = param.callbackFunc;
	var result = {};
	var landmarkPolitical;
	function handleLandMarkspolitical(data) {
		if (data[0] != undefined)
			landmarkPolitical = data[0].name;
		function handleLandMarks(data) {
			//console.log("bbb",data)
			if (data[0] != undefined)
				result.landmark = data[0].name;
			function handleGeocode(data) {
				result.address = data.address;
				function handlePlace(data, c) {
					if (appConfigInfo.mapData == "google") {
						if (data.address != undefined) {
							zz = c;
							var x = zz.formatted_address.split(',');
							if (x[x.length - 3] == " Sri Lanka") {
								result.placename = x[x.length - 4];
								//result.landmark = x[0] +','+ x[1];
							} else {
								result.placename = x[x.length - 3];
								//result.landmark = x[0];
							}

							//console.log(c[1].address_components[0].long_name,c[1].address_components[0].long_name,c[2].address_components[0].long_name);
							//if(isNaN(c[0].address_components[0].long_name) && isNaN(c[0].address_components[0].long_name[0]) && c[0].address_components[0].long_name != 'Unnamed Road')
							//result.placename = c[0].address_components[0].long_name;

						} else {
							result.placename = '';
						}
					} else
						result.placename = data[0].placename;
					function handlePolice(data) {
						if (data[0] != undefined)
							result.policestation = data[0].name;
						else
							result.policestation = '';
						result.placeName = result.landmark;
						result.landmark = landmarkPolitical;
						console.log(landmarkPolitical, result);
						callback(result);
					}
					tmpl.Search.getLandMarks({
						map: map,
						point: point,
						radius: 20000,
						POI_type: "police",
						Max_num_POIs: 1,
						callbackFunc: handlePolice
					});

				}
				tmpl.Geocode.getGeocode({
					point: point,
					callbackFunc: handlePlace
				});
			}
			tmpl.Geocode.getGeocode({
				point: point,
				callbackFunc: handleGeocode
			});
		}
		tmpl.Search.getLandMarksRoad({
			map: map,
			point: point,
			radius: '20000',
			POI_type: "route",
			Max_num_POIs: 1,
			callbackFunc: handleLandMarks
		});
	}
	tmpl.Search.getLandMarksRoad({
		map: map,
		point: point,
		radius: '20000',
		POI_type: "sublocality",
		Max_num_POIs: 1,
		callbackFunc: handleLandMarkspolitical
	});
}

tmpl.Layer.clusters = function (param) {
	var map = param.map;
	var data = param.data;
	var rad = param.radius;
	var col = param.borderColor;
	var colin = param.fillColor;
	var fcolor = param.fontColor;
	var distance = param.distance;
	var layerName = param.layer;
	//console.log("data: ",data);
	var FeaturesData = [];
	for (var i = 0; i < data.length; i++) {
		var latlong = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.transform([data[i].lon, data[i].lat], 'EPSG:4326', 'EPSG:3857'))
			//geometry: new ol.geom.Point([sdata[i].lon, data[i].lat])
		});
		latlong.setId(data[i].id);
		latlong.setProperties(data[i]);
		FeaturesData.push(latlong);
	}
	//console.log("FeaturesData:",FeaturesData);
	var source = new ol.source.Vector({
		features: FeaturesData
	});

	var clusterSource = new ol.source.Cluster({
		distance: distance,
		source: source
	});

	var styleCache = {};
	var clusters = new ol.layer.Vector({
		source: clusterSource,
		title: layerName,
		style: function (feature, resolution) {
			//console.log(feature, resolution);
			//console.log(feature.get('features').length);
			var size = feature.get('features').length;
			var style = styleCache[size];

			if (!style) {
				style = [new ol.style.Style({
					image: new ol.style.Circle({
						radius: rad,
						stroke: new ol.style.Stroke({
							width: 1,
							color: col
						}),
						fill: new ol.style.Fill({
							color: colin,
							opacity: '90%'
						})
					}),
					text: new ol.style.Text({
						text: size.toString(),
						fill: new ol.style.Fill({
							color: fcolor
						})
					})
				})];

				styleCache[size] = style;
			}
			if (size == 1) {

				style = new ol.style.Icon(({
					src: feature.get('img_url'),
					anchor: [0.5, 1]
				}));
				//console.log(feature.get('img_url'));
				return style;
			}
			return style;
		}
	});
	clusters.setMap(map);
	//map.addLayer(clusters);
}

var allClusterTypeData = [];
var allClusterType = [];
var gbl_allClusterLayers = [];
var gbl_clusterMap;
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
	
	//textBackground_color,(T/F) textHallowClr, textFillClr,
	var textBackground_color = param.textBackground_color;
	var textHallowClr = param.textHallowClr;
	var textFillClr = param.textFillClr;

	try {
		if (appConfigInfo.mapDimension == "2D") {
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
			//clustredLayerFlag[layerName] = 1;
			var featureDataAry = [];
			// for (var i = 0, length = getdata.length; i < length; i++){		//Commented by Prashanth and replaced with while loop below
			// var geometry;
			// if(appConfigInfo.mapData==='google'){
			// geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
			// }
			// else{
			// var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			// geometry = new ol.geom.Point(coordinate);
			// }
			// var featureval = new ol.Feature({
			// geometry     : geometry

			// });
			// //console.log(getdata[i].img_url);
			// featureval.set('img_url',getdata[i].img_url);
			// featureval.set('ff',getdata[i].img_url);
			// featureval.setProperties(getdata[i]);
			// featureval.setId(getdata[i].id);
			// featureval.set('layer_name',layerName);
			// featureDataAry.push(featureval);
			// if(allLayer == true){
			// if(allClusterType.indexOf(getdata[i].category_id) == -1){
			// allClusterType.push(getdata[i].category_id);
			// allClusterTypeData[getdata[i].category_id] = [];
			// }
			// allClusterTypeData[getdata[i].category_id].push(featureval);
			// //
			// }
			// }


			var length = getdata.length;
			var i = 0;
			// for (var i = 0, length = getdata.length; i < length; i++){
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
				//console.log(getdata[i].img_url);
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


			//console.log("eeeeeee >>",allClusterTypeData);
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
		/*	for (var i = 0; i < length; i++) {


				var layerTemp = Layers.item(i);
				//console.log(layerTemp.get('title'),layerName,layerTemp.get('title') == layerName);
				if (layerTemp.get('title') == layerName) {
					//OverlayisLayerPresent = true;
					//layerTemp.getSource().addFeatures(featureDataAry);
					//console.log("before");
					OverlayisLayerPresent = false;
					layerTemp.getSource().clear();
					//console.log("before");
					try {
						mapObj.removeLayer(layerTemp);

					}
					catch (e) {
						//console.log("dddd",e);
					}
					break;
				}
			}
			*/

			if (OverlayisLayerPresent == false) {

				var overlay = new ol.layer.Vector({
					title: layerName,
					'cluster': true,
					visible: true,
					source: clusterSource,
					//zIndex: 1500,
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
							//test = fea12;
							//console.log("inside cluster",fea12.getProperties('features')[0].getProperties());
							//console.log("inside cluster",fea12.get('features')[0].getProperties().img_url);
							dd = fea12;
							if (size == 1) {
								if (showLabel == true) {

									if (gbl_clusterMap.getView().getZoom() > showLabelZoom) {
										//Changeing part. //textBackground_color,(T/F) textHallowClr, textFillClr, 
										if(textHallowClr == undefined){
											textHallowClr = "rgb(0, 0, 0)";
										}else{
											textHallowClr = param.textHallowClr;
										}

										if(textFillClr == undefined){
											textFillClr = "rgba(255,255,255,0.9)";
									   }else{
										textFillClr = param.textFillClr;
									   }								

										if(textBackground_color == true){
											style2 = new ol.style.Style({
												image: new ol.style.Icon(({
													anchor: [0.5, 1],
													src: fea12.get('features')[0].getProperties().img_url
												})),
												text: new ol.style.Text({
													text: fea12.get('features')[0].getProperties().label,
													offsetY: 7,
													fill: new ol.style.Fill({
														color: textHallowClr,
													}),
													stroke: new ol.style.Stroke({
														width: 2,
														color: textFillClr//"#FFFFFF",
													}),
												}),
												zIndex: -1000,//
											});
										}else{
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
												}),
												zIndex: -1000,//
											});
										}

									} else {
										style2 = new ol.style.Style({
											image: new ol.style.Icon(({
												anchor: [0.5, 1],
												src: fea12.get('features')[0].getProperties().img_url
											})),
											zIndex: -1000,//
										});
									}

								} else {
									style2 = new ol.style.Style({
										image: new ol.style.Icon(({
											anchor: [0.5, 1],
											src: fea12.get('features')[0].getProperties().img_url
										})),
										zIndex: -1000,//
									});
								}

								fea12.setStyle(style2);
							} else if (size == 0) {
								style = new ol.style.Style({
									image: new ol.style.Circle({
										radius: 0,
										stroke: new ol.style.Stroke({
											color: 'rgba(0,0,0,0)'    //ENABLE DISABLE
										}),
										fill: new ol.style.Fill({
											color: 'rgba(0,0,0,0)'
										})
									}),
									zIndex: -1000,//
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
											}),
											zIndex: -1000,//
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
											}),
											zIndex: -1000,//
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
										}),
										zIndex: -1000,//
									});
								}

								styleCache[size] = style;
								//}
							}
						}
						return style;
					}
				});
				//console.log("after");
				vv = overlay;
				OverlayisLayerPresent = true;

				//	overlay.setMap(mapObj);
				//mapObj.addLayer(overlay);
				//if(layerSwitcher)
				//mapObj.addControl(new ol.control.LayerSwitcher());
				//OverlayisLayerPresent = true;
				//console.log("DATAAA", tmpl_setMap_layer_global );

				//gbl_allClusterLayers.push(overlay);

				//=================
				tmpl_setMap_layer_global_array.push({
					layer: overlay,
					title: layerName,
					visibility: true,
					map: mapObj
				});
				console.log("CLUSTER>>>>>", tmpl_setMap_layer_global_array);
				//overlay.setMap(mapObj);
			
				mapObj.addLayer(overlay);
				//mapObj.getLayers().insertAt(100000, overlay);
				

				//if(layerSwitcher)
				//mapObj.addControl(new ol.control.LayerSwitcher());
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

			//console.log("eeeeeee >>",allClusterTypeData);
			return true;

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
				console.log(mapObj._dataSourceCollection);
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
					else if (mapObj.selectedEntity.name == "Boundary Point") {
						console.log("Boundary Point:",mapObj.selectedEntity.name);
					 }
					else { 
						console.log("mapObj.selectedEntity.name:",mapObj.selectedEntity.name);
					}
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


var allClusterTypeData = [];
var allClusterType = [];
var gbl_allClusterLayers = [];
tmpl.Overlay.createWithClusterTest = function (param) {
    if (param.map) {
        var mapObj = param.map;
        var jsonobj = param.features;
        var radius = param.arearange;
        var distance = param.distance;
        var fillColor = param.fillColor;
        var layerName = param.layer;
        var clusterVisibility = param.visibility;
      //  var clusterShape = param.clusterShape;
        var borderColour = param.borderColour;
        var borderWidth = param.borderWidth;

        if (jsonobj.length == 0)
            return false;

        if (!clusterVisibility)
            clusterVisibility = true;

        if (!radius)
            radius = 15;

        if (!distance)
            distance = 50;

        if (!fillColor)
            fillColor = '#000000';

        if (!borderColour)
            borderColour = '#ffffff';

        if (!borderWidth)
            borderWidth = 1;

        var featureDataAry = [];
        for (var i = 0, length = jsonobj.length; i < length; i++) {
            var geometry;
            if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == "trinity") {
                geometry = new ol.geom.Point(ol.proj.transform([parseFloat(jsonobj[i].lon), parseFloat(jsonobj[i].lat)], 'EPSG:4326', 'EPSG:4326'));
            } else {
                var coordinate = [parseFloat(jsonobj[i].lon), parseFloat(jsonobj[i].lat)];
                geometry = new ol.geom.Point(coordinate);
            }

            var featureval = new ol.Feature({
                geometry: geometry
            });

            featureval.set('img_url', jsonobj[i].img_url);
            featureval.setProperties(jsonobj[i]);
            featureval.setId(jsonobj[i].id);
            featureDataAry.push(featureval);
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

		/*
        for (var i = 0; i < length; i++) {
            var layerTemp = Layers.item(i);
            if (layerTemp.get('title') == layerName) {
                OverlayisLayerPresent = false;
                layerTemp.getSource().clear();
                try {
                    mapObj.removeLayer(layerTemp);
                } catch (e) {
                    console.error("Error at removing layer >>> ", e);
                }
                break;
            }
        }
		*/

        if (OverlayisLayerPresent == false) {
            var overlay = new ol.layer.Vector({
                title: layerName,
                'cluster': true,
                visible: clusterVisibility,
                source: clusterSource,
                style: function (fea12) {
                    if (fea12 != undefined) {
                        var size = fea12.get('features').length;
                        var style = styleCache[size];
                        var style2 = styleCache[size];
                        if (size == 1) {
                            style2 = new ol.style.Style({
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 0.2)'
                                }),
                                image: new ol.style.Icon(({
                                    anchor: [0.5, 1],
                                    src: fea12.get('features')[0].getProperties().img_url,
                                    opacity: fea12.get('features')[0].getProperties().opacity
                                })),
                                text: new ol.style.Text({
                                    //text: fea12.get('features')[0].getProperties().label,
                                    // text: tmpl.SupportFunctions.wrapTextIntoLines({
                                    //     string: fea12.get('features')[0].getProperties().label,
                                    //     width: 16,
                                    //     spaceReplacer: '\n'
                                    // }),
                                    //offsetX: fea12.get('features')[0].getProperties().label?.length > 16 ? 6 : 0,
                                    //offsetY: fea12.get('features')[0].getProperties().label?.length > 16 ? 25 : 5,
                                    offsetY: fea12.get('features')[0].getProperties().label?.length > 16 ? 15 : 0,
                                    fill: new ol.style.Fill({
                                        color: fea12.get('features')[0].getProperties().label_color,
                                    }),
                                    stroke: new ol.style.Stroke({
                                        width: 5,
                                        color: fea12.get('features')[0].getProperties().label_bgcolor,
                                    }),
                                })
                            });
                            fea12.setStyle(style2);
                        } else {
                            if (!style) {
                                style = new ol.style.Style({
                                    // image: tmpl.SupportFunctions.returnClusterShape({
                                    //     type: clusterShape,
                                    //     borderColour: borderColour,
                                    //     backgroundColour: fillColor,
                                    //     radius: radius,
                                    //     borderWidth: borderWidth
                                    // }),
                                    text: new ol.style.Text({
                                        text: size.toString(),
                                        fill: new ol.style.Fill({
                                            color: '#fff'
                                        })
                                    })
                                });
                                styleCache[size] = style;
                            }
                        }
                    }
                    return style;
                }
            });

            // tmpl_setMap_layer_global.push({
            //     layer: overlay,
            //     title: layerName,
            //     visibility: true,
            //     map: mapObj
            // });

            tmpl_setMap_layer_global_array.push({
                layer: overlay,
                title: layerName,
                visibility: true,
                map: mapObj
            });

            mapObj.addLayer(overlay);
            OverlayisLayerPresent = true;
        }
        return true;
    } else {
        console.log("Unable to get map object > ", param.map);
    }
}

tmpl.Overlay.createWithClusterWithoutCircle = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var radius = param.radius;
	var distance = param.distance;
	var clusterImage = param.clusterImage;
	var fillColor = param.fillColor;
	var allLayer = param.allLayer;
	var layerName = param.layer;
	var layerSwitcher = param.layerSwitcher;
	var getdata = jsonobj;
	var getHoverLabel = param.getHoverLabel;
	if (allLayer == true) {
		allClusterTypeData = [];
		allClusterType = [];
	}
	if (getdata.length == 0) {
		return false;
	}
	var featureDataAry = [];
	for (var i = 0, length = getdata.length; i < length; i++) {
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
		//console.log(getdata[i].img_url);
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
	}
	//console.log("eeeeeee >>",allClusterTypeData);
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
				//console.log("dddd",e);
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
						style2 = new ol.style.Style({
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: clusterImage//fea12.get('features')[0].getProperties().img_url
							}))
						});

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
						style = new ol.style.Style({
							/*image: new ol.style.Circle({
								radius: radius,
								stroke: new ol.style.Stroke({
									color: '#ffffff00'
								}),
								fill: new ol.style.Fill({
									color: '#ffffff00'
								})
							}),
							text: new ol.style.Text({
								text: size.toString(),
								fill: new ol.style.Fill({
									color: 'red'
								})
							})*/
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: clusterImage
							}))
						});
						styleCache[size] = style;
						//}
					}
				}
				return style;
			}
		});
		//console.log("after");
		vv = overlay;
		OverlayisLayerPresent = true;
		gbl_allClusterLayers.push(overlay);
		mapObj.addLayer(overlay);
		//if(layerSwitcher)
		//mapObj.addControl(new ol.control.LayerSwitcher());
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
	//console.log("eeeeeee >>",allClusterTypeData);
	return true;
}


tmpl.Overlay.createWithClusterWithClusterIcon = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var radius = param.radius;
	var distance = param.distance;
	var clusterImage = param.clusterImage;
	var fillColor = param.fillColor;
	var allLayer = param.allLayer;
	var layerName = param.layer;
	var layerSwitcher = param.layerSwitcher;
	var getdata = jsonobj;
	var getHoverLabel = param.getHoverLabel;
	if (allLayer == true) {
		allClusterTypeData = [];
		allClusterType = [];
	}
	if (getdata.length == 0) {
		return false;
	}
	var featureDataAry = [];
	for (var i = 0, length = getdata.length; i < length; i++) {
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
		}
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
			catch (e) { }
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
						style2 = new ol.style.Style({
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: fea12.get('features')[0].getProperties().img_url
							}))
						});

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
						style = new ol.style.Style({
							/*image: new ol.style.Circle({
								radius: radius,
								stroke: new ol.style.Stroke({
									color: '#ffffff00'
								}),
								fill: new ol.style.Fill({
									color: '#ffffff00'
								})
							}),
							text: new ol.style.Text({
								text: size.toString(),
								fill: new ol.style.Fill({
									color: 'red'
								})
							})*/
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: clusterImage
							}))
						});
						styleCache[size] = style;
						//}
					}
				}
				return style;
			}
		});
		//console.log("after");
		vv = overlay;
		OverlayisLayerPresent = true;
		gbl_allClusterLayers.push(overlay);
		mapObj.addLayer(overlay);
		//if(layerSwitcher)
		//mapObj.addControl(new ol.control.LayerSwitcher());
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
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
			}
		});
	}
	return true;
}


tmpl.Overlay.createWithClusterWithClusterIconLight = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var radius = param.radius;
	var distance = param.distance;
	var clusterImage = param.clusterImage;
	var image1 = param.image1;
	var image2 = param.image2;
	var image3 = param.image3;
	var fillColor = param.fillColor;
	var allLayer = param.allLayer;
	var layerName = param.layer;
	var layerSwitcher = param.layerSwitcher;
	var getdata = jsonobj;
	var getHoverLabel = param.getHoverLabel;
	if (allLayer == true) {
		allClusterTypeData = [];
		allClusterType = [];
	}
	if (getdata.length == 0) {
		return false;
	}
	if (image1 == undefined) {
		image1 = clusterImage;
	}
	if (image2 == undefined) {
		image2 = clusterImage;
	}
	if (image3 == undefined) {
		image3 = clusterImage;
	}
	var featureDataAry = [];
	for (var i = 0, length = getdata.length; i < length; i++) {
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
		}
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
			catch (e) { }
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
						//console.log("single levelValue -> ",fea12.get('features')[0].getProperties().levelValue);
						//console.log("single image array -> ",image1);
						var img;
						if (fea12.get('features')[0].getProperties().levelValue == 100) {
							img = image1[0];
						} else if (fea12.get('features')[0].getProperties().levelValue == 0) {
							img = image1[1];
						} else {
							img = image1[2];
						}
						style2 = new ol.style.Style({
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: img//fea12.get('features')[0].getProperties().img_url
							}))
						});

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
						var img;
						if (size == 2) {
							//console.log("from status 1 -> ",fea12.get('features')[0].getProperties().status);
							//console.log("from status 2 -> ",fea12.get('features')[1].getProperties().status);
							if (fea12.get('features')[0].getProperties().levelValue == 100 && fea12.get('features')[1].getProperties().levelValue == 100) {
								img = image2[0];
							} else if (fea12.get('features')[0].getProperties().levelValue == 0 && fea12.get('features')[1].getProperties().levelValue == 0) {
								img = image2[1];
							} else {
								img = image2[2];
							}
						} else if (size == 3) {
							if (fea12.get('features')[0].getProperties().levelValue == 100 && fea12.get('features')[1].getProperties().levelValue == 100 && fea12.get('features')[2].getProperties().levelValue == 100) {
								img = image3[0];
							} else if (fea12.get('features')[0].getProperties().levelValue == 0 && fea12.get('features')[1].getProperties().levelValue == 0 && fea12.get('features')[2].getProperties().levelValue == 0) {
								img = image3[1];
							} else {
								img = image3[2];
							}
						}

						style = new ol.style.Style({
							/*image: new ol.style.Circle({
								radius: radius,
								stroke: new ol.style.Stroke({
									color: '#ffffff00'
								}),
								fill: new ol.style.Fill({
									color: '#ffffff00'
								})
							}),
							text: new ol.style.Text({
								text: size.toString(),
								fill: new ol.style.Fill({
									color: 'red'
								})
							})*/
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: img
							}))
						});
						styleCache[size] = style;
						//}
					}
				}
				return style;
			}
		});
		//console.log("after");
		vv = overlay;
		OverlayisLayerPresent = true;
		gbl_allClusterLayers.push(overlay);
		mapObj.addLayer(overlay);
		//if(layerSwitcher)
		//mapObj.addControl(new ol.control.LayerSwitcher());
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
				ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
			}
		});
	}
	return true;
}

tmpl.Layer.changeShape = function (param) {
	var mapObj = param.map;
	var layerName = param.layer;
	var icon = param.icon;
	var sides = param.sides;
	var shape = param.shape;

	var lyrs = mapObj.getLayers();
	var length = lyrs.getLength();
	var dataArr = [];

	var existing;
	for (var i = 0; i < length; i++) {
		var lyr1 = lyrs.item(i);
		if (lyr1) {
			if (lyr1.get('title') === layerName) {
				existing = lyr1;
				lyr1.getSource().getFeatures().forEach(function (ff) {
					if (shape == 'icon') {
						ff.setStyle(new ol.style.Style({

							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: icon
							}))
						}));
					} else if (shape == 'square') {
						ff.setStyle(
							new ol.style.Style({
								image: new ol.style.RegularShape({
									fill: fill,
									stroke: new ol.style.Stroke({ color: 'while', width: 2 }),
									points: 4,
									radius: 10,
									angle: Math.PI / 4
								})
							})
						);
					} else if (shape == 'triangle') {
						ff.setStyle(
							new ol.style.Style({
								image: new ol.style.RegularShape({
									fill: fill,
									stroke: new ol.style.Stroke({ color: 'while', width: 2 }),
									points: 4,
									radius: 10,
									angle: Math.PI / 4
								})
							})
						);
					}

				});
				var alfeatures = lyr1.getSource().getFeatures();
				lyr1.getSource().clear();
				lyr1.getSource().addFeatures(alfeatures);
			}
		}
	}

	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layerName) {
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (ff) {

					if (shape == 'icon') {
						ff.setStyle(
							new ol.style.Style({

								image: new ol.style.Icon(({
									anchor: [0.5, 1],
									src: icon
								}))
							})
						);
					} else {

					}
				});
				var alfeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
				tmpl_setMap_layer_global[i].layer.getSource().clear();
				tmpl_setMap_layer_global[i].layer.getSource().addFeatures(alfeatures);
			}
		}
	}
}

tmpl.Search.getLandMarksRoad = function (params) {
	var point = params.point;
	var callbackFunc = params.callbackFunc;
	var custom_poi_type = params.POI_type;

	var dataFrom = params.dataFrom;
	var ignoreRadius = params.ignoreRadius;
	var radius = params.radius;
	if (ignoreRadius == undefined) {

	} else {
		if (ignoreRadius == true) {
			radius = 8000000;
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
				radius: 200,
				types: ['all']
				//keyword: keyword
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
	if (appConfigInfo.mapData == 'google') {
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


tmpl.Map.getCategories = function (param) {
	var mapObj = param.map;
	var assetResourceEvent = param.type;

	var urlL;

	if (assetResourceEvent == 'asset') {
		urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetAsset";
	} else if (assetResourceEvent == 'resource') {
		urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetResourceCategory";
	}

	$.ajax({
		type: "GET",
		url: urlL,
		success: function (data) {
			console.log("data >>", data);
		},
		error: function (jqxhr) {
			console.log("getCategories not working");
		}
	});

}

tmpl.Map.getCategoryDetails = function (param) {
	var mapObj = param.map;
	var category = param.category;
	var assetResourceEvent = param.type;

	var urlL;

	if (category.length == 1) {
		if (assetResourceEvent == 'asset') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetAssetDetails/" + category[0];
		} else if (assetResourceEvent == 'resource') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetResourceDetails/" + category[0];
		}

		$.ajax({
			type: "GET",
			url: urlL,
			success: function (data) {
				console.log("data >>", data);
			},
			error: function (jqxhr) {
				console.log("getCategories not working");
			}
		});
	}
}

tmpl.Map.createCategoryLayers = function (param) {
	var mapObj = param.map;
	var assetResourceEvent = param.type;
	var category = param.category;
	var urlL;
	if (category == 'all') {
		if (assetResourceEvent == 'asset') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetAllAssetDetail";
		} else if (assetResourceEvent == 'resource') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetAllResourceDetails";
		}
	} else {
		if (assetResourceEvent == 'asset') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetAssetDetails/" + category;
		} else if (assetResourceEvent == 'resource') {
			urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetResourceDetails/" + category;
		}
	}
	$.ajax({
		type: "GET",
		url: urlL,
		success: function (data) {
			console.log("data >>", data);

		},
		error: function (jqxhr) {
			console.log("layer creation not working");
		}
	});
}

tmpl.Map.customLayers = function (param) {
	var mapObj = param.map;
	var layerType = param.type;
	var callbackFunc = param.callbackFunc;

	var urlC;
	if (layerType == 'AllList') {
		urlC = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetCustomLayerCategories/";
	} else if (layerType == 'BS01') {
		urlC = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetPoisBusStops/";
	} else if (layerType == 'FS01') {
		urlC = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.gisProject + "/GetPoisFireStation/";
	}

	$.ajax({
		type: "GET",
		url: urlC,
		success: function (data) {
			console.log("from api data -> ", data);
			if (data) {
				callbackFunc(data);
			} else {
				callbackFunc(false);
			}
		},
		error: function (jqxhr) {
			callbackFunc(false);
			console.log("layer creation not working");
		}
	});
}


tmpl.Control.ddTodms = function (param) {
	var lat = param.lat;
	var lng = param.lng;
	var latResult, lngResult, dmsResult;
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	function getDms(val) {
		var valDeg, valMin, valSec, result;
		val = Math.abs(val);
		valDeg = Math.floor(val);
		result = valDeg + "º";
		valMin = Math.floor((val - valDeg) * 60);
		result += valMin + "'";
		valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
		result += valSec + '"';
		return result;
	}
	latResult = getDms(lat);
	latResult += (lat >= 0) ? 'N' : 'S';
	lngResult = getDms(lng);
	lngResult += (lng >= 0) ? 'E' : 'W';
	dmsResult = latResult + ' ' + lngResult;
	return dmsResult;
}


var polyg = [];
var lineg = [];
var multipolyg = [];
var geometry = [];
var polyHeight = [];
var length;
function createLatLonArray(geom, type) {
	if (type == 'poly') {
		geometry = [];
		polyg = [];
		geom = geom.toLowerCase();
		geom = geom.split('polygon');
		geom = geom[1].trim();
		geom = geom.split('((');
		geom = geom[1].trim();
		geom = geom.split('))');
		geom = geom[0].trim();
		geom = geom.split(',');
		// console.log("geom: ",geom);
		// length = geom.length;
		for (var i = 0; i < geom.length; i++) {
			var polygeo = geom[i].trim();
			polyg.push(polygeo);
		}
		// console.log("polyg: ",polyg);
		// length = polyg.length;	
		for (var i = 0; i < polyg.length; i++) {
			var polygeomet = polyg[i].split(" ");
			geometry.push(polygeomet);
		}
		geometry = [].concat.apply([], geometry);
	}
	else if (type == 'polyZ') {
		geometry = [];
		polyHeight = [];
		geom = geom.toLowerCase();
		geom = geom.split('polygon z');
		geom = geom[1].trim();
		geom = geom.split('((');
		geom = geom[1].trim();
		geom = geom.split('))');
		geom = geom[0].trim();
		geom = geom.split(',');

		for (var i = 0; i < geom.length; i++) {
			var polyheightgeom = geom[i].trim();
			polyHeight.push(polyheightgeom);
		}
		// console.log("polyHeight: ",polyHeight);
		// length = polyHeight.length;	
		for (var i = 0; i < polyHeight.length; i++) {
			var polyZgeomet = polyHeight[i].split(" ");
			geometry.push(polyZgeomet);
		}
		geometry = [].concat.apply([], geometry);
	}
	else if (type == 'line') {
		geometry = [];
		lineg = [];
		geom = geom.toLowerCase();
		geom = geom.split('linestring');
		geom = geom[1].trim();
		geom = geom.split('(');
		geom = geom[1].trim();
		geom = geom.split(')');
		geom = geom[0].trim();
		geom = geom.split(',');
		var append = (geom[0]);

		// length = geom.length;
		for (var i = 0; i < geom.length; i++) {
			// var linegeo = geom[i].replace(" ","");
			var linegeo = geom[i].trim();
			lineg.push(linegeo);
		}
		lineg.unshift(append);
		length = lineg.length;
		for (var i = 0; i < length; i++) {
			var linegeomet = lineg[i].split(" ");
			geometry.push(linegeomet);
		}
		geometry = [].concat.apply([], geometry);
	}
	else if (type == 'multipoly') {
		geometry = [];
		multipolyg = [];
		geom = geom.toLowerCase();
		geom = geom.split('multipolygon');
		geom = geom[1].trim();
		geom = geom.split('(((');
		geom = geom[1].trim();
		geom = geom.split(')))');
		geom = geom[0].trim();
		geom = geom.split(',');
		// console.log("geom: ",geom);
		// length = geom.length;
		for (var i = 0; i < geom.length; i++) {
			var multipolygeo = geom[i].trim();
			multipolyg.push(multipolygeo);
		}
		// console.log("multipolyg: ",multipolyg);
		length = multipolyg.length;
		for (var i = 0; i < length; i++) {
			var polygeomet = multipolyg[i].split(" ");
			geometry.push(polygeomet);
		}
		geometry = [].concat.apply([], geometry);
	}
	var data = geometry;
	data = data.map(Number);
	// console.log("createLatLonArray final data: ",data);
	return data;
}


tmpl.Layer.changeClusterVisibility = function (param) {
	var map = param.map;
	var visibility = param.visible;

	try {
		if (appConfigInfo.mapDimension == "3D") {
			var length = map.dataSources.length;
			if (visibility == "true") {
				visibility = true;
			}
			else if (visibility == "false") {
				visibility = false;
			}

			if (length > 0) {
				for (var i = 0; i < length; i++) {
					var clusterData = map.dataSources.get(i);
					if (clusterData != undefined && clusterData.name == "points") {
						clusterData.show = visibility;
					}
				}
			}
		}
	}
	catch (err) {
		console.error("ERROR Layer.changeClusterVisibility: ", err);
	}
}

tmpl.Map.add3DModel = function (param) {
	var map = param.map;
	var id = param.id;
	var layerName = param.layer;
	var imgUrl = param.url;
	var data = param.data;
	var icon_scale = param.scale;
	var height = param.height;
	var property = param.property;
	var zoom = param.zoomtoFeature;
	// console.log("3d Model ID from API: ",id);
	if (height == undefined) {
		height = 0;
	}
	if (icon_scale == undefined) {
		icon_scale = 1;
	}
	try {
		if (appConfigInfo.mapDimension == "3D") {

			var modelEntity = map.entities.getById(id);
			if (modelEntity) {
				tmpl.Map.remove3dModel({ map: map, id: id, layer: layerName });
			}

			var position = Cesium.Cartesian3.fromDegrees(data[0], data[1], height);
			var heading = Cesium.Math.toRadians(90);
			var pitch = 0;
			var roll = 0;
			var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
			var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

			var heightRef;
			if (height > 0) {
				heightRef = Cesium.HeightReference.RELATIVE_TO_GROUND;
			}
			else {
				heightRef = Cesium.HeightReference.CLAMP_TO_GROUND;
			}

			var entity = map.entities.add({
				id: id,
				name: layerName,
				position: position,
				//orientation : orientation,
				model: {
					uri: imgUrl,
					heightReference: heightRef,
					scale: icon_scale,
					shadows: Cesium.ShadowMode.ENABLED,
					// minimumPixelSize : 128,
					// maximumScale : 20000
				}
			});

			entity.entProp = property;
			//entity.entProp.type = "3D Model";

			if (zoom == true) {
				map.zoomTo(entity);
			}
			else { }
		}
		else { }
	}
	catch (err) {
		console.error("ERROR Map.add3DModel: ", err);
	}
}


tmpl.Map.remove3dModel = function (param) {
	var map = param.map;
	var id = param.id;
	var layerName = param.layer;

	try {
		if (appConfigInfo.mapDimension == "3D") {
			// alert("Remove 3d");
			if (layerName == undefined) {
				console.error("Enter Layer Name of 3D feature");
			}
			else {
				var entity = map.entities.getById(id);

				if (entity.name == layerName) {
					map.entities.remove(entity);
				}
				else {
					console.error("Entity does not exist!");
				}
			}
		}
	}
	catch (err) {
		console.error("ERROR Map.remove3dModel: ", err);
	}
}


tmpl.Overlay.setOverlayOnFire = function (param) {
	var map = param.map;
	var id = param.id;
	var emitterRate = param.emitter;		//Specify values from 1 to 5
	console.log("========>", appConfigInfo.mapDimension);
	try {
		if (appConfigInfo.mapDimension == "3D") {
			var emitterValue = null;
			switch (emitterRate) {
				case 1://<1
					emitterValue = 10.0;
					break;
				case 1:
					emitterValue = 10.0;
					break;
				case 2:
					emitterValue = 20.0;
					break;
				case 3:
					emitterValue = 30.0;
					break;
				case 4:
					emitterValue = 40.0;
					break;
				case 5:
					emitterValue = 50.0;
					break;
				case 5://>5
					emitterValue = 50.0;
				default:
					emitterValue = 10.0;
			}
			var ent = map.entities.getById(id);

			///////////
			var emitterModelMatrix = new Cesium.Matrix4();
			var translation = new Cesium.Cartesian3();
			var rotation = new Cesium.Quaternion();
			var hpr = new Cesium.HeadingPitchRoll();
			var trs = new Cesium.TranslationRotationScale();

			function computeEmitterModelMatrix() {
				hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);  					//HeadingPitchRoll {heading: 0, pitch: 0, roll: 0}
				trs.translation = Cesium.Cartesian3.fromElements(-4.0, 0.0, 44, translation);  	//Cartesian3 {x: -4, y: 0, z: 104}
				trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
				console.log("LNM", hpr, trs.translation);

				return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
			}
			var gravityScratch = new Cesium.Cartesian3();
			function applyGravity(p, dt) {
				// We need to compute a local up vector for each particle in geocentric space.
				var position = p.position;

				Cesium.Cartesian3.normalize(position, gravityScratch);
				Cesium.Cartesian3.multiplyByScalar(gravityScratch, 0.0 * dt, gravityScratch);

				p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
			}
			///////////

			var particleSystem = map.scene.primitives.add(new Cesium.ParticleSystem({
				image: 'http://192.168.1.165:8989/trinityCesiumAPI/Cesium-1.51/Apps/SampleData/fire.png',
				color: Cesium.Color.ORANGE,
				emissionRate: 5.0,
				emitter: new Cesium.SphereEmitter(emitterValue),
				imageSize: new Cesium.Cartesian2(30.0, 30.0),
				modelMatrix: ent.computeModelMatrix(map.clock.startTime, new Cesium.Matrix4()),
				lifetime: 16.0,

				// startScale: 1.0,
				// endScale: 4.0,
				particleLife: 1.0,
				// speed: 5.0,
				emitterModelMatrix: computeEmitterModelMatrix(),
				updateCallback: applyGravity
			}));
			map.clock.shouldAnimate = true;
		}
		else { }
	}
	catch (err) {
		console.error("ERROR Overlay.setBuildingOnFire: ", err);
	}
}


tmpl.Overlay.extinguishFire = function (param) {
	var map = param.map;

	try {
		if (appConfigInfo.mapDimension == "3D") {
			for (var i = 0; i < map.scene.primitives._primitives.length; i++) {
				if (map.scene.primitives._primitives[i].image == "http://192.168.1.165:8989/trinityCesiumAPI/Cesium-1.51/Apps/SampleData/fire.png") {
					map.scene.primitives.remove(map.scene.primitives._primitives[i]);
				}
				else { }
			}
		}
		else { }
	}
	catch (err) {
		console.error("ERROR Overlay.extinguishFire: ", err);
	}
}


function animationfor3D(map) {
	tmpl.Trip.speedInc = function () {
		// var map = param.map;		
		try {
			var animationSpeedInc = map.clock.multiplier;

			switch (true) {
				case (animationSpeedInc < 0.2):
					map.clock.multiplier = 0.2;
					break;

				case (animationSpeedInc == 0.2):
					map.clock.multiplier = 1.0;
					break;

				case (animationSpeedInc == 1.0):
					map.clock.multiplier = 2.0;
					break;

				case (animationSpeedInc == 2.0):
					map.clock.multiplier = 3.0;
					break;

				case (animationSpeedInc == 3.0):
					map.clock.multiplier = 4.0;
					break;

				case (animationSpeedInc == 4.0):
					map.clock.multiplier = 4.0;
					break;

				case (animationSpeedInc > 4.0):
					map.clock.multiplier = 4.0;
					break;

				default:
					map.clock.multiplier = 2.0;
					break;
			}
		}
		catch (err) {
			console.error("ERROR Trip.speedInc: ", err);
		}
	}

	tmpl.Trip.speedDec = function () {
		// var map = param.map;

		try {
			var animationSpeedDec = map.clock.multiplier;
			switch (true) {
				case (animationSpeedDec > 4.0):
					map.clock.multiplier = 4.0;
					break;

				case (animationSpeedDec < 0.2):
					map.clock.multiplier = 0.2;
					// map.clock.multiplier = 0.5;
					break;

				case (animationSpeedDec == 4.0):
					map.clock.multiplier = 3.0;
					break;

				case (animationSpeedDec == 3.0):
					map.clock.multiplier = 2.0;
					break;

				case (animationSpeedDec == 2.0):
					map.clock.multiplier = 1.0;
					break;

				case (animationSpeedDec == 1.0):
					map.clock.multiplier = 0.2;
					break;

				case (animationSpeedDec == 0.2):
					map.clock.multiplier = 0.2;
					break;

				default:
					map.clock.multiplier = 2.0;
					break;
			}
		}
		catch (err) {
			console.error("ERROR Trip.speedDec: ", err);
		}
	}

	tmpl.Trip.stop = function (param) {
		var map = param.map;

		try {
			if (map != undefined) {
				var entity = map.entities.getById("Trip Display");
				if (entity != undefined) {
					map.clock.currentTime = startTimeThreed;
					map.clock.onStop.removeEventListener(restartTrip);
					tmpl.Trip.pause({ map: map });
				}
			}
		}
		catch (err) {
			console.error("ERROR Trip.stop: ", err);
		}
	}
}

function restartTrip() {
	setTimeout(function () { tmpl.Trip.stop({ map: map }); }, 500)
}

tmpl.Route.buffer = function (param) {
	//var map = param.map;
	var wktGeom = param.wktgeom;
	var callBackFun = param.callBackFunc;
	var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/buffer/wkt/";
	try {
		$.ajax({
			type: 'POST',
			url: urlL,
			data: {
				data: wktGeom,
				radius: 0.0005//(param.radius)/100000//0.0002
			},
			success: function (data) {
				callBackFun(data[0].geometry);
				// console.log("buffer data ==========>",data)	 
			},
			error: function () {
				console.log("API Server Down ! there was an error!");
			}
		});
	}
	catch (err) {
		console.error("ERROR Trip.stop: ", err);
	}
}

tmpl.Route.mergeLine = function (param) {
	//var map = param.map;
	var wktGeom = param.lines;
	var callBackFun = param.callBackFunc;
	var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/makeLine/";
	try {
		$.ajax({
			type: 'POST',
			url: urlL,
			data: {
				data: wktGeom
			},
			success: function (data) {
				callBackFun(data);
				// console.log("buffer data ==========>",data)	 
			},
			error: function () {
				console.log("API Server Down ! there was an error!");
			}
		});
	}
	catch (err) {
		console.error("ERROR mergeLine: ", err);
	}
}


tmpl.Map.addOSMBuildings = function (param) {
	var viewer = param.map;
	//viewer.scene.primitives.add(osmBuildingsTileset); 
	tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

	osmBuildingsTileset = Cesium.createOsmBuildings({
		style: new Cesium.Cesium3DTileStyle({
			color: {
				conditions: [
					["${feature['building']} === 'hospital'", "color('#0000FF')"],
					["${feature['building']} === 'school'", "color('#00FF00')"],
					["${feature['building']} === 'stadium'", "color('#ff4000')"],
					["${feature['building']} === 'apartments'", "color('#ff4da6')"],
					[true, "color('#ffffff')"]
				]
			},
			show: {
				conditions: [//appConfigInfo.osmCloudBuildings,
					// Any building that has this elementId will have `show = false`.
					//['${elementId} === 	345935913', false],
					['${elementId} === 	692957113', false],
					['${elementId} ===  345936002', false],
					// If a building does not have one of these elementIds, set `show = true`.   	
					[true, true]
				]
			},
		})
	});

	viewer.scene.primitives.add(osmBuildingsTileset);

	viewer.scene.camera.setView({
		destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 1500),
		orientation: {
			heading: Cesium.Math.toRadians(10),
			pitch: Cesium.Math.toRadians(-10),
		},
	});

}
tmpl.Map.removeOSMBuildings = function (param) {
	var viewer = param.map;
	viewer.scene.primitives.remove(osmBuildingsTileset);

}


tmpl.Map.enableShado = function (param) {
	var viewer = param.map;
	viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
	viewer.shadows = true;
	var shadowMap = viewer.shadowMap;
	shadowMap.maximumDistance = 400000;
}

tmpl.Map.desableShado = function (param) {
	var viewer = param.map;
	viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
	viewer.shadows = false;
	viewer.clockViewModel.shouldAnimate = false
}

tmpl.Map.add3dTiledMap = function (param) {
	var viewer = param.map;
	var assetid = appConfigInfo.tiled3DBaseMap;
	var imageryLayer = viewer.imageryLayers.addImageryProvider(
		new Cesium.IonImageryProvider({ assetId: assetid })
	);
	imageryLayer.name = assetid;
	viewer.zoomTo(imageryLayer).otherwise(function (error) {
		console.log(error);
	});

}


/* tmpl.Overlay.setOverlayOnFire = function (param) {
	var map = param.map;
	var id = param.id;
	var emitterRate = param.emitter;		//Specify values from 1 to 5
	console.log("========>", appConfigInfo.mapDimension);
	try {
		if (appConfigInfo.mapDimension == "3D") {
			var emitterValue = null;
			switch (emitterRate) {
				case 1://<1
					emitterValue = 10.0;
					break;
				case 1:
					emitterValue = 10.0;
					break;
				case 2:
					emitterValue = 20.0;
					break;
				case 3:
					emitterValue = 30.0;
					break;
				case 4:
					emitterValue = 40.0;
					break;
				case 5:
					emitterValue = 50.0;
					break;
				case 5://>5
					emitterValue = 50.0;
				default:
					emitterValue = 10.0;
			}
			var ent = map.entities.getById(id);
			var particleSystem = map.scene.primitives.add(new Cesium.ParticleSystem({
				image: 'http://192.168.1.165:8989/trinityCesiumAPI/Cesium-1.51/Apps/SampleData/fire.png',
				color: Cesium.Color.ORANGE,
				emissionRate: 50.0,
				emitter: new Cesium.SphereEmitter(emitterValue),
				imageSize: new Cesium.Cartesian2(30.0, 30.0),
				modelMatrix: ent.computeModelMatrix(map.clock.startTime, new Cesium.Matrix4()),
				lifetime: 16.0
			}));
			map.clock.shouldAnimate = true;
		}
		else { }
	}
	catch (err) {
		console.error("ERROR Overlay.setBuildingOnFire: ", err);
	}
}
*/

/* tmpl.Overlay.extinguishFire = function (param) {
	var map = param.map;

	try {
		if (appConfigInfo.mapDimension == "3D") {
			for (var i = 0; i < map.scene.primitives._primitives.length; i++) {
				if (map.scene.primitives._primitives[i].image == "http://192.168.1.165:8989/trinityCesiumAPI/Cesium-1.51/Apps/SampleData/fire.png") {
					map.scene.primitives.remove(map.scene.primitives._primitives[i]);
				}
				else { }
			}
		}
		else { }
	}
	catch (err) {
		console.error("ERROR Overlay.extinguishFire: ", err);
	}
}
*/


tmpl.Map.remove3dTiledMap = function (param) {
	var viewer = param.map;
	var assetid = appConfigInfo.tiled3DBaseMap;
	for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
		console.log(viewer.imageryLayers._layers[i].name);
		if (viewer.imageryLayers._layers[i].name == assetid) {
			var wms = viewer.imageryLayers._layers[i];
			viewer.imageryLayers.remove(wms);
		}
	}
}

tmpl.Map.add3dModelAsAssectID1 = function (param) {
	var viewer = param.map;
	var asset = param.assetid;
	var assetid;
	var tileset;

	for (var i = 0; i < asset.length; i++) {
		console.log(asset[i]);
		assetid = asset[i];
		tileset = 'tileset' + tileset;
		console.log('tileset-->' + tileset);
		tileset = viewer.scene.primitives.add(
			new Cesium.Cesium3DTileset({
				url: Cesium.IonResource.fromAssetId(assetid),
			})
		);

		tileset.name = assetid;
		tileset.id = assetid;

		if (asset.length == 1) {
			tileset.readyPromise
				.then(function () {
					viewer.zoomTo(tileset);

					// Apply the default style if it exists
					var extras = tileset.asset.extras;
					if (
						Cesium.defined(extras) &&
						Cesium.defined(extras.ion) &&
						Cesium.defined(extras.ion.defaultStyle)
					) {
						tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
					}
				})
				.otherwise(function (error) {
					console.log(error);
				});
		}
	}

}

tmpl.Map.zoomTo3dModelUsingAssectID = function (param) {
	var viewer = param.map;
	var asset = param.assetid;
	tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

	for (var i = 0; i < viewer.scene.primitives._primitives.length; i++) {
		console.log(viewer.scene.primitives._primitives[i].name);
		if (viewer.scene.primitives._primitives[i].name == asset) {

			var cloud3dAssect = viewer.scene.primitives._primitives[i];

			cloud3dAssect.readyPromise
				.then(function () {
					//viewer.zoomTo(cloud3dAssect);
					//Zoom to the perticular 3d model.
					viewer.zoomTo(cloud3dAssect,
						new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40),
							Cesium.Math.toRadians(-7),
							60));

					// Apply the default style if it exists
					var extras = cloud3dAssect.asset.extras;
					if (
						Cesium.defined(extras) &&
						Cesium.defined(extras.ion) &&
						Cesium.defined(extras.ion.defaultStyle)
					) {
						cloud3dAssect.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
					}
				})
				.otherwise(function (error) {
					console.log(error);
				});

		}
	}
}

//Changed
tmpl.Map.add3dModelAsAssectID = function (param) {
	var viewer = param.map;
	var mapObj = viewer;
	var assetid = param.assetid;
	var zoomLevel = param.zoomLevel;
	var pitch = param.pitchLevel;
	tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

	var tileset = viewer.scene.primitives.add(
		new Cesium.Cesium3DTileset({
			url: Cesium.IonResource.fromAssetId(assetid),
		})

	);
	//tileset.name = assetid;
	tileset.id = assetid;

	tileset.readyPromise
		.then(function () {
			//viewer.zoomTo(tileset);
			//Zoom to the perticular 3d model.
			if (zoomLevel > 5) {
				viewer.zoomTo(tileset,
					new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(pitch), zoomLevel));
				//alert("Zoom");
			}
			else {
				viewer.zoomTo(tileset,
					new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(-7), 60));
			}
			// Apply the default style if it exists
			var extras = tileset.asset.extras;
			if (
				Cesium.defined(extras) &&
				Cesium.defined(extras.ion) &&
				Cesium.defined(extras.ion.defaultStyle)
			) {
				tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
			}
		})
		.otherwise(function (error) {
			console.log(error);
		});

	///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////

	var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [];
	var ellipsoid = mapObj.scene.globe.ellipsoid;

	var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);

	handler.setInputAction(function (movement) {
		//alert();
		var pick = viewer.scene.pick(movement.position);
		// if (Cesium.defined(pick) && (pick.id.id === cid)) {
		if (Cesium.defined(pick)) {
			//alert(modValue.quXian[pick.id.id].name);
			//console.log("--",tileset.id);
			getOverlayFeatureDetails(tileset.id, [], tileset.id, [], viewer);
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

	///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////

}

tmpl.Map.remove3dModelAsAssectID = function (param) {
	var viewer = param.map;
	var assetid = param.assetid;
	for (var i = 0; i < viewer.scene.primitives._primitives.length; i++) {
		console.log(viewer.scene.primitives._primitives[i].name);
		if (viewer.scene.primitives._primitives[i].name == assetid) {
			var cloud3dAssect = viewer.scene.primitives._primitives[i];
			viewer.scene.primitives.remove(cloud3dAssect);
		}
	}
}


tmpl.Map.EnableOrDesableTerrain = function (param) {
	var viewer = param.map;
	var terrainVisibility = param.visibility;
	var terrainProvider;

	if (terrainVisibility == true || terrainVisibility == 'true') {

		terrainProvider = Cesium.createWorldTerrain({
			requestWaterMask: true,
			requestVertexNormals: true
		});
		viewer.terrainProvider = terrainProvider;

	} else {

		terrainProvider = new Cesium.EllipsoidTerrainProvider({});
		viewer.terrainProvider = terrainProvider;
	}

}

tmpl.Map.mapAnalysis3D = function (param) {
	var viewer = param.map;
	var type = param.types;
	var visibility = param.mapVisibility;//'terrain' , 'osmBuildings' , 'shadow' , 'tiled3DBaseMap'

	switch (type) {
		case 'terrain':
			// code block
			if (visibility == true) {
				tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });
				//alert("Working..!!");
			}
			else {
				tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: false });
			}
			break;

		case 'osmBuildings':
			// code block
			if (visibility == true) {
				tmpl.Map.addOSMBuildings({ map: viewer });
			}
			else {
				tmpl.Map.removeOSMBuildings({ map: viewer });
			}
			break;
		case 'shadow':
			// code block
			if (visibility == true) {
				tmpl.Map.enableShado({ map: viewer });
			}
			else {
				tmpl.Map.desableShado({ map: viewer });
			}
			break;


		case 'tiled3DBaseMap':
			// code block
			if (visibility == true) {
				tmpl.Map.add3dTiledMap({ map: viewer });
			}
			else {
				tmpl.Map.remove3dTiledMap({ map: viewer });
			}
			break;

		default:
		// code block

	}

}

tmpl.Overlay.addCamFieldOfView = function (param) {
	var mapObj = param.map;
	var lat = param.lat;
	var lon = param.lon;
	var angle = param.angle;
	var viewOfAngle = param.viewofangle;
	var distance = param.distance;
	var camfieldCallBackFun = param.callBackFunc;
	var wktBufferGeom = "POLYGON((";
	// ----------------------------------------
	// Calculate new Lat/Lng from original points
	// on a distance and bearing (angle)
	// Created By Ratheesh for Delhi POC
	// ----------------------------------------
	let llFromDistance = function (latitude, longitude, distance, bearing) {

		// taken from: https://stackoverflow.com/a/46410871/13549	
		// distance in KM, bearing in degrees

		const R = 6378.1;                         // Radius of the Earth
		const brng = bearing * Math.PI / 180;     // Convert bearing to radian
		let lat = latitude * Math.PI / 180;      // Current coords to radians
		let lon = longitude * Math.PI / 180;

		// Do the math magic
		lat = Math.asin(Math.sin(lat) * Math.cos(distance / R) + Math.cos(lat) * Math.sin(distance / R) * Math.cos(brng));
		lon += Math.atan2(Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat), Math.cos(distance / R) - Math.sin(lat) * Math.sin(lat));

		// Coords back to degrees and return
		return [(lat * 180 / Math.PI), (lon * 180 / Math.PI)];

	}

	let pointsOnMapCircle = function (latitude, longitude, distance, numPoints) {
		const points = [];
		for (let i = 0; i <= numPoints - 1; i++) {
			//Angle 180
			const bearing = Math.round((angle / numPoints) * i);
			console.log(bearing, i);
			const newPoints = llFromDistance(latitude, longitude, distance, bearing);
			points.push(newPoints);
		}
		return points;
	}

	// Generate 8 points on a 200 meter radius from a center of a Colloseum in Rome.
	//const points = pointsOnMapCircle(41.890242042122836, 12.492358982563019, 0.2, 8);
	const points = pointsOnMapCircle(lat, lon, distance, 8);


	let geoJSON = {
		"type": "FeatureCollection",
		"features": []
	};

	points.forEach((p) => {
		console.log("[" + p[1] + "," + p[0] + "]");
		wktBufferGeom += p[1] + ' ' + p[0] + ',';

	});
	wktBufferGeom += lon + ' ' + lat;
	wktBufferGeom += "))";
	camfieldCallBackFun(wktBufferGeom);
	/*
	//To Create Geojson
	points.forEach((p) => {
		geoJSON.features.push({
		  "type": "Feature",
		  "properties": {},
		  "geometry": {
			"type": "Point",
			"coordinates": [
			  p[1],
			  p[0]
			]
		  }
		});
	}); */


	console.log(">>>>>>--->", wktBufferGeom);

	console.log("--->", JSON.stringify(geoJSON, true, 2));

}

tmpl.Map.add3dBIMAsAssetID = function (param) {
	var viewer = param.map;
	//var mapObj = viewer;
	var assetid = param.assetid;
	//var zoomLevel = param.zoomLevel;
	//var pitch = param.pitchLevel;
	tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

	var tileset = viewer.scene.primitives.add(
		new Cesium.Cesium3DTileset({
			url: Cesium.IonResource.fromAssetId(assetid),
			id: assetid
		})
	);
	tileset.readyPromise
		.then(function () {
			viewer.zoomTo(tileset);

			// Apply the default style if it exists
			var extras = tileset.asset.extras;
			if (
				Cesium.defined(extras) &&
				Cesium.defined(extras.ion) &&
				Cesium.defined(extras.ion.defaultStyle)
			) {
				tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
			}
		})
		.otherwise(function (error) {
			console.log(error);
		});

}

tmpl.Map.snapshot = function (param) {
	try {
		var map = param.map;
		var type = param.type;
		var callBackFun = param.callBackFun;
		map.once('postcompose', function (event) {
			var canvas = event.context.canvas;
			if (type === 'png') {
				canvas.toBlob(function (blob) {
					//console.log(blob);
					callBackFun(blob);
				}, 'image/' + type, 1);
			} else {
				canvas.toBlob(function (blob) {
					//console.log(blob);
					callBackFun(blob);
				}, 'image/jpeg', 1);
			}
		});
		map.renderSync();
	} catch (e) {
		console.log("Map snapshot Issue..!", e);
	}
}

tmpl.Map.export = function (param) {
	try {
		var mapObj = param.map;
		var fileType = param.filetype;
		var fileName = param.filename;
		var Orientation = param.orientation;
		mapObj.once('postcompose', function (event) {
			var canvas = event.context.canvas;
			switch (fileType) {
				case 'png':
					canvas.toBlob(function (blob) {
						saveAs(blob, fileName + '.' + fileType);
					});
					break;
				case 'jpeg':
					canvas.toBlob(function (blob) {
						saveAs(blob, fileName + '.' + fileType);
					}, 'image/jpeg', 1);
					break;
				case 'pdf':
					var format = 'a4';
					if (Orientation == 'landscape' || Orientation == 'portrait') {
						switch (Orientation) {
							case 'landscape':
								Orientation = 'l';
								break;
							case 'portrait':
								Orientation = 'p';
								break;
							default:
								console.warn("Invalid orientation, setting to portrait >>> ");
								Orientation = 'p';
								break;
						}
					}
					var pdf = new jsPDF(Orientation, 'mm', format);
					var width = pdf.internal.pageSize.getWidth();
					var height = pdf.internal.pageSize.getHeight();
					const image = canvas.toDataURL('image/png', 1.0);
					//pdf.addImage(image, 'PNG', 12, 50, 190, 130);
					pdf.addImage(image, 'PNG', 0, 0, width, height);
					pdf.save(fileName + '.pdf');
					break;
				default:
					console.log("Invalid filetype, type is >>> " + fileType);
					break;
			}
		});

		mapObj.renderSync();

	} catch (error) {
		console.error(error);
	}
}

/*************************** */
tmpl.Map.print = function(param) {
	$("#MapPrint").show();
		//document.getElementById("MapPrint").style.display = "block";
		//var pageLayout = document.getElementById('layout').value;
		var map = param.map;
		var callbackFunc = param.callbackFunc;
	
	console.log("map~~~~~~~~~~~~~~~~~~~~~",map);
	
		var dims = {
			a0: [1189, 841],
			a1: [841, 594],
			a2: [594, 420],
			a3: [420, 297],
			a4: [297, 210],
			a5: [210, 148]
		};
		var loading = 0;
		var loaded = 0;
		var format = null;
		var pageLayout = null;
		var resolution = null;
		var dim = null;
		var width = null;
		var height = null;
		var size = null;
		var extent = null;
		var source;
		var exportButton=null;
		exportButton = document.getElementById('export-pdf');
		console.log("exportButton~~~~~~~~",exportButton);
		
		$("#export-pdf").unbind().click(function() {
			map.getView().setZoom(map.getView().getZoom() - 5);
			
			$("#loadingDiv").css("display", "block");
			var x = document.getElementById("download").value;
			console.log("selected download~~~~~~~~~~~", x);
			exportButton.disabled = true;
			document.body.style.cursor = 'progress';
			map.getView().setZoom(map.getView().getZoom() + 4.8);
	
	
			 format = document.getElementById('format').value;
			 pageLayout = document.getElementById('layout').value;
			 console.log("deva shree ganesha~~~~~~",document.getElementById('resolution').value);
			 resolution = document.getElementById('resolution').value;
			 dim = dims[format];
			 width = Math.round(dim[0] * resolution / 25.4);
			 height = Math.round(dim[1] * resolution / 25.4);
			 size = /** @type {ol.Size} */ (map.getSize());
			 console.log("width~~~~~~~~~~~",width);
			 console.log("height~~~~~~~~~~~",height);
			 console.log("size~~~~~~~~~~~",size);
			 extent = map.getView().calculateExtent(size);
			console.log("source~~~~~~~~~~~",extent);
		   // source = base_map_trinity.getSource();
		   console.log(map.getLayers())
		   source=map.getLayers().item(1).getSource();
			console.log("source 2~~~~~~~~~~~",source);
			var tileLoadStart = function() {
				console.log("loading 123...",loading);
				map.renderSync();
				++loading;
				console.log("loading...", loading);
			};
	
			var textLn, textLnS, legendWidth, l1, b1, b2, borderSpaceFromLeft, borderSpaceFromRight, asize, legbgHeight, legbgWidth, legendHeight, setSubFontSize, imagePos, setFontSize, imageHeight, imageWidth, headerSize, imagegg, borderSpace, fsize, x1, y1, x2, y2;
	
			var tileLoadEnd = function() {
				map.renderSync();
				++loaded;
				if (loading === loaded) {
					
					//var canvas = this;
					var canvas = $('canvas').get(0);
					console.log("loading sssssssssssssssssssssssss",canvas);
					window.setTimeout(function() {
						loading = 0;
						loaded = 0;
						var title = document.getElementById('title').value;
						var subtitle = document.getElementById('subtitle').value;
						var data = canvas.toDataURL('image/png');
						//var pdf = new jsPDF('landscape', undefined, format);
						var pdf = new jsPDF(pageLayout.toString(), undefined, format);
						if (dim[0] == 297 && dim[1] == 210) { //a4
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 50;
								textLnS = 50;
								setFontSize = 15;
								setSubFontSize = 12;
								imageWidth = 22;
								imageHeight = 22;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 30;
								w1 = 2;
								w2 = 2;
								w3 = 293;
								w4 = 205;
								borderSpaceFromLeft = 2;
								borderSpaceFromRight = 295;
								p1 = 35;
								p2 = 2;
								s1 = 35;
								s2 = 30;
								bsize = 170;
								fsize = 200;
								setFFontSize = 10;
								x1 = 150;
								x2 = 207;
								y1 = 150;
								y2 = 170;
								a1 = 180;
								a2 = 190;
								a3 = 195;
								a4 = 200;
								a5 = 205;
								legendWidth = 90;
								legendHeight = 35;
								imagePos = 170;
								bgHeight = 1000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 100;
								b1 = 20;
								b2 = 25;
								legText = 170;
							} else {
								l1 = 5;
								textLn = 70;
								textLnS = 70;
								setFontSize = 15;
								setSubFontSize = 12;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 40;
								borderSpaceFromLeft = 2;
								borderSpaceFromRight = 207;
								w1 = 2;
								w2 = 2;
								w3 = 205;
								w4 = 290;
								p1 = 40;
								p2 = 2;
								s1 = 40;
								s2 = 40;
								bsize = 242;
								fsize = 120;
								setFFontSize = 10;
								x1 = 110;
								x2 = 243;
								y1 = 110;
								y2 = 292;
								a1 = 255;
								a2 = 265;
								a3 = 270;
								a4 = 275;
								a5 = 280;
								legendWidth = 90;
								legendHeight = 45;
								imagePos = 245;
								bgHeight = 5000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 110;
								b1 = 25;
								b2 = 30;
								legText = 242;
							}
	
						} else if (dim[0] == 1189 && dim[1] == 841) { //a0
							if (pageLayout == 'landscape') {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 50;
								setSubFontSize = 46;
								imageWidth = 40;
								imageHeight = 40;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								asize = 60; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 1185; //border line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 1180; // border rectangle width 
								w4 = 830; // border rectangle height
								p1 = 60;
								p2 = 2;
								s1 = 60;
								s2 = 60;
								bsize = 700;
								fsize = 800;
								setFFontSize = 30;
								x1 = 700; // position from left of legend split line
								x2 = 700; // position from top of legend split line
								y1 = 700; // position from left of legend split line
								y2 = 835; //height of legend split line
								a1 = 720;
								a2 = 760;
								a3 = 780;
								a4 = 800;
								a5 = 820;
								legendWidth = 450;
								legendHeight = 120;
								imagePos = 700;
								bgHeight = 10000;
								bgWidth = 60;
								legbgHeight = 10000;
								legbgWidth = 200;
								b1 = 25;
								b2 = 40;
								legText = 700;
							} else {
								l1 = 10;
								textLn = 300;
								textLnS = 300;
								setFontSize = 80;
								setSubFontSize = 50;
								imageWidth = 150;
								imageHeight = 150;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								asize = 200; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 835;
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 830; // border rectangle width 
								w4 = 1170; // border rectangle height
								p1 = 200;
								p2 = 3;
								s1 = 200;
								s2 = 200;
								bsize = 1000;
								fsize = 600;
								setFFontSize = 30;
								x1 = 590; //legent division width position 
								x2 = 1000;
								y1 = 590; //legent division width position 
								y2 = 1175; // legent division border height
								a1 = 1020;
								a2 = 1080;
								a3 = 1090;
								a4 = 1200;
								a5 = 1110;
								legendWidth = 450;
								legendHeight = 140;
								imagePos = 1010;
								bgHeight = 10000;
								bgWidth = 60;
								legbgHeight = 10000;
								legbgWidth = 200;
								b1 = 100;
								b2 = 120;
								legText = 1000;
							}
						} else if (dim[0] == 420 && dim[1] == 297) { //a3
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 75;
								textLnS = 75;
								setFontSize = 20;
								setSubFontSize = 18;
								imageWidth = 20;
								imageHeight = 20;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								bsize = 245;
								fsize = 210;
								setFFontSize = 10;
								asize = 30; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 417; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 413; // border rectangle width 
								w4 = 290; // border rectangle height
								p1 = 30;
								p2 = 4;
								s1 = 30;
								s2 = 30;
								x1 = 200; // position from left of legend split line
								x2 = 245; // position from top of legend split line
								y1 = 200; // position from left of legend split line
								y2 = 294; //height of legend split line
								a1 = 250;
								a2 = 270;
								a3 = 275;
								a4 = 280;
								a5 = 285;
								legendWidth = 120; //110
								legendHeight = 50;
								imagePos = 245;
								bgHeight = 10000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 15;
								b2 = 23;
								legText = 245;
							} else {
								l1 = 10;
								textLn = 75;
								textLnS = 75;
								setFontSize = 20;
								setSubFontSize = 18;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 45;
								imagegg = 45;
								borderSpace = 100;
								asize = 50; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 294;
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 290; // border rectangle width 
								w4 = 412; // border rectangle height
								p1 = 50;
								p2 = 3;
								s1 = 50;
								s2 = 50;
								bsize = 347;
								fsize = 160;
								setFFontSize = 10;
								x1 = 150;
								x2 = 347;
								y1 = 150;
								y2 = 415;
								a1 = 360;
								a2 = 380;
								a3 = 385;
								a4 = 390;
								a5 = 395;
								legendWidth = 115; //110
								legendHeight = 45;
								imagePos = 355;
								bgHeight = 10000;
								bgWidth = 30;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 25;
								b2 = 35;
								legText = 900;
							}
	
						} else if (dim[0] == 841 && dim[1] == 594) { //a1
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 100;
								textLnS = 100;
								setFontSize = 40;
								setSubFontSize = 30;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 450;
								fsize = 500;
								setFFontSize = 30;
								asize = 40; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 836; //border line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 833; // border rectangle width 
								w4 = 585; // border rectangle height
								p1 = 40;
								p2 = 4;
								s1 = 40;
								s2 = 40;
								x1 = 450; // position from left of legend split line
								x2 = 450; // position from top of legend split line
								y1 = 450; // position from left of legend split line
								y2 = 590; //height of legend split line
								a1 = 470;
								a2 = 500;
								a3 = 515;
								a4 = 530;
								a5 = 545;
								legendWidth = 300;
								legendHeight = 140;
								imagePos = 450;
								bgHeight = 10000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 15;
								b2 = 30;
								legText = 450;
							} else {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 40;
								setSubFontSize = 30;
								imageWidth = 60;
								imageHeight = 60;
								headerSize = 70;
								imagegg = 85;
								borderSpace = 270;
								bsize = 650;
								asize = 80; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 590; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 585; // border rectangle width 
								w4 = 830; // border rectangle height
								p1 = 80;
								p2 = 4;
								s1 = 80;
								s2 = 80;
								fsize = 350;
								setFFontSize = 30;
								x1 = 320;
								x2 = 650;
								y1 = 320;
								y2 = 830;
								a1 = 690;
								a2 = 730;
								a3 = 745;
								a4 = 760;
								a5 = 775;
								legendWidth = 300;
								legendHeight = 140;
								imagePos = 680;
								bgHeight = 10;
								bgWidth = 10;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 30;
								b2 = 50;
								legText = 650;
							}
	
						} else {
							if (pageLayout == 'landscape') {
								l1 = 5;
								textLn = 100;
								textLnS = 100;
								setFontSize = 30;
								setSubFontSize = 20;
								imageWidth = 30;
								imageHeight = 30;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 320;
								fsize = 350;
								setFFontSize = 15;
								asize = 40; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 590; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 585; // border rectangle width 
								w4 = 410; // border rectangle height
								p1 = 40;
								p2 = 3;
								s1 = 40;
								s2 = 40;
								x1 = 300; // position from left of legend split line
								x2 = 320; // position from top of legend split line
								y1 = 300; // position from left of legend split line
								y2 = 415; //height of legend split line
								a1 = 330;
								a2 = 370;
								a3 = 380;
								a4 = 390;
								a5 = 400;
								legendWidth = 250;
								legendHeight = 90;
								imagePos = 320;
								bgHeight = 10000;
								bgWidth = 40;
								legbgHeight = 1000;
								legbgWidth = 200;
								b1 = 20;
								b2 = 30;
								legText = 320;
							} else {
								l1 = 10;
								textLn = 100;
								textLnS = 100;
								setFontSize = 30;
								setSubFontSize = 20;
								imageWidth = 60;
								imageHeight = 60;
								headerSize = 70;
								imagegg = 75;
								borderSpace = 270;
								bsize = 500;
								fsize = 220;
								setFFontSize = 15;
								asize = 80; // logo box width
								borderSpaceFromLeft = 4;
								borderSpaceFromRight = 415; //line width
								w1 = 4; //border from left
								w2 = 4; // border from right
								w3 = 410; // border rectangle width 
								w4 = 580; // border rectangle height
								p1 = 80;
								p2 = 3;
								s1 = 80;
								s2 = 80;
								x1 = 210;
								x2 = 500;
								y1 = 210;
								y2 = 585;
								a1 = 510;
								a2 = 540;
								a3 = 550;
								a4 = 560;
								a5 = 570;
								legendWidth = 180;
								legendHeight = 60;
								imagePos = 510;
								bgHeight = 0;
								bgWidth = 0;
								legbgHeight = 100;
								legbgWidth = 0;
								b1 = 30;
								b2 = 45;
								legText = 1000;
							}
	
						}
						var today = new Date();
						var dd = String(today.getDate()).padStart(2, '0');
						var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
						var yyyy = today.getFullYear();
						var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						var tTime = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
						today = mm + '_' + dd + '_' + yyyy;
						var tDayDate = mm + '/' + dd + '/' + yyyy;
						var unit = map.getView().getProjection().getUnits();
						var resolution = map.getView().getResolution();
						var DOTS_PER_INCH = 72;
						var scale = ol.proj.METERS_PER_UNIT[unit] * DOTS_PER_INCH * resolution;
						console.log(scale + " : " + unit);
						scale = Math.round(scale) * 100;
	
						console.log(scale + " : " + unit);
	
						if (pageLayout == 'portrait') {
							const pageWidth = dim[0]; //pdf.internal.pageSize.getWidth();
							const pageHeight = dim[1]; //pdf.internal.pageSize.getHeight();
	
	
							const widthRatio = pageWidth / canvas.width;
							const heightRatio = pageHeight / canvas.height;
							const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
	
							const canvasWidth = canvas.width * ratio;
							const canvasHeight = canvas.height * ratio;
	
							const marginX = (pageWidth - canvasWidth) / 2;
							const marginY = (pageHeight - canvasHeight) / 2;
							console.log("AX<AY", marginX, marginY);
							console.log("AX<AY", canvasWidth, canvasHeight);
							//pdf.addImage(data, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
							pdf.addImage(data, 'JPEG', marginX, asize, canvasWidth, canvasHeight);
							//pdf.output('dataurlnewwindow');
						} else {
							pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
						}
	
						//pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, 0, bgHeight, bgWidth); // for background white in Landscape mode
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, legText, legbgHeight, legbgWidth); // for background white in Landscape mode
						pdf.addImage(appConfigInfo.maplegent, 'PNG', 10, imagePos, legendWidth, legendHeight);
						if (dim[0] == 297 && dim[1] == 210) { //a4
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 270, 40, 20, 20);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 180, 50, 20, 20);
							}
	
						} else if (dim[0] == 1189 && dim[1] == 841) { //a0
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 1100, 80, 40, 40);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 750, 250, 40, 40);
							}
	
						} else if (dim[0] == 420 && dim[1] == 297) { //a3
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 390, 40, 20, 20);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 270, 70, 20, 20);
							}
	
						} else if (dim[0] == 841 && dim[1] == 594) { //a1	
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 800, 50, 30, 30);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 550, 90, 30, 30);
							}
	
						} else if (dim[0] == 594 && dim[1] == 420) { //a2
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 550, 50, 30, 30);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 390, 90, 20, 20);
							}
	
						} else {
							if (pageLayout == 'landscape') {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 250, 50, 10, 10);
							} else {
								pdf.addImage(appConfigInfo.dirIcon, 'JPEG', 180, 50, 10, 10);
							}
	
						}
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', 0, 0, p2, 1000);
						pdf.addImage(appConfigInfo.bgImage, 'JPEG', borderSpaceFromRight, 0, 10, 1000);
						//pdf.rect(2, 2, 205, 290);
						pdf.rect(w1, w2, w3, w4);
						pdf.setLineWidth(0.1);
						pdf.setDrawColor(0, 0, 0);
						pdf.line(borderSpaceFromLeft, asize, borderSpaceFromRight, asize);
						pdf.line(p1, p2, s1, s2);
						pdf.line(borderSpaceFromLeft, bsize, borderSpaceFromRight, bsize);
						pdf.line(x1, x2, y1, y2);
						pdf.setFontSize(setFFontSize);
						pdf.setFontType("normal");
						pdf.text(fsize, a1, 'For Office Use:');
						pdf.text(fsize, a2, 'Scale:  1:' + scale);
						pdf.text(fsize, a3, 'Projection :  ESPG:4326');
						pdf.text(fsize, a4, 'Date:' + tDayDate);
						pdf.text(fsize, a5, '© DNP/DSCDL');
						pdf.setFontSize(setFontSize);
						pdf.setFontType("bold");
						//pdf.text(textLn, 25, title);
						pdf.text(textLn, b1, title);
						pdf.setFontSize(setSubFontSize);
						//pdf.text(textLnS, 40, subtitle);//35
						pdf.text(textLnS, b2, subtitle); //35
						pdf.addImage(appConfigInfo.logo, 'JPEG', l1, l1, imageHeight, imageWidth);
	
					   if (x == 'jpeg') {
							
							var aa = pdf.output('arraybuffer');
							console.log("sssssssssssss", aa.data);
							var bytes = new Uint8Array(pdf.output('arraybuffer'));
							console.log("sssssssssssss", bytes);
							var b = encode(bytes);
							console.log("sssssssssssss", encode(bytes));
							var pdfData = atob(b);
							setTimeout(function() {
								
								pdfjsLib.GlobalWorkerOptions.workerSrc = appConfigInfo.mapSDKURL + 'pdf_Worker.js';
								pdfjsLib.getDocument({
									data: pdfData
								}).then(function getPdfHelloWorld(pdf) {
									pdf.getPage(1).then(function getPageHelloWorld(page) {
										var scale = 1.5;
										var viewport = page.getViewport(scale);
										var canvasa = document.createElement('canvas');
										canvasa.id = "the-canvas";
										var context = canvasa.getContext('2d');
										canvasa.height = viewport.height;
										canvasa.width = viewport.width;
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
										setTimeout(function() {
											canvasa.toBlob(function(blob) {
	
												console.log(blob);
												saveAs(blob, 'DSCDLMap_' + today + '_' + time + 'map.jpeg');
												$("#loadingDiv").css("display", "none");
												document.getElementById("customSelect").reset();
												$("#MapPrint").hide();
											});
											try {
												 map.renderSync();
												tmpl.Map.resize({
													map: map
												});
												console.log("qwertyuiopasdfghjkl~~~~~~~",map);
												console.log("qwertyuiopasdfghjkl~~~~~~~",extent);
												tmpl.Zoom.toExtent({
													map : map,
													extent : extent
												});	
											} catch (e) {
												console.log("Map Resize Error!", e);
											}
										}, 1500);
	
									});
								});
							x=null;
							}, 1000);
						} else if (x == 'png') {
							
							var aa = pdf.output('arraybuffer');
							console.log("sssssssssssss", aa.data);
							var bytes = new Uint8Array(pdf.output('arraybuffer'));
							console.log("sssssssssssss", bytes);
							var b = encode(bytes);
							console.log("sssssssssssss", encode(bytes));
							var pdfData = atob(b);
							setTimeout(function() {
								try {
									tmpl.Map.resize({
										map: map
									});
								} catch (e) {
									console.log("Map Resize Error!", e);
								}
								pdfjsLib.GlobalWorkerOptions.workerSrc = appConfigInfo.mapSDKURL + 'pdf_Worker.js';
								pdfjsLib.getDocument({
									data: pdfData
								}).then(function getPdfHelloWorld(pdf) {
									pdf.getPage(1).then(function getPageHelloWorld(page) {
										var scale = 1.5;
										var viewport = page.getViewport(scale);
										var canvasa = document.createElement('canvas');
										canvasa.id = "the-canvas";
										var context = canvasa.getContext('2d');
										canvasa.height = viewport.height;
										canvasa.width = viewport.width;
										var renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
										setTimeout(function() {
											canvasa.toBlob(function(blob) {
	
												console.log(blob);
												saveAs(blob, 'DSCDLMap_' + today + '_' + time + 'map.png');
												$("#loadingDiv").css("display", "none");
												document.getElementById("customSelect").reset();
												$("#MapPrint").hide();
											});
												
										}, 1500);
	
									});
								});
								x=null;
							}, 1000);
						} else {
							
							
							pdf.save('DSCDLMap_' + today + '_' + time + 'map.pdf');
							$("#loadingDiv").css("display", "none");
							document.getElementById("customSelect").reset();
							x=null;
							$("#MapPrint").hide();
							
						}
	
						map.renderSync();
						source.un('tileloadstart', tileLoadStart);
						map.renderSync();
						source.un('tileloadend', tileLoadEnd, canvas);
						//source.un('tileloaderror', tileLoadEnd, canvas);
	
						map.setSize(size);
						map.getView().fit(extent, size);
						map.renderSync();
	
						exportButton.disabled = false;
						
						document.body.style.cursor = 'auto';
						//callbackFunc('DSCDLMap_'+today+'_'+time+'map.pdf');
						
					}, 100);
	
	
				}
				else {
					console.log("this is getting Called after loaded")
				}
				// Tile Load End function
	
			};
	
			//map.once('postcompose', function(event) {
			map.once('postcompose', function(event) {
	            console.log("map once is called")
				event.context.imageSmoothingEnabled = false;
				event.context.webkitImageSmoothingEnabled = false;
				event.context.mozImageSmoothingEnabled = false;
				event.context.msImageSmoothingEnabled = false;
				map.renderSync();
				source.on('tileloadstart', tileLoadStart);
				map.renderSync();
				source.on('tileloadend', tileLoadEnd, event.context.canvas);
				//source.on('tileloaderror', tileLoadEnd, event.context.canvas);
			});
	
			map.setSize([width, height]);
			map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
			map.renderSync();
		});
		
		
}

tmpl.Map.zoom3d = function (param) {
	
	var map = param.map;
	var mapHeight = param.mapHeight;

	var lat = param.lat;
	var lon = param.lon;

	var mapHeight = param.mapHeight;
	var maxZ = mapHeight;
	var minZ = mapHeight;
	//var maxZ = param.maxZoom;
	//var minZ = param.minZoom;

		
	
	if(appConfigInfo.mapDimension == '3D'){
	var cartographic = new Cesium.Cartographic();
	var cartesian = new Cesium.Cartesian3();
	var camera = map.scene.camera;
	var ellipsoid = map.scene.mapProjection.ellipsoid;
	var height = 0;
	var scene = map.scene;
		scene.mode= Cesium.SceneMode.SCENE3D;
	
	ellipsoid.cartesianToCartographic(camera.position, cartographic);
	console.log("---->",cartographic.height);
	//var height = cartographic.height; // convert to meters
	if(mapHeight){
	 height = mapHeight; // convert to meters
	}else{
	 height = cartographic.height;  // convert to meters
	}
	
			ellipsoid.cartesianToCartographic(camera.position, cartographic);
			cartographic.height =mapHeight;// convert to meters  //  mapHeight * 1000; 
			ellipsoid.cartographicToCartesian(cartographic, cartesian);
			camera.position = cartesian;
				
	scene.mode= Cesium.SceneMode.SCENE2D;

	/*if(cartographic.height > mapHeight )
	{
			var zoominheight = height - 1000;
			// console.log("zoominheight: ",zoominheight);
			cartographic.height = zoominheight;
			ellipsoid.cartographicToCartesian(cartographic, cartesian);
			camera.position = cartesian;
			mapZoomLevel(zoominheight);
			
			
			if (cartographic.height < 1500) {
				zoominheight = height - 250;
				cartographic.height = zoominheight;
				ellipsoid.cartographicToCartesian(cartographic, cartesian);
				camera.position = cartesian;
				mapZoomLevel(zoominheight);
			}

			if (cartographic.height < 300) {
				zoominheight = 250;
				cartographic.height = zoominheight;
				ellipsoid.cartographicToCartesian(cartographic, cartesian);
				camera.position = cartesian;
				mapZoomLevel(zoominheight);
			}
	
	}else{
	
	var zoomoutheight = height + 1000;
	//console.log("zoomoutheight: ", zoomoutheight);
	cartographic.height = zoomoutheight;
	ellipsoid.cartographicToCartesian(cartographic, cartesian);
	camera.position = cartesian;

	if (cartographic.height < 1500) {
		zoomoutheight = height + 250;
		cartographic.height = zoomoutheight;
		ellipsoid.cartographicToCartesian(cartographic, cartesian);
		camera.position = cartesian;
	}
	
	}*/
	
	}
	else{
		//var newMinZoom = 5;
		//map.getView().setZoom(mapHeight);

		// var newMinZoom = map.getView().getZoom();
		// console.log("#############", newMinZoom);
		//map.setMinZoom(newMinZoom)

		// var CenterOfGeom = gmap.getView().getCenter();
		// var lon = CenterOfGeom[0];

		// var lat = CenterOfGeom[1];
		console.log("#############", lat, lon, maxZ, minZ);
		
		if(lat && lon){
			map.setView(new ol.View({
				zoom: 15,
				center: [parseFloat(lon), parseFloat(lat)],
				//center: [parseFloat(76.2711), parseFloat(10.8505)],
				maxZoom: maxZ,
				minZoom: minZ,
				projection: appConfigInfo.projection
			}));
		}
		else{
			map.setView(new ol.View({
				zoom: 15,
				//center: [parseFloat(CenterOfGeom[0]), parseFloat(CenterOfGeom[1])],
				center: [parseFloat(appConfigInfo.lon), parseFloat(appConfigInfo.lat)],
				maxZoom: maxZ,
				minZoom: minZ,
				projection: appConfigInfo.projection
			}));
		}
		
	}	
}

tmpl.Map.addInteraction = function(param){
	var map = param.map;
	var interaction = param.interaction;
	var mapIntration = null;
	
			if(appConfigInfo.mapDimension=='2D')
			{	
				switch(interaction) {
				  case "DoubleClickZoom":
					mapIntration = new ol.interaction.DoubleClickZoom;
					map.addInteraction(mapIntration);
					break;
				  case "DragPan":
					mapIntration = new ol.interaction.DragPan;
					map.addInteraction(mapIntration);
					break;
				  case "MouseWheelZoom":
					//mapIntration = new ol.interaction.MouseWheelZoom;
					//map.addInteraction(mapIntration);
					
					var mouseWheelInt = new ol.interaction.MouseWheelZoom();
 					map.addInteraction(mouseWheelInt)
					break;
				case "KeyboardZoom":
					mapIntration = new ol.interaction.KeyboardZoom;
					map.addInteraction(mapIntration);
					break;
				case "KeyboardPan":
					mapIntration = new ol.interaction.KeyboardPan;
					map.addInteraction(mapIntration);
					break;
				  default:
					console.log("interaction Key is not available..!");
				}
			
					
			}else{
					var scene = map.scene;
			switch(interaction) {
			
			  case "DragPan":
					scene.screenSpaceCameraController.enableTranslate = true;
					break;
				  case "MouseWheelZoom":
					scene.screenSpaceCameraController.enableZoom = true;
					break;
					 default:
					console.log("interaction Key is not available..!");
				}
			}
			
	}

/*****  This API is for Select Feature By Hover *****/
	tmpl.Map.SelectFeaturesByHover = function (param) {
		try {
			var mapObj = param.map;
			var url = param.jsonUrl;
			var title = param.layerName;
			
			var sourceWFS = new ol.source.Vector({
				format: new ol.format.GeoJSON({
					extractGeometryName: true
				}),
				title: title,
				url: url,
				//strategy: ol.loadingstrategy.bbox,
				projection: 'EPSG:4326'
			});
	
			var vectorLayer = new ol.layer.Vector({
				source: sourceWFS,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'rgba(255,255,0,0.0)',
						// opacity: 0.5,
						width: 1
					})
				})
			});
			//vectorLayerWFS.setProperties({
			//	title: layerName
			//});
			mapObj.addLayer(vectorLayer);
		} catch (err) {
			console.error("Error at adding WMS layer >>> " + err);
		}

		let highlightedFeatures = [];

        mapObj.on('pointermove', function (e) {
                highlightedFeatures.forEach(f => f.setStyle(null));
                highlightedFeatures = [];
                mapObj.forEachFeatureAtPixel(e.pixel, singleFeature => {
                    singleFeature.setStyle(new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'black',
                            width: 1
                        }),
                    /*    fill: new ol.style.Fill({
                            color : 'rgba(43, 255, 0, 0.3)',
                            opacity: 0.1
                        }) */
                    }));
                    highlightedFeatures.push(singleFeature);
                   // console.log("name", singleFeature.getProperties().name);
                   // console.log("getProperties", singleFeature.getProperties());
                });
            }); 
	}
    

