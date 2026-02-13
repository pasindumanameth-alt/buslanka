import React, { useEffect, useState } from "react";
import "../styles/AdminPage.css";

const BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

const initial = {
  from: "",
  to: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  busType: "Normal",
  model: "",
  depotName: "",
  pricePerSeat: "",
  noOfSeats: "",
};

export default function AdminPage() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // modal state for booked seats
  const [bookedOpen, setBookedOpen] = useState(false);
  const [bookedTrip, setBookedTrip] = useState(null);
  const [bookedRows, setBookedRows] = useState([]);
  const [bookedQuery, setBookedQuery] = useState("");
  const [bookedLoading, setBookedLoading] = useState(false);
  const [bookedError, setBookedError] = useState("");

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function loadTrips() {
    try {
      setLoadingTrips(true);
      const res = await fetch(`${BASE}/api/admin/trips`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load trips");
      setTrips(data.trips || []);
    } catch (e) {
      console.error("Failed to load trips:", e.message);
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  }

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...form,
        pricePerSeat: Number(form.pricePerSeat),
        noOfSeats: Number(form.noOfSeats),
      };
      const res = await fetch(`${BASE}/api/admin/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create trip");

      setMsg(
        `✅ Trip created (id: ${data._id}). Seats generated: ${
          data.seats?.length ?? 0
        }`
      );
      setForm(initial);
      await loadTrips();
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // --- Booked seats viewer ---

  // fetch booked seats using the new admin endpoint (preferred),
  // fall back to /api/trips/:id and filter
  async function openBooked(trip) {
    setBookedOpen(true);
    setBookedTrip(trip);
    setBookedLoading(true);
    setBookedError("");
    setBookedRows([]);

    try {
      // try admin endpoint first
      let res = await fetch(`${BASE}/api/admin/trips/${trip._id}/bookings`);
      if (res.ok) {
        const data = await res.json();
        // may be { trip, count, seats: [...] }
        if (Array.isArray(data.seats)) {
          setBookedRows(data.seats);
          setBookedLoading(false);
          return;
        }
      }

      // fallback to GET /api/trips/:id and filter booked seats
      res = await fetch(`${BASE}/api/trips/${trip._id}`);
      const data2 = await res.json();
      if (!res.ok) throw new Error(data2.message || "Failed to load trip");
      const rows = (data2.seats || []).filter((s) => s.status === "booked");
      setBookedRows(rows);
    } catch (e) {
      setBookedError(e.message);
      setBookedRows([]);
    } finally {
      setBookedLoading(false);
    }
  }

  function closeBooked() {
    setBookedOpen(false);
    setBookedTrip(null);
    setBookedRows([]);
    setBookedQuery("");
    setBookedError("");
  }

  const filteredBooked = bookedRows.filter((s) => {
    if (!bookedQuery.trim()) return true;
    const q = bookedQuery.toLowerCase();
    return (
      String(s.seatNo).includes(q) ||
      (s.passengerName || "").toLowerCase().includes(q) ||
      (s.passengerPhone || "").toLowerCase().includes(q) ||
      (s.passengerEmail || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-wrap">
      <h2>Create Trip (Admin Panel)</h2>

      <form className="admin-form" onSubmit={submit}>
        <div className="grid">
          <label>
            From
            <input name="from" value={form.from} onChange={update} required />
          </label>
          <label>
            To
            <input name="to" value={form.to} onChange={update} required />
          </label>

          <label>
            Departure Date
            <input
              type="date"
              name="departureDate"
              value={form.departureDate}
              onChange={update}
              required
            />
          </label>
          <label>
            Departure Time
            <input
              type="time"
              name="departureTime"
              value={form.departureTime}
              onChange={update}
              required
            />
          </label>

          <label>
            Arrival Date
            <input
              type="date"
              name="arrivalDate"
              value={form.arrivalDate}
              onChange={update}
            />
          </label>
          <label>
            Arrival Time
            <input
              type="time"
              name="arrivalTime"
              value={form.arrivalTime}
              onChange={update}
            />
          </label>

          <label>
            Bus Type
            <select name="busType" value={form.busType} onChange={update}>
              <option>Normal</option>
              <option>Semi-Luxury</option>
              <option>Luxury</option>
            </select>
          </label>
          <label>
            Model
            <input
              name="model"
              value={form.model}
              onChange={update}
              required
              placeholder="Leyland"
            />
          </label>

          <label>
            Depot Name
            <input
              name="depotName"
              value={form.depotName}
              onChange={update}
              required
              placeholder="Badulla"
            />
          </label>
          <label>
            Price Per Seat (LKR)
            <input
              type="number"
              min="0"
              name="pricePerSeat"
              value={form.pricePerSeat}
              onChange={update}
              required
            />
          </label>

          <label>
            No. of Seats
            <input
              type="number"
              min="1"
              name="noOfSeats"
              value={form.noOfSeats}
              onChange={update}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create Trip"}
        </button>
      </form>

      {msg && <p className="msg">{msg}</p>}

      <h3 className="list-title">Existing Trips</h3>
      {loadingTrips ? (
        <p>Loading trips…</p>
      ) : trips.length ? (
        <div className="table">
          <div className="thead">
            <div>From</div>
            <div>To</div>
            <div>Date</div>
            <div>Time</div>
            <div>Type</div>
            <div>Seats</div>
            <div>Booked</div>
            <div>Actions</div>
          </div>
          {trips.map((t) => {
            const bookedCount = (t.seats || []).filter(s => s.status === "booked").length;
            return (
              <div className="trow" key={t._id}>
                <div>{t.from}</div>
                <div>{t.to}</div>
                <div>{t.departureDate}</div>
                <div>{t.departureTime}</div>
                <div>{t.busType}</div>
                <div>{t.noOfSeats}</div>
                <div>{bookedCount}</div>
                <div>
                  <button className="view-btn" onClick={() => openBooked(t)}>
                    View Booked
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty">No trips yet</p>
      )}

      {/* Booked seats modal */}
      {bookedOpen && (
        <div className="modal-backdrop" onClick={closeBooked}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Booked Seats</div>
                {bookedTrip && (
                  <div className="modal-sub">
                    {bookedTrip.from} → {bookedTrip.to} • {bookedTrip.departureDate} {bookedTrip.departureTime}
                  </div>
                )}
              </div>
              <button className="close-btn" onClick={closeBooked}>×</button>
            </div>

            <div className="modal-toolbar">
              <input
                className="modal-search"
                placeholder="Search by seat, name, phone, email…"
                value={bookedQuery}
                onChange={(e) => setBookedQuery(e.target.value)}
              />
              <div className="pill">Total booked: <b>{bookedRows.length}</b></div>
            </div>

            {bookedLoading ? (
              <p className="pad">Loading…</p>
            ) : bookedError ? (
              <p className="pad error">Error: {bookedError}</p>
            ) : filteredBooked.length === 0 ? (
              <div className="empty pad">
                <div className="empty-title">No booked seats yet</div>
                <div className="empty-sub">They’ll appear here as passengers pay.</div>
              </div>
            ) : (
              <div className="booked-table">
                <div className="thead">
                  <div>Seat #</div>
                  <div>Passenger Name</div>
                  <div>Phone</div>
                  <div>Email</div>
                </div>
                {filteredBooked.map((s) => (
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
        </div>
      )}
    </div>
  );
}