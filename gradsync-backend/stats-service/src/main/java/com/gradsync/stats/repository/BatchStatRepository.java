package com.gradsync.stats.repository;

import com.gradsync.stats.entity.BatchStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchStatRepository extends JpaRepository<BatchStat, Long> {
    List<BatchStat> findAllByOrderByGraduationYearDesc();
}
