package com.gradsync.user.repository;

import com.gradsync.user.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :user1 AND m.receiverId = :user2) OR " +
           "(m.senderId = :user2 AND m.receiverId = :user1) " +
           "ORDER BY m.timestamp ASC")
    List<Message> findConversationBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);

    @Query("SELECT m FROM Message m WHERE m.id IN (" +
           "  SELECT MAX(m2.id) FROM Message m2 " +
           "  WHERE m2.senderId = :userId OR m2.receiverId = :userId " +
           "  GROUP BY CASE WHEN m2.senderId = :userId THEN m2.receiverId ELSE m2.senderId END" +
           ") ORDER BY m.timestamp DESC")
    List<Message> findLatestMessagesByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    long countUnreadMessages(@Param("userId") String userId);

    void deleteBySenderId(String senderId);
    void deleteByReceiverId(String receiverId);
}
