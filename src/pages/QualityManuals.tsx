import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Bookmark, Clock, User, Building, X, Award, ScrollText
} from 'lucide-react';
import { getTable } from '../db/db';
import * as XLSX from 'xlsx';
import { exportTableToPDF } from '../utils/pdfExportUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface ManualRecord {
  id: string;
  manualTitle: string;
  manualType: string;
  version: string;
  department: string;
  status: string;
  responsiblePerson: string;
  lastReviewDate: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function QualityManuals({ onNavigate }: Props) {
  const [records, setRecords] = useState<ManualRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('qualityManuals').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.manualTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.manualType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'All' || r.manualType === filterType;

      return matchesSearch && matchesType;
    });
  }, [records, searchQuery, filterType]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      published: records.filter(r => r.status === 'Published').length,
      reviewDue: records.filter(r => {
        const last = new Date(r.lastReviewDate);
        const dayDiff = (new Date().getTime() - last.getTime()) / (1000 * 3600 * 24);
        return dayDiff > 365; // Over a year since last review
      }).length,
      isoCompliant: records.filter(r => r.manualType.includes('ISO')).length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('qualityManuals').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quality Manuals");
    XLSX.writeFile(wb, "Quality_Manuals_Masterlist.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Quality Manuals & Policies',
      columns: ['Title', 'Type', 'Ver', 'Dept', 'Last Review', 'Status'],
      rows: filteredRecords.map(r => [r.manualTitle, r.manualType, r.version, r.department, r.lastReviewDate, r.status]),
      fileName: 'Quality_Manuals_Report'
    });
  };

  const exportSinglePDF = async (record: ManualRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Quality Management System Manual',
      moduleId: 'quality-manual',
      recordId: record.id,
      fileName: `Manual_${record.manualTitle.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'Manual Title',       value: record.manualTitle },
        { label: 'Document Type',      value: record.manualType },
        { label: 'Version Number',     value: record.version },
        { label: 'Owning Department',  value: record.department },
        { label: 'Responsible Officer',value: record.responsiblePerson },
        { label: 'Last Periodic Review', value: record.lastReviewDate },
        { label: 'Current Status',     value: record.status },
      ]
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            Quality Manuals
          </h1>
          <p className="text-text-2 text-base mt-2">Core quality policies, ISO manuals, and high-level organizational procedures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('quality-manuals-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> Add Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Core Manuals', value: stats.total, icon: ScrollText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Published', value: stats.published, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Review Overdue', value: stats.reviewDue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'ISO Standard Docs', value: stats.isoCompliant, icon: Award, color: 'text-purple-main', bg: 'bg-purple-main/10' },
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

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search manuals, policies, standards..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Quality Manual">Quality Manual</option>
          <option value="Policy">Company Policy</option>
          <option value="ISO Standard">ISO Standard Reference</option>
          <option value="Employee Handbook">Handbooks</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Manual Title</th>
                <th className="p-4">Type & Department</th>
                <th className="p-4 text-center">Version</th>
                <th className="p-4 text-center">Last Periodic Review</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm truncate max-w-[250px]">{r.manualTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold text-text-1">{r.manualType}</span>
                       <span className="text-[10px] text-text-3 font-bold uppercase tracking-tighter opacity-70 mt-0.5">{r.department}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center px-2 py-0.5 bg-bg-3 rounded text-[10px] font-black text-text-2">
                       V{r.version}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-text-2">{new Date(r.lastReviewDate).toLocaleDateString()}</span>
                       <span className="text-[9px] text-text-3 uppercase mt-1 tracking-tighter">Verified</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('quality-manuals-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('quality-manuals-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 hover:text-indigo-500 text-text-2" title="Download PDF" onClick={() => exportSinglePDF(r)}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center ml-auto group-hover:hidden">
                      <ChevronRight className="w-4 h-4 text-text-3 opacity-30" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
