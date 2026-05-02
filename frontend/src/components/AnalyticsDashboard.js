import React, { useState, useEffect } from 'react';
import {
  getDashboardAnalytics,
  getTopDishes,
  getPeakHours,
  getCustomerDemographics,
  getRevenueAnalytics,
} from '../api';
import './Analytics.css';

const AnalyticsDashboard = ({ isAdmin }) => {
  const [dashboard, setDashboard] = useState(null);
  const [topDishes, setTopDishes] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');

        const [dashboardRes, dishesRes, hoursRes, demoRes] = await Promise.all([
          getDashboardAnalytics(),
          getTopDishes(),
          getPeakHours(),
          getCustomerDemographics(),
        ]);

        setDashboard(dashboardRes.data.dashboard);
        setTopDishes(dishesRes.data.topDishes.slice(0, 5));
        setPeakHours(hoursRes.data.peakHours.slice(0, 8));
        setDemographics(demoRes.data);
      } catch (err) {
        setError('Failed to load analytics. Please ensure you have admin access.');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You need admin access to view analytics.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="analytics-error">{error}</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="container">
        <h1>📊 Admin Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📅</div>
            <div className="metric-content">
              <h3>Total Bookings</h3>
              <p className="metric-value">{dashboard?.totalBookings || 0}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Total Customers</h3>
              <p className="metric-value">{dashboard?.totalUsers || 0}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <p className="metric-value">₹{dashboard?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🍽️</div>
            <div className="metric-content">
              <h3>Menu Items</h3>
              <p className="metric-value">{dashboard?.totalMenuItems || 0}</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <h3>Avg Rating</h3>
              <p className="metric-value">{dashboard?.averageRating || 0}</p>
            </div>
          </div>
        </div>

        {/* Top Dishes Section */}
        <div className="analytics-section">
          <h2>🏆 Top Performing Dishes</h2>
          <div className="top-dishes-list">
            {topDishes.length > 0 ? (
              topDishes.map((item, idx) => (
                <div key={idx} className="dish-item">
                  <span className="rank">#{idx + 1}</span>
                  <div className="dish-info">
                    <h4>{item.dish?.[0]?.name || 'Unknown Dish'}</h4>
                    <p className="dish-stats">
                      Rating: {item.avgRating?.toFixed(2) || 0} ⭐ | Reviews: {item.count}
                    </p>
                  </div>
                  <div className="dish-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${(item.avgRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        {/* Peak Hours Section */}
        <div className="analytics-section">
          <h2>⏰ Peak Booking Hours</h2>
          <div className="peak-hours-list">
            {peakHours.length > 0 ? (
              peakHours.map((item, idx) => (
                <div key={idx} className="hour-item">
                  <span className="hour">{item._id}:00</span>
                  <div className="bar-container">
                    <div
                      className="hour-bar"
                      style={{
                        width: `${(item.count / Math.max(...peakHours.map((h) => h.count))) * 100}%`,
                      }}
                    >
                      <span className="bar-label">{item.count} bookings</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        {/* Customer Demographics */}
        <div className="analytics-section">
          <h2>🎯 Customer Demographics</h2>
          <div className="demographics-grid">
            <div className="demo-card">
              <h4>Total Customers</h4>
              <p className="demo-value">{demographics?.totalCustomers || 0}</p>
            </div>

            <div className="demo-card">
              <h4>Dietary Preferences</h4>
              <div className="preferences-list">
                {demographics?.dietaryBreakdown &&
                  Object.entries(demographics.dietaryBreakdown).map(([pref, count]) => (
                    <div key={pref} className="pref-item">
                      <span>{pref}</span>
                      <span className="count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
