/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *  Created By Ahmed Raouf 20-August-2018
 */
var IsDebugging;
var _userName = "%#credentials!#!username_tibco#%";
var _password = "%#credentials!#!password_tibco#%";
var adapterName = "drivers_and_vehicles_SalikViolationsAdapter";
var soapEnvStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd">';
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
///////////////////////////
//////////////////////////

// 9.26 Dispute Violation (Pre-Login) - Search Dispute
// 3.6 SearchDispute
function SearchDisputeTest(DisputeNumber, PageId, PageSize, isEncryptResponse, encryptionPassword) {

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    DisputeNumber = '4000001';

    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soapenv:Header>' +
        '	    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '	       <wsse:UsernameToken wsu:Id="UsernameToken-17">' +
        '	          <wsse:Username>' + userName + '</wsse:Username>' +
        '	          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '	          <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">ZEVmq6ZnzN0fpAU51D/SQw==</wsse:Nonce>' +
        '	          <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '	       </wsse:UsernameToken>' +
        '	    </wsse:Security>' +
        '	</soapenv:Header>' +
        '	 <soapenv:Body>' +
        '	    <sch:SearchDispute>' +
        '	       <sch:DisputeNumber>' + DisputeNumber + '</sch:DisputeNumber>' +
        '	       <sch:PageId>' + PageId + '</sch:PageId>' +
        '	       <sch:PageSize>' + PageSize + '</sch:PageSize>' +
        '	    </sch:SearchDispute>' +
        '	 </soapenv:Body>' +
        '</soapenv:Envelope>';




    //	return{
    //		message:request
    //	}

    var SOAPAction = "SearchDispute";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    //return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    var webServiceResult = {
        Envelope: {

            "Body": {
                "SearchDisputeResponse": {
                    "Result": {
                        "DisputedViolationList": [{
                                "TicketNumber": 14030001,
                                "ViolationDate": "2016-01-17T09:19:29.000+04:00",
                                "YYYYMM": 201601,
                                "Gate": "Al Barsha",
                                "Direction": "Sharjah",
                                "Amount": 100,
                                "ViolationTypeID": 1,
                                "ImageFilename": "",
                                "AcceptanceDate": "2016-07-18T11:48:25.543+04:00",
                                "CreationDate": "2016-07-18T00:00:00.000+04:00",
                                "ViolationStatus": "Disputed - Under Process",
                                "Balance": 0,
                                "ViolationEnabled": true,
                                "DisputedViolationReason": "Wrong Plate",
                                "PlateSource": "Dubai",
                                "PlateColor": "AD 5",
                                "PlateNumber": "9773"
                            },
                            {
                                "TicketNumber": 14030002,
                                "ViolationDate": "2016-01-18T09:20:29.000+04:00",
                                "YYYYMM": 201601,
                                "Gate": "Al Garhoud New Bridge",
                                "Direction": "Abu Dhabi",
                                "Amount": 200,
                                "ViolationTypeID": 2,
                                "ImageFilename": "",
                                "AcceptanceDate": "2016-07-18T11:48:25.547+04:00",
                                "CreationDate": "2016-07-18T00:00:00.000+04:00",
                                "ViolationStatus": "Disputed - Under Process",
                                "Balance": 0,
                                "ViolationEnabled": true,
                                "DisputedViolationReason": "Wrong Plate",
                                "PlateSource": "Dubai",
                                "PlateColor": "AD 5",
                                "PlateNumber": "9773"
                            }
                        ],
                        "DisputeStatus": "Under Process",
                        "PreferredRefundMethod": "Refund to Salik Account",
                        "DisputeNumber": 4000001,
                        "DisputedViolationStatusID": 1,
                        "DisputeDate": "2016-07-24T12:49:44.067+04:00",
                        "PreferredRefundMethodID": 2,
                        "RefundReferenceID": 32100001,
                        "TotalDisputedViolationsCount": 2
                    },
                    "ResponseCode": "4_0",
                    "ResponseDescription": "Success"
                }
            },
            "Header": ""
        },
        "totalTime": 54,
        "isSuccessful": true,
        "responseHeaders": {
            "Date": "Sun, 02 Jul 2017 05:21:33 GMT",
            "Content-Type": "text\/xml; charset=utf-8"
        },
        "statusReason": "OK",
        "warnings": [],
        "errors": [],
        "info": [],
        "responseTime": 53,
        "statusCode": 200
    }
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);

}

function SearchDispute(DisputeNumber, PageId, PageSize, lang, isEncryptResponse, encryptionPassword) {

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    //DisputeNumber = '4000001';

    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soapenv:Header>' +
        '	    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '	       <wsse:UsernameToken wsu:Id="UsernameToken-17">' +
        '	          <wsse:Username>' + userName + '</wsse:Username>' +
        '	          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '	          <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">ZEVmq6ZnzN0fpAU51D/SQw==</wsse:Nonce>' +
        '	          <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '	       </wsse:UsernameToken>' +
        '	    </wsse:Security>' +
        '	</soapenv:Header>' +
        '	 <soapenv:Body>' +
        '	    <sch:SearchDispute>' +
        '			<sch:Language> ' +
        '				<sch:Lang>' + lang + '</sch:Lang>' +
        '			</sch:Language>' +
        '	       <sch:DisputeNumber>' + DisputeNumber + '</sch:DisputeNumber>' +
        '	       <sch:PageId>' + PageId + '</sch:PageId>' +
        '	       <sch:PageSize>' + PageSize + '</sch:PageSize>' +
        '	    </sch:SearchDispute>' +
        '	 </soapenv:Body>' +
        '</soapenv:Envelope>';




    //	return{
    //		message:request
    //	}

    var SOAPAction = "SearchDispute";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);


}


