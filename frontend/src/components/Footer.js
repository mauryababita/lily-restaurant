import React from 'react';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { setActiveSection } = useApp();
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>🌸 LILY Restaurant</h3>
        <p>Where Taste Meets Elegance 🌿</p>
        <div className="socials">
          <a href="#" title="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
        </div>
        <p className="copyright" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setActiveSection('admin')}>
          © 2025 LILY Restaurant | Admin Dashboard
        </p>
      </div>
    </footer>
  );
};
export default Footer;
