package hci.voladeacapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class FlightDetails extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_flight_details);

        String number = this.getIntent().getExtras().getString("number");
        setTitle(number);
    }
}
