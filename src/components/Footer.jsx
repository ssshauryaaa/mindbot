import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Globe, Share2, Code, Terminal } from 'lucide-react';

export default function Footer({ onLaunchClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-void-950 border-t border-void-700/80 text-gray-400 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-void-800">
          
          {/* Col 1 & 2: Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <a href="#" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <line x1="8" y1="20" x2="32" y2="20" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="8" cy="20" r="5" fill="#00D4FF" className="animate-pulse" />
                  <circle cx="32" cy="20" r="5" fill="#B24BF3" className="animate-pulse" />
                </svg>
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-wider">
                SYNAPTICA
              </span>
            </a>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed font-body">
              The AI co-pilot designed around the duality of human intuition and artificial precision. Built for researchers, engineers, and creators.
            </p>

            {/* Newsletter Input Form */}
            <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
              <label htmlFor="newsletter-email" className="text-xs font-mono text-gray-300 block font-semibold">
                Subscribe to Research Updates
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email..."
                  required
                  className="flex-1 bg-void-900 border border-void-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-synapse-500 transition-all"
                />
                <button
                  type="submit"
                  className="btn-duality px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center cursor-pointer shrink-0"
                >
                  {subscribed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Send className="w-4 h-4 text-white" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-mono text-ai-400">
                  ✓ Subscribed! You will receive our monthly duality whitepaper.
                </p>
              )}
            </form>
          </div>

          {/* Col 3: Product Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#concept" className="hover:text-white transition-colors">Duality Concept</a></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">Bento Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#preview" className="hover:text-white transition-colors">Live Preview Interface</a></li>
              <li><button onClick={onLaunchClick} className="hover:text-synapse-400 transition-colors text-left">Launch Workspace</button></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Resources & Docs
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & Transparency</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Academic Research</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog v1.0.8</a></li>
            </ul>
          </div>

          {/* Col 5: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Community
            </h4>
            <div className="flex gap-3 text-gray-400">
              <a href="#" aria-label="GitHub" className="p-2.5 rounded-xl bg-void-900 border border-void-800 hover:text-white hover:border-synapse-500 transition-all">
                <Code className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter / X" className="p-2.5 rounded-xl bg-void-900 border border-void-800 hover:text-white hover:border-ai-400 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Discord" className="p-2.5 rounded-xl bg-void-900 border border-void-800 hover:text-white hover:border-human-400 transition-all">
                <Terminal className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-void-900 border border-void-800 hover:text-white hover:border-synapse-500 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal pt-2 font-mono">
              Designed with WCAG 2.1 AA accessibility standards & ultra-low latency R3F pipelines.
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div>
            © {new Date().getFullYear()} SYNAPTICA Inc. All rights reserved. Duality of Mind™.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-ai-400">
              <span className="w-2 h-2 rounded-full bg-ai-500 animate-pulse" />
              Systems Operational
            </span>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
