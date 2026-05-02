import React from 'react';
import about1 from '../assets/images/about1.jpeg';
import about2 from '../assets/images/about2.jpeg';

const About = () => (
  <section className="section">
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h2>🌸 Welcome to LILY Restaurant</h2>
        <p>Where elegance meets flavor. Inspired by nature and the grace of the lily flower, we bring you an unforgettable dining experience.</p>
      </div>

      {/* Story Section */}
      <div className="about-section">
        <div className="about-img-wrapper">
          <img src={about1} alt="LILY Restaurant Interior" />
        </div>
        <div className="about-text-content">
          <h3>✨ Our Story</h3>
          <p>Established in 2025, LILY Restaurant was built with the vision of creating a place where food is not just a meal, but a celebration of life.</p>
          <p>Our journey began with a simple idea: to combine the freshest ingredients with the most refined culinary techniques, served in an atmosphere that feels like home.</p>
        </div>
      </div>

      {/* Philosophy Section (Reverse) */}
      <div className="about-section reverse">
        <div className="about-text-content">
          <h3>🍷 Our Philosophy</h3>
          <p>We believe that every dish tells a story. From the selection of farm-fresh seasonal produce to the final presentation on your plate, we pour our heart into every detail.</p>
          <p>At LILY, we don't just serve food; we craft memories that linger long after the last bite.</p>
        </div>
        <div className="about-img-wrapper">
          <img src={about2} alt="LILY Restaurant Food" />
        </div>
      </div>

      {/* Value Cards Section */}
      <div className="values-grid">
        <div className="value-card">
          <span className="value-icon">🌿</span>
          <h4>Farm Fresh</h4>
          <p>Ingredients sourced daily from local organic farms to ensure the highest quality.</p>
        </div>
        <div className="value-card">
          <span className="value-icon">👨‍🍳</span>
          <h4>Expert Chefs</h4>
          <p>Our culinary team brings years of international experience and passion.</p>
        </div>
        <div className="value-card">
          <span className="value-icon">🎶</span>
          <h4>Cozy Ambience</h4>
          <p>A tranquil environment with soft music, perfect for any occasion.</p>
        </div>
        <div className="value-card">
          <span className="value-icon">🍰</span>
          <h4>Handcrafted</h4>
          <p>From sauces to desserts, everything is made in-house with love.</p>
        </div>
      </div>
    </div>
  </section>
);

export default About;
