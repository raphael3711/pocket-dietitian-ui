// Mock data service for Nutritionist in Your Pocket app

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' }
];

export const COLOR_THEMES = [
  { name: 'Pure White', value: '#FFFFFF', text: '#000000' },
  { name: 'Deep Black', value: '#000000', text: '#FFFFFF' },
  { name: 'Ocean Blue', value: '#0077BE', text: '#FFFFFF' },
  { name: 'Forest Green', value: '#228B22', text: '#FFFFFF' },
  { name: 'Sunset Orange', value: '#FF6B35', text: '#FFFFFF' },
  { name: 'Royal Purple', value: '#6B46C1', text: '#FFFFFF' },
  { name: 'Rose Pink', value: '#E91E63', text: '#FFFFFF' },
  { name: 'Golden Yellow', value: '#F59E0B', text: '#000000' },
  { name: 'Teal Mint', value: '#14B8A6', text: '#FFFFFF' },
  { name: 'Coral Red', value: '#EF4444', text: '#FFFFFF' }
];

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Organic Greek Yogurt',
    barcode: '1234567890123',
    calories: 130,
    protein: 15,
    carbs: 9,
    fat: 4,
    fiber: 0,
    sugar: 9,
    freshness: 'fresh',
    expiryDate: '2025-07-15',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="%23666">Yogurt</text></svg>'
  },
  {
    id: '2',
    name: 'Fresh Salmon Fillet',
    barcode: '2345678901234',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    freshness: 'fresh',
    expiryDate: '2025-06-20',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ff9999"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="%23333">Salmon</text></svg>'
  },
  {
    id: '3',
    name: 'Organic Spinach',
    barcode: '3456789012345',
    calories: 23,
    protein: 3,
    carbs: 4,
    fat: 0,
    fiber: 2,
    sugar: 0,
    freshness: 'aging',
    expiryDate: '2025-06-18',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2390EE90"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10" fill="%23333">Spinach</text></svg>'
  }
];

export const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Mediterranean Salmon Bowl',
    ingredients: ['Salmon Fillet', 'Greek Yogurt', 'Spinach', 'Olive Oil', 'Lemon'],
    instructions: [
      'Season salmon with salt and pepper',
      'Pan-fry salmon for 4-5 minutes each side',
      'Mix Greek yogurt with lemon juice',
      'Serve over fresh spinach with yogurt sauce'
    ],
    cookTime: 15,
    servings: 2,
    calories: 420,
    difficulty: 'Easy',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23FFE4B5"/><text x="100" y="75" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%23333">🐟 Salmon Bowl</text></svg>'
  },
  {
    id: '2',
    title: 'Green Power Smoothie',
    ingredients: ['Spinach', 'Greek Yogurt', 'Banana', 'Honey', 'Almond Milk'],
    instructions: [
      'Add all ingredients to blender',
      'Blend until smooth',
      'Add ice if desired',
      'Serve immediately'
    ],
    cookTime: 5,
    servings: 1,
    calories: 180,
    difficulty: 'Very Easy',
    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%2390EE90"/><text x="100" y="75" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%23333">🥤 Green Smoothie</text></svg>'
  }
];

export const MOCK_SHOPPING_LIST = [
  { id: '1', name: 'Fresh Avocado', category: 'Produce', needed: 2, unit: 'pieces' },
  { id: '2', name: 'Olive Oil', category: 'Pantry', needed: 1, unit: 'bottle' },
  { id: '3', name: 'Whole Grain Bread', category: 'Bakery', needed: 1, unit: 'loaf' },
  { id: '4', name: 'Organic Eggs', category: 'Dairy', needed: 1, unit: 'dozen' }
];

export const MOCK_INVENTORY = [
  { id: '1', name: 'Greek Yogurt', quantity: 2, unit: 'containers', expiry: '2025-07-15', category: 'Dairy' },
  { id: '2', name: 'Salmon Fillet', quantity: 1, unit: 'piece', expiry: '2025-06-20', category: 'Protein' },
  { id: '3', name: 'Spinach', quantity: 1, unit: 'bag', expiry: '2025-06-18', category: 'Produce' },
  { id: '4', name: 'Brown Rice', quantity: 500, unit: 'grams', expiry: '2026-01-01', category: 'Grains' }
];

