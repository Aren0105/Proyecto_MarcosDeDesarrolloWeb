package com.donaciones.Proyecto.service;

import com.donaciones.Proyecto.model.Donador;
import com.donaciones.Proyecto.repository.DonadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonadorService {

    @Autowired
    private DonadorRepository donadorRepository;

    public ResponseEntity<Donador> registrar(Donador donador) {
        // Validar que no exista el email
        if (donadorRepository.existsByEmail(donador.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        Donador guardado = donadorRepository.save(donador);
        return ResponseEntity.ok(guardado);
    }

    public List<Donador> listar() {
        return donadorRepository.findAll();
    }

    public ResponseEntity<Donador> buscar(Long id) {
        return donadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}