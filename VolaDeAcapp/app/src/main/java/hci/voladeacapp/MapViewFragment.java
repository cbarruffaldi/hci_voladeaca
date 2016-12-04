package hci.voladeacapp;

import android.app.Fragment;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static hci.voladeacapp.ApiService.BEST_FLIGHT_RESPONSE;
import static hci.voladeacapp.ApiService.DATA_BEST_FLIGHT_FOUND;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;
import static hci.voladeacapp.MisVuelosFragment.IS_PROMO_DETAIL;
import static hci.voladeacapp.MisVuelosFragment.PROMO_DETAIL_PRICE;

public class MapViewFragment extends Fragment {
    MapView mMapView;
    private GoogleMap GMap;

    private String fromCityID;
    private ArrayList<DealGson> deals;
    private Map<Marker, DealGson> markerDeals;

    private ProgressDialog pDialog;

    private static final String START_DETAIL_CALLBACK = "hci.voladeacapp.START_DETAIL_CALLBACK";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_maps, container, false);

        mMapView = (MapView) rootView.findViewById(R.id.mapView);
        mMapView.onCreate(savedInstanceState);
        mMapView.onResume(); // needed to get the map to display immediately

        getActivity().findViewById(R.id.promo_card_list).setVisibility(View.GONE);
        try {
            MapsInitializer.initialize(getActivity().getApplicationContext());
        } catch (Exception e) {
            e.printStackTrace();
        }

        mMapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(GoogleMap mMap) {
                GMap = mMap;
                GMap.setOnInfoWindowClickListener(new mapPromoDetailsListener());
                getActivity().findViewById(R.id.map_loading_indicator).setVisibility(View.GONE);
                getActivity().findViewById(R.id.map_price_reference).setVisibility(View.VISIBLE);

                updateMap(deals, fromCityID);
            }
        });



        return rootView;
    }

    public static MapViewFragment newInstance(ArrayList<DealGson> deals, ProgressDialog dialog) {
        MapViewFragment newFragment = new MapViewFragment();
        newFragment.deals = deals;
        newFragment.markerDeals = new HashMap<>();
        newFragment.pDialog = dialog;

        return newFragment;
    }

    public class FillMapTask extends AsyncTask<ArrayList<DealGson>, Object, Void> {
        private final Double LOW_OFFER = 200.0;
        private final Double MID_OFFER = 500.0;

        @Override
        protected Void doInBackground(ArrayList<DealGson>... dealsArrays) {
            clearMap();
            for (DealGson d: dealsArrays[0]) {
                addNewMarker(d);
            }
            return null;
        }

        private void addNewMarker(final DealGson deal) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    String cityName = deal.city.name;
                    LatLng pos = new LatLng(deal.city.latitude, deal.city.longitude);
                    MarkerOptions marker = new MarkerOptions().position(pos)
                                                            .title(cityName.split(",")[0])
                                                            .snippet("U$D " + deal.price)
                            .icon(BitmapDescriptorFactory.defaultMarker(getColor(deal.price)))
                            ;
                    Marker m = GMap.addMarker(marker);
                    markerDeals.put(m, deal);
                    GMap.addMarker(marker);
                }
            });
        }

        private void clearMap() {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    GMap.clear();
                }
            });
        }

        private float getColor(Double price) {
            if(price < LOW_OFFER){
                return BitmapDescriptorFactory.HUE_GREEN;
            }
            else if(price < MID_OFFER){
                return BitmapDescriptorFactory.HUE_YELLOW;
            }

            return BitmapDescriptorFactory.HUE_RED;
        }
    }


    public void updateMap(ArrayList<DealGson> deals, String fromCityID) {
        this.deals = deals;
        this.fromCityID = fromCityID;
        if (GMap == null)
            return;

        new FillMapTask().execute(deals);
    }

    private class mapPromoDetailsListener implements GoogleMap.OnInfoWindowClickListener {
        @Override
        public void onInfoWindowClick(Marker marker) {
            pDialog.show();
            DealGson deal = markerDeals.get(marker);
            ApiService.startActionGetBestFlight(getContext(), fromCityID, deal.city.id, deal.price);
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        mMapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mMapView.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mMapView.onLowMemory();
    }
}