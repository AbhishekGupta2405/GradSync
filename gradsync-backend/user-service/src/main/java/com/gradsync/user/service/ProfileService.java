package com.gradsync.user.service;

import com.gradsync.user.dto.ProfileDto;
import com.gradsync.user.dto.PublicProfileDto;
import com.gradsync.user.entity.Profile;
import com.gradsync.user.entity.Experience;
import com.gradsync.user.entity.Education;
import com.gradsync.user.entity.Project;
import com.gradsync.user.entity.Certification;
import com.gradsync.user.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final S3Service s3Service;

    public ProfileDto createOrUpdateProfile(String userId, ProfileDto profileDto) {
        Profile profile = profileRepository.findById(userId)
                .orElse(new Profile());

        profile.setUserId(userId);
        profile.setFirstName(profileDto.getFirstName());
        profile.setLastName(profileDto.getLastName());
        profile.setRole(profileDto.getRole());
        profile.setBatchYear(profileDto.getBatchYear());
        profile.setBranch(profileDto.getBranch());
        profile.setHeadline(profileDto.getHeadline());
        profile.setBio(profileDto.getBio());
        
        // SAFEGUARD: Do not save temporary S3 Presigned URLs back to the DB!
        String incomingUrl = profileDto.getProfileImageUrl();
        if (incomingUrl != null && incomingUrl.contains("X-Amz-Algorithm")) {
            // Keep the raw S3 Key already in the database
            profile.setProfileImageUrl(profile.getProfileImageUrl());
        } else {
            profile.setProfileImageUrl(incomingUrl);
        }
        
        profile.setLocation(profileDto.getLocation());
        profile.setCurrentCompany(profileDto.getCurrentCompany());
        profile.setPosition(profileDto.getPosition());
        
        if (profileDto.getSkills() != null) {
            profile.getSkills().clear();
            profile.getSkills().addAll(profileDto.getSkills());
        }
        if (profileDto.getSocialLinks() != null) {
            profile.getSocialLinks().clear();
            profile.getSocialLinks().putAll(profileDto.getSocialLinks());
        }
        if (profileDto.getAchievements() != null) {
            profile.getAchievements().clear();
            profile.getAchievements().addAll(profileDto.getAchievements());
        }
        if (profileDto.getProjects() != null) {
            profile.getProjects().clear();
            profileDto.getProjects().forEach(dto -> {
                Project p = new Project();
                p.setTitle(dto.getTitle());
                p.setDescription(dto.getDescription());
                p.setStartDate(dto.getStartDate());
                p.setEndDate(dto.getEndDate());
                p.setProjectUrl(dto.getProjectUrl());
                p.setProfile(profile);
                profile.getProjects().add(p);
            });
        }
        if (profileDto.getCertifications() != null) {
            profile.getCertifications().clear();
            profileDto.getCertifications().forEach(dto -> {
                Certification c = new Certification();
                c.setName(dto.getName());
                c.setIssuer(dto.getIssuer());
                c.setIssueDate(dto.getIssueDate());
                c.setCredentialUrl(dto.getCredentialUrl());
                c.setProfile(profile);
                profile.getCertifications().add(c);
            });
        }
        if (profileDto.getExperiences() != null) {
            profile.getExperiences().clear();
            profileDto.getExperiences().forEach(dto -> {
                Experience exp = new Experience();
                exp.setCompanyName(dto.getCompanyName());
                exp.setDesignation(dto.getDesignation());
                exp.setLocation(dto.getLocation());
                exp.setStartDate(dto.getStartDate() != null && !dto.getStartDate().isEmpty() ? java.time.LocalDate.parse(dto.getStartDate()) : null);
                exp.setEndDate(dto.getEndDate() != null && !dto.getEndDate().isEmpty() ? java.time.LocalDate.parse(dto.getEndDate()) : null);
                exp.setCurrent(dto.isCurrent());
                exp.setDescription(dto.getDescription());
                exp.setProfile(profile);
                profile.getExperiences().add(exp);
            });
        }

        Profile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    public ProfileDto getProfile(String userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return mapToDto(profile);
    }

    public PublicProfileDto getPublicProfile(String userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        if (profile.isDeleted()) {
            throw new RuntimeException("Profile not found");
        }
        
        return mapToPublicDto(profile);
    }

    public List<ProfileDto> getAllProfiles() {
        return profileRepository.findAll()
                .stream()
                .filter(p -> !p.isDeleted() && p.isVerified())
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProfileDto> getPendingProfiles() {
        return profileRepository.findAll()
                .stream()
                .filter(p -> !p.isDeleted() && !p.isVerified())
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProfileDto> getProfilesByRole(String role) {
        return profileRepository.findAll()
                .stream()
                .filter(p -> !p.isDeleted() && p.isVerified() && role.equalsIgnoreCase(p.getRole()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public void verifyProfile(String userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setVerified(true);
        profileRepository.save(profile);
    }
    
    public void softDeleteProfile(String userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setDeleted(true);
        profileRepository.save(profile);
    }

    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .role(profile.getRole())
                .batchYear(profile.getBatchYear())
                .branch(profile.getBranch())
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .profileImageUrl(s3Service.generatePresignedUrl(profile.getProfileImageUrl()))
                .location(profile.getLocation())
                .currentCompany(profile.getCurrentCompany())
                .position(profile.getPosition())
                .isVerified(profile.isVerified())
                .isDeleted(profile.isDeleted())
                .skills(profile.getSkills())
                .achievements(profile.getAchievements())
                .socialLinks(profile.getSocialLinks())
                .experiences(profile.getExperiences() != null ? profile.getExperiences().stream().map(e -> {
                    ProfileDto.ExperienceDto dto = new ProfileDto.ExperienceDto();
                    dto.setId(e.getId());
                    dto.setCompanyName(e.getCompanyName());
                    dto.setDesignation(e.getDesignation());
                    dto.setLocation(e.getLocation());
                    dto.setStartDate(e.getStartDate() != null ? e.getStartDate().toString() : null);
                    dto.setEndDate(e.getEndDate() != null ? e.getEndDate().toString() : null);
                    dto.setCurrent(e.isCurrent());
                    dto.setDescription(e.getDescription());
                    return dto;
                }).collect(Collectors.toList()) : null)
                .education(profile.getEducation() != null ? profile.getEducation().stream().map(e -> {
                    ProfileDto.EducationDto dto = new ProfileDto.EducationDto();
                    dto.setId(e.getId());
                    dto.setInstitutionName(e.getInstitutionName());
                    dto.setDegree(e.getDegree());
                    dto.setFieldOfStudy(e.getFieldOfStudy());
                    dto.setStartDate(e.getStartDate() != null ? e.getStartDate().toString() : null);
                    dto.setEndDate(e.getEndDate() != null ? e.getEndDate().toString() : null);
                    dto.setCurrent(e.isCurrent());
                    return dto;
                }).collect(Collectors.toList()) : null)
                .projects(profile.getProjects() != null ? profile.getProjects().stream().map(p -> {
                    ProfileDto.ProjectDto dto = new ProfileDto.ProjectDto();
                    dto.setId(p.getId());
                    dto.setTitle(p.getTitle());
                    dto.setProjectUrl(p.getProjectUrl());
                    dto.setStartDate(p.getStartDate());
                    dto.setEndDate(p.getEndDate());
                    dto.setDescription(p.getDescription());
                    return dto;
                }).collect(Collectors.toList()) : null)
                .certifications(profile.getCertifications() != null ? profile.getCertifications().stream().map(c -> {
                    ProfileDto.CertificationDto dto = new ProfileDto.CertificationDto();
                    dto.setId(c.getId());
                    dto.setName(c.getName());
                    dto.setIssuer(c.getIssuer());
                    dto.setIssueDate(c.getIssueDate());
                    dto.setCredentialUrl(c.getCredentialUrl());
                    return dto;
                }).collect(Collectors.toList()) : null)
                .build();
    }

    private PublicProfileDto mapToPublicDto(Profile profile) {
        ProfileDto standardDto = mapToDto(profile);
        return PublicProfileDto.builder()
                .userId(standardDto.getUserId())
                .firstName(standardDto.getFirstName())
                .lastName(standardDto.getLastName())
                .role(standardDto.getRole())
                .isVerified(standardDto.isVerified())
                .batchYear(standardDto.getBatchYear())
                .branch(standardDto.getBranch())
                .headline(standardDto.getHeadline())
                .bio(standardDto.getBio())
                .profileImageUrl(standardDto.getProfileImageUrl())
                .location(standardDto.getLocation())
                .currentCompany(standardDto.getCurrentCompany())
                .position(standardDto.getPosition())
                .experiences(standardDto.getExperiences())
                .education(standardDto.getEducation())
                .projects(standardDto.getProjects())
                .certifications(standardDto.getCertifications())
                .skills(standardDto.getSkills())
                .achievements(standardDto.getAchievements())
                .socialLinks(standardDto.getSocialLinks())
                .build();
    }
}
