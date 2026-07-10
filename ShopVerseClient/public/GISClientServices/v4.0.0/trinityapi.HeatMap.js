tmpl.HeatMap.create = function(param){
	var mapObj = param.map;
	var getdata = param.data;
	var layer = param.layer;
	var blur = param.blur;
	var opacity = param.opacity || 1;

	var callBackFun = typeof param.callBackFun === 'function'
		? param.callBackFun
		: null;

	var onHover = param.onHover || false;	


	try {
		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}

		if (getdata === null || getdata === undefined || getdata === '' || getdata === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid getdata parameter' };
		}
		
		if (layer === null || layer === undefined || layer === '' || layer === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layer' };
		}
		
		if (blur === null || blur === undefined || blur === '' || blur === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid blur parameter' };
		}

	} catch (error) {
		if (error instanceof Error) {
			// console.log("tmpl.Draw.point | ", error.message);
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
		}
	}

	if(blur == undefined)
	blur = 2;
	var radius = param.radius;
	if(radius == undefined)
	radius = 10;
	var weight;	
	var featureDataAry = [];
	var geometry;

	var maxWeight = 1;
	for (var i = 0; i < getdata.length; i++) {
		if (getdata[i].weight && getdata[i].weight > maxWeight) {
			maxWeight = getdata[i].weight;
		}
	}
	for (var i = 0, length = getdata.length; i < length; i++){
		if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps'){
			geometry = new ol.geom.Point(ol.proj.transform([parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)], 'EPSG:4326', 'EPSG:3857'));
		}
		else{
			var coordinate = [parseFloat(getdata[i].lon), parseFloat(getdata[i].lat)];
			geometry = new ol.geom.Point(coordinate);
		}
		var featureval = new ol.Feature({
            geometry     : geometry
			
        });
		if(getdata[i].weight){
			weight = getdata[i].weight;
			var normalizedWeight = weight / maxWeight;
			featureval.set('weight', normalizedWeight);
		}
		featureval.set('layer_name', layer);
		featureval.setProperties(getdata[i].properties);
		featureval.set('tooltip', getdata[i].tooltip || null);
		featureDataAry.push(featureval);      
	}
	var vector_heat = new ol.layer.Heatmap({		
		source: new ol.source.Vector({
			features: featureDataAry,
			title :layer,
		}),
		title :layer,
		blur: blur,
		radius: radius,
		opacity: opacity,
		// gradient: [
		// 	'rgba(0, 0, 255, 0.15)',   // BLUE – low
		// 	'rgba(0, 255, 0, 0.6)',    // GREEN – medium
		// 	'rgba(255, 255, 0, 0.9)',  // YELLOW – high
		// 	'rgba(255, 0, 0, 1)'       // RED – very high
		// ]

	});
    mapObj.addLayer(vector_heat);	  

	// var tooltipDiv = document.createElement('div');
	// tooltipDiv.className = 'heatmap-tooltip';
	// tooltipDiv.style.position = 'absolute';
	// tooltipDiv.style.background = 'rgba(0,0,0,0.6)';
	// tooltipDiv.style.color = '#fff';
	// tooltipDiv.style.padding = '6px 8px';
	// tooltipDiv.style.borderRadius = '4px';
	// tooltipDiv.style.fontSize = '12px';
	// tooltipDiv.style.pointerEvents = 'none';
	// tooltipDiv.style.display = 'none';

	// var tooltipOverlay = new ol.Overlay({
	// 	element: tooltipDiv,
	// 	offset: [10, 0],
	// 	positioning: 'bottom-left'
	// });
	// mapObj.addOverlay(tooltipOverlay);

