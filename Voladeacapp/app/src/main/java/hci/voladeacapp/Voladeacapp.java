package hci.voladeacapp;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

public class Voladeacapp extends AppCompatActivity {

    private android.support.v4.app.Fragment misVuelosFragment;
    private Fragment promocionesFragment;
    private TextView resenasView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voladeacapp);

        final FragmentManager fragmentManager = getSupportFragmentManager();


        misVuelosFragment = fragmentManager.findFragmentById(R.id.mis_vuelos_fragment);
        promocionesFragment = fragmentManager.findFragmentById(R.id.promociones_fragment);
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
                                findViewById(R.id.promociones_fragment).setVisibility(View.GONE);
                                resenasView.setVisibility(View.GONE);
                                break;
                            case R.id.action_promociones:
                                findViewById(R.id.mis_vuelos_fragment).setVisibility(View.GONE);
                                findViewById(R.id.promociones_fragment).setVisibility(View.VISIBLE);
                                resenasView.setVisibility(View.GONE);
                                break;
                            case R.id.action_resenas:
                                findViewById(R.id.mis_vuelos_fragment).setVisibility(View.GONE);
                                findViewById(R.id.promociones_fragment).setVisibility(View.GONE);
                                resenasView.setVisibility(View.VISIBLE);
                                break;
                        }
                        return false;
                    }
                });
    }

/*
    private void setDefaultVisibility(BottomNavigationView bnv) {

        findViewById(R.id.mis_vuelos_fragment).setVisibility(View.VISIBLE);
        findViewById(R.id.promociones_fragment).setVisibility(View.GONE);
        resenasView.setVisibility(View.GONE);

    }
*/

}


