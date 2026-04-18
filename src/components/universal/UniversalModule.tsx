import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, Download, Trash2, Edit2, Eye, MessageSquare,
  ChevronDown, ChevronUp, X, FileText, FileSpreadsheet, File,
  CheckSquare, Square, ArrowLeft, Clock, User, Paperclip, Send,
  AlertTriangle, Copy, Check, BarChart3, CheckCircle2, XCircle,
  FileDown, Calendar, Activity, Layers
} from 'lucide-react';
import { getTable } from '../../db/db';
import { ModuleConfigDef } from '../../config/moduleConfigs';
import { UniversalRecord, Comment, ActivityLogEntry, FileAttachment } from '../../types';
import * as XLSX from 'xlsx';
import { exportTableToPDF, exportDetailToPDF } from '../../utils/pdfExportUtils';

// ── Animation variants (matches Inspection) ───────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

// ── HELPERS ────────────────────────────────────────────────────────────────
function generateId(prefix: string): string {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

function formatDate(d: string): string {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (['open','pending','scheduled','requested','proposed','draft','due'].includes(s))
    return { badge: 'bg-amber-500/10 text-amber-500 border-amber-500/25', dot: 'bg-amber-500' };
  if (['closed','completed','pass','approved','active','calibrated','achieved','compliant','verified'].includes(s))
    return { badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25', dot: 'bg-emerald-500' };
  if (['in progress','under review','under investigation','implementing','in production','under assessment','corrective action'].includes(s))
    return { badge: 'bg-sky-500/10 text-sky-500 border-sky-500/25', dot: 'bg-sky-500' };
  if (['fail','overdue','rejected','non-compliant','blacklisted','not achieved','cancelled','not verified','out of service','disposed','re-opened'].includes(s))
    return { badge: 'bg-rose-500/10 text-rose-500 border-rose-500/25', dot: 'bg-rose-500' };
  return { badge: 'bg-bg-3 text-text-2 border-border-main', dot: 'bg-text-3' };
}

// ── Field wrapper (matches InspectionForm) ────────────────────────────────
const Field = ({ label, required = false, children, span2 = false }: any) => (
  <div className={`space-y-2 w-full${span2 ? ' md:col-span-2' : ''}`}>
    <label className="text-sm font-bold text-text-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// ── Status badge (pill) ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = getStatusColor(status);
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] uppercase font-black tracking-wider border ${c.badge}`}>
      {status}
    </span>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
interface UniversalModuleProps {
  config:      ModuleConfigDef;
  onNavigate?: (page: string, params?: any) => void;
  params?:     any;
}

export function UniversalModule({ config, onNavigate, params }: UniversalModuleProps) {
  const [records,             setRecords]             = useState<UniversalRecord[]>([]);
  const [view,                setView]                = useState<'list'|'create'|'edit'|'detail'>('list');
  const [currentRecord,       setCurrentRecord]       = useState<UniversalRecord | null>(null);
  const [searchQuery,         setSearchQuery]         = useState('');
  const [statusFilter,        setStatusFilter]        = useState('All');
  const [selectedIds,         setSelectedIds]         = useState<Set<string>>(new Set());
  const [sortKey,             setSortKey]             = useState('createdAt');
  const [sortDir,             setSortDir]             = useState<'asc'|'desc'>('desc');
  const [showExportMenu,      setShowExportMenu]      = useState(false);
  const [showDeleteConfirm,   setShowDeleteConfirm]   = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [formData,            setFormData]            = useState<Record<string, any>>({});
  const [commentText,         setCommentText]         = useState('');
  const [copiedId,            setCopiedId]            = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const tableFields  = config.fields.filter(f => f.showInTable);
  const formFields   = config.fields.filter(f => f.showInForm);
  const detailFields = config.fields.filter(f => f.showInDetail);

  // ── DATA LOADING ─────────────────────────────────────────────────────────
  const loadRecords = useCallback(async () => {
    try {
      const all = await getTable(config.tableName).toArray();
      setRecords(all);
    } catch { setRecords([]); }
  }, [config.tableName]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  // ── FILTERED & SORTED ────────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    let r = [...records];
    if (statusFilter !== 'All') r = r.filter(x => x.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(x => Object.values(x).some(v =>
        typeof v === 'string' ? v.toLowerCase().includes(q)
          : typeof v === 'number' ? v.toString().includes(q) : false
      ));
    }
    r.sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return r;
  }, [records, statusFilter, searchQuery, sortKey, sortDir]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const now = new Date().toISOString();
    const rec: UniversalRecord = {
      id: generateId(config.idPrefix), ...formData,
      status: config.defaultStatus, attachments: formData.attachments || [],
      comments: [], createdAt: now, createdBy: 'System User', updatedAt: now, updatedBy: 'System User',
      history: [{ id: crypto.randomUUID(), action: 'Created', userName: 'System User', details: 'Record created', timestamp: now }],
    };
    try { await getTable(config.tableName).add(rec); await loadRecords(); setView('list'); setFormData({}); }
    catch (e) { console.error('Create failed:', e); }
  };

  const handleUpdate = async () => {
    if (!currentRecord) return;
    const now = new Date().toISOString();
    const updated = {
      ...currentRecord, ...formData, updatedAt: now, updatedBy: 'System User',
      history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Updated', userName: 'System User', details: 'Record updated', timestamp: now }],
    };
    try { await getTable(config.tableName).put(updated); await loadRecords(); setCurrentRecord(updated); setView('detail'); setFormData({}); }
    catch (e) { console.error('Update failed:', e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await getTable(config.tableName).delete(id);
      await loadRecords();
      setShowDeleteConfirm(null);
      if (currentRecord?.id === id) { setView('list'); setCurrentRecord(null); }
    } catch (e) { console.error('Delete failed:', e); }
  };

  const handleBulkDelete = async () => {
    try { await getTable(config.tableName).bulkDelete([...selectedIds]); await loadRecords(); setSelectedIds(new Set()); setShowBulkDeleteConfirm(false); }
    catch (e) { console.error('Bulk delete failed:', e); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const rec = records.find(r => r.id === id);
    if (!rec) return;
    const now = new Date().toISOString();
    const updated = { ...rec, status: newStatus, updatedAt: now, updatedBy: 'System User',
      history: [...(rec.history || []), { id: crypto.randomUUID(), action: 'Status Changed', userName: 'System User', details: `Status → ${newStatus}`, timestamp: now }],
    };
    try { await getTable(config.tableName).put(updated); await loadRecords(); if (currentRecord?.id === id) setCurrentRecord(updated); }
    catch (e) { console.error('Status change failed:', e); }
  };

  const handleAddComment = async () => {
    if (!currentRecord || !commentText.trim()) return;
    const now = new Date().toISOString();
    const newComment: Comment = { id: crypto.randomUUID(), userName: 'System User', text: commentText.trim(), createdAt: now };
    const updated = {
      ...currentRecord, comments: [...(currentRecord.comments || []), newComment],
      updatedAt: now,
      history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Comment Added', userName: 'System User', details: commentText.trim().substring(0, 50), timestamp: now }],
    };
    try { await getTable(config.tableName).put(updated); setCurrentRecord(updated); await loadRecords(); setCommentText(''); }
    catch (e) { console.error('Comment failed:', e); }
  };

  const handleFileAttach = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAtts: FileAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>(res => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(file);
      });
      newAtts.push({ name: file.name, data, type: file.type, size: file.size });
    }
    if (view === 'create' || view === 'edit') {
      setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAtts] }));
    } else if (currentRecord) {
      const now = new Date().toISOString();
      const updated = {
        ...currentRecord, attachments: [...(currentRecord.attachments || []), ...newAtts], updatedAt: now,
        history: [...(currentRecord.history || []), { id: crypto.randomUUID(), action: 'Attachment Added', userName: 'System User', details: `Added ${newAtts.length} file(s)`, timestamp: now }],
      };
      await getTable(config.tableName).put(updated);
      setCurrentRecord(updated); await loadRecords();
    }
  };

  // ── EXPORT ───────────────────────────────────────────────────────────────
  const getExportData = (recs: UniversalRecord[]) =>
    recs.map(r => {
      const row: Record<string, any> = { ID: r.id };
      tableFields.forEach(f => { row[f.label] = r[f.key] ?? ''; });
      row['Status'] = r.status; row['Created'] = formatDate(r.createdAt);
      return row;
    });

  const exportToPDF = (recs: UniversalRecord[]) => {
    const data = getExportData(recs);
    const cols = data.length > 0 ? Object.keys(data[0]) : [];
    exportTableToPDF({ moduleName: config.title, moduleId: config.key, columns: cols, rows: data.map(r => cols.map(c => String(r[c] ?? ''))), fileName: `${config.key}_export` });
    setShowExportMenu(false);
  };

  const exportToExcel = (recs: UniversalRecord[]) => {
    const ws = XLSX.utils.json_to_sheet(getExportData(recs));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, config.title.substring(0, 31));
    XLSX.writeFile(wb, `${config.key}_export.xlsx`);
    setShowExportMenu(false);
  };

  const exportToCSV = (recs: UniversalRecord[]) => {
    const csv  = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(getExportData(recs)));
    const blob = new Blob([csv], { type: 'text/csv' });
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `${config.key}_export.csv`; a.click();
    setShowExportMenu(false);
  };

  const exportSinglePDF = (record: UniversalRecord) => {
    exportDetailToPDF({
      moduleName: config.title, moduleId: config.key, recordId: record.id, fileName: `${record.id}_detail`,
      fields: detailFields.map(f => ({ label: f.label, value: String(record[f.key] || '—') }))
        .concat([{ label: 'Status', value: record.status }, { label: 'Created By', value: record.createdBy || '—' }, { label: 'Created At', value: formatDate(record.createdAt) }]),
      comments: (record.comments || []).map((c: any) => ({ user: c.userName, date: formatDate(c.createdAt), text: c.text })),
      attachments: record.attachments, // Pass the attachments here
    });
  };

  // ── SELECTION & SORT ─────────────────────────────────────────────────────
  const toggleSelect    = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds(selectedIds.size === filteredRecords.length && filteredRecords.length > 0 ? new Set() : new Set(filteredRecords.map(r => r.id)));
  const handleSort      = (key: string) => { if (sortKey === key) setSortDir(p => p === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };

  const openEdit = (record: UniversalRecord) => {
    const d: Record<string, any> = {};
    config.fields.forEach(f => { d[f.key] = record[f.key] ?? ''; });
    d.attachments = record.attachments || [];
    setFormData(d); setCurrentRecord(record); setView('edit');
  };
  const openCreate = () => {
    const d: Record<string, any> = {};
    config.fields.forEach(f => { d[f.key] = f.defaultValue ?? ''; });
    d.attachments = [];
    setFormData(d); setCurrentRecord(null); setView('create');
  };
  const openDetail = (record: UniversalRecord) => { setCurrentRecord(record); setView('detail'); };
  const copyId     = (id: string) => { navigator.clipboard.writeText(id); setCopiedId(true); setTimeout(() => setCopiedId(false), 1500); };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExportMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const Icon = config.icon;

  // ──────────────────────────────────────────────────────────────────────────
  // DETAIL VIEW  (matches Inspection Form read-only feel)
  // ──────────────────────────────────────────────────────────────────────────
  if (view === 'detail' && currentRecord) {
    const statusC = getStatusColor(currentRecord.status);

    // Split fields into groups of ~5 for numbered sections
    const sectionSize = 6;
    const sections: Array<typeof detailFields> = [];
    for (let i = 0; i < detailFields.length; i += sectionSize) sections.push(detailFields.slice(i, i + sectionSize));

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => { setView('list'); setCurrentRecord(null); }}
              className="btn btn-ghost px-2 bg-bg-2 border border-border-main">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-text-1">{currentRecord.id}</h2>
              <div className="text-text-2 text-sm mt-1">
                {config.title} — {formatDate(currentRecord.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select value={currentRecord.status}
                onChange={e => handleStatusChange(currentRecord.id, e.target.value)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border appearance-none cursor-pointer pr-8 outline-none ${statusC.badge}`}>
                {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-70" />
            </div>
            <button onClick={() => openEdit(currentRecord)}
              className="btn btn-ghost border border-border-main flex items-center gap-2">
              <Edit2 className="w-4 h-4 mr-1" /> Edit Record
            </button>
            <button onClick={() => exportSinglePDF(currentRecord)}
              className="btn btn-primary shadow-md flex items-center gap-2">
              <FileDown className="w-4 h-4 mr-1" /> Download Report
            </button>
            <button onClick={() => setShowDeleteConfirm(currentRecord.id)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-rose-500/30 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-wider">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: detail sections ── */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((sectionFields, si) => (
              <div key={si} className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
                  {si === 0 ? <Icon className="w-5 h-5 text-accent" /> : si === 1 ? <Layers className="w-5 h-5 text-purple-500" /> : <Activity className="w-5 h-5 text-sky-500" />}
                  {si + 1}. {si === 0 ? 'Core Information' : si === 1 ? 'Additional Details' : 'Extended Information'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {sectionFields.map(f => (
                    <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="text-sm font-bold text-text-2 block mb-2">{f.label}</label>
                      <div className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm text-text-1 min-h-[46px]">
                        {currentRecord[f.key] || <span className="text-text-3 italic">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Attachments */}
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
              <div className="flex items-center justify-between mb-5 border-b border-border-main pb-3">
                <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                  <Paperclip className="w-5 h-5 text-accent" /> Attachments
                  <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">{(currentRecord.attachments || []).length}</span>
                </h4>
                <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-border-main rounded-xl text-text-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all cursor-pointer uppercase tracking-wider">
                  <Plus className="w-4 h-4" /> Add File
                  <input type="file" multiple className="hidden" onChange={e => handleFileAttach(e.target.files)} />
                </label>
              </div>
              {(currentRecord.attachments || []).length === 0 ? (
                <div className="py-8 text-center bg-bg-2 rounded-xl text-text-3 text-sm italic">No files attached yet</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentRecord.attachments.map((att: FileAttachment, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-bg-2 rounded-xl px-4 py-3 border border-border-main group hover:border-accent/30 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-text-1 truncate">{att.name}</span>
                          {att.size && <span className="text-[10px] font-mono text-text-3">{(att.size / 1024).toFixed(1)} KB</span>}
                        </div>
                      </div>
                      <a href={att.data} download={att.name} className="p-2 text-text-2 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
              <h4 className="font-bold text-lg mb-5 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
                <MessageSquare className="w-5 h-5 text-accent" /> Communications
                <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">{(currentRecord.comments || []).length}</span>
              </h4>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {(currentRecord.comments || []).length === 0 ? (
                  <div className="py-8 text-center bg-bg-2 rounded-xl text-text-3 text-sm italic">No communications logged yet</div>
                ) : (
                  currentRecord.comments.map((c: Comment) => (
                    <div key={c.id} className="bg-bg-2 rounded-xl p-4 border border-border-main relative">
                      <div className="absolute top-4 left-0 w-1 h-8 bg-accent rounded-r" />
                      <div className="flex items-center justify-between mb-2 pl-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <span className="text-xs font-bold text-text-1">{c.userName}</span>
                        </div>
                        <span className="text-[10px] text-text-3">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-text-2 leading-relaxed pl-10">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-3">
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  placeholder="Type a comment and press Enter…"
                  className="flex-1 bg-bg-2 border-none rounded-xl px-4 py-3 text-sm text-text-1 placeholder:text-text-3 outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                <button onClick={handleAddComment} disabled={!commentText.trim()}
                  className="btn btn-primary flex items-center gap-2 disabled:opacity-30">
                  <Send className="w-4 h-4" /> Post
                </button>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">
            {/* Quick reference */}
            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm">
              <h4 className="font-bold text-base text-text-1 mb-4 border-b border-border-main pb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" /> Quick Reference
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Record ID',   value: <button onClick={() => copyId(currentRecord.id)} className="text-accent font-mono text-xs font-bold flex items-center gap-1 hover:bg-accent/10 px-2 py-1 rounded transition-colors">{copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {currentRecord.id}</button> },
                  { label: 'Status',      value: <StatusBadge status={currentRecord.status} /> },
                  { label: 'Created By',  value: <span className="text-sm font-semibold text-text-1">{currentRecord.createdBy}</span> },
                  { label: 'Created',     value: <span className="text-sm text-text-1">{formatDate(currentRecord.createdAt)}</span> },
                  { label: 'Last Update', value: <span className="text-sm text-text-1">{formatDate(currentRecord.updatedAt)}</span> },
                ].map(row => (
                  <div key={row.label} className="bg-bg-2 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">{row.label}</span>
                    {row.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm">
              <h4 className="font-bold text-base text-text-1 mb-5 border-b border-border-main pb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> Activity Timeline
              </h4>
              <div className="relative pl-4 space-y-5">
                <div className="absolute left-6 top-2 bottom-0 w-0.5 bg-border-main rounded-full" />
                {(currentRecord.history || []).slice().reverse().map((h: ActivityLogEntry, i: number) => (
                  <div key={h.id} className="relative pl-6">
                    <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-bg-1 z-10 ${i === 0 ? 'bg-accent shadow-[0_0_8px_var(--accent)]' : 'bg-text-3'}`} />
                    <p className="text-xs font-bold text-text-1">{h.action}</p>
                    <p className="text-sm text-text-2 mt-0.5">{h.details}</p>
                    <p className="text-[10px] text-text-3 mt-1 uppercase tracking-wider">{formatDate(h.timestamp)} · {h.userName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delete modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-bg-1 border border-border-main rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-1 mb-1">Confirm Permanent Deletion</h3>
                    <p className="text-sm text-text-3 leading-relaxed">This action cannot be undone. All associated data will be permanently removed.</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowDeleteConfirm(null)} className="btn btn-ghost border border-border-main">Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 shadow-lg transition-all">Confirm Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE / EDIT FORM  (matches InspectionForm layout exactly)
  // ──────────────────────────────────────────────────────────────────────────
  if (view === 'create' || view === 'edit') {
    // Split formFields into 2 sections (left / right columns)
    const mid   = Math.ceil(formFields.length / 2);
    const left  = formFields.slice(0, mid);
    const right = formFields.slice(mid);

    const renderInput = (f: typeof formFields[0]) => {
      const base = 'w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all';
      if (f.type === 'select') return (
        <select className={base} value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}>
          <option value="" disabled>Select {f.label.toLowerCase()}…</option>
          {(f.options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      if (f.type === 'textarea') return (
        <textarea className={`${base} min-h-[100px] resize-y`} rows={4} placeholder={f.placeholder}
          value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} />
      );
      return (
        <input type={f.type} className={base} placeholder={f.placeholder}
          value={formData[f.key] || ''}
          onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} />
      );
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => { setView(currentRecord ? 'detail' : 'list'); setFormData({}); }}
              className="btn btn-ghost px-2 bg-bg-2 border border-border-main">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-text-1">
                {view === 'create' ? `New ${config.title}` : `Edit Record — ${currentRecord?.id}`}
              </h2>
              <div className="text-text-2 text-sm mt-1">{config.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setView(currentRecord ? 'detail' : 'list'); setFormData({}); }}
              className="btn btn-ghost px-6 border border-border-main">Cancel</button>
            <button onClick={view === 'create' ? handleCreate : handleUpdate}
              className="btn btn-primary px-8 shadow-md flex items-center gap-2">
              <Check className="w-4 h-4" /> {view === 'create' ? 'Save Record' : 'Update Record'}
            </button>
          </div>
        </div>

        {/* Two-column form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
                <Icon className="w-5 h-5 text-accent" /> 1. Core Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {left.map(f => (
                  <Field key={f.key} label={f.label} required={f.required} span2={f.type === 'textarea'}>
                    {renderInput(f)}
                  </Field>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                  <Paperclip className="w-5 h-5 text-accent" /> 3. Supporting Evidence
                </h4>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add Files
                  <input type="file" multiple className="hidden" onChange={e => handleFileAttach(e.target.files)} />
                </label>
              </div>
              {(formData.attachments || []).length === 0 ? (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border-main rounded-2xl bg-bg-2/50 text-text-3 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all cursor-pointer">
                  <Plus className="w-8 h-8 mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">Click to upload files</span>
                  <input type="file" multiple className="hidden" onChange={e => handleFileAttach(e.target.files)} />
                </label>
              ) : (
                <div className="space-y-2">
                  {(formData.attachments as FileAttachment[]).map((att, i) => (
                    <div key={i} className="flex items-center justify-between bg-bg-2 rounded-xl px-4 py-3 border border-border-main group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-text-1 truncate">{att.name}</span>
                          {att.size && <span className="text-[10px] font-mono text-text-3">{(att.size / 1024).toFixed(1)} KB</span>}
                        </div>
                      </div>
                      <button onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_: any, idx: number) => idx !== i) }))} className="p-2 text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
                <Layers className="w-5 h-5 text-purple-500" /> 2. Additional Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {right.map(f => (
                  <Field key={f.key} label={f.label} required={f.required} span2={f.type === 'textarea'}>
                    {renderInput(f)}
                  </Field>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LIST VIEW  (matches Inspection list page exactly)
  // ──────────────────────────────────────────────────────────────────────────

  // Build 4-card metrics like Inspection
  const total   = filteredRecords.length;
  const allRecs = records.length;
  const lastStatus   = config.statusOptions[config.statusOptions.length - 1];
  const firstStatus  = config.statusOptions[0];
  const closedCount  = records.filter(r => r.status === lastStatus).length;
  const openCount    = records.filter(r => r.status === firstStatus).length;
  const otherCount   = records.length - closedCount - openCount;

  const metricCards = [
    { label: 'Total Records',      value: allRecs,   icon: BarChart3,    color: 'text-accent',    bg: 'bg-accent/10' },
    { label: firstStatus,          value: openCount,  icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'In Progress',        value: otherCount > 0 ? otherCount : 0, icon: Activity, color: 'text-sky-500',   bg: 'bg-sky-500/10' },
    { label: lastStatus,           value: closedCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      
      {/* ── Page Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Icon className="w-8 h-8 text-accent" />
            {config.title}
          </h1>
          <p className="text-text-2 text-base mt-2">{config.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn btn-ghost flex items-center gap-2 border border-border-main">
              <Download className="w-4 h-4" /> Export
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-2 bg-bg-1 border border-border-main rounded-xl shadow-xl z-30 min-w-[180px] overflow-hidden">
                  <button onClick={() => exportToPDF(filteredRecords)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <File className="w-4 h-4" /> Export PDF
                  </button>
                  <button onClick={() => exportToExcel(filteredRecords)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <FileSpreadsheet className="w-4 h-4" /> Export Excel
                  </button>
                  <button onClick={() => exportToCSV(filteredRecords)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-2 hover:bg-accent/10 hover:text-accent transition-all">
                    <FileText className="w-4 h-4" /> Export CSV
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={openCreate} className="btn btn-primary flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" /> New {config.title}
          </button>
        </div>
      </motion.div>

      {/* ── Metrics Dashboard (4 cards like Inspection) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metricCards.map((m, idx) => (
          <motion.div key={idx} variants={itemVariants}
            className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${m.bg} ${m.color}`}>
              <m.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{m.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{m.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${config.title.toLowerCase()} records…`}
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-accent"><X className="w-4 h-4" /></button>}
        </div>

        <div className="w-px h-8 bg-border-main hidden md:block" />

        {/* Status filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-bg-2 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none appearance-none text-text-1 w-44">
            <option value="All">All Statuses</option>
            {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Bulk actions if selection */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-bold text-accent">{selectedIds.size} selected</span>
            <button onClick={() => exportToPDF(filteredRecords.filter(r => selectedIds.has(r.id)))}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-accent/30 text-accent hover:bg-accent/10 rounded-xl transition-all uppercase">
              <File className="w-3 h-3" /> PDF
            </button>
            <button onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all uppercase">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="text-text-3 hover:text-text-1 ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Main Table ── */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-xs uppercase tracking-wider text-text-2 font-semibold">
                <th className="p-5 w-10">
                  <button onClick={toggleSelectAll} className="text-text-3 hover:text-accent transition-colors">
                    {selectedIds.size === filteredRecords.length && filteredRecords.length > 0
                      ? <CheckSquare className="w-4 h-4 text-accent" />
                      : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-5 cursor-pointer hover:text-accent transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">ID {sortKey === 'id' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                </th>
                {tableFields.map(f => (
                  <th key={f.key} className="p-5 cursor-pointer hover:text-accent transition-colors whitespace-nowrap" onClick={() => handleSort(f.key)}>
                    <div className="flex items-center gap-1">{f.label} {sortKey === f.key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}</div>
                  </th>
                ))}
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              <AnimatePresence>
                {filteredRecords.length === 0 ? (
                  <motion.tr>
                    <td colSpan={tableFields.length + 4} className="p-16 text-center text-text-2 bg-bg-1">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="w-10 h-10 opacity-20" />
                        <p className="font-bold text-lg text-text-1">No records found</p>
                        <p className="text-sm text-text-3">Create your first {config.title} record</p>
                        <button onClick={openCreate} className="btn btn-primary flex items-center gap-2 mt-2">
                          <Plus className="w-4 h-4" /> Create Record
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredRecords.map(record => {
                    const sc = getStatusColor(record.status);
                    return (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout
                        className="hover:bg-bg-2/80 transition-colors cursor-pointer group"
                        onClick={() => openDetail(record)}
                      >
                        <td className="p-5" onClick={e => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(record.id)} className="text-text-3 hover:text-accent transition-colors">
                            {selectedIds.has(record.id) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="p-5">
                          <div className="font-mono font-bold text-text-1 group-hover:text-accent transition-colors">{record.id}</div>
                          <div className="text-xs text-text-3 font-medium mt-1">{formatDate(record.createdAt)}</div>
                        </td>
                        {tableFields.map(f => (
                          <td key={f.key} className="p-5">
                            <span className="text-sm text-text-1 font-medium truncate block max-w-[200px]" title={String(record[f.key] ?? '')}>
                              {f.type === 'date' ? formatDate(record[f.key]) : (record[f.key] ?? '—')}
                            </span>
                          </td>
                        ))}
                        <td className="p-5" onClick={e => e.stopPropagation()}>
                          <select value={record.status}
                            onChange={e => { e.stopPropagation(); handleStatusChange(record.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            className={`text-[11px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider appearance-none cursor-pointer transition-all outline-none ${sc.badge}`}>
                            {config.statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-5 text-right font-medium">
                          <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                            <button title="View Details" onClick={() => openDetail(record)}
                              className="p-2 text-text-2 hover:bg-accent/10 hover:text-accent rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button title="Edit Record" onClick={() => openEdit(record)}
                              className="p-2 text-text-2 hover:bg-sky-500/10 hover:text-sky-500 rounded-lg transition-all">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button title="Download PDF" onClick={() => exportSinglePDF(record)}
                              className="p-2 text-text-2 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-lg transition-all">
                              <FileDown className="w-4 h-4" />
                            </button>
                            <button title="Delete" onClick={() => setShowDeleteConfirm(record.id)}
                              className="p-2 text-text-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="bg-bg-2/40 border-t border-border-main px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-text-3 font-medium">
            Showing {filteredRecords.length} of {records.length} records
          </span>
          {selectedIds.size > 0 && (
            <span className="text-xs font-bold text-accent">{selectedIds.size} selected</span>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {(showDeleteConfirm || showBulkDeleteConfirm) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-1 border border-border-main rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-1 mb-1">Confirm Deletion</h3>
                  <p className="text-sm text-text-3 leading-relaxed">
                    {showBulkDeleteConfirm ? `Delete ${selectedIds.size} selected records?` : 'Delete this record? This cannot be undone.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setShowDeleteConfirm(null); setShowBulkDeleteConfirm(false); }}
                  className="btn btn-ghost border border-border-main">Cancel</button>
                <button onClick={() => showBulkDeleteConfirm ? handleBulkDelete() : showDeleteConfirm && handleDelete(showDeleteConfirm)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 shadow-lg transition-all">
                  {showBulkDeleteConfirm ? `Delete ${selectedIds.size} Records` : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
