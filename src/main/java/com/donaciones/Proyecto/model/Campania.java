package com.donaciones.Proyecto.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campanias")
public final class Campania {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Double metaRecaudacion;

    private Double recaudadoActual;

    private Boolean activa;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    // Constructor vacío requerido por JPA (Hibernate)
    public Campania() {}

    // Constructor completo para inicializar datos fácilmente
    public Campania(Long id, String nombre, String descripcion, Double metaRecaudacion, 
                    Double recaudadoActual, Boolean activa, LocalDateTime fechaCreacion, LocalDateTime fechaFin) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.metaRecaudacion = metaRecaudacion;
        this.recaudadoActual = recaudadoActual;
        this.activa = activa;
        this.fechaCreacion = fechaCreacion;
        this.fechaFin = fechaFin;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Double getMetaRecaudacion() { return metaRecaudacion; }
    public Double getRecaudadoActual() { return recaudadoActual; }
    public Boolean getActiva() { return activa; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaFin() { return fechaFin; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setMetaRecaudacion(Double metaRecaudacion) { this.metaRecaudacion = metaRecaudacion; }
    public void setRecaudadoActual(Double recaudadoActual) { this.recaudadoActual = recaudadoActual; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
}