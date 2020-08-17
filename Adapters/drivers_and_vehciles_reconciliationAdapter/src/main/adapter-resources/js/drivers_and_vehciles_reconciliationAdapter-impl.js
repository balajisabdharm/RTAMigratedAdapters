//CreateEventSource has to be moved to the cron job - 
//so the reconciliatePendingTransaction has to be call from the cron job

// WL.Server.createEventSource({
// 	name : 'DnV_PaymentReconciliationEventSource',
// 	poll : {
// 		interval : 300, // Job run each 5 minutes
// 		onPoll : 'reconciliatePendingTransactions'
// 	}
// });
function getTrafficCredentials() {
	return {
		userName : "mobile_user",
		password : "eyprtm"
		//password : "Test@1234"
	};
}

function sleep(milliSeconds)
{
	var startDate = new Date();
	var isTimeOut = false;

	while(isTimeOut == false)
	{
		var now = new Date();
		isTimeOut = (now.getTime() - startDate.getTime()) > milliSeconds;
	}
}

function processEPay(transactionId,trafficFileNo,serviceCode, isJustCheck, spTrnDSG, appID){
	var result;
	var spTrn = (spTrnDSG == undefined || spTrnDSG == null || spTrnDSG == "undefined" || spTrnDSG == "null" || spTrnDSG == "") ? getSpTrn(transactionId,serviceCode,"E") : spTrnDSG;
	var appIDXML = (appID != undefined && appID != null && appID != "") ? ("<name>appID</name><value>"+appID+"</value>"): "";
	if(isJustCheck != undefined && isJustCheck != null && isJustCheck == true)
		result = checkEPayStatus(transactionId, trafficFileNo, serviceCode, spTrn, appID);
	else
	{
		var paymentStatus = "Pending";
		var startDate = new Date();
		var isTimeOut = false;

		var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>PENDING</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ startDate.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value>"+appIDXML+"</parameters>]]>";
		result = setTransactionData(transactionId,0,cData);

		while(paymentStatus == "Pending" && isTimeOut == false)
		{
			result = checkEPayStatus(transactionId,trafficFileNo,serviceCode, spTrn, appID);
			paymentStatus = result.paymentStatus;
			var now = new Date();
			isTimeOut = (now.getTime() - startDate.getTime()) > 60000;
			if(isTimeOut == false)
				sleep(5000);
		}
	}
	return result;
}	
function checkEPayStatus(transactionId,trafficFileNo,serviceCode,spTrnDSG,appID){
	var executionStatus = "Success";
	try
	{
		var messageCode, statusmessage, returnedProperties;
		var payAsPostponedStatus="Failure";
		var paymentStatus = "Pending";
		var spCode = MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE");
		var servCode = MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE");

		var degTrn;
		var spTrn = (spTrnDSG == undefined || spTrnDSG == null || spTrnDSG == "undefined" || spTrnDSG == "null" || spTrnDSG == "") ? getSpTrn(transactionId,serviceCode,"E") : spTrnDSG;
		var appIDXML = (appID != undefined && appID != null && appID != "") ? ("<name>appID</name><value>"+appID+"</value>"): "";
		var result = MFP.Server.invokeProcedure({
			adapter : 'ePayAdapter',
			procedure : 'getTransactionStatus',
			parameters : [ spCode,servCode,spTrn ],			
		});
		try{
		MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter | getEpayStatus  | spTrn : " + spTrn + ", Response: "+JSON.stringify(result));
		}catch(e){
			MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter | getEpayStatus | Exception :"+e);
		}
		try {

			if (result.output!=undefined){
				returnedProperties = result.output.Envelope.Body.getTransactionStatusResponse.result.TRANSACTION;
				messageCode=returnedProperties.MESSAGE;
				statusmessage=returnedProperties.MESSAGECODE;
			}
			else {
				returnedProperties= result.result;
				messageCode=returnedProperties.substring(returnedProperties.lastIndexOf("<MESSAGECODE>")+13,returnedProperties.lastIndexOf("</MESSAGECODE>"));
				statusmessage=returnedProperties.substring(returnedProperties.lastIndexOf("<MESSAGE>")+9,returnedProperties.lastIndexOf("</MESSAGE>"));;
			}
		}catch(e){
			returnedProperties= result.result;
			messageCode=returnedProperties.substring(returnedProperties.lastIndexOf("<MESSAGECODE>")+13,returnedProperties.lastIndexOf("</MESSAGECODE>"));
			statusmessage=returnedProperties.substring(returnedProperties.lastIndexOf("<MESSAGE>")+9,returnedProperties.lastIndexOf("</MESSAGE>"));;

		}
		if(!isNaN(messageCode)) // Don't make any decision until you receive a valid code.
		{
			if(messageCode=="80014" || messageCode=="80013")
			{
				paymentStatus = "Pending";
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>PENDING</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value></value><name>dsgStatusCode</name><value>80014</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,0,cData);
			}
			else if(messageCode=="0")
			{
				paymentStatus = "Success";
				degTrn = returnedProperties.substring(returnedProperties.lastIndexOf("<DEGTRN>")+8,returnedProperties.lastIndexOf("</DEGTRN>"));
				result = payAsPostponedEPay5(transactionId, spTrn, spCode, servCode, true);//payAsPostponed(transactionId);
				payAsPostponedStatus = result.status;
				if(payAsPostponedStatus == "Confirmed")
				{
					var now = new Date();
					var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>SUCCESS</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value>"+appIDXML+"</parameters>]]>";
					result = setTransactionData(transactionId,1,cData);
				}
				else if(payAsPostponedStatus == "Failed")
				{
					var now = new Date();
					var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>payAsPostponedEPay5Failure</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value>"+appIDXML+"</parameters>]]>";
					result = setTransactionData(transactionId,0,cData);
				}
				else
				{
					var now = new Date();
					var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>payAsPostponedEPay5Status:"+payAsPostponedStatus+"</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value>"+appIDXML+"</parameters>]]>";
					result = setTransactionData(transactionId,0,cData);
				}
			}else if(parseInt(messageCode) >= 1 && parseInt(messageCode) <= 9999 &&  parseInt(messageCode) !== 10)//
				/* messageCode=="10001"|| messageCode=="11111"|| messageCode=="88888"|| messageCode=="99999"
					|| messageCode=="70004"|| messageCode=="10016"|| messageCode=="80011"//Temporary Exceptions*/
			{
				paymentStatus = "failure bank";
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value><name>dsgStatusCode</name><value>"+messageCode+"</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,2,cData);
			}else if(messageCode == "10"){
				paymentStatus = "cancelled";
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value><name>dsgStatusCode</name><value>"+messageCode+"</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,2,cData);
			}
			else {
				paymentStatus = "failure DSG";
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>epay</value><name>spTRN</name><value>"+spTrn+"</value><name>dsgStatusCode</name><value>"+messageCode+"</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,2,cData);
			}

		}					
	}
	catch(ex)
	{
		executionStatus = "Exception: " + ex;
	}
	var invocationReturn =  {paymentStatus:paymentStatus, payAsPostponedStatus:payAsPostponedStatus, spTrn:spTrn, degTrn:degTrn, messageCode:messageCode, spCode:spCode, servCode:servCode, executionStatus:executionStatus};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [invocationReturn]
	};
	return MFP.Server.invokeProcedure(invocationData);
}
function processMPay(transactionId,trafficFileNo,serviceCode, totalAmount, isJustCheck, spTrnDSG, appID){
	var result;
	var spTrn = (spTrnDSG == undefined || spTrnDSG == null || spTrnDSG == "undefined" || spTrnDSG == "null" || spTrnDSG == "") ? getSpTrn(transactionId,serviceCode,"M") : spTrnDSG;
	var appIDXML = (appID != undefined && appID != null && appID != "") ? ("<name>appID</name><value>"+appID+"</value>"): "";
	if(isJustCheck != undefined && isJustCheck != null && isJustCheck == true)
		result = checkMPayStatus(transactionId,trafficFileNo,serviceCode, totalAmount, spTrn, appID);
	else
	{
		var paymentStatus = "Pending";
		var startDate = new Date();
		var isTimeOut = false;

		var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>PENDING</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ startDate.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
		result = setTransactionData(transactionId,0,cData);

		while(paymentStatus == "Pending" && isTimeOut == false)
		{
			result = checkMPayStatus(transactionId,trafficFileNo,serviceCode, totalAmount, spTrn, appID);
			paymentStatus = result.paymentStatus;
			var now = new Date();
			isTimeOut = (now.getTime() - startDate.getTime()) > 60000;
			if(isTimeOut == false)
				sleep(5000);
		}
	}
	return result;
}	

