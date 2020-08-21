/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 08-August-2018
 */
var _userName = "%#credentials!#!username_tibco#%";
var _password = "%#credentials!#!password_tibco#%";
var adapterName = "drivers_and_vehicles_SalikProfileAdapter";
var IsDebugging;
var soapEnvStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikProfileService/Schema.xsd">';
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

function getGrantHeader(RtaUserId, linking_attribute) {
    return '<sch:Header>' +
        '<sch:grant_type>IamGrant</sch:grant_type>' +
        '<sch:rta_id>' + RtaUserId + '</sch:rta_id>' +
        '<sch:linking_attribute>' + linking_attribute + '</sch:linking_attribute>' +
        '<sch:scope>openid+api</sch:scope>' +
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
    return uniqueNumber() + '' + Math.floor(Math.random()*(999-100+1)+100);
}

function formateDate(timestamp) {

    var date = (notValid(timestamp)) ? new Date() : new Date(timestamp);
    return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
}

function Log(text) {

   // MFP.Logger.warn(text);

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

	Log("............................... we are here ");
    //log request 
    _logRequestResponse(refNum, adapterName, SOAPAction, request.toString(), null, true);

    //do request
    var input = {
        method: 'post',
        headers: {
            "SOAPAction": SOAPAction
        },
        returnedContentType: 'xml',
        path: servicePath,
        body: {
            content: request.toString(),
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
            parameters: [webServiceResult, encryptionPassword]
        };
        webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }
Log("we are here ...............................");
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

function getProfileService(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:GetProfileServiceRequest>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:GetProfileServiceRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;
        var servicePath = '/salikProfileService';
        var SOAPAction = 'GetProfileServiceRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }

}

function addContactNumber(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":"",
     	"ContactNumberTypeId":"",
     	"CountryCode":"",
     	"ContactNumber":"",
     	"Extension":""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.ContactNumberTypeId) || notValid(requestParams.CountryCode) || notValid(requestParams.ContactNumber)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:AddContactNumberRequest>' +
            '<sch:ContactNumberTypeId>' + requestParams.ContactNumberTypeId + '</sch:ContactNumberTypeId>' +
            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
            '<!--Optional:-->' +
            '<sch:Extension>' + requestParams.Extension + '</sch:Extension>' +
            '<sch:IsDefault>false</sch:IsDefault>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:AddContactNumberRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'AddContactNumberRequest';
        var requestObj = buildBody([request.toString()], true);
	    
	    

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }

}

function addContactNumberDefault(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
 	"RtaUserId":"",
 	"linking_attribute":"",
 	"ContactNumberTypeId":"",
 	"CountryCode":"",
 	"ContactNumber":"",
 	"Extension":"",
 	"OTPGuid":"",
 	"OTPCode":""
 }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.ContactNumberTypeId) || notValid(requestParams.CountryCode) || notValid(requestParams.ContactNumber) || notValid(requestParams.OTPGuid) || notValid(requestParams.OTPCode)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:AddContactNumberRequest>' +
            '<sch:ContactNumberTypeId>' + requestParams.ContactNumberTypeId + '</sch:ContactNumberTypeId>' +
            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
            '<!--Optional:-->' +
            '<sch:Extension>' + requestParams.Extension + '</sch:Extension>' +
            '<sch:IsDefault>true</sch:IsDefault>' +
            '<sch:OTPGuid>' + requestParams.OTPGuid + '</sch:OTPGuid>' +
            '<sch:OTPCode>' + requestParams.OTPCode + '</sch:OTPCode>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:AddContactNumberRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'AddContactNumberRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }

}

function updateContactNumber(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":"",
     	"CustPhoneId":"",
     	"CustPhoneUpdTime":"",
     	"ContactNumberTypeId":"",
     	"CountryCode":"",
     	"ContactNumber":"",
     	"Extension":""
     }*/


    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.CustPhoneId) || notValid(requestParams.CustPhoneUpdTime) || notValid(requestParams.ContactNumberTypeId) || notValid(requestParams.CountryCode) || notValid(requestParams.ContactNumber)) {
        return validationError;
    } else {
        /*@TODO
         * Fix + sign issue 
         */
        var dateTime = requestParams.CustPhoneUpdTime.indexOf(' ') ? requestParams.CustPhoneUpdTime.replace(' ', '+') : requestParams.CustPhoneUpdTime;

        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ChangeContactNumberRequest>' +
            '<sch:CustPhoneId>' + requestParams.CustPhoneId + '</sch:CustPhoneId>' +
            '<sch:CustPhoneUpdTime>' + dateTime + '</sch:CustPhoneUpdTime>' +
            '<sch:ContactNumberTypeId>' + requestParams.ContactNumberTypeId + '</sch:ContactNumberTypeId>' +
            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
            '<!--Optional:-->' +
            '<sch:Extension>' + requestParams.Extension + '</sch:Extension>' +
            '<sch:IsDefault>false</sch:IsDefault>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:ChangeContactNumberRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'ChangeContactNumberRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }

}

