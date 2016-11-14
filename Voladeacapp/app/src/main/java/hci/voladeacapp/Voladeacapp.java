package hci.voladeacapp;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

public class Voladeacapp extends AppCompatActivity {

    private ListView misVuelosView;
    private TextView promocionesView;
    private TextView resenasView;

    final Context context = this;
    private ArrayAdapter<String> listAdapter ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voladeacapp);

        misVuelosView = (ListView) findViewById(R.id.text_mis_vuelos);
        promocionesView = (TextView) findViewById(R.id.text_promociones);
        resenasView = (TextView) findViewById(R.id.text_resenas);

        createMyFlightsList();

        final BottomNavigationView bottomNavigationView = (BottomNavigationView)
                findViewById(R.id.bottom_navigation);
        //setDefaultVisibility(bottomNavigationView);
        //bottomNavigationView.getMenu().findItem(R.id.action_mis_vuelos).setChecked(true);

        bottomNavigationView.setOnNavigationItemSelectedListener(
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_mis_vuelos:
                                misVuelosView.setVisibility(View.VISIBLE);
                                promocionesView.setVisibility(View.GONE);
                                resenasView.setVisibility(View.GONE);
                                Intent intent = new Intent(bottomNavigationView.getContext(), MapActivity.class);
                                startActivity(intent);
                                break;
                            case R.id.action_promociones:
                                misVuelosView.setVisibility(View.GONE);
                                promocionesView.setVisibility(View.VISIBLE);
                                resenasView.setVisibility(View.GONE);
                                break;
                            case R.id.action_resenas:
                                misVuelosView.setVisibility(View.GONE);
                                promocionesView.setVisibility(View.GONE);
                                resenasView.setVisibility(View.VISIBLE);
                                break;
                        }
                        return false;
                    }
                });
    }

    private void createMyFlightsList() {

        ArrayList flight_details = getListData();
        final ListView lv1 = (ListView) findViewById(R.id.text_mis_vuelos);
        lv1.setAdapter(new FlightListAdapter(this, flight_details));
        lv1.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            //ACA A LO QUE PASA CUANDO HACE CLICK
            @Override
            public void onItemClick(AdapterView<?> a, View v, int position, long id) {
                Object o = lv1.getItemAtPosition(position);
                Flight flightData = (Flight) o;

                Intent detailIntent = new Intent(context, FlightDetails.class);
                detailIntent.putExtra("number", flightData.getNumber());

                startActivity(detailIntent);


            }
        });

    }

    private void setDefaultVisibility(BottomNavigationView bnv) {
        /*
        misVuelosView.setVisibility(View.VISIBLE);
        promocionesView.setVisibility(View.GONE);
        resenasView.setVisibility(View.GONE);

        bnv.getMenu().findItem(R.id.action_mis_vuelos).setChecked(true);
        bnv.getMenu().findItem(R.id.action_promociones).setChecked(false);
        bnv.getMenu().findItem(R.id.action_resenas).setChecked(false);
        */

    }

    /* PROBANDO UNA ARRAYLIST CUALQUIERA */
    public ArrayList getListData() {
        ArrayList<Flight> results = new ArrayList<Flight>();
        Flight flight1 = new Flight();
        flight1.setCityDestination("BUENOS AIRES");
        flight1.setNumber("12345");
        flight1.setCityOrigin("NUEVA YORK");
        flight1.setState("EXPLOTADO");
        results.add(flight1);

        Flight flight2 = new Flight();
        flight2.setCityDestination("EL INFINITO");
        flight2.setNumber("00000");
        flight2.setCityOrigin("MAS ALLA");
        flight2.setState("PERDIDO");
        results.add(flight2);

        Flight flight3 = new Flight();
        flight3.setCityDestination("MADRID");
        flight3.setNumber("00002");
        flight3.setCityOrigin("BARILOCHE");
        flight3.setState("RESTRASADO");
        results.add(flight3);

        return results;    }
}


