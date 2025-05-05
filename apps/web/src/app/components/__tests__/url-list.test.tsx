import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { UrlList } from "../url-list";
import "@testing-library/jest-dom";

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";

// Mock fetch globally
global.fetch = jest.fn();

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("UrlList", () => {
  const mockUrls = [
    {
      originalUrl: "https://example.com",
      shortCode: "abc123",
      visits: 0,
      createdAt: "2025-05-05T13:39:24.637Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    // Mock successful fetch for initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    expect(screen.getByText("Search URLs")).toBeInTheDocument();
  });

  it("displays loading state", async () => {
    // Mock a delayed response to ensure loading state is visible
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<UrlList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays URLs after loading", async () => {
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
    });
  });

  it("handles search input", async () => {
    // Mock initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    const searchInput = screen.getByLabelText("Search URLs");

    // Mock search response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "example" } });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=example`
      );
    });
  });

  it("handles copy to clipboard", async () => {
    // Mock successful fetch for initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    const mockClipboard = {
      writeText: jest.fn().mockResolvedValueOnce(undefined),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    await act(async () => {
      render(<UrlList />);
    });

    const copyButton = await screen.findByTitle("Copy URL to clipboard");

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/abc123`
    );
  });

  it("deletes URL after confirmation", async () => {
    // Mock successful fetch for initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    // Wait for the initial load
    await screen.findByText("https://example.com");

    // Mock successful delete response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    // Mock successful reload response after delete
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    // Click delete button
    const deleteButton = screen.getByTitle("Delete URL");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Confirm deletion
    const confirmButton = screen.getByText("Delete");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/abc123`,
        { method: "DELETE" }
      );
    });
  });

  it("shows error message on failed fetch", async () => {
    // Mock failed fetch
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch URLs")
    );

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch URLs")).toBeInTheDocument();
    });
  });

  it("shows error message on failed delete", async () => {
    // Mock successful fetch for initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    // Wait for the initial load
    await screen.findByText("https://example.com");

    // Mock failed delete response
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to delete URL")
    );

    // Click delete button
    const deleteButton = screen.getByTitle("Delete URL");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Confirm deletion
    const confirmButton = screen.getByText("Delete");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to delete URL")).toBeInTheDocument();
    });
  });

  it("shows no URLs message when list is empty", async () => {
    // Mock empty response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("No URLs created yet")).toBeInTheDocument();
    });
  });

  it("shows no URLs found message when search returns empty", async () => {
    // Mock successful fetch for initial load
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls,
    });

    await act(async () => {
      render(<UrlList />);
    });

    // Wait for initial load
    await screen.findByText("https://example.com");

    const searchInput = screen.getByLabelText("Search URLs");

    // Mock empty search response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    });

    await waitFor(() => {
      expect(screen.getByText("No URLs found")).toBeInTheDocument();
    });
  });
});
