import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UrlForm } from "../url-form";

describe("UrlForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders input field and submit button", () => {
    render(<UrlForm onUrlCreated={() => {}} />);
    expect(screen.getByLabelText("Enter your URL")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("https://example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Shorten URL" })
    ).toBeInTheDocument();
  });

  it("shows error for invalid URL", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Invalid URL"));
    render(<UrlForm onUrlCreated={() => {}} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByRole("button", { name: "Shorten URL" });

    fireEvent.change(input, { target: { value: "invalid-url" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    });
  });

  it("successfully shortens a valid URL", async () => {
    const mockResponse = { shortUrl: "http://localhost:3000/abc123" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const onUrlCreated = jest.fn();
    render(<UrlForm onUrlCreated={onUrlCreated} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByRole("button", { name: "Shorten URL" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/encode",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://example.com" }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Your shortened URL:")).toBeInTheDocument();
      expect(
        screen.getByText("http://localhost:3000/abc123")
      ).toBeInTheDocument();
      expect(onUrlCreated).toHaveBeenCalled();
    });
  });

  it("shows error when API fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    render(<UrlForm onUrlCreated={() => {}} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByRole("button", { name: "Shorten URL" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    const mockResponse = { shortUrl: "http://localhost:3000/abc123" };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(<UrlForm onUrlCreated={() => {}} />);

    const input = screen.getByPlaceholderText("https://example.com");
    const button = screen.getByRole("button", { name: "Shorten URL" });

    fireEvent.change(input, { target: { value: "https://example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue("");
      expect(
        screen.getByText("http://localhost:3000/abc123")
      ).toBeInTheDocument();
    });
  });
});
