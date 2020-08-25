///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Generated code  																			 //
////
//This is a SOAP adapter that was auto-generated by Worklight for invocation of specific SOAP-based services.   //
//The adapter may invoke more than one service as long as they are all from the same enpdpoint (server host).   //
//Each adapter procedure matches a single operation for the same endpoint server and accepts:                   //
//params  - Serialized JSON representation of the XML-based SOAP body to be sent to the service               //
//headers - Custom HTTP headers to be specified when invoking the remote service. It is a JSON object with    //
//the headers names and values. E.g. { 'name1' : 'value1', 'name2' : 'value2' }                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function getHandBooksDetails(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	var _soapEnvNS = soapEnvNS +'xmlns:ae="http://ae.gov.trf.drl.ws.TrainingManualService"';
	//var parameters = [envHeader, params, "", _soapEnvNS];
	var parameters = [JSON.stringify(envHeader), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	//MFP.Logger.debug("request to be sent:\n"+request);
	var servicePath='ws/services/TrainingManualService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function LearningPermitsService(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
			"rta:username" : userName,
			"rta:password" : password
	};
	var servicePath='/ws/services/LearningPermitsService';	
	var _soapEnvNS =soapEnvNS +'xmlns:rta="rta:LearningPermitsService"';
	var parameters = [JSON.stringify(envHeader), JSON.stringify(params), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("MobilityDrivingLicenseInfoService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}
///////////////


function getTrainingInformation(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
			"etr:username" : userName,
			"etr:password" : password,
	};
	var servicePath='/traffic/services/DIIntegerationService';	
	var _soapEnvNS =soapEnvNS +'xmlns:etr="http://eTraffic.ws"';
	var parameters = [JSON.stringify(envHeader), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("getTrainingInformation request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}


function getPaymentClearance(params, isEncryptResponse, encryptionPassword){


	var envHeader = {
			"cli:username" : userName,
			"cli:password" : password,

	};
	var servicePath='/ws/services/PaymentClearanceService';	
	var _soapEnvNS =soapEnvNS +'xmlns:cli="http://client.pce.ws.dtt.esrv.rta.ae"';

	var parameters = [JSON.stringify(envHeader), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("getPaymentClearance request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);


}

function getPlateVehicleDetails(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:ae="http://ae.gov.trf.vhl.ws.GeneralPlateService"';
	var parameters = [JSON.stringify(envHeader), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	//Log("request to be sent:>>"+request);
	var servicePath = '/ws/services/GeneralPlateService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function SeasonalParkingPermitService(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:rta="rta:SeasonalParkingPermitService"';
	var parameters = [JSON.stringify(envHeader), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	//Log("request to be sent:>> "+request);
	var servicePath = '/ws/services/SeasonalParkingPermitService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function SeasonalCardService(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'SeasonalCardService',
			parameters : [envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function SeasonalParkingPermitTransaction(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'SeasonalParkingPermitTransaction',
			parameters : [envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);

}
function SeasonalParkingPermitTransaction_DD(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'SeasonalParkingPermitTransaction_DD',
			parameters : [envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);

}
function getSeasonalApplicationIdByTransactionId(params, isEncryptResponse, encryptionPassword) {

	var cardsData = {};
	var envHeadersRTA = {			
			"rta:password" : params.password,
			"rta:username" : params.username,

	};
	var soapEnvNSRTA = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:rta="rta:SeasonalParkingPermitService"';
	cardsData = params["cardsData"];	

	//Log(cardsData);
	// get application ID
	var serviceParams = {
			"rta:getSeasonalApplicationIdByTransactionId" :{
				"rta:transactionId":cardsData.transactionId
			}
	};
	//var parameters = [envHeadersRTA, serviceParams, "", soapEnvNSRTA];
	var parameters = [JSON.stringify(envHeadersRTA), serviceParams.toString(), '', soapEnvNSRTA.toString()];
	var request = buildBody(parameters, false);
	//Log("request to be sent:\n"+request);
	var servicePath = '/ws/services/SeasonalParkingPermitService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function getSeasonalApplicationIdByTransactionId_DD(params, isEncryptResponse, encryptionPassword) {

	var cardsData = {};
	var envHeadersRTA = {			
			"rta:password" : params.password,
			"rta:username" : params.username,

	};
	var soapEnvNSRTA = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:rta="rta:SeasonalParkingPermitService"';
	var transactionInfo = params["cardsInfo"]["transactionInfo"];	

	//Log(cardsData);
	// get application ID
	var serviceParams = {
			"rta:getSeasonalApplicationIdByTransactionId" :{
				"rta:transactionId":transactionInfo.transactionId
			}
	};
	var parameters = [JSON.stringify(envHeadersRTA), serviceParams.toString(), '', soapEnvNSRTA.toString()];
	var request = buildBody(parameters, false);
	//Log("request to be sent:\n"+request);
	var servicePath = '/ws/services/SeasonalParkingPermitService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}

function getSeasonalParkingPermitsByTrafficFileNo(trafficFileNo, isEncryptResponse, encryptionPassword) {
	/*invocationData = {
							adapter : 'drivers_and_vehicles_trafficAdapter',
							procedure : 'SeasonalParkingPermitTransaction',
							parameters : [envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword]
						};
		return MFP.Server.invokeProcedure(invocationData);*/
	var permits = [];
	//permits.push({plateNo : "5369", plateCode : "D", plateCategory : "Private", emirate : "2", category : "A", expiryDate : "31/12/2016", expiryDateAr : "2016/12/31"});

	var webServiceResult = {permits : permits};
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
	return MFP.Server.invokeProcedure(invocationData); }

function invokeWebService(body,servicePath, headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
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
	return MFP.Server.invokeProcedure(invocationData); }


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
	return MFP.Server.invokeProcedure(invocationData); }

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
