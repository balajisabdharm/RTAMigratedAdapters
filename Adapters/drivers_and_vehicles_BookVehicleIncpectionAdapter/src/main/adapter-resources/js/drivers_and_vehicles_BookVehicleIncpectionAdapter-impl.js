/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 *  MFP.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *
 *  	// Optional
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "plain", "xml", "html"
 *  	returnedContentEncoding : 'encoding',
 *  	parameters: {name1: value1, ... },
 *  	headers: {name1: value1, ... },
 *  	cookies: {name1: value1, ... },
 *  	body: {
 *  		contentType: 'text/xml; charset=utf-8' or similar value,
 *  		content: stringValue
 *  	},
 *  	transformation: {
 *  		type: 'default', or 'xslFile',
 *  		xslFile: fileName
 *  	}
 *  }
 */


var username_cis = "Mobstguser";
var password_cis = "m792!du)+1g";

// get all services

function getGlobalServices(vehicleType, isEncryptResponse, encryptionPassword){
	var bodyRequest ='<sch:getGlobalServicesRequest>';
	if (vehicleType != undefined && vehicleType != null) {
		bodyRequest += '<sch:vclId>' + vehicleType + '</sch:vclId>';
	}
	bodyRequest += '</sch:getGlobalServicesRequest>';
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getGlobalServices request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
		MFP.Logger.warn("getGlobalServices result | " + result);
	return result ;
	
}

//get all centers

function getAvailableAppointmentCenters (isEncryptResponse, encryptionPassword){
	var bodyRequest ="<sch:getAvailableAppointmentCentersRequest/>";
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentCenters request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentCenters result | " + result);
	return result;
}
//get all centers on specific date

function getAvailableAppointmentCentersByDate (date,isEncryptResponse, encryptionPassword){
	var bodyRequest ="<sch:getAvailableAppointmentCentersRequest>";
		bodyRequest +="<sch:date>" + date + "</sch:date>";
		bodyRequest +="</sch:getAvailableAppointmentCentersRequest>";
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentCentersByDate request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentCentersByDate result | " + result);
	return result;
}
//get lanes on specific center

function getAvailableAppointmentCenterLanes(centerId,appointmentId,isEncryptResponse, encryptionPassword){
	
	var bodyRequest ='<sch:getAvailableAppointmentCenterLanesRequest>';
	if (centerId != undefined && centerId != null) {
	bodyRequest += '<sch:ctrId>' + centerId + '</sch:ctrId>';
	}
	bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
	bodyRequest += '</sch:getAvailableAppointmentCenterLanesRequest>';
	
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentCenterLanes request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentCenterLanes result | " + result);
	return result;
}
//get all centers on specific date

function getAvailableAppointmentCentersByDate (date,isEncryptResponse, encryptionPassword){
	var bodyRequest ="<sch:getAvailableAppointmentCentersRequest>";
		bodyRequest +="<sch:date>" + date + "</sch:date>";
		bodyRequest +="</sch:getAvailableAppointmentCentersRequest>";
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentCentersByDate request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentCentersByDate result | " + result);
	return result;
}
//add appointment to backet to book appoitment

