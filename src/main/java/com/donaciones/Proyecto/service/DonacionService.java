package com.donaciones.Proyecto.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.donaciones.Proyecto.model.Campania;
import com.donaciones.Proyecto.model.Donacion;
import com.donaciones.Proyecto.repository.CampaniaRepository;
import com.donaciones.Proyecto.repository.DonacionRepository;

@Service
public class DonacionService {

    @Autowired
    private DonacionRepository donacionRepository;

    @Autowired
    private CampaniaRepository campaniaRepository;

    public ResponseEntity<?> crear(Map<String, Object> datos) {
        Donacion donacion = new Donacion();
        donacion.setMonto(Double.valueOf(datos.get("monto").toString()));
        donacion.setTipo(datos.get("tipo").toString());
        donacion.setDonadorId(Long.valueOf(datos.get("donadorId").toString()));
        donacion.setFechaDonacion(LocalDateTime.now());
        donacion.setEstado("PENDIENTE");

        if (datos.get("campaniaId") != null) {
            Long campaniaId = Long.valueOf(datos.get("campaniaId").toString());
            Campania campania = campaniaRepository.findById(campaniaId).orElse(null);
            donacion.setCampania(campania);
        }

        Donacion guardada = donacionRepository.save(donacion);

        // Actualizar recaudadoActual de la campaña
        if (donacion.getCampania() != null) {
            Campania campania = donacion.getCampania();
            double nuevoRecaudado = campania.getRecaudadoActual() + donacion.getMonto();
            campania.setRecaudadoActual(nuevoRecaudado);
            campaniaRepository.save(campania);
        }

        return ResponseEntity.ok(guardada);
    }

    public List<Donacion> porDonador(Long donadorId) {
        return donacionRepository.findByDonadorId(donadorId);
    }

    public ResponseEntity<Donacion> actualizarEstado(Long id, String estado) {
        return donacionRepository.findById(id).map(donacion -> {
            donacion.setEstado(estado);
            Donacion actualizada = donacionRepository.save(donacion);
            return ResponseEntity.ok(actualizada);
        }).orElse(ResponseEntity.notFound().build());
    }

    public Map<String, Object> obtenerEstadisticas() {
        Double total = donacionRepository.sumarMontoTotal();
        long donadores = donacionRepository.contarDonacionesTotales();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMonto", total != null ? total : 0.0);
        stats.put("totalDonadores", donadores);
        return stats;
    }
}