// === Initialize the namespace and tracker ===
tmpl.UtilityNetwork = tmpl.UtilityNetwork || {};
tmpl.UtilityNetwork._flowEntities3D = []; // <-- Add this only once, globally
window.layerHtmlMap = window.layerHtmlMap || {};

// === Helper: Clear previous 3D animated entities ===
tmpl.UtilityNetwork.clear3DAnimations = function (mapObj) {
    tmpl.UtilityNetwork._flowEntities3D.forEach(({ entity, cancelFunc }) => {
        if (cancelFunc) cancelFunc();
        mapObj.entities.remove(entity);
    });
    tmpl.UtilityNetwork._flowEntities3D = [];
};

tmpl.UtilityNetwork.water = function (params) {
    var mapObj = params.map;
    var layername = params.layername;
    var piperadius = params.radius || 7;
    var animation = params.animation || false;
    var defaultFlowDirection = params.flowDirection || 'forward';
    var defaultIconUrl = params.iconUrl;
    var color = params.color || '#486581';
    var moleculeColor = params.moleculeColor || '#00ffff';
    var flowRates = params.flowRates || {
        'wspipe-57': 0,  // slower flow
        'wspipe-14': 0,  // faster flow
        'wspipe-60': 0,    // no animation
    };
    var onFeatureHover = params.flowCallback;
    var zIndex = params.zIndex || 1;
    var html = params.html || null
    if (params.layername && html) {
        window.layerHtmlMap[params.layername] = html;
    }

    try {
        if (!mapObj || !layername) {
            return { status: false, message: 'Invalid mapObj or layername' };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter: ' + error.message };
        }
    }

    try {
        if (appConfigInfo.mapDimension == "2D") {
            if (appConfigInfo.mapLib == 'ol7') {
                var Layers = mapObj.getLayers();
                var existingPipeLayer = null;
                var existingPointLayer = null;

                for (var i = 0; i < Layers.getLength(); i++) {
                    var layer = Layers.item(i);
                    if (layer.get('title') === layername) {
                        existingPipeLayer = layer;
                    }
                    if (layer.get('title') === layername + '_points') {
                        existingPointLayer = layer;
                    }
                }

                if (existingPipeLayer) {
                    if (!animation && existingPointLayer) {
                        mapObj.removeLayer(existingPointLayer);
                        tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                            entry => entry.title !== layername + '_points'
                        );
                        tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                            entry => entry.title !== layername + '_points'
                        );
                        return { status: true, message: 'Animation stopped and point layer removed.' };
                    }

                    if (animation && existingPointLayer) {
                        return { status: true, message: 'Animation already running.' };
                    }

                    if (animation && !existingPointLayer) {
                        startAnimation(layername, mapObj, piperadius, defaultFlowDirection, existingPipeLayer,moleculeColor);
                        return { status: true, message: 'Animation started.' };
                    }

                    return { status: true, message: 'Pipe layer already exists, no animation change.' };
                } else if (existingPointLayer) {
                    mapObj.removeLayer(existingPointLayer);
                    tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                        entry => entry.title !== layername + '_points'
                    );
                    tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                        entry => entry.title !== layername + '_points'
                    );
                }

                tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                    entry => entry.title !== layername && entry.title !== layername + '_points'
                );
                tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                    entry => entry.title !== layername && entry.title !== layername + '_points'
                );
                tmpl.Map.getWFSLayerData({
                    geoserverlayername: layername,
                    callback: function (data) {
                        var geojsonFormat = new ol.format.GeoJSON();
                        var rawFeatures = JSON.parse(data).features;

                        var features = rawFeatures.map(function (rawFeature) {
                            var feature = geojsonFormat.readFeature(rawFeature, {
                                featureProjection: 'EPSG:3857'
                            });
                            if (rawFeature.id) {
                                feature.setId(rawFeature.id);
                                feature.set('id', rawFeature.id);
                                feature.set('name', rawFeature.properties.name);
                            }
                            if (!feature.get('status') || feature.get('pressure') === undefined) {
                                feature.set('status', 'unknown');
                            }
                            return feature;
                        });

                        var vectorSource = new ol.source.Vector({ features: features });

                        function getGenericStyle(feature, resolution, map) {
                            var geometryType = feature.getGeometry().getType();
                            var status = feature.get('status') || 'unknown';

                            if (status === 'blocked') color = 'red';
                            else if (status === 'optimal') color = 'darkblue';
                            else if (status === 'reduced') color = 'lightblue';
                            else if (status === 'no_flow') color = 'white';

                            if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                                var iconUrl = feature.get('icon_url') || defaultIconUrl;

                                if (iconUrl == null) {
                                    return new ol.style.Style({
                                        zIndex: zIndex,
                                        image: new ol.style.Circle({
                                            radius: 6,
                                            fill: new ol.style.Fill({ color: color }),
                                            stroke: new ol.style.Stroke({ color: '#000', width: 1 })
                                        })
                                    });
                                } else {
                                    return new ol.style.Style({
                                        zIndex: zIndex,
                                        image: new ol.style.Icon({
                                            src: iconUrl,
                                            scale: 0.2,
                                            anchor: [0.5, 1]
                                        })
                                    });
                                }
                            }
                            else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                                const geometry = feature.getGeometry();
                                const extent = geometry.getExtent();

                                // Calculate pixel dimensions of the polygon
                                const widthMapUnits = extent[2] - extent[0];
                                const heightMapUnits = extent[3] - extent[1];
                                const pixelWidth = widthMapUnits / resolution;
                                const pixelHeight = heightMapUnits / resolution;

                                // Only show text if the polygon is big enough on screen
                                if (pixelWidth < 50 || pixelHeight < 50) {
                                    return new ol.style.Style({
                                        fill: new ol.style.Fill({ color: 'rgba(173, 216, 230, 1)' }),
                                        stroke: new ol.style.Stroke({ color: 'blue', width: 2 })
                                    });
                                }

                                return new ol.style.Style({
                                    fill: new ol.style.Fill({ color: 'rgba(173, 216, 230, 1)' }),
                                    stroke: new ol.style.Stroke({ color: 'blue', width: 2 }),
                                    text: new ol.style.Text({
                                        text: feature.get('name') || '',
                                        font: '12px',
                                        fill: new ol.style.Fill({ color: '#000' }),
                                        stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                                        overflow: false,
                                        placement: 'point',
                                        geometry: geometry.getInteriorPoint()
                                    })
                                });
                            }
                            else {
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: color,
                                        width: piperadius
                                    })
                                });
                            }
                        }

                        var layer = new ol.layer.Vector({
                            source: vectorSource,
                            style: getGenericStyle
                        });
                        layer.set('title', layername);
                        layer.setZIndex(100);
                        mapObj.addLayer(layer);

                        // === Tooltip Setup ===
                        const tooltip = document.createElement('div');
                        tooltip.id = 'custom-tooltip-flowDiv';
                        tooltip.style.position = 'absolute';
                        tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '4px 8px';
                        tooltip.style.borderRadius = '4px';
                        tooltip.style.whiteSpace = 'nowrap';
                        tooltip.style.display = 'none';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.zIndex = 1000;
                        document.body.appendChild(tooltip);

                        mapObj.on('pointermove', function (evt) {
                            if (evt.dragging) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            // Skip hover tooltip if mouse is over the custom popup
                            const hoveredElement = evt.originalEvent.target;
                            if (hoveredElement.closest && hoveredElement.closest('.ol-popup')) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            const pixel = mapObj.getEventPixel(evt.originalEvent);
                            const feature = mapObj.forEachFeatureAtPixel(pixel, function (feature, layerAtPixel) {
                                // IMPORTANT: Only return features from THIS specific layer
                                if (layerAtPixel === layer) {  // 'layer' is the one we just created
                                    return feature;
                                }
                            });

                            if (!feature) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            // Get feature properties - try different possible property names
                            const id = feature.get('id') || feature.get('pipeId') || feature.get('junctionId') || feature.get('reservoirId') || 'Unknown';
                            const name = feature.get('name') || 'Unknown';
                            const groupid = feature.get('groupid') || '';

                            let content;
                            if (html && window.layerHtmlMap && window.layerHtmlMap[layername]) {
                                content = window.layerHtmlMap[layername];
                            } else {
                                content = `ID: ${id}<br>Name: ${name}`;
                            }

                            tooltip.innerHTML = content;
                            tooltip.style.left = evt.originalEvent.pageX + 10 + 'px';
                            tooltip.style.top = evt.originalEvent.pageY + 10 + 'px';
                            tooltip.style.display = 'block';

                            // Call the hover callback if it exists
                                onFeatureHover(id, name, feature);
                            
                        });

                        // Track globally
                        const entry = {
                            layer: layer,
                            title: layername,
                            visibility: true,
                            map: mapObj
                        };
                        tmpl_setMap_layer_global.push(entry);
                        tmpl_setMap_layer_global_array.push(entry);


                        tmpl.Zoom.toLayer({
                            map: mapObj,
                            layer: layername,
                        });


                        // Animation if enabled
                        if (animation) {
                            startAnimation(layername, mapObj, piperadius, defaultFlowDirection, layer, flowRates,moleculeColor);
                        }
                    }
                });
            }

        }
        else {
            // Clear any existing 3D animations
            tmpl.UtilityNetwork.clear3DAnimations(mapObj);

            // Helper: Convert to Cesium Cartesian3 with terrain fallback
            async function toCartesian3WithTerrain(coords, terrainProvider, fallbackHeight = 0, terrainOffset = 0) {
                const cartographics = coords.map(coord =>
                    Cesium.Cartographic.fromDegrees(coord[0], coord[1])
                );

                if (terrainProvider && terrainProvider.availability) {
                    try {
                        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, cartographics);
                        return updatedPositions.map(pos =>
                            Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, pos.height + terrainOffset)
                        );
                    } catch (err) {
                        console.warn("Terrain sampling failed, using fallback height:", err);
                    }
                }

                return coords.map(coord =>
                    Cesium.Cartesian3.fromDegrees(coord[0], coord[1], fallbackHeight)
                );
            }

            // Fetch data from GeoServer WFS
            tmpl.Map.getWFSLayerData({
                geoserverlayername: layername,
                callback: function (data) {
                    const rawFeatures = JSON.parse(data).features;
                    const animatedEntities = [];
                    rawFeatures.forEach(async (res) => {
                        const geometryType = res.geometry.type;
                        const coords = res.geometry.coordinates;
                        if (geometryType === 'LineString') {
                            // === PIPE ===
                            const cartesianPositions = await toCartesian3WithTerrain(
                                coords,
                                mapObj.terrainProvider,
                                0,
                                0
                            );
                            if (piperadius > 2) {
                                piperadius = 2
                            }
                            const radius = piperadius;
                            const circle = [];
                            const numSegments = 100;

                            for (let i = 0; i < numSegments; i++) {
                                const angle = (i / numSegments) * Cesium.Math.TWO_PI;
                                circle.push(new Cesium.Cartesian2(
                                    radius * Math.cos(angle),
                                    radius * Math.sin(angle)
                                ));
                            }

                            const entity = mapObj.entities.add({
                                layername: layername,
                                polylineVolume: {
                                    positions: cartesianPositions,
                                    shape: circle,
                                    material: Cesium.Color.fromCssColorString(color).withAlpha(0.3),
                                    outline: true,
                                    outlineColor: Cesium.Color.fromCssColorString(color).withAlpha(0)
                                },
                                properties: {
                                    name: res.properties.name,
                                    id: res.properties.pipeId,
                                }
                            });

                            animatedEntities.push({ entity, path: cartesianPositions });

                        }

                        if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                            const pointCoords = (geometryType === 'Point') ? [coords] : coords;
                            const positions = await toCartesian3WithTerrain(
                                pointCoords,
                                mapObj.terrainProvider,
                                2,
                                2
                            );

                            positions.forEach((pos, index) => {
                                mapObj.entities.add({
                                    position: pos,
                                    point: {
                                        pixelSize: 10,
                                        color: Cesium.Color.fromCssColorString(color).withAlpha(0.9),
                                        outlineColor: Cesium.Color.BLACK,
                                        outlineWidth: 1,
                                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    },
                                    properties: {
                                        name: res.properties.name + (geometryType === 'MultiPoint' ? ` #${index + 1}` : ''),
                                        id: res.properties.junctionId
                                    },
                                    layername: layername
                                });
                            });
                        }
                        if (geometryType === 'Polygon' || geometryType === "MultiPolygon") {
                            // Ensure outer ring and holes are correctly parsed
                            const polygonCoords = coords[0]; // First ring (outer boundary)
                            const holes = coords.slice(1);   // Any inner rings

                            // Convert positions (outer ring)
                            const outerRing = await toCartesian3WithTerrain(
                                polygonCoords,
                                mapObj.terrainProvider,
                                0,
                                0
                            );

                            // Convert any inner rings (holes)
                            const holesHierarchy = await Promise.all(holes.map(async hole => {
                                return new Cesium.PolygonHierarchy(
                                    await toCartesian3WithTerrain(hole, mapObj.terrainProvider, 0, 0)
                                );
                            }));

                            // Create entity with polygon
                            const polygonEntity = mapObj.entities.add({
                                polygon: {
                                    hierarchy: new Cesium.PolygonHierarchy(outerRing, holesHierarchy),
                                    material: Cesium.Color.fromCssColorString(color).withAlpha(0.4),
                                    outline: true,
                                    outlineColor: Cesium.Color.fromCssColorString(color).withAlpha(0.8),
                                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                                },
                                properties: {
                                    name: res.properties.name,
                                    id: res.properties.reservoirId
                                },
                                layername: layername
                            });

                            const boundingSphere = Cesium.BoundingSphere.fromPoints(outerRing);

                            mapObj.camera.flyToBoundingSphere(boundingSphere, {
                                duration: 1.5,
                                offset: new Cesium.HeadingPitchRange(
                                    0,
                                    Cesium.Math.toRadians(-90),
                                    boundingSphere.radius * 2.0
                                )
                            });


                            // Optionally track it like animatedEntities (if needed)
                            animatedEntities.push({ entity: polygonEntity, path: outerRing });


                            // === Add Label at Polygon Center ===
                            const labelPosition = getGeographicCentroid(outerRing);

                            mapObj.entities.add({
                                position: labelPosition,
                                label: {
                                    text: res.properties.name,
                                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000.0),
                                    fillColor: Cesium.Color.WHITE,
                                    outlineColor: Cesium.Color.BLACK,
                                    outlineWidth: 1,
                                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

                                },
                                layername: layername
                            });

                        }

                        function getGeographicCentroid(positions) {
                            let lonSum = 0;
                            let latSum = 0;

                            for (let i = 0; i < positions.length; i++) {
                                const carto = Cesium.Cartographic.fromCartesian(positions[i]);
                                lonSum += Cesium.Math.toDegrees(carto.longitude);
                                latSum += Cesium.Math.toDegrees(carto.latitude);
                            }

                            const lonAvg = lonSum / positions.length;
                            const latAvg = latSum / positions.length;

                            return Cesium.Cartesian3.fromDegrees(lonAvg, latAvg);
                        }


                    });

                    // Optional: Flow animation on pipes
                    if (animation) {
                        rawFeatures.forEach(async (res) => {
                            if (res.geometry.type === 'LineString') {
                                const coords = res.geometry.coordinates;
                                const path = await toCartesian3WithTerrain(coords, mapObj.terrainProvider, 2.5, 2.5);
                                addFlowBillboard(path, mapObj, defaultFlowDirection, res, color, flowRates);
                            }
                        });
                    }

                    // === TOOLTIP HANDLER ===
                    const tooltipDiv = document.createElement('div');
                    tooltipDiv.id = 'custom-tooltip-flowDiv';
                    tooltipDiv.style.position = 'absolute';
                    tooltipDiv.style.background = 'rgba(0, 0, 0, 0.7)';
                    tooltipDiv.style.color = 'white';
                    tooltipDiv.style.padding = '5px';
                    tooltipDiv.style.borderRadius = '5px';
                    tooltipDiv.style.display = 'none';
                    tooltipDiv.style.pointerEvents = 'none';
                    document.body.appendChild(tooltipDiv);

                    if (mapObj._tooltipHandler) {
                        mapObj._tooltipHandler.destroy(); // Clean up old listener
                    }
                    const handler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);
                    mapObj._tooltipHandler = handler;
                    handler.setInputAction(function (movement) {
                        const position = movement.endPosition;
                        const pickedObject = mapObj.scene.pick(position);

                        if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
                            const id = pickedObject.id.properties.id || 'N/A';
                            const layername = pickedObject.id.layername || 'N/A';
                            const name = pickedObject.id.properties.name || 'N/A';

                            const canvasRect = mapObj.canvas.getBoundingClientRect();

                            // Convert canvas-relative to page-relative coordinates
                            const pageX = canvasRect.left + position.x;
                            const pageY = canvasRect.top + position.y;

                            tooltipDiv.style.left = `${pageX + 10}px`;
                            tooltipDiv.style.top = `${pageY + 10}px`;
                            let content;


                            if (html) {
                                content = window.layerHtmlMap[layername];
                            } else {
                                content = `Id: ${id}<br>Name: ${name}<br>Layer: ${layername}`;
                            }

                            tooltipDiv.innerHTML = content; // Clear existing
                            onFeatureHover(id, layername);
                            tooltipDiv.style.display = 'block';
                        } else {
                            tooltipDiv.style.display = 'none';
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


                    // Zoom to all entities
                    mapObj.flyTo(mapObj.entities);
                }
            });
        }


    } catch (err) {
        return { status: false, message: 'Error in UtilityNetwork.water: ' + err.message };
    }

    return { status: true, message: 'UtilityNetwork.water API Enabled .. ' };
};

