import React, { useState } from 'react';
import { 
  Coffee, 
  MapPin, 
  Sparkles, 
  Compass, 
  Map, 
  MessageSquare, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Crosshair,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockPlaces';

interface NavbarProps {
  currentTab: 'home' | 'explore' | 'map' | 'assistant' | 'wizard' | 'favorites';
  onSelectTab: (tab: 'home' | 'explore' | 'map' | 'assistant' | 'wizard' | 'favorites') => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  favoritesCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedCity,
  onSelectCity,
  favoritesCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenProfile,
  onUseCurrentLocation,
  isLocating
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-stone-900 via-amber-900 to-amber-700 dark:from-white dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent">
                  CafeFinder
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block -mt-1 font-medium">
                Intelligent Place Discovery
              </p>
            </div>
          </div>

          {/* Location Selector Pill */}
          <div className="relative">
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-1 border border-stone-200/80 dark:border-stone-700 text-xs sm:text-sm">
              <button
                type="button"
                onClick={onUseCurrentLocation}
                disabled={isLocating}
                title="Use Current Location (GPS)"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-medium transition-colors"
              >
                <Crosshair className={`w-3.5 h-3.5 text-amber-500 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Nearby</span>
              </button>
              
              <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="max-w-[110px] truncate">{selectedCity}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* City Dropdown Menu */}
            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Popular Locations
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        onSelectCity(c.name);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors ${
                        selectedCity === c.name 
                          ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-amber-950/20' 
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] text-stone-400">{c.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/70 dark:bg-stone-800/60 p-1 rounded-full border border-stone-200/60 dark:border-stone-800">
            <button
              onClick={() => onSelectTab('explore')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'explore'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              Explore
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'map'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-blue-500" />
              Interactive Map
            </button>

            <button
              onClick={() => onSelectTab('assistant')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'assistant'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              AI Assistant
            </button>

            <button
              onClick={() => onSelectTab('wizard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'wizard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Find My Place
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Favorites Icon */}
            <button
              type="button"
              onClick={() => onSelectTab('favorites')}
              className="relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title="Saved Favorites"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-700" />}
            </button>

            {/* Taste Profile Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
              title="Taste Profile & Preferences"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'home' ? 'text-amber-500 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Coffee className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'explore' ? 'text-amber-500 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'map' ? 'text-amber-500 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => onSelectTab('assistant')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'assistant' ? 'text-amber-500 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>AI Chat</span>
        </button>

        <button
          onClick={() => onSelectTab('wizard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentTab === 'wizard' ? 'text-amber-500 font-bold' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Perfect Match</span>
        </button>
      </div>
    </header>
  );
};
