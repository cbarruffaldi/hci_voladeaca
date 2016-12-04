package hci.voladeacapp;


import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.ListPreference;
import android.preference.PreferenceFragment;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;

import java.util.Locale;

public class AppSettingsActivity extends AppCompatActivity {

    private static int MINUTES_IN_HOUR = 60;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState == null)
            getFragmentManager().beginTransaction().add(android.R.id.content, new AppPreferenceFragment()).commit();
        setTitle(getResources().getString(R.string.title_activity_app_settings));
    }

    public static class AppPreferenceFragment extends PreferenceFragment {

        SharedPreferences.OnSharedPreferenceChangeListener spChanged;
        String previousLocale;
        private boolean updatedNotificationSettings;

        @Override
        public void onCreate(final Bundle savedInstanceState)
        {
            super.onCreate(savedInstanceState);
            addPreferencesFromResource(R.xml.app_preferences);
            previousLocale = Locale.getDefault().getLanguage();
            ListPreference lp = (ListPreference)findPreference("appLanguage");
            if (previousLocale.toString().toUpperCase().equals("EN")) {
                lp.setSummary(getActivity().getString(R.string.english));
            }
            else { lp.setSummary(getActivity().getString(R.string.spanish)); }


            updateFrequencyDescription();

            spChanged = new
                    SharedPreferences.OnSharedPreferenceChangeListener() {
                        @Override
                        public void onSharedPreferenceChanged(SharedPreferences SP,
                                                              String key) {
                            switch(key){
                                case "notifications_switch":
                                    updatedNotificationSettings = false;
                                    Boolean val = SP.getBoolean(key, true);
                                    break;

                                case "updateFrequency":
                                    updatedNotificationSettings = false;
                                    String value = SP.getString(key, "NULL");
                                    updateFrequencyDescription();
                                    break;

                                case "appLanguage":
                                    String language = SP.getString(key,null);
                                    ListPreference lp = (ListPreference)findPreference("appLanguage");
                                    if( language.equals("en")){
                                        setLocation(Locale.ENGLISH);
                                        lp.setSummary(getActivity().getString(R.string.english));
                                    } else {
                                        setLocation(new Locale("es"));
                                        lp.setSummary(getActivity().getString(R.string.spanish));
                                    }
                                    break;
                            }
                        }

                        private void setLocation(Locale location) {
                            Configuration config = new Configuration(getResources().getConfiguration());
                            config.setLocale(location);
                            Locale.setDefault(location);
                            getResources().updateConfiguration(config, getResources().getDisplayMetrics());
                            buildStack();
                        }
                    };

            SharedPreferences SP = PreferenceManager.getDefaultSharedPreferences(getActivity());
            updatedNotificationSettings = true;
        }

        private void buildStack() {
            // Construct the Intent you want to end up at
            Intent intent = new Intent(getActivity(), AppSettingsActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            TaskStackBuilder stackBuilder = TaskStackBuilder.create(getActivity());
            stackBuilder.addNextIntentWithParentStack(intent);
            stackBuilder.startActivities();
        }

        @Override
        public void onResume() {
            super.onResume();
            getPreferenceScreen().getSharedPreferences()
                    .registerOnSharedPreferenceChangeListener(spChanged);
        }

        @Override
        public void onPause() {
            super.onPause();
            SharedPreferences sp =  getPreferenceScreen().getSharedPreferences();
            boolean activateNotifications = sp.getBoolean("notifications_switch", true);
            ListPreference updateFreq = (ListPreference) findPreference("updateFrequency");
            Integer minutes = Integer.parseInt(updateFreq.getValue());

            if(!updatedNotificationSettings) {
                updatedNotificationSettings = true;
                NotificationManager.setPreferences(getActivity(), activateNotifications, minutes);
            }
            sp.unregisterOnSharedPreferenceChangeListener(spChanged);

        }

        @Override
        public void onDestroy() {
            super.onDestroy();
            String current = Locale.getDefault().getLanguage();
            saveLanguage();
        }

        private void saveLanguage() {
            /*lo guargo en Shared Preferences */
            SharedPreferences shp = getActivity().getSharedPreferences(
                    "hci.voladeacapp.PREFERENCES", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = shp.edit();
            String lang;
            if (Locale.getDefault().toString().toLowerCase().equals("en")) {
                lang = "en";
            }
            else {
                lang = "es";
            };
            editor.putString("USER_LANGUAGE",lang );
            editor.commit();
        }

        private void updateFrequencyDescription() {
            ListPreference updateFreq = (ListPreference) findPreference("updateFrequency");
            Integer minutes = Integer.parseInt(updateFreq.getValue());

            String str = null;
            if (minutes < MINUTES_IN_HOUR) {
                str = getResources().getQuantityString(R.plurals.update_frequency_description_minutes, minutes, minutes);
            } else {
                int hours = minutes / MINUTES_IN_HOUR;
                str = getResources().getQuantityString(R.plurals.update_frequency_description_hours, hours, hours);
            }
            updateFreq.setSummary(str);
        }
    }

}
