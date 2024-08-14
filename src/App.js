import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import PatientProfile from './PatientProfile'; // Import the PatientProfile component
import * as authService from './authService';
import './App.css';

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

    const handleRegister = async (name, email, password, role) => {
        try {
            await authService.register(name, email, password, role);
            alert('Registration successful. Please log in.');
        } catch (error) {
            console.error('Registration failed:', error.message);
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
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={isAuthenticated ? <PatientProfile currentUser={currentUser} /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <footer className="app-footer">
                    © 2024 My Doctor App. All rights reserved.
                </footer>
            </div>
        </Router>
    );
}

export default App;
