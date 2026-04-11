package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateDTO {
    
    private String id;
    private String name;
    private String description;
    private String type; // SIMPLE or COMPLEX
    private String category;
    private BigDecimal price;
    private String config; // JSON form configuration
    
    @JsonProperty("preview_url")
    private String previewUrl;
    
    @JsonProperty("preview_type")
    private String previewType; // image, video, iframe
    
    @NotBlank(message = "Template URL is required")
    @Pattern(regexp = "^https?://.+", message = "Template URL must be a valid URL starting with http:// or https://")
    @JsonProperty("template_url")
    private String templateUrl;
    
    @JsonProperty("is_active")
    private Boolean isActive;
    
    private String features; // JSON array
    
    @JsonProperty("demo_data")
    private String demoData; // JSON object
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}
