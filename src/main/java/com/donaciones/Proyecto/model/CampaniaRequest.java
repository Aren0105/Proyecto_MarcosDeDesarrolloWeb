package com.donaciones.Proyecto.model;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public class CampaniaRequest {
    private String nombre;
    private String descripcion;
    private Double metaRecaudacion;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime fechaFin;

    // Getters
    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Double getMetaRecaudacion() {
        return metaRecaudacion;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    // Setters
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setMetaRecaudacion(Double metaRecaudacion) {
        this.metaRecaudacion = metaRecaudacion;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }
}
