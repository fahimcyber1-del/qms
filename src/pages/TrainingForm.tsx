import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, ArrowLeft, Save, Plus, Trash2, 
  FileText, CheckCircle2, Clock, AlertTriangle,
  User, Calendar, MapPin, Timer, Users, BookOpen, Download, Info as InfoIcon,
  ShieldCheck, LayoutGrid, Activity, Tag
} from 'lucide-react';
import { getTable } from '../db/db';
import { DEPARTMENTS } from '../config/moduleConfigs';
import { UniversalRecord, FileAttachment } from '../types';

interface TrainingFormProps {
  onNavigate: (page: string, params?: any) => void;
  params?: { recordId?: string; mode?: 'create' | 'edit' | 'view'; data?: any };
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

export function TrainingForm({ onNavigate, params }: TrainingFormProps) {
  const mode = params?.mode || 'create';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isReadOnly = isView;

  const [loading, setLoading] = useState(isEdit || isView ? true : false);
  const [formData, setFormData] = useState<Partial<UniversalRecord>>({
    trainingTitle: '',
    trainingType: 'Quality',
    department: 'Quality',
    date: new Date().toISOString().split('T')[0],
    responsiblePerson: '',
    trainer: '',
    participants: '',
    participantCount: 0,
    duration: 1,
    venue: '',
    description: '',
    effectiveness: 'Not Evaluated',
    status: 'Open',
    attachments: [],
  });

  useEffect(() => {
    if (isEdit || isView) {
      loadRecord();
    }
  }, [isEdit, isView, params?.recordId]);

  const loadRecord = async () => {
    try {
      const recordId = params?.recordId || params?.data?.id;
      if (!recordId) {
         if (params?.data) {
           setFormData(params.data);
           setLoading(false);
         }
         return;
      }
      const record = await getTable('training').get(recordId);
      if (record) {
        setFormData(record);
      }
    } catch (error) {
      console.error('Failed to load training record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAttachments.push({
        name: file.name,
        data: data,
        type: file.type,
        size: file.size
      });
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const now = new Date().toISOString();
    
    try {
      if (isEdit) {
        const updatedRecord = {
          ...formData,
          id: params!.recordId || formData.id,
          updatedAt: now,
          updatedBy: 'System User',
        } as UniversalRecord;
        await getTable('training').put(updatedRecord);
      } else {
        const id = `TRN-${Date.now().toString(36).toUpperCase()}`;
        const newRecord = {
          ...formData,
          id,
          createdAt: now,
          createdBy: 'System User',
          updatedAt: now,
          updatedBy: 'System User',
          comments: [],
          history: [{
            id: crypto.randomUUID(),
            action: 'Created',
            userName: 'System User',
            details: 'Training record created',
            timestamp: now
          }]
        } as UniversalRecord;
        await getTable('training').add(newRecord);
      }
      onNavigate('training');
    } catch (error) {
      console.error('Failed to save training record:', error);
      alert('Error saving record. Please try again.');
    }
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    const statusColor: Record<string, string> = {
      'Completed': '#16a34a', 'In Progress': '#3b82f6',
      'Open': '#f59e0b', 'Cancelled': '#dc2626'
    };

    // Build participant list as table rows if text is present
    const participantLines = (formData.participants || '').split('\n').filter(p => p.trim());
    const participantRows = participantLines.map((name, i) => [String(i + 1), name.trim(), '—', '']);

    await exportDetailToPDF({
      moduleName: 'Personnel Training Record',
      moduleId: 'training',
      recordId: formData.id || 'N/A',
      fileName: `Training_${(formData.trainingTitle || 'Record').replace(/\s+/g, '_')}`,
      sections: [
        {
          title: '1. Training Programme Details',
          fields: [
            { label: 'Training Title / Subject', value: formData.trainingTitle || '—', fullWidth: true },
            { label: 'Training Category', value: formData.trainingType || '—' },
            { label: 'Target Department', value: formData.department || '—' },
            { label: 'Execution Status', value: formData.status || '—' },
            { label: 'ISO Reference', value: 'ISO 9001:2015 — Clause 7.2 (Competence)' },
          ]
        },
        {
          title: '2. Logistics & Personnel',
          fields: [
            { label: 'Training Date', value: formData.date || '—' },
            { label: 'Duration', value: `${formData.duration || 1} Hour(s)` },
            { label: 'Venue / Location', value: formData.venue || '—' },
            { label: 'Lead Instructor / Trainer', value: formData.trainer || '—' },
            { label: 'Expected Participants', value: String(formData.participantCount || 0) },
            { label: 'Responsible Person', value: formData.responsiblePerson || '—' },
          ]
        },
        {
          title: '3. Syllabus & Content',
          fields: [
            { label: 'Training Content / Description', value: formData.description || 'Not specified.', fullWidth: true },
            { label: 'Effectiveness Evaluation', value: formData.effectiveness || 'Not Evaluated' },
          ]
        }
      ],
      tables: participantRows.length > 0 ? [
        {
          title: '4. Attendance Register',
          columns: ['#', 'Participant Name / ID', 'Designation', 'Signature'],
          rows: participantRows,
          columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 65, fontStyle: 'bold' },
            2: { cellWidth: 50 },
            3: { cellWidth: 45 },
          }
        }
      ] : undefined,
      summary: [
        `Training Status: ${formData.status}`,
        formData.status === 'Completed'
          ? `Training completed successfully on ${formData.date}. ${formData.participantCount || 0} participant(s) attended.`
          : `Training scheduled for ${formData.date}. Status: ${formData.status}.`
      ],
      signatureLabels: ['Lead Instructor', 'Dept. Head', 'HR Manager', 'QA Acknowledgment'],
      styleOverrides: { accentColor: statusColor[formData.status || ''] || '#3b82f6' }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-bg-0">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('training')}
            className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm text-text-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-3 uppercase tracking-tight">
              <GraduationCap className="w-7 h-7 text-accent" />
              {isView ? 'Training Specification' : isEdit ? 'Update Training Record' : 'New Training Plan'}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.id || 'Drafting Mode'}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                formData.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {formData.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {isView ? (
              <>
                <button type="button" onClick={() => onNavigate('training-form', { mode: 'edit', recordId: formData.id })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                   <Plus className="w-4 h-4 rotate-45" /> Modify Record
                </button>
                <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                   <Download className="w-4 h-4 mr-2" /> Download Record
                </button>
              </>
           ) : (
              <>
                <button onClick={() => onNavigate('training')} className="btn btn-ghost px-6">Cancel</button>
                <button 
                  onClick={() => handleSubmit()}
                  className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20"
                >
                  <Save className="w-4 h-4" />
                  Save Training
                </button>
              </>
           )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">

      {isView && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl mb-4"><Users className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Total Attendance</div>
            <div className="text-4xl font-black text-text-1 font-mono">{formData.participantCount}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-accent/10 text-accent rounded-2xl mb-4"><Calendar className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Scheduled Event</div>
            <div className="text-2xl font-black text-text-1 font-mono">{formData.date}</div>
            <div className="text-xs mt-2 text-text-3 font-bold flex items-center gap-1 justify-center"><Clock className="w-3 h-3" /> {formData.duration} Hours</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <Activity className={`w-8 h-8 ${formData.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Execution Status</div>
            <div className={`text-2xl font-black uppercase ${
              formData.status === 'Completed' ? 'text-green-600' : 'text-amber-600'
            }`}>{formData.status}</div>
            <div className="text-xs mt-2 text-text-3 font-bold uppercase tracking-tighter">Level: {formData.trainingType}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Academic Details" icon={BookOpen} number="01">
            <Field label="Training Title / Subject" icon={FileText} required span2>
              <input 
                type="text" name="trainingTitle" disabled={isReadOnly}
                value={formData.trainingTitle} onChange={handleChange} required
                placeholder="e.g. Fire Safety Refresher Q4"
                className={inputClass}
              />
            </Field>
            <Field label="Training Category" icon={Tag} required>
              <select 
                name="trainingType" value={formData.trainingType}
                onChange={handleChange} required disabled={isReadOnly}
                className={inputClass}
              >
                <option value="Induction">Induction</option>
                <option value="On-the-Job">On-the-Job</option>
                <option value="Refresher">Refresher</option>
                <option value="Skill Upgrade">Skill Upgrade</option>
                <option value="Safety">Safety</option>
                <option value="Quality">Quality</option>
                <option value="Compliance">Compliance</option>
              </select>
            </Field>
            <Field label="Target Department" icon={Users} required>
              <select 
                name="department" value={formData.department}
                onChange={handleChange} required disabled={isReadOnly}
                className={inputClass}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </Field>
            <Field label="Syllabus / Content Description" icon={InfoIcon} span2>
              <textarea 
                name="description" value={formData.description}
                onChange={handleChange} disabled={isReadOnly}
                placeholder="Key topics to be covered during the training session..."
                rows={4} className={`${inputClass} resize-none min-h-[120px] bg-accent/5`}
              />
            </Field>
          </Section>

          <Section title="Participant Intelligence" icon={Users} number="03" className="md:grid-cols-1">
            <Field label="Attendance Record (Names/IDs)" icon={User} span2>
              <textarea 
                name="participants" value={formData.participants}
                onChange={handleChange} disabled={isReadOnly}
                placeholder="Enter names or IDs of attendees..."
                rows={6} className={`${inputClass} resize-none min-h-[160px] font-mono`}
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Logistics & Trainer" icon={Calendar} number="02" className="md:grid-cols-1">
            <Field label="Training Date" icon={Calendar} required>
              <input 
                type="date" name="date" disabled={isReadOnly}
                value={formData.date} onChange={handleChange} required
                className={inputClass}
              />
            </Field>
            <Field label="Duration (Hours)" icon={Clock} required>
              <input 
                type="number" name="duration" disabled={isReadOnly}
                value={formData.duration} onChange={handleChange}
                required min="0.5" step="0.5"
                className={inputClass}
              />
            </Field>
            <Field label="Venue / Location" icon={MapPin}>
              <input 
                type="text" name="venue" disabled={isReadOnly}
                value={formData.venue} onChange={handleChange}
                placeholder="e.g. Conference Room B"
                className={inputClass}
              />
            </Field>
            <Field label="Lead Instructor" icon={User} required>
              <input 
                type="text" name="trainer" disabled={isReadOnly}
                value={formData.trainer} onChange={handleChange}
                required placeholder="Name of instructor"
                className={inputClass}
              />
            </Field>
            <Field label="Execution Status" icon={Activity} required>
              <select 
                name="status" value={formData.status}
                onChange={handleChange} disabled={isReadOnly}
                className={`${inputClass} font-black text-accent`}
              >
                <option value="Open">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </Field>
            <Field label="Expected Participants" icon={Users} required>
               <input 
                type="number" name="participantCount" disabled={isReadOnly}
                value={formData.participantCount} onChange={handleChange}
                className={inputClass}
              />
            </Field>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
              <h2 className="text-lg font-bold text-text-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Evidence & Docs
              </h2>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            <div className="space-y-3">
              {(formData.attachments || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                  <InfoIcon className="w-10 h-10 mb-2" />
                  <p className="text-xs font-black uppercase tracking-widest text-center px-4">No materials attached</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.attachments?.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg-2 rounded-xl group border border-border-main hover:border-accent/40 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-text-1 truncate">{file.name}</span>
                      </div>
                      {!isReadOnly && (
                        <button 
                          onClick={() => removeAttachment(i)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
}
