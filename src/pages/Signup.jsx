import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../utils";
import RoleSwitcher from "../components/RoleSwitcher";

const initial = {
  name:"", email:"", phone:"", dob:"", gender:"", state:"", address:"",
  travelTypes:[], budget:"", interests:"", guideBio:"", guideExpertise:"", languages:"", experience:"", qualification:"", additionalInterests:"", password:"", confirmPassword:"", terms:false
};

export default function Signup() {
  const [form,setForm]=useState(initial);
  const [role,setRole]=useState("user");
  const [error,setError]=useState("");
  const navigate=useNavigate();
  const today=new Date().toLocaleDateString("en-CA");
  const change=e=>setForm({...form,[e.target.name]:e.target.type==="checkbox"?e.target.checked:e.target.value});
  const toggleType=t=>setForm({...form,travelTypes:form.travelTypes.includes(t)?form.travelTypes.filter(x=>x!==t):[...form.travelTypes,t]});
  async function submit(e){
    e.preventDefault(); setError("");
    const commonRequired=["name","email","phone","dob","gender","state","address","password","confirmPassword"];
    if(commonRequired.some(k=>!form[k])) return setError("Please complete all required fields.");
    if(form.password!==form.confirmPassword) return setError("Passwords do not match.");
    if(form.password.length<8) return setError("Password must contain at least 8 characters.");
    if(role === "guide") {
      const guideRequired=["guideBio","guideExpertise","languages","experience"];
      if(guideRequired.some(k=>!form[k])) return setError("Please complete all required local guide profile fields.");
    } else if(!form.travelTypes.length || !form.budget) {
      return setError("Please select your preferred travel types and budget range.");
    }
    if(!form.terms) return setError("Please accept the Terms & Conditions.");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...form, role})
      });
      const data = await response.json();
      if (!response.ok) return setError(data.message || "Could not create account.");
      saveUser({...form, role});
      navigate("/login?registered=1");
    } catch {
      setError("Cannot connect to the server. Start it with: npm run server");
    }
  }
  return <main className="auth-page signup-page">
    <AuthRoleInfo role={role} mode="signup" />
    <div className="auth-card-wrap">
      <div className="auth-top">Already have an account? <Link to="/login">Login</Link></div>
      <form className="auth-card signup-card" onSubmit={submit}>
        <div className="auth-brand"><span className="brand-mark"><i className="bi bi-compass"></i></span><strong>Smart <b>Travel</b> Guide</strong></div>
        <h2>Create Your <span>{role === "guide" ? "Guide Account" : "Account"}</span></h2><p>{role === "guide" ? "Create your local guide profile and start sharing your destination expertise." : "Join Smart Travel Guide and start exploring India."}</p>
        <RoleSwitcher role={role} onChange={setRole}/>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <h5>Personal Information</h5>
        <div className="form-grid">
          <Field label="Full Name" name="name" value={form.name} onChange={change} required />
          <Field label="Email Address" name="email" type="email" value={form.email} onChange={change} required />
          <Field label="Phone Number" name="phone" value={form.phone} onChange={change} required />
          <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={change} max={today} required />
          <div className="field"><label>Gender <em>*</em></label><div className="radio-row">{["Male","Female","Other"].map(g=><label key={g}><input type="radio" name="gender" value={g} checked={form.gender===g} onChange={change}/>{g}</label>)}</div></div>
          <Field label="Home State / City" name="state" value={form.state} onChange={change} placeholder="e.g. Andhra Pradesh" required />
        </div>
        <Field label="Address" name="address" value={form.address} onChange={change} placeholder="Enter your complete address" required />
        {role === "guide" ? <>
          <h5>Local Guide Profile</h5>
          <Field label="Guide Bio" name="guideBio" value={form.guideBio} onChange={change} placeholder="Tell travellers about your local knowledge and guiding style" required />
          <div className="form-grid">
            <div className="field"><label>Guide Expertise <em>*</em></label><select name="guideExpertise" value={form.guideExpertise} onChange={change} required><option value="">Select expertise</option><option>Heritage & History</option><option>Nature & Wildlife</option><option>Adventure</option><option>Beaches</option><option>Culture & Food</option><option>Spiritual Tours</option><option>Photography</option></select></div>
            <Field label="Languages You Speak" name="languages" value={form.languages} onChange={change} placeholder="English, Telugu, Hindi..." required />
            <Field label="Guiding Experience" name="experience" value={form.experience} onChange={change} placeholder="e.g. 3 years" required />
            <Field label="Qualification / Certification (Optional)" name="qualification" value={form.qualification} onChange={change} placeholder="Tourism, heritage, first aid..." />
          </div>
          <Field label="Additional Interests (Optional)" name="additionalInterests" value={form.additionalInterests} onChange={change} placeholder="Photography, food, trekking..." />
        </> : <>
          <h5>Travel Preferences</h5>
          <div className="field"><label>Preferred Travel Types <em>*</em></label><div className="chips">{["Beaches","Mountains","Historical","Adventure","Spiritual","Wildlife","Cultural"].map(t=><button type="button" className={form.travelTypes.includes(t)?"chip active":"chip"} onClick={()=>toggleType(t)} key={t}>{t}</button>)}</div></div>
          <div className="form-grid"><div className="field"><label>Preferred Budget Range <em>*</em></label><select name="budget" value={form.budget} onChange={change}><option value="">Select budget range</option><option>Under ₹10,000</option><option>₹10,000 – ₹20,000</option><option>₹20,000 – ₹40,000</option><option>Above ₹40,000</option></select></div><Field label="Travel Interests (Optional)" name="interests" value={form.interests} onChange={change} placeholder="Food, trekking, photography..." /></div>
        </>}
        <h5>Account Security</h5>
        <div className="form-grid"><Field label="Password" name="password" type="password" value={form.password} onChange={change} placeholder="At least 8 characters" required/><Field label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={change} required/></div>
        <label className="terms"><input type="checkbox" name="terms" checked={form.terms} onChange={change}/> I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a> <em>*</em></label>
        <button className="btn btn-primary btn-lg w-100">Create Account <i className="bi bi-arrow-right"></i></button>
      </form>
    </div>
  </main>
}

