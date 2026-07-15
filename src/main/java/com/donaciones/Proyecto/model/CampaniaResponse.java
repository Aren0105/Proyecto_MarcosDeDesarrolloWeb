package com.donaciones.Proyecto.model;

import java.time.OffsetDateTime;

public class CampaniaResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private double metaRecaudacion;
    private double recaudadoActual;
    private OffsetDateTime fechaFin;
    private String imagenUrl;
    private boolean activa;

    public CampaniaResponse() {
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public double getMetaRecaudacion() {
        return metaRecaudacion;
    }

    public double getRecaudadoActual() {
        return recaudadoActual;
    }

    public OffsetDateTime getFechaFin() {
        return fechaFin;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setMetaRecaudacion(double metaRecaudacion) {
        this.metaRecaudacion = metaRecaudacion;
    }

    public void setRecaudadoActual(double recaudadoActual) {
        this.recaudadoActual = recaudadoActual;
    }

    public void setFechaFin(OffsetDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }
}
