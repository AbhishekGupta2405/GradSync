package com.gradsync.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @Column(name = "user_id")
    private String userId; // Maps strictly to the ID from auth-service

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String role; // Duplicate from auth-service for fast querying ('STUDENT', 'ALUMNI')
    
    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;
    
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    private Integer batchYear;
    private String branch;
    
    @Column(length = 255)
    private String headline;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImageUrl;
    
    private String location; // City, Country
    private String currentCompany;
    private String position;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> education = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_achievements", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "achievement")
    private List<String> achievements = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "profile_social_links", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url")
    private Map<String, String> socialLinks = new HashMap<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
