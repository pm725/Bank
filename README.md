# 🏦 Mahat Commercial Bank – Full-Stack Banking Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A **complete, production-ready digital banking platform** built with Spring Boot, React, and React Native. This project simulates real banking operations including account management, fund transfers, loan processing, and administrative controls.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (Customer, Employee, Admin)
- Secure password hashing with BCrypt
- Session management and auto-logout

### 💳 Account Management
- Create multiple account types (Savings, Checking, Fixed Deposit)
- View account details and balances
- Account statement generation
- Real-time balance updates

### 💸 Transaction System
- Fund transfers (own bank & other banks)
- NEFT/RTGS/IMPS simulation
- Transaction history with advanced filtering
- Scheduled transactions
- Transaction limits and approval workflows

### 🏠 Loan Management
- Loan applications (Home, Auto, Personal, Education, Business)
- EMI calculator with detailed breakdowns
- Loan status tracking (Pending, Approved, Rejected, Disbursed)
- Automated EMI calculations

### 👑 Admin Panel
- User management (view, update roles, enable/disable)
- Transaction monitoring
- System analytics and reports
- Role-based access control

### 📊 Reports & Analytics
- CSV export of transactions
- Total balance and account summaries
- Transaction history with filters

### 📱 Mobile App
- React Native with Expo
- Biometric login support
- Push notifications
- Dark mode support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 17, Spring Boot 3.2.3, Spring Security, JPA/Hibernate |
| **Frontend** | React 18, TypeScript, Material-UI 5, Tailwind CSS |
| **Mobile** | React Native (Expo), React Navigation |
| **Database** | MySQL 8.0 / PostgreSQL (configurable) |
| **Authentication** | JWT, BCrypt |
| **API** | RESTful APIs |
| **Build Tools** | Maven, npm |
| **Testing** | JUnit, Mockito, React Testing Library |
| **CI/CD** | Docker, GitHub Actions |

---

## 📁 Project Structure
mahat-bank/
├── backend/
│ ├── src/main/java/com/mahatbank/
│ │ ├── config/ # Security, JWT, CORS config
│ │ ├── controller/ # REST endpoints
│ │ ├── service/ # Business logic
│ │ ├── repository/ # JPA repositories
│ │ ├── model/ # Entities
│ │ ├── dto/ # Data Transfer Objects
│ │ └── exception/ # Custom exceptions
│ └── pom.xml
│
├── frontend-web/
│ ├── src/
│ │ ├── pages/ # React pages (Login, Dashboard, etc.)
│ │ ├── components/ # Reusable components
│ │ ├── theme.ts # MUI theme configuration
│ │ └── App.tsx
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
└── README.md

text

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **Node.js 18+**
- **MySQL 8.0** or **PostgreSQL**
- **Docker** (optional, for containerized setup)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mahat-bank.git
cd mahat-bank
2. Backend Setup
Configure Database
Update backend/src/main/resources/application.yml:

yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mahatbank
    username: root
    password: yourpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
Build and Run
bash
cd backend
mvn clean install
mvn spring-boot:run
The backend will start at http://localhost:9090/api

3. Frontend Setup
bash
cd frontend-web
npm install
npm start
The frontend will start at http://localhost:3000

4. Mobile App Setup
bash
cd mobile-app
npm install
npx expo start
Scan the QR code with Expo Go app on your phone.

5. Docker Setup (Optional)
bash
docker-compose up -d
📊 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT token
Accounts
Method	Endpoint	Description
GET	/api/accounts	Get all user accounts
POST	/api/accounts	Create a new account
GET	/api/accounts/{id}/balance	Get account balance
Transactions
Method	Endpoint	Description
GET	/api/transactions	Get transaction history
POST	/api/transactions/transfer	Transfer funds
GET	/api/transactions/{id}	Get transaction details
Loans
Method	Endpoint	Description
POST	/api/loans/apply	Apply for a loan
GET	/api/loans	Get all user loans
Admin
Method	Endpoint	Description
GET	/api/admin/users	Get all users
PUT	/api/admin/users/{id}/role	Update user role
GET	/api/admin/stats	Get system statistics
🧪 Testing
Backend
bash
cd backend
mvn test
Frontend
bash
cd frontend-web
npm test
📱 Mobile App Screens
Screen	Description
Login	Email/password login with biometric support
Dashboard	Balance overview, quick actions
Accounts	View all accounts with balances
Transfer	Fund transfer with transaction types
History	Transaction history with filters
Loans	Apply for loans, view status
Profile	User profile management
🎯 Sample Users
Email	Password	Role
admin@example.com	admin123	ADMIN
customer@example.com	password123	CUSTOMER
🔒 Security Features
✅ JWT token-based authentication

✅ Password hashing with BCrypt

✅ Role-based access control

✅ CORS configuration

✅ Input validation

✅ SQL injection prevention

✅ XSS protection

🗺️ Roadmap
☑ User Authentication
☑ Account Management
☑ Fund Transfers
☑ Loan Management
☑ Admin Panel
☑ Reports (CSV)
☑ Mobile App
□ Two-Factor Authentication (2FA)
□ Payment Gateway Integration
□ Push Notifications
□ PDF Reports
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

👥 Authors
Your Name - Initial work - YourGitHub

🙏 Acknowledgments
Spring Boot team for the amazing framework

React and Material-UI communities

All open-source libraries used in this project

📞 Support
For support, email support@mahatbank.com or create an issue in the GitHub repository.

Built with ❤️ for the Mahat Bank project

text

---

## 📁 Create `LICENSE` (Optional)

**Location:** `C:\mahat-bank\LICENSE`

```text
MIT License

Copyright (c) 2024 Mahat Commercial Bank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
