package hci.voladeacapp;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class FlightSettings implements Serializable{
    private static final long serialVersiouUID = 1L;


    private boolean notificationsActive;
    private Map<NotificationCategory, Boolean> notificationSettings;

    public FlightSettings() {
        notificationsActive = true;
        notificationSettings = new HashMap<>();

        for (NotificationCategory cat: NotificationCategory.values())
            notificationSettings.put(cat, true);
    }

    public void setAllNotifications(Boolean isActive) {
        notificationsActive = isActive;
    }

    public boolean notificationsActive() {

        return notificationsActive;
    }

    public void enableNotifications() {

        notificationsActive = true;
    }

    public void disableNotifications()
    {
        notificationsActive = false;
    }


    public boolean isActive(NotificationCategory category) {
        if (!notificationSettings.containsKey(category))
            throw new IllegalArgumentException("Non-existing notification category");
        return notificationSettings.get(category);
    }

    public void setNotification(NotificationCategory category, Boolean isActive) {
        if (!notificationSettings.containsKey(category))
            throw new IllegalArgumentException("Non-existing notification category");
        notificationSettings.put(category, isActive);
    }


}
