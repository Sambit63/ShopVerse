// ********************* SDK_MAP_API (4)createWithCluster********************* //

tmpl_overlayCluster_golbal = [];
a = [];
blinkingIntervals = [];
blinkingFieldArray = [];
gbl_clusterFeatures = [];
var tooltipFlag = 0;
var clearIconBlink;
let clusterVectorSource = {};
let nonClusterVectorSource = {};
let glbHandler = null;

tmpl.Overlay.createWithCluster = function (param) {
	const mapObj = param.map;
	gbl_clusterMap = mapObj;
	const layerName = param.layer;
	const jsonobj = param.features;
	var image_scale = param.icon_scale ? param.icon_scale : 1.0;
	const distance = param.distance != undefined ? param.distance : 50;
	const radius = param.radius != undefined ? param.radius : 15;
	var fillColor = param.fillColor != undefined ? param.fillColor : 'rgba(0, 0, 255, 1)';
	var countTextColor = param.countTextColor != undefined ? param.countTextColor : 'rgb(242, 242, 245)';
	const getHoverLabel = param.getHoverLabel;
	const showLabelZoom = 10;
	const zIndex = param.zIndex !== undefined ? param.zIndex : 3;
	var isOverlay = true;
	param.isOverlay = true;
	let viewer = param.map;
	var image_scale = param.icon_scale ? param.icon_scale : 1.0;
	var showLabel = param.showLabel != undefined ? param.showLabel : false;
	var coutPixelSize = param.coutPixelSize != undefined ? param.coutPixelSize : '10';
	var labelOffset = param.labelOffset || [0, 0];
	var labelOffsetX = labelOffset[0] !== undefined ? labelOffset[0] : 0;
	var labelOffsetY = labelOffset[1] !== undefined ? labelOffset[1] : 0;
	var labelBold = param.labelBold === true ? 'bold ' : '';


	try {

		if (param.layerSwitcher) {
			layerSwitcher = param.layerSwitcher;
		} else {
			layerSwitcher = false;
		}

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}


		if (jsonobj === null || jsonobj === undefined || jsonobj === '' || jsonobj === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid jsonobj' };
		}


		if (radius === null || radius === undefined || radius === '' || radius === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid radius' };
		}

		if (distance === null || distance === undefined || distance === '' || distance === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid distance' };
		}


		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerName' };
		}



		if (layerSwitcher === null || layerSwitcher === undefined || layerSwitcher === '' || layerSwitcher === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerSwitcher' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == 'ol7') {
				console.log('inside ol7 liberary')
				let styleCache = {};
				let vectorSource = null; // Will be assigned dynamically

				// Check if the layer already exists in the map
				var layers = mapObj.getLayers();
				var existingLayer = layers.getArray().find(layer => layer.get('title') === layerName);

				if (existingLayer) {
					console.log(`Found existing layer: ${layerName}`);
					vectorSource = existingLayer.getSource().getSource(); // Get the original Vector source from Cluster source
				} else {
					console.log(`Creating new layer: ${layerName}`);
					vectorSource = new ol.source.Vector();
				}

				function addFeaturesBatch(index = 0, batchSize = 1000) {
					const chunk = jsonobj.slice(index, index + batchSize);
					chunk.forEach(data => {
						var iconStyle = new ol.style.Icon({
							src: data.img_url,
							scale: image_scale,
							opacity: 1,
							zIndex: zIndex
						});
						var textStyle = new ol.style.Text({
							text: data.label || '', // Use label from data
							font: coutPixelSize + 'px' + ' ' + 'Verdana',
							textAlign: 'center',
							offsetY: 15,
							fill: new ol.style.Fill({ color: data.label_color || '#fff' }), // Use label color
							stroke: new ol.style.Stroke({ width: 6, color: data.label_bgcolor || '#000' }), // Optional background
							overflow: true,
						});

						var featureStyle = new ol.style.Style({
							image: iconStyle,
							text: textStyle
						});

						// var coordinates = ol.proj.fromLonLat([parseFloat(data.lon), parseFloat(data.lat)]);
						if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData === 'hereMaps' || appConfigInfo.mapData === 'trinity' || appConfigInfo.mapData === 'mmi' || appConfigInfo.mapData === 'sgl'	) {
							coordinates = ol.proj.transform([parseFloat(data.lon), parseFloat(data.lat)], 'EPSG:4326', 'EPSG:3857');
						} else {
							coordinates = [parseFloat(data.lon), parseFloat(data.lat)];
						}
						const geometry = new ol.geom.Point(coordinates);
						const feature = new ol.Feature({ geometry: geometry, label: data.label, });

						feature.setProperties(data);
						feature.set('img_url', data.img_url);
						feature.setId(data.id);
						feature.set('layer_name', layerName);
						feature.setStyle(featureStyle);

						vectorSource.addFeature(feature);
					});

					if (index + batchSize < jsonobj.length) {
						requestAnimationFrame(() => addFeaturesBatch(index + batchSize, batchSize)); // Next batch
					} else {
						finalizeLayer();
					}
				}

				function finalizeLayer() {
					console.log(`Finalizing clustering for layer: ${layerName}...`);

					let clusterSource = new ol.source.Cluster({
						distance: distance,
						source: vectorSource,
					});

					if (!existingLayer) {
						var overlayLayer = new ol.layer.Vector({
							title: layerName,
							visible: true,
							'cluster': true,
							zIndex: zIndex,
							source: clusterSource,
							style: function (fea12) {
								if (fea12 != undefined) {
									var size = fea12.get('features').length;
									for (var j = 0; j < fea12.get('features').length; j++) {
										if (fea12.get('features')[j].get('img_url') == '') {
											size = size - 1;
										}
									}
									var style = styleCache[size];
									var style2 = styleCache[size];
									dd = fea12;
									if (size == 1) {
										// console.log("size~~~",size)
										// console.log("size~~~",fea12.get('features')[0].getProperties())
										let feature = fea12.get('features')[0].getProperties();
										let paramData = { map: mapObj, features: feature }
										//tmpl.Overlay.badge(paramData);


										// if(param.animationRequired!=undefined){
										// 	tmpl.Overlay.createWithAnimation(param);
										// }
										// if(param.isBadgeRequired!=undefined){
										// 	tmpl.Overlay.badge(param)
										// }
										if (showLabel == true) {
											if (gbl_clusterMap.getView().getZoom() > showLabelZoom) {
												style2 = new ol.style.Style({
													image: new ol.style.Icon(({
														anchor: [0.5, 0.5],
														src: fea12.get('features')[0].getProperties().img_url
													})),
													text: new ol.style.Text({
														font: labelBold + coutPixelSize + 'px' + ' ' + 'Verdana',
														textAlign: 'center',
														text: fea12.get('features')[0].getProperties().label,
														offsetX: labelOffsetX,
														offsetY: labelOffsetY,
														fill: new ol.style.Fill({
															color: fea12.get('features')[0].getProperties().label_color,
															width: 20,
														}),
														stroke: new ol.style.Stroke({
															width: 6,
															color: fea12.get('features')[0].getProperties().label_bgcolor,
														}),
													})
												});
											} else {
												style2 = new ol.style.Style({
													image: new ol.style.Icon(({
														anchor: [0.5, 0.5],
														src: fea12.get('features')[0].getProperties().img_url
													}))
												});
											}

										} else {
											style2 = new ol.style.Style({
												image: new ol.style.Icon(({
													anchor: [0.5, 0.5],
													src: fea12.get('features')[0].getProperties().img_url
												})),
											});
										}

										fea12.setStyle(style2);
									} else if (size == 0) {
										style = new ol.style.Style({
											image: new ol.style.Circle({
												radius: 0,
												stroke: new ol.style.Stroke({
													color: 'rgba(0,0,0,0)'
												}),
												fill: new ol.style.Fill({
													color: 'rgba(0,0,0,0)'
												})
											})
										});
										styleCache[size] = style;
									} else {
										if (param.animationRequired != undefined) {
											tmpl.Overlay.removeWithAnimation(param);
										}
										if (param.isBadgeRequired != undefined) {
											tmpl.Overlay.removeBadges(param)
										}
										//if (!style) {
										if (showLabel == true) {
											if (gbl_clusterMap.getView().getZoom() > showLabelZoom) {

												var cLabel = size.toString();
												if (fea12.get('features')[0].getProperties().location != undefined) {
													cLabel = size.toString() + '\n' + fea12.get('features')[0].getProperties().location;
												}

												style = new ol.style.Style({
													image: new ol.style.Circle({
														radius: radius,
														stroke: new ol.style.Stroke({
															color: fillColor
														}),
														fill: new ol.style.Fill({
															color: fillColor
														})
													}),
													textAlign: 'center',
													text: new ol.style.Text({
														text: cLabel,//(size.toString()+'\n'+fea12.get('features')[0].getProperties().location),
														// offsetY: 7,
														font: labelBold + coutPixelSize + 'px' + ' ' + 'Verdana',
														offsetX: 0,
														offsetY: 0,
														fill: new ol.style.Fill({
															color: countTextColor,
														}),
														stroke: new ol.style.Stroke({
															width: 2,
															color: countTextColor,
														}),
													})
												});
											}
											else {
												//console.log("from api showLabel else -", showLabel);
												style = new ol.style.Style({
													image: new ol.style.Circle({
														radius: radius,
														stroke: new ol.style.Stroke({
															color: fillColor
														}),
														fill: new ol.style.Fill({
															color: fillColor
														})
													}),
													textAlign: 'center',
													text: new ol.style.Text({
														text: size.toString(),
														font: coutPixelSize + 'px' + ' ' + 'Verdana',
														fill: new ol.style.Fill({
															color: countTextColor
														}),
														stroke: new ol.style.Stroke({
															width: 2,
															color: countTextColor
														})
													})
												});
											}

										} else {
											style = new ol.style.Style({
												image: new ol.style.Circle({
													radius: radius,
													stroke: new ol.style.Stroke({
														color: fillColor
													}),
													fill: new ol.style.Fill({
														color: fillColor
													})
												}),
												textAlign: 'center',
												font: coutPixelSize + 'px' + ' ' + 'Verdana',
												text: new ol.style.Text({
													text: size.toString(),
													font:  coutPixelSize + 'px' + ' ' + 'Verdana',
													fill: new ol.style.Fill({
														color: countTextColor
													}),
													stroke: new ol.style.Stroke({
														width: 2,
														color: countTextColor
													})
												})
											});
										}

										styleCache[size] = style;
										//}
									}
								}
								return style;
							}
						});

						mapObj.addLayer(overlayLayer);

						tmpl_setMap_layer_global.push({
							layer: overlayLayer,
							title: layerName,
							visibility: true,
							map: mapObj
						});

						tmpl_setMap_layer_global_array.push({
							layer: overlayLayer,
							title: layerName,
							visibility: true,
							map: mapObj
						});

					} else {
						console.log(`Updating existing layer: ${layerName}`);
						existingLayer.getSource().clear(); // Remove previous clustered features
						existingLayer.setSource(clusterSource); // Set the updated cluster source
					}

					clusterVectorSource[layerName] = { vectorSource, clusterSource };

					requestAnimationFrame(() => tmpl.Overlay.createWithAnimation({ map: mapObj, layer: layerName, features: jsonobj }));
					requestAnimationFrame(() => tmpl.Overlay.badge({ map: mapObj, layer: layerName, features: jsonobj }));
					requestAnimationFrame(() => tmpl.Overlay.addCamFieldOfView({ map: mapObj, layer: layerName, features: jsonobj }));
				}

				addFeaturesBatch();
			}

			return { status: true, message: 'Overlay.createWithCluster executed successfully' }
		}
		else {
			var dataSource = new Cesium.CustomDataSource(layerName);

			dataSource.clustering.enabled = true;
			dataSource.clustering.pixelRange = 40;
			dataSource.clustering.minimumClusterSize = 2;

			jsonobj.forEach(position => {
				position.type = "Clustered Entity";
				position.layer_name = layerName;
				let id = position.id;
				let newCustomEntity = dataSource.entities.add({
					id: position.id,
					position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
					billboard: {
						image: position.img_url,
						scale: image_scale,
						// verticalOrigin: Cesium.VerticalOrigin.BOTTOM
					},
					entProp: position,
				});
				tmpl_overlayCluster_golbal.push(newCustomEntity);
				if (position.isBadgeRequired) {
					let dataEntity = dataSource.entities.getById(id);
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
				if (position.animationRequired) {
					tmpl.Overlay.createWithAnimation({
						map: viewer,
						features: [position],
						layer: layerName
					});
				}
			});
			tmpl.Overlay.addCamFieldOfView(param);
			dataSource.clustering.clusterEvent.addEventListener(function (clusteredEntities, cluster) {
				cluster.label.show = false;
				cluster.billboard.show = true;
				cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
				const pinBuilder = new Cesium.PinBuilder();
				cluster.billboard.image = pinBuilder.fromText(clusteredEntities.length, Cesium.Color.fromCssColorString(fillColor), 48).toDataURL();
				// console.log(clusteredEntities);
				// console.log(viewer.entities.values)
			});

			viewer.dataSources.add(dataSource);

			let cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
			let ellipsoid = viewer.scene.globe.ellipsoid;
			let scene = viewer.scene;
			let camera = viewer.camera;
			scene.screenSpaceCameraController.enableZoom = true;
			scene.screenSpaceCameraController.enableTranslate = true;

			if (!glbHandler) {
				glbHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
			}

			glbHandler.setInputAction(function (click) {
				var pickedObject = viewer.scene.pick(click.position);
				var position = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

				if (Cesium.defined(pickedObject) && pickedObject.id) {
					var entity = pickedObject.id;
					//console.log(entity)

					if (entity.entProp && entity.entProp.type) {
						let properties = entity.entProp;
						let layerName = properties.layer_name;
						let longitudeString = properties.lon;
						let latitudeString = properties.lat;
						let coord = [longitudeString, latitudeString];
						// console.log(properties);
						// console.log('entity',entity)
						switch (entity.entProp.type) {
							case "Non-Clustered Entity":
								getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
								break;
							case "Clustered Entity":
								getOverlayFeatureDetails([entity.id.toString()], coord, layerName, [properties], viewer);
								break;
							case "3D Model":
								getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
								break;
							default:
								console.log("Unhandled entity type.");
						}
					}
				} else {
					console.log("No entity picked.");
				}

			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}
	}
	catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	return { status: true, message: 'Overlay.createWithCluster executed successfully' }

}




// tmpl.Overlay.create = function (param) {
// 	var mapObj = param.map;
// 	var jsonobj = param.features;
// 	var layerName = param.layer;
// 	var getHoverLabel = param.getHoverLabel;
// 	var layerSwitcher = false;
// 	var trackLayer = param.trackLayer;
// 	var image_scale = param.icon_scale;
// 	var getdata = jsonobj;

// 	try {

// 		if (param.layerSwitcher) {
// 			layerSwitcher = param.layerSwitcher;
// 		}

// 		if (mapObj === null || mapObj === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
// 		}


// 		if (jsonobj === null || jsonobj === undefined || jsonobj === '' || jsonobj === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid jsonobj ' };
// 		}


// 		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerName ' };
// 		}

// 		if (layerSwitcher === null || layerSwitcher === undefined || layerSwitcher === '' || layerSwitcher === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerSwitcher' };
// 		}

// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

// 		}
// 	}

// 	if (image_scale == undefined)
// 		image_scale = 1;
// 	if (getdata.length == 0) {
// 		return false;
// 	}

// 	if (appConfigInfo.mapDimension == '2D') {

// 		if (trackLayer == false || trackLayer == undefined) {
// 			var featureDataAry = [];
// 			tmpl.Overlay.badge(param)
// 			for (var i = 0, length = getdata.length; i < length; i++) {
// 				var geometry;
// 				var anagle;
// 				if (getdata[i].ot_track_angle != undefined)
// 					anagle = getdata[i].ot_track_angle;
// 				else
// 					anagle = 0;

// 				var iconStyle;
// 				if (getdata[i].icon_colour) {
// 					iconStyle = new ol.style.Icon(({
// 						src: getdata[i].img_url,
// 						anchor: [0.5, 1],
// 						scale: image_scale,
// 						opacity: 0.9, // Set the desired opacity value between 0 and 1
// 						color: getdata[i].icon_colour,//@sh color
// 						// rotation: anagle											
// 					}));
// 				} else {
// 					iconStyle = new ol.style.Icon(({
// 						src: getdata[i].img_url,
// 						anchor: [0.5, 0.5],
// 						scale: image_scale,
// 						// opacity: 0.9, // Set the desired opacity value between 0 and 1
// 						// color: route_color,//@sh color
// 						// rotation: anagle											
// 					}));
// 				}


// 				if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps' ||
// 				    appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi') {
// 					geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
// 				}
// 				else {
// 					var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
// 					geometry = new ol.geom.Point(coordinate);
// 				}
// 				var featureval = new ol.Feature({
// 					geometry: geometry
// 				});
// 				featureval.setId(getdata[i].id);
// 				featureval.setProperties(getdata[i]);

// 				if (getdata[i].label_color == undefined) {
// 					getdata[i].label_color = '#ffffff00';
// 				}

// 				if (getdata[i].label_bgcolor == undefined) {
// 					getdata[i].label_bgcolor = '#ffffff00';
// 				}

// 				if (getHoverLabel == true) {

// 					featureval.setStyle(new ol.style.Style({
// 						fill: new ol.style.Fill({
// 							color: 'rgba(255, 255, 255, 0.2)'
// 						}),
// 						image: iconStyle
// 					}));

// 				} else {
// 					featureval.setStyle(new ol.style.Style({
// 						fill: new ol.style.Fill({
// 							color: 'rgba(255, 255, 255, 0.2)'
// 						}),
// 						image: iconStyle,
// 						text: new ol.style.Text({
// 							font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
// 							textAlign: 'center',
// 							text: getdata[i].label,
// 							offsetY: 7,
// 							fill: new ol.style.Fill({
// 								color: getdata[i].label_color,
// 								width: 20
// 							}),
// 							stroke: new ol.style.Stroke({
// 								color: getdata[i].label_bgcolor,
// 								width: 6
// 							})
// 						})
// 					}));
// 				}

// 				featureval.set('layer_name', layerName);
// 				featureval.set('title', layerName);
// 				featureDataAry.push(featureval);

// 			}
// 			tmpl.Overlay.addCamFieldOfView(param);
// 			console.log("getdatagetdatagetdatagetdata",param)
// 			var paramData=param;

// 			paramData.features=param.features.filter(item => item.animationRequired);
// 			console.log("paramData~~~~~~~~~~~~~~~",paramData)
// 			if (paramData.features.length > 0) {
// 				tmpl.Overlay.createWithAnimation(paramData);
// 				//tmpl.Overlay.badge(param)
// 			}





// 			if (getHoverLabel == true) {

// 				var ta_tooltip = document.createElement('tooltip');
// 				ta_tooltip.id = 'trip-tooltip';
// 				ta_tooltip.className = 'ol-trip-tooltip';
// 				var overlay_mouseOver_label = new ol.Overlay({
// 					element: ta_tooltip,
// 					offset: [10, 0],
// 					positioning: 'bottom-left'
// 				});
// 				mapObj.addOverlay(overlay_mouseOver_label);
// 				mapObj.on('pointermove', function (evt) {

// 					var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
// 						//if(layer){
// 						if (feature.get('layer_name') == layerName) {
// 							return feature;
// 						}
// 						//}
// 					});
// 					ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
// 					if (feature_mouseOver) {
// 						overlay_mouseOver_label.setPosition(evt.coordinate);
// 						ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
// 					}
// 				});
// 			}
// 			var source = new ol.source.Vector({
// 				features: featureDataAry
// 			});
// 			var Layers = mapObj.getLayers();
// 			var length = Layers.getLength();
// 			var OverlayisLayerPresent = false;
// 			for (var i = 0; i < length; i++) {
// 				var layerTemp = Layers.item(i);
// 				console.log("layerTemp.get('title')~~~~~~~~~~~",layerTemp.get('title'))
// 				if (layerTemp.get('title') === layerName) {
// 					OverlayisLayerPresent = true;
// 					layerTemp.getSource().addFeatures(featureDataAry);
// 				}
// 			}

// 			for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
// 				if (tmpl_setMap_layer_global[j].title == layerName) {
// 					OverlayisLayerPresent = true;
// 					tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
// 				}
// 			}
// 			if (OverlayisLayerPresent == false) {

// 				var overlay = new ol.layer.Vector({
// 					title: layerName,
// 					visible: true,
// 					source: source
// 				});

// 				tmpl_setMap_layer_global.push({
// 					layer: overlay,
// 					title: layerName,
// 					visibility: true,
// 					map: mapObj
// 				});

// 				tmpl_setMap_layer_global_array.push({
// 					layer: overlay,
// 					title: layerName,
// 					visibility: true,
// 					map: mapObj
// 				});
// 				overlay.setMap(mapObj);
// 				OverlayisLayerPresent = true;
// 			}
// 		} else if (trackLayer == true) {
// 			//console.log("Track Layer");
// 			var featureDataAry = [];

// 			for (var i = 0, length = getdata.length; i < length; i++) {
// 				var geometry;
// 				console.log("getdata::", getdata);
// 				if (global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + getdata[i].id) == -1) {


// 					var anagle;

// 					if (getdata[i].ot_track_angle != undefined)
// 						anagle = getdata[i].ot_track_angle;
// 					else
// 						anagle = 0;
// 					var iconStyle;
// 					if (getdata[i].icon_colour) {
// 						iconStyle = new ol.style.Icon(({
// 							src: getdata[i].img_url,
// 							anchor: [0.5, 1],
// 							scale: image_scale,
// 							opacity: 0.9, // Set the desired opacity value between 0 and 1
// 							color: getdata[i].icon_colour,//@sh color
// 							// rotation: anagle											
// 						}));
// 					} else {
// 						iconStyle = new ol.style.Icon(({
// 							src: getdata[i].img_url,
// 							anchor: [0.5, 1],
// 							scale: image_scale,
// 							// opacity: 0.9, // Set the desired opacity value between 0 and 1
// 							// color: route_color,//@sh color
// 							// rotation: anagle											
// 						}));
// 					}




// 					if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps') {
// 						geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
// 					}
// 					else {
// 						var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
// 						geometry = new ol.geom.Point(coordinate);
// 					}
// 					var featureval = new ol.Feature({
// 						geometry: geometry
// 					});
// 					featureval.set('layer_name', layerName);
// 					featureval.setProperties(getdata[i]);
// 					if (getHoverLabel == true) {

// 						featureval.setStyle(new ol.style.Style({
// 							fill: new ol.style.Fill({
// 								color: 'rgba(255, 255, 255, 0.2)'
// 							}),
// 							image: iconStyle
// 						}));

// 					} else {
// 						//featureval.setStyle(styleImg)
// 						var styleImg = new ol.style.Style({
// 							fill: new ol.style.Fill({
// 								color: 'rgba(255, 255, 255, 0.2)'
// 							}),
// 							image: iconStyle,
// 							text: new ol.style.Text({
// 								font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
// 								textAlign: 'center',
// 								text: getdata[i].label,
// 								fill: new ol.style.Fill({
// 									color: getdata[i].label_color,
// 									width: 20
// 								}),
// 								stroke: new ol.style.Stroke({
// 									color: getdata[i].label_bgcolor,
// 									width: 16
// 								}),
// 								textBaseline: 'bottom', // or 'top' to display label above the icon
// 								//offsetY: -35 // adjust the offset value as per your requirement
// 							})
// 						});

// 						styleImg.getText().setOffsetY(parseFloat(-45)); //@shh



// 						featureval.setStyle(styleImg)
// 					}
// 					featureDataAry.push(featureval);


// 					global_fleet_layer_id.push('fleet_' + layerName + '_' + getdata[i].id);
// 					global_fleet_layer_features.push(featureval);
// 					var v1 = new tmpl.Track.smoothMovement({ map: mapObj, id: getdata[i].id, layername: layerName, feature: featureval, featureId: 'fleet_' + layerName + '_' + getdata[i].id });
// 					global_fleet_layer_objects.push(v1);
// 					var point = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
// 					v1.sendTrackData(point);

// 				}
// 			}

// 			////alert("Out side Number of features inserting : "+featureDataAry.length);
// 			if (featureDataAry.length > 0) {
// 				//console.log("Number of features inserting : ",featureDataAry.length);
// 				if (getHoverLabel == true) {

// 					var ta_tooltip = document.createElement('tooltip');
// 					ta_tooltip.id = 'trip-tooltip';
// 					ta_tooltip.className = 'ol-trip-tooltip';
// 					var overlay_mouseOver_label = new ol.Overlay({
// 						element: ta_tooltip,
// 						offset: [10, 0],
// 						positioning: 'bottom-left'
// 					});
// 					mapObj.addOverlay(overlay_mouseOver_label);
// 					mapObj.on('pointermove', function (evt) {

// 						var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
// 							if (layer == null) {
// 								if (feature.get('layer_name') == layerName) {
// 									return feature;
// 								}
// 							} else {
// 								if (layer) {
// 									if (layer.get('title') == layerName) {
// 										return feature;
// 									}
// 								}
// 							}

// 						});
// 						ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
// 						if (feature_mouseOver) {
// 							overlay_mouseOver_label.setPosition(evt.coordinate);
// 							ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
// 						}
// 					});
// 				}
// 				var source = new ol.source.Vector({
// 					features: featureDataAry
// 				});

// 				var Layers = mapObj.getLayers();
// 				var length = Layers.getLength();
// 				var OverlayisLayerPresent = false;
// 				for (var i = 0; i < length; i++) {
// 					var layerTemp = Layers.item(i);
// 					if (layerTemp.get('title') === layerName) {
// 						OverlayisLayerPresent = true;
// 						layerTemp.getSource().addFeatures(featureDataAry);
// 					}
// 				}

// 				for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
// 					if (tmpl_setMap_layer_global[j].title == layerName) {
// 						OverlayisLayerPresent = true;

// 						tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
// 					}
// 				}
// 				if (OverlayisLayerPresent == false) {
// 					var overlay = new ol.layer.Vector({
// 						title: layerName,
// 						visible: true,
// 						source: source
// 					});
// 					tmpl_setMap_layer_global.push({
// 						layer: overlay,
// 						title: layerName,
// 						visibility: true,
// 						map: mapObj
// 					});
// 					globale_layer_names.push(layerName);
// 					overlay.setMap(mapObj);
// 					//if(layerSwitcher)
// 					//mapObj.addControl(new ol.control.LayerSwitcher());
// 					OverlayisLayerPresent = true;
// 				}
// 			}

// 		}

// 		return response = { status: true, message: 'Layer Created Successfully' };

// 	} else if (appConfigInfo.mapDimension == '3D') {
// 		//3D
// 		var centerLatitude = 12.97779310373871; // Example latitude
// 		var centerLongitude = 77.61060376805897; // Example longitude
// 		var bufferRadius = 5; // 5 kilometers

// 		//createBufferAndPlot(mapObj, centerLatitude, centerLongitude, bufferRadius);
// 		// createBufferAndPlot(mapObj, centerLatitude, centerLatitude, 5, 1, Math.PI / 4, 2); // Example angle and distance



// 		console.log(" ::::::: :::::: 3D Map Overlay");


// 		var height, width, visibility;
// 		if (height == undefined) {
// 			height = 32;
// 		}
// 		if (width == undefined) {
// 			width = 32;
// 		}

// 		if (visibility == undefined) {
// 			visibility = true;
// 		}

// 		if (visibility == undefined) {
// 			visibility = true;
// 		}

// 		var getData = jsonobj;
// 		var length = getData.length;

// 		// for (var key in getData) {
// 		// var item = getData[key];

// 		// for(var key2 in item){
// 		// }		
// 		// }

// 		if (length != undefined) {
// 			var i = 0;
// 			while (i < length) {
// 				var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';

// 				for (var key2 in getData[i]) {
// 					var attr = key2.charAt(0).toUpperCase() + key2.slice(1);
// 					switch (key2) {
// 						case "id":
// 							break;

// 						case "imgurl":
// 							break;

// 						case "img_url":
// 							break;

// 						case "layer_name":
// 							break;

// 						case "label_color":
// 							break;

// 						case "label_bgcolor":
// 							break;

// 						case "fileurl":
// 							if (getData[i].upload_status) {
// 								description += '<tr><th>' + attr + '</th><td><a href=' + getData[i][key2] + '>Attachment</a></td></tr>';
// 							}
// 							else {
// 								description += '<tr><th>' + attr + '</th><td>No Attachment</td></tr>';
// 							}
// 							break;

// 						default: description += '<tr><th>' + attr + '</th><td>' + getData[i][key2] + '</td></tr>';
// 					}
// 				}
// 				description += '</tbody></table>';
// 				console.log("")
// 				createBufferAndPlot(mapObj, getData[i].lon, getData[i].lat, 1, 0.1, getData[i].viewAngle,(getData[i].viewDistance)/10000); 
// 				var billboard = new Cesium.BillboardGraphics({
// 					image: getData[i].img_url,
// 					width: width,
// 					height: height,
// 					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// 					//eyeOffset : new Cesium.Cartesian3(0.0,0.0,2000.0), // Negative Z will make it closer to the camera
// 					//pixelOffset : new Cesium.Cartesian2(0.0,-32.0), // Optional offset in pixels relative to center
// 					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
// 					scale: 1.0, // Adjust the scale as needed
// 				});

// 				// console.log("ID=========>",id);
// 				var point = mapObj.entities.add({
// 					position: Cesium.Cartesian3.fromDegrees(getData[i].lon, getData[i].lat),
// 					//point: {heightReference: Cesium.HeightReference.CLAMP_TO_GROUND},////RELATIVE_TO_GROUND
// 					name: layerName,
// 					id: getData[i].id,
// 					// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
// 					// show: visibility,
// 					description: description,
// 					// properties: getdata[i],
// 					billboard: billboard,
// 					label: {
// 						text: getData[i].name,
// 						font: '9pt Georgia',
// 						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
// 						distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000.0),
// 						// fillColor: Cesium.Color.fromCssColorString(getData[i].label_color),
// 						// outlineColor: Cesium.Color.fromCssColorString(getData[i].label_bgcolor),
// 						fillColor: Cesium.Color.BLACK,
// 						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// 						outlineWidth: 1,
// 						scaleByDistance: new Cesium.NearFarScalar(5.0e3, 1.0, 1.5e7, 0.5),
// 						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// 						pixelOffset: new Cesium.Cartesian2(0, 15),
// 						disableDepthTestDistance: Number.POSITIVE_INFINITY
// 					}
// 				});
// 				point.entProp = getData[i];
// 				point.entProp.layer_name = layerName;
// 				point.entProp.type = "Non-Clustered Entity";
// 				i++;
// 			}
// 			///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////

// 			var cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [];
// 			var ellipsoid = mapObj.scene.globe.ellipsoid;

// 			var handler = new Cesium.ScreenSpaceEventHandler(mapObj.scene.canvas);
// 			handler.setInputAction(function (click) {

// 				if (mapObj.selectedEntity != undefined) {
// 					entity = mapObj.selectedEntity;
// 					id = entity.id;
// 					layerNm = entity.name;
// 					if (entity.position != undefined) {
// 						cartesian = entity._position.getValue();
// 						//console.log("cartesian: ", cartesian);
// 						if (cartesian != undefined) {
// 							cartographic = ellipsoid.cartesianToCartographic(cartesian);
// 							longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
// 							latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
// 							coord = [longitudeString, latitudeString];
// 						}
// 						var properties = entity.entProp;
// 						console.log("clicked----->", entity.entProp.type);
// 						console.log("clicked-----:::>", entity);
// 						if (entity.entProp.type == "Non-Clustered Entity") {

// 							// // mapObj.selectionIndicator._viewModel.isVisible = false;
// 							getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
// 						} else if (entity.name == "Boundary Point") {
// 						} else {
// 							getOverlayFeatureDetails(id.toString(), coord, layerNm, properties, mapObj);
// 						}

// 					} else if (entity.polygon != undefined) {
// 						// // getOverlayFeatureDetails(id,coord,layerNm,properties,mapObj);
// 					}
// 				}
// 				// // else {
// 				// // console.log("No entity has been picked!");
// 				// // // terminateShape();
// 				// // }
// 			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// 			///////////////////////////////////// getOverlayFeatureDetails /////////////////////////////////////
// 		}
// 		else {
// 			console.error("ERROR: No features to display!");
// 		}

// // Assuming Turf.js is included in your project
// var borderWidth = 10;
// // Function to create a buffer around a point and plot it on the map
// //createBufferAndPlot(mapObj, 12.97779310373871, 77.61060376805897, 5, 1, Math.PI / 4, 2); // Example angle and distance

// function createBufferAndPlot(mapObj, centerLatitude, centerLongitude, bufferRadius, borderWidth, angle, distance) {
//     // Create buffer around the central point
//     var centerPoint = turf.point([centerLongitude, centerLatitude]);
//     var buffered = turf.buffer(centerPoint, bufferRadius, { units: 'kilometers' });
//     var bufferedCoordinates = buffered.geometry.coordinates[0];
//     var cartesianCoordinates = bufferedCoordinates.map(function(coord) {
//         return Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
//     });

//     // Create a triangular buffer without considering the center point
//     var triangleVertices = [
//          [centerLatitude ,centerLongitude],
//          [centerLatitude + distance * Math.sin(angle - (2 * Math.PI / 3)),centerLongitude + distance * Math.cos(angle - (2 * Math.PI / 3))],
//          [centerLatitude + distance * Math.sin(angle + (2 * Math.PI / 3)),centerLongitude + distance * Math.cos(angle + (2 * Math.PI / 3))]
// 		// [77.61060376805897, 12.97779310373871],
// 		// [77.61071108281905,12.977730358594997],
// 		// [77.61065743863732,12.978159004769426]
//     ];
//     console.log("triangleVertices~~~~~~~~~~~~~~~~",triangleVertices)
//     var triangleCartesianCoordinates = triangleVertices.map(function(coord) {
//         return Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
//     });

//     // Set the transparency of the material (alpha)
//     var yellowMaterialWithAlpha = Cesium.Color.YELLOW.withAlpha(0.5); // Adjust the alpha value as needed

//     // Create a triangular polygon with the transparent material
//     var polygonEntity = mapObj.entities.add({
//         name: "3D Triangle",
//         polygon: {
//             hierarchy: new Cesium.PolygonHierarchy(triangleCartesianCoordinates),
//             extrudedHeight: 850.0, // Extrusion height in meters
//             material: yellowMaterialWithAlpha,
//             outline: false,
//             outlineColor: Cesium.Color.BLACK,
//         },
//     });

//     console.log("polygonEntity~~~~~~~~~~~~~~~~~~~", polygonEntity);
//     //mapObj.zoomTo(polygonEntity);
// }


// // Example usage
// //var mapObj = new Cesium.Viewer('cesiumContainer'); // Assuming you have a Cesium viewer instance

// 	}
// }

tmpl.Overlay.addCamFieldOfView = function (param) {
	console.log("param~~~~~~~~~~~~~~~~~~~~~", param)
	var mapObj = param.map;
	for (let index = 0; index < param.features.length; index++) {
		console.log("param.features~~~~~~~~~~~~", param.features[index])
		if (param.features[index].isViewVisualRequired) {
			const centerLat = param.features[index].lat;
			const centerLon = param.features[index].lon;
			const innerRadius = 0; // in kilometers
			const outerRadius = param.features[index].viewDistance / 10000; // in kilometers
			// const startAngle = Math.PI / 6; // 30 degrees in radians
			// const endAngle = Math.PI * 5 / 6; // 150 degrees in radians
			let a = param.features[index].viewAngle - 50;
			let b = param.features[index].viewAngle + 50;
			const startAngle = (Math.PI / 180) * a; // 30 degrees in radians
			const endAngle = (Math.PI / 180) * b; // 150 degrees in radians
			console.log("startAngle,endAngle~~~~~~~~~~~~~~~", startAngle, endAngle)
			const annularSectorWKT = generateAnnularSectorWKT(centerLat, centerLon, innerRadius, outerRadius, startAngle, endAngle);
			console.log(annularSectorWKT);
			tmpl.Overlay.addGeometryWithColor({
				map: mapObj,
				geometry: annularSectorWKT,
				properties: {
					id: param.features[index].id,
				},
				label: "test",
				color: 'rgba(0, 191, 255, 0.1)',
				borderColor: 'rgba(0, 191, 255, 0.1)',
				borderWidth: 1,
				getHoverLabel: false,
				// layer:param.layer+"camField"+param.features[index].id,
				layer: param.features[index].title,
				type: "polygon",
			});
		}
	}
}

const trackFeaturesSource = new Map();
tmpl_overlay_golbal3D = new Map();
blinkingAnimation3D = [{ id: '', entity: '' }];
tmpl.Overlay.create = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var features = param.features;
	var layerName = param.layer;
	var getHoverLabel = param.getHoverLabel;
	var layerSwitcher = false;
	var trackLayer = param.trackLayer;
	var image_scale = param.icon_scale ? param.icon_scale : 1.0;
	var getdata = jsonobj;
	var showLabel = param.showLabel != undefined ? param.showLabel : false;
	var coutPixelSize = param.coutPixelSize != undefined ? param.coutPixelSize : '10';
	var labelOffset = param.labelOffset || [0, 0];
	var labelOffsetX = labelOffset[0] !== undefined ? labelOffset[0] : 0;
	var labelOffsetY = labelOffset[1] !== undefined ? labelOffset[1] : 0;
	var labelBold = param.labelBold === true ? 'bold ' : '';

	var dataType = param.type;
	try {

		if (param.layerSwitcher) {
			layerSwitcher = param.layerSwitcher;
		}

		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}


		if (jsonobj === null || jsonobj === undefined || jsonobj === '' || jsonobj === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid jsonobj ' };
		}


		if (layerName === null || layerName === undefined || layerName === '' || layerName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerName ' };
		}

		if (layerSwitcher === null || layerSwitcher === undefined || layerSwitcher === '' || layerSwitcher === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layerSwitcher' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	if (image_scale == undefined)
		image_scale = 1;
	if (getdata.length == 0) {
		return false;
	}

	if (appConfigInfo.mapDimension == '2D') {

		let styleCache = {};
		let featureDataAry = [];
		let vectorSource = null; // Will be initialized only if no existing layer
		const batchSize = 1000; // Set batch size for performance


		var layers = mapObj.getLayers();
		var existingLayer = layers.getArray().find(layer => layer.get('title') === layerName);

		if (existingLayer) {
			vectorSource = existingLayer.getSource(); // Use existing source
		} else {
			vectorSource = new ol.source.Vector(); // Create a new source
		}


		function addFeaturesBatch(index = 0) {
			const chunk = jsonobj.slice(index, index + batchSize);

			chunk.forEach(data => {
				var iconStyle = new ol.style.Icon({
					src: data.img_url,
					scale: image_scale,
					opacity: 1,
					zIndex: 3,
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					rotation: 0
				});

				if (!showLabel) {
					var featureStyle = new ol.style.Style({
						image: iconStyle,
					});
				} else {
					var featureStyle = new ol.style.Style({
						image: iconStyle,
						text: new ol.style.Text({
							font: labelBold + '12px' + ' ' + 'Verdana',
							textAlign: 'center',
							text: data.label || '',
							offsetX: labelOffsetX,
							offsetY: labelOffsetY,
							fill: new ol.style.Fill({
								color: data.label_color || '#fff',
								width: 20
							}),
							stroke: new ol.style.Stroke({
								color: data.label_bgcolor || '#000',
								width: 6
							})
						})
					});
				}

				// var coordinates = ol.proj.fromLonLat([parseFloat(data.lon), parseFloat(data.lat)]);

				if (appConfigInfo.mapData === 'google' ||appConfigInfo.mapData === 'sgl' || appConfigInfo.mapData === 'hereMaps' || appConfigInfo.mapData === 'trinity' || appConfigInfo.mapData === 'mmi') {
					coordinates = ol.proj.transform([parseFloat(data.lon), parseFloat(data.lat)], 'EPSG:4326', 'EPSG:3857');
				} else {
					coordinates = [parseFloat(data.lon), parseFloat(data.lat)];
				}
				const geometry = new ol.geom.Point(coordinates);
				const feature = new ol.Feature({ geometry: geometry });


				feature.setProperties(data);
				feature.setId(data.id);
				feature.set('img_url', data.img_url);
				feature.set('layer_name', layerName);
				feature.set('title', layerName);
				feature.setStyle(featureStyle);

				vectorSource.addFeature(feature);
				featureDataAry.push(feature)
			});


			if (index + batchSize < jsonobj.length) {
				requestAnimationFrame(() => addFeaturesBatch(index + batchSize)); // Process next batch
			} else {
				finalizeLayer();
			}
		}

		function finalizeLayer() {
			console.log(`Finalizing Layer for: ${layerName}...`);
			if (trackLayer == true) {
				//console.log("Track Layer");
				featureDataAry = [];

				for (var i = 0, length = getdata.length; i < length; i++) {
					var geometry;
					if (global_fleet_layer_id.indexOf('fleet_' + layerName + '_' + getdata[i].id) == -1) {


						var anagle;

						if (getdata[i].ot_track_angle != undefined)
							anagle = getdata[i].ot_track_angle;
						else
							anagle = 0;
						var iconStyle;
						if (getdata[i].icon_colour) {
							iconStyle = new ol.style.Icon(({
								src: getdata[i].img_url,
								anchor: [0.5, 1],
								scale: image_scale,
								opacity: 0.9, // Set the desired opacity value between 0 and 1
								color: getdata[i].icon_colour,//@sh color
								// rotation: anagle											
							}));
						} else {
							iconStyle = new ol.style.Icon(({
								src: getdata[i].img_url,
								anchor: [0.5, 1],
								scale: image_scale,
								// opacity: 0.9, // Set the desired opacity value between 0 and 1
								// color: route_color,//@sh color
								// rotation: anagle											
							}));
						}




						if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps' || appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'sgl' || appConfigInfo.mapData === 'mmi') {
							geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
						}
						else {
							var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
							geometry = new ol.geom.Point(coordinate);
						}
						var featureval = new ol.Feature({
							geometry: geometry
						});
						featureval.set('layer_name', layerName);
						featureval.set('imgURL', getdata[i].img_url);
						featureval.setProperties(getdata[i]);
						if (getHoverLabel == true) {

							featureval.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: 'rgba(255, 255, 255, 0.2)'
								}),
								image: iconStyle
							}));

						} else {
							//featureval.setStyle(styleImg)
							var styleImg = new ol.style.Style({
								fill: new ol.style.Fill({
									color: 'rgba(255, 255, 255, 0.2)'
								}),
								image: iconStyle,
								text: new ol.style.Text({
									font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
									textAlign: 'center',
									text: getdata[i].label,
									fill: new ol.style.Fill({
										color: getdata[i].label_color,
										width: 20
									}),
									stroke: new ol.style.Stroke({
										color: getdata[i].label_bgcolor,
										width: 16
									}),
									textBaseline: 'bottom', // or 'top' to display label above the icon
									//offsetY: -35 // adjust the offset value as per your requirement
								})
							});

							styleImg.getText().setOffsetY(parseFloat(-45)); //@shh



							featureval.setStyle(styleImg)
						}
						featureDataAry.push(featureval);
						trackFeaturesSource.set(getdata[i].id, featureval);

						global_fleet_layer_id.push('fleet_' + layerName + '_' + getdata[i].id);
						global_fleet_layer_features.push(featureval);
						var v1 = new tmpl.Track.smoothMovement({ map: mapObj, id: getdata[i].id, layername: layerName, feature: featureval, featureId: 'fleet_' + layerName + '_' + getdata[i].id });
						global_fleet_layer_objects.push(v1);
						var point = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
						v1.sendTrackData(point);

					}
				}

				//alert("Out side Number of features inserting : "+featureDataAry.length);
				if (featureDataAry.length > 0) {
					//console.log("Number of features inserting : ",featureDataAry.length);
					if (getHoverLabel == true) {

						var ta_tooltip = document.createElement('tooltip');
						ta_tooltip.id = 'trip-tooltip';
						ta_tooltip.className = 'ol-trip-tooltip';
						var overlay_mouseOver_label = new ol.Overlay({
							element: ta_tooltip,
							offset: [10, 0],
							positioning: 'bottom-left'
						});
						mapObj.addOverlay(overlay_mouseOver_label);
						mapObj.on('pointermove', function (evt) {

							var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
								if (layer == null) {
									if (feature.get('layer_name') == layerName) {
										return feature;
									}
								} else {
									if (layer) {
										if (layer.get('title') == layerName) {
											return feature;
										}
									}
								}

							});
							ta_tooltip.style.display = feature_mouseOver ? '' : 'none';
							if (feature_mouseOver) {
								overlay_mouseOver_label.setPosition(evt.coordinate);
								ta_tooltip.innerHTML = feature_mouseOver.getProperties().label;
							}
						});
					}
					var source = new ol.source.Vector({
						features: featureDataAry
					});

					var Layers = mapObj.getLayers();
					var length = Layers.getLength();
					var OverlayisLayerPresent = false;
					for (var i = 0; i < length; i++) {
						var layerTemp = Layers.item(i);
						if (layerTemp.get('title') === layerName) {
							OverlayisLayerPresent = true;
							layerTemp.getSource().addFeatures(featureDataAry);
						}
					}

					for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
						if (tmpl_setMap_layer_global[j].title == layerName) {
							OverlayisLayerPresent = true;

							tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
						}
					}
					if (OverlayisLayerPresent == false) {
						var overlay = new ol.layer.Vector({
							title: layerName,
							visible: true,
							source: source
						});
						tmpl_setMap_layer_global.push({
							layer: overlay,
							title: layerName,
							visibility: true,
							map: mapObj
						});
						globale_layer_names.push(layerName);
						overlay.setMap(mapObj);
						//if(layerSwitcher)
						//mapObj.addControl(new ol.control.LayerSwitcher());
						OverlayisLayerPresent = true;
					}
				}

			}
			else if (!existingLayer) {


				var newLayer = new ol.layer.Vector({
					title: layerName,
					'noncluster': true,
					source: vectorSource,
					visible: true,
					zIndex: 5
				});

				mapObj.addLayer(newLayer);

				newLayer.setMap(mapObj);
				tmpl_setMap_layer_global.push({
					layer: newLayer,
					title: layerName,
					visibility: true,
					map: mapObj
				});

				tmpl_setMap_layer_global_array.push({
					layer: newLayer,
					title: layerName,
					visibility: true,
					type: dataType,
					map: mapObj
				});

			} else {
				for (var j = 0; j < tmpl_setMap_layer_global.length; j++) {
					if (tmpl_setMap_layer_global[j].title == layerName) {
						OverlayisLayerPresent = true;
						tmpl_setMap_layer_global[j].layer.getSource().addFeatures(featureDataAry);
					}
				}
			}

			nonClusterVectorSource[layerName] = { vectorSource };


			requestAnimationFrame(() => tmpl.Overlay.createWithAnimation({ map: mapObj, layer: layerName, features: jsonobj }));
			requestAnimationFrame(() => tmpl.Overlay.badge({ map: mapObj, layer: layerName, features: jsonobj }));
			requestAnimationFrame(() => tmpl.Overlay.addCamFieldOfView({ map: mapObj, layer: layerName, features: jsonobj }));
		}


		addFeaturesBatch();


		return { status: true, message: 'Layer Created Successfully' };

	} else if (appConfigInfo.mapDimension == '3D') {
		if(appConfigInfo.isTerrainRequired !=undefined && appConfigInfo.isTerrainRequired == true){
			var mapObj = param.map;
			var jsonobj = param.features;
			var layerName = param.layer;
			var getdata = jsonobj;
			var bufferStyles = [];
			var features = [];
			var buffersVisible = [];
			var vectorLayers = [];

			var getHoverLabel = param.getHoverLabel;
			var layerSwitcher = false;
			var trackLayer = param.trackLayer;
			var image_scale = param.icon_scale;

			var viewer = param.map;
			let entities = param.features;

			var terrainProvider = mapObj.terrainProvider;

			var dataSource = new Cesium.CustomDataSource(layerName);
			dataSource.clustering.enabled = false;

			const terrainPromises = jsonobj.map(position => {
				position.type = "Non-Clustered Entity";
				position.layer_name = layerName;
				let id = position.id;
				let cartographicPosition = Cesium.Cartographic.fromDegrees(position.lon, position.lat);

				return Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographicPosition])
					.then(function(updatedPositions) {
						let updatedPosition = updatedPositions[0];
						updatedPosition.height += Number(position.height) || 0;
						position.updatedPos = updatedPosition;

						let newCustomEntity = dataSource.entities.add({
							id: position.id,
							position: Cesium.Cartesian3.fromRadians(
								updatedPosition.longitude,
								updatedPosition.latitude,
								updatedPosition.height
							),
							billboard: {
								image: position.img_url,
								scale: 1.0,
								verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
								disableDepthTestDistance: 500 // Consider removing if not needed
							},
							entProp: position
						});
						tmpl_overlay_golbal3D.set(position.id, newCustomEntity);
						console.log("tmpl_overlay_golbal3D added ", position.id);
					})
					.catch(error => {
						console.error(`Failed to sample terrain for position ${id}:`, error);
						console.log("tmpl_overlay_golbal3D added (fallback) ", position.id);
					});
			});

			viewer.dataSources.add(dataSource);

			let cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
			let ellipsoid = viewer.scene.globe.ellipsoid;
			let scene = viewer.scene;
			let camera = viewer.camera;
			scene.screenSpaceCameraController.enableZoom = true;
			scene.screenSpaceCameraController.enableTranslate = true;

			if (glbHandler == null) {
				glbHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
			}

			glbHandler.setInputAction(function(click) {
				var pickedObject = viewer.scene.pick(click.position);
				var position = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

				if (Cesium.defined(pickedObject) && pickedObject.id) {
					var entity = pickedObject.id;

					if (entity.entProp && entity.entProp.type) {
						let properties = entity.entProp;
						let layerName = properties.layer_name;
						let longitudeString = properties.lon;
						let latitudeString = properties.lat;
						let coord = [longitudeString, latitudeString];
						switch (entity.entProp.type) {
							case "Non-Clustered Entity":
								getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
								break;
							case "Clustered Entity":
								getOverlayFeatureDetails([entity.id.toString()], coord, layerName, [properties], viewer);
								break;
							case "3D Model":
								getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
								break;
							default:
								console.log("Unhandled entity type.");
						}
					}
				} else {
					console.log("No entity picked.");
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}else{
		var mapObj = param.map;
		var jsonobj = param.features;
		var layerName = param.layer;
		var getdata = jsonobj;
		var bufferStyles = [];
		var features = [];
		var buffersVisible = [];
		var vectorLayers = [];
	  
		  var getHoverLabel = param.getHoverLabel;
		  var layerSwitcher = false;
		  var trackLayer = param.trackLayer;
		  var image_scale = param.icon_scale;
	  
		var viewer = param.map;
		let entities = param.features
	  
		var dataSource = new Cesium.CustomDataSource(layerName);
	  
		dataSource.clustering.enabled = false;
	  
		jsonobj.forEach(position => {
		  position.type = "Non-Clustered Entity";
		  position.layer_name = layerName;
		  let id = position.id;
		  let newCustomEntity = dataSource.entities.add({
			id: position.id,
			position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
			billboard: {
			  image: position.img_url,
			  scale: image_scale
			},
			entProp: position,
		  });
		  tmpl_overlayCluster_golbal.push(newCustomEntity);
		  if (position.isBadgeRequired) {
			let dataEntity = dataSource.entities.getById(id);
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
		  if (position.animationRequired) {
			tmpl.Overlay.createWithAnimation ({
			  map: viewer,
			  features: [position],
			  layer: layerName
			});
		  }
		});
		tmpl.Overlay.addCamFieldOfView(param);
	  
		viewer.dataSources.add(dataSource);
	  
		let cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
		let ellipsoid = viewer.scene.globe.ellipsoid;
		let scene = viewer.scene;
		let camera = viewer.camera;
		scene.screenSpaceCameraController.enableZoom = true;
		scene.screenSpaceCameraController.enableTranslate = true;
		if(glbHandler == null){
			glbHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
		}
	  
		glbHandler.setInputAction(function (click) {
		  var pickedObject = viewer.scene.pick(click.position);
		  var position = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
	  
		  if (Cesium.defined(pickedObject) && pickedObject.id) {
			var entity = pickedObject.id;
			//console.log(entity)
	  
			if (entity.entProp && entity.entProp.type) {
			  let properties = entity.entProp;
			  let layerName = properties.layer_name;
			  let longitudeString = properties.lon;
			  let latitudeString = properties.lat;
			  let coord = [longitudeString, latitudeString];
			  // console.log(properties);
			  // console.log('entity',entity)
			  switch (entity.entProp.type) {
				case "Non-Clustered Entity":
				  getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
				  break;
				case "Clustered Entity":
				  getOverlayFeatureDetails([entity.id.toString()], coord, layerName, [properties], viewer);
				  break;
				case "3D Model":
				  getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
				  break;
				default:
				  console.log("Unhandled entity type.");
			  }
			}
		  } else {
			console.log("No entity picked.");
		  }
	  
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}
	}
}

tmpl_setMap_camLayer_global = [];
var polygonEntities = [{ id: '', polygonEntity: '' }];


const camFieldFeatures = new Map(); // Store camera fields by ID
let camFieldProcessingQueue = []; // Queue for batch processing
const camFieldBatchSize = 500; // Batch size for processing
const camFieldUpdateInterval = 500; // Update interval for batches
const globalCamFieldLayer = new Map();
const camFieldFeaturesByLayer = new Map(); // Store cam fields per layer


tmpl.Overlay.addCamFieldOfView = function (param) {
	//console.log("param~~~~~~~~~~~~~~~~~~~~~",param)
	var mapObj = param.map;
	var layerName = param.layer;
	const features = param.features;

	// if (camFieldColor === null || camFieldColor === undefined){ camFieldColor='#009688'}

	var dataToPush = {};
	if (appConfigInfo.mapDimension == "2D") {

		let isCluster = true;
		let vectorSource;
		let clusterSource

		if (!clusterVectorSource[layerName] && !nonClusterVectorSource[layerName]) {
			console.warn(`Layer "${layerName}" not found in both clusterVectorSource and nonClusterVectorSource.`);
			return;  // Exit early if the layer is missing in both sources
		}

		if (!clusterVectorSource[layerName]) {
			isCluster = false
			console.warn(`Layer "${layerName}" not found in clusterVectorSource.`);
		}


		if (isCluster) {
			({ vectorSource, clusterSource } = clusterVectorSource[layerName]);
		} else {
			({ vectorSource } = nonClusterVectorSource[layerName]);
		}

		// Ensure each layer has its own camera view field layer
		let camFieldLayer = globalCamFieldLayer.get(layerName);
		if (!camFieldLayer) {
			camFieldLayer = new ol.layer.Vector({
				source: new ol.source.Vector(),
				style: function (feature) {
					return feature.get('isVisible') ? createCamFieldStyle() : null;
				}
			});
			mapObj.addLayer(camFieldLayer);
			globalCamFieldLayer.set(layerName, camFieldLayer);
		}

		// Ensure cam field features are stored per layer
		if (!camFieldFeaturesByLayer.has(layerName)) {
			camFieldFeaturesByLayer.set(layerName, new Map());
		}

		const camFieldFeatures = camFieldFeaturesByLayer.get(layerName);

		//  Process batch of features
		try {
			features.forEach(obj => {

				if (vectorSource != undefined && vectorSource.getFeatureById(obj.id) != undefined) {
					const existingFeature = vectorSource.getFeatureById(obj.id);
					if (existingFeature) {
						existingFeature.set('isViewVisualRequired', obj.isViewVisualRequired);
						existingFeature.set('viewAngle', obj.viewAngle);
						existingFeature.set('viewDistance', obj.viewDistance);

						if (obj.isViewVisualRequired) {
							enableCameraViewField(obj.id, obj.viewAngle, obj.viewDistance, vectorSource, layerName);
						} else {
							disableCameraViewField(obj.id, layerName);
						}
					}
				}
			});
		} catch (err) {

		}

		//  Hide cam fields when clustered
		if (isCluster) {
			clusterSource.on('change', debounce(() => updateCamFieldVisibility(layerName, clusterSource), 500));
			requestAnimationFrame(() => updateCamFieldVisibility(layerName, clusterSource));
		}
	}
	else {
		//polygonEntities=[];
		for (let index = 0; index < param.features.length; index++) {
			if (param.features[index].isViewVisualRequired) {
				console.log("param.features[index]~~~~~~~~~~~~~", param.features[index])
				const centerLat = param.features[index].lat;
				const centerLon = param.features[index].lon;
				const innerRadius = 0; // in kilometers
				const outerRadius = param.features[index].viewDistance / 10000; // in kilometers
				// const startAngle = Math.PI / 6; // 30 degrees in radians
				// const endAngle = Math.PI * 5 / 6; // 150 degrees in radians
				let a = param.features[index].viewAngle - 50;
				let b = param.features[index].viewAngle + 50;
				const startAngle = (Math.PI / 180) * a; // 30 degrees in radians
				const endAngle = (Math.PI / 180) * b; // 150 degrees in radians
				//console.log("startAngle,endAngle~~~~~~~~~~~~~~~",startAngle,endAngle)
				var wktPolygon = generateAnnularSectorWKT(centerLat, centerLon, innerRadius, outerRadius, startAngle, endAngle); // Your WKT polygon here
				var wktCoordinates = wktPolygon.match(/\d+\.\d+\s\d+\.\d+/g).map(function (coord) {
					return coord.split(' ').map(parseFloat);
				});

				// Transform WKT coordinates to Cesium-compatible format (Cartesian3)
				var cesiumCoordinates = wktCoordinates.map(function (coord) {
					return Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
				});

				// Add the polygon to the Cesium map
				var yellowMaterialWithAlpha = Cesium.Color.BLUE.withAlpha(0.5);
				//console.log("layer",param.features[index].layer_name)
				var camId = param.features[index].id + "CF";
				var polygonEntity = mapObj.entities.add({
					id: param.features[index].id + "CF",
					// name: "WKT Polygon",
					name: param.features[index].layer_name,
					description: "WKT Polygon",
					polygon: {
						hierarchy: new Cesium.PolygonHierarchy(cesiumCoordinates),
						extrudedHeight: 0.5, // Extrusion height in meters (adjust as needed)
						material: new Cesium.Color.fromCssColorString('rgba(0, 191, 255)').withAlpha(0.4),
						outline: false,
						outlineColor: new Cesium.Color.fromCssColorString('rgba(0, 191, 255)').withAlpha(0.4),
					},
				});
				// polygonEntities.push({id:param.features[index].title,polygonEntity:polygonEntity});
				polygonEntities.push({ id: camId, polygonEntity: polygonEntity });

			}

		}
	}
}


function updateCamFieldVisibility(layerName, clusterSource) {
	const clusteredFeatures = new Set();

	// Find clustered features
	clusterSource.getFeatures().forEach(cluster => {
		const features = cluster.get('features');
		if (features.length > 1) {
			features.forEach(fea => clusteredFeatures.add(fea.getId()));
		}
	});

	let camFieldLayer = globalCamFieldLayer.get(layerName);
	if (!camFieldLayer) return;

	const camFieldFeatures = camFieldFeaturesByLayer.get(layerName) || new Map();

	camFieldFeatures.forEach((camFeature, id) => {
		if (clusteredFeatures.has(id)) {
			camFeature.set('isVisible', false);
		} else {
			camFeature.set('isVisible', true);
		}
	});

	camFieldLayer.getSource().changed(); // Refresh the cam field layer
}

function enableCameraViewField(id, viewAngle, viewDistance, vectorSource, layerName) {
	const existingFeature = vectorSource.getFeatureById(id);
	if (!existingFeature) {
		console.warn(`Feature with ID ${id} not found.`);
		return;
	}

	let camFieldLayer = globalCamFieldLayer.get(layerName);
	if (!camFieldLayer) {
		console.warn(`Cam field layer for "${layerName}" not found.`);
		return;
	}

	let camFieldFeatures = camFieldFeaturesByLayer.get(layerName);
	if (!camFieldFeatures) {
		camFieldFeatures = new Map();
		camFieldFeaturesByLayer.set(layerName, camFieldFeatures);
	}

	if (camFieldFeatures.has(id)) {
		const camFeature = camFieldFeatures.get(id);
		camFeature.set('viewAngle', viewAngle);
		camFeature.set('viewDistance', viewDistance);
		return;
	}

	const properties = existingFeature.getProperties();
	const centerLat = parseFloat(properties.lat);
	const centerLon = parseFloat(properties.lon);
	const outerRadius = viewDistance / 10000;
	const startAngle = (Math.PI / 180) * (viewAngle - 50);
	const endAngle = (Math.PI / 180) * (viewAngle + 50);

	const camFieldGeom = generateAnnularSector(centerLat, centerLon, 0, outerRadius, startAngle, endAngle);
	const camFeature = new ol.Feature({ geometry: camFieldGeom });

	camFeature.setId(`cam-${id}`);
	camFeature.set('isVisible', true);
	camFieldFeatures.set(id, camFeature);
	camFieldLayer.getSource().addFeature(camFeature);
}


function disableCameraViewField(id, layerName) {
	const camFieldFeatures = camFieldFeaturesByLayer.get(layerName);
	if (!camFieldFeatures) return;

	const camFeature = camFieldFeatures.get(id);
	if (camFeature) {
		let camFieldLayer = globalCamFieldLayer.get(layerName);
		if (camFieldLayer) {
			camFieldLayer.getSource().removeFeature(camFeature);
		}
		camFieldFeatures.delete(id);
	}
}





//  Function to create camera view field style

function createCamFieldStyle() {
	return new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 191, 255, 0.5)',
			width: 2,
			lineDash: [10, 5]
		}),
		fill: new ol.style.Fill({
			color: 'rgba(0, 191, 255, 0.2)'
		})
	});
}

