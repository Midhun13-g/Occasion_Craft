package com.templatemart.config;

import com.templatemart.entity.Category;
import com.templatemart.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CategoryInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            log.info("Initializing default categories...");
            
            List<Category> defaultCategories = Arrays.asList(
                createCategory("Birthday", "birthday", "Birthday celebration templates", "🎂"),
                createCategory("Wedding", "wedding", "Wedding invitation and celebration templates", "💒"),
                createCategory("Anniversary", "anniversary", "Anniversary celebration templates", "💝"),
                createCategory("Business", "business", "Business cards and professional templates", "💼"),
                createCategory("Invitation", "invitation", "Event invitation templates", "✉️"),
                createCategory("Greeting", "greeting", "Greeting card templates", "🎉"),
                createCategory("Portfolio", "portfolio", "Portfolio and showcase templates", "📁"),
                createCategory("Resume", "resume", "Resume and CV templates", "📄"),
                createCategory("Certificate", "certificate", "Certificate and award templates", "🏆"),
                createCategory("Social Media", "social-media", "Social media post templates", "📱"),
                createCategory("Event", "event", "Event announcement templates", "🎪"),
                createCategory("Other", "other", "Other miscellaneous templates", "📦")
            );
            
            categoryRepository.saveAll(defaultCategories);
            log.info("Default categories initialized successfully!");
        } else {
            log.info("Categories already exist, skipping initialization");
        }
    }

    private Category createCategory(String name, String slug, String description, String icon) {
        return Category.builder()
            .name(name)
            .slug(slug)
            .description(description)
            .icon(icon)
            .isActive(true)
            .build();
    }
}
