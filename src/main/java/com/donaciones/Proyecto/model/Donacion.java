package com.donaciones.Proyecto.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donaciones")
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false, length = 20)
    private String tipo;  // "Una vez" o "Mensual"

    @Column(name = "donador_id", nullable = false)
    private Long donadorId;

    @Column(name = "campania_id")
    private Long campaniaId;

    @Column(name = "fecha_donacion")
    private LocalDateTime fechaDonacion;

    @Column(length = 20)
    private String estado;

    // --- CONSTRUCTORES NATIVOS ---
    
    // Constructor vacío requerido obligatoriamente por JPA/Hibernate
    public Donacion() {}

    // Constructor completo (equivalente al @AllArgsConstructor de Lombok)
    public Donacion(Long id, Double monto, String tipo, Long donadorId, Long campaniaId, LocalDateTime fechaDonacion, String estado) {
        this.id = id;
        this.monto = monto;
        this.tipo = tipo;
        this.donadorId = donadorId;
        this.campaniaId = campaniaId;
        this.fechaDonacion = fechaDonacion;
        this.estado = estado;
    }

    // --- GETTERS Y SETTERS NATIVOS (Equivalentes al @Data de Lombok) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Long getDonadorId() { return donadorId; }
    public void setDonadorId(Long donadorId) { this.donadorId = donadorId; }

    public Long getCampaniaId() { return campaniaId; }
    public void setCampaniaId(Long campaniaId) { this.campaniaId = campaniaId; }

    public LocalDateTime getFechaDonacion() { return fechaDonacion; }
    public void setFechaDonacion(LocalDateTime fechaDonacion) { this.fechaDonacion = fechaDonacion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}