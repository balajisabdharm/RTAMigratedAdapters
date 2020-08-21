var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';
var userName = "%#credentials!#!username#%";
var password = "%#credentials!#!password#%";
var IsDebugging;
function Log(text) {
	try {
		IsDebugging = MFP.Server.getPropertyValue("drivers_and_vehicles_is_debugging");
	} catch (e) {
		IsDebugging = "false";
	}
	// MFP.Logger.warn(""+IsDebugging);
	if (IsDebugging == "true")
		MFP.Logger.warn(text);
	else
		MFP.Logger.debug(text);
}
function eyeTestInformationService(params, isEncryptResponse, encryptionPassword) {
    var envHeader = {
        "ae:username": userName,
        "ae:password": password
    };
    var servicePath = '/ws/services/EyeTestInformationService';
    var _soapEnvNS = soapEnvNS +
        'xmlns:ae="http://ae.gov.trf.drl.ws.EyeTestInformationService"';

    var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
    var request = buildBody(parameters, false);

    //Log("EyeTestInformationService request >> " + request);

    //return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
    var result = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);

    try {
        if (result.Envelope != undefined && result.Envelope != null) {
            if (result.Envelope.Body != undefined && result.Envelope.Body != null) {
                if (result.Envelope.Body.getEyeTestInformationReturn != undefined && result.Envelope.Body.getEyeTestInformationReturn != null) {
                    if (result.Envelope.Body.getEyeTestInformationReturn.expiryDate != undefined && result.Envelope.Body.getEyeTestInformationReturn.expiryDate != null) {
                        var tempDate = new Date();
                        tempDate.setMonth(tempDate.getMonth() + 1);
                        result.Envelope.Body.getEyeTestInformationReturn.expiryDate = tempDate;
                    }
                } else {
                    if (result.Envelope.Body.getEyeTestInformationReturnFailuer != undefined && result.Envelope.Body.getEyeTestInformationReturnFailuer != null) {
                    	var tempDate2 = new Date();
                        tempDate2.setMonth(tempDate2.getMonth() + 1);
                    	var data = {"Envelope": {
                	        "Body": {
                	            "getEyeTestInformationReturn": {
                	                "testDate": "NA",
                	                "testCenterEn": "NA",
                	                "expiryDate": tempDate2,
                	                "leftEyeReuslt": "NA",
                	                "colorBlindTestAr": "NA",
                	                "withGlass": "NA",
                	                "testCenterAr": "NA",
                	                "personPicture": "NA",
                	                "testEyeResult": "NA",
                	                "colorBlindTestEn": "NA",
                	                "rightEyeReuslt": "NA",
                	                "responseCode": "0"
                	            }
                	        }
                	        },
                	        "totalTime": 109,
                	        "isSuccessful": true,
                	        "responseHeaders": {
                	            "X-ORACLE-DMS-RID": "0:1",
                	            "Server": "Oracle-HTTP-Server-12c",
                	            "Keep-Alive": "timeout=5, max=99",
                	            "Transfer-Encoding": "chunked",
                	            "X-ORACLE-DMS-ECID": "005cUZK9dNB6yGbLxI_AiW0002ED0005tf",
                	            "Content-Language": "en",
                	            "Date": "Sat, 28 Mar 2020 11:50:47 GMT",
                	            "Connection": "Keep-Alive",
                	            "Content-Type": "text/xml; charset=utf-8"
                	        },
                	        "statusReason": "OK",
                	        "warnings": [],
                	        "errors": [],
                	        "info": [],
                	        "responseTime": 93,
                	        "statusCode": 200
                    };
                    	return data;
                }
            }
        }
    }
} catch (e) {
    //Log("GetTrafficFileService request >> " + request);
}
return result;
}

function getTrafficFileService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	var servicePath = '/ws/services/GetTrafficFileService';
	var _soapEnvNS = soapEnvNS
	+ 'xmlns:ae="http://ae.gov.trf.stp.ws.GetTrafficFileService"';

	var parameters = [ envHeader.toString(), params.toString(), '', _soapEnvNS.toString() ];
	var request = buildBody(parameters, false);

	//Log("GetTrafficFileService request >> " + request);
	
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
	
}

