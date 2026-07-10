
// **** This will return the route between specified source and destination points **** //

var totalDistance = 0;
var routeLayer;
var routeVector_line;
var routeLayer_waypoint;

tmpl.Route.clearRoute = function (param) {
  var mapObj = param.map;
  var layer = param.layer;

  try {
    if (mapObj === null || mapObj === undefined || mapObj === '') {

      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
    }

    if (layer === null || layer === undefined || layer == '' || layer == "") {
      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  layer name' };
    }

  } catch (error) {
    if (error instanceof Error) {

      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
    }
  }
  if (appConfigInfo.mapDimension == "2D") {
    if (routeLayer != undefined)
      routeLayer.getSource().clear();
    if (routeVector_line != undefined)
      routeVector_line.getSource().clear();
    if (routeLayer_waypoint != undefined)
      routeLayer_waypoint.getSource().clear();
    totalDistance = 0;

    try {
      mapObj.getLayers().forEach(function (layer) {

        if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
          mapObj.removeLayer(layer);
        } else {
          //mapObj.removeLayer(layer);
          //console.log("No Layer Available..!");
        }
      });
    } catch (e) { console.log("Layer Not Available..!"); }

    if (layer) {
      var existing;
      var Layers = mapObj.getLayers();
      var length = Layers.getLength();
      for (var i = 0; i < length; i++) {
        var existingLayer = Layers.item(i);
        if (existingLayer) {
          if (existingLayer.get('lname') === layer) {
            // if(existingLayer.get('lname') === layer){
            existing = existingLayer;
            mapObj.removeLayer(existingLayer);
          }
        }
      }
    }
    try {
      mapObj.getLayers().forEach(function (layer) {

        if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
          mapObj.removeLayer(layer);
        } else {
          //mapObj.removeLayer(layer);
          //console.log("No Layer Available..!");
        }
      });


    } catch (e) { console.log("Layer Not Available..!"); }
  } else {

    let allLayers = mapObj.entities._entities._array

    for (let i = allLayers.length - 1; i >= 0; i--) {
      if (allLayers[i].name == layer) {
        mapObj.entities.remove(allLayers[i]);
      }
    }
  }

  return { status: true, message: 'tmpl.Route.clearRoute executed successfully' }

}


tmpl.Route.getRoute = async function (param) {

  var mapObj = param.map;
  try {
    if (mapObj === null || mapObj === undefined || mapObj === '') {

      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  mapObj parameter' };
    }

    if (param.source === null || param.source === undefined || param.source.length == 0) {
      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  source parameter' };
    }

    if (param.destination === null || param.destination === undefined || param.destination.length == 0) {
      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  destination parameter' };
    }


    if ((param.destinationIcon && param.sourceIcon && param.waypointsIcon) === null || (param.destinationIcon && param.sourceIcon && param.waypointsIcon) === undefined) {

      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Enter valid sourceIcon, destinationIcon, waypointsIcon' };

    }


    if (param.route_width === null || param.route_width === undefined) {

      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  destination parameter' };
    }



  } catch (error) {
    if (error instanceof Error) {
      console.log("tmpl.Route.getRoute : ", error.message);
      return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
    }
  }

  try {
    tmpl.Route.clearRoute({ map: param.map })
  } catch (e) {
    console.log("Clear Route...", e);
  }
  try {
    tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
    tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });

    tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
    tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });

  }
  catch (e) {
    console.log("Line Layer Creation Error..!", e);
  }

  var mapObj = param.map;

  try {
    if (appConfigInfo.mapDimension == "2D") {
      tmpl.Route.clearRoute({ map: mapObj });
      if (appConfigInfo.mapData == "google") {

        if (appConfigInfo.type == 'google') {
          getGoogleRoute(param);
        } else if (appConfigInfo.type == 'osm') {
          getOSMRoute(param);
        } else if (appConfigInfo.type == 'esri') {
          getEsriRoute(param)
        }
      }
      else if (appConfigInfo.mapData == 'pentab') {
        getPentaBRoute(param);
      }
      else if (appConfigInfo.mapData == "hereMaps") {
        getHereMapsRoute(param);
      }
      else if (appConfigInfo.mapData == "trinity") {
        getTrinityMapsRoute(param)
      }
      else if (appConfigInfo.mapData == "mmi") {
        getMMIMapsRoute(param)
      }
      else if (appConfigInfo.mapData == "sgl") {
        getSGLRoute(param)
      }
      else {
        if (appConfigInfo.type == 'sgl') {
          getSGLRoute(param);
        }
        else {
          getTrinityRoute(param);
        }
      }
    }


    else {
      let map = param.map;
      let source = param.source;
      let destination = param.destination;
      let waypoints = param.waypoints;
      let layerName = param.layer;
      let startIcon = param.sourceIcon;
      let endIcon = param.destinationIcon;
      let waypointsIcon = param.waypointsIcon;
      let routeWidth = param.route_width ? param.route_width : 3;
      let routeColor = param.routeColor ? param.routeColor : "rgb(255, 0, 0)";
      let callbackFunc = param.callbackFunc;
      let image_scale = param.imageScale ? param.imageScale : 1;
      let helperObj;

      let routePoints = [];

      let firstPoint = `${source[1]},${source[0]}`;
      let lastPoint = `${destination[1]},${destination[0]}`;

      routePoints.push(firstPoint);
      waypoints.forEach(point => {
        helperObj = `${point.lat},${point.lon}`;
        routePoints.push(helperObj);
      })
      routePoints.push(lastPoint);

      if(appConfigInfo.type == 'esri'){
        getArcGISEsriRoute(param);
        return;
      }

      const routeData = await fetchRoute(routePoints);

      const path = routeData.paths[0];
      const encodedPolyline = path.points;

      const decodedPoints = decodePolyline(encodedPolyline);
      const positions = decodedPoints.map(point => {
        return Cesium.Cartesian3.fromDegrees(point[0], point[1]);
      });

      map.entities.add({
        name: layerName,
        position: Cesium.Cartesian3.fromDegrees(source[0], source[1]),
        billboard: {
          image: startIcon,
          scale: image_scale,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
      });

      map.entities.add({
        name: layerName,
        position: Cesium.Cartesian3.fromDegrees(destination[0], destination[1]),
        billboard: {
          image: endIcon,
          scale: image_scale,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
      });

      waypoints.forEach(poi => {
        map.entities.add({
          name: layerName,
          position: Cesium.Cartesian3.fromDegrees(poi.lon, poi.lat),
          billboard: {
            image: waypointsIcon,
            scale: image_scale,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          },
        });
      })

      let entity = map.entities.add({
        name: layerName,
        polyline: {
          positions: positions,
          width: routeWidth,
          material: Cesium.Color.fromCssColorString(routeColor)
        }
      });

      map.zoomTo(entity);

    }

    return { status: true, message: 'getRoute executed successfully' }
  }
  catch (err) {
    console.error("ERROR Route.getRoute: ", err);
  }
}


function getGoogleRoute(param) {
  var waypoint_limit = 8;
  var wayptsExist = false;
  var wayPointFormat = param.wayPointFormat;


  if (param.waypoints) {
    //console.log("param.waypoints: ", param.waypoints);
    var stops1 = param.waypoints;
    var temp = stops1;
    //console.log("TEMP===>", temp);
    var stops = [];

    if (wayPointFormat == undefined) {
      stops = stops1;
    } else if (wayPointFormat == true) {
      for (var x = 0; x < stops1.length; x++) {
        stops[x] = {};
        //console.log("temp[x]: ", temp[x]);
        stops[x].lat = parseFloat(temp[x][1]);
        stops[x].lon = parseFloat(temp[x][0]);
      }
    }
    var wayptsExist = stops.length > 0;
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
  }
  var waypts = [];
  var itemsCounter = 0;
  var batches = [];
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer({
    preserveViewport: true
  });
  calculateRoute();

  function calculateRoute() {
    var start = new google.maps.LatLng(sourcePoint[1], sourcePoint[0]);
    var end = new google.maps.LatLng(destinationPoint[1], destinationPoint[0]);
    var tempval;
    if (wayptsExist) {
      for (var i = 0; i < waypoint_length; i++) {
        if (stops[i]) {
          tempval = new google.maps.LatLng(stops[i].lat, stops[i].lon);
          waypts.push({
            location: tempval,
            stopover: true
          });
        }
      }
    }
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    var cordStart = ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857');
    var cordEnd = ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857');
    var x1, y1, x2, y2, extent, temp;
    temp = bounds.toString();
    temp = temp.slice(2, -2);
    temp = temp.split("), (");
    x1 = parseFloat((temp[0].split(","))[0]);
    y1 = parseFloat((temp[0].split(","))[1]);
    x2 = parseFloat((temp[1].split(","))[0]);
    y2 = parseFloat((temp[1].split(","))[1]);
    extent = [y1, x1, y2, x2];
    var method = 'DRIVING';
    var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      // travelMode: google.maps.TravelMode.DRIVING
      //travelMode: google.maps.DirectionsTravelMode.DRIVING
      travelMode: google.maps.TravelMode[method]
    };
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var polyline = new google.maps.Polyline({
          path: [],
          strokeColor: '#0000FF',
          strokeWeight: 3
        });
        var legs = response.routes[0].legs;
        for (i = 0; i < legs.length; i++) {
          var steps = legs[i].steps;
          for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (k = 0; k < nextSegment.length; k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }
        }
        var ETA_legs = legs;
        var pathObj = polyline.getPath().getArray();
        var coordinateArray = [];
        for (var i = 0, length = pathObj.length; i < length; i++) {
          var po = pathObj[i].toString().slice(1, -1);
          var latVal = po.split(",")[0];
          var lonVal = po.split(",")[1];
          var coordinate = ol.proj.transform([parseFloat(lonVal), parseFloat(latVal)], 'EPSG:4326', 'EPSG:3857');
          coordinateArray.push(coordinate);
        }
        CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
      } else {
        console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    })
  }
}


function CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs) {
  //console.log("CreateLayer:",param, cordStart, cordEnd, coordinateArray, ETA_legs);
  var startPointAddress;
  var endPointAddress;
  var datas = [];

  if (appConfigInfo.type == 'esri') {
    var startPoint = cordStart;
    var endPoint = cordEnd;
  }
  else {
    var startPoint = ol.proj.transform(cordStart, 'EPSG:3857', 'EPSG:4326');
    var endPoint = ol.proj.transform(cordEnd, 'EPSG:3857', 'EPSG:4326');
  }


  //datas = [{"start_address":startPointAddress,"end_address":endPointAddress}];

  var linestyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 6
    })
  });
  var feature = [];
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  if (param.callbackFunc != undefined)
    var callbackFunc = param.callbackFunc;
  var getGeomCallback = param.getGeometry;
  var wayPointFormat = param.wayPointFormat;
  var route_width = param.route_width;
  var routeColor = param.route_color;
  var waypoint_limit = 8;
  var wayptsExist = false;
  var format = new ol.format.WKT();
  if (param.waypoints) {
    var fature_waypoint;
    var waypointFeatures = [];
    var stops1 = param.waypoints;
    var temp = stops1;
    var stops = [];
    if (wayPointFormat == undefined) {
      stops = stops1;
    } else if (wayPointFormat == true) {

      for (var x = 0; x < stops1.length; x++) {
        stops[x] = {};
        stops[x].lat = parseFloat(temp[x].lat);
        stops[x].lon = parseFloat(temp[x].lon);
      }
    }
    var stopsIcon = param.waypointsIcon;
    var wayptsExist = stops.length > 0;
    var waypoint_value;
    var tempwaypointStyle, waypointStyle, wkt_fature_waypoint = [];
    var globalwaypointStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: stopsIcon,
        anchor: [0.5, 1]
      })
    });
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
    if ((stops.length) >= waypoint_limit) {
      console.log("CreateLayer : exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
    }
    for (var t = 0; t < waypoint_length; t++) {
      try {
        if (appConfigInfo.mapData == "google") {
          waypoint_value = ol.proj.transform([parseFloat(stops[t].lon), parseFloat(stops[t].lat)], 'EPSG:4326', 'EPSG:3857');
        } else {
          waypoint_value = [parseFloat(stops[t].lon), parseFloat(stops[t].lat)];
        }
        if (stops[t].Icon != undefined) {
          tempwaypointStyle = new ol.style.Style({
            image: new ol.style.Icon({
              src: stops[t].Icon,
              anchor: [0.5, 1]
            })
          });
          waypointStyle = tempwaypointStyle;
        } else {
          waypointStyle = globalwaypointStyle;
        }
        fature_waypoint = new ol.Feature({
          geometry: new ol.geom.Point(waypoint_value)
        });
        var wayPointIdTemp = "route_waypoint" + (t + 1);
        fature_waypoint.set('id', wayPointIdTemp);
        fature_waypoint.setStyle(waypointStyle);
        if (param.waypoints && param.getGeometry) {
          wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')));

        }
        waypointFeatures.push(fature_waypoint);
      } catch (er) {
        console.error("please check your waypoint input: " + er);
      }
    }
  }

  var noLayer = false;
  var noLayer_line = false;
  var noLayer_waypoint = false;
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer.get('lname') === 'routeVector_waypoint') {
      noLayer_waypoint = true;
      routeLayer_waypoint = existingLayer;
      //routeLayer_waypoint.getSource().clear();
    }
    if (existingLayer.get('lname') === 'routeVector') {
      noLayer = true;
      routeLayer = existingLayer;
      //routeLayer.getSource().clear();
    }
    if (existingLayer.get('lname') === 'routeVector_line') {
      noLayer_line = true;
      routeVector_line = existingLayer;
      //routeVector_line.getSource().clear();
    }
  }

  var routeLineColor = null;
  if (routeColor != undefined) {
    routeLineColor = null;
    routeLineColor = routeColor;
    // alert(routeColor);
  }
  else {
    routeLineColor = null;
    routeLineColor = "red";
    // alert(routeColor);
  }
  var r_w;
  if (route_width != undefined)
    r_w = route_width;
  else
    r_w = 5;
  if (!noLayer) {
    routeLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      title: 'Draw_Route_Layer',
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: routeLineColor,
          width: r_w
        })
      })
    });
    routeLayer.setProperties({
      lname: "routeVector"
    });
    mapObj.addLayer(routeLayer);
  }

  if (!noLayer_line) {
    routeVector_line = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: routeLineColor,
          width: r_w
        })
      })
    });
    routeVector_line.setProperties({
      lname: "routeVector_line" + routeLineColor
    });
    //console.log("CreateLayer:"+routeLineColor);  
    mapObj.addLayer(routeVector_line);
  }

  if (wayptsExist) {
    if (!noLayer_waypoint) {
      routeLayer_waypoint = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: waypointFeatures
        }),
        title: 'Draw_Route_Layer',
      });
      routeLayer_waypoint.setProperties({
        lname: "routeVector_waypoint"
      });
      mapObj.addLayer(routeLayer_waypoint);
    } else {
      try {
        routeLayer_waypoint.getSource().clear();
        routeLayer_waypoint.getSource().addFeatures(waypointFeatures);
      } catch (er) {
        console.error("Adding Waypoints Marker Isssue: " + er);
      }
    }
  }

  var sourceMarker = new ol.Feature({
    geometry: new ol.geom.Point(cordStart),
    fname: 'source',
    id: 'route_source'
  });
  if (appConfigInfo.type == 'esri') {
    sourceMarker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
  }
  var sourceStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: sourceIcon
    })
  });
  sourceMarker.setStyle(sourceStyle);
  var destinationMarker = new ol.Feature({
    geometry: new ol.geom.Point(cordEnd),
    fname: 'destination',
    id: 'route_destination'
  });
  if (appConfigInfo.type == 'esri') {
    destinationMarker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
  }
  var destinationStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: destinationIcon
    })
  });
  destinationMarker.setStyle(destinationStyle);
  var featuresCollection_t = [];
  if (appConfigInfo.mapData == "google") {
    //alert("linestring");
    var lineString = new ol.geom.LineString(coordinateArray);

    //console.log("lineString::",lineString);
    var featuresCollection_g = new ol.Feature({
      geometry: lineString,
      name: 'Line'
    });


    if (appConfigInfo.type == 'esri') {
      featuresCollection_g.getGeometry().transform('EPSG:4326', 'EPSG:3857');
    }


  }
  else {
    var length_geometryVal = coordinateArray.length;
    console.log("CreateLayer:", length_geometryVal);
    var featureTemp;
    for (var d = 0; d < length_geometryVal - 1; d++) {
      //console.log(coordinateArray[d].geometry,"   of ...",d);
      if (coordinateArray[d].geometry == "GEOMETRYCOLLECTION EMPTY") {
        console.log("GEOMETRYCOLLECTION EMPTY Please check in Postgres");
      }
      else {
        //console.log("coordinateArray::",coordinateArray);
        featureTemp = format.readFeature(coordinateArray[d].geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326'
        });
      }
      try {
        totalDistance = totalDistance + featureTemp.getGeometry().getLength();
      }
      catch (e) {
        //console.log("test catch catch catch catch",d,featureTemp.getGeometry());
      }
      featuresCollection_t.push(featureTemp);
    }
  }
  //routeLayer.getSource().clear();
  if (appConfigInfo.mapData == "google") {
    //route_distance = feature.getGeometry().getLength();
    routeVector_line.getSource().addFeature(featuresCollection_g);
  } else {
    routeVector_line.getSource().addFeatures(featuresCollection_t);
  }
  routeLayer.getSource().addFeature(sourceMarker);
  routeLayer.getSource().addFeature(destinationMarker);

  /*// for track buffer in ICCC start
*/
  if (param.zoomToRoute == true) {
    mapObj.getView().fit(routeVector_line.getSource().getExtent(), mapObj.getSize());
    //mapObj.getView().fit(routeLayer.getSource().getExtent(), mapObj.getSize());
  }

  /*// for track buffer in ICCC end
  */
  if (param.callbackFunc != undefined) {
    //console.log("CreateLayer : callbackFunc");
    if (appConfigInfo.mapData == "google" && appConfigInfo.type == "google") {
      totalDistance = totalDistance + featuresCollection_g.getGeometry().getLength();
      //if (totalDistance < 1000) {
      var resETA = {};
      resETA.distance = {};
      resETA.distance.value = 0;
      resETA.distance.units = 'M';
      resETA.duration = {};
      resETA.duration.value = 0;
      resETA.duration.units = 'S';
      resETA.mapObj = mapObj;
      resETA.source = param.source;
      //console.log(ETA_legs);
      for (var x = 0; x < ETA_legs.length; x++) {
        resETA.distance.value = resETA.distance.value + ETA_legs[x].distance.value;
        resETA.duration.value = resETA.duration.value + ETA_legs[x].duration.value;
      }
      var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
      wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
      wktGeom = wktGeom.replace(/,/g, ", ");
      //console.log("CreateLayer:",resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      setTimeout(function () { callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress); }, 2000);
      // callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom, startPointAddress, endPointAddress);
    } else if (appConfigInfo.mapData == "google" && appConfigInfo.type == "esri") {
      const distanceValue = ETA_legs[0].distance.value;
      var resETA = {};
      resETA.mapObj = mapObj;
      resETA.source = param.source;
      resETA.distance = {};
      resETA.duration = {};

      resETA.duration.value = ETA_legs[0].duration.value;
      resETA.duration.units = ETA_legs[0].duration.units;


      if (ETA_legs[0].distance.units === 'KM') {
        resETA.distance.value = distanceValue * 1000;  // km to meters
        resETA.distance.units = 'M';
        resETA.duration.value = ETA_legs[0].duration.value * 60;
        resETA.duration.units = 'S';
      } else if (ETA_legs[0].distance.units === 'M') {

          if(appConfigInfo.graphHopperRoute === true){
            resETA.distance.value = distanceValue;
            resETA.distance.units = 'M';
            resETA.duration.value = ETA_legs[0].duration.value;
            resETA.duration.units = 'S';

          }else{
            resETA.distance.value = distanceValue;
            resETA.distance.units = 'M';
            resETA.duration.value = ETA_legs[0].duration.value * 60;
            resETA.duration.units = 'S';
          }
      } else {
        resETA.distance.value = distanceValue;
        resETA.distance.units = 'M';
        resETA.duration.value = ETA_legs[0].duration.value;
        resETA.duration.units = 'S';
      }


      setTimeout(function () { callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom); }, 2000);
    } else {

      var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
      wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
      wktGeom = wktGeom.replace(/,/g, ", ");
      totalDistance = totalDistance * 100000;
      if (totalDistance < 1000) {
        var resETA = {};
        resETA.distance = {};
        resETA.distance.value = totalDistance;
        resETA.distance.units = 'M';
        resETA.duration = {};
        resETA.duration.value = 'NA';
        resETA.duration.units = 'NA';
        // callbackFunc(resETA);
      } else {
        var temp = totalDistance / 1000;
        var resETA = {};
        resETA.distance = {};
        resETA.distance.value = temp;
        resETA.distance.units = 'KM';
        resETA.duration = {};
        resETA.duration.value = 'NA';
        resETA.duration.units = 'NA';

      }

      //ETA_legs = [{"start_address":startPointAddress,"end_address":endPointAddress}];
      //console.log("ETA_legs:------>>>>>>>>>>>>>>>",ETA_legs);
      //console.log("CreateLayer : callbackFunc :",resETA, cordStart, cordEnd, coordinateArray, ETA_legs,wktGeom);
      setTimeout(function () { callbackFunc(resETA, cordStart, cordEnd, coordinateArray, ETA_legs, wktGeom); }, 2000);
    }

  }
  var featurebuffer;
  if (param.getGeometry != undefined) {
    if (appConfigInfo.mapData === 'google') {


      var wktGeom = format.writeGeometry(featuresCollection_g.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
      wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
      wktGeom = wktGeom.replace(/,/g, ", ");
      function bufferRoute(roadbuffer) {
        getGeomCallback(roadbuffer);
      }
      tmpl.Route.buffer({ wktgeom: wktGeom, callBackFunc: bufferRoute });
      //Route Buffer 06-01-2020 ( ratheesh)

    }
    else {
      var wktGeom = format.writeGeometry(featuresCollection_t.getGeometry());
      var wktSource = format.writeGeometry(sourceMarker.getGeometry());
      var wktdestin = format.writeGeometry(destinationMarker.getGeometry());
      if (param.waypoints) {
        getGeomCallback({
          line: wktGeom,
          source: wktSource,
          destination: wktdestin,
          waypoints: wkt_fature_waypoint
        });
      } else {
        getGeomCallback({
          line: wktGeom,
          source: wktSource,
          destination: wktdestin
        });
      }
    }
  }
  else { }
}