function checkMPayStatus(transactionId,trafficFileNo,serviceCode, totalAmount, spTrnDSG, appID){
	var messageCode, statusmessage, returnedProperties;
	var payAsPostponedStatus="Failure";
	var paymentStatus = "Pending";
	var degTrn;

	var spTrn = (spTrnDSG == undefined || spTrnDSG == null || spTrnDSG == "undefined" || spTrnDSG == "null" || spTrnDSG == "") ? getSpTrn(transactionId,serviceCode,"M") : spTrnDSG;
	var appIDXML = (appID != undefined && appID != null && appID != "") ? ("<name>appID</name><value>"+appID+"</value>"): "";
	var DSGParameter = {};
	//DSGParameter.CHANNEL = "MobileApp";
	DSGParameter.KEY_VERSION = "1";
	DSGParameter.SP_CODE = MFP.Server.getPropertyValue("mpay.DSGOptions.SPCODE");
	DSGParameter.SRV_CODE = MFP.Server.getPropertyValue("mpay.DSGOptions.SERVCODE");
	DSGParameter.SP_TRN = spTrn;
	DSGParameter.TRX_ID = "";
	var result = MFP.Server.invokeProcedure({
		adapter : 'mPayAdapter',
		procedure : 'inquireTransactionStatus',
		parameters : [ DSGParameter ]
	});

	returnedProperties = result.output.Envelope.Body.inquireTransactionStatusResponse.properties.property;
	try{
	MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |getMpayStatus  |Request : " + JSON.stringify(DSGParameter) + ", Response: "+JSON.stringify(returnedProperties));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |getMpayStatus | Exception :"+e);
	}
	var matchedAmount = false;
	var DSGValue;
	for(var i = 0 ;i<returnedProperties.length;i++){
		if(returnedProperties[i].name=="DEG$PAYMENT_REF_NUMBER")
			degTrn = returnedProperties[i].value;
		if(returnedProperties[i].name=="DEG$AMOUNT" && (totalAmount == null || (totalAmount != null && returnedProperties[i].value == totalAmount)))
			matchedAmount = true;
		if (returnedProperties[i].name=="DEG$STATUS_CODE")
		{
			DSGValue = returnedProperties[i].value;
			if (DSGValue == "00")
				paymentStatus = "Success";
			else if (DSGValue == "01")
				paymentStatus = "Pending";
			else
				paymentStatus = "Failure";
		}
	}//forloop

	if (paymentStatus == "Success")
	{
		if(matchedAmount)
		{
			result = payAsPostponedEPay5(transactionId, spTrn, "RTA3", "RTAWallet", false);//payAsPostponed(transactionId);
			payAsPostponedStatus = result.status;
			if(payAsPostponedStatus == "Confirmed")
			{
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>SUCCESS</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,1,cData);
			}
			else if(payAsPostponedStatus == "Failed")
			{
				var now = new Date();
				var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>payAsPostponedEPay5Failure</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
				result = setTransactionData(transactionId,0,cData);
			}
		}
		else
		{
			paymentStatus = "Failure";
			var now = new Date();
			var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
			result = setTransactionData(transactionId,2,cData);
		}
	}
	else if (paymentStatus == "Pending")
	{
		var now = new Date();
		var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>PENDING</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
		result = setTransactionData(transactionId,0,cData);							 
	}
	else
	{
		paymentStatus = "Failure";
		var now = new Date();
		var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value><name>paymentMethod</name><value>mpay</value><name>spTRN</name><value>"+spTrn+"</value><name>totalAmount</name><value>"+totalAmount+"</value>"+appIDXML+"</parameters>]]>";
		result = setTransactionData(transactionId,2,cData);
	}
	var invocationReturn = {paymentStatus:paymentStatus, payAsPostponedStatus:payAsPostponedStatus, spTrn:spTrn, degTrn:degTrn, DSGValue:DSGValue, totalAmount:totalAmount, spCode:DSGParameter.SP_CODE, servCode:DSGParameter.SRV_CODE};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [invocationReturn]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function payAsPostponedEPay5(transactionId, degTrn, dsgSpCode, dsgServiceCode, isServiceDeliveryReqd) {

	var status = "Exception";
	var executionResult="Success";

	var transactionStatusResult = getTransactionStatus(transactionId);

	if(transactionStatusResult.transactionStatus == "Confirmed" || transactionStatusResult.transactionStatus == "Under Process")
		status = "Confirmed";
	else
	{
		try
		{

			var credentials = getTrafficCredentials();
			var payAsPostponedRequest = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:tran='http://traffic2/traffic/services/TransactionService' xmlns:ws='http://ws.trs.rta.ae'>"+
			"<soapenv:Header>"+
			/*"<tran:externalUserPassword>"+getExternalChannelCredentials().externalPassword+"</tran:externalUserPassword>"+
										"<tran:externalUsername>"+getExternalChannelCredentials().externalUsername+"</tran:externalUsername>"+*/
			"<tran:password>"+credentials.password+"</tran:password>"+
			"<tran:username>"+credentials.userName+"</tran:username>"+
			"</soapenv:Header>"+
			"<soapenv:Body>"+
			"<ws:payAsPostponedEPay5>"+
			"<transactionId>"+transactionId+"</transactionId>"+
			"<username>"+credentials.userName+"</username>"+
			"<degTrnRef>"+degTrn+"</degTrnRef>"+
			"<dsgSpCode>"+dsgSpCode+"</dsgSpCode>"+
			"<dsgServiceCode>"+dsgServiceCode+"</dsgServiceCode>"+
			"<isServiceDeliveryReqd>"+isServiceDeliveryReqd+"</isServiceDeliveryReqd>"+
			"</ws:payAsPostponedEPay5>"+
			"</soapenv:Body>"+
			"</soapenv:Envelope>";
			var input = {
					method : 'post',
					headers :{
						"SOAPAction" : ""
					},
					returnedContentType : 'xml',
					path :'/wstraffic/services/TransactionService',
					body : {
						content : payAsPostponedRequest,
						contentType : 'text/xml; charset=utf-8'
					}
			};


			var result = MFP.Server.invokeHttp(input);

			if (result.Envelope.Body.payAsPostponedEPay5Response !=null && 
					result.Envelope.Body.payAsPostponedEPay5Response.payAsPostponedEPay5Return.CDATA !=null
			)
			{
				var cData=result.Envelope.Body.payAsPostponedEPay5Response.payAsPostponedEPay5Return.CDATA;
				try{
					var startPos = cData.indexOf("<status>") + 8;
					var endPos = cData.indexOf("</status>");
					status = cData.substring(startPos,endPos);
				}
				catch(e)
				{
					status = "Exception:" + e.message;
				}
			}
		}
		catch(ex)
		{
			status = "Exception:" + ex.message;
			executionResult="Exception in payAsPostponed:" + ex;
		}
	}
	if(status == "Under Process")
		status = "Confirmed";
	try{
	MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |payAsPostponedEPay5  | Request : " + payAsPostponedRequest + ", Response: "+JSON.stringify(result));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |payAsPostponedEPay5 | Exception :"+e);
	}
	var invocationReturn = {status : status, executionResult:executionResult};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [invocationReturn]
	};
	return MFP.Server.invokeProcedure(invocationData); 

}

