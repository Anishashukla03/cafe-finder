import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  Navigation, 
  Info, 
  MapPin, 
  Star, 
  Clock, 
  Edit3, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Place } from '../types';

interface FavoritesViewProps {
  favoritePlaces: Place[];
  onRemoveFavorite: (placeId: string) => void;
  onViewDetails: (place: Place) => void;
  onGetDirections: (place: Place) => void;
  onExploreMore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoritePlaces,
  onRemoveFavorite,
  onViewDetails,
  onGetDirections,
  onExploreMore,
}) => {
  const [personalNotes, setPersonalNotes] = useState<{ [id: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('cafefinder_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const handleSaveNote = (placeId: string) => {
    const updated = { ...personalNotes, [placeId]: tempNoteText };
    setPersonalNotes(updated);
    try {
      localStorage.setItem('cafefinder_notes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setEditingNoteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            Your Saved Spots & Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {favoritePlaces.length} {favoritePlaces.length === 1 ? 'place' : 'places'} saved with your personal taste notes.
          </p>
        </div>

        {favoritePlaces.length > 0 && (
          <button
            type="button"
            onClick={onExploreMore}
            className="py-2.5 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Discover More Places</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {favoritePlaces.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-extrabold text-lg text-stone-900 dark:text-white mb-1">
            No saved spots yet
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6">
            Click the heart icon on any cafe or restaurant card to save your favorite coffee spots, quiet study nooks, or date-night dinners!
          </p>
          <button
            type="button"
            onClick={onExploreMore}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            Explore Cafes & Restaurants
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePlaces.map((place) => {
            const isEditingNote = editingNoteId === place.id;
            const currentNote = personalNotes[place.id];

            return (
              <div
                key={place.id}
                className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(place.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-stone-900/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-md"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md">
                        {place.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
                        {place.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3
                        onClick={() => onViewDetails(place)}
                        className="font-bold text-base text-stone-900 dark:text-white hover:text-amber-500 cursor-pointer truncate"
                      >
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mb-3">
                      {place.address}, {place.city}
                    </p>

                    {/* Personal Note Box */}
                    <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Personal Visit Note
                        </span>
                        {!isEditingNote && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(place.id);
                              setTempNoteText(currentNote || '');
                            }}
                            className="text-[10px] text-amber-600 hover:underline font-semibold"
                          >
                            {currentNote ? 'Edit' : '+ Add Note'}
                          </button>
                        )}
                      </div>

                      {isEditingNote ? (
                        <div className="space-y-2 mt-1">
                          <input
                            type="text"
                            placeholder="e.g. Try the Ethiopian pour-over on weekends!"
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-stone-800 rounded-xl text-xs border border-amber-300 dark:border-amber-700 text-stone-800 dark:text-stone-200 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 text-[11px] rounded-lg text-stone-500 hover:bg-stone-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveNote(place.id)}
                              className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500 text-white font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                          {currentNote || 'No notes added yet. Click edit to jot down dishes or table tips!'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails(place)}
                    className="py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onGetDirections(place)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
