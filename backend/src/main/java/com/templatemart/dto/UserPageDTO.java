package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPageDTO {
    
    private String id;
    
    @JsonProperty("template_id")
    private String templateId;
    
    @JsonProperty("unique_slug")
    private String uniqueSlug;
    
    @JsonProperty("user_name")
    private String userName;
    
    @JsonProperty("user_email")
    private String userEmail;
    
    @JsonProperty("user_data")
    private String userData; // JSON object
    
    @JsonProperty("payment_id")
    private String paymentId;
    
    @JsonProperty("view_count")
    private Integer viewCount;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @JsonProperty("expires_at")
    private LocalDateTime expiresAt;
}
