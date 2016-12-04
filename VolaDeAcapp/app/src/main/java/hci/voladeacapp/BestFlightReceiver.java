package hci.voladeacapp;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import java.util.ArrayList;

import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;
import static hci.voladeacapp.MisVuelosFragment.PROMO_DETAIL_PRICE;


public class BestFlightReceiver extends BroadcastReceiver {

    Activity activity;
    ProgressDialog pDialog;
    ArrayList<DealGson> deals;

    public BestFlightReceiver(Activity activity, ProgressDialog pDialog, ArrayList<DealGson> deals) {
        this.activity = activity;
        this.pDialog = pDialog;
        this.deals = deals;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if(pDialog != null){
            pDialog.hide();
        }

        if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)) {
            return;
        }
        else {
            FlightStatusGson flGson = (FlightStatusGson) intent.getSerializableExtra(ApiService.DATA_FLIGHT_GSON);
            Flight flight = new Flight(flGson);
            double promoPrice = intent.getDoubleExtra(PROMO_DETAIL_PRICE, -1);

            DealGson asDeal = getDealFromCity(flight.getArrivalCity());

            Intent promoIntent = new Intent(this.activity, PromoDetailsActivity.class);
            promoIntent.putExtra("Flight", flight);
            promoIntent.putExtra(PROMO_DETAIL_PRICE, promoPrice);
            promoIntent.putExtra(FLIGHT_IDENTIFIER, flight.getIdentifier());
            promoIntent.putExtra(PROMO_DETAIL_PRICE, asDeal.price);
            activity.startActivity(promoIntent);

//            activity.startActivityForResult(detailIntent, MisVuelosFragment.DETAILS_REQUEST_CODE);
        }
    }

    private DealGson getDealFromCity(String arrivalCity) {
        for (DealGson d: deals) {
            if (d.city.name.equals(arrivalCity))
                return d;
        }
        return null;
    }
}
