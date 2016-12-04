package hci.voladeacapp;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class ErrorHelper {

    public static final String NO_CONNECTION_ERROR = "hci.voladeacapp.error.NO_CONNECTION_ERROR";
    public static final String RECONNECTION_NOTICE = "hci.voladeacapp.error.RECONNECTION_NOTICE";

    public static void connectionErrorShow(Context context){
        Resources res = context.getResources();
        new AlertDialog.Builder(context)
                .setTitle(res.getString(R.string.conn_err_title))
                .setMessage(res.getString(R.string.conn_err_msg))
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();

    }


    public static void alert(Context context, String title, String message){
        new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(message)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();

    }

    public static void sendNoConnectionNotice(Context context) {
        context.sendBroadcast(new Intent(NO_CONNECTION_ERROR));
    }

    public static void sendConnectionNotice(Context context) {
        context.sendBroadcast(new Intent(RECONNECTION_NOTICE));

    }


    public static void checkConnection(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();

        if(activeNetworkInfo == null){
            sendNoConnectionNotice(context);
        } else {
            sendConnectionNotice(context);
        }
    }


}
