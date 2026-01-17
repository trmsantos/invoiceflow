import { forwardRef } from 'react'

export const Input = forwardRef(({ className = '', error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
))

export const Select = forwardRef(({ className = '', error, options, ...props }, ref) => (
  <div className="w-full">
    <select
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    >
      {options?.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
))

export const Label = ({ children, className = '', ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-2 ${className}`} {...props}>
    {children}
  </label>
)