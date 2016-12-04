package hci.voladeacapp;

import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.SparseBooleanArray;
import android.view.ActionMode;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.Toast;

import com.nhaarman.listviewanimations.itemmanipulation.DynamicListView;
import com.nhaarman.listviewanimations.itemmanipulation.swipedismiss.OnDismissCallback;
import com.nhaarman.listviewanimations.itemmanipulation.swipedismiss.undo.TimedUndoAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import static android.app.Activity.RESULT_CANCELED;
import static hci.voladeacapp.ApiService.DATA_FLIGHT_GSON;

public class MisVuelosFragment extends Fragment {


    public static final String FLIGHTS_REFRESHED = "hci.voladeacapp.broadcast.FLIGHTS_REFRESHED";

    private BroadcastReceiver bgRefreshStatusRcv;
    private BroadcastReceiver errConnReceiver;
    private int refreshCount;
    private boolean refreshMsgShown;

    private class RefreshReceiver extends BroadcastReceiver{
        @Override
        public void onReceive(Context context, Intent intent) {
            refreshCount--;

            if(refreshCount <= 0){
                hideRefreshIcon();
            }

            if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                if(!refreshMsgShown){
                    ErrorHelper.connectionErrorShow(context);
                    refreshMsgShown = true;
                }
                return;
            }

            if(refreshCount <= 0 && !refreshMsgShown){
                refreshMsgShown = true;
                Toast.makeText(getActivity(), getResources().getString(R.string.refreshed), Toast.LENGTH_SHORT).show();
            }


