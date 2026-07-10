								

//new fleet 
var global_fleet_layer_id = [];
var global_fleet_layer_features = [];
var global_fleet_layer_objects = [];
var globale_layer_names = [];

tmpl.Track.withoutLine = function(param){
	//console.log(global_fleet_layer_objects);
	var data = param.data;
	var map = param.map;
	var properties = null;
	console.log("properties",properties);
	if(appConfigInfo.mapDimension=="2D"){
		for(var i=0;i<data.length;i++){
			var fleet_overlayId = 'fleet_'+data[i].layerName+'_'+data[i].id;
			var index = global_fleet_layer_id.indexOf(fleet_overlayId);
			var fleet_overlay = global_fleet_layer_features[index];
			var fleet_overlay_object = global_fleet_layer_objects[index];
			var pos = [data[i].lon,data[i].lat];
			var properties = data[i].properties;
			if(fleet_overlay_object != undefined)
			fleet_overlay_object.sendTrackData(pos,properties);
	
		}
	} else {
		var allEntities = map.entities.values;
		console.log("allEntities~~~~~~~~~~~",allEntities);
		console.log("allEntities~~~~~~~~~~~",allEntities.length);
		console.log("allEntities~~~~~~~~~~~",data[0]);
		var vehicleEntity;
		if(allEntities.length==0){
			vehicleEntity = map.entities.add({
				name: 'Vehicle',
				position: Cesium.Cartesian3.fromDegrees(data[0].lon, data[0].lat, 0),
				billboard: {
					image: data[0].img_url,
					scale: 1.5
				}
			});
		}else{
			allEntities.forEach(element => {
				if(element._id==data[0].id){
					console.log("element~Sreejith iiiiiiiiiiiiii~~",element);
					vehicleEntity=element;
				}
			});
		}
		setTimeout(() => {
			var currentPosition = map.camera.positionCartographic;
			map.camera.flyTo({
				destination: Cesium.Cartesian3.fromRadians(currentPosition.longitude, currentPosition.latitude, currentPosition.height), // Keep the current height
				orientation: {
					pitch: map.camera.pitch,
					heading: map.camera.heading,
					roll: map.camera.roll
				},
				complete: function () {
					var position = Cesium.Cartesian3.fromDegrees(data[0].lon, data[0].lat, 0);
					console.log("position inside~~~~~", position);
					console.log("position inside vehicleEntity~~~~~", vehicleEntity);
					vehicleEntity.position = Cesium.Cartesian3.fromDegrees(data[0].lon, data[0].lat, 0);
				},
				onError: function (error) {
					console.error('Camera animation error:', error);
				}
			});
		}, 3000);

	}
}

