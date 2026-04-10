package com.gradsync.job.repository;

import com.gradsync.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByType(String type);
    List<Job> findByPostedBy(String postedBy);
    void deleteByPostedBy(String postedBy);
}
