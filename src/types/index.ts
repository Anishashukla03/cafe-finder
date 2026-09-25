export type PlaceCategory = 
  | 'all'
  | 'cafe' 
  | 'restaurant' 
  | 'coffee' 
  | 'fast_food' 
  | 'fine_dining' 
  | 'dessert' 
  | 'vegetarian' 
  | 'family' 
  | 'study_work';

export type AmbienceType = 
  | 'Peaceful & Quiet' 
  | 'Lively & Buzzing' 
  | 'Cozy & Aesthetic' 
  | 'Romantic & Candlelit' 
  | 'Rooftop & Scenic' 
  | 'Modern Minimalist'
  | 'Family Casual';

export type PriceLevel = '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';

export interface MenuItem {
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isPopular?: boolean;
}

export interface PopularDish {
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isChefSpecial?: boolean;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  sentiment?: 'positive' | 'neutral' | 'critical';
  purpose?: string;
}

export interface Place {
  id: string;
  name: string;
  tagline: string;
  category: PlaceCategory;
  photos: string[];
  rating: number;
  reviewCount: number;
  cuisines: string[];
  priceRange: PriceLevel;
  averageCostForTwo: number;
  currency: string;
  distanceKm: number;
  address: string;
  locality: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  website?: string;
  openingHours: {
    days: string;
    open: string;
    close: string;
    isOpenNow: boolean;
    lateNight: boolean;
  };
  dietary: {
    isVegetarianOnly: boolean;
    hasVegetarianOptions: boolean;
    hasVeganOptions: boolean;
    isHalal: boolean;
    glutenFreeAvailable: boolean;
  };
  facilities: {
    wifi: boolean;
    wifiSpeedMbps?: number;
    powerSockets: boolean;
    parking: boolean;
    outdoorSeating: boolean;
    petFriendly: boolean;
    familyFriendly: boolean;
    quietForWork: boolean;
    airConditioning: boolean;
    takesReservations: boolean;
    wheelchairAccessible: boolean;
  };
  ambience: AmbienceType;
  popularDishes: PopularDish[];
  menuCategories: {
    category: string;
    items: MenuItem[];
  }[];
  reviews: Review[];
  googleMapsUrl: string;
  // Computed recommendation properties
  recommendationScore?: number;
  scoreBreakdown?: {
    locationRelevance: number;
    userPreferences: number;
    ratingScore: number;
    priceCompatibility: number;
    distanceScore: number;
    facilityMatch: number;
    cuisineMatch: number;
    openingStatus: number;
  };
  aiMatchRationale?: string;
}

export interface FilterState {
  searchQuery: string;
  location: string;
  category: PlaceCategory;
  maxDistanceKm: number;
  minRating: number;
  priceLevels: PriceLevel[];
  maxBudget?: number;
  cuisines: string[];
  vegetarianOnly: boolean;
  veganOptions: boolean;
  halal: boolean;
  wifi: boolean;
  parking: boolean;
  outdoorSeating: boolean;
  familyFriendly: boolean;
  petFriendly: boolean;
  quietForWork: boolean;
  openNow: boolean;
  lateNight: boolean;
  sortBy: 'score' | 'rating' | 'distance' | 'priceAsc' | 'priceDesc' | 'reviews';
}

export interface UserPreferences {
  name: string;
  defaultLocation: string;
  dietary: {
    vegetarianOnly: boolean;
    vegan: boolean;
    halal: boolean;
    glutenFree: boolean;
  };
  budgetPreference: PriceLevel[];
  favoriteCuisines: string[];
  preferredAmbience: string[];
  mustHaveFacilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPlaces?: Place[];
  reasoning?: string;
  groundingUrls?: { title: string; uri: string }[];
}

export interface PerfectPlaceWizardAnswers {
  placeType: string;
  location: string;
  budget: PriceLevel;
  cuisines: string[];
  ambience: AmbienceType;
  maxDistanceKm: number;
  facilities: string[];
  notes?: string;
}
