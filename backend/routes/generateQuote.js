const express = require('express');
const router = express.Router();

// POST /api/generate-quote — AI quote generation
// This replaces the Supabase Edge Function.
// Set OPENAI_API_KEY or any AI provider key in .env
router.post('/', async (req, res) => {
  try {
    const { company_name, product_interest, quantity, message } = req.body;

    const AI_API_KEY = process.env.AI_API_KEY;
    const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

    if (!AI_API_KEY) {
      return res.status(500).json({ error: 'AI_API_KEY is not configured' });
    }

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a professional quote generator for S. M. Trade International, a Bangladeshi company specializing in customized corporate gifts, promotional products, leather goods, crystal items, and office accessories.

Generate a professional price estimate/quote based on the client's inquiry. Include:
1. A greeting addressing the company
2. Itemized list of products with estimated price ranges in BDT (Bangladeshi Taka)
3. Estimated timeline for delivery
4. Terms: 50% advance payment, balance on delivery
5. A professional closing note

Keep it concise, professional, and formatted with clear sections. Use approximate price ranges since exact pricing depends on customization details. Prices should be realistic for the Bangladeshi market.`,
          },
          {
            role: 'user',
            content: `Company: ${company_name || 'Not specified'}\nProduct Interest: ${product_interest || 'General inquiry'}\nQuantity: ${quantity || 'Not specified'}\nMessage: ${message || 'No additional details'}`,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', response.status, errText);
      return res.status(response.status).json({ error: 'Quote generation failed' });
    }

    // Stream SSE response to client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();
  } catch (err) {
    console.error('generate-quote error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

module.exports = router;
