//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////Adapter Constants///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var adapterName = "NILoyaltyAdapter";
var WSDL_Path = "/NILoyaltyAccountManagementService";
var WSSE_USERNAME_EXTERNAL = MFP.Server.getPropertyValue("tokens.mstore.username.external");
var WSSE_PASSWORD_EXTERNAL = MFP.Server.getPropertyValue("tokens.mstore.password.external");
var wsseSecurityHeader = '<soapenv:Header>' + '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" ' + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + '<wsse:UsernameToken wsu:Id="UsernameToken-102"><wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username>' + '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password>' + '</wsse:UsernameToken></wsse:Security></soapenv:Header>';
var message_en = "Something went wrong! Please try again later!";
var message_ar = "هناك خطأ ما. يُرجى إعادة المحاولة مرة أخرى!";
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////Helpers Functions///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

var xsdStr = "http://www.rta.ae/ActiveMatrix/ESB/NILoyaltyAccountManagementService/SharedResources/XMLSchema/NILoyaltyAccountManagementServiceSchema.xsd";
function fixNameSpace(response){
	MFP.Logger.info(" ================================================= REMOVING NAMESPACE =================================================");
	var newResponse = JSON.stringify(response);
	reg1 = new RegExp('"":"'+xsdStr+'",',"g");
	reg2 = new RegExp('{"CDATA":',"g");
	reg3 = new RegExp('"},"',"g");
	
	
	newResponse = newResponse.replace(reg1,"").replace(reg2,"").replace(reg3,"\",\"").replace(/}},/g,"},").replace(/}}]/g,"}]")+"}";
	//MFP.Logger.info("refined Response -->" + response);
	
	try{
		
		
		return JSON.parse(newResponse);
	}catch(e){
		MFP.Logger.info("NOT RETURNING refined Response -->" );
		return response;
	}
}

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
function handleError(msg_en, msg_ar, code, procudureName) {
	msg_en = toString(msg_en) || message_en;
	msg_ar = toString(msg_ar) || message_ar;
	code = code || errorCode;
	adapterLogger("handleError", "error", "Error", JSON.stringify([msg_en, msg_ar, code, procudureName]));
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
		MFP.Logger.error("|" + adapterName + " |adapterLogger |Exception" + toString(e));
	}
}
function invokeWebService(body, headers) {
	var input = {
		method: 'post',
		returnedContentType: 'xml',
		returnedContentEncoding: 'utf-8',
		path: WSDL_Path,
		headers: headers,
		body: {
			content: body.toString(),
			contentType: 'text/xml; charset=utf-8'
		}
	};
	return WL.Server.invokeHttp(input);
}

