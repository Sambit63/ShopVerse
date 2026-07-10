tmpl.Layer.remove = function (param) {
	var mapObj = param.map;
	var layer = param.layer;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };

		}

		if (layer === null || layer === undefined || layer === '' || layer === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid layer name' };
		}

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
		}

	}

	if (appConfigInfo.mapDimension == "2D") {
		var existing;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === layer) {
					existing = existingLayer;
					mapObj.removeLayer(existingLayer);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layer) {
					mapObj.removeLayer(tmpl_setMap_layer_global[i]);
				}
			}
		}
	}
	else {

		var entity = mapObj.entities._entities;
		// for(var i=0; i < map.entities._entities._array.length; i++){
		for (var i = mapObj.entities._entities._array.length - 1; i >= 0; i--) {
			if (entity._array[i]._name == layer) {
				var ent = entity._array[i];
				mapObj.entities.remove(ent);
			}
		}

		var length = mapObj.dataSources.length;
		var j = 0;
		while (j < length) {
			if (mapObj.dataSources.get(j).name == layer) {
				mapObj.dataSources.remove(mapObj.dataSources.get(j));
			}
			else { }
			j++;
		}

	}


	return response = { status: true, message: ' Layer.remove API Enabled..' };
}




// **** This function will set the specified postition to the all feature labels  **** //

tmpl.Layer.setLabelPosition = function (param) {
	var mapObj = param.map;
	var lyrName = param.layer;
	var offsetY = param.offsety;
	var offsetX = param.offsetx;

	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };
		}

		if (lyrName === null || lyrName === undefined || lyrName === '' || lyrName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid lyrName' };
		}

		if (offsetY === null || offsetY === undefined || offsetY === '' || offsetY === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid offsetY' };
		}

		if (offsetX === null || offsetX === undefined || offsetX === '' || offsetX === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid offsetX' };
		}

	} catch (error) {
		if (error instanceof Error) {

			// console.log("tmpl.Zoom.toXYWithoutZoom    | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				if (existingLayer.get('title') === lyrName) {
					existing = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						feature.getStyle().getText().setOffsetY(offsetY);
						feature.getStyle().getText().setOffsetX(offsetX);
					});
					var allFeatures = existingLayer.getSource().getFeatures();
					existingLayer.getSource().clear();
					existingLayer.getSource().addFeatures(allFeatures);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
						feature.getStyle().getText().setOffsetY(offsetY);
						feature.getStyle().getText().setOffsetX(offsetX);
					});
					var allFeatures = tmpl_setMap_layer_global[i].layer.getSource().getFeatures();
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeatures(allFeatures);
				}

			}

		}
	}

	return response = { status: true, message: ' Layer.setLabelPosition API Enabled..' };

}
// **** This function will clear the specified Layer data **** //

