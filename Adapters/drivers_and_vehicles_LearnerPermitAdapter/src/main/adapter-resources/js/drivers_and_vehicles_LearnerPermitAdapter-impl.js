/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 10-April-2019
 */
var _userName = "Mobstguser";
var _password = "m792!du)+1g";
var adapterName = "drivers_and_vehicles_LearnerPermitAdapter";
var IsDebugging;
var soapEnvStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/CTSLicenseInfoService_V2/Schema.xsd">';
var soapEnvEnd = '</soapenv:Envelope>';
var soapHeaderStart = '<soapenv:Header>';
var soapHeaderEnd = '</soapenv:Header>';
var tibcoHeader = '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<wsse:UsernameToken wsu:Id="UsernameToken-6">' +
    '<wsse:Username>' + _userName + '</wsse:Username>' +
    '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + _password + '</wsse:Password>' +
    '<wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">umYlRq3cLtHzSru78CrDFA==</wsse:Nonce>' +
    '<wsu:Created>' + new Date(Date.now()).toISOString() + '</wsu:Created>' +
    '</wsse:UsernameToken>' +
    '</wsse:Security>';
var validationError = {
    "errorCode": "-1",
    "errorMessage": "missing or invalid params! please check mandatory [Params]."
};

var xsdStr = "http://www.rta.ae/ActiveMatrix/ESB/CTSLicenseInfoService_V2/1_0";
function fixNameSpace(response){
	MFP.Logger.info(" ================================================= REMOVING NAMESPACE =================================================");
	response = JSON.stringify(response);
	reg1 = new RegExp('{"":"'+xsdStr+'","CDATA":', "g");
	reg2 = new RegExp('"":"'+xsdStr+'",',"g");
	reg3 = new RegExp('{"":"'+xsdStr+'"}',"g");
	response = response.replace(reg1,"").replace(reg2,"").replace(reg3,"\"\"").replace(/}]}/g,"]").replace(/}}]/g,"}]").replace(/},/g,",")+"}}";
	MFP.Logger.info("refined Response -->" + response);
	
	return JSON.parse(response);
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

function getStudentInfo(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"trafficFileNumber":""
     }*/

    if (notValid(requestParams.trafficFileNumber) || notValid(requestParams.trafficFileNumber)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:getStudentInfo>' +
            '<sch:arg0>' +
            '<sch:trafficFileNumber>' + requestParams.trafficFileNumber + '</sch:trafficFileNumber>' +
            '</sch:arg0>' +
            '</sch:getStudentInfo>' +
            '</soapenv:Body>' +
            soapEnvEnd;
        var servicePath = '/CTSLicenseInfoService_V2';
        var SOAPAction = 'getStudentInfo';
        var requestObj = buildBody([request.toString()], true);

        var response = invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        return fixNameSpace(response);
    }

}

function getAttendanceDetails(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"trafficFileNumber":""
     }*/

    if (notValid(requestParams.trafficFileNumber) || notValid(requestParams.trafficFileNumber)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:getAttendanceDetails>' +
            '<sch:arg0>' +
            '<sch:trafficFileNumber>' + requestParams.trafficFileNumber + '</sch:trafficFileNumber>' +
            '</sch:arg0>' +
            '</sch:getAttendanceDetails>' +
            '</soapenv:Body>' +
            soapEnvEnd;
        var servicePath = '/CTSLicenseInfoService_V2';
        var SOAPAction = 'getAttendanceDetails';
        var requestObj = buildBody([request.toString()], true);

        var response= invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        return fixNameSpace(response);
    }

}

function getAssessmentDetails(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"trafficFileNumber":""
     }*/

    if (notValid(requestParams.trafficFileNumber) || notValid(requestParams.trafficFileNumber)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:getAssessmentDetails>' +
            '<sch:arg0>' +
            '<sch:trafficFileNumber>' + requestParams.trafficFileNumber + '</sch:trafficFileNumber>' +
            '</sch:arg0>' +
            '</sch:getAssessmentDetails>' +
            '</soapenv:Body>' +
            soapEnvEnd;
        var servicePath = '/CTSLicenseInfoService_V2';
        var SOAPAction = 'getAssessmentDetails';
        var requestObj = buildBody([request.toString()], true);

        var response = invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        return fixNameSpace(response);
    }

}

