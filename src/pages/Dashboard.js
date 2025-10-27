// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_DOCTORS } from "../data/mockUserData";
import Footer from "../components/Footer";

/**
 * Dashboard for listing doctors (responsive, searchable, filterable)
 *
 * Assumptions:
 * - MOCK_DOCTORS is an array of doctor objects (id, name, specialty, email, phone, workingHours)
 * - If fields like `image`, `hospital`, `experience`, `rating` are missing,
 *   we synthesize friendly placeholders so UI looks complete.
 */

const capitalize = (s) =>
  typeof s === "string" ? s.replace(/(^|-)(\w)/g, (m, a, b) => (a || "") + b.toUpperCase()) : s;

const placeholderHospitals = [
  "CityCare Hospital",
  "Central Health Clinic",
  "Greenway Medical Center",
  "Sohna Road Hospital",
  "Signature Healthcare",
];

const placeholderAvatars = [
  // royalty-free avatar links or unsplash avatars (cdn). Using unsplash generics:
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=60",
];

function ensureSixDoctors(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  if (arr.length >= 6) return arr;
  const res = [...arr];
  let i = 0;
  while (res.length < 6) {
    const clone = { ...arr[i % arr.length] };
    // generate new id if duplicate
    clone.id = `${clone.id || "doc"}-dup-${res.length + 1}`;
    res.push(clone);
    i++;
  }
  return res;
}

const useDoctorDisplayData = (rawDoctors) => {
  const doctors = useMemo(() => {
    const list = ensureSixDoctors(rawDoctors);
    return list.map((d, idx) => {
      const specialtyLabel = d.specialty ? d.specialty.replace("-", " ") : "General";
      const hospital = d.hospital || placeholderHospitals[idx % placeholderHospitals.length];
      const image = d.image || placeholderAvatars[idx % placeholderAvatars.length];
      const experience =
        d.experience ||
        (d.joinedYear ? new Date().getFullYear() - d.joinedYear + " yrs" : `${3 + (idx % 7)}+ yrs`);
      const rating = d.rating || (4.0 + (idx % 10) * 0.1).toFixed(1);
      const nextAvailable = (() => {
        // show today's first working hour if available, fallback
        const wk = d.workingHours || {};
        const keys = Object.keys(wk);
        if (keys.length) {
          const first = wk[keys[0]];
          return `${first.start} - ${first.end}`;
        }
        return "09:00 - 17:00";
      })();

      return {
        ...d,
        specialtyLabel,
        hospital,
        image,
        experience,
        rating,
        nextAvailable,
      };
    });
  }, [rawDoctors]);

  return doctors;
};

const DoctorCard = ({ doctor, onView, onBook }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-start border border-gray-100">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-sm text-[#29C1C3]">{capitalize(doctor.specialtyLabel)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-600">Available today</div>
            <div className="text-xs text-gray-400">{doctor.nextAvailable}</div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">{doctor.hospital}</p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{doctor.experience}</span> exp
            </div>
            <div className="text-sm text-gray-600">⭐ <span className="font-semibold">{doctor.rating}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(doctor)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm hover:bg-gray-50 cursor-pointer"
            >
              View
            </button>
            <button
              onClick={() => onBook(doctor)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Footer (fixed on mobile) */}
      <div className="md:hidden">
        <Footer />
      </div>
      {/* On md+ you can show footer in page or not; keeping hidden on larger screens as design */}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [layout, setLayout] = useState("grid"); // or 'list'
  const [sortBy, setSortBy] = useState("relevance");

  const doctors = useDoctorDisplayData(MOCK_DOCTORS);

  // derive specialty options
  const specialties = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => set.add(d.specialtyLabel || "General"));
    return ["All", ...Array.from(set).map((s) => capitalize(s))];
  }, [doctors]);

  const filtered = useMemo(() => {
    let out = doctors.slice();
    if (specialtyFilter !== "all" && specialtyFilter !== "All") {
      out = out.filter(
        (d) => capitalize(d.specialtyLabel).toLowerCase() === specialtyFilter.toLowerCase()
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.specialtyLabel || "").toLowerCase().includes(q) ||
          (d.hospital || "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "rating") out.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortBy === "experience")
      out.sort(
        (a, b) =>
          parseInt((b.experience + "").replace(/\D/g, "")) - parseInt((a.experience + "").replace(/\D/g, ""))
      );
    return out;
  }, [doctors, query, specialtyFilter, sortBy]);

  const handleView = (doctor) => {
    navigate(`/doctor/${doctor.id}`, { state: { doctor } });
  };

  const handleBook = (doctor) => {
    navigate("/book", { state: { doctor } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Find a Doctor</h1>
            <p className="text-sm text-gray-500">Book appointments quickly & easily</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <button
                onClick={() => setLayout("grid")}
                className={`px-3 py-1 rounded-md ${layout === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                title="Grid"
              >
                Grid
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`px-3 py-1 rounded-md ${layout === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                title="List"
              >
                List
              </button>
            </div>

            <div className="bg-white rounded-lg p-2 shadow-sm flex items-center gap-2">
              <img
                src="https://img.icons8.com/ios-glyphs/20/000000/appointment-reminders.png"
                alt="icon"
                className="w-5 h-5 opacity-60"
              />
              <div className="text-sm">
                Hello, <span className="font-semibold">Priya</span>
                <div className="text-xs text-gray-400">8 Bomdevlaji, Mumbai</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors, specialty or hospital..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-sm"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Top rated</option>
                <option value="experience">Most experienced</option>
              </select>

              <button
                onClick={() => {
                  setQuery("");
                  setSpecialtyFilter("all");
                  setSortBy("relevance");
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Doctor list */}
        <div
          className={`grid gap-4 ${
            layout === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-6 text-center text-gray-500">
              No doctors found
            </div>
          ) : (
            filtered.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} onView={handleView} onBook={handleBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