tmpl.Layer.clearData = function (param) {
	var mapObj = param.map;
	var layerName = param.layer;
	clearInterval(param.clearIconBlink)
	try {

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };
		}

		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid layerName' };
		}


	} catch (error) {

		if (error instanceof Error) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}

	}

	if (appConfigInfo.mapDimension == "2D") {

		var Layers = mapObj.getLayers();
		var length = Layers.getLength();

		var existingLayer;
		var CircleLayerAttachmentBoolian = false;
		var lyrName_circle = layerName + "_API_CircleLayer";
		if (layerName != undefined) {
			for (var i = 0; i < length; i++) {
				var exLayer = Layers.item(i);

				if (exLayer != undefined) {
					if (exLayer.get('title') === layerName) {
						existingLayer = exLayer;
						var source = exLayer.getSource();
						if (source instanceof ol.source.Vector) {
							source.clear();
						}
						try {
							if (tmpl_blinkIntervals[layerName]) {
								tmpl_blinkIntervals[layerName].forEach(id => clearInterval(id));
								delete tmpl_blinkIntervals[layerName];
							}
							mapObj.removeLayer(exLayer);
						} catch (e) {
							var response = { status: false, message: e.message };
							console.log("Layer Clear..", response);
						}
						if (exLayer.get('CircleLayerAttached') == true) {
							CircleLayerAttachmentBoolian = true;
						}
					}
				}
			}
		}

		var allLayers = mapObj.getLayers().getArray();
		for (let i = allLayers.length - 1; i >= 0; i--) {
			let lyr = allLayers[i];
			if (lyr && lyr.get("title") === layerName) {
				mapObj.removeLayer(lyr);
			}
		}
		if (CircleLayerAttachmentBoolian == true) {
			for (var j = 0; j < length; j++) {
				var exLayer2 = Layers.item(j);
				if (exLayer2.get('title') === lyrName_circle) {
					mapObj.removeLayer(exLayer2);
					break;
				}
			}
		}
		if (existingLayer == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == layerName) {
					if (tmpl_blinkIntervals[layerName]) {
						tmpl_blinkIntervals[layerName].forEach(id => clearInterval(id));
						delete tmpl_blinkIntervals[layerName];
					}
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					if (global_fleet_layer_id.length > 0) {

						if (globale_layer_names.indexOf(layerName) != -1) {
							for (var k = 0; k < global_fleet_layer_id.length; k++) {
								var lname = global_fleet_layer_id[k].split('fleet_')[1];
								if (lname != undefined) {
									lname = lname.split('_')[0];
									if (lname == layerName) {
										global_fleet_layer_id[k] = '';
										global_fleet_layer_features[k] = '';
										global_fleet_layer_objects[k] = '';
									}
								}
							}
						}
					}
				}
			}
		}

		tmpl_setMap_layer_global =
			tmpl_setMap_layer_global.filter(l => l.title !== layerName);

		tmpl_setMap_layer_global_array =
			tmpl_setMap_layer_global_array.filter(l => l.title !== layerName);

		for (let i = 0; i < borderBlinkArray.length; i++) {
			let obj = borderBlinkArray[i];
			if (obj.layerName == layerName) {
			  clearInterval(obj.intervalId);
			  var feature = obj.feature;
			  var baseStyle = obj.baseStyle;
			  feature.setStyle(baseStyle);
			  // Remove the element from the array
			  borderBlinkArray.splice(i, 1);
			  // Since the array length has changed, adjust the index to prevent skipping elements
			  i--;
			}
		}

		if(globalBadgeLayer.get(layerName)){
            mapObj.removeLayer(globalBadgeLayer.get(layerName));
            globalBadgeLayer.delete(layerName);
            badgeFeaturesByLayer.delete(layerName);
        }
        if(globalCamFieldLayer.get(layerName)){
            mapObj.removeLayer(globalCamFieldLayer.get(layerName));
            globalCamFieldLayer.delete(layerName);
            camFieldFeaturesByLayer.delete(layerName);
        }
        if(globalBlinkLayer.get(layerName)){
            mapObj.removeLayer(globalBlinkLayer.get(layerName));
            globalBlinkLayer.delete(layerName);
            blinkingActiveByLayer.delete(layerName)
            blinkFeaturesByLayer.delete(layerName)
        }

	}



	else {

		var entity = mapObj.entities._entities;
		// for(var i=0; i < mapObj.entities._entities._array.length; i++){
		for (var i = mapObj.entities._entities._array.length - 1; i >= 0; i--) {
			if (entity._array[i]._name == layerName) {
				var ent = entity._array[i];
				mapObj.entities.remove(ent);
			}
		}

		var length = mapObj.dataSources.length;
		var j = 0;
		while (j < length) {
			if (mapObj.dataSources.get(j).name == layerName) {
				mapObj.dataSources.remove(mapObj.dataSources.get(j));
			}
			else { }
			j++;
		}

	}
	return response = { status: true, message: ' Layer.clearData API Enabled..' };
}
//-------------------------------------- End of Layer Updations ----------------------------------------//

// ********************* SDK_MAP_API (7)changeVisibility********************* //


