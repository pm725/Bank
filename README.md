# 🏦 Mahat Commercial Bank — Full-Stack Banking Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-oriented digital banking platform built with Spring Boot, React, and React Native. It demonstrates account management, secure authentication, transactions, loan processing, and an admin panel suited for development and demo purposes.

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment configuration](#environment-configuration)
  - [Run locally](#run-locally)
  - [Docker (optional)](#docker-optional)
- [API endpoints](#api-endpoints)
- [Security considerations](#security-considerations)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Authors & support](#authors--support)

---

## Features
- Authentication & security
  - JWT-based authentication with refresh tokens and role-based access (Customer, Employee, Admin)
  - Secure password hashing (BCrypt)
  - Session management with auto-logout
- Account management
  - Multiple account types (Savings, Checking, Fixed Deposit)
  - Account statements and balance views
- Transactions
  - Fund transfers (intra-bank and inter-bank simulation)
  - Scheduled transactions, limits and approval workflows
  - Transaction history with filters and CSV export
- Loan management
  - Loan application flows, EMI calculation and status tracking
- Admin panel
  - User & role management, monitoring, system stats
- Mobile app (React Native)
  - Biometric login, push notifications support, dark mode

---

## Tech stack
- Backend: Java 17, Spring Boot 3.2.3, Spring Security, JPA/Hibernate
- Frontend: React 18, TypeScript, Material-UI 5, Tailwind CSS
- Mobile: React Native (Expo)
- Database: MySQL 8.0 (or PostgreSQL)
- Auth: JWT, BCrypt
- API: REST
- Build: Maven, npm
- CI/CD: Docker, GitHub Actions
- Testing: JUnit, Mockito, React Testing Library

---

## Project structure
mahat-bank/
├── backend/                # Spring Boot service
│   ├── src/main/java/...
│   └── pom.xml
├── frontend-web/           # React web app
│   └── package.json
├── mobile-app/             # React Native (Expo)
│   └── package.json
├── docker-compose.yml
└── README.md

---

## Getting started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0 or PostgreSQL
- Docker (optional)

### Clone repository
```bash
git clone https://github.com/pm725/Bank.git
cd Bank
```

### Environment configuration
Create an `.env` (or provide environment vars) for local development. Example `.env`:
```env
# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/mahatbank
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SERVER_PORT=9090

# JWT
JWT_SECRET=replace-with-a-strong-random-secret
JWT_ACCESS_TOKEN_EXPIRATION_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRATION_DAYS=7
```

Alternatively update `backend/src/main/resources/application.yml` with your values.

### Run backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Backend API: http://localhost:9090/api
```

### Run frontend (web)
```bash
cd frontend-web
npm install
npm start
# Frontend: http://localhost:3000
```

### Run mobile (Expo)
```bash
cd mobile-app
npm install
npx expo start
# Scan QR with Expo Go
```

### Docker (optional)
Use docker-compose to run the app with a local database:

```bash
docker-compose up -d
```

Provide or adapt the `docker-compose.yml` service envs prior to running.

---

## API endpoints (representative)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT tokens |
| POST | /api/auth/refresh | Refresh JWT access token |
| GET | /api/accounts | Get user accounts |
| POST | /api/accounts | Create account |
| GET | /api/accounts/{id}/balance | Get account balance |
| GET | /api/transactions | Transaction history |
| POST | /api/transactions/transfer | Transfer funds |
| POST | /api/loans/apply | Apply for loan |
| GET | /api/admin/users | Admin: list users |
| PUT | /api/admin/users/{id}/role | Admin: update role |
| GET | /api/admin/stats | Admin: system stats |

(Adjust endpoints to match your controllers.)

---

## Security considerations (recommended improvements & checklist)
This project includes several security primitives. Below are suggestions to make production-ready deployments more secure.

Authentication & tokens
- Use HTTPS everywhere (terminate TLS at reverse proxy / load balancer).
- Store JWT secret in a secure secrets manager (do not commit secrets).
- Consider short-lived access tokens + rotating refresh tokens (store refresh tokens server-side or use secure httpOnly cookies).
- Mark authentication cookies as Secure, HttpOnly and SameSite=strict (if using cookies).

Passwords & user accounts
- Enforce password strength and rate-limit authentication endpoints.
- Use BCrypt with a strong work factor (e.g., 10-14 depending on hardware).
- Add multi-factor authentication (2FA) for sensitive roles.

Input validation & protection
- Continue using server-side input validation (DTOs + validation annotations).
- Use parameterized queries / JPA (avoid manual string concatenation) to prevent SQL injection.
- Escape or sanitize content rendered in the UI to prevent XSS; use Content Security Policy (CSP).

API & access control
- Implement fine-grained RBAC checks on endpoints (method-level security).
- Validate authorization on every sensitive action (transfer limits, admin actions).
- Implement audit logging for critical operations (transfers, role changes).

Infrastructure & runtime
- Rate-limit APIs and implement IP-based throttling.
- Monitor logs and add alerts for suspicious behavior (multiple failed logins, large transfers).
- Keep dependencies up-to-date and run automated dependency scanning (Dependabot / Snyk).
- Use secure defaults for CORS: allow only known origins and restrict methods/headers.

Data protection
- Mask or encrypt sensitive data at rest or in logs.
- Revoke old refresh tokens on logout or password changes.
- Implement session invalidation after role changes or sensitive operations.

Notes:
- Sample accounts in this repo are for development only. Never ship default passwords or secrets in production.

---

## Testing
Backend:
```bash
cd backend
mvn test
```
Frontend:
```bash
cd frontend-web
npm test
```
Add integration and contract tests for critical flows (authentication, transfers, edge cases).

---

## Roadmap
Planned items:
- [ ] Two-Factor Authentication (2FA)
- [ ] Payment gateway integration
- [ ] Push notifications for transfers
- [ ] PDF reports & statement downloads
- [ ] Harden refresh-token strategy (rotation + revocation list)

---

## Contributing
1. Fork the repo
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit: git commit -m "Add feature"
4. Push: git push origin feature/your-feature
5. Open a Pull Request describing the change

Please follow the repository coding standards and add tests for new features.

---

## License
This project is licensed under the MIT License — see the LICENSE file for details.

---

## Authors & support
Mahat Commercial Bank — initial implementation

For support, open an issue or email support@mahatbank.com (replace with a real support channel for production use).

Built with ❤️ for demonstration and learning purposes.
