import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { destinations, packages as defaultPackages } from "../data/travelData";
import DestinationCard from "../components/DestinationCard";
import PackageCard from "../components/PackageCard";
import { fetchGuidePackages } from "../utils";

export default function Recommendations({mode}){
 const [guidePackages,setGuidePackages]=useState([]);
 useEffect(()=>{const f=async()=>setGuidePackages(await fetchGuidePackages());f();window.addEventListener("stg-data-change",f);return()=>window.removeEventListener("stg-data-change",f)},[]);
 const allPackages=useMemo(()=>[...guidePackages,...defaultPackages],[guidePackages]);
 const showPlaces=mode!=="packages";
 const showPackages=mode!=="places";
 const placeItems=mode==="places"?destinations:destinations.slice(1,7);
 const packageItems=mode==="packages"?allPackages:allPackages.slice(0,4);
 const isAllPlaces=mode==="places";
 const isAllPackages=mode==="packages";
 const [guideDate,setGuideDate]=useState("");
 const today=new Date().toLocaleDateString("en-CA");
 return <main className="inner-page recommendation-page">
  <div className="inner-header"><span className="eyebrow"><i className="bi bi-stars"></i> {isAllPlaces||isAllPackages?"Explore":"Personalized for you"}</span><h1>{isAllPlaces?"All Places":isAllPackages?"All Packages":"Smart Recommendations"}</h1><p>{isAllPlaces?"Browse every available destination in the system.":isAllPackages?"Browse every available package from Smart Travel Guide and Local Guides.":"Suggestions based on your profile, previous trips, searches and reviews."}</p></div>
  <div className="recommendation-banner"><i className="bi bi-stars"></i><div><strong>Personalized suggestions</strong><p>Your travel preferences and previous journey history help us find places and packages you may enjoy.</p></div></div>
  {showPlaces&&<section className="recommendation-section"><div className="section-heading"><div><h2>{isAllPlaces?"All Places":"Recommended Places"}</h2><p>{isAllPlaces?"All available destinations.":"Destinations selected for you."}</p></div>{mode!=="places"&&<Link to="/user/recommendations/places">View All Places</Link>}</div>{isAllPlaces&&<div className="guide-date-filter"><label><i className="bi bi-person-badge"></i> Check local guide availability</label><input type="date" min={today} value={guideDate} onChange={e=>setGuideDate(e.target.value)}/></div>}<div className="destination-grid">{placeItems.map(x=><DestinationCard item={x} key={x.id} guideDate={isAllPlaces?guideDate:""}/>)}</div></section>}
  {showPackages&&<section className="recommendation-section"><div className="section-heading"><div><h2>{isAllPackages?"All Packages":"Recommended Packages"}</h2><p>{isAllPackages?"All available packages from Smart Travel Guide and Local Guides.":"Packages from Smart Travel Guide and Local Guides."}</p></div>{mode!=="packages"&&<Link to="/user/recommendations/packages">View All Packages</Link>}</div><div className="package-grid">{packageItems.map(x=><PackageCard item={x} key={`${x.guideEmail||"smart"}-${x.id}`}/>)}</div></section>}
 </main>
}
