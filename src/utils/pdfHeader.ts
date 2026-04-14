import { jsPDF } from 'jspdf';

// ──────────────────────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────────────────────

export interface OrgSettings {
  name: string;
  address: string;
  logo: string; // base64 data URL
}

export type PdfHeaderStyle =
  | 'dark_banner'
  | 'modern_split'
  | 'minimal_line'
  | 'corporate_box'
  | 'gradient_wave';

export type PdfFontStyle = 'helvetica' | 'times' | 'courier';

export type PdfColorAccent =
  | 'blue' | 'indigo' | 'teal' | 'green'
  | 'red'  | 'orange' | 'purple' | 'slate';

// Known module IDs used across the app
export type PdfModuleId =
  | 'defect_library'
  | 'sop'
  | 'risk'
  | 'production_quality'
  | 'traceability'
  | 'inspection'
  | 'audit'
  | 'capa'
  | 'certification'
  | 'jd';

export interface PdfModuleOverride {
  enabled: boolean;          // false = skip header/footer entirely for this module
  useCustomStyle: boolean;   // true = use own style instead of global
  headerStyle: PdfHeaderStyle;
  colorAccent: PdfColorAccent;
  fontStyle: PdfFontStyle;
}

// Global PDF Export Settings (header + footer only)
export interface PdfExportSettings {
  globalEnableHeader: boolean;
  globalEnableFooter: boolean;   // ← master switch for footer bar
  showFooterOrgName: boolean;    // ← org name at bottom-left
  // Global header/footer defaults
  headerStyle: PdfHeaderStyle;
  colorAccent: PdfColorAccent;
  fontStyle: PdfFontStyle;
  includeLogo: boolean;
  showAddress: boolean;
  showDate: boolean;
  showHeaderTitle: boolean;
  globalHeaderTitle: string;
  showPageNumber: boolean;
  watermarkText: string;
  // Per-module overrides
  enabledModules: PdfModuleId[];
  modules: Record<PdfModuleId, PdfModuleOverride>;
}

// ──────────────────────────────────────────────────────────────────────────────
// METADATA & DEFAULTS
// ──────────────────────────────────────────────────────────────────────────────

export const ACCENT_PALETTES: Record<PdfColorAccent, {
  dark: [number,number,number];
  mid:  [number,number,number];
  light:[number,number,number];
  label: string;
}> = {
  blue:   { dark:[30,58,138],  mid:[37,99,235],   light:[219,234,254], label:'Ocean Blue' },
  indigo: { dark:[49,46,129],  mid:[99,102,241],  light:[224,231,255], label:'Indigo'     },
  teal:   { dark:[19,78,74],   mid:[20,184,166],  light:[204,251,241], label:'Teal'       },
  green:  { dark:[20,83,45],   mid:[34,197,94],   light:[220,252,231], label:'Forest'     },
  red:    { dark:[127,29,29],  mid:[220,38,38],   light:[254,226,226], label:'Ruby Red'   },
  orange: { dark:[124,45,18],  mid:[249,115,22],  light:[255,237,213], label:'Amber'      },
  purple: { dark:[88,28,135],  mid:[168,85,247],  light:[243,232,255], label:'Purple'     },
  slate:  { dark:[15,23,42],   mid:[100,116,139], light:[241,245,249], label:'Slate Gray' },
};

export const HEADER_STYLE_META: Record<PdfHeaderStyle, { label: string; desc: string }> = {
  dark_banner:  { label: 'Dark Banner',    desc: 'Full-width dark bar — logo left, title right'       },
  modern_split: { label: 'Modern Split',   desc: 'Colored logo panel + white info panel'              },
  minimal_line: { label: 'Minimal Line',   desc: 'Clean white header with accent underline'           },
  corporate_box:{ label: 'Corporate Box',  desc: 'Light-toned boxed layout, split left/right columns' },
  gradient_wave:{ label: 'Gradient Wave',  desc: 'Bold gradient across full header width'             },
};

export const MODULE_META: Record<PdfModuleId, { label: string; icon: string }> = {
  defect_library:     { label: 'Defect Library',      icon: '🔴' },
  sop:                { label: 'SOP Management',       icon: '📄' },
  risk:               { label: 'Risk Management',      icon: '⚠️' },
  production_quality: { label: 'Production Quality',   icon: '📊' },
  traceability:       { label: 'Product Traceability', icon: '🔗' },
  inspection:         { label: 'Inspection',           icon: '🔍' },
  audit:              { label: 'Audit Management',     icon: '✅' },
  capa:               { label: 'CAPA',                 icon: '🛠️' },
  certification:      { label: 'Certification',        icon: '🏆' },
  jd:                 { label: 'Job Descriptions',     icon: '👤' },
};