//  Function to generate annular sector for camera view
function generateAnnularSector(centerLat, centerLon, innerRadius, outerRadius, startAngle, endAngle) {
	const coordinates = [];
	const numPoints = 30; // Increase for smoother arc
	const step = (endAngle - startAngle) / numPoints;

	coordinates.push([centerLon, centerLat]); // Center point

	for (let i = 0; i <= numPoints; i++) {
		let angle = startAngle + i * step;
		let x = centerLon + (outerRadius * Math.cos(angle));
		let y = centerLat + (outerRadius * Math.sin(angle));
		coordinates.push([x, y]);
	}

	coordinates.push([centerLon, centerLat]);
	 // Close polygon
	if(appConfigInfo.mapData === 'google' || appConfigInfo.mapData === 'hereMaps' || appConfigInfo.mapData === 'trinity' || appConfigInfo.mapData === 'mmi' || appConfigInfo.mapData === 'sgl'){
		return new ol.geom.Polygon([coordinates.map(coord => ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'))]);
	} else{
		// For non-web mercator maps, no transformation needed
		return new ol.geom.Polygon([coordinates]);
	}
}

//  Helper: Debounce function
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

function generateAnnularSectorWKT(centerLat, centerLon, innerRadius, outerRadius, startAngle, endAngle) {
	const numPoints = 10; // Number of points to approximate the sector
	const angleStep = (endAngle - startAngle) / numPoints; // Angular distance between each point
	let wkt = "POLYGON((";

	// Generate points along the outer arc
	for (let i = 0; i <= numPoints; i++) {
		// Calculate the angle for the current point
		const angle = startAngle + (angleStep * i);

		// Calculate the coordinates of the current point on the outer arc
		const outerPointLat = centerLat + (outerRadius * Math.sin(angle));
		const outerPointLon = centerLon + (outerRadius * Math.cos(angle));

		// Append the coordinates to the WKT string
		wkt += `${outerPointLon} ${outerPointLat},`;
	}

	// Generate points along the inner arc (in reverse order)
	for (let i = numPoints; i >= 0; i--) {
		// Calculate the angle for the current point
		const angle = startAngle + (angleStep * i);

		// Calculate the coordinates of the current point on the inner arc
		const innerPointLat = centerLat + (innerRadius * Math.sin(angle));
		const innerPointLon = centerLon + (innerRadius * Math.cos(angle));

		// Append the coordinates to the WKT string
		wkt += `${innerPointLon} ${innerPointLat},`;
	}

	// Append the first point (the starting point on the outer arc) to close the polygon
	wkt += `${centerLon + (outerRadius * Math.cos(startAngle))} ${centerLat + (outerRadius * Math.sin(startAngle))}))`;

	return wkt;
}

// Helper function to calculate a point at a given distance and angle from a reference point
function calculateTriangleVertex(referencePoint, angle, distance) {
	var lon = referencePoint[0] + (distance * Math.cos(angle * Math.PI / 180));
	var lat = referencePoint[1] + (distance * Math.sin(angle * Math.PI / 180));
	return [lon, lat];
}

tmpl.Overlay.hideCamField = function (param) {
	mapObj = param.map;
	id = param.id;
	flag = param.visible;

	if (appConfigInfo.mapDimension == "2D") {
		if (!flag) {
			for (var i = tmpl_setMap_layer_global.length - 1; i >= 0; i--) {

				if (tmpl_setMap_layer_global[i].title == id) {
					tmpl_setMap_layer_global[i].layer.setMap(null);
					tmpl_setMap_layer_global[i].visibility = false;
				}
			}
		} else {
			for (var i = tmpl_setMap_layer_global.length - 1; i >= 0; i--) {

				if (tmpl_setMap_layer_global[i].title == id) {
					try {
						tmpl_setMap_layer_global[i].layer.setMap(mapObj);
					} catch (e) { }
					try {
						tmpl_setMap_layer_global[i].visibility = true;
					} catch (e) { }
				}
			}
		}
	} else {
		var entities = mapObj.entities._entities._array
		for (let i = 0; i < entities.length; i++) {
			if (entities[i].id == id + "CF") {
				entities[i].show = flag;
			}
		}
	}
}

// **** This function displays the given geometry as layer with default styles **** //
var borderBlinkArray = [];
tmpl.Overlay.addGeometry = function (param) {
	var mapObj = param.map;
	var lyrName = param.layer;
	var property = param.properties;
	var getHoverLabel = param.getHoverLabel;
	var geometryVal = param.geometry;
	var format = new ol.format.WKT();
	var borderCol = param.borderColor != undefined ? param.borderColor : '#1b465a';
	var solidCol = param.fillColor != undefined ? param.fillColor : 'rgba(255, 255, 255, 0)';
	var blinkType = param.blinkType != undefined ? param.blinkType : 'full';
	var isBlink = param.isBlink != undefined ? param.isBlink : false;
	var blinkDuration = param.blinkDuration != undefined ? param.blinkDuration : 5000;
	var blinkInterval = param.blinkInterval != undefined ? param.blinkInterval : 500;

	var feature;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}


		if (geometryVal === null || geometryVal === undefined || geometryVal === '' || geometryVal === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid geometryVal' };
		}


		if (property === null || property === undefined || property === '' || property === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid property' };
		}

		if (lyrName === null || lyrName === undefined || lyrName === '' || lyrName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lyrName' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' ||
		appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == 'sgl') {
		console.log("we are in addGerometryWithColor for mmi")
		feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
	}
	else {
		var feature = format.readFeature(geometryVal, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:4326'
		});
	}

	const geom = feature.getGeometry();
	if (geom.getType() === 'GeometryCollection') {
		const geometries = geom.getGeometries();
		geometries.forEach(g => {
			if (g.getType() === 'Polygon' || g.getType() === 'MultiPolygon') {

				// Extract coordinates and convert to lon/lat
				const coords = g.getCoordinates()[0]; // Only outer ring
				const lonLatCoords = coords.map(coord => ol.proj.toLonLat(coord));

				globalPolygons.push(lonLatCoords);
				console.log('Single Polygon:', geom);
			}
		});
	}
	else if (geom.getType() === 'Polygon' || geom.getType() === 'MultiPolygon') {
		const coords = geom.getCoordinates()[0];
		const lonlat = coords.map(coord => ol.proj.toLonLat(coord));
		globalPolygons.push(lonlat);
		console.log('Single Polygon:', lonlat);
	}

	if (getHoverLabel == true) {
		feature.setStyle(new ol.style.Style({
			fill: new ol.style.Fill({
				color: solidCol
			}),
			stroke: new ol.style.Stroke({
				color: borderCol,
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: borderCol
				})
			})
		}));
	} else {
		feature.setStyle(new ol.style.Style({
			fill: new ol.style.Fill({
				color: solidCol
			}),
			stroke: new ol.style.Stroke({
				color: borderCol,
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({
					color: borderCol
				})
			}),
			text: new ol.style.Text({
				font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
				textAlign: 'center',
				/*textBaseline: 'bottom',
				offsetX : parseInt(0, 10),
				offsetY : parseInt(0, 10),*/
				text: property.label,
				fill: new ol.style.Fill({
					color: property.label_color,
					width: 20
				}),
				stroke: new ol.style.Stroke({
					color: property.label_bgcolor,
					width: 6
				})
			})
		}));
	}
	feature.setProperties(property);
	feature.set('layer_name', lyrName);
	var source = new ol.source.Vector({
		features: [feature]
	});


	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	var isLayerPresent11 = false;
	var existing;
	for (i = 0; i < length; i++) {
		var existingLayer = Layers.item(i);
		if (existingLayer) {
			if (existingLayer.get('title') === lyrName) {
				existing = existingLayer;
				existingLayer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == property.id) {
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
				tmpl_setMap_layer_global[i].layer.getSource().getFeatures().forEach(function (fea) {
					if (fea.getProperties()['id'] == property.id) {
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
			source: source
		});
		tmpl_setMap_layer_global.push({
			layer: newLayer,
			title: lyrName,
			visibility: true,
			map: mapObj
		});
		isLayerPresent11 == true;
		//mapObj.addLayer(newLayer);
		newLayer.setMap(mapObj);
		//		mapObj.addControl(new ol.control.LayerSwitcher());
	}
	if (isBlink) {
		const baseStyle = new ol.style.Style({
			fill: new ol.style.Fill({ color: 'rgba(255, 255, 255,0)' }),
			stroke: new ol.style.Stroke({ color: '#1b465a', width: 2 }),
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({ color: '#1b465a' }),
			}),
		});

		const fullBlinkStyle = new ol.style.Style({
			fill: new ol.style.Fill({ color: solidCol }), // Blinking fill color
			stroke: new ol.style.Stroke({ color: solidCol, width: 2 }), // Blinking border color
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({ color: solidCol }), // Blinking circle fill
			}),
		});

		const borderBlinkStyle = new ol.style.Style({
			fill: new ol.style.Fill({ color: 'rgba(255, 255, 255,0)' }), // Keep fill as is
			stroke: new ol.style.Stroke({ color: borderCol, width: 3 }), // Blinking border color only
			image: new ol.style.Circle({
				radius: 7,
				fill: new ol.style.Fill({ color: borderCol }), // Keep circle fill color the same
			}),
		});

		const blinkStyle = blinkType === 'full' ? fullBlinkStyle : borderBlinkStyle;

		const blinkIntervalId = setInterval(() => {
			feature.setStyle(isBlink ? blinkStyle : baseStyle);
			isBlink = !isBlink;
		}, blinkInterval);

		var intervalObj = { "id": property.id, "intervalId": blinkIntervalId, "feature": feature, "layerName": lyrName, "baseStyle": baseStyle };
		borderBlinkArray.push(intervalObj)
		// Stop blinking after specified duration
		setTimeout(() => {
			clearInterval(blinkIntervalId);
			feature.setStyle(baseStyle); // Set back to base style
		}, blinkDuration);
	}

	return { status: true, message: 'tmpl.Overlay.addGeometry executed successfully' }

}

