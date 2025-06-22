import React, { useState } from 'react';
import api from '../../api';

export default function CreateProject() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token);

    try {
      await api.post('/api/projects/create', form, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setMessage('✅ Project posted successfully!');
      setForm({ title: '', description: '', budget: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.msg || '❌ Failed to post project');
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4" style={{ maxWidth: '600px', margin: '15vh auto' }}>
        <h3 className="mb-4 text-center">Create a New Project</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Project Title</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Build a React website"
              required
            />
          </div>
          <div className="mb-3">
            <label>Project Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the project requirements..."
              required
            />
          </div>
          <div className="mb-3">
            <label>Budget (₹)</label>
            <input
              name="budget"
              type="number"
              className="form-control"
              value={form.budget}
              onChange={handleChange}
              placeholder="5000"
              required
            />
          </div>
          <div className="mb-3">
            <label>Category</label>
            <input
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
              placeholder="Web Development / Design / Writing"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Post Project
          </button>
        </form>
      </div>
    </div>
  );
}
