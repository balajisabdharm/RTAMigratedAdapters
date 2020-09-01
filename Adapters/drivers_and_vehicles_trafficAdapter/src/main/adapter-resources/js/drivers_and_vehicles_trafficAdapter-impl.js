
var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';
var userName = "%#credentials!#!username#%";
var password = "%#credentials!#!password#%";
var IsDebugging;
var username_traffic = "%#credentials!#!username_traffic#%";
var password_traffic = "%#credentials!#!password_traffic#%";
var externalUsername = "%#credentials!#!externalUsername#%";
var externalPassword = "%#credentials!#!externalPassword#%";
function savePhoto(params, isEncryptResponse, encryptionPassword) {

	var envHeader = {
			"urn:username" : username_traffic,
			"urn:password" : password_traffic
	};
	//var parameters = [params];
	var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:SaveAttachmentsService"';
	var parameters = [envHeader,params, "", _soapEnvNS];

	var request = buildBody(parameters, false);

	request = request.replace(new RegExp("urn: ", 'g'), "urn:");

	/*	if(request == null || request == undefined )
	return {Body:"Failure"};
	else
		return {Body : request};*/
	var servicePath='/wstraffic/services/SaveAttachmentsService';
	var requestInput = {
			method : 'post',
			returnedContentType : 'xml',
			path :servicePath,
			headers : {
				"SOAPAction" : 'impl'
			},
			body : {
				content :request,
				contentType : 'text/xml; charset=utf-8'
			}
	};
	/*if(requestInput == null || requestInput == undefined )
 		return {Body:"Failure"};
 		else
 			return {Body : requestInput};*/
//	Log("!!! "+parameters.toString());
	//return {body:requestInput};
	var webServiceResult = MFP.Server.invokeHttp(requestInput);
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

function fineManagementService(params, isEncryptResponse, encryptionPassword){
	var envHeader = {		
			"wsse:Password" : "m792!du)+1g",
			"wsse:Username" : "Mobstguser"
	};
	var servicePath= '/LAGeneralFinesInquiryService';
	//xmlns:cli="http://client.ws.ffu.traffic.services.internet.ae"
		var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lag="http://www.rta.ae/EIP/LAGeneralFinesInquiryService/LAGeneralFinesInquiryService_Schema"';
	var parameters = [envHeader,params, '', _soapEnvNS];
	var request = buildBody(parameters, false);

	//Log("RetrieveFinesService request >> " + request);
	var response = invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
	
	if(response.Envelope != undefined && response.Envelope.Body != undefined && response.Envelope.Body.getFineResponse != undefined && response.Envelope.Body.getFineResponse != null &&
		response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo != undefined && 
		response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo != null	){
		
	
	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerPassportNo="";
	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerMobileNumber="";
	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerNameAr="";
	response.Envelope.Body.getFineResponse.getFineDetails.ownerInfo.ownerNameEn="";
	}
	return response;

}

function FFULookupInfoService(params, isEncryptResponse, encryptionPassword){
	var envHeader = { 
			"ae:authenticationHeader" :{
				"ae:externalUsername" : externalUsername,
				"ae:externalUserPassword" :externalPassword,
				"ae:username" : username_traffic,
				"ae:password" : password_traffic
			}
	};
	var servicePath= '/wstraffic/services/FFULookupInfoService';
	var _soapEnvNS=soapEnvNS+ 'xmlns:ae="http://ae:client.ws.ffu.traffic.services.internet.ae"';
	var parameters = [envHeader, params, '', _soapEnvNS];
	var request = buildBody(parameters, false);

	//Log("FFULookupInfoService request >> " + request);
	return invokeWebService(request, servicePath, null, isEncryptResponse, encryptionPassword);
}

function SeasonalCardService(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var _soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:ws="http://ws.pss.rta.ae"';
	var parameters = [envHeader, params, "", _soapEnvNS];
	var request = buildBody(parameters, false);
	//Log("request to be sent:\n"+request);
	var servicePath = '/wstraffic/services/SeasonalCardService';
	return invokeWebService(request,servicePath, null, isEncryptResponse, encryptionPassword);
}
function SeasonalParkingPermitTransaction(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var isValid = true;
	var violations = "";
	var cardsData = {};
	try{
		var envHeadersPSS = {			
				"password" : params.password,
				"username" : params.username,

		};

		var soapEnvNSPSS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:ws="http://ws.pss.rta.ae"';
		cardsData = params["cardsData"];	
		invocationData = {
				adapter : 'drivers_and_vehicles_PermitAdapter',
				procedure : 'getSeasonalApplicationIdByTransactionId',
				parameters : [params]
		};
		var getApplicationIdResult = MFP.Server.invokeProcedure(invocationData);	

		var applicationId = getApplicationIdResult.Envelope.Body.SeasonalApplicationIdByTransactionIdResponse.seasonalApplicationId;
		//Log(applicationId);		
		for(var i=1;i<=3;i++){
			if(cardsData["card-"+i]!=null){
				var singleCardData = cardsData["card-"+i];
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

				var cardRequestCData = "<![CDATA["+
				"<addCard>"+
				"<username>"+params.username+"</username>"+
				"<trafficId>"+singleCardData.trafficFileId+"</trafficId>"+
				"<applicationId>"+applicationId+"</applicationId>"+
				"<cardPeriod>"+singleCardData.lot.periodCode+"</cardPeriod>"+
				"<cardType>"+singleCardData.lot.typeCode+"</cardType>"+
				"<activationDate>"+issueDateObj.toISOString()+"</activationDate>"+
				"</addCard>"+
				"]]>";
				//Log(cardRequestCData);
				serviceParams = {
						"ws:addCard":{
							"request":cardRequestCData
						}
				};
				var parameters = [envHeadersPSS, serviceParams, "", soapEnvNSPSS];
				var request = buildBody(parameters, false);
				//Log("add card request to be sent:\n"+request);
				var servicePath = '/wstraffic/services/SeasonalCardService';
				var addCardResult = invokeWebService(request,servicePath);

				var addCardResultCData = addCardResult.Envelope.Body.addCardResponse.addCardReturn.CDATA;				
				var statusStartPos = addCardResultCData.indexOf("<status>") + 8;
				var statusEndPos = addCardResultCData.indexOf("</status>");
				var status = addCardResultCData.substring(statusStartPos,statusEndPos);
				//Log("card status = "+status);
				if(status == "Success"){
					var cardIdStartPos = addCardResultCData.indexOf("<cardId>") + 8;
					var cardIdEndPos = addCardResultCData.indexOf("</cardId>");
					var cardId = addCardResultCData.substring(cardIdStartPos,cardIdEndPos);
					cardsData["card-"+i].cardId = cardId;
					for(var j=0;j<singleCardData.vehiclesPlates.length;j++){
						var vehiclePlateData = singleCardData.vehiclesPlates[j];
						var oldCardNumber = "";
						if(vehiclePlateData.oldCardNumber!=null){
							oldCardNumber = vehiclePlateData.oldCardNumber;
						}
						//add vehicle to card
						//Log("adding vehicle");
						var vehicleRequestCData = "<![CDATA["+
						"<addVehicle>"+
						"<username>"+params.username+"</username>"+
						"<cardId>"+cardId+"</cardId>"+
						"<plateSource>"+vehiclePlateData.emirate+"</plateSource>"+
						"<plateCategoryCode>"+vehiclePlateData.plateCategoryId+"</plateCategoryCode>"+
						"<plateNo>"+vehiclePlateData.plateNo+"</plateNo>"+
						"<CFIPlateCode>"+vehiclePlateData.plateCode+"</CFIPlateCode>"+
						"<plateCodeId>"+vehiclePlateData.plateCodeId+"</plateCodeId>"+
						"<oldCardNumber>" +
						oldCardNumber + 
						"</oldCardNumber>"+
						"</addVehicle>"+
						"]]>";				
						serviceParams = {
								"ws:addVehicle":{
									"request":vehicleRequestCData
								}
						};
						parameters = [envHeadersPSS, serviceParams, "", soapEnvNSPSS];
						request = buildBody(parameters, false);
						//Log("request to be sent:\n"+request);
						servicePath = '/wstraffic/services/SeasonalCardService';
						var addVehicleResult = invokeWebService(request,servicePath);				
						var addVehicleResultCData = addVehicleResult.Envelope.Body.addVehicleResponse.addVehicleReturn.CDATA;
						var statusStartPos = addVehicleResultCData.indexOf("<status>") + 8;
						var statusEndPos = addVehicleResultCData.indexOf("</status>");
						var status = addVehicleResultCData.substring(statusStartPos,statusEndPos);
						//Log("vehicle status = "+status);
						if(status != "Success"){
							var violationsStartPos = addVehicleResultCData.indexOf("<violations>") + 12;
							var violationsEndPos = addVehicleResultCData.indexOf("</violations>");
							var violations = addVehicleResultCData.substring(violationsStartPos,violationsEndPos);
							isValid = false;
							break;
						}
					}
				}else{
					//MFP.Logger.error(addCardResultCData);
					var violationsStartPos = addCardResultCData.indexOf("<violations>") + 12;
					var violationsEndPos = addCardResultCData.indexOf("</violations>");
					var violations = addCardResultCData.substring(violationsStartPos,violationsEndPos);
					isValid = false;
					break;
				}
			}
		}
	}catch(e)
	{
		//MFP.Logger.error(e);
		isValid = false;
	}
	var responseReturned =  {valid : isValid , violations : violations, updatedCardsData: cardsData};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [responseReturned]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function SeasonalParkingPermitTransaction_DD(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var isValid = true;
	var violations = "";
	var cardsData = {};
	var response = '',cardData ={};
	try{
		var envHeadersPSS = {			
				"password" : params.password,
				"username" : params.username,

		};

		var soapEnvNSPSS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" '+'xmlns:ws="http://ws.pss.rta.ae"';
		cardsData = params["cardsInfo"]["cardsData"];	
		cardsTransactionInfo = params["cardsInfo"]["transactionInfo"];	
		invocationData = {
				adapter : 'drivers_and_vehicles_PermitAdapter',
				procedure : 'getSeasonalApplicationIdByTransactionId_DD',
				parameters : [params]
		};
		var getApplicationIdResult = MFP.Server.invokeProcedure(invocationData);	

		var applicationId = getApplicationIdResult.Envelope.Body.SeasonalApplicationIdByTransactionIdResponse.seasonalApplicationId;
		//Log(applicationId);
		var cardsLength = cardsData.length , i=0;
		for(var i;i<=cardsLength;i++){
			if(cardsData[i]!=null){
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

				var trafficFileId = singleCardData.plates[0].trafficFileId ;
				if(trafficFileId == undefined || trafficFileId == null || trafficFileId == ''){
					trafficFileId = cardsTransactionInfo.trafficFileNo;
				}
				var cardRequestCData = "<![CDATA["+
				"<addCard>"+
				"<username>"+params.username+"</username>"+
				"<trafficId>"+trafficFileId+"</trafficId>"+
				"<applicationId>"+applicationId+"</applicationId>"+
				"<cardPeriod>"+singleCardData.lot.periodCode+"</cardPeriod>"+
				"<cardType>"+singleCardData.lot.typeCode+"</cardType>"+
				"<activationDate>"+singleCardData.issueDate+"</activationDate>"+
				//"<activationDate>"+new Date(singleCardData.issueDate).toISOString()+"</activationDate>"+
				"</addCard>"+
				"]]>";
				cardData = params;
				//Log(cardRequestCData);
				serviceParams = {
						"ws:addCard":{
							"request":cardRequestCData
						}
				};
				var currentDate = new Date();
				if(new Date(singleCardData.issueDate) > currentDate) {
					var parameters = [envHeadersPSS, serviceParams, "", soapEnvNSPSS];
					var request = buildBody(parameters, false);
					//Log("add card request to be sent:\n"+request);
					var servicePath = '/wstraffic/services/SeasonalCardService';
					var addCardResult = invokeWebService(request,servicePath);

					var addCardResultCData = addCardResult.Envelope.Body.addCardResponse.addCardReturn.CDATA;				
					var statusStartPos = addCardResultCData.indexOf("<status>") + 8;
					var statusEndPos = addCardResultCData.indexOf("</status>");
					var status = addCardResultCData.substring(statusStartPos,statusEndPos);
					//Log("card status = "+status);
					if(status == "Success"){
						var cardIdStartPos = addCardResultCData.indexOf("<cardId>") + 8;
						var cardIdEndPos = addCardResultCData.indexOf("</cardId>");
						var cardId = addCardResultCData.substring(cardIdStartPos,cardIdEndPos);
						singleCardData.cardId = cardId;
						for(var j=0;j<singleCardData.plates.length;j++){
							var vehiclePlateData = singleCardData.plates[j];
							var oldCardNumber = "";
							if(vehiclePlateData.oldCardNumber!=null){
								oldCardNumber = vehiclePlateData.oldCardNumber;
							}
							//add vehicle to card
							//Log("adding vehicle");
							var vehicleRequestCData = "<![CDATA["+
							"<addVehicle>"+
							"<username>"+params.username+"</username>"+
							"<cardId>"+cardId+"</cardId>"+
							"<plateSource>"+vehiclePlateData.plateSource+"</plateSource>"+
							"<plateCategoryCode>"+vehiclePlateData.plateCategoryId+"</plateCategoryCode>"+
							"<plateNo>"+vehiclePlateData.plateNo+"</plateNo>"+
							"<CFIPlateCode>"+vehiclePlateData.plateCFICode+"</CFIPlateCode>"+
							"<plateCodeId>"+vehiclePlateData.plateCodeId+"</plateCodeId>"+
							"<oldCardNumber>" +
							oldCardNumber + 
							"</oldCardNumber>"+
							"</addVehicle>"+
							"]]>";				
							serviceParams = {
									"ws:addVehicle":{
										"request":vehicleRequestCData
									}
							};
							parameters = [envHeadersPSS, serviceParams, "", soapEnvNSPSS];
							request = buildBody(parameters, false);
							//Log("request to be sent:\n"+request);
							servicePath = '/wstraffic/services/SeasonalCardService';
							var addVehicleResult = invokeWebService(request,servicePath);				
							serviceParams = addVehicleResult ; 
							var addVehicleResultCData = addVehicleResult.Envelope.Body.addVehicleResponse.addVehicleReturn.CDATA;
							var statusStartPos = addVehicleResultCData.indexOf("<status>") + 8;
							var statusEndPos = addVehicleResultCData.indexOf("</status>");
							var status = addVehicleResultCData.substring(statusStartPos,statusEndPos);
							//Log("vehicle status = "+status);
							if(status != "Success"){
								response = {'result':addVehicleResultCData , 'method' : 'addVehicle' }; 
								var violationsStartPos = addVehicleResultCData.indexOf("<violations>") + 12;
								var violationsEndPos = addVehicleResultCData.indexOf("</violations>");
								var violations = addVehicleResultCData.substring(violationsStartPos,violationsEndPos);
								if(violations.indexOf("This vehicle already exists") >-1){
									var startEnglishInput = violations.indexOf("This vehicle already exists") + 27;
									var vehicleAdded = " "+vehiclePlateData.plateNo+" "+vehiclePlateData.plateCFICode+" " ;
									var output = [violations.slice(0, startEnglishInput), vehicleAdded, violations.slice(startEnglishInput)].join('');
									var startArabicInput = output.indexOf("توجد بطاقة مواقف فعالة لهذه المركبة") + 35;
									output = [output.slice(0, startArabicInput), vehicleAdded, output.slice(startArabicInput)].join('')
									violations = output;
								}else if (violations.indexOf("Only light vehicles can be added to a seasonal card") > -1){
									var startEnglishInput = violations.indexOf("Only light vehicles can be added to a seasonal card") + 51;
									var vehicleAdded = "  please change vehicle "+vehiclePlateData.plateNo+" "+vehiclePlateData.plateCFICode+" " ;
									var output = [violations.slice(0, startEnglishInput), vehicleAdded, violations.slice(startEnglishInput)].join('');
									var startArabicInput = output.indexOf("لا يمكن إصدار بطاقة موسمية لمركبة غير خفيفة") + 43;
									vehicleAdded = "  قم بتغيير المركبة "+vehiclePlateData.plateNo+" "+vehiclePlateData.plateCFICode+" " ;
									output = [output.slice(0, startArabicInput), vehicleAdded, output.slice(startArabicInput)].join('')
									violations = output;
								}
								isValid = false;
								break;
							}
						}
					}else{
						response = {'result':addCardResultCData , 'method' : 'addCard' }; 
						//MFP.Logger.error(addCardResultCData);
						var violationsStartPos = addCardResultCData.indexOf("<violations>") + 12;
						var violationsEndPos = addCardResultCData.indexOf("</violations>");
						var violations = addCardResultCData.substring(violationsStartPos,violationsEndPos);
						isValid = false;
						break;
					}
				}else{
					var issueDateFailedResponse = "<?xml version='1.0' encoding='utf-8'?><addVehicleResponse><vehicle-info><status>Failed</status><violations><violation><description-ar><![CDATA[عذرا، تاريخ تفعيل التصريح منتهى برجاء إختيار تاريخ تفعيل صالح ]]></description-ar><description-en><![CDATA[The Permit activatation date is expired , please choose a valid activation date]]></description-en></violation></violations></vehicle-info></addVehicleResponse>"
					var dates = {issuedDate:singleCardData.issueDate , currentDate : currentDate}
						response = {'result':issueDateFailedResponse , 'method' : dates }; 
					//MFP.Logger.error(addCardResultCData);
					var violationsStartPos = issueDateFailedResponse.indexOf("<violations>") + 12;
					var violationsEndPos = issueDateFailedResponse.indexOf("</violations>");
					var violations = issueDateFailedResponse.substring(violationsStartPos,violationsEndPos);
					isValid = false;
					break;
				}
			}
		}
	}catch(e)
	{
		response = e.message ; 
		//MFP.Logger.error(e);
		isValid = false;
	}
	var responseReturned =  {valid : isValid , violations : violations, updatedCardsData: cardsData,response:response,serviceParams:serviceParams};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [responseReturned]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function TransactionServiceService_operation(envHeader, params, httpHeaders, isEncryptResponse, encryptionPassword) {
	var result;
	// Pass xml request in case of getAvailableDelivery operation, because of parameters order.
	if(params["ws:getAvailableDelivery"] != undefined)
	{
		var requestString = 	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" >'+
		'<soapenv:Header>'+
		'<username>'+username_traffic+'</username>'+
		'<password>'+password_traffic+'</password>'+
		'<externalUserPassword>'+externalPassword+'</externalUserPassword>'+
		'<externalUsername>'+externalUsername+'</externalUsername>'+
		'</soapenv:Header>'+
		'<soapenv:Body>' +
		'<ws:getAvailableDelivery xmlns:ws="http://ws.trs.rta.ae">' +
		'<transactionId>'+params["ws:getAvailableDelivery"].transactionId+'</transactionId>' +
		'<centerCode>'+params["ws:getAvailableDelivery"].centerCode+'</centerCode>'+
		'</ws:getAvailableDelivery>' +
		'</soapenv:Body>' +
		'</soapenv:Envelope>';
		var servicePath = '/wstraffic/services/TransactionService';
		var parameters = [requestString];
		var request = buildBody(parameters, true);
		result = invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);
		try{
			MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
		}catch(e){
			MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :"+e);
		}
	}
	else
		if(params["ws:payAsPostponed"] != undefined)
		{
			var requestString =
				'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://traffic2/traffic/services/TransactionService" xmlns:ws="http://ws.trs.rta.ae">'+
				'<soapenv:Header>'+
				'<tran:externalUserPassword>'+externalPassword+'</tran:externalUserPassword>'+
				'<tran:externalUsername>'+externalUsername+'</tran:externalUsername>'+
				'<tran:password>'+password_traffic+'</tran:password>'+
				'<tran:username>'+username_traffic+'</tran:username>'+
				'</soapenv:Header>'+
				'<soapenv:Body>'+
				'<ws:payAsPostponed>'+
				'<transactionId>'+params["ws:payAsPostponed"].transactionId+'</transactionId>'+
				'<username>'+params["ws:payAsPostponed"].username+'</username>'+
				'</ws:payAsPostponed>'+
				'</soapenv:Body>'+
				'</soapenv:Envelope>';
			var servicePath = '/wstraffic/services/TransactionService';
			var parameters = [requestString];
			var request = buildBody(parameters, true);
			result = invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);
			try{
				MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
			}catch(e){
				MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :"+e);
			}
		}
		else
		{
			var soapEnvNS = 'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ';

			var parameters = [envHeader, params, 'xmlns:ws="http://ws.trs.rta.ae"', soapEnvNS];
			var request = buildBody(parameters, false);

			//MFP.Logger.debug("request to be sent:\n"+request);
			servicePath='/wstraffic/services/TransactionService';
			result = invokeWebService(request, servicePath, httpHeaders, isEncryptResponse, encryptionPassword);
			try{
				MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |Transaction Process | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
			}catch(e){
				MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | Transaction Process | Exception :"+e);
			}
		}

		if(result.Envelope.Body  != undefined  && 
				result.Envelope.Body  != null  &&
				result.Envelope.Body.setAvailableDeliveryResponse != undefined &&
				result.Envelope.Body.setAvailableDeliveryResponse != null ){
			result.Envelope.requestString = "";
			if(result.requestString != undefined && result.requestString != null){
				result.requestString = "";
			}
		}
	return result;
}

function TransactionServiceService_operationStringRequest(request, isEncryptResponse, encryptionPassword) { 
	//MFP.Logger.debug("request to be sent:\n"+request);

	var parameters = [request];
	var request = buildBody(parameters, true);
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

function createTransaction(innerXml, isEncryptResponse, encryptionPassword){

	var res = "<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
	" xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' "+ 
	" xmlns:ws='http://ws.trs.rta.ae'>"+
	"<soapenv:Header>"+
	"<externalUserPassword>" + externalPassword + "</externalUserPassword>"+
	"<externalUsername>" + externalUsername + "</externalUsername>"+
	"<password>" + password_traffic + "</password>"+
	"<username>" + username_traffic + "</username>"+
	"</soapenv:Header>"+
	"<soapenv:Body>"+
	"<ws:createTransaction>"+
	"<request>" + innerXml + "</request>"+
	"</ws:createTransaction>"+
	"</soapenv:Body>"+
	"</soapenv:Envelope>";

	var servicePath = '/wstraffic/services/TransactionService';
	var parameters = [res];
	var request = buildBody(parameters, true);
	var result = invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);

	try{
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | create Transaction | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | create Transaction | Exception :"+e);
	}
	
	return result;
	}
function cancelTransaction(transactionId, cancelationReason, isEncryptResponse, encryptionPassword){

	var res = 
		'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tran="http://traffic2/traffic/services/TransactionService" xmlns:ws="http://ws.trs.rta.ae">'+
		'<soapenv:Header>'+
		'<tran:externalUserPassword>'+externalPassword+'</tran:externalUserPassword>'+
		'<tran:externalUsername>'+externalUsername+'</tran:externalUsername>'+
		'<tran:password>'+password_traffic+'</tran:password>'+
		'<tran:username>'+username_traffic+'</tran:username>'+
		'</soapenv:Header>'+
		'<soapenv:Body>'+
		'<ws:cancelTransaction>'+
		'<transactionId>'+transactionId+'</transactionId>'+
		'<username>'+username_traffic+'</username>'+
		'<cancelationReason>'+cancelationReason+'</cancelationReason>'+
		'</ws:cancelTransaction>'+
		'</soapenv:Body>'+
		'</soapenv:Envelope>';

	var servicePath = '/wstraffic/services/TransactionService';
	var parameters = [res];
	var request = buildBody(parameters, true);
	var result = invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);
	try{
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |cancel Transaction | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | cancel Transaction | Exception :"+e);
	}
	return result;
}

