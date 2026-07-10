


tmpl.Utils.getAccessToken = function(params){

	var callbackFunc = params.callbackFunc;

	if (!callbackFunc) {
			
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
	}


	let returnData = {
		status : false,
		message : "Unable to Obtain Access Token",
		data : {}
	}

	try {

	console.log(appConfigInfo.apiManURL+"tiotAPIESBSubSystem/"+appConfigInfo.apiManVersion+"/getAccessToken");

	let access_token;

	var settings = {
		"url": appConfigInfo.apiManURL+"tiotAPIESBSubSystem/"+appConfigInfo.apiManVersion+"/getAccessToken",
		"method": "POST",
		"timeout": 0,
		"headers": {
		  "accept": "*/*",
		  "Authorization": "Bearer eyJ4NXQiOiJNV0l5TkRJNVlqRTJaV1kxT0RNd01XSTNOR1ptTVRZeU5UTTJOVFZoWlRnMU5UTTNaVE5oTldKbVpERTFPVEE0TldFMVlUaGxNak5sTldFellqSXlZUSIsImtpZCI6Ik1XSXlOREk1WWpFMlpXWTFPRE13TVdJM05HWm1NVFl5TlRNMk5UVmhaVGcxTlRNM1pUTmhOV0ptWkRFMU9UQTROV0UxWVRobE1qTmxOV0V6WWpJeVlRX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmMGQyMDRjNS01Mzg1LTRiNjQtOGVmZi1jODY2YTk1ZTM2YjIiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6IlByRUJkSGltOTgyTF9PMVByR3FWZE4ySGI1OGEiLCJuYmYiOjE2OTQ3NTcxNTMsImF6cCI6IlByRUJkSGltOTgyTF9PMVByR3FWZE4ySGI1OGEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvMTkyLjE2OC4yMjAuMTAxOjk0NDZcL29hdXRoMlwvdG9rZW4iLCJleHAiOjE2OTQ3NjA3NTMsImlhdCI6MTY5NDc1NzE1MywianRpIjoiZmFmZGEwMzAtZmMyNy00ODQwLWJkZmItOWI1YzM4MjQ1ODZmIiwiY2xpZW50X2lkIjoiUHJFQmRIaW05ODJMX08xUHJHcVZkTjJIYjU4YSJ9.S8Jqb8Iu6qmXcadwn2SNNSiaFKHD7ALK8QkVLNvnzDYj3bNQg51afNm5grbDHao10T-ODofqiEbCShMhWqfNX5OUdp6R1eslQpfLSiQoxhm8sVK-Qsr1j01S1G6j-cn9kMTfRLF1K-n7gXApgxtoMJzMLVTLRlqXtaBCrH1tk4zPQfTOGWqgmtfvfq4qPUc35EJfTFdj6O6qW3kL229-zP1HJDxbZgpzVT5qW1yydAr_klgFJwTVH90e9NezYVygk5Jxjdio3xj4EOwGv7J6FEYmDILhBEoX9GCOC3n6pt5mWyygtew0oQf_9CqE1_Rvzm1M2GHF6IBmIrY3S5o4Yg",
		  "Content-Type": "application/json"
		},
		"data": JSON.stringify({
		  "password": appConfigInfo.apimanUser,
		  "authorizationKey": appConfigInfo.apiManKey,
		  "grantType": "password",
		  "username": appConfigInfo.apimanPass
		}),
	  };

	
	
	  
	  $.ajax(settings).done(function (response) {
		console.log(" :::::: getAccessToken ::::::: ",response);

		if(response != null && response != undefined ) {

			returnData.status = true;
			returnData.message = "Access Token Obtained Successfully"
			returnData.data.access_token  = response.access_token;

			console.log(" :::::: returnData ::::::: ",returnData);

			callbackFunc(returnData);

		} else {
			callbackFunc(returnData);
		}

	  });
	} catch (error) {

		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc( { status: false , businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message})
	
	}

}



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
			console.log(" ::::: getAccessToken ::::: ", res);
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





tmpl.Utils.getMMIAccessToken = function(params){

	var callbackFunc = params.callbackFunc;

	if (!callbackFunc) {
			
		return response = { status: false, businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', message: 'Invalid callbackFunc' };
	}


	let returnData = {
		status : false,
		message : "Unable to Obtain Access Token",
		data : {}
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
		console.log(" :::::: getAccessToken ::::::: ",response);

		if(response != null && response != undefined ) {

			returnData.status = true;
			returnData.message = "Access Token Obtained Successfully"
			returnData.data.access_token  = response.access_token;

			console.log(" :::::: returnData ::::::: ",returnData);

			callbackFunc(returnData);

		} else {
			callbackFunc(returnData);
		}

	  });
	} catch (error) {

		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc( { status: false , businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message})
	
	}

}
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
				console.log("PentaB Access Token :-:", toc);
				localStorage.setItem('pentaBAccessToken', toc);
				callbackFun(toc);
			}
			else {
				var toc = "Bearer " + response.access_token;
				pentaBAccessToken = toc;

				console.log("PentaB Access Token :-:", toc);
				localStorage.setItem('pentaBAccessToken', toc);
				return toc;
			}
	 }, 0);
 });
}


tmpl.Utils.getTrinityToken=function(params) {
	var callbackFunc = params.callbackFunc;

	
	if (callbackFunc === null || callbackFunc === undefined || callbackFunc === '' || callbackFunc === "") {
		return response = { status: 'false', Businesserrorcode: 'TD_GISSDK_0x001', Developererrorcode: 'TD_GISSDK_0x001', message: 'Not a Valid callbackFunc' };
	}

	
	let returnData = {
		status : false,
		message : "Unable to Obtain Access Token",
		data : {}
	}

	try{
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
			console.log(" :::::: getAccessToken ::::::: ",response);

			if(response != null && response != undefined ) {
	
				returnData.status = true;
				returnData.message = "Access Token Obtained Successfully"
				returnData.data.access_token  = response.access_token;
	
				console.log(" :::::: returnData ::::::: ",returnData);	
				callbackFunc(returnData);
	
			} else {
				callbackFunc(returnData);
			}
		});

	}catch (error) {
		console.log("::::: Error While Getting the API Man Access Token :::::", e.message);
		callbackFunc( { status: false , businesserrorcode: 'TB_GISSDK_0x001', developererrorcode: 'TD_GISSDK_0x001', businessmessage: 'Error While Getting the API Man Access Token', developermessage: 'Error While Getting the API Man Access Token' + e.message})
	
	}

	
}