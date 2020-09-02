/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package com.rta;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;
//import com.ibm.json.java.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.xml.sax.SAXException;
import org.apache.log4j.Logger;
import java.util.ArrayList;
import java.util.List;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.params.HttpParams;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.NameValuePair;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.ContentType;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.ConfigurationAPI;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.apache.http.Consts;
import org.apache.http.client.utils.URIBuilder;

import java.util.HashMap;
import java.util.Map;

public class IAMUAEPASS extends UserAuthenticationSecurityCheck {
    private String userId, displayName;
    private String errorMsg;
    private static CloseableHttpClient client;
    //private static HttpGet host;
    private static HttpGet host;
    private static HttpPost httpPost;
    private boolean rememberMe = false;
    private static String PARAMS_STRING_PREFIX = "?params=%5B%22";
    private static String PARAMS_STRING_SUFFIX = "%22%5D";
    private static String PARAMS_SEPERATOR = "%22%2C%20%22";
    static Logger logger = Logger.getLogger(UserAuthenticationSecurityCheck.class.getName());

    
    @Override
    protected AuthenticatedUser createUser() {
       System.out.println("UserLogin: AuthenticatedUser starts ************************** "+this.getName());
        return new AuthenticatedUser(userId, displayName, this.getName());
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        System.out.println("UserLogin: validateCredentials starts ");
        boolean status = false;
        
         // check UAE PASS
       /* Wrong piece of Code Checked In - to be confirmed
        if(credentials!=null && credentials.containsKey("username") &&credentials.containsKey("authenticationType")&&credentials.containsKey("authenticationType").equals("UAEPASS")&& credentials.containsKey("appID")){
        	return true;
        }
        */
        if(credentials!=null && credentials.containsKey("username") && credentials.containsKey("authenticationType")&& (credentials.get("authenticationType").equals("UAEPASS")) && credentials.containsKey("appID")){
            status = true;
            return status;
        }
         
        if(credentials!=null && credentials.containsKey("username") && credentials.containsKey("password")&& credentials.containsKey("authenticationType")&& credentials.containsKey("appID")){
            String username = credentials.get("username").toString();
            String password = credentials.get("password").toString();
            String authenticationType=credentials.get("authenticationType").toString();
            String appID=credentials.get("appID").toString();
            if(!username.isEmpty() && !password.isEmpty()) {
                System.out.println("validateCredentials....going to call execute method "+authenticationType +" appID "+appID);
                try {
                    //status = execute(username,password,"appID",authenticationType);
                    //passing correct variable instead of static value "appID"
                    status = execute(username,password,appID,authenticationType);
                     logger.info("UserLogin:  validateCredentials status: "+status);
                    System.out.println("validateCredentials received....status"+ status);
                    } catch (IllegalStateException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                if(status){
                    if(credentials.containsKey("rememberMe") ){
                        rememberMe = Boolean.valueOf(credentials.get("rememberMe").toString());
                  }
                errorMsg = null;
                return true;
                }
                //Optional RememberMe
               
            }else {
                errorMsg = "Invalid Username or Password";
            }
        }
        else{
            errorMsg = "Credentials not set properly";
        }
        return false;
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map challenge = new HashMap();
        challenge.put("errorMsg",errorMsg);
        challenge.put("remainingAttempts",getRemainingAttempts());
        return challenge;
    }

    @Override
    protected boolean rememberCreatedUser() {
        return rememberMe;
    }
    
    
    public boolean execute(String username, String password,String appID, String authenticationType)
    throws IOException,
    IllegalStateException, SAXException {
    System.out.println(" execute start username "+username +"password "+password);
        
       

        JSONArray request = new JSONArray();
        request.put(username);
         request.put(password);
        request.put(appID);

        
        
        client = HttpClientBuilder.create().build();
       
        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("params",request.toString() ));
        
        //host = new HttpGet("http://mfp-staging.rta.ae:8443/mfp/api/adapters/authenticationIAM/authenticate"+offsetURL);
        //host = new HttpGet("http://mfp-staging.rta.ae:8443/mfp/api/adapters/authenticationIAM/authenticate");
        //host = new HttpGet("http://localhost:9080/mfp/api/adapters/authenticationIAM/authenticate"+offsetURL);
        httpPost = new HttpPost("http://localhost:9080/mfp/api/adapters/authenticationIAM/authenticate");
        
    
        
        UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params, Consts.UTF_8);
      
