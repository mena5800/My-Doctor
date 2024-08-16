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
import PatientProfile from './PatientProfile';
import DoctorProfile from './DoctorProfile'; // Import DoctorProfile
import * as authService from './authService';
import './App.css';
import DepartmentDoctors from './DepartmentDoctors';

// Main page component combining all sections except Departments
const MainPage = () => {
    return (
        <>
            <Home />
            <About />
            <Services />
            <Contact />
        </>
    );
};

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
                    <div id="wlc">
                        <h1>My Doctor</h1>
                        <h2>We Help you reach your Doctor!</h2>
                    </div>
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
                    <Route path="/" element={<MainPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/doctors/:department" element={<DepartmentDoctors/>} />
                    <Route path="/login" element={
                        isAuthenticated ? 
                        (currentUser?.role === 'doctor' ? <DoctorProfile currentUser={currentUser} /> : <PatientProfile currentUser={currentUser} />) 
                        : <Login onLogin={handleLogin} />
                    } />
                    <Route path="/register" element={<CombinedRegistration />} />
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
