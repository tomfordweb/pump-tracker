import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

test("Link matches snapshot", () => {
  const component = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Workouts/);
  expect(linkElement).toBeInTheDocument();
});
