package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {
    
    @JsonProperty("template_id")
    private String templateId;
    
    private BigDecimal amount;
    
    @JsonProperty("user_name")
    private String userName;
    
    @JsonProperty("user_email")
    private String userEmail;
}

