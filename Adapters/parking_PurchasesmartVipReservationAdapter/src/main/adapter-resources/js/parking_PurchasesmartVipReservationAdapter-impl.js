var Parking_USERNAME = "wifiEtisalatAdmin";
var Parking_PASSWORD = "wifi@Adm1n#eTi$a1aT%$m";   // Production 
//var Parking_PASSWORD = "34rth4@ur";

function purchaseSelfValetVP(dataObject){
	 try{
		 var purchaseSelfValetVPRequest = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.mobileapp.infocomm.com">'
			 +' <soapenv:Header/>'
		 +' <soapenv:Body>'
		   +' <ws:purchaseSelfValetVP>'
		      +'   <ws:userId>'+Parking_USERNAME+'</ws:userId>'
		         +'  <ws:pwd>'+Parking_PASSWORD+'</ws:pwd>'
		         
		         +' <ws:smartPhoneAppId>'+dataObject['smartPhoneAppId']+'</ws:smartPhoneAppId>'
		         +' <ws:msisdn>'+dataObject['msisdn']+'</ws:msisdn>'
		         +' <ws:lang>'+dataObject['lang']+'</ws:lang>'
		         +' <ws:plateNo>'+dataObject['plateNo']+'</ws:plateNo>'
		         +'  <ws:plateSourceId>'+dataObject['plateSourceId']+'</ws:plateSourceId>'
		         +'  <ws:plateTypeId>'+dataObject['plateTypeId']+'</ws:plateTypeId>'
		         +'<ws:plateColorId>'+dataObject['plateColorId']+'</ws:plateColorId>'
		         +' <ws:zoneNo>'+dataObject['zoneNo']+'</ws:zoneNo>'
		         +' <ws:duration>'+dataObject['duration']+'</ws:duration>'
		         +' <ws:rtaPortalId>'+dataObject['rtaPortalId']+'</ws:rtaPortalId>'
		         +' </ws:purchaseSelfValetVP>'
		      +' </soapenv:Body>'
		   +'</soapenv:Envelope>'
		   
		   MFP.Logger.warn("getParkingAvailabliltyByZone request | " + purchaseSelfValetVPRequest)
		 var input = {  
		   method : 'post',
		   headers :{
				"SOAPAction" : ""
			},
		   returnedContentType : 'HTML',
		   path : '/mParkingMobileAxisWS/services/PurchaseTicketService',
		   body : {
		    content : purchaseSelfValetVPRequest.toString(),
		    contentType : 'text/xml; charset=utf-8'
		   }
		  };
		 var result_purchaseSelfValetVPRequest = MFP.Server.invokeHttp(input);
		 MFP.Logger.warn("result_purchaseSelfValetVPRequest result | " + JSON.stringify(result_purchaseSelfValetVPRequest))
		  return result_purchaseSelfValetVPRequest
		 
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
				MFP.Logger.warn("result_purchaseSelfValetVPRequest result | " + JSON.stringify(webServiceResult))
				return webServiceResult; 

			}
}
