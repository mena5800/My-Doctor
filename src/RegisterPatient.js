import React, { useState } from 'react';
import * as authService from './authService';
import './App.css';

const RegisterPatient = () => {
    const [patient, setPatient] = useState({
        fullName: '', // Changed from name to fullName
        email: '',
        password: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await authService.register(patient.fullName, patient.email, patient.password, patient.role);
            setSuccess('Patient registration successful!');
        } catch (err) {
            // Handle specific error messages
            if (err.message.includes('Email already exists')) {
                setError('User already exists');
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <div className="register-form">
            <h2>Register Patient</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input name="fullName" value={patient.fullName} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input name="email" type="email" value={patient.email} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={patient.password} onChange={handleChange} required className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default RegisterPatient;
