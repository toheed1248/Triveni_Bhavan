import React from 'react';

export default function StatCard({ icon: Icon, value, label, trend }) {
  return (
    <div className="bg-admin-maroon text-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-white/15 rounded-xl flex items-center justify-center" style={{ width: 44, height: 44 }}>
          <Icon className="text-white" size={22} />
        </div>
        <div>
          <p className="text-3xl font-bold font-body tracking-tight">{value}</p>
          <p className="text-xs font-medium uppercase tracking-wider mt-1.5 text-white/70">
            {label}
          </p>
          {trend && (
            <p className="text-[10px] mt-1 text-white/60">
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
