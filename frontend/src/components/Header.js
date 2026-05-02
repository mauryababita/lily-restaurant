import React from 'react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
  { id: 'menu', label: 'Menu', icon: '🍽️' },
  { id: 'cart', label: 'Cart', icon: '🛒' },
  { id: 'gallery', label: 'Gallery', icon: '📸' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
  { id: 'admin', label: 'Admin', icon: '🛠️' },
];

const Header = () => {
  const { activeSection, setActiveSection } = useApp();
  return (
    <header className="header">
      <div className="logo">🌸 LILY</div>
      <nav className="nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button className="button-primary" onClick={() => setActiveSection('menu')}>
          Explore Menu
        </button>
      </nav>
    </header>
  );
};
export default Header;
