package com.gradsync.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorId; // User ID from Auth Service

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String category; // NORMAL, EVENT, ANNOUNCEMENT

    @Column(length = 500)
    private String link;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
