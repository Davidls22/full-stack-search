import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SelectedItem from "../SelectedItem";

const mockUseSelectedItem = vi.fn();
vi.mock("../../hooks/useSelectedItem", () => ({
  useSelectedItem: () => mockUseSelectedItem(),
}));

describe("SelectedItem Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NotFound when no item is found", () => {
    mockUseSelectedItem.mockReturnValue({
      selectedItem: null,
      loading: false,
      type: "hotel",
      relatedHotels: [],
    });

    render(
      <MemoryRouter initialEntries={["/hotel/999"]}>
        <Routes>
          <Route path="/:type/:id" element={<SelectedItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/no hotel matched/i)).toBeInTheDocument();
  });

  it("renders NotFound with default text when type is missing", () => {
    mockUseSelectedItem.mockReturnValue({
      selectedItem: null,
      loading: false,
      type: undefined,
      relatedHotels: [],
    });

    render(
      <MemoryRouter initialEntries={["/unknown/999"]}>
        <Routes>
          <Route path="/:type/:id" element={<SelectedItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("No Item Matched")).toBeInTheDocument();
  });

  it("displays a hotel correctly", () => {
    mockUseSelectedItem.mockReturnValue({
      selectedItem: {
        _id: "1",
        hotel_name: "Grand Hotel",
        chain_name: "Luxury Stays",
        addressline1: "123 Main St",
        addressline2: "Suite 456",
        city: "New York",
        state: "NY",
        country: "USA",
        countryisocode: "US",
        star_rating: 5,
      },
      relatedHotels: [],
      loading: false,
      type: "hotel",
    });

    render(
      <MemoryRouter initialEntries={["/hotel/1"]}>
        <Routes>
          <Route path="/:type/:id" element={<SelectedItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Grand Hotel")).toBeInTheDocument();
    expect(screen.getByText("Luxury Stays")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, Suite 456")).toBeInTheDocument();
    expect(screen.getByText("New York, NY - USA (US)")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("displays a country and passes hotels to HotelList", () => {
    mockUseSelectedItem.mockReturnValue({
      selectedItem: { _id: "10", country: "France" },
      relatedHotels: [
        { _id: "h1", hotel_name: "Paris Hotel", city: "Paris" },
        { _id: "h2", hotel_name: "Nice Resort", city: "Nice" },
      ],
      loading: false,
      type: "country",
    });

    render(
      <MemoryRouter initialEntries={["/country/10"]}>
        <Routes>
          <Route path="/:type/:id" element={<SelectedItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("Hotels in France")).toBeInTheDocument();
    expect(screen.getByText("Paris Hotel (Paris)")).toBeInTheDocument();
    expect(screen.getByText("Nice Resort (Nice)")).toBeInTheDocument();
  });

  it("displays a city and passes hotels to HotelList", () => {
    mockUseSelectedItem.mockReturnValue({
      selectedItem: { _id: "20", name: "Tokyo" },
      relatedHotels: [
        { _id: "h3", hotel_name: "Shibuya Inn" },
        { _id: "h4", hotel_name: "Ginza Stay" },
      ],
      loading: false,
      type: "city",
    });

    render(
      <MemoryRouter initialEntries={["/city/20"]}>
        <Routes>
          <Route path="/:type/:id" element={<SelectedItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Hotels in Tokyo")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Shibuya Inn"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Ginza Stay"))
    ).toBeInTheDocument();
  });
});
