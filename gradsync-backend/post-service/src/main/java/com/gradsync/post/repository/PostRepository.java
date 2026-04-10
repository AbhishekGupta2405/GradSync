package com.gradsync.post.repository;

import com.gradsync.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    void deleteByAuthorId(String authorId);
}
