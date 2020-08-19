/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * prepared statements
 */

var DB_TABLES = {
	'GreenPoints' : {
		getLatest_PT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg : 'MERGE INTO GREEN_POINTS_AGG dest '
						+'	USING( SELECT USER_ID , '
						+'			USER_NAME , '
						+'			CARD_ID , '
						+'			SCORE , '
						+'			COMPARISON , '
						+'			TIME_PT , '
						+'			CO2_PT , '
						+'			MONEY_PT , '
						+'			HAPPINESS_PT , '
						+'			ENV_IMPACT_PT , '
						+'			TIME_DT , '
						+'			CO2_DT , '
						+'			MONEY_DT , '
						+'			HAPPINESS_DT , '
						+'			ENV_IMPACT_DT , '
						+'			TIME_STAMP  '
						+'			FROM ( '
						+'				  SELECT '
						+'					GP.*, '
						+'					ROW_NUMBER() OVER (partition by USER_ID ORDER BY TIME_STAMP DESC) R '
						+'				  FROM '
						+'					GREEN_POINTS GP'
						+'				  WHERE (GP.CO2_DT <> 0 OR GP.MONEY_DT <> 0)'
						+'			  ) '
						+'			WHERE R = 1) src '
						+'			ON( dest.USER_ID = src.USER_ID ) '
						+'			WHEN MATCHED THEN '
						+'				UPDATE SET '
						+'					USER_NAME		= src.USER_NAME, '
						+'					CARD_ID			= src.CARD_ID, '
						+'					SCORE			= src.SCORE + dest.SCORE,'
						+'					TIME_DT			= src.TIME_DT, '
						+'					CO2_DT			= src.CO2_DT, '
						+'					MONEY_DT		= src.MONEY_DT, '
						+'					HAPPINESS_DT	= src.HAPPINESS_DT, '
						+'					ENV_IMPACT_DT	= src.ENV_IMPACT_DT '
						+'			WHEN NOT MATCHED THEN'
						+'				INSERT( USER_ID, '
						+'						USER_NAME, '
						+'						CARD_ID, '
						+'						SCORE, '
						+'						TIME_PT, '
						+'						CO2_PT, '
						+'						MONEY_PT, '
						+'						HAPPINESS_PT, '
						+'						ENV_IMPACT_PT, '
						+'						TIME_DT, '
						+'						CO2_DT, '
						+'						MONEY_DT, '
						+'						HAPPINESS_DT, '
						+'						ENV_IMPACT_DT ) '
						+'				VALUES( src.USER_ID, '
						+'						src.USER_NAME, '
						+'						src.CARD_ID, '
						+'						src.SCORE, '
						+'						src.TIME_PT, '
						+'						src.CO2_PT, '
						+'						src.MONEY_PT, '
						+'						src.HAPPINESS_PT, '
						+'						src.ENV_IMPACT_PT, '
						+'						src.TIME_DT, '
						+'						src.CO2_DT, '
						+'						src.MONEY_DT, '
						+'						src.HAPPINESS_DT, '
						+'						src.ENV_IMPACT_DT )',
		getLatest_DT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg :'MERGE INTO GREEN_POINTS_AGG dest '
						+'	USING( SELECT USER_ID , '
						+'			USER_NAME , '
						+'			CARD_ID , '
						+'			SCORE , '
						+'			COMPARISON , '
						+'			TIME_PT , '
						+'			CO2_PT , '
						+'			MONEY_PT , '
						+'			HAPPINESS_PT , '
						+'			ENV_IMPACT_PT , '
						+'			TIME_DT , '
						+'			CO2_DT , '
						+'			MONEY_DT , '
						+'			HAPPINESS_DT , '
						+'			ENV_IMPACT_DT , '
						+'			TIME_STAMP  '
						+'			FROM ( '
						+'				  SELECT '
						+'					GP.*, '
						+'					ROW_NUMBER() OVER (partition by USER_ID ORDER BY TIME_STAMP DESC) R '
						+'				  FROM '
						+'					GREEN_POINTS GP'
						+'				  WHERE (GP.CO2_PT <> 0 OR GP.MONEY_PT <> 0)'
						+'			  ) '
						+'			WHERE R = 1) src '
						+'			ON( dest.USER_ID = src.USER_ID ) '
						+'			WHEN MATCHED THEN '
						+'				UPDATE SET '
						+'					USER_NAME		= src.USER_NAME, '
						+'					CARD_ID			= src.CARD_ID, '
						+'					SCORE			= src.SCORE + dest.SCORE,'
						+'					TIME_PT			= src.TIME_PT, '
						+'					CO2_PT			= src.CO2_PT, '
						+'					MONEY_PT		= src.MONEY_PT, 	'
						+'					HAPPINESS_PT	= src.HAPPINESS_PT, '
						+'					ENV_IMPACT_PT	= src.ENV_IMPACT_PT '
						+'			WHEN NOT MATCHED THEN'
						+'				INSERT( USER_ID, '
						+'						USER_NAME, '
						+'						CARD_ID, '
						+'						SCORE, '
						+'						TIME_PT, '
						+'						CO2_PT, '
						+'						MONEY_PT, '
						+'						HAPPINESS_PT, '
						+'						ENV_IMPACT_PT, '
						+'						TIME_DT, '
						+'						CO2_DT, '
						+'						MONEY_DT, '
						+'						HAPPINESS_DT, '
						+'						ENV_IMPACT_DT ) '
						+'				VALUES( src.USER_ID, '
						+'						src.USER_NAME, '
						+'						src.CARD_ID, '
						+'						src.SCORE, '
						+'						src.TIME_PT, '
						+'						src.CO2_PT, '
						+'						src.MONEY_PT, '
						+'						src.HAPPINESS_PT, '
						+'						src.ENV_IMPACT_PT, '
						+'						src.TIME_DT, '
						+'						src.CO2_DT, '
						+'						src.MONEY_DT, '
						+'						src.HAPPINESS_DT, '
						+'						src.ENV_IMPACT_DT )'
	},

	'GreenPointsAgg' : {
		sqlGet : 'SELECT * FROM GREEN_POINTS_AGG WHERE USER_ID=?',
		getAllRanks : 'SELECT USER_ID, SCORE, CEIL ( ( RANK() over (order by SCORE DESC) / (SELECT COUNT(*) FROM(SELECT USER_ID FROM GREEN_POINTS_AGG)) ) * 100 ) AS RANK FROM GREEN_POINTS_AGG ORDER BY SCORE DESC', 
		updateUserRank : 'MERGE INTO GREEN_POINTS_AGG dest '
														+'	USING( SELECT USER_ID, SCORE, CEIL ( ( RANK() over (order by SCORE DESC) / (SELECT COUNT(*) FROM(SELECT USER_ID FROM GREEN_POINTS_AGG)) ) * 100 ) AS RANK FROM GREEN_POINTS_AGG ORDER BY SCORE DESC ) src '
														+'	ON( dest.USER_ID = src.USER_ID ) '
														+'	WHEN MATCHED THEN '
														+'    UPDATE SET '
														+'		RANK = src.RANK',
		truncate_Table : 'TRUNCATE TABLE GREEN_POINTS_AGG'
	},
	'GreenPointsAggRanking':{
		sqlGet:'SELECT Distinct RANK , SCORE ,(Select Score from (SELECT distinct SCORE FROM GREEN_POINTS_AGG order by SCORE desc) where rownum = 1) As MAXSCORE FROM GREEN_POINTS_AGG  where SCORE IN (?,(SELECT SCORE From ( SELECT distinct SCORE FROM GREEN_POINTS_AGG where  SCORE > ? order by SCORE) where rownum = 1),(SELECT SCORE From ( SELECT distinct SCORE FROM GREEN_POINTS_AGG where  SCORE < ? order by SCORE desc) where rownum = 1)) order by score'
	}
	

};

