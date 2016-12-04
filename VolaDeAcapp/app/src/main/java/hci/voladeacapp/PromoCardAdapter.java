package hci.voladeacapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.drawable.GlideDrawable;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;

import java.util.ArrayList;
import java.util.Map;

public class PromoCardAdapter extends BaseAdapter {
    private ArrayList<DealGson> cardsData;
    private Map<DealGson, String> flightImages;
    private LayoutInflater inflater;
    private ViewHolder holder;

    public PromoCardAdapter(Context aContext, ArrayList<DealGson> flights, Map<DealGson, String> flightImages) {
        inflater = LayoutInflater.from(aContext);
        this.flightImages = flightImages;
        this.cardsData = flights;
    }

    @Override
    public int getCount() {
        return cardsData.size();
    }

    @Override
    public Object getItem(int position) {
        return cardsData.size() > position ? cardsData.get(position) : null;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, final ViewGroup parent) {
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.promo_card, null);
            fillViewHolder(convertView, (DealGson) getItem(position));
        } else {
            holder = (PromoCardAdapter.ViewHolder) convertView.getTag();
        }

        DealGson deal = (DealGson) getItem(position);
        if (deal != null) {
            holder.cityView.setText(deal.city.name.split(",")[0]);
            holder.priceView.setText("U$D " + deal.price.intValue());
            setImageView(deal, holder.photoView);
        }

        return convertView;
    }

    private void fillViewHolder(View convertView, final DealGson deal) {
        holder = new ViewHolder();
        holder.cityView = (TextView) convertView.findViewById(R.id.city_info_text);
        holder.priceView = (TextView) convertView.findViewById(R.id.promo_price);
        holder.photoView = (ImageView) convertView.findViewById(R.id.city_photo);

        convertView.setTag(holder);
    }

    private void setImageView(DealGson deal, ImageView imgView) {
        final ProgressBar progressBar = (ProgressBar) ((View) imgView.getParent()).findViewById(R.id.img_loading_indicator);
        progressBar.setVisibility(View.VISIBLE);
        if (flightImages.containsKey(deal)) {
            Glide.with(imgView.getContext())
                    .load(flightImages.get(deal))
                    .listener(new RequestListener<String, GlideDrawable>() {
                        @Override
                        public boolean onException(Exception e, String model, Target<GlideDrawable> target, boolean isFirstResource) {
                            progressBar.setVisibility(View.GONE);
                            return false;
                        }

                        @Override
                        public boolean onResourceReady(GlideDrawable resource, String model, Target<GlideDrawable> target, boolean isFromMemoryCache, boolean isFirstResource) {
                            progressBar.setVisibility(View.GONE);
                            return false;
                        }
                    })
                    .centerCrop()
                    .crossFade()
                    .into(imgView);
        }
    }

    private static class ViewHolder {
        TextView cityView;
        TextView priceView;
        ImageView photoView;
    }
}

