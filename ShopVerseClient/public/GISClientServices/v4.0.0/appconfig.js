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
tmpl.Info.getPlaceFlag = false;
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
 
 
Object.defineProperty(window, "envSettings", {
    get() {
        return appConfigInfo;
    }
});

var vaultApiResolve = null;
var vaultApiPromise = new Promise((resolve, reject) => {
    vaultApiResolve = resolve;
});
 
var appConfigInfo = {
 
    mapSDKURL: window.location.protocol + '//' + window.location.hostname + "/GISClientServices/v4.0.0/",
    mapSDK3DURL: window.location.protocol + '//' + window.location.hostname + "/GISClientServices/v4.0.0/cesium/",
 
}
 
 
var trinityGIS3D_CSS_scriptsToLoad = [
    appConfigInfo.mapSDK3DURL + "Cesium-1.126/Build/Cesium/Widgets/widgets.css"
];
 
 
var trinityGIS_CSS_scriptsToLoad = [
    appConfigInfo.mapSDKURL + "ol7/ol.css",
    appConfigInfo.mapSDKURL + "leaflet/leaflet.css",
    appConfigInfo.mapSDKURL + "trinity_leaflet.css",
    appConfigInfo.mapSDKURL + "c3-master/c3.css",
 
    appConfigInfo.mapSDKURL + "trinity.css",
    appConfigInfo.mapSDKURL + "map.css",
    appConfigInfo.mapSDKURL + "leaflet/leaflet.fullscreen.css",
    appConfigInfo.mapSDKURL + "external/contextmenu.min.css",
];
 
var trinityGIS3D_JS_scriptsToLoad = [
    appConfigInfo.mapSDK3DURL + "Cesium-1.126/Build/Cesium/Cesium.js"
];
 
var trinityGIS_JS_scriptsToLoad = [
 
    // appConfigInfo.mapSDKURL+"ol7/OLCesium.js",
    appConfigInfo.mapSDKURL + "external/crypto-js.min.js",
    appConfigInfo.mapSDKURL + "trinityapi.Utils.js",
    appConfigInfo.mapSDKURL + "ol7/ol.js",
    appConfigInfo.mapSDKURL + "leaflet/leaflet.js",
    appConfigInfo.mapSDKURL + "leaflet/leaflet-provider.js",
    appConfigInfo.mapSDKURL + "leaflet/Leaflet.fullscreen.min.js",
    appConfigInfo.mapSDKURL + "leaflet/Leaflet.fullscreen.js",
    appConfigInfo.mapSDKURL + "external/html2canvas.min.js",
    appConfigInfo.mapSDKURL + "external/turf.min.js",
    appConfigInfo.mapSDKURL + "trinity.ol_gis.js",
    appConfigInfo.mapSDKURL + "c3-master/c3.js",
    appConfigInfo.mapSDKURL + "d3.v5.min.js",
    appConfigInfo.mapSDKURL + "external/contextmenu.js",
    appConfigInfo.mapSDKURL + "trinityapi.Map.js",
    appConfigInfo.mapSDKURL + "trinityapi.Layer.js",
    appConfigInfo.mapSDKURL + "trinityapi.Overlay.js",
    appConfigInfo.mapSDKURL + "trinityapi.Track.js",
    appConfigInfo.mapSDKURL + "trinityapi.Search.js",
    appConfigInfo.mapSDKURL + "trinityapi.Geocode.js",
    appConfigInfo.mapSDKURL + "trinityapi.Zoom.js",
    appConfigInfo.mapSDKURL + "trinityapi.Measure.js",
    appConfigInfo.mapSDKURL + "trinityapi.Control.js",
    appConfigInfo.mapSDKURL + "trinityapi.Draw.js",
    appConfigInfo.mapSDKURL + "trinityapi.HeatMap.js",
    appConfigInfo.mapSDKURL + "trinityapi.Feature.js",
    appConfigInfo.mapSDKURL + "trinityapi.ContextMenu.js",
    appConfigInfo.mapSDKURL + "trinityapi.Route.js",
    appConfigInfo.mapSDKURL + "trinityapi.Utils.js",
    appConfigInfo.mapSDKURL + "trinityapi.Windy.js",
    appConfigInfo.mapSDKURL + "trinityapi.UtilityNetwork.js",
    appConfigInfo.mapSDKURL + "windyjs.js",
    appConfigInfo.mapSDKURL + "trinityapi.Mobility.js",
    appConfigInfo.mapSDKURL + "jquery-3.7.1.min.js",
    appConfigInfo.mapSDKURL + "external/jspdf.min.js",
    appConfigInfo.mapSDKURL + "jspdf.plugin.autotable.min.js",
    appConfigInfo.mapSDKURL + "FileSaver.min.js",
    appConfigInfo.mapSDKURL + "easy-autocomplete.js",
    appConfigInfo.mapSDKURL + "moment.min.js",
];
 
 
 
trinityGIS3D_CSS_scriptsToLoad.forEach(function (src) {
    var script1 = document.createElement('link');
    script1.href = src;
    script1.setAttribute('rel', 'stylesheet');
    script1.setAttribute('type', 'text/css');
    script1.async = false;
    document.head.appendChild(script1);
});
 
 
 
trinityGIS_CSS_scriptsToLoad.forEach(function (src) {
    var script2 = document.createElement('link');
    script2.href = src;
    script2.setAttribute('rel', 'stylesheet');
    script2.setAttribute('type', 'text/css');
    script2.async = false;
    document.head.appendChild(script2);
});
 
 
 
 
// trinityGIS_JS_scriptsToLoad.forEach(function (src) {
//  var script4 = document.createElement('script');
//  script4.src = src;
//  script4.async = false;
//  document.head.appendChild(script4);
// });
 
trinityGIS3D_JS_scriptsToLoad.forEach(function (src) {
    var script5 = document.createElement('script');
    script5.src = src;
    script5.async = false;
    document.head.appendChild(script5);
});
 
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
        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
        "Referer": "",
        "If-None-Match": "W/\"111208-1711435294000\"",
        "If-Modified-Since": "Tue, 26 Mar 2024 06:41:34 GMT",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": "\"Windows\"",
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
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
                    appConfigInfo = processedConfig;
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
 