
// **** This function takes latitude,longitude,radius and type of location. It will return the places of specified type within the radius of given location. **** //
/*
tmpl.Search.getLandMarks = function(params){
	var mapObj = params.map;
	var point=params.point;
	var callbackFunc  = params.callbackFunc;
	var custom_poi_type = params.POI_type;
	var dataFrom = params.dataFrom;
	var ignoreRadius = params.ignoreRadius;
	var radius = params.radius;


	try {

		if (mapObj === null || mapObj === undefined) {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Bad Request, Parameter Not a Valid map Object' };
		}
		
		if (point === null || point === undefined || point === '' || point === "") {
			
				return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid point value' };
			}
		
			if (radius === null || radius === undefined || radius === '' || radius === "") {
			
			radius = 80000;
			}

		 if (custom_poi_type === null || custom_poi_type === undefined || custom_poi_type === '' || custom_poi_type === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid custom_poi_type value' };
			}

		 if (dataFrom === null || dataFrom === undefined || dataFrom === '' || dataFrom === "") {
			
			return response = { status: 'false', businesserrorcode: 'TD_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid dataFrom value' };
			}


		 if (ignoreRadius === null || ignoreRadius === undefined || ignoreRadius === '' || ignoreRadius === "") {
			
			ignoreRadius = 80000;
			}

	if (!callbackFunc) {
	return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
}
		

	  } catch (error) {
			if (error instanceof Error) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
			}

	  }


	if(ignoreRadius == undefined){
		
	}else{
		if(ignoreRadius == true){
			radius = 80000;
		}
	}
	var POI_type,keyword;
	if(custom_poi_type == "blood_bank" || custom_poi_type == "blood bank" ){
		keyword = 'blood bank';
		POI_type = 'health';
	}else{
		keyword = ''
		POI_type = custom_poi_type;
	}

	if(appConfigInfo.mapData == 'google'){
		if(dataFrom == 'google' || dataFrom == undefined){
			var searchresult;
		var olGM = new olgm.OLGoogleMaps({map: params.map});
		var gmap = olGM.getGoogleMapsMap();
		//point=point.slice(1,-1);
		//point=point.split(',');
		var coordinate = {lat: parseFloat(point[1]), lng: parseFloat(point[0])};
		var service = new google.maps.places.PlacesService(gmap);
		var resultArray22 = [];
		service.nearbySearch({
			location: coordinate,
			radius: radius,
			type: [POI_type],
			keyword: keyword
		},function googlecallback(results, status){
			//console.log("qq",POI_type,results);
		 var resultArray = [];
			if(results == null){
				var record = {};
				//resultArray.push(record);
				searchresult=false;
			}else{
		   if(results.length == 0){
				var record = {};
				//resultArray.push(record);
				searchresult=false;
			}
			else{
				if (status === google.maps.places.PlacesServiceStatus.OK){
					for (var i = 0; i < results.length ; i++){
						if(results[i] !=undefined){
							var lat=results[i].geometry.location.lat();
							var lng=results[i].geometry.location.lng();
							function deg2rad(deg) {
								return deg * (Math.PI/180)
							}
							var R = 6371; // Radius of the earth in km
							var dLat = deg2rad(lat-point[1]);
							var dLon = deg2rad(lng-point[0]);
							var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
							Math.cos(deg2rad(lat)) * Math.cos(deg2rad(point[1])) *
							Math.sin(dLon/2) * Math.sin(dLon/2);
							var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
							var d = R * c; // Distance in km
							var distance=d.toFixed(2);
							distance = parseFloat(distance);
							var record = {name : results[i].name, lat: parseFloat(lat), lon:parseFloat(lng), distance: distance, poi_type : params.POI_type};
							resultArray22.push(record);
						}
					}
					resultArray22.sort(function(a, b){return a.distance - b.distance});
					//console.log("hhhh",resultArray22);
				}
			}
			var no_of_POIs;
			if(params.Max_num_POIs < results.length){
				no_of_POIs = params.Max_num_POIs;
			}
			else{
				no_of_POIs = results.length;
			}
			for (var i = 0; i < no_of_POIs ; i++){
				resultArray.push(resultArray22[i]);
				searchresult=true;
			}
			}
			//alert("alert from api");
			callbackFunc(resultArray);
		});
		}
		else if(dataFrom == 'trinity'){
				var lon= parseFloat(point[0]);
				var lat= parseFloat(point[1]);
				var maxPOI = params.Max_num_POIs;
				var type ;
				var rsltAry = [];
				var boolianone= false;
				var urlL;
				if(custom_poi_type == "blood_bank"){
					type=10;
				}else if(custom_poi_type == "hospital"){
					type=16;
				}else if(custom_poi_type == "fire_station"){
					type=29;
				}else if(custom_poi_type == "police"){
					type=58;
				}
				else if(custom_poi_type == "all"){
					type=99;
				}
				//var radius = params.radius;
				var rdus = radius;
				var dstncKMtr;
				
					urlL= "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/landmark_search/"+lon+"/"+lat+"/"+maxPOI+"/"+type+"/"+rdus;

				
				$.ajax({
					url:urlL,
					success: function (data) {
						for (var i = 0; i < data.length ; i++){
								dstncKMtr = (data[i].distance)/1000;
								var record = {name : data[i].place, lat: data[i].lat, lon:data[i].lon, distance: dstncKMtr, type:data[i].type  };
							rsltAry.push(record);
						  }
						  //console.log(rsltAry);
						  callbackFunc(rsltAry);
					  
					},
					error: function () {
						console.log("there was an error!");
					},
				});
			}


	}
	else{
		var lon= parseFloat(point[0]);
		var lat= parseFloat(point[1]);
		var maxPOI = params.Max_num_POIs;
		var type ;
		var rsltAry = [];
		var boolianone= false;
		var urlL;
		if(custom_poi_type == "blood_bank"){
			type=10;
		}else if(custom_poi_type == "hospital"){
			type=16;
		}else if(custom_poi_type == "fire_station"){
			type=29;
		}else if(custom_poi_type == "police"){
			type=58;
		}
		else if(custom_poi_type == "all"){
			type=99;
		}
		//var radius = params.radius;
		var rdus = radius;
		var dstncKMtr;
		
			urlL= "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/landmark_search/"+lon+"/"+lat+"/"+maxPOI+"/"+type+"/"+rdus;

		
		$.ajax({
			url:urlL,
			success: function (data) {
				for (var i = 0; i < data.length ; i++){
						dstncKMtr = (data[i].distance)/1000;
						var record = {name : data[i].place, lat: data[i].lat, lon:data[i].lon, distance: dstncKMtr, type: data[i].type };
					rsltAry.push(record);
				  }
				  callbackFunc(rsltAry);
			  
			},
			error: function () {
				console.log("there was an error!");
			},
		});
	}
	return {status : true, message : 'Search.getLandMarks executed successfully'}


}*/

// **** This function takes latitude,longitude. It will return the nearest places of given location. **** //
tmpl.Search.getNearestPlace = function (params) {
	var mapObj = params.map;
	var point = params.point;
	var callbackFunc = params.callbackFunc;

	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid Map Object' };

		}

		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid point value' };
		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}

	}
	if (appConfigInfo.mapData == "google") {
		var resultStatus;
		var x = parseFloat(point[0]);
		var y = parseFloat(point[1]);
		var coordinates = { lat: y, lng: x };
		var result = {};

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'latLng': coordinates
		}, function (results, status) {
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
		});
	} else {
		var rsltAry = [];
		var urlL = "http:" + appConfigInfo.connection.url + "/" + appConfigInfo.connection.project + "/nearest_place/" + point[0] + "/" + point[1] + "/1/3000";

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

	return { status: true, message: 'Search.getNearestPlace executed successfully' }
}


