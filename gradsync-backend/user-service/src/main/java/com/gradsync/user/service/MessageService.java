package com.gradsync.user.service;

import com.gradsync.user.dto.ConversationDto;
import com.gradsync.user.dto.MessageDto;
import com.gradsync.user.dto.ProfileDto;
import com.gradsync.user.entity.Message;
import com.gradsync.user.entity.Profile;
import com.gradsync.user.repository.MessageRepository;
import com.gradsync.user.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ProfileRepository profileRepository;
    private final S3Service s3Service;

    public MessageDto sendMessage(String senderId, String receiverId, String content,
                                   String fileUrl, String fileName, String fileType) {
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .isRead(false)
                .build();
        message = messageRepository.save(message);
        return mapToDto(message);
    }

    public List<MessageDto> getConversation(String user1, String user2) {
        return messageRepository.findConversationBetweenUsers(user1, user2)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ConversationDto> getUserConversations(String userId) {
        List<Message> latestMessages = messageRepository.findLatestMessagesByUserId(userId);
        return latestMessages.stream().map(msg -> {
            String otherUserId = msg.getSenderId().equals(userId) ? msg.getReceiverId() : msg.getSenderId();
            Profile otherProfile = profileRepository.findById(otherUserId).orElse(null);
            
            ProfileDto profileDto = null;
            if (otherProfile != null) {
                profileDto = ProfileDto.builder()
                        .userId(otherProfile.getUserId())
                        .firstName(otherProfile.getFirstName())
                        .lastName(otherProfile.getLastName())
                        .headline(otherProfile.getHeadline())
                        .profileImageUrl(s3Service.generatePresignedUrl(otherProfile.getProfileImageUrl()))
                        .location(otherProfile.getLocation())
                        .branch(otherProfile.getBranch())
                        .role(otherProfile.getRole() != null ? otherProfile.getRole() : null)
                        .build();
            }
            
            return ConversationDto.builder()
                    .connectedUser(profileDto)
                    .lastMessage(mapToDto(msg))
                    .unreadCount(0)
                    .build();
        }).collect(Collectors.toList());
    }

    public void markAsRead(String senderId, String receiverId) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(senderId, receiverId);
        for (Message m : messages) {
            // mark messages sent to the receiver (the one calling this) as read
            if (m.getReceiverId().equals(receiverId) && !m.isRead()) {
                m.setRead(true);
                messageRepository.save(m);
            }
        }
    }

    public long getUnreadMessagesCount(String userId) {
        return messageRepository.countUnreadMessages(userId);
    }

    private MessageDto mapToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .fileUrl(s3Service.generatePresignedUrl(message.getFileUrl()))
                .fileName(message.getFileName())
                .fileType(message.getFileType())
                .isRead(message.isRead())
                .timestamp(message.getTimestamp())
                .build();
    }
}
