tmpl.Geocode.getGeocode = function (params) {
	var resultStatus;
	var point = params.point;
	var callbackFunc = params.callbackFunc;

	try {
		if (point === null || point === undefined || point.length == 0) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid point parameter' };
		}


		if (!callbackFunc) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib === 'ol7') {
				if (appConfigInfo.mapData == 'google') {
					if (appConfigInfo.type == 'google') {
						var x = parseFloat(point[0]);
						var y = parseFloat(point[1]);
						var coordinates = { lat: y, lng: x };
						var result = { address: 'NA' };

						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							'latLng': coordinates
						}, function (results, status) {
							//console.log("insided", results);
							var resultArray = [];
							if (status == google.maps.GeocoderStatus.OK) {
								//console.log("ccccgeo",results);
								if (results[0]) {
									var address = results[0].formatted_address;
									result = { address: address };
									resultStatus = true;
									resultArray = results[0];
								}
								else {
									const error = new Error('Invalid result data: ');
									error.code = 'TB_GISSDK_0x001';
									throw error;
								}
							}
							callbackFunc(result, resultArray);
						});
					} else if (appConfigInfo.type == 'osm') {
						var url = appConfigInfo.osm_geocode + point[1] + "&lon=" + point[0] + "&format=json&language=en";
						$.getJSON(url, function (data) {
							if (data.length === 0) {
								return;
							}
							var locationAddress = data.display_name;
							var result = { address: locationAddress };
							callbackFunc(result);
						});
					} else if (appConfigInfo.type == 'esri') {
						console.log("ESRI : ReverseGeocode");
						/**
						 * Reversse Geocode by ESRI
						 */
						var x = parseFloat(point[0]);
						var y = parseFloat(point[1]);
						console.log("Location::---", point);
						console.log("location::---", x, y);
						var form = new FormData();
						form.append("location", x + "," + y);
						form.append("f", "Json");

						var settings = {
							"url": appConfigInfo.esrireverseGeocode,
							"method": "POST",
							"timeout": 0,
							"processData": false,
							"mimeType": "multipart/form-data",
							"contentType": false,
							"data": form
						};

						$.ajax(settings).done(function (response) {
							var data = JSON.parse(response);
							console.log("ESRI : ReverseGeocode Response");
							// console.log("data::---", data);
							var address = data.address.LongLabel;
							result = { address: address };
							resultStatus = true;
							callbackFunc(result, response);
						});
					}
				} else if (appConfigInfo.mapData == 'trinity' && appConfigInfo.type != 'mmi') {
					var result;
					function getGeocode(token) {
						console.log("Dev Portal token ::::::::::", token)
						var reversegeocode = {
							"url": appConfigInfo.mmi_geocode_devurl + 'lat=' + point[1] + '&lng=' + point[0],
							"method": "GET",
							"timeout": 0,
							"headers": {
								"accept": "*/*",
								"Authorization": "Bearer " + token
							},
						};
						$.ajax(reversegeocode).done(function (responce) {
							console.log("Geocode Response ::", response);
							if (responce.length > 0) {
								var data = responce;
								for (var i = 0; i < data.length; i++) {
									var record = { name: data[i].name };
									result = { address: data[i].formatted_address }
								}
								callbackFunc(result)
							} else {
								result = { address: responce.results[0].formatted_address };
								console.log("Formated Address::", result);
								callbackFunc(result)
							}
						});
					}
					tmpl.Utils.getTrinityToken({
						callbackFunc: function (accessToken) {
							getGeocode(accessToken.data.access_token)
						}
					});

				} else if (appConfigInfo.mapData == 'mmi') {
					var result;
					function getGeocode(token) {
						var reversegocode = {
							"url": appConfigInfo.mmi_reversegeocode + token + '/rev_geocode?lat=' + point[1] + '&lng=' + point[0],
							"method": "GET",
							"timeout": 0,
						};

						$.ajax(reversegocode).done(function (response) {
							console.log("Goecode Response ::", response);
							if (response.length > 0) {
								var data = response;
								for (var i = 0; i < data.length; i++) {
									var record = { name: data[i].name };
									result = { address: data[i].name };
								}

								callbackFunc(result);
							} else {
								//result = {address : 'No Data'};
								result = { address: response.results[0].formatted_address };
								console.log("Formated Address::", result);
								callbackFunc(result);
							}
						});

					}

					tmpl.Utils.getMMIAccessToken({
						callbackFunc: function (accessToken) {
							console.log("Access Token::", accessToken.data.access_token);
							getGeocode(accessToken.data.access_token);
						}
					});


				} else if (appConfigInfo.mapData == 'sgl') {
					//Geocode Functionality for KarimNagar
					var accessToken = appConfigInfo.sgl_access_token;
					var result;
					function getGeocode(token) {
						try {
							var reversegeocode = {
								url:
									appConfigInfo.sgl_reversegeocode +
									point[0] + "/" +
									point[1] + "/" +
									appConfigInfo.sgl_reversegeocode_radius +
									"?SelectAttributes=[{\"column_name\":\"sub_class\"},{\"column_name\":\"road_name\"}]" +
									"&NumberOfResults=10",
								method: "GET",
								timeout: 0,
								headers: {
									"Authorization": "Bearer " + token
								}
							};

							$.ajax(reversegeocode).done(function (response) {
								console.log("Geocode Response ::", response);
								if (!response || response.length === 0) {
									callbackFunc({ address: "Not Available" });
									return;
								}
								var rec = response[0];

								var roadName = rec.road_name ? rec.road_name.trim() : "";
								var subClass = rec.sub_class ? rec.sub_class.trim() : "";

								var address = "";

								if (roadName && subClass) {
									address = roadName + ", " + subClass;
								} else if (roadName) {
									address = roadName;
								} else if (subClass) {
									address = subClass;
								} else {
									address = "Not Available";
								}

								callbackFunc({ address: address });
							});

						} catch (error) {
							console.error("Reverse geocode error:", error);
							callbackFunc({ address: "Not Available" });
						}
					}

					getGeocode(accessToken);

				} else if ((appConfigInfo.mapData == 'trinity' && appConfigInfo.type == 'mmi') || appConfigInfo.mapData == 'mdd' ) {
					var baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
					var url = baseUrl + point[0] + "," + point[1] + ".json?access_token=" + appConfigInfo.mapboxAccessToken;

					$.getJSON(url, function (data) {
						var resources = data.features;
						if (resources.length === 0) {
							return;
						}
						locationAddress = resources[0].place_name;

						var result = { address: locationAddress };
						callbackFunc(result, resources);
					}).fail(function() {
    						// If the API call fails, call the fallback function
    								callbackFunc({ address: 'Not Available' });
							});

				} else if (appConfigInfo.mapData == 'pentab') {
					var result = {};
					try {
						tmpl.Utils.getPentaBToken({
							callbackFun: function token(a) {
								// console.log("Token------------------", a);
								var settings = {
									"url": appConfigInfo.pentaBAPIService + "/findAddress",
									"method": "POST",
									"timeout": 0,
									"headers": {
										"PentaUserRole": appConfigInfo.PentaUserRole,
										"PentaOrgID": appConfigInfo.PentaOrgID,
										"PentaSelectedLocale": appConfigInfo.PentaSelectedLocale,
										"Authorization": a,
										"Content-Type": "application/json",
									},
									"data": JSON.stringify([{
										"dataSource": {
											"id": appConfigInfo.PentaPlaceGeocodeId,
											"datasourceType": "postgres"
										},
										"locations": [{
											"longitude": point[0],
											"latitude": point[1]
										}],
										"crs": "EPSG:4326"
									}]),
								};
								$.ajax(settings).done(function (response) {
									var address = response[0][0].display_data_ar;
									if (address) {
										result = {
											address: address
										};
										resultStatus = true;
										callbackFunc(result, response[0][0]);
									} else {
										result = {
											address: 'Not Available'
										};
										resultStatus = false;
									}
								});

							}
						});
					} catch (e) {
						console.log("PentaB API Service Issue..!", appConfigInfo.pentaBAPIService);
						result = {
							address: 'Not Available'
						};
						resultStatus = false;
					}

				} else {
					callbackFunc({ address: 'Not Available' });
				
				}
			}
		}
		else {
			1// var baseUrl = appConfigInfo.mapboxGeocoderUrl;
			if(appConfigInfo.type == 'esri'){
				console.log("ESRI : ReverseGeocode");
						/**
						 * Reversse Geocode by ESRI
						 */
						var x = parseFloat(point[0]);
						var y = parseFloat(point[1]);
						console.log("Location::---", point);
						console.log("location::---", x, y);
						var form = new FormData();
						form.append("location", x + "," + y);
						form.append("f", "Json");

						var settings = {
							"url": appConfigInfo.esrireverseGeocode,
							"method": "POST",
							"timeout": 0,
							"processData": false,
							"mimeType": "multipart/form-data",
							"contentType": false,
							"data": form
						};

						$.ajax(settings).done(function (response) {
							var data = JSON.parse(response);
							console.log("ESRI : ReverseGeocode Response");
							// console.log("data::---", data);
							var address = data.address.LongLabel;
							result = { address: address };
							resultStatus = true;
							// console.log("address",address)
							callbackFunc(result, response);
						});
			}
			else{
				var baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
				var url = baseUrl + point[0] + "," + point[1] + ".json?access_token=" + appConfigInfo.mapboxAccessToken;

				$.getJSON(url, function (data) {
					var resources = data.features;
					if (resources.length === 0) {
						return;
					}
					locationAddress = resources[0].place_name;

					var result = { address: locationAddress };
					callbackFunc(result, resources);
				});
			}

		}
	}
	catch (err) {

		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
	}
	return response = { status: true, message: 'getGeocode API Is Enabled..!' };
}



