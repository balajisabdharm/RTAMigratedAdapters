var Parking_USERNAME = "wifiEtisalatAdmin";
var Parking_PASSWORD = "34rth4@ur";
//var Parking_PASSWORD = "wifi@Adm1n#eTi$a1aT%$m";    // Production

function balanceEnquiry(linkageId,isEncryptResponse, encryptionPassword) {
	var request = getRequestString('balanceEnquiry', linkageId, '');
	var requestObj = buildBody([ request ], true);
	return invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
}
function initNFCPayment(linkageId, mobileNumber, amount, serviceId,
		isEncryptResponse, encryptionPassword) {
	var boyParametersString = '<msisdn>' + mobileNumber + '</msisdn>'
	+ '<amount>' + amount + '</amount><serviceId>4</serviceId>';
	var request = getRequestString('initNFCPayment', linkageId,boyParametersString);
	var requestObj = buildBody([ request ], true);
	return invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
}
function completeNFCPayment(linkageId, mobileNumber, nfcTxnId, status,
		serviceId, isEncryptResponse, encryptionPassword) {
	var boyParametersString = '<msisdn>' + mobileNumber + '</msisdn>'
	+ '<nfcTxnId>' + nfcTxnId + '</nfcTxnId>' + '<status>' + status
	+ '</status><serviceId>4</serviceId>';
	var request = getRequestString('completeNFCPayment', linkageId,
			boyParametersString);
	var requestObj = buildBody([ request ], true);
	return invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
}
function getRequestString(operationName, linkageId, bodyParametersString) {
	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.smartphone.infocomm.com/">'+
	'<soapenv:Header/>'+
	'<soapenv:Body>'+
	'<ws:'+operationName+'>'+
	'<userId>'+Parking_USERNAME+'</userId>'+
	'<pwd>'+Parking_PASSWORD+'</pwd>'+
	'<smartPhoneAppId>'+linkageId+'</smartPhoneAppId>'+
	bodyParametersString +
	'</ws:'+operationName+'>'+
	'<soapenv:Body>'+
	'</soapenv:Envelope>';
	return request.toString();
}
function invokeWebServiceString(request, isEncryptResponse, encryptionPassword) {
	try{
		var input = {
				method : 'post',
				headers : {
					"SOAPAction" : ""
				},
				returnedContentType : 'HTML',
				path : '/mParkingSmartPhoneWS/smartPhoneWS',
				body : {
					content : JSON.parse(request),
					contentType : 'text/xml; charset=utf-8'
				}
		};

		var webServiceResult = MFP.Server.invokeHttp(input);
		if (isEncryptResponse != undefined && isEncryptResponse == true) {
			var responseString = JSON.stringify(webServiceResult);
			var invocationData = {
					adapter : 'drivers_and_vehciles_utilitiesAdapter',
					procedure : 'encryptData',
					parameters : [ responseString, encryptionPassword ]
			};
			webServiceResult = MFP.Server.invokeProcedure(invocationData);
		}
		return webServiceResult;
	}catch(exp){
		var webServiceResult= {
				Envelope:{

					"Body":{}
		,"error":exp.toString()
		,"Header":""}
		,"totalTime":54
		,"isSuccessful":true
		,"responseHeaders":{"Date":+new Date()+",'Content-Type':'text\/xml; charset=utf-8'"}
		,"statusReason":"OK"
			,"warnings":[]
		,"errors":[]
		,"info":[]
		,"responseTime":53
		,"statusCode":200
		}
		return webServiceResult; 

	}
}

function isUndefinedOrNull(obj) {
	if (obj == undefined || obj == null) {
		return true;
	}
	return false;
}
function buildBody(parameters, isStatic) {
	var request = "";

	if (isStatic == true) {
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBodyFromStaticRequest',
			parameters : parameters,

		});
	} else {
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBody',
			parameters : parameters
		});
	}

	return request.body;
}