const DEFAULT_MODULE_OVERRIDE: PdfModuleOverride = {
  enabled: true,
  useCustomStyle: false,
  headerStyle: 'dark_banner',
  colorAccent: 'blue',
  fontStyle: 'helvetica',
};

function buildDefaultModules(): Record<PdfModuleId, PdfModuleOverride> {
  // Give each module a unique default style so they look distinct out of the box
  const styles: Record<PdfModuleId, Partial<PdfModuleOverride>> = {
    defect_library:     { headerStyle: 'dark_banner',   colorAccent: 'red'    },
    sop:                { headerStyle: 'corporate_box',  colorAccent: 'blue'   },
    risk:               { headerStyle: 'gradient_wave',  colorAccent: 'orange' },
    production_quality: { headerStyle: 'modern_split',   colorAccent: 'teal'   },
    traceability:       { headerStyle: 'corporate_box',  colorAccent: 'indigo' },
    inspection:         { headerStyle: 'minimal_line',   colorAccent: 'green'  },
    audit:              { headerStyle: 'dark_banner',    colorAccent: 'slate'  },
    capa:               { headerStyle: 'modern_split',   colorAccent: 'purple' },
    certification:      { headerStyle: 'gradient_wave',  colorAccent: 'teal'   },
    jd:                 { headerStyle: 'minimal_line',   colorAccent: 'indigo' },
  };
  const result = {} as Record<PdfModuleId, PdfModuleOverride>;
  for (const id of Object.keys(styles) as PdfModuleId[]) {
    result[id] = { ...DEFAULT_MODULE_OVERRIDE, useCustomStyle: true, ...styles[id] };
  }
  return result;
}

export const DEFAULT_ORG: OrgSettings = {
  name: 'Fahim Garments Ltd.',
  address: 'Dhaka Export Processing Zone, Dhaka, Bangladesh',
  logo: '',
};

export const DEFAULT_PDF_SETTINGS: PdfExportSettings = {
  globalEnableHeader: true,
  globalEnableFooter: true,
  showFooterOrgName:  true,
  headerStyle:  'dark_banner',
  colorAccent:  'blue',
  fontStyle:    'helvetica',
  includeLogo:  true,
  showAddress:  true,
  showDate:     true,
  showHeaderTitle: true,
  globalHeaderTitle: '',
  showPageNumber: true,
  watermarkText:'',
  enabledModules: Object.keys(MODULE_META) as PdfModuleId[],
  modules: buildDefaultModules(),
};

// ──────────────────────────────────────────────────────────────────────────────
// LOAD / SAVE
// ──────────────────────────────────────────────────────────────────────────────

const ORG_KEY = 'qms_org_settings';
const PDF_KEY = 'qms_pdf_settings';

export function loadOrgSettings(): OrgSettings {
  try {
    const raw = localStorage.getItem(ORG_KEY);
    if (raw) return { ...DEFAULT_ORG, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_ORG };
}

export function saveOrgSettings(org: OrgSettings) {
  localStorage.setItem(ORG_KEY, JSON.stringify(org));
  window.dispatchEvent(new Event('storage'));
}

export function loadPdfSettings(): PdfExportSettings {
  try {
    const raw = localStorage.getItem(PDF_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PDF_SETTINGS,
        ...parsed,
        modules: { ...buildDefaultModules(), ...(parsed.modules || {}) },
      };
    }
  } catch {}
  return { ...DEFAULT_PDF_SETTINGS, modules: buildDefaultModules() };
}

export function savePdfSettings(settings: PdfExportSettings) {
  localStorage.setItem(PDF_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('storage'));
}

// ──────────────────────────────────────────────────────────────────────────────
// RESOLVE EFFECTIVE SETTINGS FOR A MODULE
// ──────────────────────────────────────────────────────────────────────────────

interface EffectiveSettings {
  enabled:      boolean;
  headerStyle:  PdfHeaderStyle;
  colorAccent:  PdfColorAccent;
  fontStyle:    PdfFontStyle;
  showLogo:     boolean;
  showAddress:  boolean;
  showDate:     boolean;
  showHeaderTitle: boolean;
  globalHeaderTitle: string;
  showPageNumber: boolean;
  watermarkText:  string;
  palette: { dark:[number,number,number]; mid:[number,number,number]; light:[number,number,number] };
}

