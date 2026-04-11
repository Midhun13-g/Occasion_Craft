package com.templatemart.controller;

import com.templatemart.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    @GetMapping("/template/{templateId}")
    public ResponseEntity<Map<String, Object>> getTemplateAnalytics(@PathVariable String templateId) {
        return ResponseEntity.ok(analyticsService.getTemplateAnalytics(templateId));
    }
}
