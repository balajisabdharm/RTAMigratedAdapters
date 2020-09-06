const app = document.getElementById('root');

const logo = document.createElement('img');

const container = document.createElement('div');
container.setAttribute('class', 'container');


app.appendChild(container);


onload = function () {
    var access_token = getToken();

    var JSONObj = getUserProfile(access_token,"aymannageh2020","DNVAPP");
    
    const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const h1 = document.createElement('h1');
      h1.textContent = "AccessToken";

      const p = document.createElement('p');
      p.textContent = access_token;

      container.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p);
    
    
    const card2 = document.createElement('div');
    card.setAttribute('class', 'card');

    const h2 = document.createElement('h1');
    h2.textContent = "getUserProfile";

    const p2 = document.createElement('p');
    p2.textContent = JSON.stringify(JSONObj);

    container.appendChild(card2);
    card.appendChild(h2);
    card.appendChild(p2);
      
    
}

function getToken(){
    // alert("getToken...")
    //var request ;
    var access_token;
     var request = new XMLHttpRequest();
    var HOSTNAME = "http://mfp-staging.rta.ae:8443";
       var CONFIDENTIAL_CLIENT_URL = "/mfp/api/az/v1/token";
       var MFP_ADAPTER_PROCEEDURE_URL = "/mfp/api/adapters/portalAdapter/getUserProfile";
    var CORS_URL="https://cors-anywhere.herokuapp.com/";
    request.open('POST',CORS_URL+HOSTNAME+CONFIDENTIAL_CLIENT_URL, false);
   
    
       
    if (typeof btoa !== 'function') {
      // Cannot encode data to Base64 because the btoa() function is not supported
      // Perhaps you want to use a polyfill or at least inform user about this
        alert("error btoa not supported....")
    }
    else{
        var authStr = 'test:test';
        var b64 = btoa(authStr);
        //alert("b64: "+b64);
    }
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Authorization", "Basic "+b64);
    
    var data ='grant_type=client_credentials&scope=*';

  
    request.send(data);
    //request.send();
    console.log('response head: ' + request.response);
    console.log('response head: ' + request.getAllResponseHeaders);
    var JSONObj = JSON.parse(request.response);
    var access_token = JSONObj.access_token;
    return access_token;
}

function getUserProfile(token,userName,appName){
    
      var request = new XMLHttpRequest();
     var HOSTNAME = "http://mfp-staging.rta.ae:8443";
        
        var MFP_ADAPTER_PROCEEDURE_URL = "/mfp/api/adapters/portalAdapter/getUserProfile?params=%5B%22";
        var PARAMS_STRING_SUFFIX = "%22%5D";
        var PARAMS_SEPERATOR = "%22%2C%20%22";
    
    //String adapterURL=HOSTNAME_URL+MFP_ADAPTER_PROCEEDURE_URL+PARAMS_STRING_PREFIX+userName+PARAMS_SEPERATOR+appName+PARAMS_STRING_SUFFIX;
    
     var CORS_URL="https://cors-anywhere.herokuapp.com/";
     var data =userName+PARAMS_SEPERATOR+appName+PARAMS_STRING_SUFFIX;
    console.log("url "+CORS_URL+HOSTNAME+MFP_ADAPTER_PROCEEDURE_URL+data);
     request.open('POST',CORS_URL+HOSTNAME+MFP_ADAPTER_PROCEEDURE_URL+data, false);
    
     request.setRequestHeader("Authorization", "Bearer "+token);
     //request.setRequestHeader('Access-Control-Allow-Origin','*');
     var data ='params=grant_type=client_credentials&scope=*';
     request.send();
     var JSONObj = JSON.parse(request.response);
   // var JSONObj = (request.response);
     var access_token = JSONObj.access_token;
    
     return JSONObj;
    
    
}
