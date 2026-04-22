import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, X, Plus, Trash2, FileText, Save, 
  Building, User, Award, ClipboardCheck, ShieldCheck, 
  Filter, Camera, ChevronRight, CheckCircle2, AlertTriangle,
  LayoutGrid, Activity
} from 'lucide-react';
import { AttachmentList } from '../components/AttachmentList';

const AUDIT_CLAUSES = [
  {
    group: "CLAUSE 4 – CONTEXT OF THE ORGANIZATION",
    items: [
      { id: "4.1", text: "Organization context documented?" },
      { id: "4.2", text: "Internal issues identified?" },
      { id: "4.3", text: "External issues identified?" },
      { id: "4.4", text: "Interested parties identified (buyers, suppliers, employees)?" },
      { id: "4.5", text: "Scope of QMS defined?" },
      { id: "4.6", text: "QMS processes documented?" }
    ]
  },
  {
    group: "CLAUSE 5 – LEADERSHIP",
    items: [
      { id: "5.1", text: "Top management commitment demonstrated?" },
      { id: "5.2", text: "Quality policy established?" },
      { id: "5.3", text: "Quality policy communicated to employees?" },
      { id: "5.4", text: "Customer focus implemented?" },
      { id: "5.5", text: "Roles and responsibilities defined?" },
      { id: "5.6", text: "Management review meetings conducted?" }
    ]
  },
  {
    group: "CLAUSE 6 – PLANNING",
    items: [
      { id: "6.1", text: "Risks and opportunities identified?" },
      { id: "6.2", text: "Risk assessment documented?" },
      { id: "6.3", text: "Quality objectives established?" },
      { id: "6.4", text: "Quality objectives measurable?" },
      { id: "6.5", text: "Quality improvement plan available?" },
      { id: "6.6", text: "Planning of operational changes controlled?" }
    ]
  },
  {
    group: "CLAUSE 7 – SUPPORT",
    items: [
      { id: "7.1.1", text: "Machines adequate for production?" },
      { id: "7.1.2", text: "Inspection tools available?" },
      { id: "7.1.3", text: "Work environment controlled?" },
      { id: "7.1.4", text: "Maintenance schedule followed?" },
      { id: "7.2.1", text: "Operator skill matrix available?" },
      { id: "7.2.2", text: "Operator training records maintained?" },
      { id: "7.2.3", text: "QC inspector training completed?" },
      { id: "7.3.1", text: "Workers aware of quality policy?" },
      { id: "7.3.2", text: "Workers aware of quality objectives?" },
      { id: "7.4.1", text: "Internal quality communication system available?" },
      { id: "7.4.2", text: "Buyer communication process defined?" },
      { id: "7.5.1", text: "SOP available at workstation?" },
      { id: "7.5.2", text: "Work instructions available?" },
      { id: "7.5.3", text: "Document revision control implemented?" },
      { id: "7.5.4", text: "Obsolete documents removed?" }
    ]
  },
  {
    group: "CLAUSE 8 – OPERATION",
    items: [
      { id: "8.1.1", text: "Production planning documented?" },
      { id: "8.1.2", text: "Quality control plan available?" },
      { id: "8.1.3", text: "Process flow chart available?" },
      { id: "8.2.1", text: "Buyer requirements reviewed?" },
      { id: "8.2.2", text: "Tech pack verified?" },
      { id: "8.2.3", text: "Sample approval documented?" },
      { id: "8.3.1", text: "Sample development controlled?" },
      { id: "8.3.2", text: "Design review conducted?" },
      { id: "8.4.1", text: "Supplier evaluation system implemented?" },
      { id: "8.4.2", text: "Supplier audit records maintained?" },
      { id: "8.4.3", text: "Fabric inspection conducted?" },
      { id: "8.4.4", text: "Trims inspection conducted?" },
      { id: "8.5.1", text: "Production SOP followed?" },
      { id: "8.5.2", text: "Operation bulletin available?" },
      { id: "8.5.3", text: "Line layout approved?" },
      { id: "8.5.4", text: "Inline QC inspection conducted?" },
      { id: "8.5.5", text: "Endline inspection conducted?" },
      { id: "8.5.6", text: "Final inspection conducted?" },
      { id: "8.6.1", text: "Final inspection report approved?" },
      { id: "8.6.2", text: "AQL inspection performed?" },
      { id: "8.6.3", text: "Shipment approval documented?" },
      { id: "8.7.1", text: "Defect segregation system available?" },
      { id: "8.7.2", text: "Reject area identified?" },
      { id: "8.7.3", text: "Rework procedure defined?" },
      { id: "8.7.4", text: "Nonconformity records maintained?" }
    ]
  },
  {
    group: "CLAUSE 9 – PERFORMANCE EVALUATION",
    items: [
      { id: "9.1.1", text: "DHU monitored?" },
      { id: "9.1.2", text: "RFT monitored?" },
      { id: "9.1.3", text: "Defect trend analysis conducted?" },
      { id: "9.1.4", text: "Quality KPI monitored?" },
      { id: "9.2.1", text: "Internal audit schedule available?" },
      { id: "9.2.2", text: "Audit checklist prepared?" },
      { id: "9.2.3", text: "Audit findings recorded?" },
      { id: "9.2.4", text: "Audit reports maintained?" },
      { id: "9.3.1", text: "Management review meetings conducted?" },
      { id: "9.3.2", text: "Review minutes recorded?" },
      { id: "9.3.3", text: "Improvement actions tracked?" }
    ]
  },
  {
    group: "CLAUSE 10 – IMPROVEMENT",
    items: [
      { id: "10.1.1", text: "Quality improvement plan implemented?" },
      { id: "10.1.2", text: "Process improvement activities conducted?" },
      { id: "10.2.1", text: "CAPA system implemented?" },
      { id: "10.2.2", text: "Root cause analysis performed?" },
      { id: "10.2.3", text: "Corrective action verified?" },
      { id: "10.3.1", text: "Quality performance improvement monitored?" },
      { id: "10.3.2", text: "Preventive action system implemented?" }
    ]
  },
  {
    group: "GARMENTS SPECIFIC QUALITY AUDIT",
    items: [
      { id: "GS-1", text: "Fabric inspection records available?" },
      { id: "GS-2", text: "Cutting quality inspection performed?" },
      { id: "GS-3", text: "Inline sewing inspection conducted?" },
      { id: "GS-4", text: "End line inspection conducted?" },
      { id: "GS-5", text: "Final inspection conducted?" },
      { id: "GS-6", text: "Packing quality inspection performed?" },
      { id: "GS-8", text: "Calibration records maintained?" },
      { id: "GS-9", text: "Testing reports available?" },
      { id: "GS-10", text: "Buyer compliance requirements followed?" }
    ]
  }
];

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