function setTransactionData(transactionId,paymentStatus,cData) {
	var credentials = getTrafficCredentials();
	var request = 	"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ae='http://ae.gov.trf.stp.ws.MobilityPaymentLogService'>"+
	"<soapenv:Header>"+
	"<ae:password>"+credentials.password+"</ae:password>"+
	"<ae:username>"+credentials.userName+"</ae:username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ae:setTransactionData>"+
	"<ae:transactionId>"+transactionId+"</ae:transactionId>"+
	"<ae:paymentStatus>"+paymentStatus+"</ae:paymentStatus>"+
	"<ae:cData>"+cData+"</ae:cData>"+
	"</ae:setTransactionData>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";
	
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :'/ws/services/MobilityPaymentLogService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};


	var invocationReturn =  MFP.Server.invokeHttp(input);
	try{
	MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |logTransactionData  | Request : { transactionId : " + transactionId + " ,paymentStatus : " + paymentStatus + " ,cData :"+cData+
			"} Response :  "+JSON.stringify(invocationReturn));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehciles_reconciliationAdapter |logTransactionData | Exception :"+e);
	}
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [invocationReturn]
	};
	return MFP.Server.invokeProcedure(invocationData); 
}

function getAllPendingTransactions() {
	var credentials = getTrafficCredentials();
	var request = 	"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ae='http://ae.gov.trf.stp.ws.MobilityPaymentLogService'>"+
	"<soapenv:Header>"+
	"<ae:password>"+credentials.password+"</ae:password>"+
	"<ae:username>"+credentials.userName+"</ae:username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ae:getAllPendingTransactions/>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :'/ws/services/MobilityPaymentLogService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};


	return MFP.Server.invokeHttp(input);
}
function getAllLockedTransactions() {
	var credentials = getTrafficCredentials();
	var request = 	"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ae='http://ae.gov.trf.stp.ws.MobilityPaymentLogService'>"+
	"<soapenv:Header>"+
	"<ae:password>"+credentials.password+"</ae:password>"+
	"<ae:username>"+credentials.userName+"</ae:username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ae:getlockedTransactionsOperation>"+
	"<lockedTimeInMinutes></lockedTimeInMinutes>"+
	"</ae:getlockedTransactionsOperation>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'html',
			path :'/wstraffic/services/LockTransactionForPaymentService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};


	return MFP.Server.invokeHttp(input);
}
function reconciliatePendingTransactions()
{
	//MFP.Logger.warn("Driver_and_Vechicles_reconciliationAdapter:: reconciliatePendingTransactions::Scheduled call");
	var ProcessedTransactions = "";
	try
	{
		var result = getAllPendingTransactions();
		if (result.Envelope.Body != undefined && result.Envelope.Body != null)
		{
			if (result.Envelope.Body.getAllPendingTransactions.responseCode != undefined &&
					result.Envelope.Body.getAllPendingTransactions.responseCode != null &&
					result.Envelope.Body.getAllPendingTransactions.responseCode == 1
			)
				try
			{
					var pendingTransactions = result.Envelope.Body.getAllPendingTransactions.allPendingTransactions.pendingTransaction;
					if(pendingTransactions != undefined && pendingTransactions != null)
					{
						var pendingTransactionsLength=0;
						if(pendingTransactions.length == undefined)
						{
							pendingTransactionsLength = 1;
							pendingTransactions = [pendingTransactions];
						}
						else
						{
							pendingTransactionsLength = pendingTransactions.length;
						}
						for (var i = 0 ; i<pendingTransactionsLength;i++)
							try
						{
								var trafficFileNo = pendingTransactions[i].trafficFileNumber;
								if(trafficFileNo != undefined && trafficFileNo != null)
								{
									var serviceCode = pendingTransactions[i].serviceCode;
									var transactionId = pendingTransactions[i].transactionId;
									var paymentDetails = getPaymentDetails(transactionId);
									var now = new Date();
									var unlockStatus = {};
									if(paymentDetails.statusTime == null ||  (now.getTime() - paymentDetails.statusTime) >= 600000)
									{
										if(paymentDetails.paymentMethod == "epay")
										{
											result = checkEPayStatus(transactionId,trafficFileNo,serviceCode,paymentDetails.spTrn,paymentDetails.appID);
											//if(result.paymentStatus == "Failure")
											//	unlockStatus = unlockEntity(transactionId);
										}
										else if(paymentDetails.paymentMethod == "mpay")
										{
											result = checkMPayStatus(transactionId,trafficFileNo,serviceCode, null,paymentDetails.spTrn,paymentDetails.appID);
											//if(result.paymentStatus == "Failure")
												//unlockStatus = unlockEntity(transactionId);
										}
										else{
											try
											{
												result = checkEPayStatus(transactionId,trafficFileNo,serviceCode,paymentDetails.spTrn,paymentDetails.appID);
											}
											catch(ex)
											{
												result.paymentStatus = "Failure";
											}
											if(result.paymentStatus == "Failure")
												try
											{
													result = checkMPayStatus(transactionId,trafficFileNo,serviceCode, null, paymentDetails.spTrn,paymentDetails.appID);
											}
											catch(ex)
											{
												result.paymentStatus = "Failure";
											}
											if(result.paymentStatus == "Failure")
											{
												//unlockStatus = unlockEntity(transactionId);
												var appIDXML = (paymentDetails.appID != undefined && paymentDetails.appID != null && paymentDetails.appID != "") ? ("<name>appID</name><value>"+paymentDetails.appID+"</value>"): "";
												var cData = "<![CDATA[<parameters><name>serviceCode</name><value>"+serviceCode+"</value><name>status</name><value>FAILURE</value><name>trafficFileNo</name><value>"+trafficFileNo+"</value><name>statusTime</name><value>"+ now.getTime() +"</value>"+appIDXML+"</parameters>]]>";
												result = setTransactionData(transactionId,2,cData);
											}

										}
										ProcessedTransactions+=(i == 0 ? "" : "|") + "paymentMethod: "+paymentDetails.paymentMethod+",Transaction Id: " +transactionId+", Execution Result: " + result.executionStatus + ", Payment Status:" + result.paymentStatus+ ", payAsPostpone Status:" + result.payAsPostponedStatus;
									}
								}
						}
						catch(ex)
						{
							ProcessedTransactions+=ex;
						}
					}
			}
			catch(e)
			{
				ProcessedTransactions+=e;
			}
		}
	}
	catch(e)
	{
		ProcessedTransactions+=e;
	}
	//MFP.Logger.warn("Driver_and_Vechicles_reconciliationAdapter:: Processed Transactions:" + ProcessedTransactions);
	var response = {ProcessedTransactions:ProcessedTransactions};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [response]
	};
	return MFP.Server.invokeProcedure(invocationData); 
}
function unLockLockedTransactions(){
	try
	{
		MFP.Logger.warn("Driver_and_Vechicles_reconciliationAdapter:: Unlocking Transactions Started in time : "+ new Date());
		var result = getAllLockedTransactions();
		var unlockResult = 0;
		var unlockedTransactionsList = [];
		var transactions = [];
		var unlockedStatusResult = 'failed';
		if (result  != undefined && result.Envelope.Body != undefined && result.Envelope.Body != null)
		{
			if (result.Envelope.Body.lockedTransactionsResponse.errorResponse.responseCode != undefined &&
					result.Envelope.Body.lockedTransactionsResponse.errorResponse.responseCode != null &&
					result.Envelope.Body.lockedTransactionsResponse.errorResponse.responseCode == 1){
				unlockedTransactionsList = result.Envelope.Body.lockedTransactionsResponse.transactionIdsList.id;
				if(unlockedTransactionsList != undefined &&  unlockedTransactionsList != null){
					if(unlockedTransactionsList.constructor === "test".constructor){
						unlockedTransactionsList = [unlockedTransactionsList];
					}

					for(var i = 0 ;i<unlockedTransactionsList.length;i++){
						var currentTrasactionID = unlockedTransactionsList[i] ;
						MFP.Logger.warn("Driver_and_Vechicles_reconciliationAdapter:: Unlocking Transaction : "+currentTrasactionID);
						unlockEntity(currentTrasactionID);
						unlockedStatusResult = 'success'
					}
				}
			}
		}
		return{
			unlockedStatusResult:unlockedStatusResult,
			unlockedTransactionsList:unlockedTransactionsList
		}
	}catch(e){
		return{
			unlockedStatusResult:'Exception : '+e.message
		}
	}
}
function getStatusTime(transactionId) {
	var credentials = getTrafficCredentials();
	var request = 	"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ae='http://ae.gov.trf.stp.ws.MobilityPaymentLogService'>"+
	"<soapenv:Header>"+
	"<ae:password>"+credentials.password+"</ae:password>"+
	"<ae:username>"+credentials.userName+"</ae:username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ae:getByTransactionId>"+
	"<ae:transactionId>"+transactionId+"</ae:transactionId>"+
	"</ae:getByTransactionId>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :'/ws/services/MobilityPaymentLogService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};


	var result = MFP.Server.invokeHttp(input);
	var statusTime = null;
	if (result.Envelope.Body != undefined && result.Envelope.Body != null &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode != undefined &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode != null &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode == 1
	)
	{
		try
		{
			var cData = result.Envelope.Body.getByTransactionIdReturn.serviceTransaction.cData;
			statusTime = getParameterValueFromCData(cData,"statusTime");
			if(isNaN(statusTime))
				statusTime = null;
		}
		catch(ex){
			statusTime = null;
		}

	}

	return statusTime;
}

