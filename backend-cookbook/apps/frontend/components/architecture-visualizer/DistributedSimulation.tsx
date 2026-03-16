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
  { id: 'server-1', label: 'API-1', requests: 0, load: 0, active: false },
  { id: 'server-2', label: 'API-2', requests: 0, load: 0, active: false },
  { id: 'server-3', label: 'API-3', requests: 0, load: 0, active: false },
];

const SERVER_COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

function getNextServer(serverList: ServerNode[]): string {
  const minLoad = Math.min(...serverList.map((s) => s.load));
  const available = serverList.filter((s) => s.load === minLoad);
  return available[Math.floor(Math.random() * available.length)]!.id;
}

export function DistributedSimulation() {
  const [servers, setServers]       = useState<ServerNode[]>(INITIAL_SERVERS);
  const [requests, setRequests]     = useState<RequestBubble[]>([]);
  const [running, setRunning]       = useState(false);
  const [totalRouted, setTotalRouted] = useState(0);
  const counterRef  = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function sendRequest() {
    counterRef.current += 1;
    const reqId = `req-${counterRef.current}`;

    setServers((prev) => {
      const serverId = getNextServer(prev);

      setRequests((reqs) => [...reqs.slice(-20), { id: reqId, serverId, status: 'routing' }]);

      setTimeout(() => {
        setRequests((reqs) => reqs.map((r) => r.id === reqId ? { ...r, status: 'processing' } : r));
        setServers((s) => s.map((srv) => srv.id === serverId ? { ...srv, active: true, load: srv.load + 10 } : srv));

        setTimeout(() => {
          setRequests((reqs) => reqs.map((r) => r.id === reqId ? { ...r, status: 'done' } : r));
          setServers((s) => s.map((srv) => srv.id === serverId
            ? { ...srv, requests: srv.requests + 1, active: false, load: Math.max(0, srv.load - 10) }
            : srv
          ));
          setTotalRouted((t) => t + 1);
          setTimeout(() => { setRequests((reqs) => reqs.filter((r) => r.id !== reqId)); }, 500);
        }, 600);
      }, 300);

      return prev;
    });
  }

  function toggle() {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(sendRequest, 750);
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

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.015)' }}
      >
        <div className="flex items-center gap-3">
          {/* Load balancer icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: running ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${running ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={running ? '#3b82f6' : '#475569'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>
              Distributed Load Balancer
            </h3>
            <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              least-connections routing · {totalRouted} requests processed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-lg border font-mono transition-all hover:bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontSize: '12px' }}
          >
            Reset
          </button>
          <button
            onClick={toggle}
            className="px-4 py-1.5 rounded-lg font-semibold transition-all"
            style={{
              background: running
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: '13px',
              boxShadow: running ? '0 0 16px rgba(239,68,68,0.25)' : '0 0 16px rgba(16,185,129,0.25)',
              border: `1px solid ${running ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
            }}
          >
            {running ? (
              <span className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="1" width="3" height="8" rx="1" /><rect x="6" y="1" width="3" height="8" rx="1" /></svg>
                Stop
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4z" /></svg>
                Start
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="p-6">
        <div className="flex items-start gap-4">

          {/* Left: Client + LB column */}
          <div className="flex flex-col items-center gap-0 shrink-0" style={{ minWidth: 90 }}>
            {/* Client node */}
            <div
              className="w-full text-center rounded-xl border py-2.5 px-3 font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <div className="mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              Client
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center gap-0.5 py-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-px h-2 rounded-full"
                  style={{ backgroundColor: running ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)' }}
                  animate={running ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>

            {/* Load balancer node */}
            <div
              className="w-full text-center rounded-xl border py-2.5 px-3 font-mono transition-all"
              style={{
                fontSize: '12px',
                color: running ? '#3b82f6' : 'var(--text-secondary)',
                borderColor: running ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.1)',
                backgroundColor: running ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
                boxShadow: running ? '0 0 16px rgba(59,130,246,0.1)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                  <path d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              Load Balancer
            </div>

            {/* Fan-out arrows */}
            <div className="py-1.5 font-mono" style={{ fontSize: '14px', color: running ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.15)' }}>
              ↙&nbsp;↓&nbsp;↘
            </div>
          </div>

          {/* Right: Server columns */}
          <div className="flex gap-3 flex-1">
            {servers.map((server, i) => {
              const color = SERVER_COLORS[i]!;
              const pending = requests.filter((r) => r.serverId === server.id && r.status !== 'done');

              return (
                <div key={server.id} className="flex-1 flex flex-col gap-2">
                  {/* Server card */}
                  <div
                    className="rounded-xl border p-4 text-center transition-all"
                    style={{
                      borderColor: server.active ? `${color}45` : 'rgba(255,255,255,0.08)',
                      backgroundColor: server.active ? `${color}08` : 'rgba(255,255,255,0.02)',
                      boxShadow: server.active ? `0 0 20px ${color}12` : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {/* Server icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
                        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
                      </svg>
                    </div>

                    <p className="font-mono font-semibold mb-2.5" style={{ fontSize: '12px', color }}>
                      {server.label}
                    </p>

                    {/* Load bar */}
                    <div className="h-1.5 rounded-full mb-2 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${Math.min(server.load, 100)}%` }}
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {server.requests} handled
                    </p>

                    {/* Active request dots */}
                    <div className="mt-2.5 h-5 flex items-center justify-center gap-1">
                      <AnimatePresence>
                        {pending.map((r) => (
                          <motion.div
                            key={r.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer explanation */}
        <div
          className="mt-5 pt-5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <p className="font-mono mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            // Least-connections algorithm
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Each new request is routed to the server with the lowest active connection count. This mirrors how Nginx and AWS ALB handle horizontal scaling — keeping load distributed evenly without overloading any single instance.
          </p>
        </div>
      </div>
    </div>
  );
}
