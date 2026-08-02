package com.mahatbank.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class LoanApplicationRequest {
    
    @NotBlank(message = "Loan type is required")
    private String loanType; // HOME, AUTO, PERSONAL, EDUCATION, BUSINESS
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1000", message = "Amount must be at least 1000")
    private BigDecimal amount;
    
    @NotNull(message = "Interest rate is required")
    private BigDecimal interestRate;
    
    @NotNull(message = "Tenure is required")
    private Integer tenureMonths;
    
    private String purpose;

    // Getters and Setters
    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    
    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}