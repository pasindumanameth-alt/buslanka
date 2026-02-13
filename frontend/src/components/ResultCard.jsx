import React from "react";
import "../styles/results.css";

export default function ResultCard({ trip, onPick }) {
  const seatsAvailable = trip.seats?.filter(s => s.status === "available").length ?? 0;
  return (
    <div className="result-card">
      <img className="result-img" src="/bus.jpg" alt="bus" />
      <div className="result-main">
        <div className="result-title">{trip.from} → {trip.to}</div>
        <div className="result-line">Depart: {trip.departureDate} {trip.departureTime}</div>
        <div className="result-line">Arrive: {trip.arrivalDate || "—"} {trip.arrivalTime || ""}</div>
      </div>
      <div className="result-side">
        <div className="result-price">LKR {trip.pricePerSeat}</div>
        <button className="result-btn" onClick={onPick}>Book My Seats</button>
        <div className="result-avail">{seatsAvailable} seats available</div>
      </div>
    </div>
  );
}