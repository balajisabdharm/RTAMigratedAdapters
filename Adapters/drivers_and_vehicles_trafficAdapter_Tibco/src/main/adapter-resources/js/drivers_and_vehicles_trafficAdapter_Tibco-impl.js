var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';
var userName = "%#credentials!#!username#%";
var password = "%#credentials!#!password#%";
var IsDebugging;
var adapterName = "drivers_and_vehicles_trafficAdapter_Tibco";
var username_traffic = "%#credentials!#!username_traffic#%";
var password_traffic = "%#credentials!#!password_traffic#%";
var externalUsername = "%#credentials!#!externalUsername#%";
var externalPassword = "%#credentials!#!externalPassword#%";

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

function savePhoto(params, isEncryptResponse, encryptionPassword) {

    var envHeader = {
        "urn:username": username_traffic,
        "urn:password": password_traffic
    };
    //var parameters = [params];
    var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:SaveAttachmentsService"';
    var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];

    var request = buildBody(parameters, false);

    request = request.replace(new RegExp("urn: ", 'g'), "urn:");

    /*	if(request == null || request == undefined )
    return {Body:"Failure"};
    else
    	return {Body : request};*/
    var servicePath = '/wstraffic/services/SaveAttachmentsService';
    var requestInput = {
        method: 'post',
        returnedContentType: 'xml',
        path: servicePath,
        headers: {
            "SOAPAction": 'impl'
        },
        body: {
            content: request,
            contentType: 'text/xml; charset=utf-8'
        }
    };
    /*if(requestInput == null || requestInput == undefined )
 		return {Body:"Failure"};
 		else
 			return {Body : requestInput};*/
    //	Log("!!! "+parameters.toString());
    //return {body:requestInput};
    var webServiceResult = MFP.Server.invokeHttp(requestInput);
    if (isEncryptResponse != undefined && isEncryptResponse == true) {
        var responseString = JSON.stringify(webServiceResult);
        var invocationData = {
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult]
    };
    return MFP.Server.invokeProcedure(invocationData);
}

function mappingPlateCodeId(id, plateSourceCode, plateCategoryDesc) {
    if (id && plateSourceCode && plateCategoryDesc) {
        switch (plateSourceCode) {
            case "AUH":
                switch (plateCategoryDesc) {
                    case "Classical":
                        var codes = {
                            "708": "1"
                        }
                        break;
                    case "DataMigration":
                        var codes = {
                            "112": "Customs"
                        }
                        break;
                    case "Hospitality":
                        var codes = {
                            "31": "Hospitality"

                        }
                        break;
                    case "Diplomat":
                        var codes = {
                            "29": "Diplomat"
                        }
                        break;
                    case "Export":
                        var codes = {
                            "680": "1",
                            "27": "Export"
                        }
                        break;
                    case "InternationalOrganization":
                        var codes = {
                            "30": "InternationalOrganization"
                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "712": "Motorcycle1",
                            "705": "Motorcycle4",
                            "19": "White",
                            "114": "Red"
                        }
                        break;
                    case "Police":
                        var codes = {
                            "681": "Blue"
                        }
                        break;
                    case "Private":
                        var codes = {
                            "699": "1",
                            "110": "10",
                            "135": "11",
                            "141": "12",
                            "169": "13",
                            "674": "14",
                            "679": "15",
                            "173": "16",
                            "693": "17",
                            "711": "2",
                            "137": "4",
                            "72": "5",
                            "696": "50",
                            "81": "6",
                            "138": "7",
                            "139": "8",
                            "140": "9",
                            "20": "Red",
                            "22": "Green",
                            "21": "Blue",
                            "23": "Gray"
                        };
                        break;
                    case "Probation":
                        var codes = {
                            "113": "Probation"
                        }
                        break;
                    case "Protocol":
                        var codes = {
                            "117": "Protocol"
                        }
                        break;
                    case "Public":
                        var codes = {
                            "116": "2"
                        }
                        break;
                    case "Learning":
                        var codes = {
                            "115": "Learning"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "25": "Green",
                            "142": "Green1"
                        }
                        break;
                    case "Taxi":
                        var codes = {
                            "94": "Yellow"
                        }
                        break;
                    case "Trade":
                        var codes = {
                            "26": "Trade",
                            "167": "TradeWhite"
                        }
                        break;
                    case "Consulate Authority": //TODO
                        var codes = {
                            "28": "7"
                        }
                        break;
                    case "Government": //TODO
                        var codes = {
                            "32": "11"
                        }
                        break;
                    case "Trailer": //TODO
                        var codes = {
                            "698": "19"
                        }
                        break;

                }
                break;

            case "SHJ":
                switch (plateCategoryDesc) {
                    case "Classic":
                        var codes = {
                            "119": "Classic"
                        }
                        break;
                    case "Export":
                        var codes = {
                            "171": "1",
                            "175": "2",
                            "704": "3",
                            "39": "Export"
                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "33": "Motorcycle",
                            "166": "ClassicMC"
                        }
                        break;
                    case "Police":
                        var codes = {
                            "118": "Police"
                        }
                        break;
                    case "Private":
                        var codes = {
                            "35": "1",
                            "89": "2",
                            "692": "3",
                            "34": "White",
                            "40": "Orange"
                        };
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "713": "PublicTransportation1",
                            "715": "PublicTransportation2",
                            "37": "Green"
                        }
                        break;
                    case "Trade":
                        var codes = {
                            "38": "1Trade"
                        }
                        break;
                }

                break;
            case "FUJ":
                switch (plateCategoryDesc) {
                    case "Export":
                        var codes = {
                            "60": "Export"
                        }
                        break;
                    case "Government":
                        var codes = {
                            "128": "Government"

                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "55": "Motorcycle"

                        }
                        break;
                    case "Private":
                        var codes = {
                            "56": "A",
                            "73": "B",
                            "85": "C",
                            "92": "D",
                            "111": "E",
                            "154": "F",
                            "163": "G",
                            "702": "I",
                            "164": "K",
                            "709": "L",
                            "149": "M",
                            "155": "P",
                            "156": "R",
                            "158": "S",
                            "157": "T",
                            "697": "V",
                            "706": "X",
                            "103": "White"
                        };
                        break;
                    case "UnderTest":
                        var codes = {
                            "59": "UnderTest"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "58": "Green"
                        }
                        break;
                }

                break;
            case "UMQ":
                switch (plateCategoryDesc) {
                    case "DrivingLearning":
                        var codes = {
                            "707": "Learning"
                        }
                        break;
                    case "Export":
                        var codes = {
                            "714": "Export1",
                            "54": "Export",

                        }
                        break;
                    case "Government":
                        var codes = {
                            "75": "Government",
                            "120": "Government"

                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "48": "Motorcycle"

                        }
                        break;
                    case "Private":
                        var codes = {
                            "49": "A",
                            "84": "B",
                            "673": "C",
                            "170": "D",
                            "695": "E",
                            "701": "F",
                            "108": "G",
                            "672": "H",
                            "172": "I",
                            "710": "J",
                            "145": "X",
                            "50": "White"
                        };
                        break;
                    case "UnderTest":
                        var codes = {
                            "53": "UnderTest"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "52": "Green"
                        }
                        break;
                }
                break;
            case "DXB":
                switch (plateCategoryDesc) {
                    case "Classical":
                        var codes = {
                            "148": "Classical"
                        }
                        break;
                    case "Consulate":
                        var codes = {
                            "12": "Consulate"

                        }
                        break;
                    case "DataMigration":
                        var codes = {
                            "18": "DataMigration"

                        }
                        break;
                    case "Hospitality":
                        var codes = {
                            "15": "Hospitality"

                        }
                        break;
                    case "DubaiFlag":
                        var codes = {
                            "152": "DubaiFlag"

                        }
                        break;
                    case "DubaiPolice":
                        var codes = {
                            "150": "DubaiPolice"

                        }
                        break;
                    case "1EXPO":
                        var codes = {
                            "663": "1EXPO"

                        }
                        break;
                    case "2EXPO":
                        var codes = {
                            "665": "2EXPO"

                        }
                        break;
                    case "3EXPO":
                        var codes = {
                            "667": "3EXPO"

                        }
                        break;
                    case "4EXPO":
                        var codes = {
                            "668": "4EXPO"

                        }
                        break;
                    case "5EXPO":
                        var codes = {
                            "669": "5EXPO"

                        }
                        break;
                    case "6EXPO":
                        var codes = {
                            "670": "6EXPO"

                        }
                        break;
                    case "7EXPO":
                        var codes = {
                            "671": "7EXPO"

                        }
                        break;
                    case "EntertainmentMotorcycle":
                        var codes = {
                            "107": "EntertainmentMotorcycle"

                        }
                        break;
                    case "Export":
                        var codes = {
                            "11": "Export",
                            "683": "Export2",
                            "684": "Export3",
                            "685": "Export4",
                            "686": "Export5",
                            "687": "Export6",
                            "688": "Export7",
                            "689": "Export8",
                            "690": "Export9"

                        }
                        break;
                    case "Government":
                        var codes = {
                            "16": "Government"

                        }
                        break;
                    case "Import":
                        var codes = {
                            "136": "Import"

                        }
                        break;
                    case "InternationalOrganization":
                        var codes = {
                            "14": "InternationalOrganization"

                        }
                        break;
                    case "Learning":
                        var codes = {
                            "147": "Learning"

                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "1": "Motorcycle",
                            "675": "Motorcycle2",
                            "676": "Motorcycle3",

                        }
                        break;
                    case "PoliticalAuthority":
                        var codes = {
                            "13": "PoliticalAssociation"

                        }
                        break;
                    case "Private":
                        var codes = {
                            "2": "A",
                            "3": "B",
                            "4": "C",
                            "5": "D",
                            "6": "E",
                            "7": "F",
                            "68": "G",
                            "70": "H",
                            "71": "I",
                            "78": "J",
                            "80": "K",
                            "74": "L",
                            "69": "M",
                            "95": "N",
                            "88": "O",
                            "96": "P",
                            "93": "Q",
                            "79": "R",
                            "87": "S",
                            "97": "T",
                            "98": "U",
                            "86": "V",
                            "99": "W",
                            "100": "X",
                            "102": "Y",
                            "101": "Z",
                            "109": "White",
                            "700": "AA"
                        };
                        break;
                    case "PrivateTransportation":
                        var codes = {
                            "17": "PrivateTransportation"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "9": "PublicTransportation",
                            "691": "PublicTransportation1",
                        }
                        break;
                    case "Taxi":
                        var codes = {
                            "8": "Taxi"
                        }
                        break;
                    case "Trade":
                        var codes = {
                            "10": "Trade"
                        }
                        break;
                    case "Trailer":
                        var codes = {
                            "146": "Trailer"
                        }
                        break;
                }


                break;
            case "RAK":
                switch (plateCategoryDesc) {
                    case "Ceremonies":
                        var codes = {
                            "168": "CeremoniesWhiteRed"
                        }
                        break;
                    case "Export":
                        var codes = {
                            "67": "Export"

                        }
                        break;
                    case "Government":
                        var codes = {
                            "76": "Government",
                            "129": "GovernmentWhite"

                        }
                        break;
                    case "DataMigration":
                        var codes = {
                            "124": "Hospitality",
                            "122": "HospitalityBlue",
                            "123": "HospitalityYellow",

                        }
                        break;
                    case "PrivateTransportation":
                        var codes = {
                            "121": "LocalGuard"

                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "61": "Motorcycle"

                        }
                        break;
                    case "Municipality":
                        var codes = {
                            "125": "Municipality"

                        }
                        break;
                    case "Police":
                        var codes = {
                            "153": "Police"

                        }
                        break;
                    case "Private":
                        var codes = {
                            "104": "A",
                            "174": "B",
                            "82": "C",
                            "105": "D",
                            "91": "I",
                            "161": "K",
                            "126": "M",
                            "151": "N",
                            "162": "S",
                            "106": "V",
                            "90": "Y",
                            "62": "White",
                            "63": "RAK-Tower"
                        };
                        break;
                    case "UnderTest":
                        var codes = {
                            "66": "UnderTest"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "65": "Green"
                        }
                        break;
                    case "Taxi":
                        var codes = {
                            "127": "WhiteGreen"
                        }
                        break;
                    case "Works":
                        var codes = {
                            "165": "Works"
                        }
                        break;
                    case "Commercial":
                        var codes = {
                            "694": "White"
                        }
                        break;
                }

                break;
            case "AJM":
                switch (plateCategoryDesc) {
                    case "Export":
                        var codes = {
                            "47": "Export"
                        }
                        break;
                    case "Motorcycle":
                        var codes = {
                            "41": "Motorcycle"

                        }
                        break;
                    case "Private":
                        var codes = {
                            "42": "A",
                            "43": "B",
                            "144": "C",
                            "176": "D",
                            "177": "E",
                            "703": "H"
                        };
                        break;
                    case "Probation":
                        var codes = {
                            "46": "Probation"
                        }
                        break;
                    case "PublicTransportation":
                        var codes = {
                            "45": "Green"
                        }
                        break;
                }


        }
        return codes[id];
    } else {
        return 0; //handle invalid or empty params
    }
}