//code for ML and AL
tmpl.UtilityNetwork.waterML = function (params) {
    var mapObj = params.map;
    var layername = params.layername;
    var piperadius = params.radius || 7;
    var animation = params.animation || false;
    var defaultFlowDirection = params.flowDirection || 'forward';
    var defaultIconUrl = params.iconUrl;
    var color = params.color || 'blue';
    var moleculeColor = params.moleculeColor || '#00ffff';
    var flowRates = params.flowRates || {
        'wspipe-57': 0,  // slower flow
        'wspipe-14': 0,  // faster flow
        'wspipe-60': 0,    // no animation
    };
    var html = params.html || null
    var onFeatureHover = params.flowCallback;
    var zIndex = params.zIndex || 1;

    try {
        if (!mapObj || !layername) {
            return { status: false, message: 'Invalid mapObj or layername' };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter: ' + error.message };
        }
    }

    try {
        if (appConfigInfo.mapDimension == "2D") {
            if (appConfigInfo.mapLib == 'ol7') {
                var Layers = mapObj.getLayers();
                var existingPipeLayer = null;
                var existingPointLayer = null;

                for (var i = 0; i < Layers.getLength(); i++) {
                    var layer = Layers.item(i);
                    if (layer.get('title') === layername) {
                        existingPipeLayer = layer;
                    }
                    if (layer.get('title') === layername + '_points') {
                        existingPointLayer = layer;
                    }
                }

                if (existingPipeLayer) {
                    if (!animation && existingPointLayer) {
                        mapObj.removeLayer(existingPointLayer);
                        tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                            entry => entry.title !== layername + '_points'
                        );
                        tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                            entry => entry.title !== layername + '_points'
                        );
                        return { status: true, message: 'Animation stopped and point layer removed.' };
                    }

                    if (animation && existingPointLayer) {
                        console.log(`Animation already running for layer: ${layername}`);
                        return { status: true, message: 'Animation already running.' };
                    }

                    if (animation && !existingPointLayer) {
                        startAnimation(layername, mapObj, piperadius, defaultFlowDirection, existingPipeLayer,moleculeColor);
                        return { status: true, message: 'Animation started.' };
                    }

                    return { status: true, message: 'Pipe layer already exists, no animation change.' };
                } else if (existingPointLayer) {
                    mapObj.removeLayer(existingPointLayer);
                    tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                        entry => entry.title !== layername + '_points'
                    );
                    tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                        entry => entry.title !== layername + '_points'
                    );
                }

                tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                    entry => entry.title !== layername && entry.title !== layername + '_points'
                );
                tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                    entry => entry.title !== layername && entry.title !== layername + '_points'
                );
                tmpl.Map.getWFSLayerData({
                    geoserverlayername: layername,
                    callback: function (data) {
                        var geojsonFormat = new ol.format.GeoJSON();
                        var rawFeatures = JSON.parse(data).features;

                        var features = rawFeatures.map(function (rawFeature) {
                            var feature = geojsonFormat.readFeature(rawFeature, {
                                featureProjection: 'EPSG:3857'
                            });
                            if (rawFeature.id) {
                                feature.setId(rawFeature.id);
                                // console.log(rawFeature);
                                feature.set('id', rawFeature.id);
                                feature.set('name',rawFeature.properties.name);
                                // feature.set('name', rawFeature.properties.name);

                            }
                            if (!feature.get('status') || feature.get('pressure') === undefined) {
                                feature.set('status', 'unknown');
                            }
                            return feature;
                        });

                        var vectorSource = new ol.source.Vector({ features: features });

                        function getGenericStyle(feature, resolution, map) {
                            var geometryType = feature.getGeometry().getType();
                            var status = feature.get('status') || 'unknown';

                            if (status === 'blocked') color = 'red';
                            else if (status === 'optimal') color = 'darkblue';
                            else if (status === 'reduced') color = 'lightblue';
                            else if (status === 'no_flow') color = 'white';

                            if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                                var iconUrl = feature.get('icon_url') || defaultIconUrl;

                                if (iconUrl == null) {
                                    return new ol.style.Style({
                                        zIndex: zIndex,
                                        image: new ol.style.Circle({
                                            radius: 6,
                                            fill: new ol.style.Fill({ color: color }),
                                            stroke: new ol.style.Stroke({ color: '#000', width: 1 })
                                        })
                                    });
                                } else {
                                    return new ol.style.Style({
                                         zIndex: zIndex,
                                        image: new ol.style.Icon({
                                            src: iconUrl,
                                            scale: 0.2,
                                            anchor: [0.5, 1]
                                        })
                                    });
                                }
                            }
                            else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                                const geometry = feature.getGeometry();
                                const extent = geometry.getExtent();

                                // Calculate pixel dimensions of the polygon
                                const widthMapUnits = extent[2] - extent[0];
                                const heightMapUnits = extent[3] - extent[1];
                                const pixelWidth = widthMapUnits / resolution;
                                const pixelHeight = heightMapUnits / resolution;

                                // Only show text if the polygon is big enough on screen
                                if (pixelWidth < 50 || pixelHeight < 50) {
                                    return new ol.style.Style({
                                        fill: new ol.style.Fill({ color: 'rgba(173, 216, 230, 1)' }),
                                        stroke: new ol.style.Stroke({ color: 'blue', width: 2 })
                                    });
                                }

                                return new ol.style.Style({
                                    fill: new ol.style.Fill({ color: 'rgba(173, 216, 230, 1)' }),
                                    stroke: new ol.style.Stroke({ color: 'blue', width: 2 }),
                                    text: new ol.style.Text({
                                        text: feature.get('name') || '',
                                        font: '12px sans-serif',
                                        fill: new ol.style.Fill({ color: '#000' }),
                                        stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                                        overflow: false,
                                        placement: 'point',
                                        geometry: geometry.getInteriorPoint()
                                    })
                                });
                            }

                            else {
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: color,
                                        width: piperadius
                                    })
                                });
                            }
                        }

                        var layer = new ol.layer.Vector({
                            source: vectorSource,
                            style: getGenericStyle
                        });
                        layer.set('title', layername);
                        layer.setZIndex(100);
                        mapObj.addLayer(layer);

                        // === Tooltip Setup ===
                        const tooltip = document.createElement('div');
                        tooltip.id = 'custom-tooltip-flowDiv';
                        tooltip.style.position = 'absolute';
                        tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
                        tooltip.style.color = '#fff';
                        tooltip.style.padding = '4px 8px';
                        tooltip.style.borderRadius = '4px';
                        tooltip.style.whiteSpace = 'nowrap';
                        tooltip.style.display = 'none';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.zIndex = 1000;
                        document.body.appendChild(tooltip);

                        // === Hover Handler (ONLY FOR THIS WFS LAYER) ===
                        mapObj.on('pointermove', function (evt) {
                            if (evt.dragging) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            // Skip hover tooltip if mouse is over the custom popup
                            const hoveredElement = evt.originalEvent.target;
                            if (hoveredElement.closest && hoveredElement.closest('.ol-popup')) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            const pixel = mapObj.getEventPixel(evt.originalEvent);
                            const feature = mapObj.forEachFeatureAtPixel(pixel, function (feature, layerAtPixel) {
                                if (layerAtPixel === layer) {
                                    return feature;
                                }
                            });

                            if (!feature) {
                                tooltip.style.display = 'none';
                                return;
                            }

                            const id = feature.get('id');
                            const name = feature.get('name');
                            const groupid = feature.get('groupid');

                            if (id && name && groupid) {
                    
                                let content;
                                if (html == null) {
                                    content = `ID: ${id}<br>Name: ${name}<br>GroupId: ${groupid}`;
                                } else {
                                    content = html
                                }
                                tooltip.innerHTML = content;
                                tooltip.style.left = evt.originalEvent.pageX + 10 + 'px';
                                tooltip.style.top = evt.originalEvent.pageY + 10 + 'px';
                                tooltip.style.display = 'block';
                                onFeatureHover(id, name,feature);
                            
                            } else {
                                tooltip.style.display = 'none';
                            }
                        });

                        // Track globally
                        const entry = {
                            layer: layer,
                            title: layername,
                            visibility: true,
                            map: mapObj
                        };
                        tmpl_setMap_layer_global.push(entry);
                        tmpl_setMap_layer_global_array.push(entry);


                        tmpl.Zoom.toLayer({
                            map: mapObj,
                            layer: layername,
                        });


                        // Animation if enabled
                        if (animation) {
                            startAnimation(layername, mapObj, piperadius, defaultFlowDirection, layer, flowRates,moleculeColor);
                        }
                    }
                });

            }

        }
        else {
            // Clear any existing 3D animations
            tmpl.UtilityNetwork.clear3DAnimations(mapObj);

            // Helper: Convert to Cesium Cartesian3 with terrain fallback
            async function toCartesian3WithTerrain(coords, terrainProvider, fallbackHeight = 0, terrainOffset = 0) {
                const cartographics = coords.map(coord =>
                    Cesium.Cartographic.fromDegrees(coord[0], coord[1])
                );

                if (terrainProvider && terrainProvider.availability) {
                    try {
                        const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, cartographics);
                        return updatedPositions.map(pos =>
                            Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, pos.height + terrainOffset)
                        );
                    } catch (err) {
                        console.warn("Terrain sampling failed, using fallback height:", err);
                    }
                }

                return coords.map(coord =>
                    Cesium.Cartesian3.fromDegrees(coord[0], coord[1], fallbackHeight)
                );
            }

            // Fetch data from GeoServer WFS
            tmpl.Map.getWFSLayerData({
                geoserverlayername: layername,
                callback: function (data) {
                    const rawFeatures = JSON.parse(data).features;
                    const animatedEntities = [];
                    console.log(rawFeatures, 'data of feater')
                    const iconMap = {
                        'junction': '/images/icons/junction.png',
                        'valve': '/images/icons/valve.png',
                        'tank': '/images/icons/tank.png',
                        'default': '/images/icons/default.png'
                    };

                    rawFeatures.forEach(async (res) => {
                        const geometryType = res.geometry.type;
                        const coords = res.geometry.coordinates;

                        if (geometryType === 'LineString') {
                            // === PIPE ===
                            const cartesianPositions = await toCartesian3WithTerrain(
                                coords,
                                mapObj.terrainProvider,
                                0,
                                0
                            );
                            if (piperadius > 2) {
                                piperadius = 2
                            }
                            const radius = piperadius;
                            const circle = [];
                            const numSegments = 100;

                            for (let i = 0; i < numSegments; i++) {
                                const angle = (i / numSegments) * Cesium.Math.TWO_PI;
                                circle.push(new Cesium.Cartesian2(
                                    radius * Math.cos(angle),
                                    radius * Math.sin(angle)
                                ));
                            }

                            const entity = mapObj.entities.add({
                                layername: layername,
                                polylineVolume: {
                                    positions: cartesianPositions,
                                    shape: circle,
                                    material: Cesium.Color.fromCssColorString(color).withAlpha(0.3),
                                    outline: true,
                                    outlineColor: Cesium.Color.fromCssColorString(color).withAlpha(0)
                                },
                                properties: {
                                    name: res.properties.name,
                                    groupid: res.properties.groupid,
                                    id: res.id
                                }
                            });

                            animatedEntities.push({ entity, path: cartesianPositions });

                        }
                        if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                            const pointCoords = (geometryType === 'Point') ? [coords] : coords;

                            console.log("Normalized Point Coordinates:", pointCoords);

                            const positions = await toCartesian3WithTerrain(
                                pointCoords,
                                mapObj.terrainProvider,
                                2,
                                2
                            );

                            positions.forEach((pos, index) => {
                                console.log("Adding point at:", pos);

                                mapObj.entities.add({
                                    position: pos,
                                    point: {
                                        pixelSize: 10,
                                        color: Cesium.Color.fromCssColorString(color).withAlpha(0.9),
                                        outlineColor: Cesium.Color.BLACK,
                                        outlineWidth: 1,
                                        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                                    },
                                    properties: {
                                        name: res.properties.name + (geometryType === 'MultiPoint' ? ` #${index + 1}` : ''),
                                        groupid: res.properties.groupid,
                                        id: res.id
                                    },
                                    layername: layername
                                });
                            });
                        }


                    });

                    // Optional: Flow animation on pipes
                    if (animation) {
                        rawFeatures.forEach(async (res) => {
                            if (res.geometry.type === 'LineString') {
                                const coords = res.geometry.coordinates;
                                const path = await toCartesian3WithTerrain(coords, mapObj.terrainProvider, 2.5, 2.5);
                                addFlowBillboard(path, mapObj, defaultFlowDirection, color);
                            }
                        });
                    }

                    // === TOOLTIP HANDLER ===
                    const tooltipDiv = document.createElement('div');
                    tooltipDiv.style.position = 'absolute';
                    tooltipDiv.style.background = 'rgba(0, 0, 0, 0.7)';
                    tooltipDiv.style.color = 'white';
                    tooltipDiv.style.padding = '5px';
                    tooltipDiv.style.borderRadius = '5px';
                    tooltipDiv.style.display = 'none';
                    tooltipDiv.style.pointerEvents = 'none';
                    document.body.appendChild(tooltipDiv);

                    if (mapObj._tooltipHandler) {
                        mapObj._tooltipHandler.destroy(); // Clean up old listener
                    }
                    const handler = new Cesium.ScreenSpaceEventHandler(mapObj.canvas);
                    mapObj._tooltipHandler = handler;
                    handler.setInputAction(function (movement) {
                        const position = movement.endPosition;
                        const pickedObject = mapObj.scene.pick(position);

                        if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
                            const id = pickedObject.id.properties.id || 'N/A';
                            const layername = pickedObject.id.layername || 'N/A';
                            const name = pickedObject.id.properties.name || 'N/A';
                            const groupid = pickedObject.id.properties.groupid || 'N/A';

                            const canvasRect = mapObj.canvas.getBoundingClientRect();

                            // Convert canvas-relative to page-relative coordinates
                            const pageX = canvasRect.left + position.x;
                            const pageY = canvasRect.top + position.y;

                            tooltipDiv.style.left = `${pageX + 10}px`;
                            tooltipDiv.style.top = `${pageY + 10}px`;

                            tooltipDiv.innerHTML = ''; // Clear existing
                            tooltipDiv.innerHTML = html || `ID: ${id}<br>Layer: ${layername}<br>Name: ${name}<br>Group: ${groupid}`;

                            tooltipDiv.style.display = 'block';
                        } else {
                            tooltipDiv.style.display = 'none';
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


                    // Zoom to all entities
                    mapObj.zoomTo(mapObj.entities);
                }
            });
        }


    } catch (err) {
        return { status: false, message: 'Error in UtilityNetwork.water: ' + err.message };
    }

    return { status: true, message: 'UtilityNetwork.water API Enabled .. ' };
};

