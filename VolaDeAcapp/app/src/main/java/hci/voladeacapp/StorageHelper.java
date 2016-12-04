package hci.voladeacapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Configuration;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static android.content.Context.MODE_PRIVATE;
import static hci.voladeacapp.ApiService.DATA_AIRLINE_ID_MAP;
import static hci.voladeacapp.ApiService.DATA_AIRNAME_ID_MAP;

public class StorageHelper {
    public final static String FLIGHT_LIST = "hci.voladeacapp.StorageHelper.FLIGHT_LIST";
    public final static String FLIGHTS = "hci.voladeacapp.data.StorageHelper.FLIGHTS";
    public final static String DATA = "hci.voladeacapp.StorageHelper.DATA";
    private static final String AIRLINE_LIST = "hci.voladeacapp.StorageHelper.AIRLINE_LIST";
    private static final String CITY_MAP = "hci.voladeacapp.StorageHelper.CITY_MAP";
    private static final String FLIGHT_SETTINGS_MAP = "hci.voladeacapp.StorageHelper.FLIGHT_SETTINGS_MAP";
    private static final String AIRNAME_LIST = "hci.voladeacapp.StorageHelper.AIRNAME_LIST";

    public final static String DEALS_WITH_IMG = "hci.voladeacapp.data.DEALS_WITH_IMG";
    public final static String DEALS_CITY_ID = "hci.voladeacapp.data.DEALS_CITY_ID";
    public final static String DEALS_CALENDAR = "hci.voladeacapp.data.DEALS_CALENDAR";
    private static final String DATA_NOTIFICATION_PREFERENCES = "hci.voladeacapp.data.DATA_NOTIFICATION_PREFERENCES";


    public static ArrayList<Flight> getFlights(Context context) {
        ArrayList<Flight> flight_details;

        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String list = sp.getString(FLIGHT_LIST, null); //Si no hay nada devuelve null

        if (list == null) {
            flight_details = new ArrayList<>();

        } else {
            Gson gson = new Gson();
            Type type = new TypeToken<ArrayList<Flight>>() {
            }.getType();

            flight_details = gson.fromJson(list, type);
        }

        return flight_details;
    }


    private static HashMap<String, FlightSettings> getFlightSettingsMap(Context context){
        HashMap<String, FlightSettings> settingsMap;

        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String stringMap = sp.getString(FLIGHT_SETTINGS_MAP, null); //Si no hay nada devuelve null

        if (stringMap == null) {
            settingsMap = new HashMap<>();

        } else {
            Gson gson = new GsonBuilder().create();
            Type type = new TypeToken<HashMap<String, FlightSettings>>() {
            }.getType();
            settingsMap = gson.fromJson(stringMap, type);
        }

        return settingsMap;

    }

    public static Map<DealGson, String> getDeals(Context context) {
        Map<DealGson, String> dealsMap;

        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String s = sp.getString(DEALS_WITH_IMG, null); //Si no hay nada devuelve null

        if (s == null) {
            dealsMap = new HashMap<>();
        } else {
            Gson gson = new Gson();
            Type type = new TypeToken<Map<DealGson, String>>(){} .getType();

            dealsMap = gson.fromJson(s, type);
        }

        return dealsMap;
    }

    public static String getDealSearchCity(Context context) {
        String city;

        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String s = sp.getString(DEALS_CITY_ID, null); //Si no hay nada devuelve null

        if (s == null) {
            city = null;
        } else {
            Gson gson = new Gson();
            Type type = new TypeToken<String>(){} .getType();

            city = gson.fromJson(s, type);
        }

        return city;
    }

    public static Calendar getDealSearchCalendar(Context context) {
        Calendar calendar;

        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String s = sp.getString(DEALS_CALENDAR, null); //Si no hay nada devuelve null

        if (s == null) {
            calendar = null;
        } else {
            Gson gson = new Gson();
            Type type = new TypeToken<Calendar>(){} .getType();

            calendar = gson.fromJson(s, type);
        }
        return calendar;
    }

    public static Map<String, String> getAirlineIdMap(Context context){
        Map<String, String> map;

        SharedPreferences sp = context.getSharedPreferences(DATA, MODE_PRIVATE);
        String mapString = sp.getString(AIRLINE_LIST, null); //Si no hay nada devuelve null

        if(mapString != null){
            Gson gson = new Gson();
            Type type = new TypeToken<Map<String,String>>(){}.getType();
            map = gson.fromJson(mapString, type);
        } else {
            map = new HashMap<>();
        }

        return map;
    }


