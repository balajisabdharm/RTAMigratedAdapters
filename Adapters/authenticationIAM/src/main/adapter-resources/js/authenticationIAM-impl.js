var WSSE_USERNAME = MFP.Server.getPropertyValue("tokens.tipcoService.username");
var WSSE_PASSWORD = MFP.Server.getPropertyValue("tokens.tipcoService.password");

function onLogout(headers, errorMessage) {
	/*MFP.Server.setActiveUser("masterAuthRealm", null);
	MFP.Server.setActiveUser("AMAdapterAuthRealm", null);
	MFP.Server.setActiveUser("AdapterAuthRealm", null);
	MFP.Server.setActiveUser("UAEPassAdapterAuthRealm", null);*/
	
}




//userProfileHandlerByUID should be used to get UserProfileData
function authenticate(userId, password, appID) {
     MFP.Logger.error("|authenticationIAM |authenticate |userId: " + userId +"  password "+password+" appID "+appID);
    try {
         //Following line has been commented by IBM team. MFP v8 Migration
      //  onLogout();
        //        MFP.Logger.info("|authenticationIAM |authenticate |userId: " + userId);
        //        MFP.Logger.info("|authenticationIAM |authenticate |password: " + password);
        //        MFP.Logger.info("|authenticationIAM |authenticate |appID: " + appID);
       // if (String.prototype.trim) {
            //userId=userId.trim();
            //MFP.Logger.info("|authenticationIAM |authenticate |userId: " + userId);
       // }
        MFP.Logger.info("|authenticationIAM |authenticate |userId: " + userId);
        var response = amAuthenticate(userId, password, appID);
        if (response && response.isSuccessful && response.statusCode == 200) {
            var authenticateUserResponse = response.Envelope.Body.authenticateUserResponse;
            if (authenticateUserResponse.operationStatus == "SUCCESS") {
                
                var identity = {
                name: 'authenticationIAM',
                userId: userId,
                authRequired: false
                };
                //Following two lines has been commented by IBM team. MFP v8 Migration
               // MFP.Server.setActiveUser("AMAdapterAuthRealm", identity);
                //return userProfileHandlerByUID(userId, appID);
                 MFP.Logger.error("|authenticationIAM |authenticate |identity: " + identity);
                return identity;
                
            } else {
                // FAILED
                
                MFP.Logger.error("|authenticationIAM |authenticate |Failure I: " + authenticateUserResponse.description);
                return {
                name: 'authenticationIAM',
                authRequired: true,
                failure: {
                failure: "Invalid Username or Password",
                errorCode: "01"
                    }
                };
            }
        } else {
            MFP.Logger.error("|authenticationIAM |authenticate |Failure II: " + JSON.stringify(response));
            //onLogout();
           // return onAuthRequired(null, response);
            return {
            name: 'authenticationIAM',
            authRequired: true,
            userId: userId,
            failure: {
            failure: "Issues in connecting with Backend.",
            errorCode: "02"
            }
            };
        }
    } catch (e) {
        MFP.Logger.error("|authenticationIAM |authenticate |catching Error: " + e);
        //onLogout();
        //return serverErrorHandler();
        return {
        name: 'authenticationIAM',
        authRequired: true,
        failure: {
        failure: "Exception.",
        errorCode: "03"
        }
        };
    }
}

function amAuthenticate(userId, password, appId) {
	try {
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://www.rta.ae/schemas/UserAuthenticationService/UserAuthenticationServiceSchema.xsd">' + getSoapHeader() + '<soapenv:Body>' + ' <user:authenticateUserRequest>' + ' <user:appID>' + appId + '</user:appID>' + '  <user:loginId>' + userId + '</user:loginId>' + '  <user:currentPassword>' + password + '</user:currentPassword>' + '  </user:authenticateUserRequest>' + '  </soapenv:Body>' + '</soapenv:Envelope>';
		MFP.Logger.info("|amAuthenticate |authenticate |request: " + request);
		var response = invokeWebService(request);
		MFP.Logger.info("|amAuthenticate |authenticate |response: " + JSON.stringify(response));
		return response;
	} catch (e) {
		MFP.Logger.error("|amAuthenticate |authenticate |catching Error : " + e);
		//onLogout();
		return serverErrorHandler();
	}
}

