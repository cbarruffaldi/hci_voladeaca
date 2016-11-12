package hci.voladeacapp;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

public class Voladeacapp extends AppCompatActivity {

    private TextView misVuelosView;
    private TextView promocionesView;
    private TextView resenasView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voladeacapp);

        misVuelosView = (TextView) findViewById(R.id.text_mis_vuelos);
        promocionesView = (TextView) findViewById(R.id.text_promociones);
        resenasView = (TextView) findViewById(R.id.text_resenas);

        BottomNavigationView bottomNavigationView = (BottomNavigationView)
                findViewById(R.id.bottom_navigation);

        bottomNavigationView.setOnNavigationItemSelectedListener(
                new BottomNavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.action_mis_vuelos:
                                misVuelosView.setVisibility(View.VISIBLE);
                                promocionesView.setVisibility(View.GONE);
                                resenasView.setVisibility(View.GONE);

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
}


