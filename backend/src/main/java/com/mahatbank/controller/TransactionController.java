package com.mahatbank.controller;

import com.mahatbank.dto.request.TransferRequest;
import com.mahatbank.dto.response.TransactionResponse;
import com.mahatbank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(
            @Valid @RequestBody TransferRequest request,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            TransactionResponse response = transactionService.transferFunds(userEmail, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyTransactions(Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            List<TransactionResponse> transactions = transactionService.getUserTransactions(userEmail);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
            TransactionResponse transaction = transactionService.getTransactionById(id, userEmail);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}