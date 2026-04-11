package com.templatemart.config;

import com.templatemart.entity.AdminUser;
import com.templatemart.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {
    
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${admin.email}")
    private String adminEmail;
    
    @Value("${admin.default.password}")
    private String adminPassword;
    
    @Override
    public void run(String... args) {
        if (!adminUserRepository.existsByEmail(adminEmail)) {
            AdminUser admin = AdminUser.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(AdminUser.AdminRole.SUPER_ADMIN)
                .enabled(true)
                .build();
            
            adminUserRepository.save(admin);
            log.info("Default admin user created: {}", adminEmail);
            log.info("Default admin password: {}", adminPassword);
            log.warn("IMPORTANT: Change the admin password after first login!");
        } else {
            log.info("Admin user already exists: {}", adminEmail);
        }
    }
}
