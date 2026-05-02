# 🌸 LILY Restaurant — Full Stack Web Application

LILY Restaurant is a premium, full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It features a stunning, responsive design with glassmorphism, micro-animations, and a robust backend for managing menu items and table bookings.

## ✨ Features

-   **Premium UI/UX**: Modern design with smooth transitions and glassmorphism.
-   **Dynamic Menu**: Browse various cuisines with real-time data from the database.
-   **Table Booking**: Easy-to-use reservation system with date/time validation.
-   **Admin Dashboard**: Secure management interface for restaurant owners:
    -   **Password Protected**: Gatekept with a secure login (Default: `admin123`).
    -   **Booking Management**: View, confirm, or cancel table reservations.
    -   **Menu Management**: Add, edit, or delete dishes from the menu.
    -   **Export to Excel**: Download all booking data as a CSV file for offline use.
-   **Global State**: Powered by React Context API for seamless navigation.

## 📂 Project Structure

```
lily-restaurant/
├── backend/          ← Node.js + Express + MongoDB
│   ├── models/       ← Mongoose schemas (Booking, MenuItem)
│   ├── routes/       ← API routes (bookingRoutes, menuRoutes)
│   ├── server.js     ← Main entry point
│   └── .env          ← Environment variables
└── frontend/         ← React app
    ├── src/
    │   ├── assets/   ← Images and static assets
    │   ├── pages/    ← Home, About, Menu, Gallery, Contact, Admin
    │   ├── components/ ← Reusable UI components
    │   ├── context/  ← Global state management
    │   └── api.js    ← API integration layer
```

## 🚀 Setup Instructions

### 1. Prerequisite: Install MongoDB
Download and install **MongoDB Community**: [Download Link](https://www.mongodb.com/try/download/community). Ensure the MongoDB service is running on your machine.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`.

## 🛠️ Admin Dashboard

Access the Admin Dashboard by clicking the **"Admin Dashboard"** link in the website footer.
-   **Default Password**: `admin123`

## 🔗 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/menu` | Get all menu items |
| POST | `/api/menu` | Add menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Add booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete booking |

## 🔮 Future Enhancements

We have exciting plans to elevate the Lily Restaurant platform with the following features:

### 🔐 **Authentication System (JWT-Based Login)**
- Implement user registration and login with email verification
- JWT token-based authentication for secure API access
- Role-based access control (User, Admin, Manager roles)
- Password reset and account management features
- Social login integration (Google, Facebook)

### 💳 **Online Payment Integration**
- Integrate Stripe or Razorpay for secure payment processing
- Support multiple payment methods (Credit/Debit Card, Digital Wallets, UPI)
- Automated invoice generation and email receipts
- Payment history and refund management
- Subscription plans for frequent diners

### 📊 **Admin Analytics Dashboard**
- Real-time revenue tracking and sales metrics
- Peak hours analysis and booking trends
- Customer demographics and preferences
- Top-performing dishes and menu optimization insights
- Interactive charts and data visualization (using Chart.js or D3.js)
- Export reports in PDF/Excel format

### 🤖 **AI-Based Dish Recommendations**
- Machine learning model to recommend dishes based on user preferences
- Personalized menu suggestions for repeat customers
- Dietary preference and allergy considerations
- Seasonal dish recommendations
- Sentiment analysis on customer reviews to improve offerings

---
*Designed with ❤️ by [Your Name/Team]*
admin -----password----
