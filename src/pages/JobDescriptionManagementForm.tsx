import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Briefcase, Building, User, Calendar, 
  Users, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  Award, ShieldCheck, ListChecks, Target, Download, Activity, Flag, TrendingUp
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Finance', 'Management'
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

export function JobDescriptionManagementForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState({
    id: initialData.id || `JD-${Date.now()}`,
    jobTitle: initialData.jobTitle || '',
    department: initialData.department || 'Quality',
    grade: initialData.grade || 'M1',
    reportsTo: initialData.reportsTo || '',
    revision: initialData.revision || '01',
    lastUpdate: initialData.lastUpdate || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Draft',
    purpose: initialData.purpose || '',
    responsibilities: initialData.responsibilities || '',
    authorities: initialData.authorities || '',
    qualifications: initialData.qualifications || '',
    competencies: initialData.competencies || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('jobDescriptionManagement').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('jobDescriptionManagement').put(formData);
      }
      onNavigate('job-description-management');
    } catch (error) {
      console.error('Error saving JD record:', error);
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
      moduleName: 'Role Specification & Job Description',
      moduleId: 'job-description',
      recordId: formData.id,
      fileName: `JD_${formData.jobTitle.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'Role Title',    value: formData.jobTitle },
        { label: 'Department',    value: formData.department },
        { label: 'Reports To',    value: formData.reportsTo },
        { label: 'Grade',         value: formData.grade },
        { label: 'Revision',      value: formData.revision },
        { label: 'Last Update',   value: formData.lastUpdate },
        { label: 'Status',        value: formData.status },
      ],
      summary: [
        'Purpose Statement:', formData.purpose,
        'Key Responsibilities:', formData.responsibilities,
        'Authority & Decisions:', formData.authorities,
        'Required Qualifications:', formData.qualifications,
        'Core Competencies:', formData.competencies
      ]
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('job-description-management')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Define New Role' : mode === 'edit' ? 'Update Job Description' : 'Role Specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('job-description-management-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Profile
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Document
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('job-description-management')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-4 bg-accent/10 rounded-2xl mb-4"><Users className="w-8 h-8 text-accent" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Organization Grade</div>
            <div className="text-4xl font-black text-text-1">{formData.grade}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><TrendingUp className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Revision Control</div>
            <div className="text-4xl font-black text-text-1">v{formData.revision}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Active / Published' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <Flag className={`w-8 h-8 ${formData.status === 'Active / Published' ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Status</div>
            <div className={`text-2xl font-black uppercase ${formData.status === 'Active / Published' ? 'text-green-600' : 'text-amber-600'}`}>
              {formData.status.split(' / ')[0]}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Role Identification" icon={Briefcase} number="01">
            <Field label="Formal Job Title" icon={User} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.jobTitle} 
                onChange={e => setFormData(p => ({ ...p, jobTitle: e.target.value }))}
                placeholder="e.g., Senior Quality Assurance Manager"
              />
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
            <Field label="Pay Grade / Level" icon={Award}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.grade} 
                onChange={e => setFormData(p => ({ ...p, grade: e.target.value }))}
                placeholder="e.g., M1, S3, L4"
              />
            </Field>
            <Field label="Directly Reports To" icon={Users} required>
               <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.reportsTo} 
                onChange={e => setFormData(p => ({ ...p, reportsTo: e.target.value }))}
                placeholder="e.g., Director of Operations"
              />
            </Field>
            <Field label="Revision ID" icon={ListChecks} required>
               <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.revision} 
                onChange={e => setFormData(p => ({ ...p, revision: e.target.value }))}
              />
            </Field>
          </Section>

          <Section title="Scope & Responsibilities" icon={ListChecks} number="02">
            <Field label="Core Purpose of Role" icon={Info} required span2>
              <textarea 
                required disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none bg-accent/5`} 
                value={formData.purpose} 
                onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))}
                placeholder="Summarize the reason this position exists..."
              />
            </Field>
            <Field label="Key Responsibilities" icon={ListChecks} required span2>
               <textarea 
                required disabled={isReadOnly}
                className={`${inputClass} min-h-[200px] resize-none`} 
                value={formData.responsibilities} 
                onChange={e => setFormData(p => ({ ...p, responsibilities: e.target.value }))}
                placeholder="1. Oversee factory-wide quality audit processes...&#10;2. Manage a team of 15 QC supervisors..."
              />
            </Field>
            <Field label="Decision Authority" icon={ShieldCheck} span2>
               <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none`} 
                value={formData.authorities} 
                onChange={e => setFormData(p => ({ ...p, authorities: e.target.value }))}
                placeholder="What decisions can this person make without higher approval?..."
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Competency" icon={Target} number="03" className="md:grid-cols-1">
            <Field label="Required Qualifications" icon={Award}>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none`} 
                value={formData.qualifications} 
                onChange={e => setFormData(p => ({ ...p, qualifications: e.target.value }))}
                placeholder="e.g., B.Sc. in Textile Engineering, ISO Lead Auditor Cert"
              />
            </Field>
            <Field label="Core Competencies" icon={Activity}>
               <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none bg-accent/5`} 
                value={formData.competencies} 
                onChange={e => setFormData(p => ({ ...p, competencies: e.target.value }))}
                placeholder="Soft & Hard skills required (e.g., Leadership, Data Analysis with Excel)..."
              />
            </Field>
            <Field label="Last Revision Date" icon={Calendar} required>
               <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.lastUpdate} 
                onChange={e => setFormData(p => ({ ...p, lastUpdate: e.target.value }))}
              />
            </Field>
            <Field label="Record Status" icon={Flag} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.status} 
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
              >
                <option>Draft</option>
                <option>Under Review</option>
                <option>Active / Published</option>
                <option>Archived</option>
              </select>
            </Field>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <Paperclip className="w-5 h-5 text-accent" />
                Linked Assets
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
                <Award className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No evidence files</p>
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