    public static Map<String, String> getAirlineNameMap(Context context){
        Map<String, String> map;

        SharedPreferences sp = context.getSharedPreferences(DATA, MODE_PRIVATE);
        String mapString = sp.getString(AIRNAME_LIST, null); //Si no hay nada devuelve null

        if(mapString != null){
            Gson gson = new Gson();
            Type type = new TypeToken<Map<String,String>>(){}.getType();
            map = gson.fromJson(mapString, type);
        } else {
            map = new HashMap<>();
        }

        return map;
    }


    public static Map<String, CityGson> getCitiesMap(Context context){
        Map<String, CityGson> map;

        SharedPreferences sp = context.getSharedPreferences(DATA, MODE_PRIVATE);
        String mapString = sp.getString(CITY_MAP, null); //Si no hay nada devuelve null

        if(mapString != null){
            Gson gson = new Gson();
            Type type = new TypeToken<Map<String,CityGson>>(){}.getType();
            map = gson.fromJson(mapString, type);
        } else {
            map = new HashMap<>();
        }

        return map;
    }



    public static boolean flightExists(Context context, FlightIdentifier identifier){
        List<Flight> list = getFlights(context);

        Flight searcher = new Flight();
        searcher.setIdentifier(identifier);
        return list.indexOf(searcher) >= 0;
    }

    public static Flight getFlight(Context context, FlightIdentifier identifier){
        Flight searcher = new Flight();

        searcher.setIdentifier(identifier);

        List<Flight> list = getFlights(context);

        int idx = list.indexOf(searcher);
        if(idx < 0){
            return null;
        }

        return list.get(idx);

    }

    public static void deleteFlight(Context context, FlightIdentifier identifier){
        Flight searcher = new Flight();
        searcher.setIdentifier(identifier);

        List<Flight> list = getFlights(context);
        list.remove(searcher);

        saveFlights(context, list);
    }


    public static void saveFlight(Context context, Flight flight){
        List<Flight> list = getFlights(context);
        int idx = list.indexOf(flight);

        if(idx < 0) {
            list.add(flight);
        } else {
            list.remove(flight);
            list.add(idx, flight);
        }
        saveFlights(context, list);
    }


    public static void saveFlights(Context context, List<Flight> flight_details){
        saveData(context, flight_details, FLIGHT_LIST);
    }