function resolveSettings(moduleId?: PdfModuleId): EffectiveSettings {
  const global = loadPdfSettings();
  const mod = moduleId ? global.modules[moduleId] : null;

  const enabled     = mod ? mod.enabled : true;
  const useCustom   = mod ? mod.useCustomStyle : false;
  const headerStyle = useCustom ? mod!.headerStyle  : global.headerStyle;
  const colorAccent = useCustom ? mod!.colorAccent  : global.colorAccent;
  const fontStyle   = useCustom ? mod!.fontStyle    : global.fontStyle;

  return {
    enabled,
    headerStyle,
    colorAccent,
    fontStyle,
    showLogo:       global.includeLogo,
    showAddress:    global.showAddress,
    showDate:       global.showDate,
    showHeaderTitle: global.showHeaderTitle,
    globalHeaderTitle: global.globalHeaderTitle,
    showPageNumber: global.showPageNumber,
    watermarkText:  global.watermarkText,
    palette:        ACCENT_PALETTES[colorAccent],
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ──────────────────────────────────────────────────────────────────────────────

function _drawLogoPlaceholder(doc: jsPDF, x: number, y: number, size: number, name: string, palette: { dark:[number,number,number], mid:[number,number,number] }) {
  doc.setFillColor(palette.dark[0], palette.dark[1], palette.dark[2]);
  doc.rect(x, y, size, size, 'F');
  doc.setFillColor(palette.mid[0], palette.mid[1], palette.mid[2]);
  doc.circle(x + size / 2, y + size / 2, size * 0.35, 'F');
  const initials = (name || 'QMS').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(size * 0.35);
  doc.setFont('helvetica', 'bold');
  doc.text(initials, x + size / 2, y + size / 2 + size * 0.12, { align: 'center' });
}

function _tryAddLogo(doc: jsPDF, logo: string, x: number, y: number, w: number, h: number, palette: any, name: string) {
  if (logo) {
    try { doc.addImage(logo, 'JPEG', x, y, w, h); return; } catch {}
  }
  _drawLogoPlaceholder(doc, x, y, Math.min(w, h), name, palette);
}

function _addWatermark(doc: jsPDF, text: string, pageW: number, pageH: number) {
  if (!text) return;
  try {
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.07 }));
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.text(text.toUpperCase(), pageW / 2, pageH / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();
  } catch {}
}

function _addPageFooter(doc: jsPDF, pageW: number, org: OrgSettings, palette: { mid:[number,number,number] }, font: string) {
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(palette.mid[0], palette.mid[1], palette.mid[2]);
  doc.setLineWidth(0.3);
  doc.line(14, pageH - 10, pageW - 14, pageH - 10);
  doc.setFontSize(7);
  doc.setFont(font, 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text(org.name, 14, pageH - 5);
  const pageNum = (doc as any).internal.getCurrentPageInfo?.()?.pageNumber;
  if (pageNum) doc.text(`Page ${pageNum}`, pageW / 2, pageH - 5, { align: 'center' });
  doc.text(new Date().toLocaleDateString('en-GB'), pageW - 14, pageH - 5, { align: 'right' });
}

// ──────────────────────────────────────────────────────────────────────────────
// HEADER STYLE RENDERERS
// ──────────────────────────────────────────────────────────────────────────────

function _darkBanner(doc: jsPDF, title: string, subtitle: string | undefined, org: OrgSettings, s: EffectiveSettings, pageW: number): number {
  const H = 44; const L = 34;
  doc.setFillColor(15, 23, 42); doc.rect(0, 0, pageW, H, 'F');
  doc.setFillColor(...s.palette.dark); doc.rect(pageW - 62, 0, 62, H, 'F');
  if (s.showLogo) _tryAddLogo(doc, org.logo, 10, 5, L, L, s.palette, org.name);
  const tX = s.showLogo ? 10 + L + 6 : 14;
  doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont(s.fontStyle,'bold');
  doc.text(org.name || DEFAULT_ORG.name, tX, 15);
  if (s.showAddress) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(148,163,184); doc.text(doc.splitTextToSize(org.address || DEFAULT_ORG.address, 100), tX, 22); }
  const rX = pageW - 58;
  doc.setTextColor(255,255,255); doc.setFontSize(8.5); doc.setFont(s.fontStyle,'bold');
  const wt = doc.splitTextToSize(title, 50); doc.text(wt, rX, 13);
  if (subtitle) { doc.setFontSize(7); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(148,163,184); doc.text(doc.splitTextToSize(subtitle,50), rX, 13+wt.length*4.5); }
  if (s.showDate) { doc.setFontSize(6.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(148,163,184); doc.text(`${new Date().toLocaleDateString('en-GB')}`, rX, H-5); }
  doc.setDrawColor(...s.palette.mid); doc.setLineWidth(0.8); doc.line(0, H, pageW, H);
  return H + 8;
}

function _modernSplit(doc: jsPDF, title: string, subtitle: string | undefined, org: OrgSettings, s: EffectiveSettings, pageW: number): number {
  const H = 48; const P = 56;
  doc.setFillColor(...s.palette.dark); doc.rect(0, 0, P, H, 'F');
  if (s.showLogo) _tryAddLogo(doc, org.logo, 8, 7, 34, 34, s.palette, org.name);
  doc.setFillColor(255,255,255); doc.rect(P, 0, pageW-P, H, 'F');
  doc.setFillColor(...s.palette.mid); doc.rect(P, 0, pageW-P, 3, 'F');
  doc.setTextColor(15,23,42); doc.setFontSize(12); doc.setFont(s.fontStyle,'bold');
  doc.text(org.name || DEFAULT_ORG.name, P+8, 14);
  if (s.showAddress) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(100,116,139); doc.text(doc.splitTextToSize(org.address||DEFAULT_ORG.address, pageW-P-70), P+8, 21); }
  const rX2 = pageW - 8;
  doc.setTextColor(...s.palette.dark); doc.setFontSize(9); doc.setFont(s.fontStyle,'bold');
  doc.text(title, rX2, 13, {align:'right'});
  if (subtitle) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(100,116,139); doc.text(subtitle, rX2, 20, {align:'right'}); }
  if (s.showDate) { doc.setFontSize(7); doc.setTextColor(150,150,150); doc.text(new Date().toLocaleDateString('en-GB'), rX2, H-5, {align:'right'}); }
  doc.setDrawColor(...s.palette.mid); doc.setLineWidth(0.6); doc.line(P, H, pageW, H);
  return H + 8;
}