tmpl.Overlay.clearBlinkBoundry = function (param) {
	var map = param.map;
	var layerName = param.layerName;
	var layerId = param.id;

	// borderBlinkArray,forEach((obj)=>{
	// 	if(obj.layerName == layerName && obj.id == layerId){
	// 		clearInterval(obj.intervalId);
	// 		var feature = obj.feature;
	// 		var baseStyle = obj.baseStyle;
	// 		feature.setStyle(baseStyle)
	// 	}
	// })

	for (let i = 0; i < borderBlinkArray.length; i++) {
		let obj = borderBlinkArray[i];
		if (obj.layerName == layerName && obj.id == layerId) {
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
}

// **** This function displays the given geometry as layer in user specified colors **** //
var addGoemetryFlag = false;

var tmpl_blinkIntervals = {};
tmpl.Overlay.addGeometryWithColor = function (param) {
	var mapObj = param.map;
	var geometryVal = param.geometry;
	var property = param.properties;
	var colorval = param.color;
	var lyrName = param.layer;
	var borderColor = param.borderColor;
	var borderWidth = param.borderWidth;
	var label = param.label;
	var borderAnimate = param.borderAnimate;
	var getHoverLabel = param.getHoverLabel;
	var dottedLine = param.dottedLine;
	var layerName=param.layer;
	var format = new ol.format.WKT();
	var blink = param.blink || false;
	var blinkIntervaltime = param.blinkInterval || 1000;
	var color;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}


		if (geometryVal === null || geometryVal === undefined || geometryVal === '' || geometryVal === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid geometryVal' };
		}


		if (property === null || property === undefined || property === '' || property === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid property value' };
		}

		if (lyrName === null || lyrName === undefined || lyrName === '' || lyrName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid lyrName value' };
		}


		if (colorval === null || colorval === undefined || colorval === '' || colorval === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid colorval' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}


	if(appConfigInfo.mapDimension == "2D"){
		
		if (borderWidth == undefined) {
			borderWidth = 1;
		}
		if (dottedLine == undefined) {
			dottedLine = [0, 0];
		}
		if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps' ||
			appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi'||appConfigInfo.mapData == 'sgl') {
		
			var feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});

			var strokeColor
			if (borderColor == undefined)
				strokeColor = colorval;
			else
				strokeColor = borderColor;


			feature.set('label', label);
			feature.set('color', strokeColor);

			var baseStyle = new ol.style.Style({
				fill: new ol.style.Fill({ color: colorval, opacity: 0.2 }),
				stroke: new ol.style.Stroke({ color: strokeColor, width: borderWidth, lineDash: dottedLine }),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({ color: colorval, opacity: 0.2 })
				})
			});

			feature.set('originalStyle', baseStyle);
			feature.setStyle(baseStyle);

			if (blink) {
				let visible = true;
				let blinkInterval = setInterval(() => {
					visible = !visible;
					feature.setStyle(visible ? feature.get('originalStyle') : null);
				}, blinkIntervaltime);

				// store in global registry
				if (!tmpl_blinkIntervals[layerName]) tmpl_blinkIntervals[layerName] = [];
				tmpl_blinkIntervals[layerName].push(blinkInterval);

				feature.set('blinkInterval', blinkInterval); // optional
			}
		}
		else {

			var feature = format.readFeature(geometryVal, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:4326'
			});
			feature.set('label', label);
			feature.set('color', strokeColor);
			var colours = {
				"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
				"beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887"
			};

			if (typeof colours[colorval.toLowerCase()] != 'undefined')
				var colorfinal = colours[colorval.toLowerCase()];
			var hexColor = colorfinal;
			if (hexColor) {
				color = ol.color.asArray(hexColor);
				color = color.slice();
				color[3] = 0.5;
			}
			else {
				color = colorval;
			}

			var strokeColor
			if (borderColor == undefined)
				strokeColor = colorval;
			else
				strokeColor = borderColor;
			feature.setStyle(new ol.style.Style({
				fill: new ol.style.Fill({
					color: colorval
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: borderWidth,
					lineDash: dottedLine
				}),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: colorval
					})
				})
			}));
		}
		if (property) {
			feature.setProperties(property);
		}
		//feature.set('title',lyrName);
		feature.set('layer_name', lyrName);
		//console.log(feature);
		var source = new ol.source.Vector({
			features: [feature]
		});
		var lyrs = mapObj.getLayers();
		var length = lyrs.getLength();
		var isLayerPresent = false;
		var existing;
		for (i = 0; i < length; i++) {
			var l1 = lyrs.item(i);
			if (l1) {
				lyrtest = l1;
				if (l1.get('title') === lyrName) {
					existing = l1;
					isLayerPresent = true;
					//l1.getSource().clear();
					l1.getSource().addFeature(feature);
				}
			}
		}
		if (existing == undefined) {
			for (var i = 0; i < tmpl_setMap_layer_global.length; i++) {
				if (tmpl_setMap_layer_global[i].title == lyrName) {
					isLayerPresent = true;
					//tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global[i].layer.getSource().addFeature(feature);
				}
			}

		}
		var overlay = new ol.layer.Vector({
			title: layerName,
			visible: true,
			source: source
		});

		tmpl_setMap_layer_global.push({
			layer: overlay,
			title: layerName,
			visibility: true,
			map: mapObj
		});

		tmpl_setMap_layer_global_array.push({
			layer: overlay,
			title: layerName,
			visibility: true,
			map: mapObj
		});




		overlay.setMap(mapObj);

		var gblanimationfeature = '', gblanimationfeaturecolor = '';

		if (!isLayerPresent) {
			var layerVal = new ol.layer.Vector({
				title: lyrName,
				visible: true,
				source: source
			});
			//console.log("Polygon layerVal:", layerVal);
			//alert();


			//layerVal.setZIndex(200);
			// tmpl_setMap_layer_global.push({
			// 	layer: layerVal,
			// 	title: lyrName,
			// 	visibility: true,
			// 	map: mapObj
			// });
			layerVal.setMap(mapObj);
		}
			console.log(label);
		if (label != undefined) {

			if (getHoverLabel == true) {

				var ta_tooltip = document.createElement('tooltip');
				ta_tooltip.id = 'trip-tooltip';
				ta_tooltip.className = 'ol-trip-tooltip';
				var overlay_mouseOver_label = new ol.Overlay({
					element: ta_tooltip,
					offset: [10, 0],
					positioning: 'bottom-left'
				});

				mapObj.addOverlay(overlay_mouseOver_label);

				mapObj.on('pointermove', function (evt) {
					var layera
					var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
						if (feature.get('layer_name') == lyrName) {

							return feature;
						}
					});

					ta_tooltip.style.display = feature_mouseOver ? '' : 'none';

					if (feature_mouseOver) {
						overlay_mouseOver_label.setPosition(evt.coordinate);
						ta_tooltip.innerHTML = feature_mouseOver.get('label');
					}
				});

			}
		}

	}else if(appConfigInfo.mapDimension == "3D"){
		// --- 3D Cesium logic ---
		try {
			const geometryWKT = param.geometry;
			const borderColor = param.borderColor || "#000000ff";
			const fillColor = param.fillColor || "rgba(255,255,255,0.3)";
			const layerName = param.layer || "default_layer";
			const properties = param.properties || {};
			const labelText = properties.label || "";
			const labelColor = properties.label_color || "#ffffff";
			const labelBgColor = properties.label_bgcolor || "#000000";
			const width = param.borderWidth || 3;
			if (!mapObj || !geometryWKT) {
				console.error("Invalid input: missing map or geometry");
				return;
			}

			// --- Parse WKT manually ---
			let type = geometryWKT.split("(")[0].trim().toUpperCase();
			let coordsText = geometryWKT.substring(geometryWKT.indexOf("("));
			coordsText = coordsText.replace(/[()]/g, "").trim();
			let coordinates = coordsText.split(",").map(c => c.trim().split(" ").map(Number));

			// Convert coordinate pairs to Cesium positions
			const positions = coordinates.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));

			let entityOptions = {};

			// --- Handle geometry types ---
			if (type === "POINT") {
				entityOptions = {
				position: positions[0],
				point: {
					pixelSize: 10,
					color: Cesium.Color.fromCssColorString(borderColor),
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				},
				};
			} else if (type === "LINESTRING") {
				entityOptions = {
				polyline: {
					positions: positions,
					width: width,
					material: Cesium.Color.fromCssColorString(borderColor),
					clampToGround: true,
				},
				};
			} else if (type === "POLYGON") {
				entityOptions = {
				polygon: {
					hierarchy: new Cesium.PolygonHierarchy(positions),
					material: Cesium.Color.fromCssColorString(fillColor).withAlpha(0.5),
					outline: true,
					outlineColor: Cesium.Color.fromCssColorString(borderColor),
				},
				};
			} else {
				console.error("Unsupported geometry type:", type);
				return;
			}

			// --- Add base geometry ---
			const entity = mapObj.entities.add({
				name: layerName,
				...entityOptions,
				properties: properties,
			});

			// --- Add label if present ---
			if (labelText) {
				let labelPosition;

				if (type === "POINT") {
				labelPosition = positions[0];
				} else if (type === "LINESTRING") {
				const midIndex = Math.floor(positions.length / 2);
				labelPosition = positions[midIndex];
				} else if (type === "POLYGON") {
				const avg = coordinates.reduce(
					(acc, [lon, lat]) => [acc[0] + lon, acc[1] + lat],
					[0, 0]
				);
				const lon = avg[0] / coordinates.length;
				const lat = avg[1] / coordinates.length;
				labelPosition = Cesium.Cartesian3.fromDegrees(lon, lat);
				}

				mapObj.entities.add({
				name: layerName + "_label",
				position: labelPosition,
				label: {
					text: labelText,
					font: "bold 14px Arial",
					fillColor: Cesium.Color.fromCssColorString(labelColor),
					outlineColor: Cesium.Color.fromCssColorString(labelBgColor),
					outlineWidth: 4,
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
					pixelOffset: new Cesium.Cartesian2(0, -12),
					disableDepthTestDistance: Number.POSITIVE_INFINITY, // keeps label visible
				},
				});
			}

			return entity;
		} catch (error) {
			console.log('Error in 3D: ' + error);
		}
	}
	return { status: true, message: 'Overlay.addGeometryWithColor executed successfully' }
}

