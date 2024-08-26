import React from 'react';
import './App.css';

const Services = () => {
  return (
    <div id="services" className="services-container">
      <h2 className="section-title">Our Services</h2>
      <p className="section-description">
        We offer a variety of services to help you stay healthy.
      </p>
      <div className="stats-container">
        <div className="stats-item">
          <div className="icon-wrapper">
            <i className="fas fa-user-md"></i> {/* Doctor icon */}
          </div>
          <span>85</span>
          <p>Doctors</p>
        </div>
        <div className="stats-item">
          <div className="icon-wrapper">
            <i className="fas fa-hospital"></i> {/* Department icon */}
          </div>
          <span>18</span>
          <p>Departments</p>
        </div>
        <div className="stats-item">
          <div className="icon-wrapper">
            <i className="fas fa-flask"></i> {/* Research Labs icon */}
          </div>
          <span>12</span>
          <p>Research Labs</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
