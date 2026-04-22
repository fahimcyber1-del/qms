// ══════════════════════════════════════════════════
//  LOCAL-UPLOAD BG — stored separately from main settings
//  to avoid base64 bloating the settings JSON.
const UPLOAD_KEY = 'qms-bg-upload';

export function saveLocalBg(dataUrl: string) {
  localStorage.setItem(UPLOAD_KEY, dataUrl);
}
export function loadLocalBg(): string {
  return localStorage.getItem(UPLOAD_KEY) ?? '';
}
export function clearLocalBg() {
  localStorage.removeItem(UPLOAD_KEY);
}
//
//  THEME ENGINE — Runtime CSS variable switching
// ══════════════════════════════════════════════════

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentDim: string;
  accentLight: string;
}

export interface AppearanceSettings {
  themeMode: 'light' | 'dark';
  accentPreset: string;
  customAccent: string;
  bgPattern: 'none' | 'dots' | 'grid' | 'lines' | 'cross' | 'waves' | 'hexagon' | 'circuit' | 'diamond';
  bgImage: string; // URL or predefined key
  bgImageOpacity: number; // 0–100
  bgImageBlur: number; // 0–20
  borderRadius: 'sharp' | 'soft' | 'rounded' | 'medium' | 'pill' | 'extra' | 'leaf' | 'asymmetric' | 'organic';
  sidebarStyle: 'solid' | 'transparent' | 'glass' | 'gradient' | 'accent' | 'dark' | 'neon' | 'floating' | 'minimal' | 'bordered' | 'industrial' | 'sunset' | 'midnight' | 'soft' | 'royal' | 'brutalist' | '3d' | 'glass-accent' | 'neon-dark';
  density: 'ultra-compact' | 'compact' | 'comfortable' | 'spacious' | 'airy';
  fontFamily: 'system' | 'inter' | 'roboto' | 'poppins' | 'outfit' | 'mono';
  cardStyle: 'default' | 'glass' | 'flat' | 'elevated' | 'bordered' | 'neon' | 'gradient' | 'minimalist' | 'brutalist' | '3d' | 'floating';
  animationLevel: 'none' | 'subtle' | 'standard' | 'smooth' | 'dynamic' | 'playful' | 'heavy';
  navLayout: 'sidebar' | 'top';
  colorSaturation: number; // 50–150
  uiScale: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  // NEW settings
  shadowIntensity: 'none' | 'flat' | 'soft' | 'medium' | 'deep' | 'extra-deep' | 'floating' | 'inner' | 'brutalist';
  topbarStyle: 'default' | 'accent' | 'dark' | 'glass' | 'gradient' | 'neon' | 'floating' | 'brutalist' | '3d';
  customBgUrl: string;
  localBgName: string; // filename of the uploaded image (display only)
  sidebarAccent: boolean; // accent colored sidebar items background
  compactTables: boolean;
  showBreadcrumbs: boolean;
  iconStyle: 'outline' | 'filled' | 'duotone';
  glassNavbar: boolean;
  animatePageTransitions: boolean;
  hoverEffects: boolean;
  frostedOverlays: boolean;
  highContrast: boolean;
  contentSpacing: 'compact' | 'standard' | 'wide';
  // Dashboard style
  dashboardStyle: 'modern' | 'corporate' | 'minimal' | 'glassmorphic' | 'neon' | 'executive' | 'sunset' | 'mono' | 'cyberpunk' | 'nature' | 'holographic';
}

