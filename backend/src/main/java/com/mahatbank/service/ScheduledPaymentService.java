package com.mahatbank.service;

import com.mahatbank.dto.response.ScheduledPaymentResponse;
import com.mahatbank.model.ScheduledTransaction;
import com.mahatbank.model.User;
import com.mahatbank.model.Account;
import com.mahatbank.repository.ScheduledTransactionRepository;
import com.mahatbank.repository.UserRepository;
import com.mahatbank.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduledPaymentService {

    private final ScheduledTransactionRepository scheduledTransactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public ScheduledPaymentService(ScheduledTransactionRepository scheduledTransactionRepository,
                                   UserRepository userRepository,
                                   AccountRepository accountRepository) {
        this.scheduledTransactionRepository = scheduledTransactionRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public ScheduledPaymentResponse createScheduledPayment(String userEmail, ScheduledTransaction request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account fromAccount = accountRepository.findById(request.getFromAccount().getId())
                .orElseThrow(() -> new RuntimeException("From account not found"));

        if (!fromAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't own this account");
        }

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccount().getAccountNumber())
                .orElseThrow(() -> new RuntimeException("To account not found"));

        ScheduledTransaction scheduled = new ScheduledTransaction();
        scheduled.setFromAccount(fromAccount);
        scheduled.setToAccount(toAccount);
        scheduled.setAmount(request.getAmount());
        scheduled.setDescription(request.getDescription());
        scheduled.setFrequency(request.getFrequency());
        scheduled.setStartDate(request.getStartDate());
        scheduled.setEndDate(request.getEndDate());
        scheduled.setStatus(ScheduledTransaction.ScheduleStatus.ACTIVE);
        scheduled.setLastExecuted(null);

        ScheduledTransaction saved = scheduledTransactionRepository.save(scheduled);

        return new ScheduledPaymentResponse(
                saved.getId(),
                saved.getFromAccount().getAccountNumber(),
                saved.getToAccount().getAccountNumber(),
                saved.getAmount(),
                saved.getDescription(),
                saved.getFrequency().name(),
                saved.getStatus().name(),
                saved.getStartDate(),
                saved.getEndDate()
        );
    }

    public List<ScheduledPaymentResponse> getUserScheduledPayments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return scheduledTransactionRepository.findByFromAccount_UserId(user.getId())
                .stream()
                .map(payment -> new ScheduledPaymentResponse(
                        payment.getId(),
                        payment.getFromAccount().getAccountNumber(),
                        payment.getToAccount().getAccountNumber(),
                        payment.getAmount(),
                        payment.getDescription(),
                        payment.getFrequency().name(),
                        payment.getStatus().name(),
                        payment.getStartDate(),
                        payment.getEndDate()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelScheduledPayment(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ScheduledTransaction payment = scheduledTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getFromAccount().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this scheduled payment");
        }

        payment.setStatus(ScheduledTransaction.ScheduleStatus.CANCELLED);
        scheduledTransactionRepository.save(payment);
    }
}