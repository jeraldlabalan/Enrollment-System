import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import HeaderCS from "./HeaderCS"; // Adjust the path based on your project structure

describe("HeaderCS Component", () => {
  const renderComponent = () => {
    render(
      <Router>
        <HeaderCS />
      </Router>
    );
  };

  test("renders the header with logos", () => {
    renderComponent();

    const csLogo = screen.getByAltText("BSCS Logo");
    const itLogo = screen.getByAltText("BSIT Logo");

    expect(csLogo).toBeInTheDocument();
    expect(itLogo).toBeInTheDocument();

    expect(csLogo).toHaveAttribute("src", "./images/CSlogo.png");
    expect(itLogo).toHaveAttribute("src", "./images/ITlogo.png");
  });

  test("renders navigation links with correct text", () => {
    renderComponent();

    const dashboardLink = screen.getByText("Dashboard");
    const scheduleLink = screen.getByText("Schedule");
    const enrollmentStatusLink = screen.getByText("Enrollment Status");
    const logOutLink = screen.getByText("Log Out");

    expect(dashboardLink).toBeInTheDocument();
    expect(scheduleLink).toBeInTheDocument();
    expect(enrollmentStatusLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });

  test("renders the notification bell icon", () => {
    renderComponent();

    const bellIcon = screen.getByRole("link", { name: "" }).querySelector("i.fa-solid.fa-bell");
    expect(bellIcon).toBeInTheDocument();
  });

});
