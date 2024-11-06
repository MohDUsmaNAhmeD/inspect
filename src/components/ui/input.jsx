// components/ui/input.js
import React from 'react'

export function Input({ type = 'text', name, value, onChange, placeholder, className, ...props }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 rounded-md focus:outline-none ${className}`}
      {...props}
    />
  )
}
