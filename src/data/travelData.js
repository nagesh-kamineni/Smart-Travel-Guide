export const destinations = [
  { id: 1, name: "Agra", state: "Uttar Pradesh", rating: 4.6, type: "Historical", image: "/assets/agra.jpg" },
  { id: 2, name: "Manali", state: "Himachal Pradesh", rating: 4.5, type: "Mountains", image: "/assets/manali.jpg" },
  { id: 3, name: "Alleppey", state: "Kerala", rating: 4.7, type: "Nature", image: "/assets/alleppey.jpg" },
  { id: 4, name: "Goa", state: "Goa", rating: 4.4, type: "Beaches", image: "/assets/goa.jpg" },
  { id: 5, name: "Udaipur", state: "Rajasthan", rating: 4.6, type: "Historical", image: "/assets/udaipur.jpg" },
  { id: 6, name: "Gangtok", state: "Sikkim", rating: 4.5, type: "Mountains", image: "/assets/gangtok.jpg" },
  { id: 7, name: "Kashmir", state: "Jammu & Kashmir", rating: 4.8, type: "Mountains", image: "/assets/manali.jpg" },
  { id: 8, name: "Andaman", state: "Andaman & Nicobar", rating: 4.7, type: "Beaches", image: "/assets/goa.jpg" },
  { id: 9, name: "Coorg", state: "Karnataka", rating: 4.6, type: "Nature", image: "/assets/alleppey.jpg" }
];

export const packages = [
  { id: 1, name: "Kashmir Escape", startDate: "2026-10-10", endDate: "2026-10-14", days: 5, duration: "5 Days / 4 Nights", price: 18999, rating: 4.8, image: "/assets/manali.jpg", description: "A scenic Kashmir journey through mountain landscapes, lakes and memorable local experiences.", places: [destinations[6]] },
  { id: 2, name: "Kerala Backwaters", startDate: "2026-10-18", endDate: "2026-10-21", days: 4, duration: "4 Days / 3 Nights", price: 14999, rating: 4.7, image: "/assets/alleppey.jpg", description: "Relax among Kerala's backwaters and enjoy nature, local culture and peaceful waterside experiences.", places: [destinations[2]] },
  { id: 3, name: "Rajasthan Heritage", startDate: "2026-11-05", endDate: "2026-11-10", days: 6, duration: "6 Days / 5 Nights", price: 21999, rating: 4.6, image: "/assets/udaipur.jpg", description: "Discover royal architecture, lakes and the rich heritage of Rajasthan.", places: [destinations[4]] },
  { id: 4, name: "Goa Beach Fun", startDate: "2026-11-15", endDate: "2026-11-18", days: 4, duration: "4 Days / 3 Nights", price: 12999, rating: 4.5, image: "/assets/goa.jpg", description: "Enjoy Goa's beaches, relaxed atmosphere and unforgettable coastal experiences.", places: [destinations[3]] }
];

export const initialTrips = [
  { id: 1, destination: "Goa", dates: "Jan 12 – Jan 16, 2026", status: "Completed", reviewed: false, image: "/assets/goa.jpg" },
  { id: 2, destination: "Agra", dates: "Mar 03 – Mar 05, 2026", status: "Completed", reviewed: true, image: "/assets/agra.jpg" },
  { id: 3, destination: "Kerala", dates: "Aug 20 – Aug 25, 2025", status: "Completed", reviewed: true, image: "/assets/alleppey.jpg" }
];
