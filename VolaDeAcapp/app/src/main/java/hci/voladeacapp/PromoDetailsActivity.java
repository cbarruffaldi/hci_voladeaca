package hci.voladeacapp;

import android.app.FragmentManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.location.Location;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.MarkerOptions;
import com.synnapps.carouselview.CarouselView;
import com.synnapps.carouselview.ImageListener;
import com.synnapps.carouselview.ViewListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import static hci.voladeacapp.AddFlightActivity.NEW_FLIGHT_ADDED;
import static hci.voladeacapp.MisVuelosFragment.DETAILS_REQUEST_CODE;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_REMOVED;
import static hci.voladeacapp.MisVuelosFragment.PROMO_DETAIL_PRICE;

public class PromoDetailsActivity extends AppCompatActivity
        implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
    MapView mMapView;
    private GoogleMap GMap;

    public final static String PARENTSHIP = "hci.voladeacapp.PromoDetailsActivity.PARENTSHIP";

    private final static float MAP_PADDING = 2;

    CarouselView carouselView;
    RequestQueue requestQueue;
    Flight flight;
    double promoPrice;

    private static int CAROUSEL_SIZE = 7;

    private static String REQUEST_TAG = "_VOLLEY_PHOTO_REQUEST_TAG_";

    @Override
    protected void onCreate (final Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_promo_details);
        requestQueue = Volley.newRequestQueue(getApplicationContext());

        Intent intent = getIntent();
        flight = (Flight) intent.getSerializableExtra("Flight");
        promoPrice = intent.getDoubleExtra(PROMO_DETAIL_PRICE, -1);

        setTitle(flight.getArrivalCity().split(",")[0]);

        carouselView = (CarouselView) findViewById(R.id.carouselView);
        carouselView.setPageCount(CAROUSEL_SIZE);

        ViewListener viewListener = new ViewListener() {
            @Override
            public View setViewForPosition(int position) {
                View customView;
                if (position == 0) {
                    // Mapa en el primer slide
                    customView = getLayoutInflater().inflate(R.layout.fragment_maps, null);
                    mMapView = (MapView) customView.findViewById(R.id.mapView);
                    mMapView.onCreate(savedInstanceState);
                    mMapView.onResume(); // needed to get the map to display immediately

                    mMapView.getMapAsync(new OnMapReadyCallback() {
                        @Override
                        public void onMapReady(GoogleMap mMap) {
                            GMap = mMap;
                            UiSettings UI = GMap.getUiSettings();
                            UI.setAllGesturesEnabled(false);
                            findViewById(R.id.map_loading_indicator).setVisibility(View.GONE);
                            setMarkers(GMap);
                        }
                    });

                    mMapView.onResume();
                } else {
                    // Foto
                    customView = getLayoutInflater().inflate(R.layout.carousel_image_layout, null);
                    ImageView image = (ImageView) customView.findViewById(R.id.carousel_image);
                    setImageInPosition(image, position);
                }
                return customView;
            }
        };

        findViewById(R.id.more_details_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent flightDetailsIntent = new Intent(getApplicationContext(), FlightDetails.class);
                flightDetailsIntent.putExtra("Flight", flight);
                flightDetailsIntent.putExtra(FLIGHT_IDENTIFIER, flight.getIdentifier());
                flightDetailsIntent.putExtra(FlightDetails.PARENT_ACTIVITY, PARENTSHIP);
                startActivityForResult(flightDetailsIntent,DETAILS_REQUEST_CODE);
            }
        });

        try {
            MapsInitializer.initialize(this);
        } catch (Exception e) {
            e.printStackTrace();
        }

        carouselView.setViewListener(viewListener);
        fillDetails(flight);
    }

    private void setMarkers(GoogleMap GMap) {
        LatLng departLocation = flight.getArrivalCityLatLng();
        GMap.addMarker(new MarkerOptions().position(departLocation));
        GMap.moveCamera(CameraUpdateFactory.newLatLngZoom(departLocation, MAP_PADDING));
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == DETAILS_REQUEST_CODE && data != null) {

            boolean addedNew = data.getBooleanExtra(NEW_FLIGHT_ADDED, false);
            boolean deleted = data.getBooleanExtra(FLIGHT_REMOVED, false);
            if(deleted) {
                //Borró y hay que borrarlo de la lista
                FlightIdentifier identifier = (FlightIdentifier)data.getSerializableExtra(FLIGHT_IDENTIFIER);
                StorageHelper.deleteFlight(this, identifier);
            }
        }
    }

    private void fillDetails(Flight flight) {
        getTextView(R.id.promo_price).append(" " + TextHelper.getAsPrice(promoPrice));
        getTextView(R.id.departure_city).setText(flight.getDepartureCity());
        getTextView(R.id.departure_date).setText(TextHelper.getSimpleDate(flight.getDepartureDate(), this));
        getTextView(R.id.departure_time).setText(flight.getDepartureBoardingTime());
    }

    private TextView getTextView(int id) {
        return (TextView) findViewById(id);
    }

    private void setImageInPosition(final ImageView img, final int position) {
        final ProgressBar progressBar = (ProgressBar) ((View) img.getParent()).findViewById(R.id.img_loading_indicator);
        progressBar.setVisibility(View.VISIBLE);
        StringRequest sr = new StringRequest(Request.Method.GET, FlickrParser.getAPIPetition(flight.getArrivalCity()),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            // Se hace una peticion a Flickr por cada imagen pero anda.
                            setGlideImage(new JSONObject(response), img, position);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
            }
        });

        sr.setTag(REQUEST_TAG);
        requestQueue.add(sr);
    }

    private void setGlideImage(JSONObject resp, final ImageView img, int position) {
        final ProgressBar progressBar = (ProgressBar) ((View) img.getParent()).findViewById(R.id.img_loading_indicator);

        Glide.with(img.getContext())
                .load(FlickrParser.getImageURL(resp, position))
                    .listener(new RequestListener<String, GlideDrawable>() {
                        @Override
                        public boolean onException(Exception e, String model, Target<GlideDrawable> target, boolean isFirstResource) {
                            progressBar.setVisibility(View.GONE);
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(GlideDrawable resource, String model, Target<GlideDrawable> target, boolean isFromMemoryCache, boolean isFirstResource) {
                            progressBar.setVisibility(View.GONE);
                            img.setVisibility(View.VISIBLE);
                            return false;
                        }
                    })
                .centerCrop()
                .crossFade()
                .into(img);
    }

    @Override
    public void onPause() {
        super.onPause();
        requestQueue.cancelAll(REQUEST_TAG);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        return; // No hay que hacer nada
    }

    @Override
    public void onConnectionSuspended(int i) {
        this.findViewById(R.id.promos_no_connection_layout).setVisibility(View.VISIBLE);
        System.out.println("Connection suspended");
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        this.findViewById(R.id.promos_no_connection_layout).setVisibility(View.VISIBLE);
        System.out.println("Connection failed");
    }
}
