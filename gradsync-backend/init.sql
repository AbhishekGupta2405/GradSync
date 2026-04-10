-- Initialize databases for all microservices

-- 1. Auth Service Database
CREATE DATABASE IF NOT EXISTS gradsync_auth_db;

-- 2. User Service Database
CREATE DATABASE IF NOT EXISTS gradsync_user_db;

-- 3. Job Service Database
CREATE DATABASE IF NOT EXISTS gradsync_job_db;

-- 4. Post Service Database
CREATE DATABASE IF NOT EXISTS gradsync_post_db;

-- 6. Notification Service Database
CREATE DATABASE IF NOT EXISTS gradsync_notification_db;

-- 7. Stats Service Database
CREATE DATABASE IF NOT EXISTS gradsync_stats_db;


-- Grant privileges (gradsync_user is created by Docker environment variables)
GRANT ALL PRIVILEGES ON gradsync_auth_db.* TO 'gradsync_user'@'%';
GRANT ALL PRIVILEGES ON gradsync_user_db.* TO 'gradsync_user'@'%';
GRANT ALL PRIVILEGES ON gradsync_job_db.* TO 'gradsync_user'@'%';
GRANT ALL PRIVILEGES ON gradsync_post_db.* TO 'gradsync_user'@'%';
GRANT ALL PRIVILEGES ON gradsync_notification_db.* TO 'gradsync_user'@'%';
GRANT ALL PRIVILEGES ON gradsync_stats_db.* TO 'gradsync_user'@'%';

FLUSH PRIVILEGES;
