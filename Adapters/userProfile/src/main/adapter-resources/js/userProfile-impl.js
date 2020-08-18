/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

//Adapter Constants

var REQ_PORTAL_USER_NAME =MFP.Server.getPropertyValue("tokens.portal.vendorUsername");
var REQ_PORTAL_PASSWORD = MFP.Server.getPropertyValue("tokens.portal.vendorPassword");

var REQ_NOTIFICATION_TOKEN = MFP.Server.getPropertyValue("tokens.pushToken");
var REQ_RECENT_ACTIVITIES_TOKEN = MFP.Server.getPropertyValue("tokens.recentActivities");



//Helpers Functions
function adapterLogger(procudureName , type , suffix, msg ){
	var _msg = msg || "";
	try{
		var prefix= "|userProfile |" + procudureName +" |"+ suffix + " : " ;
		switch(type){
		case "error":
			MFP.Logger.error(prefix + _msg);
			break;
		case "warn":
			MFP.Logger.warn(prefix+_msg);
			break;
		case "info":
			MFP.Logger.info(prefix+ _msg);
			break;
		}
	}catch(e){
		MFP.Logger.error("|userProfile |adapterLogger |Exception" + JSON.stringify(e));
	}
}

function handleError(msg,code){
	var msg= msg || "Internal Server Error";
	var code =code||500;

	adapterLogger("handleError","error", "Internal Error",JSON.stringify([msg,code]));
	var response = {
			"isSuccessful": false,
			"error": {
				"code": code,
				"message": msg,
				"adapter": "portalAdapter"
			}
	};
	adapterLogger("handleError","error", "Internal Error",JSON.stringify(response));
	return response;
}


