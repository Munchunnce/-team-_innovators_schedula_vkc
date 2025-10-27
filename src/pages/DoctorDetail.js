// src/pages/DoctorDetail.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MOCK_DOCTORS } from "../data/mockUserData";

const capitalize = (s) =>
  typeof s === "string" ? s.replace(/(^|-)(\w)/g, (m, a, b) => (a || "") + b.toUpperCase()) : s;

export default function DoctorDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // prefer passed state, otherwise find in mock by id
  const docFromState = location.state && location.state.doctor;
  const doctor = docFromState || MOCK_DOCTORS.find((d) => d.id === id) || MOCK_DOCTORS[0];

  const handleBook = () => {
    navigate("/book", { state: { doctor } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex gap-4 items-center">
            <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-sm text-[#29C1C3]">{capitalize(doctor.specialty || doctor.specialtyLabel)}</p>
              <p className="text-sm text-gray-500 mt-1">{doctor.hospital || "CityCare Hospital"}</p>

              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="text-gray-600"><span className="font-semibold">{doctor.experience || "5+ yrs"}</span> exp</div>
                <div className="text-gray-600">⭐ <span className="font-semibold">{doctor.rating || "4.6"}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-sm text-gray-700">
            <h3 className="font-semibold mb-2">About Doctor</h3>
            <p>
              Experienced {capitalize(doctor.specialty || "General practice")}. {doctor.about || "Provides comprehensive care and consultation."}
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Availability</h4>
              <div className="text-xs text-gray-500">{doctor.nextAvailable || "09:00 - 17:00 (Mon - Fri)"}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleBook}
              className="flex-1 bg-[#29C1C3] text-white py-3 rounded-lg font-semibold hover:opacity-95"
            >
              Book appointment
            </button>

            <button
              onClick={() => alert("Add to favorites (demo)")}
              className="px-4 py-3 border border-gray-200 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
