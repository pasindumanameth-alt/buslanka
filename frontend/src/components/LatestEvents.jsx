import React from "react";
import "../styles/sections.css";

export default function LatestEvents() {
  return (
    <section className="section">
      <h2 className="sec-title">Latest Events</h2>
      <div className="events-wrap">
        <div className="event-card">
          <img src="/events1.jpg" alt="event" />
          <div className="event-text">
            Online ticket booking — please ensure the transaction is completed within 7 minutes,
            otherwise your seat may be released.
          </div>
        </div>
        <div className="event-side">
          <img src="/events1.jpg" alt="app" />
        </div>
      </div>
    </section>
  );
}