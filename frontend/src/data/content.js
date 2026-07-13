export const STORE = {
  name: 'Greenland Aquarium',
  tagline: 'Bring Nature Home.',
  phone: '+91 96112 69901',
  phoneRaw: '919611269901',
  // Update when the client has a verified inbox
  email: '',
  hours: '10:00 AM – 10:00 PM',
  address: {
    line1: '1, SLN Complex,',
    line2: 'Opp. Anjaneya Temple,',
    line3: 'Sakamma Muniyappa Layout,',
    line4: 'K. Channasandra, Horamavu,',
    city: 'Bengaluru, Karnataka 560113',
  },
  // Query-based embed from the store address (replace with Share → Embed from Google Maps when client has a listed place)
  mapsEmbed:
    'https://maps.google.com/maps?q=1%20SLN%20Complex%20Opp.%20Anjaneya%20Temple%20Horamavu%20Bengaluru%20560113&z=16&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Greenland+Aquarium+SLN+Complex+Horamavu+Bengaluru',
  whatsapp:
    'https://wa.me/919611269901?text=Hi%20Greenland%20Aquarium%2C%20I%27d%20like%20to%20know%20more%20about%20your%20aquariums.',
  // Leave blank until the client provides real profile URLs (footer hides empty ones)
  socials: {
    instagram: 'https://www.instagram.com/green_land_aqurium/',
    facebook: 'https://www.facebook.com/share/1895JFyE6y/',
    youtube: '',
  },
}

export const NAV_LINKS = [
  { label: 'Collection', href: '/collection' },
  { label: 'Bestsellers', href: '/#bestsellers' },
  { label: 'Services', href: '/#services' },
]

export const COLLECTION_CATEGORIES = [
  'All',
  'Fish',
  'Birds',
  'Pet Food',
  'Live Plants',
  'Accessories',
  'Aquariums',
]

export const CATEGORIES = [
  {
    id: 'fish',
    title: 'Fish',
    description: 'Exotic freshwater & marine species curated for every aquascape.',
    icon: 'Fish',
    accent: '#4FC3F7',
    image:
      'https://images.unsplash.com/photo-1504470695779-75300268aa0e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'birds',
    title: 'Birds',
    description: 'Healthy companion birds with expert care guidance.',
    icon: 'Bird',
    accent: '#2ECC71',
    image:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pet-food',
    title: 'Pet Food',
    description: 'Fish feed, bird feed, and dog & cat nutrition.',
    icon: 'Bone',
    accent: '#FF6B35',
    image:
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'plants',
    title: 'Live Plants',
    description: 'Lush aquatic flora for natural, living underwater gardens.',
    icon: 'Leaf',
    accent: '#2ECC71',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Filters, lighting, driftwood, stones & premium gear.',
    icon: 'Wrench',
    accent: '#FF6B35',
    image:
      'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aquariums',
    title: 'Aquariums',
    description: 'Custom tanks engineered for beauty and balance.',
    icon: 'Box',
    accent: '#4FC3F7',
    image:
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
  },
]