function AuthRoleInfo({role, mode}) {
 const guide = role === "guide";
 return <section className={`auth-role-info ${guide ? "guide" : "traveller"}`}>
   <div className="auth-role-inner">
     <div className="auth-role-badge"><i className={`bi ${guide ? "bi-compass" : "bi-person"}`}></i>{guide ? "LOCAL GUIDE" : "TRAVELLER"}</div>
     <h1>{guide ? <>Create Your<br/><span>Guide Profile.</span></> : <>Create Your<br/><span>Travel Profile.</span></>}</h1>
     <p>{guide ? "Join as a local guide and turn your knowledge of places, culture and experiences into better journeys for travellers." : "Join Smart Travel Guide to discover destinations, plan trips and get experiences matched to the way you like to travel."}</p>
     <div className="auth-role-benefits">
       {(guide ? [
         ["bi-box-seam","Create Packages","Share travel packages built around your local expertise."],
         ["bi-translate","Share Your Knowledge","Show travellers the culture, stories and experiences you know."],
         ["bi-star","Grow With Reviews","Build trust through traveller feedback and great experiences."]
       ] : [
         ["bi-compass","Explore Destinations","Discover places, attractions and experiences across India."],
         ["bi-sliders","Choose Your Preferences","Tell us your interests so your travel experience feels personal."],
         ["bi-calendar-check","Plan Better Trips","Find packages and organise your journeys in one place."]
       ]).map(([icon,title,text]) => <div className="auth-role-benefit" key={title}>
         <span><i className={`bi ${icon}`}></i></span><div><strong>{title}</strong><small>{text}</small></div>
       </div>)}
     </div>
     <div className="auth-role-footer"><i className="bi bi-check-circle-fill"></i> {guide ? "Start sharing what makes your destination special." : "Start with your profile and discover your next journey."}</div>
   </div>
 </section>
}

function Field({label,name,value,onChange,type="text",placeholder,required,max}){return <div className="field"><label>{label} {required&&<em>*</em>}</label><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder||`Enter ${label.toLowerCase()}`} max={max} required={required}/></div>}
