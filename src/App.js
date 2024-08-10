// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import * as authService from './authService';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (email, password) => {
        try {
            await authService.login(email, password);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error.message);
            setIsAuthenticated(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div>
                <header>
                    <h1>Welcome to My Doctor App</h1>
                    {isAuthenticated && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </header>
                <Routes>
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <div> {/* Add your main application components here */} </div>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
