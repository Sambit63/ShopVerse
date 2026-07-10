
//---------------------------------- Beginning of Map Control Tools -------------------------------------//

// **** Map Zoom In **** //

tmpl.Control.zoomIn = function(param){
	var mapObj = param.map;

	
	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Bad Request, Parameter Not a Valid mapObj' };

		}	

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	var currentZoom = mapObj.getView().getZoom();
	currentZoom = currentZoom + 1;
	mapObj.getView().setZoom(currentZoom);

	return {status : true, message : 'Control.zoomIn executed successfully'}
}

// **** Map Zoom Out **** //

tmpl.Control.zoomOut = function(param){
	var mapObj = param.map;
    
	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}	

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	var currentZoom = mapObj.getView().getZoom();
	currentZoom = currentZoom - 1;
	mapObj.getView().setZoom(currentZoom);

	return {status : true, message : 'Control.zoomOut executed successfully'}
}

// **** Adding Scale Control to the specified map **** //
isScaleAdded=false;
tmpl.Control.addScale = function(param){
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}	

	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	if(isScaleAdded==false){
	var scaleCtrl = new ol.control.ScaleLine();
	mapObj.addControl(scaleCtrl);
	isScaleAdded=true;
	return {status : true, message : 'Control.addScale executed successfully'}
	}else{
		return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Already Scale is added' };
	}
}

// **** Adding Zoom to Extent Control to the specified map **** //

tmpl.Control.addZoomToExtent = function(param){
	var mapObj = param.map;
	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}	
       
	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}

	if(appConfigInfo.mapData=='google' || appConfigInfo.mapData=='hereMaps' ||
	 	appConfigInfo.mapData=='trinity' || appConfigInfo.mapData=='mmi'||appConfigInfo.mapData=='sgl' ){	
		var zoomToExtentButton = document.createElement('button');
		var zoomToExtentText = document.createTextNode("E");
		zoomToExtentButton.appendChild(zoomToExtentText);
		zoomToExtentButton.title ='Fit to Extent';
		zoomToExtentButton.className = 'ol-zoom-Extent-Custom .ol-unselectable ';
		zoomToExtentButton.addEventListener('click', function(){
			zoomToExtentControlForGoogle(mapObj);
		});
		var zoomToExtentControl = new ol.control.Control({
			element: zoomToExtentButton
		});
		mapObj.addControl(zoomToExtentControl);
    }
    else
    {
		var zoomToExtentControl = new ol.control.ZoomToExtent({
			extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
		});
		mapObj.addControl(zoomToExtentControl);
    }

	return {status : true, message : 'Control.addZoomToExtent executed successfully'}
}

// **** Zoom to Extent event handler for Google map **** //

function zoomToExtentControlForGoogle(mapObj){
	var start = new google.maps.LatLng(appConfigInfo.extent2,appConfigInfo.extent1);
    var end = new google.maps.LatLng(appConfigInfo.extent4,appConfigInfo.extent3);
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
	
    var convertBounds,x1,y1,x2,y2,extent;
    convertBounds = bounds.toString();
    convertBounds=convertBounds.slice(2,-2);
    convertBounds=convertBounds.split("), (");
    x1=parseFloat(convertBounds[0].split(",")[0]);
    y1=parseFloat(convertBounds[0].split(",")[1]);
	x2=parseFloat(convertBounds[1].split(",")[0]);
    y2=parseFloat(convertBounds[1].split(",")[1]);
	
    extent =[y1,x1,y2,x2];
    mapObj.getView().fit(ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'), mapObj.getSize());
}

// **** End of Adding Zoom to Extent Control to the specified map **** //

// **** Adding Mouse Position Control to the specified map **** //

tmpl.Control.addMousePostion = function(param){
	var mapObj = param.map;

	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}	
       
	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	var ctrlMouse = new ol.control.MousePosition({
		undefinedHTML: 'outside',
        projection: 'EPSG:4326',
        coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '{x}, {y}', 4);
		}
	});
	mapObj.addControl(ctrlMouse);
	return {status : true, message : 'Control.addMousePostion executed successfully'}

}

// **** Adding Full Screen Control to the specified map **** //

tmpl.Control.addFullScreen = function(param){
	var mapObj = param.map;

	try {
		if (mapObj === null || mapObj === undefined) {
		
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };

		}	
       
	} catch (error) {

		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	var ctrlFullScreen =  new ol.control.FullScreen();
	mapObj.addControl(ctrlFullScreen);

	return {status : true, message : 'Control.addFullScreen executed successfully'}
}
//----------------------------------- End of Map Control Tools ------------------------------------------//
	