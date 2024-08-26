import React, { useState, useEffect } from "react";
import { getCurrentUser } from "./authService"; // Use this to fetch the doctor's profile
import { getPatientProfile } from "./authService"; // To fetch individual patient profiles

function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const doctor = await getCurrentUser();
        if (doctor && doctor.patients) {
          const patientsData = await Promise.all(
            doctor.patients.map(async (patientId) => {
              const patientProfile = await getPatientProfile(patientId);
              return patientProfile;
            })
          );
          setPatients(patientsData);
        }
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError("Failed to fetch patients.");
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
        {patients.map((patient) => (
          <div key={patient._id} className="patient-card">
            <h3>{patient.name}</h3>
            <p>Age: {patient.age}</p>
            <p>Medical History: {patient.medicalHistory}</p>
            {/* Add more details as needed */}
            <button className="btn btn-primary" onClick={() => navigate(`/patient/${patient._id}`)}>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPatients;
