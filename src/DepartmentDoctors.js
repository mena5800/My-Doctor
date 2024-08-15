import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DepartmentDoctors = () => {
    const { department } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!department) return;

        fetch(`http://localhost:5000/doctors/department/${encodeURIComponent(department)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched doctors:', data);  // Debugging
                setDoctors(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch doctors:', err);
                setError('Failed to fetch doctors.');
                setIsLoading(false);
            });
    }, [department]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2>Doctors in {department} Department</h2>
            {doctors.length === 0 ? (
                <p>No doctors found in this department.</p>
            ) : (
                <ul>
                    {doctors.map((doctor, index) => (
                        <li key={index}>
                            {doctor.fullName} - {doctor.yearsOfExp} years of experience
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};

export default DepartmentDoctors;
