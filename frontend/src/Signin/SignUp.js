import React, { useState } from "react";
import "./signup.css";
import Img from "../assets/logo.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { BACKEND_ADDRESS } from '../config';  // Import the backend address

const SignUp = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${BACKEND_ADDRESS}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (response.ok) {
        // Redirect to dashboard after successful signup
        window.location.href = "/dashboard";
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="heading">
        <h1>Welcome back</h1>
      </div>
      <div className="logo">
        <img src={Img} alt="logo" />
      </div>
      <div className="centered-form">
        <div className="form-container">
          <div class="inputnew-container mb-4">
            <input 
            type="text"
            className="placeholder-gray-400 text-base py-2 px-3 transition-all duration-300 ease-in-out w-full h-14 rounded-xl shadow-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-glow"
            id="name" 
            name="name" 
            required 
            placeholder="" 
            value={username}
            onChange={(e) => setName(e.target.value)}
            />
            <label for="name">Name</label>
          </div>

          <div class="inputnew-container mb-4">
            <input 
            type="email"
            className="placeholder-gray-400 text-base py-2 px-3 transition-all duration-300 ease-in-out w-full h-14 rounded-xl shadow-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-glow"
            id="email" 
            name="email" 
            required 
            placeholder="" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <label for="email">Email</label>
          </div>

          <div class="inputnew-container mb-4">
            <input 
            className="placeholder-gray-400 text-base py-2 px-3 transition-all duration-300 ease-in-out w-full h-14 rounded-xl shadow-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-glow"
            id="password" 
            name="email" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="sm"
            type="password"
            placeholder=""
            />
            <label for="password">Password</label>
          </div>

          <div className="button-container">
            <h3>SignUp</h3>
            <Button
              variant="outline-light"
              style={{ borderRadius: "50px" }}
              className="button"
              onClick={handleSignUp}
            >
              →
            </Button>
          </div>
        </div>
        <div className="signup">
          <Link to="/login">
            <h6>Login</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
