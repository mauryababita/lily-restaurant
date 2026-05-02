# 🚀 Frontend Integration Guide

This guide explains how to integrate all the new components and features into your React application.

---

## 📦 Components Created

### 1. **Authentication Components**
- `Login.js` - User login page
- `Register.js` - User registration page
- `Auth.css` - Styling for auth pages

### 2. **Recommendations Component**
- `Recommendations.js` - AI-based dish suggestions
- `Recommendations.css` - Styling

### 3. **Analytics Dashboard**
- `AnalyticsDashboard.js` - Admin analytics and metrics
- `Analytics.css` - Styling

### 4. **Payment Component**
- `PaymentCheckout.js` - Stripe payment integration
- `Payment.css` - Styling

### 5. **Context & Hooks**
- `context/AuthContext.js` - Global auth state management
- `hooks/useAuth.js` - Custom auth hook
- Updated `api.js` - All API endpoints

---

## 🔗 Integration Steps

### Step 1: Update App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Recommendations from './components/Recommendations';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PaymentCheckout from './components/PaymentCheckout';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            <Route 
              path="/recommendations" 
              element={<Recommendations isAuthenticated={true} />} 
            />
            <Route 
              path="/payment" 
              element={<PaymentCheckout />} 
            />
          </>
        )}

        {/* Admin Routes */}
        {user?.role === 'Admin' && (
          <>
            <Route 
              path="/admin" 
              element={<AnalyticsDashboard isAdmin={true} />} 
            />
            <Route 
              path="/admin/dashboard" 
              element={<Admin />} 
            />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

### Step 2: Update Header Component

Add navigation links to authenticate and recommendations:

```javascript
// In components/Header.js

import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      {/* ... existing header code ... */}
      
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        
        {isAuthenticated && (
          <>
            <Link to="/recommendations">✨ Recommendations</Link>
            <span className="user-info">Hi, {user?.name}</span>
            {user?.role === 'Admin' && (
              <Link to="/admin">📊 Analytics</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
```

### Step 3: Add Recommendations to Home Page

```javascript
// In pages/Home.js

import { useAuth } from '../hooks/useAuth';
import Recommendations from '../components/Recommendations';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* ... existing home content ... */}
      
      {/* Show recommendations if logged in */}
      {isAuthenticated && (
        <Recommendations isAuthenticated={true} />
      )}
      
      {/* Or show seasonal recommendations for all */}
      <Recommendations isAuthenticated={false} />
    </>
  );
};

export default Home;
```

### Step 4: Add Payment to Booking Page

```javascript
// In pages/Menu.js or Booking component

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PaymentCheckout from '../components/PaymentCheckout';

const BookingForm = () => {
  const { isAuthenticated } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handleBookingSubmit = async (data) => {
    // Save booking first
    const booking = await addBooking(data);
    setBookingData(booking);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (payment) => {
    // Handle successful payment
    console.log('Payment successful:', payment);
    // Redirect or show confirmation
  };

  if (showPayment && bookingData) {
    return (
      <PaymentCheckout
        bookingId={bookingData._id}
        amount={bookingData.estimatedAmount || 500}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    // Your existing booking form
    <div>
      {/* Booking form JSX */}
    </div>
  );
};

export default BookingForm;
```

### Step 5: Add Analytics Dashboard to Admin Page

```javascript
// In pages/Admin.js

import { useAuth } from '../hooks/useAuth';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Admin = () => {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return <div>Access Denied</div>;
  }

  return (
    <>
      {/* Existing admin panel code */}
      
      <AnalyticsDashboard isAdmin={true} />
    </>
  );
};

export default Admin;
```

---

## 🎨 Using useAuth Hook

The `useAuth` hook provides:

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const {
    user,           // Current user object
    token,          // JWT token
    loading,        // Loading state
    error,          // Error message
    login,          // Login function
    register,       // Register function
    logout,         // Logout function
    isAuthenticated // Boolean
  } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

---

## 📋 API Integration

All API calls are in `api.js`:

```javascript
import {
  // Auth
  loginUser,
  registerUser,
  getCurrentUser,
  updateUserProfile,

  // Payments
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,

  // Analytics
  getDashboardAnalytics,
  getTopDishes,
  getPeakHours,

  // Recommendations
  getPersonalizedRecommendations,
  getSeasonalRecommendations,
  rateDish,
} from './api';
```

---

## 🔒 Protected Routes Example

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Usage:
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="Admin">
      <AnalyticsDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🎯 Key Features

### Authentication Flow
1. User registers → token saved to localStorage
2. Token auto-loaded on app refresh
3. Protected routes check authentication
4. Logout clears token and state

### Recommendations
1. Personalized: Based on user preferences and ratings
2. Seasonal: Current season dishes
3. Similar: Related dishes to a specific item

### Analytics
1. Dashboard: Key metrics overview
2. Revenue: Daily/monthly revenue tracking
3. Peak Hours: Busiest booking times
4. Top Dishes: Best-rated items
5. Demographics: Customer preferences

### Payments
1. Multiple payment methods supported
2. Real-time validation
3. Transaction tracking
4. Email receipts

---

## 📱 Environment Setup

No additional environment variables needed for frontend. The backend handles:
- JWT_SECRET
- STRIPE_SECRET_KEY
- MONGODB_URI

---

## 🧪 Testing

### Test Login
```
Email: test@example.com
Password: password123
```

### Test Admin Features
Create a user and manually update their role to 'Admin' in MongoDB

---

## 🚀 Deployment

1. Build frontend: `npm run build`
2. Ensure backend is running
3. Update API baseURL in `api.js` if needed
4. Deploy to Vercel/Netlify

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify backend is running
3. Check network requests in DevTools
4. Review FEATURES.md for API docs

---

*Last Updated: April 2026*
