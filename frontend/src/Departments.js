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
        <div className="departments-container">
            <h2 className="section-title">Select a Department</h2>
            <ul className="department-list">
                {departments.map((dept, index) => (
                    <li key={index} className="department-item">
                        <Link to={`/doctors/${dept}`} className="department-link">
                            {dept}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departments;
