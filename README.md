# 🏦 FinTech Mortgage API & Platform

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, full-stack B2B/B2C FinTech application developed as the final project for the UPCSchool Backend Architecture module. The system provides a robust RESTful API to manage banking institutions and their mortgage products, accompanied by a dynamic React frontend.

## ✨ Key Features (Exercise 6 Highlights)

Beyond the standard CRUD operations and authentication, this project implements advanced business-logic features tailored for the banking sector:

- **📊 Interactive Mortgage Simulator**: A real-time calculation engine using the French Amortization System to compute monthly fees dynamically as the user adjusts Capital and Duration.
- **📄 Precontractual Document Generation (FEIN)**: Generates a complete, month-by-month Amortization Schedule dynamically formatted into a downloadable PDF using `OpenPDF`.
- **💖 Social Favourites & Market Trends**: Users can interact with mortgage products (like/unlike). The system provides a public global ranking endpoint (`ORDER BY favorites DESC`) to analyze market popularity.
- **🛡️ Strict API-Key Security**: Multi-tenant authorization enforcing resource ownership. Users can only edit/delete banks and mortgages they personally created.
- **⚡ Full-Stack Integration**: A responsive, SPA frontend built with React, Vite, and Nanostores for instant UI updates and cache-busting.

---

## 🛠️ Technology Stack

### Backend
* **Framework**: Java 21, Spring Boot 3.4.5
* **Data Access**: Spring Data JDBC
* **Database**: H2 In-Memory Database (Seeded automatically via `schema.sql` and `data.sql`)
* **Security**: Custom API-Key Filter Authentication implementation
* **Documentation**: OpenAPI 3 (Swagger UI)
* **Tools**: OpenPDF (Document Generation), JUnit & MockMvc (Testing)

### Frontend
* **Core**: React 19, Vite
* **State Management**: Nanostores (Global atomic state for Authentication and Favourites)
* **Styling**: Tailwind CSS & Lucide Icons

---

## 🚀 How to Run Locally

### 1. Start the Spring Boot Backend
The backend runs on port `8080` and uses an in-memory H2 database.
```bash
# From the root directory of the project
mvn spring-boot:run
```

### 2. Start the React Frontend
The frontend runs on port `5173` and automatically proxies API requests to the backend.
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies (only needed the first time)
npm install

# Start the Vite development server
npm run dev
```

### 3. Access the Application
* **Web Interface**: Open `http://localhost:5173` in your browser.
* **API Documentation**: Open `http://localhost:8080/swagger-ui/index.html` to explore and test the endpoints.

---

## 🔐 Test Users (Seeded Data)

The database is pre-seeded with the following users for testing the API-Key security:

| Username | API Key          | Ownership / Capabilities |
|----------|------------------|--------------------------|
| `alice`  | `key-alice-1234` | Owns Caixabank & Kutxabank |
| `bob`    | `key-bob-5678`   | Owns BBVA & Sabadell       |
| `carol`  | `key-carol-9012` | Owns Santander             |

*Note: You can log into the React frontend using any of these usernames and API keys to test creation, deletion, and simulator capabilities.*

---

## 📂 Architecture Overview

- `/src/main/java/edu/upc/upcschool/mortgage/controllers` - REST endpoints (Banks, Mortgages, Favorites)
- `/src/main/java/edu/upc/upcschool/mortgage/services` - Business logic (Simulation & PDF Generation)
- `/src/main/java/edu/upc/upcschool/mortgage/security` - Custom API-Key interception and authorization filters
- `/src/main/resources` - SQL Seed data and OpenAPI definition
- `/frontend` - React single-page application integrating the REST API
