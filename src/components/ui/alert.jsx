// components/ui/alert.js
import React from 'react'
import { AlertTriangle } from 'lucide-react'

export function Alert({ className, children }) {
  return (
    <div className={`flex items-start p-4 rounded-md ${className}`}>
      <AlertTriangle className="mr-2 h-5 w-5" />
      <div>{children}</div>
    </div>
  )
}

export function AlertDescription({ children }) {
  return <p>{children}</p>
}
