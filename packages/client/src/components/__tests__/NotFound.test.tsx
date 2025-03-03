import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "../NotFound";

describe("NotFound", () => {
  it("renders not found text", () => {
    render(<NotFound type="Hotels" />);
    expect(screen.getByText(/No Hotels Matched/i)).toBeInTheDocument();
  });
});
