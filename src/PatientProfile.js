import React, { useState, useEffect } from 'react';
import './App.css';

function PatientProfile({ currentUser, onLogout }) {
    const [profile, setProfile] = useState({
        fullName: '', // Include fullName if you want to display it
        age: '',
        gender: '',
        medicalHistory: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        // Fetch the patient profile data when the component loads
        fetch(`http://localhost:5000/patientprofile?email=${encodeURIComponent(currentUser.email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`, // Assuming you use JWT for authorization
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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', profile.fullName); // Use fullName here
        formData.append('age', profile.age);
        formData.append('gender', profile.gender);
        formData.append('medicalHistory', profile.medicalHistory);

        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        fetch('http://localhost:5000/patientprofile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`, // Assuming you use JWT for authorization
            },
            body: formData,
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
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Patient Profile</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Full Name:</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={profile.fullName} 
                            onChange={handleChange} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Age:</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={profile.age} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <select name="gender" value={profile.gender} onChange={handleChange} required className="form-control">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Medical History:</label>
                        <textarea 
                            name="medicalHistory" 
                            value={profile.medicalHistory} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Upload File:</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="form-control file-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Profile</button>
                </form>
                <button onClick={onLogout} className="btn btn-secondary logout-btn">Logout</button>
            </div>
        </div>
    );
}

export default PatientProfile;
