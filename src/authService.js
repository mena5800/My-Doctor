import crypto from 'crypto';

let authenticated = false;
let currentUser = null;

const handleResponse = async (response) => {
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }
        return data;
    } else {
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || 'An error occurred');
        }
        return { message: text };
    }
};

export const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const user = await handleResponse(response);
    authenticated = true;
    currentUser = user;
    return currentUser;
};

export const logout = async () => {
    const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
    });

    await handleResponse(response);
    authenticated = false;
    currentUser = null;
};

export const isAuthenticated = () => {
    return new Promise((resolve) => {
        resolve(authenticated);
    });
};

export const getCurrentUser = async () => {
    const response = await fetch('http://localhost:5000/user', {
        method: 'GET',
        credentials: 'include',
    });

    currentUser = await handleResponse(response);
    return currentUser;
};

export const register = async (fullName, email, password, role) => {
    const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, role }), // Using fullName instead of name
    });

    return handleResponse(response);
};

export const getPatientProfile = async (email) => {
    const response = await fetch(`http://localhost:5000/patientprofile?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
        return null;  // No profile found
    }
    return handleResponse(response);
};

export const savePatientProfile = async (profile) => {
    const response = await fetch('http://localhost:5000/patientprofile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
    });

    return handleResponse(response);
};

export const registerDoctor = async (doctorData) => {
    const response = await fetch('http://localhost:5000/doc/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
    });

    return handleResponse(response);
};

export const getCurrentDoctor = async () => {
    const response = await fetch('http://localhost:5000/doctor/current', {
        method: 'GET',
        credentials: 'include',
    });

    return handleResponse(response);
};

export const getDoctorsByDepartment = async (department) => {
    const response = await fetch(`http://localhost:5000/doctors/department/${encodeURIComponent(department)}`);

    return handleResponse(response);
};

export const saveDoctorProfile = async (profile) => {
    const response = await fetch('http://localhost:5000/doctor/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
    });

    return handleResponse(response);
};
