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