import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from './Login';
import CombinedRegistration from './CombinedRegistration';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import Doctors from './Doctors';
import MyDoctors from './MyDoctors';
import MyPatients from './MyPatients'; 
import PatientProfile from './PatientProfile';
import DoctorProfile from './DoctorProfile';
import Chat from './Chat';
import * as authService from './authService';
import './App.css';
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
    const [isChatVisible, setIsChatVisible] = useState(false); // State to control chat visibility

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
        window.location.href = '/login';
    };

    const toggleChatVisibility = () => {
        setIsChatVisible(!isChatVisible); // Toggle the chat visibility
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
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/mydoctors" element={<MyDoctors />} /> 
                    <Route path="/mypatients" element={<MyPatients />} /> 
                    <Route path="/login" element={
                        isAuthenticated ? 
                        (currentUser?.role === 'Doctor' ? <DoctorProfile onLogout={handleLogout} /> : <PatientProfile onLogout={handleLogout} />) 
                        : <Login onLogin={handleLogin} />
                    } />
                    <Route path="/register" element={<CombinedRegistration />} />
                    <Route path="/my-doctors" element={<MyDoctors />} />
                    <Route path="/chat/:chatId" element={<Chat />} />
                    <Route path="/profile" element={
                        currentUser?.role === 'Doctor' 
                        ? <DoctorProfile onLogout={handleLogout} />
                        : <PatientProfile onLogout={handleLogout} />
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                {isAuthenticated && (
                    <>
                        <button className="chat-tab" onClick={toggleChatVisibility}>
                            {isChatVisible ? 'Close Chat' : 'Open Chat'}
                        </button>
                        <Chat isSmall={true} visible={isChatVisible} /> {/* Pass visibility prop */}
                    </>
                )}
                <footer className="app-footer">
                    © 2024 My Doctor App. All rights reserved.
                </footer>
            </div>
        </Router>
    );
}

export default App;
