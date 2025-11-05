// src/pages/AppointmentSummary.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MOCK_DOCTORS, MOCK_PATIENTS } from "../data/mockUserData";

const PRIMARY = "#2563eb"; // practo bright blue

function formatDateReadable(dt) {
  try {
    return new Date(dt).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dt;
  }
}

function toTitleCaseSpecialty(s) {
  if (!s) return s;
  return s
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AppointmentSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  // read booking payload from navigation state or sessionStorage
  const initialPayload =
    location.state ||
    JSON.parse(sessionStorage.getItem("currentBooking") || "null");

  // fallback if nothing present
  const fallbackApt = JSON.parse(
    sessionStorage.getItem("lastAppointment") || "null"
  );

  const [payload, setPayload] = useState(() => {
    if (initialPayload) {
      // ensure keys exist
      return {
        ...initialPayload,
        payment: initialPayload.payment ?? "not paid",
        status: initialPayload.status ?? "upcoming",
        visitType: initialPayload.visitType ?? "First",
      };
    }
    if (fallbackApt) {
      const doc =
        MOCK_DOCTORS.find((d) => d.id === fallbackApt.doctorId) ||
        MOCK_DOCTORS[0];
      // try to find patient by id if exists
      const pat =
        MOCK_PATIENTS.find((p) => p.id === fallbackApt.patientId) || null;
      return {
        appointment: fallbackApt,
        doctor: doc,
        patient: pat || null,
        tkn: `#TKN-${Math.floor(1000 + Math.random() * 9000)}`,
        payment: "not paid",
        status: "upcoming",
        visitType: "First",
        start: fallbackApt.start,
        end: fallbackApt.end || fallbackApt.start,
      };
    }
    return null;
  });

  //   useEffect(() => {
  //     if (initialPayload) {
  //       // normalize
  //       setPayload((p) => ({
  //         ...initialPayload,
  //         payment: initialPayload.payment ?? "not paid",
  //         status: initialPayload.status ?? "upcoming",
  //         visitType: initialPayload.visitType ?? "First",
  //       }));
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [initialPayload]);

  // persist any changes so flow survives refresh
  useEffect(() => {
    if (payload)
      sessionStorage.setItem("currentBooking", JSON.stringify(payload));
  }, [payload]);

  // redirect back to dashboard if nothing found
  useEffect(() => {
    if (!payload) {
      const t = setTimeout(() => navigate("/dashboard"), 700);
      return () => clearTimeout(t);
    }
  }, [payload, navigate]);

  if (!payload) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">No booking found</div>
          <div className="text-sm text-gray-500">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  // resolved data
  const doctor = payload.doctor || MOCK_DOCTORS[0];
  const patientFromPayload = payload.patient;
  const patient = patientFromPayload ||
    (payload.appointment && payload.appointment.patientId
      ? MOCK_PATIENTS.find((p) => p.id === payload.appointment.patientId) ||
        null
      : null) || {
      name: "—",
      age: "—",
      gender: "—",
      mobile: "—",
      relation: "—",
      weight: "",
      problem: "",
    };

  const appointment = payload.appointment || {};
  const tkn = payload.tkn || "#TKN-0000";
  const start = payload.start || appointment.start || new Date().toISOString();

  // status and payment derived from payload (strings)
  const paymentVal = (payload.payment || "not paid").toLowerCase();
  const statusVal = (payload.status || "upcoming").toLowerCase();

  const statusClass =
    statusVal === "confirmed" ? "text-green-600" : "text-blue-600";

  // handle pay: update payload.payment and payload.status
  const handlePay = () => {
    // in production, replace with real payment flow
    setPayload((p) => ({ ...p, payment: "paid", status: "confirmed" }));
    alert("Payment successful (demo). Status updated to Confirmed.");
  };

  //   const handleVisitTypeChange = (v) => {
  //     setPayload((p) => ({ ...p, visitType: v }));
  //   };

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#374151"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div>
            <h1 className="text-2xl font-semibold" style={{ color: PRIMARY }}>
              Appointment Summary
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Patient details and appointment information
            </p>
          </div>
        </div>

        {/* Patient Details Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Patient Details</h3>
              <p className="text-sm text-gray-500 mt-1">
                Saved information from booking
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate("/review", { state: payload })}
                className="text-sm px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400">Full name</div>
              <div className="text-sm font-medium mt-1">
                {patient.name || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Age • Gender</div>
              <div className="text-sm font-medium mt-1">
                {(patient.age || "—") + " • " + (patient.gender || "—")}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400">Mobile</div>
              <div className="text-sm font-medium mt-1">
                {patient.mobile || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Relation</div>
              <div className="text-sm font-medium mt-1">
                {patient.relation || "—"}
              </div>
            </div>

            {patient.weight ? (
              <div>
                <div className="text-xs text-gray-400">Weight</div>
                <div className="text-sm font-medium mt-1">{patient.weight}</div>
              </div>
            ) : null}

            {patient.problem ? (
              <div className="md:col-span-2">
                <div className="text-xs text-gray-400">Problem / Notes</div>
                <div className="text-sm font-medium mt-1">
                  {patient.problem}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Appointment Information Card (label fixed width, value right aligned) */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 border border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Appointment Information</h3>
              <p className="text-sm text-gray-500 mt-1">
                Details of your scheduled visit
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400">Token</div>
              <div className="text-sm font-semibold mt-1">{tkn}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Row: Doctor */}
            <div className="flex items-center">
              <div className="w-[140px] text-xs text-gray-400">Doctor</div>
              <div className="flex-1 text-right text-sm font-medium">
                {doctor?.name || "—"}
              </div>
            </div>

            {/* Row: Specialty */}
            <div className="flex items-center">
              <div className="w-[140px] text-xs text-gray-400">Specialty</div>
              <div className="flex-1 text-right text-sm font-medium">
                {toTitleCaseSpecialty(doctor?.specialty) || "General"}
              </div>
            </div>

            {/* Row: Date & Time */}
            <div className="flex items-center">
              <div className="w-[140px] text-xs text-gray-400">Date & Time</div>
              <div className="flex-1 text-right text-sm font-medium">
                {formatDateReadable(start)}
              </div>
            </div>

            {/* Row: Status */}
            <div className="flex items-center">
              <div className="w-[140px] text-xs text-gray-400">Status</div>
              <div
                className={`flex-1 text-right text-sm font-semibold ${statusClass}`}
              >
                {statusVal === "confirmed" ? "Confirmed" : "Upcoming"}
              </div>
            </div>

            {/* Row: Payment */}
            <div className="flex items-center">
              <div className="w-[140px] text-xs text-gray-400">Payment</div>
              <div className="flex-1 text-right text-sm font-medium">
                {paymentVal === "paid" ? (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-500 border border-red-100">
                    Not paid
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions inside card */}
          <div className="mt-5 flex items-center gap-3 justify-end">
            <button
              onClick={() => {
                // generate ICS
                const startDt = new Date(start);
                const endDt = payload.end
                  ? new Date(payload.end)
                  : new Date(startDt.getTime() + 30 * 60000);
                const toICSDate = (d) => {
                  const pad = (n) => String(n).padStart(2, "0");
                  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
                    d.getUTCDate()
                  )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
                };
                const uid = `${Date.now()}@app.demo`;
                const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Demo//Appointment//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${toICSDate(
                  new Date()
                )}\nDTSTART:${toICSDate(startDt)}\nDTEND:${toICSDate(
                  endDt
                )}\nSUMMARY:Appointment with ${
                  doctor?.name
                }\nDESCRIPTION:Token ${tkn}\nLOCATION:Clinic\nEND:VEVENT\nEND:VCALENDAR`;
                const blob = new Blob([ics], {
                  type: "text/calendar;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `appointment_${tkn.replace("#", "")}.ics`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50"
            >
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
              onClick={async () => {
                try {
                  const text = `Appointment with ${
                    doctor?.name
                  } on ${formatDateReadable(start)} | Token: ${tkn}`;

                  if (navigator.share) {
                    await navigator.share({
                      title: "Appointment Details",
                      text,
                    });
                  } else {
                    await navigator.clipboard.writeText(text);
                    alert("Appointment copied to clipboard");
                  }
                } catch (e) {
                  console.log(e);
                }
              }}
              className="px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50"
            >
              Share
            </button>
          </div>
        </div>

        {/* Visit Type */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Visit Type</h3>
              <p className="text-sm text-gray-500 mt-1">
                Select reason for visit
              </p>
            </div>
          </div>

          <div className="mt-4">
            <select
              value={payload.visitType}
              onChange={(e) => {
                const value = e.target.value;
                setPayload((prev) => ({
                  ...prev,
                  visitType: value,
                }));
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="First">First</option>
              <option value="Report">Report</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <button
              onClick={handlePay}
              style={{ background: PRIMARY }}
              className="w-full md:w-auto px-6 py-3 rounded-md text-white font-medium shadow-md"
            >
              Pay Consulting Fee
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setTimeout(
                  () => alert("Quick Query modal — open from next step"),
                  100
                )
              }
              className="px-5 py-3 rounded-md border border-blue-300 hover:bg-blue-50 text-blue-700"
            >
              Quick Query
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
