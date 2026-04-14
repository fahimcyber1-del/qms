import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X, Plus, Trash2, AlertTriangle, Save, Download, FileText, Activity, User, Layers, FileDown, Camera, Image } from 'lucide-react';
import { getSamplingPlan } from '../utils/inspectionUtils';
import { AQLInspectionRecord } from '../types';
import { db } from '../db/db';


interface InspectionFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-bold text-text-2">{label} {required && <span className="text-red-500">*</span>}</label>
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

  // Recalculate auto Pass/Fail based on defects
  useEffect(() => {
    if (isReadOnly || !samplingPlan) return;
    const totalDefects = formData.majorDefect + formData.minorDefect;
    
    // Critical defect always fails AQL
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
    
    // Fallback local storage sync logic
    const stored = localStorage.getItem('garmentqms_inspections');
    let inspections = stored ? JSON.parse(stored) : [];

    if (mode === 'edit' && data) {
      inspections = inspections.map((i: any) => i.id === data.id ? payload : i);
    } else {
      inspections = [payload, ...inspections];
    }
    localStorage.setItem('garmentqms_inspections', JSON.stringify(inspections));
    
    // Dexie Push
    db.aqlInspections.clear().then(() => {
      // @ts-ignore
      db.aqlInspections.bulkAdd(inspections).catch(e => console.error("Dexie push failed", e));
    });

    onNavigate('inspection');
  };

  const exportPDF = async () => {
    const { createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel, proTable, embedAttachments, addPageFooters, drawSignatureRow, autoTable } = await import('../utils/pdfExport');
    const r   = formData;
    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });

    let y = drawPdfHeader(doc, 'AQL Inspection Report', `Record ID: ${r.id}`);

    // Info grid
    y = drawInfoGrid(doc, y, [
      { label: 'Buyer',             value: r.buyer       || '—' },
      { label: 'Style Number',      value: r.style       || '—' },
      { label: 'PO / Order No',     value: r.order       || '—' },
      { label: 'Production Line',   value: r.line        || '—' },
      { label: 'Inspector ID',      value: r.inspector   || '—' },
      { label: 'Inspection Type',   value: r.type        || '—' },
      { label: 'CRD Date',          value: r.crdDate     || '—' },
      { label: 'Inspection Date',   value: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '—' },
    ]);

    // AQL Configuration
    y = drawSectionLabel(doc, y, 'AQL Statistical Configuration');
    y = proTable(doc, y,
      [['Parameter', 'Value']],
      [
        ['Total Order Quantity',     String(r.orderQty)],
        ['Inspection Quantity',      String(r.inspectionQty)],
        ['AQL Level',                String(r.aqlLevel)],
        ['Inspection Level',         String(r.inspectionLevel)],
        ['Sample Size (Auto-Mapped)',String(r.sampleSize)],
        ['Acceptance Number (AC)',   samplingPlan ? String(samplingPlan.ac) : '—'],
        ['Rejection Number (RE)',    samplingPlan ? String(samplingPlan.re) : '—'],
      ],
      { columnStyles: { 0: { cellWidth: 80, fontStyle: 'bold' } } }
    ) + 6;

    // Defect Analysis
    y = drawSectionLabel(doc, y, 'Defect Analysis & Final Verdict');
    y = proTable(doc, y,
      [['Defect Category', 'Count', 'Status']],
      [
        ['Critical Defects', String(r.criticalDefect), r.criticalDefect > 0 ? 'FAILURE TRIGGER' : 'Clear'],
        ['Major Defects',    String(r.majorDefect),    '—'],
        ['Minor Defects',    String(r.minorDefect),    '—'],
        ['Pass Quantity',    String(r.passQty),        '—'],
        ['Fail Quantity',    String(r.failQty),        '—'],
        ['FINAL RESULT',     r.result,                r.result],
      ],
      {
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'center' },
          2: { halign: 'center', fontStyle: 'bold' },
        }
      }
    ) + 6;

    // Remarks
    if (r.remarks) {
      y = drawSectionLabel(doc, y, 'Auditor Remarks');
      autoTable(doc, {
        startY: y,
        body:   [[r.remarks]],
        theme:  'grid',
        margin: { left: 12, right: 12 },
        styles: { fontSize: 8.5, cellPadding: 4, textColor: [15, 23, 42] },
      });
      y = (doc as any).lastAutoTable?.finalY + 8;
    }

    // Signature row
    drawSignatureRow(doc, y, ['Prepared By', 'QC Inspector', 'QA Manager', 'Approved By']);

    // Attachments (photos)
    if (r.attachments && r.attachments.length > 0) {
      await embedAttachments(doc, r.attachments, 'INSPECTION EVIDENCE PHOTOS');
    }

    addPageFooters(doc);
    doc.save(`AQL_Report_${r.id}.pdf`);
  };



  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost px-2 bg-bg-2 border border-border-main" onClick={() => onNavigate('inspection')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? `New ${formData.type} AQL Inspection` : 
               mode === 'edit' ? `Edit Inspection Record` : `AQL Record Details`}
            </h2>
            <div className="text-text-2 text-sm mt-1">{formData.id} - Verified QC Data</div>
          </div>
        </div>
        {mode === 'view' ? (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost border border-border-main" onClick={() => onNavigate('inspection-form', { mode: 'edit', data: formData })}>
              <FileText className="w-4 h-4 mr-2" /> Edit Record
            </button>
            <button className="btn btn-primary shadow-md" onClick={exportPDF}>
              <FileDown className="w-4 h-4 mr-2" /> Download Report
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost px-6" onClick={() => onNavigate('inspection')}>Cancel</button>
            <button className="btn btn-primary px-8 shadow-md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> {mode === 'create' ? 'Save Record' : 'Update Record'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Job Context */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <User className="w-5 h-5 text-accent" /> 1. Client & Configuration
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Inspection Type">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.type} disabled={isReadOnly} onChange={e => handleChange('type', e.target.value)}>
                  <option value="Inline">Inline</option>
                  <option value="Endline">Endline</option>
                  <option value="Pre Final">Pre Final</option>
                  <option value="Final">Final</option>
                  <option value="AQL">AQL</option>
                </select>
              </Field>
              <Field label="Buyer" required>
                <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.buyer} readOnly={isReadOnly} onChange={e => handleChange('buyer', e.target.value)} />
              </Field>
              <Field label="Style Number" required>
                <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.style} readOnly={isReadOnly} onChange={e => handleChange('style', e.target.value)} />
              </Field>
              <Field label="PO / Order No">
                <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.order} readOnly={isReadOnly} onChange={e => handleChange('order', e.target.value)} />
              </Field>
              <Field label="Line No">
                <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.line} readOnly={isReadOnly} onChange={e => handleChange('line', e.target.value)} />
              </Field>
              <Field label="CRD Date">
                <input type="date" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.crdDate} readOnly={isReadOnly} onChange={e => handleChange('crdDate', e.target.value)} />
              </Field>
              <Field label="Inspector ID">
                <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.inspector} readOnly={isReadOnly} onChange={e => handleChange('inspector', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Layers className="w-5 h-5 text-purple-500" /> 2. Statistical Configuration (AQL)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Total Order Quantity">
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 font-mono" value={formData.orderQty} readOnly={isReadOnly} onChange={e => handleChange('orderQty', Number(e.target.value))} />
              </Field>
              <Field label="Inspection Quantity">
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 font-mono" value={formData.inspectionQty} readOnly={isReadOnly} onChange={e => handleChange('inspectionQty', Number(e.target.value))} />
              </Field>
              <Field label="AQL Logic Setting">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.aqlLevel} disabled={isReadOnly} onChange={e => handleChange('aqlLevel', e.target.value)}>
                  <option value="1.0">1.0</option>
                  <option value="1.5">1.5</option>
                  <option value="2.5">2.5</option>
                  <option value="4.0">4.0</option>
                  <option value="6.5">6.5</option>
                </select>
              </Field>
              <Field label="Sampling Size (Auto-Mapped)">
                <input type="number" className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl px-4 py-3 text-sm font-bold font-mono outline-none" value={formData.sampleSize} readOnly />
              </Field>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-border-main shadow-sm flex items-center bg-bg-2 gap-4">
              <div className="p-3 bg-amber-500/10 rounded-full text-amber-500"><AlertTriangle className="w-5 h-5" /></div>
              <div className="text-sm text-text-2 w-full flex justify-between">
                <div>Allowable Error Range Map:</div>
                <div className="font-bold flex gap-4">
                  <span>AC: <span className="text-green-500">{samplingPlan?.ac ?? 'N/A'}</span></span>
                  <span>RE: <span className="text-red-500">{samplingPlan?.re ?? 'N/A'}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Defect Scoring */}
        <div className="space-y-6">
          <div className={`bg-bg-1 p-6 md:p-8 rounded-2xl border ${formData.result === 'PASS' ? 'border-green-500/30' : formData.result === 'FAIL' ? 'border-red-500/30' : 'border-border-main'} shadow-sm transition-colors duration-300`}>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Activity className="w-5 h-5 text-blue-500" /> 3. Defect Analysis & Status
            </h4>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Critical Defects">
                  <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-6 text-center font-mono text-2xl focus:ring-2 focus:ring-purple-600 text-purple-600 font-black outline-none" value={formData.criticalDefect} readOnly={isReadOnly} onChange={e => handleChange('criticalDefect', Number(e.target.value))} />
                </Field>
                <Field label="Major Defects">
                  <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-6 text-center font-mono text-2xl focus:ring-2 focus:ring-red-500 text-red-500 font-bold outline-none" value={formData.majorDefect} readOnly={isReadOnly} onChange={e => handleChange('majorDefect', Number(e.target.value))} />
                </Field>
                <Field label="Minor Defects">
                  <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-6 text-center font-mono text-2xl focus:ring-2 focus:ring-amber-500 text-amber-500 font-bold outline-none" value={formData.minorDefect} readOnly={isReadOnly} onChange={e => handleChange('minorDefect', Number(e.target.value))} />
                </Field>
              </div>

              <div className="h-px bg-border-main my-2" />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Pass Quantity">
                  <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-lg focus:ring-2 focus:ring-green-500 text-green-500 outline-none" value={formData.passQty} readOnly={isReadOnly} onChange={e => handleChange('passQty', Number(e.target.value))} />
                </Field>
                <Field label="Fail Quantity">
                  <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-lg focus:ring-2 focus:ring-red-500 text-red-500 outline-none" value={formData.failQty} readOnly={isReadOnly} onChange={e => handleChange('failQty', Number(e.target.value))} />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Final computed outcome">
                  <select className={`w-full border-none rounded-xl px-4 py-6 text-center text-2xl font-black outline-none tracking-widest ${
                    formData.result === 'PASS' ? 'bg-green-500/10 text-green-600' :
                    formData.result === 'FAIL' ? 'bg-red-500/10 text-red-600' :
                    'bg-amber-500/10 text-amber-600'
                  }`} value={formData.result} disabled={isReadOnly} onChange={e => handleChange('result', e.target.value)}>
                    <option value="PASS">PASS AQL</option>
                    <option value="FAIL">FAIL AQL</option>
                    <option value="HOLD">QC HOLD</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <FileText className="w-5 h-5 text-accent" /> 4. Auditor Remarks & Evidence
              </h4>
              {!isReadOnly && (
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    id="inspection-file-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="inspection-file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <Camera className="w-4 h-4" /> Add Gallery Evidence
                  </label>
                </div>
              )}
            </div>

            <textarea 
              className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[120px] resize-y" 
              placeholder="Include corrective feedback, lot observations, general notes..."
              value={formData.remarks} 
              readOnly={isReadOnly}
              onChange={(e) => handleChange('remarks', e.target.value)} 
            />

            {/* Image Previews */}
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-6 mt-6 border-t border-border-main border-dashed">
                {formData.attachments.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="w-28 h-28 rounded-2xl border border-border-main overflow-hidden shadow-sm bg-bg-2 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                      <img 
                        src={img} 
                        alt={`Evidence ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onClick={() => window.open(img, '_blank')}
                      />
                    </div>
                    {!isReadOnly && (
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
