package com.donaciones.Proyecto.DTO;

import com.donaciones.Proyecto.model.Donacion;

import java.time.OffsetDateTime;

public class DonacionDTO {

    private Long id;
    private Double monto;
    private String tipo;
    private OffsetDateTime fechaDonacion;
    private String estado;
    private CampaniaDTO campania;

    public DonacionDTO(Donacion donacion) {
        this.id = donacion.getId();
        this.monto = donacion.getMonto();
        this.tipo = donacion.getTipo();
        this.fechaDonacion = donacion.getFechaDonacion();
        this.estado = donacion.getEstado();
        if (donacion.getCampania() != null) {
            this.campania = new CampaniaDTO(donacion.getCampania().getId(), donacion.getCampania().getNombre());
        }
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public OffsetDateTime getFechaDonacion() {
        return fechaDonacion;
    }

    public void setFechaDonacion(OffsetDateTime fechaDonacion) {
        this.fechaDonacion = fechaDonacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public CampaniaDTO getCampania() {
        return campania;
    }

    public void setCampania(CampaniaDTO campania) {
        this.campania = campania;
    }
}
