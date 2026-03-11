'use client';

import { motion } from 'framer-motion';

interface FlowLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  color?: string;
}

interface ArchitectureFlowLinesProps {
  lines: FlowLine[];
  width: number;
  height: number;
}

export function ArchitectureFlowLines({ lines, width, height }: ArchitectureFlowLinesProps) {
  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" opacity="0.6" />
        </marker>
      </defs>
      {lines.map((line) => {
        const length = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
        return (
          <g key={line.id}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.active ? (line.color ?? '#3b82f6') : '#1e2d4a'}
              strokeWidth={line.active ? 1.5 : 1}
              strokeDasharray="4 4"
              opacity={line.active ? 0.8 : 0.3}
              markerEnd={line.active ? 'url(#arrowhead)' : undefined}
            />
            {line.active && (
              <motion.circle
                r={4}
                fill={line.color ?? '#3b82f6'}
                animate={{
                  offsetDistance: ['0%', '100%'],
                }}
                style={{
                  offsetPath: `path('M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}')`,
                  offsetDistance: '0%',
                }}
                transition={{
                  duration: length / 100,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