function mappingLicenseSource(licenseSourceType) {
    var codes = {
        "1": "AUH",
        "3": "SHJ",
        "7": "FUJ",
        "5": "UMQ",
        "2": "DXB",
        "6": "RAK",
        "4": "AJM"
    }

    return codes[licenseSourceType];
}

function convertObiectToArray(Object) {
    if (Object != null && Object != undefined && !(Object instanceof Array)) {
        return [Object];
    }
    return Object;
}


var xsdStr_FI = "http://www.rta.ae/EIP/LAGeneralFinesInquiryService/LAGeneralFinesInquiryService_Schema";
function fixNameSpace_FI(response){
	MFP.Logger.info(" ================================================= REMOVING NAMESPACE =================================================");
	var newResponse = JSON.stringify(response);
	reg1 = new RegExp('"": "'+xsdStr+'",',"g");	
	reg2 = new RegExp('{"CDATA":',"g");
	reg3 = new RegExp('"},"',"g");
	reg4 = new RegExp('"":"'+xsdStr+'",',"g");
	reg5 = new RegExp('"":"'+xsdStr+'"',"g");
	
	
	newResponse = newResponse.replace(reg1,"").replace(reg2,"").replace(reg3,"\",\"").replace(reg4,"").replace(reg5,"");
	MFP.Logger.info("refined Response -->" + newResponse);
	
	try{
	
		return JSON.parse(newResponse);
	}catch(e){
		return response;
	}
}

