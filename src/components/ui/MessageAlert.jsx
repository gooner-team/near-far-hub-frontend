import { CheckCircle, AlertCircle } from 'lucide-react'

export const MessageAlert = ({ message }) => {
    if (!message.text) return null

    return (
        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
            {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
        </div>
    )
}