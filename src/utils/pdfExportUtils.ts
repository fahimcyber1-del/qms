/**
 * PDF Export Utilities â€” QMS ERP Pro
 * Centralised branded PDF export for all UniversalModule-based modules.
 * Delegates header/footer rendering to `pdfHeader.ts` which reads from Settings.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPdfHeader, isPdfHeaderEnabled, loadPdfSettings, loadOrgSettings, ACCENT_PALETTES } from './pdfHeader';


// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return [14, 165, 233];
  return [r, g, b];
}

function getAccentRgb(): [number, number, number] {
  try {
    const s = loadPdfSettings();
    const palette = ACCENT_PALETTES[s.colorAccent];
    if (palette) return palette.mid;
  } catch { /* */ }
  // fallback to CSS variable
  try {
    const css = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim();
    if (css && css.startsWith('#')) return hexToRgbTuple(css);
  } catch { /* */ }
  return [14, 165, 233];
}

function addAllPageFooters(doc: jsPDF): void {
  const s = loadPdfSettings();
  if (!s.globalEnableFooter) return;
  const org = loadOrgSettings();
  const pageCount = (doc as any).internal.getNumberOfPages();
  const accentPalette = ACCENT_PALETTES[s.colorAccent];
  const mid = accentPalette ? accentPalette.mid : [14, 165, 233] as [number,number,number];

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;

    // Footer line
    doc.setDrawColor(mid[0], mid[1], mid[2]);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 10, pageW - 14, pageH - 10);

    doc.setFont(s.fontStyle ?? 'helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);

    if (s.showFooterOrgName) {
      doc.text(org.name || 'QMS ERP Pro', 14, pageH - 5);
    }

    if (s.showPageNumber) {
      doc.setTextColor(mid[0], mid[1], mid[2]);
      doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pageH - 5, { align: 'right' });
    }

    if (s.showDate) {
      const center = (14 + (pageW - 14)) / 2;
      doc.setTextColor(150, 150, 150);
      doc.text(new Date().toLocaleDateString('en-GB'), center, pageH - 5, { align: 'center' });
    }

    // Watermark
    if (s.watermarkText) {
      try {
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.07 }));
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(48);
        doc.setFont('helvetica', 'bold');
        doc.text(s.watermarkText.toUpperCase(), pageW / 2, pageH / 2, { align: 'center', angle: 45 });
        doc.restoreGraphicsState();
      } catch { /* */ }
    }
  }
}