function fineManagementService(params, isEncryptResponse, encryptionPassword) {
    try {
        var type = params["cli:getFines"]["cli:getFineRequestInfo"]["cli:searchingType"];
        // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | StartParsingRequest : " + new Date());
        // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | type : " + type);
        //MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | params : " + JSON.stringify(params, isEncryptResponse, encryptionPassword));
         //params["cli:getFines"]["cli:getFineRequestInfo"]["cli:appId"]
        //<lag:ticketStatus>1</lag:ticketStatus>
        var paramsRequest = {};
        switch (type) {

            case "1":
                paramsRequest = {
                    "lag:getFines": {
                        "lag:ticketStatus": "1",
                        "lag:getFinesByTrfNo": {
                            "lag:appId": "DNVAPP",
                            "lag:TrfNo": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:trafficFileNo"]
                            
                             
                            
                        } 
                    }
                };
                break;
            case "2":
                // adapter: drivers_and_vehicles_trafficAdapter_Tibco
                // procedure: fineManagementService
                // parameters: [{ "cli:getFines": { "cli:getFineRequestInfo": { "cli:plateCategoryDesc": "Private", "cli:plateCodeId": "95", "cli:plateNo": "64400", "cli:plateSource": "1", "cli:plateSourceCode": "DXB", "cli:retrieveAllTickets": "true", "cli:searchingType": "2" } } }, false, null]

                paramsRequest = {
                    "lag:getFines": {
                        "lag:ticketStatus": "1",
                        "lag:getFinesByPltNo": {
                            "lag:appId": "DNVAPP", //params["cli:getFines"]["cli:getFineRequestInfo"]["cli:appId"],
                            "lag:PlateNo": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateNo"],
                            "lag:PlateCode": mappingPlateCodeId(params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateCodeId"], params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateSourceCode"], params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateCategoryDesc"]),
                            "lag:PlateCategory": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateCategoryDesc"],
                            "lag:PlateSource": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:plateSourceCode"],
                        }
                    }
                };

                break;

            case "3":
                // [{"cli:getFines":{"cli:getFineRequestInfo":{"cli:licenseNo":"12345678","licenseSourceCode":"12345678","licenseSourceType":"1","cli:retrieveAllTickets":"true","cli:searchingType":"3"}}},false,null]
                // 	<lag:getFinesByLicNo>
                //     <lag:appId>?</lag:appId>
                //     <lag:LicenseNo>?</lag:LicenseNo>
                //     <lag:LicenseFrom>?</lag:LicenseFrom>
                //  </lag:getFinesByLicNo>


                paramsRequest = {
                    "lag:getFines": {
                        "lag:ticketStatus": "1",
                        "lag:getFinesByLicNo": {
                            "lag:appId": "DNVAPP", //params["cli:getFines"]["cli:getFineRequestInfo"]["cli:appId"],
                            "lag:LicenseNo": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:licenseNo"],
                            "lag:LicenseFrom": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:licenseSourceCode"]
                        }
                    }
                };

                break;

            case "4":


                // [{"cli:getFines":{"cli:getFineRequestInfo":{"cli:beneficiaryId":"3","ticketNo":"12345678","ticketYear":"1999","cli:retrieveAllTickets":"true","cli:searchingType":"4"}}},false,null]
                //{"cli:getFines":{"cli:getFineRequestInfo":{"cli:searchingType":"4","cli:ticketNo":"8038982004","cli:ticketYear":"2005","cli:beneficiaryId":"1","cli:retrieveAllTickets":true}}}

                // 		<lag:getFinesByTckNo>
                //     <lag:appId>?</lag:appId>
                //     <lag:TicketNo>?</lag:TicketNo>
                //     <lag:TicketYear>?</lag:TicketYear>
                //     <lag:ticketSource>
                //        <!--You have a CHOICE of the next 2 items at this level-->
                //        <lag:Code>?</lag:Code>
                //        <lag:Source>
                //           <lag:emirate>?</lag:emirate>
                //           <lag:localAuthority>?</lag:localAuthority>
                //        </lag:Source>
                //     </lag:ticketSource>
                //  </lag:getFinesByTckNo>

                paramsRequest = {
                    "lag:getFines": {
                        "lag:ticketStatus": "1",
                        "lag:getFinesByTckNo": {
                            "lag:appId": "DNVAPP", //params["cli:getFines"]["cli:getFineRequestInfo"]["cli:appId"],
                            "lag:TicketNo": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:ticketNo"],
                            "lag:TicketYear": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:ticketYear"],
                            "lag:ticketSource": {
                                "lag:Code": params["cli:getFines"]["cli:getFineRequestInfo"]["cli:beneficiaryId"]
                            }
                        }
                    }
                };
                break;

        }
        var envHeader = {
            "wsse:Password": password,
            "wsse:Username": userName
        };
        var servicePath = '/LAGeneralFinesInquiryService2';
        var SOAPAction = 'getFines';
        //xmlns:cli="http://client.ws.ffu.traffic.services.internet.ae"
        var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lag="http://www.rta.ae/EIP/LAGeneralFinesInquiryService/LAGeneralFinesInquiryService_Schema"';
        //MFP.Logger.info("PARAMS Request OBJECT ::::::: "+JSON.stringify(paramsRequest));
        
        var parameters = [envHeader, paramsRequest, '', _soapEnvNS];
        //envHeader, params, namespaces, soapEnvNS
	var request = buildBody2(envHeader, paramsRequest, '', _soapEnvNS);
        // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | Request : " + request + "at " + new Date());
        //return {"REQ" : request};
        //MFP.Logger.info("Got Body of Request >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+JSON.stringify(request));
        //Log("RetrieveFinesService request >> " + request);
        //var response = invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
        var response = _invokeWebServiceString(request, servicePath, SOAPAction, isEncryptResponse, encryptionPassword)
        
	response.Envelope.Body = fixNameSpace_FI(response.Envelope.Body);
	
	//return {"REQ" : request, "RES":response};
        // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | response : " + response + "at " + new Date());
        //get confisicatedVehicles
        //get confisicatedVehicles
        //get confisicatedVehicles
        var confisicatedVehicles;
        if (response.Envelope != undefined &&
            response.Envelope.Body != undefined &&
            response.Envelope.Body.getFinesReturn != undefined &&
            response.Envelope.Body.getFinesReturn.ImpoundingRequest != undefined &&
            response.Envelope.Body.getFinesReturn.ImpoundingRequest.activeImpoundingrequests != undefined) {
            confisicatedVehicles = response.Envelope.Body.getFinesReturn.ImpoundingRequest.activeImpoundingrequests;
        }
        //get normal fines 
        //get normal fines 
        //get normal fines 
        if (response.Envelope != undefined &&
            response.Envelope.Body != undefined &&
            response.Envelope.Body.getFinesReturn != undefined &&
            response.Envelope.Body.getFinesReturn.beneficiaries != undefined) {
            var allFines = response.Envelope.Body.getFinesReturn.beneficiaries.Beneficiary;
            var numberOfTickets = 0;
            var allFinesTotal = 0;
            var trfNo;
            var tickets = [];
            var circularTickets = [];
            var otherTickets = [];

            allFines = convertObiectToArray(allFines);
            if (allFines && allFines.length && allFines.length > 0) {
                for (var i = 0; i < allFines.length; i++) {
                    var fine = allFines[i].tickets.Ticket;
                    numberOfTickets = numberOfTickets + parseFloat(allFines[i].NoOfTickets);
                    trfNo = (allFines[i].trafficNo) ? allFines[i].trafficNo : null; //trafficNo//trafficFileId
                    if (!(fine instanceof Array)) {
                        fine = [fine];
                    }

                    for (var j = 0; j < fine.length; j++) {
                        var item = fine[j];
                        var ticket = {};
                        allFinesTotal = allFinesTotal + parseFloat(item.TicketFine);
                        ticket = {
                            "plateCategoryDescE": item.PlateCategoryDescEn,
                            "plateSourceDescE": item.PlateSource.city,
                            "ticketTimeInHoursFormat": item.TicketTime,
                            "ticketTypeDescA": item.ticketType,
                            "ticketTypeDescE": item.ticketType,
                            "ticketPlateCategoryCode": item.PlateCategoryCFICode,
                            "bookletHeldStatusDescA": item.bookletHeldStatusDescA,
                            "locationDescriptionE": allFines[i].FineSource,
                            "locationDescriptionA": allFines[i].FineSourceAr,
                            "bookletHeldStatusDescE": item.bookletHeldStatusDescE,
                            "ticketStatus": item.ticketStatus,
                            "ticketTimeInHoursFormat12": item.TicketTime,
                            "idRadar": item.isRadar,
                            "creationDate": item.creationDate,
                            "locationId": item.LocationCode,
                            "isPayableDescA": (item.IsPayable == "2") ? "نعم" : "لا",
                            "isPayableDescE": (item.IsPayable == "2") ? "YES" : "NO",
                            "isBlackPointsDeleted": item.isBlackPointsDeleted,
                            "ticketId": item.TicketId,
                            "ticketDateTime": item.TicketDate + " " + item.TicketTime,
                            "beneficiaryDescriptionA": allFines[i].FineSourceAr,
                            "bookletId": item.bookletId,
                            "beneficiaryDescriptionE": allFines[i].FineSource,
                            "emiCode": item.PlateFrom,
                            "centerId": item.centerId,
                            "plateSource": item.PlateFrom,
                            "hasRadarPicture": item.hasRadarPicture,
                            "emirateCodePlateFrom": item.PlateFrom,
                            "ticketStatusDescA": item.ticketStatusDescA,
                            "ticketViolationsDescA": item.ticketViolationDesA,
                            "ticketViolationsDescE": item.ticketViolationDesE,
                            "ticketStatusDescE": item.ticketStatusDescE,
                            "hasUnpayableRegulation": item.hasUnpayableRegulation,
                            "ticketDate": item.TicketDate,
                            "plateCategoryEmirateCode": item.PlateFrom,
                            "plateDescE": item.PlateNo + " " + item.PlateCodeDescriptionEn + " " + item.PlateCategoryDescEn,
                            "plateDescA": item.PlateNo + " " + item.PlateCodeDescriptionAr + " " + item.PlateCategoryDescAr,
                            "presentLicenseBlackPoints": item.presentLicenseBlackPoints,
                            "ticketHeldStatusDescA": item.ticketHeldStatusDescA,
                            "ticketHeldStatusDescE": item.ticketHeldStatusDescE,
                            "createdBy": item.createdBy,
                            "plateColorDescE": item.PlateCodeDescriptionEn,
                            "plateColorDescA": item.PlateCodeDescriptionAr,
                            "penaltyFine": item.PenaltyFine,
                            "plateCategoryDesc": item.PlateCategoryDescAr,
                            "ticketType": item.ticketType,
                            "hasTicketPaper": item.hasTicketPaper,
                            "ticketFine": item.ticketAmount,
                            "offenseBlackPionts": item.offenseBlackPionts,
                            "ticketNo": item.TicketNo,
                            "isLicenceNotPresented": item.isLicenceNotPresented,
                            "ticketTotalFine": item.ticketAmount,
                            "plateNo": item.PlateNo,
                            "isPayable": item.IsPayable,
                            "licenceHeldStatusDescA": item.licenceHeldStatusDescA,
                            "ticketTime24": item.TicketTime,
                            "vehicleSpeed": item.VehicleSpeed,
                            "licenceHeldStatusDescE": item.licenceHeldStatusDescE,
                            "plateSourceDescA": (item.PlateSource.emirate && item.PlateSource.emirate.descriptionAr) ? item.PlateSource.emirate.descriptionAr : "",
                            "plateSourceDescE": (item.PlateSource.emirate && item.PlateSource.emirate.descriptionEn) ? item.PlateSource.emirate.descriptionEn : "",
                            "beneficiaryId": (allFines[i].Code) ? allFines[i].Code : "",
                            "KnowledgeFee": item.KnowledgeFee,
                            "mustPresentLicenseViolation": item.mustPresentLicenseViolation,
                            "ticketLicenseNo": item.LicenseNo


                        }

                        switch (item.ticketCategory) {
                            case "1": //Dubai
                            case "3": //Other	
                                tickets.push(ticket);
                                break;
                            case "2": //Circular
                                circularTickets.push(ticket);
                                break;
                                //case "3": //Other
                                //    otherTickets.push(ticket);
                                //    break;
                        }
                    }

                }
                if (trfNo == null) { //No traffic file number 
                    var result = {
                        "Envelope": {
                            "Body": {
                                "getFineResponse": {
                                    "getFineDetails": {
                                        "confisicatedVehicles": (confisicatedVehicles) ? {
                                            "confisicatedVehicle": confisicatedVehicles
                                        } : null,
                                        "totalTicketsNo": numberOfTickets,
                                        "totalFine": allFinesTotal,
                                        "tickets": {
                                            "ticket": (tickets) ? tickets : null
                                        },
                                        "circularTickets": {
                                            "circularTicket": (circularTickets) ? circularTickets : null,
                                        },
                                        "otherTickets": {
                                            "otherTicket": (otherTickets) ? otherTickets : null,
                                        }

                                    }
                                }
                            }
                        },
                        "statusReason": "OK",
                        "warnings": [],
                        "errors": [],
                        "info": [],
                        "responseTime": "",
                        "statusCode": 200
                    };
                } else { //has traffic file number 
                    var result = {
                        "Envelope": {
                            "Body": {
                                "getFineResponse": {
                                    "getFineDetails": {
                                        "ownerInfo": {
                                            "ownerTrafficFileNo": trfNo
                                        },
                                        "confisicatedVehicles": (confisicatedVehicles) ? {
                                            "confisicatedVehicle": confisicatedVehicles
                                        } : null,
                                        "totalTicketsNo": numberOfTickets,
                                        "totalFine": allFinesTotal,
                                        "tickets": {
                                            "ticket": (tickets) ? tickets : null
                                        },
                                        "circularTickets": {
                                            "circularTicket": (circularTickets) ? circularTickets : null,
                                        },
                                        "otherTickets": {
                                            "otherTicket": (otherTickets) ? otherTickets : null,
                                        }

                                    }
                                }
                            }
                        },
                        "statusReason": "OK",
                        "warnings": [],
                        "errors": [],
                        "info": [],
                        "responseTime": "",
                        "statusCode": 200
                    }
                }

                // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | resultAfterParsing : " + JSON.stringify(result) + "at " + new Date());


            } else {
                var result = {
                    "Envelope": {
                        "Body": {
                            "getFineResponse": {
                                "getFineDetails": {
                                    "errorResponse": {
                                        "responseMessageAr": response.Envelope.Body.getFinesReturn.responseType.responseDescAr,
                                        "responseMessageEn": response.Envelope.Body.getFinesReturn.responseType.responseDescEn
                                    },
                                    "responseCode": response.Envelope.Body.getFinesReturn.responseType.responseCode,


                                }
                            }
                        }
                    },
                    "statusReason": "OK",
                    "warnings": [],
                    "errors": [],
                    "info": [],
                    "responseTime": "",
                    "statusCode": 200
                }
            }
            // response.Envelope.Body.getFinesReturn
            return result;
        }
        /*if(response.Envelope != undefined && response.Envelope.Body != undefined && response.Envelope.Body.getFineResponse != undefined && response.Envelope.Body.getFineResponse != null &&
        	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo != undefined && 
        	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo != null	){
        	
        
        response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerPassportNo="";
        response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerMobileNumber="";
        response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerNameAr="";
        response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerNameEn="";
        }*/
        // MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter_Tibco |fineManagementService | resultAfterParsing : " + JSON.stringify(response) + "at " + new Date());
        return response;
    } catch (e) {
        //return {"":e};
        var result = {
            "Envelope": {
                "Body": {
                    "getFineResponse": {
                        "getFineDetails": {
                            "errorResponse": {
                                "responseMessageAr": isEmpty(e) ? e : JSON.stringify(e),
                                "responseMessageEn": isEmpty(e) ? e : JSON.stringify(e)
                            },
                            "responseCode": "-1"

                        }
                    }
                }
            },
            "statusReason": "OK",
            "warnings": [],
            "errors": [],
            "info": [],
            "responseTime": "",
            "statusCode": 200
        }

        return result;
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function FFULookupInfoService(params, isEncryptResponse, encryptionPassword) {
    var envHeader = {
        "ae:authenticationHeader": {
            "ae:externalUsername": externalUsername,
            "ae:externalUserPassword": externalPassword,
            "ae:username": username_traffic,
            "ae:password": password_traffic
        }
    };
    var servicePath = '/wstraffic/services/FFULookupInfoService';
    var _soapEnvNS = soapEnvNS + 'xmlns:ae="http://ae:client.ws.ffu.traffic.services.internet.ae"';
    var parameters = [envHeader.toString(), params.toString(), '', _soapEnvNS.toString()];
    var request = buildBody(parameters, false);

    //Log("FFULookupInfoService request >> " + request);
    return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function SeasonalCardService(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
    var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' + 'xmlns:ws="http://ws.pss.rta.ae"';
    var parameters = [envHeader.toString(), params.toString(), "", _soapEnvNS.toString()];
    var request = buildBody(parameters, false);
    //Log("request to be sent:\n"+request);
    var servicePath = '/wstraffic/services/SeasonalCardService';
    return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function SeasonalParkingPermitTransaction(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
    var isValid = true;
    var violations = "";
    var cardsData = {};
    try {
        var envHeadersPSS = {
            "password": params.password,
            "username": params.username,

        };

        var soapEnvNSPSS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' + 'xmlns:ws="http://ws.pss.rta.ae"';
        cardsData = params["cardsData"];
        invocationData = {
            adapter: 'drivers_and_vehicles_PermitAdapter',
            procedure: 'getSeasonalApplicationIdByTransactionId',
            parameters: [params.toString()]
        };
        var getApplicationIdResult = MFP.Server.invokeProcedure(invocationData);

        var applicationId = getApplicationIdResult.Envelope.Body.SeasonalApplicationIdByTransactionIdResponse.seasonalApplicationId;
        //Log(applicationId);		
        for (var i = 1; i <= 3; i++) {
            if (cardsData["card-" + i] != null) {
                var singleCardData = cardsData["card-" + i];
                /*				if(singleCardData.lot.duration != "90-d")
                {
                	var violations = "<violation>"
                						+"<description-ar><![CDATA[لا يمكن إصدار بطاقات موسمية إلا  لمدة ثلاثة أشهر فقط.]]></description-ar>"
                						+"<description-en><![CDATA[Seasonal cards can be issued for only 3 months duration.]]></description-en>"
                					+"</violation>"
                	return {valid : false , violations : violations, updatedCardsData: cardsData};
                }*/
                // create card request
                //Log("inside card");
                var splittedIsuueDate = singleCardData.issueDate.split("/");
                var day = splittedIsuueDate[0];
                var month = splittedIsuueDate[1];
                var year = splittedIsuueDate[2];
                var issueDateObj = new Date(month + "/" + day + "/" + year);

                var cardRequestCData = "<![CDATA[" +
                    "<addCard>" +
                    "<username>" + params.username + "</username>" +
                    "<trafficId>" + singleCardData.trafficFileId + "</trafficId>" +
                    "<applicationId>" + applicationId + "</applicationId>" +
                    "<cardPeriod>" + singleCardData.lot.periodCode + "</cardPeriod>" +
                    "<cardType>" + singleCardData.lot.typeCode + "</cardType>" +
                    "<activationDate>" + issueDateObj.toISOString() + "</activationDate>" +
                    "</addCard>" +
                    "]]>";
                //Log(cardRequestCData);
                serviceParams = {
                    "ws:addCard": {
                        "request": cardRequestCData
                    }
                };
                var parameters = [envHeadersPSS.toString(), serviceParams.toString(), "", soapEnvNSPSS.toString()];
                var request = buildBody(parameters, false);
                //Log("add card request to be sent:\n"+request);
                var servicePath = '/wstraffic/services/SeasonalCardService';
                var addCardResult = invokeWebService(request, servicePath);

                var addCardResultCData = addCardResult.Envelope.Body.addCardResponse.addCardReturn.CDATA;
                var statusStartPos = addCardResultCData.indexOf("<status>") + 8;
                var statusEndPos = addCardResultCData.indexOf("</status>");
                var status = addCardResultCData.substring(statusStartPos, statusEndPos);
                //Log("card status = "+status);
                if (status == "Success") {
                    var cardIdStartPos = addCardResultCData.indexOf("<cardId>") + 8;
                    var cardIdEndPos = addCardResultCData.indexOf("</cardId>");
                    var cardId = addCardResultCData.substring(cardIdStartPos, cardIdEndPos);
                    cardsData["card-" + i].cardId = cardId;
                    for (var j = 0; j < singleCardData.vehiclesPlates.length; j++) {
                        var vehiclePlateData = singleCardData.vehiclesPlates[j];
                        var oldCardNumber = "";
                        if (vehiclePlateData.oldCardNumber != null) {
                            oldCardNumber = vehiclePlateData.oldCardNumber;
                        }
                        //add vehicle to card
                        //Log("adding vehicle");
                        var vehicleRequestCData = "<![CDATA[" +
                            "<addVehicle>" +
                            "<username>" + params.username + "</username>" +
                            "<cardId>" + cardId + "</cardId>" +
                            "<plateSource>" + vehiclePlateData.emirate + "</plateSource>" +
                            "<plateCategoryCode>" + vehiclePlateData.plateCategoryId + "</plateCategoryCode>" +
                            "<plateNo>" + vehiclePlateData.plateNo + "</plateNo>" +
                            "<CFIPlateCode>" + vehiclePlateData.plateCode + "</CFIPlateCode>" +
                            "<plateCodeId>" + vehiclePlateData.plateCodeId + "</plateCodeId>" +
                            "<oldCardNumber>" +
                            oldCardNumber +
                            "</oldCardNumber>" +
                            "</addVehicle>" +
                            "]]>";
                        serviceParams = {
                            "ws:addVehicle": {
                                "request": vehicleRequestCData
                            }
                        };
                        parameters = [envHeadersPSS.toString(), serviceParams.toString(), "", soapEnvNSPSS.toString()];
                        request = buildBody(parameters, false);
                        //Log("request to be sent:\n"+request);
                        servicePath = '/wstraffic/services/SeasonalCardService';
                        var addVehicleResult = invokeWebService(request, servicePath);
                        var addVehicleResultCData = addVehicleResult.Envelope.Body.addVehicleResponse.addVehicleReturn.CDATA;
                        var statusStartPos = addVehicleResultCData.indexOf("<status>") + 8;
                        var statusEndPos = addVehicleResultCData.indexOf("</status>");
                        var status = addVehicleResultCData.substring(statusStartPos, statusEndPos);
                        //Log("vehicle status = "+status);
                        if (status != "Success") {
                            var violationsStartPos = addVehicleResultCData.indexOf("<violations>") + 12;
                            var violationsEndPos = addVehicleResultCData.indexOf("</violations>");
                            var violations = addVehicleResultCData.substring(violationsStartPos, violationsEndPos);
                            isValid = false;
                            break;
                        }
                    }
                } else {
                    //MFP.Logger.error(addCardResultCData);
                    var violationsStartPos = addCardResultCData.indexOf("<violations>") + 12;
                    var violationsEndPos = addCardResultCData.indexOf("</violations>");
                    var violations = addCardResultCData.substring(violationsStartPos, violationsEndPos);
                    isValid = false;
                    break;
                }
            }
        }
    } catch (e) {
        //MFP.Logger.error(e);
        isValid = false;
    }
    var responseReturned = {
        valid: isValid,
        violations: violations,
        updatedCardsData: cardsData
    };
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [responseReturned]
    };
    return MFP.Server.invokeProcedure(invocationData);
}

function SeasonalParkingPermitTransaction_DD(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
    var isValid = true;
    var violations = "";
    var cardsData = {};
    var response = '',
        cardData = {};
    try {
        var envHeadersPSS = {
            "password": params.password,
            "username": params.username,

        };

        var soapEnvNSPSS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' + 'xmlns:ws="http://ws.pss.rta.ae"';
        cardsData = params["cardsInfo"]["cardsData"];
        cardsTransactionInfo = params["cardsInfo"]["transactionInfo"];
        invocationData = {
            adapter: 'drivers_and_vehicles_PermitAdapter',
            procedure: 'getSeasonalApplicationIdByTransactionId_DD',
            parameters: [params]
        };
        var getApplicationIdResult = MFP.Server.invokeProcedure(invocationData);

        var applicationId = getApplicationIdResult.Envelope.Body.SeasonalApplicationIdByTransactionIdResponse.seasonalApplicationId;
        //Log(applicationId);
        var cardsLength = cardsData.length,
            i = 0;
        for (var i; i <= cardsLength; i++) {
            if (cardsData[i] != null) {
                var singleCardData = cardsData[i];
                /*				if(singleCardData.lot.duration != "90-d")
                {
                	var violations = "<violation>"
                						+"<description-ar><![CDATA[لا يمكن إصدار بطاقات موسمية إلا  لمدة ثلاثة أشهر فقط.]]></description-ar>"
                						+"<description-en><![CDATA[Seasonal cards can be issued for only 3 months duration.]]></description-en>"
                					+"</violation>"
                	return {valid : false , violations : violations, updatedCardsData: cardsData};
                }*/
                // create card request
                //Log("inside card");

                var trafficFileId = singleCardData.plates[0].trafficFileId;
                if (trafficFileId == undefined || trafficFileId == null || trafficFileId == '') {
                    trafficFileId = cardsTransactionInfo.trafficFileNo;
                }
                var cardRequestCData = "<![CDATA[" +
                    "<addCard>" +
                    "<username>" + params.username + "</username>" +
                    "<trafficId>" + trafficFileId + "</trafficId>" +
                    "<applicationId>" + applicationId + "</applicationId>" +
                    "<cardPeriod>" + singleCardData.lot.periodCode + "</cardPeriod>" +
                    "<cardType>" + singleCardData.lot.typeCode + "</cardType>" +
                    "<activationDate>" + singleCardData.issueDate + "</activationDate>" +
                    //"<activationDate>"+new Date(singleCardData.issueDate).toISOString()+"</activationDate>"+
                    "</addCard>" +
                    "]]>";
                cardData = params;
                //Log(cardRequestCData);
                serviceParams = {
                    "ws:addCard": {
                        "request": cardRequestCData
                    }
                };
                var currentDate = new Date();
                if (new Date(singleCardData.issueDate) > currentDate) {
                    var parameters = [envHeadersPSS.toString(), serviceParams.toString(), "", soapEnvNSPSS.toString()];
                    var request = buildBody(parameters, false);
                    //Log("add card request to be sent:\n"+request);
                    var servicePath = '/wstraffic/services/SeasonalCardService';
                    var addCardResult = invokeWebService(request, servicePath);

                    var addCardResultCData = addCardResult.Envelope.Body.addCardResponse.addCardReturn.CDATA;
                    var statusStartPos = addCardResultCData.indexOf("<status>") + 8;
                    var statusEndPos = addCardResultCData.indexOf("</status>");
                    var status = addCardResultCData.substring(statusStartPos, statusEndPos);
                    //Log("card status = "+status);
                    if (status == "Success") {
                        var cardIdStartPos = addCardResultCData.indexOf("<cardId>") + 8;
                        var cardIdEndPos = addCardResultCData.indexOf("</cardId>");
                        var cardId = addCardResultCData.substring(cardIdStartPos, cardIdEndPos);
                        singleCardData.cardId = cardId;
                        for (var j = 0; j < singleCardData.plates.length; j++) {
                            var vehiclePlateData = singleCardData.plates[j];
                            var oldCardNumber = "";
                            if (vehiclePlateData.oldCardNumber != null) {
                                oldCardNumber = vehiclePlateData.oldCardNumber;
                            }
                            //add vehicle to card
                            //Log("adding vehicle");
                            var vehicleRequestCData = "<![CDATA[" +
                                "<addVehicle>" +
                                "<username>" + params.username + "</username>" +
                                "<cardId>" + cardId + "</cardId>" +
                                "<plateSource>" + vehiclePlateData.plateSource + "</plateSource>" +
                                "<plateCategoryCode>" + vehiclePlateData.plateCategoryId + "</plateCategoryCode>" +
                                "<plateNo>" + vehiclePlateData.plateNo + "</plateNo>" +
                                "<CFIPlateCode>" + vehiclePlateData.plateCFICode + "</CFIPlateCode>" +
                                "<plateCodeId>" + vehiclePlateData.plateCodeId + "</plateCodeId>" +
                                "<oldCardNumber>" +
                                oldCardNumber +
                                "</oldCardNumber>" +
                                "</addVehicle>" +
                                "]]>";
                            serviceParams = {
                                "ws:addVehicle": {
                                    "request": vehicleRequestCData
                                }
                            };
                            parameters = [envHeadersPSS.toString(), serviceParams.toString(), "", soapEnvNSPSS.toString()];
                            request = buildBody(parameters, false);
                            //Log("request to be sent:\n"+request);
                            servicePath = '/wstraffic/services/SeasonalCardService';
                            var addVehicleResult = invokeWebService(request, servicePath);
                            serviceParams = addVehicleResult;
                            var addVehicleResultCData = addVehicleResult.Envelope.Body.addVehicleResponse.addVehicleReturn.CDATA;
                            var statusStartPos = addVehicleResultCData.indexOf("<status>") + 8;
                            var statusEndPos = addVehicleResultCData.indexOf("</status>");
                            var status = addVehicleResultCData.substring(statusStartPos, statusEndPos);
                            //Log("vehicle status = "+status);
                            if (status != "Success") {
                                response = {
                                    'result': addVehicleResultCData,
                                    'method': 'addVehicle'
                                };
                                var violationsStartPos = addVehicleResultCData.indexOf("<violations>") + 12;
                                var violationsEndPos = addVehicleResultCData.indexOf("</violations>");
                                var violations = addVehicleResultCData.substring(violationsStartPos, violationsEndPos);
                                if (violations.indexOf("This vehicle already exists") > -1) {
                                    var startEnglishInput = violations.indexOf("This vehicle already exists") + 27;
                                    var vehicleAdded = " " + vehiclePlateData.plateNo + " " + vehiclePlateData.plateCFICode + " ";
                                    var output = [violations.slice(0, startEnglishInput), vehicleAdded, violations.slice(startEnglishInput)].join('');
                                    var startArabicInput = output.indexOf("توجد بطاقة مواقف فعالة لهذه المركبة") + 35;
                                    output = [output.slice(0, startArabicInput), vehicleAdded, output.slice(startArabicInput)].join('')
                                    violations = output;
                                } else if (violations.indexOf("Only light vehicles can be added to a seasonal card") > -1) {
                                    var startEnglishInput = violations.indexOf("Only light vehicles can be added to a seasonal card") + 51;
                                    var vehicleAdded = "  please change vehicle " + vehiclePlateData.plateNo + " " + vehiclePlateData.plateCFICode + " ";
                                    var output = [violations.slice(0, startEnglishInput), vehicleAdded, violations.slice(startEnglishInput)].join('');
                                    var startArabicInput = output.indexOf("لا يمكن إصدار بطاقة موسمية لمركبة غير خفيفة") + 43;
                                    vehicleAdded = "  قم بتغيير المركبة " + vehiclePlateData.plateNo + " " + vehiclePlateData.plateCFICode + " ";
                                    output = [output.slice(0, startArabicInput), vehicleAdded, output.slice(startArabicInput)].join('')
                                    violations = output;
                                }
                                isValid = false;
                                break;
                            }
                        }
                    } else {
                        response = {
                            'result': addCardResultCData,
                            'method': 'addCard'
                        };
                        //MFP.Logger.error(addCardResultCData);
                        var violationsStartPos = addCardResultCData.indexOf("<violations>") + 12;
                        var violationsEndPos = addCardResultCData.indexOf("</violations>");
                        var violations = addCardResultCData.substring(violationsStartPos, violationsEndPos);
                        isValid = false;
                        break;
                    }
                } else {
                    var issueDateFailedResponse = "<?xml version='1.0' encoding='utf-8'?><addVehicleResponse><vehicle-info><status>Failed</status><violations><violation><description-ar><![CDATA[عذرا، تاريخ تفعيل التصريح منتهى برجاء إختيار تاريخ تفعيل صالح ]]></description-ar><description-en><![CDATA[The Permit activatation date is expired , please choose a valid activation date]]></description-en></violation></violations></vehicle-info></addVehicleResponse>"
                    var dates = {
                        issuedDate: singleCardData.issueDate,
                        currentDate: currentDate
                    }
                    response = {
                        'result': issueDateFailedResponse,
                        'method': dates
                    };
                    //MFP.Logger.error(addCardResultCData);
                    var violationsStartPos = issueDateFailedResponse.indexOf("<violations>") + 12;
                    var violationsEndPos = issueDateFailedResponse.indexOf("</violations>");
                    var violations = issueDateFailedResponse.substring(violationsStartPos, violationsEndPos);
                    isValid = false;
                    break;
                }
            }
        }
    } catch (e) {
        response = e.message;
        //MFP.Logger.error(e);
        isValid = false;
    }
    var responseReturned = {
        valid: isValid,
        violations: violations,
        updatedCardsData: cardsData,
        response: response,
        serviceParams: serviceParams
    };
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [responseReturned.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);
}

function TransactionServiceService_operation(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
    var result;
    // Pass xml request in case of getAvailableDelivery operation, because of parameters order.
    if (params["ws:getAvailableDelivery"] != undefined) {
        var requestString = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" >' +
            '<soapenv:Header>' +
            '<username>' + username_traffic + '</username>' +
            '<password>' + password_traffic + '</password>' +
            '<externalUserPassword>' + externalPassword + '</externalUserPassword>' +
            '<externalUsername>' + externalUsername + '</externalUsername>' +
            '</soapenv:Header>' +
            '<soapenv:Body>' +
            '<ws:getAvailableDelivery xmlns:ws="http://ws.trs.rta.ae">' +
            '<transactionId>' + params["ws:getAvailableDelivery"].transactionId + '</transactionId>' +
            '<centerCode>' + params["ws:getAvailableDelivery"].centerCode + '</centerCode>' +
            '</ws:getAvailableDelivery>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
        var servicePath = '/wstraffic/services/TransactionService';
        var parameters = [requestString.toString()];
        var request = buildBody(parameters, true);
        result = invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword);
        try {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
        } catch (e) {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :" + e);
        }
    } else
    if (params["ws:payAsPostponed"] != undefined) {
        var requestString =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://traffic2/traffic/services/TransactionService" xmlns:ws="http://ws.trs.rta.ae">' +
            '<soapenv:Header>' +
            '<tran:externalUserPassword>' + externalPassword + '</tran:externalUserPassword>' +
            '<tran:externalUsername>' + externalUsername + '</tran:externalUsername>' +
            '<tran:password>' + password_traffic + '</tran:password>' +
            '<tran:username>' + username_traffic + '</tran:username>' +
            '</soapenv:Header>' +
            '<soapenv:Body>' +
            '<ws:payAsPostponed>' +
            '<transactionId>' + params["ws:payAsPostponed"].transactionId + '</transactionId>' +
            '<username>' + params["ws:payAsPostponed"].username + '</username>' +
            '</ws:payAsPostponed>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
        var servicePath = '/wstraffic/services/TransactionService';
        var parameters = [requestString.toString()];
        var request = buildBody(parameters, true);
        result = invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword);
        try {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
        } catch (e) {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :" + e);
        }
    } else {
        var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';

        var parameters = [envHeader.toString(), params.toString(), 'xmlns:ws="http://ws.trs.rta.ae"', soapEnvNS.toString()];
        var request = buildBody(parameters, false);

        //MFP.Logger.debug("request to be sent:\n"+request);
        servicePath = '/wstraffic/services/TransactionService';
        result = invokeWebService(request, servicePath, httpHeaders, isEncryptResponse, encryptionPassword);
        try {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
        } catch (e) {
            MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :" + e);
        }
    }

    if (result.Envelope.Body != undefined &&
        result.Envelope.Body != null &&
        result.Envelope.Body.setAvailableDeliveryResponse != undefined &&
        result.Envelope.Body.setAvailableDeliveryResponse != null) {
        result.Envelope.requestString = "";
        if (result.requestString != undefined && result.requestString != null) {
            result.requestString = "";
        }
    }
    return result;
}

function TransactionServiceService_operationStringRequest(request, isEncryptResponse, encryptionPassword) {
    //MFP.Logger.debug("request to be sent:\n"+request);

    var parameters = [request.toString()];
    var request = buildBody(parameters, true);
    if (request.indexOf("<createTransaction><setviceCode>124</setviceCode>") > 0)
        request = request.replace("<parameters>", "<parameters><parameter><name>permitPeriod</name><value>3</value></parameter>");

    servicePath = '/wstraffic/services/TransactionService';
    var result = invokeWebServiceString(request, servicePath);
    try {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
    } catch (e) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :" + e);
    }
    //var response = recertifySeasonalParkingServices(request,result, isEncryptResponse, encryptionPassword);


    return result;
}

