'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServerNode {
  id: string;
  label: string;
  requests: number;
  load: number;
  active: boolean;
}

interface RequestBubble {
  id: string;
  serverId: string;
  status: 'routing' | 'processing' | 'done';
}

const INITIAL_SERVERS: ServerNode[] = [
  { id: 'server-1', label: 'API Server 1', requests: 0, load: 0, active: false },
  { id: 'server-2', label: 'API Server 2', requests: 0, load: 0, active: false },
  { id: 'server-3', label: 'API Server 3', requests: 0, load: 0, active: false },
];

export function DistributedSimulation() {
  const [servers, setServers] = useState<ServerNode[]>(INITIAL_SERVERS);
  const [requests, setRequests] = useState<RequestBubble[]>([]);
  const [running, setRunning] = useState(false);
  const [totalRouted, setTotalRouted] = useState(0);
  const counterRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function getNextServer(serverList: ServerNode[]): string {
    const minLoad = Math.min(...serverList.map((s) => s.load));
    const available = serverList.filter((s) => s.load === minLoad);
    return available[Math.floor(Math.random() * available.length)]!.id;
  }

  function sendRequest() {
    counterRef.current += 1;
    const reqId = `req-${counterRef.current}`;

    setServers((prev) => {
      const serverId = getNextServer(prev);

      setRequests((reqs) => [
        ...reqs.slice(-20),
        { id: reqId, serverId, status: 'routing' },
      ]);

      setTimeout(() => {
        setRequests((reqs) =>
          reqs.map((r) => (r.id === reqId ? { ...r, status: 'processing' } : r))
        );
        setServers((s) =>
          s.map((srv) =>
            srv.id === serverId ? { ...srv, active: true, load: srv.load + 10 } : srv
          )
        );

        setTimeout(() => {
          setRequests((reqs) =>
            reqs.map((r) => (r.id === reqId ? { ...r, status: 'done' } : r))
          );
          setServers((s) =>
            s.map((srv) =>
              srv.id === serverId
                ? { ...srv, requests: srv.requests + 1, active: false, load: Math.max(0, srv.load - 10) }
                : srv
            )
          );
          setTotalRouted((t) => t + 1);

          setTimeout(() => {
            setRequests((reqs) => reqs.filter((r) => r.id !== reqId));
          }, 600);
        }, 600);
      }, 300);

      return prev;
    });
  }

  function toggleSimulation() {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(sendRequest, 800);
    }
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setServers(INITIAL_SERVERS);
    setRequests([]);
    setTotalRouted(0);
    counterRef.current = 0;
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const SERVER_COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Distributed System Simulation
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Watch load balancing route requests across 3 API servers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            {totalRouted} routed
          </span>
          <button
            onClick={reset}
            className="px-2.5 py-1 rounded text-xs border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Reset
          </button>
          <button
            onClick={toggleSimulation}
            className="px-3 py-1 rounded text-xs font-semibold"
            style={{
              backgroundColor: running ? '#ef4444' : '#10b981',
              color: '#fff',
            }}
          >
            {running ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center gap-2 pt-6">
          <div
            className="rounded-lg border px-3 py-2 text-xs font-mono text-center"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', minWidth: 80 }}
          >
            Client
          </div>
          <div className="w-px h-4" style={{ backgroundColor: 'var(--border)' }} />
          <div
            className="rounded-lg border px-3 py-2 text-xs font-mono text-center"
            style={{
              borderColor: running ? '#3b82f6' : 'var(--border)',
              color: running ? '#3b82f6' : 'var(--text-secondary)',
              minWidth: 80,
              backgroundColor: running ? 'rgba(59,130,246,0.08)' : 'transparent',
            }}
          >
            Load Balancer
          </div>
          <div className="w-px h-4" style={{ backgroundColor: 'var(--border)' }} />
          <div className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            ↙ ↓ ↘
          </div>
        </div>

        <div className="flex gap-4 flex-1">
          {servers.map((server, i) => (
            <motion.div
              key={server.id}
              animate={server.active ? { borderColor: SERVER_COLORS[i] } : {}}
              className="flex-1 rounded-lg border p-3 text-center"
              style={{
                borderColor: server.active ? SERVER_COLORS[i] : 'var(--border)',
                backgroundColor: server.active ? `${SERVER_COLORS[i]}08` : 'transparent',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: SERVER_COLORS[i] }}>
                {server.label}
              </div>

              <div className="h-1.5 rounded-full mb-2 overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${server.load}%` }}
                  style={{ backgroundColor: SERVER_COLORS[i] }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                {server.requests} req
              </div>

              <div className="mt-2 h-6 flex items-center justify-center">
                <AnimatePresence>
                  {requests.filter((r) => r.serverId === server.id && r.status !== 'done').map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-2 h-2 rounded-full mx-0.5"
                      style={{ backgroundColor: SERVER_COLORS[i] }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          The load balancer uses a least-connections algorithm — routing each new request to the server with the lowest current load. This is how production systems like Nginx and AWS ALB handle horizontal scaling.
        </p>
      </div>
    </div>
  );
}
