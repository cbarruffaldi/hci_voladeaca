package hci.voladeacapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.support.design.widget.Snackbar;
import android.view.View;
import android.widget.TextView;

public class ErrConnReceiver extends BroadcastReceiver {

    private View view;
    private Snackbar snackbar;

    public Snackbar getSnackbar(){
        return snackbar;
    }

    public ErrConnReceiver(View v){
        view = v;
        Resources res = view.getResources();
        view.setZ(10);
        snackbar = Snackbar.make(view, res.getString(R.string.global_conn_err_msg), Snackbar.LENGTH_INDEFINITE);
        TextView textView = (TextView) snackbar.getView().findViewById(android.support.design.R.id.snackbar_text); //Get reference of snackbar textview
        textView.setMaxLines(3); // Change your max lines

    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if(intent.getAction().equals(ErrorHelper.NO_CONNECTION_ERROR)){
         snackbar.show();
        } else if(intent.getAction().equals(ErrorHelper.RECONNECTION_NOTICE)) {
            snackbar.dismiss();
        }
    }
}