tmpl.Route.buffer = function (param) {
  console.log(param);
  //var map = param.map;
  var wktGeom = param.wktgeom;
  var callBackFun = param.callBackFunc;
  // var urlL = appConfigInfo.connection.baseUrl + "getBufferPolygonArea";
  var url = window.location.protocol + '//' + window.location.hostname + "/EGISAPIService/apis/getBufferPolygonArea";
  //  var hcsURL="https://hcsjointstack.trinityiot.in/EGISAPIService/apis/getBufferPolygonArea"

  //global example

  //for local testing only not for global
  var urllocal = "http://localhost:8083/EGISAPIService/apis/getBufferPolygonArea";

  try {
    $.ajax({
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: url, //hcsURL,
      data: JSON.stringify({
        route: wktGeom, //LINESTRING(77.30293 12.435465, 77.72635468 12.6364554)
        buffer_meter: 0.0005//(param.radius)/100000//0.0002
      }),
      success: function (data) {
        console.log("buffer data ==========>", data)

        callBackFun(data);
      },
      error: function () {
        console.log("API Server Down ! there was an error!");
      }
    });
  }
  catch (err) {
    console.error("ERROR Trip.stop: ", err);
  }
}


function getGoogleRoute(param) {
  var waypoint_limit = 8;
  var wayptsExist = false;
  var wayPointFormat = param.wayPointFormat;
  if (param.waypoints) {
    var stops1 = param.waypoints;
    var temp = stops1;
    var stops = [];
    if (wayPointFormat == undefined) {
      stops = stops1;
    } else if (wayPointFormat == true) {

      for (var x = 0; x < stops1.length; x++) {
        console.log("WAYPOINTS FROM API+=========================>", temp);
        stops[x] = {};
        // var p1 = temp[x].split('(');
        // var p2 = p1[1].split(')');
        // var p3 = p2[0].split(' ');
        stops[x].lat = parseFloat(temp[x].lat);
        stops[x].lon = parseFloat(temp[0].lon);
      }

    }

    //console.log(stops)
    var wayptsExist = stops.length > 0;
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
  }
  var waypts = [];
  var itemsCounter = 0;
  var batches = [];
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer({
    preserveViewport: true
  });
  //var olGM2 = new olgm.OLGoogleMaps({
  //  map: mapObj
  //});
  // var gmap = olGM2.getGoogleMapsMap();
  // directionsDisplay.setMap(gmap);
  calculateRoute();

  function calculateRoute() {
    var start = new google.maps.LatLng(sourcePoint[1], sourcePoint[0]);
    var end = new google.maps.LatLng(destinationPoint[1], destinationPoint[0]);
    var tempval;
    if (wayptsExist) {
      for (var i = 0; i < waypoint_length; i++) {
        if (stops[i]) {
          tempval = new google.maps.LatLng(stops[i].lat, stops[i].lon);
          waypts.push({
            location: tempval,
            stopover: true
          });
        }
      }
    }
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    var cordStart = ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857');
    var cordEnd = ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857');
    var x1, y1, x2, y2, extent, temp;
    temp = bounds.toString();
    temp = temp.slice(2, -2);
    temp = temp.split("), (");
    x1 = parseFloat((temp[0].split(","))[0]);
    y1 = parseFloat((temp[0].split(","))[1]);
    x2 = parseFloat((temp[1].split(","))[0]);
    y2 = parseFloat((temp[1].split(","))[1]);
    extent = [y1, x1, y2, x2];
    var method = 'DRIVING';
    var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      // travelMode: google.maps.TravelMode.DRIVING
      //travelMode: google.maps.DirectionsTravelMode.DRIVING
      travelMode: google.maps.TravelMode[method]
    };
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var polyline = new google.maps.Polyline({
          path: [],
          strokeColor: '#0000FF',
          strokeWeight: 3
        });
        var legs = response.routes[0].legs;
        for (i = 0; i < legs.length; i++) {
          var steps = legs[i].steps;
          for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (k = 0; k < nextSegment.length; k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }
        }
        var ETA_legs = legs;
        var pathObj = polyline.getPath().getArray();
        var coordinateArray = [];
        for (var i = 0, length = pathObj.length; i < length; i++) {
          var po = pathObj[i].toString().slice(1, -1);
          var latVal = po.split(",")[0];
          var lonVal = po.split(",")[1];
          var coordinate = ol.proj.transform([parseFloat(lonVal), parseFloat(latVal)], 'EPSG:4326', 'EPSG:3857');
          coordinateArray.push(coordinate);
        }
        CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
      } else {
        console.log("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    })
  }
}

function getTrinityRouteold(param) {
  // Latest Update Detail
  // route v 2.5.008  dated 01 Dec 2016 Mr J   // wayp tr rou 
  var mapoo = param.map;
  var source = param.source;

  var destination = param.destination;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var onClickCallback = param.onClickCallback;
  var stops;
  var waypoint_limit = 8;
  var wayptsExist = false;
  if (param.waypoints) {
    stops = param.waypoints;
    var wayptsExist = stops.length > 0;
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
  }
  var waypts = [];
  var itemsCounter = 0;
  var batches = [];

  function routeresult(data) {
    //console.log("data:  " + data);
    var prop1 = {};
    var layerName = 'Rout_lyr';
    var datalength = data.length;
    var Detail_flag_ip = false;
    if (Detail_flag_ip) { }
    CreateLayer(param, source, destination, data, '');
  }
  if (wayptsExist) {
    shortestroute_ten(mapoo, source, destination, false, sourceIcon, destinationIcon, stops);
  } else {
    shortestroute_nine(mapoo, source, destination, false, sourceIcon, destinationIcon);
  }

  function shortestroute_nine(mapo, a, b, fastvalue, sourceIcon, destinationIcon) {
    var lon1 = a[0];
    var lat1 = a[1];
    var lon2 = b[0];
    var lat2 = b[1];
    var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/xmling/short_route/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + " ";
    //console.log("URL :" + url2);

    function failedfun() {
      console.log("FAIL: FROM SERVER  :" + url2);
    }
    routeresult.mapo = mapo;
    $.ajax({
      type: "GET",
      dataType: "json",
      //headers:{ 'Access-Control-Allow-Origin':'*'},
      //    async: false,
      //   crossDomain: true,
      url: url2,
      success: routeresult,
    });
  }

  function shortestroute_ten(mapo, a, b, fastvalue, sourceIcon, destinationIcon, stops) {
    var lon1 = a[0];
    var lat1 = a[1];
    var lon2 = b[0];
    var lat2 = b[1];
    var stops_toserver = stops;
    //delete stops_toserver.test.key1;
    var temp_stop = []
    for (var k = 0; k < stops_toserver.length; k++) {
      temp_stop[k] = {};
      temp_stop[k].Latitude = stops_toserver[k].lat;
      temp_stop[k].Longitude = stops_toserver[k].lon;
      delete stops_toserver[k].Icon;
    }

    var jsonString = JSON.stringify(temp_stop);
    //console.log("Icon deleted:" + jsonString);
    var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/route/shortest_waypoint_route/true/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + "/" + jsonString + " ";
    //console.log("URL :" + url2);

    function failedfun() {
      console.log("FAIL: FROM SERVER  :" + url2);
    }
    routeresult.mapo = mapo;
    $.ajax({
      type: "GET",
      dataType: "json",
      //headers:{'Access-Control-Allow-Origin':'*' },
      //       async: false,
      //   crossDomain: true,
      url: url2,
      success: routeresult,
    });
  }
}
tmpl.Route.RouteResult = function (getdata) {
  // Latest Update Detail
  // route v 2.5.003  dated 23 nov 2016 Mr J
  var lato, lono, plato = 0,
    plono = 0;
  var path = [];
  for (var m = 0; m < getdata.length - 1; m++) {
    lato = getdata[m].lat;
    lono = getdata[m].lon;
    if (lato == plato && lono == plono) { } else {
      path.push([lato, lono]);
      plato = lato;
      plono = lono;
    }
  }
  //console.log("rs added :", path.length);
  return path;
}

