import { render, screen, fireEvent } from "@testing-library/react"
import { vi, describe, beforeEach, it, expect } from "vitest"
import SearchBar from "../SearchBar"
import { BrowserRouter } from "react-router-dom"
import type { UseSearchQueryProps } from "../../types/props"

type UseSearchQueryReturn = {
  typedQuery: string
  handleChange: (value: string) => void
  handleClear: () => void
}

const mockedNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

let mockTypedQuery = ""
const mockHandleChange = vi.fn()
const mockHandleClear = vi.fn()

vi.mock("../../hooks/useSearchQuery", () => ({
    useSearchQuery: (_props: UseSearchQueryProps): UseSearchQueryReturn => {
      void _props
      return {
        typedQuery: mockTypedQuery,
        handleChange: mockHandleChange,
        handleClear: mockHandleClear,
      }
    },
  }))

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTypedQuery = ""
  })

  it("renders input with placeholder and value", () => {
    render(<SearchBar onSearch={vi.fn()} onClear={vi.fn()} />, {
      wrapper: BrowserRouter,
    })
    const input = screen.getByPlaceholderText("Search accommodation...")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("")
  })

  it("calls handleChange and navigate on input change", () => {
    render(<SearchBar onSearch={vi.fn()} onClear={vi.fn()} />, {
      wrapper: BrowserRouter,
    })
    const input = screen.getByPlaceholderText("Search accommodation...")
    fireEvent.change(input, { target: { value: "new search" } })
    expect(mockHandleChange).toHaveBeenCalledWith("new search")
    expect(mockedNavigate).toHaveBeenCalledWith("/?query=new%20search")
  })

  it("renders clear button when typedQuery is not empty and calls handleClear and navigate on click", () => {
    mockTypedQuery = "some query"
    render(<SearchBar onSearch={vi.fn()} onClear={vi.fn()} />, {
      wrapper: BrowserRouter,
    })
    const clearButton = screen.getByTestId("close")
    expect(clearButton).toBeInTheDocument()
    fireEvent.click(clearButton)
    expect(mockHandleClear).toHaveBeenCalled()
    expect(mockedNavigate).toHaveBeenCalledWith("/")
  })
})