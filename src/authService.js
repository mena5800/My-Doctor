// src/authService.js
let authenticated = false;
let currentUser = null;

export const login = async (email, password) => {
    const response = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const users = await response.json();
    if (users.length > 0) {
        authenticated = true;
        currentUser = users[0];
        return currentUser;
    } else {
        authenticated = false;
        currentUser = null;
        throw new Error('Email or password is not correct');
    }
};

export const logout = () => {
    authenticated = false;
    currentUser = null;
};

export const isAuthenticated = () => {
    return new Promise((resolve) => {
        resolve(authenticated);
    });
};

export const getCurrentUser = () => {
    return currentUser;
};
