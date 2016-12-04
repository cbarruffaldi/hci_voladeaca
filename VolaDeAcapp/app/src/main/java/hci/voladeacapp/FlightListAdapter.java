package hci.voladeacapp;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.nhaarman.listviewanimations.itemmanipulation.swipedismiss.undo.UndoAdapter;

import java.util.ArrayList;

public class FlightListAdapter extends BaseAdapter implements UndoAdapter {

    private ArrayList<Flight> listData;
    private LayoutInflater layoutInflater;
    private Context aContext;

    public FlightListAdapter(Context aContext, ArrayList<Flight> listData) {
        this.listData = listData;
        layoutInflater = LayoutInflater.from(aContext);
        this.aContext = aContext;
    }

    @Override
    public int getCount() {
        return listData.size();
    }

    @Override
    public Object getItem(int position) {
        return listData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    public View getView(int position, View convertView, ViewGroup parent) {

        ViewHolder holder;
        if (convertView == null) {
            convertView = layoutInflater.inflate(R.layout.my_flight_card, parent, false);
            holder = new ViewHolder();
            holder.origAirView = (TextView) convertView.findViewById(R.id.card_departure_airport_id);
            holder.origCityView = (TextView) convertView.findViewById(R.id.card_depart_city);
            holder.destAirView = (TextView) convertView.findViewById(R.id.card_arrival_airport_id);
            holder.destCityView = (TextView) convertView.findViewById(R.id.card_arrival_city);
            holder.stateView = (ImageView) convertView.findViewById(R.id.card_status_badge);
            holder.flnumberView = (TextView) convertView.findViewById(R.id.card_flight_number);
            holder.departDateView = (TextView) convertView.findViewById(R.id.card_depart_date);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        //TextView stateTextView = holder.stateView;

        Flight flight = (Flight) getItem(position);

        holder.flnumberView.setText(flight.getAirlineID() + " " + flight.getNumber());
        holder.origAirView.setText(flight.getDepartureAirportId());
        holder.destAirView.setText(flight.getArrivalAirportId());
        holder.origCityView.setText(flight.getDepartureCity().split(",")[0]);
        holder.destCityView.setText(flight.getArrivalCity().split(",")[0]);
        holder.departDateView.setText(TextHelper.getSimpleDate(flight.getDepartureDate(), convertView.getContext()));

       try{ holder.stateView.setImageResource(StatusInterpreter.getStateImage(flight.getState())); }
       catch(Exception e){

       }

        return convertView;
    }


    @NonNull
    @Override
    public View getUndoView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        return layoutInflater.inflate(R.layout.undo_view, parent, false);
    }

    @NonNull
    @Override
    public View getUndoClickView(@NonNull View view) {
        return view.findViewById(R.id.undo_button);
    }

    private static class ViewHolder {
        TextView flnumberView;
        TextView origAirView;
        TextView destAirView;
        ImageView stateView;
        TextView origCityView;
        TextView destCityView;
        TextView departDateView;
    }

}
