import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <Link to="/" className="brand-text">BUS<span className="hl">LANKA</span>.COM</Link>
          <span className="tagline">EASIEST TICKET BOOKING SYSTEM IN</span>
        </div>

        <nav className="top-links">
          <a href="#">Operator Login</a>
          <a href="#">Help</a>
          <a href="#">Services</a>
          <a href="#">News</a>
    
          
          <a href="#">Login</a>
          <a href="#">Signup</a>
        </nav>
      </div>
    </header>
  );
}