import React from "react";
import { render, screen } from "@testing-library/react";
import HeaderNavbar from "./HeaderNavbar"; // Adjust the import path as needed
import "@testing-library/jest-dom"; // For better matchers like toBeInTheDocument

describe("HeaderNavbar Component", () => {
  test("renders the logos", () => {
    render(<HeaderNavbar />);
    const logo1 = screen.getByAltText("Logo1");
    const logo2 = screen.getByAltText("Logo2");

    expect(logo1).toBeInTheDocument();
    expect(logo1).toHaveAttribute("src", "src/assets/images/bscs.png");
    expect(logo2).toBeInTheDocument();
    expect(logo2).toHaveAttribute("src", "src/assets/images/itlogo.png");
  });

  test("renders all navigation buttons", () => {
    render(<HeaderNavbar />);
    const dashboardButton = screen.getByText("Dashboard");
    const schedulesButton = screen.getByText("Schedules");
    const enrollmentButton = screen.getByText("Enrollment");
    const logoutButton = screen.getByText("Log Out");

    expect(dashboardButton).toBeInTheDocument();
    expect(schedulesButton).toBeInTheDocument();
    expect(enrollmentButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test("applies the correct styles to the AppBar", () => {
    render(<HeaderNavbar />);
    const appBar = screen.getByRole("banner");

    expect(appBar).toHaveStyle("background-color: #333");
  });

  test("renders with a fixed position", () => {
    render(<HeaderNavbar />);
    const appBar = screen.getByRole("banner");

    expect(appBar).toHaveStyle("position: fixed");
  });
});
