import React, { useEffect, useState, useRef } from 'react';
import { 
  Printer, FileDown, FileSpreadsheet, Image as ImageIcon, 
  X, Check, Download, Layers, Calendar, User, Tag,
  Maximize2, Minimize2, Settings as SettingsIcon, ChevronDown,
  Layout, Monitor, Smartphone, FileText
} from 'lucide-react';
import { DetailExportOptions } from '../utils/pdfExportUtils';
import * as XLSX from 'xlsx';
import domtoimage from 'dom-to-image-more';

type PageSize = 'a4' | 'letter';
type Orientation = 'portrait' | 'landscape';

export function ExportPreview() {
  const [options, setOptions] = useState<DetailExportOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [showSettings, setShowSettings] = useState(true);
  const [zoom, setZoom] = useState(100);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('qms_export_preview_data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setOptions(parsed);
        if (parsed.orientation) setOrientation(parsed.orientation);
      } catch (e) {
        console.error("Failed to parse export data", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading && !options) {
    return (
      <div className="min-h-screen bg-bg-0 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileDown className="w-6 h-6 text-accent" />
          </div>
        </div>
        <p className="text-text-1 text-xl font-black tracking-tight mt-6">Preparing Preview</p>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="min-h-screen bg-bg-0 flex flex-col items-center justify-center p-8 text-center">
        <X className="w-16 h-16 text-rose-500 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-text-1">No Export Data Found</h2>
        <p className="text-text-2 mt-2">The export session may have expired or was not initialized correctly.</p>
        <button onClick={() => window.close()} className="mt-6 btn btn-primary px-8">Close Tab</button>
      </div>
    );
  }

  const handlePrint = () => {
    // Inject print styles for orientation and size
    const style = document.createElement('style');
    const sizeMap = {
      'a4': { portrait: '210mm 297mm', landscape: '297mm 210mm' },
      'letter': { portrait: '8.5in 11in', landscape: '11in 8.5in' }
    };
    
    style.innerHTML = `
      @page { 
        size: ${sizeMap[pageSize][orientation]}; 
        margin: 0; 
      }
      @media print {
        body { background: white !important; margin: 0 !important; padding: 0 !important; }
        .print-hidden { display: none !important; }
        #report-paper { 
          transform: none !important; 
          margin: 0 auto !important; 
          width: ${pageSize === 'a4' ? '210mm' : '8.5in'} !important;
          min-height: ${pageSize === 'a4' ? '297mm' : '11in'} !important;
          box-shadow: none !important;
          border: none !important;
          padding: 15mm !important;
          display: flex !important;
          flex-direction: column !important;
        }
        /* Preserve colors and remove interactive artifacts */
        * { 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important; 
          outline: none !important; 
          box-shadow: none !important; 
        }
        .report-section { break-inside: avoid; margin-bottom: 30px; }
        table { width: 100% !important; border-collapse: collapse !important; table-layout: auto !important; }
        th, td { border: 1px solid #e2e8f0 !important; }
        img { max-width: 100% !important; height: auto !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setGenerating(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      
      const scale = 2;
      const baseWidth = 1000; // Stabilize layout width for capture
      const baseHeight = (reportRef.current.offsetHeight / reportRef.current.offsetWidth) * baseWidth;
      
      const canvas = await domtoimage.toCanvas(reportRef.current, {
        bgcolor: '#ffffff',
        width: baseWidth * scale,
        height: baseHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: baseWidth + 'px',
          height: baseHeight + 'px',
          // Force reset all potential artifacts
          outline: 'none !important',
          boxShadow: 'none !important',
          textShadow: 'none !important',
          overflow: 'visible'
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF(orientation === 'portrait' ? 'p' : 'l', 'mm', pageSize);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height / canvas.width) * pdfWidth;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${options.fileName || 'Report'}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Modern CSS features might be causing issues. Please use the Print option instead.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportExcel = () => {
    const wsData: any[] = [];
    wsData.push([options.moduleName]);
    wsData.push([`Reference: ${options.recordId}`]);
    wsData.push([]);

    if (options.fields) {
      options.fields.forEach(f => wsData.push([f.label, f.value]));
    }

    if (options.sections) {
      options.sections.forEach(s => {
        wsData.push([]);
        wsData.push([s.title.toUpperCase()]);
        s.fields.forEach(f => wsData.push([f.label, f.value]));
      });
    }

    if (options.tables) {
      options.tables.forEach(t => {
        wsData.push([]);
        wsData.push([t.title.toUpperCase()]);
        wsData.push(t.columns);
        t.rows.forEach(r => wsData.push(r));
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${options.fileName}.xlsx`);
  };

  // Helper for page dimensions
  const getPageDimensions = () => {
    const units = { a4: { w: 210, h: 297 }, letter: { w: 215.9, h: 279.4 } };
    const base = units[pageSize];
    return orientation === 'portrait' 
      ? { width: `${base.w}mm`, minHeight: `${base.h}mm` }
      : { width: `${base.h}mm`, minHeight: `${base.w}mm` };
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-bg-0 flex flex-col font-sans select-none overflow-hidden relative">
      {/* PDF Generation Overlay */}
      {generating && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-bg-1 p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-white/10 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileDown className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-text-1 text-xl font-black tracking-tight">Generating PDF</p>
              <p className="text-text-3 text-sm mt-1">Converting to high-fidelity vector format...</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="h-16 bg-white/80 dark:bg-bg-1/80 backdrop-blur-xl border-b border-border-main flex items-center justify-between px-6 z-50 print-hidden shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-border-main">
            <div className="p-2 bg-accent rounded-xl text-white shadow-lg shadow-accent/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-text-1 uppercase tracking-wider leading-none">{options.moduleName}</h1>
              <p className="text-[10px] text-text-3 font-bold mt-1 uppercase tracking-widest">{options.recordId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-bg-2 p-1 rounded-xl border border-border-main">
            <button 
              onClick={() => setOrientation('portrait')}
              className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${orientation === 'portrait' ? 'bg-white dark:bg-bg-1 shadow-md text-accent' : 'text-text-3 hover:text-text-1'}`}
            >
              <Layout className="w-3.5 h-3.5" /> Portrait
            </button>
            <button 
              onClick={() => setOrientation('landscape')}
              className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-black uppercase rounded-lg transition-all ${orientation === 'landscape' ? 'bg-white dark:bg-bg-1 shadow-md text-accent' : 'text-text-3 hover:text-text-1'}`}
            >
              <Layout className="w-3.5 h-3.5 rotate-90" /> Landscape
            </button>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase text-text-2 bg-slate-100 dark:bg-bg-2 rounded-xl border border-border-main hover:bg-slate-200 transition-colors">
              Size: {pageSize.toUpperCase()} <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-bg-1 border border-border-main rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top translate-y-2 group-hover:translate-y-0 z-[60]">
              <div className="p-1">
                {(['a4', 'letter'] as PageSize[]).map(s => (
                  <button 
                    key={s}
                    onClick={() => setPageSize(s)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-bold uppercase rounded-lg ${pageSize === s ? 'bg-accent/10 text-accent' : 'text-text-2 hover:bg-slate-50 dark:hover:bg-bg-2'}`}
                  >
                    {s.toUpperCase()} {pageSize === s && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4 bg-slate-100 dark:bg-bg-2 p-1 rounded-xl border border-border-main">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 hover:text-accent transition-colors"><Minimize2 className="w-4 h-4" /></button>
            <span className="text-[10px] font-black w-10 text-center text-text-2">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 hover:text-accent transition-colors"><Maximize2 className="w-4 h-4" /></button>
          </div>

          <button 
            onClick={handlePrint} 
            className="btn bg-slate-900 text-white hover:bg-black flex items-center gap-2 px-5 rounded-xl shadow-lg shadow-black/10"
            disabled={generating}
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button 
            onClick={handleExportPDF} 
            className="btn bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-2 px-5 rounded-xl shadow-lg shadow-rose-600/20" 
            disabled={generating}
          >
            <Download className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={handleExportExcel} 
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 px-5 rounded-xl shadow-lg shadow-emerald-600/20"
            disabled={generating}
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          
          <div className="w-px h-8 bg-border-main mx-2"></div>
          
          <button onClick={() => window.close()} className="p-2 hover:bg-rose-500/10 hover:text-rose-500 text-text-3 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto p-12 flex justify-center bg-slate-200 dark:bg-bg-0 custom-scrollbar relative">
        {/* Backdrop deco */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center text-[20vw] font-black text-slate-900 rotate-12">
          QMS REPORT
        </div>

        <div 
          style={{ 
            ...getPageDimensions(),
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="transition-all duration-500 ease-in-out"
        >
          <div 
            ref={reportRef}
            id="report-paper"
            className="bg-white text-slate-900 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.3)] print-shadow-none overflow-hidden relative flex flex-col"
            style={{ 
              width: '100%', 
              minHeight: '100%', 
              padding: '20mm',
              // These inline styles help ensure the capture is clean
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            {/* Capture Reset Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              #report-paper * { 
                outline: none !important; 
                box-shadow: none !important;
                -webkit-print-color-adjust: exact;
              }
            ` }} />
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl">Q</div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900">{options.moduleName}</h2>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.3em]">Official Quality Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Document Ref</span>
                    <span className="text-sm font-bold text-slate-900">{options.recordId}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Generated Date</span>
                    <span className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">FAHIM GARMENTS LTD.</div>
                <div className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-2">Enterprise Quality Management System</div>
                <div className="text-[8px] text-slate-400 mt-1 leading-relaxed">
                  DEPZ, Savar, Dhaka, Bangladesh<br/>
                  compliance@fahimgarments.com
                </div>
              </div>
            </div>

            {/* Core Info Grid & Product Image */}
            <div className="flex gap-8 mb-12">
              {options.productImage && (
                <div className="w-48 h-48 rounded-2xl border-2 border-slate-100 p-2 bg-white flex-shrink-0 shadow-sm">
                  <img src={options.productImage} alt="Product" className="w-full h-full object-cover rounded-xl" />
                </div>
              )}
              {options.fields && options.fields.length > 0 && (
                <div className={`grid ${options.productImage ? 'grid-cols-2' : 'grid-cols-3'} gap-6 flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100`}>
                  {options.fields.map((f, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{f.label}</span>
                      <span className="text-sm font-bold text-slate-800">{f.value || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {options.sections && options.sections.map((section, si) => (
                <div key={si} className="break-inside-avoid">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-6 bg-slate-900 rounded-sm"></div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {section.fields.map((f, fi) => (
                      <div key={fi} className={`flex flex-col border-b border-slate-100 pb-4 ${f.fullWidth ? 'col-span-2' : ''}`}>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{f.label}</span>
                        <span className="text-sm font-semibold text-slate-800 leading-relaxed">{f.value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tables */}
            {options.tables && options.tables.map((table, ti) => (
              <div key={ti} className="mt-12 break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-slate-900 rounded-sm"></div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{table.title}</h3>
                </div>
                <div className="overflow-hidden border-2 border-slate-900 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        {table.columns.map((col, ci) => (
                          <th key={ci} className="p-4 text-[9px] font-black uppercase tracking-widest">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {table.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="p-4 text-xs font-bold text-slate-800">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Comments / Audit Trail */}
            {options.comments && options.comments.length > 0 && (
              <div className="mt-12 break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-slate-900 rounded-sm"></div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Audit Trail & Observations</h3>
                </div>
                <div className="space-y-4">
                  {options.comments.map((c, ci) => (
                    <div key={ci} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-slate-900 uppercase">{c.user}</span>
                          <span className="text-[9px] font-bold text-slate-400">{c.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Documentation */}
            {options.attachments && options.attachments.length > 0 && (
              <div className="mt-12 break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-6 bg-slate-900 rounded-sm"></div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Photographic Evidence</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {options.attachments.map((att, ai) => {
                    const src = typeof att === 'string' ? att : ('data' in att ? att.data : ('url' in att ? att.url : ''));
                    const name = typeof att === 'string' ? `Evidence Image ${ai+1}` : ('name' in att ? att.name : ('caption' in att ? att.caption : `Evidence Image ${ai+1}`));
                    return (
                      <div key={ai} className="flex flex-col border-2 border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="h-64 overflow-hidden flex items-center justify-center bg-slate-50 p-2">
                          {src ? (
                            <img src={src} alt={name} className="max-h-full object-contain rounded-lg" />
                          ) : (
                            <ImageIcon className="w-16 h-16 text-slate-200" />
                          )}
                        </div>
                        <div className="p-4 bg-slate-900 text-white text-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Push footer to bottom */}
            <div className="flex-1"></div>

            {/* Signatures */}
            <div className="mt-20 pt-10 border-t-2 border-slate-100 grid grid-cols-3 gap-12">
              {(options.signatureLabels || ['Originator', 'Quality Assurance', 'Management Approval']).map((label, i) => (
                <div key={i} className="text-center">
                  <div className="h-20 flex items-end justify-center mb-4 relative">
                    <div className="w-full border-b-2 border-slate-200"></div>
                    <div className="absolute top-0 opacity-10 text-[8px] font-black uppercase text-slate-400 italic">Signature / Digital Stamp Area</div>
                  </div>
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{label}</span>
                  <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">Date: ____/____/202__</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-6 border-t border-slate-100 flex justify-between items-center opacity-40 grayscale">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Page 1 of 1 • System ID: {options.recordId}
              </div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Generated by QMS ERP Pro Enterprise • {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
