// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import * as authService from './authService';
import './App.css';  // Ensure you import your styles here
import Navbar from './Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        authService.isAuthenticated().then(isAuth => {
            setIsAuthenticated(isAuth);
            if (isAuth) {
                setCurrentUser(authService.getCurrentUser());
            }
        });
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const user = await authService.login(email, password);
            setIsAuthenticated(true);
            setCurrentUser(user);
        } catch (error) {
            console.error('Login failed:', error.message);
            setIsAuthenticated(false);
            throw error; // Re-throw the error to be caught by Login.js
        }
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <header>
                    <h1>My Doctor</h1>
                    <h2>We Help you reach your Doctor!</h2>
                    {isAuthenticated && (
                        <>
                            <div id="wlcmsg">
                            <p>Welcome back, {currentUser?.name}</p>
                            <button onClick={handleLogout}>Logout</button>
                            </div>
                        </>
                    )}
                </header>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={isAuthenticated ? 
                        <div id="logged">
                            <h3>How Do you Feel Today?</h3>
                            <div className="action-buttons">
                                <button onClick={() => console.log('Scheduling appointment...')}>Schedule a Doctor Appointment</button>
                                <button onClick={() => console.log('Uploading medical reports...')}>Upload Medical Reports</button>
                            </div>
                        </div> : <Navigate to="/login" />} />
                        
                </Routes>

                <div>
                    <div id="service">
                        <h2>Our Services</h2>
                    </div>
                    <div id="about">
                        <h2>About Us</h2>
                    </div>
                    <div id="contact">
                        <h2>Contact Us</h2>
                    </div>
                </div>
                <footer className="app-footer">
                    © 2024 My Doctor App. All rights reserved.
                </footer>
            </div>
        </Router>
    );
}

export default App;
