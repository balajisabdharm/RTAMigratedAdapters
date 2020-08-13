/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

//Adapter Constants

var adapterName = "authenticationUAEPass";
var WSDL_Path = "/UAEPassIntegrationService";
var adapterRealm ="UAEPassAdapterAuthRealm";
//var redirectUri = "https://mfp-staging.rta.ae:6443/UAEPassCallback/uaePassRedirect";
var redirectUri = "https://mfp-staging.rta.ae:6443/UAEPassCallback/uaePassRedirect";
//producation url
//var redirectUri = "https://m.rta.ae/UAEPassCallback/uaePassRedirect";

//private static final String UAE_PASS_CLIENT_ID = <<INSERT_CLIENT_ID_HERE>>;
//private static final String UAE_PASS_CLIENT_SECRET = <<INSERT_CLIENT_SECRET_HERE>>;
//private static final String REDIRECT_URL = <<INSERT_REDIRECT_URL_HERE>>;
//private static final String DOCUMENT_SIGNING_SCOPE = "urn:safelayer:eidas:sign:process:document";
//private static final String RESPONSE_TYPE = "code";
//private static final String SCOPE = "urn:uae:digitalid:profile";
//private static final String ACR_VALUES_MOBILE = "urn:digitalid:authentication:flow:mobileondevice";
//private static final String ACR_VALUES_WEB = "urn:safelayer:tws:policies:authentication:level:low";
//private static final String UAE_PASS_PACKAGE_ID = "ae.uaepass.mainapp";
//private static final Environment UAE_PASS_ENVIRONMENT = <<INSERT_ENVIRONMENT_ENUM_HERE>>

//Helpers Functions

//TODO function convertJStoString(input) , should return string value
function toString(param) {
	try {
		var isBoolean = function (arg) { return typeof arg === 'boolean'; }
		var isNumber = function (arg) { return typeof arg === 'number'; }
		var isString = function (arg) { return typeof arg === 'string'; }
		var isFunction = function (arg) { return typeof arg === 'function'; }
		var isObject = function (arg) { return typeof arg === 'object'; }
		var isUndefined = function (arg) { return typeof arg === 'undefined'; }

		if (isUndefined(param)) {
			return "undefined";
		} else if (isObject(param)) {
			return JSON.stringify(param);
		} else if (isString(param)) {
			return param;
		} else {
			//in case of numbers and boolean functions
			return param.toString();
		}
	} catch (e) {
		return param;
	}
}
function convertObiectToArray(Object) {
	if (Object != null && Object != undefined && !(Object instanceof Array)) {
		return [Object];
	}
	return Object;
}

function handleError(msg, code) {


	adapterLogger("handleError", "error", "Proc. Input", JSON.stringify([msg, code]));


	var msg = "Internal Server Error";
	var code = code || 500;

	return {
		"isSuccessful": false,
		"code": code,
		"message": msg,
		"name": adapterName,
		"authRequired": true
	}

	// name: 'authenticationUAEPass',
	// authRequired: false,
	_handleError.errorMessage = errorMessage ? errorMessage : null;
	_handleError.name = "authenticationUAEPass";
	_handleError.authRequired = true;
	var description = msg;
	var msg = "Internal Server Error";
	var code = code || 500;

	//adapterLogger("authenticationUAEPass","error", "Internal Error",JSON.stringify([msg,code]));

	return {
		"isSuccessful": false,
		"error": {
			"code": code,
			"message": msg,
			"description": description,
			"adapter": adapterName
		}
	};
}
function adapterLogger(procudureName, errorLevel, suffix, msg) {
	var _msg = toString(msg) || "";
	try {
		var prefix = "|" + adapterName + " |" + procudureName + " |" + suffix + " : ";
		switch (errorLevel) {
			case "error":
				MFP.Logger.error(prefix + _msg);
				break;
			case "warn":
				MFP.Logger.warn(prefix + _msg);
				break;
			case "info":
				MFP.Logger.info(prefix + _msg);
				break;
			case "exception":
				MFP.Logger.error(prefix + _msg);
				break;
		}
	} catch (e) {
		MFP.Logger.error("|" + adapterName + " |adapterLogger |Exception" + JSON.stringify(e));
	}
}

