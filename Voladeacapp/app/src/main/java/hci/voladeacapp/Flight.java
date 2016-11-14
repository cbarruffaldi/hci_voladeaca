package hci.voladeacapp;

public class Flight {
    private String number;
    private String cityOrigin, cityDestination;
    private String aerolinea;
    private String state;

    //FALTA LLENAR TODAS LAS COSAS DEL VUELO, ESTOY PROBANDO LOS ADAPTERS

    public String getAerolinea() {
        return aerolinea;
    }

    public void setAerolinea(String aerolinea) {
        this.aerolinea = aerolinea;
    }


    public String getCityOrigin() {
        return cityOrigin;
    }

    public void setCityOrigin(String cityOrigin) {
        this.cityOrigin = cityOrigin;
    }

    public String getCityDestination() {
        return cityDestination;
    }

    public void setCityDestination(String cityDestination) {
        this.cityDestination = cityDestination;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