function createTransaction(innerXml, isEncryptResponse, encryptionPassword) {

    var res = "<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
        " xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' " +
        " xmlns:ws='http://ws.trs.rta.ae'>" +
        "<soapenv:Header>" +
        "<externalUserPassword>" + externalPassword + "</externalUserPassword>" +
        "<externalUsername>" + externalUsername + "</externalUsername>" +
        "<password>" + password_traffic + "</password>" +
        "<username>" + username_traffic + "</username>" +
        "</soapenv:Header>" +
        "<soapenv:Body>" +
        "<ws:createTransaction>" +
        "<request>" + innerXml + "</request>" +
        "</ws:createTransaction>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";

    var servicePath = '/wstraffic/services/TransactionService';
    var parameters = [res.toString()];
    var request = buildBody(parameters, true);
    var result = invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword);

    try {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | create Transaction | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
    } catch (e) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | create Transaction | Exception :" + e);
    }

    return result;
}

function cancelTransaction(transactionId, cancelationReason, isEncryptResponse, encryptionPassword) {

    var res =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://traffic2/traffic/services/TransactionService" xmlns:ws="http://ws.trs.rta.ae">' +
        '<soapenv:Header>' +
        '<tran:externalUserPassword>' + externalPassword + '</tran:externalUserPassword>' +
        '<tran:externalUsername>' + externalUsername + '</tran:externalUsername>' +
        '<tran:password>' + password_traffic + '</tran:password>' +
        '<tran:username>' + username_traffic + '</tran:username>' +
        '</soapenv:Header>' +
        '<soapenv:Body>' +
        '<ws:cancelTransaction>' +
        '<transactionId>' + transactionId + '</transactionId>' +
        '<username>' + username_traffic + '</username>' +
        '<cancelationReason>' + cancelationReason + '</cancelationReason>' +
        '</ws:cancelTransaction>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';

    var servicePath = '/wstraffic/services/TransactionService';
    var parameters = [res.toString()];
    var request = buildBody(parameters, true);
    var result = invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword);
    try {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |cancel Transaction | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
    } catch (e) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | cancel Transaction | Exception :" + e);
    }
    return result;
}

