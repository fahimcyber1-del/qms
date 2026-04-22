import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileDown, FileText, FileSpreadsheet, X, ChevronDown, Layers } from 'lucide-react';
import { embedAttachments } from '../utils/pdfExportUtils';
import { exportTableToPDF, TableExportOptions } from '../utils/pdfExportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  columns: { key: string; label: string }[];
  title: string;
  moduleId?: string;
  dateKey?: string;
  extraFilters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  /** Optional: key whose value is an attachments array (string[]) on each item */
  attachmentKey?: string;
}

export function ExportModal({
  isOpen, onClose, data, columns, title,
  moduleId, dateKey = 'date', extraFilters, attachmentKey,
}: ExportModalProps) {
  const [format,       setFormat]      = useState<'csv' | 'xlsx' | 'pdf'>('pdf');
  const [startDate,    setStartDate]   = useState('');
  const [endDate,      setEndDate]     = useState('');
  const [orientation,  setOrientation] = useState<'p' | 'l'>('p');
  const [pageSize,     setPageSize]    = useState<'a4' | 'letter'>('a4');
  const [extraFilterValues, setExtraFilterValues] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleExtraFilterChange = (key: string, value: string) =>
    setExtraFilterValues(prev => ({ ...prev, [key]: value }));

  // ── Filter ────────────────────────────────────────────────────────────────
  const getFiltered = () => {
    let filtered = data;
    if (startDate && endDate) {
      filtered = filtered.filter(
        item => item[dateKey] >= startDate && item[dateKey] <= endDate,
      );
    }
    extraFilters?.forEach(f => {
      const val = extraFilterValues[f.key];
      if (val && val !== '' && val !== 'All')
        filtered = filtered.filter(item => item[f.key] === val);
    });
    return filtered;
  };

  // ── Export handlers ───────────────────────────────────────────────────────
  const handleExport = async () => {
    const filteredData = getFiltered();

    if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `${title}.csv`; a.click();

    } else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook  = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31));
      XLSX.writeFile(workbook, `${title}.xlsx`);

    } else if (format === 'pdf') {
      const headColumns = columns.map(c => c.label);
      const rowData = filteredData.map(item =>
        columns.map(c => {
          const v = item[c.key];
          return v !== null && v !== undefined ? String(v) : '—';
        }),
      );

      let allAttachments: string[] = [];
      if (attachmentKey) {
        allAttachments = filteredData.flatMap(
          item => (Array.isArray(item[attachmentKey]) ? item[attachmentKey] : [])
        );
      }

      await exportTableToPDF({
        moduleName: title,
        moduleId: moduleId ?? title,
        columns: headColumns,
        rows: rowData,
        fileName: title.replace(/\s+/g, '_'),
        orientation: orientation === 'p' ? 'portrait' : 'landscape',
        summary: [
          `Date Range: ${startDate || 'All'} to ${endDate || 'All'}`,
          `Export Date: ${new Date().toLocaleDateString('en-GB')}`
        ],
        attachments: allAttachments
      });
    }

    onClose();
  };

  // ─── UI ─────────────────────────────────────────────────────────────────
  const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...p}
      className="
        w-full bg-bg-2 border border-border-main rounded-xl px-3 py-2.5
        text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30
        focus:border-accent transition-all
      "
    />
  );

  const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <div className="relative">
      <select
        {...p}
        className="
          w-full appearance-none bg-bg-2 border border-border-main rounded-xl px-3 py-2.5 pr-8
          text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30
          focus:border-accent transition-all cursor-pointer
        "
      />
      <ChevronDown className="w-3.5 h-3.5 text-text-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-bold text-text-2 mb-1.5 uppercase tracking-wide">{children}</p>
  );

  const FormatBtn = ({ id, icon, label }: { id: typeof format; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setFormat(id)}
      className={`
        flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all
        ${format === id
          ? 'bg-accent/10 border-accent text-accent'
          : 'bg-bg-2 border-border-main text-text-3 hover:border-text-3'}
      `}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-bg-1 rounded-2xl border border-border-main shadow-2xl w-full max-w-md flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileDown className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-text-1 text-sm">Export Data</h2>
              <p className="text-xs text-text-3 mt-0.5">{title} — {data.length} records</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

          {/* Format selector */}
          <div>
            <Label>Export Format</Label>
            <div className="flex gap-2">
              <FormatBtn id="pdf"  icon={<FileText className="w-4 h-4" />}        label="PDF" />
              <FormatBtn id="xlsx" icon={<FileSpreadsheet className="w-4 h-4" />} label="Excel" />
              <FormatBtn id="csv"  icon={<Layers className="w-4 h-4" />}          label="CSV" />
            </div>
          </div>

          {/* PDF-specific options */}
          {format === 'pdf' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
              <div>
                <Label>Orientation</Label>
                <Select value={orientation} onChange={e => setOrientation(e.target.value as any)}>
                  <option value="p">Portrait</option>
                  <option value="l">Landscape</option>
                </Select>
              </div>
              <div>
                <Label>Paper Size</Label>
                <Select value={pageSize} onChange={e => setPageSize(e.target.value as any)}>
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </Select>
              </div>
            </div>
          )}

          {/* Date range */}
          <div>
            <Label>Date Range (optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="From" />
              <Input type="date" value={endDate}   onChange={e => setEndDate(e.target.value)}   placeholder="To" />
            </div>
          </div>

          {/* Extra filters */}
          {extraFilters && extraFilters.length > 0 && (
            <div className="space-y-3">
              <Label>Filters</Label>
              {extraFilters.map(filter => (
                <div key={filter.key}>
                  <p className="text-xs text-text-3 mb-1">{filter.label}</p>
                  <Select
                    value={extraFilterValues[filter.key] || 'All'}
                    onChange={e => handleExtraFilterChange(filter.key, e.target.value)}
                  >
                    <option value="All">All</option>
                    {filter.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          )}

          {/* Preview count */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-2 rounded-xl border border-border-main">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs text-text-2 font-medium">
              <span className="font-bold text-text-1">{getFiltered().length}</span> records will be exported
            </span>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-border-main">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border-main text-sm font-semibold text-text-2 hover:bg-bg-2 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
          >
            <FileDown className="w-4 h-4" />
            Export {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
