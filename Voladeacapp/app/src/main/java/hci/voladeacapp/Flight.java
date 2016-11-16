package hci.voladeacapp;

import java.io.Serializable;

public class Flight implements Serializable{
    private String number;

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getCityFrom() {
        return cityFrom;
    }

    public void setCityFrom(String cityFrom) {
        this.cityFrom = cityFrom;
    }

    public String getCityTo() {
        return cityTo;
    }

    public void setCityTo(String cityTo) {
        this.cityTo = cityTo;
    }

    public String getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(String dateFrom) {
        this.dateFrom = dateFrom;
    }

    public String getDateTo() {
        return dateTo;
    }

    public void setDateTo(String dateTo) {
        this.dateTo = dateTo;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getBoardingTo() {
        return boardingTo;
    }

    public void setBoardingTo(String boardingTo) {
        this.boardingTo = boardingTo;
    }

    public String getBoardingFrom() {
        return boardingFrom;
    }

    public void setBoardingFrom(String boardingFrom) {
        this.boardingFrom = boardingFrom;
    }

    public String getBaggageClaim() {
        return baggageClaim;
    }

    public void setBaggageClaim(String baggageClaim) {
        this.baggageClaim = baggageClaim;
    }

    public String getGateTo() {
        return gateTo;
    }

    public void setGateTo(String gateTo) {
        this.gateTo = gateTo;
    }

    public String getGateFrom() {
        return gateFrom;
    }

    public void setGateFrom(String gateFrom) {
        this.gateFrom = gateFrom;
    }

    public String getAirportTo() {
        return airportTo;
    }

    public void setAirportTo(String airportTo) {
        this.airportTo = airportTo;
    }

    public String getAirportFrom() {
        return airportFrom;
    }

    public void setAirportFrom(String airportFrom) {
        this.airportFrom = airportFrom;
    }

    public String getTerminalTo() {
        return terminalTo;
    }

    public void setTerminalTo(String terminalTo) {
        this.terminalTo = terminalTo;
    }

    public String getTerminalFrom() {
        return terminalFrom;
    }

    public void setTerminalFrom(String terminalFrom) {
        this.terminalFrom = terminalFrom;
    }

    private String airline;
    private String cityFrom, cityTo;
    private String dateFrom, dateTo;
    private String state;
    private String boardingTo, boardingFrom;
    private String baggageClaim;
    private String gateTo, gateFrom;
    private String airportTo, airportFrom;
    private String terminalTo, terminalFrom;



    //FALTA LLENAR TODAS LAS COSAS DEL VUELO, ESTOY PROBANDO LOS ADAPTERS

}
