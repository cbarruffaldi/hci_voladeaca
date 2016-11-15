package hci.voladeacapp;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class Voladeacapp extends AppCompatActivity {

    private android.support.v4.app.Fragment misVuelosFragment;
    private TextView promocionesView;
    private TextView resenasView;

    final Context context = this;
    private ArrayAdapter<String> listAdapter ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voladeacapp);

        final FragmentManager fragmentManager = getSupportFragmentManager();

        misVuelosFragment = fragmentManager.findFragmentById(R.id.mis_vuelos_fragment);
        promocionesView = (TextView) findViewById(R.id.text_promociones);
        resenasView = (TextView) findViewById(R.id.text_resenas);

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
                                findViewById(R.id.mis_vuelos_fragment).setVisibility(View.VISIBLE);
                                promocionesView.setVisibility(View.GONE);
                                resenasView.setVisibility(View.GONE);
                                break;
                            case R.id.action_promociones:
                                findViewById(R.id.mis_vuelos_fragment).setVisibility(View.GONE);
                                promocionesView.setVisibility(View.VISIBLE);
                                resenasView.setVisibility(View.GONE);
                                Intent intent = new Intent(bottomNavigationView.getContext(), MapActivity.class);
                                startActivity(intent);
                                break;
                            case R.id.action_resenas:
                                findViewById(R.id.mis_vuelos_fragment).setVisibility(View.GONE);
                                promocionesView.setVisibility(View.GONE);
                                resenasView.setVisibility(View.VISIBLE);
                                break;
                        }
                        return false;
                    }
                });
    }

    /*
    private void setDefaultVisibility(BottomNavigationView bnv) {

        misVuelosView.setVisibility(View.VISIBLE);
        promocionesView.setVisibility(View.GONE);
        resenasView.setVisibility(View.GONE);

        bnv.getMenu().findItem(R.id.action_mis_vuelos).setChecked(true);
        bnv.getMenu().findItem(R.id.action_promociones).setChecked(false);
        bnv.getMenu().findItem(R.id.action_resenas).setChecked(false);


    }
    */

}