// **** This function will add the Google Search Box to the specified targetDiv and also shows the searched location with animated marker and map will be zoomed to that location. **** //
tmpl.Search.addSearch = function (param) {
	var mapObj = param.map;
	var targetDiv = param.target;
	var resultFun = param.callbackFunc;
	try {
		if (mapObj === null || mapObj === undefined) {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  mapObj' };

		}

		if (targetDiv === null || targetDiv === undefined || targetDiv === '' || targetDiv === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  targetDiv' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}

	}

	if (appConfigInfo.mapData == 'google') {
		if (appConfigInfo.type == 'google') {
			var resultExtent;
			var lon = 0, lat = 0;
			var searchBox = new google.maps.places.SearchBox(document.getElementById(targetDiv));
			var start1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent1));
			var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4), parseFloat(appConfigInfo.extent3));
			var defaultBounds = new google.maps.LatLngBounds();
			defaultBounds.extend(start1);
			defaultBounds.extend(end1);
			searchBox.addListener('places_changed', function () {
				var places = searchBox.getPlaces();
				//var places = searchBox.getPlace();	
				//console.log("places::",places);	
				if (places.length == 0) {
					return;
				}

				// Check if the input length is greater than 3
				console.log("search boxx value ---> ", searchBox);
				// console.log(searchBox.getPlace())
				// console.log(searchBox.getInputElement());
				// console.log( searchBox.getInputElement().value);
				// var inputText = searchBox.getInputElement().value;
				// if (inputText.length > 3) {
				// 	// Send your request here
				// 	// Your request code goes here


				// }

				var bounds = new google.maps.LatLngBounds();
				places.forEach(function (place) {
					console.log("place:", place);
					var x1, y1, x2, y2, placeLocation;
					var arry = [];
					placeLocation = place.geometry.location;
					placeLocation = placeLocation.toString();
					placeLocation = placeLocation.slice(1, -2);
					placeLocation = placeLocation.split(", ");
					var placeName = place.name;
					if (place.geometry.viewport) {
						bounds.union(place.geometry.viewport);
						bounds = bounds.toString();
						bounds = bounds.slice(2, -2);
						bounds = bounds.split("), (");

						x1 = parseFloat(bounds[0].split(",")[0]);
						y1 = parseFloat(bounds[0].split(",")[1]);
						x2 = parseFloat(bounds[1].split(",")[0]);
						y2 = parseFloat(bounds[1].split(",")[1]);
						var extent = [y1, x1, y2, x2];

						if (place.types[0] == 'sublocality_level_1' || place.types[0] == 'sublocality_level_2' || place.types[0] == 'sublocality_level_3' || place.types[0] == 'sublocality_level_4' || place.types[0] == 'sublocality' || place.types[0] == 'subpremise' || place.types[0] == 'neighborhood' || place.types[0] == 'administrative_area_level_1' || place.types[0] == 'administrative_area_level_2' || place.types[0] == 'administrative_area_level_3' || place.types[0] == 'administrative_area_level_4' || place.types[0] == 'administrative_area_level_5' || place.types[0] == 'colloquial_area' || place.types[0] == 'locality' || place.types[0] == 'political' || place.types[0] == 'country') {
							resultExtent = extent;
						}
						else {
							resultExtent = null;
						}
						searchBox.setBounds(defaultBounds);
						console.log("placeLocation:", placeLocation)
						var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: resultExtent };
						arry.push(rec);
						console.log(arry);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						console.log("placeLocation:::", lon, lat);
						if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
							if (resultFun) {
								return resultFun(placeLocation[1], placeLocation[0], resultExtent, placeName);
							} else {
								return getLatLonDetails(placeLocation[1], placeLocation[0], resultExtent, placeName);
							}

						}
						else {
							if (resultFun) {
								return resultFun(placeLocation[1], placeLocation[0], resultExtent, placeName);
							} else {
								return getLatLonDetails(placeLocation[1], placeLocation[0], resultExtent, placeName);
							}
							//alert("Searched Place is Out Of Project Area....");
						}
					}
					else {
						bounds.extend(place.geometry.location);
						var ext = null;
						searchBox.setBounds(bounds);
						var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: ext };
						arry.push(rec);
						lat = parseFloat(placeLocation[0]);
						lon = parseFloat(placeLocation[1]);
						var jsonString = JSON.stringify(arry);
						if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
							return getLatLonDetails(placeLocation[1], placeLocation[0], ext, placeName);
						}
						else {
							return getLatLonDetails('', '', '', '');
						}
					}
				});
			});
		} else if (appConfigInfo.type == 'esri') {
			try {
				var place = "";
				var sdiv = document.createElement('div');
				sdiv.className = 'search-wrapper';
				sdiv.id = targetDiv;
				var input = document.createElement('input');
				input.type = 'text';
				input.id = targetDiv;
				if (appConfigInfo.ln == 'ar') {
					input.placeholder = 'بحث';
				} else {
					input.placeholder = "Search";
				}

				input.className = 'controls1';
				sdiv.appendChild(input);

				var rst = document.createElement('button');
				rst.className = 'close-icon';

				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					sdiv.appendChild(zoomButton);
				}
				input.onkeyup = function () {
					sdiv.appendChild(rst);
					if (this.value.length == 0) {
						if (clearCallbackFunc != undefined) {
							clearCallbackFunc();
						}
					}
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				}
				try {
					input.onkeypress = function () {
						sdiv.appendChild(rst);
						rst.style.visibility = (this.value.length) ? "visible" : "hidden";
					};
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
				rst.onclick = function () {
					try {
						console.log("Reset button clicked");
						this.style.visibility = "hidden";
						place = "";
						input.value = "";
						removeAddSearchMarker(mapObj);
						input.focus();
						console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
						tmpl.Zoom.toExtent({
							map: mapObj,
							extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
						});
						if (closeCallbackFunc != undefined) {
							closeCallbackFunc();
						}
					}
					catch (errr) {
						console.log("errr: " + errr);
					}
				};
				var srchb = new ol.control.Control({
					element: sdiv
				});
				mapObj.addControl(srchb);
				//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

				var options = {
					url: function (phrase) {
						return appConfigInfo.esriPlaceSearch + "/findAddressCandidates?SingleLine=" + phrase + "&searchExtent=" + appConfigInfo.extent1 + "," + appConfigInfo.extent2 + ";" + appConfigInfo.extent3 + "," + appConfigInfo.extent4 + "&f=json";
					},
					getValue: function (element) {
						return element.placeName
					},
					ajaxSettings: {
						method: "GET",
						timeout: 0,
						headers: {
							"Content-Type": "application/json"
						},
						success: function (response) {
							if (response.candidates) {
								response.data = response.candidates.map(candidate => ({
									placeName: candidate.address,
									placeAddress: "Lat: " + candidate.location.y + ", Lon: " + candidate.location.x,
									entryLatitude: candidate.location.y,
									entryLongitude: candidate.location.x
								}));
							}
						},
						error: function (error) {
							console.error("Error:", error);
						}
					},
					listLocation: "data",
					preparePostData: function (data) {
						if (!data) data = {};
						data.phrase = $("#" + targetDiv).val();
						console.log("Data sent in the request:", data);
						let ul = document.getElementById('eac-container-trinitySearch');
						if (data.phrase.length > 0) {
							ul.style.display = 'block';
							ul.style.backgroundColor = 'white';
						}
						return data;
					},
					list: {
						onChooseEvent: function () {
							let selectedItem = $("#" + targetDiv).getSelectedItemData();
							console.log("Selected Item:", selectedItem);

							place = selectedItem.placeName
							var lat = selectedItem.entryLatitude;
							var lon = selectedItem.entryLongitude;

							zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);

							if (zoom_button === true) {
								zoomButton.onclick = function () {
									if (place != null && place != undefined && place != "") {
										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
									}
								};
							}

							if (callbackFunc) {
								var rec = { lat: parseFloat(lat), lon: parseFloat(lon), address: place };
								callbackFunc(rec);
							}
						}
					},
					requestDelay: 400
				};

				try {
					$("#" + targetDiv).easyAutocomplete(options);
				} catch (e) {
					console.log("API Response issue here:", e);
				}
			} catch (e) {
				console.log("API Responce issue here..", e);
			}
		}

	} else if (appConfigInfo.mapData == 'trinity') {
		var items;
		var elocdata;
		let accessTokenCode;
		var zoom_button = true;

		setTimeout(function () {
			try {

				tmpl.Utils.getTrinityToken({
					callbackFunc: function (accessToken) {
						var token = accessToken.data.access_token
						console.log("access_token :::::::::::::::::::::::::", token)
						var sdiv = document.createElement('div');
						sdiv.className = 'search-wrapper';
						sdiv.id = targetDiv;
						var input = document.createElement('input');
						input.type = 'text';
						input.id = targetDiv;
						input.placeholder = "Search";
						input.className = 'controls1';
						sdiv.appendChild(input);

						var rst = document.createElement('button');
						rst.className = 'close-icon';

						if (zoom_button == true) {
							zoomButton = document.createElement('button');
							zoomButton.className = 'zoom_btn';
							sdiv.appendChild(zoomButton);
						}
						input.onkeyup = function () {
							sdiv.appendChild(rst);
							if (this.value.length == 0) {
								if (clearCallbackFunc != undefined) {
									clearCallbackFunc();
								}
							}
							rst.style.visibility = (this.value.length) ? "visible" : "hidden";
						}
						try {
							input.onkeypress = function () {
								sdiv.appendChild(rst);
								rst.style.visibility = (this.value.length) ? "visible" : "hidden";
							};
						}
						catch (errr) {
							console.log("errr: " + errr);
						}
						rst.onclick = function () {
							try {
								console.log("Reset button clicked");
								this.style.visibility = "hidden";
								input.value = "";
								removeAddSearchMarker(mapObj);
								input.focus();
								tmpl.Zoom.toExtent({
									map: mapObj,
									extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
								});
								if (closeCallbackFunc != undefined) {
									closeCallbackFunc();
								}
							}
							catch (errr) {
								console.log("errr: " + errr);
							}
						};
						var srchb = new ol.control.Control({
							element: sdiv
						});
						mapObj.addControl(srchb);
						//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

						var options = {
							url: function (phrase) {
								return appConfigInfo.mmi_search_devurl + phrase + "&filter=cop:fo2y7s";

							},
							getValue: function (element) {
								console.log("Element....", element);
								var my_value = element.placeAddress;//+ ' :-> ' + element.placeAddress;
								return my_value;
							},

							ajaxSettings: {
								method: "GET",
								timeout: 0,
								headers: {
									"accept": "*/*",
									"Authorization": "Bearer " + token
								},
								success: function (response) {
									console.log("API Response", response);
									var items = response.suggestedLocations;
									response.data = items;
								},
								error: function (error) {
									console.error("Error:", error);
								}
							},
							listLocation: "data",
							preparePostData: function (data) {
								if (!data) {
									// If data is undefined, create an empty object
									data = {};
								}
								data.phrase = $("#" + targetDiv).val();
								console.log("Data sent in the request:", data);
								return data;
							},
							list: {
								onChooseEvent: function () {
									console.log("-------------->", $("#" + targetDiv).getSelectedItemData().placeAddress);

									var locationcode = $("#" + targetDiv).getSelectedItemData().eLoc;
									let place = $("#" + targetDiv).getSelectedItemData().placeAddress;

									function getLocationData(locationcode) {
										return new Promise(function (resolve, reject) {
											var settings = {
												"url": appConfigInfo.mmi_eloc_devurl + locationcode,
												"method": "GET",
												"timeout": 0,
												"headers": {
													"accept": "*/*",
													"Authorization": "Bearer " + token
												},
											};

											$.ajax(settings).done(function (response) {
												console.log(response);
												resolve(response);
											}).fail(function (error) {
												reject(error);
											});
										});
									}

									// Use the promise to get location data
									getLocationData(locationcode).then(function (elocdata) {
										var lat = elocdata.latitude;
										var lon = elocdata.longitude;


										// place = place + ":" + $("#trinitySearch").getSelectedItemData().placeAddress;	

										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, null, null);



										if (zoom_button == true) {
											zoomButton.onclick = function () {
												zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
											};
										}

										if (callbackFunc) {
											var rec = { lat: parseFloat(lat), lon: parseFloat(lon), addres: place };
											callbackFunc(rec);
										}
									}).catch(function (error) {
										console.error("Error fetching location data:", error);
									});
								}
							},
							requestDelay: 400
						};

						try {

							$("#" + targetDiv).easyAutocomplete(options);

						} catch (e) {
							console.log("API Responce issue here1..", e);
						}
					}
				});
			} catch (e) {
				console.log("API Responce issue here..", e);
			}
		}, 1000);
	} else if (appConfigInfo.mapData == 'mmi') {
		let accessTokenCode;
		var zoom_button = true;


		setTimeout(function () {
			try {

				tmpl.Utils.getMMIAccessToken({
					callbackFunc: function (accessToken) {
						var sdiv = document.createElement('div');
						sdiv.className = 'search-wrapper';
						sdiv.id = targetDiv;
						var input = document.createElement('input');
						input.type = targetDiv;
						input.id = 'trinitySearch';
						input.placeholder = "Search";
						input.className = 'controls1';
						sdiv.appendChild(input);

						var rst = document.createElement('button');
						rst.className = 'close-icon';

						if (zoom_button == true) {
							zoomButton = document.createElement('button');
							zoomButton.className = 'zoom_btn';
							sdiv.appendChild(zoomButton);
						}
						input.onkeyup = function () {
							sdiv.appendChild(rst);
							if (this.value.length == 0) {
								if (clearCallbackFunc != undefined) {
									clearCallbackFunc();
								}
							}
							rst.style.visibility = (this.value.length) ? "visible" : "hidden";
						}
						try {
							input.onkeypress = function () {
								sdiv.appendChild(rst);
								rst.style.visibility = (this.value.length) ? "visible" : "hidden";
							};
						}
						catch (errr) {
							console.log("errr: " + errr);
						}
						rst.onclick = function () {
							try {
								console.log("Reset button clicked");
								this.style.visibility = "hidden";
								input.value = "";
								removeAddSearchMarker(mapObj);
								input.focus();
								console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
								tmpl.Zoom.toExtent({
									map: mapObj,
									extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
								});
								if (closeCallbackFunc != undefined) {
									closeCallbackFunc();
								}
							}
							catch (errr) {
								console.log("errr: " + errr);
							}
						};
						var srchb = new ol.control.Control({
							element: sdiv
						});
						mapObj.addControl(srchb);
						//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

						var options = {
							url: function (phrase) {
								return appConfigInfo.mmi_search + "?query=" + phrase;
							},
							getValue: function (element) {
								console.log("Element....", element);
								var my_value = element.placeName + ',' + element.placeAddress;//+ ' :-> ' + element.placeAddress;
								return my_value;
							},

							ajaxSettings: {
								method: "GET",
								timeout: 0,
								headers: {
									"Content-Type": "application/json",
									"Authorization": "bearer " + accessToken.data.access_token
								},
								success: function (response) {
									console.log("API Response", response);
									var items = response.suggestedLocations;
									response.data = items;
								},
								error: function (error) {
									console.error("Error:", error);
								}
							},
							listLocation: "data",
							preparePostData: function (data) {
								if (!data) {
									// If data is undefined, create an empty object
									data = {};
								}
								data.phrase = $("#" + targetDiv).val();
								console.log("Data sent in the request:", data);
								return data;
							},
							list: {
								onChooseEvent: function () {
									console.log("-------------->", $("#" + targetDiv).getSelectedItemData().placeName, $("#" + targetDiv).getSelectedItemData().placeAddress);

									let place = $("#" + targetDiv).getSelectedItemData().placeName + ',' + $("#" + targetDiv).getSelectedItemData().placeAddress;
									var lat = $("#" + targetDiv).getSelectedItemData().entryLatitude;
									var lon = $("#" + targetDiv).getSelectedItemData().entryLongitude;



									zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, null, null, null);

									if (zoom_button == true) {
										zoomButton.onclick = function () {
											zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
										};
									}

									if (callbackFunc) {
										var rec = { lat: parseFloat(lat), lon: parseFloat(lon), addres: place };
										callbackFunc(rec);
									}


								}
							},
							requestDelay: 400
						};

						try {

							$("#" + targetDiv).easyAutocomplete(options);

						} catch (e) {
							console.log("API Responce issue here1..", e);
						}
					}
				});
			} catch (e) {
				console.log("API Responce issue here..", e);
			}
		}, 1000);

	}
	return { status: true, message: 'Search.addSearch executed successfully' }

}



// tmpl.Search.addSearch = function(param){
// 		var mapObj = param.map;
// 	   var targetDiv = param.target;

// 	if(appConfigInfo.mapData == 'google')
// 	{
// 		var resultExtent;
// 		var lon=0,lat=0;
// 		var searchBox = new google.maps.places.SearchBox(document.getElementById(targetDiv));
// 		var start1 = new google.maps.LatLng(parseFloat(appConfigInfo
// 		.extent2),parseFloat(appConfigInfo.extent1));
// 		var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4),parseFloat(appConfigInfo.extent3));
// 		var defaultBounds = new google.maps.LatLngBounds();
// 		defaultBounds.extend(start1);
// 		defaultBounds.extend(end1);
// 		//searchBox.setBounds(defaultBounds);
// 		searchBox.addListener('places_changed', function(){
// 			var places = searchBox.getPlaces();
// 			if (places.length == 0){
// 				return;
// 			}
// 			var bounds = new google.maps.LatLngBounds();
// 			places.forEach(function(place){
// 				var x1,y1,x2,y2,placeLocation;
// 				var arry = [];
// 				placeLocation = place.geometry.location;
// 				placeLocation = placeLocation.toString();
// 				placeLocation = placeLocation.slice(1,-2);
// 				placeLocation = placeLocation.split(", ");
// 				var placeName = place.name;
// 				if (place.geometry.viewport){
// 					bounds.union(place.geometry.viewport);
// 					bounds=bounds.toString();
// 					bounds=bounds.slice(2,-2);
// 					bounds=bounds.split("), (");
// 					x1=parseFloat(bounds[0].split(",")[0]);
// 					y1=parseFloat(bounds[0].split(",")[1]);
// 					x2=parseFloat(bounds[1].split(",")[0]);
// 					y2=parseFloat(bounds[1].split(",")[1]);
// 					var extent =[y1,x1,y2,x2];
// 					if(place.types[0] == 'sublocality_level_1' || place.types[0] == 'sublocality_level_2' || place.types[0] == 'sublocality_level_3' ||place.types[0] == 'sublocality_level_4' || place.types[0] == 'sublocality'  || place.types[0] == 'subpremise' || place.types[0] == 'neighborhood' || place.types[0] == 'administrative_area_level_1' || place.types[0] == 'administrative_area_level_2' || place.types[0] == 'administrative_area_level_3' || place.types[0] == 'administrative_area_level_4' || place.types[0] == 'administrative_area_level_5' || place.types[0] == 'colloquial_area' || place.types[0] == 'locality' || place.types[0] == 'political' || place.types[0] == 'country' ){
// 						resultExtent = extent;
// 					}
// 					else{
// 						resultExtent = null;
// 					}
// 					searchBox.setBounds(defaultBounds);
// 					var rec = {lat: parseFloat(placeLocation[0]), lon:parseFloat(placeLocation[1]), extend:resultExtent};
// 					arry.push(rec);
// 					//console.log(arry);
// 					lat = parseFloat(placeLocation[0]);
// 					lon = parseFloat(placeLocation[1]);
// 					var jsonString = JSON.stringify(arry);
// 					//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
// 						return getLatLonDetails(placeLocation[1],placeLocation[0],resultExtent,placeName);
// 					//}
// 					//else{
// 					//	return getLatLonDetails('','','','');
// 						//alert("Searched Place is Out Of Project Area....");
// 					//}
// 				}
// 				else{
// 					bounds.extend(place.geometry.location);
// 					var ext=null;
// 					searchBox.setBounds(bounds);
// 					var rec = {lat: parseFloat(placeLocation[0]), lon:parseFloat(placeLocation[1]), extend:ext};
// 					arry.push(rec);
// 					lat = parseFloat(placeLocation[0]);
// 					lon = parseFloat(placeLocation[1]);
// 					var jsonString = JSON.stringify(arry);
// 					//if(lat>appConfigInfo.extent2 && lat<appConfigInfo.extent4 && lon>appConfigInfo.extent1 && lon<appConfigInfo.extent3){
// 						return getLatLonDetails(placeLocation[1],placeLocation[0],ext,placeName);
// 					//}
// 					//else{
// 					//	return getLatLonDetails('','','','');
// 						//alert("Searched Place is Out Of Project Area....");
// 					//}
// 				}
// 			});
// 		});
// 	}

