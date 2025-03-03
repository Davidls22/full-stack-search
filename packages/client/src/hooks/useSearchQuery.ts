import { useState, useRef } from "react"
import { UseSearchQueryProps } from "../types/props"

export function useSearchQuery({ onSearch, onClear }: UseSearchQueryProps) {
  const [typedQuery, setTypedQuery] = useState("")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  function handleChange(newQuery: string) {
    setTypedQuery(newQuery)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(newQuery)
    }, 500)
  }

  function handleClear() {
    setTypedQuery("")
    onClear()
  }

  return { typedQuery, handleChange, handleClear }
}