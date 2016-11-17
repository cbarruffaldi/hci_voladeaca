package hci.voladeacapp;

import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.SynchronousQueue;

public class Promociones extends Fragment{
    ListView promoCardsView;
    PromoCardAdapter cardAdapter;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.activity_promociones, parent, false);
        Button mapButton = (Button) rootView.findViewById(R.id.map_button);
        mapButton.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getActivity(),MapActivity.class);
                startActivity(intent);
            }
        });

        cardAdapter = new PromoCardAdapter(getActivity(), dummyList());
        promoCardsView = (ListView) rootView.findViewById(R.id.promo_card_list);
        promoCardsView.setAdapter(cardAdapter);

        promoCardsView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> a, View v, int position, long id) {
                Object o = promoCardsView.getItemAtPosition(position);
                Flight flightData = (Flight) o;

                Intent detailIntent = new Intent(getActivity(), FlightDetails.class);
                detailIntent.putExtra("number", flightData.getNumber());

                startActivity(detailIntent);
            }
        });

        return rootView;
    }


    private ArrayList<Flight> dummyList() {
        ArrayList<Flight> a = new ArrayList<>();
        Flight f = new Flight();
        f.setArrivalCity("CORDOBA");
        f.setPrice(500);
        f.setDepartureDate(new Date());
        f.setNumber("1234");
        a.add(f);
        f = new Flight();
        f.setArrivalCity("MALASIA");
        f.setPrice(200.1);
        f.setDepartureDate(new Date());
        f.setNumber("1434");
        a.add(f);
        f = new Flight();
        f.setArrivalCity("CORDOBA");
        f.setPrice(500);
        f.setDepartureDate(new Date());
        f.setNumber("9934");
        a.add(f);
        f = new Flight();
        f.setArrivalCity("MALASIA");
        f.setPrice(200.1);
        f.setDepartureDate(new Date());
        f.setNumber("0934");
        a.add(f);
        f = new Flight();
        f.setArrivalCity("CORDOBA");
        f.setPrice(500);
        f.setDepartureDate(new Date());
        a.add(f);
        f.setNumber("1234");
        f = new Flight();
        f.setArrivalCity("MALASIA");
        f.setPrice(200.1);
        f.setDepartureDate(new Date());
        f.setNumber("1200");
        a.add(f);
        return a;
    }
}