// 	 else if (appConfigInfo.mapData == 'pentab') {
//             var sdiv = document.createElement('div');
//             sdiv.className = 'search-wrapper';
//             sdiv.id = 'searchBox';
//             var input = document.createElement('input');
//             input.type = 'text';
//             input.id = 'trinitySearch';
//             //input.placeholder = "Search";
// 			if(appConfigInfo.ln==='ar'|| appConfigInfo.ln =='ar'){
// 				//$('.ol-Search').attr('placeholder','بحث');
// 				input.placeholder = "بحث";
// 			}
// 			else{
// 				input.placeholder = "Search";
// 			}
//             input.className = 'controls1';
//             sdiv.appendChild(input);

//             var rst = document.createElement('button');
//             rst.className = 'close-icon';

//             if (zoom_button == true) {
//                 zoomButton = document.createElement('button');
//                 zoomButton.className = 'zoom_btn';
//                 sdiv.appendChild(zoomButton);
//             }
//             input.onkeyup = function () {
//                 sdiv.appendChild(rst);
//                 if (this.value.length == 0) {
//                     if (clearCallbackFunc != undefined) {
//                         clearCallbackFunc();
//                     }
//                 }
//                 rst.style.visibility = (this.value.length) ? "visible" : "hidden";
//             }
//             try {
//                 input.onkeypress = function () {
//                     sdiv.appendChild(rst);
//                     rst.style.visibility = (this.value.length) ? "visible" : "hidden";
//                 };
//             }
//             catch (errr) {
//                 console.log("errr: " + errr);
//             }
//             rst.onclick = function () {
//                 try {
//                     this.style.visibility = "hidden";
//                     input.value = "";
//                     removeAddSearchMarker(mapObj);
//                     input.focus();
//                     if (closeCallbackFunc != undefined) {
//                         closeCallbackFunc();
//                     }
//                 }
//                 catch (errr) {
//                     console.log("errr: " + errr);
//                 }
//             };
//             var srchb = new ol.control.Control({
//                 element: sdiv
//             });
//             mapObj.addControl(srchb);

//             //let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

//             $("#trinitySearch").autocomplete({
//                 source: fullACbox,
//                 minLength: 2,
//                 // delay: 500,
//                 select: function (event, ui) {
//                     console.log("ON SELECT EVENT ===> ", event);
//                     console.log("ON SELECT ui ===> ", ui);
//                     let searchResult = null;
//                     let place = ui.item.label;
//                     let geometry = ui.item.geometry;
//                     geometry = JSON.parse(geometry);
//                     console.log("Search geometry ===> ", geometry, geometry.coordinates);
//                     zoomToSearch(mapObj, parseFloat(geometry.coordinates[0]), parseFloat(geometry.coordinates[1]), null, place, img_url, height, width);

//                 }

//             });

//             function fullACbox(query, callback) {
//                 console.log("call");


//                 var settings = {
//                     "url": appConfigInfo.pentaBAPIService + "/findCandidates",
//                     "method": "POST",
//                     "timeout": 0,
//                     "headers": {
//                         "PentaUserRole": appConfigInfo.PentaUserRole,
//                         "PentaOrgID": appConfigInfo.PentaOrgID,
//                         "PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
//                         "Authorization": localStorage.getItem('pentaBAccessToken'),
//                         "Content-Type": "application/json"
//                     },
//                     "data": JSON.stringify([{ "tables": [{ "searchField": "text", "tableName": "public.buildings_materialized_view" }, { "searchField": "text", "tableName": "public.streets_materialized_view" }, { "searchField": "text", "tableName": "public.landmarks_materialized_view" }], "searchText": "polic", "crs": "EPSG:4326", "limit": 5, "dataSource": { "id": 12 } }]),
//                 };

//                 $.ajax(settings).done(function (data) {
//                     console.log(data);
//                     if (data) {
//                         console.log("------>", data);
//                         var places = data[0];
//                         //var places = data[0].filter(function(place){return place.vicinity});
//                         places = places.map(function (place) {
//                             console.log("--->", places);
//                             return {
//                                 title: place.display_data_en,
//                                 //value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
//                                 value: place.display_data_en,
//                                 geometry: place.centroid_geom
//                             };
//                         });
//                         console.log("---", places);
//                         return callback(places);
//                     }
//                 });

//             }

//         }

// 	else if(appConfigInfo.mapData =='hereMaps')
// 	{
// 		// Combination of both Address and Place autocomplete

// 		function fullAC(query, callback) {

// 			let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;
// 		   $.getJSON("https://places.cit.api.here.com/places/v1/autosuggest?at=" + coordinates + "&q=" + query.term + "&app_id=" + appConfigInfo.hereMapsAppID+ "&app_code=" + appConfigInfo.hereMapsAppCode, function (data) {
// 				//var places = data.results.filter(place => place.vicinity);
// 				var places = data.results.filter(function(place){ return place.vicinity });
// 				places = places.map(function(place){
// 					return {
// 						title: place.title,
// 						value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
// 						id: place.id
// 					};
// 				});
// 				console.log(places);
// 				return callback(places);
// 			});

// 			}


// 			//$("#"+targetDiv).easyAutocomplete(options);
// 			$("#"+targetDiv).autocomplete({
// 			source: fullAC,
// 			minLength: 2,
// 			select: function (event, ui) {

// 						let searchResult=null;
// 						let place = ui.item.value;
// 						let placeid = ui.item.id;    

// 			 let ur = "http://geocoder.api.here.com/6.2/geocode.json?app_id=" + appConfigInfo.hereMapsAppID + "&app_code=" + appConfigInfo.hereMapsAppCode+"&searchtext="+place;
// 				 $.ajax({url: ur, success: function(result){
// 				 searchResult = result;
// 				 searchResult.lon = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
// 				 searchResult.lat = searchResult.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
// 				  getLatLonDetails(searchResult.lon,searchResult.lat,null,place);
// 			}});
// 					 //console.log("lat lon:",searchResult.lon,searchResult.lat);
// 					//console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);

// 			}

// 			});


// 	}


// 	else
//   {
//     var options = {
//       url: function(phrase) {    
//           var p  = phrase;
//           return "http:"+appConfigInfo.connection.url+"/"+appConfigInfo.connection.project+"/place_search/text/"+phrase+"/10";
//         },
//       getValue: "place",
//       ajaxSettings: {
//           dataType: "json",
//           method: "GET",
//           data: {
//             dataType: "json"
//           }
//         },
//       preparePostData: function(data) {
//           data.phrase = $("#"+targetDiv).val();
//           return data;
//         },
//       list: {
//           onChooseEvent: function() {

//                 var lat = $("#"+targetDiv).getSelectedItemData().lat;
//                 var lon = $("#"+targetDiv).getSelectedItemData().lon;
//                 var place = $("#"+targetDiv).getSelectedItemData().place;

//                 var resultArray =[];
//                 var rec = {name : place, lat: parseFloat(lat), lon:parseFloat(lon)};
//                 resultArray.push(rec); 
//                 var jsonString = JSON.stringify(resultArray);
//                // Zooming to the selected location
//                //zoomToSearch(mapObj,parseFloat(lon),parseFloat(lat),null,place);    
//                 getLatLonDetails(parseFloat(lon),parseFloat(lat),null,place);
//               }         
//             },
//       requestDelay: 400
//     };
//     $("#"+targetDiv).easyAutocomplete(options);
//   }

//   return {status : true, message : 'Search.addSearch executed successfully'}

// }


// **** This function will add the Google Search Box on the map and also shows the searched location with animated marker and map will be zoomed to that location. **** //

tmpl.Search.clearSearchBox = function (param) {
	let mapObj = param.map;
	placeLocation[0], placeLocation[1] = "";
	let clearElement = document.getElementsByClassName('close-icon')[0];
	clearElement.style.visibility = "hidden";
	let input = document.getElementsByClassName('controls1')[0];
	input.value = "";
	removeAddSearchMarker(mapObj);
	input.focus();
	tmpl.Zoom.toExtent({
		map: mapObj,
		extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
	});
};

var placeLocation = []

