package com.templatemart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_pages", indexes = {
    @Index(name = "idx_slug", columnList = "unique_slug"),
    @Index(name = "idx_template", columnList = "template_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;
    
    @Column(unique = true, nullable = false)
    private String uniqueSlug;
    
    @Column(nullable = false)
    private String userName;
    
    @Column(nullable = false)
    private String userEmail;
    
    @Column(columnDefinition = "JSON")
    private String userData; // User's customized data
    
    @Column(nullable = false)
    private String paymentId;
    
    @Column(nullable = false)
    private Integer viewCount;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime expiresAt;
    
    @OneToOne(mappedBy = "page")
    private Payment payment;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        viewCount = 0;
    }
}