// ── COLOR PRESETS ──
export const COLOR_PRESETS: ThemePreset[] = [
  { id: 'blue',    name: 'Corporate Blue',   description: 'Professional & trustworthy',  accent: '#2563eb', accentDim: '#1d4ed8', accentLight: '#dbeafe' },
  { id: 'indigo',  name: 'Deep Indigo',      description: 'Modern enterprise look',      accent: '#4f46e5', accentDim: '#4338ca', accentLight: '#e0e7ff' },
  { id: 'teal',    name: 'Industrial Teal',  description: 'Factory-floor optimal',       accent: '#0d9488', accentDim: '#0f766e', accentLight: '#ccfbf1' },
  { id: 'emerald', name: 'Emerald Green',    description: 'Quality & compliance',        accent: '#059669', accentDim: '#047857', accentLight: '#d1fae5' },
  { id: 'sky',     name: 'Sky Blue',         description: 'Light & clean',               accent: '#0284c7', accentDim: '#0369a1', accentLight: '#e0f2fe' },
  { id: 'violet',  name: 'Royal Violet',     description: 'Premium & distinctive',       accent: '#7c3aed', accentDim: '#6d28d9', accentLight: '#ede9fe' },
  { id: 'rose',    name: 'Rose',             description: 'Warm & approachable',         accent: '#e11d48', accentDim: '#be123c', accentLight: '#ffe4e6' },
  { id: 'orange',  name: 'Safety Orange',    description: 'High visibility',             accent: '#ea580c', accentDim: '#c2410c', accentLight: '#fff7ed' },
  { id: 'slate',   name: 'Neutral Slate',    description: 'Minimal & subtle',            accent: '#475569', accentDim: '#334155', accentLight: '#f1f5f9' },
  { id: 'cyan',    name: 'Vivid Cyan',       description: 'Tech-forward',                accent: '#0891b2', accentDim: '#0e7490', accentLight: '#cffafe' },
  { id: 'amber',   name: 'Amber Gold',       description: 'Energetic & bold',            accent: '#d97706', accentDim: '#b45309', accentLight: '#fef3c7' },
  { id: 'pink',    name: 'Fuchsia Pink',     description: 'Creative & vibrant',          accent: '#c026d3', accentDim: '#a21caf', accentLight: '#fae8ff' },
  { id: 'lime',    name: 'Lime Green',       description: 'Fresh & natural',             accent: '#65a30d', accentDim: '#4d7c0f', accentLight: '#ecfccb' },
  { id: 'red',     name: 'Alert Red',        description: 'Critical & urgent',           accent: '#dc2626', accentDim: '#b91c1c', accentLight: '#fee2e2' },
  { id: 'gold',    name: 'Premium Gold',     description: 'Luxury & prestige',           accent: '#b45309', accentDim: '#92400e', accentLight: '#fef3c7' },
];

export const BG_PATTERNS = [
  { id: 'none',     name: 'Clean Solid',    description: 'No background pattern',   css: '' },
  { id: 'dots',     name: 'Dot Matrix',     description: 'Subtle dot grid',          css: '' },
  { id: 'grid',     name: 'Grid Lines',     description: 'Engineering grid',         css: '' },
  { id: 'lines',    name: 'Ruled Lines',    description: 'Horizontal lines',         css: '' },
  { id: 'cross',    name: 'Crosshatch',     description: 'Cross pattern',            css: '' },
  { id: 'waves',    name: 'Soft Waves',     description: 'Organic wave pattern',     css: '' },
  { id: 'hexagon',  name: 'Hexagons',       description: 'Industrial hex grid',      css: '' },
  { id: 'circuit',  name: 'Circuit Board',  description: 'Tech circuit pattern',     css: '' },
  { id: 'diamond',  name: 'Diamond',        description: 'Diamond lattice',          css: '' },
] as const;

