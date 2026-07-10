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
tmpl.Windy = {};
tmpl.Mobility = {};
tmpl.UtilityNetwork = {};

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

var vaultApiResolve = null;
var vaultApiPromise = new Promise((resolve, reject) => {
    vaultApiResolve = resolve;
});


var global2DMap;
var global3DMap;

var envSettings = {

	mandatoryKeysToSet : "gKey,apiManURL,apiManVersion,apimanUser,apimanPass,apiManKey",

	// apiManURL : " ",
	// apiManVersion : " ",
	// apimanUser : " ",
	// apimanPass : " ",
	// apiManKey : " ",
	gKey : "",

	mapDimension : " ",
	
	//google,trinity,mmi,sgl
	mapData : " ",

	mapLib : " ",	

	//mmi,google
	type : ' ',
	mode : ' ',

	//Bengulur
	lon : 77.55920772309938,
	lat : 12.971503096377115,  


	height : 1800,

	//Bengulur
	extent1 : 77.90413085440112,
	extent2 : 13.274783850212515,  
	extent3 : 77.22709836547018,
	extent4 : 12.691338021712754,

	
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


	get apiManGetAccessToken(){
		return getKeyFromEnvSettingsWithDefault('apiManURL','')+"tiotAPIESBSubSystem/1.0.0/getAccessToken"
	},


	get apiManUrlForGecode(){
		return getKeyFromEnvSettingsWithDefault('apiManURL','')+"t/tsf.com/tiotGIS/1.0.0"
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

	get CesiumdefaultAccessToken(){
		return getKeyFromEnvSettings('CesiumdefaultAccessToken')
	},

	
	get setResolution() {
		return getKeyFromEnvSettingsWithDefault('setResolution', true);
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
	setResolution : true,

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




}


var trinityGIS3D_CSS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.126/Build/Cesium/Widgets/widgets.css"
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
	appConfigInfo.mapSDK3DURL+"Cesium-1.126/Build/Cesium/Cesium.js"
]; 

var trinityGIS_JS_scriptsToLoad = [
	appConfigInfo.mapSDKURL+"trinityapi.Utils.js",
	appConfigInfo.mapSDKURL + "external/crypto-js.min.js",
	appConfigInfo.mapSDKURL+"ol7/ol.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet.js",
	appConfigInfo.mapSDKURL+"leaflet/leaflet-provider.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.min.js",
	appConfigInfo.mapSDKURL+"leaflet/Leaflet.fullscreen.js",
	appConfigInfo.mapSDKURL+"external/html2canvas.min.js",
	appConfigInfo.mapSDKURL+"external/jspdf.umd.min.js",
	appConfigInfo.mapSDKURL+"external/jquery-3.7.1.min.js",
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
	appConfigInfo.mapSDKURL+"trinityapi.Windy.js",
	appConfigInfo.mapSDKURL+"trinityapi.Mobility.js",
	appConfigInfo.mapSDKURL + "trinityapi.UtilityNetwork.js",
	// appConfigInfo.mapSDKURL+"trinityapi.Utils.js",
	appConfigInfo.mapSDKURL+"jquery-3.7.1.min.js",
	// appConfigInfo.mapSDKURL+"jspdf.plugin.autotable.min.js",
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


trinityGIS_CSS_scriptsToLoad.forEach(function(src) {
  var script2 = document.createElement('link');
  script2.href = src;
  script2.setAttribute( 'rel', 'stylesheet' );
  script2.setAttribute( 'type', 'text/css' );
  script2.async = false;
  document.head.appendChild(script2);
});
    
// trinityGIS_JS_scriptsToLoad.forEach(function(src) {
//   var script4 = document.createElement('script');
//   script4.src = src;
//   script4.async = false;
//   document.head.appendChild(script4);
// });

trinityGIS3D_JS_scriptsToLoad.forEach(function(src) {
  var script5 = document.createElement('script');
  script5.src = src;
  script5.async = false;
  document.head.appendChild(script5);
});

function updateAppConfig(config) {
    Object.keys(config).forEach(key => {
        let value = config[key];

        if (appConfigInfo.hasOwnProperty(key)) {
            let descriptor = Object.getOwnPropertyDescriptor(appConfigInfo, key);

            if (descriptor && typeof descriptor.get === "function") {
                if (appConfigInfo[key] === undefined) {
                    Object.defineProperty(appConfigInfo, key, {
                        get: () => value,
                        configurable: true,
                        enumerable: true
                    });
                }
            } else {
                appConfigInfo[key] = value;
            }
        } else {
            appConfigInfo[key] = value;
        }
    });
}

function processConfig(config) {
	const placeholder = "{{window.location}}";
	const replacement = window.location.origin;
	const processedConfig = {};

	Object.keys(config).forEach(key => {
		if (typeof config[key] === 'string') {
			// Only call replace if the property is a string
			processedConfig[key] = config[key].replace(placeholder, replacement);
		} else {
			// If not a string, copy the value as it is
			processedConfig[key] = config[key];
		}
	});
	return processedConfig;
}


var vaultReadingURL = window.location.origin + "/EGISAPIService/apis/readSDKVault"

var settings = {
	"url": vaultReadingURL,
	"method": "GET",
	"timeout": 0,
	"headers": {
		"accept": "application/json, text/plain, */*",
		"content-type": "application/json",
	},
};


function loadScripts(scripts, callback) {
    let loadedScripts = 0;
    let totalScripts = scripts.length;
 
    scripts.forEach((src) => {
        let script = document.createElement("script");
        script.src = src;
        script.async = false;
 
        script.onload = function () {
            loadedScripts++;
            // console.log(`Loaded: ${src} (${loadedScripts}/${totalScripts})`);
 
            // Check if all scripts are loaded
            if (loadedScripts === totalScripts) {
                console.log("All scripts loaded successfully!");
                if (callback) {
                    callback();
                }
            }
        };
 
        script.onerror = function () {
            console.error(`Error loading: ${src}`);
        };
 
        document.head.appendChild(script);
    });
}

// Function to execute after all scripts are loaded
function allScriptsLoaded() {
    console.log("Loaded:  Executing function after all scripts are loaded...");
    setTimeout(() => {
        try {
            $.ajax(settings).done(function (response) {
     
                if (response && response.status == true) {
                    let param = {
                        value : response.data,
                        type : 'normalize',
                        valueType: 'stringObject'
                    }
                    response.data = tmpl.Utils.normalizing(param)
                    var sdkVaultDetails = response.data;
                    const processedConfig = processConfig(sdkVaultDetails);
                    // appConfigInfo = processedConfig;
					updateAppConfig(processedConfig)
					vaultApiResolve();
                    // console.log("Loaded: :::::::::: SDK  processedConfig New :::::::::::: ",processedConfig);
                }
            });
     
        } catch (error) {
            console.error(" :::: Error :::  ", error);
        }
    }, 500);
}
 
// Load all scripts and execute callback when done
loadScripts(trinityGIS_JS_scriptsToLoad, allScriptsLoaded);



