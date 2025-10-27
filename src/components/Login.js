import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_DOCTORS } from "../data/mockUserData";

// -------------------- Helper Functions --------------------
const maskEmail = (email) => {
  if (!email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const keep = Math.min(8, local.length);
  const visible = local.slice(0, keep);
  return `${visible}${'*'.repeat(Math.max(4, local.length - keep))}@${domain}`;
};

const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const first4 = digits.slice(0, 4);
  const last2 = digits.slice(-2);
  return `+91 ${first4}****${last2}`;
};

// -------------------- Login Component --------------------
const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Generate OTP and store temporarily
  const generateAndStoreOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem('loginOtp', otp);
    sessionStorage.setItem('otpGeneratedAt', Date.now().toString());
    return otp;
  };

  // -------------------- Handle Login --------------------
  const handleLogin = (e) => {
    e.preventDefault();

    const input = email.trim();
    if (!input) {
      setError('Please enter mobile or email');
      return;
    }

    // Search in doctors mock data
    const doctorFound = MOCK_DOCTORS.find(
      (doc) =>
        doc.email.toLowerCase() === input.toLowerCase() ||
        doc.name.toLowerCase() === input.toLowerCase() ||
        (/\d/.test(input) &&
          input.replace(/\D/g, '') === (doc.phone || '').replace(/\D/g, ''))
    );

    if (!doctorFound) {
      setError('No matching doctor found.');
      return;
    }

    const contactIsPhone = /^\+?(\d[\d-\s]*)$/.test(input) || /^\d{10,}$/.test(input);
    const contact = input;

    // Generate OTP
    const otp = generateAndStoreOtp();
    console.log('Generated OTP (for demo):', otp);

    const masked = contactIsPhone ? maskPhone(contact) : maskEmail(contact);

    setError('');
    navigate('/otp', { state: { contact, maskedContact: masked, contactIsPhone } });
  };

  // -------------------- Handle Google Login --------------------
  const handleGoogleLogin = () => {
    const googleUser = {
      id: MOCK_DOCTORS.length + 1,
      name: 'Google User',
      email: 'googleuser@example.com',
      specialty: 'General Practitioner',
      phone: '(555) 999-0000',
    };

    const exists = MOCK_DOCTORS.find(
      (doc) => doc.email.toLowerCase() === googleUser.email.toLowerCase()
    );

    if (!exists) {
      MOCK_DOCTORS.push(googleUser);
    }

    alert(`Logged in successfully as ${googleUser.name} via Google`);
    navigate('/otp', { state: { contact: googleUser.email, maskedContact: maskEmail(googleUser.email), contactIsPhone: false } });
  };

  // -------------------- UI --------------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1750535135593-3a8e5def331d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=700"
            alt="logo"
            className="w-28 rounded-lg"
          />
        </div>

        {/* Form */}
        <form className="text-left" onSubmit={handleLogin}>
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Login</h2>

          <label htmlFor="email" className="block text-sm mb-1 font-medium text-gray-700">
            Mobile / Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your mobile or email"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4" />
              <label htmlFor="remember" className="text-gray-600">Remember Me</label>
            </div>
            <Link to="#" className="text-blue-500 hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-4 cursor-pointer"
          >
            Login
          </button>

          <div className="text-center text-gray-400 mb-4">Or login with</div>

          <button
            type="button"
            className="w-full border border-gray-300 flex items-center justify-center gap-3 py-2 rounded-md hover:bg-gray-50 transition-colors mb-4 font-semibold cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <img src="./google-icon.svg" alt="Google" className="w-6" />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-4 text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
