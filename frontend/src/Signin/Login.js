import React, { useState } from "react";
import "./login.css";
import Img from "../assets/logo.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { BACKEND_ADDRESS } from '../config';  // Import the backend address
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState('');

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const apiURL = `${BACKEND_ADDRESS}/login`;
      const response = await axios.post(apiURL, credentials);
      console.log(response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      const userInfoString = localStorage.getItem('userInfo');
      console.log(userInfoString);
      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("An error occurred. Please try again later.");
      setShowAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value }));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  

  return (
    <div className="login-container">
      <div className="heading">
        <h1>Welcome back</h1>
      </div>
      <div className="logo">
      <div className="centered-form">
        <img src={Img} alt="logo" />
          <div className="form-container">
              <form className="w-full" onSubmit={handleSubmit}>
                
                <div className="rounded-md shadow-sm">
                  <div class="inputnew-container">
                    <input 
                    type="email"
                    className="placeholder-gray-400 text-base py-2 px-3 transition-all duration-300 ease-in-out w-full h-14 rounded-xl shadow-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-glow"
                    id="email" 
                    name="email" 
                    required 
                    placeholder="" 
                    value={credentials.email}
                    onChange={handleChange}
                    />
                    <label for="email">📧 Username</label>
                  </div>
                  <div class="inputnew-container mt-4">
                    <input 
                      id="password"
                      name="password"
                      type="password"
                      className="placeholder-gray-400 text-base py-2 px-3 transition-all duration-300 ease-in-out w-full h-14 rounded-xl shadow-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-glow"
                      required 
                      autoComplete="current-password"
                      placeholder="" 
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <label for="email">🔑 Password</label>
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                <div className="button-container ml-2 mr-4">
                  <h3>Sign In</h3>
                  <Button

                    type="submit"
                    variant="outline-light"
                    style={{ borderRadius: "50px" , height: '80px'}}
                    className="button"
                  >
                    →
                  </Button>
                </div>
              </form>
            </div>
            <div className="signup mb-4">
              <Link to="/SignUp">
                <h6 clas>Sign Up</h6>
              </Link>
              <h6>Forgot Password</h6>
            </div>
        </div>
      </div>

    {/* Alert Modal */}
    <Modal show={showAlert} onHide={handleCloseAlert} centered>
      <Modal.Header closeButton>
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body>{alertMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCloseAlert}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default Login;