var DB_TABLES = {
		'Users' : {
			sqlGetAllFor : 'SELECT USER_ID "user_id", CN "cn", TITLE_AR "title_ar", TITLE_EN "title_en", FIRST_NAME_AR "first_name_ar", FIRST_NAME_EN "first_name_en", MIDDLENAME_AR "middlename_ar", MIDDLENAME_EN "middlename_en", LAST_NAME_AR "last_name_ar", LAST_NAME_EN "last_name_en", DATE_OF_BIRTH "date_of_birth", ID_NUMBER "id_number", NATIONALITY_AR "nationality_ar", NATIONALITY_EN "nationality_en", MOBILE "mobile", MAIL "mail", PREFERRED_LANGUAGE "preferred_language", PREFERRED_COMMUNICATION "preferred_communication", PORTAL_ID "portal_id", PASSWORD_CHANGED_FLAG "password_changed_flag", CREATED "created", MODIFIED "modified" , IS_EMAIL_VERIFIED "is_email_verified",IS_MOBILE_VERIFIED "is_mobile_verified",IS_EMIRATES_ID_VERIFIED "is_emirates_id_verified" ,TITLE_ID "title_id",NATIONALITY_ID "nationality_id" ,USER_TYPE "user_type" ,TRAFFIC_NUMBER "traffic_number" FROM Users WHERE user_id=?',
			sqlInsert : "INSERT INTO Users (user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, created, modified , is_email_verified,is_mobile_verified,is_emirates_id_verified,title_id,nationality_id , user_type , traffic_number ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
			sqlUpdate : "UPDATE Users SET cn=?, title_ar=?, title_en=?, first_name_ar=?, first_name_en=?, middlename_ar=?, middlename_en=?, last_name_ar=?, last_name_en=?, date_of_birth=?, id_number=?, nationality_ar=?, nationality_en=?, mobile=?, mail=?, preferred_language=?, preferred_communication=?, portal_id=?, password_changed_flag=?, modified=? , is_email_verified=?,is_mobile_verified=?,is_emirates_id_verified=?,title_id=?,nationality_id=? ,user_type=?  ,traffic_number=? WHERE user_id=?",
			sqlUpdatePortal : "UPDATE Users SET title_id =? , first_name_en =? , last_name_en =? , id_number =? , nationality_id =? , mobile =? , mail =? , preferred_language =? , preferred_communication =? , portal_id =? , password_changed_flag =? , modified =? , is_email_verified =? , is_mobile_verified =? , is_emirates_id_verified =?	WHERE user_id =? ",
			sqlUpdateProfile : "UPDATE Users SET title_id =? , first_name_en =? , last_name_en =? , nationality_id =? , mobile =? , mail =? , preferred_language =? , preferred_communication =? , modified =? , is_email_verified =? , is_mobile_verified =? 	WHERE user_id =? ",
			sqlUpdateMobileNumber : "UPDATE Users SET mobile =? ,is_mobile_verified =?, modified =? WHERE user_id =? ",
			sqlUpdateMail : "UPDATE Users SET mail =? , modified =? WHERE user_id =? ",
			sqlDelete : "DELETE FROM Users WHERE user_id=?"
		},
		'Notifications' : {
			sqlGet : 'SELECT ID "id", SERVICE_ID "service_id", TYPE_VALUE "type_value", TITLE_AR "title_ar", TITLE_EN "title_en", MESSAGE_AR "message_ar", MESSAGE_EN "message_en", ACTION_LABEL_AR "action_label_ar", ACTION_LABEL_EN "action_label_en", ACTION_URL "action_url", STATUS "status", CREATED "created", READED "readed", USERS_ID "Users_id" FROM Notifications WHERE id=? and Users_id=?',
			sqlGetAllFor : 'SELECT ID "id", SERVICE_ID "service_id", TYPE_VALUE "type_value", TITLE_AR "title_ar", TITLE_EN "title_en", MESSAGE_AR "message_ar", MESSAGE_EN "message_en", ACTION_LABEL_AR "action_label_ar", ACTION_LABEL_EN "action_label_en", ACTION_URL "action_url", STATUS "status", CREATED "created", READED "readed", USERS_ID "Users_id" FROM (SELECT * FROM Notifications WHERE Users_id=? ORDER BY created DESC) WHERE rownum <= 20'/*[MySQL]: "SELECT * FROM Notifications WHERE Users_id=? ORDER BY created DESC LIMIT 20"*/,
			sqlGetAllFromDate : 'SELECT ID "id", SERVICE_ID "service_id", TYPE_VALUE "type_value", TITLE_AR "title_ar", TITLE_EN "title_en", MESSAGE_AR "message_ar", MESSAGE_EN "message_en", ACTION_LABEL_AR "action_label_ar", ACTION_LABEL_EN "action_label_en", ACTION_URL "action_url", STATUS "status", CREATED "created", READED "readed", USERS_ID "Users_id" FROM Notifications Where Users_id=? and created>? ORDER BY created DESC'/*[MySQL]: "SELECT * FROM Notifications Where Users_id=? and created>? ORDER BY created DESC"*/,
			sqlGetNotificationsCoun : 'SELECT COUNT(STATUS) "counter" FROM Notifications WHERE Users_id=? and STATUS=0',
			sqlGetAllRest : "SELECT outer.ID \"id\", outer.SERVICE_ID \"service_id\", outer.TYPE_VALUE \"type_value\", outer.TITLE_AR \"title_ar\", outer.TITLE_EN \"title_en\", outer.MESSAGE_AR \"message_ar\", outer.MESSAGE_EN \"message_en\", outer.ACTION_LABEL_AR \"action_label_ar\", outer.ACTION_LABEL_EN \"action_label_en\", outer.ACTION_URL \"action_url\", outer.STATUS \"status\", outer.CREATED \"created\", outer.READED \"readed\", outer.USERS_ID \"Users_id\" FROM (SELECT ROWNUM rn, inner.* FROM (  SELECT * FROM Notifications WHERE USERS_ID =? ORDER BY CREATED) inner) outer WHERE outer.rn >= ? AND outer.rn <= ?",

			sqlInsert : "INSERT INTO Notifications (service_id, type_value, title_ar, title_en, message_ar, message_en, action_label_ar, action_label_en, action_url, status, created, Users_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
			sqlUpdate : "UPDATE Notifications SET service_id=?, type_value=?, title_ar=?, title_en=?, message_ar=?, message_en=?, action_label_ar=?, action_label_en=?, action_url=?, status=?, readed=? WHERE id=? and Users_id=?",
			sqlUpdateRead : "UPDATE Notifications SET status=?, readed=? WHERE id=? and Users_id=?",
			sqlDelete : "DELETE FROM Notifications WHERE id=? and Users_id=?",
			sqlDeleteAllFor : "DELETE FROM Notifications WHERE Users_id=?"
		},
		'Widgets' : {
			sqlGet : 'SELECT ID "id", CONTENT "content", USERS_ID "Users_id" FROM Widgets WHERE id=? and Users_id=?',
			sqlGetAllFor : 'SELECT ID "id", CONTENT "content", USERS_ID "Users_id" FROM Widgets WHERE Users_id=?',
			sqlInsert : "INSERT INTO Widgets (id, content, Users_id) VALUES (?,?,?)",
			sqlUpdate : "UPDATE Widgets SET content=? WHERE id=? and Users_id=?",
			sqlDelete : "DELETE FROM Widgets WHERE id=? and Users_id=?",
			sqlDeleteAllFor : "DELETE FROM Widgets WHERE Users_id=?"
		},
		'FavoriteServices' : {
			sqlGet : 'SELECT ID "id", SERVICE_TITLE "service_title", USERS_ID "Users_id" FROM Favorite_Services WHERE id=? and Users_id=?',
			sqlGetAllFor : 'SELECT ID "id", SERVICE_TITLE "service_title", USERS_ID "Users_id" FROM Favorite_Services WHERE Users_id=?',
			sqlInsert : "INSERT INTO Favorite_Services (id, service_title, Users_id) VALUES (?,?,?)",
			sqlUpdate : "UPDATE Favorite_Services SET service_title=? WHERE id=? and Users_id=?",
			sqlDelete : "DELETE FROM Favorite_Services WHERE id=? and Users_id=?",
			sqlDeleteAllFor : "DELETE FROM Favorite_Services WHERE Users_id=?"
		},
		'RecentActivities' : {
			sqlGet : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities WHERE SPTRN=? and USERS_ID=?'/*[MySQL]: "SELECT * FROM Recent_Activities WHERE Users_id=? ORDER BY created DESC LIMIT 5*/,
			sqlGetAllFor: 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM (SELECT * FROM Recent_Activities WHERE Users_id=? ORDER BY CREATED DESC) WHERE rownum <= 10'/*[MySQL]: "SELECT * FROM Recent_Activities WHERE Users_id=? ORDER BY created LIMIT ? OFFSET 0"*/,
			sqlGetLatestFor: 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM (SELECT * FROM Recent_Activities WHERE Users_id=? ORDER BY CREATED DESC) WHERE rownum <= ?'/*[MySQL]: "SELECT * FROM Recent_Activities WHERE Users_id=? ORDER BY created LIMIT ? OFFSET 0"*/,
			sqlGetAll : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities',
			sqlGetAllByDate : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities WHERE MODIFIED >= ?',
			sqlGetAllNonFinalizedByDate : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities WHERE MODIFIED >= ? AND STATUS NOT IN (\'0\',\'failure\') AND ROWNUM <= 500 ORDER BY CREATED ASC',
			sqlGetAllByDates : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", USERS_ID "Users_id", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities WHERE created between ? and ?',
			sqlInsert : "INSERT INTO Recent_Activities (SPTRN, ACTIVITY_TYPE, AMOUNT, CHANNEL_CODE, SERV_CODE, SP_CODE, VERSION_CODE, STATUS, DEG_TRN, CREATED, MODIFIED, USERS_ID, APP_NAME, SERVICE_ID, SERVICE_ACCOUNT_ID, BENIFICIARY_TYPE, COMP_TRADE_LICENSE, PAYMENT_RESP_TOKEN) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
			sqlUpdate : "UPDATE Recent_Activities SET ACTIVITY_TYPE=?, AMOUNT=?, CHANNEL_CODE=?, SERV_CODE=?, SP_CODE=?, VERSION_CODE=?, STATUS=?, DEG_TRN=?, MODIFIED=? WHERE SPTRN=? and Users_id=?",
			sqlUpdateCheckStep : "UPDATE Recent_Activities SET DB_JOB_CHK_COUNTER=?, MODIFIED=? WHERE SPTRN=? and Users_id=?",
			sqlUpdateTokenWithStatus : "UPDATE Recent_Activities SET PAYMENT_RESP_TOKEN=?, MODIFIED=?, STATUS=?, DEG_TRN=? WHERE SPTRN=?",
			sqlDelete : "DELETE FROM Recent_Activities WHERE SPTRN=? and Users_id=?",
			sqlDeleteAllFor : "DELETE FROM Recent_Activities WHERE Users_id=?",
			sqlGetAmountSumFor : 'SELECT SUM(amount) "total" FROM Recent_Activities WHERE LOWER(activity_type)=? and created between ? and ?',
			reconciliation : 'SELECT SPTRN "sptrn", ACTIVITY_TYPE "activity_type", AMOUNT "amount", CHANNEL_CODE "channel_code", SERV_CODE "serv_code", SP_CODE "sp_code", VERSION_CODE "version_code", STATUS "status", DEG_TRN "deg_trn", DB_JOB_CHK_COUNTER "db_job_chk_counter", CREATED "created", MODIFIED "modified", APP_NAME "app_name", SERVICE_ID "service_id", SERVICE_ACCOUNT_ID "service_account_id", BENIFICIARY_TYPE "benificiary_type", COMP_TRADE_LICENSE "comp_trade_license", PAYMENT_RESP_TOKEN "payment_resp_token" FROM Recent_Activities WHERE status<>\'-1\' and sp_code like ? and serv_code like ? and status like ? and created between ? and ?',
			sqlServiceProviders: 'SELECT DISTINCT(SP_CODE) "sp_code" FROM Recent_Activities WHERE created between ? and ?',
			sqlServiceCodes: 'SELECT DISTINCT(SERV_CODE) "serv_code" FROM Recent_Activities WHERE created between ? and ?',
			sqlStatus: 'SELECT DISTINCT(STATUS) "status" FROM Recent_Activities WHERE created between ? and ?',
		},
		'OtherAccounts' : {
			sqlGet : 'SELECT ID "id", LABEL "label", SERVICE "service", PARAMETERS "parameters", USERS_ID "Users_id" FROM Other_Accounts WHERE id=? and Users_id=?',
			sqlGetPortal : 'SELECT ID "id", LABEL "label", SERVICE "service", PARAMETERS "parameters", USERS_ID "Users_id" FROM Other_Accounts WHERE Users_id=? and service=?',
			sqlGetAllFor : 'SELECT ID "id", LABEL "label", SERVICE "service", PARAMETERS "parameters", USERS_ID "Users_id" FROM Other_Accounts WHERE Users_id=?',
			sqlInsert : "INSERT INTO Other_Accounts (id, label, service, parameters, Users_id) VALUES (?,?,?,?,?)",
			sqlInsertPortal : "INSERT INTO Other_Accounts (label, service, parameters, Users_id) VALUES (?,?,?,?)",
			sqlUpdate : "UPDATE Other_Accounts SET label=?, service=?, parameters=? WHERE id=? and Users_id=?",
			sqlUpdatePortal : "UPDATE Other_Accounts SET label=?, service=?, parameters=? WHERE Users_id=? and service=?",
			sqlDelete : "DELETE FROM Other_Accounts WHERE id=? and Users_id=?",
			sqlDeletePortal : "DELETE FROM Other_Accounts WHERE Users_id=? and service=?",
			sqlDeleteAllFor : "DELETE FROM Other_Accounts WHERE Users_id=?"
		},
		'SalikAccount' : {
			sqlGetAllFor : 'SELECT USER_ID "user_id", NICKNAME "nickname",ACCOUNT_NUMBER "account_number" , ACCOUNT_PIN "account_pin" , ACTIVE "active" FROM SALIK_ACCOUNTS WHERE USER_ID=?',
			sqlInsert : "INSERT INTO SALIK_ACCOUNTS (user_id, nickname, account_number, account_pin, active) VALUES (?,?,?,?,?)",
			sqlDelete : "DELETE FROM SALIK_ACCOUNTS WHERE user_id=?",
			sqlDeleteAllFor : "DELETE FROM SALIK_ACCOUNTS WHERE Users_id=?",
			sqlUpdate : "UPDATE SALIK_ACCOUNTS SET NICKNAME=?, ACCOUNT_NUMBER=?, ACCOUNT_PIN=?, ACTIVE=? WHERE user_id=?",

		},
		'ServiceFeedbacks' : {
			sqlGetAllFor : 'SELECT ID "id", USER_ID "user_id", SERVICE_ID "service_id", USER_COMMENT "user_comment", PREFERED_CONTACT_TIME "prefered_contact_time", USER_MOBILE "user_mobile", Q1 "q1", Q2 "q2", Q3 "q3", Q4 "q4", CREATED "created" FROM Services_Feedbacks WHERE Users_id=?',
			sqlInsert : "INSERT INTO Services_Feedbacks (user_id, service_id, user_comment, prefered_contact_time, user_mobile, q1, q2, q3, q4, created) VALUES (?,?,?,?,?,?,?,?,?,?)",
			sqlDelete : "DELETE FROM Services_Feedbacks WHERE id=?, user_id=?",
			sqlDeleteAllFor : "DELETE FROM Services_Feedbacks WHERE Users_id=?"
		},
		'Cache' : {
			sqlGet : 'SELECT ID "id", CONTENT "content", CREATED "created", MODIFIED "modified" FROM cacheTable WHERE id=?',
			sqlInsert : "INSERT INTO cacheTable (id, content, created, modified) VALUES (?,?,?,?)",
			sqlUpdate : "UPDATE cacheTable SET content=?, modified=? WHERE id=?",
			sqlDelete : "DELETE FROM cacheTable WHERE id=?"
		},
		'StaticPages' : {
			sqlGet : 'SELECT ID "id", CONTENT "content", CREATED "created", MODIFIED "modified" FROM Static_Pages WHERE id=?',
			sqlInsert : "INSERT INTO Static_Pages (id, content, created, modified) VALUES (?,?,?,?)",
			sqlUpdate : "UPDATE Static_Pages SET content=?, modified=? WHERE id=?",
			sqlDelete : "DELETE FROM Static_Pages WHERE id=?"
		},
		'WCMNEWS' : {
			sqlGetByID : 'SELECT * FROM WCMNEWS WHERE ID = ?',
			sqlGetLimitedRows : 'SELECT * FROM (SELECT * FROM WCMNEWS WHERE 1=1 ORDER BY CREATED DESC) WHERE rownum <= ?',
			sqlUpdate : "UPDATE WCMNEWS SET WCMOBJECT=? WHERE id=?",
			sqlInsert : "INSERT INTO WCMNEWS (ID, WCMOBJECT, CREATED) VALUES (?,?,?)"
		},
		'WCMPROJECTS' : {
			sqlGetByID : 'SELECT * FROM WCMPROJECTS WHERE ID = ?',
			sqlGetLimitedRows : 'SELECT * FROM (SELECT * FROM WCMPROJECTS WHERE 1=1 ORDER BY CREATED DESC) WHERE rownum <= ?',
			sqlUpdate : "UPDATE WCMPROJECTS SET WCMOBJECT=? WHERE id=?",
			sqlInsert : "INSERT INTO WCMPROJECTS (ID, WCMOBJECT, CREATED) VALUES (?,?,?)"
		},
		'WCMANNOUNCEMENTS' : {
			sqlGetByID : 'SELECT * FROM WCMANNOUNCEMENTS WHERE ID = ?',
			sqlGetLimitedRows : 'SELECT * FROM (SELECT * FROM WCMANNOUNCEMENTS WHERE 1=1 ORDER BY CREATED DESC) WHERE rownum <= ?',
			sqlUpdate : "UPDATE WCMANNOUNCEMENTS SET WCMOBJECT=? WHERE id=?",
			sqlInsert : "INSERT INTO WCMANNOUNCEMENTS (ID, WCMOBJECT, CREATED) VALUES (?,?,?)"
		},
		'ONE_TIME_PASSWORD':{
			sqlGetMobile : 'SELECT MOBILE FROM Users WHERE user_id=?',
			sqlGetEmail : 'SELECT MAIL FROM Users WHERE user_id=?',
			sqlGet : 'SELECT * FROM ONE_TIME_PASSWORD WHERE USER_ID=?',
			sqlInsert: "INSERT INTO ONE_TIME_PASSWORD (OTP, USER_ID,EMAIL_ADDRESS, MOBILE_NUMBER, CREATION_DATE, OTP_Verification_Method) VALUES (?, ? ,?, ?, ?, ?)",
			sqlUpdate : "UPDATE ONE_TIME_PASSWORD SET OTP=?, EMAIL_ADDRESS=?, MOBILE_NUMBER=?, CREATION_DATE=?, OTP_Verification_Method=? WHERE USER_ID=?",
		},
		'VIP_USERS':{
			sqlGet : 'SELECT * FROM VIP_USERS WHERE USER_ID=?',
			sqlUpdate : "UPDATE VIP_USERS SET NOTIFIED_ON=? WHERE USER_ID=?",
			sqlGetAllFor: 'SELECT * FROM VIP_USERS WHERE USER_ID=?'
		}

};


//Adapter Procdures 
function getVIPUser(userId)
{
	return  MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['VIP_USERS'].sqlGet,
		parameters : [ userId ]
	});
}
function isUserVip(userId,appName)
{
	try{
		var isAuthorizedResponse = this._isAuthorized(userId);
//		MFP.Logger.info("isAuthorizedResponse: " + isAuthorizedResponse);
		adapterLogger("isUserVip","info", "isAuthorizedResponse:",toString(isAuthorizedResponse));
		if(isAuthorizedResponse.authRequired == false) {
			var result={
					isVIP:false
			};
			var  vipResponse= MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['VIP_USERS'].sqlGet,
				parameters : [ userId ]
			});
			adapterLogger("isUserVip","info", "vipResponse:",toString(vipResponse));
//			MFP.Logger.info("vipResponse: " + JSON.stringify(vipResponse));
			if (appName&&vipResponse && vipResponse.isSuccessful && vipResponse.resultSet&& vipResponse.resultSet.length>0)
			{
				var appNames=vipResponse.resultSet[0].APPNAMES;
				if(appNames&&appNames.indexOf(appName) !=-1)
					result={
						isVIP:true
				}; 
			}
			return result;
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("isUserVip","error", "Exception",toString(e));
		return handleError();
	}

}

