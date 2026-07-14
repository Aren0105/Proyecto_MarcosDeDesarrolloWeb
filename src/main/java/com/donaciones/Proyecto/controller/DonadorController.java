package com.donaciones.Proyecto.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donaciones.Proyecto.DTO.ResetContrasenia;
import com.donaciones.Proyecto.DTO.SoliContrasenia;
import com.donaciones.Proyecto.model.Donador;
import com.donaciones.Proyecto.service.DonadorService;

@RestController
@RequestMapping("/api/donadores")
// Se eliminó @CrossOrigin porque el Frontend (Thymeleaf) ahora comparte el
// mismo origen (Puerto 8080)
public class DonadorController {

    private final DonadorService donadorService;

    // Inyección limpia y recomendada por constructor
    @Autowired
    public DonadorController(DonadorService donadorService) {
        this.donadorService = donadorService;
    }

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

    @PostMapping("/login")
    public ResponseEntity<Donador> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String contrasenia = credenciales.get("contrasenia");
        return donadorService.login(email, contrasenia);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody SoliContrasenia request) {
        return donadorService.generarTokenReset(request.getEmail());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetContrasenia request) {
        return donadorService.restablecerContrasenia(
                request.getEmail(),
                request.getCodigo(),
                request.getNuevaContrasenia());
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarContrasenia(@RequestBody Map<String, String> payload) {
        try {
            Long donadorId = Long.parseLong(payload.get("donadorId"));
            String passActual = payload.get("passActual");
            String passNueva = payload.get("passNueva");
            return donadorService.cambiarContrasenia(donadorId, passActual, passNueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Datos inválidos."));
        }
    }
}
