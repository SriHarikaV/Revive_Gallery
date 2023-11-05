import React, { useState } from "react";
import { Link, useNavigate   } from "react-router-dom";
import "../../styles/auth/LoginForm.css";
import { useUser } from "./UserContext";

const LoginForm = () => {
    const navigate = useNavigate();
    const { setUser} = useUser();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        console.log(credentials)
        event.preventDefault();

        // Send the login data to the backend API
        fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Login failed. Please check your credentials.");
                }
            })
            .then((data) => {
                console.log("data", data)
                setUser(data.user, "1234"); // To-Do: Read the token from backend instead of hardocoding
                navigate('/');
            })
            .catch((error) => {
                console.log("Error: " + error.message);
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
                                required
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
                                required
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
