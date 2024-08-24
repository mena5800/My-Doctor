import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = ({ isAuthenticated, currentUser, handleLogout }) => {
    // JavaScript to handle the scrolling behavior
    const handleScroll = () => {
        const topbar = document.getElementById('topbar');
        const navbar = document.querySelector('.navbar');

        if (window.scrollY > 40) {
            topbar.style.top = '-40px'; // Hides the topbar when scrolled
            navbar.style.top = '0'; // Moves the navbar to the top
        } else {
            topbar.style.top = '0';
            navbar.style.top = '40px'; // Keeps the navbar below the topbar
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div id="topbar">
                <div className="contact-info">
                    <i className="bi bi-envelope">info@example.com</i>
                    <i className="bi bi-phone"><span>+1 5589 55488 55</span></i>
                </div>
                <div className="social-links">
                    <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                    <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                </div>
            </div>
            <nav className="navbar">
                <div className="logo">
                    <Link to="/" className="navbar-brand">My Doctor</Link>
                </div>
                <ul className="nav-menu">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                    <li><Link to="/departments">Departments</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><span className="welcome-message">Hi, {currentUser?.name}</span></li>
                            <li><Link to="/profile" className="btn btn-profile">Profile</Link></li>
                            <li><button onClick={handleLogout} className="btn btn-logout">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="btn btn-login">Login</Link></li>
                            <li><Link to="/register" className="btn btn-register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
