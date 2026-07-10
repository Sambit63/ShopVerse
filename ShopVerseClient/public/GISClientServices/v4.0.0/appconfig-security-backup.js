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

var envSettings = {

	mandatoryKeysToSet: "gKey,apiManURL,apiManVersion,apimanUser,apimanPass,apiManKey",

	apiManURL: "http://tiotapi.tsf.com/",
	apiManVersion: "1.0.0",
	apimanUser: "admin",

	mapDimension: "2D",

	//google,trinity,mmi,sgl
	mapData: "trinity",

	mapLib: "ol7",

	//mmi,google
	type: 'mmi',
	mode: 'normal',

	//Bengulur
	// lon : 77.55920772309938,
	// lat : 12.971503096377115,  

	//Lucknow
	// lon : 80.93884402969394,
	// lat : 26.850601673068848,

	// //KarimNagar
	// lon : 79.12705422101101,
	// lat : 18.43773636846085,


	//MPEH
	lon: 73.36600586505598,
	lat: 18.79648275658313,


	//guahati
	// lon : 91.7086,
	// lat : 26.1158,


	height: 1800,

	//Bengulur
	// extent1 : 77.90413085440112,
	// extent2 : 13.274783850212515,  
	// extent3 : 77.22709836547018,
	// extent4 : 12.691338021712754,

	//MPEH
	extent1: 73.77308590121666,
	extent2: 18.517790292333963,
	extent3: 72.9752037996571,
	extent4: 19.25451998583285,



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


	mapZoom: 12,
	maxZoom: 24,
	minZoom: 1,
	searchZoom: 18,
	layOutZoom: 6,

	layOutExtent1: 102.26838275131274,
	layOutExtent2: 35.65267138551892,
	layOutExtent3: 52.692310036287,
	layOutExtent4: 9.187117663991602


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



if (isValidData) {

	/* The code is defining an object called `appConfigInfo` which contains various configuration settings
	for the application. */
	var appConfigInfo = {

		mapSDKURL: "C:/TrinityFiles/Development/GIS/StandardProduct/Feautre-Branch-GS-6919/GISClientServices/v4.0.0/",
		mapSDK3DURL: "C:/TrinityFiles/Development/GIS/StandardProduct/Feautre-Branch-GS-6919/GISClientServices/v4.0.0/cesium/",





		// apiManURL : "http://tiotapi.tsf.com",


		get apiManURL() {
			return getKeyFromEnvSettingsWithDefault('apiManURL', 'http://tiotapi.tsf.com/');
		},


		get apiManVersion() {
			return getKeyFromEnvSettingsWithDefault('apiManVersion', '1.0.0');
		},


		get apiManKey() {
			return getKeyFromEnvSettings('apiManKey');
		},


		get apimanUser() {
			return getKeyFromEnvSettingsWithDefault('apimanUser', 'admin');
		},


		get apimanPass() {
			return getKeyFromEnvSettings('apimanPass');
		},


		get apiManGetAccessToken() {
			return getKeyFromEnvSettingsWithDefault('apiManURL', 'http://tiotapi.tsf.com/') + "tiotAPIESBSubSystem/1.0.0/getAccessToken"
		},


		get apiManUsername() {
			return getKeyFromEnvSettingsWithDefault('apimanUser', 'admin');
		},


		get apiManPassword() {
			return getKeyFromEnvSettings('apimanPass');
		},


		get apiManAuthorizationKey() {
			return getKeyFromEnvSettings('apiManKey');
		},


		get apiManUrlForGecode() {
			return getKeyFromEnvSettingsWithDefault('apiManURL', 'http://tiotapi.tsf.com/"') + "t/tsf.com/tiotGIS/1.0.0"
		},


		get gKey() {
			return getKeyFromEnvSettings('gKey');
		},


		get googleMapKey() {
			return getKeyFromEnvSettings('gKey');
		},



		get mapDimension() {
			return getKeyFromEnvSettingsWithDefault('mapDimension', '2D');
		},


		get mapData() {
			return getKeyFromEnvSettingsWithDefault('mapData', 'google');
		},


		get mapLib() {
			return getKeyFromEnvSettingsWithDefault('mapLib', 'ol7');
		},


		get type() {
			return getKeyFromEnvSettingsWithDefault('type', 'google');
		},


		get mode() {
			return getKeyFromEnvSettingsWithDefault('mode', 'normal');
		},

		//Map configuration 


		get lon() {
			return getKeyFromEnvSettingsWithDefault('lon', 77.55920772309938);
		},


		get lat() {
			return getKeyFromEnvSettingsWithDefault('lat', 12.971503096377115);
		},


		get height() {
			return getKeyFromEnvSettingsWithDefault('height', 1800);
		},


		get extent1() {
			return getKeyFromEnvSettingsWithDefault('extent1', 102.26838275131274);

		},


		get extent2() {
			return getKeyFromEnvSettingsWithDefault('extent2', 35.65267138551892);
		},


		get extent3() {
			return getKeyFromEnvSettingsWithDefault('extent3', 52.692310036287);
		},


		get extent4() {
			return getKeyFromEnvSettingsWithDefault('extent4', 9.187117663991602);
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



		get layOutZoom() {
			return getKeyFromEnvSettingsWithDefault('layOutZoom', 6);
		},




		get layOutExtent1() {
			return getKeyFromEnvSettingsWithDefault('layOutExtent1', 102.26838275131274);
		},



		get layOutExtent2() {
			return getKeyFromEnvSettingsWithDefault('layOutExtent2', 35.65267138551892);
		},




		get layOutExtent3() {
			return getKeyFromEnvSettingsWithDefault('layOutExtent3', 52.692310036287);
		},



		get layOutExtent4() {
			return getKeyFromEnvSettingsWithDefault('layOutExtent4', 9.187117663991602);
		},



		mapserverURL: "http://tiotapi.tsf.com/trinityMapserver/topp/wms",
		basemapLayer: "topp:tasmania_state_boundaries",

		baseUrl: "https://tiotgis.tsf.com/EGISAPIService/apis/",

		offline: false,
		projection: "EPSG:4326",
		mapProjection: "EPSG:3857",
		wmsVersion: "1.1.0",

		url: "http://tiotapi.tsf.com/dahod_geoserver_2_17_2/wfs",
		gwc: false,
		wfslayerurl: "http://tiotapi.tsf.com/dahod_geoserver_2_17_2/wfs",
		mapDataService: "google",

		hereMapsAppID: "tTyWoZedGCPml5Ny77kG",
		hereMapsAppCode: "Do8Db_PQvH7MkKQM-7kHYQ",
		tiled3DBaseMap: '480700',

		esrireverseGeocode: "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/reverseGeocode",
		esriGeocode: "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/findAddressCandidates",
		esriPlaceSearch: "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Address_Locator/GeocodeServer/suggest?searchExtent=",
		esriRouting: "https://tiotapi.tsf.com/arcgis/rest/services/Agartala/Agartala_Routing_Service/NAServer/Route/solve",
		esriClientId: "c3IdgLLqwxVtCu91",
		GlobaloffLineMap: '\\tiotapi.tsf.com\webapps\trinityAPI\v3.3\Cesium-1.83\Build\Cesium\Assets\Textures\NaturalEarthII',

		poi_img_url: "http://tiotapi.tsf.com:8989/trinityAPI/v2.12/poi",
		// gwcurl : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
		// wmsurl : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
		// streetLayer : "topp:tasmania_state_boundaries",
		// url : "http://tiotapi.tsf.com:9090/trinityMapserver/topp/wms",
		// layer :"topp:tasmania_state_boundaries",
		// gwc : true,
		// googleSatelliteView : true,

		// setResolution : false,
		vehicleTrackZoom: 15,

		trinitySatelliteView: false,
		trinitySatelliteurl: "http://tiotapi.tsf.com:8082/geoserver/wms/",//"
		trinitySatelliteLayer: "landuse:LU.Landuse",
		trinitySatellitegwc: false,
		drawRestrictionURL: 'http://tiotapi.tsf.com:8989/bangalore/landmark_search/withInBoundary/',

		//Cesium Map configuration
		esri_url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
		mapboxGeocoderUrl: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
		bingMapsRoutingURL: "http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=",

		connection:
		{
			baseUrl: "https://tiotgis.tsf.com/EGISAPIService/apis/",
			url: "http://tiotapi.tsf.com:8070/EGISAPIService/apis",
			project: "trinityGIS",
			gisProject: "trinityICCC/getAsset"
		},
		bgImage: 'iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABODcYhAAEl463hAAAAAElFTkSuQmCC',

		//MMI Map Implimentation START For MPEH
		dev_tokenurl: "https://tiotapi:8243/tiotAPIESBSubSystem/1.0.0/getAccessToken",
		dev_token: "QUY1SWlKb3BTc2x4djFTQ3c2T2JBN25WSzlVYTp5R09UT1NLeXIyNldTa2NXbWtROE5ORWpnMWth",
		dev_user: "admin",
		mmi_clientid: "33OkryzDZsJ8279B1bylI1JeuAJj5b3xmJEpG7rs9y5Gx1edT05ySbVsiCAFP28ZYVl51mfT0pOxhNt9azh-hQ==",
		mmi_clientsecret: "lrFxI-iSEg9Q3T5uAkSHzFUpARYuv3SpltPMgzs_VlDgHlY-l65cCEK7kHgihHkpv1npN-9_MSmaQ_bq4CtzaKvx3dJIpGUo",
		mmi_tokenurl: " https://outpost.mappls.com/api/security/oauth/token",
		mmi_search: "https://atlas.mappls.com/api/places/search/json",
		mmi_search_devurl: "https://tiotapi:8243/tiotgoogle/1.0.0/places/search?query=",
		mmi_geocode: "https://apis.mapmyindia.com/advancedmaps/v1/",
		mmi_geocode_devurl: "https://tiotapi:8243/tiotgoogle/1.0.0/rev_geocode?",
		mmi_nearbyplaces: "https://atlas.mapmyindia.com/api/places/nearby/",
		mmi_nearbyplaces_devurl: "https://tiotapi:8243/tiotgoogle/1.0.0/places/nearby?keywords=",
		mmi_snaptoroad: "https://apis.mapmyindia.com/advancedmaps/v1/",
		mmi_eloc: "https://explore.mappls.com/apis/O2O/entity/",
		mmi_eloc_devurl: "https://tiotapi:8243/tiotgoogle/1.0.0/latlon/",
		layer: "MPEH",
		marathilayer: "",
		gwc: true,
		gwcurl: window.location.protocol + '//' + window.location.hostname + "/mpeh_geoserver_2.22/mpeh/wms",
		wmsurl: window.location.protocol + '//' + window.location.hostname + "/mpeh_geoserver_2.22/mpeh/wms",
		url: window.location.protocol + '//' + window.location.hostname + "/mpeh_geoserver_2.22/mpeh/wms",
		streetLayer: "MPEH",
		googleSatelliteView: false,
		googlezoom: 12,
		googleMinZoom: 1,
		trinityMinZoom: 1,
		setResolution: true,
		googleprojection: "EPSG:3857",
		trinityzoom: 11,
		googleMaxZoom: 21,
		trinityMaxZoom: 21,
		appcode: "trinityGIS",
		ln: 'ar',
		searchKey: 'description',


		//MMI Map Implimentation END


		//MMI Map Implimentation for Lucknow Start 
		mmi_clientid: "33OkryzDZsJ8279B1bylI1JeuAJj5b3xmJEpG7rs9y5Gx1edT05ySbVsiCAFP28ZYVl51mfT0pOxhNt9azh-hQ==",
		mmi_clientsecret: "lrFxI-iSEg9Q3T5uAkSHzFUpARYuv3SpltPMgzs_VlDgHlY-l65cCEK7kHgihHkpv1npN-9_MSmaQ_bq4CtzaKvx3dJIpGUo",
		mmi_tokenurl: "https://outpost.mappls.com/api/security/oauth/token?grant_type=client_credentials&client_id=",
		mmi_reversegeocode: "https://apis.mappls.com/advancedmaps/v1/",
		mmi_search: "https://atlas.mappls.com/api/places/search/json",
		baseUrl: 'https://apis.mappls.com/advancedmaps/v1/',

		mmi_layers: [
			{ layers: 'a', styles: 'lko_police_boundary_category_based_label_1696005759056_workview', datasetNme: 'lko_police_boundary', test: '0.5756302833565932' },
			{ layers: 'b', styles: 'lko_police_chowki_1705158106478', datasetNme: 'lko_police_chowki', test: '0.5635334227880069', minZoom: 5 },
			{ layers: 'c', styles: 'lko_bldg_footprint_1705158954938', datasetNme: 'lko_bldg_footprint', test: '0.5635334227880069', minZoom: 5 },
			{ layers: 'd', styles: 'lko_bridge_pol_1705158997573', datasetNme: 'lko_bridge_pol', test: '0.07176665643749613', minZoom: 5 },
			{ layers: 'e', styles: 'lko_bus_sheltors_label_1705159063863', datasetNme: 'lko_bus_sheltors', test: '0.01912254419860382', minZoom: 5 },
			{ layers: 'f', styles: 'lko_bus_terminals_1705159118264', datasetNme: 'lko_bus_terminals', test: '0.7210539198359649', minZoom: 5 },
			{ layers: 'g', styles: 'lko_canal_1705158872634', datasetNme: 'lko_canal', test: '0.9918186969957841' },
			{ layers: 'h', styles: 'lko_health_label_1705159300428', datasetNme: 'lko_health', test: '0.0545336345765135', minZoom: 5 },
			{ layers: 'i', styles: 'lko_lakes_label_1705159333697', datasetNme: 'lko_lakes', test: '0.862050792546329' },
			{ layers: 'j', styles: 'lko_streams_1705159810845', datasetNme: 'lko_streams', test: '0.12402535067981302' },
			{ layers: 'h', styles: 'lko_parkgarden_1705159532980', datasetNme: 'lko_parkgarden', test: '0.569063660184574' },
			{ layers: 'k', styles: 'lko_police_chowki_label_1705159578515', datasetNme: 'lko_police_chowki', test: '0.9170828672802582', minZoom: 5 },
			{ layers: 'l', styles: 'lko_police_stn_1705159614159', datasetNme: 'lko_police_stn', test: '0.02047926109989251' },
			{ layers: 'm', styles: 'lko_ponds_label_1705159649800', datasetNme: 'lko_ponds', test: '0.39357144163431657' },
			{ layers: 'n', styles: 'lko_rd_poly_1705159683485', datasetNme: 'lko_rd_poly', test: '0.6946428791472148', minZoom: 10 },
			{ layers: 'o', styles: 'lko_river_1705158004374', datasetNme: 'lko_river', test: '0.9186517289957437' },
			{ layers: 'p', styles: 'lko_rly_line', datasetNme: 'lko_rly_line', test: '0.010787289695188607', minZoom: 10 },
			{ layers: 'q', styles: 'lko_rly_stn_pt_label_1705159741550', datasetNme: 'lko_rly_stn_pt', test: '0.9326853785500631', minZoom: 10 },
			{ layers: 'r', styles: 'lko_road_divider_1705159785367', datasetNme: 'lko_road_divider', test: '0.9902634702285882', minZoom: 10 },
			{ layers: 's', styles: 'lko_ponds_label_1705159649800', datasetNme: 'lko_ponds', test: '0.39357144163431657' }

		],
		//MMI Map Implimentation for Lucknow End

		// SGL Map Configuration
		sglMapRequired: true,
		sgl_url: 'https://caicoc.trinityiot.in/demomaps/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=puducherry_ws',
		sglBaseMapLayer: 'ward_boundary',
		sglLayers: [
			{ "name": "boundary_district", "layer": "boundary_district" }
			, { "name": "road_centerline", "layer": "road_centerline" }
			, { "name": "landmark_school", "layer": "landmark_school" }
			, { "name": "landmark_police_station", "layer": "landmark_police_station" }
			, { "name": "landmark_hospital", "layer": "landmark_hospital" }
			, { "name": "landmark_fire_station", "layer": "landmark_fire_station" }
			, { "name": "landmark_atm", "layer": "landmark_atm" }
			, { "name": "osm", "layer": "osm" }
			, { "name": "landmark_atm", "layer": "landmark_atm" }
			, { "name": "google_hybrid", "layer": "google_hybrid" }
		],

		// SGL Map Configuration Ends

		//SGL Map Implimentation for KarimNagar
		sgl_baseMap: window.location.protocol + '//' + window.location.hostname + "/cgi-bin/IGiS_Ent_service.exe?IEG_PROJECT=karimnagar_ws",
		sgl_access_token: "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzZXJ2ZXJfb2JqIjoiOGU3YTZhZDIwMjQ2NzFmYjA0NDAxMDgxNGY5ZTNkNjAuNmU3MTU2ZWY0MjIzOTBhNjY4NDQwNzU4ZWUwZTNhNjkwYTJiZjQxYjUzMmQxNjM0OGQ4YjM4YTk2OGVkZjU5NzBjZjNmNDcyNjNlZmE1YWRlYzQ3YmJlMjM4OTkzZDFkZmFmNDBiZDgyMzNjNTczMTFkNWI5MmVlYzIzMTZmOWEwZDhmY2M2YjBiOTQ4ODIwNGJmMjg0MDg4NTZjZGFmNGUyMDE5NjQ2MDIwOWZhOTU1M2M1ZWZlMjlhZTc1NGM5MmE0ZGMxY2Y1Mzc1OWI5NTJkZWI1ZWNmMDA1ZmViMjU2MjVkMDAzNTg5NGU3MzE2YWYxMDY5MzA1ZjkzZWZjYyIsImlhdCI6MTY4NTYyMzQ5MywiYXVkIjoic2dsOlByb2Zlc3Npb25hbCIsImlzcyI6InNnbC50bGQifQ.J-c2xuqnxlFgjUM6hDQiIunjpbwOcN5LUNKVwe9faTY9ss5npnwrK30PD0CTEop3C2jGxl4JxkjG2usLQdxnOE_RTA6S1Zw60v-v-kKVMmEivsKnwHfx7UbWz2aAG5hD5bZozE_pb6KEtUCqoFgo2Fr5X3UVZ3aVGRjVx2o4WvA",
		sgl_reversegeocode: window.location.protocol + '//' + window.location.hostname + "/IGISRestAPI/Geocoder/GetAttributeValueFromLayer/landmarks/",
		sgl_geocode: window.location.protocol + '//' + window.location.hostname + "/IGISRestAPI/Geocoder/GetLocationsFromAttribute/landmarks/type/",
		sgl_transformwk: window.location.protocol + '//' + window.location.hostname + "/IGISRestAPI/Miscellaneous/TransformWKT",
		sgl_route: window.location.protocol + '//' + window.location.hostname + "/IGISRestAPI/Network/FindShortestPathMultiRoute?asfile=false",
		sgl_srid: "4326",
		sgl_SridOfGeometry: "4326",
		sgl_OutputSrid: "32644",
		sgl_OutputOptions: "2",
		sgl_NumOfRoute: "1",
		sgl_mapZoom: 14,


		//Esri Integration
		esri_url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
		esriNormalUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
		esriStreetUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
		esriLightUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
		esriDarkUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer',

		esrireverseGeocode: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode',
		esriRouting: 'https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve',
		esriClientId: "c3IdgLLqwxVtCu91",
		esriClientSecret: "3b6fa497594440dda121bf97182f95a4",
		esriRoutingTokenURL: "https://www.arcgis.com/sharing/rest/oauth2/token",
		esriRoutingToken: true,
		esriPlaceSearch: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
		searchZoom: 16,
		esriProjection: "4326",

		graphHopperRoute: false,

		wfslayerurl: "https://hcsjointstack.trinityiot.in/trinityMapserver",

		"osm_geocode": "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=",
		"osm_route": "http://router.project-osrm.org/route/v1/driving/",
		"osm_search": "https://nominatim.openstreetmap.org/search?q=",



		//PentaB
		gwcurl: "http://172.16.1.5:8080/geoserver/misk_city/wms",
		layer: "misk_city:landuse",
		wmsVersion: "1.1.0",
		projection: "EPSG:4326",
		pentaBGetTokenAPIService: "https://172.16.1.28:8443/auth/realms/MISK/protocol/openid-connect/token",
		pentaBClientId: "misk-integration-client",
		pentaBClientSecret: "EdaWff7htXgVTeveaxaPUtIl9OT1sas4",
		pentaBUserName: "miskclient",
		pentaBPassword: "T$axQsc)9b26wZeu",
		pentaBAPIService: "https://172.16.1.29/query/api/query",
		PentaOrgID: "MISK",
		PentaUserRole: "MISK",
		PentaBSelectedLocale: "AR",
		PentaPlaceGeocodeId: "aae31ead-c94b-4695-8cb4-7b3895e05bfc",
		pentaBPlaceSearchId: "aae31ead-c94b-4695-8cb4-7b3895e05bfc",
		pentaBsearchLimit: 10,
		pentaBPlaceSearchGeomField : "geom",
		pentaBPlaceSearchField : "text",
		pentaBNetworkAPIService: "https://172.16.1.29/ma-service-network/api/network/getRoute",
		pentaBNetworkDataSourceId : "8d8e372e-beb4-4494-bf83-f094ce97f4ea",
		pentaBNetworkDirected : false,
		pentaBNetworkNavigation : false,
		pentaBNetworkIncludeSegment : false,
		pentaBNetworkDisableBarriers : true,
		pentaBNetworkCost_Table : "tn_road_cost",
		pentaBProjection : "4326",
		




		
	}

}

// var gscript = document.createElement("script");
// gscript.type = "text/javascript";
// gscript.src = "https://maps.googleapis.com/maps/api/js?key="+appConfigInfo.googleMapKey+"&libraries=places,drawing";
// document.getElementsByTagName("head")[0].appendChild(gscript);


var trinityGIS3D_CSS_scriptsToLoad = [
	appConfigInfo.mapSDK3DURL + "Cesium-1.112/Build/Cesium/Widgets/widgets.css"
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
	appConfigInfo.mapSDK3DURL + "Cesium-1.112/Build/Cesium/Cesium.js"
];

var trinityGIS_JS_scriptsToLoad = [
	appConfigInfo.mapSDKURL + "trinityapi.Utils.js",
	appConfigInfo.mapSDKURL + "external/crypto-js.min.js",
	appConfigInfo.mapSDKURL + "ol7/ol.js",
	appConfigInfo.mapSDKURL + "leaflet/leaflet.js",
	appConfigInfo.mapSDKURL + "leaflet/leaflet-provider.js",
	appConfigInfo.mapSDKURL + "leaflet/Leaflet.fullscreen.min.js",
	appConfigInfo.mapSDKURL + "leaflet/Leaflet.fullscreen.js",
	appConfigInfo.mapSDKURL + "external/html2canvas.min.js",
	appConfigInfo.mapSDKURL + "external/jspdf.umd.min.js",
	appConfigInfo.mapSDKURL + "external/jquery-3.7.1.min.js",
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
	appConfigInfo.mapSDKURL + "trinityapi.Windy.js",
	appConfigInfo.mapSDKURL + "trinityapi.Mobility.js",
	appConfigInfo.mapSDKURL + "trinityapi.UtilityNetwork.js",
	// appConfigInfo.mapSDKURL+"trinityapi.Utils.js",
	appConfigInfo.mapSDKURL + "jquery-3.7.1.min.js",
	// appConfigInfo.mapSDKURL+"jspdf.plugin.autotable.min.js",
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
// trinityGIS3D_JS_scriptsToLoad.forEach(function (src) {
// 	var script3 = document.createElement('script');
// 	script3.src = src;
// 	script3.async = false;
// 	document.head.appendChild(script3);
// });

trinityGIS_CSS_scriptsToLoad.forEach(function (src) {
	var script2 = document.createElement('link');
	script2.href = src;
	script2.setAttribute('rel', 'stylesheet');
	script2.setAttribute('type', 'text/css');
	script2.async = false;
	document.head.appendChild(script2);
});

trinityGIS_JS_scriptsToLoad.forEach(function (src) {
	var script4 = document.createElement('script');
	script4.src = src;
	script4.async = false;
	document.head.appendChild(script4);
});

trinityGIS3D_JS_scriptsToLoad.forEach(function (src) {
	var script5 = document.createElement('script');
	script5.src = src;
	script5.async = false;
	document.head.appendChild(script5);
});
