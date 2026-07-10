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

var envSettings = {

	mandatoryKeysToSet : "gKey,apiManURL,apiManVersion,apimanUser,apimanPass,apiManKey",

	apiManURL : "http://tiotapi.tsf.com/",
	apiManVersion : "1.0.0",
	apimanUser : "admin",

	mapDimension : "2D",
	
	//google,trinity,mmi,sgl
	mapData : "google",

	mapLib : "ol7",	

	//mmi,google
	type : 'google',
	mode : 'normal',

	//Bengulur
	lon : 77.55920772309938,
	lat : 12.971503096377115,  

	//Lucknow
	// lon : 80.93884402969394,
	// lat : 26.850601673068848,

	// //KarimNagar
	// lon : 79.12705422101101,
	// lat : 18.43773636846085,

	
	//MPEH
	// lon : 73.36600586505598,
	// lat : 18.79648275658313, 


	//guahati
	// lon : 91.7086,
	// lat : 26.1158,
	

	height : 1800,

	//Bengulur
	extent1 : 77.90413085440112,
	extent2 : 13.274783850212515,  
	extent3 : 77.22709836547018,
	extent4 : 12.691338021712754,

	//MPEH
	// extent1 : 73.77308590121666,
	// extent2 : 18.517790292333963,  
	// extent3 : 72.9752037996571,
	// extent4 : 19.25451998583285,

	

	//Lucknow
	// extent1 : 80.70779800415038,
	// extent2 : 26.952218167823446,  
	// extent3 : 81.16029739379883,
	// extent4 : 26.763851132264463,

	//KarimNagar
	// extent1 : 79.02165412902832,
	// extent2 : 18.35452552912666,  
	// extent3 : 79.25322532653807,
	// extent4 : 18.47016582050668,

	// Guwahati
	// extent1 : 91.57746124267578,
	// extent2 : 26.058591163816914,  
	// extent3 : 91.82808685302734,
	// extent4 : 26.166489222459177,


	mapZoom : 12,
	maxZoom : 24,
	minZoom : 1,
	searchZoom : 18,
	layOutZoom : 6,
	
	layOutExtent1 : 102.26838275131274,
	layOutExtent2 : 35.65267138551892,
	layOutExtent3 : 52.692310036287,
	layOutExtent4 : 9.187117663991602
		

}

function getKeyFromEnvSettings(keyName) {
	if (envSettings[keyName] === undefined) {
	  console.error(`Error: ${keyName} is not set`);
	}
	return envSettings[keyName];
  }

  function getKeyFromEnvSettingsWithDefault(keyName, defaultValue) {

	if (envSettings[keyName] !== undefined) {
	  return envSettings[keyName];
	}
  
	if (defaultValue !== undefined) {
	  console.warn(`${keyName} is not set; using default value: ${defaultValue}`);
	  return defaultValue;
	} else {
	  console.error(`Error: ${keyName} is not set`);
	  return undefined; // Or throw an error if you prefer
	}
  }
var isValidData = true;



