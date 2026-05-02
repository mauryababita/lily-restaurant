import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import './App.css';

const sections = {
  home: Home,
  about: About,
  menu: Menu,
  cart: Cart,
  gallery: Gallery,
  contact: Contact,
  admin: Admin,
};

const AppContent = () => {
  const { activeSection } = useApp();
  const ActivePage = sections[activeSection] || Home;
  return (
    <div className="app">
      <Header />
      <main><ActivePage /></main>
      <Footer />
      <Toast />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);
export default App;
