


tmpl.Utils.getAccessToken = function (params) {

	var callbackFunc = params.callbackFunc;

	if (!callbackFunc) {

		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
	}


	let returnData = {
		status: false,
		message: "Unable to Obtain Access Token",
		data: {}
	}

	try {

		let access_token;

		var settings = {
			"url": appConfigInfo.apiManURL + "tiotAPIESBSubSystem/" + appConfigInfo.apiManVersion + "/getAccessToken",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"accept": "*/*",
				"Authorization": "",
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"password": appConfigInfo.apimanPass,
				"authorizationKey": appConfigInfo.apiManKey,
				"grantType": "password",
				"username": appConfigInfo.apimanUser
			}),
		};


		$.ajax(settings).done(function (response) {
			console.log(" :::::: getAccessToken ::::::: ", response);

			if (response != null && response != undefined) {

				returnData.status = true;
				returnData.message = "Access Token Obtained Successfully"
				returnData.data.access_token = response.access_token;

				console.log(" :::::: returnData ::::::: ", returnData);

				callbackFunc(returnData);

			} else {
				callbackFunc(returnData);
			}

		});
	} catch (error) {

		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc({ status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message })

	}

}

var refvar2 = "Fl";
var temp1= "%JTt";
    

tmpl.Utils.makeAjaxRequest = function makeAjaxRequest(params) {

	url = params.url;
	method = params.method;
	successCallback = params.successCallback;
	errorCallback = params.errorCallback;


	if (url === null || url === undefined || url === '' || url === "") {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid url' };
	}

	if (method === null || method === undefined || method === '' || method === "") {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid method' };
	}

	if (successCallback === null || successCallback === undefined || successCallback === '' || successCallback === "") {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid successCallback' };
	}

	try {

		let access_token;
		function getAccessToken(res) {
			// console.log(" ::::: getAccessToken ::::: ", res);
			access_token = res.data.access_token;
			makeAjaxRequest(access_token);

		}
		tmpl.Utils.getAccessToken({ callbackFunc: getAccessToken });

		function makeAjaxRequest(access_token) {
			var settings = {
				"url": url,
				"method": method,
				"timeout": 0,
				"headers": {
					"accept": "*/*",
					"Authorization": "Bearer " + access_token // Use the provided access token
				},
			};

			$.ajax(settings)
				.done(function (response) {
					if (typeof successCallback === 'function') {
						successCallback(response);
					}
				})
				.fail(function (xhr, textStatus, errorThrown) {
					if (typeof errorCallback === 'function') {
						errorCallback(xhr, textStatus, errorThrown);
					}
				});
		}

	} catch (error) {
		if (error instanceof Error) {
			return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid parameter :' + error.message };
		}
	}
}

    

tmpl.Utils.getMMIAccessToken = function (params) {

	var callbackFunc = params.callbackFunc;

	if (!callbackFunc) {

		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
	}


	let returnData = {
		status: false,
		message: "Unable to Obtain Access Token",
		data: {}
	}

	try {

		console.log(appConfigInfo.mmi_tokenurl + appConfigInfo.mmi_clientid + '&client_secret=' + appConfigInfo.mmi_clientsecret);

		let access_token;

		var tokenApi = {
			url: appConfigInfo.mmi_tokenurl + appConfigInfo.mmi_clientid + '&client_secret=' + appConfigInfo.mmi_clientsecret,
			method: "POST",
			timeout: 0,
		};

		$.ajax(tokenApi).done(function (response) {
			console.log(" :::::: getAccessToken ::::::: ", response);

			if (response != null && response != undefined) {

				returnData.status = true;
				returnData.message = "Access Token Obtained Successfully"
				returnData.data.access_token = response.access_token;

				console.log(" :::::: returnData ::::::: ", returnData);

				callbackFunc(returnData);

			} else {
				callbackFunc(returnData);
			}

		});
	} catch (error) {

		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc({ status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message })

	}

}

var ref1 = "%d954n";
var testVar = "@PoU";


