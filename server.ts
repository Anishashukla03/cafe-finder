import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for safe error responses
function handleAiError(error: any, res: Response, fallbackData: any) {
  console.error('[Gemini API Error]:', error);
  res.status(200).json({
    isFallback: true,
    message: error?.message || 'Using smart fallback logic',
    data: fallbackData,
  });
}

// 1. Natural language query parser -> structured filters
app.post('/api/ai/parse-query', async (req: Request, res: Response) => {
  const { query, userLocation } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Fallback heuristic extraction
  const fallback = {
    category: 'all',
    cuisines: [] as string[],
    maxBudget: null as number | null,
    maxDistanceKm: 10,
    vegetarianOnly: false,
    vegan: false,
    halal: false,
    wifi: false,
    parking: false,
    outdoorSeating: false,
    familyFriendly: false,
    petFriendly: false,
    quietForWork: false,
    openNow: false,
    lateNight: false,
    detectedLocation: null as string | null,
    aiExplanation: `Searching for "${query}" near ${userLocation || 'your location'}`,
  };

  const qLower = query.toLowerCase();
  if (qLower.includes('study') || qLower.includes('work') || qLower.includes('quiet') || qLower.includes('laptop')) {
    fallback.quietForWork = true;
    fallback.wifi = true;
    fallback.category = 'study_work';
  }
  if (qLower.includes('cafe') || qLower.includes('coffee')) {
    fallback.category = fallback.category === 'study_work' ? 'study_work' : 'cafe';
  }
  if (qLower.includes('veg') && !qLower.includes('non-veg')) {
    fallback.vegetarianOnly = true;
  }
  if (qLower.includes('wifi') || qLower.includes('wi-fi')) {
    fallback.wifi = true;
  }
  if (qLower.includes('pet') || qLower.includes('dog')) {
    fallback.petFriendly = true;
  }
  if (qLower.includes('family') || qLower.includes('kids')) {
    fallback.familyFriendly = true;
  }
  if (qLower.includes('late') || qLower.includes('midnight') || qLower.includes('night')) {
    fallback.lateNight = true;
  }
  if (qLower.includes('romantic') || qLower.includes('date')) {
    fallback.outdoorSeating = true;
  }
  const budgetMatch = query.match(/(?:under|below|less than|within|around)\s*(?:₹|rs\.?|inr|\$)?\s*(\d+)/i);
  if (budgetMatch && budgetMatch[1]) {
    fallback.maxBudget = parseInt(budgetMatch[1], 10);
  }
  const distMatch = query.match(/(\d+)\s*(?:km|kms|kilometer)/i);
  if (distMatch && distMatch[1]) {
    fallback.maxDistanceKm = parseInt(distMatch[1], 10);
  }

  if (!apiKey) {
    return res.json({ parsed: fallback, isFallback: true });
  }

  try {
    const prompt = `You are a culinary search understanding engine. Analyze this user query for cafes and restaurants:
Query: "${query}"
User's current location context: "${userLocation || 'Unknown'}"

Extract search criteria into JSON adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'One of: all, cafe, restaurant, coffee, fast_food, fine_dining, dessert, vegetarian, family, study_work',
            },
            cuisines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Extracted cuisine types like Italian, North Indian, Bakery, etc.',
            },
            maxBudget: {
              type: Type.NUMBER,
              description: 'Maximum budget for two if mentioned, otherwise null/0',
            },
            maxDistanceKm: {
              type: Type.NUMBER,
              description: 'Maximum distance in km if mentioned, default 10',
            },
            vegetarianOnly: { type: Type.BOOLEAN },
            vegan: { type: Type.BOOLEAN },
            halal: { type: Type.BOOLEAN },
            wifi: { type: Type.BOOLEAN },
            parking: { type: Type.BOOLEAN },
            outdoorSeating: { type: Type.BOOLEAN },
            familyFriendly: { type: Type.BOOLEAN },
            petFriendly: { type: Type.BOOLEAN },
            quietForWork: { type: Type.BOOLEAN },
            openNow: { type: Type.BOOLEAN },
            lateNight: { type: Type.BOOLEAN },
            detectedLocation: {
              type: Type.STRING,
              description: 'City, neighborhood or landmark mentioned in query, or null',
            },
            aiExplanation: {
              type: Type.STRING,
              description: 'A 1-sentence friendly explanation of what filters were applied based on the query',
            },
          },
          required: [
            'category',
            'vegetarianOnly',
            'wifi',
            'quietForWork',
            'aiExplanation',
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({ parsed: { ...fallback, ...parsedJson }, isFallback: false });
  } catch (err: any) {
    return handleAiError(err, res, fallback);
  }
});

// 2. Google Maps Grounding endpoint (gemini-2.5-flash with googleMaps tool)
app.post('/api/ai/maps-grounding', async (req: Request, res: Response) => {
  const { prompt, lat, lng } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!apiKey) {
    return res.json({
      text: `Here are top recommendations based on your request: "${prompt}". (Maps Grounding ready once API key is connected).`,
      groundingChunks: [],
      links: [],
      isFallback: true,
    });
  }

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(lat),
            longitude: Number(lng),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract links
    const links: { title: string; uri: string }[] = [];
    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps?.uri) {
        links.push({
          title: chunk.maps.title || 'View on Google Maps',
          uri: chunk.maps.uri,
        });
      }
      if (chunk.web?.uri) {
        links.push({
          title: chunk.web.title || 'Learn more',
          uri: chunk.web.uri,
        });
      }
    });

    return res.json({
      text,
      groundingChunks,
      links,
      isFallback: false,
    });
  } catch (err: any) {
    return handleAiError(err, res, {
      text: `Searched for places matching "${prompt}".`,
      groundingChunks: [],
      links: [],
    });
  }
});

// 3. CafeFinder AI Assistant Chat endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history = [], userLocation = 'Chandigarh' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are "CafeFinder AI", an intelligent, knowledgeable cafe and restaurant concierge.
The user is asking for recommendations or advice in/around ${userLocation}.

Your duties:
1. Provide personalized recommendations tailored specifically to their request (e.g. studying, romantic dates, budget meals, pet-friendly hangouts, Wi-Fi spots, late-night dinners).
2. For each recommended place, provide the place name and ALWAYS explain explicitly WHY it matches their criteria (e.g., quiet ambient noise level, seating availability, outlet access, signature dishes, exact price range).
3. Be warm, concise, and helpful. Keep responses structured with bullet points or clear highlights.`;

  if (!apiKey) {
    // High quality conversational fallback
    const fallbackResponse = `Here are great options tailored for you in ${userLocation}:
- **Artisan Roastery & Co.**: Perfect match for studying and coffee. Offers high-speed 120 Mbps Wi-Fi, power sockets at every booth, quiet ambient music, and single-origin pour-overs.
- **The Study Lab & Silent Coffee**: Specifically designed for deep focus with dedicated quiet zones, standing desks, and 250 Mbps internet.
- **The Rusty Anchor Cafe**: Great if you want a relaxed patio vibe with pets, delicious bagels, and reliable Wi-Fi.

Let me know if you would like me to filter by price or specific cuisine!`;

    return res.json({
      reply: fallbackResponse,
      isFallback: true,
      groundingLinks: [],
    });
  }

  try {
    const formattedContents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        formattedContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        });
      });
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I found some great places matching your request!';
    return res.json({
      reply,
      isFallback: false,
    });
  } catch (err: any) {
    return handleAiError(err, res, {
      reply: `I found some top-rated places matching "${message}". Let me know if you want to narrow down by distance or dietary preferences!`,
    });
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CafeFinder AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
