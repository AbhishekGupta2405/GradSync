package com.gradsync.user.dto;

import com.gradsync.user.entity.Education;
import com.gradsync.user.entity.Experience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private String userId;
    private String firstName;
    private String lastName;
    private String role;
    private boolean isVerified;
    private boolean isDeleted;
    private Integer batchYear;
    private String branch;
    private String headline;
    private String bio;
    private String profileImageUrl;
    private String location;
    private String currentCompany;
    private String position;
    @Valid
    private List<ExperienceDto> experiences;
    
    @Valid
    private List<EducationDto> education;
    
    @Valid
    private List<ProjectDto> projects;
    
    @Valid
    private List<CertificationDto> certifications;
    private List<String> skills;
    private List<String> achievements;
    private Map<String, String> socialLinks;

    @Data
    public static class ExperienceDto {
        private Long id;
        private String companyName;
        private String designation;
        private String location;
        private String startDate;
        private String endDate;
        private boolean isCurrent;
        private String description;
    }

    @Data
    public static class EducationDto {
        private Long id;
        private String institutionName;
        private String degree;
        private String fieldOfStudy;
        private String startDate;
        private String endDate;
        private boolean isCurrent;
        private String expectedGraduationYear;
    }

    @Data
    public static class ProjectDto {
        private Long id;
        @NotBlank(message = "Project title is mandatory")
        private String title;
        
        @URL(message = "Invalid URL format")
        private String projectUrl;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    public static class CertificationDto {
        private Long id;
        @NotBlank(message = "Certification name is mandatory")
        private String name;
        
        @NotBlank(message = "Issuer is mandatory")
        private String issuer;
        
        private String issueDate;
        
        @URL(message = "Invalid URL format")
        private String credentialUrl;
    }
}