//this function used when thw user has already made payment as cach at the training center 

function payAsCash(transactionid, isEncryptResponse, encryptionPassword){
	var res="<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' "
		+"xmlns:tran='http://traffic2/traffic/services/TransactionService' xmlns:ws='http://ws.trs.rta.ae'>"
		+ "<soapenv:Header>"
		+ "<tran:externalUserPassword>"+password+"</tran:externalUserPassword>"
		+ "<tran:externalUsername>"+userName+"</tran:externalUsername>"
		+"<tran:password>"+password+"</tran:password>"
		+"<tran:username>"+userName+"</tran:username>"
		+" </soapenv:Header>"
		+"<soapenv:Body>"
		+"<ws:payByCash>"
		+"<transactionId>"+transactionid+"</transactionId>"
		+"<username>"+userName+"</username>"
		+"<centerCode>1493</centerCode>"
		+"</ws:payByCash>"
		+" </soapenv:Body>"
		+"</soapenv:Envelope>";


	var servicePath = '/wstraffic/services/TransactionService';
	var parameters = [res];
	var request = buildBody(parameters, true);
	var result = invokeWebServiceString(request,servicePath, isEncryptResponse, encryptionPassword);

	//MFP.Logger.warn("payASCash result.Envelope::" + JSON.stringify(result.Envelope));
	return result;

}