// var wsseSecurityHeader = '<soapenv:Header>' + '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" ' + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' + '<wsse:UsernameToken wsu:Id="UsernameToken-102"><wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username"] + '</wsse:Username>' + '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password"] + '</wsse:Password>' + '</wsse:UsernameToken></wsse:Security></soapenv:Header>';
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
	
			return {
				authRequired: false
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

		case '99':
		case 99:
		case '215':
		case 215:
		case '222':
		case 222:
		case '312':
		case 312:
		case '999':
		case 999:
		case '902':
		case 902:
		case '1000':
		case 1000:
		case '1400':
		case 1400:
		case '1401':
		case 1401:
		case '1402':
		case 1402:
		case 'RTA-ESB-ManageLoyaltyRegistrationService-ERROR-10001':
			msg_en = "Something went wrong! Please try again later!";
			msg_ar = "هناك خطأ ما. يُرجى إعادة المحاولة مرة أخرى!";
			break;
		case '1403':
		case 1403:
		case '1404':
		case 1404:
		case '1405':
		case 1405:
		case '1406':
		case 1406:
		case '1412':
		case 1412:
		case '2027':
		case 2027:
		case '2032':
		case 2032:
		case '2051':
		case 2051:
			msg_en = "Something wrong with you profile information’s! Please Contact nolplus call center try again later!";
			msg_ar = "هناك خطأ ما في بيانات حسابك. يُرجى التواصل مع مركز الاتصال نول بلاس";
			break;
		case '1407':
		case 1407:
			msg_en = "Please add at least one nol Card to activate your nol Plus account.";
			msg_ar = "يُرجى إضافة بطاقة نول واحدة على الأقل لتفعيل حساب نول بلاس الخاص بك.";
			break;
		case '1407':
		case 1407:
			msg_en = "Please add at least one nol Card to activate your nol Plus account.";
			msg_ar = "يُرجى إضافة بطاقة نول واحدة على الأقل لتفعيل حساب نول بلاس الخاص بك.";
			break;
		case '1408':
		case 1408:
			msg_en = "The maximum number of cards enter OR selected to one account is 4.";
			msg_ar = "الحد الأقصى لعدد البطاقات المرتبطة بحساب واحد هو 4 بطاقات.";
			break;
		case '1409':
		case 1409:
		case '1410':
		case 1410:
		case '1411':
		case 1411:
			msg_en = "Please enter the correct nol Tag ID";
			msg_ar = "يُرجى إدخال الرقم الصحيح لبطاقة نول";
			break;
		case '2052':
		case 2052:
			msg_en = "Your nol Card linked to other account, please enter another nol Card";
			msg_ar = "رقم بطاقة نول المدخلة مربوط بحساب أخر، يُرجى إدخال بطاقة نول أخرى";
			break;
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
function getBalance(userId, balanceType) {
	try {
		if (!userId) {
			var errorMapping = handleSystemMessages('RTA-CSHELL-ERROR-1');
			return handleError(errorMapping.message_en, errorMapping.message_ar, errorMapping.responseCode, "getBalance");
		}
		var response = "";
		if (userId) {
			var balanceType = balanceType ? balanceType : "PL";
			var request = '<soapenv:Envelope xmlns:nil="http://www.rta.ae/ActiveMatrix/ESB/NILoyaltyAccountManagementService/SharedResources/XMLSchema/NILoyaltyAccountManagementServiceSchema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> <soapenv:Header> <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> <wsse:UsernameToken wsu:Id="UsernameToken-28"> <wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username> <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password> <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">eREuKy29HgWD5n9BO13tkw==</wsse:Nonce> <wsu:Created>2018-12-04T11:27:52.892Z</wsu:Created> </wsse:UsernameToken> </wsse:Security> </soapenv:Header> <soapenv:Body> <nil:getAccountStatusRequest> <nil:userId>' + userId + '</nil:userId> </nil:getAccountStatusRequest> </soapenv:Body> </soapenv:Envelope>';
			adapterLogger("getBalance", "info", "Request", request);
			var response = fixNameSpace(invokeWebService(request));
			adapterLogger("getBalance", "info", "Response--==>>", toString(response.Envelope.Body.getAccountStatusResponse));
			if (response && response.isSuccessful && response.statusCode == 200) {
				if (response.Envelope && response.Envelope.Body && response.Envelope.Body.getAccountStatusResponse) {
					var getAccountStatusResponse = response.Envelope.Body.getAccountStatusResponse;
					adapterLogger("getBalance", "info", "getAccountStatusResponse", toString(getAccountStatusResponse));
					var loyaltyAccountInfo = response.Envelope.Body.getAccountStatusResponse.loyaltyAccountInfo;
					var bucket = response.Envelope.Body.getAccountStatusResponse.bucket;

					if (getAccountStatusResponse.responseCode == 0 && loyaltyAccountInfo && bucket) {
						// user here is joined the program
						var accountId = loyaltyAccountInfo.accountId;
						if (accountId.indexOf('/') > -1) {
							accountId = accountId.split('/')[accountId.split('/').length - 1];
						}
						if (bucket.balance) {
							var balance = convertObiectToArray(bucket.balance);
							if (balance && balance.length > 0) {
								for (var i = 0; i < balance.length; i++) {
									if (balance[i].type == balanceType.toString()) {
										adapterLogger("getBalance", "info", "Procedure Success Return", "User Joined in loyalty program");
										response = {
											isSuccessful: true,
											"isRegistered": true,
											"balance": balance[i],
											loyaltyAccountId: accountId
										};
										adapterLogger("getBalance", "info", "Procedure Success Return", toString(response));
										return response;
									}
								}
							}
						} else {
							adapterLogger("getBalance", "info", "Procedure Success Return", "User Joined in loyalty program");
							response = {
								isSuccessful: true,
								"isRegistered": true,
								"balance": {
									amount: 0
								},
								loyaltyAccountId: accountId
							};
							adapterLogger("getBalance", "info", "Procedure Success Return", toString(response));
							return response;
						}
					}
				}
				adapterLogger("getBalance", "info", "Procedure Success Return", "User Not Joined in loyalty program");
				response = {
					isSuccessful: true,
					"isRegistered": false
				};
				adapterLogger("getBalance", "info", "Procedure Success Return", toString(response));
				return response
			} else {
				adapterLogger("getBalance", "error", "Status Code is not 200");
				response = handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getBalance");
				adapterLogger("getBalance", "error", "Status Code is not 200", toString(response));
				return response;
			}
		}
	} catch (e) {
		adapterLogger("getBalance", "error", "Exception", toString(e));

		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "getBalance");
	}
}

