import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import PodsList from "../PodsList";
import fetchMock from "jest-fetch-mock";

// Mock fetch globally
global.fetch = fetchMock;

describe("PodsList Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    // Mock initial pods fetch
    fetchMock.mockResponseOnce(
      JSON.stringify({
        pods: [
          { id: 1, title: "Test Pod 1" },
          { id: 2, title: "Test Pod 2" },
        ],
        total: 2,
      })
    );

    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it("renders loading state initially", async () => {
    render(<PodsList />);

    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });
  });

  it("Pods", async () => {
    render(<PodsList />);

    // Check if we've transitioned from loading state
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });

    // Check if pods are displayed
    expect(await screen.findByText("Test Pod 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Pod 2")).toBeInTheDocument();
  });

  it("adds a new pod", async () => {
    const user = userEvent.setup();

    // Mock responses for adding a pod and refetching
    fetchMock.mockResponses(
      // Initial pods fetch (set in beforeEach)
      [
        JSON.stringify({
          id: 3,
          title: "New Pod",
        }),
        { status: 201 },
      ],
      // Count fetch after adding
      [
        JSON.stringify({
          pods: [{ id: 3, title: "New Pod" }],
          total: 3,
        }),
      ],
      // Refetch pods after adding
      [
        JSON.stringify({
          pods: [
            { id: 3, title: "New Pod" },
            { id: 2, title: "Test Pod 2" },
            { id: 1, title: "Test Pod 1" },
          ],
          total: 3,
        }),
      ]
    );

    render(<PodsList />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });

    // Fill in the textarea and click Add Pod
    const textarea = screen.getByPlaceholderText("New pod");
    await user.type(textarea, "New Pod");

    const addButton = screen.getByText("Add Pod");
    await user.click(addButton);

    // Verify the API was called with correct data
    await waitFor(() => {
      const fetchCalls = fetchMock.mock.calls;
      const postCall = fetchCalls.find(
        (call) => call[1]?.method === "POST" && call[0] === "/api/pods"
      );
      expect(postCall[1]?.body).toBe(JSON.stringify({ title: "New Pod" }));
    });
  });

  it("deletes a pod", async () => {
    const user = userEvent.setup();

    // Mock responses for deleting a pod
    fetchMock.mockResponses(
      // Initial pods fetch (set in beforeEach)
      [
        JSON.stringify({
          message: "Deleted",
        }),
        { status: 200 },
      ],
      // Count fetch after deleting
      [
        JSON.stringify({
          pods: [{ id: 2, title: "Test Pod 2" }],
          total: 1,
        }),
      ]
    );

    render(<PodsList />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });

    // Find and click the delete button of the first pod
    const deleteButtons = screen.getAllByLabelText("Delete pod");
    await user.click(deleteButtons[0]);

    // Verify the API was called for deletion
    await waitFor(() => {
      const fetchCalls = fetchMock.mock.calls;
      const deleteCall = fetchCalls.find(
        (call) => call[1]?.method === "DELETE" && call[0] === "/api/pods"
      );
      expect(deleteCall[1]?.method).toBe("DELETE");
    });
  });

  it("changes page size", async () => {
    const user = userEvent.setup();

    // Mock responses for changing page size
    fetchMock.mockResponses(
      // Initial pods fetch (set in beforeEach)
      [
        JSON.stringify({
          pods: [
            { id: 1, title: "Test Pod 1" },
            { id: 2, title: "Test Pod 2" },
            { id: 3, title: "Test Pod 3" },
            { id: 4, title: "Test Pod 4" },
            { id: 5, title: "Test Pod 5" },
            { id: 6, title: "Test Pod 6" },
            { id: 7, title: "Test Pod 7" },
            { id: 8, title: "Test Pod 8" },
            { id: 9, title: "Test Pod 9" },
            { id: 10, title: "Test Pod 10" },
          ],
          total: 10,
        }),
      ]
    );

    render(<PodsList />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });

    // Change page size to 10
    const pageSizeSelects = screen.getByTestId("page-size-select");

    await user.selectOptions(pageSizeSelects, "10");

    // Verify the correct API call was made
    await waitFor(() => {
      const fetchCalls = fetchMock.mock.calls;

      // Check the URL of the first call
      expect(fetchCalls[0][0]).toEqual(expect.stringContaining("pageSize=5"));

      // Check the URL of the second call
      expect(fetchCalls[1][0]).toEqual(expect.stringContaining("pageSize=10"));
    });
  });

  it("changes sort order", async () => {
    const user = userEvent.setup();

    // Mock responses for changing sort order
    fetchMock.mockResponses(
      // Initial pods fetch (set in beforeEach)
      [
        JSON.stringify({
          pods: [
            { id: 1, title: "Test Pod 1" },
            { id: 2, title: "Test Pod 2" },
          ],
          total: 2,
        }),
      ]
    );

    render(<PodsList />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText(/loading settings/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/loading pods/i)).not.toBeInTheDocument();
    });

    // Change sort order to ascending
    const sortSelect = screen.getByLabelText(/Sort By:/i);
    await user.selectOptions(sortSelect, "asc");

    // Verify the correct API call was made
    await waitFor(() => {
      const fetchCalls = fetchMock.mock.calls;

      // Check the URL of the first call
      expect(fetchCalls[0][0]).toEqual(expect.stringContaining("sortBy=desc"));

      // Check the URL of the second call
      expect(fetchCalls[1][0]).toEqual(expect.stringContaining("sortBy=asc"));
    });
  });

  it("navigates between pages", async () => {
    const user = userEvent.setup();

    // Clear previous mocks (if needed)
    fetchMock.resetMocks();

    // Page 1: pods 1–5
    fetchMock.mockResponseOnce(
      JSON.stringify({
        pods: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `Test Pod ${i + 1}`,
        })),
        total: 15,
      })
    );

    // Page 2: pods 6–10 (will be triggered on next page click)
    fetchMock.mockResponseOnce(
      JSON.stringify({
        pods: Array.from({ length: 5 }, (_, i) => ({
          id: i + 6,
          title: `Test Pod ${i + 6}`,
        })),
        total: 15,
      })
    );

    render(<PodsList />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("results-count")).toHaveTextContent("1-5 of 15");

    const nextButton = screen.getByTitle("Go to next page");
    await user.click(nextButton);

    await waitFor(() => {
      const fetchCalls = fetchMock.mock.calls;
      expect(fetchCalls[1][0]).toEqual(expect.stringContaining("page=2"));
    });

    expect(screen.getByTestId("results-count")).toHaveTextContent("6-10 of 15");
  });
});
