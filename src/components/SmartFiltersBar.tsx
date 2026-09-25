import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Star, 
  Check, 
  Wifi, 
  Car, 
  Dog, 
  Users, 
  Laptop, 
  Clock, 
  Moon, 
  Utensils, 
  ChevronDown,
  Sparkles,
  Sliders,
  DollarSign
} from 'lucide-react';
import { FilterState, PriceLevel } from '../types';
import { CUISINE_OPTIONS } from '../data/mockPlaces';

interface SmartFiltersBarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const SmartFiltersBar: React.FC<SmartFiltersBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalResultsCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceLevels: PriceLevel[] = ['₹', '₹₹', '₹₹₹', '₹₹₹₹'];

  const handlePriceToggle = (level: PriceLevel) => {
    const current = filters.priceLevels;
    const exists = current.includes(level);
    const updated = exists 
      ? current.filter(p => p !== level)
      : [...current, level];
    onChangeFilters({ ...filters, priceLevels: updated });
  };

  const handleCuisineToggle = (cuisine: string) => {
    if (cuisine === 'All Cuisines') {
      onChangeFilters({ ...filters, cuisines: ['All Cuisines'] });
      return;
    }
    let updated = filters.cuisines.filter(c => c !== 'All Cuisines');
    if (updated.includes(cuisine)) {
      updated = updated.filter(c => c !== cuisine);
      if (updated.length === 0) updated = ['All Cuisines'];
    } else {
      updated.push(cuisine);
    }
    onChangeFilters({ ...filters, cuisines: updated });
  };

  // Count active filters (excluding defaults)
  let activeCount = 0;
  if (filters.minRating > 0) activeCount++;
  if (filters.priceLevels.length > 0) activeCount += filters.priceLevels.length;
  if (filters.maxBudget) activeCount++;
  if (filters.maxDistanceKm < 25) activeCount++;
  if (filters.vegetarianOnly) activeCount++;
  if (filters.veganOptions) activeCount++;
  if (filters.halal) activeCount++;
  if (filters.wifi) activeCount++;
  if (filters.parking) activeCount++;
  if (filters.outdoorSeating) activeCount++;
  if (filters.petFriendly) activeCount++;
  if (filters.familyFriendly) activeCount++;
  if (filters.quietForWork) activeCount++;
  if (filters.openNow) activeCount++;
  if (filters.lateNight) activeCount++;
  if (filters.cuisines.length > 0 && !filters.cuisines.includes('All Cuisines')) activeCount += filters.cuisines.length;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm transition-all mb-6">
      {/* Top Filter Bar: Quick Toggles & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Quick Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isExpanded || activeCount > 0
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-amber-600 text-[10px] font-extrabold flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Pill: Open Now */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, openNow: !filters.openNow })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.openNow
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Open Now</span>
          </button>

          {/* Quick Pill: Pure Veg */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, vegetarianOnly: !filters.vegetarianOnly })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.vegetarianOnly
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <span>Pure Veg</span>
          </button>

          {/* Quick Pill: Study / Quiet */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, quietForWork: !filters.quietForWork })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.quietForWork
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Laptop className="w-3 h-3" />
            <span>Quiet / Study</span>
          </button>

          {/* Quick Pill: Wi-Fi */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, wifi: !filters.wifi })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.wifi
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>Wi-Fi</span>
          </button>

          {/* Quick Pill: 4.5+ Rating */}
          <button
            type="button"
            onClick={() => onChangeFilters({ ...filters, minRating: filters.minRating === 4.5 ? 0 : 4.5 })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.minRating === 4.5
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>4.5+</span>
          </button>
        </div>

        {/* Right Sort Dropdown & Result Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">
            <strong className="text-stone-800 dark:text-stone-200">{totalResultsCount}</strong> places found
          </span>

          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
            <span className="text-stone-400 hidden sm:inline font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-stone-800 dark:text-stone-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="score">✨ Best AI Match</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="distance">📍 Closest Distance</option>
              <option value="priceAsc">💰 Price: Low to High</option>
              <option value="priceDesc">💎 Price: High to Low</option>
              <option value="reviews">💬 Most Reviewed</option>
            </select>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
          {/* Column 1: Distance & Rating */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                <span>Maximum Distance</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">Within {filters.maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={filters.maxDistanceKm}
                onChange={(e) => onChangeFilters({ ...filters, maxDistanceKm: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1 km</span>
                <span>5 km</span>
                <span>10 km</span>
                <span>25 km</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 3.5, 4.0, 4.5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, minRating: r })}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      filters.minRating === r
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Price & Budget */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {priceLevels.map((lvl) => {
                  const isSelected = filters.priceLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handlePriceToggle(lvl)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Max Budget (for two)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={filters.maxBudget || ''}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      maxBudget: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full pl-7 pr-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-800 dark:text-stone-200 border border-transparent focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Column 3: Dietary & Timing */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Dietary & Hours
            </span>
            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.vegetarianOnly}
                onChange={(e) => onChangeFilters({ ...filters, vegetarianOnly: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>100% Pure Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.veganOptions}
                onChange={(e) => onChangeFilters({ ...filters, veganOptions: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>Vegan Options</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.halal}
                onChange={(e) => onChangeFilters({ ...filters, halal: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span>Halal Certified</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.lateNight}
                onChange={(e) => onChangeFilters({ ...filters, lateNight: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-indigo-400" /> Open Late Night
              </span>
            </label>
          </div>

          {/* Column 4: Facilities */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Required Facilities
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.wifi}
                  onChange={(e) => onChangeFilters({ ...filters, wifi: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Wifi className="w-3 h-3 text-blue-500" />
                <span>Wi-Fi</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.parking}
                  onChange={(e) => onChangeFilters({ ...filters, parking: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Car className="w-3 h-3 text-stone-500" />
                <span>Parking</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.outdoorSeating}
                  onChange={(e) => onChangeFilters({ ...filters, outdoorSeating: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <span>Outdoor</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.petFriendly}
                  onChange={(e) => onChangeFilters({ ...filters, petFriendly: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Dog className="w-3 h-3 text-amber-500" />
                <span>Pet-friendly</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.familyFriendly}
                  onChange={(e) => onChangeFilters({ ...filters, familyFriendly: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Users className="w-3 h-3 text-emerald-500" />
                <span>Family</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.quietForWork}
                  onChange={(e) => onChangeFilters({ ...filters, quietForWork: e.target.checked })}
                  className="rounded text-amber-500 accent-amber-500"
                />
                <Laptop className="w-3 h-3 text-indigo-500" />
                <span>Work / Quiet</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Cuisines Horizontal Pills (when expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
            Filter by Cuisines
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {CUISINE_OPTIONS.map((c) => {
              const isSelected = filters.cuisines.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCuisineToggle(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white font-semibold shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
