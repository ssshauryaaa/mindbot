import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar({ onLaunchClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Magnetic button hover effect for primary CTA
  const ctaRef = useRef(null);
  const [ctaPos, setCtaPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaMouseMove = (e) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setCtaPos({ x, y });
  };

  const handleCtaMouseLeave = () => {
    setCtaPos({ x: 0, y: 0 });
  };

  const navLinks = [
    { name: 'Duality Concept', href: '#concept' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Live Preview', href: '#preview' },
    { name: 'Use Cases', href: '#use-cases' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass-nav py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Animated Synapse Logo */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-synapse-500 rounded-lg p-1">
          <div className="relative w-9 h-9 flex items-center justify-center">
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-500 to-human-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* SVG Synapse Mark */}
            <svg viewBox="0 0 40 40" className="w-9 h-9 relative z-10">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="50%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#B24BF3" />
                </linearGradient>
              </defs>
              
              {/* Connecting Neuron Line with traveling pulse */}
              <line x1="8" y1="20" x2="32" y2="20" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Pulsing Light Beam */}
              <circle cx="20" cy="20" r="2" fill="#F5F6FA">
                <animate
                  attributeName="cx"
                  values="8;32;8"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Node 1 - AI (Cyan) */}
              <circle cx="8" cy="20" r="5" fill="#00D4FF" className="animate-pulse" />
              <circle cx="8" cy="20" r="8" fill="none" stroke="#00D4FF" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Node 2 - Human (Violet) */}
              <circle cx="32" cy="20" r="5" fill="#B24BF3" className="animate-pulse" />
              <circle cx="32" cy="20" r="8" fill="none" stroke="#B24BF3" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" begin="1s" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-white tracking-wider">
              SYNAPTICA
            </span>
            <span className="text-[10px] tracking-widest text-ai-400 font-mono uppercase -mt-1">
              Duality of Mind
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-void-900/60 border border-void-700/60 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-void-800/80"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Magnetic CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            animate={{ x: ctaPos.x, y: ctaPos.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={onLaunchClick}
            className="btn-duality px-5 py-2.5 text-xs tracking-wide flex items-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-ai-400 group-hover:rotate-12 transition-transform" />
            <span>Launch Synaptica</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-void-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 top-[60px] bg-void-950/95 backdrop-blur-2xl z-30 flex flex-col justify-between p-6 border-t border-void-700"
          >
            <div className="flex flex-col gap-6 pt-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  className="font-heading text-2xl font-semibold text-white/90 hover:text-ai-400 flex items-center justify-between border-b border-void-800 pb-4"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-gray-600" />
                </motion.a>
              ))}
            </div>

            <div className="pb-12">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchClick();
                }}
                className="w-full btn-duality py-4 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-ai-400" />
                <span>Launch Synaptica App</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
