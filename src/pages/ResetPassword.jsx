import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [error,setError] = useState("");
  const [done,setDone] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError("");
    if (password.length < 8) return setError("Password must contain at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    try {
      const response = await fetch("/api/reset-password", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({token,password})
      });
      const data = await response.json();
      if (!response.ok) return setError(data.message || "Could not reset password.");
      setDone(true);
    } catch {
      setError("Cannot connect to the server. Start it with: npm run server");
    }
  }

  return <main className="auth-page forgot-page">
    <div className="forgot-visual">
      <span className="brand-mark big"><i className="bi bi-compass"></i></span>
      <h1>New Password.<br/>New Journey.<br/><span>Keep Exploring.</span></h1>
      <p>Create a new secure password and continue your Smart Travel Guide journey.</p>
      <div className="side-points">
        <b><i className="bi bi-shield-check"></i> Secure <small>Your account stays protected</small></b>
        <b><i className="bi bi-map"></i> Explore <small>Discover amazing destinations</small></b>
        <b><i className="bi bi-stars"></i> Experience <small>Plan better trips</small></b>
      </div>
    </div>
    <div className="forgot-form-area">
      <div className="auth-top"><Link to="/login">← Back to Login</Link></div>
      <form className="auth-card forgot-card" onSubmit={submit}>
        <div className="reset-icon"><i className="bi bi-shield-lock"></i></div>
        {!done ? <>
          <h2>Reset <span>Password</span></h2>
          <p>Create a new password for your Smart Travel Guide account.</p>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="field"><label>New Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" required/></div>
          <div className="field"><label>Confirm New Password</label><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Enter password again" required/></div>
          <button className="btn btn-primary btn-lg w-100">Update Password <i className="bi bi-arrow-right"></i></button>
        </> : <>
          <h2>Password <span>Updated!</span></h2>
          <p>Your password has been changed successfully. You can now login with your new password.</p>
          <Link className="btn btn-primary btn-lg w-100" to="/login">Go to Login <i className="bi bi-arrow-right"></i></Link>
        </>}
      </form>
    </div>
  </main>
}
