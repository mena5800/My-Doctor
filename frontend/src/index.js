import React from 'react';
import ReactDOM from 'react-dom/client'; // Importing client from 'react-dom'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root.
root.render( // Use the 'render' method from 'createRoot'
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
