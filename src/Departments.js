// src/Departments.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Departments = () => {
    const departments = [
        'Cardiology',
        'Neurology',
        'Orthopedic',
        'Pediatrics',
        'Gynecology',
        'General Physician',
        // Add more departments as needed
    ];

    return (
        <div>
            <h2>Select a Department</h2>
            <ul className="department-list">
                {departments.map((dept, index) => (
                    <li key={index}>
                        <Link to={`/doctors/${dept}`}>{dept}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departments;