//this function used when thw user has already made payment as cach at the training center 

function payAsCash(transactionid, isEncryptResponse, encryptionPassword) {
    var res = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' " +
        "xmlns:tran='http://traffic2/traffic/services/TransactionService' xmlns:ws='http://ws.trs.rta.ae'>" +
        "<soapenv:Header>" +
        "<tran:externalUserPassword>" + password + "</tran:externalUserPassword>" +
        "<tran:externalUsername>" + userName + "</tran:externalUsername>" +
        "<tran:password>" + password + "</tran:password>" +
        "<tran:username>" + userName + "</tran:username>" +
        " </soapenv:Header>" +
        "<soapenv:Body>" +
        "<ws:payByCash>" +
        "<transactionId>" + transactionid + "</transactionId>" +
        "<username>" + userName + "</username>" +
        "<centerCode>1493</centerCode>" +
        "</ws:payByCash>" +
        " </soapenv:Body>" +
        "</soapenv:Envelope>";


    var servicePath = '/wstraffic/services/TransactionService';
    var parameters = [res.toString()];
    var request = buildBody(parameters, true);
    var result = invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword);

    //MFP.Logger.warn("payASCash result.Envelope::" + JSON.stringify(result.Envelope));
    return result;

}



function createOwnershipCertificateTransaction(trafficFileNo, username, centerCode, chasissNo, cauCode, serviceCode) {
    var v = "<createTransaction>" +
        "<setviceCode>" + serviceCode + "</setviceCode>" +
        "<trafficFileNo>" + trafficFileNo + "</trafficFileNo>" +
        "<username>" + username + "</username>" +
        "<centerCode>" + centerCode + "</centerCode>" +
        "<attachmentsRefNo></attachmentsRefNo>" +
        "<isReception>1</isReception>" +
        "<parameters>" +
        " <parameter>" +
        "<name>cauId</name>" +
        "<value>" + cauCode + "</value>" +
        "</parameter>" +
        "</parameters>" +
        "</createTransaction>";

    return createTransaction("<![CDATA[" + v.toString() + "]]>", "", "", "", "");
}

