package com.gradsync.gateway.filter;

import com.gradsync.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Routes where authentication is optional: if a token is present it will be
     * validated and the user ID injected; if no token is present the request
     * passes through anonymously. This lets the public feed render while still
     * providing the current-user context for logged-in visitors.
     */
    private static final List<String> optionalAuthPaths = List.of(
            "/api/v1/posts"
    );

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {

            String path = exchange.getRequest().getURI().getPath();
            boolean isOptional = optionalAuthPaths.stream()
                    .anyMatch(path::startsWith);

            if (validator.isSecured.test(exchange.getRequest()) || isOptional) {

                // Extract token from Authorization header or cookie
                String token = null;
                boolean hasAuthHeader = exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION);

                if (hasAuthHeader) {
                    String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        token = authHeader.substring(7);
                    }
                } else if (exchange.getRequest().getCookies().containsKey("gradsync_token")) {
                    token = exchange.getRequest().getCookies().getFirst("gradsync_token").getValue();
                }

                // No token found
                if (token == null || token.isEmpty()) {
                    if (isOptional) {
                        // Optional route — allow anonymous access
                        return chain.filter(exchange);
                    }
                    return onError(exchange, "Missing authorization header or cookie", HttpStatus.UNAUTHORIZED);
                }

                // Validate token
                try {
                    jwtUtil.validateToken(token);

                    String userId = jwtUtil.extractUserId(token);

                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                            .header("X-Logged-In-User", userId)
                            .build();

                    return chain.filter(exchange.mutate().request(mutatedRequest).build());

                } catch (Exception e) {
                    if (isOptional) {
                        // Expired/invalid token on an optional route — pass through anonymously
                        return chain.filter(exchange);
                    }
                    return onError(exchange, "Unauthorized access", HttpStatus.UNAUTHORIZED);
                }
            }

            return chain.filter(exchange);
        });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
    }
}
