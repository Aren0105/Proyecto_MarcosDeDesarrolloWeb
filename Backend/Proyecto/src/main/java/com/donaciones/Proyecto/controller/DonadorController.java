package com.donaciones.Proyecto.controller;

import com.donaciones.Proyecto.model.Donador;
import com.donaciones.Proyecto.service.DonadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donadores")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class DonadorController {

    @Autowired
    private DonadorService donadorService;

    @PostMapping("/registrar")
    public ResponseEntity<Donador> registrar(@RequestBody Donador donador) {
        return donadorService.registrar(donador);
    }

    @GetMapping
    public List<Donador> listar() {
        return donadorService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donador> buscar(@PathVariable Long id) {
        return donadorService.buscar(id);
    }
}