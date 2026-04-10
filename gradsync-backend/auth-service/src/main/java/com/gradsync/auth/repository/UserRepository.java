package com.gradsync.auth.repository;

import com.gradsync.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByLinkedinId(String linkedinId);
    boolean existsByEmail(String email);
}
