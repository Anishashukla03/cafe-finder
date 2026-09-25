import React, { useState } from 'react';
import { 
  X, 
  Navigation, 
  MapPin, 
  Car, 
  Footprints, 
  Bike, 
  ExternalLink, 
  Clock, 
  Check, 
  Copy,
  ChevronRight
} from 'lucide-react';
import { Place } from '../types';

interface DirectionsModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  userLocationName: string;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  place,
  isOpen,
  onClose,
  userLocationName
}) => {
  const [selectedMode, setSelectedMode] = useState<'drive' | 'walk' | 'bike'>('drive');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !place) return null;

  const distance = place.distanceKm;
  // Estimate travel times based on distance
  const driveMinutes = Math.max(3, Math.round(distance * 3.5));
  const walkMinutes = Math.max(8, Math.round(distance * 13));
  const bikeMinutes = Math.max(5, Math.round(distance * 5));

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}&destination_place_id=${encodeURIComponent(place.name)}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${place.name}, ${place.address}, ${place.city}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                Get Directions
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Route to <strong className="text-stone-700 dark:text-stone-300">{place.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Origin & Destination Route Card */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5 shadow-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-stone-400 block font-medium">Starting from</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate block">
                  Your Current Location ({userLocationName})
                </span>
              </div>
            </div>

            <div className="h-4 border-l-2 border-dashed border-stone-300 dark:border-stone-700 ml-2" />

            <div className="flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5 shadow-sm">
                B
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-stone-400 block font-medium">Destination</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate block">
                  {place.name}
                </span>
                <span className="text-[11px] text-stone-500 truncate block">
                  {place.address}, {place.city}
                </span>
              </div>
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Select Mode of Transit
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode('drive')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMode === 'drive'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <Car className="w-5 h-5 mx-auto mb-1 text-stone-700 dark:text-stone-300" />
                <span className="font-extrabold text-sm text-stone-900 dark:text-white block">
                  ~{driveMinutes} min
                </span>
                <span className="text-[11px] text-stone-400">Driving • {distance} km</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('walk')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMode === 'walk'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <Footprints className="w-5 h-5 mx-auto mb-1 text-stone-700 dark:text-stone-300" />
                <span className="font-extrabold text-sm text-stone-900 dark:text-white block">
                  ~{walkMinutes} min
                </span>
                <span className="text-[11px] text-stone-400">Walking • {distance} km</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('bike')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMode === 'bike'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <Bike className="w-5 h-5 mx-auto mb-1 text-stone-700 dark:text-stone-300" />
                <span className="font-extrabold text-sm text-stone-900 dark:text-white block">
                  ~{bikeMinutes} min
                </span>
                <span className="text-[11px] text-stone-400">Cycling • {distance} km</span>
              </button>
            </div>
          </div>

          {/* Turn-by-Turn preview steps */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-700 dark:text-stone-300 block">
              Route Highlights
            </span>
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Head towards main avenue ({distance > 2 ? 'via Sector road / Arterial' : 'direct street'})</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                <span>Arrive at {place.locality}, destination on your right</span>
              </div>
              {place.facilities.parking && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Dedicated parking available directly on premises</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCopyAddress}
              className="py-3 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Address Copied!' : 'Copy Full Address'}</span>
            </button>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Launch Live Google Maps Turn-by-Turn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
