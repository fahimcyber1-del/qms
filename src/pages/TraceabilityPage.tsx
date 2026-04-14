import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Link, TrendingUp, Plus, Edit2, 
  Trash2, Eye, Search, FileDown, ChevronLeft, 
  MessageSquare, User, Calendar, Clock, Download, FileSpreadsheet, Send, Save, ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TraceabilityRecord, TraceabilityStep, Comment } from '../types';
import { db } from '../db/db';

const DEFAULT_RECORD: TraceabilityRecord = {
  id: '',
  code: '',
  poNumber: '',
  styleNumber: '',
  buyer: '',
  orderQuantity: 0,
  currentStage: 'Fabric',
  status: 'In Progress',
  identifiedDate: new Date().toISOString().split('T')[0],
  targetDate: '',
  responsiblePerson: '',
  fabricStage: { date: '', department: 'Fabric Store', operator: '', details: '', status: 'Pending', documents: [], rollNumber: '', supplier: '', lotNumber: '' },
  cuttingStage: { date: '', department: 'Cutting', operator: '', details: '', status: 'Pending', documents: [], bundleNumber: '', cutQuantity: 0 },
  sewingStage: { date: '', department: 'Sewing', operator: '', details: '', status: 'Pending', documents: [], lineNumber: '', machineId: '' },
  finishingStage: { date: '', department: 'Finishing', operator: '', details: '', status: 'Pending', documents: [], batchNumber: '' },
  packingStage: { date: '', department: 'Packing', operator: '', details: '', status: 'Pending', documents: [], cartonNumber: '' },
  shipmentStage: { date: '', department: 'Shipment', operator: '', details: '', status: 'Pending', documents: [], destination: '', containerNumber: '' },
  comments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const STAGE_COLORS: Record<string, string> = {
  'Fabric': 'bg-slate-100 text-slate-700 border-slate-200',
  'Cutting': 'bg-blue-50 text-blue-700 border-blue-200',
  'Sewing': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Finishing': 'bg-purple-50 text-purple-700 border-purple-200',
  'Packing': 'bg-amber-50 text-amber-700 border-amber-200',
  'Shipped': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_COLORS: Record<string, string> = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function TraceabilityPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<TraceabilityRecord[]>([]);
  const [mode, setMode] = useState<'list' | 'view' | 'form'>('list');
  const [selectedRecord, setSelectedRecord] = useState<TraceabilityRecord | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<TraceabilityRecord>(DEFAULT_RECORD);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const all = await db.traceability.toArray();
      // Insert mock if empty for demo purposes
      if (all.length === 0) {
        const mocks: TraceabilityRecord[] = [
          {
            ...DEFAULT_RECORD,
            id: crypto.randomUUID(),
            code: 'TRC-001',
            poNumber: 'PO-99123',
            styleNumber: 'AW26-Jacket',
            buyer: 'H&M',
            orderQuantity: 5000,
            currentStage: 'Sewing',
            status: 'In Progress',
            fabricStage: { ...DEFAULT_RECORD.fabricStage, status: 'Pass', details: 'Cotton twill received and inspected', rollNumber: 'R-1002', supplier: 'Texco', lotNumber: 'L-202' },
            cuttingStage: { ...DEFAULT_RECORD.cuttingStage, status: 'Pass', details: 'Cut to marker 1', bundleNumber: 'B-01', cutQuantity: 5000 },
            createdAt: new Date().toISOString()
          },
          {
            ...DEFAULT_RECORD,
            id: crypto.randomUUID(),
            code: 'TRC-002',
            poNumber: 'PO-55120',
            styleNumber: 'Polo-Summer',
            buyer: 'Zara',
            orderQuantity: 2500,
            currentStage: 'Fabric',
            status: 'In Progress',
            fabricStage: { ...DEFAULT_RECORD.fabricStage, status: 'Pending', details: 'Jersey knit pending lab test result', rollNumber: 'R-555', supplier: 'KnitPro', lotNumber: 'KP-009' },
            createdAt: new Date().toISOString()
          }
        ];
        await db.traceability.bulkAdd(mocks);
        setRecords(mocks);
      } else {
        setRecords(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (e) {
      console.error("Failed to load traceability records", e);
    }
  };

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.styleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.buyer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStage = filterStage === 'All' || r.currentStage === filterStage;
      const matchStat = filterStatus === 'All' || r.status === filterStatus;
      return matchSearch && matchStage && matchStat;
    });
  }, [records, searchTerm, filterStage, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      inProgress: records.filter(r => r.status === 'In Progress').length,
      shipped: records.filter(r => r.currentStage === 'Shipped').length,
    };
  }, [records]);

  const handleAdd = () => {
    setFormData({
      ...DEFAULT_RECORD,
      code: `TRC-${String(records.length + 1).padStart(3, '0')}`,
      id: crypto.randomUUID(),
      identifiedDate: new Date().toISOString().split('T')[0]
    });
    setMode('form');
  };

  const handleEdit = (r: TraceabilityRecord) => {
    setFormData({ ...r });
    setMode('form');
  };

  const handleView = (r: TraceabilityRecord) => {
    setSelectedRecord(r);
    setMode('view');
  };

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm(`Delete ${ids.length} record(s)?`)) return;
    try {
      await db.traceability.bulkDelete(ids);
      await loadRecords();
      setSelectedIds([]);
      if (selectedRecord && ids.includes(selectedRecord.id)) {
        setMode('list');
        setSelectedRecord(null);
      }
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  const handleSave = async () => {
    if (!formData.poNumber || !formData.styleNumber) {
      alert("PO Number and Style Number are required!");
      return;
    }
    try {
      const toSave = { ...formData, updatedAt: new Date().toISOString() };
      await db.traceability.put(toSave);
      await loadRecords();
      if (mode === 'form') setMode('list');
      if (selectedRecord && selectedRecord.id === toSave.id) setSelectedRecord(toSave);
    } catch (e) {
      console.error("Save failed", e);
      alert('Save failed');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const rec = records.find(r => r.id === id);
    if (!rec) return;
    rec.status = newStatus as any;
    rec.updatedAt = new Date().toISOString();
    await db.traceability.put(rec);
    setRecords([...records]);
    if (selectedRecord?.id === id) setSelectedRecord({ ...rec });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedRecord) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userName: 'Current User', 
      text: newComment,
      createdAt: new Date().toISOString()
    };
    const rec = { ...selectedRecord, comments: [...selectedRecord.comments, comment], updatedAt: new Date().toISOString() };
    await db.traceability.put(rec);
    setSelectedRecord(rec);
    setRecords(records.map(r => r.id === rec.id ? rec : r));
    setNewComment('');
  };

  const handleExportExcel = () => {
    const dataToExport = (selectedIds.length > 0 ? records.filter(r => selectedIds.includes(r.id)) : filtered).map(r => ({
      Code: r.code,
      'PO Number': r.poNumber,
      'Style': r.styleNumber,
      'Buyer': r.buyer,
      'Qty': r.orderQuantity,
      'Stage': r.currentStage,
      'Status': r.status,
      'Target Date': r.targetDate
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Traceability");
    XLSX.writeFile(wb, "Traceability_Register.xlsx");
  };

  const handleExportPDF = async (record?: TraceabilityRecord) => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    if (record) {
      const doc = createDoc({ orientation: 'l', paperSize: 'a4' });
      let y = drawPdfHeader(doc, 'Traceability Report', `Ref: ${record.code} | PO: ${record.poNumber}`);

      y = drawInfoGrid(doc, y, [
        { label: 'Style Number',    value: record.styleNumber },
        { label: 'Buyer',           value: record.buyer },
        { label: 'Order Quantity',  value: String(record.orderQuantity) },
        { label: 'Current Stage',   value: record.currentStage },
        { label: 'Status',          value: record.status },
        { label: 'Target Date',     value: record.targetDate || '—' },
        { label: 'Responsible',     value: record.responsiblePerson || '—' },
        { label: 'Start Date',      value: record.identifiedDate },
      ]);

      y = drawSectionLabel(doc, y, 'Production Stage Traceability');
      y = proTable(doc, y,
        [['Stage', 'Status', 'Date', 'Key Info', 'Details']],
        [
          ['Fabric',    record.fabricStage.status,    record.fabricStage.date,    `Roll: ${record.fabricStage.rollNumber}`,     record.fabricStage.details],
          ['Cutting',   record.cuttingStage.status,   record.cuttingStage.date,   `Bundle: ${record.cuttingStage.bundleNumber}`, record.cuttingStage.details],
          ['Sewing',    record.sewingStage.status,    record.sewingStage.date,    `Line: ${record.sewingStage.lineNumber}`,      record.sewingStage.details],
          ['Finishing', record.finishingStage.status, record.finishingStage.date, `Batch: ${record.finishingStage.batchNumber}`, record.finishingStage.details],
          ['Packing',   record.packingStage.status,   record.packingStage.date,   `Carton: ${record.packingStage.cartonNumber}`, record.packingStage.details],
          ['Shipment',  record.shipmentStage.status,  record.shipmentStage.date,  `Dest: ${record.shipmentStage.destination}`,   record.shipmentStage.details],
        ]
      ) + 6;

      drawSignatureRow(doc, y, ['QC Manager', 'Production Manager', 'Authorized By']);
      addPageFooters(doc);
      doc.save(`${record.code}_Traceability.pdf`);
    } else {
      const dataToExport = selectedIds.length > 0 ? records.filter(r => selectedIds.includes(r.id)) : filtered;
      const doc = createDoc({ orientation: 'l', paperSize: 'a4' });
      let y = drawPdfHeader(doc, 'Traceability Register', `${dataToExport.length} records | Generated: ${new Date().toLocaleDateString()}`);
      y = proTable(doc, y,
        [['Code', 'PO Number', 'Style', 'Buyer', 'Qty', 'Stage', 'Status', 'Target Date']],
        dataToExport.map(r => [r.code, r.poNumber, r.styleNumber, r.buyer, String(r.orderQuantity), r.currentStage, r.status, r.targetDate || '—'])
      ) + 6;
      addPageFooters(doc);
      doc.save('Traceability_Register.pdf');
    }
  };


  const inputClass = "w-full px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-text-2 mb-1.5 uppercase tracking-wide";

  if (mode === 'list') return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <Link className="w-7 h-7 text-accent" /> Product Traceability
          </h1>
          <p className="text-text-3 text-sm mt-1">ISO 9001:2015 Identification & Traceability Log</p>
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
            <Plus className="w-4 h-4" /> New Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Total Orders', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Shipped', value: stats.shipped, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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

      <div className="bg-bg-1 border border-border-main p-4 rounded-2xl flex flex-wrap gap-4 shadow-sm items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search PO, style, buyer..." className={`${inputClass} pl-10`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className={inputClass + " w-auto min-w-[150px] font-bold"} value={filterStage} onChange={e => setFilterStage(e.target.value)}>
          <option value="All">All Stages</option>
          <option value="Fabric">Fabric</option>
          <option value="Cutting">Cutting</option>
          <option value="Sewing">Sewing</option>
          <option value="Finishing">Finishing</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
        </select>
        <select className={inputClass + " w-auto min-w-[150px] font-bold"} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

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
                <th className="p-4">Reference / Info</th>
                <th className="p-4">PO & Style</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-3 font-medium">
                    <Link className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No traces found matching criteria.
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
                    <div className="font-semibold text-text-1 text-sm">{r.buyer}</div>
                    <div className="text-[10px] text-text-3 tracking-wide mt-1">Qty: {r.orderQuantity}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-text-1 text-sm">{r.poNumber}</div>
                    <div className="text-xs text-text-2 mt-0.5">{r.styleNumber}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${STAGE_COLORS[r.currentStage]}`}>
                      {r.currentStage}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select 
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border outline-none cursor-pointer ${STATUS_COLORS[r.status]}`}
                      value={r.status}
                      onChange={e => handleStatusChange(r.id, e.target.value)}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STAGE_COLORS[selectedRecord.currentStage]}`}>{selectedRecord.currentStage}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[selectedRecord.status]}`}>{selectedRecord.status}</span>
            </div>
            <h1 className="text-xl font-black text-text-1 tracking-tight">PO: {selectedRecord.poNumber} | {selectedRecord.styleNumber}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-1 border border-border-main text-text-2 rounded-xl text-sm font-medium hover:text-accent transition-colors" onClick={() => handleEdit(selectedRecord)}>
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={() => handleExportPDF(selectedRecord)}>
            <FileDown className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-bg-2/30 px-6 py-4 border-b border-border-main">
              <h3 className="font-bold text-text-1 text-sm flex items-center gap-2">Order Information</h3>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Buyer / Brand</p><p className="text-sm font-medium mt-1 uppercase text-text-1">{selectedRecord.buyer}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Order Quantity</p><p className="text-sm font-medium mt-1 text-text-1">{selectedRecord.orderQuantity} pcs</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Responsible</p><p className="text-sm font-medium mt-1 flex items-center gap-1.5"><User className="w-4 h-4 opacity-50 text-accent" /> {selectedRecord.responsiblePerson || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-bold text-text-3 uppercase tracking-wide">Target Date</p><p className="text-sm font-medium mt-1 flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-50 text-accent" /> {selectedRecord.targetDate || 'Not Set'}</p></div>
            </div>
          </div>

          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-text-1 text-sm mb-6 flex items-center gap-2">Traceability Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-main before:to-transparent">
               {[
                 { stage: 'Fabric', data: selectedRecord.fabricStage, extra: `Roll: ${selectedRecord.fabricStage.rollNumber}` },
                 { stage: 'Cutting', data: selectedRecord.cuttingStage, extra: `Bundle: ${selectedRecord.cuttingStage.bundleNumber}` },
                 { stage: 'Sewing', data: selectedRecord.sewingStage, extra: `Line: ${selectedRecord.sewingStage.lineNumber}` },
                 { stage: 'Finishing', data: selectedRecord.finishingStage, extra: `Batch: ${selectedRecord.finishingStage.batchNumber}` },
                 { stage: 'Packing', data: selectedRecord.packingStage, extra: `Carton: ${selectedRecord.packingStage.cartonNumber}` },
                 { stage: 'Shipment', data: selectedRecord.shipmentStage, extra: `Dest: ${selectedRecord.shipmentStage.destination}` },
               ].map((item, idx) => (
                 <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bg-1 bg-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-white font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-bg-2 p-4 rounded-xl border border-border-main shadow-sm">
                      <div className="flex items-center justify-between">
                         <span className="font-bold text-sm text-text-1">{item.stage}</span>
                         <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.data.status === 'Pass' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : item.data.status === 'Fail' ? 'text-red-600 bg-red-50 border-red-200' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>{item.data.status}</span>
                      </div>
                      <div className="mt-2 text-xs text-text-2 space-y-1">
                        <p><span className="font-medium">Date:</span> {item.data.date || 'N/A'}</p>
                        <p><span className="font-medium font-mono text-accent">{item.extra}</span></p>
                        {item.data.details && <p className="pt-1 mt-1 border-t border-border-main/50 italic opacity-80">{item.data.details}</p>}
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-border-main">
              <h3 className="font-bold text-text-1 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" /> Activity & Comments
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedRecord.comments.length === 0 ? (
                <div className="text-xs text-text-3 text-center py-8 bg-bg-2/30 rounded-xl border border-dashed border-border-main">
                  No activity logs attached to this trace.
                </div>
              ) : selectedRecord.comments.map(c => (
                <div key={c.id} className="bg-bg-2 p-4 rounded-xl border border-border-main">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-text-1">{c.userName}</span>
                    <span className="text-[10px] uppercase font-bold text-text-3">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">{c.text}</p>
                </div>
              ))}
              <div className="flex gap-2 pt-4 border-t border-border-main mt-4">
                <input className={inputClass} placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                <button className="px-5 bg-accent text-white rounded-xl hover:opacity-90 flex items-center shadow-sm" onClick={handleAddComment}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm p-6">
            <h4 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3">Overall Stage & Status</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-3 uppercase tracking-wide mb-1">Current Stage</label>
                <select className={`${inputClass} font-bold`} value={selectedRecord.currentStage} onChange={e => {
                  const rec = { ...selectedRecord, currentStage: e.target.value as any };
                  setSelectedRecord(rec); db.traceability.put(rec); setRecords(records.map(r => r.id === rec.id ? rec : r));
                }}>
                  {['Fabric', 'Cutting', 'Sewing', 'Finishing', 'Packing', 'Shipped'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-3 uppercase tracking-wide mb-1">Status</label>
                <select className={`${inputClass} font-bold`} value={selectedRecord.status} onChange={e => handleStatusChange(selectedRecord.id, e.target.value)}>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-bg-1 border border-border-main p-4 md:px-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 bg-bg-2 border border-border-main rounded-xl hover:text-accent hover:border-accent/50 transition-colors" onClick={() => setMode('list')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-text-1">{formData.poNumber ? 'Edit Traceability' : 'New Traceability Track'}</h1>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium shadow-sm w-full md:w-auto justify-center" onClick={handleSave}>
          <Save className="w-4 h-4" /> Save Trace
        </button>
      </div>

      <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm">
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className={labelClass}>PO Number *</label><input className={inputClass} value={formData.poNumber} onChange={e => setFormData({ ...formData, poNumber: e.target.value })} placeholder="PO-12345" /></div>
            <div><label className={labelClass}>Style Number *</label><input className={inputClass} value={formData.styleNumber} onChange={e => setFormData({ ...formData, styleNumber: e.target.value })} placeholder="Style-A" /></div>
            <div><label className={labelClass}>Buyer / Brand</label><input className={inputClass} value={formData.buyer} onChange={e => setFormData({ ...formData, buyer: e.target.value })} placeholder="Brand X" /></div>
            <div><label className={labelClass}>Order Quantity</label><input type="number" className={inputClass} value={formData.orderQuantity || ''} onChange={e => setFormData({ ...formData, orderQuantity: Number(e.target.value) })} /></div>
            <div><label className={labelClass}>Target Date</label><input type="date" className={inputClass} value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} /></div>
            <div><label className={labelClass}>Responsible PIC</label><input className={inputClass} value={formData.responsiblePerson} onChange={e => setFormData({ ...formData, responsiblePerson: e.target.value })} /></div>
          </div>
          
          <div className="border-t border-border-main pt-8 space-y-8">
             {/* FABRIC STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">1. Fabric Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.fabricStage.status} onChange={e => setFormData({ ...formData, fabricStage: { ...formData.fabricStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.fabricStage.date} onChange={e => setFormData({ ...formData, fabricStage: { ...formData.fabricStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Supplier</label><input className={inputClass} value={formData.fabricStage.supplier} onChange={e => setFormData({ ...formData, fabricStage: { ...formData.fabricStage, supplier: e.target.value }})} /></div>
                 <div><label className={labelClass}>Roll Number</label><input className={inputClass} value={formData.fabricStage.rollNumber} onChange={e => setFormData({ ...formData, fabricStage: { ...formData.fabricStage, rollNumber: e.target.value }})} /></div>
                 <div className="md:col-span-4"><label className={labelClass}>Details</label><input className={inputClass} value={formData.fabricStage.details} onChange={e => setFormData({ ...formData, fabricStage: { ...formData.fabricStage, details: e.target.value }})} placeholder="Notes, composition, lot number etc." /></div>
               </div>
             </div>

             {/* CUTTING STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">2. Cutting Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.cuttingStage.status} onChange={e => setFormData({ ...formData, cuttingStage: { ...formData.cuttingStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.cuttingStage.date} onChange={e => setFormData({ ...formData, cuttingStage: { ...formData.cuttingStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Bundle Number</label><input className={inputClass} value={formData.cuttingStage.bundleNumber} onChange={e => setFormData({ ...formData, cuttingStage: { ...formData.cuttingStage, bundleNumber: e.target.value }})} /></div>
                 <div><label className={labelClass}>Cut Quantity</label><input type="number" className={inputClass} value={formData.cuttingStage.cutQuantity || ''} onChange={e => setFormData({ ...formData, cuttingStage: { ...formData.cuttingStage, cutQuantity: Number(e.target.value) }})} /></div>
                 <div className="md:col-span-4"><label className={labelClass}>Details</label><input className={inputClass} value={formData.cuttingStage.details} onChange={e => setFormData({ ...formData, cuttingStage: { ...formData.cuttingStage, details: e.target.value }})} /></div>
               </div>
             </div>

              {/* SEWING STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">3. Sewing Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.sewingStage.status} onChange={e => setFormData({ ...formData, sewingStage: { ...formData.sewingStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.sewingStage.date} onChange={e => setFormData({ ...formData, sewingStage: { ...formData.sewingStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Line Number</label><input className={inputClass} value={formData.sewingStage.lineNumber} onChange={e => setFormData({ ...formData, sewingStage: { ...formData.sewingStage, lineNumber: e.target.value }})} /></div>
                 <div><label className={labelClass}>Details</label><input className={inputClass} value={formData.sewingStage.details} onChange={e => setFormData({ ...formData, sewingStage: { ...formData.sewingStage, details: e.target.value }})} /></div>
               </div>
             </div>

             {/* FINISHING STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">4. Finishing Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.finishingStage.status} onChange={e => setFormData({ ...formData, finishingStage: { ...formData.finishingStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.finishingStage.date} onChange={e => setFormData({ ...formData, finishingStage: { ...formData.finishingStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Batch Number</label><input className={inputClass} value={formData.finishingStage.batchNumber} onChange={e => setFormData({ ...formData, finishingStage: { ...formData.finishingStage, batchNumber: e.target.value }})} /></div>
                 <div><label className={labelClass}>Details</label><input className={inputClass} value={formData.finishingStage.details} onChange={e => setFormData({ ...formData, finishingStage: { ...formData.finishingStage, details: e.target.value }})} /></div>
               </div>
             </div>
             
             {/* PACKING STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">5. Packing Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.packingStage.status} onChange={e => setFormData({ ...formData, packingStage: { ...formData.packingStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.packingStage.date} onChange={e => setFormData({ ...formData, packingStage: { ...formData.packingStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Carton Number</label><input className={inputClass} value={formData.packingStage.cartonNumber} onChange={e => setFormData({ ...formData, packingStage: { ...formData.packingStage, cartonNumber: e.target.value }})} /></div>
                 <div><label className={labelClass}>Details</label><input className={inputClass} value={formData.packingStage.details} onChange={e => setFormData({ ...formData, packingStage: { ...formData.packingStage, details: e.target.value }})} /></div>
               </div>
             </div>

             {/* SHIPMENT STAGE */}
             <div className="bg-bg-2 border border-border-main p-5 rounded-xl">
               <h4 className="text-sm font-bold text-accent mb-4 border-b border-border-main pb-2">6. Shipment Stage</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div><label className={labelClass}>Status</label><select className={inputClass} value={formData.shipmentStage.status} onChange={e => setFormData({ ...formData, shipmentStage: { ...formData.shipmentStage, status: e.target.value as any }})}><option>Pending</option><option>Pass</option><option>Fail</option></select></div>
                 <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={formData.shipmentStage.date} onChange={e => setFormData({ ...formData, shipmentStage: { ...formData.shipmentStage, date: e.target.value }})} /></div>
                 <div><label className={labelClass}>Destination</label><input className={inputClass} value={formData.shipmentStage.destination} onChange={e => setFormData({ ...formData, shipmentStage: { ...formData.shipmentStage, destination: e.target.value }})} /></div>
                 <div><label className={labelClass}>Container</label><input className={inputClass} value={formData.shipmentStage.containerNumber} onChange={e => setFormData({ ...formData, shipmentStage: { ...formData.shipmentStage, containerNumber: e.target.value }})} /></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
