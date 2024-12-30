import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import { checkSession, logout } from "../../utils/session";

// Mock the session utilities
jest.mock("../../utils/session", () => ({
  checkSession: jest.fn(),
  logout: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Home Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loading screen initially", () => {
    render(
      <MemoryRouter initialEntries={[{ state: { userId: "123" } }]}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });


  it("displays error message if user data cannot be fetched", async () => {
    checkSession.mockResolvedValue(true);
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: "Failed to fetch user data." }),
    });

    render(
      <MemoryRouter initialEntries={[{ state: { userId: "123" } }]}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Error loading user data. Please try again.")
      ).toBeInTheDocument();
    });
  });


  it("calls logout function when logout button is clicked", async () => {
    const mockUserData = {
      first_name: "John",
      last_name: "Doe",
      middle_name: "M",
    };

    checkSession.mockResolvedValue(true);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserData),
    });

    render(
      <MemoryRouter initialEntries={[{ state: { userId: "123" } }]}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const logoutButton = screen.getByText("Logout");
      logoutButton.click();
    });

    expect(logout).toHaveBeenCalled();
  });
});