// 4.19 View/Search Violations (Pre-Login)
// 3.7 ViewOrSearchViolations
function ViewOrSearchViolationsTest(PlateSourceId, PlateCategoryId, PlateNumber, PlateColorId, ShowPaidViolations, StartDate, EndDate, PageId, PageSize, isEncryptResponse, encryptionPassword) {

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	


    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        ' <soapenv:Header>' +
        '    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '       <wsse:UsernameToken wsu:Id="UsernameToken-6">' +
        '         <wsse:Username>' + userName + '</wsse:Username>' +
        '        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '       </wsse:UsernameToken>' +
        '    </wsse:Security>' +
        ' </soapenv:Header>' +
        ' <soapenv:Body>' +
        '    <sch:ViewOrSearchViolationsPreLogin>' +
        '       <sch:PlateSourceId>' + PlateSourceId + '</sch:PlateSourceId>' +
        '       <sch:PlateCategoryId>' + PlateCategoryId + '</sch:PlateCategoryId>' +
        '       <sch:PlateNumber>' + PlateNumber + '</sch:PlateNumber>' +
        '       <sch:PlateColorId>' + PlateColorId + '</sch:PlateColorId>' +
        '       <sch:ShowPaidViolations>' + ShowPaidViolations + '</sch:ShowPaidViolations>' +
        '       <sch:StartDate>' + StartDate + '</sch:StartDate>' +
        '       <sch:EndDate>' + EndDate + '</sch:EndDate>' +
        '       <sch:PageId>' + PageId + '</sch:PageId>' +
        '       <sch:PageSize>' + PageSize + '</sch:PageSize>' +
        '    </sch:ViewOrSearchViolationsPreLogin>' +
        ' </soapenv:Body>' +
        '</soapenv:Envelope>';


    //	return{
    //		message:request
    //	}

    var SOAPAction = "ViewOrSearchViolationsPreLogin";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    //return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);




    var webServiceResult = {
        Envelope: {

            "Body": {
                "ViewOrSearchViolationsResponse": {
                    "Result": {
                        "TotalViolationsCount": 5,
                        "Violations": [{
                                "DisputeAppNumber": "0",
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030009,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-21T09:23:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 50.00,
                                "ViolationStatus": "Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Maktoum Bridge",
                                "Direction": "Sharjah",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": "false"
                            },
                            {
                                "DisputeAppNumber": "0",
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030004,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-20T09:22:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 400.00,
                                "ViolationStatus": "Not Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Safa",
                                "Direction": "Abu Dhabi",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": "false"
                            },
                            {
                                "DisputeAppNumber": "0",
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030004,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-20T09:22:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 400.00,
                                "ViolationStatus": "Not Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Safa",
                                "Direction": "Abu Dhabi",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": "true"
                            },
                            {
                                "DisputeAppNumber": "0",
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030004,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-20T09:22:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 400.00,
                                "ViolationStatus": "Not Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Safa",
                                "Direction": "Abu Dhabi",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": "false"
                            },
                            {
                                "DisputeAppNumber": 4000031,
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030004,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-20T09:22:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 400.00,
                                "ViolationStatus": "Not Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Safa",
                                "Direction": "Abu Dhabi",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": false
                            },
                            {
                                "DisputeAppNumber": 4000029,
                                "DisputeDate": null,
                                "PreferredRefundMethodID": 0,
                                "PreferredRefundMethod": "",
                                "PlateSource": "Dubai",
                                "ISOFTPlateSource": "DXB",
                                "PlateColor": "A",
                                "PlateCategory": "Private",
                                "PlateNumber": 13245,
                                "TicketNumber": 14030004,
                                "YYYYMM": 201601,
                                "ViolationDate": "2016-01-20T09:22:29",
                                "AcceptanceDate": "03-Jul-2016 12:50:00 PM",
                                "CreationDate": "03-Jul-2016 12:00:00 AM",
                                "Amount": 400.00,
                                "ViolationStatus": "Not Paid",
                                "ViolationType": "URP",
                                "ViolationTypeID": 3,
                                "Gate": "Al Safa",
                                "Direction": "Abu Dhabi",
                                "Paid": false,
                                "ShowBalance": false,
                                "TollBalance": 0.0,
                                "AlertText": null,
                                "AllowDispute": false
                            }
                        ]
                    },
                    "ResponseCode": "3_20",
                    "ResponseDescription": "Success"
                }
            },
            "Header": ""
        },
        "totalTime": 54,
        "isSuccessful": true,
        "responseHeaders": {
            "Date": "Sun, 02 Jul 2017 05:21:33 GMT",
            "Content-Type": "text\/xml; charset=utf-8"
        },
        "statusReason": "OK",
        "warnings": [],
        "errors": [],
        "info": [],
        "responseTime": 53,
        "statusCode": 200
    }

    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);


}

