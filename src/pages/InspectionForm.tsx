import React, { useState, useEffect, memo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Check, X, Plus, Trash2, AlertTriangle, Save, Download, 
  FileText, Activity, User, Layers, FileDown, Camera, ImageIcon, 
  ShoppingBag, Tag, Calendar, LayoutGrid, CheckCircle2, ShieldCheck, Info
} from 'lucide-react';
import { getSamplingPlan } from '../utils/inspectionUtils';
import { AQLInspectionRecord } from '../types';
import { db } from '../db/db';
import { AttachmentList } from '../components/AttachmentList';
import { Search, ChevronDown, BookOpen, Tag as TagIcon, ShoppingBag as BagIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

/* ─────────────────────── Searchable Autocomplete ─────────────────────── */

interface AutocompleteOption {
  id: string;
  label: string;
  sublabel?: string;
  data: any;
}

interface AutocompleteProps {
  value: string;
  onChange: (val: string, data?: any) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  icon: any;
  disabled?: boolean;
}

function SearchableAutocomplete({ value, onChange, options, placeholder, icon: Icon, disabled }: AutocompleteProps) {
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

  const handleSelect = (opt: AutocompleteOption) => {
    onChange(opt.label, opt.data);
    setQuery(opt.label);
    setOpen(false);
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-10 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 w-4 h-4 text-accent pointer-events-none" />
        <input
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClass}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <ChevronDown className={`absolute right-3.5 w-4 h-4 text-text-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && !disabled && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-bg-1 border border-border-main rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden"
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

interface InspectionFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

// ── Sub-Components ────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, number, className = "" }: any) => (
  <div className={`bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6 ${className}`}>
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        {number && <span className="opacity-40 font-mono text-sm mr-1">{number}.</span>}
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, required, children, span2, icon: Icon }: any) => (
  <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
    <label className="text-xs font-bold text-text-2 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 opacity-50" />}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export function InspectionForm({ params, onNavigate }: InspectionFormProps) {
  const { mode, data } = params;
  const isReadOnly = mode === 'view';
  
  const [formData, setFormData] = useState<AQLInspectionRecord>(data || {
    id: `INS-${Date.now()}`,
    type: 'Inline', buyer: '', style: '', order: '', line: '', inspector: '',
    orderQty: 0, inspectionQty: 0, sampleSize: 0, passQty: 0, failQty: 0,
    criticalDefect: 0, majorDefect: 0, minorDefect: 0, result: 'PASS', remarks: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), 
    attachments: [], aqlLevel: '1.5', inspectionLevel: '1', crdDate: ''
  });

  const [orderSuggestions, setOrderSuggestions] = useState<any[]>([]);
  const [styleSuggestions, setStyleSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const orders = await db.table('orderSummary').toArray();
        setOrderSuggestions(orders);
        
        // Extract unique styles
        const styles = Array.from(new Set(orders.map(o => o.styleNo).filter(Boolean)));
        setStyleSuggestions(styles.map(s => ({ style: s, buyer: orders.find(o => o.styleNo === s)?.buyer })));
      } catch (err) {
        console.error("Failed to fetch order suggestions:", err);
      }
    };
    fetchSuggestions();
  }, []);

  const [samplingPlan, setSamplingPlan] = useState<{sampleSize: number, ac: number, re: number} | null>(null);

  useEffect(() => {
    if (formData.inspectionQty && formData.aqlLevel) {
      const plan = getSamplingPlan(formData.inspectionQty, formData.aqlLevel);
      setSamplingPlan(plan);
      if (!isReadOnly) {
        setFormData(prev => ({ ...prev, sampleSize: plan.sampleSize }));
      }
    }
  }, [formData.inspectionQty, formData.aqlLevel, isReadOnly]);

  useEffect(() => {
    if (isReadOnly || !samplingPlan) return;
    const totalDefects = formData.majorDefect + formData.minorDefect;
    
    if (formData.criticalDefect > 0 || totalDefects >= samplingPlan.re) {
      setFormData(prev => ({ ...prev, result: 'FAIL', failQty: totalDefects + formData.criticalDefect, passQty: formData.sampleSize - (totalDefects + formData.criticalDefect) }));
    } else {
      setFormData(prev => ({ ...prev, result: 'PASS', failQty: totalDefects + formData.criticalDefect, passQty: formData.sampleSize - (totalDefects + formData.criticalDefect) }));
    }
  }, [formData.criticalDefect, formData.majorDefect, formData.minorDefect, formData.sampleSize, samplingPlan, isReadOnly]);

  const handleChange = (field: keyof AQLInspectionRecord, value: any) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (!formData.buyer || !formData.style) {
      alert('Buyer and style are required fields.');
      return;
    }

    const payload = { ...formData, updatedAt: new Date().toISOString() };
    const stored = localStorage.getItem('garmentqms_inspections');
    let inspections = stored ? JSON.parse(stored) : [];

    if (mode === 'edit' && data) {
      inspections = inspections.map((i: any) => i.id === data.id ? payload : i);
    } else {
      inspections = [payload, ...inspections];
    }
    localStorage.setItem('garmentqms_inspections', JSON.stringify(inspections));
    
    db.aqlInspections.clear().then(() => {
      // @ts-ignore
      db.aqlInspections.bulkAdd(inspections).catch(e => console.error("Dexie push failed", e));
    });

    onNavigate('inspection');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    const r = formData;

    await exportDetailToPDF({
      moduleName: 'AQL Inspection Report',
      moduleId: `Record ID: ${r.id} \u2022 ${r.type}`,
      recordId: r.id || 'Unknown',
      fileName: `AQL_Audit_Report_${r.id}`,
      fields: [
        { label: 'Client / Buyer',    value: r.buyer || '\u2014' },
        { label: 'Style / Style No',  value: r.style || '\u2014' },
        { label: 'Purchase Order',    value: r.order || '\u2014' },
        { label: 'Production Line',   value: r.line || '\u2014' },
        { label: 'Inspector Name',    value: r.inspector || '\u2014' },
        { label: 'CRD Date',          value: r.crdDate || '\u2014' },
        { label: 'Audit Date',        value: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '\u2014' },
        { label: 'Report Status',     value: r.result, fullWidth: true },
        
        { label: 'Statistical Sampling Configuration', value: 'AQL', fullWidth: true },
        { label: 'Lot / Order Qty',   value: String(r.orderQty) },
        { label: 'Inspection Qty',    value: String(r.inspectionQty) },
        { label: 'AQL Level',         value: String(r.aqlLevel) },
        { label: 'Sampling Level',    value: String(r.inspectionLevel) },
        { label: 'Sample Size (N)',   value: String(r.sampleSize) },
        { label: 'Acceptance (AC)',   value: samplingPlan ? String(samplingPlan.ac) : '\u2014' },
        { label: 'Rejection (RE)',    value: samplingPlan ? String(samplingPlan.re) : '\u2014' },
      ],
      tables: [
        {
          title: 'Defect Classification & Statistical Outcome',
          columns: ['Defect Classification', 'Count / Frequency', 'Threshold Status'],
          rows: [
            ['Critical Defects (Class A)', String(r.criticalDefect), r.criticalDefect > 0 ? 'CRITICAL FAILURE' : 'Pass'],
            ['Major Defects (Class B)',    String(r.majorDefect),    'Monitoring Required'],
            ['Minor Defects (Class C)',    String(r.minorDefect),    'Monitoring Required'],
            ['Total Defected Samples',     String(r.failQty),        '—'],
            ['Acceptable Samples',         String(r.passQty),        '—'],
            ['INSPECTION VERDICT',         r.result,                 r.result],
          ]
        }
      ],
      summary: r.remarks ? ['Auditor Remarks:', r.remarks] : undefined,
      signatureLabels: ['QC Inspector', 'Prepared By', 'QA Manager', 'Plant Head'],
      attachments: r.attachments && r.attachments.length > 0 ? r.attachments : undefined
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg-0">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm" onClick={() => onNavigate('inspection')}>
            <ChevronLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? `Initiate ${formData.type} Inspection` : mode === 'edit' ? 'Update Inspection Data' : 'Inspection Intelligence'}
              <span className="text-[10px] font-black bg-accent text-white px-2.5 py-0.5 rounded-full ml-2">AQL {formData.aqlLevel}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.id}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className={`text-xs font-bold uppercase tracking-widest ${formData.result === 'PASS' ? 'text-green-500' : 'text-rose-500'}`}>{formData.result}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {isReadOnly ? (
             <>
               <button className="btn btn-ghost border border-border-main flex items-center gap-2" onClick={() => onNavigate('inspection-form', { mode: 'edit', data: formData })}>
                  <Trash2 className="w-4 h-4 rotate-45" /> Modify Record
               </button>
               <button className="btn btn-primary shadow-lg shadow-accent/20" onClick={exportPDF}>
                  <Download className="w-4 h-4 mr-2" /> Download Report
               </button>
             </>
          ) : (
            <>
              <button className="btn btn-ghost px-6" onClick={() => onNavigate('inspection')}>Cancel</button>
              <button className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20" onClick={handleSave}>
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {isReadOnly && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="bg-bg-1 p-8 rounded-2xl border border-border-main shadow-sm text-center">
                <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Sample Size</div>
                <div className="text-4xl font-black text-text-1">{formData.sampleSize}</div>
             </div>
             <div className="bg-bg-1 p-8 rounded-2xl border border-border-main shadow-sm text-center">
                <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Acceptable</div>
                <div className="text-4xl font-black text-green-500">{samplingPlan?.ac ?? '0'}</div>
             </div>
             <div className="bg-bg-1 p-8 rounded-2xl border border-border-main shadow-sm text-center">
                <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Critical Finding</div>
                <div className="text-4xl font-black text-rose-500">{formData.criticalDefect}</div>
             </div>
             <div className={`p-8 rounded-2xl border shadow-sm text-center ${formData.result === 'PASS' ? 'bg-green-500/10 border-green-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Inspection Status</div>
                <div className={`text-4xl font-black ${formData.result === 'PASS' ? 'text-green-600' : 'text-rose-600'}`}>{formData.result}</div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: Job Context */}
          <div className="xl:col-span-4 space-y-8">
            <Section title="Job Identification" icon={ShoppingBag} number="01">
              <Field label="Inspection Category" icon={Tag} span2>
                <select className={inputClass} value={formData.type} disabled={isReadOnly} onChange={e => handleChange('type', e.target.value)}>
                  <option value="Inline">Inline Inspection</option>
                  <option value="Endline">Endline Inspection</option>
                  <option value="Pre Final">Pre Final Inspection</option>
                  <option value="Final">Final Inspection</option>
                  <option value="AQL">AQL Audit</option>
                </select>
              </Field>
              <Field label="Buyer" icon={User} required>
                <SearchableAutocomplete 
                  value={formData.buyer}
                  disabled={isReadOnly}
                  icon={User}
                  placeholder="Type buyer name..."
                  options={Array.from(new Set(orderSuggestions.map(o => o.buyer))).map(b => ({ id: String(b), label: String(b), data: { buyer: b } }))}
                  onChange={(val) => handleChange('buyer', val)}
                />
              </Field>
              <Field label="Style Number" icon={Tag} required>
                <SearchableAutocomplete 
                  value={formData.style}
                  disabled={isReadOnly}
                  icon={TagIcon}
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
              <Field label="PO / Order No" icon={ShoppingBag}>
                <SearchableAutocomplete 
                  value={formData.order}
                  disabled={isReadOnly}
                  icon={BagIcon}
                  placeholder="Search PO/Order..."
                  options={orderSuggestions.map(o => ({ 
                    id: o.id, 
                    label: o.orderNo, 
                    sublabel: `${o.buyer} | ${o.styleNo}`,
                    data: o 
                  }))}
                  onChange={(val, data) => {
                    handleChange('order', val);
                    if (data) {
                      setFormData(prev => ({
                        ...prev,
                        order: val,
                        buyer: data.buyer || prev.buyer,
                        style: data.styleNo || prev.style,
                        orderQty: data.qty || prev.orderQty,
                        inspectionQty: data.qty || prev.inspectionQty,
                        crdDate: data.shipDate || prev.crdDate
                      }));
                    }
                  }}
                />
              </Field>
              <Field label="Production Line" icon={Activity}>
                <input className={inputClass} value={formData.line} readOnly={isReadOnly} onChange={e => handleChange('line', e.target.value)} />
              </Field>
              <Field label="CRD Date" icon={Calendar}>
                <input type="date" className={inputClass} value={formData.crdDate} readOnly={isReadOnly} onChange={e => handleChange('crdDate', e.target.value)} />
              </Field>
              <Field label="Inspector" icon={User}>
                <input className={inputClass} value={formData.inspector} readOnly={isReadOnly} onChange={e => handleChange('inspector', e.target.value)} />
              </Field>
            </Section>

            <Section title="Statistical Mapping" icon={Layers} number="02">
              <Field label="Lot / Order Qty" icon={ShoppingBag} span2>
                <input type="number" className={inputClass} value={formData.orderQty} readOnly={isReadOnly} onChange={e => handleChange('orderQty', Number(e.target.value))} />
              </Field>
              <Field label="Inspection Qty" icon={Activity}>
                <input type="number" className={inputClass} value={formData.inspectionQty} readOnly={isReadOnly} onChange={e => handleChange('inspectionQty', Number(e.target.value))} />
              </Field>
              <Field label="AQL Level" icon={ShieldCheck}>
                <select className={inputClass} value={formData.aqlLevel} disabled={isReadOnly} onChange={e => handleChange('aqlLevel', e.target.value)}>
                  <option value="1.0">1.0</option>
                  <option value="1.5">1.5</option>
                  <option value="2.5">2.5</option>
                  <option value="4.0">4.0</option>
                </select>
              </Field>
              <Field label="Sample Size (N)" icon={Activity} span2>
                <input type="number" className={`${inputClass} bg-accent/5 border-accent/20 text-accent font-black`} value={formData.sampleSize} readOnly />
              </Field>
              
              <div className="col-span-full p-4 rounded-xl border border-border-main bg-bg-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><AlertTriangle className="w-4 h-4" /></div>
                   <span className="text-xs font-bold text-text-2 uppercase">AQL Acceptance Threshold</span>
                </div>
                <div className="flex gap-4 font-mono font-bold text-sm">
                   <span className="text-green-500">AC: {samplingPlan?.ac ?? '0'}</span>
                   <span className="text-rose-500">RE: {samplingPlan?.re ?? '0'}</span>
                </div>
              </div>
            </Section>
          </div>

          {/* Right: Analysis */}
          <div className="xl:col-span-8 space-y-8">
            <Section title="Defect Analysis & Outcome" icon={Activity} number="03">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-full">
                <Field label="Critical (Class A)" icon={AlertTriangle}>
                  <input type="number" className={`${inputClass} text-center text-2xl py-6 text-rose-600 font-black`} value={formData.criticalDefect} readOnly={isReadOnly} onChange={e => handleChange('criticalDefect', Number(e.target.value))} />
                </Field>
                <Field label="Major (Class B)" icon={AlertTriangle}>
                  <input type="number" className={`${inputClass} text-center text-2xl py-6 text-orange-500 font-black`} value={formData.majorDefect} readOnly={isReadOnly} onChange={e => handleChange('majorDefect', Number(e.target.value))} />
                </Field>
                <Field label="Minor (Class C)" icon={AlertTriangle}>
                  <input type="number" className={`${inputClass} text-center text-2xl py-6 text-amber-500 font-black`} value={formData.minorDefect} readOnly={isReadOnly} onChange={e => handleChange('minorDefect', Number(e.target.value))} />
                </Field>
              </div>

              <div className="col-span-full h-px bg-border-main" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-full">
                 <Field label="Pass Quantity" icon={CheckCircle2}>
                    <input type="number" className={`${inputClass} text-center text-xl text-green-500`} value={formData.passQty} readOnly={isReadOnly} onChange={e => handleChange('passQty', Number(e.target.value))} />
                 </Field>
                 <Field label="Fail Quantity" icon={X}>
                    <input type="number" className={`${inputClass} text-center text-xl text-rose-500`} value={formData.failQty} readOnly={isReadOnly} onChange={e => handleChange('failQty', Number(e.target.value))} />
                 </Field>
              </div>

              <div className="col-span-full">
                <Field label="Computed Inspection Result" icon={ShieldCheck}>
                   <div className={`w-full p-6 rounded-2xl text-center text-3xl font-black tracking-[0.2em] uppercase transition-all shadow-inner border-2 ${
                     formData.result === 'PASS' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                     formData.result === 'FAIL' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                     'bg-amber-500/10 text-amber-600 border-amber-500/20'
                   }`}>
                     {formData.result}
                   </div>
                </Field>
              </div>
            </Section>

            <Section title="Remarks & Evidence" icon={FileText} number="04">
              <Field label="Auditor Remarks" icon={Info} span2>
                <textarea 
                  className={`${inputClass} min-h-[120px] resize-none`} 
                  placeholder="Include corrective feedback, lot observations, general notes..."
                  value={formData.remarks} 
                  readOnly={isReadOnly}
                  onChange={(e) => handleChange('remarks', e.target.value)} 
                />
              </Field>

              <div className="col-span-full space-y-4 pt-4 border-t border-border-main">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-text-3 uppercase tracking-widest">Evidence Gallery</h4>
                  {!isReadOnly && (
                    <div className="flex gap-2">
                      <input 
                        type="file" id="inspection-file-upload" className="hidden" accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label 
                        htmlFor="inspection-file-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20"
                      >
                        <Camera className="w-4 h-4" /> Add Evidence
                      </label>
                    </div>
                  )}
                </div>

                {formData.attachments && formData.attachments.length > 0 ? (
                   <AttachmentList 
                     attachments={formData.attachments}
                     onRemove={!isReadOnly ? (idx: number) => removeImage(idx) : undefined}
                   />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                    <ImageIcon className="w-12 h-12 mb-3" />
                    <p className="text-sm font-bold uppercase tracking-widest">No evidence captured</p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
