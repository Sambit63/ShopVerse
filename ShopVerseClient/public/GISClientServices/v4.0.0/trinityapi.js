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
};


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

							if (callBackFun) {
								callBackFun(map);
							}
							console.log("~~~~~~~~~~Map OBJm:::::::::", map);
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
										controls: ol.control.defaults.defaults({
											zoom: true,
											attribution: true,
											rotate: false,
											doubleClickZoom: true
										}),
										layers: [baseLayer, base_map_streetLayer_trinity, satelliteLayer],
										target: targetDiv,
										view: view
									});
									//base_map_streetLayer_trinity.setVisible(false);
								} else {
									map = new ol.Map({
										controls: ol.control.defaults.defaults({
											zoom: true,
											attribution: true,
											rotate: false,
											doubleClickZoom: true
										}),
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
										controls: ol.control.defaults.defaults({
											zoom: true,
											attribution: true,
											rotate: false,
											doubleClickZoom: true
										}),
										layers: [baseLayer, streetLayer_trinity],
										target: targetDiv,
										view: view
									});
									base_map_streetLayer_trinity.setVisible(false);
								} else {
									map = new ol.Map({
										controls: ol.control.defaults.defaults({
											zoom: true,
											attribution: true,
											rotate: false,
											doubleClickZoom: true
										}),
										layers: [baseLayer],
										target: targetDiv,
										view: view
									});
								}

							}
							//activate(map);
							// if (mainMap == true) {
							// 	getTrinityLayersList(map);
							// }
							if (callBackFun)
								callBackFun(map);
							try {
								// tmpl.Map.getToken({
								// 	callbackFun: function token(a) {
								// 		console.log("Token::", a.access_token);
								// 		appConfigInfo.bToken = "Bearer " + a.access_token;
								// 	}
								// });
							} catch (e) { console.log("PentaB Token Issue:", e); }
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
						console.log("~~~~~~ Other map");
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

// ********************* SDK_MAP_API (2) Resize ********************* //
tmpl.Map.resize = function (param) {
	var mapObj = param.map;
	if (mapObj) {

		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == 'ol7') {
				try {
					mapObj.updateSize();
					console.log("Map Resized!!", true);
				}
				catch (e) { console.err("error", e); }
			}
			else if (appConfigInfo.mapLib == 'leaflet') {
				try {
					mapObj.invalidateSize();
					//var stat = mapObj.invalidateSize();
					console.log("Map Resized!!", true);
				}
				catch (e) { console.err("error", e); }
			}
		}
		else {
			try {
				mapObj.updateSize();
			}
			catch (e) { console.error("error", e); }
		}
	}
}

// ********************* SDK_MAP_API (3) Remove ********************* //
tmpl.Map.remove = function (param) {
	var mapObj = param.map;
	//  var lyr1 = param.lyr1;
	if (mapObj) {

		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == 'ol7') {
				try {
					var allLayers = mapObj.getLayers();
					var layerLength = allLayers.getLength();
					for (var j = 0; j < layerLength; j++) {
						var lyr1 = allLayers.item(j);
						if (lyr1) {
							mapObj.removeLayer(lyr1);
						}
					}
					console.log("Map removed!!", true);
				}
				catch (e) { console.log("error", e); }
			}
			else if (appConfigInfo.mapLib == 'leaflet') {
				try {

					var StS = mapObj.eachLayer(function (layer) {
						mapObj.removeLayer(layer);
					});
					if (StS) { console.log("Map removed successfully!"); } else { console.log("Not able to remove map!"); }

				}
				catch (e) { console.log("error", e); }
			}
		}
		else {
			try {
				mapObj.entities.removeAll();
				mapObj.destroy();
			}
			catch (e) { console.log("3D Map Remove Error..!", e); }
		}
	}
}

