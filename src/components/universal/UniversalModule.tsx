import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, Download, Trash2, Edit3, Eye, MessageSquare,
  ChevronDown, ChevronUp, X, FileText, FileSpreadsheet, File,
  CheckSquare, Square, ArrowLeft, Clock, User, Paperclip, Send,
  MoreVertical, AlertTriangle, Copy, Check
} from 'lucide-react';
import { getTable } from '../../db/db';
import { ModuleConfigDef } from '../../config/moduleConfigs';
import { UniversalRecord, Comment, ActivityLogEntry, FileAttachment } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ── HELPERS ──
function generateId(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

function formatDate(d: string): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
}

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (['open', 'pending', 'scheduled', 'requested', 'proposed', 'draft', 'due'].includes(s)) return 'amber';
  if (['closed', 'completed', 'pass', 'approved', 'active', 'calibrated', 'achieved', 'compliant', 'verified'].includes(s)) return 'green';
  if (['in progress', 'under review', 'under investigation', 'implementing', 'in production', 'under assessment', 'corrective action'].includes(s)) return 'cyan';
  if (['fail', 'overdue', 'rejected', 'non-compliant', 'blacklisted', 'not achieved', 'cancelled', 'not verified', 'out of service', 'disposed', 're-opened'].includes(s)) return 'red';
  return 'gray';
}

// ── MAIN COMPONENT ──
interface UniversalModuleProps {
  config: ModuleConfigDef;
  onNavigate?: (page: string, params?: any) => void;
  params?: any;
}

