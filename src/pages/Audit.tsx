import React, { useState, useMemo } from 'react';
import { ExportModal } from '../components/ExportModal';
import { Pagination } from '../components/Pagination';
import { autoGenerateCAPA } from '../utils/capaUtils';

import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, AlertCircle, Clock, CheckCircle2, Plus, Download, 
  Database, Eye, Edit2, Trash2, FileText, X, Save, Filter, Calendar, 
  Building, User, Users, Award, Search, ChevronRight, ShieldCheck
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

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

interface AuditRecord {
  id: string;
  auditId: string;
  auditType: string;
  externalCompany?: string;
  department: string;
  auditees: string[];
  clauseNumber?: string;
  checklistQuestion?: string;
  result: string;
  evidence?: string;
  attachments?: string[];
  auditorName: string;
  auditDate: string;
  status: string;
  uid: string;
  score?: string;
  nonConformitySummary?: string;
  checklist?: Record<string, { result: string, evidence: string, attachments: string[] }>;
}

const MOCK_AUDITS: AuditRecord[] = [
  {
    id: '1',
    auditId: 'AUD-1001',
    auditType: 'Internal Audit',
    department: 'Quality Assurance',
    auditees: ['John Doe'],
    result: 'Compliant',
    auditorName: 'Admin',
    auditDate: '2024-03-25',
    status: 'Closed',
    uid: 'mock'
  },
  {
    id: '2',
    auditId: 'AUD-1002',
    auditType: 'Buyer Audit',
    department: 'Sewing',
    auditees: ['Rahim Ali'],
    result: 'Critical Non-Compliance',
    auditorName: 'H&M Team',
    auditDate: '2024-04-05',
    status: 'Opened CAPA',
    uid: 'mock'
  },
  {
    id: '3',
    auditId: 'AUD-1003',
    auditType: 'Social Compliance',
    department: 'HR & Safety',
    auditees: ['Selina Begum'],
    result: 'Compliant',
    auditorName: 'BSCI Auditor',
    auditDate: '2024-04-12',
    status: 'Closed',
    uid: 'mock'
  },
  {
    id: '4',
    auditId: 'AUD-1004',
    auditType: 'Environmental',
    department: 'Washing Plant',
    auditees: ['Sarah Chen'],
    result: 'Needs Improvement',
    auditorName: 'Hohenstein',
    auditDate: '2024-04-18',
    status: 'Under Review',
    uid: 'mock'
  }
];

interface AuditProps {
  onNavigate: (page: string, params?: any) => void;
}