function addAppointmentToBasket(vehicleType,vehiclesNumber,serviceID,ownerType,isEncryptResponse, encryptionPassword){
	var bodyRequest ="<sch:addAppointmentToBasketRequest>";
		bodyRequest +="<sch:addSlotAppointment>";
			bodyRequest +="<sch:vclId>"+ vehicleType +"</sch:vclId>";
			bodyRequest +="<sch:noOfVehicles>"+ vehiclesNumber +"</sch:noOfVehicles>";
			bodyRequest +="<sch:selectedServices>";
				bodyRequest +="<sch:service>";
					bodyRequest +="<sch:id>"+ serviceID +"</sch:id>";

				bodyRequest +="</sch:service>";
			

			bodyRequest +="</sch:selectedServices>";
			bodyRequest +="<sch:ownerType>"+ ownerType +"</sch:ownerType>";

		bodyRequest +="</sch:addSlotAppointment>";
		
	bodyRequest +="</sch:addAppointmentToBasketRequest>"
		
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("addAppointmentToBasket request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("addAppointmentToBasket result | " + result);
	return result;
}
//get available slots on specific lane

function getAvailableAppointmentTimeSlots(centerId,appointmentId,updateMode,appointmentDay,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:getAvailableAppointmentTimeSlotsRequest>';
		bodyRequest += '<sch:vtcId>' + centerId + '</sch:vtcId>';
		bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
		bodyRequest += '<sch:isUpdateMode>' + updateMode + '</sch:isUpdateMode>';
		bodyRequest += '<sch:appointmentDay>' + appointmentDay + '</sch:appointmentDay>';
		bodyRequest += '</sch:getAvailableAppointmentTimeSlotsRequest>';



	
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentTimeSlots request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentTimeSlots result | " + result);
	return result ;
}
//get available slots on specific lane

function getAvailableLaneAppointmentTimeSlots(laneId,appointmentId,updateMode,appointmentDay,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:getAvailableLaneAppointmentTimeSlotsRequest>';
		bodyRequest += '<sch:tlnId>' + laneId + '</sch:tlnId>';
		bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
		bodyRequest += '<sch:isUpdateMode>' + updateMode + '</sch:isUpdateMode>';
		bodyRequest += '<sch:appointmentDay>' + appointmentDay + '</sch:appointmentDay>';
		bodyRequest += '</sch:getAvailableLaneAppointmentTimeSlotsRequest>';



	
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableLaneAppointmentTimeSlots request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableLaneAppointmentTimeSlots result | " + result);
	return result ;
}

//get available slots on specific lane

function getAvailableAppointmentTimeSlots(centerId,appointmentId,updateMode,appointmentDay,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:getAvailableAppointmentTimeSlotsRequest>';
		bodyRequest += '<sch:vtcId>' + centerId + '</sch:vtcId>';
		bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
		bodyRequest += '<sch:isUpdateMode>' + updateMode + '</sch:isUpdateMode>';
		bodyRequest += '<sch:appointmentDay>' + appointmentDay + '</sch:appointmentDay>';
		bodyRequest += '</sch:getAvailableAppointmentTimeSlotsRequest>';



	
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAvailableAppointmentTimeSlots request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAvailableAppointmentTimeSlots result | " + result);
	return result ;
}

//submit appoitment location and time

function submitAppointmentLocationAndTime(UpdateMode,laneId,appointmentId,appointmentTimeFrome,appointmentTimeTo,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:submitAppointmentLocationAndTimeRequest>';
		bodyRequest += '<sch:isUpdateMode>' + UpdateMode + '</sch:isUpdateMode>';
		bodyRequest += '<sch:appointment>';
			bodyRequest += '<sch:tlnId>' + laneId + '</sch:tlnId>';
			bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
			bodyRequest += '<sch:appointmentTimeFrom>' + appointmentTimeFrome + '</sch:appointmentTimeFrom>';
			bodyRequest += '<sch:appointmentTimeTo>' + appointmentTimeTo + '</sch:appointmentTimeTo>';	
		bodyRequest += '</sch:appointment>';
		bodyRequest += '</sch:submitAppointmentLocationAndTimeRequest>';

	
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("submitAppointmentLocationAndTime request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("submitAppointmentLocationAndTime result | " + result);
	return result
}

// submit contacts details
function submitContactDetails(appointmentId,firstName,lastName,email,mobileNo,emiCode,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:submitContactDetailsRequest>';
		bodyRequest += '<sch:aptId>' + appointmentId + '</sch:aptId>';
		bodyRequest += '<sch:firstNameAr></sch:firstNameAr>';
		bodyRequest += '<sch:lastNameAr></sch:lastNameAr>';
		bodyRequest += '<sch:firstNameEn>' + firstName + '</sch:firstNameEn>';
		bodyRequest += '<sch:lastNameEn>' + lastName + '</sch:lastNameEn>';
		bodyRequest += '<sch:email>' + email + '</sch:email>';
		bodyRequest += '<sch:mobileNo>' + mobileNo + '</sch:mobileNo>';
		bodyRequest += '<sch:address></sch:address>';
		bodyRequest += '<sch:emiCode>' + emiCode + '</sch:emiCode>';
		bodyRequest += '</sch:submitContactDetailsRequest>';
		
	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("submitContactDetails request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("submitContactDetails result | " + result);
	return result ;
}

//confirm appointment

function confirmAppointment(appointmentId,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:confirmAppointmentRequest>';
		bodyRequest += '<sch:aptId>'+ appointmentId +'</sch:aptId>';
		bodyRequest += '</sch:confirmAppointmentRequest>';

	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("confirmAppointment request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("confirmAppointment result | " + result);
	return result ;
}

function getAppointmentBasket(appointmentId,isEncryptResponse, encryptionPassword){
	
	var bodyRequest = '<sch:getAppointmentBasketRequest>';
		bodyRequest += '<sch:aptId>'+ appointmentId +'</sch:aptId>';
		bodyRequest += '</sch:getAppointmentBasketRequest>';

	var request = getRequestString(bodyRequest);

	var requestObj = buildBody([ request ], true);
	MFP.Logger.warn("getAppointmentBasket request | " + requestObj);
	var result = invokeWebServiceString(requestObj, isEncryptResponse,
			encryptionPassword);
	MFP.Logger.warn("getAppointmentBasket result | " + result);
	return result ;
}





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

function getRequestString(bodyString) {
	var requestDate = new Date(Date.now());
	var requestDateFormated = requestDate.toISOString(); // Returns
	// 2011-10-05T14:48:00.000Z
	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.rta.ae/ActiveMatrix/ESB/AppointmentService/XMLSchema/Schema.xsd">'
		+ '<soapenv:Header>'
		+ '<wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/">'
		+ '<wsse:UsernameToken>'
		+ '<wsse:Username>'
		+ username_cis
		+ '</wsse:Username>'
		+ '<wsse:Password>'
		+ password_cis
		+ '</wsse:Password>'
		+ '</wsse:UsernameToken>'
		+ '</wsse:Security>'
		+ '</soapenv:Header>'
		+ '<soapenv:Body>'
		+ bodyString
		+ '</soapenv:Body>' + '</soapenv:Envelope>';
	return request.toString();
}

function invokeWebServiceString(request, isEncryptResponse, encryptionPassword) {
	MFP.Logger.warn(request);
	var input = {
			method : 'post',
			headers : {
				"SOAPAction" : ""
			},
			returnedContentType : 'HTML',
			path : '/appointmentService',
			body : {
				content : JSON.parse(request),
				contentType : 'text/xml; charset=utf-8'
			}
	};

	var webServiceResult = MFP.Server.invokeHttp(input);
	MFP.Logger.warn(webServiceResult);
	MFP.Logger.warn(JSON.stringify(webServiceResult));
	if (isEncryptResponse != undefined && isEncryptResponse == true) {
		var responseString = JSON.stringify(webServiceResult);
		var invocationData = {
				adapter : 'drivers_and_vehciles_utilitiesAdapter',
				procedure : 'encryptData',
				parameters : [ responseString, encryptionPassword ]
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
