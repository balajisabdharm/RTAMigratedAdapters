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
var IsDebugging;
var adapterName = "drivers_and_vehicles_SalikRechargeAdapter";

function uniqueNumber() {
    var date = Date.now();

    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }

    return date;
}

uniqueNumber.previous = 0;

function referenceNumber() {
    return uniqueNumber() + '' + Math.floor(Math.random()*(999-100+1)+100);
}

function formateDate(timestamp) {

    var date = (notValid(timestamp)) ? new Date() : new Date(timestamp);
    return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
}
function Log(text) {
	
	MFP.Logger.warn(text);

	
	try {
		IsDebugging = MFP.Server.getPropertyValue("drivers_and_vehicles_is_debugging");
	} catch (e) {
		IsDebugging = "false";
	}
	if (IsDebugging == "true")
		MFP.Logger.warn(text);
	else
		MFP.Logger.debug(text);
}

function invokeWebServiceString(request, servicePath, SOAPAction, isEncryptResponse, encryptionPassword) {

    var refNum = referenceNumber();
    var _webServiceResult;
    var webServiceResult;
    var responseString;

    //log request 
    _logRequestResponse(refNum, adapterName, SOAPAction, request, null, true);

    //do request
    var input = {
        method: 'post',
        headers: {
            "SOAPAction": SOAPAction
        },
        returnedContentType: 'xml',
        path: servicePath,
        body: {
            content: JSON.parse(request),
            contentType: 'text/xml; charset=utf-8'
        }
    };

    _webServiceResult = MFP.Server.invokeHttp(input);

    //delete credientails
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [_webServiceResult]
    };

    webServiceResult = MFP.Server.invokeProcedure(invocationData);
    responseString = JSON.stringify(webServiceResult);

    //encrypt response
    if (isEncryptResponse != undefined && isEncryptResponse == true) {

        var invocationData = {
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }

    //log response
    _logRequestResponse(refNum, adapterName, SOAPAction, null, responseString, true);

    //check fault response
    /*if(!webServiceResult["isSuccessful"] && webServiceResult["errors"]){
    	return _fault(webServiceResult)
    }*/

    return webServiceResult;
}

function verifyAndValidateSalikCustomerAccount(accountID, accountPIN, isEncryptResponse, encryptionPassword) {
	
	//verifySalikCustomerAccount(accountID, accountPIN, isEncryptResponse, encryptionPassword);
	//validateSalikCustomerAccount(accountID, accountPIN, isEncryptResponse, encryptionPassword);
}


function getSalikCustomerBalance(accountID, accountPIN, isEncryptResponse, encryptionPassword) {
	var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
	var password = MFP.Server.getPropertyValue("wsse.tibco.password");
	var authorizationCode = "951AAD67-3D2E-4149-9ECE-BCE7DEE95ED7";
	var request = 
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikOnlineRechargeService/Schema.xsd">'+
				   '<soapenv:Header>'+
				      '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'+
				         '<wsse:UsernameToken>'+
				            '<wsse:Username>'+ userName +'</wsse:Username>'+
				            '<wsse:Password>'+ password +'</wsse:Password>'+
				         '</wsse:UsernameToken>'+
				      '</wsse:Security>'+
				      '</soapenv:Header>'+
				   '<soapenv:Body>'+
				      '<sch:EnquireCustomerBalance>'+
				         '<sch:accountID>'+ accountID +'</sch:accountID>'+
				         '<sch:accountPIN>'+ accountPIN +'</sch:accountPIN>'+
				         '<sch:merchantCode>RTA-DNV</sch:merchantCode>'+
				         '<sch:channelLocationCode>BankHQ</sch:channelLocationCode>'+
				         '<sch:channelCode>AutoRecharge</sch:channelCode>'+
				         '<sch:authorizationCode>'+ authorizationCode +'</sch:authorizationCode>'+
				      '</sch:EnquireCustomerBalance>'+
				   '</soapenv:Body>'+
				'</soapenv:Envelope>';
 
	var SOAPAction = "EnquireCustomerBalance";
	var servicePath = '/SalikOnlineRechargeService';
	var requestObj = buildBody([request], true);

	//return{
	//	message:request
	//}

	
	return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
}


