// src/DoctorProfile.js
import React, { useEffect, useState } from 'react';
import * as authService from './authService';

const DoctorProfile = () => {
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const profile = await authService.getCurrentDoctor();
                setDoctorProfile(profile);
            } catch (err) {
                setError('Failed to fetch doctor profile');
            }
        };

        fetchDoctorProfile();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!doctorProfile) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Doctor Profile</h2>
            <ul>
                <li><strong>Name:</strong> {doctorProfile.fullName}</li>
                <li><strong>Gender:</strong> {doctorProfile.gender}</li>
                <li><strong>Email:</strong> {doctorProfile.email}</li>
                <li><strong>Contact Info:</strong> {doctorProfile.contactInfo}</li>
                <li><strong>Medical Licence Number:</strong> {doctorProfile.medicalLicenceNumber}</li>
                <li><strong>Years of Experience:</strong> {doctorProfile.yearsOfExp}</li>
                <li><strong>Department:</strong> {doctorProfile.department}</li>
            </ul>
        </div>
    );
};

export default DoctorProfile;
