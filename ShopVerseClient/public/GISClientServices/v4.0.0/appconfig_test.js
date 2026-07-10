// By defining config information as json object we can avoid these 20 global variables and more changes in the API code are not required while using this json object.
window.tmpl = {};
var appConfigInfo = {
	googleMapKey : "AIzaSyB2TwPI4OFQ7fFcyGHzyCvx0fZDr6B3DAo",
	//googleMapKey : "AIzaSyDDXQOWvQ81olZpv9ojGmvD1v2TxYl0EDw",
	mapSDKURL: "http://192.168.1.165:8989/trinityAPI/v1.0.0/",
	mapSDK3DURL:"http://192.168.1.165:8989/trinityAPI/v1.0.0/cesium/",
	wfslayerurl : "http://192.168.1.211:6060/dahod_geoserver_2_17_2/wfs",
	mapDimension : "2D",
	mapData : "google",
	mapLib : "ol7",
	mapDataService : "google",//sgl / esri 
	bToken:'null',

	offline : false,
	extent1 : 72.8749522807069,
	extent2 : 8.236832611553226, 
	extent3 : 79.40077273371028, 
	extent4 : 12.815059270146412,
	
	hereMapsAppID: "FVzZgu8jdBZBdforK7Sk",
	hereMapsAppIDRest:"RGAqF1k05IQ6cva4Vze6",
	hereMapsAppKey:"zTeYlGWrl27phMOyAjHYhqFya_Gyb9A7yV09-yAQrbk",
	hereMapsAppKeyRest:"R5MkibPUjNCdDyl1aabkA1FhgycvIzKKLnhrnvWAnuQ",
	hereMapsAppCode: "Do8Db_PQvH7MkKQM-7kHYQ",
	
	tiled3DBaseMap : '480700',
	
	// Any building that has this elementId will have `show = false`.
    osmCloudBuildings : [
					  ['${elementId} === 	345935913', false]
					 ],
	wfsurl : "http://192.168.1.211:6060/dahod_geoserver_2_17_2/bangloredb",
	/**pentaBMapserverURL : "http://34.198.189.139:8082/geoserver/wms/",
	pentaBBasemapLayer : "landuse:LU.Landuse",
	pentaBAPIService : "http://ec2-34-198-189-139.compute-1.amazonaws.com:8080/query/api/query",
	pentaBNetworkAPIService : "http://ec2-34-198-189-139.compute-1.amazonaws.com:8080/api/network/getRoute",
	pentaBGetTokenAPIService:"https://ec2-34-198-189-139.compute-1.amazonaws.com:8443/auth/realms/trinity/protocol/openid-connect/token",
	pentaBClientId:"ACUD-CCC",
	pentaBClientSecret:"4f63c7d5-4192-4fcd-9290-89789b029876",
	pentaBUserName:"TrinityUser",
	pentaBPassword:"P@$$w0Rd",
	PentaUserRole:"r1",
	PentaOrgID:"trinity",
	PentaSelectedLocale:"en",
	PntaSearchDisplayField:"display_data_en",
	pentaAddressTable:{"id":11,"tableName":"public.buildings_materialized_view"},
	pentaPOIType:
	{
	blood_bank:"public.\"Tbl1\"",
	hospital:"public.\"Tbl1\"",
	fire_station:"public.\"Tbl1\"",
	police:"public.\"Tbl1\"",
	all:"public.\"Tbl1\"",
	placeTable:"public.\"Tbl1\"",
	fieldName:"col33"
	},**/

	pentaBMapserverURL : "http://34.198.189.139:8082/geoserver/wms/",
	pentaBBasemapLayer : "landuse:LU.Landuse",

	//pentaBMapserverURL : "http://192.168.2.149:6060/maha_geoserver_2_17_2/wms/",
	//pentaBBasemapLayer : "MAHA",

	pentaBAPIService : "http://ec2-34-198-189-139.compute-1.amazonaws.com:8080/query/api/query",
	pentaBNetworkAPIService : "http://ec2-34-198-189-139.compute-1.amazonaws.com:8080/api/network/getRoute", 
	pentaBGetTokenAPIService:"https://ec2-34-198-189-139.compute-1.amazonaws.com:8443/auth/realms/trinity/protocol/openid-connect/token", 
	pentaBClientId:"ACUD-CCC",
	pentaBClientSecret:"4f63c7d5-4192-4fcd-9290-89789b029876",
	pentaBUserName:"TrinityUser",
	pentaBPassword:"P@$$w0Rd",
	PentaUserRole:"r1",
	PentaOrgID:"trinity",
	PentaSelectedLocale:"en",
	PntaSearchDisplayField:"display_data_en",
	pentaAddressTable:{"id":11,"tableName":"public.buildings_materialized_view"},
	pentaPOIType:
	{
	blood_bank:"public.\"Tbl1\"",
	hospital:"public.\"Tbl1\"",
	fire_station:"public.\"Tbl1\"",
	police:"public.\"Tbl1\"",
	all:"public.\"Tbl1\"",
	placeTable:"public.\"Tbl1\"",
	fieldName:"col33"
	},
	
	sgl_url : "",
	
	sglGeocode :"http://103.93.248.119:1213/IGISRestAPI/Geocoder/GetPlaceFromLayer/landmark/name/",
	sglPlaceSearch :"http://103.93.248.119:1213/IGISRestAPI/Geocoder/GetLatLogFromLayer/landmark/name/",
	sglRouting : "http://103.93.248.119:1219/Home/GetShortestPath",
	sglGetTableDetails : "http://103.93.248.119:1213/IGISRestAPI/Meta/TableDetails",
	sglTransformwk : "http://103.93.248.119:1213/IGISRestAPI/mis/transformwkt",
	sglGetShortestPath:"http://103.93.248.119:1219/Home/GetShortestPath",
	trinitySGLMergeLine : "http://localhost:8085/trinityGIS/ps/mergeLine",
	sglToken : "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoicnNjY2wiLCJQYXNzd29yZCI6IlJzY2NsQDEyMzQiLCJQcm9qZWN0Ijoic2MxMV9yYW5jaGlfcGciLCJIb3N0IjoiMTAuNDAuMC4xOTYiLCJQb3J0Ijo1NDMyLCJ0eXBlIjoiUHJvZmVzc2lvbmFsIiwiaWF0IjoxNTkyMzk0MzczLCJhdWQiOiJzZ2w6UHJvZmVzc2lvbmFsIiwiaXNzIjoic2dsLnRsZCJ9.Yiqk-luOcFds7GMUfmSQ1wUL3mLUier0ucqy8NaUNFz53pq-OwKHl7wqavsXhcJIeSe8LlygfLSQf2aI84mt-n0eSp1rGa9jQ5LHjB22axfnPGAdNxWRpVYPiv4M7gdUyaX5g_2aKwyQ0f1BhkpFmOdFM2A8XvwMQ1ShYStFKC0",
	
	esrireverseGeocode : "https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/reverseGeocode",
	esriGeocode: "https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/findAddressCandidates",
	esriPlaceSearch:"https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/suggest?searchExtent=",
	esriRoutingToken:"https://10.150.1.81/arcgis/tokens/generateToken?username=trinity&password=tringis",
	esriRouting:"https://10.150.1.81/arcgis/rest/services/Agartala/Agartala_Routing_Service/NAServer/Route/solve",
	esriClientId : "c3IdgLLqwxVtCu91",
	esriClientSecret : "3b6fa497594440dda121bf97182f95a4",
	GlobaloffLineMap:'\\192.168.1.165\webapps\trinityAPI\v3.3\Cesium-1.83\Build\Cesium\Assets\Textures\NaturalEarthII',
	
	type : 'osm',
	mode : '',
	projection : "EPSG:4326",
	googleprojection : "EPSG:3857",
	wmsVersion : "1.1.1",
	trinityzoom : 10,
	googleMaxZoom : 21,
	trinityMaxZoom : 21,
	url : "http://192.168.1.211:6060/dahod_geoserver_2_17_2/wfs",
	layer :"landuse:LU.Landuse",
	gwc : true,
	
	lon : 72.87739312643569,
	lat : 19.075934823525948, 
	height : 1800,
	
	poi_img_url : "http://192.168.1.165:8989/trinityAPI/v2.12/poi",

	//gwcurl : "http://192.168.2.149:6060/maha_geoserver_2_17_2/wms/",
	//wmsurl : "http://192.168.2.149:6060/maha_geoserver_2_17_2/wms/",
	//streetLayer : "MAHA",
	
	gwcurl : "http://34.198.189.139:8082/geoserver/wms/",
	wmsurl : "http://34.198.189.139:8082/geoserver/wms/",
	streetLayer : "landuse:LU.Landuse",


	googleSatelliteView : true,
	googlezoom : 12,
	googleMinZoom : 3,
	trinityMinZoom : 1,
	setResolution : false,
	
	vehicleTrackZoom : 15,

 	trinitySatelliteView : false, 
 	trinitySatelliteurl : "http://34.198.189.139:8082/geoserver/wms/",//"
	trinitySatelliteLayer : "landuse:LU.Landuse",
 	trinitySatellitegwc : false,
	drawRestrictionURL : 'http://192.168.1.165:8989/bangalore/landmark_search/withInBoundary/',
	
	sglMapRequired : true,
	sgl_url :'http://103.93.248.119:1213/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=ranchi_ws',
	sglBaseMapLayer : 'landuse:LU.Landuse',
	sglLayers : [
		 { "name": "Google Hybrid", "layer":"google_hybrid" }
		,{ "name": "Ward Boundary", "layer":"ward_boundary" }
		,{ "name": "City Boundary", "layer":"city_boundary" }
		,{ "name": "Bank", "layer":"bank" }
		,{ "name": "School", "layer":"school" }
		,{ "name": "Road", "layer":"road" }
		,{ "name": "Post Office", "layer":"postoffice" }
		,{ "name": "Hospital", "layer":"hospital" }
		,{ "name": "Govt Offices", "layer":"govt_offices" }
		,{ "name": "Graden Park", "layer":"garden_park" }
		,{ "name": "Building Footprint", "layer":"building_footprint" }
		,{ "name": "Landmark", "layer":"landmark" }
	],
	
	/////////////////////// For 3D functionalities //////////////////////////////
	
	CesiumdefaultAccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NDRmMDAwOC05NmU2LTRkOTUtOTIxOS1kMTU1YTc4OTk2MDYiLCJpZCI6MzU4OTYsImlhdCI6MTYwMjY3NjIwMX0.Sst9Ej3DHa3Kxi4PEfw0gVwxn9jgJ9PQ_ncM312Nrjw',//
	//esri_url :'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',//
	esri_url :'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
	bingMapsGeocoderServiceToken : "Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR", // 
	mapboxGeocoderUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
	mapboxAccessToken: "pk.eyJ1IjoicHJhc2hhbnRoMTIzIiwiYSI6ImNqeWZyc3FlNDAwZDYzbmxnOTBwbnJwaHcifQ.ihiywno_BsEZqkyEdoo9OA",
	bingMapsRoutingURL:"http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=",
	/////////////////////////////// End 3D ////////////////////////////////////
 	connection:
	{
		url:"//192.168.1.165:8989",
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
	appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/Widgets/widgets.css", 
    // appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/DrawHelper.css"
]; 

var trinityGIS_CSS_scriptsToLoad = [
	//appConfigInfo.mapSDKURL+"trinity.css", 
    //appConfigInfo.mapSDKURL+"ol3gm.css",
    //appConfigInfo.mapSDKURL+"easy-autocomplete.css"
]; 

var trinityGIS3D_JS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/Cesium.js", 
    // appConfigInfo.mapSDK3DURL+"Cesium-1.99/Build/Cesium/DrawHelper.js"
]; 

var trinityGIS_JS_scriptsToLoad = [
	// appConfigInfo.mapSDKURL+"turf.min.js", 
    // appConfigInfo.mapSDKURL+"trinity.ol.js",
	// appConfigInfo.mapSDKURL+"ol3gm.js", 
	appConfigInfo.mapSDKURL+"trinityapi_test.js",
	//appConfigInfo.mapSDKURL+"trinityGIS_windy.js",
	// appConfigInfo.mapSDKURL+"ol3-contextmenu.js",
    // appConfigInfo.mapSDKURL+"easy-autocomplete.js",

	// appConfigInfo.mapSDKURL+"c3-master/c3.js",
	// appConfigInfo.mapSDKURL+"c3-master/c3.css",
	"https://d3js.org/d3.v5.min.js"

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