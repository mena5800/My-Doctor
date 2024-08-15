// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import CombinedRegistration from './CombinedRegistration';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import Departments from './Departments';
import DoctorsByDepartment from './DoctorsByDepartment';
import PatientProfile from './PatientProfile';
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
            throw error;
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
                    <Route path="/departments" element={<Departments />} /> {/* Departments route */}
                    <Route path="/doctors/:department" element={<DoctorsByDepartment />} /> {/* Doctors by department route */}
                    <Route path="/login" element={isAuthenticated ? <PatientProfile currentUser={currentUser} /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<CombinedRegistration />} /> {/* Updated registration route */}
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
