package com.mahatbank.service;

import com.mahatbank.dto.request.EMICalculationRequest;
import com.mahatbank.dto.request.LoanApplicationRequest;
import com.mahatbank.dto.response.LoanResponse;
import com.mahatbank.model.Loan;
import com.mahatbank.model.User;
import com.mahatbank.repository.LoanRepository;
import com.mahatbank.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    public LoanService(LoanRepository loanRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LoanResponse applyForLoan(String userEmail, LoanApplicationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate loan type
        Loan.LoanType loanType;
        try {
            loanType = Loan.LoanType.valueOf(request.getLoanType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid loan type. Use: HOME, AUTO, PERSONAL, EDUCATION, BUSINESS");
        }

        // Create loan
        Loan loan = new Loan();
        loan.setLoanNumber(generateLoanNumber());
        loan.setUser(user);
        loan.setLoanType(loanType);
        loan.setAmount(request.getAmount());
        loan.setInterestRate(request.getInterestRate());
        loan.setTenureMonths(request.getTenureMonths());
        loan.setStatus(Loan.LoanStatus.PENDING);
        loan.setPurpose(request.getPurpose());
        loan.setCreatedAt(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);
        
        // Calculate EMI
        BigDecimal emi = calculateEMI(request.getAmount(), request.getInterestRate(), request.getTenureMonths());

        return mapToResponse(savedLoan, emi);
    }

    public List<LoanResponse> getUserLoans(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return loanRepository.findByUserId(user.getId())
                .stream()
                .map(loan -> mapToResponse(loan, calculateEMI(loan.getAmount(), loan.getInterestRate(), loan.getTenureMonths())))
                .collect(Collectors.toList());
    }

    public LoanResponse getLoanById(Long loanId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this loan");
        }

        BigDecimal emi = calculateEMI(loan.getAmount(), loan.getInterestRate(), loan.getTenureMonths());
        return mapToResponse(loan, emi);
    }

    @Transactional
    public LoanResponse approveLoan(Long loanId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this loan");
        }

        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setApprovedDate(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);
        BigDecimal emi = calculateEMI(loan.getAmount(), loan.getInterestRate(), loan.getTenureMonths());
        
        return mapToResponse(savedLoan, emi);
    }

    @Transactional
    public LoanResponse rejectLoan(Long loanId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this loan");
        }

        loan.setStatus(Loan.LoanStatus.REJECTED);
        Loan savedLoan = loanRepository.save(loan);
        BigDecimal emi = calculateEMI(loan.getAmount(), loan.getInterestRate(), loan.getTenureMonths());

        return mapToResponse(savedLoan, emi);
    }

    public BigDecimal calculateEMI(BigDecimal amount, BigDecimal rate, int tenureMonths) {
        if (tenureMonths <= 0 || rate.compareTo(BigDecimal.ZERO) == 0) {
            return amount.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        // Where P = principal, r = monthly interest rate, n = number of months
        BigDecimal monthlyRate = rate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        
        // Calculate (1+r)^n
        BigDecimal power = onePlusR.pow(tenureMonths);
        
        // Calculate numerator = P * r * (1+r)^n
        BigDecimal numerator = amount.multiply(monthlyRate).multiply(power);
        
        // Calculate denominator = (1+r)^n - 1
        BigDecimal denominator = power.subtract(BigDecimal.ONE);
        
        // EMI = numerator / denominator
        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateEMI(EMICalculationRequest request) {
        return calculateEMI(request.getAmount(), request.getInterestRate(), request.getTenureMonths());
    }

    private String generateLoanNumber() {
        String prefix = "LN";
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%06d", new Random().nextInt(999999));
        return prefix + date + random;
    }

    private LoanResponse mapToResponse(Loan loan, BigDecimal emi) {
        return new LoanResponse(
                loan.getId(),
                loan.getLoanNumber(),
                loan.getLoanType().name(),
                loan.getAmount(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                loan.getStatus().name(),
                loan.getPurpose(),
                emi,
                loan.getCreatedAt(),
                loan.getApprovedDate()
        );
    }
}