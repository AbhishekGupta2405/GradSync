package com.gradsync.auth.dto;

import lombok.Data;

@Data
public class LinkedInCallbackRequest {
    private String code;
    private String role; // Optional, "STUDENT" or "ALUMNI"
}
