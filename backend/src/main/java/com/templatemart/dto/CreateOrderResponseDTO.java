package com.templatemart.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderResponseDTO {
    
    private OrderResponseDTO order;
}
