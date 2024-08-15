// src/RegisterPatient.js
import React, { useState } from 'react';
import * as authService from './authService';

const RegisterPatient = () => {
    const [patient, setPatient] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: '',
        medicalHistory: '',
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
            // First, register the user in the users collection
            await authService.register(patient.name, patient.email, patient.password, patient.role);

            // Then, save the rest of the patient profile in the patientprofile collection
            await authService.savePatientProfile({
                email: patient.email,
                age: patient.age,
                gender: patient.gender,
                medicalHistory: patient.medicalHistory,
                // Add more fields as needed
            });

            setSuccess('Patient registration successful!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Register Patient</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input name="name" value={patient.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input name="email" type="email" value={patient.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={patient.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Age:</label>
                    <input name="age" type="number" value={patient.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gender:</label>
                    <select name="gender" value={patient.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Medical History:</label>
                    <textarea name="medicalHistory" value={patient.medicalHistory} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default RegisterPatient;
