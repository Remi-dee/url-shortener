import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UrlForm } from "../url-form";

// Mock fetch
global.fetch = jest.fn();

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";

describe("UrlForm", () => {
  const mockOnUrlCreated = jest.fn();

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    mockOnUrlCreated.mockClear();
  });

  it("renders input field and submit button", () => {
    render(<UrlForm onUrlCreated={mockOnUrlCreated} />);
    expect(screen.getByLabelText("Enter your URL")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://example.com")
    ).toBeInTheDocument();
    expect(screen.getByText("Shorten URL")).toBeInTheDocument();
  });

  it("successfully shortens a valid URL", async () => {
    const mockResponse = {
      shortCode: "abc123",
      shortUrl: "http://localhost:3000/abc123",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<UrlForm onUrlCreated={mockOnUrlCreated} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByText("Shorten URL");

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/encode`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: "https://example.com" }),
        })
      );
    });

    expect(await screen.findByText("Your shortened URL:")).toBeInTheDocument();
    expect(
      screen.getByText("http://localhost:3000/abc123")
    ).toBeInTheDocument();
    expect(mockOnUrlCreated).toHaveBeenCalled();
  });

  it("displays error for invalid URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid URL" }),
    });

    render(<UrlForm onUrlCreated={mockOnUrlCreated} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByText("Shorten URL");

    fireEvent.change(input, { target: { value: "invalid-url" } });
    fireEvent.click(button);

    expect(await screen.findByText("Invalid URL")).toBeInTheDocument();
    expect(mockOnUrlCreated).not.toHaveBeenCalled();
  });

  it("shows error when API fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    render(<UrlForm onUrlCreated={mockOnUrlCreated} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByText("Shorten URL");

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    expect(await screen.findByText("API Error")).toBeInTheDocument();
    expect(mockOnUrlCreated).not.toHaveBeenCalled();
  });

  it("resets form after successful submission", async () => {
    const mockResponse = {
      shortCode: "abc123",
      shortUrl: "http://localhost:3000/abc123",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<UrlForm onUrlCreated={mockOnUrlCreated} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByText("Shorten URL");

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Your shortened URL:")).toBeInTheDocument();
    });

    expect(input).toHaveValue("");
    expect(mockOnUrlCreated).toHaveBeenCalled();
  });
});