export const BG_IMAGES = [
  { id: 'none',        name: 'None',               thumb: '' },
  { id: 'gradient1',   name: 'Aurora Blue',         thumb: 'linear-gradient(135deg,#1e3a5f,#0d9488,#2563eb)' },
  { id: 'gradient2',   name: 'Violet Dusk',         thumb: 'linear-gradient(135deg,#1e1b4b,#7c3aed,#be185d)' },
  { id: 'gradient3',   name: 'Forest Deep',         thumb: 'linear-gradient(135deg,#052e16,#059669,#0d9488)' },
  { id: 'gradient4',   name: 'Sunrise',             thumb: 'linear-gradient(135deg,#451a03,#ea580c,#facc15)' },
  { id: 'gradient5',   name: 'Ocean Depths',        thumb: 'linear-gradient(135deg,#0c4a6e,#0891b2,#0d9488)' },
  { id: 'gradient6',   name: 'Midnight',            thumb: 'linear-gradient(135deg,#020617,#1e293b,#334155)' },
  { id: 'gradient7',   name: 'Rose Garden',         thumb: 'linear-gradient(135deg,#4a044e,#c026d3,#e11d48)' },
  { id: 'gradient8',   name: 'Golden Hour',         thumb: 'linear-gradient(135deg,#431407,#b45309,#facc15)' },
  { id: 'mesh1',       name: 'Mesh Aurora',         thumb: 'radial-gradient(at 40% 20%,#2563eb 0,transparent 50%),radial-gradient(at 80% 0,#7c3aed 0,transparent 50%),radial-gradient(at 0 50%,#0d9488 0,transparent 50%),#0f172a' },
  { id: 'mesh2',       name: 'Mesh Sunset',         thumb: 'radial-gradient(at 20% 80%,#ea580c 0,transparent 50%),radial-gradient(at 80% 20%,#e11d48 0,transparent 50%),radial-gradient(at 50% 50%,#facc15 0,transparent 60%),#1c0a03' },
  { id: 'mesh3',       name: 'Mesh Ocean',          thumb: 'radial-gradient(at 0% 50%,#0891b2 0,transparent 50%),radial-gradient(at 100% 50%,#059669 0,transparent 50%),radial-gradient(at 50% 0%,#2563eb 0,transparent 50%),#020617' },
  { id: 'mesh4',       name: 'Mesh Cyber',          thumb: 'radial-gradient(at 30% 70%,#ec4899 0,transparent 50%),radial-gradient(at 70% 30%,#06b6d4 0,transparent 50%),#020617' },
  { id: 'mesh5',       name: 'Mesh Emerald',        thumb: 'radial-gradient(at 10% 20%,#10b981 0,transparent 40%),radial-gradient(at 90% 80%,#3b82f6 0,transparent 40%),#0f172a' },
  { id: 'mesh6',       name: 'Crystal Rose',        thumb: 'radial-gradient(at 80% 10%,#fda4af 0,transparent 50%),radial-gradient(at 20% 90%,#c084fc 0,transparent 50%),#4c1d95' },
  { id: 'fab1',        name: 'Factory Floor',       thumb: 'linear-gradient(160deg,#1e293b 0%,#0f172a 60%,#1e3a5f 100%)' },
  { id: 'fab2',        name: 'Carbon Matrix',       thumb: 'linear-gradient(135deg,#1f2937,#111827)' },
  { id: 'gradient9',   name: 'Hologram',            thumb: 'linear-gradient(120deg,#c084fc,#f472b6,#38bdf8)' },
  { id: 'gradient10',  name: 'Velvet Night',        thumb: 'linear-gradient(180deg,#2e1065,#1e1b4b,#000000)' },
  { id: 'custom',      name: 'Custom URL',          thumb: '' },
];

