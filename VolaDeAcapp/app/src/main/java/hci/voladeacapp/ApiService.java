package hci.voladeacapp;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * <p>
 */
public class ApiService extends IntentService {

    public static final String DATA_FLIGHT_GSON = "hci.voladeacapp.data.DATA_FLIGHT_GSON";
    public static final String DATA_GLOBAL_REVIEW = "hci.voladeacapp.data.DATA_REVIEW_LIST";
    public static final String DATA_DEAL_LIST = "hci.voladeacapp.data.DATA_DEAL_LIST";
    public static final String DATA_AIRLINE_ID_MAP = "hci.voladeacapp.data.DATA_AIRLINE_ID_MAP";
    public static final String DATA_AIRNAME_ID_MAP = "hci.voladeacapp.data.DATA_AIRNAME_ID_MAP";
    public static final String DATA_CITY_MAP = "hci.voladeacapp.data.DATA_CITY_MAP";

    public static final String API_REQUEST_ERROR = "hci.voladeacapp.error.API_REQUEST_ERROR";


    public static final String DATA_BEST_FLIGHT_FOUND = "hci.voladeacapp.broadcast.BEST_FLIGHT_FOUND";
    public static final String DATA_BEST_FLIGHT = "hci.voladeacapp.broadcast.BEST_FLIGHT";
    public static final String BEST_FLIGHT_RESPONSE = "hci.voladeacapp.broadcast.BEST_FLIGHT_RESPONSE";


    private static final String ACTION_GET_STATUS = "hci.voladeacapp.action.GET_STATUS";
    private static final String ACTION_SEND_REVIEW = "hci.voladeacapp.action.SEND_REVIEW";
    private static final String ACTION_GET_REVIEWS = "hci.voladeacapp.action.GET_REVIEWS";
    private static final String ACTION_GET_DEALS = "hci.voladeacapp.action.GET_DEALS";
    private static final String ACTION_GET_AIRLINES = "hci.voladeacapp.action.GET_AIRLINES";
    private static final String ACTION_GET_CITIES = "hci.voladeacapp.action.GET_CITIES";
    private static final String ACTION_GET_BEST_FLIGHT = "hci.voladeacapp.action.GET_BEST_FLIGHT";


    private static final String PARAM_AIRLINE = "hci.voladeacapp.extra.PARAM_AIRLINE";
    private static final String PARAM_FLNUMBER = "hci.voladeacapp.extra.PARAM_FLNUMBER";
    private static final String PARAM_REVIEW = "hci.voladeacapp.extra.PARAM_REVIEW";
    private static final String PARAM_ORIGIN_ID = "hci.voladeacapp.extra.PARAM_ORIGIN_ID";
    private static final String CALLBACK_INTENT = "hci.voladeacapp.extra.CALLBACK";
    private static final String BEST_FLIGHT_STATUS_GOT = "hci.voladeacapp.broadcast.BEST_FLIGHT_STATUS_GOT";
    private static final String PARAM_FROM = "hci.voladeacapp.extra.PARAM_FROM";
    private static final String PARAM_TO = "hci.voladeacapp.extra.PARAM_TO";
    private static final String PARAM_DATE = "hci.voladeacapp.extra.PARAM_DATE";
    private static final String PARAM_PRICE = "hci.voladeacapp.extra.PARAM_PRICE";


    private RequestQueue requestQueue;


    public ApiService() {
        super("ApiService");
    }


