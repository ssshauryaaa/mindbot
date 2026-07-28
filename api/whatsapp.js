// api/whatsapp.js
// Vercel Serverless Function to handle WhatsApp Cloud API webhook

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// System prompt adapted for WhatsApp chat flow
const SYSTEM_PROMPT = `You are PyroBot, an expert AI & Human Duality Intelligence System.

You synthesize two distinct streams of thought:
1. Machine Logic — analytical data, facts, step-by-step structure.
2. Human Empathy — emotional intelligence, practical perspective, real-world trade-offs.

Respond ONLY in plain conversational text. No JSON, no markdown fences, no asterisks, no bullet symbols with special characters.
Use simple numbered lists or line breaks for structure since this is WhatsApp.
Keep responses concise (max 3-4 paragraphs). Lead with the core answer, then briefly add the human perspective.
Start every response with a one-line "⚡ Logic:" and "🫀 Empathy:" indicator.
Never mention AI internals, confidence scores, or model names.`;

// Call OpenRouter Free models
// Call OpenRouter Free models
async function getAIResponse(userMessage) {
  const API_KEY = process.env.VITE_OPENROUTER_API_KEY;
  console.log('[AI CONFIG] Using API Key (first 8 chars):', API_KEY ? `${API_KEY.slice(0, 8)}...` : 'MISSING');

  if (!API_KEY) {
    console.error('[AI ERROR] Missing VITE_OPENROUTER_API_KEY env variable');
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
      console.log(`[AI REQUEST] Requesting response from model: ${model}`);
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY.trim()}`,
          'HTTP-Referer': 'https://pyrobot-chat.vercel.app',
          'X-Title': 'Pyrobot WhatsApp Bot',
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

      console.log(`[AI RESPONSE] Model ${model} returned status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[AI RESPONSE ERROR] Model ${model} failed:`, errorText);
        continue;
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (content) {
        console.log(`[AI SUCCESS] Got reply content (first 50 chars): "${content.slice(0, 50)}..."`);
        return content.trim();
      }
    } catch (err) {
      console.error(`[AI EXCEPTION] Error with model ${model}:`, err.message);
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

    console.log('[WEBHOOK GET] Verification request received.');
    console.log('[WEBHOOK GET] mode:', mode);
    console.log('[WEBHOOK GET] token:', token);

    // Retrieve token from environment variables
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    console.log('[WEBHOOK GET] Expected verifyToken:', verifyToken);

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('[WEBHOOK GET SUCCESS] Webhook verified successfully!');
        return res.status(200).send(challenge);
      }
      console.warn('[WEBHOOK GET ERROR] Token mismatch');
      return res.status(403).send('Forbidden: Token mismatch');
    }
    return res.status(400).send('Bad Request');
  }

  // 2. INCOMING MESSAGES (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('[WEBHOOK POST] Raw payload body received:', JSON.stringify(body, null, 2));

      // Extract message content (robust to handle both Production wrapped payloads and Sandbox Test payloads)
      let val = null;
      if (body.entry?.[0]?.changes?.[0]?.value) {
        val = body.entry[0].changes[0].value;
        console.log('[WEBHOOK POST] Detected wrapped Production format');
      } else if (body.value) {
        val = body.value;
        console.log('[WEBHOOK POST] Detected flat Test console format (.value)');
      } else if (body.messages) {
        val = body;
        console.log('[WEBHOOK POST] Detected direct root format');
      }

      if (val && val.messages && val.messages[0]) {
        const message = val.messages[0];
        const userPhone = message.from;
        const userText = message.text?.body;

        if (userText) {
          console.log(`[WEBHOOK POST] Found message from: ${userPhone}, text: "${userText}"`);

          // Get response from OpenRouter
          const replyText = await getAIResponse(userText);

          // Send WhatsApp reply using Meta API
          const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
          const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

          console.log(`[WEBHOOK POST] Env status check - PhoneID: ${phoneId ? 'OK' : 'MISSING'}, AccessToken: ${accessToken ? 'OK' : 'MISSING'}`);

          if (!phoneId || !accessToken) {
            console.error('[WEBHOOK POST ERROR] Missing Meta API credentials. Cannot reply.');
            return res.status(200).send('EVENT_RECEIVED');
          }

          console.log(`[WEBHOOK POST] Dispatching WhatsApp reply to Meta Graph API...`);
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

          console.log(`[WEBHOOK POST] Meta Graph API returned status: ${whatsappRes.status}`);

          if (!whatsappRes.ok) {
            const errData = await whatsappRes.json();
            console.error('[WEBHOOK POST ERROR] Meta API Error:', JSON.stringify(errData, null, 2));
          } else {
            console.log(`[WEBHOOK POST SUCCESS] Successfully replied to ${userPhone}`);
          }
        } else {
          console.log('[WEBHOOK POST] Message has no text body (possibly media/status):', message.type);
        }
      } else {
        console.log('[WEBHOOK POST] No message data found in payload value');
      }

      // Return 200 OK to Meta so they don't keep retrying the webhook
      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('[WEBHOOK POST EXCEPTION] Handler Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  return res.status(405).send('Method Not Allowed');
}
