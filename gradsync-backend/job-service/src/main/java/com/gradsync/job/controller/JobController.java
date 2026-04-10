package com.gradsync.job.controller;

import com.gradsync.job.entity.Job;
import com.gradsync.job.entity.Application;
import com.gradsync.job.repository.JobRepository;
import com.gradsync.job.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(updatedJob.getTitle());
            job.setCompany(updatedJob.getCompany());
            job.setLocation(updatedJob.getLocation());
            job.setDescription(updatedJob.getDescription());
            job.setType(updatedJob.getType());
            job.setExperienceLevel(updatedJob.getExperienceLevel());
            job.setSalaryRange(updatedJob.getSalaryRange());
            job.setRequirements(updatedJob.getRequirements());
            job.setJobLink(updatedJob.getJobLink());
            return ResponseEntity.ok(jobRepository.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobRepository.save(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        if (jobRepository.existsById(id)) {
            jobRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<Application> applyForJob(@PathVariable Long jobId, @RequestBody Application application) {
        application.setJobId(jobId);
        application.setStatus("PENDING");
        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    @GetMapping("/student/{studentId}/applications")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable String studentId) {
        return ResponseEntity.ok(applicationRepository.findByStudentId(studentId));
    }
}
