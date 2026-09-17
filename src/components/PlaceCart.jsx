import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSelectedDestinations, getSelectedDestinations, toggleSelectedDestination } from "../utils/roadmapUtils";

export default function PlaceCart(){
  const [open,setOpen]=useState(false);
  const [places,setPlaces]=useState([]);
  const navigate=useNavigate();
  const refresh=()=>setPlaces(getSelectedDestinations());
  useEffect(()=>{
    refresh();
    window.addEventListener("stg-selection-change",refresh);
    window.addEventListener("storage",refresh);
    return()=>{window.removeEventListener("stg-selection-change",refresh);window.removeEventListener("storage",refresh)};
  },[]);
  const canGenerate=places.length>=2;
  const remove=id=>{toggleSelectedDestination(id);refresh();};
  const generate=()=>{if(!canGenerate)return;setOpen(false);navigate("/user/roadmap")};
  return <div className="place-cart-wrap">
    <button className={`place-cart-btn ${open?"active":""}`} onClick={()=>setOpen(v=>!v)} aria-label="Open selected places cart" aria-expanded={open}>
      <i className="bi bi-bag"></i><span className="place-cart-label">My Places</span>{places.length>0&&<b className="place-cart-count">{places.length}</b>}
    </button>
    {open&&<>
      <div className="place-cart-backdrop" onClick={()=>setOpen(false)}></div>
      <div className="place-cart-popover">
        <div className="place-cart-header"><div><strong>Selected Places</strong><small>{places.length} destination{places.length!==1?"s":""} in your travel plan</small></div><button onClick={()=>setOpen(false)} aria-label="Close"><i className="bi bi-x-lg"></i></button></div>
        {places.length?<>
          <div className="place-cart-list">{places.map((p,i)=><div className="place-cart-item" key={p.id}><img src={p.image} alt=""/><div><strong>{p.name}</strong><small>{p.state}</small></div><button onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}><i className="bi bi-trash3"></i></button></div>)}</div>
          <div className="place-cart-footer"><button className="place-cart-clear" onClick={()=>{clearSelectedDestinations();refresh()}}>Clear All</button><button className="btn btn-primary place-cart-generate" disabled={!canGenerate} onClick={generate}><i className="bi bi-signpost-2"></i> Generate Plan</button></div>
          {!canGenerate&&<small className="place-cart-hint">Select at least 2 places to generate your shortest-distance plan.</small>}
        </>:<div className="place-cart-empty"><i className="bi bi-bag-plus"></i><strong>Your place cart is empty</strong><span>Select places from Search Places and they will appear here.</span></div>}
      </div>
    </>}
  </div>
}
