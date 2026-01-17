export const Loading = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center h-screen gap-3">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-gray-600">{text}</p>
  </div>
)

export const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
)

// src/components/common/Table.jsx
export const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full">{children}</table>
  </div>
)

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>{children}</tr>
  </thead>
)

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${className}`}>
    {children}
  </th>
)

export const TableBody = ({ children }) => <tbody>{children}</tbody>

export const TableRow = ({ children, className = '' }) => (
  <tr className={`border-b border-gray-200 hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
)

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 text-sm text-gray-900 ${className}`}>{children}</td>
)