tmpl.Track.smoothMovement = function(param) {
	this.map = param.map;
	this.layername = param.layername;
	this.track_end_marker;
	this.track_ivlDraw;
	this.fleet_points = [];
	this.first_fleet_flag = true;
	this.vehicleId = param.id;
	this.feature = param.feature;
	this.fleet_featureId = param.featureId;	
}
	tmpl.Track.smoothMovement.prototype = {
			sendTrackData : function (pos,properties){

if(properties != undefined){
	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			this.feature.set(key,properties[key]);
		}
	}
}
			if(this.fleet_points.length > 1){
				if(this.fleet_points[this.fleet_points.length-1][0] == pos[0] && this.fleet_points[this.fleet_points.length-1][1] == pos[1]){
				}else{
					this.fleet_points.push(pos);
				}
			}else{
				this.fleet_points.push(pos);
			}
			if(this.fleet_points.length > 1){
			if(this.first_fleet_flag == true){
				this.startFleet();
				this.first_fleet_flag = false;
			}
			}
		},
		startFleet : function (){

				var point = this.fleet_points[1];
				var p_point = this.fleet_points[0];
				point[0] = parseFloat(point[0]);
				point[1] = parseFloat(point[1]);
				p_point[0] = parseFloat(p_point[0]);
				p_point[1] = parseFloat(p_point[1]);
				if(appConfigInfo.mapData == "google" || 
				appConfigInfo.mapData=="hereMaps" ||
				appConfigInfo.mapData=="mmi"||
				appConfigInfo=="trinity"||
				appConfigInfo.mapData=='sgl'){
					point = ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857');
					p_point = ol.proj.transform(p_point, 'EPSG:4326', 'EPSG:3857');
				}
				else{
					
				}
				
				this.drawAnimatedLine(p_point,point,50,10000);
			//}
		},
		drawAnimatedLine : function (startPt, endPt, steps, time){
	    var directionX = (endPt[0] - startPt[0]) / steps;
	    var directionY = (endPt[1] - startPt[1]) / steps;
	    var i = 0;
		var newEndPt;
		var itsparent = this;
		var angle = rotate({
			x1: startPt[0],
			y1: startPt[1],
			x2: endPt[0],
			y2: endPt[1]
		});
	    itsparent.track_ivlDraw = setInterval(function () {
			var map = itsparent.map;
	        if (i > steps) {
	            clearInterval(itsparent.track_ivlDraw);
				itsparent.fleet_points.splice(0, 1);
				if(itsparent.fleet_points.length > 1){
					itsparent.startFleet();
				}else{
					itsparent.first_fleet_flag = true;
				}
	        }
	        newEndPt = [startPt[0] + i * directionX, startPt[1] + i * directionY];

			if(isNaN(angle) == false)
				
		    //to Rotate Icon based on angle		
			//itsparent.feature.getStyle().getImage().setRotation(angle);			

			itsparent.feature.getGeometry().setCoordinates(newEndPt);
			
		 var toltipTick = new ol.geom.Point(ol.proj.transform([startPt[0] + i * directionX, startPt[1] + i * directionY], 'EPSG:3857', 'EPSG:4326'));
		 var toltipTickcoordinates = toltipTick.getCoordinates(); 
		 var latitude = toltipTickcoordinates[1]; // Extract latitude from the transformed coordinates
         var longitude = toltipTickcoordinates[0]; // Extract longitude from the transformed coordinates
	     var html = itsparent.feature.getProperties().html;
		 
		//console.log("newEndPt..",newEndPt,toltipTick ,itsparent.feature.getProperties() ); //@Sh commented for console print
				


		var overlayID = map.getOverlayById(itsparent.feature.getProperties().id);
		map.removeOverlay(overlayID);

	       // vbadge implementation @ratheesh
		   
			var ta_tooltip = document.createElement('tooltip');
			ta_tooltip.id = 'vbadge';
			ta_tooltip.className = 'vbadge';
			ta_tooltip.style.position = 'absolute';
			ta_tooltip.style.top = '-76px'; // Set the top position //59 @sh
			ta_tooltip.style.left = '-76px'; // Set the left position
			ta_tooltip.style.background = itsparent.feature.getProperties().vbadge;
		    ta_tooltip.innerHTML = itsparent.feature.getProperties().html;
	
			var overlaymouseOver_label = new ol.Overlay({
				id: itsparent.feature.getProperties().id,
				element: ta_tooltip,
				offset: [10, 0],
				positioning: 'top-right'
			});

	
   // Set the position of the overlay to a specific latitude and longitude
	var position = ol.proj.fromLonLat([longitude, latitude]);
	overlaymouseOver_label.setPosition(position);
	
		// Add the overlay to the map
		map.addOverlay(overlaymouseOver_label);

		try
		{
		if (popup.id && itsparent.feature.getProperties().id)
		{
			if(itsparent.feature.getProperties().id == popup.id )
			{
				var tPosition = ol.proj.fromLonLat([itsparent.feature.getProperties().lon, itsparent.feature.getProperties().lat]);
				popup.setPosition(position);
				
			}
		}
		}catch(e){
			//console.log("Fleet Dynamic Tooltip Move Object Issue..!");
			}
	    //@sh Ratheesh added for badge movement with onclick tooltip showcase
	  						
	        i++;
	    }, time/50);
		
		},
		clearTrack : function(){
			 clearInterval(this.track_ivlDraw);
		}

		
	}

tmpl.Track.animationQueue = {}; 