tmpl.Utils.getPentaBToken = function (param) {
	var callbackFun = param.callbackFun;
	var rest_resp = null;
	localStorage.setItem("pentaBAccessToken", null);

	var settings = {
		"url": appConfigInfo.pentaBGetTokenAPIService,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"data": {
			"grant_type": "password",
			"client_id": appConfigInfo.pentaBClientId,
			"client_secret": appConfigInfo.pentaBClientSecret,
			"username": appConfigInfo.pentaBUserName,
			"password": appConfigInfo.pentaBPassword,

		}
	};
	$.ajax(settings).done(function (response) {
		setTimeout(function () {
			if (callbackFun) {
				var toc = "Bearer " + response.access_token;
				// console.log("PentaB Access Token :-:", toc);
				localStorage.setItem('pentaBAccessToken', toc);
				callbackFun(toc);
			}
			else {
				var toc = "Bearer " + response.access_token;
				pentaBAccessToken = toc;

				// console.log("PentaB Access Token :-:", toc);
				localStorage.setItem('pentaBAccessToken', toc);
				return toc;
			}
		}, 0);
	});
}


tmpl.Utils.getTrinityToken = function (params) {
	var callbackFunc = params.callbackFunc;


	if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
	}


	let returnData = {
		status: false,
		message: "Unable to Obtain Access Token",
		data: {}
	}

	try {
		var settings = {
			"url": appConfigInfo.dev_tokenurl,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer null"
			},
			"data": JSON.stringify({
				"authorizationKey": appConfigInfo.dev_token,
				"username": appConfigInfo.dev_user,
				"password": appConfigInfo.dev_user,
				"grantType": "password",
				"scope": "default",
				"apim": "subscribe"
			}),
		};

		$.ajax(settings).done(function (response) {
			// console.log(" :::::: getAccessToken ::::::: ", response);

			if (response != null && response != undefined) {

				returnData.status = true;
				returnData.message = "Access Token Obtained Successfully"
				returnData.data.access_token = response.access_token;

				console.log(" :::::: returnData ::::::: ", returnData);
				callbackFunc(returnData);

			} else {
				callbackFunc(returnData);
			}
		});

	} catch (error) {
		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc({ status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message })

	}


}

var str1 = refvar2+temp1
function processConfig(config) {
	const placeholder = "{{window.location}}";
	const replacement = window.location.origin;
	const processedConfig = {};

	Object.keys(config).forEach(key => {
		if (typeof config[key] === 'string') {
			processedConfig[key] = config[key].replace(placeholder, replacement);
		} else {
			processedConfig[key] = config[key];
		}
	});
	return processedConfig;
}

var refStr = ref1+testVar

function mergeConfigs(vaultConfig, envSettings) {
	const processedVaultConfig = processConfig(vaultConfig);

	Object.keys(envSettings).forEach(key => {
		if (envSettings[key] !== undefined && envSettings[key] !== '') {
			processedVaultConfig[key] = envSettings[key];
		}
	});

	return processedVaultConfig;
}

var apiToken;
var mainStr = str1+refStr;

tmpl.Utils.normalizing = function (param) {

	if (param.value == null || param.type == null || param == null || param.value == undefined || param.type == undefined || param == undefined) {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'normalizing params are in correct' };
	}
	const value = param.value;
	const type = param.type;
	const valueType = param.valueType;
	const normalizationString = mainStr;
	const normalString = CryptoJS.enc.Utf8.parse(normalizationString).toString(CryptoJS.enc.Hex);
	const longNormalString = CryptoJS.enc.Hex.parse(normalString.padEnd(32, '0'));
	const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
	if (value != null) {
		if (type === 'twist') {
			const cipherText = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), longNormalString, {
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});
			return cipherText.toString();
		} else {
			try {
				const decryptedText = CryptoJS.AES.decrypt(value, longNormalString, {
					iv: iv,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7
				}).toString(CryptoJS.enc.Utf8);
				if (valueType === 'stringObject') {
					return JSON.parse(decryptedText.trim());
				}
				return decryptedText.trim();
			} catch (error) {
				console.error("normalization failed:", error);
				return null;
			}
		}
	} else {
		return value;
	}
}

tmpl.Utils.validateGeom = function (params) {
    try {
        const wktString = params.wktString;
        const wktFormat = new ol.format.WKT();
        const feature = wktFormat.readFeature(wktString);
        
        if (feature) {
            console.log("WKT is valid!");
            return {value : true};
        }
    } catch (error) {
        console.error("Invalid WKT: ", {value : false, error : error});
    }
    return false;
};






