package com.gradsync.stats.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "batch_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchStat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer year;
    private Integer graduationYear;
    private Integer totalStudents;
    private Integer placedStudents;
    private Double averagePackage;
    private Double placementPercentage;
    private Boolean isActive;
    
    @ElementCollection
    @CollectionTable(name = "batch_top_companies", joinColumns = @JoinColumn(name = "batch_id"))
    @Column(name = "company_name")
    private List<String> topCompanies;

    @ElementCollection
    @CollectionTable(name = "batch_achievements", joinColumns = @JoinColumn(name = "batch_id"))
    @Column(name = "achievement")
    private List<String> achievements;
}
