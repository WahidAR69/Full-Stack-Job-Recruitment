import React, { useState, useEffect } from 'react';
import './SearchAndShowJobs.css';
import { assets } from '../../assets/assets.js';
import axios from 'axios';

const SearchAndShowJobs = ({ userEmail, setUserEmail }) => {
  const [food_list, setFoodList] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchValue = e.target[0].value;
    const response = await axios.post('http://localhost:3000/job-request', { search: searchValue });
    setFoodList(response.data);
  };

  useEffect(() => {
    const button = document.getElementById('search-btn');
    if (button) {
      button.click();
    }
  }, []);

  const handleDelete = async (e, title) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:3000/delete', {
        data: { title, email: userEmail },
        headers: { 'Content-Type': 'application/json' }
      });
      handleSearch(e);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='search-container'>
        <form onSubmit={handleSearch} className='search-form'>
          <input type="text" placeholder='Search' />
          <button type='submit' id='search-btn'><img src={assets.search} alt="" /></button>
        </form>
      </div>
      <div className='showData'>
        {food_list.length === 0 
          ? <h1>No job found! <br />Please try a different keyword</h1>
          : food_list.map((item, index) => (
            <div key={index} className='showData-item'>
              <div>
                <h3>Title: {item.title}</h3>
                <p>Description: <br />{item.description}</p>
                <p>Requirements: <br />{item.requirements}</p>
                <p>Location:  <br />{item.location}</p>
                <div className='apply-delete'>
                  <a href={item.apply}>Apply</a>
                  {userEmail === item.userEmail && <form onSubmit={(e) => handleDelete(e, item.title)} className='delete-job'>
                    <button type='submit'>Delete</button>
                  </form>}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SearchAndShowJobs;