function ViewOrSearchViolations(PlateSourceId, PlateCategoryId, PlateNumber, PlateColorId, ShowPaidViolations, StartDate, EndDate, PageId, PageSize, lang, isEncryptResponse, encryptionPassword) {

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    //	PlateSourceId = '1';
    //	PlateCategoryId = '1';
    //	PlateNumber = '20612';
    //	PlateColorId = '11';
    //
    //	ShowPaidViolations = true;
    //	StartDate = '01/30/2000' ;
    //	EndDate = '08/31/2018' ;


    if (PlateColorId != "") {
        var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            ' <soapenv:Header>' +
            '    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
            '       <wsse:UsernameToken wsu:Id="UsernameToken-6">' +
            '         <wsse:Username>' + userName + '</wsse:Username>' +
            '        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
            '       </wsse:UsernameToken>' +
            '    </wsse:Security>' +
            ' </soapenv:Header>' +
            ' <soapenv:Body>' +
            '    <sch:ViewOrSearchViolationsPreLogin>' +
            '			<sch:Language> ' +
            '				<sch:Lang>' + lang + '</sch:Lang>' +
            '			</sch:Language>' +
            '       <sch:PlateSourceId>' + PlateSourceId + '</sch:PlateSourceId>' +
            '       <sch:PlateCategoryId>' + PlateCategoryId + '</sch:PlateCategoryId>' +
            '       <sch:PlateNumber>' + PlateNumber + '</sch:PlateNumber>' +
            '       <sch:PlateColorId>' + PlateColorId + '</sch:PlateColorId>' +
            '       <sch:ShowPaidViolations>' + ShowPaidViolations + '</sch:ShowPaidViolations>' +
            '       <sch:StartDate>' + StartDate + '</sch:StartDate>' +
            '       <sch:EndDate>' + EndDate + '</sch:EndDate>' +
            '       <sch:PageId>' + PageId + '</sch:PageId>' +
            '       <sch:PageSize>' + PageSize + '</sch:PageSize>' +
            '    </sch:ViewOrSearchViolationsPreLogin>' +
            ' </soapenv:Body>' +
            '</soapenv:Envelope>';

    } else {
        var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            ' <soapenv:Header>' +
            '    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
            '       <wsse:UsernameToken wsu:Id="UsernameToken-6">' +
            '         <wsse:Username>' + userName + '</wsse:Username>' +
            '        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
            '       </wsse:UsernameToken>' +
            '    </wsse:Security>' +
            ' </soapenv:Header>' +
            ' <soapenv:Body>' +
            '    <sch:ViewOrSearchViolationsPreLogin>' +
            '			<sch:Language> ' +
            '				<sch:Lang>' + lang + '</sch:Lang>' +
            '			</sch:Language>' +
            '       <sch:PlateSourceId>' + PlateSourceId + '</sch:PlateSourceId>' +
            '       <sch:PlateCategoryId>' + PlateCategoryId + '</sch:PlateCategoryId>' +
            '       <sch:PlateNumber>' + PlateNumber + '</sch:PlateNumber>' +
            '       <sch:ShowPaidViolations>' + ShowPaidViolations + '</sch:ShowPaidViolations>' +
            '       <sch:StartDate>' + StartDate + '</sch:StartDate>' +
            '       <sch:EndDate>' + EndDate + '</sch:EndDate>' +
            '       <sch:PageId>' + PageId + '</sch:PageId>' +
            '       <sch:PageSize>' + PageSize + '</sch:PageSize>' +
            '    </sch:ViewOrSearchViolationsPreLogin>' +
            ' </soapenv:Body>' +
            '</soapenv:Envelope>';
    }
    //	return{
    //		message:request
    //	}

    var SOAPAction = "ViewOrSearchViolationsPreLogin";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);


}




//9.20 Dispute - Validate Dispute Information
//3.2 ValidateDisputeInformation 
function ValidateDisputeInformationTest(DisputeInfo, isEncryptResponse, encryptionPassword) {

    //DisputeInfo.CustomerName
    //DisputeInfo.AccountId
    //DisputeInfo.PhoneCountryCode
    //DisputeInfo.ContactNumber
    //DisputeInfo.Email
    //DisputeInfo.TFNSourceId
    //DisputeInfo.TCNumber
    //DisputeInfo.RefundMethodId
    //DisputeInfo.RefundAccountId
    //DisputeInfo.RefundAccountPin


    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	


    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soapenv:Header>' +
        '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '   <wsse:UsernameToken wsu:Id="UsernameToken-19">' +
        '      <wsse:Username>' + userName + '</wsse:Username>' +
        '      <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '      <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">JRN6lOTmVWuzYtN4vH7RNA==</wsse:Nonce>' +
        '      <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '   </wsse:UsernameToken>' +
        '</wsse:Security>' +
        '</soapenv:Header>' +
        '<soapenv:Body>' +
        '   <sch:ValidateDisputeInformation>' +
        '      <sch:CustomerName>Ahsan</sch:CustomerName>' +
        '      <sch:AccountId>32100001</sch:AccountId>' +
        '      <sch:PhoneCountryCode>971</sch:PhoneCountryCode>' +
        '      <sch:ContactNumber>0501234567</sch:ContactNumber>' +
        '      <sch:Email>abc@abc.com</sch:Email>' +
        '      <sch:TFNSourceId>1</sch:TFNSourceId>' +
        '     <sch:TCNumber>251425</sch:TCNumber>' +
        '      <sch:RefundMethodId>2</sch:RefundMethodId>' +
        '     <sch:RefundAccountId>32100001</sch:RefundAccountId>' +
        '      <sch:RefundAccountPin>2566</sch:RefundAccountPin>' +
        '   </sch:ValidateDisputeInformation>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';



    //	return{
    //		message:request
    //	}

    var SOAPAction = "ValidateDisputeInformation";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    //return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    var webServiceResult = {
        Envelope: {

            "Body": {
                "ValidateDisputeInformationResponse": {
                    "ResponseCode": "5_100",
                    "ResponseDescription": "Success",
                    "DisputeAppNumber": "54646464"
                }
            },
            "Header": ""
        },
        "totalTime": 54,
        "isSuccessful": true,
        "responseHeaders": {
            "Date": "Sun, 02 Jul 2017 05:21:33 GMT",
            "Content-Type": "text\/xml; charset=utf-8"
        },
        "statusReason": "OK",
        "warnings": [],
        "errors": [],
        "info": [],
        "responseTime": 53,
        "statusCode": 200
    }
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);



}