tmpl.Geocode.getGeocodeAPI = function (params) {
	var resultStatus;
	var point = params.point;
	var callbackFunc = params.callbackFunc;

	try {
		if (point === null || point === undefined || point.length == 0) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid point parameter' };
		}

		if (!callbackFunc) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: error.message };
		}
	}

	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapLib === 'ol7') {
				if (appConfigInfo.mapData == 'google') {

					var x = parseFloat(point[0]);
					var y = parseFloat(point[1]);

					var coordinates = { lat: y, lng: x };
					var result = { address: 'NA' };



				} else {

				}
			}
		}
		else {
			var baseUrl = appConfigInfo.mapboxGeocoderUrl;
			var url = baseUrl + point[0] + "," + point[1] + ".json?access_token=" + appConfigInfo.mapboxAccessToken;

			$.getJSON(url, function (data) {
				var resources = data.features;
				if (resources.length === 0) {
					return;
				}
				locationAddress = resources[0].place_name;

				var result = { address: locationAddress };
				callbackFunc(result, resources);
			});
		}
	}
	catch (err) {

		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: err.message };
	}
	return response = { status: true, message: 'getGeocode API Is Enabled..!' };
}

tmpl.Geocode.getAccessToken = function (params) {
	try {
		var token = "";
		var settings = {
			"url": appConfigInfo.apiManGetAccessToken,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"accept": "application/json",
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"authorizationKey": appConfigInfo.apiManAuthorizationKey,
				"username": appConfigInfo.apiManUsername,
				"password": appConfigInfo.apiManPassword,
				"grantType": "password"
			}),
		};

		$.ajax(settings).done(function (response) {
			//console.log("AUthorization token :: ", response);
			token = response.access_token;
			console.log("AUthorization token :: ", token);
		});
		return token;
	} catch (error) {
		console.error("Error while fetching the access token :: ", error);
	}
}


