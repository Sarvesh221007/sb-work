import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const res = await api.get('/api/projects/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const selectFreelancer = async (projectId, freelancerId) => {
    try {
      await api.post(`/api/projects/${projectId}/select`, { freelancerId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Freelancer selected!');
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Error selecting freelancer');
    }
  };

  const handleFeedbackSubmit = async (e, projectId) => {
    e.preventDefault();
    const { message, rating } = e.target;

    try {
      await api.post(`/api/projects/${projectId}/feedback`, {
        message: message.value,
        rating: parseInt(rating.value),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Feedback submitted');
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.msg || '❌ Error submitting feedback');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">📌 My Posted Projects</h2>

      {projects.length === 0 ? (
        <p className="text-center text-muted">You haven’t posted any projects yet.</p>
      ) : (
        <div className="row">
          {projects.map((p) => (
            <div key={p._id} className="col-md-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title">{p.title}</h4>
                  <p className="card-text">{p.description}</p>
                  <p><strong>Budget:</strong> ₹{p.budget}</p>

                  <h6 className="mt-3">📨 Bids Received</h6>
                  {p.bids.length === 0 ? (
                    <p className="text-muted">No bids yet.</p>
                  ) : (
                    p.bids.map((bid) => (
                      <div key={bid._id} className="border rounded p-2 mb-2 small">
                        <strong>{bid.freelancer?.name}</strong>
                        {bid.freelancer?.avgRating && (
                          <span className="text-warning"> – {bid.freelancer.avgRating.toFixed(1)} ★</span>
                        )}
                        <p className="mb-1">{bid.message}</p>
                        <p className="mb-1">Bid: ₹{bid.amount}</p>
                        {!p.selectedFreelancer && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => selectFreelancer(p._id, bid.freelancer._id)}
                          >
                            Select Freelancer
                          </button>
                        )}
                      </div>
                    ))
                  )}

                  {p.selectedFreelancer && (
                    <div className="mt-2">
                      <span className="badge bg-success">Freelancer Selected</span>{' '}
                      <a href={`/freelancer/${p.selectedFreelancer._id}`} className="text-decoration-none ms-2">
                        View Profile
                      </a>
                    </div>
                  )}

                  {p.isSubmitted && (
                    <div className="alert alert-info mt-3">
                      <strong>📤 Work Submitted:</strong>
                      <p className="mb-0">{p.submission}</p>
                    </div>
                  )}

                  {/* Feedback */}
                  {p.isSubmitted && !p.feedback && (
                    <form onSubmit={(e) => handleFeedbackSubmit(e, p._id)} className="mt-3">
                      <h6>🌟 Provide Feedback</h6>
                      <textarea
                        name="message"
                        className="form-control mb-2"
                        placeholder="Your feedback message"
                        required
                      />
                      <select name="rating" className="form-select mb-2" required>
                        <option value="">Select Rating</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>{'★'.repeat(r)}</option>
                        ))}
                      </select>
                      <button className="btn btn-primary w-100">Submit Feedback</button>
                    </form>
                  )}

                  {/* Existing Feedback */}
                  {p.feedback && (
                    <div className="mt-3">
                      <h6>✅ Feedback Given:</h6>
                      <p className="mb-1">{p.feedback.message}</p>
                      <p className="text-warning mb-0">
                        Rating: {'★'.repeat(p.feedback.rating)}{'☆'.repeat(5 - p.feedback.rating)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