if(isValidData){


/* The code is defining an object called `appConfigInfo` which contains various configuration settings
for the application. */

var appConfigInfo = {

	mapSDKURL: window.location.protocol+'//'+window.location.hostname+"/GISClientServices/v4.0.0/",
	mapSDK3DURL: window.location.protocol+'//'+window.location.hostname+"/GISClientServices/v4.0.0/cesium/",


	get apiManURL(){
		return getKeyFromEnvSettingsWithDefault('apiManURL','http://tiotapi.tsf.com/');
	},


	get apiManVersion(){
		return getKeyFromEnvSettingsWithDefault('apiManVersion','1.0.0');
	},


	get apiManKey(){
		return getKeyFromEnvSettings('apiManKey');
	},


	get apimanUser(){
		return getKeyFromEnvSettingsWithDefault('apimanUser','admin');
	},


	get apimanPass() {
		return getKeyFromEnvSettings('apimanPass');
	},


	get apiManGetAccessToken(){
		return getKeyFromEnvSettingsWithDefault('apiManURL','http://tiotapi.tsf.com/')+"tiotAPIESBSubSystem/1.0.0/getAccessToken"
	},


	get apiManUsername(){
		return getKeyFromEnvSettingsWithDefault('apimanUser','admin');
	},


	get apiManPassword(){
		return getKeyFromEnvSettings('apimanPass');
	},


	get apiManAuthorizationKey(){
		return getKeyFromEnvSettings('apiManKey');
	},


	get apiManUrlForGecode(){
		return getKeyFromEnvSettingsWithDefault('apiManURL','http://tiotapi.tsf.com/"')+"t/tsf.com/tiotGIS/1.0.0"
	},


	get gKey() {
		return getKeyFromEnvSettings('gKey');
	},


	get googleMapKey() {
		return getKeyFromEnvSettings('gKey');
	},



	get mapDimension() {
		return getKeyFromEnvSettingsWithDefault('mapDimension','2D');
	},


	get mapData() {
		return getKeyFromEnvSettingsWithDefault('mapData','google');
	},


	get mapLib(){
		return getKeyFromEnvSettingsWithDefault('mapLib','ol7');
	},


	get type(){
		return getKeyFromEnvSettingsWithDefault('type','google');
	},


	get mode(){
		return getKeyFromEnvSettingsWithDefault('mode','normal');
	},

    //Map configuration 


	get lon() {
		return getKeyFromEnvSettingsWithDefault('lon',77.55920772309938);
	},


	get lat() {
		return getKeyFromEnvSettingsWithDefault('lat',12.971503096377115);
	},


	get height() {
		return getKeyFromEnvSettingsWithDefault('height',1800);
	},
	

	get extent1() {
		return getKeyFromEnvSettingsWithDefault('extent1',102.26838275131274);

	},


	get extent2() {
		return getKeyFromEnvSettingsWithDefault('extent2',35.65267138551892);
	},


	get extent3() {
		return getKeyFromEnvSettingsWithDefault('extent3',52.692310036287);
	},


	get extent4() {
		return getKeyFromEnvSettingsWithDefault('extent4',9.187117663991602);
	},


	get mapZoom() {
		return getKeyFromEnvSettingsWithDefault('mapZoom', 12);
	},


	get maxZoom() {
		return getKeyFromEnvSettingsWithDefault('maxZoom', 24);
	},


	get minZoom() {
		return getKeyFromEnvSettingsWithDefault('minZoom', 1);
	},


	get searchZoom() {
		return getKeyFromEnvSettingsWithDefault('searchZoom', 18);
	},
	


	get layOutZoom(){
		return getKeyFromEnvSettingsWithDefault('layOutZoom', 6);
	},




	get layOutExtent1(){
		return getKeyFromEnvSettingsWithDefault('layOutExtent1', 102.26838275131274);
	},



	get layOutExtent2(){
		return getKeyFromEnvSettingsWithDefault('layOutExtent2', 35.65267138551892);
	},




	get layOutExtent3(){
		return getKeyFromEnvSettingsWithDefault('layOutExtent3', 52.692310036287);
	},



	get layOutExtent4(){
		return getKeyFromEnvSettingsWithDefault('layOutExtent4', 9.187117663991602);
	},
	
    mapserverURL : "",
	basemapLayer : "",
	
	baseUrl:"",
	
	offline : false,
	projection : "EPSG:4326",
	mapProjection : "EPSG:3857",
	wmsVersion : "1.1.0",
	
	url : "",
	gwc : false,
	wfslayerurl : "",
	mapDataService : "google",

	hereMapsAppID: "",
	hereMapsAppCode: "",
	tiled3DBaseMap : '',
	
	esrireverseGeocode : "",
	esriGeocode: "",
	esriPlaceSearch:"",
	esriRouting:"",
	esriClientId : "",
	GlobaloffLineMap:'',
	
	poi_img_url : "",	
	vehicleTrackZoom : 15,

 	trinitySatelliteView : false, 
 	trinitySatelliteurl : "",//"
	trinitySatelliteLayer : "landuse:LU.Landuse",
 	trinitySatellitegwc : false,
	drawRestrictionURL : "",
	
	//Cesium Map configuration
	esri_url :"",
	mapboxGeocoderUrl: "",
	bingMapsRoutingURL:"",
	
	connection:
	{	
		baseUrl:"",
		url:"",
		project : "",
		gisProject:""
	},
	bgImage:'',


}

var appConfigContent = {
    mapserverURL : "http://tiotapi.tsf.com/trinityMapserver/topp/wms",
	basemapLayer : "topp:tasmania_state_boundaries",
	
	baseUrl:"https://tiotgis.tsf.com/EGISAPIService/apis/",
	
	offline : false,
	projection : "EPSG:4326",
	mapProjection : "EPSG:3857",
	wmsVersion : "1.1.0",
	
	url : "http://tiotapi.tsf.com/dahod_geoserver_2_17_2/wfs",
	gwc : false,
	wfslayerurl : "http://tiotapi.tsf.com/dahod_geoserver_2_17_2/wfs",
	mapDataService : "google",

	hereMapsAppID: "tTyWoZedGCPml5Ny77kG",
	hereMapsAppCode: "Do8Db_PQvH7MkKQM-7kHYQ",
	tiled3DBaseMap : '480700',
	
	esrireverseGeocode : "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/reverseGeocode",
	esriGeocode: "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/findAddressCandidates",
	esriPlaceSearch:"https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/suggest?searchExtent=",
	esriRouting:"https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Routing_Service/NAServer/Route/solve",
	esriClientId : "c3IdgLLqwxVtCu91",
	GlobaloffLineMap:'\\tiotapi.tsf.com\webapps\trinityAPI\v3.3\Cesium-1.83\Build\Cesium\Assets\Textures\NaturalEarthII',
	
	poi_img_url : "http://tiotapi.tsf.com:8989/trinityAPI/v2.12/poi",	
	vehicleTrackZoom : 15,

 	trinitySatelliteView : false, 
 	trinitySatelliteurl : "http://tiotapi.tsf.com:8082/geoserver/wms/",//"
	trinitySatelliteLayer : "landuse:LU.Landuse",
 	trinitySatellitegwc : false,
	drawRestrictionURL : 'http://tiotapi.tsf.com:8989/bangalore/landmark_search/withInBoundary/',
	
	//Cesium Map configuration
	esri_url :'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
	mapboxGeocoderUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
	bingMapsRoutingURL:"http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=",
	
	connection:
	{	
		baseUrl:"https://tiotgis.tsf.com/EGISAPIService/apis/",
		url:"http://tiotapi.tsf.com:8070/EGISAPIService/apis",
		project : "trinityGIS",
		gisProject:"trinityICCC/getAsset"
	},
	bgImage:'iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABODcYhAAEl463hAAAAAElFTkSuQmCC',

}

appConfigInfo.mapserverURL = appConfigContent.mapserverURL;
appConfigInfo.basemapLayer = appConfigContent.basemapLayer;
appConfigInfo.baseUrl = appConfigContent.baseUrl;
appConfigInfo.url = appConfigContent.url;


appConfigInfo.wfslayerurl = appConfigContent.wfslayerurl,
appConfigInfo.mapDataService = appConfigContent.mapDataService,
appConfigInfo.hereMapsAppID = appConfigContent.hereMapsAppID,
appConfigInfo.hereMapsAppCode = appConfigContent.hereMapsAppCode,
appConfigInfo.tiled3DBaseMap = appConfigContent.tiled3DBaseMap,	
appConfigInfo.esrireverseGeocode = appConfigContent.esrireverseGeocode,
appConfigInfo.esriGeocode = appConfigContent.esriGeocode,
appConfigInfo.esriPlaceSearch = appConfigContent.esriPlaceSearch,
appConfigInfo.esriRouting = appConfigContent.esriRouting,
appConfigInfo.esriClientId = appConfigContent.esriClientId,
appConfigInfo.GlobaloffLineMap = appConfigContent.GlobaloffLineMap,	
appConfigInfo.poi_img_url = appConfigContent.poi_img_url,	
appConfigInfo.vehicleTrackZoom = appConfigContent.vehicleTrackZoom ,
appConfigInfo.trinitySatelliteView = appConfigContent.trinitySatelliteView, 
appConfigInfo.trinitySatelliteurl = appConfigContent.trinitySatelliteurl,
appConfigInfo.trinitySatelliteLayer = appConfigContent.trinitySatelliteLayer,
appConfigInfo.trinitySatellitegwc = appConfigContent.trinitySatellitegwc,
appConfigInfo.drawRestrictionURL = appConfigContent.drawRestrictionURL,
	
//Cesium Map configuration
appConfigInfo.esri_url = appConfigContent.esri_url,
appConfigInfo.mapboxGeocoderUrl = appConfigContent.mapboxGeocoderUrl,
appConfigInfo.bingMapsRoutingURL = appConfigContent.bingMapsRoutingURL,


appConfigInfo.connection = appConfigContent.connection,
appConfigInfo.bgImage = appConfigContent.bgImage


}

