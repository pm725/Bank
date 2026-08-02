package com.mahatbank.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanResponse {
    private Long id;
    private String loanNumber;
    private String loanType;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private String status;
    private String purpose;
    private BigDecimal emi;
    private LocalDateTime createdAt;
    private LocalDateTime approvedDate;

    // Constructor
    public LoanResponse(Long id, String loanNumber, String loanType, BigDecimal amount,
                        BigDecimal interestRate, Integer tenureMonths, String status,
                        String purpose, BigDecimal emi, LocalDateTime createdAt,
                        LocalDateTime approvedDate) {
        this.id = id;
        this.loanNumber = loanNumber;
        this.loanType = loanType;
        this.amount = amount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.status = status;
        this.purpose = purpose;
        this.emi = emi;
        this.createdAt = createdAt;
        this.approvedDate = approvedDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getLoanNumber() { return loanNumber; }
    public void setLoanNumber(String loanNumber) { this.loanNumber = loanNumber; }
    
    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    
    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public BigDecimal getEmi() { return emi; }
    public void setEmi(BigDecimal emi) { this.emi = emi; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
}