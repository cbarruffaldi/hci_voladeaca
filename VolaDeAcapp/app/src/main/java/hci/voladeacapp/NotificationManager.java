package hci.voladeacapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;

public class NotificationManager {
    private static final int PULL_REQUEST_CODE = 10;
    private static final Integer DEFAULT_MINUTES = 15;


    public static class NotificationPreferences{
        public NotificationPreferences(boolean active, int minutes){
            this.minutes = minutes;
            this.active = active;
        }
        public int minutes;
        public boolean active;
    }

    public static void setPreferences(Context context, boolean activateNotifications, Integer minutes) {
        System.out.println("Setting preferences");
        AlarmManager alarmMgr;
        PendingIntent alarmIntent;

        alarmMgr = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
        Intent myIntent = new Intent(context, PullRequestReceiver.class);
        alarmIntent = PendingIntent.getBroadcast(context, PULL_REQUEST_CODE, myIntent, 0);

        alarmMgr.cancel(alarmIntent);
        alarmMgr.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime(), minutes * 60 * 1000, alarmIntent);

        StorageHelper.saveNotificationPreferences(context, new NotificationPreferences(activateNotifications, minutes));
    }



    public static boolean setDefaultPreferences(Context context, boolean resetIfExisting){
        NotificationPreferences saved = StorageHelper.getNotificationPreferences(context);
        System.out.println("Saved preferences: " + saved);
        if(saved == null) {
            System.out.println("Setting default preferences");
            setPreferences(context, true, DEFAULT_MINUTES);
        } else if (resetIfExisting){
            setPreferences(context, saved.active, saved.minutes);
        }

        return saved == null;
    }

}

