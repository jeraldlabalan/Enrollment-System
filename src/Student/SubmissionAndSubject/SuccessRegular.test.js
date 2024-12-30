import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuccessRegular from "./SuccessRegular";

jest.mock("../Header/Header", () => () => <div>Mock Header</div>); // Updated mock

describe("SuccessRegular Component", () => {
  it("renders the header section", () => {
    render(<SuccessRegular />);
    expect(screen.getByText("Mock Header")).toBeInTheDocument();
  });

  it("renders the main title", () => {
    render(<SuccessRegular />);
    const title = screen.getByText("Submissions and Subjects");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("title");
  });

  it("displays the success message", () => {
    render(<SuccessRegular />);
    const status = screen.getByText("CREDENTIALS SUBMITTED");
    const description = screen.getByText(
      "You may check back for a copy of your pre-enrollment form or errors in file submissions."
    );
    expect(status).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it("renders buttons with correct labels", () => {
    render(<SuccessRegular />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("Open Pre-Enrollment Form");
    expect(buttons[1]).toHaveTextContent("Go Back");
  });
  it("renders the animated checkmark", () => {
    render(<SuccessRegular />);
    const checkmark = screen.getByTestId("checkmark");
    expect(checkmark).toBeInTheDocument();
  });
});
