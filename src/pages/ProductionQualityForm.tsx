import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Save, Activity, Calendar, User, AlertTriangle, Layers, X, Edit2, Trash2, Download, Search, BookOpen, Tag, ChevronDown } from 'lucide-react';
import { InspectionRecord, InspectionDefect } from '../types';
import { getProductionQualityRecords, saveProductionQualityRecords } from '../utils/qualityUtils';
import { openExportPreview } from '../utils/exportUtils';
import { db } from '../db/db';

/* ─────────────────────── DefectAutocomplete component ─────────────────────── */

interface DefectOption {
  id?: string;
  code?: string;
  name: string;
  category?: string;
  severity?: string;
}

interface DefectAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  defectLibrary: DefectOption[];
  placeholder?: string;
  readOnly?: boolean;
  rowIndex: number;
}

function DefectAutocomplete({ value, onChange, defectLibrary, placeholder, readOnly, rowIndex }: DefectAutocompleteProps) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState(value);
  const [activeIdx, setActive] = useState(-1);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  // keep query in sync when parent value changes (e.g. fill-demo or CSV load)
  useEffect(() => { setQuery(value); }, [value]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useCallback(() => {
    if (!query.trim()) return defectLibrary.slice(0, 30);
    const q = query.toLowerCase();
    return defectLibrary
      .filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.code || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [query, defectLibrary]);

  const suggestions = filtered();

  // group by category
  const grouped = suggestions.reduce<Record<string, DefectOption[]>>((acc, d) => {
    const cat = d.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});

  // flat list for keyboard navigation
  const flatList = suggestions;

  const selectItem = (item: DefectOption) => {
    onChange(item.name);
    setQuery(item.name);
    setOpen(false);
    setActive(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'ArrowDown') setOpen(true); return; }
    if (e.key === 'ArrowDown')  { setActive(i => Math.min(i + 1, flatList.length - 1)); e.preventDefault(); }
    if (e.key === 'ArrowUp')    { setActive(i => Math.max(i - 1, -1)); e.preventDefault(); }
    if (e.key === 'Enter' && activeIdx >= 0) { selectItem(flatList[activeIdx]); e.preventDefault(); }
    if (e.key === 'Escape')     { setOpen(false); setActive(-1); }
  };

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: 'rgba(99,102,241,0.18)', color: 'inherit', borderRadius: 3, padding: '0 2px' }}>
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const severityColor = (s?: string) => {
    if (!s) return { bg: '#f1f5f9', text: '#64748b' };
    const sv = s.toLowerCase();
    if (sv === 'critical') return { bg: '#fee2e2', text: '#dc2626' };
    if (sv === 'major')    return { bg: '#fef3c7', text: '#d97706' };
    if (sv === 'minor')    return { bg: '#dcfce7', text: '#16a34a' };
    return { bg: '#ede9fe', text: '#7c3aed' };
  };

  if (readOnly) {
    return (
      <div style={{ padding: '10px 16px', fontSize: 14, fontWeight: 600, color: 'inherit', opacity: 0.85 }}>
        {value || '—'}
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input row */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search style={{ position: 'absolute', left: 12, width: 15, height: 15, color: '#6366f1', pointerEvents: 'none', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder || 'Type to search defect library…'}
          className="w-full bg-bg-2 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none text-text-1"
          style={{ paddingLeft: 36, paddingRight: 36, paddingTop: 11, paddingBottom: 11 }}
          onChange={e => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
          style={{
            position: 'absolute', right: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0,
          }}
        >
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown style={{ width: 14, height: 14 }} />
          </motion.div>
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            ref={listRef}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              zIndex: 9999,
              background: 'var(--bg-1, #fff)',
              border: '1.5px solid rgba(99,102,241,0.18)',
              borderRadius: 14,
              boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
              maxHeight: 320,
              overflowY: 'auto',
              transformOrigin: 'top',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '8px 14px 6px',
              borderBottom: '1px solid rgba(99,102,241,0.1)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <BookOpen style={{ width: 12, height: 12, color: '#6366f1' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Defect Library
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                padding: '1px 7px', borderRadius: 10,
              }}>
                {suggestions.length} match{suggestions.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {suggestions.length === 0 ? (
              <div style={{ padding: '20px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                No defects found for &ldquo;<strong>{query}</strong>&rdquo;
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]: [string, DefectOption[]]) => {
                let globalIdx = flatList.indexOf(items[0]);
                return (
                  <div key={category}>
                    {/* Category header */}
                    <div style={{
                      padding: '6px 14px 4px',
                      fontSize: 9.5, fontWeight: 800,
                      color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em',
                      background: 'rgba(99,102,241,0.03)',
                      borderTop: '1px solid rgba(99,102,241,0.07)',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      <Tag style={{ width: 9, height: 9 }} />
                      {category}
                    </div>
                    {items.map((item, ii) => {
                      const gi = flatList.indexOf(item);
                      const isActive = gi === activeIdx;
                      const sev = severityColor(item.severity);
                      return (
                        <div
                          key={item.id || item.name + ii}
                          onMouseDown={() => selectItem(item)}
                          onMouseEnter={() => setActive(gi)}
                          style={{
                            padding: '9px 14px',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(99,102,241,0.09)' : 'transparent',
                            borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                            display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'background 0.12s',
                          }}
                        >
                          {/* Code badge */}
                          {item.code && (
                            <span style={{
                              fontSize: 9.5, fontWeight: 800, fontFamily: 'monospace',
                              background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                              padding: '2px 6px', borderRadius: 5, flexShrink: 0,
                              minWidth: 36, textAlign: 'center',
                            }}>
                              {item.code}
                            </span>
                          )}
                          {/* Name */}
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-1, #1e1b4b)' }}>
                            {highlight(item.name)}
                          </span>
                          {/* Severity badge */}
                          {item.severity && (
                            <span style={{
                              fontSize: 9, fontWeight: 800,
                              background: sev.bg, color: sev.text,
                              padding: '2px 7px', borderRadius: 10,
                              flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em',
                            }}>
                              {item.severity}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ─────────────────────── Generic Autocomplete ─────────────────────── */

interface GenericOption {
  id: string;
  label: string;
  sublabel?: string;
  data: any;
}

interface GenericAutocompleteProps {
  value: string;
  onChange: (val: string, data?: any) => void;
  options: GenericOption[];
  placeholder?: string;
  icon: any;
  readOnly?: boolean;
}

function GenericAutocomplete({ value, onChange, options, placeholder, icon: Icon, readOnly }: GenericAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.trim() === '' 
    ? options.slice(0, 10)
    : options.filter(opt => 
        opt.label.toLowerCase().includes(query.toLowerCase()) || 
        opt.sublabel?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

  const handleSelect = (opt: GenericOption) => {
    onChange(opt.label, opt.data);
    setQuery(opt.label);
    setOpen(false);
  };

  const inputClass = "w-full bg-bg-2 border-none rounded-xl px-10 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  if (readOnly) return <div className="px-4 py-3 text-sm font-bold text-text-1 opacity-70">{value || '—'}</div>;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 w-4 h-4 text-accent pointer-events-none z-10" />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          className={inputClass}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <ChevronDown className={`absolute right-3.5 w-4 h-4 text-text-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] top-full left-0 right-0 mt-2 bg-bg-1 border border-border-main rounded-xl shadow-2xl max-h-60 overflow-y-auto"
          >
            {filtered.map(opt => (
              <button
                key={opt.id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-bg-2 flex flex-col gap-0.5 border-b border-border-main last:border-0"
                onClick={() => handleSelect(opt)}
              >
                <span className="text-sm font-bold text-text-1 truncate">{opt.label}</span>
                {opt.sublabel && <span className="text-[10px] text-text-3 uppercase font-black truncate">{opt.sublabel}</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

interface ProductionQualityFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
    recordType?: 'detailed' | 'quick';
  };
  onNavigate: (page: string, params?: any) => void;
}

const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-bold text-text-2">{label} {required && <span className="text-red-500">*</span>}</label>
    {children}
  </div>
);

export function ProductionQualityForm({ params, onNavigate }: ProductionQualityFormProps) {
  const { mode, data, recordType = 'detailed' } = params;
  const isReadOnly = mode === 'view';
  
  const [units, setUnits] = React.useState<string[]>([]);
  const [sections, setSections] = React.useState<string[]>([]);
  const [lines, setLines] = React.useState<string[]>([]);
  const [defectOptions, setDefectOptions] = React.useState<any[]>([]);
  const [orderSuggestions, setOrderSuggestions] = React.useState<any[]>([]);
  const [styleSuggestions, setStyleSuggestions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await db.table('orderSummary').toArray();
        setOrderSuggestions(orders);
        const styles = Array.from(new Set(orders.map(o => o.styleNo).filter(Boolean)));
        setStyleSuggestions(styles.map(s => ({ style: s, buyer: orders.find(o => o.styleNo === s)?.buyer })));
      } catch (err) {
        console.error("Failed to fetch order suggestions:", err);
      }
    };
    fetchOrders();
  }, []);

  React.useEffect(() => {
    const u = localStorage.getItem('garmentqms_config_units');
    const s = localStorage.getItem('garmentqms_config_sections');
    const l = localStorage.getItem('garmentqms_config_lines');
    const d = localStorage.getItem('garmentqms_defects');
    
    const loadedUnits = u ? JSON.parse(u) : ['Unit-1', 'Unit-2', 'Unit-3', 'Unit-4', 'Unit-5'];
    const loadedSections = s ? JSON.parse(s) : ['Sewing', 'Finishing', 'Cutting', 'Packing'];
    const loadedLines = l ? JSON.parse(l) : ['Line-1', 'Line-2', 'Line-3', 'Line-4', 'Line-5', 'Line-6', 'Line-7', 'Line-8', 'Line-9', 'Line-10'];

    setUnits(loadedUnits);
    setSections(loadedSections);
    setLines(loadedLines);
    if (d) setDefectOptions(JSON.parse(d));

    // If creating, initialize defaults from loaded config
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        unit: loadedUnits[0] || '',
        section: loadedSections[0] || '',
        lineNumber: loadedLines[0] || ''
      }));
    }
  }, [mode]);


  const [formData, setFormData] = useState<Partial<InspectionRecord>>(() => {
    if (data) return data;
    
    // Fetch KPI Targets
    let dhuTarget = 5;
    let rftTarget = 95;
    try {
      const kpis = JSON.parse(localStorage.getItem('garmentqms_kpis') || '[]');
      const dhuKpi = kpis.find((k: any) => k.kpiName === 'DHU');
      const rftKpi = kpis.find((k: any) => k.kpiName === 'RFT');
      if (dhuKpi) dhuTarget = dhuKpi.targetValue;
      if (rftKpi) rftTarget = rftKpi.targetValue;
    } catch(e) {}

    return {
      id: `PQ-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      factory: 'Main Factory', unit: '', section: '', floor: '',
      lineNumber: '', style: '', orderNumber: '', buyer: '',
      operatorId: '', qcInspector: '', dayTarget: 0, checkedQuantity: 0,
      goodsQuantity: 0, totalDefects: 0, standardRft: rftTarget, standardDhu: dhuTarget,
      standardPercentageDefective: 3, shift: 'Day', machineNumber: '', remark: '',
      source: recordType, topDefects: [{ name: '', count: 0 }, { name: '', count: 0 }, { name: '', count: 0 }],
      uid: 'user'
    };
  });

  // ── Auto Calculations ──────────────────────────────────────────────────────
  React.useEffect(() => {
    const totalDefects = (formData.topDefects || []).reduce((sum, d) => sum + (Number(d.count) || 0), 0);
    const checkedQty = Number(formData.checkedQuantity) || 0;
    const goodsQty = Math.max(0, checkedQty - totalDefects);
    
    if (formData.totalDefects !== totalDefects || formData.goodsQuantity !== goodsQty) {
      setFormData(prev => ({
        ...prev,
        totalDefects,
        goodsQuantity: goodsQty
      }));
    }
  }, [formData.topDefects, formData.checkedQuantity]);

  const handleChange = (field: keyof InspectionRecord, value: any) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parse: Name, Count
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const newDefects = [...(formData.topDefects || [])];
        
        let added = 0;
        lines.forEach((line, i) => {
          if (i === 0 && line.toLowerCase().includes('name')) return; // skip header
          const parts = line.split(',');
          if (parts.length >= 2) {
            newDefects.push({
              name: parts[0].trim(),
              count: parseInt(parts[1].trim()) || 0
            });
            added++;
          }
        });
        
        if (added > 0) {
          setFormData({ ...formData, topDefects: newDefects });
        }
      } catch (err) {
        console.error('Failed to parse defects CSV', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    // Clean up top defects
    const cleanedData = {
      ...formData,
      topDefects: (formData.topDefects || []).filter((d: any) => d.name && d.name.trim() !== '')
    } as InspectionRecord;

    const records = getProductionQualityRecords();
    let updatedRecords;
    if (mode === 'edit' && data) {
      updatedRecords = records.map((r: any) => r.id === data.id ? cleanedData : r);
    } else {
      updatedRecords = [cleanedData, ...records];
    }

    saveProductionQualityRecords(updatedRecords);
    onNavigate('prod-quality');
  };

  const calculateRFT = () => {
    if ((formData.checkedQuantity || 0) === 0) return '0.0';
    return (((formData.goodsQuantity || 0) / (formData.checkedQuantity || 1)) * 100).toFixed(1);
  };

  const calculateDHU = () => {
    if ((formData.checkedQuantity || 0) === 0) return '0.0';
    return (((formData.totalDefects || 0) / (formData.checkedQuantity || 1)) * 100).toFixed(1);
  };

  const handleExport = () => {
    openExportPreview({
      moduleName: 'Production Quality Report',
      moduleId: 'production_quality',
      recordId: formData.id || 'N/A',
      fileName: `Production_Quality_${formData.id || 'export'}`,
      fields: [
        { label: 'Date', value: formData.date || 'N/A' },
        { label: 'Shift', value: formData.shift || 'N/A' },
        { label: 'Unit', value: formData.unit || 'N/A' },
        { label: 'Section', value: formData.section || 'N/A' },
        { label: 'Line Number', value: formData.lineNumber || 'N/A' },
        { label: 'Buyer', value: formData.buyer || 'N/A' },
        { label: 'Style', value: formData.style || 'N/A' },
        { label: 'Order No.', value: formData.orderNumber || 'N/A' },
        { label: 'QC Inspector', value: formData.qcInspector || 'N/A' },
      ],
      sections: [
        {
          title: 'Inspection Results',
          fields: [
            { label: 'Checked Qty', value: String(formData.checkedQuantity || 0) },
            { label: 'Goods Qty (Passed)', value: String(formData.goodsQuantity || 0) },
            { label: 'Total Defects', value: String(formData.totalDefects || 0) },
            { label: 'Right First Time (RFT)', value: `${calculateRFT()}%` },
            { label: 'Defect per Hundred Units (DHU)', value: `${calculateDHU()}%` },
          ]
        }
      ],
      tables: formData.topDefects && formData.topDefects.length > 0 ? [{
        title: 'Detected Defects Breakdown',
        columns: ['Defect Name / Description', 'Occurrences'],
        rows: formData.topDefects.map((d: any) => [d.name || 'Unknown', String(d.count || 0)])
      }] : undefined
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost px-2 bg-bg-2 border border-border-main" onClick={() => onNavigate('prod-quality')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-text-1">
            {mode === 'create' ? `New Quality Inspection Record` : 
             mode === 'edit' ? `Edit Quality Record` : `Quality Record Details`}
          </h2>
        </div>
        {mode === 'view' ? (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost border border-border-main" onClick={() => onNavigate('prod-quality-form', { mode: 'edit', data: formData })}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Record
            </button>
            <button className="btn btn-ghost border border-border-main flex items-center gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost px-6" onClick={() => onNavigate('prod-quality')}>Cancel</button>
            <button className="btn btn-primary px-8 shadow-md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> {mode === 'create' ? 'Save Record' : 'Update Record'}
            </button>
          </div>
        )}
      </div>

      {mode === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-1 border border-border-main p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-3 bg-blue-500/10 rounded-full mb-3"><Layers className="w-6 h-6 text-blue-500" /></div>
            <div className="text-sm font-medium text-text-2 mb-1">Checked Qty</div>
            <div className="text-4xl font-mono font-bold text-text-1">{formData.checkedQuantity}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">Right First Time (RFT)</div>
            <div className="text-4xl font-mono font-bold text-green-600 dark:text-green-400">{calculateRFT()}%</div>
            <div className="text-sm mt-2 text-green-700/70 font-medium">Passed: {formData.goodsQuantity}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">Defect per Hundred Units (DHU)</div>
            <div className="text-4xl font-mono font-bold text-red-600 dark:text-red-400">{calculateDHU()}%</div>
            <div className="text-sm mt-2 text-red-700/70 font-medium">Defects: {formData.totalDefects}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic Info Column */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Calendar className="w-5 h-5 text-accent" /> 1. Date & Location
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date" required>
                <input type="date" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.date} disabled={isReadOnly} onChange={e => handleChange('date', e.target.value)} />
              </Field>
              <Field label="Shift">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.shift} disabled={isReadOnly} onChange={e => handleChange('shift', e.target.value)}>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </Field>
              <Field label="Unit">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.unit} disabled={isReadOnly} onChange={e => handleChange('unit', e.target.value)}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Section">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.section} disabled={isReadOnly} onChange={e => handleChange('section', e.target.value)}>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Line Number" required>
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.lineNumber} disabled={isReadOnly} onChange={e => handleChange('lineNumber', e.target.value)}>
                  {lines.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <User className="w-5 h-5 text-purple-500" /> 2. Style & Personnel
            </h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Buyer">
                  <GenericAutocomplete 
                    value={formData.buyer || ''}
                    readOnly={isReadOnly}
                    icon={User}
                    placeholder="Search buyer..."
                    options={Array.from(new Set(orderSuggestions.map(o => o.buyer))).map(b => ({ id: String(b), label: String(b), data: { buyer: b } }))}
                    onChange={(val) => handleChange('buyer', val)}
                  />
                </Field>
                <Field label="Style">
                  <GenericAutocomplete 
                    value={formData.style || ''}
                    readOnly={isReadOnly}
                    icon={Layers}
                    placeholder="Search styles..."
                    options={styleSuggestions.map((s, idx) => ({ 
                      id: `style-${idx}`, 
                      label: s.style, 
                      sublabel: s.buyer,
                      data: s 
                    }))}
                    onChange={(val, data) => {
                      handleChange('style', val);
                      if (data?.buyer && !formData.buyer) {
                        handleChange('buyer', data.buyer);
                      }
                    }}
                  />
                </Field>
                <Field label="Order No.">
                   <GenericAutocomplete 
                    value={formData.orderNumber || ''}
                    readOnly={isReadOnly}
                    icon={Tag}
                    placeholder="Search PO/Order..."
                    options={orderSuggestions.map(o => ({ 
                      id: String(o.id), 
                      label: String(o.orderNo), 
                      sublabel: `${o.buyer} | ${o.styleNo}`,
                      data: o 
                    }))}
                    onChange={(val, data) => {
                      handleChange('orderNumber', val);
                      if (data) {
                        setFormData(prev => ({
                          ...prev,
                          orderNumber: val,
                          buyer: data.buyer || prev.buyer,
                          style: data.styleNo || prev.style,
                          checkedQuantity: data.qty || prev.checkedQuantity
                        }));
                      }
                    }}
                  />
                </Field>
                <Field label="QC Inspector">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.qcInspector} readOnly={isReadOnly} onChange={e => handleChange('qcInspector', e.target.value)} />
                </Field>
              </div>
            </div>
          </div>

        {/* Results Info Column */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Activity className="w-5 h-5 text-blue-500" /> 3. Inspection Results
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Checked Qty" required>
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-xl focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.checkedQuantity} readOnly={isReadOnly} onChange={e => handleChange('checkedQuantity', Number(e.target.value))} />
              </Field>
              <Field label="Goods Qty">
                <input type="number" className="w-full bg-bg-2/50 border-none rounded-xl px-4 py-4 text-center font-mono text-xl text-green-600 outline-none cursor-not-allowed" value={formData.goodsQuantity} readOnly placeholder="0" />
              </Field>
              <Field label="Total Defects">
                <input type="number" className="w-full bg-bg-2/50 border-none rounded-xl px-4 py-4 text-center font-mono text-xl text-red-600 outline-none cursor-not-allowed" value={formData.totalDefects} readOnly placeholder="0" />
              </Field>
            </div>
            
            {!isReadOnly && (
              <div className="mt-6 p-5 bg-bg-2/50 rounded-xl border border-border-main flex divide-x divide-border-main text-center">
                <div className="flex-1 px-4">
                  <span className="text-xs font-bold text-text-3 uppercase tracking-wider block mb-1">RFT Forecast</span>
                  <span className="font-bold text-xl text-green-500">{calculateRFT()}%</span>
                </div>
                <div className="flex-1 px-4">
                  <span className="text-xs font-bold text-text-3 uppercase tracking-wider block mb-1">DHU Forecast</span>
                  <span className="font-bold text-xl text-red-500">{calculateDHU()}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border-main pb-3">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> 4. Detected Defects
                {defectOptions.length > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 800,
                    background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                    padding: '2px 8px', borderRadius: 10, marginLeft: 4,
                  }}>
                    📚 {defectOptions.length} in library
                  </span>
                )}
              </h4>
              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <label className="btn btn-ghost border border-border-main cursor-pointer px-3 py-1.5 text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> Upload CSV
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button type="button" onClick={() => setFormData({ ...formData, topDefects: [...(formData.topDefects || []), { name: '', count: 0 }] })} className="btn btn-primary px-3 py-1.5 text-sm flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Defect
                  </button>
                </div>
              )}
            </div>

            {/* Info banner when library is empty */}
            {defectOptions.length === 0 && !isReadOnly && (
              <div style={{
                marginBottom: 12, padding: '10px 14px',
                background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.2)',
                borderRadius: 10, fontSize: 12, color: '#92400e', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <BookOpen style={{ width: 14, height: 14, flexShrink: 0 }} />
                No defects in library yet. Go to <strong>Settings → Defect Library</strong> to add them, or type freely below.
              </div>
            )}

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {(formData.topDefects || []).map((defect, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="flex gap-3 items-center group"
                >
                  {/* Row number */}
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                  }}>{idx + 1}</div>

                  {/* Smart autocomplete */}
                  <div className="flex-1">
                    <DefectAutocomplete
                      rowIndex={idx}
                      value={defect.name}
                      defectLibrary={defectOptions}
                      readOnly={isReadOnly}
                      placeholder={defectOptions.length > 0 ? `Type to search ${defectOptions.length} defects…` : 'Type defect name…'}
                      onChange={(val) => {
                        if (isReadOnly) return;
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects[idx] = { ...newDefects[idx], name: val } as InspectionDefect;
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none text-red-500 text-center"
                      value={defect.count === 0 && !defect.name ? '' : defect.count || ''}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        if (isReadOnly) return;
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects[idx] = { ...newDefects[idx], count: Number(e.target.value) } as InspectionDefect;
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                    />
                  </div>
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects.splice(idx, 1);
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                      style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ef4444', transition: 'background 0.15s',
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                    >
                      <X style={{ width: 15, height: 15 }} />
                    </button>
                  )}
                </motion.div>
              ))}
              {(!formData.topDefects || formData.topDefects.length === 0) && (
                <div className="text-center p-4 text-text-3 text-sm border border-dashed border-border-main rounded-xl">
                  No defects logged. Add a defect or upload a CSV.
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <Field label="5. Remarks / Notes">
              <textarea 
                className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[100px] resize-y" 
                placeholder="Include corrective actions taken, operator notes, etc..."
                value={formData.remark} 
                readOnly={isReadOnly}
                onChange={(e) => handleChange('remark', e.target.value)} 
              />
            </Field>
          </div>

        </div>
      </div>
    </motion.div>
  );
}



