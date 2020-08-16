/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////Adapter Constants///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//portalprofileservice   // just for production
//portalprofileservice_v2   // for staging
var adapterName = "portalAdapter";
var WSDL_Path = "/portalprofileservice_v2";
var WSDL_Path_For_GetUserProfile = "/PortalUserProfileService";
var WSSE_USERNAME_EXTERNAL = MFP.Server.getPropertyValue("tokens.mstore.username.external");
var WSSE_PASSWORD_EXTERNAL = MFP.Server.getPropertyValue("tokens.mstore.password.external");
var wsseSecurityHeader = '<soapenv:Header>' + '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" ' + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + '<wsse:UsernameToken wsu:Id="UsernameToken-102"><wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username>' + '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password>' + '</wsse:UsernameToken></wsse:Security></soapenv:Header>';
var message_en = "Something went wrong! Please try again later!";
var message_ar = "هناك خطأ ما. يُرجى إعادة المحاولة مرة أخرى!";
var REQ_PORTAL_ADAPTER_USERNAME = MFP.Server.getPropertyValue("tokens.portal.username");
var REQ_PORTAL_ADAPTER_PASSWORD = MFP.Server.getPropertyValue("tokens.portal.password");
var WSSE_USERNAME = MFP.Server.getPropertyValue("tokens.tipcoService.username");
var WSSE_PASSWORD = MFP.Server.getPropertyValue("tokens.tipcoService.password");

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////Helpers Functions///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

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

//Standard Error Handling
//1xx (Informational): The request was received, continuing process
//2xx (Successful): The request was successfully received,  understood, and accepted
//3xx (Redirection): Further action needs to be taken in order to complete the request
//4xx (Client Error): The request contains bad syntax or cannot be fulfilled
function handleError(msg_en, msg_ar, code, procudureName, backendError) {
	msg_en = toString(msg_en) || message_en;
	msg_ar = toString(msg_ar) || message_ar;
	code = code || errorCode;
	adapterLogger("handleError", "error", "Error", JSON.stringify([msg_en, msg_ar, code, procudureName]));
	var errorResponse;
	if (backendError) {
		errorResponse = {
			"isSuccessful": false,
			"error": {
				"status": "1",
				"code": code,
				// "adapter": adapterName,
				"message_en": msg_en,
				"message_ar": msg_ar
			}
		};
	} else {
		errorResponse = {
			"isSuccessful": false,
			"error": {
				"status": "1",
				"code": code,
				// "adapter": adapterName,
				"message_en": msg_en,
				"message_ar": msg_ar,
				"backendError": backendError
			}
		};
	}
	adapterLogger("handleError", "error", "Error", JSON.stringify(errorResponse));
	return errorResponse;
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
		path: WSDL_Path,
		headers: headers,
		body: {
			content: body.toString(),
			contentType: 'text/xml; charset=utf-8'
		}
	};
	return MFP.Server.invokeHttp(input);
}

function isUndefinedOrNullOrBlank(v) {
	if (typeof v == 'undefined' || v == undefined || v == "undefined" || v == null || v == "")
		result = true;
	else
		result = false;
	return result;
}
function isUndefinedOrNull(v) {
	if (typeof v == 'undefined' || v == undefined || v == null || v == "undefined")
		result = true;
	else
		result = false;
	return result;
}
function _isAuthorized(user_id) {
	//var authUserIdentity = MFP.Server.getAuthenticatedUser();
	var authUserIdentity = MFP.Server.getAuthenticatedUser();
	MFP.Logger.info("|_isAuthorized" + JSON.stringify(authUserIdentity));
	if (authUserIdentity) {
		var authUserId = authUserIdentity.userId;
		//var authUserId = authUserIdentity.id;
		MFP.Logger.info("|authUserId  " + authUserId);
		MFP.Logger.info("|authUserIdentity.userId   " + user_id);
		if (authUserId && authUserId == user_id) {
			MFP.Logger.info("|authRequired  false ");
			return {
				authRequired: false
			};
		}
	}
	return {
		isSuccessful: false,
		authRequired: true,
		errorCode: "401",
		errorMessage: "Not Authorized"
	};
}

function _extractXMLValue(tag, data) {
	var res = "";
	if (data && data.indexOf(tag) != -1) {
		var dataParts1 = data.split("<" + tag + ">");
		if (dataParts1 && dataParts1.length >= 2) {
			var dataParts2 = dataParts1[1].split("<\/" + tag + ">");
			if (dataParts2 && dataParts2.length >= 1) {
				return dataParts2[0];
			}
		}
	}
	return res;
}


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////Adapter Procedures//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function handleSystemMessages(responseCode) {
	var msg_ar = message_ar, msg_en = message_en;
	switch (responseCode) {
		// case '0':
		// 	//No need for handling the success code
		// 	break;
		case 'RTA-CSHELL-ERROR-1':
		case 'RTA-CSHELL-ERROR-2':
		case 'RTA-CSHELL-ERROR-3':
		case 'RTA-CSHELL-ERROR-4':
			//Input data invalid
			msg_en = message_en;
			msg_ar = message_ar;
			break;
		case '701':
		case 701:
			msg_en = "Something went wrong! Please try again later!";
			msg_ar = "هناك خطأ ما. يُرجى إعادة المحاولة مرة أخرى!";
			break;
		case '702':
		case 702:
			msg_en = "Your nol Card is not validated, please enter another nol Card";
			msg_ar = "بطاقة نول المدخلة غير صالحة، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '703':
		case 703:
			msg_en = "Your nol Card is blocked, please enter another nol Card";
			msg_ar = "بطاقة نول المدخلة محجوبة، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '704':
		case 704:
			msg_en = "Your nol Card is expired, please enter another nol card";
			msg_ar = "بطاقة نول المدخلة منتهية الصلاحية، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '705':
		case 705:
			msg_en = "Your nol Card is blacklisted, please enter another nol Card";
			msg_ar = "بطاقة نول المدخلة محجوبة، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '706':
		case 706:
			msg_en = "Your nol Card is not enabled, please enter another nol Card";
			msg_ar = "بطاقة نول المدخلة غير مفعَلة، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '707':
		case 707:
			msg_en = "Your nol Card ePurse is blocked, please enter another nol Card";
			msg_ar = "محفظة بطاقة نول المدخلة محجوبة، يُرجى إدخال رقم بطاقة نول أخرى";
			break;
		case '708':
		case 708:
			msg_en = "Unmatched Loyalty ID";
			msg_ar = "رقم العضوية غير متطابق";
			break;
		case '709':
		case 709:
			msg_en = "Unmatched RTA Account ID";
			msg_ar = "حساب هيئة الطرق والمواصلات غير متطابق";
			break;
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10001':
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10002':
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10003':
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10004':
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10010':
			msg_en = message_en;
			msg_ar = message_ar;
			break;
		default:
			msg_en = message_en;
			msg_ar = message_ar;
			break;

	}
	return {
		message_ar: msg_ar,
		message_en: msg_en,
		responseCode: responseCode
	};
}
function getSoapHeader() {
	return '<soapenv:Header><wsse:Security><wsse:UsernameToken><wsse:Username>' + WSSE_USERNAME + '</wsse:Username><wsse:Password>' + WSSE_PASSWORD + '</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header>';
}

