import React, { useState, useEffect } from 'react';
import { getPatientDoctors, removeDoctorFromPatient, createChat } from './authService';
import './App.css';
import femaleDoctorImage from './img/female-doc.png';
import maleDoctorImage from './img/male-doc.png';
import Chat from './Chat';

const DoctorCard = ({ doctorId, name, department, yearsOfExperience, gender, onChatNow, onRemove }) => {
    const doctorImage = gender === 'female' ? femaleDoctorImage : maleDoctorImage;

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
                    <button className="btn-chat-now" onClick={() => onChatNow(doctorId)}>Chat Now!</button>
                    <button className="btn-remove-doctor" onClick={() => onRemove(doctorId)}>Remove</button>
                </div>
            </div>
        </div>
    );
};

const MyDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat
    const [currentChatId, setCurrentChatId] = useState(null); // Track the current chat ID

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
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        } catch (error) {
            console.error('Error removing doctor:', error);
        }
    };

    const handleChatNow = async (doctorId) => {
        try {
            const chat = await createChat(doctorId);
            setCurrentChatId(chat._id); // Set the chat ID
            setIsChatOpen(true); // Open the chat tab
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Failed to start chat. Please try again.');
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen); // Toggle chat open/close
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
                        onChatNow={handleChatNow}
                        onRemove={handleRemoveDoctor}
                    />
                ))}
            </div>
            <button className="chat-tab" onClick={toggleChat}>
                {isChatOpen ? 'Close Chat' : 'Open Chat'}
            </button>
            {isChatOpen && (
                <div className="chat-container">
                    <Chat chatId={currentChatId} isSmall={true} />
                </div>
            )}
        </div>
    );
};

export default MyDoctors;
