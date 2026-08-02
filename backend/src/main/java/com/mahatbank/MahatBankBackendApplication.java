package com.mahatbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.mahatbank","com.mahatbank.controller"})  // FORCE SCAN ALL PACKAGES
public class MahatBankBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MahatBankBackendApplication.class, args);
    }

}