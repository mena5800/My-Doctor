import React, { useState, useEffect } from 'react';

function PatientProfile({ currentUser }) {
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        medicalHistory: '',
        // Add other fields as necessary
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) return;

        // Fetch the patient profile data when the component loads
        fetch(`http://localhost:5000/patientprofile?email=${encodeURIComponent(currentUser.email)}`, {
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
        fetch('http://localhost:5000/patientprofile', {
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
            <h2>Patient Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={profile.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Age:</label>
                    <input 
                        type="number" 
                        name="age" 
                        value={profile.age} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Medical History:</label>
                    <textarea 
                        name="medicalHistory" 
                        value={profile.medicalHistory} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                {/* Add more fields as needed */}
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export default PatientProfile;
