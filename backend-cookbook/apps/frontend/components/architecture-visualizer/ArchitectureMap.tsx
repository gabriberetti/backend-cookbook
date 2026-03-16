'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BackendEvent } from '@/types';

// ─── Node definitions ─────────────────────────────────────────────────────────

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  color: string;
  details: {
    title: string;
    description: string;
    items: string[];
  };
}

const NODES: NodeDef[] = [
  {
    id: 'frontend',
    label: 'Next.js',
    sublabel: 'Frontend',
    x: 400,
    y: 70,
    color: '#3b82f6',
    details: {
      title: 'Next.js App Router',
      description: 'React server + client components with TypeScript and Tailwind CSS.',
      items: ['App Router', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', 'Socket.io Client'],
    },
  },
  {
    id: 'api',
    label: 'Express',
    sublabel: 'REST API',
    x: 400,
    y: 220,
    color: '#8b5cf6',
    details: {
      title: 'Node.js + Express',
      description: 'RESTful API with JWT auth, rate limiting, and distributed request tracing.',
      items: ['REST endpoints', 'JWT Auth middleware', 'Zod validation', 'Rate limiting', 'Trace ID injection'],
    },
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    sublabel: 'Atlas',
    x: 170,
    y: 370,
    color: '#10b981',
    details: {
      title: 'MongoDB Atlas',
      description: 'NoSQL document database with Mongoose ODM and indexed collections.',
      items: ['Collections: users, tasks, logs', 'Indexes: email, createdAt', 'Mongoose ODM', 'Atlas Free Tier'],
    },
  },
  {
    id: 'redis',
    label: 'Redis',
    sublabel: 'BullMQ',
    x: 400,
    y: 370,
    color: '#ef4444',
    details: {
      title: 'Redis + BullMQ',
      description: 'In-memory store powering async job queues and worker processing.',
      items: ['Email queue', 'File processing queue', 'BullMQ workers', 'Job status tracking'],
    },
  },
  {
    id: 's3',
    label: 'AWS S3',
    sublabel: 'Storage',
    x: 630,
    y: 370,
    color: '#f59e0b',
    details: {
      title: 'AWS S3 Storage',
      description: 'Cloud object storage for file uploads with pre-signed URL generation.',
      items: ['Bucket: uploads', 'Pre-signed URLs', 'Multer middleware', 'AWS SDK v3'],
    },
  },
  {
    id: 'socket',
    label: 'Socket.io',
    sublabel: 'WebSocket',
    x: 630,
    y: 220,
    color: '#06b6d4',
    details: {
      title: 'WebSocket / Socket.io',
      description: 'Real-time bidirectional event streaming from server to frontend.',
      items: ['Real-time events', 'API Monitor feed', 'Event Timeline', 'Connection status'],
    },
  },
];

// ─── Edge definitions ─────────────────────────────────────────────────────────

interface EdgeDef {
  from: string;
  to: string;
  label: string;
  color?: string;
}

const EDGES: EdgeDef[] = [
  { from: 'frontend', to: 'api',     label: 'REST',    color: '#3b82f6' },
  { from: 'frontend', to: 'socket',  label: 'WS',      color: '#06b6d4' },
  { from: 'api',      to: 'mongodb', label: 'Mongoose', color: '#10b981' },
  { from: 'api',      to: 'redis',   label: 'BullMQ',  color: '#ef4444' },
  { from: 'api',      to: 's3',      label: 'SDK',     color: '#f59e0b' },
  { from: 'api',      to: 'socket',  label: 'Events',  color: '#06b6d4' },
];

// ─── Bezier path helper ───────────────────────────────────────────────────────

function edgePath(from: NodeDef, to: NodeDef): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Control points: pull horizontally first then vertically
  const cx1 = from.x + dx * 0.15;
  const cy1 = from.y + dy * 0.6;
  const cx2 = to.x - dx * 0.15;
  const cy2 = to.y - dy * 0.6;
  return `M ${from.x} ${from.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${to.x} ${to.y}`;
}

// Mid-point for label placement
function edgeMidpoint(from: NodeDef, to: NodeDef) {
  return {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
  };
}

// ─── Node SVG icons ───────────────────────────────────────────────────────────