    /**
     * Starts this service to perform action Foo with the given parameters. If
     * the service is already performing a task this action will be queued.
     *
     * @see IntentService
     */
    public static void startActionGetFlightStatus(Context context, FlightIdentifier identifier, String callback) {
        String airline = identifier.getAirline();
        String num = identifier.getNumber();
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_STATUS);
        intent.putExtra(PARAM_AIRLINE, airline);
        intent.putExtra(PARAM_FLNUMBER, num);
        intent.putExtra(CALLBACK_INTENT, callback);
        context.startService(intent);
    }


    public static void startActionSendReview(Context context, ReviewGson review) {
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_SEND_REVIEW);
        intent.putExtra(PARAM_REVIEW, review); //SerializableExtra
        context.startService(intent);
    }


    public static void startActionGetReviews(Context context, String airline, String number, String callback){
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_REVIEWS);

        intent.putExtra(PARAM_AIRLINE, airline);
        intent.putExtra(PARAM_FLNUMBER, number);
        intent.putExtra(CALLBACK_INTENT, callback);


        context.startService(intent);
    }

    public static void startActionGetBestFlight(Context context, String from, String to, double price){
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_BEST_FLIGHT);

        intent.putExtra(PARAM_FROM, from);
        intent.putExtra(PARAM_TO, to);
        intent.putExtra(PARAM_PRICE, price);

        context.startService(intent);
    }

    public static void startActionGetAirlines(Context context, String callback) {
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_AIRLINES);

        intent.putExtra(CALLBACK_INTENT, callback);

        context.startService(intent);

    }

    public static void startActionGetCities(Context context, String callback) {
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_CITIES);

        intent.putExtra(CALLBACK_INTENT, callback);
        context.startService(intent);
    }


    public static void startActionGetDeals(Context context, String originID, String callback){
        Intent intent = new Intent(context, ApiService.class);
        intent.setAction(ACTION_GET_DEALS);

        intent.putExtra(PARAM_ORIGIN_ID, originID);
        intent.putExtra(CALLBACK_INTENT, callback);

        context.startService(intent);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            final String action = intent.getAction();
            if (ACTION_GET_STATUS.equals(action)) {
                final String airline = intent.getStringExtra(PARAM_AIRLINE);
                final String number = intent.getStringExtra(PARAM_FLNUMBER);
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                handleActionGetStatus(airline, number, callback);
            }
            if(ACTION_SEND_REVIEW.equals(intent.getAction())){
                final ReviewGson review = (ReviewGson)intent.getSerializableExtra(PARAM_REVIEW);
                handleActionSendReview(review);
            }

            if(ACTION_GET_REVIEWS.equals(intent.getAction())){
                final String airline = intent.getStringExtra(PARAM_AIRLINE);
                final String number = intent.getStringExtra(PARAM_FLNUMBER);
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                handleActionGetReviews(airline, number, callback);
            }

            if(ACTION_GET_DEALS.equals(intent.getAction())){
                final String id = intent.getStringExtra(PARAM_ORIGIN_ID);
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                handleActionGetDeals(id, callback);
            }

            if(ACTION_GET_AIRLINES.equals(intent.getAction())){
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                handleActionGetAirlines(callback);
            }

            if(ACTION_GET_CITIES.equals(intent.getAction())){
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                handleActionGetCities(callback);
            }

            if(ACTION_GET_BEST_FLIGHT.equals(intent.getAction())){
                final String callback = intent.getStringExtra(CALLBACK_INTENT);
                final String from = intent.getStringExtra(PARAM_FROM);
                final String to = intent.getStringExtra(PARAM_TO);
                final Double price = intent.getDoubleExtra(PARAM_PRICE, 0);

                handleActionGetBestDeal(from, to, price);
            }
        }
    }

    private class AirlineDescriptor{
        public String id;
        public String logo;
        public String name;
    };


    private void handleActionGetAirlines(final String callback) {
        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }

        String url = "http://hci.it.itba.edu.ar/v1/api/misc.groovy?method=getairlines";


        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);
                            HashMap<String, String> idMap = new HashMap<>();
                            HashMap<String, String> nameMap = new HashMap<>();

                            if(obj.has("airlines")){

                                Gson gson = new Gson();

                                Type type = new TypeToken<ArrayList<AirlineDescriptor>>() {
                                }.getType();

                                ArrayList<AirlineDescriptor> list = gson.fromJson(obj.getJSONArray("airlines").toString(), type);
                                for(AirlineDescriptor air : list){
                                    idMap.put(air.name, air.id);
                                    nameMap.put(air.id, air.name);
                                }

                            } else{
                                idMap = null;
                            }

                        sendBroadcast(new Intent(callback).putExtra(DATA_AIRLINE_ID_MAP, idMap).putExtra(DATA_AIRNAME_ID_MAP, nameMap));


                        }catch(Exception e){
                            e.printStackTrace();

                            sendRequestErrorBroadcast(callback);
                        }



                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorBroadcast(callback);
            }

        });

        requestQueue.add(stringRequest);



    }


    private void handleActionGetCities(final String callback) {
        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }

        String url = "http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities";


        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);
                            HashMap<String, CityGson> cityMap = new HashMap<>();

                            if(obj.has("cities")){

                                Gson gson = new Gson();

                                Type type = new TypeToken<ArrayList<CityGson>>() {
                                }.getType();

                                ArrayList<CityGson> list = gson.fromJson(obj.getJSONArray("cities").toString(), type);
                                for(CityGson air : list){
                                    cityMap.put(air.name, air);
                                }

                            } else{
                                cityMap = null;
                            }

                            sendBroadcast(new Intent(callback).putExtra(DATA_CITY_MAP, cityMap));

                        }catch(Exception e){
                            e.printStackTrace();
                            sendRequestErrorBroadcast(callback);
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorBroadcast(callback);

            }

        });

        requestQueue.add(stringRequest);



    }




    private void handleActionSendReview(ReviewGson review) {
        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }


        String url = "http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline";


        Gson gson = new Gson();
        Type type = new TypeToken<ReviewGson>() {
        }.getType();

        final String jsonReview = gson.toJson(review ,type);

        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);
                            if(obj.has("review") && obj.getBoolean("review")) {
                            } else{

                            }

                        }catch(Exception e){
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }

        }){

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json");
                return headers;
            }

            //Clase anonima StringRequest
            @Override
            public byte[] getBody(){
                return jsonReview.getBytes();
            }

        };

        requestQueue.add(stringRequest);

    }




    private void handleActionGetReviews(final String airline, final String number, final String callback) {

        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }


        final String url = "http://hci.it.itba.edu.ar/v1/api/review.groovy?method=getairlinereviews"
                        + "&airline_id=" + airline + "&flight_number=" + number;


        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);

                            Gson gson = new Gson();
                            Type type = new TypeToken<ArrayList<ReviewGson>>() {
                            }.getType();

                            ArrayList<ReviewGson> reviewList;

                            if(obj.has("reviews")) {
                                reviewList = gson.fromJson(obj.getString("reviews"), type);
                            } else{
                                //Error
                                reviewList = null;
                            }
                            GlobalReview global = new GlobalReview(airline, number, reviewList);
                            sendBroadcast(new Intent(callback).putExtra(DATA_GLOBAL_REVIEW, global));
                        }catch(Exception e){
                            e.printStackTrace();
                            sendRequestErrorBroadcast(callback);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorBroadcast(callback);
            }
        });
        // Add the request to the RequestQueue;
        requestQueue.add(stringRequest);

    }




    private void handleActionGetDeals(String originId, final String callback) {

        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }


        String url = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals"
                + "&from=" + originId;


        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);

                            Gson gson = new Gson();
                            Type type = new TypeToken<ArrayList<DealGson>>() {
                            }.getType();

                            ArrayList<DealGson> dealList;

                            if(obj.has("deals")) {
                                dealList = gson.fromJson(obj.getString("deals"), type);
                            } else{
                                //Error
                                dealList = null;
                            }
                            sendOrderedBroadcast(new Intent(callback).putExtra(DATA_DEAL_LIST, dealList), null);
                        }catch(Exception e){
                            e.printStackTrace();
                            sendRequestErrorOrderedBroadcast(callback);
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorOrderedBroadcast(callback);

            }
        });
        // Add the request to the RequestQueue;
        requestQueue.add(stringRequest);

    }




    private void handleActionGetStatus(String airline, String number, final String callback) {
        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }

        String url = "http://hci.it.itba.edu.ar/v1/api/status.groovy?method=getflightstatus&airline_id="
                + airline + "&flight_number=" + number;

        System.out.println(url);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);

                            Gson gson = new Gson();
                            Type type = new TypeToken<FlightStatusGson>() {
                            }.getType();

                            FlightStatusGson status;
                            if(obj.has("status")) {
                                status = gson.fromJson(obj.getString("status"), type);
                            } else{
                                //No existe el vuelo
                                status = null;
                            }
                            sendOrderedBroadcast(new Intent(callback).putExtra(DATA_FLIGHT_GSON, status), null);
                        }catch(Exception e){
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorOrderedBroadcast(callback);

            }
        });
        // Add the request to the RequestQueue;
        requestQueue.add(stringRequest);


    }

    private void sendRequestErrorBroadcast(String callback){
        sendBroadcast(new Intent(callback).putExtra(API_REQUEST_ERROR, true));
    }

    private void sendRequestErrorOrderedBroadcast(String callback){
        sendOrderedBroadcast(new Intent(callback).putExtra(API_REQUEST_ERROR, true), null);

    }
    public void handleActionGetBestDeal(String from, String to, double price) {
        if(requestQueue == null) {
            requestQueue = Volley.newRequestQueue(this);
        }

        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0); // same for minutes and seconds
        today.add(Calendar.DATE, 3);

        sendMinPriceRequest(from, to, price, today.getTime(), 10);
    }


    private void sendMinPriceRequest(final String from, final String to, final double minPrice, final Date date, final int tries){

        if(tries < 0) {
            sendErrorFindingBestFlight();
            return;
        }


        Format formatter = new SimpleDateFormat("yyyy-MM-dd");
        final String dateStr = formatter.format(date);

        String url = "http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights"
                + "&from=" + from + "&to=" + to + "&adults=1&children=0&infants=0&dep_date=" + dateStr + "&sort_key=total&page_size=1";


        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject obj = new JSONObject(response);
                            if(obj.has("flights")) {
                                JSONArray flights_arr = obj.getJSONArray("flights");

                                if(flights_arr.length() < 1){
                                    sendNextRequest(from, to, minPrice, date, tries);
                                    return;
                                }

                                JSONObject flight = flights_arr.getJSONObject(0);
                                Double price =   flight.getJSONObject("price")
                                                    .getJSONObject("total").getDouble("total");

                                if(price == minPrice){

                                    String id = flight.getJSONArray("outbound_routes")
                                                .getJSONObject(0)
                                                .getJSONArray("segments")
                                                .getJSONObject(0)
                                                .getJSONObject("airline")
                                                .getString("id");


                                    String number = "" + flight.getJSONArray("outbound_routes")
                                            .getJSONObject(0)
                                            .getJSONArray("segments")
                                            .getJSONObject(0)
                                            .getInt("number");


                                    FlightIdentifier identifier = new FlightIdentifier();
                                    identifier.setAirline(id);
                                    identifier.setNumber(number);


                                    Intent intent = new Intent(BEST_FLIGHT_RESPONSE)
                                                        .putExtra(DATA_BEST_FLIGHT_FOUND, true)
                                                        .putExtra("identifier", identifier);
                                    sendBroadcast(intent);

                                    return;
                                }
                            } else {
                                sendErrorFindingBestFlight();
                                return;
                            }


                          sendNextRequest(from, to, minPrice, date, tries);


                        }catch(Exception e){
                            sendRequestErrorBroadcast(BEST_FLIGHT_RESPONSE);
                            return;
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                sendRequestErrorBroadcast(BEST_FLIGHT_RESPONSE);
            }
        });
        // Add the request to the RequestQueue;
        requestQueue.add(stringRequest);


    }

    private void sendNextRequest(final String from, final String to, final double minPrice, final Date date, final int tries){
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, 1);
        Date newDate = c.getTime();
        //Siguiente request
        sendMinPriceRequest(from, to, minPrice, newDate, tries - 1);
    }


    private void sendErrorFindingBestFlight() {
        Intent intent = new Intent(BEST_FLIGHT_RESPONSE)
                .putExtra(DATA_BEST_FLIGHT_FOUND, false);
        sendBroadcast(intent);
    }


}
