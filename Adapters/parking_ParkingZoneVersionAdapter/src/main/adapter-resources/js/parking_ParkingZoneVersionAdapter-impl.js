/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var Parking_USERNAME = "wifiEtisalatAdmin";
var Parking_PASSWORD = "wifi@Adm1n#eTi$a1aT%$m";   // Production 
//var Parking_PASSWORD = "34rth4@ur";


function getParkingZoneVersion(dataObject){
 try{
	 //{"version":"0.0"}
 var getParkingZoneVersionRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.smartphone.infocomm.com/"><soapenv:Header/>'
	 	  +'<soapenv:Body><ws:getParkingZoneVersion>'
          +'<userId>'+Parking_USERNAME+'</userId>'
          +'<pwd>'+Parking_PASSWORD+'</pwd>'
          +'<version>'+dataObject.version+'</version>'		  
          +'</ws:getParkingZoneVersion>'
          +'</soapenv:Body>'
          +'</soapenv:Envelope>';
 MFP.Logger.info("getParkingZoneVersion request | " + getParkingZoneVersionRequest)
 var input = {  
   method : 'post',
   headers :{
		"SOAPAction" : ""
	},
   returnedContentType : 'HTML',
   path : '/mParkingSmartPhoneWS/smartPhoneWS',
   body : {
    content : getParkingZoneVersionRequest.toString(),
    contentType : 'text/xml; charset=utf-8'
   }
  };

  var result_getParkingZoneVersionResponse =  MFP.Server.invokeHttp(input);
  
  if(result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == undefined || result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == null || result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == ''){
	var result_getParkingZoneVersionResponse_return =  MFP.Server.invokeHttp(input);
 } else {
	 
	 var result_getParkingZoneVersionResponse_return =  result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version;
	 
	 MFP.Logger.info("result_getParkingZoneVersionResponse result | " + result_getParkingZoneVersionResponse_return + '}' +  JSON.stringify(result_getParkingZoneVersionResponse_return));
 }
	
	
  if(result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == undefined || result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == null || result_getParkingZoneVersionResponse.Envelope.Body.getParkingZoneVersionResponse["return"].version == ''){
	
		return result_getParkingZoneVersionResponse;
  }else{
	  return {
		"version" : result_getParkingZoneVersionResponse_return
	};
  }
	
 
 }catch(exp){
		var webServiceResult= {
				Envelope:{

					"Body":{}
		,"error":exp.toString()
		,"Header":""}
		,"totalTime":54
		,"isSuccessful":true
		,"responseHeaders":{"Date":+new Date()+",'Content-Type':'text\/xml; charset=utf-8'"}
		,"statusReason":"OK"
			,"warnings":[]
		,"errors":[]
		,"info":[]
		,"responseTime":53
		,"statusCode":200
		}
		 MFP.Logger.info("getParkingZoneVersion result | " +  JSON.stringify(webServiceResult))
		return webServiceResult; 

	}
}