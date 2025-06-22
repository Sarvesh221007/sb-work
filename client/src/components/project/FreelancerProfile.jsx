import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function FreelancerProfile() {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchFreelancer = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get(`/api/projects/freelancer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFreelancer(res.data.freelancer);
        setAvgRating(res.data.averageRating);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error loading freelancer profile:', err);
      }
    };
    fetchFreelancer();
  }, [id]);

  if (!freelancer) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm">
        <h3>{freelancer.name}</h3>
        <p className="text-muted">{freelancer.email}</p>
        {avgRating && !isNaN(avgRating) ? (
          <p><strong>Average Rating:</strong> {avgRating} ⭐</p>
        ) : (
          <p>No ratings yet</p>
        )}

        <hr />
        <h5>Client Reviews</h5>
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="mb-3">
              <h6>{review.title}</h6>
              <p>{review.feedback.message}</p>
              <p>Rating: {'★'.repeat(review.feedback.rating)}{'☆'.repeat(5 - review.feedback.rating)}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
