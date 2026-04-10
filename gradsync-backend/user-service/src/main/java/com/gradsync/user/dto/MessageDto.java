package com.gradsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private String senderId;
    private String receiverId;
    private String content;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private boolean isRead;
    private LocalDateTime timestamp;
}
