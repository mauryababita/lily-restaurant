import React, { useState, useEffect } from 'react';
import { getPersonalizedRecommendations, getSeasonalRecommendations } from '../api';
import './Recommendations.css';

const Recommendations = ({ isAuthenticated }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [seasonalDishes, setSeasonalDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personalized');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        if (isAuthenticated && activeTab === 'personalized') {
          const response = await getPersonalizedRecommendations();
          setRecommendations(response.data.recommendations);
        } else if (activeTab === 'seasonal') {
          const response = await getSeasonalRecommendations();
          setSeasonalDishes(response.data.dishes);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activeTab, isAuthenticated]);

  const renderRecommendationCard = (item, index) => (
    <div key={index} className="rec-card">
      <div className="rec-image">
        <img
          src={item.dish?.image || 'https://via.placeholder.com/200'}
          alt={item.dish?.name}
        />
        <span className="rec-score">{item.score?.toFixed(1) || 'N/A'}</span>
      </div>
      <div className="rec-content">
        <h3>{item.dish?.name}</h3>
        <p className="rec-description">{item.dish?.description}</p>
        <div className="rec-meta">
          <span className="rating">⭐ {item.avgRating}</span>
          <span className="reviews">({item.reviewCount} reviews)</span>
        </div>
        <p className="rec-price">₹{item.dish?.price}</p>
      </div>
    </div>
  );

  const renderSeasonalCard = (dish, index) => (
    <div key={index} className="rec-card">
      <div className="rec-image">
        <img
          src={dish.image || 'https://via.placeholder.com/200'}
          alt={dish.name}
        />
        <span className="seasonal-badge">Seasonal</span>
      </div>
      <div className="rec-content">
        <h3>{dish.name}</h3>
        <p className="rec-description">{dish.description}</p>
        <div className="rec-meta">
          <span className="rating">⭐ {dish.avgRating?.toFixed(1) || 'N/A'}</span>
          <span className="reviews">({dish.reviewCount} reviews)</span>
        </div>
        <p className="rec-price">₹{dish.price}</p>
      </div>
    </div>
  );

  return (
    <section className="recommendations-section">
      <div className="container">
        <div className="section-header">
          <h2>✨ Recommended For You</h2>
          <p>Personalized dishes based on your preferences and ratings</p>
        </div>

        <div className="rec-tabs">
          {isAuthenticated && (
            <button
              className={`tab ${activeTab === 'personalized' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalized')}
            >
              🎯 Personalized
            </button>
          )}
          <button
            className={`tab ${activeTab === 'seasonal' ? 'active' : ''}`}
            onClick={() => setActiveTab('seasonal')}
          >
            🌾 Seasonal
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading recommendations...</div>
        ) : (
          <div className="rec-grid">
            {activeTab === 'personalized'
              ? recommendations.length > 0
                ? recommendations.map((item, idx) => renderRecommendationCard(item, idx))
                : <p className="no-data">No recommendations available yet. Rate some dishes!</p>
              : seasonalDishes.length > 0
              ? seasonalDishes.map((dish, idx) => renderSeasonalCard(dish, idx))
              : <p className="no-data">No seasonal dishes available.</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendations;
