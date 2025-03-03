import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import ResultsList from "../ResultsList";
import type { ResultsListProps } from "../../types/props";
import { BrowserRouter } from "react-router-dom";
import type { Hotel, Country, City } from "../../types/types";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../Loading", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("../NotFound", () => ({
  default: () => <div>Not Found</div>,
}));

interface MockItem {
  _id: string;
  hotel_name?: string;
  name?: string;
  country?: string;
}

vi.mock("../ResultSection", () => ({
  default: ({
    title,
    items,
    onSelect,
  }: {
    title: string;
    items: MockItem[];
    onSelect: (item: MockItem) => void;
  }) => (
    <div>
      <div>{title}</div>
      {items.map((item) => (
        <div key={item._id} onClick={() => onSelect(item)}>
          {item.hotel_name || item.name || item.country}
        </div>
      ))}
    </div>
  ),
}));

describe("ResultsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Loading component when loading is true", () => {
    render(
      <ResultsList
        results={{ hotels: [], countries: [], cities: [] }}
        loading={true}
        query="foo"
      />,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Not Found component when query is non-empty and results are empty", () => {
    render(
      <ResultsList
        results={{ hotels: [], countries: [], cities: [] }}
        loading={false}
        query="test"
      />,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });

  it("renders result sections when results are provided", () => {
    const results: ResultsListProps["results"] = {
      hotels: [
        {
          _id: "h1",
          hotel_name: "Hotel 1",
          addressline1: "Address 1",
          city: "City 1",
          country: "Country 1",
          countryisocode: "C1",
          star_rating: 5,
        } as Hotel,
      ],
      countries: [{ _id: "c1", country: "Country 1" } as Country],
      cities: [{ _id: "ci1", name: "City 1" } as City],
    };
    render(<ResultsList results={results} loading={false} query="test" />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByText("Hotels")).toBeInTheDocument();
    expect(screen.getByText("Hotel 1")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
    expect(screen.getByText("Country 1")).toBeInTheDocument();
    expect(screen.getByText("Cities")).toBeInTheDocument();
    expect(screen.getByText("City 1")).toBeInTheDocument();
  });

  it("calls navigate with correct path when an item is selected", () => {
    const results: ResultsListProps["results"] = {
      hotels: [
        {
          _id: "h1",
          hotel_name: "Hotel 1",
          addressline1: "Address 1",
          city: "City 1",
          country: "Country 1",
          countryisocode: "C1",
          star_rating: 5,
        } as Hotel,
      ],
      countries: [],
      cities: [],
    };
    render(<ResultsList results={results} loading={false} query="test" />, {
      wrapper: BrowserRouter,
    });
    fireEvent.click(screen.getByText("Hotel 1"));
    expect(mockedNavigate).toHaveBeenCalledWith("/hotel/h1");
  });
});
