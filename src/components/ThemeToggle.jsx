import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("stg_theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem("stg_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setDark(v => !v)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <i className={`bi ${dark ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