function getPaymentDetails(transactionId) {
	var credentials = getTrafficCredentials();
	var request = 	"<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ae='http://ae.gov.trf.stp.ws.MobilityPaymentLogService'>"+
	"<soapenv:Header>"+
	"<ae:password>"+credentials.password+"</ae:password>"+
	"<ae:username>"+credentials.userName+"</ae:username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ae:getByTransactionId>"+
	"<ae:transactionId>"+transactionId+"</ae:transactionId>"+
	"</ae:getByTransactionId>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :'/ws/services/MobilityPaymentLogService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};


	var result = MFP.Server.invokeHttp(input);
	var paymentMethod = null;
	var spTrn = null;
	var statusTime = null;
	var appID = null;
	if (result.Envelope.Body != undefined && result.Envelope.Body != null &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode != undefined &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode != null &&
			result.Envelope.Body.getByTransactionIdReturn.responseCode == 1
	)
	{
		try
		{
			var cData = result.Envelope.Body.getByTransactionIdReturn.serviceTransaction.cData;
			paymentMethod = getParameterValueFromCData(cData,"paymentMethod");
			statusTime = getParameterValueFromCData(cData,"statusTime");
			appID = getParameterValueFromCData(cData,"appID");
			spTrn = getParameterValueFromCData(cData,"spTRN");
			if(spTrn == undefined || spTrn == null || spTrn == "undefined" || spTrn == "null" || spTrn == "")
			{
				var serviceCode = getParameterValueFromCData(cData,"serviceCode");
				spTrn = getSpTrn(transactionId,serviceCode,paymentMethod);
			}
		}
		catch(ex){}

	}

	return {
		paymentMethod : paymentMethod,
		spTrn : spTrn,
		statusTime : statusTime,
		appID : appID
	};
}

