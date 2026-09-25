import { Place, FilterState, UserPreferences } from '../types';

export interface ScoreResult {
  score: number;
  breakdown: {
    locationRelevance: number;
    userPreferences: number;
    ratingScore: number;
    priceCompatibility: number;
    distanceScore: number;
    facilityMatch: number;
    cuisineMatch: number;
    openingStatus: number;
  };
  rationale: string;
}

export function calculateRecommendationScore(
  place: Place,
  filters: Partial<FilterState>,
  userPreferences?: UserPreferences
): ScoreResult {
  // 1. Location Relevance (max 15)
  let locationRelevance = 10;
  if (filters.location) {
    const locLower = filters.location.toLowerCase();
    if (
      place.city.toLowerCase().includes(locLower) ||
      place.locality.toLowerCase().includes(locLower) ||
      place.address.toLowerCase().includes(locLower)
    ) {
      locationRelevance = 15;
    } else if (filters.location.includes('near') || filters.location.includes('Current')) {
      locationRelevance = place.distanceKm <= 3 ? 15 : place.distanceKm <= 6 ? 12 : 8;
    }
  }

  // 2. User Preferences (max 15)
  let userPrefScore = 10;
  if (userPreferences) {
    let prefHits = 0;
    let prefChecks = 0;

    // Dietary
    if (userPreferences.dietary.vegetarianOnly) {
      prefChecks++;
      if (place.dietary.isVegetarianOnly || place.dietary.hasVegetarianOptions) prefHits++;
    }
    if (userPreferences.dietary.vegan) {
      prefChecks++;
      if (place.dietary.hasVeganOptions) prefHits++;
    }
    if (userPreferences.dietary.halal) {
      prefChecks++;
      if (place.dietary.isHalal) prefHits++;
    }

    // Favorite cuisines
    if (userPreferences.favoriteCuisines.length > 0) {
      prefChecks++;
      const hasFav = place.cuisines.some((c) =>
        userPreferences.favoriteCuisines.some((fc) => c.toLowerCase().includes(fc.toLowerCase()))
      );
      if (hasFav) prefHits++;
    }

    // Preferred Ambience
    if (userPreferences.preferredAmbience.length > 0) {
      prefChecks++;
      if (userPreferences.preferredAmbience.includes(place.ambience)) {
        prefHits++;
      }
    }

    userPrefScore = prefChecks > 0 ? Math.round((prefHits / prefChecks) * 15) : 12;
  }

  // 3. Rating & Reviews (max 15)
  // 5.0 rating = 13.5 pts + review volume weight up to 1.5 pts
  const ratingNormalized = (place.rating / 5) * 13.5;
  const reviewBonus = Math.min(1.5, (place.reviewCount / 2000) * 1.5);
  const ratingScore = Math.round((ratingNormalized + reviewBonus) * 10) / 10;

  // 4. Price Compatibility (max 15)
  let priceCompatibility = 12;
  if (filters.maxBudget && filters.maxBudget > 0) {
    if (place.averageCostForTwo <= filters.maxBudget) {
      priceCompatibility = 15;
    } else if (place.averageCostForTwo <= filters.maxBudget * 1.25) {
      priceCompatibility = 9;
    } else {
      priceCompatibility = 4;
    }
  } else if (filters.priceLevels && filters.priceLevels.length > 0) {
    if (filters.priceLevels.includes(place.priceRange)) {
      priceCompatibility = 15;
    } else {
      priceCompatibility = 8;
    }
  }

  // 5. Distance (max 10)
  let distanceScore = 10;
  if (place.distanceKm <= 1.5) {
    distanceScore = 10;
  } else if (place.distanceKm <= 3.0) {
    distanceScore = 9;
  } else if (place.distanceKm <= 5.0) {
    distanceScore = 7;
  } else if (place.distanceKm <= 10.0) {
    distanceScore = 5;
  } else {
    distanceScore = 3;
  }

  // 6. Requested Facilities (max 15)
  let requestedFacilities = 0;
  let matchedFacilities = 0;

  if (filters.wifi) {
    requestedFacilities++;
    if (place.facilities.wifi) matchedFacilities++;
  }
  if (filters.parking) {
    requestedFacilities++;
    if (place.facilities.parking) matchedFacilities++;
  }
  if (filters.outdoorSeating) {
    requestedFacilities++;
    if (place.facilities.outdoorSeating) matchedFacilities++;
  }
  if (filters.familyFriendly) {
    requestedFacilities++;
    if (place.facilities.familyFriendly) matchedFacilities++;
  }
  if (filters.petFriendly) {
    requestedFacilities++;
    if (place.facilities.petFriendly) matchedFacilities++;
  }
  if (filters.quietForWork) {
    requestedFacilities++;
    if (place.facilities.quietForWork) matchedFacilities++;
  }

  let facilityMatch = 12;
  if (requestedFacilities > 0) {
    facilityMatch = Math.round((matchedFacilities / requestedFacilities) * 15);
  }

  // 7. Cuisine Match (max 10)
  let cuisineMatch = 8;
  if (filters.cuisines && filters.cuisines.length > 0 && !filters.cuisines.includes('All Cuisines')) {
    const matches = place.cuisines.some((c) =>
      filters.cuisines!.some((fc) => c.toLowerCase().includes(fc.toLowerCase()))
    );
    cuisineMatch = matches ? 10 : 3;
  }

  // 8. Opening Status (max 10)
  let openingStatus = 8;
  if (place.openingHours.isOpenNow) {
    openingStatus = 10;
  } else if (filters.openNow) {
    openingStatus = 2;
  }
  if (filters.lateNight && place.openingHours.lateNight) {
    openingStatus = 10;
  }

  // Total Score (0-100)
  const total = Math.min(
    100,
    Math.round(
      locationRelevance +
      userPrefScore +
      ratingScore +
      priceCompatibility +
      distanceScore +
      facilityMatch +
      cuisineMatch +
      openingStatus
    )
  );

  // Generate rationale
  const rationaleParts: string[] = [];
  if (ratingScore >= 13) {
    rationaleParts.push(`exceptional ${place.rating}★ rating from ${place.reviewCount.toLocaleString()} foodies`);
  }
  if (filters.wifi && place.facilities.wifi) {
    rationaleParts.push(place.facilities.wifiSpeedMbps ? `high-speed ${place.facilities.wifiSpeedMbps} Mbps Wi-Fi` : 'reliable Wi-Fi');
  }
  if (filters.quietForWork || place.facilities.quietForWork) {
    rationaleParts.push('peaceful ambient environment for focused work/study');
  }
  if (place.facilities.outdoorSeating && filters.outdoorSeating) {
    rationaleParts.push('lovely scenic outdoor seating');
  }
  if (filters.vegetarianOnly && place.dietary.isVegetarianOnly) {
    rationaleParts.push('100% pure vegetarian kitchen');
  }
  if (place.distanceKm <= 2) {
    rationaleParts.push(`ultra-close (${place.distanceKm} km away)`);
  }

  const rationale = rationaleParts.length > 0
    ? `Matches your request with ${rationaleParts.slice(0, 3).join(', ')}.`
    : `Top recommended based on location proximity (${place.distanceKm} km), ${place.rating}★ rating, and ${place.ambience.toLowerCase()} vibes.`;

  return {
    score: total,
    breakdown: {
      locationRelevance,
      userPreferences: userPrefScore,
      ratingScore,
      priceCompatibility,
      distanceScore,
      facilityMatch,
      cuisineMatch,
      openingStatus
    },
    rationale
  };
}
