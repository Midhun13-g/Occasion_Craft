package com.templatemart.service;

import com.templatemart.dto.UserPageDTO;
import com.templatemart.entity.UserPage;
import com.templatemart.repository.UserPageRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPageService {
    
    private static final Logger log = LoggerFactory.getLogger(UserPageService.class);
    
    private final UserPageRepository userPageRepository;
    
    @Transactional(readOnly = true)
    public UserPageDTO getPageBySlug(String slug) {
        log.debug("Fetching page by slug: {}", slug);
        return userPageRepository.findByUniqueSlugAndIsActiveTrue(slug)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Page not found with slug: " + slug));
    }
    
    @Transactional(readOnly = true)
    public UserPageDTO getPageById(String id) {
        log.debug("Fetching page by id: {}", id);
        return userPageRepository.findByIdAndIsActiveTrue(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Page not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public UserPageDTO getPageBySlugOrId(String slugOrId) {
        log.debug("Fetching page by slug or id: {}", slugOrId);
        // Try by ID first
        var byId = userPageRepository.findByIdAndIsActiveTrue(slugOrId);
        if (byId.isPresent()) {
            return convertToDTO(byId.get());
        }
        
        // Try by slug
        var bySlug = userPageRepository.findByUniqueSlugAndIsActiveTrue(slugOrId);
        if (bySlug.isPresent()) {
            return convertToDTO(bySlug.get());
        }
        
        throw new RuntimeException("Page not found");
    }
    
    @Transactional
    public void incrementViewCount(String id) {
        log.debug("Incrementing view count for page: {}", id);
        UserPage page = userPageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Page not found with id: " + id));
        page.setViewCount(page.getViewCount() + 1);
        userPageRepository.save(page);
    }
    
    @Transactional(readOnly = true)
    public List<UserPageDTO> getPagesByUserEmail(String userEmail) {
        log.debug("Fetching pages for user email: {}", userEmail);
        return userPageRepository.findByUserEmailAndIsActiveTrue(userEmail)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deactivatePage(String id) {
        log.debug("Deactivating page: {}", id);
        UserPage page = userPageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Page not found with id: " + id));
        page.setIsActive(false);
        userPageRepository.save(page);
    }
    
    private UserPageDTO convertToDTO(UserPage page) {
        return UserPageDTO.builder()
            .id(page.getId())
            .templateId(page.getTemplate().getId())
            .uniqueSlug(page.getUniqueSlug())
            .userName(page.getUserName())
            .userEmail(page.getUserEmail())
            .userData(page.getUserData())
            .paymentId(page.getPaymentId())
            .viewCount(page.getViewCount())
            .isActive(page.getIsActive())
            .createdAt(page.getCreatedAt())
            .expiresAt(page.getExpiresAt())
            .build();
    }
}