function createOwnershipCertificateTransactionForMany(trafficFileNo, username, centerCode, cauCode, serviceCode) {
    var v = "<createTransaction>" +
        "<setviceCode>" +
        serviceCode +
        "</setviceCode>" +
        "<trafficFileNo>" +
        trafficFileNo +
        "</trafficFileNo>" +
        "<username>" +
        username +
        "</username>" +
        "<centerCode>" +
        centerCode +
        "</centerCode>" +
        "<attachmentsRefNo>" +
        "</attachmentsRefNo>" +
        "<isReception>" +
        1 +
        "</isReception>" +
        "<parameters>" +
        "<parameter>" +
        "<name>" +
        "cauId" +
        "</name>" +
        "<value>" +
        cauCode +
        "</value>" +
        "</parameter>" +
        "</parameters>" +
        "</createTransaction>";
    //MFP.Logger.debug("create transaction=" + v);
    return createTransaction("<![CDATA[" + v + "]]>", "", "", "", "");
}

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

function invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword) {
    var input = {
        method: 'post',
        headers: {
            "SOAPAction": ""
        },
        returnedContentType: 'xml',
        path: servicePath,
        body: {
            content: JSON.parse(request),
            contentType: 'text/xml; charset=utf-8'
        }
    };

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
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult]
    };
    return MFP.Server.invokeProcedure(invocationData);
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
            adapter: 'drivers_and_vehciles_utilitiesAdapter_Tibco',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }

    var endTime = new Date().getTime();
    //Log("time for "+ servicePath + " is " + (endTime - startTime) + " ms");
    webServiceResult.requestString = body.toString();
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter_Tibco',
        procedure: 'deleteCredientails',
        parameters: [webServiceResult]
    };
    return MFP.Server.invokeProcedure(invocationData);
}