function createOwnershipCertificateTransaction(trafficFileNo, username, centerCode, chasissNo, cauCode, serviceCode) {
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
function invokeWebServiceString(request, servicePath, isEncryptResponse, encryptionPassword) {
	var input = {
			method : 'post',
			headers :{
				"SOAPAction" : ""
			},
			returnedContentType : 'HTML',
			path :servicePath,
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
	return MFP.Server.invokeProcedure(invocationData);}
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
			path:servicePath,
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
	//Log("time for "+ servicePath + " is " + (endTime - startTime) + " ms");
	webServiceResult.requestString = body.toString();
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

function recertifySeasonalParkingServices(request,result, isEncryptResponse, encryptionPassword)
{
	var responseReturned;
	if(request.indexOf("<ws:createTransaction") >= 0) // createTransaction Operation
	{
		var serviceCode = getParameterValueFromCData(request,"setviceCode");
		if(serviceCode == "601" || serviceCode == "602" || serviceCode == "101" || serviceCode == "4")
		{
			if (result.Envelope.Body.createTransactionResponse.createTransactionReturn !=undefined && 
					result.Envelope.Body.createTransactionResponse.createTransactionReturn.CDATA != undefined
			)																		// createTransaction was performed successfully
			{
				var cData = result.Envelope.Body.createTransactionResponse.createTransactionReturn.CDATA;
				var transactionId = getParameterValueFromCData(cData,"transactionId");
				var response;
				if(transactionId != undefined && transactionId != null && transactionId != "")
				{
					var trafficFileNo = getParameterValueFromCData(request,"trafficFileNo");
					var centerCode = getParameterValueFromCData(request,"centerCode");
					var innerXML = "<![CDATA["
						+ "<createTransaction>"
						+ "<setviceCode>" + serviceCode + "</setviceCode>"
						+ "<trafficFileNo>"
						+ trafficFileNo
						+ "</trafficFileNo>"
						+ "<username>"
						+ username_traffic
						+ "</username>"
						+ "<centerCode>"
						+ centerCode
						+ "</centerCode>"
						+ "<parameters>"
						+ "<parameter>"
						+ "<name>transactionId</name>"
						+ "<value>"
						+ transactionId
						+ "</value>"
						+ "</parameter>"
						+ "</parameters>"
						+ "</createTransaction>" + "]]>";
					var requestString = 
						"<soapenv:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'"+ 
						" xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ws='http://ws.trs.rta.ae'>"+
						"<soapenv:Header>"+
						"<username>"+username_traffic+"</username>"+
						"<password>"+password_traffic+"</password>"+
						"<externalUsername>"+externalUsername+"</externalUsername>"+
						"<externalUserPassword>"+externalPassword+"</externalUserPassword>"+
						"</soapenv:Header>"+
						"<soapenv:Body>"+
						"<ws:reCertifyTransaction>"+
						"<request xsi:type='xsd:string'>"+
						innerXML+"</request>"+
						"</ws:reCertifyTransaction>"+
						"</soapenv:Body>"+
						"</soapenv:Envelope>"; 
					var servicePath = '/wstraffic/services/TransactionService';
					var parameters = [requestString];
					var recertifyRequest = buildBody(parameters, true);
					response = invokeWebServiceString(recertifyRequest,servicePath);
					// Check that recertifyTransaction was performed successfully.
					if (response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn !=undefined && 
							response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn.CDATA != undefined
					)
					{
						var cData = response.Envelope.Body.reCertifyTransactionResponse.reCertifyTransactionReturn.CDATA;
						var transactionId = getParameterValueFromCData(cData,"transactionId");
						if(transactionId != undefined && transactionId != null && transactionId != "")
							responseReturned = result;
						else
							responseReturned = response;
					}
					else
						responseReturned = response;
				}
				else
					responseReturned = result;
			}
			else
				responseReturned = result;
		}
		else
			responseReturned = result;
	}
	else
		responseReturned = result;
	if(isEncryptResponse != undefined && isEncryptResponse == true)
	{
		var responseString = JSON.stringify(responseReturned);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [responseString,encryptionPassword]
		};
		responseReturned = MFP.Server.invokeProcedure(invocationData);
	}	
	try{
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |recertify Transaction | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(responseReturned));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter | recertify Transaction | Exception :"+e);
	}
	
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [responseReturned]
	};
	return MFP.Server.invokeProcedure(invocationData);
	
}

