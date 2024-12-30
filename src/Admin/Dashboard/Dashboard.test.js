import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { checkSession, logout } from "../../utils/session";

// Mock the dependencies
jest.mock("../../utils/session", () => ({
  checkSession: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("Dashboard Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders loading state initially", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ state: { userId: "testUserId" } });

    checkSession.mockResolvedValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
});

  it("redirects to login if session is invalid", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ state: { userId: "testUserId" } });

    checkSession.mockResolvedValue(false);

    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders Dashboard if session is valid and userId is present", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ state: { userId: "testUserId" } });

    checkSession.mockResolvedValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });

    const dashboardElements = screen.getAllByText(/dashboard/i);
    expect(dashboardElements).toHaveLength(2); // Adjust the length based on expected occurrences
      });

  it("redirects to login if location.state is undefined", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ state: undefined });

    checkSession.mockResolvedValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("calls logout when handleLogout is triggered", async () => {
    const { useLocation } = require("react-router-dom");
    useLocation.mockReturnValue({ state: { userId: "testUserId" } });

    checkSession.mockResolvedValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });

    // Find the logout link using role
// Locate the logout element by its text content
const logoutLink = screen.getByText(/log out/i);
    expect(logout).not.toHaveBeenCalled();

    // Simulate a click on the logout link
    await act(async () => {
      logoutLink.click();
    });

    expect(logout).toHaveBeenCalledWith(mockNavigate);
  });
});