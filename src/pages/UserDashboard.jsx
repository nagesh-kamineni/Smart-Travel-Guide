import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { destinations, packages as defaultPackages, initialTrips } from "../data/travelData";
import DestinationCard from "../components/DestinationCard";
import PackageCard from "../components/PackageCard";
import { getUser, getGuidePackages, fetchGuidePackages, getReviews, saveReview } from "../utils";

export default function UserDashboard(){
 const [user,setUser]=useState(getUser()||{name:"Traveler"});
 const [trips,setTrips]=useState(initialTrips);
 const [reviewTrip,setReviewTrip]=useState(null);
 const [guidePackages,setGuidePackages]=useState([]);
 const [guideDate,setGuideDate]=useState("");
 const [rating,setRating]=useState(0);
 const [reviewText,setReviewText]=useState("");
 useEffect(()=>{const refresh=async()=>setGuidePackages(await fetchGuidePackages()); refresh(); window.addEventListener("stg-data-change",refresh); return()=>window.removeEventListener("stg-data-change",refresh)},[]);
 useEffect(()=>{
   const reviews=getReviews();
   setTrips(initialTrips.map(t=>({...t, reviewed: reviews.some(r=>r.tripId===t.id)})));
 },[]);
 const allPackages=useMemo(()=>[...guidePackages,...defaultPackages], [guidePackages]);
 const recommendedPlaces=destinations.slice(1,5);
 const recommendedPackages=allPackages.slice(0,4);
 const pendingReview=trips.find(t=>t.status==="Completed"&&!t.reviewed);
 const openReview=()=>{if(pendingReview){setReviewTrip(pendingReview);setRating(0);setReviewText("")}};
 function submitReview(e){
   e.preventDefault();
   if(!reviewTrip||rating<1||!reviewText.trim()) return alert("Please select a star rating and write your review before submitting.");
   saveReview({id:crypto.randomUUID(),tripId:reviewTrip.id,destination:reviewTrip.destination,rating,comment:reviewText.trim(),submittedAt:new Date().toISOString(),userEmail:user.email});
   setTrips(prev=>prev.map(t=>t.id===reviewTrip.id?{...t,reviewed:true}:t));
   setReviewTrip(null);
 }
 return <main className="user-page">
  <section className="user-hero">
   <div className="user-hero-content">
    <span className="eyebrow"><i className="bi bi-compass"></i> Your Personal Travel Space</span>
    <h1>Welcome back, {user.name?.split(" ")[0]}! 👋</h1>
    <p>Discover places, compare packages and plan your next journey.</p>
    <Link to="/user/search" className="dashboard-search-button"><i className="bi bi-search"></i><span>Search Places</span><i className="bi bi-arrow-right"></i></Link>

   </div><img src="/assets/user-hero-clean.jpg" alt="Travel"/>
  </section>

  {pendingReview&&<div className="review-reminder"><div><i className="bi bi-star-fill"></i><strong>Share your experience</strong><span>Your {pendingReview.destination} trip is completed but still awaiting a review.</span></div><button className="btn btn-primary" onClick={openReview}>Review Now</button></div>}

  <section className="content-section user-content">
   <div className="section-heading"><div><h2>Recommended Places</h2><p>Places selected from your travel preferences and journey history.</p></div><Link to="/user/recommendations/places">View All Places</Link></div>
   <div className="guide-date-filter"><label><i className="bi bi-person-badge"></i> Check local guide availability</label><input type="date" value={guideDate} onChange={e=>setGuideDate(e.target.value)}/></div>
   <div className="destination-grid">{recommendedPlaces.map(x=><DestinationCard item={x} key={x.id} guideDate={guideDate}/>)}</div>
  </section>

  <section className="content-section user-content package-section-user">
   <div className="section-heading"><div><h2>Packages</h2><p>Smart Travel Guide and Local Guide packages are available together.</p></div><Link to="/user/recommendations/packages">View All Packages</Link></div>
   <div className="package-grid">{recommendedPackages.map(x=><PackageCard item={x} key={`${x.guideEmail||"smart"}-${x.id}`}/>)}</div>
  </section>

  <section className="content-section user-bottom-grid"><div className="panel"><div className="section-heading"><h3>My Trips</h3><Link to="/user/trips">View All</Link></div>{trips.map(t=><div className="trip-row" key={t.id}><img src={t.image}/><div><strong>{t.destination}</strong><small>{t.dates}</small></div><span className={`status ${t.reviewed?"review-completed":"review-pending"}`}>{t.reviewed?"Review Completed":"Review Pending"}</span></div>)}</div><div className="panel"><div className="section-heading"><h3>Quick Actions</h3></div><div className="quick-actions"><Link to="/user/profile"><i className="bi bi-person"></i>Edit Profile</Link><Link to="/user/search"><i className="bi bi-search"></i>Search Places</Link><button onClick={openReview} disabled={!pendingReview}><i className="bi bi-star"></i>{pendingReview?"Write Review":"No Pending Review"}</button><Link to="/user/recommendations"><i className="bi bi-stars"></i>All Recommendations</Link><Link to="/user/suggest-place"><i className="bi bi-geo-alt"></i>Suggest a Place</Link></div></div></section>

  {reviewTrip&&<div className="modal-backdrop-custom"><div className="review-modal"><button className="modal-close" onClick={()=>setReviewTrip(null)}>×</button><img src={reviewTrip.image} alt={reviewTrip.destination}/><div><span className="eyebrow">Trip Review</span><h2>How was your trip to {reviewTrip.destination}?</h2><p>Please rate your experience and share a few words.</p><form onSubmit={submitReview}><div className="stars-input interactive-stars" aria-label="Star rating">{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?"star active":"star"} onClick={()=>setRating(n)} aria-label={`${n} star${n>1?"s":""}`}>{n<=rating?"★":"☆"}</button>)}</div><textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Share your experience, favorite moments, and tips for other travelers..." rows="5"></textarea><div className="modal-actions"><button className="btn btn-primary" type="submit">Submit Review</button><button type="button" className="btn btn-outline-primary" onClick={()=>setReviewTrip(null)}>Later</button></div></form></div></div></div>}
 </main>
}
