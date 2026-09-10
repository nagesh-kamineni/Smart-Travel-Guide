import React from "react";
import { Link } from "react-router-dom";
import { destinations, packages } from "../data/travelData";
import DestinationCard from "../components/DestinationCard";
import PackageCard from "../components/PackageCard";

const highlights = [
  ["bi-map", "Discover India", "Explore inspiring places, from mountains and beaches to heritage cities."],
  ["bi-calendar-check", "Plan With Ease", "Find travel packages designed to make planning simple and convenient."],
  ["bi-shield-check", "Travel With Confidence", "Clear package details and helpful travel information before you go."],
  ["bi-headset", "Travel Support", "Get guidance throughout your journey whenever you need it."]
];

const stories = [
  ["A wonderful way to plan our Rajasthan trip. Everything felt simple and well organized.", "Priya S.", "Rajasthan Explorer"],
  ["The package details made it easy to compare options and choose the right Kerala getaway.", "Arjun K.", "Kerala Getaway"],
  ["We discovered places we would never have found on our own. A very useful travel guide.", "Meera R.", "Himachal Journey"]
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow"><i className="bi bi-compass"></i> Your Journey, Our Guidance</span>
          <h1>Explore India.<br /><span>Travel Your Way.</span></h1>
          <p>Discover beautiful destinations, explore travel packages, and plan memorable journeys across India with Smart Travel Guide.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-lg">Start Exploring <i className="bi bi-arrow-right"></i></Link>
            <a href="#destinations" className="btn btn-outline-primary btn-lg">Discover Destinations</a>
          </div>
          <div className="hero-trust">
            <span><i className="bi bi-check-circle-fill"></i> Curated destinations</span>
            <span><i className="bi bi-check-circle-fill"></i> Flexible packages</span>
            <span><i className="bi bi-check-circle-fill"></i> Easy planning</span>
          </div>
        </div>
        <div className="home-hero-visual">
          <img src="/assets/clean-hero.jpg" alt="Traveler exploring India" />
          <div className="hero-location-card"><i className="bi bi-geo-alt-fill"></i><div><strong>Incredible India</strong><small>Adventure starts here</small></div></div>
        </div>
      </section>

      <section className="home-highlights">
        {highlights.map(([icon, title, text]) => (
          <div className="home-highlight" key={title}>
            <span><i className={`bi ${icon}`}></i></span>
            <div><strong>{title}</strong><p>{text}</p></div>
          </div>
        ))}
      </section>

      <section className="content-section home-section" id="destinations">
        <div className="section-heading">
          <div><span className="section-kicker">PLACES TO GO</span><h2>Popular Destinations</h2><p>Find your next unforgettable Indian getaway.</p></div>
          <Link to="/login">Explore All <i className="bi bi-arrow-right"></i></Link>
        </div>
        <div className="destination-grid home-destination-grid">
          {destinations.slice(0, 6).map(x => <DestinationCard item={x} key={x.id} />)}
        </div>
      </section>

      <section className="home-package-section" id="packages">
        <div className="content-section">
          <div className="section-heading">
            <div><span className="section-kicker">TRAVEL MADE SIMPLE</span><h2>Featured Travel Packages</h2><p>Choose a package that fits your destination, duration and budget.</p></div>
            <Link to="/login">View Packages <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="package-grid">{packages.map(x => <PackageCard item={x} key={x.id} requireLogin />)}</div>
        </div>
      </section>

      <section className="home-how" id="how-it-works">
        <div className="content-section">
          <div className="center-heading"><span className="section-kicker">HOW IT WORKS</span><h2>Plan Your Journey in Three Steps</h2><p>Everything you need to turn a travel idea into a real adventure.</p></div>
          <div className="steps-grid">
            <div><span>01</span><i className="bi bi-search"></i><h3>Discover</h3><p>Browse destinations and find places that match your travel plans.</p></div>
            <div><span>02</span><i className="bi bi-journal-check"></i><h3>Choose</h3><p>Compare travel packages and select an option that suits you.</p></div>
            <div><span>03</span><i className="bi bi-airplane"></i><h3>Experience</h3><p>Get ready for your journey and make memories along the way.</p></div>
          </div>
        </div>
      </section>

      <section className="home-stories" id="reviews">
        <div className="content-section">
          <div className="center-heading"><span className="section-kicker">TRAVELER STORIES</span><h2>Loved by Travelers</h2><p>See what fellow explorers say about their planning experience.</p></div>
          <div className="stories-grid">
            {stories.map(([quote, name, trip]) => <article className="story-card" key={name}><div className="story-stars">★★★★★</div><p>“{quote}”</p><strong>{name}</strong><small>{trip}</small></article>)}
          </div>
        </div>
      </section>

      <section className="home-about" id="about">
        <div className="about-copy"><span className="section-kicker">ABOUT SMART TRAVEL GUIDE</span><h2>Less time planning. More time exploring.</h2><p>Smart Travel Guide brings destinations, travel packages and practical guidance together in one simple place. Whether you are planning a weekend escape or a longer holiday, we help you begin your journey with confidence.</p><Link to="/signup" className="btn btn-primary">Plan Your Trip <i className="bi bi-arrow-right"></i></Link></div>
        <div className="about-stats"><div><strong>50+</strong><span>Destinations</span></div><div><strong>20+</strong><span>Travel Packages</span></div><div><strong>4.7/5</strong><span>Traveler Rating</span></div><div><strong>24/7</strong><span>Travel Guidance</span></div></div>
      </section>

      <section className="home-cta">
        <div><span className="eyebrow"><i className="bi bi-compass"></i> Your next adventure is waiting</span><h2>Where will India take you?</h2><p>Start discovering destinations and plan a journey made for you.</p></div>
        <Link to="/signup" className="btn btn-light btn-lg">Create Your Account <i className="bi bi-arrow-right"></i></Link>
      </section>

      <footer className="site-footer"><strong>Smart Travel Guide</strong><span>Plan Smart, Travel Better</span><small>© 2026 Smart Travel Guide. All rights reserved.</small></footer>
    </main>
  );
}
