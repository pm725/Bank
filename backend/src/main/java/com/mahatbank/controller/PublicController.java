package com.mahatbank.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public")
public class PublicController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Mahat Bank API");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "This is a public endpoint - no token needed!");
        return response;
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}