// api/whatsapp.js
// Vercel Serverless Function to handle WhatsApp Cloud API webhook

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// System prompt adapted for WhatsApp chat flow
const SYSTEM_PROMPT = `You are Synaptica, an expert AI & Human Duality Intelligence System.

You synthesize two distinct streams of thought:
1. Machine Logic — analytical data, facts, step-by-step structure.
2. Human Empathy — emotional intelligence, practical perspective, real-world trade-offs.

Respond ONLY in plain conversational text. No JSON, no markdown fences, no asterisks, no bullet symbols with special characters.
Use simple numbered lists or line breaks for structure since this is WhatsApp.
Keep responses concise (max 3-4 paragraphs). Lead with the core answer, then briefly add the human perspective.
Start every response with a one-line "⚡ Logic:" and "🫀 Empathy:" indicator.
Never mention AI internals, confidence scores, or model names.`;

// Call OpenRouter Free models
async function getAIResponse(userMessage) {
  const API_KEY = process.env.VITE_OPENROUTER_API_KEY;
  if (!API_KEY) {
    console.error('Missing VITE_OPENROUTER_API_KEY env variable');
    return '⚠️ System Configuration Error: Missing API Key.';
  }

  // Fallback chain
  const models = [
    'openrouter/free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-2-9b-it:free',
  ];

  for (const model of models) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY.trim()}`,
          'HTTP-Referer': 'https://mindbot.vercel.app',
          'X-Title': 'Synaptica WhatsApp Bot',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!res.ok) continue;

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (content) return content.trim();
    } catch (err) {
      console.error(`Error with model ${model}:`, err.message);
    }
  }
  return '⚠️ Synaptica service is temporarily unavailable. Please try again.';
}

export default async function handler(req, res) {
  // 1. WEBHOOK VERIFICATION (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Retrieve token from environment variables
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('Webhook Verified successfully!');
        return res.status(200).send(challenge);
      }
      return res.status(403).send('Forbidden: Token mismatch');
    }
    return res.status(400).send('Bad Request');
  }

  // 2. INCOMING MESSAGES (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Extract message content
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const val = change?.value;

      if (val && val.messages && val.messages[0]) {
        const message = val.messages[0];
        const userPhone = message.from;
        const userText = message.text?.body;

        if (userText) {
          console.log(`Received message from ${userPhone}: "${userText}"`);

          // Get response from OpenRouter
          const replyText = await getAIResponse(userText);

          // Send WhatsApp reply using Meta API
          const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
          const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

          const whatsappRes = await fetch(
            `https://graph.facebook.com/v18.0/${phoneId}/messages`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: userPhone,
                type: 'text',
                text: { body: replyText },
              }),
            }
          );

          if (!whatsappRes.ok) {
            const errData = await whatsappRes.json();
            console.error('Meta API Error:', JSON.stringify(errData));
          } else {
            console.log(`Successfully replied to ${userPhone}`);
          }
        }
      }

      // Return 200 OK to Meta so they don't keep retrying the webhook
      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Webhook Handler Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  return res.status(405).send('Method Not Allowed');
}
