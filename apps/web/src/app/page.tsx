"use client";

import { useState } from "react";
import { UrlForm } from "./components/url-form";
import { UrlList } from "./components/url-list";

export default function Home() {
  const [refreshList, setRefreshList] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            URL Shortener
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create short, memorable URLs for your long links
          </p>
        </div>

        <div className="mt-10">
          <UrlForm onUrlCreated={() => setRefreshList((prev) => prev + 1)} />
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in">
            Your URLs
          </h2>
          <UrlList key={refreshList} />
        </div>
      </div>
    </main>
  );
}