// function startAnimation(layername, mapObj, piperadius, defaultFlowDirection, pipeLayer, flowRates = {}) {
//     var features = pipeLayer.getSource().getFeatures();
//     var pointFeatures = [];

//     features.forEach(function (feature) {
//         var pipeId = feature.get('pipeId'); // Assuming unique pipe id is stored under 'id'
//         var status = feature.get('status') || 'unknown';
//         var flowRate = flowRates.hasOwnProperty(pipeId) ? flowRates[pipeId] : 1;


//         // Skip animation if status is blocked/no_flow or flowRate is 0 or undefined (no flow)
//         if (status === 'blocked' || status === 'no_flow' || flowRate === 0) {
//             feature.setStyle(new ol.style.Style({
//                 stroke: new ol.style.Stroke({
//                     color: 'blue',
//                     width: piperadius
//                 })
//             }));
//             return; // skip this pipe from animation
//         }

//         var flowDirection = feature.get('direction') || defaultFlowDirection;

//         for (let i = 0; i < 10; i++) {
//             var initialProgress = i * 0.1;
//             var pointFeature = new ol.Feature({
//                 geometry: new ol.geom.Point(feature.getGeometry().getCoordinates()[0]),
//                 parentFeature: feature,
//                 initialProgress: initialProgress,
//                 flowDirection: flowDirection,
//                 flowRate: flowRate // save flowRate on each point for speed control
//             });
//             pointFeatures.push(pointFeature);
//         }
//     });

