package com.mahatbank.controller;

import com.mahatbank.dto.response.ScheduledPaymentResponse;
import com.mahatbank.model.ScheduledTransaction;
import com.mahatbank.service.ScheduledPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scheduled")
public class ScheduledPaymentController {

    private final ScheduledPaymentService scheduledPaymentService;

    public ScheduledPaymentController(ScheduledPaymentService scheduledPaymentService) {
        this.scheduledPaymentService = scheduledPaymentService;
    }

    @PostMapping
    public ResponseEntity<?> createScheduledPayment(
            @RequestBody ScheduledTransaction request,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            ScheduledPaymentResponse result = scheduledPaymentService.createScheduledPayment(userEmail, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyScheduledPayments(Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            List<ScheduledPaymentResponse> payments = scheduledPaymentService.getUserScheduledPayments(userEmail);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelScheduledPayment(@PathVariable Long id, Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            scheduledPaymentService.cancelScheduledPayment(id, userEmail);
            return ResponseEntity.ok(Map.of("message", "Scheduled payment cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}