package com.mahatbank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true, nullable = false)
    private String phoneNumber;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(nullable = false)
    private String fullName;
    
    private LocalDateTime dateOfBirth;
    
    @Column(length = 500)
    private String address;
    
    @Enumerated(EnumType.STRING)
    private KycStatus kycStatus = KycStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    private String transactionPin;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Account> accounts = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Loan> loans = new ArrayList<>();
    
    public enum KycStatus {
        PENDING, SUBMITTED, VERIFIED, REJECTED
    }
    
    public enum Role {
        CUSTOMER, EMPLOYEE, ADMIN
    }
}