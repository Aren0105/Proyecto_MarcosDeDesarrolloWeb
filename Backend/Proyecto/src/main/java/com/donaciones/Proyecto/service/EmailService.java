package com.donaciones.Proyecto.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoReset(String destinatario, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("Mano Solidaria - Restablecer contraseña");

        String link = "http://localhost:5500/reset-password.html?token=" + token;

        message.setText("Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n" + link +
                "\n\nEste enlace expirará en 1 hora.\n\nSi no solicitaste este cambio, ignora este mensaje.");

        System.out.println("Intentando enviar a: " + destinatario);
        mailSender.send(message);
    }

}