import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Check, X, Plus, Trash2, FileText, AlertCircle, Save, 
  Building, User, Users, Award, ClipboardCheck, Clock, ShieldCheck, 
  HelpCircle, Camera, Image as ImageIcon, Download, Activity, Flag, LayoutGrid, Calendar
} from 'lucide-react';
import { AttachmentList } from '../components/AttachmentList';

interface CAPAFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
    auditData?: {
      auditId: string;
      nc: string;
      department: string;
      auditor: string;
    };
  };
  onNavigate: (page: string, params?: any) => void;
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

export function CAPAForm({ params, onNavigate }: CAPAFormProps) {
  const { mode, data, auditData } = params;
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState<any>(data || {
    id: `CAPA-${Math.floor(Math.random() * 10000)}`,
    auditId: auditData?.auditId || '',
    nc: auditData?.nc || '',
    cause: '',
    action: '',
    preventive: '',
    responsible: auditData?.auditor || '',
    department: auditData?.department || '',
    deadline: '',
    status: 'Open',
    description: '',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  });

  const handleSave = async () => {
    if (!formData.nc || !formData.responsible || !formData.deadline) {
      alert('Non-Conformity, Responsible, and Deadline are required fields.');
      return;
    }

    const { getTable } = await import('../db/db');
    const dbTable = getTable('capas' as any);

    const historyEntry = {
      date: new Date().toISOString(),
      change: mode === 'create' ? 'CAPA Raised' : 'CAPA Updated',
      responsible: formData.responsible,
      status: formData.status
    };

    const finalCapa = {
      ...formData,
      history: [...(formData.history || []), historyEntry],
      updatedAt: new Date().toISOString()
    };

    try {
      if (mode === 'edit' && data) {
        await dbTable.put(finalCapa);
      } else {
        await dbTable.add({ ...finalCapa, createdAt: new Date().toISOString() });
      }
      onNavigate('capa');
    } catch (err) {
      console.error(err);
      alert('Failed to save CAPA record.');
    }
  };

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
        setFormData((prev: any) => ({
          ...prev,
          attachments: [...(prev.attachments || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    if (isReadOnly) return;
    setFormData((prev: any) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    const statusColor: Record<string, string> = {
      'Open': '#f59e0b', 'In Progress': '#3b82f6',
      'Closed': '#16a34a', 'Overdue': '#dc2626'
    };

    const historyRows = (formData.history || []).map((h: any) => [
      new Date(h.date).toLocaleDateString('en-GB'),
      h.change || '—',
      h.responsible || '—',
      h.status || '—',
    ]);

    await exportDetailToPDF({
      moduleName: 'Corrective & Preventive Action Report',
      moduleId: 'capa',
      recordId: formData.id,
      fileName: `CAPA_${formData.id}`,
      sections: [
        {
          title: 'D1 — Governance & Identification',
          fields: [
            { label: 'CAPA Reference ID', value: formData.id },
            { label: 'Current Status', value: formData.status },
            { label: 'Responsible Person', value: formData.responsible || '—' },
            { label: 'Department', value: formData.department || '—' },
            { label: 'Linked Audit ID', value: formData.auditId || 'N/A' },
            { label: 'Verification Deadline', value: formData.deadline || '—' },
          ]
        },
        {
          title: 'D2 — Problem Statement (Non-Conformity)',
          fields: [
            { label: 'NC Description', value: formData.nc || '—', fullWidth: true },
          ]
        },
        {
          title: 'D3 — Root Cause Analysis (5-Why)',
          fields: [
            { label: 'Root Cause', value: formData.cause || '—', fullWidth: true },
          ]
        },
        {
          title: 'D4 — Corrective Action Taken',
          fields: [
            { label: 'Corrective Action', value: formData.action || '—', fullWidth: true },
          ]
        },
        {
          title: 'D5 — Preventive Action Plan',
          fields: [
            { label: 'Preventive Action', value: formData.preventive || '—', fullWidth: true },
          ]
        },
        {
          title: 'D6 — Supporting Evidence',
          fields: [
            { label: 'Additional Context', value: formData.description || 'No additional context provided.' },
            { label: 'ISO Reference', value: 'ISO 9001:2015 — Clause 10.2' },
          ]
        }
      ],
      tables: historyRows.length > 0 ? [
        {
          title: 'D7 — Audit Trail & Workflow History',
          columns: ['Date', 'Event / Change', 'Responsible', 'Status'],
          rows: historyRows,
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 75 },
            2: { cellWidth: 45 },
            3: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
          }
        }
      ] : undefined,
      summary: [
        'D8 — Effectiveness Verification:',
        formData.status === 'Closed'
          ? 'CAPA has been verified effective and closed successfully.'
          : `Verification pending. Current status: ${formData.status}. Deadline: ${formData.deadline || 'Not set'}.`
      ],
      signatureLabels: ['Raised By', 'Dept. Head', 'QA Manager', 'Closure Authority'],
      styleOverrides: { accentColor: statusColor[formData.status] || '#3b82f6' }
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-0"
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm" onClick={() => onNavigate('capa')}>
            <ChevronLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'Initiate CAPA' : mode === 'edit' ? 'Update CAPA Plan' : 'CAPA Specification'}
              <span className="text-[10px] font-black bg-purple-main text-white px-2.5 py-0.5 rounded-full ml-2">ISO 9001:2015</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.id}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">{formData.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {isReadOnly ? (
             <>
               <button className="btn btn-ghost border border-border-main flex items-center gap-2" onClick={() => onNavigate('capa-form', { mode: 'edit', data: formData })}>
                  <Trash2 className="w-4 h-4 rotate-45" /> Modify Record
               </button>
               <button className="btn btn-primary shadow-lg shadow-accent/20" onClick={exportPDF}>
                  <Download className="w-4 h-4 mr-2" /> Export PDF
               </button>
             </>
          ) : (
            <>
              <button className="btn btn-ghost px-6" onClick={() => onNavigate('capa')}>Cancel</button>
              <button className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20" onClick={handleSave}>
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* ── Left Column: Config ── */}
          <div className="xl:col-span-4 space-y-8">
            {isReadOnly && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg-1 p-5 rounded-2xl border border-border-main shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-3 uppercase">Workflow</p>
                    <p className="text-sm font-bold text-text-1">{formData.status}</p>
                  </div>
                </div>
                <div className="bg-bg-1 p-5 rounded-2xl border border-border-main shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-main/10 text-purple-main rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-3 uppercase">Deadline</p>
                    <p className="text-sm font-bold text-text-1">{formData.deadline}</p>
                  </div>
                </div>
              </div>
            )}

            <Section title="Governance" icon={Building} number="01">
              <Field label="Responsible Person" icon={User} required span2>
                <input 
                  className={inputClass} 
                  value={formData.responsible} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} 
                  placeholder="In-charge for verification"
                />
              </Field>

              <Field label="Department" icon={Building} required>
                <input 
                  className={inputClass} 
                  value={formData.department} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                  placeholder="e.g. Quality Assurance"
                />
              </Field>

              <Field label="Verification Deadline" icon={Calendar} required>
                <input 
                  type="date" 
                  className={inputClass} 
                  value={formData.deadline} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                />
              </Field>

              <Field label="Linked Audit ID" icon={FileText} span2>
                <input 
                  className={inputClass} 
                  value={formData.auditId} 
                  readOnly={isReadOnly || !!auditData}
                  onChange={(e) => setFormData({ ...formData, auditId: e.target.value })} 
                  placeholder="Reference to Audit Record"
                />
              </Field>

              <Field label="Current Workflow State" icon={Activity} span2>
                <select 
                  className={inputClass} 
                  value={formData.status} 
                  disabled={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Open">Open / Pending</option>
                  <option value="In Progress">In Execution</option>
                  <option value="Closed">Resolved / Verified</option>
                  <option value="Overdue">Overdue / Priority</option>
                </select>
              </Field>
            </Section>

            {/* Problem Statement Card */}
            <div className="bg-rose-500/5 rounded-2xl border border-rose-500/20 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-500/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest">Problem Statement</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-500/40 uppercase tracking-widest">Critical Non-Conformity</label>
                <textarea 
                  className="w-full bg-bg-1 border border-rose-500/20 rounded-xl px-4 py-4 text-sm font-bold text-rose-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all min-h-[160px] resize-none" 
                  value={formData.nc} 
                  readOnly={isReadOnly || !!auditData}
                  onChange={(e) => setFormData({ ...formData, nc: e.target.value })}
                  placeholder="Describe the failure mode in detail..."
                />
              </div>
              {(auditData || formData.auditId) && (
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500/60 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/10">
                  <ShieldCheck className="w-3.5 h-3.5" /> Linked to Audit: {formData.auditId}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: RCA & Plan ── */}
          <div className="xl:col-span-8 space-y-8">
            <Section title="Root Cause & Resolution Plan" icon={ShieldCheck} number="02">
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-main/10 text-purple-main flex items-center justify-center text-[10px] font-black">1</div>
                  <label className="text-xs font-black text-text-1 uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-main" /> Root Cause Analysis
                  </label>
                </div>
                <textarea 
                  className={`${inputClass} min-h-[160px] resize-none font-medium`} 
                  value={formData.cause} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                  placeholder="Perform a 5-Why analysis to identify the fundamental cause..."
                />
              </div>

              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-green-500/10 text-green-500 flex items-center justify-center text-[10px] font-black">2</div>
                  <label className="text-xs font-black text-text-1 uppercase tracking-widest flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Corrective Action
                  </label>
                </div>
                <textarea 
                  className={`${inputClass} min-h-[160px] resize-none font-medium`} 
                  value={formData.action} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  placeholder="Immediate steps taken to contain the issue and correct the specific occurrence..."
                />
              </div>

              <div className="md:col-span-2 space-y-4 pt-4 border-t border-border-main">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-[10px] font-black">3</div>
                  <label className="text-xs font-black text-text-1 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" /> Strategic Prevention
                  </label>
                </div>
                <textarea 
                  className={`${inputClass} min-h-[120px] resize-none bg-accent/5 font-medium`} 
                  value={formData.preventive} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, preventive: e.target.value })}
                  placeholder="Systemic changes implemented to prevent recurrence across the organization..."
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-text-3 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Supporting Evidence
                  </label>
                  {!isReadOnly && (
                    <div className="flex gap-2">
                      <input 
                        type="file" id="capa-file-upload" className="hidden" accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label 
                        htmlFor="capa-file-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-main/10 text-purple-main rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-purple-main/20 transition-colors border border-purple-main/20"
                      >
                        <Camera className="w-4 h-4" /> Add Evidence
                      </label>
                    </div>
                  )}
                </div>
                
                <textarea 
                  className={`${inputClass} min-h-[80px] resize-none border-dashed`} 
                  value={formData.description} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional context, witness statements, or reference documents..."
                />

                {formData.attachments && formData.attachments.length > 0 && (
                  <AttachmentList 
                    attachments={formData.attachments}
                    onRemove={!isReadOnly ? (idx: number) => removeImage(idx) : undefined}
                  />
                )}
              </div>
            </Section>

            {/* Audit Trail */}
            {formData.history && formData.history.length > 0 && (
              <div className="bg-bg-1 rounded-2xl border border-border-main p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-border-main pb-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-2 text-text-3 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-text-1 uppercase tracking-widest">Audit Trail & Timeline</h3>
                </div>
                
                <div className="relative space-y-8 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-main">
                  {formData.history.map((h: any, i: number) => (
                    <div key={i} className="relative pl-12">
                      <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-full border-4 border-bg-1 shadow-sm flex items-center justify-center z-10 ${
                        h.change.includes('Raised') ? 'bg-purple-main' : 'bg-accent'
                      }`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-bg-2/30 p-4 rounded-xl border border-border-main transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Event #{formData.history.length - i}</span>
                          <span className="text-[10px] font-bold text-text-3 font-mono italic">{new Date(h.date).toLocaleString()}</span>
                        </div>
                        <h4 className="text-sm font-black text-text-1 mb-1">{h.change}</h4>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border-main/50">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-bg-1 border border-border-main flex items-center justify-center">
                              <User className="w-3 h-3 text-text-3" />
                            </div>
                            <span className="text-[10px] font-bold text-text-2">{h.responsible || 'System'}</span>
                          </div>
                          <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            h.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 
                            h.status === 'Closed' ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'
                          }`}>
                            {h.status || 'Active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
