package com.templatemart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    
    private String id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    
    @JsonProperty("isActive")
    private boolean isActive;
    
    @JsonProperty("templateCount")
    private Long templateCount;
}
