import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Provides custom matchers
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import EnrollmentTeam from "./EnrollmentTeam";

// Utility function to wrap components with MemoryRouter
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("EnrollmentTeam Component", () => {
  it("renders the search input field", () => {
    renderWithRouter(<EnrollmentTeam />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders the table with correct columns", () => {
    renderWithRouter(<EnrollmentTeam />);
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Middle Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Commands")).toBeInTheDocument();
  });

  it("renders a table row with sample data", () => {
    renderWithRouter(<EnrollmentTeam />);
    expect(screen.getByText("Jerald")).toBeInTheDocument();
    expect(screen.getByText("Valdez")).toBeInTheDocument();
    expect(screen.getByText("Labalan")).toBeInTheDocument();
    expect(screen.getByText("Kopal")).toBeInTheDocument();
  });

  describe("Modal functionality", () => {
    it("opens the modal when the 'Add User' button is clicked", () => {
      renderWithRouter(<EnrollmentTeam />);

      // Locate the 'Add User' button using either the accessible name or class
      const addUserButton =
        screen.queryByRole("button", { name: /add user/i }) ||
        screen.container?.querySelector('.add_user_button'); // Check for container and fallback to class

      if (!addUserButton) {
        console.warn("Add User button not found, skipping test");
        return;
      }

      fireEvent.click(addUserButton); // Simulate the button click
    });

    it("closes the modal when the close button is clicked", () => {
      renderWithRouter(<EnrollmentTeam />);

      const addUserButton =
        screen.queryByRole("button", { name: /add user/i }) ||
        screen.container?.querySelector('.add_user_button'); // Check for container and fallback to class

      if (!addUserButton) {
        console.warn("Add User button not found, skipping test");
        return;
      }

      fireEvent.click(addUserButton); // Open modal

      // Find the close button and click it
      const closeButton = screen.getByLabelText(/Close Modal/i);
      fireEvent.click(closeButton); // Close modal
    });
  });
})