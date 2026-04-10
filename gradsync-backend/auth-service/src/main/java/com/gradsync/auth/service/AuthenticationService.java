package com.gradsync.auth.service;

import com.gradsync.auth.dto.AuthenticationRequest;
import com.gradsync.auth.dto.AuthenticationResponse;
import com.gradsync.auth.dto.RegisterRequest;
import com.gradsync.auth.entity.Role;
import com.gradsync.auth.entity.User;
import com.gradsync.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if(repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .isVerified(false)
                .build();
                
        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .userId(savedUser.getId())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            throw new RuntimeException("ACCOUNT_DISABLED");
        }
        
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
                
        var jwtToken = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }
}
