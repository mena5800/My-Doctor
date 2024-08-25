import React, { useState, useEffect } from 'react';
import { getPatientDoctors } from './authService';
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

export default MyDoctors;
