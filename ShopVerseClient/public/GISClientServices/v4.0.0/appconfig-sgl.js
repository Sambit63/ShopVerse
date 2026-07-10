//By defining config information as json object we can avoid these 20 global variables and more changes in the API code are not required while using this json object.
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
tmpl.Utils = {};

tmpl.mapOnClickExtraForPOIDelete;
tmpl.mapOnClickExtraForCenterMap;

var gisErrors;

var gmap_googleMap;
var layoutMapObjectAPI;
var gblTrackSameLatLong = true;
var vehicleObj;
var track_ivlDraw;
var tripTimeDelay;
var popup;
var pointerMoveID;
var tripPlaybackAnimation;

var sgl_baseMap;
var globalMapDivID;
var tmpl_setMap_layer_global_array = [];
var streetLayer_trinity;
var tmpl_setMap_layer_global = [];
var tmpl_setMap_layer_global_overlay = [];

var appConfigInfo = {



	//API Man Configuration As of now Two Is there Need to Merge it Once it is Familiarized
	apiManURL : "http://tiotapi.tsf.com/",
	apiManVersion : "1.0.0",
	apiManKey : "SXY4V3ZCWjVfRGp4Qm5GWXNuRjZjWHhqaU5jYTpsbFRKaWdpM2ZQTWIzZkVuWHFSUDR1RDBmb2Nh",
	apimanUser : "admin",
	apimanPass : "admin",

	apiManGetAccessToken : "http://tiotapi.tsf.com/tiotAPIESBSubSystem/1.0.0/getAccessToken",
	apiManUsername : "trinitygis@tsf.com",
	apiManPassword : "trinity@123",
	apiManAuthorizationKey : "ODdHV0tlZ0VoTUFwbWFCdDgwSHVhdjNtMWcwYTpoZHh1QlNDSDgyYnByR2xvSHRQN0dqMkxmNjRh",
	apiManUrlForGecode : "http://tiotapi.tsf.com/t/tsf.com/tiotGIS/1.0.0",
	gKey : "AIzaSyA7z_IJBC_8QTKN7HlO2ZmSZX-RKNIVUh8",


	
	googleMapKey : "AIzaSyA7z_IJBC_8QTKN7HlO2ZmSZX-RKNIVUh8",
	
	mapSDKURL: window.location.protocol+'//'+window.location.hostname+"/GISClientServices/v4.0.0/",
	mapSDK3DURL: window.location.protocol+'//'+window.location.hostname+"/GISClientServices/v4.0.0/cesium/",
	
	// mapSDKURL: "C:/Trinity Files/Development/GIS/SVN/RnD_GIS_RV2.3.0_8363/GISClientServices/v4.0.0/",
	// mapSDK3DURL: "C:/Trinity Files/Development/GIS/SVN/RnD_GIS_RV2.3.0_8363/GISClientServices/v4.0.0/cesium/",

	
	trinityzoom : 10,

	mapDimension : "2D",
	mapData : "sgl",
	mapLib : "ol7",
	type : 'sgl',
	mode : 'normal',

    //Map configuration 


	lon : 79.78949431083002,
	lat : 11.902532306454798,  
	height : 1800,
	
	extent1 : 79.78949431083002, 
	extent2 : 11.902532306454798, 
	extent3 : 79.84236601253681, 
	extent4 : 11.973406653808816 ,
	
	mapZoom : 12,
	maxZoom : 24,
	minZoom : 1,
	searchZoom : 18,
	
	
	mapserverURL : "http://192.168.1.211:9090/trinityMapserver/topp/wms",
	basemapLayer : "topp:tasmania_state_boundaries",
	
	layOutZoom : 6,
	
	layOutExtent1 : 102.26838275131274,
	layOutExtent2 : 35.65267138551892,
	layOutExtent3 : 52.692310036287,
	layOutExtent4 : 9.187117663991602,
	
	offline : false,
	projection : "EPSG:4326",
	mapProjection : "EPSG:3857",
	wmsVersion : "1.1.0",


	
	
	url : "http://192.168.1.211:6060/dahod_geoserver_2_17_2/wfs",
	gwc : false,
	wfslayerurl : "http://192.168.1.211:6060/dahod_geoserver_2_17_2/wfs",
	mapDataService : "google",
	bToken:'null',

	hereMapsAppID: "tTyWoZedGCPml5Ny77kG",
	hereMapsAppCode: "Do8Db_PQvH7MkKQM-7kHYQ",
	tiled3DBaseMap : '480700',
	
	esrireverseGeocode : "https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/reverseGeocode",
	esriGeocode: "https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/findAddressCandidates",
	esriPlaceSearch:"https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/suggest?searchExtent=",
	esriRoutingToken:"https://10.150.1.81/arcgis/tokens/generateToken?username=trinity&password=tringis",
	esriRouting:"https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Routing_Service/NAServer/Route/solve",
	esriClientId : "c3IdgLLqwxVtCu91",
	esriClientSecret : "3b6fa497594440dda121bf97182f95a4",
	GlobaloffLineMap:'\\192.168.1.165\webapps\trinityAPI\v3.3\Cesium-1.83\Build\Cesium\Assets\Textures\NaturalEarthII',
	
	poi_img_url : "http://192.168.1.165:8989/trinityAPI/v2.12/poi",	
	gwcurl : "https://caicoc.trinityiot.in/demomaps/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws",//http://demomaps.sgligis.com/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws,http://192.168.1.211:9090/trinityMapserver/topp/wms
	wmsurl : "https://caicoc.trinityiot.in/demomaps/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws",//http://demomaps.sgligis.com/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws,http://192.168.1.211:9090/trinityMapserver/topp/wms
	streetLayer : "osm",//topp:tasmania_state_boundaries
	url : "http://192.168.1.211:9090/trinityMapserver/topp/wms",

	layer :"osm",//topp:tasmania_state_boundaries
	gwc : true,
	googleSatelliteView : true,

	setResolution : false,
	vehicleTrackZoom : 15,

 	trinitySatelliteView : false, 
 	trinitySatelliteurl : "http://34.198.189.139:8082/geoserver/wms/",//"
	trinitySatelliteLayer : "landuse:LU.Landuse",
 	trinitySatellitegwc : false,
	drawRestrictionURL : 'http://192.168.1.165:8989/bangalore/landmark_search/withInBoundary/',
	
	//Cesium Map configuration
	CesiumdefaultAccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NDRmMDAwOC05NmU2LTRkOTUtOTIxOS1kMTU1YTc4OTk2MDYiLCJpZCI6MzU4OTYsImlhdCI6MTYwMjY3NjIwMX0.Sst9Ej3DHa3Kxi4PEfw0gVwxn9jgJ9PQ_ncM312Nrjw',
	esri_url :'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
	bingMapsGeocoderServiceToken : "Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR", // 
	mapboxGeocoderUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
	mapboxAccessToken: "pk.eyJ1IjoicHJhc2hhbnRoMTIzIiwiYSI6ImNqeWZyc3FlNDAwZDYzbmxnOTBwbnJwaHcifQ.ihiywno_BsEZqkyEdoo9OA",
	bingMapsRoutingURL:"http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=",
	connection:
	{
		url:"http://192.168.1.211:8070/EGISAPIService/apis",
		project : "trinityGIS",
		gisProject:"trinityICCC/getAsset"
	},
	bgImage:'iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABODcYhAAEl463hAAAAAElFTkSuQmCC',
	
	
	
	
	
	// SGL Map Configuration
	sglMapRequired : true,
	sgl_url :'https://caicoc.trinityiot.in/demomaps/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws',//http://demomaps.sgligis.com/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws
	sglBaseMapLayer : 'osm',
	sglLayers : [
		 { "name": "boundary_district", "layer":"boundary_district" }
		,{ "name": "road_centerline", "layer":"road_centerline" }
		,{ "name": "landmark_school", "layer":"landmark_school" }
		,{ "name": "landmark_police_station", "layer":"landmark_police_station" }
		,{ "name": "landmark_hospital", "layer":"landmark_hospital" }
		,{ "name": "landmark_fire_station", "layer":"landmark_fire_station" }
		,{ "name": "landmark_atm", "layer":"landmark_atm" }
		,{ "name": "osm", "layer":"osm" }
		,{ "name": "landmark_atm", "layer":"landmark_atm" }
		,{ "name": "google_hybrid", "layer":"google_hybrid" }
		// ,{ "name": "Building Footprint", "layer":"building_footprint" }
		// ,{ "name": "Landmark", "layer":"landmark" }
	],



}
	
