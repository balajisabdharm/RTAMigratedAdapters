
var datetime = new Date();

function getAccountBasicInformation(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:accountBasicInformationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:accountBasicInformationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getAccountBasicInformation");
	
	return result;

}

function validateEWalletApplication(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:validateEWalletApplicationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:validateEWalletApplicationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"validateEWalletApplication");
	
	return result;

}

function submitEWalletApplication(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:submitEWalletApplicationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:submitEWalletApplicationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"submitEWalletApplication");
	
	return result;

}

function previewEWalletCancellation(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:previewEWalletCancellationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:previewEWalletCancellationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"previewEWalletCancellation");
	
	return result;

}

function submitEWalletCancellation(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:eWalletCancellationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:eWalletCancellationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"submitEWalletCancellation");
	
	return result;

}

function getAccountInformation(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:accountInformationRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:accountInformationRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getAccountInformation");
	
	return result;

}

function getTradeLicense(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:tradeLicenseRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:tradeLicenseRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getTradeLicense");
	
	return result;

}

function getAuthorizedStampLetter(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:authorizedStampLetterRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:authorizedStampLetterRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getAuthorizedStampLetter");
	
	return result;

}

function updateAccountInformation(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:accountInformation>'
				+jsonToXml(params,'', null)	
		    +'</xs1:accountInformation>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"updateAccountInformation");
	
	return result;

}

function calculateTopupFee(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:calculateTopupFeeRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:calculateTopupFeeRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"calculateTopupFee");
	
	return result;

}

function validateTopup(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:validateTopupRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:validateTopupRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"validateTopup");
	
	return result;

}

function createTopupRequest(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:eWalletTopupSubmissionRequest>'
				+jsonToXml(params,'', null)	
		    +'</xs1:eWalletTopupSubmissionRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"createTopupRequest");
	
	return result;

}

function updateTopupStatus(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:paymentResponse>'
				+jsonToXml(params,'', null)	
		    +'</xs1:paymentResponse>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"updateTopupStatus");
	
	return result;

}

function getServiceSubscriptionOptions(language,userId) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:getServiceSubscriptionOptions/>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getServiceSubscriptionOptions");
	
	return result;

}

function getSubscribedServices(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:getSubscribedServicesRequest>'
				+jsonToXml(params,'', null)	
			+'</xs1:getSubscribedServicesRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getSubscribedServices");
	
	return result;

}

function validateServiceAuthentication(language,userId,params,eWalletServiceOptions) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:serviceSubscriptionOptions>'
				+jsonToXml(params,'', null)
				+jsonToXmleWalletServiceOptions(eWalletServiceOptions)
			+'</xs1:serviceSubscriptionOptions>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"validateServiceAuthentication");
	
	return result;

}

function updateServiceSubscription(language,userId,params,serviceToBeAdded,serviceToBeRemoved) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:updateServiceSubscriptionRequest>'
				+jsonToXml(params,'', null)	
				+jsonToXmlserviceToBeAdded(serviceToBeAdded)
				+jsonToXmlserviceToBeRemoved(serviceToBeRemoved)
			+'</xs1:updateServiceSubscriptionRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"updateServiceSubscription");
	
	return result;

}

function getEWalletTxnHistory(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:eWalletTxnHistoryRequest>'
				+jsonToXml(params,'', null)	
			+'</xs1:eWalletTxnHistoryRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getEWalletTxnHistory");
	
	return result;

}

function validateEWalletLinkage(language,userId,params,eWalletServices) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:validateEWalletLinkageRequest>'
				+jsonToXml(params,'', null)
				+jsonToXmleWalletServices(eWalletServices)
			+'</xs1:validateEWalletLinkageRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"validateEWalletLinkage");
	
	return result;

}

function submitEWalletLinkage(language,userId,params,eWalletServices) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:submitEWalletLinkageRequest>'
				+jsonToXml(params,'', null)
				+jsonToXmleWalletServices(eWalletServices)
			+'</xs1:submitEWalletLinkageRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"submitEWalletLinkage");
	
	return result;

}

