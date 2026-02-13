import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

export default function BookingHero() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("bus");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [onward, setOnward] = useState("");
  const [ret, setRet] = useState("");
  const [tripType, setTripType] = useState("single");

  const places = ["Colombo", "Kandy", "Galle", "Jaffna", "Badulla", "Makumbura"];

  function search() {
    if (!from || !to || !onward) return alert("Please fill Source, Destination, and Onward date");
    navigate(`/select-bus?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(onward)}`);
  }

  return (
    <section className="hero">
      <div className="tabs">
        <button className={tab==="bus" ? "active" : ""} onClick={()=>setTab("bus")}>🚌 Bus Booking</button>
        <button className={tab==="package" ? "active" : ""} onClick={()=>setTab("package")}>🧭 Package Tour</button>
      </div>

      <div className="booking-card">
        <div className="row">
          <div className="field">
            <label>Source</label>
            <select value={from} onChange={e=>setFrom(e.target.value)}>
              <option value="">Select</option>
              {places.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Destination</label>
            <select value={to} onChange={e=>setTo(e.target.value)}>
              <option value="">Select</option>
              {places.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Onward</label>
            <input type="date" value={onward} onChange={e=>setOnward(e.target.value)} />
          </div>

          <div className="field">
            <label>Return</label>
            <input type="date" value={ret} onChange={e=>setRet(e.target.value)} disabled={tripType==="single"} />
          </div>

          <div className="field small">
            <label>&nbsp;</label>
            <div className="triptype">
              <label><input type="radio" name="tt" checked={tripType==="single"} onChange={()=>setTripType("single")} /> Single</label>
              <label><input type="radio" name="tt" checked={tripType==="return"} onChange={()=>setTripType("return")} /> Return</label>
            </div>
          </div>

          <div className="field">
            <label>&nbsp;</label>
            <button className="search-btn" onClick={search}>Search Bus</button>
          </div>
        </div>
      </div>
    </section>
  );
}