function getSpTrn(transactionId,serviceCode,paymentMethod){
	var numOfZeros = 21 - transactionId.length - serviceCode.length;
	var paddedTransactionId = "";
	for(var i = 0; i < numOfZeros; i++)
		paddedTransactionId+="0";
	paddedTransactionId+=transactionId;
	var paymentMethodLetter = paymentMethod;
	if(paymentMethod == "epay")
		paymentMethodLetter = "E";
	else if(paymentMethod == "mpay")
		paymentMethodLetter = "M";
	var spTrn = "ETF"+ paymentMethodLetter + serviceCode + paddedTransactionId;
	return spTrn;
}

function getParameterValueFromCData(cData,parameterName)
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

function getValueFromXML(xmlString,tagName)
{
	var tag = "<"+tagName+">";
	return xmlString.substring(xmlString.lastIndexOf(tag)+tag.length,xmlString.lastIndexOf("</"+tagName+">"));
}

function getTransactionStatus(transactionId) {
	var transactionStatus = "NotFound";
	var credentials = getTrafficCredentials();
	var request = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.gov.trf.trs.ws.TransactionInquiryService">'+
	'<soapenv:Header>'+
	'<password xsi:type="xsd:string">'+credentials.password+'</password>'+
	'<username xsi:type="xsd:string">'+credentials.userName+'</username>'+
	'</soapenv:Header>'+
	'<soapenv:Body>'+
	'<ae:getTransactionStatus soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'+
	'<transactionId xsi:type="xsd:long">'+transactionId+'</transactionId>'+
	'<username xsi:type="xsd:string">'+credentials.userName+'</username>'+
	'</ae:getTransactionStatus>'+
	'</soapenv:Body>'+
	'</soapenv:Envelope>';

	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'xml',
			path :'/ws/services/TransactionInquiryService',
			body : {
				content : request,
				contentType : 'text/xml; charset=utf-8'
			}
	};

	var result = MFP.Server.invokeHttp(input);
	try
	{
		var cData = result.Envelope.Body.getTransactionStatusResponse.getTransactionStatusReturn.CDATA;
		transactionStatus = getValueFromXML(cData,"status");
	}
	catch(ex)
	{
	}
	return {transactionStatus:transactionStatus};
}

function unlockEntity(transactionId)
{
	var invocationData = {
			adapter : 'drivers_and_vehicles_trafficAdapter',
			procedure : 'unlockEntity',
			parameters : [transactionId]
	};
	return MFP.Server.invokeProcedure(invocationData);
}
function isUndefinedOrNull(v)
{
	if(v == undefined || v == null || v == "undefined")
		result = true;
	else
		result = false;
	return result;
}