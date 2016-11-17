package hci.voladeacapp;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

/**
 * Created by Bianchi on 16/11/16.
 */

public class PromoCardAdapter extends BaseAdapter {
    private ArrayList<Flight> cardsData;
    private LayoutInflater inflater;
    private ViewHolder holder;

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
    public View getView(final int position, View convertView, final ViewGroup parent) {
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.promo_card, null);
            holder = new ViewHolder();
            holder.cityView = (TextView) convertView.findViewById(R.id.city_info_text);
            holder.dateView = (TextView) convertView.findViewById(R.id.promo_date);
            holder.priceView = (TextView) convertView.findViewById(R.id.promo_price);
            holder.overflowbtn = (ImageView) convertView.findViewById(R.id.promo_card_overflow);
            convertView.setTag(holder);

            System.out.println("setting listener");

            final View finalConvertView = convertView;
            holder.overflowbtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    ImageView dots = holder.overflowbtn;
                    System.out.println("Clicked overflow " + position);
                    showPopupMenu(finalConvertView.findViewById(R.id.promo_card_overflow));
                }
            });

        } else {
            holder = (PromoCardAdapter.ViewHolder) convertView.getTag();
        }

        Flight flight = (Flight) getItem(position);
        holder.cityView.setText(flight.getArrivalCity());
        holder.dateView.setText(flight.getDepartureDate().toString());
        holder.priceView.setText(String.valueOf(flight.getPrice()));

        return convertView;
    }

    private void showPopupMenu(View btn) {
        PopupMenu popup = new PopupMenu(btn.getContext(), btn);
        popup.getMenuInflater().inflate(R.menu.promo_item_menu, popup.getMenu());
        popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                switch (menuItem.getItemId()) {
                    case R.id.overflow_more_details:
                        System.out.println("Abrir mas detalles");
                        return true;
                    case R.id.overflow_add_flight:
                        System.out.println("Agregar a mis vuelos");
                        return true;
                }
                return false;
            }
        });

        popup.show();
    }


    private static class ViewHolder {
        TextView cityView;
        TextView dateView;
        TextView priceView;
        ImageView overflowbtn;

        //MAS
    }
}

