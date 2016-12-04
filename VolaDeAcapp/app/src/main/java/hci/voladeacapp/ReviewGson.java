package hci.voladeacapp;

import java.io.Serializable;

public class ReviewGson implements Serializable{
    private static final long serialVersiouUID = 1L;

        public class AirlineDetails implements  Serializable{
            private static final long serialVersiouUID = 1L;

            public String id;
        }

        public class Rating implements Serializable{
            private static final long serialVersiouUID = 1L;

            int friendliness;
            int food;
            int punctuality;
            int mileage_program;
            int comfort;
            int quality_price;
        }

        public class FlightDetails implements Serializable{
            private static final long serialVersiouUID = 1L;

            public AirlineDetails airline;
            public Integer number;
        }



    public ReviewGson(String airline_id, Integer flightNum, String comments,
                      int friendliness, int comfort, int food, int quality_price, int punctuality, int mileage_program, Boolean yes_recommend){
        rating = new Rating();
        flight = new FlightDetails();
        flight.airline = new AirlineDetails();

        flight.number = flightNum;
        flight.airline.id = airline_id;
        rating.friendliness = friendliness;
        rating.comfort = comfort;
        rating.food = food;
        rating.quality_price = quality_price;
        rating.punctuality = punctuality;
        rating.mileage_program = mileage_program;

        this.yes_recommend = yes_recommend;
        this.comments = comments;
    }


    public FlightDetails flight;
        public Rating rating;
        public Boolean yes_recommend;
        public String comments;

}
