package com.donaciones.Proyecto.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donadores")
public class Donador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String contrasenia;

    @Column(length = 255)
    private String resetToken;

    private LocalDateTime tokenExpiryDate;

    // --- CONSTRUCTORES NATIVOS ---

    // Constructor vacío requerido por JPA/Hibernate
    public Donador() {}

    // Constructor completo (equivalente al @AllArgsConstructor de Lombok)
    public Donador(Long id, String nombre, String email, String contrasenia, String resetToken, LocalDateTime tokenExpiryDate) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.contrasenia = contrasenia;
        this.resetToken = resetToken;
        this.tokenExpiryDate = tokenExpiryDate;
    }

    // --- GETTERS Y SETTERS NATIVOS (Equivalentes al @Data de Lombok) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContrasenia() { return contrasenia; }
    public void setContrasenia(String contrasenia) { this.contrasenia = contrasenia; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getTokenExpiryDate() { return tokenExpiryDate; }
    public void setTokenExpiryDate(LocalDateTime tokenExpiryDate) { this.tokenExpiryDate = tokenExpiryDate; }
}