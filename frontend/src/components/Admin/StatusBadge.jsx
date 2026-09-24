import React from 'react';

const statusStyles = {
  New: 'bg-blue-50 text-blue-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Quoted: 'bg-purple-50 text-purple-700',
  Confirmed: 'bg-green-50 text-green-700',
  Closed: 'bg-gray-50 text-gray-600',
  Cancelled: 'bg-red-50 text-red-700',
  Pending: 'bg-blue-50 text-blue-700',
  Completed: 'bg-gray-50 text-gray-600',
  Published: 'bg-green-50 text-green-700',
  Draft: 'bg-gray-50 text-gray-600',
  Archived: 'bg-red-50 text-red-700',
  Verified: 'bg-green-50 text-green-700',
  Unverified: 'bg-amber-50 text-amber-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const colorClass = statusStyles[status] || 'bg-gray-50 text-gray-600';
  const sizeClass = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {status}
    </span>
  );
}