function resetPin(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:resetPinRequest>'
				+jsonToXml(params,'', null)	
			+'</xs1:resetPinRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"resetPin");
	
	return result;

}

function updatePin(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:updatePinRequest>'
				+jsonToXml(params,'', null)	
			+'</xs1:updatePinRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"updatePin");
	
	return result;

}

function verifyPin(language,userId,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:verifyPinRequest>'
				+jsonToXml(params,'', null)	
			+'</xs1:verifyPinRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"verifyPin");
	
	return result;

}

function getMaxEWalletAccountBalance(language,userId) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/CustomHeader/XMLSchema/" xmlns:xs1="http://www.rta.ae/ActiveMatrix/ESB/EWalletService/XMLSchema">'
		+getHeader(language,userId)
		+'<soapenv:Body>'
			+'<xs1:getMaxEWalletAccountBalance/>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getMaxEWalletAccountBalance");
	
	return result;

}


function getHeader(language,userId){
	
	var header = 
		'<soapenv:Header>'
			+getWSSE()
			+'<xs:CustomHeader>'
				+'<xs:Language>'+language+'</xs:Language>'
				+'<xs:UserId>'+userId+'</xs:UserId>'     
			+'</xs:CustomHeader>'
		+'</soapenv:Header>';
	
	return header;
}

function getWSSE(){
	var wsse = 
		'<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+'<wsse:UsernameToken wsu:Id="UsernameToken-69">'
				+'<wsse:Username>'+ MFP.Server.getPropertyValue("wsse.tibco.username")+'</wsse:Username>'
				+'<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">'+ MFP.Server.getPropertyValue("wsse.tibco.password")+'</wsse:Password>'
			+'</wsse:UsernameToken>'
		+'</wsse:Security>';
	
	return wsse;
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

function jsonToXmlserviceToBeAdded(jsonObj) {
	var toAppend = '';
	for(var attr in jsonObj.serviceToBeAdded) {
		toAppend += '<serviceToBeAdded>';
		var val = jsonObj.serviceToBeAdded[attr];
		if(val.serviceAuthenticationFields){
			for(var sub in val.serviceAuthenticationFields) {
				toAppend += '<serviceAuthenticationFields>';
				var subval = val.serviceAuthenticationFields[sub];
				toAppend += '<displayName>' +subval.displayName+'</displayName>';
				toAppend += '<fieldName>' +subval.fieldName+'</fieldName>';
				toAppend += '<maskfield>' +subval.maskfield+'</maskfield>';
				toAppend += '<sequenceOrder>' +subval.sequenceOrder+'</sequenceOrder>';
				toAppend += '<value>' +subval.value+'</value>';
				toAppend += '</serviceAuthenticationFields>';
			}
		}
		toAppend += '<serviceId>' +val.serviceId+'</serviceId>';
		toAppend += '<serviceName>' +val.serviceName+'</serviceName>';
		toAppend += '</serviceToBeAdded>';
	}
	return toAppend;
}

function jsonToXmlserviceToBeRemoved(jsonObj) {
	var toAppend = '';
	for(var attr in jsonObj.serviceToBeRemoved) {
		var val = jsonObj.serviceToBeRemoved[attr];
		toAppend += '<serviceToBeRemoved>';
		toAppend += val;
		toAppend += '</serviceToBeRemoved>';
	}
	return toAppend;
}

function jsonToXmleWalletServiceOptions(jsonObj) {
	var toAppend = '';
	for(var attr in jsonObj.eWalletServiceOptions) {
		toAppend += '<eWalletServiceOptions>';
		var val = jsonObj.eWalletServiceOptions[attr];
		if(val.serviceAuthenticationFields){
			for(var sub in val.serviceAuthenticationFields) {
				toAppend += '<serviceAuthenticationFields>';
				var subval = val.serviceAuthenticationFields[sub];
				toAppend += '<displayName>' +subval.displayName+'</displayName>';
				toAppend += '<fieldName>' +subval.fieldName+'</fieldName>';
				toAppend += '<maskfield>' +subval.maskfield+'</maskfield>';
				toAppend += '<sequenceOrder>' +subval.sequenceOrder+'</sequenceOrder>';
				toAppend += '<value>' +subval.value+'</value>';
				toAppend += '</serviceAuthenticationFields>';
			}
		}
		toAppend += '<serviceId>' +val.serviceId+'</serviceId>';
		toAppend += '<serviceName>' +val.serviceName+'</serviceName>';
		toAppend += '</eWalletServiceOptions>';
	}
	return toAppend;
}

function jsonToXmleWalletServices(jsonObj) {
	var toAppend = '';
	for(var attr in jsonObj.eWalletServices) {
		toAppend += '<eWalletServices>';
		var val = jsonObj.eWalletServices[attr];
		if(val.serviceAuthenticationFields){
			for(var sub in val.serviceAuthenticationFields) {
				toAppend += '<serviceAuthenticationFields>';
				var subval = val.serviceAuthenticationFields[sub];
				toAppend += '<displayName>' +subval.displayName+'</displayName>';
				toAppend += '<fieldName>' +subval.fieldName+'</fieldName>';
				toAppend += '<maskfield>' +subval.maskfield+'</maskfield>';
				toAppend += '<sequenceOrder>' +subval.sequenceOrder+'</sequenceOrder>';
				toAppend += '<value>' +subval.value+'</value>';
				toAppend += '</serviceAuthenticationFields>';
			}
		}
		toAppend += '<serviceId>' +val.serviceId+'</serviceId>';
		toAppend += '<serviceName>' +val.serviceName+'</serviceName>';
		toAppend += '</eWalletServices>';
	}
	return toAppend;
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
				toAppend += ">\n";
				toAppend = jsonToXml(val, toAppend);
			}
			else {
				toAppend += ">" + val;
			}
			toAppend += "</" + attr + ">\n";
		}
	}
	return xmlStr += toAppend;
}


