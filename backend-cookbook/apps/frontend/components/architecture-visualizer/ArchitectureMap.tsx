'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { BackendEvent } from '@/types';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface NodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  details: {
    title: string;
    description: string;
    items: string[];
  };
}

const NODES: NodeDef[] = [
  {
    id: 'frontend',
    label: 'Next.js Frontend',
    x: 400,
    y: 60,
    color: '#3b82f6',
    icon: '⬡',
    details: {
      title: 'Next.js App Router',
      description: 'React server + client components with TypeScript and TailwindCSS.',
      items: ['App Router', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Socket.io Client'],
    },
  },
  {
    id: 'api',
    label: 'Express API',
    x: 400,
    y: 200,
    color: '#8b5cf6',
    icon: '⬡',
    details: {
      title: 'Node.js + Express',
      description: 'RESTful API with JWT auth, rate limiting, and request tracing.',
      items: ['REST API', 'JWT Auth', 'Zod Validation', 'Rate Limiting', 'Helmet Security'],
    },
  },
  {
    id: 'mongodb',
    label: 'MongoDB Atlas',
    x: 200,
    y: 340,
    color: '#10b981',
    icon: '⬡',
    details: {
      title: 'MongoDB Database',
      description: 'NoSQL document database hosted on MongoDB Atlas.',
      items: ['Collections: Users, Tasks, Logs', 'Indexes: email, createdAt', 'Mongoose ODM', 'Atlas Free Tier'],
    },
  },
  {
    id: 's3',
    label: 'AWS S3',
    x: 600,
    y: 340,
    color: '#f59e0b',
    icon: '⬡',
    details: {
      title: 'AWS S3 Storage',
      description: 'Cloud object storage for file uploads with pre-signed URL generation.',
      items: ['Buckets: uploads', 'Pre-signed URLs', 'Multer upload', 'AWS SDK v3'],
    },
  },
  {
    id: 'redis',
    label: 'Redis + BullMQ',
    x: 400,
    y: 340,
    color: '#ef4444',
    icon: '⬡',
    details: {
      title: 'Redis + BullMQ',
      description: 'In-memory store powering background job queues.',
      items: ['Email Queue', 'File Processing Queue', 'BullMQ Workers', 'Job Status Tracking'],
    },
  },
  {
    id: 'socket',
    label: 'Socket.io',
    x: 600,
    y: 200,
    color: '#06b6d4',
    icon: '⬡',
    details: {
      title: 'WebSocket / Socket.io',
      description: 'Real-time bidirectional events pushed to the frontend.',
      items: ['Real-time events', 'API Monitor feed', 'Event Timeline', 'Connection status'],
    },
  },
];

const EDGES = [
  { from: 'frontend', to: 'api', label: 'REST' },
  { from: 'frontend', to: 'socket', label: 'WS' },
  { from: 'api', to: 'mongodb', label: 'Mongoose' },
  { from: 'api', to: 's3', label: 'AWS SDK' },
  { from: 'api', to: 'redis', label: 'BullMQ' },
  { from: 'api', to: 'socket', label: 'Events' },
];

interface ArchitectureMapProps {
  events: BackendEvent[];
}

export function ArchitectureMap({ events }: ArchitectureMapProps) {
  const [selected, setSelected] = useState<NodeDef | null>(null);

  const activeNodeIds = new Set(
    events.slice(0, 5).flatMap((e) => {
      if (e.eventType === 'auth' || e.eventType === 'api') return ['api'];
      if (e.eventType === 'database') return ['mongodb'];
      if (e.eventType === 'cloud') return ['s3'];
      if (e.eventType === 'job') return ['redis'];
      return [];
    })
  );

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 480">
        {EDGES.map((edge) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const active = activeNodeIds.has(edge.from) || activeNodeIds.has(edge.to);
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? '#3b82f6' : '#1e2d4a'}
                strokeWidth={active ? 1.5 : 1}
                strokeDasharray="5 4"
                opacity={active ? 0.7 : 0.4}
              />
              {active && (
                <motion.circle
                  r={3}
                  fill="#3b82f6"
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  style={{
                    offsetPath: `path('M ${from.x} ${from.y} L ${to.x} ${to.y}')`,
                    offsetDistance: '0%',
                  }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <text
                x={(from.x + to.x) / 2 + 6}
                y={(from.y + to.y) / 2 - 4}
                fontSize="9"
                fill="#475569"
                fontFamily="monospace"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {NODES.map((node) => {
          const isActive = activeNodeIds.has(node.id);
          const isSelected = selected?.id === node.id;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => setSelected(isSelected ? null : node)}
              style={{ cursor: 'pointer' }}
            >
              {isActive && (
                <motion.circle
                  r={28}
                  fill={node.color}
                  fillOpacity={0.08}
                  animate={{ r: [26, 34, 26] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <motion.circle
                r={22}
                fill={isSelected ? node.color : 'var(--bg-card)'}
                fillOpacity={isSelected ? 0.2 : 1}
                stroke={isSelected || isActive ? node.color : '#1e2d4a'}
                strokeWidth={isSelected ? 2 : 1}
                animate={isActive ? { stroke: [node.color, '#ffffff', node.color] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill={node.color}
              >
                {node.icon}
              </text>
              <text
                y={34}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-0 w-72"
          >
            <CardSpotlight dotColor={hexToRgb(selected.color)} className="border-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: selected.color }}>
                    {selected.details.title}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-slate-300"
                    style={{ fontSize: 'var(--text-caption)' }}
                  >
                    ✕
                  </button>
                </div>
                <p className="mb-4" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  {selected.details.description}
                </p>
                <ul className="space-y-2">
                  {selected.details.items.map((item) => (
                    <li key={item} className="flex items-center gap-2" style={{ fontSize: 'var(--text-caption)' }}>
                      <span style={{ color: selected.color }}>▸</span>
                      <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardSpotlight>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
