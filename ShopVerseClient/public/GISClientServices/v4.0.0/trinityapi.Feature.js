
tmpl.Feature.byId = function (param) {
	var map = param.map;
	var layrName = param.layer;
	var id = param.id;
	var key=param.key;
	var callbackFunc = param.callbackFunc;

	console.log("Layer name from Feature.byid=========>", layrName);


	// try {
	// 	if (mapObj === null || mapObj === undefined) {

	// 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid map Object' };
	// 	}

	// 	if (layrName === null || layrName === undefined || layrName === '' || layrName === "") {

	// 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layrName '};
	// 	}

	// 	if (id === null || id === undefined || id === '' || id === "") {

	// 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id'};
	// 	}

	// 	if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

	// 		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc'};
	// 	}

	// } catch (error) {
	// 	if (error instanceof Error) {
	// 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

	// 	}
	// }



	if (appConfigInfo.mapDimension == "2D") {
		//alert(12);
		var existing;
		var Layers = map.getLayers();
		var length = Layers.getLength();
		var fea;
		//console.log("layrName,id >>>",layrName,id);
		for (var i = 0; i < length; i++) {
			//alert(11);
			var existingLayer = Layers.item(i);
			if (existingLayer) {
				//alert(4);
				//console.log("existingLayer.get('title') >>>",existingLayer.get('title'));
				// console.log(existingLayer.get('noncluster'));
				if (!existingLayer.get('noncluster') && existingLayer.get('title') === layrName) {
					//alert(3);
					existing = existingLayer;
					test1 = existingLayer;
					existingLayer.getSource().getFeatures().forEach(function (feature) {
						if (feature.getProperties().features != undefined) {
							var len = feature.getProperties().features.length;
							for (var j = 0; j < len; j++) {
								//console.log("lfeature.getProperties().features[j].getId() >>>",feature.getProperties().features[j].getId());
								if (feature.getProperties().features[j].getId() == id) {
									//alert(2);
									fea = feature.getProperties().features[j];
									//console.log("fea  ????",fea);
									if (appConfigInfo.mapData == 'google' || 'hereMaps' || 'trinity') {
										callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
										break;
									}
									else if (appConfigInfo.mapData == 'pentab') {
										//alert(1);
										callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
										break;
									}
									else {
										//alert(5);
										callbackFunc(fea.getGeometry().getCoordinates(), fea.getProperties());
										break;
									}
								} else if (feature.getProperties().features[j].get(key) == id) {
									//alert(2);
									fea = feature.getProperties().features[j];
									//console.log("fea  ????",fea);
									if (appConfigInfo.mapData == 'google' || 'hereMaps' || 'trinity') {
										callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
										break;
									}
									else if (appConfigInfo.mapData == 'pentab') {
										//alert(1);
										callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
										break;
									}
									else {
										//alert(5);
										callbackFunc(fea.getGeometry().getCoordinates(), fea.getProperties());
										break;
									}
								}
							}
						}

					});

				}
			}
		}
		if (existing == undefined) {
			//alert(9);
			for (var i = tmpl_setMap_layer_global.length-1; i >= 0; i--) {

				//console.log("second11 >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
				if (tmpl_setMap_layer_global[i].title == layrName) {
					//alert(77);
					var layer = tmpl_setMap_layer_global[i].layer;
					//console.log(layer.getSource().getFeatures());
					// var fea = layer.getSource().getFeatureById(id);
					var fea = layer.getSource().getFeatures().find(f => f.get(key??'id') == id);
					if (appConfigInfo.mapData == 'google' || 'hereMaps' || 'trinity') {
						//alert(7);
						callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
						break;
					}
					if (appConfigInfo.mapData == 'pentab') {
						//alert(6);
						callbackFunc(ol.proj.transform(fea.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'), fea.getProperties());
						break;
					}
					else {
						//alert(8);
						callbackFunc(fea.getGeometry().getCoordinates(), fea.getProperties());
						break;
					}
				}
				//console.log("second >>",tmpl_setMap_layer_global[i].title,tmpl_setMap_layer_global[i].visibility);
			}
		}
	}
	else {
		if (id != undefined) {
			if (map.dataSources.length > 0) {
				/////////////////////// For Cluster Layer /////////////////////////	
				var clusterPointPos = [];
				var clusterLength = map.dataSources.length;
				for (var j = 0; j < clusterLength; j++) {
					if (map.dataSources.get(j).name == layrName) {
						var clusterEnt = map.dataSources.get(j).entities.getById(id);
						if (clusterEnt != undefined) {
							var clusterprop = clusterEnt.entProp;
							clusterPointPos.push(clusterprop.lon, clusterprop.lat);
							callbackFunc(clusterPointPos, clusterprop);
						}
						else {
							console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
						}
					}
					// else{
					// console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
					// }
				}
			}
			/////////////////////// For Entities Layer /////////////////////////
			else {
				var position = [];
				var ent = map.entities.getById(id);
				var prop = ent.entProp;
				position.push(prop.lon, prop.lat);
				var lyrName = ent.entProp.layer_name;

				if (lyrName == layrName) {
					callbackFunc(position, prop);
				}
				else {
					console.log("PROVIDED LAYER NAME DOES NOT MATCH WITH FEATURE LAYER NAME");
				}
			}
		}
	}

}

// tmpl.Feature.updatebyId = function (param) {
// 	var mapObj = param.map;
// 	var layrName = param.layer;
// 	var id = param.id;
// 	var properties = param.properties;
// 	//var callbackFunc = param.callbackFunc;
// 	var existing;
// 	try {
// 		if (mapObj === null || mapObj === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
// 		}

// 		if (layrName === null || layrName === undefined || layrName === '' || layrName === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layrName value' };
// 		}

// 		if (id === null || id === undefined || id === '' || id === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
// 		}

// 		if (properties === null || properties === undefined || properties === '' || properties === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid properties' };
// 		}

// 		/*if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc'};
// 		}*/

// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

// 		}
// 	}
// 	var Layers = mapObj.getLayers();
// 	var length = Layers.getLength();
// 	var fea;
// 	//console.log("layrName,id >>>",layrName,id);
// 	for (var i = 0; i < length; i++) {
// 		var existingLayer = Layers.item(i);
// 		if (existingLayer) {
// 			if (existingLayer.get('title') === layrName) {
// 				existing = existingLayer;
// 				test1 = existingLayer;
// 				existingLayer.getSource().getFeatures().forEach(function (feature) {
// 					var len = feature.getProperties().features.length;
// 					for (var j = 0; j < len; j++) {
// 						if (feature.getProperties().features[j].getId() == id) {
// 							fea = feature.getProperties().features[j];
// 							//console.log("before",fea);
// 							fea.setProperties(properties);
// 							//console.log("after",fea);
// 							break;
// 						}
// 					}
// 				});
// 			}
// 		}
// 	}

// 	if (existing == undefined) {
// 		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
// 			if (tmpl_setMap_layer_global[i].title == layrName) {
// 				var layer = tmpl_setMap_layer_global[i].layer;
// 				layer.getSource().getFeatures().forEach(function (feature) {
// 					if (feature.getProperties()['id'] == id) {
// 						fea = feature;
// 						fea.setProperties(properties);
// 						fea.setStyle(new ol.style.Style({
// 							image: new ol.style.Icon(({
// 								anchor: [0.5, 1],
// 								src: properties.img_url
// 							})),
// 							/*text:new ol.style.Text({
// 							font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
// 							textAlign:'center',
// 							text : properties.label
// 						})*/
// 						})



// 						);
// 					}
// 				});
// 			}
// 		}
// 	}
// 	return { status: true, message: 'tmpl.Feature.updatebyId executed successfully' }

// }

tmpl.Feature.updatebyId = function (param) {
	if(appConfigInfo.mapDimension == "2D"){
		const { map, layer: layrName, id, properties } = param;
		let found = false;
		let animationRequired = false;

		if (!map || !layrName || id == null || !properties) {
			console.error("Invalid parameters");
			return { status: false, message: "Invalid parameters" };
		}

		const layers = map.getLayers().getArray();
		layers.forEach(layer => {
			if (layer.get('title') !== layrName) return;

			const source = layer.getSource();
			const features = source.getFeatures();

			features.forEach(feature => {
				const props = feature.getProperties();

				// Log feature properties for debugging
				console.log("Feature Properties:", props);

				if (Array.isArray(props.features)) {
					// Clustered features
					props.features.forEach(subFeature => {
						if (subFeature.getId() == id || subFeature.get('id') == id) {
							console.log("Updating clustered feature", subFeature);
							subFeature.setProperties(properties);
							subFeature.setStyle(new ol.style.Style({
								image: new ol.style.Icon({
									anchor: [0.5, 1],
									src: properties.img_url
								})
							}));
							found = true;
							animationRequired = !!properties.animationRequired;
						}
					});
				} else if (feature.getId() == id || props.id == id) {
					// Normal feature
					console.log("Updating normal feature", feature);
					feature.setProperties(properties);
					feature.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 1],
							src: properties.img_url
						})
					}));
					found = true;
					animationRequired = !!properties.animationRequired;
				}
			});
		});

		if (!found) {
			console.warn("Feature not found with ID:", id);
		} else {
			// If animationRequired is part of properties, update animation layer visibility
			tmpl.Overlay.toggleAnimationByClassName({
				map: map,
				layer: layrName,
				visible: animationRequired
			});
		}

		return {
			status: found,
			message: found ? "Feature updated successfully" : "Feature not found"
		};
	}else{
		let id = param.id;
		let viewer = param.map;
		let flag = param.isPositionChange ? param.isPositionChange : false;
		let properties = param.properties;
		const entity = tmpl_overlay_golbal3D.get(id);
			console.log(entity);
		if (!entity) return;

		if (properties.img_url) entity.billboard.image = properties.img_url;
		if (param.icon_scale) entity.billboard.scale = param.icon_scale;
		if(entity.entProp){
			console.log(entity.entProp);
			entity.entProp = {...entity.entProp,...properties};
			console.log(entity.entProp);
		}

		if (flag && param.lat && param.lon) {
			console.log("updating position with terrain");
			const carto = Cesium.Cartographic.fromDegrees(param.lon, param.lat);
			Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [carto]).then(updated => {
			const pos = updated[0];
			pos.height += param.height || 0;
			entity.position = Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, pos.height);
			});
		}else{
			console.log("no updating in position");
		}
	}
};