tmpl.Route.directionsService = function (request, myCallBack) {

  var a = request.source;
  var b = request.destination;
  var lon1 = a[0];
  var lat1 = a[1];
  var lon2 = b[0];
  var lat2 = b[1];
  var url2 = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/route/shortest_polyline_route/false/" + lon1 + "/" + lat1 + "/" + lon2 + "/" + lat2 + " ";

  function resultingfunction(data) {
    myCallBack(data);
  }

  function erroringfunction() {
    myCallBack('NOTOK');
    console.error("No result :" + url2);
  }
  $.ajax({
    type: "GET",
    url: url2,
    success: resultingfunction,
    error: erroringfunction
  });
}

tmpl.Route.mergeLine = function (param) {
  //var map = param.map;
  var wktGeom = param.lines;
  var callBackFun = param.callBackFunc;
  var temp = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/ps/makeLine/";
  var urlL = appConfigInfo.connection.baseUrl + "makeLine";
  try {
    var settings = {
      "url": window.location.protocol + '//' + window.location.hostname + "/EGISAPIService/apis/makeLine",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify(wktGeom),
    };

    $.ajax(settings).done(function (response) {
      callBackFun(response);
    });

  }
  catch (err) {
    console.error("ERROR mergeLine: ", err);
  }
}

function getTrinityMapsRoute(param) {
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var callbackFunc = param.callbackFunc;
  var getGeomCallback = param.getGeometry;
  var route_width = param.route_width;
  var stops1 = param.waypoints;
  var stopsIcon = param.waypointsIcon;
  var wayptArray = [];
  var routeUrl = null;
  var noLayer_waypoint = false;
  var format = new ol.format.WKT();


  function getRoute(token) {
    var settings = {
      "url": appConfigInfo.mmi_route + token + "/route_adv/driving/" + sourcePoint + ';' + destinationPoint + '?steps=false&rtype=1',
      "method": "GET",

    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      var encoded = response.routes[0].geometry;
      console.log("================encoded", encoded)


      var arr = decode_path(encoded);
      console.log("=====================", arr)


      var wktGeom = "LINESTRING(";
      var k = 0;
      while (k < arr.length) {
        if (k == arr.length - 1) {
          wktGeom += arr[k][1] + " " + arr[k][0];
        }
        else {
          wktGeom += arr[k][1] + " " + arr[k][0] + ",";
        }
        k++;
      }
      wktGeom += ")";
      console.log("final data", wktGeom);

      var srcIconStyle = new ol.style.Icon(({
        src: sourceIcon,
        anchor: [0.5, 1],
        scale: 1.0
      }));
      var destIconStyle = new ol.style.Icon(({
        src: destinationIcon,
        anchor: [0.5, 1],
        scale: 1.0
      }));

      var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857'));
      var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857'));

      var srcfeatureVal = new ol.Feature({
        geometry: srcGeom
      });
      var destfeatureVal = new ol.Feature({
        geometry: destGeom
      });

      srcfeatureVal.setStyle(new ol.style.Style({
        image: srcIconStyle,
      }));
      destfeatureVal.setStyle(new ol.style.Style({
        image: destIconStyle,
      }));

      srcfeatureVal.set('layer_name', 'RouteSPoint');
      destfeatureVal.set('layer_name', 'RouteDPoint');

      try {
        mapObj.getLayers().forEach(function (layer) {

          if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
            mapObj.removeLayer(layer);
          } else {

            console.log("No Layer Available..!");
          }
        });
      } catch (e) { console.log("Layer Not Available..!"); }

      var src = new ol.source.Vector({
        features: [srcfeatureVal]
      });
      var dest = new ol.source.Vector({
        features: [destfeatureVal]
      });

      var srcOverlay = new ol.layer.Vector({
        title: "RouteSPoint",
        visible: true,
        source: src
      });
      var destOverlay = new ol.layer.Vector({
        title: "RouteDPoint",
        visible: true,
        source: dest
      });

      mapObj.addLayer(srcOverlay);
      srcOverlay.set('name', 'RouteSPoint');
      mapObj.addLayer(destOverlay);
      destOverlay.set('name', 'RouteDPoint');


      var format = new ol.format.WKT();
      var feature = format.readFeature(wktGeom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      var wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
      wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
      wktGeom = wktGeom.replace(/,/g, ", ");

      function bufferRoute(roadbuffer) {
        console.log("roadbuffer---->", roadbuffer);
        getGeomCallback(roadbuffer);
      }

      // console.log("CreateLayer:",wktGeom,result);
      var resETA = {};
      resETA.distance = {};
      resETA.distance.value = 0;
      resETA.distance.units = 'M';
      resETA.duration = {};
      resETA.duration.value = 0;
      resETA.duration.units = 'S';
      resETA.distance.value = response.routes[0].distance;
      resETA.duration.value = response.routes[0].duration;
      var startPointAddress = "NA"
      var endPointAddress = "NA"
      var ETA_legs = null;
      console.log("callbackFunc::", resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      setTimeout(function () {
        callbackFunc(resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      }, 2000);

      var r_w = null;
      if (route_width != undefined) {
        r_w = route_width;
      }
      else {
        r_w = 5;
      }

      feature.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: r_w
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#1b465a'
          })
        }),

      }));


      var source = new ol.source.Vector({
        features: [feature]
      });

      var newLayer = new ol.layer.Vector({
        title: "RouteLayer",
        visible: true,
        source: source
      });

      mapObj.addLayer(newLayer);
      newLayer.set('name', 'RouteLayer');
    });

  }

  tmpl.Utils.getTrinityToken({
    callbackFunc: function (accessToken) {
      getRoute(accessToken.data.access_token)
    }
  });


}



function getMMIMapsRoute(param) {
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var callbackFunc = param.callbackFunc;
  var getGeomCallback = param.getGeometry;
  var route_width = param.route_width;
  var stops1 = param.waypoints;
  var stopsIcon = param.waypointsIcon;
  var wayptArray = [];
  var routeUrl = null;
  var noLayer_waypoint = false;
  var format = new ol.format.WKT();

  function getAccessToken(callback) {
    var tokenApi = {
      url: appConfigInfo.mmi_tokenurl + appConfigInfo.mmi_clientid + "&client_secret=" + appConfigInfo.mmi_clientsecret,
      method: "POST",
      timeout: 0,
      data: {
        grant_type: "client_credentials",
        client_id: appConfigInfo.mmi_clientid,
        client_secret: appConfigInfo.mmi_clientsecret,
      }
    };

    $.ajax(tokenApi).done(function (responce) {
      var accessTokenCode = responce.access_token;
      console.log("Access token is", accessTokenCode);
      callback(accessTokenCode);
    });
  }

  function getRoute(token) {
    var settings = {
      "url": appConfigInfo.mmiRoute + token + "/route_adv//driving/" + sourcePoint + ';' + destinationPoint,
      "method": "GET",
      "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      var encoded = response['routes'][0]['geometry'];
      console.log("================encoded", encoded)

      var arr = decode_path(encoded);
      console.log("=====================", arr)

      var wktGeom = "LINESTRING(";
      var k = 0;
      while (k < arr.length) {
        if (k == arr.length - 1) {
          wktGeom += arr[k][1] + " " + arr[k][0];
        }
        else {
          wktGeom += arr[k][1] + " " + arr[k][0] + ",";
        }
        k++;
      }
      wktGeom += ")";
      console.log("final data", wktGeom);

      var srcIconStyle = new ol.style.Icon(({
        src: sourceIcon,
        anchor: [0.5, 1],
        scale: 1.0
      }));
      var destIconStyle = new ol.style.Icon(({
        src: destinationIcon,
        anchor: [0.5, 1],
        scale: 1.0
      }));

      var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:3857'));
      var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:3857'));

      var srcfeatureVal = new ol.Feature({
        geometry: srcGeom
      });
      var destfeatureVal = new ol.Feature({
        geometry: destGeom
      });

      srcfeatureVal.setStyle(new ol.style.Style({
        image: srcIconStyle,
      }));
      destfeatureVal.setStyle(new ol.style.Style({
        image: destIconStyle,
      }));

      srcfeatureVal.set('layer_name', 'RouteSPoint');
      destfeatureVal.set('layer_name', 'RouteDPoint');

      try {
        mapObj.getLayers().forEach(function (layer) {

          if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
            mapObj.removeLayer(layer);
          } else {

            console.log("No Layer Available..!");
          }
        });
      } catch (e) { console.log("Layer Not Available..!"); }

      var src = new ol.source.Vector({
        features: [srcfeatureVal]
      });
      var dest = new ol.source.Vector({
        features: [destfeatureVal]
      });

      var srcOverlay = new ol.layer.Vector({
        title: "RouteSPoint",
        visible: true,
        source: src
      });
      var destOverlay = new ol.layer.Vector({
        title: "RouteDPoint",
        visible: true,
        source: dest
      });

      mapObj.addLayer(srcOverlay);
      srcOverlay.set('name', 'RouteSPoint');
      mapObj.addLayer(destOverlay);
      destOverlay.set('name', 'RouteDPoint');


      var format = new ol.format.WKT();
      var feature = format.readFeature(wktGeom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      var wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
      wktGeom = wktGeom.replace("LINESTRING", "LINESTRING ");
      wktGeom = wktGeom.replace(/,/g, ", ");

      function bufferRoute(roadbuffer) {
        console.log("roadbuffer---->", roadbuffer);
        getGeomCallback(roadbuffer);
      }

      // console.log("CreateLayer:",wktGeom,result);
      var resETA = {};
      resETA.distance = {};
      resETA.distance.value = 0;
      resETA.distance.units = 'M';
      resETA.duration = {};
      resETA.duration.value = 0;
      resETA.duration.units = 'S';
      resETA.distance.value = response['routes'][0]['distance'];
      resETA.duration.value = response['routes'][0]['duration'];
      var startPointAddress = "NA"
      var endPointAddress = "NA"
      var ETA_legs = null;
      console.log("callbackFunc::", resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      setTimeout(function () {
        callbackFunc(resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      }, 2000);

      var r_w = null;
      if (route_width != undefined) {
        r_w = route_width;
      }
      else {
        r_w = 5;
      }

      feature.setStyle(new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: r_w
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#1b465a'
          })
        }),

      }));



      var source = new ol.source.Vector({
        features: [feature]
      });

      var newLayer = new ol.layer.Vector({
        title: "RouteLayer",
        visible: true,
        source: source
      });

      mapObj.addLayer(newLayer);
      newLayer.set('name', 'RouteLayer');

    });
  }
  getAccessToken(function (accesToken) {
    console.log("Access Token: :", accesToken)
    getRoute(accesToken);
  })
}

