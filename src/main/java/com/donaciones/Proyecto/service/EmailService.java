package com.donaciones.Proyecto.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void enviarCorreoReset(String destinatario, String codigo) {
        // Log para visualizar localmente en consola de inmediato
        logger.info("==================================================");
        logger.info("CÓDIGO DE RECUPERACIÓN GENERADO: {}", codigo);
        logger.info("Enviando correo a: {}", destinatario);
        logger.info("==================================================");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(destinatario);
        message.setSubject("Qusqu Kamayuq - Código de recuperación");
        message.setText("""
                Hola,

                Hemos recibido una solicitud para restablecer tu contraseña.
                Tu código de verificación es:

                %s

                Este código es válido durante 10 minutos.
                Si no solicitaste este cambio, puedes ignorar este correo.

                Equipo de Qusqu Kamayuq.
                """.formatted(codigo));

        try {
            mailSender.send(message);
            logger.info("Correo enviado exitosamente a {} usando Gmail SMTP.", destinatario);
        } catch (Exception e) {
            logger.error("Error al enviar correo mediante Gmail SMTP a {}: {}", destinatario, e.getMessage());
        }
    }
}
