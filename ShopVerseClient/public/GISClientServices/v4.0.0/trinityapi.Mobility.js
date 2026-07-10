haltPointArray = [];
tmpl.Mobility.tripWithHaltPlayback = function(param){ 
    const map = param.map;
    const data = param.data;
    let playbackSpeed = param.playbackSpeed || 1;
    const imgUrl = param.imgUrl!=undefined ? param.imgUrl : appConfigInfo.mapSDKURL+'4.png';
    const stopImg = param.haltImgUrl!=undefined ? param.haltImgUrl : appConfigInfo.mapSDKURL+'2.png';
    const movingColor = param.movingColor!=undefined ? param.movingColor : 'rgba(24, 24, 228, 0.94)';
    const haltColor = param.haltColor!=undefined ? param.haltColor : 'rgba(255, 160, 0, 0.94)';
    const startImg = param.startImg!=undefined ? param.startImg : appConfigInfo.mapSDKURL+'2.png';
    const endImg = param.endImg!=undefined ? param.endImg : appConfigInfo.mapSDKURL+'2.png';
    const tripZoom = param.zoomLevel !=undefined ? param.zoomLevel : 15 ;
    const routeWidth = param.routeWidth !=undefined ? param.routeWidth : 5 ;

    const speed = 10;
    let vectorSource;
    let vectorLayer;
    let iconFeature;
    let haltSource;
    let haltLayer;
   function addIcon(){
    iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([data[0].lon, data[0].lat])),
    });

    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: imgUrl, // Replace with your custom icon URL
        }),
    });

    iconFeature.setStyle(iconStyle);

    vectorSource = new ol.source.Vector({
        features: [iconFeature],
    });

    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);

    console.log("vector ",vectorLayer)
    console.log("Vector Layer Source: ", vectorLayer.getSource());
   }
   addIcon()
    // Initialize path on the map
    const pathFeature = new ol.Feature({
        geometry: new ol.geom.LineString([]),
    });

    const movingStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: movingColor,
            width: routeWidth,
        }),
    });

    const haltingStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: haltColor,
            width: 3,
        }),
    });

    let firstPoint = data[0];
    let lastPoint = data[data.length-1];
    let inBtwPoint = firstPoint;
    tmpl.Zoom.toXYcustomZoom({
        map: map,
        zoom: tripZoom,
        latitude: firstPoint.lat,
        longitude: firstPoint.lon,
      });

    pathFeature.setStyle(movingStyle);

    const pathSource = new ol.source.Vector({
        features: [pathFeature],
    });

    const pathLayer = new ol.layer.Vector({
        source: pathSource,
    });

    map.addLayer(pathLayer);
    console.log("path layer ",pathLayer);

    console.log("Path Layer Source: ", pathLayer.getSource());
    
    let markerLayer;
    function addIcons(){
        // Coordinates for the start and end points
        const startPointCoords = ol.proj.fromLonLat([firstPoint.lon, firstPoint.lat]);
        const endPointCoords = ol.proj.fromLonLat([lastPoint.lon, lastPoint.lat]);

        // Create features for start and end points
        const startFeature = new ol.Feature({
            geometry: new ol.geom.Point(startPointCoords),
        });
        const endFeature = new ol.Feature({
            geometry: new ol.geom.Point(endPointCoords),
        });

        // Style for the start and end icons
        const startIconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: startImg, // Replace with your start icon path
                scale: 1.0, // Adjust size as needed
            }),
        });
        const endIconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: endImg, // Replace with your end icon path
                scale: 1.0, // Adjust size as needed
            }),
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
        });

        // Add the layer to the map
        map.addLayer(markerLayer);
    }
    addIcons();
    //---------------------------------
    let speedMultiplier = 1;
    playing = false;
    stopped = false;
    paused = false;
    const mapContainer = document.getElementById(globalMapDivID);

    // Create the controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'controls';
    controlsDiv.style.position = 'absolute'; // Position relative to the map container
    controlsDiv.style.top = '90%'; // Top margin
    controlsDiv.style.left = '43%'; // Left margin
    controlsDiv.style.zIndex = '1000'; // Ensure it's above the map
    controlsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent background
    controlsDiv.style.padding = '10px';
    controlsDiv.style.borderRadius = '5px';

    controlsDiv.style.display = 'flex';
    controlsDiv.style.gap = '10px';
    
    // Append the controls container to the map container
    mapContainer.appendChild(controlsDiv);

    const playButton = document.createElement('button');
    playButton.id = 'playButtonId'; // Assign an ID
    playButton.style.backgroundColor = 'blue'; // Initial background color
    playButton.style.border = 'none';
    const playIcon = document.createElement('img');
    playIcon.src = appConfigInfo.mapSDKURL+'play.png'; 
    playIcon.alt = 'play';
    playIcon.style.width = '20px'; 
    playIcon.style.height = '20px'; 

    playButton.appendChild(playIcon);
    playButton.addEventListener('click', () => {
        if(stopped){
            currentIndex = 0;
            vectorSource.clear(); 
            pathSource.clear();
            map.removeLayer(haltLayer);
            haltSource.clear();

            haltPointArray = haltPointArray.filter((obj) => {
                obj.getSource().clear();
                map.removeLayer(obj);
                return false; // Exclude all objects from the new array
            });

            addIcon();
        }
        console.log(`${playing} button clicked`);
        if(!playing){
            animateToNextPoint();
        }
        playing=true;
        stopped = false;
        paused = false;
        resetColor();
        playButton.style.backgroundColor = 'red'; 
    });
    controlsDiv.appendChild(playButton);

    const pauseButton = document.createElement('button');
    pauseButton.id = 'pauseButtonId'; // Assign an ID
    pauseButton.style.backgroundColor = 'blue'; // Initial background color
    pauseButton.style.border = 'none';
    const pauseIcon = document.createElement('img');
    pauseIcon.src = appConfigInfo.mapSDKURL+'pause.png'; // Replace with the path to your play icon
    pauseIcon.alt = 'pause';
    pauseIcon.style.width = '20px'; // Adjust size as needed
    pauseIcon.style.height = '20px'; // Adjust size as needed
    pauseButton.appendChild(pauseIcon);
    pauseButton.addEventListener('click', () => {
        console.log(`${paused} button clicked`);    
        if(!paused){
            cancelAnimationFrame(animationFrame);
        }
        paused = true;
        playing = false; 
        stopped = false;
        resetColor();
        pauseButton.style.backgroundColor = 'red'; 
    });
    controlsDiv.appendChild(pauseButton);

    const stopButton = document.createElement('button');
    stopButton.id = 'stopButtonId'; // Assign an ID
    stopButton.style.backgroundColor = 'blue'; // Initial background color
    stopButton.style.border = 'none';
    const stopIcon = document.createElement('img');
    stopIcon.src = appConfigInfo.mapSDKURL+'stop.png'; // Replace with the path to your play icon
    stopIcon.alt = 'Play';
    stopIcon.style.width = '20px'; // Adjust size as needed
    stopIcon.style.height = '20px'; // Adjust size as needed
    stopButton.appendChild(stopIcon);
    stopButton.addEventListener('click', () => {
        console.log(`${paused} button clicked`);    
        if(!stopped){
            cancelAnimationFrame(animationFrame);
            // currentIndex = 0;
        }
        paused = false;
        playing = false; 
        stopped = true;
        resetColor();
        stopButton.style.backgroundColor = 'red'; 
    });
    controlsDiv.appendChild(stopButton);


    const speedDropdown = document.createElement('select');
    speedDropdown.id = 'speedDropdown';

    const speedOptions = [
        { value: 1, label: '1x' },
        { value: 2, label: '2x' },
        { value: 3, label: '3x' },
        { value: 4, label: '4x' },
        { value: 5, label: '5x' },
        { value: 10, label: '10x' },
        { value: 15, label: '15x' }
    ];

    // Populate dropdown options
    speedOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        speedDropdown.appendChild(opt);
    });

    // Handle dropdown change
    speedDropdown.addEventListener('change', (event) => {
        speedMultiplier = parseFloat(event.target.value); // Update speed multiplier
        console.log(`Speed Multiplier: ${speedMultiplier}`);
    });

    // Add dropdown to controls
    controlsDiv.appendChild(speedDropdown);

    function resetColor(){
        pauseButton.style.backgroundColor = 'blue';
        playButton.style.backgroundColor = 'blue';
        stopButton.style.backgroundColor = 'blue';
    }
    //---------------------------------

    let currentIndex = 0;
    let animationFrame;
    points = data;
   
    function animateToNextPoint() {
        if (currentIndex >= points.length - 1) {
            cancelAnimationFrame(animationFrame); // Stop the animation
            return;
        }
    
        const startPoint = points[currentIndex];
        const endPoint = points[currentIndex + 1];
        const duration = 2000 /speedMultiplier; // Animation duration in milliseconds
        const startTime = performance.now();

        inBtwPoint = startPoint;
        updateHaltTripDetailsDiv(startPoint);
    
        const startCoord = ol.proj.fromLonLat([startPoint.lon, startPoint.lat]);
        const endCoord = ol.proj.fromLonLat([endPoint.lon, endPoint.lat]);
    
        const lineCoords = [startCoord];
        const lineString = new ol.geom.LineString(lineCoords);

        if( startPoint.movement_status === "Stopped"){
            addHaltPoint(startPoint);
        }
        
        // Determine the style based on the endpoint status
        const isHalt = endPoint.movement_status === "Halting";
        const segmentStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: isHalt ? haltColor : movingColor , // Red for halt, blue for normal
                width: routeWidth,
            }),
        });
    
        // Create the path feature with the determined style
        const pathFeature = new ol.Feature({
            geometry: lineString,
        });
        pathFeature.setStyle(segmentStyle);
        // vectorSource.addFeature(pathFeature);
        pathSource.addFeature(pathFeature);

    
        function interpolatePosition(time) {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1); // Normalize time to [0, 1]
    
            const interpolatedLon = startPoint.lon + (endPoint.lon - startPoint.lon) * t;
            const interpolatedLat = startPoint.lat + (endPoint.lat - startPoint.lat) * t;
            const newCoord = ol.proj.fromLonLat([interpolatedLon, interpolatedLat]);
    
            // Update icon position
            iconFeature.getGeometry().setCoordinates(newCoord);

            const view = map.getView(); // Get the view object
            const viewExtent = view.calculateExtent(map.getSize());
            if (!ol.extent.containsCoordinate(viewExtent, newCoord)) {
                view.setCenter(newCoord)
            }
    
            // Update LineString to include the new coordinate
            lineCoords.push(newCoord);
            lineString.setCoordinates(lineCoords);
    
            if (t < 1) {
                animationFrame = requestAnimationFrame(interpolatePosition);
            } else {
                // Finish animation and move to the next point
                currentIndex++;
                animateToNextPoint();
            }
        }
    
        animationFrame = requestAnimationFrame(interpolatePosition);
    }
    
    // Function to add halt points immediately
    function addHaltPoint(haltPoint) {
        const haltFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([haltPoint.lon, haltPoint.lat])),
            name: 'haltPoints',
            vehicleData : haltPoint,
        });

        haltFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: stopImg,
                    scale: 1,
                }),
            })
        );

        haltSource = new ol.source.Vector({
            features: [haltFeature],
        });

        haltLayer = new ol.layer.Vector({
            source: haltSource,
        });

        haltPointArray.push(haltLayer);
        map.addLayer(haltLayer);

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.cssText = `
        position: absolute;
        background: white;
        color: black;
        border: 1px solid black;
        padding: 5px;
        font-weight: lighter; /* Lighter font weight */
        font-size: 12px;
        display: none;
    `;

        document.body.appendChild(tooltip);

        map.on('pointermove', (event) => {
            const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        
            if (feature && feature.get('name') == "haltPoints") {
                const coords = feature.getGeometry().getCoordinates();
                const name = feature.get('name');
                const fetDetails = feature.get('vehicleData');

                tooltip.innerHTML = `<strong>${fetDetails.vehicle_no}</strong><br>
                                    <strong>${fetDetails.lat}  ${fetDetails.lon}</strong><br>
                                    <strong>${fetDetails.location}</strong><br>
                                    <strong>${fetDetails.stop_duration_in_seconds+' sec'}</strong><br>`;
                tooltip.style.left = `${event.originalEvent.pageX + 10}px`;
                tooltip.style.top = `${event.originalEvent.pageY + 10}px`;
                tooltip.style.display = 'block';
            } else {
                // Hide tooltip
                tooltip.style.display = 'none';
            }
        });
    }
    // Start the animation over tripData
    // animateToNextPoint();
    // addHtmlForHaltTrip();

    const container = document.createElement('div');
