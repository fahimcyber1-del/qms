import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
export { autoTable };
import { ACCENT_PALETTES, addPdfHeader, loadOrgSettings, loadPdfSettings, PdfModuleId } from './pdfHeader';

// ─── Colour palette ─────────────────────────────────────────────────────────
export const PDF_COLORS = {
  headerBg:   [15,  30,  60]  as [number, number, number],
  accentBlue: [37,  99,  235] as [number, number, number],
  rowOdd:     [248, 250, 252] as [number, number, number],
  rowEven:    [255, 255, 255] as [number, number, number],
  border:     [226, 232, 240] as [number, number, number],
  text:       [15,  23,  42]  as [number, number, number],
  muted:      [100, 116, 139] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
  success:    [16,  185, 129] as [number, number, number],
  danger:     [239, 68,  68]  as [number, number, number],
  warning:    [245, 158, 11]  as [number, number, number],
};

export interface PdfDocOptions {
  orientation?: 'p' | 'l';
  paperSize?:   'a4' | 'letter';
}

// ─── Create jsPDF instance ───────────────────────────────────────────────────
export function createDoc(opts: PdfDocOptions = {}) {
  return new jsPDF(opts.orientation ?? 'p', 'mm', opts.paperSize ?? 'a4');
}

// ─── Page width helper ───────────────────────────────────────────────────────
export function pageW(doc: jsPDF) {
  return doc.internal.pageSize.getWidth();
}

// ─── Professional header bar ─────────────────────────────────────────────────
export function drawPdfHeader(
  doc:      jsPDF,
  title:    string,
  subtitle?: string,
  moduleId?: PdfModuleId
): number {
  return addPdfHeader(doc, title, subtitle, false, moduleId);
}

// ─── Utility to get current accent color ───
export function getAccentColorArr(): [number, number, number] {
  const { colorAccent } = loadPdfSettings();
  return ACCENT_PALETTES[colorAccent]?.mid || [15, 30, 60];
}

// ─── Footer on every page ────────────────────────────────────────────────────
export function addPageFooters(doc: jsPDF) {
  const pdfSettings = loadPdfSettings();
  if (!pdfSettings.globalEnableFooter) return;

  const { showPageNumber, showDate, showFooterOrgName } = pdfSettings;
  if (!showPageNumber && !showDate && !showFooterOrgName) return;

  const totalPages = (doc as any).internal.getNumberOfPages?.() ?? 1;
  const w = pageW(doc);
  const orgName = loadOrgSettings().name;
  const accentColorArr = getAccentColorArr();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();

    // Subtle signature line
    doc.setDrawColor(...accentColorArr);
    doc.setLineWidth(0.3);
    doc.setGState(new (doc as any).GState({ opacity: 0.4 }));
    doc.line(12, pageH - 12, w - 12, pageH - 12);
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 120, 140);

    if (showFooterOrgName) doc.text(orgName, 12, pageH - 7.5);
    if (showPageNumber) doc.text(`Page ${i} of ${totalPages}`, w / 2, pageH - 7.5, { align: 'center' });
    if (showDate) doc.text(new Date().toLocaleDateString('en-GB'), w - 12, pageH - 7.5, { align: 'right' });
  }
}

// ─── Professional Record Detail (Individual) ──────────────────────────────────
export function drawRecordTable(
  doc:   jsPDF,
  startY: number,
  title:  string,
  data:   { label: string; value: string; fullWidth?: boolean }[]
): number {
  const accent = getAccentColorArr();
  
  // Section separator
  doc.setFillColor(...accent);
  doc.rect(12, startY, 4, 7, 'F');
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(title.toUpperCase(), 18, startY + 5.5);
  
  const body: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.fullWidth) {
      body.push([
        { content: item.label.toUpperCase(), styles: { fontStyle: 'bold', fillColor: [248, 250, 255], cellWidth: 40 } }, 
        { content: item.value || '—', colSpan: 3 }
      ]);
    } else {
      const next = data[i+1];
      if (next && !next.fullWidth) {
        body.push([
          { content: item.label.toUpperCase(), styles: { fontStyle: 'bold', fillColor: [248, 250, 255], cellWidth: 40 } }, 
          { content: item.value || '—' },
          { content: next.label.toUpperCase(), styles: { fontStyle: 'bold', fillColor: [248, 250, 255], cellWidth: 40 } },
          { content: next.value || '—' }
        ]);
        i++; 
      } else {
        body.push([
          { content: item.label.toUpperCase(), styles: { fontStyle: 'bold', fillColor: [248, 250, 255], cellWidth: 40 } }, 
          { content: item.value || '—', colSpan: 3 }
        ]);
      }
    }
   body.push();
  }

  autoTable(doc, {
    startY: startY + 11,
    body,
    theme: 'grid',
    styles: { 
      fontSize: 8.5, 
      cellPadding: 4, 
      lineColor: [226, 232, 240], 
      lineWidth: 0.15, 
      font: 'helvetica',
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 40 },
      2: { cellWidth: 40 }
    },
    margin: { left: 12, right: 12 }
  });

  return (doc as any).lastAutoTable.finalY + 8;
}