// tmpl.Overlay.addGeometryWithColor = function (param) {
// 	const {
// 		map: mapObj, geometry: geometryVal, properties: property,
// 		color: colorval, layer: lyrName, borderColor,
// 		borderWidth = 1, label, getHoverLabel,
// 		dottedLine = [0, 0]
// 	} = param;

// 	const responseError = (msg) => ({
// 		status: false,
// 		businesserrorcode: 'TD_GISSDK_0x001',
// 		developererrorcode: 'TD_GISSDK_0x001',
// 		message: msg
// 	});

// 	// Validate required params
// 	if (!mapObj) return responseError('Not a valid map object');
// 	if (!geometryVal) return responseError('Not a valid geometryVal');
// 	if (!property) return responseError('Not a valid property value');
// 	if (!lyrName) return responseError('Not a valid layer name');
// 	if (!colorval) return responseError('Not a valid color value');

// 	if (appConfigInfo.mapDimension == '2D' && appConfigInfo.mapLib == 'ol7') {
// 		// --- OpenLayers 2D logic ---
// 		try {
// 			var format = new ol.format.WKT();
// 			var feature = format.readFeature(geometryVal, {
// 				dataProjection: 'EPSG:4326',
// 				featureProjection: (appConfigInfo.mapData === 'google' ||
// 					appConfigInfo.mapData === 'hereMaps' ||
// 					appConfigInfo.mapData === 'trinity' ||
// 					appConfigInfo.mapData === 'mmi' ||
// 					appConfigInfo.mapData === 'sgl')
// 					? 'EPSG:3857'
// 					: 'EPSG:4326'
// 			});

