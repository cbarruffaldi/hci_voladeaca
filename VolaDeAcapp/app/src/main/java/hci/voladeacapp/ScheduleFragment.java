package hci.voladeacapp;

import android.app.Fragment;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


public class ScheduleFragment extends Fragment {

    private View view;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_flight_schedule, container, false);
        return view;
    }

    public void setSchedule(String title, Flight.FlightSchedule schedule) {
        setSchedule(title, schedule, null);
    }

    public void setSchedule(String title, Flight.FlightSchedule schedule, String baggageClaim) {

        Resources res = getResources();
        String dateFormat = res.getString(R.string.formato_fecha);

        ((TextView) view.findViewById(R.id.schedule_title)).setText(title);

        ((TextView) view.findViewById(R.id.date_data)).setText(schedule.getDateInFormat(dateFormat));

        ((TextView) view.findViewById(R.id.boarding_data)).setText(schedule.getBoardingTime() + " " + String.format(res.getString(R.string.utc_indicator), schedule.timezone));

        ((TextView) view.findViewById(R.id.airport_data)).setText(schedule.getAirport());

        ((TextView) view.findViewById(R.id.terminal_data)).setText(schedule.getTerminal() == null ? res.getString(R.string.a_confirmar) : schedule.getTerminal());

        ((TextView) view.findViewById(R.id.gate_data)).setText(schedule.getGate() == null ? res.getString(R.string.a_confirmar) : schedule.getGate());

        if (baggageClaim != null) {
            ((TextView) view.findViewById(R.id.baggage_claim_data)).setText(baggageClaim);
            ((TextView)view.findViewById(R.id.embarque_change_label)).setText(R.string.arrival_time);
        }
        else {
            view.findViewById(R.id.baggage_layout).setVisibility(View.GONE);
        }
    }
}
