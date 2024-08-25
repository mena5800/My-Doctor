import React, { useState, useEffect } from 'react';
import { getPatientDoctors, removeDoctorFromPatient } from './authService';
import './App.css';
import femaleDoctorImage from './img/female-doc.png';
import maleDoctorImage from './img/male-doc.png';

const DoctorCard = ({ doctorId, name, department, yearsOfExperience, gender, onRemove }) => {
    const doctorImage = gender === 'female' ? femaleDoctorImage : maleDoctorImage;

    const handleRemoveDoctor = async () => {
        try {
            await onRemove(doctorId);
            alert(`Doctor ${name} has been removed from your list.`);
        } catch (error) {
            console.error('Error removing doctor:', error);
            alert('Failed to remove doctor. Please try again.');
        }
    };

    return (
        <div className="doctor-card">
            <img src={doctorImage} alt={`${name}`} className="doctor-image" />
            <div className="doctor-info">
                <h1 className="doctor-name">{name}</h1>
                <h4 className="doctor-department">{department}</h4>
                <hr className="doctor-divider" />
                <p className="doctor-description">
                    Doctor {name} has {yearsOfExperience} years of experience in {department}.
                </p>
                <div className="doctor-social-icons">
                    <i className="bi bi-facebook"></i>
                    <i className="bi bi-instagram"></i>
                    <i className="bi bi-linkedin"></i>
                    <button className="btn-remove-doctor" onClick={handleRemoveDoctor}>Remove</button>
                </div>
            </div>
        </div>
    );
};

const MyDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        getPatientDoctors()
            .then(setDoctors)
            .catch((err) => {
                console.error('Error fetching patient doctors:', err);
                setError('Failed to fetch patient doctors');
            });
    }, []);

    const handleRemoveDoctor = async (doctorId) => {
        try {
            await removeDoctorFromPatient(doctorId);
            // Update the state to remove the doctor from the list
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        } catch (error) {
            console.error('Error removing doctor:', error);
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!doctors.length) {
        return <div className="no-doctors">You have no doctors in your list.</div>;
    }

    return (
        <div className="doctors-section">
            <h2>My Doctors</h2>
            <div className="doctor-cards-container">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctorId={doctor.id}
                        name={doctor.name}
                        department={doctor.department}
                        yearsOfExperience={doctor.yearsOfExperience}
                        gender={doctor.gender}
                        onRemove={handleRemoveDoctor}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyDoctors;