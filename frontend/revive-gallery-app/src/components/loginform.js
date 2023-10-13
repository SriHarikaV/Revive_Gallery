import React, { useState } from "react";
import "./loginform.css";

const LoginForm = () => {
  const [popupStyle, showPopup] = useState("hide");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const data = {
        username: username,
        password: password,
      };

    // Send the data to the backend API
    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Login successful");
                
            } else {
                showPopup("login-popup");
                setTimeout(() => showPopup("hide"), 3000);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        
    };


  return (
    <div className="cover">
      <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-btn" onClick={handleSubmit}>
          Login
        </div>

      <div className={popupStyle}>
        <h3>Login Failed</h3>
        <p>Username or password incorrect</p>
      </div>
    </div>
  );
};

export default LoginForm;
