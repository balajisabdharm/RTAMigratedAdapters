/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
var user = {
		username: 'tariq',
		password: '321321'
};
var externalUser = {
		username: 'PORTAL_USER',
		password: 'justfortest'
};
/**
 *  MFP.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "javascript", "plain", "xml", "html"  
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

/**
 * @param interest
 *            must be one of the following: world, africa, sport, technology,
 *            ... (The list can be found in
 *            http://edition.cnn.com/services/rss/)
 * @returns json list of items
 */
function getAvailableDeliveryDetails(transactionId) {
	var path = "/soap/availableDeliveryDetails";
	var getAvailableDeliveryDetailsRequest = '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.trs.rta.ae">'
			+ '<soapenv:Header>'
			+ '<username>' + user.username + '</username>'
			+ '<password>' + user.password + '</password>'
			+ '<externalUsername>' + externalUser.username + '</externalUsername>'
			+ '<externalUserPassword>' + externalUser.password + '</externalUserPassword>'
			+ '</soapenv:Header>'
			+ '<soapenv:Body>'
			+ '<ws:getAvailableDelivery soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'
			+ '<transactionId xsi:type="xsd:long">' + transactionId + '</transactionId>'
			+ '<centerCode xsi:type="xsd:in">99</centerCode>'
			+ '</ws:getAvailableDelivery>'
			+ '</soapenv:Body>'
			+ '</soapenv:Envelope>';
	var input = {
		method : 'post',
		returnedContentType : 'xml',
		path : path,
		body : {
			content : getAvailableDeliveryDetailsRequest.toString(),
			contentType : 'text/xml; charset=utf-8'
		}
	};

	return MFP.Server.invokeHttp(input);
}
