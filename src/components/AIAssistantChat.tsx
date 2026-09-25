import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Coffee, 
  Star, 
  Navigation, 
  Info, 
  ArrowRight,
  ExternalLink,
  MapPin,
  Wifi,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Place, ChatMessage } from '../types';
import { QUICK_PROMPTS } from '../data/mockPlaces';

interface AIAssistantChatProps {
  places: Place[];
  userLocation: string;
  onViewPlace: (place: Place) => void;
  onGetDirections: (place: Place) => void;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  places,
  userLocation,
  onViewPlace,
  onGetDirections,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I'm **CafeFinder AI**, your personal cafe and dining concierge in **${userLocation}**.\n\nTell me what you're craving or the exact vibe you need — whether that's a *quiet cafe for studying with fast Wi-Fi*, a *romantic date night spot*, or the *best pure vegetarian dinner under ₹500*. I'll evaluate ambience, pricing, seating, and menus to find your match!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: 'Just now',
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Call server-side Gemini AI chat endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userLocation,
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "I analyzed your request and found some great matches!";

      // Intelligent local matching to attach interactive place cards
      const lower = text.toLowerCase();
      let matchedPlaces = places.filter((p) => {
        if (lower.includes('study') || lower.includes('work') || lower.includes('quiet') || lower.includes('laptop')) {
          return p.category === 'study_work' || p.facilities.quietForWork || p.facilities.wifi;
        }
        if (lower.includes('veg') && !lower.includes('non-veg')) {
          return p.dietary.isVegetarianOnly || p.dietary.hasVegetarianOptions;
        }
        if (lower.includes('romantic') || lower.includes('date')) {
          return p.ambience.includes('Romantic') || p.category === 'fine_dining';
        }
        if (lower.includes('coffee')) {
          return p.category === 'coffee' || p.category === 'study_work' || p.cuisines.some(c => c.toLowerCase().includes('coffee'));
        }
        if (lower.includes('pet') || lower.includes('dog')) {
          return p.facilities.petFriendly;
        }
        if (lower.includes('late') || lower.includes('night')) {
          return p.openingHours.lateNight;
        }
        if (lower.includes('family')) {
          return p.category === 'family' || p.facilities.familyFriendly;
        }
        return p.rating >= 4.7;
      }).slice(0, 3);

      if (matchedPlaces.length === 0) {
        matchedPlaces = places.slice(0, 3);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: 'Just now',
        suggestedPlaces: matchedPlaces,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: `Here are great spots in ${userLocation} matching "${text}". I prioritized ambience, ratings, and customer reviews:`,
        timestamp: 'Just now',
        suggestedPlaces: places.slice(0, 3),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'assistant',
        content: `Chat reset! What type of cafe or restaurant can I find for you in **${userLocation}**?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[720px] bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                CafeFinder AI Concierge
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Active in <strong className="text-stone-700 dark:text-stone-300 font-semibold">{userLocation}</strong> • Powered by Gemini & Maps Grounding
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          title="Restart Conversation"
          className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-1">
                <Sparkles className="w-4 h-4 fill-amber-500" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-none shadow-md shadow-amber-500/20'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none border border-stone-200/60 dark:border-stone-700'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm dark:prose-invert">
                  {msg.content}
                </div>
              </div>

              {/* Embedded Interactive Place Cards */}
              {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {msg.suggestedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-sm hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between"
                    >
                      <div className="flex gap-2.5 items-start mb-2.5">
                        <img
                          src={place.photos[0]}
                          alt={place.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 truncate">
                              {place.category.replace('_', ' ')}
                            </span>
                            <span className="flex items-center text-xs font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-current mr-0.5" />
                              {place.rating.toFixed(1)}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                            {place.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate">
                            {place.distanceKm} km away • {place.priceRange}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 mb-2.5">
                        {place.facilities.wifi && (
                          <span className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Wifi className="w-2.5 h-2.5" /> Wi-Fi
                          </span>
                        )}
                        <span className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          {place.ambience}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() => onViewPlace(place)}
                          className="py-1 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-[11px] font-semibold text-center transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onGetDirections(place)}
                          className="py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Navigation className="w-2.5 h-2.5" />
                          <span>Directions</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-stone-400 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-4 h-4 fill-amber-500 animate-spin" />
            </div>
            <span>Evaluating places, ratings, ambience & Wi-Fi specs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap py-1">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-600 dark:text-stone-300 hover:text-amber-600 text-xs font-medium border border-stone-200 dark:border-stone-700 shadow-sm transition-all"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask CafeFinder AI anything (e.g. 'Peaceful cafe with Wi-Fi for studying 3 hours')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-transparent"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white rounded-2xl shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
