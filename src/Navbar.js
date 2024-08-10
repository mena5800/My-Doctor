// src/Navbar.js
import React from 'react';

function Navbar() {
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        section.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav>
            <ul>
                <li onClick={() => scrollToSection('home')}>Home</li>
                <li onClick={() => scrollToSection('about')}>About</li>
                <li onClick={() => scrollToSection('contact')}>Contact</li>
            </ul>
        </nav>
    );
}

export default Navbar;