tmpl.Geocode.getReverseGeocode = function (params) {
	var resultStatus;
	var address = params.address;
	var callbackFunc = params.callbackFunc;
	var result;

	try {
		if (address === null || address === undefined || address === '') {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid address parameter' };
		}


		if (!callbackFunc) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapData == 'google') {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({ 'address': address }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var cord = results[0].geometry.location;
						console.log(results);
						result = { coordinates: cord, status: true, message: 'Location Available..!' };
						resultStatus = true;
					}
					else {

						result = { coordinates: [], status: false, message: 'Location Not Available..!' };
						resultStatus = false;
					}
					//console.log("!!!!!!!!!@", result);
					callbackFunc(result);
				});
			}
			else {
				return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapDimension ' };
			}
		}
	} catch (error) {
		if (error instanceof Error) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	return response = { status: true, message: 'ReverseGeocode API Enabled..' };
}

tmpl.Geocode.getReverseGeocodeAPI = function (params) {
	var resultStatus;
	var address = params.address;
	var callbackFunc = params.callbackFunc;
	var result;

	try {
		if (address === null || address === undefined || address === '') {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid address parameter' };
		}


		if (!callbackFunc) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
	try {
		if (appConfigInfo.mapDimension == "2D") {
			if (appConfigInfo.mapData == 'google') {

				var tokenFrom = tmpl.Geocode.getAccessToken({});
				var data_response = []
				var settings = {
					"url": appConfigInfo.apiManUrlForGecode + "/geocode?address=" + address + "&key=" + appConfigInfo.googleMapKey,
					"method": "GET",
					"timeout": 0,
					"headers": {
						"accept": "application/json",
						"Authorization": "Bearer " + tokenFrom
					}
				};

				$.ajax(settings).done(function (response) {
					//console.log("Geocode Data Lat and Lon :: ", response.results[0].geometry.location);
					if (response.results[0]) {
						data_response = response.results[0].geometry.location
						callbackFunc(data_response);
						return response = { status: true, message: 'ReverseGeocode API Enabled..' };
					} else {
						data_response = { "message": "Your google key get expired or you hitted max request!" }
						callbackFunc(data_response);
						return response = { status: false, businesserrorcode: 'TB_GISSDK_0x011', developererrorcode: 'TD_GISSDK_0x011', message: 'Your google key get expired or you hitted max request!' };
					}
				});
			}
			else {
				return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid mapDimension ' };
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
}

tmpl.Geocode.getLocality = function (params) {
	var resultStatus;
	var point = params.point;
	var callbackFunc = params.callbackFunc;

	try {
		if (point === null || point === undefined || point.length == 0) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid point parameter' };
		}

		if (!callbackFunc) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			console.log("tmpl.Geocode.getLocality : ", error.message);
		}
	}

	if (appConfigInfo.mapLib === 'ol7') {
		if (appConfigInfo.mapData == 'google') {
			var x = parseFloat(point[0]);
			var y = parseFloat(point[1]);
			var coordinates = { lat: y, lng: x };
			var result123 = {}, addressSeparate = [];

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': coordinates
			}, function (results, status) {

				if (status == google.maps.GeocoderStatus.OK) {
					var completeAddress = {};
					if (results[0]) {
						if (results[results.length - 1] == undefined || results[results.length - 1] == null) {
							completeAddress.Country = "No Data";
						} else {
							completeAddress.Country = results[results.length - 1].formatted_address;
						}
						if (results[results.length - 2] == undefined || results[results.length - 2] == null) {
							completeAddress.State = "No Data";
						} else {
							completeAddress.State = results[results.length - 2].address_components[0].long_name;
						}
						if (results[results.length - 3] == undefined || results[results.length - 3] == null) {
							completeAddress.District = "No Data";
						} else {
							completeAddress.District = results[results.length - 3].address_components[0].long_name;
						}
						if (results[results.length - 4] == undefined || results[results.length - 4] == null) {
							completeAddress.Pincode = "No Data";
						} else {
							completeAddress.Pincode = results[results.length - 4].address_components[0].long_name;
						}
						if (results[results.length - 5] == undefined || results[results.length - 5] == null) {
							completeAddress.Place = "No Data";
						} else {
							completeAddress.Place = results[results.length - 5].address_components[0].long_name;
						}
						if (results[results.length - 6] == undefined || results[results.length - 6] == null) {
							completeAddress.Place2 = "No Data";
						} else {
							completeAddress.Place2 = results[results.length - 6].address_components[0].long_name;
						}
						completeAddress.Address = results[0].formatted_address;
					}
				}
				callbackFunc(completeAddress);
			});
			return response = { status: true, message: 'Get locality API Enabled..' };
		}
	}

}

