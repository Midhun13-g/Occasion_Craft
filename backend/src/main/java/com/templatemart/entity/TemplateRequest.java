package com.templatemart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "template_requests", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_template", columnList = "template_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;
    
    @Column(nullable = false)
    private String userName;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(nullable = false)
    private String userPhone;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String adminNotes;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = RequestStatus.PENDING;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum RequestStatus {
        PENDING, CONTACTED, COMPLETED, CANCELLED
    }
}
