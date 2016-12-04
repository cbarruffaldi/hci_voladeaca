package hci.voladeacapp;

import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static hci.voladeacapp.ApiService.BEST_FLIGHT_RESPONSE;
import static hci.voladeacapp.ApiService.DATA_BEST_FLIGHT;
import static hci.voladeacapp.ApiService.DATA_BEST_FLIGHT_FOUND;
import static hci.voladeacapp.ApiService.DATA_DEAL_LIST;
import static hci.voladeacapp.ApiService.DATA_FLIGHT_GSON;
import static hci.voladeacapp.ApiService.DATA_GLOBAL_REVIEW;
import static hci.voladeacapp.MisVuelosFragment.ACTION_GET_FLIGHT;

public class CheloActivity extends AppCompatActivity {

    private class MyReciever extends BroadcastReceiver{

        @Override
        public void onReceive(Context context, Intent intent) {

            if(pDialog != null){
                pDialog.hide();
            }

            TextView txt = (TextView)findViewById(R.id.dbg_text);
            final FlightStatusGson response = (FlightStatusGson)intent.getSerializableExtra(DATA_FLIGHT_GSON);
            txt.setText("Recibi intent de Service: " + response);

        }
    }

    MyReciever rcv;
    BroadcastReceiver reviewrcv;
    BroadcastReceiver dealrcv;
    ProgressDialog pDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chelo);

        rcv = rcv == null ? new MyReciever() : rcv;

    }

    @Override
    protected void onStart() {
        super.onStart();

        Button cheloDebug = (Button)findViewById(R.id.chelo_btn);

        reviewrcv = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {

                if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                    //Error de conexion, no puedo hacer nada :(
                    return;
                }


                GlobalReview global = (GlobalReview)intent.getSerializableExtra(DATA_GLOBAL_REVIEW);
                for(ReviewGson r : global.list){
                    System.out.println(r.comments);
                }

                System.out.println("GLOBAL:");
                System.out.println(global.getRating());
                System.out.println(global.comfort());
                System.out.println(global.getRecommendedPercentage());

            }
        };


        dealrcv = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                List<DealGson> list = (List<DealGson>)intent.getSerializableExtra(DATA_DEAL_LIST);
                if(list == null){
                    System.out.println("NULL LIST!");
                }
                else {
                    for (DealGson d : list) {
                        System.out.println("" + d.city + ": " + d.price);
                    }
                }
            }
        };


        cheloDebug.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View view) {

                pDialog = new ProgressDialog(CheloActivity.this);
                pDialog.setMessage("Loading!");
                pDialog.show();


                TextView txt = (TextView)findViewById(R.id.dbg_text);
                txt.setText("OK");

              //  ApiService.startActionGetFlightStatus(view.getContext(), "8R", "8700", ACTION_GET_FLIGHT);
           //     ApiService.startActionGetReviews(view.getContext(), "AR", "5620", "GET_REVIEWS");
            //    ApiService.startActionGetDeals(view.getContext(), "BUE", "GET_DEALS");

                Map<String, String> idMap = StorageHelper.getAirlineIdMap(view.getContext());

                Map<String, CityGson> cityMap = StorageHelper.getCitiesMap(view.getContext());

                Calendar today = Calendar.getInstance();
                today.set(Calendar.HOUR_OF_DAY, 0); // same for minutes and seconds
                today.add(Calendar.DATE, 3);
                registerReceiver(new BroadcastReceiver() {
                    @Override
                    public void onReceive(Context context, Intent intent) {
                        boolean found = intent.getBooleanExtra(DATA_BEST_FLIGHT_FOUND, false);
                        if(found){
                            System.out.println("CHELO FOUND THE BEST FLIGHT");
                            System.out.println((FlightIdentifier)intent.getSerializableExtra("identifier"));
                        }else
                            System.out.println("CHELO DIDNT FOUND THE BEST FLIGHT");
                    }
                }, new IntentFilter(BEST_FLIGHT_RESPONSE));

                ApiService.startActionGetBestFlight(view.getContext(), "BUE", "LLON", 1463.75);

                List<Flight> list = StorageHelper.getFlights(view.getContext());
       /*         for(ConfiguredFlight f : list){
                    System.out.println();
                    FlightSettings settings = f.getSettings();
                    System.out.println("SETTINGS FOR " + f.getAirlineID() + " " + f.getNumber());
                    System.out.println("Landing: " + settings.isActive(NotificationCategory.LANDING));
                    System.out.println("Delay: " + settings.isActive(NotificationCategory.DELAY));
                    System.out.println("Cancelation: " + settings.isActive(NotificationCategory.CANCELATION));
                    System.out.println("Takeoff: " + settings.isActive(NotificationCategory.TAKEOFF));
                    System.out.println("Deviation: " + settings.isActive(NotificationCategory.DEVIATION));
                    System.out.println("ALL: " + settings.notificationsActive());
                    System.out.println();

                }*/

                /*
                if(idMap != null) {
                    txt.setText(idMap.toString());
                } else {
                    txt.setText("NULL MAP");
                }*/

                if(cityMap != null){
                    txt.setText(cityMap.toString());
                }else{
                    txt.setText("NULL MAP!");
                }
                /*   AlarmManager alarmMgr;
                PendingIntent alarmIntent;

                alarmMgr = (AlarmManager)view.getContext().getSystemService(Context.ALARM_SERVICE);
                Intent intent = new Intent(view.getContext(), PullRequestReceiver.class);
                alarmIntent = PendingIntent.getBroadcast(view.getContext(), 0, intent, 0);

               alarmMgr.cancel(alarmIntent);
                //    sendBroadcast(new Intent(TIME_TO_PULL)); */
          }
        });

    }

    @Override
    protected void onResume(){
        super.onResume();
        registerReceiver(rcv, new IntentFilter(ACTION_GET_FLIGHT));
        registerReceiver(reviewrcv, new IntentFilter("GET_REVIEWS"));
        registerReceiver(dealrcv, new IntentFilter("GET_DEALS"));

    }

    @Override
    protected void onPause(){
        super.onPause();
        unregisterReceiver(rcv);
        unregisterReceiver(reviewrcv);
        unregisterReceiver(dealrcv);
    }
}
