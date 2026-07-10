// By defining config information as json object we can avoid these 20 global variables and more changes in the API code are not required while using this json object.
window.tmpl = {};
var appConfigInfo = {
	googleMapKey : "AIzaSyB2TwPI4OFQ7fFcyGHzyCvx0fZDr6B3DAo",
	mapSDKURL: "http://192.168.1.165:8989/trinityAPI/v4.0.0/",
	mapSDK3DURL:"http://192.168.1.165:8989/trinityAPI/v4.0.0/cesium/",

	mapDimension : "2D",
	mapData : "google",
	mapLib : "ol7",
	type : 'google',
	mode : 'normal',

    //Map configuration 
	lon : 78.03223666287593,
	lat : 30.320364605395113, 
	height : 1800,
	extent1 : 78.01039695739746,  //[78.01039695739746, 30.30858547400696, 78.07631492614748, 30.33503536974979]
	extent2 : 30.30858547400696, 
	extent3 : 78.07631492614748, 
	extent4 : 30.33503536974979,
	
	// extent1 : 77.96164512634277,  //[78.01039695739746, 30.30858547400696, 78.07631492614748, 30.33503536974979]
	// extent2 : 30.265976506381506, 
	// extent3 : 78.13862800598143, 
	// extent4 : 30.37177923258146,
	
	mapserverURL : "http://192.168.1.211:9090/trinityMapserver/topp/wms",
	basemapLayer : "topp:tasmania_state_boundaries",
	leafzoom : 6,
	bound1lon : 143.83482400000003,
	bound1lat : -43.648056,
	bound2lon : 148.47914100000003,
	bound2lat : -39.573891,
	googlezoom : 12,
	offline : false,
	projection : "EPSG:4326",
	googleprojection : "EPSG:3857",
	wmsVersion : "1.1.0",
	
	trinityzoom : 12,
	googleMaxZoom : 21,
	trinityMaxZoom : 21,
	
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
	googleMinZoom : 3,
	trinityMinZoom : 1,
	setResolution : false,
	vehicleTrackZoom : 15,

 	trinitySatelliteView : false, 
 	trinitySatelliteurl : "http://34.198.189.139:8082/geoserver/wms/",//"
	trinitySatelliteLayer : "landuse:LU.Landuse",
 	trinitySatellitegwc : false,
	drawRestrictionURL : 'http://192.168.1.165:8989/bangalore/landmark_search/withInBoundary/',
	
	//Cesium Map configuration
	CesiumdefaultAccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NDRmMDAwOC05NmU2LTRkOTUtOTIxOS1kMTU1YTc4OTk2MDYiLCJpZCI6MzU4OTYsImlhdCI6MTYwMjY3NjIwMX0.Sst9Ej3DHa3Kxi4PEfw0gVwxn9jgJ9PQ_ncM312Nrjw',//
	//esri_url :'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',//
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
	
var gscript = document.createElement("script");
gscript.type = "text/javascript";

gscript.src = "https://maps.googleapis.com/maps/api/js?key="+appConfigInfo.googleMapKey+"&libraries=places,drawing";
document.getElementsByTagName("head")[0].appendChild(gscript);

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
	appConfigInfo.mapSDKURL+"external/jquery.min.js",
	// appConfigInfo.mapSDKURL+"turf.min.js", 
    // appConfigInfo.mapSDKURL+"trinity.ol.js",
	
	appConfigInfo.mapSDKURL+"trinity.ol_gis.js",
	appConfigInfo.mapSDKURL+"c3-master/c3.js",
	appConfigInfo.mapSDKURL+"d3.v5.min.js",
	appConfigInfo.mapSDKURL+"trinityapi.trip.js",
	//appConfigInfo.mapSDKURL+"trip-backup25-05-2023.js"
]; 

trinityGIS3D_CSS_scriptsToLoad.forEach(function(src) {
  var script1 = document.createElement('link');
   script1.href = src;
   script1.setAttribute( 'rel', 'stylesheet' );
   script1.setAttribute( 'type', 'text/css' );
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

trinityGIS3D_JS_scriptsToLoad.forEach(function(src) {
  var script3 = document.createElement('script');
  script3.src = src;
  script3.async = false;
  document.head.appendChild(script3);
});
    
trinityGIS_JS_scriptsToLoad.forEach(function(src) {
  var script4 = document.createElement('script');
  script4.src = src;
  script4.async = false;
  document.head.appendChild(script4);
});