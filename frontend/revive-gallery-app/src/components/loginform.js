import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./loginform.css";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [popupStyle, showPopup] = useState("hide");
    const [popupMessage, setPopupMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the login data to the backend API
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => {
                if (response.ok) {
                    showPopup("login-popup");
                    setPopupMessage("Login successful!");
                    setTimeout(() => {
                        showPopup("hide");
                        setPopupMessage("");
                    }, 3000);
                } else {
                    showPopup("login-popup");
                    setPopupMessage("Login failed. Please check your credentials.");
                }
            })
            .catch((error) => {
                showPopup("login-popup");
                setPopupMessage("Error: " + error.message);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    return (
        <div className="register_page row">
            <div className="col-8">
                <div className="card register_form_card p-5">
                    <h1>Login</h1>
                    <p>Please enter your credentials to login!</p>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email"
                                value={credentials.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group mb-3">
                            <button
                                className="btn signup_btn text-white"
                                type="submit"
                                style={{ backgroundColor: "#3897DD" }}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>

                <div className="p-5 have_account">
                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
