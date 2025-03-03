import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSearchQuery } from "../useSearchQuery";
import { UseSearchQueryProps } from "../../types/props";

describe("useSearchQuery", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("initializes typedQuery as an empty string", () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useSearchQuery({ onSearch, onClear } as UseSearchQueryProps)
    );
    expect(result.current.typedQuery).toBe("");
  });

  it("updates typedQuery and calls onSearch after 500ms debounce", () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useSearchQuery({ onSearch, onClear } as UseSearchQueryProps)
    );

    act(() => {
      result.current.handleChange("test query");
    });

    expect(result.current.typedQuery).toBe("test query");
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onSearch).toHaveBeenCalledWith("test query");
  });

  it("cancels previous debounce if handleChange is called again quickly", () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useSearchQuery({ onSearch, onClear } as UseSearchQueryProps)
    );

    act(() => {
      result.current.handleChange("first query");
      vi.advanceTimersByTime(300);
      result.current.handleChange("second query");
      vi.advanceTimersByTime(300);
    });

    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("second query");
  });

  it("resets typedQuery and calls onClear when handleClear is invoked", () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useSearchQuery({ onSearch, onClear } as UseSearchQueryProps)
    );

    act(() => {
      result.current.handleChange("some query");
      vi.advanceTimersByTime(500);
    });
    expect(result.current.typedQuery).toBe("some query");

    act(() => {
      result.current.handleClear();
    });
    expect(result.current.typedQuery).toBe("");
    expect(onClear).toHaveBeenCalled();
  });
});
