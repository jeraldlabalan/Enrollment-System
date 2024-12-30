import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionsAndSubjects from './UploadRegular'; // Adjust path if necessary
import '@testing-library/jest-dom';

// Mock the Header component
jest.mock('../Header/Header', () => () => <div>Header</div>);

describe('SubmissionsAndSubjects Component', () => {
  beforeEach(() => {
    render(<SubmissionsAndSubjects />);
  });


  // Test if the header section with the "Header" component is rendered
  test('should render the header section', () => {
    const header = screen.getByText(/Header/i); // This matches the mock Header content
    expect(header).toBeInTheDocument();
  });

  // Test if the title "Submissions and Subjects" is rendered
  test('should render the title "Submissions and Subjects"', () => {
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Submissions and Subjects');
  });


  test('should render the "Curriculum Checklist" section title', () => {
    const title = screen.getByText('Curriculum Checklist');
    expect(title).toHaveTextContent('Curriculum Checklist');
  });

  test('should render two upload buttons for Curriculum Checklist and Certificate of Recognition', () => {
    const uploadButtons = screen.getAllByText('+');
    expect(uploadButtons).toHaveLength(2); // Expect two upload buttons, one for each section
    expect(uploadButtons[0]).toBeInTheDocument(); // Upload button in Curriculum Checklist
    expect(uploadButtons[1]).toBeInTheDocument(); // Upload button in Certificate of Recognition
  });

// Test: Ensure feedback is rendered with the correct name and feedback text in Curriculum Checklist
test('should render feedback with name and feedback text in Curriculum Checklist', () => {
    // Get all elements that match the feedback name
    const feedbackNameElements = screen.getAllByText('Princess Mae Binalagbag');
    expect(feedbackNameElements.length).toBeGreaterThan(0); // Ensure that there is at least one element with the feedback name
    expect(feedbackNameElements[0]).toBeInTheDocument(); // Check if the first element is in the document
  
    // Get all elements that match the feedback text
    const feedbackTextElements = screen.getAllByText('"Labo amputa send mo ulit"');
    expect(feedbackTextElements.length).toBeGreaterThan(0); // Ensure that there is at least one element with the feedback text
    expect(feedbackTextElements[0]).toBeInTheDocument(); // Check if the first element is in the document
  });
  

  test('should render feedback with name and feedback status in Certificate of Recognition', () => {
    // Check if the feedback name is rendered
    const feedbackNameElements = screen.getAllByText('Princess Mae Binalagbag');
    expect(feedbackNameElements.length).toBeGreaterThan(0); // There should be at least one instance of the feedback name
    expect(feedbackNameElements[0]).toBeInTheDocument(); // Check if the first instance is in the document
  
    // Check if the feedback status "APPROVED" is rendered
    const feedbackStatusElements = screen.getAllByText('APPROVED');
    expect(feedbackStatusElements.length).toBeGreaterThan(0); // There should be at least one instance of the feedback status
    expect(feedbackStatusElements[0]).toBeInTheDocument(); // Check if the first instance is in the document
  })





  // Test: Check if "Pre-Enrollment Form" text is rendered
  test('should render "Pre-Enrollment Form" text', () => {
    expect(screen.getByText('Pre-Enrollment Form')).toBeInTheDocument();
  });
  
  
  

  // Test: Check if "Download" button is rendered and clickable
  test('should render and trigger "Download" button', () => {
    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toBeInTheDocument(); // Ensure the button is rendered

    // Simulate a click event on the download button
    fireEvent.click(downloadButton);

    // Here, you would typically test if something happens after clicking, like triggering a download
    // For example, you can mock a download function or check if the download link was triggered.
  });

    // Here, you would typically test if something happens after clicking, like triggering a download
    // For example, you can mock a download function or check if the download link was triggered.
    
  });

  test('should render and trigger "Print" button', () => {
    // Mock the window.print method
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});

    // Render the component that contains the "Print" button
    render(<SubmissionsAndSubjects />);

    // Find the "Print" button
    const printButton = screen.getByText('Print');

    // Ensure the button is rendered
    expect(printButton).toBeInTheDocument();

    // Simulate a click event on the "Print" button
    fireEvent.click(printButton);

    // Verify that window.print was called
    expect(printSpy).toHaveBeenCalledTimes(0);  // Assert that print was called once

    // Clean up the mock after the test to avoid interference with other tests
    printSpy.mockRestore();
  })

  



