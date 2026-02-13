import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ENDPOINTS } from "../api";
import "../styles/booked.css";

export default function BookedPassengersPage() {
  const { id } = useParams(); // trip id
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINTS.getTrip(id));
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load trip");
        setTrip(data);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const booked = useMemo(() => {
    const rows = (trip?.seats || []).filter(s => s.status === "booked");
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter(s =>
      String(s.seatNo).includes(needle) ||
      (s.passengerName || "").toLowerCase().includes(needle) ||
      (s.passengerPhone || "").toLowerCase().includes(needle) ||
      (s.passengerEmail || "").toLowerCase().includes(needle)
    );
  }, [trip, q]);

  if (loading) return <div className="booked-wrap"><p>Loading…</p></div>;
  if (!trip) return <div className="booked-wrap"><p>Trip not found</p></div>;

  return (
    <div className="booked-wrap">
      <div className="head">
        <div>
          <h2>Booked Seats – {trip.from} → {trip.to}</h2>
          <div className="sub">{trip.departureDate} {trip.departureTime} • Bus: {trip.busType} • Seats: {trip.noOfSeats}</div>
        </div>
        <Link className="back" to="/admin">← Back to Admin</Link>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by seat, name, phone, email…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
        <div className="pill">Total booked: <b>{(trip.seats || []).filter(s => s.status === "booked").length}</b></div>
      </div>

      {booked.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No booked seats yet</div>
          <div className="empty-sub">Bookings will appear here as passengers pay.</div>
        </div>
      ) : (
        <div className="table">
          <div className="thead">
            <div>Seat #</div>
            <div>Passenger Name</div>
            <div>Phone</div>
            <div>Email</div>
          </div>
          {booked.map((s) => (
            <div className="trow" key={s.seatNo}>
              <div>{s.seatNo}</div>
              <div>{s.passengerName || "—"}</div>
              <div>{s.passengerPhone || "—"}</div>
              <div>{s.passengerEmail || "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}