// ─── Metadata info grid ───────────────────────────────────────────────────────
export function drawInfoGrid(
  doc:   jsPDF,
  y:     number,
  items: { label: string; value: string }[],
  cols?: number,
): number {
  const accent = getAccentColorArr();
  const w    = pageW(doc);
  const COLS = cols ?? 2;
  const colW = (w - 24) / COLS;
  const ROW  = 11;
  const PAD  = 4.5;

  const rows   = Math.ceil(items.length / COLS);
  const totalH = rows * ROW + PAD * 2;

  // Modern soft background
  doc.setFillColor(250, 251, 253);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, y, w - 24, totalH, 1, 1, 'FD');

  items.forEach((item, idx) => {
    const col  = idx % COLS;
    const row  = Math.floor(idx / COLS);
    const x    = 12 + col * colW + PAD;
    const cellY = y + PAD + row * ROW + 6;

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accent);
    doc.text(item.label.toUpperCase(), x, cellY - 3.5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    const maxW = colW - PAD * 2 - 2;
    const lines = doc.splitTextToSize(String(item.value || '—'), maxW);
    doc.text(lines[0] ?? '—', x, cellY + 0.8);
  });

  return y + totalH + 8;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function drawSectionLabel(doc: jsPDF, y: number, label: string): number {
  const accent = getAccentColorArr();
  const w = pageW(doc);

  doc.setFillColor(...accent);
  doc.rect(12, y, 4, 8, 'F');

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(label.toUpperCase(), 19, y + 6);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  const textW = doc.getTextWidth(label.toUpperCase());
  doc.line(19 + textW + 5, y + 4.5, w - 12, y + 4.5);

  return y + 14;
}

// ─── Professional autoTable wrapper (For Lists) ──────────────────────────────
export function proTable(
  doc:    jsPDF,
  startY: number,
  head:   string[][],
  body:   (string | number | null | undefined)[][],
  opts?: {
    columnStyles?: Record<number, object>;
    foot?:         string[][];
  },
): number {
  const accent = getAccentColorArr();
  
  autoTable(doc, {
    startY,
    head,
    body,
    foot: opts?.foot,
    theme: 'striped',
    margin: { left: 12, right: 12 },
    styles: {
      fontSize:    8,
      cellPadding: 4,
      textColor:   [30, 41, 59],
      lineColor:   [226, 232, 240],
      lineWidth:   0.05,
      font:        'helvetica',
      overflow:    'linebreak',
    },
    headStyles: {
      fillColor:   accent,
      textColor:   [255, 255, 255],
      fontSize:    8.5,
      fontStyle:   'bold',
      halign:      'left',
      cellPadding: 4.5,
    },
    alternateRowStyles: {
      fillColor: [251, 252, 254],
    },
    columnStyles: opts?.columnStyles,
  });

  return (doc as any).lastAutoTable?.finalY ?? startY;
}

// ─── Embed attachments (base64 images) on next page(s) ───────────────────────
export async function embedAttachments(
  doc:         jsPDF,
  attachments: string[],
  sectionTitle = 'PHOTOGRAPHIC EVIDENCE',
): Promise<void> {
  if (!attachments || attachments.length === 0) return;

  doc.addPage();
  const w = pageW(doc);
  let y = 14;

  const accent = getAccentColorArr();

  // Section header
  doc.setFillColor(...accent);
  doc.rect(0, 0, w, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(sectionTitle, w / 2, 12, { align: 'center' });
  y = 28;

  const IMG_W   = (w - 36) / 2; 
  const IMG_H   = 70;
  const GAP_X   = 12;
  const GAP_Y   = 8;
  const LABEL_H = 8;

  for (let i = 0; i < attachments.length; i++) {
    const col = i % 2;
    const x   = 12 + col * (IMG_W + GAP_X);

    if (col === 0 && i > 0) {
      y += IMG_H + LABEL_H + GAP_Y;
    }
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
    doc.text(`Figure ${i + 1} – Evidence Image`, x + IMG_W / 2, y + IMG_H + LABEL_H - 3, { align: 'center' });

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
  }
}

// ─── Signature row ───────────────────────────────────────────────────────────
export function drawSignatureRow(
  doc:    jsPDF,
  y:      number,
  labels: string[],
): number {
  const w    = pageW(doc);
  const colW = (w - 24) / labels.length;

  labels.forEach((lbl, i) => {
    const x = 12 + i * colW;

    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.4);
    doc.line(x + 5, y + 18, x + colW - 5, y + 18);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(lbl.toUpperCase(), x + colW / 2, y + 24, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature & Date', x + colW / 2, y + 29, { align: 'center' });
  });

  return y + 35;
}
