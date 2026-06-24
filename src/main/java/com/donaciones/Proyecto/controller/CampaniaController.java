package com.donaciones.Proyecto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.service.CampaniaService;

@RestController
@RequestMapping("/api/campanias")
// Se eliminó @CrossOrigin porque el Frontend y el Backend ahora comparten el mismo origen (Puerto 8080)
public class CampaniaController {

    private final CampaniaService campaniaService;

    // Inyección recomendada por constructor
    @Autowired
    public CampaniaController(CampaniaService campaniaService) {
        this.campaniaService = campaniaService;
    }

    @PostMapping("/crear")
    public ResponseEntity<Campania> crear(@RequestBody Campania campania) {
        return campaniaService.crear(campania);
    }

    @GetMapping
    public List<Campania> listar() {
        return campaniaService.listar();
    }

    @GetMapping("/activas")
    public List<Campania> activar() {
        return campaniaService.activar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campania> buscar(@PathVariable Long id) {
        return campaniaService.buscar(id);
    }
}