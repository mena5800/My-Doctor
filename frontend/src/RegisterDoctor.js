import React, { useState } from "react";
import * as authService from "./authService";
import "./App.css";

const RegisterDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    contactInfo: "",
    medicalLicenceNumber: "",
    yearsOfExperience: "",
    department: "",
    role: "doctor",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const departments = [
    "Cardiology",
    "Oncology",
    "Pediatrics",
    "Orthopedics",
    "Radiology",
    "Neurology",
    "Gynecology and Obstetrics",
    "Gastroenterology",
    "Dentistry",
  ];

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await authService.registerDoctor(doctor);
      setSuccess("Doctor registration successful!");
    } catch (err) {
      if (err.message === "Email already exists") {
        setError("User already exists");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="register-form">
      <h2>Register Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            name="name"
            value={doctor.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={doctor.gender}
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
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={doctor.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={doctor.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contact Info:</label>
          <input
            name="contactInfo"
            value={doctor.contactInfo}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Medical Licence Number:</label>
          <input
            name="medicalLicenceNumber"
            value={doctor.medicalLicenceNumber}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Years of Experience:</label>
          <input
            name="yearsOfExperience"
            value={doctor.yearsOfExperience}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <select
            name="department"
            value={doctor.department}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select a Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default RegisterDoctor;