function _minimalLine(doc: jsPDF, title: string, subtitle: string | undefined, org: OrgSettings, s: EffectiveSettings, pageW: number): number {
  const H = 36; const L = 24;
  doc.setFillColor(255,255,255); doc.rect(0, 0, pageW, H, 'F');
  if (s.showLogo) _tryAddLogo(doc, org.logo, 10, 6, L, L, s.palette, org.name);
  const tX = s.showLogo ? 10+L+5 : 14;
  doc.setTextColor(15,23,42); doc.setFontSize(12); doc.setFont(s.fontStyle,'bold'); doc.text(org.name||DEFAULT_ORG.name, tX, 14);
  if (s.showAddress) { doc.setFontSize(7); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(120,130,145); doc.text(org.address||DEFAULT_ORG.address, tX, 21); }
  doc.setTextColor(...s.palette.dark); doc.setFontSize(10); doc.setFont(s.fontStyle,'bold'); doc.text(title, pageW-12, 14, {align:'right'});
  if (subtitle) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(120,130,145); doc.text(subtitle, pageW-12, 21, {align:'right'}); }
  if (s.showDate) { doc.setFontSize(7); doc.setTextColor(150,150,150); doc.text(new Date().toLocaleDateString('en-GB'), pageW-12, H-3, {align:'right'}); }
  doc.setDrawColor(...s.palette.mid); doc.setLineWidth(1.5); doc.line(0, H, pageW, H);
  return H + 10;
}

function _corporateBox(doc: jsPDF, title: string, subtitle: string | undefined, org: OrgSettings, s: EffectiveSettings, pageW: number): number {
  const H = 50; const L = 30;
  doc.setFillColor(...s.palette.mid); doc.rect(0, 0, pageW, 6, 'F');
  doc.setFillColor(...s.palette.light); doc.rect(0, 6, pageW, H-6, 'F');
  if (s.showLogo) { doc.setFillColor(...s.palette.dark); doc.rect(10,10,L+4,L+4,'F'); _tryAddLogo(doc, org.logo, 12, 12, L, L, s.palette, org.name); }
  const oX = s.showLogo ? 10+L+12 : 14;
  doc.setTextColor(...s.palette.dark); doc.setFontSize(11); doc.setFont(s.fontStyle,'bold'); doc.text(org.name||DEFAULT_ORG.name, oX, 18);
  if (s.showAddress) { doc.setFontSize(7); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(80,90,110); doc.text(doc.splitTextToSize(org.address||DEFAULT_ORG.address, 70), oX, 25); }
  doc.setDrawColor(...s.palette.mid); doc.setLineWidth(0.4); doc.line(pageW/2-0.2, 10, pageW/2-0.2, H-4);
  const cX = pageW/2+10;
  doc.setTextColor(...s.palette.dark); doc.setFontSize(11); doc.setFont(s.fontStyle,'bold'); doc.text(title, cX, 18);
  if (subtitle) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(80,90,110); doc.text(subtitle, cX, 26); }
  if (s.showDate) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(100,116,139); doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, cX, H-7); }
  doc.setDrawColor(...s.palette.mid); doc.setLineWidth(1.0); doc.line(0, H, pageW, H);
  return H + 8;
}