// ********************* SDK_MAP_API (4) GetBaseMap ********************* //
var baseMapLayerObjects = [];
tmpl.Map.getBaseMaps = function () {
	if (appConfigInfo.mapDimension == "2D") {
		if (appConfigInfo.mapLib == 'ol7') {
			try {
				var osmLayer = new ol.layer.Tile({
					source: new ol.source.OSM()
				});

				var esriLayer = new ol.layer.Tile({
					source: new ol.source.XYZ({
						url: appConfigInfo.esri_url + '/tile/{z}/{y}/{x}'
					})
				});

				var googleLayer = [new ol.layer.Tile({
					source:
						new ol.source.XYZ({
							url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
						})
				})];

				var googleSatelliteLayer = [new ol.layer.Tile({
					source:
						new ol.source.XYZ({
							url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
						})
				})];

				baseMapLayerObjects[0] = osmLayer;
				baseMapLayerObjects[1] = esriLayer;
				baseMapLayerObjects[2] = googleLayer;
				baseMapLayerObjects[3] = googleSatelliteLayer;

				var basemaps = [
					// { name: 'Google Road Map', id: 2 }
					, { name: 'googleLayer', id: 2 } //google styled mode
					, { name: 'Google Satellite Map', id: 3 }
					, { name: 'Open Street Map', id: 0 }
					, { name: 'ESRI Map', id: 1 }
				];
				return basemaps;

			} catch (error) {

				console.log("getBaseMaps", error);

			}
		}
		else if (appConfigInfo.mapLib == 'leaflet') {
			try {

				var osmLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
					subdomains: 'abcd',
					maxZoom: 20
				});

				var esriLayer = L.tileLayer(
					'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
					//maxZoom: 18,
				});

				var googleLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
					maxZoom: 20,
					subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
				});

				var googleSatelliteLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
					maxZoom: 20,
					subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
				});

				baseMapLayerObjects[0] = osmLayer;
				baseMapLayerObjects[1] = esriLayer;
				baseMapLayerObjects[2] = googleLayer;
				baseMapLayerObjects[3] = googleSatelliteLayer;

				var basemaps = [
					//  { name: 'Google Road Map', id: 2 }
					, { name: 'googleLayer', id: 2 } //google styled mode
					, { name: 'Google Satellite Map', id: 3 }
					, { name: 'Open Street Map', id: 0 }
					, { name: 'ESRI Map', id: 1 }
				];
				return basemaps;
			} catch (error) {
				console.log("getBaseMaps", error);
			}
		}
	}
	else {
		try {
			var osmLayer = new Cesium.OpenStreetMapImageryProvider({
				url: 'https://a.tile.openstreetmap.org/'
			});

			var esriLayer = new Cesium.ArcGisMapServerImageryProvider({
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
				usePreCachedTilesIfAvailable: true,
			});



			// var imageryLayers = mapObj.imageryLayers;
			// imageryLayers.addImageryProvider(esridark);

			baseMapLayerObjects[0] = osmLayer;
			baseMapLayerObjects[1] = esriLayer;

			// baseMapLayerObjects[2] = googleLayer;
			// baseMapLayerObjects[3] = googleSatelliteLayer;

			var basemaps = [
				{ name: 'Open Street Map', id: 0 }
				, { name: 'ESRI Map', id: 1 }
			];
			return basemaps;

		} catch (error) {
			console.log("3D getBaseMaps Error..!", error);

		}
	}
}

// ********************* SDK_MAP_API (5) SwitchBaseMap ********************* //