        httpPost.setEntity(entity);
        HttpResponse RSSResponse = client.execute(httpPost);
        
       
        logger.info("execute response received....");
        System.out.println("response received...."+ RSSResponse);
        
        System.out.println("Response Code : "
                           + RSSResponse.getStatusLine().getStatusCode());
        
        int status = RSSResponse.getStatusLine().getStatusCode();
        logger.info("execute response status...."+status);
      
       
        if(status ==200){
              BufferedReader rd = new BufferedReader(
                      new InputStreamReader(RSSResponse.getEntity().getContent()));

              StringBuffer result = new StringBuffer();
              String line = "";
              while ((line = rd.readLine()) != null) {
                  result.append(line);
              }
              System.out.println("result is "+result);
              JSONObject localObj = new JSONObject(result.toString());
            System.out.println("localObj is "+localObj.toString());
             //JSONObject resultObj=localObj.getJSONObject(0);
            // System.out.println("resultObj is "+resultObj);
           // String authRequired =(localObj.getJSONObject(0)).getString("authRequired");
            boolean authRequired =localObj.getBoolean("authRequired");
            System.out.println("authRequired is "+authRequired);
            if (!authRequired){
                userId = localObj.getString("userId");
                System.out.println("userId is "+userId);
                displayName = userId;
                
                return true;
            }else {
                JSONObject failureObj=localObj.getJSONObject("failure");
                String errorCode=failureObj.getString("errorCode");
                 System.out.println("errorCode is "+errorCode);
                if(errorCode.equals("01")){
                    errorMsg = "Invalid Username or Password";
                }else {
                    errorMsg = failureObj.getString("failure");                }
            }
            
              //setAttributesObj(result.toString(),encodedString);
             System.out.println("errorMsg is "+errorMsg);
        return false;
        }else{
            errorMsg="Please try after some time";
            System.out.println("errorMsg is "+errorMsg);
            return false;
        }
        
    }
    
    @Context
    AdaptersAPI adaptersAPI;
    
    @GET
    @Path("/calljs")
    @Produces("application/json")
    public JSONObject authenticate(String username, String password, String appID) throws IOException{
        
         System.out.println("validateCredentials  authenticate called aa");
        JSONObject localObj = new JSONObject();
       //Using helper method to create a request to the JS adapter
        System.out.println("validateCredentials  authenticate called bb asa"+adaptersAPI.getAdapterName());
        //HttpUriRequest req = adaptersAPI.createJavascriptAdapterRequest("authenticationIAM", "authenticate");
        
        System.out.println("validateCredentials  authenticate called bb");
        //Execute the request and get the response
        //HttpResponse resp = adaptersAPI.executeAdapterRequest(req);
        System.out.println("validateCredentials  authenticate called cc");
        //Convert the response to JSON since we know that JS adapters always return JSON
       // JSONObject json = adaptersAPI.getResponseAsJSON(resp);
        System.out.println("validateCredentials  authenticate called dd");
        //Return the json response as the response of the current request
        return localObj;
    }
    
    public static void main(String[] args) {
           // TODO Auto-generated method stub
           IAMUAEPASS testObj = new IAMUAEPASS();
           String userId = "amit.goyal@ibmcollabcloud.com:password";
           String passsword = "password";
        
           try {
               testObj.execute(userId,passsword,"dd","ww");
           } catch (Exception e) {
               // TODO Auto-generated catch block
               e.printStackTrace();
           }
           
       }
}
