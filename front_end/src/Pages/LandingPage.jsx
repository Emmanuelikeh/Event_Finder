import React from 'react';
import './LandingPage.css'; // Make sure this CSS file is created and linked
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook


const LandingPage = () => {
    const navigate = useNavigate(); // Call useNavigate to get the navigate function

  const handleLogin = () => {
    navigate('/login'); // Use navigate to redirect to the login route
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <div className="header-title">Fisk University Event Finder</div>
        <button onClick={handleLogin} className="header-login">Login</button>
      </div>

      <div className="tagline">
        <h1>Discover Campus Life and Find The Latest Events and Gatherings at Fisk University</h1>
      </div>

      <div className="image-gallery">
        <div className="gallery-item"><img src={ require('./one.jpeg') } /></div>
        <div className="gallery-item"><img src={ require('./two.jpeg') } /></div>
        <div className="gallery-item"><img src={ require('./three.jpeg') } /></div>
        <div className="gallery-item"><img src={ require('./four.jpeg') } /></div>
        <div className="gallery-item"><img src={ require('./five.jpeg') } /></div>
        <div className="gallery-item"><img src={ require('./six.jpeg') } /></div>
      </div>
    </div>
  );
};

export default LandingPage;
