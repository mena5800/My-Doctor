import React, { useState } from 'react';
import RegisterDoctor from './RegisterDoctor';
import RegisterPatient from './RegisterPatient';
import './App.css';

const CombinedRegistration = () => {
    const [role, setRole] = useState(''); // Track the selected role

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div className="registration-container">
            <div className="registration-card">
                <h2>Register</h2>
                <div className="form-group">
                    <label>Select Role:</label>
                    <select value={role} onChange={handleRoleChange} required className="form-control">
                        <option value="">Select Role</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                    </select>
                </div>
                {role === 'doctor' && <RegisterDoctor />}
                {role === 'patient' && <RegisterPatient />}
            </div>
        </div>
    );
};

export default CombinedRegistration;
