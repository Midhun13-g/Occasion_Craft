package com.templatemart.controller;

import jakarta.validation.Valid;
import com.templatemart.dto.TemplateDTO;
import com.templatemart.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class TemplateController {
    
    private static final Logger log = LoggerFactory.getLogger(TemplateController.class);
    private final TemplateService templateService;
    
    @GetMapping
    public ResponseEntity<List<TemplateDTO>> getAllTemplates() {
        log.info("GET /templates - Fetching all templates");
        List<TemplateDTO> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/admin/all")
    public ResponseEntity<List<TemplateDTO>> getAllTemplatesForAdmin() {
        log.info("GET /templates/admin/all - Fetching all templates for admin");
        List<TemplateDTO> templates = templateService.getAllTemplatesForAdmin();
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TemplateDTO> getTemplateById(@PathVariable String id) {
        log.info("GET /templates/{} - Fetching template by id", id);
        TemplateDTO template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<TemplateDTO>> getTemplatesByType(@PathVariable String type) {
        log.info("GET /templates/type/{} - Fetching templates by type", type);
        List<TemplateDTO> templates = templateService.getTemplatesByType(type);
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TemplateDTO>> getTemplatesByCategory(@PathVariable String category) {
        log.info("GET /templates/category/{} - Fetching templates by category", category);
        List<TemplateDTO> templates = templateService.getTemplatesByCategory(category);
        return ResponseEntity.ok(templates);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TemplateDTO>> searchTemplates(@RequestParam String q) {
        log.info("GET /templates/search?q={} - Searching templates", q);
        List<TemplateDTO> templates = templateService.searchTemplates(q);
        return ResponseEntity.ok(templates);
    }
    
    @PostMapping
    public ResponseEntity<TemplateDTO> createTemplate(@Valid @RequestBody TemplateDTO templateDTO) {
        log.info("POST /templates - Creating new template: {}", templateDTO.getName());
        TemplateDTO created = templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TemplateDTO> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody TemplateDTO templateDTO) {
        log.info("PUT /templates/{} - Updating template", id);
        TemplateDTO updated = templateService.updateTemplate(id, templateDTO);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        log.info("DELETE /templates/{} - Deleting template", id);
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Void> toggleTemplateActive(@PathVariable String id) {
        log.info("PATCH /templates/{}/toggle-active - Toggling template active status", id);
        templateService.toggleTemplateActive(id);
        return ResponseEntity.noContent().build();
    }
}
