function Avatar({ src, alt, initials, size = "md", className = "" }) {
    const sizeStyles = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
    }
  
    const hasImage = src && src !== ""
  
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 ${sizeStyles[size]} ${className}`}
      >
        {hasImage ? (
          <img
            src={src || "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/12/hinh-anh-con-lon-sieu-de-thuong-29.png.webp"}
            alt={alt || "Avatar"}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/12/hinh-anh-con-lon-sieu-de-thuong-29.png.webp"
            }}
          />
        ) : (
          <span className="font-medium text-gray-600">{initials}</span>
        )}
      </div>
    )
  }
  
  export default Avatar
  