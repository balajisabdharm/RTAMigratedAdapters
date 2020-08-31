

var datetime = new Date();

function getUIList(language,params) {

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/ResourcesService/XMLSchema">'
		+getHeader(language)
		+'<soapenv:Body>'
			+'<xs:uiListRequest>'
				+jsonToXml(params,'', null)
			+'</xs:uiListRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"getUIList");
	
	return result;

	// var result = {
	// 	result:MFP.Server.getPropertyValue("rta.soap.language.header.xmlns")
	// }
	// return result;


}

function getImageInBase64(language,params) {
	MFP.Logger.info("Log Test Value getImageInBase64:" + JSON.stringify(language));
	
	var file = com.rta.java.adapter.CSImageMerge.getImage(params.imageId,MFP.Server.getPropertyValue("rta.image.nolTempPath"));
	
	
	if(file==null){

		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/ResourcesService/XMLSchema">'
				+getHeader(language)
				+'<soapenv:Body>'
					+'<xs:uiImageRequest>'
						+jsonToXml(params,'', null)
					+'</xs:uiImageRequest>'
				+'</soapenv:Body>'
			+'</soapenv:Envelope>';
		
		var result = invokeWebService(request,"getImageInBase64");
		
		if(result.layoutImageInBase64 !=null){
			com.rta.java.adapter.CSImageMerge.saveImage(params.imageId,JSON.stringify(result),MFP.Server.getPropertyValue("rta.image.nolTempPath"));
		}
		
		return result;
	}else{
		return JSON.parse(file);
	}

	
}
	

function getHeader(language){
	MFP.Logger.info("Test");
	var username = MFP.Server.getPropertyValue("rta.soap.language.header.xmlns");
	
	
	var header = 
		'<soapenv:Header>'
			+getWSSE()
			+'<m:AcceptLanguages xmlns:m="'+MFP.Server.getPropertyValue("rta.soap.language.header.xmlns")+'">'
				+'<m:Language>'+language+'</m:Language>'
			+'</m:AcceptLanguages>'
		+'</soapenv:Header>';
	
	return header;
}

function getWSSE(){
	var username = MFP.Server.getPropertyValue("wsse.tibco.username");
	MFP.Logger.info("getWSSE");
	MFP.Logger.info("getWSSE"+ username);
	var wsse = 
		'<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+'<wsse:UsernameToken wsu:Id="UsernameToken-69">'
				+'<wsse:Username>'+MFP.Server.getPropertyValue("wsse.tibco.username")+'</wsse:Username>'
				+'<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">'+MFP.Server.getPropertyValue("wsse.tibco.password")+'</wsse:Password>'
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

function invokeWebService(request,soapAction){
	var invokeReferenceId = "ME"+new Date().getTime()+Math.floor((Math.random() * 100) + 1);
	try {
		//WL.Logger.info("["+soapAction +"][Request]["+invokeReferenceId+"] \r\n"+ request.toString());
		
	    var input = {
	        method : 'post',
	        returnedContentType : 'xml',
	        path :MFP.Server.getPropertyValue("rta.pt.nolResourcesService.endPoint"),
	        headers:{SOAPAction:soapAction},
	        body: {
	            content : request.toString(),
	            contentType : 'text/xml; charset=utf-8'
	        }
	    };
    
	    var response = MFP.Server.invokeHttp(input);
	    
	    //WL.Logger.info("["+soapAction + "][Response]["+invokeReferenceId+"] \r\n"+JSON.stringify(response, null, '\t'));
	    
		response.Envelope.Body.invokeReferenceId = invokeReferenceId;
		
	    return response.Envelope.Body;
    
	}catch(err) {
		MFP.Logger.error("["+soapAction+"][Error]["+invokeReferenceId+"]: "+err);
		return {error:err,isSuccessful:false,invokeReferenceId:invokeReferenceId};
	}
}