package com.mahatbank.controller;

import com.mahatbank.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/transactions/csv")
    public ResponseEntity<String> downloadTransactionsCSV(Authentication authentication) {
        String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        // Get user ID from email - you'd need to fetch from repository
        // For simplicity, we'll pass a dummy ID; implement properly in your code
        
        String csv = reportService.generateCSVReport(1L); // Replace with actual user ID

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv);
    }
}