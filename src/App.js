// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Otp from "./components/Otp";
import Dashboard from "./pages/Dashboard";
import DoctorDetail from "./pages/DoctorDetail";
import BookAppointment from "./pages/BookAppointment";
import Footer from "./components/Footer";

const Appointments = () => <div className="p-8 pb-20">Appointments list (TODO)</div>;
const Records = () => <div className="p-8 pb-20">Medical Records (TODO)</div>;
const Profile = () => <div className="p-8 pb-20">Profile (TODO)</div>;

// 👇 Layout wrapper (Dashboard + Footer)
function LayoutWithFooter() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />

          {/* Pages with footer */}
          <Route element={<LayoutWithFooter />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/records" element={<Records />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
