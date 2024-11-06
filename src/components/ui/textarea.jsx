// components/ui/textarea.js
import React from 'react'

export function Textarea({ name, value, onChange, placeholder, rows = 3, className, ...props }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`p-2 rounded-md focus:outline-none ${className}`}
      {...props}
    />
  )
}
