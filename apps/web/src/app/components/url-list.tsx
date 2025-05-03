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

  useEffect(() => {
    fetchUrls();
    // Set up polling for real-time updates
    const interval = setInterval(fetchUrls, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/list");
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      fetchUrls();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search URLs");
      }
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedUrl(shortUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      setError("Failed to copy URL");
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/url/${shortCode}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }
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
                const shortUrl = `http://localhost:3000/${url.shortCode}`;
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
                          onClick={() => handleCopy(shortUrl)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="Copy URL to clipboard"
                        >
                          {copiedUrl === shortUrl ? (
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
                      {url.lastVisited ? formatDate(url.lastVisited) : "Never"}
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
                          title="Delete this URL"
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
    </div>
  );
}
