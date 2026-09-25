import React from 'react';
import { 
  Star, 
  MapPin, 
  Navigation, 
  Heart, 
  Wifi, 
  Car, 
  Sparkles, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Leaf, 
  Dog, 
  Info,
  ExternalLink
} from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
  onViewDetails: (place: Place) => void;
  onGetDirections: (place: Place) => void;
  onSelectMapPin?: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onGetDirections,
  onSelectMapPin,
}) => {
  const matchScore = place.recommendationScore ?? Math.round((place.rating / 5) * 85 + 10);

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Photo Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={place.photos[0]}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* AI Match Badge */}
          <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold shadow-lg shadow-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>{matchScore}% Match</span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(place.id);
            }}
            className="pointer-events-auto p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-md"
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-rose-500 fill-rose-500' : 'text-stone-700 dark:text-stone-200'
              }`} 
            />
          </button>
        </div>

        {/* Bottom Image Info: Open Status & Distance */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md flex items-center gap-1 ${
              place.openingHours.isOpenNow 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-rose-500/90 text-white'
            }`}>
              <Clock className="w-3 h-3" />
              {place.openingHours.isOpenNow ? 'Open Now' : 'Closed'}
            </span>

            {place.dietary.isVegetarianOnly && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-600/90 text-white backdrop-blur-md flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Pure Veg
              </span>
            )}

            {place.dietary.isHalal && !place.dietary.isVegetarianOnly && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-600/90 text-white backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Halal
              </span>
            )}
          </div>

          <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{place.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Name & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 
              onClick={() => onViewDetails(place)}
              className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
            >
              {place.name}
            </h3>

            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-xs text-amber-900 dark:text-amber-200">
                {place.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">
                ({place.reviewCount > 999 ? `${(place.reviewCount / 1000).toFixed(1)}k` : place.reviewCount})
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
            {place.tagline}
          </p>

          {/* Cuisines & Price */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
            <span className="font-extrabold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
              {place.priceRange} ({place.currency}{place.averageCostForTwo} for two)
            </span>
            {place.cuisines.slice(0, 2).map((c) => (
              <span
                key={c}
                className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md text-[11px]"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Key Facility Chips */}
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-4 flex-wrap">
            {place.facilities.wifi && (
              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[11px] font-medium">
                <Wifi className="w-3 h-3" />
                {place.facilities.wifiSpeedMbps ? `${place.facilities.wifiSpeedMbps}M Wi-Fi` : 'Wi-Fi'}
              </span>
            )}
            {place.facilities.powerSockets && (
              <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-[11px] font-medium">
                <Zap className="w-3 h-3" /> Sockets
              </span>
            )}
            {place.facilities.parking && (
              <span className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded text-[11px] font-medium">
                <Car className="w-3 h-3" /> Parking
              </span>
            )}
            {place.facilities.petFriendly && (
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                <Dog className="w-3 h-3" /> Pet Friendly
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mb-4 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            <span className="truncate">{place.address}, {place.city}</span>
          </div>

          {/* AI Match Rationale Pill */}
          {place.aiMatchRationale && (
            <div className="mb-4 p-2 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200">
              <span className="font-semibold text-amber-600 dark:text-amber-400 mr-1">Why it matches:</span>
              {place.aiMatchRationale}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => onViewDetails(place)}
            className="w-full py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onGetDirections(place)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
