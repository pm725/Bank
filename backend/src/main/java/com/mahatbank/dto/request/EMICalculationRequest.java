package com.mahatbank.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class EMICalculationRequest {
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000", message = "Amount must be at least 1000")
    private BigDecimal amount;
    
    @NotNull(message = "Interest rate is required")
    private BigDecimal interestRate;
    
    @NotNull(message = "Tenure is required")
    private Integer tenureMonths;

    // Getters and Setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    
    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
}