package com.donaciones.Proyecto.service;
import org.springframework.beans.factory.annotation.Autowired;
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

        String link = "http://127.0.0.1:5500/Frontend/ManoSolidaria/reset-contrasenia.html?token=" + token;
        System.out.println("LINK: " + link);
        message.setText("Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n" + link +
                "\n\nEste enlace expirará en 1 hora.\n\nSi no solicitaste este cambio, ignora este mensaje.");

        System.out.println("Intentando enviar a: " + destinatario);
        mailSender.send(message);
    }

}