package com.templatemart.controller;

import com.templatemart.dto.UserPageDTO;
import com.templatemart.service.UserPageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pages")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class UserPageController {
    
    private static final Logger log = LoggerFactory.getLogger(UserPageController.class);
    private final UserPageService userPageService;
    
    @GetMapping("/{slugOrId}")
    public ResponseEntity<UserPageDTO> getPage(@PathVariable String slugOrId) {
        log.info("GET /pages/{} - Fetching page by slug or id", slugOrId);
        UserPageDTO page = userPageService.getPageBySlugOrId(slugOrId);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/id/{id}")
    public ResponseEntity<UserPageDTO> getPageById(@PathVariable String id) {
        log.info("GET /pages/id/{} - Fetching page by id", id);
        UserPageDTO page = userPageService.getPageById(id);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<UserPageDTO> getPageBySlug(@PathVariable String slug) {
        log.info("GET /pages/slug/{} - Fetching page by slug", slug);
        UserPageDTO page = userPageService.getPageBySlug(slug);
        return ResponseEntity.ok(page);
    }
    
    @GetMapping("/user/{email}")
    public ResponseEntity<List<UserPageDTO>> getPagesByUserEmail(@PathVariable String email) {
        log.info("GET /pages/user/{} - Fetching pages for user email", email);
        List<UserPageDTO> pages = userPageService.getPagesByUserEmail(email);
        return ResponseEntity.ok(pages);
    }
    
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable String id) {
        log.info("POST /pages/{}/view - Incrementing view count", id);
        userPageService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePage(@PathVariable String id) {
        log.info("DELETE /pages/{} - Deactivating page", id);
        userPageService.deactivatePage(id);
        return ResponseEntity.noContent().build();
    }
}
