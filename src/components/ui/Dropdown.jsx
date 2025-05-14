"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"

function Dropdown({ trigger, items, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const alignmentStyles = {
    left: "left-0",
    right: "right-0",
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignmentStyles[align]}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <div key={index}>
                {item.type === "item" && (
                  <button
                    className={`
                      w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center
                      ${item.className || ""}
                    `}
                    onClick={() => {
                      item.onClick && item.onClick()
                      setIsOpen(false)
                    }}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
                {item.type === "divider" && <div className="h-px bg-gray-200 my-1"></div>}
                {item.type === "label" && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
