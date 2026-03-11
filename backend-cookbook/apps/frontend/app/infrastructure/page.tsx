'use client';

import { motion } from 'framer-motion';
import { CardSpotlight } from '@/components/ui/card-spotlight';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const stack = [
  {
    layer: 'Frontend',
    color: '#3b82f6',
    items: [
      { name: 'Next.js 15', desc: 'React framework with App Router for server + client components' },
      { name: 'TypeScript', desc: 'Type-safe JavaScript for better developer experience' },
      { name: 'TailwindCSS v4', desc: 'Utility-first CSS framework for rapid UI development' },
      { name: 'Framer Motion', desc: 'Production-ready animation library for React' },
    ],
  },
  {
    layer: 'Backend API',
    color: '#8b5cf6',
    items: [
      { name: 'Node.js v22', desc: 'JavaScript runtime built on Chrome V8 engine' },
      { name: 'Express.js', desc: 'Minimal and flexible Node.js web application framework' },
      { name: 'Socket.io', desc: 'Real-time bidirectional event-based communication' },
      { name: 'Zod', desc: 'TypeScript-first schema validation with static type inference' },
    ],
  },
  {
    layer: 'Database',
    color: '#10b981',
    items: [
      { name: 'MongoDB Atlas', desc: 'Cloud-hosted NoSQL document database (free tier)' },
      { name: 'Mongoose', desc: 'MongoDB object modeling for Node.js' },
      { name: 'Collections', desc: 'Users, Tasks, Logs with proper indexing' },
    ],
  },
  {
    layer: 'Cloud & Queue',
    color: '#f59e0b',
    items: [
      { name: 'AWS S3', desc: 'Object storage for file uploads with pre-signed URL access' },
      { name: 'Redis', desc: 'In-memory data store for job queues and caching' },
      { name: 'BullMQ', desc: 'Production-ready Node.js job queue built on Redis' },
    ],
  },
  {
    layer: 'Security',
    color: '#06b6d4',
    items: [
      { name: 'JWT', desc: 'Stateless authentication tokens — a secure key proving you are logged in' },
      { name: 'bcrypt', desc: 'One-way password hashing — passwords are never stored in plain text' },
      { name: 'Helmet.js', desc: 'Sets secure HTTP response headers automatically' },
      { name: 'Rate Limiting', desc: 'Limits repeated requests to prevent abuse and DDoS attacks' },
    ],
  },
  {
    layer: 'Infrastructure',
    color: '#ec4899',
    items: [
      { name: 'Docker', desc: 'Containerizes the app for consistent local and production environments' },
      { name: 'Vercel', desc: 'Frontend deployment with global CDN and automatic HTTPS' },
      { name: 'Render / Railway', desc: 'Backend deployment with managed Node.js hosting' },
      { name: 'GitHub Actions', desc: 'CI/CD pipeline for automated linting and type-checking' },
    ],
  },
];

export default function InfrastructurePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <h1 className="font-bold mb-2" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
          Infrastructure
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
          Full tech stack overview — what each piece does and why it was chosen.
        </p>
      </motion.div>

      <div className="space-y-6" style={{ gap: 'var(--space-6)' }}>
        {stack.map((layer, i) => (
          <motion.div
            key={layer.layer}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <CardSpotlight dotColor={hexToRgb(layer.color)} className="overflow-hidden">
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'var(--border)', backgroundColor: `${layer.color}10` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: layer.color }}>
                  {layer.layer}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: 'var(--border)' }}>
                {layer.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-5"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  >
                    <p className="font-semibold mb-2" style={{ fontSize: 'var(--text-body)', color: layer.color }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-[var(--radius-card)] border p-6 mt-10"
        style={{ borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.04)', marginTop: 'var(--space-12)' }}
      >
        <h3 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--accent)' }}>
          Why this stack?
        </h3>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
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
