package hci.voladeacapp;

import android.app.IntentService;
import android.content.Intent;
import android.widget.ListView;

import java.util.List;

/**
 * Created by Bianchi on 16/11/16.
 */

public class RetrieveCityImageService extends IntentService {
    ListView promoCardsView;


    public RetrieveCityImageService() {
        super(RetrieveCityImageService.class.getName());
    }

    @Override
    protected void onHandleIntent(Intent intent) {

    }

}
