// src/DoctorsByDepartment.js
import React, { useState, useEffect } from 'react';
import * as authService from './authService';

const DoctorsByDepartment = ({ department }) => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const result = await authService.getDoctorsByDepartment(department);
                setDoctors(result);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDoctors();
    }, [department]);

    return (
        <div>
            <h2>Doctors in {department} Department</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {doctors.map((doc, index) => (
                    <li key={index}>{doc.fullName} - {doc.email} - {doc.medicalLicenceNumber}</li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorsByDepartment;