function updateNotifiedVIPUser(userId,notifiedApp)
{
	try{
		var  vipUser= MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['VIP_USERS'].sqlGet,
			parameters : [userId]
		});
		if (vipUser&& vipUser.isSuccessful && vipUser.resultSet&& vipUser.resultSet.length>0)
		{
			var appNames=vipUser.resultSet[0].APPNAMES;
			adapterLogger("updateNotifiedVIPUser","info", "vipResponse:",toString(vipResponse));
			// check if app exist for this user
			if(appNames&&appNames.indexOf(notifiedApp) != -1)
			{
				var notifiedApps =vipUser.resultSet[0].NOTIFIED_ON;

				// check if is not notified before 
				//return {dfd:notifiedApps};
				if(!notifiedApps||(notifiedApps&&notifiedApps.indexOf(notifiedApp) == -1))
				{
					var allNotifiedApp="";
					if(notifiedApps)
						allNotifiedApp=new String(notifiedApps + "," + notifiedApp);
					else
						allNotifiedApp=new String(notifiedApp);

					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['VIP_USERS'].sqlUpdate,
						parameters : [allNotifiedApp, userId]
					});
				}
			}

		}
	}
	catch(e){
		adapterLogger("updateNotifiedVIPUser","error", "Exception",toString(e));
		return handleError();
	}
}


function getUserProfile(user_id) {
	try{
//		var isAuthorizedResponse = this._isAuthorized(user_id);
//		if(isAuthorizedResponse.authRequired == false) {
			var result = {};

			var dbTablesNames = Object.keys(DB_TABLES);

			// Remove not linked tables.
			index = dbTablesNames.indexOf('Notifications');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('Widgets');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('ServiceFeedbacks');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('Cache');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('StaticPages');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('WCMNEWS');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('WCMPROJECTS');
			dbTablesNames.splice(index, 1);
			index = dbTablesNames.indexOf('WCMANNOUNCEMENTS');
			dbTablesNames.splice(index, 1);	
			index = dbTablesNames.indexOf('ONE_TIME_PASSWORD');
			dbTablesNames.splice(index, 1);	

			//

			var dbTablesNum = dbTablesNames.length;
			for (var i = 0; i < dbTablesNum; i++) {
//				MFP.Logger.info("getUserProfile(user_id): dbTablesName: " + dbTablesNames[i]);
				
				var tableName = dbTablesNames[i];
				result[tableName] = MFP.Server.invokeSQLStatement({
					preparedStatement : DB_TABLES[tableName].sqlGetAllFor,
					parameters : [ user_id ]
				}).resultSet;
//				MFP.Logger.info("getUserProfile(user_id): result[tableName]: " + JSON.stringify(result[tableName]));
				
			}

//			MFP.Logger.info("getUserProfile(user_id): User: " + user_id + "\n" + JSON.stringify(result));

			return result;
//		}
//
//		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserProfile","error", "Exception",toString(e));
		return handleError();
	}

}

/**
 * Get user information
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserInfo(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserInfo","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add/Update user information
 * 
 * @param: String, String, String, String, String, String, String, String,
 *         String, String, String, String, String, Boolean
 * @returns: JSON object
 */
function setUserInfo(user_id, cn, title_ar, title_en, first_name_ar,
		first_name_en, middlename_ar, middlename_en,
		last_name_ar, last_name_en, date_of_birth,
		id_number, nationality_ar, nationality_en,
		mobile, mail, preferred_language,
		preferred_communication, portal_id, password_changed_flag,
		isEmailVerified,isMobileVerified,isEmiratesIdVerified,
		title_id,nationality_id, user_type,trafficNo) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {

			title_ar = this._preventJsInjection(title_ar);
			title_en = this._preventJsInjection(title_en);
			first_name_ar = this._preventJsInjection(first_name_ar);
			first_name_en = this._preventJsInjection(first_name_en);
			middlename_ar = this._preventJsInjection(middlename_ar);
			middlename_en = this._preventJsInjection(middlename_en);
			last_name_ar = this._preventJsInjection(last_name_ar);
			last_name_en = this._preventJsInjection(last_name_en);
			date_of_birth = "";//this._preventJsInjection(date_of_birth);
			id_number = this._preventJsInjection(id_number);
			nationality_ar = this._preventJsInjection(nationality_ar);
			nationality_en = this._preventJsInjection(nationality_en);
			mobile = this._preventJsInjection(mobile);
			mail = this._preventJsInjection(mail);
			preferred_language = this._preventJsInjection(preferred_language);
			preferred_communication = this._preventJsInjection(preferred_communication);
			portal_id = this._preventJsInjection(portal_id);
			isEmailVerified = this._preventJsInjection(isEmailVerified);
			isMobileVerified = this._preventJsInjection(isMobileVerified);
			isEmiratesIdVerified = this._preventJsInjection(isEmiratesIdVerified);
			title_id = this._preventJsInjection(title_id);
			nationality_id = this._preventJsInjection(nationality_id);
			if(user_type){
				user_type = this._preventJsInjection(user_type);
			}else {
				user_type=null;
			}
			if(trafficNo){
				trafficNo = this._preventJsInjection(trafficNo);
			}else {
				trafficNo=null;
			}

			var dateNow = new Date();

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlGetAllFor,
				parameters : [ user_id ]
			});
			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					MFP.Logger.info("|userProfile |setUserInfo |set New: " + JSON.stringify([ user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, dateNow, dateNow,isEmailVerified,isMobileVerified,isEmiratesIdVerified,title_id,nationality_id,trafficNo ]));
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Users'].sqlInsert,
						parameters : [ user_id, cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, dateNow, dateNow,isEmailVerified,isMobileVerified,isEmiratesIdVerified,title_id,nationality_id,user_type,trafficNo ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					MFP.Logger.info("|userProfile |setUserInfo |update exist: " + JSON.stringify([ cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, dateNow, isEmailVerified,isMobileVerified,isEmiratesIdVerified,title_id,nationality_id,trafficNo, user_id ]));
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Users'].sqlUpdate,
						parameters : [ cn, title_ar, title_en, first_name_ar, first_name_en, middlename_ar, middlename_en, last_name_ar, last_name_en, date_of_birth, id_number, nationality_ar, nationality_en, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, dateNow,isEmailVerified,isMobileVerified,isEmiratesIdVerified,title_id,nationality_id,user_type,trafficNo, user_id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserInfo","error", "Exception",toString(e));
		return handleError();
	}
}



/**
 * Update user information after protal update
 * 
 * @param: String, String, String, String, String, String, 
 *         String, String, String, String, String
 * @returns: JSON object
 */
