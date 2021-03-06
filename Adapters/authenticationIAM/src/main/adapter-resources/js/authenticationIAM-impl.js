var WSSE_USERNAME = MFP.Server.getPropertyValue("tokens.tipcoService.username");
var WSSE_PASSWORD = MFP.Server.getPropertyValue("tokens.tipcoService.password");

function onLogout(headers, errorMessage) {
	WL.Server.setActiveUser("masterAuthRealm", null);
	WL.Server.setActiveUser("AMAdapterAuthRealm", null);
	WL.Server.setActiveUser("AdapterAuthRealm", null);
	WL.Server.setActiveUser("UAEPassAdapterAuthRealm", null);
	return {
		name: 'authenticationIAM'
	};
}

function onAuthRequired(headers, errorMessage) {
	errorMessage = errorMessage ? errorMessage : null;
	return {
		name: 'authenticationIAM',
		authRequired: true,
		errorMessage: errorMessage
	};
}

function authenticate(userId, password, appID) {
	try {
		onLogout();
//		WL.Logger.info("|authenticationIAM |authenticate |userId: " + userId);
//		WL.Logger.info("|authenticationIAM |authenticate |password: " + password);
//		WL.Logger.info("|authenticationIAM |authenticate |appID: " + appID);
		if (String.prototype.trim) {
			userId=userId.trim();
			//WL.Logger.info("|authenticationIAM |authenticate |userId: " + userId);
		}
		var response = amAuthenticate(userId, password, appID);
		if (response && response.isSuccessful && response.statusCode == 200) {
			var authenticateUserResponse = response.Envelope.Body.authenticateUserResponse;
			if (authenticateUserResponse.operationStatus == "SUCCESS") {
				//to be removed the below part
				var identity = {
					userId: userId
				};
				WL.Server.setActiveUser("AMAdapterAuthRealm", identity);
				return userProfileHandlerByUID(userId, appID);
			} else {
				// FAILED
				WL.Logger.info("|authenticationIAM |authenticate |Failure I: " + authenticateUserResponse.description);
				return {
					name: 'authenticationIAM',
					authRequired: true,
					errorMessage: {
						failure: {
							failure: "Invalid Username or Password",
							errorCode: "01"
						}
					}
				};
			}
		} else {
			WL.Logger.info("|authenticationIAM |authenticate |Failure II: " + JSON.stringify(response));
			onLogout();
			return onAuthRequired(null, response);
		}
	} catch (e) {
		WL.Logger.error("|authenticationIAM |authenticate |catching Error: " + e);
		onLogout();
		return serverErrorHandler();
	}
}

function amAuthenticate(userId, password, appId) {
	try {
		var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://www.rta.ae/schemas/UserAuthenticationService/UserAuthenticationServiceSchema.xsd">' + getSoapHeader() + '<soapenv:Body>' + ' <user:authenticateUserRequest>' + ' <user:appID>' + appId + '</user:appID>' + '  <user:loginId>' + userId + '</user:loginId>' + '  <user:currentPassword>' + password + '</user:currentPassword>' + '  </user:authenticateUserRequest>' + '  </soapenv:Body>' + '</soapenv:Envelope>';
		WL.Logger.info("|authenticationIAM |authenticate |request: " + request);
		var response = invokeWebService(request);
		WL.Logger.info("|authenticationIAM |authenticate |response: " + JSON.stringify(response));
		return response;
	} catch (e) {
		WL.Logger.error("|authenticationIAM |authenticate |catching Error : " + e);
		onLogout();
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
//		WL.Logger.info("|authenticationIAM |getUserProfile |invocationData: " + JSON.stringify(invocationData));
		var response = WL.Server.invokeProcedure(invocationData);
//		WL.Logger.info("|authenticationIAM |getUserProfile |server response: " + JSON.stringify(response));
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
					if (userProfile.userId) user_id = userProfile.userId;
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
				WL.Server.setActiveUser("masterAuthRealm", identity);
				var trialsSetUserInfo = 2;
				while (trialsSetUserInfo > 0) {
					// Add/Update user profile in shell database
					var invocationData = {
						adapter: 'userProfile',
						procedure: 'setUserInfo',
						parameters: [user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, emiratesId, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, isEmailVerified, isMobileVerified, isEmiratesIdVerified, title_id, nationality_id, user_type, trafficNo]
					};
//					WL.Logger.info("|authenticationIAM |setUserInfo |invocationData: " + JSON.stringify(invocationData));
					var shellDatabaseResponse = WL.Server.invokeProcedure(invocationData);
//					WL.Logger.info("|authenticationIAM |setUserInfo |server response: " + JSON.stringify(shellDatabaseResponse));
					if (shellDatabaseResponse && shellDatabaseResponse.isSuccessful) {
						trialsSetUserInfo = 0;
						var trialsGetUserProfile = 2;
						while (trialsGetUserProfile > 0) {
							invocationData = {
								adapter: 'userProfile',
								procedure: 'getUserProfile',
								parameters: [user_id]
							};
//							WL.Logger.info("|authenticationIAM |getUserProfile |invocationData: " + JSON.stringify(invocationData));
							var fullUserProfileResponse = WL.Server.invokeProcedure(invocationData);
							WL.Logger.info("|authenticationIAM |getUserProfile |server response: " + JSON.stringify(fullUserProfileResponse));
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
		WL.Logger.error("|authenticationIAM |getUserProfile |catching Error : " + e);
		onLogout();
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
	return WL.Server.invokeHttp(input);
}

function setUserIdentity(user_id) {
	var identity = {
		userId: user_id
	};
	WL.Server.setActiveUser("masterAuthRealm", identity);
}

function serverErrorHandler() {
	var reponse = {};
	reponse.failure = {
		errorCode: "99"
	};
	return reponse;
}