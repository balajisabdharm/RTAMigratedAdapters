
var datetime = new Date();

function uploadFileInBase64(language,params) {
	
	var  newFileBase64 = com.rta.java.adapter.CSImageMerge.resizeImageSize(params.fileContentInBase64,MFP.Server.getPropertyValue("rta.image.nolUploadFileSizeLimit"));
	
	params.fileContentInBase64 = newFileBase64;

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/UploadService/XMLSchema">'
		+getHeader(language)
		+'<soapenv:Body>'
			+'<xs:uploadFileRequest>'
				+jsonToXml(params,'', null)
		    +'</xs:uploadFileRequest>'
		+'</soapenv:Body>'
	+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"uploadFileInBase64");
	
	return result;

}

function uploadMergeFilesInBase64(language,base64File1,base64File2,fileName) {
	
    var  newFileBase64 = com.rta.java.adapter.CSImageMerge.mergeImage(base64File1, base64File2);
    
    newFileBase64 = com.rta.java.adapter.CSImageMerge.resizeImageSize(newFileBase64,MFP.Server.getPropertyValue("rta.image.nolUploadFileSizeLimit"));

	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xs="http://www.rta.ae/ActiveMatrix/ESB/UploadService/XMLSchema">'
			+getHeader(language)
			+'<soapenv:Body>'
				+'<xs:uploadFileRequest>'
					+'<fileContentInBase64>'+newFileBase64+'</fileContentInBase64>'
					+'<fileName>'+fileName+'</fileName>'
			    +'</xs:uploadFileRequest>'
			+'</soapenv:Body>'
		+'</soapenv:Envelope>';
	
	var result = invokeWebService(request,"uploadFileInBase64");
	
	return result;
}

function getHeader(language){
	var header = 
		'<soapenv:Header>'
			+ getWSSE()
			+'<m:AcceptLanguages xmlns:m="'+MFP.Server.getPropertyValue("rta.soap.language.header.xmlns")+'">'
				+'<m:Language>'+language+'</m:Language>'
			+'</m:AcceptLanguages>'
		+'</soapenv:Header>';
	
	return header;
}

function getWSSE(){
	var wsse = 
		'<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
			+'<wsse:UsernameToken wsu:Id="UsernameToken-69">'
				+'<wsse:Username>'+MFP.Server.getPropertyValue("wsse.tibco.username")+'</wsse:Username>'
				+'<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">'+MFP.Server.getPropertyValue("wsse.tibco.password")+'</wsse:Password>'
				+'<wsu:Created>'+new Date().toISOString()+'</wsu:Created>'
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
		//WL.Logger.info("["+soapAction+"][Request]["+invokeReferenceId+"] \r\n"+ request.toString());
		
	    var input = {
	        method : 'post',
	        returnedContentType : 'xml',
	        path : MFP.Server.getPropertyValue("rta.pt.nolUploadService.endPoint"),
	        headers:{SOAPAction:soapAction},
	        body: {
	            content : request.toString(),
	            contentType : 'text/xml; charset=utf-8'
	        }
	    };
    
	    var response = MFP.Server.invokeHttp(input);
	    
	   // WL.Logger.info("["+soapAction+"][Response]["+invokeReferenceId+"] \r\n"+JSON.stringify(response, null, '\t'));
	    
		response.Envelope.Body.invokeReferenceId = invokeReferenceId;
		
	    return response.Envelope.Body;
    
	}catch(err) {
		MFP.Logger.error("["+soapAction+"][Error]["+invokeReferenceId+"]: "+err);
		return {error:err,isSuccessful:false,invokeReferenceId:invokeReferenceId};
	}
}