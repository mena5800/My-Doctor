import React from 'react';
import './App.css';

const Contact = () => {
    return (
        <div id="contact">
            <h1>Contact Us</h1>
            <p>Reach out to us with any questions or concerns.</p>
            <div className="team-container">
                <div className="team-member">
                    <img src={require('./img/bassant.png')} alt="Bassant Aboelhassan" />
                    <h2>Bassant Aboelhassan</h2>
                    <p>Front-End Developer</p>
                    <a href="https://github.com/bass3fas" target="_blank" rel="noopener noreferrer" className="github-icon">
                        <img src={require('./img/github-icon.png')} alt="GitHub" />
                    </a>
                </div>
                <div className="team-member">
                    <img src={require('./img/mina.png')} alt="Mina Safwat" />
                    <h2>Mina Safwat</h2>
                    <p>Back-End Developer</p>
                    <a href="https://github.com/mena5800" target="_blank" rel="noopener noreferrer" className="github-icon">
                        <img src={require('./img/github-icon.png')} alt="GitHub" />
                    </a>
                </div>
                <div className="team-member">
                    <img src={require('./img/adejare.jpeg')} alt="Adejare Abdul Rasheed" />
                    <h2>Adejare Abdul Rasheed</h2>
                    <p>Back-End Developer</p>
                    <a href="https://github.com/Adejare77" target="_blank" rel="noopener noreferrer" className="github-icon">
                        <img src={require('./img/github-icon.png')} alt="GitHub" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
