import React, { useState, useEffect } from 'react';
import './App.css';
import femaleDoctorImage from './img/female-doc.png';
import maleDoctorImage from './img/male-doc.png';

const DoctorCard = ({ name, department, yearsOfExperience, gender }) => {
    const doctorImage = gender === 'female' ? femaleDoctorImage : maleDoctorImage;

    return (
        <div className="doctor-card">
            <img src={doctorImage} alt={`${name}`} className="doctor-image" />
            <div className="doctor-info">
                <h1 className="doctor-name">{name}</h1>
                <h4 className="doctor-department">{department}</h4>
                <hr className="doctor-divider" />
                <p className="doctor-description">
                    Doctor {name} is a Doctor with {yearsOfExperience} years of experience in {department} diseases.
                </p>
                <div className="doctor-social-icons">
                    <i className="bi bi-facebook"></i>
                    <i className="bi bi-instagram"></i>
                    <i className="bi bi-linkedin"></i>
                </div>
            </div>
        </div>
    );
};

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch doctors
        fetch(`${process.env.API_BASE}/doctors`, {
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch doctors');
            return response.json();
        })
        .then(data => {
            const doctorsArray = Object.entries(data).flatMap(([department, docs]) =>
                docs.map(doctor => ({ ...doctor, department }))
            );
            setDoctors(doctorsArray);
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
            setError('Failed to fetch doctors');
        });
    }, []);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!doctors.length) {
        return (
            <div className="no-doctors">
                <button onClick={() => window.location.href = '/login'} className="login-button">
                    Login to see doctors
                </button>
            </div>
        );
    }

    return (
        <div className="doctors-section">
            <h2>Our Doctors</h2>
            <div className="doctor-cards-container">
                {doctors.map((doctor, index) => (
                    <DoctorCard
                        key={index}
                        name={doctor.name}
                        department={doctor.department}
                        yearsOfExperience={doctor.yearsOfExperience}
                        gender={doctor.gender}
                    />
                ))}
            </div>
        </div>
    );
};

export default Doctors;
