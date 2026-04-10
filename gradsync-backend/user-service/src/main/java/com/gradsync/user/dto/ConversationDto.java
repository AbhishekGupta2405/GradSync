package com.gradsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDto {
    private ProfileDto connectedUser;
    private MessageDto lastMessage;
    private long unreadCount;
}
