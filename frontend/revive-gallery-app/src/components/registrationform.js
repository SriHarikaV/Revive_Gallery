import React, { useState } from "react";
import "./loginform.css";

const RegistrationForm = () => {
    const [registration, setRegistration] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    });

    const [popupStyle, showPopup] = useState("hide");

    const popup = () => {
        // Send the data to the backend API
        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registration),
        })
            .then((response) => {
                if (response.ok) {
                    showPopup("signup-popup");
                    setTimeout(() => showPopup("hide"), 3000);
                } else {
                    // error
                }
            })
            .catch((error) => {
                // error 
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegistration({
            ...registration,
            [name]: value,
        });
    };

    return (
        <div className="cover">
            <h1>Sign Up</h1>
            <input
                type="text"
                name="first_name"
                value={registration['first_name']}
                placeholder="first name"
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="last_name"
                value={registration['last_name']}
                placeholder="last name"
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="username"
                value={registration['username']}
                placeholder="username"
                onChange={handleInputChange}
            />
            <input
                type="email"
                name="email"
                value={registration['email']}
                placeholder="email id"
                onChange={handleInputChange}
            />
            <input
                type="password"
                name="password"
                value={registration['password']}
                placeholder="password"
                onChange={handleInputChange}
            />
            <div className="login-btn" onClick={popup}>
                Sign Up
            </div>
        </div>
    );
};

export default RegistrationForm;
