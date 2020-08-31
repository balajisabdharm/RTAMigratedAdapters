function getChannelCredentials() {
    return {
         username : "mobile_user",
		password : "Test@1234"
        //password : "eyprtm"   //Production
    };
}

function getExternalChannelCredentials() {
    return {
        externalUsername : "mobile_user",
        externalPassword : "Test@1234"
        //externalPassword : "eyprtm" //Production
    };
}

function getWidgetsRefreshIntervals() {
    return {
        smartParking     : 120000,
        fines            : 300000,
        vehicles        : 300000,
        plates            : 300000,
        license            : 300000,
        salik            : 60000,
        permit    : 300000
    };
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

function getTibcoCredentials() {
    return {
        username_tibco : MFP.Server.getPropertyValue("wsse.tibco.username"),
        password_tibco : MFP.Server.getPropertyValue("wsse.tibco.password"),
    };
}

function getTrafficCredentials() {
    return {
        username : "mobile_user",
        password : "Test@1234"
        //password : "eyprtm" //Production
        };
}
function getTibcoMode()
{
    return {tibcoMode:false};
}
function getApplicationSettings(encryptionKey)
{
    var thisYear;
    try
    {
        thisYear = new Date().getFullYear();
        if(thisYear == undefined || thisYear == null || thisYear == "")
            thisYear = 2019;
    }
    catch(ex)
    {
        thisYear = 2019;
    }
    
    // Ramdan Parking Times
    /*var parkingDurations=[{ zoneCode:"A",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"B",
        durationFees:[{duration:"1", fees:"3"},{duration:"2", fees:"6"},{duration:"3", fees:"9"},{duration:"4", fees:"12"},{duration:"5", fees:"15"},{duration:"14", fees:"20"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"14"
    },
    {    zoneCode:"C",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"5"},{duration:"3", fees:"8"},{duration:"4", fees:"11"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"D",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"4"},{duration:"3", fees:"5"},{duration:"4", fees:"7"},{duration:"14", fees:"10"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"14"
    },
    {    zoneCode:"E",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"11:00PM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"F",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"5"},{duration:"3", fees:"8"},{duration:"4", fees:"11"}],
        timing:[{from:"08:00AM",to:"06:00PM"}],
        maxDurationBySMS:"4"
    },
    { zoneCode:"G",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"4"
    },
    { zoneCode:"H",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}
        ,{duration:"5", fees:"20"},{duration:"6", fees:"24"},{duration:"7", fees:"28"},{duration:"8", fees:"32"},{duration:"9", fees:"36"}
        ,{duration:"10", fees:"40"},{duration:"11", fees:"44"},{duration:"12", fees:"48"},{duration:"13", fees:"52"},{duration:"14", fees:"56"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"4"
    }
    ,
    { zoneCode:"I",
        durationFees:[{duration:"1", fees:"10"},{duration:"2", fees:"20"},{duration:"3", fees:"30"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"3"
    },
    { zoneCode:"J",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"3"
    },
    { zoneCode:"K",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"13"
    },
    { zoneCode:"L",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}
        ,{duration:"5", fees:"20"},{duration:"6", fees:"24"},{duration:"7", fees:"28"},{duration:"8", fees:"32"},{duration:"9", fees:"32"}
        ,{duration:"10", fees:"32"},{duration:"11", fees:"32"},{duration:"12", fees:"32"},{duration:"13", fees:"32"},{duration:"14", fees:"32"},{duration:"15", fees:"32"},{duration:"16", fees:"32"},{duration:"17", fees:"32"},{duration:"18", fees:"32"},{duration:"19", fees:"32"},{duration:"20", fees:"32"},{duration:"21", fees:"32"},{duration:"22", fees:"32"},{duration:"23", fees:"32"},{duration:"24", fees:"32"}],
        timing:[{from:"08:00AM",to:"06:00PM"},{from:"08:00PM",to:"12:00AM"}],
        maxDurationBySMS:"24"
    }
    ];*/
    
    
    var parkingDurations=[{ zoneCode:"A",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"B",
        durationFees:[{duration:"1", fees:"3"},{duration:"2", fees:"6"},{duration:"3", fees:"9"},{duration:"4", fees:"12"},{duration:"5", fees:"15"},{duration:"14", fees:"20"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"14"
    },
    {    zoneCode:"C",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"5"},{duration:"3", fees:"8"},{duration:"4", fees:"11"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"D",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"4"},{duration:"3", fees:"5"},{duration:"4", fees:"7"},{duration:"14", fees:"10"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"14"
    },
    {    zoneCode:"E",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"11:00PM"}],
        maxDurationBySMS:"4"
    },
    {    zoneCode:"F",
        durationFees:[{duration:"1", fees:"2"},{duration:"2", fees:"5"},{duration:"3", fees:"8"},{duration:"4", fees:"11"}],
        timing:[{from:"08:00AM",to:"06:00PM"}],
        maxDurationBySMS:"4"
    },
    { zoneCode:"G",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"4"
    },
    { zoneCode:"H",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}
        ,{duration:"5", fees:"20"},{duration:"6", fees:"24"},{duration:"7", fees:"28"},{duration:"8", fees:"32"},{duration:"9", fees:"36"}
        ,{duration:"10", fees:"40"},{duration:"11", fees:"44"},{duration:"12", fees:"48"},{duration:"13", fees:"52"},{duration:"14", fees:"56"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],
        maxDurationBySMS:"4"
    }
    ,
    { zoneCode:"I",
        durationFees:[{duration:"1", fees:"10"},{duration:"2", fees:"20"},{duration:"3", fees:"30"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],//need to be asked
        maxDurationBySMS:"3"
    },
    { zoneCode:"J",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"}],
        timing:[{from:"08:00AM",to:"10:00PM"}],//need to be asked
        maxDurationBySMS:"3"
    },
    { zoneCode:"K",
        durationFees:[{duration:"1/2", fees:"2"},{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}],/*
        ,{duration:"5", fees:"20"},{duration:"6", fees:"24"},{duration:"7", fees:"28"},{duration:"8", fees:"32"},{duration:"9", fees:"36"}
        ,{duration:"10", fees:"40"},{duration:"11", fees:"44"},{duration:"12", fees:"48"},{duration:"13", fees:"52"},{duration:"14", fees:"56"}],*/
        timing:[{from:"08:00AM",to:"10:00PM"}],//need to be asked for kml values
        maxDurationBySMS:"13"
    },
    { zoneCode:"L",
        durationFees:[{duration:"1", fees:"4"},{duration:"2", fees:"8"},{duration:"3", fees:"12"},{duration:"4", fees:"16"}
        ,{duration:"5", fees:"20"},{duration:"6", fees:"24"},{duration:"7", fees:"28"},{duration:"8", fees:"32"},{duration:"9", fees:"32"}
        ,{duration:"10", fees:"32"},{duration:"11", fees:"32"},{duration:"12", fees:"32"},{duration:"13", fees:"32"},{duration:"14", fees:"32"},{duration:"15", fees:"32"},{duration:"16", fees:"32"},{duration:"17", fees:"32"},{duration:"18", fees:"32"},{duration:"19", fees:"32"},{duration:"20", fees:"32"},{duration:"21", fees:"32"},{duration:"22", fees:"32"},{duration:"23", fees:"32"},{duration:"24", fees:"32"}],
        timing:[{from:"24HOURS",to:"7DAYS"}],
        maxDurationBySMS:"24"
    }
    ];
    
    
    var parkingDurationValues = [{duration:"1/2",value:"30"},{duration:"1",value:"1"},{duration:"2",value:"2"},{duration:"3",value:"3"},{duration:"4",value:"4"},{duration:"5",value:"5"}
    ,{duration:"5",value:"5"},{duration:"6",value:"6"},{duration:"7",value:"7"},{duration:"8",value:"8"},{duration:"9",value:"9"},{duration:"10",value:"10"}
    ,{duration:"11",value:"11"},{duration:"12",value:"12"},{duration:"13",value:"13"},{duration:"14",value:"14"},{duration:"15",value:"15"},{duration:"16",value:"16"},{duration:"17",value:"17"},{duration:"18",value:"18"},{duration:"19",value:"19"},{duration:"20",value:"20"},{duration:"21",value:"21"},{duration:"22",value:"22"},{duration:"23",value:"23"},{duration:"24",value:"24"}];
    var blockedServices = [    /*{    serviceId:    "69",
                                message:    {
                                                messageTitleEn:"Coming Soon",
                                                messageTitleAr:"ستفعل قريباً",
                                                messageContentEn:"This service is currently under development and will be added soon",
                                                messageContentAr:"هذه الخدمة حالياً فى مرحلة التطوير و ستفعل قريباً"
                                            }
                            }*/
                               ];
    var getLocationOptions = {
            frequency : 1000,
            timeout : 5000,
            enableHighAccuracy: false // may cause errors if true
    };
    var watchPositionOptions = {
            frequency : 1000,
            timeout : 5000,
            enableHighAccuracy: false // may cause errors if true
    };
    var donationServices = [
                           /* // renew registeration
                            {    serviceId:    "227",
                                amount:1
                            },
                            // renew license
                            {    serviceId:    "1075",
                                amount:1
                            },
                            // fines
                            {    serviceId:    "1060",
                                amount:1
                            }*/
                            ];
    var now = new Date();
    var currentDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    var moileFirstcurrentDate =  new Date(now.getTime());
    var vipDeploymentDate= new Date("2018/06/01");
    var VIPFeatureExpiryDate =  vipDeploymentDate.setMonth(vipDeploymentDate.getMonth() + 5);
    return     {
        VIPFeatureExpiryDate : new Date(VIPFeatureExpiryDate),
        moileFirstcurrentDate : moileFirstcurrentDate,
        currentDate : currentDate,
        currentYear : thisYear,
        tibcoMode : getTibcoMode().tibcoMode,
        centerCode : "1493",
        isEncryptWebservices : false,
        encryptionPassword : generatePassword(encryptionKey),
        encryptionStrength : 128,
        widgetsRefreshIntervals : getWidgetsRefreshIntervals(),
        salikSMSNumber : "5959",
        numOfInvocationTrials : 3,
        parkingDurations : parkingDurations,
        parkingDurationValues : parkingDurationValues,
        parkingSMSFees : 0.3,
        // Production URL
        /*kmlUrl : 'https://m.rta.ae/index/smartgov/apps/parking_zones/parking_zones.kml',
        zonesJsonUrl : 'https://m.rta.ae/index/smartgov/apps/parking_zones/parking_zones.json',
        kmzUrl : 'https://m.rta.ae/index/smartgov/apps/parking_zones/parking_zones.kmz',*/
        
        
        // SIT URLs
        
        kmlUrl : 'https://mfp-staging.rta.ae:6443/index/smartgov/apps/parking_zones/parking_zones.kml',
        zonesJsonUrl : 'https://mfp-staging.rta.ae:6443/index/smartgov/apps/parking_zones/parking_zones.json',
        kmzUrl : 'https://mfp-staging.rta.ae:6443/index/smartgov/apps/parking_zones/parking_zones.kmz',
        
        
        centersClosureAlertDuration : 30,
        blockedServices : blockedServices,
        getLocationOptions : getLocationOptions,
        watchPositionOptions : watchPositionOptions,
        slidingWidgetsMaxRecords : 10,
        donationServices:donationServices
    };
}
function getMobileFirstCurrentDate(){
    var now = new Date();
    
    var moileFirstcurrentDate =  new Date(now.getTime());
    
    return{
        moileFirstcurrentDate : moileFirstcurrentDate
    }
}
//get Donation services for only drivers and vehicles
function getEtrafficDonationServices(){
    var donationServices = [
                            /*// renew registeration
                            {    serviceId:    "227",
                                amount:1
                            },
                            // renew license
                            {    serviceId:    "1075",
                                amount:1
                            },
                            // fines
                            {    serviceId:    "1060",
                                amount:1
                            }*/
                            ];
    return {
        donationServices : donationServices
    }
}
//get Donation services for only drivers and vehicles and PTA for Application RTA Dubai
function getDonationServices(){
    var donationServices = [
                            //renew registeration
                            {    serviceId:    "227",
                                amount:1
                            },
                            // fines
                            {    serviceId:    "1060",
                                amount:1
                            },
                            //Top up nol
                            {    serviceId:    "172",
                                amount:1
                            },
                            //Apply for Personalized nol Card
                            {    serviceId:    "171",
                                amount:1
                            }
                            ];
    return {
        donationServices : donationServices
    }
}
//get Donation services for only drivers and vehicles and PTA for Application RTA Dubai
function getDonationServices_iOS(){
    var donationServices = [
                            //renew registeration
                            {    serviceId:    "204",
                                amount:1
                            },
                            // fines
                            {    serviceId:    "301",
                                amount:1
                            },
                            //Top up nol
                            {    serviceId:    "172",
                                amount:1
                            },
                            //Apply for Personalized nol Card
                            {    serviceId:    "171",
                                amount:1
                            }
                            ];
    return {
        donationServices : donationServices
    }
}
/**
 * This function is used to replace the user/password strings
 * with the actual environment user/password
 *
 * @param envHeader
 * @returns
 */
function sendMail(fromMailAddress,subject, message,attachments) {

    var port = MFP.Server.getPropertyValue("drivers_and_vehicles_mail_port");
    var host = MFP.Server.getPropertyValue("drivers_and_vehicles_mail_host");
    var toMailAddress =  MFP.Server.getPropertyValue("drivers_and_vehicles_mail_toMailAddress");
    var user =  null;
    try {user = MFP.Server.getPropertyValue("drivers_and_vehicles_mail_user");} catch(ex){}
    var pass = null;
    try {pass = MFP.Server.getPropertyValue("drivers_and_vehicles_mail_pass");} catch(ex){}
    var sendEmail = new com.ibm.drivers_and_vehicles.MailSender();
    var sendNewEmail= sendEmail.sendNewEmail(host,port,toMailAddress,user,pass,fromMailAddress,subject, message,JSON.stringify(attachments));
    return {isSent : sendNewEmail};
}


function replaceCredentials(envHeader){
    MFP.Logger.info("replaceCredentials Start envHeader >> "+envHeader);
   var string = envHeader;
    string = this.replaceAll(string, "%#credentials!#!username#%", getChannelCredentials().username);
    string = this.replaceAll(string, "%#credentials!#!externalUsername#%", getExternalChannelCredentials().externalUsername);
    string = this.replaceAll(string, "%#credentials!#!username_tibco#%", getTibcoCredentials().username_tibco);
    string = this.replaceAll(string, "%#credentials!#!password#%", getChannelCredentials().password);
    string = this.replaceAll(string, "%#credentials!#!password_tibco#%", getTibcoCredentials().password_tibco);
    string = this.replaceAll(string, "%#credentials!#!externalPassword#%", getExternalChannelCredentials().externalPassword);
    string = this.replaceAll(string, "%#credentials!#!username_traffic#%", getTrafficCredentials().username);
    string = this.replaceAll(string, "%#credentials!#!password_traffic#%", getTrafficCredentials().password);

    MFP.Logger.debug("??????????????????????????????????????????");
    MFP.Logger.debug("converted Body " + string);
    MFP.Logger.debug("??????????????????????????????????????????");
   
    //Returning dummy response
    return string ;
   // return envHeader;
}

/**
 * This function will be used to build the xml soap request of
 * the web service request
 *
 * @param envHeader
 * @param params
 * @param namespaces
 * @param soapEnvNS
 * @returns {___anonymous2126_2136}
 */
function buildBody(envHeader, params, namespaces, soapEnvNS) {
    var body = '<soapenv:Envelope ' + soapEnvNS + '>\n'+ '<soapenv:Header>\n';

	body = jsonToXml(envHeader, body, namespaces);
	//body = jsonToXml(JSON.parse(envHeader), body.toString(), namespaces);
	body += '</soapenv:Header>\n';
	body += '<soapenv:Body>\n';
//	MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |body params : " + JSON.stringify([params, body, namespaces]));

	body  = jsonToXml(params, body, namespaces);
	//body = jsonToXml(JSON.parse(params), body.toString(), namespaces);

//	MFP.Logger.warn("|drivers_and_vehicles_trafficAdapter |body : " + JSON.stringify(body));

	
	body += '</soapenv:Body>\n' + '</soapenv:Envelope>\n';	

	//MFP.Logger.debug("******bo0000000dy " + body);
	body = replaceCredentials(body);

	return {body : body};
    //return JSON.parse(envHeader);
}

/**
 * This function will be used to return the request String
 * to be used after replacing the user/password.
 *
 * @param request
 * @returns {___anonymous2291_2301}
 */
function buildBodyFromStaticRequest(request) {
    MFP.Logger.info("&&&&&&&& Inside buildBodyStatic ");
	MFP.Logger.info("&&&&&&&& Inside buildBodyStatic "+ JSON.stringify(request));
	//MFP.Logger.info("&&&&&&&& "+request+" &&&&&&");
   // var body = JSON.stringify(replaceCredentials(request));
    var body = (replaceCredentials(request));
    MFP.Logger.info("&&&&&&&& "+body+" &&&&&&");
    return {body : body};
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

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function deleteCredientails(jsonObject){
    try{
        var jsonString = JSON.stringify(jsonObject),channelCredientials = getChannelCredentials() ,
        externalChannelCredentials = getExternalChannelCredentials() ,
        tibcoUserName = MFP.Server.getPropertyValue("wsse.tibco.username") ,
        tibcoPassword = MFP.Server.getPropertyValue("wsse.tibco.password");
        //jsonString =jsonString +channelCredientials.username+channelCredientials.password+externalChannelCredentials.username;
        var replacedString =  replaceAll(jsonString,channelCredientials.username,'');
        replacedString =  replaceAll(replacedString,channelCredientials.password,'');
        replacedString =  replaceAll(replacedString,externalChannelCredentials.externalUsername,'');
        replacedString =  replaceAll(replacedString,externalChannelCredentials.externalPassword,'');
        replacedString =  replaceAll(replacedString,tibcoUserName,'');
        replacedString =  replaceAll(replacedString,tibcoPassword,'');
        // change 'RTAUEPETRAPTST1' to 'RTAUEPRTRAPP01' when production
        replacedString =  replaceAll(replacedString,'RTAUEPRTRAPP03','');
        replacedString =  replaceAll(replacedString,'RTAUEPRTRAPP02','');
        replacedString =  replaceAll(replacedString,'RTAUEPRTRAPP01','');
        
        // SIT
        /*replacedString =  replaceAll(replacedString,'RTAUEPETRAPTST3','');
        replacedString =  replaceAll(replacedString,'RTAUEPETRAPTST2','');
        replacedString =  replaceAll(replacedString,'RTAUEPETRAPTST1','');
        */
        return JSON.parse(replacedString);
    }catch(exception){
        return jsonObject ;
    }

}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript                     (c) Chris Veness 2005-2014 / MIT License */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//Base64 library
!function(){function t(t){this.message=t}var r="undefined"!=typeof exports?exports:this,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";t.prototype=new Error,t.prototype.name="InvalidCharacterError",r.btoa||(r.btoa=function(r){for(var o,n,a=String(r),i=0,c=e,d="";a.charAt(0|i)||(c="=",i%1);d+=c.charAt(63&o>>8-i%1*8)){if(n=a.charCodeAt(i+=.75),n>255)throw new t("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");o=o<<8|n}return d}),r.atob||(r.atob=function(r){var o=String(r).replace(/=+$/,"");if(o.length%4==1)throw new t("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,a,i=0,c=0,d="";a=o.charAt(c++);~a&&(n=i%4?64*n+a:a,i++%4)?d+=String.fromCharCode(255&n>>(-2*i&6)):0)a=e.indexOf(a);return d})}();
//AES library
"use strict";var Aes={};if(Aes.cipher=function(e,r){for(var o=4,n=r.length/o-1,t=[[],[],[],[]],a=0;4*o>a;a++)t[a%4][Math.floor(a/4)]=e[a];t=Aes.addRoundKey(t,r,0,o);for(var f=1;n>f;f++)t=Aes.subBytes(t,o),t=Aes.shiftRows(t,o),t=Aes.mixColumns(t,o),t=Aes.addRoundKey(t,r,f,o);t=Aes.subBytes(t,o),t=Aes.shiftRows(t,o),t=Aes.addRoundKey(t,r,n,o);for(var s=new Array(4*o),a=0;4*o>a;a++)s[a]=t[a%4][Math.floor(a/4)];return s},Aes.keyExpansion=function(e){for(var r=4,o=e.length/4,n=o+6,t=new Array(r*(n+1)),a=new Array(4),f=0;o>f;f++){var s=[e[4*f],e[4*f+1],e[4*f+2],e[4*f+3]];t[f]=s}for(var f=o;r*(n+1)>f;f++){t[f]=new Array(4);for(var i=0;4>i;i++)a[i]=t[f-1][i];if(f%o==0){a=Aes.subWord(Aes.rotWord(a));for(var i=0;4>i;i++)a[i]^=Aes.rCon[f/o][i]}else o>6&&f%o==4&&(a=Aes.subWord(a));for(var i=0;4>i;i++)t[f][i]=t[f-o][i]^a[i]}return t},Aes.subBytes=function(e,r){for(var o=0;4>o;o++)for(var n=0;r>n;n++)e[o][n]=Aes.sBox[e[o][n]];return e},Aes.shiftRows=function(e,r){for(var o=new Array(4),n=1;4>n;n++){for(var t=0;4>t;t++)o[t]=e[n][(t+n)%r];for(var t=0;4>t;t++)e[n][t]=o[t]}return e},Aes.mixColumns=function(e){for(var r=0;4>r;r++){for(var o=new Array(4),n=new Array(4),t=0;4>t;t++)o[t]=e[t][r],n[t]=128&e[t][r]?e[t][r]<<1^283:e[t][r]<<1;e[0][r]=n[0]^o[1]^n[1]^o[2]^o[3],e[1][r]=o[0]^n[1]^o[2]^n[2]^o[3],e[2][r]=o[0]^o[1]^n[2]^o[3]^n[3],e[3][r]=o[0]^n[0]^o[1]^o[2]^n[3]}return e},Aes.addRoundKey=function(e,r,o,n){for(var t=0;4>t;t++)for(var a=0;n>a;a++)e[t][a]^=r[4*o+a][t];return e},Aes.subWord=function(e){for(var r=0;4>r;r++)e[r]=Aes.sBox[e[r]];return e},Aes.rotWord=function(e){for(var r=e[0],o=0;3>o;o++)e[o]=e[o+1];return e[3]=r,e},Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]],"undefined"!=typeof module&&module.exports&&(module.exports=Aes),"function"==typeof define&&define.amd&&define([],function(){return Aes}),"undefined"!=typeof module&&module.exports)var Aes=require("./aes");Aes.Ctr={},Aes.Ctr.encrypt=function(e,r,o){var n=16;if(128!=o&&192!=o&&256!=o)return"";e=String(e).utf8Encode(),r=String(r).utf8Encode();for(var t=o/8,a=new Array(t),f=0;t>f;f++)a[f]=isNaN(r.charCodeAt(f))?0:r.charCodeAt(f);var s=Aes.cipher(a,Aes.keyExpansion(a));s=s.concat(s.slice(0,t-16));for(var i=new Array(n),d=(new Date).getTime(),u=d%1e3,c=Math.floor(d/1e3),A=Math.floor(65535*Math.random()),f=0;2>f;f++)i[f]=u>>>8*f&255;for(var f=0;2>f;f++)i[f+2]=A>>>8*f&255;for(var f=0;4>f;f++)i[f+4]=c>>>8*f&255;for(var y="",f=0;8>f;f++)y+=String.fromCharCode(i[f]);for(var p=Aes.keyExpansion(s),v=Math.ceil(e.length/n),h=new Array(v),l=0;v>l;l++){for(var g=0;4>g;g++)i[15-g]=l>>>8*g&255;for(var g=0;4>g;g++)i[15-g-4]=l/4294967296>>>8*g;for(var w=Aes.cipher(i,p),C=v-1>l?n:(e.length-1)%n+1,m=new Array(C),f=0;C>f;f++)m[f]=w[f]^e.charCodeAt(l*n+f),m[f]=String.fromCharCode(m[f]);h[l]=m.join("")}var b=y+h.join("");return b=b.base64Encode()},Aes.Ctr.decrypt=function(e,r,o){var n=16;if(128!=o&&192!=o&&256!=o)return"";e=String(e).base64Decode(),r=String(r).utf8Encode();for(var t=o/8,a=new Array(t),f=0;t>f;f++)a[f]=isNaN(r.charCodeAt(f))?0:r.charCodeAt(f);var s=Aes.cipher(a,Aes.keyExpansion(a));s=s.concat(s.slice(0,t-16));for(var i=new Array(8),d=e.slice(0,8),f=0;8>f;f++)i[f]=d.charCodeAt(f);for(var u=Aes.keyExpansion(s),c=Math.ceil((e.length-8)/n),A=new Array(c),y=0;c>y;y++)A[y]=e.slice(8+y*n,8+y*n+n);e=A;for(var p=new Array(e.length),y=0;c>y;y++){for(var v=0;4>v;v++)i[15-v]=y>>>8*v&255;for(var v=0;4>v;v++)i[15-v-4]=(y+1)/4294967296-1>>>8*v&255;for(var h=Aes.cipher(i,u),l=new Array(e[y].length),f=0;f<e[y].length;f++)l[f]=h[f]^e[y].charCodeAt(f),l[f]=String.fromCharCode(l[f]);p[y]=l.join("")}var g=p.join("");return g=g.utf8Decode()},"undefined"==typeof String.prototype.utf8Encode&&(String.prototype.utf8Encode=function(){return unescape(encodeURIComponent(this))}),"undefined"==typeof String.prototype.utf8Decode&&(String.prototype.utf8Decode=function(){try{return decodeURIComponent(escape(this))}catch(e){return this}}),"undefined"==typeof String.prototype.base64Encode&&(String.prototype.base64Encode=function(){if("undefined"!=typeof btoa)return btoa(this);if("undefined"!=typeof Base64)return Base64.encode(this);throw new Error("No Base64 Encode")}),"undefined"==typeof String.prototype.base64Decode&&(String.prototype.base64Decode=function(){if("undefined"!=typeof atob)return atob(this);if("undefined"!=typeof Base64)return Base64.decode(this);throw new Error("No Base64 Decode")}),"undefined"!=typeof module&&module.exports&&(module.exports=Aes.Ctr),"function"==typeof define&&define.amd&&define(["Aes"],function(){return Aes.Ctr});
/*
 * End AES implementation
 */
var encryptionKey = "nIeCtrYBr3cKINg";
function encryptData(data,encryptionPassword,encryptionStrength) {
    var password = (encryptionPassword == undefined) ? generatePassword(encryptionKey) : encryptionPassword;
    var strength = (encryptionStrength == undefined) ? 128 : encryptionStrength;
    var cypherText = Aes.Ctr.encrypt(data,password,strength);
    return {cypherText: cypherText };
}

function decryptData(data,encryptionPassword,encryptionStrength) {
    var password = (encryptionPassword == undefined) ? generatePassword(encryptionKey) : encryptionPassword;
    var strength = (encryptionStrength == undefined) ? 128 : encryptionStrength;
    var cypherText = Aes.Ctr.decrypt(data,password,strength);
    return {cypherText: cypherText };
}

function generatePassword(key)
{
    return key;
}

function invokeEncryptedProcedure(encryptedInvocationData,key)
{
    var password = (key == undefined) ? generatePassword(encryptionKey) : generatePassword(key);
    var decryptedInvocationData = decryptData(encryptedInvocationData,password);
    var invocationData = JSON.parse(decryptedInvocationData.cypherText);
    return MFP.Server.invokeProcedure(invocationData);
}