/**
 * daily event source for update GreenPoints by aggregating rank for all users
 */
WL.Server.createEventSource({
	name : 'GreenPointsEventSource',
	poll : {
		interval : 24 * 60 * 60,
		onPoll : 'update_Green_Points_Agg_Table'
	}
});

function getGreenPointsRanking(score){
	var greenPoints = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPointsAggRanking'].sqlGet,
		parameters : [score,score,score]
	});
	return greenPoints;
	
}
function update_Green_Points_Agg_Table(){
	var s = {};
	s.truncate_Table = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPointsAgg'].truncate_Table,
		parameters : []
	});
			
	s.getLatest_PT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPoints'].getLatest_PT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg,
		parameters : []
	});

	s.getLatest_DT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPoints'].getLatest_DT_ForAllUsers_And_InsertOrUpdate_Into_GreenPointsAgg,
		parameters : []
	});

	s.updateUserRank = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPointsAgg'].updateUserRank,
		parameters : []
	});
	
	return s;
}

/**
 * get aggregated green points for specific user
 * 
 * @param username
 * @returns
 */
function getGreenPoints(userid) {
	var greenPoints = MFP.Server.invokeSQLStatement({
		preparedStatement : DB_TABLES['GreenPointsAgg'].sqlGet,
		parameters : [userid]
	});
	
	//Limit rank output to 60%, this was confirmed with Amar
	if(greenPoints.resultSet 
	   && greenPoints.resultSet[0]
	   && greenPoints.resultSet[0].RANK){
		if(greenPoints.resultSet[0].RANK > 60){
			greenPoints.resultSet[0].RANK = -1;
		}
	}
	
	//if the userid is not in the database
	if(greenPoints.resultSet.length == 0)
		greenPoints = {"isSuccessful":true,"resultSet":[{"RANK":-1}]};
		
	return  greenPoints;
}