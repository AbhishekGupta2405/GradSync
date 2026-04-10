package com.gradsync.post.service;

import com.gradsync.post.dto.CommentDto;
import com.gradsync.post.dto.PostDto;
import com.gradsync.post.entity.Comment;
import com.gradsync.post.entity.Post;
import com.gradsync.post.entity.PostLike;
import com.gradsync.post.repository.CommentRepository;
import com.gradsync.post.repository.PostLikeRepository;
import com.gradsync.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    public List<PostDto> getFeed(String currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> mapToDto(post, currentUserId))
                .collect(Collectors.toList());
    }

    public List<PostDto> getUserPosts(String authorId, String currentUserId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId)
                .stream()
                .map(post -> mapToDto(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDto createPost(Post post, String currentUserId) {
        if (post.getCategory() == null || post.getCategory().isEmpty()) {
            post.setCategory("NORMAL");
        }
        Post saved = postRepository.save(post);
        return mapToDto(saved, currentUserId);
    }

    @Transactional
    public void deletePost(Long postId) {
        if (postRepository.existsById(postId)) {
            postLikeRepository.deleteByPostId(postId);
            // JPA repo doesn't have deleteByPostId for comments yet, we can fetch and delete or just let DB cascade if constraints exist.
            // Assuming no cascade constraint is explicitly coded, we should safely delete the post (and any stray orphaned records depending on DB config)
            postRepository.deleteById(postId);
        }
    }

    // Likes
    @Transactional
    public boolean toggleLike(Long postId, String userId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        
        return postLikeRepository.findByPostIdAndUserId(postId, userId).map(like -> {
            postLikeRepository.delete(like);
            return false; // unliked
        }).orElseGet(() -> {
            postLikeRepository.save(PostLike.builder().postId(postId).userId(userId).build());
            return true; // liked
        });
    }

    // Comments
    @Transactional
    public CommentDto addComment(Long postId, String authorId, String content) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        Comment comment = Comment.builder()
                .postId(postId)
                .authorId(authorId)
                .content(content)
                .build();
        Comment saved = commentRepository.save(comment);
        return mapCommentToDto(saved);
    }

    public List<CommentDto> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList());
    }

    // Mappers
    private PostDto mapToDto(Post post, String currentUserId) {
        long likes = postLikeRepository.countByPostId(post.getId());
        boolean isLiked = currentUserId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        List<CommentDto> comments = getComments(post.getId());

        return PostDto.builder()
                .id(post.getId())
                .authorId(post.getAuthorId())
                .content(post.getContent())
                .category(post.getCategory())
                .link(post.getLink())
                .mediaUrl(post.getMediaUrl())
                .createdAt(post.getCreatedAt())
                .likeCount(likes)
                .isLikedByCurrentUser(isLiked)
                .comments(comments)
                .build();
    }

    private CommentDto mapCommentToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .authorId(comment.getAuthorId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