//     var pointSource = new ol.source.Vector({ features: pointFeatures });
//     var pointLayer = new ol.layer.Vector({
//         source: pointSource,
//         style: new ol.style.Style({
//             image: new ol.style.Circle({
//                 radius: piperadius - 3,
//                 fill: new ol.style.Fill({ color: 'cyan' }),
//                 stroke: new ol.style.Stroke({ color: 'darkblue', width: 1 })
//             })
//         })
//     });

//     pointLayer.set('title', layername + '_points');
//     pointLayer.setZIndex(200);
//     mapObj.addLayer(pointLayer);
//     const pointLayerEntry = {
//         layer: pointLayer,
//         title: layername + '_points',
//         visibility: true,
//         map: mapObj
//     };
//     tmpl_setMap_layer_global.push(pointLayerEntry);
//     tmpl_setMap_layer_global_array.push(pointLayerEntry);

//     let progress = 0;
//     let animationFrameId;

//     function animatePoints() {
//         progress += 0.02;
//         if (progress > 1) progress = 0;

//         pointSource.getFeatures().forEach(function (pointFeature) {
//             var parentFeature = pointFeature.get('parentFeature');
//             var initialProgress = pointFeature.get('initialProgress');
//             var flowDirection = pointFeature.get('flowDirection');
//             var flowRate = pointFeature.get('flowRate');
//             var line = parentFeature.getGeometry();
//             var speedMultiplier = flowRate;
//             var adjustedProgress = (progress * speedMultiplier) % 1;

