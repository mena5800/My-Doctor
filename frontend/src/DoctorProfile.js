import React, { useState, useEffect } from "react";

function DoctorProfile({ currentUser, onLogout }) {
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    contactInfo: "",
    medicalLicenceNumber: "",
    yearsOfExperience: "",
    department: "",
    // Add other fields as necessary
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    // Fetch the doctor profile data when the component loads
    fetch(
      `${process.env.API_BASE}/doctor/current?email=${encodeURIComponent(
        currentUser.email
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        return response.json();
      })
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
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.API_BASE}/doctor/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...profile, email: currentUser?.email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save profile");
        }
        return response.json();
      })
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
        <h2>Doctor Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name:</label>
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
            <label>Contact Info:</label>
            <input
              type="text"
              name="contactInfo"
              value={profile.contactInfo}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Medical Licence Number:</label>
            <input
              type="text"
              name="medicalLicenceNumber"
              value={profile.medicalLicenceNumber}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Years of Experience:</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={profile.yearsOfExperience}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={profile.department}
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

export default DoctorProfile;
