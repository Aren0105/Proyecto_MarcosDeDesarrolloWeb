package com.donaciones.Proyecto.DTO;

import java.time.LocalDateTime;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.model.Donacion;

public class DonacionDTO {
    private Long id;
    private double monto;
    private String tipo;
    private LocalDateTime fechaDonacion;
    private CampaniaDTO campania;

    public DonacionDTO(Donacion donacion) {
        this.id = donacion.getId();
        this.monto = donacion.getMonto();
        this.tipo = donacion.getTipo();
        this.fechaDonacion = donacion.getFechaDonacion();
        if (donacion.getCampania() != null) {
            this.campania = new CampaniaDTO(donacion.getCampania());
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public double getMonto() {
        return monto;
    }

    public String getTipo() {
        return tipo;
    }

    public LocalDateTime getFechaDonacion() {
        return fechaDonacion;
    }

    public CampaniaDTO getCampania() {
        return campania;
    }

    // Clase anidada para la campaña
    private static class CampaniaDTO {
        private Long id;
        private String nombre;

        public CampaniaDTO(Campania campania) {
            this.id = campania.getId();
            this.nombre = campania.getNombre();
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getNombre() {
            return nombre;
        }
    }
}