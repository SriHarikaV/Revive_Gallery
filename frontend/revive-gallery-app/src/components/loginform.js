import React, { useState } from "react";
import { Link, useNavigate   } from "react-router-dom";
import "./loginform.css";

const LoginForm = () => {
    const navigate=useNavigate();
    // const history = useHistory();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        console.log(credentials)
        event.preventDefault();
        // Send the login data to the backend API
        fetch("http://localhost:5000/login", {
            method: "POST",
            // mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('login ok')
                    navigate('/');
                    // history.push('/');
                } else {
                    console.log("Login failed. Please check your credentials.");
                }
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
