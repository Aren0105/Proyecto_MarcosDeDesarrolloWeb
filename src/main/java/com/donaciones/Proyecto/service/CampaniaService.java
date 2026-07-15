package com.donaciones.Proyecto.service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.model.CampaniaRequest;
import com.donaciones.Proyecto.repository.CampaniaRepository;

@Service
public class CampaniaService {

    private final CampaniaRepository campaniaRepository;

    @Autowired
    public CampaniaService(CampaniaRepository campaniaRepository) {
        this.campaniaRepository = campaniaRepository;
    }

    public Campania crear(CampaniaRequest campaniaRequest) {
        Campania campania = new Campania();
        campania.setNombre(campaniaRequest.getNombre());
        campania.setDescripcion(campaniaRequest.getDescripcion());
        campania.setMetaRecaudacion(campaniaRequest.getMetaRecaudacion());
        // Convertimos el LocalDateTime del request a OffsetDateTime en UTC
        if (campaniaRequest.getFechaFin() != null) {
            campania.setFechaFin(campaniaRequest.getFechaFin().atZone(ZoneId.systemDefault()).toOffsetDateTime()
                    .withOffsetSameInstant(ZoneId.of("UTC").getRules().getOffset(Instant.now())));
        }

        campania.setRecaudadoActual(0.0);
        campania.setActiva(true);
        campania.setFechaCreacion(OffsetDateTime.now(ZoneId.of("UTC")));

        return campaniaRepository.save(campania);
    }

    public List<Campania> listar() {

        return campaniaRepository.findAll();
    }

    public List<Campania> activar() {
        return campaniaRepository.findByActivaTrue();
    }

    public ResponseEntity<Campania> buscar(Long id) {
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
