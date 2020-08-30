//Helpers Functions
function adapterLogger(procudureName , type , suffix, msg ){
	var _msg = msg || "";
	try{
		var prefix= "|SalikDelinkAdapter |" + procudureName +" |"+ suffix + " : " ;
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
		MFP.Logger.error("|SalikDelinkAdapter |adapterLogger |Exception" + JSON.stringify(e));
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
				"adapter": "SalikDelinkAdapter"
			}
	};
	adapterLogger("handleError","error", "Internal Error",JSON.stringify(response));
	return response;
}

var DB_TABLES = {
	'SalikAccount' : {
			sqlGetAllFor : 'SELECT USER_ID "user_id", NICKNAME "nickname",ACCOUNT_NUMBER "account_number" , ACCOUNT_PIN "account_pin" , ACTIVE "active" FROM SALIK_ACCOUNTS WHERE USER_ID=?',
			sqlInsert : "INSERT INTO SALIK_ACCOUNTS (user_id, nickname, account_number, account_pin, active) VALUES (?,?,?,?,?)",
			sqlDelete : "DELETE FROM SALIK_ACCOUNTS WHERE user_id=?",
			sqlDeleteAllFor : "DELETE FROM SALIK_ACCOUNTS WHERE Users_id=?",
			sqlUpdate : "UPDATE SALIK_ACCOUNTS SET NICKNAME=?, ACCOUNT_NUMBER=?, ACCOUNT_PIN=?, ACTIVE=? WHERE user_id=?",
		},
}

function isUndefinedOrNullOrBlank(v)
{
	if(typeof v == 'undefined' || v == undefined || v == "undefined" || v == null || v == "")
		result = true;
	else
		result = false;
	return result;
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
		adapterLogger("SalikDelinkAdapter_preventJsInjection","error", "Exception",toString(e));
		return handleError();
	}
}

function unsetSalikAccount (user_id, account_name, account_number, pin_code,active) {
	try{

		var account_name=this._preventJsInjection(account_name);
		var account_number=this._preventJsInjection(account_number);
		var pin_code=this._preventJsInjection(pin_code);

		if( !isUndefinedOrNullOrBlank(account_name) && !isUndefinedOrNullOrBlank(account_number) && !isUndefinedOrNullOrBlank(pin_code) ){
			var resultSelect = MFP.Server.invokeSQLStatement({
				preparedStatement : DB_TABLES['SalikAccount'].sqlGetAllFor,
				parameters : [ user_id ]
			});
			MFP.Logger.info("SalikDelinkAdapter|getSalikAccount |response: " + JSON.stringify(resultSelect));

			if (resultSelect && resultSelect.isSuccessful) {
				if ((!resultSelect.resultSet) || (resultSelect.resultSet && resultSelect.resultSet.length == 0)) {
					
					return {
						"isSuccessful": false,
						"error": {
							"status": "404",
							"code": "RTA-DeLinkSalik-ERROR-1",
							"message_en": "User is not exist",
							"message_ar": "المستخدم غير موجود"
						}
					};
					
				} else if (resultSelect.resultSet && resultSelect.resultSet.length > 0) {
					var execStatement = MFP.Server.invokeSQLStatement({
						preparedStatement : DB_TABLES['SalikAccount'].sqlDelete,
						parameters : [user_id]
					});
					if(execStatement.updateStatementResult.updateCount && execStatement.updateStatementResult.updateCount == 1){
						return {
						   "isSuccessful":true,
						   "error":{
							   "status":"0",
							   "message_en":"Account successfully delinked",
							   "message_ar":"تم فك ربط الحساب",
							   "code":"RTA-DeLinkSalik-Status-0"
						   }
						}
					} else {
						return {
						   "isSuccessful":false,
						   "error":{
							   "status":"1",
							   "message_en":"Input Error",
							   "message_ar":"خطأ فى المدخلات",
							   "code":"RTA-DeLinkSalik-ERROR-6"
						   }
						}
					}
					
				}
			}
		}
		return {
					"isSuccessful": false,
					"error": {
						"status": "1",
						"message_en": "Input Error",
						"message_ar": "خطأ فى المدخلات",
						"code": "RTA-DeLinkSalik-ERROR-2",
					}
				};
	}
	catch(e){
		adapterLogger("setSalikAccount","error", "Exception",toString(e));
		return handleError();
	}
}