function decode_path(encoded) {
  encoded = unescape(encoded).replace(/\\\\/g, '\\');
  var points = [];
  var index = 0, len = encoded.length, lat = 0, lng = 0;

  while (index < len) {
    var b, shift = 0, result = 0;

    // Decode latitude
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    var dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    // Reset variables for decoding longitude
    shift = 0;
    result = 0;

    // Decode longitude
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 31) << shift;
      shift += 5;
    } while (b >= 32);
    var dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    // Add the decoded point to the 'points' array (in EPSG:4326 format)
    points.push([lat / 100000, lng / 100000]);
  }

  return points;
}


function getSGLRoute(param) {

  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var callbackFunc = param.callbackFunc;
  var getGeomCallback = param.getGeometry;
  var route_width = param.route_width;
  var stops1 = param.waypoints;
  var stopsIcon = param.waypointsIcon;
  var wayptArray = [];
  var routeUrl = null;
  var noLayer_waypoint = false;
  var format = new ol.format.WKT();

  var sourceLat;
  var sourceLon;
  var destinationLat;
  var destinationLon;

  try {
    mapObj.getLayers().forEach(function (layer) {

      if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
        mapObj.removeLayer(layer);
      } else {
        console.log("No Layer Available..!");
      }
    });
  } catch (e) {
    console.log("Layer Not Available..!");
  }

  if (param.waypoints) {
    var fature_waypoint;
    var waypointFeatures = [];
    var temp = stops1;
    var stops = [];
    if (wayPointFormat == undefined) {
      stops = stops1;
    } else if (wayPointFormat == true) {
      for (var x = 0; x < stops1.length; x++) {
        stops[x] = {};
        stops[x].lat = parseFloat(temp[x].lat);
        stops[x].lon = parseFloat(temp[x].lon);
      }
    }
    var stopsIcon = param.waypointsIcon;
    var wayptsExist = stops.length > 0;
    var waypoint_value;
    var tempwaypointStyle, waypointStyle, wkt_fature_waypoint = [];
    var globalwaypointStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: stopsIcon,
        anchor: [0.5, 1]
      })
    });
    var waypoint_limit = 8;
    var waypoint_length = (stops.length) > waypoint_limit ? waypoint_limit : stops.length;
    if ((stops.length) >= waypoint_limit) {
      console.log("CreateLayer : exceeded way point input length : " + stops.length + " Max Limit=" + waypoint_limit);
    }
    for (var t = 0; t < waypoint_length; t++) {
      try {
        if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "hereMaps" || appConfigInfo.mapData == "sgl") {
          waypoint_value = ol.proj.transform([parseFloat(stops[t].lon), parseFloat(stops[t].lat)], 'EPSG:4326', 'EPSG:3857');
        } else {
          waypoint_value = [parseFloat(stops[t].lon), parseFloat(stops[t].lat)];
        }
        if (stops[t].Icon != undefined) {
          tempwaypointStyle = new ol.style.Style({
            image: new ol.style.Icon({
              src: stops[t].Icon,
              anchor: [0.5, 1]
            })
          });
          waypointStyle = tempwaypointStyle;
        } else {
          waypointStyle = globalwaypointStyle;
        }
        fature_waypoint = new ol.Feature({
          geometry: new ol.geom.Point(waypoint_value)
        });
        var wayPointIdTemp = "route_waypoint" + (t + 1);
        fature_waypoint.set('id', wayPointIdTemp);
        fature_waypoint.setStyle(waypointStyle);
        if (param.waypoints && param.getGeometry) {
          wkt_fature_waypoint.push(format.writeGeometry(fature_waypoint.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326')));

        }
        waypointFeatures.push(fature_waypoint);
      } catch (er) {
        console.error("please check your waypoint input: " + er);
      }
    }
  }
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer.get('lname') === 'routeVector_waypoint') {
      noLayer_waypoint = true;
      routeLayer_waypoint = existingLayer;
      //routeLayer_waypoint.getSource().clear();
    }
  }
  if (wayptsExist) {
    if (!noLayer_waypoint) {
      routeLayer_waypoint = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: waypointFeatures
        }),
        title: 'Draw_Route_Layer',
      });
      routeLayer_waypoint.setProperties({
        lname: "routeVector_waypoint"
      });
      mapObj.addLayer(routeLayer_waypoint);
    } else {
      try {
        routeLayer_waypoint.getSource().clear();
        routeLayer_waypoint.getSource().addFeatures(waypointFeatures);
      } catch (er) {
        console.error("Adding Waypoints Marker Isssue: " + er);
      }
    }
  }


  function transformWKT(lon, lat) {
    return new Promise((resolve, reject) => {
      var settings = {
        "url": appConfigInfo.sgl_transformwk,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + appConfigInfo.sgl_access_token,
        },
        "data": JSON.stringify({
          "WKTGeometry": "POINT(" + lon + " " + lat + ")",
          "SridOfGeometry": appConfigInfo.sgl_SridOfGeometry,
          "OutputSrid": appConfigInfo.sgl_OutputSrid,
          "OutputOptions": appConfigInfo.sgl_OutputOptions
        }),
      };

      $.ajax(settings).done(function (response) {
        const geometryStr = response[0].geometry;
        const matches = geometryStr.match(/POINT\((\d+\.\d+) (\d+\.\d+)\)/);

        if (matches) {
          const lon = parseFloat(matches[1]);
          const lat = parseFloat(matches[2]);
          resolve({ lat, lon });
        } else {
          reject("Invalid geometry string format.");
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        reject(errorThrown);
      });
    });
  }


  async function getCoordinates() {
    try {
      const sourceResult = await transformWKT(sourcePoint[0], sourcePoint[1]);
      sourceLat = sourceResult.lat;
      sourceLon = sourceResult.lon;
      console.log("Source Latitude:", sourceLat);
      console.log("Source Longitude:", sourceLon);

      const destinationResult = await transformWKT(destinationPoint[0], destinationPoint[1]);
      destinationLat = destinationResult.lat;
      destinationLon = destinationResult.lon;
      console.log("Destination Latitude:", destinationLat);
      console.log("Destination Longitude:", destinationLon);

      var settings = {
        "url": appConfigInfo.sgl_route,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + appConfigInfo.sgl_access_token,
        },

        "data": JSON.stringify({
          "layername": "road_network",
          "NumOfRoute": appConfigInfo.sgl_NumOfRoute,
          "point_coordinate_array": {
            "loc1": [
              sourceLon,
              sourceLat
            ],
            "loc2": [
              destinationLon,
              destinationLat

            ]
          },
          "srid": appConfigInfo.sgl_srid,
        }),
      };

      $.ajax(settings).done(function (response) {
        console.log("----------------------------------------------->", response);

        function extractCoordinates(data) {
          const multiLineCoordinates = [];
          data.features.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type === "MultiLineString") {
              geometry.coordinates.forEach(line => {
                multiLineCoordinates.push(line);
              });
            }
          });
          return multiLineCoordinates;
        }

        const extractedCoordinates = extractCoordinates(response);
        console.log(extractedCoordinates);


        function coordinatesToWktGeom(multiLineCoordinates) {
          var wktGeom = "MULTILINESTRING(";

          for (let i = 0; i < multiLineCoordinates.length; i++) {
            const line = multiLineCoordinates[i];
            wktGeom += "(";
            for (let j = 0; j < line.length; j++) {
              const point = line[j];
              wktGeom += point[0] + " " + point[1];
              if (j < line.length - 1) wktGeom += ",";
            }
            wktGeom += ")";
            if (i < multiLineCoordinates.length - 1) wktGeom += ",";
          }

          wktGeom += ")";
          return wktGeom;
        }


        const coordinates = extractedCoordinates;
        var wktGeom = coordinatesToWktGeom(coordinates);
        console.log(wktGeom);



        var srcIconStyle = new ol.style.Icon(({
          src: sourceIcon,
          anchor: [0.5, 1],
          scale: 1.0
        }));
        var destIconStyle = new ol.style.Icon(({
          src: destinationIcon,
          anchor: [0.5, 1],
          scale: 1.0
        }));

        var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourceLon), parseFloat(sourceLat)], 'EPSG:4326', 'EPSG:3857'));
        var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationLon), parseFloat(destinationLat)], 'EPSG:4326', 'EPSG:3857'));

        var srcfeatureVal = new ol.Feature({
          geometry: srcGeom
        });
        var destfeatureVal = new ol.Feature({
          geometry: destGeom
        });

        srcfeatureVal.setStyle(new ol.style.Style({
          image: srcIconStyle,
        }));
        destfeatureVal.setStyle(new ol.style.Style({
          image: destIconStyle,
        }));

        srcfeatureVal.set('layer_name', 'RouteSPoint');
        destfeatureVal.set('layer_name', 'RouteDPoint');

        try {
          mapObj.getLayers().forEach(function (layer) {

            if (layer.get('name') != undefined & layer.get('name') === 'RouteSPoint' || layer.get('name') === 'RouteDPoint' || layer.get('name') === 'RouteLayer') {
              mapObj.removeLayer(layer);
            } else {

              console.log("No Layer Available..!");
            }
          });
        } catch (e) { console.log("Layer Not Available..!"); }

        var src = new ol.source.Vector({
          features: [srcfeatureVal]
        });
        var dest = new ol.source.Vector({
          features: [destfeatureVal]
        });

        var srcOverlay = new ol.layer.Vector({
          title: "RouteSPoint",
          visible: true,
          source: src
        });
        var destOverlay = new ol.layer.Vector({
          title: "RouteDPoint",
          visible: true,
          source: dest
        });

        mapObj.addLayer(srcOverlay);
        srcOverlay.set('name', 'RouteSPoint');
        mapObj.addLayer(destOverlay);
        destOverlay.set('name', 'RouteDPoint');


        var format = new ol.format.WKT();
        var feature = format.readFeature(wktGeom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        var wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
        wktGeom = wktGeom.replace("MULTILINESTRING", "MULTILINESTRING ");
        wktGeom = wktGeom.replace(/,/g, ", ");

        function bufferRoute(roadbuffer) {
          console.log("roadbuffer---->", roadbuffer);
          getGeomCallback(roadbuffer);
        }

        // console.log("CreateLayer:",wktGeom,result);
        var resETA = {};
        resETA.distance = {};
        resETA.distance.value = 0;
        resETA.distance.units = 'M';
        resETA.duration = {};
        resETA.duration.value = 0;
        resETA.duration.units = 'S';
        resETA.distance.value = response.features[0].properties.path_length;
        resETA.duration.value = "NA";
        var startPointAddress = "NA";
        var endPointAddress = "NA";
        var ETA_legs = null;
        console.log("callbackFunc::", resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
        setTimeout(function () {
          callbackFunc(resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
        }, 2000);


        var r_w = null;
        if (route_width != undefined) {
          r_w = route_width;
        }
        else {
          r_w = 5;
        }

        feature.setStyle(new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: r_w
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#1b465a'
            })
          }),

        }));
        var source = new ol.source.Vector({
          features: [feature]
        });

        var newLayer = new ol.layer.Vector({
          title: "RouteLayer",
          visible: true,
          source: source
        });

        mapObj.addLayer(newLayer);
        newLayer.set('name', 'RouteLayer');
      });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
  getCoordinates();
}


