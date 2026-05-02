import React, { useState } from 'react';
import { createPaymentIntent, confirmPayment } from '../api';
import { useAuth } from '../hooks/useAuth';
import './Payment.css';

const PaymentCheckout = ({ bookingId, amount, items = [], onSuccess, onCancel }) => {
  const [paymentType, setPaymentType] = useState(null); // 'online' or 'cash'
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const { user } = useAuth();

  const onlinePaymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Digital Wallet', 'PayPal'];

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = amount + itemsTotal;
  const gst = (totalAmount * 0.05).toFixed(2);
  const finalAmount = (totalAmount * 1.05).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!bookingId || !totalAmount) {
      setError('Invalid booking details');
      return false;
    }

    if (paymentData.paymentMethod === 'Credit Card' || paymentData.paymentMethod === 'Debit Card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.holderName) {
        setError('Please fill in all card details');
        return false;
      }

      if (paymentData.cardNumber.length < 13) {
        setError('Invalid card number');
        return false;
      }

      if (paymentData.cvv.length !== 3) {
        setError('Invalid CVV');
        return false;
      }
    }

    if (paymentData.paymentMethod === 'UPI' && !paymentData.upiId) {
      setError('Please enter UPI ID');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const txnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txnId);

      const intentResponse = await createPaymentIntent({
        bookingId,
        amount: parseFloat(finalAmount),
        paymentType: 'online',
        items,
      });

      const confirmResponse = await confirmPayment({
        bookingId,
        transactionId: txnId,
        paymentMethod: paymentData.paymentMethod,
        amount: parseFloat(finalAmount),
        paymentType: 'online',
        items,
      });

      if (confirmResponse.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(confirmResponse.data.payment);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    setError('');
    setLoading(true);

    try {
      const txnId = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txnId);

      const confirmResponse = await confirmPayment({
        bookingId,
        transactionId: txnId,
        paymentMethod: 'Cash',
        amount: parseFloat(finalAmount),
        paymentType: 'cash',
        items,
      });

      if (confirmResponse.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(confirmResponse.data.payment);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process cash payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h2>Payment Confirmed!</h2>
        <p>Your booking has been confirmed.</p>
        <p className="transaction-id">Transaction ID: {transactionId}</p>
        <p className="payment-method-text">
          {paymentType === 'cash' ? '💵 Cash Payment - Pay at restaurant' : '✅ Online Payment Confirmed'}
        </p>
        <p>A confirmation email has been sent to {user?.email}</p>
      </div>
    );
  }

  // Step 1: Choose payment type
  if (!paymentType) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <h2>💳 Choose Payment Method</h2>

          <div className="order-summary">
            <div className="summary-row">
              <span>Table Booking</span>
              <span className="amount">₹{amount}</span>
            </div>
            {itemsTotal > 0 && (
              <div className="summary-row">
                <span>Items Total</span>
                <span className="amount">₹{itemsTotal}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="amount">₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span className="amount">₹{gst}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="amount">₹{finalAmount}</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="payment-type-selector">
            <button
              className="payment-type-btn online"
              onClick={() => setPaymentType('online')}
              disabled={loading}
            >
              <div className="payment-type-icon">💳</div>
              <div className="payment-type-title">Online Payment</div>
              <div className="payment-type-desc">Card, UPI, Digital Wallet</div>
            </button>

            <button
              className="payment-type-btn cash"
              onClick={() => handleCashPayment()}
              disabled={loading}
            >
              <div className="payment-type-icon">💵</div>
              <div className="payment-type-title">Cash at Restaurant</div>
              <div className="payment-type-desc">Pay when you arrive</div>
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
              ✕ Cancel Booking
            </button>
          </div>

          <div className="security-info">
            <p>🔒 Your information is secure and encrypted</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Online payment form
  return (
    <div className="payment-container">
      <div className="payment-card">
        <button
          type="button"
          className="back-btn"
          onClick={() => setPaymentType(null)}
          disabled={loading}
        >
          ← Back
        </button>

        <h2>💳 Online Payment</h2>

        <div className="order-summary">
          <div className="summary-row">
            <span>Total Amount</span>
            <span className="amount">₹{finalAmount}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label>Select Payment Method *</label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              {onlinePaymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {(paymentData.paymentMethod === 'Credit Card' ||
            paymentData.paymentMethod === 'Debit Card') && (
            <>
              <div className="form-group">
                <label>Cardholder Name *</label>
                <input
                  type="text"
                  name="holderName"
                  value={paymentData.holderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentData.paymentMethod === 'UPI' && (
            <div className="form-group">
              <label>UPI ID *</label>
              <input
                type="text"
                name="upiId"
                value={paymentData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setPaymentType(null)} disabled={loading}>
              ← Back
            </button>
            <button type="submit" className="btn-pay" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
            </button>
          </div>
        </form>

        <div className="security-info">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
