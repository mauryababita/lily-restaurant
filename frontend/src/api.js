import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Menu APIs
export const getMenuItems = () => API.get('/menu');
export const addMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

// Booking APIs
export const getBookings = () => API.get('/bookings');
export const getBookingStats = () => API.get('/bookings/stats');
export const addBooking = (data) => API.post('/bookings', data);
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Order APIs
export const getOrders = () => API.get('/orders');
export const getOrderStats = () => API.get('/orders/stats');
export const addOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');
export const updateUserProfile = (data) => API.put('/auth/update-profile', data);

// Payment APIs
export const createPaymentIntent = (data) => API.post('/payments/create-payment-intent', data);
export const confirmPayment = (data) => API.post('/payments/confirm-payment', data);
export const getPaymentHistory = () => API.get('/payments/history');
export const getPaymentDetails = (id) => API.get(`/payments/${id}`);
export const refundPayment = (id) => API.post(`/payments/refund/${id}`);

// Analytics APIs
export const getDashboardAnalytics = () => API.get('/analytics/dashboard');
export const getRevenueAnalytics = (startDate, endDate) => 
  API.get(`/analytics/revenue?startDate=${startDate}&endDate=${endDate}`);
export const getBookingTrends = () => API.get('/analytics/bookings-trends');
export const getPeakHours = () => API.get('/analytics/peak-hours');
export const getTopDishes = () => API.get('/analytics/top-dishes');
export const getCustomerDemographics = () => API.get('/analytics/customer-demographics');

// Recommendation APIs
export const getPersonalizedRecommendations = () => API.get('/recommendations/personalized');
export const getSeasonalRecommendations = () => API.get('/recommendations/seasonal');
export const rateDish = (data) => API.post('/recommendations/rate-dish', data);
export const getSimilarDishes = (dishId) => API.get(`/recommendations/similar/${dishId}`);

export default API;
