import React, { useState } from 'react';
import { addBooking } from '../api';
import { useApp } from '../context/AppContext';
import PaymentCheckout from '../components/PaymentCheckout';
import ItemSelector from '../components/ItemSelector';

const Contact = () => {
  const { showToast } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', message: '', contact_date: '', contact_time: '',
    phone: '', guests: '2', paymentMethod: 'offline'
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const calculateAmount = () => {
    return parseInt(form.guests) * 500;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.contact_date || !form.contact_time) {
      showToast('Please fill all required fields!', 'error'); 
      return;
    }
    setLoading(true);
    try {
      const amount = calculateAmount();
      const res = await addBooking({ ...form, estimatedAmount: amount });
      if (res.data.success) {
        setBookingData(res.data.data);
        setShowItemSelector(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit booking. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemsSelect = (items) => {
    setSelectedItems(items);
    setShowItemSelector(false);
    setShowPayment(true);
  };

  const handleItemsSelectorCancel = () => {
    setShowItemSelector(false);
    setBookingData(null);
    setSelectedItems([]);
    showToast('Booking cancelled. Your table reservation was not confirmed.', 'info');
  };

  const handlePaymentSuccess = (payment) => {
    showToast('✅ Booking & Payment Confirmed! Check your email for details.', 'success');
    setForm({ name: '', email: '', message: '', contact_date: '', contact_time: '', phone: '', guests: '2', paymentMethod: 'offline' });
    setBookingData(null);
    setShowPayment(false);
    setSelectedItems([]);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setShowItemSelector(true);
    showToast('Back to item selection', 'info');
  };

  // Show item selector after booking submitted
  if (showItemSelector && bookingData) {
    return (
      <section className="section">
        <ItemSelector
          onItemsSelect={handleItemsSelect}
          onCancel={handleItemsSelectorCancel}
        />
      </section>
    );
  }

  // Show payment checkout if items selected
  if (showPayment && bookingData) {
    return (
      <section className="section">
        <PaymentCheckout
          bookingId={bookingData._id}
          amount={bookingData.estimatedAmount || calculateAmount()}
          items={selectedItems}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </section>
    );
  }

  // Show booking confirmation after successful payment
  if (bookingData && !showPayment && !showItemSelector) {
    return (
      <section className="section">
        <div className="booking-confirmation">
          <div className="confirmation-card">
            <div className="confirmation-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p className="confirmation-message">Your table has been reserved and payment processed.</p>
            
            <div className="booking-details">
              <h3>📋 Booking Details</h3>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{bookingData.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{new Date(bookingData.contact_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time:</span>
                <span className="value">{bookingData.contact_time}</span>
              </div>
              <div className="detail-row">
                <span className="label">Guests:</span>
                <span className="value">{bookingData.guests} people</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value status-paid">💳 Payment Confirmed</span>
              </div>

              {selectedItems.length > 0 && (
                <>
                  <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>🍽️ Items Ordered</h3>
                  {selectedItems.map(item => (
                    <div key={item.id} className="detail-row">
                      <span className="label">{item.name} × {item.quantity}</span>
                      <span className="value">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <p className="confirmation-footer">A confirmation email has been sent to <strong>{bookingData.email}</strong></p>
            
            <button 
              onClick={() => {
                setBookingData(null);
                setForm({ name: '', email: '', message: '', contact_date: '', contact_time: '', phone: '', guests: '2' });
              }}
              className="submit-btn"
            >
              Make Another Booking
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="contact-wrapper">
        <h2>📞 Contact & Book a Table</h2>
        <div className="contact-container">
          <div className="contact-form-section">
            <h3>🍽️ Reserve Your Table</h3>
            <form className="modern-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label>Special Requests *</label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Any special requests or celebration details..." required rows="4"></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Booking Date *</label>
                  <input type="date" name="contact_date" value={form.contact_date} min={today} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Booking Time *</label>
                  <input type="time" name="contact_time" value={form.contact_time} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <select name="guests" value={form.guests} onChange={handleChange}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===10?'+':''} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option value="offline">Offline Payment</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              <div className="amount-preview">
                <p>Booking Amount: <strong>₹{calculateAmount()}</strong> (₹500 per guest)</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>+ Add items after booking</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '⏳ Processing...' : '→ Next: Select Items'}
              </button>
            </form>
          </div>
          <div className="contact-info-section">
            <h3>📍 Get In Touch</h3>
            <div className="contact-info">
              <div className="info-item"><span>📍</span><div><strong>Location</strong><span>123 Restaurant Street, Food City</span></div></div>
              <div className="info-item"><span>📧</span><div><strong>Email</strong><span>hello@lilyrestaurant.com</span></div></div>
              <div className="info-item"><span>🕐</span><div><strong>Hours</strong><span>Mon-Sun: 02:00 AM – 11:00 PM</span></div></div>
            </div>
            <div className="contact-features">
              <h4>🌟 Why Choose LILY?</h4>
              <ul>
                <li>🎂 Perfect for celebrations</li>
                <li>💑 Romantic dinner settings</li>
                <li>👨‍👩‍👧‍👦 Family-friendly atmosphere</li>
                <li>🌱 Vegetarian & vegan options</li>
                <li>🚗 Valet parking available</li>
                <li>🎵 Live music on weekends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;