function updateContactNumberDefault(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
 	"RtaUserId":"",
 	"linking_attribute":"",
 	"CustPhoneId":"",
 	"CustPhoneUpdTime":"",
 	"ContactNumberTypeId":"",
 	"CountryCode":"",
 	"ContactNumber":"",
 	"Extension":"",
 	"OTPGuid":"",
 	"OTPCode":""
 }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.CustPhoneId) || notValid(requestParams.CustPhoneUpdTime) || notValid(requestParams.ContactNumberTypeId) || notValid(requestParams.CountryCode) || notValid(requestParams.ContactNumber) || notValid(requestParams.OTPGuid) || notValid(requestParams.OTPCode)) {
        return validationError;
    } else {
        /*@TODO
         * Fix + sign issue 
         */
        var dateTime = requestParams.CustPhoneUpdTime.indexOf(' ') ? requestParams.CustPhoneUpdTime.replace(' ', '+') : requestParams.CustPhoneUpdTime;

        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ChangeContactNumberRequest>' +
            '<sch:CustPhoneId>' + requestParams.CustPhoneId + '</sch:CustPhoneId>' +
            '<sch:CustPhoneUpdTime>' + dateTime + '</sch:CustPhoneUpdTime>' +
            '<sch:ContactNumberTypeId>' + requestParams.ContactNumberTypeId + '</sch:ContactNumberTypeId>' +
            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
            '<!--Optional:-->' +
            '<sch:Extension>' + requestParams.Extension + '</sch:Extension>' +
            '<sch:IsDefault>true</sch:IsDefault>' +
            '<sch:OTPGuid>' + requestParams.OTPGuid + '</sch:OTPGuid>' +
            '<sch:OTPCode>' + requestParams.OTPCode + '</sch:OTPCode>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:ChangeContactNumberRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'ChangeContactNumberRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function deleteContactNumber(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":"",
     	"CustPhoneId";""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.CustPhoneId)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:DeleteContactNumberRequest>' +
            '<sch:CustPhoneId>' + requestParams.CustPhoneId + '</sch:CustPhoneId>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:DeleteContactNumberRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'DeleteContactNumberRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }

}


function getFinancialSummary(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:FinancialSummaryRequest>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:FinancialSummaryRequest>' +
            '</soapenv:Body>' +

            soapEnvEnd;
	    
        var servicePath = '/salikProfileService';
        var SOAPAction = 'FinancialSummaryRequest';
	    
        var requestObj = buildBody([request.toString()], true);
        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}


function syncWithRTAProfile(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":"",
     	"Operation":"",
     	"SyncConsent",""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.Operation) || notValid(requestParams.SyncConsent)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:SyncWithRTAProfileRequest>' +
            '<sch:Operation>' + requestParams.Operation + '</sch:Operation>' +
            '<sch:SyncConsent>' + requestParams.SyncConsent + '</sch:SyncConsent>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:SyncWithRTAProfileRequest>' +
            '</soapenv:Body>' +

            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'FinancialSummaryRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}


