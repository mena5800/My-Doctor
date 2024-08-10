// src/authService.js
let authenticated = false;

export const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/users?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password));
    const users = await response.json();
    if (users.length > 0) {
        authenticated = true;
    } else {
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

export const logout = () => {
    authenticated = false;
};

export const isAuthenticated = async () => {
    return authenticated;
};
