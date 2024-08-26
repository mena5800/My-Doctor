import React, { useState } from 'react';
import * as authService from './authService';
import { useNavigate } from 'react-router-dom';
import './App.css';

const RegisterPatient = () => {
    const [patient, setPatient] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        role: 'Patient', // Role should be capitalized
        medicalHistory: '',
        age: "",
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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
        await authService.registerPatient({
            name: patient.name,
            email: patient.email,
            password: patient.password,
            role: patient.role,
            gender: patient.gender,
            medicalHistory: patient.medicalHistory,
            age: patient.age
        });
        setSuccess('Patient registration successful!');
        setTimeout(() => {
            navigate('/login'); // Redirect to login after 2 seconds
        }, 2000);
    } catch (err) {
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
                    <label>Name:</label>
                    <input name="name" value={patient.name} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input name="email" type="email" value={patient.email} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={patient.password} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Age:</label>
                    <input name="age" type="number" value={patient.age} onChange={handleChange} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" value={patient.gender} onChange={handleChange} required className="form-control">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Medical History:</label>
                    <textarea name="medicalHistory" value={patient.medicalHistory} onChange={handleChange} required className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default RegisterPatient;