export const FONT_OPTIONS = [
  { id: 'system',  name: 'System Default',   family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',    google: null },
  { id: 'inter',   name: 'Inter',            family: '"Inter", sans-serif',                                           google: 'Inter:wght@300;400;500;600;700;800' },
  { id: 'roboto',  name: 'Roboto',           family: '"Roboto", sans-serif',                                          google: 'Roboto:wght@300;400;500;700' },
  { id: 'poppins', name: 'Poppins',          family: '"Poppins", sans-serif',                                         google: 'Poppins:wght@300;400;500;600;700' },
  { id: 'outfit',  name: 'Outfit',           family: '"Outfit", sans-serif',                                          google: 'Outfit:wght@300;400;500;600;700;800' },
  { id: 'mono',    name: 'JetBrains Mono',   family: '"JetBrains Mono", monospace',                                   google: 'JetBrains+Mono:wght@400;500;700' },
];

export const CARD_STYLES = [
  { id: 'default',    name: 'Default',    description: 'Standard bordered card' },
  { id: 'glass',      name: 'Glass',      description: 'Frosted glass effect' },
  { id: 'flat',       name: 'Flat',       description: 'Clean & minimal' },
  { id: 'elevated',   name: 'Elevated',   description: 'Bold drop shadow' },
  { id: 'bordered',   name: 'Bordered',   description: 'Accent border highlight' },
  { id: 'neon',       name: 'Neon',       description: 'Glowing accent borders' },
  { id: 'gradient',   name: 'Gradient',   description: 'Soft color transitions' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean without borders' },
  { id: 'brutalist',  name: 'Brutalist',  description: 'Bold strokes & sharp' },
  { id: '3d',         name: '3D Lift',     description: 'Tactile raised effect' },
  { id: 'floating',   name: 'Floating',   description: 'Soft high-elevation' },
] as const;

export const SIDEBAR_OPTIONS = [
  { id: 'solid',        name: 'Solid' },
  { id: 'transparent',  name: 'Transparent' },
  { id: 'glass',        name: 'Glass' },
  { id: 'gradient',     name: 'Gradient' },
  { id: 'accent',       name: 'Accent' },
  { id: 'dark',         name: 'Dark' },
  { id: 'neon',         name: 'Neon' },
  { id: 'floating',     name: 'Floating' },
  { id: 'minimal',      name: 'Minimal' },
  { id: 'bordered',     name: 'Bordered' },
  { id: 'industrial',   name: 'Industrial' },
  { id: 'sunset',       name: 'Sunset' },
  { id: 'midnight',     name: 'Midnight' },
  { id: 'soft',         name: 'Soft White' },
  { id: 'royal',        name: 'Royal Purple' },
  { id: 'brutalist',    name: 'Brutalist' },
  { id: '3d',           name: '3D Lift' },
  { id: 'glass-accent', name: 'Glass Accent' },
  { id: 'neon-dark',    name: 'Neon Dark' },
] as const;

export const RADIUS_OPTIONS = [
  { id: 'sharp',      name: 'Sharp',      value: '0px',         valueSm: '0px',        description: 'Industrial' },
  { id: 'soft',       name: 'Soft',       value: '4px',         valueSm: '3px',        description: 'Subtle' },
  { id: 'rounded',    name: 'Rounded',    value: '8px',         valueSm: '6px',        description: 'Standard' },
  { id: 'medium',     name: 'Medium',     value: '12px',        valueSm: '9px',        description: 'Balanced' },
  { id: 'pill',       name: 'Pill',       value: '18px',        valueSm: '14px',       description: 'Friendly' },
  { id: 'extra',      name: 'Extra',      value: '28px',        valueSm: '20px',       description: 'Very Soft' },
  { id: 'leaf',       name: 'Leaf',       value: '24px 4px',    valueSm: '18px 3px',   description: 'Organic' },
  { id: 'asymmetric', name: 'Asymmetric', value: '16px 4px 16px 4px', valueSm: '12px 3px 12px 3px', description: 'Modern' },
  { id: 'organic',    name: 'Organic',    value: '30% 70% 70% 30% / 30% 30% 70% 70%', valueSm: '30% 70% 70% 30% / 30% 30% 70% 70%', description: 'Fluid' },
] as const;

export const DENSITY_OPTIONS = [
  { id: 'ultra-compact', name: 'Ultra Compact', description: 'Maximum information density' },
  { id: 'compact',     name: 'Compact',     description: 'More data, less space' },
  { id: 'comfortable', name: 'Comfortable', description: 'Balanced layout' },
  { id: 'spacious',    name: 'Spacious',    description: 'Extra breathing room' },
  { id: 'airy',        name: 'Airy',        description: 'Maximum whitespace' },
] as const;

const STORAGE_KEY = 'qms-appearance';

// ── DEFAULT ──
export const DEFAULT_APPEARANCE: AppearanceSettings = {
  themeMode: 'light',
  accentPreset: 'blue',
  customAccent: '',
  bgPattern: 'none',
  bgImage: 'none',
  bgImageOpacity: 30,
  bgImageBlur: 4,
  borderRadius: 'rounded',
  sidebarStyle: 'solid',
  density: 'comfortable',
  fontFamily: 'inter',
  cardStyle: 'default',
  animationLevel: 'subtle',
  navLayout: 'sidebar',
  colorSaturation: 100,
  uiScale: 'md',
  shadowIntensity: 'soft',
  topbarStyle: 'default',
  customBgUrl: '',
  localBgName: '',
  sidebarAccent: false,
  compactTables: false,
  showBreadcrumbs: false,
  iconStyle: 'outline',
  glassNavbar: false,
  animatePageTransitions: true,
  hoverEffects: true,
  frostedOverlays: false,
  highContrast: false,
  contentSpacing: 'standard',
  dashboardStyle: 'modern',
};

// ── Load from localStorage ──
export function loadAppearance(): AppearanceSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_APPEARANCE, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...DEFAULT_APPEARANCE };
}

