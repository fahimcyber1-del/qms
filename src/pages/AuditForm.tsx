import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X, Plus, Trash2, FileText, AlertCircle, Save, Building, User, Users, Award, ClipboardCheck, ShieldCheck, Filter, Camera, Image } from 'lucide-react';

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

interface AuditFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function AuditForm({ params, onNavigate }: AuditFormProps) {
  const { mode, data } = params;
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
    score: '',
    nonConformitySummary: '',
    checklist: {}
  });

  const [allAnswers, setAllAnswers] = useState<Record<string, { result: string, evidence: string, attachments: string[] }>>(formData.checklist || {});
  const [selectedClauseGroup, setSelectedClauseGroup] = useState<string>('All');

  const handleSave = () => {
    if (!formData.department || !formData.auditorName) {
      alert('Department and Auditor Name are required.');
      return;
    }

    const stored = localStorage.getItem('garmentqms_audits');
    let audits = stored ? JSON.parse(stored) : [];

    const newAudit = {
      ...formData,
      id: mode === 'edit' && data ? data.id : Date.now().toString(),
      checklist: formData.auditType === 'Internal Audit' ? allAnswers : undefined,
      updatedAt: new Date().toISOString()
    };

    if (mode === 'edit' && data) {
      audits = audits.map((a: any) => a.id === data.id ? newAudit : a);
    } else {
      audits = [newAudit, ...audits];
    }

    localStorage.setItem('garmentqms_audits', JSON.stringify(audits));
    onNavigate('audit');
  };

  const isReadOnly = mode === 'view';

  const updateAnswer = (id: string, field: string, value: any) => {
    if (isReadOnly) return;
    setAllAnswers(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { result: 'Compliant', evidence: '', attachments: [] }),
        [field]: value
      }
    }));
  };
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-2"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={() => onNavigate('audit')}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'Audit Initiation' : mode === 'edit' ? 'Audit Modification' : 'Audit Intelligence'}
              <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full ml-2">ISO 9001:2015</span>
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter">{formData.auditId}</span>
              <span className="text-[10px] text-gray-300">•</span>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{formData.auditType}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Progress Circle (Desktop) */}
          <div className="hidden md:flex items-center gap-3 pr-6 border-r border-gray-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Checklist Progress</p>
              <p className="text-sm font-bold text-gray-900 leading-none">{progressPercent}% Completed</p>
            </div>
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <circle cx="20" cy="20" r="18" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray={113} strokeDashoffset={113 - (113 * progressPercent) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-600">
                {completedItems}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {!isReadOnly && (
              <button 
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-200/50 flex items-center gap-2 px-6 h-11" 
                onClick={handleSave}
              >
                <Save className="w-4 h-4" /> Save Record
              </button>
            )}
            <button className="btn btn-ghost h-11 px-4 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => onNavigate('audit')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Metadata & Summary (xl:col-span-4) */}
          <div className="xl:col-span-4 space-y-8">
            {/* Core Info */}
            <div className="bg-white rounded-2xl border border-border-main p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Audit Framework</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Scope / Type</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
                    value={formData.auditType} 
                    disabled={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, auditType: e.target.value })}
                  >
                    <option value="Internal Audit">Internal Audit</option>
                    <option value="External Audit">External Audit</option>
                    <option value="Buyer Audit">Buyer Audit</option>
                    <option value="Compliance Audit">Compliance Audit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departmental Unit</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    value={formData.department} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                    placeholder="e.g. Sewing Line 04"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Auditor</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      value={formData.auditorName} 
                      readOnly={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evaluation Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      value={formData.auditDate} 
                      readOnly={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Record Status</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
                      value={formData.status} 
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-2xl border border-border-main p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Executive Summary</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">General Conclusion</label>
                  <select 
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-black transition-all outline-none ${
                        formData.result === 'Compliant' ? 'bg-green-50 border-green-200 text-green-700' : 
                        formData.result === 'Non Conformity' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`} 
                    value={formData.result} 
                    disabled={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  >
                    <option value="Compliant">Compliant / Pass</option>
                    <option value="Non Conformity">Non Conformity (NC)</option>
                    <option value="Observation">Observation Found</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quality Score</label>
                    <span className="text-xl font-black text-gray-900">{formData.score || '0'}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={formData.score} 
                    disabled={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })} 
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Non-Conformity Analysis</label>
                    {formData.nonConformitySummary && (
                      <button 
                        className="text-[10px] font-black uppercase text-purple-600 flex items-center gap-1.5 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors border border-purple-100"
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
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[120px] resize-none" 
                    value={formData.nonConformitySummary} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, nonConformitySummary: e.target.value })}
                    placeholder="Summarize the key non-conformities found during this session..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Checklist (xl:col-span-8) */}
          <div className="xl:col-span-8 space-y-6">
            {formData.auditType === 'Internal Audit' ? (
              <div className="bg-white rounded-2xl border border-border-main shadow-sm overflow-hidden flex flex-col h-full min-h-[800px]">
                {/* Checklist Toolbar */}
                <div className="p-6 bg-gray-50/50 border-b border-border-main flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center shadow-sm">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Clause Intelligence</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Standard Operating Procedures Checklist</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        className="w-full md:w-72 bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                        value={selectedClauseGroup}
                        onChange={(e) => setSelectedClauseGroup(e.target.value)}
                      >
                        <option value="All">All QMS Clauses</option>
                        {AUDIT_CLAUSES.map(g => <option key={g.group} value={g.group}>{g.group}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar">
                  {AUDIT_CLAUSES.filter(g => selectedClauseGroup === 'All' || g.group === selectedClauseGroup).map((group, groupIdx) => (
                    <div key={group.group} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-gray-100 font-mono leading-none tracking-tighter">0{groupIdx + 4}</div>
                        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex-1">{group.group}</h4>
                        <div className="h-px bg-gray-100 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {group.items.map(item => {
                          const answer = allAnswers[item.id] || { result: 'Compliant', evidence: '' };
                          return (
                            <motion.div 
                              key={item.id} 
                              className={`p-6 rounded-2xl border transition-all duration-300 ${
                                answer.result === 'Non Conformity' ? 'bg-red-50/30 border-red-100' : 
                                answer.result === 'Observation' ? 'bg-amber-50/30 border-amber-100' : 
                                answer.evidence ? 'bg-white border-gray-200' : 'bg-gray-50/50 border-gray-100 opacity-60'
                              }`}
                              whileHover={{ scale: 1.005 }}
                            >
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shadow-sm ${
                                      answer.result === 'Non Conformity' ? 'bg-red-500 text-white' : 
                                      answer.result === 'Observation' ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-400'
                                    }`}>
                                      {item.id}
                                    </span>
                                    <p className="text-sm font-black text-gray-800 leading-tight">{item.text}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 mt-4">
                                    <div className="relative flex-1">
                                      <FileText className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                      <input 
                                        placeholder="Detailed Findings / Objective Evidence..." 
                                        className="w-full bg-white/60 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300 placeholder:italic" 
                                        value={answer.evidence}
                                        readOnly={isReadOnly}
                                        onChange={(e) => updateAnswer(item.id, 'evidence', e.target.value)}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <input 
                                        type="file" 
                                        id={`file-${item.id}`}
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(item.id, e)}
                                        disabled={isReadOnly}
                                      />
                                      <label 
                                        htmlFor={`file-${item.id}`}
                                        className={`w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center transition-all cursor-pointer ${
                                          isReadOnly ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-200 text-gray-400 hover:text-blue-600'
                                        }`}
                                        title="Upload Image Evidence"
                                      >
                                        <Camera className="w-5 h-5" />
                                      </label>

                                      {answer.result === 'Non Conformity' && (
                                        <button 
                                          className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-all shadow-lg shadow-purple-200" 
                                          title="Raise CAPA for this NC"
                                          onClick={() => onNavigate('capa-form', { 
                                            mode: 'create', 
                                            auditData: { 
                                              auditId: formData.auditId, 
                                              nc: `[${item.id}] ${answer.evidence || item.text}`,
                                              department: formData.department,
                                              auditor: formData.auditorName
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
                                    <div className="mt-4 flex flex-wrap gap-3">
                                      {answer.attachments.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group">
                                          <div className="w-24 h-24 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                                            <img 
                                              src={img} 
                                              alt={`Evidence ${idx + 1}`} 
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          {!isReadOnly && (
                                            <button 
                                              onClick={() => removeImage(item.id, idx)}
                                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="md:w-40 flex flex-col gap-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Conformity</label>
                                  <div className="grid grid-cols-1 gap-2">
                                    {[
                                      { label: 'Compliant', val: 'Compliant', color: 'bg-green-500' },
                                      { label: 'NC', val: 'Non Conformity', color: 'bg-red-500' },
                                      { label: 'Obs.', val: 'Observation', color: 'bg-amber-500' },
                                      { label: 'N/A', val: 'N/A', color: 'bg-gray-400' }
                                    ].map(opt => (
                                      <button
                                        key={opt.val}
                                        disabled={isReadOnly}
                                        onClick={() => updateAnswer(item.id, 'result', opt.val)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center border-2 ${
                                          answer.result === opt.val 
                                            ? `${opt.color} text-white border-transparent shadow-md` 
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
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
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Structured Checklist Disabled</h3>
                  <p className="text-sm text-gray-500">For External or Third-Party audits, please use the NC Summary and Attachment features to record results.</p>
                </div>
                <button 
                  className="btn btn-ghost text-blue-600 font-black text-xs uppercase"
                  onClick={() => setFormData({ ...formData, auditType: 'Internal Audit' })}
                >
                  Switch to Internal Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
