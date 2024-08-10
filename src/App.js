// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import * as authService from './authService';

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
            <div>
                <header>
                    <h1>Welcome to My Doctor App</h1>
                    {isAuthenticated && (
                        <>
                            <p>Welcome back, {currentUser?.name}</p>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </header>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={isAuthenticated ? <div>Main Application Component Here</div> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