//old error handling
function serverErrorHandler() {
	var reponse = {};
	reponse.failure = {
		errorCode: "99"
	};
	return reponse;
}

// function invokeWebService(body) {
// 	try{
// 		var input = {
// 				method : 'post',
// 				returnedContentType : 'xml',
// 				path : '/portalprofileservice_v2',
// 				body : {
// 					content : body.toString(),
// 					contentType : 'text/xml; charset=utf-8'
// 				}
// 		};
// 		return MFP.Server.invokeHttp(input);
// 	}
// 	catch(e){
// 		adapterLogger("invokeWebService2","error", "Exception",toString(e));
// 		return handleError();
// 	}
// }

//PortalUserProfileService  // for testing using profile only with new service 
function invokeWebService2(body) {
	try {
		var input = {
			method: 'post',
			returnedContentType: 'xml',
			returnedContentEncoding: 'ASCII',
			path: WSDL_Path_For_GetUserProfile ,
			body: {
				content: body.toString(),
				contentType: 'text/xml; charset=utf-8'
			}
		};

		return MFP.Server.invokeHttp(input);
	}
	catch (e) {
		adapterLogger("invokeWebService2", "error", "Exception", toString(e));
		return handleError();
	}
}


//Adapter Procdures (Exposed and not Exposed)

function getUserProfileV2(uid, appid) {
	try {
		adapterLogger("getUserProfileV2", "info", "Adapter Input", toString([uid, appid]));
		//var isAuthorizedResponse = this._isAuthorized(uid);
		//if(isAuthorizedResponse&&isAuthorizedResponse.authRequired === false) {
		if (uid && appid) {
			adapterLogger("getUserProfileV2", "info", "AauthRequired", toString("False"));
			//MFP.Logger.info("|portalAdapter |authRequired |False: ");
			return getUserProfile(uid, appid);

		} else {
			return handleError("Invalid Parameters", 406);
		}
		/*}else{
			adapterLogger("getUserProfileV2","info", "AauthRequired | True",toString(isAuthorizedResponse));
			//MFP.Logger.info("|portalAdapter |authRequired |True: " + isAuthorizedResponse);
			return isAuthorizedResponse;
		}
*/
	}
	catch (e) {
		adapterLogger("getUserProfileV2", "error", "Exception", toString(e));
		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getUserProfileV2");
	}
}
/*function getUserProfile(uid, appid) {
	try {

		if (!uid || !appid) {
			var errorMapping = handleSystemMessages('RTA-CSHELL-ERROR-1');
			return handleError(errorMapping.message_en, errorMapping.message_ar, errorMapping.responseCode, "getUserProfile");
		}
		adapterLogger("getUserProfile", "info", "Adapter Input", toString([uid, appid]));
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
			+ 'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" '
			+ 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
			+ ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+ getSoapHeader()
			+ '<soapenv:Body><sch:getUserProfile><sch:userId>'
			+ uid
			+ '</sch:userId><sch:applicationId>'
			+ appid
			+ '</sch:applicationId>'
			+ '</sch:getUserProfile></soapenv:Body></soapenv:Envelope>';
		adapterLogger("getUserProfile", "info", "Soap Request", toString(request));
		//MFP.Logger.info("|portalAdapter |getUserProfile |request: " + request );

		var response = invokeWebService2(request);
		
		
		adapterLogger("getUserProfile=", "info", "Soap Response", toString(response));
		// this for testing only fixed response
		response= {"isSuccessful":true,"errors":[],"warnings":[],"info":[],"Envelope":{"Header":"","Body":{"getUserProfileReturn":{"userProfile":{"userId":"salik56","title":{"titleID":"1","titleEn":"Mr","titleAr":"السيد"},"firstName":"Salik","middleName":"Salik","lastName":"Salik","phoneNo":"","mobileNo":"971543069768","email":"isoft.dubai@gmail.com","language":"English","userType":"UM_PUBLICUSER","businessLicenseNo":"","nationality":{"nationalityID":"162","nationalityEn":"United Arab Emirates","nationalityAr":"الامارات العربيّة المتّحدة"},"emirate":{"emirateID":"4","emirateEn":"Dubai","emirateAr":"دبي"},"address":"","thirdParty":"No","prefLanguage":"English","prefComm":"Email","isEmailVerified":"true","isMobileVerified":"true","isEmiratesIdVerified":"false","serviceRelatedInfo":[{"serviceId":"MPARKING","linkingAttribute":"dcxvtjyxxf97154306976815785447166469fcddb5eddd54fa18797283c05a109c6glsdbjldjncqxkeojzmwfukuurochrwrs"},{"serviceId":"SALIK","linkingAttribute":"39C0246C-B9CF-44F3-97E2-A4AF20FF4782"}],"createdOn":"17-MAR-20","modifiedOn":"17-MAR-20"}}}},"statusCode":200,"statusReason":"OK","responseHeaders":{"Content-Type":"text/xml; charset=utf-8","Date":"Wed, 22 Apr 2020 13:12:41 GMT"},"responseTime":328,"totalTime":333};
		//MFP.Logger.info("|portalAdapter |getUserProfile |response: " + JSON.stringify(response));
		if (response && response.isSuccessful && response.statusCode == 200 && response.Envelope && response.Envelope.Body
			&& response.Envelope.Body.getUserProfileReturn.userProfile != undefined) {
			adapterLogger("getUserProfile", "info", "Soap Response Nationality for JAXB", response.Envelope.Body.getUserProfileReturn.userProfile.nationality);
			var userProfile = response.Envelope.Body.getUserProfileReturn.userProfile;
			if (!userProfile.nationality) {
				response.Envelope.Body.getUserProfileReturn.userProfile.nationality = {
					nationalityID: "182",
					nationalityEn: "other",
					nationalityAr: "other"
				}
			}
			if (userProfile.prefLanguage.toLowerCase() == "en")
				userProfile.prefLanguage = "English";

			if (userProfile.prefLanguage.toLowerCase() == "ar")
				userProfile.prefLanguage = "Arabic";

			if (userProfile.language.toLowerCase() == "en")
				userProfile.language = "English";

			if (userProfile.language.toLowerCase() == "ar")
				userProfile.language = "Arabic";

			if (userProfile.language.toLowerCase() == "ar")
				userProfile.language = "Arabic";

			if (userProfile.mobileNo == null || userProfile.mobileNo == "" || userProfile.mobileNo == undefined)
				userProfile.mobileNo = "00";

			if (userProfile.mobileNo.indexOf("+") != -1)
				userProfile.mobileNo = userProfile.mobileNo.replace("+", "");
		}
		adapterLogger("getUserProfile", "info", "responseMOD", toString(response));
		//		MFP.Logger.info("|portalAdapter |getUserProfile |responseMOD: " + JSON.stringify(response));
		return response;
	}
	catch (e) {
		adapterLogger("getUserProfile", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getUserProfile");

	}
}*/