function lockEntity(transactionId,spTrn,spCode,serviceCode){

	if(spCode == undefined || spCode == null || spCode =="")
		spCode = MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE");
	if(serviceCode == undefined || serviceCode == null || serviceCode =="")
		serviceCode = MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE");
	var res = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.rta.trs.LockTransactionForPaymentService">' +
	'<soapenv:Header>' +
	'<ae:password>'+password_traffic+'</ae:password>' +
	'<ae:username>'+username_traffic+'</ae:username>' +
	'</soapenv:Header>' +
	'<soapenv:Body>' +
	'<ae:lockDEGTrsEntities>' +
	'<transactionId>'+transactionId+'</transactionId>' +
	'<degRefCustCode>'+spTrn+'</degRefCustCode>' +
	'<spCode>'+spCode+'</spCode>' +
	'<serviceCode>'+serviceCode+'</serviceCode>' +
	'<lockingType>1</lockingType>' +
	'</ae:lockDEGTrsEntities>' +
	'</soapenv:Body>' +
	'</soapenv:Envelope>';
	var servicePath = '/wstraffic/services/LockTransactionForPaymentService';
	var parameters = [res];
	var request = buildBody(parameters, true);
	var result = invokeWebServiceString(request,servicePath);
	try{
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Request : " + JSON.stringify(request) + ", Response: "+JSON.stringify(result));
	}catch(e){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Exception :"+e);
	}
	var lockStatus = "FAILURE";
	try
	{
		if((result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != undefined && 
				result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != null &&
				result.Envelope.Body.lockDEGTrsEntitiesResponse.refNo != "") && (result.Envelope.Body.lockDEGTrsEntitiesResponse.errorResponse.responseCode == "1"))
			lockStatus = "SUCCESS";
	}
	catch(ex){
		MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |lockEntity  | Exception :"+ex);
	}

	var responseReturned =  {lockStatus:lockStatus, response:result,request:request};
	var invocationData = {
			adapter : 'drivers_and_vehciles_utilitiesAdapter',
			procedure : 'deleteCredientails',
			parameters : [responseReturned]
	};
	return MFP.Server.invokeProcedure(invocationData);
}

function unlockEntity(transactionId, isEncryptResponse, encryptionPassword){
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
	var invocationResult = {unlockStatus:'SUCCESS'};
	var result = {unlockStatus:'SUCCESS', invocationResult:invocationResult};
	return result;
}
