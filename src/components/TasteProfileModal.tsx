import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  SlidersHorizontal, 
  Save, 
  Coffee, 
  Leaf, 
  Heart,
  DollarSign
} from 'lucide-react';
import { UserPreferences, PriceLevel, AmbienceType } from '../types';
import { CUISINE_OPTIONS } from '../data/mockPlaces';

interface TasteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
}

export const TasteProfileModal: React.FC<TasteProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);

  if (!isOpen) return null;

  const handleToggleCuisine = (c: string) => {
    const exists = formData.favoriteCuisines.includes(c);
    const updated = exists
      ? formData.favoriteCuisines.filter((item) => item !== c)
      : [...formData.favoriteCuisines, c];
    setFormData({ ...formData, favoriteCuisines: updated });
  };

  const handleToggleAmbience = (amb: string) => {
    const exists = formData.preferredAmbience.includes(amb);
    const updated = exists
      ? formData.preferredAmbience.filter((item) => item !== amb)
      : [...formData.preferredAmbience, amb];
    setFormData({ ...formData, preferredAmbience: updated });
  };

  const handleToggleBudget = (lvl: PriceLevel) => {
    const exists = formData.budgetPreference.includes(lvl);
    const updated = exists
      ? formData.budgetPreference.filter((b) => b !== lvl)
      : [...formData.budgetPreference, lvl];
    setFormData({ ...formData, budgetPreference: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(formData);
    onClose();
  };

  const ambienceChoices: AmbienceType[] = [
    'Peaceful & Quiet',
    'Cozy & Aesthetic',
    'Romantic & Candlelit',
    'Rooftop & Scenic',
    'Lively & Buzzing',
    'Modern Minimalist',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                Personal Taste Profile
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Customizes all AI match scores & recommendations
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Section 1: Dietary Restrictions */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Dietary Preferences
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dietary.vegetarianOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary: { ...formData.dietary, vegetarianOnly: e.target.checked },
                    })
                  }
                  className="rounded text-amber-500 accent-amber-500"
                />
                <span className="font-semibold text-stone-800 dark:text-stone-200">100% Pure Veg Only</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dietary.vegan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary: { ...formData.dietary, vegan: e.target.checked },
                    })
                  }
                  className="rounded text-amber-500 accent-amber-500"
                />
                <span className="font-semibold text-stone-800 dark:text-stone-200">Vegan Friendly</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dietary.halal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary: { ...formData.dietary, halal: e.target.checked },
                    })
                  }
                  className="rounded text-amber-500 accent-amber-500"
                />
                <span className="font-semibold text-stone-800 dark:text-stone-200">Halal Meat</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dietary.glutenFree}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary: { ...formData.dietary, glutenFree: e.target.checked },
                    })
                  }
                  className="rounded text-amber-500 accent-amber-500"
                />
                <span className="font-semibold text-stone-800 dark:text-stone-200">Gluten-Free</span>
              </label>
            </div>
          </div>

          {/* Section 2: Budget Preference */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Typical Dining Budget
            </span>
            <div className="grid grid-cols-4 gap-2">
              {(['₹', '₹₹', '₹₹₹', '₹₹₹₹'] as PriceLevel[]).map((lvl) => {
                const isSelected = formData.budgetPreference.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleToggleBudget(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Favorite Cuisines */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Favorite Cuisines
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {CUISINE_OPTIONS.filter((c) => c !== 'All Cuisines').map((c) => {
                const isSelected = formData.favoriteCuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleToggleCuisine(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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

          {/* Section 4: Preferred Ambience */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Preferred Ambience & Vibe
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ambienceChoices.map((amb) => {
                const isSelected = formData.preferredAmbience.includes(amb);
                return (
                  <button
                    key={amb}
                    type="button"
                    onClick={() => handleToggleAmbience(amb)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>{amb}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Taste Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