tmpl_setMap_layer_global.push({
    			layer : vector_heat,
    			title :  layer,
				visibility : true,
				map : mapObj
    		});
		
	vector_heat.setMap(mapObj);
	var Layers = mapObj.getLayers();
			var length = Layers.getLength();

			var heatmapLayers = {};


	var hoverInteraction = new ol.interaction.Select({
		condition: ol.events.condition.pointerMove,
		layers: function (layer) {
			return heatmapLayers.hasOwnProperty(layer.get('title'));
		},
	});
	mapObj.addInteraction(hoverInteraction);


	var clickInteraction = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: function(layer) {
			return heatmapLayers.hasOwnProperty(layer.get('title'));
		}
	});
	mapObj.addInteraction(clickInteraction);

	clickInteraction.on('select', function(event) {
		if (event.selected.length > 0) {
			var feature = event.selected;
			var label = feature.get('label');
			runCustomAction(feature);
		}
	});

	// 	mapObj.on('pointermove', function (evt) {
	// 	if (evt.dragging) {
	// 		tooltipDiv.style.display = 'none';
	// 		return;
	// 	}

	// 	var feature = mapObj.forEachFeatureAtPixel(
	// 		evt.pixel,
	// 		function (feature) {
	// 			return feature;
	// 		}
	// 	);

	// 	if (!feature) {
	// 		tooltipDiv.style.display = 'none';
	// 		return;
	// 	}

	// 	var tooltipData = feature.get('tooltip');
	// 	if (!tooltipData || tooltipData.length === 0) {
	// 		tooltipDiv.style.display = 'none';
	// 		return;
	// 	}

	// 	var html = '';

	// 	for (var i = 0; i < tooltipData.length; i++) {
	// 		html +=
	// 			'<div style="margin-bottom:4px;">' +
	// 			'<span style="font-weight:600;">' + tooltipData[i].key + '</span>' +
	// 			':' +
	// 			'<span>' + tooltipData[i].value + '</span>' +
	// 			'</div>';
	// 	}


	// 	tooltipDiv.innerHTML = html;
	// 	tooltipDiv.style.display = 'block';
	// 	tooltipOverlay.setPosition(evt.coordinate);
	// });


	if (onHover && callBackFun) {

		mapObj.on('pointermove', function (evt) {

			if (evt.dragging) return;
			if (!callBackFun) return;

			var feature = mapObj.forEachFeatureAtPixel(
				evt.pixel,
				function (feat) {
					return feat;
				}
			);

			if (!feature) return;
			if (feature.get('layer_name') !== layer) return;
			callBackFun({
				feature: feature,
				properties: feature.getProperties(),
				tooltip: feature.get('tooltip'),
				coordinate: evt.coordinate,
				pixel: evt.pixel,
				layer: layer
			});
		});
	}

	return response = { status: true, message: 'create HeatMap API Enabled..' };					
}

tmpl.HeatMap.changeRadius = function(param){
	var mapObj = param.map;
	var radius = param.radius;
	var layer = param.layer;
	try {
		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}

		if (radius === null || radius === undefined || radius === '' || radius === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid radius' };
		}
		
		if (layer === null || layer === undefined || layer === '' || layer === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layer' };
		}
		

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for(var i=0;i<tmpl_setMap_layer_global.length;i++){
		if(tmpl_setMap_layer_global[i].title == layer){
			var heatLayer = tmpl_setMap_layer_global[i].layer;
			heatLayer.setRadius(parseInt(radius, 10));
			break;
		}
	}
	return response = { status: true, message: ' HeatMap change Radius API Enabled..' };
}

tmpl.HeatMap.changeBlur = function(param){
	var mapObj = param.map;
	var blur = param.blur;
	var layer = param.layer;
	try {
		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}

		if (blur === null || blur === undefined || blur === '' || blur === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid blur value' };
		}
		
		if (layer === null || layer === undefined || layer === '' || layer === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layer' };
		}
		

	} catch (error) {
		if (error instanceof Error) {
		
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}
	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for(var i=0;i<tmpl_setMap_layer_global.length;i++){
		if(tmpl_setMap_layer_global[i].title == layer){
			var heatLayer = tmpl_setMap_layer_global[i].layer;
			heatLayer.setBlur(parseInt(blur, 10));
			break;
		}
	}

	return response = { status: true, message: ' HeatMap change blur API Enabled..' };
}
tmpl.HeatMap.changeOpacity = function(param){
	var mapObj = param.map;
	var op = param.opacity;
	var layer = param.layer;
	try {
		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}

		if (op === null || op === undefined || op === '' || op === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid op value' };
		}
		
		if (layer === null || layer === undefined || layer === '' || layer === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid layer' };
		}
		

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	var Layers = mapObj.getLayers();
	var length = Layers.getLength();
	for(var i=0;i<tmpl_setMap_layer_global.length;i++){
		if(tmpl_setMap_layer_global[i].title == layer){
			var heatLayer = tmpl_setMap_layer_global[i].layer;
			heatLayer.setOpacity(parseFloat(op));
			break;
		}
	}
	return response = { status: true, message: ' HeatMap change Opacity API Enabled..' };

}
				
	