function createXMLElement(key, value, prefix) {
	if (prefix) {
		return '<' + prefix + ':' + key + '>' + value + '</' + prefix + ':' + key + '>';
	} else {
		return '<' + key + '>' + value + '</' + key + '>';
	}
}
function createComplexObjectXMLElement(key, valueObject, prefix, sortingKeys) {
	var result = '';

	if (sortingKeys) {
		for (var i = 0; i < sortingKeys.length; i++) {
			if (valueObject.hasOwnProperty(sortingKeys[i])) {
				result += createXMLElement(sortingKeys[i], valueObject[sortingKeys[i]], prefix);
			}
		}
	} else {
		for (var valueObjectKey in valueObject) {
			if (valueObject.hasOwnProperty(valueObjectKey)) {
				result += createXMLElement(valueObjectKey, valueObject[valueObjectKey], prefix);
			}
		}
	}

	return createXMLElement(key, result, prefix);
}
function createComplexArrayXMLElement(key, itemKey, valueArray, prefix, sortingKeys) {
	var result = '';

	for (var i = 0; i < valueArray.length; i++) {
		result += createComplexObjectXMLElement(itemKey, valueArray[i], prefix, sortingKeys);
	}
	return createXMLElement(key, result, prefix);
}

function createServiceEnrolmentBody(rtaID, emailLanguage, attributes, nolCards) {
	var prefix = 'nil', result;
	var rtaIDElement = createXMLElement('rtaID', rtaID, prefix);
	var emailLanguageElement = createXMLElement('emailLanguage', emailLanguage, prefix);
	var attributesElement = createComplexArrayXMLElement('attributes', 'attribute', attributes, prefix
		, ['attributeName', 'attributeType', 'attributeValue', 'updateType']);

	var nolCardsElement = '';
	for (var i = 0; i < nolCards.length; i++) {
		var tagIDElement = '', nolCardsAttributesElement = '';
		if (nolCards[i] && nolCards[i].tagID)
			tagIDElement = createXMLElement('tagID', nolCards[i].tagID, prefix) || '';
		if (nolCards[i] && nolCards[i].attributes)
			nolCardsAttributesElement = createComplexArrayXMLElement('attributes', 'attribute', nolCards[i].attributes, prefix, ['attributeName', 'attributeType', 'attributeValue', 'updateType']) || '';

		nolCardsElement += createXMLElement('nolCard', tagIDElement + nolCardsAttributesElement, prefix);
	}
	nolCardsElement = createXMLElement('nolCards', nolCardsElement, prefix);

	result = rtaIDElement + emailLanguageElement + attributesElement + nolCardsElement;
	return createXMLElement('Body', createXMLElement('serviceEnrolmentRequest', result, prefix), 'soapenv');
}
function createServiceEnrolmentRequest(rtaID, emailLanguage, attributes, nolCards) {
	return '<soapenv:Envelope xmlns:nil="http://www.rta.ae/ActiveMatrix/ESB/NILoyaltyAccountManagementService/SharedResources/XMLSchema/NILoyaltyAccountManagementServiceSchema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' + wsseSecurityHeader + createServiceEnrolmentBody(rtaID, emailLanguage, attributes, nolCards) + '</soapenv:Envelope>';
}



function fixNameSpace_servEnrol(response){
	MFP.Logger.info(" ================================================= REMOVING NAMESPACE ENROLLMENT=================================================");
	var newResponse = JSON.stringify(response);
	reg1 = new RegExp('"":"http://www.rta.ae/ActiveMatrix/ESB/NILoyaltyAccountManagementService/SharedResources/XMLSchema/NILoyaltyAccountManagementServiceSchema.xsd",',"g");
	reg2 = new RegExp('{"CDATA":',"g");
	reg3 = new RegExp('"},"',"g");
	reg4 = new RegExp('}}}}',"g");
	
	newResponse = newResponse.replace(reg1,"").replace(reg2,"").replace(reg3,"\",\"").replace(reg4,"}}");
	MFP.Logger.info("refined Response -->" + newResponse);
	
	try{
		return JSON.parse(newResponse);
	}catch(e){
		return response;
	}
}


