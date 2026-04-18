import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, TrendingUp, Plus, Edit2, 
  Trash2, Eye, Search, FileDown, ChevronLeft, 
  MessageSquare, User, Calendar, Clock, Download, FileSpreadsheet, Send, Save
} from 'lucide-react';
import * as XLSX from 'xlsx';

// ── Types ──
export type RiskCategory = 'Product' | 'Process' | 'Critical Process';
export type RiskStatus = 'Open' | 'Pending' | 'Closed';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskComment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface RiskManagementRecord {
  id: number;
  code: string;
  title: string;
  category: RiskCategory;
  severity: number; // 1-5
  likelihood: number; // 1-5
  score: number; // severity * likelihood
  level: RiskLevel;
  department: string;
  identifiedDate: string;
  targetDate: string;
  responsiblePerson: string;
  existingControls: string;
  mitigationPlan: string;
  status: RiskStatus;
  comments: RiskComment[];
  attachments: { name: string, data: string }[];
}

// ── Default Data ──
const DEFAULT_RECORDS: RiskManagementRecord[] = [
  {
    id: 1, code: 'RM-001', title: 'Fabric Color Bleeding during Wash', category: 'Product',
    severity: 4, likelihood: 3, score: 12, level: 'High', department: 'Washing',
    identifiedDate: '2026-03-10', targetDate: '2026-03-25', responsiblePerson: 'Mr. Rafiq (Wash Manager)',
    existingControls: 'Random sample wash test', mitigationPlan: '100% lab dip approval and mandatory bulk wash test before cutting approval.',
    status: 'Open', comments: [{ id: 'c1', user: 'Admin', text: 'Supplier notified about fastness issue.', date: '2026-03-11T10:00' }]
  },
  {
    id: 2, code: 'RM-002', title: 'Needle Breakage causing Metal Contamination', category: 'Critical Process',
    severity: 5, likelihood: 2, score: 10, level: 'Medium', department: 'Sewing',
    identifiedDate: '2026-03-15', targetDate: '2026-03-20', responsiblePerson: 'Ms. Salma (Line Sup)',
    existingControls: 'Metal detector at packing', mitigationPlan: 'Strict needle control policy: 1-to-1 broken needle exchange logged in ledger.',
    status: 'Pending', comments: []
  },
  {
    id: 3, code: 'RM-003', title: 'Delayed Trim Sourcing', category: 'Process',
    severity: 3, likelihood: 4, score: 12, level: 'High', department: 'Supply Chain',
    identifiedDate: '2026-01-05', targetDate: '2026-01-25', responsiblePerson: 'Mr. Tariq (Procurement)',
    existingControls: 'Follow-ups via email', mitigationPlan: 'Engage alternative local trims supplier to act as a buffer.',
    status: 'Closed', comments: [{ id: 'c2', user: 'Director', text: 'Buffer stock established.', date: '2026-01-20T14:30' }]
  }
];

const STORAGE_KEY = 'garmentqms_risk_management_v2';

function loadRecords(): RiskManagementRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
  } catch { return DEFAULT_RECORDS; }
}

