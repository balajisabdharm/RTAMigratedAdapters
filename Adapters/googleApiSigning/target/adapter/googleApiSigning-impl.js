/**
 * @param interest
 *            must be one of the following: world, africa, sport, technology, ...
 *            (The list can be found in http://edition.cnn.com/services/rss/)
 * @returns json list of items
 */
function signApi(url) {
	var googleClientID = MFP.Server.getPropertyValue("google.clientID"); 
	var googleKey = MFP.Server.getPropertyValue("google.cryptoKey"); 
	var urlClientKey = url+"&client="+googleClientID;
	return {
	    signedURL : com.rta.java.util.url.signing.UrlSigner.signURL(urlClientKey, googleKey)
	  };
}
