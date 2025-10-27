// src/data/mockData.js

/**
 * Mock Data for Hospital Appointment Scheduler
 * Local Date objects are used for proper date comparison
 */

export const MOCK_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Chen',
    specialty: 'cardiology',
    email: 'sarah.chen@hospital.com',
    phone: '(555) 123-4567',
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' },
    },
  },
  {
    id: 'doc-2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'pediatrics',
    email: 'michael.rodriguez@hospital.com',
    phone: '(555) 234-5678',
    workingHours: {
      monday: { start: '08:00', end: '16:00' },
      tuesday: { start: '08:00', end: '16:00' },
      wednesday: { start: '08:00', end: '16:00' },
      thursday: { start: '08:00', end: '16:00' },
      friday: { start: '08:00', end: '14:00' },
    },
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Johnson',
    specialty: 'general-practice',
    email: 'emily.johnson@hospital.com',
    phone: '(555) 345-6789',
    workingHours: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' },
      saturday: { start: '09:00', end: '13:00' },
    },
  },
];

export const MOCK_PATIENTS = [
  { id: 'pat-1', name: 'John Smith' },
  { id: 'pat-2', name: 'Emma Johnson' },
  { id: 'pat-3', name: 'Michael Brown' },
  { id: 'pat-4', name: 'Sophia Davis' },
  { id: 'pat-5', name: 'William Garcia' },
  { id: 'pat-6', name: 'Olivia Martinez' },
  { id: 'pat-7', name: 'James Wilson' },
  { id: 'pat-8', name: 'Ava Anderson' },
  { id: 'pat-9', name: 'Robert Taylor' },
  { id: 'pat-10', name: 'Isabella Thomas' },
];

/**
 * Helper to get local Date object for current week
 */
function getWeekDate(dayOffset, hour, minute) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1); // Monday of current week
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

/**
 * Helper to get end time
 */
function getEndTime(startTime, durationMinutes) {
  const end = new Date(startTime);
  end.setMinutes(end.getMinutes() + durationMinutes);
  return end;
}

export const MOCK_APPOINTMENTS = [
  // Doctor 1
  {
    id: 'apt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    type: 'checkup',
    startTime: getWeekDate(0, 9, 0),
    endTime: getEndTime(getWeekDate(0, 9, 0), 30),
    status: 'scheduled',
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    type: 'consultation',
    startTime: getWeekDate(0, 10, 0),
    endTime: getEndTime(getWeekDate(0, 10, 0), 60),
    status: 'scheduled',
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    doctorId: 'doc-1',
    type: 'follow-up',
    startTime: getWeekDate(0, 11, 30),
    endTime: getEndTime(getWeekDate(0, 11, 30), 30),
    status: 'scheduled',
  },

  // Doctor 2
  {
    id: 'apt-4',
    patientId: 'pat-4',
    doctorId: 'doc-2',
    type: 'checkup',
    startTime: getWeekDate(1, 8, 30),
    endTime: getEndTime(getWeekDate(1, 8, 30), 30),
    status: 'scheduled',
  },
  {
    id: 'apt-5',
    patientId: 'pat-5',
    doctorId: 'doc-2',
    type: 'consultation',
    startTime: getWeekDate(1, 9, 30),
    endTime: getEndTime(getWeekDate(1, 9, 30), 45),
    status: 'scheduled',
  },

  // Doctor 3
  {
    id: 'apt-6',
    patientId: 'pat-6',
    doctorId: 'doc-3',
    type: 'checkup',
    startTime: getWeekDate(2, 10, 0),
    endTime: getEndTime(getWeekDate(2, 10, 0), 30),
    status: 'scheduled',
  },
  {
    id: 'apt-7',
    patientId: 'pat-7',
    doctorId: 'doc-3',
    type: 'consultation',
    startTime: getWeekDate(2, 11, 0),
    endTime: getEndTime(getWeekDate(2, 11, 0), 60),
    status: 'scheduled',
  },
];

export const appointmentTypes = {
  checkup: "#3b82f6",      // Blue
  consultation: "#10b981", // Green
  "follow-up": "#f59e0b",  // Orange
  procedure: "#ef4444",    // Red
};
