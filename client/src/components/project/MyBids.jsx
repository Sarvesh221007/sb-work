import React, { useEffect, useState } from 'react';
import api from '../../api';

export default function MyBids() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get('/api/projects/my-bids', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Error loading bids:', err);
      }
    };
    fetchBids();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Your Bid Projects</h3>
      {projects.map(p => (
        <div key={p._id} className="card mb-3 p-3 shadow-sm">
          <h5>{p.title}</h5>
          <p>{p.description}</p>
          <p><strong>Budget:</strong> ₹{p.budget}</p>
          {p.selectedFreelancer?._id === p.bids.find(b => b.freelancer?._id === p.selectedFreelancer?._id)?.freelancer?._id && (
            <span className="badge bg-success">✅ You were selected</span>
          )}
        </div>
      ))}
    </div>
  );
}
