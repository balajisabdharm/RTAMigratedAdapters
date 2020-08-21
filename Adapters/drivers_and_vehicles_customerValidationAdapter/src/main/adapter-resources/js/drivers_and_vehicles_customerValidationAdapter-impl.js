var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';
var userName = "%#credentials!#!username#%";
var password = "%#credentials!#!password#%";
var IsDebugging;
function Log(text){
	try {
		IsDebugging=MFP.Server.getPropertyValue("drivers_and_vehicles_is_debugging");
	}catch(e){
		IsDebugging="false";
	}
	// MFP.Logger.warn(""+IsDebugging);
	if(IsDebugging=="true")
		MFP.Logger.warn(text);
	else 
		MFP.Logger.debug(text);
}
function getUserApplicationService(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
			"urn:username" : userName,
			"urn:password" : password
	};
	var servicePath = '/ws/services/GetUserApplicationService';
	var _soapEnvNS = soapEnvNS+'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:GetUserApplicationService"';
	var parameters = [envHeader.toString(),params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("GetUserApplicationService request >> " + request);
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function confirmTrafficInfoService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	var servicePath='/ws/services/ConfirmTrafficInfoService';
	var _soapEnvNS = soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.inq.ws.ConfirmTrafficInfoService"';
	var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	return invokeWebServiceWithCDATAFix(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function mobilityCMLOrganizationsService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"etr:externalUserPassword": password,
			"etr:externalUsername": userName,
			"etr:password": password,
			"etr:username": userName
	};
	var servicePath='/ws/services/MobilityCMLOrganizationsService';
	var _soapEnvNS = soapEnvNS+ 'xmlns:etr="http://eTraffic.ws"';
	var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function customerService(request, isEncryptResponse, encryptionPassword) {
	var servicePath= '/ws/services/CustomerService';
	var parameters = [request.toString()];
	var request = buildBody(parameters, true);

	//Log("CustomerService request >> " + request);
	return invokeWebServiceStatic(request, servicePath, isEncryptResponse, encryptionPassword);
} 

function mobilityPersonInfoService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	var servicePath= '/ws/services/MobilityPersonInfoService';
	var _soapEnvNS = soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.inq.ws.PersonDetailsService"';
	var parameters = [envHeader.toString(), params.toString(),"",_soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("MobilityPersonInfoService request >> " + request);
	var result = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
	if(result.Envelope.Body.getPersonDetailsReturn != undefined && result.Envelope.Body.getPersonDetailsReturn != null
			&& result.Envelope.Body.getPersonDetailsReturn.persons.person != undefined && result.Envelope.Body.getPersonDetailsReturn.persons.person != null){
		
		result.Envelope.Body.getPersonDetailsReturn.persons.person.passportIssuePlace = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.bloodType = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.passportNo = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.phone = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.passportExpiryDate = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.mobile = "";
		result.Envelope.Body.getPersonDetailsReturn.persons.person.emiratesId = "";
		
	}
	return result;
}

function viewPersonPictureService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"impl:username" : userName,
			"impl:password" : password
	};
	var servicePath='/ws/services/ViewPersonPictureService';
	var _soapEnvNS = soapEnvNS+'xmlns:impl="http://ae.gov.trf.inq.ws.ViewPersonPictureService"';
	var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	var headers={"SOAPAction":"impl"};

	//Log("ViewPersonPictureService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function permitsService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"urn:username" : userName,
			"urn:password" : password
	};
	var servicePath = '/ws/services/PermitsService';
	var _soapEnvNS = soapEnvNS+'xmlns:urn="urn:PermitsService"';
	var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("PermitsService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}
function getMyApplicationPendingRequestsOrReferences(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"urn:username" : userName,
			"urn:password" : password
	};
	var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:urn="urn:GetUserApplicationService"';
	var parameters = [envHeader.toString(), params.toString(), "", soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	//MFP.Logger.debug("request to be sent:\n"+request);
	var servicePath='/ws/services/GetUserApplicationService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}
function getMyApplicationPendingRequestsOrReferencesByXml(requestParams, isEncryptResponse, encryptionPassword){
	var parameters = [requestParams.toString()];
	var request = buildBody(parameters, true);
	//MFP.Logger.debug("request to be sent:\n"+request);
	var servicePath='/ws/services/GetUserApplicationService';
	return invokeWebServiceStatic(request,servicePath, isEncryptResponse, encryptionPassword);
}
function savePhoto(params, isEncryptResponse, encryptionPassword) {
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'savePhoto',
			parameters : [params.toString(), isEncryptResponse.toString(), encryptionPassword.toString()]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function documentValidation(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
			"rta:externalUserPassword": password,
			"rta:externalUsername": userName,
			"rta:username" : userName,
			"rta:password" : password
	};
	var _soapEnvNS = soapEnvNS+ 'xmlns:rta="rta:DocumentValidationService"';

	var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	//MFP.Logger.warn("request to be sent:\n"+request);
	var servicePath='/ws/services/DocumentValidationService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function invokeWebService(body,servicePath,headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
	if (!headers)
		headers = {
			"SOAPAction" : ""
	};
	else
		headers["SOAPAction"] = "";

	var input = {
			method : 'post',
			returnedContentType : 'HTML',
			path :servicePath ,
			headers : {
				"SOAPAction" : 'impl'
			},
			body : {
				content : body.toString(),
				contentType : 'text/xml; charset=utf-8'
			}
	};

	// Adding custom HTTP headers if they were provided as parameter to the
	// procedure call
	headers && (input['headers'] = headers);

	var webServiceResult = MFP.Server.invokeHttp(input);

	if(isEncryptResponse != undefined && isEncryptResponse == true)
	{
		var responseString = JSON.stringify(webServiceResult);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [responseString,encryptionPassword]
		};
		webServiceResult = MFP.Server.invokeProcedure(invocationData);
	}

	var endTime = new Date().getTime();
	//Log("time for "+ servicePath + " is " + (endTime - startTime) + " ms");
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData); 
}
function invokeWebServiceWithCDATAFix (body,servicePath,headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
	if (!headers)
		headers = {
			"SOAPAction" : ""
	};
	else
		headers["SOAPAction"] = "";

	var input = {
			method : 'post',
			returnedContentType : 'HTML',
			path :servicePath ,
			headers : {
				"SOAPAction" : 'impl'
			},
			body : {
				content : body.toString(),
				contentType : 'text/xml; charset=utf-8'
			}
	};

	// Adding custom HTTP headers if they were provided as parameter to the
	// procedure call
	headers && (input['headers'] = headers);

	var webServiceResult = MFP.Server.invokeHttp(input);

	if(isEncryptResponse != undefined && isEncryptResponse == true)
	{
		var responseString = JSON.stringify(webServiceResult);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [responseString,encryptionPassword]
		};
		webServiceResult = MFP.Server.invokeProcedure(invocationData);
	}

	var endTime = new Date().getTime();
	//Log("time for "+ servicePath + " is " + (endTime - startTime) + " ms");
	if(webServiceResult.Envelope.Body.validateTrafficInfoReturn != undefined) {
		webServiceResult.Envelope.Body.validateTrafficInfoReturn = {CDATA : webServiceResult.Envelope.Body.validateTrafficInfoReturn};
	}
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData); 
}

function invokeWebServiceStatic(request, servicePath, isEncryptResponse, encryptionPassword) {
	var input = {
			method : 'post',
			headers : {
				"SOAPAction" : ""
			},
			returnedContentType : 'HTML',
			path : servicePath, 
			body : {
				content : JSON.parse(request),
				contentType : 'text/xml; charset=utf-8'
			}
	};

	var webServiceResult = MFP.Server.invokeHttp(input);
	if(isEncryptResponse != undefined && isEncryptResponse == true)
	{
		var responseString = JSON.stringify(webServiceResult);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [responseString,encryptionPassword]
		};
		webServiceResult = MFP.Server.invokeProcedure(invocationData);
	}
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData); 
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

