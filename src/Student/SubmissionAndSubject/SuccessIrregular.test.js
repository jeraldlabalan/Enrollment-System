import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuccessIrregular from "./SuccessIrregular";

// Mock the Header component to isolate testing of SuccessIrregular
jest.mock("../Header/Header", () => () => <div>Mock Header</div>);

describe("SuccessIrregular Component", () => {
  it("renders the header section", () => {
    render(<SuccessIrregular />);
    expect(screen.getByText("Mock Header")).toBeInTheDocument();
  });

  it("renders the main title", () => {
    render(<SuccessIrregular />);
    const title = screen.getByText("Submissions and Subjects");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("title");
  });

  it("displays the success message", () => {
    render(<SuccessIrregular />);
    const status = screen.getByText("CREDENTIALS SUBMITTED");
    const description = screen.getByText(
      "You may check back for a copy of your pre-enrollment form or errors in file submissions."
    );
    expect(status).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("renders buttons with correct labels", () => {
    render(<SuccessIrregular />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Status and Scheduling");
    expect(buttons[1]).toHaveTextContent("Go Back");
  });

  it("renders the animated checkmark", () => {
    render(<SuccessIrregular />);
    const checkmark = screen.getByTestId("checkmark");
    expect(checkmark).toBeInTheDocument();
  });
});