tmpl.Feature.deletebyId = function (param) {

	var mapObj = param.map;
	var layrName = param.layer;
	var id = param.id;
	var existing;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}

		if (layrName === null || layrName === undefined || layrName === '' || layrName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layrName value' };
		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var fea;

	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === layrName) {
				existing = existingLayer;
				test1 = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					var len = feature.getProperties().features.length;
					for (var j = 0; j < len; j++) {
						if (feature.getProperties().features[j].getId() == id) {

							var featureToDelete = features[j];

							existingLayer.getSource().removeFeature(featureToDelete);
							console.log(features[j]);


							break;
						}
					}
				});
			}
		}
	}

	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layrName) {
				var layer = tmpl_setMap_layer_global[i].layer;
				layer.getSource().getFeatures().forEach(function (feature) {
					if (feature.getProperties()['id'] == id) {
						fea = feature;
						var featureToDelete = feature;
						layer.getSource().removeFeature(featureToDelete);
						console.log(fea);
					}
				});
			}
		}
	}

	return { status: true, message: 'tmpl.Feature.deletebyId executed successfully' }
}


tmpl.Feature.clusterUpdatePropertiesLatLon = function (param) {
	var map = param.map;
	var layrName = param.layer;
	var id = param.id;
	var properties = param.properties;
	var point = param.point;

	try {
		if (appConfigInfo.mapDimension == "2D") {
			var existing;
			var Layers = map.getLayers();
			var length = Layers.getLength();

			var fea;
			//console.log("layrName,id >>>",layrName,id);
			for (var i = 0; i < length; i++) {
				var existingLayer = Layers.item(i);
				if (existingLayer) {
					if (existingLayer.get('title') === layrName) {
						existing = existingLayer;
						test1 = existingLayer;
						existingLayer.getSource().getFeatures().forEach(function (feature) {
							var len = feature.getProperties().features.length;
							for (var j = 0; j < len; j++) {
								if (feature.getProperties().features[j].getId() == id) {
									fea = feature.getProperties().features[j];
									fea.setProperties(properties);
									if (appConfigInfo.mapData === 'google' || 'hereMaps') {
										fea.getGeometry().setCoordinates(ol.proj.transform([parseFloat(point[0]), parseFloat(point[1])], 'EPSG:4326', 'EPSG:3857'));
									}
									else {
										fea.getGeometry().setCoordinates([parseFloat(point[0]), parseFloat(point[1])]);
									}
									break;
								}
							}
						});
					}
				}
			}
		}
		else {
			var clusterLength = map.dataSources.length;
			if (clusterLength > 0) {
				var k = 0;
				while (k < clusterLength) {
					var clusterLayer = map.dataSources.get(k);
					if (clusterLayer.name == layrName) {
						var ent = map.dataSources.get(k).entities.getById(id);
						ent.entProp = {};
						ent.entProp = properties;
						ent.position = Cesium.Cartesian3.fromDegrees(point[0], point[1]);
						ent.billboard.image.setValue(properties.img_url);
					}
					k++;
				}
			}
		}
	}
	catch (err) {
		console.error("ERROR Feature.clusterUpdatePropertiesLatLon: ", err);
	}
}
tmpl.Feature.changeTypeVisibility = function (param) {
	var mapObj = param.map;
	var layrName = param.layer;
	var type = param.type;
	var visible = param.visible;
	var existing;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}

		if (layrName === null || layrName === undefined || layrName === '' || layrName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layrName value' };
		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

		if (type === null || type === undefined || type === '' || type === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid type' };
		}

		if (visible === null || visible === undefined || visible === '' || visible === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid visible value' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var fea;
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === layrName) {
				existing = existingLayer;
				test1 = existingLayer;
				//alert(type);
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if (feature.getProperties().features != undefined)
						var len = feature.getProperties().features.length;
					for (var j = 0; j < len; j++) {
						console.log("category_idb", feature.getProperties().features[j].get('category_id'));
						if (feature.getProperties().features[j].get('category_id') == type) {
							console.log("changeTypeVisibility changeTypeVisibility changeTypeVisibility");
							fea = feature.getProperties().features[j];
							//if(fea.get('img_url') != '')
							//fea.set('ff',fea.get('img_url'));
							if (visible == false) {
								fea.set('img_url', '');
							} else {
								fea.set('img_url', fea.get('ff'));
							}

							//console.log("beforebeforebefore",allClusterTypeData,type);

							//console.log("afterafterafter",allClusterTypeData,type);
						} else {
							//fea = feature.getProperties().features[j];
							//fea.set('img_url',fea.get('ff'));
						}
					}

				});



				break;
			}
		}
	}
	return { status: true, message: 'tmpl.Feature.changeTypeVisibility executed successfully' }

}

