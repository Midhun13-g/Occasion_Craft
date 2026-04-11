package com.templatemart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_order", columnList = "razorpay_order_id"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String razorpayOrderId;
    
    @Column(nullable = true)
    private String razorpayPaymentId;
    
    @Column(columnDefinition = "TEXT")
    private String razorpaySignature;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(nullable = false)
    private String currency;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String userName;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    private UserPage page;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = true)
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum PaymentStatus {
        CREATED, PENDING, SUCCESSFUL, FAILED
    }
}
