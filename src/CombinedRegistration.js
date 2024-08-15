// src/CombinedRegistration.js
import React, { useState } from 'react';
import RegisterDoctor from './RegisterDoctor';
import RegisterPatient from './RegisterPatient';

const CombinedRegistration = () => {
    const [role, setRole] = useState(''); // Track the selected role

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div>
            <h2>Register</h2>
            <div>
                <label>Select Role:</label>
                <select value={role} onChange={handleRoleChange} required>
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                </select>
            </div>
            {role === 'doctor' && <RegisterDoctor />}
            {role === 'patient' && <RegisterPatient />}
        </div>
    );
};

export default CombinedRegistration;
