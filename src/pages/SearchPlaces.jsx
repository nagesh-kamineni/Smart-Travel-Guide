import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { destinations } from "../data/travelData";
import DestinationCard from "../components/DestinationCard";

export default function SearchPlaces(){
 const [params]=useSearchParams();
 const [q,setQ]=useState("");
 const [state,setState]=useState("All States");
 const [type,setType]=useState(params.get("type")||"All Types");
 const [guideDate,setGuideDate]=useState("");
 const today=new Date().toLocaleDateString("en-CA");
 const states=[...new Set(destinations.map(x=>x.state))].sort();
 const types=[...new Set(destinations.map(x=>x.type))].sort();
 const list=useMemo(()=>destinations.filter(x=>{
   const text=`${x.name} ${x.state} ${x.type}`.toLowerCase();
   return (!q||text.includes(q.toLowerCase())) && (state==="All States"||x.state===state) && (type==="All Types"||x.type===type);
 }),[q,state,type]);
 const clear=()=>{setQ("");setState("All States");setType("All Types");setGuideDate("")};
 return <main className="inner-page search-page">
  <section className="search-hero-card"><div><span className="eyebrow"><i className="bi bi-compass"></i> Explore India</span><h1>Find Your Next Place</h1><p>Search destinations by name, filter by state and place type, and check local-guide availability for your travel date.</p></div><div className="search-hero-icon"><i className="bi bi-map"></i></div></section>
  <section className="search-controls-card">
   <div className="search-input-large"><i className="bi bi-search"></i><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Place"/></div>
   <div className="search-filter-grid"><label><span>State</span><select value={state} onChange={e=>setState(e.target.value)}><option>All States</option>{states.map(x=><option key={x}>{x}</option>)}</select></label><label><span>Place Type</span><select value={type} onChange={e=>setType(e.target.value)}><option>All Types</option>{types.map(x=><option key={x}>{x}</option>)}</select></label><label><span>Guide availability date</span><input type="date" min={today} value={guideDate} onChange={e=>setGuideDate(e.target.value)}/></label><button className="clear-search-btn" onClick={clear}><i className="bi bi-arrow-counterclockwise"></i> Clear</button></div>
   <div className="search-summary"><strong>{list.length}</strong> destination{list.length!==1?"s":""} found <span>{state!=="All States"&&`• ${state}`}</span><span>{type!=="All Types"&&`• ${type}`}</span>{guideDate&&<span>• Guides on {guideDate}</span>}</div>
  </section>
  <section className="search-results"><div className="section-heading"><div><h2>Destinations</h2><p>Select a destination to explore its local-guide availability.</p></div></div>{list.length?<div className="destination-grid search-results-grid">{list.map(x=><DestinationCard item={x} key={x.id} guideDate={guideDate}/>)}</div>:<div className="empty-state"><i className="bi bi-search"></i><strong>No destinations match your filters.</strong><span>Try a different state, place type or search term.</span></div>}</section>
 </main>
}
