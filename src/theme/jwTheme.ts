// src/theme/jwTheme.ts
// JW AI Consulting Centralized Brand Constants
// Matches: jwaiconsulting.com

export const jwTheme = {
  colors: {
    // Deep navy — primary brand anchor (slate-900, used for main text and logo bg)
    primary: '#0f172a',

    // Active electric blue — gradient start (blue-600)
    secondary: '#2563eb',

    // Richer blue — gradient end (blue-800)
    secondaryDark: '#1e40af',

    // Sky accent (blue-500 ↔ sky-400 gradient midpoint)
    accent: '#0ea5e9',

    // Soft blue border used on glass cards (blue-100)
    border: '#dbeafe',

    // Light slate-blue page background (#f0f4f8 from Hero section)
    paper: '#f8fafc',

    // Canvas block paper (pure white)
    blockPaper: '#ffffff',

    // Text colors
    textHeading: '#0f172a',   // slate-900
    textBody: '#334155',      // slate-700
    textMuted: '#64748b',     // slate-500

    // Glow blur colors for decorative orbs
    glowBlue: 'rgba(147,197,253,0.3)',   // blue-300/30
    glowSky: 'rgba(125,211,252,0.3)',    // sky-300/30
  },
  typography: {
    fontHeading: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
  },
  spacing: {
    sectionPadding: '3rem',
  }
};