function _gradientWave(doc: jsPDF, title: string, subtitle: string | undefined, org: OrgSettings, s: EffectiveSettings, pageW: number): number {
  const H = 52; const L = 36;
  const steps = 12;
  for (let i=0; i<steps; i++) {
    const t = i/steps;
    const r = Math.round(s.palette.dark[0]+(s.palette.mid[0]-s.palette.dark[0])*t);
    const g = Math.round(s.palette.dark[1]+(s.palette.mid[1]-s.palette.dark[1])*t);
    const b = Math.round(s.palette.dark[2]+(s.palette.mid[2]-s.palette.dark[2])*t);
    doc.setFillColor(r,g,b); doc.rect((pageW/steps)*i, 0, pageW/steps+0.5, H, 'F');
  }
  if (s.showLogo) _tryAddLogo(doc, org.logo, 10, (H-L)/2, L, L, s.palette, org.name);
  const tX = s.showLogo ? 10+L+6 : 14;
  doc.setTextColor(255,255,255); doc.setFontSize(13); doc.setFont(s.fontStyle,'bold'); doc.text(org.name||DEFAULT_ORG.name, tX, 18);
  if (s.showAddress) { doc.setFontSize(7.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(200,220,255); doc.text(doc.splitTextToSize(org.address||DEFAULT_ORG.address, 100), tX, 25); }
  const pW = 65; const pH2 = 20; const pX = pageW-pW-10; const pY = (H-pH2)/2;
  doc.setFillColor(255,255,255); doc.roundedRect(pX, pY, pW, pH2, 4, 4, 'F');
  doc.setTextColor(...s.palette.dark); doc.setFontSize(8); doc.setFont(s.fontStyle,'bold');
  const ttl = doc.splitTextToSize(title, pW-4); doc.text(ttl, pX+pW/2, pY+7, {align:'center'});
  if (subtitle) { doc.setFontSize(6.5); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(...s.palette.mid); doc.text(subtitle, pX+pW/2, pY+13, {align:'center'}); }
  if (s.showDate) { doc.setFontSize(7); doc.setFont(s.fontStyle,'normal'); doc.setTextColor(200,220,255); doc.text(new Date().toLocaleDateString('en-GB'), pageW-12, H-4, {align:'right'}); }
  doc.setDrawColor(255,255,255); doc.setLineWidth(0.4); doc.line(0,H,pageW,H);
  return H + 10;
}

// ──────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Stamps the branded header + optional footer on the first page.
 * Pass `moduleId` so per-module style overrides are respected.
 * Returns the Y-coordinate where body content should begin.
 * Returns 10 if the module has headers disabled (still safe to use as startY).
 */
export function addPdfHeader(
  doc: jsPDF,
  title: string,
  subtitle?: string,
  isLandscape?: boolean,
  moduleId?: PdfModuleId
): number {
  if (!isPdfHeaderEnabled(moduleId)) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 20);
    if (subtitle) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 14, 27);
      return 35;
    }
    return 28;
  }

  const s = resolveSettings(moduleId);
  const org = loadOrgSettings();
  const pageW = doc.internal.pageSize.getWidth();

  switch (s.headerStyle) {
    case 'dark_banner':
      return _darkBanner(doc, title, subtitle, org, s, pageW);
    case 'modern_split':
      return _modernSplit(doc, title, subtitle, org, s, pageW);
    case 'minimal_line':
      return _minimalLine(doc, title, subtitle, org, s, pageW);
    case 'corporate_box':
      return _corporateBox(doc, title, subtitle, org, s, pageW);
    case 'gradient_wave':
      return _gradientWave(doc, title, subtitle, org, s, pageW);
    default:
      return _darkBanner(doc, title, subtitle, org, s, pageW);
  }
}

/**
 * Convenience – returns whether headers are enabled for a given module.
 */
export function isPdfHeaderEnabled(moduleId?: PdfModuleId): boolean {
  const global = loadPdfSettings();
  if (!global.globalEnableHeader) return false;
  if (moduleId && !global.enabledModules.includes(moduleId)) return false;
  return true;
}
