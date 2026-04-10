package com.gradsync.events.repository;

import com.gradsync.events.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByType(String type);
    List<Event> findByFeaturedTrue();
}
