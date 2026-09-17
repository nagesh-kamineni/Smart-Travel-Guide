import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoadmapMap from "../components/RoadmapMap";
import { fetchRoadMatrix, fetchRoadRoute, formatDistance, formatHours, getSelectedDestinations, haversineKm, shortestOpenRoute } from "../utils/roadmapUtils";

export default function Roadmap(){
  const navigate=useNavigate();
  const [places,setPlaces]=useState([]);
  const [ordered,setOrdered]=useState([]);
  const [route,setRoute]=useState(null);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");
  const [usingRoad,setUsingRoad]=useState(false);

  useEffect(()=>{
    const selected=getSelectedDestinations();
    setPlaces(selected);
    if(selected.length<2){setLoading(false);return;}
    (async()=>{
      try{
        const matrix=await fetchRoadMatrix(selected);
        const result=shortestOpenRoute(selected,matrix);
        const next=result.order.map(i=>selected[i]);
        setOrdered(next);
        try{
          const road=await fetchRoadRoute(next);
          setRoute(road);
          setUsingRoad(true);
        }catch{
          setRoute({distance:result.distance,duration:NaN,coordinates:next.map(p=>[p.lat,p.lng])});
          setMessage("Road routing is temporarily unavailable, so the map is showing a direct route between stops.");
        }
      }catch{
        const result=shortestOpenRoute(selected);
        const next=result.order.map(i=>selected[i]);
        setOrdered(next);
        setRoute({distance:result.distance,duration:NaN,coordinates:next.map(p=>[p.lat,p.lng])});
        setMessage("Road routing is temporarily unavailable. The shortest route is calculated using geographic distance.");
      }finally{setLoading(false)}
    })();
  },[]);

  const directDistance=useMemo(()=>ordered.reduce((sum,p,i)=>i?sum+haversineKm(ordered[i-1],p):0,0),[ordered]);
  if(!loading && places.length<2) return <main className="inner-page"><div className="inner-header"><span className="eyebrow"><i className="bi bi-signpost-2"></i> Travel Planner</span><h1>Generate Your Roadmap</h1><p>Select at least two places first, then generate a route that visits every selected destination.</p></div><div className="roadmap-empty"><i className="bi bi-map"></i><strong>Choose 2 or more places</strong><span>Go to All Places, select your destinations and click Generate Roadmap.</span><Link className="btn btn-primary" to="/user/recommendations/places">Select Places</Link></div></main>;

  return <main className="inner-page roadmap-page">
    <div className="inner-header roadmap-header"><div><span className="eyebrow"><i className="bi bi-signpost-2"></i> Smart Route Planner</span><h1>Your Travel Roadmap</h1><p>The route is arranged to visit every selected place with the shortest available travel distance.</p></div><button className="btn btn-outline-primary" onClick={()=>navigate('/user/recommendations/places')}><i className="bi bi-pencil"></i> Change Places</button></div>
    {message&&<div className="roadmap-note"><i className="bi bi-info-circle"></i>{message}</div>}
    <section className="roadmap-summary"><div><i className="bi bi-geo-alt"></i><span>Places</span><strong>{ordered.length}</strong></div><div><i className="bi bi-signpost-2"></i><span>Total distance</span><strong>{route?formatDistance(route.distance):"—"}</strong></div><div><i className="bi bi-clock"></i><span>Estimated drive time</span><strong>{route&&usingRoad?formatHours(route.duration):"—"}</strong></div></section>
    <section className="roadmap-layout">
      <div className="roadmap-map-panel"><div className="roadmap-map-title"><div><strong>Route Map</strong><small>{usingRoad?"Road route between all selected destinations":"Direct-distance route"}</small></div><span><i className="bi bi-check-circle-fill"></i> All stops included</span></div><RoadmapMap places={ordered} routeCoordinates={route?.coordinates}/></div>
      <aside className="roadmap-stops"><div className="stops-heading"><strong>Visit in this order</strong><small>{ordered.length} destinations</small></div>{ordered.map((p,i)=><div className="roadmap-stop" key={p.id}><div className="stop-number">{i+1}</div><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>{p.state}</small></div>{i<ordered.length-1&&<i className="bi bi-arrow-down"></i>}</div>)}<div className="route-total"><span>Total route</span><strong>{route?formatDistance(route.distance):formatDistance(directDistance)}</strong></div></aside>
    </section>
  </main>;
}
