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
import DoctorProfile from './DoctorProfile';
import * as authService from './authService';
import './App.css';
import DepartmentDoctors from './DepartmentDoctors';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        const checkAuth = async () => {
            const isAuth = await authService.isAuthenticated();
            setIsAuthenticated(isAuth);
            if (isAuth) {
                try {
                    const user = await authService.getCurrentUser();
                    setCurrentUser(user);
                } catch (error) {
                    console.error('Failed to fetch current user:', error.message);
                    setIsAuthenticated(false);
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const user = await authService.login(email, password);
            setIsAuthenticated(true);
            setCurrentUser(user); // user object now contains role, name, etc.
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
            <Navbar 
                isAuthenticated={isAuthenticated} 
                currentUser={currentUser} 
                handleLogout={handleLogout} 
            />

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
                        (currentUser?.role === 'Doctor' ? <DoctorProfile currentUser={currentUser} onLogout={handleLogout} /> : <PatientProfile currentUser={currentUser} onLogout={handleLogout} />) 
                        : <Login onLogin={handleLogin} />
                    } />
                    <Route path="/register" element={<CombinedRegistration />} />
                    <Route path="/profile" element={
                        currentUser?.role === 'Doctor' 
                        ? <DoctorProfile currentUser={currentUser} onLogout={handleLogout} />
                        : <PatientProfile currentUser={currentUser} onLogout={handleLogout} />
                    } />
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
