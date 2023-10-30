import React, { useState } from "react";
import "../../styles/auth/LoginForm.css";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
    const [registration, setRegistration] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [passwordValid, setPasswordValid] = useState(true); 
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let passwordValid = true;

        if (name === "password") {
            // Check for password criteria
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            passwordValid = passwordRegex.test(value);
        }

        setRegistration({
            ...registration,
            [name]: value,
        });

        setPasswordValid(passwordValid);
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if confirm password matches the password
        if (registration.password !== registration.confirmPassword) {
            setPasswordsMatch(false);
            return;
        } else {
            setPasswordsMatch(true);
        }

        if (!passwordValid || !passwordsMatch ) {
            console.log('Please enter');
            return;
        }

        const { confirmPassword, ...registrationData } = registration;
        console.log(registrationData, typeof(registrationData));
        
        // Send the data to the backend API
        fetch("http://localhost:8080/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData)
        })
            .then((response) => {
                if (response.ok) {
                    console.log(response);
                } else {
                    console.log("Failed, Bad request: " + response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="register_page row">
            <div className="col-8">
                <div className="card register_form_card p-5">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account!</p>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="form-group mb-3 col-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={registration.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 col-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={registration.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email"
                                value={registration.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Password validation message */}
                        {!passwordValid && (
                            <div className="text-danger">
                                Password does not meet the criteria.
                                It should have at least 8 characters, 
                                including one lowercase letter,
                                one uppercase letter, one digit, 
                                and one special character.
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={registration.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={registration.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            {!passwordsMatch && (
                                <div className="text-danger">Passwords do not match.</div>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <button
                                className="btn signup_btn text-white"
                                type="submit"
                                style={{ backgroundColor: "#3897DD" }}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>

                <div className="p-5 have_account">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
