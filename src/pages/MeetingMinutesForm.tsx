import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Users2, Building, User, Calendar, 
  Mic2, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, ClipboardList, MessageSquare, ShieldCheck
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export function MeetingMinutesForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `MOM-${Date.now()}`,
    meetingTitle: initialData.meetingTitle || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    category: initialData.category || 'Production Meeting',
    facilitator: initialData.facilitator || '',
    location: initialData.location || 'Conference Room A',
    status: initialData.status || 'Draft',
    attendees: initialData.attendees || '',
    agenda: initialData.agenda || '',
    discussion: initialData.discussion || '',
    actionItems: initialData.actionItems || [],
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      const summaryData = {
        ...formData,
        actionItemsCount: formData.actionItems.length,
        createdAt: new Date().toISOString()
      };
      if (mode === 'create') {
        await getTable('meetingMinutes').add(summaryData);
      } else {
        await getTable('meetingMinutes').put(summaryData);
      }
      onNavigate('meeting-minutes');
    } catch (error) {
      console.error('Error saving MOM record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const addActionItem = () => {
    setFormData(p => ({
      ...p,
      actionItems: [...p.actionItems, { task: '', owner: '', dueDate: '', status: 'Pending' }]
    }));
  };

  const updateActionItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.actionItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(p => ({ ...p, actionItems: newItems }));
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
          <button type="button" onClick={() => onNavigate('meeting-minutes')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Draft Meeting Minutes' : mode === 'edit' ? 'Update MOM Entry' : 'Minutes specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('meeting-minutes')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Minutes
            </button>
          )}
        </div>
      </div>

      <Section title="Meeting Logistics" icon={ClipboardList} number="01">
        <Field label="Agenda / Meeting Title" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.meetingTitle} 
            onChange={e => setFormData(p => ({ ...p, meetingTitle: e.target.value }))}
            placeholder="e.g., Q1 Management Review Meeting"
          />
        </Field>
        <Field label="Meeting Category" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.category} 
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
          >
            <option>Management Review</option>
            <option>Production Meeting</option>
            <option>Quality Committee</option>
            <option>Root Cause Discussion</option>
            <option>Safety / Compliance</option>
          </select>
        </Field>
        <Field label="Meeting Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.date} 
            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          />
        </Field>
        <Field label="Facilitator / Chair" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.facilitator} 
            onChange={e => setFormData(p => ({ ...p, facilitator: e.target.value }))}
          />
        </Field>
        <Field label="Venue / Location">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.location} 
            onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
          />
        </Field>
        <Field label="Attendees Section (Names / Depts)" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[60px]`} 
            value={formData.attendees} 
            onChange={e => setFormData(p => ({ ...p, attendees: e.target.value }))}
            placeholder="e.g., John Doe (QA), Jane Smith (Production)..."
          />
        </Field>
      </Section>

      <Section title="Discussion & Notes" icon={MessageSquare} number="02">
        <Field label="Agenda Points" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px] bg-accent/5`} 
            value={formData.agenda} 
            onChange={e => setFormData(p => ({ ...p, agenda: e.target.value }))}
          />
        </Field>
        <Field label="Detailed Discussion / Minutes Content" required span2>
           <textarea 
            required disabled={isReadOnly}
            className={`${inputClass} min-h-[150px]`} 
            value={formData.discussion} 
            onChange={e => setFormData(p => ({ ...p, discussion: e.target.value }))}
            placeholder="Detailed record of what was discussed..."
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Mic2 className="w-5 h-5 text-accent" />
            Decision / Action Item matrix Section
          </h4>
          {!isReadOnly && (
            <button type="button" onClick={addActionItem} className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {formData.actionItems.map((item: any, idx: number) => (
             <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-bg-2 rounded-xl border border-border-main relative group">
                <div className="md:col-span-2">
                   <label className="text-[10px] uppercase font-black text-text-3 mb-1 block">Assigned Task</label>
                   <input 
                    type="text" disabled={isReadOnly}
                    className="w-full bg-bg-1 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent"
                    value={item.task} onChange={e => updateActionItem(idx, 'task', e.target.value)}
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-black text-text-3 mb-1 block">Owner</label>
                   <input 
                    type="text" disabled={isReadOnly}
                    className="w-full bg-bg-1 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent"
                    value={item.owner} onChange={e => updateActionItem(idx, 'owner', e.target.value)}
                  />
                </div>
                <div>
                   <label className="text-[10px] uppercase font-black text-text-3 mb-1 block">Due Date</label>
                   <input 
                    type="date" disabled={isReadOnly}
                    className="w-full bg-bg-1 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-accent"
                    value={item.dueDate} onChange={e => updateActionItem(idx, 'dueDate', e.target.value)}
                  />
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => setFormData(p => ({ ...p, actionItems: p.actionItems.filter((_, i) => i !== idx) }))} className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <X className="w-3 h-3" />
                  </button>
                )}
             </div>
          ))}
          {formData.actionItems.length === 0 && (
            <div className="py-8 text-center text-text-3 text-sm italic opacity-60">No action items defined for this session.</div>
          )}
        </div>
      </div>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Signed Attendance / Handouts Section
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
            <FileText className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No scan attachments</p>
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
