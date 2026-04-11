package com.templatemart.service;

import com.templatemart.repository.PaymentRepository;
import com.templatemart.repository.TemplateRepository;
import com.templatemart.repository.UserPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PaymentRepository paymentRepository;
    private final TemplateRepository templateRepository;
    private final UserPageRepository userPageRepository;

    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("overview", getOverviewStats());
        analytics.put("revenue", getRevenueStats());
        analytics.put("templates", getTemplateStats());
        analytics.put("recentActivity", getRecentActivity());
        analytics.put("topTemplates", getTopTemplates());
        
        return analytics;
    }

    private Map<String, Object> getOverviewStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalTemplates = templateRepository.count();
        long activeTemplates = templateRepository.countByIsActive(true);
        long totalPages = userPageRepository.count();
        long totalPayments = paymentRepository.countByStatus(com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL);
        
        stats.put("totalTemplates", totalTemplates);
        stats.put("activeTemplates", activeTemplates);
        stats.put("totalPages", totalPages);
        stats.put("totalPayments", totalPayments);
        
        return stats;
    }

    private Map<String, Object> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        BigDecimal monthlyRevenue = paymentRepository.sumAmountByStatusAndCreatedAtAfter(
            com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL, startOfMonth);
        stats.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO);
        
        LocalDateTime startOfToday = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        BigDecimal todayRevenue = paymentRepository.sumAmountByStatusAndCreatedAtAfter(
            com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL, startOfToday);
        stats.put("todayRevenue", todayRevenue != null ? todayRevenue : BigDecimal.ZERO);
        
        return stats;
    }

    private Map<String, Object> getTemplateStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long simpleTemplates = templateRepository.countByType(com.templatemart.entity.Template.TemplateType.SIMPLE);
        long complexTemplates = templateRepository.countByType(com.templatemart.entity.Template.TemplateType.COMPLEX);
        
        stats.put("simple", simpleTemplates);
        stats.put("complex", complexTemplates);
        
        List<Map<String, Object>> categoryStats = templateRepository.findAll().stream()
            .collect(Collectors.groupingBy(t -> t.getCategory(), Collectors.counting()))
            .entrySet().stream()
            .map(entry -> {
                Map<String, Object> cat = new HashMap<>();
                cat.put("category", entry.getKey());
                cat.put("count", entry.getValue());
                return cat;
            })
            .collect(Collectors.toList());
        
        stats.put("byCategory", categoryStats);
        
        return stats;
    }

    private List<Map<String, Object>> getRecentActivity() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        userPageRepository.findTop10ByOrderByCreatedAtDesc().forEach(page -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "page_created");
            activity.put("userName", page.getUserName());
            activity.put("templateName", page.getTemplate().getName());
            activity.put("createdAt", page.getCreatedAt());
            activities.add(activity);
        });
        
        return activities;
    }

    private List<Map<String, Object>> getTopTemplates() {
        return templateRepository.findAll().stream()
            .map(template -> {
                Map<String, Object> data = new HashMap<>();
                data.put("id", template.getId());
                data.put("name", template.getName());
                data.put("category", template.getCategory());
                data.put("price", template.getPrice());
                data.put("totalSales", template.getPayments() != null ? 
                    template.getPayments().stream()
                        .filter(p -> p.getStatus() == com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL)
                        .count() : 0);
                data.put("totalRevenue", template.getPayments() != null ?
                    template.getPayments().stream()
                        .filter(p -> p.getStatus() == com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL)
                        .map(p -> p.getAmount())
                        .reduce(BigDecimal.ZERO, BigDecimal::add) : BigDecimal.ZERO);
                return data;
            })
            .sorted((a, b) -> Long.compare((Long)b.get("totalSales"), (Long)a.get("totalSales")))
            .limit(10)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getTemplateAnalytics(String templateId) {
        Map<String, Object> analytics = new HashMap<>();
        
        var template = templateRepository.findById(templateId).orElseThrow();
        
        analytics.put("templateId", templateId);
        analytics.put("templateName", template.getName());
        
        long totalSales = template.getPayments() != null ?
            template.getPayments().stream()
                .filter(p -> p.getStatus() == com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL)
                .count() : 0;
        analytics.put("totalSales", totalSales);
        
        BigDecimal totalRevenue = template.getPayments() != null ?
            template.getPayments().stream()
                .filter(p -> p.getStatus() == com.templatemart.entity.Payment.PaymentStatus.SUCCESSFUL)
                .map(p -> p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add) : BigDecimal.ZERO;
        analytics.put("totalRevenue", totalRevenue);
        
        long totalViews = template.getUserPages() != null ?
            template.getUserPages().stream()
                .mapToLong(p -> p.getViewCount())
                .sum() : 0;
        analytics.put("totalViews", totalViews);
        
        long activePagesCount = template.getUserPages() != null ?
            template.getUserPages().stream()
                .filter(p -> p.getIsActive())
                .count() : 0;
        analytics.put("activePages", activePagesCount);
        
        return analytics;
    }
}
