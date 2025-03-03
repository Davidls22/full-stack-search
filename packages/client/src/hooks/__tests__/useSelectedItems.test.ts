import { renderHook, waitFor } from "@testing-library/react";
import { useSelectedItem } from "../useSelectedItem";
import * as api from "../../services/api";
import { vi, describe, beforeEach, it, expect, type Mock } from "vitest";
import { useParams } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

describe("useSelectedItem hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set selectedItem to null and loading to false when params are missing", async () => {
    (useParams as unknown as Mock).mockReturnValue({});
    const { result } = renderHook(() => useSelectedItem());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should set an error for an invalid type and not attempt to fetch data", async () => {
    (useParams as unknown as Mock).mockReturnValue({
      type: "invalid",
      id: "123",
    });
    const { result } = renderHook(() => useSelectedItem());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Invalid type: invalid");
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.type).toBe("invalid");
  });

  it("should fetch and set selectedItem when valid params are provided", async () => {
    (useParams as unknown as Mock).mockReturnValue({ type: "hotel", id: "1" });
    const mockData = { id: "1", name: "Hotel 1" };
    vi.spyOn(api, "fetchSelectedItem").mockResolvedValue(mockData);
    const { result } = renderHook(() => useSelectedItem());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.selectedItem).toEqual(mockData);
    expect(result.current.type).toBe("hotel");
  });

  it("should set an error when fetching selectedItem fails", async () => {
    (useParams as unknown as Mock).mockReturnValue({ type: "hotel", id: "1" });
    vi.spyOn(api, "fetchSelectedItem").mockRejectedValue(
      new Error("API error")
    );
    const { result } = renderHook(() => useSelectedItem());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Error fetching hotel");
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.type).toBe("hotel");
  });
});
