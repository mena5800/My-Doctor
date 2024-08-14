// src/Login.js
import React, { useState } from 'react';
import './App.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear any existing error message
        try {
            await onLogin(email, password);
        } catch (error) {
            // Set error message for display if login fails
            setError(error.message);
        }
    };

    return (
        <div id="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>} 
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
