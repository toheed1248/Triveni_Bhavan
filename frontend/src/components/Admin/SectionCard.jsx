import React from 'react';

export default function SectionCard({ title, action, children, className = '' }) {
  return (
    <div
      className={`bg-white border border-admin-border rounded-2xl shadow-sm ${className}`}
    >
      <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-admin-text-primary">{title}</h3>
        {action && (
          <span className="text-xs font-medium text-admin-maroon hover:underline cursor-pointer">
            {action}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
