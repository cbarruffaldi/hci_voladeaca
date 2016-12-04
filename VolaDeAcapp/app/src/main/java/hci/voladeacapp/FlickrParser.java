package hci.voladeacapp;

import org.json.JSONException;
import org.json.JSONObject;


public class FlickrParser {
    public static String getAPIPetition(String city) {
        return
                "https://api.flickr.com/services/rest/?method=flickr.photos.search" +
                        "&api_key=3fc73140f600953c1eea5e534bac4670&"
                        + "&tags=city" + "&text=" + city.replace(',', ' ').replace(' ', '+')
                        + "&sort=interestingness-desc" + "&format=json&nojsoncallback=1";
    }

    public static String getImageURL(JSONObject obj, int index) {
        try {
            JSONObject photo = obj.getJSONObject("photos").getJSONArray("photo").getJSONObject(index);
            if (photo == null)
                return null;
            return "https://farm"
                    + photo.getString("farm") + ".staticflickr.com/"
                    + photo.getString("server") + "/"
                    + photo.getString("id") + "_"
                    + photo.getString("secret") + ".jpg";
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}