//var gscript = document.createElement("script");
//gscript.type = "text/javascript";
// gscript.src = "https://maps.googleapis.com/maps/api/js?key="+appConfigInfo.googleMapKey+"&libraries=places,drawing";
// document.getElementsByTagName("head")[0].appendChild(gscript);


var trinityGIS3D_CSS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/Widgets/widgets.css"
];

var trinityGIS_CSS_scriptsToLoad = [
	appConfigInfo.mapSDKURL+"ol7/ol.css",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.css",
	appConfigInfo.mapSDKURL+"trinity_leaflet.css",
	appConfigInfo.mapSDKURL+"c3-master/c3.css",
	
	appConfigInfo.mapSDKURL+"trinity.css", 
	appConfigInfo.mapSDKURL+"map.css",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.fullscreen.css",
    appConfigInfo.mapSDKURL+"external/contextmenu.min.css",
]; 

var trinityGIS3D_JS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/Cesium.js"
]; 

var trinityGIS_JS_scriptsToLoad = [

	
	appConfigInfo.mapSDKURL+"ol7/ol.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet-provider.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.min.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.js",
	appConfigInfo.mapSDKURL+"external/html2canvas.min.js",
	appConfigInfo.mapSDKURL+"external/jspdf.umd.min.js",
	appConfigInfo.mapSDKURL+"external/jquery_v3_6_4.min.js",
	appConfigInfo.mapSDKURL+"external/turf.min.js",
	appConfigInfo.mapSDKURL+"trinity.ol_gis.js",
	appConfigInfo.mapSDKURL+"c3-master/c3.js",
	appConfigInfo.mapSDKURL+"d3.v5.min.js",
	appConfigInfo.mapSDKURL+"external/contextmenu.js",
	appConfigInfo.mapSDKURL+"trinityapi.Map.js",
	appConfigInfo.mapSDKURL+"trinityapi.Layer.js",
	appConfigInfo.mapSDKURL+"trinityapi.Overlay.js",
	appConfigInfo.mapSDKURL+"trinityapi.Track.js",
	appConfigInfo.mapSDKURL+"trinityapi.Search.js",
	appConfigInfo.mapSDKURL+"trinityapi.Geocode.js",
	appConfigInfo.mapSDKURL+"trinityapi.Zoom.js",
	appConfigInfo.mapSDKURL+"trinityapi.Measure.js",
	appConfigInfo.mapSDKURL+"trinityapi.Control.js",
	appConfigInfo.mapSDKURL+"trinityapi.Draw.js",
	appConfigInfo.mapSDKURL+"trinityapi.HeatMap.js",
	appConfigInfo.mapSDKURL+"trinityapi.Feature.js",
	appConfigInfo.mapSDKURL+"trinityapi.ContextMenu.js",
	appConfigInfo.mapSDKURL+"trinityapi.Route.js",
	appConfigInfo.mapSDKURL+"trinityapi.Utils.js",

]; 



trinityGIS_CSS_scriptsToLoad.forEach(function(src) {
  var script2 = document.createElement('link');
  script2.href = src;
  script2.setAttribute( 'rel', 'stylesheet' );
  script2.setAttribute( 'type', 'text/css' );
  script2.async = false;
  document.head.appendChild(script2);
});



    
trinityGIS_JS_scriptsToLoad.forEach(function(src) {
  var script4 = document.createElement('script');
  script4.src = src;
  script4.async = false;
  document.head.appendChild(script4);
});

trinityGIS3D_JS_scriptsToLoad.forEach(function(src) {
  var script5 = document.createElement('script');
  script5.src = src;
  script5.async = false;
  document.head.appendChild(script5);
});

// fetch(appConfigInfo.mapSDKURL+'error.json')
//   .then(response => response.json())
//   .then(data => {
//     // Store the JSON data in local storage
//     localStorage.setItem('errorGIS', JSON.stringify(data));
// 	console.info('loaded The JSON data');
//   })
//   .catch(error => {
//     console.error('Error loading JSON data:', error);
//   });