// updated bt faran
function getUserProfile(uid, appid) {
	try {

		if (!uid || !appid) {
			var errorMapping = handleSystemMessages('RTA-CSHELL-ERROR-1');
			return handleError(errorMapping.message_en, errorMapping.message_ar, errorMapping.responseCode, "getUserProfile");
		}
		adapterLogger("getUserProfile", "info", "Adapter Input", toString([uid, appid]));
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
			+ 'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" '
			+ 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
			+ ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+ getSoapHeader()
			+ '<soapenv:Body><sch:getUserProfile><sch:userId>'
			+ uid
			+ '</sch:userId><sch:applicationId>'
			+ appid
			+ '</sch:applicationId>'
			+ '</sch:getUserProfile></soapenv:Body></soapenv:Envelope>';

        var request_new = '<soapenv:Envelope '
            + 'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd"  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'
            +  '<soapenv:Header><wsse:Security soapenv:mustUnderstand="1" '
            + 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
            + ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
            
           + '<wsse:UsernameToken wsu:Id="UsernameToken-7"><wsse:Username>' + 'EIPUser' + '</wsse:Username>'
        +'<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText>' + 'EIPUser'
        +'</wsse:Password><wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">'
        +'jeM8hixX40AV0zxt/7LeUA==</wsse:Nonce>'
        +'<wsu:Created>2020-05-27T10:58:00.044Z</wsu:Created></wsse:UsernameToken></wsse:Security></soapenv:Header>'
           
            + '<soapenv:Body><sch:getUserProfile><sch:userId>'
            + uid
            + '</sch:userId><sch:applicationId>'
            + appid
            + '</sch:applicationId>'
            + '</sch:getUserProfile></soapenv:Body></soapenv:Envelope>';
        
        
        adapterLogger("getUserProfile", "info", "Soap Request", toString(request));
        
         adapterLogger("getUserProfile", "info", "New Soap Request", toString(request_new));
		//MFP.Logger.info("|portalAdapter |getUserProfile |request: " + request );

		//var response = invokeWebService2(request);
		var response = invokeWebService2(request_new);
		var strResponse = toString(response);
		//adapterLogger("getUserProfile=", "info", "Soap Response", strResponse);
		//WL.Logger.info("getUserProfile Soap Response"+ strResponse);
		
		// this for testing only fixed response
				
		/*response = strResponse.replace(/{"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd","CDATA":/g,"")
			.replace(/"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd",/g,"")
			.replace(/{"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd"}/g,"\"\"")
			.replace(/},/g,",").replace(/}}]/g,","}}]")+"}";*/
		
		//response = strResponse.replace(/{"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd","CDATA":/g,"").replace(/"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd",/g,"").replace(/{"":"http:\/\/www.rta.ae\/ActiveMatrix\/ESB\/schemas\/PortalProfileService\/Schema.xsd"}/g,"\"\"").replace(/},/g,",").replace(/}}]/g,"}]")+"}";
		
		adapterLogger("getUserProfile=", "info", "Refined Response", response);
		
		response = JSON.parse(response);
		
		if (response && response.isSuccessful && response.statusCode == 200 && response.Envelope && response.Envelope.Body
			&& response.Envelope.Body.getUserProfileReturn.userProfile != undefined) {
			adapterLogger("getUserProfile", "info", "Soap Response Nationality for JAXB", response.Envelope.Body.getUserProfileReturn.userProfile.nationality);
			var userProfile = response.Envelope.Body.getUserProfileReturn.userProfile;
			if (!userProfile.nationality) {
				response.Envelope.Body.getUserProfileReturn.userProfile.nationality = {
					nationalityID: "182",
					nationalityEn: "other",
					nationalityAr: "other"
				}
			}
			if (userProfile.prefLanguage.toLowerCase() == "en")
				userProfile.prefLanguage = "English";

			if (userProfile.prefLanguage.toLowerCase() == "ar")
				userProfile.prefLanguage = "Arabic";

			if (userProfile.language.toLowerCase() == "en")
				userProfile.language = "English";

			if (userProfile.language.toLowerCase() == "ar")
				userProfile.language = "Arabic";

			if (userProfile.language.toLowerCase() == "ar")
				userProfile.language = "Arabic";

			if (userProfile.mobileNo == null || userProfile.mobileNo == "" || userProfile.mobileNo == undefined)
				userProfile.mobileNo = "00";

			if (userProfile.mobileNo.indexOf("+") != -1)
				userProfile.mobileNo = userProfile.mobileNo.replace("+", "");
		}
		//adapterLogger("getUserProfile", "info", "responseMOD", toString(response));
		MFP.Logger.info("|portalAdapter |getUserProfile |responseMOD: " + JSON.stringify(response));
		
		return response;
	}
	catch (e) {
		adapterLogger("getUserProfile", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getUserProfile");

	}
}

function userActivation(uid) {
	try {
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() + '<soapenv:Body><sch:synchronizeWithCRM><sch:userId>' + uid + '</sch:userId></sch:synchronizeWithCRM></soapenv:Body></soapenv:Envelope>';
		//MFP.Logger.info("|portalAdapter |userActivation |request: " + request );
		adapterLogger("userActivation", "info", "request:", toString(request));

		var response = invokeWebService(request);
		//		MFP.Logger.info("|portalAdapter |userActivation |response: " + JSON.stringify(response));
		adapterLogger("userActivation", "info", "response:", toString(response));

		if (response && response.isSuccessful && response.statusCode == 200) {
			if (response.Envelope && response.Envelope.Body
				&& response.Envelope.Body.synchronizeWithCRMReturn) {
				var synchronizeWithCRMReturn = response.Envelope.Body.synchronizeWithCRMReturn;

				if (synchronizeWithCRMReturn.errorResponse) {
					return {
						failure: synchronizeWithCRMReturn.errorResponse
					};
				} else if (synchronizeWithCRMReturn.success) {
					return {
						success: true
					};
				}
			}
		}

		return serverErrorHandler();
	}
	catch (e) {
		adapterLogger("userActivation", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "userActivation");

	}
}

function linkEmiratesId(userId, emiratesId, isEmiratesIdVerified, applicationId) {
	try {
		adapterLogger("linkEmiratesId", "info", "Adapter Input", toString([userId, emiratesId, isEmiratesIdVerified, applicationId]));
		if (userId && emiratesId && isEmiratesIdVerified && applicationId) {
			var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() +
				'<soapenv:Body>' +
				'<sch:linkEmiratesId>' +
				'<sch:userId>' + userId + '</sch:userId>' +
				'<sch:emiratesId>' + emiratesId + '</sch:emiratesId>' +
				'<sch:isEmiratesIdVerified>' + isEmiratesIdVerified + '</sch:isEmiratesIdVerified>' +
				'<sch:applicationId>' + applicationId + '</sch:applicationId>' +
				'</sch:linkEmiratesId>' +
				'</soapenv:Body></soapenv:Envelope>';
			adapterLogger("linkEmiratesId", "info", "Soap Request", toString(request));
			//MFP.Logger.info("|portalAdapter |linkEmiratesId |request: " + request );
			var response = invokeWebService(request);
			adapterLogger("linkEmiratesId", "info", "Soap Response", toString(response));
			//MFP.Logger.info("|portalAdapter |linkEmiratesId |response: " + JSON.stringify(response));
			if (response && response.isSuccessful && response.statusCode == 200) {
				if (response.Envelope && response.Envelope.Body
					&& response.Envelope.Body.linkEmiratesIdReturn) {
					var linkEmiratesIdReturn = response.Envelope.Body.linkEmiratesIdReturn;
					adapterLogger("linkEmiratesId", "info", "linkEmiratesIdReturn", toString(linkEmiratesIdReturn));
					//MFP.Logger.info("|portalAdapter |linkEmiratesId |linkEmiratesIdReturn: " + JSON.stringify(linkEmiratesIdReturn));

					if (linkEmiratesIdReturn.result == "true") {
						//MFP.Logger.info("SUCCESS");
						adapterLogger("linkEmiratesId", "info", "result", toString("SUCCESS"));
						return {
							success: true
						};
					} else if (linkEmiratesIdReturn.errorResponse) {
						adapterLogger("linkEmiratesId", "info", "result", toString("FAil"));
						//MFP.Logger.info("FAil");

						return {
							failure: linkEmiratesIdReturn.errorResponse
						};
					} else {
						adapterLogger("linkEmiratesId", "info", "result", toString("FAil"));
						//MFP.Logger.info("FAil");

						return serverErrorHandler();
					}
				}
			}
			return serverErrorHandler();
		}
		else {
			adapterLogger("linkEmiratesId", "info", "Invalid Parameters", "");
			return handleError("Invalid Parameters", 406);
		}
	}
	catch (e) {
		adapterLogger("linkEmiratesId", "error", "Exception", toString(e));
		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "linkEmiratesId");
	}
}

