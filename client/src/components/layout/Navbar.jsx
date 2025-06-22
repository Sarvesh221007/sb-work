import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api'; // needed to fetch user info
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
      }).catch(() => {
        setUser(null);
        localStorage.removeItem('token');
      });
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const nav = document.getElementById('navbarNav');
    if (nav && nav.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(nav, { toggle: false });
      bsCollapse.hide();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top custom-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">SB Works</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {/* Always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/projects">Projects</Link>
            </li>

            {/* CLIENT */}
            {user?.role === 'client' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-project">Post Project</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-projects">My Projects</Link>
                </li>
              </>
            )}

            {/* FREELANCER */}
            {user?.role === 'freelancer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bids">My Bids</Link>
                </li>
              </>
            )}

            {/* ADMIN */}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-light btn-sm" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
