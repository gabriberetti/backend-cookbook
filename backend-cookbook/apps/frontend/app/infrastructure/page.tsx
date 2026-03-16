'use client';

import { motion } from 'framer-motion';
import { CardSpotlight } from '@/components/ui/card-spotlight';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Layer icon SVGs
function LayerIcon({ layer, color }: { layer: string; color: string }) {
  const s = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (layer) {
    case 'Frontend':
      return <svg {...s}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
    case 'Backend API':
      return <svg {...s}><path d="M2 12h20M12 2l8 10-8 10" /></svg>;
    case 'Database':
      return <svg {...s}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 5v14c0 1.66-4.03 3-9 3S3 20.66 3 19V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>;
    case 'Cloud & Queue':
      return <svg {...s}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>;
    case 'Security':
      return <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case 'Infrastructure':
      return <svg {...s}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>;
    default:
      return <svg {...s}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

const stack = [
  {
    layer: 'Frontend',
    color: '#3b82f6',
    items: [
      { name: 'Next.js 15',       desc: 'React framework with App Router for server + client components' },
      { name: 'TypeScript',       desc: 'Type-safe JavaScript for better developer experience' },
      { name: 'TailwindCSS v4',   desc: 'Utility-first CSS framework for rapid UI development' },
      { name: 'Framer Motion',    desc: 'Production-ready animation library for React' },
    ],
  },
  {
    layer: 'Backend API',
    color: '#8b5cf6',
    items: [
      { name: 'Node.js v22',  desc: 'JavaScript runtime built on Chrome V8 engine' },
      { name: 'Express.js',   desc: 'Minimal and flexible Node.js web application framework' },
      { name: 'Socket.io',    desc: 'Real-time bidirectional event-based communication' },
      { name: 'Zod',          desc: 'TypeScript-first schema validation with static type inference' },
    ],
  },
  {
    layer: 'Database',
    color: '#10b981',
    items: [
      { name: 'MongoDB Atlas', desc: 'Cloud-hosted NoSQL document database (free tier)' },
      { name: 'Mongoose',      desc: 'MongoDB object modeling for Node.js' },
      { name: 'Collections',   desc: 'Users, Tasks, Logs with proper indexing' },
    ],
  },
  {
    layer: 'Cloud & Queue',
    color: '#f59e0b',
    items: [
      { name: 'AWS S3',   desc: 'Object storage for file uploads with pre-signed URL access' },
      { name: 'Redis',    desc: 'In-memory data store for job queues and caching' },
      { name: 'BullMQ',  desc: 'Production-ready Node.js job queue built on Redis' },
    ],
  },
  {
    layer: 'Security',
    color: '#06b6d4',
    items: [
      { name: 'JWT',          desc: 'Stateless authentication tokens — a secure key proving you are logged in' },
      { name: 'bcrypt',       desc: 'One-way password hashing — passwords are never stored in plain text' },
      { name: 'Helmet.js',    desc: 'Sets secure HTTP response headers automatically' },
      { name: 'Rate Limiting', desc: 'Limits repeated requests to prevent abuse and DDoS attacks' },
    ],
  },
  {
    layer: 'Infrastructure',
    color: '#ec4899',
    items: [
      { name: 'Docker',             desc: 'Containerizes the app for consistent local and production environments' },
      { name: 'Vercel',             desc: 'Frontend deployment with global CDN and automatic HTTPS' },
      { name: 'Render / Railway',   desc: 'Backend deployment with managed Node.js hosting' },
      { name: 'GitHub Actions',     desc: 'CI/CD pipeline for automated linting and type-checking' },
    ],
  },
];

export default function InfrastructurePage() {
  return (
    <div className="max-w-5xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#ec4899', letterSpacing: '0.06em' }}>
          // 6 layers · production-grade architecture
        </p>
        <h1 className="font-bold mb-2" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
          Infrastructure
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: 520 }}>
          Full tech stack overview — what each piece does and why it was chosen.
        </p>
      </motion.div>

      {/* Stack layers */}
      <div className="space-y-5">
        {stack.map((layer, i) => (
          <motion.div
            key={layer.layer}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardSpotlight dotColor={hexToRgb(layer.color)} className="overflow-hidden">
              {/* Layer header */}
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{
                  borderColor: `${layer.color}18`,
                  background: `linear-gradient(135deg, ${layer.color}10 0%, transparent 60%)`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${layer.color}18`, border: `1px solid ${layer.color}28` }}
                >
                  <LayerIcon layer={layer.layer} color={layer.color} />
                </div>
                <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: layer.color }}>
                  {layer.layer}
                </h2>
                <div
                  className="ml-auto font-mono px-2 py-0.5 rounded-full"
                  style={{ fontSize: '10px', color: layer.color, backgroundColor: `${layer.color}12`, border: `1px solid ${layer.color}20` }}
                >
                  {layer.items.length} services
                </div>
              </div>

              {/* Items grid */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-px"
                style={{ backgroundColor: `${layer.color}08` }}
              >
                {layer.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 group"
                    style={{ backgroundColor: 'var(--bg-card)', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = `${layer.color}05`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--bg-card)'; }}
                  >
                    <p className="font-semibold mb-1.5" style={{ fontSize: 'var(--text-body)', color: layer.color }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>

      {/* Why this stack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-[var(--radius-card)] border p-6 mt-10"
        style={{
          borderColor: 'rgba(59,130,246,0.18)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 70%), var(--bg-card)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--accent)' }}>
            Why this stack?
          </h3>
        </div>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          This stack mirrors what you find in modern production environments. Node.js and Express are the
          most common backend stack for JavaScript engineers. MongoDB is the dominant NoSQL database.
          AWS S3 is the industry standard for file storage. Redis + BullMQ handle async processing
          the same way Netflix, Airbnb, and GitHub do it. All services run on free tiers, making this
          project fully deployable at zero cost.
        </p>
      </motion.div>
    </div>
  );
}
