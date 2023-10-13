import React, { useState } from "react";
import "./loginform.css";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
    const [registration, setRegistration] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
    });

    const [popupStyle, showPopup] = useState("hide");
    const [popupMessage, setPopupMessage] = useState("");

    const popup = (event) => {
        event.preventDefault();
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
                    setPopupMessage("Registration successful!");
                    setTimeout(() => {
                        showPopup("hide");
                        setPopupMessage("");
                    }, 3000);
                } else {
                    showPopup("signup-popup");
                    setPopupMessage("Registration failed. Please try again.");
                }
            })
            .catch((error) => {
                showPopup("signup-popup");
                setPopupMessage("Error: " + error.message);
            });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setRegistration({ ...registration, [name]: checked });
        } else {
            setRegistration({ ...registration, [name]: value });
        }
    };

    return (
        <div className="register_page row">
            <div className="col-8">
                <div className="card register_form_card p-5">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account!</p>
                    <hr />
                    <form onSubmit={popup}>
                        <div className="row">
                            <div className="form-group mb-3 col-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={registration.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group mb-3 col-6">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={registration.last_name}
                                    onChange={handleInputChange}
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
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={registration.password}
                                onChange={handleInputChange}
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
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="checkbox"
                                name="acceptedTerms"
                                className="form-check-input"
                                checked={registration.acceptedTerms}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">
                                I accept the
                                <Link to="/terms"> Terms of Use</Link> &{" "}
                                <Link to="/privacy">Privacy Policy</Link>
                            </label>
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
