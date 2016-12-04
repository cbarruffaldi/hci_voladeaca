package hci.voladeacapp;

import android.content.Context;
import android.support.v7.widget.CardView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.RequestQueue;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class ResenaCardAdapter extends BaseAdapter{
    private static final double SAD_RATING_BOUND = 7.0;
    private ArrayList<GlobalReview> cardsData;
    private LayoutInflater inflater;

    public ResenaCardAdapter(Context aContext, ArrayList<GlobalReview> listData) {
        this.cardsData = listData;
        inflater = LayoutInflater.from(aContext);
    }
    @Override
    public int getCount() {
        return cardsData.size();
    }

    @Override
    public Object getItem(int i) {
        return cardsData.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public boolean isEmpty() {
        return cardsData.isEmpty();
    }

    @Override
    public View getView(final int position, View convertView, final ViewGroup parent) {

        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.review_card, parent, false);
            holder = new ResenaCardAdapter.ViewHolder();
            holder.airlineIdentifier = (TextView) convertView.findViewById(R.id.flight_airline_text);
            holder.ratingBar = (RatingBar) convertView.findViewById(R.id.ratingbar_resena);
            holder.percentageView = (TextView) convertView.findViewById(R.id.percentage);
            holder.noReviews = (TextView) convertView.findViewById(R.id.no_reviews_text);
            holder.card = (CardView) convertView.findViewById(R.id.resenas_card);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        TextView airlineTextView = holder.airlineIdentifier;
        RatingBar ratingBarView = holder.ratingBar;
        TextView percentageView = holder.percentageView;
        TextView noReviewsView = holder.noReviews;
        CardView cardView = holder.card;

        ratingBarView.setClickable(false);

        GlobalReview resena = (GlobalReview) getItem(position);

        Boolean hasReviews = resena.hasReviews();

        airlineTextView.setText(resena.airline() + " " + resena.flightNumber().toString());
        if(!hasReviews){
            noReviewsView.setVisibility(View.VISIBLE);
            ratingBarView.setVisibility(View.GONE);
            percentageView.setVisibility(View.GONE);
            convertView.findViewById(R.id.recommends_text).setVisibility(View.GONE);
            cardView.setForeground(null);  // Quita el ripple
            cardView.findViewById(R.id.resenas_card_layout).setBackgroundColor(parent.getResources().getColor(R.color.grey));
            cardView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(parent.getContext(), parent.getResources().getString(R.string.no_reviews), Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            ratingBarView.setRating((float) resena.getRating() / 2);
            percentageView.setText(new DecimalFormat("#.##").format(resena.getRecommendedPercentage()) +"%");
        }


        return convertView;
    }

    private static class ViewHolder {
        TextView airlineIdentifier;
        TextView percentageView;
        RatingBar ratingBar;
        TextView noReviews;
        CardView card;
    }
}
