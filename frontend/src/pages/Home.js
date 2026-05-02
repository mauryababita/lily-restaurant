import React from 'react';
import { useApp } from '../context/AppContext';
import frontpage from '../assets/images/frontpage.jpeg';

const Home = () => {
  const { setActiveSection } = useApp();
  return (
    <section className="section hero-section">
      <div className="hero" style={{ backgroundImage: `url(${frontpage})` }}>
        <div className="hero-content">
          <h1>Welcome to LILY Restaurant & Cafe</h1>
          <p>Where taste meets elegance 🌿</p>
          <p>Your perfect place for food & coffee ☕</p>
          <div className="hero-buttons">
            <button className="button-primary" onClick={() => setActiveSection('menu')}>View Menu</button>
            <button className="button-secondary" onClick={() => setActiveSection('contact')}>Book Table</button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Home;
