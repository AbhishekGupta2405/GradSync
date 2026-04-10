package com.gradsync.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LinkedInUserInfo {
    private String sub;          // LinkedIn user ID
    private String name;         // Full name
    @JsonProperty("given_name")
    private String givenName;    // First name
    @JsonProperty("family_name")
    private String familyName;   // Last name
    private String email;
    @JsonProperty("email_verified")
    private Boolean emailVerified;
    private String picture;      // Profile image URL
}
