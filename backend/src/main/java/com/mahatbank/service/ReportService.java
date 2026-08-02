package com.mahatbank.service;

import com.mahatbank.model.Transaction;
import com.mahatbank.model.User;
import com.mahatbank.repository.TransactionRepository;
import com.mahatbank.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public ReportService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public String generateCSVReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions = transactionRepository.findTransactionsByUserId(userId);

        StringBuilder csv = new StringBuilder();
        csv.append("Transaction ID,From,To,Amount,Type,Status,Date,Description\n");

        for (Transaction t : transactions) {
            csv.append(t.getTransactionId()).append(",");
            csv.append(t.getFromAccount().getAccountNumber()).append(",");
            csv.append(t.getToAccount().getAccountNumber()).append(",");
            csv.append(t.getAmount()).append(",");
            csv.append(t.getType()).append(",");
            csv.append(t.getStatus()).append(",");
            csv.append(t.getTransactionDate()).append(",");
            csv.append(t.getDescription() != null ? t.getDescription() : "").append("\n");
        }

        return csv.toString();
    }
}