function setUserInfoForProfile(userId, titleId, firstName, lastName, nationalityId, mobileNo, 
		prefLanguage, prefComm,email,isEmailVerified,isMobileVerified) {
	try{
		var isAuthorizedResponse = this._isAuthorized(userId);
		if(isAuthorizedResponse.authRequired == false) {
			userId = this._preventJsInjection(userId);
			titleId = this._preventJsInjection(titleId);
			firstName = this._preventJsInjection(firstName);
			lastName = this._preventJsInjection(lastName);
			nationalityId = this._preventJsInjection(nationalityId);
			mobileNo = this._preventJsInjection(mobileNo);
			prefLanguage = this._preventJsInjection(prefLanguage);
			prefComm = this._preventJsInjection(prefComm);
			email = this._preventJsInjection(email);
			isEmailVerified = this._preventJsInjection(isEmailVerified);
			isMobileVerified = this._preventJsInjection(isMobileVerified);

			var dateNow = new Date();

			MFP.Logger.info("|userProfile |setUserInfoForProfile |update exist: " + JSON.stringify([userId, titleId, firstName, lastName, nationalityId, mobileNo, 
			                                                                                       prefLanguage, prefComm,email,isEmailVerified,isMobileVerified]));
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlUpdateProfile,
				parameters : [ titleId, firstName, lastName, nationalityId, mobileNo
				               ,email,prefLanguage, prefComm,dateNow,isEmailVerified,isMobileVerified, userId ]
			});
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserInfoForProfile","error", "Exception",toString(e));
		return handleError();
	}
}
/**
 * Update user mobile after portal update
 * 
 * @param: String, String, String
 * @returns: JSON object
 */
function setUserMobile(userId, mobileNo,isMobileVerified) {
	try{
		var isAuthorizedResponse = this._isAuthorized(userId);
		if(isAuthorizedResponse.authRequired == false) {
			userId = this._preventJsInjection(userId);
			mobileNo = this._preventJsInjection(mobileNo);
			isMobileVerified = this._preventJsInjection(isMobileVerified);

			var dateNow = new Date();

			var response=MFP.Logger.info("|userProfile |setUserMobile |update exist: " + JSON.stringify([userId, mobileNo]));
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlUpdateMobileNumber,
				parameters : [mobileNo,isMobileVerified,dateNow, userId ]
			});
			MFP.Logger.info("|userProfile |setUserMobile |response " + JSON.stringify(response));
			return response;
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserMobile","error", "Exception",toString(e));
		return handleError();
	}
}
/**
 * Update user mobile after portal update
 * 
 * @param: String, String, String
 * @returns: JSON object
 */
function setUserMail(userId, mail) {
	try{
		var isAuthorizedResponse = this._isAuthorized(userId);
		if(isAuthorizedResponse.authRequired == false) {
			userId = this._preventJsInjection(userId);
			mail = this._preventJsInjection(mail);

			var dateNow = new Date();

			MFP.Logger.info("|userProfile |setUserMail |update exist: " + JSON.stringify([userId, mail]));
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlUpdateMail,
				parameters : [mail,dateNow, userId ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserMail","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Update user information (Portal)
 * 
 * @param: String, String, String, String, String, String,
 *         String, String, String, String, String, Boolean
 * @returns: JSON object
 */
function setUserInfoForPortal(portal_username, portal_password, user_id, title, first_name, last_name,
		id_number, nationality, mobile, mail, preferred_language, preferred_communication,
		portal_id, password_changed_flag,isEmailVerified,isMobileVerified,isEmiratesIdVerified) {

	try{
		var isAuthorizedResponse = this._isAuthorizedPortal(portal_username, portal_password);
		if(isAuthorizedResponse.authRequired == false) {
			MFP.Logger.info("|userProfile |setUserInfoForPortal |parms before validate " + JSON.stringify([portal_username, portal_password, user_id, title, first_name, last_name,
			                                                                                		id_number, nationality, mobile, mail, preferred_language, preferred_communication,
			                                                                                		portal_id, password_changed_flag,isEmailVerified,isMobileVerified,isEmiratesIdVerified]));
			portal_username = this._preventJsInjection(portal_username);
			portal_password = this._preventJsInjection(portal_password);
			user_id = this._preventJsInjection(user_id);
			title = this._preventJsInjection(title);
			first_name = this._preventJsInjection(first_name);
			last_name = this._preventJsInjection(last_name);
			id_number = this._preventJsInjection(id_number);
			nationality = this._preventJsInjection(nationality);
			mobile = this._preventJsInjection(mobile);
			mail = this._preventJsInjection(mail);
			preferred_language = this._preventJsInjection(preferred_language);
			preferred_communication = this._preventJsInjection(preferred_communication);
			portal_id = this._preventJsInjection(portal_id);
			isEmailVerified = this._preventJsInjection(isEmailVerified);
			isMobileVerified = this._preventJsInjection(isMobileVerified);
			isEmiratesIdVerified = this._preventJsInjection(isEmiratesIdVerified);
			var dateNow = new Date();

			MFP.Logger.info("|userProfile |setUserInfoForPortal |parms" + JSON.stringify([user_id,mobile,isEmailVerified,isMobileVerified],isEmiratesIdVerified));
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlGetAllFor,
				parameters : [ user_id ]
			});
			
			
			
			if (resultSelect && resultSelect.isSuccessful) {
				if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					
					//MFP.Logger.info("|userProfile |setUserInfoForPortal |resultSelect:getuserID  " + JSON.stringify(resultSelect));
					 
					if(!isEmailVerified||isEmailVerified==null)
				 isEmailVerified=resultSelect.resultSet[0].is_email_verified;
					
				 if(!isMobileVerified||isMobileVerified==null)
				 isMobileVerified=resultSelect.resultSet[0].is_mobile_verified;
				 
					 if(!isEmiratesIdVerified||isEmiratesIdVerified==null)
				 isEmiratesIdVerified=resultSelect.resultSet[0].is_emirates_id_verified ;
					 
					MFP.Logger.info("|userProfile |setUserInfoForPortal |check isMobileVerified  isEmiratesIdVerified isEmailVerified" + JSON.stringify([isMobileVerified,isEmiratesIdVerified ,isEmailVerified]));
					
					var sqlUpdatePortalResult= MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Users'].sqlUpdatePortal,
						parameters : [ title, first_name, last_name, id_number, nationality, mobile, mail, preferred_language, preferred_communication, portal_id, password_changed_flag, dateNow,isEmailVerified,isMobileVerified,isEmiratesIdVerified, user_id ]
					});
					MFP.Logger.info("|userProfile |setUserInfoForPortal |sqlUpdatePortalResult " + JSON.stringify(sqlUpdatePortalResult));
					return sqlUpdatePortalResult;
				}
			}
			
			return {
				isSuccessful : false,
				errorCode : "USER_NOT_FOUND",
				errorMessage : "No user associated with this id"
			};
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserInfoForPortal","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user information
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserInfo(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlDelete,
				parameters : [ user_id ]
			});
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserInfo","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user notifications
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserNotifications(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserNotifications","error", "Exception",toString(e));
		return handleError();
	}
}

function updateUserNotifications(id, Users_id, service_id , type_value, title_ar, title_en, message_ar, message_en, action_label_ar, action_label_en, action_url, status, readed) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlUpdate,
				parameters : [ service_id , type_value, title_ar, title_en, message_ar, message_en, action_label_ar, action_label_en, action_url, status, readed, id, Users_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("updateUserNotifications","error", "Exception",toString(e));
		return handleError();
	}
}

function setUserNotificationReadFlag(id, user_id, status) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			var dateNow = new Date();

			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlUpdateRead,
				parameters : [ status, dateNow, id, user_id]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserNotificationReadFlag","error", "Exception",toString(e));
		return handleError();
	}
}

function getUserNotificationsCoun(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlGetNotificationsCoun,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserNotificationsCoun","error", "Exception",toString(e));
		return handleError();
	}
}

function getUserNotificationsFromTimeStamp(user_id, date) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			var dateObj = new Date(date);

			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlGetAllFromDate,
				parameters : [ user_id,  dateObj]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserNotificationsFromTimeStamp","error", "Exception",toString(e));
		return handleError();
	}
}

function getUserNotificationsWithLimit(user_id, startIndex, numberOfRecords) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlGetAllRest,
				parameters : [ user_id, startIndex,  startIndex+numberOfRecords ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserNotificationsWithLimit","error", "Exception",toString(e));
		return handleError();
	}
}


/**
 * Add user notification
 * 
 * @param: String, String, String, String, Integer, Integer
 * @returns: JSON object
 */
