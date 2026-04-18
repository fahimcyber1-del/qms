import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, TrendingUp, Building, User, Calendar, 
  Rocket, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Lightbulb, Sparkles, Activity
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

export function ContinuousImprovementForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `CI-${Date.now()}`,
    improvementTitle: initialData.improvementTitle || '',
    category: initialData.category || 'Quality',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    targetDate: initialData.targetDate || '',
    status: initialData.status || 'Proposed',
    currentSituation: initialData.currentSituation || '',
    proposedImprovement: initialData.proposedImprovement || '',
    expectedBenefit: initialData.expectedBenefit || '',
    implementationPlan: initialData.implementationPlan || '',
    actualResult: initialData.actualResult || '',
    verifiedBy: initialData.verifiedBy || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('continuousImprovement').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('continuousImprovement').put(formData);
      }
      onNavigate('continuous-improvement');
    } catch (error) {
      console.error('Error saving CI record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const Section = ({ title, icon: Icon, children, number }: any) => (
    <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
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

  const Field = ({ label, required, children, span2 }: any) => (
    <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
      <label className="text-sm font-bold text-text-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto" onSubmit={handleSave}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('continuous-improvement')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Propose New Improvement' : mode === 'edit' ? 'Update Kaizen Project' : 'Initiative Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('continuous-improvement')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Initiative
            </button>
          )}
        </div>
      </div>

      <Section title="Project Definition" icon={Lightbulb} number="01">
        <Field label="Improvement Title" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.improvementTitle} 
            onChange={e => setFormData(p => ({ ...p, improvementTitle: e.target.value }))}
            placeholder="e.g., Implementing Digital QC Terminals in Sewing"
          />
        </Field>
        <Field label="Category" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.category} 
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
          >
            <option>Quality</option>
            <option>Productivity</option>
            <option>Safety</option>
            <option>Cost Reduction</option>
            <option>Process</option>
            <option>Waste Reduction</option>
          </select>
        </Field>
        <Field label="Target Completion Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.targetDate} 
            onChange={e => setFormData(p => ({ ...p, targetDate: e.target.value }))}
          />
        </Field>
        <Field label="Current Situation" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.currentSituation} 
            onChange={e => setFormData(p => ({ ...p, currentSituation: e.target.value }))}
            placeholder="Describe the current problem or inefficiency..."
          />
        </Field>
      </Section>

      <Section title="Proposed Solution" icon={Sparkles} number="02">
        <Field label="Proposed Improvement" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[100px] bg-accent/5 border border-accent/20`} 
            value={formData.proposedImprovement} 
            onChange={e => setFormData(p => ({ ...p, proposedImprovement: e.target.value }))}
            placeholder="Detail the suggested changes and methodology..."
          />
        </Field>
        <Field label="Expected Benefits" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.expectedBenefit} 
            onChange={e => setFormData(p => ({ ...p, expectedBenefit: e.target.value }))}
            placeholder="What positive outcomes are anticipated? (Time, Cost, Quality)"
          />
        </Field>
        <Field label="Implementation Plan" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.implementationPlan} 
            onChange={e => setFormData(p => ({ ...p, implementationPlan: e.target.value }))}
            placeholder="Step-by-step rollout strategy..."
          />
        </Field>
      </Section>

      <Section title="Results & Validation" icon={Activity} number="03">
        <Field label="Actual Results (Post-Implementation)" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.actualResult} 
            onChange={e => setFormData(p => ({ ...p, actualResult: e.target.value }))}
            placeholder="Quantify the improvements achieved..."
          />
        </Field>
        <Field label="Overall Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Proposed</option>
            <option>Approved</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </Field>
        <Field label="Department" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.department} 
            onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
          >
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Responsible Person" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
        </Field>
        <Field label="Verified By">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.verifiedBy} 
            onChange={e => setFormData(p => ({ ...p, verifiedBy: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Project Documentation
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Attach Files
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <Rocket className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No documents attached</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.attachments.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-1 truncate">{file}</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
