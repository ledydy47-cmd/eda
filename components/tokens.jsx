// Design tokens — три темы приложения
// A. Warm Editorial | B. Clean Premium | C. Bold Playful

const THEMES = {
  warm: {
    name: 'Тёплая забота',
    tag: 'Warm Editorial',
    // Backgrounds
    bg: 'oklch(97% 0.012 65)',
    bgSubtle: 'oklch(94% 0.018 60)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    // Text
    text: 'oklch(22% 0.02 50)',
    textMuted: 'oklch(50% 0.02 50)',
    textFaint: 'oklch(68% 0.015 50)',
    // Accents
    accent: 'oklch(64% 0.13 35)',        // терракот
    accentSoft: 'oklch(92% 0.04 35)',
    accentText: '#ffffff',
    success: 'oklch(58% 0.09 155)',       // шалфей
    successSoft: 'oklch(93% 0.04 155)',
    warn: 'oklch(72% 0.14 80)',
    // Structure
    border: 'oklch(90% 0.015 60)',
    borderStrong: 'oklch(82% 0.02 55)',
    // Shape
    radius: {sm: 12, md: 20, lg: 28, xl: 36, pill: 999},
    // Fonts
    fontDisplay: '"Fraunces", "Times New Roman", serif',
    fontBody: '"Inter", system-ui, sans-serif',
    displayWeight: 500,
    displayItalic: true,
    // Shadow
    shadow: '0 1px 2px rgba(78, 50, 30, 0.04), 0 8px 24px -12px rgba(78, 50, 30, 0.15)',
    shadowLg: '0 4px 12px rgba(78, 50, 30, 0.06), 0 24px 60px -20px rgba(78, 50, 30, 0.18)',
  },
  clean: {
    name: 'Ясный минимализм',
    tag: 'Clean Premium',
    bg: 'oklch(98% 0.004 60)',
    bgSubtle: 'oklch(95% 0.005 60)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: 'oklch(18% 0.005 60)',
    textMuted: 'oklch(48% 0.005 60)',
    textFaint: 'oklch(70% 0.005 60)',
    accent: 'oklch(70% 0.15 65)',         // янтарь
    accentSoft: 'oklch(94% 0.04 70)',
    accentText: 'oklch(20% 0.03 60)',
    success: 'oklch(55% 0.11 155)',
    successSoft: 'oklch(94% 0.03 155)',
    warn: 'oklch(70% 0.15 45)',
    border: 'oklch(92% 0.004 60)',
    borderStrong: 'oklch(82% 0.005 60)',
    radius: {sm: 10, md: 14, lg: 18, xl: 24, pill: 999},
    fontDisplay: '"Manrope", system-ui, sans-serif',
    fontBody: '"Manrope", system-ui, sans-serif',
    displayWeight: 700,
    displayItalic: false,
    shadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 16px -8px rgba(0,0,0,0.08)',
    shadowLg: '0 2px 6px rgba(0,0,0,0.04), 0 20px 40px -16px rgba(0,0,0,0.12)',
  },
  playful: {
    name: 'Живая мотивация',
    tag: 'Bold Playful',
    bg: 'oklch(98% 0.004 60)',
    bgSubtle: 'oklch(95% 0.005 60)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: 'oklch(22% 0.04 175)',
    textMuted: 'oklch(48% 0.03 175)',
    textFaint: 'oklch(68% 0.02 175)',
    accent: 'oklch(68% 0.18 25)',         // коралл
    accentSoft: 'oklch(93% 0.05 25)',
    accentText: '#ffffff',
    success: 'oklch(62% 0.14 155)',
    successSoft: 'oklch(90% 0.06 155)',
    warn: 'oklch(75% 0.15 80)',
    border: 'oklch(88% 0.03 155)',
    borderStrong: 'oklch(78% 0.05 155)',
    radius: {sm: 14, md: 22, lg: 30, xl: 40, pill: 999},
    fontDisplay: '"Space Grotesk", system-ui, sans-serif',
    fontBody: '"Inter", system-ui, sans-serif',
    displayWeight: 600,
    displayItalic: false,
    shadow: '0 2px 4px rgba(20,80,60,0.04), 0 10px 30px -10px rgba(20,80,60,0.12)',
    shadowLg: '0 4px 10px rgba(20,80,60,0.06), 0 28px 60px -20px rgba(20,80,60,0.18)',
  },
};

window.THEMES = THEMES;
