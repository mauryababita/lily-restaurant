# 🎯 LILY Restaurant - New Features Documentation

This document details the newly implemented features:  Authentication, Payment Processing, Admin Analytics, and AI-Based Recommendations.

---

## 🔐 1. Authentication System (JWT-Based)

### Overview
Complete user authentication and authorization system using JWT tokens.

### Models
- **User Model** (`backend/models/User.js`)
  - Fields: name, email, password (hashed), phone, dietary preferences, allergies, role, isActive, emailVerified
  - Methods: Password hashing, password comparison

### API Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "dietaryPreferences": ["Vegetarian"]
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { id, name, email, role, dietaryPreferences }
}
```

#### Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update User Profile
```
PUT /api/auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "dietaryPreferences": ["Vegan"],
  "allergies": ["Nuts"]
}
```

### Features
- Password hashing with bcryptjs
- JWT token generation (7-day expiry)
- Role-based access control (User, Admin, Manager)
- Dietary preferences tracking
- Allergy information storage

---

## 💳 2. Online Payment Integration

### Overview
Stripe-based payment processing with secure payment intents and transaction history.

### Models
- **Payment Model** (`backend/models/Payment.js`)
  - Fields: userId, bookingId, amount, paymentMethod, transactionId, status, paymentGateway, invoiceUrl, receiptEmail
  - Supports: Credit Card, Debit Card, UPI, Digital Wallet, PayPal

### API Endpoints

#### Create Payment Intent
```
POST /api/payments/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking_id_here",
  "amount": 500
}

Response:
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx"
}
```

#### Confirm Payment
```
POST /api/payments/confirm-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking_id",
  "transactionId": "transaction_id_from_stripe",
  "paymentMethod": "Credit Card",
  "amount": 500
}
```

#### Get Payment History
```
GET /api/payments/history
Authorization: Bearer {token}
```

#### Get Payment Details
```
GET /api/payments/{paymentId}
Authorization: Bearer {token}
```

#### Refund Payment
```
POST /api/payments/refund/{paymentId}
Authorization: Bearer {token}
```

### Features
- Stripe payment processing
- Multiple payment methods
- Automatic invoice generation
- Refund management
- Payment history tracking
- Email receipts

---

## 📊 3. Admin Analytics Dashboard

### Overview
Comprehensive analytics and reporting for restaurant management.

### API Endpoints

#### Dashboard Overview
```
GET /api/analytics/dashboard
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "dashboard": {
    "totalBookings": 150,
    "totalUsers": 200,
    "totalRevenue": 50000,
    "totalMenuItems": 45,
    "averageRating": 4.5
  }
}
```

#### Revenue Analytics
```
GET /api/analytics/revenue?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "revenueData": [
    {
      "_id": { "year": 2024, "month": 1, "day": 1 },
      "revenue": 1000,
      "count": 5
    }
  ]
}
```

#### Booking Trends
```
GET /api/analytics/bookings-trends
Authorization: Bearer {admin_token}
```

#### Peak Hours Analysis
```
GET /api/analytics/peak-hours
Authorization: Bearer {admin_token}

Response shows which hours have most bookings and guests
```

#### Top Performing Dishes
```
GET /api/analytics/top-dishes
Authorization: Bearer {admin_token}

Shows top 10 dishes by rating and review count
```

#### Customer Demographics
```
GET /api/analytics/customer-demographics
Authorization: Bearer {admin_token}

Shows dietary preferences breakdown and customer segments
```

### Features
- Real-time revenue tracking
- Booking trend analysis
- Peak hours identification
- Top-performing dishes
- Customer demographics
- Interactive data visualization ready

---

## 🤖 4. AI-Based Dish Recommendations

### Overview
Machine learning-based recommendation engine using user preferences and ratings.

### Models
- **Review Model** (`backend/models/Review.js`)
  - Fields: userId, menuItemId, rating (1-5), comment, sentiment, tags, helpfulCount, isVerifiedPurchase
  - Sentiment analysis: Positive, Neutral, Negative

### API Endpoints

#### Get Personalized Recommendations
```
GET /api/recommendations/personalized
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 10,
  "recommendations": [
    {
      "dish": { ... },
      "score": 8.5,
      "avgRating": "4.3",
      "reviewCount": 15
    }
  ]
}
```

#### Get Seasonal Recommendations
```
GET /api/recommendations/seasonal

Returns dishes tagged with current season
```

#### Rate a Dish
```
POST /api/recommendations/rate-dish
Authorization: Bearer {token}
Content-Type: application/json

{
  "menuItemId": "dish_id",
  "rating": 4,
  "comment": "Delicious!",
  "tags": ["Spicy", "Healthy"],
  "bookingId": "optional_booking_id"
}
```

#### Get Similar Dishes
```
GET /api/recommendations/similar/{dishId}

Returns dishes similar to the specified dish based on tags
```

### Recommendation Algorithm
1. **Dietary Preferences Matching** (+2 points per match)
2. **Allergy Avoidance** (-3 points per conflict)
3. **Dish Rating Influence** (+0.5 per rating point)
4. **User Review History** (excludes already-rated dishes)
5. **Seasonal Relevance** (prioritizes in-season items)

### Features
- User-preference-based recommendations
- Dietary restriction awareness
- Allergy conflict detection
- Seasonal dish suggestions
- Similar dish discovery
- Review-based sentiment analysis
- Verified purchase tracking

---

## 📋 Database Schema Updates

### Updated Booking Model
```javascript
{
  name: String,
  email: String,
  message: String,
  contact_date: Date,
  contact_time: String,
  phone: String,
  guests: Number,
  status: 'pending' | 'confirmed' | 'cancelled',
  paymentStatus: 'Pending' | 'Paid' | 'Failed',  // NEW
  estimatedAmount: Number  // NEW
}
```

---

## 🔑 Environment Variables

Add these to `backend/.env`:

```
PORT=5000
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📦 Dependencies Added

```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2",
  "stripe": "^13.10.0",
  "axios": "^1.6.2"
}
```

Install with:
```bash
cd backend
npm install
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Update `.env` with:
- MongoDB Atlas URI
- JWT Secret
- Stripe API Key

### 3. Start Backend
```bash
npm run dev
```

---

## 🔄 Integration with Frontend

Example React hooks for new features:

### Authentication Hook
```javascript
const { token, user, login, logout } = useAuth();
```

### Recommendations Hook
```javascript
const { recommendations, loading } = useRecommendations();
```

### Analytics Hook (Admin)
```javascript
const { analytics, revenue, bookings } = useAnalytics();
```

---

## 🛡️ Security Notes

- JWT tokens expire in 7 days
- Passwords are hashed with bcryptjs (10 salt rounds)
- Stripe API key should never be exposed on frontend
- Always use HTTPS in production
- Keep JWT_SECRET safe and rotate regularly

---

## 📈 Future Enhancements

- Implement email verification
- Add OAuth2 (Google, Facebook login)
- Advanced analytics dashboards with charts
- Recommendation engine ML model
- Push notifications for reservations
- Mobile app integration

---

*Last Updated: April 2026*