function getUserProfileByEmiratesIdInternal(portal_username, portal_password, emiratesId) {
	try {
		var isAuthorizedResponse = this._isAuthorizedPortal(portal_username, portal_password);
		if (isAuthorizedResponse.authRequired == false) {
			var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
				+ 'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/Portalprofileservice/Schema.xsd" '
				+ 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" '
				+ 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
				+ getSoapHeader() + '<soapenv:Body><sch:getUserProfileByEmiratesId><sch:emiratesId>'
				+ emiratesId + '</sch:emiratesId></sch:getUserProfileByEmiratesId></soapenv:Body></soapenv:Envelope>';
			return invokeWebService(request);
		}

		return isAuthorizedResponse;
	}
	catch (e) {
		adapterLogger("getUserProfileByEmiratesIdInternal", "error", "Exception", toString(e));
		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getUserProfileByEmiratesIdInternal");
	}
}

/**
 * This method is responsible for updating the user profile from the profile page 
 * 
 * @param title
 * @param firstName
 * @param lastName
 * @param nationality
 * @param mobileNo
 * @param userId
 * @param emiratesId
 * @param prefLanguage
 * @param prefComm
 * @param email
 * @param isEmailVerified
 * @param isMobileVerified
 * @returns
 */
function updateUserProfile(applicationId, titleId, firstName, lastName, nationalityId, mobileNo, userId,
	prefLanguage, prefComm, email, isEmailVerified, isMobileVerified) {
	try {
		adapterLogger("updateUserProfile", "info", "Adapter Input", toString([applicationId, titleId, firstName, lastName, nationalityId, mobileNo, userId,
			prefLanguage, prefComm, email, isEmailVerified, isMobileVerified]));
		//MFP.Logger.info("|portalAdapter |updateUserProfile |Data: " + titleId+" "+ firstName+" "+ lastName+" "+ nationalityId+" "+ mobileNo+" "+ userId+" "+ prefLanguage+" "+ prefComm);
		var isAuthorizedResponse = this._isAuthorized(userId);
		if (isAuthorizedResponse.authRequired === false) {
			//MFP.Logger.info("|portalAdapter |authRequired |False: ");
			adapterLogger("updateUserProfile", "info", "authRequired", "False");

			applicationId = this._preventJsInjection(applicationId);
			titleId = this._preventJsInjection(titleId);
			firstName = this._preventJsInjection(firstName);
			lastName = this._preventJsInjection(lastName);
			nationalityId = this._preventJsInjection(nationalityId);
			mobileNo = this._preventJsInjection(mobileNo);
			userId = this._preventJsInjectionForEmail(userId);
			prefLanguage = this._preventJsInjection(prefLanguage);
			prefComm = this._preventJsInjection(prefComm);
			email = this._preventJsInjection(email);
			isEmailVerified = this._preventJsInjection(isEmailVerified);
			isMobileVerified = this._preventJsInjection(isMobileVerified);
			if (applicationId && titleId && firstName && lastName && nationalityId &&
				mobileNo && userId && prefLanguage && prefComm && email &&
				isEmailVerified && isMobileVerified) {
				if (prefComm != "Email" && prefComm != "SMS") {
					prefComm = "Email";
				}

				var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
					+ getSoapHeader()
					+ '<soapenv:Body><sch:updateUserProfile>'
					+ '<sch:title>' + titleId + '</sch:title>'
					+ '<sch:fisrtName>' + firstName + '</sch:fisrtName>'
					+ '<sch:lastName>' + lastName + '</sch:lastName>'
					+ '<sch:nationality>' + nationalityId + '</sch:nationality>'
					+ '<sch:mobileNo>' + mobileNo + '</sch:mobileNo>'
					+ '<sch:userId>' + userId + '</sch:userId>'
					+ '<sch:prefLanguage>' + prefLanguage + '</sch:prefLanguage>'
					+ '<sch:prefComm>' + prefComm + '</sch:prefComm>'
					+ '<sch:email>' + email + '</sch:email>'
					+ '<sch:thirdParty>No</sch:thirdParty>'
					+ '<sch:isEmailVerified>' + isEmailVerified + '</sch:isEmailVerified>'
					+ '<sch:isMobileVerified>' + isMobileVerified + '</sch:isMobileVerified>'
					+ '<sch:applicationId>' + applicationId + '</sch:applicationId>'
					+ '</sch:updateUserProfile>'
					+ '</soapenv:Body></soapenv:Envelope>';

				adapterLogger("updateUserProfile", "info", "Soap Request", toString(request));
				//MFP.Logger.info("|portalAdapter |updateUserProfile |request: " +request);
				var response = invokeWebService(request);
				adapterLogger("updateUserProfile", "info", "Soap Response", toString(response));
				//MFP.Logger.info("|portalAdapter |updateUserProfile |response: " +JSON.stringify(response));
				if (response && response.isSuccessful && response.statusCode == 200) {
					if (response.Envelope && response.Envelope.Body
						&& response.Envelope.Body.updateUserProfileReturn) {
						var updateUserProfileReturn = response.Envelope.Body.updateUserProfileReturn;

						if (updateUserProfileReturn.errorResponse) {

							return {
								isSuccessful: false,
								failure: updateUserProfileReturn.errorResponse
							};
						} else if (updateUserProfileReturn.success) {
							// update common shell data base

							var trialsSetUserInfo = 2;
							while (trialsSetUserInfo > 0) {
								// Add/Update user profile in shell database
								var invocationData = {
									adapter: 'userProfile',
									procedure: 'setUserInfoForProfile',
									parameters: [userId, titleId, firstName, lastName, nationalityId, mobileNo,
										prefLanguage, prefComm, email, isEmailVerified, isMobileVerified]
								};
								adapterLogger("updateUserProfile", "info", "InvocationData", toString(invocationData));
								//MFP.Logger.info("|userProfile |setUserInfoForProfile |invocationData: " + JSON.stringify(invocationData) );

								var shellDatabaseResponse = MFP.Server.invokeProcedure(invocationData);
								adapterLogger("updateUserProfile", "info", "server response ", toString(shellDatabaseResponse));
								//MFP.Logger.info("|userProfile |setUserInfoForProfile |server response: " + JSON.stringify(shellDatabaseResponse));

								if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
									trialsSetUserInfo = 0;
									return {
										success: true,
										isSuccessful: true
									};

								}
								else {
									trialsSetUserInfo--;
								}
							}
						}
					}
				} else {
					return {
						isSuccessful: false
					};
				}

				//				return response;
			}
			else {
				return handleError("Invalid Parameters", 406);
			}

		}
		else {
			//MFP.Logger.info("|portalAdapter |authRequired |True: " + isAuthorizedResponse);
			adapterLogger("updateUserProfile", "info", "True", toString(isAuthorizedResponse));
			return isAuthorizedResponse;
		}
	}
	catch (e) {
		adapterLogger("updateUserProfile", "error", "Exception", e.toString());

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "updateUserProfile");

	}
}

