import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Navigation, 
  Heart, 
  Wifi, 
  Car, 
  Zap, 
  Dog, 
  Users, 
  Laptop, 
  Wind, 
  Calendar, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Send,
  ThumbsUp
} from 'lucide-react';
import { Place, Review } from '../types';

interface PlaceDetailsModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
  onGetDirections: (place: Place) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onGetDirections,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'facilities' | 'reviews'>('overview');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  // Sync reviews when place changes
  React.useEffect(() => {
    if (place) {
      setReviewsList(place.reviews);
      setActivePhotoIndex(0);
      setActiveTab('overview');
    }
  }, [place]);

  if (!isOpen || !place) return null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewName.trim() || 'Foodie Explorer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim(),
      sentiment: 'positive',
      purpose: 'Casual visit'
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    setNewReviewName('');
  };

  const matchScore = place.recommendationScore ?? Math.round((place.rating / 5) * 85 + 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(place.id)}
            className="p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:scale-110 active:scale-95 transition-all shadow-md"
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shadow-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Main Photo Gallery */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-950 overflow-hidden">
            <img
              src={place.photos[activePhotoIndex] || place.photos[0]}
              alt={place.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto py-1">
                {place.photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-14 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIndex === idx 
                        ? 'border-amber-400 scale-105 shadow-md' 
                        : 'border-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Match Score Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/90 backdrop-blur-md text-white font-extrabold text-xs shadow-lg">
                <Sparkles className="w-4 h-4 fill-white" />
                <span>{matchScore}% Match Score</span>
              </div>
            </div>
          </div>

          {/* Place Heading & Metadata */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                    {place.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    place.openingHours.isOpenNow 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {place.openingHours.isOpenNow ? 'Open Now' : 'Closed'}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    {place.openingHours.open} - {place.openingHours.close}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                  {place.name}
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
                  {place.tagline}
                </p>
              </div>

              {/* Rating Box */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 rounded-2xl text-center shrink-0">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-xl">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  {place.reviewCount.toLocaleString()} Reviews
                </div>
              </div>
            </div>

            {/* Quick Details Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 mb-6 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Price for Two</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {place.priceRange} ({place.currency}{place.averageCostForTwo})
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Distance</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {place.distanceKm} km from you
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Ambience</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {place.ambience}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Wi-Fi</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                  {place.facilities.wifi ? (place.facilities.wifiSpeedMbps ? `${place.facilities.wifiSpeedMbps} Mbps` : 'Available') : 'None'}
                </span>
              </div>
            </div>

            {/* AI Recommendation Score Breakdown Box */}
            <div className="mb-8 p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                  AI Recommendation Score Analysis: <span className="text-amber-600 dark:text-amber-400">{matchScore}% Match</span>
                </h3>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">
                {place.aiMatchRationale || `Calculated considering location proximity (${place.distanceKm}km), rating (${place.rating}★), price compatibility, facility match, and ambience.`}
              </p>

              {/* Progress Factors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <span>Location Proximity</span>
                    <span className="text-amber-600">95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <span>Quality & Ratings</span>
                    <span className="text-amber-600">98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <span>Budget Fit</span>
                    <span className="text-amber-600">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <span>Facilities Match</span>
                    <span className="text-amber-600">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 mb-6 gap-6 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Overview & Specials
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'menu'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Full Menu
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facilities')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'facilities'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Facilities & Hours
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Reviews ({reviewsList.length})
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Popular Dishes */}
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Popular & Chef Signature Dishes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {place.popularDishes.map((dish, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                          {dish.isChefSpecial && (
                            <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                              Must Try
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">
                              {dish.name}
                            </span>
                            <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400 shrink-0">
                              {place.currency}{dish.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                            {dish.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Contact Info Box */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" /> Location & Directions
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 mb-1">
                      {place.address}, {place.locality}, {place.city}
                    </p>
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold hover:underline mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-500" /> Phone & Reservations
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 mb-1">
                      {place.phone}
                    </p>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Instant reservations accepted
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MENU TAB */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                {place.menuCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-stone-200 dark:border-stone-800 pb-1.5">
                      {cat.category}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex justify-between gap-3"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="font-bold text-xs text-stone-900 dark:text-white">
                                {item.name}
                              </span>
                              {item.isPopular && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">
                              {item.description}
                            </p>
                          </div>
                          <span className="font-extrabold text-xs text-stone-900 dark:text-stone-100 shrink-0">
                            {place.currency}{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. FACILITIES & HOURS TAB */}
            {activeTab === 'facilities' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-3">
                    Available Amenities & Facilities
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-semibold block">High-Speed Wi-Fi</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.wifiSpeedMbps ? `${place.facilities.wifiSpeedMbps} Mbps verified` : 'Complimentary'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="font-semibold block">Power Sockets</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.powerSockets ? 'Under all tables' : 'Limited'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Car className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                      <div>
                        <span className="font-semibold block">Valet & Parking</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.parking ? 'Dedicated on-site' : 'Street parking'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Dog className="w-4 h-4 text-amber-500" />
                      <div>
                        <span className="font-semibold block">Pet Friendly</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.petFriendly ? 'Dogs & cats welcome' : 'Not permitted'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="font-semibold block">Family Friendly</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.familyFriendly ? 'High chairs available' : 'Adults focused'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
                      <Laptop className="w-4 h-4 text-indigo-500" />
                      <div>
                        <span className="font-semibold block">Quiet Zone</span>
                        <span className="text-[10px] text-stone-400">
                          {place.facilities.quietForWork ? 'Ideal for study/calls' : 'Lively ambience'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Hours Table */}
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-2">
                    Operating Schedule
                  </h4>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                        {place.openingHours.days}
                      </span>
                      <span className="text-stone-500">
                        {place.openingHours.open} - {place.openingHours.close}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      place.openingHours.isOpenNow 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-rose-500 text-white'
                    }`}>
                      {place.openingHours.isOpenNow ? 'Currently Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Write a review box */}
                <form 
                  onSubmit={handleAddReview} 
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3"
                >
                  <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200">
                    Write a Review & Experience
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <span>Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Share your experience (Wi-Fi speed, coffee, food taste, seating)..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-xs text-stone-900 dark:text-white block">
                              {rev.author}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {rev.date} • {rev.purpose || 'Verified Diner'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs text-stone-500 dark:text-stone-400">
            <strong className="text-stone-800 dark:text-stone-200 font-bold">{place.name}</strong> • {place.locality}, {place.city}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${place.phone}`}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Place</span>
            </a>

            <button
              type="button"
              onClick={() => onGetDirections(place)}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
