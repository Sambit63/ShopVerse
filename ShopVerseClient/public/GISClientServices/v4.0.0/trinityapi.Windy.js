tmpl.Windy.addWindLayer = function (param){
   try {
    const map = param.map;

    if(map === null || map === undefined){
        return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
    }

    var mapContainer = map.getTargetElement();

    // Check if windyMap canvas already exists
    var existingCanvas = document.getElementById('windyMap');
    if (!existingCanvas) {
        // Create and append the windyMap canvas
        var canvas = document.createElement('canvas');
        canvas.id = 'windyMap';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';

        // Add the canvas to the map container
        mapContainer.appendChild(canvas);
    } else {
        var canvas = existingCanvas;
    }

    var windy;

    function refreshWindy() {
        if (!windy) {
            return;
        }
        windy.stop();

        var mapSize = map.getSize();
        var extent = map.getView().calculateExtent(mapSize);
        extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

        // Resize canvas to match the map size
        canvas.width = mapSize[0];
        canvas.height = mapSize[1];

        windy.start(
            [[0, 0], [canvas.width, canvas.height]],
            canvas.width,
            canvas.height,
            [[extent[0], extent[1]], [extent[2], extent[3]]]
        );
    }

    fetch(appConfigInfo.mapSDKURL + 'resApi.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            windy = new Windy({ canvas: canvas, data: json });
            refreshWindy();
        });

    // Refresh Windy on map movement
    map.on('moveend', refreshWindy);

    // Handle map resize to adjust canvas size
    map.on('resize', function () {
        refreshWindy();
    });
    return {status : true , message : "Wind layer added scuccesfully"};
   } 
   catch (error) {
    return {status : false , message : "error while adding Wind layer" , error : error};
   }

}

tmpl.Windy.removeWindLayer = function(param){
    try{
        const map = param.map;
        if(map === null || map === undefined){
            return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid mapObj' };
        }
        if (typeof windy !== 'undefined' && windy) {
            windy.stop();
            windy = null; // Clear the Windy instance
        }

        var canvas = document.getElementById('windyMap');
        if (canvas) {
            canvas.remove(); // Remove canvas from the DOM
        }

        // map.un('moveend', refreshWindy);
        if (typeof refreshWindy === 'function') {
            map.un('moveend', refreshWindy);
        }
        return {status : true , message : "Wind layer removed scuccesfully"};
    } catch(error){
        return {status : false , message : "error while removing Wind layer" , error : error};
    }
}