tmpl.Search.addSearchBox = function (param) {

	var zoomButton = [];
	var mapObj = param.map;
	var height = param.height;
	var width = param.width;
	var img_url = param.img_url;
	var callbackFunc = param.callbackFunc;
	var closeCallbackFunc = param.closeCallbackFunc;
	var clearCallbackFunc = param.clearCallbackFunc;
	var restriction = param.restriction;
	var zoom_button = param.zoom_button;
	var search_button = param.search_button ? param.search_button : false;
	var withInFlag = true;

	// try {

	// 	if (mapObj === null || mapObj === undefined) {

	// 		return response = { status: 'false', businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  Map Object..!' };
	// 	}

	// 	if (img_url === null || img_url === undefined || img_url === '' || img_url === "") {

	// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  img_url' };
	// 	}

	// 	if (height === null || height === undefined || height === '' || height === "") {

	// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  height' };
	// 	}

	// 	if (width === null || width === undefined || width === '' || width === "") {

	// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  width' };
	// 	}

	// 	if (zoom_button === null || zoom_button === undefined || zoom_button === '' || zoom_button === "") {

	// 		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  zoom_button value' };
	// 	}

	// } catch (error) {
	// 	if (error instanceof Error) {
	// 		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
	// 	}
	// }

	if (appConfigInfo.mapLib == 'ol7') {
		if (appConfigInfo.mapData == 'google') {

			if (appConfigInfo.type == 'google') {
				var resultExtent;
				var lon = 0, lat = 0;
				var searchDiv = document.createElement('div');
				searchDiv.className = 'search-wrapper';
				if (search_button == true) {
					searchButton = document.createElement('button');
					searchButton.className = 'search_btn';
					searchDiv.appendChild(searchButton);
				}
				var input = document.createElement('input');
				input.type = 'text';
				input.placeholder = "Search";
				input.className = 'controls1';
				searchDiv.appendChild(input);

				var resetButton = document.createElement('button');
				resetButton.className = 'close-icon';
				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					searchDiv.appendChild(zoomButton);
				}

				input.onkeyup = function () {
					searchDiv.appendChild(resetButton);
					if (this.value.length == 0) {
						if (clearCallbackFunc != undefined) {
							clearCallbackFunc();
						}
					}
					resetButton.style.visibility = (this.value.length) ? "visible" : "hidden";
				};
				resetButton.onclick = function () {
					placeLocation[0], placeLocation[1] = "";
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					input.focus();
					tmpl.Zoom.toExtent({
						map: mapObj,
						extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
					});

					if (closeCallbackFunc != undefined) {
						closeCallbackFunc();
					}
				};
				var searchControl = new ol.control.Control({
					element: searchDiv
				});
				mapObj.addControl(searchControl);
				var searchBox = new google.maps.places.Autocomplete(input);
				searchBox.setFields(['address_components', 'formatted_address', 'geometry', 'icon', 'name']);
				var start1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent2), parseFloat(appConfigInfo.extent1));
				var end1 = new google.maps.LatLng(parseFloat(appConfigInfo.extent4), parseFloat(appConfigInfo.extent3));
				var defaultBounds = new google.maps.LatLngBounds();
				defaultBounds.extend(start1);
				defaultBounds.extend(end1);
				searchBox.setBounds(defaultBounds);
				searchBox.addListener('place_changed', function () {
					var places = searchBox.getPlace();
					console.log("Place from API ====> ", places);
					if (places.length == 0) {
						return;
					}
					var bounds = new google.maps.LatLngBounds();

					try {
						places = [places];
						places.forEach(function (place) {
							var x1, y1, x2, y2;
							var arry = [];
							placeLocation = place.geometry.location;
							placeLocation = placeLocation.toString();
							placeLocation = placeLocation.slice(1, -2);
							placeLocation = placeLocation.split(", ");
							var selectedName = place.name;
							var selectedFormattedAddress = place.formatted_address
							var placeName = selectedName + ',' + selectedFormattedAddress;
							if (place.geometry.viewport) {

								//bounds.union(place.geometry.viewport);
								bounds = bounds.toString();
								bounds = bounds.slice(2, -2);
								bounds = bounds.split("), (");
								x1 = parseFloat((bounds[0].split(","))[0]);
								y1 = parseFloat((bounds[0].split(","))[1]);
								x2 = parseFloat((bounds[1].split(","))[0]);
								y2 = parseFloat((bounds[1].split(","))[1]);
								var extent = [y1, x1, y2, x2];
								if (place.address_components[0].types == 'sublocality_level_1' || place.address_components[0].types == 'sublocality_level_2' || place.address_components[0].types == 'sublocality_level_3' || place.address_components[0].types == 'sublocality_level_4' || place.address_components[0].types == 'sublocality' || place.address_components[0].types == 'subpremise' || place.address_components[0].types == 'neighborhood' || place.address_components[0].types == 'administrative_area_level_1' || place.address_components[0].types == 'administrative_area_level_2' || place.address_components[0].types == 'administrative_area_level_3' || place.address_components[0].types == 'administrative_area_level_4' || place.address_components[0].types == 'administrative_area_level_5' || place.address_components[0].types == 'colloquial_area' || place.address_components[0].types == 'locality' || place.address_components[0].types == 'political' || place.address_components[0].types == 'country') {
									resultExtent = extent;
								}
								else {
									resultExtent = null;
								}
								var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: resultExtent, address: placeName };
								arry.push(rec);
								console.log("Searched Location:", rec);
								var lat = parseFloat(placeLocation[0]);
								var lon = parseFloat(placeLocation[1]);
								var jsonString = JSON.stringify(arry);
								if (restriction == true) {
									if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
										withInFlag = true;
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
										if (zoom_button == true) {
											zoomButton.onclick = function () {
												if (withInFlag == true) {
													if (placeLocation[1] != "") {
														zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
													}
												}
											};
										}
										if (callbackFunc) {
											var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), address: placeName }
											callbackFunc(rec);
										}
									}
									else {
										withInFlag = false;
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
										if (callbackFunc) {
											var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), address: placeName };
											callbackFunc(rec);
										}
									}
								} else {
									zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
									if (zoom_button == true) {
										zoomButton.onclick = function () {
											if (withInFlag == true) {
												if (placeLocation[1] != "") {
													zoomToSearch(mapObj, placeLocation[1], placeLocation[0], resultExtent, placeName, img_url, height, width);
												}
											}
										};
									}
									if (callbackFunc) {
										var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), address: placeName }
										callbackFunc(rec);
									}
								}

							}
							else {
								bounds.extend(place.geometry.location);
								var ext = null;
								var lat = parseFloat(placeLocation[0]);
								var lon = parseFloat(placeLocation[1]);
								var rec = { lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), extend: ext, address: placeName };
								arry.push(rec);
								var jsonString = JSON.stringify(arry);
								if (restriction == true) {
									if (lat > appConfigInfo.extent2 && lat < appConfigInfo.extent4 && lon > appConfigInfo.extent1 && lon < appConfigInfo.extent3) {
										withInFlag = true;
										zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
										if (zoom_button == true) {
											zoomButton.onclick = function () {
												if (withInFlag == true) {
													zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
												}
											};
										}
										if (callbackFunc) {
											var rec = { status: true, lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), address: placeName }
											callbackFunc(rec);
										}
									}
									else {
										withInFlag = false;
										if (callbackFunc) {
											var rec = { status: false, lat: '', lon: '' }
											callbackFunc(rec);
										}
									}
								} else {
									zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
									if (zoom_button == true) {
										zoomButton.onclick = function () {
											if (withInFlag == true) {
												zoomToSearch(mapObj, placeLocation[1], placeLocation[0], ext, placeName, img_url, height, width);
											}
										};
									}
									if (callbackFunc) {
										var rec = { status: true, lat: parseFloat(placeLocation[0]), lon: parseFloat(placeLocation[1]), address: placeName }
										callbackFunc(rec);
									}
								}
							}
						});
					}
					catch (e) {
						//console.log("Error:"+e);
						response = { status: false, businesserrorcode: 'TB_GISSDK_0x008', developererrorcode: 'TD_GISSDK_0x008', message: e.message };

					}

				});
			} else if (appConfigInfo.type == 'osm') {
				var place= "";
				var sdiv = document.createElement('div');
				sdiv.className = 'search-wrapper';
				sdiv.id = 'searchBox';
				var input = document.createElement('input');
				input.type = 'text';
				input.id = 'trinitySearch';
				input.placeholder = "Search";
				input.className = 'controls1';
				sdiv.appendChild(input);

				var rst = document.createElement('button');
				rst.className = 'close-icon';

				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					sdiv.appendChild(zoomButton);
				}
				input.onkeyup = function () {
					sdiv.appendChild(rst);
					if (this.value.length == 0) {
						if (clearCallbackFunc != undefined) {
							clearCallbackFunc();
						}
					}
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";
				}
				try {
					input.onkeypress = function () {
						sdiv.appendChild(rst);
						rst.style.visibility = (this.value.length) ? "visible" : "hidden";
					};
				}
				catch (errr) {
					console.log("errr: " + errr);
				}
				rst.onclick = function () {
					try {
						console.log("Reset button clicked");
						this.style.visibility = "hidden";
						input.value = "";
						place = "";
						removeAddSearchMarker(mapObj);
						input.focus();
						//console.log("extens ===",appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
						tmpl.Zoom.toExtent({
							map: mapObj,
							extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
						});
						if (closeCallbackFunc != undefined) {
							closeCallbackFunc();
						}
					}
					catch (errr) {
						console.log("errr: " + errr);
					}
				};
				var srchb = new ol.control.Control({
					element: sdiv
				});
				mapObj.addControl(srchb);
				var options = {
					url: function (phrase) {
						var formattedPhrase = phrase.replace(/\s+/g, "+");
						console.log("formatted Phrase", formattedPhrase);
						let ul = document.getElementById('eac-container-trinitySearch');
						let searchElemet = document.getElementsByClassName('search-wrapper')[0];
						if(formattedPhrase.length > 0){								
							ul.style.display = 'block';
							searchElemet.style.setProperty('background-color', '#3c3c3c', 'important');
							searchElemet.style.setProperty('color', '#FFFFFF', 'important');
						}
						return appConfigInfo.osm_search + formattedPhrase + "&format=json&addressdetails=5&viewbox=" + appConfigInfo.extent1 + "," + appConfigInfo.extent2 + "," + appConfigInfo.extent3 + "," + appConfigInfo.extent4 + "&bounded=1";
					},
					getValue: function (element) {
						return element.display_name || "No address available";
					},
					ajaxSettings: {
						method: "GET",
						timeout: 0,
						headers: {
							"Content-Type": "application/json",
						},
						success: function (response) {
							//console.log("API Response", response);  
							if (Array.isArray(response)) {

								response.data = response.map(item => ({
									display_name: item.display_name,
									lat: item.lat,
									lon: item.lon
								}));
							} else {
								console.error("Expected an array in the response");
								response.data = [];
							}
						},
						error: function (error) {
							console.error("Error:", error);
						}
					},
					listLocation: "data",
					list: {
						onChooseEvent: function () {

							var selectedItem = $("#trinitySearch").getSelectedItemData();
							if (selectedItem) {
								var place = selectedItem.display_name;
								var lat = selectedItem.lat;
								var lon = selectedItem.lon;

								zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);

								if (zoom_button === true) {
									zoomButton.onclick = function () {
										if (place != "") {
											zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
										}										
										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
									};
								}

								if (callbackFunc) {
									var rec = { lat: parseFloat(lat), lon: parseFloat(lon), address: place };
									callbackFunc(rec);
								}
							} else {
								console.error("No item selected from dropdown");
							}
						}
					},
					requestDelay: 400
				};

				try {

					$("#trinitySearch").easyAutocomplete(options);

				} catch (e) {
					console.log("API Responce issue here1..", e);
				}
			} else if (appConfigInfo.type == 'esri') {
				try {
					var place = "";
					var sdiv = document.createElement('div');
					sdiv.className = 'search-wrapper';
					if (search_button == true) {
						searchButton = document.createElement('button');
						searchButton.className = 'search_btn';
						sdiv.appendChild(searchButton);
					}
					sdiv.id = 'searchBox';
					var input = document.createElement('input');
					input.type = 'text';
					input.id = 'trinitySearch';
					if (appConfigInfo.ln == 'ar') {
						input.placeholder = 'بحث';
					} else {
						input.placeholder = "Search";
					}
					input.className = 'controls1';
					sdiv.appendChild(input);

					var rst = document.createElement('button');
					rst.className = 'close-icon';

					if (zoom_button == true) {
						zoomButton = document.createElement('button');
						zoomButton.className = 'zoom_btn';
						sdiv.appendChild(zoomButton);
					}
					input.onkeyup = function () {
						sdiv.appendChild(rst);
						if (this.value.length == 0) {
							if (clearCallbackFunc != undefined) {
								clearCallbackFunc();
							}
						}
						rst.style.visibility = (this.value.length) ? "visible" : "hidden";
					}
					try {
						input.onkeypress = function () {
							sdiv.appendChild(rst);
							rst.style.visibility = (this.value.length) ? "visible" : "hidden";
						};
					}
					catch (errr) {
						console.log("errr: " + errr);
					}
					rst.onclick = function () {
						try {
							console.log("Reset button clicked");
							this.style.visibility = "hidden";
							place = "";
							input.value = "";
							removeAddSearchMarker(mapObj);
							input.focus();
							console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
							tmpl.Zoom.toExtent({
								map: mapObj,
								extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
							});
							if (closeCallbackFunc != undefined) {
								closeCallbackFunc();
							}
						}
						catch (errr) {
							console.log("errr: " + errr);
						}
					};
					var srchb = new ol.control.Control({
						element: sdiv
					});
					mapObj.addControl(srchb);
					//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;
					

					if (appConfigInfo.esriPlaceSearch.endsWith("/GeocodeServer")) {

						var options = {
							url: function (phrase) {
								return appConfigInfo.esriPlaceSearch + "/findAddressCandidates?SingleLine=" + phrase + "&searchExtent=" + appConfigInfo.extent1 + "," + appConfigInfo.extent2 + ";" + appConfigInfo.extent3 + "," + appConfigInfo.extent4 + "&f=json";
							},
							getValue: function (element) {
								return element.placeName
							},
							ajaxSettings: {
								method: "GET",
								timeout: 0,
								headers: {
									"Content-Type": "application/json"
								},
								success: function (response) {
									if (response.candidates) {
										response.data = response.candidates.map(candidate => ({
											placeName: candidate.address,
											placeAddress: "Lat: " + candidate.location.y + ", Lon: " + candidate.location.x,
											entryLatitude: candidate.location.y,
											entryLongitude: candidate.location.x
										}));
									}
								},
								error: function (error) {
									console.error("Error:", error);
								}
							},
							listLocation: "data",
							preparePostData: function (data) {
								if (!data) data = {};
								data.phrase = $("#trinitySearch").val();
								let ul = document.getElementById('eac-container-trinitySearch');
								let searchElemet = document.getElementsByClassName('search-wrapper')[0];
								if (data.phrase.length > 0) {
									ul.style.display = 'block';
									searchElemet.style.setProperty('background-color', '#3c3c3c', 'important');
									searchElemet.style.setProperty('color', '#FFFFFF', 'important');
								}
								return data;
							},
							list: {
								onChooseEvent: function () {
									let selectedItem = $("#trinitySearch").getSelectedItemData();
									console.log("Selected Item:", selectedItem);

									let place = selectedItem.placeName
									var lat = selectedItem.entryLatitude;
									var lon = selectedItem.entryLongitude;

									zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);

									if (zoom_button === true) {
										zoomButton.onclick = function () {
											if (place != "") {
												zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
											}
											zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
										};
									}

									if (callbackFunc) {
										var rec = { lat: parseFloat(lat), lon: parseFloat(lon), address: place };
										callbackFunc(rec);
									}
								}
							},
							requestDelay: 400
						};
					} else {
						var options = {
							url: function (phrase) {
								// Escape single quotes for SQL safety and convert to uppercase for case-insensitive search
								var escapedPhrase = phrase.replace(/'/g, "''");
								var upperPhrase = escapedPhrase.toUpperCase();
								var whereClause = `UPPER(location_description) LIKE '%${upperPhrase}%'`;
								var encodedWhere = encodeURIComponent(whereClause);
								console.log("ESRI Query URL:", appConfigInfo.esriQueryEndpoint);
								console.log("ESRI Where Clause:", whereClause);

								// Construct query URL to match curl exactly
								return `${appConfigInfo.esriQueryEndpoint}?where=${encodedWhere}&outFields=*&returnGeometry=true&resultRecordCount=5&f=json&outSR=4326&geo=null`;
							},
							getValue: function (element) {
								return element.placeName;
							},
							ajaxSettings: {
								method: "GET",
								timeout: 10000,
								headers: {
									"Content-Type": "application/json"
									// AGS_ROLES cookie sent via xhrFields
								},
								xhrFields: {
									withCredentials: true // Ensure cookies (AGS_ROLES) are sent
								},
								success: function (response) {
									console.log("ESRI Query Response:", response);
									if (response && Array.isArray(response.features) && response.features.length > 0) {
										response.data = response.features
											.map(function (feature) {
												var attrs = feature.attributes;
												var geometry = feature.geometry;

												// Skip if no geometry
												if (!geometry || geometry.x === undefined || geometry.y === undefined) {
													return null;
												}

												// Construct placeName to match curl response
												var locationDesc = attrs.location_description || '';
												var cctvId = attrs.cctv_id || '';
												var building = attrs.building || '';
												var moiId = attrs.moi_camera_id || '';
												var placeName = locationDesc;
												if (cctvId) placeName += ` - ${cctvId}`;
												if (building) placeName += ` (${building})`;
												if (moiId && !placeName.includes(moiId)) placeName += ` [${moiId}]`;

												return {
													placeName: placeName || 'Unknown Location',
													placeAddress: placeName, // Consistent with previous format
													entryLatitude: geometry.y, // Lat
													entryLongitude: geometry.x // Lon
												};
											})
											.filter(function (item) { return item !== null; });

										if (response.exceededTransferLimit) {
											console.warn("Search results exceed limit; showing only top 5 results.");
										}
									} else {
										response.data = [];
									}
								},
								error: function (xhr, status, error) {
									console.error("ESRI Query Error:", error, xhr.responseText);
									response.data = []; // Ensure empty on error
								}
							},
							listLocation: "data",
							preparePostData: function (data) {
								if (!data) data = {};
								data.phrase = $("#trinitySearch").val();
								let ul = document.getElementById('eac-container-trinitySearch');
								let searchElement = document.getElementsByClassName('search-wrapper')[0];
								if (data.phrase.length > 0) {
									ul.style.display = 'block';
									searchElement.style.setProperty('background-color', '#3c3c3c', 'important');
									searchElement.style.setProperty('color', '#FFFFFF', 'important');
								}
								return data;
							},
							list: {
								onChooseEvent: function () {
									let selectedItem = $("#trinitySearch").getSelectedItemData();
									console.log("Selected Item:", selectedItem);

									let place = selectedItem.placeName;
									var lat = selectedItem.entryLatitude;
									var lon = selectedItem.entryLongitude;

									// Validate coords
									if (lat && lon) {
										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
									}

									if (zoom_button === true) {
										zoomButton.onclick = function () {
											if (place != "" && lat && lon) {
												zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
											}
										};
									}

									if (callbackFunc) {
										var rec = { lat: parseFloat(lat), lon: parseFloat(lon), address: place };
										callbackFunc(rec);
									}
								}
							},
							requestDelay: 400
						};

					}


					console.log("ESRI Place Search URL:", appConfigInfo.esriPlaceSearch);
					
				



					try {
						$("#trinitySearch").easyAutocomplete(options);
					} catch (e) {
						console.log("API Response issue here:", e);
					}
				} catch (e) {
					console.log("API Responce issue here..", e);
				}
			}
		} else if (appConfigInfo.mapData == 'trinity' && appConfigInfo.type != 'mmi') {
			var items;
			var elocdata;
			let accessTokenCode;

			// try{
			// let searchLib = [
			// 				appConfigInfo.mapSDKURL+"jquery.min.js", 
			// 				appConfigInfo.mapSDKURL+"easy-autocomplete.js", 
			// 				];
			// 	searchLib.forEach(function(src) {
			// 	let script2= document.createElement('script');
			// 	script2.src = src;
			// 	script2.async = false;
			// 	document.head.appendChild(script2);
			// 					});
			// 	}catch(e){console.log("Search Lib Loading issue...",e);
			// 	}


			setTimeout(function () {
				try {
					tmpl.Utils.getTrinityToken({
						callbackFunc: function (accessToken) {
							console.log("accessToken------------>", accessToken.data.access_token)
							var token = accessToken.data.access_token
							var sdiv = document.createElement('div');
							sdiv.className = 'search-wrapper';
							sdiv.id = 'searchBox';
							var input = document.createElement('input');
							input.type = 'text';
							input.id = 'trinitySearch';
							input.placeholder = "Search";
							input.className = 'controls1';
							sdiv.appendChild(input);

							var rst = document.createElement('button');
							rst.className = 'close-icon';

							if (zoom_button == true) {
								zoomButton = document.createElement('button');
								zoomButton.className = 'zoom_btn';
								sdiv.appendChild(zoomButton);
							}
							input.onkeyup = function () {
								sdiv.appendChild(rst);
								if (this.value.length == 0) {
									if (clearCallbackFunc != undefined) {
										clearCallbackFunc();
									}
								}
								rst.style.visibility = (this.value.length) ? "visible" : "hidden";
							}
							try {
								input.onkeypress = function () {
									sdiv.appendChild(rst);
									rst.style.visibility = (this.value.length) ? "visible" : "hidden";
								};
							}
							catch (errr) {
								console.log("errr: " + errr);
							}
							rst.onclick = function () {
								try {
									console.log("Reset button clicked");
									this.style.visibility = "hidden";
									input.value = "";
									removeAddSearchMarker(mapObj);
									input.focus();
									tmpl.Zoom.toExtent({
										map: mapObj,
										extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
									});
									if (closeCallbackFunc != undefined) {
										closeCallbackFunc();
									}
								}
								catch (errr) {
									console.log("errr: " + errr);
								}
							};
							var srchb = new ol.control.Control({
								element: sdiv
							});
							mapObj.addControl(srchb);
							//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

							var options = {
								url: function (phrase) {
									return appConfigInfo.mmi_search_devurl + phrase + "&filter=cop:fo2y7s";
								},
								getValue: function (element) {
									console.log("Element....", element);
									var my_value = element.placeAddress;//+ ' :-> ' + element.placeAddress;
									return my_value;
								},

								ajaxSettings: {
									method: "GET",
									timeout: 0,
									headers: {
										"accept": "*/*",
										"Authorization": "Bearer " + token
									},
									success: function (response) {
										console.log("API Response", response);
										var items = response.suggestedLocations;
										response.data = items;
									},
									error: function (error) {
										console.error("Error:", error);
									}
								},
								listLocation: "data",
								preparePostData: function (data) {
									if (!data) {
										// If data is undefined, create an empty object
										data = {};
									}
									data.phrase = $("#trinitySearch").val();
									console.log("Data sent in the request:", data);
									return data;
								},
								list: {
									onChooseEvent: function () {
										console.log("-------------->", $("#trinitySearch").getSelectedItemData().placeAddress);

										var locationcode = $("#trinitySearch").getSelectedItemData().eLoc;
										let place = $("#trinitySearch").getSelectedItemData().placeAddress;

										function getLocationData(locationcode) {
											return new Promise(function (resolve, reject) {
												var settings = {
													"url": appConfigInfo.mmi_eloc_devurl + locationcode,
													"method": "GET",
													"timeout": 0,
													"headers": {
														"accept": "*/*",
														"Authorization": "Bearer " + token
													},
												};

												$.ajax(settings).done(function (response) {
													console.log(response);
													resolve(response);
												}).fail(function (error) {
													reject(error);
												});
											});
										}

										// Use the promise to get location data
										getLocationData(locationcode).then(function (elocdata) {
											var lat = elocdata.latitude;
											var lon = elocdata.longitude;


											// place = place + ":" + $("#trinitySearch").getSelectedItemData().placeAddress;	

											zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);


											if (zoom_button == true) {
												zoomButton.onclick = function () {
													zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
												};
											}

											if (callbackFunc) {
												var rec = { lat: parseFloat(lat), lon: parseFloat(lon), addres: place };
												callbackFunc(rec);
											}
										}).catch(function (error) {
											console.error("Error fetching location data:", error);
										});
									}
								},
								requestDelay: 400
							};

							try {

								$("#trinitySearch").easyAutocomplete(options);

							} catch (e) {
								console.log("API Responce issue here1..", e);
							}
						}
					});
				} catch (e) {
					console.log("API Responce issue here..", e);
				}
			}, 1000);
		} else if (appConfigInfo.mapData == 'mmi') {
			let accessTokenCode;


			setTimeout(function () {
				try {

					tmpl.Utils.getMMIAccessToken({
						callbackFunc: function (accessToken) {
							var sdiv = document.createElement('div');
							sdiv.className = 'search-wrapper';
							sdiv.id = 'searchBox';
							var input = document.createElement('input');
							input.type = 'text';
							input.id = 'trinitySearch';
							input.placeholder = "Search";
							input.className = 'controls1';
							sdiv.appendChild(input);

							var rst = document.createElement('button');
							rst.className = 'close-icon';

							if (zoom_button == true) {
								zoomButton = document.createElement('button');
								zoomButton.className = 'zoom_btn';
								sdiv.appendChild(zoomButton);
							}
							input.onkeyup = function () {
								sdiv.appendChild(rst);
								if (this.value.length == 0) {
									if (clearCallbackFunc != undefined) {
										clearCallbackFunc();
									}
								}
								rst.style.visibility = (this.value.length) ? "visible" : "hidden";
							}
							try {
								input.onkeypress = function () {
									sdiv.appendChild(rst);
									rst.style.visibility = (this.value.length) ? "visible" : "hidden";
								};
							}
							catch (errr) {
								console.log("errr: " + errr);
							}
							rst.onclick = function () {
								try {
									console.log("Reset button clicked");
									this.style.visibility = "hidden";
									input.value = "";
									removeAddSearchMarker(mapObj);
									input.focus();
									console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
									tmpl.Zoom.toExtent({
										map: mapObj,
										extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
									});
									if (closeCallbackFunc != undefined) {
										closeCallbackFunc();
									}
								}
								catch (errr) {
									console.log("errr: " + errr);
								}
							};
							var srchb = new ol.control.Control({
								element: sdiv
							});
							mapObj.addControl(srchb);
							//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

							var options = {
								url: function (phrase) {
									return appConfigInfo.mmi_search + "?query=" + phrase;
								},
								getValue: function (element) {
									console.log("Element....", element);
									var my_value = element.placeName + ',' + element.placeAddress;//+ ' :-> ' + element.placeAddress;
									return my_value;
								},

								ajaxSettings: {
									method: "GET",
									timeout: 0,
									headers: {
										"Content-Type": "application/json",
										"Authorization": "bearer " + accessToken.data.access_token
									},
									success: function (response) {
										console.log("API Response", response);
										var items = response.suggestedLocations;
										response.data = items;
									},
									error: function (error) {
										console.error("Error:", error);
									}
								},
								listLocation: "data",
								preparePostData: function (data) {
									if (!data) {
										// If data is undefined, create an empty object
										data = {};
									}
									data.phrase = $("#trinitySearch").val();
									console.log("Data sent in the request:", data);
									return data;
								},
								list: {
									onChooseEvent: function () {
										console.log("-------------->", $("#trinitySearch").getSelectedItemData().placeName, $("#trinitySearch").getSelectedItemData().placeAddress);

										let place = $("#trinitySearch").getSelectedItemData().placeName + ',' + $("#trinitySearch").getSelectedItemData().placeAddress;
										var lat = $("#trinitySearch").getSelectedItemData().entryLatitude;
										var lon = $("#trinitySearch").getSelectedItemData().entryLongitude;



										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);


										if (zoom_button == true) {
											zoomButton.onclick = function () {
												zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
											};
										}

										if (callbackFunc) {
											var rec = { lat: parseFloat(lat), lon: parseFloat(lon), addres: place };
											callbackFunc(rec);
										}


									}
								},
								requestDelay: 400
							};

							try {

								$("#trinitySearch").easyAutocomplete(options);

							} catch (e) {
								console.log("API Responce issue here1..", e);
							}
						}
					});
				} catch (e) {
					console.log("API Responce issue here..", e);
				}
			}, 1000);

		} else if (appConfigInfo.mapData == 'trinity' && appConfigInfo.type == 'mmi') {

			setTimeout(function () {
				try {
					var sdiv = document.createElement('div');
					sdiv.className = 'search-wrapper';
					sdiv.id = 'searchBox';
					var input = document.createElement('input');
					input.type = 'text';
					input.id = 'trinitySearch';
					input.placeholder = "Search";
					input.className = 'controls1';
					sdiv.appendChild(input);

					var rst = document.createElement('button');
					rst.className = 'close-icon';

					if (zoom_button == true) {
						zoomButton = document.createElement('button');
						zoomButton.className = 'zoom_btn';
						sdiv.appendChild(zoomButton);
					}
					input.onkeyup = function () {
						sdiv.appendChild(rst);
						if (this.value.length == 0) {
							if (clearCallbackFunc != undefined) {
								clearCallbackFunc();
							}
						}
						rst.style.visibility = (this.value.length) ? "visible" : "hidden";
					}
					try {
						input.onkeypress = function () {
							sdiv.appendChild(rst);
							rst.style.visibility = (this.value.length) ? "visible" : "hidden";
						};
					}
					catch (errr) {
						console.log("errr: " + errr);
					}
					rst.onclick = function () {
						try {
							console.log("Reset button clicked");
							this.style.visibility = "hidden";
							input.value = "";
							removeAddSearchMarker(mapObj);
							input.focus();
							console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
							tmpl.Zoom.toExtent({
								map: mapObj,
								extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
							});
							if (closeCallbackFunc != undefined) {
								closeCallbackFunc();
							}
						}
						catch (errr) {
							console.log("errr: " + errr);
						}
					};
					var srchb = new ol.control.Control({
						element: sdiv
					});
					mapObj.addControl(srchb);
					//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;


					var options = {
						url: function (phrase) {
							return appConfigInfo.mapboxSearchUrl + phrase + "&access_token=" + appConfigInfo.mapboxAccessToken
						},
						getValue: function (element) {
							console.log("Element....", element.properties);
							var my_value = element.properties.full_address;
							return my_value;
						},

						ajaxSettings: {
							method: "GET",
							timeout: 0,
							success: function (response) {
								console.log("API Response", response);
								var items = response.features;
								response.data = items;
							},
							error: function (error) {
								console.error("Error:", error);
							}
						}, listLocation: "data",
						preparePostData: function (data) {
							if (!data) {
								// If data is undefined, create an empty object
								data = {};
							}
							data.phrase = $("#trinitySearch").val();
							console.log("Data sent in the request:", data);
							return data;
						},
						list: {
							onChooseEvent: function () {
								console.log("-------------->", $("#trinitySearch").getSelectedItemData().properties.full_address);

								let place = $("#trinitySearch").getSelectedItemData().properties.full_address;
								var lat = $("#trinitySearch").getSelectedItemData().properties.coordinates.latitude;
								var lon = $("#trinitySearch").getSelectedItemData().properties.coordinates.longitude;
								console.log("----------------lat", lat, "----------lon", lon)



								zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);


								if (zoom_button == true) {
									zoomButton.onclick = function () {
										zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
									};
								}

								if (callbackFunc) {
									var rec = { lat: parseFloat(lat), lon: parseFloat(lon), addres: place };
									callbackFunc(rec);
								}


							}
						},
						requestDelay: 400
					};

					try {

						$("#trinitySearch").easyAutocomplete(options);

					} catch (e) {
						console.log("API Responce issue here1..", e);
					}
				} catch (e) {
					console.log("API Responce issue here..", e);
				}
			}, 1000);

		} else if (appConfigInfo.mapData == 'pentab') {
			// Implement Pentab specific search functionality

			try {
				tmpl.Utils.getPentaBToken({
					callbackFun: function (accessToken) {
						console.log("accessToken------------>", accessToken)
						var place = "";
						var sdiv = document.createElement('div');
						sdiv.className = 'search-wrapper';
						if (search_button == true) {
							searchButton = document.createElement('button');
							searchButton.className = 'search_btn';
							sdiv.appendChild(searchButton);
						}
						sdiv.id = 'searchBox';
						var input = document.createElement('input');
						input.type = 'text';
						input.id = 'trinitySearch';
						input.placeholder = "Search";

						console.log(input.value);

						if (appConfigInfo.ln == 'ar') {
							input.placeholder = "بحث";
						}
						else {
							input.placeholder = "Search";
						}
						input.className = 'controls1';
						sdiv.appendChild(input);

						var rst = document.createElement('button');
						rst.className = 'close-icon';

						if (zoom_button == true) {
							zoomButton = document.createElement('button');
							zoomButton.className = 'zoom_btn';
							sdiv.appendChild(zoomButton);
						}
						input.onkeyup = function () {
							sdiv.appendChild(rst);
							if (this.value.length == 0) {
								if (clearCallbackFunc != undefined) {
									clearCallbackFunc();
								}
							}
							rst.style.visibility = (this.value.length) ? "visible" : "hidden";
						}
						try {
							input.onkeypress = function () {
								sdiv.appendChild(rst);
								rst.style.visibility = (this.value.length) ? "visible" : "hidden";
							};
						}
						catch (errr) {
							console.log("errr: " + errr);
						}
						rst.onclick = function () {
							try {
								console.log("Reset button clicked");
								this.style.visibility = "hidden";
								place = "";
								input.value = "";
								removeAddSearchMarker(mapObj);
								input.focus();
								console.log("extens ===", appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4)
								tmpl.Zoom.toExtent({
									map: mapObj,
									extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
								});
								if (closeCallbackFunc != undefined) {
									closeCallbackFunc();
								}
							}
							catch (errr) {
								console.log("errr: " + errr);
							}
						};
						var srchb = new ol.control.Control({
							element: sdiv
						});
						mapObj.addControl(srchb);
						//let coordinates = appConfigInfo.lat + "," + appConfigInfo.lon;

						var options = {
							url: function () {
								return appConfigInfo.pentaBAPIService + "/findCandidates";
							},
							getValue: function (element) {
								return element.display_data_ar;
							},
							ajaxSettings: {
								method: "POST",
								timeout: 0,
								headers: {
									"PentaUserRole": appConfigInfo.PentaUserRole,
									"PentaOrgID": appConfigInfo.PentaOrgID,
									"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
									"Content-Type": "application/json",
									"Authorization": accessToken
								}
							},
							preparePostData: function () {
								const phrase = $("#trinitySearch").val();

								// show the dropdown with black theme
								let ul = document.getElementById('eac-container-trinitySearch');
								let searchElement = document.getElementsByClassName("search-wrapper")[0];

								if (phrase.length > 0) {
									ul.style.display = 'block';
									searchElement.style.setProperty('background-color', '#3c3c3c', 'important');
									searchElement.style.setProperty('color', '#FFFFFF', 'important');
								}

								return JSON.stringify([
									{
										dataSource: { systemLayer: true },
										layers: [{
											id: appConfigInfo.pentaBPlaceSearchId,
											searchField: appConfigInfo.pentaBPlaceSearchField,
											geomField: appConfigInfo.pentaBPlaceSearchGeomField
										}],
										searchText: phrase,
										crs: appConfigInfo.projection,
										limit: appConfigInfo.pentaBsearchLimit
									}
								]);
							},
							listLocation: function (response) {
								// Return the first array inside the outer response array
								return response[0] || [];
							},
							ajaxCallback: function (response) {
								if (!Array.isArray(response) || !Array.isArray(response[0])) return [];

								return response[0].map(item => {
									let lat = undefined, lon = undefined;

									try {
										const centroid = JSON.parse(item.centroid_geom);
										lat = centroid.coordinates[1];
										lon = centroid.coordinates[0];
									} catch (e) {
										console.warn("Invalid centroid_geom format:", item.centroid_geom);
									}

									return {
										placeName: item.display_data_en || item.display_data_ar,
										placeAddress: `Lat: ${lat}, Lon: ${lon}`,
										entryLatitude: lat,
										entryLongitude: lon,
										originalItem: item
									};
								});
							},


							list: {
								onChooseEvent: function () {
									let selectedItem = $("#trinitySearch").getSelectedItemData();
									console.log("Selected Item:", selectedItem);


									let place = appConfigInfo.ln === 'ar' ? selectedItem.display_data_ar : selectedItem.display_data_en;
									let centroid = JSON.parse(selectedItem.centroid_geom);

									let lon = centroid.coordinates[0];
									let lat = centroid.coordinates[1];


									zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);

									if (zoom_button === true) {
										zoomButton.onclick = function () {
											if (place != "") {
												zoomToSearch(mapObj, parseFloat(lon), parseFloat(lat), null, place, img_url, height, width);
											}
										};
									}

									if (callbackFunc) {
										const rec = {
											lat: parseFloat(lat),
											lon: parseFloat(lon),
											address: place
										};
										callbackFunc(rec);
									}
								}
							},
							requestDelay: 400
						};

						try {
							$("#trinitySearch").easyAutocomplete(options);
						} catch (e) {
							console.log("API Response issue here:", e);
						}


						try {
							$("#trinitySearch").easyAutocomplete(options);
						} catch (e) {
							console.log("API Response issue here:", e);
						}
					}
				});

			} catch (e) {
				console.log("API Responce issue here..", e);
			}

		} else if (appConfigInfo.type == 'mdd') {
			try {
				var place = "";
				var sdiv = document.createElement('div');
				sdiv.className = 'search-wrapper';

				if (search_button == true) {
					searchButton = document.createElement('button');
					searchButton.className = 'search_btn';
					sdiv.appendChild(searchButton);
				}

				sdiv.id = 'searchBox';

				var input = document.createElement('input');
				input.type = 'text';
				input.id = 'trinitySearch';
				input.placeholder = (appConfigInfo.ln == 'ar') ? 'بحث' : 'Search';
				input.className = 'controls1';
				sdiv.appendChild(input);

				var rst = document.createElement('button');
				rst.className = 'close-icon';

				if (zoom_button == true) {
					zoomButton = document.createElement('button');
					zoomButton.className = 'zoom_btn';
					sdiv.appendChild(zoomButton);
				}

				input.onkeyup = function () {
					sdiv.appendChild(rst);
					rst.style.visibility = (this.value.length) ? "visible" : "hidden";

					if (this.value.length === 0) {
						hidePOIDropdown();
						if (clearCallbackFunc) clearCallbackFunc();
					}
				};

				rst.onclick = function () {
					this.style.visibility = "hidden";
					input.value = "";
					removeAddSearchMarker(mapObj);
					hidePOIDropdown();
					input.focus();

					tmpl.Zoom.toExtent({
						map: mapObj,
						extent: [appConfigInfo.extent1, appConfigInfo.extent2, appConfigInfo.extent3, appConfigInfo.extent4]
					});

					if (closeCallbackFunc) closeCallbackFunc();
				};

				var srchb = new ol.control.Control({ element: sdiv });
				mapObj.addControl(srchb);

				// ---------------------------------------------------------
				// LAYER - FIELD definitions
				// ---------------------------------------------------------
				const LAYER_FIELD_MAP = appConfigInfo.MDD_LAYER_FIELD_MAP

				// -------------------------------------
				// Search helpers
				// -------------------------------------
				function escapeForCQL(str) {
					return str.replace(/'/g, "''");
				}

				function buildLayerURL(layerName, fields, phrase) {
					if (!phrase || phrase.length < 2) return null;

					var escaped = escapeForCQL(phrase);
					var orConditions = fields.map(f => `${f} ILIKE '%${escaped}%'`).join(" OR ");

					var base = appConfigInfo.geoserverDetails.geoserverHost;
					if (!base.endsWith("/")) base += "/";

					return (
						base +
						`MDD/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=${encodeURIComponent(layerName)}` +
						`&outputFormat=application/json&maxFeatures=50&CQL_FILTER=${encodeURIComponent(orConditions)}`
					);
				}

				// -------------------------------------
				// SCHOOL FALLBACK
				// -------------------------------------
				const SCHOOL_KEYWORDS = [
					"school", "academy", "schools", "college", "education", "primary",
					"secondary", "high school", "highschool"
				];

				function isSchoolSearch(s) {
					var text = (s || "").toLowerCase();
					return SCHOOL_KEYWORDS.some(k => text.includes(k));
				}

				function fetchSchoolFallback() {
					var base = appConfigInfo.geoserverUrl;
					if (!base.endsWith("/")) base += "/";

					var url =
						base +
						"MDD/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=MDD%3ASchools&outputFormat=application/json&maxFeatures=200";

					return fetch(url)
						.then(r => r.json())
						.then(json => {
							if (!json.features) return [];
							json.features.forEach(f => {
								if (!f.properties) f.properties = {};
								f.properties._mdd_layer = "MDD:Schools";
							});
							return json.features;
						})
						.catch(() => []);
				}

				// -------------------------------------
				// MAIN SEARCH ENGINE
				// -------------------------------------
				function searchAllLayers(phrase) {
					var layerPromises = [];

					Object.keys(LAYER_FIELD_MAP).forEach(layer => {
						var url = buildLayerURL(layer, LAYER_FIELD_MAP[layer], phrase);
						if (!url) return;

						layerPromises.push(
							fetch(url)
								.then(r => r.json())
								.then(json => {
									if (!json.features) return [];
									json.features.forEach(f => {
										if (!f.properties) f.properties = {};
										f.properties._mdd_layer = layer;
									});
									return json.features;
								})
								.catch(() => [])
						);
					});

					return Promise.all(layerPromises).then(results => {
						var allFeatures = results.flat();

						// school fallback
						if (allFeatures.length === 0 && isSchoolSearch(phrase)) {
							return fetchSchoolFallback();
						}

						return allFeatures;
					});
				}

				// -------------------------------------
				// DROPDOWN DISPLAY
				// -------------------------------------
				var poiDropdown = document.createElement("div");
				poiDropdown.style.display = "none";
				poiDropdown.style.position = "absolute";
				poiDropdown.style.top = "25px";
				poiDropdown.style.left = "0px";
				poiDropdown.style.width = "170px";  
				poiDropdown.style.maxHeight = "300px";
				poiDropdown.style.background = "#3c3c3c";
				poiDropdown.style.border = "1px solid #212121";
				poiDropdown.style.borderRadius = "4px";
				poiDropdown.style.overflowY = "auto";
				poiDropdown.style.zIndex = 999999;
				poiDropdown.style.fontFamily = "Arial, sans-serif";
				sdiv.appendChild(poiDropdown);

				function hidePOIDropdown() {
					poiDropdown.style.display = "none";
					poiDropdown.innerHTML = "";
				}

				function getTitle(props) {

					if (props._mdd_layer === "MDD:Public_Transportation") {
						return (
							props.roadname ||
							props.roadnumber ||
							props.message ||
							props.signagetyp ||
							"Public Transport"
						);
					}

					return (
						props.poi ||
						props.spacename_ ||
						props.square_nam ||
						props.point_name ||
						props.signagetyp ||
						props.building_a ||
						props.name ||
						props.ram_name ||
						"POI"
					);
				}

				function showPOIDropdown(features) {

					poiDropdown.innerHTML = "";

					// Match input width dynamically
					poiDropdown.style.width = input.offsetWidth + "px";

					if (!features || features.length === 0) {
						hidePOIDropdown();
						return;
					}

					features.forEach(f => {
						var props = f.properties || {};
						var title = getTitle(props);
						var layerName = props._mdd_layer.replace("MDD:", "");

						// ITEM CONTAINER
						var item = document.createElement("div");
						item.style.padding = "10px 14px";
						item.style.cursor = "pointer";
						item.style.borderBottom = "1px solid #3c3c3c";
						item.style.background = "#3c3c3c";
						item.style.transition = "background 0.15s";

						// Hover effect (same as EasyAutocomplete)
						item.onmouseenter = function () {
							item.style.background = "#555555";
						};
						item.onmouseleave = function () {
							item.style.background = "#3c3c3c";
						};

						// TITLE text
						var titleDiv = document.createElement("div");
						titleDiv.innerText = title;
						titleDiv.style.fontWeight = "600";
						titleDiv.style.fontSize = "14px";
						titleDiv.style.color = "#FFFFFF";

						// SUBTITLE text
						var sub = document.createElement("div");
						sub.innerText = layerName;
						sub.style.fontSize = "11px";
						sub.style.marginTop = "2px";
						sub.style.color = "#FFFFFF";

						item.appendChild(titleDiv);
						item.appendChild(sub);

						// Coordinates
						var lon = (f.geometry && f.geometry.coordinates[0]) || props.point_x;
						var lat = (f.geometry && f.geometry.coordinates[1]) || props.point_y;

						item.onclick = function () {
							hidePOIDropdown();
							if (lat && lon) {
								zoomToSearch(
									mapObj,
									parseFloat(lon),
									parseFloat(lat),
									null,
									title,
									img_url,
									height,
									width
								);

								if (callbackFunc)
									callbackFunc({ lat, lon, address: title });
							}
						};

						poiDropdown.appendChild(item);
					});

					poiDropdown.style.display = "block";
				}

				// -------------------------------------
				// INPUT KEYUP (debounced)
				// -------------------------------------
				var debounceTimer = null;

				input.addEventListener("keyup", function () {
					var text = input.value.trim();
					if (text.length < 2) {
						hidePOIDropdown();
						return;
					}

					if (debounceTimer) clearTimeout(debounceTimer);

					debounceTimer = setTimeout(() => {
						searchAllLayers(text).then(showPOIDropdown);
					}, 300);
				});

				document.addEventListener("click", function (e) {
					if (!sdiv.contains(e.target)) hidePOIDropdown();
				});

			} catch (e) {
				console.log("MDD SEARCH ERROR:", e);
			}
		}


	}
	return response = { status: true, message: 'Location and Landmark Search Added Successfully..!' };
}

