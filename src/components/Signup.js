import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usersData from '../data/mockUserData.json';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    const exists = usersData.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      setMessage('User already exists. Please login.');
    } else {
      usersData.users.push({
        id: usersData.users.length + 1,
        name,
        email,
        password
      });

      setMessage('Signup successful! You can now login.');
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const handleGoogleSignup = () => {
    const googleUser = {
      id: usersData.users.length + 1,
      name: 'Google User',
      email: 'googleuser@example.com',
      password: 'google-login'
    };

    const exists = usersData.users.find(
      (u) => u.email.toLowerCase() === googleUser.email.toLowerCase()
    );

    if (!exists) {
      usersData.users.push(googleUser);
    }

    alert(`Logged in successfully as ${googleUser.name} via Google`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins px-4">
      {/* White Container */}
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1750535135593-3a8e5def331d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=700"
            alt="logo"
            className="w-28 rounded-lg"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="text-left">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm mb-1 font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-left"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && <p className="text-green-500 mb-2">{message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-colors mb-4 cursor-pointer"
          >
            Sign Up
          </button>

          <div className="text-center text-gray-400 mb-4">Or sign up with</div>

          <button
            type="button"
            className="w-full border border-gray-300 flex items-center justify-center gap-3 py-2 rounded-md hover:bg-gray-50 transition-colors font-semibold mb-4 cursor-pointer"
            onClick={handleGoogleSignup}
          >
            <img src='./google-icon.svg' alt="Google" className="w-6"/>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
