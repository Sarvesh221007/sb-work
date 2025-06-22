// src/components/layout/Footer.jsx
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start align-items-start">
          {/* Brand Section */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-2">SB Works</h5>
            <p className="small">
              Connecting clients with skilled freelancers for quality results, fast and securely.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled small footer-links">
              <li><a href="/" className="footer-link">🏠 Home</a></li>
              <li><a href="/projects" className="footer-link">📁 Projects</a></li>
              <li><a href="/create-project" className="footer-link">📝 Post Project</a></li>
              <li><a href="/login" className="footer-link">🔐 Login</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">Contact Us</h6>
            <p className="small mb-1">📧 support@sbworks.com</p>
            <div className="d-flex justify-content-center justify-content-md-start mt-2 gap-3">
              <a href="#" className="footer-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="footer-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="footer-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light my-4" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} <strong>SB Works</strong> — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
