import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../api';
import { useApp } from '../context/AppContext';
import sushiImg from '../assets/images/sushi.jpeg';
import pizzaImg from '../assets/images/pizza.jpeg';
import pastaImg from '../assets/images/pasta.jpeg';
import soupImg from '../assets/images/saoup.jpeg';
import saladImg from '../assets/images/Salad.jpeg';
import coffeeImg from '../assets/images/light Coffee.jpeg';
import mocktailsImg from '../assets/images/mocktails.jpeg';
import dessertImg from '../assets/images/dessert.jpeg';
import sizzlerImg from '../assets/images/sizzler.jpeg';
import riceNoodlesImg from '../assets/images/Rice & Noodles.jpeg';
import biryaniImg from '../assets/images/Rice Biryani.jpeg';
import orientalImg from '../assets/images/oriental.jpeg';
import placeholderImg from '../assets/images/011.webp';

const menuImageMap = {
  'Sushi Deluxe': sushiImg,
  'Wood-Fired Pizza': pizzaImg,
  'Creamy Pasta': pastaImg,
  'Signature Soups': soupImg,
  'Garden Salad': saladImg,
  'Premium Coffee': coffeeImg,
  'Fresh Mocktails': mocktailsImg,
  'Sweet Dessert': dessertImg,
  'Hot Sizzler': sizzlerImg,
  'Rice & Noodles': riceNoodlesImg,
  'Rice Biryani': biryaniImg,
  'Oriental': orientalImg,
};

const getMenuImage = (item) => item.image_path || menuImageMap[item.name] || placeholderImg;

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantQuantity, setVariantQuantity] = useState(1);
  const { addToCart, showToast } = useApp();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems();
      if (response.data.success) {
        setMenuItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleImageClick = (item) => {
    setModal(item);
    setSelectedVariant(null);
    setVariantQuantity(1);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedVariant(null);
    setVariantQuantity(1);
  };

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
    setVariantQuantity(1);
  };

  const handleAddVariantToCart = () => {
    if (!selectedVariant) {
      showToast('Please select a variant', 'error');
      return;
    }

    const itemToAdd = {
      ...modal,
      name: `${modal.name} - ${selectedVariant.name}`,
      price: selectedVariant.price,
      quantity: variantQuantity,
      description: selectedVariant.description,
    };

    for (let i = 0; i < variantQuantity; i++) {
      addToCart(itemToAdd);
    }
    closeModal();
  };

  if (loading) return <div className="loading">Loading menu...</div>;

  return (
    <section className="section" id="menu">
      <h2>Our Menu</h2>
      <p className="menu-speciality">✨ Handcrafted with love & fresh ingredients — the perfect balance of taste, tradition, and freshness.</p>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <div className="card" key={item._id}>
            <img 
              src={getMenuImage(item)} 
              alt={item.name} 
              onClick={() => handleImageClick(item)}
              style={{ cursor: 'pointer' }}
            />
            <h3>{item.name}</h3>
            <p className="speciality">{item.description}</p>
            <span className="price">₹ {item.price}</span>
            <button 
              className="add-cart-btn" 
              onClick={() => handleAddToCart(item)} 
              disabled={!item.available}
            >
              {item.available ? 'Quick Add' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {/* Variant Selection Modal */}
      {modal && (
        <div className="variant-modal-overlay" onClick={closeModal}>
          <div className="variant-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="variant-close" onClick={closeModal}>✕</button>
            
            <div className="variant-modal-body">
              {/* Left: Image */}
              <div className="variant-image-section">
                <img src={getMenuImage(modal)} alt={modal.name} />
                <h2>{modal.name}</h2>
                <p className="variant-base-desc">{modal.description}</p>
              </div>

              {/* Right: Variants */}
              <div className="variant-selection-section">
                <h3>🍽️ Select Your Preference</h3>
                
                {modal.variants && modal.variants.length > 0 ? (
                  <>
                    <div className="variants-grid">
                      {modal.variants.map((variant, index) => (
                        <div
                          key={index}
                          className={`variant-card ${selectedVariant === variant ? 'selected' : ''}`}
                          onClick={() => handleSelectVariant(variant)}
                        >
                          <div className="variant-header">
                            <h4>{variant.name}</h4>
                            {selectedVariant === variant && <span className="check">✓</span>}
                          </div>
                          <p className="variant-desc">{variant.description}</p>
                          <div className="variant-price">₹{variant.price}</div>
                        </div>
                      ))}
                    </div>

                    {selectedVariant && (
                      <div className="quantity-section">
                        <label>Quantity:</label>
                        <div className="qty-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => setVariantQuantity(Math.max(1, variantQuantity - 1))}
                          >
                            −
                          </button>
                          <span className="qty-value">{variantQuantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => setVariantQuantity(variantQuantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedVariant && (
                      <div className="variant-summary">
                        <p><strong>Item:</strong> {selectedVariant.name}</p>
                        <p><strong>Price:</strong> ₹{selectedVariant.price}</p>
                        <p><strong>Quantity:</strong> {variantQuantity}</p>
                        <div className="total-price">
                          Total: <span>₹{selectedVariant.price * variantQuantity}</span>
                        </div>
                      </div>
                    )}

                    <button 
                      className="add-variant-btn"
                      onClick={handleAddVariantToCart}
                      disabled={!selectedVariant}
                    >
                      {selectedVariant ? `Add to Cart - ₹${selectedVariant.price * variantQuantity}` : 'Select a Variant'}
                    </button>
                  </>
                ) : (
                  <div className="no-variants">
                    <p>No variants available</p>
                    <button className="simple-add-btn" onClick={() => {
                      handleAddToCart(modal);
                      closeModal();
                    }}>
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Menu;
