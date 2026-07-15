package com.donaciones.Proyecto;

import java.util.TimeZone;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ProyectoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoApplication.class, args);
    }

    @Bean
    public CommandLineRunner timeZoneFix() {
        return args -> TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
}
