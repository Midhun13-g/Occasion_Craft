package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDTO {
    
    @JsonProperty("total_templates")
    private Integer totalTemplates;
    
    @JsonProperty("active_templates")
    private Integer activeTemplates;
    
    @JsonProperty("total_revenue")
    private BigDecimal totalRevenue;
    
    @JsonProperty("total_orders")
    private Integer totalOrders;
    
    @JsonProperty("total_pages")
    private Integer totalPages;
    
    @JsonProperty("total_views")
    private Integer totalViews;
    
    @JsonProperty("conversion_rate")
    private Double conversionRate;
    
    @JsonProperty("top_templates")
    private List<TopTemplateDTO> topTemplates;
    
    @JsonProperty("category_stats")
    private List<CategoryStatDTO> categoryStats;
    
    @JsonProperty("recent_activity")
    private List<DailyActivityDTO> recentActivity;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopTemplateDTO {
        private String id;
        private String name;
        private String category;
        private Integer orders;
        private BigDecimal revenue;
        private Integer views;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryStatDTO {
        private String category;
        private Integer count;
        private BigDecimal revenue;
        private Integer orders;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyActivityDTO {
        private LocalDate date;
        private Integer orders;
        private BigDecimal revenue;
    }
}
