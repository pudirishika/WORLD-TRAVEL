import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { searchFlights } from './src/services/flightService.ts';
import { searchHotels } from './src/services/hotelService.ts';
import { calculateSameDayFeasibility } from './src/services/sameDayService.ts';
import { generateTravelPlans } from './src/services/plannerService.ts';
import { DESTINATION_GUIDES } from './src/data/destinations.ts';
import { POPULAR_AIRPORTS } from './src/data/airports.ts';
import { EXCHANGE_RATES } from './src/utils/currencies.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with user agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. API: Destination Guides
app.get('/api/destinations', (_req: Request, res: Response) => {
  res.json({ destinations: DESTINATION_GUIDES });
});

// 2. API: Airports
app.get('/api/airports', (_req: Request, res: Response) => {
  res.json({ airports: POPULAR_AIRPORTS });
});

// 3. API: Exchange Rates
app.get('/api/rates', (_req: Request, res: Response) => {
  res.json({ rates: EXCHANGE_RATES });
});

// 4. API: Flight Search
app.post('/api/flights/search', (req: Request, res: Response) => {
  try {
    const results = searchFlights(req.body);
    res.json(results);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

// 5. API: Hotel Search
app.post('/api/hotels/search', (req: Request, res: Response) => {
  try {
    const hotels = searchHotels(req.body);
    res.json({ hotels });
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ error: 'Failed to search hotels' });
  }
});

// 6. API: Same-Day Return Feasibility
app.post('/api/same-day-check', (req: Request, res: Response) => {
  try {
    const feasibility = calculateSameDayFeasibility(req.body);
    res.json(feasibility);
  } catch (error) {
    console.error('Same-day check error:', error);
    res.status(500).json({ error: 'Failed to evaluate same-day feasibility' });
  }
});

// 7. API: Generate Plans
app.post('/api/plan', async (req: Request, res: Response) => {
  try {
    const request = req.body;
    // Generate verified baseline plans
    const plans = generateTravelPlans(request);

    // If Gemini AI is active and user provided special requests, we can enhance the plan summary
    let aiAdvice: string | null = null;
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the lead travel planning director at WORLD TRAVEL ("Your World. Your Budget. Your Journey.").
The traveler requested:
- Origin: ${request.origin?.city} (${request.origin?.code})
- Destination: ${request.destination?.city} (${request.destination?.code})
- Trip Type: ${request.tripType} (accommodation needed: ${request.needAccommodation ? 'Yes' : 'NO - No overnight stay'})
- Budget: ${request.currency} ${request.budget}
- Travelers: Adults: ${request.travelers?.adults}, Children: ${request.travelers?.children}, Seniors: ${request.travelers?.seniors}
- Travel Class: ${request.travelClass}
- Purpose: ${request.purpose}
- Dietary: ${request.dietaryPreferences?.join(', ') || 'Standard'}
- Accessibility: ${request.accessibility?.join(', ') || 'None'}
- Special Notes: ${request.specialNotes || 'None'}

Provide a 2-3 paragraph professional travel consultant evaluation:
1. Feasibility & schedule breakdown (highlighting whether it fits within budget and time, especially for same-day return or tight flights).
2. Key tips on visas, local transit, and timing buffers.
3. Concise recommendation on which tier (Budget, Balanced, Comfort, or Luxury) best satisfies their objectives.
Be realistic, authoritative, and concise. Never use mechanical prefixes or generic AI fluff.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiAdvice = response.text || null;
      } catch (geminiError) {
        console.warn('Gemini enhancement skipped:', geminiError);
      }
    }

    res.json({
      plans,
      aiAdvice,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate travel plans' });
  }
});

// 8. API: AI Travel Consultant Chat / Q&A (Integrated with n8n workflow + Gemini backup)
const N8N_WEBHOOK_URL = 'https://pudirishika2007.app.n8n.cloud/webhook/09e7ebb0-7f0c-4734-affe-5b8423763844/chat';

app.post('/api/ai/consultant', async (req: Request, res: Response) => {
  const { message, context, sessionId } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message required' });
    return;
  }

  const activeSession = sessionId || 'wt-user-' + (context?.origin?.code || 'global') + '-' + (context?.destination?.code || 'traveler');

  // 1. First attempt: n8n AI Chatbot Webhook
  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: activeSession,
        chatInput: message,
      }),
    });

    if (n8nResponse.ok) {
      const data: any = await n8nResponse.json();
      const reply = data?.output || data?.text || data?.message || data?.response;
      if (reply && typeof reply === 'string' && !reply.toLowerCase().includes('error in workflow')) {
        res.json({ reply, source: 'n8n_agent' });
        return;
      }
    }
  } catch (n8nError) {
    console.warn('n8n webhook error, falling back to server-side Gemini:', n8nError);
  }

  // 2. Fallback: Server-side Gemini 3.8 Flash
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `You are WORLD TRAVEL's Senior Worldwide Concierge and Feasibility Director.
Tagline: "Your World. Your Budget. Your Journey."
You specialize in worldwide itineraries, exact cost breakdowns, flight logistics, visa guidance, and same-day international returns (e.g., visiting Moscow Red Square from Delhi without overnight hotel).
Tone: Sophisticated, highly knowledgeable, transparent about real costs and constraints, clear, and reassuring.
Always state visa rules clearly and remind users that final visas must be verified with official consular authorities. Keep answers concise, structured, and easy to read.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Traveler Context: ${JSON.stringify(context || {})}
Traveler Query: "${message}"`,
        config: {
          systemInstruction,
        },
      });

      res.json({ reply: response.text, source: 'gemini' });
      return;
    } catch (err) {
      console.error('Gemini chat error:', err);
    }
  }

  // 3. Fallback intelligent response if both are offline
  let fallbackReply = `Thank you for consulting WORLD TRAVEL. For your trip to ${context?.destination?.city || 'your chosen destination'}, we recommend booking direct flights to maximize your ground hours. For visas and entry documentation, ensure you apply through the official government portal at least 4 to 10 days in advance. Our team verifies all schedules to ensure adequate time for airport immigration and security.`;
  if (message.toLowerCase().includes('same day') || message.toLowerCase().includes('moscow') || message.toLowerCase().includes('russia')) {
    fallbackReply = `For a same-day visit from India to Moscow (Russia) with ₹5,00,000 budget: Outbound direct flight SU 233 departs DEL at 05:00 AM arriving SVO at 09:30 AM. Return flight SU 232 departs SVO at 20:45 PM. With Aeroexpress train taking 45 minutes into Belorussky, you enjoy a guaranteed 6.3-hour window in Red Square and Kremlin. Indian passports can obtain the Russian Unified e-Visa online in ~4 days for ~$52 USD. The total trip easily fits within your budget with zero hotel expense!`;
  }

  res.json({ reply: fallbackReply, source: 'fallback' });
});