function setUserNotification(notification_token, user_id, service_id, type_value, title_ar, title_en, message_ar, message_en, action_label_ar, action_label_en, action_url, status) {
	try{
		if(REQ_NOTIFICATION_TOKEN == notification_token) {
			var dateNow = new Date();
			var type = parseInt(type_value);
			var statusInt = parseInt(status);

			MFP.Logger.info(" Inserting notification message: "  + " :: " + service_id + " :: " + type + " :: " + title_ar + " :: " + title_en + " :: " + message_ar + " :: " + message_en + " :: " + action_label_ar + " :: " + action_label_en + " :: " + action_url + " :: " + statusInt + " :: " + dateNow + " :: " + user_id + " :: status: " + status);

			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlInsert,
				parameters : [ service_id, type, title_ar, title_en, message_ar, message_en, action_label_ar, action_label_en, action_url, statusInt, dateNow, user_id ]
			});
		}

		return {
			isSuccessful : false,
			authRequired : true,
			errorCode : "401",
			errorMessage : "Not Authorized"
		};
	}
	catch(e){
		adapterLogger("setUserNotification","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user notification
 * 
 * @param: Integer, String
 * @returns: JSON object
 */
function deleteUserNotification(id, user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlDelete,
				parameters : [ id, user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserNotification","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user notifications
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserNotification(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Notifications'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserNotification","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user widgets
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserWidgets(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Widgets'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserWidgets","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add/Update user widget
 * 
 * @param: String, String, String
 * @returns: JSON object
 */
function setUserWidget(id, user_id, content) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Widgets'].sqlGet,
				parameters : [ id, user_id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Widgets'].sqlInsert,
						parameters : [ id, content, user_id ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Widgets'].sqlUpdate,
						parameters : [ content, id, user_id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserWidget","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user widget
 * 
 * @param: String, String
 * @returns: JSON object
 */
function deleteUserWidget(id, user_id) {
	try{	var isAuthorizedResponse = this._isAuthorized(user_id);
	if(isAuthorizedResponse.authRequired == false) {
		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['Widgets'].sqlDelete,
			parameters : [ id, user_id ]
		});
	}

	return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserWidget","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user widgets
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserWidgets(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Widgets'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserWidgets","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user favorite services
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserFavoriteServices(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['FavoriteServices'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserFavoriteServices","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add/Update user favorite service
 * 
 * @param: String, String, String
 * @returns: JSON object
 */

function updateUserFavoriteServices (user_id , stack){
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {


			stack=JSON.parse(stack);
			for (var i =0; i<stack.length;i++){
				if(stack[i].action == "add"){
					setUserFavoriteService(stack[i].ServiceId, user_id, "");
				}else if (stack[i].action == "remove"){
					deleteUserFavoriteService(stack[i].ServiceId, user_id) 
				}
			}
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['FavoriteServices'].sqlGetAllFor,
				parameters : [ user_id ]
			});

		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("updateUserFavoriteServices","error", "Exception",toString(e));
		return handleError();
	}

}
function setUserFavoriteService(id, user_id, service_title) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {

			id = this._preventJsInjection(id);
			service_title = this._preventJsInjection(service_title);

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : 'SELECT ID "id", SERVICE_TITLE "service_title", USERS_ID "Users_id" FROM Favorite_Services WHERE id=? and Users_id=?',
				parameters : [ id, user_id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : 'INSERT INTO Favorite_Services (id, service_title, Users_id) VALUES (?,?,?)',
						parameters : [ id, service_title, user_id ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : 'UPDATE Favorite_Services SET service_title=? WHERE id=? and Users_id=?',
						parameters : [ service_title, id, user_id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};

		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserFavoriteService","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user favorite service
 * 
 * @param: String, String
 * @returns: JSON object
 */
function deleteUserFavoriteService(id, user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['FavoriteServices'].sqlDelete,
				parameters : [ id, user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserFavoriteService","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user favorite services
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserFavoriteServices(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['FavoriteServices'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserFavoriteServices","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user latest recent activities for (Portal)
 * 
 * @param: String, Number
 * @returns: JSON object
 */
function getUserLatestRecentActivitiesPortal(portal_username, portal_password, user_id, coun) {
	try{
		var isAuthorizedResponse = this._isAuthorizedPortal(portal_username, portal_password);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlGetLatestFor,
				parameters : [ user_id, coun ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserLatestRecentActivitiesPortal","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get total E-Pay all users recent activities
 * 
 * @returns: JSON object
 */
function getRecentActivitiesTotalEPay(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlGetAmountSumFor,
			parameters : ["epay", startDate, endDate]
		});
	}
	catch(e){
		adapterLogger("getRecentActivitiesTotalEPay","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get total M-Pay all users recent activities
 * 
 * @returns: JSON object
 */
function getRecentActivitiesTotalMPay(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlGetAmountSumFor,
			parameters : ["mpay", startDate, endDate]
		});
	}
	catch(e){
		adapterLogger("getRecentActivitiesTotalMPay","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get recent activities service providers
 * 
 * @returns: JSON object
 */
function getRecentActivitiesServiceProviders(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}
	}
	catch(e){
		adapterLogger("getRecentActivitiesServiceProviders","error", "Exception",toString(e));
		return handleError();
	}

	return MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['RecentActivities'].sqlServiceProviders,
		parameters : [startDate, endDate]
	});
}

/**
 * Get recent activities service codes
 * 
 * @returns: JSON object
 */
function getRecentActivitiesServiceCodes(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlServiceCodes,
			parameters : [startDate, endDate]
		});
	}
	catch(e){
		adapterLogger("getRecentActivitiesServiceCodes","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get recent activities status
 * 
 * @returns: JSON object
 */
function getRecentActivitiesStatus(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlStatus,
			parameters : [startDate, endDate]
		});
	}
	catch(e){
		adapterLogger("getRecentActivitiesStatus","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get reconciliation data
 * 
 * @returns: XML Object
 */
function reconciliation(spcode, servcode, status, startDate, endDate){
	try{
		if(startDate) {
			startDate = new Date(startDate);
		}
		if(endDate) {
			endDate = new Date(endDate);
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		var result = MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].reconciliation,
			parameters : [spcode, servcode, status, startDate, endDate]
		});

		var xmlFormat = {};	
		if(result && result.resultSet){
			if(spcode == "%") {
				spcode = "";
			}
			if(servcode == "%") {
				servcode = "";
			}

			xmlFormat = "<Reconciliation>"
				+"<ServiceProviderDetails>"
				+"<SPCODE>"+spcode+"</SPCODE>"
				+"<SERVCODE>"+servcode+"</SERVCODE>"
				+"</ServiceProviderDetails>"
				+"<TransactionDetails>";

			for(var i=0;i<result.resultSet.length;i++){
				var transDate = "";
				if(result.resultSet[i].created) {
					var transDateStr = result.resultSet[i].created.toString();
					if(transDateStr.indexOf(".") != -1) {
						transDateStr = transDateStr.split(".")[0];
					}

					transDateStr = transDateStr.split("-").join("/");

					var dateObj = new Date(transDateStr);
					transDate = dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear() + " " + dateObj.getUTCHours() + ":" + dateObj.getUTCMinutes() + ":" + dateObj.getUTCSeconds();
				}

				var record = result.resultSet[i];

				/*
				if(record.status == "0" && record.activity_type.toLowerCase() == "mpay") {
					record.status = "00";
				}
				 */
				var amount = record.amount ;
				if(amount.indexOf('.') != -1 ){
					amount  = amount.substring(0,amount.indexOf('.'));
					MFP.Logger.info("Amount is " + amount);
				}
				xmlFormat +="<Transaction>"
					+"<SPTRN>"+record.sptrn+"</SPTRN>"
					+"<TransDate>"+transDate+"</TransDate>"
					+"<Amount>"+amount+"</Amount>"
					+"<DEGTRN>"+record.deg_trn+"</DEGTRN>"
					+"<Status>"+record.status+"</Status>"
					+"<PaymentMethod>Credit Card</PaymentMethod>"
					+"</Transaction>";
			}

			xmlFormat += "</TransactionDetails>"
				+"</Reconciliation>";
		}else{
			xmlFormat = "There are no transactions found";
		}
		var returnedResult = {};
		returnedResult.spcode = spcode;
		returnedResult.servcode = servcode;
		returnedResult.startDate = startDate;
		returnedResult.endDate = endDate;
		returnedResult.xmlFormat = xmlFormat;

		return returnedResult;
	}
	catch(e){
		adapterLogger("reconciliation","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get all users recent activities
 * 
 * @returns: JSON object
 */
function getAllRecentActivitiesByDates(startDate, endDate) {
	try{
		startDate = new Date(startDate);
		endDate = new Date(endDate);
		if(endDate) {
			endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
		}

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlGetAllByDates,
			parameters : [startDate, endDate]
		});
	}
	catch(e){
		adapterLogger("getAllRecentActivitiesByDates","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get all users recent activities from last date till now
 * 
 * @returns: JSON object
 */
function getAllRecentActivitiesByDate(lastDate, token) {
	try{
		if(token == REQ_RECENT_ACTIVITIES_TOKEN) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlGetAllByDate,
				parameters : [ lastDate ]
			});
		}

		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(e){
		adapterLogger("getAllRecentActivitiesByDate","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get all users recent activities from last date till now that does not have final status
 * 
 * @returns: JSON object
 */
function getAllNonFinalizedRecentActivitiesByDate(lastDate, token) {
	try{
		if(token == REQ_RECENT_ACTIVITIES_TOKEN) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlGetAllNonFinalizedByDate,
				parameters : [ lastDate ]
			});
		}

		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(e){
		adapterLogger("getAllNonFinalizedRecentActivitiesByDate","error", "Exception",toString(e));
		return handleError();
	}
}
function serverErrorHandler(error,params) {
	return {
		isSuccessful: false,
		errorCode : "99",
		errorMessage :error || "Server Error",
		params:params || null
	};
}
/**
 * Add/Update user recent activity
 * 
 * @param: String, String, String, String, String
 * @returns: JSON object
 */
function setUserRecentActivity(user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token) 
{
	try
	{

		MFP.Logger.info("|userProfile |setUserRecentActivity |start");
		MFP.Logger.info("|userProfile |setUserRecentActivity |Parameters" + [user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token]);

		if(!user_id || !sptrn) {
			var errorMessage = "Invalid required fields values";
			if(!user_id) {
				errorMessage += " - USER_ID: " + user_id;
			}
			if(!sptrn) {
				errorMessage += " - SPTRN: " + sptrn;
			}

			MFP.Logger.info("|userProfile |setUserRecentActivity |Error" +errorMessage);
			return {
				isSuccessful : false,
				resultSet : [],
				errorMessage : errorMessage
			};
		}

//		if(!sp_code) {
//		sp_code = " ";
//		}
//		if(!serv_code) {
//		serv_code = " ";
//		}
		var paymentMethod = activity_type; // resultSelect.resultSet[0].activity_type;

		if (paymentMethod=="EPay"){
			sp_code = MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE");
			serv_code = MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE");
		}else if (paymentMethod=="MPay"){
			sp_code = MFP.Server.getPropertyValue("mpay.DSGOptions.SPCODE");
			serv_code = MFP.Server.getPropertyValue("mpay.DSGOptions.SERVCODE");
		}
		var resultSelect = MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['RecentActivities'].sqlGet,
			parameters : [ sptrn, user_id ]
		});

		if (resultSelect && resultSelect.isSuccessful) {
			var dateNow = new Date();
			MFP.Logger.error("CHECK: " + app_name + "::" + service_id + "::" + service_account_id + "::" +  benificiary_type + "::" + comp_trade_license);

			if (app_name == undefined) {
				app_name = null;
			}
			if (service_id == undefined) {
				service_id = null;
			}
			if (service_account_id == undefined) {
				service_account_id = null;
			}
			if (benificiary_type == undefined) {
				benificiary_type = null;
			}
			if (comp_trade_license == undefined) {
				comp_trade_license = null;
			}
			if (payment_resp_token == undefined) {
				payment_resp_token = null;
			}		


			if (((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) && (sptrn != null && sptrn != "")) {
				//  MFP.Logger.info("|userProfile |setUserRecentActivity |Parameters" + [user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token]);
				//MFP.Logger.info("|userProfile |setUserRecentActivity |New Inserting " + [ sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, dateNow, dateNow, user_id, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token ]);
				var parms={
						Sptrn:sptrn,
						Activity_type:activity_type,
						Amount:amount,
						Channel_code: channel_code,
						Serv_code:serv_code, 
						Sp_code:sp_code,
						Version_code:version_code,
						Status:status,
						deg_trn:deg_trn,
						DateNow:dateNow,
						DateNow:dateNow,
						User_id:user_id, 
						App_name:app_name,
						Service_id:service_id,
						Service_account_id:service_account_id,
						Benificiary_type:benificiary_type,
						Comp_trade_license:comp_trade_license, 
						Payment_resp_token:payment_resp_token
				}
				adapterLogger("setUserRecentActivity","info", "Response",JSON.stringify(parms));
				return MFP.Server.invokeSQLStatement({
					preparedStatement : DB_TABLES['RecentActivities'].sqlInsert,
					parameters : [ sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, dateNow, dateNow, user_id, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token ]
				});
			} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
				MFP.Logger.info("|userProfile |setUserRecentActivity |Updating " + [ sptrn, activity_type, amount, channel_code, 
				                                                                    serv_code, sp_code, version_code, status,
				                                                                    deg_trn, dateNow, dateNow, user_id, app_name, service_id, 
				                                                                    service_account_id, benificiary_type, comp_trade_license, payment_resp_token ]);

				if (resultSelect && resultSelect.resultSet&& resultSelect.resultSet.length> 0 && resultSelect.resultSet[0] ){
					try{
						if(!amount) {
							amount = resultSelect.resultSet[0].amount;
						}
						if(!deg_trn) {
							deg_trn = resultSelect.resultSet[0].deg_trn;
						}
						if(!channel_code) {
							channel_code = resultSelect.resultSet[0].channel_code;
						}
						if(!version_code) {
							version_code = resultSelect.resultSet[0].version_code;
						}
					}catch(e){
						MFP.Logger.info("|userProfile |setUserRecentActivity |updateRecentActivities |Exception |Parameter Error:" + e);

					}
				}
				var updateRecentActivities=  MFP.Server.invokeSQLStatement({
					preparedStatement : DB_TABLES['RecentActivities'].sqlUpdate,
					parameters : [ activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, dateNow, sptrn, user_id ]
				});
//				MFP.Logger.info("|userProfile |setUserRecentActivity |updateRecentActivities " + updateRecentActivities);

				return updateRecentActivities;
			}
		}

		return {
			isSuccessful : false,
			resultSet : []
		};

	}
	catch(e)
	{
//		var exceptionMessage="Error in UserProfileAdapter.setUserRecentActivity Procedure,error:"+exception+",passed parameter values are:"
//		+user_id+","+ sptrn+","+ activity_type+","+ amount+","+ channel_code+","+ serv_code+","+ sp_code+","+ version_code+","+ status+","
//		+ deg_trn+","+ app_name+","+ service_id+","+ service_account_id+","+ benificiary_type+","+ comp_trade_license+","+ payment_resp_token;
//		MFP.Logger.info(exceptionMessage);

//		return	{
//		isSuccessful : false,
//		resultSet : [],
//		errorMessage : exceptionMessage
//		};
		try {
			MFP.Logger.info("|userProfile |setUserRecentActivity |Exception |Error: " + e.stack());
		}catch(e){

		}

		var params = [user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, app_name, service_id, service_account_id, benificiary_type, comp_trade_license, payment_resp_token];
		var error = e.message|| "setUserRecentActivity Exception";
		MFP.Logger.error("|userProfile |setUserRecentActivity |Exception |Error: " + error);
		var response =  serverErrorHandler(error,params);
		response.resultSet=[];
		return response;
	}
}

/**
 * Update only user recent activity
 * 
 * @param: String, String, String, String, String
 * @returns: JSON object
 */
function updateUserRecentActivity(user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, token) 
{
	var params = [user_id, sptrn, activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, token];
	//MFP.Logger.info("|userProfile |updateUserRecentActivity |params : " + JSON.stringify(params));
	adapterLogger("updateUserRecentActivity","info", "params:",toString(params));
	try
	{

		if(token == REQ_RECENT_ACTIVITIES_TOKEN) 
		{
			if (isUndefinedOrNullOrBlank(status)){				
				var error = "Invalid status values";
				MFP.Logger.error("|userProfile |updateUserRecentActivity |Error: " + error);
				var response =  serverErrorHandler(error,params);
				response.resultSet=[];
				return response;
			}
//			if (isUndefinedOrNullOrBlank(serv_code)){

//			var errorMessage = "Invalid serv_code values";
//			MFP.Logger.warn("userProfile :: updateUserRecentActivity :: " + errorMessage);
//			return {
//			isSuccessful : false,
//			resultSet : [],
//			errorMessage : errorMessage
//			};
//			}

//			if (isUndefinedOrNullOrBlank(sp_code)){

//			var errorMessage = "Invalid sp_code values";
//			MFP.Logger.warn("userProfile :: updateUserRecentActivity :: " + errorMessage);
//			return {
//			isSuccessful : false,
//			resultSet : [],
//			errorMessage : errorMessage
//			};
//			}


//			if (isUndefinedOrNullOrBlank(deg_trn)){

//			var errorMessage = "Invalid deg_trn values";
//			MFP.Logger.warn("userProfile :: updateUserRecentActivity :: " + errorMessage);
//			return {
//			isSuccessful : false,
//			resultSet : [],
//			errorMessage : errorMessage
//			};
//			}

			if(!user_id || !sptrn) {
				var errorMessage = "Invalid required fields values";
				if(!user_id) {
					errorMessage += " - USER_ID: " + user_id;
				}
				if(!sptrn) {
					errorMessage += " - SPTRN: " + sptrn;
				}

				MFP.Logger.warn("userProfile :: updateUserRecentActivity :: " + errorMessage);

				return {
					isSuccessful : false,
					resultSet : [],
					errorMessage : errorMessage
				};
			}

//			if(!sp_code) {
//			sp_code = " ";
//			}
//			if(!serv_code) {
//			serv_code = " ";
//			}

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlGet,
				parameters : [ sptrn, user_id ]
			});
			MFP.Logger.warn("userProfile :: updateUserRecentActivity :: sqlGet resultSelect" + JSON.stringify(resultSelect));
			if (resultSelect && resultSelect.isSuccessful) {
//				MFP.Logger.error("|userProfile |updateUserRecentActivity |Error: " + error);
				var dateNow = new Date();
				var paymentMethod = activity_type;// resultSelect.resultSet[0].activity_type;

				if (paymentMethod=="EPay"){
					sp_code = MFP.Server.getPropertyValue("epay.DSGOptions.SPCODE");
					serv_code = MFP.Server.getPropertyValue("epay.DSGOptions.SERVCODE");
				}else if (paymentMethod=="MPay"){
					sp_code = MFP.Server.getPropertyValue("mpay.DSGOptions.SPCODE");
					serv_code = MFP.Server.getPropertyValue("mpay.DSGOptions.SERVCODE");
				}
				if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					if(!amount) {
						amount = resultSelect.resultSet[0].amount;
					}
					if(!deg_trn) {
						deg_trn = resultSelect.resultSet[0].deg_trn;
					}
					if(!channel_code) {
						channel_code = resultSelect.resultSet[0].channel_code;
					}
					if(!version_code) {
						version_code = resultSelect.resultSet[0].version_code;
					}

//					SERV_CODE "serv_code", SP_CODE "sp_code"
					if(!sp_code) {
						sp_code = resultSelect.resultSet[0].sp_code;
					}
					if(!serv_code) {
						serv_code = resultSelect.resultSet[0].serv_code;
					}

					var response =  MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['RecentActivities'].sqlUpdate,
						parameters : [ activity_type, amount, channel_code, serv_code, sp_code, version_code, status, deg_trn, dateNow, sptrn, user_id ]
					});
					MFP.Logger.info("|userProfile |updateUserRecentActivity |sqlUpdate: " + JSON.stringify(resultSelect));
					return response ;
				}
			}
		}


		return {
			isSuccessful : false,
			resultSet : []
		};

	}
	catch(e)
	{
		var exceptionMessage="Error in UserProfileAdapter.updateUserRecentActivity Procedure,Exception:"+e+",passed parameter values are:"
		+user_id+","+ sptrn+","+ activity_type+","+ amount+","+ channel_code+","+ serv_code+","+ sp_code+","+ version_code+","+ status+","
		+ deg_trn+","+ token;

		MFP.Logger.error(exceptionMessage);

		return {
			isSuccessful : false,
			resultSet : [],
			errorMessage : exceptionMessage
		};

	}
}

/**
 * Update only user recent activity check step
 * 
 * @param: String, String, String
 * @returns: JSON object
 */
function updateUserRecentActivityCheckStep(user_id, sptrn, db_job_chk_counter, token) 
{
	try
	{
		if(token == REQ_RECENT_ACTIVITIES_TOKEN) {
			if(!user_id || !sptrn) {
				var errorMessage = "Invalid required fields values";
				if(!user_id) {
					errorMessage += " - USER_ID: " + user_id;
				}
				if(!sptrn) {
					errorMessage += " - SPTRN: " + sptrn;
				}

				MFP.Logger.debug("userProfile :: updateUserRecentActivityCheckStep :: " + errorMessage);

				return {
					isSuccessful : false,
					resultSet : [],
					errorMessage : errorMessage
				};
			}

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlGet,
				parameters : [ sptrn, user_id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				var dateNow = new Date();

				if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['RecentActivities'].sqlUpdateCheckStep,
						parameters : [ db_job_chk_counter, dateNow, sptrn, user_id ]
					});
				}
			}
		}

		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(exception)
	{
		//added by Hamed on 2015-02-19
		var exceptionMessage="Error in UserProfileAdapter.updateUserRecentActivityCheckStep Procedure,error:"+exception+",passed parameter values are:"
		+user_id+","+ sptrn+","+ db_job_chk_counter+","+ token;
		MFP.Logger.error(exceptionMessage);

		return {
			isSuccessful : false,
			resultSet : [],
			errorMessage : exceptionMessage
		};


	}
}

/**
 * Update response token and status for ePay5
 * 
 * @param: String, String, String
 * @returns: JSON object
 */
function updateUserRecentActivityTokenWithStatus(responseToken, sptrn, status, degTrn, token) {
	try{
		if(token == REQ_RECENT_ACTIVITIES_TOKEN) {
			if(!sptrn || !responseToken) {
				var errorMessage = "Invalid required fields values";
				if(!responseToken) {
					errorMessage += " - RESPONSE_TOKEN: " + responseToken;
				}
				if(!sptrn) {
					errorMessage += " - SPTRN: " + sptrn;
				}

				return {
					isSuccessful : false,
					resultSet : [],
					errorMessage : errorMessage
				};
			}

			var dateNow = new Date();

			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlUpdateTokenWithStatus,
				parameters : [ responseToken, dateNow, status, degTrn, sptrn ]
			});
		}

		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(e){
		adapterLogger("updateUserRecentActivityTokenWithStatus","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user recent activity
 * 
 * @param: Integer, String
 * @returns: JSON object
 */
function deleteUserRecentActivity(sptrn, user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlDelete,
				parameters : [ sptrn, user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserRecentActivity","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user recent activities
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserRecentActivities(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['RecentActivities'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserRecentActivities","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user other accounts
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserOtherAccounts(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['OtherAccounts'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserOtherAccounts","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add/Update user other account
 * 
 * @param: String, String, String, String, String
 * @returns: JSON object
 */
function setUserOtherAccount(id, user_id, label, service, parameters) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {

			id = this._preventJsInjection(id);
			label = this._preventJsInjection(label);
			service = this._preventJsInjection(service);
			parameters = this._preventJsInjection(parameters);

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['OtherAccounts'].sqlGet,
				parameters : [ id, user_id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['OtherAccounts'].sqlInsert,
						parameters : [ id, label, service, parameters, user_id ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['OtherAccounts'].sqlUpdate,
						parameters : [ label, service, parameters, id, user_id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserOtherAccount","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add/Update user other account
 * 
 * @param: String, String, String, String
 * @returns: JSON object
 */
function setUserOtherAccountPortal(portal_username, portal_password, user_id, label, service, parameters) {
	try{
		var isAuthorizedResponse = this._isAuthorizedPortal(portal_username, portal_password);

		MFP.Logger.info("------------------------setUserOtherAccountPortal: begin------------------------------");
		MFP.Logger.info("Values passed:" + user_id + " :: " + label + " :: " + service + " :: " + parameters);

		if(isAuthorizedResponse.authRequired == false) {
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlGetAllFor,
				parameters : [ user_id ]
			});


			if (resultSelect && resultSelect.isSuccessful) {
				if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					var resultSelect = MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['OtherAccounts'].sqlGetPortal,
						parameters : [ user_id, service ]
					});

					if (resultSelect && resultSelect.isSuccessful) {
						if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
							MFP.Logger.info("------------------------setUserOtherAccountPortal: insert------------------------------");
							return MFP.Server.invokeSQLStatement({
								preparedStatement : DB_TABLES['OtherAccounts'].sqlInsertPortal,
								parameters : [ label, service, parameters, user_id ]
							});
						} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
							MFP.Logger.info("------------------------setUserOtherAccountPortal: update------------------------------");
							return MFP.Server.invokeSQLStatement({
								preparedStatement : DB_TABLES['OtherAccounts'].sqlUpdatePortal,
								parameters : [ label, service, parameters, user_id, service ]
							});
						}
					}
				}
				else {
					return {
						isSuccessful : false,
						errorCode : "USER_NOT_FOUND",
						errorMessage : "No user associated with this id"
					};
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		MFP.Logger.info("------------------------setUserOtherAccountPortal: end------------------------------");
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserOtherAccountPortal","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user other account
 * 
 * @param: String, String
 * @returns: JSON object
 */
function deleteUserOtherAccountPortal(portal_username, portal_password, user_id, service) {
	try{
		var isAuthorizedResponse = this._isAuthorizedPortal(portal_username, portal_password);
		if(isAuthorizedResponse.authRequired == false) {
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Users'].sqlGetAllFor,
				parameters : [ user_id ]
			});


			if (resultSelect && resultSelect.isSuccessful) {
				if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					var resultSelect = MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['OtherAccounts'].sqlGetPortal,
						parameters : [ user_id, service ]
					});

					if (resultSelect && resultSelect.isSuccessful) {
						if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
							return MFP.Server.invokeSQLStatement({
								preparedStatement : DB_TABLES['OtherAccounts'].sqlDeletePortal,
								parameters : [ user_id, service ]
							});
						}
						else {
							return {
								isSuccessful : true,
								message : "Service is already not linked with this account"
							};
						}
					}
				}
				else {
					return {
						isSuccessful : false,
						errorCode : "USER_NOT_FOUND",
						errorMessage : "No user associated with this id"
					};
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserOtherAccountPortal","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user other account
 * 
 * @param: String, String
 * @returns: JSON object
 */
function deleteUserOtherAccount(id, user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['OtherAccounts'].sqlDelete,
				parameters : [ id, user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserOtherAccount","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user other accounts
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserOtherAccounts(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['OtherAccounts'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserOtherAccounts","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get user recent activities
 * 
 * @param: String
 * @returns: JSON object
 */
function getUserServiceFeedbacks(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['ServiceFeedbacks'].sqlGetAllFor,
				parameters : [ user_id ]
			});
		}

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("getUserServiceFeedbacks","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add user recent activity
 * 
 * @param: String, String, String, Integer, DateTime
 * @returns: JSON object
 */
function setUserServiceFeedback(user_id, service_id, user_comment, prefered_contact_time, user_mobile, q1, q2, q3, q4) {
	//var isAuthorizedResponse = this._isAuthorized(user_id);
	try{
		user_id = this._preventJsInjection(user_id);
		service_id = this._preventJsInjection(service_id);
		user_comment = this._preventJsInjection(user_comment);
		prefered_contact_time = this._preventJsInjection(prefered_contact_time);
		user_mobile = this._preventJsInjection(user_mobile);
		q1 = this._preventJsInjection(q1);
		q2 = this._preventJsInjection(q2);
		q3 = this._preventJsInjection(q3);
		q4 = this._preventJsInjection(q4);

		if(!user_id) {
			user_id="Guest";
		}
		var dateNow = new Date();

		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['ServiceFeedbacks'].sqlInsert,
			parameters : [ user_id, service_id, user_comment, prefered_contact_time, user_mobile, q1, q2, q3, q4, dateNow ]
		});

		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("setUserServiceFeedback","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user recent activity
 * 
 * @param: Integer, String
 * @returns: JSON object
 */
function deleteUserServiceFeedback(id, user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['ServiceFeedbacks'].sqlDelete,
				parameters : [ id, user_id ]
			});
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserServiceFeedback","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete user recent activities
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteUserServiceFeedbacks(user_id) {
	try{
		var isAuthorizedResponse = this._isAuthorized(user_id);
		if(isAuthorizedResponse.authRequired == false) {
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['ServiceFeedbacks'].sqlDeleteAllFor,
				parameters : [ user_id ]
			});
		}
		return isAuthorizedResponse;
	}
	catch(e){
		adapterLogger("deleteUserServiceFeedbacks","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get cache
 * 
 * @param: String
 * @returns: JSON object
 */
function getCache(id, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Cache'].sqlGet,
				parameters : [ id ]
			});
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getCache","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Add cache
 * 
 * @param: String, String
 * @returns: JSON object
 */
function setCache(id, cache, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var dateNow = new Date();

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Cache'].sqlGet,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Cache'].sqlInsert,
						parameters : [ id, cache, dateNow, dateNow ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['Cache'].sqlUpdate,
						parameters : [ cache, dateNow, id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("setCache","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete cache
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteCache(id, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			return MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['Cache'].sqlDelete,
				parameters : [ id ]
			});
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("deleteCache","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Get static page
 * 
 * @param: String
 * @returns: JSON object
 */
function getStaticPage(id) {
	return MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['StaticPages'].sqlGet,
		parameters : [ id ]
	});
}

/**
 * Add static page
 * 
 * @param: String, String
 * @returns: JSON object
 */
function setStaticPage(id, content) {
	try{
		var dateNow = new Date();

		var resultSelect = MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['StaticPages'].sqlGet,
			parameters : [ id ]
		});

		if (resultSelect && resultSelect.isSuccessful) {
			if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
				return MFP.Server.invokeSQLStatement({
					preparedStatement : DB_TABLES['StaticPages'].sqlInsert,
					parameters : [ id, content, dateNow, dateNow ]
				});
			} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
				return MFP.Server.invokeSQLStatement({
					preparedStatement : DB_TABLES['StaticPages'].sqlUpdate,
					parameters : [ content, dateNow, id ]
				});
			}
		}

		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(e){
		adapterLogger("setStaticPage","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Delete static page
 * 
 * @param: String
 * @returns: JSON object
 */
function deleteStaticPage(id) {
	try{
		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['StaticPages'].sqlDelete,
			parameters : [ id ]
		});
	}
	catch(e){
		adapterLogger("deleteStaticPage","error", "Exception",toString(e));
		return handleError();
	}
}



function getWCMNEWSBYID(id, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMNEWS'].sqlGetByID,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect; 

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getWCMNEWSBYID","error", "Exception",toString(e));
		return handleError();
	}
}

function getWCMNEWSWITHLIMIT(LIMIT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMNEWS'].sqlGetLimitedRows,
				parameters : [ LIMIT ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect;

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};

		}
	}
	catch(e){
		adapterLogger("getWCMNEWSWITHLIMIT","error", "Exception",toString(e));
		return handleError();
	}
}

function setWCMNEWS(id, WCMOBJECT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var dateNow = new Date();

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMNEWS'].sqlGetByID,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMNEWS'].sqlInsert,
						parameters : [ id, WCMOBJECT, dateNow ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMNEWS'].sqlUpdate,
						parameters : [ WCMOBJECT, id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("setWCMNEWS","error", "Exception",toString(e));
		return handleError();
	}
}



function getWCMPROJECTSBYID(id, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMPROJECTS'].sqlGetByID,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect; 

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getWCMPROJECTSBYID","error", "Exception",toString(e));
		return handleError();
	}
}

function getWCMPROJECTSWITHLIMIT(LIMIT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMPROJECTS'].sqlGetLimitedRows,
				parameters : [ LIMIT ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect;

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getWCMPROJECTSWITHLIMIT","error", "Exception",toString(e));
		return handleError();
	}
}

function setWCMPROJECTS(id, WCMOBJECT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var dateNow = new Date();

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMPROJECTS'].sqlGetByID,
				parameters : [ id ]
			});

			MFP.Logger.info("WCMPROJECTS - find record: id: " + id);

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMPROJECTS'].sqlInsert,
						parameters : [ id, WCMOBJECT, dateNow ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMPROJECTS'].sqlUpdate,
						parameters : [ WCMOBJECT, id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("setWCMPROJECTS","error", "Exception",toString(e));
		return handleError();
	}
}



function getWCMANNOUNCEMENTSBYID(id, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMANNOUNCEMENTS'].sqlGetByID,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect; 

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getWCMANNOUNCEMENTSBYID","error", "Exception",toString(e));
		return handleError();
	}
}

function getWCMANNOUNCEMENTSWITHLIMIT(LIMIT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMANNOUNCEMENTS'].sqlGetLimitedRows,
				parameters : [ LIMIT ]
			});

			if (resultSelect && resultSelect.isSuccessful)
				return resultSelect;

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("getWCMANNOUNCEMENTSWITHLIMIT","error", "Exception",toString(e));
		return handleError();
	}
}

function setWCMANNOUNCEMENTS(id, WCMOBJECT, token) {
	try{
		if(token == MFP.Server.getPropertyValue("tokens.jmsAdapter")){
			var dateNow = new Date();

			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['WCMANNOUNCEMENTS'].sqlGetByID,
				parameters : [ id ]
			});

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMANNOUNCEMENTS'].sqlInsert,
						parameters : [ id, WCMOBJECT, dateNow ]
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['WCMANNOUNCEMENTS'].sqlUpdate,
						parameters : [ WCMOBJECT, id ]
					});
				}
			}

			return {
				isSuccessful : false,
				resultSet : []
			};
		}
		else{
			return {isSuccessful: false, resultSet : []};
		}
	}
	catch(e){
		adapterLogger("setWCMANNOUNCEMENTS","error", "Exception",toString(e));
		return handleError();
	}
}

function isUndefinedOrNullOrBlank(v)
{
	if(typeof v == 'undefined' || v == undefined || v == "undefined" || v == null || v == "")
		result = true;
	else
		result = false;
	return result;
}
function setSalikAccount (user_id, account_name, account_number, pin_code,active) {
	try{

		account_name=this._preventJsInjection(account_name)
		account_number=this._preventJsInjection(account_number)
		pin_code=this._preventJsInjection(pin_code)
//		MFP.Logger.info("|setSalikAccount2 |account_name " + account_name);
//		MFP.Logger.info("|setSalikAccount |account_number " + account_number);
//		MFP.Logger.info("|setSalikAccount |pin_code " + pin_code);

		if(!isUndefinedOrNullOrBlank(account_name) 
				&& !isUndefinedOrNullOrBlank(account_number)
				&& !isUndefinedOrNullOrBlank(pin_code)
		){
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['SalikAccount'].sqlGetAllFor,
				parameters : [ user_id ]
			});
			MFP.Logger.info("|setSalikAccount |response: " + JSON.stringify(resultSelect));

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['SalikAccount'].sqlInsert,
						parameters : [user_id, account_name, account_number, pin_code,'true']
					});
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					return MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['SalikAccount'].sqlUpdate,
						parameters : [account_name, account_number, pin_code,'true',user_id]
					});
				}
			}
		}
		return {
			isSuccessful : false,
			resultSet : []
		};
	}
	catch(e){
		adapterLogger("setSalikAccount","error", "Exception",toString(e));
		return handleError();
	}
}