// 			var strokeColor = borderColor || colorval;
// 			feature.set('label', label);
// 			feature.set('color', strokeColor);
// 			feature.setStyle(new ol.style.Style({
// 				fill: new ol.style.Fill({
// 					color: colorval,
// 					opacity: 0.2
// 				}),
// 				stroke: new ol.style.Stroke({
// 					color: strokeColor,
// 					width: borderWidth,
// 					lineDash: dottedLine
// 				}),
// 				image: new ol.style.Circle({
// 					radius: 1,
// 					fill: new ol.style.Fill({
// 						color: colorval,
// 						opacity: 0.2
// 					})
// 				})
// 			}));

// 			if (property) feature.setProperties(property);
// 			feature.set('layer_name', lyrName);

// 			var source = new ol.source.Vector({ features: [feature] });
// 			var overlay = new ol.layer.Vector({
// 				title: lyrName,
// 				visible: true,
// 				source: source
// 			});

// 			overlay.setMap?.(mapObj);

// 			const extent = source.getExtent();
// 			mapObj.getView().fit(extent, mapObj.getSize());

// 			tmpl_setMap_layer_global.push({
// 				layer: overlay,
// 				title: lyrName,
// 				visibility: true,
// 				map: mapObj
// 			});

// 			tmpl_setMap_layer_global_array.push({
// 				layer: overlay,
// 				title: lyrName,
// 				visibility: true,
// 				map: mapObj
// 			});

// 			if (label && getHoverLabel) {
// 				var tooltip = document.createElement('div');
// 				tooltip.className = 'ol-tooltip';
// 				var olOverlay = new ol.Overlay({
// 					element: tooltip,
// 					offset: [10, 0],
// 					positioning: 'bottom-left'
// 				});
// 				mapObj.addOverlay(olOverlay);

// 				mapObj.on('pointermove', function (evt) {
// 					var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
// 						return feature.get('layer_name') === lyrName ? feature : null;
// 					});
// 					tooltip.style.display = feature_mouseOver ? '' : 'none';
// 					if (feature_mouseOver) {
// 						olOverlay.setPosition(evt.coordinate);
// 						tooltip.innerHTML = feature_mouseOver.get('label');
// 					}
// 				});
// 			}

// 			return { status: true, message: '2D geometry added successfully' };

// 		} catch (error) {
// 			return { status: false, message: 'Error in 2D: ' + error.message };
// 		}

// 	} else {
// 		// --- 3D Cesium logic ---
// 		try {
// 			const wkt = geometryVal.trim().toUpperCase();
// 			let entity;

// 			if (wkt.startsWith('POLYGON')) {
// 				const coords = geometryVal
// 					.replace(/POLYGON\s*\(\(/i, '')
// 					.replace(/\)\)$/, '')
// 					.split(',')
// 					.map(s => s.trim().split(' ').map(Number));


// 				// const positions = coords.map(c => Cesium.Cartesian3.fromDegrees(c[0], c[1]));
// 				const height = 0;  // Set height here
// 				const positions = coords.map(c => Cesium.Cartesian3.fromDegrees(c[0], c[1], height));
// 				entity = mapObj.entities.add({
// 					name: lyrName,
// 					polygon: {
// 						hierarchy: new Cesium.PolygonHierarchy(positions),
// 						material: Cesium.Color.fromCssColorString(colorval).withAlpha(0.5),
// 						outline: true,
// 						outlineColor: Cesium.Color.fromCssColorString(borderColor || colorval),
// 						outlineWidth: borderWidth,
// 						perPositionHeight: true
// 					},
// 					properties: property
// 				});
// 				// Collect all entities matching your layer name
// 				mapObj.zoomTo(entity);

// 			}
// 			else if (wkt.startsWith('LINESTRING')) {
// 				const coords = geometryVal
// 					.replace(/LINESTRING\s*\(/i, '')
// 					.replace(/\)$/, '')
// 					.split(',')
// 					.map(s => s.trim().split(' ').map(Number));

// 				const height = 0;  // Set height here
// 				const positions = coords.map(c => Cesium.Cartesian3.fromDegrees(c[0], c[1], height));

// 				entity = mapObj.entities.add({
// 					name: lyrName,
// 					polyline: {
// 						positions,
// 						material: Cesium.Color.fromCssColorString(borderColor || colorval),
// 						width: borderWidth
// 					},
// 					properties: property
// 				});
// 				// Collect all entities matching your layer name
// 				mapObj.zoomTo(entity);

// 			}
// 			else if (wkt.startsWith('POINT')) {
// 				const [lng, lat] = geometryVal
// 					.replace(/POINT\s*\(/i, '')
// 					.replace(/\)$/, '')
// 					.trim().split(' ')
// 					.map(Number);

// 				entity = mapObj.entities.add({
// 					name: lyrName,
// 					position: Cesium.Cartesian3.fromDegrees(lng, lat),
// 					point: {
// 						pixelSize: 10,
// 						color: Cesium.Color.fromCssColorString(colorval)
// 					},
// 					properties: property
// 				});
// 				// Collect all entities matching your layer name
// 				mapObj.zoomTo(entity);

// 			}
// 			else {
// 				throw new Error('Unsupported WKT type for 3D');
// 			}

// 			if (label && getHoverLabel) {
// 				mapObj.entities.add({
// 					position: entity.position || Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.positions).center,
// 					label: {
// 						text: label,
// 						font: '14px sans-serif',
// 						fillColor: Cesium.Color.WHITE,
// 						outlineColor: Cesium.Color.BLACK,
// 						outlineWidth: 2,
// 						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// 						pixelOffset: new Cesium.Cartesian2(0, -20)
// 					}
// 				});
// 			}

// 			return { status: true, message: '3D geometry added successfully' };

// 		} catch (error) {
// 			return { status: false, message: 'Error in 3D: ' + error.message };
// 		}
// 	}
// };


// var tmpl_blinkIntervals = {};
tmpl.Overlay.addMultipleGeometryWithColor = function (param) {
	var mapObj = param.map;
	var geometries = param.geometry; // Expecting an array of geometries
	var propertiesArray = param.properties || []; // Array of properties
	var colorval = param.color;
	var lyrName = param.layer;
	var borderColor = param.borderColor;
	var borderWidth = param.borderWidth || 1; // Default border width
	var labels = param.label || []; // Array of labels
	var getHoverLabel = param.getHoverLabel || false;
	var dottedLine = param.dottedLine || [0, 0]; // Default to solid line
	var layerName = param.layer;
	var blink = param.blink || false;
	var blinkIntervaltime = param.blinkInterval || 1000;
	var format = new ol.format.WKT();

	try {
		var features = []; // To store all features

		// Iterate through the geometries and create features
		geometries.forEach((geometry, index) => {
			var feature = format.readFeature(geometry, {
				dataProjection: 'EPSG:4326',
				featureProjection: (appConfigInfo.mapData === 'google' || appConfigInfo.mapData === 'hereMaps' ||
					appConfigInfo.mapData === 'trinity' || appConfigInfo.mapData === 'mmi' || appConfigInfo.mapData === 'sgl') ?
					'EPSG:3857' : 'EPSG:4326'
			});

			var strokeColor = borderColor || colorval;
			var labelText = labels[index] || `Feature ${index + 1}`;

			var baseStyle = new ol.style.Style({
				fill: new ol.style.Fill({
					color: colorval,
					opacity: 0.2
				}),
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: borderWidth,
					lineDash: dottedLine
				}),
				image: new ol.style.Circle({
					radius: 1,
					fill: new ol.style.Fill({
						color: colorval,
						opacity: 0.2
					})
				}),
				text: new ol.style.Text({
					// text: labelText,
					font: 'bold 14px Arial',
					textAlign: 'center',
					textBaseline: 'middle',
					fill: new ol.style.Fill({
						color: '#000'
					}),
					offsetX: 0,
					offsetY: 0,
					placement: 'point'
				})
			});

			feature.set('label', labelText);
			feature.set('color', strokeColor);
			feature.set('originalStyle', baseStyle);
            feature.setStyle(baseStyle);

			// Assign properties if available
			if (propertiesArray[index]) {
				feature.setProperties(propertiesArray[index]);
			}

			feature.set('layer_name', lyrName);


			if (blink) {
				let visible = true;
				feature.set('originalStyle', baseStyle);

				let blinkInterval = setInterval(() => {
					visible = !visible;
					// toggle between original style and null
					feature.setStyle(visible ? feature.get('originalStyle') : null);
				}, blinkIntervaltime);

				// store interval in global registry
				if (!tmpl_blinkIntervals[layerName]) tmpl_blinkIntervals[layerName] = [];
				tmpl_blinkIntervals[layerName].push(blinkInterval);

				// optional: keep in feature for debugging
				feature.set('blinkInterval', blinkInterval);
				console.log("intervalId1", blinkInterval);
			}

			features.push(feature); // Add feature to the collection
		});

		// Check if layer already exists
		var existingLayer = mapObj.getLayers().getArray().find(layer => layer.get('title') === layerName);

		if (existingLayer) {
			// Add features to the existing layer
			existingLayer.getSource().addFeatures(features);
		} else {
			// Create a new layer and add features
			var source = new ol.source.Vector({
				features: features
			});
			var overlay = new ol.layer.Vector({
				title: layerName,
				visible: true,
				source: source
			});

			// Add the layer to the map
			overlay.setMap(mapObj);

			// Optionally maintain global layer arrays
			tmpl_setMap_layer_global.push({
				layer: overlay,
				title: layerName,
				visibility: true,
				map: mapObj
			});
			tmpl_setMap_layer_global_array.push({
				layer: overlay,
				title: layerName,
				visibility: true,
				map: mapObj
			});
		}

		// Add hover label functionality
		if (getHoverLabel) {
			addHoverLabel(mapObj, layerName);
		}

		return { status: true, message: 'Overlay.addGeometryWithColor executed successfully for multiple geometries' };
	} catch (error) {
		console.error('Error in addGeometryWithColor:', error);
		return { status: false, message: error.message };
	}
};

tmpl.Overlay.stopBlink = function (mapObj, layerName) {
    try {
        // 1. Stop all intervals stored in the global registry
        if (tmpl_blinkIntervals[layerName]) {
            tmpl_blinkIntervals[layerName].forEach(intervalId => clearInterval(intervalId));
            delete tmpl_blinkIntervals[layerName];
        }

        // 2. Restore original styles for all features in the layer (if it still exists)
        let existingLayer = mapObj.getLayers().getArray().find(layer => layer.get('title') === layerName);

        // If not found in map, search in global array
        if (!existingLayer) {
            const globalLayerEntry = tmpl_setMap_layer_global.find(l => l.title === layerName);
            if (globalLayerEntry) existingLayer = globalLayerEntry.layer;
        }

        if (existingLayer && existingLayer.getSource()) {
            existingLayer.getSource().getFeatures().forEach(feature => {
                const originalStyle = feature.get('originalStyle');
                if (originalStyle) feature.setStyle(originalStyle);
                feature.set('blinkInterval', null);
            });
        }

        return { status: true, message: "Blinking stopped for layer: " + layerName };
    } catch (error) {
        console.error("Error in stopBlink:", error);
        return { status: false, message: error.message };
    }
};


// Helper function for hover labels
function addHoverLabel(mapObj, layerName) {
	var ta_tooltip = document.createElement('tooltip');
	ta_tooltip.id = 'trip-tooltip';
	ta_tooltip.className = 'ol-trip-tooltip';

	var overlay_mouseOver_label = new ol.Overlay({
		element: ta_tooltip,
		offset: [10, 0],
		positioning: 'bottom-left'
	});

	mapObj.addOverlay(overlay_mouseOver_label);

	mapObj.on('pointermove', function (evt) {
		var feature_mouseOver = mapObj.forEachFeatureAtPixel(evt.pixel, function (feature) {
			if (feature.get('layer_name') === layerName) {
				return feature;
			}
		});

		ta_tooltip.style.display = feature_mouseOver ? '' : 'none';

		if (feature_mouseOver) {
			overlay_mouseOver_label.setPosition(evt.coordinate);
			ta_tooltip.innerHTML = feature_mouseOver.get('label');
		}
	});
}

tmpl.Overlay.addMarker = function (param) {
	var mapObj = param.map;
	var img_url = param.img_url;
	var height = param.height;
	var width = param.width;
	var id = param.id;
	var offset = param.offset;
	var point = param.point;
	var heightAboveGround = param.heightAboveGround;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}


		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid point' };
		}


		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

		if (img_url === null || img_url === undefined || img_url === '' || img_url === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid img_url value' };
		}


		if (height === null || height === undefined || height === '' || height === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid height value' };
		}

		if (width === null || width === undefined || width === '' || width === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid width value' };
		}

		if (offset === null || offset === undefined || offset === '' || offset === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid offset value' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	if (appConfigInfo.mapDimension == "2D") {
		var x = parseFloat(point[0]);
		var y = parseFloat(point[1]);
		var mr_olyrID = mapObj.getOverlayById('marker_OverlayID');
		if (mr_olyrID) {
			mapObj.removeOverlay(mr_olyrID);
		}
		var container = document.createElement('div');
		container.className = 'containerAPI ';
		var elem = document.createElement("img");
		elem.setAttribute("src", img_url);
		elem.setAttribute("height", height);
		elem.setAttribute("width", width);
		container.appendChild(elem);
		var marker_pos = new ol.Overlay({
			id: id,
			element: container,
			offset: offset,
			positioning: 'center'
		});
		mapObj.addOverlay(marker_pos);
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' ||
			appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == 'sgl') {
			marker_pos.setPosition(ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857'));
		}
		else {
			marker_pos.setPosition([x, y]);
		}
		marker_pos.setProperties({ olname: "markerOverlay" });
	} else {
		if (heightAboveGround == undefined) {
			var billboard = {
				image: img_url,
				width: width,
				height: height,
				//scale: 1.0,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				scaleByDistance: new Cesium.NearFarScalar(5e2, 1.0, 5e10, 0.1)
			};

			var point = mapObj.entities.add({
				position: Cesium.Cartesian3.fromDegrees(point[0], point[1]),
				// name: layerName,
				// id: getData[i].id,
				id: id,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				// show: visibility,
				// description: description,
				billboard: billboard,
				scaleByDistance: new Cesium.NearFarScalar(1e2, 1.0, 5e10, 0.1)
			});
		}
		else {
			var billboard = {
				image: img_url,
				width: width,
				height: height,
				//scale: 1.0,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
				scaleByDistance: new Cesium.NearFarScalar(5e2, 1.0, 5e10, 0.1)
			};

			var point = mapObj.entities.add({
				position: Cesium.Cartesian3.fromDegrees(point[0], point[1], heightAboveGround),
				// name: layerName,
				// id: getData[i].id,
				id: id,
				heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
				// show: visibility,
				// description: description,
				billboard: billboard,
				scaleByDistance: new Cesium.NearFarScalar(1e2, 1.0, 5e10, 0.1)
			});
		}
	}

	return { status: true, message: 'tmpl.Overlay.addMarker executed successfully' }
}

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
	var id = param.id;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}


		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid point value' };
		}


		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

		if (img_url === null || img_url === undefined || img_url === '' || img_url === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid img_url' };
		}


		if (height === null || height === undefined || height === '' || height === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid height' };
		}


		if (width === null || width === undefined || width === '' || width === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid width' };
		}


		if (plName === null || plName === undefined || plName === '' || plName === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid plName' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}


	var overlayID = mapObj.getOverlayById(id);
	var overlayIDL = mapObj.getOverlayById(id + 'label');
	if (overlayID) {
		mapObj.removeOverlay(overlayID);
		mapObj.removeOverlay(overlayIDL);
	}
	var container = document.createElement('div');
	container.className = 'containerAPI '
	var container1 = document.createElement('div');
	container1.className = 'containerAPI ';
	var elem = document.createElement("img");
	elem.setAttribute("src", img_url);
	elem.setAttribute("height", height);
	elem.setAttribute("width", width);
	var labelDiv = document.createElement('div');
	labelDiv.className = 'bottom_Marker';
	labelDiv.innerHTML = plName;
	container1.appendChild(elem);
	container.appendChild(labelDiv);
	var marker_pos = new ol.Overlay({
		id: id,
		element: container1,
		offset: offset,
		positioning: 'center-center'
	});
	var marker_pos1 = new ol.Overlay({
		id: id + 'label',
		element: container,
		offset: offset,
		positioning: 'center-center'
	});
	mapObj.addOverlay(marker_pos);
	mapObj.addOverlay(marker_pos1);
	if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' ||
		appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == 'sgl') {
		marker_pos.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
		marker_pos1.setPosition(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
	}
	else {
		marker_pos.setPosition([lon, lat]);
		marker_pos1.setPosition([lon, lat]);
	}
	marker_pos.setProperties({ olname: "searchOverlay" });
	marker_pos1.setProperties({ olname: "searchOverlay" });

	return { status: true, message: 'tmpl.Overlay.markerWithName executed successfully' }

}


// tmpl.Overlay.removeMarker = function(param){
// 	var mapObj = param.map;
// 	var id = param.id;
// 	try {
// 		if (mapObj === null || mapObj === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
// 		}

// 		if (id === null || id === undefined || id === '' || id === "") {

// 			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value'};
// 		}	

// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

// 		}
// 	}

// 	var mr_olyrID = mapObj.getOverlayById(id);
// 	var mr_olyrID1 = mapObj.getOverlayById(id+'label');
// 	if(mr_olyrID){
// 		mapObj.removeOverlay(mr_olyrID);
// 		if(mr_olyrID1 != undefined)
// 		mapObj.removeOverlay(mr_olyrID1);
// 	}

// 	else {
//         if (id != undefined) {
//             entity = mapObj.entities.getById(id);
//             mapObj.entities.remove(entity);
//         }
//         else {
//             console.log("ID not specified");
//         }
//     }

// 	return {status : true, message : 'tmpl.Overlay.removeMarker executed successfully'}
// }


tmpl.Overlay.removeMarker = function (param) {
	var mapObj = param.map;
	var id = param.id;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
		}

		if (id === null || id === undefined || id === '' || id === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid id value' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}
	if (appConfigInfo.mapDimension == "2D") {
		var mr_olyrID = mapObj.getOverlayById(id);
		var mr_olyrID1 = mapObj.getOverlayById(id + 'label');
		if (mr_olyrID) {
			mapObj.removeOverlay(mr_olyrID);
			if (mr_olyrID1 != undefined)
				mapObj.removeOverlay(mr_olyrID1);
		}
	}
	else {
		if (id != undefined) {
			entity = mapObj.entities.getById(id);
			mapObj.entities.remove(entity);
		}
		else {
			console.log("ID not specified");
		}
	}
	return { status: true, message: 'tmpl.Overlay.removeMarker executed successfully' }
}