tmpl.Geocode.getLocalityAPI = function (params) {
	var resultStatus;
	var point = params.point;
	var callbackFunc = params.callbackFunc;

	try {
		if (point === null || point === undefined || point.length == 0) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid point parameter' };
		}

		if (!callbackFunc) {

			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
		}

	} catch (error) {
		if (error instanceof Error) {
			console.log("tmpl.Geocode.getLocality : ", error.message);
		}
	}

	if (appConfigInfo.mapLib === 'ol7') {
		if (appConfigInfo.mapData == 'google') {
			var x = parseFloat(point[0]);
			var y = parseFloat(point[1]);
			var coordinates = { lat: y, lng: x };
			var result123 = {}, addressSeparate = [];

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': coordinates
			}, function (results, status) {

				if (status == google.maps.GeocoderStatus.OK) {
					var completeAddress = {};
					if (results[0]) {
						if (results[results.length - 1] == undefined || results[results.length - 1] == null) {
							completeAddress.Country = "No Data";
						} else {
							completeAddress.Country = results[results.length - 1].formatted_address;
						}
						if (results[results.length - 2] == undefined || results[results.length - 2] == null) {
							completeAddress.State = "No Data";
						} else {
							completeAddress.State = results[results.length - 2].address_components[0].long_name;
						}
						if (results[results.length - 3] == undefined || results[results.length - 3] == null) {
							completeAddress.District = "No Data";
						} else {
							completeAddress.District = results[results.length - 3].address_components[0].long_name;
						}
						if (results[results.length - 4] == undefined || results[results.length - 4] == null) {
							completeAddress.Pincode = "No Data";
						} else {
							completeAddress.Pincode = results[results.length - 4].address_components[0].long_name;
						}
						if (results[results.length - 5] == undefined || results[results.length - 5] == null) {
							completeAddress.Place = "No Data";
						} else {
							completeAddress.Place = results[results.length - 5].address_components[0].long_name;
						}
						if (results[results.length - 6] == undefined || results[results.length - 6] == null) {
							completeAddress.Place2 = "No Data";
						} else {
							completeAddress.Place2 = results[results.length - 6].address_components[0].long_name;
						}
						completeAddress.Address = results[0].formatted_address;
					}
				}
				callbackFunc(completeAddress);
			});
			return response = { status: true, message: 'Get locality API Enabled..' };
		}
	}

}