/**
 * This function is responsible for getting user password when he/she forget it
 * 
 * @param userId
 * @returns
 */
function forgetPassword(userId) {
	try {
		//MFP.Logger.info("|portalAdapter |forgetPassword |Data: " +userId);
		adapterLogger("forgetPassword", "info", "forgetPassword", toString(userId));

		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() + '<soapenv:Body><sch:forgetPassword><sch:userId>' + userId + '</sch:userId></sch:forgetPassword></soapenv:Body></soapenv:Envelope>';
		//MFP.Logger.info("|portalAdapter |forgetPassword |request: " +request);
		adapterLogger("forgetPassword", "info", "request", toString(request));
		var response = "";
		response = invokeWebService(request);
		//MFP.Logger.info("|portalAdapter |forgetPassword |request: " +JSON.stringify(response));
		adapterLogger("forgetPassword", "info", "response", toString(response));

		if (response && response.isSuccessful && response.statusCode == 200) {
			if (response.Envelope && response.Envelope.Body
				&& response.Envelope.Body.forgetPasswordReturn) {
				var forgetPasswordReturn = response.Envelope.Body.forgetPasswordReturn;

				if (forgetPasswordReturn.errorResponse) {
					return {
						failure: forgetPasswordReturn.errorResponse
					};
				} else if (forgetPasswordReturn.success) {
					return {
						success: true
					};
				}
			}
		}

		return response;
	}
	catch (e) {
		adapterLogger("forgetPassword", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "forgetPassword");

	}
}

