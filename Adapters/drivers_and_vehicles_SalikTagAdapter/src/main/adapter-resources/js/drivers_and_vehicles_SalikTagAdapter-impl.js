/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 01-September-2018
 */
var IsDebugging;
var _userName = "%#credentials!#!username_tibco#%";
var _password = "%#credentials!#!password_tibco#%";
var adapterName = "drivers_and_vehicles_SalikTagAdapter";
var soapEnvStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikTagService/Schema.xsd">';
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
        '<sch:client_ID>dubaidrive.hybrid</sch:client_ID>' +
        '<!--<sch:client_ID>dubaidrive.android</sch:client_ID>-->' +
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


function Log(text) {

    //MFP.Logger.warn(text);


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


function ValidateTag(requestParams, isEncryptResponse, encryptionPassword) {

    /* var requestParams = {
 	"token":"",
 	"TagNumber":"",
 	"TagActivationKeyCode":"",//optional
 	
 }*/

    if ( notValid(requestParams.TagNumber)) {
        return validationError;
    } else {
        var tagActivationKeyCode = (notValid(requestParams.TagActivationKeyCode)) ? '' : '<sch:TagActivationKeyCode>' + requestParams.TagActivationKeyCode + '</sch:TagActivationKeyCode>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +

            '<soapenv:Body>' +
            '<sch:ValidateTagRequest>' +
            '<sch:TagNumber>' + requestParams.TagNumber + '</sch:TagNumber>' +
            '<!--Optional:-->' + tagActivationKeyCode +
            '</sch:ValidateTagRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'ValidateTagRequest';
        var requestObj = buildBody([request], true);
        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}
//
//
//function CreatePurchaseOrder(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.TrafficFileNo) ||
//        notValid(requestParams.PlateCountryCode) ||
//        notValid(requestParams.PlateSourceId) ||
//        notValid(requestParams.PlateCategoryId) ||
//        notValid(requestParams.PlateNumber) ||
//        notValid(requestParams.VehicleYear) ||
//        notValid(requestParams.VehicleModelId) ||
//        notValid(requestParams.VehicleMakeId) ||
//        notValid(requestParams.VehicleCategoryId) ||
//        notValid(requestParams.VehicleColorId) ||
//        notValid(requestParams.ChassisNo) ||
//        notValid(requestParams.AlternatePhoneNumber) ||
//        notValid(requestParams.AddressLine1) ||
//        notValid(requestParams.AddressLine2) ||
//        notValid(requestParams.AddressLine3) ||
//        notValid(requestParams.AddressSourceId) ||
//        notValid(requestParams.CountryCode) ||
//        notValid(requestParams.Email) ||
//        notValid(requestParams.isReplaceTagChecked)) {
//        return validationError;
//    } else {
//        var plateColorId = (requestParams.plateColorId !== 1) ? '' : '<sch:plateColorId>' + requestParams.plateColorId + '</sch:plateColorId>';
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//                '<sch:CreatePurchaseOrderRequest>' +
//                    '<sch:TrafficFileDetails>' +
//                        '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
//                    '</sch:TrafficFileDetails>' +
//                    '<sch:PlateDetails>' +
//                        '<sch:PlateCountryCode>' + requestParams.PlateCountryCode +'</sch:PlateCountryCode>' +
//                        '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>' +
//                        '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>' +
//                        '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>' +
//                        '<!--Optional:-->' +
//                         plateColorId +
//                    '</sch:PlateDetails>' +
//                    '<sch:VehicleDetails>' +
//                        '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
//                        '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
//                        '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
//                        '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
//                        '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
//                        '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
//                        '<!--Optional:-->' +
//                        '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>' +
//                    '</sch:VehicleDetails>' +
//                    '<sch:CustomerShipmentInfo>' +
//                        '<!--Optional:-->' +
//                        '<sch:ShortName>' + requestParams.ShortName + '</sch:ShortName>' +
//                        '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
//                        '<sch:AlternatePhoneNumber>' + requestParams.AlternatePhoneNumber + '</sch:AlternatePhoneNumber>' +
//                        '<sch:AddressLine1>' + requestParams.AddressLine1 + '</sch:AddressLine1>' +
//                        '<sch:AddressLine2>' + requestParams.AddressLine2 + '</sch:AddressLine2>' +
//                        '<sch:AddressLine3>' + requestParams.AddressLine3 + '</sch:AddressLine3>' +
//                        '<sch:AddressSourceId>' + requestParams.AddressSourceId + '</sch:AddressSourceId>' +
//                        '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
//                        '<!--Optional:-->' +
//                        '<sch:ShippingAddressID>' + requestParams.ShippingAddressID + '</sch:ShippingAddressID>' +
//                        '<sch:Email>' + requestParams.Email + '</sch:Email>' +
//                    '</sch:CustomerShipmentInfo>' +
//                    '<sch:isReplaceTagChecked>' + requestParams.isReplaceTagChecked + '</sch:isReplaceTagChecked>' +
//                    '<sch:AppId>SALIK</sch:AppId>' +
//                '</sch:CreatePurchaseOrderRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'CreatePurchaseOrderRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//
//
//function ValidateShippingAddress(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.ShortName) ||
//        notValid(requestParams.ContactNumber) ||
//        notValid(requestParams.AlternatePhoneNumber) ||
//        notValid(requestParams.AddressLine1) ||
//        notValid(requestParams.AddressSourceId) ||
//        notValid(requestParams.CountryCode) ||
//        notValid(requestParams.AppId)) {
//        return validationError;
//    } else {
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//                '<sch:ValidateShippingAddressRequest>' +
//                    '<sch:ShortName>' + requestParams.ShortName + '</sch:ShortName>' +
//                       ' <sch:ContactNumber >+ '+ requestParams.ContactNumber + '</sch:ContactNumber>' +
//                        '<sch:AlternatePhoneNumber>' + requestParams.AlternatePhoneNumber + '</sch:AlternatePhoneNumber>' +
//                        '<sch:Email>' + requestParams.Email + '</sch:Email>' +
//                        '<sch:AddressLine1>' + requestParams.AddressLine1 + '</sch:AddressLine1>' +
//                        '<!--Optional:-->' +
//                        '<sch:AddressLine2>' + requestParams.AddressLine2 + '</sch:AddressLine2>' +
//                        '<!--Optional:-->' +
//                        '<sch:AddressLine3>' + requestParams.AddressLine3 + '</sch:AddressLine3>' +
//                        '<sch:AddressSourceId>' + requestParams.AddressSourceId + '</sch:AddressSourceId>' +
//                        '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
//                        '<sch:AppId>' + requestParams.AppId + '</sch:AppId>' +
//                '</sch:ValidateShippingAddressRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'ValidateShippingAddressRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//
//
//
//function ValidatePhoneNumberAndTag(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.PhoneCountryCode) ||
//        notValid(requestParams.PhoneNumber) ||
//        notValid(requestParams.TagNumber) ||
//        notValid(requestParams.TagPurchasedDate) ||
//        notValid(requestParams.AppId)) {
//        return validationError;
//    } else {
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//            '<sch:ValidatePhoneNumberAndTagRequest>' +
//            '<sch:PhoneDetails>' +
//            '<sch:PhoneCountryCode>' + requestParams.PhoneCountryCode + '</sch:PhoneCountryCode>' +
//            '<sch:PhoneNumber>' + requestParams.PhoneNumber + '</sch:PhoneNumber>' +
//            '</sch:PhoneDetails>' +
//            '<sch:TagNumber>' + requestParams.TagNumber + '</sch:TagNumber>' +
//            '<sch:TagPurchasedDate>' + requestParams.TagPurchasedDate + '</sch:TagPurchasedDate>' +
//            '<sch:AppId>' + requestParams.AppId + '</sch:AppId>' +
//            '</sch:ValidatePhoneNumberAndTagRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'ValidatePhoneNumberAndTagRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//
//
//function CreateOrderWithAccountInfo(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.TrafficFileNo) ||
//        notValid(requestParams.PlateCountryCode) ||
//        notValid(requestParams.PlateSourceId) ||
//        notValid(requestParams.PlateCategoryId) ||
//        notValid(requestParams.PlateNumber) ||
//        notValid(requestParams.VehicleMakeId) ||
//        notValid(requestParams.VehicleModelId) ||
//        notValid(requestParams.VehicleCategoryId) ||
//        notValid(requestParams.VehicleColorId) ||
//        notValid(requestParams.VehicleYear) ||
//        notValid(requestParams.ChassisNo) ||
//        notValid(requestParams.ShortName) ||
//        notValid(requestParams.ContactNumber) ||
//        notValid(requestParams.AlternatePhoneNumber) ||
//        notValid(requestParams.AddressLine1) ||
//        notValid(requestParams.AddressLine2) ||
//        notValid(requestParams.AddressLine3) ||
//        notValid(requestParams.AddressSourceId) ||
//        notValid(requestParams.CountryCode) ||
//        notValid(requestParams.Email) ||
//        notValid(requestParams.OTPGuid) ||
//        notValid(requestParams.OTPCode) ||
//        notValid(requestParams.CustomerName) ||
//        notValid(requestParams.ContactNumber) ||
//        notValid(requestParams.CustomerNationalityCode) ||
//        notValid(requestParams.POBox) ||
//        notValid(requestParams.EmirateID) ||
//        notValid(requestParams.CountryCode) ||
//        notValid(requestParams.AppId)) {
//        return validationError;
//    } else {
//        var plateColorId = (requestParams.plateCategoryId !== 1) ? '' : '<sch:plateColorId>' + requestParams.plateColorId + '</sch:plateColorId>';
//        var ExpiryDate = (notValid(requestParams.ExpiryDate)) ? '' : '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>';
//        var ShortName = (notValid(requestParams.ShortName)) ? '' : '<sch:ShortName>' + requestParams.ShortName + '</sch:ShortName>';
//        var ShippingAddressID = (notValid(requestParams.ShippingAddressID)) ? '' : '<sch:ShippingAddressID>' + requestParams.ShippingAddressID + '</sch:ShippingAddressID>';
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//            '<sch:CreateOrderWithAccountInfoRequest>' +
//            '<sch:TrafficFileDetails>' +
//            '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
//            '</sch:TrafficFileDetails>' +
//            '<sch:PlateDetails>' +
//            '<sch:PlateCountryCode>' + requestParams.PlateCountryCode + '</sch:PlateCountryCode>' +
//            '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>' +
//            '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>' +
//            '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>' +
//            '<!-- Optional: -->' +
//            plateColorId +
//            '</sch:PlateDetails>' +
//            '<sch:VehicleDetails>' +
//            '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
//            '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
//            '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
//            '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId +'</sch:VehicleCategoryId>' +
//            '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
//            '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
//            '<!-- Optional: -->' +
//            ExpiryDate +
//            '</sch:VehicleDetails>' +
//            '<sch:ShipmentDetails>' +
//            '<!-- Optional: -->' +
//            ShortName +
//            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
//            '<sch:AlternatePhoneNumber>' + requestParams.AlternatePhoneNumber + '</sch:AlternatePhoneNumber>' +
//            '<sch:AddressLine1>' + requestParams.AddressLine1 + '</sch:AddressLine1>' +
//            '<sch:AddressLine2>' + requestParams.AddressLine2 + '</sch:AddressLine2>' +
//            '<sch:AddressLine3>' + requestParams.AddressLine3 + '</sch:AddressLine3>' +
//            '<sch:AddressSourceId>' + requestParams.AddressSourceId + '</sch:AddressSourceId>' +
//            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
//            '<!-- Optional: -->' +
//            ShippingAddressID +
//            '<sch:Email>' + requestParams.Email + '</sch:Email>' +
//            '</sch:ShipmentDetails>' +
//            '<sch:OTPGuid>' + requestParams.OTPGuid + '</sch:OTPGuid>' +
//            '<sch:OTPCode>' + requestParams.OTPCode + '</sch:OTPCode>' +
//            '<sch:ContactDetails>' +
//            '<sch:CustomerName>' + requestParams.CustomerName + '</sch:CustomerName>' +
//            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
//            '<sch:Email>' + requestParams.Email + '</sch:Email>' +
//            '<sch:CustomerNationalityCode>' + requestParams.CustomerNationalityCode + '</sch:CustomerNationalityCode>' +
//            '<sch:POBox>' + requestParams.POBox + '</sch:POBox>' +
//            '<sch:EmirateID>' + requestParams.EmirateID + '</sch:EmirateID>' +
//            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
//            '</sch:ContactDetails>' +
//            '<sch:AppId>' + requestParams.AppId + '</sch:AppId>' +
//            '</sch:CreateOrderWithAccountInfoRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'CreateOrderWithAccountInfoRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//
//
//function VehicleInformationValidation(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.VehicleMakeId) ||
//        notValid(requestParams.VehicleModelId) ||
//        notValid(requestParams.VehicleCategoryId) ||
//        notValid(requestParams.VehicleColorId) ||
//        notValid(requestParams.VehicleYear) ||
//        notValid(requestParams.ChassisNo) ||
//        notValid(requestParams.AppId)) {
//        return validationError;
//    } else {
//        var ExpiryDate = (notValid(requestParams.ExpiryDate)) ? '' : '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>';
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//            '<sch:VehicleInformationValidationRequest>' +
//            '<sch:VehicleDetails>' +
//            '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
//            '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
//            '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
//            '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
//            '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
//            '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
//            '<!-- Optional: -->' +
//            ExpiryDate +
//            '</sch:VehicleDetails>' +
//            '<sch:AppId>' + requestParams.AppId + '</sch:AppId>' +
//            '</sch:VehicleInformationValidationRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'VehicleInformationValidationRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//


//function ContactInformationValidation(requestParams, isEncryptResponse, encryptionPassword) {
//    if (notValid(requestParams.token) ||
//        notValid(requestParams.CustomerName) ||
//        notValid(requestParams.ContactNumber) ||
//        notValid(requestParams.Email) ||
//        notValid(requestParams.CustomerNationalityCode) ||
//        notValid(requestParams.POBox) ||
//        notValid(requestParams.EmirateID) ||
//        notValid(requestParams.CountryCode) ||
//        notValid(requestParams.AppId)) {
//        return validationError;
//    } else {
//        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
//            '<soapenv:Body>' +
//            '<sch:ContactInformationValidationRequest>' +
//            '<sch:ContactDetails>' +
//            '<sch:CustomerName>' + requestParams.CustomerName + '</sch:CustomerName>' +
//            '<sch:ContactNumber>' + requestParams.ContactNumber + '</sch:ContactNumber>' +
//            '<sch:Email>' + requestParams.Email + '</sch:Email>' +
//            '<sch:CustomerNationalityCode>' + requestParams.CustomerNationalityCode + '</sch:CustomerNationalityCode>' +
//            '<sch:POBox>' + requestParams.POBox + '</sch:POBox>' +
//            '<sch:EmirateID>' + requestParams.EmirateID + '</sch:EmirateID>' +
//            '<sch:CountryCode>' + requestParams.CountryCode + '</sch:CountryCode>' +
//            '</sch:ContactDetails>' +
//            '<sch:AppId>' + requestParams.AppId + '</sch:AppId>' +
//            '</sch:ContactInformationValidationRequest>' +
//            '</soapenv:Body>' + soapEnvEnd;
//
//        var servicePath = '/salikTagService';
//        var SOAPAction = 'ContactInformationValidationRequest';
//        var requestObj = buildBody([request], true);
//
//        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
//    }
//}
//
////Waiting for Salik Tag Service Specification Get Done.





function TagRegistration(requestParams, isEncryptResponse, encryptionPassword) {
   /* if (notValid(requestParams.token) ||
        notValid(requestParams.TagNumber) ||
        notValid(requestParams.TagPurchasedDate) ||
        notValid(requestParams.PhoneCountryCode) ||
        notValid(requestParams.PhoneAreaCode) ||
        notValid(requestParams.PhoneNumber) ||
        notValid(requestParams.PlateCountryCode) ||
        notValid(requestParams.PlateSourceId) ||
        notValid(requestParams.PlateCategoryId) ||
        notValid(requestParams.PlateNumber) ||
        notValid(requestParams.OwnerName) ||
        notValid(requestParams.VehicleYear) ||
        notValid(requestParams.VehicleModelId) ||
        notValid(requestParams.VehicleMakeId) ||
        notValid(requestParams.VehicleCategoryId) ||
        notValid(requestParams.VehicleColorId) ||
        notValid(requestParams.ChassisNo) ||
        notValid(requestParams.TrafficFileNo) ||
        notValid(requestParams.OTPGuid) ||
        notValid(requestParams.OTPCode) ) {
        return validationError;
    } else {*/
        var plateColorId = (requestParams.plateCategoryId !== 1) ? '' : '<sch:plateColorId>' + requestParams.plateColorId + '</sch:plateColorId>';
        var ExpiryDate = (notValid(requestParams.ExpiryDate)) ? '' : '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:TagRegistrationRequest>' +
            '<sch:PhoneAndTagInformation>' +
            '<sch:TagNumber>' + requestParams.TagNumber + '</sch:TagNumber>' +
            '<sch:TagPurchasedDate>' + requestParams.TagPurchasedDate + '</sch:TagPurchasedDate>' +
            '<sch:PhoneDetails>' +
            '<sch:PhoneCountryCode>' + requestParams.PhoneCountryCode + '</sch:PhoneCountryCode>' +
            '<sch:PhoneAreaCode>' + requestParams.PhoneAreaCode + '</sch:PhoneAreaCode>' +
            '<sch:PhoneNumber>' + requestParams.PhoneNumber + '</sch:PhoneNumber>' +
            '</sch:PhoneDetails>' +
            '</sch:PhoneAndTagInformation>' +
            '<sch:PlateInfo>' +
            '<sch:PlateCountryCode>' + requestParams.PlateCountryCode + '</sch:PlateCountryCode>' +
            '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>' +
            '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>' +
            '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>' +
            '<!-- Optional: -->' +
            plateColorId +
            '</sch:PlateInfo>' +
            '<sch:VehicleInfo>' +
            '<sch:CustomerDetails>' +
            '<sch:OwnerName>' + requestParams.OwnerName + '</sch:OwnerName>' +
            '</sch:CustomerDetails>' +
            '<sch:VehicleDetails>' +
            '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
            '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
            '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
            '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
            '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
            '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
            '<!-- Optional: -->' +
            ExpiryDate +
            '</sch:VehicleDetails>' +
            '<sch:TrafficFileDetails>' +
            '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
            '</sch:TrafficFileDetails>' +
            '</sch:VehicleInfo>' +
            '<sch:OTPGuid>' + requestParams.OTPGuid + '</sch:OTPGuid>' +
            '<sch:OTPCode>' + requestParams.OTPCode + '</sch:OTPCode>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:TagRegistrationRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'TagRegistrationRequest';
        var requestObj = buildBody([request], true);

    var response=invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
  return result= {
         requestObj:requestObj,
         response :response
     }
  /*  }*/
}


function ValidateProfile(requestParams, isEncryptResponse, encryptionPassword) {
    if ( notValid(requestParams.AccountType) ||
        notValid(requestParams.Name) ||
        notValid(requestParams.PhoneCountryCode)  ||
        notValid(requestParams.PhoneNumber) ) {
        return validationError;
        
    } else {
        var EmailAddress = (notValid(requestParams.EmailAddress)) ? '' : '<sch:EmailAddress>' + requestParams.EmailAddress + '</sch:EmailAddress>';
        var PhoneCountryCode = (notValid(requestParams.PhoneWorkCountryCode)) ? '' : '<sch:PhoneCountryCode>' + requestParams.PhoneWorkCountryCode + '</sch:PhoneCountryCode>';
        var PhoneNumber = (notValid(requestParams.PhoneWorkNumber)) ? '' : '<sch:PhoneNumber>' + requestParams.PhoneWorkNumber + '</sch:PhoneNumber>';
        var OfficePhone = (notValid(requestParams.PhoneWorkCountryCode) &&
            notValid(requestParams.PhoneWorkNumber)) ? ''
            : '<sch:OfficePhone>' +
            PhoneCountryCode +
            PhoneNumber +
            '</sch:OfficePhone>';
        var IsContactMethodEnglish  = (notValid(requestParams.IsContactMethodEnglish )) ? '' : '<sch:IsContactMethodEnglish >' + requestParams.IsContactMethodEnglish  + '</sch:IsContactMethodEnglish>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ValidateProfileRequest>' +
            '<sch:ProfileDetails>' +
            '<sch:AccountType>' + requestParams.AccountType + '</sch:AccountType>' +
            '<sch:Name>' + requestParams.Name + '</sch:Name>' +
            '<!-- Optional: -->' +
            EmailAddress +
            '<sch:CompanyName>' + requestParams.CompanyName + '</sch:CompanyName>' +
            '<sch:MobilePhone>' +
                '<sch:PhoneCountryCode>' + requestParams.PhoneCountryCode + '</sch:PhoneCountryCode>' +

                '<sch:PhoneNumber>' + requestParams.PhoneNumber + '</sch:PhoneNumber>' +
            '</sch:MobilePhone>' +
            '<!-- Optional: -->' +
            OfficePhone +
            '<!-- Optional: -->' +
            IsContactMethodEnglish +
            '</sch:ProfileDetails>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:ValidateProfileRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'ValidateProfileRequest';
        var requestObj = buildBody([request], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}





function ValidateTFNAndPlate(requestParams, isEncryptResponse, encryptionPassword) {
    if (
        notValid(requestParams.TrafficFileNo) ||
        notValid(requestParams.PlateCountryCode) ||
        notValid(requestParams.PlateSourceId) ||
        notValid(requestParams.PlateCategoryId) ||
        notValid(requestParams.PlateNumber)) {
        return validationError;
    } else {
        var IsCompanyAllowed = (notValid(requestParams.IsCompanyAllowed)) ? '' : '<sch:IsCompanyAllowed>' + requestParams.IsCompanyAllowed + '</sch:IsCompanyAllowed>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ValidateTFNAndPlateRequest>' +
                '<sch:TrafficFileDetails>'+
                    '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
                    '<!-- Optional: -->' +
                    IsCompanyAllowed +
                '</sch:TrafficFileDetails>' +
                '<sch:PlateDetails>'+
                    '<sch:PlateCountryCode>' + requestParams.PlateCountryCode + '</sch:PlateCountryCode>' +
                    '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>' +
                    '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>' +
                    '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>' +
                    '<sch:PlateColorId>' + requestParams.PlateColorId + '</sch:PlateColorId>' +
                '</sch:PlateDetails>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:ValidateTFNAndPlateRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'ValidateTFNAndPlateRequest';
        
        
        var requestObj = buildBody([request], true);
        
        
        return response=invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
       /* return result= {
            requestObj:requestObj,
            response :response
        }*/

    }
}




function VehicleInformationValidation(requestParams, isEncryptResponse, encryptionPassword) {
    if (notValid(requestParams.token) ||
        notValid(requestParams.VehicleMakeId) ||
        notValid(requestParams.VehicleModelId) ||
        notValid(requestParams.VehicleCategoryId) ||
        notValid(requestParams.VehicleColorId) ||
        notValid(requestParams.VehicleYear) ||
        notValid(requestParams.ChassisNo)) {
        return validationError;
    } else {
        var ExpiryDate = (notValid(requestParams.ExpiryDate)) ? '' : '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
           '<sch:VehicleInformationValidationRequest>' +
            '<sch:VehicleDetails>' +
           '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
           '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
            '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
            '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
            '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
            '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
            '<!-- Optional: -->' +
            ExpiryDate +
            '</sch:VehicleDetails>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:VehicleInformationValidationRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'VehicleInformationValidationRequest';
        var requestObj = buildBody([request], true);

       return   response=invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
      /*  return result= {
             requestObj:requestObj,
             response :response
         }*/
    }
}


function TagRegistrationWithProfileDetails(requestParams, isEncryptResponse, encryptionPassword) {
    var request = "";
    if (notValid(requestParams.TagNumber) ||
        notValid(requestParams.PlateCategoryId) ||
        notValid(requestParams.PlateNumber) ||
        notValid(requestParams.PlateSourceId) ||
        notValid(requestParams.PlateCountryCode) ||
        notValid(requestParams.TrafficFileNo) ||
        notValid(requestParams.VehicleYear) ||
        notValid(requestParams.VehicleModelId) ||
        notValid(requestParams.VehicleMakeId) ||
        notValid(requestParams.VehicleCategoryId) ||
        notValid(requestParams.VehicleColorId) ||
        notValid(requestParams.ChassisNo) ||
        notValid(requestParams.AccountType) ||
        notValid(requestParams.Name) ||
        notValid(requestParams.PhoneCountryCode) ||
        notValid(requestParams.PhoneNumber) ||
        notValid(requestParams.OTPGuid)||
        notValid(requestParams.OTPCode)
    ) {
        return validationError;

    }else {
        if(requestParams.IsCompanyAllowed === false){
            var TagActivationKeyCode = (notValid(requestParams.TagActivationKeyCode)) ? '' : '<sch:TagActivationKeyCode>' + requestParams.TagActivationKeyCode + '</sch:TagActivationKeyCode>';
            var IsCompanyAllowed = (notValid(requestParams.IsCompanyAllowed)) ? '' : '<sch:IsCompanyAllowed>' + requestParams.IsCompanyAllowed + '</sch:IsCompanyAllowed>';
            var plateColorId = (requestParams.PlateCategoryId !== "1") ? '' : '<sch:PlateColorId>' + requestParams.PlateColorId + '</sch:PlateColorId>';
            var CompanyName= (requestParams.AccountType !== "2") ? '' : '<sch:CompanyName>' + requestParams.CompanyName + '</sch:CompanyName>';
            var IsTagActivationRequest = (notValid(requestParams.IsTagActivationRequest)) ? '' : '<sch:IsTagActivationRequest>'+requestParams.IsTagActivationRequest+'</sch:IsTagActivationRequest>';
            request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
                '<soapenv:Body>' +
                '<sch:TagRegWithProfileDetailsReq>' +
                '<sch:TagNumber>' + requestParams.TagNumber + '</sch:TagNumber>' +
                '<!--Optional:-->' +
                TagActivationKeyCode +
                '<sch:PlateInfo>' +
                '<sch:PlateCountryCode>' + requestParams.PlateCountryCode + '</sch:PlateCountryCode>' +
                '<sch:PlateSourceId>' + requestParams.PlateSourceId + '</sch:PlateSourceId>' +
                '<sch:PlateCategoryId>' + requestParams.PlateCategoryId + '</sch:PlateCategoryId>' +
                '<sch:PlateNumber>' + requestParams.PlateNumber + '</sch:PlateNumber>' +
                '<!--Optional:-->' +
                plateColorId +
                '</sch:PlateInfo>' +
                '<sch:TrafficFileDetails>' +
                '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
                '<!-- Optional: -->' +
                 IsCompanyAllowed +
                 '<!--Optional:-->'+
                 IsTagActivationRequest +
                '</sch:TrafficFileDetails>' +
                '<sch:VehicleDetails>' +
                '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
                '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
                '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
                '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
                '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
                '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
                '</sch:VehicleDetails>' +
                '<!--Optional:-->'+
                '<sch:ProfileDetails>' +
                '<sch:AccountType>' + requestParams.AccountType + '</sch:AccountType>' +
                '<sch:Name>' + requestParams.Name + '</sch:Name>' +
                '<!--Optional:-->'+
                '<sch:EmailAddress>' + requestParams.EmailAddress + '</sch:EmailAddress>' +
                '<!--Optional:-->'+
                CompanyName+
                '<sch:MobilePhone>' +
                '<sch:PhoneCountryCode>' + requestParams.PhoneCountryCode + '</sch:PhoneCountryCode>' +
                '<sch:PhoneNumber>' + requestParams.PhoneNumber + '</sch:PhoneNumber>' +
                '</sch:MobilePhone>' +
                '</sch:ProfileDetails>' +
                '<sch:OTPGuid>' + requestParams.OTPGuid + '</sch:OTPGuid>' +
                '<sch:OTPCode>' + requestParams.OTPCode + '</sch:OTPCode>' +
                '</sch:TagRegWithProfileDetailsReq>' +
                '</soapenv:Body>' + soapEnvEnd;

        }
        else{
            var tagActivationRequest = (notValid(requestParams.IsTagActivationRequest)) ? '' : '<sch:IsTagActivationRequest>'+requestParams.IsTagActivationRequest+'</sch:IsTagActivationRequest>';
            var PlateColorId = (notValid(requestParams.PlateColorId)) ? '' : '<sch:PlateColorId>'+requestParams.PlateColorId+'</sch:PlateColorId>';
            request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikTagService/Schema.xsd">' +
                '   <soapenv:Header>' +
                '      <sch:Header>' +
                '         <!--Optional:-->' +
                '         <!--<sch:client_ID>dubaidrive.android</sch:client_ID>-->' +
                '         <sch:client_ID>dubaidrive.hybrid</sch:client_ID>' +
                '         <!--Optional:-->' +
                '      </sch:Header>' +
                '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '         <wsse:UsernameToken wsu:Id="UsernameToken-2">' +
                '              <wsse:Username>Mobstguser</wsse:Username>' +
                '    ' +
                '            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">m792!du)+1g</wsse:Password>' +
                '            <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">Luxfam/EW2IN5A9aRLFT1A==</wsse:Nonce>' +
                '            <wsu:Created>2020-07-05T08:54:01.443Z</wsu:Created>' +
                '         </wsse:UsernameToken>' +
                '      </wsse:Security></soapenv:Header>' +
                '   <soapenv:Body>' +
                '      <sch:TagRegWithProfileDetailsReq>' +
                '         <sch:TagNumber>'+requestParams.TagNumber+'</sch:TagNumber>' +
                '         <!--Optional:-->' +
                '         <sch:TagActivationKeyCode>'+requestParams.TagActivationKeyCode+'</sch:TagActivationKeyCode>' +
                '         <sch:PlateInfo>' +
                '            <sch:PlateCountryCode>'+requestParams.PlateCountryCode+'</sch:PlateCountryCode>' +
                '            <sch:PlateSourceId>'+requestParams.PlateSourceId+'</sch:PlateSourceId>' +
                '            <sch:PlateCategoryId>'+requestParams.PlateCategoryId+'</sch:PlateCategoryId>' +
                '            <sch:PlateNumber>'+requestParams.PlateNumber+'</sch:PlateNumber>' +
                '            <!--Optional:-->' +
                             PlateColorId +
                '         </sch:PlateInfo>' +
                '         <sch:TrafficFileDetails>' +
                '            <sch:TrafficFileNo>'+requestParams.TrafficFileNo+'</sch:TrafficFileNo>' +
                '            <!--Optional:-->' +
                '            <sch:IsCompanyAllowed>'+requestParams.IsCompanyAllowed+'</sch:IsCompanyAllowed>' +
                '            <!--Optional:-->' +
                           tagActivationRequest +
                '         </sch:TrafficFileDetails>' +
                '         <sch:VehicleDetails>' +
                '            <sch:VehicleYear>'+requestParams.VehicleYear+'</sch:VehicleYear>' +
                '            <sch:VehicleModelId>'+requestParams.VehicleModelId+'</sch:VehicleModelId>' +
                '            <sch:VehicleMakeId>'+requestParams.VehicleMakeId+'</sch:VehicleMakeId>' +
                '            <sch:VehicleCategoryId>'+requestParams.VehicleCategoryId+'</sch:VehicleCategoryId>' +
                '            <sch:VehicleColorId>'+requestParams.VehicleColorId+'</sch:VehicleColorId>' +
                '            <sch:ChassisNo>'+requestParams.ChassisNo+'</sch:ChassisNo>' +
                '            <!--Optional:-->' +
                '         </sch:VehicleDetails>' +
                '         <!--Optional:-->' +
                '         <sch:ProfileDetails>' +
                '            <sch:AccountType>'+requestParams.AccountType+'</sch:AccountType>' +
                '            <sch:Name>'+requestParams.Name+'</sch:Name>' +
                '            <!--Optional:-->' +
                '            <sch:EmailAddress/>' +
                '            <!--Optional:-->' +
                '            <sch:CompanyName>'+requestParams.CompanyName+'</sch:CompanyName>' +
                '            <sch:MobilePhone>' +
                '               <sch:PhoneCountryCode>'+requestParams.PhoneCountryCode+'</sch:PhoneCountryCode>' +
                '               <sch:PhoneNumber>'+requestParams.PhoneNumber+'</sch:PhoneNumber>' +
                '            </sch:MobilePhone>' +
                '            <!--Optional:-->' +
                '            <sch:OfficePhone>' +
                '               <sch:PhoneCountryCode></sch:PhoneCountryCode>' +
                '               <sch:PhoneNumber></sch:PhoneNumber>' +
                '            </sch:OfficePhone>' +
                '         </sch:ProfileDetails>' +
                '         <sch:OTPGuid>'+requestParams.OTPGuid+'</sch:OTPGuid>' +
                '         <sch:OTPCode>'+requestParams.OTPCode+'</sch:OTPCode>' +
                '      </sch:TagRegWithProfileDetailsReq>' +
                '   </soapenv:Body>' +
                '</soapenv:Envelope>';
        }

        var servicePath = '/salikTagService';
        var SOAPAction = 'TagRegWithProfileDetailsRequest';
        var requestObj = buildBody([request], true);

      return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
       // return result= {
       //        requestObj:requestObj,
       //        response :response
       //    }


        
    }
}
function ValidateVehicleDetails(requestParams, isEncryptResponse, encryptionPassword) {
    if (
        notValid(requestParams.OwnerName) ||
        notValid(requestParams.VehicleMakeId) ||
        notValid(requestParams.VehicleModelId) ||
        notValid(requestParams.VehicleCategoryId) ||
        notValid(requestParams.VehicleColorId) ||
        notValid(requestParams.VehicleYear) ||
        notValid(requestParams.ChassisNo) ||
        notValid(requestParams.TrafficFileNo) ) {
        return validationError;
    } else {
        var ExpiryDate = (notValid(requestParams.ExpiryDate)) ? '' : '<sch:ExpiryDate>' + requestParams.ExpiryDate + '</sch:ExpiryDate>';
        var IsCompanyAllowed = (notValid(requestParams.IsCompanyAllowed)) ? '' : '<sch:IsCompanyAllowed>' + requestParams.IsCompanyAllowed + '</sch:IsCompanyAllowed>';
        var request = soapEnvStart + soapHeaderStart + getGrantHeader(requestParams.token) + tibcoHeader + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ValidateVehicleDetailsRequest>' +
            '<sch:CustomerDetails>' +
            '<sch:OwnerName>' + requestParams.OwnerName + '</sch:OwnerName>' +
            '</sch:CustomerDetails>' +
            '<sch:VehicleDetails>' +
            '<sch:VehicleYear>' + requestParams.VehicleYear + '</sch:VehicleYear>' +
            '<sch:VehicleModelId>' + requestParams.VehicleModelId + '</sch:VehicleModelId>' +
            '<sch:VehicleMakeId>' + requestParams.VehicleMakeId + '</sch:VehicleMakeId>' +
            '<sch:VehicleCategoryId>' + requestParams.VehicleCategoryId + '</sch:VehicleCategoryId>' +
            '<sch:VehicleColorId>' + requestParams.VehicleColorId + '</sch:VehicleColorId>' +
            '<sch:ChassisNo>' + requestParams.ChassisNo + '</sch:ChassisNo>' +
            '<!-- Optional: -->' +
            ExpiryDate +
            '</sch:VehicleDetails>' +
            '<sch:TrafficFileDetails>' +
            '<sch:TrafficFileNo>' + requestParams.TrafficFileNo + '</sch:TrafficFileNo>' +
            '<!-- Optional: -->' +
            IsCompanyAllowed +
            '</sch:TrafficFileDetails>' +
            '<sch:AppId>SALIK</sch:AppId>' +
            '</sch:ValidateVehicleDetailsRequest>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikTagService';
        var SOAPAction = 'ValidateVehicleDetailsRequest';
        var requestObj = buildBody([request], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function isIndividualCheck(tfNo){
    if(tfNo.toString()[0] == "5"){
        return false;
    }
    return true;
}
