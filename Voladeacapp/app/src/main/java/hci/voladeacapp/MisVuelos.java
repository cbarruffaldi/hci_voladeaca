package hci.voladeacapp;

import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;

public class MisVuelos extends Fragment {
    ListView flightsListView;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.activity_mis_vuelos, parent, false);
        flightsListView = (ListView) rootView.findViewById(R.id.text_mis_vuelos);

        populateList();

        flightsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            //ACA A LO QUE PASA CUANDO HACE CLICK
            @Override
            public void onItemClick(AdapterView<?> a, View v, int position, long id) {
                Object o = flightsListView.getItemAtPosition(position);
                Flight flightData = (Flight) o;

                Intent detailIntent = new Intent(getActivity(), FlightDetails.class);
                detailIntent.putExtra("number", flightData.getNumber());

                startActivity(detailIntent);

            }
        });

        return rootView;
    }

    @Override
    public void onPause() {
        super.onPause();
        Toast t = Toast.makeText(getActivity(),"haoalsdas",Toast.LENGTH_LONG);

    }

    @Override
    public void onDestroy() {
        Toast t = Toast.makeText(getActivity(),"Destruyendo",Toast.LENGTH_LONG);
        super.onDestroy();
    }

    @Override
    public void onDetach() {
        Toast t = Toast.makeText(getActivity(),"Detach",Toast.LENGTH_LONG);
        super.onDetach();
    }

    private void populateList() {
        ArrayList flight_details = getListData();
        flightsListView.setAdapter(new FlightListAdapter(getActivity(),flight_details));

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

        Flight flight4 = new Flight();
        flight4.setCityDestination("LALA");
        flight4.setNumber("000123");
        flight4.setCityOrigin("ERWER");
        flight4.setState("RESTRASADO");
        results.add(flight4);


        return results;    }
}
