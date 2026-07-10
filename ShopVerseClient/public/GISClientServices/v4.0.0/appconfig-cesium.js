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
	
	googleMapKey : "AIzaSyA7z_IJBC_8QTKN7HlO2ZmSZX-RKNIVUh8",
	
	mapSDKURL: "./../v4.0.0/",
	mapSDK3DURL: "./../v4.0.0/cesium/",

	mapDimension : "3D",
	mapData : "google",
	mapLib : "ol7",
	type : 'esri',
	mode : 'normal',

    //Map configuration 
	lon : 78.63179066331014,
	lat : 21.82463756688452,  
	height : 1800,
	
	extent1 : 102.26838275131274,
	extent2 : 35.65267138551892, 
	extent3 : 52.692310036287,
	extent4 : 9.187117663991602,
	
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

	apiManGetAccessToken : "http://tiotapi.tsf.com/tiotAPIESBSubSystem/1.0.0/getAccessToken",
	apiManUsername : "trinitygis@tsf.com",
	apiManPassword : "trinity@123",
	apiManAuthorizationKey : "ODdHV0tlZ0VoTUFwbWFCdDgwSHVhdjNtMWcwYTpoZHh1QlNDSDgyYnByR2xvSHRQN0dqMkxmNjRh",
	apiManUrlForGecode : "http://tiotapi.tsf.com/t/tsf.com/tiotGIS/1.0.0",
	gKey : "AIzaSyA7z_IJBC_8QTKN7HlO2ZmSZX-RKNIVUh8",


	
	
	
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
	gwcurl : "http://192.168.1.211:9090/trinityMapserver/topp/wms",
	wmsurl : "http://192.168.1.211:9090/trinityMapserver/topp/wms",
	streetLayer : "topp:tasmania_state_boundaries",
	url : "http://192.168.1.211:9090/trinityMapserver/topp/wms",
	layer :"topp:tasmania_state_boundaries",
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
	CesiumdefaultAccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NWUxNmQ3OC1kYzEzLTRjNDgtOGNiOC01MDNjNjQ5N2Q4ZjIiLCJpZCI6MTc5NzM3LCJpYXQiOjE3MDA1NTk2OTF9.8k1c4snc_fONpEzwTJ2rA4tBkzRl5ETrJu5VX2clZaU',
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
	bgImage:'iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABODcYhAAEl463hAAAAAElFTkSuQmCC'
}
	
//var gscript = document.createElement("script");
//gscript.type = "text/javascript";
// gscript.src = "https://maps.googleapis.com/maps/api/js?key="+appConfigInfo.googleMapKey+"&libraries=places,drawing";
// document.getElementsByTagName("head")[0].appendChild(gscript);

var trinityGIS3D_CSS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.112/Build/Cesium/Widgets/widgets.css"
	// "https://cesium.com/downloads/cesiumjs/releases/1.112/Build/Cesium/Widgets/widgets.css"
];

var trinityGIS_CSS_scriptsToLoad = [
	appConfigInfo.mapSDKURL+"ol7/ol.css",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.css",
	appConfigInfo.mapSDKURL+"trinity_leaflet.css",
	appConfigInfo.mapSDKURL+"c3-master/c3.css",
	
	appConfigInfo.mapSDKURL+"trinity.css", 
	appConfigInfo.mapSDKURL+"map.css",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.fullscreen.css",
]; 

var trinityGIS3D_JS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.112/Build/Cesium/Cesium.js"
	// "https://cesium.com/downloads/cesiumjs/releases/1.112/Build/Cesium/Cesium.js"
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
	appConfigInfo.mapSDKURL+"trinityapi.Route.js"
]; 

trinityGIS3D_CSS_scriptsToLoad.forEach(function (src) {
	var script1 = document.createElement('link');
	script1.href = src;
	script1.setAttribute('rel', 'stylesheet');
	script1.setAttribute('type', 'text/css');
	script1.async = false;
	document.head.appendChild(script1);
});
trinityGIS3D_JS_scriptsToLoad.forEach(function (src) {
	var script3 = document.createElement('script');
	script3.src = src;
	script3.async = false;
	document.head.appendChild(script3);
});


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

fetch(appConfigInfo.mapSDKURL+'error.json')
  .then(response => response.json())
  .then(data => {
    // Store the JSON data in local storage
    localStorage.setItem('errorGIS', JSON.stringify(data));
	console.info('loaded The JSON data');
  })
  .catch(error => {
    console.error('Error loading JSON data:', error);
  });