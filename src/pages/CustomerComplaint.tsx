import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquareOff, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Frown, Clock, User, Building, X, HelpCircle, ShieldAlert
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

interface ComplaintRecord {
  id: string;
  complaintTitle: string;
  buyer: string;
  orderNo: string;
  date: string;
  status: string;
  responsiblePerson: string;
  severity: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function CustomerComplaint({ onNavigate }: Props) {
  const [records, setRecords] = useState<ComplaintRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('customerComplaint').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.complaintTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.orderNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'All' || r.severity === filterSeverity;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [records, searchQuery, filterSeverity, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      resolved: records.filter(r => r.status === 'Resolved').length,
      critical: records.filter(r => r.severity === 'Critical' || r.severity === 'High').length,
      pending: records.filter(r => r.status === 'Open' || r.status === 'Investigating').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('customerComplaint').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Complaints");
    XLSX.writeFile(wb, "Customer_Complaints_Log.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Customer Complaint Management',
      columns: ['ID', 'Title', 'Buyer', 'Order #', 'Date', 'Status'],
      rows: filteredRecords.map(r => [r.id, r.complaintTitle, r.buyer, r.orderNo, r.date, r.status]),
      fileName: 'Customer_Complaint_Report'
    });
  };

  const handleDownloadDetail = async (record: any) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    exportDetailToPDF({
      moduleName: 'Customer Complaint Report',
      moduleId: 'complaint',
      recordId: record.id,
      fileName: `Complaint_${record.id}`,
      fields: [
        { label: 'Title', value: record.complaintTitle },
        { label: 'Buyer', value: record.buyer },
        { label: 'Order #', value: record.orderNo },
        { label: 'Date', value: record.date },
        { label: 'Severity', value: record.severity },
        { label: 'Description', value: record.description },
        { label: 'Root Cause', value: record.rootCause },
        { label: 'Corrective Action', value: record.correctiveAction },
        { label: 'Preventive Action', value: record.preventiveAction },
        { label: 'Status', value: record.status },
        { label: 'Resolved By', value: record.resolvedBy },
        { label: 'Resolution Date', value: record.resolutionDate }
      ],
      attachments: record.attachments
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <MessageSquareOff className="w-8 h-8 text-accent" />
            Customer Complaints
          </h1>
          <p className="text-text-2 text-base mt-2">Log and resolve customer feedback, quality claims, and order disputes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('customer-complaint-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> Log Complaint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Tickets', value: stats.total, icon: Frown, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'High Priority', value: stats.critical, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Open / Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            placeholder="Search tickets, buyers, orders..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Complaint Detail</th>
                <th className="p-4">Buyer & Order</th>
                <th className="p-4">Severity Level</th>
                <th className="p-4 text-center">Received Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm truncate max-w-[200px]">{r.complaintTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold text-text-1">{r.buyer}</span>
                       <span className="text-[10px] text-text-3 font-bold uppercase tracking-tighter opacity-70 mt-0.5">Order: {r.orderNo}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          r.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                          r.severity === 'High' ? 'bg-orange-500' : 
                          r.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-xs font-bold text-text-2">{r.severity}</span>
                     </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-text-2">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Open' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 text-text-2" onClick={() => handleDownloadDetail(r)} title="Download PDF">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('customer-complaint-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('customer-complaint-form', { mode: 'edit', data: r })}>
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

