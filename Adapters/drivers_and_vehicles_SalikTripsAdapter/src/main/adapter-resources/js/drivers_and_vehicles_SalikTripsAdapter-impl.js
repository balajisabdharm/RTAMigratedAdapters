/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 06-Jan-2020
 */
var _userName = "%#credentials!#!username_tibco#%";
var _password = "%#credentials!#!password_tibco#%";
var adapterName = "drivers_and_vehicles_SalikTripsAdapter";
var IsDebugging;
var soapEnvStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikTripService/Schema.xsd">';
var soapEnvEnd = '</soapenv:Envelope>';
var soapHeaderStart = '<soapenv:Header>';
var soapHeaderEnd = '</soapenv:Header>';
var tibcoHeader = '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">' +
    '<wsse:UsernameToken>' +
    '<wsse:Username>' + _userName + '</wsse:Username>' +
    '<wsse:Password>' + _password + '</wsse:Password>' +
    '</wsse:UsernameToken>' +
    '</wsse:Security>';
var validationError = {
    "errorCode": "-1",
    "errorMessage": "missing or invalid params! please check mandatory [Params]."
};

function getGrantHeader(_token) {
    return '<sch:Header>' +
        '<!--<sch:client_ID>dubaidrive.android</sch:client_ID>-->' +
        '<sch:client_ID>dubaidrive.hybrid</sch:client_ID>' +
        '<sch:SecureToken>' +
        '<sch:token_type>Bearer</sch:token_type>' +
        '<sch:access_token>' + _token + '</sch:access_token>' +
        '</sch:SecureToken>' +
        '</sch:Header>';
}

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
        IsDebugging = MFP.Server.configuration["drivers_and_vehicles_is_debugging"];
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