function verifySalikCustomerAccount(accountID, accountPIN, isEncryptResponse, encryptionPassword) {
	var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
	var password = MFP.Server.getPropertyValue("wsse.tibco.password");
	var authorizationCode = "951AAD67-3D2E-4149-9ECE-BCE7DEE95ED7";
	var request = 
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikOnlineRechargeService/Schema.xsd">'+
				   '<soapenv:Header>'+
				      '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'+
				         '<wsse:UsernameToken>'+
				            '<wsse:Username>'+ userName +'</wsse:Username>'+
				            '<wsse:Password>'+ password +'</wsse:Password>'+
				         '</wsse:UsernameToken>'+
				      '</wsse:Security>'+
				      '</soapenv:Header>'+
				   '<soapenv:Body>'+
				      '<sch:VerifyCustomerAccount>'+
				         '<sch:accountID>'+ accountID +'</sch:accountID>'+
				         '<sch:accountPIN>'+ accountPIN +'</sch:accountPIN>'+
				         '<sch:merchantCode>RTA-DNV</sch:merchantCode>'+
				         '<sch:channelLocationCode>INTERNET</sch:channelLocationCode>'+
				         '<sch:channelCode>ONLINE</sch:channelCode>'+
				       '</sch:VerifyCustomerAccount>'+
				   '</soapenv:Body>'+
				'</soapenv:Envelope>';

	/*return{
		message:request
	}*/
	
	var SOAPAction = "VerifyCustomerAccount";
	var servicePath = '/SalikOnlineRechargeService';
	var requestObj = buildBody([request], true);

	return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
}


function validateSalikCustomerAccount(accountID, accountPIN, isEncryptResponse, encryptionPassword) {
	var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
	var password = MFP.Server.getPropertyValue("wsse.tibco.password");
	var authorizationCode = "951AAD67-3D2E-4149-9ECE-BCE7DEE95ED7";
	var request = 
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikOnlineRechargeService/Schema.xsd">'+
				   '<soapenv:Header>'+
				      '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'+
				         '<wsse:UsernameToken>'+
				            '<wsse:Username>'+ userName +'</wsse:Username>'+
				            '<wsse:Password>'+ password +'</wsse:Password>'+
				         '</wsse:UsernameToken>'+
				      '</wsse:Security>'+
				      '</soapenv:Header>'+
				   '<soapenv:Body>'+
				      '<sch:ValidateCustomerAccount>'+
				         '<sch:accountID>'+ accountID +'</sch:accountID>'+
				         '<sch:accountPIN>'+ accountPIN +'</sch:accountPIN>'+
				         '<sch:merchantCode>RTA-DNV</sch:merchantCode>'+
				         '<sch:channelLocationCode>INTERNET</sch:channelLocationCode>'+
				         '<sch:channelCode>ONLINE</sch:channelCode>'+
				       '</sch:ValidateCustomerAccount>'+
				   '</soapenv:Body>'+
				'</soapenv:Envelope>';

	/*return{
		message:request
	}*/
	
 	var SOAPAction = "ValidateCustomerAccount";
	var servicePath = '/SalikOnlineRechargeService';
	var requestObj = buildBody([request], true);

	return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
}

function recordSalikPaymentTransaction(accountID, accountPIN, chargeAmount, transactionID, bankRefID, isEncryptResponse, encryptionPassword) {
	var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
	var password = MFP.Server.getPropertyValue("wsse.tibco.password");
	var authorizationCode = "951AAD67-3D2E-4149-9ECE-BCE7DEE95ED7";
	var dateTime = new Date().getTime();
	
	//DateTime Format
	//YYYYMMDD	HH:MM:SS
	dateTime = "20170410 10:20:11" 
	var request = 
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikOnlineRechargeService/Schema.xsd">'+
				   '<soapenv:Header>'+
				      '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'+
				         '<wsse:UsernameToken>'+
				            '<wsse:Username>'+ userName +'</wsse:Username>'+
				            '<wsse:Password>'+ password +'</wsse:Password>'+
				         '</wsse:UsernameToken>'+
				      '</wsse:Security>'+
				      '</soapenv:Header>'+
				   '<soapenv:Body>'+
				      '<sch:RecordPaymentTransaction>'+
				         '<sch:accountID>'+ accountID +'</sch:accountID>'+
				         '<sch:accountPIN>'+ accountPIN +'</sch:accountPIN>'+
				         '<sch:chargeAmount>'+ chargeAmount +'</sch:chargeAmount>'+
				         '<sch:merchantCode>RTA-DNV</sch:merchantCode>'+
				         '<sch:channelLocationCode>INTERNET</sch:channelLocationCode>'+
				         '<sch:channelCode>ONLINE</sch:channelCode>'+
				         '<sch:transactionID>'+ transactionID +'</sch:transactionID>'+
				         '<sch:bankRefID>'+ bankRefID +'</sch:bankRefID>'+
				         '<sch:dateTime>'+ dateTime +'</sch:dateTime>'+     
				      '</sch:RecordPaymentTransaction>'+
				   '</soapenv:Body>'+
				'</soapenv:Envelope>';

	
	
	var SOAPAction = "RecordPaymentTransaction";
	var servicePath = '/SalikOnlineRechargeService';
	var requestObj = buildBody([request], true);

	//return{
	//message:request
	//}
	
	return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
}

