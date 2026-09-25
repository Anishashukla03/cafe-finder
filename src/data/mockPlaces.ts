import { Place } from '../types';

export const INITIAL_PLACES: Place[] = [
  {
    id: 'cafe-artisan-roastery',
    name: 'Artisan Roastery & Co.',
    tagline: 'Single-origin specialty brew bar with quiet study nooks and artisan sourdough',
    category: 'study_work',
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 1240,
    cuisines: ['Artisanal Coffee', 'European Bakery', 'Healthy Breakfast'],
    priceRange: '₹₹',
    averageCostForTwo: 550,
    currency: '₹',
    distanceKm: 1.2,
    address: 'SCO 42, Inner Market, Sector 9-D',
    locality: 'Sector 9',
    city: 'Chandigarh',
    coordinates: { lat: 30.7415, lng: 76.7932 },
    phone: '+91 98765 43210',
    website: 'https://artisanroastery.example.com',
    openingHours: {
      days: 'Mon - Sun',
      open: '08:00 AM',
      close: '11:00 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      wifiSpeedMbps: 120,
      powerSockets: true,
      parking: true,
      outdoorSeating: true,
      petFriendly: true,
      familyFriendly: true,
      quietForWork: true,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Peaceful & Quiet',
    popularDishes: [
      {
        name: 'Pour-Over Ethiopian Yirgacheffe',
        price: 240,
        description: 'Floral notes with bergamot and bright citrus finish brewed on V60',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Avocado Tartine on Artisan Sourdough',
        price: 360,
        description: 'Hass avocado, chili flakes, feta crumbles, and micro-herbs',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Smoked Salmon Brioche Benedict',
        price: 440,
        description: 'Poached free-range eggs, smoked salmon, velvety hollandaise',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Coffee & Brew Bar',
        items: [
          { name: 'Cold Brew Citrus Tonic', price: 260, description: '18-hour cold steeped brew with blood orange tonic', isVeg: true, isPopular: true },
          { name: 'Oat Milk Flat White', price: 230, description: 'Double ristretto with silky micro-foam', isVeg: true, isPopular: true },
          { name: 'Spanish Latte', price: 250, description: 'Espresso sweetened with condensed milk over ice', isVeg: true }
        ]
      },
      {
        category: 'All-Day Brunch & Kitchen',
        items: [
          { name: 'Truffle Mushroom Melt Panini', price: 340, description: 'Portobello and button mushrooms, fontina cheese', isVeg: true, isPopular: true },
          { name: 'Acai Superfood Bowl', price: 380, description: 'Blended organic acai, chia seeds, fresh berries, toasted coconut', isVeg: true }
        ]
      },
      {
        category: 'Pastries & Bakes',
        items: [
          { name: 'Almond Twice-Baked Croissant', price: 190, description: 'Filled with almond frangipane and topped with toasted flakes', isVeg: true, isPopular: true },
          { name: 'Basque Burnt Cheesecake', price: 280, description: 'Caramelized crust with creamy melted center', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2 days ago',
        purpose: 'Studying',
        comment: 'Hands down the best place in the city for focused work! High-speed Wi-Fi (120 Mbps), power sockets under every booth, and peaceful ambient jazz music. The pour-over is magnificent.',
        sentiment: 'positive'
      },
      {
        id: 'rev-2',
        author: 'Arjun Mehta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '1 week ago',
        purpose: 'Quick coffee',
        comment: 'Outdoor seating surrounded by greenery. Dogs are welcomed with fresh water bowls. Try their sourdough tartine!',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Artisan+Roastery+Sector+9+Chandigarh'
  },
  {
    id: 'olive-bistro-garden',
    name: 'Olive Grove & Trattoria',
    tagline: 'Romantic candlelit Mediterranean dining in a lush garden conservatory',
    category: 'fine_dining',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 980,
    cuisines: ['Italian', 'Mediterranean', 'Wood-fired Pizza'],
    priceRange: '₹₹₹',
    averageCostForTwo: 1600,
    currency: '₹',
    distanceKm: 2.8,
    address: 'SCO 18, Heritage Courtyard, Sector 26',
    locality: 'Sector 26',
    city: 'Chandigarh',
    coordinates: { lat: 30.7258, lng: 76.8042 },
    phone: '+91 99123 45678',
    website: 'https://olivegrove.example.com',
    openingHours: {
      days: 'Mon - Sun',
      open: '12:00 PM',
      close: '12:00 AM',
      isOpenNow: true,
      lateNight: true
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      powerSockets: false,
      parking: true,
      outdoorSeating: true,
      petFriendly: false,
      familyFriendly: true,
      quietForWork: false,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Romantic & Candlelit',
    popularDishes: [
      {
        name: 'Handcrafted Truffle Burrata Pizza',
        price: 680,
        description: 'San Marzano tomatoes, fresh pugliese burrata, black truffle oil, fresh basil',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Lobster & Crab Ravioli',
        price: 790,
        description: 'Handmade saffron pasta filled with crabmeat in lemon tarragon bisque',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Wild Forest Mushroom Risotto',
        price: 590,
        description: 'Aborio rice with porcini mushrooms, parmesan crisp, and sage butter',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Antipasti & Tapas',
        items: [
          { name: 'Bruschetta Trio', price: 390, description: 'Classic tomato-basil, fig-gorgonzola, and roasted peppers', isVeg: true, isPopular: true },
          { name: 'Crispy Calamari Fritti', price: 540, description: 'Semolina-dusted squid with garlic saffron aioli', isVeg: false }
        ]
      },
      {
        category: 'Wood-fired Pizzas',
        items: [
          { name: 'Margherita D.O.C.', price: 520, description: 'Buffalo mozzarella, san marzano tomatoes, extra virgin olive oil', isVeg: true, isPopular: true },
          { name: 'Diavola & Pepperoni', price: 620, description: 'Spicy calabrian salami, crushed chili, smoked scamorza', isVeg: false }
        ]
      },
      {
        category: 'Dolci',
        items: [
          { name: 'Traditional Tiramisu Classico', price: 380, description: 'Savoiardi soaked in espresso and marsala with mascarpone mousse', isVeg: true, isPopular: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Rhea Kapoor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '3 days ago',
        purpose: 'Date night',
        comment: 'Booked a garden table for our anniversary. The fairy lights, live acoustic music, and candlelit ambiance are magical. The truffle burrata pizza is to die for.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Olive+Grove+Sector+26+Chandigarh'
  },
  {
    id: 'sattvik-pure-veg',
    name: 'Sattvik Rasoi & Thali Lounge',
    tagline: 'Authentic 100% pure vegetarian culinary traditions and royal royal thalis',
    category: 'vegetarian',
    photos: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 2150,
    cuisines: ['North Indian', 'Rajasthani', 'Pure Vegetarian', 'Thali'],
    priceRange: '₹',
    averageCostForTwo: 420,
    currency: '₹',
    distanceKm: 0.8,
    address: 'Booth 14-16, Sector 35-C',
    locality: 'Sector 35',
    city: 'Chandigarh',
    coordinates: { lat: 30.7226, lng: 76.7681 },
    phone: '+91 97812 34567',
    openingHours: {
      days: 'Mon - Sun',
      open: '11:00 AM',
      close: '11:30 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: true,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: false,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      powerSockets: false,
      parking: true,
      outdoorSeating: false,
      petFriendly: false,
      familyFriendly: true,
      quietForWork: false,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Family Casual',
    popularDishes: [
      {
        name: 'Maharaja Royal Thali',
        price: 290,
        description: 'Unlimited royal spread: Dal Makhani, Paneer Lababdar, Dum Aloo, Missi Roti, Gulab Jamun',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Slow-Cooked Dal Bukhara',
        price: 220,
        description: 'Black lentils slow cooked overnight over charcoal with churned white butter',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Amritsari Kulcha Platter',
        price: 180,
        description: 'Crisp multi-layered tandoori kulcha stuffed with spiced potatoes and paneer, served with chole',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Thali & Platters',
        items: [
          { name: 'Executive Mini Thali', price: 180, description: 'Paneer sabzi, dal tadka, jeera rice, 2 butter rotis, salad', isVeg: true, isPopular: true },
          { name: 'Maharaja Royal Thali', price: 290, description: 'Grand unlimited spread with welcome lassi and dessert', isVeg: true, isPopular: true }
        ]
      },
      {
        category: 'Tandoori Delicacies',
        items: [
          { name: 'Peshawari Paneer Tikka', price: 240, description: 'Cottage cheese cubes marinated with hung curd and carom seeds', isVeg: true, isPopular: true },
          { name: 'Dahi Ke Kebab', price: 210, description: 'Velvety hung curd patties with a golden crispy crust', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Sunil Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '5 days ago',
        purpose: 'Family lunch',
        comment: 'Best vegetarian meal in town under ₹500 for two! The Dal Bukhara tastes like heaven and the staff refills thali items with warm hospitality. Super clean kitchen.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sattvik+Rasoi+Sector+35+Chandigarh'
  },
  {
    id: 'rooftop-skyline-lounge',
    name: 'Skyline Terrace & Tapas Bar',
    tagline: 'Breathtaking 360-degree panoramic city views, sunset craft cocktails and global tapas',
    category: 'restaurant',
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    reviewCount: 1650,
    cuisines: ['Continental', 'Pan-Asian', 'Tapas', 'Craft Beverages'],
    priceRange: '₹₹₹',
    averageCostForTwo: 1400,
    currency: '₹',
    distanceKm: 3.5,
    address: '9th Floor, City Center Mall, Sector 17',
    locality: 'Sector 17',
    city: 'Chandigarh',
    coordinates: { lat: 30.7398, lng: 76.7827 },
    phone: '+91 98888 77665',
    openingHours: {
      days: 'Mon - Sun',
      open: '04:00 PM',
      close: '02:00 AM',
      isOpenNow: true,
      lateNight: true
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: false
    },
    facilities: {
      wifi: true,
      powerSockets: true,
      parking: true,
      outdoorSeating: true,
      petFriendly: false,
      familyFriendly: true,
      quietForWork: false,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Rooftop & Scenic',
    popularDishes: [
      {
        name: 'Crispy Korean Fried Chicken Bao',
        price: 420,
        description: 'Steamed lotus leaf buns, gochujang glazed chicken, pickled cucumber, sesame',
        isVeg: false,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Smoked Jalapeno Cheese Poppers',
        price: 360,
        description: 'Cheddar and mozzarella stuffed panko peppers with smoked chipotle ranch',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Small Plates & Tapas',
        items: [
          { name: 'Edamame Truffle Dimsums', price: 440, description: 'Steamed crystal dumplings with water chestnuts and truffle essence', isVeg: true, isPopular: true },
          { name: 'Peri Peri Grilled Tiger Prawns', price: 650, description: 'Charred prawns in spiced citrus garlic marinade', isVeg: false }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Tanya Dewan',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '1 week ago',
        purpose: 'Friends hangout',
        comment: 'The sunset view over the mountains from this terrace is unforgettable! Open late till 2 AM, fantastic DJ on weekends, and quick service.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Skyline+Terrace+Sector+17+Chandigarh'
  },
  {
    id: 'the-study-lab-cafe',
    name: 'The Study Lab & Silent Coffee',
    tagline: 'Ultra-fast gigabit Wi-Fi, ergonomic standing desks, noise-canceling zones & craft cold brews',
    category: 'study_work',
    photos: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 890,
    cuisines: ['Coffee & Cold Brews', 'Light Healthy Bites', 'Sandwiches'],
    priceRange: '₹',
    averageCostForTwo: 380,
    currency: '₹',
    distanceKm: 1.8,
    address: 'SCF 29, First Floor, Sector 15-D',
    locality: 'Sector 15',
    city: 'Chandigarh',
    coordinates: { lat: 30.7554, lng: 76.7725 },
    phone: '+91 98111 22334',
    openingHours: {
      days: 'Mon - Sun',
      open: '07:30 AM',
      close: '11:00 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      wifiSpeedMbps: 250,
      powerSockets: true,
      parking: true,
      outdoorSeating: false,
      petFriendly: false,
      familyFriendly: false,
      quietForWork: true,
      airConditioning: true,
      takesReservations: false,
      wheelchairAccessible: true
    },
    ambience: 'Peaceful & Quiet',
    popularDishes: [
      {
        name: 'Nitro Cold Brew Float',
        price: 190,
        description: 'Velvety nitrogen-infused cold brew with vanilla bean foam',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Grilled Pesto Mozzarella Focaccia',
        price: 240,
        description: 'Fresh basil pesto, buffalo mozzarella, sun-dried tomatoes on house focaccia',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Study Fuel Drinks',
        items: [
          { name: 'Matcha Green Tea Latte', price: 210, description: 'Ceremonial grade Uji matcha with oat milk', isVeg: true, isPopular: true },
          { name: 'Dark Roast Americano', price: 140, description: 'Bold double shot over hot water', isVeg: true },
          { name: 'Ginger Mint Immunity Elixir', price: 160, description: 'Cold pressed lemon, ginger, raw honey, mint', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Karan Singhania',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'Yesterday',
        purpose: 'Studying',
        comment: 'The gold standard for students and remote workers. Blazing 250 Mbps Wi-Fi, universal plugs at every chair, library-level silence in the quiet zone, and affordable coffee. Studied here 6 hours straight without interruption!',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Study+Lab+Cafe+Sector+15+Chandigarh'
  },
  {
    id: 'patisserie-delight',
    name: 'La Pâtisserie Parisienne',
    tagline: 'Artisanal French desserts, delicate macarons, flaky viennoiserie, and floral teas',
    category: 'dessert',
    photos: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 1430,
    cuisines: ['French Bakery', 'Desserts', 'Pastry', 'Tea Lounge'],
    priceRange: '₹₹',
    averageCostForTwo: 600,
    currency: '₹',
    distanceKm: 2.1,
    address: 'Shop 8, Elante Promenade, Industrial Area Phase 1',
    locality: 'Industrial Area',
    city: 'Chandigarh',
    coordinates: { lat: 30.7058, lng: 76.8012 },
    phone: '+91 98222 33445',
    openingHours: {
      days: 'Mon - Sun',
      open: '10:00 AM',
      close: '11:00 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      powerSockets: true,
      parking: true,
      outdoorSeating: true,
      petFriendly: true,
      familyFriendly: true,
      quietForWork: false,
      airConditioning: true,
      takesReservations: false,
      wheelchairAccessible: true
    },
    ambience: 'Cozy & Aesthetic',
    popularDishes: [
      {
        name: 'Opera Gateau Valrhona',
        price: 290,
        description: 'Layers of almond sponge, espresso syrup, ganache and coffee buttercream',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Assorted Macaron Box (6 pcs)',
        price: 360,
        description: 'Pistachio, Raspberry Rose, Salted Caramel, Dark Chocolate, Lavender Lemon',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Signature Bakes',
        items: [
          { name: 'Butter Croissant Pur Beurre', price: 160, description: '100% French cultured butter with 27 golden layers', isVeg: true, isPopular: true },
          { name: 'Pain Au Chocolat', price: 180, description: 'Double chocolate batons in flaky viennoiserie', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Ananya Roy',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '4 days ago',
        purpose: 'Friends hangout',
        comment: 'Pastels, floral arches, and the aroma of baking butter! The macarons have perfect feet and chewy centers. Excellent place for high tea photos.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Patisserie+Parisienne+Elante+Chandigarh'
  },
  {
    id: 'spice-route-haveli',
    name: 'The Grand Haveli & Courtyard',
    tagline: 'Regal heritage family dining with live ghazals, royal mughlai gravies and warm tandoors',
    category: 'family',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 3100,
    cuisines: ['Mughlai', 'North Indian', 'Tandoori & Kebabs', 'Desserts'],
    priceRange: '₹₹',
    averageCostForTwo: 950,
    currency: '₹',
    distanceKm: 4.2,
    address: 'NH-21, Chandigarh-Kalka Highway, Zirakpur border',
    locality: 'Highway Enclave',
    city: 'Chandigarh',
    coordinates: { lat: 30.6821, lng: 76.8214 },
    phone: '+91 99900 11223',
    openingHours: {
      days: 'Mon - Sun',
      open: '11:30 AM',
      close: '12:30 AM',
      isOpenNow: true,
      lateNight: true
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      powerSockets: false,
      parking: true,
      outdoorSeating: true,
      petFriendly: false,
      familyFriendly: true,
      quietForWork: false,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Family Casual',
    popularDishes: [
      {
        name: 'Murgh Makhani Butter Chicken',
        price: 460,
        description: 'Smoked tandoori chicken simmered in rich satin tomato gravy with fenugreek',
        isVeg: false,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Paneer Tikka Lababdar',
        price: 380,
        description: 'Charcoal charred cottage cheese in velvety onion-cashew-tomato reduction',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Awadhi Dum Biryani Handi',
        price: 440,
        description: 'Fragrant basmati layered with tender spiced meat, saffron, and fried onions sealed with dough',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Main Courses',
        items: [
          { name: 'Kadhai Paneer', price: 360, description: 'Wok tossed with pounded coriander seeds and bell peppers', isVeg: true, isPopular: true },
          { name: 'Dal Haveli Signature', price: 310, description: 'Slow cooked black lentils simmered for 24 hours', isVeg: true, isPopular: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Manpreet Singh',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '1 week ago',
        purpose: 'Family lunch',
        comment: 'The top choice for big family get-togethers. Immense dedicated parking, kids play area, live puppet shows, and consistently delicious North Indian food. Butter chicken was extraordinary.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Grand+Haveli+Chandigarh'
  },
  {
    id: 'tokyo-ramen-izakaya',
    name: 'Kyoto House & Ramen Bar',
    tagline: 'Authentic 18-hour broth ramen, hand-rolled sushi rolls, and cozy Japanese wooden booths',
    category: 'restaurant',
    photos: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 740,
    cuisines: ['Japanese', 'Ramen', 'Sushi', 'Asian'],
    priceRange: '₹₹₹',
    averageCostForTwo: 1250,
    currency: '₹',
    distanceKm: 2.4,
    address: 'SCO 21, Ground Floor, Sector 8-C',
    locality: 'Sector 8',
    city: 'Chandigarh',
    coordinates: { lat: 30.7329, lng: 76.7994 },
    phone: '+91 98456 78901',
    openingHours: {
      days: 'Tue - Sun (Mon Closed)',
      open: '12:30 PM',
      close: '11:00 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      powerSockets: true,
      parking: true,
      outdoorSeating: false,
      petFriendly: false,
      familyFriendly: true,
      quietForWork: true,
      airConditioning: true,
      takesReservations: true,
      wheelchairAccessible: true
    },
    ambience: 'Modern Minimalist',
    popularDishes: [
      {
        name: 'Spicy Miso Tonkotsu Ramen',
        price: 580,
        description: '18-hour rich broth, handmade springy noodles, ajitsuke tamago, nori, bamboo shoots',
        isVeg: false,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Vegan Shoyu Truffle Ramen',
        price: 520,
        description: 'Roasted mushroom and kombu dashi broth, crispy tofu puffs, bok choy, truffle oil',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Salmon Avocado Crunch Roll (8 pcs)',
        price: 640,
        description: 'Fresh Norwegian salmon, avocado, tempura flakes, spicy sriracha mayo',
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Ramen Bowls',
        items: [
          { name: 'Classic Tokyo Shoyu', price: 490, description: 'Soy dashi broth with hand-pulled noodles', isVeg: false, isPopular: true },
          { name: 'Spicy Kimchi Miso', price: 540, description: 'Fermented kimchi and red miso broth', isVeg: true }
        ]
      },
      {
        category: 'Gyoza & Appetizers',
        items: [
          { name: 'Pan-fried Pork Gyoza (5 pcs)', price: 380, description: 'Crispy bottom dumplings with ponzu dip', isVeg: false, isPopular: true },
          { name: 'Edamame with Sea Salt', price: 280, description: 'Steamed young soy pods with Maldon sea salt flakes', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Vivek Chawla',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2 weeks ago',
        purpose: 'Date night',
        comment: 'Authentic ramen broth that clings to the noodles! Minimalist timber interior, quiet booths, and friendly servers.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kyoto+House+Sector+8+Chandigarh'
  },
  {
    id: 'sourdough-brew-shed',
    name: 'The Rusty Anchor Cafe & Bakehouse',
    tagline: 'Pet-friendly industrial chic cafe with lush green patio, wood-fired bagels and nitro cold brew',
    category: 'cafe',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 1120,
    cuisines: ['Cafe', 'Continental', 'Artisanal Bakery', 'Healthy Juices'],
    priceRange: '₹₹',
    averageCostForTwo: 500,
    currency: '₹',
    distanceKm: 1.5,
    address: 'Booth 82, Sector 10-D, Near Museum',
    locality: 'Sector 10',
    city: 'Chandigarh',
    coordinates: { lat: 30.7511, lng: 76.7901 },
    phone: '+91 98722 55667',
    openingHours: {
      days: 'Mon - Sun',
      open: '08:30 AM',
      close: '11:00 PM',
      isOpenNow: true,
      lateNight: false
    },
    dietary: {
      isVegetarianOnly: false,
      hasVegetarianOptions: true,
      hasVeganOptions: true,
      isHalal: true,
      glutenFreeAvailable: true
    },
    facilities: {
      wifi: true,
      wifiSpeedMbps: 90,
      powerSockets: true,
      parking: true,
      outdoorSeating: true,
      petFriendly: true,
      familyFriendly: true,
      quietForWork: true,
      airConditioning: true,
      takesReservations: false,
      wheelchairAccessible: true
    },
    ambience: 'Cozy & Aesthetic',
    popularDishes: [
      {
        name: 'Everything Bagel with Herbed Cream Cheese',
        price: 240,
        description: 'New York style boiled bagel with house whipped dill cream cheese and pickled onions',
        isVeg: true,
        isChefSpecial: true,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Iced Pistachio Spanish Latte',
        price: 270,
        description: 'Double espresso layered with real Sicilian pistachio cream and cold whole milk',
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80'
      }
    ],
    menuCategories: [
      {
        category: 'Bagels & Toasts',
        items: [
          { name: 'Smoked Chicken & Jalapeno Bagel', price: 320, description: 'Herb roasted chicken breast, spicy cream cheese, rocket leaves', isVeg: false, isPopular: true },
          { name: 'Burrata Bruschetta Sourdough', price: 340, description: 'Warm heirloom cherry tomatoes, cold pressed basil oil', isVeg: true }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Siddharth Rao',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '3 days ago',
        purpose: 'Work & Pets',
        comment: 'Brought my golden retriever! They have pet treats on the house, lush shaded garden seating, good Wi-Fi, and delicious bagels.',
        sentiment: 'positive'
      }
    ],
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Rusty+Anchor+Sector+10+Chandigarh'
  }
];

export const POPULAR_CITIES = [
  { name: 'Chandigarh', state: 'Punjab / Haryana', lat: 30.7333, lng: 76.7794 },
  { name: 'New Delhi', state: 'NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'San Francisco', state: 'California, US', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', state: 'New York, US', lat: 40.7128, lng: -74.0060 },
  { name: 'London', state: 'United Kingdom', lat: 51.5074, lng: -0.1278 }
];

export const CUISINE_OPTIONS = [
  'All Cuisines',
  'Artisanal Coffee',
  'Italian',
  'North Indian',
  'Continental',
  'Pan-Asian',
  'Japanese',
  'European Bakery',
  'Healthy Breakfast',
  'Mughlai',
  'Mediterranean',
  'Desserts',
  'Fast Food'
];

export const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: 'Sparkles' },
  { id: 'cafe', label: 'Cafes', icon: 'Coffee' },
  { id: 'restaurant', label: 'Restaurants', icon: 'UtensilsCrossed' },
  { id: 'coffee', label: 'Coffee', icon: 'CupSoda' },
  { id: 'study_work', label: 'Study/Work Cafes', icon: 'Laptop' },
  { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
  { id: 'fine_dining', label: 'Fine Dining', icon: 'Wine' },
  { id: 'dessert', label: 'Desserts', icon: 'Cake' },
  { id: 'family', label: 'Family Restaurants', icon: 'Users' },
  { id: 'fast_food', label: 'Fast Food', icon: 'Pizza' }
];

export const QUICK_PROMPTS = [
  'Find a quiet cafe for studying near me.',
  'Best vegetarian restaurants under ₹500.',
  'Romantic restaurants for a date.',
  'Best cafes with Wi-Fi.',
  'Family-friendly restaurants nearby.',
  'Restaurants open late.',
  'Best coffee shops within 3 km.'
];
