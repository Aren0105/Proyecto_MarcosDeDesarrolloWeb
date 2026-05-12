package com.donaciones.Proyecto.controller;

import com.donaciones.Proyecto.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class TransaccionController {

    @Autowired
    private TransaccionService transaccionService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> datosTransaccion) {
        return transaccionService.registrar(datosTransaccion);
    }
}