function getSalikTransactionStatus(accountID, accountPIN, transactionID, isEncryptResponse, encryptionPassword) {
	var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
	var password = MFP.Server.getPropertyValue("wsse.tibco.password");
	var authorizationCode = "951AAD67-3D2E-4149-9ECE-BCE7DEE95ED7";
	var request = 
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikOnlineRechargeService/Schema.xsd">'+
				   '<soapenv:Header>'+
				      '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'+
				         '<wsse:UsernameToken>'+
				            '<wsse:Username>'+ userName +'</wsse:Username>'+
				            '<wsse:Password>'+ password +'</wsse:Password>'+
				         '</wsse:UsernameToken>'+
				      '</wsse:Security>'+
				      '</soapenv:Header>'+
				   '<soapenv:Body>'+
				      '<sch:GetTransactionStatus>'+
				         '<sch:accountID>'+ accountID +'</sch:accountID>'+
				         '<sch:accountPIN>'+ accountPIN +'</sch:accountPIN>'+
				         '<sch:merchantCode>RTA-DNV</sch:merchantCode>'+
				         '<sch:channelLocationCode>INTERNET</sch:channelLocationCode>'+
				         '<sch:channelCode>ONLINE</sch:channelCode>'+
				         '<sch:transactionID>'+ transactionID +'</sch:transactionID>'+
				      '</sch:GetTransactionStatus>'+
				   '</soapenv:Body>'+
				'</soapenv:Envelope>';

	/*return{
		message:request
	}*/
	
	var SOAPAction = "GetTransactionStatus";
	var servicePath = '/SalikOnlineRechargeService';
	var requestObj = buildBody([request], true);

	return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
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
	return MFP.Server.invokeProcedure(invocationData);}


function _logRequestResponse(refNum, adapter, SOAPAction, request, response, isDBLog) {

    var invocationLog = {};

    if (request != null && response == null) {
        MFP.Logger.warn('\r\n\r\n' +
            '|--------START----------------|\r\n' +
            '|--------REQUEST--------------|\r\n' +
            '|--------START----------------|\r\n' +
            '|--------REF: ' + refNum + '--------|\r\n' +
            '|--------TIME: ' + formateDate(refNum) + '-------|\r\n' +
            '|--------Adapter: ' + adapter + '|\r\n' +
            '|--------Action: ' + SOAPAction + '---|\r\n' +
            '|--------Request: ' + JSON.stringify(request) + '---|\r\n' +
            '|--------END------------------|\r\n' +
            '|--------REQUEST--------------|\r\n' +
            '|--------END------------------|\r\n');
        invocationLog = {
            adapter: 'drivers_and_vehciles_CustomDB',
            procedure: 'dbLogReq',
            parameters: [refNum.toString(), adapter, SOAPAction, request]
        };
    } else if (request == null && response != null) {

        MFP.Logger.warn('\r\n\r\n' +
            '|--------START----------------|\r\n' +
            '|--------RESPONSE-------------|\r\n' +
            '|--------START----------------|\r\n' +
            '|--------REF: ' + refNum + '--------|\r\n' +
            '|--------TIME: ' + formateDate(refNum) + '-------|\r\n' +
            '|--------Adapter: ' + adapter + '-----------|\r\n' +
            '|--------Action: ' + SOAPAction + '---|\r\n' +
            '|--------Response: ' + JSON.stringify(response) + '---|\r\n' +
            '|--------END------------------|\r\n' +
            '|--------RESPONSE-------------|\r\n' +
            '|--------END------------------|\r\n');
        invocationLog = {
            adapter: 'drivers_and_vehciles_CustomDB',
            procedure: 'dbLogRes',
            parameters: [refNum.toString(), response]
        };
    }

    if (isDBLog)
        MFP.Server.invokeProcedure(invocationLog);

}
