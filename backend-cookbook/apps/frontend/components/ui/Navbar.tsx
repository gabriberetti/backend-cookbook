'use client';

import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 16); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: scrolled ? 'rgba(10, 14, 26, 0.92)' : 'rgba(10, 14, 26, 0.75)',
        borderColor: scrolled ? 'rgba(255,255,255,0.09)' : 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.45)'
          : '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.3)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="font-bold tracking-tight font-mono"
            style={{ fontSize: 'var(--text-h3)' }}
          >
            <span style={{ color: 'var(--accent)' }}>{'{'}</span>
            <span style={{ color: 'var(--text-primary)' }}> Backend </span>
            <span style={{ color: 'var(--accent-emerald)' }}>Cookbook</span>
            <span style={{ color: 'var(--accent)' }}>{' }'}</span>
          </span>
        </Link>

        {/* Desktop nav */}
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
                className="relative px-3 py-1.5 rounded-[var(--radius-button)] transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 'var(--text-caption)',
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-[var(--radius-button)]"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.13)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: '0 0 12px rgba(59, 130, 246, 0.1)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side: live indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.18)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent-emerald)',
                boxShadow: '0 0 6px var(--accent-emerald)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            <span
              className="font-mono font-medium"
              style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}
            >
              Live
            </span>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-[var(--radius-button)] border shrink-0 transition-colors"
          style={{
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
            backgroundColor: mobileOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div animate={mobileOpen ? 'open' : 'closed'}>
            {mobileOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t overflow-hidden"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.06)',
              backgroundColor: 'rgba(10, 14, 26, 0.96)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
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
                    className={cn('px-4 py-3 rounded-[var(--radius-button)] transition-colors')}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      fontSize: 'var(--text-body)',
                      border: isActive ? '1px solid rgba(59,130,246,0.18)' : '1px solid transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* Live badge in mobile menu */}
              <div className="px-4 pt-2 pb-1">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.18)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent-emerald)', boxShadow: '0 0 6px var(--accent-emerald)' }}
                  />
                  <span className="font-mono font-medium" style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>
                    Live
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
