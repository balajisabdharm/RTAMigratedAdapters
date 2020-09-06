package com.rta.mfp.confidential;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;



//import com.ibm.json.java.JSONObject;
import java.util.ArrayList;
import java.util.List;
import java.util.Base64;

import org.apache.http.Consts;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;

import org.apache.http.client.methods.HttpPost;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONObject;


public class ConfidentialClientClass {
	
	//Following properties need to be changed on the basis of the env and the backend resposne time
	private static String USERNMAME = "test";
	private static String PASSWORD = "test";
	private static String HOSTNAME_URL = "http://mfp-staging.rta.ae:8443";
	private static String MFP_ADAPTER_PROCEEDURE_URL = "/mfp/api/adapters/portalAdapter/getUserProfile";
	private static int  READ_TIMEOUT =10;  //in seconds
	private static int  CONNECTION_TIMEOUT =5; //in seconds
	
	//No change following properties
	private static String CONFIDENTIAL_CLIENT_URL = "/mfp/api/az/v1/token";
	private static String GRANT_TYPE = "grant_type";
	private static String CLIENT_CREDENTIALS = "client_credentials";
	private static String SCOPE= "scope"; 
	private static String SCOPE_VALUE= "*"; 
	private static String STATUS= "status"; 
	private static String OAUTH_TOKEN= "oauthToken"; 
	private static boolean STATUS_SUCCESS =true;
	private static boolean STATUS_FAIL =false;
	private static String HTTP_STATUS_CODE = "HTTPStatusCode";
	private static String KEY_PARAMS="params";
	
	//private static boolean status =false;
	
	private static String encodedCredentials (){
		
		String authStr = USERNMAME + ":" + PASSWORD;
		String encodeBytes = Base64.getEncoder().encodeToString((authStr).getBytes());
		return encodeBytes;
		

	}
	
