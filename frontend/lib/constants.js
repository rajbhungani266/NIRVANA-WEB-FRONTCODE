export const PROPERTY_ENDPOINTS = {
  residential: "/properties/residential/",
  commercial: "/properties/commercial/",
  plotWeekendVilla: "/properties/plot-weekend-villa/",
  investment: "/properties/investment/",
  giftCity: "/properties/gift-city/",
  rent: "/properties/rent/",
};

export const CATEGORY_CONFIG = {
  residential: {
    title: "Residential Properties",
    subtitle: "Explore premium flats, villas, bungalows and resale homes.",
    endpoint: PROPERTY_ENDPOINTS.residential,
    apiCategory: "residential",
  },

  commercial: {
    title: "Commercial Properties",
    subtitle: "Explore offices, showrooms, shops and commercial spaces.",
    endpoint: PROPERTY_ENDPOINTS.commercial,
    apiCategory: "commercial",
  },

  "plot-weekend-villa": {
    title: "Plot / Weekend Villa",
    subtitle: "Explore plots, farm houses and weekend villa opportunities.",
    endpoint: PROPERTY_ENDPOINTS.plotWeekendVilla,
    apiCategory: "plot_weekend_villa",
  },

  investment: {
    title: "Investment Properties",
    subtitle: "Preleased, rental income and high return investment options.",
    endpoint: PROPERTY_ENDPOINTS.investment,
    apiCategory: "investment",
  },

  "gift-city": {
    title: "GIFT City Properties",
    subtitle: "Premium commercial and investment options in GIFT City.",
    endpoint: PROPERTY_ENDPOINTS.giftCity,
    apiCategory: "gift_city",
  },

  rent: {
    title: "Properties for Rent",
    subtitle: "Explore flats, villas, and commercial properties available for rent.",
    endpoint: PROPERTY_ENDPOINTS.rent,
    apiCategory: "rent",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/residential" },
  { label: "Sell", href: "/post-property" },
  { label: "Rent", href: "/rent" },
  { label: "Investment", href: "/investment" },
  { label: "Plots", href: "/plot-weekend-villa" },
  { label: "Gift City", href: "/gift-city" },
];