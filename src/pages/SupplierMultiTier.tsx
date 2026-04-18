import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Factory, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Network, Clock, User, Building, X, MapPin, BarChart3
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

interface SupplierRecord {
  id: string;
  supplierName: string;
  process: string;
  location: string;
  contactPerson: string;
  phone: string;
  status: string;
  score: number;
  source: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function SupplierMultiTier({ onNavigate }: Props) {
  const [records, setRecords] = useState<SupplierRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('subSupplierManagement').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.process.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      active: records.filter(r => r.status === 'Active').length,
      highPerformance: records.filter(r => r.score >= 80).length,
      critical: records.filter(r => r.score < 50 && r.score > 0).length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('subSupplierManagement').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sub Suppliers");
    XLSX.writeFile(wb, "Tier2_Supplier_Masterlist.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Supplier Multi-Tier Management',
      columns: ['ID', 'Supplier', 'Process', 'Source', 'Score', 'Status'],
      rows: filteredRecords.map(r => [r.id, r.supplierName, r.process, r.source, `${r.score}%`, r.status]),
      fileName: 'Supplier_MultiTier_Report'
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Network className="w-8 h-8 text-accent" />
            Supplier Multi-Tier Management
          </h1>
          <p className="text-text-2 text-base mt-2">Tier-2 supplier identification, verification, and performance scoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('supplier-multi-tier-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Partners', value: stats.total, icon: Factory, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Status', value: stats.active, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Top Scored (80%+)', value: stats.highPerformance, icon: BarChart3, color: 'text-purple-main', bg: 'bg-purple-main/10' },
          { label: 'Critical / Low Score', value: stats.critical, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
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
            placeholder="Search by supplier, process, or source..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending Approval">Pending</option>
          <option value="Blacklisted">Blacklisted</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Partner Identification</th>
                <th className="p-4">Process / Specialty</th>
                <th className="p-4">Compliance Score</th>
                <th className="p-4">Source Origin</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm truncate max-w-[200px]">{r.supplierName}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 rounded bg-bg-3 flex items-center justify-center">
                          <Activity className="w-3.5 h-3.5 text-text-2" />
                       </div>
                       <span className="text-sm font-semibold text-text-1">{r.process}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 min-w-[100px]">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                         <span className="text-text-3">Integrity</span>
                         <span className={r.score >= 80 ? 'text-green-500' : r.score >= 50 ? 'text-amber-500' : 'text-red-500'}>{r.score}%</span>
                      </div>
                      <div className="w-full h-1 bg-bg-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${r.score >= 80 ? 'bg-green-500' : r.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-text-2 uppercase">
                    {r.source}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Blacklisted' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('supplier-multi-tier-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('supplier-multi-tier-form', { mode: 'edit', data: r })}>
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

// Fixed import from lucide in the code block
import { Activity } from 'lucide-react';
