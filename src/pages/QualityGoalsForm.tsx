import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Target, Building, User, Calendar, 
  BarChart3, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText,
  TrendingUp, Flag, Activity, Download, LayoutGrid
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Management'
];

// ── Sub-Components ────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, number }: any) => (
  <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        <span className="opacity-40 font-mono text-sm mr-1">{number}.</span>
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

export function QualityGoalsForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState({
    id: initialData.id || `GOAL-${Date.now()}`,
    goalTitle: initialData.goalTitle || '',
    category: initialData.category || 'Product Quality',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    targetValue: initialData.targetValue || 0,
    actualValue: initialData.actualValue || 0,
    uom: initialData.uom || '%',
    startDate: initialData.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData.endDate || '',
    status: initialData.status || 'In Progress',
    description: initialData.description || '',
    attachments: initialData.attachments || []
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('qualityGoals').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('qualityGoals').put(formData);
      }
      onNavigate('goals');
    } catch (error) {
      console.error('Error saving quality goal:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Quality Objective Specification',
      moduleId: 'quality-goals',
      recordId: formData.id,
      fileName: `Goal_${formData.id}`,
      fields: [
        { label: 'Goal Title',    value: formData.goalTitle },
        { label: 'Category',      value: formData.category },
        { label: 'Department',    value: formData.department },
        { label: 'Target',        value: `${formData.targetValue} ${formData.uom}` },
        { label: 'Actual',        value: `${formData.actualValue} ${formData.uom}` },
        { label: 'Status',        value: formData.status },
        { label: 'End Date',      value: formData.endDate },
        { label: 'Responsible',   value: formData.responsiblePerson },
      ],
      summary: formData.description ? ['Action Plan:', formData.description] : undefined
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('goals')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Define New Quality Goal' : mode === 'edit' ? 'Update Quality Goal' : 'Goal Specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('quality-goals-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Goal
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Report
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('goals')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-4 bg-accent/10 rounded-2xl mb-4"><Target className="w-8 h-8 text-accent" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Target Metric</div>
            <div className="text-4xl font-black text-text-1">{formData.targetValue}{formData.uom}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className={`p-4 rounded-2xl mb-4 ${Number(formData.actualValue) >= Number(formData.targetValue) ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
              <Activity className="w-8 h-8" />
            </div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Current Performance</div>
            <div className="text-4xl font-black text-text-1">{formData.actualValue}{formData.uom}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Achieved' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <Flag className={`w-8 h-8 ${formData.status === 'Achieved' ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Goal Status</div>
            <div className={`text-2xl font-black uppercase ${formData.status === 'Achieved' ? 'text-green-600' : 'text-amber-600'}`}>
              {formData.status}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Goal Identification" icon={Target} number="01">
            <Field label="Goal Title" icon={Flag} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.goalTitle} 
                onChange={e => setFormData(p => ({ ...p, goalTitle: e.target.value }))}
                placeholder="e.g., Reduce DHU by 15% in Sewing Line A"
              />
            </Field>
            <Field label="Category" icon={LayoutGrid} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.category} 
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              >
                <option>Product Quality</option>
                <option>Process Efficiency</option>
                <option>Customer Satisfaction</option>
                <option>Compliance</option>
              </select>
            </Field>
            <Field label="Department" icon={Building} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.department} 
                onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Timeline & Responsibility" icon={Calendar} number="02">
            <Field label="Start Date" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.startDate} 
                onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
              />
            </Field>
            <Field label="Target End Date" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.endDate} 
                onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
              />
            </Field>
            <Field label="Responsible Person" icon={User} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.responsiblePerson} 
                onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
                placeholder="Name of Manager / Staff"
              />
            </Field>
            <Field label="Full Description / Action Plan" icon={FileText} span2>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[160px] resize-none`} 
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Detail the steps to achieve this quality goal..."
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Performance Metrics" icon={BarChart3} number="03" className="md:grid-cols-1">
            <Field label="Target Value" required>
              <input 
                type="number" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.targetValue} 
                onChange={e => setFormData(p => ({ ...p, targetValue: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Actual Value">
              <input 
                type="number" disabled={isReadOnly}
                className={inputClass} 
                value={formData.actualValue} 
                onChange={e => setFormData(p => ({ ...p, actualValue: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Unit of Measure (UOM)" required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.uom} 
                onChange={e => setFormData(p => ({ ...p, uom: e.target.value }))}
                placeholder="%, pcs, DHU, etc."
              />
            </Field>
            <Field label="Current Status" required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.status} 
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
              >
                <option>In Progress</option>
                <option>Achieved</option>
                <option>Not Achieved</option>
                <option>Cancelled</option>
              </select>
            </Field>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <Paperclip className="w-5 h-5 text-accent" />
                Supporting Evidence
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add Files
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            {formData.attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <FileText className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No evidence attached yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {formData.attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-text-1 truncate">{file}</span>
                    </div>
                    {!isReadOnly && (
                      <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