function buildBody2(envHeader, params, namespaces, soapEnv_NS) {
	var body = '<soapenv:Envelope ' + soapEnv_NS + '>'+ '<soapenv:Header>'+ ' <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> '+ ' <wsse:UsernameToken wsu:Id="UsernameToken-8">';
	
	body = jsonToXml(envHeader, body, namespaces);
	//body = jsonToXml(JSON.parse(envHeader), body.toString(), namespaces);
	body += '</wsse:UsernameToken>'+ '</wsse:Security>'+ '</soapenv:Header>';
	body += '<soapenv:Body>';
//	MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |body params : " + JSON.stringify([params, body, namespaces]));
	//MFP.Logger.info("|drivers_and_vehicles_trafficAdapter |body Temp Log " + JSON.stringify(jsonToXml2(params, "", namespaces)));
	body  = jsonToXml(params, body, namespaces);
	//body = jsonToXml(JSON.parse(params), body.toString(), namespaces);

	body += '</soapenv:Body>' + '</soapenv:Envelope>';	
	
	MFP.Logger.info("******bo0000000dy " + body);
	body = replaceCredentials(body);
	
	return body;
}

function getChannelCredentials() {
	return {
		username : "Mobstguser",
		//password : "Test@1234"
		password : "m792!du)+1g"
	};
}

function getExternalChannelCredentials() {
	return {
		externalUsername : "Mobstguser",
		//externalPassword : "Test@1234"
		externalPassword : "m792!du)+1g" //Production
	};
}

function getTibcoCredentials() {
	return {
		username_tibco : "Mobstguser",
		password_tibco : "m792!du)+1g",
	};
}

function getTrafficCredentials() {
	return {
		username : "Mobstguser",
		//password : "Test@1234"
		password : "m792!du)+1g" //Production	
		};
}

function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
	return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function replaceCredentials(envHeader){

	var string = envHeader;
	string = this.replaceAll(string, "%#credentials!#!username#%", getChannelCredentials().username);
	string = this.replaceAll(string, "%#credentials!#!externalUsername#%", getExternalChannelCredentials().externalUsername);
	string = this.replaceAll(string, "%#credentials!#!username_tibco#%", getTibcoCredentials().username_tibco);
	string = this.replaceAll(string, "%#credentials!#!password#%", getChannelCredentials().password);
	string = this.replaceAll(string, "%#credentials!#!password_tibco#%", getTibcoCredentials().password_tibco);
	string = this.replaceAll(string, "%#credentials!#!externalPassword#%", getExternalChannelCredentials().externalPassword);
	string = this.replaceAll(string, "%#credentials!#!username_traffic#%", getTrafficCredentials().username);
	string = this.replaceAll(string, "%#credentials!#!password_traffic#%", getTrafficCredentials().password);

	/*MFP.Logger.debug("??????????????????????????????????????????");
	MFP.Logger.debug("converted Body " + string);
	MFP.Logger.debug("??????????????????????????????????????????");*/
	return string ;
}

function getAttributes(jsonObj) {
	var attrStr = '';
	for(var attr in jsonObj) {
		var val = jsonObj[attr];
		if (attr.charAt(0) == '@') {
			attrStr += ' ' + attr.substring(1);
			attrStr += '="' + val + '"';
		}
	}
	return attrStr;
}

function jsonToXml(jsonObj, xmlStr, namespaces) {

	var toAppend = '';
	for(var attr in jsonObj) {
		var val = jsonObj[attr];
		if (attr.charAt(0) != '@') {
			toAppend += "<" + attr;
			if (typeof val  === 'object') {
				toAppend += getAttributes(val);
				if (namespaces != null)
					toAppend += ' ' + namespaces;
				toAppend += ">";
				toAppend = jsonToXml(val, toAppend);
			}
			else {
				toAppend += ">" + val;
			}
			toAppend += "</" + attr + ">";
		}
	}


	return xmlStr += toAppend;
}

function buildBody(parameters, isStatic) {
    var request = "";

    if (isStatic == true) {
        request = MFP.Server.invokeProcedure({
            adapter: 'drivers_and_vehciles_utilitiesAdapter_Tibco',
            procedure: 'buildBodyFromStaticRequest',
            parameters: parameters,

        });
    } else {
        request = MFP.Server.invokeProcedure({
            adapter: 'drivers_and_vehciles_utilitiesAdapter_Tibco',
            procedure: 'buildBody',
            parameters: parameters
        });
    }
    MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |buildBody : " + JSON.stringify(request.body));

    return request.body;
}

function getParameterValueFromCData(cData, parameterName) {
    var paramterValue = null;
    try {
        var searchString = "<" + parameterName + ">";
        var str = cData;
        var startPos = str.indexOf(searchString);
        if (startPos >= 0) {
            str = str.substring(startPos + searchString.length);
            var endPos = str.indexOf("</" + parameterName + ">");
            if (endPos >= 0)
                paramterValue = str.substring(0, endPos);
        }
    } catch (ex) {}
    return paramterValue;
}

