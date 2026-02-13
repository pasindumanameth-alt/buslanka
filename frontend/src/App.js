import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import SeatPage from "./pages/SeatPage";
import BookedPassengersPage from "./pages/BookedPassengersPage";
import AdminPage from "./pages/AdminPage";

import "./styles/footer.css";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-bus" element={<ResultsPage />} />
        <Route path="/select-seat/:id" element={<SeatPage />} />
        <Route path="/admin/trips/:id/bookings" element={<BookedPassengersPage />} />
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
      <footer className="site-footer">
        <div className="cols">
          <div className="ft-brand">BUS<span className="hl">LANKA</span>.COM</div>
          <div>
            <h4>Quick Links</h4>
            <a href="#">Bus Schedule</a>
            <a href="#">FAQs</a>
            <a href="#">About Us</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="#">Hotline</a>
            <a href="#">Help</a>
            <a href="#">Support</a>
          </div>
        </div>
        <p className="credit">© {new Date().getFullYear()} BusLanka.com — Easiest Ticket Booking System</p>
      </footer>
    </>
  );
}