#  Mahat Commercial Bank – Full-Stack Banking Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-purple.svg)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A complete, production-ready digital banking platform** built with Spring Boot, React, and React Native. Simulates real banking operations including account management, fund transfers, loan processing, and administrative controls.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Mobile App Screens](#-mobile-app-screens)
- [Testing](#-testing)
- [Security Features](#-security-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [Acknowledgments](#-acknowledgments)

---

## 🚀 Features

### 🔐 Authentication & Security
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (Customer, Employee, Admin)
- ✅ Secure password hashing with BCrypt
- ✅ Session management and auto-logout
- ✅ CORS configuration for cross-origin requests

### 💳 Account Management
- ✅ Create multiple account types (Savings, Checking, Fixed Deposit)
- ✅ View account details and balances in real-time
- ✅ Account statement generation
- ✅ Real-time balance updates after transactions

### 💸 Transaction System
- ✅ Fund transfers (own bank & other banks)
- ✅ NEFT/RTGS/IMPS simulation
- ✅ Transaction history with advanced filtering
- ✅ Scheduled transactions
- ✅ Transaction limits and approval workflows

### 🏠 Loan Management
- ✅ Loan applications (Home, Auto, Personal, Education, Business)
- ✅ EMI calculator with detailed breakdowns
- ✅ Loan status tracking (Pending, Approved, Rejected, Disbursed)
- ✅ Automated EMI calculations

### 👑 Admin Panel
- ✅ User management (view, update roles, enable/disable)
- ✅ Transaction monitoring and oversight
- ✅ System analytics and reports
- ✅ Role-based access control for admin functions

### 📊 Reports & Analytics
- ✅ CSV export of transactions
- ✅ Total balance and account summaries
- ✅ Transaction history with date/type/status filters

### 📱 Mobile App
- ✅ React Native with Expo
- ✅ Cross-platform (iOS & Android)
- ✅ Biometric login support
- ✅ Push notifications ready
- ✅ Dark mode support

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend** | Java / Spring Boot | 17 / 3.2.3 |
| **Backend Framework** | Spring Security, JPA/Hibernate | - |
| **Frontend** | React / TypeScript | 18 / 5.x |
| **UI Library** | Material-UI | 5.x |
| **Mobile** | React Native (Expo) | 0.72 |
| **Database** | MySQL / PostgreSQL | 8.0 / 15 |
| **Authentication** | JWT, BCrypt | - |
| **API** | RESTful | - |
| **Build Tools** | Maven, npm | - |
| **Testing** | JUnit, Mockito, React Testing Library | - |
| **Containerization** | Docker, Docker Compose | - |

---

## 📁 Project Structure
mahat-bank/
├── backend/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/mahatbank/
│ │ │ │ ├── config/ # Security, JWT, CORS config
│ │ │ │ ├── controller/ # REST endpoints
│ │ │ │ ├── service/ # Business logic
│ │ │ │ ├── repository/ # JPA repositories
│ │ │ │ ├── model/ # Entities
│ │ │ │ ├── dto/ # Data Transfer Objects
│ │ │ │ └── exception/ # Custom exceptions
│ │ │ └── resources/
│ │ │ ├── application.yml
│ │ │ └── db/migration/ # Flyway migrations
│ │ └── test/
│ └── pom.xml
│
├── frontend-web/
│ ├── src/
│ │ ├── pages/ # React pages (Login, Dashboard, etc.)
│ │ ├── components/ # Reusable components
│ │ ├── theme.ts # MUI theme configuration
│ │ └── App.tsx
│ ├── public/
│ └── package.json
│
├── mobile-app/
│ ├── src/
│ │ ├── screens/ # React Native screens
│ │ ├── navigation/ # Navigation configuration
│ │ └── components/ # Reusable mobile components
│ └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md

text

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java | 17+ | [Oracle](https://www.oracle.com/java/technologies/downloads/) / [OpenJDK](https://adoptium.net/) |
| Maven | 3.8+ | [Apache Maven](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [Node.js](https://nodejs.org/) |
| MySQL | 8.0+ | [MySQL](https://dev.mysql.com/downloads/) |
| Docker | Latest | [Docker Desktop](https://www.docker.com/products/docker-desktop/) *(optional)* |

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pm725/mahat-bank.git
cd mahat-bank
2️⃣ Backend Setup
Configure Database
Option A: Using MySQL

bash
# Create database
mysql -u root -p -e "CREATE DATABASE mahatbank;"
Update backend/src/main/resources/application.yml:

yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mahatbank
    username: root
    password: yourpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
Option B: Using Docker (Recommended)

bash
docker-compose up -d postgres
Build and Run
bash
cd backend
mvn clean install
mvn spring-boot:run
✅ The backend will start at: http://localhost:9090/api

3️⃣ Frontend Setup
bash
cd frontend-web
npm install
npm start
✅ The frontend will start at: http://localhost:3000

4️⃣ Mobile App Setup
bash
cd mobile-app
npm install
npx expo start
📱 Scan the QR code with the Expo Go app on your phone.

5️⃣ Docker Setup (Full Stack)
bash
docker-compose up -d
This will start:

PostgreSQL database

Spring Boot backend

React frontend

📊 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT token
POST	/api/auth/logout	Logout user
POST	/api/auth/refresh-token	Refresh JWT token
💳 Accounts
Method	Endpoint	Description
GET	/api/accounts	Get all user accounts
POST	/api/accounts	Create a new account
GET	/api/accounts/{id}	Get account details
GET	/api/accounts/{id}/balance	Get account balance
💸 Transactions
Method	Endpoint	Description
GET	/api/transactions	Get transaction history
POST	/api/transactions/transfer	Transfer funds
GET	/api/transactions/{id}	Get transaction details
GET	/api/transactions/recent	Get recent transactions
🏠 Loans
Method	Endpoint	Description
POST	/api/loans/apply	Apply for a loan
GET	/api/loans	Get all user loans
GET	/api/loans/{id}	Get loan details
POST	/api/loans/calculate-emi	Calculate EMI
👑 Admin
Method	Endpoint	Description
GET	/api/admin/users	Get all users
PUT	/api/admin/users/{id}/role	Update user role
PUT	/api/admin/users/{id}/status	Enable/disable user
GET	/api/admin/stats	Get system statistics
📊 Reports
Method	Endpoint	Description
GET	/api/reports/transactions/csv	Download CSV report
📱 Mobile App Screens
Screen	Description
Login	Email/password login with biometric support
Dashboard	Balance overview, quick actions, recent transactions
Accounts	View all accounts with balances and types
Transfer	Fund transfer with multiple transaction types
History	Transaction history with filters (date, type, status)
Loans	Apply for loans, view status and EMI details
Profile	User profile management and settings
🧪 Testing
Backend Tests
bash
cd backend
mvn test
Frontend Tests
bash
cd frontend-web
npm test
🔒 Security Features
Feature	Implementation
Authentication	JWT token-based authentication with refresh tokens
Password Security	BCrypt password hashing
Authorization	Role-based access control (RBAC)
CORS	Configured for frontend and mobile app origins
Validation	Input validation on all request payloads
SQL Injection	JPA/Hibernate parameterized queries
XSS Protection	Spring Security built-in protection
Session	Stateless session management
🗺️ Roadmap
✅ Completed
☑ User Authentication & Authorization
☑ Account Management (CRUD)
☑ Fund Transfers (NEFT/RTGS/IMPS)
☑ Loan Management
☑ Admin Panel
☑ Transaction History & Reports (CSV)
☑ React Frontend (Full UI)
☑ React Native Mobile App
🚧 In Progress
□ Two-Factor Authentication (2FA)
□ Payment Gateway Integration
□ Push Notifications
📅 Planned
□ PDF Reports
□ Statement Email Service
□ Advanced Analytics Dashboard
□ Currency Exchange Module
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch: git checkout -b feature/AmazingFeature

Commit your changes: git commit -m 'Add some AmazingFeature'

Push to the branch: git push origin feature/AmazingFeature

Open a Pull Request

Coding Standards
Follow Java/React/TypeScript best practices

Write tests for new features

Update documentation accordingly

👥 Authors
Name	Role	GitHub
Priyanshu Mahat	Full-Stack Developer	@pm725
🙏 Acknowledgments
Spring Boot Team – For the amazing framework

React & Material-UI Communities – For the excellent frontend tools

React Native Team – For cross-platform mobile development

All Open-Source Contributors – Whose libraries made this project possibl
