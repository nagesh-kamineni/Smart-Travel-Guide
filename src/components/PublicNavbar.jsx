import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="public-navbar">
      <Link to="/" className="brand">
        <span className="brand-mark"><i className="bi bi-compass"></i></span>
        <span><strong>Smart <b>Travel</b> Guide</strong><small>Plan Smart, Travel Better</small></span>
      </Link>
      <nav className="desktop-nav">
        <NavLink to="/" end>Home</NavLink>
        <a href="#destinations">Destinations</a>
        <a href="#packages">Packages</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#about">About Us</a>
      </nav>
      <div className="nav-actions">
        <Link className="btn btn-outline-primary btn-sm px-4" to="/login"><i className="bi bi-person me-2"></i>Login</Link>
        <Link className="btn btn-primary btn-sm px-4" to="/signup"><i className="bi bi-person-plus me-2"></i>Sign Up</Link>
      </div>
    </header>
  );
}
