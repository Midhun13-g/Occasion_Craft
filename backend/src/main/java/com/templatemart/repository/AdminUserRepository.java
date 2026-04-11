package com.templatemart.repository;

import com.templatemart.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, String> {
    
    Optional<AdminUser> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
