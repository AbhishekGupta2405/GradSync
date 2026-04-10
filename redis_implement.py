import os
import re

print("Starting Redis integration...")

# 1. Update docker-compose.yml
dc_path = r"d:\Gradsync\gradsync-backend\docker-compose.yml"
with open(dc_path, "r") as f:
    dc = f.read()

if "redis-cache:" not in dc:
    redis_container = """
  # Cache (Redis)
  # Used for API Gateway Rate Limiting to prevent DDoS
  redis-cache:
    image: redis:alpine
    container_name: gradsync-redis
    ports:
      - "6379:6379"
    networks:
      - gradsync-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 4. API Gateway (BFF)"""
    dc = re.sub(r'\s*# 4\. API Gateway \(BFF\)', redis_container, dc)
    
    # Add redis dependence in gateway
    dc = re.sub(r'(api-gateway:.*?depends_on:)', r'\1\n      redis-cache:\n        condition: service_healthy', dc, flags=re.DOTALL)
    
    # Add environment variable to gateway
    env_vars = """    environment:
      - SPRING_DATA_REDIS_HOST=redis-cache
      - SPRING_DATA_REDIS_PORT=6379"""
    dc = re.sub(r'(api-gateway:.*?ports:\n      - "8080:8080")', r'\1\n' + env_vars, dc, flags=re.DOTALL)

with open(dc_path, "w") as f:
    f.write(dc)
print("Updated docker-compose.yml")


# 2. Update pom.xml
pom_path = r"d:\Gradsync\gradsync-backend\api-gateway\pom.xml"
with open(pom_path, "r") as f:
    pom = f.read()

if "spring-boot-starter-data-redis-reactive" not in pom:
    redis_dep = """        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
        </dependency>
        
        <!-- JWT Dependencies -->"""
    pom = pom.replace("        <!-- JWT Dependencies -->", redis_dep)

with open(pom_path, "w") as f:
    f.write(pom)
print("Updated API Gateway pom.xml")


# 3. Update application.yml
yml_path = r"d:\Gradsync\gradsync-backend\api-gateway\src\main\resources\application.yml"
with open(yml_path, "r") as f:
    yml = f.read()

if "redis-rate-limiter" not in yml:
    redis_yml = """spring:
  application:
    name: api-gateway
  data:
    redis:
      host: ${SPRING_DATA_REDIS_HOST:localhost}
      port: ${SPRING_DATA_REDIS_PORT:6379}"""
    
    yml = yml.replace("""spring:
  application:
    name: api-gateway""", redis_yml)

    # Attach to auth-service route
    rate_limiter = """          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 5
                redis-rate-limiter.burstCapacity: 10
                key-resolver: "#{@ipKeyResolver}"
                
        # User Service Route"""
    
    yml = re.sub(r'(\s*-\s*Path=/api/v1/auth/\*\*\s*)\n\s*# User Service Route', r'\1\n' + rate_limiter, yml, flags=re.DOTALL)

with open(yml_path, "w") as f:
    f.write(yml)
print("Updated application.yml")


# 4. Update ApiGatewayApplication.java
app_java = r"d:\Gradsync\gradsync-backend\api-gateway\src\main\java\com\gradsync\gateway\ApiGatewayApplication.java"
with open(app_java, "r") as f:
    java = f.read()

if "ipKeyResolver" not in java:
    java = java.replace("import org.springframework.boot.autoconfigure.SpringBootApplication;", """import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;""")
    
    java = java.replace("    public static void main(String[] args) {", """    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getRemoteAddress() != null
                        ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                        : "unknown"
        );
    }

    public static void main(String[] args) {""")

with open(app_java, "w") as f:
    f.write(java)
print("Updated ApiGatewayApplication.java")

print("Implementation complete.")
