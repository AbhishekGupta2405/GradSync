package com.gradsync.user.service;

import com.gradsync.user.entity.UserDeletionSaga;
import com.gradsync.user.repository.ProfileRepository;
import com.gradsync.user.repository.MessageRepository;
import com.gradsync.user.repository.UserDeletionSagaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDeletionService {

    private final UserDeletionSagaRepository sagaRepository;
    private final ProfileService profileService;
    private final MessageRepository messageRepository;
    private final RestTemplate restTemplate;

    public void startDeletionSaga(String userId) {
        UserDeletionSaga saga = sagaRepository.findByUserId(userId).orElseGet(() -> {
            UserDeletionSaga s = UserDeletionSaga.builder()
                    .userId(userId)
                    .status("IN_PROGRESS")
                    .lastCompletedStep("INIT")
                    .build();
            return sagaRepository.save(s);
        });

        if ("COMPLETED".equals(saga.getStatus())) {
            log.info("Saga already completed for user {}", userId);
            return;
        }

        try {
            resumeSaga(saga);
        } catch (Exception e) {
            log.error("Saga deletion failed continuously for user {}: {}", userId, e.getMessage());
            saga.setStatus("FAILED");
            sagaRepository.save(saga);
        }
    }

    public void resumeSaga(UserDeletionSaga saga) {
        String userId = saga.getUserId();

        if (stepPending(saga, "INIT")) {
            executeStepAuth(userId);
            updateSagaStep(saga, "AUTH_WIPED");
        }

        if (stepPending(saga, "AUTH_WIPED")) {
            executeStepJobs(userId);
            updateSagaStep(saga, "JOBS_WIPED");
        }

        if (stepPending(saga, "JOBS_WIPED")) {
            executeStepPosts(userId);
            updateSagaStep(saga, "POSTS_WIPED");
        }

        if (stepPending(saga, "POSTS_WIPED")) {
            executeStepMentorships(userId);
            updateSagaStep(saga, "MENTOR_WIPED");
        }

        if (stepPending(saga, "MENTOR_WIPED")) {
            executeStepMessages(userId);
            updateSagaStep(saga, "MESSAGES_WIPED");
        }

        if (stepPending(saga, "MESSAGES_WIPED")) {
            profileService.softDeleteProfile(userId); // Local soft delete
            updateSagaStep(saga, "COMPLETED");
        }

        saga.setStatus("COMPLETED");
        sagaRepository.save(saga);
    }

    private boolean stepPending(UserDeletionSaga saga, String stepRequired) {
        return saga.getLastCompletedStep().equals(stepRequired);
    }

    private void updateSagaStep(UserDeletionSaga saga, String newStep) {
        saga.setLastCompletedStep(newStep);
        sagaRepository.save(saga);
        log.info("Saga updated to step: {} for user: {}", newStep, saga.getUserId());
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void executeStepAuth(String userId) {
        // Soft delete auth identity natively via inter-service HTTP
        restTemplate.exchange("http://auth-service:8081/api/v1/auth/admin/users/" + userId, HttpMethod.DELETE, null, Void.class);
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void executeStepJobs(String userId) {
        restTemplate.exchange("http://job-service:8083/api/v1/jobs/users/" + userId + "/cascade", HttpMethod.DELETE, null, Void.class);
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void executeStepPosts(String userId) {
        try {
            restTemplate.exchange("http://post-service:8084/api/v1/posts/users/" + userId + "/cascade", HttpMethod.DELETE, null, Void.class);
        } catch(Exception e) {
            log.warn("Posts WIP: {} ", e.getMessage());
        }
    }

    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void executeStepMentorships(String userId) {
         try {
             restTemplate.exchange("http://mentorship-service:8085/api/v1/mentorships/users/" + userId + "/cascade", HttpMethod.DELETE, null, Void.class);
         } catch(Exception e) {
             log.warn("Mentorships WIP: {} ", e.getMessage());
         }
    }

    @Transactional
    public void executeStepMessages(String userId) {
        messageRepository.deleteBySenderId(userId);
        messageRepository.deleteByReceiverId(userId);
    }
}
