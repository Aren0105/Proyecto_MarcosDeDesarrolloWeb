package com.donaciones.Proyecto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoReset(String destinatario, String codigo) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("Mano Solidaria - Código de recuperación");

        String texto = """
                Hola,

                Hemos recibido una solicitud para restablecer tu contraseña.

                Tu código de verificación es:

                %s

                Este código es válido durante 10 minutos.

                Si no solicitaste este cambio, puedes ignorar este correo.

                Equipo de Mano Solidaria.
                """.formatted(codigo);

        message.setText(texto);

        mailSender.send(message);
    }
}
