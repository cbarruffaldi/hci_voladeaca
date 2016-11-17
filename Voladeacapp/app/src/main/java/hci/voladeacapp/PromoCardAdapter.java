package hci.voladeacapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * Created by Bianchi on 16/11/16.
 */

public class PromoCardAdapter extends BaseAdapter {
    private ArrayList<Flight> cardsData;
    private LayoutInflater inflater;

    public PromoCardAdapter(Context aContext, ArrayList<Flight> listData) {
        this.cardsData = listData;
        inflater = LayoutInflater.from(aContext);
    }

    @Override
    public int getCount() {
        return cardsData.size();
    }

    @Override
    public Object getItem(int position) {
        return cardsData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.promo_card, null);
            holder = new ViewHolder();
            holder.cityView = (TextView) convertView.findViewById(R.id.city_info_text);
            holder.dateView = (TextView) convertView.findViewById(R.id.promo_date);
            holder.priceView = (TextView) convertView.findViewById(R.id.promo_price);
            convertView.setTag(holder);
        } else {
            holder = (PromoCardAdapter.ViewHolder) convertView.getTag();
        }

        Flight flight = (Flight) getItem(position);

        holder.cityView.setText(flight.getArrivalCity());
        holder.dateView.setText(flight.getDepartureDate().toString());
        holder.priceView.setText(String.valueOf(flight.getPrice()));

        return convertView;
    }


    private static class ViewHolder {
        TextView cityView;
        TextView dateView;
        TextView priceView;
        //MAS
    }
}

