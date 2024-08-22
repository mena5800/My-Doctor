// src/authService.js
import crypto from "crypto";

let authenticated = false;
let currentUser = null;

// done
export const login = async (email, password) => {
    console.log(process.env.API_BASE)
    const response = await fetch(`${process.env.API_BASE}/login`, {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    credentials: "include", // to send HTTP only cookies

    body: JSON.stringify({ email, password }), // Send email and password in the body
  });

  if (!response.ok) {
    throw new Error("Email or password is not correct");
  }

  const user = await response.json();

  console.log(user);

  if (user) {
    authenticated = true;
    currentUser = user;
    return currentUser;
  } else {
    authenticated = false;
    currentUser = null;
    throw new Error("Email or password is not correct");
  }
};

// done
export const register = async (name, email, password, role) => {
  const response = await fetch(`${process.env.API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
    credentials: "include", // to send HTTP only cookies
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const logout = async() => {
//   authenticated = false;
//   currentUser = null;

const response = await fetch(`${process.env.API_BASE}/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // to send HTTP only cookies
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Network response was not ok");
  }

  const data = await response.json();
  console.log(data);
  return data;

};

export const isAuthenticated = () => {
  return new Promise((resolve) => {
    resolve(authenticated);
  });
};

export const getCurrentUser = () => {
  return currentUser;
};

// export const getPatientProfile = async (email) => {
//     const response = await fetch(`${process.env.API_BASE}/patientprofile?email=${encodeURIComponent(email)}`);
//     if (!response.ok) {
//         return null;  // No profile found
//     }
//     const profile = await response.json();
//     return profile;
// };

export const getPatientProfile = async () => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
    method: "GET", // Use POST method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    credentials: "include", // Important: This ensures cookies are sent
  });

  if (!response.ok) {
    return null; // No profile found or error occurred
  }

  const profile = await response.json();
  return profile;
};

export const savePatientProfile = async (profile) => {
  const response = await fetch(`${process.env.API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error("Failed to save patient profile");
  }

  const data = await response.json();
  return data;
};

export const registerDoctor = async (doctorData) => {
  const response = await fetch(`${process.env.API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Network response was not ok");
  }

  return response.json();
};

export const getCurrentDoctor = async () => {
  const response = await fetch(`${process.env.API_BASE}/doctor/current`, {
    method: "GET",
    credentials: "include", // If you're using cookies for session
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current doctor");
  }

  return response.json();
};

export const getDoctorsByDepartment = async (department) => {
  const response = await fetch(
    `${process.env.API_BASE}/doctors/department/${encodeURIComponent(
      department
    )}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doctors by department");
  }

  return response.json();
};
