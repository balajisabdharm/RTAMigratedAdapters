///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Generated code - Do not edit																					 //
////
//This is a SOAP adapter that was auto-generated by Worklight for invocation of specific SOAP-based services.   //
//The adapter may invoke more than one service as long as they are all from the same enpdpoint (server host).   //
//Each adapter procedure matches a single operation for the same endpoint server and accepts:                   //
//envHeader- Serialized JSON representation of the XML-based SOAP envelope to be sent to the service 
//params  - Serialized JSON representation of the XML-based SOAP body to be sent to the service               //
//headers - Custom HTTP headers to be specified when invoking the remote service. It is a JSON object with    //
//the headers names and values. E.g. { 'name1' : 'value1', 'name2' : 'value2' }                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var IsDebugging;

function Log(text){
	try {
		IsDebugging=MFP.Server.getPropertyValue("drivers_and_vehicles_is_debugging");
	}catch(e){
		IsDebugging="false";
	}
	// MFP.Logger.warn(""+IsDebugging);
	if(IsDebugging=="true")
		MFP.Logger.warn(text);
	else 
		MFP.Logger.debug(text);
}

function getPendingTransactions(envHeader, params, isLockTransaction, isEncryptResponse, encryptionPassword) {
	var result;
	var lockFailed = false;
	//we removed checking on the third param isLockTransaction and lock all the transactions 
	if(params["ae:setTransactionData"] != undefined && params["ae:setTransactionData"]["ae:paymentStatus"] == 0 )
	{
		var transactionId = params["ae:setTransactionData"]["ae:transactionId"];
		var cData = params["ae:setTransactionData"]["ae:cData"];
		var spTrn = getParameterValueFromPaymentLog(cData,"spTRN");;
		var paymentMethod = getParameterValueFromPaymentLog(cData,"paymentMethod");
		var spCode = (paymentMethod == "epay") ? MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE"):MFP.Server.getPropertyValue("mpay.DSGOptions.SPCODE");
		var serviceCode = (paymentMethod == "epay") ? MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE"):MFP.Server.getPropertyValue("mpay.DSGOptions.SERVCODE");
		var invocationData = {
				adapter : 'drivers_and_vehicles_trafficAdapter',
				procedure : 'lockEntity',
				parameters : [transactionId,spTrn,spCode,serviceCode]
		};
		result = MFP.Server.invokeProcedure(invocationData);
		if(result.lockStatus != "SUCCESS")
			lockFailed = true;
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
	}
	if(!lockFailed)
	{
		var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+ 'xmlns:ae="http://ae.gov.trf.stp.ws.MobilityPaymentLogService"';


		var parameters = [envHeader, params, '', soapEnvNS];
		var request = buildBody(parameters, false);

		//MFP.Logger.debug("request to be sent:\n"+request);
		servicePath='/ws/services/MobilityPaymentLogService';
		result = invokeWebService(request, null, servicePath, isEncryptResponse, encryptionPassword);
	}else{
	result = {
		Envelope:{
	
			"Body":{
				"responseDescription":"",
				"responseCode":"-1"
			}
			,"lockFailed":true
			,"responseDescription":""
			,"responseCode":"-1"
			,"lockResponse":result
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
	}
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [result]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function setTransactionData(envHeader, params, isLockTransaction, isEncryptResponse, encryptionPassword) {
	var result;
	var lockFailed = false;
	//we removed checking on the third param isLockTransaction and lock all the transactions
	if(params["ae:setTransactionData"] != undefined && params["ae:setTransactionData"]["ae:paymentStatus"] == 0)
	{
		var transactionId = params["ae:setTransactionData"]["ae:transactionId"];
		var cData = params["ae:setTransactionData"]["ae:cData"];
		var spTrn = getParameterValueFromPaymentLog(cData,"spTRN");
		var paymentMethod = getParameterValueFromPaymentLog(cData,"paymentMethod");
		var spCode = (paymentMethod == "epay") ? MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE"):MFP.Server.getPropertyValue("mpay.DSGOptions.SPCODE");
		var serviceCode = (paymentMethod == "epay") ? MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE"):MFP.Server.getPropertyValue("mpay.DSGOptions.SERVCODE");
		var invocationData = {
				adapter : 'drivers_and_vehicles_trafficAdapter',
				procedure : 'lockEntity',
				parameters : [transactionId,spTrn,spCode,serviceCode]
		};
		result = MFP.Server.invokeProcedure(invocationData);
		if(result.lockStatus != "SUCCESS")
			lockFailed = true;
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
	}
	if(!lockFailed)
	{
		var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+ 'xmlns:ae="http://ae.gov.trf.stp.ws.MobilityPaymentLogService"';


		var parameters = [envHeader, params, '', soapEnvNS];
		var request = buildBody(parameters, false);

		//MFP.Logger.debug("request to be sent:\n"+request);
		servicePath='/ws/services/MobilityPaymentLogService';
		result = invokeWebService(request, null, servicePath, isEncryptResponse, encryptionPassword);
	}else{
	result = {
		Envelope:{

		"Body":{
				"responseDescription":""
				,"responseCode":"-1"
				}
		,"lockFailed":true
		,"responseDescription":""
		,"responseCode":"-1"
		,"lockResponse":result
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

	}

	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [result]
	};
	return MFP.Server.invokeProcedure(invocationData);}

function TransactionServiceService_operation(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'TransactionServiceService_operation',
			parameters : [envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function TransactionServiceService_operationStringRequest(request, isEncryptResponse, encryptionPassword) { 
	/*invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'TransactionServiceService_operationStringRequest',
			parameters : [request, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);*/
	var const_username = "%#credentials!#!username#%";
	var user_name = "mobile_user";
	
	var const_password = "%#credentials!#!password#%";
	var user_password = "Test@1234";
	
	var const_ext_username = "%#credentials!#!externalUsername#%";
	var user_ext_name = "mobile_user";
	
	var const_ext_password = "%#credentials!#!externalPassword#%";
	var user_ext_password = "Test@1234";
	
	request = request.replace(const_username,user_name);
	request = request.replace(const_password,user_password);
	request = request.replace(const_ext_username,user_ext_name);
	request = request.replace(const_ext_password,user_ext_password);
	request = request.replace(const_username,user_name);
	MFP.Logger.info("Received Request ::: "+request.toString());
	
	//var parameters = [request];
	//var request = buildBody(parameters, true);
	//request = buildBody([ request.toString() ], true);
	//MFP.Logger.info("Build Body Request ::: "+request.toString());
	//TODO: replace credentials
	
	
	if(request.indexOf("<createTransaction><setviceCode>124</setviceCode>") > 0)
		request = request.replace("<parameters>","<parameters><parameter><name>permitPeriod</name><value>3</value></parameter>");

	servicePath='/wstraffic/services/TransactionService';
	var result = invokeWebServiceString(request,servicePath);
	try{
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :"+e);
	}
	//var response = recertifySeasonalParkingServices(request,result, isEncryptResponse, encryptionPassword);

	
	return result;
	
}

function invokeMobilityPaymentLogServiceOperation(request, isEncryptResponse, encryptionPassword) { 
	//MFP.Logger.debug("request to be sent:\n"+request);

	var parameters = [request];
	var request = buildBody(parameters, true);

	servicePath='/ws/services/MobilityPaymentLogService';
	return invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);
}

function invokeTransactionInquiryOperation(request, isEncryptResponse, encryptionPassword) { 
	//MFP.Logger.debug("request to be sent:\n"+request);

	var parameters = [request];
	var request = buildBody(parameters, true);

	servicePath='/ws/services/TransactionInquiryService';
	return invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);
}

function getTransactionStatus(transactionId) {
	credentials = MFP.Server.invokeProcedure({
		adapter : 'drivers_and_vehciles_utilitiesAdapter',
		procedure : 'getChannelCredentials',
		parameters : [],

	});
	var transactionStatus = "NotFound";
	var request = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.gov.trf.trs.ws.TransactionInquiryService">'+
	'<soapenv:Header>'+
	'<password xsi:type="xsd:string">'+credentials.password+'</password>'+
	'<username xsi:type="xsd:string">'+credentials.username+'</username>'+
	'</soapenv:Header>'+
	'<soapenv:Body>'+
	'<ae:getTransactionStatus soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'+
	'<transactionId xsi:type="xsd:long">'+transactionId+'</transactionId>'+
	'<username xsi:type="xsd:string">'+credentials.username+'</username>'+
	'</ae:getTransactionStatus>'+
	'</soapenv:Body>'+
	'</soapenv:Envelope>';

	var parameters = request;

	var result = invokeTransactionInquiryOperation(parameters);
	try
	{
		var cData = result.Envelope.Body.getTransactionStatusResponse.getTransactionStatusReturn.CDATA;
		transactionStatus = getParameterValueFromCData(cData,"status");
	}
	catch(ex)
	{
	}
	var result =  {transactionStatus:transactionStatus};

	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [result]
	};
	return MFP.Server.invokeProcedure(invocationData);
}
function createTransaction(innerXml, isEncryptResponse, encryptionPassword){

	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'createTransaction',
			parameters : [innerXml, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);
}
function cancelTransaction(transactionId, cancelationReason, isEncryptResponse, encryptionPassword){
	invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'cancelTransaction',
			parameters : [transactionId, cancelationReason, isEncryptResponse, encryptionPassword]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function createOwnershipCertificateTransaction(trafficFileNo, username, centerCode, chasissNo, cauCode, serviceCode, isEncryptResponse, encryptionPassword) {
	var v = "<createTransaction>"+
	"<setviceCode>" + serviceCode + "</setviceCode>"+
	"<trafficFileNo>" + trafficFileNo + "</trafficFileNo>"+
	"<username>" + username + "</username>"+
	"<centerCode>" + centerCode + "</centerCode>"+
	"<attachmentsRefNo></attachmentsRefNo>"+
	"<isReception>1</isReception>"+
	"<parameters>"+
	" <parameter>"+
	"<name>cauId</name>"+
	"<value>" + cauCode + "</value>"+
	"</parameter>"+
	"</parameters>"+
	"</createTransaction>";

	return createTransaction("<![CDATA[" + v.toString() + "]]>", "", "", "", "", isEncryptResponse, encryptionPassword);
}

function createOwnershipCertificateTransactionForMany(trafficFileNo, username, centerCode, cauCode, serviceCode, isEncryptResponse, encryptionPassword) {
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
	return createTransaction("<![CDATA[" + v + "]]>", "", "", "", "", isEncryptResponse, encryptionPassword);
}


function invokeWebService(body, headers, servicePath, isEncryptResponse, encryptionPassword) {
	if (!headers)
		headers = {
			"SOAPAction" : ""
	};
	else
		headers["SOAPAction"] = "";
	var input = {
			method : 'post',
			returnedContentType : 'xml',
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

	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData);}


function invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword) {
	var startTime = new Date().getTime();
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :servicePath,
			body : {
				content : request,
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
	var endTime = new Date().getTime();
	//Log("time for "+ servicePath + " is " + (endTime - startTime) + " ms");
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [webServiceResult]
	};
	return MFP.Server.invokeProcedure(invocationData);}

function buildBody(parameters, isStatic) {
	var request = "";

	if (isStatic == true) {
		request = MFP.Server.invokeProcedure({
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'buildBodyFromStaticRequest',
			parameters : parameters

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

function getParameterValueFromCData(cData,parameterName)
{
	var paramterValue=null;
	try
	{
		var searchString = "<"+parameterName+">";
		var str = cData;
		var startPos = str.indexOf(searchString);
		if(startPos >= 0)
		{
			str = str.substring(startPos + searchString.length);
			var endPos = str.indexOf("</"+parameterName+">");
			if(endPos >= 0)
				paramterValue = str.substring(0,endPos);
		}				
	}
	catch(ex){}
	return paramterValue;
}

function getParameterValueFromPaymentLog(cData,parameterName)
{
	var paramterValue=null;
	try
	{
		var searchString = "<name>"+parameterName+"</name><value>";
		var str = cData;
		var startPos = str.indexOf(searchString);
		if(startPos >= 0)
		{
			str = str.substring(startPos + searchString.length);
			var endPos = str.indexOf("</value>");
			if(endPos >= 0)
				paramterValue = str.substring(0,endPos);
		}				
	}
	catch(ex){}
	return paramterValue;
}
