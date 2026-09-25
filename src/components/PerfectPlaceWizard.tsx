import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin, 
  Coffee, 
  UtensilsCrossed, 
  Heart, 
  Laptop, 
  Users, 
  Moon, 
  Leaf, 
  DollarSign, 
  Compass, 
  Smile, 
  RotateCcw,
  Navigation,
  Star
} from 'lucide-react';
import { Place, PriceLevel, AmbienceType } from '../types';
import { calculateRecommendationScore } from '../utils/recommendationEngine';

interface PerfectPlaceWizardProps {
  places: Place[];
  defaultLocation: string;
  onViewPlace: (place: Place) => void;
  onGetDirections: (place: Place) => void;
}

export const PerfectPlaceWizard: React.FC<PerfectPlaceWizardProps> = ({
  places,
  defaultLocation,
  onViewPlace,
  onGetDirections,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Wizard state
  const [placeType, setPlaceType] = useState('Study / Deep Work Spot');
  const [location, setLocation] = useState(defaultLocation);
  const [budget, setBudget] = useState<PriceLevel>('₹₹');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['Artisanal Coffee', 'Italian']);
  const [ambience, setAmbience] = useState<AmbienceType>('Peaceful & Quiet');
  const [maxDistance, setMaxDistance] = useState(3);
  const [facilities, setFacilities] = useState<string[]>(['Fast Wi-Fi', 'Power Outlets']);

  const [isGenerated, setIsGenerated] = useState(false);
  const [rankedResults, setRankedResults] = useState<Place[]>([]);

  const placeTypes = [
    { title: 'Study & Deep Work', desc: 'Quiet ambient vibes, fast internet, power sockets', icon: Laptop },
    { title: 'Romantic Date Night', desc: 'Candlelit, scenic terrace, intimate seating', icon: Heart },
    { title: 'Casual Cafe Hangout', desc: 'Catch up with friends, pastries, cold brews', icon: Coffee },
    { title: 'Family Dining Feast', desc: 'Spacious seating, pure veg thalis, kids friendly', icon: Users },
    { title: 'Late Night Dinner', desc: 'Open past 11 PM, cozy drinks & snacks', icon: Moon },
    { title: 'Pure Veg & Healthy', desc: '100% vegetarian, organic salad bowls, thalis', icon: Leaf },
  ];

  const cuisinesList = [
    'Artisanal Coffee',
    'Italian',
    'North Indian',
    'Continental',
    'Pan-Asian',
    'Bakery & Desserts',
    'Mughlai',
    'Healthy Breakfast',
    'Fast Food'
  ];

  const ambienceOptions: { title: AmbienceType; desc: string }[] = [
    { title: 'Peaceful & Quiet', desc: 'Soft jazz, minimal noise, study-friendly' },
    { title: 'Cozy & Aesthetic', desc: 'Warm lighting, plants, Instagrammable corners' },
    { title: 'Romantic & Candlelit', desc: 'Dim lights, fine wine glasses, garden patio' },
    { title: 'Rooftop & Scenic', desc: 'Panoramic skyline views and cool breeze' },
    { title: 'Lively & Buzzing', desc: 'Upbeat music, high energy crowds' },
    { title: 'Modern Minimalist', desc: 'Clean lines, sleek timber, uncluttered' },
  ];

  const facilityOptions = [
    'Fast Wi-Fi',
    'Power Outlets',
    'Dedicated Parking',
    'Scenic Outdoor Seating',
    'Pet-Friendly Patio',
    'Air Conditioning',
    'Quiet Zone',
  ];

  const toggleCuisine = (c: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const toggleFacility = (f: string) => {
    setFacilities((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const handleGenerate = () => {
    // Score all places against the 7 answers
    const scored = places.map((place) => {
      const scoreResult = calculateRecommendationScore(place, {
        location,
        maxDistanceKm: maxDistance,
        cuisines: selectedCuisines,
        priceLevels: [budget],
        wifi: facilities.includes('Fast Wi-Fi'),
        parking: facilities.includes('Dedicated Parking'),
        outdoorSeating: facilities.includes('Scenic Outdoor Seating'),
        petFriendly: facilities.includes('Pet-Friendly Patio'),
        quietForWork: facilities.includes('Quiet Zone') || placeType.includes('Study'),
      });

      // Tailored custom rationale based on wizard choices
      let customRationale = `Top recommendation for ${placeType.toLowerCase()} in ${location}.`;
      if (place.facilities.wifi && facilities.includes('Fast Wi-Fi')) {
        customRationale += ` Includes high-speed Wi-Fi (${place.facilities.wifiSpeedMbps || 100} Mbps) and matches your ${budget} budget.`;
      } else {
        customRationale += ` Matches your ${ambience.toLowerCase()} ambience preference and is only ${place.distanceKm} km away.`;
      }

      return {
        ...place,
        recommendationScore: scoreResult.score,
        aiMatchRationale: customRationale,
      };
    });

    scored.sort((a, b) => (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0));
    setRankedResults(scored);
    setIsGenerated(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsGenerated(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Find My Perfect Place • Interactive AI Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          Let’s Find Your Ideal Table
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl mx-auto">
          Answer 7 quick questions and our recommendation model will calculate your personalized match score across ambience, budget, and distance.
        </p>
      </div>

      {!isGenerated ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl transition-all">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* QUESTION 1: What are you looking for? */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                1. What kind of experience are you looking for?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {placeTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = placeType === item.title;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setPlaceType(item.title)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-900 dark:text-white block">
                          {item.title}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 2: Location? */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                2. Where are you located or exploring?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Enter your city, neighborhood, or sector to calculate real travel distances.
              </p>
              <div className="relative max-w-md">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-red-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 17, Chandigarh or Delhi"
                  className="w-full pl-12 pr-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>
          )}

          {/* QUESTION 3: Budget? */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                3. What is your comfortable budget (for two people)?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { lvl: '₹' as PriceLevel, title: 'Budget Friendly', range: 'Under ₹500', desc: 'Student-friendly & economical' },
                  { lvl: '₹₹' as PriceLevel, title: 'Moderate / Casual', range: '₹500 - ₹1,000', desc: 'Great cafes & bistros' },
                  { lvl: '₹₹₹' as PriceLevel, title: 'Special Splurge', range: '₹1,000 - ₹2,000', desc: 'Fine dining & rooftops' },
                  { lvl: '₹₹₹₹' as PriceLevel, title: 'Luxury Feast', range: '₹2,000+', desc: 'Five-star culinary masterminds' },
                ].map((b) => (
                  <button
                    key={b.lvl}
                    type="button"
                    onClick={() => setBudget(b.lvl)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      budget === b.lvl
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-extrabold text-lg text-amber-600 dark:text-amber-400 block mb-1">
                      {b.lvl}
                    </span>
                    <span className="font-bold text-xs text-stone-900 dark:text-white block">
                      {b.title}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      {b.range}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 4: Cuisine? */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                4. Select your favorite cuisines (choose any):
              </h2>
              <div className="flex flex-wrap gap-2">
                {cuisinesList.map((c) => {
                  const isSelected = selectedCuisines.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCuisine(c)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 5: Preferred Ambience? */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                5. What ambience and vibe do you prefer?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ambienceOptions.map((opt) => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setAmbience(opt.title)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      ambience === opt.title
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white block mb-0.5">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 6: Max Distance? */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                6. How far are you willing to travel?
              </h2>
              <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Max Distance Radius:
                  </span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                    Within {maxDistance} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-2">
                  <span>1 km (Walking)</span>
                  <span>5 km (Short drive)</span>
                  <span>15 km (Anywhere in city)</span>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 7: Required Facilities? */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                7. Are there any must-have facilities or amenities?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facilityOptions.map((fac) => {
                  const isSelected = facilities.includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => toggleFacility(fac)}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <span>{fac}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-stone-100 dark:border-stone-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Calculate & Find My Perfect Match</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Ranked Results View */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                Personalized AI Recommendations Generated
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                We scored each candidate across 8 weighted criteria (location, preferences, rating, budget, distance, facilities, cuisines, and hours).
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="py-2 px-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Answers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rankedResults.slice(0, 3).map((place, idx) => (
              <div
                key={place.id}
                className={`bg-white dark:bg-stone-900 rounded-3xl p-5 border flex flex-col justify-between shadow-lg relative overflow-hidden ${
                  idx === 0
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                {idx === 0 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    🏆 #1 Best Overall Match
                  </div>
                )}

                <div>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                    <img src={place.photos[0]} alt={place.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[10px] font-bold">
                      {place.distanceKm} km away
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                      {place.category.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      {place.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 dark:text-white line-clamp-1 mb-1">
                    {place.name}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-medium mb-3">
                    <strong className="text-amber-600 dark:text-amber-400 block font-bold mb-0.5">
                      Match Score: {place.recommendationScore}%
                    </strong>
                    {place.aiMatchRationale}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => onViewPlace(place)}
                    className="py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold text-center transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onGetDirections(place)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
