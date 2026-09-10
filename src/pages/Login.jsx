import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setLoggedIn } from "../utils";
import RoleSwitcher from "../components/RoleSwitcher";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [role,setRole]=useState("user"); const [error,setError]=useState("");
 const nav=useNavigate(); const location=useLocation();
 const registered=new URLSearchParams(location.search).get("registered");
 async function submit(e){
   e.preventDefault(); setError("");
   try {
     const response = await fetch("/api/login", {
       method:"POST",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify({email,password,role})
     });
     const data = await response.json();
     if(!response.ok) return setError(data.message || "Login failed.");
     sessionStorage.setItem("stg_user", JSON.stringify({...data.user, role: data.user.role || role}));
     setLoggedIn(true);
     nav((data.user.role || role) === "guide" ? "/guide" : "/user");
   } catch {
     setError("Cannot connect to the server. Start it with: npm run server");
   }
 }
 return <main className="auth-page login-page">
  <AuthRoleInfo role={role} mode="login" />
  <div className="login-form-area"><div className="auth-top">New here? <Link to="/signup">Sign Up</Link></div><form className="auth-card login-card" onSubmit={submit}>
   <div className="auth-brand centered"><span className="brand-mark"><i className="bi bi-compass"></i></span><strong>Smart <b>Travel</b> Guide</strong></div>
   <h2>Welcome <span>Back!</span></h2><p>Login as a traveller or local guide to continue with Smart Travel Guide.</p>
   <RoleSwitcher role={role} onChange={setRole}/>
   {registered&&<div className="alert alert-success py-2">Account created. Please login.</div>}{error&&<div className="alert alert-danger py-2">{error}</div>}
   <Field label="Email Address" value={email} setValue={setEmail} type="email"/><Field label="Password" value={password} setValue={setPassword} type="password"/>
   <div className="login-options"><label><input type="checkbox"/> Remember me</label><Link to="/forgot-password">Forgot Password?</Link></div>
   <button className="btn btn-primary btn-lg w-100">Login <i className="bi bi-arrow-right"></i></button>
   <div className="auth-bottom">Don't have an account? <Link to="/signup">Sign Up</Link></div>
  </form></div>
 </main>
}

function AuthRoleInfo({role, mode}) {
 const guide = role === "guide";
 return <section className={`auth-role-info ${guide ? "guide" : "traveller"}`}>
   <div className="auth-role-inner">
     <div className="auth-role-badge"><i className={`bi ${guide ? "bi-compass" : "bi-person"}`}></i>{guide ? "LOCAL GUIDE" : "TRAVELLER"}</div>
     <h1>{guide ? <>Share Your<br/><span>Local Expertise.</span></> : <>Discover More.<br/><span>Travel Better.</span></>}</h1>
     <p>{guide ? "Create travel experiences, share your destination knowledge, and help travellers discover places through a local perspective." : "Find inspiring destinations, choose the right travel packages, and plan memorable journeys with Smart Travel Guide."}</p>
     <div className="auth-role-benefits">
       {(guide ? [
         ["bi-box-seam","Create Packages","Build travel packages around places you know best."],
         ["bi-people","Guide Travellers","Connect with travellers and make their journeys meaningful."],
         ["bi-star","Build Your Reputation","Receive reviews and grow as a trusted local guide."]
       ] : [
         ["bi-compass","Discover Places","Explore destinations, attractions and local experiences."],
         ["bi-calendar-check","Plan Your Trip","Choose packages that fit your interests and budget."],
         ["bi-heart","Enjoy the Journey","Save trips, share reviews and get useful recommendations."]
       ]).map(([icon,title,text]) => <div className="auth-role-benefit" key={title}>
         <span><i className={`bi ${icon}`}></i></span><div><strong>{title}</strong><small>{text}</small></div>
       </div>)}
     </div>
     <div className="auth-role-footer"><i className="bi bi-check-circle-fill"></i> {guide ? "Your knowledge can create better journeys." : "Your journey starts with one simple login."}</div>
   </div>
 </section>
}
function Field({label,value,setValue,type}){return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>setValue(e.target.value)} placeholder={label}/></div>}
