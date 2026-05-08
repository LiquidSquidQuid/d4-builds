interface StatPriorityProps {
  stats: { name: string; primary?: boolean }[];
}

export default function StatPriority({ stats }: StatPriorityProps) {
  const maxIdx = stats.length;
  return (
    <div className="stat-scale">
      {stats.map((stat, i) => {
        const pct = Math.round(100 - (i / maxIdx) * 80);
        const tier = i < 2 ? 1 : i < 5 ? 2 : 3;
        const tierClass = `t${tier}`;
        return (
          <div key={i} className="stat-row-v2">
            <div className={`stat-name-v2${tier === 1 ? ' tier-1' : ''}`}>{stat.name}</div>
            <div className="stat-bar-wrap" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${stat.name} priority`}>
              <div className={`stat-bar-fill ${tierClass}`} style={{ width: `${pct}%` }} />
            </div>
            <div className={`stat-val-v2${tier === 1 ? ' tier-1' : ''}`}>
              {stat.primary ? 'High' : tier === 2 ? 'Med' : 'Low'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