function ViewOrSearchTrips(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"token":"",
     	"lang":"",//optional
     	"PageId":"",
     	"PageSize":"",
     	"TimePeriod":"",
     	"TripType":"",
     	"TagPlateDetails":"",
     	"StartDate":"",//optional
     	"EndDate":"",//optional
     	"TagNumber":"",//optional
     	"PlateNumber":""//optional
     	"PlateCountryCode":""//optional
     	"PlateSourceId":""//optional
     	"PlateCategoryId":""//optional
     	"PlateCodeId":""//optional
     }*/ //

    if (notValid(requestParams.token) || notValid(requestParams.PageId) || notValid(requestParams.PageSize) || notValid(requestParams.TimePeriod) ||
        notValid(requestParams.TripType) || notValid(requestParams.TagPlateDetails) ||
        (requestParams.TimePeriod == "4" && (notValid(requestParams.StartDate) || notValid(requestParams.EndDate)))) {
        return validationError;
    } else {
        var lang = (notValid(requestParams.lang)) ? 'en' : requestParams.lang;
        var StartDate = (notValid(requestParams.StartDate)) ? '' : '<sch:StartDate>' + requestParams.StartDate + '</sch:StartDate>';
        var EndDate = (notValid(requestParams.EndDate)) ? '' : '<sch:EndDate>' + requestParams.EndDate + '</sch:EndDate>';
        var TagNumber = (notValid(requestParams.TagNumber)) ? '' : '<sch:TagNumber>' + requestParams.TagNumber + '</sch:TagNumber>';
        var PlateNumber = (notValid(requestParams.PlateNumber)) ? '' : '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>';
        var PlateCountryCode = (notValid(requestParams.PlateCountryCode)) ? '' : '<sch:PlateCountryCode>' + requestParams.PlateCountryCode + '</sch:PlateCountryCode>';
        var PlateSourceId = (notValid(requestParams.PlateSourceId)) ? '' : '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>';
        var PlateCategoryId = (notValid(requestParams.PlateCategoryId)) ? '' : '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>';
        var PlateCodeId = (notValid(requestParams.PlateCodeId)) ? '' : '<sch:PlateCodeId>' + requestParams.PlateCodeId + '</sch:PlateCodeId>';

        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ViewOrSearchTrips>' +
            '<sch:Language>' +
            '<sch:Lang>' + lang + '</sch:Lang>' +
            '</sch:Language>' +
            '<sch:PageId>' + requestParams.PageId + '</sch:PageId>' +
            '<sch:PageSize>' + requestParams.PageSize + '</sch:PageSize>' +
            '<sch:TimePeriod>' + requestParams.TimePeriod + '</sch:TimePeriod>' +
            '<sch:TripType>' + requestParams.TripType + '</sch:TripType>' +
            '<sch:TagPlateDetails>' + requestParams.TagPlateDetails + '</sch:TagPlateDetails>' +
            '<!--Optional:-->' +
            StartDate +
            '<!--Optional:-->' +
            EndDate +
            '<!--Optional:-->' +
            TagNumber +
            '<!--Optional:-->' +
            PlateNumber +
            '<!--Optional:-->' +
            PlateCountryCode +
            '<!--Optional:-->' +
            PlateSourceId +
            '<!--Optional:-->' +
            PlateCategoryId +
            '<!--Optional:-->' +
            PlateCodeId +
            '<sch:AppId>DNVAPP</sch:AppId>' +
            '</sch:ViewOrSearchTrips>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikTripService';
        var SOAPAction = 'ViewOrSearchTrips';
        var requestObj = buildBody([request], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function ViewStatementPresentation(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"token":"",
     	"lang":"",//optional
     	"YYYYMM":""
     }*/

    if (notValid(requestParams.YYYYMM) || notValid(requestParams.token)) {
        return validationError;
    } else {
        var lang = (notValid(requestParams.lang)) ? 'en' : requestParams.lang;
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ViewStatementPresentation>' +
            '<sch:Language> ' +
            '<sch:Lang>' + lang + '</sch:Lang>' +
            '</sch:Language>' +
            '<sch:YYYYMM>' + requestParams.YYYYMM + '</sch:YYYYMM>' +
            '<sch:FileType>1</sch:FileType>' +
            '<sch:AppId>DNVAPP</sch:AppId>' +
            '</sch:ViewStatementPresentation>' +
            '</soapenv:Body>' +

            soapEnvEnd;

        var servicePath = '/salikTripService';
        var SOAPAction = 'ViewStatementPresentation';
        var requestObj = buildBody([request], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
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

function ViewPendingTrips(requestParams, isEncryptResponse, encryptionPassword) {
    var userName = MFP.Server.configuration["wsse.tibco.username"];
    var password = MFP.Server.configuration["wsse.tibco.password"];
    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString();// Returns 2011-10-05T14:48:00.000Z



    var request = "<soapenv:Envelope xmlns:sch=\"http://www.rta.ae/schemas/SalikNotifcationAndFeedbackService/Schema.xsd\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "   <soapenv:Header>" +
        "      <wsse:Security soapenv:mustUnderstand=\"1\" xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" +
        "         <wsse:UsernameToken wsu:Id=\"UsernameToken-4\">" +
        "            <wsse:Username>"+userName.toString()+"</wsse:Username>" +
        "            <wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">"+password+"</wsse:Password>" +
        "            <wsse:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">m5stBr6aggbcqD7KwnbO3w==</wsse:Nonce>" +
        "            <wsu:Created>"+requestDateFormated.toString()+"</wsu:Created>" +
        "         </wsse:UsernameToken>" +
        "      </wsse:Security>" +
        "      <sch:Header>" +
        "         <!--Optional:-->" +
        "         <!--<sch:client_ID>dubaidrive.android</sch:client_ID>-->" +
        "         <sch:client_ID>dubaidrive.hybrid</sch:client_ID>" +
        "         <!--Optional:-->" +
        "         <sch:SecureToken>" +
        "            <sch:token_type>Bearer</sch:token_type>" +
        "            <sch:access_token>"+requestParams.token.toString()+"</sch:access_token>" +
        "         </sch:SecureToken>" +
        "      </sch:Header>" +
        "   </soapenv:Header>" +
        "   <soapenv:Body>" +
        "      <sch:getISFTripsRequest>" +
        "         <!--Optional:-->" +
        "         <sch:Language>" +
        "            <sch:Lang>en</sch:Lang>" +
        "         </sch:Language>" +
        "         <sch:PageId>"+requestParams.PageId.toString()+"</sch:PageId>" +
        "         <sch:PageSize>"+requestParams.PageSize.toString()+"</sch:PageSize>" +
        "         <sch:AppId>SALIK</sch:AppId>" +
        "      </sch:getISFTripsRequest>" +
        "   </soapenv:Body>" +
        "</soapenv:Envelope>"


    var servicePath = '/salikNotifcationAndFeedbackService';
    var SOAPAction = 'getISFTripsRequest';
    var requestObj = buildBody([request], true);

    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);


}
