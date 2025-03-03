import { renderHook, act } from "@testing-library/react";
import useSearch from "../useSearch";
import * as api from "../../services/api";
import { vi, describe, beforeEach, it, expect } from "vitest";

describe("useSearch hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.searchResults).toEqual({
      hotels: [],
      countries: [],
      cities: [],
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.query).toBe("");
  });

  it("should clear search when fetchData is called with an empty query", async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.fetchData("   ");
    });

    expect(result.current.searchResults).toEqual({
      hotels: [],
      countries: [],
      cities: [],
    });
    expect(result.current.query).toBe("");
  });

  it("should update query and searchResults on successful fetchData", async () => {
    const mockResults = {
      hotels: [{ id: "1", name: "Hotel 1" }],
      countries: [{ id: "c1", name: "Country 1" }],
      cities: [{ id: "city1", name: "City 1" }],
    };
    vi.spyOn(api, "search").mockResolvedValue(mockResults);
    const { result } = renderHook(() => useSearch());
    const query = "test query";

    await act(async () => {
      await result.current.fetchData(query);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.query).toBe(query);
    expect(result.current.searchResults).toEqual(mockResults);
  });

  it("should clear search on fetchData error", async () => {
    vi.spyOn(api, "search").mockRejectedValue(new Error("API error"));
    const { result } = renderHook(() => useSearch());
    const query = "error query";

    await act(async () => {
      await result.current.fetchData(query);
    });

    expect(result.current.searchResults).toEqual({
      hotels: [],
      countries: [],
      cities: [],
    });
    expect(result.current.query).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("clearSearch should reset searchResults and query", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchResults).toEqual({
      hotels: [],
      countries: [],
      cities: [],
    });
    expect(result.current.query).toBe("");
  });
});