function importRechargeProfiles(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
    "RtaUserId": "",
    "linking_attribute": "",
    "RechargeProfileList": [{
        "ProfileName": "",
        "ProfileAccountID": "",
        "AccountPIN": ""
    }, {
        "ProfileName": "",
        "MobileCountryCode": "",
        "MobileNumber": "",
        "PlateDetails": {
            "PlateCountryCode": "",
            "PlateSourceId": "",
            "PlateCategoryId": "",
            "PlateNumber": "",
            "PlateColorId": ""
        }
    }]
}
     */
    var list = requestParams.RechargeProfileList;
    var composeMsg = '';
    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || list.length <= 0)
        return validationError;
    else {
        for (var i = 0; i < list.length; i++) {

            if (!list[i].PlateDetails || list[i].PlateDetails.length <= 0) {
                //1\\check account object
                if (notValid(list[i].ProfileName) || notValid(list[i].ProfileAccountID) || notValid(list[i].AccountPIN))
                    return validationError;
                else
                    //2\\add account object
                    composeMsg += '<sch:RechargeProfileList><sch:ProfileName>' + list[i].ProfileName +
                    '</sch:ProfileName><sch:ProfileAccountID>' + list[i].ProfileAccountID +
                    '</sch:ProfileAccountID><sch:AccountPIN>' + list[i].AccountPIN +
                    '</sch:AccountPIN></sch:RechargeProfileList>';
            } else {
                //1\\check plate object 
                if (notValid(list[i].ProfileName) || notValid(list[i].PlateDetails.PlateCountryCode) || notValid(list[i].PlateDetails.PlateSourceId) || notValid(list[i].PlateDetails.PlateCategoryId) || notValid(list[i].PlateDetails.PlateNumber) || notValid(list[i].MobileCountryCode) || notValid(list[i].MobileNumber))
                    return validationError;
                else
                    //2\\add plate object
                    composeMsg += '<sch:RechargeProfileList>' +
                    '<sch:ProfileName>' + list[i].ProfileName + '</sch:ProfileName>' +
                    '<sch:PlateDetails>' +
                    '<sch:PlateCountryCode>' + list[i].PlateDetails.PlateCountryCode + '</sch:PlateCountryCode>' +
                    '<sch:PlateSourceId>' + list[i].PlateDetails.PlateSourceId + '</sch:PlateSourceId>' +
                    '<sch:PlateCategoryId>' + list[i].PlateDetails.PlateCategoryId + '</sch:PlateCategoryId>' +
                    '<sch:PlateNumber>' + list[i].PlateDetails.PlateNumber + '</sch:PlateNumber>' +
                    '<sch:PlateColorId>' + list[i].PlateDetails.PlateColorId + '</sch:PlateColorId>' +
                    '</sch:PlateDetails>' +
                    '<sch:MobileCountryCode>' + list[i].MobileCountryCode + '</sch:MobileCountryCode>' +
                    '<sch:MobileNumber>' + list[i].MobileNumber + '</sch:MobileNumber>' +
                    '</sch:RechargeProfileList>';

            }
        }

        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:InsertCustomerProfileRequest>' + composeMsg +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:InsertCustomerProfileRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'InsertCustomerProfileRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    }
}

function getImportedRechargeProfiles(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
    "RtaUserId": "",
    "linking_attribute": "",
    "RechargeProfileList": [{
        "profileId": ""
    }, {
        "profileId": ""
    }]
}*/
    var list = requestParams.RechargeProfileList;
    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || list.length <= 0)
        return validationError;
    else {
        var composeMsg = '';
        for (var i = 0; i < list.length; i++) {
            //1\\check profile id
            if (notValid(list[i].profileId))
                return validationError;
            else
                //2\\add profile id
                composeMsg += '<sch:profileIds>' + list[i].profileId + '</sch:profileIds>';
        }

        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:GetCustomerProfileByProfileIDListRequest>' + composeMsg +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:GetCustomerProfileByProfileIDListRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'GetCustomerProfileByProfileIDListRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function updateRechargeProfiles(requestParams, isEncryptResponse, encryptionPassword) {
    /*var requestParams = 
	  {
    "RtaUserId": "",
    "linking_attribute": "",
    "RechargeProfileList": [
        {
            "CustomerProfileID": "",
            "ProfileAccountID": "",
            "AccountPIN": "",
            "ProfileName": ""
        },
        {
            "CustomerProfileID": "",
            "ProfileName":"",
            "MobileCountryCode": "",
            "MobileNumber": "",
            "PlateDetails": {
                "PlateCountryCode": "",
                "PlateSourceId": "",
                "PlateCategoryId": "",
                "PlateNumber": "",
                "PlateColorId": ""
            }
        }
    ]
}
     */

    var list = requestParams.RechargeProfileList;
    var composeMsg = '';
    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || list.length <= 0)
        return validationError;
    else {
        for (var i = 0; i < list.length; i++) {

            if (!list[i].PlateDetails || list[i].PlateDetails.length <= 0) {
                //1\\check account object
                if (notValid(list[i].CustomerProfileID) || notValid(list[i].ProfileAccountID) || notValid(list[i].AccountPIN) || notValid(list[i].ProfileName))
                    return validationError;
                else
                    //2\\add account object
                    composeMsg += '<sch:RechargeProfileList><sch:CustomerProfileID>' + list[i].CustomerProfileID +
                    '</sch:CustomerProfileID><sch:ProfileAccountID>' + list[i].ProfileAccountID +
                    '</sch:ProfileAccountID><sch:AccountPIN>' + list[i].AccountPIN +
                    '</sch:AccountPIN><sch:ProfileName>' + list[i].ProfileName +
                    '</sch:ProfileName></sch:RechargeProfileList>';
            } else {
                //1\\check plate object 
                if (notValid(list[i].CustomerProfileID) || notValid(list[i].ProfileName) || notValid(list[i].PlateDetails.PlateCountryCode) || notValid(list[i].PlateDetails.PlateSourceId) || notValid(list[i].PlateDetails.PlateCategoryId) || notValid(list[i].PlateDetails.PlateNumber) || notValid(list[i].MobileCountryCode) || notValid(list[i].MobileNumber))
                    return validationError;
                else
                    //2\\add plate object
                    composeMsg += '<sch:RechargeProfileList>' +
                    '<sch:CustomerProfileID>' + list[i].CustomerProfileID + '</sch:CustomerProfileID>' +
                    '<sch:ProfileName>' + list[i].ProfileName + '</sch:ProfileName>' +
                    '<sch:PlateDetails>' +
                    '<sch:PlateCountryCode>' + list[i].PlateDetails.PlateCountryCode + '</sch:PlateCountryCode>' +
                    '<sch:PlateSourceId>' + list[i].PlateDetails.PlateSourceId + '</sch:PlateSourceId>' +
                    '<sch:PlateCategoryId>' + list[i].PlateDetails.PlateCategoryId + '</sch:PlateCategoryId>' +
                    '<sch:PlateNumber>' + list[i].PlateDetails.PlateNumber + '</sch:PlateNumber>' +
                    '<sch:PlateColorId>' + list[i].PlateDetails.PlateColorId + '</sch:PlateColorId>' +
                    '</sch:PlateDetails>' +
                    '<sch:MobileCountryCode>' + list[i].MobileCountryCode + '</sch:MobileCountryCode>' +
                    '<sch:MobileNumber>' + list[i].MobileNumber + '</sch:MobileNumber>' +
                    '</sch:RechargeProfileList>';

            }
        }

        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:UpdateCustomerProfileRequest>' + composeMsg +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:UpdateCustomerProfileRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'UpdateCustomerProfileRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    }
}

