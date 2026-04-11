package com.templatemart.repository;

import com.templatemart.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, String> {
    
    List<Template> findAllByIsActiveTrue();
    
    List<Template> findAllByIsActiveTrueAndType(Template.TemplateType type);
    
    List<Template> findAllByIsActiveTrueAndCategoryIgnoreCase(String category);
    
    List<Template> findAllByIsActiveTrueAndType(Template.TemplateType type, 
                                                 org.springframework.data.domain.Pageable pageable);
    
    Optional<Template> findByIdAndIsActiveTrue(String id);
    
    @Query("SELECT t FROM Template t WHERE t.isActive = true AND " +
           "(LOWER(t.name) LIKE %:search% OR LOWER(t.description) LIKE %:search%)")
    List<Template> searchTemplates(@Param("search") String search);
    
    List<Template> findByTemplateUrl(String templateUrl);
    
    long countByCategory(String category);
    
    long countByIsActive(boolean isActive);
    
    long countByType(Template.TemplateType type);
}
