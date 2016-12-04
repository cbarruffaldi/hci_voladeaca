package hci.voladeacapp;

import java.io.Serializable;

public class FlightStatusGson implements Serializable {
   private static final long serialVersiouUID = 1L;

    public class AirportDetails implements Serializable{
        private static final long serialVersiouUID = 1L;

        public CityDetails city;
        public String description;
        public String gate;
        public String id;
        public String terminal;
        public String baggage;
        public String time_zone;
    }

    public class Schedule implements Serializable{
        private static final long serialVersiouUID = 1L;

        public String actual_gate_time;
        public String actual_runway_time;
        public Integer gate_delay;
        public Integer runway_delay;
        public String scheduled_gate_time;
        public String scheduled_time;
        public String actual_time;
        public String estimate_runway_time;

        public AirportDetails airport;
    }

    public class AirlineDetails implements Serializable{
        private static final long serialVersiouUID = 1L;

        public String id;
        public String name;
        public String logo;
    }

    public class CityDetails implements Serializable{
        private static final long serialVersionUID = 1L;

        public String id;
        public Double latitude;
        public Double longitude;
        public String name;
    }

    public AirlineDetails airline;
    public Schedule arrival;
    public Schedule departure;

    public int id;
    public int number;

    public String status;


    public String toString(){
        return "GSON for flight " + airline.name + " " + number;
    }

}
