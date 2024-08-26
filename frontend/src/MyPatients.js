import React, { useState, useEffect } from 'react';
import { getDoctorPatients } from './authService';
import './App.css';
import femalePatientImage from './img/female-patient.png';
import malePatientImage from './img/male-patient.png';

const PatientCard = ({ name, gender, age, medicalHistory, files }) => {
    const patientImage = gender === 'female' ? femalePatientImage : malePatientImage;

    return (
        <div className="patient-card">
            <img src={patientImage} alt={`${name}`} className="patient-image" />
            <div className="patient-info">
                <h1 className="patient-name">Patient Name: {name}</h1>
                <h4 className="patient-details">Gender: {gender}</h4>
                <p className="patient-details">Age: {age}</p>
                <p className="patient-history">Medical History: {medicalHistory}</p>
                <hr className="patient-divider" />
                <div className="patient-files">
                    <p>Files:</p>
                    <select className="btn-view-files" onChange={(e) => window.open(e.target.value, '_blank')}>
                        <option value="" disabled selected>Select a file</option>
                        {files.map(file => (
                            <option key={file._id} value={file.url}>
                                {file.fileName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

const MyPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const patientsData = await getDoctorPatients();
                setPatients(patientsData);
            } catch (err) {
                console.error('Failed to fetch patients:', err);
                setError('Failed to fetch patients.');
            }
        };

        fetchPatients();
    }, []);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!patients.length) {
        return <div className="no-patients">You have no patients in your list.</div>;
    }

    return (
        <div className="patients-section">
            <h2>My Patients</h2>
            <div className="patient-cards-container">
                {patients.map(patient => (
                    <PatientCard
                        key={patient._id}
                        name={patient.name}
                        gender={patient.gender}
                        age={patient.age}
                        medicalHistory={patient.medicalHistory}
                        files={patient.files}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyPatients;
