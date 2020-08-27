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
var userName = "%#credentials!#!username#%";
var password = "%#credentials!#!password#%";
var externalUsername = "%#credentials!#!externalUsername#%";
var externalPassword = "%#credentials!#!externalPassword#%";
var username_traffic = "%#credentials!#!username_traffic#%";
var password_traffic = "%#credentials!#!password_traffic#%";
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
function FFULookupInfoService(params, isEncryptResponse, encryptionPassword){
	/*var invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'FFULookupInfoService',
			parameters : [params, isEncryptResponse, encryptionPassword]
	};
	var response =  MFP.Server.invokeProcedure(invocationData);
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [response.toString()]
	};
	return MFP.Server.invokeProcedure(invocationData); */
	
	
	var envHeader = { 
			"ae:authenticationHeader" :{
				"ae:externalUsername" : externalUsername,
				"ae:externalUserPassword" :externalPassword,
				"ae:username" : username_traffic,
				"ae:password" : password_traffic
			}
	};
	var servicePath= '/wstraffic/services/FFULookupInfoService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae:client.ws.ffu.traffic.services.internet.ae"';
	//var parameters = [envHeader, params, '', _soapEnvNS];
	var parameters = [JSON.stringify(envHeader),JSON.stringify(params), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("FFULookupInfoService request >> " + request);
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
	
}

function getKioskTestCentersService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	var servicePath = "/ws/services/GetKioskTestCentersService";
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.stp.ws.GetKioskTestCentersService"';
	//var parameters = [envHeader.toString(), params.toString(), 'xmlns:ae="http://ws.trs.rta.ae"', _soapEnvNS.toString()];
	var parameters = [JSON.stringify(envHeader),JSON.stringify(params), 'xmlns:ae="http://ws.trs.rta.ae"', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("getKioskTestCentersService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}	
function newMaintenanceService(params, isEncryptResponse, encryptionPassword) {
   // MFP.Logger.info("newMaintenanceService params "+params );
	var _soapEnvNS=soapEnvNS+ 'xmlns:new="http://dubaipolice/ebsrv/services/NewMaintenance" xmlns:main="http://dubaipolice/ebsrv/services/NewMaintenance"';
	var envHeader = {
			"new:externalPassword": externalPassword,
			"new:externalUsername": externalUsername,
			"new:password": password,
			"new:username": userName
	};
   /* var envHeader = {
            "new:externalPassword": "Test@1234",
            "new:externalUsername": "mobile_user",
            "new:password": "m792!du)+1g",
            "new:username": "Mobstguser"
    };*/
    var servicePath = "/ws/services/NewMaintenanceService";
	//var paramsStr ="[{\"new:getTableData\":{\"RequestName\":\""+params+"\"}}]";
   // MFP.Logger.info("NewMaintenanceService String params >>>>>>>>>>>> " + paramsStr);
	//params = JSON.stringify(paramsStr);
	//Log("NewMaintenanceService JSONStringify params >>>>>>>>>>>> " + params);
	//var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
    //var parameters = [JSON.stringify(envHeader), params, '', _soapEnvNS];
    var parameters =[JSON.stringify(envHeader),JSON.stringify(params),'',_soapEnvNS.toString()];
     //MFP.Logger.info("NewMaintenanceService String parameters >>>>>>>>>>>> " + parameters);
	var request = buildBody(parameters, false);
	//var request = buildBody(JSON.stringify(envHeader), params, '', _soapEnvNS, false);
	Log("NewMaintenanceService request >>>>>>>>>>>> " + request);
    var response = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
	Log("NewMaintenanceService RESPONSE >>>>>>>>>>>>>>>> " + JSON.stringify(response));
	return response;
	
}

function exportCertificateService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
//			"ae:externalUserPassword":externalPassword,
//			"ae:externalUsername": externalUsername,
			"ae:password":password,
			"ae:username": userName
	};
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.vhl.ws.ExportCertificateService"';

	var servicePath = "/ws/services/ExportCertificateService";
	//var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var parameters = [JSON.stringify(envHeader),JSON.stringify(params), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("exportCertificateService request >> " + request);
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function vehiclePossessionCertificateService(params, isEncryptResponse, encryptionPassword){
	var envHeader = {
//			"urn:externalUserPassword": externalPassword,
//			"urn:externalUsername": externalUsername,
			"urn:password": password,
			"urn:username": userName
	};
	var _soapEnvNS=soapEnvNS+ 'xmlns:urn="urn:VehiclePossessionCertificateService"';
	var servicePath='/ws/services/VehiclePossessionCertificateService';
	//var parameters = [envHeader.toString(),params.toString(),'', _soapEnvNS.toString()];
	var parameters = [JSON.stringify(envHeader),JSON.stringify(params), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);

	//Log("VehiclePossessionCertificateService request >> " + request);
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}
function getServiceTermsAndConditionsService(request, isEncryptResponse, encryptionPassword) {
	var servicePath = '/ws/services/GetServiceTermsAndConditionsService';
	var parameters = [request.toString()];
	var request = buildBody(parameters, true);
	return invokeWebServiceStatic(request, servicePath, isEncryptResponse, encryptionPassword);
}
//function getServiceTermsAndConditionsService(params) {
//var envHeader = {
//"ae:username" : userName,
//"ae:password" : password
//};
//var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae.gov.trf.stp.ws.GetServiceTermsAndConditionsService"';
//var servicePath='/ws/services/GetServiceTermsAndConditionsService';
//var parameters = [envHeader,params,'', _soapEnvNS];
//var request = buildBody(parameters, false);

//Log("GetServiceTermsAndConditionsService request >> " + request);
//return invokeWebService(request,servicePath);
//}

function buildBody(parameters, isStatic) {
	var request = "";
   // MFP.Logger.info("drivers_and_vehicles_lookupAdapter buildBody parameters "+parameters );
	if (isStatic == true) {
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBodyFromStaticRequest',
			parameters : parameters

		});
	} else {
     //   MFP.Logger.info("drivers_and_vehicles_lookupAdapter going in false ");
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBody',
			parameters :parameters
            //parameters : [envHeader,params,'',_soapEnvNS]
		});
	}

	return request.body;
	
	//return request;
}

function invokeWebService(body, servicePath, headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
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
	
//	Log("Got back WebService Result >>>>>>>>>>>> ====================== " + webServiceResult);
	
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
    //Log("time for " + servicePath + " is " + (endTime - startTime) + " ms");
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
			returnedContentType : 'xml',
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

function getParkingZoneFile(requestParams) {
	 /* var requestParams = {
 		"Env":"",
 		"Type":"",
	 }*/
	 
	 MFP.Logger.info("Env" +JSON.stringify(requestParams));
	 MFP.Logger.info("Type" + requestParams.Type.toString());
    var invocationData = {
        adapter: 'drivers_and_vehciles_CustomDB',
        procedure: 'getParkingZoneFile',
        parameters: [requestParams.Env.toString(), requestParams.Type.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);
        
}
