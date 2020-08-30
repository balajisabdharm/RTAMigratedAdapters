var Parking_USERNAME = "wifiEtisalatAdmin";
// var Parking_PASSWORD = "wifi@Adm1n#eTi$a1aT%$m";   // Production
var Parking_PASSWORD = "34rth4@ur"


var _userName = "Mobstguser";
var _password = "m792!du)+1g";

function getSmartParkingTransactionHistory(dataObject) {

	try {
		var getSmartParkingTransctionHistory =
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/mParkingProfileService/Schema.xsd">'
			+ '<soapenv:Header>'
			+ '<wsse:Security  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+ '<wsse:UsernameToken wsu:Id="UsernameToken-102">'
			+ '<wsse:Username>' + _userName + '</wsse:Username>'
			+ '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + _password + '</wsse:Password>' +
			'</wsse:UsernameToken>'
			+ '</wsse:Security>'
			+'</soapenv:Header>'
			+ '<soapenv:Body>'
			+ '<sch:getSmartParkingTransactionHistory>'
			+ '<sch:wsUser>' + Parking_USERNAME + '</sch:wsUser>'
			+ '<sch:wsPwd>' + Parking_PASSWORD + '</sch:wsPwd>'
			+ '<sch:msisdn>' + dataObject.msisdn + '</sch:msisdn>'
			+ '<sch:startDate>' + dataObject.FromDate + '</sch:startDate>'
			+ '<sch:endDate>' + dataObject.ToDate + '</sch:endDate>'
			+ '</sch:getSmartParkingTransactionHistory>'
			+ '</soapenv:Body>'
			+ '</soapenv:Envelope>';
		MFP.Logger.warn("getSmartParkingTransctionHistory request | " + getSmartParkingTransctionHistory)
		var input = {
			method: 'post',
			headers: {
				"SOAPAction": "getSmartParkingTransctionHistory"
			},
			returnedContentType: 'HTML',
			path: '/mParkingProfileService',
			body: {
				content: getSmartParkingTransctionHistory.toString(),
				contentType: 'text/xml; charset=utf-8'
			}
		};


		var result_getSmartParkingTransctionHistory = MFP.Server.invokeHttp(input);

		MFP.Logger.warn("getParkingAvailabliltyByZone result | " + JSON.stringify(result_getSmartParkingTransctionHistory))
		return result_getSmartParkingTransctionHistory

	} catch (exp) {
		var webServiceResult = {
			Envelope: {

				"Body": {}
				, "error": exp.toString()
				, "Header": ""
			}
			, "totalTime": 54
			, "isSuccessful": true
			, "responseHeaders": {"Date": +new Date() + ",'Content-Type':'text\/xml; charset=utf-8'"}
			, "statusReason": "OK"
			, "warnings": []
			, "errors": []
			, "info": []
			, "responseTime": 53
			, "statusCode": 200
		}
		MFP.Logger.warn("getParkingAvailabliltyByZone result | " + JSON.stringify(webServiceResult))
		return webServiceResult;

	}
}
function getSMSTransactionHistory(dataObject) {
	try {
		var getSMSTransactionHistory =
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/mParkingProfileService/Schema.xsd">'
			+ '<soapenv:Header>'
			+ '<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+ '<wsse:UsernameToken wsu:Id="UsernameToken-102">'
			+ '<wsse:Username>' + _userName + '</wsse:Username>'
			+ '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + _password + '</wsse:Password>' +
			'</wsse:UsernameToken>'
			+ '</wsse:Security>'
			+'</soapenv:Header>'
			+ '<soapenv:Body>'
			+ '<sch:getSMSTransactionHistory>'
			+ '<sch:wsUser>' + Parking_USERNAME + '</sch:wsUser>'
			+ '<sch:wsPwd>' + Parking_PASSWORD + '</sch:wsPwd>'
			+ '<sch:msisdn>' + dataObject.msisdn + '</sch:msisdn>'
			+ '<sch:startDate>' + dataObject.FromDate + '</sch:startDate>'
			+ '<sch:endDate>' + dataObject.ToDate + '</sch:endDate>'
			+ '</sch:getSMSTransactionHistory>'
			+ '</soapenv:Body>'
			+ '</soapenv:Envelope>';

		MFP.Logger.warn("getSMSTransactionHistory request |" + getSMSTransactionHistory);

		var input = {
			method: 'post',
			returnedContentType: 'HTML',
			path: '/mParkingProfileService',
			headers: {
				"SOAPAction": "getSMSTransactionHistory"
			},
			body: {
				content: getSMSTransactionHistory.toString(),
				contentType: 'text/xml; charset=utf-8'
			}
		};
		var result = MFP.Server.invokeHttp(input);
		MFP.Logger.warn("getSMSTransactionHistory response | Test" + JSON.stringify(result));
		return result;

	} catch (exp) {
		var webServiceResult = {
			Envelope: {

				"Body": {}
				, "error": exp.toString()
				, "Header": ""
			}
			, "totalTime": 54
			, "isSuccessful": true
			, "responseHeaders": {"Date": +new Date() + ",'Content-Type':'text\/xml; charset=utf-8'"}
			, "statusReason": "OK"
			, "warnings": []
			, "errors": []
			, "info": []
			, "responseTime": 53
			, "statusCode": 200
		}
		MFP.Logger.warn("getSMSTransactionHistory response error | " + JSON.stringify(webServiceResult));
		return webServiceResult;

	}
}
