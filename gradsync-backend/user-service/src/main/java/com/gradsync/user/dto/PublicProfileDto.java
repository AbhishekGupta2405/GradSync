package com.gradsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * A safely constrained Data Transfer Object designed to yield explicit
 * public-facing user profile components for the global Directory search architecture
 * while organically filtering internal database metrics and sensitive flags.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileDto {
    private String userId;
    private String firstName;
    private String lastName;
    private String role;
    private boolean isVerified;
    private Integer batchYear;
    private String branch;
    private String headline;
    private String bio;
    private String profileImageUrl;
    private String location;
    private String currentCompany;
    private String position;
    
    // Core Array Matrices
    private List<ProfileDto.ExperienceDto> experiences;
    private List<ProfileDto.EducationDto> education;
    private List<ProfileDto.ProjectDto> projects;
    private List<ProfileDto.CertificationDto> certifications;
    
    // Key Elements
    private List<String> skills;
    private List<String> achievements;
    private Map<String, String> socialLinks;
}