function ValidateDisputeInformation(DisputeInfo, isEncryptResponse, encryptionPassword) {

    /*var DisputeInfo = {CustomerName:"Ahsan", 
    				AccountId:"32100028", 
    				PhoneCountryCode:"00971",
    				ContactNumber:"0562345678",
    				Email:"DubaiDrive3@Dispute.ae",
    				RefundMethodId:"1",
    				RefundAccountId:"32100028",
    				RefundAccountPin:"1890"};
    */

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    if (DisputeInfo.RefundMethodId == "2") {
        var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Header>' +
            '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
            '   <wsse:UsernameToken wsu:Id="UsernameToken-19">' +
            '      <wsse:Username>' + userName + '</wsse:Username>' +
            '      <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
            '      <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">JRN6lOTmVWuzYtN4vH7RNA==</wsse:Nonce>' +
            '      <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
            '   </wsse:UsernameToken>' +
            '</wsse:Security>' +
            '</soapenv:Header>' +
            '<soapenv:Body>' +
            '   <sch:ValidateDisputeInformation>' +
            '      <sch:CustomerName>' + DisputeInfo.CustomerName + '</sch:CustomerName>' +
            '      <sch:AccountId>' + DisputeInfo.AccountId + '</sch:AccountId>' +
            '      <sch:PhoneCountryCode>' + DisputeInfo.PhoneCountryCode + '</sch:PhoneCountryCode>' +
            '      <sch:ContactNumber>' + DisputeInfo.ContactNumber + '</sch:ContactNumber>' +
            '      <sch:Email>' + DisputeInfo.Email + '</sch:Email>' +
            '      <sch:RefundMethodId>' + DisputeInfo.RefundMethodId + '</sch:RefundMethodId>' +
            '      <sch:RefundAccountId>' + DisputeInfo.RefundAccountId + '</sch:RefundAccountId>' +
            '      <sch:RefundAccountPin>' + DisputeInfo.RefundAccountPin + '</sch:RefundAccountPin>' +
            '   </sch:ValidateDisputeInformation>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
    } else {
        var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soapenv:Header>' +
            '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
            '   <wsse:UsernameToken wsu:Id="UsernameToken-19">' +
            '      <wsse:Username>' + userName + '</wsse:Username>' +
            '      <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
            '      <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">JRN6lOTmVWuzYtN4vH7RNA==</wsse:Nonce>' +
            '      <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
            '   </wsse:UsernameToken>' +
            '</wsse:Security>' +
            '</soapenv:Header>' +
            '<soapenv:Body>' +
            '   <sch:ValidateDisputeInformation>' +
            '      <sch:CustomerName>' + DisputeInfo.CustomerName + '</sch:CustomerName>' +
            '      <sch:PhoneCountryCode>' + DisputeInfo.PhoneCountryCode + '</sch:PhoneCountryCode>' +
            '      <sch:ContactNumber>' + DisputeInfo.ContactNumber + '</sch:ContactNumber>' +
            '      <sch:Email>' + DisputeInfo.Email + '</sch:Email>' +
            '      <sch:RefundMethodId>' + DisputeInfo.RefundMethodId + '</sch:RefundMethodId>' +
            '   </sch:ValidateDisputeInformation>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
    }




    //	return{
    //		message:request
    //	}

    var SOAPAction = "ValidateDisputeInformation";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

}




//9.25 Dispute Violation (Pre-Login) - Step Validate Dispute Reason
//3.8	ValidateDisputeReason

function ValidateDisputeReasonTest(DisputeViolationList, isEncryptResponse, encryptionPassword) {

    //"DisputeViolationList":[  
    //{  
    //"TicketNumber":14040005,
    //"DisputeReasonID":18
    //},
    //{  
    //"TicketNumber":14040064,
    //"DisputeReasonID":1
    //}
    //]


    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    /*DisputeViolationList = '	       <sch:DisputeViolationList>' +
    						   '	          <sch:TicketNumber>14030001</sch:TicketNumber>' +
    						   '	          <sch:DisputeReasonID>7</sch:DisputeReasonID>' +
    						   '	       </sch:DisputeViolationList>' ;*/


    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '	<soapenv:Header>' +
        '	    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '	       <wsse:UsernameToken wsu:Id="UsernameToken-11">' +
        '	          <wsse:Username>' + userName + '</wsse:Username>' +
        '	          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '	          <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">klq5GbGwef1wPWMkyepKbA==</wsse:Nonce>' +
        '	          <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '	       </wsse:UsernameToken>' +
        '	    </wsse:Security>' +
        '	 </soapenv:Header>' +
        '	 <soapenv:Body>' +
        '	    <sch:ValidateDisputeReasonRequest>' +
        DisputeViolationList +
        '	    </sch:ValidateDisputeReasonRequest>' +
        '	 </soapenv:Body>' +
        '	</soapenv:Envelope>';



    //	return{
    //		message:request
    //	}

    var SOAPAction = "ValidateDisputeReasonRequest";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    //return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    var webServiceResult = {
        Envelope: {

            "Body": {
                "ValidateDisputeReasonResponse": {
                    "ResponseCode": "5_160",
                    "ResponseDescription": "Success",
                    "Result": {
                        "InvalidDisputeViolationList": ""
                    }
                }
            },
            "Header": ""
        },
        "totalTime": 54,
        "isSuccessful": true,
        "responseHeaders": {
            "Date": "Sun, 02 Jul 2017 05:21:33 GMT",
            "Content-Type": "text\/xml; charset=utf-8"
        },
        "statusReason": "OK",
        "warnings": [],
        "errors": [],
        "info": [],
        "responseTime": 53,
        "statusCode": 200
    }

    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);


}

