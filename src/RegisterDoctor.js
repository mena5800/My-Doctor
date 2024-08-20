// src/RegisterDoctor.js
import React, { useState } from 'react';
import * as authService from './authService';

const RegisterDoctor = () => {
    const [doctor, setDoctor] = useState({
        fullName: '',
        gender: '',
        email: '',
        password: '',
        contactInfo: '',
        medicalLicenceNumber: '',
        yearsOfExperience: '',
        department: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const departments = [
        'Cardiology',
        'Neurology',
        'Orthopedic',
        'Pediatrics',
        'Gynecology',
        'General Physician',
        // Add more departments as needed
    ];

    const handleChange = (e) => {
        setDoctor({
            ...doctor,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await authService.registerDoctor(doctor);
            setSuccess('Doctor registration successful!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Register Doctor</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input name="fullName" value={doctor.fullName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gender:</label>
                    <select name="gender" value={doctor.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Email:</label>
                    <input name="email" type="email" value={doctor.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={doctor.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contact Info:</label>
                    <input name="contactInfo" value={doctor.contactInfo} onChange={handleChange} required />
                </div>
                <div>
                    <label>Medical Licence Number:</label>
                    <input name="medicalLicenceNumber" value={doctor.medicalLicenceNumber} onChange={handleChange} required />
                </div>
                <div>
                    <label>Years of Experience:</label>
                    <input name="yearsOfExp" value={doctor.yearsOfExp} onChange={handleChange} required />
                </div>
                <div>
                    <label>Department:</label>
                    <select name="department" value={doctor.department} onChange={handleChange} required>
                        <option value="">Select a Department</option>
                        {departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default RegisterDoctor;
