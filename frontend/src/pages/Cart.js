import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addOrder } from '../api';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    showToast,
    setActiveSection,
  } = useApp();

  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryType: 'dine-in',
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'offline',
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    try {
      const items = cart.map((c) => ({ menuItemId: c._id, quantity: c.quantity, name: c.name, price: c.price }));
      const orderData = { ...orderForm, items };
      const response = await addOrder(orderData);
      if (response.data.success) {
        showToast('Order placed successfully!', 'success');
        setSubmittedOrder({
          ...orderData,
          total: totalAmount,
          submittedAt: new Date().toLocaleString(),
        });
        clearCart();
        setOrderForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          deliveryType: 'dine-in',
          deliveryAddress: '',
          specialInstructions: '',
          paymentMethod: 'offline',
        });
      }
    } catch (error) {
      showToast('Failed to place order', 'error');
    }
  };

  return (
    <section className="section" id="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="button-primary" onClick={() => setActiveSection('menu')}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                  </div>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="cart-total">Total: ₹ {totalAmount}</p>
          </div>

          <div className="cart-sidebar">
            <form className="cart-form" onSubmit={handleOrderSubmit}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#4f46e5' }}>Checkout</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Enter your phone"
                value={orderForm.customerPhone}
                onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Delivery Type</label>
              <select
                value={orderForm.deliveryType}
                onChange={(e) => setOrderForm({ ...orderForm, deliveryType: e.target.value })}
              >
                <option value="dine-in">Dine-in</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            {orderForm.deliveryType === 'delivery' && (
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                placeholder="Any special instructions?"
                value={orderForm.specialInstructions}
                onChange={(e) => setOrderForm({ ...orderForm, specialInstructions: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={orderForm.paymentMethod}
                onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
              >
                <option value="offline">Offline Payment</option>
                <option value="online">Online Payment</option>
              </select>
            </div>
            <button type="submit">Place Order</button>
            </form>
          </div>
        </div>
      )}
      {submittedOrder && (
        <div className="order-summary">
          <h3>Order Details</h3>
          <p><strong>Placed on:</strong> {submittedOrder.submittedAt}</p>
          <p><strong>Name:</strong> {submittedOrder.customerName}</p>
          <p><strong>Email:</strong> {submittedOrder.customerEmail}</p>
          <p><strong>Phone:</strong> {submittedOrder.customerPhone || 'N/A'}</p>
          <p><strong>Delivery type:</strong> {submittedOrder.deliveryType}</p>
          {submittedOrder.deliveryType === 'delivery' && (
            <p><strong>Address:</strong> {submittedOrder.deliveryAddress}</p>
          )}
          <p><strong>Payment:</strong> {submittedOrder.paymentMethod}</p>
          <p><strong>Special instructions:</strong> {submittedOrder.specialInstructions || 'None'}</p>
          <div className="order-items">
            {submittedOrder.items.map((item, index) => (
              <div key={`${item.menuItemId}-${index}`} className="order-item">
                <span>{item.name}</span>
                <span>₹{item.price} x {item.quantity}</span>
              </div>
            ))}
          </div>
          <p className="order-total"><strong>Total paid:</strong> ₹{submittedOrder.total}</p>
        </div>
      )}
    </section>
  );
};

export default Cart;