function getHandbookURL(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"licenseClass":""
    }*/
    /*	
    LMVA:Light Motor Vehicle Automatic
    LMVM:Light Motor Vehicle Manual
    MC	:Motorcycle
    HMV :Heavy Motor Vehicle
    HB	:Heavy Bus
    LB	:Light Bus
    LME :Light Mechanical Equipment
    HME :Heavy Mechanical Equipment
    */
    if (notValid(requestParams.licenseClass)) {
        return validationError;
    } else {
        var _url = MFP.Server.getPropertyValue("publicWorkLightProtocol") + "://" + MFP.Server.getPropertyValue("publicWorkLightHostname") + ":" + MFP.Server.getPropertyValue("publicWorkLightPort") + "/index" + MFP.Server.getPropertyValue("publicWorkLightContext") + "/apps/dubai_drive/handbooks/";
        var _path = "";
        var _files = {};
        switch (requestParams.licenseClass) {
            case 'LMVA': {
                    _path = 'LightMotorVehicleAutomatic/'
                    _files = {
                        "EN": _url + _path + 'LMV_2019_En.pdf',
                        "AR": _url + _path + 'LMV_HB_2016_Arabic.pdf',
                        "UR": _url + _path + 'LMV_HB_2016_Urdu.pdf'
                    }
                    break;
                }

            case 'LMVM':
                {
                    _path = 'LightMotorVehicleManual/'
                    _files = {
                        "EN": _url + _path + 'LMV_2019_En.pdf',
                        "AR": _url + _path + 'LMV_2016_Arabic.pdf',
                        "UR": _url + _path + 'LMV_HB_2016_Urdu.pdf'
                    }
                    break;
                }
            case 'MC':
                {
                    _path = 'Motorcycle/'
                    _files = {
                        "EN": _url + _path + 'Motorcycle_HB_Englsih_2019.pdf',
                        "AR": _url + _path + 'Motorcycle_HB_Arabic_2016.pdf',
                        "UR": _url + _path + 'Motorcycle_HB_Urdu_2016.pdf'
                    }
                    break;
                }
            case 'HMV':
                {
                    _path = 'HeavyMotorVehicle/'
                    _files = {
                        "EN": _url + _path + 'HMV_Englsih_2019.pdf',
                        "AR": _url + _path + 'HMV_Arabic_2016.pdf',
                        "UR": _url + _path + 'HMV_Urdu_2016.pdf'
                    }
                    break;
                }
            case 'HB':
                {
                    _path = 'HeavyBus/'
                    _files = {
                        "EN": _url + _path + 'HB_Eng2019.pdf',
                        "AR": _url + _path + 'HB_Arabic_2016.pdf',
                        "UR": _url + _path + 'HB_Urdu_2016.pdf'
                    }
                    break;
                }
            case 'LB':
                {
                    _path = 'LightBus/'
                    _files = {
                        "EN": _url + _path + 'LB_2019_English.pdf',
                        "AR": _url + _path + 'LB_2016_Arabic.pdf',
                        "UR": _url + _path + 'LB_2016_Urdu.pdf'
                    }
                    break;
                }
            case 'LME':
                {
                    _path = 'LightMechanicalEquipment/'
                    _files = {
                        "EN": _url + _path + 'LME_Englsih_2019.pdf',
                        "AR": _url + _path + 'LME_Arabic_2016.pdf',
                        "UR": _url + _path + 'LME_Urdu_2016.pdf'
                    }
                    break;
                }
            case 'HME':
                {
                    _path = 'HeavyMechanicalEquipment/'
                    _files = {
                        "EN": _url + _path + 'Shovel_HB_English_2019.pdf',
                        "AR": _url + _path + 'Shovel_HB_Arabic_2016.pdf',
                        "UR": _url + _path + 'Shovel_HB_Urdu_2016.pdf'
                    }
                    break;
                }
            default:
                return validationError;
        }

        return {
            "Envelope": {
                "Body": {
                    "URLs": _files
                }
            }
        }
    }
}

function submitFeedback(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"diId":"",//optional
     	"feedbackComments":"",
     	"feedbackType":"",
     	"licenseApplicationFileId":"",
     	"permitNumber":"",//optional
     	"ratingStars":"",
     }*/

    if (notValid(requestParams.feedbackComments) || notValid(requestParams.feedbackType) || notValid(requestParams.licenseApplicationFileId) || notValid(requestParams.ratingStars)) {
        return validationError;
    } else {

        if (requestParams.feedbackType == 'INSTRUCTOR_FEEDBACK') {
            if (notValid(requestParams.permitNumber))
                return validationError;
            else
                var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
                    '<soapenv:Body>' +
                    '<sch:submitFeedback>' +
                    '<sch:arg0>' +
                    '<sch:feedbackComments>' + requestParams.feedbackComments + '</sch:feedbackComments>' +
                    '<sch:feedbackType>' + requestParams.feedbackType + '</sch:feedbackType>' +
                    '<sch:licenseApplicationFileId>' + requestParams.licenseApplicationFileId + '</sch:licenseApplicationFileId>' +
                    '<sch:permitNumber>' + requestParams.permitNumber + '</sch:permitNumber>' +
                    '<sch:ratingStars>' + requestParams.ratingStars + '</sch:ratingStars>' +
                    '</sch:arg0>' +
                    '</sch:submitFeedback>' +
                    '</soapenv:Body>' +
                    soapEnvEnd;

        } else if (requestParams.feedbackType == 'INSTITUTE_FEEDBACK') {
            if (notValid(requestParams.diId))
                return validationError;
            else
                var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
                    '<soapenv:Body>' +
                    '<sch:submitFeedback>' +
                    '<sch:arg0>' +
                    '<sch:diId>' + requestParams.diId + '</sch:diId>' +
                    '<sch:feedbackComments>' + requestParams.feedbackComments + '</sch:feedbackComments>' +
                    '<sch:feedbackType>' + requestParams.feedbackType + '</sch:feedbackType>' +
                    '<sch:licenseApplicationFileId>' + requestParams.licenseApplicationFileId + '</sch:licenseApplicationFileId>' +
                    '<sch:ratingStars>' + requestParams.ratingStars + '</sch:ratingStars>' +
                    '</sch:arg0>' +
                    '</sch:submitFeedback>' +
                    '</soapenv:Body>' +
                    soapEnvEnd;

        } else {
            return validationError;
        }

        var servicePath = '/CTSLicenseInfoService_V2';
        var SOAPAction = 'submitFeedback';
        var requestObj = buildBody([request.toString()], true);

        var response = invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        return fixNameSpace(response);
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
