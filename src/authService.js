// src/authService.js
let authenticated = false;

export const login = (email, password) => {
    authenticated = true;
    return Promise.resolve();
};

export const register = (email, password) => {
    return Promise.resolve();
};

export const logout = () => {
    authenticated = false;
};

export const isAuthenticated = () => {
    return authenticated;
};
