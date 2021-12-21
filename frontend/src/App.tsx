import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import { error } from "console";
import { Outlet, Link } from "react-router-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  useEffect(() => {
    fetch("/api/v1", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => console.log(response));
  }, []);
  return (
    <div>
      <h1>Pump Tracker</h1>
      <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem" }}>
        <Link to="/workouts">Workouts</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
