package com.gradsync.auth.controller;

import com.gradsync.auth.dto.AuthenticationRequest;
import com.gradsync.auth.dto.AuthenticationResponse;
import com.gradsync.auth.dto.RegisterRequest;
import com.gradsync.auth.dto.LinkedInCallbackRequest;
import com.gradsync.auth.service.AuthenticationService;
import com.gradsync.auth.service.LinkedInOAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;
    private final LinkedInOAuthService linkedInOAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = service.register(request);
        addCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = service.authenticate(request);
        addCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        // If the filter let this request through, the token is valid
        return ResponseEntity.ok("Token is valid");
    }

    @GetMapping("/linkedin/auth-url")
    public ResponseEntity<Map<String, String>> getLinkedInAuthUrl(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(linkedInOAuthService.getAuthorizationUrl(role));
    }

    @PostMapping("/linkedin/callback")
    public ResponseEntity<AuthenticationResponse> linkedInCallback(
            @RequestBody LinkedInCallbackRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authResponse = linkedInOAuthService.handleCallback(request);
        addCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("gradsync_token", "")
                .httpOnly(true)
                .secure(false) // HTTP instead of HTTPS since localhost Vite runs on HTTP
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void addCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("gradsync_token", token)
                .httpOnly(true)
                .secure(false) // HTTP instead of HTTPS since localhost Vite runs on HTTP
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentialsException(org.springframework.security.authentication.BadCredentialsException ex) {
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        if ("Email already exists".equals(ex.getMessage())) {
            return ResponseEntity.status(409).body(Map.of("message", "This email address is already registered. Please sign in instead."));
        } else if ("ACCOUNT_DISABLED".equals(ex.getMessage())) {
            return ResponseEntity.status(403).body(Map.of("message", "Your account is disabled. Please contact the administrator."));
        }
        return ResponseEntity.status(500).body(Map.of("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred."));
    }
}