// ── Save to localStorage ──
export function saveAppearance(settings: AppearanceSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// ── Load a Google Font dynamically ──
function loadGoogleFont(fontId: string) {
  const font = FONT_OPTIONS.find(f => f.id === fontId);
  if (!font || !font.google) return;
  const existingId = `gf-${fontId}`;
  if (document.getElementById(existingId)) return;
  const link = document.createElement('link');
  link.id = existingId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
  document.head.appendChild(link);
}

// ── Get background CSS for a bgImage id ──
export function getBgImageCss(id: string, customUrl = ''): string {
  if (id === 'none') return '';
  // Local uploaded file — load the data URL from its own storage key
  if (id === 'local') {
    const dataUrl = loadLocalBg();
    return dataUrl ? `url(${dataUrl})` : '';
  }
  // Remote URL typed by the user
  if (id === 'custom' && customUrl) return `url(${customUrl})`;
  const img = BG_IMAGES.find(i => i.id === id);
  if (!img || !img.thumb) return '';
  return img.thumb;
}

// ── Apply to DOM ──
export function applyAppearance(settings: AppearanceSettings) {
  const root = document.documentElement;

  // 1. Dark/Light mode
  if (settings.themeMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 2. Accent color + saturation
  const preset = COLOR_PRESETS.find(p => p.id === settings.accentPreset);
  let accentHex = preset?.accent ?? '#2563eb';
  if (settings.customAccent) accentHex = settings.customAccent;

  root.style.setProperty('--accent', accentHex);
  root.style.setProperty('--accent-raw', hexToRgbValues(accentHex));
  root.style.setProperty('--accent-dim', adjustColor(accentHex, -20));
  root.style.setProperty('--accent-light',
    settings.themeMode === 'dark'
      ? hexToRgba(accentHex, 0.12)
      : adjustColor(accentHex, 80, 0.12)
  );
  root.style.setProperty('--color-saturation', `${settings.colorSaturation ?? 100}%`);

  const bg1Hex = settings.themeMode === 'dark' ? '#161822' : '#ffffff';
  root.style.setProperty('--bg-1-raw', hexToRgbValues(bg1Hex));

  // 3. Background pattern on #content
  const app = document.getElementById('app');
  const content = document.getElementById('content');
  const target = content ?? app;
  if (target) {
    target.className = target.className.replace(/bg-pattern-\S+/g, '').trim();
    target.classList.add(`bg-pattern-${settings.bgPattern}`);
  }

  // 4. Border radius
  const radiusOpt = RADIUS_OPTIONS.find(r => r.id === settings.borderRadius);
  if (radiusOpt) {
    root.style.setProperty('--radius', radiusOpt.value);
    root.style.setProperty('--radius-sm', radiusOpt.valueSm);
  }

  // 5. Font family
  loadGoogleFont(settings.fontFamily);
  const fontOpt = FONT_OPTIONS.find(f => f.id === settings.fontFamily);
  if (fontOpt) {
    root.style.setProperty('--font-sans', fontOpt.family);
    document.body.style.fontFamily = fontOpt.family;
  }

  // 6. Card style class on root
  root.setAttribute('data-card-style', settings.cardStyle ?? 'default');

  // 7. Animation level
  root.setAttribute('data-animation', settings.animationLevel ?? 'subtle');
  const animMap: Record<string, string> = {
    none: '0ms',
    subtle: '150ms',
    standard: '300ms',
    smooth: '450ms',
    dynamic: '600ms',
    playful: '800ms',
    heavy: '1200ms'
  };
  const animSpeed = animMap[settings.animationLevel ?? 'subtle'] ?? '300ms';
  root.style.setProperty('--transition-speed', animSpeed);

  // 8. UI Scale
  const scaleMap: Record<string, string> = {
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '15px',
    xl: '16px',
    '2xl': '18px'
  };
  const baseSize = scaleMap[settings.uiScale ?? 'md'] ?? '14px';
  root.style.setProperty('--ui-base-size', baseSize);
  document.body.style.fontSize = baseSize;

  // 9. Sidebar style
  root.setAttribute('data-sidebar', settings.sidebarStyle ?? 'solid');

  // 10. Density
  root.setAttribute('data-density', settings.density ?? 'comfortable');
  const densityPad: Record<string, string> = {
    'ultra-compact': '6px',
    compact: '12px',
    comfortable: '18px',
    spacious: '26px',
    airy: '36px',
  };
  root.style.setProperty('--density-pad', densityPad[settings.density ?? 'comfortable']);

  // 11. Background image on #app
  const bgImageCss = getBgImageCss(settings.bgImage ?? 'none', settings.customBgUrl ?? '');
  if (settings.bgImage && settings.bgImage !== 'none') {
    const opacity = (settings.bgImageOpacity ?? 30) / 100;
    const blur = settings.bgImageBlur ?? 4;
    root.style.setProperty('--bg-image', bgImageCss);
    root.style.setProperty('--bg-image-opacity', String(opacity));
    root.style.setProperty('--bg-image-blur', `${blur}px`);
    root.setAttribute('data-bg-image', 'true');
  } else {
    root.style.setProperty('--bg-image', 'none');
    root.removeAttribute('data-bg-image');
  }

  // 12. Shadow intensity
  const shadowMap: Record<string, { sm: string; md: string; lg: string }> = {
    none:       { sm: 'none', md: 'none', lg: 'none' },
    flat:       { sm: '0 1px 1px rgba(0,0,0,0.02)', md: '0 2px 2px rgba(0,0,0,0.03)', lg: '0 4px 4px rgba(0,0,0,0.04)' },
    soft:       { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.07)', lg: '0 10px 15px -3px rgba(0,0,0,0.08)' },
    medium:     { sm: '0 1px 3px rgba(0,0,0,0.1)',  md: '0 4px 8px rgba(0,0,0,0.12)',     lg: '0 12px 20px rgba(0,0,0,0.15)' },
    deep:       { sm: '0 2px 5px rgba(0,0,0,0.15)', md: '0 8px 16px rgba(0,0,0,0.18)',    lg: '0 20px 40px rgba(0,0,0,0.22)' },
    'extra-deep': { sm: '0 4px 10px rgba(0,0,0,0.2)', md: '0 12px 24px rgba(0,0,0,0.25)',  lg: '0 30px 60px rgba(0,0,0,0.35)' },
    floating:   { sm: '0 8px 20px rgba(0,0,0,0.1)', md: '0 15px 35px rgba(0,0,0,0.15)',  lg: '0 25px 60px rgba(0,0,0,0.2)' },
    inner:      { sm: 'inset 0 1px 2px rgba(0,0,0,0.1)', md: 'inset 0 2px 4px rgba(0,0,0,0.15)', lg: 'inset 0 4px 8px rgba(0,0,0,0.2)' },
    brutalist:  { sm: '2px 2px 0 #000', md: '4px 4px 0 #000', lg: '8px 8px 0 #000' }
  };
  const sMap = shadowMap[settings.shadowIntensity ?? 'soft'] ?? shadowMap.soft;
  root.style.setProperty('--shadow-sm', sMap.sm);
  root.style.setProperty('--shadow-md', sMap.md);
  root.style.setProperty('--shadow-lg', sMap.lg);

  // 13. Interface Extras
  root.setAttribute('data-glass-navbar', String(settings.glassNavbar ?? false));
  root.setAttribute('data-animate-pages', String(settings.animatePageTransitions ?? true));
  root.setAttribute('data-hover-effects', String(settings.hoverEffects ?? true));
  root.setAttribute('data-frosted', String(settings.frostedOverlays ?? false));
  root.setAttribute('data-high-contrast', String(settings.highContrast ?? false));
  root.setAttribute('data-content-spacing', settings.contentSpacing ?? 'standard');

  // 14. Topbar style
  root.setAttribute('data-topbar', settings.topbarStyle ?? 'default');

  // 14. Sidebar accent
  root.setAttribute('data-sidebar-accent', settings.sidebarAccent ? 'true' : 'false');

  // 15. Compact tables
  root.setAttribute('data-compact-tables', settings.compactTables ? 'true' : 'false');
}

// ── Simple color helpers ──
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustColor(hex: string, amount: number, alpha?: number): string {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  if (alpha !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToRgbValues(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
