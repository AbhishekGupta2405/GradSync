package com.gradsync.user.controller;

import com.gradsync.user.dto.ConversationDto;
import com.gradsync.user.dto.MessageDto;
import com.gradsync.user.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody Map<String, String> payload) {
        String senderId = payload.get("senderId");
        String receiverId = payload.get("receiverId");
        String content = payload.get("content");
        String fileUrl = payload.get("fileUrl");
        String fileName = payload.get("fileName");
        String fileType = payload.get("fileType");
        
        MessageDto msg = messageService.sendMessage(senderId, receiverId, content, fileUrl, fileName, fileType);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/conversation/{user1}/{user2}")
    public ResponseEntity<List<MessageDto>> getConversation(@PathVariable String user1, @PathVariable String user2) {
        return ResponseEntity.ok(messageService.getConversation(user1, user2));
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationDto>> getConversations(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.getUserConversations(userId));
    }

    @PutMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<Void> markAsRead(@PathVariable String senderId, @PathVariable String receiverId) {
        messageService.markAsRead(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String userId) {
        long count = messageService.getUnreadMessagesCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