function resetPassword(userId, oldPassword, newPassword) {
	try {
		var isAuthorizedResponse = this._isAuthorized(userId);
		if (isAuthorizedResponse.authRequired === false) {

			var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() + '<soapenv:Body><sch:resetPassword><sch:userId>' + userId + '</sch:userId><sch:oldPassword>' + oldPassword + '</sch:oldPassword><sch:newPassword>' + newPassword + '</sch:newPassword></sch:resetPassword></soapenv:Body></soapenv:Envelope>';
			//MFP.Logger.info("|portalAdapter |resetPassword |request: " +request);
			adapterLogger("resetPassword", "info", "request", toString(request));
			var response = "";
			response = invokeWebService(request);
			//MFP.Logger.info("|portalAdapter |resetPassword |request: " +JSON.stringify(response));
			adapterLogger("resetPassword", "info", "response", toString(response));

			if (response && response.isSuccessful && response.statusCode == 200) {
				if (response.Envelope && response.Envelope.Body
					&& response.Envelope.Body.resetPasswordReturn) {
					var resetPasswordReturn = response.Envelope.Body.resetPasswordReturn;

					if (resetPasswordReturn.errorResponse) {
						return {
							failure: resetPasswordReturn.errorResponse
						};
					} else if (resetPasswordReturn.success) {
						return {
							success: true
						};
					}
				}
			}

			return response;
		}
		else {
			return isAuthorizedResponse;
		}
	}
	catch (e) {
		adapterLogger("resetPassword", "error", "Exception", toString(e));
		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "resetPassword");
	}
}


/**
 * Check if portal is authorized
 * 
 * @param: String, String
 * @returns: JSON Object
 */
function _isAuthorizedPortal(portal_username, portal_password) {
	try {
		if (portal_username == REQ_PORTAL_ADAPTER_USERNAME && portal_password == REQ_PORTAL_ADAPTER_PASSWORD) {
			return {
				authRequired: false
			};
		}

		return {
			isSuccessful: false,
			authRequired: true,
			errorCode: "401",
			errorMessage: "Not Authorized"
		};
	}
	catch (e) {
		adapterLogger("_isAuthorizedPortal", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "_isAuthorizedPortal");

	}
}

/**
 * Check if the user id who requested the operation is the same one who was
 * authenticated
 * 
 * @param: String
 * @returns: Boolean
 */
function _isAuthorized(user_id) {
	try {
		var authUserIdentity = MFP.Server.getAuthenticatedUser();
		//MFP.Logger.info("|_isAuthorized" +JSON.stringify(authUserIdentity));
		adapterLogger("_isAuthorized", "info", "authUserIdentity", toString(authUserIdentity));

		if (authUserIdentity) {
			var authUserId = authUserIdentity.userId;
			//MFP.Logger.info("|authUserId  " +authUserId);
			adapterLogger("_isAuthorized", "info", "authUserId", toString(authUserId));
			//MFP.Logger.info("|authUserIdentity.userId   " +user_id);
			adapterLogger("_isAuthorized", "info", "authUserIdentity.userId", toString(user_id));
			if (authUserId && authUserId == user_id) {
				//MFP.Logger.info("|authRequired  false ");
				adapterLogger("_isAuthorized", "info", "authRequired", "false");
				return {
					authRequired: false
				};
			}
		}

		return {
			isSuccessful: false,
			authRequired: true,
			errorCode: "401",
			errorMessage: "Not Authorized"
		};
	}
	catch (e) {
		adapterLogger("_isAuthorized", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "_isAuthorized");

	}
}