tmpl.Map.switchBaseMaps = function (param) {
	var mapobj = param.map;
	var id = param.id;
	//var layers = mapobj.getLayers();

	//mapobj.removeLayer(layers.item(0));
	if (mapobj) {
		if (appConfigInfo.mapDimension == '2D') {
			if (appConfigInfo.mapLib == 'ol7') {
				try {
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
					console.log("switchBaseMaps!!", true)

				} catch (error) {
					console.error("error", error);
				}
			}
			else if (appConfigInfo.mapDimension == 'leaflet') {
				try {
					L.control.layers(sglBaseLayer, overlays).addTo(mapobj);
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
}

// ********************* SDK_MAP_API (6) CenterPoint ********************* //

tmpl.Map.centerPoint = function (param) {
	var mapObj = param.map;
	var centerPoint;
	if (appConfigInfo.mapDimension == '2D') {
		if (appConfigInfo.mapLib == 'ol7') {

			try {
				if (appConfigInfo.mapData === 'google') {
					centerPoint = ol.proj.transform(mapObj.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
				} else {
					centerPoint = mapObj.getView().getCenter();
				}
				return centerPoint;
				// console.log("centerPoint!!", true)

			} catch (error) {
				console.error("centerPoint error", error);

			}
		}
		else if (appConfigInfo.mapLib == 'leaflet') {
			try {
	
				// L.latLng(mapObj.getCenter())
				// mymapObj.getCenter()
				var data = L.latLng(mapObj.getCenter());
				console.log("~~~~~~~~~~~DATA", data);
				// mapObj.getCenter();
			} catch (error) {
	
			}
		}
	}
	
	else {
		try {
			var ellipsoid = mapObj.scene.globe.ellipsoid;
			var carto = mapObj.camera.positionCartographic;
			var lon = Cesium.Math.toDegrees(carto.longitude);
			var lat = Cesium.Math.toDegrees(carto.latitude);
			centerPoint = [lon, lat];

			return centerPoint;

		} catch (error) {
			console.error("ERROR Map.centerPoint: ", error);

		}
	}
}

// ********************* SDK_MAP_API (7) PointWithinBoundary ********************* //
tmpl.Map.pointWithinBoundary = function (param) {
	var callBackFun = param.callBackFunc;
	var lat = param.lat;
	var long = param.lon;

	var result;
	var settings = {
		"url": appConfigInfo.connection.url + "/getBoundaryConatins",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"lat": lat,
			"lon": long
		}),
	};

	$.ajax(settings).done(function (response) {
		console.log(response);
		console.log(response.Status);
		result = response;
	});

	if (callBackFun) {
		callBackFun(result);
	}
	console.log(callBackFun);
}

// ********************* SDK_MAP_API (6) print ********************* //
tmpl.Map.print = function (param) {
	var mapObj = param.map;
	map = mapObj;
	var callbackFunc = param.callbackFunc;

	var boundary = `
	<form class="form">
	<label for="format">Page size </label>
	<select id="format">
		<option value="a0">A0 (slow)</option>
		<option value="a1">A1</option>
		<option value="a2">A2</option>
		<option value="a3">A3</option>
		<option value="a4" selected>A4</option>
		<option value="a5">A5 (fast)</option>
	</select>
	<label for="resolution">Resolution </label>
	<select id="resolution">
		<option value="72">72 dpi (fast)</option>
		<option value="150">150 dpi</option>
		<option value="200" selected>200 dpi</option>
		<option value="300">300 dpi (slow)</option>
	</select>
	<label for="scale">Scale </label>
	<select id="scale">
		<option value="500">1:500000</option>
		<option value="250" selected>1:250000</option>
		<option value="100">1:100000</option>
		<option value="50">1:50000</option>
		<option value="25">1:25000</option>
		<option value="10">1:10000</option>
	</select>
</form>
<button id="export-pdf">Export PDF</button>`;

	var mapDiv = document.getElementById(globalMapDivID);

	var mapForm = document.createElement("form");
	mapForm.className = "form";
	mapDiv.appendChild(mapForm);

	var lableForFormat = document.createElement("label");
	lableForFormat.for = "format";
	lableForFormat.innerHTML = "Page size";

	mapForm.appendChild(lableForFormat);

	var selectForFormat = document.createElement("select");
	selectForFormat.id = "format";

	var optionForFormat0 = document.createElement("option");
	optionForFormat0.value = "a0";
	optionForFormat0.innerHTML = "A0 (slow)";
	selectForFormat.appendChild(optionForFormat0);

	var optionForFormat1 = document.createElement("option");
	optionForFormat1.value = "a1";
	optionForFormat1.innerHTML = "A1";
	selectForFormat.appendChild(optionForFormat1);

	var optionForFormat2 = document.createElement("option");
	optionForFormat2.value = "a2";
	optionForFormat2.innerHTML = "A2";
	selectForFormat.appendChild(optionForFormat2);

	var optionForFormat3 = document.createElement("option");
	optionForFormat3.value = "a3";
	optionForFormat3.innerHTML = "A3";
	selectForFormat.appendChild(optionForFormat3);

	var optionForFormat4 = document.createElement("option");
	optionForFormat4.value = "a4";
	optionForFormat4.innerHTML = "A4";
	selectForFormat.appendChild(optionForFormat4);

	var optionForFormat5 = document.createElement("option");
	optionForFormat5.value = "a5";
	optionForFormat5.innerHTML = "A5";
	selectForFormat.appendChild(optionForFormat5);

	mapForm.appendChild(selectForFormat);

	// resolution  //
	var lableForm = document.createElement("label");
	lableForm.for = "resolution";
	lableForm.innerHTML = "resolution";
	mapForm.appendChild(lableForm);

	var selectForResolution = document.createElement("select");
	selectForResolution.id = "resolution";

	var optionForResolution1 = document.createElement("option");
	optionForResolution1.value = "72";
	optionForResolution1.innerHTML = "72 dpi (fast)";
	selectForResolution.appendChild(optionForResolution1);

	var optionForResolution2 = document.createElement("option");
	optionForResolution2.value = "150";
	optionForResolution2.innerHTML = "150 dpi";
	selectForResolution.appendChild(optionForResolution2);

	var optionForResolution3 = document.createElement("option");
	optionForResolution3.value = "200";
	optionForResolution3.innerHTML = "200 dpi";
	selectForResolution.appendChild(optionForResolution3);

	var optionForResolution4 = document.createElement("option");
	optionForResolution4.value = "300";
	optionForResolution4.innerHTML = "300 dpi (slow)";
	selectForResolution.appendChild(optionForResolution4);

	mapForm.appendChild(selectForResolution);

	// For Scale  // 
	var lableForScale = document.createElement("label");
	lableForScale.for = "scale";
	lableForScale.innerHTML = "Scale";

	mapForm.appendChild(lableForScale);

	var selectForScale = document.createElement("select");
	selectForScale.id = "scale";

	var optionForScale1 = document.createElement("option");
	optionForScale1.value = "500";
	optionForScale1.innerHTML = "1:500000";
	selectForScale.appendChild(optionForScale1);

	var optionForScale2 = document.createElement("option");
	optionForScale2.value = "250";
	optionForScale2.innerHTML = "1:250000";
	selectForScale.appendChild(optionForScale2);

	var optionForScale3 = document.createElement("option");
	optionForScale3.value = "100";
	optionForScale3.innerHTML = "1:100000";
	selectForScale.appendChild(optionForScale3);

	var optionForScale4 = document.createElement("option");
	optionForScale4.value = "50";
	optionForScale4.innerHTML = "1:50000";
	selectForScale.appendChild(optionForScale4);

	var optionForScale5 = document.createElement("option");
	optionForScale5.value = "25";
	optionForScale5.innerHTML = "1:25000";
	selectForScale.appendChild(optionForScale5);

	var optionForScale6 = document.createElement("option");
	optionForScale6.value = "10";
	optionForScale6.innerHTML = "1:10000";
	selectForScale.appendChild(optionForScale6);

	mapForm.appendChild(selectForScale);


	var buttonForExportpdf = document.createElement('BUTTON');
	buttonForExportpdf.className = 'export-pdf';
	buttonForExportpdf.id = 'pdf';
	//buttonForExportpdf.innerHTML = '<i class="fa fa-file-pdf-o"></i>';
	buttonForExportpdf.innerHTML = 'Export';
	mapForm.appendChild(buttonForExportpdf);


	const scaleLine = new ol.control.ScaleLine({ bar: true, text: true, minWidth: 125 });
	map.addControl(scaleLine);
	const dims = {
		a0: [1189, 841],
		a1: [841, 594],
		a2: [594, 420],
		a3: [420, 297],
		a4: [297, 210],
		a5: [210, 148],
	};

	// export options for html2canvase.
	// See: https://html2canvas.hertzen.com/configuration
	const exportOptions = {
		useCORS: true,
		ignoreElements: function (element) {
			const className = element.className || '';
			return (
				className.includes('ol-control') &&
				!className.includes('ol-scale') &&
				(!className.includes('ol-attribution') ||
					!className.includes('ol-uncollapsible'))
			);
		},
	};

	//const exportButton = document.getElementById('export-pdf');
	const exportButton = buttonForExportpdf;
	// var el = document.getElementById('overlayBtn');
	// if (el) {
	// 	el.addEventListener('click', swapper, false);
	// }

	if (exportButton) {
		exportButton.addEventListener(
			'click',
			function () {
				exportButton.disabled = true;
				document.body.style.cursor = 'progress';

				//const format = document.getElementById('format').value;
				const format = selectForFormat.value;
				//const resolution = document.getElementById('resolution').value;
				const resolution = selectForResolution.value;
				//const scale = document.getElementById('scale').value;
				const scale = selectForScale.value;
				console.log("FRS", format, resolution, scale);
				const dim = dims[format];

				const width = Math.round((dim[0] * resolution) / 25.4);
				const height = Math.round((dim[1] * resolution) / 25.4);
				const viewResolution = map.getView().getResolution();

				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				var tTime = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
				today = mm + '_' + dd + '_' + yyyy;


				const scaleResolution =
					scale /
					ol.proj.getPointResolution(
						map.getView().getProjection(),
						resolution / 25.4,
						map.getView().getCenter()
					);

				map.once('rendercomplete', function () {
					exportOptions.width = width;
					exportOptions.height = height;
					html2canvas(map.getViewport(), exportOptions).then(function (canvas) {
						const pdf = new jspdf.jsPDF('landscape', undefined, format);
						pdf.addImage(
							canvas.toDataURL('image/jpeg'),
							'JPEG',
							0,
							0,
							dim[0],
							dim[1]
						);
						pdf.save('tmpl' + today + '_' + time + 'map.pdf');
						// Reset original map size
						scaleLine.setDpi();
						map.getTargetElement().style.width = '';
						map.getTargetElement().style.height = '';
						map.updateSize();
						map.getView().setResolution(viewResolution);
						exportButton.disabled = false;
						document.body.style.cursor = 'auto';
					});
				});

				// Set print size
				scaleLine.setDpi(resolution);
				map.getTargetElement().style.width = width + 'px';
				map.getTargetElement().style.height = height + 'px';
				map.updateSize();
				map.getView().setResolution(scaleResolution);
			},
			false
		);
	}

}




