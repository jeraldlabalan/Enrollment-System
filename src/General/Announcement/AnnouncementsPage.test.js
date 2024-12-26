import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // For Link
import AnnouncementsPage from "./AnnouncementsPage";

jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  format: jest.fn(() => "Mocked Date"),
}));

describe("AnnouncementsPage Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AnnouncementsPage />
      </BrowserRouter>
    );

  test("displays a message when no announcements are available", async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("No announcements available.")).toBeInTheDocument()
    );
  });

 

  test("handles errors during API call gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("API Error"));

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("No announcements available.")).toBeInTheDocument()
    );
  });
});
