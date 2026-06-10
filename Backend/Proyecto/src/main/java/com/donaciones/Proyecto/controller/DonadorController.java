package com.donaciones.Proyecto.controller;

import com.donaciones.Proyecto.DTO.ResetContrasenia;
import com.donaciones.Proyecto.DTO.SoliContrasenia;
import com.donaciones.Proyecto.model.Donador;
import com.donaciones.Proyecto.service.DonadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.donaciones.Proyecto.DTO.SoliContrasenia;
import com.donaciones.Proyecto.DTO.ResetContrasenia;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody SoliContrasenia request) {
        return donadorService.generarTokenReset(request.getEmail());
    }


    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        return donadorService.validarTokenReset(token);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetContrasenia request) {
        return donadorService.restablecerContrasenia(request.getToken(), request.getNuevaContrasenia());
    }
}