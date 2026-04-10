package com.gradsync.events.controller;

import com.gradsync.events.entity.Event;
import com.gradsync.events.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventRepository.save(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setDate(updatedEvent.getDate());
            event.setTime(updatedEvent.getTime());
            event.setLocation(updatedEvent.getLocation());
            event.setType(updatedEvent.getType());
            event.setCategory(updatedEvent.getCategory());
            event.setPrice(updatedEvent.getPrice());
            event.setCapacity(updatedEvent.getCapacity());
            event.setImage(updatedEvent.getImage());
            event.setFeatured(updatedEvent.getFeatured());
            event.setOrganizerName(updatedEvent.getOrganizerName());
            event.setOrganizerAvatar(updatedEvent.getOrganizerAvatar());
            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/register")
    public ResponseEntity<Event> registerForEvent(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            if (event.getRegistered() == null) {
                event.setRegistered(0);
            }
            if (event.getCapacity() == null || event.getRegistered() < event.getCapacity()) {
                event.setRegistered(event.getRegistered() + 1);
                return ResponseEntity.ok(eventRepository.save(event));
            }
            return ResponseEntity.badRequest().body(event); // Capacity full
        }).orElse(ResponseEntity.notFound().build());
    }
}
