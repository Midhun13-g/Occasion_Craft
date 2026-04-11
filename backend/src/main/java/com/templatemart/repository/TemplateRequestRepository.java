package com.templatemart.repository;

import com.templatemart.entity.TemplateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRequestRepository extends JpaRepository<TemplateRequest, String> {
    
    List<TemplateRequest> findByStatus(TemplateRequest.RequestStatus status);
    
    List<TemplateRequest> findByTemplateId(String templateId);
    
    List<TemplateRequest> findByUserEmail(String userEmail);
}
