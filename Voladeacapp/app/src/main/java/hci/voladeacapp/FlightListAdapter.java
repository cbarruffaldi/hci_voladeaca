package hci.voladeacapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class FlightListAdapter extends BaseAdapter {
    private ArrayList<Flight> listData;
    private LayoutInflater layoutInflater;

    public FlightListAdapter(Context aContext, ArrayList<Flight> listData) {
        this.listData = listData;
        layoutInflater = LayoutInflater.from(aContext);
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
            convertView = layoutInflater.inflate(R.layout.simplerow, null);
            holder = new ViewHolder();
            holder.originView = (TextView) convertView.findViewById(R.id.origin_city);
            holder.destinationView = (TextView) convertView.findViewById(R.id.destination_city);
            //holder.stateView = (TextView) convertView.findViewById(R.id.flight_state);
            holder.numberView = (TextView) convertView.findViewById(R.id.flight_number);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        TextView numberTextView = holder.numberView;
        TextView originTextView = holder.originView;
        TextView destinationTextView = holder.destinationView;
        //TextView stateTextView = holder.stateView;

        Flight flight = (Flight) getItem(position);

        numberTextView.setText(flight.getNumber());
        originTextView.setText(flight.getCityFrom());
        destinationTextView.setText(flight.getCityTo());
        //stateTextView.setText(flight.getState());

        return convertView;

    }



static class ViewHolder {
    TextView numberView;
    TextView originView;
    TextView destinationView;
    TextView stateView;
}

}