function ValidateDisputeReason(DisputeViolationList, isEncryptResponse, encryptionPassword) {

    //	"DisputeViolationList":[  
    //	{  
    //	"TicketNumber":14030001,
    //	"DisputeReasonID":7
    //	},
    //	{  
    //	"TicketNumber":14040064,
    //	"DisputeReasonID":1
    //	}
    //	]
    var xmlList = '';
    for (var i = 0; i < DisputeViolationList.length; i++) {
        var xmlDisputeViolation = '	       <sch:DisputeViolationList>' +
            '	          <sch:TicketNumber>' + DisputeViolationList[i].TicketNumber + '</sch:TicketNumber>' +
            '	          <sch:DisputeReasonID>' + DisputeViolationList[i].DisputeReasonID + '</sch:DisputeReasonID>' +
            '	       </sch:DisputeViolationList>';
        xmlList = xmlList + xmlDisputeViolation;
    }



    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    /*DisputeViolationList = 	   '	       <sch:DisputeViolationList>' +
    						   '	          <sch:TicketNumber>14030001</sch:TicketNumber>' +
    						   '	          <sch:DisputeReasonID>7</sch:DisputeReasonID>' +
    						   '	       </sch:DisputeViolationList>' ; */


    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '	<soapenv:Header>' +
        '	    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '	       <wsse:UsernameToken wsu:Id="UsernameToken-11">' +
        '	          <wsse:Username>' + userName + '</wsse:Username>' +
        '	          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '	          <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">klq5GbGwef1wPWMkyepKbA==</wsse:Nonce>' +
        '	          <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '	       </wsse:UsernameToken>' +
        '	    </wsse:Security>' +
        '	 </soapenv:Header>' +
        '	 <soapenv:Body>' +
        '	    <sch:ValidateDisputeReasonRequest>' +
        xmlList +
        '	    </sch:ValidateDisputeReasonRequest>' +
        '	 </soapenv:Body>' +
        '	</soapenv:Envelope>';



    //	return{
    //		message:request
    //	}

    var SOAPAction = "ValidateDisputeReasonRequest";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

}



//9.23 Dispute – Create Dispute
//3.5 CreateDispute 
function CreateDisputeTest(DisputeDetails, DisputeViolationList, isEncryptResponse, encryptionPassword) {


    //DisputeDetails.CustomerName

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	


    var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soapenv:Header>' +
        '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
        '      <wsse:UsernameToken wsu:Id="UsernameToken-15">' +
        '         <wsse:Username>' + userName + '</wsse:Username>' +
        '         <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
        '         <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">PiEjOVY90udASqOy/l/IhQ==</wsse:Nonce>' +
        '         <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
        '      </wsse:UsernameToken>' +
        '   </wsse:Security>' +
        '</soapenv:Header>' +
        '<soapenv:Body>' +
        '   <sch:CreateDispute>' +
        '      <sch:DisputeDetails>' +
        '         <sch:CustomerName>Ahsan</sch:CustomerName>' +
        '         <sch:AccountId>32100001</sch:AccountId>' +
        '         <sch:PhoneCountryCode>971</sch:PhoneCountryCode>' +
        '         <sch:ContactNumber>0502145878</sch:ContactNumber>' +
        '         <sch:Email>abc@abc.com</sch:Email>' +
        '         <sch:TFNSourceId>1</sch:TFNSourceId>' +
        '         <sch:TCNumber>251425</sch:TCNumber>' +
        '         <sch:RefundMethodId>2</sch:RefundMethodId>' +
        '         <sch:RefundAccountId>32100001</sch:RefundAccountId>' +
        '         <sch:RefundAccountPin>2566</sch:RefundAccountPin>' +
        '      </sch:DisputeDetails>' +
        '      <sch:DisputeViolationsList>' +
        '         <sch:TicketNumber>14030001</sch:TicketNumber>' +
        '         <sch:DisputeReasonID>1</sch:DisputeReasonID>' +
        '      </sch:DisputeViolationsList>' +
        '      <sch:DisputeAttachmentsList>' +
        '      </sch:DisputeAttachmentsList>' +
        '      <sch:OTPGuid>8a8dac80-d58f-4f14-a0bd-87effaa3ace0</sch:OTPGuid>' +
        '      <sch:OTPCode>5214</sch:OTPCode>' +
        '   </sch:CreateDispute>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';



    //	return{
    //		message:request
    //	}

    var SOAPAction = "CreateDispute";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    //return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);

    var webServiceResult = {
        Envelope: {

            "Body": {
                "CreateDisputeResponse": {
                    "ResponseCode": "5_0",
                    "ResponseDescription": "Success"
                }
            },
            "Header": ""
        },
        "totalTime": 54,
        "isSuccessful": true,
        "responseHeaders": {
            "Date": "Sun, 02 Jul 2017 05:21:33 GMT",
            "Content-Type": "text\/xml; charset=utf-8"
        },
        "statusReason": "OK",
        "warnings": [],
        "errors": [],
        "info": [],
        "responseTime": 53,
        "statusCode": 200
    }

    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);


}

