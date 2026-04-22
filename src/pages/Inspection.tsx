import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExportModal } from '../components/ExportModal';
import { Pagination } from '../components/Pagination';
import { 
  Search, Plus, Trash2, Edit2, Download, Filter, 
  BarChart3, CheckCircle2, XCircle, AlertTriangle, 
  ClipboardCheck, Eye, FileDown, Calendar
} from 'lucide-react';
import { AQLInspectionRecord } from '../types';
import { db } from '../db/db';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const MOCK_INSPECTIONS: AQLInspectionRecord[] = [
  {
    id: 'AQL-1001',
    type: 'Final',
    buyer: 'H&M',
    style: 'TS-2024-RED',
    order: 'ORD-771',
    line: 'Line-05',
    inspector: 'Kamrul Islam',
    aqlLevel: '2.5',
    sampleSize: 125,
    orderQty: 2500,
    inspectionQty: 125,
    passQty: 123,
    failQty: 2,
    criticalDefect: 0,
    majorDefect: 1,
    minorDefect: 1,
    crdDate: new Date().toISOString().split('T')[0],
    remarks: 'Approved',
    createdAt: new Date().toISOString(),
    attachments: [],
    inspectionLevel: 'II',
    result: 'PASS',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'AQL-1002',
    type: 'Inline',
    buyer: 'Zara',
    style: 'PL-SUMMER',
    order: 'ORD-882',
    line: 'Line-12',
    inspector: 'Admin',
    aqlLevel: '1.5',
    sampleSize: 80,
    orderQty: 1000,
    inspectionQty: 80,
    passQty: 75,
    failQty: 5,
    criticalDefect: 1,
    majorDefect: 2,
    minorDefect: 2,
    crdDate: new Date().toISOString().split('T')[0],
    remarks: 'Re-inspection needed',
    createdAt: new Date().toISOString(),
    attachments: [],
    inspectionLevel: 'II',
    result: 'FAIL',
    updatedAt: new Date().toISOString()
  }
];

