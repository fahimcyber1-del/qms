import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SearchCode, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Binoculars, Clock, User, Building, X, Microscope, Activity, Layers
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

interface RCARecord {
  id: string;
  problemTitle: string;
  sourceModule: string;
  referenceId: string;
  department: string;
  responsiblePerson: string;
  analysisMethod: string;
  status: string;
  date: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function RootCauseAnalysis({ onNavigate }: Props) {
  const [records, setRecords] = useState<RCARecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('rootCauseAnalysis').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = filterSource === 'All' || r.sourceModule === filterSource;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [records, searchQuery, filterSource, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      fiveWhy: records.filter(r => r.analysisMethod === '5 Why').length,
      fishbone: records.filter(r => r.analysisMethod === 'Fishbone').length,
      open: records.filter(r => r.status === 'Open').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('rootCauseAnalysis').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RCA Records");
    XLSX.writeFile(wb, "RCA_Records_Report.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Root Cause Analysis (RCA)',
      columns: ['ID', 'Problem Title', 'Source', 'Ref ID', 'Method', 'Status'],
      rows: filteredRecords.map(r => [r.id, r.problemTitle, r.sourceModule, r.referenceId, r.analysisMethod, r.status]),
      fileName: 'RCA_Management_Report'
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <SearchCode className="w-8 h-8 text-accent" />
            Root Cause Analysis (RCA)
          </h1>
          <p className="text-text-2 text-base mt-2">Deep-dive analysis of recurring problems and critical failures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('root-cause-analysis-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Investigation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Analyses', value: stats.total, icon: Binoculars, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: '5-Why Utilized', value: stats.fiveWhy, icon: Activity, color: 'text-purple-main', bg: 'bg-purple-main/10' },
          { label: 'Fishbone Charts', value: stats.fishbone, icon: Layers, color: 'text-sky-500', bg: 'bg-sky-500/10' },
          { label: 'Open Investigations', value: stats.open, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            placeholder="Search problems, reference IDs..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
          <option value="All">All Sources</option>
          <option value="NCR">NCR</option>
          <option value="CAPA">CAPA</option>
          <option value="Audit">Audit Findings</option>
          <option value="Customer">Customer Complaint</option>
        </select>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Problem Summary</th>
                <th className="p-4">Source & Reference</th>
                <th className="p-4">Methodology</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm truncate max-w-[300px]">{r.problemTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id} • {r.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                        r.sourceModule === 'NCR' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                        r.sourceModule === 'CAPA' ? 'bg-purple-main/10 text-purple-main border border-purple-main/20' :
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {r.sourceModule}
                      </span>
                      <span className="text-xs font-bold text-text-2">{r.referenceId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-bg-3 flex items-center justify-center text-text-1">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-text-1">{r.analysisMethod}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-text-2">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('root-cause-analysis-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('root-cause-analysis-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
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