function CreateDispute(DisputeInfo, DisputeViolationList, isEncryptResponse, encryptionPassword) {


    /*	var DisputeInfo = {CustomerName:"Ahsan", 
    			AccountId:"32100028", 
    			PhoneCountryCode:"00971",
    			ContactNumber:"0562345678",
    			Email:"DubaiDrive3@Dispute.ae",
    			RefundMethodId:"1",
    			RefundAccountId:"32100028",
    			RefundAccountPin:"1890"};
    	*/
    var xmlList = '';
    for (var i = 0; i < DisputeViolationList.length; i++) {
        var xmlDisputeViolation = '	       <sch:DisputeViolationsList>' +
            '	          <sch:TicketNumber>' + DisputeViolationList[i].TicketNumber + '</sch:TicketNumber>' +
            '	          <sch:DisputeReasonID>' + DisputeViolationList[i].DisputeReasonID + '</sch:DisputeReasonID>' +
            '	       </sch:DisputeViolationsList>';
        xmlList = xmlList + xmlDisputeViolation;
    }

    var userName = MFP.Server.getPropertyValue("wsse.tibco.username");
    var password = MFP.Server.getPropertyValue("wsse.tibco.password");

    var requestDate = new Date(Date.now());
    var requestDateFormated = requestDate.toISOString(); // Returns 2011-10-05T14:48:00.000Z	

    if (DisputeInfo.DisputeDetails.RefundMethodId == "2") {
        if (DisputeInfo.DisputeDetails.TFNumber != "") {
            var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soapenv:Header>' +
                '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '      <wsse:UsernameToken wsu:Id="UsernameToken-15">' +
                '         <wsse:Username>' + userName + '</wsse:Username>' +
                '         <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
                '         <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">PiEjOVY90udASqOy/l/IhQ==</wsse:Nonce>' +
                '         <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
                '      </wsse:UsernameToken>' +
                '   </wsse:Security>' +
                '</soapenv:Header>' +
                '<soapenv:Body>' +
                '   <sch:CreateDispute>' +
                '      <sch:DisputeDetails>' +
                '         <sch:CustomerName>' + DisputeInfo.DisputeDetails.CustomerName + '</sch:CustomerName>' +
                '         <sch:AccountId>' + DisputeInfo.DisputeDetails.RefundAccountId + '</sch:AccountId>' +
                '         <sch:PhoneCountryCode>' + DisputeInfo.DisputeDetails.PhoneCountryCode + '</sch:PhoneCountryCode>' +
                '         <sch:ContactNumber>' + DisputeInfo.DisputeDetails.ContactNumber + '</sch:ContactNumber>' +
                '         <sch:Email>' + DisputeInfo.DisputeDetails.Email + '</sch:Email>' +
                '         <sch:TFNSourceId>' + DisputeInfo.DisputeDetails.TFNSourceId + '</sch:TFNSourceId>' +
                '         <sch:TCNumber>' + DisputeInfo.DisputeDetails.TFNumber + '</sch:TCNumber>' +
                '         <sch:RefundMethodId>' + DisputeInfo.DisputeDetails.RefundMethodId + '</sch:RefundMethodId>' +
                '         <sch:RefundAccountId>' + DisputeInfo.DisputeDetails.RefundAccountId + '</sch:RefundAccountId>' +
                '         <sch:RefundAccountPin>' + DisputeInfo.DisputeDetails.RefundAccountPin + '</sch:RefundAccountPin>' +
                '      </sch:DisputeDetails>' +
                xmlList +
                '      <sch:OTPGuid>' + DisputeInfo.OTPGuid + '</sch:OTPGuid>' +
                '      <sch:OTPCode>' + DisputeInfo.OTPCode + '</sch:OTPCode>' +
                '   </sch:CreateDispute>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
        } else {
            var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soapenv:Header>' +
                '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '      <wsse:UsernameToken wsu:Id="UsernameToken-15">' +
                '         <wsse:Username>' + userName + '</wsse:Username>' +
                '         <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
                '         <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">PiEjOVY90udASqOy/l/IhQ==</wsse:Nonce>' +
                '         <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
                '      </wsse:UsernameToken>' +
                '   </wsse:Security>' +
                '</soapenv:Header>' +
                '<soapenv:Body>' +
                '   <sch:CreateDispute>' +
                '      <sch:DisputeDetails>' +
                '         <sch:CustomerName>' + DisputeInfo.DisputeDetails.CustomerName + '</sch:CustomerName>' +
                '         <sch:AccountId>' + DisputeInfo.DisputeDetails.RefundAccountId + '</sch:AccountId>' +
                '         <sch:PhoneCountryCode>' + DisputeInfo.DisputeDetails.PhoneCountryCode + '</sch:PhoneCountryCode>' +
                '         <sch:ContactNumber>' + DisputeInfo.DisputeDetails.ContactNumber + '</sch:ContactNumber>' +
                '         <sch:Email>' + DisputeInfo.DisputeDetails.Email + '</sch:Email>' +
                '         <sch:TFNSourceId>' + DisputeInfo.DisputeDetails.TFNSourceId + '</sch:TFNSourceId>' +
                '         <sch:RefundMethodId>' + DisputeInfo.DisputeDetails.RefundMethodId + '</sch:RefundMethodId>' +
                '         <sch:RefundAccountId>' + DisputeInfo.DisputeDetails.RefundAccountId + '</sch:RefundAccountId>' +
                '         <sch:RefundAccountPin>' + DisputeInfo.DisputeDetails.RefundAccountPin + '</sch:RefundAccountPin>' +
                '      </sch:DisputeDetails>' +
                xmlList +
                '      <sch:OTPGuid>' + DisputeInfo.OTPGuid + '</sch:OTPGuid>' +
                '      <sch:OTPCode>' + DisputeInfo.OTPCode + '</sch:OTPCode>' +
                '   </sch:CreateDispute>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
        }
    } else {
        if (DisputeInfo.DisputeDetails.TFNumber != "") {
            var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soapenv:Header>' +
                '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '      <wsse:UsernameToken wsu:Id="UsernameToken-15">' +
                '         <wsse:Username>' + userName + '</wsse:Username>' +
                '         <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
                '         <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">PiEjOVY90udASqOy/l/IhQ==</wsse:Nonce>' +
                '         <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
                '      </wsse:UsernameToken>' +
                '   </wsse:Security>' +
                '</soapenv:Header>' +
                '<soapenv:Body>' +
                '   <sch:CreateDispute>' +
                '      <sch:DisputeDetails>' +
                '         <sch:CustomerName>' + DisputeInfo.DisputeDetails.CustomerName + '</sch:CustomerName>' +
                '         <sch:PhoneCountryCode>' + DisputeInfo.DisputeDetails.PhoneCountryCode + '</sch:PhoneCountryCode>' +
                '         <sch:ContactNumber>' + DisputeInfo.DisputeDetails.ContactNumber + '</sch:ContactNumber>' +
                '         <sch:Email>' + DisputeInfo.DisputeDetails.Email + '</sch:Email>' +
                '         <sch:TFNSourceId>' + DisputeInfo.DisputeDetails.TFNSourceId + '</sch:TFNSourceId>' +
                '         <sch:TCNumber>' + DisputeInfo.DisputeDetails.TFNumber + '</sch:TCNumber>' +
                '         <sch:RefundMethodId>' + DisputeInfo.DisputeDetails.RefundMethodId + '</sch:RefundMethodId>' +
                '      </sch:DisputeDetails>' +
                xmlList +
                '      <sch:OTPGuid>' + DisputeInfo.OTPGuid + '</sch:OTPGuid>' +
                '      <sch:OTPCode>' + DisputeInfo.OTPCode + '</sch:OTPCode>' +
                '   </sch:CreateDispute>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
        } else {
            var request = '<soapenv:Envelope xmlns:sch="http://www.rta.ae/schemas/SalikDisputesAndViolationService/Schema.xsd" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soapenv:Header>' +
                '   <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
                '      <wsse:UsernameToken wsu:Id="UsernameToken-15">' +
                '         <wsse:Username>' + userName + '</wsse:Username>' +
                '         <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>' +
                '         <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">PiEjOVY90udASqOy/l/IhQ==</wsse:Nonce>' +
                '         <wsu:Created>' + requestDateFormated + '</wsu:Created>' +
                '      </wsse:UsernameToken>' +
                '   </wsse:Security>' +
                '</soapenv:Header>' +
                '<soapenv:Body>' +
                '   <sch:CreateDispute>' +
                '      <sch:DisputeDetails>' +
                '         <sch:CustomerName>' + DisputeInfo.DisputeDetails.CustomerName + '</sch:CustomerName>' +
                '         <sch:PhoneCountryCode>' + DisputeInfo.DisputeDetails.PhoneCountryCode + '</sch:PhoneCountryCode>' +
                '         <sch:ContactNumber>' + DisputeInfo.DisputeDetails.ContactNumber + '</sch:ContactNumber>' +
                '         <sch:Email>' + DisputeInfo.DisputeDetails.Email + '</sch:Email>' +
                '         <sch:TFNSourceId>' + DisputeInfo.DisputeDetails.TFNSourceId + '</sch:TFNSourceId>' +
                '         <sch:RefundMethodId>' + DisputeInfo.DisputeDetails.RefundMethodId + '</sch:RefundMethodId>' +
                '      </sch:DisputeDetails>' +
                xmlList +
                '      <sch:OTPGuid>' + DisputeInfo.OTPGuid + '</sch:OTPGuid>' +
                '      <sch:OTPCode>' + DisputeInfo.OTPCode + '</sch:OTPCode>' +
                '   </sch:CreateDispute>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';
        }
    }


    //	return{
    //		message:request
    //	}

    var SOAPAction = "CreateDispute";
    var servicePath = '/salikDisputesAndViolationService';
    var requestObj = buildBody([request.toString()], true);


    return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);


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
        parameters: [_webServiceResult.toString()]
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

