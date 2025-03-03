import { useState } from "react";
import { search } from "../services/api";
import { SearchResults } from "../types/types";

function useSearch() {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    hotels: [],
    countries: [],
    cities: [],
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchData = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      clearSearch();
      return;
    }
    setQuery(q);
    setLoading(true);
    try {
      const results = await search(trimmed);
      setSearchResults(results);
    } catch {
      clearSearch();
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults({ hotels: [], countries: [], cities: [] });
    setQuery("");
  };

  return {
    searchResults,
    fetchData,
    loading,
    clearSearch,
    query,
  };
}

export default useSearch;
