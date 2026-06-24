package com.donaciones.Proyecto.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donaciones.Proyecto.service.TransaccionService;

@RestController
@RequestMapping("/api/transacciones")
// Se eliminó @CrossOrigin porque el Frontend (Thymeleaf) ahora comparte el
// mismo origen (Puerto 8080)
public class TransaccionController {

    private final TransaccionService transaccionService;

    // Inyección limpia y recomendada por constructor
    @Autowired
    public TransaccionController(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> datosTransaccion) {
        return transaccionService.registrar(datosTransaccion);
    }
}