//             var currentProgress;
//             if (flowDirection === 'reverse') {
//                 currentProgress = (initialProgress - adjustedProgress + 1) % 1;
//             } else {
//                 currentProgress = (initialProgress + adjustedProgress) % 1;
//             }

//             var point = line.getCoordinateAt(currentProgress);
//             pointFeature.getGeometry().setCoordinates(point);
//         });

//         pointLayer.changed();
//         mapObj.render();
//         animationFrameId = requestAnimationFrame(animatePoints);
//     }

//     animatePoints();

//     pointLayer.set('animationFrameId', animationFrameId);
// }

function startAnimation(layername, mapObj, piperadius, defaultFlowDirection, pipeLayer, flowRates = {},moleculeColor='cyan') {
    var features = pipeLayer.getSource().getFeatures();
    var pointFeatures = [];

    features.forEach(function (feature) {
        var pipeId = feature.get('pipeId');
        var status = feature.get('status') || 'unknown';
        var flowRate = flowRates.hasOwnProperty(pipeId) ? flowRates[pipeId] : 1;

        if (status === 'blocked' || status === 'no_flow' || flowRate === 0) {
            feature.setStyle(new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: moleculeColor,
                    width: piperadius
                })
            }));
            return;
        }

        var flowDirection = feature.get('direction') || defaultFlowDirection;

        for (let i = 0; i < 10; i++) {
            var initialProgress = i * 0.1;
            var pointFeature = new ol.Feature({
                geometry: new ol.geom.Point(feature.getGeometry().getCoordinates()[0]),
                parentFeature: feature,
                initialProgress: initialProgress,
                flowDirection: flowDirection,
                flowRate: flowRate
            });
            pointFeatures.push(pointFeature);
        }
    });

    var pointSource = new ol.source.Vector({ features: pointFeatures });
    var pointLayer = new ol.layer.Vector({
        source: pointSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: piperadius - 3,
                // fill: new ol.style.Fill({ color: 'cyan' }),
                // stroke: new ol.style.Stroke({ color: 'darkblue', width: 1 })
                fill: new ol.style.Fill({ color: moleculeColor }),
                stroke: new ol.style.Stroke({ color: 'darkblue', width: 1 })
            })
        }),
        // ✅ KEY FIX: Set rendering mode to optimize performance
        renderMode: 'image',
        updateWhileAnimating: true,
        updateWhileInteracting: false  // Don't update during user interaction
    });

    pointLayer.set('title', layername + '_points');
    pointLayer.setZIndex(200);
    mapObj.addLayer(pointLayer);
    
    const pointLayerEntry = {
        layer: pointLayer,
        title: layername + '_points',
        visibility: true,
        map: mapObj
    };
    tmpl_setMap_layer_global.push(pointLayerEntry);
    tmpl_setMap_layer_global_array.push(pointLayerEntry);

    let progress = 0;
    let animationFrameId;
    let lastTime = performance.now();
    let isInteracting = false;
    
    // ✅ Track user interactions to pause animation
    const interactionStartHandler = function() {
        isInteracting = true;
    };
    
    const interactionEndHandler = function() {
        isInteracting = false;
    };
    
    // Listen to map interactions
    mapObj.on('movestart', interactionStartHandler);
    mapObj.on('moveend', interactionEndHandler);
    
    // Store handlers for cleanup
    pointLayer.set('interactionHandlers', {
        start: interactionStartHandler,
        end: interactionEndHandler
    });

    function animatePoints(currentTime) {
        // ✅ Throttle animation to ~30 FPS for better performance
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime < 33) { // ~30 FPS (1000ms / 30)
            animationFrameId = requestAnimationFrame(animatePoints);
            return;
        }
        
        lastTime = currentTime;
        
        // ✅ Skip updates during user interaction (zoom/pan)
        if (isInteracting) {
            animationFrameId = requestAnimationFrame(animatePoints);
            return;
        }

        progress += 0.02;
        if (progress > 1) progress = 0;

        // ✅ Batch geometry updates
        const featuresToUpdate = pointSource.getFeatures();
        
        featuresToUpdate.forEach(function (pointFeature) {
            var parentFeature = pointFeature.get('parentFeature');
            var initialProgress = pointFeature.get('initialProgress');
            var flowDirection = pointFeature.get('flowDirection');
            var flowRate = pointFeature.get('flowRate');
            var line = parentFeature.getGeometry();
            var speedMultiplier = flowRate;
            var adjustedProgress = (progress * speedMultiplier) % 1;

            var currentProgress;
            if (flowDirection === 'reverse') {
                currentProgress = (initialProgress - adjustedProgress + 1) % 1;
            } else {
                currentProgress = (initialProgress + adjustedProgress) % 1;
            }

            var point = line.getCoordinateAt(currentProgress);
            pointFeature.getGeometry().setCoordinates(point);
        });

        // ✅ Single layer update instead of full map render
        pointLayer.changed();
        // ✅ REMOVED: mapObj.render() - Let OpenLayers handle rendering naturally
        
        animationFrameId = requestAnimationFrame(animatePoints);
    }

    animationFrameId = requestAnimationFrame(animatePoints);
    pointLayer.set('animationFrameId', animationFrameId);
}