export function UniversalModule({ config, onNavigate, params }: UniversalModuleProps) {
  const [records, setRecords] = useState<UniversalRecord[]>([]);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [currentRecord, setCurrentRecord] = useState<UniversalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [commentText, setCommentText] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const tableFields = config.fields.filter(f => f.showInTable);
  const formFields = config.fields.filter(f => f.showInForm);
  const detailFields = config.fields.filter(f => f.showInDetail);

  // ── DATA LOADING ──
  const loadRecords = useCallback(async () => {
    try {
      const table = getTable(config.tableName);
      const all = await table.toArray();
      setRecords(all);
    } catch (e) {
      console.error(`Failed to load ${config.tableName}:`, e);
      setRecords([]);
    }
  }, [config.tableName]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  // ── FILTERED & SORTED RECORDS ──
  const filteredRecords = useMemo(() => {
    let result = [...records];
    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => {
        return Object.values(r).some(v => {
          if (typeof v === 'string') return v.toLowerCase().includes(q);
          if (typeof v === 'number') return v.toString().includes(q);
          return false;
        });
      });
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [records, statusFilter, searchQuery, sortKey, sortDir]);

  // ── CRUD OPERATIONS ──
  const handleCreate = async () => {
    const now = new Date().toISOString();
    const newRecord: UniversalRecord = {
      id: generateId(config.idPrefix),
      ...formData,
      status: config.defaultStatus,
      attachments: formData.attachments || [],
      comments: [],
      history: [{ id: crypto.randomUUID(), action: 'Created', userName: 'System User', details: 'Record created', timestamp: now }],
      createdAt: now,
      createdBy: 'System User',
      updatedAt: now,
      updatedBy: 'System User',
    };
    try {
      const table = getTable(config.tableName);
      await table.add(newRecord);
      await loadRecords();
      setView('list');
      setFormData({});
    } catch (e) { console.error('Create failed:', e); }
  };

  const handleUpdate = async () => {
    if (!currentRecord) return;
    const now = new Date().toISOString();
    const updated = {
      ...currentRecord,
      ...formData,
      updatedAt: now,
      updatedBy: 'System User',
      history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Updated', userName: 'System User', details: 'Record updated', timestamp: now }],
    };
    try {
      const table = getTable(config.tableName);
      await table.put(updated);
      await loadRecords();
      setCurrentRecord(updated);
      setView('detail');
      setFormData({});
    } catch (e) { console.error('Update failed:', e); }
  };

  const handleDelete = async (id: string) => {
    try {
      const table = getTable(config.tableName);
      await table.delete(id);
      await loadRecords();
      setShowDeleteConfirm(null);
      if (currentRecord?.id === id) { setView('list'); setCurrentRecord(null); }
    } catch (e) { console.error('Delete failed:', e); }
  };

  const handleBulkDelete = async () => {
    try {
      const table = getTable(config.tableName);
      await table.bulkDelete([...selectedIds]);
      await loadRecords();
      setSelectedIds(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (e) { console.error('Bulk delete failed:', e); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const record = records.find(r => r.id === id);
    if (!record) return;
    const now = new Date().toISOString();
    const updated = {
      ...record,
      status: newStatus,
      updatedAt: now,
      updatedBy: 'System User',
      history: [...(record.history || []), { id: crypto.randomUUID(), action: 'Status Changed', userName: 'System User', details: `Status changed to ${newStatus}`, timestamp: now }],
    };
    try {
      const table = getTable(config.tableName);
      await table.put(updated);
      await loadRecords();
      if (currentRecord?.id === id) setCurrentRecord(updated);
    } catch (e) { console.error('Status change failed:', e); }
  };

  const handleAddComment = async () => {
    if (!currentRecord || !commentText.trim()) return;
    const now = new Date().toISOString();
    const newComment: Comment = { id: crypto.randomUUID(), userName: 'System User', text: commentText.trim(), createdAt: now };
    const updated = {
      ...currentRecord,
      comments: [...(currentRecord.comments || []), newComment],
      updatedAt: now,
      history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Comment Added', userName: 'System User', details: commentText.trim().substring(0, 50) + '...', timestamp: now }],
    };
    try {
      const table = getTable(config.tableName);
      await table.put(updated);
      setCurrentRecord(updated);
      await loadRecords();
      setCommentText('');
    } catch (e) { console.error('Comment failed:', e); }
  };

  const handleFileAttach = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAttachments: FileAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const data = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAttachments.push({ name: file.name, data, type: file.type, size: file.size });
    }
    if (view === 'create' || view === 'edit') {
      setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAttachments] }));
    } else if (currentRecord) {
      const now = new Date().toISOString();
      const updated = {
        ...currentRecord,
        attachments: [...(currentRecord.attachments || []), ...newAttachments],
        updatedAt: now,
        history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Attachment Added', userName: 'System User', details: `Added ${newAttachments.length} file(s)`, timestamp: now }],
      };
      const table = getTable(config.tableName);
      await table.put(updated);
      setCurrentRecord(updated);
      await loadRecords();
    }
  };

  // ── EXPORT FUNCTIONS ──
  const getExportData = (recs: UniversalRecord[]) => {
    return recs.map(r => {
      const row: Record<string, any> = { ID: r.id };
      tableFields.forEach(f => { row[f.label] = r[f.key] ?? ''; });
      row['Status'] = r.status;
      row['Created'] = formatDate(r.createdAt);
      return row;
    });
  };

  const exportToPDF = (recs: UniversalRecord[]) => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text(config.title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    const data = getExportData(recs);
    const cols = Object.keys(data[0] || {});
    autoTable(doc, {
      head: [cols],
      body: data.map(r => cols.map(c => String(r[c] ?? ''))),
      startY: 36,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [14, 165, 233] },
    });
    doc.save(`${config.key}_export.pdf`);
    setShowExportMenu(false);
  };

  const exportToExcel = (recs: UniversalRecord[]) => {
    const data = getExportData(recs);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, config.title.substring(0, 31));
    XLSX.writeFile(wb, `${config.key}_export.xlsx`);
    setShowExportMenu(false);
  };

  const exportToCSV = (recs: UniversalRecord[]) => {
    const data = getExportData(recs);
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${config.key}_export.csv`; a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportSinglePDF = (record: UniversalRecord) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(config.title, 14, 22);
    doc.setFontSize(12);
    doc.text(`Record: ${record.id}`, 14, 32);
    doc.setFontSize(10);
    let y = 44;
    detailFields.forEach(f => {
      const val = record[f.key];
      if (val !== undefined && val !== null && val !== '') {
        doc.text(`${f.label}: ${val}`, 14, y);
        y += 8;
        if (y > 270) { doc.addPage(); y = 20; }
      }
    });
    doc.text(`Status: ${record.status}`, 14, y); y += 8;
    doc.text(`Created: ${formatDate(record.createdAt)}`, 14, y); y += 8;
    doc.text(`Updated: ${formatDate(record.updatedAt)}`, 14, y); y += 12;
    if (record.comments?.length > 0) {
      doc.text('Comments:', 14, y); y += 8;
      record.comments.forEach(c => {
        doc.text(`• [${formatDate(c.createdAt)}] ${c.userName}: ${c.text}`, 18, y);
        y += 7;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    }
    doc.save(`${record.id}.pdf`);
  };

  // ── SELECTION ──
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map(r => r.id)));
    }
  };

  // ── SORT ──
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // ── OPEN EDIT ──
  const openEdit = (record: UniversalRecord) => {
    const data: Record<string, any> = {};
    config.fields.forEach(f => { data[f.key] = record[f.key] ?? ''; });
    data.attachments = record.attachments || [];
    setFormData(data);
    setCurrentRecord(record);
    setView('edit');
  };

  // ── OPEN CREATE ──
  const openCreate = () => {
    const data: Record<string, any> = {};
    config.fields.forEach(f => { data[f.key] = f.defaultValue ?? ''; });
    data.attachments = [];
    setFormData(data);
    setCurrentRecord(null);
    setView('create');
  };

  // ── OPEN DETAIL ──
  const openDetail = (record: UniversalRecord) => {
    setCurrentRecord(record);
    setView('detail');
  };

  // ── COPY ID ──
  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const Icon = config.icon;

  // ── RENDER: DETAIL VIEW ──
  if (view === 'detail' && currentRecord) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('list'); setCurrentRecord(null); }} className="p-2 text-text-2 hover:bg-accent/10 hover:text-accent transition-all border border-border-main hover:border-accent/50">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-semibold text-lg text-text-1">{currentRecord.id}</h1>
              <p className="text-xs text-text-3 mt-0.5">
                Created {formatDate(currentRecord.createdAt)} by {currentRecord.createdBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Dropdown */}
            <select
              value={currentRecord.status}
              onChange={(e) => handleStatusChange(currentRecord.id, e.target.value)}
              className={`text-xs font-mono font-bold px-3 py-1.5 border appearance-none cursor-pointer transition-all
                ${getStatusColor(currentRecord.status) === 'green' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                  getStatusColor(currentRecord.status) === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                  getStatusColor(currentRecord.status) === 'red' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                  getStatusColor(currentRecord.status) === 'cyan' ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' :
                  'bg-bg-3 text-text-2 border-border-main'
                }`}
            >
              {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => openEdit(currentRecord)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border-main rounded-lg text-text-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={() => exportSinglePDF(currentRecord)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border-main rounded-lg text-text-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={() => setShowDeleteConfirm(currentRecord.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold border border-border-main text-text-2 hover:border-red-main/50 hover:text-red-main hover:bg-red-main/5 transition-all uppercase tracking-wider">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent" /> Record Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailFields.map(f => (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="text-xs font-medium text-text-3 uppercase tracking-wide block mb-1">{f.label}</label>
                    <div className="text-sm text-text-1 font-medium bg-bg-3/30 border border-border-main px-3 py-2 min-h-[36px]">
                      {currentRecord[f.key] || <span className="text-text-3 italic">—</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-text-1 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-accent" /> Attachments ({(currentRecord.attachments || []).length})
                </h3>
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border-main rounded-lg text-text-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Add File
                  <input type="file" multiple className="hidden" onChange={(e) => handleFileAttach(e.target.files)} />
                </label>
              </div>
              {(currentRecord.attachments || []).length === 0 ? (
                <p className="text-text-3 text-xs font-mono">No attachments</p>
              ) : (
                <div className="space-y-2">
                  {currentRecord.attachments.map((att: FileAttachment, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-bg-3/30 border border-border-main px-3 py-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-xs font-mono text-text-1 truncate">{att.name}</span>
                        {att.size && <span className="text-[9px] font-mono text-text-3">({(att.size / 1024).toFixed(1)}KB)</span>}
                      </div>
                      <a href={att.data} download={att.name} className="text-accent hover:text-accent-dim transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" /> Comments ({(currentRecord.comments || []).length})
              </h3>
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {(currentRecord.comments || []).length === 0 ? (
                  <p className="text-text-3 text-xs font-mono">No comments yet</p>
                ) : (
                  currentRecord.comments.map((c: Comment) => (
                    <div key={c.id} className="bg-bg-3/30 border border-border-main p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-accent/10 border border-accent/30 flex items-center justify-center">
                            <User className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-text-1 uppercase tracking-wider">{c.userName}</span>
                        </div>
                        <span className="text-[9px] font-mono text-text-3">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-xs text-text-2 leading-relaxed pl-8">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                  placeholder="Add a comment..."
                  className="flex-1 bg-bg-0 border border-border-main px-3 py-2 text-xs font-mono text-text-1 placeholder-text-3 outline-none focus:border-accent/50 transition-colors"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-3 py-2 bg-accent text-white text-sm font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent/80 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar: History Log */}
          <div className="space-y-6">
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> History Log
              </h3>
              <div className="space-y-0 border-l-2 border-border-main pl-4 max-h-[500px] overflow-y-auto">
                {(currentRecord.history || []).slice().reverse().map((h: ActivityLogEntry) => (
                  <div key={h.id} className="relative pb-4">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 border-2 border-bg-2 bg-accent shadow-[0_0_6px_var(--accent)]" />
                    <p className="text-[10px] font-mono font-bold text-text-1 uppercase tracking-wider">{h.action}</p>
                    <p className="text-[9px] font-mono text-text-3 mt-0.5">{h.details}</p>
                    <p className="text-[9px] font-mono text-text-3 mt-0.5">{formatDate(h.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4">Quick Info</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-3">ID</span>
                  <button onClick={() => copyId(currentRecord.id)} className="text-accent flex items-center gap-1 hover:underline">
                    {copiedId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {currentRecord.id}
                  </button>
                </div>
                <div className="flex justify-between"><span className="text-text-3">Created By</span><span className="text-text-1">{currentRecord.createdBy}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Created</span><span className="text-text-1">{formatDate(currentRecord.createdAt)}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Updated</span><span className="text-text-1">{formatDate(currentRecord.updatedAt)}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Comments</span><span className="text-text-1">{(currentRecord.comments || []).length}</span></div>
                <div className="flex justify-between"><span className="text-text-3">Attachments</span><span className="text-text-1">{(currentRecord.attachments || []).length}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-bg-2 border border-border-bright p-6 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-main/10 border border-red-main/30 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-main" /></div>
                  <div>
                    <h3 className="font-rajdhani font-bold text-text-1 uppercase tracking-wider">Confirm Delete</h3>
                    <p className="text-xs text-text-3 font-mono">This action cannot be undone</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-xs font-mono font-bold border border-border-main text-text-2 hover:bg-bg-3 transition-all uppercase tracking-wider">Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 text-xs font-mono font-bold bg-red-main text-white hover:bg-red-dim transition-all uppercase tracking-wider">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── RENDER: CREATE / EDIT FORM ──
  if (view === 'create' || view === 'edit') {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setView(currentRecord ? 'detail' : 'list'); setFormData({}); }} className="p-2 text-text-2 hover:bg-accent/10 hover:text-accent transition-all border border-border-main hover:border-accent/50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-semibold text-lg text-text-1">
              {view === 'create' ? `New ${config.title}` : `Edit ${currentRecord?.id}`}
            </h1>
            <p className="text-xs text-text-3">{config.subtitle}</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="bg-bg-2/50 border border-border-main p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map(f => (
                <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="text-xs font-medium text-text-3 uppercase tracking-wide block mb-1.5">
                    {f.label} {f.required && <span className="text-red-main">*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-bg-0 border border-border-main px-3 py-2 text-sm text-text-1 outline-none focus:border-accent/50 transition-colors font-sans appearance-none"
                    >
                      <option value="">Select...</option>
                      {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full bg-bg-0 border border-border-main px-3 py-2 text-sm text-text-1 outline-none focus:border-accent/50 transition-colors font-sans resize-vertical"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-bg-0 border border-border-main px-3 py-2 text-sm text-text-1 outline-none focus:border-accent/50 transition-colors font-sans"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* File Upload */}
            <div className="mt-6 pt-4 border-t border-border-main">
              <label className="text-xs font-medium text-text-3 uppercase tracking-wide block mb-2">Attachments</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border-bright text-text-2 hover:border-accent/50 hover:text-accent hover:bg-accent/5 transition-all cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">Choose Files</span>
                  <input type="file" multiple className="hidden" onChange={(e) => handleFileAttach(e.target.files)} />
                </label>
                {(formData.attachments || []).length > 0 && (
                  <span className="text-xs font-mono text-accent">{formData.attachments.length} file(s) attached</span>
                )}
              </div>
              {(formData.attachments || []).length > 0 && (
                <div className="mt-3 space-y-1">
                  {formData.attachments.map((att: FileAttachment, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-bg-3/30 border border-border-main px-3 py-1.5">
                      <span className="text-xs font-mono text-text-1 truncate">{att.name}</span>
                      <button onClick={() => setFormData(prev => ({ ...prev, attachments: prev.attachments.filter((_: any, idx: number) => idx !== i) }))} className="text-red-main hover:text-red-dim"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border-main">
              <button onClick={() => { setView(currentRecord ? 'detail' : 'list'); setFormData({}); }}
                className="px-5 py-2.5 text-xs font-mono font-bold border border-border-main text-text-2 hover:bg-bg-3 transition-all uppercase tracking-wider">
                Cancel
              </button>
              <button
                onClick={view === 'create' ? handleCreate : handleUpdate}
                className="px-5 py-2.5 text-xs font-mono font-bold bg-accent text-white hover:bg-accent-dim transition-all"
              >
                {view === 'create' ? 'Create Record' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: LIST VIEW ──
  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-text-1">{config.title}</h1>
            <p className="text-xs text-text-3">{config.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Record
          </button>
          <div className="relative" ref={exportRef}>
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border-main rounded-lg text-text-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">
              <Download className="w-3.5 h-3.5" /> Export
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute right-0 top-full mt-1 bg-bg-2 border border-border-bright shadow-lg z-30 min-w-[160px]">
                  <button onClick={() => exportToPDF(selectedIds.size > 0 ? filteredRecords.filter(r => selectedIds.has(r.id)) : filteredRecords)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <File className="w-3.5 h-3.5" /> Export PDF
                  </button>
                  <button onClick={() => exportToExcel(selectedIds.size > 0 ? filteredRecords.filter(r => selectedIds.has(r.id)) : filteredRecords)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                  </button>
                  <button onClick={() => exportToCSV(selectedIds.size > 0 ? filteredRecords.filter(r => selectedIds.has(r.id)) : filteredRecords)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <FileText className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-bg-1 border border-border-main rounded-xl p-4">
          <div className="text-xs text-text-3">Total Records</div>
          <div className="font-bold text-2xl text-accent mt-1">{records.length}</div>
        </div>
        {config.statusOptions.slice(0, 3).map(s => {
          const count = records.filter(r => r.status === s).length;
          const color = getStatusColor(s);
          return (
            <div key={s} className="bg-bg-1 border border-border-main rounded-xl p-4">
              <div className="text-xs text-text-3">{s}</div>
              <div className={`font-bold text-2xl mt-1 ${
                color === 'green' ? 'text-green-main' : color === 'amber' ? 'text-amber-main' : color === 'red' ? 'text-red-main' : color === 'cyan' ? 'text-accent' : 'text-text-1'
              }`}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center bg-bg-2/50 border border-border-main px-3 gap-2 focus-within:border-accent/50 transition-all">
          <Search className="w-4 h-4 text-text-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-text-1 placeholder-text-3 py-2 tracking-wider"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-text-3 hover:text-accent"><X className="w-3.5 h-3.5" /></button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg-2/50 border border-border-main px-3 py-2 text-xs font-mono text-text-1 outline-none focus:border-accent/50 transition-colors appearance-none"
          >
            <option value="All">All Status</option>
            {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="bg-accent/5 border border-accent/20 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {selectedIds.size} record{selectedIds.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => exportToPDF(filteredRecords.filter(r => selectedIds.has(r.id)))} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold border border-accent/30 text-accent hover:bg-accent/10 transition-all uppercase tracking-wider">
                  <File className="w-3 h-3" /> PDF
                </button>
                <button onClick={() => exportToExcel(filteredRecords.filter(r => selectedIds.has(r.id)))} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold border border-accent/30 text-accent hover:bg-accent/10 transition-all uppercase tracking-wider">
                  <FileSpreadsheet className="w-3 h-3" /> Excel
                </button>
                <button onClick={() => setShowBulkDeleteConfirm(true)} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold border border-red-main/30 text-red-main hover:bg-red-main/10 transition-all uppercase tracking-wider">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-text-3 hover:text-text-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <div className="bg-bg-1 border border-border-main rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-3/50">
                <th className="p-3 text-left w-10">
                  <button onClick={toggleSelectAll} className="text-text-3 hover:text-accent transition-colors">
                    {selectedIds.size === filteredRecords.length && filteredRecords.length > 0 ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th onClick={() => handleSort('id')} className="p-3 text-left cursor-pointer hover:text-accent transition-colors">
                  <div className="flex items-center gap-1 text-xs font-medium text-text-3 uppercase">
                    ID {sortKey === 'id' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                {tableFields.map(f => (
                  <th key={f.key} onClick={() => handleSort(f.key)} className="p-3 text-left cursor-pointer hover:text-accent transition-colors">
                    <div className="flex items-center gap-1 text-xs font-medium text-text-3 uppercase whitespace-nowrap">
                      {f.label} {sortKey === f.key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                ))}
                <th onClick={() => handleSort('status')} className="p-3 text-left cursor-pointer hover:text-accent transition-colors">
                  <div className="flex items-center gap-1 text-xs font-medium text-text-3 uppercase">
                    Status {sortKey === 'status' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-3 text-right">
                  <span className="text-xs font-medium text-text-3 uppercase">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={tableFields.length + 4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-bg-3/30 border border-border-main flex items-center justify-center">
                        <Icon className="w-8 h-8 text-text-3" />
                      </div>
                      <p className="text-sm font-mono text-text-3 uppercase tracking-wider">No records found</p>
                      <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-all mt-2">
                        <Plus className="w-3.5 h-3.5" /> Create First Record
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const statusColor = getStatusColor(record.status);
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-t border-border-main hover:bg-accent/5 transition-colors ${selectedIds.has(record.id) ? 'bg-accent/5' : ''}`}
                    >
                      <td className="p-3">
                        <button onClick={() => toggleSelect(record.id)} className="text-text-3 hover:text-accent transition-colors">
                          {selectedIds.has(record.id) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono text-accent font-bold">{record.id}</span>
                      </td>
                      {tableFields.map(f => (
                        <td key={f.key} className="p-3">
                          <span className="text-xs text-text-2 font-medium truncate block max-w-[200px]" title={String(record[f.key] ?? '')}>
                            {f.type === 'date' ? formatDate(record[f.key]) : (record[f.key] ?? '—')}
                          </span>
                        </td>
                      ))}
                      <td className="p-3">
                        <select
                          value={record.status}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(record.id, e.target.value); }}
                          className={`text-[10px] font-mono font-bold px-2 py-1 border appearance-none cursor-pointer transition-all
                            ${statusColor === 'green' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                              statusColor === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                              statusColor === 'red' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                              statusColor === 'cyan' ? 'bg-sky-500/10 text-sky-500 border-sky-500/30' :
                              'bg-bg-3 text-text-2 border-border-main'
                            }`}
                        >
                          {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openDetail(record)} title="View" className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-all">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(record)} title="Edit" className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-all">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => exportSinglePDF(record)} title="Download PDF" className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 transition-all">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setShowDeleteConfirm(record.id)} title="Delete" className="p-1.5 text-text-3 hover:text-red-main hover:bg-red-main/10 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="bg-bg-3/30 border-t border-border-main px-4 py-2.5 flex items-center justify-between">
          <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">
            Showing {filteredRecords.length} of {records.length} records
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {(showDeleteConfirm || showBulkDeleteConfirm) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-bg-2 border border-border-bright p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-main/10 border border-red-main/30 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-main" /></div>
                <div>
                  <h3 className="font-semibold text-text-1">Confirm Delete</h3>
                  <p className="text-xs text-text-3">
                    {showBulkDeleteConfirm ? `Delete ${selectedIds.size} records?` : 'Delete this record?'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowDeleteConfirm(null); setShowBulkDeleteConfirm(false); }}
                  className="px-4 py-2 text-sm font-medium border border-border-main rounded-lg text-text-2 hover:bg-bg-2 transition-all">Cancel</button>
                <button
                  onClick={() => showBulkDeleteConfirm ? handleBulkDelete() : showDeleteConfirm && handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium bg-red-main text-white rounded-lg hover:bg-red-dim transition-all"
                >Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