tmpl.Feature.getLabel = function (param) {
	var mapObj = param.map;
	var layerName = param.layer;
	var id = param.id;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}

		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerName value' };
		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var labelName;
	var existing;
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === layerName) {
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if (feature.get('id') == id) {
						labelName = feature.getProperties()['label'];
					}
				});
			}
		}
	}

	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layerName) {
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (feature) {
					if (feature.get('id') == id) {
						labelName = feature.getProperties()['label'];
					}
				});
			}

		}

	}

	return labelName;
}



tmpl.Feature.changeColor = function (param) {
	var mapObj = param.map;
	var id = param.id;
	var layerName = param.layer;
	var colorval = param.color;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerName value' };
		}

		if (colorval === null || colorval === undefined || colorval === '' || colorval === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid colorval' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === layerName) {
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (feature) {
					if (feature.getProperties()['id'] == id) {
						feature.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: colorval
							}),
							stroke: new ol.style.Stroke({
								color: colorval,
								width: 1
							}),
							image: new ol.style.Circle({
								radius: 1,
								fill: new ol.style.Fill({
									color: colorval
								})
							})
						}));
					}
				});
			}
		}
	}
	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == layerName) {
				var layer = tmpl_setMap_layer_global[i].layer;
				layer.getSource().getFeatures().forEach(function (feature) {
					if (feature.getProperties()['id'] == id) {
						feature.setStyle(new ol.style.Style({
							fill: new ol.style.Fill({
								color: colorval
							}),
							stroke: new ol.style.Stroke({
								color: colorval,
								width: 1
							}),
							image: new ol.style.Circle({
								radius: 1,
								fill: new ol.style.Fill({
									color: colorval
								})
							})
						}));
					}
				});
			}
		}

	}

	return { status: true, message: 'tmpl.Feature.changeColor executed successfully' }
}


