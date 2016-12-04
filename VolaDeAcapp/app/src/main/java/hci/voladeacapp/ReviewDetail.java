package hci.voladeacapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.RatingBar;
import android.widget.TextView;

public class ReviewDetail extends AppCompatActivity {
    private static final double SAD_RATING_BOUND = 7.0;
    private static final float RATING_FACTOR = 0.5f;

    GlobalReview review;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review_detail);
        Intent intent = getIntent();
        review = (GlobalReview)intent.getSerializableExtra("review");
        setTitle(getString(R.string.review_details_title));

        Flight flight = StorageHelper.getFlight(this, new FlightIdentifier(review.airline(), review.flightNumber()));

        if (flight != null)
            ((TextView) findViewById(R.id.review_airline_name)).setText(flight.getFullAirlineName() + " " + flight.getNumber());

        fillDetails();
    }

    private void fillDetails() {
        RatingBar kindnessBar = (RatingBar) findViewById(R.id.kindness_rating);
        RatingBar comfortBar = (RatingBar) findViewById(R.id.comfort_rating);
        RatingBar foodBar = (RatingBar) findViewById(R.id.food_rating);
        RatingBar priceQualityBar = (RatingBar) findViewById(R.id.pricequality_rating);
        RatingBar frequentFlyerBar = (RatingBar) findViewById(R.id.frequentflyer_rating);
        RatingBar punctualityFlyerBar = (RatingBar) findViewById(R.id.punctuality_rating);
        TextView percentaje = (TextView) findViewById(R.id.percentage_recommend);

        kindnessBar.setRating(convertRating((float) review.friendliness()));
        comfortBar.setRating(convertRating((float)review.comfort()));
        foodBar.setRating(convertRating((float)review.food()));
        priceQualityBar.setRating(convertRating((float)review.quality_price()));
        frequentFlyerBar.setRating(convertRating((float)review.mileage_program()));
        punctualityFlyerBar.setRating(convertRating((float)review.punctuality()));
        percentaje.setText(review.getRecommendedPercentage() + "%");

    }

    private float convertRating(float rating) {
        return rating * RATING_FACTOR;
    }
}
