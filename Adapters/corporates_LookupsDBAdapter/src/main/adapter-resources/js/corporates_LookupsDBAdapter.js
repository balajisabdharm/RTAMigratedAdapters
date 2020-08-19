var sqlGetProfesstions = 'SELECT LABEL_AR "LABEL_AR", LABEL_EN "LABEL_EN", EXTID "EXTID" FROM Lookups WHERE LABEL_AR LIKE ? or LABEL_EN LIKE ?'; 

var sqlInsertProfesstions = "INSERT INTO LOOKUPS (LABEL_AR, LABEL_EN, EXTID, TYPE) VALUES (?,?,?,'PROFESSIONS')";

var sqlUpdateProfessions = "UPDATE LOOKUPS SET LABEL_AR=?, LABEL_EN=? WHERE EXTID=?";

var openConnectionStatment = "SELECT 1 FROM DUAL";


// WL.Server.createEventSource({
// 	name : 'ProfessionsEventSource',
// 	poll : {
// 		interval : 259200, // Job run each 3 days
// 		onPoll : 'synchroniseProfessions'
// 	}
// });

/**
 * this function returns the list of professions containing by the ${word} string. 
 */
function getProfessionsAutoComplete(word){
		try {
			_openConnection();
		} catch (e) {
			MFP.Logger.warn("Connection closed");
		}
		word = word.toLowerCase();
	  return MFP.Server.invokeSQLStatement({
		preparedStatement : sqlGetProfesstions,
		parameters : [new String("%" + word + "%"),new String("%" + word + "%")]
	});
}

/**
 * This is going to be used 
 * @param wsProfessionArray
 */		
function insertProfessions(){
	try {
		try {
			_openConnection();
		} catch (e) {
			MFP.Logger.warn("Connection closed");
		}
		MFP.Logger.info("Begin inserting professions");
		var invocationData = {
			parameters : [ "" ],
		};
		invocationData.adapter = "corporate_eTraffic_GetProfessionsService";
		invocationData.procedure = "getProfessions";
		var response = MFP.Server.invokeProcedure(invocationData);
		for (i in response.professions) {
			MFP.Server.invokeSQLStatement({
				preparedStatement : sqlInsertProfesstions,
				parameters : [ response.professions[i].occupationDescAR,
						response.professions[i].occupationDescEN.toLowerCase(),
						response.professions[i].occupationId ]
			});
		}
	} catch (e) {
		MFP.Logger.info("Fail insert professions in database" + e);
	}
}

function synchroniseProfessions(){
	try {
		try {
			_openConnection();
		} catch (e) {
			MFP.Logger.warn("Connection closed");
		}
		MFP.Logger.info("Begin synchronising professions");
		var invocationData = {
			parameters : [ "" ],
		};
		invocationData.adapter = "corporate_eTraffic_GetProfessionsService";
		invocationData.procedure = "getProfessions";
		var response = MFP.Server.invokeProcedure(invocationData);
		for (i in response.professions) {
			MFP.Server.invokeSQLStatement({
				preparedStatement : sqlUpdateProfessions,
				parameters : [ response.professions[i].occupationDescAR,
						response.professions[i].occupationDescEN.toLowerCase(),
						response.professions[i].occupationId ]
			});
		}
	} catch (e) {
		MFP.Logger.info("Fail synchronise professions in database" + e);
	}
}

function insertOneProfession(){
	try {
		try {
			_openConnection();
		} catch (e) {
			MFP.Logger.warn("Connection closed");
		}
			MFP.Server.invokeSQLStatement({
				preparedStatement : sqlInsertProfesstions,
				parameters : [ "مهندس",
						"engineer",
						"1001" ]
			});
		
	} catch (e) {
		MFP.Logger.info("Fail insert one profession in database" + e);
	}
}

function _openConnection(){
	 return MFP.Server.invokeSQLStatement({
			preparedStatement : openConnectionStatment,
			parameters : []
		});
}