import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, TestTube2, Building, User, Calendar, 
  Beaker, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Microscope, Tag, ShoppingBag
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

export function TestingManagementForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `TST-${Date.now()}`,
    testName: initialData.testName || '',
    testType: initialData.testType || 'Fabric',
    sampleId: initialData.sampleId || '',
    buyer: initialData.buyer || '',
    style: initialData.style || '',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    labName: initialData.labName || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Pending',
    testResult: initialData.testResult || '',
    expectedValue: initialData.expectedValue || '',
    actualValue: initialData.actualValue || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('testing').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('testing').put(formData);
      }
      onNavigate('testing-management');
    } catch (error) {
      console.error('Error saving test record:', error);
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
          <button type="button" onClick={() => onNavigate('testing-management')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Register New Test' : mode === 'edit' ? 'Update Test Record' : 'Test Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('testing-management')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Record
            </button>
          )}
        </div>
      </div>

      <Section title="Sample Information" icon={Tag} number="01">
        <Field label="Test Name" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.testName} 
            onChange={e => setFormData(p => ({ ...p, testName: e.target.value }))}
            placeholder="e.g., Fabric Shrinkage Test"
          />
        </Field>
        <Field label="Sample ID" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.sampleId} 
            onChange={e => setFormData(p => ({ ...p, sampleId: e.target.value }))}
            placeholder="Lot/Ref No."
          />
        </Field>
        <Field label="Test Type" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.testType} 
            onChange={e => setFormData(p => ({ ...p, testType: e.target.value }))}
          >
            <option>Fabric</option>
            <option>Garment</option>
            <option>Chemical</option>
            <option>Safety</option>
            <option>Color Fastness</option>
          </select>
        </Field>
        <Field label="Buyer / Customer">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.buyer} 
            onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
          />
        </Field>
        <Field label="Style No.">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.style} 
            onChange={e => setFormData(p => ({ ...p, style: e.target.value }))}
          />
        </Field>
      </Section>

      <Section title="Testing Details" icon={Microscope} number="02">
        <Field label="Laboratory / Facility" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.labName} 
            onChange={e => setFormData(p => ({ ...p, labName: e.target.value }))}
            placeholder="e.g., ITS, SGS, or Internal Lab"
          />
        </Field>
        <Field label="Inspection Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.date} 
            onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
          />
        </Field>
        <Field label="Expected Value / Standard">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.expectedValue} 
            onChange={e => setFormData(p => ({ ...p, expectedValue: e.target.value }))}
            placeholder="e.g., < 2%"
          />
        </Field>
        <Field label="Actual Value">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.actualValue} 
            onChange={e => setFormData(p => ({ ...p, actualValue: e.target.value }))}
          />
        </Field>
        <Field label="Result Summary" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.testResult} 
            onChange={e => setFormData(p => ({ ...p, testResult: e.target.value }))}
            placeholder="Briefly describe the test outcome..."
          />
        </Field>
        <Field label="Overall Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Pass</option>
            <option>Fail</option>
            <option>Re-test</option>
          </select>
        </Field>
      </Section>

      <Section title="Administration" icon={User} number="03">
        <Field label="Responsible Person" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
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
        <Field label="Remarks" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.remarks} 
            onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Attachments (Test Reports)
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Upload Report
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <Beaker className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No reports uploaded</p>
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
