package com.templatemart.service;

import com.templatemart.dto.TemplateDTO;
import com.templatemart.entity.Template;
import com.templatemart.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateService {
    
    private static final Logger log = LoggerFactory.getLogger(TemplateService.class);
    
    private final TemplateRepository templateRepository;
    
    @Transactional(readOnly = true)
    public List<TemplateDTO> getAllTemplates() {
        log.info("Fetching all active templates");
        List<Template> templates = templateRepository.findAll();
        log.info("Total templates in DB: {}", templates.size());
        List<Template> activeTemplates = templateRepository.findAllByIsActiveTrue();
        log.info("Active templates: {}", activeTemplates.size());
        activeTemplates.forEach(t -> log.info("Template: {} - Active: {}", t.getName(), t.getIsActive()));
        return activeTemplates.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TemplateDTO> getAllTemplatesForAdmin() {
        log.info("Fetching all templates for admin");
        List<Template> templates = templateRepository.findAll();
        log.info("Found {} total templates", templates.size());
        return templates.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TemplateDTO> getTemplatesByType(String type) {
        log.debug("Fetching templates by type: {}", type);
        try {
            Template.TemplateType templateType = Template.TemplateType.valueOf(type.toUpperCase());
            return templateRepository.findAllByIsActiveTrueAndType(templateType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid template type: {}", type);
            return List.of();
        }
    }
    
    @Transactional(readOnly = true)
    public List<TemplateDTO> getTemplatesByCategory(String category) {
        log.debug("Fetching templates by category: {}", category);
        return templateRepository.findAllByIsActiveTrueAndCategoryIgnoreCase(category)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TemplateDTO getTemplateById(String id) {
        log.debug("Fetching template by id: {}", id);
        return templateRepository.findByIdAndIsActiveTrue(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<TemplateDTO> searchTemplates(String search) {
        log.debug("Searching templates with query: {}", search);
        return templateRepository.searchTemplates(search)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public TemplateDTO createTemplate(TemplateDTO dto) {
        log.info("Creating new template: {}", dto.getName());
        log.info("Template type: {}, is_active: {}", dto.getType(), dto.getIsActive());
        Template template = convertToEntity(dto);
        log.info("Converted entity - type: {}, is_active: {}", template.getType(), template.getIsActive());
        Template saved = templateRepository.save(template);
        log.info("Saved template with id: {}, is_active: {}", saved.getId(), saved.getIsActive());
        return convertToDTO(saved);
    }
    
    @Transactional
    public TemplateDTO updateTemplate(String id, TemplateDTO dto) {
        log.debug("Updating template: {}", id);
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        
        updateTemplateFields(template, dto);
        Template updated = templateRepository.save(template);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteTemplate(String id) {
        log.debug("Deleting template: {}", id);
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        templateRepository.delete(template);
    }
    
    @Transactional
    public void toggleTemplateActive(String id) {
        log.debug("Toggling template active status: {}", id);
        Template template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        template.setIsActive(!template.getIsActive());
        templateRepository.save(template);
    }
    
    // Helper methods
    private TemplateDTO convertToDTO(Template template) {
        return TemplateDTO.builder()
            .id(template.getId())
            .name(template.getName())
            .description(template.getDescription())
            .type(template.getType().toString())
            .category(template.getCategory())
            .price(template.getPrice())
            .config(template.getConfig())
            .previewUrl(template.getPreviewUrl())
            .previewType(template.getPreviewType().toString())
            .templateUrl(template.getTemplateUrl())
            .isActive(template.getIsActive())
            .features(template.getFeatures())
            .demoData(template.getDemoData())
            .createdAt(template.getCreatedAt())
            .updatedAt(template.getUpdatedAt())
            .build();
    }
    
    private Template convertToEntity(TemplateDTO dto) {
        return Template.builder()
            .name(dto.getName())
            .description(dto.getDescription())
            .type(Template.TemplateType.valueOf(dto.getType().toUpperCase()))
            .category(dto.getCategory())
            .price(dto.getPrice())
            .config(dto.getConfig())
            .previewUrl(dto.getPreviewUrl())
            .previewType(Template.PreviewType.valueOf(dto.getPreviewType().toUpperCase()))
            .templateUrl(dto.getTemplateUrl())
            .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
            .features(dto.getFeatures())
            .demoData(dto.getDemoData())
            .build();
    }
    
    private void updateTemplateFields(Template template, TemplateDTO dto) {
        if (dto.getName() != null) template.setName(dto.getName());
        if (dto.getDescription() != null) template.setDescription(dto.getDescription());
        if (dto.getType() != null) template.setType(Template.TemplateType.valueOf(dto.getType().toUpperCase()));
        if (dto.getCategory() != null) template.setCategory(dto.getCategory());
        if (dto.getPrice() != null) template.setPrice(dto.getPrice());
        if (dto.getConfig() != null) template.setConfig(dto.getConfig());
        if (dto.getPreviewUrl() != null) template.setPreviewUrl(dto.getPreviewUrl());
        if (dto.getPreviewType() != null) template.setPreviewType(Template.PreviewType.valueOf(dto.getPreviewType().toUpperCase()));
        if (dto.getTemplateUrl() != null) template.setTemplateUrl(dto.getTemplateUrl());
        if (dto.getIsActive() != null) template.setIsActive(dto.getIsActive());
        if (dto.getFeatures() != null) template.setFeatures(dto.getFeatures());
        if (dto.getDemoData() != null) template.setDemoData(dto.getDemoData());
    }
}