// tmpl.Search.All = function (param) {
// 	var map = param.map;
// 	var point = param.point;
// 	var callback = param.callbackFunc;
// 	try {

// 		if (map === null || map === undefined) {

// 			return response = { status: 'false', businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  Map Object..!' };
// 		}

// 		if (point === null || point === undefined || point === '' || point === "") {

// 			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  point' };
// 		}

// 		if (callback === null || callback === undefined || callback === '' || callback === "") {

// 			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  callback' };
// 		}


// 	} catch (error) {
// 		if (error instanceof Error) {
// 			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
// 		}
// 	}


// 	var result = {};
// 	var landmarkPolitical;
// 	function handleLandMarkspolitical(data) {
// 		if (data.address != undefined) {
// 			landmarkPolitical = data.address;
// 		} else {
// 			landmarkPolitical = data[0].name;
// 		}

// 		if (appConfigInfo.mapData != "google") {
// 			function handleLandMarks(data) {
// 				if (data.address != undefined) {
// 					result.landmark = data.address;
// 				} else {
// 					result.landmark = data[0].name;
// 				}
// 			}

// 		}

// 		function handleGeocode(data, c) {
// 			result.address = data.address;
// 			// function handlePlace(data,c){
// 			if (appConfigInfo.mapData == "google") {
// 				if (data.address != undefined) {
// 					zz = c;
// 					var x = zz.formatted_address.split(',');
// 					if (x[x.length - 3] == " Sri Lanka") {

