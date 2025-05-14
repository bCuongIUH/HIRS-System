function Card({ children, className = "", title, description }) {
    return (
      <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${className}`}>
        {(title || description) && (
          <div className="border-b p-4">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    )
  }
  
  export default Card
  