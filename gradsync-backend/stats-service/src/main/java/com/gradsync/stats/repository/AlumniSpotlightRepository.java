package com.gradsync.stats.repository;

import com.gradsync.stats.entity.AlumniSpotlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumniSpotlightRepository extends JpaRepository<AlumniSpotlight, Long> {
}
