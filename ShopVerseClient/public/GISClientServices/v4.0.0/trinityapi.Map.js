let osmBuildingsTileset = null;
let add3dModelAsAssectIDVar = null;

try {
  const storedData = localStorage.getItem("jsonData");
  gisErrors = JSON.parse(storedData);
  //console.log(jsonData);
} catch (e) {
  console.log("GIS Error Code Loading issue from localStorage", e.message);
}
//--------------------------------Beginning--  of Creating Google Map------------------------------------//
// **** Creating Google Map inside the specified targetDiv using the map properties specified in the appconfig.js file **** //

tmpl.Map.resetTrip = function () {
  firstrun = true;
  console.log("FIRST RUN ", firstrun);
};


// ********************* SDK_MAP_API (1) Map Creation API ********************* //
tmpl.Map.createMap = function (param) {
  if (appConfigInfo.googleMapKey != null) {
    tmpl.Map.mapCreation(param);
  } else {
    tmpl.Map.mapCreation(param);
  }

  return { status: true, message: "createMap executed successfully" };
};

var streetLayer_trinity,
  tmpl_setMap_layer_global = [],
  tmpl_setMap_layer_global_array = [];
  var globalPolygons = [];

tmpl.Map.mapCreation = async function (param) {
  // await vaultApiPromise; // Wait for the vault API to resolve before proceeding
    // setWMSURL();  
 
 
  try {
    if (
      appConfigInfo.googleMapKey == "none" ||
      appConfigInfo.googleMapKey == "" ||
      appConfigInfo.googleMapKey == null ||
      appConfigInfo.googleMapKey == undefined
    ) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request, Parameter Not Valid",
        developermessage:
          "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
          "appConfigInfo.googleMapKey",
      });
    } else {
      var gscript = document.createElement("script");
      gscript.type = "text/javascript";

      gscript.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        appConfigInfo.googleMapKey +
        "&libraries=places,drawing";
      document.getElementsByTagName("head")[0].appendChild(gscript);


    }
  } catch (e) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      businessmessage: "Bad Request, Parameter Not Valid",
      developermessage:
        "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
        "appConfigInfo.googleMapKey",
    });
  }

  if (
    appConfigInfo.type == "none" ||
    appConfigInfo.type == "" ||
    appConfigInfo.type == null ||
    appConfigInfo.type == undefined
  ) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      businessmessage: "Bad Request, Parameter Not Valid",
      developermessage:
        "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
        "Param:appConfigInfo.type",
    });
  } else {
    try {
      var targetDiv = param.target;
      var mainMap;
      var callBackFun = param.callBackFun;

      // F0r Mpeh
      var existingMapObject = param.existingMapObj;

      if (param.mainMap) {
        mainMap = param.mainMap;
      } else {
        mainMap = false;
      }

      if (targetDiv == undefined || targetDiv == null || targetDiv == "") {
        return (response = {
          status: false,
          businesserrorcode: "TB_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          businessmessage: "Bad Request, Parameter Not Valid",
          developermessage:
            "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
            "Parem:target",
        });
      }

      globalMapDivID = targetDiv;
      
      if (appConfigInfo.mapDimension == "2D") {
        if (appConfigInfo.mapLib == "ol7") {
          if (appConfigInfo.mapData === "google") {
            console.log(
              " mapZoom:" + appConfigInfo.mapZoom,
              " maxZoom:" + appConfigInfo.maxZoom,
              " minZoom:" + appConfigInfo.minZoom
            );
            var viewg;
            var map;
            if (
              appConfigInfo.setResolution == true ||
              appConfigInfo.setResolution == "true"
            ) {
              viewg = new ol.View({
                center: ol.proj.transform(
                  [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
                ),
                extent: ol.proj.transformExtent(
                  [
                    parseFloat(appConfigInfo.extent1),
                    parseFloat(appConfigInfo.extent2),
                    parseFloat(appConfigInfo.extent3),
                    parseFloat(appConfigInfo.extent4),
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
                ),
                zoom: parseInt(appConfigInfo.mapZoom),
                maxZoom: parseInt(appConfigInfo.maxZoom),
                title: "BaseMap",
                minZoom: parseInt(appConfigInfo.minZoom),
              });
            } else {
              viewg = new ol.View({
                center: ol.proj.transform(
                  [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
                ),
                zoom: parseInt(appConfigInfo.mapZoom),
                maxZoom: parseInt(appConfigInfo.maxZoom),
                title: "BaseMap",
                minZoom: parseInt(appConfigInfo.minZoom),
              });
            }

            if (appConfigInfo.type == "google" || appConfigInfo.type == "ola") {
              console.log("from api google");

              var darkLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: "https://mt0.google.com/vt/lyrs=h&hl=en&x={x}&y={y}&z={z}",
                  crossOrigin: 'anonymous',
                  cacheSize: 1000,        
                  transition: 250,      
                  preload: 2,
                })
              });
              var abcLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: "https://mt0.google.com/vt/lyrs=t&hl=en&x={x}&y={y}&z={z}",
                  crossOrigin: 'anonymous',
                  cacheSize: 1000,        
                  transition: 250,      
                  preload: 2,
                })
              });
              var normalLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: "https://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
                  crossOrigin: 'anonymous',
                  cacheSize: 1000,        
                  transition: 250,      
                  preload: 2,
                })
              });
              var roadLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                  url: appConfigInfo.mapSDKURL + "ocean.geojson",
                  format: new ol.format.GeoJSON()
                }),
                style: new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#000000', // Stroke color (black in this case)
                    width: 1 // Stroke width
                  }),
                  fill: new ol.style.Fill({
                    color: '#2A2A29' // Fill color (blue in this case)
                  })
                })
              });

              if (appConfigInfo.mode == 'dark') {
                $("#" + targetDiv).css("background-color", "#000000");
                map = new ol.Map({
                  layers: [abcLayer, roadLayer, darkLayer],
                  target: targetDiv,
                  view: viewg,
                  title: "BaseMap",
                  loadTilesWhileAnimating: true,
                  
                });

                map.on('postcompose', function(event) {
                  var canvas = event.context.canvas;
                  canvas.style.filter = "invert(20%) grayscale(0%)"; // Invert colors and apply grayscale
                });

              } else {
                // map.on('postcompose', function(event) {
                //   var canvas = event.context.canvas;
                //   canvas.style.filter = "grayscale(100%)"; // Invert colors and apply grayscale
                // });
                map = new ol.Map({
                  layers: [normalLayer],
                  target: targetDiv,
                  view: viewg,
                  title: "BaseMap",
                  loadTilesWhileAnimating: true,
                });

                appConfigInfo.currentMapType = "GoogleStreet"

              }

              var layers = map.getLayers();
              //map.set('ol7mObj', omap, true);
              activate(map);
              if (callBackFun) {
                var response = {
                  status: true,
                  message: "Map Created Successfully..",
                  map: map,
                };
                callBackFun(map, response);
              }
              return map;
            } 
            else if (appConfigInfo.type == "osm" || appConfigInfo.type == "genesys") {
              map = new ol.Map({
                layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
                target: targetDiv,
                view: viewg,
                title: "BaseMap",
                loadTilesWhileAnimating: true,
              });
              var layers = map.getLayers();

              activate(map);
              if (callBackFun) {
                var response = {
                  status: true,
                  message: "Map Created Successfully..",
                  map: map,
                };
                callBackFun(map, response);
              }

              return response;
            } else if (appConfigInfo.type == "esri") {
              map = new ol.Map({
                layers: [],
                target: targetDiv,
                view: viewg,
                title: "BaseMap",
                loadTilesWhileAnimating: true,
              });
              var layers = map.getLayers();

              if (appConfigInfo.mode == "dark") {

                appConfigInfo.esri_url = appConfigInfo.esriDarkUrl;

              } else if (appConfigInfo.mode == "light") {

                appConfigInfo.esri_url = appConfigInfo.esriLightUrl;

              } else if (appConfigInfo.mode == "street") {

                appConfigInfo.esri_url = appConfigInfo.esriStreetUrl;

              }else if (appConfigInfo.mode == "normal") {

                appConfigInfo.esri_url = appConfigInfo.esriNormalUrl;

              }  else {
                appConfigInfo.esri_url = appConfigInfo.esri_url;
              }         
              
              if (appConfigInfo.esriTileset) {
                layers.insertAt(
                  0,
                  new ol.layer.Tile({
                    source: new ol.source.XYZ({
                      url: appConfigInfo.esri_url + "/tile/{z}/{y}/{x}",
                      crossOrigin: "anonymous",
                    }),
                  })
                );
              }else {
                layers.insertAt(
                  0,
                  new ol.layer.Tile({
                    source: new ol.source.TileArcGISRest({
                      url: appConfigInfo.esri_url
                    })
                  })
                );
              }       


              
              activate(map);
              if (callBackFun) {
                var response = {
                  status: true,
                  message: "Map Created Successfully..",
                  map: map,
                };
                callBackFun(map, response);
              }
              return response;
            } else if (appConfigInfo.type == "hereMaps") {
              // var map;
              var view;
              if (appConfigInfo.setResolution == true) {
                view = new ol.View({
                  center: ol.proj.transform(
                    [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    "EPSG:4326",
                    "EPSG:3857"
                  ), // **** lon,lat and googlezoom are in app config file **** //
                  zoom: appConfigInfo.mapZoom,
                  title: "BaseMap",
                  maxZoom: appConfigInfo.maxZoom,
                  minZoom: appConfigInfo.minZoom,
                });
              } else {
                view = new ol.View({
                  center: ol.proj.transform(
                    [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    "EPSG:4326",
                    "EPSG:3857"
                  ), // **** lon,lat and googlezoom are in app config file **** //
                  zoom: appConfigInfo.mapZoom,
                  title: "BaseMap",
                  maxZoom: appConfigInfo.maxZoom,
                  minZoom: appConfigInfo.minZoom,
                });
              }
              var tile = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url:
                    "https://{1-4}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id=" +
                    appConfigInfo.hereMapsAppID +
                    "&app_code=" +
                    appConfigInfo.hereMapsAppCode,
                }),
              });

              map = new ol.Map({
                controls: ol.control.defaults.defaults({
                  zoom: true,
                  attribution: true,
                  rotate: false,
                }),
                title: "BaseMap",
                layers: [tile],
                target: targetDiv,
                pixelRatio: 1,
                view: view,
              });
              activate(map);

              if (callBackFun) {
                callBackFun(map);
              }

              return map;
            } else {
              var map;
              var view;
              var baseLayer;
              var p = new ol.proj.Projection({
                code: appConfigInfo.projection,
                extent: [
                  parseFloat(appConfigInfo.extent1),
                  parseFloat(appConfigInfo.extent2),
                  parseFloat(appConfigInfo.extent3),
                  parseFloat(appConfigInfo.extent4),
                ],
                units: "m",
                axisOrientation: "neu",
              });

              if (appConfigInfo.gwc) {
                baseLayer = new ol.layer.Tile({
                  visible: true,
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.gwcurl,
                    params: {
                      LAYERS: appConfigInfo.layer,
                      TILED: true,
                      VERSION: appConfigInfo.wmsVersion,
                    },
                    serverType: "geoserver",
                    transition: 0,
                  }),
                });

                streetLayer_trinity = new ol.layer.Tile({
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.gwcurl,
                    params: {
                      LAYERS: appConfigInfo.streetLayer,
                      TILED: true,
                      VERSION: "1.1.1",
                    },
                  }),
                });
                if (mainMap == true) {
                  base_map_trinity = baseLayer;
                  base_map_streetLayer_trinity = streetLayer_trinity;
                }
                if (appConfigInfo.setResolution == true) {
                  view = new ol.View({
                    zoom: appConfigInfo.trinityzoom,
                    projection: "EPSG:4326",
                    maxZoom: appConfigInfo.trinityMaxZoom,
                    center: [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    extent: [
                      parseFloat(appConfigInfo.extent1),
                      parseFloat(appConfigInfo.extent2),
                      parseFloat(appConfigInfo.extent3),
                      parseFloat(appConfigInfo.extent4),
                    ],
                    rotation: 0,
                    pixelRatio: 1,
                    minZoom: appConfigInfo.trinityMinZoom,
                  });
                } else {
                  view = new ol.View({
                    zoom: appConfigInfo.trinityzoom,
                    projection: "EPSG:4326",
                    center: [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    extent: [
                      parseFloat(appConfigInfo.extent1),
                      parseFloat(appConfigInfo.extent2),
                      parseFloat(appConfigInfo.extent3),
                      parseFloat(appConfigInfo.extent4),
                    ],
                    rotation: 0,
                    pixelRatio: 1,
                    minZoom: appConfigInfo.trinityMinZoom,
                  });
                }
              } else {
                baseLayer = new ol.layer.Tile({
                  visible: true,
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.gwcurl,
                    params: {
                      LAYERS: appConfigInfo.layer,
                      TILED: false,
                      VERSION: appConfigInfo.wmsVersion,
                    },
                    serverType: "geoserver",
                  }),
                });
                //base_map_trinity = baseLayer;

                streetLayer_trinity = new ol.layer.Tile({
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.gwcurl,
                    params: {
                      LAYERS: appConfigInfo.streetLayer,
                      VERSION: "1.1.1",
                    },
                  }),
                });
                if (mainMap == true) {
                  base_map_trinity = baseLayer;
                  base_map_streetLayer_trinity = streetLayer_trinity;
                }
                if (appConfigInfo.setResolution == true) {
                  view = new ol.View({
                    zoom: appConfigInfo.trinityzoom,
                    projection: p,
                    maxZoom: appConfigInfo.trinityMaxZoom,
                    center: [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    extent: [
                      parseFloat(appConfigInfo.extent1),
                      parseFloat(appConfigInfo.extent2),
                      parseFloat(appConfigInfo.extent3),
                      parseFloat(appConfigInfo.extent4),
                    ],
                    rotation: 0,
                    pixelRatio: 1,
                    minZoom: appConfigInfo.trinityMinZoom,
                  });
                } else {
                  view = new ol.View({
                    zoom: appConfigInfo.trinityzoom,
                    projection: p,
                    center: [
                      parseFloat(appConfigInfo.lon),
                      parseFloat(appConfigInfo.lat),
                    ],
                    rotation: 0,
                    pixelRatio: 1,
                    minZoom: appConfigInfo.trinityMinZoom,
                  });
                }
              }
              if (appConfigInfo.trinitySatelliteView) {
                if (appConfigInfo.trinitySatellitegwc) {
                  var satelliteLayer = new ol.layer.Tile({
                    visible: false,
                    source: new ol.source.TileWMS({
                      url: appConfigInfo.trinitySatelliteurl,
                      params: {
                        LAYERS: appConfigInfo.trinitySatelliteLayer,
                        TILED: true,
                        VERSION: appConfigInfo.wmsVersion,
                      },
                      serverType: "geoserver",
                    }),
                  });
                } else {
                  var satelliteLayer = new ol.layer.Tile({
                    visible: false,
                    source: new ol.source.TileWMS({
                      url: appConfigInfo.trinitySatelliteurl,
                      params: {
                        LAYERS: appConfigInfo.trinitySatelliteLayer,
                        TILED: false,
                        VERSION: appConfigInfo.wmsVersion,
                      },
                      serverType: "geoserver",
                    }),
                  });
                }
                streetLayer_trinity = new ol.layer.Tile({
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.gwcurl,
                    params: {
                      LAYERS: appConfigInfo.streetLayer,
                      VERSION: "1.1.1",
                    },
                  }),
                });
                if (mainMap == true) {
                  base_map_streetLayer_trinity = streetLayer_trinity;
                }
                if (mainMap == true) {
                  map = new ol.Map({
                    interactions: ol.interaction.defaults({
                      doubleClickZoom: true,
                    }),
                    layers: [
                      baseLayer,
                      base_map_streetLayer_trinity,
                      satelliteLayer,
                    ],
                    target: targetDiv,
                    pixelRatio: 1,
                    view: view,
                  });
                } else {
                  map = new ol.Map({
                    interactions: ol.interaction.defaults({
                      doubleClickZoom: true,
                    }),
                    layers: [baseLayer, satelliteLayer],
                    target: targetDiv,
                    pixelRatio: 1,
                    view: view,
                  });
                }
                var b1 = document.createElement("button");
                var txt1 = document.createTextNode("Map");
                b1.appendChild(txt1);
                b1.title = "Show street view";
                b1.className = "ol-map-btn ";
                b1.addEventListener("click", function () {
                  setBaseMap("street", baseLayer, satelliteLayer);
                });

                var b2 = document.createElement("button");
                var txt1 = document.createTextNode("Earth");
                b2.appendChild(txt1);
                b2.title = "Show satellite imagery";
                b2.className = "ol-sat-btn";
                b2.addEventListener("click", function () {
                  setBaseMap("satellite", baseLayer, satelliteLayer);
                });

                var mapbtn = new ol.control.Control({
                  element: b1,
                });
                map.addControl(mapbtn);

                var satellitebtn = new ol.control.Control({
                  element: b2,
                });
                map.addControl(satellitebtn);
              } else {
                if (mainMap == true) {
                  map = new ol.Map({
                    //interactions: ol.interaction.defaults({ doubleClickZoom: true }),
                    layers: [baseLayer, streetLayer_trinity],
                    target: targetDiv,
                    view: view,
                  });
                  base_map_streetLayer_trinity.setVisible(false);
                } else {
                  map = new ol.Map({
                    interactions: ol.interaction.defaults({
                      doubleClickZoom: true,
                    }),
                    layers: [baseLayer],
                    target: targetDiv,
                    view: view,
                  });
                }
              }
              if (mainMap == true) {
              }
              if (callBackFun)
                return (response = {
                  status: true,
                  message: "Map Created Successfully..",
                  map: map,
                });
              callBackFun(response);
            }
          } else if (appConfigInfo.mapData === "sgl") {
            console.log("=======================SGL================")
            var map;
            var wmsSource = new ol.source.TileWMS({
              url: appConfigInfo.sgl_baseMap,
              params: {
                'layers': appConfigInfo.sglBaseMapLayer,
                'styles': '',
                'TRANSPARENT': 'TRUE',
                'FORMAT': 'image/png',
                'VERSION': appConfigInfo.wmsVersion,
                'SRS': 'EPSG:4326'
              },
            });

            var WMSlayerObj = new ol.layer.Tile({
              visible: true,
              source: wmsSource
            });


            map = new ol.Map({
              target: targetDiv,
              layers: [WMSlayerObj],
              view: new ol.View({
                center: ol.proj.fromLonLat([appConfigInfo.lon, appConfigInfo.lat]),
                zoom: parseInt(appConfigInfo.mapZoom),
                minZoom: parseInt(appConfigInfo.minZoom),
                maxZoom: parseInt(appConfigInfo.maxZoom),
              })
            });

            var osmLayer = new ol.layer.Tile({
              source: new ol.source.OSM(),
            });

            console.log(" :::: map :::::  ", map);
            activate(map);
            if (callBackFun) {
              var response = {
                status: true,
                message: "Map Created Successfully..",
                map: map,
              };
              callBackFun(map, response);
            }
            return map;

          }
          else if (
            appConfigInfo.mapData === "google" ||
            appConfigInfo.mapData === "trinity"
          ) {
            var viewg;
            //console.log(appConfigInfo.setResolution);
            if (
              appConfigInfo.setResolution == true ||
              appConfigInfo.setResolution == "true"
            ) {
              viewg = new ol.View({
                center: ol.proj.transform(
                  [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
                ), // **** lon,lat and googlezoom are in app config file **** //
                zoom: appConfigInfo.googlezoom,
                maxZoom: 23, //appConfigInfo.googleMaxZoom,
                // extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857"),
                minZoom: appConfigInfo.googleMinZoom,
              });
            } else {
              viewg = new ol.View({
                center: ol.proj.transform(
                  [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
                ), // **** lon,lat and googlezoom are in app config file **** //
                zoom: appConfigInfo.googlezoom,
                maxZoom: 23,
                //extent : ol.proj.transformExtent([parseFloat(appConfigInfo.extent1),parseFloat(appConfigInfo.extent2),parseFloat(appConfigInfo.extent3),parseFloat(appConfigInfo.extent4)],"EPSG:4326","EPSG:3857");,
                minZoom: appConfigInfo.googleMinZoom,
              });
            }
            var map;

            if (appConfigInfo.type == "google" || appConfigInfo.type == "mmi") {
              //console.log("from api google");
              var applyLayer;

              if (existingMapObject) {
                applyLayer = existingMapObject;
                console.log("Map Created from Existing Map Object..!");
              } else {
                try {
                  if (googleStyled == "night") {
                    // for google night mode
                    applyLayer = new olgm.layer.Google({
                      // for google night mode
                      styles: mapStylesBundle["night"].style,
                    });
                  } else if (googleStyled == "darkGrey") {
                    applyLayer = new olgm.layer.Google({
                      // for dark google map mode
                      styles: mapStylesBundle["darkGrey"].style,
                    });
                  } else if (googleStyled == "cobalt") {
                    applyLayer = new olgm.layer.Google({
                      // for cobalt map mode
                      styles: mapStylesBundle["cobalt"].style,
                    });
                  } else {
                    applyLayer = new olgm.layer.Google({
                      // for google night mode
                      styles: mapStylesBundle["night"].style,
                    });
                  }
                } catch (e) {
                  console.log("Internet Not Available....!");
                }
                console.log("Map Created using New Map Object..!");
              }
              map = new ol.Map({
                interactions: ol.interaction
                  .defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false,
                  })
                  .extend([new ol.interaction.DragPan({ kinetic: null })]),
                layers: [], //applyLayer
                target: targetDiv,
                pixelRatio: 1,
                view: viewg,
                loadTilesWhileAnimating: true,
              });

              try {
                //var layers = map.getLayers();
                //layers.setAt(0, applyLayer);
              } catch (e) {
                console.log("Internet Not Available....!");
              }

              try {
                var olGM = new olgm.OLGoogleMaps({
                  map: map,
                  mapIconOptions: {
                    useCanvas: true,
                  },
                });
                olGM.activate();

                gmap_googleMap = olGM.getGoogleMapsMap();
                map.set("olgmObj", olGM);
              } catch (e) {
                console.log("Internet Not Available....!");
              }
              try {
                tmpl.Map.getBaseMaps({});
                tmpl.Map.switchBaseMaps({ map: map, id: 6 });
              } catch (e) {
                console.log("Switch Map Error::", e);
              }
            } else if (appConfigInfo.type == "osm") {
              //04-06-2020 Removed By Ratheesh
              /*var osmLayer = new olgm.layer.Google({
                visible : true, 
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });*/

              var osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM(),
              });
              map = new ol.Map({
                interactions: ol.interaction
                  .defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    zoom: false,
                    rotate: false,
                  })
                  .extend([new ol.interaction.DragPan({ kinetic: null })]),
                layers: [],
                target: targetDiv,
                view: viewg,
                loadTilesWhileAnimating: true,
              });
              /*map.addLayer(osmLayer);
              layers.setAt(0, osmLayer); 
              map.setView(viewg);
              var layers = map.getLayers();*/
              //var layers = map.getLayers();
              map.addLayer(osmLayer);
              osmLayer.set("name", "osmBaseMap");
              //layers.setAt(1, osmLayer);
              map.getLayers().setAt(1, osmLayer);
              map.setView(viewg);
            } else if (appConfigInfo.type == "esri") {
              var layer1 = new olgm.layer.Google({
                visible: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
              });

              map = new ol.Map({
                interactions: ol.interaction
                  .defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false,
                  })
                  .extend([new ol.interaction.DragPan({ kinetic: null })]),
                layers: [layer1],
                target: targetDiv,
                view: viewg,
                loadTilesWhileAnimating: true,
              });
              var layers = map.getLayers();
              layers.setAt(0, layer1);

              var olGM = new olgm.OLGoogleMaps({
                map: map,
                mapIconOptions: {
                  useCanvas: true,
                },
              });
              olGM.activate();
              gmap_googleMap = olGM.getGoogleMapsMap();
              map.set("olgmObj", olGM);
              layers.removeAt(0);
              layers.insertAt(
                0,
                new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    attributions: [
                      new ol.Attribution({
                        html:
                          'Tiles   <a href="' +
                          appConfigInfo.esri_url +
                          '">ArcGIS</a>',
                      }),
                    ],
                    url: appConfigInfo.esri_url + "/tile/{z}/{y}/{x}",
                  }),
                })
              );
            } else if (appConfigInfo.type == "satellite") {
              var layer1 = new olgm.layer.Google({
                visible: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
              });

              map = new ol.Map({
                interactions: ol.interaction
                  .defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false,
                  })
                  .extend([new ol.interaction.DragPan({ kinetic: null })]),
                layers: [layer1],
                target: targetDiv,
                view: viewg,
                loadTilesWhileAnimating: true,
              });
              var layers = map.getLayers();
              layers.setAt(0, layer1);

              var olGM = new olgm.OLGoogleMaps({
                map: map,
                mapIconOptions: {
                  useCanvas: true,
                },
              });
              olGM.activate();

              gmap_googleMap = olGM.getGoogleMapsMap();
              map.set("olgmObj", olGM);

              toggleGoogleMap("satellite", map);
            }
            // **** Setting toggle for Street and Satellite view **** //

            if (appConfigInfo.googleSatelliteView == true) {
              var streetButton = document.createElement("button_new");
              var streetText = document.createTextNode("Map");
              streetButton.appendChild(streetText);
              streetButton.title = "Show Street View";
              streetButton.className = "ol-map-btn .ol-unselectable ";

              var satelliteButton = document.createElement("button_new");
              var satelliteText = document.createTextNode("Earth");
              satelliteButton.appendChild(satelliteText);
              satelliteButton.title = "Show Satellite Imagery";
              satelliteButton.className = "ol-sat-btn";

              var streetControl = new ol.control.Control({
                element: streetButton,
              });
              map.addControl(streetControl);

              streetButton.addEventListener("click", function () {
                toggleGoogleMap("street", streetControl.getMap());
              });

              var satelliteControl = new ol.control.Control({
                element: satelliteButton,
              });
              map.addControl(satelliteControl);
              satelliteButton.addEventListener("click", function () {
                toggleGoogleMap("satellite", satelliteControl.getMap());
              });
            }
            activate(map);
            for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
              if (
                tmpl_setMap_layer_global[i].visibility == true &&
                tmpl_setMap_layer_global[i].map == map
              ) {
                tmpl_setMap_layer_global[i].layer.setMap(map);
              }
            }
            global_fleet_layer_id = [];
            globale_layer_names = [];
            global_fleet_layer_features = [];
            global_fleet_layer_objects = [];
            //tmpl_setMap_layer_global = [];
            //mapLocation(map,appConfigInfo.extent2,appConfigInfo.extent1,appConfigInfo.extent4,appConfigInfo.extent3);
            map.on("pointermove", function (e) {
              var pixel = map.getEventPixel(e.originalEvent);
              var hit = map.hasFeatureAtPixel(pixel);
              map.getViewport().style.cursor = hit ? "pointer" : "";
            });
            if (callBackFun) callBackFun(map);
            console.log("map::", map);
            try {
              tmpl.Map.getBaseMaps({});
              tmpl.Map.switchBaseMaps({ map: map, id: 6 });
            } catch (e) {
              console.log("Switch Map Error::", e);
            }
            return map;
          } else if (appConfigInfo.mapData === "mmi") {
            console.log(" ::: MMI map Data ");

            var map
            // Generate a timestamp to ensure a unique URL for each request
            var timestamp = new Date().getTime();

            // try {
            //   tmpl.Utils.getMMIAccessToken({
            //     callbackFunc: function (accessToken) {

            //       var layersConfig = appConfigInfo.mmi_layers;

            //       var mapLayers = [];
            //       for (var i = 0; i < layersConfig.length; i++) {
            //         var layerConfig = layersConfig[i];

            //         var wmsSource = new ol.source.TileWMS({
            //           url: appConfigInfo.baseUrl,
            //           crossOrigin: 'anonymous',
            //           serverType: 'geoserver',
            //           strategy: ol.loadingstrategy.bbox,
            //           params: {
            //             'service': 'WMS',
            //             'request': 'GetMap',
            //             'version': '1.1.1',
            //             'layers': layerConfig.layers,
            //             'styles': layerConfig.styles,
            //             'format': 'image/png',
            //             'transparent': 'true',
            //             'datasetNme': layerConfig.datasetNme,  // Update with the appropriate dataset name
            //             'autoZIndex': 'false',
            //             'access_token': 'bearer ' + encodeURIComponent(accessToken.data.access_token),
            //             'test': layerConfig.test,
            //             'crossOrigin': 'anonymous',
            //             'srs': 'EPSG:3857',
            //           },
            //         });

            //         //var minResolution = ol.View.prototype.getResolutionForZoom(layerConfig.minZoom);

            //         var wmsLayerObj = new ol.layer.Tile({
            //           visible: true,
            //           source: wmsSource,
            //         });

            //         mapLayers.push(wmsLayerObj);
            //       }
            //       /* Loading single layer / Base Map
            // var wmsSource1 = new ol.source.TileWMS({
              
            //     crossOrigin: 'anonymous',
            //     serverType: 'geoserver',
            //     strategy: ol.loadingstrategy.bbox,
            //     params: {
            //       'service': 'WMS',
            //       'request': 'GetMap',
            //       'version': '1.1.1',
            //       'layers': 'a',
            //       'styles': 'lko_police_boundary_category_based_label_1696005759056_workview',
            //       'format': 'image/png',
            //       'transparent': 'true',
            //       'datasetNme': 'lko_police_boundary',
            //       'autoZIndex': 'false',
            //       'access_token': 'bearer '+encodeURIComponent(accessToken),
            //       'test': '0.5756302833565932',
            //       'crossOrigin': 'anonymous',
            //     //   'width': '1536',
            //     //   'height': '1200',
            //       'srs': 'EPSG:3857',
            //     //   'bbox': '8788118.016003286,2984336.705053459,9257747.11778741,3209978.812551298',
            //     },
            //   });

            // var WMSlayerObj1 = new ol.layer.Tile({
            //     visible: true,
            //     source: wmsSource1
            // });*/


            //       map = new ol.Map({
            //         target: targetDiv,
            //         layers: mapLayers,
            //         view: new ol.View({
            //           center: ol.proj.fromLonLat([appConfigInfo.lon, appConfigInfo.lat]), // Bangalore coordinates
            //           zoom: 12 // Adjust the zoom level as needed
            //         })
            //       });

            //       console.log(" :::: map :::::  ", map);
            //       activate(map)
            //       if (callBackFun) {
            //         var response = {
            //           status: true,
            //           message: "Map Created Successfully..",
            //           map: map,
            //         };
            //         callBackFun(map, response);
            //       }
            //       return map;
            //     }
            //   });
            // } catch (e) {
            //   console.log("API Responce issue here..", e);
            // }


            try {
              tmpl.Utils.getMMIAccessToken({
                callbackFunc: function (accessToken) {
                  if (!accessToken?.data?.access_token) {
                    console.error("Failed to retrieve access token");
                    if (callBackFun) {
                      callBackFun(null, {
                        status: false,
                        message: "Failed to retrieve access token",
                      });
                    }
                    return;
                  }
            
                  const token = accessToken.data.access_token;
                  console.log("Access Token: ", token);
                  
                  const tileUrl = appConfigInfo.baseUrl+token+"/map_tile/{z}/{x}/{y}";
                  console.log("Tile URL: ", tileUrl);
            
                  // Create Mappls tile layer
                  var mapplsLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                      url: tileUrl,
                      crossOrigin: 'anonymous',
                      cacheSize: 1000,
                      transition: 250,
                      preload: 2,
                    })
                  });
            
                  const map = new ol.Map({
                    target: targetDiv,
                    layers: [mapplsLayer],
                    view: new ol.View({
                      center: ol.proj.fromLonLat([appConfigInfo.lon, appConfigInfo.lat]), 
                      zoom: appConfigInfo.mapZoom,
                      minZoom: appConfigInfo.minZoom,
                      maxZoom: appConfigInfo.maxZoom,
                    }),
                    controls: ol.control.defaults(),
                  });
            
                  console.log(":::: map ::::: ", map);
                  activate(map);
                  if (callBackFun) {
                    const response = {
                      status: true,
                      message: "Map Created Successfully (using Mappls Tile Service)",
                      map: map,
                    };
                    callBackFun(map, response);
                  }
                  return map;
                },
                errorFunc: function (error) {
                  console.error("Error fetching access token:", error);
                  if (callBackFun) {
                    callBackFun(null, {
                      status: false,
                      message: "Failed to fetch access token",
                    });
                  }
                },
              });
            } catch (e) {
              console.error("Error initializing map:", e);
              if (callBackFun) {
                callBackFun(null, {
                  status: false,
                  message: "Map initialization failed",
                });
              }
            }
          } else {
            console.log("Custome Map Data Loaded  ::", appConfigInfo.mapData);
            var map;
            var view;
            var baseLayer;
            var p = new ol.proj.Projection({
              code: appConfigInfo.projection,
              extent: [
                parseFloat(appConfigInfo.extent1),
                parseFloat(appConfigInfo.extent2),
                parseFloat(appConfigInfo.extent3),
                parseFloat(appConfigInfo.extent4),
              ],
              units: "m",
              axisOrientation: "neu",
            });

            if (appConfigInfo.gwc) {

              if (appConfigInfo.mode == "normal") {
                appConfigInfo.layer = appConfigInfo.trinityLayerNormal;
              } else if (appConfigInfo.mode == "dark") {
                appConfigInfo.layer = appConfigInfo.trinityLayerDark;
              }

              baseLayer = new ol.layer.Tile({
                visible: true,
                source: new ol.source.TileWMS({
                  url: appConfigInfo.gwcurl,
                  params: {
                    LAYERS: appConfigInfo.layer,
                    TILED: true,
                    VERSION: appConfigInfo.wmsVersion,
                  },
                  // crossOrigin: "Anonymous",
                  serverType: "geoserver",
                }),
              });
              base_map_trinity = baseLayer;
              try {
                if (appConfigInfo.ln === "ar" || appConfigInfo.ln == "ar") {
                  $('.ol-zoom-in').attr('title', 'تكبير');
                  $('.ol-zoom-out').attr('title', 'تصغير');
                  $('.controls1').attr('placeholder', 'بحث');
                  $('.ol-Search').attr('placeholder', 'بحث');
                  $('.search-wrapper').attr('placeholder', 'بحث');
                  $('.ol-map-pointbtn').attr('title', 'ارسم النقاط');
                  $('.ol-map-linebtn').attr('title', 'ارسم الخطوط');
                  $('.ol-map-polygonbtn').attr('title', 'ارسم المضلعات');
                  $('.ol-map-Circlebtn').attr('title', 'رسم دائرة');
                } else {
                  $(".ol-zoom-in").attr("title", "Zoom In");
                  $(".ol-zoom-out").attr("title", "Zoom Out");
                  $(".controls1").attr("placeholder", "Search");
                  $(".ol-Search").attr("placeholder", "Search");

                  $(".ol-map-pointbtn").attr("title", "Draw Point");
                  $(".ol-map-linebtn").attr("title", "Draw Line");
                  $(".ol-map-polygonbtn").attr("title", "Draw Polygon");
                  $(".ol-map-Circlebtn").attr("title", "Draw Circle");
                }
              } catch (e) {
                console.log("Error..", e);
              }
              console.log(base_map_trinity,baseLayer);
              streetLayer_trinity = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: appConfigInfo.gwcurl,
                  params: {
                    LAYERS: appConfigInfo.streetLayer,
                    TILED: true,
                    VERSION: "1.1.1",
                  },
                  crossOrigin: "Anonymous",
                }),
              });
              if (mainMap == true) {
                base_map_trinity = baseLayer;
                base_map_streetLayer_trinity = streetLayer_trinity;
              }
              if (appConfigInfo.setResolution == true) {
                view = new ol.View({
                  zoom: appConfigInfo.mapZoom,
                  projection: "EPSG:4326",
                  maxZoom: appConfigInfo.maxZoom,
                  center: [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  extent: [
                    parseFloat(appConfigInfo.extent1),
                    parseFloat(appConfigInfo.extent2),
                    parseFloat(appConfigInfo.extent3),
                    parseFloat(appConfigInfo.extent4),
                  ],
                  rotation: 0,
                  minZoom: appConfigInfo.minZoom,
                });
              } else {
                view = new ol.View({
                  zoom: appConfigInfo.mapZoom,
                  projection: "EPSG:4326",
                  maxZoom: appConfigInfo.maxZoom,
                  center: [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  rotation: 0,
                  minZoom: appConfigInfo.minZoom,
                });
              }
            } else {           

              if (appConfigInfo.mode == "normal") {
                appConfigInfo.layer = appConfigInfo.trinityLayerNormal;
              } else if (appConfigInfo.mode == "dark") {
                appConfigInfo.layer = appConfigInfo.trinityLayerDark;
              }

              baseLayer = new ol.layer.Tile({
                visible: true,
                source: new ol.source.TileWMS({
                  url: appConfigInfo.gwcurl,
                  params: {
                    LAYERS: appConfigInfo.layer,
                    TILED: false,
                    VERSION: appConfigInfo.wmsVersion,
                  },
                  serverType: "geoserver",
                }),
              });
              base_map_trinity = baseLayer;

              streetLayer_trinity = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: appConfigInfo.gwcurl,
                  params: {
                    LAYERS: appConfigInfo.streetLayer,
                    VERSION: appConfigInfo.wmsVersion,
                  },
                }),
              });
              if (mainMap == true) {
                base_map_trinity = baseLayer;
                base_map_streetLayer_trinity = streetLayer_trinity;
              }
              if (appConfigInfo.setResolution == true) {
                view = new ol.View({
                  zoom: appConfigInfo.mapZoom,
                  projection: appConfigInfo.projection,
                  maxZoom: appConfigInfo.maxZoom,
                  center: [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  extent: [
                    parseFloat(appConfigInfo.extent1),
                    parseFloat(appConfigInfo.extent2),
                    parseFloat(appConfigInfo.extent3),
                    parseFloat(appConfigInfo.extent4),
                  ],
                  rotation: 0,
                  minZoom: appConfigInfo.minZoom,
                });
              } else {
                view = new ol.View({
                  zoom: appConfigInfo.mapZoom,
                  projection: appConfigInfo.projection,
                  center: [
                    parseFloat(appConfigInfo.lon),
                    parseFloat(appConfigInfo.lat),
                  ],
                  rotation: 0,
                  minZoom: appConfigInfo.minZoom,
                });
              }
            }
            if (appConfigInfo.trinitySatelliteView) {
              if (appConfigInfo.trinitySatellitegwc) {
                var satelliteLayer = new ol.layer.Tile({
                  visible: false,
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.trinitySatelliteurl,
                    params: {
                      LAYERS: appConfigInfo.trinitySatelliteLayer,
                      TILED: true,
                      VERSION: appConfigInfo.wmsVersion,
                    },
                    serverType: "geoserver",
                  }),
                });
              } else {
                var satelliteLayer = new ol.layer.Tile({
                  visible: false,
                  source: new ol.source.TileWMS({
                    url: appConfigInfo.trinitySatelliteurl,
                    params: {
                      LAYERS: appConfigInfo.trinitySatelliteLayer,
                      TILED: false,
                      VERSION: appConfigInfo.wmsVersion,
                    },
                    serverType: "geoserver",
                  }),
                });
              }
              streetLayer_trinity = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: appConfigInfo.gwcurl,
                  params: {
                    LAYERS: appConfigInfo.streetLayer,
                    VERSION: "1.1.1",
                  },
                }),
              });
              if (mainMap == true) {
                base_map_streetLayer_trinity = streetLayer_trinity;
              }
              if (mainMap == true) {
                map = new ol.Map({
                  interactions: ol.interaction.defaults({
                    doubleClickZoom: true,
                  }),
                  layers: [
                    baseLayer,
                    base_map_streetLayer_trinity,
                    satelliteLayer,
                  ],
                  target: targetDiv,
                  view: view,
                });
                //base_map_streetLayer_trinity.setVisible(false);
              } else {
                map = new ol.Map({
                  interactions: ol.interaction.defaults({
                    doubleClickZoom: true,
                  }),
                  layers: [baseLayer, satelliteLayer],
                  target: targetDiv,
                  view: view,
                });
              }
              // map = new ol.Map({
              // interactions : ol.interaction.defaults({doubleClickZoom :true}),
              // layers: [baseLayer, streetLayer_trinity, satelliteLayer],
              // target: targetDiv,
              // pixelRatio: 1,
              // view: view
              // });
              var b1 = document.createElement("button");
              var txt1 = document.createTextNode("Map");
              b1.appendChild(txt1);
              b1.title = "Show street view";
              b1.className = "ol-map-btn ";
              b1.addEventListener("click", function () {
                setBaseMap("street", baseLayer, satelliteLayer);
              });

              var b2 = document.createElement("button");
              var txt1 = document.createTextNode("Earth");
              b2.appendChild(txt1);
              b2.title = "Show satellite imagery";
              b2.className = "ol-sat-btn";
              b2.addEventListener("click", function () {
                setBaseMap("satellite", baseLayer, satelliteLayer);
              });

              var mapbtn = new ol.control.Control({
                element: b1,
              });
              map.addControl(mapbtn);

              var satellitebtn = new ol.control.Control({
                element: b2,
              });
              map.addControl(satellitebtn);
            } else {
              console.log("In trinity street map load...", mainMap);
              if (mainMap == true) {
                console.log("In trinity street map load...", mainMap);

                map = new ol.Map({
                  interactions: ol.interaction.defaults({
                    doubleClickZoom: true,
                  }),
                  layers: [baseLayer, streetLayer_trinity],
                  target: targetDiv,
                  view: view,
                });
                base_map_streetLayer_trinity.setVisible(false);
              } else {
                map = new ol.Map({
                  interactions: ol.interaction.defaults({
                    doubleClickZoom: true,
                  }),
                  layers: [baseLayer],
                  // layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), baseLayer],
                  target: targetDiv,
                  pixelRatio: 1,
                  view: view,
                });
              }
            }
            global2DMap = map;
            activate(map);
            try {
              if (appConfigInfo.ln === "ar" || appConfigInfo.ln == "ar") {
                $('.ol-zoom-in').attr('title', 'تكبير');
                $('.ol-zoom-out').attr('title', 'تصغير');
                $('.controls1').attr('placeholder', 'بحث');
                $('.ol-Search').attr('placeholder', 'بحث');

                $('.ol-map-pointbtn').attr('title', 'ارسم النقاط');
                $('.ol-map-linebtn').attr('title', 'ارسم الخطوط');
                $('.ol-map-polygonbtn').attr('title', 'ارسم المضلعات');
                $('.ol-map-Circlebtn').attr('title', 'رسم دائرة');
              } else {
                $(".ol-zoom-in").attr("title", "Zoom In");
                $(".ol-zoom-out").attr("title", "Zoom Out");
                $(".controls1").attr("placeholder", "Search");
                $(".ol-Search").attr("placeholder", "Search");

                $(".ol-map-pointbtn").attr("title", "Draw Point");
                $(".ol-map-linebtn").attr("title", "Draw Line");
                $(".ol-map-polygonbtn").attr("title", "Draw Polygon");
                $(".ol-map-Circlebtn").attr("title", "Draw Circle");
              }
            } catch (e) {
              console.log("Error..", e);
            }
            if (mainMap == true) {
              // getTrinityLayersList(map);
            }
            if (callBackFun) callBackFun(map);
            global2DMap = map;
            return map;
          }

          /*Here Map Integration**/
        } else if (appConfigInfo.mapLib == "leaflet") {
          var viewg;
          var map;
          if (appConfigInfo.type === "google") {
            map = L.map(targetDiv).setView(
              [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
              appConfigInfo.mapZoom,
              "EPSG:4326",
              "EPSG:3857"
            );

            var ggl;

            ggl = L.tileLayer(
              "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
              {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
              }
            );

            ggl.addTo(map);
            if (callBackFun) callBackFun(map);
            return map;
          } else if (appConfigInfo.type === "osm") {
            map = L.map(targetDiv).setView(
              [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
              appConfigInfo.mapZoom,
              "EPSG:4326",
              "EPSG:3857"
            );
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            if (callBackFun) callBackFun(map);

            return map;
          } else if (appConfigInfo.type === "esri") {
            map = L.map(targetDiv).setView(
              [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
              appConfigInfo.mapZoom,
              "EPSG:4326",
              "EPSG:3857"
            );

            L.tileLayer(
              "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
              {
                //maxZoom: 18,
              }
            ).addTo(map);

            if (callBackFun) callBackFun(map);
          } else if (appConfigInfo.type === "hereMaps") {
            map = L.map(targetDiv).setView(
              [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
              appConfigInfo.mapZoom,
              "EPSG:4326",
              "EPSG:3857"
            );

            L.tileLayer
              .provider("HEREv3.terrainDay", {
                apiKey: appConfigInfo.hereMapsAppKey,
              })
              .addTo(map);
            if (callBackFun) callBackFun(map);
          } else {
            console.log("FromAPI @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@shhh");
            var map;
            if (appConfigInfo.setResolution == true) {
              map = L.map(targetDiv).setView(
                [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
                appConfigInfo.mapZoom,
                "EPSG:4326",
                "EPSG:3857"
              );
            } else {
              map = L.map(targetDiv).setView(
                [parseFloat(appConfigInfo.lat), parseFloat(appConfigInfo.lon)],
                appConfigInfo.mapZoom,
                "EPSG:4326",
                "EPSG:3857"
              );
            }
            var view;
            var baseLayer;

            if (appConfigInfo.gwc) {
              baseLayer = L.tileLayer.wms(appConfigInfo.mapserverURL, {
                layers: appConfigInfo.basemapLayer,
              });
              baseLayer.addTo(map);

              if (callBackFun) callBackFun(map);

              if (mainMap == true) {
                base_map_trinity = baseLayer;
                base_map_streetLayer_trinity = streetLayer_trinity;
              }
            } else {
              baseLayer = L.tileLayer.wms(appConfigInfo.mapserverURL, {
                layers: appConfigInfo.basemapLayer,
              });
              baseLayer.addTo(map);

              if (callBackFun) callBackFun(map);

              if (mainMap == true) {
                base_map_trinity = baseLayer;
                base_map_streetLayer_trinity = streetLayer_trinity;
              }
            }
            if (mainMap == true) {
            }
            if (callBackFun) callBackFun(map);
            console.log("Map Object..", map);
            global2DMap = map;
            return map;
          }
        }
      } else {
        let esri;
        let bing;
        appConfigInfo.type = 'google';
        var map = null;
        
        Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;
        
        if(appConfigInfo.isTerrainRequired!=undefined && appConfigInfo.isTerrainRequired){

          let worldTerrain = Cesium.Terrain.fromWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true,
          });

          map = new Cesium.Viewer(targetDiv, {
            terrainProvider: worldTerrain, // No terrain provider
            terrain: worldTerrain,
            baseLayerPicker: true, // Disable the base layer picker
            geocoder: true, // Disable the geocoder
            homeButton: false, // Disable the home button
            infoBox: true, // Disable the info box
            sceneModePicker: false, // Disable the scene mode picker
            selectionIndicator: false, // Disable the selection indicator
            timeline: false, // Disable the timeline
            navigationHelpButton: false, // Disable the navigation help button
            fullscreenButton: false, // Disable the fullscreen button
            animation: false, // Disable the animation widget
            creditContainer: undefined, // Hide the credit container
            shouldAnimate: true,
            contextOptions: {
              webgl: {
                  preserveDrawingBuffer: true
              }
            }
          });
        }else{
          map = new Cesium.Viewer(targetDiv, {
            baseLayerPicker: true, // Disable the base layer picker
            geocoder: true, // Disable the geocoder
            homeButton: false, // Disable the home button
            infoBox: false, // Disable the info box
            sceneModePicker: false, // Disable the scene mode picker
            selectionIndicator: false, // Disable the selection indicator
            timeline: false, // Disable the timeline
            navigationHelpButton: false, // Disable the navigation help button
            fullscreenButton: false, // Disable the fullscreen button
            animation: false, // Disable the animation widget
            creditContainer: undefined, // Hide the credit container
            shouldAnimate: true,
            contextOptions: {
              webgl: {
                  preserveDrawingBuffer: true
              }
            }
          });
        }
        console.log(map);
        // Function to add OpenStreetMap as a base layer
        function addOSMBaseLayer() {
          const imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
            // url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
          });
          if (appConfigInfo.type == "osm") {
            map.imageryLayers.removeAll(); // Remove existing layers
            // var trafficImageryProvider = new Cesium.UrlTemplateImageryProvider({
            //   url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=AIzaSyA7z_IJBC_8QTKN7HlO2ZmSZX-RKNIVUh8'
            // });
            map.imageryLayers.addImageryProvider(imageryProvider); // Add OSM layer
            // map.imageryLayers.addImageryProvider(trafficImageryProvider); // Add OSM layer
          }
          tmpl.Map.EnableOrDesableTerrain({
            map: map,
            visibility: false
          });
        }
        setTimeout(() => {
          console.log("appConfigInfo.type~~~~~~~~~~~~", appConfigInfo.type)
          if (appConfigInfo.type == "osm") {
            addOSMBaseLayer(); // Add OSM base layer
          }
          console.log("appConfigInfo.lon,appConfigInfo.lat~~~~", appConfigInfo.lon, appConfigInfo.lat);
          map._cesiumWidget._creditContainer.style.display = 'none';
          map.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              appConfigInfo.lon,
              appConfigInfo.lat,
              10000
            ), //Comment after Dahod demo on 03-12-2019
          });
          if (callBackFun) {
            callBackFun(map);
            //addGoogleTrafficLayer();
            // map.scene.camera.setView({
            //   destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 10000), // Set altitude as needed
            //   orientation: {
            //       heading: Cesium.Math.toRadians(0), // Adjust heading as needed
            //       pitch: Cesium.Math.toRadians(-20), // Tilt the view, negative values look down
            //       roll: 0.0
            //   }
            // });
            // map.camera.moveBackward(30000.0)
          }
          return map;
        }, 1000);
        global3DMap = map;
      }
    } catch (err) {
      return (response = { status: false, error: err });
    }
  }
};


//  function setWMSURL() {
//       if (appConfigInfo.mapData === "google") {
//         wmsurl = "https://example.com/google-wms-url";
//       } else if (appConfigInfo.mapData === "pentab") {
//         appConfigInfo.wmsurl = appConfigInfo.pentabwmsurl; 
//         appConfigInfo.gwcurl = appConfigInfo.pentabgwcurl;
//         appConfigInfo.layer  = appConfigInfo.pentabMaplayer;
//         console.log("===================Overriding the wmsurl,gwcurl,layer===========")
//       } else { console.error("Unknown mapData type!"); } 
//     } 

var feature_poi_edit_id;
var feature_poi_edit_layer;
var feature_poi_edit_layer_callback;
var feature_spatial_edit_id;
var feature_spatial_edit_layer;
var feature_spatial_edit_layer_callback;
activate = function (mapObj) {
  try {
    var popupboolian_title = false;
    mapObj.on("pointermove", function (e) {
      if (e.dragging) return;
      try {
        var pixel = mapObj.getEventPixel(e.originalEvent);
      } catch (e) { }
      try {
        var hit = mapObj.hasFeatureAtPixel(pixel);
      } catch (e) { }
      try {
        mapObj.getTargetElement().style.cursor = hit ? "pointer" : "";
      } catch (e) { }
    });
    mapObj.on("moveend", function (evt) {
      try {
        var overlayID = mapObj.getOverlayById("clusterOverlayID");
        if (overlayID) {
          mapObj.removeOverlay(overlayID);
        }
      } catch (e) { }
    });
    mapObj.on("click", function (evt) {
      var pixel = mapObj.getEventPixel(evt.originalEvent);
      if (mapObj.hasFeatureAtPixel(pixel)) {
        var layerName;
        var coordinate = evt.coordinate;
        var layerObj;
        var feature = mapObj.forEachFeatureAtPixel(
          evt.pixel,
          function (feature, layer) {
            layerObj = layer;
            if (layer == null) {
              if (feature.get("layer_name")) {
                layerName = feature.get("layer_name");
                popupboolian_title = false;
                return feature;
              } else {
                popupboolian_title = true;
                return null;
              }
            } else if (layer) {
              if (layer) {
                if (layer.get("title")) {
                  layerName = layer.get("title");
                  popupboolian_title = false;
                  return feature;
                } else {
                  popupboolian_title = true;
                  return null;
                }
              }
            } else {
              popupboolian_title = true;
            }
          }
        );
        if (popupboolian_title == false) {
          var geometry = feature.getGeometry();
          var coord;
          if (
            appConfigInfo.mapData == "google" ||
            appConfigInfo.mapData == "hereMaps"
          ) {
            coord = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
          } else if (appConfigInfo.mapData == "esri") {
            coord = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
          } else {
            coord = evt.coordinate;
          }
          var id;
          if (feature.get("id") === undefined) {
            id = null;
          } else {
            id = feature.get("id");
          }
          var properties = feature.getProperties();

          if (
            id == "c_" + feature_poi_edit_id &&
            layerName == feature_poi_edit_layer + "_API_CircleLayer"
          ) {
            feature_poi_edit_layer_callback(id, coord, layerName, properties);
          } else if (
            feature_spatial_edit_id == id &&
            feature_spatial_edit_layer == layerName
          ) {
            feature_spatial_edit_layer_callback(
              id,
              coord,
              layerName,
              properties
            );
          } else {
            if (layerObj != null) {
              if (layerObj.get("cluster") == true) {
                //alert();
                var ids = [],
                  properties1 = [];
                for (var k = 0; k < feature.get("features").length; k++) {
                  ids[k] = feature.get("features")[k].get("id");
                  properties1[k] = feature.get("features")[k].getProperties();
                }
                console.log("Call 3");
                getOverlayFeatureDetails(
                  ids,
                  coord,
                  layerName,
                  properties1,
                  mapObj
                );
              } else if (layerName == "Draw_Route_Layer") {
                tmpl.Geocode.getGeocode({
                  point: coord,
                  callbackFunc: handleGeocode,
                });

                function handleGeocode(a) {
                  properties.address = a.address;

                  getOverlayFeatureDetails(
                    id,
                    coord,
                    layerName,
                    properties,
                    mapObj
                  );
                }
              } else {
                console.log("Call 1");
                getOverlayFeatureDetails(
                  id,
                  coord,
                  layerName,
                  properties,
                  mapObj
                );
              }
            } else {
              console.log("Call 2");
              getOverlayFeatureDetails(
                id,
                coord,
                layerName,
                properties,
                mapObj
              );
            }
          }
        }
      } else {
        if (tmpl.Info.getPlaceFlag == true) {
          var coordinate = evt.coordinate;

          var x = parseFloat(coordinate[0]);
          var y = parseFloat(coordinate[1]);
          var coordinates = { lat: y, lng: x };
          var result = {};
          if (
            appConfigInfo.mapData == "google" ||
            appConfigInfo.mapData == "hereMaps"
          ) {
            if (appConfigInfo.type == "sgl") {
              console.log("coordinates:", coordinates);

              function handleGeocode(data) {
                console.log(data.address);
              }
              tmpl.Geocode.getGeocode({
                point: [coordinates.lng, coordinates.lat],
                callbackFunc: handleGeocode,
              });
            }
            if (appConfigInfo.type == "esri") {
              coordinate = ol.proj.transform(
                coordinate,
                "EPSG:3857",
                "EPSG:4326"
              );
              console.log("coordinates--->:", coordinate);

              var x = parseFloat(coordinate[0]);
              var y = parseFloat(coordinate[1]);
              var coordinates = { lat: y, lng: x };

              function handleGeocode(data) {
                console.log("----->", data);

                var place = data;
                var placeName = place;
                result = {
                  place: [placeName],
                  latitude: y,
                  longitude: x,
                  type: "All",
                };
                resultStatus = true;
                tmpl.Info.getPlace.CallbackFunc(result);
              }
              tmpl.Geocode.getGeocode({
                point: [coordinates.lng, coordinates.lat],
                callbackFunc: handleGeocode,
              });
            } else {
              var coordinate = evt.coordinate;
              coordinate = ol.proj.transform(
                coordinate,
                "EPSG:3857",
                "EPSG:4326"
              );
              var x = parseFloat(coordinate[0]);
              var y = parseFloat(coordinate[1]);
              var coordinates = { lat: y, lng: x };
              var result = {};
              var geocoder = new google.maps.Geocoder();
              console.log("geocoder -> ", geocoder);
              geocoder.geocode(
                {
                  latLng: coordinates,
                },
                function (results, status) {
                  console.log("geocode -> ", results, status);
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                      //console.log(results[0]);
                      var place = results[0].formatted_address;
                      var placeName = place;
                      result = {
                        place: [placeName],
                        latitude: y,
                        longitude: x,
                        type: results[0].types.join(),
                      };
                      resultStatus = true;
                    }
                  } else {
                    result = {
                      place: "",
                      latitude: y,
                      longitude: x,
                      type: "",
                    };
                  }
                  console.log("geocode result", result);
                  tmpl.Info.getPlace.CallbackFunc(result);
                }
              );
            }
          } else {
            console.log("evt.coordinate:", evt.coordinate);
            var coordinate = evt.coordinate;
            //coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            var x = parseFloat(coordinate[0]);
            var y = parseFloat(coordinate[1]);
            var coordinates = { lat: y, lng: x };
            var result = {};
            if (appConfigInfo.type == "sgl") {
              console.log("coordinates:", coordinates);
            } else {
              function handleLandMarks(data) {
                result = {
                  place: [data.address],
                  latitude: y,
                  longitude: x,
                  type: "all",
                };

                tmpl.Info.getPlace.CallbackFunc(result);
              }

              tmpl.Geocode.getGeocode({
                point: [x, y],
                callbackFunc: handleLandMarks,
              });
            }
          }
        }
      }
    });
  } catch (e) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x010",
      developererrorcode: "TB_GISSDK_0x010",
      businessmessage: "TypeError: Cannot read property",
      developermessage:
        "201 This error occurs when you try to access a property of an undefined or null object :" +
        e.message,
    });
  }
};

function enablePointerMove(mapObj, event) {
  var pixel = mapObj.getEventPixel(event.originalEvent);
  var hit = mapObj.hasFeatureAtPixel(pixel);
  mapObj.getViewport().style.cursor = hit ? "pointer" : "";
}

function disablePointerMove(mapObj) {
  mapObj.un("click", myFunc);
}

function setBaseMap(val, bLayer, sLayer) {
  if (val === "satellite") {
    bLayer.setVisible(false);
    sLayer.setVisible(true);
  } else {
    bLayer.setVisible(true);
    sLayer.setVisible(false);
  }
}

function mapdivChangeAction(mapObject) {
  var mapDivId = mapObject.getTarget();
  if (mapObject.getTarget().id != undefined) {
    mapDivId = mapObject.getTarget().id;
  }
  var tempVar = document
    .getElementById(mapDivId)
    .style.height.replace(/\'/g, "")
    .split(/(\d+)/)
    .filter(Boolean);
  document.getElementById(mapDivId).style.height =
    parseInt(tempVar[0]) - 1 + tempVar[1];
  setTimeout(function () {
    tempVar = document
      .getElementById(mapDivId)
      .style.height.replace(/\'/g, "")
      .split(/(\d+)/)
      .filter(Boolean);
    document.getElementById(mapDivId).style.height =
      parseInt(tempVar[0]) + 1 + tempVar[1];
  }, 200);
}

// **** Toggle handler for Street and Satellite view of Google map**** //
function toggleGoogleMap(val, mapobj) {
  console.log("toggleGoogleMap");
  var layers = mapobj.getLayers();
  mapobj.removeLayer(layers.item(0));
  var googleLayer;
  if (val === "satellite") {
    googleLayer = new olgm.layer.Google({
      mapTypeId: google.maps.MapTypeId.HYBRID,
    });
  } else {
    googleLayer = new olgm.layer.Google({
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
  }
  layers.insertAt(0, googleLayer);
  mapdivChangeAction(mapobj);
}

var baseMapLayerObjects = [];

tmpl.Map.getBaseMaps = function () {
  var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });
  var esriLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      attributions: [
        new ol.Attribution({
          html: 'Tiles   <a href="' + appConfigInfo.esri_url + '">ArcGIS</a>',
        }),
      ],
      url: appConfigInfo.esri_url + "/tile/{z}/{y}/{x}",
    }),
  });
  var stamen1 = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: "watercolor",
    }),
  });
  var stamen2 = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: "terrain-labels",
    }),
  });

  var hereMapSatlite = new ol.layer.Tile({
    visible: true,
    source: new ol.source.XYZ({
      url:
        "https://{1-4}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?apiKey=" +
        appConfigInfo.hereMapsAppKey,
    }),
  });

  var hereMapDark = new ol.layer.Tile({
    visible: true,
    source: new ol.source.XYZ({
      url:
        "https://{1-4}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.night.grey/{z}/{x}/{y}/256/png8?apiKey=" +
        appConfigInfo.hereMapsAppKey,
    }),
  });

  var hereMapnormal = new ol.layer.Tile({
    visible: true,
    source: new ol.source.XYZ({
      url:
        "https://{1-4}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=" +
        appConfigInfo.hereMapsAppKey,
    }),
  });

  var offlineMap = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
      url: appConfigInfo.gwcurl,
      params: {
        LAYERS: appConfigInfo.layer,
        TILED: true,
        WIDTH: 256,
        HEIGHT: 256,
        VERSION: appConfigInfo.wmsVersion,
      },
      serverType: "geoserver",
      SRS: "EPSG:4326",
    }),
  });

  baseMapLayerObjects[0] = osmLayer;
  baseMapLayerObjects[1] = esriLayer;
  baseMapLayerObjects[2] = stamen1;
  baseMapLayerObjects[3] = stamen2;
  baseMapLayerObjects[4] = offlineMap;
  baseMapLayerObjects[8] = hereMapSatlite;
  baseMapLayerObjects[9] = hereMapDark;
  baseMapLayerObjects[10] = hereMapnormal;

  var basemaps = [
    { name: "Google Road Map", id: 2 },
    { name: "Google Night Map", id: 7 }, //google night mode
    { name: "Google Satellite Map", id: 3 },
    { name: "Open Street Map", id: 1 },
    { name: "ESRI Map", id: 4 },
    { name: "SGL Map", id: 5 },
    { name: "Offline Map", id: 6 },
  ];
  return basemaps;
};

// ********************* SDK_MAP_API (5) SwitchBaseMap ********************* //
appConfigInfo.currentMapType = null;
tmpl.Map.switchBaseMaps = function (param) {
  var mapobj = param.map;
  var id = param.id;
  var language = appConfigInfo.ln || 'en';//appConfigInfo.ln  aplictaion team push madbeku.....ellndre bydefault en erutte
  

  try {
    if (!/^\d+$/.test(id)) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid ID",
      });
    }
    if (mapobj === null || mapobj === undefined) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid Map Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  if (appConfigInfo.mapDimension == "2D") {
    if (id > 7) {
      return (response = {
        status: true,
        businesserrorcode: "TB_GISSDK_0x012",
        developererrorcode: "TD_GISSDK_0x012",
        message: "Invalid map ID",
      });
    }

    if (appConfigInfo.mapLib == "ol7") {
      try {
        var layers = mapobj.getLayers();
        mapobj.removeLayer(layers.item(0));

        if (appConfigInfo.mapData == "mmi") {
          for (var k = layers.getLength() - 1; k >= 0; k--) {
            var layer = layers.item(k);
            if (layers.item(k).U.source.A == 'geoserver') {
              console.log("Removing layer:", layer);
              mapobj.removeLayer(layer);
            }
          }
        }

        if (appConfigInfo.mapData === "google" || appConfigInfo.mapData === "trinity" || appConfigInfo.mapData === "sgl") {
          if (appConfigInfo.type === "google" || appConfigInfo.type === "mmi") {
            if (id == 1) {
              var osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM(),
                crossOrigin: 'anonymous'
              });
              layers.insertAt(0, osmLayer);
              appConfigInfo.currentMapType = 'OSM';
              return (response = { status: true, message: "Switch to OSM Map" });

            } else if (id == 2) {
              var googleLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: "http://mt0.google.com/vt/lyrs=m&&hl=" + language + "&x={x}&y={y}&z={z}",//now dnamic
                  crossOrigin: 'anonymous'
                }),
              });
              layers.insertAt(0, googleLayer);
              appConfigInfo.currentMapType = 'GoogleStreet';
              return (response = {
                status: true,
                message: "Switch to Google street Map",
              });
            } else if (id == 3) {
             
              console.log("satellite");
              var googleSatelliteLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  //url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
                  url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                  //url: 'https://mt1.google.com/vt/lyrs=mt&hl=en&x={x}&y={y}&z={z}',
                  crossOrigin: 'anonymous'
                }),
              });
              layers.insertAt(0, googleSatelliteLayer);
              appConfigInfo.currentMapType = 'GoogleSatellite';
              return (response = {
                status: true,
                message: "Switch to Google Satellite Map",
              });
            } else if (id == 4) {
              //console.log("tmpl.Map.switchBaseMaps : You are Switch to ESRI Map");
              var esriLayer = new ol.layer.Tile({
                source: new ol.source.XYZ({
                  url: appConfigInfo.esri_url + "/tile/{z}/{y}/{x}",
                  crossOrigin: 'anonymous'
                }),
              });
              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });
            } else if (id == 6) {
              appConfigInfo.ln = "en";
              console.log("from api - Offline MAP English");
              layers.insertAt(0, baseMapLayerObjects[4]);
              try {
                var settings = {
                  url: appConfigInfo.googleMicroServiceURL + "updateapi",
                  method: "POST",
                  timeout: 0,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: JSON.stringify({
                    tenantcode: appConfigInfo.tenantcode,
                    appcode: appConfigInfo.appcode,
                    api: [
                      {
                        api: "geocoding",
                        mode: "false",
                        url:
                          "https://maps.googleapis.com/maps/api/geocode/json?key=" +
                          appConfigInfo.googleAPIkey,
                      },
                      {
                        api: "getdistancetime",
                        mode: "false",
                        url:
                          "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&language=en&mode=driving&key=" +
                          appConfigInfo.googleAPIkey,
                      },
                      {
                        api: "reversegeocoding",
                        mode: "false",
                        url:
                          "https://maps.googleapis.com/maps/api/geocode/json?result_type=street_address&location_type=ROOFTOP&key=" +
                          appConfigInfo.googleAPIkey +
                          "&sensor=false&language=en ",
                      },
                      {
                        api: "nearbyplacesearch",
                        mode: "false",
                        url:
                          "https://maps.googleapis.com/maps/api/place/nearbysearch/json?language=en&key=" +
                          appConfigInfo.googleAPIkey,
                      },
                      {
                        api: "placesearch",
                        mode: "false",
                        url:
                          "https://maps.googleapis.com/maps/api/place/details/json?fields=types,name,geometry,formatted_address&key=" +
                          appConfigInfo.googleAPIkey,
                      },
                    ],
                  }),
                };

                $.ajax(settings).done(function (response) {
                  appConfigInfo.type = "mmi";
                  console.log(
                    "trinityGIS Map MicroService Mode Updation:",
                    response
                  );
                });
              } catch (e) {
                console.log("Error in Mode Updation..!", e);
              }

            } else if (id == 7) {
              var sglBaseLayer = new ol.layer.Tile({
                source: new ol.source.TileWMS(({
                  projection: 'EPSG:4326',
                  url: appConfigInfo.sgl_baseMap,
                  params: { 'LAYERS': appConfigInfo.sglBaseMapLayer, 'TILED': true },
                  serverType: 'mapserver'
                }))
              })
              layers.insertAt(0, sglBaseLayer);
              appConfigInfo.currentMapType = 'SGL';
              return (response = { status: true, message: "Switch to SGL Map" });
            }
          } else if (appConfigInfo.type === "esri") {
            console.log("Switching to ESRI Map");

            if (id == 1) {
              //console.log("tmpl.Map.switchBaseMaps : You are Switch to OSM Map");
              var esriLayer;
              if(appConfigInfo.esriTileset){
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    url: appConfigInfo.esri_url + "/tile/{z}/{y}/{x}",
                    crossOrigin: 'anonymous'
                  }),
                });
              }else{
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.TileArcGISRest({
                    url: appConfigInfo.esri_url
                  }),
                });
              }

              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });

            } else if (id == 2) {
              // console.log("tmpl.Map.switchBaseMaps : You are Switch to Google street Map");
              var esriLayer;

              if(appConfigInfo.esriTileset){

                esriLayer = new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    url: appConfigInfo.esriStreetUrl + "/tile/{z}/{y}/{x}",
                    crossOrigin: 'anonymous'
                  }),
                });
              }else{
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.TileArcGISRest({
                    url: appConfigInfo.esriStreetUrl
                  }),
                });
              }
      
              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });
            } else if (id == 3) {
              //console.log("tmpl.Map.switchBaseMaps : You are Switch to Google Satellite");
              var esriLayer;

              if(appConfigInfo.esriTileset){

                esriLayer = new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    url: appConfigInfo.esriSatelliteUrl + "/tile/{z}/{y}/{x}",
                    crossOrigin: 'anonymous'
                  }),
                });
              }else{
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.TileArcGISRest({
                    url: appConfigInfo.esriSatelliteUrl
                  }),
                });
              }
              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });
            } else if (id == 4) {
              //console.log("tmpl.Map.switchBaseMaps : You are Switch to ESRI Map");
               var esriLayer;

              if(appConfigInfo.esriTileset){

                esriLayer = new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    url: appConfigInfo.esriLightUrl + "/tile/{z}/{y}/{x}",
                    crossOrigin: 'anonymous'
                  }),
                });
              }else{
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.TileArcGISRest({
                    url: appConfigInfo.esriLightUrl
                  }),
                });
              }
              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });
            }else if (id == 5) {
              //console.log("tmpl.Map.switchBaseMaps : You are Switch to ESRI Map");
               var esriLayer;

              if(appConfigInfo.esriTileset){

                esriLayer = new ol.layer.Tile({
                  source: new ol.source.XYZ({
                    url: appConfigInfo.esriDarkUrl + "/tile/{z}/{y}/{x}",
                    crossOrigin: 'anonymous'
                  }),
                });
              }else{
                esriLayer = new ol.layer.Tile({
                  source: new ol.source.TileArcGISRest({
                    url: appConfigInfo.esriDarkUrl
                  }),
                });
              }
              layers.insertAt(0, esriLayer);
              appConfigInfo.currentMapType = 'ESRI';
              return (response = { status: true, message: "Switch to ESRI Map" });
            }
          }

        }else{        
          //console.log("tmpl.Map.switchBaseMaps : You are Switch to OSM Map"); 

          if (id == 1) {
            var offlineMap = new ol.layer.Tile({
              visible: true,
              source: new ol.source.TileWMS({
                url: appConfigInfo.gwcurl,
                params: {
                  LAYERS: appConfigInfo.trinityLayerNormal,
                  TILED: true,
                  WIDTH: 256,
                  HEIGHT: 256,
                  VERSION: appConfigInfo.wmsVersion,
                },
                serverType: "geoserver",
                SRS: "EPSG:4326",
              }),
            });
            layers.insertAt(0, offlineMap);
            appConfigInfo.currentMapType = 'trinity';
            return (response = { status: true, message: "Switch to trinity Normal Map" });

          }else if (id == 2) {

            var offlineMap = new ol.layer.Tile({
              visible: true,
              source: new ol.source.TileWMS({
                url: appConfigInfo.gwcurl,
                params: {
                  LAYERS: appConfigInfo.trinityLayerDark,
                  TILED: true,
                  WIDTH: 256,
                  HEIGHT: 256,
                  VERSION: appConfigInfo.wmsVersion,
                },
                serverType: "geoserver",
                SRS: "EPSG:4326",
              }),
            });
            layers.insertAt(0, offlineMap);
            appConfigInfo.currentMapType = 'trinity';
            return (response = { status: true, message: "Switch to trinity Dark Mode Map" });

          }



        } 
        console.log("tmpl.Map.switchBaseMaps | Status :", true);
      } catch (error) {
        //console.error("error", error);
        return (response = {
          status: false,
          businesserrorcode: "TB_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          message: error.message,
        });
      }
    } else if (appConfigInfo.mapLib == "leaflet") {
      try {
        if (id == 1) {
          var osmLayer = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
          ).addTo(mapobj);
        } else if (id == 2) {
          var googleLayer = L.tileLayer(
            "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
              maxZoom: 20,
              subdomains: ["mt0", "mt1", "mt2", "mt3"],
            }
          ).addTo(mapobj);
        } else if (id == 3) {
          var googleSatelliteLayer = L.tileLayer(
            "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            {
              maxZoom: 20,
              subdomains: ["mt0", "mt1", "mt2", "mt3"],
            }
          ).addTo(mapobj);
        } else if (id == 4) {
          var esriLayer = L.tileLayer(
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
              //maxZoom: 18,
            }
          ).addTo(mapobj);
        }
        console.log("switchBaseMaps!!", true);
      } catch (error) {
        return (response = {
          status: false,
          businesserrorcode: "TB_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          message: error.message,
        });
      }
    }
  } else {
    try {
      var existing = map.imageryLayers.get(0);
      map.imageryLayers.remove(existing);

      switch (id) {
        case 1:
          var bing = new Cesium.BingMapsImageryProvider({
            url: "https://dev.virtualearth.net",
            key: "Asas_PjvIwsZjJmGnKcUftUyCOEbaVMmq6UpiQZ6mSRTlujHX_GNa30FQGynHoqR",
            mapStyle: Cesium.BingMapsStyle.ROAD,
          });
          map.imageryLayers.addImageryProvider(bing);

          break;

        case 2:
          var arcgisWorldStreetMap = new Cesium.ArcGisMapServerImageryProvider({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
          });
          map.imageryLayers.addImageryProvider(arcgisWorldStreetMap);
          break;
        case 3:
          var esriTopo = new Cesium.ArcGisMapServerImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
            usePreCachedTilesIfAvailable: true,
            enablePickFeatures: false,
          });
          map.imageryLayers.addImageryProvider(esriTopo);
          break;
        case 4:
          var esriDarkGray = new Cesium.ArcGisMapServerImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
            usePreCachedTilesIfAvailable: true,
            enablePickFeatures: false,
          });
          map.imageryLayers.addImageryProvider(esriDarkGray);
          break;
        case 5:
          var esriLightGray = new Cesium.ArcGisMapServerImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
            usePreCachedTilesIfAvailable: true,
            enablePickFeatures: false,
          });
          map.imageryLayers.addImageryProvider(esriLightGray);
          break;
        case 6:
          var openStreetMapProvider = new Cesium.TileMapServiceImageryProvider({
            url: "https://a.tile.openstreetmap.org/",
          });
          map.imageryLayers.addImageryProvider(openStreetMapProvider);
          break;
        // case 7:
        //  var openStreetMapProvider = new Cesium.OpenStreetMapImageryProvider({
        //      url: 'https://a.tile.openstreetmap.org/'
        //  });
        //  map.imageryLayers.addImageryProvider(openStreetMapProvider);
        //  break;
        // case 8:
        //  var openStreetMapProvider = new Cesium.UrlTemplateImageryProvider({
        //      url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //      credit: 'OpenStreetMap'
        //  });
        //  map.imageryLayers.addImageryProvider(openStreetMapProvider);
        //  break;
      }
    } catch (error) {
      console.log("3D Map switchBaseMaps Error..!", error);
    }
  }
  return (response = {
    status: true,
    message: "Switch Base Map API Enabled..",
  });
};

// ********************* SDK_MAP_API (4)resize ********************* //
tmpl.Map.resize = function (param) {
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }
    if (appConfigInfo.mapDimension == "2D") {
      if (appConfigInfo.mapLib == "ol7") {
        if (appConfigInfo.mapData === "google") {
          mapObj.updateSize();
          var layers = mapObj.getLayers();
          var googleLayer = layers.item(0);
          mapObj.removeLayer(googleLayer);
          try {
            layers.insertAt(0, googleLayer);
          } catch (e) { }
        } else {
          mapObj.updateSize();
          var layers = mapObj.getLayers();
          var googleLayer = layers.item(0);
          mapObj.removeLayer(googleLayer);
          try {
            layers.insertAt(0, googleLayer);
          } catch (e) { }
        }
      } else {
        // Function to resize the map
        function resizeMap() {
          mapObj.invalidateSize(); // Refreshes the map tiles and adjusts the map size
        }

        window.addEventListener("resize", resizeMap);
      }
    } else {
      // var imageryLayers = mapObj.imageryLayers;
      // var firstLayer = imageryLayers.get(0);
      // imageryLayers.remove(firstLayer);

      mapObj.resize();
      mapObj.scene.camera.aspectRatio =
        mapObj.canvas.clientWidth / mapObj.canvas.clientHeight;
      mapObj.scene.camera.frustum.aspectRatio =
        mapObj.canvas.clientWidth / mapObj.canvas.clientHeight;
      mapObj.camera.changed = true;
    }

    return (response = { status: true, message: " Map.resize API Enabled.." });
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x010",
        developererrorcode: "TB_GISSDK_0x010",
        businessmessage: "TypeError: Cannot read property",
        developermessage:
          "201 This error occurs when you try to access a property of an undefined or null object.",
        error,
      });
    }
  }
};

// ********************* SDK_MAP_API (4)remove********************* //
var gbl_allClusterLayers = [];
var tmpl_setMap_layer_global = [];
tmpl.Map.remove = function (param) {
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  if (appConfigInfo.mapDimension == "2D") {
    console.log(appConfigInfo.mapLib);
    if (appConfigInfo.mapLib == "ol7") {
      for (var k = 0; k < gbl_allClusterLayers.length; k++) {
        try {
          mapObj.removeLayer(gbl_allClusterLayers[k]);
        } catch (e) { }
      }
      gbl_allClusterLayers = [];

      var allLayers = mapObj.getLayers();
      var layerLength = allLayers.getLength();
      for (var j = 0; j < layerLength; j++) {
        var lyr1 = allLayers.item(j);
        if (lyr1) {
          mapObj.removeLayer(lyr1);
        }
      }
      for (var j = 0; j < tmpl_setMap_layer_global; j++) {
        var lyr1 = tmpl_setMap_layer_global[j].layer;
        if (lyr1) {
          lyr1.setMap(null);
        }
      }

      tmpl_setMap_layer_global = [];
      mapObj.setTarget(null);
      mapObj = null;
    }
    global2DMap = null;
  } else {
    mapObj.entities.removeAll();
    mapObj.destroy();
    global3DMap = null;
    glbHandler = null;
  }
  return (response = { status: true, message: " Map remove API Enabled.." });
};

// ********************* SDK_MAP_API (4)removeWMSLayer********************* //
// tmpl.Map.removeWMSLayer = function (param) {
// 	var mapObj = param.map;
// 	var layerTitle = param.layerTitle;

// 	try {
// 		if (mapObj === null || mapObj === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

// 		}

// 		if (layerTitle === null || layerTitle === undefined || layerTitle === '' || layerTitle === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid layerTitle' };
// 		}

// 	} catch (error) {

// 		if (error instanceof Error) {
// 			// console.log("tmpl.Map.removeWMSLayer   | ", error.message);
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
// 		}

// 	}
// 	try {
// 		if (appConfigInfo.mapDimension == "2D") {
// 			if (appConfigInfo.mapLib == "ol7") {
// 				var Layers = mapObj.getLayers();
// 				var length = Layers.getLength();
// 				for (var i = 0; i < length; i++) {
// 					var existingLayer = Layers.item(i);
// 					if (existingLayer) {
// 						if (existingLayer.get('title') === layerTitle) {
// 							mapObj.removeLayer(existingLayer);
// 						}
// 					}
// 				}
// 			}
// 		}
// 		else {
// 			if (layerTitle != undefined) {
// 				for (var i = 0; i < mapObj.imageryLayers._layers.length; i++) {
// 					// if(mapObj.imageryLayers._layers[i]._imageryProvider._layers == layerTitle){
// 					if (mapObj.imageryLayers._layers[i].imageryProvider.name == layerTitle) {
// 						var wms = mapObj.imageryLayers._layers[i];
// 						mapObj.imageryLayers.remove(wms);
// 					}
// 				}
// 			}
// 			else {
// 				console.error("ERROR: WMS Layer name not specified");
// 			}
// 		}
// 	}
// 	catch (err) {
// 		// console.error("ERROR Map.removeWMSLayer: ", err);
// 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
// 	}

// 	return response = { status: true, message: ' Map.removeWMSLayer API Enabled..' };
// }

//----------------------------------- Beginning of Information Tool ------------------------------------//
function showInfoBox(map, htmlContent) {
  console.log(map);
    if (map && map.infoBox && map.infoBox.container) {
      const selectedEntity = new Cesium.Entity();
        // Show the InfoBox container
        // map.infoBox.container.style.display = 'block';

        // //Set the content (as HTML)
        // map.infoBox.description = new Cesium.ConstantProperty(htmlContent);
       selectedEntity.name = "InfoBox";
        selectedEntity.description = htmlContent;
        map.selectedEntity = selectedEntity;
        console.log(selectedEntity)
        // setTimeout(() => {
        //   const iframe = map.infoBox.container.querySelector("iframe");
        //   if (iframe) {
        //       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        //       const closeButton = iframeDoc.getElementById("closeButton");
        //       if (closeButton) {
        //           closeButton.addEventListener("click", () => {
        //               console.log("Close button clicked!");
        //               map.selectedEntity = null; // Close the InfoBox
        //           });
        //       }
        //   }
        // }, 500);
    }
}


tmpl.Tooltip.add = function (param) {
  var mapObj = param.map;
  var offset = param.offset;
  var coord = param.coordinate;
  var featureDatas = param.html;
  var customProperty = param.id;
  var position;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      featureDatas === null ||
      featureDatas === undefined ||
      featureDatas === "" ||
      featureDatas === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid featureDatas value",
      });
    }

    if (coord === null || coord === undefined || coord === "" || coord === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid coord value",
      });
    }

    if (
      offset === null ||
      offset === undefined ||
      offset === "" ||
      offset === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid offset value",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      // console.log("tmpl.Map.removeWMSLayer   | ", error.message);
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }
  if (appConfigInfo.mapDimension == "2D") {
    var allOverlays = mapObj.getOverlays();

    for (var i = 0; i < allOverlays.getLength(); i++) {
      overlay = allOverlays.item(i);
      if (overlay) {
        if (overlay.get("olname") === "custToolTipOverlay") {
          mapObj.removeOverlay(overlay);
        }
      }
    }
    popup = new ol.Overlay.Popup({
      insertFirst: false,
      panMapIfOutOfView: true,
    });

    popup.id = customProperty;
    popup.setOffset(offset);
    popup.setProperties({ olname: "custToolTipOverlay" });
    popup.getElement().classList.add('ol-popup');
    mapObj.addOverlay(popup);
    if (
      appConfigInfo.mapData === "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl"

    ) {
      position = ol.proj.transform(
        [coord[0], coord[1]],
        "EPSG:4326",
        "EPSG:3857"
      );
    } else {
      position = coord;
    }
    popup.show(position, featureDatas);
  } else {
    // tmpl.Tooltip.addCustomDisplay(param)
    // var longitude = Cesium.Math.toDegrees(coord[0]);
    // var latitude = Cesium.Math.toDegrees(coord[1]);

    // // Remove the existing entity if it exists
    // if (entity) {
    //   map.entities.remove(entity);
    // }

    // // Create a new entity
    // entity = new Cesium.Entity({
    //   position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    //   point: {
    //     color: Cesium.Color.ORANGE,
    //     pixelSize: 10,
    //     outlineColor: Cesium.Color.BLACK,
    //     outlineWidth: 4,
    //     show: true,
    //   },
    //   name: "Tool Tip",
    //   description: description,
    // });

    // map.entities.add(entity);
    // map.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 2500),
    //   duration: 2,
    // });

    // document.getElementsByClassName("cesium-infoBox")[0].style.visibility =
    //   "visible";
    let description = '<div class="cesium-infoBox-defaultTable"></div>';
    description = description+featureDatas

    showInfoBox(mapObj,description)
  }
  return (response = { status: true, message: " Tooltip.add API Enabled.." });
};

tmpl.Tooltip.addMultiple = function (param) {
  var mapObj = param.map;
  var offset = param.offset;
  var coord = param.coordinate;
  var featureDatas = param.html;
  var customProperty = param.id;
  var position;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      featureDatas === null ||
      featureDatas === undefined ||
      featureDatas === "" ||
      featureDatas === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid featureDatas value",
      });
    }

    if (coord === null || coord === undefined || coord === "" || coord === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid coord value",
      });
    }

    if (
      offset === null ||
      offset === undefined ||
      offset === "" ||
      offset === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid offset value",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      // console.log("tmpl.Map.removeWMSLayer   | ", error.message);
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }

  /*var allOverlays = mapObj.getOverlays();
  for(var i=0;i<allOverlays.getLength();i++){
    overlay=allOverlays.item(i);
    if(overlay){
      if(overlay.get('olname') === 'custToolTipOverlay'){
        mapObj.removeOverlay(overlay);
      }
    }
  }*/
  var popup = new ol.Overlay.Popup({
    insertFirst: false,
    panMapIfOutOfView: true,
  });
  popup.id = customProperty;
  popup.setOffset(offset);
  popup.setProperties({ olname: "custToolTipOverlayMultiple" });
  mapObj.addOverlay(popup);
  if (
    appConfigInfo.mapData === "google" ||
    appConfigInfo.mapData == "hereMaps" ||
    appConfigInfo.mapData == "trinity" ||
    appConfigInfo.mapData == "mmi" ||
    appConfigInfo.mapData == "sgl"
  ) {
    position = ol.proj.transform(
      [coord[0], coord[1]],
      "EPSG:4326",
      "EPSG:3857"
    );
  } else {
    position = coord;
  }

  popup.show(position, featureDatas);
  return popup;
  return (response = {
    status: true,
    message: " Tooltip.addMultiple API Enabled..",
  });
};

tmpl.Tooltip.remove = function (param) {
  var mapObj = param.map;
  var overlay;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });

    }
  } catch (error) {
    if (error instanceof Error) {
      // console.log("tmpl.Map.removeWMSLayer   | ", error.message);
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }
  if (appConfigInfo.mapDimension == "2D") {
    var allOverlays = mapObj.getOverlays();
    for (var i = 0; i < allOverlays.getLength(); i++) {
      overlay = allOverlays.item(i);
      if (overlay) {
        if (overlay.get("olname") === "custToolTipOverlay") {
          overlay.setPosition(undefined);
        }
      }
    }
  } else {
    tmpl.Overlay.settooltipFlagToZero();
    document.getElementById("tooltip").remove();
    mapObj.entities.removeById(31121999);
  }
  return (response = {
    status: true,
    message: " Tooltip.remove API Enabled..",
  });
};

//--------------------------------------- End of Information Tool --------------------------------------//

// **** Restricting Map Extent functionality**** //

// var polygon_ex;  remove this variable after checking it is not used in any other functions.

function mapLocation(mapObj, lat_X1, lon_Y1, lat_X2, lon_Y2) {
  var polygon_ex;
  var olGM2 = new olgm.OLGoogleMaps({
    map: mapObj,
  });
  var gmap = olGM2.getGoogleMapsMap();
  var map_cen;
  function setExtend(lat1, lng1, lat2, lng2) {
    var last_perfect_cen, last_zoom;
    var start = new google.maps.LatLng(lat1, lng1);
    var end = new google.maps.LatLng(lat2, lng2);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);

    var convertBounds, x1, y1, x2, y2, extent;
    convertBounds = bounds.toString();
    convertBounds = convertBounds.slice(2, -2);
    convertBounds = convertBounds.split("), (");
    x1 = parseFloat(convertBounds[0].split(",")[0]);
    y1 = parseFloat(convertBounds[0].split(",")[1]);
    x2 = parseFloat(convertBounds[1].split(",")[0]);
    y2 = parseFloat(convertBounds[1].split(",")[1]);

    extent = [y1, x1, y2, x2];
    mapObj.on("moveend", function (e) {
      var centerz = mapObj.getView().getCenter();
      var rp_centerz = ol.proj.transform(
        [centerz[0], centerz[1]],
        "EPSG:3857",
        "EPSG:4326"
      );
      rp_centerz = rp_centerz.toString().split(",");
      polygon_ex = turf.polygon([
        [
          [x1, y1],
          [x1, y2],
          [x2, y2],
          [x2, y1],
          [x1, y1],
        ],
      ]);
      var point = turf.point([
        parseFloat(rp_centerz[1]),
        parseFloat(rp_centerz[0]),
      ]);
      var intersects = turf.intersect(point, polygon_ex);
      if (intersects) {
        var lastcenterz = mapObj.getView().getCenter();
        last_perfect_cen = ol.proj.transform(
          [lastcenterz[0], lastcenterz[1]],
          "EPSG:3857",
          "EPSG:4326"
        );
        last_zoom = mapObj.getView().getZoom();
      } else {
        alert(
          "You are beyond the Project Area,redirecting to previous zoomed center"
        );
        mapObj
          .getView()
          .setCenter(
            ol.proj.transform(
              [last_perfect_cen[0], last_perfect_cen[1]],
              "EPSG:4326",
              "EPSG:3857"
            )
          );
        mapObj.getView().setZoom(last_zoom);
      }
    });
    mapObj.getView().on("propertychange", function (e) {
      var zoomlevel = mapObj.getView().getZoom();
      if (zoomlevel < 9) {
        mapObj.getView().setCenter(lat, lon);
        mapObj.getView().setZoom(21);
      }
    });
  }
  setExtend(lat_X1, lon_Y1, lat_X2, lon_Y2);
}

// **** Please write this function description here **** //

activate = function (mapObj) {
  console.log("activate", mapObj)
  layoutMapObjectAPI=mapObj;
  //function activate(mapObj){
  var popupboolian_title = false;
  mapObj.on("pointermove", function (e) {
    // if (e.dragging) return;
    // var pixel = mapObj.getEventPixel(e.originalEvent);
    // var hit = mapObj.hasFeatureAtPixel(pixel);
    // mapObj.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // mapObj.on('click', function(evt) {
  // var a = document.getElementById('warning-icon');
  //    a.addEventListener('click', function (evnt) {
  //    // alert('Warning icon clicked!');
  // 	console.log(a.getAttribute('value'));
  // });
  // })

  mapObj.on("click", function (evt) {
    // console.log("map click", evt)
    var pixel = mapObj.getEventPixel(evt.originalEvent);
    if (mapObj.hasFeatureAtPixel(pixel)) {
      var layerName;
      var coordinate = evt.coordinate;
      var layerObj;
      var feature = mapObj.forEachFeatureAtPixel(
        evt.pixel,
        function (feature, layer) {
          layerObj = layer;
          //console.log("feature,layer ????",feature,layer);
          if (layer == null) {
            //console.log("feature.get('layer_name') ???",feature.get('layer_name'));
            if (feature.get("layer_name")) {
              layerName = feature.get("layer_name");
              popupboolian_title = false;
              return feature;
            } else {
              popupboolian_title = true;
              return null;
            }
          } else if (layer) {
            if (layer) {
              //console.log(layer.get('title'));
              if (layer.get("title")) {
                layerName = layer.get("title");
                popupboolian_title = false;
                return feature;
              } else {
                popupboolian_title = true;
                return null;
              }
            }
          } else {
            popupboolian_title = true;
          }
        }
      );
      //console.log("popupboolian_title ????",popupboolian_title);
      if (popupboolian_title == false) {
        var geometry = feature.getGeometry();
        var coord;
        // if(appConfigInfo.mapData==='google'){
        if (
          appConfigInfo.mapData == "google" ||
          appConfigInfo.mapData == "hereMaps" ||
          appConfigInfo.mapData == "mmi" ||
          appConfigInfo.mapData == "trinity" ||
          appConfigInfo.mapData == "sgl"
        ) {
          //console.log(geometry);
          coord = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
        } else {
          coord = evt.coordinate;
        }
        var id;
        //test1 = feature;
        if (feature.get("id") === undefined) {
          id = null;
        } else {
          id = feature.get("id");
        }

        if(id == null && appConfigInfo.type == 'esri'){
          id = feature.getId() || null;
        }

        var properties = feature.getProperties();

        if (
          id == "c_" + feature_poi_edit_id &&
          layerName == feature_poi_edit_layer + "_API_CircleLayer"
        ) {
          feature_poi_edit_layer_callback(id, coord, layerName, properties);
        } else if (
          feature_spatial_edit_id == id &&
          feature_spatial_edit_layer == layerName
        ) {
          feature_spatial_edit_layer_callback(id, coord, layerName, properties);
        } else {
          //alert()
          //test12 = layerObj;

          if (layerObj != null) {
            if (layerObj.get("cluster") == true) {
              //alert();
              var ids = [],
                properties1 = [];
              for (var k = 0; k < feature.get("features").length; k++) {
                ids[k] = feature.get("features")[k].get("id");
                properties1[k] = feature.get("features")[k].getProperties();
              }

              getOverlayFeatureDetails(
                ids,
                coord,
                layerName,
                properties1,
                mapObj
              );
            } else if (layerName == "Draw_Route_Layer") {
              tmpl.Geocode.getGeocode({
                point: coord,
                callbackFunc: handleGeocode,
              });
              function handleGeocode(a) {
                //console.log(a.address);
                properties.address = a.address;
                //console.log(id,coord,layerName,properties);
                getOverlayFeatureDetails(
                  id,
                  coord,
                  layerName,
                  properties,
                  mapObj
                );
              }
            } else {
              getOverlayFeatureDetails(
                id,
                coord,
                layerName,
                properties,
                mapObj
              );
            }
          } else {
            //console.log("else3");
            //console.log(id,coord,layerName,properties,mapObj);
            getOverlayFeatureDetails(id, coord, layerName, properties, mapObj);
          }
        }
      }
    } else {
      if (tmpl.Info.getPlaceFlag == true) {
        if (
          appConfigInfo.mapData == "google" ||
          appConfigInfo.mapData == "hereMaps" ||
          appConfigInfo.mapData == "trinity" ||
          appConfigInfo.mapData == "mmi" ||
          appConfigInfo.mapData == "sgl"

        ) {
          var coordinate = evt.coordinate;
          coordinate = ol.proj.transform(coordinate, "EPSG:3857", "EPSG:4326");
          var x = parseFloat(coordinate[0]);
          var y = parseFloat(coordinate[1]);
          var coordinates = { lat: y, lng: x };
          var result = {};

          tmpl.Geocode.getGeocode({
            point: [x, y],
            callbackFunc: handleGeocode,
          });
          function handleGeocode(a) {
            console.log("response adress", a.address);
            result = {
              place: [a.address],
              latitude: y,
              longitude: x,
              type: "Place",
            };
            resultStatus = true;
            tmpl.Info.getPlace.CallbackFunc(result);
  
          }
          // var geocoder = new google.maps.Geocoder();
          // geocoder.geocode(
          //   {
          //     latLng: coordinates,
          //   },
          //   function (results, status) {
          //     if (status == google.maps.GeocoderStatus.OK) {
          //       if (results[0]) {
          //         //console.log(results[0]);
          //         var place = results[0].formatted_address;
          //         var placeName = place;
          //         result = {
          //           place: [placeName],
          //           latitude: y,
          //           longitude: x,
          //           type: results[0].types.join(),
          //         };
          //         resultStatus = true;
          //       }
          //     }

          //     tmpl.Info.getPlace.CallbackFunc(result);
          //   }
          // );
        } else {
          var coordinate = evt.coordinate;
          //coordinate = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
          var x = parseFloat(coordinate[0]);
          var y = parseFloat(coordinate[1]);
          var coordinates = { lat: y, lng: x };
          var result = {};
          //console.log(x,y);
          if (appConfigInfo.mapData == "pentab") {
            tmpl.Geocode.getGeocode({
              point: [x, y],
              callbackFunc: handleGeocode,
            });
            function handleGeocode(a) {
              console.log("response adress", a.address);
              result = {
                place: [a.address],
                latitude: y,
                longitude: x,
                type: "Place",
              };
              resultStatus = true;
              tmpl.Info.getPlace.CallbackFunc(result);

            }

          } else {
            function handleLandMarks(data) {
              //alert();
              //console.log(data);
              result = {
                place: [data[0].name],
                latitude: y,
                longitude: x,
                type: data[0].type,
              };
              //console.log("result >>",result);
              tmpl.Info.getPlace.CallbackFunc(result);
            }

            tmpl.Search.getLandMarks({
              map: map,
              point: [x, y],
              radius: 20000,
              POI_type: "all",
              Max_num_POIs: 1,
              callbackFunc: handleLandMarks,
            });
          }




        }
      }
    }
  });
};

// **** creating a custom Overlay and adding that layer to the layer switcher **** //
function getFeatureLabel() {
  var feature_mouseOver = map.forEachFeatureAtPixel(
    evt.pixel,
    function (feature, layer) {
      if (layer) {
        if (layer.get("trip") == "TripAnimationLayer") {
          return feature;
        }
      }
    }
  );
  ta_tooltip.style.display = feature_mouseOver ? "" : "none";
  if (feature_mouseOver) {
    overlay_mouseOver_trip.setPosition(evt.coordinate);
    ta_tooltip.innerHTML =
      feature_mouseOver.getProperties().location +
      "," +
      "Speed:" +
      feature_mouseOver.getProperties().speed +
      "," +
      feature_mouseOver.getProperties().date +
      "," +
      feature_mouseOver.getProperties().time;
  }
}

//--------------------------------- Beginning of Google Map services -----------------------------------//

// **** This function will zoom the map to the Search Box resulted location **** //

function zoomToSearch(mapObj, lon, lat, ext, plName, img_url, height, width) {
  if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "trinity" ||
    appConfigInfo.mapData == "mmi" || appConfigInfo.mapData == "sgl"
  ) {
    if (ext != null) {
      mapObj
        .getView()
        .fit(
          ol.proj.transformExtent(ext, "EPSG:4326", "EPSG:3857"),
          mapObj.getSize()
        );
      mapObj
        .getView()
        .setCenter(
          ol.proj.transform(
            [parseFloat(lon), parseFloat(lat)],
            "EPSG:4326",
            "EPSG:3857"
          )
        );
      loadSingleMarkerOverlaySearch(
        mapObj,
        lon,
        lat,
        plName,
        img_url,
        height,
        width
      );
    } else {
      mapObj.getView().setZoom(12);
      mapObj
        .getView()
        .setCenter(
          ol.proj.transform(
            [parseFloat(lon), parseFloat(lat)],
            "EPSG:4326",
            "EPSG:3857"
          )
        );
      loadSingleMarkerOverlaySearch(
        mapObj,
        lon,
        lat,
        plName,
        img_url,
        height,
        width
      );
    }
    mapObj.getView().setZoom(appConfigInfo.searchZoom);
  } else if (appConfigInfo.mapData == "hereMaps") {
    console.log("Mapzome:", lon, lat);
    console.log("map view:", mapObj.getView());
    //mapObj.getView().setCenter([lat,lon]);
    //mapObj.getView().setZoom(15);
    tmpl.Zoom.toXYcustomZoom({
      map: mapObj,
      zoom: 17,
      latitude: lat,
      longitude: lon,
    });
    loadSingleMarkerOverlaySearch(
      mapObj,
      lon,
      lat,
      plName,
      img_url,
      height,
      width
    );
  } else if (appConfigInfo.mapData == 'mmi') {
    mapObj.getView().setZoom(15);
    mapObj.getView().setCenter(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
    loadSingleMarkerOverlaySearch(mapObj, lon, lat, plName, img_url, height, width);
  } else {
    mapObj.getView().setCenter([lon, lat]);
    mapObj.getView().setZoom(appConfigInfo.searchZoom);
    loadSingleMarkerOverlaySearch(
      mapObj,
      lon,
      lat,
      plName,
      img_url,
      height,
      width
    );
  }
}

// **** This function will add the Search Box result location as animated marker to the map **** //

function loadSingleMarkerOverlaySearch(
  mapObj,
  lon,
  lat,
  plName,
  img_url,
  height,
  width
) {
  img_url = appConfigInfo.mapSDKURL + "api_img/Arrow-Down.gif";
  height = 60;
  width = 25;
  if (img_url == undefined) {
    var overlayID = mapObj.getOverlayById("searchOverlayID");

    if (overlayID) {
      mapObj.removeOverlay(overlayID);
    }
    var container = document.createElement("div");
    container.className = "containerAPI ";
    var labelDiv = document.createElement("div");
    labelDiv.className = "bottomleft";
    labelDiv.innerHTML = plName;
    container.appendChild(labelDiv);
    var marker_pos = new ol.Overlay({
      id: "searchOverlayID",
      element: container,
      offset: [-10, -35],
      positioning: "center",
    });
    mapObj.addOverlay(marker_pos);
    if (
      appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl"


    ) {
      marker_pos.setPosition(
        ol.proj.transform(
          [parseFloat(lon), parseFloat(lat)],
          "EPSG:4326",
          "EPSG:3857"
        )
      );
    } else {
      marker_pos.setPosition([lon, lat]);
    }
    marker_pos.setProperties({ olname: "searchOverlay" });
    setTimeout(function () {
      tmpl.Overlay.removeMarker({ map: mapObj, id: "searchOverlayID" });
    }, 5000);
  } else {
    var overlayID = mapObj.getOverlayById("searchOverlayID");
    if (overlayID) {
      mapObj.removeOverlay(overlayID);
    }
    var container = document.createElement("div");
    container.className = "containerAPI ";
    var elem = document.createElement("img");
    elem.setAttribute("src", img_url);
    elem.setAttribute("height", height);
    elem.setAttribute("width", width);

    container.style.top = "-14vh"; //("top", '-14vh');
    container.style.top = "-2vh"; //("left", '-2vh');   //@sh added

    var labelDiv = document.createElement("div");
    labelDiv.className = "bottomleft";
    labelDiv.innerHTML = plName;
    container.appendChild(elem);
    container.appendChild(labelDiv);
    var marker_pos = new ol.Overlay({
      id: "searchOverlayID",
      element: container,
      offset: [-10, -40], //@sh changed for icon gif location
      positioning: "center",
    });
    mapObj.addOverlay(marker_pos);
    if (
      appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl"
    ) {
      marker_pos.setPosition(
        ol.proj.transform(
          [parseFloat(lon), parseFloat(lat)],
          "EPSG:4326",
          "EPSG:3857"
        )
      );
    } else {
      marker_pos.setPosition([lon, lat]);
    }
    marker_pos.setProperties({ olname: "searchOverlay" });
    setTimeout(function () {
      tmpl.Overlay.removeMarker({ map: mapObj, id: "searchOverlayID" });
    }, 5000);
  }
}

// **** This function removes the Search marker **** //

function removeAddSearchMarker(mapObj) {
  var olyrID = mapObj.getOverlayById("searchOverlayID");
  if (olyrID) {
    mapObj.removeOverlay(olyrID);
  }
}

//-------------------------- Beginning of Zoom to location, Extent and Layer ---------------------------//

// **** Zoom to specified Layer **** //

tmpl.Zoom.getZoom = function (param) {
  var mapObj = param.map;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      // console.log("tmpl.Map.removeWMSLayer   | ", error.message);
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }
  var zoomlevel = mapObj.getView().getZoom();
  return zoomlevel;

  // return response = { status: true, message: ' Zoom.getZoom API Enabled..' };
};

tmpl.Zoom.zoom = function (param) {
  var mapObj = param.map;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      // console.log("tmpl.Map.removeWMSLayer   | ", error.message);
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }

  var zoomLevel = param.zoomLevel;
  mapObj.getView().setZoom(zoomLevel);
  return (response = { status: true, message: " Zoom.zoom API Enabled.." });
};

//----------------------------------- Beginning of Layer Updations -------------------------------------//

// **** It calculates the Extent of Base Map**** //

tmpl.Extent.calculate = function (param) {
  var mapObj = param.map;
  var extent;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: false,
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    var a = mapObj.getView().calculateExtent(mapObj.getSize());
    extent = [
      parseFloat(a[0]),
      parseFloat(a[1]),
      parseFloat(a[2]),
      parseFloat(a[3]),
    ];
    if (
      appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl"

    ) {
      extent = ol.proj.transformExtent(extent, "EPSG:3857", "EPSG:4326");
    }
    var response = { status: true, data: extent };
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
};

tmpl.Extent.calculateWKT = function (param) {
  var mapObj = param.map;
  var extent = tmpl.Extent.calculate({ map: mapObj });
  var extentWkt;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl"


    ) {
      var polygeom = ol.geom.Polygon.fromExtent(extent);
      var format = new ol.format.WKT();
      extentWkt = format.writeGeometry(polygeom);
    }

    var response = { status: true, data: extentWkt };
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }

  return {
    status: true,
    message: "tmpl.Extent.calculateWKT executed successfully",
  };
};

tmpl.Extent.getExtentOnPan = function (param) {
  var mapObj = param.map;
  var flag = param.flag;
  var zoomValue = param.zoom || 19;
  var onFeatureEnterPolygon = param.visibleCallBack;
  var callbackFunc = param.callbackFunc;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (flag === null || flag === undefined || flag === "" || flag === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid flag value",
      });
    }

    if (callbackFunc === "" || callbackFunc === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callbackFunc",
      });
    }

    var extendPanOff = mapObj.get("moveendObjForgetExtendOnPan");
    mapObj.unByKey(extendPanOff);

    if (flag) {
      var moveendVrbl = mapObj.on("moveend", function (e) {
        var view_port = mapObj.getView().calculateExtent(mapObj.getSize());
        if (
          appConfigInfo.mapData == "google" ||
          appConfigInfo.mapData == "hereMaps" ||
          appConfigInfo.mapData == "trinity" ||
          appConfigInfo.mapData == "mmi" ||
          appConfigInfo.mapData == "sgl"

        ) {
          view_port = ol.proj.transformExtent(
            view_port,
            "EPSG:3857",
            "EPSG:4326"
          );
        }

        var res = { status: true, data: view_port };
        var zoomVal = mapObj.getView().getZoom();
        if (zoomVal > zoomValue) {
          const [minX, minY, maxX, maxY] = res.data;

          // Compute centroid of the extent
          const centroid = [(minX + maxX) / 2, (minY + maxY) / 2];

          console.log("Centroid:", centroid);

          // var notifiedFeatures = new Set();
          const layerWrapper = tmpl_setMap_layer_global_array[0];
          if (!layerWrapper || !layerWrapper.layer || !layerWrapper.layer.getSource) return;

          const features = layerWrapper.layer.getSource().getFeatures();

          // 1. Find the specific polygon where the centroid lies
          const polygonWithCentroid = globalPolygons.find(polygon =>
            pointInPolygon(centroid, polygon)
          );
          console.log('layerWrapper', (layerWrapper.type).toLowerCase())

          if (!polygonWithCentroid) {
            console.log("Centroid not inside any polygon.");
            return;
          }

          console.log("Centroid lies inside a polygon.");

          // 2. Check each feature if it's in the *same* polygon
          features.forEach((feature) => {
            const geometry = feature.getGeometry();
            const coords = geometry.getCoordinates();
            const lonLat = ol.proj.toLonLat(coords);
          

            if( (layerWrapper.type).toLowerCase() == 'building'){
              const isInSamePolygon = pointInPolygon(lonLat, polygonWithCentroid);
              console.log("Feature lonlat:", lonLat, "Inside same polygon?", isInSamePolygon);
  
              if (isInSamePolygon) {
                alert(`Found building Id : ${feature.getId()}`);
                onFeatureEnterPolygon(feature);
              }
            }
          });

          // function onFeatureEnterPolygon(feature) {
          //   const id = feature.getId();

          //   if (notifiedFeatures.has(id)) return;
          //   notifiedFeatures.add(id);

          //   const props = feature.getProperties();

          //   console.log('Feature inside polygon:', {
          //     id: id,
          //     label: props.label,
          //     lat: props.lat,
          //     lon: props.lon,
          //     all: props
          //   });
          // }
        }

        callbackFunc(res);
      });
      mapObj.set("moveendObjForgetExtendOnPan", moveendVrbl);
    } else {
      var extendPanOff = mapObj.get("moveendObjForgetExtendOnPan");
      if (extendPanOff) {
        mapObj.unByKey(extendPanOff);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }
  }

  return {
    status: true,
    message: "tmpl.Extent.getExtentOnPan executed successfully",
  };
};

function pointInPolygon(point, vs) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

var multi_track_zoom_map = [];
tmpl.Track.vehicle = function (param) {
  // alert('Track.vehicle');
  this.map = param.map;
  this.vehicle_img = param.vehicle_img;
  this.route_color = param.route_color;
  this.getHoverLabel = param.getHoverLabel;
  this.icon_scale = param.icon_scale;
  this.label = param.label;
  this.angle = param.angle;
  this.track_ivlDraw;
  this.markerFlag = false;
  this.layerFlag = false;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      vehicle_img === null ||
      vehicle_img === undefined ||
      vehicle_img === "" ||
      vehicle_img === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid vehicle_img ",
      });
    }

    if (
      route_color === null ||
      route_color === undefined ||
      route_color === "" ||
      route_color === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid route_color",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: err.message,
      });
    }

    this.track_end_marker = new ol.layer.Vector({
      source: new ol.source.Vector(),
    });
    this.track_line_layer = new ol.layer.Vector({
      source: new ol.source.Vector(),
    });
    this.previousP = [];
    this.currentP = [];
    this.previous = [];
    this.current_track_flag = false;
    this.route_width;
    this.first_add_icon = false;
    if (param.route_width == undefined) this.route_width = 4;
    else this.route_width = param.route_width;
    this.multi_track_zoom_map_index = multi_track_zoom_map.length;
    multi_track_zoom_map.push(this);
  }

  return (response = { status: true, message: " Track.vehicle API Enabled.." });
};

tmpl.Track.vehicle.prototype = {
  startTrack: function (param) {
    var point = param.position;
    this.pos = [point[0], point[1]];
    this.previous.push(point);
    if (this.first_add_icon == false) {
      var pt = [];
      pt[0] = point[0];
      pt[1] = point[1];
      if (appConfigInfo.mapData == "google" ||
        appConfigInfo.mapData == "mmi" ||
        appConfigInfo.mapData == "sgl" ||
        appConfigInfo.mapData == "trinity") {
        pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:3857");
      } else {
        pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:4326");
      }

      var point = new ol.geom.Point(pt);
      var p_fea = new ol.Feature(point);
      var scale = 1;
      if (this.icon_scale != undefined) scale = this.icon_scale;
      var angle = 0;
      if (this.angle != undefined) angle = this.angle;
      p_fea.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: this.vehicle_img,
            scale: scale,
            rotation: angle,
          }),
        })
      );
      p_fea.set("layer_name", "track_layer");
      p_fea.set("label", this.label);
      this.track_end_marker = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [p_fea],
        }),
      });

      console.log("this.pos >>", this.pos);
      this.multipleTrackMapZoom(this);
      //map.addLayer(parent.track_end_marker);
      this.track_end_marker.setMap(this.map);
      this.markerFlag = true;
      this.first_add_icon = true;

      var parentMap = this.map;
      if (this.getHoverLabel == true) {
        var ta_tooltip = document.createElement("tooltip");
        ta_tooltip.id = "trip-tooltip";
        ta_tooltip.className = "ol-trip-tooltip";
        var overlay_mouseOver_label = new ol.Overlay({
          element: ta_tooltip,
          offset: [10, 0],
          positioning: "bottom-left",
        });

        parentMap.addOverlay(overlay_mouseOver_label);
        parentMap.on("pointermove", function (evt) {
          var feature_mouseOver = parentMap.forEachFeatureAtPixel(
            evt.pixel,
            function (feature, layer) {
              if (layer == null) {
                if (feature.get("layer_name") == "track_layer") {
                  return feature;
                }
              }
            }
          );
          ta_tooltip.style.display = feature_mouseOver ? "" : "none";
          if (feature_mouseOver) {
            overlay_mouseOver_label.setPosition(evt.coordinate);
            ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
          }
        });
      }
    }
    if (this.previous.length > 1) {
      if (this.current_track_flag == false) {
        this.current_track_flag = true;
        this.sendToTrack();
      }
    } else {
      this.current_track_flag = false;
    }
  },
  //hererrrrrr
  sendToTrack: function () {
    var parent = this;
    var directionX = (this.previous[1][0] - this.previous[0][0]) / 50;
    var directionY = (this.previous[1][1] - this.previous[0][1]) / 50;
    var i = 0;
    var prevLayer;
    var newEndPt;
    var angle = rotate({
      x1: this.previous[0][0],
      y1: this.previous[0][1],
      x2: this.previous[1][0],
      y2: this.previous[1][1],
    });

    if (
      this.previous[0][0] == this.previous[1][0] &&
      this.previous[0][1] == this.previous[1][1]
    ) {
      this.previous.splice(0, 1);
      if (this.previous.length > 1) {
        this.sendToTrack();
      } else {
        this.current_track_flag = false;
      }
    } else {
      parent.track_ivlDraw = setInterval(function () {
        var map = parent.map;
        if (i > 50) {
          clearInterval(parent.track_ivlDraw);
          parent.previous.splice(0, 1);
          if (parent.previous.length > 1) {
            parent.sendToTrack();
          } else {
            parent.current_track_flag = false;
          }
          // return;
        } else {
          newEndPt = [
            parent.previous[0][0] + i * directionX,
            parent.previous[0][1] + i * directionY,
          ];
          var latlng = new google.maps.LatLng(newEndPt[1], newEndPt[0]);

          if (parent.layerFlag == false) {
            parent.previousP[0] = newEndPt[0];
            parent.previousP[1] = newEndPt[1];
            if (appConfigInfo.mapData == "google") {
              parent.previousP = ol.proj.transform(
                parent.previousP,
                "EPSG:4326",
                "EPSG:3857"
              );
            } else {
              parent.previousP = ol.proj.transform(
                parent.previousP,
                "EPSG:4326",
                "EPSG:3857"
              );
            }

            parent.track_line_layer = new ol.layer.Vector({
              source: new ol.source.Vector(),
              style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: parent.route_color,
                  width: parent.route_width,
                }),
              }),
            });
            //parent.track_line_layer.setMap(map);
            map.addLayer(parent.track_line_layer);
            parent.layerFlag = true;
          } else {
            parent.currentP[0] = newEndPt[0];
            parent.currentP[1] = newEndPt[1];
            var current;
            if (appConfigInfo.mapData == "google") {
              current = ol.proj.transform(
                parent.currentP,
                "EPSG:4326",
                "EPSG:3857"
              );
            } else {
              current = ol.proj.transform(
                parent.currentP,
                "EPSG:4326",
                "EPSG:3857"
              );
            }

            var line = new ol.geom.LineString([parent.previousP, current]);
            var fea = new ol.Feature(line);
            parent.track_line_layer.getSource().addFeature(fea);
            parent.previousP = current;
          }
          if (parent.markerFlag == false) {
            var pt = [];
            pt[0] = newEndPt[0];
            pt[1] = newEndPt[1];
            if (appConfigInfo.mapData == "google") {
              pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:3857");
            } else {
              pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:3857");
            }

            var point = new ol.geom.Point(pt);
            var p_fea = new ol.Feature(point);
            p_fea.setStyle(
              new ol.style.Style({
                image: new ol.style.Icon({
                  src: parent.vehicle_img,
                }),
              })
            );
            parent.track_end_marker = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [p_fea],
              }),
            });
            //map.addLayer(parent.track_end_marker);
            parent.track_end_marker.setMap(map);
            parent.markerFlag = true;
          } else {
            parent.pos = newEndPt;
            //parent.multipleTrackMapZoom(parent);
            if (isNaN(angle) == false)
              parent.track_end_marker
                .getSource()
                .getFeatures()[0]
                .getStyle()
                .getImage()
                .setRotation(angle);
            if (appConfigInfo.mapData == "google") {
              parent.track_end_marker
                .getSource()
                .getFeatures()[0]
                .getGeometry()
                .setCoordinates(
                  ol.proj.transform(newEndPt, "EPSG:4326", "EPSG:3857")
                );
            } else {
              parent.track_end_marker
                .getSource()
                .getFeatures()[0]
                .getGeometry()
                .setCoordinates(
                  ol.proj.transform(newEndPt, "EPSG:4326", "EPSG:3857")
                );
            }
          }
          i = i + 1;
        }
      }, 10000 / 50);
    }
  },
  clearTrack: function () {
    clearInterval(this.track_ivlDraw);
    this.track_end_marker.getSource().clear();
    this.track_line_layer.getSource().clear();
    this.layerFlag = false;
    this.markerFlag = false;
    this.first_add_icon = false;
    this.previousP = [];
    this.currentP = [];
    this.previous = [];
    this.current_track_flag = false;
    this.firstTimeMoving = true;
    try {
      var index = this.multi_track_zoom_map_index;
      multipleTrackMapZoomLayer.getSource().clear();
    } catch (e) { }
  },
  routeVehicle: function (param) {
    var visibility = param.visibility;
    var map = param.map;
    if (visibility) this.track_end_marker.setMap(map);
    else this.track_end_marker.setMap(null);
  },
  routeLayer: function (param) {
    var visibility = param.visibility;
    var map = param.map;
    this.track_line_layer.setVisible(visibility);
  },
  multipleTrackMapZoom: function (obj) {
    var coordinate = [parseFloat(obj.pos[0]), parseFloat(obj.pos[1])];
    coordinate = ol.proj.transform(coordinate, "EPSG:4326", "EPSG:3857");
    var geometry = new ol.geom.Point(coordinate);
    var featureval = new ol.Feature({
      geometry: geometry,
    });
    try {
      if (obj.feaPOS == undefined) {
        obj.feaPOS = multipleTrackMapZoomLayer.getSource().getFeatures().length;
        multipleTrackMapZoomLayer.getSource().addFeature(featureval);
      } else {
        if (
          multipleTrackMapZoomLayer.getSource().getFeatures()[obj.feaPOS] ==
          undefined
        ) {
          obj.feaPOS = multipleTrackMapZoomLayer
            .getSource()
            .getFeatures().length;
          multipleTrackMapZoomLayer.getSource().addFeature(featureval);
        } else {
          multipleTrackMapZoomLayer
            .getSource()
            .getFeatures()
          [obj.feaPOS].getGeometry()
            .setCoordinates(coordinate);
        }
      }
    } catch (e) { }
    //console.log("EEEE >>>",multipleTrackMapZoomLayer.getSource().getFeatures().length);
    if (multipleTrackMapZoomLayer.getSource().getFeatures().length > 1) {
      try {
        var extent = multipleTrackMapZoomLayer.getSource().getExtent();
        var view_port = obj.map.getView().calculateExtent(obj.map.getSize());
        var vehicle_inside = featureval
          .getGeometry()
          .intersectsExtent(view_port);
        if (vehicle_inside == false) {
          obj.map.getView().fit(extent, obj.map.getSize());
        }
      } catch (e) { }
    } else {
      try {
        var view_port = obj.map.getView().calculateExtent(obj.map.getSize());
        var vehicle_inside = featureval
          .getGeometry()
          .intersectsExtent(view_port);
        if (vehicle_inside == false) {
          //console.log("sss");
          obj.map.getView().setCenter(coordinate);
        }
      } catch (e) { }
      if (multipleTrackMapZoomLayerFlag) {
        tmpl.Zoom.toXYcustomZoom({
          map: obj.map,
          latitude: obj.pos[1],
          longitude: obj.pos[0],
          zoom: 16,
        });
        multipleTrackMapZoomLayerFlag = false;
      }
    }
  },
};

var multipleTrackMapZoomLayerFlag = true;
var multipleTrackMapZoomLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});

var trackVehicleObjDyn;
var track_line_layer_dyn;
var track_end_marker_dyn;
var mapObjDyn;
var trackvehdelaay = 20;

tmpl.Track.singleVehicle = function (param) {
  console.log("Track.singleVehicle:", param);
  this.map = param.map;
  console.log(this.map);
  this.vehicle_img = param.vehicle_img;
  this.route_color = param.route_color;
  this.getHoverLabel = param.getHoverLabel;
  this.icon_scale = param.icon_scale;
  this.label = param.label;
  this.angle = param.angle;
  //this.id = param.id;
  //this.rendering_type = param.rendering_type;
  this.zoom = param.zoom;
  if (this.zoom == undefined) this.zoom = 15;
  this.features = param.features;

  // this.track_ivlDraw;
  this.markerFlag = false;
  this.layerFlag = false;
  this.track_end_marker = new ol.layer.Vector({
    source: new ol.source.Vector(),
  });
  this.track_line_layer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: this.route_color,
        width: 2,
      }),
    }),
  });
  // console.log('this.track_line_layer ==> ',this.track_line_layer);
  // console.log('this.track_end_marker ==> ',this.track_end_marker);

  track_line_layer_dyn = this.track_line_layer;
  track_end_marker_dyn = this.track_end_marker;
  mapObjDyn = this.map;
  //  console.log("param.map,this.map,mapObjDyn::", param.map, this.map, mapObjDyn);
  this.first_time_zoom_flag = false;
  this.first_add_icon = false;

  this.previousP = [];
  this.currentP = [];

  this.previous = [];
  this.current_track_flag = false;
  this.route_width;
  if (param.route_width == undefined) this.route_width = 4;
  else this.route_width = param.route_width;
  this.previousTime = [];
  this.previousData = [];
  this.TrackSpeed = 5000;
  this.skipedVehicleFlag = param.skipedVehicleFlag;
  // this.skipedVehicleFlag;

  this.map.unByKey(pointerMoveID);

  if (this.skipedVehicleFlag != true) {
    var mapDiv = document.getElementById(globalMapDivID);

    var toggleLayersDiv = document.createElement("div");
    toggleLayersDiv.className = "trackToggleLayers";
    toggleLayersDiv.id = "trackToggleTrackLayers";
    mapDiv.appendChild(toggleLayersDiv);
    toggleLayersDiv.style.position = "absolute";
    toggleLayersDiv.style.display = "flex";
    toggleLayersDiv.style.justifyContent = "center";
    toggleLayersDiv.style.top = "8%";
    toggleLayersDiv.style.right = "10px";
    toggleLayersDiv.style.padding = "5px";
    // toggleLayersDiv.style.width = "25%";
    toggleLayersDiv.style.backgroundColor = "white";
    toggleLayersDiv.style.borderRadius = "5px";
    toggleLayersDiv.style.opacity = "1.0";
    toggleLayersDiv.style.zIndex = "4";

    var routelineCheckbox = document.createElement("input");
    routelineCheckbox.id = "trackcheckrouteline";
    routelineCheckbox.type = "checkbox";
    routelineCheckbox.name = "Route Line";
    routelineCheckbox.value = "Route Line";
    routelineCheckbox.style.margin = "auto";
    routelineCheckbox.style.marginLeft = "10px";
    routelineCheckbox.checked = true;
    toggleLayersDiv.appendChild(routelineCheckbox);
    routelineCheckbox.onclick = routeLinevisibility;
    document.getElementById("trackToggleTrackLayers").append("Route Line");

    var routevehicleCheckbox = document.createElement("input");
    routevehicleCheckbox.id = "trackcheckresource";
    routevehicleCheckbox.type = "checkbox";
    routevehicleCheckbox.name = "Resource";
    routevehicleCheckbox.value = "Resource";
    routevehicleCheckbox.style.margin = "auto";
    routevehicleCheckbox.style.marginLeft = "10px";
    routevehicleCheckbox.checked = true;
    toggleLayersDiv.appendChild(routevehicleCheckbox);
    routevehicleCheckbox.onclick = resourcevisibility;
    document.getElementById("trackToggleTrackLayers").append("Workforce Info");

    var infoCheckbox = document.createElement("input");
    infoCheckbox.id = "trackcheckinfobox";
    infoCheckbox.type = "checkbox";
    infoCheckbox.name = "Infobox";
    infoCheckbox.value = "Infobox";
    infoCheckbox.style.margin = "auto";
    infoCheckbox.style.marginLeft = "10px";
    infoCheckbox.checked = true;
    //toggleLayersDiv.appendChild(infoCheckbox); //@sh disabled
    infoCheckbox.onclick = infoboxvisibility;
    // document.getElementById("trackToggleTrackLayers").append("Info");

    var workforceCheckbox = document.createElement("input");
    workforceCheckbox.id = "workforceTrack";
    workforceCheckbox.type = "checkbox";
    workforceCheckbox.name = "Route Deviation";
    workforceCheckbox.value = "Route Deviation";
    workforceCheckbox.checked = true;
    toggleLayersDiv.appendChild(workforceCheckbox);
    // deviatedpointCheckbox.onclick = routeLinevisibility;
    workforceCheckbox.onclick = toggleInfoTable
    document.getElementById("trackToggleTrackLayers").append("Resource Info");

    // document.getElementById("workforceTrack").onclick = function () {
    //   var checkStatus = document.getElementById("workforceTrack").checked;
    //   if (checkStatus) {
    //     workforceTrackCallback(checkStatus);
    //   } else {
    //     workforceTrackCallback(checkStatus);
    //   }
    // };

    // From here for delay
    var delayTextDiv = document.createElement("div");
    delayTextDiv.innerHTML = "<b>Delay</b>";
    delayTextDiv.id = "delayTextDiv";
    delayTextDiv.style.margin = "auto";
    delayTextDiv.style.marginLeft = "10px";
    // toggleLayersDiv.appendChild(delayTextDiv);

    var trackdelayDropdown = document.createElement("select");
    trackdelayDropdown.id = "trackdelayDropdown";
    trackdelayDropdown.onchange = trackDelayOnChange;
    trackdelayDropdown.style.marginLeft = "4px";
    //toggleLayersDiv.appendChild(trackdelayDropdown);
    var trackDelayoption1 = document.createElement("option");
    trackDelayoption1.innerHTML = "none";
    trackDelayoption1.value = "-1";
    //trackdelayDropdown.appendChild(trackDelayoption1);
    var trackDelayoption2 = document.createElement("option");
    trackDelayoption2.innerHTML = "1 min";
    trackDelayoption2.value = "60";
    //trackdelayDropdown.appendChild(trackDelayoption2);
    var trackDelayoption3 = document.createElement("option");
    trackDelayoption3.innerHTML = "2 mins";
    trackDelayoption3.value = "120";
    //trackdelayDropdown.appendChild(trackDelayoption3);
    var trackDelayoption4 = document.createElement("option");
    trackDelayoption4.innerHTML = "3 mins";
    trackDelayoption4.value = "180";
    //trackdelayDropdown.appendChild(trackDelayoption4);

    function trackDelayOnChange() {
      var val = document.getElementById("trackdelayDropdown").value;
      console.log("trackvehdelaay value changed ===> ", val);
      trackvehdelaay = val;
    }

    // var clearTrack = document.createElement('button');
    // clearTrack.className = 'clearTrack';
    // clearTrack.innerHTML = 'Clear Track';
    // clearTrack.style.marginLeft = "10px";
    // clearTrack.style.backgroundColor = "#4CAF50";
    // clearTrack.style.border = "none";
    // clearTrack.style.color = "white";
    // clearTrack.style.padding = "5px 10px";
    // clearTrack.style.textAlign = "center";
    // clearTrack.style.cursor = "pointer";
    // clearTrack.onclick = clearTrackRoute;
    // clearTrack.onmouseenter = function(){clearTrack.style.backgroundColor = "red";}
    // clearTrack.onmouseleave = function(){clearTrack.style.backgroundColor = "#4CAF50";}
    // toggleLayersDiv.appendChild(clearTrack);

    var clearTrack = document.createElement("BUTTON");
    clearTrack.className = "clearTrack";
    clearTrack.innerHTML = '<i class="fa fa-times fa-lg"></i>';
    clearTrack.title = "Clear Track";
    clearTrack.style.marginLeft = "10px";
    clearTrack.style.backgroundColor = "gray";
    clearTrack.style.border = "none";
    clearTrack.style.color = "black";
    // clearTrack.style.padding = "5px 10px";
    clearTrack.style.cursor = "pointer";
    clearTrack.onclick = function () {
      clearTrackRoute();
      if (param.callbackFunc) {
        var clearRespnse = {
          track: "stop",
          features: param.features,
          message: "Vehice Trackeing stopped",
        };
        param.callbackFunc(clearRespnse);
      }
    };
    // clearTrack.onmouseenter = function(){clearTrack.style.backgroundColor = "red";}
    // clearTrack.onmouseleave = function(){clearTrack.style.backgroundColor = "#4CAF50";}
    toggleLayersDiv.appendChild(clearTrack);

    // TABLES
    var infoTableDiv = document.createElement("div");
    infoTableDiv.className = "trackdataTable";
    infoTableDiv.id = "trackinfoTable";
    mapDiv.appendChild(infoTableDiv);
    var infoTableRowsDiv = document.createElement("div");
    infoTableRowsDiv.className = "rows";
    infoTableDiv.appendChild(infoTableRowsDiv);
    infoTableRowsDiv.innerHTML =
      '<table style="font-size: 14px"><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle No : </td><td id= "trackresourceDiv"></td><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle Type : </td><td id= "trackcallSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Position : </td><td id= "trackpositionDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Speed : </td><td id= "trackspeedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Location : </td><td id= "tracklocationDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Time : </td><td id="trackdateTimeDiv"></td></tr></table>';

    infoTableDiv.style.position = "absolute";
    infoTableDiv.style.top = "20%";
    infoTableDiv.style.right = "10px";
    infoTableDiv.style.width = "20%";
    infoTableDiv.style.zIndex = "4";

    infoTableRowsDiv.style.position = "relative";
    // infoTableRowsDiv.style.top = "2px";
    // infoTableRowsDiv.style.left = "2px";
    infoTableRowsDiv.style.backgroundColor = "white";
    infoTableRowsDiv.style.opacity = "1.0";
    infoTableRowsDiv.style.borderRadius = "5px";
    infoTableRowsDiv.style.padding = "5px";
  }
};




// Function to toggle visibility of infoTableDiv
function toggleInfoTable() {
  var toggleCheckbox = document.getElementById('workforceTrack');
  var infoTableDiv = document.getElementById('trackinfoTable');
  if (toggleCheckbox.checked == true) {
    infoTableDiv.style.display = 'block';
  } else {
    infoTableDiv.style.display = 'none';
  }
}




function routeLinevisibility() {
  try {

    var checkStatus = document.getElementById("trackcheckrouteline").checked;
    console.log("checkStatus:", checkStatus);
    if (checkStatus == false) {
      console.log(
        "resourcevisibility:",
        trackVehicleObjDyn,
        mapObjDyn,
        "false"
      );
      if (appConfigInfo.mapDimension == '2D') {
        trackVehicleObjDyn.routeLayer({
          map: mapObjDyn,
          visibility: false,
        });
        tmpl.Map.resize({ map: mapObjDyn });
      } else {
        gbl_lineEntity.forEach(element => {
          gbl_3DMapObj.entities.remove(element);
        });

      }

    } else {
      console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "true");
      if (appConfigInfo.mapDimension == '2D') {
        trackVehicleObjDyn.routeLayer({
          map: mapObjDyn,
          visibility: true,
        });
        tmpl.Map.resize({ map: mapObjDyn });
      } else {
        gbl_lineEntity.forEach(element => {
          gbl_3DMapObj.entities.add(element);
        });
      }
    }
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

function resourcevisibility() {
  try {
    var checkStatus = document.getElementById("trackcheckresource").checked;
    console.log("checkStatus:", checkStatus);
    if (checkStatus == false) {
      console.log(
        "resourcevisibility:",
        trackVehicleObjDyn,
        mapObjDyn,
        "false"
      );
      if (appConfigInfo.mapDimension == '2D') {
        trackVehicleObjDyn.routeVehicle({
          map: mapObjDyn,
          visibility: false,
        });
        tmpl.Map.resize({ map: mapObjDyn });
      } else {
        gbl_3DMapObj.entities.remove(gbl_vehicleEntity);
      }
    } else {
      console.log("resourcevisibility:", trackVehicleObjDyn, mapObjDyn, "true");
      if (appConfigInfo.mapDimension == '2D') {
        trackVehicleObjDyn.routeVehicle({
          map: mapObjDyn,
          visibility: true,
        });
        tmpl.Map.resize({ map: mapObjDyn });
      } else {
        gbl_3DMapObj.entities.add(gbl_vehicleEntity);
      }
    }
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

function infoboxvisibility() {
  try {
    var checkStatus = document.getElementById("trackcheckinfobox").checked;
    if (checkStatus == false) {
      document.getElementById("trackinfoTable").style.visibility = "hidden";
    } else {
      document.getElementById("trackinfoTable").style.visibility = "visible";
    }
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

function clearTrackRoute() {
  try {
    console.log("clearTrackRoute:", mapObjDyn);
    trackVehicleObjDyn.clearTrack({
      map: this.trackMapObject,
      callbackFunc: function () {
        console.log("ROUTE CLEARED");
      },
    });

    // clearSWMTrackRoute();
    // clearTrackCallback();
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

trackVehicleObjDyn = tmpl.Track.singleVehicle.prototype = {
  startTrack: function (param) {
    //  console.log("tmpl.Track.singleVehicle:startTrack", param);
    var point = param.position;
    this.previous.push(point);
    this.previousTime.push(param.time);
    this.previousData.push(param.data);
    this.vehicle_img = param.icon;
    if (this.first_add_icon == false) {
      var pt = [];
      pt[0] = point[0];
      pt[1] = point[1];
      if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "mmi"
        || appConfigInfo.mapData == "sgl" || appConfigInfo.mapData === 'trinity') {
        pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:3857");
      } else {
        pt = ol.proj.transform([pt[0], pt[1]], "EPSG:4326", "EPSG:4326");
      }
      var point1 = new ol.geom.Point(pt);
      var p_fea = new ol.Feature(point1);
      var scale = 1;
      if (this.icon_scale != undefined) scale = this.icon_scale;
      var angle1 = 0;
      if (this.angle != undefined) {
        angle1 = this.angle;
      } else {
        angle1 = param.angle;
        this.angle = param.angle;
      }

      //   console.log(this.vehicle_img);
      //   console.log("this.previousData == > ", this.previousData);
      // trackDetailsUpdate(
      // this.previousData[0][0],this.previousData[0][1],
      // (this.previousData[0][2] + "").substring(0, 9)
      // + "," + (this.previousData[0][3]+ "").substring(0, 9),
      // this.previousData[0][7],
      // this.previousData[0][4],
      // this.previousData[0][8]+' '+this.previousData[0][9]+' '+this.previousData[0][12]);

      p_fea.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: this.vehicle_img,
            scale: scale,
            rotation: angle1,
          }),
        })
      );
      p_fea.set("layer_name", "track_layer");
      p_fea.set("label", param.name);
      //  console.log(this.features);

      if (this.features) {
        var getdata = this.features;
        for (var i = 0, length = getdata.length; i < length; i++) {
          console.log(getdata[i]);
          p_fea.setProperties(getdata[i]);
        }
      }

      this.track_end_marker = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [p_fea],
        }),
      });
      this.track_end_marker.setMap(this.map);
      track_end_marker_dyn = this.track_end_marker;
      // tmpl.Layer.changeVisibility({map: this.map, layer: 'track_layer', visible: false});

      // tmpl.Layer.changeVisibility({map: this.map, layer: 'track_layer', visible: true});
      this.markerFlag = true;
      this.first_add_icon = true;
      //  console.log("this.map; ===> ", this.map);
      var parentMap = this.map;
      if (this.getHoverLabel == true) {
        var ta_tooltip = document.createElement("tooltip");
        ta_tooltip.id = "trip-tooltip";
        ta_tooltip.className = "ol-trip-tooltip";
        var overlay_mouseOver_label = new ol.Overlay({
          element: ta_tooltip,
          offset: [10, 0],
          positioning: "bottom-left",
        });
        parentMap.addOverlay(overlay_mouseOver_label);
        var ta_tooltip1 = document.createElement("tooltip");
        ta_tooltip1.id = "trip-tooltip";
        ta_tooltip1.className = "ol-trip-tooltip";
        var overlay_mouseOver_label1 = new ol.Overlay({
          element: ta_tooltip1,
          offset: [10, 0],
          positioning: "bottom-left",
        });
        parentMap.addOverlay(overlay_mouseOver_label1);
        parentMap.on("pointermove", function (evt) {
          var lineMousehover = false;

          var feature_mouseOver = parentMap.forEachFeatureAtPixel(
            evt.pixel,
            function (feature, layer) {
              //console.log(layer,layer.get('layer_name'), feature.get('layer_name'))
              if (layer == null) {
                console.log(feature.get("layer_name"));
                if (feature.get("layer_name") == "track_layer") {
                  lineMousehover = false;
                  return feature;
                } else if (feature.get("layer_name") == "track_line") {
                  lineMousehover = true;
                  return feature;
                }
              } else {
                console.log(feature.get("layer_name"));
                if (feature.get("layer_name") == "track_layer") {
                  lineMousehover = false;
                  return feature;
                } else if (feature.get("layer_name") == "track_line") {
                  lineMousehover = true;
                  return feature;
                }
              }
            }
          );

          ta_tooltip1.style.display = "none";
          ta_tooltip.style.display = "none";
          if (feature_mouseOver) {
            overlay_mouseOver_label.setPosition(evt.coordinate);
            if (lineMousehover == true) {
              //	console.log("line");
              ta_tooltip.style.display = feature_mouseOver ? "" : "none";
              ta_tooltip.innerHTML =
                feature_mouseOver.get("speed") +
                "kph " +
                feature_mouseOver.get("date_time");
            } else {
              //	console.log("vehicle");
              ta_tooltip.style.display = feature_mouseOver ? "" : "none";
              ta_tooltip1.style.display = "none";
              //ta_tooltip.style.display = 'none';
              ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
            }
          }
        });
      }
    }
    if (this.first_time_zoom_flag === false) {
      if (this.skipedVehicleFlag != true) {
        var pt1 = point;
        //console.log("this.previousData[0][0]:::",this.previousData[0][0]);
        trackDetailsUpdate(
          this.previousData[0][0].simNo,
          this.previousData[0][0].workforceUserId,
          this.previousData[0][0].lon + "," + this.previousData[0][0].lat,
          this.previousData[0][0].place,
          this.previousData[0][0].speed,
          this.previousData[0][0].time
        );

        tmpl.Zoom.toXYcustomZoom({
          map: this.map,
          latitude: pt1[1],
          longitude: pt1[0],
          zoom: 15,
        });
        this.first_time_zoom_flag = true;
      }
    }

    if (this.previous.length > 1) {
      if (this.current_track_flag == false) {
        this.sendToTrack();
        globalTrackSameLatLngFlag = false;
        this.current_track_flag = true;
      }
    }
  },
  sendToTrack: function () {
    var parent = this;
    // parent.track_line_layer.setMap(this.map);
    track_line_layer_dyn.setMap(this.map);
    // var trackvehdelaay=-1;
    // var tempTime1 = this.previousTime[1].slice(0, 8);
    // var tempTime2 = this.previousTime[0].slice(0, 8);
    var tempTime1 = this.previousTime[1].slice(-8);
    var tempTime2 = this.previousTime[0].slice(-8);
    //  console.log(tempTime1, tempTime2);
    var s = time_diff(tempTime1, tempTime2);
    // console.log("TIME DELAY ===>", s);
    s =
      parseInt(s.split(":")[0] * 60 * 60) +
      parseInt(s.split(":")[1] * 60) +
      parseInt(s.split(":")[2]);
    s = parseInt(s);
    //  console.log(trackvehdelaay);
    var trackvehdelay = false;
    if (trackvehdelaay == -1) {
      trackvehdelay = false;
    } else {
      trackvehdelay = s > trackvehdelaay;
    }
    if (trackvehdelay) {
      //  console.log("s true " + s);
      //  console.log("trackvehdelaay     " + trackvehdelaay);
      //  console.log(s > trackvehdelaay);
      // console.log(
      //   "this.previousData ==========> ",
      //   this.previousData[1][0].time
      // );
      // trackDetailsUpdate(
      // this.previousData[1][0],this.previousData[1][1],
      // (this.previousData[1][2] + "").substring(0, 9)
      // + "," + (this.previousData[1][3]+ "").substring(0, 9),
      // this.previousData[1][7],
      // this.previousData[1][4],
      // this.previousData[1][8]+' '+this.previousData[1][9]+' '+this.previousData[1][12]);
      trackDetailsUpdate(
        this.previousData[1][0].simNo,
        this.previousData[1][0].workforceUserId,
        this.previousData[1][0].lon + "," + this.previousData[1][0].lat,
        this.previousData[1][0].place,
        this.previousData[1][0].speed,
        this.previousData[1][0].time
      );

      globalTrackSameLatLngFlag = true;
      this.skipTrack(
        this.previous[1],
        this.previous[0],
        this.previousTime[1],
        this.previousData[0][1],
        this.previousData[0],
        this.vehicle_img,
        this.angle
      );
    } else {
      // console.log("s  false "+s)
      // console.log("trackvehdelaay     "+trackvehdelaay)
      // console.log(s > trackvehdelaay);
      // console.log("PREVIOUS DATA TO UPDATE TRACK STATUS ====>", this.previousData);
      // trackDetailsUpdate(
      // this.previousData[1][0],this.previousData[1][1],
      // (this.previousData[1][2] + "").substring(0, 9)
      // + "," + (this.previousData[1][3]+ "").substring(0, 9),
      // this.previousData[1][7],
      // this.previousData[1][4],
      // this.previousData[1][8]+' '+this.previousData[1][9]+' '+this.previousData[1][12]);
      trackDetailsUpdate(
        this.previousData[1][0].simNo,
        this.previousData[1][0].workforceUserId,
        this.previousData[1][0].lon + "," + this.previousData[1][0].lat,
        this.previousData[1][0].place,
        this.previousData[1][0].speed,
        this.previousData[1][0].time
      );
      // var parent = this;
      var directionX = (this.previous[1][0] - this.previous[0][0]) / 50;
      var directionY = (this.previous[1][1] - this.previous[0][1]) / 50;
      var i = 0;
      var prevLayer;
      var newEndPt;
      var angle = rotate({
        x1: this.previous[0][0],
        y1: this.previous[0][1],
        x2: this.previous[1][0],
        y2: this.previous[1][1],
      });
      if (isNaN(angle) == false) {
        this.angle = angle;
      }
      this.trackSpeed = s * 1000 - 1000;
      if (this.previous.length >= 4) {
        // this.trackSpeed = 2000;
        this.trackSpeed = this.trackSpeed - 2000;
      } else {
        // this.trackSpeed = 5000;
        this.trackSpeed = this.trackSpeed;
      }
      //  console.log("trackSpeed", this.trackSpeed);
      // parent.track_ivlDraw = setInterval(function () {
      track_ivlDraw = setInterval(function () {
        var map = parent.map;
        if (i > 50) {
          // clearInterval(parent.track_ivlDraw);
          clearInterval(track_ivlDraw);
          parent.previous.splice(0, 1);
          parent.previousTime.splice(0, 1);
          parent.previousData.splice(0, 1);

          if (parent.previous.length > 1) {
            parent.sendToTrack();
          } else {
            parent.current_track_flag = false;
            // arrat\y contains single packet
            globalTrackSameLatLngFlag = true;
          }
          // return;
        } else {
          newEndPt = [
            parent.previous[0][0] + i * directionX,
            parent.previous[0][1] + i * directionY,
          ];
          //var latlng = new google.maps.LatLng(newEndPt[1], newEndPt[0]);

          if (parent.layerFlag == false) {
            var temp = newEndPt;
            if (appConfigInfo.mapData == "google") {
              temp = ol.proj.transform(temp, "EPSG:4326", "EPSG:3857");
            } else {
              temp = ol.proj.transform(temp, "EPSG:4326", "EPSG:3857");
            }

            // parent.previousP[0] = newEndPt[0];
            // parent.previousP[1] = newEndPt[1];
            parent.previousP[0] = temp[0];
            parent.previousP[1] = temp[1];

            parent.layerFlag = true;
          } else {
            //console.log("a");
            //console.log("previous11 >>>",parent.previousP);
            parent.currentP[0] = newEndPt[0];
            parent.currentP[1] = newEndPt[1];
            //console.log("previous22 >>>",parent.previousP);
            var current = parent.currentP;
            if (appConfigInfo.mapData == "google") {
              current = ol.proj.transform(current, "EPSG:4326", "EPSG:3857");
            } else {
              current = ol.proj.transform(current, "EPSG:4326", "EPSG:3857");
            }
            // console.log("previous, current >>>",parent.previousP, current);

            var line = new ol.geom.LineString([parent.previousP, current]);

            var fea = new ol.Feature(line);
            var data = {
              //rendering_type : 2,
              layer_name: "track_line",
              speed: parent.previousData[1][4],
              date_time: moment(
                parent.previousData[1][8] + " " + parent.previousData[1][9]
              ).format("DD-MM-YYYY hh:mm:ss A"),
            };
            fea.setProperties(data);
            // parent.track_line_layer.getSource().addFeature(fea);
            track_line_layer_dyn.getSource().addFeature(fea);
            parent.previousP = current;
            //console.log("previousP >>>",parent.previousP);
          }
          if (parent.markerFlag == false) {
            var pt = [];
            pt[0] = newEndPt[0];
            pt[1] = newEndPt[1];
            // if(appConfigInfo.mapData == "google"){
            // pt = ol.proj.transform([pt[0],pt[1]], 'EPSG:4326', 'EPSG:3857');
            // }
            var point = new ol.geom.Point(pt);
            var p_fea = new ol.Feature(point);
            p_fea.setStyle(
              new ol.style.Style({
                image: new ol.style.Icon({
                  src: parent.vehicle_img,
                }),
              })
            );
            parent.track_end_marker = new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [p_fea],
              }),
            });
            //map.addLayer(parent.track_end_marker);
            map.addLayer(parent.track_end_marker);
            track_end_marker_dyn = parent.track_end_marker;
            parent.markerFlag = true;
          } else {
            parent.panMap(newEndPt);
            if (isNaN(angle) == false) {
              // console.log('parent.track_end_marker ==> ',parent.track_end_marker);
              if (
                parent.track_end_marker.getSource().getFeatures().length > 0
              ) {
                parent.track_end_marker
                  .getSource()
                  .getFeatures()[0]
                  .getStyle()
                  .getImage()
                  .setRotation(angle);
              } else {
              }
              // parent.track_end_marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
            } else {
            }
            if (
              appConfigInfo.mapData == "google" ||
              appConfigInfo.mapData == "hereMaps" ||
              appConfigInfo.mapData == "mmi" ||
              appConfigInfo.mapData == "sgl" ||
              appConfigInfo.mapData == "trinity"
            ) {
              if (
                parent.track_end_marker.getSource().getFeatures().length > 0
              ) {
                parent.track_end_marker
                  .getSource()
                  .getFeatures()[0]
                  .getGeometry()
                  .setCoordinates(
                    ol.proj.transform(newEndPt, "EPSG:4326", "EPSG:3857")
                  );
              } else {
                parent.track_end_marker
                  .getSource()
                  .getFeatures()[0]
                  .getGeometry()
                  .setCoordinates(
                    ol.proj.transform(newEndPt, "EPSG:4326", "EPSG:3857")
                  );
              }
              // parent.track_end_marker.getSource().getFeatures()[0].getGeometry().setCoordinates(ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857'));
            } else {
              parent.track_end_marker
                .getSource()
                .getFeatures()[0]
                .getGeometry()
                .setCoordinates(newEndPt);
            }
          }
          i = i + 1;
        }
      }, this.trackSpeed / 50);
    }
    //}
  },
  panMap: function (point) {
    var map = this.map;
    var current = point;
    if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" || appConfigInfo.mapData == "sgl") {
      current = ol.proj.transform(current, "EPSG:4326", "EPSG:3857");
    } else {
      current = ol.proj.transform(current, "EPSG:4326", "EPSG:3857");
    }
    var currentgps = new ol.geom.Point(current);
    var cur_veh = new ol.Feature(currentgps);
    try {
      var view_port = map.getView().calculateExtent(map.getSize());
      var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
      if (vehicle_inside == false) {
        map.getView().setCenter(current);
      }
    } catch (e) {
      console.log("from api track error handled");
    }
  },
  clearTrack: function (param) {
    var map = this.map;
    console.log("clear track map object ===> ", param);
    var callback = param.callbackFunc;
    console.log("callback===> ", callback);
    if (param) {
      // clearInterval(this.track_ivlDraw);
      clearInterval(track_ivlDraw);
      // for(i=0; i<100; i++){
      // window.clearInterval(i);
      // }
      // this.track_end_marker.getSource().clear();
      // this.track_line_layer.getSource().clear();
      if (track_end_marker_dyn && track_end_marker_dyn.getSource()) {
        track_end_marker_dyn.getSource().clear();
      }

      if (track_line_layer_dyn && track_line_layer_dyn.getSource()) {
        track_line_layer_dyn.getSource().clear();
      }


      if (pathLayer && pathLayer.getSource()) {
        pathLayer.getSource().clear();
        pathLayer=undefined;
      }


      if (movingFeatureLayer && movingFeatureLayer.getSource()) {
        movingFeatureLayer.getSource().clear();
        movingFeatureLayer=undefined;
      }


      if (tripStartIcon) {
        tripStartIcon.getSource().clear();
      }

      this.layerFlag = false;
      this.markerFlag = false;
      this.first_add_icon = false;
      this.first_time_zoom_flag = false;
      this.previousP = [];
      this.currentP = [];
      this.previous = [];
      this.previousTime = [];
      this.previousData = [];

      this.current_track_flag = false;
      pathLayer = undefined;

      // tmpl.Layer.clearData({map: map, layer: 'SkipTrackMarker'});

      Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
      };
      NodeList.prototype.remove = HTMLCollection.prototype.remove =
        function () {
          for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
            }
          }
        };
      var infoTable = document.getElementById("trackinfoTable");
      if (infoTable) {
        infoTable.remove();
      }
      var toggleContainer = document.getElementById("trackToggleTrackLayers");
      if (toggleContainer) {
        toggleContainer.remove();
      }
      if (callback) {
        callback();
      }
    } else {
      clearInterval(this.track_ivlDraw);
      // this.track_end_marker.getSource().clear();
      // this.track_line_layer.getSource().clear();
      track_end_marker_dyn.getSource().clear();
      track_line_layer_dyn.getSource().clear();
      this.layerFlag = false;
      this.markerFlag = false;
      this.first_add_icon = false;
      this.first_time_zoom_flag = false;
      this.previousP = [];
      this.currentP = [];
      this.previous = [];
      this.previousTime = [];
      this.previousData = [];

      this.current_track_flag = false;

      tmpl.Layer.clearData({ map: map, layer: "SkipTrackMarker" });

      Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
      };
      NodeList.prototype.remove = HTMLCollection.prototype.remove =
        function () {
          for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
              this[i].parentElement.removeChild(this[i]);
            }
          }
        };
      var infoTable = document.getElementById("trackinfoTable");
      if (infoTable) {
        infoTable.remove();
      }
      var toggleContainer = document.getElementById("trackToggleTrackLayers");
      if (toggleContainer) {
        toggleContainer.remove();
      }
    }
  },
  skipTrack: function (pos, prevPos, time, name, data, icon, angle) {
    // console.log("skipped");
    //   console.log("SKIP TRACK DATA ==> ", pos, time, name, data, icon, angle);

    clearInterval(this.track_ivlDraw);
    this.track_end_marker.getSource().clear();
    this.layerFlag = false;
    this.markerFlag = false;
    this.first_add_icon = false;
    // this.first_time_zoom_flag = false;
    this.previousP = [];
    this.currentP = [];
    this.previous = [];
    this.previousTime = [];
    this.previousData = [];
    this.current_track_flag = false;

    //////
    var iconFeatures = [];
    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.transform(prevPos, "EPSG:4326", "EPSG:3857")
      ),
      name: "SkipTrackMarker",
    });
    iconFeature.set("layer_name", "SkipTrackMarker");
    iconFeature.set("title", "SkipTrackMarker");
    iconFeatures.push(iconFeature);

    var vectorSource = new ol.source.Vector({
      features: iconFeatures,
    });

    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        //    anchor: [0.5, 46],
        //    anchorXUnits: 'fraction',
        //    anchorYUnits: 'pixels',
        //    opacity: 0.75,
        src: icon,
      }),
    });

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: iconStyle,
    });
    tmpl_setMap_layer_global.push({
      layer: vectorLayer,
      title: "SkipTrackMarker",
      visibility: true,
      map: this.map,
    });
    vectorLayer.setMap(this.map);

    //////

    vehicleObj = new tmpl.Track.singleVehicle({
      map: this.map,
      vehicle_img: icon,
      route_width: 4,
      route_color: this.route_color,
      // icon_scale : 0.6,
      getHoverLabel: this.getHoverLabel,
      label: "ddddd",
      skipedVehicleFlag: true,
    });
    vehicleObj.startTrack({
      position: pos,
      time: time,
      name: name,
      data: data,
      icon: icon,
      angle: angle,
    });
  },
  routeVehicle: function (param) {
    var visibility = param.visibility;
    var map = param.map;
    //if(visibility)
    // this.track_end_marker.setVisible(visibility);
    if (track_end_marker_dyn) {
      track_end_marker_dyn.setVisible(visibility);
    }

    if (movingFeatureLayer) {
      movingFeatureLayer.setVisible(visibility)
    }

    // else
    //this.track_end_marker.setMap(null);
  },
  routeLayer: function (param) {
    var visibility = param.visibility;
    var map = param.map;
    // this.track_line_layer.setVisible(visibility);

    if (track_line_layer_dyn) {
      track_line_layer_dyn.setVisible(visibility);
    }

    if (pathLayer) {
      pathLayer.setVisible(visibility);
    }


  },
};

function trackDetailsUpdate(
  resourceId,
  callSign,
  position,
  location,
  speed,
  time,
  nogpsstatus
) {


  resourceId = (resourceId == null || resourceId == undefined) ? 'NA' : resourceId;
  callSign = (callSign == null || callSign == undefined) ? 'NA' : callSign;
  position = (position == null || position == undefined) ? 'NA' : position;
  location = (location == null || location == undefined) ? 'NA' : location;
  speed = (speed == null || speed == undefined) ? '0 km/hr' : speed;
  time = (time == null || time == undefined) ? 'NA' : time;
  nogpsstatus = (nogpsstatus == null || nogpsstatus == undefined) ? 'NA' : nogpsstatus;


  if (position !== null && position !== undefined) {

    try {

      var coordinates = position.split(',');

      var longitude = parseFloat(coordinates[0]);
      var latitude = parseFloat(coordinates[1]);

      // Limit the decimal points to 4
      longitude = longitude.toFixed(6);
      latitude = latitude.toFixed(6);


      position = longitude + ',' + latitude;


    } catch (error) {
      console.log(":", error.message);
    }
  }

  $("#trackresourceDiv").html(resourceId);
  $("#trackcallSignDiv").html(callSign);
  $("#trackpositionDiv").html(position);
  $("#tracklocationDiv").html(location);
  $("#trackspeedDispDiv").html(parseFloat(speed).toFixed(0)+" kmph");

  $("#trackdateTimeDiv").html(time);
  if (nogpsstatus == 0) {
    $("#gpsstatustrack").show();
    $("#vehiclegpsstatusDiv").html("No GPS");
  } else {
    $("#gpsstatustrack").hide();
  }
}

// ******** Track End ********** //

tmpl.Route.getDistanceTime = function (param) {
  var mapObj = param.map;
  var origin = param.origin;
  var destination = param.destination;
  var callbackFunc = param.callbackFunc;
  var dataTable = param.dataTable;
  var distanceDetails = [];
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: destination,
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    function (response, status) {
      if (status !== "OK") {
        console.log("Error was: ", status);
      } else {
        var results = response.rows[0].elements;
        for (var j = 0; j < results.length; j++) {
          var data = {
            Distance: results[j].distance.text,
            Duration: results[j].duration.text,
            DurationValue: results[j].duration.value,
          };
          distanceDetails.push(data);
        }
      }
      callbackFunc(distanceDetails, dataTable);
    }
  );
};

tmpl.Route.cancelOnClick = function (param) { };

tmpl.Route.onClick = function (param) {
  var click_source_route;
  var click_destination_route = [];
  var map1 = param.map;
  var sourceImg = param.sourceImg;
  var destinationImg = param.destinationImg;
  var radius1 = param.radius;
  var callbackFunc = param.callbackFunc;
  var bufferCallback = param.bufferCallbackFunc;
  var iconArray = [sourceImg, destinationImg];
  var callbackResult = null;

  // tmpl.Route.clearRoute({map : map1});

  var startPointAddress = null;
  var endPointAddress = null;
  var newLayer = new ol.layer.Vector({
    lname: "route_onclik",
    source: new ol.source.Vector(),
  });
  if (click_destination_route.length == 0) {
    tmpl.Draw.draw({
      map: map1,
      type: "Point",
      callbackFunc: getDrawFeatureDetails,
    });
    function getDrawFeatureDetails(coord, feature, wktGeom, value) {
      console.log("COORD: ", coord);
      click_destination_route.push(coord);
      var projCoord = ol.proj.transform(coord, "EPSG:4326", "EPSG:3857");
      var pointdata = new ol.geom.Point(projCoord);
      // console.log("pointdata: ",pointdata);
      var feature2 = new ol.Feature({
        geometry: pointdata,
      });
      feature2.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            src: sourceImg,
            anchor: [0.5, 1],
          }),
        })
      );
      newLayer.getSource().addFeature(feature2);
      map1.addLayer(newLayer);

      tmpl.Draw.clear({
        map: map1,
      });
      tmpl.Draw.draw({
        map: map1,
        type: "Point",
        callbackFunc: getDrawFeature,
      });
      function getDrawFeature(coord, feature, wktGeom, value) {
        click_destination_route.push(coord);
        newLayer.getSource().clear();
        tmpl.Route.getRoute({
          map: map1,
          source: click_destination_route[0],
          destination: click_destination_route[1],
          sourceIcon: sourceImg, //"img/1.png",
          destinationIcon: destinationImg, //"img/2.png",
          radius: radius1, //20,
          callbackFunc: routeDetails,
          getGeometry: test,
        });

        function routeDetails(
          resETA,
          cordStart,
          cordEnd,
          coordinateArray,
          ETA_legs,
          wktGeom
        ) {
          console.log(
            "--->>>>>>>>>>>>>>>>>>>>>>",
            resETA,
            cordStart,
            cordEnd,
            coordinateArray,
            ETA_legs,
            wktGeom
          );
          if (appConfigInfo.mapDataService == "esri") {
            var cordStart4326 = cordStart;
            var cordEnd4326 = cordEnd;
          } else if (appConfigInfo.mapData == "hereMaps") {
            var cordStart4326 = ol.proj.transform(
              cordStart,
              "EPSG:4326",
              "EPSG:3857"
            );
            var cordEnd4326 = ol.proj.transform(
              cordEnd,
              "EPSG:4326",
              "EPSG:3857"
            );
          } else {
            var cordStart4326 = ol.proj.transform(
              cordStart,
              "EPSG:3857",
              "EPSG:4326"
            );
            var cordEnd4326 = ol.proj.transform(
              cordEnd,
              "EPSG:3857",
              "EPSG:4326"
            );
          }
          callbackResult = {
            ETA: resETA,
            startCoord: cordStart4326,
            endCoord: cordEnd4326,
            coordinateArray: coordinateArray,
            wktGeom: wktGeom,
            ETA_legs: ETA_legs,
          };
          callbackFunc(callbackResult);
        }
        tmpl.Draw.clear({
          map: map1,
        });
        function test(data) {
          bufferCallback(data);
          console.log(
            "click_destination_route[0] >>>",
            click_destination_route[0]
          );
          tmpl.Geocode.getGeocode({
            point: click_destination_route[0],
            callbackFunc: handleGeocode,
          });
          function handleGeocode(addrs) {
            var result = {
              route: data,
              geocode: addrs,
            };
            // callbackFunc(result);
          }

          var dragedFeature;
          window.app = {};
          var app = window.app;
          var format = new ol.format.WKT();
          app.Drag = function () {
            ol.interaction.Pointer.call(this, {
              handleDownEvent: app.Drag.prototype.handleDownEvent,
              handleDragEvent: app.Drag.prototype.handleDragEvent,
              handleMoveEvent: app.Drag.prototype.handleMoveEvent,
              handleUpEvent: app.Drag.prototype.handleUpEvent,
            });
            this.coordinate_ = null;
            this.cursor_ = "pointer";
            this.feature_ = null;
            this.previousCursor_ = undefined;
          };
          ol.inherits(app.Drag, ol.interaction.Pointer);

          app.Drag.prototype.handleDownEvent = function (evt) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(
              evt.pixel,
              function (feature, layer) {
                // console.log(layer.get('lname'));
                if (layer == null) {
                  if (feature.get("lname") == "routeVector") {
                    return feature;
                  }
                } else if (layer.get("lname") == "routeVector") {
                  if (
                    feature.get("fname") == "source" ||
                    feature.get("fname") == "destination"
                  )
                    return feature;
                }
              }
            );

            if (feature) {
              this.coordinate_ = evt.coordinate;
              this.feature_ = feature;
            }
            return !!feature;
          };

          app.Drag.prototype.handleDragEvent = function (evt) {
            // alert("handleMoveEvent1");
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(
              evt.pixel,
              function (feature, layer) {
                return feature;
              }
            );
            var deltaX = evt.coordinate[0] - this.coordinate_[0];
            var deltaY = evt.coordinate[1] - this.coordinate_[1];
            var geometry = this.feature_.getGeometry();
            geometry.translate(deltaX, deltaY);
            this.coordinate_[0] = evt.coordinate[0];
            this.coordinate_[1] = evt.coordinate[1];
          };

          app.Drag.prototype.handleMoveEvent = function (evt) {
            // alert("handleMoveEvent2");
            if (this.cursor_) {
              var map = evt.map;
              var feature = map.forEachFeatureAtPixel(
                evt.pixel,
                function (feature, layer) {
                  return feature;
                }
              );
              var element = evt.map.getTargetElement();
              if (feature) {
                editFeature = feature;
                point = feature.getGeometry().getCoordinates();
                var point;
                if (
                  appConfigInfo.mapData === "google" ||
                  appConfigInfo.mapData == "hereMaps" ||
                  appConfigInfo.mapData == "trinity" ||
                  appConfigInfo.mapData == "mmi" ||
                  appConfigInfo.mapData == "sgl"
                ) {
                  point = ol.proj.transform(point, "EPSG:3857", "EPSG:4326");
                } else {
                  // do notng
                }
                //point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
                if (element.style.cursor != this.cursor_) {
                  this.previousCursor_ = element.style.cursor;
                  element.style.cursor = this.cursor_;
                }
              } else if (this.previousCursor_ !== undefined) {
                element.style.cursor = this.previousCursor_;
                this.previousCursor_ = undefined;
              }
            }
          };

          app.Drag.prototype.handleUpEvent = function (evt) {
            var value = this.feature_.getGeometry().getType();
            if (value === "Point") {
              lonlat = this.feature_.getGeometry();
            } else if (value === "LineString") {
              lonlat = this.feature_.getGeometry();
            } else if (value === "Polygon") {
              lonlat = this.feature_.getGeometry();
            }

            if (
              appConfigInfo.mapData === "google" ||
              appConfigInfo.mapData == "hereMaps" ||
              appConfigInfo.mapData == "trinity" ||
              appConfigInfo.mapData == "mmi" ||
              appConfigInfo.mapData == "sgl"
            ) {
              coordinate = ol.proj.transform(
                lonlat.getCoordinates(),
                "EPSG:3857",
                "EPSG:4326"
              );
              wktGeom = format.writeGeometry(
                lonlat.clone().transform("EPSG:3857", "EPSG:4326")
              );
            } else {
              coordinate = lonlat.getCoordinates();
              wktGeom = format.writeGeometry(lonlat);
              //  wktGeom= format.writeGeometry(this.feature_.getGeometry());
            }

            var result = {
              new_coordinates: coordinate,
            };
            var dragFeature = this.feature_;
            if (dragFeature.get("fname") == "source") {
              tmpl.Route.clearRoute({ map: map1 });
              tmpl.Route.getRoute({
                map: map1,
                source: ol.proj.transform(
                  dragFeature.getGeometry().getCoordinates(),
                  "EPSG:3857",
                  "EPSG:4326"
                ),
                destination: click_destination_route[1],
                sourceIcon: sourceImg, //"img/1.png",
                destinationIcon: destinationImg, //"img/2.png",
                radius: radius1, //20,
                getGeometry: test1,
                callbackFunc: dragRouteDetails,
              });
              click_destination_route[0] = ol.proj.transform(
                dragFeature.getGeometry().getCoordinates(),
                "EPSG:3857",
                "EPSG:4326"
              );
            } else if (dragFeature.get("fname") == "destination") {
              tmpl.Route.clearRoute({ map: map1 });
              tmpl.Route.getRoute({
                map: map1,
                source: click_destination_route[0],
                destination: ol.proj.transform(
                  dragFeature.getGeometry().getCoordinates(),
                  "EPSG:3857",
                  "EPSG:4326"
                ),
                sourceIcon: sourceImg, //"img/1.png",
                destinationIcon: destinationImg, //"img/2.png",
                radius: radius1, //20,
                getGeometry: test1,
                callbackFunc: dragRouteDetails,
              });
              click_destination_route[1] = ol.proj.transform(
                dragFeature.getGeometry().getCoordinates(),
                "EPSG:3857",
                "EPSG:4326"
              );
            }

            function dragRouteDetails(
              resETA,
              cordStart,
              cordEnd,
              coordinateArray,
              ETA_legs,
              wktGeom,
              startPointAddress,
              endPointAddress
            ) {
              // console.log("eeeeeeeeeeeeeee: ",callbackResult);
              var callbackResult = {
                resETA: resETA,
                cordStart: cordStart,
                cordEnd: cordEnd,
                coordinateArray: coordinateArray,
                ETA_legs: ETA_legs,
                wktGeom: wktGeom,
                startPointAddress: startPointAddress,
                endPointAddress: endPointAddress,
              };
              callbackFunc(callbackResult);
            }

            function test1(data) {
              bufferCallback(data);
              //console.log("data >>>",data);
              tmpl.Geocode.getGeocode({
                point: click_destination_route[0],
                callbackFunc: handleGeocode,
              });
              function handleGeocode(addrs) {
                var result = {
                  route: data,
                  geocode: addrs,
                };
                // callbackFunc(result);
              }
            }
            //mycallback(result);
            this.coordinate_ = null;
            this.feature_ = null;
            return false;
          };
          intr = new app.Drag();
          map1.addInteraction(intr);
        }
      }
    }
  }

  tmpl.Route.cancelOnClick = function (param) {
    var map1 = param.map;
    tmpl.Route.clearRoute({ map: map1 });
    tmpl.Draw.remove({
      map: map1,
    });
  };
};

tmpl.Route.joinRoute = function (param) {
  var mapObj = param.map;
  var datas = param.feature;
  var layerName = param.layerName;
  var callbackFunc = param.callbackFunc;

  var sourceIcon = param.source_image;
  var destinationIcon = param.destination_image;

  var routeLine1, feature1;
  var wayPoint = [],
    sourcePoint = [],
    destinationPoint = [];
  var sourcePointFirst, destinationPointLast, wayPointLat, wayPointLon;
  var format = new ol.format.WKT();
  if (datas.length >= 2) {
    for (var i = 0; i < datas.length; i++) {
      routeLine1 = datas[i].geometry;
      if (appConfigInfo.mapData == "google") {
        feature1 = format.readFeature(routeLine1, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
          rname: "route1",
          routeid: datas[i].id,
        });
      } else {
        feature1 = format.readFeature(routeLine1, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:4326",
          rname: "route1",
          routeid: datas[i].id,
        });
      }
      if (i == 0) {
        sourcePointFirst = feature1.getGeometry().getFirstCoordinate();
        var latlon = feature1.getGeometry().getLastCoordinate();
        wayPointLat = ol.proj.transform(latlon, "EPSG:3857", "EPSG:4326");
        wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
      } else if (i == datas.length - 1) {
        destinationPointLast = feature1.getGeometry().getLastCoordinate();
        var latlon = feature1.getGeometry().getFirstCoordinate();
        wayPointLat = ol.proj.transform(latlon, "EPSG:3857", "EPSG:4326");
        wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
      } else {
        wayPointLat = ol.proj.transform(
          feature1.getGeometry().getFirstCoordinate(),
          "EPSG:3857",
          "EPSG:4326"
        );
        var wayPointLon2 = ol.proj.transform(
          feature1.getGeometry().getLastCoordinate(),
          "EPSG:3857",
          "EPSG:4326"
        );
        wayPoint.push({ lat: wayPointLat[1], lon: wayPointLat[0] });
        wayPoint.push({ lat: wayPointLon2[1], lon: wayPointLon2[0] });
      }
    }
    sourcePointFirst = ol.proj.transform(
      sourcePointFirst,
      "EPSG:3857",
      "EPSG:4326"
    );
    destinationPointLast = ol.proj.transform(
      destinationPointLast,
      "EPSG:3857",
      "EPSG:4326"
    );
    console.log("wayPoint >>", wayPoint);
    var stops = wayPoint;
    tmpl.Route.getRoute({
      map: map,
      source: sourcePointFirst,
      destination: destinationPointLast,
      sourceIcon: sourceIcon,
      destinationIcon: destinationIcon,
      waypoints: stops,
      waypointsIcon: "img/testroute.png",
      radius: 20,
      getGeometry: test, //,
      // wayPointFormat:false
    });
    function test(a) {
      //console.log("a>>",a);
      callbackFunc(a);
    }
  }
};
tmpl.Route.clearAddedRoute = function (param) {
  var mapObj = param.map;
  var layerName = param.layer;

  var Layers = mapObj.getLayers();
  var existing;
  for (i = 0; i < Layers.getLength(); i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer) {
      if (existingLayer.get("title") === layerName) {
        existing = existingLayer;
        existingLayer.getSource().clear();
      }
    }
  }
  if (existing == undefined) {
    for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
      if (tmpl_setMap_layer_global[i].title == layerName) {
        tmpl_setMap_layer_global[i].layer.getSource().clear();
      }
    }
  }
};

// NEW TRIP ANIMATION //

var trip_lines_layer_flag = false;
var trip_lines_layer_direction_flag = false;
var trip_lines_layer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var trip_lines_layer_direction = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var trip_points_layer_flag1 = false;
var trip_end_marker_flag = false;
var trip_points_layer1 = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var trip_points_layer_flag = false;
var trip_points_layer = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var trip_end_Marker = new ol.layer.Vector({
  title: "trip_vehcile_marker",
  source: new ol.source.Vector(),
});
var ivlDraw;
var temp_store_animation_pause = {};
var temp_store_animation_stop = {};
var uniqueData = [];
var track_halt_points = [];
var track_halt_points_id = [];
var trak_animationSpeed = 100;
var trak_animationSteps = 25;
var mouseHoverDetails;
var ivlDrawTempDisplay = "";
tmpl.Trip.clear = function (param) {
  var map = param.map;

  firstrun = true;
  tripTimeDelay = -1;
  Trip_global_delay_time = -1;
  trip_lines_layer_flag = false;
  trip_lines_layer_direction_flag = false;
  ivlDraw = null;
  temp_store_animation_pause = {};
  temp_store_animation_stop = {};
  track_halt_points_id = [];
  trak_animationSpeed = 100;
  trak_animationSteps = 15;
  mouseHoverDetails = null;
  ivlDrawTempDisplay = "";
  //tripDataForReplyFromDisplay = null;
  tripDataForReplyFromDisplay_flag = false;
  tripAnimation_started = false;
  tripDisplay_flag = false;
  Trip_global_delay_time = -1;
  displayFlag = false;
  tripHaltPointsGlobal = [];

  temp_store_animation_pause = {};
  temp_store_animation_stop = {};
  uniqueData = [];
  track_halt_points_id = [];

  //current_status_flag="none";

  tripDataForReplyFromDisplay_flag = false;
  tmpl_trip_halt_animation_flag = false;
  tmpl_trip_start_animation_flag = false;
  tmpl_trip_end_animation_flag = false;
  tmpl_trip_layer_display_flag = false;
  tmpl_trip_halt_display_flag = false;
  tmpl_trip_start_display_flag = false;
  tmpl_trip_end_display_flag = false;
  tmpl_trip_vehicle_display_flag = false;

  try {
    clearInterval(ivlDrawTempDisplay);
    trip_points_layer1.getSource().clear();
    trip_points_layer.getSource().clear();
    trip_end_Marker.getSource().clear();
    trip_lines_layer.getSource().clear();
    trip_lines_layer_direction.getSource().clear();
    trip_end_marker_flag = false;
    tmpl_trip_vehicle_display.getSource().clear();
    tmpl_trip_layer_display.getSource().clear();
    tmpl_trip_layer_display1.getSource().clear();
    tmpl_trip_halt_display.getSource().clear();
    tmpl_trip_halt_animation.getSource().clear();
    tmpl_trip_start_display.getSource().clear();
    tmpl_trip_start_animation.getSource().clear();
    tmpl_trip_end_display.getSource().clear();
    tmpl_trip_end_animation.getSource().clear();
    try {
      var callback = param.callbackFunc;
      if (appConfigInfo.mapDimension == '2D') {
        map.removeLayer(tmpl_trip_layer_display);
        map.removeLayer(tmpl_trip_layer_display1);
      } else {
        try{
          var tripEntity =  map.entities.getById("tripVehicle");
          var iconStart =  map.entities.getById("startPoint");
          var iconEnd =  map.entities.getById("endPoint");
          if(tripEntity){
            map.entities.remove(tripEntity);
            map.entities.remove(iconStart);
            map.entities.remove(iconEnd);
            document.getElementById("controlButtons").remove();
            return {status:true,message:"trip playback cleared sucessfully"}
          }else{
            return {status:true,message:"nothing to clear in trip playback"};
          }
        }catch(exp){
          console.log("error while clearing trip "+exp);
          return {status:false,message:"error while clearing trip playback"};
        }
      }
      if (callback) {
        callback();
      }

    } catch (e) {
      console.log("Error in map Obj!!", e);
    }
    tripAnimation_started = false;
    tmpl_trip_vehicle_display_flag = false;
    tmpl_trip_layer_display_flag = false;
    tmpl_trip_halt_display_flag = false;
    tmpl_trip_halt_animation_flag = false;
    tmpl_trip_start_display_flag = false;
    tmpl_trip_start_animation_flag = false;
    tmpl_trip_end_display_flag = false;
    tmpl_trip_end_animation_flag = false;
    tripDataForReplyFromDisplay_flag = false;
    if (gbl_trip_clear_tooltip != undefined)
      gbl_trip_clear_tooltip.style.display = "none";
    try {
      map.unByKey("pointermove", mouseHoverDetails);
    } catch (e) {
      console.log(
        "Error:map,map.un,mouseHoverDetails::-->",
        map,
        map.un,
        mouseHoverDetails
      );
    }
    clearInterval(ivlDraw);

    tripPlaybackAnimation = null;

    Element.prototype.remove = function () {
      this.parentElement.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
      for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
        }
      }
    };
    var infoTable = document.getElementById("infoTable");
    if (infoTable) {
      infoTable.remove();
    }
    var toggleContainer = document.getElementById("toggleTrackLayers");
    if (toggleContainer) {
      toggleContainer.remove();
    }
    var tripControlscontainer = document.getElementsByClassName(
      "tripControlscontainer"
    );
    if (tripControlscontainer) {
      tripControlscontainer.remove();
    }
    try {
      // to clear Trip chart
      if (document.getElementById("bottomPaneldiv")) {
        var x = document.getElementById("bottomPaneldiv");
        x.remove();
      }

      // x.style.display = "none";

      //end to clear Trip chart
    } catch (e) {
      console.error("Unable to remove", e);
    }
  } catch (err) {
    console.error("ERROR Trip.clear: ", err);
  }
};

tmpl.Trip.stopClear = function (param) {
  var map = param.map;
  trip_points_layer1.getSource().clear();
  trip_points_layer.getSource().clear();
  trip_end_Marker.getSource().clear();
  trip_lines_layer.getSource().clear();
  trip_lines_layer_direction.getSource().clear();
  trip_end_marker_flag = false;
  // tmpl_trip_vehicle_display.getSource().clear();
  // tmpl_trip_layer_display.getSource().clear();
  // tmpl_trip_halt_display.getSource().clear();
  // tmpl_trip_start_display.getSource().clear();
  // tmpl_trip_end_display.getSource().clear();

  tmpl_trip_halt_animation.getSource().clear();
  tmpl_trip_start_animation.getSource().clear();
  tmpl_trip_end_animation.getSource().clear();
  map.un("pointermove", mouseHoverDetails);
  clearInterval(ivlDraw);
};
var tmpl_trip_halt_animation_flag = false;
var tmpl_trip_halt_animation = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_start_animation_flag = false;
var tmpl_trip_start_animation = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_end_animation_flag = false;
var tmpl_trip_end_animation = new ol.layer.Vector({
  source: new ol.source.Vector(),
});

var tmpl_trip_layer_display_flag = false;
var tmpl_trip_layer_display = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_layer_display1 = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_halt_display_flag = false;
var tmpl_trip_halt_display = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_start_display_flag = false;
var tmpl_trip_start_display = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_end_display_flag = false;
var tmpl_trip_end_display = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
var tmpl_trip_vehicle_display_flag = false;
var tmpl_trip_vehicle_display = new ol.layer.Vector({
  source: new ol.source.Vector(),
});
tmpl.Trip.routeLayer = function (param) {
  var visibility = param.visibility;
  tmpl_trip_layer_display.setVisible(visibility);
  tmpl_trip_layer_display1.setVisible(visibility);
  tmpl_trip_halt_display.setVisible(visibility);
  tmpl_trip_start_display.setVisible(visibility);
  tmpl_trip_end_display.setVisible(visibility);
  // if (visibility == true) trip_lines_layer.setVisible(false);
  // else trip_lines_layer.setVisible(true);
  if (visibility == true) trip_lines_layer.setVisible(true);
  else trip_lines_layer.setVisible(false);
};
tmpl.Trip.animatingRoute = function (param) {
  var visibility = param.visibility;
  trip_lines_layer.setVisible(visibility);
  trip_lines_layer_direction.setVisible(visibility);
};

tmpl.Trip.routeVehicle = function (param) {
  var visibility = param.visibility;
  var map = param.map;
  if (tripAnimation_started == true) {
    tmpl_trip_vehicle_display.setMap(null);
    if (visibility == true) trip_end_Marker.setMap(map);
    else trip_end_Marker.setMap(null);
  } else {
    if (visibility == true) tmpl_trip_vehicle_display.setMap(map);
    else tmpl_trip_vehicle_display.setMap(null);
  }
};

var tripDataForReplyFromDisplay;
var tripDataForReplyFromDisplay_flag = false;
var tripAnimation_started = false;
var tripDisplay_flag = false;
var Trip_global_delay_time = -1;
var displayFlag = false;

tmpl.Trip.delay = function (val) {
  //tripDataForReplyFromDisplay
  Trip_global_delay_time = val;
};

//Updated trip display Added on 19-12-2019
let tripRouteWidth;
let tripScale;
var tripHaltPointsGlobal = [];
tripTimeDelay = -1;
Trip_global_delay_time = -1;
let vehicleNumber = "";
let vehicleType = "";
tmpl.Trip.display = function (param) {
  console.log("Trip Display:->", param);
  if (appConfigInfo.mapDimension == '2D') {
    if (Object.keys(param).length === 0) {
      console.error("Mised param!!!!");
    } else {
      removeTripInfoTable();
      if (param.data.length == 1 || param.data.length == 0) {
        console.log("Not enough data");
      } else {
        if (param.data.length == 1 || param.data.length == 0) {
          console.log("Not enough data");
        } else {
          tripDisplay_flag = true;
          tripDataForReplyFromDisplay = param;
          var tripVehicleId = param.id;
          var data2 = param.data;
          var map = param.map;
          var halt_points = param.halt_points;
          var halt_img;
          var img_url = param.img_url;
          var route_color = param.route_color;
          var route_style_width = param.route_width;
          var callbackFunc = param.callbackFunc;
          var start_url = param.start_url;
          var end_url = param.end_url;
          var minHaltTime = param.minHalt;
          var returnTableData = param.returnTableData;
          var routeMouseOverDetails = param.routeMouseOverDetails;
          var vehicle_icon_scale = param.icon_scale;
          var label = param.label;
          var tooltipLocation = param.tooltipLocation;
          var tripEndCallbackFunc = param.tripEndCallbackFunc;
          var halt_points_index = [];
          var halt_points_indexTemp = [];
          tripScale=param.tripScale != undefined ? param.tripScale: 16;
          vehicleNumber = param.vehicleData.vehicleNumber;
          vehicleType = param.vehicleData.vehicleType;

          tripRouteWidth=route_style_width

          var data1 = [];
          for (var i = 0; i < data2.length; i++) {
            if (data2[i - 1]) {
              //prev && current
              if (
                data2[i - 1].lat == data2[i].lat &&
                data2[i - 1].lon == data2[i].lon &&
                data2[i - 1].lat < data2[i].lat &&
                data2[i - 1].lon < data2[i].lon
              ) {
                console.log("Duplicate Found", data2[i]);
              } else {
                data1.push(data2[i - 1]);

                if (i == data2.length - 1) {
                  data1.push(data2[i]);
                }
              }
            }
          }

          //console.log("data2:",data2);
          //console.log("data1:",data1);

          if (param.routeMouseOverDetails == true) {
            EnableTripToolTip(map, tooltipLocation);
          }
          if (param.halt_points == true) {
            halt_img = param.halt_img;
          }
          if (route_style_width == undefined) {
            route_style_width = 4;
          }

          //map.unByKey(pointerMoveID);			//@BK

          var mapDiv = document.getElementById(globalMapDivID);
          var toggleLayersDiv = document.createElement("div");
          toggleLayersDiv.className = "toggleLayers";
          toggleLayersDiv.id = "toggleTrackLayers";
          //var mapDiv = document.getElementById(globalMapDivID);
          mapDiv.appendChild(toggleLayersDiv);
          // document.body.appendChild(toggleLayersDiv);
          toggleLayersDiv.style.position = "absolute";
          toggleLayersDiv.style.display = "flex";
          toggleLayersDiv.style.justifyContent = "center";
          toggleLayersDiv.style.top = "8%";
          toggleLayersDiv.style.right = "10px";
          toggleLayersDiv.style.width = "22%";
          toggleLayersDiv.style.backgroundColor = "cornsilk";
          toggleLayersDiv.style.borderRadius = "5px";
          toggleLayersDiv.style.opacity = "0.8";
          toggleLayersDiv.style.zIndex = "4";

          var routelineCheckbox = document.createElement("input");
          routelineCheckbox.id = "checkrouteline";
          routelineCheckbox.type = "checkbox";
          routelineCheckbox.name = "Route Line";
          routelineCheckbox.value = "Route Line";
          routelineCheckbox.checked = true;
          toggleLayersDiv.appendChild(routelineCheckbox);
          // routelineCheckbox.onclick = routeLinevisibility;
          document.getElementById("toggleTrackLayers").append("Route Line");

          var routevehicleCheckbox = document.createElement("input");
          routevehicleCheckbox.id = "checkresource";
          routevehicleCheckbox.type = "checkbox";
          routevehicleCheckbox.name = "Resource";
          routevehicleCheckbox.value = "Resource";
          routevehicleCheckbox.checked = true;
          toggleLayersDiv.appendChild(routevehicleCheckbox);
          // routevehicleCheckbox.onclick = resourcevisibility;
          document.getElementById("toggleTrackLayers").append("Resource");

          var infoCheckbox = document.createElement("input");
          infoCheckbox.id = "checkinfobox";
          infoCheckbox.type = "checkbox";
          infoCheckbox.name = "Infobox";
          infoCheckbox.value = "Infobox";
          infoCheckbox.checked = false; //@Sh by default is false
          toggleLayersDiv.appendChild(infoCheckbox);
          //infoCheckbox.onclick = infoboxvisibility;
          document.getElementById("toggleTrackLayers").append("Infobox");

          var deviatedpointCheckbox = document.createElement("input");
          deviatedpointCheckbox.id = "checkdeviatedpoint";
          deviatedpointCheckbox.type = "checkbox";
          deviatedpointCheckbox.name = "Route Deviation";
          deviatedpointCheckbox.value = "Route Deviation";
          deviatedpointCheckbox.checked = false;
          toggleLayersDiv.appendChild(deviatedpointCheckbox);
          // deviatedpointCheckbox.onclick = routeLinevisibility;
          document.getElementById("toggleTrackLayers").append("Route Deviation");

          var clearTrack = document.createElement("BUTTON");
          clearTrack.className = "clearTrip";
          clearTrack.innerHTML = '<i class="fa fa-times fa-lg"></i>';
          clearTrack.title = "Clear Trip";
          clearTrack.style.marginLeft = "10px";
          clearTrack.style.backgroundColor = "gray";
          clearTrack.style.border = "none";
          clearTrack.style.color = "black";
          // clearTrack.style.padding = "5px 10px";
          clearTrack.style.cursor = "pointer";
          clearTrack.onclick = function () {
            tmpl.Trip.stopClear({map:map});
            tmpl.Trip.clear({map:map});
            if (param.callbackFunc) {
              var clearRespnse = {
                track: "stop",
                features: param.features,
                message: "Vehice Trip Playback stopped",
              };
              param.callbackFunc(clearRespnse);
            }
          };
          toggleLayersDiv.appendChild(clearTrack);

          var bottomPanel = document.createElement("div");
          bottomPanel.className = "bottomPanel";
          bottomPanel.id = "bottomPaneldiv";
          bottomPanel.style.position = "fixed";
          bottomPanel.style.bottom = "0%";
          bottomPanel.style.right = "0%";
          bottomPanel.style.width = "100%";
          bottomPanel.style.height = "42px";
          bottomPanel.style.float = "right";
          // bottomPanel.style.backgroundColor = "white";
          // bottomPanel.style.borderRadius = "5px";
          bottomPanel.style.zIndex = "4";
          bottomPanel.style.transition = "all 1.0s";
          mapDiv.appendChild(bottomPanel);

          //var bottomPaneldata = document.createElement("div");
          //bottomPaneldata.className = "bottomPaneldata";
          //bottomPaneldata.id = "bottomPaneldatadiv";
          //bottomPaneldata.style.position = "absolute";
          //bottomPaneldata.style.visibility = "none";
          //bottomPaneldata.style.top = "100%";
          //bottomPaneldata.style.right = "0%";
          //bottomPaneldata.style.width = "100%";
          //bottomPaneldata.style.height = "393%";
          //bottomPaneldata.style.float = "right";
          //bottomPaneldata.style.backgroundColor = "lightgray";
          //bottomPaneldata.style.borderRadius = "5px";
          //bottomPaneldata.style.overflow = "scroll";
          //bottomPaneldata.style.zIndex = "4";
          //bottomPaneldata.style.transition = "all 1.0s";
          ////bottomPanel.appendChild(bottomPaneldata);

          var btmPnlSigndownCont = document.createElement("div");
          btmPnlSigndownCont.className = "signdownContainer";
          btmPnlSigndownCont.style.position = "absolute";
          btmPnlSigndownCont.style.right = "10px";
          btmPnlSigndownCont.style.top = "25%";
          btmPnlSigndownCont.style.zIndex = "5";
          bottomPanel.appendChild(btmPnlSigndownCont);

          var closeDataTab = document.createElement("BUTTON");
          closeDataTab.className = "signDownTab";
          closeDataTab.value = "1";
          closeDataTab.style.background = "none";
          closeDataTab.style.border = "none";
          closeDataTab.style.cursor = "pointer";
          closeDataTab.style.visibility = "hidden"; // @sh removed to hide
          closeDataTab.style.transition = "all 1.0s";
          closeDataTab.innerHTML =
            '<i class="fa fa-lg fa-chevron-circle-up"></i>';
          closeDataTab.onclick = function (evt) {
            if (closeDataTab.value == 1) {
              bottomPanel.appendChild(bottomPaneldata);
              bottomPaneldata.style.visibility = "visible";
              bottomPanel.style.bottom = "26.5%";
              closeDataTab.innerHTML =
                '<i class="fa fa-lg fa-chevron-circle-down"></i>';
              closeDataTab.value = 2;
            } else {
              bottomPaneldata.style.visibility = "hidden";
              bottomPanel.style.bottom = "0%";
              closeDataTab.innerHTML =
                '<i class="fa fa-lg fa-chevron-circle-up"></i>';
              closeDataTab.value = 1;
              setTimeout(function () {
                bottomPanel.removeChild(bottomPaneldata);
              }, 500);
            }
          };
          btmPnlSigndownCont.appendChild(closeDataTab);

          var infoTabs = document.createElement("div");
          infoTabs.classname = "infoTabs";
          infoTabs.style.overflow = "hidden";
          bottomPanel.appendChild(infoTabs);

          var graphTab = document.createElement("BUTTON");
          graphTab.className = "graphTab active";
          //for open default graph tab
          graphTab.id = "graphTabid";
          graphTab.innerHTML = "Graph";
          graphTab.style.backgroundColor = "inherit";
          graphTab.style.float = "left";
          graphTab.style.border = "none";
          graphTab.style.outline = "none";
          graphTab.style.cursor = "pointer";
          graphTab.style.padding = "11px 16px";
          graphTab.style.transition = "all 1.0s";
          graphTab.style.fontSize = "17px";
          graphTab.style.visibility = "hidden"; //@sh removed and hide
          graphTab.onclick = function (evt) {
            var div = document.getElementById("bottomPaneldatadiv");
            if (div) {
              while (div.firstChild) {
                div.removeChild(div.firstChild);
              }
            }
            //bottomPanel.appendChild(bottomPaneldata); //@sh hide
            // generateGraph();
            bottomPaneldata.style.visibility = "visible";
            bottomPanel.style.bottom = "26.5%";
            bottomPaneldata.style.position = "absolute";
            if (closeDataTab.value == 2) {
              if (bottomPanel.style.bottom == "0%") {
                closeDataTab.innerHTML =
                  '<i class="fa fa-lg fa-chevron-circle-up"></i>';
                closeDataTab.value = 1;
              } else {
              }
            } else {
              closeDataTab.innerHTML =
                '<i class="fa fa-lg fa-chevron-circle-down"></i>';
              closeDataTab.value = 2;
            }
            document.getElementsByClassName(
              "tripDataTab"
            )[0].style.backgroundColor = "white";
            document.getElementsByClassName("graphTab")[0].style.backgroundColor =
              "gray";
          };
          infoTabs.appendChild(graphTab);
          var tripDataTab = document.createElement("BUTTON");
          tripDataTab.className = "tripDataTab";
          tripDataTab.innerHTML = "Messages";
          tripDataTab.style.backgroundColor = "inherit";
          tripDataTab.style.float = "left";
          tripDataTab.style.border = "none";
          tripDataTab.style.outline = "none";
          tripDataTab.style.cursor = "pointer";
          tripDataTab.style.padding = "11px 16px";
          tripDataTab.style.transition = "0.3s";
          tripDataTab.style.fontSize = "17px";
          tripDataTab.style.visibility = "hidden"; //@sh removed to hide
          tripDataTab.onclick = function (evt) {
            var div = document.getElementById("bottomPaneldatadiv");
            if (div) {
              while (div.firstChild) {
                div.removeChild(div.firstChild);
              }
            }
            bottomPanel.appendChild(bottomPaneldata);
            generateTable();
            bottomPaneldata.style.visibility = "visible";
            bottomPanel.style.bottom = "26.5%";
            bottomPaneldata.style.position = "absolute";
            if (closeDataTab.value == 2) {
              if (bottomPanel.style.bottom == "0%") {
                closeDataTab.innerHTML =
                  '<i class="fa fa-lg fa-chevron-circle-up"></i>';
                closeDataTab.value = 1;
              }
            } else {
              closeDataTab.innerHTML =
                '<i class="fa fa-lg fa-chevron-circle-down"></i>';
              closeDataTab.value = 2;
            }
            document.getElementsByClassName("graphTab")[0].style.backgroundColor =
              "white";
            document.getElementsByClassName(
              "tripDataTab"
            )[0].style.backgroundColor = "gray";
          };
          infoTabs.appendChild(tripDataTab);

          var graphTabcontent = document.createElement("div");
          graphTabcontent.classname = "tabcontent";
          graphTabcontent.id = "graphTabcontent";

          var messageTabcontent = document.createElement("div");
          messageTabcontent.classname = "tabcontent";
          messageTabcontent.id = "messageTabcontent";

          var tabcontentStyle = document.getElementsByClassName("tabcontent");
          if (tabcontentStyle[0]) {
            tabcontentStyle[0].style.display = "none";
            tabcontentStyle[0].style.padding = "6px 12px";
            tabcontentStyle[0].style.borderTop = "none";
          }

          //commented during 
          // function generateTable() {
          //   var arrHead = [
          //     "Date",
          //     "Location",
          //     "Speed (km/hr)",
          //     "Latitude",
          //     "Longitude",
          //   ];
          //   var messagesTable = document.createElement("table");
          //   messagesTable.style.tableLayout = "auto";
          //   messagesTable.style.width = "100%";
          //   messagesTable.setAttribute("id", "messagesTable");
          //   bottomPaneldata.appendChild(messagesTable);
          //   var tr = messagesTable.insertRow(-1);
          //   tr.className = "tableHeader";
          //   // tr.style.position = 'fixed';
          //   tr.style.backgroundColor = "black";
          //   tr.style.color = "white";

          //   for (var h = 0; h < arrHead.length; h++) {
          //     var th = document.createElement("th");
          //     th.className = "msgtabheading";
          //     th.style.border = "1px solid white";
          //     th.innerHTML = arrHead[h];
          //     // th.style.position = 'sticky';
          //     // th.style.top = '0%';
          //     tr.appendChild(th);
          //   }
          //   // First level Data Push
          //   //for(var k=0; k<=data1.length; k++){
          //   var k = data1.length;
          //   while (k--) {
          //     var temp = document.getElementById("messagesTable");
          //     temp.style.borderCollapse = "collapse";

          //     var rowCnt = temp.rows.length;
          //     var tr = temp.insertRow(1);
          //     tr.className = "msgTable";

          //     for (var c = 0; c < arrHead.length; c++) {
          //       var td = document.createElement("td");

          //       td = tr.insertCell(c);
          //       var arrVal = ["datetime", "location", "speed", "lat", "lon"];

          //       switch (c) {
          //         case 0:
          //           td.innerHTML = data1[k].datetime;
          //           break;
          //         case 1:
          //           td.innerHTML = data1[k].location;
          //           break;
          //         case 2:
          //           td.innerHTML = data1[k].speed;
          //           break;
          //         case 3:
          //           td.innerHTML = data1[k].lat;
          //           break;
          //         case 4:
          //           td.innerHTML = data1[k].lon;
          //           break;
          //         default:
          //           break;
          //       }
          //       td.style.border = "1px solid darkgray";
          //       td.style.padding = "4px";
          //       td.className = "rowEntry";
          //     }
          //   }
          // }

          // generateGraph();
          //Beginning of Graph part
          /*function generateGraph(){
            var xaxis = ['x'];
            var yaxis = ['speed'];
            
            for(var j=0; j<data1.length; j++){
              xaxis.push(data1[j].datetime);
              yaxis.push(data1[j].speed);
            }
            var chart = c3.generate({
              size: {
                height: 180,
                // width: 100
              },
              bindto: '#bottomPaneldatadiv',
              data: {
                x: 'x',
                xFormat: '%d-%m-%Y %H:%M:%S',
                columns: [
                  xaxis,
                  yaxis
                ]
              },
              axis: {
                x: {
                  type: 'timeseries',
                  tick: {
                    format: '%d-%m-%Y %H:%M:%S',
                    fit: false,
                    culling: true,
                    // rotate: -75,
                  },
                  height: 25
                }
              }
            });
            //for open default graph tab
              document.getElementById("graphTabid").click();
          }
          */
  
          // generateGraph();
          //Beginning of Graph part
          function generateGraph() {
            var xaxis = ['x'];
            var yaxis = ['speed'];
  
            for (var j = 0; j < data1.length; j++) {
              xaxis.push(data1[j].datetime);
              //xaxis.push(data1[j].id);
              yaxis.push(data1[j].speed);
            }
            var chart = c3.generate({
              size: {
                height: 180,
                // width: 100
              },
              bindto: '#bottomPaneldatadiv',
              data: {
                x: 'x',
                xFormat: '%d-%m-%Y %H:%M:%S',
                onclick: function (event) {
                  console.log("11111111111", data1[event.index]);
  
                },
                onmouseover: function (event) {
                  console.log("222222", data1[event.index], map, param);
  
                  firstrun = false;
                  tmpl.Trip.pause();
  
                  document.getElementById('pausebtn').style.backgroundColor='Red';
                  document.getElementById("playbtn").style.backgroundColor='#1E90FF';
            
                  tmpl.Trip.routeVehicle({
                    map: param.map,
                    visibility: false
                  });
  
                  // tmpl.Overlay.removeMarker({
                  // 	map: param.map,
                  // 	id: 'routeOverlay'
                  // });
                  tmpl.Layer.clearData({ map: param.map, layer: 'routeOverlay' });
              tmpl.Layer.clearData({ map: param.map, layer: 'routeOverlay' });
              tmpl.Layer.remove({ map: param.map, layer: 'routeOverlay' });
              tmpl.Layer.remove({ map: param.map, layer: 'routeOverlay' });
                  console.log("------------------------",param);
                  // tmpl.Overlay.addMarker({
                  // 	map: param.map,
                  // 	point: [data1[event.index].lon, data1[event.index].lat],
                  // 	id: 'routeOverlay',
                  // 	//img_url: param.img_url,
                  // 	img_url: "",
                  // 	offset: [-25, -35]
                  // });
  
                  // tmpl.Overlay.addMarker({
                  // 	map: param.map,
                  // 	//point : [78.435,17.355],
                  // 	point: [data1[event.index].lon, data1[event.index].lat],
                  // 	id: 'routeOverlay',
                  // 	img_url : "",
                  // 	height : 50,
                  // 	width : 20,
                  // 	offset : [0,-20]
                  // });
  
                  tmpl.Overlay.create({
                    map: param.map,
                    layer: 'routeOverlay',
                    getHoverLabel: true,
                    layerSwitcher: false,
                    trackLayer: false,
                    icon_scale: 1,
                    features: [{
                      id: 'routeOverlay',
                      label: "routeOverlay",
                      label_color: "#FF00FF",
                      img_url:appConfigInfo.mapSDKURL + "vehicalOverlay.png",
                      lat: data1[event.index].lat,  //9.848445802886268, 76.35997374370261
                      lon: data1[event.index].lon,
                      height: 100.05
                    }]
                  })
  
                  tmpl.Zoom.toXYcustomZoom({
                    map: param.map,
                    latitude: data1[event.index].lat,
                    longitude: data1[event.index].lon,
                    zoom: 15
                  });
  
  
                },
                columns: [
                  xaxis,
                  yaxis
                ]
              },
              axis: {
                x: {
                  type: 'timeseries',
                  tick: {
                    format: '%d-%m-%Y %H:%M:%S',
                    fit: false,
                    culling: true,
                    // rotate: -75,
                  },
                  height: 25
                }
              }
            });
            //for open default graph tab
            document.getElementById("graphTabid").click();
          }
  
  
          var tripControlsContainer = document.createElement("div");
          tripControlsContainer.className = "tripControlscontainer";
          bottomPanel.appendChild(tripControlsContainer);

          var tripControlContainerStyle = document.getElementsByClassName(
            "tripControlscontainer"
          );
          tripControlContainerStyle[0].style.position = "absolute";
          // tripControlContainerStyle[0].style.height = "40px";
          tripControlContainerStyle[0].style.bottom = "100%";
          tripControlContainerStyle[0].style.left = "40%";
          // tripControlContainerStyle[0].style.backgroundColor = "black";
          tripControlContainerStyle[0].style.borderRadius = "5px";
          tripControlContainerStyle[0].style.zIndex = "5";

          var mapControls = document.createElement("div");
          mapControls.className = "mapControls";
          mapControls.id = "controlButtons";
          mapControls.style.borderRadius = "inherit";
          mapControls.style.backgroundColor = "black";
          mapControls.style.float = "left";
          mapControls.style.top = "4px";
          mapControls.style.marginLeft = "4px";
          mapControls.style.marginRight = "4px";
          mapControls.style.zIndex = "5";
          mapControls.style.display = "flex"; // Use flexbox
          mapControls.style.flexDirection = "row"; // Arrange children in a column
          mapControls.style.alignItems = "center"; 
          tripControlsContainer.appendChild(mapControls);

          var playBut = document.createElement("BUTTON");
          var pausBut = document.createElement("BUTTON");
          var stopBut = document.createElement("BUTTON");
          var downloadBut = document.createElement("BUTTON");

          playBut.setAttribute("id", "playbtn");
          pausBut.setAttribute("id", "pausebtn");
          stopBut.setAttribute("id", "stopbtn");
          downloadBut.setAttribute("id", "downloadbut");

          playBut.setAttribute("class", "tripControlbtn");
          pausBut.setAttribute("class", "tripControlbtn");
          stopBut.setAttribute("class", "tripControlbtn");
          downloadBut.setAttribute("class", "tripControlbtn");

          // playBut.innerHTML = '<i class="fa fa-play"></i>';
          // playBut.title = "Play";
          // pausBut.innerHTML = '<i class="fa fa-pause"></i>';
          // pausBut.title = "Pause";
          // stopBut.innerHTML = '<i class="fa fa-stop"></i>';
          // stopBut.title = "Stop";
          // downloadBut.innerHTML = '<i class="fa fa-download"></i>';
          // downloadBut.title = "Download";
          playBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + "play.png" + '" style="width: 20px; height: 20px;">';
          playBut.title = "Play";
          pausBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + "pause.png" + '" style="width: 20px; height: 20px;">';
          pausBut.title = "Pause";
          stopBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + "stop.png" + '" style="width: 20px; height: 20px;">';
          stopBut.title = "Stop";
          downloadBut.innerHTML = '<i class="fa fa-download"></i>';
          downloadBut.title = "Download";

          mapControls.appendChild(playBut);
          mapControls.appendChild(pausBut);
          mapControls.appendChild(stopBut);
          //mapControls.appendChild(downloadBut); @sh comented to remove

          var controlsDiv = document.getElementsByClassName("mapControls");
          controlsDiv[0].style.position = "relative";
          controlsDiv[0].style.border = "1px solid ivory";
          controlsDiv[0].style.borderRadius = "inherit";
          controlsDiv[0].style.backgroundColor = "black";
          controlsDiv[0].style.float = "left";
          controlsDiv[0].style.top = "4px";
          controlsDiv[0].style.marginLeft = "4px";
          controlsDiv[0].style.marginRight = "4px";
          controlsDiv[0].style.zIndex = "5";

          var buttonsDiv = document.getElementsByClassName("tripControlbtn");
          //var downloadMap =  document.getElementById('downloadbut').style.display = "none"; //@Comented to remove
          for (var i = 0; i < buttonsDiv.length; i++) {
            buttonsDiv[i].style.position = "relative";
            buttonsDiv[i].style.top = "50%";
            buttonsDiv[i].style.float = "left";
            buttonsDiv[i].style.backgroundColor = "DodgerBlue";
            buttonsDiv[i].style.border = "none";
            buttonsDiv[i].style.color = "white";
            buttonsDiv[i].style.padding = "5px 10px";
            buttonsDiv[i].style.margin = "2px";
            buttonsDiv[i].style.fontSize = "16px";
            buttonsDiv[i].style.cursor = "pointer";
            buttonsDiv[i].style.zIndex = "10";
          }

          var speedControllerContainer = document.createElement("div");
          speedControllerContainer.className = "speedController";
          tripControlsContainer.appendChild(speedControllerContainer);

          var tripControlsContainerStyle =
            document.getElementsByClassName("speedController");
          tripControlsContainerStyle[0].style.position = "relative";
          tripControlsContainerStyle[0].style.width = "91px";
          tripControlsContainerStyle[0].style.float = "left";
          tripControlsContainerStyle[0].style.top = "5px";
          tripControlsContainerStyle[0].style.marginRight = "4px";
          tripControlsContainerStyle[0].style.padding = "4px";
          tripControlsContainerStyle[0].style.border = "1px solid ivory";
          tripControlsContainerStyle[0].style.backgroundColor = "#1E90FF"; //orangered
          tripControlsContainerStyle[0].style.borderRadius = "5px";
          tripControlsContainerStyle[0].style.zIndex = "11";

          var speedControllerText = document.createElement("div");
          speedControllerText.className = "speedControllerText";
          speedControllerText.innerHTML = "Speed";
          speedControllerContainer.appendChild(speedControllerText);
          var selectOption = document.createElement("select");
          selectOption.className = "speedControllerDropdown";
          selectOption.onchange = function (evt) {
            var val = evt.target.value;
            console.log("val~~~~~~~~~~~~", val);
            delayTimeEvent(val);
          };
          speedControllerContainer.appendChild(selectOption);

          var speedControllerTextStyle = document.getElementsByClassName(
            "speedControllerText"
          );
          speedControllerTextStyle[0].style.position = "relative";
          speedControllerTextStyle[0].style.float = "left";
          speedControllerTextStyle[0].style.color = "white";

          var speedControllerDropdownStyle = document.getElementsByClassName(
            "speedControllerDropdown"
          );
          speedControllerDropdownStyle[0].style.position = "relative";
          speedControllerDropdownStyle[0].style.float = "right";

          var optionOne = document.createElement("option");
          optionOne.value = 1;
          optionOne.innerHTML = "x1";
          selectOption.appendChild(optionOne);

          var optionTwo = document.createElement("option");
          optionTwo.value = 2;
          optionTwo.innerHTML = "x2";
          selectOption.appendChild(optionTwo);

          var optionThree = document.createElement("option");
          optionThree.value = 3;
          optionThree.innerHTML = "x3";
          selectOption.appendChild(optionThree);

          var optionFour = document.createElement("option");
          optionFour.value = 4;
          optionFour.innerHTML = "x4";
          selectOption.appendChild(optionFour);

          var optionFive = document.createElement("option");
          optionFive.value = 5;
          optionFive.innerHTML = "x5";
          selectOption.appendChild(optionFive);

          var optionSeven = document.createElement('option');
					optionSeven.value = 7;
					optionSeven.innerHTML = 'x7';
					selectOption.appendChild(optionSeven);

					var optionTen = document.createElement('option');
					optionTen.value = 10;
					optionTen.innerHTML = 'x10';
					selectOption.appendChild(optionTen);

          var optionFifteen = document.createElement('option');
					optionFifteen.value = 15;
					optionFifteen.innerHTML = 'x15';
					selectOption.appendChild(optionFifteen);

					var optionTwenty = document.createElement('option');
					optionTwenty.value = 20;
					optionTwenty.innerHTML = 'x20';
					selectOption.appendChild(optionTwenty);

          var optionThirty = document.createElement('option');
					optionThirty.value = 30;
					optionThirty.innerHTML = 'x30';
					selectOption.appendChild(optionThirty);

          var optionFifty = document.createElement('option');
					optionFifty.value = 50;
					optionFifty.innerHTML = 'x50';
					selectOption.appendChild(optionFifty);

          var temp = "3";
          var mySelect = document.getElementsByClassName(
            "speedControllerDropdown"
          );

          for (var i, j = 0; (i = mySelect[0].options[j]); j++) {
            if (i.value == temp) {
              // mySelect.selectedIndex = j;
              mySelect[0].options[j].selected = true;
              break;
            }
          }

          var delayContainer = document.createElement("div");
          delayContainer.style.position = "relative";
          delayContainer.style.top = "5px";
          delayContainer.style.float = "right";
          delayContainer.style.padding = "4px";
          delayContainer.style.marginRight = "4px";
          delayContainer.style.backgroundColor = "#1E90FF"; //orangered
          delayContainer.style.borderRadius = "5px";
          delayContainer.style.border = "1px solid ivory";
          delayContainer.style.zIndex = "11";
          //tripControlsContainer.appendChild(delayContainer); //@sh removed

          // From here for delay
          var tripdelayTextDiv = document.createElement("div");
          tripdelayTextDiv.innerHTML = "<b>Delay</b>";
          tripdelayTextDiv.id = "tripdelayTextDiv";
          tripdelayTextDiv.style.position = "relative";
          tripdelayTextDiv.style.float = "left";
          tripdelayTextDiv.style.color = "white";
          delayContainer.appendChild(tripdelayTextDiv);

          var tripdelayDropdown = document.createElement("select");
          tripdelayDropdown.id = "tripdelayDropdown";
          tripdelayDropdown.onchange = tripDelayOnChange;
          tripdelayDropdown.style.marginLeft = "4px";
          tripdelayDropdown.style.position = "relative";
          tripdelayDropdown.style.float = "right";
          delayContainer.appendChild(tripdelayDropdown);
          var trackDelayoption1 = document.createElement("option");
          trackDelayoption1.innerHTML = "None";
          trackDelayoption1.value = "-1";
          tripdelayDropdown.appendChild(trackDelayoption1);
          var trackDelayoption2 = document.createElement("option");
          trackDelayoption2.innerHTML = "10sec";
          trackDelayoption2.value = "10";
          tripdelayDropdown.appendChild(trackDelayoption2);
          var trackDelayoption3 = document.createElement("option");
          trackDelayoption3.innerHTML = "30sec";
          trackDelayoption3.value = "30";
          tripdelayDropdown.appendChild(trackDelayoption3);
          var trackDelayoption4 = document.createElement("option");
          trackDelayoption4.innerHTML = "1 min";
          trackDelayoption4.value = "60";
          tripdelayDropdown.appendChild(trackDelayoption4);
          var trackDelayoption5 = document.createElement("option");
          trackDelayoption5.innerHTML = "2 mins";
          trackDelayoption5.value = "120";
          tripdelayDropdown.appendChild(trackDelayoption5);
          var trackDelayoption6 = document.createElement("option");
          trackDelayoption6.innerHTML = "5 mins";
          trackDelayoption6.value = "300";
          tripdelayDropdown.appendChild(trackDelayoption6);
          var trackDelayoption7 = document.createElement("option");
          trackDelayoption7.innerHTML = ">5 mins";
          trackDelayoption7.value = "1200";
          tripdelayDropdown.appendChild(trackDelayoption7);

          function tripDelayOnChange() {
            var val = document.getElementById("tripdelayDropdown").value;
            console.log("tripdelayDropdown value changed ===> ", val);
            tripTimeDelay = val;
            Trip_global_delay_time = val;
            console.log(uniqueData);
            console.log(track_halt_points111);
            updateTripDetailsOnDelayChange();
          }

          function ArrayChecker(array, value) {
            var hasMatch = false;
            for (var obj of array) {
              if (obj.id == value) {
                hasMatch = true;
                break;
              }
            }
            return hasMatch;
          }

          function updateTripDetailsOnDelayChange() {
            var trackedlinepoints = [];
            track_halt_points111 = [];
            track_halt_points_id = [];
            for (var i = 0; i < data1.length; i++) {
              var lat = parseFloat(data1[i].lat);
              var lon = parseFloat(data1[i].lon);
              //var tempTime = data1[i].time.slice(0, 8);
              //data1[i].time = tempTime;
              //var str = data1.id;//05-02-20
              var str = lon.toString() + lat.toString();

              // console.log("str from API ===> ",str);
              data1[i].id = str;
              data1[i].trip_icon = "";

              //push all
              var nextStart_time = null;
              try {
                nextStart_time = data1[i + 1].time;
              } catch (error) {
                nextStart_time = data1[i].time;
              }

              //	uniqueData.push(data1[i]);

              if (halt_points == true) {
                if (i < data1.length - 1) {
                  // if(data1[i].speed < 5){
                  var tempTime1 = data1[i + 1].time.slice(0, 8);
                  data1[i + 1].time = tempTime1;
                  //var tripDiffinSec = time_diffForTripInSec(data1[i].time,data1[i+1].time);
                  var tripDiffinSec = time_chk(
                    data1[i].datetime,
                    data1[i + 1].datetime
                  );
                  //console.log("Indexing1"+data1[i].location+" - "+data1[i+1].location+":: CHECK DIFF ::", data1[i].time,data1[i+1].time+" FOUND DIFF ", tripDiffinSec);

                  console.log(
                    "tripDiffinSec ===> ",
                    tripDiffinSec,
                    ">=",
                    tripTimeDelay
                  );

                  //if(tripTimeDelay!=-1 && tripTimeDelay >= tripDiffinSec){//05-02-2020
                  if (tripTimeDelay != -1 && tripDiffinSec >= tripTimeDelay) {
                    console.log(
                      "Indexing" +
                      data1[i].location +
                      " - " +
                      data1[i + 1].location +
                      ":: CHECK DIFF ::",
                      data1[i].time,
                      data1[i + 1].time + " FOUND DIFF ",
                      tripDiffinSec
                    );

                    if (track_halt_points_id.indexOf(str) == -1) {
                      track_halt_points_id.push(str);
                      halt_points_indexTemp.push(i);
                      var tempTime1 = data1[i + 1].time.slice(0, 8);
                      data1[i + 1].time = tempTime1;
                      var haltDuration = time_diff(
                        data1[i].time,
                        data1[i + 1].time
                      );
                      console.log("haltDuration ===> ", haltDuration);

                      //push at this point is wrong as A - B is compared
                      //while only one is pushed both has to be pushed
                      if (tripDiffinSec >= tripTimeDelay) {
                        /* 			track_halt_points111.push({
                                lat : data1[i].lat,
                                lng : data1[i].lon,
                                location : data1[i].location,
                                date : data1[i].date,
                                startTime : data1[i].time,
                                endTime : data1[i+1].time,
                                rendering_type : 11,
                                haltDuration : haltDuration,
                                id : str,
                                trip_icon : halt_img
                              }); */
                      }
                    } else {
                      /* if(track_halt_points111.length>0){
                         track_halt_points111[track_halt_points111.length - 1].endTime = data1[i].time;
                      } */
                    }
                  } else {
                    console.info(
                      "Indexing Show",
                      data1[i].location,
                      data1[i + 1].location + ":: CHECK DIFF ::",
                      data1[i].time,
                      data1[i + 1].time + " FOUND DIFF ",
                      tripDiffinSec
                    );

                    var st_point =
                      data1[i].lon.toString() + data1[i].lat.toString();
                    var ed_point =
                      data1[i + 1].lon.toString() + data1[i + 1].lat.toString();
                    if (st_point && ed_point) {
                      trackedlinepoints.push(st_point);
                      trackedlinepoints.push(ed_point);
                    }
                  }
                } else {
                  //console.log('I : ', i);
                }
              } else {
              }

              track_halt_points111.push({
                lat: data1[i].lat,
                lng: data1[i].lon,
                location: data1[i].location,
                date: data1[i].date,
                startTime: data1[i].time,
                endTime: nextStart_time,
                rendering_type: 11,
                haltDuration: haltDuration,
                id: str,
                trip_icon: halt_img,
              });
            }

            if (track_halt_points111.length > 0) {
              for (var k = 0; k < track_halt_points111.length; k++) {
                for (var j = 0; j < trackedlinepoints.length; j++) {
                  if (track_halt_points111[k].id == trackedlinepoints[j]) {
                    console.log(
                      " match Found Hence pos : ",
                      track_halt_points111[k].location
                    );
                    track_halt_points111.splice(k, 1);
                  } else {
                    console.log(
                      "! match Found Hence pos : ",
                      track_halt_points111[k].location
                    );
                  }
                }
              }
            }
            console.log("Halt =====>", track_halt_points111);
            tripHaltPointsGlobal = track_halt_points111;
            tmpl_trip_layer_display_flag = false;
            if (tmpl_trip_layer_display_flag == false) {
              tmpl_trip_layer_display1.getSource().clear();
              tmpl_trip_layer_display.getSource().clear();
              tmpl_trip_layer_display_flag = true;
              tmpl_trip_layer_display1 = new ol.layer.Vector({
                title: "trip_line_display_layer1",
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: route_color,
                    width: route_style_width,
                  }),
                }),
              });
              tmpl_trip_layer_display = new ol.layer.Vector({
                title: "trip_line_display_layer",
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: route_color,
                    width: route_style_width,
                  }),
                }),
              });
              tmpl_trip_layer_display1.set("display", "TripLayerDisplay");
              tmpl_trip_layer_display.set("display", "TripLayerDisplay");

              map.addLayer(tmpl_trip_layer_display1);
              map.addLayer(tmpl_trip_layer_display);
            } else {
              tmpl_trip_layer_display1.getSource().clear();
              tmpl_trip_layer_display.getSource().clear();
            }
            gblIndex = 1;
            sendDataToDrawAnimationLineTemp();
            //chk Duplicat latlon
            var lineArray = [];
            var k = 0;

            // for(var k=0;k<uniqueData.length;k++){
            while (k < uniqueData.length) {
              //  if(track_halt_points111.some(el => el.id === uniqueData[k].id)){
              for (var t = 0; t < trackedlinepoints.length; t++) {
                if (uniqueData[k].id == trackedlinepoints[t]) {
                  if (lineArray.length <= 2) {
                    lineArray.push(uniqueData[k]);
                    console.log(
                      "uniqueData--------------------------------------------",
                      uniqueData
                    );
                    //draw the line
                    if (lineArray.length == 2) {
                      console.log(
                        "Drawing from Source : " +
                        lineArray[0].location +
                        " to Destination : " +
                        lineArray[1].location
                      );
                      var prev = null,
                        next = null,
                        prevSpeed = null;
                      prev = [
                        parseFloat(lineArray[0].lon),
                        parseFloat(lineArray[0].lat),
                      ];
                      prevSpeed = lineArray[0].speed;
                      next = [
                        parseFloat(lineArray[1].lon),
                        parseFloat(lineArray[1].lat),
                      ];
                      // console.log(prev,pres);
                      if (
                        appConfigInfo.mapData == "google" ||
                        appConfigInfo.mapData == "hereMaps" ||
                        appConfigInfo.mapData == "trinity" ||
                        appConfigInfo.mapData == "mmi" ||
                        appConfigInfo.mapData == "sgl"

                      ) {
                        if (prev && next) {
                          prev = ol.proj.transform(
                            prev,
                            "EPSG:4326",
                            "EPSG:3857"
                          );
                          pres = ol.proj.transform(
                            next,
                            "EPSG:4326",
                            "EPSG:3857"
                          );
                          //alert();
                          var lineString = new ol.geom.LineString([prev, pres]);
                          var feature2 = new ol.Feature({
                            geometry: lineString,
                          });
                          //console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>",param);
                          if (param.speedLimit) {
                            //VR RnD
                            if (prevSpeed < 8)
                              feature2.setStyle(
                                new ol.style.Style({
                                  stroke: new ol.style.Stroke({
                                    color: "rgb(51, 204, 51)",
                                    width: 5,
                                  }),
                                })
                              );
                            else if (prevSpeed > 8 && prevSpeed <= 20) {
                              feature2.setStyle(
                                new ol.style.Style({
                                  stroke: new ol.style.Stroke({
                                    color: "rgb(255, 153, 0)",
                                    width: 5,
                                  }),
                                })
                              );
                            } else {
                              feature2.setStyle(
                                new ol.style.Style({
                                  stroke: new ol.style.Stroke({
                                    color: "rgb(255, 0, 0)",
                                    width: 5,
                                  }),
                                })
                              );
                            }
                          }

                          tmpl_trip_layer_display1
                            .getSource()
                            .addFeature(feature2);
                        } else {
                          console.log("prev and next was not initialized");
                        }
                      }
                      lineArray = [];
                      //lineArray.splice(0, 1);
                    }
                  }
                }
              }

              k++;
            }

            tmpl_trip_halt_display.getSource().clear();
            if (param.halt_points == true) {
              // if(tmpl_trip_halt_display_flag == false){
              tmpl_trip_halt_display = new ol.layer.Vector({
                title: "trip_halt",
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  image: new ol.style.Icon({
                    src: halt_img,
                    anchor: [0.5, 1],
                  }),
                }),
              });
              map.addLayer(tmpl_trip_halt_display);
              // }else{
              // tmpl_trip_halt_display.getSource().clear();
              // }

              for (var j = 0; j < track_halt_points111.length; j++) {
                var pres = [
                  parseFloat(track_halt_points111[j].lng),
                  parseFloat(track_halt_points111[j].lat),
                ];
                //console.log(pres);
                if (appConfigInfo.mapData == "google") {
                  pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
                } else if (appConfigInfo.mapData == "hereMaps" ||
                  appConfigInfo.mapData == "trinity" ||
                  appConfigInfo.mapData == "mmi" ||
                  appConfigInfo.mapData == "sgl") {
                  pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
                } else {
                }
                //console.log(pres);
                var pointdata = new ol.geom.Point(pres);
                var feature2 = new ol.Feature({
                  geometry: pointdata,
                });
                feature2.setProperties(track_halt_points111[j]);
                tmpl_trip_halt_display.getSource().addFeature(feature2);
              }
              //console.log(tmpl_trip_halt_display.getSource().getFeatures().length);
            }
          }

          // TABLES
          var infoTableDiv = document.createElement("div");
          infoTableDiv.className = "dataTable";
          infoTableDiv.id = "infoTable";
          // document.body.appendChild(infoTableDiv);
          mapDiv.appendChild(infoTableDiv);
          var infoTableRowsDiv = document.createElement("div");
          infoTableRowsDiv.className = "rows";
          infoTableDiv.appendChild(infoTableRowsDiv);

          infoTableRowsDiv.innerHTML =
              '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';
            //  '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey; visibility: hidden; display: none"><td style="font-weight:bold; padding:5px; visibility: hidden; display: none">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';
          var trackresourceDivv = document.getElementById('trackresourceDiv');
          var trackcallSignDiv = document.getElementById('trackcallSignDiv');

          var vehicleNo = param.vehicleData.vehicleNumber;
          // var vehicleType = param.vehicleData.vehicleType;


          infoTableDiv.style.position = "absolute";
          infoTableDiv.style.top = "20%";
          infoTableDiv.style.right = "10px";
          infoTableDiv.style.width = "20%";
          infoTableDiv.style.zIndex = "4";
          infoTableDiv.style.visibility = "hidden"; //@sh disabled

          infoTableRowsDiv.style.position = "relative";
          infoTableRowsDiv.style.top = "2px";
          infoTableRowsDiv.style.left = "2px";
          infoTableRowsDiv.style.backgroundColor = "white";
          infoTableRowsDiv.style.opacity = "1";
          infoTableRowsDiv.style.borderRadius = "5px";

          // 	const playButton = document.getElementById('playButton');
          // playButton.addEventListener('click', togglePlay);
          // function togglePlay() {
          // if (playButton.classList.contains('inactive')) {
          // 	// Activate the button
          // 	playButton.classList.remove('inactive');
          // 	playButton.classList.add('active');
          // 	// Perform play functionality here
          // 	console.log('Play');
          // } else {
          // 	// Deactivate the button
          // 	playButton.classList.remove('active');
          // 	playButton.classList.add('inactive');
          // 	// Perform pause functionality here
          // 	console.log('Pause');
          // }
          // }

          // document.getElementById("playbtn").onclick = function(){
          //  //alert(firstrun);
          // 	if(firstrun)
          // 		{
          // 		tmpl.Trip.firstplay();
          // 		firstrun = false;
          // 		}
          // 		else
          // 		{
          // 		tmpl.Trip.play();
          // 		}
          // 		//var downloadMap =  document.getElementById('downloadbut').style.display = "none";
          // }

          // Get the button element by its id
          var button = document.getElementById("playbtn");

          // Add an event listener for the "click" event
          button.addEventListener("click", function () {
            // Add the "active" class to the button
            var buttonpause = document.getElementById("pausebtn");
            buttonpause.style.backgroundColor = "#1E90FF";

            var buttonStop = document.getElementById("stopbtn");
            buttonStop.style.backgroundColor = "#1E90FF";

            button.classList.add("active");
            button.style.backgroundColor = "red";
            if (firstrun) {
              tmpl.Trip.firstplay();
              firstrun = false;
            } else {
              tmpl.Trip.play();
            }
          });

          // document.getElementById("pausebtn").onclick = function(){
          // 	firstrun = false;
          // 	tmpl.Trip.pause();
          // 	//var downloadMap =  document.getElementById('downloadbut').style.display = "block"; //@sh commented to remove
          // 	}

          var buttonpaus = document.getElementById("pausebtn");

          // Add an event listener for the "click" event
          buttonpaus.addEventListener("click", function () {
            // Add the "active" class to the button
            var buttonply = document.getElementById("playbtn");
            buttonply.style.backgroundColor = "#1E90FF";

            var buttonStop = document.getElementById("stopbtn");
            buttonStop.style.backgroundColor = "#1E90FF";

            buttonpaus.classList.add("active");
            buttonpaus.style.backgroundColor = "red";

            firstrun = false;
            tmpl.Trip.pause();
          });

          var buttonStop = document.getElementById("stopbtn");

          // Add an event listener for the "click" event
          buttonStop.addEventListener("click", function () {
            // Add the "active" class to the button
            var buttonply = document.getElementById("playbtn");
            buttonply.style.backgroundColor = "#1E90FF";

            var buttonpause1 = document.getElementById("pausebtn");
            buttonpause1.style.backgroundColor = "#1E90FF";

            buttonStop.classList.add("active");
            buttonStop.style.backgroundColor = "red";

            firstrun = false;
            tmpl.Trip.stop();
          });

          // document.getElementById("stopbtn").onclick = function(){
          // 	firstrun = false;
          // 	tmpl.Trip.stop();
          // 	//var downloadMap =  document.getElementById('downloadbut').style.display = "block";
          // 	}

          //document.getElementById("downloadbut").onclick = function(){

          // mapDownload(true);
          // }

          document.getElementById("checkresource").onclick = function () {
            var checkStatus = document.getElementById("checkresource").checked;
            if (checkStatus == false) {
              tmpl.Trip.routeVehicle({
                map: map,
                visibility: false,
              });
            } else {
              tmpl.Trip.routeVehicle({
                map: map,
                visibility: true,
              });
            }
          };

          document.getElementById("checkrouteline").onclick = function () {
            var checkStatus = document.getElementById("checkrouteline").checked;
            if (checkStatus == false) {
              tmpl.Trip.routeLayer({
                visibility: false,
              });
            } else {
              tmpl.Trip.routeLayer({
                visibility: true,
              }); //@sh
            }
          };
          //VR  RnD
          try {
            if (param.deviatedData) {
              document.getElementById("checkdeviatedpoint").disabled = false;
              tmpl.Overlay.create({
                map: param.map,
                features: param.deviatedData,
                layer: "deviatedRouteLayer",
                layerSwitcher: false,
              });
              tmpl.Layer.changeVisibility({
                map: param.map,
                layer: "deviatedRouteLayer",
                visible: false,
              });
              document.getElementById("checkdeviatedpoint").onclick =
                function () {
                  var checkStatus =
                    document.getElementById("checkdeviatedpoint").checked;
                  if (checkStatus == false) {
                    tmpl.Layer.changeVisibility({
                      map: param.map,
                      layer: "deviatedRouteLayer",
                      visible: false,
                    });
                    console.log("trip param:", param);
                  } else {
                    tmpl.Layer.changeVisibility({
                      map: param.map,
                      layer: "deviatedRouteLayer",
                      visible: true,
                    });
                    console.log("trip param:", param);
                  }
                };
            } else {
              console.log("Deviated Point Layer deviatedData Missing");
              document.getElementById("checkdeviatedpoint").disabled = true;
            }
          } catch (e) {
            console.log("Deviated Point Layer Creation Error..!", e);
          }

          document.getElementById("checkinfobox").onclick = function () {
            var checkStatus = document.getElementById("checkinfobox").checked;
            if (checkStatus == false) {
              document.getElementById("infoTable").style.visibility = "hidden";
            } else {
              document.getElementById("infoTable").style.visibility = "visible";
            }
          };

          function delayTimeEvent(val) {
            tmpl.Trip.speed({
              level: val,
            });
          }

          var prevLat, prevLon;
          var tempFilterArray = [];
          var uniqueData = [];
          var track_halt_points_id = [],
            track_halt_points = [],
            track_halt_points111 = [];
          //console.log(data1);
          for (var i = 0; i < data1.length; i++) {
            var lat = parseFloat(data1[i].lat);
            var lon = parseFloat(data1[i].lon);
            //var tempTime = data1[i].time.slice(0, 8); // @sh
            //data1[i].time = tempTime;
            var str = lon.toString() + lat.toString();
            // console.log("str from API ===> ",str);
            data1[i].id = str;
            data1[i].trip_icon = "";

            uniqueData.push(data1[i]);

            if (halt_points == true) {
              if (i < data1.length - 1) {
                // if(data1[i].speed < 5){
                var tempTime1 = data1[i + 1].time.slice(0, 8);
                data1[i + 1].time = tempTime1;
                var tripDiffinSec = time_diffForTripInSec(
                  data1[i].time,
                  data1[i + 1].time
                );
                // console.log("tripDiffinSec ===> ",tripDiffinSec);
                if (tripTimeDelay != -1 && tripDiffinSec >= tripTimeDelay) {
                  // if(tripDiffinSec >= Trip_global_delay_time){
                  if (track_halt_points_id.indexOf(str) == -1) {
                    track_halt_points_id.push(str);
                    halt_points_indexTemp.push(i);
                    var tempTime1 = data1[i + 1].time.slice(0, 8);
                    data1[i + 1].time = tempTime1;
                    var haltDuration = time_diff(
                      data1[i].time,
                      data1[i + 1].time
                    );
                    // console.log("haltDuration ===> ",haltDuration);
                    track_halt_points111.push({
                      lat: data1[i].lat,
                      lng: data1[i].lon,
                      location: data1[i].location,
                      date: data1[i].date,
                      startTime: data1[i].time,
                      endTime: data1[i + 1].time,
                      rendering_type: 11,
                      haltDuration: haltDuration,
                      id: str,
                      trip_icon: halt_img,
                    });
                  } else {
                    if (track_halt_points111.length > 0) {
                      track_halt_points111[
                        track_halt_points111.length - 1
                      ].endTime = data1[i].time;
                    }
                  }
                }
              }
            } else {
            }
          }

          console.log("TRIP HALT POINTS ====> ", track_halt_points111);
          tripHaltPointsGlobal = [];
          tripHaltPointsGlobal = track_halt_points111;
          // console.log("FINAL uniqueData from API ===> ",JSON.stringify(uniqueData));
          if (halt_points == true) {
            for (var i = 0; i < track_halt_points111.length; i++) {
              var s = time_diff(
                track_halt_points111[i].startTime,
                track_halt_points111[i].endTime
              );
              s =
                parseInt(s.split(":")[0] * 60 * 60) +
                parseInt(s.split(":")[1] * 60) +
                parseInt(s.split(":")[2]);
              s = parseInt(s);
              //console.log(track_halt_points111[i].startTime,track_halt_points111[i].endTime);
              //console.log("minHaltTime:",minHaltTime,s);
              if (minHaltTime != undefined) {
                if (minHaltTime == 0) {
                  halt_points_index = [];
                } else {
                  if (s > minHaltTime) {
                    //console.log(s,minHaltTime,s > minHaltTime,"valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);

                    halt_points_index.push(halt_points_indexTemp[i]);
                    track_halt_points.push(track_halt_points111[i]);
                  } else {
                    //console.log(s,minHaltTime,s > minHaltTime,"in valid--",track_halt_points111[i].haltDuration,track_halt_points111[i].startTime,track_halt_points111[i].endTime);
                  }
                }
              } else {
                halt_points_index.push(halt_points_indexTemp[i]);
                track_halt_points.push(track_halt_points111[i]);
              }
            }
          }
          if (halt_points == true) {
            for (var k = 0; k < uniqueData.length; k++) {
              for (l = 0; l < track_halt_points.length; l++) {
                if (uniqueData[k].id == track_halt_points[l].id) {
                  uniqueData[k].trip_icon = track_halt_points[l].trip_icon;
                }
              }
            }
          }
          // tripDataForReplyFromDisplay.track_halt_points = track_halt_points;
          // tripDataForReplyFromDisplay.uniqueData = uniqueData;
          //console.log("track_halt_points111 >>",track_halt_points111);
          //tripDataForReplyFromDisplay = uniqueData;
          console.log(
            "tmpl_trip_layer_display_flag==> " + tmpl_trip_layer_display_flag
          );
          if (tmpl_trip_layer_display_flag == false) {
            tmpl_trip_layer_display_flag = true;
            tmpl_trip_layer_display1 = new ol.layer.Vector({
              title: "trip_line_display_layer1",
              source: new ol.source.Vector(),
              style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: route_color,
                  width: route_style_width,
                }),
              }),
            });
            tmpl_trip_layer_display = new ol.layer.Vector({
              title: "trip_line_display_layer",
              source: new ol.source.Vector(),
              style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: route_color,
                  width: route_style_width,
                }),
              }),
            });
            tmpl_trip_layer_display1.set("display", "TripLayerDisplay");
            tmpl_trip_layer_display.set("display", "TripLayerDisplay");

            //map.addLayer(tmpl_trip_layer_display1);
            map.addLayer(tmpl_trip_layer_display); //@SH Removed to to avoid plot layer
          } else {
            tmpl_trip_layer_display1.getSource().clear();
            tmpl_trip_layer_display.getSource().clear();
          }
          console.log(tmpl_trip_layer_display);
          var gblIndex = 1;
          function sendDataToDrawAnimationLineTemp() {
            var k = gblIndex;

            var prev = [
              parseFloat(uniqueData[k - 1].lon),
              parseFloat(uniqueData[k - 1].lat),
            ];
            var pres = [
              parseFloat(uniqueData[k].lon),
              parseFloat(uniqueData[k].lat),
            ];

            console.log(prev, pres);
            if (appConfigInfo.mapData == "google") {
              prev = ol.proj.transform(prev, "EPSG:4326", "EPSG:3857");
              pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
            } else if (appConfigInfo.mapData == "hereMaps" ||
              appConfigInfo.mapData == "trinity" ||
              appConfigInfo.mapData == "mmi" ||
              appConfigInfo.mapData == "sgl") {
              prev = ol.proj.transform(prev, "EPSG:4326", "EPSG:3857");
              pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
            } else {
            }

            var properties = {
              location: uniqueData[k].location,
              speed: uniqueData[k].speed,
              date: uniqueData[k].date,
              time: uniqueData[k].time,
              lat: uniqueData[k].lat,
              lon: uniqueData[k].lon,
            };
            // drawAnimatedLineTemp(prev, pres, properties);
            gblIndex = gblIndex + 1;
          }
          for (var k = 1; k < uniqueData.length; k++) {
            // console.log("track_halt_points111 before linestring ===> ",track_halt_points111);
            //console.log("uniqueData before linestring ===> ",uniqueData);

            //console.log(track_halt_points111.some(el => el.id === uniqueData[k].id));
            if (track_halt_points111.some((el) => el.id === uniqueData[k].id)) {
              console.log("SKIPPING LINE STRING");
            } else {
              var prev = [
                parseFloat(uniqueData[k - 1].lon),
                parseFloat(uniqueData[k - 1].lat),
              ];
              var pres = [
                parseFloat(uniqueData[k].lon),
                parseFloat(uniqueData[k].lat),
              ];
              var prevSpeed = uniqueData[k].speed;
              // console.log(prev,pres);
              if (appConfigInfo.mapData == "google") {
                prev = ol.proj.transform(prev, "EPSG:4326", "EPSG:3857");
                pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
              } else if (appConfigInfo.mapData == "hereMaps" ||
                appConfigInfo.mapData == "trinity" ||
                appConfigInfo.mapData == "mmi" ||
                appConfigInfo.mapData == "sgl") {
                prev = ol.proj.transform(prev, "EPSG:4326", "EPSG:3857");
                pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
              } else {
              }
              var properties = {
                location: uniqueData[k].location,
                speed: uniqueData[k].speed,
                date: uniqueData[k].date,
                time: uniqueData[k].time,
                lat: uniqueData[k].lat,
                lon: uniqueData[k].lon,
              };
              //drawAnimatedLineTemp(prev, pres, properties);
              //console.log(prev,pres);

              var lineString = new ol.geom.LineString([prev, pres]);
              var feature2 = new ol.Feature({
                geometry: lineString,
              });
              //VR RnD
              //	console.log("----------------------------------->>>>>>>>>>>>>>>>>>>>>>>2",param);
              feature2.setProperties(properties);
              if (param.speedLimit) {
                //VR RnD
                if (prevSpeed < 8)
                  feature2.setStyle(
                    new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: "rgb(51, 204, 51)",
                        width: 5,
                      }),
                    })
                  );
                else if (prevSpeed > 8 && prevSpeed <= 20) {
                  feature2.setStyle(
                    new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: "rgb(255, 153, 0)",
                        width: 5,
                      }),
                    })
                  );
                } else {
                  feature2.setStyle(
                    new ol.style.Style({
                      stroke: new ol.style.Stroke({
                        color: "rgb(255, 0, 0)",
                        width: 5,
                      }),
                    })
                  );
                }
              }
              tmpl_trip_layer_display1.getSource().addFeature(feature2);
              if (k == uniqueData.length - 1) {
                tmpl.Zoom.toLayer({
                  map: map,
                  layer: "trip_line_display_layer1",
                });
                // sendDataToDrawAnimationLineTemp();
              }
            }
          }

          function drawAnimatedLineTemp(startPt, endPt, properties) {
            var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
            var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
            var i = 0;
            var newEndPt;
            ivlDrawTempDisplay = setInterval(function () {
              console.log("steps==>" + trak_animationSteps);
              if (i > trak_animationSteps) {
                clearInterval(ivlDrawTempDisplay);
                if (gblIndex < uniqueData.length) {
                  sendDataToDrawAnimationLineTemp();
                } else {
                  tmpl_trip_layer_display1.getSource().clear();
                }
                return;
              }
              newEndPt = [
                startPt[0] + i * directionX,
                startPt[1] + i * directionY,
              ];
              var line = new ol.geom.LineString([startPt, newEndPt]);
              var point = new ol.geom.Point(newEndPt);
              var fea = new ol.Feature(line);
              fea.setProperties(properties);
              tmpl_trip_layer_display.getSource().addFeature(fea);
              i++;
            }, 0);
          }

          //console.log("uniqueData[0] >>",uniqueData[0]);
          var properties = {
            location: uniqueData[0].location,
            speed: uniqueData[0].speed,
            date: uniqueData[0].date,
            time: uniqueData[0].time,
            lat: uniqueData[0].lat,
            lon: uniqueData[0].lon,
          };
          callbackFunc(properties);
          if (param.halt_points == true) {
            if (tmpl_trip_halt_display_flag == false) {
              tmpl_trip_halt_display_flag = true;
              tmpl_trip_halt_display = new ol.layer.Vector({
                title: "trip_halt",
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  image: new ol.style.Icon({
                    src: halt_img,
                    anchor: [0.5, 1],
                  }),
                }),
              });
              map.addLayer(tmpl_trip_halt_display);
            } else {
              tmpl_trip_halt_display.getSource().clear();
            }

            for (var j = 0; j < track_halt_points.length; j++) {
              var pres = [
                parseFloat(track_halt_points[j].lng),
                parseFloat(track_halt_points[j].lat),
              ];
              //console.log(pres);
              if (appConfigInfo.mapData == "google") {
                pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
              } else if (appConfigInfo.mapData == "hereMaps" ||
                appConfigInfo.mapData == "trinity" ||
                appConfigInfo.mapData == "mmi" ||
                appConfigInfo.mapData == "sgl") {
                pres = ol.proj.transform(pres, "EPSG:4326", "EPSG:3857");
              } else {
              }
              //console.log(pres);
              var pointdata = new ol.geom.Point(pres);
              var feature2 = new ol.Feature({
                geometry: pointdata,
              });
              feature2.setProperties(track_halt_points[j]);
              tmpl_trip_halt_display.getSource().addFeature(feature2);
            }
            //console.log(tmpl_trip_halt_display.getSource().getFeatures().length);
          }

          if (tmpl_trip_start_display_flag == false) {
            tmpl_trip_start_display_flag = true;
            tmpl_trip_start_display = new ol.layer.Vector({
              source: new ol.source.Vector(),
              title: "trip_start",
              style: new ol.style.Style({
                image: new ol.style.Icon({
                  src: start_url,
                  anchor: [0.45, 1],
                  anchorOrigin: "top-bottom",
                }),
              }),
            });
            map.addLayer(tmpl_trip_start_display);
          } else {
            tmpl_trip_start_display.getSource().clear();
          }

          if (tmpl_trip_end_display_flag == false) {
            tmpl_trip_end_display_flag = true;
            tmpl_trip_end_display = new ol.layer.Vector({
              source: new ol.source.Vector(),
              title: "trip_end",
              style: new ol.style.Style({
                image: new ol.style.Icon({
                  src: end_url,
                  anchor: [0.5, 1],
                }),
              }),
            });
            map.addLayer(tmpl_trip_end_display);
          } else {
            tmpl_trip_end_display.getSource().clear();
          }

          if (tmpl_trip_vehicle_display_flag == false) {
            tmpl_trip_vehicle_display_flag = true;
            var scale = 1;
            if (vehicle_icon_scale != undefined) scale = vehicle_icon_scale;
            tmpl_trip_vehicle_display = new ol.layer.Vector({
              source: new ol.source.Vector(),
              style: new ol.style.Style({
                image: new ol.style.Icon({
                  src: img_url,
                  scale: scale,
                  opacity: 0.9, // Set the desired opacity value between 0 and 1
                  //color: route_color, //@sh color
                }),
              }),
            });
            tmpl_trip_vehicle_display.setMap(map);
            console.log("FINAL uniqueData from API ===> ", uniqueData);
            document.getElementById("resourceDiv").innerHTML =
              vehicleNumber;
            document.getElementById("callSignDiv").innerHTML =
              vehicleType;
            document.getElementById("positionDiv").innerHTML =
              uniqueData[0].lon + ", " + uniqueData[0].lat;
            document.getElementById("speedDispDiv").innerHTML =
              (uniqueData[0].speed).toFixed(0) + " km/hr";
            document.getElementById("locationDiv").innerHTML =
              uniqueData[0].location;
            document.getElementById("dateTimeDIv").innerHTML = uniqueData[0].time;
          } else {
            tmpl_trip_vehicle_display.getSource().clear();
          }

          var end_pos = uniqueData.length - 1;
          var start = [
            parseFloat(uniqueData[0].lon),
            parseFloat(uniqueData[0].lat),
          ];
          var end = [
            parseFloat(uniqueData[end_pos].lon),
            parseFloat(uniqueData[end_pos].lat),
          ];
          if (appConfigInfo.mapData == "google") {
            start = ol.proj.transform(start, "EPSG:4326", "EPSG:3857");
            end = ol.proj.transform(end, "EPSG:4326", "EPSG:3857");
          } else if (appConfigInfo.mapData == "hereMaps" ||
            appConfigInfo.mapData == "trinity" ||
            appConfigInfo.mapData == "mmi" ||
            appConfigInfo.mapData == "sgl") {
            start = ol.proj.transform(start, "EPSG:4326", "EPSG:3857");
            end = ol.proj.transform(end, "EPSG:4326", "EPSG:3857");
          } else {
          }
          var pointdata_s = new ol.geom.Point(start);
          var pointdata_e = new ol.geom.Point(end);
          var feature2_s = new ol.Feature({
            geometry: pointdata_s,
          });
          var feature2_v = new ol.Feature({
            geometry: pointdata_s,
          });
          var feature2_e = new ol.Feature({
            geometry: pointdata_e,
          });
          feature2_s.setProperties(uniqueData[0]);
          feature2_s.set("id", "trip_start");
          feature2_s.set("rendering_type", 12);

          feature2_v.set("rendering_type", 13);
          feature2_v.set("layer_name", "trip_vehcile_marker");
          feature2_v.setProperties(uniqueData[0]);

          feature2_v.set("id", tripVehicleId);

          feature2_e.setProperties(uniqueData[end_pos]);
          feature2_e.set("rendering_type", 12);
          feature2_e.set("id", "trip_end");
          tmpl_trip_start_display.getSource().addFeature(feature2_s);
          tmpl_trip_vehicle_display.getSource().addFeature(feature2_v);
          tmpl_trip_end_display.getSource().addFeature(feature2_e);
          if (routeMouseOverDetails == true) {
            var ta_tooltip = document.createElement("tooltip");
            ta_tooltip.id = "trip-tooltip";
            ta_tooltip.className = "ol-trip-tooltip";
            var overlay_mouseOver_label = new ol.Overlay({
              element: ta_tooltip,
              offset: [10, 0],
              positioning: "bottom-left",
            });

            map.addOverlay(overlay_mouseOver_label);
            map.on("pointermove", function (evt) {
              var feature_mouseOver = map.forEachFeatureAtPixel(
                evt.pixel,
                function (feature, layer) {
                  //if(layer){
                  if (feature.get("layer_name") == "trip_vehcile_marker") {
                    return feature;
                  }
                  //}
                }
              );
              ta_tooltip.style.display = feature_mouseOver ? "" : "none";
              if (feature_mouseOver) {
                overlay_mouseOver_label.setPosition(evt.coordinate);
                ta_tooltip.innerHTML = label;
              }
            });
          }
          if (returnTableData == true) {
            var callbackFunc = param.TableDataCallBack;
            var data = param.data;
            var grid_data = [];
            var table_data = [];
            var halt_index = 0;
            for (var i = 0; i < data.length; i++) {
              if (halt_points_index.indexOf(i) != -1) {
                table_data[i] = {};
                table_data[i].latitude = data[i].lat;
                table_data[i].longitude = data[i].lon;
                table_data[i].date = data[i].date;
                table_data[i].time = data[i].time;
                table_data[i].location = data[i].location;
                table_data[i].speed = data[i].speed;
                table_data[i].haltInTime =
                  track_halt_points[halt_index].startTime;
                table_data[i].haltOutTime = track_halt_points[halt_index].endTime;
                var s = time_diff(
                  track_halt_points[halt_index].endTime,
                  track_halt_points[halt_index].startTime
                );
                table_data[i].haltDuration = s;
                halt_index = halt_index + 1;
              } else {
                table_data[i] = {};
                table_data[i].latitude = data[i].lat;
                table_data[i].longitude = data[i].lon;
                table_data[i].date = data[i].date;
                table_data[i].time = data[i].time;
                table_data[i].location = data[i].location;
                table_data[i].speed = data[i].speed;
                table_data[i].haltInTime = "";
                table_data[i].haltOutTime = "";
                table_data[i].haltDuration = "";
              }
            }
            var index = grid_data.length;
            grid_data[index] = {};
            grid_data[index].typemessage = "trip start";
            grid_data[index].latitude = uniqueData[0].lat;
            grid_data[index].longitude = uniqueData[0].lon;
            grid_data[index].date = uniqueData[0].date;
            grid_data[index].time = uniqueData[0].time;
            grid_data[index].haltInTime = 0;
            grid_data[index].haltOutTime = 0;
            grid_data[index].haltDuration = 0;
            grid_data[index].location = uniqueData[0].location;
            index = index + 1;
            for (var i = 0; i < track_halt_points.length; i++) {
              grid_data[index] = {};
              grid_data[index].typemessage = "trip halt";
              grid_data[index].latitude = track_halt_points[i].lat;
              grid_data[index].longitude = track_halt_points[i].lng;
              grid_data[index].date = track_halt_points[i].date;
              grid_data[index].time = track_halt_points[i].startTime;
              grid_data[index].haltInTime = track_halt_points[i].startTime;
              grid_data[index].haltOutTime = track_halt_points[i].endTime;
              var s = time_diff(
                track_halt_points[i].endTime,
                track_halt_points[i].startTime
              );
              grid_data[index].haltDuration = s;
              grid_data[index].location = track_halt_points[i].location;
              index = index + 1;
            }
            grid_data[index] = {};
            grid_data[index].typemessage = "trip end";
            grid_data[index].latitude = uniqueData[uniqueData.length - 1].lat;
            grid_data[index].longitude = uniqueData[uniqueData.length - 1].lon;
            grid_data[index].date = uniqueData[uniqueData.length - 1].date;
            grid_data[index].time = uniqueData[uniqueData.length - 1].time;
            grid_data[index].haltInTime = 0;
            grid_data[index].haltOutTime = 0;
            grid_data[index].haltDuration = 0;
            grid_data[index].location =
              uniqueData[uniqueData.length - 1].location;
            var result = {};
            result.grid_data = grid_data;
            result.table_data = table_data;
            xxx = result;
            //alert();
            //console.log(result,halt_points_index,track_halt_points);
            callbackFunc(result);
          }
        }
      }
    }
  } else {
    let viewer = param.map
    viewer.clock.shouldAnimate = false;
    // let model_url = param.model_url?param.model_url:appConfigInfo.mapSDKURL+"GroundVehicle.glb";
    // let vehicleModelUrl=appConfigInfo.mapSDKURL+"GroundVehicle.glb"
    let model_url = param.model_url?param.model_url:appConfigInfo.mapSDKURL+"FireFighting.glb";
    startIcon=param.start_url;
    endIcon=param.end_url;
    scale=param.icon_scale;
    minScale=param.vehicleMin_scale?param.vehicleMin_scale:64;
    maxScale=param.vehicleMax_scale?param.vehicleMax_scale:300;
  
    let positionProperty = new Cesium.SampledPositionProperty();
  
    // const vehicleModelUrl = appConfigInfo.mapSDKURL+"GroundVehicle.glb";
  
    const vehicleEntity = viewer.entities.add({
      id:'tripVehicle',
      position: positionProperty,
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      model: {
        uri: model_url,
        minimumPixelSize: minScale,
        maximumScale: maxScale
      },
      path: {
        show: true,
        leadTime: 0,
        trailTime: 600000,
        width: 3,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          color: Cesium.Color.RED
        })
      }
    });

    viewer.clock.multiplier = 10;
    data2 = param.data;
    dataPoints = [];
    for (var i = 0; i < data2.length; i++) {
      // console.log("param.data~~~~", data2[i]);
      if (data2[i - 1]) {
        if (
          data2[i - 1].lat == data2[i].lat &&
          data2[i - 1].lon == data2[i].lon &&
          data2[i - 1].lat < data2[i].lat &&
          data2[i - 1].lon < data2[i].lon
        ) {
          console.log("Duplicate Found", data2[i]);
        } else {
          dataPoints.push(data2[i - 1]);
          if (i == data2.length - 1) {
            dataPoints.push(data2[i]);
          }
        }
      }
    }
  
    dataPoints=data2;
    //console.log(dataPoints)
  
    function sortPacketsByDateTime(packets) {
      // Sort the array of packets based on the datetime field
      packets.sort((a, b) => {
          // Convert datetime strings to Date objects for comparison
          const dateA = new Date(a.datetime);
          const characterNumberB = new Date(b.datetime);
  
          return dateA - characterNumberB;
      });
    }
    sortPacketsByDateTime(dataPoints);

    startPacket=dataPoints[0];
    endPacket=dataPoints[dataPoints.length-1];

    let entity1=viewer.entities.add({
      id: 'startPoint',
      position: Cesium.Cartesian3.fromDegrees(startPacket.lon, startPacket.lat),
      billboard: {
          image: startIcon,
          scale: 1,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
    let entity2=viewer.entities.add({
      id: 'endPoint',
      position: Cesium.Cartesian3.fromDegrees(endPacket.lon, endPacket.lat),
      billboard: {
          image: endIcon,
          scale: 1,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
  
    dataPoints.forEach(point => {
  
      const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0);
      const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
      positionProperty.addSample(time, position);
  
    });
  
    // Adjust the viewer's clock to span the animation
    var packetStartTime = dataPoints[0].date + 'T' + dataPoints[0].time + 'Z';
    var packetDataLength = dataPoints.length - 1;
    var packetEndTime = dataPoints[packetDataLength].date + 'T' + dataPoints[packetDataLength].time + 'Z';
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[0].datetime));
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[packetDataLength].datetime));
    viewer.clock.currentTime = viewer.clock.startTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
    // viewer.clock.multiplier = 1; // Adjust for speed of the animation
  
    // Optionally set the viewer to track the loaded vehicle entity
    viewer.trackedEntity = vehicleEntity;
  
    let index = 0;
    function playAnimation() {
      // Clear and reinitialize the position samples
      positionProperty = new Cesium.SampledPositionProperty(); // Create a new property for clean start
  
      // Repopulate the positionProperty with all data points
      dataPoints.forEach(point => {
  
        // var poi1 = Cesium.Cartographic.fromDegrees(point.lon, point.lat);
  
        // var height1;
        // Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi1]).then(function (updatedPositions) {
        //   height1 = updatedPositions[0].height;
  
        //   const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height1);
        //   var pckTime = point.date + 'T' + point.time + 'Z';
        //   const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
        //   positionProperty.addSample(time, position);
  
        // })
        const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0);
        const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
        positionProperty.addSample(time, position);
  
      });
  
      // Reassign the newly filled positionProperty to the vehicle entity
      vehicleEntity.position = positionProperty;
      vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);
      vehicleEntity.path.show = true; // Ensure the path is visible
  
      viewer.clock.shouldAnimate = true;  // Start the animation
      // viewer.trackedEntity = vehicleEntity; // Optionally start tracking the vehicle again
  
      // Ensure the scene updates
      viewer.scene.requestRender();
      var scene = viewer.scene;
      var camera = viewer.camera;
  
      // viewer.scene.preRender.addEventListener(function (scene, time) {
      //   var position = positionProperty.getValue(time);
      //   if (position) {
      //     // Adjust the camera to look at the vehicle from a fixed distance and angle
      //     var offset = new Cesium.Cartesian3(0, -500, 500); // Adjust these values as needed
      //     var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      //     camera.lookAtTransform(transform, offset);
      //   }
      // });
    }
  
    function pauseAnimation() {
      viewer.clock.shouldAnimate = false; // Pause the animation
    }
  
    function stopAnimation() {
      index = 0;
      viewer.clock.shouldAnimate = false;
      viewer.clock.currentTime = viewer.clock.startTime; // Reset the time to the start
      isBtnStopped = true;
      // Clear the SampledPositionProperty and re-add only the first data point
      positionProperty = new Cesium.SampledPositionProperty();
      const startDataPoint = dataPoints[0];
  
      // var poi2 = Cesium.Cartographic.fromDegrees(startDataPoint.lon, startDataPoint.lat);
  
      // var height2;
      // Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi2]).then(function(updatedPositions) {
      //   height2 = updatedPositions[0].height;
  
      //   const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, height2);
      //   const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
      //   positionProperty.addSample(startTime, startPosition);
      // })
  
      const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, 0);
      const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
      positionProperty.addSample(startTime, startPosition);
  
      // Reset the vehicle's position and orientation
      vehicleEntity.position = positionProperty;
      vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);
  
      // Hide the path
      vehicleEntity.path.show = false;
  
      // Optional: Reset the camera view
      viewer.trackedEntity = undefined;
      viewer.scene.requestRender();
    }
  
  
    // Request the viewer to render the scene
    viewer.scene.requestRender();
  
    var mapDiv = document.getElementById(globalMapDivID);
    mapDiv.style.position = 'relative'; // Ensure mapDiv is positioned
    // mapDiv.style.display = 'flex'; // Set display to flex to center the child div
    // mapDiv.style.justifyContent = 'center'; // Center horizontally
    // mapDiv.style.alignItems = 'center'; // Center vertically
  
    // var toggleLayersDiv = document.createElement("div");
    // toggleLayersDiv.className = "toggleLayers";
    // toggleLayersDiv.id = "toggleTrackLayers";
    // //var mapDiv = document.getElementById(globalMapDivID);
    // mapDiv.appendChild(toggleLayersDiv);
    // // document.body.appendChild(toggleLayersDiv);
    // toggleLayersDiv.style.position = "absolute";
    // toggleLayersDiv.style.display = "flex";
    // toggleLayersDiv.style.justifyContent = "center";
    // toggleLayersDiv.style.top = "8%";
    // toggleLayersDiv.style.right = "10px";
    // toggleLayersDiv.style.width = "22%";
    // toggleLayersDiv.style.backgroundColor = "cornsilk";
    // toggleLayersDiv.style.borderRadius = "5px";
    // toggleLayersDiv.style.opacity = "0.8";
    // toggleLayersDiv.style.zIndex = "4";
    // var routelineCheckbox = document.createElement("input");
    // routelineCheckbox.id = "checkrouteline";
    // routelineCheckbox.type = "checkbox";
    // routelineCheckbox.name = "Route Line";
    // routelineCheckbox.value = "Route Line";
    // routelineCheckbox.checked = true;
    // toggleLayersDiv.appendChild(routelineCheckbox);
    // // routelineCheckbox.onclick = routeLinevisibility;
    // document.getElementById("toggleTrackLayers").append("Route Line");
  
    // var routevehicleCheckbox = document.createElement("input");
    // routevehicleCheckbox.id = "checkresource";
    // routevehicleCheckbox.type = "checkbox";
    // routevehicleCheckbox.name = "Resource";
    // routevehicleCheckbox.value = "Resource";
    // routevehicleCheckbox.checked = true;
    // toggleLayersDiv.appendChild(routevehicleCheckbox);
    // // routevehicleCheckbox.onclick = resourcevisibility;
    // document.getElementById("toggleTrackLayers").append("Resource");
  
    // var infoCheckbox = document.createElement("input");
    // infoCheckbox.id = "checkinfobox";
    // infoCheckbox.type = "checkbox";
    // infoCheckbox.name = "Infobox";
    // infoCheckbox.value = "Infobox";
    // infoCheckbox.checked = false; //@Sh by default is false
    // toggleLayersDiv.appendChild(infoCheckbox);
    // //infoCheckbox.onclick = infoboxvisibility;
    // document.getElementById("toggleTrackLayers").append("Infobox");
  
    // var deviatedpointCheckbox = document.createElement("input");
    // deviatedpointCheckbox.id = "checkdeviatedpoint";
    // deviatedpointCheckbox.type = "checkbox";
    // deviatedpointCheckbox.name = "Route Deviation";
    // deviatedpointCheckbox.value = "Route Deviation";
    // deviatedpointCheckbox.checked = false;
    // toggleLayersDiv.appendChild(deviatedpointCheckbox);
    // // deviatedpointCheckbox.onclick = routeLinevisibility;
    // document.getElementById("toggleTrackLayers").append("Route Deviation");
  
    // routelineCheckbox.addEventListener('change', function () {
    //   if (this.checked) {
    //     checkLine = true;
    //     console.log('Checkbox is checked');
    //     gbl_lineEntity.forEach(element => {
    //       map.entities.add(element);
    //     });
    //   } else {
    //     checkLine = false;
    //     console.log('Checkbox is not checked');
    //     gbl_lineEntity.forEach(element => {
    //       map.entities.remove(element);
    //     });
    //   }
    // });
  
    // routevehicleCheckbox.addEventListener('change', function () {
    //   if (this.checked) {
    //     map.entities.add(vehicleEntity);
    //   } else {
    //     map.entities.remove(vehicleEntity);
    //   }
    // });
  
    // var infoTableDiv = document.createElement("div");
    // infoTableDiv.className = "dataTable";
    // infoTableDiv.id = "infoTable";
    // // document.body.appendChild(infoTableDiv);
    // mapDiv.appendChild(infoTableDiv);
    // var infoTableRowsDiv = document.createElement("div");
    // infoTableRowsDiv.className = "rows";
    // infoTableDiv.appendChild(infoTableRowsDiv);
  
    // infoTableRowsDiv.innerHTML =
    //   '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';
  
    // var trackresourceDivv = document.getElementById('trackresourceDiv');
    // var trackcallSignDiv = document.getElementById('trackcallSignDiv');
  
    // // var vehicleNo = param.vehicleData.vehicleNumber;
    // // var vehicleType = param.vehicleData.vehicleType;
  
  
    // infoTableDiv.style.position = "absolute";
    // infoTableDiv.style.top = "20%";
    // infoTableDiv.style.right = "10px";
    // infoTableDiv.style.width = "20%";
    // infoTableDiv.style.zIndex = "4";
    // infoTableDiv.style.visibility = "hidden"; //@sh disabled
  
    // infoTableRowsDiv.style.position = "relative";
    // infoTableRowsDiv.style.top = "2px";
    // infoTableRowsDiv.style.left = "2px";
    // infoTableRowsDiv.style.backgroundColor = "white";
    // infoTableRowsDiv.style.opacity = "1";
    // infoTableRowsDiv.style.borderRadius = "5px";
  
    // infoCheckbox.addEventListener('change', function () {
    //   if (this.checked == false) {
    //     document.getElementById("infoTable").style.visibility = "hidden";
    //   } else {
    //     document.getElementById("infoTable").style.visibility = "visible";
    //   }
    // });

    setTimeout(function() {
      var targetPosition = Cesium.Cartesian3.fromDegrees(startPacket.lon, startPacket.lat, 5000.0);
      var offset = new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 5000);
      viewer.camera.lookAt(targetPosition, offset);
    }, 5000);
  
    var mapControls = document.createElement("div");
    mapControls.className = "mapControlss";
    mapControls.id = "controlButtons";
    mapControls.style.position = 'absolute';
    mapControls.style.bottom = '10px';
    mapControls.style.zIndex = '100';
    mapControls.style.display = 'flex';
    mapControls.style.gap = '10px';
    mapControls.style.padding = '10px'; // Padding around buttons
    mapControls.style.border = '4px double #ffffff'; // White border
    mapControls.style.borderRadius = '20px'; // Rounded corners for the capsule effect
    mapControls.style.background = '#000000'; // Black background
    mapControls.style.left = '42%';
  
    mapDiv.appendChild(mapControls);
  
    var playBut = document.createElement("button");
    var pausBut = document.createElement("button");
    var stopBut = document.createElement("button");
  
    playBut.id = "playButton";
    pausBut.id = "pauseButton";
    stopBut.id = "stopButton";
  
    playBut.className = pausBut.className = stopBut.className = "tripControlbtn";
    playBut.style.padding = pausBut.style.padding = stopBut.style.padding = '5px 10px';
    playBut.style.background = pausBut.style.background = stopBut.style.background = '#0000ff'; // Blue by default
    playBut.style.border = pausBut.style.border = stopBut.style.border = '1px solid #ccc';
    playBut.style.borderRadius = pausBut.style.borderRadius = stopBut.style.borderRadius = '4px';
    playBut.style.cursor = pausBut.style.cursor = stopBut.style.cursor = 'pointer';
    playBut.style.outline = pausBut.style.outline = stopBut.style.outline = 'none';
  
    playBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'play.png" style="width: 20px; height: 20px;">';
    playBut.title = "Play";
    pausBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'pause.png" style="width: 20px; height: 20px;">';
    pausBut.title = "Pause";
    stopBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'stop.png" style="width: 20px; height: 20px;">';
    stopBut.title = "Stop";
  
    mapControls.appendChild(playBut);
    mapControls.appendChild(pausBut);
    mapControls.appendChild(stopBut);

    var speedControl = document.createElement("select");
    speedControl.id = "speedControl";
    speedControl.className = "tripControlbtn"; // You can use existing styling or define new one
    speedControl.style.padding = '5px 10px';
    speedControl.style.marginLeft = '10px'; // Space it out from the buttons
    speedControl.style.cursor = 'pointer';

    const speeds = [1, 2, 3, 4, 5]; // Define speed multipliers
    speeds.forEach(speed => {
      var option = document.createElement("option");
      option.value = speed;
      option.text = speed + 'x';
      speedControl.appendChild(option);
    });

    mapControls.appendChild(speedControl);

    speedControl.addEventListener('change', function () {
      // viewer.clock.multiplier = parseFloat(this.value); // Update the clock multiplier from the dropdown
      let val = (parseFloat(this.value)) * 10;
      viewer.clock.multiplier = val;
    });
  
    // Function to reset all buttons to default color
    function resetButtonColors() {
      playBut.style.background = '#0000ff'; // Blue
      pausBut.style.background = '#0000ff'; // Blue
      stopBut.style.background = '#0000ff'; // Blue
    }
  
    // Event listeners for buttons
    playBut.addEventListener('click', function () {
      resetButtonColors();
      playBut.style.background = '#ff0000'; // Red
    });
  
    pausBut.addEventListener('click', function () {
      resetButtonColors();
      pausBut.style.background = '#ff0000'; // Red
    });
  
    stopBut.addEventListener('click', function () {
      resetButtonColors();
      stopBut.style.background = '#ff0000'; // Red
    });
  
    document.getElementById('playButton').addEventListener('click', playAnimation);
    document.getElementById('pauseButton').addEventListener('click', pauseAnimation);
    document.getElementById('stopButton').addEventListener('click', stopAnimation);

  }

};


///////////////////////////////

function time_diff(t1, t2) {
  var timeStart = new Date("01/01/2007 " + t1).getHours();
  var timeEnd = new Date("01/01/2007 " + t2).getHours();

  // get total seconds between the times
  var delta =
    Math.abs(new Date("01/01/2007 " + t1) - new Date("01/01/2007 " + t2)) /
    1000;

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  var seconds = delta % 60;

  return hours + ":" + minutes + ":" + seconds;
}

function time_diffForTripInSec(t1, t2) {
  var timeStart = new Date("01/01/2007 " + t1).getHours();
  var timeEnd = new Date("01/01/2007 " + t2).getHours();

  // get total seconds between the times
  var delta =
    Math.abs(new Date("01/01/2007 " + t1) - new Date("01/01/2007 " + t2)) /
    1000;

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  var seconds = delta % 60;

  var hms = hours + ":" + minutes + ":" + seconds;

  var a = hms.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var returnseconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  return returnseconds;
}

function time_chk(t1, t2) {
  console.log("Date1:", t1, "Date1:", t2);
  var date1, date2;
  date1 = new Date(t1);
  date2 = new Date(t2);
  var res = Math.abs(date1 - date2) / 1000;
  // get total days between two dates
  var days = Math.floor(res / 86400);
  // get hours
  var hours = Math.floor(res / 3600) % 24;
  // get minutes
  var minutes = Math.floor(res / 60) % 60;
  // get seconds
  var seconds = res % 60;

  var hms = hours + ":" + minutes + ":" + seconds;

  var a = hms.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  console.log("returnseconds::::-->", seconds);
  return seconds;
}

tmpl.Trip.replay = function () {
  if (tripDataForReplyFromDisplay_flag == true) {
    tripDataForReplyFromDisplay.hideAllLayers = true;
    tmpl.Trip.animation(tripDataForReplyFromDisplay);
    tripDataForReplyFromDisplay_flag = false;
  }
};
tmpl.Trip.play = function () {
  // var map = param.map;
  tripDataForReplyFromDisplay_flag = true;
  if (tripDataForReplyFromDisplay_flag == true) {
    // if(map){
    // map.getView().setZoom(15);
    // }
    tripDataForReplyFromDisplay.hideAllLayers = true;
    tmpl.Trip.animation(tripDataForReplyFromDisplay);
    tripDataForReplyFromDisplay_flag = false;
  } else {
    //console.log(current_status_flag);
  }
};

tmpl.Trip.firstplay = function () {
  console.log("I am being called 1");
  // var map = param.map;
  console.log("Trip Play Function-->1", tripDataForReplyFromDisplay);
  tripDataForReplyFromDisplay_flag = true;
  if (tripDataForReplyFromDisplay_flag === true) {
    // if(map){
    // map.getView().setZoom(15);
    // }
    tripDataForReplyFromDisplay.hideAllLayers = true;
    console.log("Trip Play Function-->2", tripDataForReplyFromDisplay);
    tmpl.Trip.animation(tripDataForReplyFromDisplay);
    tripDataForReplyFromDisplay_flag = false;
  } else {
    //console.log(current_status_flag);
  }
};

function rotate(seg) {
  b_x = 0;
  b_y = 1;
  a_x = seg.x2 - seg.x1;
  a_y = seg.y2 - seg.y1;
  angle_rad = Math.acos(
    (a_x * b_x + a_y * b_y) / Math.sqrt(a_x * a_x + a_y * a_y)
  );
  if (a_x < 0) {
    return 2 * Math.PI - angle_rad;
  } else {
    return angle_rad;
  }
}
var firs_delayFlag = false;
tmpl.Trip.animation = function (param) {
  var previousDistance = 0;
  console.log(param);
  var data1 = param.data;
  var map = param.map;
  var tripVehicleId = param.id;
  uniqueData = [];
  var halt_points = param.halt_points;
  var halt_img;
  var route_color = param.route_color;
  var callbackFunc = param.callbackFunc;
  var routeMouseOverDetails = param.routeMouseOverDetails;
  var hideAllLayers = param.hideAllLayers;
  var vehicle_icon_scale = param.icon_scale;
  var label = param.label;
  var tooltipLocation = param.tooltipLocation;
  var tripEndCallbackFunc = param.tripEndCallbackFunc;
  var noZoom = param.noZoom;
  var directionImgae = param.directionImgae;
  if (label == undefined) label = "";
  if (directionImgae == undefined)
    directionImgae = "https://openlayers.org/en/v4.0.1/examples/data/arrow.png";
  tripAnimation_started = true;
  if (param.routeMouseOverDetails == true) {
    EnableTripToolTip(map, tooltipLocation);
  }

  if (param.halt_points == true) {
    halt_img = param.halt_img;
    temp_store_animation_stop.halt_img = halt_img;
  }
  var img_url = param.img_url;
  temp_store_animation_stop.map = map;
  temp_store_animation_stop.data = data1;
  temp_store_animation_stop.img_url = img_url;
  temp_store_animation_stop.callbackFunc = callbackFunc;
  temp_store_animation_stop.route_color = route_color;
  temp_store_animation_stop.routeMouseOverDetails = routeMouseOverDetails;
  temp_store_animation_stop.halt_points = halt_points;
  temp_store_animation_stop.track_halt_points = param.track_halt_points;
  temp_store_animation_stop.uniqueData = param.uniqueData;
  temp_store_animation_stop.icon_scale = param.icon_scale;
  temp_store_animation_stop.tooltipLocation = param.tooltipLocation;
  temp_store_animation_stop.tripEndCallbackFunc = param.tripEndCallbackFunc;
  temp_store_animation_stop.noZoom = param.noZoom;
  temp_store_animation_stop.directionImgae = param.directionImgae;
  animatebtn(map);
  //console.log("before sort:"+data1.length);
  var prevLat, prevLon;
  var tempFilterArray = [];
  // console.log("DATAAAA ===> ",data1);
  for (var i = 0; i < data1.length - 2; i++) {
    var lat = parseFloat(data1[i].lat);
    var lon = parseFloat(data1[i].lon);
    // var tempTime11 = data1[i].time.slice(0, 8);
    var tempTime11 = data1[i].datetime;
    data1[i].time = tempTime11;
    var str = lon.toString() + lat.toString();
    if (tempFilterArray.indexOf(str) == -1) {
      tempFilterArray.push(str);

      uniqueData.push(data1[i]);
      console.log("uniqueData.....", uniqueData);
      // if(tripHaltPointsGlobal.some(el => el.id === data1[i].id)){

      // }
      // else{
      // uniqueData.push(data1[i]);
      // }
    }
    // //console.log(data1[i].speed,data1[i].speed == 0 );
    // if(data1[i].speed == 0){

    // if(track_halt_points_id.indexOf(str) == -1){
    // track_halt_points_id.push(str);
    // track_halt_points.push({
    // lat : data1[i].lat,
    // lng : data1[i].lon,
    // location : data1[i].location,
    // date : data1[i].date,
    // startTime : data1[i].time,
    // endTime : data1[i].time,
    // id : str
    // });
    // }else{
    // track_halt_points[track_halt_points.length - 1].endTime = data1[i].time;
    // }
    // }
  }
  // console.log("Unique data in trip animation ===> ",uniqueData);
  if (noZoom == true) {
  } else {
    tmpl.Zoom.toXYcustomZoom({
      map: map,
      latitude: uniqueData[0].lat,
      longitude: uniqueData[0].lon,
      zoom: tripScale,
    });
  }

  var index = 1;
  var i = index;

  var temp_halt_index = "";
  extraAnimation();
  function panMap(point) {
    var map = this.map;
    var current = point;
    var currentgps = new ol.geom.Point(current);
    var cur_veh = new ol.Feature(currentgps);
    //cur_veh=ol.proj.transform(cur_veh, 'EPSG:4326', 'EPSG:3857');
    var view_port = map.getView().calculateExtent(map.getSize());
    var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
    if (vehicle_inside == false) {
      map.getView().setCenter(current);
    }
  }
  // function drawAnimatedLine(
  //   startPt,
  //   endPt,
  //   steps,
  //   trak_animationSpeed,
  //   fn,
  //   properties,
  //   delay
  // ) {
  //   //console.log(startPt, endPt, steps, trak_animationSpeed, fn,properties,delay);
  //   if (tripHaltPointsGlobal.some((el) => el.id === properties.id)) {
  //     clearInterval(ivlDraw);
  //     extraAnimation();
  //     return;
  //   } else {
  //     var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
  //     var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
  //     var i = 0;
  //     var prevLayer;
  //     var newEndPt;

  //     temp_store_animation_pause = {
  //       startPt: startPt,
  //       endPt: endPt,
  //       steps: trak_animationSteps,
  //       time: trak_animationSpeed,
  //       properties: properties,
  //       delayProperties: delay,
  //     };

  //     if (callbackFunc != undefined) callbackFunc(properties);
  //     var angle = rotate({
  //       x1: startPt[0],
  //       y1: startPt[1],
  //       x2: endPt[0],
  //       y2: endPt[1],
  //     });

  //     ivlDraw = setInterval(function () {
  //       // var timestamp = new Date().getTime();
  //       // var drawTripData = requestAnimationFrame(function (timestamp) {
  //       // alert();
  //       if (i > trak_animationSteps) {
  //         clearInterval(ivlDraw);
  //         console.log("ivlDraw@@@@@@@@@@ ", ivlDraw);
  //         extraAnimation();
  //         return;
  //       }
  //       // Vehicle Animation with Smooth Movement //@sh
  //       newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
  //       //newEndPt = endPt ;
  //       panMap(newEndPt);
  //       // console.log('newEndPt ==> ',newEndPt);
  //       temp_store_animation_pause.startPt = newEndPt;
  //       temp_store_animation_pause.steps = temp_store_animation_pause.steps - 1;
  //       var line = new ol.geom.LineString([startPt, newEndPt]);
  //       var point = new ol.geom.Point(newEndPt);
  //       var fea = new ol.Feature(line);
  //       fea.setProperties(properties);
  //       //console.log(newEndPt,endPt);

  //       if (newEndPt[0] == endPt[0] && newEndPt[1] == endPt[1]) {
  //         fea.set("inter", false);
  //         //console.log(true);
  //       } else {
  //         fea.set("inter", true);
  //       }

  //       var delay_halt_fea = new ol.Feature(point);
  //       delay_halt_fea.setProperties(properties);
  //       //delay_halt_fea=ol.proj.transform(delay_halt_fea, 'EPSG:4326', 'EPSG:3857');
  //       var p_fea = new ol.Feature(point);
  //       //p_fea=ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
  //       if (trip_lines_layer_flag == false) {
  //         trip_lines_layer = new ol.layer.Vector({
  //           source: new ol.source.Vector({
  //             features: [fea],
  //           }),
  //           //style: styleFunction
  //           style: new ol.style.Style({
  //             stroke: new ol.style.Stroke({
  //               color: route_color,
  //               width: 6, //@sh increased width from 4 to 6
  //             }),
  //           }),
  //         });
  //         trip_lines_layer.set("trip", "TripAnimationLayer");
  //         trip_lines_layer.setMap(map);
  //         tmpl_setMap_layer_global.push({
  //           layer: trip_lines_layer,
  //           title: "TripAnimationLayer",
  //           visibility: true,
  //           map: map,
  //         });
  //         //map.addLayer(trip_lines_layer);
  //         trip_lines_layer_flag = true;
  //         trip_lines_layer.setVisible(true); //@shhh  Set as true for trip animation line
  //       } else {
  //         if (Trip_global_delay_time != -1) {
  //           //console.log("outside",delay,Trip_global_delay_time);
  //           delay = parseInt(delay);
  //           if (delay < Trip_global_delay_time) {
  //             trip_lines_layer.getSource().addFeature(fea);
  //             firs_delayFlag = false;
  //           } else {
  //             if (firs_delayFlag == false) {
  //               delay_halt_fea.set("rendering_type", 12);
  //               tmpl_trip_halt_animation.getSource().addFeature(delay_halt_fea);
  //               firs_delayFlag = true;
  //               //console.log("inside",delay,Trip_global_delay_time);
  //             }
  //           }
  //         } else {
  //           trip_lines_layer.getSource().addFeature(fea);
  //         }
  //       }
  //       if (trip_lines_layer_direction_flag == false) {
  //         trip_lines_layer_direction = new ol.layer.Vector({
  //           source: new ol.source.Vector(),
  //         });
  //         trip_lines_layer_direction.setMap(map);
  //         tmpl_setMap_layer_global.push({
  //           layer: trip_lines_layer_direction,
  //           title: "TripAnimationLayerDirection",
  //           visibility: true,
  //           map: map,
  //         });
  //         //map.addLayer(trip_lines_layer_direction);
  //         trip_lines_layer_direction_flag = true;
  //       } else {
  //         if (fea.get("inter") == false) {
  //           var dx = newEndPt[0] - startPt[0];
  //           var dy = newEndPt[1] - startPt[1];
  //           var xxx = new ol.geom.LineString([startPt, newEndPt]);
  //           var curdis = Math.round(xxx.getLength() * 100) / 100;
  //           previousDistance = previousDistance + curdis;
  //           var rotation = Math.atan2(dy, dx);
  //           //console.log(previousDistance);
  //           if (previousDistance > 600) {
  //             previousDistance = 0;

  //             p_fea.setStyle(
  //               new ol.style.Style({
  //                 image: new ol.style.Icon({
  //                   src: directionImgae,
  //                   anchor: [0.75, 0.5],
  //                   rotateWithView: true,
  //                   rotation: -rotation
  //                 }),
  //               })
  //             );
  //           } else {
  //             p_fea.setStyle(
  //               new ol.style.Style({
  //                 image: new ol.style.Circle({
  //                   radius: 0,
  //                   fill: new ol.style.Fill({
  //                     color: "rgba(55, 155, 55, 1)",
  //                   }),
  //                 }),
  //               })
  //             );
  //           }
  //           trip_lines_layer_direction.getSource().addFeature(p_fea);
  //         }
  //       }
  //       if (trip_end_marker_flag == false) {
  //         var scale = 1;
  //         if (vehicle_icon_scale != undefined) scale = vehicle_icon_scale;
  //         p_fea.setStyle(
  //           new ol.style.Style({
  //             image: new ol.style.Icon({
  //               src: img_url,
  //               //rotation: angle,
  //               //scale: scale,
  //               anchor: [0.5, 1], //@sh added for icon issue
  //               //opacity: 0.9, // Set the desired opacity value between 0 and 1
  //               //color: route_color, //@sh color
  //             }),
  //           })
  //         );
  //         p_fea.setProperties(properties);
  //         p_fea.set("rendering_type", 13);
  //         p_fea.set("id", tripVehicleId);
  //         p_fea.set("layer_name", "trip_vehcile_marker");
  //         trip_end_Marker = new ol.layer.Vector({
  //           title: "trip_vehcile_marker",
  //           source: new ol.source.Vector({
  //             features: [p_fea],
  //           }),
  //         });
  //         trip_end_Marker.setMap(map);

  //         tmpl_setMap_layer_global.push({
  //           layer: trip_end_Marker,
  //           title: "trip_vehcile_marker",
  //           visibility: true,
  //           map: map,
  //         });

  //         trip_end_marker_flag = true;
  //       } else {
  //         //p_fea.setProperties(properties);
  //         if (trip_end_Marker.getSource().getFeatures().length == 1) {
  //           trip_end_Marker
  //             .getSource()
  //             .getFeatures()[0]
  //             .setProperties(properties);
  //           //trip_end_Marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle); //@sh Removed for disable rotation
  //           if (
  //             appConfigInfo.mapData == "hereMaps" ||
  //             appConfigInfo.mapData == "trinity" ||
  //             appConfigInfo.mapData == "sgl" ||
  //             appConfigInfo.mapData == "mmi"
  //           ) {
  //             //newEndPt = ol.proj.transform(newEndPt, 'EPSG:4326', 'EPSG:3857');
  //             p_fea = ol.proj.transform(p_fea, "EPSG:4326", "EPSG:3857");
  //           }
  //           trip_end_Marker
  //             .getSource()
  //             .getFeatures()[0]
  //             .getGeometry()
  //             .setCoordinates(newEndPt);
  //         } else {
  //           if (appConfigInfo.mapData == "hereMaps") {
  //             //p_fea = ol.proj.transform(p_fea, 'EPSG:4326', 'EPSG:3857');
  //           }
  //           trip_end_Marker.getSource().addFeatures([p_fea]);
  //         }
  //       }
  //       i++;
  //       // })
  //     }, trak_animationSpeed);
  //   }
  // }

  function drawAnimatedLine(startPt, endPt, steps, trak_animationSpeed, fn, properties, delay) {
    if (tripHaltPointsGlobal.some(el => el.id === properties.id)) {
        clearInterval(ivlDraw);
        extraAnimation();
        return;
    } else {
        var directionX = (endPt[0] - startPt[0]) / trak_animationSteps;
        var directionY = (endPt[1] - startPt[1]) / trak_animationSteps;
        var i = 0;
        var prevLayer;
        var newEndPt;
 
        temp_store_animation_pause = {
            startPt: startPt,
            endPt: endPt,
            steps: trak_animationSteps,
            time: trak_animationSpeed,
            properties: properties,
            delayProperties: delay
        };
 
        if (callbackFunc != undefined) callbackFunc(properties);
        var angle = rotate({ x1: startPt[0], y1: startPt[1], x2: endPt[0], y2: endPt[1] });
 
        ivlDraw = setInterval(function () {
            if (i > trak_animationSteps) {
                clearInterval(ivlDraw);
                extraAnimation();
                return;
            }
 
            newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];
            panMap(newEndPt);
            temp_store_animation_pause.startPt = newEndPt;
            temp_store_animation_pause.steps = temp_store_animation_pause.steps - 1;
            var line = new ol.geom.LineString([startPt, newEndPt]);
            var point = new ol.geom.Point(newEndPt);
            var fea = new ol.Feature(line);
            fea.setProperties(properties);
 
            if (newEndPt[0] == endPt[0] && newEndPt[1] == endPt[1]) {
                fea.set('inter', false);
            } else {
                fea.set('inter', true);
            }
 
            var delay_halt_fea = new ol.Feature(point);
            delay_halt_fea.setProperties(properties);
            var p_fea = new ol.Feature(point);
 
            if (trip_lines_layer_flag == false) {
                trip_lines_layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [fea]
                    }),
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: route_color,
                            width: tripRouteWidth
                        })
                    })
                });
                trip_lines_layer.set("trip", "TripAnimationLayer");
                trip_lines_layer.setMap(map);
                tmpl_setMap_layer_global.push({
                    layer: trip_lines_layer,
                    title: 'TripAnimationLayer',
                    visibility: true,
                    map: map
                });
                trip_lines_layer_flag = true;
                trip_lines_layer.setVisible(true);
            } else {
                if (Trip_global_delay_time != -1) {
                    delay = parseInt(delay);
                    if (delay < Trip_global_delay_time) {
                        trip_lines_layer.getSource().addFeature(fea);
                        firs_delayFlag = false;
                    } else {
                        if (firs_delayFlag == false) {
                            delay_halt_fea.set('rendering_type', 12);
                            tmpl_trip_halt_animation.getSource().addFeature(delay_halt_fea);
                            firs_delayFlag = true;
                        }
                    }
                } else {
                    trip_lines_layer.getSource().addFeature(fea);
                }
            }
 
            if (trip_lines_layer_direction_flag == false) {
                trip_lines_layer_direction = new ol.layer.Vector({
                    source: new ol.source.Vector()
                });
                trip_lines_layer_direction.setMap(map);
                tmpl_setMap_layer_global.push({
                    layer: trip_lines_layer_direction,
                    title: 'TripAnimationLayerDirection',
                    visibility: true,
                    map: map
                });
                trip_lines_layer_direction_flag = true;
            } else {
                if (fea.get('inter') == false) {
                    var dx = newEndPt[0] - startPt[0];
                    var dy = newEndPt[1] - startPt[1];
                    var xxx = new ol.geom.LineString([startPt, newEndPt]);
                    var curdis = Math.round(xxx.getLength() * 100) / 100;
                    previousDistance = previousDistance + curdis;
                    var rotation = Math.atan2(dy, dx);
                    if (previousDistance > 600) {
                        previousDistance = 0;
 
                        p_fea.setStyle(new ol.style.Style({
                            image: new ol.style.Icon({
                                src: directionImgae,
                                anchor: [0.75, 0.5],
                                rotateWithView: true,
                                rotation: -rotation
                            })
                        }));
                    } else {
                        p_fea.setStyle(new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 0,
                                fill: new ol.style.Fill({
                                    color: 'rgba(55, 155, 55, 1)',
                                })
                            })
                        }));
                    }
                    trip_lines_layer_direction.getSource().addFeature(p_fea);
                }
            }
 
            if (trip_end_marker_flag == false) {
                var scale = 1;
                if (vehicle_icon_scale != undefined) scale = vehicle_icon_scale;
                p_fea.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        src: img_url,
                        rotation: angle,
                        scale: scale
                    })
                }));
                p_fea.setProperties(properties);
                p_fea.set('rendering_type', 13);
                p_fea.set('id', tripVehicleId);
                p_fea.set('layer_name', 'trip_vehcile_marker');
                trip_end_Marker = new ol.layer.Vector({
                    title: 'trip_vehcile_marker',
                    source: new ol.source.Vector({
                        features: [p_fea]
                    })
                });
                trip_end_Marker.setMap(map);
 
                tmpl_setMap_layer_global.push({
                    layer: trip_end_Marker,
                    title: 'trip_vehcile_marker',
                    visibility: true,
                    map: map
                });
 
                trip_end_marker_flag = true;
            } else {
                if (trip_end_Marker.getSource().getFeatures().length == 1) {
                    trip_end_Marker.getSource().getFeatures()[0].setProperties(properties);
                    trip_end_Marker.getSource().getFeatures()[0].getStyle().getImage().setRotation(angle);
                    if (appConfigInfo.mapData == 'hereMaps') {
                    }
                    trip_end_Marker.getSource().getFeatures()[0].getGeometry().setCoordinates(newEndPt);
 
                } else {
                    if (appConfigInfo.mapData == 'hereMaps') {
                    }
                    trip_end_Marker.getSource().addFeatures([p_fea]);
                }
            }
            i++;
        }, trak_animationSpeed);
    }
}

  function extraAnimation() {
    // if(index == uniqueData.length-1){
    // removeTripInfoTable();
    // }
    // console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);

    if (index < uniqueData.length) {
      // console.log("index in extraAnimation ===> ",index);
      i = index;
      //console.log(i);
      // console.log("uniqueData in extraAnimation ===> ",uniqueData);
      // console.log("tripHaltPointsGlobal in extraAnimation ===> ",tripHaltPointsGlobal);
      // if(tripHaltPointsGlobal.some(el => el.id === uniqueData[i].id)){
      if ($("#infoTable").length > 0) {
        document.getElementById("resourceDiv").innerHTML = uniqueData[i].vehNo;
        document.getElementById("callSignDiv").innerHTML =
          uniqueData[i].vehType;
        if (vehicleNumber != undefined && vehicleNumber != null && vehicleNumber != '' & vehicleNumber != "") {
          document.getElementById("resourceDiv").innerHTML = vehicleNumber;
          document.getElementById("callSignDiv").innerHTML = vehicleType;
        }
        document.getElementById("positionDiv").innerHTML =
          uniqueData[i].lon + ", " + uniqueData[i].lat;
        document.getElementById("speedDispDiv").innerHTML =
          (uniqueData[i].speed).toFixed(0) + " km/hr";
        document.getElementById("locationDiv").innerHTML =
          uniqueData[i].location;
        document.getElementById("dateTimeDIv").innerHTML = uniqueData[i].time;
        var lat = parseFloat(uniqueData[i].lat);
        var plat = parseFloat(uniqueData[i - 1].lat);
        var lon = parseFloat(uniqueData[i].lon);
        var plon = parseFloat(uniqueData[i - 1].lon);
        var point, p_point, p_point1;
        var s = time_diff(uniqueData[i].time, uniqueData[i - 1].time);
        s = s.split(":")[0] * 60 * 60 + s.split(":")[1] * 60 + s.split(":")[2];
        var delayProperties = s;
        if (
          appConfigInfo.mapData === "google" ||
          appConfigInfo.mapData === "hereMaps" ||
          appConfigInfo.mapData == "trinity" ||
          appConfigInfo.mapData == "mmi" ||
          appConfigInfo.mapData == "sgl"
        ) {
          point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
          p_point = ol.proj.transform([plon, plat], "EPSG:4326", "EPSG:3857");
        } else {
          point = [lon, lat];
          p_point = [plon, plat];
        }
        var pointGeom = new ol.geom.Point(p_point);
        var p_feature = new ol.Feature({
          geometry: pointGeom,
        });

        if (track_halt_points_id.indexOf(tempFilterArray[i - 1]) != -1) {
          var inin = track_halt_points_id.indexOf(tempFilterArray[i - 1]);
          var plat1 = parseFloat(track_halt_points[inin].lat);
          var plon1 = parseFloat(track_halt_points[inin].lng);
          if (
            appConfigInfo.mapData === "google" ||
            appConfigInfo.mapData === "hereMaps" ||
            appConfigInfo.mapData == "trinity" ||
            appConfigInfo.mapData == "mmi" ||
            appConfigInfo.mapData == "sgl"
          ) {
            p_point1 = ol.proj.transform(
              [plon1, plat1],
              "EPSG:4326",
              "EPSG:3857"
            );
          } else {
            p_point1 = [plon1, plat1];
          }
          var pointGeom1 = new ol.geom.Point(p_point1);
          var p_feature1 = new ol.Feature({
            geometry: pointGeom1,
          });
          p_feature1.setProperties(track_halt_points[inin]);
          //console.log(p_point1);
          if (param.halt_points == true) {
            if (trip_points_layer_flag1 == false) {
              trip_points_layer1 = new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [p_feature1],
                }),
                style: new ol.style.Style({
                  image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: halt_img,
                    //offset : [0,-5]
                  }),
                }),
              });
              trip_points_layer1.set("title", "Halt_Layer");
              map.addLayer(trip_points_layer1);
              trip_points_layer_flag1 = true;
            } else {
              //trip_points_layer1.getSource().clear();
              trip_points_layer1.getSource().addFeature(p_feature1);
            }
          }
        }
      }

      var properties = {
        id: uniqueData[i].id,
        location: uniqueData[i].location,
        speed: uniqueData[i].speed,
        date: uniqueData[i].date,
        time: uniqueData[i].time,
        lat: uniqueData[i].lat,
        lon: uniqueData[i].lon,
      };
      if (hideAllLayers == true) {
        tmpl_trip_vehicle_display.setVisible(false);
        trip_points_layer1.setVisible(false);
        trip_points_layer.setVisible(false);
        //trip_end_Marker
        //trip_lines_layer.setVisible(false);
      }

      if (i == uniqueData.length - 1) {
      }
      index = index + 1;
      drawAnimatedLine(
        p_point,
        point,
        trak_animationSteps,
        trak_animationSpeed,
        function () { },
        properties,
        delayProperties
      );
      // }
    } else {
      //alert("zzz");
      index = index + 1;
      tmpl.Trip.stop();
      if (tripEndCallbackFunc != undefined) tripEndCallbackFunc();
    }
  }
  function panMap(point) {
    try {
      var current = point; //[lat,lon];
      var currentgps = new ol.geom.Point(current);
      var cur_veh = new ol.Feature(currentgps);
      var view_port = map.getView().calculateExtent(map.getSize());
      var vehicle_inside = cur_veh.getGeometry().intersectsExtent(view_port);
      if (vehicle_inside == false) {
        map.getView().setCenter(current);
      }
    } catch (e) {
      console.log("!Error......");
    }
  }

  function animatebtn(map) {
    try {
      var current_status_flag = "start";

      tmpl.Trip.pause = function () {
        if (current_status_flag == "none") {
        } else if (current_status_flag == "start") {
          clearInterval(ivlDraw);
          current_status_flag = "pause";
        } else if (current_status_flag == "pause") {
        } else if (current_status_flag == "stop") {
        }
      };
      tmpl.Trip.play = function () {
        firstrun = false;
        console.log("I am being called 2");
        if (tripDataForReplyFromDisplay_flag == true) {
          tripDataForReplyFromDisplay.hideAllLayers = true;
          tmpl.Trip.animation(tripDataForReplyFromDisplay);
          //tmpl.Trip.display(tripDataForReplyFromDisplay);
          tripDataForReplyFromDisplay_flag = false;
        } else {
          //console.log(current_status_flag);
          if (current_status_flag == "none") {
            //tmpl.Trip.clear({map : temp_store_animation_stop.map});
            tmpl.Trip.stopClear({ map: temp_store_animation_stop.map });
            tmpl.Trip.animation(temp_store_animation_stop);
          } else if (current_status_flag == "start") {
          } else if (current_status_flag == "pause") {
            drawAnimatedLine(
              temp_store_animation_pause.startPt,
              temp_store_animation_pause.endPt,
              temp_store_animation_pause.steps,
              temp_store_animation_pause.time,
              function () { },
              temp_store_animation_pause.properties,
              temp_store_animation_pause.delayProperties
            );
          } else if (current_status_flag == "stop") {
            //tmpl.Trip.clear({map : temp_store_animation_stop.map});
            tmpl.Trip.stopClear({ map: temp_store_animation_stop.map });
            tmpl.Trip.animation(temp_store_animation_stop);
          }
          current_status_flag = "start";
        }
      };

      tmpl.Trip.stop = function (param) {
        if (current_status_flag == "none") {
        } else if (current_status_flag == "start") {
          clearInterval(ivlDraw);
          current_status_flag = "stop";
        } else if (current_status_flag == "pause") {
          clearInterval(ivlDraw);
          current_status_flag = "stop";
        } else if (current_status_flag == "stop") {
        }
      };
      var animationSpeedLevel = 3;
      tmpl.Trip.speedInc = function () {
        var level = animationSpeedLevel + 1;
        console.log("SPEED LEVEL FROM speedInc API ====>", level);
        if (level >= 5) {
          animationSpeedLevel = 5;
          trak_animationSpeed = 30;
        } else if (level == "4" || level == 4) {
          trak_animationSpeed = 50;
        } else if (level == "3" || level == 3) {
          trak_animationSpeed = 100;
        } else if (level == "2" || level == 2) {
          trak_animationSpeed = 250;
        } else if (level == "1" || level == 1) {
          trak_animationSpeed = 450;
        }
      };
      tmpl.Trip.speedDec = function () {
        var level = animationSpeedLevel - 1;
        console.log("SPEED LEVEL FROM speedDec API ====>", level);
        if (level == "5" || level == 5) {
          trak_animationSpeed = 30;
        } else if (level == "4" || level == 4) {
          trak_animationSpeed = 50;
        } else if (level == "3" || level == 3) {
          trak_animationSpeed = 100;
        } else if (level == "2" || level == 2) {
          trak_animationSpeed = 250;
        } else if (level <= 1) {
          trak_animationSpeed = 450;
          animationSpeedLevel = 1;
        }
      };
      tmpl.Trip.speed = function (param) {
        //tmpl.Trip.pause();
        var level = param.level;
        if (level == '10' || level == 10) {
          trak_animationSpeed = 7;
        }else if (level == '5' || level == 5) {
          trak_animationSpeed = 30;
        } else if (level == '4' || level == 4) {
          trak_animationSpeed = 50;
        } else if (level == '3' || level == 3) {
          trak_animationSpeed = 100;
        } else if (level == '2' || level == 2) {
          trak_animationSpeed = 250;
        } else if (level == '1' || level == 1) {
          trak_animationSpeed = 450;
        }else if(level == '15' || level == 15){
          trak_animationSpeed = 5;
        }else if(level == '20' || level == 20){
          trak_animationSpeed = 3;
        }else if(level == '30' || level == 30){
          trak_animationSpeed = 0.1;
        }else if(level == '50' || level == 50){
          trak_animationSpeed = 0.001;
        }
        //console.log(trak_animationSpeed);
      };
    } catch (err) {
      console.warn("API EC Code: TRPG0091_BTN" + err);
    }
  }
};

function DisableTripToolTip(map) {
  map.un("pointermove", mouseHoverDetails);
}
var gbl_trip_clear_tooltip;
function EnableTripToolTip(map, loc) {
  //if(mouseHoverDetails != undefined)
  //DisableTripToolTip(map);

  var ta_tooltip = document.createElement("tooltip");
  ta_tooltip.id = "trip-tooltip";
  ta_tooltip.className = "ol-trip-tooltip";
  var overlay_mouseOver_trip = new ol.Overlay({
    element: ta_tooltip,
    offset: [10, 0],
    positioning: "bottom-left",
  });
  map.addOverlay(overlay_mouseOver_trip);

  this.map = map;

  mouseHoverDetails = function (evt) {
    var feature_mouseOver = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        if (layer) {
          if (
            layer.get("trip") == "TripAnimationLayer" ||
            layer.get("display") == "TripLayerDisplay"
          ) {
            return feature;
          }
        } else {
          for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
            if (tmpl_setMap_layer_global[i].title == "TripAnimationLayer") {
              break;
              return feature;
            }
          }
        }
      }
    );
    gbl_trip_clear_tooltip = ta_tooltip;
    ta_tooltip.style.display = feature_mouseOver ? "" : "none";
    if (feature_mouseOver) {
      //console.log("feature_mouseOver >>",feature_mouseOver.getProperties());
      overlay_mouseOver_trip.setPosition(evt.coordinate);
      if (loc == false) {
        if (feature_mouseOver.getProperties().speed == undefined) {
          //console.log("From API - speed is undefined, replaced with empty string");
          feature_mouseOver.getProperties().speed = "";
        }
        ta_tooltip.innerHTML =
          "Speed:" +
          feature_mouseOver.getProperties().speed +
          "Km/h," +
          feature_mouseOver.getProperties().date +
          "," +
          feature_mouseOver.getProperties().time;
      } else {
        if (feature_mouseOver.getProperties().speed == undefined) {
          //console.log("From API - speed is undefined, replaced with empty string");
          feature_mouseOver.getProperties().speed = "";
        }
        ta_tooltip.innerHTML =
          feature_mouseOver.getProperties().location +
          "," +
          "Speed:" +
          feature_mouseOver.getProperties().speed +
          "Km/h," +
          feature_mouseOver.getProperties().date +
          "," +
          feature_mouseOver.getProperties().time;
      }
    }
  };
  map.on("pointermove", mouseHoverDetails);
}

function removeTripInfoTable() {
  Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
  };
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  };
  var infoTable = document.getElementById("infoTable");
  if (infoTable) {
    infoTable.remove();
  } else {
  }
}

function TripPoints(map) {
  var featureArray = [];
  var point;
  for (var i = 0; i < uniqueData.length; i++) {
    var lat = parseFloat(uniqueData[i].lat);
    var lon = parseFloat(uniqueData[i].lon);
    if (appConfigInfo.mapData === "google" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl") {
      point = ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857");
    } else {
      point = [lon, lat];
    }
    var pointGeom = new ol.geom.Point(point);
    var feature = new ol.Feature({
      geometry: pointGeom,
    });
    featureArray.push(feature);
  }
  if (trip_points_layer_flag == false) {
    trip_points_layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: featureArray,
      }),
    });
    map.addLayer(trip_points_layer);
    trip_points_layer_flag = true;
  } else {
    trip_points_layer.getSource().clear();
    trip_points_layer.getSource().addFeatures(featureArray);
  }
}

tmpl.Feature.getLatLong = function (param) {
  var mapObj = param.map;
  var id = param.id;
  var layerName = param.layer;
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  var latlon;
  var existing;
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer) {
      if (existingLayer.get("title") === layerName) {
        existing = existingLayer;
        existingLayer
          .getSource()
          .getFeatures()
          .forEach(function (feature) {
            if (feature.getProperties()["id"] == id) {
              if (
                appConfigInfo.mapData === "google" ||
                appConfigInfo.mapData == "hereMaps" ||
                appConfigInfo.mapData == "trinity" ||
                appConfigInfo.mapData == "mmi" ||
                appConfigInfo.mapData == "sgl"
              ) {
                latlon = feature.getGeometry().getCoordinates();
                latlon = ol.proj.transform(latlon, "EPSG:3857", "EPSG:4326");
              } else {
                latlon = feature.getGeometry().getCoordinates();
              }
            }
          });
      }
    }
  }
  if (existing == undefined) {
    for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
      if (tmpl_setMap_layer_global[i].title == layerName) {
        tmpl_setMap_layer_global[i].layer
          .getSource()
          .getFeatures()
          .forEach(function (feature) {
            if (feature.get("id") == id) {
              if (
                appConfigInfo.mapData === "google" ||
                appConfigInfo.mapData == "hereMaps" ||
                appConfigInfo.mapData == "trinity" ||
                appConfigInfo.mapData == "mmi" ||
                appConfigInfo.mapData == "sgl"
              ) {
                latlon = feature.getGeometry().getCoordinates();
                latlon = ol.proj.transform(latlon, "EPSG:3857", "EPSG:4326");
              } else {
                latlon = feature.getGeometry().getCoordinates();
              }
            }
          });
      }
    }
  }
  return latlon;
};

// }).call(this,{});  //@BK

function createContextMenu(mapObj, menu_items) {
  contextmenuobj = new ContextMenu({
    width: 170,
    default_items: false, //default_items are (for now) Zoom In/Zoom Out
    items: menu_items,
  });
  mapObj.addControl(contextmenuobj);
  return contextmenuobj;
}

function addMenu(add_menu) {
  contextmenuobj.extend(add_menu);
}

function clearMenu() {
  contextmenuobj.clear();
}

function closeMenu() {
  contextmenuobj.close();
}

function mapToCenter(mapObj, obj) {
  var view = mapObj.getView();
  view.setCenter(obj.coordinate);
}

function getFeatureOnMenuOpen(mapObj, myCallBack) {
  contextmenuobj.on("open", function (evt) {
    var layer;
    var feature = mapObj.forEachFeatureAtPixel(evt.pixel, function (ft, lay) {
      layer = lay;
      return ft;
    });

    var result;
    if (feature != undefined) {
      if (layer == null) {
        result = {
          layerName: feature.get("layer_name"),
          featureId: feature.get("id"),
          properties: feature.getProperties(),
        };
      } else {
        result = {
          layerName: layer.get("title"),
          featureId: feature.get("id"),
          properties: feature.getProperties(),
        };
      }
    } else {
      result = {
        layerName: undefined,
        featureId: "",
      };
    }
    myCallBack(result);
  });
}

function clustering(mapObj) {
  var distance = document.getElementById("distance");

  var count = 20000;
  var features = new Array(count);
  var e = 4500000;
  for (var i = 0; i < count; ++i) {
    var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new ol.Feature(new ol.geom.Point(coordinates));
  }
  var source = new ol.source.Vector({
    features: features,
  });

  var clusterSource = new ol.source.Cluster({
    distance: parseInt(distance.value, 10),
    source: source,
  });
  var styleCache = {};
  var clusters = new ol.layer.Vector({
    source: clusterSource,
    style: function (feature) {
      var size = feature.get("features").length;
      //alert(size);
      var style = styleCache[size];
      if (!style) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: "#fff",
            }),
            fill: new ol.style.Fill({
              color: "#3399CC",
            }),
          }),
          text: new ol.style.Text({
            text: size.toString(),
            fill: new ol.style.Fill({
              color: "#fff",
            }),
          }),
        });
        styleCache[size] = style;
      }
      return style;
    },
  });

  mapObj.addLayer(clusters);

  /*distance.addEventListener('input', function() {
       alert(distance.value);
   clusterSource.setDistance(parseInt(distance.value, 10));   
   });*/
}

tmpl.Fence.clear = function (param) {
  var mapObj = param.map;
  // alert("Fence clear API");
  tmpl.Fence.removeInteraction({ map: mapObj });
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer) {
      if (existingLayer.get("lname") === "fencevector") {
        mapObj.removeLayer(existingLayer);
      }
    }
  }
};

var gbl_routeIds = [];
var gbl_route_edit_data = [];
tmpl.Route.add = function (param) {
  var mapObj = param.map;
  var datas = param.feature;
  var layerName = param.layerName;
  var width = param.width;

  var noLayer,
    routeLine,
    sourcePoint,
    destinationPoint,
    sourceIcon,
    destinationIcon,
    cordStart,
    cordEnd,
    sourceMarker,
    destinationMarker,
    sourceStyle,
    destinationStyle,
    wayPoint;
  var wayPointLatLon, feture_waypoint, globalwaypointStyle, feature;
  var fature_waypoint_Array = [],
    wayPointId = [];

  var format = new ol.format.WKT();

  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer.get("lname") === layerName) {
      noLayer = true;
      routeLayer = existingLayer;
    }
  }
  if (!noLayer) {
    routeLayer = new ol.layer.Vector({
      source: new ol.source.Vector(), //,
      // style: new ol.style.Style({
      // stroke: new ol.style.Stroke({
      // color: 'red',
      // width: 6
      // })
      // })
    });
    routeLayer.setProperties({ lname: layerName });
    routeLayer.setProperties({ title: layerName });
    mapObj.addLayer(routeLayer);
  }

  for (var i = 0; i < datas.length; i++) {
    wayPointId = [];
    routeLine = datas[i].geometry;
    /*sourcePoint = [parseFloat(datas[i].source.lon) ,parseFloat(datas[i].source.lat)];
    console.log("sourcePoint :",sourcePoint);*/
    var sourcePointArray = datas[i].source.geometry;
    /*var ts = sourcePointArray.split("POINT(")[1];
    ts = ts.split(')')[0];
    ts = ts.split(' ');
    var lats = parseFloat(ts[1]);
    var lons = parseFloat(ts[0]);*/
    var p1 = sourcePointArray.split("(");
    var p2 = p1[1].split(")");
    var p3 = p2[0].split(" ");
    var lats = parseFloat(p3[1]);
    var lons = parseFloat(p3[0]);
    sourcePoint = [lons, lats];
    //console.log("sourcePoint :",sourcePoint);
    var destinationPointArray = datas[i].destination.geometry;
    /*var td = destinationPointArray.split("POINT(")[1];
    td = td.split(')')[0];
    td = td.split(' ');
    var latd = parseFloat(td[1]);
    var lond = parseFloat(td[0]);*/
    var p1d = destinationPointArray.split("(");
    var p2d = p1d[1].split(")");
    var p3d = p2d[0].split(" ");
    var latd = parseFloat(p3d[1]);
    var lond = parseFloat(p3d[0]);
    destinationPoint = [lond, latd];
    //console.log("destinationPoint :",destinationPoint);
    //destinationPoint = [parseFloat(datas[i].destination.lon) , parseFloat(datas[i].destination.lat)];
    sourceIcon = datas[i].source.image;
    destinationIcon = datas[i].destination.image;
    wayPoint = datas[i].waypoints;
    //		console.log("wayPoint >>",wayPoint);
    wayPointId.push(datas[i].source.id);
    wayPointId.push(datas[i].destination.id);
    if (
      appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "hereMaps" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "sgl" ||
      appConfigInfo.mapData == "mmi"
    ) {
      feature = format.readFeature(routeLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
    } else {
      feature = format.readFeature(routeLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
    }
    //feature.setProperties({'id':datas[i].id});

    var featureStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: datas[i].route_color,
        width: width,
      }),
    });
    feature.setStyle(featureStyle);

    var keyNames = Object.keys(datas[i]);
    for (var name = 0; name < keyNames.length; name++) {
      if (keyNames[name] == "geometry") {
      } else {
        var value = datas[i][keyNames[name]];
        var x = keyNames[name];
        feature.set("" + x + "", "" + value + "");
      }
    }

    cordStart = ol.proj.transform(sourcePoint, "EPSG:4326", "EPSG:3857");
    cordEnd = ol.proj.transform(destinationPoint, "EPSG:4326", "EPSG:3857");
    sourceMarker = new ol.Feature({
      geometry: new ol.geom.Point(cordStart),
    });
    sourceStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: sourceIcon,
      }),
    });
    sourceMarker.setStyle(sourceStyle);
    //sourceMarker.setProperties({'id':datas[i].source.id});

    var keyNames1 = Object.keys(datas[i].source);
    for (var name = 0; name < keyNames1.length; name++) {
      if (keyNames1[name] == "geometry") {
      } else {
        var value = datas[i].source[keyNames1[name]];
        var x = keyNames1[name];
        sourceMarker.set("" + x + "", "" + value + "");
      }
    }

    destinationMarker = new ol.Feature({
      geometry: new ol.geom.Point(cordEnd),
    });
    destinationStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: destinationIcon,
      }),
    });
    destinationMarker.setStyle(destinationStyle);
    //destinationMarker.setProperties({'id':datas[i].destination.id});

    var keyNames2 = Object.keys(datas[i].destination);
    for (var name = 0; name < keyNames2.length; name++) {
      if (keyNames2[name] == "geometry") {
      } else {
        var value = datas[i].destination[keyNames2[name]];
        var x = keyNames2[name];
        destinationMarker.set("" + x + "", "" + value + "");
      }
    }

    for (var j = 0; j < wayPoint.length; j++) {
      var wayPointArray = wayPoint[j].geometry;
      /*var tw = wayPointArray.split("POINT(")[1];
      tw = tw.split(')')[0];
      tw = tw.split(' ');
      var latw = parseFloat(tw[1]);
      var lonw = parseFloat(tw[0]);*/
      var p1w = wayPointArray.split("(");
      var p2w = p1w[1].split(")");
      var p3w = p2w[0].split(" ");
      var latw = parseFloat(p3w[1]);
      var lonw = parseFloat(p3w[0]);
      if (
        appConfigInfo.mapData == "google" ||
        appConfigInfo.mapData == "hereMaps" ||
        appConfigInfo.mapData == "trinity" ||
        appConfigInfo.mapData == "mmi" ||
        appConfigInfo.mapData == "sgl"
      ) {
        wayPointLatLon = ol.proj.transform(
          [lonw, latw],
          "EPSG:4326",
          "EPSG:3857"
        );
      } else {
        wayPointLatLon = [lonw, latw];
      }
      /*if (appConfigInfo.mapData == "google") {
          wayPointLatLon = ol.proj.transform([parseFloat(wayPoint[j].lon), parseFloat(wayPoint[j].lat)], 'EPSG:4326', 'EPSG:3857');
      } else {
          wayPointLatLon = [parseFloat(wayPoint[j].lon), parseFloat(wayPoint[j].lat)];
      }*/
      feture_waypoint = new ol.Feature({
        geometry: new ol.geom.Point(wayPointLatLon),
      });
      globalwaypointStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: wayPoint[j].image,
        }),
      });
      feture_waypoint.setStyle(globalwaypointStyle);
      // feture_waypoint.setProperties({'id':wayPoint[j].id});

      var keyNames3 = Object.keys(wayPoint[j]);
      for (var name = 0; name < keyNames3.length; name++) {
        if (keyNames3[name] == "geometry") {
        } else {
          var value = wayPoint[j][keyNames3[name]];
          var x = keyNames3[name];
          feture_waypoint.set("" + x + "", "" + value + "");
        }
      }

      routeLayer.getSource().addFeature(feture_waypoint);
      wayPointId.push(wayPoint[j].id);
    }
    routeLayer.getSource().addFeature(sourceMarker);
    routeLayer.getSource().addFeature(destinationMarker);
    routeLayer.getSource().addFeature(feature);

    var rec = { routeId: datas[i].id, pointsId: wayPointId };
    gbl_routeIds.push(rec);
  }
  console.log("gbl_routeIds :", gbl_routeIds);
};

var gbl_routeIdsOnClick = [];

tmpl.Route.addOnClickRoute = function (param) {
  var mapObj = param.map;
  var datas = param.feature;
  var layerName = param.layerName;

  var noLayer,
    routeLine,
    sourcePoint,
    destinationPoint,
    sourceIcon,
    destinationIcon,
    cordStart,
    cordEnd,
    sourceMarker,
    destinationMarker,
    sourceStyle,
    destinationStyle,
    wayPoint;
  var wayPointLatLon,
    feture_waypoint,
    globalwaypointStyle,
    feature,
    featureBuffern,
    bufferLine;
  var fature_waypoint_Array = [],
    wayPointId = [];

  var format = new ol.format.WKT();

  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (var i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer.get("lname") === layerName) {
      noLayer = true;
      routeLayer = existingLayer;
    }
  }
  if (!noLayer) {
    routeLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "red",
          width: 6,
        }),
      }),
    });
    routeLayer.setProperties({ lname: layerName });
    routeLayer.setProperties({ title: layerName });
    mapObj.addLayer(routeLayer);
  }

  for (var i = 0; i < datas.length; i++) {
    wayPointId = [];
    routeLine = datas[i].geometry;
    bufferLine = datas[i].buffer;

    if (appConfigInfo.mapData == "google" ||
      appConfigInfo.mapData == "trinity" ||
      appConfigInfo.mapData == "mmi" ||
      appConfigInfo.mapData == "sgl") {
      feature = format.readFeature(routeLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
        rname: "route",
        routeid: datas[i].id,
      });
      featureBuffer = format.readFeature(bufferLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      });
    } else {
      feature = format.readFeature(routeLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
        rname: "route",
        routeid: datas[i].id,
      });
      featureBuffer = format.readFeature(bufferLine, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
    }

    var sourcePoint1 = feature.getGeometry().getFirstCoordinate();
    sourcePoint = ol.proj.transform(sourcePoint1, "EPSG:3857", "EPSG:4326");
    var destinationPoint1 = feature.getGeometry().getLastCoordinate();
    destinationPoint = ol.proj.transform(
      destinationPoint1,
      "EPSG:3857",
      "EPSG:4326"
    );

    sourceIcon = datas[i].source_image;
    destinationIcon = datas[i].destination_image;

    cordStart = sourcePoint1; // ol.proj.transform(sourcePoint, 'EPSG:4326', 'EPSG:3857');
    cordEnd = destinationPoint1; //ol.proj.transform(destinationPoint, 'EPSG:4326', 'EPSG:3857');
    sourceMarker = new ol.Feature({
      geometry: new ol.geom.Point(cordStart),
      rname: "source",
      routeid: datas[i].id,
    });
    sourceStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: sourceIcon,
      }),
    });
    sourceMarker.setStyle(sourceStyle);

    destinationMarker = new ol.Feature({
      geometry: new ol.geom.Point(cordEnd),
      rname: "destination",
      routeid: datas[i].id,
    });
    destinationStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: destinationIcon,
      }),
    });
    destinationMarker.setStyle(destinationStyle);

    var keyNames = Object.keys(datas[i]);
    for (var name = 0; name < keyNames.length; name++) {
      if (keyNames[name] == "geometry") {
      } else {
        var value = datas[i][keyNames[name]];
        var x = keyNames[name];
        feature.set("" + x + "", "" + value + "");
        featureBuffer.set("" + x + "", "" + value + "");
        sourceMarker.set("" + x + "", "" + value + "");
        destinationMarker.set("" + x + "", "" + value + "");
      }
    }

    routeLayer.getSource().addFeature(sourceMarker);
    routeLayer.getSource().addFeature(destinationMarker);
    routeLayer.getSource().addFeature(feature);
    routeLayer.getSource().addFeature(featureBuffer);

    gbl_route_edit_data[i] = {};
    gbl_route_edit_data[i].source = cordStart;
    gbl_route_edit_data[i].destination = cordEnd;
    gbl_route_edit_data[i].layerName = layerName;
    gbl_route_edit_data[i].routeLayer = routeLayer;
    gbl_route_edit_data[i].id = datas[i].id;

    var rec = { routeId: datas[i].id };
    gbl_routeIdsOnClick.push(rec);
  }
  //console.log("gbl_routeIdsOnClick :",gbl_routeIdsOnClick);
};

tmpl.Route.editOnClickRoute = function (param) {
  var map1 = param.map;
  var routeId = param.routeId;
  var editId;
  var routeLayer;
  var layerName;
  for (var i = 0; i < gbl_route_edit_data.length; i++) {
    if (gbl_route_edit_data[i].id == routeId) {
      editId = routeId;
      routeLayer = gbl_route_edit_data[i].routeLayer;
      layerName = gbl_route_edit_data[i].layerName;
    }
  }
  window.app = {};
  var app = window.app;
  var format = new ol.format.WKT();
  app.Drag = function () {
    ol.interaction.Pointer.call(this, {
      handleDownEvent: app.Drag.prototype.handleDownEvent,
      handleDragEvent: app.Drag.prototype.handleDragEvent,
      handleMoveEvent: app.Drag.prototype.handleMoveEvent,
      handleUpEvent: app.Drag.prototype.handleUpEvent,
    });
    this.coordinate_ = null;
    this.cursor_ = "pointer";
    this.feature_ = null;
    this.previousCursor_ = undefined;
  };
  ol.inherits(app.Drag, ol.interaction.Pointer);

  app.Drag.prototype.handleDownEvent = function (evt) {
    var map = evt.map;
    var feature = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        if (layer.get("title") == layerName) {
          if (
            feature.get("rname") == "source" ||
            feature.get("rname") == "destination"
          ) {
            if (feature.get("routeid") == editId) return feature;
          }
        }
      }
    );

    if (feature) {
      this.coordinate_ = evt.coordinate;
      this.feature_ = feature;
    }
    return !!feature;
  };

  app.Drag.prototype.handleDragEvent = function (evt) {
    var map = evt.map;
    var feature = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        return feature;
      }
    );
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];
    var geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);
    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
  };

  app.Drag.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(
        evt.pixel,
        function (feature, layer) {
          return feature;
        }
      );
      var element = evt.map.getTargetElement();
      if (feature) {
        editFeature = feature;
        point = feature.getGeometry().getCoordinates();
        var point;
        if (appConfigInfo.mapData === "google") {
          point = ol.proj.transform(point, "EPSG:3857", "EPSG:4326");
        } else {
          // do notng
        }
        //point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
        if (element.style.cursor != this.cursor_) {
          this.previousCursor_ = element.style.cursor;
          element.style.cursor = this.cursor_;
        }
      } else if (this.previousCursor_ !== undefined) {
        element.style.cursor = this.previousCursor_;
        this.previousCursor_ = undefined;
      }
    }
  };

  app.Drag.prototype.handleUpEvent = function (evt) {
    var value = this.feature_.getGeometry().getType();
    if (value === "Point") {
      lonlat = this.feature_.getGeometry();
    } else if (value === "LineString") {
      lonlat = this.feature_.getGeometry();
    } else if (value === "Polygon") {
      lonlat = this.feature_.getGeometry();
    }

    if (appConfigInfo.mapData === "google" ||
      appConfigInfo.mapData === "trinity" ||
      appConfigInfo.mapData === "mmi" ||
      appConfigInfo.mapData === "sgl"

    ) {
      coordinate = ol.proj.transform(
        lonlat.getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      );
      wktGeom = format.writeGeometry(
        lonlat.clone().transform("EPSG:3857", "EPSG:4326")
      );
    } else {
      coordinate = lonlat.getCoordinates();
      wktGeom = format.writeGeometry(lonlat);
      //  wktGeom= format.writeGeometry(this.feature_.getGeometry());
    }

    var result = {
      new_coordinates: coordinate,
    };
    var dragFeature = this.feature_;
    if (dragFeature.get("rname") == "source") {
      tmpl.Route.clearRoute({ map: map1 });
      tmpl.Route.getRoute({
        map: map1,
        source: ol.proj.transform(
          dragFeature.getGeometry().getCoordinates(),
          "EPSG:3857",
          "EPSG:4326"
        ),
        destination: click_destination_route[1],
        sourceIcon: sourceImg, //"img/1.png",
        destinationIcon: destinationImg, //"img/2.png",
        radius: radius1, //20,
        getGeometry: test1,
      });
      click_destination_route[0] = ol.proj.transform(
        dragFeature.getGeometry().getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      );
    } else if (dragFeature.get("rname") == "destination") {
      tmpl.Route.clearRoute({ map: map1 });
      tmpl.Route.getRoute({
        map: map1,
        source: click_destination_route[0],
        destination: ol.proj.transform(
          dragFeature.getGeometry().getCoordinates(),
          "EPSG:3857",
          "EPSG:4326"
        ),
        sourceIcon: sourceImg, //"img/1.png",
        destinationIcon: destinationImg, //"img/2.png",
        radius: radius1, //20,
        getGeometry: test1,
      });
      click_destination_route[1] = ol.proj.transform(
        dragFeature.getGeometry().getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      );
    }
    function test1(data) {
      //console.log("data >>>",data);
      tmpl.Geocode.getGeocode({
        point: click_destination_route[0],
        callbackFunc: handleGeocode,
      });
      function handleGeocode(addrs) {
        var result = {
          route: data,
          geocode: addrs,
        };
        callbackFunc(result);
      }
    }
    //mycallback(result);
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
  };
  intr = new app.Drag();
  map1.addInteraction(intr);
};

tmpl.Route.deleteOnClickRoute = function (param) {
  var mapObj = param.map;
  var routeId = param.routeId;
  var lyrName = param.layerName;

  var Layers = mapObj.getLayers();
  var existing;
  for (var i = 0; i < Layers.getLength(); i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer) {
      if (existingLayer.get("title") === lyrName) {
        existing = existingLayer;
        existingLayer
          .getSource()
          .getFeatures()
          .forEach(function (fea) {
            if (fea.getProperties()["id"] == routeId) {
              existingLayer.getSource().removeFeature(fea);
            }
          });
      }
    }
  }
  if (existing == undefined) {
    for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
      if (tmpl_setMap_layer_global[i].title == lyrName) {
        tmpl_setMap_layer_global[i].layer
          .getSource()
          .getFeatures()
          .forEach(function (fea) {
            if (fea.getProperties()["id"] == routeId) {
              tmpl_setMap_layer_global[i].layer.getSource().removeFeature(fea);
            }
          });
      }
    }
  }
};

tmpl.Route.ETAforICCC = function (param) {
  var mapObj = param.map;
  var dist = param.dist;
  var dtime = param.dtime;
  var point = param.point;
  var ta_tooltip = document.createElement("tooltip");
  ta_tooltip.id = "trip-tooltip";
  ta_tooltip.className = "ol-trip-tooltip";
  ta_tooltip.innerHTML = "Distance:" + dist + ", Time:" + dtime;
  var overlay_mouseOver_trip = new ol.Overlay({
    element: ta_tooltip,
    offset: [10, 0],
    positioning: "bottom-left",
  });
  mapObj.addOverlay(overlay_mouseOver_trip);
  overlay_mouseOver_trip.setPosition(
    ol.proj.transform(point, "EPSG:4326", "EPSG:3857")
  );
};

var gbl_addOverlayMap;
var gbl_lastClusterSignature = null;
tmpl.Overlay.addOverlay = function (param) {
  var mapObj = param.map;
  gbl_addOverlayMap = mapObj;
  var point = param.point;
  var img_url = param.img_url;
  var count = param.count;
  var features = param.features;
  var showLabel = param.showLabel;
  var showLabelZoom = param.showLabelZoom;
  var callbackFunc = param.callbackFunc;
  var overlayID = mapObj.getOverlayById("clusterOverlayID");

    var clusterSignature = features
    .map(function (f) {
      return f.id;     
    })
    .sort()
    .join("|");

  if (overlayID && gbl_lastClusterSignature && gbl_lastClusterSignature === clusterSignature) {
    mapObj.removeOverlay(overlayID);
    gbl_lastClusterSignature = null;
    return;
  }

  if (overlayID) {
    mapObj.removeOverlay(overlayID);
  }
  gbl_lastClusterSignature = clusterSignature;
  if (showLabelZoom == undefined) {
    showLabelZoom = 14;
  }
  var container1 = document.createElement("div");
  container1.className = "containerAPI ";
  container1.id = "containerCircular ";
  var elem;
  if (img_url.length > 1) {
    for (var i = 0; i < count; i++) {
      elem = document.createElement("img");
      elem.setAttribute("src", img_url[i]);
      elem.setAttribute("title", features[i].label);
      elem.className = "field";
      elem.id = i;
      container1.appendChild(elem);

      if (showLabel == true) {
        if (gbl_addOverlayMap.getView().getZoom() > showLabelZoom) {
          if (count < 8) {
            elemLabel = document.createElement("div");
            elemLabel.className = "clusterLabel";
            elemLabel.innerHTML = features[i].label;
            elemLabel.id = i;
            container1.appendChild(elemLabel);
          }
        }
      }
    }
  } else {
    for (var i = 0; i < count; i++) {
      elem = document.createElement("img");
      elem.setAttribute("src", img_url[0]);
      elem.setAttribute("title", features[i].label);
      elem.className = "field";
      elem.id = i;
      container1.appendChild(elem);
    }
  }
  setTimeout(function () {
    var radius = 75;
    var fields = $(".field");
    var clusterLabel = $(".clusterLabel");
    var width = 100; //container.width();
    var height = 100; //container.height();
    var angle = 0,
      step = (2 * Math.PI) / fields.length;
    fields.each(function () {
      var x = Math.round(
        width / 2 + radius * Math.cos(angle) - $(this).width() / 2
      );
      var y = Math.round(
        height / 2 + radius * Math.sin(angle) - $(this).height() / 2
      );
      $(this).css({
        left: x + "px",
        top: y + "px",
      });
      //console.log(x,y);
      angle += step;
      //console.log(fields);
    });
    if (showLabel == true) {
      if (gbl_addOverlayMap.getView().getZoom() > showLabelZoom) {
        if (count < 8) {
          var angleLabel = 0,
            stepLabel = (2 * Math.PI) / clusterLabel.length;
          clusterLabel.each(function () {
            var x = Math.round(
              width / 2 + radius * Math.cos(angleLabel) - $(this).width() / 2
            );
            var y = Math.round(
              height / 2 + radius * Math.sin(angleLabel) - $(this).height() / 2
            );
            $(this).css({
              left: x + "px",
              top: y + 20 + "px",
              position: "absolute",
              color: "rgb(0, 0, 0)",
              width: "150px",
              font: "10px sans-serif",
            });
            angleLabel += stepLabel;
          });
        }
      }
    }
    for (var i = 0; i < fields.length; i++) {
      fields[i].onclick = function () {
        //alert("i>"+this.id);
        callbackFunc(this.id);
      };
    }
  }, 50);

  // elem.setAttribute("height", height);
  // elem.setAttribute("width", width);
  // var labelDiv = document.createElement('div');
  // labelDiv.className = 'bottomleft';
  // labelDiv.innerHTML = plName;
  //container.appendChild(labelDiv);
  var marker_pos = new ol.Overlay({
    id: "clusterOverlayID",
    element: container1,
    offset: [-50, -50],
    positioning: "center",
  });
  mapObj.addOverlay(marker_pos);
  if (
    appConfigInfo.mapData == "google" ||
    appConfigInfo.mapData == "hereMaps" ||
    appConfigInfo.mapData == "trinity" ||
    appConfigInfo.mapData == "mmi" ||
    appConfigInfo.mapData == "sgl"


  ) {
    marker_pos.setPosition(ol.proj.transform(point, "EPSG:4326", "EPSG:3857"));
  } else {
    marker_pos.setPosition(point);
  }
  marker_pos.setProperties({ olname: "clusterOverlay" });

  /*mapObj.on('moveend',function() {
    var overlayID = mapObj.getOverlayById('clusterOverlayID');
    if(overlayID){
      mapObj.removeOverlay(overlayID);
    }
  	
  });*/
  // setTimeout(function(){
  // tmpl.Overlay.removeMarker({map:mapObj,id:'clusterOverlayID'})
  // }, 5000);
};

tmpl.Route.buffer = function (param) {
  //var map = param.map;
  var wktGeom = param.wktgeom;
  var callBackFun = param.callBackFunc;
  //var urlL = "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/buffer/wkt/";
  try {
    var settings = {
      url:
        appConfigInfo.connection.url +
        "/" +
        appConfigInfo.connection.project +
        "/apis/getBufferPolygonArea",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ buffer_meter: "1.00", route: wktGeom }),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      callBackFun(response.buffered_route);
    });
  } catch (err) {
    console.error("ERROR Trip.stop: ", err);
  }
};

tmpl.Map.getWMSMetaData = function (param) {
  try {
    var gmap = param.map;
    var callBack = param.callbackfunc;

    gmap.on("singleclick", function (evt) {
      var coordinate = evt.coordinate; //Picks up click coordinates

      var viewResolution = gmap.getView().getResolution(); //Picks up map current resolution
      var layersCollection = gmap.getLayers(); //Creates collection of layers object from layers that have been turned on.
      var Projection = gmap.getView().getProjection();
      var i;
      for (i = 1; i <= layersCollection.a.length - 1; i++) {
        //Loops through all layers excluding baselayer at index 0 and gets their URL
        var layerID = layersCollection.item(i);
        var url = layerID
          .getSource()
          .getGetFeatureInfoUrl(evt.coordinate, viewResolution, Projection, {
            INFO_FORMAT: "application/json",
          });
        console.log("url>>>", url);
        callBack(url);
      }
    });
  } catch (error) {
    console.error("Error at tmpl.Map.getWMSMetaData >>> ", error);
  }
};

tmpl.Map.getWMSMetaData1 = function (param) {
  var callBack = param.callbackfunc;

  var value;
  var a = document.getElementById("warning-icon");
  a.addEventListener("click", function (evnt) {
    // alert('Warning icon clicked!');
    console.log(a.getAttribute("value"));
    value = a.getAttribute("value");
    callBack(value);
  });
};

tmpl.Map.getWarningCallback = function (param) {
  var callBack = param.callbackfunc;
  var warningIcons = document.querySelectorAll(".warning-icon");

  function handleClick(e) {
    // Handle the click event here
    console.log("Icon clicked!", e);
    var clickedIcon = e.target;

    // Retrieving the 'data-id' attribute value
    var iconId = clickedIcon.getAttribute("data-extra-property");
    console.log("Icon clicked!", iconId);
    console.log("@@@@@$$$$$$$", iconId);
    callBack(iconId);
  }
  warningIcons.forEach(function (icon) {
    icon.addEventListener("click", handleClick);
  });
};

tmpl.Map.getCurrentZoomLevel = function (param) {
  var map = param.map;
  var callBack = param.callbackfunc;
  const zoomLevel = map.getView().getZoom();

  // Print the zoom level to the console
  console.log("Current Zoom Level:", zoomLevel);
  callBack(zoomLevel);
};

// ********************* Sprint 3 tasks *************************** //
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ fetch data from Vault URL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ //
var vaultData = [];
tmpl.Map.getToken = function (param) {
  var callbackFun = param.callbackFun;
  var rest_resp = null;
  localStorage.setItem("pentaBAccessToken", null);

  var settings = {
    url: appConfigInfo.pentaBGetTokenAPIService,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "password",
      client_id: appConfigInfo.pentaBClientId,
      client_secret: appConfigInfo.pentaBClientSecret,
      username: appConfigInfo.pentaBUserName,
      password: appConfigInfo.pentaBPassword,
    },
  };
  $.ajax(settings).done(function (response) {
    setTimeout(function () {
      if (callbackFun) {
        var toc = "Bearer " + response.access_token;
        console.info("PentaB Access Token :-:", toc);
        localStorage.setItem("pentaBAccessToken", toc);
        callbackFun(toc);
      } else {
        var toc = "Bearer " + response.access_token;
        pentaBAccessToken = toc;

        console.info("PentaB Access Token :-:", toc);
        localStorage.setItem("pentaBAccessToken", toc);
        return toc;
      }
    }, 0);
  });
};

///////////////////////////pooja///////////////////////////////////////////

// ********************* SDK_MAP_API (7)addWMSLayer********************* //
tmpl.Map.addWMSLayer = function (param) {
  var mapObj = param.map;
  var layerUrl = param.layerUrl;
  var layerName = param.layerName;
  var layerTitle = param.layerTitle;
  var opacity = param.opacity;
  var layerId = param.layerId;
  var layerType = param.layerType;

  if(!param.opacity) opacity = 1.0;
  
      var parts = layerName.split(':');
      var workSpace = parts[0]; 
      console.log("workSpace >>> ", workSpace); 


  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      layerUrl === null ||
      layerUrl === undefined ||
      layerUrl === "" ||
      layerUrl === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerUrl Object",
      });
    }

    // if (
    //   layerName === null ||
    //   layerName === undefined ||
    //   layerName === "" ||
    //   layerName === ""
    // ) {
    //   return (response = {
    //     status: "false",
    //     businesserrorcode: "TD_GISSDK_0x001",
    //     developererrorcode: "TD_GISSDK_0x001",
    //     message: "Invalid layerName Object",
    //   });
    // }

    if (
      layerTitle === null ||
      layerTitle === undefined ||
      layerTitle === "" ||
      layerTitle === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerTitle Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      //console.log("tmpl.Map.addWMSLayer   | ", error.message);
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x010",
        developererrorcode: "TD_GISSDK_0x010",
        message: error.message,
      });
    }
  }

  try {
    if (appConfigInfo.mapDimension == "2D") {
       if (appConfigInfo.mapLib == "ol7") {

        if (layerType == 'esri') {
          //Esri Custom Layer from ArcGIS Enterprise
          // Build ESRI base URL dynamically from vault + layer name

          
          if (layerUrl === undefined || layerUrl === null || layerUrl === "") {

            const baseUrl = appConfigInfo.esriCustomLayerBaseUrl;
            const esriServerType = appConfigInfo.esriServerType; //arcgisserver or mapserver
            layerUrl = baseUrl + "/" + layerName + "/" + esriServerType;

          }             

          console.log("Adding ESRI custom layer:", layerUrl);

          tmpl.Overlay.addESRICustomLayer({
            map: mapObj,
            url: layerUrl,
            layername: layerName,
            layerid: layerId,
            visible: param.visible !== undefined ? param.visible : true,
            identifier: param.identifier || layerName,
            imgurl: appConfigInfo.mapSDKURL + "2.png",
            bgcolor: param.bgcolor || "#FF0000",
            fillColor: param.fillColor || "rgba(255,0,0,0.2)",
            ffillColor: param.ffillColor || "#FFFFFF",
            fbgcolor: param.fbgcolor || "#000000"
          });

          return { status: true, message: "ESRI Custom Layer added successfully" };         

        } else {

          
          if (layerUrl === undefined || layerUrl === null || layerUrl === "") {

            layerUrl = appConfigInfo.geoserverHost + "/" + workSpace + "/wms";

          }

          var paramsObj = {
            LAYERS: layerName,
            TILED: true,
            VERSION: appConfigInfo.wmsVersion,
          };

          if (param.cql_filter) {
            paramsObj["CQL_FILTER"] = param.cql_filter;
          }
          if (param.viewparams) {
            paramsObj["VIEWPARAMS"] = param.viewparams;
          }


          // if (workSpace == 'IndoorFloors') {
            var WMSlayerObj = new ol.layer.Image({
              visible: true,
              opacity: opacity,
              source: new ol.source.ImageWMS({
                url: layerUrl,
                crossOrigin: "anonymous",
                params: paramsObj,
                serverType: "geoserver"
              }),
            });

          // } else {
          //   console.log("paramsObj -> ", paramsObj);
          //   var WMSlayerObj = new ol.layer.Tile({
          //     visible: true,
          //     opacity: opacity,
          //     source: new ol.source.TileWMS({
          //       url: layerUrl,
          //       crossOrigin: "anonymous",
          //       params: paramsObj,
          //       serverType: "geoserver",
          //     }),
          //   });
          // }

          mapObj.addLayer(WMSlayerObj);
          WMSlayerObj.setProperties({ title: layerTitle });

          return { status: true, message: "addWMSLayer executed successfully" };
        }
        }

      if (appConfigInfo.mapLib == "leaflet") {
        var wmsLayer = L.tileLayer
          .wms(appConfigInfo.mapserverURL, {
            layers: "tasmania_state_boundaries",
            format: "image/png",
            transparent: true,
            version: "1.1.1",
            attribution: "WMS Layer Attribution",
          })
          .addTo(mapObj);
      }
    } else {
      var imageryLayers = mapObj.imageryLayers;
      var geoWmsLayer = new Cesium.WebMapServiceImageryProvider({
        url: layerUrl,
        layers: layerName,
        parameters: {
          format: "image/png",
          transparent: true,
        },
      });
      geoWmsLayer.name = layerTitle;
      imageryLayers.addImageryProvider(geoWmsLayer);
    }

    return { status: true, message: "addWMSLayer executed successfully" };
  } catch (err) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x010",
      developererrorcode: "TD_GISSDK_0x010",
      message: err.message,
    });
  }
};


tmpl.Map.addWMSLayerPost = function (param) {
  const { map: mapObj, layerUrl, layerName, layerTitle, opacity = 1.0, cql_filter, viewparams } = param;

  if (!mapObj) {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map object",
    };
  }
  if (!layerUrl || layerUrl.trim() === "") {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x002",
      developererrorcode: "TD_GISSDK_0x002",
      message: "Invalid or missing layer URL",
    };
  }
  if (!layerName || layerName.trim() === "") {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x003",
      developererrorcode: "TD_GISSDK_0x003",
      message: "Invalid or missing layer name",
    };
  }
  if (!layerTitle || layerTitle.trim() === "") {
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x004",
      developererrorcode: "TD_GISSDK_0x004",
      message: "Invalid or missing layer title",
    };
  }

  try {
    if (appConfigInfo.mapDimension === "2D" && appConfigInfo.mapLib === "ol7") {
      const paramsObj = {
        SERVICE: "WMS",
        REQUEST: "GetMap",
        LAYERS: layerName,
        VERSION: appConfigInfo.wmsVersion || "1.1.1",
        FORMAT: "image/png",
        TRANSPARENT: true,
        TILED: true,
      };

      if (cql_filter) paramsObj["CQL_FILTER"] = cql_filter;
      if (viewparams) {
        paramsObj["VIEWPARAMS"] = viewparams;
      }

      console.log("WMS paramsObj:", paramsObj);

      const WMSlayerObj = new ol.layer.Tile({
        visible: true,
        opacity: opacity,
        source: new ol.source.TileWMS({
          url: layerUrl,
          crossOrigin: "anonymous",
          params: paramsObj,
          serverType: "geoserver",
          tileLoadFunction: function (tile, src) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", layerUrl, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.responseType = "blob";

            xhr.onload = function () {
              if (xhr.status === 200) {
                const blob = xhr.response;
                const objectUrl = URL.createObjectURL(blob);
                tile.getImage().src = objectUrl;
              } else {
                console.error("Failed to load WMS tile:", xhr.status, xhr.statusText, xhr.response);
              }
            };

            xhr.onerror = function () {
              console.error("POST request error for tile:", xhr.statusText);
            };

            const urlParams = new URLSearchParams(src.split("?")[1]);
            const dynamicParams = {
              ...paramsObj,
              CRS: urlParams.get("CRS") || mapObj.getView().getProjection().getCode(),
              BBOX: urlParams.get("BBOX"),
              WIDTH: urlParams.get("WIDTH"),
              HEIGHT: urlParams.get("HEIGHT"),
            };

            const params = new URLSearchParams(dynamicParams).toString();
            xhr.send(params);
          },
        }),
      });

      mapObj.addLayer(WMSlayerObj);
      WMSlayerObj.setProperties({ title: layerTitle });

      return { status: "true", message: "addWMSLayer executed successfully" };
    }

    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x005",
      developererrorcode: "TD_GISSDK_0x005",
      message: "Unsupported map dimension or library",
    };
  } catch (err) {
    console.error("Unexpected error in addWMSLayer:", err);
    return {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x010",
      developererrorcode: "TD_GISSDK_0x010",
      message: err.message || "An unexpected error occurred",
    };
  }
};

// ********************* SDK_MAP_API  markerWithName********************* //
tmpl.Overlay.markerWithName = function (param) {
  var mapObj = param.map;
  var point = param.point;
  var lon = point[0];
  var lat = point[1];
  var plName = param.name;
  var img_url = param.img_url;
  var height = param.height;
  var width = param.width;
  var offset = param.offset;
  var imgoffset = param.imgoffset;
  var id = param.id;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid Map Object",
      });
    }

    if (point === null || point === undefined || point === "" || point === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid point Object",
      });
    }

    if (lon === null || lon === undefined || lon === "" || lon === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid lon Object",
      });
    }

    if (lat === null || lat === undefined || lat === "" || lat === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid lat Object",
      });
    }

    if (
      img_url === null ||
      img_url === undefined ||
      img_url === "" ||
      img_url === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid img_url ",
      });
    }

    if (
      height === null ||
      height === undefined ||
      height === "" ||
      height === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid height value",
      });
    }

    if (width === null || width === undefined || width === "" || width === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid  width value",
      });
    }

    if (id === null || id === undefined || id === "" || id === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid  id",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  var overlayID = mapObj.getOverlayById(id);
  var overlayIDL = mapObj.getOverlayById(id + "label");
  if (overlayID) {
    mapObj.removeOverlay(overlayID);
    mapObj.removeOverlay(overlayIDL);
  }
  var container = document.createElement("div");
  container.className = "containerAPI ";
  var container1 = document.createElement("div");
  container1.className = "containerAPI ";
  var elem = document.createElement("img");
  elem.setAttribute("src", img_url);
  elem.setAttribute("height", height);
  elem.setAttribute("width", width);
  var labelDiv = document.createElement("div");
  labelDiv.className = "bottom_Marker";
  labelDiv.innerHTML = plName;
  container1.appendChild(elem);
  container.appendChild(labelDiv);
  var marker_pos = new ol.Overlay({
    id: id,
    element: container1,
    offset: imgoffset,
    positioning: "center-center",
  });
  var marker_pos1 = new ol.Overlay({
    id: id + "label",
    element: container,
    offset: offset,
    positioning: "center-center",
  });
  mapObj.addOverlay(marker_pos);
  mapObj.addOverlay(marker_pos1);
  if (
    appConfigInfo.mapData == "google" ||
    appConfigInfo.mapData == "hereMaps" ||
    appConfigInfo.mapData == "trinity" ||
    appConfigInfo.mapData == "mmi" ||
    appConfigInfo.mapData == "sgl"

  ) {
    marker_pos.setPosition(
      ol.proj.transform(
        [parseFloat(lon), parseFloat(lat)],
        "EPSG:4326",
        "EPSG:3857"
      )
    );
    marker_pos1.setPosition(
      ol.proj.transform(
        [parseFloat(lon), parseFloat(lat)],
        "EPSG:4326",
        "EPSG:3857"
      )
    );
  } else {
    marker_pos.setPosition([lon, lat]);
    marker_pos1.setPosition([lon, lat]);
  }
  marker_pos.setProperties({ olname: "searchOverlay" });
  marker_pos1.setProperties({ olname: "searchOverlay" });

  return {
    status: true,
    message: "OverlaymarkerWithName executed successfully",
  };
};

// **** This function takes latitude,longitude. It will return the nearest places of given location. **** //
tmpl.Search.getNearestPlace = function (params) {
  var mapObj = params.map;
  var point = params.point;
  var callbackFunc = params.callbackFunc;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (point === null || point === undefined || point === "" || point === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid point value",
      });
    }

    if (
      callbackFunc === null ||
      callbackFunc === undefined ||
      callbackFunc === "" ||
      callbackFunc === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callbackFunc",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  if (appConfigInfo.mapData == "google") {
    var resultStatus;
    var x = parseFloat(point[0]);
    var y = parseFloat(point[1]);
    var coordinates = { lat: y, lng: x };
    var result = {};

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        latLng: coordinates,
      },
      function (results, status) {
        //console.log("placee",results);
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            //console.log(results);
            var address = results[0].address_components[1].long_name;
            result = { placename: address };
            resultStatus = true;
          }
        }
        callbackFunc(result);
      }
    );
  } else {
    var rsltAry = [];
    var urlL =
      "http:" +
      appConfigInfo.connection.url +
      "/" +
      appConfigInfo.connection.project +
      "/nearest_place/" +
      point[0] +
      "/" +
      point[1] +
      "/1/3000";

    $.ajax({
      url: urlL,
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          var record = { placename: data[i].place };

          rsltAry.push(record);
        }

        callbackFunc(rsltAry);
      },
      error: function () {
        console.log("there was an error!");
      },
    });
  }

  return { status: true, message: "getNearestPlace executed successfully" };
};

tmpl.Route.mergeLine = function (param) {
  // var map = param.map;
  var wktGeom = param.lines;
  var callBackFun = param.callBackFun;
  try {
    if (
      wktGeom === null ||
      wktGeom === undefined ||
      wktGeom === "" ||
      wktGeom === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      callBackFun === null ||
      callBackFun === undefined ||
      callBackFun === "" ||
      callBackFun === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callBackFun Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  var urlL =
    "http:" +
    appConfigInfo.connection.url +
    "/" +
    appConfigInfo.connection.project +
    "/apis/makeLine";
  try {
    var settings = {
      url: urlL,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        lines: wktGeom,
      }),
    };

    $.ajax(settings).done(function (response) {
      //console.log(response);
      callBackFun(response);
    });
  } catch (err) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: err.message,
    });
  }

  return (response = {
    status: true,
    message: "tmpl.Route.mergeLine API Enabled",
  });
};

// ********************* SDK_MAP_API buffer********************* //
// tmpl.Route.buffer = function (param) {
// 	//var map = param.map;
// 	var wktGeom = param.wktgeom;
// 	var callBackFun = param.callBackFunc;

// 	try {

// 		if (wktGeom === null || wktGeom === undefined || wktGeom === '' || wktGeom === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid wktGeom Object' };
// 		}

// 		if (callBackFun === null || callBackFun === undefined || callBackFun === '' || callBackFun === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callBackFun Object' };
// 		}

// 	} catch (error) {

// 		if (error instanceof Error) {
// 			console.log("tmpl.Route.buffer  | ", error.message);
// 		}
// 	}

// 	var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/buffer/wkt/";
// 	try {
// 		$.ajax({
// 			type: 'POST',
// 			url: urlL,
// 			data: {
// 				data: wktGeom,
// 				radius: 0.0005//(param.radius)/100000//0.0002
// 			},
// 			success: function (data) {
// 				callBackFun(data[0].geometry);
// 				// console.log("buffer data ==========>",data)
// 			},
// 			error: function () {
// 				console.log("API Server Down ! there was an error!");
// 			}
// 		});
// 	}
// 	catch (err) {
// 		console.error("ERROR Trip.stop: ", err);
// 	}
// }

tmpl.Route.buffer = function (param) {
  //var map = param.map;
  var wktGeom = param.wktgeom;
  var callBackFun = param.callBackFun;

  try {
    if (
      wktGeom === null ||
      wktGeom === undefined ||
      wktGeom === "" ||
      wktGeom === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid wktGeom Object",
      });
    }

    if (
      callBackFun === null ||
      callBackFun === undefined ||
      callBackFun === "" ||
      callBackFun === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callBackFun Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  var urlL;
  try {
    // $.ajax({
    // 	type: 'POST',
    // 	url: urlL,
    // 	data: {
    // 		data: wktGeom,
    // 		radius: 0.0005//(param.radius)/100000//0.0002
    // 	},
    // 	success: function (data) {
    // 		callBackFun(data[0].geometry);
    // 		// console.log("buffer data ==========>",data)
    // 	},
    // 	error: function () {
    // 		console.log("API Server Down ! there was an error!");
    // 	}
    // });
    var settings = {
      url:
        "http:" +
        appConfigInfo.connection.url +
        "/" +
        appConfigInfo.connection.project +
        "/apis/getBufferPolygonArea",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        buffer_meter: "1.0",
        route: wktGeom,
      }),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      callBackFun(response);
    });
  } catch (err) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: err.message,
    });
  }

  return (response = {
    status: true,
    message: "tmpl.Route.buffer API Enabled",
  });
};

// ********************* SDK_MAP_API addGeometry********************* //
tmpl.Overlay.addGeometry = function (param) {
  var mapObj = param.map;
  var lyrName = param.layer;
  var property = param.properties;
  var getHoverLabel = param.getHoverLabel;
  var geometryVal = param.geometry;
  var format = new ol.format.WKT();
  var feature;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      lyrName === null ||
      lyrName === undefined ||
      lyrName === "" ||
      lyrName === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid lyrName",
      });
    }

    if (
      property === null ||
      property === undefined ||
      property === "" ||
      property === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid property",
      });
    }

    if (
      geometryVal === null ||
      geometryVal === undefined ||
      geometryVal === "" ||
      geometryVal === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid geometryVal",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  if (
    appConfigInfo.mapData == "google" ||
    appConfigInfo.mapData == "hereMaps" ||
    appConfigInfo.mapData == "trinity" ||
    appConfigInfo.mapData == "mmi" ||
    appConfigInfo.mapData == "sgl"

  ) {
    feature = format.readFeature(geometryVal, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  } else {
    var feature = format.readFeature(geometryVal, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:4326",
    });
  }
  if (getHoverLabel == true) {
    feature.setStyle(
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new ol.style.Stroke({
          color: "#1b465a",
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: "#1b465a",
          }),
        }),
      })
    );
  } else {
    feature.setStyle(
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new ol.style.Stroke({
          color: "#1b465a",
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: "#1b465a",
          }),
        }),
        text: new ol.style.Text({
          font: "Bold" + " " + "12px" + " " + "Verdana",
          textAlign: "center",
          /*textBaseline: 'bottom',
        offsetX : parseInt(0, 10),
        offsetY : parseInt(0, 10),*/
          text: property.label,
          fill: new ol.style.Fill({
            color: property.label_color,
            width: 20,
          }),
          stroke: new ol.style.Stroke({
            color: property.label_bgcolor,
            width: 6,
          }),
        }),
      })
    );
  }
  feature.setProperties(property);
  feature.set("layer_name", lyrName);
  var source = new ol.source.Vector({
    features: [feature],
  });

  // if(getHoverLabel == true){

  // 		var ta_tooltip = document.createElement('tooltip');
  // ta_tooltip.id = 'trip-tooltip';
  // ta_tooltip.className = 'ol-trip-tooltip';
  // var overlay_mouseOver_label = new ol.Overlay({
  //     element: ta_tooltip,
  //     offset: [10, 0],
  //     positioning: 'bottom-left'
  // });
  // mapObj.addOverlay(overlay_mouseOver_label);
  // 	mapObj.on('pointermove', function(evt){

  // 		var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function(feature/*, layer*/) {
  // 		//if(layer){
  // 			//console.log("FT >>",feature.get('layer_name'));
  // 			if(feature.get('layer_name') == lyrName){
  // 				return feature;
  // 			}
  // 		//}
  // 		});
  // 		ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
  // 		if(feature_mouseOver) {
  // 			overlay_mouseOver_label.setPosition(evt.coordinate);
  // 			ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
  // 		}
  // 	});
  // }
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  var isLayerPresent11 = false;
  var existing;
  for (i = 0; i < length; i++) {
    var existingLayer = Layers.item(i);
    if (existingLayer) {
      if (existingLayer.get("title") === lyrName) {
        existing = existingLayer;
        existingLayer
          .getSource()
          .getFeatures()
          .forEach(function (fea) {
            if (fea.getProperties()["id"] == property.id) {
              existingLayer.getSource().removeFeature(fea);
            }
          });
        isLayerPresent11 = true;
        //existingLayer.getSource().clear();
        existingLayer.getSource().addFeature(feature);
      }
    }
  }
  if (existing == undefined) {
    for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
      if (tmpl_setMap_layer_global[i].title == lyrName) {
        tmpl_setMap_layer_global[i].layer
          .getSource()
          .getFeatures()
          .forEach(function (fea) {
            if (fea.getProperties()["id"] == property.id) {
              tmpl_setMap_layer_global[i].layer.getSource().removeFeature(fea);
            }
          });
        isLayerPresent11 = true;
        tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
      }
    }
  }
  if (isLayerPresent11 == false) {
    var newLayer = new ol.layer.Vector({
      title: lyrName,
      visible: true,
      source: source,
    });
    tmpl_setMap_layer_global.push({
      layer: newLayer,
      title: lyrName,
      visibility: true,
      map: mapObj,
    });
    isLayerPresent11 == true;
    //mapObj.addLayer(newLayer);
    newLayer.setMap(mapObj);
    //		mapObj.addControl(new ol.control.LayerSwitcher());
  }

  return (response = {
    status: true,
    message: "tmpl.Overlay.addGeometry API Enabled",
  });
};

// ********************* SDK_MAP_API draw ********************* //
tmpl.Draw.draw = function (param) {
  var features = new ol.Collection();
  var callbackFunc = param.callbackFunc;
  var mapObj = param.map;
  var btnType = param.type;
  var img_url = param.img_url;
  var drawRestriction = param.drawRestriction;
  var modify1 = param.modify1;
  var draw = param.draw;
  var select = param.select;
  var drawm = param.drawm;
  var selectE = param.selectE;
  // var addInteraction = param.addInteraction;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    } else {
      console.log("tmpl.Draw.draw : A Valid Map Object.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log("tmpl.Draw.draw  | ", error.message);
    }
  }

  try {
    var img_path;
    if (img_url == undefined) {
      img_path = appConfigInfo.mapSDKURL+"2.png";
    } else {
      img_path = img_url;
    }
    if (appConfigInfo.mapDimension == "2D") {
      console.log("img_path: ", img_path);
      mapObj.removeInteraction(modify1);
      mapObj.removeInteraction(draw);
      mapObj.removeInteraction(select);
      mapObj.removeInteraction(drawm);

      mapObj.removeInteraction(selectE);

      var source = new ol.source.Vector({ features: features });

      var noLayer = false;
      var existingLayer;
      var Layers = mapObj.getLayers();
      var length = Layers.getLength();
      for (i = 0; i < length; i++) {
        var tempLayer = Layers.item(i);
        if (tempLayer.get("lname") == "drawvector") {
          noLayer = true;
          existingLayer = tempLayer;
          // existingLayer.getSource().clear();
        }
      }

      if (!noLayer) {
        drawVector = new ol.layer.Vector({
          source: source /*new ol.source.Vector({
					features : features
				})*/,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: "rgba(255, 255, 255, 0.3)",
            }),
            stroke: new ol.style.Stroke({
              color: "rgba(0, 102, 255, 1)",
              width: 2,
            }),
            image: new ol.style.Circle({
              radius: 0.1,
              fill: new ol.style.Fill({
                color: "rgba(0,0,0,0)",
              }),
            }),
          }),
        });
        drawVector.setProperties({ lname: "drawvector" });
        drawVector.setProperties({ myId: "myUnique" });
        mapObj.addLayer(drawVector);
        existingLayer = drawVector;
      }
      // addInteraction(btnType, mapObj, existingLayer, callbackFunc, drawRestriction);

      //}
    } else {
      var drawingMode = null;
      var camera = mapObj.camera;
      var ellipsoid = mapObj.scene.globe.ellipsoid;
	  var viewer = mapObj;
	  if (glbHandler == null) {
        glbHandler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);
      }

      if (btnType == "Point") {
        const mapDivID = mapObj.container.id;
        const mapDiv = document.getElementById(mapDivID);
        const ellipsoid = mapObj.scene.globe.ellipsoid;
        const camera = mapObj.camera;

        function changePointer() {
          mapDiv.style.cursor = "crosshair";
        }
        
        function resetPointer() {
          mapDiv.style.cursor = "auto";
        }
		changePointer()
        // mapObj.canvas.addEventListener("mousemove", changePointer, false);

        glbHandler.setInputAction(function (click) {
          position = mapObj.scene.pickPosition(click.position);
          
          if (Cesium.defined(position)) {
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            const longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude);
            const latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
            const latlng = [longitudeDegrees, latitudeDegrees];

            // Remove the existing marker if any
            mapObj.entities.removeById("Draw Tool");

            // Add a new marker at the clicked position
            const point = mapObj.entities.add({
              id: "Draw Tool",
              name: "Draw Tool",
              position: position,
              billboard: {
                image: img_path,
                width: 32,
                height: 32,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                scaleByDistance: new Cesium.NearFarScalar(150, 1.0, 1.5e7, 0.5),
              },
            });

            const wkt = `POINT(${longitudeDegrees} ${latitudeDegrees})`;

            // Call the callback function with the lat/lon, feature, WKT, and button type
            callbackFunc(latlng, point, wkt, btnType);

            // Reset cursor and stop further clicks
            resetPointer();
            glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } else if (btnType == "LineString") {
        function createPoint(worldPosition) {
          var point = mapObj.entities.add({
            name: "Draw Point",
            position: worldPosition,
            point: {
              color: Cesium.Color.BLACK,
              pixelSize: 5,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
          });
          return point;
        }
        drawingMode = "line";
        function drawShape(positionData) {
          // console.log("positionData: ",positionData);
          var shape;
          tmpl.Layer.remove({ map: mapObj, layer: "Draw Point" }); // For removing previously drawn Line String
          if (drawingMode === "line") {
            shape = mapObj.entities.add({
              name: "Draw Tool",
              polyline: {
                positions: positionData,
                clampToGround: true,
                width: 3,
                material: Cesium.Color.RED.withAlpha(0.9),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
              },
            });
          }
          // console.log(shape.polyline.positions);
          return shape;
        }

        var activeShapePoints = [];
        var activeShape;
        var floatingPoint;
        // var glbHandler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);
        var mapDivID = mapObj.container.id;
        var mapDiv = document.getElementById(mapDivID);

        function changePointer(movement) {
          mapDiv.style.cursor = "crosshair";
        }
        // mapObj.canvas.addEventListener("mousemove", changePointer, false);

		changePointer();
        glbHandler.setInputAction(function (event) {
          if (!Cesium.Entity.supportsPolylinesOnTerrain(mapObj.scene)) {
            console.log("This browser does not support polylines on terrain.");
            return;
          }
          // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
          // we get the correct point when mousing over terrain.
          // var earthPosition = mapObj.scene.pickPosition(event.position);
          var earthPosition = mapObj.scene.pickPosition(event.position);
          // `earthPosition` will be undefined if our mouse is not over the globe.
          if (Cesium.defined(earthPosition)) {
            if (activeShapePoints.length === 0) {
              floatingPoint = createPoint(earthPosition);
              activeShapePoints.push(earthPosition);
              var dynamicPositions = new Cesium.CallbackProperty(function () {
                return activeShapePoints;
              }, false);
              activeShape = drawShape(dynamicPositions);
            }
            activeShapePoints.push(earthPosition);
            // console.log("activeShapePoints==>",activeShapePoints);
            createPoint(earthPosition);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        glbHandler.setInputAction(function (event) {
          if (Cesium.defined(floatingPoint)) {
            // var newPosition = mapObj.scene.pickPosition(event.endPosition);
            var newPosition = mapObj.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
              floatingPoint.position.setValue(newPosition);
              activeShapePoints.pop();
              activeShapePoints.push(newPosition);
            }
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // Redraw the shape so it's not dynamic and remove the dynamic shape.
        function terminateShape() {
          mapDiv.style.cursor = "default";
          activeShapePoints.pop();
          drawShape(activeShapePoints);
          mapObj.entities.remove(floatingPoint);
          mapObj.entities.remove(activeShape);
          floatingPoint = undefined;
          activeShape = undefined;
          // activeShapePoints = [];
        //   mapObj.canvas.removeEventListener("mousemove", changePointer, false);
          glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          glbHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
          );
          glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

          var cartographic = null;
          var arr = [];
          var lonlat = {};
          var j = 0;
          while (j < activeShapePoints.length) {
            cartographic = null;
            cartographic = ellipsoid.cartesianToCartographic(
              activeShapePoints[j]
            );
            // console.log(cartographic);
            var longitudeDegrees = Cesium.Math.toDegrees(
              cartographic.longitude
            );
            var latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude);
            lonlat.lon = longitudeDegrees;
            lonlat.lat = latitudeDegrees;
            arr.push(lonlat);
            lonlat = {};
            // console.log(arr);
            j++;
          }

          var wktGeom = "LINESTRING(";
          var k = 0;
          while (k < arr.length) {
            if (k == arr.length - 1) {
              wktGeom += arr[k].lon + " " + arr[k].lat;
            } else {
              wktGeom += arr[k].lon + " " + arr[k].lat + ",";
            }
            k++;
          }
          wktGeom += ")";
          console.log(wktGeom);
          var startPoint = [arr[0].lon, arr[0].lat];
          activeShapePoints = [];
          var feat = "";
          callbackFunc(startPoint, feat, wktGeom, btnType);
        }
        glbHandler.setInputAction(function (event) {
          terminateShape();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      } else if (btnType == "Polygon") {
		var drawingMode = "polygon";
var activeShapePoints = [];
var activeShape;
var floatingPoint;
var ellipsoid = mapObj.scene.globe.ellipsoid;
var mapDiv = document.getElementById(mapObj.container.id);

// Change cursor during drawing
function changePointer() {
  mapDiv.style.cursor = "crosshair";
}
// mapObj.canvas.addEventListener("mousemove", changePointer, false);

changePointer();
// Create a point entity at a position
function createPoint(worldPosition) {
  return mapObj.entities.add({
    position: worldPosition,
    name: "Draw Tool",
    point: {
      color: Cesium.Color.BLACK,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
}

// Draw polygon entity with proper PolygonHierarchy
function drawShape(hierarchy) {
  // Remove previous temporary shape if any
  mapObj.entities.remove(activeShape);

  if (drawingMode === "polygon") {
    return mapObj.entities.add({
      name: "Draw Tool",
      polygon: {
        hierarchy: hierarchy,
        material: Cesium.Color.VIOLET.withAlpha(0.5),
      },
    });
  }
}

// ScreenSpaceEventHandler for drawing
// var glbHandler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);

glbHandler.setInputAction(function (event) {
  // Get accurate terrain position on click
  var earthPosition = mapObj.scene.pickPosition(event.position);
  if (!Cesium.defined(earthPosition)) {
    return;
  }

  if (activeShapePoints.length === 0) {
    floatingPoint = createPoint(earthPosition);
    activeShapePoints.push(earthPosition);

    var dynamicHierarchy = new Cesium.CallbackProperty(function () {
      if (activeShapePoints.length < 3) {
        // Return empty polygon if less than 3 points
        return new Cesium.PolygonHierarchy([]);
      }
      return new Cesium.PolygonHierarchy(activeShapePoints);
    }, false);

    activeShape = drawShape(dynamicHierarchy);
  }

  activeShapePoints.push(earthPosition);
  createPoint(earthPosition);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

glbHandler.setInputAction(function (event) {
  if (Cesium.defined(floatingPoint)) {
    var newPosition = mapObj.scene.pickPosition(event.endPosition);
    if (Cesium.defined(newPosition)) {
      floatingPoint.position.setValue(newPosition);
      activeShapePoints.pop();
      activeShapePoints.push(newPosition);
    }
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

function terminateShape() {
  mapDiv.style.cursor = "default";

  if (activeShapePoints.length < 3) {
    // Clear and exit if not enough points
    cleanUp();
    return;
  }

  // Remove the floating and dynamic shapes
  mapObj.entities.remove(floatingPoint);
  mapObj.entities.remove(activeShape);

  // Draw final polygon with static positions
  var finalHierarchy = new Cesium.PolygonHierarchy(activeShapePoints);
  activeShape = drawShape(finalHierarchy);

  // Convert points to lon-lat and build WKT polygon string
  var arr = activeShapePoints.map(function (cartesian) {
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    return {
      lon: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
    };
  });

  var wktGeom = "POLYGON((";
  for (var k = 0; k < arr.length; k++) {
    wktGeom += arr[k].lon + " " + arr[k].lat + (k === arr.length - 1 ? "" : ",");
  }
  // Close polygon by repeating the first point
  wktGeom += "," + arr[0].lon + " " + arr[0].lat + "))";

  // Your callback, replace or extend as needed
  callbackFunc([arr[0].lon, arr[0].lat], "", wktGeom, drawingMode);

  cleanUp();
}

function cleanUp() {
//   mapObj.canvas.removeEventListener("mousemove", changePointer, false);
  glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  glbHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}

// Finish shape on double click
glbHandler.setInputAction(terminateShape, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	}
	else if(btnType == "Circle")
	{
		var drawingMode = "circle";
		var centerPoint;
		var activeCircle;
		var activeShapePoints = [];
		var ellipsoid = mapObj.scene.globe.ellipsoid;
		var mapDiv = document.getElementById(mapObj.container.id);

		function changePointer() {
		mapDiv.style.cursor = "crosshair";
		}
		mapObj.canvas.addEventListener("mousemove", changePointer, false);

		function createPoint(worldPosition) {
		return mapObj.entities.add({
			position: worldPosition,
			// name: "Center Point",
			name: "Draw Tool",
			point: {
			color: Cesium.Color.BLACK,
			pixelSize: 5,
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			},
		});
		}

		// Helper to generate circle polygon points (Cartesian3 array)
		function computeCirclePositions(centerCartesian, radiusMeters, granularityDegrees = 10) {
		const positions = [];
		const centerCartographic = ellipsoid.cartesianToCartographic(centerCartesian);
		const centerLatitude = centerCartographic.latitude;
		const centerLongitude = centerCartographic.longitude;

		const granularity = Cesium.Math.toRadians(granularityDegrees);
		for (let angle = 0; angle < 2 * Math.PI; angle += granularity) {
			// destination point on circle perimeter using geodesic approx
			const destLongitude = centerLongitude + (radiusMeters / ellipsoid.maximumRadius) * Math.cos(angle) / Math.cos(centerLatitude);
			const destLatitude = centerLatitude + (radiusMeters / ellipsoid.maximumRadius) * Math.sin(angle);
			const destCartesian = Cesium.Cartesian3.fromRadians(destLongitude, destLatitude);
			positions.push(destCartesian);
		}
		// Close polygon by pushing first point again
		positions.push(positions[0]);
		return positions;
		}

		function drawPolygon(positions) {
		if (activeCircle) {
			mapObj.entities.remove(activeCircle);
		}
		activeCircle = mapObj.entities.add({
			name: "Draw Tool",
			polygon: {
			hierarchy: new Cesium.PolygonHierarchy(positions),
			material: Cesium.Color.VIOLET.withAlpha(0.5),
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
			},
		});
		}

		var handler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);

		handler.setInputAction(function (event) {
		var earthPosition = mapObj.scene.pickPosition(event.position);
		if (!Cesium.defined(earthPosition)) return;

		if (!centerPoint) {
			centerPoint = createPoint(earthPosition);
		}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		handler.setInputAction(function (event) {
		if (!centerPoint) return;

		var newPosition = mapObj.scene.pickPosition(event.endPosition);
		if (!Cesium.defined(newPosition)) return;

		var radius = Cesium.Cartesian3.distance(centerPoint.position.getValue(), newPosition);
		activeShapePoints = computeCirclePositions(centerPoint.position.getValue(), radius);
		drawPolygon(activeShapePoints);
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		handler.setInputAction(function () {
		if (!centerPoint || !activeCircle) return;

		// Convert polygon points to lon/lat and build WKT polygon string
		var arr = activeShapePoints.map(function (cartesian) {
			var cartographic = ellipsoid.cartesianToCartographic(cartesian);
			return {
			lon: Cesium.Math.toDegrees(cartographic.longitude),
			lat: Cesium.Math.toDegrees(cartographic.latitude),
			};
		});

		var wktGeom = "POLYGON((";
		for (var i = 0; i < arr.length; i++) {
			wktGeom += arr[i].lon + " " + arr[i].lat + (i === arr.length - 1 ? "" : ",");
		}
		wktGeom += "))";

		callbackFunc(arr[0], "", wktGeom, drawingMode);

		// Cleanup
		mapDiv.style.cursor = "default";
		// mapObj.entities.remove(centerPoint);
		// mapObj.entities.remove(activeCircle);
		centerPoint = undefined;
		activeCircle = undefined;
		activeShapePoints = [];

		mapObj.canvas.removeEventListener("mousemove", changePointer, false);
		handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	}
    }

	return { status: true, message: 'Drawdraw executed successfully' }
  } catch (err) {
    console.error("ERROR Draw.draw: ", err);
  }
};

function addInteraction(btnType, mapObj, drawLayer, callbackFunc, drawRestriction) {
	var callbackFunc = callbackFunc;
	drawLayer.getSource().clear();
	var value = btnType;
	var subType = "";
	if (value !== 'None') {
		var geometryFunction, maxPoints;
		if (value === 'Square') {
			value = 'Circle';
			geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
		}
		else if (value === 'Box') {
			value = 'LineString';
			subType = "Box";
			maxPoints = 2;
			geometryFunction = function (coordinates, geometry) {
				if (!geometry) {
					geometry = new ol.geom.Polygon(null);
				}
				var start = coordinates[0];
				var end = coordinates[1];
				geometry.setCoordinates([
					[start, [start[0], end[1]], end, [end[0], start[1]], start]
				]);
				return geometry;
			};
		}
		else if (value === 'Circle') {
			value = 'Circle';
			geometryFunction = ol.interaction.Draw.createRegularPolygon(100);
		}
		draw = new ol.interaction.Draw({
			source: drawLayer.getSource(),
			type: /** @type {ol.geom.GeometryType} */ (value),
			geometryFunction: geometryFunction,
			maxPoints: maxPoints
		});
		mapObj.addInteraction(draw);
		draw.on('drawend', function (event) {
			var feature = event.feature;
			var geometryVal = feature.getGeometry();
			var lonlat;
			var coord, wktGeom;
			var format = new ol.format.WKT();
			if (value === 'Point') {
				lonlat = feature.getGeometry().getCoordinates();
			}
			else if (value === 'LineString') {
				if (subType == "Box") {
					lonlat = feature.getGeometry().getInteriorPoint().getCoordinates();
				} else {
					lonlat = feature.getGeometry().getFirstCoordinate();
				}
			}
			else if (value === 'Polygon' || value === 'Circle' || value === 'Box') {
				lonlat = feature.getGeometry().getInteriorPoint().getCoordinates();
			}
			/* else if(value==='Circle')
				{
				  lonlat =feature.getGeometry().getCenter();
 
				  alert("Circle "+feature.getGeometry().getType()+lonlat);
				}*/
			if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' || appConfigInfo.mapData == 'trinity') {
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coord = lonlat;//feature.getGeometry().getCoordinates();
				wktGeom = format.writeGeometry(feature.getGeometry());
			}

			event.stopPropagation();
			mapObj.removeInteraction(draw);
			callbackFunc(coord, feature, wktGeom, value);

		});
	}


}


tmpl.Draw.draw = function (param) {
  var features = new ol.Collection();
  var callbackFunc = param.callbackFunc;
  var mapObj = param.map;
  var btnType = param.type;
  var img_url = param.img_url;
  var drawRestriction = param.drawRestriction;

  // try {
  // 	if (mapObj === null || mapObj === undefined) {

  // 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

  // 	}

  // 	if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

  // 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
  // 	}

  // 	if (type === null || type === undefined || type === '' || type === "") {

  // 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid type' };
  // 	}

  // } catch (error) {

  // 	if (error instanceof Error) {
  // 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
  // 	}
  // }

  var img_path;
  if (img_url == undefined) {
    img_path = "api_img/icon.png";
  } else {
    img_path = img_url;
  }
  mapObj.removeInteraction(modify1);
  mapObj.removeInteraction(draw);
  mapObj.removeInteraction(select);
  mapObj.removeInteraction(drawm);

  mapObj.removeInteraction(selectE);

  var source = new ol.source.Vector({ features: features });

  var noLayer = false;
  var existingLayer;
  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  for (i = 0; i < length; i++) {
    var tempLayer = Layers.item(i);
    if (tempLayer.get("lname") == "drawvector") {
      noLayer = true;
      existingLayer = tempLayer;
      // existingLayer.getSource().clear();
    }
  }

  if (!noLayer) {
    drawVector = new ol.layer.Vector({
      source: source /*new ol.source.Vector({
				features : features
			})*/,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.3)",
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(0, 102, 255, 1)",
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 0.1,
          fill: new ol.style.Fill({
            color: "rgba(0,0,0,0)",
          }),
        }),
      }),
    });
    drawVector.setProperties({ lname: "drawvector" });
    drawVector.setProperties({ myId: "myUnique" });
    mapObj.addLayer(drawVector);
    existingLayer = drawVector;
  }
  addInteraction(btnType, mapObj, existingLayer, callbackFunc, drawRestriction);
  //}
};

// ********************* SDK_MAP_API point********************* //
tmpl.Draw.point = function (param) {
  var callbackFunc = param.callbackFunc;
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      callbackFunc === null ||
      callbackFunc === undefined ||
      callbackFunc === "" ||
      callbackFunc === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callbackFunc",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  try {
    var drawButton = document.createElement("button");
    drawButton.title = "Draw Points";
    drawButton.className = "ol-map-pointbtn";

    if (appConfigInfo.mapDimension == "2D") {
      drawButton.addEventListener("click", function () {
        tmpl.Draw.draw({
          type: "Point",
          map: mapObj,
          callbackFunc: callbackFunc,
        });
      });
      mapObj.addControl(
        new ol.control.Control({
          element: drawButton,
        })
      );
    } else {
      drawButton.addEventListener("click", function () {
        tmpl.Draw.draw({
          type: "Point",
          map: mapObj,
          callbackFunc: callbackFunc,
        });
      });
      document.body.appendChild(drawButton);
    }
  } catch (err) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: error.message,
    });
  }

  return (response = { status: true, message: "Draw.point  API Enabled" });
};

// // ********************* SDK_MAP_API line********************* //
// tmpl.Draw.line = function (param) {
// 	var callbackFunc = param.callbackFunc;
// 	var mapObj = param.map;

// 	try {
// 		if (mapObj === null || mapObj === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

// 		}

// 		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
// 		}

// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };

// 		}
// 	}

// 	try {
// 		var drawButton = document.createElement('button');
// 		drawButton.title = 'Draw Lines';
// 		drawButton.className = 'ol-map-linebtn';

// 		if (appConfigInfo.mapDimension == "2D") {
// 			drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'LineString', map: mapObj, callbackFunc: callbackFunc }) });
// 			mapObj.addControl(new ol.control.Control({
// 				element: drawButton
// 			}));
// 		}
// 		else {
// 			drawButton.addEventListener('click', function () { tmpl.Draw.draw({ type: 'LineString', map: mapObj, callbackFunc: callbackFunc }) });
// 			document.body.appendChild(drawButton);
// 		}
// 	}
// 	catch (err) {
// 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
// 	}
// 	return response = { status: true, message: 'Draw.Line  API Enabled' };
// }

// ********************* SDK_MAP_API line********************* //
/*tmpl.Draw.clear = function (param) {
  var mapObj = param.map;
  try {
    if (mapObj === null || mapObj === undefined) {

      return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

    }


  } catch (error) {
    if (error instanceof Error) {
      console.log("tmpl.Draw.clear  | ", error.message);
    }
  }

  try {
    if (appConfigInfo.mapDimension == "2D") {
      var Layers = mapObj.getLayers();
      var length = Layers.getLength();
      for (var i = 0; i < length; i++) {
        var existingLayer = Layers.item(i);
        if (existingLayer) {
          if (existingLayer.get('lname') == 'drawvector') {
            existingLayer.getSource().clear();
            mapObj.removeLayer(existingLayer);
          }
        }
      }
    }
    else {
      tmpl.Layer.remove({ map: mapObj, layer: "Draw Tool" });
    }
  }
  catch (err) {
    console.error("ERROR Draw.clear: ", err);
  }
}*/

function captureScreenshot() {
  html2canvas(document.querySelector("#mapDiv1"), { useCORS: true }).then(canvas => {
    document.body.appendChild(canvas);
    canvas.toBlob(function(blob) {
      saveAs(blob, "screenshot.jpeg");
    });
  });
}
// ********************* SDK_MAP_API circle********************* //
tmpl.Draw.circle = function (param) {
  var callbackFunc = param.callbackFunc;
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      callbackFunc === null ||
      callbackFunc === undefined ||
      callbackFunc === "" ||
      callbackFunc === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callbackFunc",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  try {
    var drawButton = document.createElement("button");
    drawButton.title = "Draw Circle";
    drawButton.className = "ol-map-Circlebtn";

    if (appConfigInfo.mapDimension == "2D") {
      drawButton.addEventListener("click", function () {
        tmpl.Draw.draw({
          type: "Circle",
          map: mapObj,
          callbackFunc: callbackFunc,
        });
      });
      var drawControl = new ol.control.Control({
        element: drawButton,
      });
      mapObj.addControl(drawControl);
    } else {
    }
  } catch (err) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: error.message,
    });
  }

  return (response = { status: true, message: "Draw.circle API Enabled" });
};

tmpl.Create.point = function (param) {
  var mapObj = param.map;
  var jsonobj = param.features;
  var layerName = param.layer;
  var strokeColor = param.strokeColor;
  var fillColor = param.fillColor;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (layerName === null || layerName === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layer",
      });
    }

    if (
      jsonobj.length == 0 ||
      jsonobj === undefined ||
      jsonobj === "" ||
      jsonobj === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid features value",
      });
    }

    var getdata = jsonobj;

    var featureDataAry = [];
    var style;
    if (strokeColor != null && fillColor != null) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: fillColor,
          }),
          stroke: new ol.style.Stroke({
            width: 1,
            color: strokeColor,
          }),
        }),
      });
    } else {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: "rgba(124,252,0,0.2)",
          }),
          stroke: new ol.style.Stroke({
            width: 1,
            color: "rgb(124,252,0)",
          }),
        }),
      });
    }
    for (var i = 0, length = getdata.length; i < length; i++) {
      if (
        getdata[i].longitude === null ||
        getdata[i].longitude === undefined ||
        getdata[i].longitude === "" ||
        getdata[i].longitude === "" ||
        !/^\d+(\.\d+)?$/.test(getdata[i].longitude)
      ) {
        return (response = {
          status: "false",
          businesserrorcode: "TD_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          message: "Invalid longitude value in features Array",
        });
      }

      if (
        getdata[i].latitude === null ||
        getdata[i].latitude === undefined ||
        getdata[i].latitude === "" ||
        getdata[i].latitude === "" ||
        !/^\d+(\.\d+)?$/.test(getdata[i].latitude)
      ) {
        return (response = {
          status: "false",
          businesserrorcode: "TD_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          message: "Invalid latitude value in features Array",
        });
      }

      if (
        getdata[i].properties === null ||
        getdata[i].properties === undefined ||
        getdata[i].properties === "" ||
        getdata[i].properties === ""
      ) {
        return (response = {
          status: "false",
          businesserrorcode: "TD_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          message: "Invalid properties value in features Array",
        });
      }

      var geometry;
      if (
        appConfigInfo.mapData === "google" ||
        appConfigInfo.mapData === "hereMaps" ||
        appConfigInfo.mapData === "trinity" ||
        appConfigInfo.mapData == "mmi" ||
        appConfigInfo.mapData == "sgl"

      ) {
        geometry = new ol.geom.Point(
          ol.proj.transform(
            [parseFloat(getdata[i].longitude), parseFloat(getdata[i].latitude)],
            "EPSG:4326",
            "EPSG:3857"
          )
        );
      } else {
        var coordinate = [
          parseFloat(getdata[i].longitude),
          parseFloat(getdata[i].latitude),
        ];
        geometry = new ol.geom.Point(coordinate);
      }
      var featureval = new ol.Feature({
        geometry: geometry,
      });
      featureval.setStyle(style);
      featureval.setProperties(getdata[i].properties);
      featureDataAry.push(featureval);
    }
    var source = new ol.source.Vector({
      features: featureDataAry,
    });
    var Layers = mapObj.getLayers();
    var length = Layers.getLength();
    var pointLayerPresent = false;
    for (var i = 0; i < length; i++) {
      var layerTemp = Layers.item(i);
      if (layerTemp.get("title") == layerName) {
        pointLayerPresent = true;
        layerTemp.getSource().addFeatures(featureDataAry);
      }
    }
    if (pointLayerPresent == false) {
      var overlay = new ol.layer.Vector({
        title: layerName,
        visible: true,
        source: source,
      });
      mapObj.addLayer(overlay);
      pointLayerPresent = true;
    }
    return (response = { status: true, message: "point Layer Created.." });
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x010",
        developererrorcode: "TD_GISSDK_0x010",
        message: error.message,
      });
    }
  }
};

// ********************* SDK_MAP_API createpolygon********************* //
tmpl.Create.polygon = function (param) {
  var mapObj = param.map;
  var lyrname = param.layer;
  var jsonobj = param.features;
  var strokeColor = param.strokeColor;
  var isBlinkRequired = param.isBlinkRequired || false;
  var intervalId;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      lyrname === null ||
      lyrname === undefined ||
      lyrname === "" ||
      lyrname === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid lyrname",
      });
    }

    if (
      jsonobj === null ||
      jsonobj === undefined ||
      jsonobj === "" ||
      jsonobj === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid jsonobj",
      });
    }

    if (
      strokeColor === null ||
      strokeColor === undefined ||
      strokeColor === "" ||
      strokeColor === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid strokeColor",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  if (!param.strokeColor) {
    strokeColor = "rgba(0,0,0,0.5)";
  }
  var fillColor = param.fillColor;
  if (!param.fillColor) {
    fillColor = "rgba(255, 0, 0, 0.2)";
  }
  var labelFillColor = param.features.labelFillColor;
  var value = param.value;
  var lineDash = param.lineDash;
  var borderWidth = param.borderWidth;
  if (!param.borderWidth) {
    borderWidth = 1;
  }
  var name = param.name;
  var property = param.property;
  var locationType = param.locationType;
  var labelStrokeColor = param.features.labelStrokeColor;
  //var width = param.width;
  var format = new ol.format.WKT();
  var drawStyle;
  var getdata = jsonobj;

  if (getdata.length == 0) {
    return false;
  }

  var noLayer = false;
  var existingLayer;
  if (appConfigInfo.mapDimension == "2D") {
    var Layers = mapObj.getLayers();
    var length = Layers.getLength();
    for (i = 0; i < length; i++) {
      var tempLayer = Layers.item(i);
      if (tempLayer.get("title") == lyrname) {
        noLayer = true;
        existingLayer = tempLayer; // existingLayer.getSource().clear();
      }
    }
    if (!noLayer) {
      ovrlayPolygon = new ol.layer.Vector({
        title: lyrname,
        visible: true,
        source: new ol.source.Vector(),
      });
      ovrlayPolygon.setProperties({ lname: lyrname });

      mapObj.addLayer(ovrlayPolygon);
      existingLayer = ovrlayPolygon;
    }
    var featureDataAry = [];
    var labelDisplay = "";

    for (var i = 0, length = getdata.length; i < length; i++) {
      var s_strokeColor = strokeColor;
      if (getdata[i].strokeColor) {
        s_strokeColor = getdata[i].strokeColor;
      }
      var s_fillColor = fillColor;
      if (getdata[i].fillColor) {
        s_fillColor = getdata[i].fillColor;
      }
      var s_label = "";
      if (getdata[i].label) {
        s_label = getdata[i].label.toString();
      }

      if (!labelFillColor) {
        if (getdata[i].labelFillColor) {
          labelFillColor = getdata[i].labelFillColor;
        }
      }

      if (!labelStrokeColor) {
        if (getdata[i].labelStrokeColor) {
          labelStrokeColor = getdata[i].labelStrokeColor;
        }
      }

      //console.log(s_strokeColor,s_fillColor,getdata[i]);
      if (s_strokeColor != null && s_fillColor != null) {
        if (lineDash) {
          drawStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: s_strokeColor,
              lineDash: [4, 8],
              lineDashOffset: 6,
              width: borderWidth,
            }),
            fill: new ol.style.Fill({
              color: s_fillColor,
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: "rgba(55, 155, 55, 0.5)",
              })
            }),
            text: new ol.style.Text({
              font: "12px" + " " + "Arial",
              textAlign: "center",
              text: s_label,
              offsetX: 0,
              offsetY: 0,
              fill: new ol.style.Fill({
                color: labelFillColor,
              })
            }),
          });
        } else {
          drawStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: s_strokeColor,
              //lineDash: [.1, 5],
              width: borderWidth,
            }),
            fill: new ol.style.Fill({
              color: s_fillColor,
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: "rgba(55, 155, 55, 0.5)",
              }),
            }),
            text: new ol.style.Text({
              font: "bold 12px Arial",
              textAlign: "center",
              text: s_label,
              offsetX: 0,
              offsetY: 0,
              fill: new ol.style.Fill({
                color: labelFillColor,
              })
            }),
          });
        }
      } else {
        drawStyle = new ol.style.Style({
          fill: new ol.style.Fill({
            color: fillColor, //'rgba(255, 0, 0, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: strokeColor, //'rgba(0,0,0,0.5)',//clor,//'#ffcc33',
            width: borderWidth,
          }),
          image: new ol.style.Circle({
            radius: 1,
            fill: new ol.style.Fill({
              color: "rgba(155,150,100,0.5)", //clor// '#DC143C'//'#ffcc33'
            }),
          }),
          text: new ol.style.Text({
            font: "12px" + " " + "Arial",
            textAlign: "center",
            text: s_label,
            offsetX: 0,
            offsetY: 0,
            fill: new ol.style.Fill({
              color: "red",
              width: 20,
            })
          }),
        });
      }
      if (
        appConfigInfo.mapData === "google" ||
        appConfigInfo.mapData === "trinity" ||
        appConfigInfo.mapData == "mmi" ||
        appConfigInfo.mapData == "sgl"

      ) {
        var feature = format.readFeature(getdata[i].geometry);
        feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
        feature.setStyle(drawStyle);
        //console.log("feature.getProperties() :",feature.getProperties());
        feature.setProperties(getdata[i].properties);
        feature.setProperties({ id: getdata[i].id });
        feature.setProperties({ text: getdata[i].label });
        feature.setProperties({ label: getdata[i].label });
        feature.setProperties({ tooltip: getdata[i].tooltip });
        feature.setProperties({ value: getdata[i].value });
        feature.setProperties({ name: getdata[i].name });
        feature.setProperties({ locationType: getdata[i].locationType });
        feature.setProperties({ property: getdata[i].property });
        feature.setStyle(drawStyle);
        featureDataAry.push(feature);
      } else {
        var feature = format.readFeature(getdata[i].geometry);
        feature.getGeometry();
        feature.setStyle(drawStyle);
        feature.setProperties(getdata[i].properties);
        feature.setProperties({ tooltip: getdata[i].tooltip });
        feature.setProperties({ value: getdata[i].value });
        feature.setProperties({ id: getdata[i].id });
        feature.setProperties({ name: getdata[i].name });
        feature.setProperties({ property: getdata[i].property });
        feature.setProperties({ locationType: getdata[i].locationType });
        featureDataAry.push(feature);
      }
    }

    tmpl_setMap_layer_global.push({
      layer: existingLayer,
      title: lyrname,
      visibility: true,
      map: mapObj,
    });

    existingLayer.getSource().addFeatures(featureDataAry);
    //mapObj.addControl(new ol.control.LayerSwitcher());
    var isBlinkRequired = param.hasOwnProperty('isBlinkRequired') ? param.isBlinkRequired : false;
    if (isBlinkRequired) {
      for (var i = 0, length = param.features.length; i < length; i++) {
        var blinkdata = {};
        blinkdata.map = param.map;
        blinkdata.layer = param.layer;
        blinkdata.id = param.features[i].id;
        blinkdata.geometry = param.features[i].geometry;
        blinkdata.color = param.features[i].color;
        blinkdata.isBlinkRequired = param.features[i].isBlinkRequired;
        addPolygonBorderLayer(blinkdata);
      }
    }
    return true;

  } else {
    var i = 0;
    while (i < getdata.length) {
      // Getting centroid for label
      var cent = [];
      cent = createLatLonArray(getdata[i].geometry, "poly");
      var centroidArray = getCentroid(cent, 2);
      var polygon = turf.polygon([centroidArray]);
      // var centroid = turf.centroid(polygon);
      var centroid = turf.centerOfMass(polygon);

      // Adding entity on map
      var poly1 = mapObj.entities.add({
        name: lyrname,
        id: getdata[i].id,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(
            createLatLonArray(getdata[i].geometry, "poly")
          ),
          outline: true,
          outlineWidth: 1,
          outlineColor: Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(strokeColor),
            1.0
          ),
          perPositionHeight: true,
          fill: true,
          material: Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(fillColor),
            0.5
          ),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });

      if (getdata[i].label) {
        var polygonLabel = mapObj.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            centroid.geometry.coordinates[0],
            centroid.geometry.coordinates[1]
          ),
          name: lyrname,
          id: getdata[i].id + "_label",
          // heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
          label: {
            text: getdata[i].label,
            font: "14pt Georgia",
            // heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              50000
            ),
            fillColor: Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK,
            backgroundPadding: new Cesium.Cartesian2(4, 3),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(2e4, 1.0, 5e4, 0.5),
          },
        });
        poly1.entProp = getdata[i].properties;
      } else {
      }
      i++;
    }
    return polygonLabel;
  }
};

function getCentroid(geom, splitSize) {
  var arr = geom.slice(0);
  var array = [];

  while (arr.length > 0) {
    array.push(arr.splice(0, splitSize));
  }
  array.push(array[0]);
  return array;
}

function createLatLonArray(geom, type) {
  if (type == "poly") {
    geometry = [];
    polyg = [];
    geom = geom.toLowerCase();
    geom = geom.split("polygon");
    geom = geom[1].trim();
    geom = geom.split("((");
    geom = geom[1].trim();
    geom = geom.split("))");
    geom = geom[0].trim();
    geom = geom.split(",");
    // console.log("geom: ",geom);
    // length = geom.length;
    for (var i = 0; i < geom.length; i++) {
      var polygeo = geom[i].trim();
      polyg.push(polygeo);
    }
    // console.log("polyg: ",polyg);
    // length = polyg.length;
    for (var i = 0; i < polyg.length; i++) {
      var polygeomet = polyg[i].split(" ");
      geometry.push(polygeomet);
    }
    geometry = [].concat.apply([], geometry);
  } else if (type == "polyZ") {
    geometry = [];
    polyHeight = [];
    geom = geom.toLowerCase();
    geom = geom.split("polygon z");
    geom = geom[1].trim();
    geom = geom.split("((");
    geom = geom[1].trim();
    geom = geom.split("))");
    geom = geom[0].trim();
    geom = geom.split(",");

    for (var i = 0; i < geom.length; i++) {
      var polyheightgeom = geom[i].trim();
      polyHeight.push(polyheightgeom);
    }
    // console.log("polyHeight: ",polyHeight);
    // length = polyHeight.length;
    for (var i = 0; i < polyHeight.length; i++) {
      var polyZgeomet = polyHeight[i].split(" ");
      geometry.push(polyZgeomet);
    }
    geometry = [].concat.apply([], geometry);
  } else if (type == "line") {
    geometry = [];
    lineg = [];
    geom = geom.toLowerCase();
    geom = geom.split("linestring");
    geom = geom[1].trim();
    geom = geom.split("(");
    geom = geom[1].trim();
    geom = geom.split(")");
    geom = geom[0].trim();
    geom = geom.split(",");
    var append = geom[0];

    // length = geom.length;
    for (var i = 0; i < geom.length; i++) {
      // var linegeo = geom[i].replace(" ","");
      var linegeo = geom[i].trim();
      lineg.push(linegeo);
    }
    lineg.unshift(append);
    length = lineg.length;
    for (var i = 0; i < length; i++) {
      var linegeomet = lineg[i].split(" ");
      geometry.push(linegeomet);
    }
    geometry = [].concat.apply([], geometry);
  } else if (type == "multipoly") {
    geometry = [];
    multipolyg = [];
    geom = geom.toLowerCase();
    geom = geom.split("multipolygon");
    geom = geom[1].trim();
    geom = geom.split("(((");
    geom = geom[1].trim();
    geom = geom.split(")))");
    geom = geom[0].trim();
    geom = geom.split(",");
    // console.log("geom: ",geom);
    // length = geom.length;
    for (var i = 0; i < geom.length; i++) {
      var multipolygeo = geom[i].trim();
      multipolyg.push(multipolygeo);
    }
    // console.log("multipolyg: ",multipolyg);
    length = multipolyg.length;
    for (var i = 0; i < length; i++) {
      var polygeomet = multipolyg[i].split(" ");
      geometry.push(polygeomet);
    }
    geometry = [].concat.apply([], geometry);
  }
  var data = geometry;
  data = data.map(Number);
  // console.log("createLatLonArray final data: ",data);
  return data;
}

// ********************* SDK_MAP_API  PointWithinBoundary ********************* //

tmpl.Map.pointWithinBoundary = function (param) {
  var coord = param.point;
  var callbackFunc = param.callbackFunc;

  try {
    if (coord === null || coord === undefined || coord === "" || coord === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid coord value",
      });
    }

    if (
      callbackFunc === null ||
      callbackFunc === undefined ||
      callbackFunc === "" ||
      callbackFunc === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid callbackFunc",
      });
    }

    var url =
      appConfigInfo.connection.url +
      "/bangalore/landmark_search/withInBoundary/" +
      coord[0] +
      "/" +
      coord[1] +
      "/";
    $.ajax({
      url: url,
      success: function (res) {
        //console.log(res);
        if (res[0].count == 1) {
          callbackFunc(true);
        } else {
          callbackFunc(false);
        }
      },
      error: function () {
        console.log("there was an error!");
      },
    });

    return (response = {
      status: true,
      message: "tmpl.Map.pointWithinBoundary API Enabled..",
    });
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x010",
        developererrorcode: "TD_GISSDK_0x010",
        message: error.message,
      });
    }
  }
};

// ********************* SDK_MAP_API  CenterPoint ********************* //

tmpl.Map.centerPoint = function (param) {
  var mapObj = param.map;
  var centerPoint;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid Map Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  try {
    if (appConfigInfo.mapDimension == "2D") {
      if (
        appConfigInfo.mapData === "google" ||
        appConfigInfo.mapData === "hereMaps"
      ) {
        centerPoint = ol.proj.transform(
          mapObj.getView().getCenter(),
          "EPSG:3857",
          "EPSG:4326"
        );
      } else {
        centerPoint = mapObj.getView().getCenter();
      }
    } else {
      var ellipsoid = mapObj.scene.globe.ellipsoid;
      var carto = mapObj.camera.positionCartographic;
      var lon = Cesium.Math.toDegrees(carto.longitude);
      var lat = Cesium.Math.toDegrees(carto.latitude);
      centerPoint = [lon, lat];
    }
    var data = { status: true, data: centerPoint };
    return data;
  } catch (error) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: error.message,
    });
  }
};

// ********************* SDK_MAP_API removeWMSLayer ********************* //
tmpl.Map.removeWMSLayer = function (param) {
  var mapObj = param.map;
  var layerTitle = param.layerTitle;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid map Object",
      });
    }

    if (
      layerTitle === null ||
      layerTitle === undefined ||
      layerTitle === "" ||
      layerTitle === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerTitle",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  try {
    if (appConfigInfo.mapDimension == "2D") {
      if (appConfigInfo.mapLib == "ol7") {
        var Layers = mapObj.getLayers();
        var length = Layers.getLength();
        for (var i = 0; i < length; i++) {
          var existingLayer = Layers.item(i);
          if (existingLayer) {
            if (existingLayer.get("title") === layerTitle) {
              mapObj.removeLayer(existingLayer);
            }
          }
        }
      }
    } else {
      if (layerTitle != undefined) {
        for (var i = 0; i < mapObj.imageryLayers._layers.length; i++) {
          // if(mapObj.imageryLayers._layers[i]._imageryProvider._layers == layerTitle){
          if (
            mapObj.imageryLayers._layers[i].imageryProvider.name == layerTitle
          ) {
            var wms = mapObj.imageryLayers._layers[i];
            mapObj.imageryLayers.remove(wms);
          }
        }
      }
    }
  } catch (err) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: error.message,
    });
  }

  return (response = {
    status: true,
    message: " tmpl.Map.removeWMSLayer API Enabled..",
  });
};

// ********************* SDK_MAP_API remove ********************* //
tmpl.Draw.remove = function (param) {
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }

  mapObj.removeInteraction(modify1);
  mapObj.removeInteraction(draw);
  mapObj.removeInteraction(select);
  mapObj.removeInteraction(drawm);
  mapObj.removeInteraction(selectE);
};

// ********************* SDK_MAP_API  removeImage********************* //
tmpl.Overlay.removeImage = function (param) {
  var mapObj = param.map;
  var layerName = param.layer;
  var id = param.id;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      layerName === null ||
      layerName === undefined ||
      layerName === "" ||
      layerName === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerName",
      });
    }

    if (id === null || id === undefined || id === "" || id === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid id",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  var allLayers = mapObj.getLayers();
  for (var j = 0; j < allLayers.getLength(); j++) {
    if (layerName) {
      if (allLayers.item(j)) {
        if (layerName == allLayers.item(j).get("title")) {
          mapObj.removeLayer(allLayers.item(j));
        }
      }
    } else {
      console.log("input layer");
    }
  }
};

// ********************* SDK_MAP_API removeAllMarker********************* //
tmpl.Overlay.removeAllMarker = function (param) {
  var mapObj = param.map;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid Map Object",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  try {
    if (appConfigInfo.mapDimension == "2D") {
      mapObj
        .getOverlays()
        .getArray()
        .forEach(function (overlay) {
          mapObj.updateSize();
          mapObj.removeOverlay(overlay);
          mapObj.updateSize();
        });
    } else {
      return false;
    }
  } catch (error) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: error.message,
    });
  }
};

// ********************* SDK_MAP_API createWithClusterWithoutCircle********************* //
tmpl.Overlay.createWithClusterWithoutCircle = function (param) {
  var mapObj = param.map;
  var jsonobj = param.features;
  var radius = param.radius;
  var distance = param.distance;
  var clusterImage = param.clusterImage;
  var fillColor = param.fillColor;
  var allLayer = param.allLayer;
  var layerName = param.layer;
  var layerSwitcher = param.layerSwitcher;
  var getdata = jsonobj;
  var getHoverLabel = param.getHoverLabel;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid Map Object",
      });
    }
    if (
      jsonobj === null ||
      jsonobj === undefined ||
      jsonobj === "" ||
      jsonobj === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid jsonobj ",
      });
    }
    if (
      radius === null ||
      radius === undefined ||
      radius === "" ||
      radius === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid radius ",
      });
    }
    if (
      distance === null ||
      distance === undefined ||
      distance === "" ||
      distance === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid distance ",
      });
    }

    if (
      fillColor === null ||
      fillColor === undefined ||
      fillColor === "" ||
      fillColor === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid fillColor value ",
      });
    }

    if (
      layerName === null ||
      layerName === undefined ||
      layerName === "" ||
      layerName === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerName",
      });
    }
    if (
      layerSwitcher === null ||
      layerSwitcher === undefined ||
      layerSwitcher === "" ||
      layerSwitcher === ""
    ) {
      return (response = {
        status: "false",
        Businesserrorcode: "TD_GISSDK_0x001",
        Developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerSwitcher ",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  if (allLayer == true) {
    allClusterTypeData = [];
    allClusterType = [];
  }
  if (getdata.length == 0) {
    return false;
  }
  var featureDataAry = [];
  for (var i = 0, length = getdata.length; i < length; i++) {
    var geometry;
    if (appConfigInfo.mapData === "google") {
      geometry = new ol.geom.Point(
        ol.proj.transform(
          [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)],
          "EPSG:4326",
          "EPSG:3857"
        )
      );
    } else {
      var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
      geometry = new ol.geom.Point(coordinate);
    }
    var featureval = new ol.Feature({
      geometry: geometry,
    });
    //console.log(getdata[i].img_url);
    featureval.set("img_url", getdata[i].img_url);
    featureval.set("ff", getdata[i].img_url);
    featureval.setProperties(getdata[i]);
    featureval.setId(getdata[i].id);
    featureval.set("layer_name", layerName);
    featureDataAry.push(featureval);
    if (allLayer == true) {
      if (allClusterType.indexOf(getdata[i].category_id) == -1) {
        allClusterType.push(getdata[i].category_id);
        allClusterTypeData[getdata[i].category_id] = [];
      }
      allClusterTypeData[getdata[i].category_id].push(featureval);
      //
    }
  }
  //console.log("eeeeeee >>",allClusterTypeData);
  var source = new ol.source.Vector({
    features: featureDataAry,
  });
  var clusterSource = new ol.source.Cluster({
    distance: distance,
    source: source,
  });
  var styleCache = {};

  var Layers = mapObj.getLayers();
  var length = Layers.getLength();
  var OverlayisLayerPresent = false;
  for (var i = 0; i < length; i++) {
    var layerTemp = Layers.item(i);
    if (layerTemp.get("title") == layerName) {
      OverlayisLayerPresent = false;
      layerTemp.getSource().clear();
      try {
        mapObj.removeLayer(layerTemp);
      } catch (e) {
        //console.log("dddd",e);
      }
      break;
    }
  }

  if (OverlayisLayerPresent == false) {
    var overlay = new ol.layer.Vector({
      title: layerName,
      cluster: true,
      visible: true,
      source: clusterSource,
      style: function (fea12) {
        if (fea12 != undefined) {
          var size = fea12.get("features").length;
          for (var j = 0; j < fea12.get("features").length; j++) {
            if (fea12.get("features")[j].get("img_url") == "") {
              size = size - 1;
            }
          }
          var style = styleCache[size];
          var style2 = styleCache[size];
          dd = fea12;
          if (size == 1) {
            style2 = new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: clusterImage, //fea12.get('features')[0].getProperties().img_url
              }),
            });

            fea12.setStyle(style2);
          } else if (size == 0) {
            style = new ol.style.Style({
              image: new ol.style.Circle({
                radius: 0,
                stroke: new ol.style.Stroke({
                  color: "rgba(0,0,0,0)",
                }),
                fill: new ol.style.Fill({
                  color: "rgba(0,0,0,0)",
                }),
              }),
            });
            styleCache[size] = style;
          } else {
            //if (!style) {
            style = new ol.style.Style({
              /*image: new ol.style.Circle({
                radius: radius,
                stroke: new ol.style.Stroke({
                  color: '#ffffff00'
                }),
                fill: new ol.style.Fill({
                  color: '#ffffff00'
                })
              }),
              text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                  color: 'red'
                })
              })*/
              image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: clusterImage,
              }),
            });
            styleCache[size] = style;
            //}
          }
        }
        return style;
      },
    });
    //console.log("after");
    vv = overlay;
    OverlayisLayerPresent = true;
    gbl_allClusterLayers.push(overlay);
    mapObj.addLayer(overlay);
    //if(layerSwitcher)
    //mapObj.addControl(new ol.control.LayerSwitcher());
  }
  if (getHoverLabel == true) {
    var ta_tooltip = document.createElement("tooltip");
    ta_tooltip.id = "trip-tooltip";
    ta_tooltip.className = "ol-trip-tooltip";
    var overlay_mouseOver_label = new ol.Overlay({
      element: ta_tooltip,
      offset: [10, 0],
      positioning: "bottom-left",
    });
    mapObj.addOverlay(overlay_mouseOver_label);
    mapObj.on("pointermove", function (evt) {
      var feature_mouseOver = mapObj.forEachFeatureAtPixel(
        evt.pixel,
        function (feature, layer) {
          if (layer) {
            if (feature.getProperties().features.length > 1) {
              var fea = feature.getProperties().features[0];
              //console.log("FT >>",fea.get('layer_name'));
              if (fea.get("layer_name") == layerName) {
                return fea;
              }
            } else {
              return false;
            }
          }
        }
      );
      ta_tooltip.style.display = feature_mouseOver ? "" : "none";
      if (feature_mouseOver) {
        overlay_mouseOver_label.setPosition(evt.coordinate);
        ta_tooltip.innerHTML = feature_mouseOver.getProperties().location;
      }
    });
  }
  //console.log("eeeeeee >>",allClusterTypeData);
  return true;
};

// ********************* SDK_MAP_API changeShape********************* //
tmpl.Layer.changeShape = function (param) {
  var mapObj = param.map;
  var layerName = param.layer;
  var icon = param.icon;
  var sides = param.sides;
  var shape = param.shape;
  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }

    if (
      layerName === null ||
      layerName === undefined ||
      layerName === "" ||
      layerName === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid layerName",
      });
    }

    if (icon === null || icon === undefined || icon === "" || icon === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid icon",
      });
    }

    if (sides === null || sides === undefined || sides === "" || sides === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid sides",
      });
    }

    if (shape === null || shape === undefined || shape === "" || shape === "") {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid shape",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: true,
        message: "tmpl.Layer.clearBuffer  executed successfully",
      };
    }
  }

  var lyrs = mapObj.getLayers();
  var length = lyrs.getLength();
  var dataArr = [];
  var existing;
  for (var i = 0; i < length; i++) {
    var lyr1 = lyrs.item(i);
    if (lyr1) {
      if (lyr1.get("title") === layerName) {
        existing = lyr1;
        lyr1
          .getSource()
          .getFeatures()
          .forEach(function (ff) {
            if (shape == "icon") {
              ff.setStyle(
                new ol.style.Style({
                  image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: icon,
                  }),
                })
              );
            } else if (shape == "square") {
              ff.setStyle(
                new ol.style.Style({
                  image: new ol.style.RegularShape({
                    fill: fill,
                    stroke: new ol.style.Stroke({ color: "while", width: 2 }),
                    points: 4,
                    radius: 10,
                    angle: Math.PI / 4,
                  }),
                })
              );
            } else if (shape == "triangle") {
              ff.setStyle(
                new ol.style.Style({
                  image: new ol.style.RegularShape({
                    fill: fill,
                    stroke: new ol.style.Stroke({ color: "while", width: 2 }),
                    points: 4,
                    radius: 10,
                    angle: Math.PI / 4,
                  }),
                })
              );
            }
          });
        var alfeatures = lyr1.getSource().getFeatures();
        lyr1.getSource().clear();
        lyr1.getSource().addFeatures(alfeatures);
      }
    }
  }

  if (existing == undefined) {
    for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
      if (tmpl_setMap_layer_global[i].title == layerName) {
        tmpl_setMap_layer_global[i].layer
          .getSource()
          .getFeatures()
          .forEach(function (ff) {
            if (shape == "icon") {
              ff.setStyle(
                new ol.style.Style({
                  image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: icon,
                  }),
                })
              );
            } else {
            }
          });
        var alfeatures = tmpl_setMap_layer_global[i].layer
          .getSource()
          .getFeatures();
        tmpl_setMap_layer_global[i].layer.getSource().clear();
        tmpl_setMap_layer_global[i].layer.getSource().addFeatures(alfeatures);
      }
    }
  }
};

// ********************* SDK_MAP_API clearBuffer********************* //
var bufferLayer;
/*var bufferLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
  });*/
tmpl.Layer.clearBuffer = function (param) {
  var mapObj = param.map;

  try {
    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid mapObj",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: error.message,
      });
    }
  }
  if (bufferLayer != undefined) bufferLayer.getSource().clear();

  return {
    status: true,
    message: "tmpl.Layer.clearBuffer  executed successfully",
  };
};
let gbl3DLayoutMap;
layoutMapObjectAPI;
tmpl.Map.addFloorMap = function (param) {
  let dimension;
  let mapLib;
  let mapType;
  let mapData;
  let flag = false;

  // if(appConfigInfo.mapDimension == "3D"){
  //   flag = true;
  //   dimension = appConfigInfo.mapDimension;
  //   mapLib = appConfigInfo.mapLib;
  //   mapType = appConfigInfo.type;
  //   mapData = appConfigInfo.mapData;
  // }
  // appConfigInfo.mapDimension = "2D";
  // appConfigInfo.mapLib = "ol7";
  // appConfigInfo.type = "normal";
  // appConfigInfo.type = appConfigInfo.mapData = "google";
    var target = param.target;
    var url = param.url;
    var zoomlevel = param.zoom;
    var callBackFun = param.callBackFun;
  
    if (zoomlevel == undefined || zoomlevel == "" || zoomlevel == null) {
      zoomlevel = appConfigInfo.layOutZoom;
    }
  
    try {
      if (
        target == "none" ||
        target == "" ||
        target == null ||
        target == undefined
      ) {
        return (response = {
          status: false,
          businesserrorcode: "TB_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          businessmessage: "Bad Request, Parameter Not Valid",
          developermessage:
            "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
            "param.target",
        });
      }
  
      if (url == "none" || url == "" || url == null || url == undefined) {
        return (response = {
          status: false,
          businesserrorcode: "TB_GISSDK_0x001",
          developererrorcode: "TD_GISSDK_0x001",
          businessmessage: "Bad Request, Parameter Not Valid",
          developermessage:
            "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
            "param.url",
        });
      }
    } catch (e) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request",
        e,
      });
    }
  
 if(appConfigInfo.mapDimension == "2D"){
  if (layoutMapObjectAPI) {
    var allLayers = layoutMapObjectAPI.getLayers();
    var layerLength = allLayers.getLength();
    for (var j = 0; j < layerLength; j++) {
      var lyr1 = allLayers.item(j);
      if (lyr1) {
        layoutMapObjectAPI.removeLayer(lyr1);
      }
    }
    layoutMapObjectAPI.setTarget(null);
    layoutMapObjectAPI = "";
  }
  var lextent = ol.proj.transformExtent(
    [
      parseFloat(appConfigInfo.layOutExtent1),
      parseFloat(appConfigInfo.layOutExtent2),
      parseFloat(appConfigInfo.layOutExtent3),
      parseFloat(appConfigInfo.layOutExtent4),
    ],
    "EPSG:4326",
    "EPSG:3857"
  );
  var centerPoint = ol.extent.getCenter(lextent);

  var projection = new ol.proj.Projection({
    code: "xkcd-image",
    units: "pixels",
    extent: lextent,
  });

  var view = new ol.View({
    center: centerPoint,
    zoom: zoomlevel,
    minZoom: parseInt(zoomlevel) - 2,
    maxZoom: 22,
  });

  var layoutLayer = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: url,
      projection: projection,
      imageExtent: lextent,
      imageLoadFunction: function (image, src) {
        var imageElement = image.getImage();
        imageElement.onload = function () {
          $(".loadingDiv").css("display", "none");
        };
        imageElement.src = src;
      },
    }),
  });
  
  // if(flag){
  //   appConfigInfo.mapDimension = dimension;
  //   appConfigInfo.mapLib = mapLib;
  //   appConfigInfo.type = mapType;
  //   appConfigInfo.mapData = mapData;
  // }
  setTimeout(function () {
    console.log("from api layout");
    layoutMapObjectAPI = "";
    layoutMapObjectAPI = new ol.Map({
      layers: [layoutLayer],
      target: target,
      view: view,
    });
    console.log("layoutMapObjectAPI", layoutMapObjectAPI);
    activate(layoutMapObjectAPI);

    if (callBackFun)
      var response = {
        status: true,
        message: "Layout Map Created Successfully..",
        layOutmap: layoutMapObjectAPI,
      };
    callBackFun(layoutMapObjectAPI, response);
    return response;
  }, 500);
 }else{
  if (layoutMapObjectAPI) {
    layoutMapObjectAPI.destroy();
    layoutMapObjectAPI = null;
  }
   
  var lextent = [
    parseFloat(appConfigInfo.layOutExtent1),
    parseFloat(appConfigInfo.layOutExtent2),
    parseFloat(appConfigInfo.layOutExtent3),
    parseFloat(appConfigInfo.layOutExtent4),
  ];
  console.log(appConfigInfo.layOutExtent1, appConfigInfo.layOutExtent2, appConfigInfo.layOutExtent3, appConfigInfo.layOutExtent4);
 
  var viewer = new Cesium.Viewer(target, {
    sceneMode: Cesium.SceneMode.SCENE2D,
    baseLayerPicker: false,
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    terrainProviderViewModels: [], // Disable terrain to avoid distortion
    fullscreenButton: false, // Disable fullscreen button
    geocoder: false,         // Disable geocoder (search button)
    homeButton: false,       // Disable home button
    infoBox: false,
    creditContainer: undefined    
  });
  layoutMapObjectAPI=viewer;
 
  // Set image bounds to avoid infinite scroll and zooming
  var boundingRectangle = Cesium.Rectangle.fromDegrees(
    lextent[0], // west
    lextent[1], // south
    lextent[2], // east
    lextent[3]  // north
  );
 
  // Add imagery provider with fitting rectangle
  setTimeout(() => {
    viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
      url: appConfigInfo.mapSDKURL + "blackBackground.png",
    }));
  }, 900);
 
 
  setTimeout(() => {
    viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
      url: url,
    }));
 
    // Get the image bounds from the imagery provider to fit the camera view correctly
    var imageProvider = viewer.imageryLayers.get(0).imageryProvider;
   
    // Set the camera to fit the imagery provider's bounds
    var rectangle = imageProvider.rectangle; // Get the extent of the image
    viewer.scene.camera.setView({
      destination: rectangle,
      orientation: {
        pitch: Cesium.Math.toRadians(-90), // Point the camera directly downward
        roll: 0.0,
        heading: 0.0,
      },
    });
 
    // Disable scroll and zoom behaviors
    viewer.scene.screenSpaceCameraController.enableRotate = false;
    viewer.scene.screenSpaceCameraController.enableZoom = false;
    viewer.scene.screenSpaceCameraController.enableTilt = false;
    viewer.scene.screenSpaceCameraController.enableLook = false;
    viewer.scene.screenSpaceCameraController.enableTranslate = false;
   
  }, 1000);
 
 
  setTimeout(function () {
    viewer.scene.camera.setView({
      destination: boundingRectangle,
      orientation: {
        pitch: Cesium.Math.toRadians(-90), // Point directly down
        roll: 0.0,
        heading: 0.0,
      }
    });
    console.log("from api layout");
    console.log("layoutMapObjectAPI", layoutMapObjectAPI);
    if (callBackFun) {
      var response = {
        status: true,
        message: "Layout Map Created Successfully in 3D.",
        layOutmap: layoutMapObjectAPI,
      };
      callBackFun(layoutMapObjectAPI, response);
      return response;
    }
  }, 500);
 
 }
};

tmpl.Map.removeFloorMap = function () {

  // if (layoutMapObjectAPI) {
if(appConfigInfo.mapDimension == "2D"){
  var allLayers = layoutMapObjectAPI.getLayers();
    var layerLength = allLayers.getLength();
    for (var j = 0; j < layerLength; j++) {
      var lyr1 = allLayers.item(j);
      if (lyr1) {
        layoutMapObjectAPI.removeLayer(lyr1);
      }
    }
    layoutMapObjectAPI.setTarget(null);
}else{
  tmpl.Map.remove({
    map:gbl3DLayoutMap
  });
}

};

// tmpl.Info.getPlace = function (param) {

// 	try {

// 		if (param.callbackFunc == "none" || param.callbackFunc == '' || param.callbackFunc == null || param.callbackFunc == undefined) {

// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Bad Request, Parameter Not Valid', developermessage: '400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter' + 'param.callbackFunc' };
// 		}

// 		tmpl.Info.getPlaceFlag = true;
// 		tmpl.Info.getPlace.CallbackFunc = param.callbackFunc;

// 		return response = { status: true, message: 'Get Place Info Enabled..' }

// 	} catch (e) {
// 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Bad Request, Parameter Not Valid', developermessage: '400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter' + e.message };
// 	}

// }

var entity;
var handler;
tmpl.Info.getPlace = function (param) {

  try {
    if (
      param.callbackFunc == "none" ||
      param.callbackFunc == "" ||
      param.callbackFunc == null ||
      param.callbackFunc == undefined
    ) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request, Parameter Not Valid",
        developermessage:
          "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
          "param.callbackFunc",
      });
    }

    if (appConfigInfo.mapDimension == "2D") {
      var map = param.map;
      var callbackFunc = param.callbackFunc;
      var locationAddress;
      tmpl.Info.getPlaceFlag = true;
      tmpl.Info.getPlace.CallbackFunc = callbackFunc;
      //--------------------------

      //--------------------------
    } else {

      var viewer = param.map;
      var callbackFunc = param.callbackFunc;

      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      function handleLeftClick(event) {
        var response = {};
        var address = [];
        var windowPosition = event.position;
        var pickedPosition = viewer.scene.camera.pickEllipsoid(windowPosition);
        if (Cesium.defined(pickedPosition)) {
          var cartographicPosition = Cesium.Cartographic.fromCartesian(pickedPosition);
          var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
          var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
          var geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${appConfigInfo.gKey}`;
          fetch(geocodingUrl).then(response => response.json())
            .then(data => {
              address.push(data.results[0].formatted_address);
            })
          response['place'] = address;
          response['latitude'] = latitude;
          response['longitude'] = longitude;
          callbackFunc(response);
        }
      }
      handler.setInputAction(handleLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    return (response = { status: true, message: "Get Place Info Enabled.." });
  } catch (e) {
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      businessmessage: "Bad Request, Parameter Not Valid",
      developermessage:
        "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
        e.message,
    });
  }
};

tmpl.Info.removeGetPlace = function () {
  if (appConfigInfo.mapDimension == "2D") {
    tmpl.Info.getPlaceFlag = false;
    tmpl.Info.getPlace.CallbackFunc = function () { };
  } else {
    if (handler) {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  }
};

tmpl.POI.addPOICircleGeometry = function (param) {
  try {
    var mapObj = param.map;
    var lyrName = param.layer;
    var features = param.features;
    var format = new ol.format.WKT();
    var feature;
    var featureDataAry = [];
    var lyrName_circle = lyrName + "_API_CircleLayer";
    // This layerName is Attaching With User Giving LayerName  // By Joel
    //mapObj.removeInteraction(modifyPOI);

    //******* Parameter Validation *****  */

    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Not a Valid map Object",
      });
    }

    if (
      lyrName === null ||
      lyrName === undefined ||
      lyrName === "" ||
      lyrName === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Not a Valid lyrName",
      });
    }

    if (
      features === null ||
      features === undefined ||
      features === "" ||
      features === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Not a Valid features",
      });
    }

    if (
      format === null ||
      format === undefined ||
      format === "" ||
      format === ""
    ) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Not a Valid format",
      });
    }

    tmpl.Layer.clearData({
      map: mapObj,
      layer: lyrName,
    });
    //  tmpl.Layer.clearData is modified as ABOVE
    ///////////////////////////////////////////////	tmpl.Layer.clearData({map:map,layer:'POILayer'});

    tmpl.POI.clearPOICircleInteractions({
      map: mapObj,
    });

    for (var i = 0; i < features.length; i++) {
      if (appConfigInfo.mapData == "google") {
        feature = format.readFeature(features[i].geometry, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
      } else {
        feature = format.readFeature(features[i].geometry, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:4326",
        });
      }
      feature.setStyle(
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: features[i].image,
          }),
        })
      );
      var keyNames = Object.keys(features[i]);
      for (var name = 0; name < keyNames.length; name++) {
        if (keyNames[name] == "geometry") {
        } else {
          var value = features[i][keyNames[name]];
          var x = keyNames[name];
          feature.set("" + x + "", "" + value + "");
        }
      }
      featureDataAry.push(feature);
    }
    var source = new ol.source.Vector({
      features: featureDataAry,
    });
    var Layers = mapObj.getLayers();
    var length = Layers.getLength();
    var isLayerPresent11 = false;
    var CircleLayerTemp = false;

    for (i = 0; i < length; i++) {
      var existingLayer = Layers.item(i);
      if (existingLayer) {
        if (existingLayer.get("title") == lyrName) {
          isLayerPresent11 = true;
          existingLayer.getSource().addFeatures(featureDataAry);
        } else if (existingLayer.get("title") == lyrName_circle) {
          CircleLayerTemp = existingLayer;
          //mapObj.removeLayer(existingLayer);
          // Here Removable, But layerArray Contain this layer, So removing only after exiting the loop
        }
      }
    }
    if (CircleLayerTemp != false) {
      mapObj.removeLayer(CircleLayerTemp);
    }

    if (isLayerPresent11 == false) {
      var newLayer = new ol.layer.Vector({
        title: lyrName,
        visible: true,
        source: source,
      });
      isLayerPresent11 == true;
      newLayer.setProperties({
        lname: lyrName,
      });
      newLayer.setProperties({
        myId: "myUnique",
      });
      newLayer.setProperties({
        title: lyrName,
      });
      newLayer.setProperties({
        CircleLayerAttached: true,
      });
      mapObj.addLayer(newLayer);
      //	existingLayer = newLayer;  //removed by joel
    }

    CircleLayer = new ol.layer.Vector({
      title: lyrName_circle,
      visible: true,
      //CircleLayerAttached: false,
      //CircleLayer:true,
      source: new ol.source.Vector(),
    });

    CircleLayer.setProperties({
      lname: lyrName_circle,
    });
    CircleLayer.setProperties({
      myId: "myUnique2",
    });
    CircleLayer.setProperties({
      title: lyrName_circle,
    });
    //CircleLayer.setProperties({CircleLayerAttached:false});
    mapObj.addLayer(CircleLayer);

    var wgs84Sphere = new ol.Sphere(6378137);
    var circle4326,
      circle3857,
      circleFeature,
      cirGeomtry,
      cirGeomtry4326,
      wktBufferGeom,
      style;
    style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgb(255,0,0)",
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: "rgba(255,0,0,0.2)",
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "rgba(55, 155, 55, 0.5)",
        }),
      }),
    });
    for (var j = 0; j < features.length; j++) {
      var circleLatlon = features[j].geometry;
      /*var tc = circleLatlon.split("POINT(")[1];
      tc = tc.split(')')[0];
      tc = tc.split(' ');
      var latc = parseFloat(tc[1]);
      var lonc = parseFloat(tc[0]);*/
      var p1 = circleLatlon.split("(");
      var p2 = p1[1].split(")");
      var p3 = p2[0].split(" ");
      var latc = parseFloat(p3[1]);
      var lonc = parseFloat(p3[0]);
      if (appConfigInfo.mapData == "google") {
        circle4326 = ol.geom.Polygon.circular(
          wgs84Sphere,
          [lonc, latc],
          features[j].radius,
          64
        );
        circle3857 = circle4326.clone().transform("EPSG:4326", "EPSG:3857");
        circleFeature = new ol.Feature(circle3857);
        circleFeature.setStyle(style);
        circleFeature.setId("c_" + features[j].id);
        circleFeature.set("id", "c_" + features[j].id);

        var keyNames1 = Object.keys(features[j]);
        for (var name = 0; name < keyNames1.length; name++) {
          if (keyNames1[name] == "geometry") {
          } else {
            var value1 = features[j][keyNames1[name]];
            var x1 = keyNames1[name];
            circleFeature.set("" + x + "", "" + value + "");
          }
        }

        CircleLayer.getSource().addFeature(circleFeature);
        cirGeomtry = circleFeature.getGeometry();
        cirGeomtry4326 = cirGeomtry.clone().transform("EPSG:3857", "EPSG:4326");
        wktBufferGeom = format.writeGeometry(cirGeomtry4326);
      } else {
        circle4326 = ol.geom.Polygon.circular(
          wgs84Sphere,
          [lonc, latc],
          features[j].radius,
          64
        );
        circle3857 = circle4326;
        circleFeature = new ol.Feature(circle3857);
        circleFeature.setStyle(style);
        circleFeature.setId("c_" + features[j].id);
        circleFeature.set("id", "c_" + features[j].id);

        var keyNames1 = Object.keys(features[j]);
        for (var name = 0; name < keyNames1.length; name++) {
          if (keyNames1[name] == "geometry") {
          } else {
            var value1 = features[j][keyNames1[name]];
            var x1 = keyNames1[name];
            circleFeature.set("" + x + "", "" + value + "");
          }
        }

        //circleFeature.setProperties(features[j].getProperties());

        CircleLayer.getSource().addFeature(circleFeature);
        cirGeomtry = circleFeature.getGeometry();
        cirGeomtry4326 = cirGeomtry;
        wktBufferGeom = format.writeGeometry(cirGeomtry4326);
      }

      console.log(" ::::: lyrName :::: ", lyrName);
      console.log(" ::::: lyrName_circle :::: ", lyrName_circle);
    }
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid parameter :" + error.message,
      });
    }
  }
};

/** create POI Circle ** */

var drawPOI, modifyPOI, modifyPOIC;
tmpl.Create.POICircle = function (param) {
  try {
    var mapObj = param.map;
    var icon = param.image;
    var rdus = param.radius;
    var callbackFunc = param.callbackFunc;

    if (mapObj === null || mapObj === undefined) {
      return (response = {
        status: "false",
        businesserrorcode: "TD_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Not a Valid map Object",
      });
    }

    /*mapObj.removeInteraction(drawPOI);
    mapObj.removeInteraction(modifyPOI);*/

    tmpl.POI.clearPOICircleInteractions({ map: mapObj });

    var format = new ol.format.WKT();
    var features = new ol.Collection();
    var source = new ol.source.Vector();
    var noLayer = false;
    var existingLayer, latlon;

    var lonlat, coord, wktGeom, address;

    var Layers = mapObj.getLayers();
    for (i = 0; i < Layers.getLength(); i++) {
      var tempLayer = Layers.item(i);
      if (tempLayer.get("lname") === "poivector") {
        noLayer = true;
        existingLayer = tempLayer;
        existingLayer.getSource().clear();

        tmpl.Layer.clearCircle({ map: mapObj });
      }
    }
    if (!noLayer) {
      poiVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: icon,
          }),
        }),
      });
      poiVector.setProperties({ lname: "poivector" });
      poiVector.setProperties({ myId: "poiUnique" });
      poiVector.setProperties({ title: "poivector" });
      mapObj.addLayer(poiVector);
      existingLayer = poiVector;
    }

    modifyPOI = new ol.interaction.Modify({
      features: features,
      deleteCondition: function (event) {
        return (
          ol.events.condition.shiftKeyOnly(event) &&
          ol.events.condition.singleClick(event)
        );
      },
    });

    modifyPOI.on("modifyend", function (event) {
      tmpl.Layer.clearCircle({ map: mapObj });
      var feature = event.features;
      var geometryVal = feature.a[0].getGeometry();
      lonlat = feature.item(0).getGeometry().getCoordinates();
      if (appConfigInfo.mapData === "google") {
        coord = ol.proj.transform(lonlat, "EPSG:3857", "EPSG:4326");
        wktGeom = format.writeGeometry(
          feature
            .item(0)
            .getGeometry()
            .clone()
            .transform("EPSG:3857", "EPSG:4326")
        );
      } else {
        coord = lonlat; //feature.getGeometry().getCoordinates();
        wktGeom = format.writeGeometry(feature.item(0).getGeometry());
      }
      event.stopPropagation();
      mapObj.removeInteraction(drawPOI);
      tmpl.Geocode.getGeocode({
        point: [coord[0], coord[1]],
        callbackFunc: handleGeocode,
      });
      function handleGeocode(data) {
        address = data.address;
        tmpl.Create.circle({
          map: mapObj,
          latlon: [coord[1], coord[0]],
          radius: param.radius,
          strokeColor: null,
          fillColor: null,
          callbackFunc: test2,
        });
        function test2(a) {
          var rec = {
            point: wktGeom,
            radius: rdus,
            address: address,
            geometry: a,
          };
          callbackFunc(rec);
        }
      }
    });
    function addInteractionPOI() {
      drawPOI = new ol.interaction.Draw({
        features: features,
        source: poiVector.getSource(),
        type: "Point",
      });
      mapObj.addInteraction(drawPOI);
      drawPOI.on("drawend", function (event) {
        var feature = event.feature;
        var geometryVal = feature.getGeometry();
        lonlat = feature.getGeometry().getCoordinates();
        if (appConfigInfo.mapData === "google") {
          coord = ol.proj.transform(lonlat, "EPSG:3857", "EPSG:4326");
          latlon = [coord[1], coord[0]];
          wktGeom = format.writeGeometry(
            feature.getGeometry().clone().transform("EPSG:3857", "EPSG:4326")
          );
        } else {
          coord = lonlat; //feature.getGeometry().getCoordinates();
          latlon = [coord[1], coord[0]];
          wktGeom = format.writeGeometry(feature.getGeometry());
        }
        event.stopPropagation();
        mapObj.removeInteraction(drawPOI);
        mapObj.addInteraction(modifyPOI);
        console.log(coord[1]);
        tmpl.Zoom.toXYcustomZoom({
          map: mapObj,
          latitude: coord[1],
          longitude: coord[0],
          zoom: 15,
        });

        tmpl.Geocode.getGeocode({
          point: coord,
          callbackFunc: handleGeocode,
        });
        function handleGeocode(data) {
          address = data.address;
          tmpl.Create.circle({
            map: mapObj,
            latlon: latlon,
            radius: param.radius,
            strokeColor: null,
            fillColor: null,
            callbackFunc: test2,
          });
          function test2(a) {
            var rec = {
              point: wktGeom,
              radius: rdus,
              address: address,
              geometry: a,
            };
            callbackFunc(rec);
          }
        }
      });
    }
    addInteractionPOI();
  } catch (error) {
    if (error instanceof Error) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        message: "Invalid parameter :" + error.message,
      });
    }
  }
};

tmpl.Map.snapshot = function (param) {
  try {
    if (
      param.map == "none" ||
      param.map == "" ||
      param.map == null ||
      param.map == undefined
    ) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request, Parameter Not Valid",
        developermessage:
          "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
          "param.map",
      });
    }
    if (
      param.type == "none" ||
      param.type == "" ||
      param.type == null ||
      param.type == undefined
    ) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request, Parameter Not Valid",
        developermessage:
          "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
          "param.type",
      });
    }

    if (
      param.callBackFun == "none" ||
      param.callBackFun == "" ||
      param.callBackFun == null ||
      param.callBackFun == undefined
    ) {
      return (response = {
        status: false,
        businesserrorcode: "TB_GISSDK_0x001",
        developererrorcode: "TD_GISSDK_0x001",
        businessmessage: "Bad Request, Parameter Not Valid",
        developermessage:
          "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
          "param.callBackFun",
      });
    }

    var map = param.map;
    var type = param.type;
    var callBackFun = param.callBackFun;

    map.once("postcompose", function (event) {
      var canvas = event.context.canvas;
      if (type === "png") {
        canvas.toBlob(
          function (blob) {
            //console.log(blob);
            callBackFun(blob);
            return (response = { status: true, data: blob });
          },
          "image/" + type,
          1
        );
      } else {
        canvas.toBlob(
          function (blob) {
            //console.log(blob);
            callBackFun(blob);
            return (response = { status: true, data: blob });
          },
          "image/jpeg",
          1
        );
      }
    });
    map.renderSync();
  } catch (e) {
    console.log("Map snapshot Issue..!", e.message);
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      businessmessage: "Bad Request, Parameter Not Valid",
      developermessage:
        "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
        e.message,
    });
  }
};

tmpl.Map.addOSMBuildings = async function (param) {
  console.log("addOSMBuildings -> ", param);
  var viewer = param.map;
  if (osmBuildingsTileset) {
    viewer.scene.primitives.remove(osmBuildingsTileset);
  }

  Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;
  // osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
  // viewer.scene.primitives.add(osmBuildingsTileset);

  // map.camera.setView({
  // 	destination: Cesium.Cartesian3.fromDegrees(appConfigInfo.lon, appConfigInfo.lat, 60000)
  // });
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(
  //     appConfigInfo.lon,
  //     appConfigInfo.lat,
  //     1500
  //   ),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(20),
  //     pitch: Cesium.Math.toRadians(-15),
  //   },
  //   duration: 0,
  // });

  var west = 77.57122362853293
  var south = 12.973655490078828
  var east = 77.59542788268331
  var north = 12.986222040752134

  // 77.57122362853293,12.973655490078828,77.59542788268331,12.986222040752134
  // Calculate the center point for positioning
  var centerLongitude = (west + east) / 2;
  var centerLatitude = (south + north) / 2;

  var centerPosition = Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude, 0);

  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-90)); // Adjust the angle as needed

  // Create a translation matrix for positioning
  var translation = Cesium.Transforms.eastNorthUpToFixedFrame(centerPosition);

  // Combine the rotation and translation into a model matrix
  var modelMatrix = Cesium.Matrix4.multiplyByMatrix3(translation, rotation, new Cesium.Matrix4());

  // Load the model using fromGltfAsync
  Cesium.Model.fromGltfAsync({
    // url: appConfigInfo.mapSDK3DURL+'TerrainOSM.glb',
    url: appConfigInfo.mapSDK3DURL+'FixdBangalore.glb',
    // url: 'D:/svn/RnD_GIS_RV2.6.2_10736/GISClientServices/v4.0.0/cesium/Bangalore_Recent.glb',
    modelMatrix: modelMatrix,
    scale: 1., // Adjust scale as needed
  }).then(function (model) {
    // Add the loaded model to the scene
    osmBuildingsTileset = model;
    viewer.scene.primitives.add(osmBuildingsTileset);
    // viewer.camera.flyTo(osmBuildingsTileset)

  }).catch(function (error) {
    console.error('Error loading model:', error);
  });
};

tmpl.Map.removeOSMBuildings = function (param) {
  var viewer = param.map;
  // viewer.scene.primitives.remove(osmBuildingsTileset);
  osmBuildingsTileset.show = false;
};

tmpl.Map.EnableOrDesableTerrain = function (param) {
  var viewer = param.map;
  var terrainVisibility = param.visibility;
  var terrainProvider;

  if (viewer == null || viewer == undefined) {
    return (response = {
      status: false,
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Not a Valid map Object",
    });
  }
  if (terrainVisibility == null || terrainVisibility == undefined) {
    return (response = {
      status: false,
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Not a valid Boolean",
    });
  }
  try {
    if (terrainVisibility == true || terrainVisibility == "true") {
      Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;
      terrainProvider = Cesium.Terrain.fromWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      });

      viewer.terrainProvider = terrainProvider;
      return (response = { status: true, message: "Terrain Enabled" });
    } else {
      terrainProvider = new Cesium.EllipsoidTerrainProvider({});
      viewer.terrainProvider = terrainProvider;
      return (response = { status: true, message: "Terrain Disabled" });
    }
  } catch (e) {
    console.log("error while Enabling or Disabling Terrain", e.message);
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      businessmessage: "Bad Request, Parameter Not Valid",
      developermessage:
        "400 Bad Request: This error code indicates that the request was not properly formed or contained invalid data or Parameter" +
        e.message,
    });
  }
};

tmpl.Map.add3dTiledMap = function (param) {
  var viewer = param.map;
  var assetid = appConfigInfo.tiled3DBaseMap;
  var imageryLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: assetid })
  );

  imageryLayer.name = assetid;
  var rectangle = imageryLayer.rectangle;
  if (rectangle) {
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        rectangle.west,
        rectangle.south,
        rectangle.east,
        rectangle.north
      ),
      duration: 2.0,
    });
  } else {
    console.error("The imagery layer does not have a valid rectangle.");
  }
};

tmpl.Map.remove3dTiledMap = function (param) {
  var viewer = param.map;
  var assetid = appConfigInfo.tiled3DBaseMap;
  for (var i = 0; i < viewer.imageryLayers._layers.length; i++) {
    console.log(viewer.imageryLayers._layers[i].name);
    if (viewer.imageryLayers._layers[i].name == assetid) {
      var wms = viewer.imageryLayers._layers[i];
      viewer.imageryLayers.remove(wms);
    }
  }
};

tmpl.Map.enableShado = function (param) {
  var viewer = param.map;
  if (viewer == null || viewer === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map Object",
    });
  }
  try {
    viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
    viewer.shadows = true;
    var shadowMap = viewer.shadowMap;
    shadowMap.maximumDistance = 400000;
    return {
      status: true,
      message: "tmpl.Map.enableShado  executed successfully",
    };
  } catch (e) {
    console.log("tmpl.Map.enableShado   | ", e.message);
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: e.message,
    });
  }
};

tmpl.Map.desableShado = function (param) {
  var viewer = param.map;
  if (viewer == null || viewer === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map Object",
    });
  }
  try {
    viewer.terrainShadows = Cesium.ShadowMode.DISABLED;
    viewer.shadows = false;
    viewer.clockViewModel.shouldAnimate = false;
    return {
      status: true,
      message: "tmpl.Map.desableShado  executed successfully",
    };
  } catch (e) {
    console.log("tmpl.Map.desableShado   | ", e.message);
    return (response = {
      status: false,
      businesserrorcode: "TB_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: e.message,
    });
  }
};

tmpl.Map.add3dTiledMap = function (param) {
  var viewer = param.map;
  var assetid = appConfigInfo.tiled3DBaseMap;
  var imageryLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.IonImageryProvider({ assetId: assetid })
  );
  imageryLayer.name = assetid;
  viewer.zoomTo(imageryLayer).otherwise(function (error) {
    console.log(error);
  });
};

tmpl.Map.zoomTo3dModelUsingAssectID = function (param) {
  var viewer = param.map;
  var asset = param.assetid;
  tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

  for (var i = 0; i < viewer.scene.primitives._primitives.length; i++) {
    console.log(viewer.scene.primitives._primitives[i].name);
    if (viewer.scene.primitives._primitives[i].name == asset) {
      var cloud3dAssect = viewer.scene.primitives._primitives[i];

      cloud3dAssect.readyPromise
        .then(function () {
          //viewer.zoomTo(cloud3dAssect);
          //Zoom to the perticular 3d model.
          viewer.zoomTo(
            cloud3dAssect,
            new Cesium.HeadingPitchRange(
              Cesium.Math.toRadians(40),
              Cesium.Math.toRadians(-7),
              60
            )
          );

          // Apply the default style if it exists
          var extras = cloud3dAssect.asset.extras;
          if (
            Cesium.defined(extras) &&
            Cesium.defined(extras.ion) &&
            Cesium.defined(extras.ion.defaultStyle)
          ) {
            cloud3dAssect.style = new Cesium.Cesium3DTileStyle(
              extras.ion.defaultStyle
            );
          }
        })
        .otherwise(function (error) {
          console.log(error);
        });
    }
  }
};

tmpl.Map.add3dModelAsAssectID = function (param) {
  var viewer = param.map;
  var mapObj = viewer;
  var assetid = param.assetid;
  var zoomLevel = param.zoomLevel;
  var pitch = param.pitchLevel;
  tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: true });

  Cesium.Ion.defaultAccessToken = appConfigInfo.CesiumdefaultAccessToken;

  tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(assetid),
    })
  );
  tileset.name = assetid;
  tileset.id = assetid;

  // tileset.readyPromise
  // 	.then(function () {
  // 		//viewer.zoomTo(tileset);
  // 		//Zoom to the perticular 3d model.
  // 		if (zoomLevel > 5) {
  // 			viewer.zoomTo(tileset,
  // 				new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(pitch), zoomLevel));
  // 			//alert("Zoom");
  // 		}
  // 		else {
  // 			viewer.zoomTo(tileset,
  // 				new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40), Cesium.Math.toRadians(-7), 60));
  // 		}
  // 		// Apply the default style if it exists
  // 		var extras = tileset.asset.extras;
  // 		if (
  // 			Cesium.defined(extras) &&
  // 			Cesium.defined(extras.ion) &&
  // 			Cesium.defined(extras.ion.defaultStyle)
  // 		) {
  // 			tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
  // 		}
  // 	})
  // 	.otherwise(function (error) {
  // 		console.log(error);
  // 	});

  ///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////

  // var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [];
  // var ellipsoid = mapObj.scene.globe.ellipsoid;

  // var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);

  // handler.setInputAction(function (movement) {
  // 	//alert();
  // 	var pick = viewer.scene.pick(movement.position);
  // 	// if (Cesium.defined(pick) && (pick.id.id === cid)) {
  // 	if (Cesium.defined(pick)) {
  // 		//alert(modValue.quXian[pick.id.id].name);
  // 		//console.log("--",tileset.id);
  // 		getOverlayFeatureDetails(tileset.id, [], tileset.id, [], viewer);
  // 	}
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  ///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////
};

tmpl.Map.remove3dModelAsAssectID = function (param) {
  var viewer = param.map;
  tmpl.Map.EnableOrDesableTerrain({ map: viewer, visibility: false });
  add3dModelAsAssectIDVar.show = false;
};

let _3dTileset = null;
tmpl.Map.add3DtileSet = function (param) {
  viewer = param.map;
  url = param.url;
  id = param.id;
  paramObj = param;
  if (id == null || id === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "please add ID or invalid ID",
    });
  }

  if (viewer == null || viewer === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map Object",
    });
  }
  if (url == null || url === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "please add url or Invalid URL",
    });
  }
  tmpl.Map.add3DtileSetHelper(viewer, url, id);
};
tmpl.Map.add3DtileSetHelper = async function (viewer, url, id) {
  try {
    _3dTileset = await Cesium.Cesium3DTileset.fromUrl(url);
    _3dTileset.id = id;
    viewer.scene.primitives.add(_3dTileset);
    viewer.zoomTo(
      _3dTileset,
      new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(35),
        Cesium.Math.toRadians(-20),
        145
      )
    );
  } catch (error) {
    console.error(`Error creating tileset: ${error}`);
  }
  return (response = { status: true, message: "3D tile added to the scene" });
};

tmpl.Map.remove3DtileSet = function (param) {
  viewer = param.map;
  id = param.id;
  if (viewer == null || viewer === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid map Object",
    });
  }
  if (id == null || id === undefined) {
    return (response = {
      status: "false",
      businesserrorcode: "TD_GISSDK_0x001",
      developererrorcode: "TD_GISSDK_0x001",
      message: "Invalid ID",
    });
  }
  try {
    let flag = false;
    for (var i = 0; i < viewer.scene.primitives.length; i++) {
      var primitive = viewer.scene.primitives.get(i);

      // Check if the primitive is a Cesium3DTileset and has the matching id
      if (primitive instanceof Cesium.Cesium3DTileset && primitive.id === id) {
        // Remove the tileset
        viewer.scene.primitives.remove(primitive);
        flag = true;
      }
    }
    if (flag) {
      return (response = { status: true, message: "3D tile removed" });
    } else {
      return (response = {
        status: false,
        message: "cannot find 3D tile with passed id",
      });
    }
  } catch (error) {
    console.error(`Error while Removing tileset: ${error}`);
  }
};

tmpl.Tooltip.addCustomDisplay = function (param) {
  mapObj = param.map;
  console.log(param.coordinate);
  latitude = param.coordinate[1];
  longitude = param.coordinate[0];
  // height = param.height !== undefined ? param.height : 1500;
  height = 5;
  htmlContent = param.html;

  console.log("html", htmlContent);
  console.log()
  if (document.getElementById("tooltip")) {
    tmpl.Overlay.settooltipFlagToZero();
    document.getElementById("tooltip").remove();
    mapObj.entities.removeById(31121999);
  }
  // if( document.getElementById("tooltip")){
  //   tmpl.Tooltip.remove(map);
  // }

  //Create a point of interest
  var point = mapObj.entities.add({
    id: 31121999,
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
    point: {
      pixelSize: 1,
      color: Cesium.Color.RED
    }
  });

  //--------------
  var customDisplay = document.createElement('div');
  customDisplay.innerHTML = htmlContent;
  customDisplay.style.position = 'absolute';
  customDisplay.style.width = 'auto';
  customDisplay.setAttribute("id", "tooltip");
  // customDisplay.style.id("tooltip");
  //customDisplay.style.height = '30vh';
  // customDisplay.style.backgroundColor = 'black'; // Set a background color
  // customDisplay.style.padding = '1vh 1vw'; // Adjust padding using viewport units
  // customDisplay.style.borderRadius = '2vh'; // Adjust border radius using viewport units
  // customDisplay.style.boxShadow = '0 0 2vh rgba(0, 0, 0, 0.1)'; // Adjust shadow for depth
  customDisplay.style.color = 'white';
  // customDisplay.style.border = '4px solid #ffffff';
  customDisplay.style.zIndex = '5'; // Ensure it's above the Cesium canvas
  // //--------------

  // // Add an "X" button to close the tooltip
  // var closeButton = document.createElement('button');
  // closeButton.innerHTML = 'x';
  // closeButton.style.position = 'absolute';
  // closeButton.style.top = '0'; // Adjust top using viewport units
  // closeButton.style.right = '0'; // Adjust right using viewport units
  // closeButton.style.padding =  '1vh 1vw';
  // closeButton.style.color = 'white';
  // closeButton.style.backgroundColor = 'transparent';
  // closeButton.style.border = 'none';
  // closeButton.style.cursor = 'pointer';
  // closeButton.addEventListener('click', function () {
  //   // Remove the custom display and the point when the close button is clicked
  //   map.entities.remove(point);
  //   customDisplay.parentNode.removeChild(customDisplay);
  // });

  // customDisplay.appendChild(closeButton);
  mapObj.container.appendChild(customDisplay);

  // Update custom display position when the camera moves
  mapObj.scene.postRender.addEventListener(function () {
    var pointPosition = mapObj.scene.cartesianToCanvasCoordinates(point.position._value);
    if (pointPosition) {
      // customDisplay.style.left = (pointPosition.x - customDisplay.offsetWidth / 2) + 'px';
      // customDisplay.style.top = (pointPosition.y - customDisplay.offsetHeight / 2) + 'px';

      // Calculate left position for bottom center alignment
      var leftPosition = pointPosition.x - customDisplay.offsetWidth / 2;
      // Calculate top position for bottom center alignment
      var topPosition = pointPosition.y - customDisplay.offsetHeight - 20;
      customDisplay.style.left = leftPosition + 'px';
      customDisplay.style.top = topPosition + 'px';
    }
  });

  document.body.style.overflow = 'hidden';
}

hello = function () {
  console.log("hello");
}

demoRiseEvent = function () {
  console.log("alertt")
}


tmpl.Map.showTraffic = function (param) {
  console.log(" ::::  showtraffic :::: param :::", param);
  map = param.map;


  var googleMap = new google.maps.Map(document.getElementById('hidden-google-map'), {
    center: { lat: appConfigInfo.lat, lng: appConfigInfo.lon },
    zoom: appConfigInfo.mapZoom,
    disableDefaultUI: true
  });

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(googleMap);

}


var trackVehicleObjDyn1;
var previousLat;
var previousLon;
var previousTime;

var movingFeature;
var firstTimeMoving;
var trackMapObject;

var track_withLine_vehicle_img;
var track_withLine_route_color;
var track_withLine_route_width;
var track_withLine_Zoom;
var track_withLine_icon_scale;
var track_vehicle_number;
var track_vehicle_type;
var trackLine;
var gbl_vehicleEntity;
var gbl_trackPosition;
var gbl_3DMapObj;
var gbl_lineEntity = [];
var gbl_start_vehicleEntity;
var gbl_end_vehicleEntity;
var gbl_Params;
let vectorLayer;

var tripStartIcon;

gbl_track=[];
let gblViewRectangle;
gblTrackLine=[];
let firstTrack;
tmpl.Track.trackWithLine = function (param) {
  console.log(param);
  if (appConfigInfo.mapDimension == '2D') {

    firstTimeMoving = true;
    // Verify the params

    //Declare the Variables
    // Load the First point0

    this.trackMapObject = param.map
    var map = this.trackMapObject;
    var track_features = param.features;
    track_vehicle_number = param.simNo;
    track_vehicle_type = param.workforceUserId;

    track_withLine_vehicle_img = param.vehicle_img != undefined ? param.vehicle_img : appConfigInfo.mapSDKURL + "2.png";
    track_withLine_route_color = param.route_color != undefined ? param.route_color : '#00FF00';
    track_withLine_route_width = param.route_width != undefined ? param.route_width : 3 ;
    track_withLine_Zoom = param.zoom || appConfigInfo.searchZoom;
    track_withLine_icon_scale = param.icon_scale != undefined ? param.icon_scale : 1;
    track_withLine_initialTime=track_features[0].time;
    track_withLine_initialPlace=track_features[0].place;

    var latitude = track_features[0].lat;
    var longitude = track_features[0].lon;


    previousLon = longitude;
    previousLat = latitude;

    const convertDateFormat = (str) => {
      const [date, time] = str.split(" "); // Split into date and time
      const [year, month, day] = date.split("-"); // Split the date part
      return `${day}-${month}-${year} ${time}`; // Rearrange and combine with time
    };
 
    previousTime = convertDateFormat(track_withLine_initialTime.toString());

    console.log(" ::::: param lat ::::: ", track_features[0].lat);
    console.log(" ::::: param lon ::::: ", track_features[0].lon);
    console.log(" ::::: param id ::::: ", track_features[0].id);
    console.log(" ::::: param label ::::: ", track_features[0].label);

    // Creating the Checkboxes 

    var mapDiv = document.getElementById(globalMapDivID);
    var toggleLayersDiv = document.createElement("div");
    toggleLayersDiv.className = "trackToggleLayers";
    toggleLayersDiv.id = "trackToggleTrackLayers";
    mapDiv.appendChild(toggleLayersDiv);
    toggleLayersDiv.style.position = "absolute";
    toggleLayersDiv.style.display = "flex";
    toggleLayersDiv.style.justifyContent = "center";
    toggleLayersDiv.style.top = "8%";
    toggleLayersDiv.style.right = "10px";
    toggleLayersDiv.style.padding = "5px";
    // toggleLayersDiv.style.width = "25%";
    toggleLayersDiv.style.backgroundColor = "white";
    toggleLayersDiv.style.borderRadius = "5px";
    toggleLayersDiv.style.opacity = "1.0";
    toggleLayersDiv.style.zIndex = "4";

    var routelineCheckbox = document.createElement("input");
    routelineCheckbox.id = "trackcheckrouteline";
    routelineCheckbox.type = "checkbox";
    routelineCheckbox.name = "Route Line";
    routelineCheckbox.value = "Route Line";
    routelineCheckbox.style.margin = "auto";
    routelineCheckbox.style.marginLeft = "10px";
    routelineCheckbox.checked = true;
    toggleLayersDiv.appendChild(routelineCheckbox);
    routelineCheckbox.onclick = routeLinevisibility;
    document.getElementById("trackToggleTrackLayers").append("Route Line");

    var routevehicleCheckbox = document.createElement("input");
    routevehicleCheckbox.id = "trackcheckresource";
    routevehicleCheckbox.type = "checkbox";
    routevehicleCheckbox.name = "Resource";
    routevehicleCheckbox.value = "Resource";
    routevehicleCheckbox.style.margin = "auto";
    routevehicleCheckbox.style.marginLeft = "10px";
    routevehicleCheckbox.checked = true;
    toggleLayersDiv.appendChild(routevehicleCheckbox);
    routevehicleCheckbox.onclick = resourcevisibility;
    document.getElementById("trackToggleTrackLayers").append("Workforce Info");

    var infoCheckbox = document.createElement("input");
    infoCheckbox.id = "trackcheckinfobox";
    infoCheckbox.type = "checkbox";
    infoCheckbox.name = "Infobox";
    infoCheckbox.value = "Infobox";
    infoCheckbox.style.margin = "auto";
    infoCheckbox.style.marginLeft = "10px";
    infoCheckbox.checked = true;
    //toggleLayersDiv.appendChild(infoCheckbox); //@sh disabled
    infoCheckbox.onclick = infoboxvisibility;
    // document.getElementById("trackToggleTrackLayers").append("Info");

    var workforceCheckbox = document.createElement("input");
    workforceCheckbox.id = "workforceTrack";
    workforceCheckbox.type = "checkbox";
    workforceCheckbox.name = "Route Deviation";
    workforceCheckbox.value = "Route Deviation";
    workforceCheckbox.checked = true;
    toggleLayersDiv.appendChild(workforceCheckbox);
    // deviatedpointCheckbox.onclick = routeLinevisibility;
    workforceCheckbox.onclick = toggleInfoTable
    document.getElementById("trackToggleTrackLayers").append("Resource Info");


    var infoTableDiv = document.createElement("div");
    infoTableDiv.className = "trackdataTable";
    infoTableDiv.id = "trackinfoTable";
    mapDiv.appendChild(infoTableDiv);
    var infoTableRowsDiv = document.createElement("div");
    infoTableRowsDiv.className = "rows";
    infoTableDiv.appendChild(infoTableRowsDiv);
    infoTableRowsDiv.innerHTML =
      '<table style="font-size: 14px"><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle No : </td><td id= "trackresourceDiv"></td><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle Type : </td><td id= "trackcallSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Position : </td><td id= "trackpositionDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Speed : </td><td id= "trackspeedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px; ">Location : </td><td id= "tracklocationDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Time : </td><td id="trackdateTimeDiv"></td></tr></table>';

    infoTableDiv.style.position = "absolute";
    infoTableDiv.style.top = "20%";
    infoTableDiv.style.right = "10px";
    infoTableDiv.style.width = "20%";
    infoTableDiv.style.zIndex = "4";

    infoTableRowsDiv.style.position = "relative";
    // infoTableRowsDiv.style.top = "2px";
    // infoTableRowsDiv.style.left = "2px";
    infoTableRowsDiv.style.backgroundColor = "white";
    infoTableRowsDiv.style.opacity = "1.0";
    infoTableRowsDiv.style.borderRadius = "5px";
    infoTableRowsDiv.style.padding = "5px";

    var clearTrack = document.createElement("BUTTON");
    clearTrack.className = "clearTrack";
    clearTrack.innerHTML = '<i class="fa fa-times fa-lg"></i>';
    clearTrack.title = "Clear Track";
    clearTrack.style.marginLeft = "10px";
    clearTrack.style.backgroundColor = "gray";
    clearTrack.style.border = "none";
    clearTrack.style.color = "black";
    // clearTrack.style.padding = "5px 10px";
    clearTrack.style.cursor = "pointer";
    clearTrack.onclick = function () {
      clearTrackRoute();
      clearTrackObjandRemove({map:param.map});
      if (param.callbackFunc) {
        var clearRespnse = {
          track: "stop",
          features: param.features,
          message: "Vehice Trackeing stopped",
        };
        param.callbackFunc(clearRespnse);
      }
    };
    // clearTrack.onmouseenter = function(){clearTrack.style.backgroundColor = "red";}
    // clearTrack.onmouseleave = function(){clearTrack.style.backgroundColor = "#4CAF50";}
    toggleLayersDiv.appendChild(clearTrack);


    // plotting the line

    // var iconFeature = new ol.Feature({
    //   geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
    // });

    var viewProj = map.getView().getProjection().getCode();
    var pointCoords;

    if (viewProj === 'EPSG:3857') {
      pointCoords = ol.proj.fromLonLat([longitude, latitude]);
    } else if (viewProj === 'EPSG:4326') {
      // MDD map – NO transform at all
      pointCoords = [longitude, latitude];
    } else {
      pointCoords = ol.proj.transform(
        [longitude, latitude],
        'EPSG:4326',
        viewProj
      );
    }

    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(pointCoords)
    });

    var iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: track_withLine_vehicle_img,
        scale: track_withLine_icon_scale
      })
    });

    iconFeature.setStyle(iconStyle);

    var vectorSource = new ol.source.Vector({
      features: [iconFeature], // Add both icon and line features to the source
    });

    tripStartIcon = new ol.layer.Vector({
      source: vectorSource,
    });


    tmpl_setMap_layer_global.push({
      layer: tripStartIcon,
      title: 'track_Start_icon',
      visibility: true,
      map: this.trackMapObject
    });

    //map.addLayer(tripStartIcon);

    var startPosition = [longitude, latitude]; // [Longitude, Latitude]

    // Sample ending position: Paris, France
    var endPosition = [longitude, latitude];

    var reqObject= {
      "vheNo":track_vehicle_number,
      "vheType":track_vehicle_type,
      "vhePos":longitude + "," + latitude,
      "vheLoc":track_withLine_initialPlace,
      "vheSpd":"0",
      "vheTime":track_withLine_initialTime
    };

    enqueueAnimation(this.trackMapObject, startPosition, endPosition, track_withLine_vehicle_img,reqObject);

    track_vehicle_number = param.simNo;
    track_vehicle_type = param.workforceUserId;



    // trackDetailsUpdate(
    //   track_vehicle_number,
    //   track_vehicle_type,
    //   longitude + "," + latitude,
    //   null,
    //   null,
    //   null
    // );

    trackDetailsUpdate(
      track_vehicle_number,
      track_vehicle_type,
      longitude + "," + latitude,
      track_withLine_initialPlace,
      null,
      track_withLine_initialTime
    );

    tmpl.Zoom.toXYcustomZoom({
      map: map,
      latitude: latitude,
      longitude: longitude,
      zoom: track_withLine_Zoom,
    });

  } else {
	
    let viewer = param.map;
    gblTrackObj=viewer;
    let modelUrl= param.modelUrl ? param.modelUrl : appConfigInfo.mapSDKURL+"FireFighting.glb";
    
    let icon = param.vehicle_img;
    let routeColor = param.route_color;
    let startPoint = param.features[0];
    let trackZoom = param.zoom != undefined ? param.zoom : 10 ;
    let minPixelSize = param.minPixelSize != undefined ? param.minPixelSize : 64;
    let maxPixelSize = param.maxPixelSize != undefined ? param.maxPixelSize : 64;
    let vehicleNumber = param.data[0].simNo != undefined ? param.data[0].simNo : "N/A";
    let workforceUserId = param.data[0].workforceUserId != undefined ? param.data[0].workforceUserId : "N/A";
    let location = param.data[0].place != undefined ? param.data[0].place : "N/A";
    let trackTime = param.time != undefined ? param.time : "N/A";
    param.positionArray=[];
    param.firstPlay=true;
    
    var mapDiv = document.getElementById(globalMapDivID);
    var toggleLayersDiv = document.createElement("div");
    toggleLayersDiv.className = "trackToggleLayers";
    toggleLayersDiv.id = "trackToggleTrackLayers";
    mapDiv.appendChild(toggleLayersDiv);
    toggleLayersDiv.style.position = "absolute";
    toggleLayersDiv.style.display = "flex";
    toggleLayersDiv.style.justifyContent = "center";
    toggleLayersDiv.style.top = "8%";
    toggleLayersDiv.style.right = "10px";
    toggleLayersDiv.style.padding = "5px";
    // toggleLayersDiv.style.width = "25%";
    toggleLayersDiv.style.backgroundColor = "white";
    toggleLayersDiv.style.borderRadius = "5px";
    toggleLayersDiv.style.opacity = "1.0";
    toggleLayersDiv.style.zIndex = "4";
    
    var routelineCheckbox = document.createElement("input");
    routelineCheckbox.id = "trackcheckrouteline";
    routelineCheckbox.type = "checkbox";
    routelineCheckbox.name = "Route Line";
    routelineCheckbox.value = "Route Line";
    routelineCheckbox.style.margin = "auto";
    routelineCheckbox.style.marginLeft = "10px";
    routelineCheckbox.checked = true;
    toggleLayersDiv.appendChild(routelineCheckbox);
    routelineCheckbox.onclick = routeTrackLinevisibility;
    document.getElementById("trackToggleTrackLayers").append("Route Line");
    
    var routevehicleCheckbox = document.createElement("input");
    routevehicleCheckbox.id = "trackcheckresource";
    routevehicleCheckbox.type = "checkbox";
    routevehicleCheckbox.name = "Resource";
    routevehicleCheckbox.value = "Resource";
    routevehicleCheckbox.style.margin = "auto";
    routevehicleCheckbox.style.marginLeft = "10px";
    routevehicleCheckbox.checked = true;
    toggleLayersDiv.appendChild(routevehicleCheckbox);
    routevehicleCheckbox.onclick = resourceTrackvisibility;
    document.getElementById("trackToggleTrackLayers").append("Workforce Info");
    
    var infoCheckbox = document.createElement("input");
    infoCheckbox.id = "trackcheckinfobox";
    infoCheckbox.type = "checkbox";
    infoCheckbox.name = "Infobox";
    infoCheckbox.value = "Infobox";
    infoCheckbox.style.margin = "auto";
    infoCheckbox.style.marginLeft = "10px";
    infoCheckbox.checked = true;
    //toggleLayersDiv.appendChild(infoCheckbox); //@sh disabled
    infoCheckbox.onclick = infoboxvisibility;
    // document.getElementById("trackToggleTrackLayers").append("Info");
    
    var workforceCheckbox = document.createElement("input");
    workforceCheckbox.id = "workforceTrack";
    workforceCheckbox.type = "checkbox";
    workforceCheckbox.name = "Route Deviation";
    workforceCheckbox.value = "Route Deviation";
    workforceCheckbox.checked = true;
    toggleLayersDiv.appendChild(workforceCheckbox);
    // deviatedpointCheckbox.onclick = routeLinevisibility;
    workforceCheckbox.onclick = toggleTrackInfoTable
    document.getElementById("trackToggleTrackLayers").append("Resource Info");
    
    
    var infoTableDiv = document.createElement("div");
    infoTableDiv.className = "trackdataTable";
    infoTableDiv.id = "trackinfoTable";
    mapDiv.appendChild(infoTableDiv);
    var infoTableRowsDiv = document.createElement("div");
    infoTableRowsDiv.id="trackTableDetailsDiv"
    infoTableRowsDiv.className = "rows";
    infoTableDiv.appendChild(infoTableRowsDiv);
    infoTableRowsDiv.innerHTML =
      '<table style="font-size: 14px"><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle No : </td><td id= "trackresourceDiv"></td><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Vehicle Type : </td><td id= "trackcallSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Position : </td><td id= "trackpositionDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Speed : </td><td id= "trackspeedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px; ">Location : </td><td id= "tracklocationDiv"></td></tr><tr style="border-bottom: 1px solid lightgray;display: block;padding: 5px;"><td style="font-weight:bold;width: 100px;">Time : </td><td id="trackdateTimeDiv"></td></tr></table>';
    
    infoTableDiv.style.position = "absolute";
    infoTableDiv.style.top = "15%";
    infoTableDiv.style.right = "10px";
    infoTableDiv.style.width = "20%";
    infoTableDiv.style.zIndex = "4";
    
    infoTableRowsDiv.style.position = "relative";
    // infoTableRowsDiv.style.top = "2px";
    // infoTableRowsDiv.style.left = "2px";
    infoTableRowsDiv.style.backgroundColor = "white";
    infoTableRowsDiv.style.opacity = "1.0";
    infoTableRowsDiv.style.borderRadius = "5px";
    infoTableRowsDiv.style.padding = "5px";

      let position = Cesium.Cartesian3.fromDegrees(startPoint.lon, startPoint.lat, 0);
      let defaultHPR = new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0);
      let defaultOrientation = Cesium.Transforms.headingPitchRollQuaternion(position, defaultHPR);

      let modelEntity = viewer.entities.add({
      id: 'trackObj',
      name: 'GLB Track Model',
      position: position,
      orientation: defaultOrientation,
      model: {
        uri: modelUrl,
        minimumPixelSize: minPixelSize, 
        maximumScale: maxPixelSize 
      },
      entProp:param
      });
      param.positionArray.push(position);
      // viewer.entities.add(modelEntity);
      gbl_track.push(modelEntity)
    
    //appending values to HTML
    trackresourceDiv.innerHTML = vehicleNumber;
    trackcallSignDiv.innerHTML = workforceUserId;
    trackpositionDiv.innerHTML = ""+startPoint.lat.toFixed(6)+" , "+startPoint.lon.toFixed(6);
    trackspeedDispDiv.innerHTML = 0 +" kmph";
    tracklocationDiv.innerHTML = location;
    trackdateTimeDiv.innerHTML = trackTime;
    

    viewer.scene.camera.setView({
      destination: new  Cesium.Cartesian3.fromDegrees(startPoint.lon, startPoint.lat, 100.0),
      orientation: new Cesium.HeadingPitchRoll(
      0.0,
      -0.41607153839886,
       0.0
      ),
    });
    viewer.scene.camera.moveBackward(1300);

    return "";
  }
}


function enqueueAnimation(map, startPos, endPos, iconSrc,reqObject) {
  // Add the animation request to the queue
  // console.log("req obj in enque",reqObject)
  animationQueue.push({ map, startPos, endPos, iconSrc,reqObject });

  // Process the next animation if not already animating
  if (!isAnimating) {
    processNextAnimation(reqObject);
  }
}

function processNextAnimation(reqObject) {
  if (animationQueue.length > 0) {
    isAnimating = true;
    const request = animationQueue.shift(); // Get the next request from the queue
    // console.log(animationQueue);
    animateMovement(request.map, request.startPos, request.endPos, request.iconSrc, request.reqObject,function () {
      isAnimating = false;
      processNextAnimation(reqObject); // Process the next animation in the queue
    });
  }
}

function formatDate(inputDate) {
  // Define possible input formats
  const formats = [
      "DD-MM-YYYY HH:mm:ss",
      "MM-DD-YYYY HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss",
      "DD/MM/YYYY HH:mm:ss",
      "MM/DD/YYYY HH:mm:ss",
      "YYYY/MM/DD HH:mm:ss"
  ];
 
  // Parse the input with the formats array
  const momentDate = moment(inputDate, formats, true);
 
  // Return the formatted date or an error message
  return momentDate.isValid()
      ? momentDate.format("YYYY-MM-DD HH:mm:ss")
      : "Invalid date";
}




let movingFeatureLayer; // Layer for the moving feature
var pathLayer; // Layer for the path
let pathFeature; // Global reference to the path feature
// let movingFeature; // Global reference to the moving feature
// let firstTimeMoving = true; // Flag to indicate the first time moving
let animationQueue = [];
let isAnimating = false;
let firstTimeAngle = false

function animateMovement(map, startPos, endPos, iconSrc,reqObject, onComplete) {
  // Convert start and end positions from longitude and latitude to map projection
  // let start = ol.proj.fromLonLat(startPos);
  // let end = ol.proj.fromLonLat(endPos);

    let start = projectLonLat(map, startPos[0], startPos[1]);
  let end = projectLonLat(map, endPos[0], endPos[1]);
  // console.log("reqObj",reqObject)
  trackDetailsUpdate(
    reqObject.vheNo,
    reqObject.vheType,
    reqObject.vhePos,
    reqObject.vheLoc,
    reqObject.vheSpd,
    reqObject.vheTime
  );

  if (firstTimeMoving) {
    movingFeature = new ol.Feature(new ol.geom.Point(start));
    firstTimeMoving = false;

    // Apply the icon style to the moving feature
    movingFeature.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        src: iconSrc,
        scale: track_withLine_icon_scale, // Adjust scale as needed
        rotateWithView: false
      })
    }));

    // Initialize the layer for the moving feature
    let movingFeatureSource = new ol.source.Vector({
      features: [movingFeature]
    });

    movingFeatureLayer = new ol.layer.Vector({
      source: movingFeatureSource
    });

    // Add the layer to the map
    map.addLayer(movingFeatureLayer);

    tmpl_setMap_layer_global.push({
      layer: movingFeatureLayer,
      title: 'track_with_line1',
      visibility: true,
      map: this.trackMapObject
    });

  }

  if (!pathLayer) {
    // Initialize the path feature if it doesn't exist
    pathFeature = new ol.Feature(new ol.geom.LineString([start]));

    // Style for the path
    pathFeature.setStyle(new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: track_withLine_route_color, // Assuming the color is defined elsewhere
        width: track_withLine_route_width
      })
    }));

    // Initialize the layer for the path
    let pathSource = new ol.source.Vector({
      features: [pathFeature]
    });

    pathLayer = new ol.layer.Vector({
      source: pathSource
    });

    tmpl_setMap_layer_global.push({
      layer: pathLayer,
      title: 'track_with_line',
      visibility: true,
      map: this.trackMapObject
    });

    // Add the layer to the map
    map.addLayer(pathLayer);
  } else {
    // If the pathLayer already exists, use the last coordinate as the starting point for new movement
    let lastPos = pathFeature.getGeometry().getLastCoordinate();
    start = lastPos; // Update start to continue from the last position
  }

  // Animation
  let startTime = performance.now();
  let duration = 3000; // Duration of animation in milliseconds

  function animate(now) {
    let elapsedTime = now - startTime;
    let fraction = elapsedTime / duration;

    if (fraction > 1) {
      fraction = 1;
    }

    let currentPos = [
      start[0] + (fraction * (end[0] - start[0])),
      start[1] + (fraction * (end[1] - start[1]))
    ];

    // Update the moving feature's position
    movingFeature.setGeometry(new ol.geom.Point(currentPos));

    var angle = rotate({
      x1: start[0],
      y1: start[1],
      x2: end[0],
      y2: end[1],
    });

    // Apply the icon style with calculated rotation to the moving feature
    if(firstTimeAngle){
      movingFeature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
          src: iconSrc,
          scale: track_withLine_icon_scale,
          rotation: angle, // Apply rotation here
          rotateWithView: true // Ensure rotation is view-relative
        })
      }));
    }

    // Extend the line to include the current position
    let pathGeom = pathFeature.getGeometry();
    pathGeom.appendCoordinate(currentPos);

    if (fraction < 1) {
      map.getView().setCenter(currentPos);
      requestAnimationFrame(animate);
    } else {
      map.getView().setCenter(end);
      if (typeof onComplete === 'function') {
        onComplete(); // Signal that the animation has completed
      }

    }
  }
  requestAnimationFrame(animate);
}


globalFirstTrackVariable = false;
tmpl.Track.trackWithLine.prototype = {
  startTrack: function (param) {
    console.log(' ::::: :::::', param);
    if (appConfigInfo.mapDimension == '2D') {
      if(movingFeatureLayer){

        let previousTimeDate =new Date(formatDate(previousTime));
        let paramTimeDate  = new Date(formatDate(param.time));
  
        // console.log("time ---------previousTimeDate--->", previousTimeDate);
        // console.log("time --paramTimeDate---------->", paramTimeDate);
      
        // Check if paramTimeDate is lower than or equal to previousTimeDate
        if (paramTimeDate <= previousTimeDate) {
            console.warn("Packet Time is of Old or the Same", param.time);
            return;
        }        
        if(param.position[0] == previousLon && param.position[1] == previousLat){
          trackDetailsUpdate(
            track_vehicle_number,
            track_vehicle_type,
            param.position[0] + "," + param.position[1],
            param.data[0].place,
            param.data[0].speed,
            param.time
          );
          //Updating the Time if same lat lon
          previousTime=param.time
          return;
        }

        var map = this.trackMapObject;
        firstTimeAngle = true;

        var track_Zoom_level;

        track_Zoom_level = track_withLine_Zoom != undefined ? track_withLine_Zoom : map.getView().getZoom();

        map.getView().setZoom(track_Zoom_level);

        var point = param.position;

        var currentLat = point[1];
        var currentLon = point[0];

        var track_data = param.data;

        var time = param.time;
        var speed = track_data[0].speed;
        var location = track_data[0].place;



        // Sample starting position: London, UK
        var startPosition = [previousLon, previousLat]; // [Longitude, Latitude]

        // Sample ending position: Paris, France
        var endPosition = [currentLon, currentLat]; // [Longitude, Latitude]

        // Duration of the animation in milliseconds (e.g., 10000 for 10 seconds)
        var animationDuration = 10000;

        // trackDetailsUpdate(
        //   track_vehicle_number,
        //   track_vehicle_type,
        //   currentLon + "," + currentLat,
        //   location,
        //   speed,
        //   time
        // );

        var reqObject= {
          "vheNo":track_vehicle_number,
          "vheType":track_vehicle_type,
          "vhePos":currentLon + "," + currentLat,
          "vheLoc":location,
          "vheSpd":speed,
          "vheTime":time
        };


        // Now, call the animateFeatureAndViewWithLine function with the sample payload
        // animateMovement(map, startPosition, endPosition,appConfigInfo.mapSDKURL + "2.png");

        //enqueueAnimation(map, startPosition, endPosition,appConfigInfo.mapSDKURL + "2.png");
        enqueueAnimation(map, startPosition, endPosition, track_withLine_vehicle_img,reqObject);

        previousLat = currentLat;
        previousLon = currentLon;
        previousTime =  param.time;
    
      }
    } else { 
      let viewer = gblTrackObj;
      let iconEntity = viewer.entities.getById('trackObj');
      let nextPosition = param.position;
      let trackTime = param.time;
      let addOnData = param.data[0];
      let routeColor = iconEntity.entProp.route_color;
      const scene = viewer.scene;
      const camera = viewer.camera;
    
      if (firstTrack === undefined) {
        // Compute the view rectangle in WGS84 coordinates
        const viewRectangle = camera.computeViewRectangle(scene.globe.ellipsoid);
        gblViewRectangle = viewRectangle;
      }
      
      let position = Cesium.Cartesian3.fromDegrees(nextPosition[0], nextPosition[1], 0); // Set height to 0
      let positions = iconEntity.entProp.positionArray;
      let lineObj = viewer.entities.getById('trackVheLine');
    
      positions.push(position);
    
      if (positions.length > 1) {
        let prevPosition = positions[positions.length - 2];
    
        let startTime = performance.now();
        let duration = 5000; // 5 seconds for the animation
        let intermediatePoints = 150; // Number of intermediate points for interpolation
    
        let prevCartographic = Cesium.Cartographic.fromCartesian(prevPosition);
        let nextCartographic = Cesium.Cartographic.fromCartesian(position);
    
        let interpolatedCartographics = [];
        for (let i = 0; i <= intermediatePoints; i++) {
          let fraction = i / intermediatePoints;
          let longitude = Cesium.Math.lerp(prevCartographic.longitude, nextCartographic.longitude, fraction);
          let latitude = Cesium.Math.lerp(prevCartographic.latitude, nextCartographic.latitude, fraction);
          interpolatedCartographics.push(new Cesium.Cartographic(longitude, latitude));
        }
    
        function animate() {
          let currentTime = performance.now();
          let elapsedTime = currentTime - startTime;
          let t = Math.min(elapsedTime / duration, 1);
          let index = Math.floor(t * intermediatePoints);
          
          if (index < intermediatePoints) {
            let interpolatedCartographic = interpolatedCartographics[index];
            let interpolatedPosition = Cesium.Cartesian3.fromRadians(
              interpolatedCartographic.longitude,
              interpolatedCartographic.latitude,
              0 // Set height to 0
            );
        
            // Update position
            iconEntity.position = new Cesium.CallbackProperty(function () {
              return interpolatedPosition;
            }, false);
        
            // Calculate heading
            let cartographicPrev = Cesium.Cartographic.fromCartesian(prevPosition);
            let cartographicCurr = Cesium.Cartographic.fromCartesian(interpolatedPosition);
            let deltaLongitude = cartographicCurr.longitude - cartographicPrev.longitude;
            let deltaLatitude = cartographicCurr.latitude - cartographicPrev.latitude;
            let heading = Math.atan2(deltaLongitude, deltaLatitude) - Math.PI / 2; // Adjusting heading by 90 degrees
        
            let pitch = 0; // Assuming no pitch change for simplicity
            let roll = 0; // Assuming no roll change for simplicity
        
            // Smooth interpolation of orientation
            let targetHPR = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            let targetOrientation = Cesium.Transforms.headingPitchRollQuaternion(interpolatedPosition, targetHPR);
            iconEntity.orientation = Cesium.Quaternion.slerp(
              iconEntity.orientation.getValue(Cesium.JulianDate.now()),
              targetOrientation,
              t,
              new Cesium.Quaternion()
            );
        
            requestAnimationFrame(animate);
          } else {
            iconEntity.position = position;
            // Set final orientation based on last segment
            let finalHeading = Math.atan2(
              nextCartographic.longitude - prevCartographic.longitude,
              nextCartographic.latitude - prevCartographic.latitude
            ) - Math.PI / 2;
            iconEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(finalHeading, 0, 0));
          }
        }
        
    
        animate();
    
        if (viewer.entities.getById('trackVheLineM')) {
          viewer.entities.removeById('trackVheLineM');
        }
    
       setTimeout(() => {
        let lineEnt = viewer.entities.add({
          polyline: {
            id: 'trackVheLineM',
            positions: positions,
            width: 5,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.2,
              color: Cesium.Color.fromCssColorString(routeColor)
            }),
            clampToGround: false // Ensure this is false since terrain is disabled
          }
        });

        if (gblTrackLine.length > 1) {
          viewer.entities.removeById(gblTrackLine[0].id);
          gblTrackLine.shift();
        }
    
        gblTrackLine.push(lineEnt);

       }, 3000);
       
       setTimeout(() => {
        viewer.scene.camera.setView({
          destination: new  Cesium.Cartesian3.fromDegrees(nextPosition[0], nextPosition[1], 100.0),
          orientation: new Cesium.HeadingPitchRoll(
          0.0,
          -0.41607153839886,
          0.0
          ),
        });
        viewer.scene.camera.moveBackward(1300);
       }, 4500);
       
      } else {
        positions.push(position);
        iconEntity.position = position;
      }

    
      trackpositionDiv.innerHTML = `${nextPosition[1].toFixed(6)} , ${nextPosition[0].toFixed(6)}`;
      trackspeedDispDiv.innerHTML = parseFloat(addOnData.speed).toFixed(2) +" kmph";
      tracklocationDiv.innerHTML = addOnData.place;
      trackdateTimeDiv.innerHTML = trackTime;
    }
  },
  clearTrack: function (param) {
    if(appConfigInfo.mapDimension == "2D"){
      var map = this.map;
      console.log("clear track map object ===> ", param);
      var callback = param.callbackFunc;
      console.log("callback===> ", callback);
      if (param) {
        clearInterval(track_ivlDraw);
  
        if (track_end_marker_dyn && track_end_marker_dyn.getSource()) {
          track_end_marker_dyn.getSource().clear();
        }
  
        if (track_line_layer_dyn && track_line_layer_dyn.getSource()) {
          track_line_layer_dyn.getSource().clear();
        }
  
        if (pathLayer && pathLayer.getSource()) {
          pathLayer.getSource().clear();
          pathLayer=undefined;
        }
  
        if (movingFeatureLayer && movingFeatureLayer.getSource()) {
          movingFeatureLayer.getSource().clear();
          movingFeatureLayer=undefined;
        }
  
        if (tripStartIcon) {
          tripStartIcon.getSource().clear();
        }
  
        try{
            var tripEntity =  mapObj.entities.getById("trackVhe");
            let ent2=mapObj.entities.getById("trackPath");
            if(tripEntity || ent2){
              mapObj.entities.remove(tripEntity);
              mapObj.entities.remove(ent2);
            }
  
        }catch(exp){
          console.log("error while removing vehicle and path ",exp);
        }
  
        this.layerFlag = false;
        this.markerFlag = false;
        this.first_add_icon = false;
        this.first_time_zoom_flag = false;
        this.previousP = [];
        this.currentP = [];
        this.previous = [];
        this.previousTime = [];
        this.previousData = [];
        firstTimeAngle = false;
  
        this.current_track_flag = false;
        pathLayer = undefined;
  
        // tmpl.Layer.clearData({map: map, layer: 'SkipTrackMarker'});
  
        Element.prototype.remove = function () {
          this.parentElement.removeChild(this);
        };
        NodeList.prototype.remove = HTMLCollection.prototype.remove =
          function () {
            for (var i = this.length - 1; i >= 0; i--) {
              if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
              }
            }
          };
        var infoTable = document.getElementById("trackinfoTable");
        if (infoTable) {
          infoTable.remove();
        }
        var toggleContainer = document.getElementById("trackToggleTrackLayers");
        if (toggleContainer) {
          toggleContainer.remove();
        }
        if (callback) {
          callback();
        }
      } else {
        clearInterval(this.track_ivlDraw);
        // this.track_end_marker.getSource().clear();
        // this.track_line_layer.getSource().clear();
        track_end_marker_dyn.getSource().clear();
        track_line_layer_dyn.getSource().clear();
        this.layerFlag = false;
        this.markerFlag = false;
        this.first_add_icon = false;
        this.first_time_zoom_flag = false;
        this.previousP = [];
        this.currentP = [];
        this.previous = [];
        this.previousTime = [];
        this.previousData = [];
  
        this.current_track_flag = false;
  
        tmpl.Layer.clearData({ map: map, layer: "SkipTrackMarker" });
  
        Element.prototype.remove = function () {
          this.parentElement.removeChild(this);
        };
        NodeList.prototype.remove = HTMLCollection.prototype.remove =
          function () {
            for (var i = this.length - 1; i >= 0; i--) {
              if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
              }
            }
          };
        var infoTable = document.getElementById("trackinfoTable");
        if (infoTable) {
          infoTable.remove();
        }
        var toggleContainer = document.getElementById("trackToggleTrackLayers");
        if (toggleContainer) {
          toggleContainer.remove();
        }
      }
    }else{
      try{
     for(let i=0 ; i<=gblTrackLine.length ; i++){
       gblTrackObj.entities.removeById(gblTrackLine[0].id);
       gblTrackLine.shift();
     }
     gblTrackObj.entities.removeById('trackObj');
     try {
       document.getElementById('trackToggleTrackLayers').remove();
       document.getElementById('trackTableDetailsDiv').remove();
     } catch (error) {
       console.log("error while removing TRACK DIV's")
     }
      }catch(err){
     console.log("error while executing CLEAR TRACK")
      }
   }
  },
  startTrackArr: function (param){
    var map = this.trackMapObject;


      var track_Zoom_level;

      track_Zoom_level = track_withLine_Zoom != undefined ? track_withLine_Zoom : map.getView().getZoom();

      map.getView().setZoom(track_Zoom_level);

      var point = param.position;

      var currentLat = point[1];
      var currentLon = point[0];

      var track_data = param.data;



      var time = param.time;
      var speed = track_data[0].speed;
      



  }
}


function clearTrackObjandRemove(param){
  if(appConfigInfo.mapDimension == "2D"){
      var map = param.map
      console.log("clear track map object ===> ", param);
      var callback = param.callbackFunc;
      console.log("callback===> ", callback);
      if (param) {
        clearInterval(track_ivlDraw);
  
        if (track_end_marker_dyn && track_end_marker_dyn.getSource()) {
          track_end_marker_dyn.getSource().clear();
        }
  
        if (track_line_layer_dyn && track_line_layer_dyn.getSource()) {
          track_line_layer_dyn.getSource().clear();
        }
  
        if (pathLayer && pathLayer.getSource()) {
          pathLayer.getSource().clear();
          pathLayer=undefined;
        }
  
        if (movingFeatureLayer && movingFeatureLayer.getSource()) {
          movingFeatureLayer.getSource().clear();
          movingFeatureLayer=undefined;
        }
  
        if (tripStartIcon) {
          tripStartIcon.getSource().clear();
        }
  
        try{
            var tripEntity =  mapObj.entities.getById("trackVhe");
            let ent2=mapObj.entities.getById("trackPath");
            if(tripEntity || ent2){
              mapObj.entities.remove(tripEntity);
              mapObj.entities.remove(ent2);
            }
  
        }catch(exp){
          console.log("error while removing vehicle and path ",exp);
        }
  
        this.layerFlag = false;
        this.markerFlag = false;
        this.first_add_icon = false;
        this.first_time_zoom_flag = false;
        this.previousP = [];
        this.currentP = [];
        this.previous = [];
        this.previousTime = [];
        this.previousData = [];
        firstTimeAngle = false;
  
        this.current_track_flag = false;
        pathLayer = undefined;
  
        // tmpl.Layer.clearData({map: map, layer: 'SkipTrackMarker'});
  
        Element.prototype.remove = function () {
          this.parentElement.removeChild(this);
        };
        NodeList.prototype.remove = HTMLCollection.prototype.remove =
          function () {
            for (var i = this.length - 1; i >= 0; i--) {
              if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
              }
            }
          };
        var infoTable = document.getElementById("trackinfoTable");
        if (infoTable) {
          infoTable.remove();
        }
        var toggleContainer = document.getElementById("trackToggleTrackLayers");
        if (toggleContainer) {
          toggleContainer.remove();
        }
        if (callback) {
          callback();
        }
      } else {
        clearInterval(this.track_ivlDraw);
        // this.track_end_marker.getSource().clear();
        // this.track_line_layer.getSource().clear();
        track_end_marker_dyn.getSource().clear();
        track_line_layer_dyn.getSource().clear();
        this.layerFlag = false;
        this.markerFlag = false;
        this.first_add_icon = false;
        this.first_time_zoom_flag = false;
        this.previousP = [];
        this.currentP = [];
        this.previous = [];
        this.previousTime = [];
        this.previousData = [];
  
        this.current_track_flag = false;
  
        tmpl.Layer.clearData({ map: map, layer: "SkipTrackMarker" });
  
        Element.prototype.remove = function () {
          this.parentElement.removeChild(this);
        };
        NodeList.prototype.remove = HTMLCollection.prototype.remove =
          function () {
            for (var i = this.length - 1; i >= 0; i--) {
              if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
              }
            }
          };
        var infoTable = document.getElementById("trackinfoTable");
        if (infoTable) {
          infoTable.remove();
        }
        var toggleContainer = document.getElementById("trackToggleTrackLayers");
        if (toggleContainer) {
          toggleContainer.remove();
        }
      }
    }
}


function projectLonLat(map, lon, lat) {
  const code = map.getView().getProjection().getCode();

  if (code === 'EPSG:4326') {
    return [lon, lat];                 // MDD → NO transform
  }

  if (code === 'EPSG:3857') {
    return ol.proj.fromLonLat([lon, lat]);
  }
  return ol.proj.transform([lon, lat], 'EPSG:4326', code);
}


tmpl.Map.getWMSMetaData = function (param) {
  try {
    var gmap = param.map;
    var callBack = param.callbackfunc;



    if (gmap === null || gmap === undefined) {

      return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
    }


    gmap.on('singleclick', function (evt) {
      var coordinate = evt.coordinate;
      var viewResolution = gmap.getView().getResolution();
      var layersCollection = gmap.getLayers();
      var Projection = gmap.getView().getProjection();

      for (var i = 1; i < layersCollection.a.length; i++) {
        var layerID = layersCollection.item(i);
        var url = layerID.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, Projection, { 'INFO_FORMAT': 'application/json' });

        // Fetch feature info using the URL
        fetch(url)
          .then(response => response.json())
          .then(data => {
            // Process the feature information (data)
            callBack(data); // Pass the feature data to the callback
          })
          .catch(error => {
            console.error("Error fetching feature info:", error);
          });
      }
    });
  } catch (error) {
    console.error("Error at tmpl.Map.getWMSMetaData >>> ", error);
  }
}



// tmpl.Google.addTrafficLayer = function (param) {
//   var mapObj = param.map;
//   var flag = param.visible;
//   if (appConfigInfo.mapDimension == '3D') {
//     // Define the trafficImageryProvider outside the if-else block
//     var trafficImageryProvider = new Cesium.UrlTemplateImageryProvider({
//       url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=' + appConfigInfo.googleMapKey
//     });

//     if (flag) {
//       var trafficImageryProvider = new Cesium.UrlTemplateImageryProvider({
//         layer: "traffic",
//         url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=' + appConfigInfo.googleMapKey
//       });
//       // Check if the provider is already added before adding it
//       if (!mapObj.imageryLayers.contains(trafficImageryProvider)) {
//         mapObj.imageryLayers.addImageryProvider(trafficImageryProvider);
//       }
//     } else {
//       try {
//         var toRemoveTraffic = mapObj.imageryLayers._layers[1];
//         mapObj.imageryLayers.remove(toRemoveTraffic, true);
//       } catch (error) {
//         console.log("error inside~~~~", error)
//       }

//     }

//   } else {
//     if (flag) {
//       // Check if the layer is already added before adding it
//       var layers = mapObj.getLayers().getArray();
//       var googleLayerExists = layers.some(layer => layer instanceof ol.layer.Tile && layer.getSource().getUrls()[0].includes('traffic'));

//       if (!googleLayerExists) {
//         const googleTrafficLayer = new ol.layer.Tile({
//           source: new ol.source.XYZ({
//             url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=' + appConfigInfo.googleMapKey
//           })
//         });
//         mapObj.addLayer(googleTrafficLayer);
//       }
//     } else {
//       // Check if the layer exists before removing it
//       var layers = mapObj.getLayers().getArray();
//       var googleLayerIndex = layers.findIndex(layer => layer instanceof ol.layer.Tile && layer.getSource().getUrls()[0].includes('traffic'));

//       if (googleLayerIndex !== -1) {
//         mapObj.removeLayer(layers[googleLayerIndex]);
//       }
//     }

//   }
// }


tmpl.Google.addTrafficLayer = function (param) {
  var mapObj = param.map;
  var flag = param.visible;
  if (appConfigInfo.mapDimension == '3D') {
    // Define the trafficImageryProvider outside the if-else block
    var trafficImageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=' + appConfigInfo.googleMapKey
    });
 
    if (flag) {
      var trafficImageryProvider = new Cesium.UrlTemplateImageryProvider({
        layer:"traffic",
        url: 'https://mt0.google.com/vt/lyrs=h,traffic&hl=en&gl=us&src=app&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:road|element:labels|visibility:off&key=' + appConfigInfo.googleMapKey
      });
      // Check if the provider is already added before adding it
      if (!mapObj.imageryLayers.contains(trafficImageryProvider)) {
        mapObj.imageryLayers.addImageryProvider(trafficImageryProvider);
      }
    } else {
      try {
        var toRemoveTraffic=mapObj.imageryLayers._layers[1];
        mapObj.imageryLayers.remove(toRemoveTraffic,true);
      } catch (error) {
        console.log("error inside~~~~", error)
      }
 
    }
 
  } else {
    if (flag) {
      // Check if the layer is already added before adding it
      var layers = mapObj.getLayers().getArray();
      var googleLayerExists = layers.some(layer => layer instanceof ol.layer.Tile && layer.getSource().getUrls()[0].includes('traffic'));
 
      if (!googleLayerExists) {
        var googleTrafficLayer;
        if(appConfigInfo.mode=="dark"){
          googleTrafficLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'https://mt1.google.com/vt/lyrs=h@221097413,traffic|style=feature:all|element:labels|visibility:off&x={x}&y={y}&z={z}&key=' + appConfigInfo.googleMapKey
            })
          });

          // googleTrafficLayer = new ol.layer.Tile({
          //   source: new ol.source.XYZ({
          //     url:
          //       'https://mt1.google.com/vt/lyrs=m,traffic' +
          //       '&style=feature:poi|visibility:off' +
          //       '&style=feature:administrative|visibility:off' +
          //       '&style=feature:landscape|visibility:off' +
          //       '&x={x}&y={y}&z={z}&key=' + appConfigInfo.googleMapKey
          //   })
          // });
        }else{
          googleTrafficLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'https://mt1.google.com/vt/lyrs=h@221097413,traffic|style=feature:all|element:labels|visibility:off&x={x}&y={y}&z={z}&key=' + appConfigInfo.googleMapKey
            })
          });

          // googleTrafficLayer = new ol.layer.Tile({
          //   source: new ol.source.XYZ({
          //     url:
          //       'https://mt1.google.com/vt/lyrs=m,traffic' +
          //       '&style=feature:poi|visibility:off' +
          //       '&style=feature:administrative|visibility:off' +
          //       '&style=feature:landscape|visibility:off' +
          //       '&x={x}&y={y}&z={z}&key=' + appConfigInfo.googleMapKey
          //   })
          // });
        }
       
        var styledMapType = new google.maps.StyledMapType(
          [
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          { name: "Styled Map" }
        );
        mapObj.addLayer(googleTrafficLayer,styledMapType);
      }
    } else {
      // Check if the layer exists before removing it
      var layers = mapObj.getLayers().getArray();
      var googleLayerIndex = layers.findIndex(layer => layer instanceof ol.layer.Tile && layer.getSource().getUrls()[0].includes('traffic'));
 
      if (googleLayerIndex !== -1) {
        mapObj.removeLayer(layers[googleLayerIndex]);
      }
    }
 
  }
}



// function addPolygonBorderLayer(param) {
//   mapObj=param.map;
//   polygonData=param.polygonGeomData;
//   id=param.id;
//   color=param.color;
//   layerName=param.layer+id;
//   borderWidth=param.borderWidth?param.borderWidth:5;
//   lineDash=param.lineDash?param.lineDash:[5,10];
//   featureDataAry=[];

//   ovrlayPolygon = new ol.layer.Vector({
//     // title: "extraBuff"+layerName,
//     title:layerName,
//     visible: true,
//     source: new ol.source.Vector(),
//   });
//   ovrlayPolygon.setProperties({ lname:layerName });

//   var format = new ol.format.WKT();
//   drawStyle = new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: color,
//       width: borderWidth,
//       lineDash:lineDash,
//       zIndex:1,
//     }),
//   })
//   var feature = format.readFeature(polygonData);
//   feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
//   feature.setStyle(drawStyle);
//   featureDataAry.push(feature);

//   mapObj.addLayer(ovrlayPolygon);
//   existingLayer = ovrlayPolygon;
//   tmpl_setMap_layer_global.push({
//     layer: existingLayer,
//     title: layerName,
//     visibility: true,
//     map: mapObj,
//   });

//   existingLayer.getSource().addFeatures(featureDataAry);

//   var blinkingEntity;
//   // var entityFound=false;
//   var overlays=mapObj.getLayers().getArray();
//   var length=mapObj.getLayers().getArray().length;

//   for(let i=0;i<length;i++){
//     if(overlays[i].U.title==layerName){
//       blinkingEntity=overlays[i];
//       break;
//     }
//   }
//   var flagShow=false;
//   function toggleBlinking(feature) {
//     flagShow=!flagShow;
//     feature.U.visible=flagShow;
//     tmpl.Map.resize({map:mapObj});
//   }

//   var intervalId = setInterval(() => {
//     toggleBlinking(blinkingEntity);
//   }, 500); 
//   return true;
// }





// function addPolygonBorderLayer(param) {
//   var mapObj = param.map;
//   var polygonData = param.polygonGeomData;
//   var id = param.id;
//   var color = param.color;
//   var layerName = param.layer + id;
//   var borderWidth = param.borderWidth ? param.borderWidth : 5;
//   var lineDash = param.lineDash ? param.lineDash : [5, 10];
//   var featureDataAry = [];

//   var ovrlayPolygon = new ol.layer.Vector({
//     title: layerName,
//     visible: true,
//     source: new ol.source.Vector(),
//   });
//   ovrlayPolygon.setProperties({ lname: layerName });

//   var format = new ol.format.WKT();
//   var drawStyle = new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: color,
//       width: borderWidth,
//       lineDash: lineDash,
//       zIndex: 1,
//     }),
//   });
//   var feature = format.readFeature(polygonData);
//   feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
//   feature.setStyle(drawStyle);
//   featureDataAry.push(feature);

//   mapObj.addLayer(ovrlayPolygon);
//   var existingLayer = ovrlayPolygon;

//   tmpl_setMap_layer_global.push({
//     layer: existingLayer,
//     title: layerName,
//     visibility: true,
//     map: mapObj,
//   });

//   existingLayer.getSource().addFeatures(featureDataAry);

//   var blinkingEntity;
//   var overlays = mapObj.getLayers().getArray();
//   var length = mapObj.getLayers().getArray().length;

//   for (let i = 0; i < length; i++) {
//     if (overlays[i].U.title == layerName) {
//       blinkingEntity = overlays[i];
//       break;
//     }
//   }

//   var flagShow = false;
//   var intervalId;

//   function toggleBlinking(feature) {
//     flagShow = !flagShow;
//     feature.U.visible = flagShow;
//     tmpl.Map.resize({ map: mapObj });
//   }

//   function startBlinking() {
//     intervalId = setInterval(() => {
//       toggleBlinking(blinkingEntity);
//     }, 500);
//   }

//   function stopBlinking() {
//     clearInterval(intervalId);
//   }

//   // Start blinking immediately upon calling addPolygonBorderLayer
//   startBlinking();

//   return {
//     startBlinking: startBlinking,
//     stopBlinking: stopBlinking
//   };
// }






// var layers = {}; // Object to store all layers

// function addPolygonBorderLayer(param) {

//   var mapObj = param.map;
//   var polygonData = param.polygonGeomData;
//   var id = param.id;
//   var color = param.color;
//   var layerName = param.layer + id;
//   var borderWidth = param.borderWidth ? param.borderWidth : 5;
//   var lineDash = param.lineDash ? param.lineDash : [5, 10];
//   var featureDataAry = [];

//   var ovrlayPolygon = new ol.layer.Vector({
//     title: layerName,
//     visible: true,
//     source: new ol.source.Vector(),
//   });
//   ovrlayPolygon.setProperties({ lname: layerName });

//   var format = new ol.format.WKT();
//   var drawStyle = new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: color,
//       width: borderWidth,
//       lineDash: lineDash,
//       zIndex: 1,
//     }),
//   });
//   var feature = format.readFeature(polygonData);
//   feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
//   feature.setStyle(drawStyle);
//   featureDataAry.push(feature);

//   mapObj.addLayer(ovrlayPolygon);
//   var existingLayer = ovrlayPolygon;

//   tmpl_setMap_layer_global.push({
//     layer: existingLayer,
//     title: layerName,
//     visibility: true,
//     map: mapObj,
//   });

//   existingLayer.getSource().addFeatures(featureDataAry);

//   var flagShow = false;
//   var intervalId;

//   function toggleBlinking(feature) {
//     flagShow = !flagShow;
//     feature.setVisible(flagShow);
//     tmpl.Map.resize({ map: mapObj });
//   }

//   function startBlinking() {
//     if (!intervalId) {

//       intervalId = setInterval(() => {
//         toggleBlinking(existingLayer);
//       }, 500);
//     }
//   }
//   function stopBlinking() {
//     if (intervalId) {
//       clearInterval(intervalId);
//       intervalId = null;
//     }
//   }

//   // Store layer and interval information in layers object
//   layers[id] = {
//     layer: existingLayer,
//     startBlinking: startBlinking,
//     stopBlinking: stopBlinking
//   };

//   return layers[id];
// }

// //Example usage:
// //Start blinking for layer with ID "1"
// layers["1"].startBlinking();

// // Stop blinking for layer with ID "1"
// layers["1"].stopBlinking();

// // Start blinking for layer with ID "2"
// layers["2"].startBlinking();

// // Stop blinking for layer with ID "2"
// layers["2"].stopBlinking();






// var layers = {}; // Object to store all layers

// function addPolygonBorderLayer(param) {
//   mapObj = param.map;
//   polygonData = param.polygonGeomData;
//   id = param.id;
//   color = param.color;
//   layerName = param.layer + id;
//   borderWidth = param.borderWidth ? param.borderWidth : 5;
//   lineDash = param.lineDash ? param.lineDash : [5, 10];
//   featureDataAry = [];

//   ovrlayPolygon = new ol.layer.Vector({
//     title: layerName,
//     visible: true,
//     source: new ol.source.Vector(),
//   });
//   ovrlayPolygon.setProperties({ lname: layerName });

//   var format = new ol.format.WKT();
//   drawStyle = new ol.style.Style({
//     stroke: new ol.style.Stroke({
//       color: color,
//       width: borderWidth,
//       lineDash: lineDash,
//       zIndex: 1,
//     }),
//   });
//   var feature = format.readFeature(polygonData);
//   feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
//   feature.setStyle(drawStyle);
//   featureDataAry.push(feature);

//   mapObj.addLayer(ovrlayPolygon);
//   existingLayer = ovrlayPolygon;
//   tmpl_setMap_layer_global.push({
//     layer: existingLayer,
//     title: layerName,
//     visibility: true,
//     map: mapObj,
//   });

//   existingLayer.getSource().addFeatures(featureDataAry);

//   var flagShow = false;
//   var intervalId;

//   function toggleBlinking(feature) {
//     flagShow = !flagShow;
//     feature.setVisible(flagShow);
//     tmpl.Map.resize({ map: mapObj });
//   }

//   function startBlinking() {
//     if (!intervalId) {
//       intervalId = setInterval(() => {
//         toggleBlinking(existingLayer);
//       }, 500);
//     }
//   }

//   function stopBlinking() {
//     if (intervalId) {
//       clearInterval(intervalId);
//       intervalId = null;
//     }
//   }

//   // Store layer and interval information in layers object based on ID
//   layers[id] = {
//     layer: existingLayer,
//     startBlinking: startBlinking,
//     stopBlinking: stopBlinking
//   };

//   // Return the layer ID for reference
//   return id;
// }

// // Start blinking the border of a specific layer identified by its ID
// function startBlinkingLayer(layerId) {
//   var layerInfo = layers[layerId];
//   if (layerInfo) {
//     layerInfo.startBlinking();
//   }
// }

// // Stop blinking the border of a specific layer identified by its ID
// function stopBlinkingLayer(layerId) {
//   var layerInfo = layers[layerId];
//   if (layerInfo) {
//     layerInfo.stopBlinking();
//   }
// }



var blinklayers = {}; // Object to store all layers

function addPolygonBorderLayer(param) {

  var id = param.id;
  var mapObj = param.map;
  var polygonData = param.geometry;
  var color = param.color;
  var layerName = param.layer + id;
  var borderWidth = param.borderWidth ? param.borderWidth : 5;
  var lineDash = param.lineDash ? param.lineDash : [5, 10];
  var featureDataAry = [];

  var ovrlayPolygon = new ol.layer.Vector({
    title: layerName,
    visible: true,
    source: new ol.source.Vector(),
  });
  ovrlayPolygon.setProperties({ lname: layerName });

  var format = new ol.format.WKT();
  var drawStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: color,
      width: borderWidth,
      lineDash: lineDash,
      zIndex: 1,
    }),
  });
  var feature = format.readFeature(polygonData);
  feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
  feature.setStyle(drawStyle);
  featureDataAry.push(feature);

  mapObj.addLayer(ovrlayPolygon);
  var existingLayer = ovrlayPolygon;

  tmpl_setMap_layer_global.push({
    layer: existingLayer,
    title: layerName,
    visibility: true,
    map: mapObj,
  });

  existingLayer.getSource().addFeatures(featureDataAry);

  var flagShow = false;
  var intervalId;

  function toggleBlinking(feature) {
    flagShow = !flagShow;
    feature.setVisible(flagShow);
    tmpl.Map.resize({ map: mapObj });
  }

  function startBlinking() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        toggleBlinking(existingLayer);
      }, 500);
    }
  }
  if (param.isBlinkRequired) {
    startBlinking();
  }

  function stopBlinking() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Store layer and interval information in layers object
  blinklayers[id] = {
    blinklayers: existingLayer,
    startBlinking: startBlinking,
    stopBlinking: stopBlinking
  };

  return blinklayers[id];
}

tmpl.Map.getWFSLayerData = function (param) {
  var geoServerLayerName = param.geoserverlayername;
  var handleJson = param.callback;
  var parts = geoServerLayerName.split(':');
  var workSpace = parts[0]; 
  var layernmae = parts[1];
  try {
      
    var gurl = appConfigInfo.geoserverHost  + "/"+workSpace + "/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=" + geoServerLayerName + "&projection=EPSG:4326&outputFormat=json"

    // var gurl = appConfigInfo.wfslayerurl + "?service=WFS&version=1.1.0&request=GetFeature&typeName=" + geoServerLayerName + "&projection=EPSG:4326&outputFormat=json"
    var contentType = "application/x-www-form-urlencoded; charset=utf-8";
    if (window.XDomainRequest) //for IE8,IE9
      contentType = "text/plain";
    $.ajax({
      url: gurl,
      //data:"name=Ravi&age=12",
      type: "GET",
      dataType: "json",
      contentType: contentType,
      success: function (data) {
        handleJson(JSON.stringify(data));

      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("You can not send Cross Domain AJAX requests: " + errorThrown);
      }
    });


  } catch (err) {
    console.error("Error at get WFS layer Data>>> " + err);
  }

}

var mapsingleclick;
tmpl.Map.getWMSMetaData = function (param) {
  try {
    var gmap = param.map;
    var callBack = param.callbackfunc;
    mapsingleclick = gmap.on('singleclick', function (evt) {
      var coordinate = evt.coordinate; //Picks up click coordinates
      var viewResolution = gmap.getView().getResolution(); //Picks up map current resolution
      var layersCollection = gmap.getLayers(); //Creates collection of layers object from layers that have been turned on. 
      var Projection = gmap.getView().getProjection();

      for (var i = 1; i <= ((layersCollection.a.length - 1)); i++) { //Loops through all layers excluding baselayer at index 0 and gets their URL
        var layerID = layersCollection.item(i);
        try {
          var url = layerID.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, Projection, { 'INFO_FORMAT': 'application/json' });
          callBack(url);
        } catch (error) {
          console.log("get url -> ", error);
        }
      }
    });
  } catch (error) {
    console.error("Error at tmpl.Map.getWMSMetaData >>> ", error);
  }
}



tmpl.Map.exportAsPDF = function (param) {
  var mapObj = param.map;
  var fileType = param.filetype;
  var fileName = param.filename;
  var Orientation = param.orientation;
  if(appConfigInfo.mapDimension=='2D'){
    try {
      
      mapObj.once('postcompose', function (event) {
        var canvas = event.context.canvas;
        console.log("~~~~~~~~", canvas);
        
        switch (fileType) {
          case 'png':
            canvas.toBlob(function (blob) {
              saveAs(blob, fileName + '.' + fileType);
            });
            break;
  
          case 'jpeg':
            canvas.toBlob(function (blob) {
              saveAs(blob, fileName + '.' + fileType);
            }, 'image/jpeg', 1);
            break;
  
          case 'pdf':
            var format = 'a4';
            if (Orientation == 'landscape' || Orientation == 'portrait') {
              switch (Orientation) {
                case 'landscape':
                  Orientation = 'l';
                  break;
                case 'portrait':
                  Orientation = 'p';
                  break;
                default:
                  console.warn("Invalid orientation, setting to portrait >>> ");
                  Orientation = 'p';
                  break;
              }
            }
            var pdf = new jsPDF(Orientation, 'mm', format);
            var width = pdf.internal.pageSize.getWidth();
            var height = pdf.internal.pageSize.getHeight();
            const image = canvas.toDataURL('image/png', 1.0);
            pdf.addImage(image, 'PNG', 0, 0, width, height);
            pdf.save(fileName + '.pdf');
            break;
  
          case 'bmp':
            canvas.toBlob(function (blob) {
              saveAs(blob, fileName + '.' + fileType);
            }, 'image/bmp');
            break;
  
          case 'tiff':
            canvas.toBlob(function (blob) {
              // This is a placeholder. Proper TIFF conversion requires a library like tiff.js
              saveAs(blob, fileName + '.' + fileType);
            }, 'image/tiff');
            break;
  
          default:
            console.log("Invalid filetype, type is >>> " + fileType);
            break;
        }
      });
  
      mapObj.renderSync();
  
    } catch (error) {
      console.error(error);
    }
  } else {

    let viewer = param.map;
    let format = param.filetype;

    if (format == 'png' || format == 'jpeg') {
      viewer.render();

      var canvas = viewer.canvas;
      var mimeType = fileName + format;
      var imageUri = canvas.toDataURL(mimeType);

      // Create a link and trigger a download
      var downloadLink = document.createElement('a');
      downloadLink.download = fileName + format;  // Set the filename with the correct format extension
      downloadLink.href = imageUri;  // Set href to the data URL of the image
      document.body.appendChild(downloadLink);  // Add the link to the document
      downloadLink.click();  // Trigger the download
      document.body.removeChild(downloadLink);  // Remove the link after triggering the download
    }else if(format=='bmp' || format =='pdf'){
      var canvas = viewer.canvas;
      canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName + format;
  
        switch(format) {
          case 'pdf':
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function() {
                  var pdf = new jsPDF('landscape');
                  var imgData = reader.result;
                  var imgWidth = pdf.internal.pageSize.getWidth();
                  var imgHeight = pdf.internal.pageSize.getHeight();
                  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                  pdf.save(fileName+'.pdf');
              };
              break;
          case 'bmp':
              canvas.toBlob(function(blob) {
                  saveAs(blob, fileName+'.bmp');
              }, 'image/bmp');
              break;
      }
        // Clean up
        URL.revokeObjectURL(url);
    });
    }else{
      console.log("please pass proper format")
    }
  }
}


tmpl.Map.getZoomLevel = function (param) {
  var map = param.map;
  var mapZoomLevel = param.callback;
  if (appConfigInfo.mapDimension == '2D') {
    var ghostZoom = map.getView().getZoom();
    map.on('moveend', (function () {
      if (ghostZoom != map.getView().getZoom()) {
        ghostZoom = map.getView().getZoom();
        //console.log('zoomend',ghostZoom,map.getView().getZoom());
        if (ghostZoom != undefined) {
          mapZoomLevel(ghostZoom);
        } else {
          var view = gmap.getView();
          view.on('change:resolution', () => {
            var z = view.getZoom();
            if (z != undefined) {
              mapZoomLevel(z);
            }

          })
        }
      }
    }));
  }
}

tmpl.Map.loadGooglePhotorealistic3dTileset= async function(param){
  let viewer=param.map;
  try {
    let tileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
  } catch (error) {
    console.log(`Failed to load tileset: ${error}`);
  }
}


function animateVehiclePackets(param) {
  const viewer = param.map
  viewer.clock.shouldAnimate = false;

  let positionProperty = new Cesium.SampledPositionProperty();


  const vehicleModelUrl = appConfigInfo.mapSDKURL+"GroundVehicle.glb";

  const vehicleEntity = viewer.entities.add({
    position: positionProperty,
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    model: {
      uri: vehicleModelUrl,
      minimumPixelSize: 104,
      maximumScale: 200
    },
    path: {
      show: true,
      leadTime: 0,
      trailTime: 60,
      width: 3,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        color: Cesium.Color.RED
      })
    }
  });

  data2 = param.data;
  dataPoints = [];
  for (var i = 0; i < data2.length; i++) {
    // console.log("param.data~~~~", data2[i]);
    if (data2[i - 1]) {
      if (
        data2[i - 1].lat == data2[i].lat &&
        data2[i - 1].lon == data2[i].lon &&
        data2[i - 1].lat < data2[i].lat &&
        data2[i - 1].lon < data2[i].lon
      ) {
        console.log("Duplicate Found", data2[i]);
      } else {
        dataPoints.push(data2[i - 1]);
        if (i == data2.length - 1) {
          dataPoints.push(data2[i]);
        }
      }
    }
  }
//dataPoints = [{"lat":0.000, "lon":0.544},{"lat":0.000, "lon":0.544}]
  dataPoints.forEach(point => {

    var poi = Cesium.Cartographic.fromDegrees(point.lon, point.lat);

    var height;
    Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi]).then(function (updatedPositions) {
      height = updatedPositions[0].height;

      const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height);
      var poiTime=point.date+'T'+point.time+'Z';
      const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
      positionProperty.addSample(time, position);

    })
    // const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height);
    // const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
    // positionProperty.addSample(time, position);

  });

  // Adjust the viewer's clock to span the animation
  var packetStartTime = dataPoints[0].date + 'T' + dataPoints[0].time + 'Z';
  var packetDataLength = dataPoints.length - 1;
  var packetEndTime = dataPoints[packetDataLength].date + 'T' + dataPoints[packetDataLength].time + 'Z';
  viewer.clock.startTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[0].datetime));
  viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[packetDataLength].datetime));
  viewer.clock.currentTime = viewer.clock.startTime.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
  viewer.clock.multiplier = 10; // Adjust for speed of the animation

  // Optionally set the viewer to track the loaded vehicle entity
  viewer.trackedEntity = vehicleEntity;

  let index = 0;
  function playAnimation() {
    // Clear and reinitialize the position samples
    positionProperty = new Cesium.SampledPositionProperty(); // Create a new property for clean start

    // Repopulate the positionProperty with all data points
    dataPoints.forEach(point => {

      var poi1 = Cesium.Cartographic.fromDegrees(point.lon, point.lat);

      var height1;
      Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi1]).then(function (updatedPositions) {
        height1 = updatedPositions[0].height;

        const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height1);
        var pckTime = point.date + 'T' + point.time + 'Z';
        const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
        positionProperty.addSample(time, position);

      })
      // const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height1);
      // const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
      // positionProperty.addSample(time, position);

    });

    // Reassign the newly filled positionProperty to the vehicle entity
    vehicleEntity.position = positionProperty;
    vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);
    vehicleEntity.path.show = true; // Ensure the path is visible

    viewer.clock.shouldAnimate = true;  // Start the animation
    // viewer.trackedEntity = vehicleEntity; // Optionally start tracking the vehicle again

    // Ensure the scene updates
    viewer.scene.requestRender();
    var scene = viewer.scene;
    var camera = viewer.camera;

    // viewer.scene.preRender.addEventListener(function (scene, time) {
    //   var position = positionProperty.getValue(time);
    //   if (position) {
    //     // Adjust the camera to look at the vehicle from a fixed distance and angle
    //     var offset = new Cesium.Cartesian3(0, -500, 500); // Adjust these values as needed
    //     var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //     camera.lookAtTransform(transform, offset);
    //   }
    // });
  }

  function pauseAnimation() {
    viewer.clock.shouldAnimate = false; // Pause the animation
  }

  function stopAnimation() {
    index = 0;
    viewer.clock.shouldAnimate = false;
    viewer.clock.currentTime = viewer.clock.startTime; // Reset the time to the start
    isBtnStopped = true;
    // Clear the SampledPositionProperty and re-add only the first data point
    positionProperty = new Cesium.SampledPositionProperty();
    const startDataPoint = dataPoints[0];

    var poi2 = Cesium.Cartographic.fromDegrees(startDataPoint.lon, startDataPoint.lat);

    var height2;
    Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi2]).then(function(updatedPositions) {
      height2 = updatedPositions[0].height;

      const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, height2);
      const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
      positionProperty.addSample(startTime, startPosition);
    })

    // const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, height2);
    // const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
    // positionProperty.addSample(startTime, startPosition);

    // Reset the vehicle's position and orientation
    vehicleEntity.position = positionProperty;
    vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);

    // Hide the path
    vehicleEntity.path.show = false;

    // Optional: Reset the camera view
    viewer.trackedEntity = undefined;
    viewer.scene.requestRender();
  }


  // Request the viewer to render the scene
  viewer.scene.requestRender();

  var mapDiv = document.getElementById("mapDiv1");
  mapDiv.style.position = 'relative'; // Ensure mapDiv is positioned
  mapDiv.style.display = 'flex'; // Set display to flex to center the child div
  mapDiv.style.justifyContent = 'center'; // Center horizontally
  mapDiv.style.alignItems = 'center'; // Center vertically

  var toggleLayersDiv = document.createElement("div");
  toggleLayersDiv.className = "toggleLayers";
  toggleLayersDiv.id = "toggleTrackLayers";
  //var mapDiv = document.getElementById(globalMapDivID);
  mapDiv.appendChild(toggleLayersDiv);
  // document.body.appendChild(toggleLayersDiv);
  toggleLayersDiv.style.position = "absolute";
  toggleLayersDiv.style.display = "flex";
  toggleLayersDiv.style.justifyContent = "center";
  toggleLayersDiv.style.top = "8%";
  toggleLayersDiv.style.right = "10px";
  toggleLayersDiv.style.width = "22%";
  toggleLayersDiv.style.backgroundColor = "cornsilk";
  toggleLayersDiv.style.borderRadius = "5px";
  toggleLayersDiv.style.opacity = "0.8";
  toggleLayersDiv.style.zIndex = "4";
  var routelineCheckbox = document.createElement("input");
  routelineCheckbox.id = "checkrouteline";
  routelineCheckbox.type = "checkbox";
  routelineCheckbox.name = "Route Line";
  routelineCheckbox.value = "Route Line";
  routelineCheckbox.checked = true;
  toggleLayersDiv.appendChild(routelineCheckbox);
  // routelineCheckbox.onclick = routeLinevisibility;
  document.getElementById("toggleTrackLayers").append("Route Line");

  var routevehicleCheckbox = document.createElement("input");
  routevehicleCheckbox.id = "checkresource";
  routevehicleCheckbox.type = "checkbox";
  routevehicleCheckbox.name = "Resource";
  routevehicleCheckbox.value = "Resource";
  routevehicleCheckbox.checked = true;
  toggleLayersDiv.appendChild(routevehicleCheckbox);
  // routevehicleCheckbox.onclick = resourcevisibility;
  document.getElementById("toggleTrackLayers").append("Resource");

  var infoCheckbox = document.createElement("input");
  infoCheckbox.id = "checkinfobox";
  infoCheckbox.type = "checkbox";
  infoCheckbox.name = "Infobox";
  infoCheckbox.value = "Infobox";
  infoCheckbox.checked = false; //@Sh by default is false
  toggleLayersDiv.appendChild(infoCheckbox);
  //infoCheckbox.onclick = infoboxvisibility;
  document.getElementById("toggleTrackLayers").append("Infobox");

  var deviatedpointCheckbox = document.createElement("input");
  deviatedpointCheckbox.id = "checkdeviatedpoint";
  deviatedpointCheckbox.type = "checkbox";
  deviatedpointCheckbox.name = "Route Deviation";
  deviatedpointCheckbox.value = "Route Deviation";
  deviatedpointCheckbox.checked = false;
  toggleLayersDiv.appendChild(deviatedpointCheckbox);
  // deviatedpointCheckbox.onclick = routeLinevisibility;
  document.getElementById("toggleTrackLayers").append("Route Deviation");

  routelineCheckbox.addEventListener('change', function () {
    if (this.checked) {
      checkLine = true;
      console.log('Checkbox is checked');
      gbl_lineEntity.forEach(element => {
        map.entities.add(element);
      });
    } else {
      checkLine = false;
      console.log('Checkbox is not checked');
      gbl_lineEntity.forEach(element => {
        map.entities.remove(element);
      });
    }
  });

  routevehicleCheckbox.addEventListener('change', function () {
    if (this.checked) {
      map.entities.add(vehicleEntity);
    } else {
      map.entities.remove(vehicleEntity);
    }
  });

  var infoTableDiv = document.createElement("div");
  infoTableDiv.className = "dataTable";
  infoTableDiv.id = "infoTable";
  // document.body.appendChild(infoTableDiv);
  mapDiv.appendChild(infoTableDiv);
  var infoTableRowsDiv = document.createElement("div");
  infoTableRowsDiv.className = "rows";
  infoTableDiv.appendChild(infoTableRowsDiv);

  infoTableRowsDiv.innerHTML =
    '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';

  var trackresourceDivv = document.getElementById('trackresourceDiv');
  var trackcallSignDiv = document.getElementById('trackcallSignDiv');

  // var vehicleNo = param.vehicleData.vehicleNumber;
  // var vehicleType = param.vehicleData.vehicleType;


  infoTableDiv.style.position = "absolute";
  infoTableDiv.style.top = "20%";
  infoTableDiv.style.right = "10px";
  infoTableDiv.style.width = "20%";
  infoTableDiv.style.zIndex = "4";
  infoTableDiv.style.visibility = "hidden"; //@sh disabled

  infoTableRowsDiv.style.position = "relative";
  infoTableRowsDiv.style.top = "2px";
  infoTableRowsDiv.style.left = "2px";
  infoTableRowsDiv.style.backgroundColor = "white";
  infoTableRowsDiv.style.opacity = "1";
  infoTableRowsDiv.style.borderRadius = "5px";

  infoCheckbox.addEventListener('change', function () {
    if (this.checked == false) {
      document.getElementById("infoTable").style.visibility = "hidden";
    } else {
      document.getElementById("infoTable").style.visibility = "visible";
    }
  });


  var mapControls = document.createElement("div");
  mapControls.className = "mapControls";
  mapControls.id = "controlButtons";
  mapControls.style.position = 'absolute';
  mapControls.style.bottom = '10px';
  mapControls.style.zIndex = '100';
  mapControls.style.display = 'flex';
  mapControls.style.gap = '10px';
  mapControls.style.padding = '10px'; // Padding around buttons
  mapControls.style.border = '4px double #ffffff'; // White border
  mapControls.style.borderRadius = '20px'; // Rounded corners for the capsule effect
  mapControls.style.background = '#000000'; // Black background

  mapDiv.appendChild(mapControls);

  var playBut = document.createElement("button");
  var pausBut = document.createElement("button");
  var stopBut = document.createElement("button");

  playBut.id = "playButton";
  pausBut.id = "pauseButton";
  stopBut.id = "stopButton";

  playBut.className = pausBut.className = stopBut.className = "tripControlbtn";
  playBut.style.padding = pausBut.style.padding = stopBut.style.padding = '5px 10px';
  playBut.style.background = pausBut.style.background = stopBut.style.background = '#0000ff'; // Blue by default
  playBut.style.border = pausBut.style.border = stopBut.style.border = '1px solid #ccc';
  playBut.style.borderRadius = pausBut.style.borderRadius = stopBut.style.borderRadius = '4px';
  playBut.style.cursor = pausBut.style.cursor = stopBut.style.cursor = 'pointer';
  playBut.style.outline = pausBut.style.outline = stopBut.style.outline = 'none';

  playBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'play.png" style="width: 20px; height: 20px;">';
  playBut.title = "Play";
  pausBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'pause.png" style="width: 20px; height: 20px;">';
  pausBut.title = "Pause";
  stopBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'stop.png" style="width: 20px; height: 20px;">';
  stopBut.title = "Stop";

  mapControls.appendChild(playBut);
  mapControls.appendChild(pausBut);
  mapControls.appendChild(stopBut);

  // Function to reset all buttons to default color
  function resetButtonColors() {
    playBut.style.background = '#0000ff'; // Blue
    pausBut.style.background = '#0000ff'; // Blue
    stopBut.style.background = '#0000ff'; // Blue
  }

  // Event listeners for buttons
  playBut.addEventListener('click', function () {
    resetButtonColors();
    playBut.style.background = '#ff0000'; // Red
  });

  pausBut.addEventListener('click', function () {
    resetButtonColors();
    pausBut.style.background = '#ff0000'; // Red
  });

  stopBut.addEventListener('click', function () {
    resetButtonColors();
    stopBut.style.background = '#ff0000'; // Red
  });

  document.getElementById('playButton').addEventListener('click', playAnimation);
  document.getElementById('pauseButton').addEventListener('click', pauseAnimation);
  document.getElementById('stopButton').addEventListener('click', stopAnimation);
}


function toISO8601(dateStr) {
  var date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 19) + "Z";
}

function animateVehiclePacketsWithNoTerrain(param) {
  const viewer = param.map
  viewer.clock.shouldAnimate = false;

  let positionProperty = new Cesium.SampledPositionProperty();


  const vehicleModelUrl = appConfigInfo.mapSDKURL+"GroundVehicle.glb";

  const vehicleEntity = viewer.entities.add({
    position: positionProperty,
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    model: {
      uri: vehicleModelUrl,
      minimumPixelSize: 104,
      maximumScale: 200
    },
    path: {
      show: true,
      leadTime: 0,
      trailTime: 60,
      width: 3,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        color: Cesium.Color.RED
      })
    }
  });

  data2 = param.data;
  dataPoints = [];
  for (var i = 0; i < data2.length; i++) {
    // console.log("param.data~~~~", data2[i]);
    if (data2[i - 1]) {
      if (
        data2[i - 1].lat == data2[i].lat &&
        data2[i - 1].lon == data2[i].lon &&
        data2[i - 1].lat < data2[i].lat &&
        data2[i - 1].lon < data2[i].lon
      ) {
        console.log("Duplicate Found", data2[i]);
      } else {
        dataPoints.push(data2[i - 1]);
        if (i == data2.length - 1) {
          dataPoints.push(data2[i]);
        }
      }
    }
  }

  dataPoints.forEach(point => {

    // var poi = Cesium.Cartographic.fromDegrees(point.lon, point.lat);

    // var height;
    // Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi]).then(function (updatedPositions) {
    //   height = updatedPositions[0].height;

    //   const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height);
    //   var poiTime=point.date+'T'+point.time+'Z';
    //   const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
    //   positionProperty.addSample(time, position);

    // })
    const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0);
    const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
    positionProperty.addSample(time, position);

  });

  // Adjust the viewer's clock to span the animation
  var packetStartTime = dataPoints[0].date + 'T' + dataPoints[0].time + 'Z';
  var packetDataLength = dataPoints.length - 1;
  var packetEndTime = dataPoints[packetDataLength].date + 'T' + dataPoints[packetDataLength].time + 'Z';
  viewer.clock.startTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[0].datetime));
  viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(toISO8601(dataPoints[packetDataLength].datetime));
  viewer.clock.currentTime = viewer.clock.startTime.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // Loop at the end
  viewer.clock.multiplier = 10; // Adjust for speed of the animation

  // Optionally set the viewer to track the loaded vehicle entity
  viewer.trackedEntity = vehicleEntity;

  let index = 0;
  function playAnimation() {
    // Clear and reinitialize the position samples
    positionProperty = new Cesium.SampledPositionProperty(); // Create a new property for clean start

    // Repopulate the positionProperty with all data points
    dataPoints.forEach(point => {

      // var poi1 = Cesium.Cartographic.fromDegrees(point.lon, point.lat);

      // var height1;
      // Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi1]).then(function (updatedPositions) {
      //   height1 = updatedPositions[0].height;

      //   const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, height1);
      //   var pckTime = point.date + 'T' + point.time + 'Z';
      //   const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
      //   positionProperty.addSample(time, position);

      // })
      const position = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 0);
      const time = Cesium.JulianDate.fromIso8601(toISO8601(point.datetime));
      positionProperty.addSample(time, position);

    });

    // Reassign the newly filled positionProperty to the vehicle entity
    vehicleEntity.position = positionProperty;
    vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);
    vehicleEntity.path.show = true; // Ensure the path is visible

    viewer.clock.shouldAnimate = true;  // Start the animation
    // viewer.trackedEntity = vehicleEntity; // Optionally start tracking the vehicle again

    // Ensure the scene updates
    viewer.scene.requestRender();
    var scene = viewer.scene;
    var camera = viewer.camera;

    // viewer.scene.preRender.addEventListener(function (scene, time) {
    //   var position = positionProperty.getValue(time);
    //   if (position) {
    //     // Adjust the camera to look at the vehicle from a fixed distance and angle
    //     var offset = new Cesium.Cartesian3(0, -500, 500); // Adjust these values as needed
    //     var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //     camera.lookAtTransform(transform, offset);
    //   }
    // });
  }

  function pauseAnimation() {
    viewer.clock.shouldAnimate = false; // Pause the animation
  }

  function stopAnimation() {
    index = 0;
    viewer.clock.shouldAnimate = false;
    viewer.clock.currentTime = viewer.clock.startTime; // Reset the time to the start
    isBtnStopped = true;
    // Clear the SampledPositionProperty and re-add only the first data point
    positionProperty = new Cesium.SampledPositionProperty();
    const startDataPoint = dataPoints[0];

    // var poi2 = Cesium.Cartographic.fromDegrees(startDataPoint.lon, startDataPoint.lat);

    // var height2;
    // Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [poi2]).then(function(updatedPositions) {
    //   height2 = updatedPositions[0].height;

    //   const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, height2);
    //   const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
    //   positionProperty.addSample(startTime, startPosition);
    // })

    const startPosition = Cesium.Cartesian3.fromDegrees(startDataPoint.lon, startDataPoint.lat, 0);
    const startTime = Cesium.JulianDate.fromIso8601(toISO8601(startDataPoint.datetime));
    positionProperty.addSample(startTime, startPosition);

    // Reset the vehicle's position and orientation
    vehicleEntity.position = positionProperty;
    vehicleEntity.orientation = new Cesium.VelocityOrientationProperty(positionProperty);

    // Hide the path
    vehicleEntity.path.show = false;

    // Optional: Reset the camera view
    viewer.trackedEntity = undefined;
    viewer.scene.requestRender();
  }


  // Request the viewer to render the scene
  viewer.scene.requestRender();

  var mapDiv = document.getElementById("mapDiv1");
  mapDiv.style.position = 'relative'; // Ensure mapDiv is positioned
  mapDiv.style.display = 'flex'; // Set display to flex to center the child div
  mapDiv.style.justifyContent = 'center'; // Center horizontally
  mapDiv.style.alignItems = 'center'; // Center vertically

  var toggleLayersDiv = document.createElement("div");
  toggleLayersDiv.className = "toggleLayers";
  toggleLayersDiv.id = "toggleTrackLayers";
  //var mapDiv = document.getElementById(globalMapDivID);
  mapDiv.appendChild(toggleLayersDiv);
  // document.body.appendChild(toggleLayersDiv);
  toggleLayersDiv.style.position = "absolute";
  toggleLayersDiv.style.display = "flex";
  toggleLayersDiv.style.justifyContent = "center";
  toggleLayersDiv.style.top = "8%";
  toggleLayersDiv.style.right = "10px";
  toggleLayersDiv.style.width = "22%";
  toggleLayersDiv.style.backgroundColor = "cornsilk";
  toggleLayersDiv.style.borderRadius = "5px";
  toggleLayersDiv.style.opacity = "0.8";
  toggleLayersDiv.style.zIndex = "4";
  var routelineCheckbox = document.createElement("input");
  routelineCheckbox.id = "checkrouteline";
  routelineCheckbox.type = "checkbox";
  routelineCheckbox.name = "Route Line";
  routelineCheckbox.value = "Route Line";
  routelineCheckbox.checked = true;
  toggleLayersDiv.appendChild(routelineCheckbox);
  // routelineCheckbox.onclick = routeLinevisibility;
  document.getElementById("toggleTrackLayers").append("Route Line");

  var routevehicleCheckbox = document.createElement("input");
  routevehicleCheckbox.id = "checkresource";
  routevehicleCheckbox.type = "checkbox";
  routevehicleCheckbox.name = "Resource";
  routevehicleCheckbox.value = "Resource";
  routevehicleCheckbox.checked = true;
  toggleLayersDiv.appendChild(routevehicleCheckbox);
  // routevehicleCheckbox.onclick = resourcevisibility;
  document.getElementById("toggleTrackLayers").append("Resource");

  var infoCheckbox = document.createElement("input");
  infoCheckbox.id = "checkinfobox";
  infoCheckbox.type = "checkbox";
  infoCheckbox.name = "Infobox";
  infoCheckbox.value = "Infobox";
  infoCheckbox.checked = false; //@Sh by default is false
  toggleLayersDiv.appendChild(infoCheckbox);
  //infoCheckbox.onclick = infoboxvisibility;
  document.getElementById("toggleTrackLayers").append("Infobox");

  var deviatedpointCheckbox = document.createElement("input");
  deviatedpointCheckbox.id = "checkdeviatedpoint";
  deviatedpointCheckbox.type = "checkbox";
  deviatedpointCheckbox.name = "Route Deviation";
  deviatedpointCheckbox.value = "Route Deviation";
  deviatedpointCheckbox.checked = false;
  toggleLayersDiv.appendChild(deviatedpointCheckbox);
  // deviatedpointCheckbox.onclick = routeLinevisibility;
  document.getElementById("toggleTrackLayers").append("Route Deviation");

  routelineCheckbox.addEventListener('change', function () {
    if (this.checked) {
      checkLine = true;
      console.log('Checkbox is checked');
      gbl_lineEntity.forEach(element => {
        map.entities.add(element);
      });
    } else {
      checkLine = false;
      console.log('Checkbox is not checked');
      gbl_lineEntity.forEach(element => {
        map.entities.remove(element);
      });
    }
  });

  routevehicleCheckbox.addEventListener('change', function () {
    if (this.checked) {
      map.entities.add(vehicleEntity);
    } else {
      map.entities.remove(vehicleEntity);
    }
  });

  var infoTableDiv = document.createElement("div");
  infoTableDiv.className = "dataTable";
  infoTableDiv.id = "infoTable";
  // document.body.appendChild(infoTableDiv);
  mapDiv.appendChild(infoTableDiv);
  var infoTableRowsDiv = document.createElement("div");
  infoTableRowsDiv.className = "rows";
  infoTableDiv.appendChild(infoTableRowsDiv);

  infoTableRowsDiv.innerHTML =
    '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';

  var trackresourceDivv = document.getElementById('trackresourceDiv');
  var trackcallSignDiv = document.getElementById('trackcallSignDiv');

  // var vehicleNo = param.vehicleData.vehicleNumber;
  // var vehicleType = param.vehicleData.vehicleType;


  infoTableDiv.style.position = "absolute";
  infoTableDiv.style.top = "20%";
  infoTableDiv.style.right = "10px";
  infoTableDiv.style.width = "20%";
  infoTableDiv.style.zIndex = "4";
  infoTableDiv.style.visibility = "hidden"; //@sh disabled

  infoTableRowsDiv.style.position = "relative";
  infoTableRowsDiv.style.top = "2px";
  infoTableRowsDiv.style.left = "2px";
  infoTableRowsDiv.style.backgroundColor = "white";
  infoTableRowsDiv.style.opacity = "1";
  infoTableRowsDiv.style.borderRadius = "5px";

  infoCheckbox.addEventListener('change', function () {
    if (this.checked == false) {
      document.getElementById("infoTable").style.visibility = "hidden";
    } else {
      document.getElementById("infoTable").style.visibility = "visible";
    }
  });


  var mapControls = document.createElement("div");
  mapControls.className = "mapControls";
  mapControls.id = "controlButtons";
  mapControls.style.position = 'absolute';
  mapControls.style.bottom = '10px';
  mapControls.style.zIndex = '100';
  mapControls.style.display = 'flex';
  mapControls.style.gap = '10px';
  mapControls.style.padding = '10px'; // Padding around buttons
  mapControls.style.border = '4px double #ffffff'; // White border
  mapControls.style.borderRadius = '20px'; // Rounded corners for the capsule effect
  mapControls.style.background = '#000000'; // Black background

  mapDiv.appendChild(mapControls);

  var playBut = document.createElement("button");
  var pausBut = document.createElement("button");
  var stopBut = document.createElement("button");

  playBut.id = "playButton";
  pausBut.id = "pauseButton";
  stopBut.id = "stopButton";

  playBut.className = pausBut.className = stopBut.className = "tripControlbtn";
  playBut.style.padding = pausBut.style.padding = stopBut.style.padding = '5px 10px';
  playBut.style.background = pausBut.style.background = stopBut.style.background = '#0000ff'; // Blue by default
  playBut.style.border = pausBut.style.border = stopBut.style.border = '1px solid #ccc';
  playBut.style.borderRadius = pausBut.style.borderRadius = stopBut.style.borderRadius = '4px';
  playBut.style.cursor = pausBut.style.cursor = stopBut.style.cursor = 'pointer';
  playBut.style.outline = pausBut.style.outline = stopBut.style.outline = 'none';

  playBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'play.png" style="width: 20px; height: 20px;">';
  playBut.title = "Play";
  pausBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'pause.png" style="width: 20px; height: 20px;">';
  pausBut.title = "Pause";
  stopBut.innerHTML = '<img src="' + appConfigInfo.mapSDKURL + 'stop.png" style="width: 20px; height: 20px;">';
  stopBut.title = "Stop";

  mapControls.appendChild(playBut);
  mapControls.appendChild(pausBut);
  mapControls.appendChild(stopBut);

  // Function to reset all buttons to default color
  function resetButtonColors() {
    playBut.style.background = '#0000ff'; // Blue
    pausBut.style.background = '#0000ff'; // Blue
    stopBut.style.background = '#0000ff'; // Blue
  }

  // Event listeners for buttons
  playBut.addEventListener('click', function () {
    resetButtonColors();
    playBut.style.background = '#ff0000'; // Red
  });

  pausBut.addEventListener('click', function () {
    resetButtonColors();
    pausBut.style.background = '#ff0000'; // Red
  });

  stopBut.addEventListener('click', function () {
    resetButtonColors();
    stopBut.style.background = '#ff0000'; // Red
  });

  document.getElementById('playButton').addEventListener('click', playAnimation);
  document.getElementById('pauseButton').addEventListener('click', pauseAnimation);
  document.getElementById('stopButton').addEventListener('click', stopAnimation);
}




function toggleTrackInfoTable() {
  var toggleCheckbox = document.getElementById('workforceTrack');
  var infoTableDiv = document.getElementById('trackinfoTable');
  if (toggleCheckbox.checked == true) {
    infoTableDiv.style.display = 'block';
  } else {
    infoTableDiv.style.display = 'none';
  }
}

function routeTrackLinevisibility() {
  try {
    var checkStatus = document.getElementById("trackcheckrouteline").checked;
    for(let i=0 ; i<2 ; i++){
      gblTrackObj.entities.getById(gblTrackLine[i].id).show = checkStatus
    }   
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

function resourceTrackvisibility() {
  try {
    var checkStatus = document.getElementById("trackcheckresource").checked;
    gblTrackObj.entities.getById('trackObj').show=checkStatus;
  } catch (err) {
    // console.log(trackVehicleObjDyn);
    console.error(err);
  }
}

tmpl.Zoom.toEntityWithTerrain = function(param){
  let viewer = param.map;
  let coords = param.position;
  let scene = viewer.scene;
  let camera = viewer.camera;

  let currentCameraPosition = camera.positionWC;
  // let cameraHeight = Cesium.Cartographic.fromCartesian(currentCameraPosition).height;
  let cameraHeading = camera.heading;
  let cameraPitch = camera.pitch;
  let cameraRoll = camera.roll;

  let destination = Cesium.Cartesian3.fromDegrees(coords[0], coords[1], 0);
  let offset = new Cesium.Cartesian3(0.0, 0.0, cameraHeight);
  let centerDestination = Cesium.Cartesian3.add(destination, offset, new Cesium.Cartesian3());

  viewer.camera.flyTo({
    destination: destination,
    orientation: {
      heading: cameraHeading,
      pitch: cameraPitch,
      roll: cameraRoll,
    },
    duration: 2.0, 
  });
}

async function getGrassRoute(param){
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

  let routePoints=[];

  let firstPoint = `${source[1]},${source[0]}`;
  let lastPoint =  `${destination[1]},${destination[0]}`;

  routePoints.push(firstPoint);
  waypoints.forEach(point=>{
    helperObj =`${point.lat},${point.lon}`;
    routePoints.push(helperObj);
  })
  routePoints.push(lastPoint);

  const routeData = await fetchRoute(routePoints);

  const path = routeData.paths[0]; 
  const encodedPolyline = path.points;

  const decodedPoints = decodePolyline(encodedPolyline);
  const positions = decodedPoints.map(point => {
    return Cesium.Cartesian3.fromDegrees(point[0], point[1]);
  });

  map.entities.add({
    name : layerName,
    position: Cesium.Cartesian3.fromDegrees(source[0], source[1]),
    billboard: {
      image: startIcon,
      scale: image_scale,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
  });

  map.entities.add({
    name : layerName,
    position: Cesium.Cartesian3.fromDegrees(destination[0], destination[1]),
    billboard: {
      image: endIcon,
      scale: image_scale,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
  });

  waypoints.forEach(poi=>{
    map.entities.add({
      name : layerName,
      position: Cesium.Cartesian3.fromDegrees(poi.lon, poi.lat),
      billboard: {
        image: waypointsIcon,
        scale: image_scale,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
    });
  })


  // Add the polyline to the Cesium map
  let entity = map.entities.add({
    name : layerName,
    polyline: {
      positions: positions,
      width: routeWidth,
      material: Cesium.Color.fromCssColorString(routeColor)
    }
  });

  // Zoom to the route
  map.zoomTo(entity);
  
}

async function fetchRoute(waypoints) {
  const apiKey = appConfigInfo.onlineGraphhopperKey; 
  const url = `https://graphhopper.com/api/1/route?${waypoints.map(point => `point=${point}`).join('&')}&vehicle=car&locale=en&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function decodePolyline(encoded, precision) {
  let index = 0, lat = 0, lng = 0, coordinates = [];
  const factor = Math.pow(10, precision || 5);

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += deltaLng;
    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates.map(coord => [coord[1], coord[0]]);
}

function removeRoute(param){
  let map = param.map;
  let layerName = param.layer;

  let allLayers = map.entities._entities._array
  // allLayers.forEach(poi => {
  //   if(poi.name == layerName){
  //     map.entities.remove(poi);
  //   }
  // })
  for(let i = allLayers.length - 1; i >= 0; i--){
    if(allLayers[i].name == layerName){
      map.entities.remove(allLayers[i]);
    }
  }
}

tmpl.Trip.getVehicleDetails = function(param){
  const vehicleId = param.vehicleId;
  const date = param.date;
  const map = param.map;
  const movingColor = param.vehicleMovement != undefined ?  param.vehicleMovement :'rgba(46, 129, 255, 0.9)';
  const haltingColor = param.vehicleHalting != undefined ?  param.vehicleHalting :'rgba(255, 191, 0, 0.9)';
  const stoppageColor = param.vehicleStopping != undefined ?  param.vehicleStopping :'rgba(255, 30, 0, 0.9)';
  const pointRadius = param.pointRadius != undefined ? param.pointRadius : 6;
  const vehicleDistance = param.vehicleDistance != undefined ? param.vehicleDistance : false;
  let localURL = "http://localhost:8083/EGISAPIService/apis/";
  let nightlyURL = window.location.protocol+'//'+window.location.hostname+"/EGISAPIService/apis/";

  let settings = {
    "url": localURL+"fetchVehicleDetails",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
      "vehicleId": vehicleId,
      "date": date
    }),
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    let pointColor = 'rgba(0, 0, 0, 0.9)';
    const responseData = response.data.vehicleDetails;

    responseData.forEach((vehicleData)=>{
      var point = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicleData.longitude, vehicleData.latitude])),
        vehicleData: vehicleData 
      });
      if(vehicleData.movement_status.toLowerCase() == 'moving'){
        pointColor=movingColor
      }else if(vehicleData.movement_status.toLowerCase() == 'halting'){
        pointColor=haltingColor
      }else{
        pointColor=stoppageColor
      }
  
      // Style for the point (green color)
      point.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
              radius: pointRadius,
              fill: new ol.style.Fill({color: pointColor}),
              stroke: new ol.style.Stroke({color: 'white', width: 1})
          })
      }));
  
      // Create a vector source and add the point
      var vectorSource = new ol.source.Vector({
          features: [point]
      });
  
      // Create a vector layer to hold the point
      var vectorLayer = new ol.layer.Vector({
          source: vectorSource
      });
  
      // Add the vector layer to the map
      map.addLayer(vectorLayer);
    })


    var ta_tooltip = document.createElement('div');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    ta_tooltip.style.position = 'absolute';
    ta_tooltip.style.backgroundColor = 'white';
    ta_tooltip.style.padding = '5px';
    ta_tooltip.style.border = '1px solid black';
    ta_tooltip.style.color = 'black'; // Set text color to black for better readability
    ta_tooltip.style.fontSize = '12px'; // Optional: Set a readable font size
    ta_tooltip.style.display = 'none'; // Initially hidden
    document.body.appendChild(ta_tooltip);

    // Create an overlay for the tooltip
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
    map.addOverlay(overlay_mouseOver_label);

    // Handle pointermove event for hovering
    map.on('pointermove', function (evt) {
        var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            // Check if the feature exists and has vehicleData
            if (feature && feature.get('vehicleData')) {
                return feature;
            }
        });

        // if(feature_mouseOver!= undefined){
        //   console.log("Hovered Feature: ", feature_mouseOver.get('vehicleData'));
        // } 

        // Show or hide the tooltip based on whether a feature is hovered
        ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
        if (feature_mouseOver) {
            var vehicleData = feature_mouseOver.get('vehicleData'); // Access the attached vehicle data
            overlay_mouseOver_label.setPosition(evt.coordinate); // Set the tooltip position to mouse coordinates
            ta_tooltip.style.display = 'block';
            // Display the desired vehicle data in the tooltip
            ta_tooltip.innerHTML = `
                <strong>Vehicle ID:</strong> ${vehicleData.vehicle_id}<br>
                <strong>Trip ID:</strong> ${vehicleData.trip_id}<br>
                <strong>Location:</strong> ${vehicleData.location}<br>
                <strong>Status:</strong> ${vehicleData.movement_status}<br>
                <strong>Speed:</strong> ${vehicleData.speed}<br>
                <strong>Coordinates:</strong> ${vehicleData.latitude},${vehicleData.longitude}<br>
                <strong>Timestamp:</strong> ${vehicleData.date_time}
            `;
        }
    });


    if(vehicleDistance){
      let settings = {
        "url": localURL+"vehicleDistanceDetails",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "vehicleId": vehicleId,
          "date": date
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        const responseData = response.data.vehicleDistanceDetails;
        if(response.data.vehicleDistanceDetails){

        }
      });
    }
  });
}


tmpl.Trip.getVehicleStoppageDetails = function(param){
  const vehicleId = param.vehicleId;
  const date = param.date;
  const map = param.map;
  const stoppageColor = param.vehicleStopping != undefined ?  param.vehicleStopping :'rgba(255, 30, 0, 0.9)';
  const pointRadius = param.pointRadius != undefined ? param.pointRadius : 6;
  let localURL = "http://localhost:8083/EGISAPIService/apis/fetchVehicleDetails";
  let nightlyURL = window.location.protocol+'//'+window.location.hostname+"/EGISAPIService/apis/fetchVehicleDetails";

  let settings = {
    "url": localURL,
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
      "vehicleId": vehicleId,
      "date": date
    }),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let pointColor = 'rgba(0, 0, 0, 0.9)';
    const responseData = response.data.vehicleStoppageDetails;

    responseData.forEach((vehicleData)=>{
      var point = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicleData.longitude, vehicleData.latitude])),
        vehicleData: vehicleData 
      });
      if(vehicleData.movement_status.toLowerCase() == 'stopped'){
        pointColor=stoppageColor
      }
  
      // Style for the point (green color)
      point.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
              radius: pointRadius,
              fill: new ol.style.Fill({color: pointColor}),
              stroke: new ol.style.Stroke({color: 'white', width: 1})
          })
      }));
  
      // Create a vector source and add the point
      var vectorSource = new ol.source.Vector({
          features: [point]
      });
  
      // Create a vector layer to hold the point
      var vectorLayer = new ol.layer.Vector({
          source: vectorSource
      });
  
      // Add the vector layer to the map
      map.addLayer(vectorLayer);
    })
  });

  var ta_tooltip = document.createElement('div');
    ta_tooltip.id = 'trip-tooltip';
    ta_tooltip.className = 'ol-trip-tooltip';
    ta_tooltip.style.position = 'absolute';
    ta_tooltip.style.backgroundColor = 'white';
    ta_tooltip.style.padding = '5px';
    ta_tooltip.style.border = '1px solid black';
    ta_tooltip.style.color = 'black'; // Set text color to black for better readability
    ta_tooltip.style.fontSize = '12px'; // Optional: Set a readable font size
    ta_tooltip.style.display = 'none'; // Initially hidden
    document.body.appendChild(ta_tooltip);

    // Create an overlay for the tooltip
    var overlay_mouseOver_label = new ol.Overlay({
        element: ta_tooltip,
        offset: [10, 0],
        positioning: 'bottom-left'
    });
    map.addOverlay(overlay_mouseOver_label);

    // Handle pointermove event for hovering
    map.on('pointermove', function (evt) {
        var feature_mouseOver = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            // Check if the feature exists and has vehicleData
            if (feature && feature.get('vehicleData')) {
                return feature;
            }
        });

        // if(feature_mouseOver!= undefined){
        //   console.log("Hovered Feature: ", feature_mouseOver.get('vehicleData'));
        // } 

        // Show or hide the tooltip based on whether a feature is hovered
        ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
        if (feature_mouseOver) {
            var vehicleData = feature_mouseOver.get('vehicleData'); // Access the attached vehicle data
            overlay_mouseOver_label.setPosition(evt.coordinate); // Set the tooltip position to mouse coordinates
            ta_tooltip.style.display = 'block';
            // Display the desired vehicle data in the tooltip
            ta_tooltip.innerHTML = `
                <strong>Vehicle ID:</strong> ${vehicleData.vehicle_id}<br>
                <strong>Vehicle No:</strong> ${vehicleData.vehicle_no}<br>
                <strong>Location:</strong> ${vehicleData.location}<br>
                <strong>Status:</strong> ${vehicleData.movement_status}<br>
                <strong>Coordinates:</strong> ${vehicleData.latitude},${vehicleData.longitude}<br>
                <strong>Stoppage Duration:</strong> ${vehicleData.stop_duration_in_seconds + " sec"}<br>
                <strong>Timestamp 1:</strong> ${vehicleData.startdatetime_formatted}<br>
                <strong>Timestamp 2:</strong> ${vehicleData.enddatetime_formatted}<br>
            `;
        }
    });

}

tmpl.Trip.terrainOverlay=function (param){
	let viewer = param.map
	gbl_clusterMap = viewer;
	  var jsonobj = param.features;
	  var radius = param.radius;
	  var distance = param.distance;
	  var fillColor = param.fillColor;
	  var countTextColor = param.countTextColor;
	  var allLayer = param.allLayer;
	  var layerName = param.layer;
	  var layerSwitcher = false;
	  var getdata = jsonobj;
	  var getHoverLabel = param.getHoverLabel;
	  var showLabel = param.showLabel;
	  var showLabelZoom = param.showLabelZoom;
	  var isOverlay=true;
	  param.isOverlay=true;
	fillColor="RED";
  
	var dataSource = new Cesium.CustomDataSource(layerName);
  
	dataSource.clustering.enabled = true;
	dataSource.clustering.pixelRange = 40; 
	dataSource.clustering.minimumClusterSize = 2;
  
	jsonobj.forEach(position => {
	  position.type= "Clustered Entity";
	  position.layer_name=layerName;
	  let id=position.id;
	  let updatedPosition;
	  let cartographicPosition = Cesium.Cartographic.fromDegrees(position.lon, position.lat);
		Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographicPosition]).then(function(updatedPositions) {
		   updatedPosition = updatedPositions[0];
		   console.log(updatedPosition)
		   position.updatedPos=updatedPosition;
		   let newCustomEntity=dataSource.entities.add({
			id:position.id,
			position: Cesium.Cartesian3.fromRadians(
			  updatedPosition.longitude, 
			  updatedPosition.latitude, 
			  updatedPosition.height
			),
			billboard: {
			  image: position.img_url,  
			  scale:1.0,
			  verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			},
			entProp:position          
		  });
		  tmpl_overlayCluster_golbal.push(newCustomEntity);
	  		if (position.isBadgeRequired) {
				let dataEntity=dataSource.entities.getById(id);
				dataEntity.label = new Cesium.LabelGraphics({
				text: position.badgeText, 
				font: '12px "Times New Roman"', 
				fillColor: Cesium.Color.WHITE, 
				outlineColor: Cesium.Color.WHITE, 
				outlineWidth: 2, 
				style: Cesium.LabelStyle.FILL_AND_OUTLINE, 
				showBackground: true, 
				backgroundColor: Cesium.Color.BLUE,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM, 
				pixelOffset: new Cesium.Cartesian2(0, -20) 
	  		});
			}
			if(position.animationRequired){
				addAnime({
				map:viewer,
				features:[position],
				layer:layerName
				});
			}
	  });
	});
	tmpl.Overlay.addCamFieldOfView(param);
	dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
	  cluster.label.show = false;
	  cluster.billboard.show = true;
	  cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
	  const pinBuilder = new Cesium.PinBuilder();
	  cluster.billboard.image = pinBuilder.fromText(clusteredEntities.length , Cesium.Color.RED, 48).toDataURL();
	  console.log(clusteredEntities);
	  console.log(viewer.entities.values)
	 
	});
  
	viewer.dataSources.add(dataSource);
}




let rawPacketCoords;
let timeStampArr;
let speedArr;
let locationArr; 
isAnimating = false;

tmpl.Trip.tripPlayback = function (param) {
    console.log(param)
    const map = param.map;
    const lineString = param.data.lineString;
    speedArr = param.data.speeds
    locationArr = param.data.locations
    timeStampArr = param.data.times
    const imageUrl = param.img_url  != undefined ? param.img_url : appConfigInfo.mapSDKURL+'2.png';
    var start_url = param.start_url  != undefined ?  param.start_url : appConfigInfo.mapSDKURL+'2.png';
    var end_url = param.end_url != undefined ?  param.end_url :  appConfigInfo.mapSDKURL+'2.png';
    var start_url_icon_scale = param.start_url_icon_scale  != undefined ?  param.start_url_icon_scale : 1.0;
    var end_url_icon_scale = param.end_url_icon_scale != undefined ?  param.end_url_icon_scale : 1.0;
    var vehicle_icon_scale = param.icon_scale  != undefined ? param.icon_scale: 1;
    var route_color = param.route_color != undefined ?  param.route_color : 'red';
    var route_style_width = param.route_width != undefined ? param.route_width : 3;
    const tripZoomLevel = param.tripScale != undefined ? param.tripScale: 16;
    const vehicleData = param.vehicleData;
    vehicleNumber = vehicleData != undefined ?  vehicleData.vehicleNumber : 'N/A';
    vehicleType = vehicleData  != undefined ?  vehicleData.vehicleType : 'N/A';

    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({ title :"tripPlaybackVector" ,source: vectorSource , zIndex: 4 });
    map.addLayer(vectorLayer);

    const traveledSource = new ol.source.Vector();
    const traveledLayer = new ol.layer.Vector({
        title:"traveledLayer",
        source: traveledSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({ color: route_color, width: route_style_width })
        }),
        zIndex: 3
    });
    map.addLayer(traveledLayer);

  
    const match = lineString.match(/LINESTRING\s*\(([^)]+)\)/);
    if (!match) {
        console.error("Invalid LINESTRING format");
        return;
    }else{
        rawPacketCoords = match[1].split(",").map(coord => {
            const [lon, lat] = coord.trim().split(" ").map(Number);
            return [lon, lat];  // Convert to an array of [longitude, latitude]
        });
    
        console.log(rawPacketCoords);
    }

    const coordinates = match[1].split(",").map(coord => {
        const [lon, lat] = coord.trim().split(" ").map(Number);
        return ol.proj.fromLonLat([lon, lat]); // Convert to OpenLayers projection
    });

    if (coordinates.length < 2) {
        console.error("At least two coordinates are required for animation.");
        return;
    }

    console.log(coordinates)

    // **Corrected Icon Style with Proper Anchoring**
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: imageUrl,
            scale: vehicle_icon_scale,
            anchor: [0.5, 1],  // Properly aligns bottom center
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            rotation: 0
        }),
        zIndex: 4
    });

    const iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(coordinates[0])
    });
    iconFeature.setStyle(iconStyle);
    vectorSource.addFeature(iconFeature);

    let totalDistance = 0;
    let progressAlongPath = 0;
    // let isAnimating = false;
    let animationFrameId = null;
    let speedFactor = 1;
    let startTime = null;
    let traveledCoordinates = [coordinates[0]];


    tmpl.Zoom.toXYcustomZoom({map:map,zoom:tripZoomLevel,latitude:rawPacketCoords[0][1] ,longitude:rawPacketCoords[0][0]})

    var markerLayer;
    function addIcons(){
        // Coordinates for the start and end points
        let length = rawPacketCoords.length;
        const startPointCoords = ol.proj.fromLonLat([rawPacketCoords[0][0], rawPacketCoords[0][1]]);
        const endPointCoords = ol.proj.fromLonLat([rawPacketCoords[length-1][0], rawPacketCoords[length-1][1]]);

        // Create features for start and end points
        const startFeature = new ol.Feature({
          id:'startTripIcon',
            geometry: new ol.geom.Point(startPointCoords),
        });
        const endFeature = new ol.Feature({
          id:'endTripIcon',
            geometry: new ol.geom.Point(endPointCoords),
        });

        // Style for the start and end icons
        const startIconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: start_url, // Replace with your start icon path
                scale: start_url_icon_scale, // Adjust size as needed
            }),
            zIndex: 4
        });
        const endIconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: end_url, // Replace with your end icon path
                scale: end_url_icon_scale, // Adjust size as needed
            }),
            zIndex: 4
        });

        // Apply styles to the features
        startFeature.setStyle(startIconStyle);
        endFeature.setStyle(endIconStyle);

        // Create a vector source and add the features
        const markerSource = new ol.source.Vector({
            features: [startFeature, endFeature],
        });

        // Create a vector layer for the markers
        markerLayer = new ol.layer.Vector({
            source: markerSource,
            title : "markerLayer",
        });

        // Add the layer to the map
        map.addLayer(markerLayer);
    }
    addIcons();


    var lineLayer;

    //function to add Linestring as a Route
    function plotLineString(map, lineString) {
        // Create a WKT format object
        const format = new ol.format.WKT();
        
        // Parse the WKT string to extract the feature
        const feature = format.readFeature(lineString);
        if (!feature) {
          console.error('Failed to parse WKT string');
          return;
        }
      
        // Transform the coordinates from EPSG:4326 to EPSG:3857 (map's coordinate system)
        feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
      
        // Create a vector source with the parsed feature
        const lineSource = new ol.source.Vector({
          features: [feature], // Add the feature to the vector source
        });
      

        lineLayer = new ol.layer.Vector({
          title: "vehicleTravelledRouteLine",
            source: lineSource, // Link the source to the vector layer
            style: new ol.style.Style({
                // Transparent "halo" effect (wider and less opaque)
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',  // Semi-transparent blue
                    width: 4,  // Wider width for smoothing effect
                }),
                
            }),
        });
        
      
        // Add the vector layer to the map
        map.addLayer(lineLayer);
        lineLayer.setVisible(false);
    }

    plotLineString(map,lineString);

    for (let i = 0; i < coordinates.length - 1; i++) {
        let dx = coordinates[i + 1][0] - coordinates[i][0];
        let dy = coordinates[i + 1][1] - coordinates[i][1];
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    // **Function to Calculate Rotation Angle**
    function calculateAngle(start, end) {
        if (!start || !end) return 0;
    
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
    
        let angle = Math.atan2(dy, dx);  // Calculate angle in radians
    
        return -(angle - Math.PI / 2);  // Subtract 90 degrees (PI/2 in radians)
    }
    
    
    

    // **Update Icon Rotation**
    function updateIconRotation(nextPos) {
        if (!nextPos) return;
    
        const currentPos = iconFeature.getGeometry().getCoordinates();
        const angle = calculateAngle(currentPos, nextPos);
    
        // Apply the correct rotation to the icon
        iconStyle.getImage().setRotation(angle); // OpenLayers expects radians
        iconFeature.setStyle(iconStyle);
    }
    
    let currentIndex = 0; // Track the index of the coordinates array

    function moveFeature(timestamp) {
        if (!isAnimating) return;
        if (!startTime) startTime = timestamp;
        let elapsedTime = (timestamp - startTime) / 1000;
        startTime = timestamp;

        // Interpolate the path based on elapsed time and speedFactor
        progressAlongPath += (elapsedTime * speedFactor * totalDistance) / 100;
        let traveled = 0;

        for (let i = 0; i < coordinates.length - 1; i++) {
            let start = coordinates[i];
            let end = coordinates[i + 1];
            let dx = end[0] - start[0];
            let dy = end[1] - start[1];
            let segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (traveled + segmentLength >= progressAlongPath) {
                let remaining = progressAlongPath - traveled;
                let t = remaining / segmentLength;
                let newX = start[0] + t * dx;
                let newY = start[1] + t * dy;

                // Interpolate coordinates between the current and next points
                let newPosition = [newX, newY];
                iconFeature.getGeometry().setCoordinates(newPosition);
                traveledCoordinates.push(newPosition);

                // **Update Rotation to Face Movement Direction**
                updateIconRotation(end);

                // **Check if the icon is outside the viewport**
                const viewExtent = map.getView().calculateExtent(map.getSize());
                if (!ol.extent.containsCoordinate(viewExtent, newPosition)) {
                    map.getView().setCenter(newPosition); // Recenter only if out of view
                }

                traveledSource.clear();
                traveledSource.addFeature(new ol.Feature({ geometry: new ol.geom.LineString(traveledCoordinates) }));

                // Update Current Index of Movement
                if (i > currentIndex) {
                    currentIndex = i;
                    // console.log("Current Index:", currentIndex, "Current Coordinates:", rawPacketCoords[currentIndex]);
                    updateTripTableDetails(currentIndex);
                }

                break;
            }
            traveled += segmentLength;
        }

        if (progressAlongPath < totalDistance) {
            animationFrameId = requestAnimationFrame(moveFeature);
        } else {
            isAnimating = false;
        }
    }
    
    
    
    const controls = document.createElement("div");
    controls.className = "map-controls";
    controls.innerHTML = `
        <button id="playBtn">Play</button>
        <button id="pauseBtn">Pause</button>
        <button id="stopBtn">Stop</button>
        <label>Speed:</label>
        <select id="speedDropdown">
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
        </select>
    `;
    document.getElementById(globalMapDivID).appendChild(controls);

    document.getElementById("playBtn").addEventListener("click", () => {
        if (!isAnimating) {
            startTime = performance.now();
            isAnimating = true;
            requestAnimationFrame(moveFeature);
        }
    });

    document.getElementById("pauseBtn").addEventListener("click", () => {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
    });

    document.getElementById("stopBtn").addEventListener("click", () => {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
        progressAlongPath = 0;
        traveledCoordinates = [coordinates[0]];
        iconFeature.getGeometry().setCoordinates(coordinates[0]);
        traveledSource.clear();
    });

    document.getElementById("speedDropdown").addEventListener("change", (event) => {
        speedFactor = parseFloat(event.target.value) * speedFactor;
    });

    // **CSS Styling**
    const style = document.createElement("style");
    style.innerHTML = `
        .map-controls {
            position: absolute;
            bottom: 2%;
            left: 41%;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            display: flex;
            gap: 5px;
        }
        .map-controls button, .map-controls select {
            padding: 5px;
            border: 1px solid #ccc;
            cursor: pointer;
            font-size: 14px;
        }
        .map-controls button:hover {
            background: #ddd;
        }
    `;
    document.head.appendChild(style);


    var toggleLayersDiv = document.createElement("div");
        toggleLayersDiv.className = "toggleLayers";
        toggleLayersDiv.id = "toggleTrackLayers";
        var mapDiv = document.getElementById(globalMapDivID);
        mapDiv.appendChild(toggleLayersDiv);
        // document.body.appendChild(toggleLayersDiv);
        toggleLayersDiv.style.position = "absolute";
        toggleLayersDiv.style.display = "flex";
        toggleLayersDiv.style.justifyContent = "center";
        toggleLayersDiv.style.top = "8%";
        toggleLayersDiv.style.right = "10px";
        toggleLayersDiv.style.width = "22%";
        toggleLayersDiv.style.backgroundColor = "cornsilk";
        toggleLayersDiv.style.borderRadius = "5px";
        toggleLayersDiv.style.opacity = "0.8";
        toggleLayersDiv.style.zIndex = "4";
    
        var routelineCheckbox = document.createElement("input");
        routelineCheckbox.id = "checkrouteline";
        routelineCheckbox.type = "checkbox";
        routelineCheckbox.name = "Route Line";
        routelineCheckbox.value = "Route Line";
        routelineCheckbox.checked = true;
        toggleLayersDiv.appendChild(routelineCheckbox);
        // routelineCheckbox.onclick = routeLinevisibility;
        document.getElementById("toggleTrackLayers").append("Route Line");
    
        routelineCheckbox.addEventListener("change", () => {
            traveledLayer.setVisible(routelineCheckbox.checked);
            // vectorLayer.setVisible(routelineCheckbox.checked);
        });
    
        var routevehicleCheckbox = document.createElement("input");
        routevehicleCheckbox.id = "checkresource";
        routevehicleCheckbox.type = "checkbox";
        routevehicleCheckbox.name = "Resource";
        routevehicleCheckbox.value = "Resource";
        routevehicleCheckbox.checked = true;
        toggleLayersDiv.appendChild(routevehicleCheckbox);
        // routevehicleCheckbox.onclick = resourcevisibility;
        document.getElementById("toggleTrackLayers").append("Resource");
    
        routevehicleCheckbox.addEventListener("change", () => {
            // traveledLayer.setVisible(routelineCheckbox.checked);
            vectorLayer.setVisible(routevehicleCheckbox.checked);
        });
    
        var infoCheckbox = document.createElement("input");
        infoCheckbox.id = "checkinfobox";
        infoCheckbox.type = "checkbox";
        infoCheckbox.name = "Infobox";
        infoCheckbox.value = "Infobox";
        infoCheckbox.checked = false; //@Sh by default is false
        toggleLayersDiv.appendChild(infoCheckbox);
        //infoCheckbox.onclick = infoboxvisibility;
        document.getElementById("toggleTrackLayers").append("Infobox");
    
        var infoTableDiv = document.createElement("div");
              infoTableDiv.className = "dataTable";
              infoTableDiv.id = "infoTable";
              infoTableDiv.style.zIndex = "4";
              // document.body.appendChild(infoTableDiv);
              mapDiv.appendChild(infoTableDiv);
              var infoTableRowsDiv = document.createElement("div");
              infoTableRowsDiv.className = "rows";
              infoTableDiv.appendChild(infoTableRowsDiv);
    
        infoTableRowsDiv.innerHTML =
                  '<table><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle No</td><td id= "resourceDiv"></td><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Vehicle Type</td><td id= "callSignDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Position</td><td id= "positionDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Speed</td><td id= "speedDispDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Location</td><td id= "locationDiv"></td></tr><tr style="border-bottom: 1px solid lightgrey;"><td style="font-weight:bold; padding:5px;">Time</td><td id="dateTimeDIv"></td></tr></table>';
       
    
                  infoTableDiv.style.position = "absolute";
                  infoTableDiv.style.top = "20%";
                  infoTableDiv.style.right = "10px";
                  infoTableDiv.style.width = "20%";
                  infoTableDiv.style.zIndex = "4";
                  infoTableDiv.style.visibility = "hidden"; //@sh disabled
        
                  infoTableRowsDiv.style.position = "relative";
                  infoTableRowsDiv.style.top = "2px";
                  infoTableRowsDiv.style.left = "2px";
                  infoTableRowsDiv.style.backgroundColor = "white";
                  infoTableRowsDiv.style.opacity = "1";
                  infoTableRowsDiv.style.borderRadius = "5px";
    
                  document.getElementById('checkinfobox').addEventListener('change', function () {
                    let infoTableDiv = document.getElementById('infoTable');
                    if (this.checked) {
                        infoTableDiv.style.visibility = "visible"; // Show the Infobox
                    } else {
                        infoTableDiv.style.visibility = "hidden"; // Hide the Infobox
                    }
                });
    
    
        var routePathCheckBox = document.createElement("input");
        routePathCheckBox.id = "routePath";
        routePathCheckBox.type = "checkbox";
        routePathCheckBox.name = "Route Line";
        routePathCheckBox.value = "Route Line";
        routePathCheckBox.checked = false;
        toggleLayersDiv.appendChild(routePathCheckBox);
        // deviatedpointCheckbox.onclick = routeLinevisibility;
        document.getElementById("toggleTrackLayers").append("Route Line");
    
        routePathCheckBox.addEventListener("change", () => {
            lineLayer.setVisible(routePathCheckBox.checked);
        });

      
        const resourceDiv = document.getElementById('resourceDiv');
        const callSignDiv = document.getElementById('callSignDiv');

      if (resourceDiv) {
          resourceDiv.innerHTML = vehicleNumber;
      }
      if (callSignDiv) {
          callSignDiv.innerHTML = vehicleType;
      }
}

function updateTripTableDetails(index){

    const positionDiv = document.getElementById('positionDiv');
    const speedDiv = document.getElementById('speedDispDiv');
    const locationDiv = document.getElementById('locationDiv');
    const dateTimeDiv = document.getElementById('dateTimeDIv');

   
    if (positionDiv) {
        positionDiv.innerHTML = `${rawPacketCoords[index][1]}, ${rawPacketCoords[index][0]}`;
    }
    if (speedDiv) {
        speedDiv.innerHTML = speedArr[index];
    }
    if (locationDiv) {
        locationDiv.innerHTML = locationArr[index];
    }
    if (dateTimeDiv) {
        dateTimeDiv.innerHTML = timeStampArr[index];
    }
}


tmpl.Trip.removeTripPlayback = function(param){
  isAnimating = false;
  const map = param.map;
  try {
      let layers = map.getLayers().getArray();
      let layerTitlesToRemove = ["markerLayer", "lineLayer", "traveledLayer","vehicleTravelledRouteLine", "tripPlaybackVector"];
  
      // Loop in reverse to safely remove layers
      for (let i = layers.length - 1; i >= 0; i--) {
          let layer = layers[i];
          if (layerTitlesToRemove.includes(layer.get("title"))) {
              map.removeLayer(layer);
              layer.getSource().clear();
              // console.log(`Removed layer: ${layer.get("title")}`);
          }
      }
  
      // Remove map controls
      if( $(".map-controls")){
        $(".map-controls").remove();
      }
      if($(".toggleLayers")){
        $(".toggleLayers").remove();
      }
      if($(".dataTable")){
        $(".dataTable").remove();
      }
  } catch (error) {
    console.log("error in removing trip playback ",error)
  }
}



tmpl.Map.getMapData = function(){
  return [
      {"id":"google", "name":"Google"},
      {"id":"mmi", "name":"MMI"},
      {"id":"sgl", "name":"SGL"},
      {"id":"trinity", "name":"Trinity"},
      {"id":"pentab", "name":"Pentab"},
      {"id":"mdd", "name":"MDD"},
  ]
}



tmpl.Map.getMapType = function(param){

  var id=param.id

	if (id === null || id === undefined || id === '' || id === "") {
    
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a valid Id' };
	}

  
  let obj = {
      "google": [
          {"id":"google", "name":"Google"},
          {"id":"osm", "name":"OSM"},
          {"id":"esri", "name":"Esri"}
      ],
      "mmi": [
          {"id":"google", "name":"Google"},
      ],
      "sgl": [
          {"id":"google", "name":"Google"}
      ],
      "trinity": [
          {"id":"mmi", "name":"MMI"},
          {"id":"trinity", "name":"Trinity"}
      ],
      "pentab": [
          {"id":"pentab", "name":"Pentab"}
      ],
        "mdd": [
          {"id":"mdd", "name":"MDD"}
      ]
  }
  return obj[id];
}
/**
 * Multi Vehicle Track Function
 */

let glbVectorSource;
let glbVectorLayer;
let glbPathSource;
let glbPathLayer;
let gblMultiTrackAnimationDuration;
const toWebMercator = ol.proj.fromLonLat;
const popupMap = new Map();
tmpl.Track.multiVehicleTrack = function(param){
	const map = param.map;
	let features = param.vehicleData;
	gblMultiTrackAnimationDuration = param.duration ? param.duration : 2000;
  let layerName = param.layer? param.layer : "multiTrackLayer";
  let divRequired = param.divRequired ? param.divRequired : false;

	const vectorSource = new ol.source.Vector();
  const vectorLayer1 = new ol.layer.Vector({ title:layerName ,source: vectorSource ,'noncluster':true ,visible: true,});
	
  tmpl_setMap_layer_global.push({
			layer : vectorLayer1,
			title :  layerName,
			visibility : true,
			map : map
	});
  globale_layer_names.push(layerName);
	vectorLayer1.setMap(map);
  
  map.addLayer(vectorLayer1);
	glbPathSource = new ol.source.Vector();
	glbPathLayer = new ol.layer.Vector({
	source: glbPathSource,
	style: function(feature) {
		return new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: feature.get('color') || '#000000',
			width: 2
		})
		});
	}
	});
	map.addLayer(glbPathLayer);

	// Assuming this code is within a function or at the global scope where map and features are accessible
	let container = document.getElementById("vehicle-info-container");
	if (!container) {
	container = document.createElement("div");
	container.id = "vehicle-info-container"; // Set container ID
	document.body.appendChild(container); // Add to the body
	}

	// Add search input at the top
	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.id = "vehicleSearch";
	searchInput.placeholder = "Search by Vehicle No, Status, or Type...";
	searchInput.style.width = "98%";
	searchInput.style.padding = "5px";
	searchInput.style.marginBottom = "10px";
	searchInput.style.border = "1px solid #ccc";
	searchInput.style.borderRadius = "5px";
	container.appendChild(searchInput);

    const activePopups = [];

  // Function to create a popup for a feature
  function createPopup(feature, coordinate) {
    const popupId = `popup-${feature.get('id')}`;

    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup-multivehicle';
    popupElement.setAttribute('data-feature-id', feature.get('id'));

    const lastSpeed = feature.get('lastSpeed');
    const lastStatus = feature.get('statusMovement');

    let statusColor;
    if (lastStatus === "Moving") statusColor = "green";
    else if (lastStatus === "Halting") statusColor = "yellow";
    else if (lastStatus === "Stopped") statusColor = "red";
    else statusColor = "black";

    popupElement.innerHTML = `
    <div id="popup-content-multivehicle-${popupId}" style="background: white; padding: 3px; border: 1px solid #ccc; border-radius: 5px; font-size: 11px; width: auto; position: relative; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 5px; white-space: nowrap;">
            <span style="font-weight: bold;">${feature.get('vehicleNumber') || 'Unknown Vehicle'}</span>
            <button id="popup-close-multivehicle-${popupId}" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #333; line-height: 1;" aria-label="Close popup">×</button>
        </div>
        <div id='popup-details-multivehicle-${popupId}' style="padding: 3px 5px;">
            <div style="line-height: 1.5; display: flex; justify-content: space-between; white-space: nowrap;">
            <strong>Status:</strong> <span style="color: ${statusColor};">${lastStatus || 'N/A'}</span>
            </div>
            <div style="line-height: 1.5; display: flex; justify-content: space-between; white-space: nowrap;">
            <strong>Speed:</strong> <span>${lastSpeed ? lastSpeed + ' km/hr' : 'N/A'}</span>
            </div>
        </div>
    </div>`;

    const popup = new ol.Overlay({
        element: popupElement,
        offset: [0, 0],
    });

    popup.setPosition(coordinate);
    map.addOverlay(popup);
    activePopups.push(popup);
    popupMap.set(feature.get('id'), popup); // Track it

    const closeButton = popupElement.querySelector(`#popup-close-multivehicle-${popupId}`);
    closeButton.addEventListener('click', function () {
        map.removeOverlay(popup);
        activePopups.splice(activePopups.indexOf(popup), 1);
        popupMap.delete(feature.get('id'));
    });

    return popup;
}

map.on('moveend', function () {
    recalculatePopups(map);
});



	// Hover event listener
	map.on('pointermove', function (evt) {
	const pixel = map.getEventPixel(evt.originalEvent);
	const features = [];
	map.forEachFeatureAtPixel(pixel, function (feat) {
		if (feat.get('vehicleNumber')) { // Ensure the feature has a vehicleNumber
		features.push(feat);
		}
		return undefined; // Continue collecting all features
	});

	// Create or update popups for hovered features
	features.forEach(feature => {
		// Check if a popup already exists for this feature
		const existingPopup = tmpl.Track.multiVehicleTrack.activePopups.find(popup => 
		popup.getElement() && popup.getElement().getAttribute('data-feature-id') === feature.get('id')
		);

		if (!existingPopup) {
		// Create a new popup if none exists for this feature
		//   console.log(feature)
		//   console.log(evt.coordinate)
		//   createPopup(feature, evt.coordinate);
		// createPopup(feature, feature.getGeometry().getCoordinates());
		}
	});
	});

  // Add popup styles with "multivehicle" suffix
  const popupStyle = document.createElement('style');
  popupStyle.innerHTML = `
    .ol-popup-multivehicle {
      position: absolute;
      z-index: 1000;
    }
    .ol-popup-multivehicle [id^="popup-content-multivehicle"] {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      padding: 10px;
      font-family: Arial, sans-serif;
      color: #333;
    }
    .ol-popup-multivehicle [id^="popup-close-multivehicle"]:hover {
      color: #ff0000;
    }
    .ol-popup-multivehicle:before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 10px;
      border: 8px solid transparent;
      border-bottom-color: rgba(255, 255, 255, 0.95);
      border-top: 0;
      margin-left: -8px;
    }
	.ol-popup-multivehicle {
	  transition: transform 0.2s ease;
	}
  `;
  document.head.appendChild(popupStyle);
	  
	function createFeature(feature) {

		const trackcolor = feature.trackLineRequired!=null ? (feature.trackLineColor != null ? feature.trackLineColor : "#FF0E0E") : null;
		const featureData = new ol.Feature({
		  geometry: new ol.geom.Point(toWebMercator(feature.position)), 
		  id: feature.id,
		  trackLineRequired:  feature.trackLineRequired,
		  color: trackcolor,
		  lastPosition: feature.position,
    	lastTimestamp: feature.time,
		  lastSpeed : feature.speed,
		  type:feature.type
		});
    featureData.setProperties(feature);
				featureData.setId(feature.id);
				featureData.set('img_url', feature.imageUrl);
				featureData.set('layer_name', layerName);
				featureData.set('title', layerName);
		featureData.setStyle(new ol.style.Style({
		  image: new ol.style.Icon({
			src: feature.imageUrl,
			scale: feature.scale
		  }),
      zIndex: 10
		}));
		vectorSource.addFeature(featureData);

		

		// Function to filter and show/hide vehicles
		function filterVehicles(searchTerm) {
		const dropdownContainers = container.getElementsByClassName("vehicle-dropdown-container");
		searchTerm = searchTerm.toLowerCase().trim();

		Array.from(dropdownContainers).forEach(dropdownContainer => {
			const vehicleNumber = dropdownContainer.querySelector(".vehicle-dropdown").textContent.toLowerCase();
			const detailsDiv = dropdownContainer.querySelector("div[id$='_details']");
			const statusElement = detailsDiv ? detailsDiv.querySelector("#statusMultiTrack-" + detailsDiv.id.split("_")[0]) : null;
			const typeElement = detailsDiv ? detailsDiv.querySelector("#typeMultiTrack-" + detailsDiv.id.split("_")[0]) : null;
			const status = statusElement ? statusElement.childNodes[0].textContent.toLowerCase() : "";
			const type = typeElement ? typeElement.childNodes[0].textContent.toLowerCase() : "";

			const isMatch =
			vehicleNumber.includes(searchTerm) ||
			status.includes(searchTerm) ||
			type.includes(searchTerm);

			dropdownContainer.style.display = isMatch ? "block" : "none";
		});
		}

		searchInput.addEventListener("input", (e) => {
		filterVehicles(e.target.value);
		});

		const dropdownContainer = document.createElement("div");
		dropdownContainer.classList.add("vehicle-dropdown-container");

		const vehicleDropdown = document.createElement("button");
		vehicleDropdown.classList.add("vehicle-dropdown");
		vehicleDropdown.textContent = feature.vehicleNumber || "Unknown Vehicle";
		vehicleDropdown.onclick = function () {
		showVehicleDetails(feature, dropdownContainer); 
		};

		dropdownContainer.appendChild(vehicleDropdown);

		const vehicleDetailsDiv = document.createElement("div");
		vehicleDetailsDiv.id = feature.id + "_details";
		vehicleDetailsDiv.style.display = "none"; 

		const detailsTable = `
		<table class="multiTrackTable" style="width: 100%; border-collapse: collapse; table-layout: fixed;">
			<tr>
			<td style="font-weight: bold; width: 40%;">Vehicle No:</td>
			<td style="width: 60%;" id="vehicleNumberMultiTrack-${feature.id}">${feature.vehicleNumber || "Unknown Vehicle"}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Position:</td>
			<td id="positionMultiTrack-${feature.id}">${feature.position.join(", ")}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Speed:</td>
			<td id="speedMultiTrack-${feature.id}">${feature.speed + " km/hr" || "N/A"}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Location:</td>
			<td style="word-wrap: break-word; max-width: 200px;" id="locationMultiTrack-${feature.id}">${feature.place || "N/A"}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Time:</td>
			<td id="timeMultiTrack-${feature.id}">${feature.time || "N/A"}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Status:</td>
			<td id="statusMultiTrack-${feature.id}">${feature.status || "N/A"}<hr></td>
			</tr>
			<tr>
			<td style="font-weight: bold;">Vehicle Type:</td>
			<td id="typeMultiTrack-${feature.id}">${feature.type || "N/A"}<hr></td>
			</tr>
		</table>
		`;

		vehicleDetailsDiv.innerHTML = detailsTable;
		dropdownContainer.appendChild(vehicleDetailsDiv);
		container.appendChild(dropdownContainer);

		const style = document.createElement("style");
		style.innerHTML = `
		#vehicle-info-container {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 1000;
			width: 18%;  /* Fixed width */
			max-height: 90%;
			overflow-y: auto;
			padding: 10px;
			background-color: rgba(255, 255, 255, 0.8);
			border-radius: 8px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			text-align: center; /* Center all text */
		}

		#vehicleSearch {
			margin-bottom: 10px;
		}

		.vehicle-dropdown-container {
			margin-bottom: 10px;
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 5px;
			display: block; /* Ensure default visibility */
		}

		.vehicle-dropdown {
			width: 100%;
			padding: 10px;
			margin-bottom: 10px;
			font-size: 16px;
			background-color: #f0f0f0;
			border: none;
			cursor: pointer;
			text-align: center;
			border-radius: 5px;
			color: black;  /* Set text color to black */
		}

		.vehicle-dropdown:hover {
			background-color: #ddd;
		}

		.vehicle-dropdown:focus {
			outline: none;
		}

		.multiTrackTable td {
			word-wrap: break-word;
			max-width: 200px;
			color: black;  /* Set text color to black */
		}
		`;
		document.head.appendChild(style);

		function showVehicleDetails(feature, dropdownContainer) {
		const detailsDiv = dropdownContainer.querySelector(`#${feature.id}_details`);
		detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
		}
	}
	 

	features.forEach(f => {
		createFeature(f);
	});
	glbVectorSource = vectorSource;
	glbVectorLayer = vectorLayer1;
  let t =document.getElementById('vehicle-info-container');
  if(!divRequired){
    t.style.display = "none";
  }
  tmpl.Track.multiVehicleTrack.activePopups = activePopups;
  tmpl.Track.multiVehicleBadge(param);
}

function groupNearbyFeatures(features, distanceThreshold,mapObj) {
    const groups = [];
    const visited = new Set();

    features.forEach((feature, i) => {
        if (visited.has(feature)) return;

        const group = [feature];
        visited.add(feature);

        const queue = [feature];

        while (queue.length > 0) {
            const current = queue.shift();
            const currentPixel = mapObj.getPixelFromCoordinate(current.getGeometry().getCoordinates());

            features.forEach(other => {
                if (!visited.has(other)) {
                    const otherPixel = mapObj.getPixelFromCoordinate(other.getGeometry().getCoordinates());
                    const dx = Math.abs(currentPixel[0] - otherPixel[0]);
                    const dy = Math.abs(currentPixel[1] - otherPixel[1]);

                    if (dx < distanceThreshold && dy < distanceThreshold) {
                        group.push(other);
                        visited.add(other);
                        queue.push(other);
                    }
                }
            });
        }

        groups.push(group);
    });

    return groups;
}

function recalculatePopups(mapObj) {
    const featuresWithPopups = Array.from(popupMap.keys())
        .map(id => glbVectorSource.getFeatureById(id))
        .filter(f => f);

    const distanceThreshold = 50; // pixel distance for grouping

    const groups = groupNearbyFeatures(featuresWithPopups, distanceThreshold,mapObj);

    groups.forEach(group => {
        // Sort by Y-coordinate to find center easily
        group.sort((a, b) => {
            const aPixel = mapObj.getPixelFromCoordinate(a.getGeometry().getCoordinates());
            const bPixel = mapObj.getPixelFromCoordinate(b.getGeometry().getCoordinates());
            return aPixel[1] - bPixel[1];
        });

        const midIndex = Math.floor(group.length / 2);

        // group.forEach((feature, index) => {
        //     const popup = popupMap.get(feature.get('id'));
        //     const coordinate = feature.getGeometry().getCoordinates();

        //     let offsetY = 0;
        //     const spacing = 50; // Adjust vertical spacing as needed

        //     if (index < midIndex) {
        //         offsetY = -(midIndex - index) * spacing; // Move up
        //     } else if (index > midIndex) {
        //         offsetY = (index - midIndex) * spacing; // Move down
        //     } else {
        //         offsetY = 0; // Center popup, no offset
        //     }

        //     popup.setPosition(coordinate);
        //     popup.setOffset([0, offsetY]);
        // });

		group.forEach((feature, index) => {
			const popup = popupMap.get(feature.get('id'));
			const coordinate = feature.getGeometry().getCoordinates();

			const spacingY = 50; // vertical spacing
			const spacingXFactor = 0.5; // control horizontal shift

			let offsetY = 0;
			let offsetX = 0;

			if (index < midIndex) {
				offsetY = -(midIndex - index) * spacingY; // Move up
				offsetX = (midIndex - index) * spacingY * spacingXFactor; // Move left proportionally
			} else if (index > midIndex) {
				offsetY = (index - midIndex) * spacingY; // Move down
				offsetX = -(index - midIndex) * spacingY * spacingXFactor*2; // Move right proportionally
			} else {
				offsetY = 0; // Center
				offsetX = 0;
			}

			popup.setPosition(coordinate);
			popup.setOffset([offsetX, offsetY]);
		});
    });
}

let featurePaths = {};
let animationQueueMultiTrack = {};
let isAnimatingMultiTrack = {}; 
tmpl.Track.multiVehicleTrack.prototype = {
	startMultiVehicleTrack : function(param){
    const map = param.map;
    let featuresData = param.vehicleData;
    const view = map.getView();

    function calculateBearing(start, end) {
      const [lon1, lat1] = start.map(coord => coord * Math.PI / 180);
      const [lon2, lat2] = end.map(coord => coord * Math.PI / 180);

      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      const theta = Math.atan2(y, x);
      return theta; // Bearing in radians
    }

    function animateFeatureTo(id, newPosition, newTimestamp, trackData) {
      const feature = glbVectorSource.getFeatures().find(f => f.get('id') === id);
      const badgeFeatures = badgeTrackFeaturesByLayer.get(glbBadgeLayerTrack);
      const badgeFeature = badgeFeatures ? badgeFeatures.get(id) : null;
      if (!feature) return;

      if (!newPosition || !newTimestamp) {
        console.warn("Invalid position or timestamp provided.");
        return;
      }

      const newTime = new Date(newTimestamp);
      if (isNaN(newTime)) {
        console.warn("Invalid newTimestamp format.");
        return;
      }

      const lastPosition = feature.get('lastPosition');
      const lastTimestamp = feature.get('lastTimestamp');
      const lastTime = lastTimestamp ? new Date(lastTimestamp) : null;

      if (newTime <= lastTime) {
        return;
      }

      if (!trackData || trackData.length === 0) {
        console.warn("Empty Track Data for id " + id);
        return;
      }

      if (lastPosition[0] === newPosition[0] && lastPosition[1] === newPosition[1]) {
        updateVehicleDetails(id, newPosition, trackData[0].speed, trackData[0].place, newTimestamp);
        return;
      }

      if (isAnimatingMultiTrack[id]) {
        animationQueueMultiTrack[id].push({ id, newPosition, newTimestamp, trackData });
        console.log("Animation queued for vehicle:", id);
        return;
      }

      const geom = feature.getGeometry().clone();
      console.log(geom);
      console.log(badgeFeature);
      if(badgeFeature && geom){
        badgeFeature.setGeometry(geom);
        animateBadgeFeatureTo(badgeFeature,newPosition[0],newPosition[1],gblMultiTrackAnimationDuration)
      }  

      const geometry = feature.getGeometry();
      const start = geometry.getCoordinates();
      const end = toWebMercator(newPosition);
      const startTime = Date.now();

      const startLonLat = ol.proj.toLonLat(start);
      const endLonLat = newPosition;
      const bearing = calculateBearing(startLonLat, endLonLat);

      const style = feature.getStyle();
      if (style && style.getImage()) {
        style.getImage().setRotation(bearing);
      }

      let updatedSpeed = feature.get('lastSpeed');
      let newSpeed = 0;
      let statusOfVehicle = "Stopped";
      if (trackData[0].speed > 0 && (trackData[0].speed > updatedSpeed || trackData[0].speed === updatedSpeed)) {
        statusOfVehicle = "Moving";
		feature.set('statusMovement',"Moving");
        newSpeed = trackData[0].speed;
      } else if (trackData[0].speed > 0 && trackData[0].speed < updatedSpeed) {
        statusOfVehicle = "Halting";
		feature.set('statusMovement',"Halting");
        newSpeed = trackData[0].speed;
      } else {
        statusOfVehicle = "Stopped";
		feature.set('statusMovement',"Stopped");
        newSpeed = trackData[0].speed;
      }
	  updateVehicleDetails(id, newPosition, trackData[0].speed, trackData[0].place, newTimestamp, statusOfVehicle);

      function animate() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / gblMultiTrackAnimationDuration, 1);
        const current = [
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t
        ];
        geometry.setCoordinates(current);

        // Update popup position(s) for this feature
        tmpl.Track.multiVehicleTrack.activePopups.forEach(popup => {
          if (popup.getElement().getAttribute('data-feature-id') === id) {
            popup.setPosition(current);
          }
        });

        if (feature.get('trackLineRequired')) {
          if (!featurePaths[id]) {
            featurePaths[id] = [start];
          }
          featurePaths[id].push(current);

          const pathId = id + '_path';
          const existingPathFeature = glbPathSource.getFeatures().find(f => f.get('id') === pathId);
          if (existingPathFeature) {
            glbPathSource.removeFeature(existingPathFeature);
          }

          const pathFeature = new ol.Feature({
            geometry: new ol.geom.LineString(featurePaths[id]),
            id: pathId,
            color: feature.get('color')
          });
          glbPathSource.addFeature(pathFeature);
        }

        // updateVehicleDetails(id, newPosition, trackData[0].speed, trackData[0].place, newTimestamp, statusOfVehicle);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingMultiTrack[id] = false;
          processNextAnimation(id);
        }
      }

      isAnimatingMultiTrack[id] = true;
      animate();

      feature.set('lastPosition', newPosition);
      feature.set('lastTimestamp', newTimestamp);
      feature.set('lastSpeed', newSpeed);

      function updateVehicleDetails(vehicleId, position, speed, location, time, statusOfVehicle) {
        const positionElement = document.getElementById(`positionMultiTrack-${vehicleId}`);
        if (positionElement) {
          positionElement.innerHTML = `${position.join(", ")}<hr>`;
        }

        const speedElement = document.getElementById(`speedMultiTrack-${vehicleId}`);
        if (speedElement) {
          speedElement.innerHTML = `${speed ? speed + " km/hr" : "N/A"}<hr>`;
        }

        const locationElement = document.getElementById(`locationMultiTrack-${vehicleId}`);
        if (locationElement) {
          locationElement.innerHTML = `${location || "N/A"}<hr>`;
        }

        const timeElement = document.getElementById(`timeMultiTrack-${vehicleId}`);
        if (timeElement) {
          timeElement.innerHTML = `${time || "N/A"}<hr>`;
        }

        const statusElement = document.getElementById(`statusMultiTrack-${vehicleId}`);
        if (statusElement) {
          statusElement.innerHTML = `${statusOfVehicle || "N/A"}<hr>`;
        }

        // Update popup content for this feature
        tmpl.Track.multiVehicleTrack.activePopups.forEach(popup => {
          if (popup.getElement().getAttribute('data-feature-id') === vehicleId) {

			let statusColor;
			if (statusOfVehicle === "Moving") {
			statusColor = "green";
			} else if (statusOfVehicle === "Halting") {
			statusColor = "yellow";
			} else if (statusOfVehicle === "Stopped") {
			statusColor = "red";
			} else {
			statusColor = "black"; // Default color for N/A or other statuses
			}

            const popupDetails = popup.getElement().querySelector('[id^="popup-details-multivehicle"]');
            popupDetails.innerHTML = `
              <div >
				<div style="line-height: 1.5; display: flex; flex-wrap: nowrap; justify-content: space-between; white-space: nowrap;">
				<strong>Status:</strong> <span style="color: ${statusColor};">${statusOfVehicle || 'N/A'}</span>
				</div>
				<div style="line-height: 1.5; display: flex; flex-wrap: nowrap; justify-content: space-between; white-space: nowrap;">
				<strong>Speed:</strong> <span>${speed ? speed + ' km/hr' : 'N/A'}</span>
				</div>
			</div>
            `;
          }
        });
      }

      function processNextAnimation(vehicleId) {
        if (animationQueueMultiTrack[vehicleId] && animationQueueMultiTrack[vehicleId].length > 0) {
          const nextAnimation = animationQueueMultiTrack[vehicleId].shift();
          animateFeatureTo(nextAnimation.id, nextAnimation.newPosition, nextAnimation.newTimestamp, nextAnimation.trackData);
        }
      }
    }

     function animateBadgeFeatureTo(feature, targetLon, targetLat, duration = 2000) {
        const geometry = feature.getGeometry();
        if (!(geometry instanceof ol.geom.Point)) return;

        const start = geometry.getCoordinates();
        const end = ol.proj.fromLonLat([targetLon, targetLat]);

        const startTime = Date.now();

        function animate() {
          const elapsed = Date.now() - startTime;
          const fraction = Math.min(elapsed / duration, 1);

          // linear interpolation
          const current = [
            start[0] + (end[0] - start[0]) * fraction,
            start[1] + (end[1] - start[1]) * fraction
          ];

          geometry.setCoordinates(current);

          if (fraction < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
      }

    featuresData.forEach(f => {
      if (!animationQueueMultiTrack[f.id]) {
        animationQueueMultiTrack[f.id] = []; // Initialize the queue for each vehicle
      }
      animateFeatureTo(f.id, f.position, f.time, f.trackData);
    });
  },
	stopMultiVehicleTrack : function(param){
		const map = param.map;
    const layer = param.layer ? param.layer : "multiTrackLayer";
		if (glbVectorSource) {
			glbVectorSource.clear();
		}
		
		if (glbPathSource) {
		   glbPathSource.clear();
		}
		
		if (glbVectorLayer) {
			map.removeLayer(glbVectorLayer);
		}
		
		if (glbPathLayer) {
			map.removeLayer(glbPathLayer);
		}

    if(glbTrackBadgeLayer.get(layer)){
      let refGlbTracVec = glbTrackBadgeLayer.get(layer);
      map.removeLayer(glbTrackBadgeLayer.get(layer));
      refGlbTracVec.getSource().clear();
      glbTrackBadgeLayer.delete(layer);
      badgeTrackFeaturesByLayer.delete(layer);
    }
		
		const vehicleInfoContainer = document.getElementById('vehicle-info-container');
		if (vehicleInfoContainer) {
			vehicleInfoContainer.remove();
		}
		tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(layerObj => layerObj.title !== layer);
    tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(layerObj => layerObj.title !== 'multiTrackLayer');
		animationQueueMultiTrack = {};  
		isAnimatingMultiTrack = {};  
	}
}


/**
 * Multi Vehicle Trip Playback
 */

tmpl.Trip.multiVehicleTripPlayback = function(param) {
	const map = param.map;
	const data = param.data;


	const vectorSource = new ol.source.Vector();
  
	const vectorLayer = new ol.layer.Vector({
	  source: vectorSource,
    id: 'multiVehicleTripLayer',
	});
  
	function calculateAngle(start, end) {
	  if (!start || !end) return 0;
  
	  const dx = end[0] - start[0];
	  const dy = end[1] - start[1];
  
	  let angle = Math.atan2(dy, dx);
  
	  return -(angle - Math.PI / 2); 
	}
  
	map.addLayer(vectorLayer);
  
	let isPlaying = false;
	const vehicleAnimations = []; 
  
	data.forEach(vehicleData => {
    const vehicleIconUrl = vehicleData.imgUrl ? vehicleData.imgUrl : appConfigInfo.mapSDKURL+'2.png';
    const startIconUrl = vehicleData.startUrl ? vehicleData.startUrl : appConfigInfo.mapSDKURL+'start_point_mdm.png';
    const endIconUrl = vehicleData.endUrl ? vehicleData.endUrl : appConfigInfo.mapSDKURL+'end_point_mdm.png';
	  
	  const lineStringCoordinates = vehicleData.linestring
		.replace('LINESTRING(', '')
		.replace(')', '')
		.split(',')
		.map(coord => {
		  const [lon, lat] = coord.split(' ');
		  return ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]);
		});
  
	  const lineString = new ol.geom.LineString([]);
  
	  const pathFeature = new ol.Feature({
		geometry: lineString,
	  });
  
	  const pathStyle = new ol.style.Style({
		stroke: new ol.style.Stroke({
		  color: vehicleData.color || 'blue', 
		  width: 3,
		}),
	  });
  
	  pathFeature.setStyle(pathStyle);
  
	  vectorSource.addFeature(pathFeature);
  
	  const vehicleFeature = new ol.Feature({
		geometry: new ol.geom.Point(lineStringCoordinates[0]),
	  });
  
	  const vehicleStyle = new ol.style.Style({
		image: new ol.style.Icon({
		  src: vehicleIconUrl,
		  scale: vehicleData.vehicleIconScale || 1, 
		  rotation: 0, 
		}),
	  });
  
	  vehicleFeature.setStyle(vehicleStyle);
  
	  vectorSource.addFeature(vehicleFeature);
  
	  const startFeature = new ol.Feature({
		geometry: new ol.geom.Point(lineStringCoordinates[0]),
	  });
  
	  const vehicleStartStyle = new ol.style.Style({
		image: new ol.style.Icon({
		  src: startIconUrl,
		  scale: vehicleData.startUrlIconScale || 1,
		  rotation: 0, 
		}),
	  });
  
	  startFeature.setStyle(vehicleStartStyle);
	  vectorSource.addFeature(startFeature);
  
	  const coordsLength = lineStringCoordinates.length;
  
	  const endFeature = new ol.Feature({
		geometry: new ol.geom.Point(lineStringCoordinates[coordsLength - 1]),
	  });
  
	  const vehicleEndStyle = new ol.style.Style({
		image: new ol.style.Icon({
		  src: endIconUrl,
		  scale: vehicleData.endUrlIconScale || 1, 
		  rotation: 0, 
		}),
	  });
  
	  endFeature.setStyle(vehicleEndStyle);
	  vectorSource.addFeature(endFeature);
  
	  const animationState = {
		index: 0,
		t: 0, 
		animationId: null, 
		coordinates: lineStringCoordinates,
		lineString,
		pathFeature,
		vehicleFeature,
		times: vehicleData.times || [],
		speeds: vehicleData.speeds || [],
		locations: vehicleData.locations || [],
		speedFactor: 0.02, 
	  };
  
	  vehicleAnimations.push(animationState);
  
	  function animateVehicle() {
		if (!isPlaying) return; 
  
		const { index, coordinates, vehicleFeature, lineString, pathFeature, times, speeds, locations, speedFactor } = animationState;
		if (index < coordinates.length - 1) {
		  const start = coordinates[index];
		  const end = coordinates[index + 1];
  
		  const currentPosition = [
			start[0] + (end[0] - start[0]) * animationState.t,
			start[1] + (end[1] - start[1]) * animationState.t,
		  ];
  
		  vehicleFeature.setGeometry(new ol.geom.Point(currentPosition));
  
		  lineString.appendCoordinate(currentPosition);
  
		  pathFeature.setGeometry(lineString);
  
		  animationState.t += speedFactor; 
  
		  if (animationState.t >= 1) {
			animationState.t = 0;
			animationState.index++;
  
			const nextIndex = animationState.index + 1;
			if (nextIndex < coordinates.length) {
			  const nextCoordinate = coordinates[nextIndex];
			  const angle = calculateAngle(currentPosition, nextCoordinate);
			  vehicleFeature.getStyle().getImage().setRotation(angle); // Align the icon
			}
		  }
  
		  const currentIndex = Math.min(index, times.length - 1); // Ensure index doesn't exceed array length
		  const lonLatPosition = ol.proj.toLonLat(currentPosition); // Convert back to [lon, lat]
		  updateVehicleDetails(`v${vehicleData.vehicleId || `vehicle-${data.indexOf(vehicleData)}`}`, {
			position: lonLatPosition.map(coord => coord.toFixed(6)).join(", "), // Format as lat, lon
			speed: speeds[currentIndex] !== undefined ? `${speeds[currentIndex]} km/h` : "N/A",
			location: locations[currentIndex] || "N/A",
			time: times[currentIndex] || "N/A",
		  });
  
		  animationState.animationId = requestAnimationFrame(animateVehicle);
		} else {
		  cancelAnimationFrame(animationState.animationId);
		}
	  }
  
	  animationState.animate = animateVehicle;
	});
  

  function updateVehicleDetails(vehicleId, details) {
    const positionElement = document.getElementById(`positionMultiTrack-${vehicleId}`);
    const speedElement = document.getElementById(`speedMultiTrack-${vehicleId}`);
    const locationElement = document.getElementById(`locationMultiTrack-${vehicleId}`);
    const timeElement = document.getElementById(`timeMultiTrack-${vehicleId}`);
    
    if (positionElement) {
      positionElement.childNodes[0].textContent = details.position; 
    }
    if (speedElement) {
      speedElement.childNodes[0].textContent = details.speed; 
    }
    if (locationElement) {
      locationElement.childNodes[0].textContent = details.location;
    }
    if (timeElement) {
      timeElement.childNodes[0].textContent = details.time; 
    }
  }
  
	let container = document.getElementById("vehicle-info-container");
	if (!container) {
	  container = document.createElement("div");
	  container.id = "vehicle-info-container";
	  document.body.appendChild(container);
	}
  
	data.forEach((vehicleData, index) => {
	  const lineStringCoordinates = vehicleData.linestring
		.replace('LINESTRING(', '')
		.replace(')', '')
		.split(',')
		.map(coord => {
		  const [lon, lat] = coord.split(' ');
		  return ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]);
		});
	  const initialPosition = ol.proj.toLonLat(lineStringCoordinates[0]); // Convert initial position back
	  const initialIndex = 0;
	  const initialSpeed = vehicleData.speeds?.[initialIndex] !== undefined ? `${vehicleData.speeds[initialIndex]} km/h` : "N/A";
	  const initialLocation = vehicleData.locations?.[initialIndex] || "N/A";
	  const initialTime = vehicleData.times?.[initialIndex] || "N/A";
	  const sanitizedVehicleId = `v${vehicleData.vehicleId || `vehicle-${index}`}`;
  
	  const dropdownContainer = document.createElement("div");
	  dropdownContainer.classList.add("vehicle-dropdown-container");
  
	  const vehicleDropdown = document.createElement("button");
	  vehicleDropdown.classList.add("vehicle-dropdown");
	  vehicleDropdown.textContent = vehicleData.vehicleId || `Vehicle ${index + 1}`;
	  vehicleDropdown.onclick = function () {
		const detailsDiv = dropdownContainer.querySelector(`#${sanitizedVehicleId}_details`);
		detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
	  };
  
	  dropdownContainer.appendChild(vehicleDropdown);
  
	  const vehicleDetailsDiv = document.createElement("div");
	  vehicleDetailsDiv.id = `${sanitizedVehicleId}_details`;
	  vehicleDetailsDiv.style.display = "none";
  
	  const detailsTable = `
		<table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
		  <tr>
			<td style="font-weight: bold; width: 40%;">Vehicle No:</td>
			<td style="width: 60%;" id="vehicleNumberMultiTrack-${sanitizedVehicleId}">${vehicleData.vehicleId || `Vehicle ${index + 1}`}<hr></td>
		  </tr>
		  <tr>
			<td style="font-weight: bold;">Position:</td>
			<td id="positionMultiTrack-${sanitizedVehicleId}">${initialPosition.map(coord => coord.toFixed(6)).join(", ")}<hr></td>
		  </tr>
		  <tr>
			<td style="font-weight: bold;">Speed:</td>
			<td id="speedMultiTrack-${sanitizedVehicleId}">${initialSpeed}<hr></td>
		  </tr>
		  <tr>
			<td style="font-weight: bold;">Location:</td>
			<td style="word-wrap: break-word; max-width: 200px;" id="locationMultiTrack-${sanitizedVehicleId}">${initialLocation}<hr></td>
		  </tr>
		  <tr>
			<td style="font-weight: bold;">Time:</td>
			<td id="timeMultiTrack-${sanitizedVehicleId}">${initialTime}<hr></td>
		  </tr>
		</table>
	  `;
  
	  vehicleDetailsDiv.innerHTML = detailsTable;
	  dropdownContainer.appendChild(vehicleDetailsDiv);
	  container.appendChild(dropdownContainer);
	});
  
	const infoStyle = document.createElement("style");
	infoStyle.innerHTML = `
	  #vehicle-info-container {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1000;
		width: 18%;
		max-height: 90%;
		overflow-y: auto;
		padding: 10px;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		text-align: center;
	  }
  
	  .vehicle-dropdown-container {
		margin-bottom: 10px;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	  }
  
	  .vehicle-dropdown {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		font-size: 16px;
		background-color: #f0f0f0;
		border: none;
		cursor: pointer;
		text-align: center;
		border-radius: 5px;
		color: black;
	  }
  
	  .vehicle-dropdown:hover {
		background-color: #ddd;
	  }
  
	  .vehicle-dropdown:focus {
		outline: none;
	  }
  
	  td {
		word-wrap: break-word;
		max-width: 200px;
		color: black;
	  }
	`;
	document.head.appendChild(infoStyle);
  
	const controls = document.createElement("div");
	controls.className = "map-controls";
	controls.innerHTML = `
	  <button id="playBtn">Play</button>
	  <button id="pauseBtn">Pause</button>
	  <button id="stopBtn">Stop</button>
	  <label>Speed:</label>
	  <select id="speedDropdown">
		  <option value="1">1x</option>
		  <option value="2">2x</option>
		  <option value="3">3x</option>
		  <option value="5">5x</option>
		  <option value="10">10x</option>
	  </select>
	`;
	document.getElementById(globalMapDivID).appendChild(controls);
  
	const style = document.createElement("style");
	style.innerHTML = `
	  .map-controls {
		position: absolute;
		bottom: 2%;
		left: 41%;
		background: rgba(255, 255, 255, 0.8);
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
		display: flex;
		gap: 5px;
	  }
	  .map-controls button, .map-controls select {
		padding: 5px;
		border: 1px solid #ccc;
		cursor: pointer;
		font-size: 14px;
	  }
	  .map-controls button:hover {
		background: #ddd;
	  }
	`;
	document.head.appendChild(style);
  
	const playBtn = controls.querySelector("#playBtn");
	const pauseBtn = controls.querySelector("#pauseBtn");
	const stopBtn = controls.querySelector("#stopBtn");
	const speedDropdown = controls.querySelector("#speedDropdown");
  
	playBtn.addEventListener("click", () => {
	  if (!isPlaying) {
		isPlaying = true;
		vehicleAnimations.forEach(animationState => {
		  if (animationState.index === 0 && animationState.t === 0) {
			animationState.vehicleFeature.getStyle().getImage().setRotation(0);
		  }
		  if (animationState.index < animationState.coordinates.length - 1) {
			animationState.animate();
		  }
		});
	  }
	});
  
	pauseBtn.addEventListener("click", () => {
	  if (isPlaying) {
		isPlaying = false;
		vehicleAnimations.forEach(animationState => {
		  cancelAnimationFrame(animationState.animationId);
		});
	  }
	});
  
	stopBtn.addEventListener("click", () => {
	  isPlaying = false;
	  vehicleAnimations.forEach(animationState => {
		cancelAnimationFrame(animationState.animationId);
	
		animationState.index = 0;
		animationState.t = 0;
		animationState.lineString.setCoordinates([]); // Clear the path
		animationState.vehicleFeature.setGeometry(
		  new ol.geom.Point(animationState.coordinates[0])
		); 
		animationState.vehicleFeature.getStyle().getImage().setRotation(0); // Reset rotation
	  });
	});
  
	speedDropdown.addEventListener("change", () => {
	  const speedMultiplier = parseFloat(speedDropdown.value); // Get selected multiplier (1, 2, 3, 5, 10)
	  vehicleAnimations.forEach(animationState => {
		animationState.speedFactor = 0.02 * speedMultiplier;
	  });
	});
}

tmpl.Trip.removeMultiVehicleTrip = function(param) {
  const map = param.map;
  const layers = map.getLayers().getArray();
  const tripLayer = layers.find(layer => layer.get('id') === 'multiVehicleTripLayer');
  if (tripLayer) {
    const vectorSource = tripLayer.getSource();
    if (vectorSource instanceof ol.source.Vector) {
      
      vectorSource.getFeatures().forEach(feature => {
        if (feature.getStyle() && feature.getStyle().getImage() instanceof ol.style.Icon) {
          cancelAnimationFrame(feature.get('animationId')); 
        }
      });
      vectorSource.clear();
    }
    map.removeLayer(tripLayer); 
  }

  const infoContainer = document.getElementById("vehicle-info-container");
  if (infoContainer) {
    infoContainer.remove();
  }

  const controlsContainer = document.querySelector(".map-controls");
  if (controlsContainer) {
    controlsContainer.remove();
  }
};

tmpl.Map.localize = function (param) {
	language = param.language;
	queryableLayers = param.layerdata;
	try {
		if (language === 'ar' || language == 'ar') {
			$('.ol-zoom-in').attr('title', 'تكبير');
			$('.ol-zoom-out').attr('title', 'تصغير');
			$('.controls1').attr('placeholder', 'بحث');
			$('.ol-Search').attr('placeholder', 'بحث');

			$('.ol-map-pointbtn').attr('title', 'ارسم النقاط');
			$('.ol-map-linebtn').attr('title', 'ارسم الخطوط');
			$('.ol-map-polygonbtn').attr('title', 'ارسم المضلعات');
			$('.ol-map-Circlebtn').attr('title', 'رسم دائرة');
		}
		else {
			$('.ol-zoom-in').attr('title', 'Zoom In');
			$('.ol-zoom-out').attr('title', 'Zoom Out');
			$('.controls1').attr('placeholder', 'Search');
			$('.ol-Search').attr('placeholder', 'Search');

			$('.ol-map-pointbtn').attr('title', 'Draw Point');
			$('.ol-map-linebtn').attr('title', 'Draw Line');
			$('.ol-map-polygonbtn').attr('title', 'Draw Polygon');
			$('.ol-map-Circlebtn').attr('title', 'Draw Circle');
		}
	} catch (e) {
		console.log("Error..", e);
	}
}


let glbTrackBadgeLayer = new Map();
const badgeTrackFeaturesByLayer = new Map();
let glbBadgeLayerTrack;
tmpl.Track.multiVehicleBadge = function(param) {
  const mapObj = param.map;
  const features = param.vehicleData;
  let vectorSource;
  let layerName = param.layer? param.layer : "multiTrackLayer";
  glbBadgeLayerTrack = layerName;

  console.log(glbVectorSource)
  console.log(param);

  vectorSource = glbVectorSource;

  let badgeLayer = glbTrackBadgeLayer.get(layerName);
	if (!badgeLayer) {
		badgeLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: function (feature) {
				return feature.get('isBadgeRequired') ? createTrackBadgeStyle(feature.get('badgeText'),feature) : null;
			}
		});
		mapObj.addLayer(badgeLayer);
		glbTrackBadgeLayer.set(layerName, badgeLayer);
	}

	features.forEach(obj => {
		try {
			if (vectorSource != undefined && vectorSource.getFeatureById(obj.id) != undefined) {
				const existingFeature = vectorSource.getFeatureById(obj.id);

				if (existingFeature) {
					console.log("existingFeature",existingFeature);
					existingFeature.set('isBadgeRequired', obj.isBadgeRequired);
					existingFeature.set('badgeText', obj.badgeText);


					if (obj.isBadgeRequired) {
						enableBadgeForTrackFeature(obj.id, obj.badgeText, vectorSource, layerName,obj);
					} else {
						disableBadgeForTrackFeature(obj.id, layerName);
					}
				}
			}
		} catch (err) {

		}

	});
}


function enableBadgeForTrackFeature(id, text, vectorSource, layerName,obj) {
	const existingFeature = vectorSource.getFeatureById(id);
	if (!existingFeature) {
		console.warn(`Feature with ID ${id} not found.`);
		return;
	}

	let badgeLayer = glbTrackBadgeLayer.get(layerName);
	if (!badgeLayer) {
		console.warn(`Badge layer for "${layerName}" not found.`);
		return;
	}

	let badgeFeatures = badgeTrackFeaturesByLayer.get(layerName);
	if (!badgeFeatures) {
		badgeFeatures = new Map();
		badgeTrackFeaturesByLayer.set(layerName, badgeFeatures);
	}

	try {
		const featureTrack = glbVectorSource.getFeatures().find(f => f.get('id') == id);
		console.log("featureTrack",featureTrack.getProperties().badgeText);
		if(featureTrack){
			featureTrack.getProperties().badgeText = text;
			console.log("featureTrack",featureTrack.getProperties().badgeText);
		}
	} catch (error) {
		console.warn("Error updating main feature badgeText property:", error);
	}

	if (badgeFeatures.has(id)) {
		const badgeFeature = badgeFeatures.get(id);
		badgeFeature.set('badgeText', text);
		badgeFeature.setStyle(createTrackBadgeStyle(text)); // Restore badge style
		return;
	}

	const badgeFeature = new ol.Feature({
		geometry: existingFeature.getGeometry().clone(),
		badgeText: text
	});

	//   badgeFeature.setStyle(createTrackBadgeStyle(text, badgeFeature));

	badgeFeature.setId(`badge-${id}`);
	badgeFeature.set('isBadgeRequired', true);
	badgeFeature.set('object',obj);
	badgeFeatures.set(id, badgeFeature);
	badgeLayer.getSource().addFeature(badgeFeature);
}


function disableBadgeForTrackFeature(id, layerName) {
	const badgeFeatures = badgeTrackFeaturesByLayer.get(layerName);
	if (!badgeFeatures) return;

	const badgeFeature = badgeFeatures.get(id);
	if (badgeFeature) {
		let badgeLayer = glbTrackBadgeLayer.get(layerName);
		if (badgeLayer) {
			badgeLayer.getSource().removeFeature(badgeFeature);
		}
		badgeFeatures.delete(id);
	}
}

function createTrackBadgeStyle(text,feature) {
	// console.log("text",feature);
	let objProp = feature.get('object');
	return new ol.style.Style({
		text: new ol.style.Text({
			text: text || "B",
			font: objProp.font || 'Bold 12px Arial',
			fill: objProp.fillColor!=undefined ? new ol.style.Fill({ color: objProp.fillColor }) : new ol.style.Fill({ color: 'white' }),
			stroke: objProp.color!= undefined ? new ol.style.Stroke({ color: objProp.color, width: 6 }) : new ol.style.Stroke({ color: 'red', width: 6 }),
			padding: [5, 5, 5, 5],
			textAlign: 'center',
			offsetY: -25,
			offsetX: 15
		})
	});
}

// tmpl.Overlay.updateTrackBadgeText = function(param) {
// 	const mapObj = param.map;
// 	const id = param.id;
// 	let badgeFeatures = badgeTrackFeaturesByLayer.get('multiTrackLayer');
// 	console.log(badgeFeatures.get('car1'));
// }

tmpl.Overlay.updateTrackBadgeText = function(param) {
    const mapObj = param.map;
    const id = param.id;
    const newText = param.text || param.badgeText;
    const layerName = param.layer || 'multiTrackLayer';
    
    // Get badge layer and features
    let badgeLayer = glbTrackBadgeLayer.get(layerName);
    let badgeFeatures = badgeTrackFeaturesByLayer.get(layerName);
    
    if (!badgeLayer) {
        console.warn(`Badge layer "${layerName}" not found.`);
        return false;
    }
    
    if (!badgeFeatures) {
        console.warn(`No badge features found for layer: ${layerName}`);
        return false;
    }
    
    const badgeFeature = badgeFeatures.get(id);
    
    if (!badgeFeature) {
        console.warn(`Badge feature with ID ${id} not found in layer: ${layerName}`);
        
        // Optional: Create badge if it doesn't exist
        if (param.createIfNotExists && glbVectorSource) {
            const mainFeature = glbVectorSource.getFeatureById(id);
            if (mainFeature) {
                enableBadgeForTrackFeature(id, newText, glbVectorSource, layerName, {
                    font: param.font,
                    fillColor: param.fillColor,
                    color: param.color
                });
                return true;
            }
        }
        
        return false;
    }
    
    // Update badge text
    badgeFeature.set('badgeText', newText);
    
    // Update object properties if provided
    let objProp = badgeFeature.get('object') || {};
    let styleChanged = false;
    
    if (param.font !== undefined) {
        objProp.font = param.font;
        styleChanged = true;
    }
    if (param.fillColor !== undefined) {
        objProp.fillColor = param.fillColor;
        styleChanged = true;
    }
    if (param.color !== undefined) {
        objProp.color = param.color;
        styleChanged = true;
    }
    
    if (styleChanged) {
        badgeFeature.set('object', objProp);
    }
    
    // Update geometry position if main feature has moved
    if (glbVectorSource) {
        const mainFeature = glbVectorSource.getFeatureById(id);
        if (mainFeature) {
            const currentGeom = badgeFeature.getGeometry();
            const newGeom = mainFeature.getGeometry();
            
            // Only update if position changed
            if (currentGeom.getCoordinates().toString() !== newGeom.getCoordinates().toString()) {
                badgeFeature.setGeometry(newGeom.clone());
            }
        }
    }
    
    // Update offset if provided
    if (param.offsetX !== undefined || param.offsetY !== undefined) {
        objProp.offsetX = param.offsetX !== undefined ? param.offsetX : (objProp.offsetX || 15);
        objProp.offsetY = param.offsetY !== undefined ? param.offsetY : (objProp.offsetY || -25);
        badgeFeature.set('object', objProp);
    }
    
    // Force re-render
    badgeFeature.changed();
    
    // Optional callback
    if (typeof param.onUpdate === 'function') {
        param.onUpdate(badgeFeature);
    }

	try {
		console.log("Updating main feature badgeText property:");
		const featureTrack = glbVectorSource.getFeatures().find(f => f.get('id') == id);
		console.log("featureTrack",featureTrack.getProperties().badgeText);
		if(featureTrack){
			console.log("feat",featureTrack)
			featureTrack.set('badgeText', newText);
			console.log("featureTrack",featureTrack.getProperties().badgeText);
		}
	} catch (error) {
		console.warn("Error updating main feature badgeText property:", error);
	}
    
    return true;
}