    private static void saveSettingsMap(Context context, HashMap<String, FlightSettings> map){
        Type type = new TypeToken<HashMap<FlightIdentifier, FlightSettings>>(){}.getType();
        Gson gson = new Gson();
        String s = gson.toJson(map, type);

        SharedPreferences.Editor editor = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE).edit();
        editor.putString(FLIGHT_SETTINGS_MAP, s);
        editor.commit();

    }


    public static void fillListWithFlights(Context context, List<Flight> list){
        List<Flight> saved = getFlights(context);

        if(list == null || saved == null)
            return;

        list.clear();
        for(Flight f: saved){
            list.add(f);
        }
    }


    public static void saveNotificationPreferences(Context context, NotificationManager.NotificationPreferences preferences){
        Gson gson = new Gson();
        String s = gson.toJson(preferences, new TypeToken<NotificationManager.NotificationPreferences>(){}.getType());
        SharedPreferences.Editor editor = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE).edit();
        editor.putString(DATA_NOTIFICATION_PREFERENCES, s);
        editor.commit();
    }


    public static NotificationManager.NotificationPreferences getNotificationPreferences(Context context){
        Gson gson = new Gson();
        SharedPreferences sp = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE);
        String pref = sp.getString(DATA_NOTIFICATION_PREFERENCES, null);
        if(pref == null)
            return null;

        NotificationManager.NotificationPreferences preferences = gson.fromJson(pref, new TypeToken<NotificationManager.NotificationPreferences>(){}.getType());
        return preferences;
    }

    public static void saveDeals(Context context, Map<DealGson, String> deals) {
        saveData(context, deals, DEALS_WITH_IMG);
    }

    public static void saveDealSearchCity(Context context, String cityID) {
        saveData(context, cityID, DEALS_CITY_ID);
    }

    public static void saveDealSearchCalendar(Context context, Calendar cal) {
        saveData(context, cal, DEALS_CALENDAR);
    }

    private static void saveData(Context context, Object obj, String key) {
        Gson gson = new Gson();
        String s = gson.toJson(obj);
        SharedPreferences.Editor editor = context.getSharedPreferences(FLIGHTS, MODE_PRIVATE).edit();
        editor.putString(key, s);
        editor.commit();
    }

    //Carga recursos estaticos
    public static void initialize(Context context) {
        final SharedPreferences sp = context.getSharedPreferences(DATA, MODE_PRIVATE);
        final String airlines = sp.getString(AIRLINE_LIST, null);
        final String airnames = sp.getString(AIRNAME_LIST, null);

        if(airlines == null || airnames == null){
            //Solo si no lo tengo lo voy a buscar
            String callback = "hci.voladeacapp.initialize.AIRLINE_SAVER";

            context.getApplicationContext().registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {

                    if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                        return;
                    }


                    HashMap<String, String> idMap = (HashMap<String,String>)intent.getSerializableExtra(DATA_AIRLINE_ID_MAP);
                    HashMap<String, String> nameMap =  (HashMap<String,String>)intent.getSerializableExtra(DATA_AIRNAME_ID_MAP);

                    if(idMap != null) {
                        Gson gson = new Gson();
                        String map = gson.toJson(idMap);
                        SharedPreferences.Editor editor = sp.edit();
                        editor.putString(AIRLINE_LIST, map);
                        editor.commit();
                    }

                    if(nameMap != null){
                        Gson gson = new Gson();
                        String map = gson.toJson(nameMap);
                        System.out.println(nameMap);
                        SharedPreferences.Editor editor = sp.edit();
                        editor.putString(AIRNAME_LIST, map);
                        editor.commit();
                    }

                    //Automaticamente me desuscribo
                    context.unregisterReceiver(this);
                }
            }, new IntentFilter(callback));

            ApiService.startActionGetAirlines(context, callback);
        }


        //Cargo ciudades
        final String cities = sp.getString(CITY_MAP, null);

        if(cities == null){
            //Solo si no lo tengo lo voy a buscar
            String callback = "hci.voladeacapp.initialize.CITY_SAVER";
            context.getApplicationContext().registerReceiver(new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {

                    if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                        ErrorHelper.sendNoConnectionNotice(context);
                        return;
                    }


                    HashMap<String, CityGson> cityMap = (HashMap<String,CityGson>)intent.getSerializableExtra(ApiService.DATA_CITY_MAP);
                    if(cityMap != null) {
                        Gson gson = new Gson();
                        String map = gson.toJson(cityMap);
                        System.out.println(map);
                        SharedPreferences.Editor editor = sp.edit();
                        editor.putString(CITY_MAP, map);
                        editor.commit();
                    } else{
                    }

                    //Automaticamente me desuscribo
                    context.unregisterReceiver(this);
                }
            }, new IntentFilter(callback));

            ApiService.startActionGetCities(context, callback);

        }
    }

    public static void loadLanguage(Context c) {
        c = c.getApplicationContext();
        SharedPreferences shp = c.getSharedPreferences(
                "hci.voladeacapp.PREFERENCES", Context.MODE_PRIVATE);
        String language = shp.getString("USER_LANGUAGE", Locale.getDefault().toString().toLowerCase());

        Locale locale = new Locale(language);
        Locale.setDefault(locale);
        Configuration config = new Configuration();
        config.setLocale(locale);
        c.getResources().updateConfiguration(config, c.getResources().getDisplayMetrics()); //TODO: deprecated
    }

    public static boolean isInitialized(Context context) {

        final SharedPreferences sp = context.getSharedPreferences(DATA, MODE_PRIVATE);
        String checker;
        checker = sp.getString(AIRLINE_LIST, null);

        if (checker == null) {
            return false;
        }

        checker = sp.getString(CITY_MAP, null);
        if(checker == null){
            return false;
        }

        return true;

    }

    public static void saveSettings(Context context, FlightIdentifier identifier, FlightSettings flightSettings) {
        HashMap<String, FlightSettings> map = getFlightSettingsMap(context);
        map.put(identifier.toString(), flightSettings);
        saveSettingsMap(context, map);
    }


    public static FlightSettings getSettings(Context context, FlightIdentifier identifier){
        Map<String, FlightSettings> map = getFlightSettingsMap(context);
        return map.get(identifier.toString());
    }
}