function addFlowBillboard(path, mapObj, flowDirection, entity, color, flowRates = {}) {
    if (path.length < 2) return;
    let progress = 0;
    const speed = 0.1;
    let animationFrameId;

    const pipeId = entity.properties.pipeId;
    const flowRate = flowRates?.[pipeId] ?? 1;
    const positions = path.map(p => new Cesium.Cartesian3(p.x, p.y, p.z));
    if (flowRate === 0) {
        console.log(`Skipping 3D animation for ${pipeId} due to 0 flow rate`);
        const redPipe = mapObj.entities.add({
            layername: pipeId,
            polyline: {
                positions: positions,
                width: 4,
                material: Cesium.Color.RED.withAlpha(0.8),
                clampToGround: false
            }
        });

        tmpl.UtilityNetwork._flowEntities3D.push({
            entity: redPipe,
            cancelFunc: () => { } // No animation to cancel, but keeps structure consistent
        });
        return;
    }


    const flowEntity = mapObj.entities.add({
        position: new Cesium.Cartesian3(path[0].x, path[0].y, path[0].z),
        billboard: {
            image: appConfigInfo.mapSDKURL + '/cesium/water_drop.png',
            scale: 0.03,
            color: Cesium.Color.fromCssColorString('blue').withAlpha(0.5)
        }
    });


    function animate() {
        progress += speed;
        if (progress > 1) progress = 0;

        const segments = path.length - 1;
        const segmentIndex = Math.floor(progress * segments);
        const localT = (progress * segments) % 1;

        const start = path[segmentIndex];
        const end = path[segmentIndex + 1] || start;

        const position = Cesium.Cartesian3.lerp(start, end, localT, new Cesium.Cartesian3());
        flowEntity.position = position;

        animationFrameId = requestAnimationFrame(animate);
    }


    animate();

    tmpl.UtilityNetwork._flowEntities3D.push({
        entity: flowEntity,
        cancelFunc: () => cancelAnimationFrame(animationFrameId)
    });
}