// â”€â”€ Attachments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function embedAttachments(
  doc:         jsPDF,
  attachments: string[],
  sectionTitle = 'PHOTOGRAPHIC EVIDENCE',
): Promise<void> {
  if (!attachments || attachments.length === 0) return;

  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  let y = 14;

  const accent = getAccentRgb();

  // Section header
  doc.setFillColor(248, 250, 252);
  doc.rect(12, y, w - 24, 12, 'F');
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.5);
  doc.line(12, y, 12, y + 12);
  doc.setTextColor(...accent);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(sectionTitle.toUpperCase(), 18, y + 7.5);
  y += 20;

  const IMG_W   = (w - 32) / 2; 
  const IMG_H   = 65;
  const GAP_X   = 8;
  const GAP_Y   = 12;
  const LABEL_H = 6;

  for (let i = 0; i < attachments.length; i++) {
    const col = i % 2;
    const x   = 12 + col * (IMG_W + GAP_X);

    // Page overflow check
    if (y + IMG_H + LABEL_H > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 16;
    }

    // Frame
    doc.setFillColor(251, 252, 254);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, IMG_W, IMG_H, 1, 1, 'FD');

    // Caption bar
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, y + IMG_H, IMG_W, LABEL_H - 1, 0, 0, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Figure ${i + 1} â€“ Evidence Image`, x + IMG_W / 2, y + IMG_H + LABEL_H - 3, { align: 'center' });

    try {
      const src = attachments[i];
      if (src) {
        doc.addImage(src, 'JPEG', x + 1, y + 1, IMG_W - 2, IMG_H - 2);
      }
    } catch {
      doc.setTextColor(150, 160, 180);
      doc.setFontSize(8);
      doc.text('[Image unavailable]', x + IMG_W / 2, y + IMG_H / 2, { align: 'center' });
    }

    if (col === 1 || i === attachments.length - 1) {
      y += IMG_H + LABEL_H + GAP_Y;
    }
  }
}

// â”€â”€ TABLE Export (list of records) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface TableExportOptions {
  moduleName: string;
  moduleId?: string;
  columns: string[];
  rows: string[][];
  fileName: string;
  summary?: string[];
  orientation?: 'portrait' | 'landscape';
  attachments?: string[];
}

export async function exportTableToPDF(options: TableExportOptions): Promise<void> {
  const s = loadPdfSettings();
  const accentRgb = getAccentRgb();
  const orientation = options.orientation || (s as any).orientation || 'landscape';
  const paperSize = (s as any).paperSize || 'a4';
  const layout = s.pdfStructure || 'standard';

  const doc = new jsPDF(orientation === 'portrait' ? 'p' : 'l', 'mm', paperSize);

  // Use the rich pdfHeader system if enabled
  let startY: number;
  try {
    startY = addPdfHeader(
      doc,
      `${options.moduleName} Report`,
      `Total Records: ${options.rows.length}`,
      orientation === 'landscape',
      options.moduleId ?? options.moduleName,
    );
  } catch {
    startY = 30;
    doc.setFontSize(16);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(`${options.moduleName} Report`, 14, 20);
  }

  // 2. LAYOUT-SPECIFIC LOGIC
  const isPremium = layout === 'premium' || layout === 'executive' || layout === 'technical';
  const isMinimal = layout === 'modern';
  const tableTheme = (layout === 'technical' ? 'grid' :
     layout === 'executive' ? 'grid' :
     layout === 'premium' ? 'grid' :
     layout === 'compact' ? 'plain' :
     layout === 'modern' ? 'plain' :
     layout === 'refined' ? 'grid' : 'striped');

  const tableFont = layout === 'executive' ? 'times' : 
                    layout === 'technical' ? 'courier' : 
                    (s.fontStyle || 'helvetica');

  // Optional summary block
  if (options.summary && options.summary.length > 0) {
    if (isPremium) {
       doc.setFillColor(layout === 'executive' ? 245 : (layout === 'technical' ? 230 : 249), layout === 'executive' ? 245 : (layout === 'technical' ? 235 : 250), layout === 'executive' ? 245 : (layout === 'technical' ? 240 : 251));
       doc.roundedRect(12, startY, doc.internal.pageSize.width - 24, 6 + options.summary.length * 5, 1, 1, 'F');
       doc.setDrawColor(...accentRgb);
       doc.setLineWidth(0.4);
       doc.line(12, startY, 12, startY + (6 + options.summary.length * 5));
    }
    
    doc.setFont(tableFont, isPremium ? 'bold' : 'italic');
    doc.setFontSize(isPremium ? 8.5 : 8);
    doc.setTextColor(isPremium ? accentRgb[0] : 100, isPremium ? accentRgb[1] : 100, isPremium ? accentRgb[2] : 100);
    
    let sy = startY + (isPremium ? 5 : 0);
    options.summary.forEach(line => {
      doc.text(line, 16, sy);
      sy += 5;
    });
    startY = sy + (isPremium ? 5 : 3);
  }

  autoTable(doc, {
    head: [options.columns],
    body: options.rows,
    startY,
    theme: tableTheme as any,
    styles: {
      fontSize: layout === 'compact' ? 7 : (isPremium ? 8.5 : 8),
      cellPadding: layout === 'compact' ? 2.5 : (isPremium ? 4.5 : 3.5),
      textColor: [50, 50, 50] as [number, number, number],
      font: tableFont,
      lineColor: [220, 220, 220] as [number, number, number],
      lineWidth: tableTheme === 'plain' ? 0 : 0.1,
    },
    headStyles: {
      fillColor: isMinimal ? [235, 240, 245] as [number, number, number] : accentRgb,
      textColor: isMinimal ? [30, 41, 59] as [number, number, number] : [255, 255, 255] as [number, number, number],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: tableTheme === 'striped' ? [248, 250, 252] as [number, number, number] : undefined,
    },
    tableLineColor: accentRgb,
    tableLineWidth: isPremium ? 0.2 : (tableTheme === 'plain' ? 0 : 0.1),
    margin: { left: 12, right: 12 },
  });

  if (options.attachments && options.attachments.length > 0) {
    await embedAttachments(doc, options.attachments, 'EXPORTED EVIDENCE PHOTOS');
  }

  addAllPageFooters(doc);
  doc.save(`${options.fileName}.pdf`);
}

// â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _sectionHeader(doc: jsPDF, title: string, y: number, pageW: number, accent: [number,number,number], font: string): number {
  // Full-width tinted band
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
  doc.rect(12, y, pageW - 24, 9, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  // Left accent bar (solid)
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(12, y, 4, 9, 'F');

  // Title text
  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 30, 48);
  doc.text(title.toUpperCase(), 20, y + 6.3);

  // Thin right line
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.15);
  doc.line(20 + doc.getTextWidth(title.toUpperCase()) + 3, y + 4.5, pageW - 14, y + 4.5);

  return y + 13;
}

function _fieldGrid(doc: jsPDF, fields: Array<{label: string; value: string; fullWidth?: boolean}>, startY: number, pageW: number, accent: [number,number,number], font: string): number {
  const margin = 12;
  const colW = (pageW - margin * 2 - 4) / 2;
  let y = startY;
  let col = 0;

  const LABEL_COLOR: [number,number,number] = [accent[0], accent[1], accent[2]];
  const VALUE_COLOR: [number,number,number] = [20, 30, 48];
  const BG_EVEN: [number,number,number] = [248, 250, 253];
  const BG_ODD: [number,number,number] = [255, 255, 255];

  let rowIndex = 0;

  for (const f of fields) {
    if (!f.value || f.value === 'â€”') continue;

    if (f.fullWidth) {
      // Flush partial row
      if (col === 1) { y += 14; col = 0; rowIndex++; }

      const bgy = y;
      doc.setFillColor(...(rowIndex % 2 === 0 ? BG_EVEN : BG_ODD));
      doc.rect(margin, bgy, pageW - margin * 2, 14, 'F');
      doc.setDrawColor(220, 226, 235);
      doc.setLineWidth(0.1);
      doc.line(margin, bgy + 14, pageW - margin, bgy + 14);

      doc.setFont(font, 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...LABEL_COLOR);
      doc.text(f.label.toUpperCase(), margin + 3, bgy + 5.5);

      doc.setFont(font, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...VALUE_COLOR);
      const wrapped = doc.splitTextToSize(f.value, pageW - margin * 2 - 6);
      doc.text(wrapped[0] || '', margin + 3, bgy + 11);

      y += 14;
      rowIndex++;
      col = 0;
      continue;
    }

    const xOff = col === 0 ? margin : margin + colW + 4;
    const bgy = y;

    doc.setFillColor(...(rowIndex % 2 === 0 ? BG_EVEN : BG_ODD));
    doc.rect(xOff, bgy, colW, 14, 'F');
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.1);
    doc.line(xOff, bgy + 14, xOff + colW, bgy + 14);

    doc.setFont(font, 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...LABEL_COLOR);
    doc.text(f.label.toUpperCase(), xOff + 3, bgy + 5);

    doc.setFont(font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...VALUE_COLOR);
    const val = doc.splitTextToSize(String(f.value), colW - 6);
    doc.text(val[0] || '', xOff + 3, bgy + 11);

    col++;
    if (col === 2) { y += 14; col = 0; rowIndex++; }
  }

  if (col === 1) { y += 14; }
  return y + 4;
}

// â”€â”€ SIGNATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function addSignatures(doc: jsPDF, startY: number, labelsOverride?: string[]): number {
  const s = loadPdfSettings();
  const labels = labelsOverride && labelsOverride.length ? labelsOverride : s.signatureLabels;
  if (!s.showSignatures || !labels.length) return startY;

  const pageH = doc.internal.pageSize.height;
  const pageW = doc.internal.pageSize.width;
  const accent = getAccentRgb();

  if (startY > pageH - 60) { doc.addPage(); startY = 20; }

  // Section header
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(12, startY, 4, 8, 'F');
  doc.setFont(s.fontStyle || 'helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 30, 48);
  doc.text('AUTHORIZED SIGNATURES', 20, startY + 5.8);
  startY += 12;

  const margin = 14;
  const count = labels.length;
  const sigW = (pageW - margin * 2) / count;

  labels.forEach((label, i) => {
    const x = margin + i * sigW;
    const boxY = startY;
    const boxH = 28;

    // Outer box
    doc.setFillColor(248, 250, 253);
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.25);
    doc.roundedRect(x + 2, boxY, sigW - 4, boxH, 1, 1, 'FD');

    // Stamp circle top-right
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.setGState(new (doc as any).GState({ opacity: 0.12 }));
    doc.circle(x + sigW - 8, boxY + 6, 5, 'F');
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    // Signature line
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.4);
    doc.line(x + 6, boxY + boxH - 8, x + sigW - 6, boxY + boxH - 8);

    // Label
    doc.setFont(s.fontStyle || 'helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(label.toUpperCase(), x + sigW / 2, boxY + boxH - 3, { align: 'center' });

    // "Sign here" hint
    doc.setFont(s.fontStyle || 'helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(160, 170, 185);
    doc.text('Signature & Date', x + sigW / 2, boxY + 10, { align: 'center' });
  });

  return startY + 44;
}

// â”€â”€ DETAIL Export (single record) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface DetailSection {
  title: string;
  fields: Array<{ label: string; value: string; fullWidth?: boolean }>;
}

export interface DetailExportOptions {
  moduleName: string;
  moduleId?: string;
  recordId: string;
  fields?: Array<{ label: string; value: string; fullWidth?: boolean }>;
  sections?: DetailSection[];
  comments?: Array<{ user: string; date: string; text: string }>;
  attachments?: Array<string | { name: string; data: string } | { url: string; caption: string }>;
  summary?: string[];
  signatureLabels?: string[];
  tables?: Array<{
    title: string;
    columns: string[];
    rows: string[][];
    columnStyles?: any;
  }>;
  fileName: string;
  orientation?: 'portrait' | 'landscape';
  layout?: 'standard' | 'premium' | 'executive' | 'technical' | 'compact' | 'modern';
  styleOverrides?: {
    accentColor?: string;
    font?: string;
    showImagesInline?: boolean;
    tableTheme?: 'grid' | 'striped' | 'plain';
  };
}

export async function exportDetailToPDF(options: DetailExportOptions): Promise<void> {
  const s = loadPdfSettings();
  const baseAccent = getAccentRgb();
  const accentRgb: [number,number,number] = options.styleOverrides?.accentColor
    ? hexToRgbTuple(options.styleOverrides.accentColor)
    : baseAccent;

  const paperSize = (s as any).paperSize || 'a4';
  const orientation = options.orientation || (s as any).orientation || 'portrait';
  const font = options.styleOverrides?.font || s.fontStyle || 'helvetica';

  const doc = new jsPDF(orientation === 'portrait' ? 'p' : 'l', 'mm', paperSize);
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;

  // â”€â”€ 1. HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let y: number;
  try {
    y = addPdfHeader(doc, options.moduleName, `Ref: ${options.recordId}`, orientation === 'landscape', options.moduleId ?? options.moduleName);
  } catch {
    y = 28;
    doc.setFont(font, 'bold'); doc.setFontSize(16);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(options.moduleName, 14, 20);
  }

  // â”€â”€ 2. DOCUMENT ID BAND â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Gradient-like band using two rects
  doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.rect(12, y, pageW - 24, 11, 'F');

  // Light overlay right portion
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
  doc.rect(pageW / 2, y, pageW / 2 - 24, 11, 'F');
  doc.setGState(new (doc as any).GState({ opacity: 1 }));

  doc.setFont(font, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`DOCUMENT REF: ${options.recordId}`, 17, y + 7.5);

  // Status chip right side
  const statusField = options.sections?.flatMap(s => s.fields).find(f => f.label.toLowerCase().includes('status'))
    || options.fields?.find(f => f.label.toLowerCase().includes('status'));
  const statusText = statusField?.value?.toUpperCase() || 'ISSUED';
  doc.setFont(font, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`STATUS: ${statusText}`, pageW - 18, y + 7.5, { align: 'right' });
  y += 16;

  // â”€â”€ 3. EXECUTIVE SUMMARY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (s.detailShowSummary && options.summary && options.summary.length > 0) {
    if (y + 6 + options.summary.length * 7 > pageH - 20) { doc.addPage(); y = 20; }

    const sumH = 8 + options.summary.length * 7;

    // Background panel
    doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
    doc.roundedRect(12, y, pageW - 24, sumH, 1.5, 1.5, 'F');
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    // Left accent bar
    doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.roundedRect(12, y, 4, sumH, 1, 1, 'F');

    // Title
    doc.setFont(font, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text('EXECUTIVE SUMMARY', 20, y + 5.5);

    // Lines
    doc.setFont(font, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 55, 75);
    options.summary.forEach((line, i) => {
      doc.text(`â–¸  ${line}`, 20, y + 12 + i * 7);
    });
    y += sumH + 10;
  }

  // â”€â”€ 4. CONTENT SECTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sections = options.sections || [{ title: 'Record Details', fields: options.fields || [] }];

  for (const section of sections) {
    if (!section.fields || section.fields.length === 0) continue;
    if (y > pageH - 50) { doc.addPage(); y = 20; }

    y = _sectionHeader(doc, section.title, y, pageW, accentRgb, font);
    y = _fieldGrid(doc, section.fields, y, pageW, accentRgb, font);
    y += 4;
  }

  // â”€â”€ 5. DATA TABLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (options.tables && options.tables.length > 0) {
    for (const table of options.tables) {
      if (y > pageH - 50) { doc.addPage(); y = 20; }

      y = _sectionHeader(doc, table.title, y, pageW, accentRgb, font);

      autoTable(doc, {
        head: [table.columns],
        body: table.rows,
        startY: y,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 4,
          font,
          textColor: [30, 40, 58] as [number,number,number],
          lineColor: [220, 226, 235] as [number,number,number],
          lineWidth: 0.15,
        },
        headStyles: {
          fillColor: accentRgb,
          textColor: [255, 255, 255] as [number,number,number],
          fontStyle: 'bold',
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 253] as [number,number,number],
        },
        columnStyles: table.columnStyles,
        margin: { left: 12, right: 12 },
        tableLineColor: accentRgb,
        tableLineWidth: 0.3,
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // â”€â”€ 6. AUDIT TRAIL / COMMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (s.detailShowAuditTrail && options.comments && options.comments.length > 0) {
    if (y > pageH - 50) { doc.addPage(); y = 20; }

    y = _sectionHeader(doc, 'Activity Log & Revision History', y, pageW, accentRgb, font);

    options.comments.forEach((c, i) => {
      if (y > pageH - 30) { doc.addPage(); y = 20; }

      const rowH = 16;
      const bgColor: [number,number,number] = i % 2 === 0 ? [248, 250, 253] : [255, 255, 255];

      doc.setFillColor(...bgColor);
      doc.rect(12, y, pageW - 24, rowH, 'F');

      // Timeline dot
      doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      doc.circle(17, y + rowH / 2, 1.5, 'F');

      // Vertical connector (skip for last)
      if (i < options.comments!.length - 1) {
        doc.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
        doc.setLineWidth(0.2);
        doc.line(17, y + rowH / 2 + 1.5, 17, y + rowH + 2);
      }

      doc.setFont(font, 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      doc.text(c.user, 22, y + 6);

      doc.setFont(font, 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(140, 150, 165);
      doc.text(c.date, 22, y + 11);

      doc.setFont(font, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 40, 58);
      const msg = doc.splitTextToSize(c.text, pageW - 70);
      doc.text(msg[0] || '', 55, y + rowH / 2 + 2);

      y += rowH + 2;
    });
    y += 8;
  }

  // â”€â”€ 7. ATTACHMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (options.attachments && options.attachments.length > 0) {
    const rawData = options.attachments.map(a => {
      if (typeof a === 'string') return a;
      if ('data' in a) return a.data;
      if ('url' in a) return a.url;
      return '';
    }).filter(Boolean);
    await embedAttachments(doc, rawData, 'EVIDENCE & DOCUMENTATION GALLERY');
  }

  // â”€â”€ 8. SIGNATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  addSignatures(doc, y, options.signatureLabels);

  // â”€â”€ 9. FINALIZE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  addAllPageFooters(doc);
  doc.save(`${options.fileName}.pdf`);
}
