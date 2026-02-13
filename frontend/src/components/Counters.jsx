import React from "react";
import "../styles/sections.css";

export default function Counters() {
  const items = [
    { label: "Downloaded", value: "20,90,847+" },
    { label: "Registered", value: "2,267,679+" },
    { label: "Visitors", value: "56,280,812" },
  ];
  return (
    <section className="section counters">
      <h2 className="visually-hidden">Increasing users</h2>
      <div className="counter-row">
        {items.map((it, i)=>(
          <div className="counter" key={i}>
            <div className="counter-value">{it.value}</div>
            <div className="counter-label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}