import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Compass, 
  Map, 
  Coffee, 
  Filter, 
  ArrowRight, 
  Crosshair, 
  Star, 
  Heart, 
  SlidersHorizontal,
  Navigation,
  Check,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Laptop,
  Users,
  Moon,
  Leaf,
  Wine,
  Cake,
  Pizza,
  UtensilsCrossed,
  CupSoda
} from 'lucide-react';

import { Place, FilterState, UserPreferences, PlaceCategory } from './types';
import { INITIAL_PLACES, QUICK_CATEGORIES, QUICK_PROMPTS, POPULAR_CITIES } from './data/mockPlaces';
import { calculateRecommendationScore } from './utils/recommendationEngine';
import { Navbar } from './components/Navbar';
import { PlaceCard } from './components/PlaceCard';
import { SmartFiltersBar } from './components/SmartFiltersBar';
import { InteractiveMapView } from './components/InteractiveMapView';
import { PlaceDetailsModal } from './components/PlaceDetailsModal';
import { DirectionsModal } from './components/DirectionsModal';
import { AIAssistantChat } from './components/AIAssistantChat';
import { PerfectPlaceWizard } from './components/PerfectPlaceWizard';
import { FavoritesView } from './components/FavoritesView';
import { TasteProfileModal } from './components/TasteProfileModal';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'map' | 'assistant' | 'wizard' | 'favorites'>('home');
  const [selectedCity, setSelectedCity] = useState('Chandigarh');
  const [userCoordinates, setUserCoordinates] = useState({ lat: 30.7333, lng: 76.7794 });
  const [isLocating, setIsLocating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationInput, setLocationInput] = useState('Chandigarh');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);

  // Modals state
  const [selectedPlaceForDetails, setSelectedPlaceForDetails] = useState<Place | null>(null);
  const [selectedPlaceForDirections, setSelectedPlaceForDirections] = useState<Place | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [mapSelectedPlace, setMapSelectedPlace] = useState<Place | null>(null);
  const [exploreViewMode, setExploreViewMode] = useState<'grid' | 'split'>('grid');

  // Grounding live results state
  const [groundingLinks, setGroundingLinks] = useState<{ title: string; uri: string }[]>([]);
  const [isFetchingGrounding, setIsFetchingGrounding] = useState(false);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cafefinder_favs');
      return saved ? JSON.parse(saved) : ['cafe-artisan-roastery', 'olive-bistro-garden'];
    } catch {
      return ['cafe-artisan-roastery', 'olive-bistro-garden'];
    }
  });

  // User Taste Profile stored in localStorage
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('cafefinder_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Gourmet Explorer',
      defaultLocation: 'Chandigarh',
      dietary: {
        vegetarianOnly: false,
        vegan: false,
        halal: true,
        glutenFree: false,
      },
      budgetPreference: ['₹', '₹₹'],
      favoriteCuisines: ['Artisanal Coffee', 'Italian', 'North Indian'],
      preferredAmbience: ['Peaceful & Quiet', 'Cozy & Aesthetic'],
      mustHaveFacilities: ['Wi-Fi', 'Parking'],
    };
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    location: 'Chandigarh',
    category: 'all',
    maxDistanceKm: 25,
    minRating: 0,
    priceLevels: [],
    cuisines: ['All Cuisines'],
    vegetarianOnly: false,
    veganOptions: false,
    halal: false,
    wifi: false,
    parking: false,
    outdoorSeating: false,
    familyFriendly: false,
    petFriendly: false,
    quietForWork: false,
    openNow: false,
    lateNight: false,
    sortBy: 'score',
  });

  // Save favorites to storage
  const handleToggleFavorite = (placeId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId];
      try {
        localStorage.setItem('cafefinder_favs', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Save taste profile
  const handleSavePreferences = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    try {
      localStorage.setItem('cafefinder_profile', JSON.stringify(prefs));
    } catch (e) {}
  };

  // Dark mode class toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // GPS Locate User
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoordinates(coords);
        setSelectedCity('Near You');
        setLocationInput('Current Location');
        setFilters((prev) => ({ ...prev, location: 'Near You' }));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Could not determine exact location. Please select a city.');
      },
      { timeout: 8000 }
    );
  };

  // Change City
  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setLocationInput(city);
    setFilters((prev) => ({ ...prev, location: city }));
    const cityData = POPULAR_CITIES.find((c) => c.name === city);
    if (cityData) {
      setUserCoordinates({ lat: cityData.lat, lng: cityData.lng });
    }
  };

  // Natural Language AI Search Handler
  const handlePerformSearch = async (overrideQuery?: string) => {
    const query = (overrideQuery ?? searchQuery).trim();
    if (!query && !locationInput.trim()) {
      setCurrentTab('explore');
      return;
    }

    setIsAiSearching(true);
    setCurrentTab('explore');

    try {
      // 1. Call server-side natural language parser
      const res = await fetch('/api/ai/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || 'best cafes and restaurants',
          userLocation: locationInput || selectedCity,
        }),
      });

      const data = await res.json();
      const parsed = data.parsed;

      // Update filters state with extracted criteria
      setFilters((prev) => ({
        ...prev,
        searchQuery: query,
        location: parsed.detectedLocation || locationInput || selectedCity,
        category: (parsed.category as PlaceCategory) || prev.category,
        maxBudget: parsed.maxBudget || undefined,
        maxDistanceKm: parsed.maxDistanceKm || 25,
        cuisines: parsed.cuisines?.length ? parsed.cuisines : prev.cuisines,
        vegetarianOnly: parsed.vegetarianOnly ?? prev.vegetarianOnly,
        veganOptions: parsed.vegan ?? prev.veganOptions,
        halal: parsed.halal ?? prev.halal,
        wifi: parsed.wifi ?? prev.wifi,
        parking: parsed.parking ?? prev.parking,
        outdoorSeating: parsed.outdoorSeating ?? prev.outdoorSeating,
        familyFriendly: parsed.familyFriendly ?? prev.familyFriendly,
        petFriendly: parsed.petFriendly ?? prev.petFriendly,
        quietForWork: parsed.quietForWork ?? prev.quietForWork,
        openNow: parsed.openNow ?? prev.openNow,
        lateNight: parsed.lateNight ?? prev.lateNight,
      }));

      setAiSearchSummary(parsed.aiExplanation || `Searching for ${query}`);

      // 2. Also query Google Maps Grounding if query mentions specific places
      if (query.length > 5) {
        setIsFetchingGrounding(true);
        fetch('/api/ai/maps-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${query} near ${locationInput || selectedCity}`,
            lat: userCoordinates.lat,
            lng: userCoordinates.lng,
          }),
        })
          .then((r) => r.json())
          .then((mapData) => {
            if (mapData.links && mapData.links.length > 0) {
              setGroundingLinks(mapData.links);
            }
          })
          .catch(() => {})
          .finally(() => setIsFetchingGrounding(false));
      }
    } catch (e) {
      console.error(e);
      // Fallback simple search
      setFilters((prev) => ({
        ...prev,
        searchQuery: query,
        location: locationInput || selectedCity,
      }));
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filter & Rank Places
  const processedPlaces = useMemo(() => {
    let result = INITIAL_PLACES.map((place) => {
      // Calculate Recommendation Score using user's explicit filters + taste profile
      const scoreResult = calculateRecommendationScore(place, filters, userPreferences);
      return {
        ...place,
        recommendationScore: scoreResult.score,
        scoreBreakdown: scoreResult.breakdown,
        aiMatchRationale: scoreResult.rationale,
      };
    });

    // 1. Text & Category search
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.cuisines.some((c) => c.toLowerCase().includes(q)) ||
          p.popularDishes.some((d) => d.name.toLowerCase().includes(q)) ||
          p.locality.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => {
        if (filters.category === 'study_work') return p.category === 'study_work' || p.facilities.quietForWork;
        if (filters.category === 'vegetarian') return p.dietary.isVegetarianOnly || p.dietary.hasVegetarianOptions;
        if (filters.category === 'coffee') return p.category === 'coffee' || p.cuisines.some(c => c.toLowerCase().includes('coffee'));
        return p.category === filters.category;
      });
    }

    // 2. Filters
    if (filters.maxDistanceKm) {
      result = result.filter((p) => p.distanceKm <= filters.maxDistanceKm);
    }
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.priceLevels.length > 0) {
      result = result.filter((p) => filters.priceLevels.includes(p.priceRange));
    }
    if (filters.maxBudget && filters.maxBudget > 0) {
      result = result.filter((p) => p.averageCostForTwo <= filters.maxBudget!);
    }
    if (filters.vegetarianOnly) {
      result = result.filter((p) => p.dietary.isVegetarianOnly);
    }
    if (filters.veganOptions) {
      result = result.filter((p) => p.dietary.hasVeganOptions);
    }
    if (filters.halal) {
      result = result.filter((p) => p.dietary.isHalal);
    }
    if (filters.wifi) {
      result = result.filter((p) => p.facilities.wifi);
    }
    if (filters.parking) {
      result = result.filter((p) => p.facilities.parking);
    }
    if (filters.outdoorSeating) {
      result = result.filter((p) => p.facilities.outdoorSeating);
    }
    if (filters.petFriendly) {
      result = result.filter((p) => p.facilities.petFriendly);
    }
    if (filters.familyFriendly) {
      result = result.filter((p) => p.facilities.familyFriendly);
    }
    if (filters.quietForWork) {
      result = result.filter((p) => p.facilities.quietForWork);
    }
    if (filters.openNow) {
      result = result.filter((p) => p.openingHours.isOpenNow);
    }
    if (filters.lateNight) {
      result = result.filter((p) => p.openingHours.lateNight);
    }
    if (filters.cuisines.length > 0 && !filters.cuisines.includes('All Cuisines')) {
      result = result.filter((p) =>
        p.cuisines.some((c) => filters.cuisines.some((fc) => c.toLowerCase().includes(fc.toLowerCase())))
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'score') {
        return (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0);
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === 'priceAsc') {
        return a.averageCostForTwo - b.averageCostForTwo;
      }
      if (filters.sortBy === 'priceDesc') {
        return b.averageCostForTwo - a.averageCostForTwo;
      }
      if (filters.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });

    return result;
  }, [filters, userPreferences]);

  const favoritePlacesList = useMemo(() => {
    return INITIAL_PLACES.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  const handleResetAllFilters = () => {
    setFilters({
      searchQuery: '',
      location: selectedCity,
      category: 'all',
      maxDistanceKm: 25,
      minRating: 0,
      priceLevels: [],
      cuisines: ['All Cuisines'],
      vegetarianOnly: false,
      veganOptions: false,
      halal: false,
      wifi: false,
      parking: false,
      outdoorSeating: false,
      familyFriendly: false,
      petFriendly: false,
      quietForWork: false,
      openNow: false,
      lateNight: false,
      sortBy: 'score',
    });
    setAiSearchSummary(null);
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case 'restaurant': return <UtensilsCrossed className="w-4 h-4" />;
      case 'coffee': return <CupSoda className="w-4 h-4" />;
      case 'study_work': return <Laptop className="w-4 h-4" />;
      case 'vegetarian': return <Leaf className="w-4 h-4" />;
      case 'fine_dining': return <Wine className="w-4 h-4" />;
      case 'dessert': return <Cake className="w-4 h-4" />;
      case 'family': return <Users className="w-4 h-4" />;
      case 'fast_food': return <Pizza className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-10 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        favoritesCount={favorites.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* =========================================
            1. HOME TAB
        ========================================= */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-stone-800">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold mb-4 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Powered by Gemini & Google Maps Grounding</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
                  Find the cafe or table <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                    that matches your vibe.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-stone-300 mb-8 max-w-xl font-normal leading-relaxed">
                  Discover quiet study spaces with 100+ Mbps Wi-Fi, romantic candlelit trattorias, or authentic pure veg thalis under ₹500 in <strong>{selectedCity}</strong>.
                </p>

                {/* Big Search Bar Container */}
                <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl p-2 sm:p-3 rounded-3xl shadow-2xl border border-white/20 text-stone-900 dark:text-white">
                  <div className="flex flex-col md:flex-row gap-2">
                    {/* Search Input */}
                    <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-stone-100/80 dark:bg-stone-800/80 rounded-2xl">
                      <Search className="w-5 h-5 text-amber-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="What are you looking for? (e.g. 'Quiet cafe for studying with Wi-Fi')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePerformSearch()}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-stone-400"
                      />
                    </div>

                    {/* Location Input */}
                    <div className="w-full md:w-56 flex items-center gap-2 px-3 py-2.5 bg-stone-100/80 dark:bg-stone-800/80 rounded-2xl">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter your location"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-stone-400"
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handlePerformSearch()}
                      disabled={isAiSearching}
                      className="py-3 px-7 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 shrink-0"
                    >
                      {isAiSearching ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 fill-white" />
                      )}
                      <span>{isAiSearching ? 'AI Analyzing...' : 'Find Places'}</span>
                    </button>
                  </div>
                </div>

                {/* Natural Language Quick Prompts */}
                <div className="mt-5">
                  <div className="text-xs text-stone-300 font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Try asking with natural language:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.slice(0, 4).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(p);
                          handlePerformSearch(p);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all font-medium text-left"
                      >
                        "{p}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden md:block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
                  alt=""
                  className="w-full h-full object-cover mix-blend-overlay scale-110"
                />
              </div>
            </div>

            {/* Quick Categories Bar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                  Explore by Category
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category: 'all' }));
                    setCurrentTab('explore');
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
                {QUICK_CATEGORIES.map((cat) => {
                  const isSelected = filters.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, category: cat.id as any }));
                        setCurrentTab('explore');
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border text-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-amber-400 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400'}`}>
                        {getCategoryIcon(cat.id)}
                      </div>
                      <span className="text-[11px] font-bold truncate max-w-full">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Match: "Find My Perfect Place" Call to Action Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Place Matcher</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                  Not sure where to eat? Let our AI match you.
                </h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Take the 7-question quick quiz: specify your desired atmosphere, budget, distance, and Wi-Fi needs, and get a personalized score with custom explanations!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentTab('wizard')}
                className="py-3.5 px-8 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-extrabold shadow-lg transition-transform active:scale-95 shrink-0 flex items-center gap-2"
              >
                <span>Launch "Find My Perfect Place"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trending & Top Recommended Places */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>Top AI Matches Near {selectedCity}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      {processedPlaces.length} Places
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ranked by AI recommendation score factoring distance, Wi-Fi, rating, and ambience.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTab('explore')}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>See all results</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedPlaces.slice(0, 6).map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isFavorite={favorites.includes(place.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={(p) => setSelectedPlaceForDetails(p)}
                    onGetDirections={(p) => setSelectedPlaceForDirections(p)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            2. EXPLORE TAB
        ========================================= */}
        {currentTab === 'explore' && (
          <div className="space-y-4">
            {/* Search Bar & View Mode Toggle Header */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-3 sm:p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                <Search className="w-4 h-4 text-amber-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Refine search query (e.g. 'pure veg', 'rooftop', 'coffee with wifi')..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {/* View Mode Toggle: Grid vs Split Map */}
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => setExploreViewMode('grid')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      exploreViewMode === 'grid'
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                        : 'text-stone-500'
                    }`}
                  >
                    Grid View
                  </button>
                  <button
                    type="button"
                    onClick={() => setExploreViewMode('split')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      exploreViewMode === 'split'
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                        : 'text-stone-500'
                    }`}
                  >
                    Split Map
                  </button>
                </div>
              </div>
            </div>

            {/* AI Explanation Banner (if present) */}
            {aiSearchSummary && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span>
                    <strong>AI Search Filters Applied:</strong> {aiSearchSummary}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiSearchSummary(null)}
                  className="text-stone-400 hover:text-stone-600 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Grounding Links Banner (if fetched from Google Maps) */}
            {groundingLinks.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Google Maps Grounding Sources:
                </span>
                {groundingLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 font-medium hover:underline text-[11px]"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}

            {/* Smart Filters Bar */}
            <SmartFiltersBar
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={handleResetAllFilters}
              totalResultsCount={processedPlaces.length}
            />

            {/* Content: Grid or Split */}
            {exploreViewMode === 'grid' ? (
              <div>
                {processedPlaces.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
                    <Coffee className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <h3 className="font-bold text-base text-stone-800 dark:text-stone-200 mb-1">
                      No cafes or restaurants match all filters
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                      Try adjusting your budget, distance radius, or clearing strict dietary requirements.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetAllFilters}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        isFavorite={favorites.includes(place.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={(p) => setSelectedPlaceForDetails(p)}
                        onGetDirections={(p) => setSelectedPlaceForDirections(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Split View */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {processedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isFavorite={favorites.includes(place.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onViewDetails={(p) => setSelectedPlaceForDetails(p)}
                      onGetDirections={(p) => setSelectedPlaceForDirections(p)}
                      onSelectMapPin={(p) => setMapSelectedPlace(p)}
                    />
                  ))}
                </div>

                <div className="lg:col-span-6 sticky top-20">
                  <InteractiveMapView
                    places={processedPlaces}
                    selectedPlace={mapSelectedPlace || processedPlaces[0] || null}
                    onSelectPlace={(p) => setMapSelectedPlace(p)}
                    onViewDetails={(p) => setSelectedPlaceForDetails(p)}
                    onGetDirections={(p) => setSelectedPlaceForDirections(p)}
                    userCoordinates={userCoordinates}
                    onCenterUser={handleUseCurrentLocation}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            3. MAP TAB
        ========================================= */}
        {currentTab === 'map' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div>
                <h1 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-500" />
                  Interactive Cafe & Restaurant Map
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Browse {processedPlaces.length} discovered places in {selectedCity} with live distance calculations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="py-2 px-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Crosshair className={`w-3.5 h-3.5 text-amber-500 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>Locate Me</span>
                </button>
              </div>
            </div>

            <InteractiveMapView
              places={processedPlaces}
              selectedPlace={mapSelectedPlace}
              onSelectPlace={(p) => setMapSelectedPlace(p)}
              onViewDetails={(p) => setSelectedPlaceForDetails(p)}
              onGetDirections={(p) => setSelectedPlaceForDirections(p)}
              userCoordinates={userCoordinates}
              onCenterUser={handleUseCurrentLocation}
            />
          </div>
        )}

        {/* =========================================
            4. AI ASSISTANT TAB
        ========================================= */}
        {currentTab === 'assistant' && (
          <AIAssistantChat
            places={INITIAL_PLACES}
            userLocation={selectedCity}
            onViewPlace={(p) => setSelectedPlaceForDetails(p)}
            onGetDirections={(p) => setSelectedPlaceForDirections(p)}
          />
        )}

        {/* =========================================
            5. "FIND MY PERFECT PLACE" WIZARD TAB
        ========================================= */}
        {currentTab === 'wizard' && (
          <PerfectPlaceWizard
            places={INITIAL_PLACES}
            defaultLocation={selectedCity}
            onViewPlace={(p) => setSelectedPlaceForDetails(p)}
            onGetDirections={(p) => setSelectedPlaceForDirections(p)}
          />
        )}

        {/* =========================================
            6. FAVORITES TAB
        ========================================= */}
        {currentTab === 'favorites' && (
          <FavoritesView
            favoritePlaces={favoritePlacesList}
            onRemoveFavorite={handleToggleFavorite}
            onViewDetails={(p) => setSelectedPlaceForDetails(p)}
            onGetDirections={(p) => setSelectedPlaceForDirections(p)}
            onExploreMore={() => setCurrentTab('explore')}
          />
        )}
      </main>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlaceForDetails}
        isOpen={!!selectedPlaceForDetails}
        onClose={() => setSelectedPlaceForDetails(null)}
        isFavorite={selectedPlaceForDetails ? favorites.includes(selectedPlaceForDetails.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onGetDirections={(p) => setSelectedPlaceForDirections(p)}
      />

      {/* Directions Navigation Modal */}
      <DirectionsModal
        place={selectedPlaceForDirections}
        isOpen={!!selectedPlaceForDirections}
        onClose={() => setSelectedPlaceForDirections(null)}
        userLocationName={selectedCity}
      />

      {/* Personal Taste Profile Modal */}
      <TasteProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        preferences={userPreferences}
        onSavePreferences={handleSavePreferences}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 py-8 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white text-[11px] font-bold">
              ☕
            </div>
            <span className="font-bold text-stone-800 dark:text-stone-200">CafeFinder AI</span>
            <span>• Intelligent Cafe & Dining Concierge</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Gemini & Google Maps Platform</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="text-amber-600 hover:underline"
            >
              Taste Profile Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