/**
 * Disable ability to insert code
 * 
 * @param: String
 * @returns: String
 */
function _preventJsInjection(inputTxt) {
	try {
		if (inputTxt && (typeof inputTxt == 'string' || inputTxt instanceof String)) {
			return inputTxt.replace(/<*>*-*/gi, "");
		}
		else {
			return inputTxt; //Don't mess with the rest
		}
	}
	catch (e) {
		adapterLogger("_preventJsInjection", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "_preventJsInjection");

	}
}

function _preventJsInjectionForEmail(inputTxt) {
	try {
		if (inputTxt && (typeof inputTxt == 'string' || inputTxt instanceof String)) {
			return inputTxt.replace(/<*>*/gi, "");
		}
		else {
			return inputTxt; //Don't mess with the rest
		}
	}
	catch (e) {
		adapterLogger("_preventJsInjectionForEmail", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "_preventJsInjectionForEmail");

	}
}

function checkUserAvailability(userId, appId) {
	try {
		adapterLogger("checkUserAvailability", "info", "Adapter Input", toString([userId, appId]));
		if (userId && appId) {
			var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
				+ 'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" '
				+ 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"'
				+ ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
				+ getSoapHeader()
				+ '<soapenv:Body>'
				+ '<sch:isUserIdExists>'
				+ '<sch:userId>'
				+ userId
				+ '</sch:userId>'
				+ '<sch:applicationId>'
				+ appId
				+ '</sch:applicationId>'
				+ '</sch:isUserIdExists>'
				+ '</soapenv:Body>'
				+ '</soapenv:Envelope>';

			adapterLogger("checkUserAvailability", "info", "Soap Request", toString(request));
			var response = invokeWebService(request);
			adapterLogger("checkUserAvailability", "info", "Soap Response", toString(response));
			var userExists = response.Envelope.Body.isUserIdExistsReturn.exists;
			return {
				userIdAvailable: userExists
			}
		}
		else {
			return handleError("Invalid Parameters", 406);
		}
	}
	catch (e) {
		adapterLogger("checkUserAvailability", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "checkUserAvailability");

	}
}

function getUserInfoForOTP(userId, appid) {
	try {
		var response = getUserProfile(userId, appid);
		var profile = response.Envelope.Body.getUserProfileReturn.userProfile;
		if (profile != undefined) {
			return {
				email: profile.email,
				isEmailVerified: profile.isEmailVerified,
				mobileNo: profile.mobileNo,
				isMobileVerified: profile.isMobileVerified
			}
		} else {
			return {
				error: response.Envelope.Body.getUserProfileReturn.errorResponse.errorCode
			}
		}
	}
	catch (e) {
		adapterLogger("getUserInfoForOTP", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getUserInfoForOTP");

	}

}

function updateMobileNumber(userId, oldMobileNumber, newMobileNumber, applicationId) {
	try {
		var isAuthorizedResponse = this._isAuthorized(userId);
		if (isAuthorizedResponse.authRequired === false) {
			//	MFP.Logger.info("|portalAdapter |authRequired |False: ");
			adapterLogger("updateMobileNumber", "info", "authRequired", "False");

			var request;
			if (oldMobileNumber != null) {
				request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() +
					'<soapenv:Body>' +
					'<sch:updateMobileNumber>' +
					'<sch:oldMobileNumber>' + oldMobileNumber + '</sch:oldMobileNumber>' +
					'<sch:NewMobileNumber>' + newMobileNumber + '</sch:NewMobileNumber>' +
					'<sch:userId>' + userId + '</sch:userId>' +
					'<sch:applicationId>' + applicationId + '</sch:applicationId>' +
					'</sch:updateMobileNumber>' +
					'</soapenv:Body></soapenv:Envelope>';
			} else {
				request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() +
					'<soapenv:Body>' +
					'<sch:updateMobileNumber>' +
					'<sch:NewMobileNumber>' + newMobileNumber + '</sch:NewMobileNumber>' +
					'<sch:userId>' + userId + '</sch:userId>' +
					'<sch:applicationId>' + applicationId + '</sch:applicationId>' +
					'</sch:updateMobileNumber>' +
					'</soapenv:Body></soapenv:Envelope>';
			}

			//MFP.Logger.info("|portalAdapter |updateMobileNumber |request: " + request );

			adapterLogger("updateMobileNumber", "info", "request", toString(request));

			var response = invokeWebService(request);
			//MFP.Logger.info("|portalAdapter |updateMobileNumber |response: " + JSON.stringify(response));
			adapterLogger("updateMobileNumber", "info", "response", toString(response));

			if (response && response.isSuccessful && response.statusCode == 200) {
				if (response.Envelope && response.Envelope.Body
					&& response.Envelope.Body.updateMobileNumberReturn) {
					var updateMobileNumberReturn = response.Envelope.Body.updateMobileNumberReturn;
					//MFP.Logger.info("|portalAdapter |updateMobileNumber |updateMobileNumberReturn: " + JSON.stringify(updateMobileNumberReturn));
					adapterLogger("updateMobileNumber", "info", "updateMobileNumberReturn", toString(updateMobileNumberReturn));


					if (updateMobileNumberReturn.linkingAttribute != undefined
						&& updateMobileNumberReturn.errorResponse == undefined) {
						//MFP.Logger.info("SUCCESS");
						adapterLogger("updateMobileNumber", "info", "result", "SUCCESS");

						// update common shell data base

						var trialsSetUserInfo = 2;
						while (trialsSetUserInfo > 0) {
							// Add/Update user profile in shell database
							var invocationData = {
								adapter: 'userProfile',
								procedure: 'setUserMobile',
								parameters: [userId, newMobileNumber, "true"]
							};
							//MFP.Logger.info("|userProfile |setUserMobile |invocationData: " + JSON.stringify(invocationData) );
							adapterLogger("updateMobileNumber", "info", "invocationData", toString(invocationData));

							var shellDatabaseResponse = MFP.Server.invokeProcedure(invocationData);
							//MFP.Logger.info("|userProfile |setUserMobile |server response: " + JSON.stringify(shellDatabaseResponse));
							adapterLogger("updateMobileNumber", "info", "server response:", toString(shellDatabaseResponse));

							if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
								trialsSetUserInfo = 0;
								return {
									success: true,
									linkingAttribute: updateMobileNumberReturn.linkingAttribute,
									isSuccessful: true
								};

							}
							else {
								trialsSetUserInfo--;
							}
						}
					} else if (updateMobileNumberReturn.errorResponse) {
						//MFP.Logger.info("Fail");
						adapterLogger("updateMobileNumber", "info", "Fail", "");

						return {
							failure: updateMobileNumberReturn.errorResponse
						};
					} else {
						//MFP.Logger.info("Fail");
						adapterLogger("updateMobileNumber", "info", "Fail", "");

						return serverErrorHandler();
					}
				}
			}
			return serverErrorHandler();
		}
		else {
			//MFP.Logger.info("|portalAdapter |authRequired |True: " + isAuthorizedResponse);
			adapterLogger("updateMobileNumber", "info", "authRequired |True:", toString(isAuthorizedResponse));
			return isAuthorizedResponse;
		}
	}
	catch (e) {
		adapterLogger("updateMobileNumber", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "updateMobileNumber");

	}
}


