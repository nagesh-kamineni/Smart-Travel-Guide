import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, setLoggedIn } from "../utils";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  function logout() {
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <>
      <header className="public-navbar user-navbar">
        <Link to="/user" className="brand">
          <span className="brand-mark"><i className="bi bi-compass"></i></span>
          <span><strong>Smart <b>Travel</b> Guide</strong><small>Plan Smart, Travel Better</small></span>
        </Link>
        <nav className="desktop-nav">
          <Link to="/user">Dashboard</Link>
          <Link to="/user/search">Search</Link>
          <Link to="/user/packages">Packages</Link>
          <Link to="/user/recommendations">Recommendations</Link>
        </nav>
        <div className="user-nav-right">
          <button className="icon-btn"><i className="bi bi-bell"></i><span className="notification-dot">1</span></button>
          <button className="user-chip" onClick={() => setProfileOpen(!profileOpen)}>
            <span className="avatar">{(user?.name || "U").charAt(0)}</span>
            <span className="d-none d-md-inline">{user?.name?.split(" ")[0] || "User"}</span>
            <i className="bi bi-chevron-down"></i>
          </button>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Open menu"><i className="bi bi-list"></i></button>
        </div>
      </header>

      {profileOpen && (
        <div className="profile-popover">
          <div className="popover-user">
            <span className="avatar large">{(user?.name || "U").charAt(0)}</span>
            <div><strong>{user?.name}</strong><small>{user?.email}</small></div>
          </div>
          <Link to="/user/profile" onClick={() => setProfileOpen(false)}><i className="bi bi-person"></i> Profile</Link>
          <button onClick={logout}><i className="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      )}

      {open && (
        <>
          <div className="menu-backdrop" onClick={() => setOpen(false)}></div>
          <aside className="user-drawer">
            <button className="drawer-close" onClick={() => setOpen(false)}><i className="bi bi-x-lg"></i></button>
            <div className="drawer-profile">
              <span className="avatar large">{(user?.name || "U").charAt(0)}</span>
              <div><strong>{user?.name}</strong><small>{user?.email}</small></div>
            </div>
            {[
              ["/user","bi-house","Dashboard"],
              ["/user/profile","bi-person","My Profile"],
              ["/user/packages","bi-gift","Travel Packages"],
              ["/user/search","bi-search","Search Places"],
              ["/user/trips","bi-calendar3","My Trips"],
              ["/user/recommendations","bi-stars","Recommendations"],
              ["/user/reviews","bi-star","My Reviews"],
              ["/user/suggest-place","bi-geo-alt","Suggest a Place"]
            ].map(([to, icon, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}><i className={`bi ${icon}`}></i>{label}</Link>
            ))}
            <hr />
            <button className="drawer-logout" onClick={logout}><i className="bi bi-box-arrow-right"></i> Logout</button>
          </aside>
        </>
      )}
    </>
  );
}