function getOSMRoute(param) {
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var waypoints = param.waypoints || [];
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var waypointsIcon = param.waypointsIcon;
  var callbackFunc = param.callbackFunc;
  var routeWidth = param.route_width || 5;
  var routeColor = param.routeColor || "blue";
  var getGeomCallback = param.getGeometry;


  var waypointsString = waypoints.map(poi => `${poi.lon},${poi.lat}`).join(';');


  var routeUrl = appConfigInfo.osm_route + sourcePoint[0] + "," + sourcePoint[1] + ";" + waypointsString + (waypointsString ? ";" : "") + destinationPoint[0] + "," + destinationPoint[1] + "?overview=full&geometries=polyline";

  $.ajax({
    url: routeUrl,
    method: "GET",
    success: function (response) {
      if (response.code !== "Ok") {
        console.error("Error fetching route:", response);
        return callbackFunc({ status: false, message: "OSM Routing API Error" });
      }
      var encodedPolyline = response.routes[0].geometry;
      var decodedPath = decode_path(encodedPolyline);
      var wktGeom = "LINESTRING(";
      for (var i = 0; i < decodedPath.length; i++) {
        var point = decodedPath[i];
        wktGeom += `${point[1]} ${point[0]}`;
        if (i < decodedPath.length - 1) {
          wktGeom += ", ";
        }
      }
      wktGeom += ")";
      //console.log("WKT Geometry:", wktGeom);


      var srcIconStyle = new ol.style.Icon({ src: sourceIcon, anchor: [0.5, 1], scale: 1.0 });
      var destIconStyle = new ol.style.Icon({ src: destinationIcon, anchor: [0.5, 1], scale: 1.0 });
      var waypointIconStyle = new ol.style.Icon({ src: waypointsIcon, anchor: [0.5, 1], scale: 1.0 });

      var srcFeature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.transform(sourcePoint, 'EPSG:4326', 'EPSG:3857')) });
      var destFeature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.transform(destinationPoint, 'EPSG:4326', 'EPSG:3857')) });
      srcFeature.setStyle(new ol.style.Style({ image: srcIconStyle }));
      destFeature.setStyle(new ol.style.Style({ image: destIconStyle }));

      var waypointFeatures = waypoints.map(poi => {
        var feature = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.transform([poi.lon, poi.lat], 'EPSG:4326', 'EPSG:3857')) });
        feature.setStyle(new ol.style.Style({ image: waypointIconStyle }));
        return feature;
      });


      var vectorSource = new ol.source.Vector({ features: [srcFeature, destFeature, ...waypointFeatures] });
      var vectorLayer = new ol.layer.Vector({ source: vectorSource });

      mapObj.addLayer(vectorLayer);


      var format = new ol.format.WKT();
      var feature = format.readFeature(wktGeom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });

      feature.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({ color: routeColor, width: routeWidth })
      }));

      var routeSource = new ol.source.Vector({ features: [feature] });
      var routeLayer = new ol.layer.Vector({ source: routeSource });

      mapObj.addLayer(routeLayer);

      var routeDetails = response.routes[0];

      // console.log("CreateLayer:",wktGeom,result);
      var resETA = {};
      resETA.distance = {};
      resETA.distance.value = 0;
      resETA.distance.units = 'M';
      resETA.duration = {};
      resETA.duration.value = 0;
      resETA.duration.units = 'S';
      resETA.distance.value = routeDetails.distance;
      resETA.duration.value = routeDetails.duration;
      var startPointAddress = "NA"
      var endPointAddress = "NA"
      var ETA_legs = null;
      console.log("callbackFunc::", resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      setTimeout(function () {
        callbackFunc(resETA, sourcePoint, destinationPoint, null, ETA_legs, wktGeom, startPointAddress, endPointAddress);
      }, 2000);

      callbackFunc(resETA, sourcePoint, destinationPoint, waypoints, null, wktGeom);
    },
    error: function (err) {
      console.error("Error fetching route from OSM API:", err);
      callbackFunc({ status: false, message: "OSM Routing API Error" });
    }
  });

}

