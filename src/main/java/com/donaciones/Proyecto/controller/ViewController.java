package com.donaciones.Proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Renderiza los archivos HTML dentro de src/main/resources/templates
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "index"; // Muestra templates/index.html
    }

    @GetMapping("/login")
    public String login() {
        return "login"; // Muestra templates/login.html
    }

    @GetMapping("/registro")
    public String registro() {
        return "registro"; // Muestra templates/registro.html
    }

    @GetMapping("/donar")
    public String donar() {
        return "donar"; // Muestra templates/donar.html
    }

    @GetMapping("/acerca")
    public String acerca() {
        return "acerca"; // Muestra templates/acerca.html
    }

    @GetMapping("/recuperar")
    public String recuperar() {
        return "recuperar"; // Muestra templates/recuperar.html
    }

    @GetMapping("/reset-password")
    public String resetContrasenia() {
        return "reset-contrasenia"; // Muestra templates/reset-contrasenia.html
    }
}