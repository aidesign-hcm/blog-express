"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "react-feather";

export default function SearchNormal() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      // Preserve existing query params while updating 'q'
      const params = new URLSearchParams(searchParams);
      params.set("q", query.trim());

      router.push(`${pathname}?${params.toString()}`);
      setQuery(""); // Clear input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full rounded-xl p-2 ps-8 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
      </div>
    </form>
  );
}
