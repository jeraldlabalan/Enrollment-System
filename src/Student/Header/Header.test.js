import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // For routing context
import "@testing-library/jest-dom";
import Header from "./Header"; // Adjust the path as needed

describe("Header Component", () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test("renders the logos with correct alt text and src", () => {
    renderWithRouter(<Header />);
    
    const bscsLogo = screen.getByAltText("BSCS Logo");
    const bsitLogo = screen.getByAltText("BSIT Logo");

    expect(bscsLogo).toBeInTheDocument();
    expect(bscsLogo).toHaveAttribute("src", "./images/CSlogo.png");
    expect(bsitLogo).toBeInTheDocument();
    expect(bsitLogo).toHaveAttribute("src", "./images/ITlogo.png");
  });

});