//@Sh Enabled for removing all badge
tmpl.Overlay.removeBadge = function (param) {
	var mapObj = param.map;
	var overlays = mapObj.getOverlays().getArray();
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	var length = overlays.length;
	for (var i = 0; i <= length; i++) {
		//var p = allOverlays[i].id;
		mapObj.removeOverlay(overlays[0]);
		return true;
	}

	return { status: true, message: 'tmpl.Overlay.removeBadge executed successfully' }

}

//------------------------------------- End of Custom Overlay ------------------------------------------//
tmpl.Overlay.removeAllMarker = function (param) {
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib == "ol7") {
				mapObj.getOverlays().getArray().forEach(function (overlay) {
					mapObj.updateSize();
					mapObj.removeOverlay(overlay);
					mapObj.updateSize();

				});

				return { status: true, message: '.removeAllMarker executed successfully' }
			}
			if (appConfigInfo.mapLib == "leaflet") {

				markerGroup.clearLayers();

			}

		}
		else {
			return false;
		}
	}
	catch (err) {
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
	}

	return { status: true, message: '.removeAllMarker executed successfully' }

}

var drawPOI, modifyPOI, modifyPOIC;

tmpl.Create.POICircle = function (param) {
	var mapObj = param.map;
	var icon = param.image;
	var rdus = 0;
	var callbackFunc = param.callbackFunc;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapObj' };

		}

		if (icon === null || icon === undefined || icon === '' || icon === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid icon value' };
		}

		if (rdus === null || rdus === undefined || rdus === '' || rdus === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid rdus value' };
		}



		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc value' };
		}

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };

		}
	}

	try {
		if (param.radius) {
			rdus = param.radius;
		} else {
			rdus = 50;
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
			if (tempLayer.get('lname') === 'poivector') {
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
					image: new ol.style.Icon(({
						anchor: [0.5, 1],
						src: icon
					}))
				})
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
				return ol.events.condition.shiftKeyOnly(event) &&
					ol.events.condition.singleClick(event);
			}
		});

		modifyPOI.on('modifyend', function (event) {
			tmpl.Layer.clearCircle({ map: mapObj });
			var feature = event.features;
			var geometryVal = feature.a[0].getGeometry();
			console.log("ONCLICK::", feature.item(0).getGeometry().getCoordinates());
			lonlat = feature.item(0).getGeometry().getCoordinates();
			if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData == 'hereMaps' ||
				appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'sgl') {
				coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
				wktGeom = format.writeGeometry(feature.item(0).getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
			}
			else {
				coord = lonlat;//feature.getGeometry().getCoordinates();
				wktGeom = format.writeGeometry(feature.item(0).getGeometry());
			}
			event.stopPropagation();
			mapObj.removeInteraction(drawPOI);
			tmpl.Geocode.getGeocode({
				point: [coord[0], coord[1]],
				callbackFunc: handleGeocode
			});
			function handleGeocode(data) {
				address = data.address;
				tmpl.Create.circle({ map: mapObj, latlon: [coord[1], coord[0]], radius: param.radius, strokeColor: null, fillColor: null, callbackFunc: test2 });
				function test2(a) {
					var rec = { point: wktGeom, radius: rdus, address: address, geometry: a };
					callbackFunc(rec);
				}
			}

		});

		function addInteractionPOI() {
			drawPOI = new ol.interaction.Draw({
				features: features,
				source: poiVector.getSource(),
				type: 'Point'
			});
			mapObj.addInteraction(drawPOI);
			drawPOI.on('drawend', function (event) {
				var feature = event.feature;
				var geometryVal = feature.getGeometry();
				lonlat = feature.getGeometry().getCoordinates();
				if (appConfigInfo.mapData == 'google' ||
					appConfigInfo.mapData == 'hereMaps' ||
					appConfigInfo.mapData == 'trinity' ||
					appConfigInfo.mapData == 'mmi' ||
					appConfigInfo.mapData == 'sgl'
				) {
					coord = ol.proj.transform(lonlat, 'EPSG:3857', 'EPSG:4326');
					latlon = [coord[1], coord[0]];
					wktGeom = format.writeGeometry(feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326'));
				}
				else {
					coord = lonlat;//feature.getGeometry().getCoordinates();
					latlon = [coord[1], coord[0]];
					wktGeom = format.writeGeometry(feature.getGeometry());
				}
				event.stopPropagation();
				mapObj.removeInteraction(drawPOI);
				mapObj.addInteraction(modifyPOI);
				// console.log(coord[1]);
				tmpl.Zoom.toXYcustomZoom({
					map: mapObj,
					latitude: coord[1],
					longitude: coord[0],
					zoom: 15
				});



				tmpl.Geocode.getGeocode({
					point: coord,
					callbackFunc: handleGeocode
				});
				function handleGeocode(data) {
					address = data.address;
					tmpl.Create.circle({ map: mapObj, latlon: latlon, radius: param.radius, strokeColor: null, fillColor: null, callbackFunc: test2 });
					function test2(a) {
						var rec = { point: wktGeom, radius: rdus, address: address, geometry: a };
						callbackFunc(rec);
					}
				}

			});
		}
		addInteractionPOI();

	} catch (error) {

		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
	}

	return { status: true, message: '.POICircle executed successfully' }

}



tmpl.POI.clearPOICircleInteractions = function (param) {
	var mapObj = param.map;
	mapObj.removeInteraction(drawPOI);
	mapObj.removeInteraction(modifyPOI);
	mapObj.removeInteraction(modifyPOIC);
}


tmpl.Create.circle = function (param) {
	var mapObj = param.map;
	var latlon = param.latlon;
	var rdus = param.radius;
	var strokeColor = param.strokeColor;
	var fillColor = param.fillColor;
	var mycallback = param.callbackFunc;

	if (appConfigInfo.mapDimension == "2D") {

		var wgs84Sphere = new ol.Sphere(6378137);
		var format = new ol.format.WKT();
		var featureArray = [], featureJson = [], resultArray = [], featureId = [];
		var circle4326, circle3857, circleFeature, cirGeomtry, cirGeomtry4326, circleExtent, wktBufferGeom, style;
		var noLayer = false;
		var existingLayer;
		var Layers = mapObj.getLayers();
		var length = Layers.getLength();
		for (i = 0; i < length; i++) {
			var tempLayer = Layers.item(i);
			if (tempLayer.get('lname') == 'circleLayer') {
				noLayer = true;
				existingLayer = tempLayer;
				// existingLayer.getSource().clear();
			}
		}
		if (!noLayer) {
			circleLayer = new ol.layer.Vector({
				source: new ol.source.Vector()
			});
			circleLayer.setProperties({ lname: "circleLayer" });
			circleLayer.set('title', 'circleLayer');
			mapObj.addLayer(circleLayer);
			existingLayer = circleLayer;
		}
		if (strokeColor && fillColor) {
			style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: strokeColor,
					width: 1
				}),
				fill: new ol.style.Fill({
					color: fillColor
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: 'rgba(55, 155, 55, 0.5)',
					})
				})
			});
		} else {
			style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgb(255,0,0)',
					width: 1
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,0,0,0.2)'
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: 'rgba(55, 155, 55, 0.5)',
					})
				})
			});
		}
		if (appConfigInfo.mapData == 'google' || appConfigInfo.mapData == 'hereMaps' ||
			appConfigInfo.mapData == 'trinity' || appConfigInfo.mapData == 'mmi' || appConfigInfo.mapData == 'sgl') {
			//lonlatConvrtd=lonlat;//ol.proj.transform([lonlat[0],lonlat[1] ], 'EPSG:3857', 'EPSG:4326'); 
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
			circle3857 = circle4326.clone().transform('EPSG:4326', 'EPSG:3857');
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			existingLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry.clone().transform('EPSG:3857', 'EPSG:4326');
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
			// var modify = new ol.interaction.Modify({source: new ol.source.Vector()});			
			// map.addInteraction(modify);
		}
		else {
			circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [latlon[1], latlon[0]], rdus, 64);
			circle3857 = circle4326;
			circleFeature = new ol.Feature(circle3857);
			circleFeature.setStyle(style);
			existingLayer.getSource().addFeature(circleFeature);
			cirGeomtry = circleFeature.getGeometry();
			cirGeomtry4326 = cirGeomtry;
			wktBufferGeom = format.writeGeometry(cirGeomtry4326);
		}
		mycallback(wktBufferGeom);
		//  mapObj.addControl(new ol.control.LayerSwitcher());
	}

	else {

		const circleCenter = Cesium.Cartesian3.fromDegrees(76.6394, 12.2958);
		const circleRadius = 10.0;

		// Create a Cesium entity for the circle
		const circleEntity = mapObj.entities.add({
			position: circleCenter,
			ellipse: {
				semiMajorAxis: circleRadius,
				semiMinorAxis: circleRadius,
				material: Cesium.Color.RED.withAlpha(0.5), // Fill color with transparency
				outline: true,
				outlineColor: Cesium.Color.BLACK,
			},
		});

		// Optionally, you can add more properties or behavior to the circle entity
		circleEntity.label = {
			text: "My Circle",
			font: "24px sans-serif",
			fillColor: Cesium.Color.RED,
			outlineColor: Cesium.Color.BLACK,
			outlineWidth: 2,
		};

		// Optionally, you can zoom to the circle
		mapObj.zoomTo(circleEntity);

		// Optionally, you can handle resizing
		function handleResize() {
			mapObj.resize();
		}
		//window.addEventListener("resize", handleResize);

		// Initial resizing
		handleResize();

	}

	return { status: true, message: 'Createcircle  executed successfully' }

}

function ensureRGBA(color, alpha) {
	if (color.startsWith("rgb(")) {
		return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
	} else if (color.startsWith("rgba(")) {
		return color.replace(/,\s?[\d\.]+\)$/, `, ${alpha})`); // Modify existing alpha
	}
	return color; // If it's an unknown format, return as-is
}

// Function to create a blinking style based on feature color
function createBlinkStyle(blinkState, color) {
	const adjustedColor = ensureRGBA(color, blinkState ? 0.5 : 0.1); // Adjust transparency for blinking

	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: 20,
			fill: new ol.style.Fill({
				color: adjustedColor, // Always ensures transparency modification
			}),
			stroke: new ol.style.Stroke({
				color: ensureRGBA(color, 1), // Ensure stroke remains solid
				width: 2
			})
		})
	});
}

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

function updateBlinkVisibility(layerName, clusterSource) {
	const clusteredFeatures = new Set();

	// Identify clustered features
	clusterSource.getFeatures().forEach(cluster => {
		const features = cluster.get('features');
		if (features.length > 1) {
			features.forEach(fea => clusteredFeatures.add(fea.getId()));
		}
	});

	let blinkLayer = globalBlinkLayer.get(layerName);
	if (!blinkLayer) return;

	const blinkFeatures = blinkFeaturesByLayer.get(layerName) || new Map();

	blinkFeatures.forEach((blinkFeature, id) => {
		if (clusteredFeatures.has(id)) {
			blinkFeature.setStyle(null);
			blinkFeature.set('shouldBlink', false);
		} else {
			blinkFeature.set('shouldBlink', true);
		}
	});
	blinkLayer.getSource().changed();
}


function enableBlinkingForFeature(id, color, vectorSource, layerName) {
	const existingFeature = vectorSource.getFeatureById(id);
	if (!existingFeature) {
		console.warn(`Feature with ID ${id} not found.`);
		return;
	}

	let blinkLayer = globalBlinkLayer.get(layerName);
	if (!blinkLayer) {
		console.warn(`Blink layer for "${layerName}" not found.`);
		return;
	}

	let blinkFeatures = blinkFeaturesByLayer.get(layerName);
	if (!blinkFeatures) {
		blinkFeatures = new Map();
		blinkFeaturesByLayer.set(layerName, blinkFeatures);
	}

	if (blinkFeatures.has(id)) {
		const blinkFeature = blinkFeatures.get(id);
		blinkFeature.set('color', color);
		return;
	}

	// Create blinking feature behind the marker
	const blinkFeature = new ol.Feature({
		geometry: existingFeature.getGeometry().clone(),
		color: color,
		blinkState: true
	});

	blinkFeature.setId(`blink-${id}`);
	blinkFeature.set('shouldBlink', true);
	blinkFeatures.set(id, blinkFeature);
	blinkLayer.getSource().addFeature(blinkFeature);
}


function disableBlinkingForFeature(id, layerName) {
	const blinkFeatures = blinkFeaturesByLayer.get(layerName);
	if (!blinkFeatures) return;

	const blinkFeature = blinkFeatures.get(id);
	if (blinkFeature) {
		let blinkLayer = globalBlinkLayer.get(layerName);
		if (blinkLayer) {
			blinkLayer.getSource().removeFeature(blinkFeature);
		}
		blinkFeatures.delete(id);
	}
}



function startBlinking(layerName) {
	setInterval(() => {
		let batchIndex = 0;
		const blinkFeatures = blinkFeaturesByLayer.get(layerName);
		if (!blinkFeatures) return;

		const blinkingArray = Array.from(blinkFeatures.values());

		function processBlinkingBatch() {
			for (let i = 0; i < batchSize && batchIndex < blinkingArray.length; i++, batchIndex++) {
				let feature = blinkingArray[batchIndex];
				if (feature.get('shouldBlink')) {
					feature.set('blinkState', !feature.get('blinkState'));
					feature.setStyle(createBlinkStyle(feature.get('blinkState'), feature.get('color')));
				}
			}

			if (batchIndex < blinkingArray.length) {
				requestAnimationFrame(processBlinkingBatch);
			}
		}

		processBlinkingBatch();
	}, blinkUpdateInterval);
}


const blinkFeatures = new Map(); // Store blinking features by ID
let blinkingActive = false; // Flag to prevent multiple blinking loops
const batchSize = 500; // Limit blinking updates per frame
const blinkUpdateInterval = 750; // Increased for large datasets
const globalBlinkLayer = new Map(); // Store blink layers per layer
const blinkFeaturesByLayer = new Map(); // Store blinking features per layer
let blinkingActiveByLayer = new Map(); // Track if blinking is active per layer


let blinkArray = [];
let intervalid = [];
let blinkEntityArr = [];
tmpl.Overlay.createWithAnimation = function (param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var layerName = param.layer;
	var getdata = jsonobj;
	var bufferStyles = [];
	var features = [];
	var buffersVisible = [];
	var vectorLayers = [];
	var interval = 500;
	var clusterSource = param.clusterSource;

	var viewer = param.map;
	let entities = param.features
	var clearAnimation = param.clearAnimation
	if (appConfigInfo.mapDimension == "3D") {
		var height = -0.01;
		entities.forEach((entity) => {
			if (entity.animationRequired) {
				let existingID = entity.id + 'b';
				let removeEntity = mapObj.entities.getById(existingID);
				if (removeEntity) {
					mapObj.entities.removeById(existingID);

					blinkEntityArr.forEach((ent) => {
						if (ent.obj.id == existingID) {
							let index = intervalid.indexOf(ent.id);
							clearInterval(ent.id)
							intervalid.splice(index, 1);
							blinkEntityArr = blinkEntityArr.filter(item => item !== ent);
						}
					})
				}
				var blinkEntity = mapObj.entities.add({
					id: entity.id + 'b',
					name: param.layer,
					description: 'blink',
					position: Cesium.Cartesian3.fromDegrees(entity.lon, entity.lat, height),
					point: {
						pixelSize: 40,
						color: new Cesium.Color.fromCssColorString(entity.color).withAlpha(0.9),
						outlineColor: new Cesium.Color.fromCssColorString(entity.color).withAlpha(0.9),
						clampToGround: true,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					},
				});
			}
			blinkArray.push(blinkEntity);
			function toggleBlinking(blinkEntity) {
				blinkEntity.show = !blinkEntity.show;
			}

			var blinkingInterval = setInterval(function () {
				toggleBlinking(blinkEntity);
			}, 500);
			intervalid.push(blinkingInterval);
			blinkEntityArr.push({ id: blinkingInterval, obj: blinkEntity })
		})
	}
	else {

		let isCluster = true;
		let vectorSource;
		let clusterSource

		if (!clusterVectorSource[layerName] && !nonClusterVectorSource[layerName]) {
			console.warn(`Layer "${layerName}" not found in both clusterVectorSource and nonClusterVectorSource.`);
			return;  // Exit early if the layer is missing in both sources
		}

		if (!clusterVectorSource[layerName]) {
			isCluster = false
			console.warn(`Layer "${layerName}" not found in clusterVectorSource.`);
		}


		if (isCluster) {
			({ vectorSource, clusterSource } = clusterVectorSource[layerName]);
		} else {
			({ vectorSource } = nonClusterVectorSource[layerName]);
		}

		// Ensure each layer has its own blink layer
		let blinkLayer = globalBlinkLayer.get(layerName);
		if (!blinkLayer) {
			blinkLayer = new ol.layer.Vector({
				source: new ol.source.Vector(),
				style: function (feature) {
					return feature.get('shouldBlink') ? createBlinkStyle(feature.get('blinkState'), feature.get('color')) : null;
				}
			});
			mapObj.addLayer(blinkLayer);
			globalBlinkLayer.set(layerName, blinkLayer);
		}

		// Ensure blinking features are stored per layer
		if (!blinkFeaturesByLayer.has(layerName)) {
			blinkFeaturesByLayer.set(layerName, new Map());
		}

		const blinkFeatures = blinkFeaturesByLayer.get(layerName);


		try {
			jsonobj.forEach(obj => {
				if (vectorSource != undefined && vectorSource.getFeatureById(obj.id) != undefined) {
					const existingFeature = vectorSource.getFeatureById(obj.id);

					if (existingFeature) {
						existingFeature.set('animationRequired', obj.animationRequired);
						existingFeature.set('color', obj.color);

						if (obj.animationRequired) {
							enableBlinkingForFeature(obj.id, obj.color, vectorSource, layerName);
						} else {
							disableBlinkingForFeature(obj.id, layerName);
						}
					}
				}
			});
		} catch (err) {

		}


		if (!blinkingActiveByLayer.get(layerName)) {
			blinkingActiveByLayer.set(layerName, true);
			startBlinking(layerName);
		}


		if (isCluster) {
			clusterSource.on('change', debounce(() => updateBlinkVisibility(layerName, clusterSource), 500));
			requestAnimationFrame(() => updateBlinkVisibility(layerName, clusterSource));
		}
	}

};
tmpl.Overlay.removeWithAnimation = function (param) {
	map = param.map;
	layer = param.layer;
	if (appConfigInfo.mapDimension == "3D") {
		blinkingAnimation3D.forEach(function (item) {
			map.entities.remove(item.entity);
		});
		blinkingAnimation3D = []; // Clear the array
		// clearInterval(blinkingInterval); // Clear the blinking interval
	} else {
		if (globalBlinkLayer.get(layer)) {
			map.removeLayer(globalBlinkLayer.get(layer));
		}
	}

};

const badgeFeatures = new Map(); // Store badges by ID
let badgeProcessingQueue = []; // Queue for batch processing
const badgeBatchSize = 500; // Batch size for processing
const badgeUpdateInterval = 500; // Update interval for batches
const globalBadgeLayer = new Map(); // Store badge layers per layer
const badgeFeaturesByLayer = new Map();

