///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Generated code - Do not edit																					 //

//This is a SOAP adapter that was auto-generated by Worklight for invocation of specific SOAP-based services.   //
//The adapter may invoke more than one service as long as they are all from the same enpdpoint (server host).   //
//Each adapter procedure matches a single operation for the same endpoint server and accepts:                   //
//envHeader- Serialized JSON representation of the XML-based SOAP envelope to be sent to the service 
//params  - Serialized JSON representation of the XML-based SOAP body to be sent to the service               //
//headers - Custom HTTP headers to be specified when invoking the remote service. It is a JSON object with    //
//the headers names and values. E.g. { 'name1' : 'value1', 'name2' : 'value2' }                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';
var userName = "Mobstguser";
//var userName = "test";
var password = "m792!du)+1g";
//var password = "test"
var externalUsername = "%#credentials!#!externalUsername#%";
var externalPassword = "%#credentials!#!externalPassword#%";
var IsDebugging;

var xsdStr = "http://xml.apache.org/axis/";
function fixNameSpace(response){
//	MFP.Logger.info(" ================================================= REMOVING NAMESPACE =================================================");
//	response = JSON.stringify(response);
//	reg1 = new RegExp('{"":"'+xsdStr+'","CDATA":', "g");
//	reg2 = new RegExp('"":"'+xsdStr+'",',"g");
//	reg3 = new RegExp('{"":"'+xsdStr+'"}',"g");
//	response = response.replace(reg1,"").replace(reg2,"").replace(reg3,"\"\"").replace(/}]}/g,"]").replace(/}}]/g,"}]").replace(/},/g,",")+"}}";
//	MFP.Logger.info("refined Response -->" + response);
return response;	
//	return JSON.parse(response);
}


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


