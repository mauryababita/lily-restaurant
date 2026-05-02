import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dietaryPreferences: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const dietaryOptions = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Non-Veg'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: checked
        ? [...prev.dietaryPreferences, value]
        : prev.dietaryPreferences.filter((pref) => pref !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone,
      formData.dietaryPreferences
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join LILY Restaurant</h1>
        <p className="auth-subtitle">Create your account to book and enjoy</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Dietary Preferences</label>
            <div className="checkbox-group">
              {dietaryOptions.map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={formData.dietaryPreferences.includes(option)}
                    onChange={handleCheckboxChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <a href="/login" className="link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