tmpl.Track.withoutLineFilter = function(param) {
	let features = param.data;
	let duration = param.duration !== undefined ? param.duration : 1000;
	
	try {
		features.forEach(element => {
			const feature = trackFeaturesSource.get(element.id);
			let newLat = element.lat;
			let newLon = element.lon;
			let angle = element.angle;
			if (!feature) {
				console.warn(`Feature with ID ${element.id} not found.`);
				return;
			}
	
			if (!tmpl.Track.animationQueue[element.id]) {
				tmpl.Track.animationQueue[element.id] = [];
			}
	
			tmpl.Track.animationQueue[element.id].push({ newLat, newLon, duration, angle});
	
			if (tmpl.Track.animationQueue[element.id].length === 1) {
				processQueue(element.id);
			}
		});
	
	} catch (err) {
		console.error("Error in withoutLineFilter:", err);
	}
};

	
function calculateAngle(start, end) {
    if (!start || !end) return null; // Return null to prevent rotation

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    if (dx === 0 && dy === 0) {
        return null; // No movement, don't change the angle
    }

    let angle = Math.atan2(dy, dx);  // Calculate angle in radians
    return -(angle - Math.PI / 2);  // Adjust for OpenLayers
}

function processQueue(featureId) {
    let queue = tmpl.Track.animationQueue[featureId];
    if (!queue || queue.length === 0) {
        return;
    }

    const feature = trackFeaturesSource.get(featureId);
    if (!feature) {
        console.warn(`Feature with ID ${featureId} not found.`);
        return;
    }

    let { newLat, newLon, duration, angle } = queue[0];
    const geometry = feature.getGeometry();
    const [currentLon, currentLat] = ol.proj.toLonLat(geometry.getCoordinates());

    let nextPos = [newLon, newLat];
    let currentPos = [currentLon, currentLat];

    // **Check if it's the first update and no movement happened**
    if (queue.length === 1 && currentLat === newLat && currentLon === newLon) {
        queue.shift(); // Remove this entry since no movement is needed
        processQueue(featureId); // Process the next queue item
        return;
    }

    let newAngle = calculateAngle(currentPos, nextPos);

    function moveFeature(startTime) {
        function move(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * progress * (3 - 2 * progress);

            // Interpolate position
            const interpolatedLat = currentLat + (newLat - currentLat) * easeProgress;
            const interpolatedLon = currentLon + (newLon - currentLon) * easeProgress;

            const radians = angle * (Math.PI / 180);
			feature.setStyle(new ol.style.Style({
						image: new ol.style.Icon({
							src: feature.get('imgURL'),
							rotateWithView: true,
							rotation: radians
						})
					}
				)
			);

            feature.getGeometry().setCoordinates(ol.proj.fromLonLat([interpolatedLon, interpolatedLat]));

            if (progress < 1) {
                requestAnimationFrame(move);
            } else {
                feature.changed();
                queue.shift();
                processQueue(featureId);
            }
        }

        requestAnimationFrame(move);
    }

    requestAnimationFrame(() => moveFeature(performance.now()));
}


tmpl.Track.removeVehiclesById = function(param){
	let featureList = param.features;
	try {
		if(featureList == undefined || featureList == null){
			return{status:false , message:"features is either undefined or null"};
		}else if(featureList.length == 0){
			return{status:true , message:"features array is empty"};
		}else{			
			featureList.forEach(featureId=>{
				const feature = trackFeaturesSource.get(featureId);

				if (feature) {
					const layerName = feature.get('layer_name');
					const source = feature.get('vectorSource');
					if (!layerName || !source) {
						console.warn(`Layer name or vectorsource not found for feature ID: ${featureId}`);
						return;
					}
					
			
					if (layerName && source) {
						source.removeFeature(feature);
						trackFeaturesSource.delete(featureId);
						if (tmpl.Track.animationQueue) {
							delete tmpl.Track.animationQueue[featureId];
						}
						console.log(`Feature with ID ${featureId} removed from layer ${layerName}.`);
					} else {
						console.warn(`Layer with name ${layerName} not found.`);
					}
				} else {
					console.warn(`Feature with ID ${featureId} not found.`);
				}
			});
			return{status:true , message:"vehicles removed for the defined featureID's"}
		}
	} catch (error) {
		console.error("error while removing vehicle ",error)
	}
}