tmpl.Layer.changeVisibility = function (param) {
	var mapObj = param.map;
	var layerName = param.layer;
	var visibility = param.visible;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };
		}

		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid layerName Object' };
		}

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}



	try {
		if (appConfigInfo.mapDimension == "2D") {
			var Layers;
			try {
				Layers = mapObj.getLayers();
				var length = Layers.getLength();
			} catch (e) { console.log("Error in Get Layers:", e, mapObj); }

			var existing;
			var existingLayer;
			for (var i = 0; i < length; i++) {

				try {
					existingLayer = Layers.item(i);
				} catch (e) { }

				if (existingLayer) {
					//console.log("first >>",existingLayer.get('title'),existingLayer.get('title') == layerName);
					if (existingLayer.get('title') == layerName) {
						existing = existingLayer;
						try {
							existingLayer.setVisible(visibility);
						} catch (e) { }

					}
				}
			}

			if (existing == undefined) {
				for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {

					//console.log("second11 >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
					if (tmpl_setMap_layer_global[i].title == layerName) {

						if (visibility == false) {
							tmpl_setMap_layer_global[i].layer.setMap(null);
							tmpl_setMap_layer_global[i].visibility = false;
							//alert(2);
						} else {

							try {
								tmpl_setMap_layer_global[i].layer.setMap(mapObj);
							} catch (e) { }
							try {
								tmpl_setMap_layer_global[i].visibility = true;
							} catch (e) { }

							//alert(3);
						}
					}
					//console.log("second >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
				}

			}
		} else {
			if (visibility == "true") {
				visibility = true;
			}
			if (visibility == "false") {
				visibility = false;
			}

			var length = mapObj.entities._entities.length;
			// for(var i=0; i<length; i++){
			var i = 0;;
			while (i < length) {
				if (mapObj.entities._entities._array[i].name == layerName) {
					mapObj.entities._entities._array[i].show = visibility;
				}
				i++;
			}

			var clusterLength = mapObj.dataSources.length;
			var j = 0;
			while (j < clusterLength) {
				if (mapObj.dataSources.get(j).name == layerName) {
					mapObj.dataSources.get(j).show = visibility;
				}
				else { }
				j++;
			}
			
			if(visibility==false){
				polygonEntities.forEach((camField)=>{
					if(camField.name == layerName){
						camEntity=mapObj.entities.getById(camField.id);
						camEntity.show=false;
					}
				})
				blinkEntityArr.forEach((blinkObj)=>{
					if(blinkObj.obj.name == layerName){	
						console.log(blinkObj)
						clearInterval(blinkObj.id);
						let index = intervalid.indexOf(blinkObj.id);
						if (index !== -1) {
    						intervalid.splice(index, 1);
						}
						actualObj=mapObj.entities.getById(blinkObj.obj.id);
						actualObj.show=false;
					}
				})

			}else{
				polygonEntities.forEach((camField)=>{
					if(camField.name == layerName){
						camEntity=mapObj.entities.getById(camField.id);
						camEntity.show=true;
					}
				})
				blinkEntityArr.forEach((blinkObj)=>{
					if(blinkObj.obj.name == layerName){	
						console.log(blinkObj)
						let actualObj=mapObj.entities.getById(blinkObj.obj.id);
						// actualObj.show=true;
						var blinkingInterval = setInterval(function () {
							toggleBlinking(actualObj);
						}, 500);
						intervalid.push(blinkingInterval);
						blinkObj.id=blinkingInterval;
						function toggleBlinking(blinkEntity) {
							blinkEntity.show = !blinkEntity.show;
						}
					}
				})
			}

		}
	} catch (err) {
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
	}
	if(appConfigInfo.mapDimension=="2D"){
		tmpl.Overlay.toggleBadgesByClassName(param);
		tmpl.Overlay.toggleAnimationByClassName(param);
		tmpl.Overlay.toggleCamFieldByClass(param);
	}

	return response = { status: true, message: ' Layer.changeVisibility API Enabled..' };
}


