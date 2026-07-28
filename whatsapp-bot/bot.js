/**
 * Synaptica WhatsApp Bot
 * ─────────────────────
 * Connects to WhatsApp via whatsapp-web.js (no Meta Business API needed).
 * Uses your existing OpenRouter API key to call Synaptica AI.
 *
 * SETUP:
 *   1. cd whatsapp-bot
 *   2. npm install
 *   3. node bot.js
 *   4. Scan the QR code with WhatsApp → Linked Devices → Link a Device
 *
 * Once connected, anyone who messages your WhatsApp number gets a
 * full Synaptica AI (Logic + Empathy dual-stream) response.
 */

require('dotenv').config({ path: '../.env' });
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');

// ── Config ────────────────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free model chain — tries in order if one is rate-limited
const FREE_MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

// Per-user conversation history (last 8 turns) keyed by WhatsApp phone number
const conversationHistory = {};

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Synaptica, an expert AI & Human Duality Intelligence System.

You synthesize two distinct streams of thought:
1. Machine Logic — analytical data, facts, step-by-step structure.
2. Human Empathy — emotional intelligence, practical perspective, real-world trade-offs.

Respond ONLY in plain conversational text. No JSON, no markdown fences, no asterisks, no bullet symbols with special characters.
Use simple numbered lists or line breaks for structure since this is WhatsApp.
Keep responses concise (max 3-4 paragraphs). Lead with the core answer, then briefly add the human perspective.
Start every response with a one-line "⚡ Logic:" and "🫀 Empathy:" indicator.
Never mention AI internals, confidence scores, or model names.`;

// ── AI Response Function ───────────────────────────────────────────────────────
async function getSynapticaResponse(userMessage, history = []) {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

  // Add last 8 history turns
  history.slice(-8).forEach(h => {
    messages.push({ role: h.role, content: h.content });
  });

  messages.push({ role: 'user', content: userMessage });

  for (const model of FREE_MODELS) {
    try {
      console.log(`[Synaptica] Trying model: ${model}`);
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
          'HTTP-Referer': 'https://mindbot.vercel.app',
          'X-Title': 'Synaptica WhatsApp Bot',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (res.status === 429 || res.status === 404) {
        console.warn(`[Synaptica] Model ${model} skipped (HTTP ${res.status})`);
        continue;
      }

      if (!res.ok) {
        console.warn(`[Synaptica] Model ${model} error (HTTP ${res.status})`);
        continue;
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;

      if (!content || content.trim().length < 10) {
        console.warn(`[Synaptica] Model ${model} returned empty content`);
        continue;
      }

      console.log(`[Synaptica] ✅ Got response from ${model}`);
      return content.trim();

    } catch (err) {
      console.warn(`[Synaptica] Model ${model} threw: ${err.message}`);
    }
  }

  return '⚠️ Synaptica is temporarily unavailable. Please try again in a moment.';
}

// ── WhatsApp Client Setup ──────────────────────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  },
});

// Print QR code in the terminal for scanning
client.on('qr', (qr) => {
  console.log('\n\n📱 Scan this QR code with WhatsApp → Linked Devices → Link a Device:\n');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('[Synaptica] ✅ WhatsApp authenticated!');
});

client.on('auth_failure', (msg) => {
  console.error('[Synaptica] ❌ Authentication failed:', msg);
});

client.on('ready', () => {
  console.log('\n[Synaptica] 🤖 WhatsApp Bot is LIVE and ready to receive messages!\n');
});

// ── Message Handler ────────────────────────────────────────────────────────────
client.on('message', async (msg) => {
  // Ignore group messages, status updates, and messages from the bot itself
  if (msg.from === 'status@broadcast') return;
  if (msg.fromMe) return;

  const sender = msg.from;
  const userText = msg.body?.trim();

  if (!userText) return;

  console.log(`[Synaptica] 📩 Message from ${sender}: "${userText}"`);

  // Initialize history for new users
  if (!conversationHistory[sender]) {
    conversationHistory[sender] = [];
  }

  // Add user message to history
  conversationHistory[sender].push({ role: 'user', content: userText });

  // Show "typing..." indicator (safely wrapped)
  try {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
  } catch (e) {
    console.warn('[Synaptica] Could not set typing state:', e.message);
  }

  try {
    const aiReply = await getSynapticaResponse(userText, conversationHistory[sender]);

    // Add AI reply to history
    conversationHistory[sender].push({ role: 'assistant', content: aiReply });

    // Keep history at max 16 turns (8 user + 8 AI)
    if (conversationHistory[sender].length > 16) {
      conversationHistory[sender] = conversationHistory[sender].slice(-16);
    }

    // Send reply back to WhatsApp
    await msg.reply(aiReply);
    console.log(`[Synaptica] ✅ Replied to ${sender}`);

  } catch (err) {
    console.error('[Synaptica] Error generating reply:', err);
    await msg.reply('⚠️ Sorry, I ran into an error. Please try again!');
  }
});

client.on('disconnected', (reason) => {
  console.log('[Synaptica] ❌ Disconnected:', reason);
  console.log('[Synaptica] Restarting...');
  client.initialize();
});

// ── Start ──────────────────────────────────────────────────────────────────────
console.log('[Synaptica] 🚀 Starting Synaptica WhatsApp Bot...');
console.log('[Synaptica] Using OpenRouter API Key:', OPENROUTER_API_KEY ? '✅ Found' : '❌ NOT FOUND');
client.initialize();