var resultGetEditDetails = {};

tmpl.Feature.saveSpatialEdit = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	mapObj.removeInteraction(modify1);
	tmpl.Feature.spatialEditClose();
	return resultGetEditDetails.geometry;
}
tmpl.Feature.cancelSpatialEdit = function (param) {
	var mapObj = param.map;
	var feature = originalFeature.feature;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}

		if (feature === null || feature === undefined || feature === '' || feature === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid feature value' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}


	if (feature != undefined) {
		feature.getGeometry().setCoordinates(resultGetEditDetails.coordinates);
		var originalStyle = feature.get('originalStyle');
		if (originalStyle) {
			feature.setStyle(originalStyle);
		}
	}
	//console.log(feature.getGeometry().getCoordinates());
	mapObj.removeInteraction(modify1);
	tmpl.Feature.spatialEditClose();
}

var feature_spatial_edit_id;
var feature_spatial_edit_layer;
var feature_spatial_edit_layer_callback;
var originalFeature = {};
tmpl.Feature.spatialEditClose = function () {
	feature_spatial_edit_id = '';
	feature_spatial_edit_layer = '';
	originalFeature = {};
}
tmpl.Feature.spatialEdit = function (param) {
	var mapObj = param.map;
	var callbackFunc = param.callbackFunc;
	feature_spatial_edit_layer_callback = param.getDetailsCallbackFunc;
	var zoom = param.zoom;
	var propertyId = param.id;
	var lyrName = param.layerName;
	feature_spatial_edit_id = propertyId;
	feature_spatial_edit_layer = lyrName;
	var ft, latlon, wktGeom, coord, value;
	var previousFeature;
	var restrict_layer;
	var zoomExtent, zoomCoord;

	var format = new ol.format.WKT();
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	var selectfeatureIdEdit = new ol.interaction.Select({ wrapX: false, condition: ol.events.condition.click });
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') == lyrName) {
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == propertyId) {
						fea.set('originalStyle', fea.getStyle());
						originalFeature.feature = fea;
						value = fea.getGeometry().getType();
						previousFeature = fea;
						ft = fea;
						if (value == 'Polygon') {
							previousFeature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: 'green'
								}),
								stroke: new ol.style.Stroke({
									color: 'green',
									width: 2
								})
							})
							);
						}
						restrict_layer = existingLayer;
						// existingLayer.getSource().clear();
						existingLayer.getSource().removeFeature(previousFeature);
						existingLayer.getSource().addFeature(previousFeature);


					}
				});
			}
		}
	}
	if (existing == undefined) {
		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title == lyrName) {
				var layerExits = tmpl_setMap_layer_global[i].layer;
				layerExits.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == propertyId) {
						fea.set('originalStyle', fea.getStyle());
						originalFeature.feature = fea;
						value = fea.getGeometry().getType();
						previousFeature = fea;
						ft = fea;
						if (value == 'Polygon') {
							previousFeature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: 'green'
								}),
								stroke: new ol.style.Stroke({
									color: 'green',
									width: 2
								})
							})
							);
						}
						restrict_layer = layerExits;
						layerExits.getSource().removeFeature(previousFeature);
						layerExits.getSource().addFeature(previousFeature);
					}
				});
			}
		}

	}
	if (zoom == true) {
		if (value == 'Point') {
			zoomExtent = ft.getGeometry().getCoordinates();
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
				zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
			} else {
				zoomCoord = zoomExtent;
			}
			//console.log(zoomCoord);
			tmpl.Zoom.toXY({
				map: mapObj,
				latitude: zoomCoord[1],
				longitude: zoomCoord[0]
			});
		} else {
			zoomExtent = ft.getGeometry().getExtent();
			if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
				zoomCoord = ol.proj.transformExtent(zoomExtent, 'EPSG:3857', 'EPSG:4326');
			} else {
				zoomCoord = zoomExtent;
			}
			tmpl.Zoom.toExtent({
				map: mapObj,
				extent: zoomCoord
			});
		}
	}

	selectfeatureIdEdit.getFeatures().a = [];
	selectfeatureIdEdit.getFeatures().a.push(ft);
	mapObj.removeInteraction(modify1);
	modify1 = new ol.interaction.Modify({
		features: selectfeatureIdEdit.getFeatures()
	});

	//latlon = ft.getGeometry().getCoordinates();
	resultGetEditDetails.coordinates = ft.getGeometry().getCoordinates();
	modify1.on('modifyend', function () {
		if (value === 'Point') {
			lonlat = ft.getGeometry().getCoordinates();
		}
		else if (value === 'LineString') {
			lonlat = ft.getGeometry().getFirstCoordinate();
		}
		else if (value === 'Polygon' || value === 'Circle') {
			// alert();
			console.log(value);
			lonlat = ft.getGeometry().getInteriorPoint().getCoordinates();
		}
		if (appConfigInfo.mapData == "google" || appConfigInfo.mapData == 'hereMaps') {
			wktGeom = format.writeGeometry(ft.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
			//console.log(wktGeom);
			//console.log(ol.proj.transform([latlon[0],latlon[1]], 'EPSG:3857', 'EPSG:4326'));
		} else {
			wktGeom = format.writeGeometry(ft.getGeometry());
			coord = lonlat;//ft.getGeometry().getCoordinates();
			//console.log(wktGeom);
			//console.log([latlon[0],latlon[1]]);
		}

		resultGetEditDetails.geometry = { geometry: wktGeom, coordinates: coord, value: value };
		resultGetEditDetails.feature = ft;

		callbackFunc(resultGetEditDetails.geometry);
	})
	mapObj.addInteraction(modify1);
}

