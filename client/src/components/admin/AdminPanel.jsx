import React, { useEffect, useState } from 'react';
import api from '../../api';
import './AdminPanel.css'; // Add this import

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError('No token found');

    api.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Unauthorized');
      });
  }, []);

  const toggleBlock = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.patch(`/api/admin/users/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Error toggling user');
    }
  };

  return (
    <div className="container mt-5 admin-panel">
      <h2 className="mb-4 fw-bold text-center">Admin Dashboard</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      {users.length === 0 && !error ? (
        <p className="text-center">Loading or no users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle table-bordered">
            <thead className="table-light text-center">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="text-center">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-secondary">{u.role}</span></td>
                  <td>
                    <span className={`badge ${u.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    {u._id === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id ? (
                      <button className="btn btn-sm btn-secondary" disabled>
                        You
                      </button>
                    ) : (
                      <button
                        className={`btn btn-sm ${u.isBlocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                        onClick={() => toggleBlock(u._id)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
