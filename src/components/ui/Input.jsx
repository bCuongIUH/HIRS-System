function Input({ label, id, error, className = "", type = "text", icon, ...props }) {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
          <input
            id={id}
            type={type}
            className={`
              w-full rounded-md border border-gray-300 py-2 px-3 
              ${icon ? "pl-10" : ""}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
  
  export default Input
  