tmpl.Map.clearLayers = function (param) {

	var mapObj = param.map;

	try {
		mapObj.getLayers().forEach(function (layer) {
			if (layer.get('title') != undefined & layer.get('title') != "googleMap") {

				//mapObj.getSource().clear();
				mapObj.removeLayer(layer);

			}
		});

		// Assuming you have already initialized the Cesium viewer
		var viewer = new Cesium.Viewer("cesiumContainer");

		// Function to remove all vector layers
		function removeAllVectorLayers() {
			var dataSources = viewer.dataSources;
			var dataSourceCollection = dataSources._dataSources; // Access the underlying array of data sources

			// Iterate through the data sources and remove them one by one
			for (var i = dataSourceCollection.length - 1; i >= 0; i--) {
				var dataSource = dataSourceCollection.get(i);
				viewer.dataSources.remove(dataSource, true); // Remove the data source from the viewer and destroy it
			}
		}

		// Call the function to remove all vector layers
		removeAllVectorLayers();
	} catch (e) {
		console.log("Error in Clear All Layers"); return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: e.message };
	}

}

tmpl.Layer.removeAll = function (param) {
	var mapObj = param.map;

	try {
		if (appConfigInfo.mapDimension == "2D") {
			var existing;
			var Layers = mapObj.getLayers();
			var length = Layers.getLength();
			var tem = null;
			for (var i = 0; i < length; i++) {
				var existingLayer = Layers.item(i);

				var tem = null;

				if ((existingLayer!=undefined || existingLayer!= null) && (existingLayer.get('title') != 'BaseMap' || existingLayer.get('title') != undefined)) {
					existing = existingLayer;
					for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
						tem = tmpl_setMap_layer_global[j].title;
						try {
							tmpl.Layer.clearData({ map: mapObj, layer: tem });
							tmpl.Layer.remove({ map: mapObj, layer: tem });
						} catch (e) {
							return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: e.message };
						}


					}


				}

			}

		}else if(appConfigInfo.mapDimension == "3D"){
			mapObj.entities.removeAll();
			mapObj.scene.primitives.removeAll();
			// mapObj.imageryLayers.removeAll();
			mapObj.dataSources.removeAll();
		}else{

		}

	}
	catch (err) {
		console.error("ERROR Layer.remove: ", err);
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
	}
}