function getEsriRoute(param) {
  console.log("ESRI Route:", param);
  var stops = null;
  var cordStart, cordEnd, coordinateArray, ETA_legs;
  cordStart = param.source;
  cordEnd = param.destination;
  var satationId = param.stationId || null;
  var vehicle = param.vehicle || "car";

  // Check if token is required (assuming appConfigInfo has a flag like requiresToken)
  var requiresToken = appConfigInfo.esriRoutingToken !== undefined ? appConfigInfo.esriRoutingToken : true;
   var graphHopperRoute = appConfigInfo.graphHopperRoute !== undefined ? appConfigInfo.graphHopperRoute : false;


  if (graphHopperRoute) {
        // If GraphHopper is enabled, use its routing API
    var settings = {
      
      "url": window.location.origin +"/EGISAPIService/apis/matrix",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json",
        "Cookie": "INGRESSCOOKIE=1745330834.171.228168.682880|d66c25fde433a459c7ec37dff4b64737; Path=/"
      },
      "data": JSON.stringify({
        "fromPoints": [
          {
            "lat": param.source[1],
            "lon": param.source[0]
          }
        ],
        "toPoints": [
          {
            "lat": param.destination[1],
            "lon": param.destination[0],
            "id": satationId
          }
        ],
        "vehicle": vehicle,
      }),
    };
    $.ajax(settings).done(function (response) {
      try{
        console.log("No WayPoints", response);
        if (!response || !response.routes) {

          throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
        }
        console.log("GraphHopper Response:", response);
        var routeResult = response.routes[0].points
        var time =  response.routes[0].time_seconds;
        var distance =response.routes[0].distance_km*1000; // Convert km to meters
        ETA_legs = [{
          distance: { value: distance, units: 'M' },
          duration: { value: time, units: 'S' }
        }];
        var coordinateArray = routeResult.map(point => [point.lon, point.lat]);
        CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);


      }catch(e){
          console.warn("Error processing response:", error.message);
          var routeResult = undefined;
          var attributes = undefined;
          var distance = undefined;
          var time = undefined;
          var disUnits = undefined;
          ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
          }];
          coordinateArray = undefined;
          CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);

          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX request failed:", textStatus, errorThrown);
          console.error("Status Code:", jqXHR.status);
          console.error("Response Text:", jqXHR.responseText);
            var routeResult = undefined;
          var attributes = undefined;
          var distance = undefined;
          var time = undefined;
          var disUnits = undefined;
          ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
          }];
          coordinateArray = undefined;
          CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
          
        })
        .always(function () {
          console.log("AJAX request completed");
        });

  }else{
    if (requiresToken) {
      var form = new FormData();
      form.append("client_id", appConfigInfo.esriClientId);
      form.append("client_secret", appConfigInfo.esriClientSecret);
      form.append("grant_type", "client_credentials");
      form.append("f", "Json");
  
      var settings = {
        "url": appConfigInfo.esriRoutingTokenURL,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };
  
      $.ajax(settings).done(function (response) {
        console.log(response.access_token);
  
        var obj = JSON.parse(response);
        const accessToken = obj.access_token;
        if (accessToken != null) {
          let form = new FormData();
          stops = param.source[0] + ',' + param.source[1] + ';' + param.destination[0] + ',' + param.destination[1];
  
          form.append("stops", stops);
          form.append("token", accessToken);
          form.append("f", "Json");
  
          var settings = {
            "url": appConfigInfo.esriRouting,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            dataType: "json"
          };
  
          // $.ajax(settings).done(function (response) {
          //   console.log("No WayPoints", response);
          //   var routeResult = response.routes.features[0].geometry.paths[0];
          //   var attributes = response.routes.features[0].attributes;
          //   var distance = attributes.Total_Kilometers ? attributes.Total_Kilometers : (attributes.Total_Meters ? attributes.Total_Meters : 0);
          //   var time = attributes.Total_Kilometers ? attributes.Total_TravelTime : (attributes.Total_Meters ? attributes.Total_Minutes : 0);
          //   var disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
          //   ETA_legs = [{
          //     distance: { value: distance, units: disUnits },
          //     duration: { value: time, units: 'M' }
          //   }];
          //   console.log(routeResult);
          //   coordinateArray = routeResult;
          //   CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
          // });

          $.ajax(settings)
          .done(function (response) {
            try {
              console.log("No WayPoints", response);
              if (!response || !response.routes || !response.routes.features || !response.routes.features.length ||
                  !response.routes.features[0].geometry || !response.routes.features[0].geometry.paths ||
                  !response.routes.features[0].geometry.paths.length) {
                throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
              }
              const routeResult = response.routes.features[0].geometry.paths[0];
              const attributes = response.routes.features[0].attributes || {};
              const distance = attributes.Total_Kilometers || attributes.Total_Meters || 0;
              const disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
              const time = attributes.Total_TravelTime || attributes.Total_Minutes || 0; 
              const ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];

              console.log(routeResult);
              coordinateArray = routeResult;
              CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
            } catch (error) {
              console.warn("Error processing response:", error.message);
               var routeResult = undefined;
              var attributes = undefined;
              var distance = undefined;
              var time = undefined;
              var disUnits = undefined;
              ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];
              coordinateArray = undefined;
              CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", textStatus, errorThrown);
            console.error("Status Code:", jqXHR.status);
            console.error("Response Text:", jqXHR.responseText);
          })
          .always(function () {
            console.log("AJAX request completed");
          });
        }
      });
    } else {
      // Direct call to routing API without token
      let form = new FormData();
      stops = param.source[0] + ',' + param.source[1] + ';' + param.destination[0] + ',' + param.destination[1];
  
      form.append("stops", stops);
      form.append("f", "Json");
      form.append("outSR", appConfigInfo.esriProjection);
  
  
      var settings = {
        "url": appConfigInfo.esriRouting,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        dataType: "json"
      };
  
      $.ajax(settings).done(function (response) {

        try {
        console.log("No WayPoints", response);
        if (!response || !response.routes || !response.routes.features || !response.routes.features.length ||
            !response.routes.features[0].geometry || !response.routes.features[0].geometry.paths ||
            !response.routes.features[0].geometry.paths.length) {
        throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
        }

        console.log("No WayPoints (No Token)", response);
        var routeResult = response.routes.features[0].geometry.paths[0];
        var attributes = response.routes.features[0].attributes;
        var distance = attributes.Total_Kilometers ? attributes.Total_Kilometers : (attributes.Total_Meters ? attributes.Total_Meters : 0);
        var time = attributes.Total_Kilometers ? attributes.Total_TravelTime : (attributes.Total_Meters ? attributes.Total_Minutes : 0);
        var disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
        ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
        }];
        console.log(routeResult);
        coordinateArray = routeResult;
        CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
        } catch (error) {
              console.warn("Error processing response:", error.message);
               var routeResult = undefined;
              var attributes = undefined;
              var distance = undefined;
              var time = undefined;
              var disUnits = undefined;
              ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];
              coordinateArray = undefined;
              CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", textStatus, errorThrown);
            console.error("Status Code:", jqXHR.status);
            console.error("Response Text:", jqXHR.responseText);
          })
          .always(function () {
            console.log("AJAX request completed");
        });
    }
  }

}




function getPentaBRoute(param) {
  var mapObj = param.map;
  var sourcePoint = param.source;
  var destinationPoint = param.destination;
  var wayPointFormat = param.wayPointFormat;
  var sourceIcon = param.sourceIcon;
  var destinationIcon = param.destinationIcon;
  var callbackFunc = param.callbackFunc;
  var getGeomCallback = param.getGeometry;
  var route_width = param.route_width;
  var stops1 = param.waypoints;
  var stopsIcon = param.waypointsIcon;
  var wayptArray = [];

  var routeUrl = null;
  var tempPoint = null;
  var sourcePointfinal = null;
  var destinationPointfinal = null;
  var routeLine = [];
  var routetempArr = [];
  var coordinateArray = [];
  var ETA_legs = null
  var tempStops = [];
  var routeLocation = [];
  var sLocation = { "longitude": sourcePoint[0], "latitude": sourcePoint[1] };
  var dLocation = { "longitude": destinationPoint[0], "latitude": destinationPoint[1] };

  if (param.waypoints && param.waypoints.length > 0) {

    console.log(param.waypoints);
    routeLocation.push(sLocation);
    for (var s = 0; s < stops1.length; s++) {
      console.log("s:", s);
      var record = { "longitude": stops1[s].lon, "latitude": stops1[s].lat };
      routeLocation.record;
    }
    routeLocation.push(dLocation);
  }
  else {
    routeLocation.push(sLocation);
    routeLocation.push(dLocation);
  }
  console.log("Route Location:", routeLocation);
  tmpl.Utils.getPentaBToken({
    callbackFun: function token(accessToken) {
      console.log("Token::", accessToken);
      var settings = {
        "url": appConfigInfo.pentaBNetworkAPIService,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "PentaUserRole": appConfigInfo.PentaUserRole,
          "PentaOrgID": appConfigInfo.PentaOrgID,
          "PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
          "Authorization": accessToken,
          "Content-Type": "application/json"
        },
        // "data": JSON.stringify([{"dataSource":{"id":12},"locations":routeLocation,"crs":"4326","directed":true,"cost_table":"tn_road_cost"}]),
        "data": JSON.stringify([
          {
            "dataSource": {
              "id": appConfigInfo.pentaBNetworkDataSourceId
            },
            "directed": appConfigInfo.pentaBNetworkDirected,
            "navigation": appConfigInfo.pentaBNetworkNavigation,
            "includeSegment": appConfigInfo.pentaBNetworkIncludeSegment,
            "crs": appConfigInfo.pentaBProjection,
            "locations": routeLocation,
            "disableBarriers": appConfigInfo.pentaBNetworkDisableBarriers,
            "language": appConfigInfo.PentaBSelectedLocale,
          }
        ]),
      };

      $.ajax(settings).done(function (response) {
        var routeLine = response[0][0].route;
        var routeDistance = response[0][0].distance;
        var routeETA = response[0][0].eta;
        try {
          var _initial = routeETA;
          var fromTime = new Date(_initial);
          var toTime = new Date();

          var differenceTravel = toTime.getTime() - fromTime.getTime();
          var seconds = Math.floor((differenceTravel) / 1000 % 60);
          var hours = Math.floor(differenceTravel / 1000 / 60 / 60);
          differenceTravel -= hours * 1000 * 60 * 60;
          var minutes = Math.floor(differenceTravel / 1000 / 60);
          console.log("minutes:", minutes);
          routeETA = minutes;


          if (callbackFunc) {
            var resETA = {};
            resETA.distance = {};
            resETA.distance.value = routeDistance;
            resETA.distance.units = 'M';
            resETA.duration = {};
            resETA.duration.value = routeDistance;
            resETA.duration.units = 'S';
            resETA.distance.value = routeDistance;
            resETA.duration.value = routeETA;
            console.log("routeETA---------------->", resETA);
            callbackFunc(resETA, routeLine);

            var dataDistanceETA = { Distance: routeDistance, Duration: minutes, DurationValue: minutes };
            distanceDetails.push(dataDistanceETA);

          }

        } catch (e) {
          console.log("Time convertion Error..!", e);
        }
        //Clear Route Layer
        try {
          tmpl.Layer.clearData({ map: param.map, layer: 'RoutePoint' });
          tmpl.Layer.clearData({ map: param.map, layer: 'RouteLineLayer' });
          tmpl.Layer.remove({ map: param.map, layer: 'RouteLineLayer' });
          tmpl.Layer.remove({ map: param.map, layer: 'RoutePoint' });
        }
        catch (e) {
          console.log("Line Layer Creation Error..!", e);
        }
        tmpl.Overlay.addGeometry({
          map: param.map,
          geometry: routeLine,
          properties: {
            id: 1,
            name: "path",
            type: "visited",
          },
          layer: 'RouteLineLayer'
        });

        var srcIconStyle = new ol.style.Icon(({
          src: sourceIcon,
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixel',
          scale: 1.0
        }));
        var destIconStyle = new ol.style.Icon(({
          src: destinationIcon,
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixel',
          scale: 1.0
        }));

        var srcGeom = new ol.geom.Point(ol.proj.transform([parseFloat(sourcePoint[0]), parseFloat(sourcePoint[1])], 'EPSG:4326', 'EPSG:4326'));
        var destGeom = new ol.geom.Point(ol.proj.transform([parseFloat(destinationPoint[0]), parseFloat(destinationPoint[1])], 'EPSG:4326', 'EPSG:4326'));

        var srcfeatureVal = new ol.Feature({
          geometry: srcGeom
        });
        var destfeatureVal = new ol.Feature({
          geometry: destGeom
        });

        srcfeatureVal.setStyle(new ol.style.Style({
          image: srcIconStyle,
        }));
        destfeatureVal.setStyle(new ol.style.Style({
          image: destIconStyle,
        }));

        srcfeatureVal.set('layer_name', 'RoutePoint');
        destfeatureVal.set('layer_name', 'RoutePoint');

        var src = new ol.source.Vector({
          features: [srcfeatureVal]
        });
        var dest = new ol.source.Vector({
          features: [destfeatureVal]
        });

        var srcOverlay = new ol.layer.Vector({
          title: "RoutePoint",
          visible: true,
          source: src
        });
        var destOverlay = new ol.layer.Vector({
          title: "RoutePoint",
          visible: true,
          source: dest
        });

        mapObj.addLayer(srcOverlay);
        mapObj.addLayer(destOverlay);

      });

    }
  })
}


