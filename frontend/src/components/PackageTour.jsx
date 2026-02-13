import React from "react";
import "../styles/sections.css";

export default function PackageTour() {
  const cards = [
    { img: "/tour1.jpg", title: "Sigiriya", text: "Climb the lion rock & explore the ancient fortress." },
    { img: "/tour2.jpg", title: "Kandy", text: "Temple of the Tooth, lakeside city and hill-country vibes." },
    { img: "/tour3.jpg", title: "Jaffna", text: "Northern culture, beaches and historic sites." },
  ];
  return (
    <section className="section section-blue">
      <h2 className="sec-title">Package Tour</h2>
      <div className="tour-grid">
        {cards.map((c,i)=>(
          <div className="tour-card" key={i}>
            <img src={c.img} alt={c.title} />
            <div className="tour-body">
              <div className="tour-title">{c.title}</div>
              <div className="tour-text">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}