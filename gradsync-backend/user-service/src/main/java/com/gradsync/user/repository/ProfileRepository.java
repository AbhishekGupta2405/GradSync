package com.gradsync.user.repository;

import com.gradsync.user.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
    List<Profile> findByRole(String role);
    List<Profile> findByBatchYear(Integer batchYear);
    List<Profile> findByBranch(String branch);
}
