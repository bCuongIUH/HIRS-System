"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder = "Chọn...",
  className = "",
  error,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Find the selected option label
  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={id}
          className={`
            relative w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-left 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${className}
          `}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          <span className={`block truncate ${!selectedOption ? "text-gray-400" : ""}`}>{displayValue}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {options.map((option) => (
              <div
                key={option.value}
                className={`
                  cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100
                  ${value === option.value ? "bg-blue-50 text-blue-600" : "text-gray-900"}
                `}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <span className="block truncate">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
