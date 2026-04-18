import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Briefcase, Building, User, Calendar, 
  Gavel, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Users, Award, ClipboardList
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

export function ManagementReviewForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `MRM-${Date.now()}`,
    reviewTitle: initialData.reviewTitle || '',
    reviewType: initialData.reviewType || 'Annual',
    date: initialData.date || new Date().toISOString().split('T')[0],
    chairperson: initialData.chairperson || '',
    department: initialData.department || 'Management',
    responsiblePerson: initialData.responsiblePerson || '',
    status: initialData.status || 'Scheduled',
    attendees: initialData.attendees || '',
    inputItems: initialData.inputItems || '',
    outputDecisions: initialData.outputDecisions || '',
    actionItems: initialData.actionItems || '',
    resourceNeeds: initialData.resourceNeeds || '',
    nextReviewDate: initialData.nextReviewDate || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('managementReview').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('managementReview').put(formData);
      }
      onNavigate('management-review');
    } catch (error) {
      console.error('Error saving MR record:', error);
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
          <button type="button" onClick={() => onNavigate('management-review')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Schedule Management Review' : mode === 'edit' ? 'Update Review Minutes' : 'Review Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('management-review')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Minutes
            </button>
          )}
        </div>
      </div>

      <Section title="Meeting Logistics" icon={Gavel} number="01">
        <Field label="Review Title" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.reviewTitle} 
            onChange={e => setFormData(p => ({ ...p, reviewTitle: e.target.value }))}
            placeholder="e.g., Annual Quality System Review 2026"
          />
        </Field>
        <Field label="Review Type" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.reviewType} 
            onChange={e => setFormData(p => ({ ...p, reviewType: e.target.value }))}
          >
            <option>Annual</option>
            <option>Semi-Annual</option>
            <option>Quarterly</option>
            <option>Ad-hoc</option>
          </select>
        </Field>
        <Field label="Review Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.date} 
            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          />
        </Field>
        <Field label="Chairperson" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.chairperson} 
            onChange={e => setFormData(p => ({ ...p, chairperson: e.target.value }))}
            placeholder="Managing Director / CEO"
          />
        </Field>
        <Field label="Minutes Taker">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
        </Field>
        <Field label="Attendees" required span2>
          <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.attendees} 
            onChange={e => setFormData(p => ({ ...p, attendees: e.target.value }))}
            placeholder="List all executive and departmental managers present..."
          />
        </Field>
      </Section>

      <Section title="Review Content (ISO 9001:2015)" icon={ClipboardList} number="02">
        <Field label="Review Input Items" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.inputItems} 
            onChange={e => setFormData(p => ({ ...p, inputItems: e.target.value }))}
            placeholder="Status of actions from previous reviews; Changes in external/internal issues; Customer satisfaction; QMS Performance..."
          />
        </Field>
        <Field label="Decisions & Outputs" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px] bg-accent/5 border border-accent/20`} 
            value={formData.outputDecisions} 
            onChange={e => setFormData(p => ({ ...p, outputDecisions: e.target.value }))}
            placeholder="Opportunities for improvement; Any need for changes to the QMS; Resource requirements..."
          />
        </Field>
        <Field label="Action Items" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.actionItems} 
            onChange={e => setFormData(p => ({ ...p, actionItems: e.target.value }))}
            placeholder="Specific tasks assigned to managers..."
          />
        </Field>
      </Section>

      <Section title="Planning & Resources" icon={Award} number="03">
        <Field label="Resource Requirements" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.resourceNeeds} 
            onChange={e => setFormData(p => ({ ...p, resourceNeeds: e.target.value }))}
            placeholder="Budget, personnel, or infrastructure needs identified..."
          />
        </Field>
        <Field label="Current Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Follow-up Required</option>
            <option>Closed</option>
          </select>
        </Field>
        <Field label="Planned Next Review Date">
          <input 
            type="date" disabled={isReadOnly}
            className={inputClass} 
            value={formData.nextReviewDate} 
            onChange={e => setFormData(p => ({ ...p, nextReviewDate: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Supporting Data & Reports
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
            <Users className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No meeting files attached</p>
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
