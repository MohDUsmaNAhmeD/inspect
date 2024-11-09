import React from 'react';

const RadioGroupItem = ({ id, name, label, value, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)} // Calls the onChange handler with the selected value
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default RadioGroupItem;