// ********************* SDK_MAP_API clearCircle********************* //
var circleLayer;
var circleEntity;
tmpl.Layer.clearCircle = function (param) {
	try {
		var mapObj = param.map;
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}
		if (appConfigInfo.mapDimension == "2D") {
			if (circleLayer != undefined)
				circleLayer.getSource().clear();
		} else {
			if (circleEntity != undefined) {
				mapObj.entities.remove(circleEntity);
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	return response = { status: true, message: ' LayerclearCircle API Enabled..' };

}

tmpl.Layer.getExtent = function (param) {											
var mapObj = param.map;
var lyrname = param.layer;

try {
	if (appConfigInfo.mapDimension == "2D") {
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		var existing;
		for (var i = 0; i < length; i++) {
			var existingLayer = Layers.item(i);
			if (existingLayer.get('title') == lyrname) {
				existing = existingLayer;
				var extent = existingLayer.getSource().getExtent();
				var s_w = [extent[0], extent[1]];
				var n_e = [extent[2], extent[3]];
				s_w = ol.proj.transform(s_w, 'EPSG:3857', 'EPSG:4326');
				n_e = ol.proj.transform(n_e, 'EPSG:3857', 'EPSG:4326');
				var ext = [s_w, n_e]
				console.log("ext from get extent API======>", ext);
				return ext;
				// console.log("extent=============>",extent);
				// if(extent[0] == extent[2] && extent[1] == extent[3]){
				// var point = [extent[0],extent[1]];
				// point = ol.proj.transform(point,'EPSG:3857','EPSG:4326');
				// }else{
				// mapObj.getView().fit(extent, mapObj.getSize());
				// }
				// break;
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrname) {
					var extent = tmpl_setMap_layer_global[i].layer.getSource().getExtent();
					// console.log(extent);
					var s_w = [extent[0], extent[1]];
					var n_e = [extent[2], extent[3]];
					s_w = ol.proj.transform(s_w, 'EPSG:3857', 'EPSG:4326');
					n_e = ol.proj.transform(n_e, 'EPSG:3857', 'EPSG:4326');
					var ext = [s_w, n_e]
					console.log("ext from get extent API======>", ext);
					return ext;
				}
			}
		}
	}
}
catch (err) {
	console.error("ERROR Layer.getExtent: ", err);
}
}


tmpl.Layer.getAllLayers = function () {
    const layerList = tmpl_setMap_layer_global;
    const validLayerTitles = [];

    try {
        for (let i = 0; i < layerList.length; i++) {
            const obj = layerList[i];
            const layer = obj.layer;
            const title = obj.title || `Layer_${i}`;

            if (layer instanceof ol.layer.Vector) {
                const source = layer.getSource();
                if (!source) continue;

                const features = source.getFeatures();
                if (!features || features.length === 0) continue;

                const hasGeometry = features.some(f => f.getGeometry());
                if (hasGeometry) {
                    validLayerTitles.push(title);  
                }
            }
        }

        return validLayerTitles;

    } catch (err) {
        console.error("Error in getAllLayers:", err);
        return [];
    }
};


/* ############# transparentCircle started defination ############## */

/**
 * Create a simple styled circle with text using OpenLayers
 *
 * @param {Object} args
 * @param {ol.Map} args.map
 * @param {number} args.lat
 * @param {number} args.lon
 * @param {number} args.radius - Circle radius in meters
 * @param {string} args.fillColor - e.g. '255,0,0'
 * @param {number} args.fillOpacity - 0 to 1
 * @param {string} args.borderColor - e.g. '#000'
 * @param {number} args.borderWidth
 * @param {string} args.text
 * @param {string} args.textColor
 * @param {number} [args.textSize=16]
 * @param {string} [args.fontStyle='bold']
 * @param {string} [args.fontFamily='Arial, sans-serif']
 * @param {string} args.layer
 */

tmpl.Layer.transparentCircle = function createCircle(params) {

    const {
        map,
        lat,
        lon,
        radius,
        fillColor,
        fillOpacity,
        borderColor,
        borderWidth,
        text,
        textColor,
        textSize = 16,
        fontStyle = 'bold',
        fontFamily = 'Arial, sans-serif',
        layer
    } = params;

    if (!map) return;

    const center = ol.proj.fromLonLat([lon, lat]);

    const circleFeature = new ol.Feature({
        geometry: new ol.geom.Circle(center, radius)
    });

    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: `rgba(${fillColor}, ${fillOpacity})`
        }),
        stroke: new ol.style.Stroke({
            color: borderColor,
            width: borderWidth
        }),
        text: text ? new ol.style.Text({
            text: text,
            font: `${fontStyle} ${textSize}px ${fontFamily}`,
            fill: new ol.style.Fill({ color: textColor }),
            textAlign: 'center',
            textBaseline: 'middle',
            overflow: true
        }) : null
    });

    circleFeature.setStyle(style);

    const vectorLayer = new ol.layer.Vector({
        title: layer,
        source: new ol.source.Vector({
            features: [circleFeature]
        })
    });

    map.addLayer(vectorLayer);

    return vectorLayer;
}


/* exmaple

tmpl.Layer.transparentCircle({
    map: gmap,
    layer: 'Simple_Circle',
    lat: 24.698683209093275,
    lon: 46.5707636554423,
    radius: 100,
    fillColor: '27, 29, 33',
    fillOpacity: 0.3,
    borderColor: 'rgb(37, 196, 101)',
    borderWidth: 5,
    text: '320 kW',
    textColor: '#f2eded',
    textSize: 12,
    fontStyle: 'bold'
});
 */


/* ################### transparentCircle end defination ############# */