export const MOCK_CHAT_HISTORY = [
  {
    id: '1',
    type: 'user',
    message: 'Hello! I want to lose weight but maintain muscle mass. What should I eat?',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'ai',
    message: 'Hello! Great goal! For weight loss while maintaining muscle mass, focus on:\n\n• High protein intake (1.6-2.2g per kg body weight)\n• Moderate caloric deficit (300-500 calories below maintenance)\n• Include lean proteins like chicken, fish, eggs, Greek yogurt\n• Complex carbs around workouts\n• Healthy fats for hormone production\n\nWould you like me to suggest some specific meal ideas?',
    timestamp: new Date(Date.now() - 3590000)
  },
  {
    id: '3',
    type: 'user',
    message: 'Yes, please suggest some high-protein breakfast ideas!',
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: '4',
    type: 'ai',
    message: 'Here are some delicious high-protein breakfast options:\n\n🥚 **Greek Yogurt Parfait**: Greek yogurt + berries + nuts (25g protein)\n🍳 **Veggie Omelet**: 3 eggs + vegetables + cheese (20g protein)\n🥞 **Protein Pancakes**: Oats + protein powder + banana (22g protein)\n🥑 **Avocado Toast**: Whole grain bread + eggs + avocado (18g protein)\n\nWhich one sounds appealing to you?',
    timestamp: new Date(Date.now() - 1790000)
  }
];

export const MOCK_COMMUNITY_POSTS = [
  {
    id: '1',
    author: 'HealthyEater22',
    avatar: '👩‍🦰',
    title: 'Amazing weight loss progress!',
    content: 'Just wanted to share that I\'ve lost 15 pounds in 2 months using this app! The AI nutritionist really helped me understand portion sizes.',
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 86400000),
    tags: ['weight-loss', 'success-story']
  },
  {
    id: '2',
    author: 'FitnessFan',
    avatar: '🏋️‍♂️',
    title: 'Best high-protein vegetarian recipes?',
    content: 'Looking for some creative vegetarian recipes that are high in protein. The recipe generator is great but I want to see what the community recommends!',
    likes: 12,
    comments: 15,
    timestamp: new Date(Date.now() - 172800000),
    tags: ['vegetarian', 'protein', 'recipes']
  },
  {
    id: '3',
    author: 'MomOfThree',
    avatar: '👩‍👧‍👦',
    title: 'Meal prep ideas for busy parents',
    content: 'The shopping list feature is a lifesaver! Here are my favorite meal prep recipes that work great with the app...',
    likes: 31,
    comments: 12,
    timestamp: new Date(Date.now() - 259200000),
    tags: ['meal-prep', 'family', 'time-saving']
  }
];

// Mock API functions
export const mockScanProduct = async (imageData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return random product
  const randomProduct = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
  return {
    success: true,
    product: randomProduct
  };
};

export const mockGenerateRecipes = async (ingredients, preferences = {}) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    recipes: MOCK_RECIPES.filter(recipe => 
      ingredients.some(ingredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    )
  };
};

export const mockScanReceipt = async (imageData) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    items: [
      { name: 'Greek Yogurt', quantity: 2, price: 5.99 },
      { name: 'Salmon Fillet', quantity: 1, price: 12.99 },
      { name: 'Organic Spinach', quantity: 1, price: 3.49 }
    ],
    total: 22.47
  };
};

export const mockChatResponse = async (message) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "That's a great question! Based on your profile, I recommend focusing on balanced nutrition with plenty of vegetables and lean proteins.",
    "I'd suggest incorporating more fiber-rich foods into your diet. This will help you feel fuller longer and support digestive health.",
    "For your fitness goals, timing your meals around workouts can be beneficial. Try having protein within 30 minutes after exercise.",
    "Remember, sustainable changes are better than drastic ones. Small, consistent improvements in your diet will yield better long-term results.",
    "Based on your dietary preferences, here are some nutritious alternatives you might enjoy..."
  ];
  
  return {
    success: true,
    response: responses[Math.floor(Math.random() * responses.length)]
  };
};