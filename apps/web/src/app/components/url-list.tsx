"use client";

import { useState, useEffect } from "react";
import {
  ClipboardDocumentIcon,
  TrashIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { UrlStatsModal } from "./url-stats-modal";

interface UrlEntry {
  originalUrl: string;
  shortCode: string;
  visits: number;
  createdAt: string;
  lastVisited?: string;
}

export function UrlList() {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showStats, setShowStats] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Initial fetch
    fetchUrls();

    // Only set up polling if there's no active search
    let interval: NodeJS.Timeout;
    if (searchQuery.length < 3) {
      interval = setInterval(fetchUrls, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [searchQuery]); // Add searchQuery as dependency to control polling

  const fetchUrls = async () => {
    // Skip polling if we're currently searching
    if (searchQuery.length >= 3) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/list`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data = await response.json();
      // Sort URLs by creation date in descending order (newest first)
      const sortedData = data.sort(
        (a: UrlEntry, b: UrlEntry) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUrls(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);

    try {
      if (query.length < 3) {
        // If search query is cleared, fetch the full list
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/list`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch URLs");
        }
        const data = await response.json();
        const sortedData = data.sort(
          (a: UrlEntry, b: UrlEntry) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUrls(sortedData);
      } else {
        // Perform search
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to search URLs");
        }
        const data = await response.json();
        setUrls(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (shortCode: string) => {
    const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedUrl(shortCode);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      setError("Failed to copy URL");
    }
  };

  const handleDelete = async (shortCode: string) => {
    setShowDeleteConfirm(shortCode);
  };

  const confirmDelete = async (shortCode: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }
      setShowDeleteConfirm(null);
      fetchUrls();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete URL");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const calculateCTR = (visits: number, totalVisits: number) => {
    if (totalVisits === 0) return "0%";
    return `${((visits / totalVisits) * 100).toFixed(1)}%`;
  };

  const totalVisits = urls.reduce((sum, url) => sum + url.visits, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search URLs
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="Enter at least 3 characters to search"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4 animate-pulse">Loading...</div>
      ) : urls.length === 0 ? (
        <div className="text-center py-4 text-gray-500 animate-fade-in">
          {searchQuery.length >= 3 ? "No URLs found" : "No URLs created yet"}
        </div>
      ) : (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map((url) => {
                const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${url.shortCode}`;
                return (
                  <tr
                    key={url.shortCode}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                      >
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        >
                          {shortUrl}
                        </a>
                        <button
                          onClick={() => handleCopy(url.shortCode)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="Copy URL to clipboard"
                        >
                          {copiedUrl === url.shortCode ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {url.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateCTR(url.visits, totalVisits)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {url.lastVisited ? formatDate(url.lastVisited) : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowStats(url.shortCode)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="View detailed statistics"
                        >
                          <ChartBarIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(url.shortCode)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete URL"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showStats && (
        <UrlStatsModal
          shortCode={showStats}
          onClose={() => setShowStats(null)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this URL? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