function NodeIcon({ id, color }: { id: string; color: string }) {
  const s = { stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  switch (id) {
    case 'frontend':
      return (
        <g>
          <rect x="-9" y="-7" width="18" height="14" rx="2" {...s} />
          <line x1="-9" y1="-3" x2="9" y2="-3" {...s} />
          <line x1="0" y1="7" x2="0" y2="10" {...s} />
          <line x1="-4" y1="10" x2="4" y2="10" {...s} />
        </g>
      );
    case 'api':
      return (
        <g>
          <rect x="-9" y="-8" width="18" height="5" rx="1.5" {...s} />
          <rect x="-9" y="-1.5" width="18" height="5" rx="1.5" {...s} />
          <rect x="-9" y="5" width="18" height="3" rx="1" {...s} />
          <circle cx="6" cy="-5.5" r="1" fill={color} />
          <circle cx="6" cy="1" r="1" fill={color} />
        </g>
      );
    case 'mongodb':
      return (
        <g>
          <ellipse cx="0" cy="-6" rx="7" ry="2.5" {...s} />
          <line x1="-7" y1="-6" x2="-7" y2="4" {...s} />
          <line x1="7" y1="-6" x2="7" y2="4" {...s} />
          <ellipse cx="0" cy="4" rx="7" ry="2.5" {...s} />
          <path d="M -7 -1 A 7 2.5 0 0 0 7 -1" {...s} />
        </g>
      );
    case 'redis':
      return (
        <g>
          <polygon points="2,-9 -4,0 1,0 -2,9 6,-2 1,-2" stroke={color} strokeWidth="1.4" fill={color} fillOpacity="0.25" strokeLinejoin="round" />
        </g>
      );
    case 's3':
      return (
        <g>
          <path d="M -7 3 A 6 6 0 0 1 -4 -5 A 4 4 0 0 1 5 -5 A 4 4 0 0 1 7 3" {...s} />
          <line x1="0" y1="4" x2="0" y2="-2" {...s} />
          <polyline points="-3.5,0 0,-3.5 3.5,0" {...s} />
        </g>
      );
    case 'socket':
      return (
        <g>
          <circle cx="0" cy="4" r="2.5" fill={color} opacity={0.9} />
          <path d="M -6 -1 A 7 7 0 0 1 6 -1" {...s} />
          <path d="M -10 -5.5 A 11.5 11.5 0 0 1 10 -5.5" {...s} />
        </g>
      );
    default:
      return null;
  }
}

// ─── Packet animation (uses SVG animateMotion) ────────────────────────────────

interface Packet {
  id: string;
  path: string;
  color: string;
}

function getEdgeForEvent(event: BackendEvent): EdgeDef | null {
  const type = event.eventType;
  if (type === 'auth' || type === 'api')     return EDGES.find(e => e.from === 'frontend' && e.to === 'api') ?? null;
  if (type === 'database')                   return EDGES.find(e => e.from === 'api' && e.to === 'mongodb') ?? null;
  if (type === 'cloud')                      return EDGES.find(e => e.from === 'api' && e.to === 's3') ?? null;
  if (type === 'job')                        return EDGES.find(e => e.from === 'api' && e.to === 'redis') ?? null;
  if (type === 'system')                     return EDGES.find(e => e.from === 'api' && e.to === 'socket') ?? null;
  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ArchitectureMapProps {
  events: BackendEvent[];
}

export function ArchitectureMap({ events }: ArchitectureMapProps) {
  const [selected, setSelected]   = useState<NodeDef | null>(null);
  const [packets, setPackets]     = useState<Packet[]>([]);
  const lastTraceRef              = useRef<string | null>(null);
  const prefersReduced            = useReducedMotion();

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  // Derive active node IDs from recent events
  const activeNodeIds = new Set(
    events.slice(0, 6).flatMap(e => {
      if (e.eventType === 'auth' || e.eventType === 'api') return ['api', 'frontend'];
      if (e.eventType === 'database') return ['mongodb', 'api'];
      if (e.eventType === 'cloud')    return ['s3', 'api'];
      if (e.eventType === 'job')      return ['redis', 'api'];
      if (e.eventType === 'system')   return ['socket', 'api'];
      return [];
    })
  );

  // Fire a packet on each new event (skip if reduced motion is preferred)
  useEffect(() => {
    if (prefersReduced || events.length === 0) return;
    const latest = events[0];
    if (latest.traceId === lastTraceRef.current) return;
    lastTraceRef.current = latest.traceId;

    const edge = getEdgeForEvent(latest);
    if (!edge) return;

    const from = nodeMap[edge.from];
    const to   = nodeMap[edge.to];
    if (!from || !to) return;

    const packet: Packet = {
      id: `${latest.traceId}-${Date.now()}`,
      path: edgePath(from, to),
      color: edge.color ?? '#3b82f6',
    };

    setPackets(prev => [...prev.slice(-6), packet]);
    const timer = setTimeout(() => {
      setPackets(prev => prev.filter(p => p.id !== packet.id));
    }, 1100);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events[0]?.traceId]);

  return (
    <div className="relative w-full" style={{ height: 500 }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 490"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter for active nodes */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow filter for packets */}
          <filter id="packet-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Edges ─────────────────────────────────── */}
        {EDGES.map(edge => {
          const from = nodeMap[edge.from];
          const to   = nodeMap[edge.to];
          if (!from || !to) return null;
          const active = activeNodeIds.has(edge.from) || activeNodeIds.has(edge.to);
          const path   = edgePath(from, to);
          const mid    = edgeMidpoint(from, to);
          const edgeColor = edge.color ?? '#3b82f6';

          return (
            <g key={`${edge.from}-${edge.to}`}>
              {/* Base dashed path */}
              <path
                d={path}
                fill="none"
                stroke={active ? edgeColor : '#1e2d4a'}
                strokeWidth={active ? 1.5 : 1}
                strokeDasharray="6 5"
                opacity={active ? 0.55 : 0.3}
              />
              {/* Active glow path (solid, blurred) */}
              {active && (
                <path
                  d={path}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={2.5}
                  opacity={0.18}
                  filter="url(#node-glow)"
                />
              )}
              {/* Edge label */}
              <text
                x={mid.x + 8}
                y={mid.y - 6}
                fontSize="9"
                fill={active ? edgeColor : '#475569'}
                fontFamily="monospace"
                opacity={active ? 0.9 : 0.5}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* ── Animated packets ──────────────────────── */}
        {packets.map(packet => (
          <g key={packet.id}>
            {/* outer glow */}
            <circle r={7} fill={packet.color} opacity={0.2} filter="url(#packet-glow)">
              <animateMotion dur="1s" path={packet.path} />
            </circle>
            {/* core dot */}
            <circle r={4} fill={packet.color} opacity={0.95}>
              <animateMotion dur="1s" path={packet.path} />
            </circle>
          </g>
        ))}

        {/* ── Nodes ─────────────────────────────────── */}
        {NODES.map(node => {
          const isActive   = activeNodeIds.has(node.id);
          const isSelected = selected?.id === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => setSelected(isSelected ? null : node)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer dashed orbit ring */}
              <circle
                r={38}
                fill="none"
                stroke={node.color}
                strokeWidth={0.8}
                strokeDasharray="3 6"
                opacity={isActive || isSelected ? 0.3 : 0.1}
              />

              {/* Pulse ring (active only) */}
              {isActive && (
                <motion.circle
                  r={30}
                  fill={node.color}
                  fillOpacity={0}
                  stroke={node.color}
                  strokeWidth={1.5}
                  animate={{ r: [28, 40], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              )}

              {/* Main node circle — base fill */}
              <circle
                r={26}
                fill="#0a0e1a"
                stroke={isSelected ? node.color : (isActive ? node.color : '#1e3a5f')}
                strokeWidth={isSelected ? 2 : (isActive ? 1.5 : 1)}
                filter={isActive ? 'url(#node-glow)' : undefined}
                opacity={1}
              />

              {/* Colored tint fill */}
              <circle
                r={26}
                fill={node.color}
                opacity={isSelected ? 0.18 : (isActive ? 0.1 : 0.05)}
              />

              {/* SVG icon */}
              <NodeIcon id={node.id} color={node.color} />

              {/* Node label */}
              <text
                y={40}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={node.color}
                fontFamily="monospace"
                opacity={isActive || isSelected ? 1 : 0.7}
              >
                {node.label}
              </text>
              <text
                y={52}
                textAnchor="middle"
                fontSize="8.5"
                fill="#64748b"
                fontFamily="monospace"
              >
                {node.sublabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Detail panel ──────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 w-72"
            style={{ zIndex: 10 }}
          >
            <div
              className="rounded-[var(--radius-card)]"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%), var(--bg-card)`,
                border: `1px solid ${selected.color}30`,
                boxShadow: `var(--shadow-card), 0 0 32px ${selected.color}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: selected.color,
                        boxShadow: `0 0 8px ${selected.color}`,
                        animation: 'glow-pulse 2s ease-in-out infinite',
                      }}
                    />
                    <h3 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: selected.color }}>
                      {selected.details.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close panel"
                    className="w-6 h-6 rounded flex items-center justify-center transition-colors shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M1 1l10 10M11 1L1 11" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="mb-4" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selected.details.description}
                </p>

                {/* Divider */}
                <div className="mb-3 h-px" style={{ backgroundColor: `${selected.color}20` }} />

                {/* Stack items */}
                <ul className="space-y-2">
                  {selected.details.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className="flex items-center gap-2"
                      style={{ fontSize: 'var(--text-caption)' }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ backgroundColor: selected.color }}
                      />
                      <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer hint */}
                <div
                  className="mt-4 px-3 py-2 rounded-lg font-mono"
                  style={{
                    backgroundColor: `${selected.color}0a`,
                    border: `1px solid ${selected.color}18`,
                    fontSize: '10px',
                    color: selected.color,
                  }}
                >
                  {selected.id === 'socket' ? '↑ Real-time events streaming' :
                   selected.id === 'frontend' ? '↓ Consuming REST + WebSocket' :
                   '← API layer orchestrates this service'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
