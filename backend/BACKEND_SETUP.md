# Spring Boot + MySQL Backend Setup Guide

## Project Structure

```
backend/
├── pom.xml                          # Maven dependencies
├── src/
│   ├── main/
│   │   ├── java/com/templatemart/
│   │   │   ├── TemplateMarktApplication.java    # Main Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   └── AppConfig.java              # Spring configuration, CORS, Razorpay
│   │   │   ├── controller/
│   │   │   │   ├── TemplateController.java     # REST endpoints for templates
│   │   │   │   ├── PaymentController.java      # REST endpoints for payments
│   │   │   │   └── UserPageController.java     # REST endpoints for user pages
│   │   │   ├── service/
│   │   │   │   ├── TemplateService.java        # Template business logic
│   │   │   │   ├── PaymentService.java         # Payment & Razorpay logic
│   │   │   │   └── UserPageService.java        # User page business logic
│   │   │   ├── repository/
│   │   │   │   ├── TemplateRepository.java
│   │   │   │   ├── UserPageRepository.java
│   │   │   │   ├── PaymentRepository.java
│   │   │   │   ├── TemplateRequestRepository.java
│   │   │   │   └── AdminUserRepository.java
│   │   │   ├── entity/
│   │   │   │   ├── Template.java
│   │   │   │   ├── UserPage.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── TemplateRequest.java
│   │   │   │   └── AdminUser.java
│   │   │   └── dto/
│   │   │       ├── TemplateDTO.java
│   │   │       ├── UserPageDTO.java
│   │   │       └── PaymentDTOs.java
│   │   └── resources/
│   │       └── application.properties         # Database & server config
│   └── test/                                   # Unit tests
└── README.md
```

## Prerequisites

### System Requirements
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.8.0 or higher

### Install Java 17

**Windows (using Chocolatey):**
```bash
choco install openjdk17
```

**macOS:**
```bash
brew install openjdk@17
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install openjdk-17-jdk
```

### Install MySQL

**Windows:**
```bash
choco install mysql
mysql --version
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### Install Maven

**Windows:**
```bash
choco install maven
```

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt-get install maven
```

## Setup Instructions

### Step 1: Navigate to Backend Directory

```bash
cd craft1/backend
```

### Step 2: Set Up MySQL Database

Create the database and tables:

```bash
mysql -u root -p < ../../setup-mysql.sh
```

Or manually:

```sql
CREATE DATABASE IF NOT EXISTS templatemart;

USE templatemart;

-- Copy all CREATE TABLE statements from setup-mysql.sh
```

### Step 3: Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=templatemart
DB_USER=root
DB_PASSWORD=your_mysql_password

# Server Configuration
SERVER_PORT=8080

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Or update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/templatemart?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password

razorpay.key-id=your_razorpay_key_id
razorpay.key-secret=your_razorpay_key_secret

app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Step 4: Build the Project

```bash
mvn clean package
```

### Step 5: Run the Application

```bash
mvn spring-boot:run
```

Or run the JAR directly:

```bash
java -jar target/templatemart-backend-1.0.0.jar
```

The backend will be available at: `http://localhost:8080/api`

## API Endpoints

### Templates API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Get all active templates |
| GET | `/api/templates/{id}` | Get template by ID |
| GET | `/api/templates/type/{type}` | Filter by type (simple/complex) |
| GET | `/api/templates/category/{category}` | Filter by category |
| GET | `/api/templates/search?q=query` | Search templates |
| POST | `/api/templates` | Create new template |
| PUT | `/api/templates/{id}` | Update template |
| DELETE | `/api/templates/{id}` | Delete template |
| PATCH | `/api/templates/{id}/toggle-active` | Toggle active status |

### Payments API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify-payment` | Verify payment signature |

**Create Order Request:**
```json
{
  "template_id": "uuid",
  "amount": 299,
  "user_name": "John Doe",
  "user_email": "john@example.com"
}
```

**Verify Payment Request:**
```json
{
  "razorpay_order_id": "order_123...",
  "razorpay_payment_id": "pay_456...",
  "razorpay_signature": "sig_789...",
  "user_data": {"name": "John", "message": "..."},
  "user_name": "John Doe",
  "user_email": "john@example.com"
}
```

### Pages API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages/{slugOrId}` | Get page by slug or ID |
| GET | `/api/pages/id/{id}` | Get page by ID |
| GET | `/api/pages/slug/{slug}` | Get page by slug |
| GET | `/api/pages/user/{email}` | Get all pages for user |
| POST | `/api/pages/{id}/view` | Increment view count |
| DELETE | `/api/pages/{id}` | Deactivate page |

## Database Schema

### Templates Table
```sql
CREATE TABLE templates (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('SIMPLE', 'COMPLEX') NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2),
  config JSON,
  preview_url LONGTEXT,
  preview_type ENUM('IMAGE', 'VIDEO', 'IFRAME') DEFAULT 'IMAGE',
  component_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  features JSON,
  demo_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  template_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('CREATED', 'PENDING', 'SUCCESSFUL', 'FAILED') DEFAULT 'CREATED',
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  page_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (template_id) REFERENCES templates(id),
  INDEX idx_order (razorpay_order_id),
  INDEX idx_status (status)
);
```

## Spring Boot Dependencies

Key dependencies in `pom.xml`:

- **spring-boot-starter-web**: REST API framework
- **spring-boot-starter-data-jpa**: ORM with Hibernate
- **mysql-connector-java**: MySQL JDBC driver
- **razorpay-java**: Razorpay payment SDK
- **commons-codec**: For HMAC signature verification
- **lombok**: Boilerplate code reduction
- **spring-boot-devtools**: Hot reload during development

## Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=TemplateServiceTest

# Run with coverage
mvn test jacoco:report
```

## Docker Support (Optional)

Create `Dockerfile`:

```dockerfile
FROM openjdk:17-alpine
COPY target/templatemart-backend-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run:

```bash
docker build -t templatemart-backend .
docker run -p 8080:8080 -e DB_HOST=host.docker.internal templatemart-backend
```

## Connecting Frontend to Backend

Update React frontend `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

Update API calls in React components:

```typescript
// Before: Using Supabase
// const response = await supabase.from('templates').select();

// After: Using Spring Boot API
const response = await fetch('/api/templates', {
  headers: { 'Content-Type': 'application/json' }
});
const templates = await response.json();
```

## Troubleshooting

### MySQL Connection Error
```
Error: Communications link failure
```
**Solution:** Ensure MySQL is running
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80
```

### Port Already in Use
```
Error: Address already in use: 8080
```
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Missing Razorpay Keys
```
Error: razorpay.key-id or razorpay.key-secret not configured
```
**Solution:** Set environment variables or update `application.properties`

## Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create templatemart-api

# Add MySQL database addon
heroku addons:create cleardb:ignite

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS (EC2)

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Java and Maven
sudo yum update -y
sudo yum install java-17-amazon-corretto maven -y

# Clone repository
git clone your-repo.git
cd your-repo/backend

# Build and run
mvn clean package
java -jar target/templatemart-backend-1.0.0.jar
```

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Docs](https://spring.io/projects/spring-data-jpa)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Razorpay Java SDK](https://github.com/razorpay/razorpay-java)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)

---

Built with Spring Boot 3.2.0, Java 17, and MySQL 8.0
