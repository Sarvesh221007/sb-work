import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';


export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [projectRes, userRes] = await Promise.all([
          api.get('/api/projects/all', { headers }),
          api.get('/api/auth/me', { headers }),
        ]);

        setProjects(projectRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

  const handleBid = async (e, p) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const { amount, message } = e.target;

    try {
      await api.post(`/api/projects/${p._id}/bid`, {
        amount: amount.value,
        message: message.value,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Bid placed!');
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Failed to place bid');
    }
  };

  const handleSelectFreelancer = async (projectId, freelancerId) => {
    const token = localStorage.getItem('token');
    try {
      await api.post(`/api/projects/${projectId}/select`, {
        freelancerId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Freelancer selected!');
      const updated = await api.get('/api/projects/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(updated.data);
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Failed to select freelancer');
    }
  };

  const handleSubmitWork = async (e, projectId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const file = e.target.submission.files[0]; // input name="submission"

    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append('submission', file);

    try {
      await api.post(
        `/api/projects/${projectId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      alert('✅ Work submitted successfully!');
      const updated = await api.get('/api/projects/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(updated.data);
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Submission failed');
    }
  };


  const handleFeedback = async (e, p) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const { message, rating } = e.target;

    try {
      await api.post(`/api/projects/${p._id}/feedback`, {
        message: message.value,
        rating: parseInt(rating.value),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Feedback submitted!');
      const updated = await api.get('/api/projects/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(updated.data);
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Feedback failed');
    }
  };

  return (
    <div className="container pt-4">
      <h2 className="mb-4 text-center">All Projects</h2>

      {/* Filter */}
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
          <select
            id="categoryFilter"
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Design">Design</option>
            <option value="Web Development">Web Development</option>
            <option value="Writing">Writing</option>
          </select>
        </div>
      </div>

      <div className="row">
        {projects
          .filter(p => !categoryFilter || p.category === categoryFilter)
          .map(p => {
            return (
              <div className="col-md-6 col-lg-4 mb-4" key={p._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.title}</h5>
                    <p className="text-muted">{p.description}</p>
                    <p><strong>Budget:</strong> ₹{p.budget}</p>

                    {/* Bids + Select */}
                    {p.bids?.length > 0 && (
                      <div>
                        <h6>Bids:</h6>
                        {p.bids.map((bid) => (
                          <div key={bid._id} className="border rounded p-2 mb-2 small">
                            <strong>{bid.freelancer?.name}</strong>
                            {bid.freelancer?.avgRating ? (
                              <span> – {bid.freelancer.avgRating.toFixed(1)} ★</span>
                            ) : <span> – No rating</span>}
                            <p className="mb-1">{bid.message}</p>
                            <p className="mb-1">Bid: ₹{bid.amount}</p>

                            {/* Select button for client */}
                            {user?.role === 'client' && !p.selectedFreelancer && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleSelectFreelancer(p._id, bid.freelancer._id)}
                              >
                                Select Freelancer
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Place Bid */}
                    {user?.role === 'freelancer' && !p.selectedFreelancer && p.client?._id !== user._id && (
                      <form onSubmit={(e) => handleBid(e, p)} className="mt-auto">
                        <input name="amount" type="number" className="form-control mb-2" placeholder="Bid Amount" required />
                        <input name="message" className="form-control mb-2" placeholder="Message" required />
                        <button type="submit" className="btn btn-sm btn-primary w-100">Place Bid</button>
                      </form>
                    )}

                    {/* Submit Work */}
                    {user?.role === 'freelancer' &&
                      typeof p.selectedFreelancer === 'object' &&
                      p.selectedFreelancer._id === user._id &&
                      !p.isSubmitted && (
                        <form onSubmit={(e) => handleSubmitWork(e, p._id)} className="mt-3" encType="multipart/form-data">
                          <input
                            type="file"
                            name="submission"
                            accept=".pdf,.doc,.docx,.zip,.jpg,.png"
                            className="form-control mb-2"
                            required
                          />
                          <button type="submit" className="btn btn-success w-100">Submit Work</button>
                        </form>

                      )}


                    {/* Show Submitted Work */}
                    {p.isSubmitted && (
                      <div className="alert alert-info mt-3">
                        <strong>Work Submitted:</strong> {p.submission}
                      </div>
                    )}

                    {/* Feedback */}
                    {user?.role === 'client' && p.isSubmitted && !p.feedback && (
                      <form onSubmit={(e) => handleFeedback(e, p)} className="mt-3">
                        <textarea name="message" className="form-control mb-2" placeholder="Your feedback" required />
                        <select name="rating" className="form-select mb-2" required>
                          <option value="">Rate the freelancer</option>
                          {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>{'★'.repeat(r)}</option>
                          ))}
                        </select>
                        <button className="btn btn-warning w-100">Submit Feedback</button>
                      </form>
                    )}

                    {/* Freelancer Info */}
                    {p.selectedFreelancer && typeof p.selectedFreelancer === 'object' && (
                      <p className="mt-3 small">
                        <strong>Freelancer:</strong>{' '}
                        <Link to={`/freelancer/${p.selectedFreelancer._id}`} className="text-primary">
                          View Profile
                        </Link>
                      </p>
                    )}

                    {/* Show Feedback */}
                    {p.feedback && (
                      <div className="mt-3 small">
                        <strong>Client Feedback:</strong>
                        <p>{p.feedback.message}</p>
                        <p>Rating: {'★'.repeat(p.feedback.rating)}{'☆'.repeat(5 - p.feedback.rating)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  );
}
