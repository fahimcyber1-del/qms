import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Settings2, Building, User, Calendar, 
  Wrench, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  Microscope, Award, ShieldCheck, Tag, Ruler, Download, Info as InfoIcon, 
  Activity, Flag, Search, Edit2
} from 'lucide-react';
import { getTable } from '../db/db';
import { AttachmentList } from '../components/AttachmentList';
import { openExportPreview } from '../utils/exportUtils';

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

export function CalibrationForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

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

  const handleExport = () => {
    openExportPreview({
      moduleName: 'Calibration Certificate Record',
      moduleId: 'calibration_detail',
      recordId: formData.id,
      fileName: `Calibration_${formData.equipmentId}_Certificate`,
      layout: 'technical',
      fields: [
        { label: 'Equipment Name', value: formData.equipmentName },
        { label: 'Equipment ID', value: formData.equipmentId },
        { label: 'Department', value: formData.department },
        { label: 'Responsible Custodian', value: formData.responsiblePerson },
        { label: 'Certificate Number', value: formData.certificateNumber },
        { label: 'Calibration Agency', value: formData.calibrationAgency },
        { label: 'Last Calibration', value: formData.lastCalibrationDate },
        { label: 'Next Calibration', value: formData.nextCalibrationDate },
        { label: 'Frequency', value: formData.calibrationFrequency },
        { label: 'Status', value: formData.status },
        { label: 'Remarks / Notes', value: formData.remarks, fullWidth: true }
      ],
      attachments: formData.attachments
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAtts: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAtts.push({ name: file.name, data });
    }
    
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  
  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-bg-0">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('calibration')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'Register Precision Instrument' : mode === 'edit' ? 'Update Calibration Record' : 'Instrument Intel'}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.id}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                formData.status === 'Valid' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {formData.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={handleExport} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
               </button>
               <button type="button" onClick={() => onNavigate('calibration-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Edit2 className="w-4 h-4" /> Modify Record
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('calibration')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {isReadOnly && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <div className="p-4 bg-accent/10 text-accent rounded-2xl mb-4"><Ruler className="w-8 h-8" /></div>
              <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Equipment Identifier</div>
              <div className="text-2xl font-black text-text-1 uppercase tracking-tighter">{formData.equipmentId || 'N/A'}</div>
            </div>
            <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
              <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><Calendar className="w-8 h-8" /></div>
              <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Next Calibration Due</div>
              <div className="text-2xl font-black text-text-1 font-mono">{formData.nextCalibrationDate || 'N/A'}</div>
            </div>
            <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
              formData.status === 'Valid' ? 'bg-green-500/10 border-green-500/20' : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              <div className="p-4 bg-white/10 rounded-2xl mb-4">
                <ShieldCheck className={`w-8 h-8 ${formData.status === 'Valid' ? 'text-green-600' : 'text-rose-600'}`} />
              </div>
              <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Integrity Status</div>
              <div className={`text-2xl font-black uppercase ${formData.status === 'Valid' ? 'text-green-600' : 'text-rose-600'}`}>
                {formData.status}
              </div>
            </div>
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Instrument Identification" icon={Ruler} number="01">
            <Field label="Equipment Name" icon={Microscope} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.equipmentName} 
                onChange={e => setFormData(p => ({ ...p, equipmentName: e.target.value }))}
                placeholder="e.g., Digital Micrometer / Electronic Scale"
              />
            </Field>
            <Field label="Equipment Tag ID" icon={Tag} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.equipmentId} 
                onChange={e => setFormData(p => ({ ...p, equipmentId: e.target.value }))}
                placeholder="e.g., QC-SCL-001"
              />
            </Field>
            <Field label="Custodian Department" icon={Building} required>
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
            <Field label="Certificate Number" icon={FileText} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.certificateNumber} 
                onChange={e => setFormData(p => ({ ...p, certificateNumber: e.target.value }))}
              />
            </Field>
            <Field label="Calibration Agency / Lab" icon={Building} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.calibrationAgency} 
                onChange={e => setFormData(p => ({ ...p, calibrationAgency: e.target.value }))}
                placeholder="e.g., External Accredited Lab Name"
              />
            </Field>
            <Field label="Last Calibration Date" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.lastCalibrationDate} 
                onChange={e => setFormData(p => ({ ...p, lastCalibrationDate: e.target.value }))}
              />
            </Field>
            <Field label="Next Calibration Due" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.nextCalibrationDate} 
                onChange={e => setFormData(p => ({ ...p, nextCalibrationDate: e.target.value }))}
              />
            </Field>
            <Field label="Service Frequency" icon={Activity} required>
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
            <Field label="Integrity Status" icon={Flag} required>
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
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Governance" icon={ShieldCheck} number="03" className="md:grid-cols-1">
            <Field label="Responsible Custodian" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.responsiblePerson} 
                onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
              />
            </Field>
            <Field label="Detailed Remarks" icon={Info} span2>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none bg-accent/5`} 
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
                Certifications
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add File
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            {formData.attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <InfoIcon className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No certifications</p>
              </div>
            ) : (
              <AttachmentList
                attachments={formData.attachments}
                onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) })) : undefined}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
