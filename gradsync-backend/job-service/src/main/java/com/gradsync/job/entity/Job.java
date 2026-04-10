package com.gradsync.job.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String postedBy; // User ID from Auth Service

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String type; // e.g., FULL_TIME, INTERNSHIP

    private String experienceLevel;

    private String salaryRange;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(length = 500)
    private String jobLink;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