function getArcGISEsriRoute(param) {
  console.log("ESRI Route:", param);
  
  var stops = null;
  var cordStart, cordEnd, coordinateArray, ETA_legs;
  cordStart = param.source;
  cordEnd = param.destination;
  var satationId = param.stationId || null;
  var vehicle = param.vehicle || "car";

  // Check if token is required (assuming appConfigInfo has a flag like requiresToken)
  var requiresToken = appConfigInfo.esriRoutingToken !== undefined ? appConfigInfo.esriRoutingToken : true;
   var graphHopperRoute = appConfigInfo.graphHopperRoute !== undefined ? appConfigInfo.graphHopperRoute : false;

  if (graphHopperRoute) {
        // If GraphHopper is enabled, use its routing API
    var settings = {
      
      "url": window.location.origin +"/EGISAPIService/apis/matrix",
      // "url": "https://hcsjointstack.trinityiot.in/EGISAPIService/apis/matrix",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json",
        "Cookie": "INGRESSCOOKIE=1745330834.171.228168.682880|d66c25fde433a459c7ec37dff4b64737; Path=/"
      },
      "data": JSON.stringify({
        "fromPoints": [
          {
            "lat": param.source[1],
            "lon": param.source[0]
          }
        ],
        "toPoints": [
          {
            "lat": param.destination[1],
            "lon": param.destination[0],
            "id": satationId
          }
        ],
        "vehicle": vehicle,
      }),
    };
    $.ajax(settings).done(function (response) {
      try{
        console.log("No WayPoints", response);
        if (!response || !response.routes) {

          throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
        }
        console.log("GraphHopper Response:", response);
        var routeResult = response.routes[0].points
        var time =  response.routes[0].time_seconds;
        var distance =response.routes[0].distance_km*1000; // Convert km to meters
        ETA_legs = [{
          distance: { value: distance, units: 'M' },
          duration: { value: time, units: 'S' }
        }];
        var coordinateArray = routeResult.map(point => [point.lon, point.lat]);
        console.log("Coordinate Array:", coordinateArray);
        helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);


      }catch(e){
          console.warn("Error processing response:", e.message);
          var routeResult = undefined;
          var attributes = undefined;
          var distance = undefined;
          var time = undefined;
          var disUnits = undefined;
          ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
          }];
          coordinateArray = undefined;
          // CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
          helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          console.error("AJAX request failed:", textStatus, errorThrown);
          console.error("Status Code:", jqXHR.status);
          console.error("Response Text:", jqXHR.responseText);
            var routeResult = undefined;
          var attributes = undefined;
          var distance = undefined;
          var time = undefined;
          var disUnits = undefined;
          ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
          }];
          coordinateArray = undefined;
          // CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
          helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
        })
        .always(function () {
          console.log("AJAX request completed");
        });

  }else{
    if (requiresToken) {
      var form = new FormData();
      form.append("client_id", appConfigInfo.esriClientId);
      form.append("client_secret", appConfigInfo.esriClientSecret);
      form.append("grant_type", "client_credentials");
      form.append("f", "Json");
  
      var settings = {
        "url": appConfigInfo.esriRoutingTokenURL,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };
  
      $.ajax(settings).done(function (response) {
        console.log(response.access_token);
  
        var obj = JSON.parse(response);
        const accessToken = obj.access_token;
        if (accessToken != null) {
          let form = new FormData();
          stops = param.source[0] + ',' + param.source[1] + ';' + param.destination[0] + ',' + param.destination[1];
  
          form.append("stops", stops);
          form.append("token", accessToken);
          form.append("f", "Json");
  
          var settings = {
            "url": appConfigInfo.esriRouting,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            dataType: "json"
          };
  
          // $.ajax(settings).done(function (response) {
          //   console.log("No WayPoints", response);
          //   var routeResult = response.routes.features[0].geometry.paths[0];
          //   var attributes = response.routes.features[0].attributes;
          //   var distance = attributes.Total_Kilometers ? attributes.Total_Kilometers : (attributes.Total_Meters ? attributes.Total_Meters : 0);
          //   var time = attributes.Total_Kilometers ? attributes.Total_TravelTime : (attributes.Total_Meters ? attributes.Total_Minutes : 0);
          //   var disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
          //   ETA_legs = [{
          //     distance: { value: distance, units: disUnits },
          //     duration: { value: time, units: 'M' }
          //   }];
          //   console.log(routeResult);
          //   coordinateArray = routeResult;
          //   CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
          // });

          $.ajax(settings)
          .done(function (response) {
            try {
              console.log("No WayPoints", response);
              if (!response || !response.routes || !response.routes.features || !response.routes.features.length ||
                  !response.routes.features[0].geometry || !response.routes.features[0].geometry.paths ||
                  !response.routes.features[0].geometry.paths.length) {
                throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
              }
              const routeResult = response.routes.features[0].geometry.paths[0];
              const attributes = response.routes.features[0].attributes || {};
              const distance = attributes.Total_Kilometers || attributes.Total_Meters || 0;
              const disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
              const time = attributes.Total_TravelTime || attributes.Total_Minutes || 0; 
              const ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];

              console.log(routeResult);
              coordinateArray = routeResult;
              // CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
              helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
            } catch (error) {
              console.warn("Error processing response:", error.message);
               var routeResult = undefined;
              var attributes = undefined;
              var distance = undefined;
              var time = undefined;
              var disUnits = undefined;
              ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];
              coordinateArray = undefined;
              // CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
              helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", textStatus, errorThrown);
            console.error("Status Code:", jqXHR.status);
            console.error("Response Text:", jqXHR.responseText);
          })
          .always(function () {
            console.log("AJAX request completed");
          });
        }
      });
    } else {
      // Direct call to routing API without token
      let form = new FormData();
      stops = param.source[0] + ',' + param.source[1] + ';' + param.destination[0] + ',' + param.destination[1];
  
      form.append("stops", stops);
      form.append("f", "Json");
      form.append("outSR", appConfigInfo.esriProjection);
  
  
      var settings = {
        "url": appConfigInfo.esriRouting,
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form,
        dataType: "json"
      };
  
      $.ajax(settings).done(function (response) {

        try {
        console.log("No WayPoints", response);
        if (!response || !response.routes || !response.routes.features || !response.routes.features.length ||
            !response.routes.features[0].geometry || !response.routes.features[0].geometry.paths ||
            !response.routes.features[0].geometry.paths.length) {
        throw new Error("Invalid response structure: Missing routes, features, geometry, or paths");
        }

        console.log("No WayPoints (No Token)", response);
        var routeResult = response.routes.features[0].geometry.paths[0];
        var attributes = response.routes.features[0].attributes;
        var distance = attributes.Total_Kilometers ? attributes.Total_Kilometers : (attributes.Total_Meters ? attributes.Total_Meters : 0);
        var time = attributes.Total_Kilometers ? attributes.Total_TravelTime : (attributes.Total_Meters ? attributes.Total_Minutes : 0);
        var disUnits = attributes.Total_Kilometers ? 'KM' : (attributes.Total_Meters ? 'M' : '');
        ETA_legs = [{
          distance: { value: distance, units: disUnits },
          duration: { value: time, units: 'M' }
        }];
        console.log(routeResult);
        coordinateArray = routeResult;
        // CreateLayer(param, cordStart, cordEnd, coordinateArray, ETA_legs);
        helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
        } catch (error) {
              console.warn("Error processing response:", error.message);
               var routeResult = undefined;
              var attributes = undefined;
              var distance = undefined;
              var time = undefined;
              var disUnits = undefined;
              ETA_legs = [{
                distance: { value: distance, units: disUnits },
                duration: { value: time, units: 'M' }
              }];
              coordinateArray = undefined;
              // CreateLayer(param, cordStart, cordEnd, [], [{ distance: { value: undefined, units: undefined }, duration: { value: undefined, units: undefined } }]);
              helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs);
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", textStatus, errorThrown);
            console.error("Status Code:", jqXHR.status);
            console.error("Response Text:", jqXHR.responseText);
          })
          .always(function () {
            console.log("AJAX request completed");
        });
    }
  }

}

function helperArcGISEsriRoute(param, cordStart, cordEnd, coordinateArray, ETA_legs){
  console.log(param)
  console.log(cordStart)
  console.log(cordEnd)
  console.log(coordinateArray)
  console.log(ETA_legs)
  var map =param.map;
  let viewer = map;
  let startIcon = param.sourceIcon || "https://cdn-icons-png.flaticon.com/512/684/684908.png";
  let endIcon = param.destinationIcon || "https://cdn-icons-png.flaticon.com/512/684/684908.png";
  let layerName = param.layerName || "RouteLayer";
  let routeWidth = param.route_width ? param.route_width : 3;
  let routeColor = param.routeColor ? param.routeColor : "rgb(255, 0, 0)";
  let image_scale = param.imageScale ? param.imageScale : 1;
  var callbackFunc = param.callbackFunc;

  map.entities.add({
    name: layerName,
    position: Cesium.Cartesian3.fromDegrees(cordStart[0], cordStart[1]),
    billboard: {
      image: startIcon,
      scale: image_scale,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
  });

  map.entities.add({
    name: layerName,
    position: Cesium.Cartesian3.fromDegrees(cordEnd[0], cordEnd[1]),
    billboard: {
      image: endIcon,
      scale: image_scale,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
  });

  if(coordinateArray && coordinateArray.length>0){
    let flatCoords = coordinateArray.flat();
    viewer.entities.add({
    name: layerName,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(flatCoords),
      width: routeWidth,
      material: Cesium.Color.fromCssColorString(routeColor),
      clampToGround: true
    }
  });
  }
}