function serviceEnrolment(rtaID, emailLanguage, attributes, nolCards) {

	try {
		var adapterResponse, fault, status = '1', code = 'RTA-CSHELL-ERROR-5', loyaltyId;
		adapterLogger("serviceEnrolment", "info", "rtaID", toString(rtaID));
		adapterLogger("serviceEnrolment", "info", "emailLanguage", toString(emailLanguage));
		adapterLogger("serviceEnrolment", "info", "attributes", toString(attributes));
		adapterLogger("serviceEnrolment", "info", "nolCards", toString(nolCards));
		if (isUndefinedOrNull(rtaID)
			|| isUndefinedOrNull(emailLanguage)
			// || isUndefinedOrNull(attributes)
			// || isUndefinedOrNull(nolCards)
		) {
			var errorMapping = handleSystemMessages('RTA-CSHELL-ERROR-1');
			return handleError(errorMapping.message_en, errorMapping.message_ar, errorMapping.responseCode, "serviceEnrolment");
		}
		var request = createServiceEnrolmentRequest(rtaID, emailLanguage, JSON.parse(toString(attributes)),
			JSON.parse(toString(nolCards)));
		// var request = createServiceEnrolmentRequest(rtaID, emailLanguage, attributes, nolCards);
		adapterLogger("serviceEnrolment", "info", "Request", request);
		var response = invokeWebService(request);
		
		response.Envelope.Body = fixNameSpace_servEnrol(response.Envelope.Body);
		
		adapterLogger("serviceEnrolment", "info", "Response", toString(response));
		if (response && response.isSuccessful && response.statusCode == 200) {
			MFP.Logger.info("GOT success response from be 200");
			if (response.Envelope
				&& response.Envelope.Body
				&& response.Envelope.Body.serviceEnrolmentReturn
				&& response.Envelope.Body.serviceEnrolmentReturn.serviceEnrolmentResponse) {
				var serviceEnrolmentResponse = response.Envelope.Body.serviceEnrolmentReturn.serviceEnrolmentResponse;
				adapterLogger("serviceEnrolment", "info", "serviceEnrolmentResponse", toString(serviceEnrolmentResponse));
				MFP.Logger.info("Got response from BE "+serviceEnrolmentResponse.responseCode);
				if (serviceEnrolmentResponse.responseCode == "0" || serviceEnrolmentResponse.responseCode == 0) {
					status = '0';
					loyaltyId = serviceEnrolmentResponse.loyaltyId;
				} else {
					MFP.Logger.info("Got response Code in else (FIRST):: "+serviceEnrolmentResponse.responseCode);
					code = serviceEnrolmentResponse.responseCode;
					fault = {
						faultstring: serviceEnrolmentResponse.responseDesc,
						faultcode: serviceEnrolmentResponse.responseCode
					};
					MFP.Logger.info("Values updated :: ");
				}
			}
		} else {
			MFP.Logger.info("n else [parsing errors object :: ");
			if (response.errors && response.errors.length > 0) {
				if (response.Envelope
					&& response.Envelope.Body
					&& response.Envelope.Fault) {
					//Tibco Issues RTA-CSHELL-ERROR-4
					// code = 'RTA-CSHELL-ERROR-4';
					fault = response.Envelope.Fault;
					code = response.Envelope.Fault.faultcode || 'RTA-CSHELL-ERROR-4';

				} else if (response.errors[0].indexOf('xml') > -1) {
					//Tibco Issues RTA-CSHELL-ERROR-4
					// code = 'RTA-CSHELL-ERROR-4';
					fault = {
						faultstring: _extractXMLValue("faultstring", response.errors[0]),
						faultcode: _extractXMLValue("faultcode", response.errors[0])
					};
					code = _extractXMLValue("faultcode", response.errors[0]);

				} else {
					//handle MFP error like ssl issue
					code = 'RTA-CSHELL-ERROR-3';
					fault = {
						faultstring: response.errors[0],
						faultcode: response.errors[0]
					};

				}
			}
		}
		if (status == '0') {
			adapterResponse = {
				status: status,
				loyaltyId: loyaltyId
			};
		} else {
			MFP.Logger.info("In else with code :: "+ code);
			var errorMapping = handleSystemMessages(code);
			MFP.Logger.info("In else with code :: "+ JSON.stringify(errorMapping));
			return handleError(errorMapping.message_en, errorMapping.message_ar, errorMapping.responseCode, "serviceEnrolment", fault);
		}
		adapterLogger("serviceEnrolment", "info", "adapterResponse", toString(adapterResponse));
		return adapterResponse;
	} catch (e) {
		try {
			adapterLogger("serviceEnrolment", "error", "Exception", toString(e));
		} catch (e) { }
		return handleError(message_en, message_ar, 'RTA-CSHELL-ERROR-2', "serviceEnrolment");
	}
}
