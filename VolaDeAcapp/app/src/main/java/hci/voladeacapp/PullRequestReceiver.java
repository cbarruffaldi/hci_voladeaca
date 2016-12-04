package hci.voladeacapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import java.util.ArrayList;

import static hci.voladeacapp.MisVuelosFragment.ACTION_GET_REFRESH;

public class PullRequestReceiver extends BroadcastReceiver {
    public PullRequestReceiver() {
    }

    static long lastTime = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        ArrayList<Flight> flight_details = new ArrayList<>();
        flight_details = StorageHelper.getFlights(context.getApplicationContext());

        for (Flight f : flight_details) {
                ApiService.startActionGetFlightStatus(context.getApplicationContext(), f.getIdentifier(), ACTION_GET_REFRESH);
            }

        long time = System.currentTimeMillis();
        long delta = (time - lastTime)/(60*1000);
        lastTime = time;

        //Cambiar la configuracion al default si se borraron los datos
        NotificationManager.setDefaultPreferences(context, false);
        }

}
