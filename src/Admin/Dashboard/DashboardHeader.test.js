import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { logout } from "../../utils/session";

jest.mock("../../utils/session", () => ({
  logout: jest.fn(),
}));

describe("DashboardHeader Component", () => {
  const renderComponent = () => {
    render(
      <Router>
        <DashboardHeader />
      </Router>
    );
  };

 

  test("calls logout function when Log Out is clicked", () => {
    renderComponent();

    // Click on the Log Out link
    fireEvent.click(screen.getByText(/Log Out/i));

    // Ensure the logout function was called
    expect(logout).toHaveBeenCalled();
  });

});
