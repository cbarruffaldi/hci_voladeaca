package hci.voladeacapp;

import android.app.SearchManager;
import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SearchView;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.TextView;

public class FlightDetails extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_flight_details);
        Flight flight = (Flight)this.getIntent().getSerializableExtra("Flight");
        setTitle(flight.getNumber());

        fillDetails(flight);
    }

    private void fillDetails(Flight flight) {
        TextView fromDate = (TextView) findViewById(R.id.from_date_data);
        TextView toDate = (TextView) findViewById(R.id.to_date_data);
        TextView boardingFrom= (TextView) findViewById(R.id.from_boarding_data);
        TextView boardingTo = (TextView) findViewById(R.id.to_boarding_data);
        TextView airportFrom = (TextView) findViewById(R.id.from_airport_data);
        TextView airportTo = (TextView) findViewById(R.id.to_airport_data);
        TextView terminalFrom = (TextView) findViewById(R.id.from_terminal_data);
        TextView terminalTo = (TextView) findViewById(R.id.to_terminal_data);
        TextView gateFrom = (TextView) findViewById(R.id.from_gate_data);
        TextView gateTo = (TextView) findViewById(R.id.to_gate_data);
        TextView baggageClaim = (TextView) findViewById(R.id.baggage_claim_data);
        TextView state = (TextView) findViewById(R.id.state_data);

        //date.setText(flight.getFromDate());
        //toDate.setText(flight.getToDate());
        //boardingFrom.setText(flight.getBoardingFrom());
        //boardingTo.setText(flight.getBoardingTo());
        //airportFrom.setText(flight.getAirportFrom());
        //airportTo.setText(flight.getAirportTo());
        //terminalFrom.setText(flight.getTerminalFrom());
        //terminalTo.setText(flight.getTerminalTo());
        //gateFrom.setText(flight.getGateFrom());
        //gateTo.setText(flight.getGateTo());
        //baggageClaim.setText(flight.getBaggageClaim());


    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.mis_vuelos_menu, menu);


        SearchManager searchManager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);
        SearchView searchView = (SearchView) menu.findItem(R.id.action_search)
                .getActionView();


        searchView.setSearchableInfo(searchManager
                .getSearchableInfo(getComponentName()));

        return true;
    }

}
