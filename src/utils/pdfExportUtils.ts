/**
 * PDF Export Utilities — QMS ERP Pro
 * Centralised branded PDF export for all UniversalModule-based modules.
 * Delegates header/footer rendering to `pdfHeader.ts` which reads from Settings.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addPdfHeader, isPdfHeaderEnabled, loadPdfSettings, loadOrgSettings, ACCENT_PALETTES } from './pdfHeader';
import { embedAttachments } from './pdfExport';

// ── Helpers ─────────────────────────────────────────────────────────────────
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

// ── TABLE Export (list of records) ───────────────────────────────────────────
export interface TableExportOptions {
  moduleName: string;
  moduleId?: string;
  columns: string[];
  rows: string[][];
  fileName: string;
  summary?: string[];
}

export function exportTableToPDF(options: TableExportOptions): void {
  const s = loadPdfSettings();
  const accentRgb = getAccentRgb();
  const orientation = (s as any).orientation ?? 'landscape';
  const paperSize = (s as any).paperSize ?? 'a4';

  const doc = new jsPDF(orientation, 'mm', paperSize);

  // Use the rich pdfHeader system if enabled
  let startY: number;
  try {
    startY = addPdfHeader(
      doc,
      `${options.moduleName} Report`,
      `Total Records: ${options.rows.length}`,
      false,
      options.moduleId ?? options.moduleName,
    );
  } catch {
    startY = 30;
    doc.setFontSize(16);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(`${options.moduleName} Report`, 14, 20);
  }

  // Optional summary block
  if (options.summary && options.summary.length > 0) {
    doc.setFont(s.fontStyle ?? 'helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    let sy = startY;
    options.summary.forEach(line => {
      doc.text(line, 14, sy);
      sy += 5;
    });
    startY = sy + 3;
  }

  autoTable(doc, {
    head: [options.columns],
    body: options.rows,
    startY,
    styles: {
      fontSize: (s as any).fontSize ?? 8,
      cellPadding: 3.5,
      textColor: [50, 50, 50] as [number, number, number],
      lineColor: [220, 220, 220] as [number, number, number],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: accentRgb,
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] as [number, number, number],
    },
    tableLineColor: accentRgb,
    tableLineWidth: 0.15,
  });

  addAllPageFooters(doc);
  doc.save(`${options.fileName}.pdf`);
}

// ── DETAIL Export (single record) ────────────────────────────────────────────
export interface DetailExportOptions {
  moduleName: string;
  moduleId?: string;
  recordId: string;
  fields: Array<{ label: string; value: string }>;
  comments?: Array<{ user: string; date: string; text: string }>;
  attachments?: Array<{ name: string; data: string }>;
  fileName: string;
}

export async function exportDetailToPDF(options: DetailExportOptions): Promise<void> {
  const s = loadPdfSettings();
  const accentRgb = getAccentRgb();
  const paperSize = (s as any).paperSize ?? 'a4';

  const doc = new jsPDF('portrait', 'mm', paperSize);
  const pageW = doc.internal.pageSize.width;

  // Branded header
  let startY: number;
  try {
    startY = addPdfHeader(
      doc,
      options.moduleName,
      `Record: ${options.recordId}`,
      false,
      options.moduleId ?? options.moduleName,
    );
  } catch {
    startY = 30;
    doc.setFontSize(16);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(options.moduleName, 14, 20);
  }

  // Record ID badge
  doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.roundedRect(14, startY, 90, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(s.fontStyle ?? 'helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Record ID: ${options.recordId}`, 18, startY + 6);
  startY += 16;

  // Record details table
  const detailRows = options.fields
    .filter(f => f.value && f.value !== '—')
    .map(f => [f.label, f.value]);

  autoTable(doc, {
    body: detailRows,
    startY,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      textColor: [60, 60, 60] as [number, number, number],
    },
    columnStyles: {
      0: {
        fontStyle: 'bold',
        cellWidth: 65,
        fillColor: [248, 250, 252] as [number, number, number],
        textColor: accentRgb,
      },
      1: { cellWidth: pageW - 65 - 28 },
    },
    theme: 'grid',
    tableLineColor: accentRgb,
    tableLineWidth: 0.2,
  });

  let finalY = (doc as any).lastAutoTable.finalY + 14;

  // Comments section
  if (options.comments && options.comments.length > 0) {
    if (finalY > 250) { doc.addPage(); finalY = 20; }

    doc.setFont(s.fontStyle ?? 'helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text('Communications & Comments', 14, finalY);
    finalY += 5;

    const commentRows = options.comments.map(c => [
      `${c.user}\n${c.date}`,
      c.text,
    ]);

    autoTable(doc, {
      body: commentRows,
      startY: finalY,
      styles: {
        fontSize: 9,
        cellPadding: 5,
        textColor: [60, 60, 60] as [number, number, number],
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          cellWidth: 55,
          fillColor: [248, 250, 252] as [number, number, number],
        },
      },
      theme: 'plain',
    });
  }

  // Attachments section
  if (options.attachments && options.attachments.length > 0) {
    const rawData = options.attachments.map(a => a.data);
    await embedAttachments(doc, rawData, 'ATTACHED PHOTOS & EVIDENCE');
  }

  addAllPageFooters(doc);
  doc.save(`${options.fileName}.pdf`);
}