function invokeWebService(body, headers) {
	var input = {
		method: 'post',
		returnedContentType: 'xml',
		returnedContentEncoding: 'utf-8',
		path: WSDL_Path,//'/UAEPassIntegrationService',
		headers: headers,
		body: {
			content: body.toString(),
			contentType: 'text/xml; charset=utf-8'
		}
	};
	return WL.Server.invokeHttp(input);
}

//Adapter Procdures (Exposed and not Exposed)
function onAuthRequired(headers, errorMessage) {

	var _handleError = handleError("Unauthorized", 401);
	_handleError.errorMessage = errorMessage ? errorMessage : null;
	_handleError.name = "authenticationUAEPass";
	_handleError.authRequired = true;
	return _handleError;
}
function onLogout(headers, errorMessage) {
	//WL.Server.setActiveUser("masterAuthRealm", null);
	//WL.Server.setActiveUser("AMAdapterAuthRealm", null);
	//WL.Server.setActiveUser("AdapterAuthRealm", null);
	//WL.Server.setActiveUser("UAEPassAdapterAuthRealm", null);

	return {
		name: 'authenticationUAEPass'
	};
}


function getUserProfile(appId, redirectUri, authorizationCode) {
	try {
		// Logging Adapter Inputs
		adapterLogger("getUserProfile", "info", "Adapter Input", JSON.stringify([appId, redirectUri, authorizationCode]));

		if (appId && redirectUri && authorizationCode) {
                         // update get user profile 
			var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:uaep="http://www.rta.ae/schemas/UAEPassIntegrationService/UAEPassIntegrationSchema.xsd"> <soapenv:Header> <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> <wsse:UsernameToken wsu:Id="UsernameToken-1"> <wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username> <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password> <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">+RYFlUgxngTpN8ke3apUQQ==</wsse:Nonce> <wsu:Created>2019-02-05T08:11:44.077Z</wsu:Created> </wsse:UsernameToken> </wsse:Security> </soapenv:Header> <soapenv:Body> <uaep:getUserProfileRequest> <uaep:appId>DNVAPP</uaep:appId> <uaep:redirectUri>' + redirectUri + '</uaep:redirectUri> <uaep:authorizationCode>' + authorizationCode + '</uaep:authorizationCode> </uaep:getUserProfileRequest> </soapenv:Body> </soapenv:Envelope>';
			adapterLogger("getUserProfile", "info", "Soap Request", request);
			var response = invokeWebService(request);
			adapterLogger("getUserProfile", "info", "Soap Response", JSON.stringify(response));
			var RTAUserProfile = null;
			var UAEPassUserProfile = null;
			var internalResponse;
			if (response && response.isSuccessful && response.statusCode == 200) {

				if (response.Envelope && response.Envelope.Body && response.Envelope.Body.getUserProfileResponse) {

					var getUserProfileResponse = response.Envelope.Body.getUserProfileResponse;
					if (getUserProfileResponse && getUserProfileResponse.UAEPassUserProfile) {
						UAEPassUserProfile = getUserProfileResponse.UAEPassUserProfile;
					}
					if (getUserProfileResponse && getUserProfileResponse.RTAUserProfile) {
						RTAUserProfile = getUserProfileResponse.RTAUserProfile;
					}
					internalResponse = {
						UAEPassUserProfile: UAEPassUserProfile,
						RTAUserProfile: RTAUserProfile
					};
					adapterLogger("getUserProfile", "info", "Procudure Response", JSON.stringify(internalResponse));
					return internalResponse;
				}

				//TODO No Profile
				internalResponse = {
					UAEPassUserProfile: null,
					RTAUserProfile: null
				};
				adapterLogger("getUserProfile", "info", "Procudure Response", JSON.stringify(internalResponse));
				return internalResponse;

			}
			else {
				// adapterLogger("getUserProfile","error", "Status Code is not 200");
				response = handleError("Status Code is not 200", 500);
				adapterLogger("getUserProfile", "error", "Status Code is not 200", JSON.stringify(response));
				return response;
			}
		}
		else {
			return handleError("Invalid Parameters", 406);
		}
	}
	catch (error) {
		adapterLogger("getUserProfile", "error", "Exception", toString(error));
		return handleError();
	}
}
function submitAuthentication(authorizationCode, appId, appRedirectUri) {
	try {

		adapterLogger("submitAuthentication", "info", "Adapter Input", JSON.stringify([authorizationCode, appId, appRedirectUri]));

		if (!authorizationCode || !appId) {
			return handleError("Invalid Parameters", 406);
		}

		var _redirectUri = redirectUri;
		if (appRedirectUri) {
			_redirectUri = appRedirectUri;
		}

		onLogout();
		if (authorizationCode) {
			var userProfile = getUserProfile(appId, _redirectUri, authorizationCode);
			var _RTAUserProfile = userProfile.RTAUserProfile;
			var _UAEPassUserProfile = userProfile.UAEPassUserProfile;
			if (_UAEPassUserProfile != null && _RTAUserProfile != null) {

				var user_id = _RTAUserProfile.userId || "";
				var cn = _RTAUserProfile.userId || "";
				var title_ar = _RTAUserProfile.title ? _RTAUserProfile.title.titleAr : "";
				var title_en = _RTAUserProfile.title ? _RTAUserProfile.title.titleEn : "";
				var first_name_ar = _RTAUserProfile.firstName || "";
				var first_name_en = _RTAUserProfile.firstName || "";
				var middlename_ar = _RTAUserProfile.middleName || "";
				var middlename_en = _RTAUserProfile.middleName || "";
				var last_name_ar = _RTAUserProfile.lastName || "";
				var last_name_en = _RTAUserProfile.lastName || "";
				var date_of_birth = _UAEPassUserProfile.dob ? new Date(_UAEPassUserProfile.dob) : "";
				var id_number = _UAEPassUserProfile.idn || "";
				var nationality_ar = _RTAUserProfile.nationality ? _RTAUserProfile.nationality.nationalityAr : "";
				var nationality_en = _RTAUserProfile.nationality ? _RTAUserProfile.nationality.nationalityEn : "";
				var mobile = _RTAUserProfile.mobileNo || "";
				var mail = _RTAUserProfile.email || "";
				var preferred_language = _RTAUserProfile.prefLanguage || "";
				var preferred_communication = _RTAUserProfile.prefComm || "";
				var portal_id = _RTAUserProfile.prefComm || "";
				var password_changed_flag = 0;
				var isEmailVerified = _RTAUserProfile.isEmailVerified || "true";
				var isMobileVerified = _RTAUserProfile.isMobileVerified || "false";
				var isEmiratesIdVerified = _RTAUserProfile.isEmiratesIdVerified || "false";
				var title_id = _RTAUserProfile.title ? _RTAUserProfile.title.titleID : "";
				var nationality_id = _RTAUserProfile.nationality ? _RTAUserProfile.nationality.nationalityID : "";
				var user_type = _RTAUserProfile.userType || "";
				var trafficNo = _RTAUserProfile.trafficNo || "";
				var _serviceRelatedInfo = null;
				var finalResponse = null;
				adapterLogger("submitAuthentication", "info", "User Id : ", user_id);
				var identity = {
					userId: user_id
				};
				//WL.Server.setActiveUser("masterAuthRealm", identity);
				
				var trialsSetUserInfo = 5;
				while (trialsSetUserInfo > 0) {
					var invocationData = {
						adapter: 'userProfile',
						procedure: 'setUserInfo',
						parameters: [user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar,
							nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, isEmailVerified, isMobileVerified, isEmiratesIdVerified,
							title_id, nationality_id, user_type, trafficNo]
					};
					adapterLogger("submitAuthentication |setUserInfo", "info", "Request", JSON.stringify(invocationData));
					var shellDatabaseResponse = MFP.Server.invokeProcedure(invocationData);
					adapterLogger("submitAuthentication |setUserInfo", "info", "Response", JSON.stringify(shellDatabaseResponse));
					// setUserIdentity(user_id);
					if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
						trialsSetUserInfo = 0;

						var trialsGetUserProfile = 5;
						while (trialsGetUserProfile > 0) {
							invocationData = {
								adapter: 'userProfile',
								procedure: 'getUserProfile',
								parameters: [user_id]
							};

							var fullUserProfileResponse = MFP.Server.invokeProcedure(invocationData);
							if (fullUserProfileResponse && fullUserProfileResponse.isSuccessful) {
								trialsGetUserProfile = 0;
								if (_RTAUserProfile.serviceRelatedInfo)
									_serviceRelatedInfo = (Object.prototype.toString.call(_RTAUserProfile.serviceRelatedInfo) === '[object Array]') ? _RTAUserProfile.serviceRelatedInfo : convertObiectToArray(_RTAUserProfile.serviceRelatedInfo);


								var finalResponse = {
									name: 'authenticationUAEPass',
									authRequired: false,
									UAEPassProfile: _UAEPassUserProfile,
									havePortalAccount: true,
									userProfile: fullUserProfileResponse,
									serviceRelatedInfo: _serviceRelatedInfo,
								};
								adapterLogger("submitAuthentication", "info", "Response Returned Successfully", toString(finalResponse));
								return finalResponse;
							}
							else {
								trialsGetUserProfile--;
							}
						}
					}
					else {
						trialsSetUserInfo--;
					}
				}
			}

			else if (_UAEPassUserProfile != null) {
				var finalResponse = {
					name: 'authenticationUAEPass',
					authRequired: false,
					UAEPassProfile: _UAEPassUserProfile,
					havePortalAccount: false

				};
				adapterLogger("submitAuthentication", "info", "Response Returned Successfully with no profile", finalResponse);

				return finalResponse;
			} else {
				return onAuthRequired(null, "Invalid code");
			}
		}
		return onAuthRequired(null, "Invalid login credentials");
	} catch (error) {
		adapterLogger("submitAuthentication", "error", "Exception", toString(error));
		return handleError();
	}
}

