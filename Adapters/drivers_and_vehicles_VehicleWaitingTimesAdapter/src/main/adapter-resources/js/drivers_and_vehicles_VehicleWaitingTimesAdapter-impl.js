var username_tibco = "%#credentials!#!username_tibco#%";
var password_tibco = "%#credentials!#!password_tibco#%";

var IsDebugging;
function Log(text) {
	try {
		IsDebugging = MFP.Server.getPropertyValue("drivers_and_vehicles_is_debugging");
	} catch (e) {
		IsDebugging = "false";
	}
	MFP.Logger.warn("" + IsDebugging);
	if (IsDebugging == "true")
		MFP.Logger.warn(text);
	else
		MFP.Logger.debug(text);
}

function getAvailableServices(isEncryptResponse, encryptionPassword) {

	var servicePath = '/vehicleTestCentersService';
	var request =	
		'<soapenv:Envelope xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/VehicleTestCentersService/VehicleTestCentersServiceSchema/XMLSchema" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu ="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"'+ 
		' xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'+
		'<soapenv:Header>'+
		'<wsse:Security>'+
		'<wsse:UsernameToken>'+
		'<wsse:Username>'+username_tibco+'</wsse:Username>'+
		'<wsse:Password>'+password_tibco+'</wsse:Password>'+
		'</wsse:UsernameToken>'+
		'</wsse:Security>'+
		'</soapenv:Header>'+
		'<soapenv:Body>'+
		'<sch:GetAvailableServicesRequest/>'+
		'</soapenv:Body>'+
		'</soapenv:Envelope>';

	var requestObj = buildBody([ request.toString() ], true);
	return invokeWebServiceString(requestObj, servicePath, "", isEncryptResponse, encryptionPassword);
}

function getCentersData(param, currentLocation, language, isEncryptResponse, encryptionPassword) {

	var servicePath = '/vehicleTestCentersService';

	var vehicleType = param.vehicleType;
	var service = param.service;

	var request =

		'<soapenv:Envelope xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/VehicleTestCentersService/VehicleTestCentersServiceSchema/XMLSchema" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu ="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"'+ 
		' xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'+
		'<soapenv:Header>'+
		'<wsse:Security>'+
		'<wsse:UsernameToken>'+
		'<wsse:Username>'+username_tibco+'</wsse:Username>'+
		'<wsse:Password>'+password_tibco+'</wsse:Password>'+
		'</wsse:UsernameToken>'+
		'</wsse:Security>'+
		'</soapenv:Header>'+
		'<soapenv:Body>'+
		'<sch:GetCentersDataRequest>'+
		' <sch:vehicleType>'+vehicleType+'</sch:vehicleType>'+
		'<sch:service>'+service+'</sch:service>'+
		'</sch:GetCentersDataRequest>'+
		'</soapenv:Body>'+
		'</soapenv:Envelope>';

	var requestObj = buildBody([ request.toString() ], true);

	var result = invokeWebServiceString(requestObj, servicePath, "");
	// Obtain signed Google URLs
	/*	try
	{
		var centersArray = result.Envelope.Body.GetCentersDataResponse.testCenters.testCenter;
		var origin=((currentLocation.latitude != undefined) ? (currentLocation.latitude+','+currentLocation.longitude) : (currentLocation.coords.latitude+','+currentLocation.coords.longitude));
		for(var i=0; i < centersArray.length; i++)
		{
			var center = centersArray[i];
			var destination = center.latitude +','+center.longitude  ;
			var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+origin+"&destinations="+destination+"&mode=driving&language="+language;
 			var invocationData = {
                    adapter : 'googleApiSigning',
                    procedure : 'signApi',
                    parameters : [url]
				};
			var signApiResult = MFP.Server.invokeProcedure(invocationData);
			center.signedGoogleURL = signApiResult.signedURL;
		}
	}
	catch(ex)
	{
	}*/

	if(isEncryptResponse != undefined && isEncryptResponse == true)
	{
		var responseString = JSON.stringify(result);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [responseString,encryptionPassword]
		};
		result = MFP.Server.invokeProcedure(invocationData);
	}	

	return result;
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

function invokeWebServiceString(request, servicePath, SOAPAction, isEncryptResponse, encryptionPassword) {

	Log(  servicePath   +"***"+   request  +"***"+    SOAPAction);
	var input = {

			method : 'post',
			headers : {
				"SOAPAction" : SOAPAction
			},
			returnedContentType : 'xml',
			path : servicePath,
			body : {
				content : request.toString(),
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
