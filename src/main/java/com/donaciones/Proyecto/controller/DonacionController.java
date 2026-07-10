package com.donaciones.Proyecto.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.donaciones.Proyecto.DTO.DonacionDTO;
import com.donaciones.Proyecto.model.Donacion;
import com.donaciones.Proyecto.service.DonacionService;

@RestController
@RequestMapping("/api/donaciones")
// Se eliminó @CrossOrigin porque el Frontend (Thymeleaf) corre nativamente bajo
// el puerto 8080
public class DonacionController {

    private final DonacionService donacionService;

    // Inyección limpia por constructor (Buena práctica recomendada)
    @Autowired
    public DonacionController(DonacionService donacionService) {
        this.donacionService = donacionService;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> datosDonacion) {
        return donacionService.crear(datosDonacion);
    }

    @GetMapping("/donador/{donadorId}")
    public ResponseEntity<List<DonacionDTO>> porDonador(@PathVariable Long donadorId) {
        List<Donacion> donaciones = donacionService.porDonador(donadorId);
        List<DonacionDTO> dtos = donaciones.stream()
                .map(DonacionDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> obtenerEstadisticas() {
        return donacionService.obtenerEstadisticas();
    }
}