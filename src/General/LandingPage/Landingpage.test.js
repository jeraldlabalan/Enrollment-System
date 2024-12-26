import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // To support <Link>
import LandingPage from "./Landingpage";

jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  format: jest.fn(() => "Mocked Date"),
}));

describe("LandingPage Component", () => {
  const latestAnnouncement = {
    author: "John Doe",
    content: "Important Announcement",
    date: "2023-12-01T10:00:00Z",
  };

  const renderComponent = (announcement = null) => {
    render(
      <BrowserRouter>
        <LandingPage latestAnnouncement={announcement} />
      </BrowserRouter>
    );
  };

  test("renders the main structure and text correctly", () => {
    renderComponent();
    expect(screen.getByText(/Truth. Excellence. Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Department of Computer Studies Enrollment System/i)).toBeInTheDocument();
  });

  test("renders login and register buttons", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  test("displays a message when no announcements are available", () => {
    renderComponent();
    expect(screen.getByText(/No recent announcements available./i)).toBeInTheDocument();
  });


  test("includes a link to view all announcements", () => {
    renderComponent();
    const viewAllLink = screen.getByRole("link", { name: /View All/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/announcements");
  });
});
