/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var REQ_PORTAL_USER_NAME = MFP.Server.getPropertyValue("tokens.portal.vendorUsername");
var REQ_PORTAL_PASSWORD = MFP.Server.getPropertyValue("tokens.portal.vendorPassword");
var RECENT_ACTIVITIES_COUNTER = 10;

/**
 * Get user recent activities
 * 
 * @param: String, Number
 * @returns: JSON array
 */
function getRecentActivities(userId) {
	
	var isAuthorizedResponse = this._isAuthorized(userId);
	if(isAuthorizedResponse.authRequired == false) {
		var invocationData = {
			adapter : 'userProfile',
			procedure : 'getUserLatestRecentActivitiesPortal',
			parameters : [ REQ_PORTAL_USER_NAME, REQ_PORTAL_PASSWORD, userId, RECENT_ACTIVITIES_COUNTER ]
		};

		var response =  MFP.Server.invokeProcedure(invocationData, {
			onSuccess : function(response) {
			},
			onFailure : function(response) {
				return this._serverErrorResponse();
			}
		});
		
		if(response && response.isSuccessful) {
			return response;
		}
		else {
			return this._serverErrorResponse();
		}
	}
	
	return isAuthorizedResponse;
}

/**
 * Check if the user id who requested the operation is the same one who was
 * authenticated
 * 
 * @param: String
 * @returns: Boolean
 */
/*function _isAuthorized(user_id) {
	var authUserIdentity = MFP.Server.getAuthenticatedUser("masterAuthRealm");
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
}*/

function _isAuthorized(user_id) {
    
    return {
        authRequired : false
    };
}

function _serverErrorResponse() {
	return {
		isSuccessful : false,
		errorCode: "INTERNAL_SERVER_ERROR",
		errorMessage: "Internal server error"
	};
}

