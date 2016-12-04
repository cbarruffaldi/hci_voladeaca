package hci.voladeacapp;

import java.io.Serializable;

public class Resena implements Serializable {

    private String flightNumber;
    private String flightAirline;
    private String comentario;
    private int amabilidad, confort, comida, preciocalidad, puntualidad, viajerosFrec;
    private Boolean recomendado;
    private float puntuacion;


    public Resena(String nv, String va, int am,int con, int com, int pc, int pun, int vf, float puntuaciongeneral, Boolean recom, String coment ){
        this.puntuacion = puntuaciongeneral;
        this.flightNumber = nv;
        this.flightAirline = va;
        this.amabilidad = am;
        this.confort = con;
        this.comida = com;
        this.preciocalidad = pc;
        this.puntualidad = pun;
        this.viajerosFrec= vf;
        this.recomendado = recom;
        this.comentario = coment;

    }
    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getFlightAirline() {
        return flightAirline;
    }

    public void setFlightAirline(String flightAirline) {
        this.flightAirline = flightAirline;
    }

    public int  getAmabilidad() {
        return amabilidad;
    }

    public void setAmabilidad(int amabilidad) {
        this.amabilidad = amabilidad;
    }

    public int getConfort() {
        return confort;
    }

    public void setConfort(int confort) {
        this.confort = confort;
    }

    public int getComida() {
        return comida;
    }

    public void setComida(int comida) {
        this.comida = comida;
    }

    public int getPreciocalidad() {
        return preciocalidad;
    }

    public void setPreciocalidad(int preciocalidad) {
        this.preciocalidad = preciocalidad;
    }

    public int getPuntualidad() {
        return puntualidad;
    }

    public void setPuntualidad(int puntualidad) {
        this.puntualidad = puntualidad;
    }

    public int getViajerosFrec() {
        return viajerosFrec;
    }

    public void setViajerosFrec(int viajerosFrec) {
        this.viajerosFrec = viajerosFrec;
    }

    public Boolean getRecomendado() {
        return recomendado;
    }

    public void setRecomendado(Boolean recomendado) {
        this.recomendado = recomendado;
    }

    public float getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(float puntuacion) {
        this.puntuacion = puntuacion;
    }


    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

}