// var gscript = document.createElement("script");
// gscript.type = "text/javascript";
// gscript.src = "https=//maps.googleapis.com/maps/api/js?key="+appConfigInfo.googleMapKey+"&libraries=places,drawing";
// document.getElementsByTagName("head")[0].appendChild(gscript);


var trinityGIS3D_CSS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.112/Build/Cesium/Widgets/widgets.css"
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
	appConfigInfo.mapSDK3DURL+"Cesium-1.112/Build/Cesium/Cesium.js"
]; 

var trinityGIS_JS_scriptsToLoad = [

	
	appConfigInfo.mapSDKURL+"ol7/ol.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet-provider.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.min.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.js",
	appConfigInfo.mapSDKURL+"external/html2canvas.min.js",
	appConfigInfo.mapSDKURL+"external/jspdf.min.js",
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
	appConfigInfo.mapSDKURL+"jquery.min.js",
	appConfigInfo.mapSDKURL+"jquery-3.7.1.min.js",
	// appConfigInfo.mapSDKURL+"jspdf.min.js",
	// appConfigInfo.mapSDKURL+"html2canvas.js",
	appConfigInfo.mapSDKURL+"jspdf.plugin.autotable.min.js",
	appConfigInfo.mapSDKURL+"FileSaver.min.js",
	appConfigInfo.mapSDKURL+"easy-autocomplete.js",
	appConfigInfo.mapSDKURL+"moment.min.js",
]; 

trinityGIS3D_CSS_scriptsToLoad.forEach(function (src) {
	var script1 = document.createElement('link');
	script1.href = src;
	script1.setAttribute('rel', 'stylesheet');
	script1.setAttribute('type', 'text/css');
	script1.async = false;
	document.head.appendChild(script1);
});
// trinityGIS3D_JS_scriptsToLoad.forEach(function (src) {
// 	var script3 = document.createElement('script');
// 	script3.src = src;
// 	script3.async = false;
// 	document.head.appendChild(script3);
// });

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
