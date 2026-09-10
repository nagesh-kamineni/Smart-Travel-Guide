import React, {useEffect,useState} from "react";
import { initialTrips } from "../data/travelData";
import { getReviews, getUser } from "../utils";
export default function MyReviews(){
 const [reviews,setReviews]=useState(getReviews());
 const user=getUser()||{};
 useEffect(()=>{const f=()=>setReviews(getReviews());window.addEventListener("stg-data-change",f);return()=>window.removeEventListener("stg-data-change",f)},[]);
 const mine=reviews.filter(r=>!r.userEmail||r.userEmail===user.email);
 return <main className="inner-page"><div className="inner-header"><span className="eyebrow">Your experiences</span><h1>My Reviews</h1><p>Review status is completed only after you actually submit a rating and review.</p></div><div className="review-status-summary"><div><strong>{mine.length}</strong><span>Reviews Submitted</span></div><div><strong>{Math.max(0,initialTrips.filter(t=>t.status==="Completed").length-mine.length)}</strong><span>Pending Reviews</span></div></div><div className="review-list">{initialTrips.filter(t=>t.status==="Completed").map(t=>{const r=mine.find(x=>x.tripId===t.id);return <div className="review-card" key={t.id}><div className="review-card-top"><div><h4>{t.destination}</h4><small>{t.dates}</small></div><span className={`review-status-pill ${r?"completed":"pending"}`}>{r?"Completed":"Pending"}</span></div>{r?<><div className="stars-input small">{[1,2,3,4,5].map(n=><span key={n}>{n<=r.rating?"★":"☆"}</span>)}</div><p>“{r.comment}”</p><small>Submitted {new Date(r.submittedAt).toLocaleDateString("en-IN")}</small></>:<p className="pending-copy"><i className="bi bi-clock"></i> This completed trip is waiting for your review. Open the User Dashboard to submit your rating.</p>}</div>})}</div></main>
}