	public JSONObject getOAuthToken()
		    {
		    System.out.println(" getOAuthToken() start");
		    CloseableHttpResponse response =null;
		    String oauthToken =null;
		    JSONObject returnObj =new JSONObject();
		    returnObj.put(STATUS,STATUS_FAIL );
		    int CONNECTION_TIMEOUT_MS = CONNECTION_TIMEOUT * 1000; // Timeout in millis.
		    int READ_TIMEOUT_MS = READ_TIMEOUT * 1000; // Timeout in millis.
		    RequestConfig requestConfig = RequestConfig.custom()
		      .setConnectionRequestTimeout(CONNECTION_TIMEOUT_MS)
		      .setConnectTimeout(CONNECTION_TIMEOUT_MS)
		      .setSocketTimeout(READ_TIMEOUT_MS)
		      .build();
		    
		    
		    CloseableHttpClient httpclient = HttpClients.createDefault();
	        try {
	            //HttpGet httpGet = new HttpGet("http://httpbin.org/get");
	 	        HttpPost request = new HttpPost(HOSTNAME_URL+CONFIDENTIAL_CLIENT_URL);
	 	       request.addHeader("Authorization","Basic "+encodedCredentials() );
	 	       //System.out.println(" execute() encodedCredentials "+encodedCredentials());
	            List <NameValuePair> nvps = new ArrayList <NameValuePair>();
	            nvps.add(new BasicNameValuePair(GRANT_TYPE,CLIENT_CREDENTIALS ));
	            nvps.add(new BasicNameValuePair(SCOPE, SCOPE_VALUE));
	            request.setConfig(requestConfig);
	            request.setEntity(new UrlEncodedFormEntity(nvps));
	            
	            response = httpclient.execute(request);
	            
	            int status = response.getStatusLine().getStatusCode();
	            System.out.println("getOAuthToken() HTTP Status Code received : "+status);
	            returnObj.put(HTTP_STATUS_CODE,status );
	            if(status ==200){
	            	BufferedReader rd = new BufferedReader(
	                            new InputStreamReader(response.getEntity().getContent()));

	                StringBuffer result = new StringBuffer();
	                String line = "";
	                while ((line = rd.readLine()) != null) {
	                        result.append(line);
	                }
	                 System.out.println("getOAuthToken() Response received is "+result);
	                 JSONObject localObj = new JSONObject(result.toString());
	              
	                oauthToken =localObj.getString("access_token");
	              
	                 returnObj.put(STATUS,STATUS_SUCCESS);
	                 returnObj.put(OAUTH_TOKEN,oauthToken);

	            } else{
	            	
	            }
	            
	        }catch (IllegalStateException e) { 
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}finally {
	        	try {
					response.close();
					httpclient.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	            
	        }
			return returnObj;

		        
		    }
	
	
	public JSONObject callMFPAdapterProcedure(String oauthToken, String userName, String appName)
		    {
		    System.out.println(" callMFPAdapterProcedure() start");
		    CloseableHttpResponse response =null;
		    String responseStr =null;
		    JSONObject localObj = null;
		    JSONArray inputParams = new JSONArray();
		    inputParams.put(userName);
		    inputParams.put(appName);
	        List<NameValuePair> params = new ArrayList<>();
	        params.add(new BasicNameValuePair(KEY_PARAMS,inputParams.toString() ));
	        int CONNECTION_TIMEOUT_MS = CONNECTION_TIMEOUT * 1000; // Timeout in millis.
		    int READ_TIMEOUT_MS = READ_TIMEOUT * 1000; // Timeout in millis.
		    
		    RequestConfig requestConfig = RequestConfig.custom()
		      .setConnectionRequestTimeout(CONNECTION_TIMEOUT_MS)
		      .setConnectTimeout(CONNECTION_TIMEOUT_MS)
		      .setSocketTimeout(READ_TIMEOUT_MS)
		      .build();
		    
		    
		    CloseableHttpClient httpclient = HttpClients.createDefault();
	        try {
	        	UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params, Consts.UTF_8);
	 	        HttpPost request = new HttpPost(HOSTNAME_URL+MFP_ADAPTER_PROCEEDURE_URL);
	 	      
	 	        request.addHeader("Authorization","Bearer "+ oauthToken);
	 	        request.setEntity(entity);
	 	        request.setConfig(requestConfig);
	 	        
	 	        
	            response = httpclient.execute(request);
	            
	            int status = response.getStatusLine().getStatusCode();
	            System.out.println("callMFPAdapterProcedure() HTTP Status Code received :"+status);
	            if(status ==200){
	            	BufferedReader rd = new BufferedReader(
	                            new InputStreamReader(response.getEntity().getContent()));

	                StringBuffer result = new StringBuffer();
	                String line = "";
	                while ((line = rd.readLine()) != null) {
	                        result.append(line);
	                }
	                 //System.out.println("callMFPAdapterProcedure Response Received is "+result);
	                 
	                localObj = new JSONObject(result.toString());
	                 responseStr =result.toString();
	                 System.out.println("callMFPAdapterProcedure Response is "+responseStr);
	               

	            } else{
	            	localObj.optString("statusReason", "Failure");
	            	
	            }
	            
	        } catch (IllegalStateException e) { 
				// TODO Auto-generated catch block
	        	localObj.optString("statusReason", "Failure");
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				localObj.optString("statusReason", "Failure");
				e.printStackTrace();
			}catch (Exception e) {
				localObj.optString("statusReason", "Failure");
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        finally {
	        	try {
					response.close();
					httpclient.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	            
	        }
	        return localObj;

		        
		    }
	
	
	

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		ConfidentialClientClass testObj = new ConfidentialClientClass();
		
			 System.out.println("Initiating MFP Adapter call....");
			 String userName = "";
			JSONObject response =testObj.getOAuthToken();
			String oauthToken=response.getString(OAUTH_TOKEN);
			System.out.println("response status "+response.getBoolean(STATUS) +" statusCode is "+ response.getInt(HTTP_STATUS_CODE)+" ouath token "+oauthToken);
			//testObj.callMFPAdapterProcedure(response.getString(OAUTH_TOKEN),'aymannageh2020','DNVAPP');
			JSONObject  result =testObj.callMFPAdapterProcedure(oauthToken, "aymannageh2020", "DNVAPP");
			System.out.println("response status "+result.getString("statusReason"));
			
		
	}

}