const ClauseItem = memo(({ item, answer, isReadOnly, onUpdate, onImageUpload, onRemoveImage, onNavigate, auditId, department, auditor }: any) => {
  return (
    <motion.div 
      className={`p-6 rounded-2xl border transition-all duration-300 ${
        answer.result === 'Non Conformity' ? 'bg-rose-500/5 border-rose-500/20' : 
        answer.result === 'Observation' ? 'bg-amber-500/5 border-amber-500/20' : 
        answer.evidence ? 'bg-bg-1 border-border-main' : 'bg-bg-2/30 border-border-main opacity-60'
      }`}
      whileHover={{ scale: 1.002 }}
    >
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-black font-mono shadow-sm border ${
              answer.result === 'Non Conformity' ? 'bg-rose-500 text-white border-transparent' : 
              answer.result === 'Observation' ? 'bg-amber-500 text-white border-transparent' : 
              'bg-bg-1 border-border-main text-text-3'
            }`}>
              {item.id}
            </span>
            <div>
              <p className="text-sm font-bold text-text-1 leading-snug">{item.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  answer.result === 'Compliant' ? 'bg-green-500/10 text-green-500' :
                  answer.result === 'Non Conformity' ? 'bg-rose-500/10 text-rose-500' :
                  answer.result === 'Observation' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-bg-2 text-text-3'
                }`}>
                  {answer.result}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <FileText className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
              <input 
                placeholder="Detailed Findings / Objective Evidence..." 
                className="w-full bg-bg-2 border border-border-main rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-text-3" 
                value={answer.evidence || ''}
                readOnly={isReadOnly}
                onChange={(e) => onUpdate(item.id, 'evidence', e.target.value)}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <input 
                type="file" 
                id={`file-${item.id}`}
                className="hidden" 
                accept="image/*"
                onChange={(e) => onImageUpload(item.id, e)}
                disabled={isReadOnly}
              />
              <label 
                htmlFor={`file-${item.id}`}
                className={`w-12 h-12 rounded-xl border border-border-main flex items-center justify-center transition-all cursor-pointer ${
                  isReadOnly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/10 hover:border-accent text-text-3 hover:text-accent'
                }`}
                title="Upload Image Evidence"
              >
                <Camera className="w-5 h-5" />
              </label>

              {answer.result === 'Non Conformity' && (
                <button 
                  className="w-12 h-12 rounded-xl bg-purple-main text-white flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg shadow-purple-main/20" 
                  title="Raise CAPA for this NC"
                  onClick={() => onNavigate('capa-form', { 
                    mode: 'create', 
                    auditData: { 
                      auditId, 
                      nc: `[${item.id}] ${answer.evidence || item.text}`,
                      department,
                      auditor
                    } 
                  })}
                >
                  <ShieldCheck className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Image Previews */}
          {(answer.attachments && answer.attachments.length > 0) && (
            <div className="mt-4">
              <AttachmentList 
                attachments={answer.attachments}
                onRemove={!isReadOnly ? (idx: number) => onRemoveImage(item.id, idx) : undefined}
              />
            </div>
          )}
        </div>

        <div className="xl:w-48 flex flex-col gap-2">
          <label className="text-[10px] font-black text-text-3 uppercase tracking-widest text-center mb-1">Disposition</label>
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
            {[
              { label: 'Compliant', val: 'Compliant', color: 'bg-green-500' },
              { label: 'Non-Conform', val: 'Non Conformity', color: 'bg-rose-500' },
              { label: 'Observation', val: 'Observation', color: 'bg-amber-500' },
              { label: 'Not Appl.', val: 'N/A', color: 'bg-text-3' }
            ].map(opt => (
              <button
                key={opt.val}
                disabled={isReadOnly}
                onClick={() => onUpdate(item.id, 'result', opt.val)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center border-2 ${
                  answer.result === opt.val 
                    ? `${opt.color} text-white border-transparent shadow-lg shadow-${opt.color.split('-')[1]}-500/20` 
                    : 'bg-bg-2 text-text-3 border-border-main hover:border-accent/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ClauseItem.displayName = 'ClauseItem';

interface AuditFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function AuditForm({ params, onNavigate }: AuditFormProps) {
  const { mode, data } = params;
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState<any>(data || {
    auditId: `AUD-${Math.floor(Math.random() * 10000)}`,
    auditType: 'Internal Audit',
    externalCompany: '',
    department: '',
    auditees: [],
    result: 'Compliant',
    auditorName: '',
    auditDate: new Date().toISOString().split('T')[0],
    status: 'Open',
    score: 0,
    nonConformitySummary: '',
    checklist: {}
  });

  const [allAnswers, setAllAnswers] = useState<Record<string, { result: string, evidence: string, attachments: string[] }>>(formData.checklist || {});
  const [selectedClauseGroup, setSelectedClauseGroup] = useState<string>('All');

  const handleSave = async () => {
    if (!formData.department || !formData.auditorName) {
      alert('Department and Auditor Name are required.');
      return;
    }

    const { getTable } = await import('../db/db');
    const dbTable = getTable('audits' as any);

    const newAudit = {
      ...formData,
      id: mode === 'edit' && data ? data.id : `aud-${Date.now()}`,
      checklist: formData.auditType === 'Internal Audit' ? allAnswers : undefined,
      updatedAt: new Date().toISOString()
    };

    try {
      if (mode === 'edit' && data) {
        await dbTable.put(newAudit);
      } else {
        await dbTable.add({ ...newAudit, createdAt: new Date().toISOString() });
      }
      onNavigate('audit');
    } catch (err) {
      console.error(err);
      alert('Failed to save audit record.');
    }
  };

  const updateAnswer = useCallback((id: string, field: string, value: any) => {
    if (isReadOnly) return;
    setAllAnswers(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { result: 'Compliant', evidence: '', attachments: [] }),
        [field]: value
      }
    }));
  }, [isReadOnly]);

  const handleImageUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
        const currentAttachments = allAnswers[itemId]?.attachments || [];
        updateAnswer(itemId, 'attachments', [...currentAttachments, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (itemId: string, index: number) => {
    if (isReadOnly) return;
    const currentAttachments = allAnswers[itemId]?.attachments || [];
    const newAttachments = currentAttachments.filter((_, i) => i !== index);
    updateAnswer(itemId, 'attachments', newAttachments);
  };

  const totalItems = AUDIT_CLAUSES.reduce((acc, group) => acc + group.items.length, 0);
  const completedItems = Object.keys(allAnswers).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-0"
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm" onClick={() => onNavigate('audit')}>
            <ChevronLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'Audit Initiation' : mode === 'edit' ? 'Audit Modification' : 'Audit Intelligence'}
              <span className="text-[10px] font-black bg-accent text-white px-2.5 py-0.5 rounded-full ml-2">ISO 9001:2015</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.auditId}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">{formData.auditType}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Progress (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 pr-6 border-r border-border-main">
            <div className="text-right">
              <p className="text-[10px] font-black text-text-3 uppercase tracking-widest leading-none mb-1.5">Compliance Progress</p>
              <p className="text-sm font-bold text-text-1 leading-none">{progressPercent}% Analyzed</p>
            </div>
            <div className="relative w-11 h-11">
              <svg className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="20" fill="none" stroke="var(--bg-2)" strokeWidth="4" />
                <circle cx="22" cy="22" r="20" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray={126} strokeDashoffset={126 - (126 * progressPercent) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-accent">
                {completedItems}
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-auto md:ml-0">
            {!isReadOnly && (
              <button 
                className="btn btn-primary shadow-lg shadow-accent/20 flex items-center gap-2 px-8 h-11" 
                onClick={handleSave}
              >
                <Save className="w-4 h-4" /> Save Audit
              </button>
            )}
            <button className="btn btn-ghost border border-border-main h-11 px-4 hover:bg-rose-500/10 hover:text-rose-500 transition-all" onClick={() => onNavigate('audit')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* ── Left Column: Config ── */}
          <div className="xl:col-span-4 space-y-8">
            {/* View Mode Summary Cards */}
            {isReadOnly && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg-1 p-5 rounded-2xl border border-border-main shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${formData.result === 'Compliant' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-3 uppercase">General Outcome</p>
                    <p className="text-sm font-bold text-text-1">{formData.result}</p>
                  </div>
                </div>
                <div className="bg-bg-1 p-5 rounded-2xl border border-border-main shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-3 uppercase">Total Score</p>
                    <p className="text-sm font-bold text-text-1">{formData.score}%</p>
                  </div>
                </div>
              </div>
            )}

            <Section title="Framework Configuration" icon={Building} number="01">
              <Field label="Audit Scope / Type" icon={LayoutGrid} required>
                <select 
                  className={inputClass} 
                  value={formData.auditType} 
                  disabled={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                >
                  <option value="Internal Audit">Internal Audit</option>
                  <option value="External Audit">External Audit</option>
                  <option value="Buyer Audit">Buyer Audit</option>
                  <option value="Compliance Audit">Compliance Audit</option>
                </select>
              </Field>

              <Field label="Departmental Unit" icon={Building} required>
                <input 
                  className={inputClass} 
                  value={formData.department} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                  placeholder="e.g. Sewing Line 04"
                />
              </Field>

              <Field label="Authorized Auditor" icon={User} required>
                <input 
                  className={inputClass} 
                  value={formData.auditorName} 
                  readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })} 
                />
              </Field>

              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <Field label="Evaluation Date" icon={FileText} required>
                  <input 
                    type="date" 
                    className={inputClass} 
                    value={formData.auditDate} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })} 
                  />
                </Field>
                <Field label="Record Status" icon={ShieldCheck} required>
                  <select 
                    className={inputClass} 
                    value={formData.status} 
                    disabled={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </Field>
              </div>
            </Section>

            <Section title="Executive Summary" icon={Award} number="02">
              <Field label="General Conclusion" icon={CheckCircle2} span2>
                <select 
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-black transition-all outline-none ${
                      formData.result === 'Compliant' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                      formData.result === 'Non Conformity' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`} 
                  value={formData.result} 
                  disabled={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                >
                  <option value="Compliant">Compliant / Pass</option>
                  <option value="Non Conformity">Non Conformity (NC)</option>
                  <option value="Observation">Observation Found</option>
                </select>
              </Field>

              <div className="md:col-span-2 space-y-1.5">
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-[10px] font-black text-text-3 uppercase tracking-widest">Quality Score</label>
                  <span className="text-2xl font-black text-text-1">{formData.score || '0'}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  className="w-full h-2 bg-bg-2 rounded-lg appearance-none cursor-pointer accent-accent"
                  value={formData.score} 
                  disabled={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })} 
                />
              </div>

              <Field label="Non-Conformity Analysis" icon={AlertTriangle} span2>
                <div className="relative group">
                  <textarea 
                    className={`${inputClass} min-h-[160px] resize-none ${formData.nonConformitySummary ? 'bg-rose-500/5' : ''}`}
                    value={formData.nonConformitySummary} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, nonConformitySummary: e.target.value })}
                    placeholder="Summarize key non-conformities found..."
                  />
                  {!isReadOnly && formData.nonConformitySummary && (
                    <button 
                      type="button"
                      className="absolute bottom-4 right-4 text-[10px] font-black uppercase bg-purple-main text-white flex items-center gap-2 hover:bg-purple-600 px-3 py-1.5 rounded-lg shadow-lg transition-all"
                      onClick={() => onNavigate('capa-form', { 
                        mode: 'create', 
                        auditData: { 
                          auditId: formData.auditId, 
                          nc: formData.nonConformitySummary,
                          department: formData.department,
                          auditor: formData.auditorName
                        } 
                      })}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Direct CAPA
                    </button>
                  )}
                </div>
              </Field>
            </Section>
          </div>

          {/* ── Right Column: Checklist ── */}
          <div className="xl:col-span-8">
            {formData.auditType === 'Internal Audit' ? (
              <div className="bg-bg-1 rounded-3xl border border-border-main shadow-sm overflow-hidden flex flex-col min-h-[900px]">
                {/* Toolbar */}
                <div className="p-6 bg-bg-2/30 border-b border-border-main flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-1 border border-border-main text-accent flex items-center justify-center shadow-sm">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-text-1 uppercase tracking-tight">Clause Intelligence</h3>
                      <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest mt-0.5">ISO 9001:2015 Audit Methodology</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
                      <select 
                        className="w-full md:w-80 bg-bg-1 border border-border-main rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm" 
                        value={selectedClauseGroup}
                        onChange={(e) => setSelectedClauseGroup(e.target.value)}
                      >
                        <option value="All">All QMS Clauses</option>
                        {AUDIT_CLAUSES.map(g => <option key={g.group} value={g.group}>{g.group}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 md:p-8 space-y-12 overflow-y-auto max-h-[1200px] custom-scrollbar">
                  {AUDIT_CLAUSES.filter(g => selectedClauseGroup === 'All' || g.group === selectedClauseGroup).map((group, groupIdx) => (
                    <div key={group.group} className="space-y-6">
                      <div className="flex items-center gap-4 px-2">
                        <div className="text-3xl font-black text-text-3/10 font-mono leading-none tracking-tighter">
                          {String(groupIdx + 1).padStart(2, '0')}
                        </div>
                        <h4 className="text-[11px] font-black text-text-3 uppercase tracking-[0.2em]">{group.group}</h4>
                        <div className="h-px bg-border-main flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {group.items.map(item => (
                          <ClauseItem 
                            key={item.id}
                            item={item}
                            answer={allAnswers[item.id] || { result: 'Compliant', evidence: '', attachments: [] }}
                            isReadOnly={isReadOnly}
                            onUpdate={updateAnswer}
                            onImageUpload={handleImageUpload}
                            onRemoveImage={removeImage}
                            onNavigate={onNavigate}
                            auditId={formData.auditId}
                            department={formData.department}
                            auditor={formData.auditorName}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-bg-1 rounded-3xl border border-dashed border-border-main p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-bg-2 flex items-center justify-center text-text-3/20 border-4 border-bg-2">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl font-black text-text-1 uppercase tracking-tight">Structured Checklist Disabled</h3>
                  <p className="text-sm text-text-3 mt-2 leading-relaxed">
                    For External or Third-Party audits, please use the <b>NC Summary</b> and <b>Evidence Attachments</b> features to record high-level results and findings.
                  </p>
                </div>
                <button 
                  className="btn btn-ghost text-accent font-black text-xs uppercase border border-accent/20 hover:bg-accent/10 px-8 py-3 rounded-xl transition-all"
                  onClick={() => setFormData({ ...formData, auditType: 'Internal Audit' })}
                >
                  Force Activate Internal Methodology
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