// tmpl.UtilityNetwork.remove = function (params) {
//     var mapObj = params.map;
//     var layername = params.layername;

//     try {
//         if (!mapObj || !layername) {
//             return { status: false, message: 'Invalid mapObj or layername' };
//         }
//     } catch (error) {
//         if (error instanceof Error) {
//             return { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter: ' + error.message };
//         }
//     }

//     try {
//         if (appConfigInfo.mapDimension == "2D") {
//             if (appConfigInfo.mapLib == 'ol7') {
//                 var Layers = mapObj.getLayers();
//                 var pipeLayer = null;
//                 var pointLayer = null;

//                 // Find both layers
//                 for (var i = 0; i < Layers.getLength(); i++) {
//                     var layer = Layers.item(i);
//                     if (layer.get('title') === layername) {
//                         pipeLayer = layer;
//                     }
//                     if (layer.get('title') === layername + '_points') {
//                         pointLayer = layer;
//                     }
//                 }

//                 // Remove pipe layer if it exists
//                 if (pipeLayer) {
//                     mapObj.removeLayer(pipeLayer);
//                     tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
//                         entry => entry.title !== layername
//                     );
//                     tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
//                         entry => entry.title !== layername
//                     );
//                 }

//                 // Remove point layer and stop animation if it exists
//                 if (pointLayer) {
//                     const animationFrameId = pointLayer.get('animationFrameId');
//                     if (animationFrameId) {
//                         cancelAnimationFrame(animationFrameId);
//                     }
//                     mapObj.removeLayer(pointLayer);
//                     tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
//                         entry => entry.title !== layername + '_points'
//                     );
//                     tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
//                         entry => entry.title !== layername + '_points'
//                     );
//                 }

