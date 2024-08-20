import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as authService from './authService';
import './App.css';

const DepartmentDoctors = () => {
    const { department } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        authService.isAuthenticated().then(isAuth => {
            setIsAuthenticated(isAuth);
            if (isAuth) {
                setCurrentUser(authService.getCurrentUser());
            }
        });
    }, []);

    useEffect(() => {
        if (!department) return;

        fetch(`http://localhost:5000/alldoctors/${encodeURIComponent(department)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                return response.json();
            })
            .then(data => {
                setDoctors(data);
                setIsLoading(false);
            })
            .catch(err => {
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
        <div id="doctors-list" className="department-doctors">
            <h2>Doctors in {department} Department</h2>
            {doctors.length === 0 ? (
                <p>No doctors found in this department.</p>
            ) : (
                <ul className="doctor-list">
                    {doctors.map((doctor, index) => (
                        <li key={index} className="doctor-item">
                            <div className="doctor-details">
                                <span className="doctor-name">
                                    {doctor.fullName} - {doctor.yearsOfExp} years of experience
                                </span>
                                <div className="doctor-action">
                                    {isAuthenticated && currentUser?.role === 'patient' ? (
                                        <button className="btn btn-book-now">Book Now</button>
                                    ) : (
                                        <Link to="/login">
                                            <button className="btn btn-login-schedule">Login to See Schedule</button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DepartmentDoctors;
