package com.donaciones.Proyecto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.donaciones.Proyecto.model.Donacion;

@Repository
public interface DonacionRepository extends JpaRepository<Donacion, Long> {
    List<Donacion> findByDonadorId(Long donadorId);

    List<Donacion> findByCampaniaId(Long campaniaId);

    // Buscar donaciones por estado
    List<Donacion> findByEstado(String estado);

    // Buscar donaciones por tipo
    List<Donacion> findByTipo(String tipo);

    @Query("SELECT COALESCE(SUM(d.monto), 0) FROM Donacion d")
    Double sumarMontoTotal();

    @Query("SELECT COUNT(d.id) FROM Donacion d")
    long contarDonacionesTotales();
}