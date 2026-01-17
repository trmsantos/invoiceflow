import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

export const Alert = ({ variant = 'info', title, message, onClose }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle2 size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
  }

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${variants[variant]}`}>
      <div className="flex-shrink-0">{icons[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      )}
    </div>
  )
}