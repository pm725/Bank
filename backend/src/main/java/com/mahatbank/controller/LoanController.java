package com.mahatbank.controller;

import com.mahatbank.dto.request.EMICalculationRequest;
import com.mahatbank.dto.request.LoanApplicationRequest;
import com.mahatbank.dto.response.LoanResponse;
import com.mahatbank.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/loans")  // ← FIXED: removed /api
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLoan(
            @Valid @RequestBody LoanApplicationRequest request,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            LoanResponse response = loanService.applyForLoan(userEmail, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyLoans(Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            List<LoanResponse> loans = loanService.getUserLoans(userEmail);
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLoanById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            LoanResponse loan = loanService.getLoanById(id, userEmail);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveLoan(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            LoanResponse loan = loanService.approveLoan(id, userEmail);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectLoan(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            LoanResponse loan = loanService.rejectLoan(id, userEmail);
            return ResponseEntity.ok(loan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/calculate-emi")
    public ResponseEntity<?> calculateEMI(@Valid @RequestBody EMICalculationRequest request) {
        try {
            BigDecimal emi = loanService.calculateEMI(request);
            return ResponseEntity.ok(Map.of(
                "emi", emi,
                "totalPayment", emi.multiply(BigDecimal.valueOf(request.getTenureMonths())),
                "totalInterest", emi.multiply(BigDecimal.valueOf(request.getTenureMonths())).subtract(request.getAmount())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}