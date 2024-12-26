import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EnrollmentStatus from "./EnrollmentStatus"; // Adjust the import path as needed

describe("EnrollmentStatus Component", () => {
  test("renders the component title", () => {
    render(<EnrollmentStatus />);
    const title = screen.getByText("Enrollment Status");
    expect(title).toBeInTheDocument();
  });

  test("renders the search input and updates its value", () => {
    render(<EnrollmentStatus />);
    const searchInput = screen.getByPlaceholderText("Search");

    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "Keith" } });
    expect(searchInput).toHaveValue("Keith");
  });

  test("renders the table with data", () => {
    render(<EnrollmentStatus />);
    const rows = screen.getAllByRole("row");
    // +1 for the header row
    expect(rows).toHaveLength(4);

    const student = screen.getByText("Keith");
    expect(student).toBeInTheDocument();
  });


  test("renders and updates the status dropdown", () => {
    render(<EnrollmentStatus />);
    const statusDropdown = screen.getAllByRole("combobox")[0]; // Assuming the first combobox is the status
    expect(statusDropdown).toHaveValue("Step 1 Done");

    fireEvent.change(statusDropdown, { target: { value: "Step 2 Pending" } });
    expect(statusDropdown).toHaveValue("Step 2 Pending");
  });

  




  test("renders 'Mark as Enrolled' buttons", () => {
    render(<EnrollmentStatus />);
    const buttons = screen.getAllByRole("button", { name: "Mark as Enrolled" });
    expect(buttons).toHaveLength(3); // Matches the number of rows with data
  });
});
