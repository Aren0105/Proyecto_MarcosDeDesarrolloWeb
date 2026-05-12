package com.donaciones.Proyecto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}