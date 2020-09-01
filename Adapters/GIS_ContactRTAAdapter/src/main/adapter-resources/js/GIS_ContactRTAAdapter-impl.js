function createServiceToken()
{
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : '/arcgis/tokens/?request=gettoken&username='+ new String('RTADOM%5CSSDSVCADMIN')+'&password='+new String('@dm!n4svc')+'&f=pjson'
	};


	return {
		response:MFP.Server.invokeHttp(input)
	}
}
//https://gisint.rta.ae/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&outFields=*&f=pjson
function getRtaServices(token){
	try{
		
		
	if(!token) token= createServiceToken().response.token;
MFP.Logger.info("GIS_ContactRTAAdapter/getRtaServices/ Token " + token);
	var invocationData= {
		adapter: 'CentersAdapter',
		procedure: 'getCenters',
		parameters: []
	};
		
	var centers = MFP.Server.invokeProcedure(invocationData);
	MFP.Logger.info("GIS_ContactRTAAdapter/getRtaServices/response  centers======== " + centers);
	var customerHappinessCenters= centers.customerHappinessCenters;
	var vehicleTestingCenters= centers.vehicleTestingCenters;
	var drivingSchoolsCenters= centers.drivingSchoolsCenters;
	var marineTicketOfficesCenters= centers.marineTicketOfficesCenters
	var busTicketOfficesCenters=centers.busTicketOfficesCenters

	var result =[] ;
	for (var i = 0 ; i< customerHappinessCenters.length;i++){
		result.push(customerHappinessCenters[i]);
	}
	
	for (var i = 0 ; i< vehicleTestingCenters.length;i++){
		result.push(vehicleTestingCenters[i]);
	}
	for (var i = 0 ; i< drivingSchoolsCenters.length;i++){
		result.push(drivingSchoolsCenters[i]);
	}
	for (var i = 0 ; i< marineTicketOfficesCenters.length;i++){
		result.push(marineTicketOfficesCenters[i]);
	}
	for (var i = 0 ; i< busTicketOfficesCenters.length;i++){
		result.push(busTicketOfficesCenters[i]);
	}
	
	
	
	MFP.Logger.info("GIS_ContactRTAAdapter/getRtaServices/response  result======== " + result);
	
	return {
		features:result
	}
	}catch(e){return {error: e}}
}

function getCenters(token){
	try{
	if(!token) token= createServiceToken().response.token;
	var customerHappinessCenters= getCustomerHappinessCenters(token).features;
	var vehicleTestingCenters= getVehicleTestingCenters(token).features;
	var drivingSchoolsCenters= getDrivingSchoolsCenters(token).features;
	var marineTicketOfficesCenters= getMarineTicketOfficesCenters(token).features;
	var busTicketOfficesCenters= getBusTicketOfficesCenters(token).features;

	return {
		customerHappinessCenters:customerHappinessCenters,
		vehicleTestingCenters:vehicleTestingCenters,drivingSchoolsCenters:drivingSchoolsCenters,marineTicketOfficesCenters:marineTicketOfficesCenters,busTicketOfficesCenters:busTicketOfficesCenters
	}
	}catch(e){return {error: e}}
}
function getCustomerHappinessCenters(token){
	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';
	/*	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&token='+token+'&outFields=*&f=pjson';*/
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);
}
function getVehicleTestingCenters(token){
	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/19/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';
	/*	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&token='+token+'&outFields=*&f=pjson';*/
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);
}
function getDrivingSchoolsCenters(token){
	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/20/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';
	/*	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&token='+token+'&outFields=*&f=pjson';*/
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);
}

function getMarineTicketOfficesCenters(token){
	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/2/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';
	/*	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&token='+token+'&outFields=*&f=pjson';*/
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);
}

function getBusTicketOfficesCenters(token){
	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/3/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';
	/*	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/1/query?where=1=1&token='+token+'&outFields=*&f=pjson';*/
	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);
}
//customer happiness centers 1
//vehicle testing centers 19
//driving schools 20
//marine ticket office 2
//bus ticket office 3


