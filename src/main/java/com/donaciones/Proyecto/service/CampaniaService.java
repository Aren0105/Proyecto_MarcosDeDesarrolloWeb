package com.donaciones.Proyecto.service;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.repository.CampaniaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CampaniaService {
    @Autowired
    private CampaniaRepository campaniaRepository;

    public ResponseEntity<Campania> crear(Campania campania) {
        campania.setRecaudadoActual(0.0);
        campania.setActiva(true);
        campania.setFechaCreacion(LocalDateTime.now());
        Campania guardada = campaniaRepository.save(campania);
        return ResponseEntity.ok(guardada);
    }

    public List<Campania> listar(){

        return campaniaRepository.findAll();
    }

    public List<Campania> activar(){
        return campaniaRepository.findByActivaTrue();
    }

    public ResponseEntity<Campania> buscar(Long id){
        return campaniaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Campania> actualizar(Long id, Campania campania) {
        if (!campaniaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        campania.setId(id);
        Campania actualizada = campaniaRepository.save(campania);
        return ResponseEntity.ok(actualizada);
    }

}