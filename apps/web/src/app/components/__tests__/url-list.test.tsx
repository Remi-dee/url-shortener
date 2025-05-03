import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { UrlList } from "../url-list";

describe("UrlList", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows loading state initially", () => {
    render(<UrlList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays URLs after loading", async () => {
    const mockUrls = [
      {
        id: "1",
        originalUrl: "https://example.com",
        shortCode: "abc123",
        createdAt: new Date().toISOString(),
        visits: 0,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUrls),
    });

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
      expect(
        screen.getByText("http://localhost:3000/abc123")
      ).toBeInTheDocument();
    });
  });

  it("handles search functionality", async () => {
    const mockUrls = [
      {
        id: "1",
        originalUrl: "https://example.com",
        shortCode: "abc123",
        createdAt: new Date().toISOString(),
        visits: 0,
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUrls),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUrls),
      });

    await act(async () => {
      render(<UrlList />);
    });

    const searchInput = screen.getByPlaceholderText(
      "Enter at least 3 characters to search"
    );
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "example" } });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/search?q=example"
      );
    });
  });

  it("shows no results message when search returns empty", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => {
      render(<UrlList />);
    });

    const searchInput = screen.getByPlaceholderText(
      "Enter at least 3 characters to search"
    );
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    });

    await waitFor(() => {
      expect(screen.getByText("No URLs found")).toBeInTheDocument();
    });
  });

  it("copies URL to clipboard", async () => {
    const mockUrls = [
      {
        id: "1",
        originalUrl: "https://example.com",
        shortCode: "abc123",
        createdAt: new Date().toISOString(),
        visits: 0,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUrls),
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
    });

    const copyButton = screen.getByTitle("Copy URL to clipboard");
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://localhost:3000/abc123"
    );
  });

  it("deletes URL after confirmation", async () => {
    const mockUrls = [
      {
        id: "1",
        originalUrl: "https://example.com",
        shortCode: "abc123",
        createdAt: new Date().toISOString(),
        visits: 0,
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUrls),
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    await act(async () => {
      render(<UrlList />);
    });

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle("Delete URL");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Confirm deletion in the modal
    const confirmButton = screen.getByText("Delete");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/abc123",
        { method: "DELETE" }
      );
    });

    await waitFor(() => {
      expect(screen.getByText("No URLs created yet")).toBeInTheDocument();
    });
  });
});