function jsonToXmlList(jsonObj, xmlStr, namespaces) {
	var toAppend = '';
	for(var attr in jsonObj) {
		var val = jsonObj[attr];
		if (attr.charAt(0) != '@') {
			if (typeof val  === 'object') {
				if(namespaces !=null ){
					toAppend += "<" + namespaces + ">";
				}
				toAppend = jsonToXml(val, toAppend,attr);
				if(namespaces !=null ){
					toAppend += "</" + namespaces + ">";
				}
			}
			else {
				toAppend += "<" + attr;
				toAppend += ">" + val;
				toAppend += "</" + attr + ">\n";
			}
		}
	}
	return xmlStr += toAppend;
}

function invokeWebService(request,soapAction){
	var invokeReferenceId = "ME"+new Date().getTime()+Math.floor((Math.random() * 100) + 1);
	try {
		MFP.Logger.info("["+soapAction +"][Request]["+invokeReferenceId+"] \r\n"+ request.toString());
		
	    var input = {
	        method : 'post',
	        returnedContentType : 'xml',
	        path : "MobileeWalletService",
	        headers:{SOAPAction:soapAction},
	        body: {
	            content : request.toString(),
	            contentType : 'text/xml; charset=UTF-8'
	        }
	    };
	    var response = MFP.Server.invokeHttp(input);
		//return {error:err,isSuccessful:false,invokeReferenceId:invokeReferenceId};
	    
		MFP.Logger.info("["+soapAction + "][Response]["+invokeReferenceId+"] \r\n"+JSON.stringify(response, null, '\t'));
	    
	    if(response.Envelope){
			response.Envelope.Body.invokeReferenceId = invokeReferenceId;
			
		    return response.Envelope.Body;
	    }else{
	    	response.invokeReferenceId = invokeReferenceId;
	    	
		    return response;
	    }
	    
	}catch(err) {
		MFP.Logger.error("["+soapAction+"][Error]["+invokeReferenceId+"]: "+err);
		return {error:err,isSuccessful:false,invokeReferenceId:invokeReferenceId};
	}
}