//•	Client ID :  rta_dubaidrive_prod
//•	Client Secret : P75kGQG_6jB4_Gr
//•	Production Endpoints : Just remove “qa-“ from all QA URLs. (E.g. qa-id.uaepass.ae will be replaced by id.uaepass.ae)

//tokens.uaepass.url
//tokens.uaepass.clientId
//tokens.uaepass.clientSecret

function generateUAEPassURL(appId, channel) {
	try {
		
		//Staging
		var baseURL = "https://qa-id.uaepass.ae/trustedx-authserver/oauth/main-as";
		var clientId = "rta_web_client";
		
		//Production
		//var baseURL = "https://id.uaepass.ae/trustedx-authserver/oauth/main-as";
		//var clientId = "rta_dubaidrive_prod";
		
		
		if (!appId) {
			return handleError("Invalid Parameters", 406);
		}
		var url;
		
		var responseType = "code";
		var state = appId + new Date().getTime();
		var scope = "urn:uae:digitalid:profile";
		var acr_values = "urn:digitalid:authentication:flow:mobileondevice";
		if (channel == "web") {
			acr_values = "urn:safelayer:tws:policies:authentication:level:low";
		}
		url = baseURL + "?";
		url = url + "redirect_uri=" + redirectUri;
		url = url + "&client_id=" + clientId;
		url = url + "&response_type=" + responseType;
		url = url + "&state=" + state;
		url = url + "&scope=" + scope;
		url = url + "&acr_values=" + acr_values;

		return {
			URL: url
		}
	} catch (error) {
		adapterLogger("generateUAEPassURL", "error", "Exception", toString(error));
		return handleError();
	}
}
function setUserIdentity(user_id) {
	var identity = {
		userId: user_id
	};
	//return WL.Server.setActiveUser("masterAuthRealm", identity);
	 adapterLogger("setUserIdentity", "info", "getActiveUser : after ", toString(WL.Server.getActiveUser("masterAuthRealm")));
	
}
