package com.templatemart.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "templates", indexes = {
    @Index(name = "idx_type", columnList = "type"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Template {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TemplateType type;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(columnDefinition = "JSON")
    private String config; // JSON form configuration
    
    @Column(columnDefinition = "LONGTEXT")
    private String previewUrl;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PreviewType previewType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String templateUrl; // External iframe template URL
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(columnDefinition = "JSON")
    private String features; // JSON array of features
    
    @Column(columnDefinition = "JSON")
    private String demoData; // Sample data for preview
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserPage> userPages;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TemplateRequest> templateRequests;
    
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum TemplateType {
        SIMPLE, COMPLEX
    }
    
    public enum PreviewType {
        IMAGE, VIDEO, IFRAME
    }
}
