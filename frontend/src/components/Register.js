import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("Please fill all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 409)) {
        setError(err.response.data.message || "User already exists or invalid data.");
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="switch-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;