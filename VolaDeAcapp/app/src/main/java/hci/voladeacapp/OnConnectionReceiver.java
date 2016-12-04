package hci.voladeacapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class OnConnectionReceiver extends BroadcastReceiver {
    public OnConnectionReceiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        System.out.println("Network connectivity change");
        ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (intent.getExtras() != null) {
            NetworkInfo ni = cm.getActiveNetworkInfo();
            if (ni != null && ni.getState() == NetworkInfo.State.CONNECTED) {
                System.out.println("Network " + ni.getTypeName() + " connected");
                System.out.println("Initialized: " + StorageHelper.isInitialized(context));

                if(! StorageHelper.isInitialized(context)){
                    StorageHelper.initialize(context);
                }
                ErrorHelper.sendConnectionNotice(context);
            } else if (intent.getBooleanExtra(ConnectivityManager.EXTRA_NO_CONNECTIVITY, Boolean.FALSE)) {
                ErrorHelper.sendNoConnectionNotice(context);
                System.out.println("There's no network connectivity");
                System.out.println("Initialized: " + StorageHelper.isInitialized(context));
            }
        }
    }
}