/*function _fault(response) {
    var data = (response["errors"][0]);
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(data, "text/xml");
    var code = xmlDoc.getElementsByTagName("FaultCode")[0].childNodes[0].nodeValue;
    var msg = xmlDoc.getElementsByTagName("FaultString")[0].childNodes[0].nodeValue;
    return {
        "errorCode": code,
        "errorMessage": msg
    }
}*/

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


function invokeWebService(body, servicePath, headers, isEncryptResponse, encryptionPassword) {
    var startTime = new Date().getTime();
    if (!headers)
        headers = {
            "SOAPAction": ""
        };
    else
        headers["SOAPAction"] = "";
    var input = {
        method: 'post',
        returnedContentType: 'xml',
        path: servicePath,
        body: {
            content: body.toString(),
            contentType: 'text/xml; charset=utf-8'
        }
    };

    // Adding custom HTTP headers if they were provided as parameter to the
    // procedure call
    headers && (input['headers'] = headers);

    var webServiceResult = MFP.Server.invokeHttp(input);
    if (isEncryptResponse != undefined && isEncryptResponse == true) {
        var responseString = JSON.stringify(webServiceResult);
        var invocationData = {
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }
    var endTime = new Date().getTime();
    //Log("time for " + servicePath + " is " + (endTime - startTime) + " ms");
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);
}


