import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isorganizer, setisorganizer] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle sign up logic here
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('isorganizer:', isorganizer);



  
    // Clear the form
    setUsername('');
    setEmail('');
    setPassword('');
    setisorganizer('');
  

    // try and sign up the user from the api, if it is successful, redirect to the login page, else show an error message
    fetch('http://localhost:5001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        isorganizer,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.error){
          console.log(data.error);
          return;
        }
        else{
          console.log(data);
          console.log('User created successfully');
          // Redirect the user to the login page
          window.location.href = '/login';
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('Error creating user');
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="isOrganizer"
              value={isorganizer}
              onChange={(e) => setisorganizer(e.target.value)}
              required
            >
              <option value="">Select your role</option>
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;