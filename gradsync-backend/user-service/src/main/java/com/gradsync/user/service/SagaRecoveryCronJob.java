package com.gradsync.user.service;

import com.gradsync.user.entity.UserDeletionSaga;
import com.gradsync.user.repository.UserDeletionSagaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SagaRecoveryCronJob {

    private final UserDeletionSagaRepository sagaRepository;
    private final UserDeletionService userDeletionService;

    @Scheduled(fixedDelay = 60000) // Runs every 60 seconds
    public void recoverFailedSagas() {
        List<UserDeletionSaga> failedSagas = sagaRepository.findByStatus("FAILED");
        if (!failedSagas.isEmpty()) {
            log.info("Saga Recovery Engine detected {} failed sagas. Attempting recovery...", failedSagas.size());
            for (UserDeletionSaga saga : failedSagas) {
                log.info("Resuming Saga for user: {} from step: {}", saga.getUserId(), saga.getLastCompletedStep());
                try {
                    saga.setStatus("IN_PROGRESS");
                    sagaRepository.save(saga);
                    userDeletionService.resumeSaga(saga);
                } catch (Exception e) {
                    log.error("Saga Recovery failed again for user: {}", saga.getUserId(), e);
                    saga.setStatus("FAILED");
                    sagaRepository.save(saga);
                }
            }
        }
    }
}
