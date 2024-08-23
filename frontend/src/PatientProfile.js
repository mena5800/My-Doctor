import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "./authService";

function PatientProfile({ onLogout }) {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
    // Add other fields as necessary
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the patient profile data when the component loads
    getProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setError("Failed to fetch profile.");
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(profile)
      .then((data) => {
        console.log("Profile saved successfully:", data);
        alert("Profile saved successfully!");
      })
      .catch((err) => {
        console.error("Failed to save profile:", err);
        setError("Failed to save profile.");
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
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
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
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              required
              className="form-control"
            >
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
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </form>
        <button onClick={onLogout} className="btn btn-secondary logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default PatientProfile;
