﻿var username_tibco = MFP.Server.getPropertyValue("tokens.tipcoService.username");
var password_tibco = MFP.Server.getPropertyValue("tokens.tipcoService.password");

function resetNolPin(nolRequest) {
	MFP.Logger.warn("rta_resetNolPinAdapter | resetNolPin | Start | "+ JSON.stringify(nolRequest));
	var date = nolRequest.dateOfBirth;
	var parts = date.split('-');
	// Please pay attention to the month (parts[1]); JavaScript counts months from 0: January - 0, February - 1, etc.
	var requestDate = new Date(parts[0], parts[1] - 1, parts[2]);
	MFP.Logger.warn("Date in ISO Format: " + requestDate.toISOString());
	var bodyRequest = "<sch:resetCardPinRequest>";
	bodyRequest += "<sch:cardTagId>" + nolRequest.cardTagId + "</sch:cardTagId>";
	bodyRequest += "<sch:confirmReset>" + nolRequest.confirmReset + "</sch:confirmReset>";
	bodyRequest += "<sch:dateOfBirth>" + requestDate.toISOString() + "</sch:dateOfBirth>";
	bodyRequest += "</sch:resetCardPinRequest>";
	var request = getRequestString(bodyRequest);
	var finalRequest = request.toString();
	MFP.Logger.warn("rta_resetNolPinAdapter | resetNolPin | beforCalling buildBody | " + finalRequest)
	var requestObj = buildBody([ finalRequest ], true);
	MFP.Logger.warn("rta_resetNolPinAdapter | resetNolPin | afterCalling buildBody | " + requestObj)
	return invokeWebServiceString(requestObj);
}

function getRequestString(bodyString) {
	var requestDate = new Date(Date.now());
	var requestDateFormated = requestDate.toISOString(); // Returns
	// 2011-10-05T14:48:00.000Z
	var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/ResetNolCardPinService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" >';
	request	+=  "<soapenv:Header>";
	request	+=  '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/" >';
	request	+=  '<wsse:UsernameToken>';
	request	+=  "<wsse:Username>";
	request	+=  username_tibco;
	request	+=  "</wsse:Username>";
	request	+=  '<wsse:Password>';
	request	+=  password_tibco;
	request	+=  "</wsse:Password>";
	request	+=  "</wsse:UsernameToken>";
	request	+=  "</wsse:Security>";
	request	+=  "</soapenv:Header>";
	request	+= '<soapenv:Body>';
	request	+= bodyString ;
	request	+= '</soapenv:Body>' + '</soapenv:Envelope>';
	return request;
}


function invokeWebServiceString(request) {
	MFP.Logger.warn(request);
	var input = {
			method : 'post',
			headers : {
				"SOAPAction" : ""
			},
			returnedContentType : 'HTML',
			path : '/resetNolCardPinService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};

	var webServiceResult = MFP.Server.invokeHttp(input);
	//MFP.Logger.warn(webServiceResult);
	//MFP.Logger.warn(JSON.stringify(webServiceResult));
	var invocationData1 = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData1);
}

function isUndefinedOrNull(obj) {
	if (obj == null) {
		return true;
	}
	return false;
}

function buildBody(parameter, isStatic) {
	var request = "";
	if (isStatic == true) {
		MFP.Logger.info("beforCalling buildBodyFromStaticRequest | " + parameter)
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBodyFromStaticRequest',
			parameters : parameter

		});
	} else {
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBody',
			parameters : parameter
		});
	}

	return request.body;
}
