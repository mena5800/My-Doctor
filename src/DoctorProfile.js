// src/DoctorProfile.js
import React, { useState, useEffect } from 'react';

function DoctorProfile({ currentUser }) {
    const [profile, setProfile] = useState({
        fullName: '',
        gender: '',
        contactInfo: '',
        medicalLicenceNumber: '',
        yearsOfExp: '',
        department: '',
        // Add other fields as necessary
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) return;

        // Fetch the doctor profile data when the component loads
        fetch(`http://localhost:5000/doctor/current?email=${encodeURIComponent(currentUser.email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setProfile(data);
            }
            setIsLoading(false);
        })
        .catch(err => {
            console.error('Failed to fetch profile:', err);
            setError('Failed to fetch profile.');
            setIsLoading(false);
        });
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/doctor/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...profile, email: currentUser?.email }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save profile');
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile saved successfully:', data);
            alert('Profile saved successfully!');
        })
        .catch(err => {
            console.error('Failed to save profile:', err);
            setError('Failed to save profile.');
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Doctor Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input 
                        type="text" 
                        name="fullName" 
                        value={profile.fullName} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <select 
                        name="gender" 
                        value={profile.gender} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Contact Info:</label>
                    <input 
                        type="text" 
                        name="contactInfo" 
                        value={profile.contactInfo} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Medical Licence Number:</label>
                    <input 
                        type="text" 
                        name="medicalLicenceNumber" 
                        value={profile.medicalLicenceNumber} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Years of Experience:</label>
                    <input 
                        type="number" 
                        name="yearsOfExp" 
                        value={profile.yearsOfExp} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <input 
                        type="text" 
                        name="department" 
                        value={profile.department} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export default DoctorProfile;
