package com.gradsync.auth.dto;

import com.gradsync.auth.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private Role role; // Optional, defaults to STUDENT normally
}
