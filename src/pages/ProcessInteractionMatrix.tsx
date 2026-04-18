import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Workflow, Clock, User, Building, X, GitPullRequest, Share2
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

interface MatrixRecord {
  id: string;
  processName: string;
  inputSource: string;
  outputReceiver: string;
  department: string;
  owner: string;
  criticality: string;
  status: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function ProcessInteractionMatrix({ onNavigate }: Props) {
  const [records, setRecords] = useState<MatrixRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('processInteractionMatrix').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.processName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.inputSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.outputReceiver.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = filterDept === 'All' || r.department === filterDept;

      return matchesSearch && matchesDept;
    });
  }, [records, searchQuery, filterDept]);

  const stats = useMemo(() => {
    return {
      totalProcesses: records.length,
      highCriticality: records.filter(r => r.criticality === 'High' || r.criticality === 'Critical').length,
      integrated: records.filter(r => r.status === 'Integrated' || r.status === 'Active').length,
      mapped: records.length // Simplified for UX
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('processInteractionMatrix').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Process Matrix");
    XLSX.writeFile(wb, "Process_Interaction_Matrix.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Process Interaction Matrix (ISO 9001:2015)',
      columns: ['Process Name', 'Input Source', 'Output Receiver', 'Dept', 'Criticality', 'Status'],
      rows: filteredRecords.map(r => [r.processName, r.inputSource, r.outputReceiver, r.department, r.criticality, r.status]),
      fileName: 'Process_Interaction_Matrix_Report'
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Network className="w-8 h-8 text-accent" />
            Process Interaction Matrix
          </h1>
          <p className="text-text-2 text-base mt-2">Map the flow of inputs and outputs between departmental processes for ISO compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('process-interaction-matrix-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Mapping
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Mapped Processes', value: stats.totalProcesses, icon: Workflow, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'High Priority Flows', value: stats.highCriticality, icon: GitPullRequest, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Active Interactions', value: stats.integrated, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Data Nodes', value: stats.totalProcesses * 2, icon: Share2, color: 'text-purple-main', bg: 'bg-purple-main/10' },
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
            placeholder="Search processes, sources, receivers..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="All">All Departments</option>
          <option value="Quality">Quality</option>
          <option value="Production">Production</option>
          <option value="Management">Management</option>
          <option value="SCM">SCM / Logistics</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Process Hierarchy</th>
                <th className="p-4">Input Definition</th>
                <th className="p-4">Output Definition</th>
                <th className="p-4 text-center">Criticality</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.processName}</div>
                    <div className="text-[10px] text-text-3 mt-1 font-bold uppercase tracking-tighter opacity-70 italic">{r.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                       <span className="text-xs font-semibold text-text-1">{r.inputSource}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-shadow)]" />
                        <span className="text-xs font-semibold text-text-1">{r.outputReceiver}</span>
                     </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      r.criticality === 'Critical' ? 'text-red-500' : 
                      r.criticality === 'High' ? 'text-orange-500' : 'text-text-3'
                    }`}>
                      {r.criticality}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Integrated' || r.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-purple-main/10 text-purple-main border-purple-main/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('process-interaction-matrix-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('process-interaction-matrix-form', { mode: 'edit', data: r })}>
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
