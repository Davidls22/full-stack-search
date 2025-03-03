import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResultSection from "../ResultSection";

describe("ResultSection Component", () => {
  it("does not render if no query is typed", () => {
    const hotels = [{ _id: "1", hotel_name: "Test Hotel", country: "USA" }];
    const { container } = render(
      <ResultSection
        title="Hotels"
        items={hotels}
        onSelect={() => {}}
        query=""
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders NotFound if query is typed but items array is empty", () => {
    render(
      <ResultSection
        title="Hotels"
        items={[]}
        onSelect={() => {}}
        query="some query"
      />
    );
    expect(screen.getByText(/no hotels matched/i)).toBeInTheDocument();
  });

  it("renders the title correctly when items exist and query is typed", () => {
    const hotels = [{ _id: "1", hotel_name: "Test Hotel", country: "USA" }];
    render(
      <ResultSection
        title="Hotels"
        items={hotels}
        onSelect={() => {}}
        query="resort"
      />
    );
    expect(screen.getByText("Hotels")).toBeInTheDocument();
  });

  it("renders a list of hotel items when query is typed", () => {
    const hotels = [
      { _id: "1", hotel_name: "Hotel One", country: "USA" },
      { _id: "2", hotel_name: "Hotel Two", country: "UK" },
    ];

    render(
      <ResultSection
        title="Hotels"
        items={hotels}
        onSelect={() => {}}
        query="hotel"
      />
    );

    expect(screen.getByText("Hotel One (USA)")).toBeInTheDocument();
    expect(screen.getByText("Hotel Two (UK)")).toBeInTheDocument();
  });

  it("renders a list of country items when query is typed", () => {
    const countries = [
      { _id: "1", country: "United States" },
      { _id: "2", country: "United Kingdom" },
    ];

    render(
      <ResultSection
        title="Countries"
        items={countries}
        onSelect={() => {}}
        query="uni"
      />
    );

    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
  });

  it("calls onSelect when a hotel item is clicked", () => {
    const mockOnSelect = vi.fn();
    const hotels = [{ _id: "1", hotel_name: "Hotel One", country: "USA" }];

    render(
      <ResultSection
        title="Hotels"
        items={hotels}
        onSelect={mockOnSelect}
        query="hotel"
      />
    );

    fireEvent.click(screen.getByText("Hotel One (USA)"));
    expect(mockOnSelect).toHaveBeenCalledWith(hotels[0]);
  });

  it("calls onSelect when a country item is clicked", () => {
    const mockOnSelect = vi.fn();
    const countries = [{ _id: "1", country: "United Kingdom" }];

    render(
      <ResultSection
        title="Countries"
        items={countries}
        onSelect={mockOnSelect}
        query="kingdom"
      />
    );

    fireEvent.click(screen.getByText("United Kingdom"));
    expect(mockOnSelect).toHaveBeenCalledWith(countries[0]);
  });
});
