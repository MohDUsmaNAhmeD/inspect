// components/ui/button.js
import React from 'react'

export function Button({ type = 'button', children, className, disabled, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold text-white disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
