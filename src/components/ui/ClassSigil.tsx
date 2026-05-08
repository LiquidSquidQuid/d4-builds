interface ClassSigilProps {
  abbr: string;
  color: string;
  size?: number;
}

export default function ClassSigil({ abbr, color, size = 200 }: ClassSigilProps) {
  const half = size / 2;
  const outerR = half - 4;
  const innerR = half - 20;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="class-sigil"
      aria-hidden="true"
      style={{ color }}
    >
      {/* Outer ring — rotates clockwise */}
      <g className="sigil-outer">
        <circle
          cx={half}
          cy={half}
          r={outerR}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        {/* Notch marks */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = half + Math.cos(angle) * (outerR - 6);
          const y1 = half + Math.sin(angle) * (outerR - 6);
          const x2 = half + Math.cos(angle) * outerR;
          const y2 = half + Math.sin(angle) * outerR;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.25"
            />
          );
        })}
      </g>

      {/* Inner ring — rotates counter-clockwise */}
      <g className="sigil-inner">
        <circle
          cx={half}
          cy={half}
          r={innerR}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          strokeDasharray="4 8"
        />
      </g>

      {/* Center letter */}
      <text
        x={half}
        y={half}
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={size * 0.22}
        fontFamily="Cinzel, serif"
        fontWeight="900"
        opacity="0.6"
      >
        {abbr}
      </text>
    </svg>
  );
}
