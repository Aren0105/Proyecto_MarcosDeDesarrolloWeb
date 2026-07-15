package com.donaciones.Proyecto.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "donaciones")
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false, length = 20)
    private String tipo; // "Una vez" o "Mensual"

    @Column(name = "donador_id", nullable = false)
    private Long donadorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campania_id")
    private Campania campania;

    @Column(name = "fecha_donacion")
    private OffsetDateTime fechaDonacion;

    @Column(length = 20)
    private String estado;

    // --- CONSTRUCTORES NATIVOS ---
    // Constructor vacío requerido obligatoriamente por JPA/Hibernate
    public Donacion() {
    }

    // Constructor completo (equivalente al @AllArgsConstructor de Lombok)
    public Donacion(Long id, Double monto, String tipo, Long donadorId, Campania campania, OffsetDateTime fechaDonacion,
            String estado) {
        this.id = id;
        this.monto = monto;
        this.tipo = tipo;
        this.donadorId = donadorId;
        this.campania = campania;
        this.fechaDonacion = fechaDonacion;
        this.estado = estado;
    }

    // --- GETTERS Y SETTERS NATIVOS (Equivalentes al @Data de Lombok) ---
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

    public Long getDonadorId() {
        return donadorId;
    }

    public void setDonadorId(Long donadorId) {
        this.donadorId = donadorId;
    }

    public Campania getCampania() {
        return campania;
    }

    public void setCampania(Campania campania) {
        this.campania = campania;
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
}
