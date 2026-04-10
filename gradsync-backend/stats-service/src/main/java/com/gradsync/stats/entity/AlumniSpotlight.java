package com.gradsync.stats.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "alumni_spotlights")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumniSpotlight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String batch;
    private String company;
    private String position;
    private String location;
    
    @Column(length = 1000)
    private String image;
    
    @Column(length = 2000)
    private String story;

    @ElementCollection
    @CollectionTable(name = "alumni_achievements", joinColumns = @JoinColumn(name = "spotlight_id"))
    @Column(name = "achievement")
    private List<String> achievements;

    private String linkedin;
}