tmpl.Overlay.badge = function (param) {
	const mapObj = param.map;
	const features = param.features;
	const layerName = param.layer;
	let isCluster = true;
	let vectorSource;
	let clusterSource

	if (!clusterVectorSource[layerName] && !nonClusterVectorSource[layerName]) {
		console.warn(`Layer "${layerName}" not found in both clusterVectorSource and nonClusterVectorSource.`);
		return;  // Exit early if the layer is missing in both sources
	}

	if (!clusterVectorSource[layerName]) {
		isCluster = false
		console.warn(`Layer "${layerName}" not found in clusterVectorSource.`);
	}


	if (isCluster) {
		({ vectorSource, clusterSource } = clusterVectorSource[layerName]);
	} else {
		({ vectorSource } = nonClusterVectorSource[layerName]);
	}

	// Ensure each layer has its own badge layer
	let badgeLayer = globalBadgeLayer.get(layerName);
	if (!badgeLayer) {
		badgeLayer = new ol.layer.Vector({
			source: new ol.source.Vector(),
			style: function (feature) {
				return feature.get('isBadgeRequired') ? createBadgeStyle(feature.get('badgeText')) : null;
			}
		});
		mapObj.addLayer(badgeLayer);
		globalBadgeLayer.set(layerName, badgeLayer);
	}

	// Ensure badge features are stored per layer
	if (!badgeFeaturesByLayer.has(layerName)) {
		badgeFeaturesByLayer.set(layerName, new Map());
	}

	const badgeFeatures = badgeFeaturesByLayer.get(layerName);


	features.forEach(obj => {
		try {
			if (vectorSource != undefined && vectorSource.getFeatureById(obj.id) != undefined) {
				const existingFeature = vectorSource.getFeatureById(obj.id);

				if (existingFeature) {
					existingFeature.set('isBadgeRequired', obj.isBadgeRequired);
					existingFeature.set('badgeText', obj.badgeText);

					if (obj.isBadgeRequired) {
						enableBadgeForFeature(obj.id, obj.badgeText, vectorSource, layerName);
					} else {
						disableBadgeForFeature(obj.id, layerName);
					}
				}
			}
		} catch (err) {

		}

	});

	//  Hide badges when clustered
	if (isCluster) {
		clusterSource.on('change', debounce(() => updateBadgeVisibility(layerName, clusterSource), 500));
		requestAnimationFrame(() => updateBadgeVisibility(layerName, clusterSource));
	}
}


function updateBadgeVisibility(layerName, clusterSource) {
	const clusteredFeatures = new Set();

	// Find clustered features
	clusterSource.getFeatures().forEach(cluster => {
		const features = cluster.get('features');
		if (features.length > 1) {
			features.forEach(fea => clusteredFeatures.add(fea.getId()));
		}
	});

	let badgeLayer = globalBadgeLayer.get(layerName);
	if (!badgeLayer) return;

	const badgeFeatures = badgeFeaturesByLayer.get(layerName) || new Map();

	badgeFeatures.forEach((badgeFeature, id) => {
		if (clusteredFeatures.has(id)) {
			badgeFeature.setStyle(null); // Hide badge
			badgeFeature.set('isBadgeRequired', false);
		} else {
			badgeFeature.set('isBadgeRequired', true);
			badgeFeature.setStyle(createBadgeStyle(badgeFeature.get('badgeText')));
		}
	});

	badgeLayer.getSource().changed(); // Refresh the badge layer
}



//  Enable badge for a specific feature
function enableBadgeForFeature(id, text, vectorSource, layerName) {
	const existingFeature = vectorSource.getFeatureById(id);
	if (!existingFeature) {
		console.warn(`Feature with ID ${id} not found.`);
		return;
	}

	let badgeLayer = globalBadgeLayer.get(layerName);
	if (!badgeLayer) {
		console.warn(`Badge layer for "${layerName}" not found.`);
		return;
	}

	let badgeFeatures = badgeFeaturesByLayer.get(layerName);
	if (!badgeFeatures) {
		badgeFeatures = new Map();
		badgeFeaturesByLayer.set(layerName, badgeFeatures);
	}

	if (badgeFeatures.has(id)) {
		const badgeFeature = badgeFeatures.get(id);
		badgeFeature.set('badgeText', text);
		badgeFeature.setStyle(createBadgeStyle(text)); // Restore badge style
		return;
	}

	const badgeFeature = new ol.Feature({
		geometry: existingFeature.getGeometry().clone(),
		badgeText: text
	});

	badgeFeature.setId(`badge-${id}`);
	badgeFeature.set('isBadgeRequired', true);
	badgeFeatures.set(id, badgeFeature);
	badgeLayer.getSource().addFeature(badgeFeature);
}



//  Disable badge for a specific feature
function disableBadgeForFeature(id, layerName) {
	const badgeFeatures = badgeFeaturesByLayer.get(layerName);
	if (!badgeFeatures) return;

	const badgeFeature = badgeFeatures.get(id);
	if (badgeFeature) {
		let badgeLayer = globalBadgeLayer.get(layerName);
		if (badgeLayer) {
			badgeLayer.getSource().removeFeature(badgeFeature);
		}
		badgeFeatures.delete(id);
	}
}




//  Function to create badge style
function createBadgeStyle(text) {
	return new ol.style.Style({
		text: new ol.style.Text({
			text: text || "B",
			font: 'Bold 12px Arial',
			fill: new ol.style.Fill({ color: 'white' }),
			stroke: new ol.style.Stroke({ color: 'blue', width: 6 }),
			padding: [5, 5, 5, 5],
			textAlign: 'center',
			offsetY: -25,
			offsetX: 15
		})
	});
}

//  Helper: Debounce function
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

tmpl.Overlay.hideBadges = function () {
	var badgeElements = document.getElementsByClassName('custom-badge');
	for (var i = 0; i < badgeElements.length; i++) {
		//console.log(badgeElements[i]);
		badgeElements[i].style.display = 'none';
	}
};

tmpl.Overlay.showBadges = function () {
	var badgeElements = document.getElementsByClassName('custom-badge');
	for (var i = 0; i < badgeElements.length; i++) {
		badgeElements[i].style.display = 'flex';
	}
};

tmpl.Overlay.removeBadgesByClassName = function (param) {
	var className = param.layer;
	var mapObj = param.map;

	mapObj.removeLayer(globalBadgeLayer.get(className));
};

tmpl.Overlay.removeBadges = function (mapObj) {
	var badgeElementToRemove = document.querySelector('.custom-badge');
	//console.log("badgeElementToRemove~~~~~~~~~~",badgeElementToRemove)
	badgeElementToRemove.parentNode.removeChild(badgeElementToRemove);
};

tmpl.Overlay.removeBadgeById = function (param) {
	badgeId = param.id;
	layerName = param.layer
	tmpl.Overlay.badge({
		map: mapObj, layer: layerName, features: [
			{ id: badgeId, isBadgeRequired: false }
		]
	});
};

tmpl.Overlay.updateBadgeById = function (param) {
	var mapObj = param.map;
	badgeId = param.id;
	textToReplace = param.badgeText;
	layerName = param.layer;
	colorToReplace = param.priorityColor;

	if (appConfigInfo.mapDimension == "2D") {
		tmpl.Overlay.badge({
			map: mapObj, layer: layerName, features: [
				{ id: badgeId, badgeText: textToReplace, isBadgeRequired: true }
			]
		});
	} else {
		for (let i = 0; i < tmpl_overlayCluster_golbal.length; i++) {
			if (tmpl_overlayCluster_golbal[i].id == badgeId) {
				tmpl_overlayCluster_golbal[i].label.text._value = textToReplace;
			}
		}
	}
}

tmpl.Overlay.hideBadgeById = function (param) {
	badgeId = param.id;
	flag = param.visibility;

	if (flag) {
		var element = document.getElementById(badgeId);
		if (element) {
			element.style.display = 'flex';
		}
	} else {
		var element = document.getElementById(badgeId);
		if (element) {
			element.style.display = 'none';
		}
	}

}

tmpl.Overlay.toggleAnimationByClassName = function (param) {
	mapObj = param.map;
	className = param.layer;
	flag = param.visible;
	if (mapObj == undefined || mapObj == null) {
		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid map Object' };
	}
	if (className == undefined || className == null || className == '' || className == "") {
		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layer name' };
	}
	if (flag == undefined || flag == null) {
		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid Boolean ' };
	}
	if (globalBlinkLayer.get(className)) {
		let blinkFeature = globalBlinkLayer.get(className);
		blinkFeature.setVisible(flag)
	}
}

tmpl.Overlay.toggleBadgesByClassName = function (param) {
	mapObj = param.map;
	className = param.layer;
	flag = param.visible;

	if (globalBadgeLayer.get(className)) {
		let badgeLayerFeature = globalBadgeLayer.get(className);
		badgeLayerFeature.setVisible(flag)
	}
};

tmpl.Overlay.removeCamField = function (param) {
	map = param.map;
	layer = param.layer;
	var flag = false;
	if (appConfigInfo.mapDimension == "3D") {
		//console.log("param~~~~~~~~~~~", appConfigInfo)
		//console.log("param~~~~~~~~~~~", param)
		//console.log("param~~~~~~~~~~~", polygonEntities);
		for (var i = 0; i < polygonEntities.length; i++) {
			//console.log("param~~~~~~~~~~~", polygonEntities);
			//console.log("param~~~~~~~~~~~", layer);
			if (polygonEntities[i].polygonEntity != '') {
				map.entities.remove(polygonEntities[i].polygonEntity);
			}
		}
	} else {
		for (var i = tmpl_setMap_camLayer_global.length - 1; i >= 0; i--) {
			if (tmpl_setMap_camLayer_global[i].parentLayer == layer) {
				result = removeLayer(tmpl_setMap_camLayer_global[i].id);
				if (flag) {
					tmpl_setMap_camLayer_global.splice(i, 1);
				}
			}
		}
		function removeLayer(id) {
			for (var i = tmpl_setMap_layer_global.length - 1; i >= 0; i--) {
				// Check if the current element's tilefield matches the layerName
				if (tmpl_setMap_layer_global[i].title == id) {
					tmpl_setMap_layer_global[i].layer.getSource().clear();
					tmpl_setMap_layer_global.splice(i, 1);
					flag = true;
				}
			}
			return false;
		}
	}
}

tmpl.Overlay.toggleCamFieldByClass = function (param) {
	layer = param.layer;
	var flag = param.visible;
	if (globalCamFieldLayer.get(layer)) {
		let camLayerFeature = globalCamFieldLayer.get(layer);
		camLayerFeature.setVisible(flag)
	}
}

function setBlinking(param) {
	map = param.map;
	macID = param.id;
	color = param.color;
	layerName = param.layerName;
	function getSearchMapAssets(clusterPointPos, clusterprop) {
		//console.log("clusterPointPos",clusterPointPos)
		//console.log("clusterprop",clusterprop)
		clusterprop.animationRequired = true;
		clusterprop.color = color;
		tmpl.Overlay.createWithAnimation({
			map: param.map,
			features: [clusterprop],
			layer: clusterprop.layer_name
		});
	}

	tmpl.Feature.byId({
		map: map,
		layer: layerName,
		id: macID,
		callbackFunc: getSearchMapAssets
	});
}

tmpl.Overlay.removeAnimationById = function (param) {
	mapObj = param.map;
	id = param.id;
	//console.log("test~~~~~~~~~~~~~~~~", blinkingAnimation3D);
	//console.log("test~~~~~~~~~~~~~~~~", blinkingAnimation3D.length);
	if (appConfigInfo.mapDimension == "3D") {
		for (let i = blinkingAnimation3D.length - 1; i >= 0; i--) {
			//console.log("test~~~~~~~~~~~~~~~~", i);
			if (id == blinkingAnimation3D[i].id) {
				mapObj.entities.remove(blinkingAnimation3D[i].entity);
				blinkingAnimation3D.splice(i, 1);
			}
		}
	} else {
		var overlays = mapObj.getLayers().getArray();
		for (let i = 0; i < overlays.length; i++) {
			if (overlays[i].U.id == id) {
				overlays.splice(i, 1);
			}
		}
	}
}

tmpl.Overlay.settooltipFlagToZero = function () {
	tooltipFlag = 0;
}

tmpl.Overlay.getCenter = function (param) {

	var geometryVal = param.geometry;
	var callBacFun = param.callBacFun;
	var centLocation;
	var format = new ol.format.WKT();
	var feature = format.readFeature(geometryVal, {
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:4326'
	});
	var cent = [];
	cent = createLatLonArray(geometryVal, 'poly');
	var centroidArray = getCentroid(cent, 2);
	var polygon = turf.polygon([centroidArray]);
	var centroid = turf.centerOfMass(polygon);
	centLocation = [centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]];
	console.log(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]);
	if (callBacFun) {
		callBacFun(centLocation);
	}

}


function terrainOverlay(param) {
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
	var isOverlay = true;
	param.isOverlay = true;
	fillColor = "RED";

	var dataSource = new Cesium.CustomDataSource(layerName);

	dataSource.clustering.enabled = true;
	dataSource.clustering.pixelRange = 40;
	dataSource.clustering.minimumClusterSize = 2;

	jsonobj.forEach(position => {
		position.type = "Clustered Entity";
		position.layer_name = layerName;
		let id = position.id;
		let updatedPosition;
		let cartographicPosition = Cesium.Cartographic.fromDegrees(position.lon, position.lat);
		Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographicPosition]).then(function (updatedPositions) {
			updatedPosition = updatedPositions[0];
			console.log(updatedPosition)
			position.updatedPos = updatedPosition;
			let newCustomEntity = dataSource.entities.add({
				id: position.id,
				position: Cesium.Cartesian3.fromRadians(
					updatedPosition.longitude,
					updatedPosition.latitude,
					updatedPosition.height
				),
				billboard: {
					image: position.img_url,
					scale: 1.0,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM
				},
				entProp: position
			});
			tmpl_overlayCluster_golbal.push(newCustomEntity);
			if (position.isBadgeRequired) {
				let dataEntity = dataSource.entities.getById(id);
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
			if (position.animationRequired) {
				addAnime({
					map: viewer,
					features: [position],
					layer: layerName
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
		cluster.billboard.image = pinBuilder.fromText(clusteredEntities.length, Cesium.Color.RED, 48).toDataURL();
		console.log(clusteredEntities);
		console.log(viewer.entities.values)
		// clusteredEntities.forEach((entity)=>{
		//   let camId=entity.id+'CF';
		//   camEntity=viewer.entities.getById(camId);
		//   camEntity.show=false;

		//   let blinkingId=entity.id+'b';      
		//   blinkEntityArr.forEach((blinkObj)=>{
		//     if(blinkObj.obj.id == blinkingId){	
		//       console.log(blinkObj)
		//       clearInterval(blinkObj.id);
		//       let index = intervalid.indexOf(blinkObj.id);
		//       if (index !== -1) {
		//           intervalid.splice(index, 1);
		//       }
		//       actualObj=mapObj.entities.getById(blinkingId);
		//       actualObj.show=false;
		//     }
		//   })
		// })
	});

	viewer.dataSources.add(dataSource);
}

function overlay(param) {
	var mapObj = param.map;
	var jsonobj = param.features;
	var layerName = param.layer;
	var getdata = jsonobj;
	var bufferStyles = [];
	var features = [];
	var buffersVisible = [];
	var vectorLayers = [];

	var getHoverLabel = param.getHoverLabel;
	var layerSwitcher = false;
	var trackLayer = param.trackLayer;
	var image_scale = param.icon_scale;

	var viewer = param.map;
	let entities = param.features

	var dataSource = new Cesium.CustomDataSource(layerName);

	dataSource.clustering.enabled = false;

	jsonobj.forEach(position => {
		position.type = "Non-Clustered Entity";
		position.layer_name = layerName;
		let id = position.id;
		let newCustomEntity = dataSource.entities.add({
			id: position.id,
			position: Cesium.Cartesian3.fromDegrees(position.lon, position.lat),
			billboard: {
				image: position.img_url,
				scale: 1.0,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			},
			entProp: position,
		});
		tmpl_overlayCluster_golbal.push(newCustomEntity);
		if (position.isBadgeRequired) {
			let dataEntity = dataSource.entities.getById(id);
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
		if (position.animationRequired) {
			tmpl.Overlay.createWithAnimation({
				map: viewer,
				features: [position],
				layer: layerName
			});
		}
	});
	tmpl.Overlay.addCamFieldOfView(param);

	viewer.dataSources.add(dataSource);

	let cartesian, cartographic, longitudeString, latitudeString, featureData, id, labelText, layerNm, entity, coord = [], latlng = [];
	let ellipsoid = viewer.scene.globe.ellipsoid;
	let scene = viewer.scene;
	let camera = viewer.camera;
	scene.screenSpaceCameraController.enableZoom = true;
	scene.screenSpaceCameraController.enableTranslate = true;
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

	handler.setInputAction(function (click) {
		var pickedObject = viewer.scene.pick(click.position);
		var position = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

		if (Cesium.defined(pickedObject) && pickedObject.id) {
			var entity = pickedObject.id;
			console.log(entity)

			if (entity.entProp && entity.entProp.type) {
				let properties = entity.entProp;
				let layerName = properties.layer_name;
				let longitudeString = properties.lon;
				let latitudeString = properties.lat;
				let coord = [longitudeString, latitudeString];
				// console.log(properties);
				// console.log('entity',entity)
				switch (entity.entProp.type) {
					case "Non-Clustered Entity":
						getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
						break;
					case "Clustered Entity":
						getOverlayFeatureDetails([entity.id.toString()], coord, layerName, [properties], viewer);
						break;
					case "3D Model":
						getOverlayFeatureDetails(entity.id.toString(), coord, layerName, properties, viewer);
						break;
					default:
						console.log("Unhandled entity type.");
				}
			}
		} else {
			console.log("No entity picked.");
		}

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

tmpl.Overlay.loadBuildingsWithTerrain = function (param) {
	let viewer = param.map;
	let layerName = param.layer;
	let features = param.features;
	let updatedPosition;

	features.forEach(building => {
		let cartographicPosition = Cesium.Cartographic.fromDegrees(building.lon, building.lat);
		Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographicPosition]).then(function (updatedPositions) {
			updatedPosition = updatedPositions[0];
			viewer.entities.add({
				name: layerName,
				position: Cesium.Cartesian3.fromRadians(
					updatedPosition.longitude,
					updatedPosition.latitude,
					updatedPosition.height
				),
				model: {
					uri: building.model_url,
					minimumPixelSize: 128, // Adjust as needed
					maximumScale: 20000, // Adjust as needed
				}
			});
		})
	});
}
tmpl.Overlay.loadBuildings = function (param) {
	try {
		let viewer = param.map;
		let layerName = param.layer;
		let features = param.features;
		let minScale = param.minimumPixelSize ? param.minimumPixelSize : 128;
		let maxScale = param.maximumScale ? param.maximumScale : 1026;

		features.forEach(building => {
			viewer.entities.add({
				id: building.id,
				name: layerName,
				position: Cesium.Cartesian3.fromDegrees(building.lon, building.lat, 0),
				model: {
					uri: building.model_url,
					minimumPixelSize: minScale,
					maximumScale: maxScale,
				},
				entProp: building
			});
		});
		return { "status": true, "message": "buildings loaded succesfully" }
	} catch (error) {
		return { "status": false, "message": "error while loading buildings" }
	}
}


// tmpl.Overlay.addESRICustomLayer = function (param) {
// 	console.log("addESRICustomLayer called with params:", param);

// 	var mapObj = param.map;
// 	var url = param.url;
// 	var layername = param.layername;
// 	var layerid = param.layerid;
// 	var visible = param.visible;
// 	var imgUrl = param.imgurl;
// 	var bgcolor = param.bgcolor;
// 	var fillColor = param.fillColor;

// 	if (mapObj === null || mapObj === undefined || mapObj === '' || mapObj === "") {
// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid url' };
// 	}


// 	if (url === null || url === undefined || url === '' || url === "") {
// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid url' };
// 	}

// 	if (layername === null || layername === undefined || layername === '' || layername === "") {
// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid method' };
// 	}

// 	if (layerid === null || layerid === undefined || layerid === '' || layerid === "") {
// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid successCallback' };
// 	}




// 	console.log("ESRI URL:", url + "/" + layerid);

// 	const vectorSource = new ol.source.Vector({
// 		format: new ol.format.GeoJSON(),
// 		url: url + "/" + layerid + "/query?where=1%3D1&returnGeometry=true&outFields=*&f=geojson"
// 	});

// 	let ftype = null;
// 	let fstyle = null;

// 	console.log("Sending AJAX request to fetch GeoJSON for style decision...");

// 	$.ajax({
// 		url: url + "/" + layerid + "/query?where=1%3D1&returnGeometry=true&outFields=*&f=geojson",
// 		success: function (res) {
// 			console.log("AJAX response received:", res);

// 			if (!res || !res.features || res.features.length === 0) {
// 				console.warn("No features found in response.");
// 				return;
// 			}

// 			ftype = res.features[0].geometry.type;
// 			console.log("Feature geometry type detected:", ftype);

// 			if (ftype === 'Point') {
// 				console.log("Applying Point style...");
// 				fstyle = new ol.style.Style({
// 					image: new ol.style.Icon({
// 						anchor: [0.5, 1.0],
// 						anchorXUnits: 'fraction',
// 						anchorYUnits: 'fraction',
// 						opacity: 0.85,
// 						src: imgUrl,
// 						size: [52, 64],
// 						scale: 0.5,
// 					}),
// 				});
// 			} else {
// 				console.log("Applying Polygon/Line style...");
// 				fstyle = new ol.style.Style({
// 					stroke: new ol.style.Stroke({
// 						color: bgcolor,
// 						lineDash: [4],
// 						width: 3
// 					}),
// 					fill: new ol.style.Fill({
// 						color: fillColor
// 					}),
// 				});
// 			}

// 			console.log("Creating vector layer and adding to map...");

// 			const vectorLayer = new ol.layer.Vector({
// 				source: vectorSource,
// 				style: function () {
// 					console.log("Returning style for feature");
// 					return fstyle;
// 				},
// 				title: layername,
// 				visible: visible
// 			});

// 			vectorLayer.set('layer_name', layername);
// 			mapObj.addLayer(vectorLayer);
// 			console.log("Layer added to map:", layername);
// 		},
// 		error: function (xhr, status, error) {
// 			console.error("Error loading GeoJSON from ESRI service:", error);
// 		}
// 	});
// };



tmpl.Overlay.addESRICustomLayer = function (param) {
    console.log("addESRICustomLayer called with params:", param);

    var mapObj = param.map;
    var url = param.url;
    var layername = param.layername;
    var layerid = param.layerid;
    var visible = param.visible;
    var imgUrl = param.imgurl;
    var bgcolor = param.bgcolor;
    var fillColor = param.fillColor;
	var viewer =mapObj;

   if(appConfigInfo.mapDimension == "2D"){
	 if (!mapObj || !url || !layername || layerid === undefined || layerid === '') {
        return { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameters' };
    }

    console.log("ESRI URL:", url + "/" + layerid);

    // Detect if the URL ends with "FeatureServer" or "MapServer"
    if (url.toLowerCase().endsWith("featureserver")) {
        console.log("Detected FeatureServer URL → adding vector layer.");

        const vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: url + "/" + layerid + "/query?where=1%3D1&returnGeometry=true&outFields=*&f=geojson"
        });

        $.ajax({
            url: url + "/" + layerid + "/query?where=1%3D1&returnGeometry=true&outFields=*&f=geojson",
            success: function (res) {
                if (!res || !res.features || res.features.length === 0) {
                    console.warn("No features found in response.");
                    return;
                }

                let ftype = res.features[0].geometry.type;
                let fstyle = null;

                if (ftype === 'Point') {
                    fstyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 1.0],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            opacity: 0.85,
                            src: imgUrl,
                            size: [52, 64],
                            scale: 0.5,
                        }),
                    });
                } else {
                    fstyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: bgcolor,
                            lineDash: [4],
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: fillColor
                        }),
                    });
                }

                const vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: function () {
                        return fstyle;
                    },
                    title: layername,
                    visible: visible
                });

                vectorLayer.set('layer_name', layername);
                mapObj.addLayer(vectorLayer);
                console.log("Vector layer added to map:", layername);
            },
            error: function (xhr, status, error) {
                console.error("Error loading GeoJSON from ESRI service:", error);
            }
        });

    } else if (url.toLowerCase().endsWith("mapserver")) {
        console.log("Detected MapServer URL → adding tile layer.");

        const tileLayer = new ol.layer.Tile({
            source: new ol.source.TileArcGISRest({
                url: url,
                params: { LAYERS: 'show:' + layerid }
            }),
            title: layername,
            visible: visible
        });

        tileLayer.set('layer_name', layername);
        mapObj.addLayer(tileLayer);
        console.log("TileArcGISRest layer added to map:", layername);

    } else {
        console.error("Unknown ESRI layer type. URL must end with FeatureServer or MapServer.");
        return { status: 'false', message: "Unknown ESRI layer type" };
    }
   }else{
		 if (!viewer || !url || !layername || layerid === undefined || layerid === '') {
        return { 
            status: 'false', 
            Businesserrorcode: 'TD_GISSDK_0x001', 
            Developererrorcode: 'TD_GISSDK_0x001', 
            message: 'Invalid parameters' 
        };
    }

    console.log("ESRI URL:", url + "/" + layerid);

    // Detect if the URL ends with "FeatureServer" or "MapServer"
    if (url.toLowerCase().endsWith("featureserver")) {
        console.log("Detected FeatureServer URL → adding GeoJSON layer.");

        var queryUrl = url + "/" + layerid + "/query?where=1%3D1&returnGeometry=true&outFields=*&f=geojson";

        $.ajax({
            url: queryUrl,
            success: function (res) {
                if (!res || !res.features || res.features.length === 0) {
                    console.warn("No features found in response.");
                    return;
                }

                let ftype = res.features[0].geometry.type;
                var dataSource = new Cesium.GeoJsonDataSource(layername);
                
                dataSource.load(res, {
                    stroke: Cesium.Color.fromCssColorString(bgcolor),
                    fill: Cesium.Color.fromCssColorString(fillColor),
                    strokeWidth: 3
                }).then(function () {
                    viewer.dataSources.add(dataSource);
                    dataSource.show = visible;

                    // Apply styling based on geometry type
                    if (ftype === 'Point') {
                        dataSource.entities.values.forEach(function (entity) {
                            entity.point = new Cesium.PointGraphics({
                                pixelSize: 8,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2
                            });

                            if (imgUrl) {
                                entity.billboard = new Cesium.BillboardGraphics({
                                    image: imgUrl,
                                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    scale: 0.5
                                });
                                entity.point = undefined; // Remove point if using billboard
                            }
                        });
                    } else {
                        // For LineString and Polygon
                        dataSource.entities.values.forEach(function (entity) {
                            if (entity.polyline) {
                                entity.polyline.strokeColor = Cesium.Color.fromCssColorString(bgcolor);
                                entity.polyline.width = 3;
                            }
                            if (entity.polygon) {
                                entity.polygon.outline = true;
                                entity.polygon.outlineColor = Cesium.Color.fromCssColorString(bgcolor);
                                entity.polygon.outlineWidth = 3;
                                entity.polygon.fill = true;
                                entity.polygon.material = Cesium.Color.fromCssColorString(fillColor);
                            }
                        });
                    }

                    console.log("GeoJSON layer added to viewer:", layername);
                }).catch(function (error) {
                    console.error("Error loading GeoJSON from ESRI service:", error);
                });

            },
            error: function (xhr, status, error) {
                console.error("Error loading GeoJSON from ESRI service:", error);
            }
        });

    }else if (url.toLowerCase().endsWith("sceneserver")) {
        console.log("Detected SceneServer URL → adding 3D Scene Layer.");

        try {
            // Construct the I3S (Indexed 3D Scene Layer) tileset URL
            var i3sUrl = url + "/" + layerid + "/SceneLayer?f=json";
            var rootNodeUrl = url + "/" + layerid + "/nodes/root";
            
            console.log("Loading I3S from:", i3sUrl);
            
            // Load as Cesium 3D Tileset using the root node
            Cesium.Cesium3DTileset.fromUrl(rootNodeUrl, {
                maximumScreenSpaceError: 64
            }).then(function (tileset) {
                viewer.scene.primitives.add(tileset);
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 0));
                tileset.show = visible;
                console.log("3D Scene Layer added to viewer:", layername);
            }).catch(function (error) {
                console.warn("Failed to load I3S tileset, trying alternative approach...", error);
                
                // Fallback: Try loading as GeoJSON features if available
                $.ajax({
                    url: url + "/" + layerid + "?f=json",
                    success: function (layerInfo) {
                        console.log("Loaded layer info (fallback):", layerInfo);
                        console.error("Unable to load 3D tileset. Please ensure the SceneServer supports 3D tiles.");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error fetching Scene Layer info:", error);
                    }
                });
            });
        } catch (error) {
            console.error("Error creating 3D Scene Layer:", error);
        }

    } else if (url.toLowerCase().endsWith("mapserver")) {
        console.log("Detected MapServer URL → adding ArcGIS Map Server layer.");

        try {
            var arcGisLayer = Cesium.ArcGisMapServerImageryProvider.fromUrl(url, {
                layers: [parseInt(layerid)]
            }).then(function (provider) {
                var imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
                imageryLayer.show = visible;
                imageryLayer.name = layername;
                console.log("ArcGIS Map Server layer added to viewer:", layername);
            }).catch(function (error) {
                console.error("Error loading ArcGIS Map Server layer:", error);
            });
        } catch (error) {
            console.error("Error creating ArcGIS layer:", error);
        }

    }  else {
        console.error("Unknown ESRI layer type. URL must end with FeatureServer or MapServer.");
        return { status: 'false', message: "Unknown ESRI layer type" };
    }
	}
};