function getSalikAccount (user_id) {
	try{
		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['SalikAccount'].sqlGetAllFor,
			parameters : [user_id]
		});
	}
	catch(e){
		adapterLogger("getSalikAccount","error", "Exception",toString(e));
		return handleError();
	}
}
/**
 * Check if the user id who requested the operation is the same one who was
 * authenticated
 * 
 * @param: String
 * @returns: Boolean
 */
/*function _isAuthorized(user_id) {
	try{
		return {
				authRequired : false
			};
		//comented by  CS it must migration to version 8.0
	var authUserIdentity = MFP.Server.getActiveUser("masterAuthRealm");
	if (authUserIdentity) {
		var authUserId = authUserIdentity.userId;

		if (authUserId && authUserId == user_id) {
			return {
				authRequired : false
			};
		}
	}

	return {
		isSuccessful : false,
		authRequired : true,
		errorCode : "401",
		errorMessage : "Not Authorized"
	};
	}
	catch(e){
		adapterLogger("_isAuthorized","error", "Exception",toString(e));
		return handleError();
	}
}*/

function _isAuthorized(user_id) {
    
    return {
        authRequired : false
    };
    
}

/**
 * Check if portal is authorized
 * 
 * @param: String, String
 * @returns: JSON Object
 */
function _isAuthorizedPortal(portal_username, portal_password) {
	try{
	if (portal_username == REQ_PORTAL_USER_NAME && portal_password == REQ_PORTAL_PASSWORD) {
		return {
			authRequired : false
		};
	}

	return {
		isSuccessful : false,
		authRequired : true,
		errorCode : "401",
		errorMessage : "Not Authorized"
	};
	}
	catch(e){
		adapterLogger("_isAuthorizedPortal","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * Disable ability to insert code
 * 
 * @param: String
 * @returns: String
 */
function _preventJsInjection(inputTxt) {
	try{
	if(inputTxt && (typeof inputTxt == 'string' || inputTxt instanceof String)){
		return  inputTxt.replace(/<*>*-*/gi, "");
	}
	else{
		return inputTxt; //Don't mess with the rest
	}
	}
	catch(e){
		adapterLogger("_preventJsInjection","error", "Exception",toString(e));
		return handleError();
	}
}

/**
 * To be commented
 * 
 * @param: String
 * @returns: String
 */

function addOTPToDB(OTP, USER_ID,EMAIL_ADDRESS, MOBILE_NUMBER,CREATION_DATE, OTP_Verification_Method){
	try{
	var OTPRecord = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['ONE_TIME_PASSWORD'].sqlGet,
		parameters : [USER_ID]
	});

	if(OTPRecord.resultSet.length > 0){
		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['ONE_TIME_PASSWORD'].sqlUpdate,
			parameters : [OTP,EMAIL_ADDRESS,MOBILE_NUMBER,CREATION_DATE,OTP_Verification_Method,USER_ID]
		});
	}else{
		return MFP.Server.invokeSQLStatement({
			preparedStatement : DB_TABLES['ONE_TIME_PASSWORD'].sqlInsert,
			parameters : [OTP, USER_ID,EMAIL_ADDRESS, MOBILE_NUMBER,CREATION_DATE, OTP_Verification_Method]
		});
	}
	}
	catch(e){
		adapterLogger("addOTPToDB","error", "Exception",toString(e));
		return handleError();
	}
}