export function Audit({ onNavigate }: AuditProps) {
  const [audits, setAudits] = useState<AuditRecord[]>(() => {
    const stored = localStorage.getItem('garmentqms_audits');
    return stored ? JSON.parse(stored) : MOCK_AUDITS;
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Panels
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derived Data
  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const matchesSearch = 
        a.auditId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.auditorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'All' || a.auditType === filterType;
      const matchesStatus = filterStatus === 'All' || a.status === filterStatus;
      const matchesDate = (!startDate || a.auditDate >= startDate) && (!endDate || a.auditDate <= endDate);

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [audits, searchQuery, filterType, filterStatus, startDate, endDate]);

  const paginatedAudits = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAudits.slice(startIndex, startIndex + pageSize);
  }, [filteredAudits, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAudits.length / pageSize);

  const stats = useMemo(() => {
    return {
      total: filteredAudits.length,
      compliant: filteredAudits.filter(a => ['Compliant', 'Pass'].includes(a.result)).length,
      nonConformant: filteredAudits.filter(a => ['Non Conformity', 'Fail'].includes(a.result)).length,
      open: filteredAudits.filter(a => ['Open', 'In Progress'].includes(a.status)).length
    };
  }, [filteredAudits]);

  // Navigation Actions
  const openCreate = () => onNavigate('audit-form', { mode: 'create' });
  const openView = (record: AuditRecord) => onNavigate('audit-form', { mode: 'view', data: record });
  const openEdit = (record: AuditRecord) => onNavigate('audit-form', { mode: 'edit', data: record });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this audit record?")) {
      const updated = audits.filter(a => a.id !== id);
      setAudits(updated);
      localStorage.setItem('garmentqms_audits', JSON.stringify(updated));
    }
  };

  const seedMockData = () => {
    const checklist: Record<string, { result: string, evidence: string, attachments: string[] }> = {};
    AUDIT_CLAUSES.forEach(group => {
      group.items.forEach(item => {
        checklist[item.id] = {
          result: Math.random() > 0.2 ? 'Conformity' : 'Non-Conformity',
          evidence: 'Verified during audit.',
          attachments: []
        };
      });
    });

    const mockAudit: AuditRecord = {
      id: Date.now().toString(),
      auditId: `AUD-${Date.now()}`,
      auditType: 'Internal Audit',
      department: 'Production',
      auditees: ['John Doe', 'Jane Smith'],
      result: 'Pass',
      auditorName: 'Alice Johnson',
      auditDate: new Date().toISOString().split('T')[0],
      status: 'Closed',
      uid: 'mock',
      nonConformitySummary: 'Minor issues found in documentation.',
      checklist: checklist
    };
    setAudits([mockAudit, ...audits]);
    setCurrentPage(1);
  };

  const downloadIndividualPDF = async (audit: AuditRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    const checklistRows: string[][] = [];
    if (audit.checklist) {
      AUDIT_CLAUSES.forEach(group => {
        group.items.forEach(item => {
          const entry = audit.checklist![item.id];
          if (entry) {
            checklistRows.push([
              item.id,
              item.text,
              entry.result,
              entry.evidence || '—',
              (entry.attachments && entry.attachments.length > 0) ? 'Yes' : 'No'
            ]);
          }
        });
      });
    }

    const attachments: { name: string; data: string }[] = [];
    if (audit.attachments) {
      audit.attachments.forEach((data, i) => attachments.push({ name: `Attachment ${i + 1}`, data }));
    }
    if (audit.checklist) {
      Object.entries(audit.checklist).forEach(([id, entry]) => {
        if (entry.attachments) {
          entry.attachments.forEach((data, i) => attachments.push({ name: `${id} attachment ${i+1}`, data }));
        }
      });
    }

    await exportDetailToPDF({
      moduleName: 'Audit Compliance Report',
      moduleId: 'audit',
      recordId: audit.auditId,
      fileName: `Audit_${audit.auditId}_Report`,
      layout: 'technical',
      fields: [
        { label: 'Audit Type',    value: audit.auditType },
        { label: 'Department',     value: audit.department },
        { label: 'Auditees',       value: audit.auditees.join(', ') },
        { label: 'Summary Result', value: audit.result },
        { label: 'Lead Auditor',   value: audit.auditorName },
        { label: 'Audit Date',     value: audit.auditDate },
        { label: 'Status',         value: audit.status },
      ],
      tables: checklistRows.length > 0 ? [{
        title: 'Audit Findings & Observations',
        columns: ['ID', 'Checkpoint', 'Finding', 'Evidence', 'Docs'],
        rows: checklistRows,
        columnStyles: {
          0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35, fontStyle: 'bold' },
          3: { cellWidth: 60 },
          4: { cellWidth: 15, halign: 'center' },
        }
      }] : [],
      attachments
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-accent" />
            Audit Management
          </h1>
          <p className="text-text-2 text-base mt-2">Manage ISO 9001:2015 & Garments Specific Quality Audits.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={seedMockData}>
            <Database className="w-4 h-4" /> Seed Data
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> New Audit
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Audits', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Compliant', value: stats.compliant, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Non-Conformities', value: stats.nonConformant, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Open / In Progress', value: stats.open, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search by ID, Dept, or Auditor..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="w-full md:w-36 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterType} onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}}>
            <option value="All">All Types</option>
            <option value="Internal Audit">Internal Audit</option>
            <option value="3rd Party Audit">3rd Party Audit</option>
            <option value="Buyer Audit">Buyer Audit</option>
          </select>
          <select className="w-full md:w-36 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}>
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="flex items-center gap-2 bg-bg-2 px-3 py-1.5 rounded-xl flex-1 md:flex-none">
            <Calendar className="w-4 h-4 text-text-2" />
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={startDate} onChange={(e) => {setStartDate(e.target.value); setCurrentPage(1);}} />
            <span className="text-text-2 text-sm px-1">-</span>
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={endDate} onChange={(e) => {setEndDate(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Audit ID</th>
                <th className="p-4">Type & Dept</th>
                <th className="p-4">Date</th>
                <th className="p-4">Result</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {paginatedAudits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-2">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="w-8 h-8 opacity-20" />
                      <p className="text-sm font-medium">No audit records found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedAudits.map(audit => (
                <tr 
                  key={audit.id} 
                  className="hover:bg-bg-2/60 transition-all duration-200 group relative" 
                >
                  <td className="p-4 pl-6 font-mono font-bold text-text-1 text-sm">{audit.auditId}</td>
                  <td className="p-4">
                    <div className="font-bold text-text-1 text-sm">{audit.auditType}</div>
                    <div className="text-[11px] text-text-2 font-medium mt-0.5 opacity-80 uppercase tracking-tight">{audit.department} {audit.externalCompany ? `• ${audit.externalCompany}` : ''}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-text-2">{audit.auditDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        ['Compliant', 'Pass'].includes(audit.result) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        ['Non Conformity', 'Fail'].includes(audit.result) ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {audit.result}
                      </span>
                      {audit.score && <span className="text-[10px] font-bold text-text-3">({audit.score}%)</span>}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                      audit.status === 'Closed' ? 'bg-bg-3 text-text-1 border-border-main' : 
                      audit.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2 transition-all cursor-pointer" 
                        title="View Details"
                        onClick={(e) => { e.stopPropagation(); openView(audit); }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2 transition-all cursor-pointer" 
                        title="Edit Audit"
                        onClick={(e) => { e.stopPropagation(); openEdit(audit); }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 text-text-2 transition-all cursor-pointer" 
                        title="Download PDF"
                        onClick={(e) => { e.stopPropagation(); downloadIndividualPDF(audit); }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {audit.result === 'Non Conformity' && (
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-purple-main/10 hover:text-purple-main text-text-2 transition-all cursor-pointer" 
                          title="Raise CAPA"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onNavigate('capa-form', { 
                              mode: 'create', 
                              auditData: { 
                                auditId: audit.id, 
                                nc: audit.nonConformitySummary || 'Non-conformity found during audit',
                                department: audit.department,
                                auditor: audit.auditorName
                              } 
                            }); 
                          }}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                      <div className="w-px h-4 bg-border-main mx-1" />
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2 transition-all cursor-pointer" 
                        title="Delete Audit"
                        onClick={(e) => { e.stopPropagation(); handleDelete(audit.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Placeholder for when not hovered to keep column width stable */}
                    <div className="w-8 h-8 flex items-center justify-center ml-auto group-hover:hidden">
                      <ChevronRight className="w-4 h-4 text-text-3 opacity-30" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          totalRecords={filteredAudits.length}
        />
      </motion.div>

      {/* Slide-over Panel */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredAudits}
        dateKey="auditDate"
        extraFilters={[
          {
            key: 'result',
            label: 'Filter by Result',
            options: [
              { label: 'Compliant', value: 'Compliant' },
              { label: 'Non Conformity', value: 'Non Conformity' },
              { label: 'Observation', value: 'Observation' },
              { label: 'Pass', value: 'Pass' },
              { label: 'Fail', value: 'Fail' },
              { label: 'Conditional Pass', value: 'Conditional Pass' }
            ]
          }
        ]}
        columns={[
          {key: 'auditId', label: 'Audit ID'},
          {key: 'auditType', label: 'Audit Type'},
          {key: 'externalCompany', label: 'External Company'},
          {key: 'department', label: 'Department'},
          {key: 'nonConformitySummary', label: 'Non Conformity Summary'},
          {key: 'result', label: 'Result'},
          {key: 'score', label: 'Score'},
          {key: 'auditorName', label: 'Auditor'},
          {key: 'auditDate', label: 'Date'},
          {key: 'status', label: 'Status'}
        ]}
        title="Audit Report"
      />
    </motion.div>
  );
}

