// src/pages/BookAppointment.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Simple booking page:
 * - shows doctor card at top
 * - date selector (next 7 days)
 * - time slot list (generated from doctor's workingHours or defaults)
 */

const formatDateLabel = (date) =>
  date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

const generateSlots = (start = "09:00", end = "17:00", durationMinutes = 30) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const slots = [];
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sh, sm, 0, 0);
  const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 0, 0);
  let cur = new Date(base);
  while (cur < endTime) {
    const nxt = new Date(cur.getTime() + durationMinutes * 60 * 1000);
    slots.push(`${String(cur.getHours()).padStart(2, "0")}:${String(cur.getMinutes()).padStart(2, "0")} - ${String(nxt.getHours()).padStart(2, "0")}:${String(nxt.getMinutes()).padStart(2, "0")}`);
    cur = nxt;
  }
  return slots;
};

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = (location.state && location.state.doctor) || null;

  const days = useMemo(() => {
    const arr = [];
    const start = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const slots = generateSlots("09:00", "17:00", 30); // default

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Choose a slot first");
      return;
    }
    // For demo: store appointment in session and navigate to "Review" or appointment list
    const apt = {
      id: `apt-demo-${Date.now()}`,
      doctorId: doctor?.id || "unknown",
      start: selectedDate.toISOString(),
      slot: selectedSlot,
    };
    sessionStorage.setItem("lastAppointment", JSON.stringify(apt));
    alert("Appointment confirmed (demo)");
    navigate("/appointments");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-5 shadow">
          {/* doctor mini */}
          <div className="flex items-center gap-4">
            <img src={doctor?.image} alt={doctor?.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h3 className="font-semibold">{doctor?.name || "Doctor"}</h3>
              <div className="text-xs text-[#29C1C3]">{doctor?.specialty || ""}</div>
            </div>
          </div>

          {/* date picker */}
          <div className="mt-5">
            <div className="text-sm font-semibold mb-2">Select date</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const active = d.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                    className={`min-w-[80px] p-3 rounded-lg text-center ${active ? "bg-[#29C1C3] text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <div className="text-xs">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                    <div className="font-semibold">{d.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* slots */}
          <div className="mt-5">
            <div className="text-sm font-semibold mb-2">Available slots</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map((s) => {
                const active = s === selectedSlot;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`p-2 rounded-lg text-sm border ${active ? "bg-[#29C1C3] text-white border-[#29C1C3]" : "bg-white border-gray-200"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleConfirm} className="flex-1 bg-[#29C1C3] text-white py-3 rounded-lg font-semibold">
              Confirm & Pay
            </button>
            <button onClick={() => navigate(-1)} className="px-4 py-3 border rounded-lg">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
