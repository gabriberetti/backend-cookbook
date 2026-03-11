'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/modules', label: 'Modules' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/api-monitor', label: 'API Monitor' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/console', label: 'Console' },
  { href: '/infrastructure', label: 'Infrastructure' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'rgba(10, 14, 26, 0.72)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold tracking-tight" style={{ fontSize: 'var(--text-h3)', color: 'var(--accent)' }}>
            {'{ '}
            <span style={{ color: 'var(--text-primary)' }}>Backend</span>
            <span style={{ color: 'var(--accent)' }}> Cookbook</span>
            {' }'}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/modules'
                ? pathname.startsWith('/modules')
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-[var(--radius-button)] transition-colors"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--text-caption)',
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-[var(--radius-button)]"
                    style={{ backgroundColor: 'rgba(59,130,246,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-button)] border shrink-0"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <span className="text-lg leading-none">×</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(10, 14, 26, 0.95)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/modules'
                    ? pathname.startsWith('/modules')
                    : pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-[var(--radius-button)]',
                      isActive && 'bg-[var(--accent)]/15'
                    )}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: 'var(--text-body)',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
