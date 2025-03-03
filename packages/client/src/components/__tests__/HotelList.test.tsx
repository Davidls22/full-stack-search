import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import HotelList from "../HotelList";
import { Hotel } from "../../types/types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("HotelList Component", () => {
  it("renders the hotel list with correct titles", () => {
    const hotels: Hotel[] = [
      {
        _id: "h1",
        hotel_name: "Paris Hotel",
        city: "Paris",
        addressline1: "123 Paris Street",
        addressline2: "",
        country: "France",
        countryisocode: "FR",
        state: "",
        zipcode: "75000",
        chain_name: "Luxury Paris Stays",
        star_rating: 5,
      },
      {
        _id: "h2",
        hotel_name: "Nice Resort",
        city: "Nice",
        addressline1: "456 Nice Avenue",
        addressline2: "",
        country: "France",
        countryisocode: "FR",
        state: "",
        zipcode: "06000",
        chain_name: "Nice Luxury Resorts",
        star_rating: 4,
      },
    ];

    render(<HotelList hotels={hotels} title="Hotels in France" />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Hotels in France")).toBeInTheDocument();
    expect(screen.getByText("Paris Hotel (Paris)")).toBeInTheDocument();
    expect(screen.getByText("Nice Resort (Nice)")).toBeInTheDocument();
  });

  it("does not render when no hotels are provided", () => {
    const { container } = render(<HotelList hotels={[]} title="No Hotels" />, {
      wrapper: MemoryRouter,
    });
    expect(container.firstChild).toBeNull();
  });

  it("navigates to the correct hotel page when clicked", () => {
    const hotels: Hotel[] = [
      {
        _id: "h1",
        hotel_name: "Paris Hotel",
        city: "Paris",
        addressline1: "123 Paris Street",
        addressline2: "",
        country: "France",
        countryisocode: "FR",
        state: "",
        zipcode: "75000",
        chain_name: "Luxury Paris Stays",
        star_rating: 5,
      },
    ];

    render(<HotelList hotels={hotels} title="Hotels in France" />, {
      wrapper: MemoryRouter,
    });

    fireEvent.click(screen.getByText("Paris Hotel (Paris)"));
    expect(mockNavigate).toHaveBeenCalledWith("/hotel/h1");
  });
});
