package hci.voladeacapp;

import java.io.Serializable;

public class DealGson implements Serializable{
    private static final long serialVersiouUID = 1L;

    public class CountryDetail implements Serializable{
        private static final long serialVersiouUID = 1L;

        public String id;
        public String name;
    }

    public class CityDetail implements Serializable{
        private static final long serialVersiouUID = 1L;

        public CountryDetail country;
        public String id;
        public Double latitude;
        public Double longitude;
        String name;
    }

    public CityDetail city;
    public Double price;
}
