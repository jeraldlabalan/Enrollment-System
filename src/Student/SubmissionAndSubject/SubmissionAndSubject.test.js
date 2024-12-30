import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubmissionAndSubject from "./SubmissionAndSubject";
import { BrowserRouter } from "react-router-dom";

describe("SubmissionAndSubject Component", () => {
  const setup = (initialStep = 1, props = {}) => {
    render(
      <BrowserRouter>
        <SubmissionAndSubject step={initialStep} {...props} />
      </BrowserRouter>
    );
  };

  // Step 1 Tests
  describe("Step 1 Tests", () => {
    it("renders the header and student categorization details", () => {
      setup(1);
      expect(screen.getByText("Student Categorization")).toBeInTheDocument();
      expect(screen.getByText("S1 - Regular students")).toBeInTheDocument();
    });

    it("renders the 'Next' button and changes step when clicked", () => {
        setup(1); // No need for handleNextMock here since we're testing internal state
      
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);
      
        // Test if step has changed. If you expect the page to change based on step, you can check for that
        const nextStepHeader = screen.getByText("Select subjects"); // Assuming the header changes on step 2
        expect(nextStepHeader).toBeInTheDocument();
      });

      it("renders the main title", () => {
        setup();
        expect(screen.getByText("Subjects and Submission")).toBeInTheDocument();
      });
    
      it("renders student categorization details", () => {
        setup();
        expect(screen.getByText("S1 - Regular students")).toBeInTheDocument();
        expect(screen.getByText("S2 - Incoming First Year Student")).toBeInTheDocument();
        expect(screen.getByText("S3 - Irregulars")).toBeInTheDocument();
        expect(screen.getByText("S4 - Shiftee")).toBeInTheDocument();
        expect(screen.getByText("S5 - Returnee")).toBeInTheDocument();
        expect(screen.getByText("S6 - Transferee")).toBeInTheDocument();
      });
    
      it("renders the radio buttons for student types", () => {
        setup();
        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(6);
        radios.forEach((radio, index) => {
          expect(radio).toHaveAttribute("value", `S${index + 1}`);
        });
      });


      //step 2 
    
      





    });
});
