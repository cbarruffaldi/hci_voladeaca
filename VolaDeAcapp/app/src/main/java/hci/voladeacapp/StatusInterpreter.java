package hci.voladeacapp;

import android.content.Context;
import android.graphics.Color;

import com.google.android.gms.maps.model.BitmapDescriptorFactory;

public class StatusInterpreter {

    /*Retorna la imagen correspondiente al estado recibido como String */
    public static int getStateImage(String state) {
        switch(state){
            case "L":
                return R.drawable.ic_landedbadge;

            case "S":
                return R.drawable.ic_okbadge;

            case "A":
                return R.drawable.ic_takeoffbadge;

            case "R":
                return R.drawable.ic_deviationbadge;

            case "C":
                return R.drawable.ic_cancelbadge2;

            case "D":
                return R.drawable.ic_delayedbadge;
        }
        return -1;
    }

    /*Retorna el nombre de el estado según la letra recibida */
    public static String getStatusName(Context c,String state){
        switch(state){
            case "L":
                return c.getString(R.string.landed);
            case "S":
                return c.getString(R.string.programmed);
            case "A":
                return c.getString(R.string.active);
            case "R":
                return c.getString(R.string.diverted);
            case "D":
                return c.getString(R.string.late);
            case "C":
                return c.getString(R.string.cancelled);

        }
        return "";
    }

    public static int getStatusColor(String state) {
        switch(state){
            case "L":
                return Color.rgb(63, 81, 181);

            case "S":
                return Color.rgb(76, 175, 80);

            case "A":
                return Color.rgb(63, 81, 181);

            case "D":
                return Color.rgb(255, 87, 34);

            case "R":
                return Color.rgb(255, 87, 34);

            case "C":
                return Color.rgb(229, 57, 53);

        }
        return 0;
    }

}