function userProfileHandlerByUID(uid, appid) {
	try {
		//uid="rtatestacc@gmail.com";
		var invocationData = {
			adapter: 'portalAdapter',
			procedure: 'getUserProfile',
			parameters: [uid, appid]
		};
//		MFP.Logger.info("|authenticationIAM |getUserProfile |invocationData: " + JSON.stringify(invocationData));
		var response = MFP.Server.invokeProcedure(invocationData);
//		MFP.Logger.info("|authenticationIAM |getUserProfile |server response: " + JSON.stringify(response));
		if (response && response.isSuccessful && response.statusCode == 200) {
			onLogout();
			var userProfile = response.Envelope.Body.getUserProfileReturn.userProfile;
			var errorResponse = response.Envelope.Body.getUserProfileReturn.errorResponse;
			// Prepare user profile info
			var user_id = uid;
			var cn = "";
			var title_ar = "";
			var title_en = "";
			var first_name_ar = "";
			var first_name_en = "";
			var middlename_ar = "";
			var middlename_en = "";
			var last_name_ar = "";
			var last_name_en = "";
			var date_of_birth = "";
			var emiratesId = "";
			var nationality_en = "";
			var nationality_ar = "";
			var mobile = "";
			var mail = "";
			var preferred_language = "";
			var preferred_communication = "";
			var portal_id = "";
			var password_changed_flag = 0;
			var isEmailVerified = "true";
			var isMobileVerified = "false";
			var isEmiratesIdVerified = "false";
			var title_id = "";
			var nationality_id = "";
			var user_type = "";
			var trafficNo = "";
			 
			if (errorResponse) {
				return {
					failure: errorResponse
				};
			} else {
				if (userProfile) {
					// Collect portal user profile info
					
					if (userProfile.userId) user_id =userProfile.userId;
					if (userProfile.title && userProfile.title.titleEn) title_en = userProfile.title.titleEn;
					if (userProfile.title && userProfile.title.titleAr) title_ar = userProfile.title.titleAr;
					if (userProfile.firstName) first_name_en = userProfile.firstName;
					if (userProfile.middleName) middlename_en = userProfile.middleName;
					if (userProfile.lastName) last_name_en = userProfile.lastName;
					if (userProfile.mobileNo) mobile = userProfile.mobileNo;
					if (userProfile.email) mail = userProfile.email;
					if (userProfile.language) preferred_language = userProfile.language;
					if (userProfile.emiratesId) emiratesId = userProfile.emiratesId;
					if (userProfile.nationality && userProfile.nationality.nationalityEn) nationality_en = userProfile.nationality.nationalityEn;
					if (userProfile.nationality && userProfile.nationality.nationalityAr) nationality_ar = userProfile.nationality.nationalityAr;
					if (userProfile.isEmailVerified) isEmailVerified = userProfile.isEmailVerified;
					if (userProfile.isMobileVerified) isMobileVerified = userProfile.isMobileVerified;
					if (userProfile.isEmiratesIdVerified) isEmiratesIdVerified = userProfile.isEmiratesIdVerified;
					if (userProfile.prefComm) preferred_communication = userProfile.prefComm;
					if (userProfile.title && userProfile.title.titleID) title_id = userProfile.title.titleID;
					if (userProfile.nationality && userProfile.nationality.nationalityID) nationality_id = userProfile.nationality.nationalityID;
					if (userProfile.userType) user_type = userProfile.userType;
					if (userProfile.trafficNo) trafficNo = userProfile.trafficNo;
				}
				var identity = {
					userId: user_id
				};
				//MFP.Server.setActiveUser("masterAuthRealm", identity);
				var trialsSetUserInfo = 2;
				while (trialsSetUserInfo > 0) {
					// Add/Update user profile in shell database
					var invocationData = {
						adapter: 'userProfile',
						procedure: 'setUserInfo',
						parameters: [user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, emiratesId, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, isEmailVerified, isMobileVerified, isEmiratesIdVerified, title_id, nationality_id, user_type, trafficNo]
					};
//					MFP.Logger.info("|authenticationIAM |setUserInfo |invocationData: " + JSON.stringify(invocationData));
					var shellDatabaseResponse = MFP.Server.invokeProcedure(invocationData);
//					MFP.Logger.info("|authenticationIAM |setUserInfo |server response: " + JSON.stringify(shellDatabaseResponse));
					if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
						trialsSetUserInfo = 0;
						var trialsGetUserProfile = 2;
						while (trialsGetUserProfile > 0) {
							invocationData = {
								adapter: 'userProfile',
								procedure: 'getUserProfile',
								parameters: [user_id]
							};
//							MFP.Logger.info("|authenticationIAM |getUserProfile |invocationData: " + JSON.stringify(invocationData));
							var fullUserProfileResponse = MFP.Server.invokeProcedure(invocationData);
							MFP.Logger.info("|authenticationIAM |getUserProfile |server response: " + JSON.stringify(fullUserProfileResponse));
							if (fullUserProfileResponse && fullUserProfileResponse.isSuccessful) {
								trialsGetUserProfile = 0;
								if(userProfile.serviceRelatedInfo)
								var _serviceRelatedInfo =(Object.prototype.toString.call(userProfile.serviceRelatedInfo) === '[object Array]') ? userProfile.serviceRelatedInfo: convertObiectToArray(userProfile.serviceRelatedInfo);
								return {
									name: 'authenticationIAM',
									authRequired: false,
									userProfile: fullUserProfileResponse,
									serviceRelatedInfo:_serviceRelatedInfo
								};
							} else {
								trialsGetUserProfile--;
							}
						}
					} else {
						trialsSetUserInfo--;
					}
				}
			}
		}
		onLogout();
		return serverErrorHandler();
	} catch (e) {
		MFP.Logger.error("|authenticationIAM |getUserProfile |catching Error : " + e);
		//onLogout();
		return serverErrorHandler();
	}
}

function getSoapHeader() {
	return '<soapenv:Header><wsse:Security soapenv:mustUnderstand="0" xmlns:wsse=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd " xmlns=" http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:sch="http://schemas.xmlsoap.org/soap/envelope/"><wsse:UsernameToken><wsse:Username>' + WSSE_USERNAME + '</wsse:Username><wsse:Password>' + WSSE_PASSWORD + '</wsse:Password></wsse:UsernameToken></wsse:Security></soapenv:Header>';
}
function convertObiectToArray(Object){
	if (Object != null && Object != undefined && !(Object instanceof Array)) {
		return [Object];
	}
	return Object;
}
function invokeWebService(body, headers) {
	var input = {
		method: 'post',
		returnedContentType: 'xml',
		path: '/userAuthenticationService',
		body: {
			content: body.toString(),
			contentType: 'text/xml; charset=utf-8'
		}
	};
	return MFP.Server.invokeHttp(input);
}

function setUserIdentity(user_id) {
	var identity = {
		userId: user_id
	};
	MFP.Server.setActiveUser("masterAuthRealm", identity);
}

function serverErrorHandler() {
	var reponse = {};
	reponse.failure = {
		errorCode: "99"
	};
	return reponse;
}
