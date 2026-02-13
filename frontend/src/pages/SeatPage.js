import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../api";
import SeatGrid from "../components/SeatGrid";
import "../styles/seats.css";

export default function SeatPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [picked, setPicked] = useState([]);
  const [passenger, setPassenger] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    (async () => {
      const res = await fetch(ENDPOINTS.getTrip(id));
      const data = await res.json();
      setTrip(data);
      setSeats(data.seats.map(s => ({ ...s })));
    })();
  }, [id]);

  function toggle(sn) {
    setSeats(prev => prev.map(s =>
      s.seatNo === sn
        ? { ...s, status: s.status === "selected" ? "available" : "selected" }
        : s
    ));
    setPicked(prev => prev.includes(sn) ? prev.filter(x => x !== sn) : [...prev, sn]);
  }

  async function book() {
    if (!picked.length) return alert("Select seats");
    if (!passenger.name || !passenger.phone) return alert("Enter passenger name & phone");
    const res = await fetch(ENDPOINTS.createBooking(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId: id, seats: picked, passenger })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Booking failed");
    alert("Booking confirmed!");
    window.location.href = "/";
  }

  if (!trip) return <div className="results-wrap"><p>Loading…</p></div>;

  const total = (picked.length || 0) * (trip.pricePerSeat || 0);

  return (
    <div className="results-wrap">
      <h2>{trip.from} → {trip.to}</h2>
      <p className="sub">{trip.departureDate} {trip.departureTime}</p>

      <h3>Select your seats</h3>
      <SeatGrid seats={seats} onToggle={toggle} />

      <div className="booking">
        <div>Selected: {picked.join(", ") || "None"}</div>
        <div>Total: LKR {total}</div>

        <div className="form">
          <input placeholder="Full name" value={passenger.name} onChange={e=>setPassenger(p=>({...p, name:e.target.value}))} />
          <input placeholder="Mobile" value={passenger.phone} onChange={e=>setPassenger(p=>({...p, phone:e.target.value}))} />
          <input placeholder="Email (optional)" value={passenger.email} onChange={e=>setPassenger(p=>({...p, email:e.target.value}))} />
          <button onClick={book}>Pay & Book</button>
        </div>
      </div>
    </div>
  );
}