export function Inspection({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [inspections, setInspections] = useState<AQLInspectionRecord[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Universal Sync: Read from LS, which migrator ported to Dexie.
    const stored = localStorage.getItem('garmentqms_inspections');
    if (stored) {
      setInspections(JSON.parse(stored));
    } else {
      setInspections(MOCK_INSPECTIONS);
      localStorage.setItem('garmentqms_inspections', JSON.stringify(MOCK_INSPECTIONS));
    }
  }, []);

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => {
      const matchesType = activeType === 'All' || i.type === activeType;
      const matchesSearch = (i.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (i.buyer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (i.style || '').toLowerCase().includes(searchQuery.toLowerCase());
      const dateVal = i.updatedAt ? i.updatedAt.split('T')[0] : '';
      const matchesDate = (!startDate || dateVal >= startDate) && 
                          (!endDate || dateVal <= endDate);
      return matchesType && matchesSearch && matchesDate;
    });
  }, [inspections, activeType, searchQuery, startDate, endDate]);

  const paginatedInspections = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInspections.slice(startIndex, startIndex + pageSize);
  }, [filteredInspections, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredInspections.length / pageSize);

  const metrics = useMemo(() => {
    const total = filteredInspections.length;
    const pass = filteredInspections.filter(i => i.result === 'PASS').length;
    const fail = filteredInspections.filter(i => i.result === 'FAIL').length;
    const totalInspQty = filteredInspections.reduce((sum, i) => sum + (i.inspectionQty || 0), 0);
    const totalFailQty = filteredInspections.reduce((sum, i) => sum + (i.failQty || 0), 0);
    const dhu = totalInspQty > 0 ? ((totalFailQty / totalInspQty) * 100).toFixed(2) : '0.00';
    return { total, pass, fail, dhu };
  }, [filteredInspections]);

  const handleNavigateToForm = (mode: 'create' | 'edit' | 'view', data?: AQLInspectionRecord) => {
    onNavigate('inspection-form', { mode, data });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this inspection record?')) {
      const updated = inspections.filter(i => i.id !== id);
      setInspections(updated);
      localStorage.setItem('garmentqms_inspections', JSON.stringify(updated));
      db.aqlInspections.delete(id).catch(err => console.error("Dexie delete error", err));
    }
  };

  const exportPDF = async (record: AQLInspectionRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    const { getSamplingPlan } = await import('../utils/inspectionUtils');
    
    const plan = getSamplingPlan(record.inspectionQty || 0, record.aqlLevel || '2.5');

    await exportDetailToPDF({
      moduleName: 'AQL Inspection Certificate',
      moduleId: 'inspection',
      recordId: record.id,
      fileName: `AQL_${record.id}`,
      fields: [
        { label: 'Inspection Type', value: record.type },
        { label: 'Date',            value: record.updatedAt?.split('T')[0] || '—' },
        { label: 'Style/Order',      value: `${record.style || ''} ${record.order ? '/ ' + record.order : ''}` },
        { label: 'Buyer',           value: record.buyer || '—' },
        { label: 'Lot Size',        value: String(record.orderQty) },
        { label: 'Sample Size',     value: String(record.sampleSize) },
        { label: 'Result',          value: record.result },
        { label: 'Insp. Qty',       value: String(record.inspectionQty) },
        { label: 'Fail Qty',        value: String(record.failQty) },
        { label: 'DHU%',            value: `${((record.failQty || 0) / (record.inspectionQty || 1) * 100).toFixed(2)}%` },
        { label: 'Critical Defects', value: String(record.criticalDefect || 0) },
        { label: 'Major/Minor AC',  value: String(plan.ac) },
        { label: 'Major/Minor RE',  value: String(plan.re) },
      ],
      attachments: record.attachments?.map(a => typeof a === 'string' ? { name: 'Photo', data: a } : a),
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-accent" />
            Quality Inspections (AQL)
          </h1>
          <p className="text-text-2 text-base mt-2">Comprehensive tracking of statistical inline, endline, and final audits.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2 border border-border-main" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4" /> Global Export
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-md" onClick={() => handleNavigateToForm('create')}>
            <Plus className="w-4 h-4" /> New Inspection
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Inspections', value: metrics.total, icon: BarChart3, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Lots Passed', value: metrics.pass, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Lots Failed', value: metrics.fail, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Global DHU', value: `${metrics.dhu}%`, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

      {/* Toolbar Layer */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Filter via System ID, Buyer, or Garment Style..." 
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
          <div className="relative flex-1 md:flex-none">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
            <select 
              className="w-full md:w-40 bg-bg-2 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none appearance-none text-text-1" 
              value={activeType} 
              onChange={(e) => {
                setActiveType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Tiers</option>
              <option value="Inline">Inline</option>
              <option value="Endline">Endline</option>
              <option value="Pre Final">Pre Final</option>
              <option value="Final">Final</option>
              <option value="AQL">AQL</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-bg-2 px-3 py-1.5 rounded-xl flex-1 md:flex-none">
            <Calendar className="w-4 h-4 text-text-2" />
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={startDate} onChange={(e) => {setStartDate(e.target.value); setCurrentPage(1);}} />
            <span className="text-text-2 text-sm px-1">-</span>
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={endDate} onChange={(e) => {setEndDate(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>
      </motion.div>

      {/* Main Relational Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-xs uppercase tracking-wider text-text-2 font-semibold">
                <th className="p-5">Audit Identity</th>
                <th className="p-5">Tier</th>
                <th className="p-5">Product Target</th>
                <th className="p-5">Sampling</th>
                <th className="p-5">Defects (C/M/Mi)</th>
                <th className="p-5">Grading</th>
                <th className="p-5 text-right w-[200px]">Data Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              <AnimatePresence>
                {paginatedInspections.length === 0 ? (
                  <motion.tr>
                    <td colSpan={7} className="p-16 text-center text-text-2 bg-bg-1">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="w-10 h-10 opacity-20" />
                        <p className="font-bold text-lg text-text-1">No AQL packets found matching query.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : paginatedInspections.map(row => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout
                    key={row.id} 
                    className="hover:bg-bg-2/80 transition-colors cursor-pointer group" 
                    onClick={() => handleNavigateToForm('view', row)}
                  >
                    <td className="p-5">
                      <div className="font-mono font-bold text-text-1">{row.id}</div>
                      <div className="text-xs text-text-3 font-medium mt-1">{row.updatedAt.split('T')[0]} • {row.inspector}</div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-bg-3 text-text-1 border border-border-main drop-shadow-sm">
                        {row.type}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-text-1 group-hover:text-accent transition-colors">{row.buyer} - {row.style}</div>
                      <div className="text-xs text-text-3 font-medium mt-0.5">Line mapping: {row.line}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] text-text-3 uppercase tracking-wider font-bold mb-0.5">Order</div>
                          <div className="font-mono text-text-1">{row.orderQty}</div>
                        </div>
                        <div className="w-px h-6 bg-border-main"></div>
                        <div className="text-left">
                          <div className="text-[10px] text-text-3 uppercase tracking-wider font-bold mb-0.5">Sample</div>
                          <div className="font-mono text-accent font-bold">{row.sampleSize}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-purple-500 font-black" title="Critical">{row.criticalDefect || 0}</span>
                        <span className="text-text-3">/</span>
                        <span className="text-red-500 font-bold" title="Major">{row.majorDefect || 0}</span>
                        <span className="text-text-3">/</span>
                        <span className="text-amber-500 font-bold" title="Minor">{row.minorDefect || 0}</span>
                      </div>
                      <div className="text-[10px] text-text-3 uppercase mt-1 font-bold">Total: {(row.criticalDefect || 0) + (row.majorDefect || 0) + (row.minorDefect || 0)}</div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] uppercase font-black tracking-wider ${
                        row.result === 'PASS' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        row.result === 'FAIL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {row.result}
                      </span>
                    </td>
                    <td className="p-5 text-right font-medium">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-text-2 hover:bg-accent/10 hover:text-accent rounded-lg transition-all" title="View Audit Details" onClick={() => handleNavigateToForm('view', row)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-all" title="Modify Index" onClick={() => handleNavigateToForm('edit', row)}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-2 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-lg transition-all" title="Download Print Report" onClick={(e) => exportPDF(row, e)}>
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all" title="Scrap Record" onClick={(e) => handleDelete(row.id, e)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          totalRecords={filteredInspections.length}
        />
      </motion.div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredInspections}
        columns={[
          {key: 'id', label: 'ID'}, {key: 'type', label: 'Type'}, {key: 'buyer', label: 'Buyer'},
          {key: 'style', label: 'Style'}, {key: 'order', label: 'Order'}, {key: 'line', label: 'Line'},
          {key: 'inspector', label: 'Inspector'}, {key: 'inspectionQty', label: 'Insp Qty'},
          {key: 'passQty', label: 'Pass'}, {key: 'failQty', label: 'Fail'}, {key: 'result', label: 'Result'}
        ]}
        title="Global Inspection Data"
      />
    </motion.div>
  );
}

