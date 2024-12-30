import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // For routing support
import Header from "./Header"; // Update the path as needed

// Mock styles for CSS modules
jest.mock("./Header.module.css", () => ({
  header: "header",
  logos: "logos",
  logo_shield: "logo_shield",
  logo_its: "logo_its",
  nav: "nav",
  navLink: "navLink",
}));

describe("Header Component", () => {
  it("renders the logos with correct alt text", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify the presence of logos with correct alt text
    const csLogo = screen.getByAltText("BSCS Logo");
    expect(csLogo).toBeInTheDocument();
    expect(csLogo).toHaveAttribute("src", "./images/CSlogo.png");

    const itLogo = screen.getByAltText("BSIT Logo");
    expect(itLogo).toBeInTheDocument();
    expect(itLogo).toHaveAttribute("src", "./images/ITlogo.png");
  });

  it("renders all navigation link texts correctly", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  
    // Get all elements with the text "Home" and check one
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks).toHaveLength(1); // Expect only one "Home" text
    expect(homeLinks[0]).toBeInTheDocument();
  
    // Repeat for other navigation links
    expect(screen.getAllByText("Profile")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Submission and Subject")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Status and Scheduling")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Log Out")[0]).toBeInTheDocument();
  });
  

  it("renders the bell icon correctly", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify the bell icon presence
    const bellIcon = screen.getByRole("link", { name: "" });
    expect(bellIcon).toBeInTheDocument();
    expect(bellIcon).toContainHTML('<i class="fa-solid fa-bell"></i>');
  });
});
