package com.templatemart.repository;

import com.templatemart.entity.UserPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserPageRepository extends JpaRepository<UserPage, String> {
    
    Optional<UserPage> findByUniqueSlugAndIsActiveTrue(String uniqueSlug);
    
    Optional<UserPage> findByIdAndIsActiveTrue(String id);
    
    List<UserPage> findByTemplateIdAndIsActiveTrue(String templateId);
    
    List<UserPage> findByUserEmailAndIsActiveTrue(String userEmail);
    
    boolean existsByUniqueSlug(String uniqueSlug);
    
    List<UserPage> findTop10ByOrderByCreatedAtDesc();
}
