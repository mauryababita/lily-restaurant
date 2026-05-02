import React, { useState, useEffect } from 'react';
import './ItemSelector.css';

const ItemSelector = ({ onItemsSelect, onCancel, showItems = true }) => {
  const menuItems = [
    { id: 1, name: 'Sushi', price: 450, desc: 'Delicate Japanese sushi rolls' },
    { id: 2, name: 'Pizza', price: 450, desc: 'Wood-fired pizza with fresh toppings' },
    { id: 3, name: 'Pasta', price: 425, desc: 'Creamy Italian pasta' },
    { id: 4, name: 'Soups', price: 195, desc: 'Warm and comforting soups' },
    { id: 5, name: 'Salad', price: 250, desc: 'Fresh garden greens' },
    { id: 6, name: 'Drinks', price: 95, desc: 'Freshly brewed coffee & beverages' },
    { id: 7, name: 'Dessert', price: 150, desc: 'Sweet & creamy desserts' },
    { id: 8, name: 'Mocktails', price: 195, desc: 'Refreshing non-alcoholic blends' },
    { id: 9, name: 'Sizzler', price: 599, desc: 'Hot sizzler platters' },
    { id: 10, name: 'Rice & Noodles', price: 350, desc: 'Delicious stir-fried rice noodles' },
    { id: 11, name: 'Rice Biryani', price: 480, desc: 'Aromatic basmati rice' },
    { id: 12, name: 'Oriental', price: 425, desc: 'Exquisite oriental dishes' },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (item) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      if (existing.quantity > 1) {
        setSelectedItems(selectedItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        ));
      } else {
        setSelectedItems(selectedItems.filter(i => i.id !== item.id));
      }
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty <= 0) {
      setSelectedItems(selectedItems.filter(i => i.id !== itemId));
    } else {
      setSelectedItems(selectedItems.map(i =>
        i.id === itemId ? { ...i, quantity: newQty } : i
      ));
    }
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleConfirm = () => {
    onItemsSelect(selectedItems);
  };

  return (
    <div className="item-selector-wrapper">
      <div className="item-selector-container">
        <div className="item-selector-header">
          <h3>🍽️ Select Items to Order</h3>
          <p>Choose dishes to add to your booking</p>
        </div>

        <div className="items-grid">
          {menuItems.map(item => {
            const selected = selectedItems.find(i => i.id === item.id);
            return (
              <div key={item.id} className={`item-card ${selected ? 'selected' : ''}`}>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="item-price">₹{item.price}</div>
                </div>
                {selected ? (
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.id, selected.quantity - 1)}>−</button>
                    <span>{selected.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, selected.quantity + 1)}>+</button>
                  </div>
                ) : (
                  <button className="add-btn" onClick={() => handleSelectItem(item)}>
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="items-summary">
          <div className="summary-header">
            <h4>📋 Order Summary</h4>
            <span className="item-count">{selectedItems.length} items</span>
          </div>

          {selectedItems.length > 0 ? (
            <>
              <div className="summary-items">
                {selectedItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-detail">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="item-subtotal">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total Items Cost:</span>
                <span className="total-amount">₹{getTotalPrice()}</span>
              </div>
            </>
          ) : (
            <p className="no-items">No items selected yet. Select items to add to your order.</p>
          )}
        </div>

        <div className="item-selector-actions">
          <button className="cancel-btn" onClick={onCancel}>
            ✕ Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm} disabled={selectedItems.length === 0}>
            ✓ Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelector;
