const BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

export const ENDPOINTS = {
  searchTrips: (from, to, date) =>
    `${BASE}/api/trips/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`,
  getTrip: (id) => `${BASE}/api/trips/${id}`,
  createBooking: () => `${BASE}/api/bookings`,
};