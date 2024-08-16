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
import 'bootstrap-icons/font/bootstrap-icons.css';


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
            <div className="header-strip">
                <div id="topbar">
                    <div class="contact-info">
                        <i class="bi bi-envelope"><a href="mailto:info@example.com">info@example.com</a></i>
                        <i class="bi bi-phone"><span>+1 5589 55488 55</span></i>
                    </div>
                    <div class="social-links">
                        <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>

            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/doctors/:department" element={<DepartmentDoctors />} />
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
