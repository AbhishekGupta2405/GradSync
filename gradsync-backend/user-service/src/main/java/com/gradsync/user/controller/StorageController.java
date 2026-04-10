package com.gradsync.user.controller;

import com.gradsync.user.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles/storage")
@RequiredArgsConstructor
public class StorageController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder
    ) {
        try {
            String s3Key = s3Service.uploadFile(folder, file);
            // Generate a pre-signed URL so the browser can directly load the media
            String presignedUrl = s3Service.generatePresignedUrl(s3Key);
            return ResponseEntity.ok(Map.of(
                "url", presignedUrl != null ? presignedUrl : s3Key,
                "s3Key", s3Key
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file"));
        }
    }
}
