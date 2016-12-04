package hci.voladeacapp;

import java.io.Serializable;

public class FlightIdentifier implements Serializable {
    private String number;
    private String airline;

    public FlightIdentifier(){}

    public FlightIdentifier(String airlineId, String numberData) {
        setAirline(airlineId);
        setNumber(numberData);
    }

    public FlightIdentifier(FlightStatusGson gson) {
        this(gson.airline.id, String.valueOf(gson.number));
    }

    public String getNumber(){
        return number;
    }

    public String getAirline(){
        return airline;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FlightIdentifier identifier = (FlightIdentifier) o;

        if (!number.equals(identifier.number)) return false;
        return airline.equals(identifier.airline);
    }


    public void setNumber(String number) {
        this.number = number;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public int hashCode(){
        int result = number.hashCode();
        result = 31 * result + airline.hashCode();
        return result;
    }

   public String toString(){
       return airline + number;
   }


}
