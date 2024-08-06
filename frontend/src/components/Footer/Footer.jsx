import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer' id="contact">
      <div className='footer-container'>
      <div className='social-media'>
          <h1>Follow US</h1>
          <div className='social-icons'>
            <a href="#"><i className="fa-brands fa-facebook"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <div className='address'>
          <h1><i className="fa-solid fa-map-location-dot"></i>Address</h1>
          <p>123 Main Street, City, State, Zip Code</p>
        </div>
        <div className='contact-us'>
          <h1><i className="fa-solid fa-address-book"></i>Contact US</h1>
          <p><i className="fa-solid fa-phone"></i>Phone: +91 1234567890</p>
          <p><i className="fa-solid fa-envelope"></i>Email: username@example.com</p>
        </div>
      </div>
      <div className='text-center'>&copy; 2024 Job Recruitment</div>
    </footer>
  )
}

export default Footer