function verifyOTP(OTP, USER_ID, OTP_Verification_Method){
	try{
	var OTPRecord = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['ONE_TIME_PASSWORD'].sqlGet,
		parameters : [USER_ID]
	});
	if(OTPRecord != undefined){
		if(OTPRecord.resultSet.length > 0){
			var userOTP = OTPRecord.resultSet[OTPRecord.resultSet.length - 1];
			var dateNow = new Date().getTime();
			var creationDate = new Date(userOTP.CREATION_DATE).getTime();
			var expiryDuration = 1000*60*10;
			var expired = false;
			if(Math.abs(dateNow - creationDate) < expiryDuration)
			{
				if(userOTP.OTP == OTP){
					return {
						VERIFIED:true,
						OTP_EXPIRED:false,
						OTP_VERIFICATION_METHOD:userOTP.OTP_VERIFICATION_METHOD
					}
				}else{
					return {
						VERIFIED:false,
						OTP_EXPIRED:false,
						OTP_VERIFICATION_METHOD:userOTP.OTP_VERIFICATION_METHOD
					}
				}

			}else{
				return {
					VERIFIED:false,
					OTP_EXPIRED:true,
					OTP_VERIFICATION_METHOD:userOTP.OTP_VERIFICATION_METHOD
				}
			}
		}
	}
	}
	catch(e){
		adapterLogger("verifyOTP","error", "Exception",toString(e));
		return handleError();
	}
}