tmpl.Feature.cancelDragDropDetails = function () { };
tmpl.Feature.dragDropDetails = function (param) {
	var mapObj = param.map;
	var callbackFunc = param.callbackFunc;
	var img_url = param.img_url;
	var slyrName = param.sourceLayer;
	var dlyrName = param.destinationLayer;
	var ft, latlon, wktGeom, coord, value;
	var previousFeature;
	var restrict_layer;
	var zoomExtent, zoomCoord;
	var format = new ol.format.WKT();

	var layerS, featureTemp;
	for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
		if (tmpl_setMap_layer_global[i].title == slyrName) {
			layerS = tmpl_setMap_layer_global[i].layer;

		}
	}
	mapObj.removeInteraction(draw);
	mapObj.removeInteraction(drawm);
	mapObj.removeInteraction(selectE);
	var selectfeatureIdEdit = new ol.interaction.Select({ wrapX: false, condition: ol.events.condition.click });
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;
	var dragedFeature;
	window.app = {};
	var app = window.app;
	var format = new ol.format.WKT();
	app.Drag = function () {
		ol.interaction.Pointer.call(this, {
			handleDownEvent: app.Drag.prototype.handleDownEvent,
			handleDragEvent: app.Drag.prototype.handleDragEvent,
			handleMoveEvent: app.Drag.prototype.handleMoveEvent,
			handleUpEvent: app.Drag.prototype.handleUpEvent
		});
		this.coordinate_ = null;
		this.cursor_ = 'pointer';
		this.feature_ = null;
		this.previousCursor_ = undefined;
	};
	ol.inherits(app.Drag, ol.interaction.Pointer);

	app.Drag.prototype.handleDownEvent = function (evt) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function (feature, layer) {
				//console.log(layer,feature.get('layer_name'));
				if (layer == null) {
					if (feature.get('layer_name') == slyrName) {
						feature.set('coord', feature.getGeometry().getCoordinates());
						var coordS = feature.getGeometry().getCoordinates();
						var pointdata_s = new ol.geom.Point(coordS);
						featureTemp = new ol.Feature({
							geometry: pointdata_s
						});
						featureTemp.setStyle(new ol.style.Style({
							image: new ol.style.Icon(({
								anchor: [0.5, 1],
								src: feature.getStyle().getImage().getSrc()
							})),
							text: new ol.style.Text({
								font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
								textAlign: 'center',
								text: feature.getStyle().getText().getText(),
								fill: new ol.style.Fill({
									color: feature.getStyle().getText().getFill().getColor(),
									width: 20
								}),
								stroke: new ol.style.Stroke({
									color: feature.getStyle().getText().getStroke().getColor(),
									width: 6
								})
							})
						}));
						layerS.getSource().addFeature(featureTemp);
						return feature;
					}
				} else if (layer.get('title') == slyrName) {
					//layer.getSource().addFeature(feature);
					return feature;
				}

			});

		if (feature) {
			this.coordinate_ = evt.coordinate;
			this.feature_ = feature;
		}
		return !!feature;
	};

	app.Drag.prototype.handleDragEvent = function (evt) {
		var map = evt.map;
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function (feature, layer) {
				return feature;
			});
		var deltaX = evt.coordinate[0] - this.coordinate_[0];
		var deltaY = evt.coordinate[1] - this.coordinate_[1];
		var geometry =
			(this.feature_.getGeometry());
		geometry.translate(deltaX, deltaY);
		this.coordinate_[0] = evt.coordinate[0];
		this.coordinate_[1] = evt.coordinate[1];
	};

	app.Drag.prototype.handleMoveEvent = function (evt) {
		if (this.cursor_) {
			var map = evt.map;
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function (feature, layer) {
					return feature;
				});
			var element = evt.map.getTargetElement();
			if (feature) {
				editFeature = feature;
				point = feature.getGeometry().getCoordinates();
				var point;
				if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
					point = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
				}
				else {
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
		var map = evt.map;
		var value = this.feature_.getGeometry().getType();
		if (value === 'Point') {
			lonlat = this.feature_.getGeometry();
		}
		else if (value === 'LineString') {
			lonlat = this.feature_.getGeometry();
		}
		else if (value === 'Polygon') {
			lonlat = this.feature_.getGeometry();
		}

		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps') {
			coordinate = ol.proj.transform(lonlat.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
			wktGeom = format.writeGeometry(lonlat.clone().transform('EPSG:3857', 'EPSG:4326'));
		}
		else {
			coordinate = lonlat.getCoordinates();
			wktGeom = format.writeGeometry(lonlat);
			//  wktGeom= format.writeGeometry(this.feature_.getGeometry());
		}

		var result = {
			new_coordinates: coordinate
		};
		var dragFeature = this.feature_;

		if (dragFeature.getGeometry().getType() == 'Point') {
			layerS.getSource().removeFeature(featureTemp);
			lonlat = dragFeature.getGeometry().getCoordinates();
			dragFeature.getGeometry().setCoordinates(dragFeature.get('coord'));

			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				var lyr = tmpl_setMap_layer_global[i].title;
				if (dlyrName.indexOf(lyr) != -1) {
					restrict_layer = tmpl_setMap_layer_global[i].layer;
					//lonlat =tempFea.getGeometry().getCoordinates();
					var closestFeature = restrict_layer.getSource().getClosestFeatureToCoordinate(lonlat);

					var resultLocation = lonlat;

					var c1 = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');



					var c2 = ol.proj.transform(closestFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
					var line = new ol.geom.LineString([c1, c2]);
					var len = line.getLength() * 100;
					console.log(len);
					var setZoomWiseLength = 0;
					if (map.getView().getZoom() <= 12) {
						setZoomWiseLength = 0.8;
					} else if (map.getView().getZoom() == 13) {
						setZoomWiseLength = 0.4;
					} else if (map.getView().getZoom() == 14) {
						setZoomWiseLength = 0.1;
					} else if (map.getView().getZoom() == 15) {
						setZoomWiseLength = 0.09;
					} else if (map.getView().getZoom() == 16) {
						setZoomWiseLength = 0.05;
					} else if (map.getView().getZoom() == 17) {
						setZoomWiseLength = 0.03;
					} else if (map.getView().getZoom() == 18) {
						setZoomWiseLength = 0.02;
					} else if (map.getView().getZoom() == 19) {
						setZoomWiseLength = 0.01;
					} else if (map.getView().getZoom() == 20) {
						setZoomWiseLength = 0.01;
					} else if (map.getView().getZoom() == 21) {
						setZoomWiseLength = 0.01;
					}
					if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
						if (len < setZoomWiseLength) {
							//alert("already Exist");
							var res = {
								source: dragFeature.getProperties(),
								destination: closestFeature.getProperties(),
								location: c1
							};
							callbackFunc(res);
						} else {

							var res = {
								source: dragFeature.getProperties(),
								destination: '',
								location: c1
							};
							callbackFunc(res);
						}
					} else {
						if (len < setZoomWiseLength) {
							//alert("already Exist");
							var res = {
								source: dragFeature.getProperties(),
								destination: closestFeature.getProperties(),
								location: resultLocation
							};
							callbackFunc(res);
						} else {

							var res = {
								source: dragFeature.getProperties(),
								destination: '',
								location: resultLocation
							};
							callbackFunc(res);
						}
					}

				}
			}

		}

		//mycallback(result);
		this.coordinate_ = null;
		this.feature_ = null;
		return false;
	};
	intr = new app.Drag();
	mapObj.addInteraction(intr);
	tmpl.Feature.cancelDragDropDetails = function (param) {
		var map = param.map;
		map.removeInteraction(intr);
	}
}