container.id = 'checkboxContainer';
container.style.position = 'fixed';
container.style.top = '5%';
container.style.right = '20px';
container.style.width = '30%';
container.style.padding = '10px';
container.style.border = '1px solid #ccc';
container.style.borderRadius = '5px';
container.style.backgroundColor = '#f9f9f9';
container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
container.style.display = 'flex';
container.style.justifyContent = 'space-around';
container.style.flexWrap = 'wrap';
container.style.zIndex = '999'; // Ensure it appears above the map

// Create an array of checkbox options
const options = ['Route Line', 'Route Resources', 'Infobox'];

// Dynamically create checkboxes
options.forEach((option, index) => {
    // Create label
    const label = document.createElement('label');
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    // label.style.margin = '5px';

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `option${index + 1}`;
    // checkbox.style.marginRight = '5px';

    if (index < 2) {
        checkbox.checked = true;
    }

    // Add checkbox and text to label
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(option));

    // Append label to container
    container.appendChild(label);
});

// Append the container to the body
document.body.appendChild(container);

// Add event listeners to checkboxes
document.querySelectorAll('#checkboxContainer input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
        const tableDivId = 'tableContainer';
        if(event.target.id === 'option1'){
            if (event.target.checked){
                pathLayer.setVisible(true)
            }else{
                pathLayer.setVisible(false)
            }
        }
        if(event.target.id === 'option2'){
            if (event.target.checked){
                vectorLayer.setVisible(true);
                markerLayer.setVisible(true);
            }else{
                vectorLayer.setVisible(false);
                markerLayer.setVisible(false);
            }
        }
        if (event.target.id === 'option3') {
            if (event.target.checked) {
                // Create the div with the table if not already present
                if (!document.getElementById(tableDivId)) {
                    const tableDiv = document.createElement('div');
                    tableDiv.id = tableDivId;
                    tableDiv.style.position = 'fixed';
                    tableDiv.style.top = 'calc(5% + 120px)'; // Place below the container
                    tableDiv.style.right = '20px';
                    tableDiv.style.width = '300px';
                    tableDiv.style.padding = '10px';
                    tableDiv.style.border = '1px solid #ccc';
                    tableDiv.style.borderRadius = '5px';
                    tableDiv.style.backgroundColor = '#ffffff';
                    tableDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    tableDiv.style.zIndex = '999'; // Ensure it appears above the map
                    tableDiv.innerHTML = `
                        <table style="font-size: 14px; width: 100%;">
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Vehicle No: </td>
                                <td id="trackresourceDiv"></td>
                            </tr>
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Vehicle Type: </td>
                                <td id="trackcallSignDiv"></td>
                            </tr>
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Position: </td>
                                <td id="trackpositionDiv"></td>
                            </tr>
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Speed: </td>
                                <td id="trackspeedDispDiv"></td>
                            </tr>
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Location: </td>
                                <td id="tracklocationDiv"></td>
                            </tr>
                            <tr style="border-bottom: 1px solid lightgray; padding: 5px;">
                                <td style="font-weight:bold; width: 100px;">Time: </td>
                                <td id="trackdateTimeDiv"></td>
                            </tr>
                        </table>
                    `;
                    document.body.appendChild(tableDiv);
                    updateHaltTripDetailsDiv(inBtwPoint);
                }
            } else {
                // Remove the div with the table if it exists
                const existingDiv = document.getElementById(tableDivId);
                if (existingDiv) {
                    existingDiv.remove();
                }
            }
        }
    });
});
}

function updateHaltTripDetailsDiv(point){

    const resourceDiv = document.getElementById('trackresourceDiv');
    const callSignDiv = document.getElementById('trackcallSignDiv');
    const positionDiv = document.getElementById('trackpositionDiv');
    const speedDiv = document.getElementById('trackspeedDispDiv');
    const locationDiv = document.getElementById('tracklocationDiv');
    const dateTimeDiv = document.getElementById('trackdateTimeDiv');

    if (resourceDiv) {
        resourceDiv.innerHTML = point.vehicle_no;
    }
    if (callSignDiv) {
        callSignDiv.innerHTML = "SWM";
    }
    if (positionDiv) {
        positionDiv.innerHTML = `${point.lat}, ${point.lon}`;
    }
    if (speedDiv) {
        speedDiv.innerHTML = point.speed;
    }
    if (locationDiv) {
        locationDiv.innerHTML = point.location;
    }
    if (dateTimeDiv) {
        dateTimeDiv.innerHTML = point.relevant_date_time;
    }
}