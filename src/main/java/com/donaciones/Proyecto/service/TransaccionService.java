package com.donaciones.Proyecto.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TransaccionService {

    @Autowired
    private DonacionService donacionService;

    private Map<Long, Map<String, Object>> transacciones = new HashMap<>();
    private Long siguienteId = 1L;

    public ResponseEntity<?> registrar(Map<String, Object> datosTransaccion) {
        Long donacionId = Long.valueOf(datosTransaccion.get("donacionId").toString());
        String metodoPago = datosTransaccion.get("metodoPago").toString();

        // Cambiar estado de la donación a COMPLETADO
        donacionService.actualizarEstado(donacionId, "COMPLETADO");

        Map<String, Object> transaccion = new HashMap<>();
        transaccion.put("id", siguienteId++);
        transaccion.put("donacionId", donacionId);
        transaccion.put("metodoPago", metodoPago);
        transaccion.put("fechaPago", LocalDateTime.now(ZoneId.of("UTC")));
        transaccion.put("estadoPago", "COMPLETADO");

        transacciones.put(donacionId, transaccion);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Pago registrado exitosamente. ¡Gracias por tu donación!",
                "transaccion", transaccion));
    }
}