function updateMail(userId, mail, applicationId) {
	try {
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + getSoapHeader() +
			'<soapenv:Body>' +
			'<sch:updateEmailAddress>' +
			'<sch:email>' + mail + '</sch:email>' +
			'<sch:userId>' + userId + '</sch:userId>' +
			'<sch:applicationId>' + applicationId + '</sch:applicationId>' +
			'</sch:updateEmailAddress>' +
			'</soapenv:Body></soapenv:Envelope>';


		//MFP.Logger.info("|portalAdapter |updateMail |request: " + request );
		adapterLogger("updateMail", "info", "request:", toString(request));

		var response = invokeWebService(request);
		//MFP.Logger.info("|portalAdapter |updateMail |response: " + JSON.stringify(response));
		adapterLogger("updateMail", "info", "response:", toString(response));

		if (response && response.isSuccessful && response.statusCode == 200) {
			if (response.Envelope && response.Envelope.Body
				&& response.Envelope.Body.updateEmailAddressReturn) {
				var updateEmailAddressReturn = response.Envelope.Body.updateEmailAddressReturn;
				//				MFP.Logger.info("|portalAdapter |updateMail |updateMobileNumberReturn: " + JSON.stringify(updateEmailAddressReturn));

				if (updateEmailAddressReturn.errorResponse == undefined) {
					var trialsSetUserInfo = 2;
					while (trialsSetUserInfo > 0) {
						var invocationData = {
							adapter: 'userProfile',
							procedure: 'setUserMail',
							parameters: [userId, mail]
						};
						//MFP.Logger.info("|userProfile |setUserMail |invocationData: " + JSON.stringify(invocationData) );
						adapterLogger("setUserMail", "info", "invocationData:", toString(invocationData));

						var shellDatabaseResponse = MFP.Server.invokeProcedure(invocationData);
						//MFP.Logger.info("|userProfile |setUserMail |server response: " + JSON.stringify(shellDatabaseResponse));
						adapterLogger("setUserMail", "info", "server response: ", toString(shellDatabaseResponse));

						if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
							trialsSetUserInfo = 0;
							return {
								success: true,
								isSuccessful: true
							};
						}
						else {
							trialsSetUserInfo--;
						}
					}
				} else if (updateEmailAddressReturn.errorResponse) {
					//In case of error
					return updateEmailAddressReturn;
				} else {
					//In Case of Fault
					return serverErrorHandler();
				}
			}
		}
		return serverErrorHandler();
	}
	catch (e) {

		adapterLogger("updateMail", "error", "linkUAEPassId:Exception", JSON.stringify(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "updateMail");

	}
}



function linkUAEPassId(userId, uaepassId, updatedBy, applicationId) {
	try {
		if (userId && uaepassId && updatedBy && applicationId) {
			var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/PortalProfileService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> <soapenv:Header> <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> <wsse:UsernameToken wsu:Id="UsernameToken-39"> <wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username> <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password> <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">CN5P8LtLB46OHLKaQD1PXw==</wsse:Nonce> <wsu:Created>2019-02-05T08:44:02.641Z</wsu:Created> </wsse:UsernameToken> </wsse:Security> </soapenv:Header> <soapenv:Body> <sch:linkUAEPassId> <sch:userId>' + userId + '</sch:userId> <sch:uaepassId>' + uaepassId + '</sch:uaepassId> <sch:updatedBy>' + updatedBy + '</sch:updatedBy> <sch:applicationId>' + applicationId + '</sch:applicationId> </sch:linkUAEPassId> </soapenv:Body> </soapenv:Envelope>';
			//	MFP.Logger.warn("|userProfile |linkUAEPassId |Request" + request);
			adapterLogger("linkUAEPassId", "info", "Request: ", toString(request));
			var response = invokeWebService(request);
			//MFP.Logger.warn("|userProfile |linkUAEPassId |Response" + JSON.stringify(response));
			adapterLogger("linkUAEPassId", "info", "Response: ", toString(response));
			if (response && response.isSuccessful && response.statusCode == 200) {
				if (response.Envelope && response.Envelope.Body && response.Envelope.Body) {

					//					in case of success
					return response.Envelope.Body.linkUAEPassIdReturn;
				}
			}
			else {
				return response
			}
		}
		else {
			return handleError("Invalid Parameters", 406);
		}
	}
	catch (e) {
		adapterLogger("linkUAEPassId", "error", "linkUAEPassId:Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "linkUAEPassId");
	}
}