tmpl.Feature.VisibilityFlag = false;
tmpl.Feature.changeVisibilityById = function (param) {
	var mapObj = param.map;
	var id = param.id;
	var layerName = param.layer;
	var visibility = param.visible;
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var existing;

	for (var i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer && existingLayer.get('title') === layerName) {
			existing = existingLayer;

			existingLayer.getSource().getFeatures().forEach(function (feature) {
				if (feature.getProperties()['id'] == id) {
					if (visibility) {
						try {
							var storedStyle = feature.get('sty');
							if (storedStyle) {
								feature.setStyle(storedStyle);
							}
						} catch (err) {
							console.error("SetStyle error (visible=true): " + err);
						}
					} else {

						try {
							// Store original style only once
							if (!feature.get('sty')) {
								var originalStyle = feature.getStyle();
								feature.set('sty', originalStyle);
							}

							// Apply an empty style to hide the feature
							var emptyImgStyle = new ol.style.Style({ image: '' });
							feature.setStyle(emptyImgStyle);
						} catch (err) {
							console.error("SetStyle error (visible=false): " + err);
						}
					}
				}
			});

			// Optional: clear and re-add features (preserving identity)
			var allFeatures = existingLayer.getSource().getFeatures();
			existingLayer.getSource().clear();
			existingLayer.getSource().addFeatures(allFeatures);
		}
	}
	// If not found in current map layers, check global layers
	if (existing === undefined) {
		console.log('Layer not found in map — checking tmpl_setMap_layer_global');

		for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
			if (tmpl_setMap_layer_global[i].title === layerName) {
				var globalLayer = tmpl_setMap_layer_global[i].layer;

				globalLayer.getSource().getFeatures().forEach(function (feature) {
					if (feature.getProperties()['id'] == id) {
						if (visibility) {
							try {
								var storedStyle = feature.get('sty');
								if (storedStyle) {
									feature.setStyle(storedStyle);
								} else {
									feature.setStyle(null);
								}
							} catch (err) {
								console.error("SetStyle error (global, visible=true): " + err);
							}
						} else {
							try {
								if (!feature.get('sty')) {
									var originalStyle = feature.getStyle();
									feature.set('sty', originalStyle);
								}

								var emptyImgStyle = new ol.style.Style({ image: '' });
								feature.setStyle(emptyImgStyle);
							} catch (err) {
								console.error("SetStyle error (global, visible=false): " + err);
							}
						}
					}
				});

				// Optional: clear and re-add
				var allFeatures = globalLayer.getSource().getFeatures();
				globalLayer.getSource().clear();
				globalLayer.getSource().addFeatures(allFeatures);
			}
		}
	}
};


