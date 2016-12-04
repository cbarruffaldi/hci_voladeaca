package hci.voladeacapp;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceFragment;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;

import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;


public class FlightSettingsActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getFragmentManager().beginTransaction().replace(android.R.id.content, new FlightPreferenceFragment()).commit();
        FlightIdentifier identifier = (FlightIdentifier) getIntent().getSerializableExtra(FLIGHT_IDENTIFIER);
        this.setTitle(getString(R.string.notification_title, identifier.getAirline(), identifier.getNumber()));
    }

    public static class FlightPreferenceFragment extends PreferenceFragment
    {
        private boolean addedPref = false;
        private FlightSettings settings;
        private FlightIdentifier identifier;

        private SharedPreferences sp;
        private SharedPreferences.OnSharedPreferenceChangeListener spChanged;

        @Override
        public void onCreate(final Bundle savedInstanceState)
        {
            super.onCreate(savedInstanceState);
            sp = PreferenceManager.getDefaultSharedPreferences(getActivity());

            identifier =  (FlightIdentifier) getActivity().getIntent().getSerializableExtra(FLIGHT_IDENTIFIER);

            spChanged = new
                    SharedPreferences.OnSharedPreferenceChangeListener() {
                        @Override
                        public void onSharedPreferenceChanged(SharedPreferences SP, String key) {
                            switch (key) {
                                case "flight_notifications_switch":
                                    boolean enabled = SP.getBoolean(key, true);
                                    settings.setAllNotifications(enabled);
                                    setSwitchesEnabled(enabled);
                                    break;
                                case "takeoff_notifications_switch":
                                    settings.setNotification(NotificationCategory.TAKEOFF, SP.getBoolean(key, true));
                                    break;
                                case "landing_notifications_switch":
                                    settings.setNotification(NotificationCategory.LANDING, SP.getBoolean(key, true));
                                    break;
                                case "delay_notifications_switch":
                                    settings.setNotification(NotificationCategory.DELAY_LANDING, SP.getBoolean(key, true));
                                    settings.setNotification(NotificationCategory.DELAY_TAKEOFF, SP.getBoolean(key, true));
                                    break;
                                case "deviation_notifications_switch":
                                    settings.setNotification(NotificationCategory.DEVIATION, SP.getBoolean(key, true));
                                    break;
                                case "cancelation_notifications_switch":
                                    settings.setNotification(NotificationCategory.CANCELATION, SP.getBoolean(key, true));
                                    break;
                            }

                            return;
                        }
                    };

        }

        private void setSwitchesEnabled(boolean enabled) {
            getFragmentManager().executePendingTransactions();
            findPreference("takeoff_notifications_switch").setEnabled(enabled);
            findPreference("landing_notifications_switch").setEnabled(enabled);
            findPreference("delay_notifications_switch").setEnabled(enabled);
            findPreference("deviation_notifications_switch").setEnabled(enabled);
            findPreference("cancelation_notifications_switch").setEnabled(enabled);
        }

        @Override
        public void onResume(){
            super.onResume();

            settings = StorageHelper.getSettings(getActivity(), identifier);

            SharedPreferences.Editor editor = sp.edit();
            editor.putBoolean("flight_notifications_switch", settings.notificationsActive());
            editor.putBoolean("takeoff_notifications_switch", settings.isActive(NotificationCategory.TAKEOFF));
            editor.putBoolean("landing_notifications_switch", settings.isActive(NotificationCategory.LANDING));
            editor.putBoolean("delay_notifications_switch", settings.isActive(NotificationCategory.DELAY_LANDING));
            editor.putBoolean("deviation_notifications_switch", settings.isActive(NotificationCategory.DEVIATION));
            editor.putBoolean("cancelation_notifications_switch", settings.isActive(NotificationCategory.CANCELATION));
            editor.commit();

            if(!addedPref) {
                addedPref = true;
                addPreferencesFromResource(R.xml.flight_preferences);
            }

            sp.registerOnSharedPreferenceChangeListener(spChanged);

            setSwitchesEnabled(settings.notificationsActive());
        }

        @Override
        public void onPause(){
            super.onPause();

            StorageHelper.saveSettings(getActivity(), identifier, settings);

            sp.unregisterOnSharedPreferenceChangeListener(spChanged);
        }
    }

}

