package com.templatemart.controller;

import com.templatemart.dto.*;
import com.templatemart.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PaymentController {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;
    
    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponseDTO> createOrder(@RequestBody CreateOrderDTO request) {
        log.info("POST /payments/create-order - Creating order for template: {}", request.getTemplateId());
        CreateOrderResponseDTO response = paymentService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<VerifyPaymentResponseDTO> verifyPayment(@RequestBody VerifyPaymentDTO request) {
        log.info("POST /payments/verify-payment - Verifying payment for order: {}", request.getRazorpayOrderId());
        VerifyPaymentResponseDTO response = paymentService.verifyPayment(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
