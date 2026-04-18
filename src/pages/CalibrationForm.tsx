import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Settings2, Building, User, Calendar, 
  Wrench, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Microscope, Award, ShieldCheck, Tag, Ruler
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

export function CalibrationForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `CAL-${Date.now()}`,
    equipmentName: initialData.equipmentName || '',
    equipmentId: initialData.equipmentId || '',
    calibrationAgency: initialData.calibrationAgency || '',
    certificateNumber: initialData.certificateNumber || '',
    lastCalibrationDate: initialData.lastCalibrationDate || '',
    nextCalibrationDate: initialData.nextCalibrationDate || '',
    calibrationFrequency: initialData.calibrationFrequency || '12 Months',
    status: initialData.status || 'Valid',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('calibration').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('calibration').put(formData);
      }
      onNavigate('calibration');
    } catch (error) {
      console.error('Error saving calibration record:', error);
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
          <button type="button" onClick={() => onNavigate('calibration')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Register Precision Instrument' : mode === 'edit' ? 'Update Calibration Record' : 'Instrument Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('calibration')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Record
            </button>
          )}
        </div>
      </div>

      <Section title="Instrument Identification" icon={Ruler} number="01">
        <Field label="Equipment Name" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.equipmentName} 
            onChange={e => setFormData(p => ({ ...p, equipmentName: e.target.value }))}
            placeholder="e.g., Digital Micrometer / Electronic Scale"
          />
        </Field>
        <Field label="Equipment Tag ID" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.equipmentId} 
            onChange={e => setFormData(p => ({ ...p, equipmentId: e.target.value }))}
            placeholder="e.g., QC-SCL-001"
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
      </Section>

      <Section title="Calibration Details" icon={Award} number="02">
        <Field label="Certificate Number" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.certificateNumber} 
            onChange={e => setFormData(p => ({ ...p, certificateNumber: e.target.value }))}
          />
        </Field>
        <Field label="Calibration Agency / Lab" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.calibrationAgency} 
            onChange={e => setFormData(p => ({ ...p, calibrationAgency: e.target.value }))}
            placeholder="e.g., External Accredited Lab Name"
          />
        </Field>
        <Field label="Last Calibration Date" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.lastCalibrationDate} 
            onChange={e => setFormData(p => ({ ...p, lastCalibrationDate: e.target.value }))}
          />
        </Field>
        <Field label="Next Calibration Due" required>
          <input 
            type="date" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.nextCalibrationDate} 
            onChange={e => setFormData(p => ({ ...p, nextCalibrationDate: e.target.value }))}
          />
        </Field>
        <Field label="Frequency" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.calibrationFrequency} 
            onChange={e => setFormData(p => ({ ...p, calibrationFrequency: e.target.value }))}
          >
            <option>3 Months</option>
            <option>6 Months</option>
            <option>12 Months</option>
            <option>24 Months</option>
          </select>
        </Field>
        <Field label="Current Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Valid</option>
            <option>Expired</option>
            <option>Out of Service</option>
            <option>Repairing</option>
          </select>
        </Field>
      </Section>

      <Section title="Ownership & Remarks" icon={User} number="03">
        <Field label="Responsible Custodian" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.responsiblePerson} 
            onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
          />
        </Field>
        <Field label="Detailed Remarks" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.remarks} 
            onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
            placeholder="Special handling instructions or calibration results summary..."
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Calibration Certificates (PDF)
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Upload Certificate
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <Award className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No certifications attached</p>
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
