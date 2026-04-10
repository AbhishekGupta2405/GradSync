package com.gradsync.auth.service;

import com.gradsync.auth.dto.AuthenticationResponse;
import com.gradsync.auth.dto.LinkedInCallbackRequest;
import com.gradsync.auth.dto.LinkedInUserInfo;
import com.gradsync.auth.entity.Role;
import com.gradsync.auth.entity.User;
import com.gradsync.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkedInOAuthService {

    @Value("${linkedin.client-id}")
    private String clientId;

    @Value("${linkedin.client-secret}")
    private String clientSecret;

    @Value("${linkedin.redirect-uri}")
    private String redirectUri;

    @Value("${linkedin.authorization-url}")
    private String authorizationUrl;

    @Value("${linkedin.token-url}")
    private String tokenUrl;

    @Value("${linkedin.userinfo-url}")
    private String userinfoUrl;

    @Value("${linkedin.scopes}")
    private String scopes;

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final WebClient webClient = WebClient.builder().build();

    public Map<String, String> getAuthorizationUrl(String role) {
        String state = role != null ? role.toUpperCase() : "STUDENT";
        String url = String.format("%s?response_type=code&client_id=%s&redirect_uri=%s&state=%s&scope=%s",
                authorizationUrl, clientId, redirectUri, state, scopes);
        return Map.of("authUrl", url);
    }

    public AuthenticationResponse handleCallback(LinkedInCallbackRequest request) {
        try {
            // 1. Exchange code for access token
            Map<String, Object> tokenResponse = webClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(String.format("grant_type=authorization_code&code=%s&client_id=%s&client_secret=%s&redirect_uri=%s",
                            request.getCode(), clientId, clientSecret, redirectUri))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
                throw new RuntimeException("Failed to retrieve access token from LinkedIn");
            }

            String accessToken = (String) tokenResponse.get("access_token");

            // 2. Fetch User Info
            LinkedInUserInfo userInfo = webClient.get()
                    .uri(userinfoUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(LinkedInUserInfo.class)
                    .block();

            if (userInfo == null || userInfo.getSub() == null) {
                throw new RuntimeException("Failed to retrieve user info from LinkedIn");
            }

            // 3. Find or Create User
            Optional<User> existingUserByLinkedinId = userRepository.findByLinkedinId(userInfo.getSub());
            
            User user;
            boolean isNewUser = false;

            if (existingUserByLinkedinId.isPresent()) {
                user = existingUserByLinkedinId.get();
            } else {
                // Check if user exists with the same email (if linkedinId is absent)
                Optional<User> existingUserByEmail = userRepository.findByEmail(userInfo.getEmail());

                if (existingUserByEmail.isPresent()) {
                    user = existingUserByEmail.get();
                    // Link the account with LinkedIn
                    user.setLinkedinId(userInfo.getSub());
                    user = userRepository.save(user);
                } else {
                    // Create new user
                    isNewUser = true;
                    Role userRole = Role.STUDENT; // default
                    if (request.getRole() != null) {
                        try {
                            userRole = Role.valueOf(request.getRole().toUpperCase());
                        } catch (IllegalArgumentException e) {
                            log.warn("Invalid role provided: {}", request.getRole());
                        }
                    }

                    user = User.builder()
                            .email(userInfo.getEmail())
                            .linkedinId(userInfo.getSub())
                            .authProvider("LINKEDIN")
                            // Generating a random secure password for LinkedIn users as they don't need one
                            .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .role(userRole)
                            .isVerified(true) // Trust LinkedIn's verification
                            .build();

                    user = userRepository.save(user);
                }
            }

            if (user.isDeleted() || (!user.isVerified() && user.getRole() != Role.ADMIN)) {
                 throw new RuntimeException("ACCOUNT_DISABLED");
            }

            // 4. Generate JWT
            String jwtToken = jwtService.generateToken(user);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .email(user.getEmail())
                    .role(user.getRole())
                    .userId(user.getId())
                    .newUser(isNewUser)
                    .linkedinPictureUrl(userInfo.getPicture())
                    .build();

        } catch (Exception e) {
            log.error("Error during LinkedIn authentication: ", e);
            throw new RuntimeException("LinkedIn authentication failed: " + e.getMessage());
        }
    }
}
