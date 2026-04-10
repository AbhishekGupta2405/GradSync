package com.gradsync.post.repository;
import com.gradsync.post.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    long countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, String userId);
    Optional<PostLike> findByPostIdAndUserId(Long postId, String userId);
    void deleteByPostId(Long postId);
}
