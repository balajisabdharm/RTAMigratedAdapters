/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 25-July-2018
 */
var _userName = "%#credentials!#!username_tibco#%";
var _password = "%#credentials!#!password_tibco#%";
var IsDebugging;
var adapterName = "drivers_and_vehicles_SalikTokenAdapter";
var soapEnvStart = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">';
var soapEnvEnd = '</soapenv:Envelope>';
var soapHeader = '<soapenv:Header>' +
    '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<wsse:UsernameToken>' +
    '<wsse:Username>' + _userName + '</wsse:Username>' +
    '<wsse:Password>' + _password + '</wsse:Password>' +
    '</wsse:UsernameToken>' +
    '</wsse:Security>' +
    '</soapenv:Header>';
var validationError = {
    "errorCode": "-1",
    "errorMessage": "missing or invalid params! please check mandatory [Params]."
};

function notValid(string) {
    return (!string || string == undefined || string == "" || string.length == 0);
}

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
    return uniqueNumber() + '' + Math.floor(Math.random() * (999 - 100 + 1) + 100);
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
    try{
        _logRequestResponse(refNum, adapterName, SOAPAction, request, null, true);
    }catch(e){}
    
    //do request
    var input = {
        method: 'post',
        headers: {
            "SOAPAction": SOAPAction
        },
        returnedContentType: 'xml',
        path: servicePath,
        body: {
            content: request,
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
    try{
        _logRequestResponse(refNum, adapterName, SOAPAction, null, responseString, true);
    }catch(e){}

    return webServiceResult;
}

function buildBody(parameters, isStatic) {
    var request = "";
    if (isStatic == true) {
        request = MFP.Server.invokeProcedure({
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'buildBodyFromStaticRequest',
            parameters: parameters,

        });
    } else {
        request = MFP.Server.invokeProcedure({
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'buildBody',
            parameters: parameters
        });
    }
    return request.body;
}



var xsdStr_genToken = "http://www.rta.ae/ActiveMatrix/ESB/mPayService/XMLSchema/Schema.xsd";
function fixNameSpaceGenTok(response){
	MFP.Logger.info(" ================================================= REMOVING NAMESPACE 2 =================================================");
	var newResponse = JSON.stringify(response);
	var reg1 = new RegExp('{"":"'+xsdStr_genToken+'",', "g");
	
	
	newResponse = newResponse.replace(reg1,"");
	//MFP.Logger.info("refined Response -->" + newResponse);
	try{
		return JSON.parse(newResponse);
	}catch(e){
		return response;
	}
}


function generateSalikToken(requestParams, isEncryptResponse, encryptionPassword) {
    /*var requestParams = {
        "rta_id": "",
        "linking_attribute": ""
    };*/
    if (notValid(requestParams.rta_id) || notValid(requestParams.linking_attribute)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeader +
            '<soapenv:Body>' +
            '<sch:TokenRequest xmlns:sch="http://www.rta.ae/schemas/SalikTokenGenerationService/Schema.xsd">' +
            '<sch:grant_type>IamGrant</sch:grant_type>' +
            '<!--Optional:-->' +
            '<sch:rta_id>' + requestParams.rta_id + '</sch:rta_id>' +
            '<!--Optional:-->' +
            '<sch:linking_attribute>' + requestParams.linking_attribute + '</sch:linking_attribute>' +
            '<!--Optional:-->' +
            '<sch:scope>openid+api</sch:scope>' +
            '<sch:Authorization>ZHViYWlkcml2ZS5hbmRyb2lkOlNAbCFLZFViQCFEciFWZQ==</sch:Authorization>' +
            '</sch:TokenRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/generateSalikToken';
        var SOAPAction = 'TokenRequest';
        var requestObj = buildBody([request.toString()], true);
        var responseObj = invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        
        responseObj.Envelope.Body = fixNameSpaceGenTok(responseObj.Envelope.Body);
        
        
        return responseObj;
    }

}

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
