package com.donaciones.Proyecto.controller;

import com.donaciones.Proyecto.model.Donacion;
import com.donaciones.Proyecto.service.DonacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donaciones")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class DonacionController {

    @Autowired
    private DonacionService donacionService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> datosDonacion) {
        return donacionService.crear(datosDonacion);
    }

    @GetMapping("/donador/{donadorId}")
    public List<Donacion> porDonador(@PathVariable Long donadorId) {
        return donacionService.porDonador(donadorId);
    }
}
