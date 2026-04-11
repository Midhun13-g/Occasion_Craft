package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    
    private String id;
    private Long amount;
    private String currency;
    
    @JsonProperty("created_at")
    private Long createdAt;
}
