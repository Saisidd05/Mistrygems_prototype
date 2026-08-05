// Centralized Theme Design Tokens
export const themeTokens = {
  colors: {
    deep: '#03045E',       // Deep Twilight - Main Background base
    primary: '#0077B6',    // Bright Teal Blue - Primary Buttons & Active states
    secondary: '#00B4D8',  // Turquoise Surf - Hover buttons, Icons, Glow highlights
    accent: '#90E0EF',     // Frosted Blue - Text Secondary, Borders, Sub-titles
    text: '#CAF0F8',       // Light Cyan - Text Primary & Headings
  },
  glass: {
    cardBg: 'rgba(202, 240, 248, 0.08)',
    cardHoverBg: 'rgba(202, 240, 248, 0.14)',
    border: 'rgba(144, 224, 239, 0.2)',
    borderHover: 'rgba(0, 180, 216, 0.5)',
    blur: '24px',
    radius: '18px',
    shadow: '0 8px 32px 0 rgba(3, 4, 94, 0.37)',
    glow: '0 0 25px rgba(0, 180, 216, 0.4)',
  }
} as const;
