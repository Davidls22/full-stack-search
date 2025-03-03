import { render, screen } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./app";

vi.mock("./components/Header", () => ({
  default: () => <div>Header</div>,
}));

vi.mock("./components/SearchBar", () => ({
  default: () => <div>SearchBar</div>,
}));

vi.mock("./hooks/useSearch", () => ({
  default: () => ({
    searchResults: { hotels: [], countries: [], cities: [] },
    fetchData: vi.fn(),
    clearSearch: vi.fn(),
    loading: false,
    query: "",
  }),
}));

vi.mock("./components/ResultsList", () => ({
  default: () => <div>ResultsList</div>,
}));

vi.mock("./components/SelectedItem", () => ({
  default: () => <div>SelectedItem</div>,
}));

describe("App component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Header, SearchBar, and ResultsList on route "/"', async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("SearchBar")).toBeInTheDocument();
    expect(await screen.findByText("ResultsList")).toBeInTheDocument();
  });

  it('renders SelectedItem on route "/hotel/1"', async () => {
    render(
      <MemoryRouter initialEntries={["/hotel/1"]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText("SelectedItem")).toBeInTheDocument();
  });

  it('redirects unknown routes to "/" and renders ResultsList', async () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText("ResultsList")).toBeInTheDocument();
  });
});
