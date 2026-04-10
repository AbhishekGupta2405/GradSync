package com.gradsync.user.repository;

import com.gradsync.user.entity.UserDeletionSaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeletionSagaRepository extends JpaRepository<UserDeletionSaga, Long> {
    Optional<UserDeletionSaga> findByUserId(String userId);
    List<UserDeletionSaga> findByStatus(String status);
}
