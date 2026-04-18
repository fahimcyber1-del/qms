import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, TrendingUp, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, BarChart3, Clock, User, Building, X
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

interface QualityGoalRecord {
  id: string;
  goalTitle: string;
  category: string;
  department: string;
  responsiblePerson: string;
  targetValue: number;
  actualValue: number;
  uom: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  description?: string;
  attachments?: string[];
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function QualityGoals({ onNavigate }: Props) {
  const [records, setRecords] = useState<QualityGoalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const normalizeRecord = (record: Partial<QualityGoalRecord> & Record<string, any>): QualityGoalRecord => ({
    id: record.id || `GOAL-${Date.now()}`,
    goalTitle: record.goalTitle || record.title || 'Untitled Goal',
    category: record.category || 'Product Quality',
    department: record.department || 'Quality',
    responsiblePerson: record.responsiblePerson || 'Unassigned',
    targetValue: Number(record.targetValue ?? 0),
    actualValue: Number(record.actualValue ?? record.currentValue ?? 0),
    uom: record.uom || '%',
    startDate: record.startDate || record.date || new Date().toISOString().split('T')[0],
    endDate: record.endDate || record.deadline || record.date || new Date().toISOString().split('T')[0],
    status: record.status || 'In Progress',
    createdAt: record.createdAt || new Date().toISOString(),
    description: record.description || record.actionPlan || '',
    attachments: Array.isArray(record.attachments) ? record.attachments : []
  });

  useEffect(() => {
    const load = async () => {
      const data = await getTable('qualityGoals').toArray();
      setRecords((data as any[]).map(normalizeRecord));
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const goalTitle = (r.goalTitle || '').toLowerCase();
      const department = (r.department || '').toLowerCase();
      const responsiblePerson = (r.responsiblePerson || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        goalTitle.includes(query) ||
        department.includes(query) ||
        responsiblePerson.includes(query);
      
      const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [records, searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      achieved: records.filter(r => r.status === 'Achieved').length,
      inProgress: records.filter(r => r.status === 'In Progress').length,
      overdue: records.filter(r => r.status === 'Not Achieved').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('qualityGoals').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quality Goals");
    XLSX.writeFile(wb, "Quality_Goals_Report.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Quality Goals',
      columns: ['ID', 'Title', 'Dept', 'Target', 'Actual', 'Status'],
      rows: filteredRecords.map(r => [r.id, r.goalTitle, r.department, r.targetValue.toString(), r.actualValue.toString(), r.status]),
      fileName: 'Quality_Goals_Report'
    });
  };

  const getProgressPercent = (record: QualityGoalRecord) => {
    if (!record.targetValue) return 0;
    return (record.actualValue / record.targetValue) * 100;
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Target className="w-8 h-8 text-accent" />
            Quality Goals
          </h1>
          <p className="text-text-2 text-base mt-2">Strategic quality objectives and performance tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('quality-goals-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Goals', value: stats.total, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Achieved', value: stats.achieved, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Not Achieved', value: stats.overdue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            placeholder="Search goals, departments..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Product Quality">Product Quality</option>
          <option value="Process Efficiency">Process Efficiency</option>
          <option value="Customer Satisfaction">Customer Satisfaction</option>
        </select>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Achieved">Achieved</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Achieved">Not Achieved</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Goal Detail</th>
                <th className="p-4">Department</th>
                <th className="p-4">Target vs Actual</th>
                <th className="p-4">Timeline</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.goalTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id} • {r.category}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Building className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="text-sm font-semibold text-text-1">{r.department}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-text-3">Progress</span>
                        <span className="text-accent">{getProgressPercent(r).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-3 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(getProgressPercent(r), 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-text-2 font-medium">
                        {r.actualValue} / {r.targetValue} {r.uom}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-text-2">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-xs font-semibold">{new Date(r.endDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Achieved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('quality-goals-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('quality-goals-form', { mode: 'edit', data: r })}>
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
