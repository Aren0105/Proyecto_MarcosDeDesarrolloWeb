package com.donaciones.Proyecto.repository;

import com.donaciones.Proyecto.model.Campania;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaniaRepository extends JpaRepository<Campania, Long> {

    List<Campania> findByActivaTrue();
    List<Campania> findByNombreContainingIgnoreCase(String nombre);
    List<Campania> findByRecaudadoActualLessThan(Double monto);

}