            FlightStatusGson updatedGson = (FlightStatusGson)intent.getSerializableExtra(DATA_FLIGHT_GSON);
            if(updatedGson == null)
                return;
            int idx = flight_details.indexOf(new Flight(updatedGson));
            if(idx == -1){
                return;
            }
            Flight toUpdate = flight_details.get(idx);
            if(toUpdate._update(updatedGson) != null){
                Toast.makeText(getActivity(), getResources().getString(R.string.flight_change, toUpdate.getAirlineID(), toUpdate.getNumber()), Toast.LENGTH_SHORT).show();
            }
            adapter.notifyDataSetChanged();
            abortBroadcast();
        }
    }

    public final static String INSTANCE_TAG = "hci.voladeacapp.MisVuelos.INSTANCE_TAG";

    public final static String ACTION_GET_FLIGHT = "hci.voladeacapp.MisVuelos.ACTION_GET_FLIGHT";
    public final static String ACTION_GET_REFRESH = "hci.voladeacapp.MisVuelos.ACTION_GET_REFRESH";
    public static final String FLIGHT_IDENTIFIER = "hci.voladeacapp.extra.FLIGHT_IDENTIFIER";
    public static final String IS_PROMO_DETAIL = "hci.voladeacapp.extra.IS_PROMO_DETAIL";
    public static final String PROMO_DETAIL_PRICE = "hci.voladeacapp.extra.PROMO_DETAIL_PRICE";


    public final static String FLIGHT_REMOVED = "hci.voladeacapp.MisVuelos.FLIGHT_REMOVED";


    public final static int GET_FLIGHT = 1;
    protected final static int DETAILS_REQUEST_CODE = 2;
    public static final int DELETE_FLIGHT = 3;

    private final static long UNDO_TIMEOUT = 3000;

    private DynamicListView flightsListView;

    RefreshReceiver receiver;
    private ArrayList<Flight> flight_details;

    private TimedUndoAdapter adapter;

    private View rootView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        flight_details = StorageHelper.getFlights(getActivity().getApplicationContext());

        Collections.sort(flight_details, new Comparator<Flight>() {
            @Override
            public int compare(Flight flight, Flight t1) {
                return flight.getDepartureDate().compareTo(t1.getDepartureDate());
            }
        });

        rootView = inflater.inflate(R.layout.fragment_misvuelos, parent, false);

        receiver = new RefreshReceiver();


        FlightListAdapter flightListAdapter = new FlightListAdapter(getActivity(), flight_details);


        flightsListView = (DynamicListView) rootView.findViewById(R.id.text_mis_vuelos);

        adapter = new TimedUndoAdapter(flightListAdapter, getActivity(), new OnDismissCallback() {
            @Override
            public void onDismiss(@NonNull ViewGroup listView, @NonNull int[] reverseSortedPositions) {
                for (int position : reverseSortedPositions)
                    flight_details.remove(position);
                adapter.notifyDataSetChanged();
            }
        });

        bgRefreshStatusRcv =  new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                refreshList();
            }
        };

        getActivity().registerReceiver(bgRefreshStatusRcv, new IntentFilter(FLIGHTS_REFRESHED));



        adapter.setTimeoutMs(UNDO_TIMEOUT);

        adapter.setAbsListView(flightsListView);
        flightsListView.setAdapter(adapter);
        flightsListView.enableSimpleSwipeUndo();
        flightsListView.setEmptyView(rootView.findViewById(R.id.emptyElement));

        flightsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            //ACA VA LO QUE PASA CUANDO HACE CLICK
            @Override
            public void onItemClick(AdapterView<?> a, View v, int position, long id) {
                Object o = flightsListView.getItemAtPosition(position);
                Flight flightData = (Flight) o;


                Intent detailIntent = new Intent(getActivity(), FlightDetails.class);
                detailIntent.putExtra(FLIGHT_IDENTIFIER, flightData.getIdentifier());
                detailIntent.putExtra("Flight", flightData);

                startActivityForResult(detailIntent, DETAILS_REQUEST_CODE);
            }
        });

        flightsListView.setMultiChoiceModeListener(new AbsListView.MultiChoiceModeListener() {
            @Override
            public void onItemCheckedStateChanged(ActionMode actionMode, int position,
                                                  long lid, boolean checked) {
                int checkedCount = flightsListView.getCheckedItemCount();
                actionMode.setTitle(getResources().getQuantityString(R.plurals.selected_flights, checkedCount, checkedCount));
            }

            @Override
            public boolean onCreateActionMode(ActionMode actionMode, Menu menu) {
                actionMode.getMenuInflater().inflate(R.menu.delete_menu, menu);
                hideActions();
                
                return true;
            }

            @Override
            public boolean onActionItemClicked(ActionMode actionMode, MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.action_delete:
                        Resources res = getResources();
                        String feedback = res.getQuantityString(R.plurals.deleted_flights, flightsListView.getCheckedItemCount());
                        deleteChecked();
                        Toast.makeText(getActivity(), feedback, Toast.LENGTH_SHORT).show();
                        actionMode.finish();
                        return true;
                    default:
                        return false;
                }
            }

            @Override
            public boolean onPrepareActionMode(ActionMode actionMode, Menu menu) {
                return false;
            }

            @Override
            public void onDestroyActionMode(ActionMode actionMode) {
                showActions();
            }
        });

        FloatingActionButton addButton = (FloatingActionButton)rootView.findViewById(R.id.add_button);
        addButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
               // Toast.makeText(getActivity(),"Aca se deberia agregar un vuelo", Toast.LENGTH_LONG).show();
                startActivityForResult(new Intent(v.getContext(), AddFlightActivity.class), GET_FLIGHT);
            }
        });

        SwipeRefreshLayout swipeRefreshLayout = (SwipeRefreshLayout) rootView.findViewById(R.id.swiperefresh_mis_vuelos);

        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                updateFlightsStatus();
            }
        });

        return rootView;
    }


    private void refreshList() {
        List<Flight> flights = StorageHelper.getFlights(getActivity());
        flight_details.clear();
        for(Flight f: flights){
            flight_details.add(f);
        }
        adapter.notifyDataSetChanged();
    }


    private void hideActions() {
        Voladeacapp activity = (Voladeacapp) getActivity();
        if (activity != null)
            activity.hideActions();

        FloatingActionButton addButton = (FloatingActionButton)rootView.findViewById(R.id.add_button);
        addButton.setVisibility(View.GONE);

        SwipeRefreshLayout swipeRefreshLayout = (SwipeRefreshLayout) rootView.findViewById(R.id.swiperefresh_mis_vuelos);
        swipeRefreshLayout.setEnabled(false);
    }

    private void showActions() {
        Voladeacapp activity = (Voladeacapp) getActivity();
        if (activity != null)
            activity.showActions();

        FloatingActionButton addButton = (FloatingActionButton)rootView.findViewById(R.id.add_button);
        addButton.setVisibility(View.VISIBLE);

        SwipeRefreshLayout swipeRefreshLayout = (SwipeRefreshLayout) rootView.findViewById(R.id.swiperefresh_mis_vuelos);
        swipeRefreshLayout.setEnabled(true);
    }

    private void deleteChecked() {
        SparseBooleanArray checked = flightsListView.getCheckedItemPositions();
        int size = flight_details.size();
        int removed = 0;

        for (int i = 0; i < size; i++)
            if (checked.get(i))
                flight_details.remove(i-removed++);

        adapter.notifyDataSetChanged();
    }

    /**
     * Realiza la lógica del refresh. En este caso refreshear el estado de los vuelos.
     */
    private void updateFlightsStatus() {
        if(flight_details.isEmpty()){
            hideRefreshIcon();
            return;
        }

        for(Flight f: flight_details){
            ApiService.startActionGetFlightStatus(getActivity(), f.getIdentifier(), ACTION_GET_REFRESH);
        }

        refreshMsgShown = false;
        refreshCount = flight_details.size();

    }

    private void hideRefreshIcon(){
        SwipeRefreshLayout swipeRefreshLayout = (SwipeRefreshLayout) getActivity().findViewById(R.id.swiperefresh_mis_vuelos);
        swipeRefreshLayout.setRefreshing(false); // Quita el ícono del refresh
    }



    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);


        if (requestCode == DETAILS_REQUEST_CODE && resultCode == AddFlightActivity.RESULT_OK) {
            boolean deleted = data.getBooleanExtra(FLIGHT_REMOVED, false);
            if(deleted) {
                FlightIdentifier identifier = (FlightIdentifier) data.getSerializableExtra(FLIGHT_IDENTIFIER);
                StorageHelper.deleteFlight(getActivity(), identifier);
            }
        }

        if (resultCode != RESULT_CANCELED)  {

            if(requestCode == GET_FLIGHT) {
                boolean deleted = data.getBooleanExtra(FLIGHT_REMOVED, false);

                if (deleted) {
                    FlightIdentifier identifier = (FlightIdentifier) data.getSerializableExtra(FLIGHT_IDENTIFIER);
                    StorageHelper.deleteFlight(getActivity(), identifier);
                }
                else {
                    FlightStatusGson resultado = (FlightStatusGson)data.getSerializableExtra(DATA_FLIGHT_GSON);
                    Flight f = new Flight(resultado);

                    StorageHelper.saveFlight(getActivity(), new Flight(resultado));
                    StorageHelper.saveSettings(getActivity(), f.getIdentifier(), new FlightSettings());
                }
            }
        }

        resetList();

    }

    private void resetList() {
        flight_details.clear();
        List<Flight> list = StorageHelper.getFlights(getActivity());
        for(Flight f : list){
            flight_details.add(f);
        }
        Collections.sort(flight_details, new Comparator<Flight>() {
            @Override
            public int compare(Flight flight, Flight t1) {
                return flight.getDepartureDate().compareTo(t1.getDepartureDate());
            }
        });
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onResume(){
        super.onResume();
        refreshCount = 0;
        ErrorHelper.checkConnection(getActivity());
        IntentFilter ifilter = new IntentFilter(ACTION_GET_REFRESH);
        ifilter.setPriority(10);
        getActivity().registerReceiver(receiver, ifilter);

    }


    public void onStart(){
        super.onStart();

        errConnReceiver = new ErrConnReceiver(getView());
        getActivity().registerReceiver(errConnReceiver, new IntentFilter(ErrorHelper.NO_CONNECTION_ERROR));
        getActivity().registerReceiver(errConnReceiver, new IntentFilter(ErrorHelper.RECONNECTION_NOTICE));

    }


    public void onStop(){
        super.onStop();
        getActivity().unregisterReceiver(errConnReceiver);
    }

    @Override
    public void onPause(){
        super.onPause();
        hideRefreshIcon();
        getActivity().unregisterReceiver(receiver);
        StorageHelper.saveFlights(getActivity().getApplicationContext(), flight_details);
    }

    public void onDestroy(){
        super.onDestroy();
        getActivity().unregisterReceiver(bgRefreshStatusRcv);

    }
}
