import React from "react";
import "../styles/seats.css";

export default function SeatNode({ seat, onToggle }) {
  const cls = seat.status === "booked" ? "seat booked"
           : seat.status === "selected" ? "seat chosen"
           : "seat open";
  return (
    <div className={cls} onClick={() => seat.status !== "booked" && onToggle(seat.seatNo)}>
      {seat.seatNo}
    </div>
  );
}