tmpl.Overlay.getESRIMetaData = function (param) {
  try {
    var map = param.map;
    var callback = param.callbackfunc;

    map.on("singleclick", function (evt) {

      var view = map.getView();
      var projection = view.getProjection();
      var size = map.getSize();

      var lonLat = ol.proj.toLonLat(evt.coordinate, projection);

      var extent = view.calculateExtent(size);
      var extent4326 = ol.proj.transformExtent(
        extent,
        projection,
        "EPSG:4326"
      );

      map.getLayers().getArray().forEach(function (layer) {

        if (!layer.getVisible || !layer.getVisible()) return;
        if (!layer.getSource) return;

        var source = layer.getSource();
        if (!source.urls || !source.urls.length) return;
        if (!source.c || !source.c.LAYERS) return;

        var esriUrl = source.urls[0];
        var layerId = source.c.LAYERS.split(":")[1];

        if (!esriUrl || layerId === undefined) return;

        var identifyUrl =
          esriUrl + "/identify?" +
          "f=json" +
          "&geometry=" + lonLat[0] + "," + lonLat[1] +
          "&geometryType=esriGeometryPoint" +
          "&sr=4326" +
          "&layers=all:" + layerId +
          "&tolerance=10" +
          "&mapExtent=" + extent4326.join(",") +
          "&imageDisplay=" + size[0] + "," + size[1] + ",96" +
          "&returnGeometry=true";

        console.log("✅ ESRI Identify URL >>>", identifyUrl);
        $.ajax({
          url: identifyUrl,
          method: "GET",
          success: function (res) {
			  if (res && res.results && res.results.length > 0) {
				  callback(res, layer);
			  }
          },
          error: function (xhr, status, error) {
            callback({
              error: true,
              message: error
            }, layer);
          }
        });

      });

    });

  } catch (error) {
    console.error("Error at tmpl.Map.getESRIMetaData >>> ", error);
  }
};




let glbMultiTrackWithoutLineLayerName;
let glbMapObjectsTrackWithoutLine = new Map();
let glbTrackWithoutLineMapObjects = [];
tmpl.Overlay.trackWithoutLine = function(param){
	let layerName = param.layerName;
	let mapObj = param.map;
	let featureDataAry = [];
	let vectorSource = null;
	glbMultiTrackWithoutLineLayerName=layerName;

	var layers = mapObj.getLayers();
	var existingLayer = layers.getArray().find(layer => layer.get('title') === layerName);

	if (existingLayer) {
		vectorSource = existingLayer.getSource(); 
		console.log("existing layer")
	} else {
		vectorSource = new ol.source.Vector(); 
		console.log("new layer");
		glbTrackWithoutLineMapObjects.push(vectorSource);
	}
	var newLayer = new ol.layer.Vector({
		title: layerName,
		'noncluster': true,
		source: vectorSource,
		visible: true,
		zIndex: 5
	});

	mapObj.addLayer(newLayer);
	newLayer.setMap(mapObj);
}

tmpl.Overlay.addVehiclesToTrackWithoutLine = function(param){
	let mapObj = param.map;
	let features = param.features;
	let featureDataAry = [];
	let layerName = param.layer;
	if(layerName!=glbMultiTrackWithoutLineLayerName){
		console.error("not a valid layername")
		return
	}
	// let layerName = glbMultiTrackWithoutLineLayerName;
	let layers = mapObj.getLayers();
	let image_scale = param.icon_scale || 1;
	var showLabel = param.showLabel != undefined ? param.showLabel : false;

	if(glbMultiTrackWithoutLineLayerName == undefined || glbMultiTrackWithoutLineLayerName == null){
		console.error("no layer created under the name ",glbMultiTrackWithoutLineLayerName)
		return;
	}
	let existingLayer = layers.getArray().find(layer => layer.get('title') === glbMultiTrackWithoutLineLayerName);
	let vectorSource = existingLayer.getSource();

	console.log(existingLayer,glbMultiTrackWithoutLineLayerName);

	if(vectorSource == null || vectorSource == undefined){
		console.error("no layer created under the name ",glbMultiTrackWithoutLineLayerName)
		return;
	}

	features.forEach(data => {
				var iconStyle = new ol.style.Icon({
					src: data.img_url,
					scale: image_scale,
					opacity: 1,
					zIndex: 3,
					anchor: [0.5, 0.5],
					anchorXUnits: 'fraction',
					anchorYUnits: 'fraction',
					rotation: 0
				});

				if (!showLabel) {
					var featureStyle = new ol.style.Style({
						image: iconStyle,
					});
				} else {
					var featureStyle = new ol.style.Style({
						image: iconStyle,
						text: new ol.style.Text({
							font: 'Bold' + ' ' + '12px' + ' ' + 'Verdana',
							textAlign: 'center',
							text: data.label || '',
							offsetY: 7,
							fill: new ol.style.Fill({
								color: data.label_color || '#fff',
								width: 20
							}),
							stroke: new ol.style.Stroke({
								color: data.label_bgcolor || '#000',
								width: 6
							})
						})
					});
				}

				// var coordinates = ol.proj.fromLonLat([parseFloat(data.lon), parseFloat(data.lat)]);

				if (appConfigInfo.mapData === 'google' || appConfigInfo.mapData === 'hereMaps') {
					coordinates = ol.proj.transform([parseFloat(data.lon), parseFloat(data.lat)], 'EPSG:4326', 'EPSG:3857');
				} else {
					coordinates = [parseFloat(data.lon), parseFloat(data.lat)];
				}
				const geometry = new ol.geom.Point(coordinates);
				const feature = new ol.Feature({ geometry: geometry });


				feature.setProperties(data);
				feature.setId(data.id);
				feature.set('imgURL', data.img_url);
				feature.set('layer_name', layerName);
				feature.set('title', layerName);
				feature.setStyle(featureStyle);
				feature.set('vectorSource',vectorSource);

				vectorSource.addFeature(feature);
				featureDataAry.push(feature)
				trackFeaturesSource.set(data.id, feature);
			});

			tmpl_setMap_layer_global = tmpl_setMap_layer_global.filter(
				layerObj => layerObj.title !== layerName
			);

	existingLayer.setSource(vectorSource);
	existingLayer.changed();

	tmpl_setMap_layer_global.push({
		layer: existingLayer,
		title: layerName,
		visibility: true,
		map: mapObj
	});
}



tmpl.Create.POICircleAnimation = function (param) {
  try {
    const mapObj = param.map;
    const icon = param.image;
    const lat = param.lat;
    const lon = param.lon;
    const rdus = param.radius || 100;
    const strokeColor = param.strokeColor || 'rgba(255,0,0,1)';
    const duration = param.duration || 2000;
    const fps = 30;
    const lname = param.layername || 'animatedCircleLayer';
    const animationType = param.animationType || 'ripple'; // 'pulse' | 'ripple' | 'glow'

    if (!mapObj) return { status: false, message: 'Invalid map object' };
    if (lat === undefined || lon === undefined)
      return { status: false, message: 'Invalid latitude/longitude' };
    if (!icon) return { status: false, message: 'Invalid icon path' };

    // Remove existing layer with same name
    if (tmpl_setMap_layer_global[lname]) {
      const prev = tmpl_setMap_layer_global[lname];
      cancelAnimationFrame(prev.frame);
      if (prev.layer) mapObj.removeLayer(prev.layer);
      delete tmpl_setMap_layer_global[lname];
    }

    const coord = ol.proj.fromLonLat([lon, lat]);
    const iconFeature = new ol.Feature({ geometry: new ol.geom.Point(coord) });
    iconFeature.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: icon,
          scale: 1,
        }),
      })
    );
    const circleFeatures = [];
    if (animationType === 'ripple') {
      for (let i = 0; i < 3; i++) {
        circleFeatures.push(new ol.Feature({ geometry: new ol.geom.Circle(coord, 0) }));
      }
    } else {
      // single circle
      circleFeatures.push(new ol.Feature({ geometry: new ol.geom.Circle(coord, 0) }));
    }

    const source = new ol.source.Vector({
      features: [iconFeature, ...circleFeatures],
    });

    const layer = new ol.layer.Vector({ source });
    layer.set('lname', lname);
    mapObj.addLayer(layer);

    // Easing functions
    function easeOut(t) {
      return Math.sqrt(1 - Math.pow(t - 1, 2));
    }

    function easeOpacity(t) {
      return 0.5 * (1 + Math.cos(Math.PI * t));
    }

    let startTime = performance.now();
    let frameId = null;
    let running = true;
    let lastFrame = 0;

    function animateFrame(now) {
      if (!running) return;
      const elapsed = now - startTime;
      const delta = now - lastFrame;
      if (delta < 1000 / fps) {
        frameId = requestAnimationFrame(animateFrame);
        return;
      }
      lastFrame = now;

      const baseTime = (elapsed % duration) / duration;

      if (animationType === 'pulse') {
        // Single expanding circle
        const eased = easeOut(baseTime);
        const radius = eased * rdus;
        const opacity = easeOpacity(baseTime);

        const feature = circleFeatures[0];
        feature.getGeometry().setRadius(radius);
        feature.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: strokeColor.replace(/[\d.]+\)$/g, `${opacity})`),
              width: 2,
            }),
          })
        );
      }

      else if (animationType === 'ripple') {
        // Multiple expanding circles offset in time
        circleFeatures.forEach((feature, i) => {
          const rippleOffset = ((baseTime + i / circleFeatures.length) % 1);
          const eased = easeOut(rippleOffset);
          const radius = eased * rdus;
          const opacity = 1 - rippleOffset; 

          feature.getGeometry().setRadius(radius);
          feature.setStyle(
            new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: strokeColor.replace(/[\d.]+\)$/g, `${opacity * 0.8})`),
                width: 2,
              }),
            })
          );
        });
      }

      else if (animationType === 'glow') {
        // Static circle glowing
        const pulse = 0.5 + 0.5 * Math.sin((elapsed / duration) * Math.PI * 2);
        const alpha = 0.4 + 0.4 * pulse;
        const width = 2 + 1.5 * pulse;

        const feature = circleFeatures[0];
        feature.getGeometry().setRadius(rdus); // fixed radius
        feature.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: strokeColor.replace(/[\d.]+\)$/g, `${alpha})`),
              width: width,
            }),
            fill: new ol.style.Fill({
              color: strokeColor.replace(/[\d.]+\)$/g, `${alpha * 0.2})`),
            }),
          })
        );
      }

      mapObj.render();
      frameId = requestAnimationFrame(animateFrame);
    }

    frameId = requestAnimationFrame(animateFrame);

    // Store in global variable
    tmpl_setMap_layer_global[lname] = {
      layer: layer,
      frame: frameId,
      running: running,
      stop: function () {
        cancelAnimationFrame(frameId);
        running = false;
        try {
          mapObj.removeLayer(layer);
        } catch (e) {}
        delete tmpl_setMap_layer_global[lname];
        console.log(`[POICircle] '${lname}' animation stopped and removed.`);
      },
    };

    return {
      status: true,
      message: `Circle animation '${lname}' (${animationType}) started successfully`,
    };
  } catch (err) {
    console.error('[POICircle] Error:', err);
    return { status: false, message: 'Error: ' + err.message };
  }
};

tmpl.Layer.clearAnimatedCircle = function (param) {
  try {
    const mapObj = param.map;
    const lname = param.layerName || 'animatedCircleLayer';
    if (!mapObj)
      return { status: false, message: 'Invalid map object passed to clearAnimatedCircle' };


    const entry = tmpl_setMap_layer_global[lname];
    if (entry) {
      try {
        cancelAnimationFrame(entry.frame);
      } catch (e) {}
      try {
        if (entry.layer) mapObj.removeLayer(entry.layer);
      } catch (e) {}
      delete tmpl_setMap_layer_global[lname];
      console.log(`[clearAnimatedCircle] Cleared animation layer '${lname}'.`);
    } else {
      console.log(`[clearAnimatedCircle] No animated layer '${lname}' found.`);
    }

    return { status: true, message: `Animated circle '${lname}' cleared successfully` };
  } catch (err) {
    console.error('[clearAnimatedCircle] Error:', err);
    return { status: false, message: 'Error: ' + err.message };
  }
};



