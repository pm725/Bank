package com.mahatbank.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestNewController {

    @GetMapping("/new-test")  // ← REMOVED /api
    public String newTest() {
        return "New controller works!";
    }
}