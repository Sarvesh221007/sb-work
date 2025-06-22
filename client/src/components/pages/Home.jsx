// src/components/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <>
      <div className="home-hero text-white text-center d-flex align-items-center">
        <div className="container hero-content">
          <h1 className="display-4 fw-bold">Hire Top Freelancers</h1>
          <p className="lead mb-4">Post your project and get work done efficiently.</p>
          <Link to="/register" className="btn btn-lg btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="why-section py-5 text-center bg-light">
        <div className="container">
          <h2 className="mb-5 fw-bold">Why Choose SB Works?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <h4>✅ Verified Freelancers</h4>
                <p>Work with trusted professionals who deliver quality work on time.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <h4>🔒 Secure Payments</h4>
                <p>Payments are held securely and only released once you're satisfied.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <h4>🕑 24/7 Support</h4>
                <p>We’re here to help you anytime with fast and friendly support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 text-center">
        <div className="container">
          <h2 className="mb-5 fw-bold">How It Works</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="step-box p-3 border rounded shadow-sm">
                <h5>📝 Post a Project</h5>
                <p>Describe your needs and budget. It’s quick and easy.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step-box p-3 border rounded shadow-sm">
                <h5>📩 Receive Bids</h5>
                <p>Freelancers apply with proposals and quotes.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step-box p-3 border rounded shadow-sm">
                <h5>🎯 Hire & Work</h5>
                <p>Select the best fit and collaborate directly in the platform.</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="step-box p-3 border rounded shadow-sm">
                <h5>🌟 Review & Pay</h5>
                <p>Pay only when the work is completed to your satisfaction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