function recertifySeasonalParkingServices(request, result, isEncryptResponse, encryptionPassword) {
    var responseReturned;
    if (request.indexOf("<ws:createTransaction") >= 0) // createTransaction Operation
    {
        var serviceCode = getParameterValueFromCData(request, "setviceCode");
        if (serviceCode == "601" || serviceCode == "602" || serviceCode == "101" || serviceCode == "4") {
            if (result.Envelope.Body.createTransactionResponse.createTransactionReturn != undefined &&
                result.Envelope.Body.createTransactionResponse.createTransactionReturn.CDATA != undefined
            ) // createTransaction was performed successfully
            {
                var cData = result.Envelope.Body.createTransactionResponse.createTransactionReturn.CDATA;
                var transactionId = getParameterValueFromCData(cData, "transactionId");
                var response;
                if (transactionId != undefined && transactionId != null && transactionId != "") {
                    var trafficFileNo = getParameterValueFromCData(request, "trafficFileNo");
                    var centerCode = getParameterValueFromCData(request, "centerCode");
                    var innerXML = "<![CDATA[" +
                        "<createTransaction>" +
                        "<setviceCode>" + serviceCode + "</setviceCode>" +
                        "<trafficFileNo>" +
                        trafficFileNo +
                        "</trafficFileNo>" +
                        "<username>" +
                        username_traffic +
                        "</username>" +
                        "<centerCode>" +
                        centerCode +
                        "</centerCode>" +
                        "<parameters>" +
                        "<parameter>" +
                        "<name>transactionId</name>" +
                        "<value>" +
                        transactionId +
                        "</value>" +
                        "</parameter>" +
                        "</parameters>" +
                        "</createTransaction>" + "]]>";
                    var requestString =
                        "<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'" +
                        " xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.trs.rta.ae'>" +
                        "<soapenv:Header>" +
                        "<username>" + username_traffic + "</username>" +
                        "<password>" + password_traffic + "</password>" +
                        "<externalUsername>" + externalUsername + "</externalUsername>" +
                        "<externalUserPassword>" + externalPassword + "</externalUserPassword>" +
                        "</soapenv:Header>" +
                        "<soapenv:Body>" +
                        "<ws:reCertifyTransaction>" +
                        "<request xsi:type='xsd:string'>" +
                        innerXML + "</request>" +
                        "</ws:reCertifyTransaction>" +
                        "</soapenv:Body>" +
                        "</soapenv:Envelope>";
                    var servicePath = '/wstraffic/services/TransactionService';
                    var parameters = [requestString.toString()];
                    var recertifyRequest = buildBody(parameters, true);
                    response = invokeWebServiceString(recertifyRequest, servicePath);
                    // Check that recertifyTransaction was performed successfully.
                    if (response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn != undefined &&
                        response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn.CDATA != undefined
                    ) {
                        var cData = response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn.CDATA;
                        var transactionId = getParameterValueFromCData(cData, "transactionId");
                        if (transactionId != undefined && transactionId != null && transactionId != "")
                            responseReturned = result;
                        else
                            responseReturned = response;
                    } else
                        responseReturned = response;
                } else
                    responseReturned = result;
            } else
                responseReturned = result;
        } else
            responseReturned = result;
    } else
        responseReturned = result;
    if (isEncryptResponse != undefined && isEncryptResponse == true) {
        var responseString = JSON.stringify(responseReturned);
        var invocationData = {
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        responseReturned = MFP.Server.invokeProcedure(invocationData);
    }
    try {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |recertify Transaction | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(responseReturned));
    } catch (e) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | recertify Transaction | Exception :" + e);
    }

    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [responseReturned]
    };
    return MFP.Server.invokeProcedure(invocationData);

}

function lockEntity(transactionId, spTrn, spCode, serviceCode) {

    if (spCode == undefined || spCode == null || spCode == "")
        spCode = MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE");
    if (serviceCode == undefined || serviceCode == null || serviceCode == "")
        serviceCode = MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE");
    var res = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.rta.trs.LockTransactionForPaymentService">' +
        '<soapenv:Header>' +
        '<ae:password>' + password_traffic + '</ae:password>' +
        '<ae:username>' + username_traffic + '</ae:username>' +
        '</soapenv:Header>' +
        '<soapenv:Body>' +
        '<ae:lockDEGTrsEntities>' +
        '<transactionId>' + transactionId + '</transactionId>' +
        '<degRefCustCode>' + spTrn + '</degRefCustCode>' +
        '<spCode>' + spCode + '</spCode>' +
        '<serviceCode>' + serviceCode + '</serviceCode>' +
        '<lockingType>1</lockingType>' +
        '</ae:lockDEGTrsEntities>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';
    var servicePath = '/wstraffic/services/LockTransactionForPaymentService';
    var parameters = [res.toString()];
    var request = buildBody(parameters, true);
    var result = invokeWebServiceString(request, servicePath);
    try {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Request : " + JSON.stringify(request) + ", Response: " + JSON.stringify(result));
    } catch (e) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Exception :" + e);
    }
    var lockStatus = "FAILURE";
    try {
        if ((result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != undefined &&
                result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != null &&
                result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != "") && (result.Envelope.Body.lockDEGTrsEntitiesResponse.errorResponse.responseCode == "1"))
            lockStatus = "SUCCESS";
    } catch (ex) {
        MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Exception :" + ex);
    }

    var responseReturned = {
        lockStatus: lockStatus,
        response: result,
        request: request
    };
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [responseReturned.toString()]
    };
    return MFP.Server.invokeProcedure(invocationData);
}

function unlockEntity(transactionId, isEncryptResponse, encryptionPassword) {
    /*var unlockStatus = "FAILURE";
    var response = {};
    try
    {
    	var res = 
    		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.rta.trs.LockTransactionForPaymentService">' +
    		'<soapenv:Header>' +
    		'<ae:password>'+password_traffic+'</ae:password>' +
    		'<ae:username>'+username_traffic+'</ae:username>' +
    		'</soapenv:Header>' +
    		'<soapenv:Body>' +
    		'<ae:transactionUnlock>' +
    		'<transactionId>'+transactionId+'</transactionId>' +
    		'</ae:transactionUnlock>' +
    		'</soapenv:Body>' +
    		'</soapenv:Envelope>';
    	var servicePath = '/wstraffic/services/LockTransactionForPaymentService';
    	var parameters = [res];
    	var request = buildBody(parameters, true);
    	response = invokeWebServiceString(request,servicePath);
    	try{
    		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |unlockEntity  | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(response));
    	}catch(e){
    		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |unlockEntity  | Exception :"+e);
    	}
    	try
    	{
    		if(response.Envelope.Body.UnLockDEGTrsEntitiesResponse.errorResponse.responseCode != undefined && 
    				response.Envelope.Body.UnLockDEGTrsEntitiesResponse.errorResponse.responseCode != null &&
    				response.Envelope.Body.UnLockDEGTrsEntitiesResponse.errorResponse.responseCode != "" &&
    				response.Envelope.Body.UnLockDEGTrsEntitiesResponse.errorResponse.responseCode == 1)
    			unlockStatus = "SUCCESS";
    	}
    	catch(ex){}
    }
    catch(ex){}
    var result = {unlockStatus:unlockStatus, response:response}
    if(isEncryptResponse != undefined && isEncryptResponse == true)
    {
    	var responseString = JSON.stringify(result);
    	var invocationData = {
    			adapter : 'drivers_and_vehciles_utilitiesAdapter',
    			procedure : 'encryptData',
    			parameters : [responseString,encryptionPassword]
    	};
    	result = MFP.Server.invokeProcedure(invocationData);
    }	

    return result;*/
    var invocationResult = {
        unlockStatus: 'SUCCESS'
    };
    var result = {
        unlockStatus: 'SUCCESS',
        invocationResult: invocationResult
    };
    return result;
}

function _invokeWebServiceString(request, servicePath, SOAPAction, isEncryptResponse, encryptionPassword) {

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
            content: request.toString(),
            contentType: 'text/xml; charset=utf-8'
        }
    };

    _webServiceResult = MFP.Server.invokeHttp(input);
try{
    //delete credientails
    var invocationData = {
        adapter: 'drivers_and_vehciles_utilitiesAdapter',
        procedure: 'deleteCredientails',
        parameters: [_webServiceResult]
    };

    _webServiceResult = MFP.Server.invokeProcedure(invocationData);

    responseString = _webServiceResult;

    //encrypt response
    if (isEncryptResponse != undefined && isEncryptResponse == true) {

        var invocationData = {
            adapter: 'drivers_and_vehciles_utilitiesAdapter',
            procedure: 'encryptData',
            parameters: [responseString, encryptionPassword]
        };
        _webServiceResult = MFP.Server.invokeProcedure(invocationData);
    }
}catch(e){}
    //log response
    _logRequestResponse(refNum, adapterName, SOAPAction, null, responseString, true);

    return _webServiceResult;
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
            '|--------Request: ' + request + '---|\r\n' +
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
            parameters: [refNum.toString(), JSON.stringify(response)]
        };
    }
try{
    if (isDBLog)
        MFP.Server.invokeProcedure(invocationLog);
}catch(e){}
}
