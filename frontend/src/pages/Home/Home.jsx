import React from 'react';
import './Home.css';
import SearchAndShowJobs from '../../components/SearchAndShowJobs/SearchAndShowJobs';

const Home = ({ userEmail, setUserEmail }) => {
  return (
    <>
      <SearchAndShowJobs userEmail={userEmail} setUserEmail={setUserEmail} />
    </>
  );
};

export default Home;