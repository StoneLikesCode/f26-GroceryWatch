export type PriceAlert = {
  id: string;
  product: string;
  store: string;
  oldPrice: number;
  newPrice: number;
  percentDecrease: number;
};

export type SearchProduct = {
  id: string;
  name: string;
  description: string;
};

export const PRICE_ALERTS: PriceAlert[] = [
  {
    id: "1",
    product: "Rolled Oats",
    store: "Kroger",
    oldPrice: 5.99,
    newPrice: 4.99,
    percentDecrease: 17,
  },
  {
    id: "2",
    product: "Country Sourdough",
    store: "Harris Teeter",
    oldPrice: 4.49,
    newPrice: 3.79,
    percentDecrease: 16,
  },
];

export const SEARCH_PRODUCTS: SearchProduct[] = [
  {
    id: "1",
    name: "Gala Apples (1 lb)",
    description: "Fresh, Organic, and great.",
  },
  {
    id: "2",
    name: "Rolled Oats",
    description: "Whole grain, low-sugar.",
  },
  {
    id: "3",
    name: "Country Sourdough",
    description: "Artisan loaf, sliced.",
  },
];

export const SETTINGS_ROWS = [
  { id: "account", label: "Account Settings", icon: "👤", hint: "Change account preferences" },
  { id: "notifications", label: "Notifications", icon: "🔔", hint: "Set what you want to receive" },
  { id: "appearance", label: "Appearance", icon: "👁", hint: "Dark mode and display" },
  { id: "privacy", label: "Privacy & Security", icon: "🔒", hint: "Privacy preferences" },
  { id: "help", label: "Help & FAQ", icon: "🎧", hint: "Get help / FAQs" },
  { id: "about", label: "About", icon: "❓", hint: "About GroceryWatch" },
] as const;
