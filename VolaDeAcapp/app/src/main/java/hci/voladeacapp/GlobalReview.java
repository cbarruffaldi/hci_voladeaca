package hci.voladeacapp;

import java.io.Serializable;
import java.util.List;


public class GlobalReview implements Serializable{
    private static final long serialVersiouUID = 1L;

    List<ReviewGson> list;

    private int index;
    public void setIndex(int idx){
        index = idx;
    }
    private final static int CATEGORIES = 7;

    private String airline;
    private String flightNumber;
    private Boolean has_reviews;

    private Double rating;
    private int percentage_recommend;

    private double friendliness;
    private double food;
    private double punctuality;
    private double mileage_program;
    private double comfort;
    private double quality_price;

    public GlobalReview(String airline, String flightNumber, List<ReviewGson> reviews){
        if(reviews == null){
            throw new IllegalArgumentException("Param reviews mustn't be null");
        }

        this.airline = airline;
        this.flightNumber = flightNumber;



        int count = 0;
        int recCount = 0;

        for (ReviewGson r : reviews) {
            friendliness += r.rating.friendliness;
            food += r.rating.food;
            punctuality += r.rating.punctuality;
            mileage_program += r.rating.punctuality;
            comfort += r.rating.comfort;
            quality_price += r.rating.comfort;
            if (r.yes_recommend) {
                recCount++;
            }
            count++;
        }

        if (count > 0) {
            //Promedio
            friendliness /= count;
            food /= count;
            punctuality /= count;
            mileage_program /= count;
            comfort /= count;
            quality_price /= count;
            percentage_recommend = (100 * recCount) / count;
            has_reviews = true;
        } else{
            has_reviews = false;
        }


        rating = (friendliness + food + punctuality + mileage_program + comfort + quality_price) / CATEGORIES;

        list = reviews;
    }


    public double getRating(){
        return rating;
    }

    public int getRecommendedPercentage(){
        return percentage_recommend;
    }

    //Getters
    public double friendliness(){ return friendliness; }
    public double food(){ return food; }
    public double mileage_program(){ return mileage_program; }
    public double comfort(){ return comfort; }
    public double quality_price(){return quality_price; }
    public double punctuality() {return punctuality; }

    public String flightNumber() { return flightNumber; }
    public String airline() { return airline; }

    public Boolean hasReviews(){ return has_reviews; }


    public int getIndex() {
        return index;
    }
}