function getAllRechargeProfiles(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"RtaUserId":"",
     	"linking_attribute":""
     }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute)) {
        return validationError;
    } else {
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:GetCustomerProfileRequest>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:GetCustomerProfileRequest>' +
            '</soapenv:Body>' +

            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'GetCustomerProfileRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function getBalanceEnquirybyAccountAndPin(requestParams, isEncryptResponse, encryptionPassword) {
    /* var requestParams = {
     	"lang":"",//optional
     	"AccountID":"",
     	"AccountPin":""
     }*/

    if (notValid(requestParams.AccountID) || notValid(requestParams.AccountPin)) {
        return validationError;
    } else {
        var lang = (notValid(requestParams.lang)) ? 'en' : requestParams.lang;
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:BalanceEnquirybyAccountAndPinRequest>' +
            '<!--Optional:-->' +
            '<sch:Language>' +
            '<sch:Lang>' + requestParams.lang + '</sch:Lang>' +
            '</sch:Language>' +
            '<sch:AccountID>' + requestParams.AccountID + '</sch:AccountID>' +
            '<sch:AccountPin>' + requestParams.AccountPin + '</sch:AccountPin>' +
            '<sch:AppId>DNVAPP</sch:AppId>' +
            '</sch:BalanceEnquirybyAccountAndPinRequest>' +
            '</soapenv:Body>' +
            soapEnvEnd;

        var servicePath = '/salikProfileService';
        var SOAPAction = 'BalanceEnquirybyAccountAndPinRequest';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function _logRequestResponse(refNum, adapter, SOAPAction, request, response, isDBLog) {

    var invocationLog = {};

    if (request != null && response == null) {
        /*MFP.Logger.warn('\r\n\r\n' +
            '|--------START----------------|\r\n' +
            '|--------REQUEST--------------|\r\n' +
            '|--------START----------------|\r\n' +
            '|--------REF: ' + refNum + '--------|\r\n' +
            '|--------TIME: ' + formateDate(refNum) + '-------|\r\n' +
            '|--------Adapter: ' + adapter + '|\r\n' +
            '|--------Action: ' + SOAPAction + '---|\r\n' +
            '|--------Request: ' + request.toString() + '---|\r\n' +
            '|--------END------------------|\r\n' +
            '|--------REQUEST--------------|\r\n' +
            '|--------END------------------|\r\n');*/
        invocationLog = {
            adapter: 'drivers_and_vehciles_CustomDB',
            procedure: 'dbLogReq',
            parameters: [refNum, adapter, SOAPAction, request]
        };
    } else if (request == null && response != null) {

      /*  MFP.Logger.warn('\r\n\r\n' +
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
            '|--------END------------------|\r\n');*/
        invocationLog = {
            adapter: 'drivers_and_vehciles_CustomDB',
            procedure: 'dbLogRes',
            parameters: [refNum, response]
        };
    }

    if (isDBLog)
        MFP.Server.invokeProcedure(invocationLog);

}