// 						result.placename = x[x.length - 4];

// 					}
// 					else {
// 						result.placename = x[x.length - 3];

// 						if (x[x.length - 5] && x[x.length - 4]) {
// 							result.landmark = x[x.length - 5] + "," + x[x.length - 4];
// 						}
// 						else {
// 							result.landmark = '';
// 						}


// 					}
// 				}
// 				else {
// 					result.placename = '';
// 					result.landmark = '';
// 				}
// 			}
// 			else
// 				console.log("Datttttttttttttttttttttttttttttttttt>>>>>>>>>>>>>", result);
// 			//result.placename = data.landmark;
// 			//result.placename = data[0].placename;landmark
// 			function handlePolice(data) {
// 				if (data[0] != undefined)
// 					result.policestation = data[0].name;
// 				else
// 					result.policestation = '';
// 				result.placeName = landmarkPolitical;

// 				callback(result);
// 			}
// 			tmpl.Search.getLandMarks({
// 				map: map,
// 				point: point,
// 				radius: 20000,
// 				POI_type: "police",
// 				Max_num_POIs: 1,
// 				callbackFunc: handlePolice
// 			});

// 		}
// 		// tmpl.Geocode.getGeocode({
// 		// 		point : point,
// 		// 		callbackFunc : handlePlace
// 		// 	});
// 		// }
// 		tmpl.Geocode.getGeocode({
// 			point: point,
// 			callbackFunc: handleGeocode
// 		});
// 		// }

