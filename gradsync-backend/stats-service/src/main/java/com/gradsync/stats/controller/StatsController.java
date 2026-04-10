package com.gradsync.stats.controller;

import com.gradsync.stats.entity.AlumniSpotlight;
import com.gradsync.stats.entity.BatchStat;
import com.gradsync.stats.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/batches")
    public ResponseEntity<Map<String, Object>> getAllBatches() {
        Map<String, Object> response = new HashMap<>();
        response.put("batches", statsService.getAllBatches());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/batches/{year}")
    public ResponseEntity<BatchStat> getBatchByYear(@PathVariable Integer year) {
        return ResponseEntity.ok(statsService.getBatchByYear(year));
    }

    @GetMapping("/spotlights")
    public ResponseEntity<List<AlumniSpotlight>> getSpotlights() {
        return ResponseEntity.ok(statsService.getAlumniSpotlights());
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", 1450); // Mocks for now, will connect to user-service later via Feign
        summary.put("totalJobs", 324);
        summary.put("totalEvents", 56);
        return ResponseEntity.ok(summary);
    }
}
