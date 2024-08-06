import React, {useState} from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import JobPost from './pages/JobPost/JobPost';
import About from './components/About/About';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const [isJobPost, setIsJobPost] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  return (
    <div className='container position-relative'>
      {showLogin && <LoginPopup 
        setShowLogin={setShowLogin} 
        setChangeProfile={setChangeProfile} 
        setUserEmail={setUserEmail} 
      />}
      <Navbar 
        setShowLogin={setShowLogin} 
        changeProfile={changeProfile} 
        setChangeProfile={setChangeProfile} 
        isJobPost={isJobPost} 
        setIsJobPost={setIsJobPost}
        isEmployer={isEmployer}
        setIsEmployer={setIsEmployer}
      />
      <Routes>
        <Route path='/' element={<Home setUserEmail={setUserEmail} userEmail={userEmail}/>} />
        <Route path='/post-job' element={<JobPost userEmail={userEmail} />} />
      </Routes>
      {!isJobPost && <About />}
      <Footer />
    </div>
  );
};

export default App;