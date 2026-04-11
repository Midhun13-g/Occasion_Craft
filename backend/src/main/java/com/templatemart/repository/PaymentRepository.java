package com.templatemart.repository;

import com.templatemart.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByUserEmail(String userEmail);
    
    List<Payment> findByTemplateId(String templateId);
    
    Optional<Payment> findByPageId(String pageId);
    
    long countByStatus(Payment.PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.createdAt >= :startDate")
    BigDecimal sumAmountByStatusAndCreatedAtAfter(@Param("status") Payment.PaymentStatus status, @Param("startDate") LocalDateTime startDate);
}
