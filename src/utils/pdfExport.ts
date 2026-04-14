import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
export { autoTable };
import { addPdfHeader, loadOrgSettings, loadPdfSettings, PdfModuleId } from './pdfHeader';

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
// Returns the Y position where body content should start.
export function drawPdfHeader(
  doc:      jsPDF,
  title:    string,
  subtitle?: string,
  moduleId?: PdfModuleId
): number {
  return addPdfHeader(doc, title, subtitle, false, moduleId);
}

// ─── Footer on every page ────────────────────────────────────────────────────
export function addPageFooters(doc: jsPDF) {
  const pdfSettings = loadPdfSettings();

  // Master switch — skip entirely if disabled in Settings
  if (!pdfSettings.globalEnableFooter) return;

  const { showPageNumber, showDate, showFooterOrgName } = pdfSettings;
  // If all individual items are off, no footer bar is needed
  if (!showPageNumber && !showDate && !showFooterOrgName) return;

  const totalPages = (doc as any).internal.getNumberOfPages?.() ?? 1;
  const w = pageW(doc);
  const orgName = loadOrgSettings().name;
  const accentColor = PDF_COLORS.accentBlue;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();

    // Separator line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.4);
    doc.line(12, pageH - 10, w - 12, pageH - 10);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PDF_COLORS.muted);

    if (showFooterOrgName) {
      doc.text(`${orgName}`, 12, pageH - 5);
    }
    if (showPageNumber) {
      doc.text(`Page ${i} of ${totalPages}`, w / 2, pageH - 5, { align: 'center' });
    }
    if (showDate) {
      doc.text(new Date().toLocaleDateString('en-GB'), w - 12, pageH - 5, { align: 'right' });
    }
  }
}


// ─── Metadata info block (key-value pairs) ────────────────────────────────────
export function drawInfoGrid(
  doc:   jsPDF,
  y:     number,
  items: { label: string; value: string }[],
  cols?: number,             // how many columns side-by-side (default 2)
): number {
  const w    = pageW(doc);
  const COLS = cols ?? 2;
  const colW = (w - 24) / COLS;
  const ROW  = 9;
  const PAD  = 4;

  // Light background band
  const rows   = Math.ceil(items.length / COLS);
  const totalH = rows * ROW + PAD * 2;

  doc.setFillColor(...PDF_COLORS.rowOdd);
  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, y, w - 24, totalH, 2, 2, 'FD');

  items.forEach((item, idx) => {
    const col  = idx % COLS;
    const row  = Math.floor(idx / COLS);
    const x    = 12 + col * colW + PAD;
    const cellY = y + PAD + row * ROW + 5.5;

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.muted);
    doc.text(item.label.toUpperCase(), x, cellY - 3);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.text);
    const maxW = colW - PAD * 2 - 2;
    const lines = doc.splitTextToSize(item.value || '—', maxW);
    doc.text(lines[0] ?? '—', x, cellY);
  });

  return y + totalH + 6;
}

// ─── Section label ────────────────────────────────────────────────────────────
export function drawSectionLabel(doc: jsPDF, y: number, label: string): number {
  const w = pageW(doc);

  doc.setFillColor(...PDF_COLORS.accentBlue);
  doc.rect(12, y, 3, 7, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PDF_COLORS.headerBg);
  doc.text(label.toUpperCase(), 18, y + 5.5);

  doc.setDrawColor(...PDF_COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(18 + doc.getTextWidth(label.toUpperCase()) + 3, y + 3.5, w - 12, y + 3.5);

  return y + 12;
}

// ─── Professional autoTable wrapper ──────────────────────────────────────────
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
  autoTable(doc, {
    startY,
    head,
    body,
    foot: opts?.foot,
    theme: 'grid',
    margin: { left: 12, right: 12 },
    styles: {
      fontSize:    8.5,
      cellPadding: 3.5,
      textColor:   PDF_COLORS.text,
      lineColor:   PDF_COLORS.border,
      lineWidth:   0.25,
      font:        'helvetica',
    },
    headStyles: {
      fillColor:  PDF_COLORS.headerBg,
      textColor:  PDF_COLORS.white,
      fontSize:   8.5,
      fontStyle:  'bold',
      halign:     'center',
      cellPadding: 4,
    },
    footStyles: {
      fillColor: PDF_COLORS.rowOdd,
      textColor: PDF_COLORS.text,
      fontStyle: 'bold',
      fontSize:  8.5,
    },
    alternateRowStyles: {
      fillColor: PDF_COLORS.rowOdd,
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

  // Section header
  doc.setFillColor(...PDF_COLORS.headerBg);
  doc.rect(0, 0, w, 18, 'F');
  doc.setTextColor(...PDF_COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(sectionTitle, w / 2, 12, { align: 'center' });
  y = 26;

  const IMG_W   = (w - 36) / 2; // two per row
  const IMG_H   = 70;
  const GAP_X   = 12;
  const GAP_Y   = 8;
  const LABEL_H = 8;

  for (let i = 0; i < attachments.length; i++) {
    const col = i % 2;
    const x   = 12 + col * (IMG_W + GAP_X);

    // new row: check page space
    if (col === 0 && i > 0) {
      y += IMG_H + LABEL_H + GAP_Y;
    }
    if (y + IMG_H + LABEL_H > doc.internal.pageSize.getHeight() - 16) {
      doc.addPage();
      y = 16;
    }

    // Frame
    doc.setFillColor(...PDF_COLORS.rowOdd);
    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, IMG_W, IMG_H, 2, 2, 'FD');

    // Caption bar
    doc.setFillColor(...PDF_COLORS.headerBg);
    doc.roundedRect(x, y + IMG_H, IMG_W, LABEL_H - 1, 0, 0, 'F');
    doc.setTextColor(...PDF_COLORS.white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`Figure ${i + 1} – Evidence Image`, x + IMG_W / 2, y + IMG_H + LABEL_H - 3, { align: 'center' });

    try {
      // base64 or url
      const src = attachments[i];
      if (src) {
        doc.addImage(src, 'JPEG', x + 1, y + 1, IMG_W - 2, IMG_H - 2);
      }
    } catch {
      // fallback placeholder text
      doc.setTextColor(...PDF_COLORS.muted);
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

    doc.setDrawColor(...PDF_COLORS.border);
    doc.setLineWidth(0.4);
    doc.line(x + 4, y + 18, x + colW - 4, y + 18);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.muted);
    doc.text(lbl.toUpperCase(), x + colW / 2, y + 24, { align: 'center' });

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature & Date', x + colW / 2, y + 29, { align: 'center' });
  });

  return y + 35;
}
