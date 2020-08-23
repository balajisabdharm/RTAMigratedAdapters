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

var getEmiratesStatement = "select * from NILOYALTY_EMIRATES";
var getAreaStatement = "select * from NILOYALTY_AREA";
var message_en="Something went wrong! Please try again later!";
var message_ar= "هناك خطأ ما. يُرجى إعادة المحاولة مرة أخرى!";
var errorCode='RTA-CSHELL-ERROR-3';
var adapterName= "NILoyaltyLookupAdapter";
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

function handleError(msg_en,msg_ar, code,procudureName) {
	 msg_en = toString(msg_en) || message_en;
	 msg_ar = toString(msg_ar) || message_ar;
	 code = code || errorCode;
	adapterLogger("handleError", "error", "Error", JSON.stringify([msg_en,msg_ar, code,procudureName]));
	var errorResponse = {
		"isSuccessful": false,
		"error": {
			"status": "1",
			"code": code,
			// "adapter": adapterName,
			"message_en": msg_en,
			"message_ar": msg_ar
		}
	};
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
	var authUserIdentity = MFP.Server.getActiveUser("masterAuthRealm");
	MFP.Logger.info("|_isAuthorized" + JSON.stringify(authUserIdentity));
	if (authUserIdentity) {
		var authUserId = authUserIdentity.userId;
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
function extractAreasPerEmirate(areas, emirate) {
	try {
		var result = [];
		for (var i = 0; i < areas.length; i++) {
			if (areas[i].ATTRIBUTE_VALUE.indexOf(emirate) > -1) {
				result.push({
					key: areas[i].ATTRIBUTE_VALUE,
					value: areas[i].LABEL
				});
			}
		}
		return result;
	} catch (e) {
		try {
			adapterLogger("extractAreasPerEmirate", "error", "Exception", toString(e));
		} catch (e) { }
		adapterResponse = {
			status: "1",
			code: 'RTA-CSHELL-ERROR-2',
			message_en:message_en,
			message_ar:message_ar
		};
		return adapterResponse;
	}
}
function getLookupData() {
	try {
		//		{"isSuccessful":true,"resultSet":[{"LABEL":"Abu Dhabi","ATTRIBUTE_VALUE":"AD"},{"LABEL":"Ajman","ATTRIBUTE_VALUE":"AJ"},{"LABEL":"Dubai","ATTRIBUTE_VALUE":"DU"},{"LABEL":"Emirate","ATTRIBUTE_VALUE":"EN"},{"LABEL":"Emirate","ATTRIBUTE_VALUE":"Emirate"},{"LABEL":"Fujajirah","ATTRIBUTE_VALUE":"FU"},{"LABEL":"Ras Al Khaimah","ATTRIBUTE_VALUE":"RA"},{"LABEL":"Sharjah","ATTRIBUTE_VALUE":"SH"},{"LABEL":"Umm Al Quwain","ATTRIBUTE_VALUE":"UM"}]}
		var adapterResponse;
		var emiratesLookup = MFP.Server.invokeSQLStatement({
			preparedStatement: getEmiratesStatement,
			parameters: []
		});


		var areasLookup = MFP.Server.invokeSQLStatement({
			preparedStatement: getAreaStatement,
			parameters: []
		});
		
		if (emiratesLookup && emiratesLookup.isSuccessful && emiratesLookup.resultSet && emiratesLookup.resultSet.length > 0 && 	areasLookup && areasLookup.isSuccessful && areasLookup.resultSet && areasLookup.resultSet.length > 0) {
			var emirates = emiratesLookup.resultSet;
			var result = [];
			for (var i = 0; i < emirates.length; i++) {
				var emirateElement = {
					key: emirates[i].ATTRIBUTE_VALUE,
					value: emirates[i].LABEL,
					areas: extractAreasPerEmirate(areasLookup.resultSet, emirates[i].ATTRIBUTE_VALUE)
				};
				result.push(emirateElement);
			}
			adapterResponse = {
				emirates: result,
				status:'0'
			};


		} else {
			return handleError(message_en,message_ar, 'RTA-CSHELL-ERROR-3',"getLookupData");
			// adapterResponse = {
			// 	status: "1",
			// 	code: 'RTA-CSHELL-ERROR-3',
			// 	message_en: message_en,
			// 	message_ar: message_ar
			// };
		}
		return adapterResponse
	} catch (e) {
		try {
			adapterLogger("getLookupData", "error", "Exception", toString(e));
		} catch (e) { }



		return handleError(message_en,message_ar, 'RTA-CSHELL-ERROR-2',"getLookupData");
		// adapterResponse = {
		// 	status: "1",
		// 	code: 'RTA-CSHELL-ERROR-2',
		// 	message_en: message_en,
		// 	message_ar: message_ar
		// };
		// return adapterResponse;
	}
}