//                 let htmlElement = document.getElementById('custom-tooltip-flowDiv');
//                 if (htmlElement) {
//                     htmlElement.remove();  // Removes the element from the DOM
//                 }

//                 // Log the result
//                 if (!pipeLayer && !pointLayer) {
//                     return { status: true, message: 'No layers found to remove.' };
//                 }


//                 return { status: true, message: 'UtilityNetwork.remove completed.' };
//             }
//         } else {
//             // === 💥 3D Case ===
//             tmpl.UtilityNetwork.clear3DAnimations(mapObj);

//             let removedCount = 0;

//             // Convert to real array for safe filtering
//             const entitiesArray = Array.from(mapObj.entities.values);

//             const entitiesToRemove = entitiesArray.filter(entity => {
//                 return entity.name === layername || entity.layername === layername;
//             });

//             entitiesToRemove.forEach(entity => {
//                 mapObj.entities.remove(entity);
//                 removedCount++;
//             });

//             return {
//                 status: true,
//                 message: `3D: Removed ${removedCount} pipeline entities + animations.`
//             };

//         }
//     } catch (err) {
//         return { status: false, message: 'Error in UtilityNetwork.remove: ' + err.message };
//     }
// };


tmpl.UtilityNetwork.remove = function (params) {
    var mapObj = params.map;
    var layername = params.layername;

    try {
        if (!mapObj || !layername) {
            return { status: false, message: 'Invalid mapObj or layername' };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter: ' + error.message };
        }
    }

    try {
        if (appConfigInfo.mapDimension == "2D") {
            if (appConfigInfo.mapLib == 'ol7') {
                var Layers = mapObj.getLayers();
                var pipeLayer = null;
                var pointLayer = null;

                for (var i = 0; i < Layers.getLength(); i++) {
                    var layer = Layers.item(i);
                    if (layer.get('title') === layername) {
                        pipeLayer = layer;
                    }
                    if (layer.get('title') === layername + '_points') {
                        pointLayer = layer;
                    }
                }

                if (pipeLayer) {
                    mapObj.removeLayer(pipeLayer);
                    tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                        entry => entry.title !== layername
                    );
                    tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                        entry => entry.title !== layername
                    );
                }

                if (pointLayer) {
                    // ✅ Cancel animation frame
                    const animationFrameId = pointLayer.get('animationFrameId');
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                    }
                    
                    // ✅ Remove event listeners to prevent memory leaks
                    const handlers = pointLayer.get('interactionHandlers');
                    if (handlers) {
                        mapObj.un('movestart', handlers.start);
                        mapObj.un('moveend', handlers.end);
                    }
                    
                    mapObj.removeLayer(pointLayer);
                    tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
                        entry => entry.title !== layername + '_points'
                    );
                    tmpl_setMap_layer_global_array = tmpl_setMap_layer_global_array.filter(
                        entry => entry.title !== layername + '_points'
                    );
                }

                let htmlElement = document.getElementById('custom-tooltip-flowDiv');
                if (htmlElement) {
                    htmlElement.remove();
                }

                if (!pipeLayer && !pointLayer) {
                    return { status: true, message: 'No layers found to remove.' };
                }

                return { status: true, message: 'UtilityNetwork.remove completed.' };
            }
        } else {
            tmpl.UtilityNetwork.clear3DAnimations(mapObj);

            let removedCount = 0;
            const entitiesArray = Array.from(mapObj.entities.values);

            const entitiesToRemove = entitiesArray.filter(entity => {
                return entity.name === layername || entity.layername === layername;
            });

            entitiesToRemove.forEach(entity => {
                mapObj.entities.remove(entity);
                removedCount++;
            });

            return {
                status: true,
                message: `3D: Removed ${removedCount} pipeline entities + animations.`
            };
        }
    } catch (err) {
        return { status: false, message: 'Error in UtilityNetwork.remove: ' + err.message };
    }
};