function LogRequest(REQUEST, PROCEDURE_NAME) {

    var REQUEST_ID = null;
    var ADAPTER_NAME = 'drivers_and_vehicles_SalikFeedBack_GuestAdapter';
    var REQUEST_TIME = null;
    var RESPONSE_TIME = null;
    //var PROCEDURE_NAME ='TestPROCEDURE';
    //var REQUEST ='Test Request';
    var RESPONSE = null;

    var invocationData = {
        adapter: 'SalikLogsAdapter',
        procedure: 'logRequest',
        parameters: [REQUEST_ID, ADAPTER_NAME, REQUEST_TIME, RESPONSE_TIME, PROCEDURE_NAME, REQUEST, RESPONSE]
    };


    updateStatementResult = MFP.Server.invokeProcedure(invocationData);


    return updateStatementResult;


}


function LogResponse(RAND_REF, RESPONSE) {

    var invocationData = {
        adapter: 'SalikLogsAdapter',
        procedure: 'logResponse',
        parameters: [RAND_REF, RESPONSE]
    };

    webServiceResult = MFP.Server.invokeProcedure(invocationData);

    return webServiceResult;
}

//Raouf Start Here
function getAllViolations(requestParams, isEncryptResponse, encryptionPassword) {

    /* var requestParams = {
 	"RtaUserId":"",
 	"linking_attribute":"",
 	"PageId":"",
 	"PageSize",""
 }*/

    if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.PageId) || notValid(requestParams.PageSize)) {
        return validationError;
    } else {
        var lang = (notValid(requestParams.lang)) ? 'en' : requestParams.lang;
        var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
            '<soapenv:Body>' +
            '<sch:ViewOrSearchViolationsPostLogin>' +
            '<sch:Language>' +
            '<sch:Lang>' + lang + '</sch:Lang>' +
            '</sch:Language>' +
            '<sch:PageId>' + requestParams.PageId + '</sch:PageId>' +
            '<sch:PageSize>' + requestParams.PageSize + '</sch:PageSize>' +
            '</sch:ViewOrSearchViolationsPostLogin>' +
            '</soapenv:Body>' + soapEnvEnd;

        var servicePath = '/salikDisputesAndViolationService';
        var SOAPAction = 'ViewOrSearchViolationsPostLogin';
        var requestObj = buildBody([request.toString()], true);

        return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
    }
}

function CreateDisputePL(requestParams, isEncryptResponse, encryptionPassword) {
    /*var requestParams = {
	 * "RtaUserId":"",
 	   "linking_attribute":"",
	    "DisputeViolationsList": [
	        {
	            "DisputeReasonID": "1",
	            "TicketNumber": "111111"
	        },
	        {
	            "DisputeReasonID": "2",
	            "TicketNumber": "222222"
	        }
	    ],
	    "RefundAccountPin": "2323",//optional
	    "RefundAccountId": "32000022",//optional
	    "RefundMethodId": "1",
	    "isSuccessful": true,
	    "linking_attribute": "fffffffffff",
	    "RtaUserId": "xxxx",
	    "Lang": "en"//optional
	}*/
    try {
        if (notValid(requestParams.RtaUserId) || notValid(requestParams.linking_attribute) || notValid(requestParams.RefundMethodId) || requestParams.DisputeViolationsList.length == 0) {
            return validationError;
        } else {

            var lang = notValid(requestParams.lang) ? "en" : requestParams.lang;
            var account = notValid(requestParams.RefundAccountId) ? '' : '<sch:RefundAccountId>' + requestParams.RefundAccountId + '</sch:RefundAccountId>';
            var pin = notValid(requestParams.RefundAccountPin) ? '' : '<sch:RefundAccountPin>' + requestParams.RefundAccountPin + '</sch:RefundAccountPin>';
            var account_pin = (notValid(account) || notValid(pin)) ? '' : account + pin;
            var DisputeList = '';
            for (var i = 0; i < requestParams.DisputeViolationsList.length; i++) {
                var xmlDisputeViolation = '<sch:DisputeViolationsList>' +
                    '<sch:TicketNumber>' + requestParams.DisputeViolationsList[i].TicketNumber + '</sch:TicketNumber>' +
                    '<sch:DisputeReasonID>' + requestParams.DisputeViolationsList[i].DisputeReasonID + '</sch:DisputeReasonID>' +
                    '</sch:DisputeViolationsList>';
                DisputeList += xmlDisputeViolation;
            }

            var request = soapEnvStart + soapHeaderStart + tibcoHeader + getGrantHeader(requestParams.RtaUserId, requestParams.linking_attribute) + soapHeaderEnd +
                '<soapenv:Body>' +
                '<sch:CreateDisputePL>' +
                '<!--Optional:-->' +
                '<sch:Language>' +
                '<sch:Lang>' + lang + '</sch:Lang>' +
                '</sch:Language>' +
                '<sch:DisputeDetailsPL>' +
                '<sch:RefundMethodId>' + requestParams.RefundMethodId + '</sch:RefundMethodId>' +
                '<!--Optional:-->' +
                account_pin +
                '</sch:DisputeDetailsPL>' +
                DisputeList +
                '</sch:CreateDisputePL>' +
                '</soapenv:Body>' + soapEnvEnd;
            
            var servicePath = '/salikDisputesAndViolationService';
            var SOAPAction = 'CreateDisputePL';
            var requestObj = buildBody([request.toString()], true);

            return invokeWebServiceString(requestObj, servicePath, SOAPAction, isEncryptResponse, encryptionPassword);
        }
    } catch (e) {
        return e;
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
            parameters: [refNum.toString(), adapter.toString(), SOAPAction.toString(), request.toString()]
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
            parameters: [refNum.toString(), response.toString()]
        };
    }

    if (isDBLog)
        MFP.Server.invokeProcedure(invocationLog);

}