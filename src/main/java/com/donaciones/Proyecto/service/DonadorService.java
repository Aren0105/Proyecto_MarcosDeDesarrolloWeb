package com.donaciones.Proyecto.service;

import com.donaciones.Proyecto.model.Donador;
import com.donaciones.Proyecto.repository.DonadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class DonadorService {

    @Autowired
    private DonadorRepository donadorRepository;

    @Autowired
    private EmailService emailService;

    public ResponseEntity<Donador> registrar(Donador donador) {
        // Validar que no exista el email
        if (donadorRepository.existsByEmail(donador.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        Donador guardado = donadorRepository.save(donador);
        return ResponseEntity.ok(guardado);
    }

    public List<Donador> listar() {
        return donadorRepository.findAll();
    }

    public ResponseEntity<Donador> buscar(Long id) {
        return donadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<?> generarTokenReset(String email) {
        Optional<Donador> donadorOpt = donadorRepository.findByEmail(email);

        if (donadorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No existe una cuenta con ese email"));
        }

        Donador donador = donadorOpt.get();

        String token = UUID.randomUUID().toString();
        donador.setResetToken(token);
        donador.setTokenExpiryDate(LocalDateTime.now().plusMinutes(60));

        donadorRepository.save(donador);

        emailService.enviarCorreoReset(donador.getEmail(), token);

        return ResponseEntity.ok(Map.of("mensaje", "Se ha enviado un correo con las instrucciones para restablecer tu contraseña"));
    }

    public ResponseEntity<?> validarTokenReset(String token) {
        Optional<Donador> donadorOpt = donadorRepository.findByResetTokenAndTokenExpiryDateAfter(token, LocalDateTime.now());

        if (donadorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido o expirado"));
        }

        return ResponseEntity.ok(Map.of("valido", true));
    }

    public ResponseEntity<?> restablecerContrasenia(String token, String nuevaContrasenia) {
        Optional<Donador> donadorOpt = donadorRepository.findByResetTokenAndTokenExpiryDateAfter(token, LocalDateTime.now());

        if (donadorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido o expirado"));
        }

        Donador donador = donadorOpt.get();
        donador.setContrasenia(nuevaContrasenia);
        donador.setResetToken(null);
        donador.setTokenExpiryDate(null);

        donadorRepository.save(donador);

        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida correctamente. Ahora puedes iniciar sesión."));
    }
}