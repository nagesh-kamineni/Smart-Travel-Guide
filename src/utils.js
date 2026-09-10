export const DEFAULT_USER = { name: "Traveler", email: "", phone: "", dob: "", gender: "", state: "", address: "", travelTypes: [], budget: "", interests: "", role: "user" };

export function getUser() { try { return JSON.parse(sessionStorage.getItem("stg_user")) || null; } catch { return null; } }
export function saveUser(user) { sessionStorage.setItem("stg_user", JSON.stringify(user)); }
export function isLoggedIn() { return sessionStorage.getItem("stg_logged_in") === "true"; }
export function setLoggedIn(value) { sessionStorage.setItem("stg_logged_in", String(value)); }

const KEY_PACKAGES = "stg_guide_packages";
const KEY_BOOKINGS = "stg_package_bookings";
const KEY_GUIDE_PLACES = "stg_guide_place_availability";

export function readJSON(key, fallback=[]) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
export function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("stg-data-change")); }
export function getGuidePackages() { return readJSON(KEY_PACKAGES, []); }
export function saveGuidePackage(pkg) { const all=getGuidePackages(); writeJSON(KEY_PACKAGES,[pkg,...all]); return pkg; }
export function deleteGuidePackage(id) { writeJSON(KEY_PACKAGES,getGuidePackages().filter(p=>p.id!==id)); }
export function getBookings() { return readJSON(KEY_BOOKINGS, []); }
export function addBooking(booking) { const all=getBookings(); writeJSON(KEY_BOOKINGS,[booking,...all]); return booking; }
export function getGuidePlaceAvailability() { return readJSON(KEY_GUIDE_PLACES, []); }
export function saveGuidePlaceAvailability(record) { const all=getGuidePlaceAvailability(); const exists=all.some(x=>x.guideEmail===record.guideEmail&&x.placeId===record.placeId&&x.date===record.date); if(!exists) writeJSON(KEY_GUIDE_PLACES,[record,...all]); return record; }
export function removeGuidePlaceAvailability(id) { writeJSON(KEY_GUIDE_PLACES,getGuidePlaceAvailability().filter(x=>x.id!==id)); }

export async function fetchGuidePackages(guideEmail="") { try { const q=guideEmail?`?guideEmail=${encodeURIComponent(guideEmail)}`:""; const r=await fetch(`/api/guide/packages${q}`); if(!r.ok) throw new Error(); const data=await r.json(); if(!data.length){ const local=getGuidePackages(); if(guideEmail) return local.filter(p=>p.guideEmail===guideEmail); if(local.length) return local; } return data; } catch { return getGuidePackages(); } }
export async function createGuidePackage(pkg) { try { const r=await fetch("/api/guide/packages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pkg)}); const d=await r.json(); if(!r.ok) throw new Error(d.message||"Could not publish package"); writeJSON(KEY_PACKAGES,getGuidePackages().filter(x=>x.id!==pkg.id)); return d.package; } catch { return saveGuidePackage(pkg); } }
export async function removeGuidePackage(id) { try { const r=await fetch(`/api/guide/packages/${encodeURIComponent(id)}`,{method:"DELETE"}); if(!r.ok) throw new Error(); writeJSON(KEY_PACKAGES,getGuidePackages().filter(p=>p.id!==id)); return true; } catch { deleteGuidePackage(id); return false; } }
export async function fetchBookings(filters={}) { try { const qs=new URLSearchParams(); if(filters.guideEmail) qs.set("guideEmail",filters.guideEmail); if(filters.travellerEmail) qs.set("travellerEmail",filters.travellerEmail); const r=await fetch(`/api/bookings?${qs.toString()}`); if(!r.ok) throw new Error(); return await r.json(); } catch { const all=getBookings(); if(filters.guideEmail) return all.filter(b=>b.guideEmail===filters.guideEmail); if(filters.travellerEmail) return all.filter(b=>b.travellerEmail===filters.travellerEmail); return all; } }
export async function createBooking(booking) { try { const r=await fetch("/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(booking)}); const d=await r.json(); if(!r.ok) throw new Error(d.message||"Could not complete booking"); addBooking(d.booking); return d.booking; } catch(e) { if(e.message) throw e; return addBooking(booking); } }

export function parseDate(value) { if(!value) return null; const d=new Date(`${value}T00:00:00`); return Number.isNaN(d.getTime()) ? null : d; }
export function daysBetween(start,end) { const a=parseDate(start), b=parseDate(end); if(!a||!b||b<a) return 0; return Math.floor((b-a)/86400000)+1; }
export function rangesOverlap(aStart,aEnd,bStart,bEnd) { const a=parseDate(aStart), b=parseDate(aEnd), c=parseDate(bStart), d=parseDate(bEnd); return !!(a&&b&&c&&d&&a<=d&&c<=b); }
export function guideHasPackageConflict(guideEmail, placeId, date) { return getGuidePackages().some(p=>p.guideEmail===guideEmail && p.places?.some(x=>x.id===placeId) && rangesOverlap(p.startDate,p.endDate,date,date)); }
export function guideIsAvailableForPlace(placeId,date) { const places=getGuidePlaceAvailability(); return places.filter(x=>x.placeId===placeId&&x.date===date&&!guideHasPackageConflict(x.guideEmail,placeId,date)); }
export function guideHasAnyPackageOnDate(guideEmail,date) { return getGuidePackages().some(p=>p.guideEmail===guideEmail&&rangesOverlap(p.startDate,p.endDate,date,date)); }
export function formatDate(value) { const d=parseDate(value); return d ? d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"; }

const KEY_REVIEWS = "stg_reviews";
export function getReviews() { return readJSON(KEY_REVIEWS, []); }
export function saveReview(review) { const all=getReviews(); writeJSON(KEY_REVIEWS,[review,...all]); return review; }
