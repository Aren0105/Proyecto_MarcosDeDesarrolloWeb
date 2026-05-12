package com.donaciones.Proyecto.controller;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.service.CampaniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campanias")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class CampaniaController {

    @Autowired
    private CampaniaService campaniaService;

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