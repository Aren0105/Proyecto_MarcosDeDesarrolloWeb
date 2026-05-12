package com.donaciones.Proyecto.repository;

import com.donaciones.Proyecto.model.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonacionRepository extends JpaRepository<Donacion, Long> {
    List<Donacion> findByDonadorId(Long donadorId);

    List<Donacion> findByCampaniaId(Long campaniaId);

    // Buscar donaciones por estado
    List<Donacion> findByEstado(String estado);

    // Buscar donaciones por tipo
    List<Donacion> findByTipo(String tipo);

}