import React from 'react';
import './App.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-content">
                <div className="about-title">
                    <h2>About My Doctor</h2>
                    <p>
                        My Doctor is your trusted partner in healthcare. We connect you with top healthcare professionals to ensure you get the care you deserve.
                    </p>
                </div>
                <div className="about-icons">
                    <div className="icon-box">
                        <i className="bi bi-heart"></i>
                        <h4>Trusted Care</h4>
                        <p>Our platform ensures you are connected with only the most trusted healthcare providers.</p>
                    </div>
                    <div className="icon-box">
                        <i className="bi bi-shield-check"></i>
                        <h4>Verified Professionals</h4>
                        <p>All doctors on our platform are verified and have a proven track record of excellence.</p>
                    </div>
                    <div className="icon-box">
                        <i className="bi bi-person-bounding-box"></i>
                        <h4>Personalized Service</h4>
                        <p>We offer personalized services tailored to meet your unique healthcare needs.</p>
                    </div>
                </div>
                <div className="pulsating-play-btn">
                    <a href="#about-video" className="play-btn"><i className="bi bi-play-fill"></i></a>
                </div>
            </div>
        </section>
    );
};

export default About;
