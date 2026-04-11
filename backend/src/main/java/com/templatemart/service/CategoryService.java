package com.templatemart.service;

import com.templatemart.dto.CategoryDTO;
import com.templatemart.entity.Category;
import com.templatemart.repository.CategoryRepository;
import com.templatemart.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final TemplateRepository templateRepository;
    
    public List<CategoryDTO> getAllCategories() {
        log.info("Fetching all categories");
        try {
            List<Category> categories = categoryRepository.findAll();
            log.info("Found {} categories", categories.size());
            return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching categories", e);
            throw new RuntimeException("Failed to fetch categories: " + e.getMessage());
        }
    }
    
    public CategoryDTO getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToDTO(category);
    }
    
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("Category with this slug already exists");
        }
        
        Category category = Category.builder()
            .name(dto.getName())
            .slug(dto.getSlug())
            .description(dto.getDescription())
            .icon(dto.getIcon())
            .isActive(dto.isActive())
            .build();
        
        Category saved = categoryRepository.save(category);
        return convertToDTO(saved);
    }
    
    @Transactional
    public CategoryDTO updateCategory(String id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Check if slug is being changed and if it already exists
        if (!category.getSlug().equals(dto.getSlug()) && 
            categoryRepository.existsBySlug(dto.getSlug())) {
            throw new RuntimeException("Category with this slug already exists");
        }
        
        category.setName(dto.getName());
        category.setSlug(dto.getSlug());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setActive(dto.isActive());
        
        Category updated = categoryRepository.save(category);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteCategory(String id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Check if category has templates
        long templateCount = templateRepository.countByCategory(category.getSlug());
        if (templateCount > 0) {
            throw new RuntimeException("Cannot delete category with existing templates");
        }
        
        categoryRepository.delete(category);
    }
    
    @Transactional
    public CategoryDTO toggleActive(String id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        category.setActive(!category.isActive());
        Category updated = categoryRepository.save(category);
        return convertToDTO(updated);
    }
    
    private CategoryDTO convertToDTO(Category category) {
        long templateCount = templateRepository.countByCategory(category.getSlug());
        
        return CategoryDTO.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .description(category.getDescription())
            .icon(category.getIcon())
            .isActive(category.isActive())
            .templateCount(templateCount)
            .build();
    }
}
