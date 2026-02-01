// Travel Journal Data Structure
// Easy to modify - just add new entries following this format

export const travelData = [
  // ========================================
  // VISITED LOCATIONS
  // ========================================
  {
    id: "loc-001",
    city: "Tokyo",
    country: "Japan",
    type: "visited",
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    },
    dates: {
      arrival: "2023-03-15",
      departure: "2023-03-28"
    },
    quickFacts: [
      "Explored 23 different ramen shops",
      "Witnessed cherry blossoms at Ueno Park",
      "Got lost in Shibuya at 3am (best night ever)",
      "Visited the teamLab Borderless museum"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
        caption: "Tokyo Tower at sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400",
        caption: "Senso-ji Temple"
      },
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400",
        caption: "Shibuya Crossing"
      }
    ],
    notes: "Absolutely fell in love with Japan. The perfect blend of ancient tradition and cutting-edge technology. Must return for autumn colors!",
    rating: 5
  },
  {
    id: "loc-002",
    city: "Paris",
    country: "France",
    type: "visited",
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    },
    dates: {
      arrival: "2022-06-10",
      departure: "2022-06-18"
    },
    quickFacts: [
      "Climbed all 674 steps of the Eiffel Tower",
      "Had croissants every single morning",
      "Discovered a hidden jazz bar in Le Marais",
      "Spent 6 hours in the Louvre (still not enough)"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
        caption: "Eiffel Tower at dusk"
      },
      {
        url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400",
        caption: "Seine River"
      },
      {
        url: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400",
        caption: "Montmartre streets"
      }
    ],
    notes: "The city of light truly lives up to its name. Every corner feels like a painting.",
    rating: 5
  },
  {
    id: "loc-003",
    city: "New York City",
    country: "USA",
    type: "visited",
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    },
    dates: {
      arrival: "2023-09-05",
      departure: "2023-09-12"
    },
    quickFacts: [
      "Saw 3 Broadway shows",
      "Pizza at Joe's was life-changing",
      "Central Park sunrise run every morning",
      "Got lost in the Met for an entire day"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
        caption: "Manhattan skyline"
      },
      {
        url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400",
        caption: "Brooklyn Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400",
        caption: "Times Square"
      }
    ],
    notes: "The energy of NYC is unmatched. Exhausting but exhilarating.",
    rating: 4
  },
  {
    id: "loc-004",
    city: "Barcelona",
    country: "Spain",
    type: "visited",
    coordinates: {
      lat: 41.3851,
      lng: 2.1734
    },
    dates: {
      arrival: "2022-08-20",
      departure: "2022-08-27"
    },
    quickFacts: [
      "Gaudí's architecture blew my mind",
      "Beach days at Barceloneta",
      "Best paella of my life in El Born",
      "Late night tapas crawls"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400",
        caption: "La Sagrada Família"
      },
      {
        url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400",
        caption: "Park Güell"
      },
      {
        url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400",
        caption: "Gothic Quarter"
      }
    ],
    notes: "Perfect mix of beach, culture, and nightlife. The Spanish siesta schedule took some adjusting!",
    rating: 5
  },
  {
    id: "loc-005",
    city: "Reykjavik",
    country: "Iceland",
    type: "visited",
    coordinates: {
      lat: 64.1466,
      lng: -21.9426
    },
    dates: {
      arrival: "2024-01-08",
      departure: "2024-01-15"
    },
    quickFacts: [
      "Northern Lights on our first night!",
      "Blue Lagoon was magical",
      "Drove the Golden Circle",
      "Tried fermented shark (once was enough)"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=400",
        caption: "Northern Lights"
      },
      {
        url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=400",
        caption: "Gullfoss Waterfall"
      },
      {
        url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400",
        caption: "Blue Lagoon"
      }
    ],
    notes: "Iceland feels like another planet. Absolutely otherworldly landscapes.",
    rating: 5
  },
  {
    id: "loc-006",
    city: "Sydney",
    country: "Australia",
    type: "visited",
    coordinates: {
      lat: -33.8688,
      lng: 151.2093
    },
    dates: {
      arrival: "2023-12-20",
      departure: "2024-01-02"
    },
    quickFacts: [
      "New Year's Eve fireworks over the Harbour",
      "Bondi to Coogee coastal walk",
      "Held a koala at Taronga Zoo",
      "Learned to surf (badly)"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400",
        caption: "Sydney Opera House"
      },
      {
        url: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400",
        caption: "Harbour Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400",
        caption: "Bondi Beach"
      }
    ],
    notes: "Summer Christmas is weird but amazing. Australians are the friendliest people!",
    rating: 4
  },
  
  // ========================================
  // BUCKET LIST LOCATIONS
  // ========================================
  {
    id: "loc-007",
    city: "Kyoto",
    country: "Japan",
    type: "bucket-list",
    coordinates: {
      lat: 35.0116,
      lng: 135.7681
    },
    dates: null,
    quickFacts: [
      "Must see: Fushimi Inari Shrine",
      "Bamboo Grove of Arashiyama",
      "Traditional ryokan stay",
      "Geisha district at dusk"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
        caption: "Fushimi Inari"
      }
    ],
    notes: "Planning for spring 2025 - cherry blossom season!",
    rating: null
  },
  {
    id: "loc-008",
    city: "Santorini",
    country: "Greece",
    type: "bucket-list",
    coordinates: {
      lat: 36.3932,
      lng: 25.4615
    },
    dates: null,
    quickFacts: [
      "Watch sunset in Oia",
      "Wine tasting at local vineyards",
      "Explore ancient ruins of Akrotiri",
      "Swim in volcanic hot springs"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400",
        caption: "Santorini sunset"
      }
    ],
    notes: "Dream honeymoon destination. Those white-washed buildings!",
    rating: null
  },
  {
    id: "loc-009",
    city: "Machu Picchu",
    country: "Peru",
    type: "bucket-list",
    coordinates: {
      lat: -13.1631,
      lng: -72.5450
    },
    dates: null,
    quickFacts: [
      "Hike the Inca Trail (4 days)",
      "Sunrise at the Sun Gate",
      "Explore the Sacred Valley",
      "Try cuy (guinea pig) in Cusco"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400",
        caption: "Machu Picchu"
      }
    ],
    notes: "Need to book permits 6 months in advance!",
    rating: null
  },
  {
    id: "loc-010",
    city: "Cape Town",
    country: "South Africa",
    type: "bucket-list",
    coordinates: {
      lat: -33.9249,
      lng: 18.4241
    },
    dates: null,
    quickFacts: [
      "Table Mountain cable car",
      "Safari in nearby reserves",
      "Wine country day trip",
      "Penguin colony at Boulders Beach"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400",
        caption: "Table Mountain"
      }
    ],
    notes: "Best time: November to March for summer weather",
    rating: null
  },
  {
    id: "loc-011",
    city: "Bali",
    country: "Indonesia",
    type: "bucket-list",
    coordinates: {
      lat: -8.3405,
      lng: 115.0920
    },
    dates: null,
    quickFacts: [
      "Ubud rice terraces",
      "Temple hopping tour",
      "Yoga retreat in Canggu",
      "Sunrise trek on Mount Batur"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
        caption: "Rice terraces"
      }
    ],
    notes: "Avoid rainy season (November-March). Digital nomad paradise!",
    rating: null
  },
  {
    id: "loc-012",
    city: "Marrakech",
    country: "Morocco",
    type: "bucket-list",
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    },
    dates: null,
    quickFacts: [
      "Get lost in the Medina souks",
      "Stay in a traditional riad",
      "Sahara Desert excursion",
      "Jardin Majorelle visit"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400",
        caption: "Marrakech Medina"
      }
    ],
    notes: "Best time: March-May or September-November to avoid extreme heat",
    rating: null
  }
];

// Helper function to add new location
export const createNewLocation = (data) => ({
  id: `loc-${Date.now()}`,
  city: data.city,
  country: data.country,
  type: data.type || 'bucket-list',
  coordinates: {
    lat: parseFloat(data.lat),
    lng: parseFloat(data.lng)
  },
  dates: data.type === 'visited' ? {
    arrival: data.arrival,
    departure: data.departure
  } : null,
  quickFacts: data.quickFacts || [],
  images: data.images || [],
  notes: data.notes || '',
  rating: data.type === 'visited' ? (data.rating || null) : null
});
