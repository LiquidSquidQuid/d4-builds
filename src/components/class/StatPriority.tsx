import React from 'react';

interface StatPriorityProps {
  stats: { name: string; primary?: boolean }[];
}

export default function StatPriority({ stats }: StatPriorityProps) {
  return (
    <div className="stat-priority">
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <span className={stat.primary ? 'stat-tag primary' : 'stat-tag'}>
            {stat.name}
          </span>
          {index < stats.length - 1 && (
            <span className="stat-arrow">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
