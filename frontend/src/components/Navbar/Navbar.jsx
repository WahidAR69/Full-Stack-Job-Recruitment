import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import axios from 'axios';

const Navbar = ({ setShowLogin, changeProfile, setChangeProfile, isJobPost, setIsJobPost, isEmployer, setIsEmployer }) => {
  const token = localStorage.getItem('token');
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowProfileCard(changeProfile);
  }, [changeProfile]);

  useEffect(() => {
    if (location.pathname === '/post-job') {
      setIsJobPost(true);
    } else if (location.pathname === '/') {
      setIsJobPost(false);
    }
  }, [location]);

  useEffect(() => {
    if (token) {
      setChangeProfile(true);
      fetchUserData();
    }
  }, [token, setChangeProfile]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user-data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const userData = response.data;
        setIsEmployer(userData.isEmployer === 'Yes');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEmployerSwitch = async () => {
    if (!token) return;

    try {
      const newStatus = isEmployer ? 'No' : 'Yes';
      const response = await axios.post('http://localhost:3000/update-is-employer', {
        token,
        isEmployer: newStatus,
      });
      if (response.status === 200) {
        setIsEmployer(newStatus === 'Yes');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setChangeProfile(false);
    window.location.replace("http://localhost:5173");
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo-container'>
        <Link to='/'>Job Recruitment</Link>
      </div>
      <div className='navbar-links'>
        {isJobPost ? (
          <ul>
            <Link to='/'><li>Home</li></Link>
            <a href="#contact"><li>Contact</li></a>
            {changeProfile && <Link to='/post-job'><li>Post a job</li></Link>}
          </ul>
        ) : (
          <ul>
            <Link to='/'><li>Home</li></Link>
            <a href="#about"><li>About</li></a>
            <a href="#contact"><li>Contact</li></a>
            {changeProfile && isEmployer && <Link to='/post-job'><li>Post a job</li></Link>}
            {changeProfile && !isEmployer && <li onClick={handleEmployerSwitch}>Switch to Employer</li>}
          </ul>
        )}

        {!showProfileCard ? (
          <button className='navbar-button' onClick={() => setShowLogin(true)}>
            Login
          </button>
        ) : (
          <div className='profile-container'>
            <div className='profile-icon-wrapper' onClick={() => setShowProfileCard(!showProfileCard)}>
              {!showLogout && <img src={assets.profile} onMouseOver={() => setShowLogout(true)} alt="Profile" className='profile-icon' />}
            </div>
            <div className='profile-dropdown'>
              {showLogout && <button onClick={logout} onMouseOut={() => setShowLogout(false)} className='logout-button'><img className='logout-icon' src={assets.logout} alt="" /> Logout</button>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;