export const FEATURED_FISH = [
  {
    id: 1,
    name: 'Halfmoon Betta',
    species: 'Betta splendens',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 450,
    description: 'Striking flowing fins and vibrant colors — ideal for a nano display.',
    image:
      'https://images.unsplash.com/photo-1504470695779-75300268aa0e?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Neon Tetra',
    species: 'Paracheirodon innesi',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 80,
    description: 'Peaceful schooling fish with electric blue and red stripes.',
    image:
      'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 3,
    name: 'Discus',
    species: 'Symphysodon',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Advanced',
    difficulty: 'Hard',
    price: 2500,
    description: 'The king of freshwater aquariums — needs stable, warm water.',
    image:
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 4,
    name: 'Angelfish',
    species: 'Pterophyllum scalare',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Intermediate',
    difficulty: 'Medium',
    description: 'Elegant tall-bodied cichlid for planted community tanks.',
    image:
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 5,
    name: 'Guppy',
    species: 'Poecilia reticulata',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    description: 'Hardy livebearer with endless color morphs.',
    image:
      'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 6,
    name: 'Clownfish',
    species: 'Amphiprion ocellaris',
    category: 'Fish',
    waterType: 'Marine',
    care: 'Intermediate',
    difficulty: 'Medium',
    price: 1200,
    description: 'Iconic reef fish — pairs beautifully with anemones.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 7,
    name: 'Goldfish',
    species: 'Carassius auratus',
    category: 'Fish',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    description: 'Classic coldwater companion for spacious tanks or ponds.',
    image:
      'https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 8,
    name: 'Blue Tang',
    species: 'Paracanthurus hepatus',
    category: 'Fish',
    waterType: 'Marine',
    care: 'Advanced',
    difficulty: 'Hard',
    description: 'Bold reef swimmer that needs a large, mature marine system.',
    image:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 9,
    name: 'Java Fern',
    species: 'Microsorum pteropus',
    category: 'Live Plants',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 180,
    description: 'Low-light epiphyte — attach to driftwood or stone.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 10,
    name: 'Anubias Nana',
    species: 'Anubias barteri',
    category: 'Live Plants',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 220,
    description: 'Hardy foreground/midground plant with thick leaves.',
    image:
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 11,
    name: 'Driftwood Bundle',
    species: 'Aquascape hardscape',
    category: 'Accessories',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 699,
    description: 'Natural wood pieces for layout structure and biofilm.',
    image:
      'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 12,
    name: 'Premium Fish Flakes',
    species: 'Daily nutrition',
    category: 'Pet Food',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 299,
    description: 'Balanced flake food for tropical community fish.',
    image:
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 13,
    name: '60L Starter Aquarium',
    species: 'Glass aquarium kit',
    category: 'Aquariums',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 4499,
    description: 'Ready-to-set-up tank for community freshwater fish.',
    image:
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 14,
    name: 'Nano Cube 30L',
    species: 'Desktop aquarium',
    category: 'Aquariums',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 2899,
    description: 'Compact cube tank for desks and small spaces.',
    image:
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 15,
    name: 'External Canister Filter',
    species: 'Filtration',
    category: 'Accessories',
    waterType: 'N/A',
    care: 'Intermediate',
    difficulty: 'Medium',
    price: 5499,
    description: 'Quiet multi-stage filter for mid-size aquariums.',
    image:
      'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 16,
    name: 'LED Aquarium Light',
    species: 'Lighting',
    category: 'Accessories',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 1899,
    description: 'Full-spectrum LED for plants and display colour.',
    image:
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 17,
    name: 'Cichlid Pellets',
    species: 'Species-specific food',
    category: 'Pet Food',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 449,
    description: 'Sinking pellets formulated for African cichlids.',
    image:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 18,
    name: 'Frozen Bloodworms',
    species: 'Treat food',
    category: 'Pet Food',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 199,
    description: 'Protein-rich frozen treat for tropical fish.',
    image:
      'https://images.unsplash.com/photo-1535591273668-554a9b032c6d?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 19,
    name: 'Amazon Sword',
    species: 'Echinodorus bleheri',
    category: 'Live Plants',
    waterType: 'Freshwater',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 250,
    description: 'Classic background plant with broad green leaves.',
    image:
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 20,
    name: 'Air Stone Kit',
    species: 'Aeration',
    category: 'Accessories',
    waterType: 'N/A',
    care: 'Beginner',
    difficulty: 'Easy',
    price: 349,
    description: 'Quiet air pump with stone for oxygenation.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
]

export const SERVICES = [
  {
    id: 1,
    title: 'Custom Tank Setup',
    description:
      'From nano tanks to statement aquariums — designed, built, and balanced for your space.',
    imageAlt: 'Custom aquarium tank setup',
  },
  {
    id: 2,
    title: 'Aquascaping',
    description:
      'Artistic underwater landscapes with plants, driftwood, and stone compositions.',
    imageAlt: 'Aquascaping with plants and hardscape',
  },
  {
    id: 3,
    title: 'Maintenance',
    description:
      'Scheduled care so your aquarium stays crystal clear and biologically healthy.',
    imageAlt: 'Person cleaning and maintaining an aquarium',
  },
]

export const REVIEWS = [
  {
    id: 1,
    name: 'Store visitor',
    rating: 5,
    text: 'Friendly guidance and a beautiful selection — worth a visit if you are setting up a tank in Horamavu.',
  },
  {
    id: 2,
    name: 'Aquarium hobbyist',
    rating: 5,
    text: 'Healthy fish and clear advice on plants and filters. Easy to walk in and ask questions.',
  },
  {
    id: 3,
    name: 'Custom tank customer',
    rating: 5,
    text: 'Helped plan a custom aquarium for our living room — from layout to livestock.',
  },
]
