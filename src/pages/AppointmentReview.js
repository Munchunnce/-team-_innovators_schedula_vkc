import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MOCK_DOCTORS } from "../data/mockUserData";

// Apple-Health inspired minimal UI (Tailwind)

function formatDateReadable(dt) {
  try {
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dt;
  }
}

function generateTKN() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `#TKN-${rand}`;
}

function parseSlotToTimes(dateISO, slot) {
  // slot expected like "09:00 - 09:30"
  try {
    const [start, end] = slot.split(" - ").map((s) => s.trim());
    const d = new Date(dateISO);
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startDt = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      sh,
      sm,
      0
    );
    const endDt = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      eh,
      em,
      0
    );
    return { startDt, endDt };
  } catch (e) {
    const now = new Date();
    return { startDt: now, endDt: new Date(now.getTime() + 30 * 60000) };
  }
}

function downloadICS({ title, description, start, end, location = "" }) {
  // Basic ICS file generator
  const toICSDate = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
      d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  const uid = `${Date.now()}@app.demo`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Demo//Appointment//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${toICSDate(
    new Date()
  )}\nDTSTART:${toICSDate(start)}\nDTEND:${toICSDate(
    end
  )}\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function PatientForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    mobile: "",
    weight: "",
    problem: "",
    relation: "Self",
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = () => {
    // minimal validation
    if (!form.name.trim()) return alert("Enter patient name");
    if (!form.mobile.trim()) return alert("Enter mobile");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full md:w-[560px] bg-white rounded-2xl shadow-lg p-6 z-50">
        <h3 className="text-lg font-semibold mb-4">Add Patient Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            className="p-3 border rounded-md"
          />
          <input
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="Age"
            className="p-3 border rounded-md"
          />
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className="p-3 border rounded-md"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="Mobile"
            className="p-3 border rounded-md"
          />
          <input
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
            placeholder="Weight (optional)"
            className="p-3 border rounded-md"
          />
          <select
            value={form.relation}
            onChange={(e) => update("relation", e.target.value)}
            className="p-3 border rounded-md"
          >
            <option>Self</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Mother</option>
            <option>Father</option>
            <option>Other</option>
          </select>
        </div>
        <textarea
          value={form.problem}
          onChange={(e) => update("problem", e.target.value)}
          placeholder="Problem / Notes (optional)"
          className="w-full mt-3 p-3 border rounded-md h-24"
        />

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentReview() {
  const navigate = useNavigate();
  const location = useLocation();

  // appointment data passed from BookAppointment OR fallback to sessionStorage demo
  const appointmentFromState = location.state?.appointment || null;
  const lastApt =
    appointmentFromState ||
    JSON.parse(sessionStorage.getItem("lastAppointment") || "null");

  // doctor passed in state or find by id
  const doctorFromState = location.state?.doctor || null;
  const doctor =
    doctorFromState ||
    (lastApt
      ? MOCK_DOCTORS.find((d) => d.id === lastApt.doctorId)
      : MOCK_DOCTORS[0]);

  // selected date & slot
  const selectedDateISO = lastApt?.start || new Date().toISOString();
  const selectedSlot = lastApt?.slot || "09:00 - 09:30";

  const tkn = useMemo(() => generateTKN(), []);
  const { startDt, endDt } = parseSlotToTimes(selectedDateISO, selectedSlot);

  const [showPatientForm, setShowPatientForm] = useState(false);

  const handleAddToCalendar = () => {
    downloadICS({
      title: `${doctor?.name || "Doctor"} - Appointment`,
      description: `Appointment ${tkn} with ${doctor?.name} (${doctor?.specialty}). Type: In-person. Duration: 30m.`,
      start: startDt,
      end: endDt,
      location: "Hospital / Clinic",
    });
  };

  const handleOpenPatient = () => setShowPatientForm(true);

  const handlePatientSave = (patient) => {
    // store patient locally and proceed to patient-details (or payment)
    const payload = {
      appointment: lastApt,
      doctor,
      tkn,
      patient,
      slot: selectedSlot,
      start: startDt.toISOString(),
      end: endDt.toISOString(),
    };
    sessionStorage.setItem("currentBooking", JSON.stringify(payload));
    setShowPatientForm(false);
    // navigate to patient-details page (create this route to capture details / payment)
    navigate("/appointment/summary", { state: payload });
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Appointment Review</h1>
          <p className="text-sm text-gray-500 mt-1">
            Confirm details, add patient info and continue to payment
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex gap-4 items-center">
          <img
            src={
              doctor?.image ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60"
            }
            alt={doctor?.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {doctor?.name || "Doctor"}
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                  {doctor?.specialty?.replace("-", " ") || "General"}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {doctor?.qualification || "MBBS, MD"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Rating</div>
                <div className="text-sm font-medium">4.6 ★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Info Card */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Appointment number</div>
              <div className="text-lg font-semibold mt-1">{tkn}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-sm font-medium text-emerald-600 mt-1">
                Upcoming
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-400">Reporting time</div>
              <div className="text-sm font-medium mt-1">
                {formatDateReadable(startDt)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Type</div>
              <div className="text-sm font-medium mt-1">In-person</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Duration</div>
              <div className="text-sm font-medium mt-1">30m</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Selected slot</div>
              <div className="text-sm font-medium mt-1">{selectedSlot}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50"
            >
              {/* calendar icon (simple svg) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="2"
                  stroke="#000"
                  strokeWidth="1.2"
                />
                <path
                  d="M16 3v4M8 3v4M3 11h18"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              Add to calendar
            </button>

            <button
  onClick={() => alert('Share / Remind feature coming soon')}
  className="px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50"
>
  Share
</button>
          </div>
        </div>

        {/* Add patient button outside card */}
        <div className="mt-6 flex justify-center md:justify-start">
          <button
            onClick={handleOpenPatient}
            className="bg-[#29C1C3] text-white px-5 py-3 rounded-full shadow-md"
          >
            + Add patient Details
          </button>
        </div>

        {/* Continue / Cancel */}
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={() => navigate(-1)} className="bg-[#29C1C3] text-white px-4 py-2 rounded-md">
            Back
          </button>
          <button
            onClick={() =>
              navigate("/payment", {
                state: { appointment: lastApt, doctor, tkn },
              })
            }
            className="px-6 py-2 bg-[#29C1C3] text-white rounded-md"
          >
            View My Application
          </button>
        </div>
      </div>

      {showPatientForm && (
        <PatientForm
          onClose={() => setShowPatientForm(false)}
          onSave={handlePatientSave}
        />
      )}
    </div>
  );
}
