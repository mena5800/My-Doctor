// src/Home.js
import React from 'react';
import './App.css';

const Home = () => {
    return (
        <section id="hero" className="hero section">
            <div className="container">
                <div className="welcome">
                    <h2>WELCOME TO MY DOCTOR</h2>
                    <p>Connecting you with the best healthcare professionals</p>
                </div>

                <div className="content">
                    <div className="why-box">
                        <h3>Why Choose Us?</h3>
                        <p>
                            We provide exceptional healthcare services with a focus on patient care, offering personalized treatments and expert consultations.
                        </p>
                        <div className="text-center">
                            <a href="#about" className="more-btn"><span>Learn More</span> <i className="bi bi-chevron-right"></i></a>
                        </div>
                    </div>

                    <div className="icon-box">
                        <i className="bi bi-clipboard-data"></i>
                        <h4>Comprehensive Care</h4>
                        <p>We offer a range of medical services tailored to meet your health needs.</p>
                    </div>

                    <div className="icon-box">
                        <i className="bi bi-gem"></i>
                        <h4>Experienced Professionals</h4>
                        <p>Our team consists of highly skilled and experienced doctors.</p>
                    </div>

                    <div className="icon-box">
                        <i className="bi bi-inboxes"></i>
                        <h4>Advanced Technology</h4>
                        <p>We use state-of-the-art technology to ensure the best outcomes for our patients.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
