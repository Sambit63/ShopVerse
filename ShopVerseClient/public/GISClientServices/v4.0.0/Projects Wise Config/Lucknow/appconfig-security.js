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

	//google,trinity
	mapData : "mmi",

	mapLib : "ol7",

	//mmi,google
	type : 'google',
	mode : 'normal',

	lon : 73.36600586505598,
	lat : 18.79648275658313, 

	height : 1800,

	extent1 : 73.77308590121666,
	extent2 : 18.517790292333963,  
	extent3 : 72.9752037996571,
	extent4 : 19.25451998583285,

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

	// mapSDKURL: "C:/Trinity Files/Development/GIS/SVN/RnD_GIS_RV2.3.0_8639/GISClientServices/v4.0.0/",
	// mapSDK3DURL: "C:/Trinity Files/Development/GIS/SVN/RnD_GIS_RV2.3.0_8639/GISClientServices/v4.0.0/cesium/",

	

	// apiManURL : "http://tiotapi.tsf.com",


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
	// gwcurl : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
	// wmsurl : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
	// streetLayer : "topp:tasmania_state_boundaries",
	// url : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
	// layer :"topp:tasmania_state_boundaries",
	// gwc : true,
	// googleSatelliteView : true,

	// setResolution : false,
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

	//MMI Map Implimentation START
	mmi_clientid:"33OkryzDZsJ8279B1bylI1JeuAJj5b3xmJEpG7rs9y5Gx1edT05ySbVsiCAFP28ZYVl51mfT0pOxhNt9azh-hQ==",
	mmi_clientsecret:"lrFxI-iSEg9Q3T5uAkSHzFUpARYuv3SpltPMgzs_VlDgHlY-l65cCEK7kHgihHkpv1npN-9_MSmaQ_bq4CtzaKvx3dJIpGUo",
	mmi_tokenurl:" https://outpost.mappls.com/api/security/oauth/token",
	mmi_search:"https://atlas.mappls.com/api/places/search/json",
	mmi_geocode:"https://apis.mapmyindia.com/advancedmaps/v1/",
	mmi_nearbyplaces:"https://atlas.mapmyindia.com/api/places/nearby/",
	mmi_snaptoroad:"https://apis.mapmyindia.com/advancedmaps/v1/",
	mmi_eloc : "https://explore.mappls.com/apis/O2O/entity/",
	layer :"MPEH",
	marathilayer:"",
	gwc : true,
	gwcurl : "http://10.48.168.222:8092/mpeh_geoserver_2.22/mpeh/wms",
	wmsurl : "http://10.48.168.222:8092/mpeh_geoserver_2.22/mpeh/wms",
	url : "http://10.48.168.222:8092/mpeh_geoserver_2.22/mpeh/wms",
	streetLayer : "MPEH",
	googleSatelliteView : false,
	googlezoom : 12,
	googleMinZoom : 1,
	trinityMinZoom : 1,
	setResolution : true,
	googleprojection : "EPSG:3857",
	trinityzoom : 11,
	googleMaxZoom : 21,
	trinityMaxZoom : 21,
	appcode:"trinityGIS",
	ln : 'en',
	searchKey : 'description',


	//MMI Map Implimentation END


	//MMI Map Implimentation for Lucknow Start 
	mmi_clientid : "a2be0ed87a201392fdebf9b853ee3076",
    mmi_clientsecret : "0869f7d066637ac2619937947ea8bd88",
    mmi_tokenurl : "http://10.10.10.194/api/security/oauth/token?grant_type=client_credentials&client_id=",
    mmi_basemap_url : "http://10.10.10.193/getMap?service=WMS&request=GetWMSMap&version=1.1.1&layers=&format=image%2Fpng&transparent=true&datasetNme=",
    mmi_reversegeocode : "http://10.10.10.194/advancedmaps/v2/",
    mmi_nearbyplaces : "http://10.10.10.194/api/places/search/json?access_token=",
    mmiRoute : "http://10.10.10.194/advancedmaps/v1/",
    mmi_search : "http://10.10.10.194/api/places/search/json",
	baseUrl :'http://10.10.10.193/getMap',
	wmsUrl :'http://10.10.10.193/api/getMap',
	mmi_layers : [
		{ layers: 'a', styles: 'lko_police_boundary_category_based_label_1696005759056_workview',datasetNme:'lko_police_boundary', test: '0.5756302833565932' },
		{ layers: 'b', styles: 'lko_police_chowki_1705158106478',datasetNme:'lko_police_chowki', test: '0.5635334227880069', minZoom: 5  },
		{ layers: 'c', styles: 'lko_bldg_footprint_1705158954938',datasetNme:'lko_bldg_footprint', test: '0.5635334227880069', minZoom: 5  },
		{ layers: 'd', styles: 'lko_bridge_pol_1705158997573',datasetNme:'lko_bridge_pol', test: '0.07176665643749613', minZoom: 5  },
		{ layers: 'e', styles: 'lko_bus_sheltors_label_1705159063863',datasetNme:'lko_bus_sheltors', test: '0.01912254419860382', minZoom: 5  },
		{ layers: 'f', styles: 'lko_bus_terminals_1705159118264',datasetNme:'lko_bus_terminals', test: '0.7210539198359649', minZoom: 5  },
		{ layers: 'g', styles: 'lko_canal_1705158872634',datasetNme:'lko_canal', test: '0.9918186969957841' },
		{ layers: 'h', styles: 'lko_health_label_1705159300428',datasetNme:'lko_health',test: '0.0545336345765135', minZoom: 5 },
		{ layers: 'i', styles: 'lko_lakes_label_1705159333697',datasetNme:'lko_lakes', test: '0.862050792546329' },
		{ layers: 'j', styles: 'lko_streams_1705159810845',datasetNme:'lko_streams', test: '0.12402535067981302' },
		{ layers: 'h', styles: 'lko_parkgarden_1705159532980',datasetNme:'lko_parkgarden', test: '0.569063660184574' },
		{ layers: 'k', styles: 'lko_police_chowki_label_1705159578515',datasetNme:'lko_police_chowki', test: '0.9170828672802582', minZoom: 5  },
		{ layers: 'l', styles: 'lko_police_stn_1705159614159',datasetNme:'lko_police_stn', test: '0.02047926109989251' },
		{ layers: 'm', styles: 'lko_ponds_label_1705159649800',datasetNme:'lko_ponds', test: '0.39357144163431657' },
		{ layers: 'n', styles: 'lko_rd_poly_1705159683485',datasetNme:'lko_rd_poly', test: '0.6946428791472148', minZoom: 10 },
		{ layers: 'o', styles: 'lko_river_1705158004374',datasetNme:'lko_river', test: '0.9186517289957437' },
		{ layers: 'p', styles: 'lko_rly_line',datasetNme:'lko_rly_line', test: '0.010787289695188607', minZoom: 10  },
		{ layers: 'q', styles: 'lko_rly_stn_pt_label_1705159741550',datasetNme:'lko_rly_stn_pt', test: '0.9326853785500631', minZoom: 10 },
		{ layers: 'r', styles: 'lko_road_divider_1705159785367',datasetNme:'lko_road_divider', test: '0.9902634702285882', minZoom: 10  },
		{ layers: 's', styles: 'lko_ponds_label_1705159649800',datasetNme:'lko_ponds', test: '0.39357144163431657' }
		
	  ],
	//MMI Map Implimentation for Lucknow End


}

}



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
	appConfigInfo.mapSDKURL+"jquery.min.js",
	appConfigInfo.mapSDKURL+"easy-autocomplete.js"

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
