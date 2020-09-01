
function getSoapHeader(){
	var header = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '
		+'xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/schemas/MobileCRMService/Schema.xsd" '
		+'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" '
		+'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
		+'<soapenv:Header><wsse:Security><wsse:UsernameToken><wsse:Username>' + MFP.Server.getPropertyValue("tokens.tipcoService.username") + '</wsse:Username>'
		+'<wsse:Password>' + MFP.Server.getPropertyValue("tokens.tipcoService.password") + '</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header>';
	return header;
}




function sendFeedback(paramStr,captchaObject){
	var serviceName="Feedback";	
	var param = JSON.parse(paramStr);
	param.isReportProblem = false;
	if(param.CaseType == "TechnicalIssue")
	{
		param.CaseType = "Complaint";
		param.isReportProblem = true;
	}	
	
	if(captchaObject)
	{
		var captcha=JSON.parse(captchaObject);
		MFP.Logger.warn("CRMAdapter |sendFeedback |captcha: " + captchaObject );
		
		var invocationData = {
				adapter : 'captchaAdapter',
				procedure : 'ValidateCaptcha',
				parameters : [captcha.key,captcha.userAnswerId,captcha.type,serviceName]
		};
		var result = MFP.Server.invokeProcedure(invocationData);
		MFP.Logger.warn("CRMAdapter |sendFeedback |result invoke captcha: " +  JSON.stringify(result) );

		if (result &&result.isValid=="Valid"){
			
			MFP.Logger.warn("CRMAdapter |sendFeedback |onSuccessCaptcah  : " + captchaObject );
			
			return createCase(JSON.stringify(param));
		}
		else {
			error : "Invalid captcha";
		};
	}
	else{
    return createCase(JSON.stringify(param));
	}
}


function reportProblem(paramStr){
	try{
		params = JSON.parse(paramStr);
		params.CaseType = "Complaint";
		params.isReportProblem = true;
	}
	catch(e)
	{
	}
	
	return createCase(JSON.stringify(params));
}

function createCase(paramStr){
	try{
		
		params = JSON.parse(paramStr);
		
		
		MFP.Logger.warn("CRMAdapter |createCase |paramsCreateCase: " + params );
		MFP.Logger.warn("CRMAdapter |createCase |paramsCreateCase: " + paramStr );
	}
	catch(e){
		return {isSuccessful: false, reason:"Error parsing fields"};
	}
	if(!(params.EmailAddress 
//		&& params.Subject
		&& params.Message
		&& ((params.CaseType != 'Complaint') 
				|| (params.CaseType != 'Notification' ) 
				|| (params.CaseType != 'Compliment' ) 
				|| (params.CaseType != 'Suggestion' )
			))){
		
		return {isSuccessful: false, reason:"Mandatory field missing", request: params};
	}
	
    var request = getSoapHeader() +'<soapenv:Body><sch:CreateCase_Request><sch:caseData><sch:EmailAddress>';
    
    if(params.EmailAddress){
    	request+=params.EmailAddress;
    }
    request+='</sch:EmailAddress><sch:CaseType>';
    if(params.CaseType){
    	request+=params.CaseType;
    }
    
    if(params.isReportProblem === true){
    	request+='</sch:CaseType><sch:Subject>MobileApplicationSubject_ReportProblem</sch:Subject><sch:CaseOrigin>200009</sch:CaseOrigin><sch:CaseDescription>';
    }
    	else{
    	request+='</sch:CaseType><sch:Subject>MobileApplicationSubject_SendFeedback</sch:Subject><sch:CaseOrigin>200010</sch:CaseOrigin><sch:CaseDescription>';
    	}
    
    if(params.Name){
    	request+='Name: '+ params.Name + ", ";
    }
    if(params.Mobile){
    	request+='Mobile: ' + params.Mobile + ", ";
    }
    if(params.DeviceModel){
    	request+='DeviceModel: ' + params.DeviceModel + ", ";
    }
    if(params.DeviceOS){
    	request+='DeviceOS: ' + params.DeviceOS + ", ";
    }
    if(params.OSVersion){
    	request+='OSVersion: ' + params.OSVersion + ", ";
    }
    if(params.AppVersion){
    	request+='AppVersion: ' + params.AppVersion + ", ";
    }
    if(params.ApplicationID){
    	request+='AppID: ' + params.ApplicationID + ", ";
    }
    if(params.Message){
    	request+=params.Message;
    }
    request += '</sch:CaseDescription><sch:ComplaintReason>';
    if(params.Message && (params.CaseType == 'Complaint' )){
    	request+="Other";
    }
    request += '</sch:ComplaintReason><sch:ComplimentReason>';
    if(params.Message && (params.CaseType == 'Compliment' )){
    	request+="Service";
    }
    request += '</sch:ComplimentReason><sch:Channel>Mobile';//TODO: Check channel should be mobile
    request += '</sch:Channel></sch:caseData></sch:CreateCase_Request></soapenv:Body></soapenv:Envelope>';
    MFP.Logger.warn("CRMAdapter |createCase |request: " + request );
    
    var respObj = invokeWebService(request);
	
    MFP.Logger.info("RAW RESPONSE ----- CRM_CREATE_CASE =========== "+JSON.stringify(respObj));	
	
    return respObj;
}


function createPhoneCall(paramStr){
	try{
		params = JSON.parse(paramStr);
	}
	catch(e)
	{
		return {isSuccessful: false, reason:"Error parsing fields"};
	}
	
	var request = getSoapHeader() +'<soapenv:Body><sch:CreatePhoneCall_Request><sch:Data><sch:EmailAddress>';
	if(params.EmailAddress){
    	request+=params.EmailAddress;
    }
	request+='</sch:EmailAddress><sch:Title>';
	if(params.Subject){
    	request+=params.Subject;
    }
	else{
		request+='No Subject';
	}
	request+='</sch:Title><sch:Channel>Mobile</sch:Channel><sch:Description>';
	if(params.Message){
    	request+=params.Message;
    }
	request+='</sch:Description></sch:Data></sch:CreatePhoneCall_Request></soapenv:Body></soapenv:Envelope>';
	
    return invokeWebService(request);
}

function invokeWebService(body){
    var input = {
        method : 'post',
        returnedContentType : 'xml',
        path : '/mobileCRMService',
        body: {
            content : body.toString(),
            contentType : 'text/xml; charset=utf-8'
        }
    };
    
    var response =  MFP.Server.invokeHttp(input);
//    response.requestBody = body; //Enable for debugging
    return response;
}

