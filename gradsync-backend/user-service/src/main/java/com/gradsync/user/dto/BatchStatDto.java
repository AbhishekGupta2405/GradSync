package com.gradsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchStatDto {
    private Integer graduationYear;
    private Long totalStudents;
    private Long placedStudents;
    private String averagePackage;
    private List<String> topCompanies;
    
    // Additional UI specific bindings
    private Boolean isActive;
    private List<String> achievements;
}
