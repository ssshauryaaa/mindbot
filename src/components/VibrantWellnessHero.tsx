import React, { useState } from 'react';
import { CircleUserRound, Menu, X, Sun, Moon } from 'lucide-react';

/* ─── Brand SVG Logo ──────────────────────────────────────────── */
function VibrantLogo({ className = '', isDark = true }: { className?: string; isDark?: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill={isDark ? 'white' : '#0f172a'}
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-colors duration-500`}
      aria-label="Vibrant Wellness logo"
    >
      <path d="M 128 128 C 198.692 128 256 185.308 256 256 L 151.883 256 C 149.812 220.307 120.213 192 84 192 C 47.787 192 18.188 220.307 16.117 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 104.117 0 C 106.188 35.694 135.787 64 172 64 C 208.213 64 237.812 35.694 239.883 0 L 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z" />
    </svg>
  );
}

/* ─── Small Triangular Dot-Pattern Icon ───────────────────────── */
function TriDotIcon({ isDark = true }: { isDark?: boolean }) {
  const dots = [
    { top: 8, left: 8 },
    { top: 8, left: 14 },
    { top: 14, left: 5 },
    { top: 14, left: 11 },
    { top: 14, left: 17 },
    { top: 17, left: 2 },
    { top: 17, left: 8 },
    { top: 17, left: 14 },
    { top: 17, left: 20 },
  ];
  return (
    <div className="relative" style={{ width: 24, height: 24 }}>
      {dots.map((d, i) => (
        <div
          key={i}
          className={`absolute rounded-sm transition-colors duration-500 ${
            isDark ? 'bg-white/60' : 'bg-slate-900/70'
          }`}
          style={{ width: 2.5, height: 2.5, top: d.top, left: d.left }}
        />
      ))}
    </div>
  );
}

/* ─── 3×3 Checkerboard Grid Icon ─────────────────────────────── */
function CheckerGridIcon({ isDark = true }: { isDark?: boolean }) {
  const pattern = [true, false, true, false, true, false, true, false, true];
  return (
    <div className="grid grid-cols-3 gap-[2px]" style={{ width: 18, height: 18 }}>
      {pattern.map((filled, i) => (
        <div
          key={i}
          className={`rounded-sm transition-colors duration-500 ${
            filled ? (isDark ? 'bg-white/60' : 'bg-slate-900/70') : 'bg-transparent'
          }`}
          style={{ width: 4, height: 4 }}
        />
      ))}
    </div>
  );
}

/* ─── Avatar URLs ─────────────────────────────────────────────── */
const avatarUrls = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
];

/* ─── Nav Links ───────────────────────────────────────────────── */
const navLinks = [
  { label: 'Home', active: true },
  { label: 'Our Approach', active: false },
  { label: 'Healing Methods', active: false },
];

/* ─────────────────────────────────────────────────────────────── */
/*  MAIN HERO COMPONENT WITH DARK / LIGHT MODE TOGGLE               */
/* ─────────────────────────────────────────────────────────────── */
export default function VibrantWellnessHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className={`relative w-full h-screen overflow-hidden ${isDark ? '' : 'light-mode'}`}>

      {/* ── Background Video ──────────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_082433_69699cf8-444b-4484-93cc-053e57896dfd.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* ── Dynamic Vignette Overlay (Dark vs Light Ambient Glass Tint) ── */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-black/40 via-black/20 to-black/60'
            : 'bg-gradient-to-b from-white/70 via-white/45 to-white/80 backdrop-brightness-110'
        }`}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* NAVIGATION — z-20                                       */}
      {/* ════════════════════════════════════════════════════════ */}
      <nav className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 md:px-16 lg:px-20">

        {/* Left: Brand Logo */}
        <a href="#" aria-label="Vibrant Wellness home">
          <VibrantLogo isDark={isDark} className="w-8 h-8 md:w-9 md:h-9" />
        </a>

        {/* Center: Desktop nav pill */}
        <div className="hidden md:flex liquid-glass rounded-full px-8 py-3 items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`text-sm font-medium transition-colors duration-300 ${
                link.active
                  ? isDark
                    ? 'text-white'
                    : 'text-slate-950 font-semibold'
                  : isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Desktop Actions (Theme Toggle + User Avatar) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="liquid-glass h-10 px-3.5 rounded-full flex items-center gap-2 text-xs font-medium cursor-pointer transition-all duration-300 hover:scale-105"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-300 animate-spin-slow" />
                <span className="text-white/80">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-800" />
                <span className="text-slate-800">Dark</span>
              </>
            )}
          </button>

          {/* User Profile Circle */}
          <div className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center cursor-pointer">
            <CircleUserRound
              className={`h-5 w-5 transition-colors duration-300 ${
                isDark ? 'text-white/80' : 'text-slate-800'
              }`}
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Right: Mobile Controls (Theme Toggle + Hamburger) */}
        <div className="md:hidden flex items-center gap-2 relative z-50">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 text-amber-300" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-800" />
            )}
          </button>

          <button
            className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center relative cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Menu icon */}
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                isDark ? 'text-white' : 'text-slate-900'
              } ${menuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
            />
            {/* X icon */}
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                isDark ? 'text-white' : 'text-slate-900'
              } ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
            />
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════ */}
      {/* MOBILE MENU OVERLAY — z-10                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 backdrop-blur-xl transition-all duration-500 ease-out ${
          isDark ? 'bg-black/80' : 'bg-white/85'
        } ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Nav Links */}
        <div
          className={`flex flex-col items-center gap-8 transition-all duration-500 ease-out ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-medium transition-colors ${
                isDark
                  ? 'text-white/90 hover:text-white'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Account Row */}
        <div
          className={`flex items-center gap-3 transition-all duration-500 delay-75 ease-out ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="liquid-glass h-9 w-9 rounded-full flex items-center justify-center">
            <CircleUserRound
              className={`h-4 w-4 ${isDark ? 'text-white/80' : 'text-slate-800'}`}
              strokeWidth={1.5}
            />
          </div>
          <span className={`text-sm font-light ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Account
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT — z-10                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      <main
        className={`relative z-10 flex flex-col justify-between px-5 pb-10 sm:px-8 sm:pb-12 md:px-16 lg:px-20 transition-all duration-300 ${
          menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ height: 'calc(100vh - 5.5rem)' }}
      >
        {/* ── Top Content Block ─────────────────────────────── */}
        <div className="mt-14 sm:mt-20 md:mt-28 max-w-2xl">

          {/* Badge with overlapping avatars */}
          <div className="liquid-glass inline-flex items-center gap-2.5 sm:gap-3 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6">
            {/* Overlapping avatar stack */}
            <div className="flex -space-x-2">
              {avatarUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  aria-hidden="true"
                  className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 object-cover ${
                    isDark ? 'border-white/20' : 'border-slate-800/20'
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                isDark ? 'text-white/80' : 'text-slate-800'
              }`}
            >
              our path to natural wellness
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-950 font-medium'
            }`}
            style={{ lineHeight: 1.05, letterSpacing: '-0.05em' }}
          >
            Heal Your Body
            <br />
            Naturally
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-light transition-colors duration-500 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}
          >
            Holistic wellness. Transformative results.
          </p>

          {/* CTA Button */}
          <button
            className={`liquid-glass mt-6 sm:mt-8 rounded-full px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
              isDark
                ? 'text-white hover:bg-white/10'
                : 'text-slate-900 hover:bg-white/80'
            }`}
          >
            Begin Your Journey
          </button>
        </div>

        {/* ── Bottom Stats Row ──────────────────────────────── */}
        <div className="flex items-end gap-6 sm:gap-10 md:gap-16">

          {/* Stat 1: Triangular dot pattern */}
          <div className="flex flex-col gap-2">
            <TriDotIcon isDark={isDark} />
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-normal leading-none transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-slate-950 font-medium'
              }`}
            >
              48 Hours
            </p>
            <p
              className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                isDark ? 'text-white/60' : 'text-slate-600'
              }`}
            >
              Initial Consultation
            </p>
          </div>

          {/* Stat 2: Checkerboard grid icon */}
          <div className="flex flex-col gap-2">
            <CheckerGridIcon isDark={isDark} />
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-normal leading-none transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-slate-950 font-medium'
              }`}
            >
              Initial Consultation
            </p>
            <p
              className={`text-xs sm:text-sm font-light transition-colors duration-500 ${
                isDark ? 'text-white/60' : 'text-slate-600'
              }`}
            >
              Healing Sessions
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
