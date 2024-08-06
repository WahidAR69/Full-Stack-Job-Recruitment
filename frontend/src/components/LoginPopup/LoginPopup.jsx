import React, { useEffect, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets.js';
import axios from 'axios';

const LoginPopup = ({ setShowLogin, setChangeProfile, setUserEmail}) => {
  const [login, setLogin] = useState("login");
  const [showError, setShowError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isEmployer: 'No'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setChangeProfile(true);
      setShowLogin(false);
    }
  }, [setChangeProfile, setShowLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (login === "Sign up" && formData.password !== formData.confirmPassword) {
      setShowError("Passwords do not match.");
      return;
    }
    if(formData.password.length < 8){
      setShowError("Password must be at least 8 characters long.");
      return;
    }

    const url = login === "login" ? '/login' : '/signup';

    try {
      const response = await axios.post(`http://localhost:3000${url}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', formData.email);
      
      setUserEmail(formData.email);
      setChangeProfile(true);
      setShowError("");
      setShowLogin(false);
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setShowError(error.response.data.error || "An error occurred.");
      } else {
        setShowError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='popup'>
      <form className='login container' onSubmit={handleSubmit}>
        <div className='login-title'>
          <h2>{login}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross} alt="close" />
        </div>
        {login === "Sign up" && <input name='name' type="text" placeholder='Enter Your Name' value={formData.name} onChange={handleChange} />}
        <input name='email' type="email" placeholder='Enter Your Email' value={formData.email} onChange={handleChange} />
        <input name='password' type="password" placeholder='Enter Your Password' value={formData.password} onChange={handleChange} />
        {login === "Sign up" && <input name='confirmPassword' type="password" placeholder='Confirm Your Password' value={formData.confirmPassword} onChange={handleChange} />}
        {login === "Sign up" && (
          <div className='select'>
            <label htmlFor="isEmployer">Are you an employer?</label>
            <select name='isEmployer' id='isEmployer' value={formData.isEmployer} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        )}
        <button type='submit'>{login === "login" ? "Login" : "Create Account"}</button>
        {showError && <div className="errorMessage">{showError}</div>}
        {login === "login" ? (
          <p>Create a new account? <span onClick={() => { setLogin("Sign up"); setShowError("") }}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => { setLogin("login"); setShowError("") }}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;