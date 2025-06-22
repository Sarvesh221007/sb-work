import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './Login.css'; // Create this for styles

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert(`👋 Welcome ${res.data.user.name}`);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || '❌ Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card shadow-sm p-4 bg-white rounded">
        <h3 className="text-center mb-4 fw-bold">Login to SB Works</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              id="emailInput"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="emailInput">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              id="passwordInput"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="passwordInput">Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>Don't have an account? <a href="/register">Register here</a></small>
        </div>
      </div>
    </div>
  );
}