// Load Previous n8n Chat Session
app.post('/api/ai/consultant/history', async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.json({ data: [] });
    return;
  }

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'loadPreviousSession',
        sessionId,
      }),
    });
    if (n8nResponse.ok) {
      const data = await n8nResponse.json();
      res.json(data);
      return;
    }
  } catch (err) {
    console.warn('Failed to load n8n session history:', err);
  }
  res.json({ data: [] });
});

// 9. API: Booking Voucher Simulator
app.post('/api/bookings/simulate', (req: Request, res: Response) => {
  const { plan, request, passengerDetails } = req.body;
  const bookingRef = 'WT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  res.json({
    success: true,
    bookingReference: bookingRef,
    status: 'CONFIRMED_PROVISIONAL',
    issuedAt: new Date().toISOString(),
    planTitle: plan?.title,
    totalPaid: plan?.budgetBreakdown?.totalEstimatedCost,
    currency: plan?.budgetBreakdown?.currency,
    passengerDetails,
    cancellationPolicy: 'Refundable subject to airline tariff conditions. 24h risk-free grace window applies.',
    checkInNotice: 'Please present your passport, e-Visa / travel authorization, and booking voucher at the airline check-in counter.',
  });
});

// Static Vite dev or production setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`WORLD TRAVEL server running at http://localhost:${PORT}`);
  });
}

startServer();
