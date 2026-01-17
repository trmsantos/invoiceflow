export const Card = ({ className = '', children, ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h2>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)