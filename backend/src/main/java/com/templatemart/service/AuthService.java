package com.templatemart.service;

import com.templatemart.dto.AuthRequestDTO;
import com.templatemart.dto.AuthResponseDTO;
import com.templatemart.entity.AdminUser;
import com.templatemart.entity.User;
import com.templatemart.repository.AdminUserRepository;
import com.templatemart.repository.UserRepository;
import com.templatemart.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AdminUserRepository adminUserRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Value("${admin.email:admin@templatemart.com}")
    private String adminEmail;
    
    @Transactional
    public AuthResponseDTO register(AuthRequestDTO request) {
        // Check if trying to register with admin email
        if (request.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new RuntimeException("Cannot register with admin email");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .enabled(true)
            .build();
        
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), "USER");
        
        return AuthResponseDTO.builder()
            .token(token)
            .user(AuthResponseDTO.UserInfoDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role("USER")
                .build())
            .build();
    }
    
    public AuthResponseDTO login(AuthRequestDTO request) {
        // Check if admin login
        if (request.getEmail().equalsIgnoreCase(adminEmail)) {
            return adminLogin(request);
        }
        
        // User login
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), "USER");
        
        return AuthResponseDTO.builder()
            .token(token)
            .user(AuthResponseDTO.UserInfoDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role("USER")
                .build())
            .build();
    }
    
    private AuthResponseDTO adminLogin(AuthRequestDTO request) {
        AdminUser admin = adminUserRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!admin.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        String token = jwtUtil.generateToken(admin.getEmail(), admin.getId(), admin.getRole().name());
        
        return AuthResponseDTO.builder()
            .token(token)
            .user(AuthResponseDTO.UserInfoDTO.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .role(admin.getRole().name())
                .build())
            .build();
    }
}
