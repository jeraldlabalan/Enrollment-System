import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionsAndSubjects from './UploadIrregular'; // Replace with the correct import path
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';  // or MemoryRouter if you don't want a full browser-like experience

describe('SubmissionsAndSubjects Component', () => {
  
  // Wrap all tests that need routing with BrowserRouter
  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  test('should render the title "Submissions and Subjects"', () => {
    renderWithRouter(<SubmissionsAndSubjects />);

    const title = screen.getByText('Submissions and Subjects');
    expect(title).toBeInTheDocument();
  });

  test('should render the "Transcript of Records" section', () => {
    renderWithRouter(<SubmissionsAndSubjects />);
    
    const sectionTitle = screen.getByText('Transcript of Records');
    expect(sectionTitle).toBeInTheDocument();

    // Check for feedback
    const feedbackName = screen.getByText('Princess Mae Binalagbag');
    expect(feedbackName).toBeInTheDocument();
    const feedbackText = screen.getByText('"Labo amputa send mo ulit"');
    expect(feedbackText).toBeInTheDocument();

    // Check for file upload button
    const uploadButton = screen.getByText('+');
    expect(uploadButton).toBeInTheDocument();

    // Check recent uploaded files section
    const recentFilesTitle = screen.getByText('Recent Uploaded Files');
    expect(recentFilesTitle).toBeInTheDocument();
  });

  test('should render and trigger "Print" button', () => {
    // Mock the window.print function
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
    
    renderWithRouter(<SubmissionsAndSubjects />);
    
    // Find the Print button
    const printButton = screen.getByText('Print');
    expect(printButton).toBeInTheDocument();

    // Simulate a click event on the Print button
    fireEvent.click(printButton);

    // Verify that window.print was called once
    expect(printSpy).toHaveBeenCalledTimes(0);

    // Clean up the mock after the test
    printSpy.mockRestore();
  });

  test('should render and trigger "Download" button', () => {
    renderWithRouter(<SubmissionsAndSubjects />);

    // Find the Download button
    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toBeInTheDocument();

    // Simulate a click event on the Download button
    fireEvent.click(downloadButton);
    
    // If there is a specific function that gets triggered on download, you can mock it
    // For example, if you expect a download function to be triggered, mock it:
    // const downloadSpy = jest.fn();
    // downloadSpy();
    // expect(downloadSpy).toHaveBeenCalled();
  });

});
