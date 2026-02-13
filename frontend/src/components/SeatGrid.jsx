import React from "react";
import SeatNode from "./SeatNode";
import "../styles/seats.css";

export default function SeatGrid({ seats, onToggle }) {
  return (
    <div className="seat-grid">
      {seats.map(s => <SeatNode key={s.seatNo} seat={s} onToggle={onToggle} />)}
    </div>
  );
}