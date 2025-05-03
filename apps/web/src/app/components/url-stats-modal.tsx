"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface UrlStatsModalProps {
  shortCode: string;
  onClose: () => void;
}

interface UrlStats {
  visits: number;
  createdAt: string;
  lastVisited?: string;
  visitsByDay: { date: string; count: number }[];
  visitsByCountry: { country: string; count: number }[];
  visitsByDevice: { device: string; count: number }[];
}

export function UrlStatsModal({ shortCode, onClose }: UrlStatsModalProps) {
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/statistic/${shortCode}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [shortCode]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 animate-slide-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            URL Statistics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            title="Close statistics"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 animate-pulse">
            Loading statistics...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Visits</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.visits}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(stats.createdAt)}
                </p>
              </div>
            </div>

            {stats.lastVisited && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Last Visit</p>
                <p className="text-lg font-medium text-gray-900">
                  {formatDate(stats.lastVisited)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Visits by Day
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                {/* We can add a chart here using a library like Chart.js or Recharts */}
                <div className="text-center text-gray-500">
                  Chart will be displayed here
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Top Countries
                </h3>
                <div className="space-y-2">
                  {stats.visitsByCountry?.map(({ country, count }) => (
                    <div
                      key={country}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{country}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Device Types
                </h3>
                <div className="space-y-2">
                  {stats.visitsByDevice?.map(({ device, count }) => (
                    <div
                      key={device}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">{device}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
