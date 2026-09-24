import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {Icon && <Icon size={40} className="text-admin-text-muted mb-3" />}
      <p className="text-sm font-semibold text-admin-text-primary">{title}</p>
      {description && (
        <p className="text-xs text-admin-text-secondary mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
