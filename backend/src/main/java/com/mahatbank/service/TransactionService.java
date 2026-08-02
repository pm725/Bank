package com.mahatbank.service;

import com.mahatbank.dto.request.TransferRequest;
import com.mahatbank.dto.response.TransactionResponse;
import com.mahatbank.model.Account;
import com.mahatbank.model.Transaction;
import com.mahatbank.model.User;
import com.mahatbank.repository.AccountRepository;
import com.mahatbank.repository.TransactionRepository;
import com.mahatbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TransactionResponse transferFunds(String userEmail, TransferRequest request) {
        // 1. Validate user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Get source account
        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        // 3. Verify source account belongs to user
        if (!fromAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to source account");
        }

        // 4. Get destination account
        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // 5. Check if same account
        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }

        // 6. Check sufficient balance
        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 7. Deduct from source
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));

        // 8. Add to destination
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        // 9. Save both accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // 10. Create transaction record
        Transaction transaction = new Transaction();
        transaction.setTransactionId(generateTransactionId());
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setAmount(request.getAmount());
        transaction.setType(Transaction.TransactionType.valueOf(request.getTransactionType()));
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setCompletedDate(LocalDateTime.now());
        transaction.setReferenceId(generateReferenceId());

        Transaction savedTransaction = transactionRepository.save(transaction);

        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponse> getUserTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findTransactionsByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(Long transactionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Check if transaction belongs to user
        if (!transaction.getFromAccount().getUser().getId().equals(user.getId()) &&
            !transaction.getToAccount().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this transaction");
        }

        return mapToResponse(transaction);
    }

    private String generateTransactionId() {
        String prefix = "TX";
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%06d", new Random().nextInt(999999));
        return prefix + date + random;
    }

    private String generateReferenceId() {
        String prefix = "REF";
        String random = String.format("%010d", new Random().nextLong() & Long.MAX_VALUE);
        return prefix + random.substring(0, 10);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getTransactionId(),
                transaction.getFromAccount().getAccountNumber(),
                transaction.getToAccount().getAccountNumber(),
                transaction.getAmount(),
                transaction.getType().name(),
                transaction.getStatus().name(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getReferenceId()
        );
    }
}