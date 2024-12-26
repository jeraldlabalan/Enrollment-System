import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

  test("renders the logo images", () => {
    renderComponent();
    const csLogo = screen.getByAltText(/BSCS Logo/i);
    const itLogo = screen.getByAltText(/BSIT Logo/i);

    expect(csLogo).toBeInTheDocument();
    expect(itLogo).toBeInTheDocument();
    expect(csLogo).toHaveAttribute("src", "./images/CSlogo.png");
    expect(itLogo).toHaveAttribute("src", "./images/ITlogo.png");
  });

  test("renders all navigation links with correct text", () => {
    renderComponent();
    const dashboardLink = screen.getByText(/Dashboard/i);
    const submissionsLink = screen.getByText(/Submissions/i);
    const adviseeLink = screen.getByText(/Advisee/i);
    const logOutLink = screen.getByText(/Log Out/i);

    expect(dashboardLink).toBeInTheDocument();
    expect(submissionsLink).toBeInTheDocument();
    expect(adviseeLink).toBeInTheDocument();
    expect(logOutLink).toBeInTheDocument();
  });


  test("renders all nav links without errors", () => {
    renderComponent();
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBe(7); // Ensure all 5 links are rendered
  });
});
