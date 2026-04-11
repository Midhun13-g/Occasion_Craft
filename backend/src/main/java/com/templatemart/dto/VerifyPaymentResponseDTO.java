package com.templatemart.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyPaymentResponseDTO {
    
    private boolean success;
    private UserPageDTO page;
    private String message;
}
