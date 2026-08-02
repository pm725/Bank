package com.mahatbank.service;

import com.mahatbank.dto.request.CreateAccountRequest;
import com.mahatbank.dto.response.AccountResponse;
import com.mahatbank.model.Account;
import com.mahatbank.model.User;
import com.mahatbank.repository.AccountRepository;
import com.mahatbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AccountResponse createAccount(String userEmail, CreateAccountRequest request) {
        // Find user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate account type
        Account.AccountType accountType;
        try {
            accountType = Account.AccountType.valueOf(request.getAccountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account type. Use: SAVINGS, CHECKING, FIXED_DEPOSIT");
        }

        // Create account
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType(accountType);
        account.setBalance(BigDecimal.valueOf(request.getInitialDeposit()));
        account.setCurrency(request.getCurrency());
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(user);
        account.setCreatedAt(LocalDateTime.now());

        Account savedAccount = accountRepository.save(account);

        return mapToResponse(savedAccount);
    }

    public List<AccountResponse> getUserAccounts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccountByNumber(String accountNumber, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Check if account belongs to user
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this account");
        }

        return mapToResponse(account);
    }

    public BigDecimal getAccountBalance(String accountNumber, String userEmail) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this account");
        }

        return account.getBalance();
    }

    private String generateAccountNumber() {
        String prefix = "MAHAT";
        String random = String.format("%010d", new Random().nextLong() & Long.MAX_VALUE);
        return prefix + random.substring(0, 10);
    }

    private AccountResponse mapToResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType().name(),
                account.getBalance(),
                account.getCurrency(),
                account.getStatus().name(),
                account.getCreatedAt()
        );
    }
}