// 		if (appConfigInfo.mapData != "google") {
// 			tmpl.Search.getLandMarksRoad({
// 				map: map,
// 				point: point,
// 				radius: '20000',
// 				POI_type: "poi",
// 				Max_num_POIs: 1,
// 				callbackFunc: handleLandMarks
// 			});
// 		}
// 	}

// 	let getLandMarksRoad_POI_type;
// 	if (appConfigInfo.mapData == "google") {
// 		getLandMarksRoad_POI_type = "sublocality"
// 	} else if (appConfigInfo.mapData == "mmi") {
// 		getLandMarksRoad_POI_type = "roads"
// 	}

// 	tmpl.Search.getLandMarksRoad({
// 		map: map,
// 		point: point,
// 		radius: '500',
// 		POI_type: getLandMarksRoad_POI_type,
// 		Max_num_POIs: 1,
// 		callbackFunc: handleLandMarkspolitical
// 	});

// 	return { status: true, message: 'tmpl.Search.All executed successfully' }
// }

//New API As Per the Sabjan Subjan suggestion

tmpl.Search.All = function (param) {
	var map = param.map;
	var point = param.point;
	var callback = param.callbackFunc;
	try {

		if (map === null || map === undefined) {

			return response = { status: 'false', businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  Map Object..!' };
		}

		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  point' };
		}

		if (callback === null || callback === undefined || callback === '' || callback === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  callback' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}


	var result = {};
	function handleGeocode(data, c) {
		result.address = data.address;
		// function handlePlace(data,c){
		if (appConfigInfo.mapData == "google") {
			if (data.address != undefined) {
				zz = c;
				var x = zz.formatted_address.split(',');
				if (x[x.length - 3] == " Sri Lanka") {

					result.placeName = x[x.length - 4];

				}
				else {
					result.placeName = x[x.length - 4];

					if (x[x.length - 5] && x[x.length - 4]) {
						result.landmark = x[x.length - 5] + "," + x[x.length - 4];
					}
					else {
						result.landmark = '';
					}


				}
			}
			else {
				result.placeName = '';
				result.landmark = '';
			}

		}
		else {

			console.log("Datttttttttttttttttttttttttttttttttt>>>>>>>>>>>>>", result);
		}
		callback(result);

	}
	tmpl.Geocode.getGeocode({
		point: point,
		callbackFunc: handleGeocode
	});

	return { status: true, message: 'tmpl.Search.All executed successfully' }
}

// **** This function takes latitude,longitude,radius and type of location. It will return the places of specified type within the radius of given location. **** //

tmpl.Search.getLandMarks = function (params) {
	var point = params.point;
	var callbackFunc = params.callbackFunc;
	var custom_poi_type = params.POI_type;
	var dataFrom = params.dataFrom;
	var ignoreRadius = params.ignoreRadius;
	var radius = params.radius;
	//var resultArray22 = [];
	try {

		// if (mapObj === null || mapObj === undefined) {

		// 	return response = { status: 'false', businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  Map Object..!' };
		// }

		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
		}


		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
		}

		if (custom_poi_type === null || custom_poi_type === undefined || custom_poi_type === '' || custom_poi_type === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid custom_poi_type' };
		}

		// if (dataFrom === null || dataFrom === undefined || dataFrom === '' || dataFrom === "") {

		// 	return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid dataFrom' };
		// }


		// if (ignoreRadius === null || ignoreRadius === undefined || ignoreRadius === '' || ignoreRadius === "") {

		// 	return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid ignoreRadius' };
		// }


		// if (radius === null || radius === undefined || radius === '' || radius === "") {

		// 	return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid radius' };
		// }


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}


	if (ignoreRadius == undefined) {

	} else {
		if (ignoreRadius == true) {
			radius = 800000;
		}
	}

	if (appConfigInfo.mapData == 'google') {
		if (dataFrom == 'google' || dataFrom == undefined) {


			function successCallback(res) {
				console.log(" ::::::: successCallback search ::::::: ", res);
			}


			let url = appConfigInfo.apiManURL + "tiotgoogle/" + appConfigInfo.apiManVersion + "/nearbylandmark?location=" + parseFloat(point[1]) + "," + parseFloat(point[0]) + "&radius=" + radius + "&keyword=" + custom_poi_type + "&key=" + appConfigInfo.googleMapKey;

			tmpl.Utils.makeAjaxRequest(
				{
					url: url,
					method: "GET",
					successCallback: successCallback
				}
			)

			function successCallback(res) {
				console.log(" ::::::: successCallback search ::::::: ", res);
			}

			function successCallback(response) {
				//console.log(response);
				var resultAry = [];
				var resultArray22 = [];
				resultAry = response.results;

				console.log(" :::::: resultAry :::::  ", resultAry);

				//console.log("qq",POI_type,results);
				var resultArray = [];
				if (resultAry == null) {
					var record = {};
					//resultArray.push(record);
					searchresult = false;
				} else {
					if (resultAry.length == 0) {
						var record = {};
						//resultArray.push(record);
						searchresult = false;
					}
					else {
						//if (status === google.maps.places.PlacesServiceStatus.OK){
						for (var i = 0; i < resultAry.length; i++) {
							if (resultAry[i] != undefined) {
								var lat = resultAry[i].geometry.location.lat;
								var lng = resultAry[i].geometry.location.lng;
								function deg2rad(deg) {
									return deg * (Math.PI / 180)
								}
								var R = 6371; // Radius of the earth in km
								var dLat = deg2rad(lat - point[1]);
								var dLon = deg2rad(lng - point[0]);
								var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
									Math.cos(deg2rad(lat)) * Math.cos(deg2rad(point[1])) *
									Math.sin(dLon / 2) * Math.sin(dLon / 2);
								var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
								var d = R * c; // Distance in km
								var distance = d.toFixed(2);
								distance = parseFloat(distance);
								var record = { name: resultAry[i].name, lat: parseFloat(lat), lon: parseFloat(lng), distance: distance, poi_type: params.POI_type };
								resultArray22.push(record);
							}
						}
						resultArray22.sort(function (a, b) { return a.distance - b.distance });
						//console.log("hhhh",resultArray22);
						//}
					}
					var no_of_POIs;
					if (params.Max_num_POIs < resultAry.length) {
						no_of_POIs = params.Max_num_POIs;
					}
					else {
						no_of_POIs = resultAry.length;
					}
					for (var i = 0; i < no_of_POIs; i++) {
						resultArray.push(resultArray22[i]);
						searchresult = true;
					}
				}
				//alert("alert from api");
				callbackFunc(resultArray);

				//callbackFunc(resultAry);
			};
		}


	} else if (appConfigInfo.mapData == 'trinity') {
		// Search nearby place Functionality for MPEH Project.
		var searchresult;
		var coordinate = { lat: parseFloat(point[1]), lon: parseFloat(point[0]) };
		var lon = parseFloat(params.point[0]);
		var lat = parseFloat(params.point[1])

		var resultArray22 = [];

		async function getNearestPlaces(token) {
			var settings = {
				"url": appConfigInfo.mmi_nearbyplaces_devurl + custom_poi_type + '&refLocation=' + point[1] + ',' + point[0],
				"method": "GET",
				"timeout": 0,
				"headers": {
					"accept": "*/*",
					"Authorization": "Bearer " + token
				},
			};

			try {
				var responce = await $.ajax(settings);
				console.log(responce);
				var resultArray = [];

				for (var i = 0; i < responce.suggestedLocations.length; i++) {
					if (responce.suggestedLocations[i] != undefined) {
						var lat;
						var lon;
						var locationCode = responce.suggestedLocations[i].eLoc;
						var place = responce.suggestedLocations[i].placeAddress;

						// Use the promise to get location data
						try {
							var elocdata = await getLocationData(locationCode, token);
							lat = elocdata.latitude;
							lon = elocdata.longitude;
						} catch (error) {
							console.error("Error fetching location data:", error);
						}

						function deg2red(deg) {
							return deg * (Math.PI / 180)
						}

						var R = 6371;
						var dLat = deg2red(lat - point[1]);
						var dLon = deg2red(lon - point[0]);
						var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
							Math.cos(deg2red(lat)) * Math.cos(deg2red(point[1])) *
							Math.sin(dLon / 2) * Math.sin(dLon / 2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						var d = R * c;
						var dist = d.toFixed(2);
						dist = parseFloat(responce.suggestedLocations[i].distance);
						var record = { name: place, lat: parseFloat(lat), lon: parseFloat(lon), distance: dist + " M", poi_type: params.POI_type };
						resultArray22.push(record);
					}
				}
				resultArray22.sort(function (a, b) { return a.distance - b.distance })

				var no_of_POIs;
				var responseLength = 0;
				try {
					responseLength = responce.suggestedLocations.length;
				}
				catch (e) {
					responseLength = 0;
				}
				if (params.Max_num_POIs < responseLength) {
					no_of_POIs = params.Max_num_POIs;
				} else {
					no_of_POIs = responseLength;
				}
				for (var i = 0; i < no_of_POIs; i++) {
					resultArray.push(resultArray22[i]);
					searchresult = true;
				}
				if (resultArray.length === 0) {
					console.log("Their is no data Found");
					var z = ["Data Not available"];
					callbackFunc(z);
				} else {
					console.log("Data Found", resultArray);
					callbackFunc(resultArray);
				}
			} catch (error) {
				console.error("Error fetching nearest places:", error);
			}
		}

		function getLocationData(locationCode, token) {
			return new Promise(function (resolve, reject) {
				var settings = {
					"url": appConfigInfo.mmi_eloc_devurl + locationCode,
					"method": "GET",
					"timeout": 0,
					"headers": {
						"accept": "*/*",
						"Authorization": "Bearer " + token
					},
				};

				$.ajax(settings).done(function (response) {
					console.log(response);
					resolve(response);
				}).fail(function (error) {
					reject(error);
				});
			});
		}

		tmpl.Utils.getTrinityToken({
			callbackFunc: function (accessToken) {
				console.log("Access Token::", accessToken.data.access_token);
				getNearestPlaces(accessToken.data.access_token);
			}
		});
	} else if (appConfigInfo.mapData == 'mmi') {
		// Search nearby place Functionality for Lucknow Project.
		console.log("we are in mmi get LandMark api")
		var searchresult;
		var coordinate = { lat: parseFloat(point[1]), lon: parseFloat(point[0]) };
		var lon = parseFloat(params.point[0]);
		var lat = parseFloat(params.point[1])

		var resultArray22 = [];
		async function getNearestPlaces(token) {
			var settings = {
				"url": appConfigInfo.mmi_nearbyplaces + token + '&bridge=&query=' + custom_poi_type + '&location=' + point[1] + ',' + point[0],
				"method": "GET",
				"timeout": 0,
			};

			try {
				var responce = await $.ajax(settings);
				console.log(responce);
				var resultArray = [];

				for (var i = 0; i < responce.suggestedLocations.length; i++) {
					if (responce.suggestedLocations[i] != undefined) {
						var lat = responce.suggestedLocations[i].latitude;
						var lon = responce.suggestedLocations[i].longitude;
						var place = responce.suggestedLocations[i].placeName + ',' + responce.suggestedLocations[i].placeAddress;
						var address = responce.suggestedLocations[i].placeAddress;


						function deg2red(deg) {
							return deg * (Math.PI / 180)
						}

						var R = 6371;
						var dLat = deg2red(lat - point[1]);
						var dLon = deg2red(lon - point[0]);
						var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
							Math.cos(deg2red(lat)) * Math.cos(deg2red(point[1])) *
							Math.sin(dLon / 2) * Math.sin(dLon / 2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						var d = R * c;
						var dist = d.toFixed(2);
						dist = parseFloat(responce.suggestedLocations[i].distance);
						var record = { name: place, lat: parseFloat(lat), lon: parseFloat(lon), distance: dist + " M", poi_type: params.POI_type, address: address };
						resultArray22.push(record);
					}
				}
				resultArray22.sort(function (a, b) { return a.distance - b.distance })

				var no_of_POIs;
				var responseLength = 0;
				try {
					responseLength = responce.suggestedLocations.length;
				}
				catch (e) {
					responseLength = 0;
				}
				if (params.Max_num_POIs < responseLength) {
					no_of_POIs = params.Max_num_POIs;
				} else {
					no_of_POIs = responseLength;
				}
				for (var i = 0; i < no_of_POIs; i++) {
					resultArray.push(resultArray22[i]);
					searchresult = true;
				}
				if (resultArray.length === 0) {
					console.log("Their is no data Found");
					var z = ["Data Not available"];
					callbackFunc(z);
				} else {
					console.log("Data Found", resultArray);
					callbackFunc(resultArray);
				}
			} catch (error) {
				console.error("Error fetching nearest places:", error);
			}
		}
		tmpl.Utils.getMMIAccessToken({
			callbackFunc: function (accessToken) {
				console.log("Access Token::", accessToken.data.access_token);
				getNearestPlaces(accessToken.data.access_token);
			}
		});
	} else if (appConfigInfo.mapData == 'sgl') {
		// Search nearby place Functionality for KarimNagar Project.
		var searchresult;
		var coordinate = { lat: parseFloat(point[1]), lon: parseFloat(point[0]) };
		var lon = parseFloat(params.point[0]);
		var lat = parseFloat(params.point[1])

		var resultArray22 = [];
		async function getNearestPlaces(token) {
			// "url":appConfigInfo.sgl_reversegeocode+token+'&bridge=&query='+custom_poi_type+'&location='+point[1]+','+point[0],

			var settings = {
				"url": appConfigInfo.sgl_geocode + custom_poi_type + "?OutputOptions=2&NumberOfResults=10",
				"method": "GET",
				"timeout": 0,
				"headers": {
					"Authorization": "Bearer " + token
				},
			};

			try {
				var responce = await $.ajax(settings);
				console.log(responce);
				var resultArray = [];

				for (var i = 0; i < responce.length; i++) {
					if (responce[i] != undefined) {
						var lat = responce[i].latitude;
						var lon = responce[i].longitude;
						var place = responce[i].name;
						function deg2red(deg) {
							return deg * (Math.PI / 180)
						}

						var R = 6371;
						var dLat = deg2red(lat - point[1]);
						var dLon = deg2red(lon - point[0]);
						var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
							Math.cos(deg2red(lat)) * Math.cos(deg2red(point[1])) *
							Math.sin(dLon / 2) * Math.sin(dLon / 2);
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						var d = R * c;
						var dist = d.toFixed(2);
						// dist = parseFloat(responce.suggestedLocations[i].distance);
						var record = { name: place, lat: parseFloat(lat), lon: parseFloat(lon), poi_type: params.POI_type };
						resultArray22.push(record);
					}
				}
				resultArray22.sort(function (a, b) { return a.distance - b.distance })

				var no_of_POIs;
				var responseLength = 0;
				try {
					responseLength = responce.length;
				}
				catch (e) {
					responseLength = 0;
				}
				if (params.Max_num_POIs < responseLength) {
					no_of_POIs = params.Max_num_POIs;
				} else {
					no_of_POIs = responseLength;
				}
				for (var i = 0; i < no_of_POIs; i++) {
					resultArray.push(resultArray22[i]);
					searchresult = true;
				}
				if (resultArray.length === 0) {
					console.log("Their is no data Found");
					var z = ["Data Not available"];
					callbackFunc(z);
				} else {
					console.log("Data Found", resultArray);
					callbackFunc(resultArray);
				}
			} catch (error) {
				console.error("Error fetching nearest places:", error);
			}
		}
		getNearestPlaces(appConfigInfo.sgl_access_token);

	} else if (appConfigInfo.mapData == 'pentab') {
		var lon = parseFloat(point[0]);
		var lat = parseFloat(point[1]);
		var maxPOI = 1;
		var type;
		var rsltAry = [];
		var boolianone = false;
		var urlL;
		var resultArray22 = [];
		var resultArray = [];
		if (params.Max_num_POIs) {
			maxPOI = params.Max_num_POIs;
		}

		// if (custom_poi_type == "blood_bank") {
		// 	type = appConfigInfo.pentaPOIType.blood_bank;
		// } else if (custom_poi_type == "hospital") {
		// 	type = appConfigInfo.pentaPOIType.hospital;
		// } else if (custom_poi_type == "fire_station") {
		// 	type = appConfigInfo.pentaPOIType.fire_station;
		// } else if (custom_poi_type == "police") {
		// 	type = appConfigInfo.pentaPOIType.police;
		// }
		// else if (custom_poi_type == "all") {
		// 	type = appConfigInfo.pentaPOIType.all;
		// }
		// else {
		// 	type = appConfigInfo.pentaPOIType.all;
		// }
		var rdus = radius;
		var dstncKMtr;

		tmpl.Map.getToken({
			callbackFun: function token(accessToken) {
				console.log("Token::", accessToken);
				var settings = {
					"url": appConfigInfo.pentaBAPIService + "/findNearest",
					"method": "POST",
					"timeout": 0,
					"headers": {
						"PentaUserRole": appConfigInfo.PentaUserRole,
						"PentaOrgID": appConfigInfo.PentaOrgID,
						"PentaSelectedLocale": appConfigInfo.PentaBSelectedLocale,
						"Authorization": accessToken,
						"Content-Type": "application/json"
					},
					"data": JSON.stringify([
						{
							"dataSource": {
								"id": appConfigInfo.pentaBNearyByPOIId
							},
							"sourceGeometry": {
								"key": "geometry",
								"geometry": "{\"type\":\"Point\",\"coordinates\":[" + lon + "," + lat + "]}",
								"spatialRelation": "CONTAINED"
							},
							"crs": appConfigInfo.projection,
							"limit": appConfigInfo.pentaBMaxPOI,
							"returns": [
							]
						}
					]),

				};

				$.ajax(settings).done(function (response) {
					const rec = JSON.parse(response[0].features);
					const resultArray22 = [];

					function deg2rad(deg) {
						return deg * (Math.PI / 180);
					}

					function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
						const R = 6371; // Radius of the earth in km
						const dLat = deg2rad(lat2 - lat1);
						const dLon = deg2rad(lon2 - lon1);
						const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
							Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
							Math.sin(dLon / 2) * Math.sin(dLon / 2);
						const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						return R * c;
					}

					for (let i = 0; i < rec.features.length; i++) {
						const feature = rec.features[i];
						const geom = feature.geometry;

						// Handle only polygons
						if (geom.type === "Polygon") {
							const firstRing = geom.coordinates[0];
							const firstCoord = firstRing[0];       
							const lng = firstCoord[0];
							const lat = firstCoord[1];

							const d = getDistanceFromLatLonInKm(point[1], point[0], lat, lng);
							const distance = parseFloat(d.toFixed(2));

							const record = {
								name: feature.properties.col33 || "",
								lat: parseFloat(lat),
								lon: parseFloat(lng),
								distance: distance,
								poi_type: params.POI_type
							};

							resultArray22.push(record);
						}
					}

					resultArray22.sort((a, b) => a.distance - b.distance);
					callbackFunc(resultArray22);
				});


			}
		});
	}

	//return {status : true, message : 'tmpl.Search.getLandMarks executed successfully'}
}

tmpl.Search.getLandMarksRoad = function (params) {
	var point = params.point;
	var map = params.map
	var callbackFunc = params.callbackFunc;
	var custom_poi_type = params.POI_type;
	//var dataFrom = params.dataFrom;
	//var ignoreRadius = params.ignoreRadius;
	var Max_num_POIs = params.Max_num_POIs;
	var radius = params.radius;

	try {

		if (map === null || map === undefined) {

			return response = { status: 'false', businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid  Map Object..!' };
		}

		if (point === null || point === undefined || point === '' || point === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid point' };
		}

		if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
		}

		if (custom_poi_type === null || custom_poi_type === undefined || custom_poi_type === '' || custom_poi_type === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid custom_poi_type' };
		}


		if (Max_num_POIs === null || Max_num_POIs === undefined || Max_num_POIs === '' || Max_num_POIs === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid Max_num_POIs' };
		}


		if (radius === null || radius === undefined || radius === '' || radius === "") {

			return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid radius' };
		}


	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}


	var tempMap = null;
	if (Max_num_POIs) {
		Max_num_POIs = params.Max_num_POIs;
	}
	else {
		Max_num_POIs = 1;
	}
	/*
			map : map,
			point : point,
			radius : '20000',
			POI_type : "route",
			Max_num_POIs : 1,
			callbackFunc : handleLandMarks
	*/
	tmpl.Search.getLandMarks({
		map: map,
		point: point,
		radius: radius,
		POI_type: custom_poi_type,
		Max_num_POIs: Max_num_POIs,
		callbackFunc: function handleLandMarks(a) {
			callbackFunc(a)
		}
	});


	return { status: true, message: 'tmpl.Search.getLandMarksRoad executed successfully' }

}



tmpl.Search.sampleAjaxCall = function () {


	function successCallback(res) {

		console.log(" ::::::: successCallback ::::::: ", res);

	}


	tmpl.Utils.makeAjaxRequest(
		{
			url: appConfigInfo.apiManURL + "tiotgoogle/" + appConfigInfo.apiManVersion + "/nearbylandmark?location=12.97580746890632%2C%2077.59829000574554&radius=800000&type=hospital&key=" + appConfigInfo.googleMapKey,
			method: "GET",
			successCallback: successCallback
		}
	)

}

