import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Place } from '../types';
import { 
  MapPin, 
  Navigation, 
  Star, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Heart,
  ChevronRight,
  Maximize2,
  Crosshair,
  Wifi
} from 'lucide-react';

interface InteractiveMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onViewDetails: (place: Place) => void;
  onGetDirections: (place: Place) => void;
  userCoordinates?: { lat: number; lng: number };
  onCenterUser?: () => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onViewDetails,
  onGetDirections,
  userCoordinates = { lat: 30.7333, lng: 76.7794 },
  onCenterUser
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Initialize or re-center map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Determine initial center
      const initialLat = selectedPlace ? selectedPlace.coordinates.lat : userCoordinates.lat;
      const initialLng = selectedPlace ? selectedPlace.coordinates.lng : userCoordinates.lng;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
      });

      // CartoDB Voyager or OpenStreetMap standard tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old place markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add User Location Pulse Pin
    if (userCoordinates) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background-color: #2563eb; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userCoordinates.lat, userCoordinates.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('Your Location', { permanent: false, direction: 'top' });
    }

    // Add place markers
    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const rating = place.rating.toFixed(1);

      const markerHtml = `
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: ${isSelected ? '#ea580c' : '#1c1917'};
          color: white;
          padding: 4px 8px;
          border-radius: 9999px;
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transform: scale(${isSelected ? '1.18' : '1'});
          transition: transform 0.2s ease, background 0.2s ease;
        ">
          <span>☕ ${place.name.split(' ')[0]}</span>
          <span style="background: rgba(255,255,255,0.2); padding: 1px 4px; border-radius: 4px; font-size: 10px;">★${rating}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: markerHtml,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          onSelectPlace(place);
        });

      markersRef.current[place.id] = marker;
    });

    // Fit bounds if multiple places exist
    if (places.length > 0 && !selectedPlace) {
      const bounds = L.latLngBounds(places.map((p) => [p.coordinates.lat, p.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    return () => {
      // Map stays mounted
    };
  }, [places, userCoordinates]);

  // When selected place changes, center the map smoothly
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return;
    mapInstanceRef.current.flyTo(
      [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
      15,
      { duration: 1.2 }
    );
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control: Recenter GPS */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={onCenterUser}
          title="Recenter on my location"
          className="p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-amber-500 hover:bg-stone-50 transition-all active:scale-95"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Bottom Card: Selected Place Summary */}
      {selectedPlace && (
        <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:w-96 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex gap-3 items-start">
            <img
              src={selectedPlace.photos[0]}
              alt={selectedPlace.name}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                  {selectedPlace.category.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  {selectedPlace.rating.toFixed(1)}
                </span>
              </div>

              <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                {selectedPlace.name}
              </h4>

              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mb-1">
                {selectedPlace.address}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                <span className="font-bold text-stone-800 dark:text-stone-200">{selectedPlace.priceRange}</span>
                <span>•</span>
                <span>{selectedPlace.distanceKm} km away</span>
                <span>•</span>
                <span className={selectedPlace.openingHours.isOpenNow ? 'text-emerald-500 font-bold' : 'text-rose-500'}>
                  {selectedPlace.openingHours.isOpenNow ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => onViewDetails(selectedPlace)}
              className="py-1.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center transition-colors"
            >
              Full Details
            </button>
            <button
              type="button"
              onClick={() => onGetDirections(selectedPlace)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 transition-all"
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