function returenVehicleFromTourService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"password":password,
			"username": userName
	};
	var servicePath='/ws/services/UsersTourVehiclesService';
	var _soapEnvNS = soapEnvNS+ 'xmlns:urn="urn:UsersTourVehiclesService"';
	var parameters = [envHeader.toString(), params.toString(),'' , _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("BookletLicenseInquiryService request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}
function getVehicleInformationAmendment(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"rta:password":password,
			"rta:username": userName,
			"rta:externalUsername": userName,
			"rta:externalUserPassword": password,
	};
	var servicePath='/ws/services/VehicleInformationAmendmentService';
	var _soapEnvNS =soapEnvNS +' xmlns:rta="rta:VehicleInformationAmendmentService"';
	var parameters = [envHeader.toString(), params.toString(),'' , _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("getVehicleInformationAmendment request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}


function bookletLicenseInquiryService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"password":password,
			"username": userName
	};
	var servicePath='/ws/services/BookletLicenseInquiryService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ws="http://ae.gov.trf.vhl.ws.BookletLicenseInquiryService"';
	
	var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("BookletLicenseInquiryService request >> " + request);
	var result = invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
		if(result.Envelope != undefined && result.Envelope != null)
		{
			if(result.Envelope.Body != undefined && result.Envelope.Body != null){
				if(result.Envelope.Body.getBookletDetailsReturn != undefined && result.Envelope.Body.getBookletDetailsReturn != null){
					if (result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult != undefined 
					&& result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult != null){
						
						result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.nameA = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.nameE = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.email = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.fax = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.mobile = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.phone = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.passportExpiryDate = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.passportNo = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.address = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.trafficFileNo = "";
						 result.Envelope.Body.getBookletDetailsReturn.getBookletDetailsResult.nationality ="";
					}
				}
			}
		}
	 return fixNameSpace(result) ;
}
function mCardService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:password":password,
			"ae:username": userName
	};
	var servicePath='/ws/services/MCardService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.vhl.ws.MCardService"';

	var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("MCardService request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}
function ownerVehicleInfoService(params, isEncryptResponse, encryptionPassword){
	var envHeader ={
			"etr:password" : password,
			"etr:username" : userName
	};
	var servicePath='/ws/services/OwnerVehicleInfoService';
	var _soapEnvNS = soapEnvNS+ 'xmlns:etr="http://eTraffic.ws"';

	var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("OwnerVehicleInfoService request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}
function trafficInquiryService(params, isEncryptResponse, encryptionPassword) {
	var envHeader={
			"ae:externalUserPassword": password,
			"ae:externalUsername": userName,
			"ae:password": password,
			"ae:username": userName
	};
	var servicePath='/ws/services/TrafficInquiryService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="drivers_and_vehicles_getGeneralData"';

	var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("TrafficInquiryService request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}
function userOwnedAndBookedPlatesService(params, isEncryptResponse, encryptionPassword){
	var envHeader={
			"ae:password":password,
			"ae:username":userName
	};
	var servicePath='/ws/services/UserOwnedAndBookedPlatesService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.vhl.ws.UserOwnedAndBookedPlatesService"';

	var parameters = [envHeader.toString(),params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("UserOwnedAndBookedPlatesService request >> " + request);
	return fixNameSpace(invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword));
}
function usersVehiclesService(params, isEncryptResponse, encryptionPassword){
	var envHeader={
			"urn:password":password.toString(),
			"urn:username":userName.toString()
	};
	
	var servicePath='/ws/services/UsersVehiclesService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:urn="urn:UsersVehiclesService"';
	MFP.Logger.info("UsersVehiclesService received params >>>>> " + params);
	//var params = {"urn:getUsersVehicles":{"urn:trafficFileNumber":"+params+"}};
	MFP.Logger.info("envHeader12:"+ JSON.stringify(envHeader)   );
	MFP.Logger.info("_soapEnvNS:"+ _soapEnvNS.toString());
	MFP.Logger.info("Formatted params:"+ params.toString());
	MFP.Logger.info("JSON.Stringify params:"+ JSON.stringify(params));
	
	var parameters = [envHeader.toString(),params.toString(), '', _soapEnvNS.toString()];
//	var parameters = [envHeader.toString(),envHeader.toString(), '',_soapEnvNS.toString()];
//	var parameters = ["","","", ""];
	var request = buildBody(parameters, false);

	MFP.Logger.info("UsersVehiclesService request >> " + request);
	var result = invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
	
	if(result.Envelope != undefined && result.Envelope != null)
		{
			if(result.Envelope.Body != undefined && result.Envelope.Body != null)
			{
				if (result.Envelope.Body.getUsersVehiclesReturn!= undefined && result.Envelope.Body.getUsersVehiclesReturn != null )
				{
					if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles != null)
					{
						if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle != null)
						{
							if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.length != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.length != null)
							{
								for(var i=0;i<result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.length;i++)
								{
									if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicle != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicle != null && 
											isVehicleDueForRenewal(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].expiryDate))
									{
										if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicle.dueForTest != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicle.dueForTest != null)
										{
											result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicle.dueForTest  = "1";
										}
									
										if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicleHasPassTest != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicleHasPassTest != null)
										{
											result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle[i].vehicleHasPassTest  = "2";
										}
									}
									
								}
							}else{
								if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicle != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicle != null && 
										isVehicleDueForRenewal(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.expiryDate))
									{
										if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicle.dueForTest != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicle.dueForTest != null)
										{
											result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicle.dueForTest  = "1";
										}
									
										if(result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicleHasPassTest != undefined && result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicleHasPassTest != null)
										{
											result.Envelope.Body.getUsersVehiclesReturn.usersVehicles.userVehicle.vehicleHasPassTest  = "2";
										}
									}
								
							}
						}
					}
				}	
			}
		}
		
	Log("UsersVehiclesService Response >> " + JSON.stringify(result));
	return fixNameSpace(result) ;
}
function reInsuranceCertificateService(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
			"urn:password": password,
			"urn:username": userName
	};
	var servicePath='/ws/services/ReInsuranceCertificateService';
	var _soapEnvNS =soapEnvNS+ ' xmlns:urn="urn:ReInsuranceCertificateService"';
	var parameters = [envHeader.toString(),params.toString(),'', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("ReInsuranceCertificateService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
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
	MFP.Logger.info("buildBody:"+ JSON.stringify(request));
	return request.body;
}
function invokeWebService(body,servicePath,headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
	MFP.Logger.info("invokeWebService:" + body.toString());
	if (!headers)
		headers = {
			"SOAPAction" : ""
	};
	else
		headers["SOAPAction"] = "";
	var input = {
			method : 'post',
			returnedContentType : 'xml',
			path : servicePath,
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

function isVehicleDueForRenewal(expiryDate) {

    if (expiryDate != undefined && expiryDate != null && expiryDate.length == 10 && expiryDate.indexOf("/") == 2) {
        var _current = new Date();
        var _temp = expiryDate.split("/");
        var _expiryDate = new Date(_temp[2], _temp[1], _temp[0], 23, 59, 59);

        _expiryDate.setMonth(_expiryDate.getMonth() + 5);

        if (_expiryDate.getTime() >= _current.getTime())
            return true;
        else
            return false;

    } else
        return false;
}