function saveRecords(data: RiskManagementRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateLevel(score: number): RiskLevel {
  if (score >= 15) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  'Critical': 'bg-pink-100 text-pink-700 border-pink-200',
  'High': 'bg-red-50 text-red-700 border-red-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_COLORS: Record<RiskStatus, string> = {
  'Open': 'bg-red-50 text-red-700 border-red-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Closed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const CATEGORY_COLORS: Record<RiskCategory, string> = {
  'Product': 'text-blue-600 bg-blue-50 border-blue-200',
  'Process': 'text-purple-600 bg-purple-50 border-purple-200',
  'Critical Process': 'text-rose-600 bg-rose-50 border-rose-200',
};

// ── Main Component ──
export function RiskManagementPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<RiskManagementRecord[]>([]);
  const [mode, setMode] = useState<'list' | 'view' | 'form'>('list');
  const [selectedRecord, setSelectedRecord] = useState<RiskManagementRecord | null>(null);
  
  // States for list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // State for form
  const [formData, setFormData] = useState<Partial<RiskManagementRecord>>({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => { setRecords(loadRecords()); }, []);

  // Filtered & Search
  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === 'All' || r.category === filterCategory;
      const matchStat = filterStatus === 'All' || r.status === filterStatus;
      return matchSearch && matchCat && matchStat;
    });
  }, [records, searchTerm, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      critical: records.filter(r => r.level === 'Critical').length,
      high: records.filter(r => r.level === 'High').length,
      closed: records.filter(r => r.status === 'Closed').length
    };
  }, [records]);

  // Actions
  const handleAdd = () => {
    setFormData({
      code: `RM-${String(records.length + 1).padStart(3, '0')}`,
      title: '', category: 'Product', department: '', 
      severity: 1, likelihood: 1, score: 1, level: 'Low',
      identifiedDate: new Date().toISOString().split('T')[0], targetDate: '',
      responsiblePerson: '', existingControls: '', mitigationPlan: '',
      status: 'Open', comments: [], attachments: []
    });
    setMode('form');
  };

  const handleEdit = (r: RiskManagementRecord) => {
    setFormData({ ...r });
    setMode('form');
  };

  const handleView = (r: RiskManagementRecord) => {
    setSelectedRecord(r);
    setMode('view');
  };

  const handleDelete = (ids: number[]) => {
    if (!window.confirm(`Delete ${ids.length} record(s)?`)) return;
    const updated = records.filter(r => !ids.includes(r.id));
    setRecords(updated);
    saveRecords(updated);
    setSelectedIds([]);
    if (selectedRecord && ids.includes(selectedRecord.id)) {
      setMode('list');
      setSelectedRecord(null);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.department) {
      alert("Title and Department are required!");
      return;
    }
    
    let updated: RiskManagementRecord[];
    const score = (formData.severity || 1) * (formData.likelihood || 1);
    const level = calculateLevel(score);
    
    const finalData = { ...formData, score, level } as RiskManagementRecord;

    if (formData.id) {
      updated = records.map(r => r.id === formData.id ? finalData : r);
      if (selectedRecord?.id === formData.id) setSelectedRecord(finalData);
    } else {
      updated = [{ ...finalData, id: Date.now() }, ...records];
    }
    
    setRecords(updated);
    saveRecords(updated);
    if (mode === 'form') setMode('list');
  };

  // Status Toggles
  const handleStatusChange = (id: number, newStatus: RiskStatus) => {
    const updated = records.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRecords(updated);
    saveRecords(updated);
    if (selectedRecord?.id === id) setSelectedRecord({ ...selectedRecord, status: newStatus });
  };

  // Comments
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRecord) return;
    const comment: RiskComment = {
      id: Date.now().toString(),
      user: 'Current User', // Would come from auth
      text: newComment,
      date: new Date().toISOString()
    };
    const updated = records.map(r => r.id === selectedRecord.id ? { ...r, comments: [...r.comments, comment] } : r);
    setRecords(updated);
    saveRecords(updated);
    setSelectedRecord({ ...selectedRecord, comments: [...selectedRecord.comments, comment] });
    setNewComment('');
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
    
    setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAtts] }));
  };

  // Exports
  const handleExportExcel = () => {
    const dataToExport = (selectedIds.length > 0 ? records.filter(r => selectedIds.includes(r.id)) : filtered).map(r => ({
      Code: r.code,
      Title: r.title,
      Category: r.category,
      Department: r.department,
      Severity: r.severity,
      Likelihood: r.likelihood,
      Score: r.score,
      Level: r.level,
      Status: r.status,
      'Identified Date': r.identifiedDate,
      'Target Date': r.targetDate,
      'Responsible': r.responsiblePerson
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Risk Register");
    XLSX.writeFile(wb, "Risk_Management_Register.xlsx");
  };

  const handleExportPDF = async (record?: RiskManagementRecord) => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel, proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    if (record) {
      const doc = createDoc({ orientation: 'l', paperSize: 'a4' });
      let y = drawPdfHeader(doc, 'Risk Assessment Report', `Reference: ${record.code}`);

      y = drawInfoGrid(doc, y, [
        { label: 'Risk Code',        value: record.code },
        { label: 'Title / Hazard',   value: record.title },
        { label: 'Category',         value: record.category },
        { label: 'Department',       value: record.department },
        { label: 'Severity (1-5)',   value: String(record.severity) },
        { label: 'Likelihood (1-5)', value: String(record.likelihood) },
        { label: 'Risk Score',       value: String(record.score) },
        { label: 'Risk Level',       value: record.level },
        { label: 'Responsible',      value: record.responsiblePerson },
        { label: 'Identified Date',  value: record.identifiedDate },
        { label: 'Target Date',      value: record.targetDate || '—' },
        { label: 'Status',           value: record.status },
      ]);

      y = drawSectionLabel(doc, y, 'Risk Control & Mitigation');
      y = proTable(doc, y,
        [['Field', 'Details']],
        [
          ['Existing Preventive Controls', record.existingControls || '—'],
          ['Mitigation / Corrective Action Plan', record.mitigationPlan || '—'],
        ],
        { columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' } } }
      ) + 6;

      if (record.comments && record.comments.length > 0) {
        y = drawSectionLabel(doc, y, 'Activity Log');
        y = proTable(doc, y,
          [['Date', 'User', 'Comment']],
          record.comments.map(c => [
            new Date(c.date).toLocaleDateString('en-GB'),
            c.user, c.text
          ]),
          { columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 35 } } }
        ) + 6;
      }

      if (record.attachments && record.attachments.length > 0) {
        const { embedAttachments } = await import('../utils/pdfExport');
        const rawData = record.attachments.map(a => typeof a === 'string' ? a : a.data);
        await embedAttachments(doc, rawData, 'RISK MITIGATION EVIDENCE PHOTOS');
      }

      drawSignatureRow(doc, y, ['Risk Owner', 'QA Manager', 'Dept. Head', 'Authorized By']);
      addPageFooters(doc);
      doc.save(`${record.code}_Risk_Report.pdf`);

    } else {
      const dataToExport = selectedIds.length > 0 ? records.filter(r => selectedIds.includes(r.id)) : filtered;
      const doc = createDoc({ orientation: 'l', paperSize: 'a4' });
      let y = drawPdfHeader(doc, 'Risk Management Register', `${dataToExport.length} records`);

      y = drawSectionLabel(doc, y, 'Risk Register');
      y = proTable(doc, y,
        [['Code', 'Title', 'Category', 'Dept.', 'Severity', 'Likelihood', 'Score', 'Level', 'Status']],
        dataToExport.map(r => [
          r.code, r.title, r.category, r.department,
          String(r.severity), String(r.likelihood), String(r.score),
          r.level, r.status
        ]),
        {
          columnStyles: {
            0: { cellWidth: 22 },
            7: { halign: 'center', fontStyle: 'bold' },
            8: { halign: 'center', fontStyle: 'bold' },
          }
        }
      ) + 6;

      addPageFooters(doc);
      doc.save(`Risk_Register_Bulk.pdf`);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-text-2 mb-1.5 uppercase tracking-wide";

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // LIST MODE
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  if (mode === 'list') return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-accent" /> Risk Management
          </h1>
          <p className="text-text-3 text-sm mt-1">Hazard Identification & Mitigation Register</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors" onClick={() => handleDelete(selectedIds)}>
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}
          <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border-main text-text-2 rounded-xl text-sm font-medium hover:text-accent transition-colors shadow-sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border-main text-text-2 rounded-xl text-sm font-medium hover:text-accent transition-colors shadow-sm" onClick={() => handleExportPDF()}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={handleAdd}>
            <Plus className="w-4 h-4" /> Add Risk
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Risks', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Critical Risks', value: stats.critical, color: 'text-pink-500', bg: 'bg-pink-500/10' },
          { label: 'High Priority', value: stats.high, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Mitigated / Closed', value: stats.closed, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-bg-1 border border-border-main rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-text-3">{s.label}</p>
              <p className="text-2xl font-black text-text-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-1 border border-border-main p-4 rounded-2xl flex flex-wrap gap-4 shadow-sm items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search risks..." className={`${inputClass} pl-10`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className={inputClass + " w-auto min-w-[150px] font-bold"} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Product">Product Risk</option>
          <option value="Process">Process Risk</option>
          <option value="Critical Process">Critical Process</option>
        </select>
        <select className={inputClass + " w-auto min-w-[150px] font-bold"} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-2/50 text-[10px] uppercase tracking-widest text-text-3 font-bold border-b border-border-main">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="accent-accent w-4 h-4 rounded" 
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={e => setSelectedIds(e.target.checked ? filtered.map(r => r.id) : [])} 
                  />
                </th>
                <th className="p-4">Reference & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-3 font-medium">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No risks found matching criteria.
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className={`hover:bg-bg-2/30 transition-colors ${selectedIds.includes(r.id) ? 'bg-accent/5' : ''}`}>
                  <td className="p-4 text-center">
                    <input type="checkbox" className="accent-accent w-4 h-4 rounded" 
                      checked={selectedIds.includes(r.id)}
                      onChange={e => setSelectedIds(e.target.checked ? [...selectedIds, r.id] : selectedIds.filter(id => id !== r.id))}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-xs font-bold text-accent mb-0.5">{r.code}</div>
                    <div className="font-semibold text-text-1 text-sm">{r.title}</div>
                    <div className="text-[10px] text-text-3 uppercase tracking-wide mt-1">{r.department} â€¢ Ref: {r.identifiedDate}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${CATEGORY_COLORS[r.category]}`}>
                      {r.category}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className={`text-xl font-black ${
                        r.level === 'Critical' ? 'text-pink-600' :
                        r.level === 'High' ? 'text-red-600' :
                        r.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>{r.score}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded border ${LEVEL_COLORS[r.level]}`}>{r.level}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}
                      value={r.status}
                      onChange={e => handleStatusChange(r.id, e.target.value as RiskStatus)}
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-bg-2 text-text-3 hover:text-accent transition-colors" onClick={() => handleView(r)}><Eye className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-bg-2 text-text-3 hover:text-accent transition-colors" onClick={() => handleEdit(r)}><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-bg-2 text-text-3 hover:text-blue-500 transition-colors" onClick={() => handleExportPDF(r)}><FileDown className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // VIEW MODE
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  if (mode === 'view' && selectedRecord) return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-bg-1 border border-border-main p-4 md:px-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 bg-bg-2 rounded-xl border border-border-main hover:text-accent hover:border-accent/50 transition-colors" onClick={() => setMode('list')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-accent">{selectedRecord.code}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_COLORS[selectedRecord.category]}`}>{selectedRecord.category}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[selectedRecord.status]}`}>{selectedRecord.status}</span>
            </div>
            <h1 className="text-xl font-black text-text-1 tracking-tight">{selectedRecord.title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-1 border border-border-main text-text-2 rounded-xl text-sm font-medium hover:text-accent transition-colors" onClick={() => handleEdit(selectedRecord)}>
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={() => handleExportPDF(selectedRecord)}>
            <FileDown className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-bg-2/30 px-6 py-4 border-b border-border-main">
              <h3 className="font-bold text-text-1 text-sm flex items-center gap-2">
                 Risk Protocol Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Department</p><p className="text-sm font-medium mt-1 uppercase text-text-1">{selectedRecord.department}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Responsible</p><p className="text-sm font-medium mt-1 flex items-center gap-1.5"><User className="w-4 h-4 opacity-50 text-accent" /> {selectedRecord.responsiblePerson || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Identified Date</p><p className="text-sm font-medium mt-1 flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-50 text-accent" /> {selectedRecord.identifiedDate}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Target Date</p><p className="text-sm font-medium mt-1 flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-50 text-accent" /> {selectedRecord.targetDate || 'Not Set'}</p></div>
              
              <div className="col-span-4 mt-2 pt-6 border-t border-border-main">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-wide mb-3">Existing Preventive Controls</p>
                <div className="text-sm text-text-2 bg-bg-2/50 p-5 rounded-xl border border-border-main/50 leading-relaxed min-h-[80px]">
                  {selectedRecord.existingControls || <span className="opacity-50 italic">No existing controls documented.</span>}
                </div>
              </div>
              <div className="col-span-4">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-wide mb-3">Mitigation / Corrective Action Plan</p>
                <div className="text-sm text-text-1 bg-accent/5 border border-accent/20 p-5 rounded-xl leading-relaxed min-h-[80px]">
                  {selectedRecord.mitigationPlan || <span className="opacity-50 italic">No mitigation plan documented.</span>}
                </div>
              </div>

              <div className="col-span-4 mt-2 pt-6 border-t border-border-main">
                <p className="text-[10px] font-bold text-text-3 uppercase tracking-wide mb-3">Photographic Evidence</p>
                {!selectedRecord.attachments || selectedRecord.attachments.length === 0 ? (
                  <div className="text-xs text-text-3 italic opacity-50">No evidence photos attached.</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {selectedRecord.attachments.map((file, i) => (
                      <div key={i} className="aspect-square bg-bg-2 rounded-xl border border-border-main overflow-hidden group relative">
                        {file.data && file.data.startsWith('data:image') ? (
                          <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-accent"><Download className="w-6 h-6" /></div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] text-white truncate font-medium">{file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-border-main">
              <h3 className="font-bold text-text-1 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" /> Activity & Comments
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedRecord.comments.length === 0 ? (
                <div className="text-xs text-text-3 text-center py-8 bg-bg-2/30 rounded-xl border border-dashed border-border-main">
                  No activity logs attached to this risk protocol.
                </div>
              ) : selectedRecord.comments.map(c => (
                <div key={c.id} className="bg-bg-2 p-4 rounded-xl border border-border-main">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-text-1">{c.user}</span>
                    <span className="text-[10px] uppercase font-bold text-text-3">{new Date(c.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">{c.text}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-4 border-t border-border-main mt-4">
                <input className={inputClass} placeholder="Add a status update or comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                <button className="px-5 bg-accent text-white rounded-xl hover:opacity-90 flex items-center transition-colors shadow-sm" onClick={handleAddComment}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Risk Matrix Widget */}
        <div className="space-y-6">
          <div className={`p-8 rounded-2xl border ${LEVEL_COLORS[selectedRecord.level]} relative overflow-hidden shadow-sm`}>
            {/* Decal */}
            <TrendingUp className="w-32 h-32 absolute -right-6 -bottom-6 opacity-5 rotate-12" />
            
            <div className="relative z-10 text-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Calculated Risk Score</h3>
              <div className="text-7xl font-black tracking-tighter mb-1 relative inline-block">
                {selectedRecord.score}
              </div>
              <div className="text-sm font-black uppercase tracking-widest mb-8 border-b border-current/20 pb-4 inline-block px-4">Level: {selectedRecord.level}</div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Severity</div>
                  <div className="text-3xl font-black mt-1 text-center">{selectedRecord.severity}<span className="text-base opacity-40">/5</span></div>
                </div>
                <div className="bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Likelihood</div>
                  <div className="text-3xl font-black mt-1 text-center">{selectedRecord.likelihood}<span className="text-base opacity-40">/5</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm p-6">
            <h4 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3">
              Change Status
            </h4>
            <select 
              className={`${inputClass} font-bold`}
              value={selectedRecord.status}
              onChange={e => handleStatusChange(selectedRecord.id, e.target.value as RiskStatus)}
            >
              <option value="Open">Status: Open</option>
              <option value="Pending">Status: Pending Verification</option>
              <option value="Closed">Status: Closed / Mitigated</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // FORM MODE
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-bg-1 border border-border-main p-4 md:px-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 bg-bg-2 border border-border-main rounded-xl hover:text-accent hover:border-accent/50 transition-colors" onClick={() => setMode('list')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-text-1">{formData.id ? 'Edit Risk Assessment' : 'New Risk Assessment'}</h1>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm w-full md:w-auto justify-center" onClick={handleSave}>
          <Save className="w-4 h-4" /> Save Record
        </button>
      </div>

      <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm">
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Reference Code</label><input className={`${inputClass} bg-bg-2 cursor-not-allowed`} value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} disabled /></div>
            <div>
              <label className={labelClass}>Risk Category *</label>
              <select className={`${inputClass} font-medium tracking-wide`} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as RiskCategory })}>
                <option value="Product">ðŸ“¦ Product Risk</option>
                <option value="Process">âš™ï¸ Process Risk</option>
                <option value="Critical Process">âš ï¸ Critical Process Risk</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Risk Title / Hazard Description *</label>
              <input className={`${inputClass} font-medium`} value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Needle Breakage causing Contamination" />
            </div>

            <div><label className={labelClass}>Department / Area *</label><input className={inputClass} value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Sewing line 4" /></div>
            <div><label className={labelClass}>Responsible Person / PIC</label><input className={inputClass} value={formData.responsiblePerson || ''} onChange={e => setFormData({ ...formData, responsiblePerson: e.target.value })} placeholder="Name / Designation" /></div>
            
            <div><label className={labelClass}>Identified Date</label><input type="date" className={inputClass} value={formData.identifiedDate || ''} onChange={e => setFormData({ ...formData, identifiedDate: e.target.value })} /></div>
            <div><label className={labelClass}>Target Resolution Date</label><input type="date" className={inputClass} value={formData.targetDate || ''} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} /></div>
          </div>
          
          <div className="border-t border-border-main pt-8">
            <h3 className="text-sm font-bold text-text-1 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent"/> Risk Matrix Evaluation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-2/30 p-5 rounded-2xl border border-border-main/50">
                <label className="block text-[10px] font-black uppercase tracking-widest text-text-2 mb-3">Severity / Consequence (1-5)</label>
                <input type="range" min="1" max="5" className="w-full accent-accent mb-2" value={formData.severity || 1} onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) || 1 })} />
                <div className="flex justify-between text-[10px] font-bold text-text-3 uppercase px-1 mb-3">
                  <span>1: Minor</span>
                  <span>5: Critical</span>
                </div>
                <div className="text-2xl font-black text-center border-t border-border-main/50 pt-2 text-text-1">{formData.severity || 1}</div>
              </div>
              
              <div className="bg-bg-2/30 p-5 rounded-2xl border border-border-main/50">
                <label className="block text-[10px] font-black uppercase tracking-widest text-text-2 mb-3">Likelihood / Prob. (1-5)</label>
                <input type="range" min="1" max="5" className="w-full accent-accent mb-2" value={formData.likelihood || 1} onChange={e => setFormData({ ...formData, likelihood: parseInt(e.target.value) || 1 })} />
                <div className="flex justify-between text-[10px] font-bold text-text-3 uppercase px-1 mb-3">
                  <span>1: Rare</span>
                  <span>5: Certain</span>
                </div>
                <div className="text-2xl font-black text-center border-t border-border-main/50 pt-2 text-text-1">{formData.likelihood || 1}</div>
              </div>
              
              <div className={`p-5 rounded-2xl border text-center flex flex-col justify-center items-center ${LEVEL_COLORS[calculateLevel((formData.severity || 1) * (formData.likelihood || 1))]}`}>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Calculated Score</label>
                <div className="text-5xl font-black tracking-tighter mb-2">{(formData.severity || 1) * (formData.likelihood || 1)}</div>
                <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded bg-white/40 border border-white/50">Level: {calculateLevel((formData.severity || 1) * (formData.likelihood || 1))}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border-main pt-8 space-y-6">
            <div>
              <label className={labelClass}>Existing Preventive Controls</label>
              <textarea className={`${inputClass} min-h-[100px] resize-y leading-relaxed`} placeholder="Describe what measures or controls are currently active to prevent this risk." value={formData.existingControls || ''} onChange={e => setFormData({ ...formData, existingControls: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Mitigation / Corrective Action Plan</label>
              <textarea className={`${inputClass} min-h-[120px] resize-y leading-relaxed font-medium`} placeholder="Outline the action plan to reduce the severity or likelihood of this risk." value={formData.mitigationPlan || ''} onChange={e => setFormData({ ...formData, mitigationPlan: e.target.value })} />
            </div>

            <div className="pt-4">
               <div className="flex justify-between items-center mb-4">
                 <label className={labelClass}>Supporting Evidence & Photos</label>
                 <label className="text-[10px] font-black uppercase tracking-widest text-accent cursor-pointer hover:underline">
                   Add Attachment
                   <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                 </label>
               </div>
               
               {!formData.attachments || formData.attachments.length === 0 ? (
                 <div className="text-xs text-text-3 italic text-center py-6 bg-bg-2 rounded-xl border border-dashed border-border-main">
                   No evidence attached.
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-bg-2 p-2.5 rounded-lg border border-border-main group">
                        <span className="text-xs font-medium text-text-1 truncate pr-2">{file.name}</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: (p.attachments || []).filter((_, idx) => idx !== i) }))} className="text-red-500 hover:bg-red-50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




