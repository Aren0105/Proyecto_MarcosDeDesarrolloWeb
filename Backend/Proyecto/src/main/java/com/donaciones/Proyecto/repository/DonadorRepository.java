package com.donaciones.Proyecto.repository;

import com.donaciones.Proyecto.model.Donador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonadorRepository extends JpaRepository<Donador, Long> {
    Optional<Donador> findByEmail(String email);
    boolean existsByEmail(String email);

    // Buscar por nombre (contiene)
    List<Donador> findByNombreContainingIgnoreCase(String nombre);
    Optional<Donador> findByResetTokenAndTokenExpiryDateAfter(String token, LocalDateTime now);
}