package hci.voladeacapp;

import android.Manifest;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.GridView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static hci.voladeacapp.AddFlightActivity.NEW_FLIGHT_ADDED;
import static hci.voladeacapp.ApiService.BEST_FLIGHT_RESPONSE;
import static hci.voladeacapp.ApiService.DATA_BEST_FLIGHT_FOUND;
import static hci.voladeacapp.ApiService.DATA_DEAL_LIST;
import static hci.voladeacapp.MisVuelosFragment.DETAILS_REQUEST_CODE;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_REMOVED;

public class PromocionesFragment extends Fragment implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    public final static String INSTANCE_TAG = "hci.voladeacapp.Promociones.INSTANCE_TAG";
    private final static String RECEIVER_TAG = "_GET_DEALS_RECEIVE_";

    private final static String DEFAULT_CITY = "Buenos Aires, Ciudad de Buenos Aires";
    private static final String START_DETAIL_CALLBACK = "hci.voladeacapp.START_DETAIL_CALLBACK";

    private static String REQUEST_TAG = "_VOLLEY_PHOTO_REQUEST_TAG_";

    private View rootView;
    private AutoCompleteTextView fromCityTextView;
    private RequestQueue requestQueue;

    private ArrayList<DealGson> deals;
    private Map<DealGson, String> imageURLs;
    private BroadcastReceiver dealsReceiver;

    private PromoCardAdapter promoAdapter;
    private Map<String, CityGson> citiesMap;

    private GoogleApiClient client;
    MapViewFragment mapfragment;

    private boolean inListView;

    private BroadcastReceiver dealIdReceiver;
    private BroadcastReceiver detailStarterReceiver;

    private ProgressDialog pDialog;
    private boolean notifiedConnectionError;

    private CityGson currentCity;
    private ErrConnReceiver errConnReceiver;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        setHasOptionsMenu(true);
        Context context = getActivity().getApplication();
        deals = new ArrayList<>();
        imageURLs = new HashMap<>();
        requestQueue = Volley.newRequestQueue(context);
        client = new GoogleApiClient.Builder(context)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        citiesMap = StorageHelper.getCitiesMap(context);
        inListView = true;
        notifiedConnectionError = true;

        pDialog = new ProgressDialog(getActivity());
        pDialog.setMessage(getString(R.string.loading_promo));

        dealIdReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                    ErrorHelper.connectionErrorShow(context);
                    pDialog.hide();
                }
                else{
                    boolean found = intent.getBooleanExtra(DATA_BEST_FLIGHT_FOUND, false);
                    if(found){
                        ApiService.startActionGetFlightStatus(context, (FlightIdentifier)intent.getSerializableExtra("identifier"), START_DETAIL_CALLBACK);
                    }else {
                        ErrorHelper.alert(context, getString(R.string.error_came_up), getString(R.string.try_again_later));
                        pDialog.hide();
                    }
                }

            }
        };

        detailStarterReceiver = new BestFlightReceiver(getActivity(), pDialog, deals);
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
                StorageHelper.deleteFlight(getActivity(), identifier);
            }
        }
    }

    @Override
    public void onStart() {
        client.connect();
        final View viewPos = getActivity().findViewById(R.id.snackbarCoordinator);
        errConnReceiver = new ErrConnReceiver(viewPos);
        getActivity().registerReceiver(errConnReceiver, new IntentFilter(ErrorHelper.NO_CONNECTION_ERROR));
        getActivity().registerReceiver(errConnReceiver, new IntentFilter(ErrorHelper.RECONNECTION_NOTICE));
        super.onStart();
    }


    @Override
    public void onResume(){
        super.onResume();
        ErrorHelper.checkConnection(getActivity());
        registerDetailsReceivers();
        getActivity().registerReceiver(dealsReceiver, new IntentFilter(RECEIVER_TAG));
    }

    private void registerDetailsReceivers() {
        getActivity().registerReceiver(dealIdReceiver,  new IntentFilter(BEST_FLIGHT_RESPONSE));
        getActivity().registerReceiver(detailStarterReceiver, new IntentFilter(START_DETAIL_CALLBACK));
    }

    private void unRegisterDetailsReceivers() {
        getActivity().unregisterReceiver(dealIdReceiver);
        getActivity().unregisterReceiver(detailStarterReceiver);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        LayoutInflater layoutInflater = inflater;
        rootView = layoutInflater.inflate(R.layout.fragment_promociones, parent, false);

        fromCityTextView = (AutoCompleteTextView) rootView.findViewById(R.id.promo_from_city_autocomplete);

        ArrayAdapter<String> cityAutocompleteAdapter = new ArrayAdapter<>(getActivity().getBaseContext(),
                android.R.layout.select_dialog_item, new ArrayList<>(citiesMap.keySet()));

        fromCityTextView.setAdapter(cityAutocompleteAdapter);

        fromCityTextView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                fromCityTextView.setError(null);
                hideKeyboard(rootView);
                refreshResults();
            }
        });

        GridView cardListView = (GridView) rootView.findViewById(R.id.promo_card_list);
        promoAdapter = new PromoCardAdapter(getActivity(), deals, imageURLs);
        cardListView.setAdapter(promoAdapter);

        // Listener para actualización de ciudad de salida
        fromCityTextView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int actionId, KeyEvent keyEvent) {
                boolean handled = false;
                if (actionId == EditorInfo.IME_ACTION_SEND) {
                    handled = true;
                    hideKeyboard(rootView);
                    refreshResults();
                }
                return handled;
            }
        });

        // Listener para ver detalles del vuelo
        cardListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> a, View v, int position, long id) {
                String originId = currentCity.id;
                String destId = deals.get(position).city.id;
                Double price = deals.get(position).price;

                pDialog.show();

                ApiService.startActionGetBestFlight(v.getContext(), originId, destId, price);
            }
        });

        // Receiver para el ApiService
        dealsReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                    return; //Me voy
                }
                List<DealGson> list = (List<DealGson>) intent.getSerializableExtra(DATA_DEAL_LIST);
                if (list == null) {

                } else {
                    for (DealGson d : list) {
                        deals.add(d);
                        getCityImageURL(d);
                    }

                    if (inListView) {
                        promoAdapter.notifyDataSetChanged();
                    } else {
                        CityGson city = getFromCity();
                        String id = city != null ? city.id : null;
                        mapfragment.updateMap(deals, id);
                    }
                }
            }
        };

        fromCityTextView.addTextChangedListener(new CityTextWatcher());

        rootView.findViewById(R.id.dummy_focus_layout).requestFocus(); // Para que el cityView no tenga focus

        // Realiza la búsqueda puesta por defecto después de settear las cosas del view.
        refreshResults();

        return rootView;
    }

    @Override
    public void onConnected(Bundle bundle) {
        if (hasLocationPermissions()) {
            getLocationAndSearch();
        } else  {
            requestLocationPermissions();

        }
    }

    private void requestLocationPermissions() {
        if (!hasLocationPermissions()) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)) {
                final AlertDialog alertDialog = new AlertDialog.Builder(getActivity()).create();
                alertDialog.setTitle(getString(R.string.localization));
                alertDialog.setMessage(getString(R.string.why_we_use_your_localization));

                alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, getString(R.string.ok), new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        alertDialog.dismiss();
                    }
                });

                alertDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                    @Override
                    public void onDismiss(DialogInterface dialogInterface) {
                        ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                                Voladeacapp.LOCATION_PERMISSION_REQUEST_CODE);
                    }
                });

                alertDialog.show();
            }
            else {
                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                        Voladeacapp.LOCATION_PERMISSION_REQUEST_CODE);

            }
        }
    }

    private boolean getLocationAndSearch() {
        if (ContextCompat.checkSelfPermission(getActivity().getApplicationContext(),
                android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Location mLastLocation = LocationServices.FusedLocationApi.getLastLocation(client);
            if (mLastLocation == null) {
                locationError();
            } else {
                fromCityTextView.setText(getClosestCity(mLastLocation));
                refreshResults();
            }
            return true;
        }
        return false;
    }

    public boolean hasLocationPermissions() {
        return ContextCompat.checkSelfPermission(getActivity().getApplicationContext(),
                android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    private String getClosestCity(Location userLocation) {
        Set<Map.Entry<String, CityGson>> entries = citiesMap.entrySet();
        Location cityLocation = new Location("CityLocation");
        double minDistance = Double.MAX_VALUE;
        String closestCity  = null;

        for (Map.Entry<String, CityGson> e: entries) {
            cityLocation.setLatitude(e.getValue().latitude);
            cityLocation.setLongitude(e.getValue().longitude);
            double auxDistance = userLocation.distanceTo(cityLocation);

            if (auxDistance < minDistance) {
                closestCity = e.getKey();
                minDistance = auxDistance;
            }
        }

        return closestCity;
    }

    @Override
    public void onConnectionSuspended(@NonNull int i) {
        rootView.findViewById(R.id.promos_no_connection_layout).setVisibility(View.VISIBLE);
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        rootView.findViewById(R.id.promos_no_connection_layout).setVisibility(View.VISIBLE);
    }

    private void refreshResults() {
        if (!isValidCity(fromCityTextView.getText().toString())) {
            // Deja la búsqueda como la última realizada
            if (currentCity != null)
                fromCityTextView.setText(currentCity.name);
            return;
        }

        deals.clear();
        CityGson city = getFromCity();
        if (city == null) {

        } else {
            currentCity = city;
            ApiService.startActionGetDeals(getActivity().getApplicationContext(), city.id, RECEIVER_TAG);
        }
    }

    private CityGson getFromCity() {
        return citiesMap.get(fromCityTextView.getText().toString());
    }

    boolean mapAdded = false;

    @Override
    public void onCreateOptionsMenu(final Menu menu, final MenuInflater inflater) {
        inflater.inflate(R.menu.promo_map_menu_item, menu);
        final MenuItem mapIcon = menu.findItem(R.id.go_to_map_view);
        final MenuItem listIcon = menu.findItem(R.id.go_to_list_view);

        mapfragment = MapViewFragment.newInstance(deals, pDialog);

        final View listView = rootView.findViewById(R.id.promo_card_list);
        mapIcon.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                inListView = false;

                if (!mapAdded) {
                    final FragmentManager fragmentManager = getFragmentManager();
                    fragmentManager.beginTransaction().add(R.id.promos_map_parent, mapfragment, "MAP_WTF_IS_THIS_STRING_FOR").commit();
                    mapAdded = true;
                }

                View mapView = rootView.findViewById(R.id.mapView);
                listView.setVisibility(View.GONE);

                if (mapView != null)
                    mapView.setVisibility(View.VISIBLE);
                mapIcon.setVisible(false);
                listIcon.setVisible(true);

                CityGson city = getFromCity();
                String id = city != null ? city.id : null;
                mapfragment.updateMap(deals, id);
                return true;
            }
        });

        listIcon.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {

            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                inListView = true;
                listView.setVisibility(View.VISIBLE);
                View mapView = rootView.findViewById(R.id.mapView);

                if (mapView != null)
                    mapView.setVisibility(View.GONE);
                mapIcon.setVisible(true);
                listIcon.setVisible(false);
                return true;
            }
        });


        super.onCreateOptionsMenu(menu, inflater);
    }

    private void getCityImageURL(final DealGson deal) {
        StringRequest sr = new StringRequest(Request.Method.GET, FlickrParser.getAPIPetition(deal.city.name),
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            imageURLs.put(deal, FlickrParser.getImageURL(new JSONObject(response), 0));
                            promoAdapter.notifyDataSetChanged();

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

    @Override
    public void onPause() {
        requestQueue.cancelAll(REQUEST_TAG);
        getActivity().unregisterReceiver(dealsReceiver);
        unRegisterDetailsReceivers();
        super.onPause();
    }

    @Override
    public void onStop() {
        client.disconnect();
        getActivity().unregisterReceiver(errConnReceiver);
        super.onStop();
    }

    private void hideKeyboard(View view) {
        InputMethodManager imm = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        view.findViewById(R.id.dummy_focus_layout).requestFocus();
    }

    private boolean isValidCity(String name) {
        return citiesMap.containsKey(name);
    }


    private class CityTextWatcher implements TextWatcher {

        @Override
        public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {}
        @Override
        public void onTextChanged(CharSequence charSequence, int start, int before, int count) {}

        @Override
        public void afterTextChanged(Editable editable) {
            if(editable.length() > 2 && !fromCityTextView.isPopupShowing() && !isValidCity(editable.toString()) && !citiesMap.isEmpty()) {
                fromCityTextView.setError(getResources().getString(R.string.invalid_city_message));
            }
        }

    }
    public void notifyLocationPermission(boolean granted) {
        if (granted) {
            getLocationAndSearch();
        } else {
            locationError();
        }

    }

    private void locationError() {
        Toast.makeText(getActivity().getApplicationContext(),
                getResources().getString(R.string.couldnt_determine_position), Toast.LENGTH_SHORT).show();
        fromCityTextView.setText(DEFAULT_CITY);
        refreshResults();
    }

    @Override
    public void onDestroy() {
        mapAdded = false;
        super.onDestroy();
    }
}