function getRtaNolAndSalikOnly(){
	var tokenResponse = createServiceToken();
	if(tokenResponse && tokenResponse.response && !tokenResponse.error)
	{
		var token = tokenResponse.response.token;

		var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/4/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';

		var input = {
				method : 'post',
				returnedContentType : 'json',
				path : folmulatedPath
		};
		return MFP.Server.invokeHttp(input);
	}
	return "error"
}



function getRtaNolAndSalik(token){


	var folmulatedPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/4/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';

	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : folmulatedPath
	};
	return MFP.Server.invokeHttp(input);      

}

function getHappinessCentersKiosks(token){

	var happinessPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/5/query?where=1=1&outFields=*&outSR=4326&token='+token+'&f=pjson';

	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : happinessPath
	};
	return  MFP.Server.invokeHttp(input);
}

function getNolSalikKiosks(token){
	var salikNolPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/6/query?where=1=1&outSR=4326&token='+token+'&outFields=*&f=pjson';

	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : salikNolPath
	};

	return MFP.Server.invokeHttp(input);

}

function getSalikGates(){
	return [{"titleEn":"Al Barsha","titleAr":"البرشاء","pos":[25.1175861,55.19235]},{"titleEn":"Al Garhoud","titleAr":"القرهود","pos":[25.2316036,55.3355]},{"titleEn":"Al Maktoum","titleAr":"المكتوم","pos":[25.2532673,55.3222923]},{"titleEn":"Al Mamzar south","titleAr":"الممزر (جنوب)","pos":[25.2863255,55.35925]},{"titleEn":"Al Safa","titleAr":"الصفا","pos":[25.1942749,55.2619]},{"titleEn":"Airport tunnel","titleAr":"نفق المطار","pos":[25.24913,55.38721]},{"titleEn":"Al Mamzar north","titleAr":"الممزر (شمال)","pos":[25.296854,55.3610725]},{"titleEn":"Jebel Ali","titleAr":"جبل علي","pos":[25.0279617,55.1012878]}];
}


function getContactRTAData() {
	var tokenResponse = createServiceToken();
	if(tokenResponse && tokenResponse.response && !tokenResponse.error){
		var token = tokenResponse.response.token

		var data = {
				services:getRtaServices(token).features,
				kiosks:{"salikNol":getNolSalikKiosks(token).features,"happinessCenters":getHappinessCentersKiosks(token).features},
				salik:getSalikGates()
		}
		return data;
	}else{
		return {
			error:tokenResponse.error
		}
	}
}
function getKiosks(withSalikNol) {
	var tokenResponse = createServiceToken();
	if(tokenResponse && tokenResponse.response && !tokenResponse.error){
		var token = tokenResponse.response.token
		if (!withSalikNol){
			return {
				"kiosks":{
					"happinessCenters":getHappinessCentersKiosks(token).features
				}
			}
		}else {
			return {
				"kiosks":{
					"salikNol":getNolSalikKiosks(token).features,
					"happinessCenters":getHappinessCentersKiosks(token).features
				}
			}
		}


	}else{
		return {
			error:tokenResponse.error
		}
	}
}

function trustedAgentsQuery(token){

	var happinessPath='/arcgis/rest/services/Smart_Services/RTA_CSC_PP_Google_API_v2/MapServer/6/query?where=1=1&outFields=*&outSR=4326&token='+token+'&f=pjson';

	var input = {
			method : 'post',
			returnedContentType : 'json',
			path : happinessPath
	};
	return  MFP.Server.invokeHttp(input);
}


function getTrustedAgents() {
	var tokenResponse = createServiceToken();
	if(tokenResponse && tokenResponse.response && !tokenResponse.error){
		var token = tokenResponse.response.token
			return {
			
				"TrustedAgents":trustedAgentsQuery(token).features			
			}
	}else{
		return {
			error:tokenResponse.error
		}
	}
}


