import React, { useState } from 'react';
import './JobPost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobPost = ({ userEmail }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    apply: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, userEmail };
    try {
      const response = await axios.post('http://localhost:3000/job-post', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message); 
    }
  };

  return (
    <div className='jobPost'>
      <h1>Job Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">JobTitle</label><br />
        <input name='title' id='title' type="text" value={formData.title} onChange={handleChange} /><br />

        <label htmlFor="description">Job Description</label><br />
        <textarea name="description" id="description" rows="6" value={formData.description} onChange={handleChange}></textarea><br />

        <label htmlFor="requirements">Job Requirements</label><br />
        <textarea name="requirements" id="requirements" rows="6" value={formData.requirements} onChange={handleChange}></textarea><br />

        <label htmlFor="location">Location</label><br />
        <input name='location' id='location' type="text" value={formData.location} onChange={handleChange} /><br />

        <label htmlFor="apply">Apply Link</label><br />
        <input type="text" name='apply' id='apply' value={formData.apply} onChange={handleChange} /><br />

        <button type="submit">Post Job</button>
      </form> 
    </div>
  );
};

export default JobPost;