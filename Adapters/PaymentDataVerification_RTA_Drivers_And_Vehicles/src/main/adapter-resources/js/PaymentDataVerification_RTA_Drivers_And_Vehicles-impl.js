
//Vendors should implement the stub function below to verify 
//amount in backend and  return 'dataVerified' with the verification status
//paymentType: EPAT, MPAY
function verifyData(token,sptrn,amount, edata, paymentType) {
	if(token == MFP.Server.getPropertyValue("tokens.recentActivities")){
		//Instead of the check below, do an actual call to your backend and verify amount
		if(sptrn && amount){
			var transactionAmount = getTransactionAmount(sptrn);
			MFP.Logger.warn("|ePayAdapter |createEPayRequest |transactionAmount"+transactionAmount);
			MFP.Logger.warn("|ePayAdapter |createEPayRequest |transactionAmount"+amount);
			var isDataVerified = (transactionAmount == amount);
			return {
				dataVerified: isDataVerified
			};
		}
		else{
			return {
				error: 'Invalid amount or transaction number',
				dataVerified: false
			};
		}
	}
	else{
		return {
			error: 'Invalid token',
			dataVerified: false
		};
	}
}


function getChannelCredentials() {
	return MFP.Server.invokeProcedure({
		adapter : 'drivers_and_vehciles_utilitiesAdapter',
		procedure : 'getChannelCredentials',
		parameters : [],

	});
}
function getTransactionAmount(spTRN)
{
	var amount;
	var transactionId = spTRN.substring(spTRN.length - 8);
	
	var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ae="http://ae.gov.trf.stp.ws.MobilityPaymentLogService">'+
					"<soapenv:Header>"+
						"<ae:password>"+getChannelCredentials().password+"</ae:password>"+
						"<ae:username>"+getChannelCredentials().username+"</ae:username>"+
					"</soapenv:Header>"+
					"<soapenv:Body>"+
						"<ae:getPaymentByTransactionId>"+
							"<ae:transactionId>"+transactionId+"</ae:transactionId>"+
						"</ae:getPaymentByTransactionId>"+
					"</soapenv:Body>"+
				  "</soapenv:Envelope>";
	var parameters = [request];
	invocationData = {
						adapter : 'drivers_and_vehicles_transactionsAdapter',
						procedure : 'invokeMobilityPaymentLogServiceOperation',
						parameters : parameters
					};

	var result = MFP.Server.invokeProcedure(invocationData);
	
	if (result.Envelope.Body != undefined && result.Envelope.Body != null &&
		result.Envelope.Body.getPaymentByTransactionIdReturn != undefined &&
		result.Envelope.Body.getPaymentByTransactionIdReturn.responseCode != undefined &&
		result.Envelope.Body.getPaymentByTransactionIdReturn.responseCode != null &&
		result.Envelope.Body.getPaymentByTransactionIdReturn.responseCode == 1
		)

		amount = result.Envelope.Body.getPaymentByTransactionIdReturn.amount;
			
	return amount;
}

function encryptData(data,appId) {
	var password = MFP.Server.getPropertyValue("epay.Encryption.PASSWORD." + appId);
	
	MFP.Logger.info("--===--->>> encryptData :: "+appId);
	MFP.Logger.info("--===--->>> encryptData :: "+password);
	MFP.Logger.info("--===--->>> encryptData :: "+JSON.stringify(data));
	var cypherText = Aes.Ctr.encrypt(JSON.stringify(data),password,ENCRYPTION_STRENGTH);
	//return {cypherText: cypherText };
	return {cypherText: password};
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
var ENCRYPTION_STRENGTH = MFP.Server.getPropertyValue("epay.Encryption.STRENGTH");
if (ENCRYPTION_STRENGTH == '256') ENCRYPTION_STRENGTH = 256;
else ENCRYPTION_STRENGTH = 128;


