/**
 * Export Preview Utilities — QMS ERP Pro
 * Handles opening the export preview in a new tab.
 */

import { DetailExportOptions, TableExportOptions } from './pdfExportUtils';

export function openExportPreview(options: DetailExportOptions | TableExportOptions) {
  // Store the options in localStorage so the new tab can read it
  localStorage.setItem('qms_export_preview_data', JSON.stringify(options));
  
  // Open the new tab with the export-preview hash
  // We use the hash-based routing since the app uses it
  const url = window.location.origin + window.location.pathname + '#export-preview';
  window.open(url, '_blank');
}