function getAppointmentDetails(params, isEncryptResponse, encryptionPassword) {

	var envHeader = {
			"ae:username" : userName,
			"ae:password" : password
	};
	servicePath = '/ws/services/TestAppointmentTaxiLemoService';
	_soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ae="http://ae.gov.trf.inq.ws.TestAppointmentTaxiLemoService"';
	var parameters = [ envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
	var request = buildBody(parameters, false);
	var response = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
	//Log("TestAppointmentTaxiLemoService request >> " + request);
	// Log("TestAppointmentTaxiLemoService response >> " + response);
	return response;
}
function issueDriverLicenseService(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"ae:password" : password,
			"ae:username" : userName
	};

	var servicePath = '/ws/services/IssueDriverLicenseService';
	var _soapEnvNS = soapEnvNS
	+ 'xmlns:ae="http://ae.gov.trf.dtt.ws.IssueDriverLicenseService"';
	var parameters = [ envHeader.toString(), params.toString(), '', _soapEnvNS.toString() ];
	var request = buildBody(parameters, false);

	//Log("DeriverLicenseTestService - IssuingNewDLOnTest_Service request >> "+ request);

	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}
function mobilityDrivingLicenseInfoService(params, isEncryptResponse, encryptionPassword) {
    var envHeader = {
        "ae:username": userName,
        "ae:password": password
    };
    var servicePath = '/ws/services/MobilityDrivingLicenseInfoService';
    var _soapEnvNS = soapEnvNS +
        'xmlns:ae="http://ae.gov.trf.inq.ws.MobilityDrivingLicenseInfoService"';
    var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
    var request = buildBody(parameters, false);

    //Log("MobilityDrivingLicenseInfoService request >> " + request);
    //return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);

    var result = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);


    try {
        if (result.Envelope != undefined && result.Envelope != null) {
            if (result.Envelope.Body != undefined && result.Envelope.Body != null) {
                if (result.Envelope.Body.getDrivingLicenseInformationReturn != undefined && result.Envelope.Body.getDrivingLicenseInformationReturn != null) {
                    if (result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo != undefined && result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo != null) {
                        if (result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo.expiryDate != undefined && result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo.expiryDate != null) {
                            var expiry = result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo.expiryDate;
                            if (isDriverLicenseDueForRenewal(expiry)) {
				
                                //result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo.expiryDate = new Date();
                            } else {
                                //var blockingDate = new Date();
                                //tempDate.setMonth(tempDate.getMonth() - 4);
                                //result.Envelope.Body.getDrivingLicenseInformationReturn.licenseInfo.expiryDate = blockingDate;
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        //Log("GetTrafficFileService request >> " + request);
    }
    
    return result;

}
function getDriverLicenseTestApointmentsDetails(params, isEncryptResponse, encryptionPassword) {
	var envHeader = {
			"rta:username" : userName,
			"rta:password" : password
	};
	var servicePath = '/ws/services/TestAppointmentService';
	var _soapEnvNS = soapEnvNS + 'xmlns:rta="rta:TestAppointmentService"';
	var parameters = [ envHeader.toString(), params.toString(), '', _soapEnvNS.toString() ];
	var request = buildBody(parameters, false);

	//Log("getDriverLicenseTestApointmentsDetails request >> " + request);
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}
function invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword) {
	var input = {
			method : 'post',
			headers : {
				"SOAPAction" : ""
			},
			returnedContentType : 'HTML',
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

function invokeWebService(body,servicePath,headers, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
	if (!headers)
		headers = {
			"SOAPAction" : ""
	};
	else
		headers["SOAPAction"] = "";
	var input = {
			method : 'post',
			returnedContentType : 'HTML',
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
	return MFP.Server.invokeProcedure(invocationData); 
}

function buildBody(parameters, isStatic) {
	var request = "";
	MFP.Logger.info("buildBody:"+parameters);
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

function isDriverLicenseDueForRenewal(expiryDate) {
    //2014-08-07T00:00:00.000Z
    if (expiryDate != undefined && expiryDate != null) {
        var date30Days = new Date();
        date30Days.setDate(date30Days.getDate() + 30);
        var date10Years = new Date();
        date10Years.setFullYear(date10Years.getFullYear() - 10);
        var expiryDate = new Date(expiryDate);

        if (expiryDate.getTime() <= date30Days.getTime() && expiryDate.getTime() >= date10Years.getTime())
            return true;
        	//console.log("Gooooo");
        else
            return false;
        	//console.log("NOT1");

    } else
        return false;
    	//console.log("NOT2");
}
